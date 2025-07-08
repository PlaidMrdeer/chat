const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const FRONTEND_ORIGIN = "http://localhost:5173";
app.use(cors({
  origin: FRONTEND_ORIGIN,
  methods: ["GET", "POST"],
  credentials: true
}));
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true
  }
});


// const io = new Server(server);

function getTime() {
  const now = new Date();
  const Y = now.getFullYear();
  const M = String(now.getMonth() + 1).padStart(2, '0');
  const D = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${Y}-${M}-${D} ${h}:${m}:${s}`;
}

let onlineUsers = 0;

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
    console.log(`[${getTime()}] 来自 ${msg.senderId || socket.id} 的消息: ${msg.text}`);
    io.emit('chat message', {
      text: msg.text,
      time: msg.time || Date.now(),
      senderId: msg.senderId || socket.id,
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`[${getTime()}] 后端服务已启动: http://localhost:${PORT}`);
});
