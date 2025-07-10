import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import OnlineStatusBar from "./components/OnlineStatusBar";
import UserManualModal from "./components/UserManualModal";
import ImageViewer from "./components/ImageViewer"; // <--- 新增: 引入图片查看器

import style from "./App.module.css";

// --- 配置常量 ---
const SOCKET_SERVER_URL = "http://localhost:3000";
const CHUNK_SIZE = 256 * 1024;

function App() {
  // --- State Hooks ---
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [zoomedImageUrl, setZoomedImageUrl] = useState(null); // <--- 新增: 用于存储放大图片的URL
  // eslint-disable-next-line no-unused-vars
  const [incomingFiles, setIncomingFiles] = useState({});

  // --- Ref Hooks ---
  const messageSoundRef = useRef(null);

  // --- Effects ---
  // useEffect 钩子内的所有代码保持不变，这里省略以保持简洁...
  useEffect(() => {
    messageSoundRef.current = document.getElementById("messageSound");
    const newSocket = io(SOCKET_SERVER_URL, { withCredentials: true });
    setSocket(newSocket);
    // ... 所有 socket.on(...) 监听器都保持原样 ...
    newSocket.on("connect", () => {
      console.log("连接成功，ID:", newSocket.id);
      setCurrentUserId(newSocket.id);
    });
    newSocket.on("chat message", (msg) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          ...msg,
          isSelf: msg.senderId === newSocket.id,
          id: `${msg.senderId}-${msg.time}-${Math.random()}`,
        },
      ]);
      if (messageSoundRef.current && msg.senderId !== newSocket.id) {
        messageSoundRef.current.play().catch(console.warn);
      }
    });
    newSocket.on("user count", (count) => setOnlineCount(count));
    newSocket.on("disconnect", (reason) => console.log("已断开连接:", reason));
    newSocket.on("file-start", ({ id, name, type, size, senderId }) => {
      setIncomingFiles((prev) => ({
        ...prev,
        [id]: { id, name, type, size, senderId, chunks: [], receivedSize: 0 },
      }));
      setMessages((prev) => [
        ...prev,
        {
          id,
          senderId,
          fileName: name,
          fileType: type,
          time: Date.now(),
          isSelf: false,
          status: "downloading",
          progress: 0,
        },
      ]);
    });
    newSocket.on("file-chunk", ({ id, chunk }) => {
      setIncomingFiles((prev) => {
        const file = prev[id];
        if (!file) return prev;
        file.chunks.push(chunk);
        file.receivedSize += chunk.byteLength;
        const progress = Math.round((file.receivedSize / file.size) * 100);
        setMessages((msgs) =>
          msgs.map((msg) =>
            msg.id === id ? { ...msg, progress: progress } : msg
          )
        );
        return { ...prev, [id]: file };
      });
    });
    newSocket.on("file-end", ({ id }) => {
      setIncomingFiles((prevIncomingFiles) => {
        const fileData = prevIncomingFiles[id];
        if (!fileData) {
          return prevIncomingFiles;
        }
        if (fileData.receivedSize !== fileData.size) {
          setMessages((msgs) =>
            msgs.map((msg) =>
              msg.id === id ? { ...msg, status: "error", progress: 0 } : msg
            )
          );
        } else {
          const fileBlob = new Blob(fileData.chunks, { type: fileData.type });
          const fileUrl = URL.createObjectURL(fileBlob);
          setMessages((msgs) =>
            msgs.map((msg) =>
              msg.id === id
                ? { ...msg, fileUrl, status: "complete", progress: 100 }
                : msg
            )
          );
          if (messageSoundRef.current) {
            messageSoundRef.current.play().catch(console.warn);
          }
        }
        const { [id]: _, ...rest } = prevIncomingFiles;
        return rest;
      });
    });
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // --- 事件处理函数 ---
  const handleSendMessage = (text) => {
    if (socket && text.trim()) {
      const messageData = {
        senderId: currentUserId,
        text: text,
        time: Date.now(),
      };
      socket.emit("chat message", messageData);
    }
  };

  const handleSendFile = (file) => {
    if (!socket || !file || !currentUserId) return;
    const fileId = `${currentUserId}-${file.name}-${Date.now()}`;
    const localFileUrl = URL.createObjectURL(file);
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: fileId,
        senderId: currentUserId,
        fileUrl: localFileUrl,
        fileName: file.name,
        fileType: file.type,
        time: Date.now(),
        isSelf: true,
        status: "uploading",
        progress: 0,
      },
    ]);
    socket.emit("file-start", {
      id: fileId,
      name: file.name,
      type: file.type,
      size: file.size,
      senderId: currentUserId,
    });
    const reader = new FileReader();
    let offset = 0;
    reader.onload = (e) => {
      if (!e.target.result) return;
      socket.emit("file-chunk", { id: fileId, chunk: e.target.result });
      offset += e.target.result.byteLength;
      const progress = Math.round((offset / file.size) * 100);
      setMessages((msgs) =>
        msgs.map((msg) => (msg.id === fileId ? { ...msg, progress } : msg))
      );
      if (offset < file.size) {
        readNextChunk();
      } else {
        socket.emit("file-end", { id: fileId });
        setMessages((msgs) =>
          msgs.map((msg) =>
            msg.id === fileId
              ? { ...msg, status: "complete", progress: 100 }
              : msg
          )
        );
      }
    };
    const readNextChunk = () => {
      const slice = file.slice(offset, offset + CHUNK_SIZE);
      reader.readAsArrayBuffer(slice);
    };
    readNextChunk();
  };

  const toggleUserManualModal = () => setIsManualModalOpen(!isManualModalOpen);

  // <--- 新增: 处理图片放大的函数 ---
  const handleImageZoom = (url) => {
    if (url) {
      setZoomedImageUrl(url);
    }
  };

  // <--- 新增: 处理关闭图片放大的函数 ---
  const handleCloseZoom = () => {
    setZoomedImageUrl(null);
  };

  // --- JSX 渲染 ---
  return (
    <>
      <div className={style.chat_container}>
        {/* <--- 修改: 传递 onImageZoom prop ---> */}
        <ChatBox messages={messages} onImageZoom={handleImageZoom} />
        <ChatInput
          onSendMessage={handleSendMessage}
          onSendFile={handleSendFile}
        />
      </div>
      <OnlineStatusBar
        onlineCount={onlineCount}
        onShowManual={toggleUserManualModal}
      />
      <UserManualModal
        isOpen={isManualModalOpen}
        onClose={toggleUserManualModal}
      />

      {/* <--- 新增: 条件渲染图片查看器 ---> */}
      {zoomedImageUrl && (
        <ImageViewer imageUrl={zoomedImageUrl} onClose={handleCloseZoom} />
      )}

      <audio
        id="messageSound"
        src="/sounds/arpeggio-467.mp3"
        preload="auto"
      ></audio>
    </>
  );
}

export default App;
