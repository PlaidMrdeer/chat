import style from './ImageViewer.module.css';

function ImageViewer({ imageUrl, onClose }) {
  // 点击背景时也关闭
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={style.overlay} onClick={handleBackgroundClick}>
      <span className={style.close_button} onClick={onClose}>×</span>
      <img src={imageUrl} alt="Zoomed view" className={style.zoomed_image} />
    </div>
  );
}

export default ImageViewer;