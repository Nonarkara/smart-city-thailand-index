import { translate } from "./cityPresentation";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_WEIGHTS } from "./types";
import { ResponsiveImage } from "./mediaAssets";
import DossierTabs from "./DossierTabs";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface ShowcaseMetric {
  value: string;
  label: { en: string; th: string; zh: string };
}

interface ShowcaseIdea {
  id: string;
  icon: string;
  title: { en: string; th: string; zh: string };
  desc: { en: string; th: string; zh: string };
}

interface ShowcaseSource {
  title: string;
  note: { en: string; th: string; zh: string };
}

const metrics: ShowcaseMetric[] = [
  { value: "112,000+", label: { en: "Active app users", th: "ผู้ใช้แอปที่ใช้งานจริง", zh: "活跃应用用户" } },
  { value: "< 48h", label: { en: "Issue resolution target", th: "เป้าเวลาแก้ปัญหา", zh: "问题处理目标" } },
  { value: "38,000", label: { en: "Complaints resolved in 3 years", th: "เรื่องร้องเรียนที่แก้ใน 3 ปี", zh: "3 年内已处理投诉" } },
  { value: "10h", label: { en: "Flood warning window", th: "เวลานำเตือนน้ำท่วม", zh: "洪灾预警窗口" } },
  { value: "70%", label: { en: "Population adoption", th: "สัดส่วนประชากรที่ใช้งาน", zh: "人口采用率" } },
  { value: "฿2.3M", label: { en: "Reported annual savings", th: "มูลค่าประหยัดต่อปีที่รายงาน", zh: "报告中的年度节省" } },
  { value: "0", label: { en: "Flood fatalities since 2021", th: "ผู้เสียชีวิตจากน้ำท่วมตั้งแต่ปี 2564", zh: "2021 年以来洪灾死亡数" } },
  { value: "92%", label: { en: "Citizen satisfaction", th: "ความพึงพอใจประชาชน", zh: "市民满意度" } },
];

const ideas: ShowcaseIdea[] = [
  {
    id: "hospital-on-wheels",
    icon: "🏥",
    title: { en: "Hospital on Wheels", th: "โรงพยาบาลเคลื่อนที่", zh: "移动医院" },
    desc: {
      en: "A mobile medical unit with doctors, nurses, pharmacists, and telemedicine support. It reaches underserved neighborhoods without waiting for a new clinic building.",
      th: "หน่วยแพทย์เคลื่อนที่ที่มีหมอ พยาบาล เภสัชกร และระบบการแพทย์ทางไกล ไปถึงชุมชนที่บริการเข้าไม่ถึง โดยไม่ต้องรอสร้างคลินิกใหม่",
      zh: "配备医生、护士、药师与远程医疗支持的移动医疗单元，不必等新诊所盖好就能进入服务不足社区。",
    },
  },
  {
    id: "digital-catalog",
    icon: "📱",
    title: { en: "Digital catalog for street vendors", th: "แคตตาล็อกดิจิทัลสำหรับพ่อค้าแม่ค้า", zh: "街头商贩数字目录" },
    desc: {
      en: "A QR-based storefront layer for local merchants. The point is not e-commerce theatre; it is giving informal vendors a low-friction way into the digital economy.",
      th: "ชั้นหน้าร้านแบบ QR สำหรับผู้ค้ารายย่อย ประเด็นไม่ใช่ละครอีคอมเมิร์ซ แต่คือการให้พ่อค้าแม่ค้าเข้าระบบเศรษฐกิจดิจิทัลได้อย่างง่ายดาย",
      zh: "基于 QR 的数字店面层，重点不是电商表演，而是让非正规摊贩以极低门槛进入数字经济。",
    },
  },
  {
    id: "mayors-classroom",
    icon: "🎓",
    title: { en: "Mayor's classroom", th: "ห้องเรียนนายก", zh: "市长课堂" },
    desc: {
      en: "A recurring live Q&A on LINE where the mayor answers residents directly. It matters because the digital channel is used for accountability, not just announcements.",
      th: "ไลฟ์ถามตอบบน LINE ที่นายกตอบประชาชนโดยตรง จุดสำคัญคือช่องทางดิจิทัลถูกใช้เพื่อ accountability ไม่ใช่แค่ประกาศข่าว",
      zh: "市长通过 LINE 进行定期直播问答。关键不是直播本身，而是数字渠道被用来承担问责，而不只是发布公告。",
    },
  },
  {
    id: "citizen-rating",
    icon: "⭐",
    title: { en: "5-star citizen rating", th: "คะแนนบริการ 5 ดาว", zh: "五星市民评分" },
    desc: {
      en: "Residents rate service interactions in real time. That turns satisfaction from a ceremonial survey into an operating metric staff have to look at.",
      th: "ประชาชนให้คะแนนบริการแบบเรียลไทม์ ทำให้ความพึงพอใจไม่ใช่แบบสอบถามพิธีการ แต่กลายเป็นตัวชี้วัดที่เจ้าหน้าที่ต้องเห็น",
      zh: "居民实时给服务打分，让满意度不再是仪式性的问卷，而变成工作人员必须面对的运行指标。",
    },
  },
  {
    id: "metaverse-classroom",
    icon: "🥽",
    title: { en: "Metaverse classroom", th: "ห้องเรียนเมตาเวิร์ส", zh: "元宇宙课堂" },
    desc: {
      en: "AR and VR were pushed into an actual school system with trained teachers and repeatable digital lesson content. That makes it a curriculum decision, not a gadget demo.",
      th: "AR/VR ถูกดันเข้าไปอยู่ในระบบโรงเรียนจริง มีครูที่ผ่านการอบรมและมีเนื้อหาบทเรียนดิจิทัลที่ใช้ซ้ำได้ นี่จึงเป็นเรื่องหลักสูตร ไม่ใช่ demo gadget",
      zh: "AR/VR 被推进到真正的学校系统里，有受训教师与可重复使用的数字课程内容，所以它是课程决策，不是设备演示。",
    },
  },
  {
    id: "flood-warning",
    icon: "🌊",
    title: { en: "10-hour flood warning system", th: "ระบบเตือนน้ำท่วมล่วงหน้า 10 ชั่วโมง", zh: "10 小时洪灾预警系统" },
    desc: {
      en: "Upstream sensors, CCTV, and automatic LINE alerts create lead time before floodwater hits the city. This is the clearest proof on the page that smart-city systems can save lives.",
      th: "เซ็นเซอร์ต้นน้ำ CCTV และการแจ้งเตือน LINE อัตโนมัติ สร้างเวลานำก่อนน้ำหลากเข้าเมือง นี่คือหลักฐานที่ชัดที่สุดบนหน้านี้ว่า ระบบเมืองอัจฉริยะช่วยชีวิตคนได้จริง",
      zh: "上游传感器、CCTV 与 LINE 自动提醒，为洪水进城前争取到时间。这是本页最清楚的一条证据，说明智慧城市系统确实能救命。",
    },
  },
];

const sourceFiles: ShowcaseSource[] = [
  {
    title: "Nakhon Innovative flood control updated(1).pdf",
    note: {
      en: "Case evidence for flood management logic, warning workflow, and project framing.",
      th: "หลักฐานสำหรับตรรกะการจัดการน้ำท่วม เวิร์กโฟลว์การเตือน และกรอบโครงการ",
      zh: "用于佐证防洪逻辑、预警流程与项目框架的案例材料。",
    },
  },
  {
    title: "NST Report.pdf",
    note: {
      en: "Municipal case-study material used for outcome figures and implementation narrative.",
      th: "เอกสารกรณีศึกษาของเทศบาล ใช้สำหรับตัวเลขผลลัพธ์และเรื่องเล่าการดำเนินงาน",
      zh: "市政案例材料，用于结果数据与实施叙事。",
    },
  },
  {
    title: "เทศบาลนครนครศรีธรรมราช 12-03-67.pdf",
    note: {
      en: "Local presentation material grounding service-delivery claims.",
      th: "สไลด์/เอกสารท้องถิ่นที่ใช้ค้ำ claims เรื่องการส่งมอบบริการ",
      zh: "用于支撑服务交付说法的地方材料。",
    },
  },
  {
    title: "Nakhon Nomination depa.pdf",
    note: {
      en: "Certification-era nomination material for project scope and milestones.",
      th: "เอกสารเสนอรับรอง ใช้ดูขอบเขตโครงการและหมุดหมายสำคัญ",
      zh: "认证提名材料，用于核对项目范围与关键里程碑。",
    },
  },
  {
    title: "ASEAN CSCO Handbook",
    note: {
      en: "Regional case-study framing that shows why the city matters beyond Thailand.",
      th: "กรอบกรณีศึกษาระดับภูมิภาคที่อธิบายว่าทำไมเมืองนี้จึงสำคัญเกินกว่าบริบทไทย",
      zh: "区域案例框架，说明这座城市为何值得被放到泰国之外来讨论。",
    },
  },
];

const awards = [
  { year: "2022", title: { en: "Thailand Smart City Solutions Award — Innovative Flood Control", th: "Thailand Smart City Solutions Award — นวัตกรรมควบคุมน้ำท่วม", zh: "泰国智慧城市解决方案奖：创新防洪" } },
  { year: "2023", title: { en: "Best Partnership Award — World Smart City Expo Korea (with depa)", th: "Best Partnership Award — World Smart City Expo Korea (ร่วมกับ depa)", zh: "最佳合作奖：韩国世界智慧城市博览会（与 depa）" } },
  { year: "2023", title: { en: "Batch 3 Smart City Local certification", th: "ได้รับตราสัญลักษณ์ Smart City Local รุ่น 3", zh: "第 3 批 Smart City Local 认证" } },
  { year: "2025", title: { en: "ASEAN CSCO Handbook model-city case study", th: "กรณีศึกษาเมืองต้นแบบใน ASEAN CSCO Handbook", zh: "入选 ASEAN CSCO Handbook 示范城市案例" } },
];

const beforeAfterRows = [
  {
    metric: { en: "Pothole and local issue response", th: "การตอบสนองปัญหาหน้างาน/หลุมบ่อ", zh: "路面与现场问题响应" },
    before: { en: "Fragmented, slow", th: "กระจัดกระจาย ช้า", zh: "分散且缓慢" },
    after: { en: "Tracked through app workflow", th: "ติดตามผ่านเวิร์กโฟลว์ในแอป", zh: "通过应用工作流进行追踪" },
  },
  {
    metric: { en: "Flood management", th: "การจัดการน้ำท่วม", zh: "洪水管理" },
    before: { en: "Reactive", th: "รอให้เกิดแล้วค่อยตอบ", zh: "被动应对" },
    after: { en: "10-hour early warning", th: "เตือนล่วงหน้า 10 ชั่วโมง", zh: "10 小时提前预警" },
  },
  {
    metric: { en: "Citizen feedback", th: "การสะท้อนความเห็นของประชาชน", zh: "市民反馈" },
    before: { en: "Mostly complaint-driven", th: "เน้นร้องเรียนอย่างเดียว", zh: "主要依赖投诉" },
    after: { en: "Rated, visible, actionable", th: "ให้คะแนนได้ มองเห็นได้ นำไปแก้ได้", zh: "可评分、可见、可行动" },
  },
  {
    metric: { en: "Government-citizen channel", th: "ช่องทางรัฐ-ประชาชน", zh: "政府与市民渠道" },
    before: { en: "Walk-in heavy", th: "ต้องเดินเข้าเป็นหลัก", zh: "以线下办理为主" },
    after: { en: "LINE-based daily interface", th: "อินเทอร์เฟซรายวันผ่าน LINE", zh: "以 LINE 为日常界面" },
  },
];

const PILLAR_ORDER: ScoringPillar[] = [
  "livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital",
];

/** Nakhon Si Thammarat SCITI 2026 pillar scores */
const NST_SCORES: Record<ScoringPillar, number> = {
  livability: 64, economy: 58, safety: 61, wellbeing: 62,
  environment: 62, hospitality: 74, digital: 50,
};

function ShowcasePillarProfile({ locale }: { locale: Locale }) {
  const composite = PILLAR_ORDER.reduce(
    (sum, p) => sum + NST_SCORES[p] * (PILLAR_WEIGHTS[p] / 100), 0
  );

  return (
    <div className="showcase-pillar-profile">
      <div className="showcase-pillar-header">
        <span className="showcase-pillar-tier">α</span>
        <span className="showcase-pillar-composite">
          {composite.toFixed(1)}
        </span>
        <span className="showcase-pillar-tier-label">
          {translate(locale, { en: "Alpha tier", th: "ระดับอัลฟา", zh: "Alpha 层级" })}
        </span>
      </div>
      <div className="showcase-pillar-bars">
        {PILLAR_ORDER.map(pillar => (
          <div key={pillar} className="showcase-pillar-row">
            <span className="showcase-pillar-name">
              {PILLAR_LABELS[locale][pillar]}
            </span>
            <div className="showcase-pillar-track">
              <div
                className="showcase-pillar-fill"
                style={{
                  width: `${NST_SCORES[pillar]}%`,
                  background: PILLAR_COLORS[pillar],
                }}
              />
            </div>
            <span className="showcase-pillar-value">{NST_SCORES[pillar]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShowcasePage({ locale, onNavigate }: Props) {
  return (
    <div className="showcase-page">
      <section className="section showcase-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Case study", th: "กรณีศึกษา", zh: "案例研究" })}</p>
        <h1 className="hero-title showcase-title">
          {translate(locale, {
            en: "Nakhon Si Thammarat: the city that listened.",
            th: "นครศรีธรรมราช: เมืองที่ฟังประชาชน",
            zh: "那空是贪玛叻：一座学会倾听的城市。",
          })}
        </h1>
        <p className="hero-strapline showcase-strapline">
          {translate(locale, {
            en: "This page is here to answer one question cleanly: what does a citizen-centric smart city look like when the work leaves the slide deck and hits the street?",
            th: "หน้านี้มีไว้ตอบคำถามเดียวให้ชัด: เมืองอัจฉริยะที่เน้นประชาชนหน้าตาเป็นอย่างไร เมื่อมันออกจากสไลด์แล้วลงไปอยู่บนถนนจริง",
            zh: "这一页只想干净地回答一个问题：当智慧城市离开 PPT、真正落到街头以后，以市民为中心到底长什么样？",
          })}
        </p>
        <div className="showcase-hero-actions">
          <button type="button" className="cta-button" onClick={() => onNavigate("/city/nakhon-si-thammarat")}>
            {translate(locale, { en: "View city profile", th: "ดูข้อมูลเมือง", zh: "查看城市档案" })}
          </button>
          <a href="https://nonarkara.github.io/asean-csco-app/#manifesto" target="_blank" rel="noopener noreferrer" className="ghost-button">
            {translate(locale, { en: "Open ASEAN CSCO Handbook", th: "เปิดคู่มือ ASEAN CSCO", zh: "打开 ASEAN CSCO 手册" })}
          </a>
          <a href={`${import.meta.env.BASE_URL}nst-checklist.pdf`} download="NST-Checklist-Smart-Cities.pdf" className="ghost-button">
            {translate(locale, { en: "↓ Download NST Checklist (PDF)", th: "↓ ดาวน์โหลด NST Checklist (PDF)", zh: "↓ 下载 NST 清单 (PDF)" })}
          </a>
        </div>
        {/* NST Photo Strip — ASEAN CSCO workshop photos + field shots */}
        <div className="photo-strip" style={{ marginTop: "1.25rem" }}>
          <div className="photo-strip-item" style={{ width: "240px", height: "150px" }}>
            <ResponsiveImage
              src="/Nakhon Si Thammarat/FB_IMG_1763702950339.jpg"
              alt={translate(locale, { en: "ASEAN CSCO team at NST's ICT & CCTV Command Center during the 2025 workshop", th: "ทีม ASEAN CSCO ที่ศูนย์บัญชาการ ICT และ CCTV ของนครศรีธรรมราช ในงาน workshop ปี 2025", zh: "ASEAN CSCO 团队在 NST 的 ICT 与 CCTV 指挥中心参观（2025 年研讨会）" })}
              sizes="240px"
            />
            <span className="photo-strip-label">{translate(locale, { en: "Command centre", th: "ศูนย์บัญชาการ", zh: "指挥中心" })}</span>
          </div>
          <div className="photo-strip-item" style={{ width: "240px", height: "150px" }}>
            <ResponsiveImage
              src="/Nakhon Si Thammarat/1763875143668.jpg"
              alt={translate(locale, { en: "NST officials monitoring live flood CCTV feeds at the city command centre", th: "เจ้าหน้าที่นครฯ เฝ้าระวัง CCTV น้ำท่วมแบบเรียลไทม์ที่ศูนย์บัญชาการเมือง", zh: "NST 官员在城市指挥中心实时监控洪涝 CCTV 画面" })}
              sizes="240px"
            />
            <span className="photo-strip-label">{translate(locale, { en: "Flood monitoring", th: "เฝ้าระวังน้ำท่วม", zh: "洪涝监控" })}</span>
          </div>
          <div className="photo-strip-item" style={{ width: "240px", height: "150px" }}>
            <ResponsiveImage
              src="/Nakhon Si Thammarat/1763875144974.jpg"
              alt={translate(locale, { en: "Real-time hydrological data dashboard at the NST smart city operations centre", th: "แดชบอร์ดข้อมูลอุทกวิทยาแบบเรียลไทม์ที่ศูนย์ปฏิบัติการเมืองอัจฉริยะนครศรีธรรมราช", zh: "NST 智慧城市运营中心的实时水文数据仪表板" })}
              sizes="240px"
            />
            <span className="photo-strip-label">{translate(locale, { en: "Hydro dashboard", th: "แดชบอร์ดน้ำ", zh: "水文仪表板" })}</span>
          </div>
          <div className="photo-strip-item" style={{ width: "240px", height: "150px" }}>
            <ResponsiveImage
              src="/Nakhon Si Thammarat/1763875528673.jpg"
              alt={translate(locale, { en: "ASEAN CSCO workshop delegation in front of Nakhon Si Thammarat Municipality", th: "คณะผู้เข้าร่วมอบรม ASEAN CSCO หน้าเทศบาลนครนครศรีธรรมราช", zh: "ASEAN CSCO 研讨团在那空是贪玛叻市政大楼前合影" })}
              sizes="240px"
            />
            <span className="photo-strip-label">{translate(locale, { en: "ASEAN CSCO workshop", th: "อบรม ASEAN CSCO", zh: "ASEAN CSCO 研讨" })}</span>
          </div>
        </div>
        <p className="showcase-source-note">
          {translate(locale, {
            en: "Outcome figures below are reported in municipal case materials, nomination files, and the ASEAN CSCO case-study stack. They are presented here as documented case evidence, not as live telemetry.",
            th: "ตัวเลขผลลัพธ์ด้านล่างมาจากเอกสารกรณีศึกษาของเทศบาล เอกสารเสนอรับรอง และชุดกรณีศึกษา ASEAN CSCO เรานำเสนอในฐานะหลักฐานจากเอกสาร ไม่ใช่ telemetry แบบสด",
            zh: "下方结果数据来自市政案例材料、提名文件与 ASEAN CSCO 案例资料。这里把它们当作文档化证据呈现，而不是实时遥测数据。",
          })}
        </p>
      </section>

      {/* ─── TABBED BODY ─── */}
      <DossierTabs
        locale={locale}
        labels={[
          translate(locale, { en: "At a Glance", th: "ภาพรวม", zh: "概览" }),
          translate(locale, { en: "Leadership", th: "ผู้นำ", zh: "领导力" }),
          translate(locale, { en: "Practice", th: "แนวปฏิบัติ", zh: "实践" }),
          translate(locale, { en: "Evidence", th: "หลักฐาน", zh: "证据" }),
        ]}
      >
        {/* ── TAB 1: At a Glance ── */}
        <div className="showcase-tab-panel">
          <section className="section showcase-metric-section">
            <div className="showcase-metric-grid">
              {metrics.map(metric => (
                <div key={metric.value + metric.label.en} className="showcase-metric-card">
                  <div className="showcase-metric-value">{metric.value}</div>
                  <div className="showcase-metric-label">{translate(locale, metric.label)}</div>
                </div>
              ))}
            </div>
          </section>
          <section className="section showcase-pillar-section">
            <p className="eyebrow">{translate(locale, { en: "SCITI 2026 pillar profile", th: "โปรไฟล์เสาหลัก SCITI 2026", zh: "SCITI 2026 支柱画像" })}</p>
            <ShowcasePillarProfile locale={locale} />
          </section>
        </div>

        {/* ── TAB 2: Leadership ── */}
        <div className="showcase-tab-panel">
          <section className="section showcase-summary-section">
            <div className="showcase-summary-grid">
              <article className="showcase-summary-card">
                <p className="showcase-card-kicker">{translate(locale, { en: "Leadership", th: "ภาวะผู้นำ", zh: "领导力" })}</p>
                <h2>{translate(locale, { en: "Mayor Kanop Ketchart", th: "นายกกณพ เกตุชาติ", zh: "กณพ เกตุชาติ 市长" })}</h2>
                <div className="showcase-mayor-photo">
                  <ResponsiveImage
                    src="/Nakhon Si Thammarat/FB_IMG_1769074736483.jpg"
                    alt={translate(locale, { en: "Mayor Kanop Ketchart at Nakhon Si Thammarat City Hall", th: "นายกกณพ เกตุชาติ ณ เทศบาลนครนครศรีธรรมราช", zh: "กณพ เกตุชาติ 市长在那空是贪玛叻市政厅" })}
                    sizes="(max-width: 600px) 100vw, 420px"
                  />
                </div>
                <p>
                  {translate(locale, {
                    en: "The city story only makes sense if leadership is understood as a listening system. The mayor's role here is not technological heroism. It is repeated contact, direct explanation, and willingness to make the service loop visible.",
                    th: "เรื่องของเมืองนี้จะเข้าใจไม่ได้เลย ถ้าไม่มองผู้นำเป็นระบบการฟัง บทบาทของนายกที่นี่ไม่ใช่วีรกรรมทางเทคโนโลยี แต่คือการลงไปสัมผัสซ้ำๆ อธิบายตรงๆ และยอมให้วงจรบริการถูกมองเห็น",
                    zh: "如果不把领导力理解成一种「倾听系统」，这座城市的故事就讲不通。这里的市长角色不是技术英雄，而是反复接触、直接解释，并愿意把服务闭环摆到明面上。",
                  })}
                </p>
                <blockquote className="showcase-quote">
                  {translate(locale, {
                    en: "\"You don't push high technology to people. Show them the benefit. They decide.\"",
                    th: "\"คุณไม่ผลักเทคโนโลยีสูงให้คน แสดงประโยชน์ให้เขาเห็น แล้วให้เขาตัดสินใจ\"",
                    zh: "\"你不能把高科技硬塞给人。先让他们看到好处，再由他们自己决定。\"",
                  })}
                </blockquote>
              </article>

              <article className="showcase-summary-card">
                <p className="showcase-card-kicker">{translate(locale, { en: "Why it works", th: "ทำไมมันเวิร์ก", zh: "为什么有效" })}</p>
                <h2>{translate(locale, { en: "The system closes the loop", th: "ระบบมันปิดลูปได้", zh: "这套系统能闭环" })}</h2>
                <p>
                  {translate(locale, {
                    en: "The interesting part is not that the city has an app. Plenty of cities have apps. The interesting part is that reports, ratings, flood alerts, service teams, and public communication are tied together tightly enough to change behavior.",
                    th: "จุดที่น่าสนใจไม่ใช่ว่าเมืองนี้มีแอป เพราะหลายเมืองก็มีแอป จุดที่น่าสนใจคือการที่รายงาน คะแนน เตือนน้ำท่วม ทีมปฏิบัติงาน และการสื่อสารสาธารณะ ถูกมัดเข้าด้วยกันแน่นพอที่จะเปลี่ยนพฤติกรรมได้",
                    zh: "真正有意思的不是这座城市「有一个应用」，因为很多城市都有。关键在于报修、评分、洪水预警、执行团队与公共沟通被绑得足够紧，足以改变行为。",
                  })}
                </p>
              </article>

              <article className="showcase-summary-card">
                <p className="showcase-card-kicker">{translate(locale, { en: "Why it matters", th: "ทำไมมันสำคัญ", zh: "为什么重要" })}</p>
                <h2>{translate(locale, { en: "This is a copyable model", th: "นี่คือโมเดลที่ลอกได้", zh: "这是一个可复制模型" })}</h2>
                <p>
                  {translate(locale, {
                    en: "Nothing on this page depends on being Bangkok, being rich, or buying exotic infrastructure first. That is why this city shows up as a showcase: the logic is modular, local-government scale, and teachable.",
                    th: "ไม่มีอะไรบนหน้านี้ที่ต้องอาศัยการเป็นกรุงเทพฯ การมีเงินหนา หรือการซื้อโครงสร้างพื้นฐานแปลกๆ ก่อน นี่แหละเหตุผลที่เมืองนี้ถูกยกเป็นต้นแบบ: ตรรกะมันเป็นโมดูล ขนาดเหมาะกับท้องถิ่น และสอนต่อได้",
                    zh: "本页没有任何一件事要求你必须是曼谷、必须很有钱，或必须先买一堆稀奇基础设施。这正是它成为样板的原因：逻辑是模块化的，适合地方政府规模，而且可以教、可以学、可以复制。",
                  })}
                </p>
              </article>
            </div>
          </section>

          {/* ── Progress metrics ── */}
          <section className="section showcase-progress-section">
            <p className="eyebrow">{translate(locale, { en: "Measured progress", th: "ความก้าวหน้าที่วัดได้", zh: "可量化的进展" })}</p>
            <h2>{translate(locale, { en: "Before and after, in numbers", th: "ก่อนและหลัง เป็นตัวเลข", zh: "用数字看前后" })}</h2>
            <div className="showcase-progress-grid">
              {/* Citizen trust: 41% → 70% */}
              <div className="showcase-progress-block">
                <div className="showcase-progress-label">{translate(locale, { en: "Citizen trust", th: "ความไว้วางใจประชาชน", zh: "市民信任度" })}</div>
                <svg className="showcase-progress-svg" viewBox="0 0 220 66" aria-hidden="true">
                  <text x="0" y="11" style={{font:"500 8px var(--mono)",fill:"var(--3)"}}>BEFORE</text>
                  <rect x="0" y="16" width="220" height="9" fill="var(--5,#E5E5E5)"/>
                  <rect x="0" y="16" width="90" height="9" fill="var(--3,#9b9b9b)"/>
                  <text x="94" y="24" style={{font:"600 8px var(--mono)",fill:"var(--3)"}}>41%</text>
                  <text x="0" y="43" style={{font:"500 8px var(--mono)",fill:"var(--3)"}}>AFTER</text>
                  <rect x="0" y="48" width="220" height="9" fill="var(--5,#E5E5E5)"/>
                  <rect x="0" y="48" width="154" height="9" fill="var(--amber,#f59e0b)"/>
                  <text x="158" y="56" style={{font:"700 8px var(--mono)",fill:"var(--ink)"}}>70%</text>
                </svg>
                <div className="showcase-progress-delta">+29 pts</div>
              </div>

              {/* Resolution time: 6.2 → 2.7 days */}
              <div className="showcase-progress-block">
                <div className="showcase-progress-label">{translate(locale, { en: "Avg resolution time", th: "เวลาแก้ปัญหาเฉลี่ย", zh: "平均处理时间" })}</div>
                <svg className="showcase-progress-svg" viewBox="0 0 220 66" aria-hidden="true">
                  <text x="0" y="11" style={{font:"500 8px var(--mono)",fill:"var(--3)"}}>BEFORE</text>
                  <rect x="0" y="16" width="220" height="9" fill="var(--3,#9b9b9b)"/>
                  <text x="224" y="24" style={{font:"600 8px var(--mono)",fill:"var(--3)"}}>6.2d</text>
                  <text x="0" y="43" style={{font:"500 8px var(--mono)",fill:"var(--3)"}}>AFTER</text>
                  <rect x="0" y="48" width="220" height="9" fill="var(--5,#E5E5E5)"/>
                  <rect x="0" y="48" width="96" height="9" fill="var(--amber,#f59e0b)"/>
                  <text x="100" y="56" style={{font:"700 8px var(--mono)",fill:"var(--ink)"}}>2.7d</text>
                </svg>
                <div className="showcase-progress-delta">−56%</div>
              </div>

              {/* Flood fatalities */}
              <div className="showcase-progress-block">
                <div className="showcase-progress-label">{translate(locale, { en: "Flood fatalities", th: "ผู้เสียชีวิตจากน้ำท่วม", zh: "洪灾死亡人数" })}</div>
                <div className="showcase-zero-stat">
                  <span className="showcase-zero-num">0</span>
                  <span className="showcase-zero-sub">{translate(locale, { en: "since 2021 — 10-hour warning live", th: "ตั้งแต่ปี 2564 — ระบบเตือน 10 ชั่วโมงทำงาน", zh: "自 2021 年预警系统上线以来" })}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Milestones timeline ── */}
          <section className="section showcase-milestones-section">
            <p className="eyebrow">{translate(locale, { en: "Timeline", th: "ไทม์ไลน์", zh: "时间线" })}</p>
            <h2>{translate(locale, { en: "How the transformation unfolded", th: "ความเปลี่ยนแปลงเกิดขึ้นอย่างไร", zh: "变革如何一步步展开" })}</h2>
            <div className="showcase-timeline">
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2019</span>
                <span className="showcase-timeline-text">{translate(locale, { en: "@NakhonCity LINE OA launched — first government-citizen real-time channel in the city", th: "@NakhonCity LINE OA เปิดตัว — ช่องทางแบบเรียลไทม์ระหว่างรัฐกับประชาชนแห่งแรกของเมือง", zh: "@NakhonCity LINE OA 上线 — 城市首个政府与市民实时沟通渠道" })}</span>
              </div>
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2021</span>
                <span className="showcase-timeline-text">{translate(locale, { en: "10-hour flood early-warning system goes live; zero flood fatalities from this point forward", th: "ระบบเตือนน้ำท่วมล่วงหน้า 10 ชั่วโมงเริ่มใช้งาน ไม่มีผู้เสียชีวิตจากน้ำท่วมนับจากนั้น", zh: "10 小时洪水预警系统上线；此后洪灾死亡人数归零" })}</span>
              </div>
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2022</span>
                <span className="showcase-timeline-text">
                  {translate(locale, { en: "Thailand Smart City Solutions Award — Innovative Flood Control", th: "รางวัล Thailand Smart City Solutions Award ประเภทนวัตกรรมควบคุมน้ำท่วม", zh: "泰国智慧城市解决方案奖：创新防洪" })}
                  <span className="showcase-timeline-badge">Award</span>
                </span>
              </div>
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2023</span>
                <span className="showcase-timeline-text">
                  {translate(locale, { en: "Best Partnership Award — World Smart City Expo Korea (with depa) · Batch 3 Smart City Local certification", th: "Best Partnership Award — World Smart City Expo Korea (ร่วมกับ depa) · ได้รับตราสัญลักษณ์ Smart City Local รุ่น 3", zh: "韩国世界智慧城市博览会最佳合作奖（与 depa）· 第 3 批 Smart City Local 认证" })}
                  <span className="showcase-timeline-badge">2× Award</span>
                </span>
              </div>
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2024</span>
                <span className="showcase-timeline-text">{translate(locale, { en: "112,000+ active app users · 38,000 complaints resolved · citizen trust reaches 70%", th: "ผู้ใช้แอปกว่า 112,000 คน · แก้ปัญหาร้องเรียนกว่า 38,000 เรื่อง · ความไว้วางใจประชาชน 70%", zh: "活跃用户突破 112,000 · 处理投诉 38,000 件 · 市民信任度达到 70%" })}</span>
              </div>
              <div className="showcase-timeline-item">
                <span className="showcase-timeline-year">2025</span>
                <span className="showcase-timeline-text">
                  {translate(locale, { en: "Selected as model-city case study in the ASEAN CSCO Handbook", th: "ได้รับเลือกเป็นกรณีศึกษาเมืองต้นแบบใน ASEAN CSCO Handbook", zh: "入选 ASEAN CSCO Handbook 示范城市案例" })}
                  <span className="showcase-timeline-badge">ASEAN</span>
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ── TAB 3: Practice ── */}
        <div className="showcase-tab-panel">
          <section className="section showcase-practice-section">
            <div className="story-section-head">
              <div>
                <p className="eyebrow">{translate(locale, { en: "Steal this playbook", th: "ขโมย playbook นี้", zh: "把这套打法拿去用" })}</p>
                <h2>{translate(locale, { en: "Six ideas other cities can copy", th: "หกไอเดียที่เมืองอื่นลอกได้", zh: "其他城市能复制的六个点子" })}</h2>
              </div>
              <p className="section-intro story-section-intro">
                {translate(locale, {
                  en: "The point is not to admire the case. The point is to steal the mechanics that travel well.",
                  th: "ประเด็นไม่ใช่การชื่นชมกรณีศึกษา แต่คือการขโมยกลไกที่เอาไปใช้ที่อื่นได้",
                  zh: "重点不是欣赏这个案例，而是把那些可迁移的机制直接拿走。",
                })}
              </p>
            </div>
            <div className="showcase-idea-grid">
              {ideas.map(idea => (
                <article key={idea.id} className="showcase-idea-card">
                  <div className="showcase-idea-icon">{idea.icon}</div>
                  <div>
                    <h3 className="showcase-idea-title">{translate(locale, idea.title)}</h3>
                    <p className="showcase-idea-body">{translate(locale, idea.desc)}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "ASEAN CSCO", th: "ASEAN CSCO", zh: "ASEAN CSCO" })}</p>
            <h2>{translate(locale, { en: "What citizen-centric actually means", th: "ที่เน้นประชาชนจริงๆ หมายถึงอะไร", zh: "以市民为中心到底是什么意思" })}</h2>
            <div className="showcase-csco-grid">
              <div className="showcase-csco-card">
                <h3>{translate(locale, { en: "Start with the complaint, not the sensor.", th: "เริ่มจากข้อร้องเรียน ไม่ใช่เซ็นเซอร์", zh: "从投诉开始，不是从传感器。" })}</h3>
                <p>{translate(locale, {
                  en: "If you don't know what citizens are angry about, no amount of IoT will help. The complaint is the signal. The sensor is just the amplifier.",
                  th: "ถ้าคุณไม่รู้ว่าประชาชนโกรธเรื่องอะไร IoT มากแค่ไหนก็ไม่ช่วย ข้อร้องเรียนคือสัญญาณ เซ็นเซอร์แค่ขยายสัญญาณ",
                  zh: "如果你不知道市民在生什么气，再多物联网也没用。投诉是信号，传感器只是放大器。",
                })}</p>
              </div>
              <div className="showcase-csco-card">
                <h3>{translate(locale, { en: "If the mayor can't explain it on LINE, it's not ready.", th: "ถ้านายกอธิบายบน LINE ไม่ได้ แปลว่ายังไม่พร้อม", zh: "如果市长在LINE上解释不清楚，就还没准备好。" })}</h3>
                <p>{translate(locale, {
                  en: "The test of a smart city system is not the spec sheet. It's whether a non-technical mayor can explain the benefit to a resident in 30 seconds on a chat app.",
                  th: "การทดสอบระบบเมืองอัจฉริยะไม่ใช่สเปกชีต แต่คือนายกที่ไม่ใช่สายเทคสามารถอธิบายประโยชน์ให้ชาวบ้านเข้าใจใน 30 วินาทีบนแอปแชทได้หรือเปล่า",
                  zh: "智慧城市系统的检验标准不是规格书，而是一个非技术背景的市长能不能在聊天应用上30秒内向居民解释清楚好处。",
                })}</p>
              </div>
              <div className="showcase-csco-card">
                <h3>{translate(locale, { en: "A dashboard nobody checks is not a dashboard.", th: "แดชบอร์ดที่ไม่มีใครดู ไม่ใช่แดชบอร์ด", zh: "没人看的仪表板不是仪表板。" })}</h3>
                <p>{translate(locale, {
                  en: "Data is only useful when it changes a decision. If the dashboard exists but no staff member opens it before making a call, you built decoration, not intelligence.",
                  th: "ข้อมูลมีค่าก็ต่อเมื่อมันเปลี่ยนการตัดสินใจ ถ้าแดชบอร์ดมีอยู่แต่ไม่มีเจ้าหน้าที่เปิดดูก่อนตัดสินใจ คุณสร้างของตกแต่ง ไม่ใช่ความฉลาด",
                  zh: "数据只有改变决策时才有用。如果仪表板存在但没有工作人员在决策前打开它，你造的是装饰品，不是智能。",
                })}</p>
              </div>
            </div>
            <div style={{ marginTop: ".75rem" }}>
              <a href="https://nonarkara.github.io/asean-csco-app/" target="_blank" rel="noopener noreferrer" className="cta-button">
                {translate(locale, { en: "Open ASEAN CSCO Handbook", th: "เปิดคู่มือ ASEAN CSCO", zh: "打开 ASEAN CSCO 手册" })}
              </a>
            </div>
          </section>
        </div>

        {/* ── TAB 4: Evidence ── */}
        <div className="showcase-tab-panel">
          <section className="section showcase-proof-section">
            <div className="showcase-proof-grid">
              <article className="showcase-proof-card shadow-premium glass-card">
                <p className="showcase-card-kicker">{translate(locale, { en: "Recognition", th: "การยอมรับ", zh: "认可" })}</p>
                <h2>{translate(locale, { en: "Awards and public validation", th: "รางวัลและการยืนยันสาธารณะ", zh: "奖项与公共验证" })}</h2>
                <div className="showcase-award-list">
                  {awards.map(award => (
                    <div key={award.year + award.title.en} className="showcase-award-row">
                      <span className="showcase-award-year">{award.year}</span>
                      <span className="showcase-award-title">{translate(locale, award.title)}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="showcase-proof-card shadow-premium glass-card">
                <p className="showcase-card-kicker">{translate(locale, { en: "Before vs after", th: "ก่อน vs หลัง", zh: "前后对比" })}</p>
                <h2>{translate(locale, { en: "What changed operationally", th: "อะไรเปลี่ยนในเชิงปฏิบัติการ", zh: "运行层面改变了什么" })}</h2>
                <div className="showcase-delta-list">
                  {beforeAfterRows.map(row => (
                    <div key={row.metric.en} className="showcase-delta-row">
                      <span className="showcase-delta-metric">{translate(locale, row.metric)}</span>
                      <span className="showcase-delta-before">{translate(locale, row.before)}</span>
                      <span className="showcase-delta-after">{translate(locale, row.after)}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          </section>

          <section className="section showcase-sources-section">
            <p className="eyebrow">{translate(locale, { en: "Source stack", th: "ชุดเอกสารอ้างอิง", zh: "来源堆栈" })}</p>
            <h2>{translate(locale, { en: "What this profile is built from", th: "โปรไฟล์นี้สร้างจากอะไร", zh: "这份画像建立在什么材料上" })}</h2>
            <div className="showcase-source-grid">
              {sourceFiles.map(source => (
                <article key={source.title} className="showcase-source-card">
                  <h3 className="showcase-source-title">{source.title}</h3>
                  <p className="showcase-source-body">{translate(locale, source.note)}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="section showcase-closing-section">
            <div className="callout-card glass-card shadow-heavy">
              <h2>{translate(locale, { en: "Every city in this index can learn from Nakhon.", th: "ทุกเมืองในดัชนีนี้เรียนรู้จากนครฯ ได้", zh: "本指数里的每座城市都能从那空学到东西。" })}</h2>
              <p>
                {translate(locale, {
                  en: "The value of this page is not hero worship. It is operational clarity. A city that listens, measures, responds, and reports back will usually beat a city that buys shinier hardware and calls it innovation.",
                  th: "คุณค่าของหน้านี้ไม่ใช่การบูชาวีรบุรุษ แต่คือความชัดเชิงปฏิบัติการ เมืองที่ฟัง วัด ตอบสนอง และรายงานกลับ มักชนะเมืองที่ซื้อฮาร์ดแวร์วิบวับกว่าแล้วเรียกว่านวัตกรรม",
                  zh: "本页的价值不在于造神，而在于操作上的清晰。一个会倾听、测量、响应并反馈的城市，通常会胜过那个买了更闪设备就自称创新的城市。",
                })}
              </p>
              <div className="story-closing-actions">
                <a href="https://nonarkara.github.io/asean-csco-app/" target="_blank" rel="noopener noreferrer" className="cta-button">
                  {translate(locale, { en: "Open ASEAN CSCO Handbook", th: "เปิดคู่มือ ASEAN CSCO", zh: "打开 ASEAN CSCO 手册" })}
                </a>
                <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
                  {translate(locale, { en: "Back to rankings", th: "กลับไปอันดับ", zh: "返回排名" })}
                </button>
              </div>
            </div>
          </section>
        </div>
      </DossierTabs>
    </div>
  );
}
