// src/components/OnlineStatusBar.jsx

import style from "./OnlineStatusBar.module.css";
import useMediaQuery from "./hooks/useMediaQuery";
import HamburgerButton from "./HamburgerButton";

// 接收一个新的 prop: onToggleSidebar
function OnlineStatusBar({ onlineCount, onShowManual, onShowPurchase, onToggleSidebar }) {
  // 当屏幕宽度小于等于 600px 时，isMobile 为 true
  const isMobile = useMediaQuery('(max-width: 600px)');

  return (
    <div className={style.online_status_bar}>
      <span id="onlineCount">
        当前在线人数: {onlineCount}
      </span>

      {/* 根据 isMobile 决定显示汉堡按钮还是完整链接 */}
      {isMobile ? (
        <HamburgerButton onClick={onToggleSidebar} />
      ) : (
        <div className={style.links_container}>
          <a href="#" className={style.purchase_link} onClick={(e) => { e.preventDefault(); onShowPurchase(); }}>
            购买令牌
          </a>
          <a href="#" className={style.manual_link} onClick={(e) => { e.preventDefault(); onShowManual(); }}>
            用户手册（务必查看，避免您在不知情的情况下被封禁）
          </a>
        </div>
      )}
    </div>
  );
}

export default OnlineStatusBar;