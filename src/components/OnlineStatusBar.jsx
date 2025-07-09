import style from "./OnlineStatusBar.module.css"

function OnlineStatusBar({ onlineCount, onShowManual }) {
  return (
    <div className={style.online_status_bar}>
      <span id="onlineCount">
        当前在线人数: {onlineCount}
      </span>

      <a href="#" id="userManualLink" className={style.manual_link} onClick={(e) => { e.preventDefault(); onShowManual(); }}>
        用户手册
      </a>
    </div>
  );
}

export default OnlineStatusBar;