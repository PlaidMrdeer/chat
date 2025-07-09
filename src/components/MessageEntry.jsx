import style from './MessageEntry.module.css';


function MessageEntry({ message }) {
  const { senderId, text, time, isSelf } = message;

  // 生成颜色
  const senderColor = getColorFromId(senderId);

  return (
    <div className={`${style.message_entry} ${isSelf ? style.self_entry : style.other_entry}`}>
      {isSelf && (
        <div className={style.you_label}>You</div>
      )}

      {!isSelf && (
        <div className={style.sender_id} style={{ color : senderColor }}>
          {senderId}
        </div>
      )}

      <div className={`${style.message_bubble} ${isSelf ? style.self_bubble_style : style.other_bubble_style}`}>
        {text}
      </div>

      <div className={style.time}>{new Date(time).toLocaleTimeString()}</div>
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
