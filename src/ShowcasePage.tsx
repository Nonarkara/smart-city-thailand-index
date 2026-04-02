import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface LocalizedItem {
  en: string;
  th: string;
  zh: string;
}

interface ShowcaseMetric {
  value: string;
  label: LocalizedItem;
}

interface ShowcaseIdea {
  id: string;
  icon: string;
  title: LocalizedItem;
  desc: LocalizedItem;
}

interface ShowcaseSource {
  title: string;
  note: LocalizedItem;
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
      th: "หน่วยแพทย์เคลื่อนที่ที่มีหมอ พยาบาล เภสัชกร และ telemedicine ไปถึงชุมชนที่บริการเข้าไม่ถึง โดยไม่ต้องรอสร้างคลินิกใหม่",
      zh: "配备医生、护士、药师与远程医疗支持的移动医疗单元，不必等新诊所盖好就能进入服务不足社区。",
    },
  },
  {
    id: "digital-catalog",
    icon: "📱",
    title: { en: "Digital catalog for street vendors", th: "แคตตาล็อกดิจิทัลสำหรับพ่อค้าแม่ค้า", zh: "街头商贩数字目录" },
    desc: {
      en: "A QR-based storefront layer for local merchants. The point is not e-commerce theatre; it is giving informal vendors a low-friction way into the digital economy.",
      th: "ชั้นหน้าร้านแบบ QR สำหรับผู้ค้ารายย่อย ประเด็นไม่ใช่ละคร e-commerce แต่คือการให้พ่อค้าแม่ค้าเข้าระบบเศรษฐกิจดิจิทัลแบบ friction ต่ำ",
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

function t(locale: Locale, copy: LocalizedItem): string {
  return locale === "th" ? copy.th : locale === "zh" ? copy.zh : copy.en;
}

export default function ShowcasePage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section showcase-hero">
        <p className="eyebrow">{t(locale, { en: "Case study", th: "กรณีศึกษา", zh: "案例研究" })}</p>
        <h1 className="hero-title showcase-title">
          {locale === "th"
            ? <>นครศรีธรรมราช:<br />เมืองที่ฟังประชาชน</>
            : locale === "zh"
              ? <>那空是贪玛叻：<br />一座学会倾听的城市。</>
              : <>Nakhon Si Thammarat:<br />the city that listened.</>}
        </h1>
        <p className="hero-strapline showcase-strapline">
          {t(locale, {
            en: "This page is here to answer one question cleanly: what does a citizen-centric smart city look like when the work leaves the slide deck and hits the street?",
            th: "หน้านี้มีไว้ตอบคำถามเดียวให้ชัด: เมืองอัจฉริยะที่เน้นประชาชนหน้าตาเป็นอย่างไร เมื่อมันออกจากสไลด์แล้วลงไปอยู่บนถนนจริง",
            zh: "这一页只想干净地回答一个问题：当智慧城市离开 PPT、真正落到街头以后，以市民为中心到底长什么样？",
          })}
        </p>
        <div className="showcase-hero-actions">
          <button type="button" className="cta-button" onClick={() => onNavigate("/city/nakhon-si-thammarat")}>
            {t(locale, { en: "View city profile", th: "ดูข้อมูลเมือง", zh: "查看城市档案" })}
          </button>
          <a href="https://nonarkara.github.io/asean-csco-app/#manifesto" target="_blank" rel="noopener noreferrer" className="ghost-button">
            {t(locale, { en: "Open ASEAN CSCO Handbook", th: "เปิดคู่มือ ASEAN CSCO", zh: "打开 ASEAN CSCO 手册" })}
          </a>
        </div>
        <p className="showcase-source-note">
          {t(locale, {
            en: "Outcome figures below are reported in municipal case materials, nomination files, and the ASEAN CSCO case-study stack. They are presented here as documented case evidence, not as live telemetry.",
            th: "ตัวเลขผลลัพธ์ด้านล่างมาจากเอกสารกรณีศึกษาของเทศบาล เอกสารเสนอรับรอง และชุดกรณีศึกษา ASEAN CSCO เรานำเสนอในฐานะหลักฐานจากเอกสาร ไม่ใช่ telemetry แบบสด",
            zh: "下方结果数据来自市政案例材料、提名文件与 ASEAN CSCO 案例资料。这里把它们当作文档化证据呈现，而不是实时遥测数据。",
          })}
        </p>
      </section>

      <section className="section showcase-metric-section">
        <div className="showcase-metric-grid">
          {metrics.map(metric => (
            <div key={metric.value + metric.label.en} className="showcase-metric-card">
              <div className="showcase-metric-value">{metric.value}</div>
              <div className="showcase-metric-label">{t(locale, metric.label)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section showcase-summary-section">
        <div className="showcase-summary-grid">
          <article className="showcase-summary-card">
            <p className="showcase-card-kicker">{t(locale, { en: "Leadership", th: "ภาวะผู้นำ", zh: "领导力" })}</p>
            <h2>{t(locale, { en: "Mayor Kanop Ketchart", th: "นายกคานป เกชาติ", zh: "Kanop Ketchart 市长" })}</h2>
            <p>
              {t(locale, {
                en: "The city story only makes sense if leadership is understood as a listening system. The mayor's role here is not technological heroism. It is repeated contact, direct explanation, and willingness to make the service loop visible.",
                th: "เรื่องของเมืองนี้จะเข้าใจไม่ได้เลย ถ้าไม่มองผู้นำเป็นระบบการฟัง บทบาทของนายกที่นี่ไม่ใช่วีรกรรมทางเทคโนโลยี แต่คือการลงไปสัมผัสซ้ำๆ อธิบายตรงๆ และยอมให้วงจรบริการถูกมองเห็น",
                zh: "如果不把领导力理解成一种“倾听系统”，这座城市的故事就讲不通。这里的市长角色不是技术英雄，而是反复接触、直接解释，并愿意把服务闭环摆到明面上。",
              })}
            </p>
            <blockquote className="showcase-quote">
              {t(locale, {
                en: "\"You don't push high technology to people. Show them the benefit. They decide.\"",
                th: "\"คุณไม่ผลักเทคโนโลยีสูงให้คน แสดงประโยชน์ให้เขาเห็น แล้วให้เขาตัดสินใจ\"",
                zh: "\"你不能把高科技硬塞给人。先让他们看到好处，再由他们自己决定。\"",
              })}
            </blockquote>
          </article>

          <article className="showcase-summary-card">
            <p className="showcase-card-kicker">{t(locale, { en: "Why it works", th: "ทำไมมันเวิร์ก", zh: "为什么有效" })}</p>
            <h2>{t(locale, { en: "The system closes the loop", th: "ระบบมันปิดลูปได้", zh: "这套系统能闭环" })}</h2>
            <p>
              {t(locale, {
                en: "The interesting part is not that the city has an app. Plenty of cities have apps. The interesting part is that reports, ratings, flood alerts, service teams, and public communication are tied together tightly enough to change behavior.",
                th: "จุดที่น่าสนใจไม่ใช่ว่าเมืองนี้มีแอป เพราะหลายเมืองก็มีแอป จุดที่น่าสนใจคือการที่รายงาน คะแนน เตือนน้ำท่วม ทีมปฏิบัติงาน และการสื่อสารสาธารณะ ถูกมัดเข้าด้วยกันแน่นพอที่จะเปลี่ยนพฤติกรรมได้",
                zh: "真正有意思的不是这座城市“有一个应用”，因为很多城市都有。关键在于报修、评分、洪水预警、执行团队与公共沟通被绑得足够紧，足以改变行为。",
              })}
            </p>
          </article>

          <article className="showcase-summary-card">
            <p className="showcase-card-kicker">{t(locale, { en: "Why it matters", th: "ทำไมมันสำคัญ", zh: "为什么重要" })}</p>
            <h2>{t(locale, { en: "This is a copyable model", th: "นี่คือโมเดลที่ลอกได้", zh: "这是一个可复制模型" })}</h2>
            <p>
              {t(locale, {
                en: "Nothing on this page depends on being Bangkok, being rich, or buying exotic infrastructure first. That is why this city shows up as a showcase: the logic is modular, local-government scale, and teachable.",
                th: "ไม่มีอะไรบนหน้านี้ที่ต้องอาศัยการเป็นกรุงเทพฯ การมีเงินหนา หรือการซื้อโครงสร้างพื้นฐานแปลกๆ ก่อน นี่แหละเหตุผลที่เมืองนี้ถูกยกเป็นต้นแบบ: ตรรกะมันเป็นโมดูล ขนาดเหมาะกับท้องถิ่น และสอนต่อได้",
                zh: "本页没有任何一件事要求你必须是曼谷、必须很有钱，或必须先买一堆稀奇基础设施。这正是它成为样板的原因：逻辑是模块化的，适合地方政府规模，而且可以教、可以学、可以复制。",
              })}
            </p>
          </article>
        </div>
      </section>

      <section className="section showcase-practice-section">
        <div className="story-section-head">
          <div>
            <p className="eyebrow">{t(locale, { en: "Steal this playbook", th: "ขโมย playbook นี้", zh: "把这套打法拿去用" })}</p>
            <h2>{t(locale, { en: "Six ideas other cities can copy", th: "หกไอเดียที่เมืองอื่นลอกได้", zh: "其他城市能复制的六个点子" })}</h2>
          </div>
          <p className="section-intro story-section-intro">
            {t(locale, {
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
                <h3 className="showcase-idea-title">{t(locale, idea.title)}</h3>
                <p className="showcase-idea-body">{t(locale, idea.desc)}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section showcase-proof-section">
        <div className="showcase-proof-grid">
          <article className="showcase-proof-card">
            <p className="showcase-card-kicker">{t(locale, { en: "Recognition", th: "การยอมรับ", zh: "认可" })}</p>
            <h2>{t(locale, { en: "Awards and public validation", th: "รางวัลและการยืนยันสาธารณะ", zh: "奖项与公共验证" })}</h2>
            <div className="showcase-award-list">
              {awards.map(award => (
                <div key={award.year + award.title.en} className="showcase-award-row">
                  <span className="showcase-award-year">{award.year}</span>
                  <span className="showcase-award-title">{t(locale, award.title)}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="showcase-proof-card">
            <p className="showcase-card-kicker">{t(locale, { en: "Before vs after", th: "ก่อน vs หลัง", zh: "前后对比" })}</p>
            <h2>{t(locale, { en: "What changed operationally", th: "อะไรเปลี่ยนในเชิงปฏิบัติการ", zh: "运行层面改变了什么" })}</h2>
            <div className="showcase-delta-list">
              {beforeAfterRows.map(row => (
                <div key={row.metric.en} className="showcase-delta-row">
                  <span className="showcase-delta-metric">{t(locale, row.metric)}</span>
                  <span className="showcase-delta-before">{t(locale, row.before)}</span>
                  <span className="showcase-delta-after">{t(locale, row.after)}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </section>

      <section className="section showcase-sources-section">
        <p className="eyebrow">{t(locale, { en: "Source stack", th: "ชุดเอกสารอ้างอิง", zh: "来源堆栈" })}</p>
        <h2>{t(locale, { en: "What this profile is built from", th: "โปรไฟล์นี้สร้างจากอะไร", zh: "这份画像建立在什么材料上" })}</h2>
        <div className="showcase-source-grid">
          {sourceFiles.map(source => (
            <article key={source.title} className="showcase-source-card">
              <h3 className="showcase-source-title">{source.title}</h3>
              <p className="showcase-source-body">{t(locale, source.note)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section showcase-closing-section">
        <div className="callout-card story-closing-card">
          <h2>{t(locale, { en: "Every city in this index can learn from Nakhon.", th: "ทุกเมืองในดัชนีนี้เรียนรู้จากนครฯ ได้", zh: "本指数里的每座城市都能从那空学到东西。" })}</h2>
          <p>
            {t(locale, {
              en: "The value of this page is not hero worship. It is operational clarity. A city that listens, measures, responds, and reports back will usually beat a city that buys shinier hardware and calls it innovation.",
              th: "คุณค่าของหน้านี้ไม่ใช่การบูชาวีรบุรุษ แต่คือความชัดเชิงปฏิบัติการ เมืองที่ฟัง วัด ตอบสนอง และรายงานกลับ มักชนะเมืองที่ซื้อฮาร์ดแวร์วิบวับกว่าแล้วเรียกว่านวัตกรรม",
              zh: "本页的价值不在于造神，而在于操作上的清晰。一个会倾听、测量、响应并反馈的城市，通常会胜过那个买了更闪设备就自称创新的城市。",
            })}
          </p>
          <div className="story-closing-actions">
            <a href="https://nonarkara.github.io/asean-csco-app/" target="_blank" rel="noopener noreferrer" className="cta-button">
              {t(locale, { en: "Open ASEAN CSCO Handbook", th: "เปิดคู่มือ ASEAN CSCO", zh: "打开 ASEAN CSCO 手册" })}
            </a>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
              {t(locale, { en: "Back to rankings", th: "กลับไปอันดับ", zh: "返回排名" })}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
