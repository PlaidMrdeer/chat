// src/components/Sidebar.jsx

import style from './Sidebar.module.css';

function Sidebar({ isOpen, onClose, onShowPurchase, onShowManual }) {
  // 当点击链接时，先执行操作，再关闭侧边栏
  const handlePurchaseClick = (e) => {
    e.preventDefault();
    onShowPurchase();
    onClose();
  };

  const handleManualClick = (e) => {
    e.preventDefault();
    onShowManual();
    onClose();
  };

  // 通过 isOpen 的值来决定是否添加 'open' 类
  const sidebarClass = isOpen ? `${style.sidebar} ${style.open}` : style.sidebar;

  return (
    <>
      {/* 点击遮罩层时关闭侧边栏 */}
      <div className={style.overlay} style={{ display: isOpen ? 'block' : 'none' }} onClick={onClose} />
      
      <div className={sidebarClass}>
        <div className={style.sidebar_header}>
          <h3>菜单</h3>
          <button className={style.close_button} onClick={onClose}>×</button>
        </div>
        <nav className={style.sidebar_nav}>
          <a href="#" className={style.sidebar_link} onClick={handlePurchaseClick}>
            购买令牌
          </a>
          <a href="#" className={style.sidebar_link} onClick={handleManualClick}>
            用户手册（务必查看，避免您在不知情的情况下被封禁）
          </a>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;