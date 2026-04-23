import { lazy, Suspense } from "react";
import type { Locale } from "./types";

const GlobeMap = lazy(() => import("./GlobeMap"));

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface Partnership {
  flag: string;
  country: string;
  countryTh: string;
  countryZh: string;
  program: string;
  year: string;
  investment: string;
  cities: string;
  focusEn: string;
  focusTh: string;
  focusZh: string;
  status: "active" | "completed" | "stalled" | "early";
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
  sourceUrl: string;
  sourceLabel: string;
}

const partnerships: Partnership[] = [
  {
    flag: "🇯🇵",
    country: "Japan",
    countryTh: "ญี่ปุ่น",
    countryZh: "日本",
    program: "JASCA / Smart JAMP",
    year: "2020–present",
    investment: "250B yen / $2.4B (ASEAN-wide)",
    cities: "Bangkok (Bangsue), Phuket, Chiang Mai, Khon Kaen, Chonburi",
    focusEn: "Autonomous transport, city data platforms, CCTV, PRT systems",
    focusTh: "ขนส่งอัตโนมัติ แพลตฟอร์มข้อมูลเมือง CCTV และระบบ PRT",
    focusZh: "自动交通、城市数据平台、CCTV 与 PRT 系统",
    status: "active",
    bodyEn: "Japan is the biggest external system-builder in this list. The programme-scale fund is regional, not Thailand-only, but Thailand repeatedly shows up in the delivery layer: Bangsue mapping for autonomous-route planning, city data platform work, and a standing coordination channel through JASCA.",
    bodyTh: "ญี่ปุ่นคือผู้เล่นต่างประเทศที่ลงมือสร้างระบบมากที่สุดในลิสต์นี้ เงินก้อนนี้เป็นระดับภูมิภาค ไม่ใช่เงินลงไทยล้วนๆ แต่ไทยโผล่อยู่ในชั้นการส่งมอบซ้ำๆ ทั้งงาน mapping ที่บางซื่อสำหรับเส้นทางอัตโนมัติ งาน city data platform และช่องทางประสานงานต่อเนื่องผ่าน JASCA",
    bodyZh: "日本是这份名单里最像“系统建设者”的外部伙伴。资金规模是区域级的，不是全部砸在泰国，但泰国持续出现在交付层：包括 Bangsue 自动驾驶路线测绘、城市数据平台工作，以及通过 JASCA 持续存在的协调通道。",
    sourceUrl: "https://www.jasca2021.jp/cooperative/country/thailand/",
    sourceLabel: "JASCA Thailand",
  },
  {
    flag: "🇺🇸",
    country: "United States",
    countryTh: "สหรัฐอเมริกา",
    countryZh: "美国",
    program: "U.S.-ASEAN Smart Cities Partnership",
    year: "2018–present",
    investment: "$10M initial (ASEAN-wide)",
    cities: "Bangkok, Phuket",
    focusEn: "Energy grid, water management, ICT infrastructure, 5G, cybersecurity",
    focusTh: "โครงข่ายพลังงาน จัดการน้ำ ICT โครงสร้างพื้นฐาน 5G และความปลอดภัยไซเบอร์",
    focusZh: "能源电网、水管理、ICT 基础设施、5G 与网络安全",
    status: "active",
    bodyEn: "The U.S. line is narrower but technically specific. Bangkok and Phuket are linked to concrete expertise rather than vague branding: renewable-grid planning, water-management exchanges, and technical assistance for Phuket's operations centre and communications stack.",
    bodyTh: "เส้นของสหรัฐแคบกว่า แต่เฉพาะทางเชิงเทคนิคกว่า กรุงเทพฯ และภูเก็ตเชื่อมกับความเชี่ยวชาญที่จับต้องได้ ไม่ใช่แค่แบรนด์ลอยๆ เช่น การวางแผนโครงข่ายพลังงาน งานจัดการน้ำ และ technical assistance สำหรับศูนย์ปฏิบัติการกับระบบสื่อสารของภูเก็ต",
    bodyZh: "美国这条线规模更窄，但技术指向更明确。曼谷与普吉对应的是具体专长，而不是抽象品牌：可再生能源电网规划、水管理交流，以及对普吉运营中心与通信栈的技术支持。",
    sourceUrl: "https://asean.usmission.gov/u-s-asean-smart-cities-partnership-usascp-sharing-expertise-between-cities-to-benefit-the-people-of-asean/",
    sourceLabel: "U.S. Mission to ASEAN",
  },
  {
    flag: "🇬🇧",
    country: "United Kingdom",
    countryTh: "สหราชอาณาจักร",
    countryZh: "英国",
    program: "Smart City Handbook & Global Future Cities",
    year: "2020–present",
    investment: "Prosperity Fund (multi-country)",
    cities: "Bangkok, Chiang Mai, Khon Kaen, Chonburi",
    focusEn: "Flood management, data-driven planning, urban development, EV solutions",
    focusTh: "จัดการน้ำท่วม วางแผนจากข้อมูล พัฒนาเมือง และโซลูชัน EV",
    focusZh: "防洪、数据驱动规划、城市发展与电动车方案",
    status: "completed",
    bodyEn: "The UK work reads like a delivered programme rather than an open-ended courtship. Bangkok got concrete planning outputs through Global Future Cities, and the UK-Thailand handbook helped translate smart-city language into a more usable operating vocabulary for Thai cities.",
    bodyTh: "งานของสหราชอาณาจักรอ่านแล้วเหมือนโปรแกรมที่ส่งมอบแล้ว มากกว่าการเกี้ยวพาราสีแบบปลายเปิด กรุงเทพฯ ได้ output เชิงแผนที่เป็นรูปธรรมจาก Global Future Cities และคู่มือ UK-Thailand ก็ช่วยแปลภาษาสมาร์ตซิตี้ให้กลายเป็นคำศัพท์การทำงานที่ใช้ง่ายขึ้นสำหรับเมืองไทย",
    bodyZh: "英国这条线更像一个已交付项目，而不是一场长期暧昧。曼谷通过 Global Future Cities 拿到了具体规划成果，UK-Thailand 手册也把“智慧城市”这套话语翻译成更适合泰国城市拿来工作的操作语言。",
    sourceUrl: "https://www.gov.uk/government/news/uk-partner-with-thailand-to-create-smarter-cities",
    sourceLabel: "GOV.UK",
  },
  {
    flag: "🇰🇷",
    country: "South Korea",
    countryTh: "เกาหลีใต้",
    countryZh: "韩国",
    program: "K-City Global Collaboration",
    year: "2020",
    investment: "Technical assistance",
    cities: "Khon Kaen",
    focusEn: "Light rail transit, smart mobility planning",
    focusTh: "รถไฟฟ้ารางเบาและการวางแผนการเดินทางอัจฉริยะ",
    focusZh: "轻轨与智慧交通规划",
    status: "stalled",
    bodyEn: "South Korea's role in Khon Kaen matters because it produced a serious blueprint, not because it produced immediate construction. The technical study exists. The implementation story remains hard: funding, land, and local execution are the bottlenecks.",
    bodyTh: "บทบาทของเกาหลีใต้ในขอนแก่นสำคัญ เพราะมันสร้างพิมพ์เขียวจริงจัง ไม่ใช่เพราะมันนำไปสู่การก่อสร้างทันที งานศึกษาทางเทคนิคมีอยู่แล้ว แต่เรื่อง implementation ยังหนัก ทั้งเงิน ที่ดิน และการขับเคลื่อนท้องถิ่น",
    bodyZh: "韩国在孔敬的重要性，不在于立刻开工，而在于确实做出了严肃的蓝图。技术研究已经存在，但真正实施仍然卡在资金、土地与地方执行上。",
    sourceUrl: "https://www.bangkokpost.com/thailand/general/1990795/khon-kaen-rail-gets-s-korean-guidance",
    sourceLabel: "Bangkok Post",
  },
  {
    flag: "🇦🇹",
    country: "Austria",
    countryTh: "ออสเตรีย",
    countryZh: "奥地利",
    program: "Advantage Austria MOU",
    year: "2022",
    investment: "MOU stage",
    cities: "National-level",
    focusEn: "Technology exchange, liveable-city expertise, pilot projects",
    focusTh: "แลกเปลี่ยนเทคโนโลยี ความเชี่ยวชาญเมืองน่าอยู่ และโครงการนำร่อง",
    focusZh: "技术交流、宜居城市经验与试点项目",
    status: "early",
    bodyEn: "Austria is here as a useful reminder that not every smart-city partnership is mature. Vienna's expertise is attractive, the MOU is real, and the intent is sensible. But the visible follow-through is still light, so this page treats it as early-stage rather than pretending there is more delivery than the record shows.",
    bodyTh: "ออสเตรียอยู่ในหน้านี้เพื่อเตือนว่า ไม่ใช่ทุกความร่วมมือด้านสมาร์ตซิตี้จะสุกงอม ความเชี่ยวชาญของเวียนนาน่าสนใจ MOU ก็มีอยู่จริง และเจตนาก็สมเหตุสมผล แต่ follow-through ที่มองเห็นได้ยังบาง ดังนั้นหน้านี้จึงจัดไว้เป็น early-stage ไม่ใช่แกล้งทำเหมือนมีของส่งมอบมากกว่าที่หลักฐานบอก",
    bodyZh: "把奥地利放进这一页，是为了提醒一件ตรงไปตรง来的事：并不是每个智慧城市合作都已经成熟。维也纳的经验很有吸引力，MOU 也是真的，意图也合理。但目前看得到的后续动作仍然偏少，所以本页把它归为早期阶段，而不是假装它已经有超出记录的交付成果。",
    sourceUrl: "https://archive.opengovasia.com/2022/01/20/thailand-and-austrian-trade-group-sign-smart-city-mou/",
    sourceLabel: "OpenGov Asia",
  },
];

const statusLabels: Record<Partnership["status"], Record<Locale, string>> = {
  active: { en: "Active", th: "ยังเดินอยู่", zh: "仍在推进" },
  completed: { en: "Completed", th: "ส่งมอบแล้ว", zh: "已交付" },
  stalled: { en: "Stalled", th: "ติดคอขวด", zh: "推进受阻" },
  early: { en: "Early stage", th: "ยังต้นน้ำ", zh: "仍在早期" },
};

const statusNotes: Record<Partnership["status"], Record<Locale, string>> = {
  active: {
    en: "Visible follow-through or ongoing programme infrastructure still matters in the Thai context.",
    th: "ยังเห็น follow-through หรือโครงสร้างโปรแกรมที่มีผลต่อบริบทไทยอยู่",
    zh: "仍能看到后续动作，或项目基础设施仍对泰国情境有影响。",
  },
  completed: {
    en: "Delivered outputs are visible, even if the programme itself is no longer the main active channel.",
    th: "เห็น output ที่ส่งมอบแล้ว แม้โปรแกรมจะไม่ใช่ช่องทางหลักที่ active อยู่ในตอนนี้",
    zh: "交付成果仍然可见，即使该项目本身已不是当前最活跃通道。",
  },
  stalled: {
    en: "The technical blueprint is real, but execution has slowed or hit structural barriers.",
    th: "พิมพ์เขียวทางเทคนิคมีจริง แต่การลงมือทำช้าลงหรือชนข้อจำกัดเชิงโครงสร้าง",
    zh: "技术蓝图是真实存在的，但执行已放缓或撞上结构性障碍。",
  },
  early: {
    en: "Intent and institutional contact exist, but the delivery record is still thin.",
    th: "มีทั้งเจตนาและช่องทางเชิงสถาบันแล้ว แต่ประวัติการส่งมอบยังบาง",
    zh: "意向与制度联系已经存在，但交付记录仍然偏薄。",
  },
};

type Tri = { en: string; th: string; zh: string };

const TIMELINE: Array<{ year: string; flag: string; project: Tri; country: Tri }> = [
  { year: "2017", flag: "🇹🇭", project: { en: "depa established, Smart City Thailand Office created", th: "ก่อตั้ง depa และสำนักงานเมืองอัจฉริยะแห่งประเทศไทย", zh: "depa 成立，泰国智慧城市办公室设立" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2018", flag: "🇺🇸", project: { en: "U.S.-ASEAN Smart Cities Partnership launched ($10M)", th: "เปิดตัวความร่วมมือเมืองอัจฉริยะสหรัฐฯ-อาเซียน (10 ล้านดอลลาร์)", zh: "美国-东盟智慧城市伙伴关系启动（1,000 万美元）" }, country: { en: "USA", th: "สหรัฐฯ", zh: "美国" } },
  { year: "2018", flag: "🇹🇭", project: { en: "ASCN pilot cities: Bangkok, Chiang Mai, Phuket selected", th: "เมืองนำร่อง ASCN: กรุงเทพฯ เชียงใหม่ ภูเก็ต", zh: "ASCN 试点城市选出：曼谷、清迈、普吉" }, country: { en: "Thailand/ASEAN", th: "ไทย/อาเซียน", zh: "泰国 / 东盟" } },
  { year: "2019", flag: "🇰🇷", project: { en: "Korea K-City collaboration — Khon Kaen LRT planning", th: "ความร่วมมือ K-City กับเกาหลี — วางแผน LRT ขอนแก่น", zh: "韩国 K-City 合作——孔敬轻轨规划" }, country: { en: "South Korea", th: "เกาหลีใต้", zh: "韩国" } },
  { year: "2019", flag: "🇯🇵", project: { en: "JICA technical cooperation with depa begins", th: "JICA เริ่มความร่วมมือทางเทคนิคกับ depa", zh: "JICA 与 depa 启动技术合作" }, country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" } },
  { year: "2019", flag: "🇹🇭", project: { en: "Batch 1: 15 cities certified as Smart City Local", th: "รุ่นที่ 1: 15 เมืองได้รับการรับรองเมืองอัจฉริยะท้องถิ่น", zh: "第 1 批：15 座城市获得智慧城市本地认证" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2020", flag: "🇯🇵", project: { en: "JASCA Smart JAMP fund launched (250B yen ASEAN-wide)", th: "เปิดตัวกองทุน JASCA Smart JAMP (2.5 แสนล้านเยนระดับอาเซียน)", zh: "JASCA Smart JAMP 基金启动（东盟范围 2,500 亿日元）" }, country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" } },
  { year: "2020", flag: "🇬🇧", project: { en: "UK Prosperity Fund — Smart City Handbook for Thailand", th: "UK Prosperity Fund — คู่มือเมืองอัจฉริยะสำหรับประเทศไทย", zh: "英国繁荣基金——泰国智慧城市手册" }, country: { en: "UK", th: "สหราชอาณาจักร", zh: "英国" } },
  { year: "2020", flag: "🇦🇹", project: { en: "Austria Advantage Austria MOU signed", th: "ลงนาม MOU Advantage Austria", zh: "签署 Advantage Austria 备忘录" }, country: { en: "Austria", th: "ออสเตรีย", zh: "奥地利" } },
  { year: "2020", flag: "🇺🇸", project: { en: "USTDA grant for Phuket data platform", th: "ทุน USTDA สำหรับแพลตฟอร์มข้อมูลภูเก็ต", zh: "USTDA 资助普吉数据平台" }, country: { en: "USA", th: "สหรัฐฯ", zh: "美国" } },
  { year: "2021", flag: "🇹🇭", project: { en: "Batch 2: 15 more cities certified", th: "รุ่นที่ 2: รับรองเพิ่มอีก 15 เมือง", zh: "第 2 批：再认证 15 座城市" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2021", flag: "🇺🇸🇹🇭", project: { en: "YSEALI Smart Cities Workshop — Smart City Primer published", th: "Workshop YSEALI เมืองอัจฉริยะ — เผยแพร่ Smart City Primer", zh: "YSEALI 智慧城市工作坊——发布《智慧城市入门》" }, country: { en: "USA/Thailand", th: "สหรัฐฯ/ไทย", zh: "美国 / 泰国" } },
  { year: "2021", flag: "🇯🇵", project: { en: "Hitachi Review article: Smart City Initiatives in Thailand", th: "บทความ Hitachi Review: โครงการเมืองอัจฉริยะในประเทศไทย", zh: "日立评论文章：泰国智慧城市倡议" }, country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" } },
  { year: "2022", flag: "🇰🇷", project: { en: "Best Partnership Award — World Smart City Expo Korea", th: "รางวัล Best Partnership — World Smart City Expo เกาหลี", zh: "最佳合作奖——韩国世界智慧城市博览会" }, country: { en: "South Korea", th: "เกาหลีใต้", zh: "韩国" } },
  { year: "2023", flag: "🇹🇭", project: { en: "Batch 3: 6 cities certified. Master Plan 2 launched", th: "รุ่นที่ 3: รับรอง 6 เมือง เปิดตัวแผนแม่บทฉบับที่ 2", zh: "第 3 批：6 座城市获认证，第二期总体规划启动" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2023", flag: "🇺🇳", project: { en: "UN-Habitat ASUS Project Phase II begins (15 ASEAN cities)", th: "UN-Habitat เริ่ม ASUS Project ระยะที่ 2 (15 เมืองอาเซียน)", zh: "UN-Habitat ASUS 项目第二阶段启动（15 座东盟城市）" }, country: { en: "UN/Australia", th: "UN/ออสเตรเลีย", zh: "联合国 / 澳大利亚" } },
  { year: "2024", flag: "🇳🇿", project: { en: "New Zealand ALGIM / Smart Christchurch exchange", th: "แลกเปลี่ยน New Zealand ALGIM / Smart Christchurch", zh: "新西兰 ALGIM / Smart Christchurch 交流" }, country: { en: "New Zealand", th: "นิวซีแลนด์", zh: "新西兰" } },
  { year: "2024", flag: "🇸🇬", project: { en: "Singapore Polytechnic Digital Twin Lab partnership", th: "ความร่วมมือห้องแล็บ Digital Twin กับ Singapore Polytechnic", zh: "新加坡理工学院数字孪生实验室合作" }, country: { en: "Singapore", th: "สิงคโปร์", zh: "新加坡" } },
  { year: "2025", flag: "🇹🇭", project: { en: "Batch 4: Phuket Tinicon Valley certified", th: "รุ่นที่ 4: Phuket Tinicon Valley ได้รับการรับรอง", zh: "第 4 批：普吉 Tinicon Valley 获认证" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2025", flag: "🇸🇧", project: { en: "Solomon Islands — Pacific smart city knowledge exchange", th: "หมู่เกาะโซโลมอน — แลกเปลี่ยนความรู้เมืองอัจฉริยะแปซิฟิก", zh: "所罗门群岛——太平洋智慧城市知识交流" }, country: { en: "Solomon Islands", th: "หมู่เกาะโซโลมอน", zh: "所罗门群岛" } },
  { year: "2025", flag: "🇹🇭", project: { en: "ASEAN CSCO Handbook — NST as model-city case study", th: "คู่มือ ASEAN CSCO — นครศรีธรรมราชเป็นกรณีศึกษาต้นแบบ", zh: "东盟 CSCO 手册——将洛坤府作为示范城市案例" }, country: { en: "ASEAN", th: "อาเซียน", zh: "东盟" } },
  { year: "2026", flag: "🇹🇼", project: { en: "SLIC V2 launched at Smart City Summit & Expo Taipei", th: "เปิดตัว SLIC V2 ที่ Smart City Summit & Expo ไทเป", zh: "SLIC V2 在台北智慧城市峰会启动" }, country: { en: "Taiwan", th: "ไต้หวัน", zh: "台湾" } },
  { year: "2026", flag: "🇹🇭", project: { en: "SCITI 2026 — first transparent outcome-based assessment", th: "SCITI 2026 — การประเมินโปร่งใสที่เน้นผลลัพธ์ครั้งแรก", zh: "SCITI 2026——首个透明的结果导向评估" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
];

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

function countryLabel(locale: Locale, partnership: Partnership): string {
  return locale === "th" ? partnership.countryTh : locale === "zh" ? partnership.countryZh : partnership.country;
}

function focusLabel(locale: Locale, partnership: Partnership): string {
  return locale === "th" ? partnership.focusTh : locale === "zh" ? partnership.focusZh : partnership.focusEn;
}

function bodyLabel(locale: Locale, partnership: Partnership): string {
  return locale === "th" ? partnership.bodyTh : locale === "zh" ? partnership.bodyZh : partnership.bodyEn;
}

export default function PartnershipsPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section partnerships-hero">
        <p className="eyebrow">{t(locale, "International", "ระหว่างประเทศ", "国际合作")}</p>
        <h1 className="hero-title partnerships-title">
          {locale === "th"
            ? <>5 ประเทศ 4 สถานะ:<br />ใครทำอะไรจริง</>
            : locale === "zh"
              ? <>5 个国家，4 种状态：<br />谁真的做了事</>
              : <>5 countries, 4 statuses:<br />who actually delivered.</>}
        </h1>
        <p className="hero-strapline partnerships-strapline">
          {t(
            locale,
            "This page reads Thailand's international smart-city partnerships as delivery signals, not diplomatic theatre. Big numbers matter, but only when they connect to visible projects, city capability, or technical blueprints.",
            "หน้านี้อ่านความร่วมมือระหว่างประเทศของไทยในฐานะสัญญาณการส่งมอบ ไม่ใช่ละครการทูต ตัวเลขใหญ่มีความหมาย ก็ต่อเมื่อมันเชื่อมกับโครงการที่เห็นได้ ความสามารถของเมือง หรือพิมพ์เขียวทางเทคนิค",
            "本页把泰国的国际智慧城市合作当成交付信号来读，而不是外交表演。大数字只有在连到可见项目、城市能力或技术蓝图时才有意义。")}
        </p>
        <p className="partnerships-source-note">
          {t(
            locale,
            "Investment figures here are programme-scale numbers from source announcements unless stated otherwise. They do not automatically mean Thailand-specific disbursement.",
            "ตัวเลขการลงทุนที่แสดงคือขนาดโปรแกรมจากประกาศต้นทาง เว้นแต่จะระบุเป็นอย่างอื่น มันไม่ได้แปลว่าเป็นเงินที่ลงไทยโดยตรงทั้งหมด",
            "这里的投资数字除非另有说明，否则指的是来源公告中的项目级规模，不等于全部都直接拨付给泰国。")}
        </p>
      </section>

      {/* ─── GLOBE MAP ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <Suspense fallback={null}>
          <GlobeMap locale={locale} />
        </Suspense>
      </section>

      {/* ─── OUR PROJECTS: ASCN + SCL ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Built by this team", "ทีมนี้สร้าง", "本团队构建")}</p>
        <h2>{t(locale, "Open tools we shipped for the network", "เครื่องมือเปิดที่เราส่งมอบให้เครือข่าย", "我们为网络交付的开放工具")}</h2>
        <div className="partnerships-showcase-grid">
          <a href="https://nonarkara.github.io/ascn-smart-cities-network/" target="_blank" rel="noopener noreferrer" className="partnerships-showcase-card">
            <span className="partnerships-showcase-badge">ASCN</span>
            <h3>{t(locale, "ASEAN Smart Cities Network Dashboard", "แดชบอร์ด ASEAN Smart Cities Network", "东盟智慧城市网络仪表板")}</h3>
            <p>{t(locale,
              "Interactive dashboard of all 26 ASCN pilot cities across 10 ASEAN member states. Built pro bono because the network needed it and no one else was making it.",
              "แดชบอร์ดโต้ตอบของ 26 เมืองนำร่อง ASCN ใน 10 ประเทศอาเซียน สร้างให้ฟรีเพราะเครือข่ายต้องการและไม่มีใครทำ",
              "26个ASCN试点城市的交互式仪表板，覆盖10个东盟成员国。义务建设，因为网络需要而没人做。"
            )}</p>
            <span className="partnerships-showcase-link">{t(locale, "Open dashboard", "เปิดแดชบอร์ด", "打开仪表板")} →</span>
          </a>
          <a href="https://nonarkara.github.io/scl-landing-page/" target="_blank" rel="noopener noreferrer" className="partnerships-showcase-card">
            <span className="partnerships-showcase-badge">SCL</span>
            <h3>{t(locale, "Smart City Leadership Programme", "โครงการ Smart City Leadership", "智慧城市领导力项目")}</h3>
            <p>{t(locale,
              "The training engine behind Thailand's cultural shift from tech-shopping to citizen-value. Co-developed by Dr. Passakon, Dr. Supakorn, and Dr. Non over years of iteration.",
              "เครื่องยนต์ฝึกอบรมที่อยู่เบื้องหลังการเปลี่ยนผ่านวัฒนธรรมของไทยจากการซื้อเทคโนโลยีสู่คุณค่าพลเมือง พัฒนาร่วมโดย ดร.ภาสกร ดร.ศุภกร และ ดร.ณณ",
              "推动泰国从技术采购到公民价值文化转型的培训引擎。由Passakon博士、Supakorn博士和Non博士历经多年迭代共同开发。"
            )}</p>
            <span className="partnerships-showcase-link">{t(locale, "Open SCL", "เปิด SCL", "打开SCL")} →</span>
          </a>
        </div>
      </section>

      {/* ─── PROJECT TIMELINE ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Project timeline", "ไทม์ไลน์โครงการ", "项目时间线")}</p>
        <h2>{t(locale, "Every collaboration, every year", "ทุกความร่วมมือ ทุกปี", "每项合作，每一年")}</h2>
        <div className="partner-timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="partner-tl-row">
              <span className="partner-tl-year">{item.year}</span>
              <span className="partner-tl-flag">{item.flag}</span>
              <span className="partner-tl-project">{t(locale, item.project.en, item.project.th, item.project.zh)}</span>
              <span className="partner-tl-country">{t(locale, item.country.en, item.country.th, item.country.zh)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="section partnerships-summary-section">
        <div className="partnerships-summary-grid">
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">6</div>
            <div className="partnerships-summary-label">
              {t(locale, "Partnership tracks", "เส้นความร่วมมือ", "合作轨道")}
            </div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">10+</div>
            <div className="partnerships-summary-label">
              {t(locale, "Thai city touchpoints", "จุดแตะเมืองไทย", "泰国城市触点")}
            </div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">1</div>
            <div className="partnerships-summary-label">
              {t(locale, "Programme-scale mega fund", "กองทุนขนาดใหญ่ระดับโปรแกรม", "大型项目级基金")}
            </div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">4</div>
            <div className="partnerships-summary-label">
              {t(locale, "Delivery states used here", "สถานะการส่งมอบที่ใช้ในหน้านี้", "本页使用的交付状态")}
            </div>
          </div>
        </div>
      </section>

      <section className="section partnerships-reading-section">
        <div className="showcase-summary-grid">
          {(["active", "completed", "stalled", "early"] as const).map(status => (
            <article key={status} className="showcase-summary-card">
              <p className="showcase-card-kicker">{statusLabels[status][locale]}</p>
              <h2>{statusLabels[status][locale]}</h2>
              <p>{statusNotes[status][locale]}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section partnerships-list-section">
        {partnerships.map(partnership => (
          <article key={partnership.country} className="partnership-card">
            <div className="partnership-card-head">
              <div className="partnership-flag">{partnership.flag}</div>
              <div className="partnership-title-group">
                <h2 className="partnership-title">{countryLabel(locale, partnership)}</h2>
                <p className="partnership-meta">{partnership.program} · {partnership.year}</p>
              </div>
              <span className={`partnership-status partnership-status-${partnership.status}`}>
                {statusLabels[partnership.status][locale]}
              </span>
            </div>

            <div className="partnership-fact-grid">
              <div className="partnership-fact-card">
                <span className="partnership-fact-label">{t(locale, "Investment", "การลงทุน", "投资")}</span>
                <span className="partnership-fact-value">{partnership.investment}</span>
              </div>
              <div className="partnership-fact-card">
                <span className="partnership-fact-label">{t(locale, "Thai cities", "เมืองไทย", "泰国城市")}</span>
                <span className="partnership-fact-value">{partnership.cities}</span>
              </div>
              <div className="partnership-fact-card">
                <span className="partnership-fact-label">{t(locale, "Focus", "โฟกัส", "重点")}</span>
                <span className="partnership-fact-value">{focusLabel(locale, partnership)}</span>
              </div>
            </div>

            <p className="partnership-body">{bodyLabel(locale, partnership)}</p>
            
            {/* LESSON LEARNED BOX */}
            <div style={{ margin: '1rem 0', padding: '1rem', background: 'var(--alpha-bg)', borderRadius: 'var(--radius-sm)', borderLeft: '3px solid var(--alpha)' }}>
              <p style={{ font: '700 .55rem var(--mono)', color: 'var(--alpha)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: '.35rem' }}>
                {t(locale, "Strategic Lesson", "บทเรียนเชิงกลยุทธ์", "战略启示")}
              </p>
              <p style={{ fontSize: '.68rem', color: 'var(--2)', lineHeight: 1.5, margin: 0 }}>
                {partnership.country === "Japan" 
                  ? t(locale, "Cameras vs Asphalt: The Fujitsu/Smart JAMP project in Phuket proves that AI-driven traffic management is 1/10th the cost of road expansion with better long-term outcomes.", "กล้อง vs ยางมะตอย: โปรเจกต์ Fujitsu ในภูเก็ตพิสูจน์ว่า AI จัดการจราจรประหยัดกว่าสร้างถนน 10 เท่า และยั่งยืนกว่า", "摄像头 vs 沥青：普吉的富士通项目证明，AI 驱动的交通管理成本仅为道路扩建的 1/10，且长期效果更好。")
                  : partnership.country === "United Kingdom"
                  ? t(locale, "Standardization is Infrastructure: The UK Handbook taught us that a common vocabulary is as important as fiber optic cables for interoperability.", "มาตรฐานคือโครงสร้างพื้นฐาน: คู่มือของสหราชอาณาจักรย้ำเน้นว่า 'ศัพท์เทคนิคที่ตรงกัน' สำคัญเท่ากับสายไฟเบอร์ในการทำงานข้ามระบบ", "标准即基础设施：英国手册教会我们，统一的话语体系与光缆对互操作性同样重要。")
                  : t(locale, "Blueprints Require Ownership: Technical assistence from Singapore or the US only sticks when local municipal capacity matches the project complexity.", "พิมพ์เขียวต้องการเจ้าของ: ความช่วยเหลือทางเทคนิคจากต่างประเทศจะยั่งยืนก็ต่อเมื่อศักยภาพท้องถิ่นโตทันความซับซ้อนของโครงการ", "蓝图需要所有权：只有当本地市政能力与项目复杂度匹配时，来自国外的技术援助才能落地。")
                }
              </p>
            </div>

            <p className="partnership-status-note">{statusNotes[partnership.status][locale]}</p>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <a href={partnership.sourceUrl} target="_blank" rel="noopener noreferrer" className="partnership-source-link">
                {partnership.sourceLabel} →
              </a>
              {partnership.country === "Japan" && (
                <button onClick={() => onNavigate("/city/phuket")} className="endpoint-link" style={{ fontSize: '.6rem' }}>
                  {t(locale, "View Phuket Case Study", "ดูเคสภูเก็ต", "查看普吉案例")} →
                </button>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="section partnerships-closing-section">
        <div className="callout-card story-closing-card">
          <h2>{t(locale, "The useful question is not who signed what. It is what stuck.", "คำถามที่มีประโยชน์ไม่ใช่ใครเซ็นอะไร แต่คืออะไรที่ติดค้างอยู่ในระบบจริง", "真正有用的问题不是谁签了什么，而是什么真正留在了系统里。")}</h2>
          <p>
            {t(
              locale,
              "Japan and the UK show the clearest programme architecture. The U.S. contribution is narrower but technically concrete. South Korea shows how good planning can still hit execution walls. Austria is a reminder that a smart-city MOU is not the same thing as delivery. That is the real reading.",
              "ญี่ปุ่นกับสหราชอาณาจักรให้ภาพของสถาปัตยกรรมโปรแกรมชัดที่สุด สหรัฐอเมริกามาแบบแคบกว่าแต่เฉพาะทางกว่า เกาหลีใต้แสดงให้เห็นว่าการวางแผนดีแค่ไหนก็ยังชนกำแพงการลงมือทำได้ ส่วนออสเตรียเตือนว่า MOU ด้านสมาร์ตซิตี้ไม่เท่ากับการส่งมอบ นี่แหละคือวิธีอ่านที่ตรงไปตรงมา",
              "日本与英国呈现了最清晰的项目架构；美国的贡献更窄，但技术上更具体；韩国说明再好的规划也会撞上执行墙；奥地利则提醒我们，智慧城市 MOU 不等于交付。这才是这页真正想表达的读法。")}
          </p>
          <button type="button" className="cta-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, "See the city rankings", "ดูอันดับเมือง", "查看城市排名")}
          </button>
        </div>
      </section>
    </>
  );
}
