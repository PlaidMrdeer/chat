// src/components/HamburgerButton.jsx

import style from './HamburgerButton.module.css';

function HamburgerButton({ onClick }) {
  return (
    <button className={style.hamburger_button} onClick={onClick} aria-label="打开菜单">
      ☰
    </button>
  );
}

export default HamburgerButton;