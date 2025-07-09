import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import ChatBox from "./components/ChatBox";
import ChatInput from "./components/ChatInput";
import OnlineStatusBar from "./components/OnlineStatusBar";
import UserManualModal from "./components/UserManualModal";

import style from "./App.module.css";

const SOCKET_SERVER_URL = "http://localhost:3000";

function App() {
  const [messages, setMessages] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [socket, setSocket] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const messageSoundRef = useRef(null);

  useEffect(() => {
    messageSoundRef.current = document.getElementById("messageSound");

    const newSocket = io(SOCKET_SERVER_URL, {
      withCredentials: true
    });

    // const newSocket = io();
    setSocket(newSocket);

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
        messageSoundRef.current.play().catch((error) => {
          console.warn("音频播放失败:", error);
        });
      }
    });

    newSocket.on("user count", (count) => {
      setOnlineCount(count);
    });

    newSocket.on("disconnect", () => {
      console.log("已断开连接");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

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

  const toggleUserManualModal = () => {
    setIsManualModalOpen(!isManualModalOpen);
  };

  return (
    <>
      <div className={style.chat_container}>
        <ChatBox messages={messages} />
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
      <OnlineStatusBar onlineCount={onlineCount} onShowManual={toggleUserManualModal} />
      <UserManualModal isOpen={isManualModalOpen} onClose={toggleUserManualModal} />
      <audio id="messageSound" src="/sounds/arpeggio-467.mp3" preload="auto"></audio>
    </>
  );
}

export default App;
