import style from './UserManualModal.module.css';

function UserManualModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div id="manualModal" className={style.modal} style={{ display: 'block' }}>
      <div className={style.modal_content}>
        <span className={style.close_button} id="closeManualModal" onClick={onClose}>×</span>
        <h2>用户手册</h2>
        <p><strong>欢迎来到匿名聊天室！</strong></p>

        <h4>基本规则：</h4>
        <ul>
          <li>请文明发言，尊重他人。</li>
          <li>禁止发送任何违反您所在地法律法规的内容（包括但不限于色情、暴力、赌博、极端言论、政治敏感信息等）。</li>
          <li>禁止人身攻击、散布谣言或进行商业广告。</li>
          <li>违规者可能会被管理员采取必要措施。</li>
        </ul>

        <h4>关于本站</h4>
        <ul>
          <li>您的身份在本聊天室中是临时的，由一串随机字符（您的连接ID）表示。</li>
          <li>聊天消息是临时的，当您刷新页面或重新连接后，之前的消息将不会保留。</li>
          <li>由于聊天室不存储任何内容，只进行广播转发，所以如果您需要发送大文件（如5GB,10GB）请确保您的内存足够。</li>
        </ul>

        <h4>匿名与安全提示：</h4>
        <ul>
          <li>本聊天室服务器<strong>不主动存储</strong>聊天记录。消息在发送后仅进行广播，刷新页面即消失。</li>
          <li>您的连接ID是临时的，但您的IP地址对于服务器是可见的。请注意保护个人隐私。</li>
          <li>请勿在本聊天室透露任何个人敏感信息。</li>
        </ul>

        <h4>免责声明：</h4>
        <p>本聊天室旨在提供一个即时交流的平台。所有用户言论仅代表其个人观点，与本平台立场无关。用户应对自己的言论负全部责任。因使用本服务产生的任何风险由用户自行承担。平台运营方保留在必要时采取管理措施的权利。</p>
      </div>
    </div>
  );
}

export default UserManualModal;