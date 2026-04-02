import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

const stealIdeas = [
  {
    id: "hospital-on-wheels",
    titleEn: "Hospital on Wheels",
    titleTh: "โรงพยาบาลเคลื่อนที่",
    descEn: "Mobile medical unit with doctors, nurses, pharmacists and telemedicine integration. Serves 60,000 residents in underserved neighborhoods. 4,000+ patients treated. Cost: a fraction of building a new clinic.",
    descTh: "หน่วยแพทย์เคลื่อนที่ มีหมอ พยาบาล เภสัชกร และ telemedicine ให้บริการ 60,000 คนในชุมชนที่เข้าถึงยาก รักษาคนไข้ 4,000+ ราย ต้นทุนเศษเสี้ยวของการสร้างคลินิกใหม่",
    icon: "🏥",
  },
  {
    id: "digital-catalog",
    titleEn: "Digital Catalog for Street Vendors",
    titleTh: "แคตตาล็อกดิจิทัลสำหรับพ่อค้าแม่ค้า",
    descEn: "QR code marketplace linking street vendors to digital storefronts. Zero technical barriers — if you can show a QR code, you're in the digital economy. Elderly vendors adopted it within days.",
    descTh: "ตลาด QR code เชื่อมพ่อค้าแม่ค้ากับหน้าร้านดิจิทัล ไม่มีอุปสรรคทางเทคนิค — ถ้าโชว์ QR code ได้ คุณก็อยู่ในเศรษฐกิจดิจิทัล แม่ค้าสูงอายุใช้ได้ภายในไม่กี่วัน",
    icon: "📱",
  },
  {
    id: "mayors-classroom",
    titleEn: "Mayor's Classroom",
    titleTh: "ห้องเรียนนายก",
    descEn: "Monthly live Q&A where the mayor answers citizen questions on LINE. During the 2025 flood crisis, the live stream hit 170,000 views. Direct accountability — no PR filter, no scripted answers.",
    descTh: "ไลฟ์ถาม-ตอบรายเดือน นายกตอบคำถามประชาชนบน LINE วิกฤตน้ำท่วม 2568 ไลฟ์มียอดวิว 170,000 ความรับผิดชอบตรง — ไม่มี PR กรอง ไม่มีสคริปต์",
    icon: "🎓",
  },
  {
    id: "5-star-governance",
    titleEn: "5-Star Citizen Rating",
    titleTh: "ให้คะแนน 5 ดาว",
    descEn: "Citizens rate every government service interaction in real time. Reduced call center workload by 37%. Satisfaction jumped from 68% to 92%. Public servants know their score — and it's visible.",
    descTh: "ประชาชนให้คะแนนทุกบริการภาครัฐแบบเรียลไทม์ ลดภาระ call center 37% ความพึงพอใจเพิ่มจาก 68% เป็น 92% ข้าราชการรู้คะแนนตัวเอง — และมันเปิดเผย",
    icon: "⭐",
  },
  {
    id: "metaverse-classroom",
    titleEn: "Metaverse Classroom",
    titleTh: "ห้องเรียนเมตาเวิร์ส",
    descEn: "AR/VR integration in 11,000-student school system. 300 trained teachers. 1,500 digital lessons created. Not a tech demo — an actual curriculum running daily.",
    descTh: "AR/VR ในระบบโรงเรียน 11,000 นักเรียน ครู 300 คนผ่านการอบรม สร้างบทเรียนดิจิทัล 1,500 บท ไม่ใช่ demo เทค — หลักสูตรจริงที่ใช้ทุกวัน",
    icon: "🥽",
  },
  {
    id: "flood-camera",
    titleEn: "10-Hour Flood Warning",
    titleTh: "เตือนน้ำท่วมล่วงหน้า 10 ชั่วโมง",
    descEn: "Upstream sensors + real-time CCTV + automatic LINE alerts to 112,000 citizens. 10-hour warning window. Zero flood fatalities in the municipal area since deployment. The system that proved smart cities save lives.",
    descTh: "เซ็นเซอร์ต้นน้ำ + CCTV เรียลไทม์ + แจ้งเตือน LINE อัตโนมัติถึง 112,000 คน เตือนล่วงหน้า 10 ชั่วโมง ไม่มีผู้เสียชีวิตจากน้ำท่วมในเขตเทศบาลตั้งแต่ติดตั้ง ระบบที่พิสูจน์ว่าเมืองอัจฉริยะช่วยชีวิตคนได้",
    icon: "🌊",
  },
];

const metrics = [
  { value: "112,000+", labelEn: "Active app users", labelTh: "ผู้ใช้แอพแอคทีฟ" },
  { value: "< 48h", labelEn: "Issue resolution", labelTh: "แก้ปัญหาภายใน" },
  { value: "38,000", labelEn: "Complaints resolved in 3 years", labelTh: "เรื่องร้องเรียนแก้ไขใน 3 ปี" },
  { value: "10h", labelEn: "Flood warning window", labelTh: "เตือนน้ำท่วมล่วงหน้า" },
  { value: "70%", labelEn: "Population adoption", labelTh: "ประชากรใช้งาน" },
  { value: "฿2.3M", labelEn: "Annual savings", labelTh: "ประหยัดต่อปี" },
  { value: "0", labelEn: "Flood fatalities (since 2021)", labelTh: "ผู้เสียชีวิตจากน้ำท่วม (ตั้งแต่ 2564)" },
  { value: "92%", labelEn: "Citizen satisfaction", labelTh: "ความพึงพอใจประชาชน" },
];

const awards = [
  { year: "2022", titleEn: "Thailand Smart City Solutions Award — Innovative Flood Control", titleTh: "Thailand Smart City Solutions Award — นวัตกรรมควบคุมน้ำท่วม" },
  { year: "2023", titleEn: "Best Partnership Award — World Smart City Expo, Korea (with depa)", titleTh: "รางวัล Best Partnership — World Smart City Expo เกาหลี (กับ depa)" },
  { year: "2023", titleEn: "Batch 3 Smart City Local certification from depa", titleTh: "ตราสัญลักษณ์เมืองอัจฉริยะ รุ่น 3 จาก depa" },
  { year: "2025", titleEn: "ASEAN CSCO Handbook case study — selected as the model city", titleTh: "กรณีศึกษาในคู่มือ ASEAN CSCO — เลือกเป็นเมืองต้นแบบ" },
];

export default function ShowcasePage({ locale, onNavigate }: Props) {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section" style={{ paddingTop: "7.5rem", paddingBottom: "1.5rem" }}>
        <p className="eyebrow">{t(locale, "Case study", "กรณีศึกษา", "案例研究")}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 5.5vw, 4rem)" }}>
          {t(locale,
            <>Nakhon Si Thammarat:<br />the city that listened.</>,
            <>นครศรีธรรมราช:<br />เมืองที่ฟังประชาชน</>,
            <>那空是贪玛叻：<br />一座学会倾听的城市。</>
          )}
        </h1>
        <p className="hero-strapline">
          {t(locale,
            "1,200 years old. 105,000 residents. Chronic flooding. Economic stagnation. Then a mayor who walked every neighborhood, an app that 70% of the city uses, and a flood warning system that saved lives. This is what a real smart city looks like.",
            "1,200 ปี 105,000 คน น้ำท่วมเรื้อรัง เศรษฐกิจชะงัก จากนั้นนายกที่เดินทุกชุมชน แอพที่ 70% ของเมืองใช้ ระบบเตือนน้ำท่วมที่ช่วยชีวิตคน นี่คือเมืองอัจฉริยะจริง",
            "1200年历史，10.5万居民，长期洪涝，经济停滞。然后来了一位走遍每个社区的市长、一款70%市民在用的应用、一套拯救生命的洪水预警系统。这才是真正的智慧城市。"
          )}
        </p>
        <div style={{ display: "flex", gap: ".5rem", marginTop: "1rem" }}>
          <button className="cta-button" onClick={() => onNavigate("/city/nakhon-si-thammarat")}>
            {t(locale, "View city profile", "ดูข้อมูลเมือง", "查看城市档案")}
          </button>
          <a href="https://nonarkara.github.io/asean-csco-app/#manifesto" target="_blank" rel="noopener noreferrer" className="ghost-button">
            {t(locale, "Read ASEAN CSCO Handbook", "อ่านคู่มือ ASEAN CSCO", "阅读东盟CSCO手册")}
          </a>
        </div>
      </section>

      {/* ─── KEY METRICS ─── */}
      <section className="section">
        <div className="stats-strip">
          {metrics.slice(0, 5).map((m, i) => (
            <div key={i} className="stat-card">
              <div className="stat-value">{m.value}</div>
              <div className="stat-label">{locale === "th" ? m.labelTh : m.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── THE MAYOR'S PHILOSOPHY ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Leadership", "ผู้นำ", "领导力")}</p>
        <h2>{t(locale, "Mayor Kanop Ketchart", "นายกคานป เกชาติ", "Kanop Ketchart 市长")}</h2>
        <div className="callout-card" style={{ borderLeftColor: "var(--teal, #2BBAA0)" }}>
          <p style={{ fontStyle: "italic", fontSize: "1rem", lineHeight: "1.7" }}>
            {t(locale,
              "\"You don't push high technology to people. Show them the benefits. They decide. I am the last one in the train — I follow where they choose to go.\"",
              "\"คุณไม่ผลักเทคโนโลยีสูงให้คน แสดงประโยชน์ให้เขาเห็น เขาตัดสินใจเอง ผมเป็นคนสุดท้ายในขบวนรถไฟ — ผมตามไปที่พวกเขาเลือก\"",
              "\"你不能把高科技硬塞给人。让他们看到好处，由他们自己决定。我是列车上最后一个人——我跟着他们选择的方向走。\""
            )}
          </p>
          <p>
            {t(locale,
              "Elected 2021, re-elected 2025 in a landslide. Won all 24 council seats. Started by walking every neighborhood for 6 years before running. The vendors at the market say: \"He didn't come to promise things. He just sat down, asked questions, and remembered our names.\"",
              "ได้รับเลือก 2564 เลือกตั้งใหม่ 2568 ชนะถล่มทลาย ได้ทุก 24 เขต เริ่มจากเดินทุกชุมชน 6 ปีก่อนลงสมัคร แม่ค้าในตลาดบอก: 'เขาไม่ได้มาสัญญาอะไร แค่นั่งลง ถามคำถาม แล้วจำชื่อเราได้'",
              "2021年当选，2025年以压倒性优势连任。拿下全部24个选区。在参选前花了6年走遍每个社区。市场摊贩说：'他不是来许诺的，他只是坐下来、提问、然后记住我们的名字。'"
            )}
          </p>
        </div>
      </section>

      {/* ─── THE 10 COMMANDMENTS ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Principles", "หลักการ", "原则")}</p>
        <h2>{t(locale, "10 Commandments of Citizen-Centric Smart City", "10 บัญญัติเมืองอัจฉริยะเน้นประชาชน", "以市民为中心的智慧城市十诫")}</h2>
        <div style={{ borderTop: "2px solid var(--ink, #2A2520)" }}>
          {[
            { en: "Start Small, Act Fast", th: "เริ่มเล็ก ทำเร็ว" },
            { en: "Solve Pain Points First", th: "แก้จุดเจ็บก่อน" },
            { en: "Data Before Hardware", th: "ข้อมูลก่อนฮาร์ดแวร์" },
            { en: "Trust Before Technology", th: "ความไว้ใจก่อนเทคโนโลยี" },
            { en: "Culture Beats Procurement", th: "วัฒนธรรมชนะการจัดซื้อ" },
            { en: "Pilot → Learn → Scale", th: "นำร่อง → เรียนรู้ → ขยาย" },
            { en: "Engage Citizens Early", th: "ดึงประชาชนเข้ามาตั้งแต่เริ่ม" },
            { en: "Use What You Already Have", th: "ใช้สิ่งที่มีอยู่แล้ว" },
            { en: "Keep Solutions Simple", th: "ทำโซลูชันให้ง่าย" },
            { en: "Evidence Over Marketing", th: "หลักฐานเหนือการตลาด" },
          ].map((cmd, i) => (
            <div key={i} style={{ display: "flex", gap: "0.75rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border, rgba(0,0,0,0.08))", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: "0.65rem", color: "var(--teal, #2BBAA0)", minWidth: "1.5rem" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>
                {locale === "th" ? cmd.th : cmd.en}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── STEAL THIS IDEA ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Steal this idea", "ขโมยไอเดียนี้", "偷师这个创意")}</p>
        <h2>{t(locale, "6 innovations any city can copy", "6 นวัตกรรมที่เมืองไหนก็ลอกได้", "任何城市都能复制的6项创新")}</h2>
        <div style={{ borderTop: "2px solid var(--ink, #2A2520)" }}>
          {stealIdeas.map(idea => (
            <div key={idea.id} style={{ display: "grid", gridTemplateColumns: "2rem 1fr", gap: "0.6rem", padding: "1rem 0", borderBottom: "1px solid var(--border, rgba(0,0,0,0.08))" }}>
              <span style={{ fontSize: "1.2rem" }}>{idea.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.25rem" }}>
                  {locale === "th" ? idea.titleTh : idea.titleEn}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--ink-soft, #6B6460)", lineHeight: 1.6 }}>
                  {locale === "th" ? idea.descTh : idea.descEn}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AWARDS ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Recognition", "การยอมรับ", "荣誉")}</p>
        <h2>{t(locale, "Awards and certifications", "รางวัลและการรับรอง", "奖项与认证")}</h2>
        <div style={{ borderTop: "2px solid var(--ink, #2A2520)" }}>
          {awards.map((a, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "3rem 1fr", gap: "0.5rem", padding: "0.5rem 0", borderBottom: "1px solid var(--border, rgba(0,0,0,0.08))", alignItems: "baseline" }}>
              <span style={{ fontFamily: "var(--font-mono, monospace)", fontWeight: 700, fontSize: "0.68rem", color: "var(--teal, #2BBAA0)" }}>
                {a.year}
              </span>
              <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>
                {locale === "th" ? a.titleTh : a.titleEn}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── MORE METRICS ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Before vs after", "ก่อน vs หลัง", "前后对比")}</p>
        <h2>{t(locale, "What changed", "อะไรเปลี่ยน", "什么改变了")}</h2>
        <div style={{ borderTop: "2px solid var(--ink, #2A2520)" }}>
          {[
            { metric: "Pothole repair", before: "15 days", after: "48 hours" },
            { metric: "Flood response", before: "Reactive", after: "10-hour proactive warning" },
            { metric: "Citizen satisfaction", before: "68%", after: "92%" },
            { metric: "Call center workload", before: "Baseline", after: "-37%" },
            { metric: "Flood fatalities (municipal area)", before: "Recurring", after: "Zero since 2021" },
            { metric: "Citizen-government channel", before: "Walk-in only", after: "LINE app — 112,000 users" },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 5rem 8rem", gap: "0.5rem", padding: "0.45rem 0", borderBottom: "1px solid var(--border, rgba(0,0,0,0.08))", fontSize: "0.75rem", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{row.metric}</span>
              <span style={{ color: "var(--coral, #D04848)", fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem", textAlign: "right" }}>{row.before}</span>
              <span style={{ color: "var(--teal, #2BBAA0)", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", fontSize: "0.68rem" }}>→ {row.after}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <div className="callout-card">
          <h2>{t(locale,
            "Every city in this index can learn from Nakhon.",
            "ทุกเมืองในดัชนีนี้เรียนรู้จากนครฯ ได้",
            "本指数中的每座城市都能从那空学到东西。"
          )}</h2>
          <p>{t(locale,
            "The ASEAN CSCO Handbook documents every detail — from Mayor Kanop's philosophy to the exact LINE bot architecture. It's open. It's free. Steal these ideas.",
            "คู่มือ ASEAN CSCO บันทึกทุกรายละเอียด — จากปรัชญานายกคานปถึงสถาปัตยกรรม LINE bot ที่แน่ชัด เปิดเผย ฟรี ขโมยไอเดียเหล่านี้เลย",
            "ASEAN CSCO手册记录了每个细节——从Kanop市长的理念到LINE机器人的架构。完全开放，完全免费。尽管拿去用。"
          )}</p>
          <div style={{ display: "flex", gap: ".5rem", marginTop: ".5rem" }}>
            <a href="https://nonarkara.github.io/asean-csco-app/" target="_blank" rel="noopener noreferrer" className="cta-button">
              {t(locale, "Open ASEAN CSCO Handbook", "เปิดคู่มือ ASEAN CSCO", "打开东盟CSCO手册")}
            </a>
            <button className="ghost-button" onClick={() => onNavigate("/rankings")}>
              {t(locale, "Back to rankings", "กลับไปอันดับ", "返回排名")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
