import style from './PurchaseTokenModal.module.css';

// 假设二维码图片位于 public/images/qr-code.png
const QR_CODE_IMAGE_PATH = '/qr_code.png'; 
const CRYPTO_ADDRESS = '0x507B556d0047369b9A037274c2574b9F734BDB24';

function PurchaseTokenModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  // 复制地址到剪贴板
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(CRYPTO_ADDRESS).then(() => {
      alert('地址已复制到剪贴板!');
    }).catch(err => {
      console.error('无法复制地址: ', err);
      alert('复制失败!');
    });
  };

  return (
    <div className={style.modal}>
      {/* 点击内容区域时阻止事件冒泡，防止关闭模态框 */}
      <div className={style.modal_content} onClick={(e) => e.stopPropagation()}>
        <span className={style.close_button} onClick={onClose}>×</span>
        <h2>购买令牌</h2>
        <p>您可以通过向以下加密货币地址转账来购买令牌。请确保您使用的是正确的网络。</p>
        
        <div className={style.qr_container}>
          <img src={QR_CODE_IMAGE_PATH} alt="Crypto Address QR Code" className={style.qr_code_image} />
        </div>

        <h4>1 USDT (Ethereum Mainnet) 地址:</h4>
        <div className={style.address_container}>
            <p className={style.crypto_address}>{CRYPTO_ADDRESS}</p>
            <button className={style.copy_button} onClick={handleCopyAddress}>复制</button>
        </div>

        <p className={style.warning}><strong>重要:</strong> 转账完成后，128位令牌会显示在您的屏幕上，只会显示一次。请妥善保存好您的令牌，如果丢失，您只能重新购买令牌。</p>
      </div>
    </div>
  );
}

export default PurchaseTokenModal;