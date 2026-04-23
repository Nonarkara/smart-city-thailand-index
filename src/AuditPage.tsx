import { confidenceClass, confidenceLabel, getClaim } from "./claimRegistry";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const timelineEvents = [
  {
    year: "2018",
    text: {
      en: "National Smart City Committee formed and the 100-city ambition entered the policy frame.",
      th: "จัดตั้งคณะกรรมการเมืองอัจฉริยะแห่งชาติ และเป้าหมาย 100 เมืองเข้าสู่กรอบนโยบาย",
      zh: "国家智慧城市委员会成立，百城愿景正式进入政策框架。",
    },
  },
  {
    year: "2019",
    text: {
      en: "depa formalized the Smart City Thailand Office and began building the certification pipeline.",
      th: "depa จัดตั้งสำนักงาน Smart City Thailand อย่างเป็นทางการ และเริ่มปั้นเส้นทางการรับรอง",
      zh: "depa 正式设立 Smart City Thailand Office，并开始搭建认证流程。",
    },
  },
  {
    year: "2021",
    text: {
      en: "Certification accelerated, but public-facing systems and maintenance discipline did not move at the same speed.",
      th: "การรับรองเดินเร็วขึ้น แต่ระบบที่ประชาชนใช้จริงและวินัยการบำรุงรักษาไม่ได้ขยับทันกัน",
      zh: "认证节奏加快了，但面向公众的系统与维护纪律并没有以同样速度跟上。",
    },
  },
  {
    year: "2025",
    text: {
      en: "The audit phase began to compare certificates with uptime, evidence, and observable service logic.",
      th: "เฟสการตรวจสอบเริ่มเทียบใบรับรองกับ uptime หลักฐาน และตรรกะบริการที่สังเกตได้",
      zh: "审计阶段开始把证书与 uptime、证据和可观察的服务逻辑并排核对。",
    },
  },
];

const KPI_IDS = ["performance-delta", "certified-cities", "dead-links", "citizen-usage"] as const;

const DOMAIN_GAPS = [
  { name: { en: "Smart Environment", th: "สิ่งแวดล้อมอัจฉริยะ", zh: "智慧环境" }, pr: 95, real: 42 },
  { name: { en: "Smart Economy", th: "เศรษฐกิจอัจฉริยะ", zh: "智慧经济" }, pr: 88, real: 38 },
  { name: { en: "Smart Governance", th: "การปกครองอัจฉริยะ", zh: "智慧治理" }, pr: 92, real: 55 },
  { name: { en: "Smart Living", th: "การใช้ชีวิตอัจฉริยะ", zh: "智慧生活" }, pr: 85, real: 61 },
  { name: { en: "Smart Mobility", th: "การเดินทางอัจฉริยะ", zh: "智慧出行" }, pr: 90, real: 49 },
  { name: { en: "Smart People", th: "พลเมืองอัจฉริยะ", zh: "智慧人文" }, pr: 82, real: 28 },
  { name: { en: "Smart Energy", th: "พลังงานอัจฉริยะ", zh: "智慧能源" }, pr: 87, real: 44 },
];

const SENTIMENT_IDS = [
  {
    id: "sentiment-frustration",
    title: { en: "Frustration", th: "ความหงุดหงิด", zh: "沮丧" },
    body: {
      en: "Mentions of dead links, broken apps, and ceremonial launches with weak follow-through.",
      th: "การพูดถึงลิงก์เสีย แอปเสีย และการเปิดตัวแบบพิธีการที่ไร้การตามงานจริง",
      zh: "关于死链、坏掉的应用以及启动之后缺乏跟进的仪式化发布的提及。",
    },
  },
  {
    id: "sentiment-hope",
    title: { en: "Hope", th: "ความหวัง", zh: "希望" },
    body: {
      en: "Positive signals tied to concrete local services that people can actually use.",
      th: "สัญญาณเชิงบวกที่โยงกับบริการท้องถิ่นที่ประชาชนใช้ได้จริง",
      zh: "与市民真正能使用的具体本地服务相关的正向信号。",
    },
  },
  {
    id: "sentiment-indifference",
    title: { en: "Indifference", th: "ความเฉยเมย", zh: "漠然" },
    body: {
      en: "Places where the smart-city label exists institutionally, but hardly enters public life.",
      th: "พื้นที่ที่มีป้ายเมืองอัจฉริยะในระดับสถาบัน แต่แทบไม่เข้าไปอยู่ในชีวิตสาธารณะ",
      zh: "一些地方在机构层面拥有“智慧城市”标签，但几乎没有进入公共生活。",
    },
  },
];

const DIRECTIVES = [
  {
    title: {
      en: "Train the municipal operating core",
      th: "ฝึกแกนปฏิบัติการของเทศบาล",
      zh: "先训练市政运维核心团队",
    },
    body: {
      en: "A smart city fails when staff, maintenance, and contract discipline lag behind procurement.",
      th: "เมืองอัจฉริยะจะล้มเหลวทันทีเมื่อเจ้าหน้าที่ การบำรุงรักษา และวินัยสัญญาตามหลังการจัดซื้อ",
      zh: "当人员、维护与合同纪律落后于采购节奏时，智慧城市就会失败。",
    },
  },
  {
    title: {
      en: "Fund boring maintenance before new showcases",
      th: "ตั้งงบบำรุงรักษาก่อนทำโชว์เคสใหม่",
      zh: "先给“无聊的维护”拨款，再谈新的展示项目",
    },
    body: {
      en: "Dead links and dark dashboards are usually budget failures, not software mysteries.",
      th: "ลิงก์เสียและแดชบอร์ดดับมักเป็นความล้มเหลวทางงบประมาณ ไม่ใช่ปริศนาทางซอฟต์แวร์",
      zh: "死链和黑屏仪表板通常是预算失败，不是什么软件谜题。",
    },
  },
  {
    title: {
      en: "Publish evidence, not ceremonial language",
      th: "เผยแพร่หลักฐาน ไม่ใช่ภาษาพิธีการ",
      zh: "发布证据，而不是礼仪化语言",
    },
    body: {
      en: "Cities should expose uptime, data dates, service reach, and corrective actions in public-facing form.",
      th: "เมืองควรเปิดเผย uptime วันที่ข้อมูล ความครอบคลุมของบริการ และการแก้ไขปัญหาในรูปแบบที่ประชาชนเข้าถึงได้",
      zh: "城市应以面向公众的方式公布 uptime、数据日期、服务覆盖范围以及纠偏动作。",
    },
  },
];

function claimValue(id: string): string {
  const claim = getClaim(id);
  return claim ? String(claim.value) : "—";
}

export default function AuditPage({ locale, onNavigate }: Props) {
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="audit-page" style={{ paddingBottom: "var(--space-6)" }}>
      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Audit file",
            th: "แฟ้มตรวจสอบ",
            zh: "审计档案",
          })}
        </p>
        <h1 className="hero-title">
          {t({
            en: "Institutional honesty.",
            th: "ความซื่อสัตย์ของสถาบัน",
            zh: "体制诚信。",
          })}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "The audit layer exists to compare what cities say with what can actually be observed. Certificates, dashboards, evidence links, and citizen-facing performance have to line up in the same frame.",
            th: "ชั้นการตรวจสอบมีไว้เพื่อเทียบสิ่งที่เมืองพูดกับสิ่งที่สังเกตได้จริง ใบรับรอง แดชบอร์ด ลิงก์หลักฐาน และประสิทธิภาพที่ประชาชนพบเจอ ต้องวางอยู่ในกรอบเดียวกัน",
            zh: "审计层的存在，就是为了把城市说的话和真正能观察到的东西放在一起比对。证书、仪表板、证据链接与面向市民的表现必须被放进同一个框架里核对。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <div className="index-summary-grid">
          {KPI_IDS.map(id => {
            const claim = getClaim(id);
            if (!claim) return null;
            return (
              <div key={id} className="data-sheet summary-cell">
                <div className="data-label">{claim.label[locale]}</div>
                <div className="summary-value">{claim.value}</div>
                <div className={`data-note ${confidenceClass(claim.confidence)}`}>
                  {confidenceLabel(claim.confidence)}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Institutional timeline",
            th: "ไทม์ไลน์เชิงสถาบัน",
            zh: "制度时间线",
          })}
        </p>
        <div className="data-sheet">
          {timelineEvents.map(event => (
            <div key={event.year} className="data-row">
              <div style={{ minWidth: "5rem" }}>
                <div className="data-label">{event.year}</div>
              </div>
              <p className="data-note">{t(event.text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "PR versus delivery",
            th: "PR เทียบกับการส่งมอบ",
            zh: "公关与交付",
          })}
        </p>
        <div className="data-sheet">
          {DOMAIN_GAPS.map(domain => (
            <div key={domain.name.en} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{t(domain.name)}</div>
              </div>
              <div style={{ display: "grid", gap: "0.45rem", flex: 1 }}>
                <div className="data-note">
                  {t({ en: "Narrative score", th: "คะแนนคำเล่า", zh: "叙事分数" })} {domain.pr}
                  {" · "}
                  {t({ en: "Observed score", th: "คะแนนที่สังเกตได้", zh: "观察分数" })} {domain.real}
                </div>
                <div className="ranking-pillar-track">
                  <div
                    className="ranking-pillar-fill"
                    style={{ width: `${domain.pr}%`, backgroundColor: "var(--n-300)" }}
                  />
                  <div
                    className="ranking-pillar-fill"
                    style={{ width: `${domain.real}%`, backgroundColor: "var(--a-500)" }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Citizen sentiment",
            th: "ความรู้สึกของประชาชน",
            zh: "市民情绪",
          })}
        </p>
        <div className="data-sheet">
          {SENTIMENT_IDS.map(item => (
            <div key={item.id} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{t(item.title)}</div>
                <div className="data-value">{claimValue(item.id)}</div>
              </div>
              <p className="data-note">{t(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <p className="eyebrow">
          {t({
            en: "Strategic directives",
            th: "คำสั่งเชิงยุทธศาสตร์",
            zh: "战略指令",
          })}
        </p>
        <div className="data-sheet">
          {DIRECTIVES.map(item => (
            <div key={item.title.en} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{t(item.title)}</div>
              </div>
              <p className="data-note">{t(item.body)}</p>
            </div>
          ))}
        </div>
        <div className="hero-actions" style={{ marginTop: "var(--space-2)" }}>
          <button type="button" className="btn btn-secondary" onClick={() => onNavigate("/why")}>
            {t({ en: "Why this index", th: "ทำไมต้องมีดัชนี", zh: "为什么需要这个指数" })}
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onNavigate("/rankings")}>
            {t({ en: "Open rankings", th: "เปิดอันดับ", zh: "打开排名" })}
          </button>
        </div>
      </section>
    </div>
  );
}
