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
    icon: "01",
    title: { en: "Hospital on Wheels", th: "โรงพยาบาลเคลื่อนที่", zh: "移动医院" },
    desc: {
      en: "A mobile medical unit with doctors, nurses, pharmacists, and telemedicine support. It reaches underserved neighborhoods without waiting for a new clinic building.",
      th: "หน่วยแพทย์เคลื่อนที่ที่มีหมอ พยาบาล เภสัชกร และระบบการแพทย์ทางไกล ไปถึงชุมชนที่บริการเข้าไม่ถึง โดยไม่ต้องรอสร้างคลินิกใหม่",
      zh: "配备医生、护士、药师与远程医疗支持的移动医疗单元，不必等新诊所盖好就能进入服务不足社区。",
    },
  },
  {
    id: "digital-catalog",
    icon: "02",
    title: { en: "Digital catalog for street vendors", th: "แคตตาล็อกดิจิทัลสำหรับพ่อค้าแม่ค้า", zh: "街头商贩数字目录" },
    desc: {
      en: "A QR-based storefront layer for local merchants. The point is not e-commerce theatre; it is giving informal vendors a low-friction way into the digital economy.",
      th: "ชั้นหน้าร้านแบบ QR สำหรับผู้ค้ารายย่อย ประเด็นไม่ใช่ละครอีคอมเมิร์ซ แต่คือการให้พ่อค้าแม่ค้าเข้าระบบเศรษฐกิจดิจิทัลได้อย่างง่ายดาย",
      zh: "基于 QR 的数字店面层，重点不是电商表演，而是让非正规摊贩以极低门槛进入数字经济。",
    },
  },
  {
    id: "mayors-classroom",
    icon: "03",
    title: { en: "Mayor's classroom", th: "ห้องเรียนนายก", zh: "市长课堂" },
    desc: {
      en: "A recurring live Q&A on LINE where the mayor answers residents directly. It matters because the digital channel is used for accountability, not just announcements.",
      th: "ไลฟ์ถามตอบบน LINE ที่นายกตอบประชาชนโดยตรง จุดสำคัญคือช่องทางดิจิทัลถูกใช้เพื่อ accountability ไม่ใช่แค่ประกาศข่าว",
      zh: "市长通过 LINE 进行定期直播问答。关键不是直播本身，而是数字渠道被用来承担问责，而不只是发布公告。",
    },
  },
  {
    id: "citizen-rating",
    icon: "04",
    title: { en: "5-star citizen rating", th: "คะแนนบริการ 5 ดาว", zh: "五星市民评分" },
    desc: {
      en: "Residents rate service interactions in real time. That turns satisfaction from a ceremonial survey into an operating metric staff have to look at.",
      th: "ประชาชนให้คะแนนบริการแบบเรียลไทม์ ทำให้ความพึงพอใจไม่ใช่แบบสอบถามพิธีการ แต่กลายเป็นตัวชี้วัดที่เจ้าหน้าที่ต้องเห็น",
      zh: "居民实时给服务打分，让满意度不再是仪式性的问卷，而变成工作人员必须面对的运行指标。",
    },
  },
  {
    id: "metaverse-classroom",
    icon: "05",
    title: { en: "Metaverse classroom", th: "ห้องเรียนเมตาเวิร์ส", zh: "元宇宙课堂" },
    desc: {
      en: "AR and VR were pushed into an actual school system with trained teachers and repeatable digital lesson content. That makes it a curriculum decision, not a gadget demo.",
      th: "AR/VR ถูกดันเข้าไปอยู่ในระบบโรงเรียนจริง มีครูที่ผ่านการอบรมและมีเนื้อหาบทเรียนดิจิทัลที่ใช้ซ้ำได้ นี่จึงเป็นเรื่องหลักสูตร ไม่ใช่ demo gadget",
      zh: "AR/VR 被推进到真正的学校系统里，有受训教师与可重复使用的数字课程内容，所以它是课程决策，不是设备演示。",
    },
  },
  {
    id: "flood-warning",
    icon: "06",
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
    title: "NST Report.docx",
    note: {
      en: "Detailed municipal case-study report detailing AI healthcare, personalized STEM education initiatives, civic feedback loops, and alternative OPEX financing strategies.",
      th: "รายงานกรณีศึกษาเทศบาลอย่างละเอียด ครอบคลุมระบบสุขภาพ AI, นวัตกรรมระบบการเรียนรู้ STEM เฉพาะบุคคล, วงจรสะท้อนข้อมูลประชาชน และกลยุทธ์การเงินแบบ OPEX",
      zh: "详细的市政案例研究报告，阐述了 AI 医疗保健、个性化 STEM 教育倡议、市民反馈闭环以及替代性 OPEX 融资策略。",
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
  { year: "2023", title: { en: "Best Partnership Award — World Smart City Expo, Goyang, Korea (with depa)", th: "Best Partnership Award — World Smart City Expo, โกยัง, เกาหลีใต้ (ร่วมกับ depa)", zh: "最佳合作奖：韩国高阳世界智慧城市博览会（与 depa）" } },
  { year: "2023", title: { en: "Batch 3 Smart City Local certification — depa", th: "ตราสัญลักษณ์ Smart City Local รุ่น 3 — depa", zh: "第 3 批 Smart City Local 认证 — depa" } },
  { year: "2025", title: { en: "ASEAN CSCO Handbook — model-city case study", th: "ASEAN CSCO Handbook — กรณีศึกษาเมืองต้นแบบ", zh: "ASEAN CSCO Handbook — 示范城市案例" } },
  { year: "2025", title: { en: "Tomorrow.City Shanghai — Thailand's featured smart city", th: "Tomorrow.City Shanghai — เมืองอัจฉริยะตัวแทนไทย", zh: "Tomorrow.City 上海 — 泰国代表智慧城市" } },
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
          <div className="photo-strip-item" style={{ width: "240px", height: "150px" }}>
            <ResponsiveImage
              src="/Nakhon Si Thammarat/asean-csco-hydro-data-wall.jpg"
              alt={translate(locale, { en: "ASEAN CSCO delegation viewing real-time hydrological data on the NST CCTV command wall — the exact system that drives the 10-hour flood warning", th: "คณะ ASEAN CSCO ชมข้อมูลอุทกวิทยาแบบเรียลไทม์บนกำแพง CCTV ของนครฯ ซึ่งเป็นระบบเดียวกับที่ขับเคลื่อนการเตือนน้ำท่วม 10 ชั่วโมง", zh: "ASEAN CSCO 代表团查看 NST CCTV 指挥墙上的实时水文数据——正是驱动 10 小时洪水预警的系统" })}
              sizes="240px"
            />
            <span className="photo-strip-label">{translate(locale, { en: "Real-time hydrology wall", th: "กำแพงข้อมูลน้ำแบบสด", zh: "实时水文数据墙" })}</span>
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

          {/* ── Portrait intro ── */}
          <section className="section">
            <div className="showcase-leader-intro">
              <div className="showcase-mayor-photo">
                <ResponsiveImage
                  src="/Nakhon Si Thammarat/nst-town-hall-with-dr-non.jpg"
                  alt={translate(locale, { en: "Dr. Kanop Ketchart at a Nakhon Si Thammarat community town hall — the participatory governance style that defines his tenure", th: "ดร.กณพ เกตุชาติ ในเวทีประชาคมนครศรีธรรมราช — รูปแบบการปกครองแบบมีส่วนร่วมที่เป็นเอกลักษณ์ของวาระนี้", zh: "กณพ เกตุชาติ博士在那空是贪玛叻社区市政厅——其任期内标志性的参与式治理风格" })}
                  sizes="100vw"
                  style={{ objectPosition: "center 40%" }}
                />
              </div>
              <div>
                <p className="eyebrow">{translate(locale, { en: "Leader", th: "ผู้นำ", zh: "领导人" })}</p>
                <h2 className="showcase-leader-name">
                  {translate(locale, { en: "Dr. Kanop Ketchart", th: "ดร.กณพ เกตุชาติ", zh: "กณพ เกตุชาติ博士" })}
                </h2>
                <p className="showcase-leader-title-sub">
                  {translate(locale, {
                    en: "Mayor, Nakhon Si Thammarat Municipality · In office since 2020",
                    th: "นายกเทศมนตรีนครนครศรีธรรมราช · ดำรงตำแหน่งตั้งแต่ปี 2563",
                    zh: "那空是贪玛叻市长 · 自 2020 年起任职",
                  })}
                </p>
                <div className="showcase-pull-block">
                  <p className="showcase-pull-quote">
                    {translate(locale, {
                      en: "If you build something residents don't use, you haven't solved anything. The technology is not the product. The trust is the product.",
                      th: "ถ้าคุณสร้างสิ่งที่ชาวบ้านไม่ใช้ คุณก็ยังไม่ได้แก้อะไร เทคโนโลยีไม่ใช่ผลิตภัณฑ์ ความไว้วางใจต่างหากที่คือผลิตภัณฑ์",
                      zh: "如果你建了一个居民不用的东西，你什么都没解决。科技不是产品，信任才是。",
                    })}
                  </p>
                  <p className="showcase-pull-source">WeCitizens Thailand, March 2025</p>
                </div>
                <p>
                  {translate(locale, {
                    en: "Dr. Kanop Ketchart took office in a city that had the infrastructure for smart governance and no pathway to it. The LINE OA account existed. The CCTV cameras existed. The waterworks that kept prices lower than any other city in the South existed. What was missing was a commitment to connect them, explain them, and maintain them as a public service rather than a set of government projects.",
                    th: "ดร.กณพ เกตุชาติ เข้ารับตำแหน่งในเมืองที่มีโครงสร้างพื้นฐานพร้อมสำหรับธรรมาภิบาลอัจฉริยะ แต่ยังไม่มีทางไปถึงมัน บัญชี LINE OA ทางการมีอยู่แล้ว กล้องวงจรปิดมีอยู่แล้ว ระบบประปาที่ทำให้ราคาน้ำถูกที่สุดในภาคใต้มีอยู่แล้ว สิ่งที่ขาดหายไปคือความมุ่งมั่นที่จะเชื่อมโยงสิ่งเหล่านี้ อธิบายมัน และดูแลรักษาในฐานะบริการสาธารณะ ไม่ใช่แค่ชุดโครงการของรัฐ",
                    zh: "กณพ เกตุชาติ博士上任时，这座城市已拥有智慧治理的基础设施，却缺少通往它的路径。官方LINE OA已经存在，监控摄像头已经存在，让水价低于南部所有城市的自来水厂也已经存在。缺少的是一种承诺——将它们连接起来、解释清楚，并作为公共服务持续维护，而不只是一批政府项目。",
                  })}
                </p>
              </div>
            </div>
          </section>

          {/* ── 99,918 users ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "Near-saturation", th: "เกือบครบทุกคน", zh: "近乎全覆盖" })}</p>
            <h2>{translate(locale, { en: "99,918 users in a city of 110,000", th: "99,918 ผู้ใช้ในเมืองที่มีประชากร 110,000 คน", zh: "11 万人口，9.9 万用户" })}</h2>
            <div className="showcase-data-callout">
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">99,918</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "LINE OA subscribers, March 2025", th: "ผู้ติดตาม LINE OA มีนาคม 2568", zh: "LINE OA 订阅用户（2025年3月）" })}</span>
              </div>
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">110k</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Total city population", th: "ประชากรในเขตเทศบาล", zh: "城市人口总数" })}</span>
              </div>
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">80%+</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Adoption vs 20% industry avg", th: "สัดส่วนการใช้งาน เทียบ 20% ค่าเฉลี่ยอุตสาหกรรม", zh: "采用率，行业均值仅 20%" })}</span>
              </div>
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">48h</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Guaranteed response with photo proof", th: "รับประกันการตอบสนองพร้อมหลักฐานภาพ", zh: "承诺响应时限，附修复照片为证" })}</span>
              </div>
            </div>
            <p>
              {translate(locale, {
                en: "This number — recorded in March 2025 — describes near-saturation. In most Thai cities, government digital platforms reach 20% of residents at best. In Nakhon Si Thammarat, it is above 80% of eligible adults. Nearly every adult in the city has the municipality in their pocket: not a forgotten app, but an active daily channel for real-time flood warnings, queue bookings, road repair reports, and live CCTV access.",
                th: "ตัวเลขนี้ — บันทึกในเดือนมีนาคม 2568 — สะท้อนสภาพที่เกือบครบทุกคนแล้ว ในเมืองส่วนใหญ่ของไทย แพลตฟอร์มดิจิทัลของรัฐเข้าถึงประชาชนได้ดีที่สุดเพียง 20% ที่นครศรีธรรมราช ตัวเลขนี้อยู่ที่กว่า 80% ของผู้ใหญ่ที่มีสิทธิ์ใช้งาน แทบทุกผู้ใหญ่ในเมืองมีเทศบาลฯ อยู่ในมือถือ ไม่ใช่แอปที่โหลดแล้วลืม แต่เป็นช่องทางที่ใช้งานทุกวัน สำหรับรับการแจ้งเตือนน้ำท่วมแบบเรียลไทม์ จองคิวทำธุรกรรม แจ้งซ่อมถนน และดูกล้องวงจรปิดสด",
                zh: "这个数字——记录于2025年3月——描绘的是接近饱和的状态。泰国多数城市的政府数字平台顶多覆盖20%的居民。那空是贪玛叻的覆盖率超过适龄成人的80%。几乎每位成年人的手机里都装着市政府——不是装了就忘的应用，而是每天使用的活跃渠道：实时洪水预警、事务预约、道路修缮报告和实时监控画面。",
              })}
            </p>
            <p>
              {translate(locale, {
                en: "The gap between 80% and 20% is not explained by demographics, digital literacy, or city size. It is explained by one commitment the mayor made publicly and kept consistently: every complaint submitted through the system gets a response within 48 hours, with a photograph of the completed fix sent back to the resident. The service loop is visible and closed.",
                th: "ช่องว่างระหว่าง 80% กับ 20% ไม่ได้อธิบายด้วยโครงสร้างประชากร ความรู้ด้านดิจิทัล หรือขนาดของเมือง แต่อธิบายด้วยพันธสัญญาหนึ่งที่นายกฯ ประกาศต่อสาธารณะและรักษาอย่างสม่ำเสมอ: ทุกปัญหาที่ส่งผ่านระบบจะได้รับการตอบสนองภายใน 48 ชั่วโมง พร้อมถ่ายรูปแก้ไขส่งกลับให้ประชาชน วงจรบริการมองเห็นได้และปิดครบ",
                zh: "80%与20%的差距，不能用人口结构、数字素养或城市规模来解释。解释它的，是市长公开承诺并始终兑现的一件事：通过系统提交的每一条投诉，48小时内必有回复，并附上修复完成的照片发回给居民。服务闭环清晰可见，且真正闭合。",
              })}
            </p>
            <div className="showcase-pull-block">
              <p className="showcase-pull-quote">
                {translate(locale, {
                  en: "We will resolve every complaint within 48 hours — with a photo of the fix sent back. That is not a slogan. That is a contract.",
                  th: "เราจะแก้ข้อร้องเรียนทุกเรื่องภายใน 48 ชั่วโมง พร้อมถ่ายรูปส่งกลับ นั่นไม่ใช่สโลแกน นั่นคือสัญญา",
                  zh: "我们将在48小时内解决每一条投诉——并附上修复照片回传。这不是口号，这是契约。",
                })}
              </p>
              <p className="showcase-pull-source">
                {translate(locale, { en: "Dr. Kanop Ketchart · WeCitizens Thailand interview, 2025", th: "ดร.กณพ เกตุชาติ · สัมภาษณ์ WeCitizens Thailand, 2568", zh: "กณพ เกตุชาติ博士 · WeCitizens Thailand 专访，2025" })}
              </p>
            </div>
          </section>

          {/* ── Mayor photo strip ── */}
          <div className="photo-strip" style={{ marginBottom: "0" }}>
            <div className="photo-strip-item" style={{ width: "280px", height: "180px" }}>
              <ResponsiveImage
                src="/Nakhon Si Thammarat/mayor-kanop-running.jpg"
                alt={translate(locale, { en: "Dr. Kanop on his morning run with city staff — a weekly ritual for informal operations discussion", th: "ดร.กณพ วิ่งตอนเช้ากับเจ้าหน้าที่เทศบาล — กิจกรรมรายสัปดาห์สำหรับหารืองานแบบไม่เป็นทางการ", zh: "กณพ博士与市政工作人员的晨跑——每周例行非正式城务讨论" })}
                sizes="280px"
              />
              <span className="photo-strip-label">{translate(locale, { en: "Weekly morning run", th: "วิ่งตอนเช้ารายสัปดาห์", zh: "每周晨跑" })}</span>
            </div>
            <div className="photo-strip-item" style={{ width: "280px", height: "180px" }}>
              <ResponsiveImage
                src="/Nakhon Si Thammarat/mayor-kanop-ioc-2024.jpg"
                alt={translate(locale, { en: "Inside the @NakhonCity IOC — the CCTV wall driving both flood monitoring and real-time city operations", th: "ภายในศูนย์ IOC @NakhonCity — กำแพง CCTV ที่ขับเคลื่อนการเฝ้าระวังน้ำท่วมและปฏิบัติการเมืองแบบเรียลไทม์", zh: "@NakhonCity IOC 内部——驱动洪水监控与实时城市运营的监控墙" })}
                sizes="280px"
              />
              <span className="photo-strip-label">{translate(locale, { en: "@NakhonCity IOC, 2024", th: "ศูนย์ IOC @NakhonCity, 2567", zh: "@NakhonCity IOC，2024" })}</span>
            </div>
            <div className="photo-strip-item" style={{ width: "280px", height: "180px" }}>
              <ResponsiveImage
                src="/Nakhon Si Thammarat/mayor-kanop-town-hall.jpg"
                alt={translate(locale, { en: "Mayor Kanop and Dr. Non Arkara at a city-hall strategic review — where the ASEAN CSCO case study framework was discussed", th: "นายกกณพและ ดร.นนท์ อาคารา ในการประชุมทบทวนกลยุทธ์ที่ศาลาว่าการ — ที่กรอบ ASEAN CSCO ถูกหารือ", zh: "กณพ市长与 ดร.นนท์ 在市政厅战略评审——讨论 ASEAN CSCO 框架的会议" })}
                sizes="280px"
              />
              <span className="photo-strip-label">{translate(locale, { en: "Strategic review", th: "ประชุมทบทวนกลยุทธ์", zh: "战略评审" })}</span>
            </div>
            <div className="photo-strip-item" style={{ width: "280px", height: "180px" }}>
              <ResponsiveImage
                src="/Nakhon Si Thammarat/mayor-kanop-speaking-depa-session.jpg"
                alt={translate(locale, { en: "Dr. Kanop mid-argument at a depa session — hands moving, explaining the people-centric model with characteristic directness", th: "ดร.กณพ กำลังอธิบายในงาน depa — มือเคลื่อนไหว อธิบายแบบจำลองที่เน้นประชาชนด้วยความตรงไปตรงมา", zh: "กณพ博士在 depa 会议上发言——边打手势边以一贯的直接风格阐释以人为中心的模式" })}
                sizes="280px"
              />
              <span className="photo-strip-label">{translate(locale, { en: "People-centric argument", th: "อธิบายแนวคิดเน้นประชาชน", zh: "以人为中心的阐述" })}</span>
            </div>
          </div>

          {/* ── Why LINE, not an app ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "Design decision", th: "การตัดสินใจออกแบบ", zh: "设计决策" })}</p>
            <h2>{translate(locale, { en: "Meet residents where they already are", th: "ไปหาประชาชนในที่ที่เขาอยู่อยู่แล้ว", zh: "去居民本就在的地方" })}</h2>
            <div className="showcase-data-callout">
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">฿2.50</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Water per unit — city waterworks", th: "ค่าน้ำต่อหน่วย — ประปาเทศบาล", zh: "每单位水价——市营自来水" })}</span>
              </div>
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">฿11</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Water per unit — regional authority", th: "ค่าน้ำต่อหน่วย — องค์กรส่วนภูมิภาค", zh: "每单位水价——区域机构" })}</span>
              </div>
              <div className="showcase-data-callout-cell">
                <span className="showcase-data-callout-num">67→20</span>
                <span className="showcase-data-callout-label">{translate(locale, { en: "Vet field rounds per cycle after going online", th: "รอบออกพื้นที่ของสัตวแพทย์ หลังย้ายออนไลน์", zh: "在线化后兽医现场出勤次数/轮" })}</span>
              </div>
            </div>
            <p>
              {translate(locale, {
                en: "Other provinces had built custom apps for citizen reporting. Most of those apps sat unused. They required downloads, logins, and learning a new interface — friction that government enthusiasm generated but resident attention would not pay. Nakhon Si Thammarat chose the platform with 70 million Thai users already on it.",
                th: "จังหวัดอื่นๆ ได้สร้างแอปเฉพาะสำหรับรายงานของประชาชน แอปส่วนใหญ่ไม่ถูกใช้งาน ต้องการการดาวน์โหลด การล็อกอิน และการเรียนรู้อินเทอร์เฟซใหม่ — ความยุ่งยากที่ความกระตือรือร้นของรัฐสร้างขึ้น แต่ความสนใจของประชาชนไม่ยอมจ่าย นครศรีธรรมราชเลือกแพลตฟอร์มที่คนไทยกว่า 70 ล้านคนอยู่บนนั้นแล้ว",
                zh: "其他省份建了专属市民报告应用，大多数无人问津。它们需要下载、注册、学习新界面——政府的热情制造了摩擦，居民的注意力不会为此买单。那空是贪玛叻选择了一个已有7000万泰国用户的平台。",
              })}
            </p>
            <p>
              {translate(locale, {
                en: "The same logic extended to water pricing and veterinary services. The city's self-operated waterworks were already cheaper than the regional authority at ฿2.50 versus ฿11 per unit, but most residents did not know it. Field rounds for government vets dropped from 67 per cycle to 20 after the service moved online. The technology did not create the benefit. It made the existing benefit legible.",
                th: "ตรรกะเดียวกันนี้ขยายไปถึงราคาน้ำและบริการสัตวแพทย์ ระบบประปาที่ดำเนินการเองของเมืองถูกกว่าองค์กรส่วนภูมิภาคอยู่แล้ว ที่ ฿2.50 เทียบกับ ฿11 ต่อหน่วย แต่ประชาชนส่วนใหญ่ไม่รู้ รอบการออกพื้นที่ของสัตวแพทย์รัฐลดลงจาก 67 ครั้งต่อรอบเหลือ 20 ครั้ง หลังบริการย้ายไปออนไลน์ เทคโนโลยีไม่ได้สร้างประโยชน์ขึ้นมา แต่ทำให้ประโยชน์ที่มีอยู่แล้วมองเห็นได้",
                zh: "同样的逻辑延伸到水价和兽医服务。市营自来水本就比区域机构便宜——每单位฿2.50对฿11，但大多数居民并不知道。服务移至线上后，政府兽医每轮现场出勤次数从67次降至20次。技术没有创造效益，而是让原本存在的效益变得清晰可见。",
              })}
            </p>
          </section>

          {/* ── Flood zero ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "Flood intelligence", th: "ระบบข้อมูลน้ำท่วม", zh: "洪水预警系统" })}</p>
            <h2>{translate(locale, { en: "A 10-hour warning window that changed everything", th: "หน้าต่างเตือนภัย 10 ชั่วโมงที่เปลี่ยนทุกอย่าง", zh: "10 小时预警窗口，改变了一切" })}</h2>
            <p>
              {translate(locale, {
                en: "Before 2021, a flood event in Nakhon Si Thammarat meant four days of water. The city responded after the fact — assessing damage, deploying teams, waiting for levels to drop. The data that changed this was already there. Traffic CCTV cameras were redirected to monitor canals, flood-prone intersections, and upstream water gates. Upstream sensors provided the trigger points. The LINE OA channel already reached virtually every resident.",
                th: "ก่อนปี 2564 เหตุการณ์น้ำท่วมในนครศรีธรรมราชหมายถึงสี่วันของการแช่น้ำ เมืองตอบสนองหลังเหตุการณ์เกิดขึ้น — ประเมินความเสียหาย ส่งทีมลงพื้นที่ รอให้ระดับน้ำลง ข้อมูลที่เปลี่ยนทุกอย่างนั้นมีอยู่แล้ว กล้องวงจรปิดถูกหันไปส่องคลอง จุดน้ำท่วมซ้ำซาก และประตูน้ำต้นน้ำ เซ็นเซอร์ต้นน้ำให้จุดกระตุ้น และช่อง LINE OA เข้าถึงประชาชนเกือบทุกคนอยู่แล้ว",
                zh: "2021年之前，那空是贪玛叻的洪水事件意味着泡在水里整整四天。城市被动应对——评估损失、派遣队伍、等待水位下降。改变这一切的数据早已存在。交通摄像头被重新定向，用于监控河渠、易涝路口和上游水闸；上游传感器提供触发节点；LINE OA频道已经覆盖了几乎所有居民。",
              })}
            </p>
            <p>
              {translate(locale, {
                en: "When these three were connected — sensor to camera to alert — the city gained a 10-hour warning window before flood levels became dangerous. Enough time for residents to move vehicles, secure property, and evacuate the elderly. The 2020 flood lasted four days. Every flood since 2021 has produced zero fatalities. The cameras did not change the weather. They changed what the city knew, and when it knew it.",
                th: "เมื่อสามสิ่งนี้ถูกเชื่อมเข้าหากัน — เซ็นเซอร์ กล้อง การแจ้งเตือน — เมืองได้หน้าต่างเตือนภัย 10 ชั่วโมงก่อนระดับน้ำจะอันตราย เพียงพอสำหรับให้ประชาชนย้ายรถ เก็บทรัพย์สิน และพาผู้สูงอายุออกจากพื้นที่ น้ำท่วมปี 2563 กินเวลาสี่วัน ทุกน้ำท่วมตั้งแต่ปี 2564 มีผู้เสียชีวิตเป็นศูนย์ กล้องไม่ได้เปลี่ยนอากาศ มันเปลี่ยนสิ่งที่เมืองรู้ และรู้เมื่อไหร่",
                zh: "当这三者被连接起来——传感器、摄像头、预警——城市获得了10小时的预警窗口，在洪水达到危险水位之前。足够居民转移车辆、保护财产、撤离老人。2020年的洪水持续了四天。2021年以来的每次洪水，死亡人数均为零。摄像头没有改变天气，它改变了城市知道什么、以及什么时候知道。",
              })}
            </p>
          </section>

          {/* ── Mayor in the flood ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "Ground truth", th: "ความจริงในพื้นที่", zh: "一线实情" })}</p>
            <h2>{translate(locale, { en: "The mayor doesn't watch from the command center", th: "นายกฯ ไม่ได้ดูจากศูนย์บัญชาการ", zh: "市长不在指挥中心里看" })}</h2>
            <p>
              {translate(locale, {
                en: "When the 10-hour warning window closes and water reaches the streets, Dr. Kanop goes in. Hard hat, SLIC jacket, rubber boots — wading through the same water his residents are moving out of. The command center buys time. The mayor's presence buys trust.",
                th: "เมื่อหน้าต่างเตือน 10 ชั่วโมงหมดลงและน้ำมาถึงถนน ดร.กณพ ลงไปในพื้นที่ หมวกนิรภัย เสื้อแจ็คเก็ต SLIC รองเท้าบูท — ลุยน้ำเดียวกับที่ประชาชนกำลังอพยพออก ศูนย์บัญชาการซื้อเวลา การที่นายกฯ ออกพื้นที่ซื้อความไว้วางใจ",
                zh: "当10小时预警窗口关闭、洪水涌上街头，กณพ博士走入其中。安全帽、SLIC夹克、橡皮靴——趟过的水，正是居民们正在撤离的那些。指挥中心买来时间，市长的出现买来信任。",
              })}
            </p>
            <div className="showcase-mayor-photo" style={{ height: "360px", marginTop: "1rem" }}>
              <ResponsiveImage
                src="/Nakhon Si Thammarat/mayor-kanop-flood-zone.jpg"
                alt={translate(locale, { en: "Dr. Kanop Ketchart wading through floodwater in Nakhon Si Thammarat — hard hat, SLIC jacket, on the street with residents", th: "ดร.กณพ เกตุชาติ ลุยน้ำท่วมในนครศรีธรรมราช — หมวกนิรภัย เสื้อ SLIC อยู่บนถนนกับประชาชน", zh: "กณพ เกตุชาติ博士趟过那空是贪玛叻的洪水——戴安全帽、穿SLIC夹克，与居民同在街头" })}
                sizes="100vw"
              />
            </div>
          </section>

          {/* ── International awards ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "International recognition", th: "การยอมรับในระดับนานาชาติ", zh: "国际认可" })}</p>
            <h2>{translate(locale, { en: "From Goyang to Shanghai", th: "จากโกยังถึงเซี่ยงไฮ้", zh: "从高阳到上海" })}</h2>
            <p>
              {translate(locale, {
                en: "In 2023, Nakhon Si Thammarat won the Best Partnership Award at the World Smart City Expo in Goyang, South Korea — in partnership with depa. The award recognised the city's approach to citizen-led digital adoption, not just the technology deployed. In 2025, the city returned to Goyang to represent Thailand's smart city programme at the ASEAN level, then carried the story further — to Tomorrow.City Shanghai, where it was presented as Thailand's featured smart city to an audience of urban investors and policymakers from across East Asia.",
                th: "ในปี 2566 นครศรีธรรมราชได้รับรางวัล Best Partnership Award ในงาน World Smart City Expo ที่โกยัง ร่วมกับ depa รางวัลนี้ยกย่องแนวทางการนำดิจิทัลโดยประชาชน ไม่ใช่แค่เทคโนโลยี ปี 2568 เมืองกลับโกยังเพื่อเป็นตัวแทนไทยในระดับ ASEAN แล้วนำเรื่องราวไปต่อที่ Tomorrow.City Shanghai ซึ่งถูกนำเสนอในฐานะเมืองอัจฉริยะตัวแทนไทยต่อนักลงทุนและผู้กำหนดนโยบายทั่วเอเชียตะวันออก",
                zh: "2023年，那空是贪玛叻与depa合作，在韩国高阳世界智慧城市博览会荣获最佳合作奖。2025年，城市再度赴高阳代表泰国出席ASEAN级别的活动，随后将这个故事带到了更远的地方——Tomorrow.City上海，作为泰国代表智慧城市向东亚各地的城市投资者和政策制定者展示。",
              })}
            </p>
            <div className="showcase-award-photo-grid showcase-award-photo-grid--3">
              <div>
                <div className="showcase-award-photo-block">
                  <ResponsiveImage
                    src="/Nakhon Si Thammarat/mayor-kanop-goyang-award-2023.jpg"
                    alt={translate(locale, { en: "NST delegation receiving the Best Partnership Award at WSCE Goyang 2023 with depa", th: "คณะนครศรีธรรมราชรับรางวัล Best Partnership Award ที่ WSCE โกยัง 2566", zh: "NST代表团在2023年高阳WSCE与depa共同领取最佳合作奖" })}
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                </div>
                <p className="showcase-award-photo-caption">
                  {translate(locale, { en: "Best Partnership Award · WSCE Goyang 2023", th: "รางวัล Best Partnership Award · WSCE โกยัง 2566", zh: "最佳合作奖 · 高阳 WSCE 2023" })}
                </p>
              </div>
              <div>
                <div className="showcase-award-photo-block">
                  <ResponsiveImage
                    src="/Nakhon Si Thammarat/mayor-kanop-goyang-2025.jpg"
                    alt={translate(locale, { en: "Dr. Kanop at the World Smart City Expo 2025 — returning to Goyang as Thailand's ASEAN smart city representative", th: "ดร.กณพ ที่ World Smart City Expo 2025 — กลับโกยังในฐานะตัวแทนสมาร์ทซิตี้ ASEAN ของไทย", zh: "กณพ博士在2025年世界智慧城市博览会——以泰国ASEAN智慧城市代表身份重返高阳" })}
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                </div>
                <p className="showcase-award-photo-caption">
                  {translate(locale, { en: "ASEAN representative · WSCE Goyang 2025", th: "ตัวแทน ASEAN · WSCE โกยัง 2568", zh: "ASEAN 代表 · 高阳 WSCE 2025" })}
                </p>
              </div>
              <div>
                <div className="showcase-award-photo-block">
                  <ResponsiveImage
                    src="/Nakhon Si Thammarat/mayor-kanop-tomorrow-city-shanghai.jpg"
                    alt={translate(locale, { en: "Dr. Kanop speaking at Tomorrow.City Shanghai — presenting NST's citizen-centric model to urban investors across East Asia", th: "ดร.กณพ บรรยายที่ Tomorrow.City Shanghai — นำเสนอแบบจำลองที่เน้นประชาชนของนครฯ ต่อนักลงทุนเมืองทั่วเอเชียตะวันออก", zh: "กณพ博士在Tomorrow.City上海发言——向东亚城市投资者展示NST的以人为中心模式" })}
                    sizes="(max-width: 640px) 100vw, 340px"
                  />
                </div>
                <p className="showcase-award-photo-caption">
                  {translate(locale, { en: "Tomorrow.City Shanghai · 2025", th: "Tomorrow.City Shanghai · 2568", zh: "Tomorrow.City 上海 · 2025" })}
                </p>
              </div>
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
            <h2>{translate(locale, { en: "The Transformation Playbook", th: "เพลย์บุ๊กแห่งการเปลี่ยนแปลง", zh: "转型指南" })}</h2>
            
            <div className="showcase-timeline-arc">
              {/* 2022 */}
              <div className="timeline-arc-node">
                <div className="timeline-arc-year">2022</div>
                <div className="timeline-arc-content">
                  <div className="timeline-arc-text">
                    <h3 className="timeline-arc-title">{translate(locale, { en: "Ground Truth & Infrastructure", th: "เข้าถึงพื้นที่และสร้างโครงสร้างพื้นฐาน", zh: "实地调研与基础设施" })}</h3>
                    <p className="timeline-arc-desc">{translate(locale, { en: "The work began on the street. Mayor Kanop instituted morning runs with the firefighting teams and city staff to discuss operations informally. At the Town Hall, the strategy was set: the city would build its own smart infrastructure, not wait for national grants.", th: "งานเริ่มขึ้นบนถนน นายกกณพเริ่มวิ่งตอนเช้ากับทีมดับเพลิงและเจ้าหน้าที่เทศบาลเพื่อหารือเรื่องงานแบบไม่เป็นทางการ ที่ศาลาว่าการ กลยุทธ์ถูกวางไว้: เมืองจะสร้างโครงสร้างพื้นฐานอัจฉริยะของตัวเอง ไม่รอเงินอุดหนุนจากส่วนกลาง", zh: "工作从街头开始。市长Kanop与消防队和市政工作人员进行晨跑，在非正式场合讨论运营问题。在市政厅，战略已定：城市将建立自己的智能基础设施，而不是等待国家拨款。" })}</p>
                  </div>
                  <div className="timeline-arc-gallery">
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/morning-run-with-mayor-and-firefighting-team-nst.webp" alt="Morning Run" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/nst-cultural-heritage-it-forum-2022.webp" alt="IT Forum" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/dr-non-x-dr-kanop-first-meeting-nst-town-hall-2022.webp" alt="Town Hall" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2023 */}
              <div className="timeline-arc-node">
                <div className="timeline-arc-year">2023</div>
                <div className="timeline-arc-content">
                  <div className="timeline-arc-text">
                    <h3 className="timeline-arc-title">{translate(locale, { en: "Partnerships & First Recognition", th: "เครือข่ายพันธมิตรและการยอมรับครั้งแรก", zh: "伙伴关系与初步认可" })}</h3>
                    <p className="timeline-arc-desc">{translate(locale, { en: "The 10-hour flood warning system went live. Instead of buying expensive proprietary platforms, the city partnered with KMITL for hardware and depa for standards. This citizen-first approach won the Best Partnership Award at the World Smart City Expo in Goyang, Korea.", th: "ระบบเตือนน้ำท่วม 10 ชั่วโมงเริ่มใช้งาน แทนที่จะซื้อแพลตฟอร์มราคาแพง เมืองจับมือกับ สจล. สำหรับฮาร์ดแวร์ และ depa สำหรับมาตรฐาน แนวทางนี้ทำให้ได้รับรางวัล Best Partnership Award ที่ World Smart City Expo เกาหลีใต้", zh: "10小时洪水预警系统上线。城市没有购买昂贵的专有平台，而是与KMITL在硬件上合作，与depa在标准上合作。这种以市民为中心的方法赢得了韩国高阳世界智慧城市博览会的最佳合作奖。" })}</p>
                  </div>
                  <div className="timeline-arc-gallery">
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/world-smart-city-expo-goyang-2023.webp" alt="World Smart City Expo" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/kmitl-expo-with-dr-supakorn.webp" alt="KMITL Expo" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/world-smart-city-expo-goyang-2023-award-photo-2.webp" alt="Goyang Award" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2024 */}
              <div className="timeline-arc-node">
                <div className="timeline-arc-year">2024</div>
                <div className="timeline-arc-content">
                  <div className="timeline-arc-text">
                    <h3 className="timeline-arc-title">{translate(locale, { en: "Operational Command", th: "ศูนย์บัญชาการปฏิบัติการ", zh: "运营指挥" })}</h3>
                    <p className="timeline-arc-desc">{translate(locale, { en: "With over 112,000 citizens connected to the LINE OA, the IOC (Intelligent Operation Center) became the true brain of the city. Resolving over 38,000 complaints directly, the CCTV wall driven by live sensor data reduced resolution time by 56%.", th: "ด้วยประชาชนกว่า 112,000 คนบน LINE OA ศูนย์ IOC กลายเป็นสมองของเมืองอย่างแท้จริง การแก้ปัญหาไปแล้วกว่า 38,000 เรื่อง กำแพง CCTV ที่ขับเคลื่อนด้วยข้อมูลสดลดเวลาแก้ปัญหาลง 56%", zh: "随着超过112,000名市民连接到LINE OA，IOC（智能运营中心）成为了城市真正的大脑。通过实时传感器数据驱动的CCTV监控墙，直接解决了38,000多起投诉，将解决时间缩短了56%。" })}</p>
                  </div>
                  <div className="timeline-arc-gallery">
                    <div className="timeline-arc-photo">
                      <ResponsiveImage
                        src="/Nakhon Si Thammarat/nst-ioc-with-dr-kanop-2024.webp"
                        alt="IOC Command Center"
                        sizes="(max-width: 640px) 100vw, 800px"
                        style={{ objectPosition: "center 38%" }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2025 */}
              <div className="timeline-arc-node">
                <div className="timeline-arc-year">2025</div>
                <div className="timeline-arc-content">
                  <div className="timeline-arc-text">
                    <h3 className="timeline-arc-title">{translate(locale, { en: "International Leadership", th: "ความเป็นผู้นำระดับนานาชาติ", zh: "国际领导力" })}</h3>
                    <p className="timeline-arc-desc">{translate(locale, { en: "Nakhon Si Thammarat was selected as the model-city case study for the ASEAN CSCO Handbook. Dr. Kanop represented Thailand at multiple global summits, including the Busan Metaverse Expo and returning to Goyang, sharing the playbook of how a mid-sized city outperformed metropolitan giants.", th: "นครศรีธรรมราชได้รับเลือกเป็นเมืองต้นแบบใน ASEAN CSCO Handbook ดร.กณพ เป็นตัวแทนไทยในเวทีโลกหลายแห่ง รวมถึง Busan Metaverse Expo และ Goyang เพื่อแชร์ว่าเมืองขนาดกลางเอาชนะเมืองหลวงได้อย่างไร", zh: "那空是贪玛叻被选为ASEAN CSCO手册的示范城市案例。Kanop博士代表泰国出席了多个全球峰会，分享了一座中等规模城市如何超越大都市巨头的经验。" })}</p>
                  </div>
                  <div className="timeline-arc-gallery">
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/busan-x-nst-meeting-2025.webp" alt="Busan Meeting 2025" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/world-smart-city-expo-goyang-2025:2.webp" alt="Goyang 2025" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/world-smart-city-expo-goyang-2025:3.webp" alt="Goyang 2025 Panel" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/mayor-kanop-tomorrow-city-shanghai.webp" alt="Tomorrow.City Shanghai 2025" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                    <div className="timeline-arc-photo">
                      <ResponsiveImage src="/Nakhon Si Thammarat/mayor-kanop-dr-non-shanghai.webp" alt="Dr. Non and Dr. Kanop at Tomorrow.City Shanghai" sizes="(max-width: 640px) 100vw, 300px" />
                    </div>
                  </div>
                </div>
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
            <div className="showcase-mayor-photo" style={{ marginBottom: "2rem" }}>
              <picture style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                <source srcSet="/Nakhon Si Thammarat/asean-csco-city-map-demo.webp" type="image/webp" />
                <img src="/Nakhon Si Thammarat/asean-csco-city-map-demo.jpg" alt={translate(locale, { en: "ASEAN CSCO city map demonstration at the Nakhon Si Thammarat IOC — the geospatial layer that connects flood sensors, CCTV, and service routing", th: "การสาธิตแผนที่เมือง ASEAN CSCO ที่ศูนย์ IOC นครศรีธรรมราช — ชั้นข้อมูลภูมิสารสนเทศที่เชื่อมเซ็นเซอร์น้ำท่วม กล้อง CCTV และการจัดเส้นทางบริการ", zh: "ASEAN CSCO 城市地图在那空是贪玛叻 IOC 的演示——连接洪水传感器、CCTV 与服务路由的地理空间层" })} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center center" }} />
              </picture>
              <div className="showcase-cinematic-caption">{translate(locale, { en: "ASEAN CSCO city map demo — NST IOC", th: "การสาธิตแผนที่เมือง ASEAN CSCO — ศูนย์ IOC นครศรี", zh: "ASEAN CSCO 城市地图演示 — 那空是贪玛叻 IOC" })}</div>
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

          {/* ── Interactive SVG Flowchart ── */}
          <section className="section">
            <p className="eyebrow">{translate(locale, { en: "System Architecture", th: "สถาปัตยกรรมระบบ", zh: "系统架构" })}</p>
            <h2>{translate(locale, { en: "The 10-Hour Flood Warning Workflow", th: "กระบวนการเตือนน้ำท่วม 10 ชั่วโมง", zh: "10小时洪水预警工作流" })}</h2>
            <p className="section-intro">
              {translate(locale, {
                en: "This is not a theoretical diagram. This is the exact data path that reduced flood fatalities from a statistical certainty to absolute zero since 2021.",
                th: "นี่ไม่ใช่แผนภาพทฤษฎี นี่คือเส้นทางข้อมูลจริงที่ลดผู้เสียชีวิตจากน้ำท่วมให้เหลือศูนย์ตั้งแต่ปี 2564",
                zh: "这不是一个理论图表。这正是自2021年以来将洪水死亡人数降至绝对零的数据路径。",
              })}
            </p>
            
            <div className="showcase-interactive-flow">
              <div className="flow-connection"></div>
              
              <div className="flow-node">
                <div className="flow-node-icon">1</div>
                <div className="flow-node-content">
                  <div className="flow-node-title">{translate(locale, { en: "1. Upstream Sensors (Input)", th: "1. เซ็นเซอร์ต้นน้ำ (รับข้อมูล)", zh: "1. 上游传感器（输入）" })}</div>
                  <div className="flow-node-desc">{translate(locale, { en: "Water-level sensors at Kiriwong village detect anomalies 10 hours before the water hits the city limits.", th: "เซ็นเซอร์วัดระดับน้ำที่หมู่บ้านคีรีวงตรวจพบความผิดปกติ 10 ชั่วโมงก่อนน้ำถึงเขตเมือง", zh: "位于Kiriwong村的水位传感器在水流到达市区前10小时检测到异常。" })}</div>
                </div>
              </div>

              <div className="flow-node">
                <div className="flow-node-icon">2</div>
                <div className="flow-node-content">
                  <div className="flow-node-title">{translate(locale, { en: "2. IOC Command Center (Processing)", th: "2. ศูนย์ IOC (ประมวลผล)", zh: "2. IOC指挥中心（处理）" })}</div>
                  <div className="flow-node-desc">{translate(locale, { en: "The telemetry triggers the CCTV wall. Human operators verify the flow rate and confirm the threat level instantly.", th: "ข้อมูลไปกระตุ้นกำแพง CCTV เจ้าหน้าที่ตรวจสอบอัตราการไหลและยืนยันระดับภัยคุกคามทันที", zh: "遥测数据触发CCTV监控墙。操作员立即验证流速并确认威胁等级。" })}</div>
                </div>
              </div>

              <div className="flow-node">
                <div className="flow-node-icon">3</div>
                <div className="flow-node-content">
                  <div className="flow-node-title">{translate(locale, { en: "3. LINE OA Broadcast (Output)", th: "3. แจ้งเตือนผ่าน LINE OA (ส่งออก)", zh: "3. LINE OA广播（输出）" })}</div>
                  <div className="flow-node-desc">{translate(locale, { en: "A push notification hits the phones of 112,000 residents in targeted zones. Citizens move vehicles and elderly relatives to high ground.", th: "ข้อความแจ้งเตือนถูกส่งเข้ามือถือประชาชน 112,000 คนในพื้นที่เป้าหมาย ประชาชนย้ายรถและผู้สูงอายุขึ้นที่สูง", zh: "推送通知直接发送到目标区域112,000名居民的手机上。市民将车辆和老人转移到高处。" })}</div>
                </div>
              </div>

              <div className="flow-node" style={{ borderColor: 'var(--amber)' }}>
                <div className="flow-node-icon" style={{ color: "var(--amber)" }}>4</div>
                <div className="flow-node-content">
                  <div className="flow-node-title" style={{ color: 'var(--amber)' }}>{translate(locale, { en: "4. Zero Fatalities (Outcome)", th: "4. ไม่มีผู้เสียชีวิต (ผลลัพธ์)", zh: "4. 零伤亡（结果）" })}</div>
                  <div className="flow-node-desc">{translate(locale, { en: "The physical flood still happens, but the human disaster is averted. Technology bought the city time.", th: "น้ำท่วมทางกายภาพยังคงเกิดขึ้น แต่หายนะต่อชีวิตถูกป้องกันไว้ เทคโนโลยีช่วยซื้อเวลาให้เมือง", zh: "物理上的洪水依然发生，但人类的灾难被避免了。技术为城市赢得了时间。" })}</div>
                </div>
              </div>
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

          <section className="section showcase-practice-detail-section">
            <p className="eyebrow">{translate(locale, { en: "Operational deep dives", th: "เจาะลึกการดำเนินงานจริง", zh: "实操深度解析" })}</p>
            <h2>{translate(locale, { en: "Case Studies in Digital Delivery", th: "กรณีศึกษาการส่งมอบบริการดิจิทัล", zh: "数字交付案例研究" })}</h2>
            <div className="showcase-detail-grid" style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>

              {/* Case Study I */}
              <article className="glass-card" style={{ padding: "1.5rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 700 }}>
                    {translate(locale, {
                      en: "Case Study I — @NakhonCity: The Civic Feedback Loop",
                      th: "กรณีศึกษาที่ 1 — @NakhonCity: วงจรสะท้อนข้อมูลจากประชาชน",
                      zh: "案例研究一 — @NakhonCity：市民反馈闭环",
                    })}
                  </h3>
                  <span className="eyebrow" style={{ margin: 0 }}>
                    {translate(locale, { en: "Civic Participation · Ch. 3 & 6", th: "การมีส่วนร่วมของประชาชน · บทที่ 3 & 6", zh: "市民参与 · 第 3、6 章" })}
                  </span>
                </div>
                <p style={{ margin: "0 0 1rem", color: "var(--2)", lineHeight: 1.6 }}>
                  {translate(locale, {
                    en: "A pothole in NST no longer disappears into a phone queue. It gets photographed, geotagged, timestamped, and routed to the right maintenance crew via LINE — the messaging app 85% of Thais already use. The city rebuilt @NakhonCity twice in three years based on live usage data. Recurring complaint clusters became infrastructure budget signals: when the same street floods repeatedly in reports, it moves to the front of the pipe-replacement queue. Governance shifted from reactive to predictive.",
                    th: "หลุมบ่อในนครศรีธรรมราชไม่ได้หายไปในคิวโทรศัพท์อีกต่อไป แต่ถูกถ่ายภาพ ระบุพิกัด ประทับเวลา และส่งถึงทีมช่างที่รับผิดชอบทาง LINE ซึ่งเป็นแอปที่คนไทย 85% ใช้อยู่แล้ว เทศบาลปรับปรุง @NakhonCity ถึงสองครั้งในสามปีจากข้อมูลการใช้งานจริง กลุ่มร้องเรียนซ้ำๆ กลายเป็นสัญญาณงบประมาณโครงสร้างพื้นฐาน: เมื่อถนนสายเดิมถูกรายงานน้ำท่วมซ้ำในรายงาน ก็จะถูกเลื่อนขึ้นมาอยู่ต้นแถวของโครงการเปลี่ยนท่อ การบริหารเมืองเปลี่ยนจากตั้งรับเป็นเชิงรุก",
                    zh: "那空是贪玛叻的一个路面坑洼，不会再消失于电话排队等待中。它会被拍照、标记地理位置和时间戳，然后通过 LINE——泰国 85% 人口已在使用的即时通讯软件——分配给对应的维修团队。市政府在三年内根据实时使用数据两次重建 @NakhonCity。反复出现的投诉热点成为基础设施预算的信号：当同一条街道在报告中反复出现积水，它便被提前列入换管计划。城市治理从被动应对转向主动预测。",
                  })}
                </p>
                <div className="showcase-pull-block">
                  <p className="showcase-pull-quote">
                    {translate(locale, {
                      en: "\"I don't think anyone ever asked us what we needed before.\"",
                      th: "\"ผมคิดว่าไม่เคยมีใครถามเราเลยว่าเราต้องการอะไร\"",
                      zh: "「我想从来没有人问过我们需要什么。」",
                    })}
                  </p>
                  <p className="showcase-pull-source">{translate(locale, { en: "— Secondary school teacher, NST stakeholder dialogue 2023", th: "— ครูมัธยม, เวทีผู้มีส่วนได้ส่วนเสีย นครฯ ปี 2566", zh: "— 中学教师，那空是贪玛叻利益相关方对话 2023" })}</p>
                </div>
                <div className="showcase-data-callout" style={{ margin: 0 }}>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">31,000+</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Reports by 16,000 residents (2021–2024)", th: "รายงานจากประชาชน 16,000 คน (2564–2567)", zh: "16,000 位居民提交的投诉报告 (2021–2024)" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">84%</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Resolved within 5 days (up from 58%)", th: "แก้ไขเสร็จใน 5 วัน (จาก 58%)", zh: "5 天内解决率（从 58% 提升）" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">92%</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "User satisfaction 2024 (was 68% in 2022)", th: "ความพึงพอใจ 2567 (จาก 68% ในปี 2565)", zh: "2024 年用户满意度（2022 年为 68%）" })}
                    </span>
                  </div>
                </div>
              </article>

              {/* Case Study II */}
              <article className="glass-card" style={{ padding: "1.5rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 700 }}>
                    {translate(locale, {
                      en: "Case Study II — Hospital on Wheels: AI in Rural Healthcare",
                      th: "กรณีศึกษาที่ 2 — โรงพยาบาลเคลื่อนที่: AI ในสาธารณสุขชนบท",
                      zh: "案例研究二 — 移动医院：农村医疗中的人工智能",
                    })}
                  </h3>
                  <span className="eyebrow" style={{ margin: 0 }}>
                    {translate(locale, { en: "Public Health · Ch. 5 & 7", th: "สาธารณสุข · บทที่ 5 & 7", zh: "公共卫生 · 第 5、7 章" })}
                  </span>
                </div>
                <p style={{ margin: "0 0 1rem", color: "var(--2)", lineHeight: 1.6 }}>
                  {translate(locale, {
                    en: "For elderly and bed-ridden villagers, a hospital used to mean a half-day journey. NST co-designed a mobile diagnostics van — with the local hospital — that brings AI-assisted chest X-ray screening directly into remote communities. Images are processed instantly by an AI trained on thousands of cases. A doctor reviews, but the AI is usually faster. The program was inspired by a study trip to South Korea and re-engineered for NST's specific geography and budget using a Build-Own-Operate (BOO) private-financing model, so the city pays monthly, not upfront.",
                    th: "สำหรับผู้สูงอายุและผู้ป่วยติดเตียงในชนบท การไปโรงพยาบาลหมายถึงการเดินทางครึ่งวัน เทศบาลนครฯ ร่วมออกแบบรถวินิจฉัยโรคเคลื่อนที่กับโรงพยาบาลในพื้นที่ เพื่อนำการตรวจ X-ray ทรวงอกด้วย AI ไปถึงชุมชนห่างไกลโดยตรง ภาพถ่ายจะถูกประมวลผลทันทีด้วย AI ที่เทรนมาจากเคสนับพัน แพทย์จะตรวจสอบซ้ำ แต่ AI มักจะเร็วกว่า โครงการนี้ได้แรงบันดาลใจจากการศึกษาดูงานที่เกาหลีใต้ และปรับให้เหมาะกับภูมิศาสตร์และงบประมาณของนครฯ ผ่านรูปแบบการเงิน BOO (Build-Own-Operate) ซึ่งทำให้เทศบาลจ่ายรายเดือนแทนการจ่ายก้อนล่วงหน้า",
                    zh: "对农村地区的老人和卧床患者而言，去医院意味着半天的路程。那空是贪玛叻与当地医院共同设计了一辆移动诊疗车，将 AI 辅助胸部 X 光筛查直接带入偏远社区。图像由经过数千个病例训练的 AI 即时处理。医生负责复核，但 AI 通常更快。该项目受韩国考察之旅启发，根据那空是贪玛叻的地理条件和预算重新设计，采用建设-拥有-经营 (BOO) 私人融资模式，使市政府按月付款而非前期一次性投入。",
                  })}
                </p>
                <div className="showcase-pull-block">
                  <p className="showcase-pull-quote">
                    {translate(locale, {
                      en: "\"It's not about replacing the doctor. It's about reaching more people before it's too late.\"",
                      th: "\"ไม่ใช่การแทนที่หมอ แต่คือการเข้าถึงคนให้มากขึ้นก่อนที่จะสายเกินไป\"",
                      zh: "「这不是为了取代医生，而是在为时未晚之前接触到更多的人。」",
                    })}
                  </p>
                  <p className="showcase-pull-source">{translate(locale, { en: "— Health worker, Hospital on Wheels programme", th: "— เจ้าหน้าที่สาธารณสุข โครงการโรงพยาบาลเคลื่อนที่", zh: "— 医务工作者，移动医院项目" })}</p>
                </div>
                <div className="showcase-data-callout" style={{ margin: 0 }}>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">+30%</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Early TB detection in rural zones (2022–2024)", th: "ตรวจพบวัณโรคระยะแรกในชนบท (2565–2567)", zh: "农村地区早期肺结核检出率 (2022–2024)" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">BOO</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Build-Own-Operate: private pays upfront, city pays monthly", th: "BOO: เอกชนลงทุน รัฐจ่ายรายเดือน", zh: "建设-拥有-经营：私方先行投入，市政按月付费" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">Same visit</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Preliminary result — no more waiting days for a radiologist", th: "รู้ผลเบื้องต้นในวันเดียวกัน ไม่ต้องรอรังสีแพทย์หลายวัน", zh: "初步结果即时出具——无需等待放射科医生数天" })}
                    </span>
                  </div>
                </div>
              </article>

              {/* Case Study III */}
              <article className="glass-card" style={{ padding: "1.5rem", border: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <h3 style={{ margin: 0, fontWeight: 700 }}>
                    {translate(locale, {
                      en: "Case Study III — AI School as-a-Service: Adaptive STEM Learning",
                      th: "กรณีศึกษาที่ 3 — โรงเรียน AI ในรูปแบบบริการ: การเรียนรู้ STEM แบบปรับตัว",
                      zh: "案例研究三 — AI 学校即服务：自适应 STEM 学习",
                    })}
                  </h3>
                  <span className="eyebrow" style={{ margin: 0 }}>
                    {translate(locale, { en: "Education · Ch. 5 & 7", th: "การศึกษา · บทที่ 5 & 7", zh: "教育 · 第 5、7 章" })}
                  </span>
                </div>
                <p style={{ margin: "0 0 1rem", color: "var(--2)", lineHeight: 1.6 }}>
                  {translate(locale, {
                    en: "NST's AI School was not imported. It was reverse-engineered from a South Korean model, then rebuilt for Thai public school classrooms where class sizes are large and exams are the only feedback loop. The platform detects hesitation patterns and topic fatigue in real time — teachers see which students are memorizing versus actually understanding, before any test. When the first school got internet as part of the pilot, the first thing students asked was: \"Can we learn how to make games?\" The platform procured at per-student OPEX rates, which means no upfront hardware debt and no stranded assets if the software improves.",
                    th: "โรงเรียน AI ของนครฯ ไม่ได้นำเข้ามาตรงๆ แต่ถอดแบบจากโมเดลเกาหลีใต้ แล้วสร้างใหม่ให้เหมาะกับห้องเรียนโรงเรียนของรัฐไทยที่มีนักเรียนจำนวนมากและใช้การสอบเป็นวงจรสะท้อนข้อมูลหลักเพียงอย่างเดียว แพลตฟอร์มตรวจจับรูปแบบความลังเลและความล้าในหัวข้อแบบเรียลไทม์ ครูเห็นว่านักเรียนคนไหนท่องจำแบบผิวเผินและคนไหนเข้าใจจริงๆ ก่อนสอบ เมื่อโรงเรียนแรกได้รับอินเทอร์เน็ตในโครงการนำร่อง สิ่งแรกที่นักเรียนถามคือ: \"เราเรียนทำเกมได้ไหม?\" ระบบจัดซื้อในราคา OPEX ต่อนักเรียน หมายความว่าไม่มีหนี้ฮาร์ดแวร์ล่วงหน้าและไม่มีสินทรัพย์ค้างอยู่หากซอฟต์แวร์พัฒนาขึ้น",
                    zh: "那空是贪玛叻的 AI 学校并非照搬引进，而是以韩国模式为蓝本，重新为泰国公立学校的课堂量身定制——这里班级规模庞大，考试是唯一的反馈回路。平台能实时检测犹豫模式和知识疲劳点——教师在任何考试前便能看到哪些学生只是在死记硬背、哪些学生真正理解了。当第一所学校通过试点项目接入互联网时，学生们第一个问题是：「我们能学做游戏吗？」该平台按每生 OPEX 费率采购，意味着没有前期硬件债务，若软件迭代升级也不会产生搁置资产。",
                  })}
                </p>
                <div className="showcase-data-callout" style={{ margin: 0 }}>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">6,000+</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Students reached in 2023", th: "นักเรียนที่เข้าถึงในปี 2566", zh: "2023 年覆盖的学生人数" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">STEM</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Notable math & science comprehension gains, strongest among students who previously underperformed", th: "คะแนนความเข้าใจคณิตและวิทย์ดีขึ้นชัดเจน โดยเฉพาะในกลุ่มนักเรียนที่เคยเรียนอ่อน", zh: "数学与科学理解成绩明显提升，在原本成绩落后的学生中尤为显著" })}
                    </span>
                  </div>
                  <div className="showcase-data-callout-cell">
                    <span className="showcase-data-callout-num">OPEX</span>
                    <span className="showcase-data-callout-label">
                      {translate(locale, { en: "Per-student licensing — no hardware capex", th: "ค่าบริการต่อนักเรียน — ไม่มีงบ CAPEX ฮาร์ดแวร์", zh: "按生收费许可证——无硬件资本支出" })}
                    </span>
                  </div>
                </div>
              </article>
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

          <section className="section showcase-financing-section">
            <p className="eyebrow">{translate(locale, { en: "Sustainable Finance", th: "การเงินที่ยั่งยืน", zh: "可持续财务" })}</p>
            <h2>{translate(locale, { en: "Financing & Procurement Strategy", th: "ยุทธศาสตร์การเงินและการจัดซื้อจัดจ้าง", zh: "融资与采购战略" })}</h2>
            <p className="section-intro">
              {translate(locale, {
                en: "Nakhon Si Thammarat operates under a mid-tier municipal budget constraint of ฿500–700 million annually. Scaling smart services required moving away from high-debt upfront assets to agile, outcome-linked investments.",
                th: "เทศบาลนครนครศรีธรรมราชดำเนินการภายใต้ข้อจำกัดงบประมาณระดับกลางที่ 500–700 ล้านบาทต่อปี การขยายบริการอัจฉริยะจึงจำเป็นต้องเปลี่ยนจากการซื้อสินทรัพย์ราคาแพงล่วงหน้า ไปสู่การลงทุนที่ยืดหยุ่นและผูกพันกับผลสัมฤทธิ์",
                zh: "那空是贪玛叻每年在 5.00-7.00 亿泰铢的中等市政预算限制下运行。扩展智能服务需要从前期的高债务资产购建转向灵活的、与成果挂钩的投资。",
              })}
            </p>

            <div className="showcase-csco-grid" style={{ marginTop: "1rem" }}>
              <article className="showcase-csco-card glass-card" style={{ padding: "1.25rem 1rem" }}>
                <p className="eyebrow" style={{ margin: "0 0 0.5rem" }}>01</p>
                <h3 style={{ fontWeight: 700, margin: "0 0 0.5rem" }}>
                  {translate(locale, { en: "CAPEX-to-OPEX Transition", th: "การเปลี่ยนจาก CAPEX เป็น OPEX", zh: "建设支出向运营支出转型" })}
                </h3>
                <p style={{ color: "var(--2)", lineHeight: 1.5, margin: 0, fontSize: "var(--text-micro)" }}>
                  {translate(locale, {
                    en: "Instead of borrowing heavy capital for short-lived software, NST procures services as operational expenditure. Payments run on monthly per-student licenses or outcome-based triggers, keeping the budget elastic without accumulating stranded hardware debt.",
                    th: "แทนที่จะก่อหนี้กู้ยืมงบลงทุนไปกับซอฟต์แวร์ที่มีอายุการใช้งานสั้น นครฯ เลือกจัดซื้อในลักษณะค่าใช้จ่ายดำเนินงาน การจ่ายเงินรายเดือนตามจำนวนสิทธิ์ใช้งานต่อนักเรียนหรือตามผลสัมฤทธิ์ ทำให้งบประมาณยืดหยุ่นโดยไม่สะสมหนี้ฮาร์ดแวร์ค้างอยู่",
                    zh: "那空是贪玛叻不再为寿命较短的软件申请大额建设性贷款，而是将采购结构调整为运营性支出。付款按月度每生许可证或基于成果的触发机制进行，保持预算弹性，避免积累搁置硬件债务。",
                  })}
                </p>
              </article>

              <article className="showcase-csco-card glass-card" style={{ padding: "1.25rem 1rem" }}>
                <p className="eyebrow" style={{ margin: "0 0 0.5rem" }}>02</p>
                <h3 style={{ fontWeight: 700, margin: "0 0 0.5rem" }}>
                  {translate(locale, { en: "depa Digital Catalog", th: "แคตตาล็อกดิจิทัลของ depa", zh: "depa 数字名录" })}
                </h3>
                <p style={{ color: "var(--2)", lineHeight: 1.5, margin: 0, fontSize: "var(--text-micro)" }}>
                  {translate(locale, {
                    en: "NST procures via depa's Digital Catalog — a pre-vetted national registry of Thai tech vendors, service providers, and digital solutions. Combined with streamlined TOR templates, it cut procurement lead time from an average of 14 months in 2019 to 6.5 months in 2024, while removing compliance risk at the city level.",
                    th: "เทศบาลจัดซื้อผ่านแคตตาล็อกดิจิทัลของ depa ซึ่งเป็นทะเบียนแห่งชาติของผู้ให้บริการเทคโนโลยีไทย ผู้ให้บริการ และโซลูชันดิจิทัลที่ผ่านการคัดกรองล่วงหน้า เมื่อรวมกับการปรับแบบ TOR ให้กระชับ ช่วยลดระยะเวลาจัดซื้อจากเฉลี่ย 14 เดือนในปี 2562 เหลือ 6.5 เดือนในปี 2567 พร้อมลดความเสี่ยงด้านกฎระเบียบในระดับเมือง",
                    zh: "那空是贪玛叻通过 depa 数字名录进行采购——这是一份预先审核的泰国科技供应商、服务商及数字解决方案国家名录。配合精简的 TOR 模板，采购周期从 2019 年平均 14 个月缩短至 2024 年的 6.5 个月，同时消除了城市层面的合规风险。",
                  })}
                </p>
              </article>

              <article className="showcase-csco-card glass-card" style={{ padding: "1.25rem 1rem" }}>
                <p className="eyebrow" style={{ margin: "0 0 0.5rem" }}>03</p>
                <h3 style={{ fontWeight: 700, margin: "0 0 0.5rem" }}>
                  {translate(locale, { en: "ASCN Financing Toolkit", th: "เครื่องมือการเงินของ ASCN", zh: "ASCN 融资工具包" })}
                </h3>
                <p style={{ color: "var(--2)", lineHeight: 1.5, margin: 0, fontSize: "var(--text-micro)" }}>
                  {translate(locale, {
                    en: "NST maps each project onto the ASEAN Smart Cities Network toolkit's funding structures: grants for civic tech with no revenue, BOO for infrastructure with a private operator, and PPP for shared-cost services. Across the region, 75% of smart city projects are now in some stage of implementation — the toolkit keeps cities from over-relying on the wrong instrument.",
                    th: "นครฯ จับคู่แต่ละโครงการกับโครงสร้างการเงินในเครื่องมือของเครือข่ายเมืองอัจฉริยะอาเซียน: เงินอุดหนุนสำหรับเทคโนโลยีพลเมืองที่ไม่มีรายได้ BOO สำหรับโครงสร้างพื้นฐานที่มีผู้ดำเนินงานเอกชน และ PPP สำหรับบริการร่วมทุน ทั่วทั้งภูมิภาค 75% ของโครงการสมาร์ทซิตี้อยู่ระหว่างการดำเนินงานในขั้นใดขั้นหนึ่งแล้ว เครื่องมือนี้ช่วยไม่ให้เมืองพึ่งพาเครื่องมือที่ไม่ถูกต้อง",
                    zh: "那空是贪玛叻将每个项目对应到东盟智慧城市网络工具包的资金结构上：无收入的市民科技项目使用赠款，有私营运营商的基础设施使用 BOO，成本共担服务使用 PPP。放眼整个区域，75% 的智慧城市项目目前正处于某一实施阶段——该工具包帮助城市避免过度依赖错误的融资工具。",
                  })}
                </p>
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
