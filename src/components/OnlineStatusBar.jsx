import style from "./OnlineStatusBar.module.css"

function OnlineStatusBar({ onlineCount, onShowManual, onShowPurchase }) {
  return (
    <div className={style.online_status_bar}>
      <span id="onlineCount">
        当前在线人数: {onlineCount}
      </span>

      <a href="#" className={style.purchase_link} onClick={(e) => { e.preventDefault(); onShowPurchase(); }}>
        购买令牌
      </a>

      <a href="#" className={style.manual_link} onClick={(e) => { e.preventDefault(); onShowManual(); }}>
        用户手册（务必查看，避免您在不知情的情况下被封禁）
      </a>
    </div>
  );
}

export default OnlineStatusBar;