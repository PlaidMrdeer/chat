import style from "./MessageEntry.module.css";

function MessageEntry({ message, onImageLoad }) {
  const { senderId, text, time, isSelf, fileUrl, fileType, fileName, status, progress } = message;

  const senderColor = getColorFromId(senderId);
  const isTransferring = (status === 'uploading' || status === 'downloading') && progress < 100;

  return (
    <div
      className={`${style.message_entry} ${isSelf ? style.self_entry : style.other_entry
        }`}
    >
      {isSelf && <div className={style.you_label}>You</div>}

      {!isSelf && (
        <div className={style.sender_id} style={{ color: senderColor }}>
          {senderId}
        </div>
      )}

      <div
        className={`${style.message_bubble} ${isSelf ? style.self_bubble_style : style.other_bubble_style
          }`}
      >
        {fileUrl || fileName ? (
          <div className={style.file_container}>
            {fileType?.startsWith("image/") && fileUrl ? (
              <img
                src={fileUrl}
                alt={fileName}
                className={style.image_preview}
                // Add the onLoad event handler to the img tag
                onLoad={onImageLoad}
              />
            ) : (
              <a href={fileUrl} download={fileName} className={style.file_link} style={{ pointerEvents: isTransferring ? 'none' : 'auto' }}>
                📎 {fileName}
              </a>
            )}

            {isTransferring && (
              <div className={style.progress_container}>
                <div className={style.progress_text}>
                  {status === 'uploading' ? '上传中...' : '下载中...'} {progress}%
                </div>
                <div className={style.progress_bar_background}>
                  <div className={style.progress_bar_foreground} style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span>{text}</span>
        )}
      </div>

      <div className={style.time}>{new Date(time).toLocaleTimeString()}</div>
    </div>
  );
}

function getColorFromId(id) {
  if (!id) return 'hsl(0, 0%, 50%)'; // Return a default color if id is null/undefined
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

export default MessageEntry;