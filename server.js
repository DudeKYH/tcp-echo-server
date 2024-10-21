import net from 'net';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    console.log(data);
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
