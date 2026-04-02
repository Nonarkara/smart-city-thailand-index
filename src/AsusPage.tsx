import type { Locale } from "./types";

interface Props { locale: Locale; onNavigate: (path: string) => void; }

const t = (l: Locale, en: string, th: string, zh: string) => l === "th" ? th : l === "zh" ? zh : en;

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
              <span style={{ fontWeight: 700 }}>{c.city}</span>
              <span style={{ font: "500 .55rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)" }}>{c.focus}</span>
              {"linked" in c && c.linked ? (
                <button style={{ font: "600 .55rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)", background: "none", border: 0, cursor: "pointer" }}
                  onClick={() => onNavigate(`/city/${c.linked}`)}>
                  View profile →
                </button>
              ) : (
                <span style={{ font: "500 .5rem var(--mono, monospace)", color: "var(--4, #BBB)" }}>{c.country}</span>
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
            { step: "01", en: "Inception", th: "เริ่มต้น", desc: "Map policies, stakeholders, existing initiatives" },
            { step: "02", en: "Diagnostic", th: "วินิจฉัย", desc: "Problem tree, SWOT, constraints mapping with communities" },
            { step: "03", en: "Co-Design", th: "ร่วมออกแบบ", desc: "Visioning, scenario planning, solution development" },
            { step: "04", en: "Proposal", th: "ข้อเสนอ", desc: "Theory of Change, MEL framework, financing plan" },
          ].map(s => (
            <div key={s.step} style={{ padding: ".7rem .6rem", borderRight: "1px solid var(--5, #E5E5E5)" }}>
              <div style={{ font: "700 .85rem var(--mono, monospace)", color: "var(--teal, #2BBAA0)", marginBottom: ".15rem" }}>{s.step}</div>
              <div style={{ fontWeight: 700, fontSize: ".72rem", marginBottom: ".15rem" }}>{locale === "th" ? s.th : s.en}</div>
              <div style={{ fontSize: ".55rem", color: "var(--2, #444)", lineHeight: 1.4 }}>{s.desc}</div>
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
