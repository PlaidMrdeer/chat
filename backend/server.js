const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
// const cors = require('cors');

const app = express();
const server = http.createServer(app);

// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true,
// }));

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

const io = new Server(server, {
  cors: {
    origin: "https://yunoun.eu.org", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers = 0;

function getTime() {
  return new Date().toISOString().replace("T", " ").split(".")[0];
}

io.on('connection', (socket) => {
  console.log(`[${getTime()}] 新连接: ${socket.id}`);
  onlineUsers++;
  io.emit('user count', onlineUsers);

  socket.on('disconnect', () => {
    console.log(`[${getTime()}] 断开连接: ${socket.id}`);
    onlineUsers = Math.max(0, onlineUsers - 1);
    io.emit('user count', onlineUsers);
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('file-start', (data) => {
    // 直接广播给除发送者外的所有客户端
    socket.broadcast.emit('file-start', data);
  });

  // 监听并广播文件数据块
  socket.on('file-chunk', (data) => {
    // 直接广播
    socket.broadcast.emit('file-chunk', data);
  });

  // 监听并广播文件结束信号
  socket.on('file-end', (data) => {
    // 直接广播
    socket.broadcast.emit('file-end', data);
  });
});

const PORT = 3000;
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[${getTime()}] 后端服务已启动: http://127.0.0.1:${PORT}`);
});
