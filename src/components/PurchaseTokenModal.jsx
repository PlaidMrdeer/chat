import { useState, useEffect } from "react";
import style from "./PurchaseTokenModal.module.css";

// 假设二维码图片位于 public/images/qr-code.png
const QR_CODE_IMAGE_PATH = "/qr_code.png";

function PurchaseTokenModal({ isOpen, onClose }) {
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 当模态框打开时，从后端获取支付信息
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
      setPaymentDetails(null); // 重置状态

      fetch("http://localhost:3000/api/get-payment-details") // 确保URL与你的后端地址一致
        .then((res) => {
          if (!res.ok) {
            throw new Error("无法获取支付信息，请稍后重试。");
          }
          return res.json();
        })
        .then((data) => {
          setPaymentDetails(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setIsLoading(false);
        });
    }
  }, [isOpen]); // 依赖 isOpen，每次打开时重新获取

  // 将字符串备注转换为钱包需要的十六进制格式
  const getMemoInHex = (memo) => {
    if (!memo) return "";
    // 1. 使用 TextEncoder 将字符串编码为 Uint8Array (二进制数组)
    const encoder = new TextEncoder();
    const data = encoder.encode(memo);

    // 2. 遍历二进制数组，将每个字节转换为两位十六进制字符串
    const hex = Array.from(data)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    // 3. 添加 '0x' 前缀
    return "0x" + hex;
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        alert("已复制到剪贴板!");
      })
      .catch((err) => {
        console.error("复制失败: ", err);
      });
  };

  const renderContent = () => {
    if (isLoading) {
      return <p>正在生成支付信息，请稍候...</p>;
    }
    if (error) {
      return <p className={style.warning}>{error}</p>;
    }
    if (paymentDetails) {
      const memoInHex = getMemoInHex(paymentDetails.memo);
      return (
        <>
          <p>请向以下地址转账以购买令牌。这是您访问本站的唯一凭证。</p>

          <div className={style.qr_container}>
            <img
              src={QR_CODE_IMAGE_PATH}
              alt="Crypto Address QR Code"
              className={style.qr_code_image}
            />
          </div>

          <h4>
            {paymentDetails.amount} {paymentDetails.currency} (
            {/* 网络信息 */ "Ethereum"}) 地址:
          </h4>
          <div className={style.address_container}>
            <p className={style.crypto_address}>
              {paymentDetails.recipientAddress}
            </p>
            <button
              className={style.copy_button}
              onClick={() => handleCopy(paymentDetails.recipientAddress)}
            >
              复制
            </button>
          </div>

          <div className={style.warning}>
            <h4>
              <strong>⚠️ 注意：如何填写“备注”</strong>
            </h4>
            <p>为使系统能自动识别您的付款，您必须在转账时附加以下数据。</p>
            <ol style={{ textAlign: "left", paddingLeft: "20px" }}>
              <li>
                在您的钱包（如MetaMask）转账界面，找到“高级选项”或“编辑”。不同钱包可能不一样，有些钱包在转账时，会显示“十六进制数据” 的输入框，而有些不会。
              </li>
              <li>找到名为 “十六进制数据” 的选项，开启。</li>
              <li>将下面这串完整的十六进制数据复制并粘贴进去。</li>
            </ol>
            <div className={style.address_container}>
              <p className={style.crypto_address} style={{ color: "#f8c98a" }}>
                {memoInHex}
              </p>
              <button
                className={style.copy_button}
                onClick={() => handleCopy(memoInHex)}
              >
                复制数据
              </button>
            </div>
          </div>

          <p style={{ marginTop: "20px" }}>
            转账完成后，您的令牌将通过系统发放。可能会有延迟，请耐心等待。
          </p>
        </>
      );
    }
    return null;
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={style.modal} onClick={onClose}>
      <div className={style.modal_content} onClick={(e) => e.stopPropagation()}>
        <span className={style.close_button} onClick={onClose}>
          ×
        </span>
        <h2>购买访问令牌</h2>
        {renderContent()}
      </div>
    </div>
  );
}

export default PurchaseTokenModal;
