import net from 'net';

const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to ther server...');
});

client.on('data', () => {
  console.log(data);
});

client.on('end', () => {
  console.log(`Client disconnected: ${socket.remoteAddress}:${socket.remotePort}`);
});

client.on('error', (err) => {
  console.log(`Socket error, ${err}`);
});
