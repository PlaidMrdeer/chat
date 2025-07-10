import { useState } from 'react';
import style from './ChatInput.module.css';

function ChatInput({ onSendMessage, onSendFile }) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      Array.from(files).forEach(onSendFile);
    }
  };

  return (
    <form className={style.chat_input} onSubmit={handleSubmit}>
      <div className={style.input_wrapper}>
        <input
          type="text"
          placeholder="输入消息..."
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <label htmlFor="file-upload" className={style.plus_button}>+</label>
        <input
          id="file-upload"
          type="file"
          hidden
          multiple
          onChange={handleFileSelect}
        />
      </div>
      <button type="submit">发送</button>
    </form>
  );
}

export default ChatInput;
