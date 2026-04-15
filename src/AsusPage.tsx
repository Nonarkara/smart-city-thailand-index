import type { Locale } from "./types";

interface Props { locale: Locale; onNavigate: (path: string) => void; }

const t = (l: Locale, en: string, th: string, zh: string) => l === "th" ? th : l === "zh" ? zh : en;

type Tri = { en: string; th: string; zh: string };

const FOCUS_LABELS: Record<string, Tri> = {
  "Solid Waste": { en: "Solid Waste", th: "ขยะมูลฝอย", zh: "固体废物" },
  "Solid Waste Management": { en: "Solid Waste Management", th: "การจัดการขยะมูลฝอย", zh: "固体废物管理" },
  "Safety & Security": { en: "Safety & Security", th: "ความปลอดภัยและความมั่นคง", zh: "安全保障" },
  "Mobility": { en: "Mobility", th: "การเดินทาง", zh: "交通出行" },
  "Urban Resilience": { en: "Urban Resilience", th: "ความยืดหยุ่นของเมือง", zh: "城市韧性" },
  "Safe Public Spaces": { en: "Safe Public Spaces", th: "พื้นที่สาธารณะที่ปลอดภัย", zh: "安全公共空间" },
  "Housing": { en: "Housing", th: "ที่อยู่อาศัย", zh: "住房" },
  "Water, Waste & Sanitation": { en: "Water, Waste & Sanitation", th: "น้ำ ขยะ และสุขาภิบาล", zh: "水、废物与环卫" },
};

const COUNTRY_LABELS: Record<string, Tri> = {
  Cambodia: { en: "Cambodia", th: "กัมพูชา", zh: "柬埔寨" },
  Indonesia: { en: "Indonesia", th: "อินโดนีเซีย", zh: "印度尼西亚" },
  "Lao PDR": { en: "Lao PDR", th: "สปป.ลาว", zh: "老挝" },
  Malaysia: { en: "Malaysia", th: "มาเลเซีย", zh: "马来西亚" },
  Myanmar: { en: "Myanmar", th: "เมียนมา", zh: "缅甸" },
  Philippines: { en: "Philippines", th: "ฟิลิปปินส์", zh: "菲律宾" },
  Thailand: { en: "Thailand", th: "ไทย", zh: "泰国" },
  Vietnam: { en: "Vietnam", th: "เวียดนาม", zh: "越南" },
};

const CITY_LABELS: Record<string, Tri> = {
  "Sihanoukville": { en: "Sihanoukville", th: "สีหนุวิลล์", zh: "西哈努克" },
  "Siem Reap": { en: "Siem Reap", th: "เสียมเรียบ", zh: "暹粒" },
  "Pekanbaru": { en: "Pekanbaru", th: "เปกันบารู", zh: "北干巴鲁" },
  "Makassar": { en: "Makassar", th: "มากัสซาร์", zh: "望加锡" },
  "Oudomxay": { en: "Oudomxay", th: "อุดมไซ", zh: "乌多姆赛" },
  "Luang Prabang": { en: "Luang Prabang", th: "หลวงพระบาง", zh: "琅勃拉邦" },
  "Miri": { en: "Miri", th: "มิริ", zh: "美里" },
  "Iskandar Puteri": { en: "Iskandar Puteri", th: "อิสกันดาร์ ปูเตรี", zh: "依斯干达公主城" },
  "Yangon": { en: "Yangon", th: "ย่างกุ้ง", zh: "仰光" },
  "Cebu City": { en: "Cebu City", th: "เซบู", zh: "宿务市" },
  "Caloocan City": { en: "Caloocan City", th: "คาโลคัน", zh: "卡洛奥坎" },
  "Nakhon Si Thammarat": { en: "Nakhon Si Thammarat", th: "นครศรีธรรมราช", zh: "洛坤府" },
  "Chiang Mai": { en: "Chiang Mai", th: "เชียงใหม่", zh: "清迈" },
  "Bac Giang": { en: "Bac Giang", th: "บั๊กซาง", zh: "北江" },
  "Hue": { en: "Hue", th: "เว้", zh: "顺化" },
};

const phase2Cities = [
  { city: "Sihanoukville", country: "Cambodia", focus: "Solid Waste", flag: "🇰🇭" },
  { city: "Siem Reap", country: "Cambodia", focus: "Safety & Security", flag: "🇰🇭" },
  { city: "Pekanbaru", country: "Indonesia", focus: "Mobility", flag: "🇮🇩" },
  { city: "Makassar", country: "Indonesia", focus: "Urban Resilience", flag: "🇮🇩" },
  { city: "Oudomxay", country: "Lao PDR", focus: "Urban Resilience", flag: "🇱🇦" },
  { city: "Luang Prabang", country: "Lao PDR", focus: "Urban Resilience", flag: "🇱🇦" },
  { city: "Miri", country: "Malaysia", focus: "Urban Resilience", flag: "🇲🇾" },
  { city: "Iskandar Puteri", country: "Malaysia", focus: "Mobility", flag: "🇲🇾" },
  { city: "Yangon", country: "Myanmar", focus: "Safe Public Spaces", flag: "🇲🇲" },
  { city: "Cebu City", country: "Philippines", focus: "Mobility", flag: "🇵🇭" },
  { city: "Caloocan City", country: "Philippines", focus: "Housing", flag: "🇵🇭" },
  { city: "Nakhon Si Thammarat", country: "Thailand", focus: "Solid Waste Management", flag: "🇹🇭", linked: "nakhon-si-thammarat" },
  { city: "Chiang Mai", country: "Thailand", focus: "Safety & Security", flag: "🇹🇭", linked: "chiang-mai-old-town" },
  { city: "Bac Giang", country: "Vietnam", focus: "Water, Waste & Sanitation", flag: "🇻🇳" },
  { city: "Hue", country: "Vietnam", focus: "Urban Resilience", flag: "🇻🇳" },
];

function tri(locale: Locale, key: string, dict: Record<string, Tri>): string {
  const entry = dict[key];
  if (!entry) return key;
  return locale === "th" ? entry.th : locale === "zh" ? entry.zh : entry.en;
}

export default function AsusPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section" style={{ paddingTop: "4.5rem", paddingBottom: "1rem" }}>
        <p className="eyebrow">{t(locale, "UN-Habitat", "UN-Habitat", "联合国人居署")}</p>
        <h1 style={{ fontFamily: "var(--serif, Georgia, serif)", fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, letterSpacing: "-.03em", lineHeight: ".95", marginBottom: ".5rem" }}>
          {t(locale,
            "Accelerating Sustainable Urbanisation in ASEAN",
            "เร่งรัดการพัฒนาเมืองอย่างยั่งยืนในอาเซียน",
            "加速东盟可持续城市化"
          )}
        </h1>
        <p style={{ fontSize: ".85rem", color: "var(--2, #444)", lineHeight: 1.7, maxWidth: "520px" }}>
          {t(locale,
            "The ASUS Project Phase II partners UN-Habitat with 15 ASEAN cities across 7 countries. Thailand contributes Nakhon Si Thammarat (Solid Waste) and Chiang Mai (Safety & Security) — two cities already in our Smart City Index.",
            "โครงการ ASUS Phase II ร่วมมือ UN-Habitat กับ 15 เมืองอาเซียนใน 7 ประเทศ ไทยเข้าร่วมด้วยนครศรีธรรมราช (ขยะ) และเชียงใหม่ (ความปลอดภัย) — สองเมืองที่อยู่ในดัชนีของเราแล้ว",
            "ASUS 二期项目由联合国人居署与 7 个国家的 15 座东盟城市合作。泰国贡献了那空是贪玛叻（固体废物）和清迈（安全保障）——两座已在我们指数中的城市。"
          )}
        </p>
      </section>

      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Phase II Cities", "เมือง Phase II", "二期城市")}</p>
        <h2>{t(locale, "15 cities, 7 countries, 6 focus areas", "15 เมือง 7 ประเทศ 6 ด้าน", "15座城市，7个国家，6个重点领域")}</h2>
        <div style={{ borderTop: "2px solid var(--ink, #111)" }}>
          {phase2Cities.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2rem 1fr 10rem auto", gap: ".4rem", padding: ".4rem 0", borderBottom: "1px solid var(--5, #E5E5E5)", alignItems: "center", fontSize: ".72rem" }}>
              <span>{c.flag}</span>
              <span style={{ fontWeight: 700 }}>{tri(locale, c.city, CITY_LABELS)}</span>
              <span style={{ font: "500 .55rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)" }}>{tri(locale, c.focus, FOCUS_LABELS)}</span>
              {"linked" in c && c.linked ? (
                <button style={{ font: "600 .55rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)", background: "none", border: 0, cursor: "pointer" }}
                  onClick={() => onNavigate(`/city/${c.linked}`)}>
                  {t(locale, "View profile", "ดูโปรไฟล์", "查看档案")} →
                </button>
              ) : (
                <span style={{ font: "500 .5rem var(--mono, monospace)", color: "var(--4, #BBB)" }}>{tri(locale, c.country, COUNTRY_LABELS)}</span>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Methodology", "วิธีการ", "方法论")}</p>
        <h2>{t(locale, "Inception → Diagnostic → Co-Design → Technical Proposal", "เริ่มต้น → วินิจฉัย → ร่วมออกแบบ → ข้อเสนอทางเทคนิค", "启动 → 诊断 → 共同设计 → 技术方案")}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 0, border: "1px solid var(--5, #E5E5E5)" }}>
          {[
            { step: "01", title: { en: "Inception", th: "เริ่มต้น", zh: "启动" }, desc: { en: "Map policies, stakeholders, existing initiatives", th: "ทำแผนนโยบาย ผู้มีส่วนได้ส่วนเสีย และโครงการที่มีอยู่", zh: "梳理政策、利益相关者与既有倡议" } },
            { step: "02", title: { en: "Diagnostic", th: "วินิจฉัย", zh: "诊断" }, desc: { en: "Problem tree, SWOT, constraints mapping with communities", th: "แผนผังปัญหา SWOT และข้อจำกัดร่วมกับชุมชน", zh: "问题树、SWOT 与与社区共同梳理约束" } },
            { step: "03", title: { en: "Co-Design", th: "ร่วมออกแบบ", zh: "共同设计" }, desc: { en: "Visioning, scenario planning, solution development", th: "วางวิสัยทัศน์ สถานการณ์จำลอง และพัฒนาโซลูชัน", zh: "愿景构建、情景规划与方案开发" } },
            { step: "04", title: { en: "Proposal", th: "ข้อเสนอ", zh: "方案" }, desc: { en: "Theory of Change, MEL framework, financing plan", th: "ทฤษฎีการเปลี่ยนแปลง กรอบ MEL และแผนการเงิน", zh: "变革理论、MEL 框架与融资计划" } },
          ].map(s => (
            <div key={s.step} style={{ padding: ".7rem .6rem", borderRight: "1px solid var(--5, #E5E5E5)" }}>
              <div style={{ font: "700 .85rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)", marginBottom: ".15rem" }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: ".72rem", marginBottom: ".15rem" }}>{t(locale, s.title.en, s.title.th, s.title.zh)}</div>
              <div style={{ fontSize: ".55rem", color: "var(--2, #444)", lineHeight: 1.4 }}>{t(locale, s.desc.en, s.desc.th, s.desc.zh)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ marginBottom: "2rem" }}>
        <div className="callout-card" style={{ borderLeftColor: "var(--teal, #2BBAA0)" }}>
          <h2>{t(locale, "Thailand's Two ASUS Cities", "สองเมือง ASUS ของไทย", "泰国的两座ASUS城市")}</h2>
          <p>{t(locale,
            "Nakhon Si Thammarat tackles solid waste management — the same city where the My City app cut response times from 67 hours to 2. Chiang Mai addresses safety and security in the context of its burning season air quality crisis and growing digital nomad economy.",
            "นครศรีธรรมราชรับมือการจัดการขยะ — เมืองเดียวกันที่แอพ My City ลดเวลาตอบสนองจาก 67 ชั่วโมงเหลือ 2 เชียงใหม่รับมือความปลอดภัยท่ามกลางวิกฤตคุณภาพอากาศฤดูเผาและเศรษฐกิจ digital nomad ที่เติบโต",
            "那空是贪玛叻处理固体废物管理——正是My City应用把响应时间从67小时降到2小时的那座城市。清迈在烧荒季空气质量危机和数字游民经济增长的背景下解决安全问题。"
          )}</p>
          <div style={{ display: "flex", gap: ".4rem", marginTop: ".5rem" }}>
            <button className="cta-button" onClick={() => onNavigate("/city/nakhon-si-thammarat")}>
              {t(locale, "NST Profile", "โปรไฟล์ นศ.", "那空档案")}
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/city/chiang-mai-old-town")}>
              {t(locale, "Chiang Mai Profile", "โปรไฟล์เชียงใหม่", "清迈档案")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
