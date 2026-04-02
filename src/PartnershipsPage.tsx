import { lazy, Suspense } from "react";
import type { Locale } from "./types";

const GlobeMap = lazy(() => import("./GlobeMap"));

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

interface Partnership {
  flag: string;
  country: string;
  countryTh: string;
  program: string;
  year: string;
  investment: string;
  cities: string;
  focusEn: string;
  focusTh: string;
  status: "active" | "completed" | "stalled" | "early";
  bodyEn: string;
  bodyTh: string;
  sourceUrl: string;
  sourceLabel: string;
}

const partnerships: Partnership[] = [
  {
    flag: "🇯🇵",
    country: "Japan",
    countryTh: "ญี่ปุ่น",
    program: "JASCA / Smart JAMP",
    year: "2020–present",
    investment: "250B yen / $2.4B (ASEAN-wide)",
    cities: "Bangkok (Bangsue), Phuket, Chiang Mai, Khon Kaen, Chonburi",
    focusEn: "Autonomous transport, city data platforms, CCTV, PRT systems",
    focusTh: "ขนส่งอัตโนมัติ แพลตฟอร์มข้อมูลเมือง CCTV ระบบ PRT",
    status: "active",
    bodyEn: "The single largest international smart city fund targeting ASEAN. Japan committed 250 billion yen ($2.4B) through JOIN and JBIC. PASCO deployed Mobile Mapping System technology in Bangsue for autonomous driving route planning. Zenmov proposed Primary Rapid Transit using SMOC traffic control. City data platforms built in Phuket, Chiang Mai, and Khon Kaen (2017-2018). The 6th ASEAN-Japan Smart Cities Network High Level Meeting held in 2024. JASCA coordinates Japanese private sector engagement across 108 active smart city projects.",
    bodyTh: "กองทุนเมืองอัจฉริยะระหว่างประเทศที่ใหญ่ที่สุดสำหรับอาเซียน ญี่ปุ่นจัดสรร 250,000 ล้านเยน ($2.4B) ผ่าน JOIN และ JBIC PASCO ใช้ Mobile Mapping System ที่บางซื่อสำหรับวางแผนเส้นทางขับอัตโนมัติ สร้างแพลตฟอร์มข้อมูลเมืองที่ภูเก็ต เชียงใหม่ ขอนแก่น JASCA ประสานภาคเอกชนญี่ปุ่นใน 108 โครงการทั่วอาเซียน",
    sourceUrl: "https://www.jasca2021.jp/cooperative/country/thailand/",
    sourceLabel: "JASCA Thailand",
  },
  {
    flag: "🇺🇸",
    country: "United States",
    countryTh: "สหรัฐอเมริกา",
    program: "U.S.-ASEAN Smart Cities Partnership (USASCP)",
    year: "2018–present",
    investment: "$10M initial (ASEAN-wide)",
    cities: "Bangkok, Phuket",
    focusEn: "Energy grid, water management, ICT infrastructure, 5G, cybersecurity",
    focusTh: "ระบบไฟฟ้า จัดการน้ำ โครงสร้างพื้นฐาน ICT 5G ความปลอดภัยไซเบอร์",
    status: "active",
    bodyEn: "Announced at the 6th ASEAN-U.S. Summit in Singapore (November 2018). Bangkok paired with Pacific Northwest National Labs for renewable energy grid integration. Phuket paired with Milwaukee under the Water Smart Engagements (WiSE) program. USTDA provided a separate technical assistance grant to depa for upgrading Phuket's integrated operations center — covering traffic control, emergency communications, fiber optics, cloud migration, and 5G infrastructure.",
    bodyTh: "ประกาศที่การประชุม ASEAN-U.S. Summit ครั้งที่ 6 สิงคโปร์ (2561) กรุงเทพฯ จับคู่กับ Pacific Northwest National Labs ด้านพลังงานหมุนเวียน ภูเก็ตจับคู่กับมิลวอกีในโปรแกรม WiSE USTDA ให้ทุนช่วยเหลือทางเทคนิคแก่ depa อัพเกรดศูนย์ปฏิบัติการภูเก็ต — จราจร สื่อสารฉุกเฉิน ไฟเบอร์ คลาวด์ 5G",
    sourceUrl: "https://asean.usmission.gov/u-s-asean-smart-cities-partnership-usascp-sharing-expertise-between-cities-to-benefit-the-people-of-asean/",
    sourceLabel: "U.S. Mission to ASEAN",
  },
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    countryTh: "สหราชอาณาจักร",
    program: "Smart City Handbook & Global Future Cities",
    year: "2020–present",
    investment: "Prosperity Fund (multi-country)",
    cities: "Bangkok, Chiang Mai, Khon Kaen, Chonburi",
    focusEn: "Flood management, data-driven planning, urban development, EV solutions",
    focusTh: "จัดการน้ำท่วม วางแผนจากข้อมูล พัฒนาเมือง โซลูชัน EV",
    status: "completed",
    bodyEn: "UK-Thailand Smart City Handbook launched at Smart City Week 2020 — a joint publication by FCDO, depa, and Urban Studies Lab. Global Future Cities Programme delivered 3 projects in Bangkok: Lad Phrao flood management, BMA data centre plan, and Khlong Bang Luang masterplan. Smart City Workshops conducted in Chiang Mai, Khon Kaen, and Chonburi. Digital Trade Network launched with Thailand as focal market.",
    bodyTh: "คู่มือเมืองอัจฉริยะ UK-Thailand เปิดตัวที่ Smart City Week 2020 Global Future Cities Programme ส่งมอบ 3 โครงการในกรุงเทพฯ: จัดการน้ำท่วมลาดพร้าว แผน data centre BMA แผนแม่บทคลองบางหลวง เวิร์กช็อปที่เชียงใหม่ ขอนแก่น ชลบุรี",
    sourceUrl: "https://www.gov.uk/government/news/uk-partner-with-thailand-to-create-smarter-cities",
    sourceLabel: "GOV.UK",
  },
  {
    flag: "🇰🇷",
    country: "South Korea",
    countryTh: "เกาหลีใต้",
    program: "K-City Global Collaboration",
    year: "2020",
    investment: "Technical assistance",
    cities: "Khon Kaen",
    focusEn: "Light rail transit, smart mobility planning",
    focusTh: "รถไฟฟ้ารางเบา วางแผนการเดินทางอัจฉริยะ",
    status: "stalled",
    bodyEn: "Korea Transport Institute (KOTI) selected Khon Kaen's Smart Mobility Plan from 80 competing proposals worldwide. Technical study of the 22.6km LRT with 16-18 stations (Samran–Tha Phra route). Driven by Khon Kaen Think Tank citizen group and Khon Kaen Transit System Co. As of 2025, construction has not begun — funding and land acquisition remain challenging. But the technical blueprint exists.",
    bodyTh: "Korea Transport Institute เลือกแผน Smart Mobility ขอนแก่นจาก 80 ข้อเสนอทั่วโลก ศึกษา LRT 22.6 กม. 16-18 สถานี ขับเคลื่อนโดย Khon Kaen Think Tank ปี 2568 ยังไม่เริ่มก่อสร้าง — ปัญหาเงินทุนและเวนคืนที่ดิน แต่พิมพ์เขียวทางเทคนิคมีพร้อม",
    sourceUrl: "https://www.bangkokpost.com/thailand/general/1990795/khon-kaen-rail-gets-s-korean-guidance",
    sourceLabel: "Bangkok Post",
  },
  {
    flag: "🇦🇹",
    country: "Austria",
    countryTh: "ออสเตรีย",
    program: "Advantage Austria MOU",
    year: "2022",
    investment: "MOU stage",
    cities: "National-level",
    focusEn: "Technology exchange, liveable city expertise, pilot projects",
    focusTh: "แลกเปลี่ยนเทคโนโลยี ความเชี่ยวชาญเมืองน่าอยู่ โครงการนำร่อง",
    status: "early",
    bodyEn: "MOU signed during Austrian Technology Days Southeast Asia 2022. Leverages Vienna's consistent ranking among the world's smartest and most liveable cities. Joint pilot projects and proof-of-concept planned. Advantage Austria operates 100 offices in 70+ countries. Early stage — no major follow-up announcements yet.",
    bodyTh: "MOU ลงนามในงาน Austrian Technology Days Southeast Asia 2022 ใช้ประโยชน์จากเวียนนาที่ติดอันดับเมืองอัจฉริยะและน่าอยู่ที่สุดอย่างสม่ำเสมอ วางแผนโครงการนำร่องและ proof-of-concept ระยะเริ่มต้น",
    sourceUrl: "https://archive.opengovasia.com/2022/01/20/thailand-and-austrian-trade-group-sign-smart-city-mou/",
    sourceLabel: "OpenGov Asia",
  },
];

const statusLabels: Record<string, Record<Locale, string>> = {
  active: { en: "Active", th: "ดำเนินการอยู่", zh: "活跃" },
  completed: { en: "Completed", th: "เสร็จสิ้น", zh: "已完成" },
  stalled: { en: "Stalled", th: "ชะลอ", zh: "停滞" },
  early: { en: "Early stage", th: "ระยะเริ่มต้น", zh: "早期" },
};

const statusColors: Record<string, string> = {
  active: "var(--teal, #2BBAA0)",
  completed: "var(--silk-blue, #3068C8)",
  stalled: "var(--coral, #D04848)",
  early: "var(--gold, #D4A843)",
};

export default function PartnershipsPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section" style={{ paddingTop: "7.5rem", paddingBottom: "1rem" }}>
        <p className="eyebrow">{t(locale, "International", "ระหว่างประเทศ", "国际合作")}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
          {locale === "th"
            ? <>5 ประเทศ 1 ภารกิจ:<br />สร้างเมืองที่ดีกว่า</>
            : locale === "zh"
              ? <>5 个国家，1 个使命：<br />建设更好的城市</>
              : <>5 countries, 1 mission:<br />build better cities.</>}
        </h1>
        <p className="hero-strapline">
          {t(locale,
            "Thailand's smart city program doesn't operate in isolation. From Japan's $2.4 billion ASEAN fund to a Khon Kaen citizen group convincing South Korea to plan their rail, these partnerships bring global expertise to local problems.",
            "โปรแกรมเมืองอัจฉริยะไทยไม่ได้ทำงานแยกเดี่ยว จากกองทุน $2.4B ของญี่ปุ่นถึงกลุ่มพลเมืองขอนแก่นที่ชักชวนเกาหลีใต้วางแผนรถไฟ ความร่วมมือเหล่านี้นำความเชี่ยวชาญระดับโลกมาแก้ปัญหาท้องถิ่น",
            "泰国智慧城市项目并非闭门造车。从日本24亿美元的东盟基金，到孔敬市民团体说服韩国帮忙规划轻轨——这些合作把全球专业知识带到了本地问题面前。"
          )}
        </p>
      </section>

      {/* ─── GLOBE MAP ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <p className="eyebrow">{t(locale, "Global network", "เครือข่ายทั่วโลก", "全球网络")}</p>
        <h2>{t(locale,
          "50+ organizations across 15 countries",
          "50+ องค์กรใน 15+ ประเทศ",
          "15个国家50+个组织"
        )}</h2>
        <Suspense fallback={null}>
          <GlobeMap locale={locale} />
        </Suspense>
      </section>

      {/* ─── PARTNERSHIP CARDS ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        {partnerships.map((p, i) => (
          <div key={i} style={{ borderTop: i === 0 ? "2px solid var(--ink, #2A2520)" : "none", borderBottom: "1px solid var(--border, rgba(0,0,0,0.08))", padding: "1.5rem 0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "2.5rem 1fr auto", gap: "0.75rem", alignItems: "start", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "2rem", lineHeight: 1 }}>{p.flag}</span>
              <div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.15, marginBottom: "0.15rem" }}>
                  {locale === "th" ? p.countryTh : p.country}
                </div>
                <div style={{ fontSize: "0.68rem", fontFamily: "var(--font-mono, monospace)", color: "var(--ink-muted, #9A948E)" }}>
                  {p.program} · {p.year}
                </div>
              </div>
              <span style={{
                fontSize: "0.55rem",
                fontWeight: 700,
                fontFamily: "var(--font-mono, monospace)",
                padding: "0.1rem 0.4rem",
                color: statusColors[p.status],
                background: `${statusColors[p.status]}15`,
              }}>
                {statusLabels[p.status][locale]}
              </span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0", border: "1px solid var(--border, rgba(0,0,0,0.08))", marginBottom: "0.75rem", fontSize: "0.68rem" }}>
              <div style={{ padding: "0.4rem 0.6rem", borderRight: "1px solid var(--border, rgba(0,0,0,0.08))" }}>
                <div style={{ fontSize: "0.48rem", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--teal, #2BBAA0)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.1rem" }}>
                  {t(locale, "Investment", "การลงทุน", "投资")}
                </div>
                <div style={{ fontWeight: 700 }}>{p.investment}</div>
              </div>
              <div style={{ padding: "0.4rem 0.6rem", borderRight: "1px solid var(--border, rgba(0,0,0,0.08))" }}>
                <div style={{ fontSize: "0.48rem", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--teal, #2BBAA0)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.1rem" }}>
                  {t(locale, "Thai cities", "เมืองไทย", "泰国城市")}
                </div>
                <div>{p.cities}</div>
              </div>
              <div style={{ padding: "0.4rem 0.6rem" }}>
                <div style={{ fontSize: "0.48rem", fontWeight: 700, fontFamily: "var(--font-mono, monospace)", color: "var(--teal, #2BBAA0)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.1rem" }}>
                  {t(locale, "Focus", "เน้น", "焦点")}
                </div>
                <div>{locale === "th" ? p.focusTh : p.focusEn}</div>
              </div>
            </div>

            <p style={{ fontSize: "0.78rem", color: "var(--ink-soft, #6B6460)", lineHeight: 1.65, maxWidth: "640px", marginBottom: "0.4rem" }}>
              {locale === "th" ? p.bodyTh : p.bodyEn}
            </p>

            <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "0.6rem", fontWeight: 600, fontFamily: "var(--font-mono, monospace)", color: "var(--teal, #2BBAA0)" }}>
              {p.sourceLabel} →
            </a>
          </div>
        ))}
      </section>

      {/* ─── SUMMARY ─── */}
      <section className="section" style={{ marginBottom: "2.5rem" }}>
        <div className="callout-card">
          <h2>{t(locale,
            "From bilateral MOUs to billion-dollar funds",
            "จาก MOU ทวิภาคีถึงกองทุนพันล้าน",
            "从双边备忘录到数十亿美元的基金"
          )}</h2>
          <p>{t(locale,
            "Japan's $2.4B ASEAN fund is the largest. The U.S. paired Phuket with Milwaukee. The UK built Bangkok's flood management system. South Korea designed Khon Kaen's rail. Austria brought Vienna's liveable-city expertise. These aren't photo-op partnerships — they've produced real infrastructure, real data platforms, and real technical blueprints that Thai cities are using today.",
            "กองทุน $2.4B ของญี่ปุ่นใหญ่ที่สุด สหรัฐจับคู่ภูเก็ตกับมิลวอกี UK สร้างระบบจัดการน้ำท่วมกรุงเทพฯ เกาหลีออกแบบรถไฟขอนแก่น ออสเตรียนำความเชี่ยวชาญเมืองน่าอยู่ของเวียนนามา ไม่ใช่ความร่วมมือถ่ายรูป — ผลิตโครงสร้างพื้นฐานจริง แพลตฟอร์มข้อมูลจริง พิมพ์เขียวทางเทคนิคจริง",
            "日本24亿美元东盟基金规模最大。美国把普吉岛和密尔沃基配对。英国为曼谷建设了洪水管理系统。韩国为孔敬设计了轻轨。奥地利带来了维也纳的宜居城市经验。这些不是摆拍合作——它们产出了真正的基础设施、真正的数据平台和泰国城市今天正在使用的技术蓝图。"
          )}</p>
          <button className="cta-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, "See the city rankings", "ดูอันดับเมือง", "查看城市排名")}
          </button>
        </div>
      </section>
    </>
  );
}
