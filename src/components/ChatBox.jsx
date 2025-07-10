import { useEffect, useRef } from 'react';
import MessageEntry from './MessageEntry';
import style from './ChatBox.module.css';

// <--- 修改: 接收 onImageZoom prop --->
function ChatBox({ messages, onImageZoom }) {
  const chatBoxRef = useRef(null);

  // Create a function to scroll to the bottom
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    // Scroll to bottom every time the messages array changes
    scrollToBottom();
  }, [messages]);

  return (
    <div id="chat" className={style.chat_box} ref={chatBoxRef}>
      {messages.map((msg, index) => (
        <MessageEntry
          key={msg.id || `${msg.senderId}-${msg.time}-${index}`}
          message={msg}
          // Pass the scroll function as a prop
          onImageLoad={scrollToBottom} 
          // <--- 修改: 将 onImageZoom prop 传递给 MessageEntry --->
          onImageZoom={onImageZoom}
        />
      ))}
    </div>
  );
}

export default ChatBox;