function OnlineStatusBar({ onlineCount, onShowManual }) {
  return (
    <div className="online-status-bar">
      <span className="online-count-text" id="onlineCount">
        当前在线人数: {onlineCount}
      </span>
      <a href="#" id="userManualLink" className="manual-link" onClick={(e) => { e.preventDefault(); onShowManual(); }}>
        用户手册
      </a>
    </div>
  );
}

export default OnlineStatusBar;