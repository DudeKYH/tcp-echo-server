import net from 'net';
import { writeHeader, readHeader } from './utils.js';
import { TOTAL_LENGTH_SIZE, HANDLER_ID } from './constants.js';

const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to ther server...');

  const message = 'Hello';
  const buffer = Buffer.from(message);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);

  client.write(packet);
});

client.on('data', (data) => {
  const buffer = Buffer.from(data);

  const { length, handlerId } = readHeader(buffer);
  console.log(length, handlerId);
  console.log(data);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  const message = buffer.subarray(headerSize);
  console.log(`server 에게 받은 메세지: ${message.toString()}`);
});

client.on('close', () => {
  console.log(`Connection closed`);
});

client.on('error', (err) => {
  console.log(`Socket error, ${err}`);
});
