import { useState } from 'react';
import style from './ChatInput.module.css';


function ChatInput({ onSendMessage }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form id="form" className={style.chat_input} onSubmit={handleSubmit}>
      <input
        id="input"
        type="text"
        placeholder="输入消息..."
        autoComplete="off"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">发送</button>
    </form>
  );
}

export default ChatInput;