import { summarizeCities } from "./cityCollections";
import { translate } from "./cityPresentation";
import { getClaimValue } from "./claimRegistry";
import { getCitySummaries } from "./cityCdp";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const BENEFITS = [
  {
    lens: { en: "Capital allocation", th: "การจัดสรรทุน", zh: "资本配置" },
    title: {
      en: "For investors: compare cities, not just the country",
      th: "สำหรับนักลงทุน: เปรียบเทียบในระดับเมือง ไม่ใช่แค่ระดับประเทศ",
      zh: "投资者：比较城市，而不只是比较国家",
    },
    body: {
      en: "Country-level narratives hide the fact that Thai cities operate very differently. The index turns sub-national variation into something usable: comparable scores, city dossiers, and downloadable evidence.",
      th: "เรื่องเล่าระดับประเทศซ่อนความจริงที่ว่าแต่ละเมืองไทยเดินงานต่างกันมาก ดัชนีนี้จึงเปลี่ยนความต่างระดับเมืองให้ใช้งานได้จริง: คะแนนเปรียบเทียบ แฟ้มเมือง และหลักฐานที่ดาวน์โหลดได้",
      zh: "国家级叙事会掩盖一个事实：泰国城市之间的运行方式差异很大。这个指数把这种城市级差异转成可用信息：可比的分数、城市档案和可下载证据。",
    },
  },
  {
    lens: { en: "Benchmarking", th: "การเทียบเคียง", zh: "基准比较" },
    title: {
      en: "For city governments: see the gap before buying more hardware",
      th: "สำหรับเมือง: เห็นช่องว่างก่อนซื้อฮาร์ดแวร์เพิ่ม",
      zh: "城市政府：先看清缺口，再决定要不要再买硬件",
    },
    body: {
      en: "SCITI does not punish cities for being unfinished. It shows which systems are real, which are partial, and which are still story. That makes peer learning and budget prioritization much harder to fake.",
      th: "SCITI ไม่ได้ลงโทษเมืองที่ยังไม่เสร็จ แต่มันทำให้เห็นว่าระบบไหนจริง ระบบไหนยังครึ่งๆ กลางๆ และระบบไหนยังเป็นเพียงเรื่องเล่า การเรียนรู้จากเมืองอื่นและการจัดลำดับงบประมาณจึงปลอมได้ยากขึ้นมาก",
      zh: "SCITI 并不是为了惩罚尚未完成的城市。它只是把哪些系统是真的、哪些只是半成品、哪些仍停留在故事里直接摆出来，这让同行学习和预算排序更难造假。",
    },
  },
  {
    lens: { en: "Accountability", th: "ความรับผิดรับชอบ", zh: "问责" },
    title: {
      en: "For citizens: make the smart-city label answerable",
      th: "สำหรับประชาชน: ทำให้ป้ายเมืองอัจฉริยะตอบคำถามได้",
      zh: "市民：让“智慧城市”这个标签能够被追问",
    },
    body: {
      en: "When certification, delivery, and outcomes sit in the same public frame, people can ask better questions. Not whether a city has a logo, but whether services work, data stays live, and maintenance budgets exist.",
      th: "เมื่อการรับรอง การส่งมอบ และผลลัพธ์อยู่ในกรอบสาธารณะเดียวกัน ประชาชนจะถามคำถามที่ดีขึ้นได้ ไม่ใช่แค่ว่าเมืองมีโลโก้หรือไม่ แต่ถามว่าบริการใช้งานได้หรือไม่ ข้อมูลยังเดินอยู่หรือไม่ และมีงบบำรุงรักษาหรือไม่",
      zh: "当认证、交付与结果被放进同一个公开框架里，公众就能提出更好的问题。不再只问城市有没有一个标志，而是问服务是否真的可用、数据是否还活着、维护预算是否存在。",
    },
  },
];

const USE_CASES = [
  {
    label: { en: "Open method", th: "วิธีการเปิดเผย", zh: "开放方法" },
    body: {
      en: "Weights, thresholds, and source surfaces are all public. You can inspect the logic instead of trusting the brand.",
      th: "น้ำหนัก เกณฑ์ และพื้นผิวของแหล่งข้อมูลเปิดเผยทั้งหมด คุณจึงตรวจตราตรรกะได้ แทนที่จะเชื่อเพียงชื่อแบรนด์",
      zh: "权重、阈值与来源界面都公开可见，因此人们可以检查逻辑，而不是只相信品牌。",
    },
  },
  {
    label: { en: "Downloadable evidence", th: "หลักฐานดาวน์โหลดได้", zh: "可下载证据" },
    body: {
      en: "The city pages export CSV, so the index can enter real decision workflows instead of remaining a brochure.",
      th: "หน้าเมืองส่งออก CSV ได้ ดัชนีจึงเข้าไปอยู่ในขั้นตอนตัดสินใจจริง ไม่ใช่ค้างอยู่ในสถานะโบรชัวร์",
      zh: "城市页面可以导出 CSV，因此指数能进入真正的决策流程，而不是停留在宣传册层面。",
    },
  },
  {
    label: { en: "Comparable tiers", th: "ระดับที่เทียบกันได้", zh: "可比较层级" },
    body: {
      en: "Alpha, Beta, and Gamma create readable hierarchy without pretending that a tenth of a point carries false precision.",
      th: "Alpha, Beta และ Gamma สร้างลำดับชั้นที่อ่านง่าย โดยไม่แสร้งว่าทศนิยมหนึ่งตำแหน่งมีความแม่นยำเกินจริง",
      zh: "Alpha、Beta 与 Gamma 让层级更可读，同时避免把十分之一分数伪装成过度精确。",
    },
  },
  {
    label: { en: "Trilingual access", th: "เข้าถึงได้สามภาษา", zh: "三语可访问" },
    body: {
      en: "The same record stays readable in English, Thai, and Chinese, which matters for public accountability and external use.",
      th: "ระเบียนเดียวกันยังอ่านได้ในอังกฤษ ไทย และจีน ซึ่งสำคัญต่อทั้งการตรวจสอบสาธารณะและการใช้งานภายนอก",
      zh: "同一份记录在英文、泰文和中文里都可阅读，这对公众问责和外部使用都很重要。",
    },
  },
];

function formatClaim(value: string | number | undefined): string {
  return value === undefined ? "—" : String(value);
}

export default function WhyPage({ locale, onNavigate }: Props) {
  const cities = getCitySummaries();
  const stats = summarizeCities(cities);
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="why-page" style={{ paddingBottom: "var(--space-6)" }}>
      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Why this index",
            th: "ทำไมต้องมีดัชนีนี้",
            zh: "为什么需要这个指数",
          })}
        </p>
        <h1 className="hero-title">
          {t({
            en: "Who benefits, and how.",
            th: "ใครได้ประโยชน์ และอย่างไร",
            zh: "谁受益，以及如何受益。",
          })}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "A transparent city index is not a branding project. It is shared infrastructure for comparing places, checking public claims, and making better allocation decisions.",
            th: "ดัชนีเมืองที่โปร่งใสไม่ใช่โครงการสร้างภาพ แต่เป็นโครงสร้างพื้นฐานร่วมสำหรับการเปรียบเทียบเมือง ตรวจสอบคำกล่าวอ้างสาธารณะ และตัดสินใจจัดสรรทรัพยากรให้ดีขึ้น",
            zh: "透明的城市指数不是品牌工程，而是一种共享基础设施，用来比较城市、核对公共说法并做出更好的资源配置判断。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <div className="index-summary-grid">
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Cities compared", th: "เมืองที่เปรียบเทียบ", zh: "已比较城市" })}
            </div>
            <div className="summary-value">{stats.total}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Submitted proposals", th: "ข้อเสนอทั้งหมด", zh: "已提交提案" })}
            </div>
            <div className="summary-value">{formatClaim(getClaimValue("proposals"))}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Reality gap", th: "ช่องว่างกับความจริง", zh: "现实差距" })}
            </div>
            <div className="summary-value">{formatClaim(getClaimValue("performance-delta"))}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Plan target", th: "เป้าหมายแผน", zh: "计划目标" })}
            </div>
            <div className="summary-value">{formatClaim(getClaimValue("target-smart-cities-2024-2027"))}</div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Three audiences",
            th: "ผู้ใช้ 3 กลุ่ม",
            zh: "三类使用者",
          })}
        </p>
        <div className="data-sheet">
          {BENEFITS.map(item => (
            <div key={item.title.en} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{t(item.lens)}</div>
              </div>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div className="data-value">{t(item.title)}</div>
                <p className="data-note">{t(item.body)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Why it works",
            th: "เหตุผลที่ใช้งานได้",
            zh: "为什么它可用",
          })}
        </p>
        <div className="data-sheet">
          {USE_CASES.map(item => (
            <div key={item.label.en} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{t(item.label)}</div>
              </div>
              <p className="data-note">{t(item.body)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">
            {t({
              en: "This index is open. Use it.",
              th: "ดัชนีนี้เปิดเผย ใช้งานได้เลย",
              zh: "这个指数是开放的。请直接使用。",
            })}
          </h2>
          <p className="cta-text">
            {t({
              en: "The value of SCITI is not in a headline. It is in the fact that methodology, evidence, and city-level records stay connected in one public frame.",
              th: "คุณค่าของ SCITI ไม่ได้อยู่ที่พาดหัว แต่มันอยู่ที่วิธีการ หลักฐาน และระเบียนระดับเมือง ยังเชื่อมกันอยู่ในกรอบสาธารณะเดียว",
              zh: "SCITI 的价值不在标题，而在于方法、证据与城市级记录始终被放在同一个公开框架里。",
            })}
          </p>
          <div className="hero-actions">
            <button type="button" className="btn btn-primary" onClick={() => onNavigate("/rankings")}>
              Explore the rankings
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
