const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const crypto = require('crypto'); // 引入 Node.js 内置的加密库

const app = express();
const server = http.createServer(app);

// --- 新增: 配置 CORS 中间件 ---
// 这对于让你的前端 (yunoun.eu.org) 调用后端的 API 至关重要
app.use(cors({
  origin: ["https://yunoun.eu.org", "http://localhost:5173"], // 允许你的线上和本地前端访问
  credentials: true,
}));

const io = new Server(server, {
  cors: {
    origin: ["https://yunoun.eu.org", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// --- 新增: 存储待支付备注的逻辑 ---
// 使用 Map 临时存储，Key是备注，Value是过期时间
// 注意：在生产环境中，强烈建议使用 Redis 并设置 TTL (过期时间) 来代替内存中的 Map
const pendingMemos = new Map();


// --- 新增: 创建 API 端点以获取支付详情 ---
app.get('/api/get-payment-details', (req, res) => {
  // 1. 生成唯一的备注 (Memo)
  const prefix = 'YUNOUN-CHAT-'; // 一个固定的前缀，便于识别
  const randomPart = crypto.randomBytes(8).toString('hex'); // 生成8个随机字节，转为16个十六进制字符
  const uniqueMemo = prefix + randomPart;

  // 2. 设置5分钟的过期时间
  const expiresAt = Date.now() + 5 * 60 * 1000;
  pendingMemos.set(uniqueMemo, { expiresAt });

  console.log(`[API] 生成新的支付任务, 备注: ${uniqueMemo}`);

  // 3. 将支付所需信息返回给前端
  res.json({
    recipientAddress: '0x507B556d0047369b9A037274c2574b9F734BDB24', // 你的收款地址
    amount: '1.0', // 需要支付的金额
    currency: 'USDT',
    memo: uniqueMemo, // **最重要的部分：原始备注字符串**
  });
});


// --- 原有的 Socket.IO 逻辑保持不变 ---
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
    const messageToSend = {
      senderId: socket.id,
      text: msg.text,
      time: Date.now()
    }
    io.emit('chat message', messageToSend);
  });

  socket.on('file-start', (data) => {
    socket.broadcast.emit('file-start', data);
  });

  socket.on('file-chunk', (data) => {
    socket.broadcast.emit('file-chunk', data);
  });

  socket.on('file-end', (data) => {
    socket.broadcast.emit('file-end', data);
  });
});

const PORT = 3000;
// 注意：为了能被外部访问，监听地址从 '127.0.0.1' 改为 '0.0.0.0'
server.listen(PORT, '127.0.0.1', () => {
  console.log(`[${getTime()}] 后端服务已启动: 监听端口 ${PORT}`);
});