import { useEffect, useRef } from 'react';
import MessageEntry from './MessageEntry';

import style from './ChatBox.module.css';

function ChatBox({ messages }) {
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div id="chat" className={style.chat_box} ref={chatBoxRef}>
      {messages.map((msg, index) => (
        <MessageEntry key={msg.id || `${msg.senderId}-${msg.time}-${index}`} message={msg} />
      ))}
    </div>
  );
}

export default ChatBox;