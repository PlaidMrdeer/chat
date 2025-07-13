import style from "./UserManualModal.module.css";

// 【优化建议】将数据与视图分离，便于维护
// 我们可以把文案内容定义为数据结构，而不是直接硬编码在JSX里。
const sections = [
  {
    title: "本站规则",
    subsections: [
      {
        subtitle: "互相尊重",
        points: [
          "禁止使用任何形式的语言（包括谐音、缩写、比喻）来攻击、侮辱或贬低其他用户。例如，针对他人的家庭、外貌、智商、种族、信仰、性取向等的攻击性言论都是不被允许的。",
          "关于脏话：我们理解在交流中，一些语气助词（如“卧槽”、“我他妈”）可能被用于表达强烈的情绪而非恶意。这类词语在不针对任何人的情况下或许可以被容忍。但是，一旦脏话被用于辱骂或攻击特定用户（如“我操你妈”、“你个傻X”），将会被严肃处理。判断的最终标准是：你的言论是否让其他用户感到了被攻击或被骚扰。",
          "禁止持续性地针对某个用户进行骚扰、恐吓、威胁或网络霸凌。如果你不希望与某人交流，请选择忽略。",
        ],
      },
      {
        subtitle: "内容红线",
        points: [
          "绝对禁止分享、讨论、索取或发布任何涉及未成年人的色情、暴力或剥削内容。我们将对此类行为采取零容忍政策。",
          "严禁发布任何煽动对个人或群体的仇恨、歧视或暴力的内容。这包括但不限于基于种族、国籍、宗教、性别、年龄、残疾或任何其他受保护特征的歧视。",
          "禁止发布任何包括但不限于：暴力、恐怖主义、赌博、毒品、自残自杀的煽动或美化、以及侵犯他人隐私（如泄露他人个人信息）的内容。",
          "请避免发布可能引起他人严重心理或生理不适的血腥、暴力、恶心或惊悚的图片与内容。",
        ],
      },
      {
        subtitle: "社区秩序",
        points: [
          "禁止频繁、重复地发送相同或相似的内容（刷屏）。",
          "禁止发布无意义的字符、乱码或进行“炸群”等影响正常聊天秩序的行为。",
          "禁止在聊天室内发布未经许可的商业广告、推广链接、二维码或进行任何形式的商业招揽。",
        ],
      },
      {
        subtitle: "管理与执行",
        points: [
          "管理员有权根据本准则，对违规内容和行为进行判断，并采取相应措施，包括但不限于警告、临时禁言、或永久封禁。",
          "在紧急或严重违规情况下，管理员有权不经事先通知直接进行封禁处理。",
          "如何举报：我们鼓励你使用[举报按钮]来帮助我们发现违规行为。一个健康的社区需要所有成员的共同维护。请勿滥用举报功能。",
        ],
      },
    ],
  },
  {
    title: "关于本站",
    points: [
      "您的身份在本聊天室中是完全临时的，由一串随机字符（您的连接ID）表示，刷新即更换。",
      "聊天消息是临时的，当您刷新页面或重新连接后，之前的消息将不会保留。",
      "由于聊天室不存储任何内容，只进行广播转发，所以如果您需要发送大文件（如5GB,10GB）请确保您的内存足够。",
      "访问方式：为了防止机器人和恶意行为，本聊天室采用令牌制访问。您需要一次性购买令牌，即可获得永久进入资格。",
    ],
  },
  {
    title: "关于令牌 (Token)",
    points: [
      "如何购买：点击“购买令牌”按钮，您会看到一个收款地址和一个专属的支付备注(Memo)。请务必在转账时填写此备注，系统将通过它来确认您的付款。",
      "付款成功后，您会获得一个由128个随机字符组成的令牌。请立即将它复制并保存到安全的地方。我们强烈建议您使用密码管理器或加密备忘录来保管它。（当然，如果您对自己的眼力和耐心足够自信，写在纸上也未尝不可。😊）",
      "令牌 = 永久钥匙：此令牌是您访问聊天室的唯一永久凭证。它不与任何身份绑定。",
      "安全提示：请将此令牌视为一把现实生活中的钥匙。任何持有此令牌的人都可以进入聊天室。请勿与任何人分享您的令牌！",
      "⚠️ 重要：令牌丢失后无法找回，您需要重新购买。请务必妥善保管！",
    ],
  },
];

function UserManualModal({ isOpen, onClose }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div id="manualModal" className={style.modal} style={{ display: "block" }}>
      <div className={style.modal_content}>
        <span
          className={style.close_button}
          id="closeManualModal"
          onClick={onClose}
        >
          ×
        </span>
        <h2>用户手册</h2>
        <p>
          <strong>
            欢迎来到匿名聊天室！我们致力于打造一个自由、安全且充满乐趣的交流空间。
          </strong>
        </p>

        {sections.map((section, sectionIndex) => (
          <div key={sectionIndex}>
            <h4>{section.title}</h4>
            {section.subsections ? (
              section.subsections.map((subsection, subIndex) => (
                <div key={subIndex}>
                  <p>
                    <strong>{subsection.subtitle}</strong>
                  </p>
                  <ul>
                    {subsection.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        dangerouslySetInnerHTML={{ __html: point }}
                      />
                    ))}
                  </ul>
                </div>
              ))
            ) : (
              <ul>
                {section.points.map((point, pointIndex) => (
                  <li
                    key={pointIndex}
                    dangerouslySetInnerHTML={{ __html: point }}
                  />
                ))}
              </ul>
            )}
          </div>
        ))}

        <h4>免责声明：</h4>
        <p>
          本平台的所有用户言论仅代表其个人观点，与本平台立场无关。用户需对自己的所有言行负全部法律责任。
        </p>

        <hr
          style={{
            border: "none",
            borderTop: "1px solid #444",
            margin: "20px 0",
          }}
        />
        <p style={{ textAlign: "center", color: "#888", fontSize: "12px" }}>
          最后更新于：2025年7月13日
        </p>
      </div>
    </div>
  );
}

export default UserManualModal;
