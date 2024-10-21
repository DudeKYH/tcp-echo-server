import net from 'net';
import { readHeader, writeHeader } from './utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  // Buffer : Byte 배열
  // 8비트(1바이트) 단위의 데이터 배열 (0~255)
  socket.on('data', (data) => {
    const buffer = Buffer.from(data);

    const { length, handlerId } = readHeader(data);
    console.log(length, handlerId);

    if (length > MAX_MESSAGE_LENGTH) {
      console.error(`Error: Message length ${length}`);
      socket.write(`Error: Message too long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    if (!handler) {
      console.error(`Error: No handler found for ID ${handlerId}`);
      socket.write(`Error: Invalid handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
    const message = buffer.subarray(headerSize);

    console.log(`client에게 받은 메세지: ${message.toString()}`);

    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);

    const header = writeHeader(responseBuffer.length, handlerId);
    const packet = Buffer.concat([header, responseBuffer]);

    socket.write(packet);
  });

  // 정상 종료 : Fin Flag가 왔을 때
  socket.on('end', () => {
    console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  // 에러 발생 이후, 바로 close() 호출이 된다.
  socket.on('error', (err) => {
    console.log(`Socket error, ${err}`);
  });
});

server.listen(PORT, () => {
  console.log(`Echo Server listening on port ${PORT}`);
  console.log(server.address());
});
