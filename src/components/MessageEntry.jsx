function MessageEntry({ message }) {
  const { senderId, text, time, isSelf } = message;

  // 生成颜色
  const senderColor = getColorFromId(senderId);

  return (
    <div className={`message-entry ${isSelf ? 'self-entry' : 'other-entry'}`}>
      {isSelf && (
        <div className="you-label">You</div>
      )}
      {!isSelf && (
        <div className="sender-id" style={{ color: senderColor }}>
          {senderId}
        </div>
      )}
      <div className={`message-bubble ${isSelf ? 'self-bubble-style' : 'other-bubble-style'}`}>
        {text}
      </div>
      <div className="time">{new Date(time).toLocaleTimeString()}</div>
    </div>

  );
}

function getColorFromId(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default MessageEntry;
