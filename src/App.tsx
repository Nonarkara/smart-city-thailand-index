import { useEffect, lazy, Suspense, useState } from "react";
import { parseRoute, getRouteKey, type Route } from "./routing";
import { syncDocumentMeta } from "./siteMeta";
import { ResponsiveImage } from "./mediaAssets";
import TopbarNav from "./TopbarNav";
import type { Locale } from "./types";
import { trackVisitor } from "./visitorTracking";
import { ErrorBoundary } from "./ErrorBoundary";

import HomePage from "./HomePage";
import RankingsPage from "./RankingsPage";

// CityDetailPage carries the full 118-city dossier machinery (~250 kB of
// research, facts, and analysis text), so it loads as its own chunk. The
// warm-up below keeps both entry paths fast: direct /city/ links (the
// primary shared surface, §11.8) start fetching immediately — in parallel
// with the app booting — and everyone else prefetches on first idle, so
// click-throughs from Home/Rankings hit a warm cache.
const cityDetailImport = () => import("./CityDetailPage");
const CityDetailPage = lazy(cityDetailImport);
if (window.location.pathname.startsWith("/city/")) {
  cityDetailImport();
} else if (typeof window.requestIdleCallback === "function") {
  window.requestIdleCallback(() => cityDetailImport(), { timeout: 4000 });
} else {
  window.setTimeout(cityDetailImport, 2500);
}

const MethodologyPage = lazy(() => import("./MethodologyPage"));
const StoryPage = lazy(() => import("./StoryPage"));
const WhyPage = lazy(() => import("./WhyPage"));
const ShowcasePage = lazy(() => import("./ShowcasePage"));
const GeminiChat = lazy(() => import("./GeminiChat"));
const PartnershipsPage = lazy(() => import("./PartnershipsPage"));
const MapDashboardPage = lazy(() => import("./MapDashboardPage"));
const AsusPage = lazy(() => import("./AsusPage"));
const AuditPage = lazy(() => import("./AuditPage"));
const ReferencesPage = lazy(() => import("./ReferencesPage"));
const ProgramPage = lazy(() => import("./ProgramPage"));
const KnowledgePage = lazy(() => import("./KnowledgePage"));
const DiscoverPage = lazy(() => import("./DiscoverPage"));
const InvestPage = lazy(() => import("./InvestPage"));
const ComparePage = lazy(() => import("./ComparePage"));
const ScitiBingoPage = lazy(() => import("./ScitiBingoPage"));
const CityCanvasPage = lazy(() => import("./CityCanvasPage"));
const AboutPage = lazy(() => import("./AboutPage"));
const CreativeEconomyPage = lazy(() => import("./CreativeEconomyPage"));
import DataFeedback from "./DataFeedback";

const LOCALE_STORAGE_KEY = "smart-city-thailand-locale";
const THEME_STORAGE_KEY = "smart-city-thailand-theme";
type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "dark") return "dark";
  return "light";
}

// Top nav lives in src/TopbarNav.tsx — 5 grouped dropdowns
// (Home · Rankings · Method · Stories · Network).

const MDES_LOGO = {
  src: "/mdes_logo.jpg",
  width: 381,
  height: 132,
};

const DEPA_LOGO = {
  src: "/depa_logo.jpg",
  width: 1182,
  height: 798,
};

const SMART_CITY_LOGO = {
  src: "/smart_city_thailand_logo.jpg",
  width: 1182,
  height: 1182,
};

const SLIC_LOGO = {
  src: "/slic_logo.jpg",
  width: 200,
  height: 200,
};

export type PageHeroCopy = { en: string; th: string; zh: string };
export type StaticHeroKind = Exclude<Route["kind"], "home" | "city" | "canvas">;
export type PageHeroAsset = {
  src: string;
  objectPosition?: string;
  title: PageHeroCopy;
  place: string;
  description: PageHeroCopy;
};

// 2026-07-02 photo de-dup audit: every scenic cityscape in /photos is already
// claimed by a city identity in cityMedia.ts, so page heroes draw exclusively
// from the authored depa / event archive — each file used exactly once site-wide.
// Exported for the hero integrity test (src/heroPhotoIntegrity.test.ts) —
// guards against Codex-style title/place/description drift.
export const PAGE_HERO_ASSETS: Record<StaticHeroKind, PageHeroAsset> = {
  rankings: {
    src: "/photos/wp-makkasan.jpg",
    objectPosition: "center 40%",
    title: { en: "Rankings", th: "อันดับเมือง", zh: "城市排名" },
    place: "Bangkok",
    description: {
      en: "Makkasan, Bangkok — Thailand's financial heart and the engine of a 15-million-person metropolis. The district anchors Southeast Asia's second-largest economy.",
      th: "มักกะสัน กรุงเทพฯ — ศูนย์กลางการเงินของไทยและเครื่องยนต์ของมหานคร 15 ล้านคน ย่านนี้เป็นหลักของเศรษฐกิจที่ใหญ่เป็นอันดับสองของอาเซียน",
      zh: "曼谷玛卡珊 — 泰国的金融心脏，1500万人口大都市的经济引擎。该区是东盟第二大经济体的支柱。",
    },
  },
  discover: {
    src: "/photos/khonkaen-aerial.jpg",
    objectPosition: "center 40%",
    title: { en: "Find Your City", th: "ค้นหาเมืองของคุณ", zh: "寻找你的城市" },
    place: "Khon Kaen",
    description: {
      en: "Khon Kaen — The smart-city pioneer of Northeast Thailand, home to Khon Kaen University and the economic hub of the entire Isan region.",
      th: "ขอนแก่น — ผู้บุกเบิกเมืองอัจฉริยะของภาคตะวันออกเฉียงเหนือ ที่ตั้งของมหาวิทยาลัยขอนแก่นและศูนย์กลางเศรษฐกิจของทั้งภาคอีสาน",
      zh: "孔敬 — 泰国东北部的智慧城市先驱，孔敬大学所在地，整个伊善地区的经济中心。",
    },
  },
  program: {
    src: "/photos/wp-hat-yai.jpg",
    objectPosition: "center 40%",
    title: { en: "Smart City Program", th: "โครงการเมืองอัจฉริยะ", zh: "智慧城市计划" },
    place: "Hat Yai",
    description: {
      en: "Hat Yai — The commercial capital of southern Thailand and a vital gateway to Malaysia, driving ASEAN cross-border trade and connectivity.",
      th: "หาดใหญ่ — เมืองหลวงการค้าของภาคใต้และประตูสู่มาเลเซีย ขับเคลื่อนการค้าข้ามพรมแดนและการเชื่อมโยงอาเซียน",
      zh: "合艾 — 泰国南部商业之都，通往马来西亚的重要门户，推动东盟跨境贸易与互联互通。",
    },
  },
  methodology: {
    src: "/photos/wp-chanthaburi.jpg",
    objectPosition: "center 40%",
    title: { en: "Methodology", th: "วิธีการประเมิน", zh: "评估方法" },
    place: "Chanthaburi",
    description: {
      en: "Chanthaburi — The 「City of the Moon,」 world capital of gems and jewellery, famed for durian orchards and a unique French-colonial heritage.",
      th: "จันทบุรี — 「เมืองจันทร์」 เมืองหลวงอัญมณีและเครื่องประดับของโลก ขึ้นชื่อเรื่องสวนทุเรียนและมรดกเชิงอาณานิคมฝรั่งเศสที่เป็นเอกลักษณ์",
      zh: "尖竹汶 — 「月亮之城」，世界珠宝之都，以榴莲果园和独特的法国殖民遗产闻名。",
    },
  },
  story: {
    src: "/photos/wp-phangnga.jpg",
    objectPosition: "center 40%",
    title: { en: "Story", th: "เรื่องราว", zh: "故事" },
    place: "Phang Nga",
    description: {
      en: "Phang Nga — Home to Ao Phang Nga National Park and the iconic James Bond Island, a UNESCO-recognized natural heritage site of towering limestone karsts.",
      th: "พังงา — ที่ตั้งของอุทยานแห่งชาติอ่าวพังงาและเกาะเจมส์บอนด์อันโด่งดัง แหล่งมรดกธรรมชาติที่ได้รับการรับรองจากยูเนสโก",
      zh: "攀牙 — 攀牙湾国家公园和标志性詹姆斯·邦德岛所在地，联合国教科文组织认定的自然遗产，以高耸的石灰岩喀斯特地貌闻名。",
    },
  },
  why: {
    src: "/photos/slic-waterfront.jpg",
    objectPosition: "center 40%",
    title: { en: "Why SCITI", th: "ทำไมต้อง SCITI", zh: "为什么是 SCITI" },
    place: "Thailand",
    description: {
      en: "Thailand — A kingdom of 77 provinces bridging the Mekong and ASEAN, where ancient temples, tropical coastlines, and vibrant cultural diversity converge.",
      th: "ประเทศไทย — อาณาจักร 77 จังหวัดที่เชื่อมโยงแม่โขงและอาเซียน ที่ซึ่งวัดโบราณ ชายฝั่งเขตร้อน และความหลากหลายทางวัฒนธรรมมาบรรจบกัน",
      zh: "泰国 — 拥有77个府的王国，连接湄公河与东盟，古老寺庙、热带海岸线和丰富的文化多样性在此交汇。",
    },
  },
  showcase: {
    src: "/photos/wp-tak.jpg",
    objectPosition: "center 40%",
    title: { en: "Tak", th: "ตาก", zh: "达府" },
    place: "Tak",
    description: {
      en: "Tak — A historic western gateway to Myanmar tied to King Taksin the Great, home to the bustling Mae Sot border trade zone and the serene Ping River.",
      th: "ตาก — ประตูสู่พม่าทางตะวันตกที่มีประวัติศาสตร์ยาวนาน ผูกพันกับสมเด็จพระเจ้าตากสินมหาราช เขตการค้าชายแดนแม่สอดที่คึกคัก และแม่น้ำปิงอันเงียบสงบ",
      zh: "达府 — 通往缅甸的历史性西部门户，与达信大帝渊源深厚，拥有繁忙的美索边境贸易区和宁静的宾河。",
    },
  },
  partners: {
    src: "/photos/report-city-night.jpg",
    objectPosition: "center 40%",
    title: { en: "Partners", th: "พันธมิตร", zh: "伙伴" },
    place: "Thailand",
    description: {
      en: "Thailand at night — A nation of 70 million people serving as Southeast Asia's bridge, where fast-modernizing infrastructure meets millennia of heritage and digital transformation.",
      th: "ประเทศไทยยามค่ำคืน — ประเทศที่มีประชากร 70 ล้านคนเป็นสะพานเชื่อมเอเชียตะวันออกเฉียงใต้ ที่ซึ่งโครงสร้างพื้นฐานที่ทันสมัยอย่างรวดเร็วผสานกับมรดกหลายพันปีและการเปลี่ยนผ่านสู่ดิจิทัล",
      zh: "泰国夜景 — 一个7000万人口的国度，作为东南亚的桥梁，快速现代化的基础设施与千年遗产及数字化转型在此交融。",
    },
  },
  map: {
    src: "/photos/wp-klong-phadung.jpg",
    objectPosition: "center 40%",
    title: { en: "National Map", th: "แผนที่ประเทศ", zh: "全国地图" },
    place: "Bangkok",
    description: {
      en: "Bangkok's historic Khlong Phadung Krung Kasem — The 「Venice of the East」 owes its soul to waterways like this, once the lifeblood of a trading empire.",
      th: "คลองผดุงกรุงเกษมอันมีประวัติศาสตร์ของกรุงเทพฯ — 「เวนิสตะวันออก」 มีจิตวิญญาณจากทางน้ำเช่นนี้ ที่เคยเป็นสายเลือดของจักรวรรดิการค้า",
      zh: "曼谷历史悠久的帕东克鲁格卡塞姆运河 — 「东方威尼斯」的灵魂源于这样的水道，它曾是贸易帝国的命脉。",
    },
  },
  asus: {
    src: "/photos/wiki-bangkok-bts.jpg",
    objectPosition: "center 40%",
    title: { en: "ASUS Collaboration", th: "ความร่วมมือ ASUS", zh: "ASUS 合作" },
    place: "Bangkok",
    description: {
      en: "Bangkok's BTS Skytrain — A symbol of urban modernization and smart mobility, transforming how 15 million residents navigate the capital every day.",
      th: "รถไฟฟ้า BTS กรุงเทพฯ — สัญลักษณ์ของการทันสมัยของเมืองและความคล่องตัวอัจฉริยะ เปลี่ยนแปลงวิธีที่ประชากร 15 ล้านคนเดินทางในเมืองหลวงทุกวัน",
      zh: "曼谷BTS天轨 — 城市现代化和智慧出行的象征，每天改变着1500万居民在首都的出行方式。",
    },
  },
  audit: {
    src: "/photos/wp-chachoengsao.jpg",
    objectPosition: "center 40%",
    title: { en: "Jury walk-through", th: "เส้นทางสำหรับคณะกรรมการ", zh: "评审导览" },
    place: "Chachoengsao",
    description: {
      en: "Chachoengsao — The eastern gateway to Bangkok along the Bang Pakong River, home to the revered Wat Sothon Wararam and centuries of trading history.",
      th: "ฉะเชิงเทรา — ประตูสู่กรุงเทพฯ ทางตะวันออกริมแม่น้ำบางปะกง ที่ตั้งของวัดโสธรวรารามวรวิหารอันเป็นที่เคารพและประวัติศาสตร์การค้าหลายศตวรรษ",
      zh: "北柳府 — 曼谷东部门户，沿邦巴功河而建，拥有备受尊崇的索通寺和数百年的贸易历史。",
    },
  },
  references: {
    src: "/photos/wp-maesai.jpg",
    objectPosition: "center 40%",
    title: { en: "References", th: "แหล่งอ้างอิง", zh: "参考资料" },
    place: "Mae Sai",
    description: {
      en: "Mae Sai — Thailand's northernmost town on the Myanmar border, a historic crossroads of the Golden Triangle and a vibrant hub of cross-border trade.",
      th: "แม่สาย — เมืองเหนือสุดของไทยริมชายแดนพม่า จุดตัดทางประวัติศาสตร์ของสามเหลี่ยมทองคำและศูนย์กลางการค้าข้ามพรมแดนที่คึกคัก",
      zh: "美塞 — 泰国最北端城镇，位于缅泰边境，金三角的历史十字路口和活跃的跨境贸易中心。",
    },
  },
  knowledge: {
    src: "/photos/cmu-smart-city.jpg",
    objectPosition: "center 55%",
    title: { en: "Knowledge Base", th: "คลังความรู้", zh: "知识库" },
    place: "Chiang Mai University",
    description: {
      en: "Chiang Mai University — One of Thailand's premier research universities, pioneering smart-city research and digital innovation in the cultural heart of the North.",
      th: "มหาวิทยาลัยเชียงใหม่ — หนึ่งในมหาวิทยาลัยวิจัยชั้นนำของไทย ผู้บุกเบิกการวิจัยเมืองอัจฉริยะและนวัตกรรมดิจิทัลในใจกลางวัฒนธรรมภาคเหนือ",
      zh: "清迈大学 — 泰国顶尖研究型大学之一，在北部文化核心地带开创智慧城市研究和数字创新。",
    },
  },
  invest: {
    src: "/photos/wp-nakhonsawan.jpg",
    objectPosition: "center 40%",
    title: { en: "Invest", th: "ลงทุน", zh: "投资" },
    place: "Nakhon Sawan",
    description: {
      en: "Nakhon Sawan — The 「Heavenly City」 at the confluence of the Ping and Nan rivers, a strategic logistics hub and gateway to Northern Thailand.",
      th: "นครสวรรค์ — 「เมืองสวรรค์」 ที่จุดบรรจบของแม่น้ำปิงและน่าน ศูนย์กลางโลจิสติกส์เชิงกลยุทธ์และประตูสู่ภาคเหนือของไทย",
      zh: "北榄坡（那空沙旺）— 「天堂之城」，位于宾河与难河交汇处，战略物流枢纽和泰国北部的门户。",
    },
  },
  compare: {
    src: "/photos/wp-phichit.jpg",
    objectPosition: "center 40%",
    title: { en: "Compare Cities", th: "เปรียบเทียบเมือง", zh: "城市对比" },
    place: "Phichit",
    description: {
      en: "Phichit — Along the Nan River, known as Chalawan City for the legendary crocodile epic Krai Thong, where ancient folklore and timeless traditions endure.",
      th: "พิจิตร — ริมแม่น้ำน่าน ได้ฉายาเมืองชาละวันจากวรรณคดีไกรทองในตำนาน ที่ซึ่งตำนานโบราณและประเพณีอันเป็นเอกลักษณ์ยังคงดำรงอยู่",
      zh: "披集 — 位于难河畔，因传奇鳄鱼史诗《盖通》而被称为「差拉万之城」，古老的民间传说和永恒的传统在此延续。",
    },
  },
  bingo: {
    src: "/photos/wp-phitsanulok.jpg",
    objectPosition: "center 40%",
    title: { en: "SCITI Bingo", th: "SCITI บิงโก", zh: "SCITI 宾果" },
    place: "Phitsanulok",
    description: {
      en: "Phitsanulok — 「Vishnu's Heaven,」 home to the sacred Wat Phra Si Rattana Mahathat and a historic crossroads of Northern and Central Thailand.",
      th: "พิษณุโลก — 「สวรรค์ของพระนารายณ์」 ที่ตั้งของวัดพระศรีรัตนมหาธาตุอันเป็นที่เคารพ และจุดตัดทางประวัติศาสตร์ของภาคเหนือและภาคกลาง",
      zh: "彭世洛 — 「毗湿奴的天堂」，神圣的帕西拉塔纳玛哈泰寺所在地，泰国北部与中部的历史十字路口。",
    },
  },
  about: {
    src: "/photos/wp-nan.jpg",
    objectPosition: "center 40%",
    title: { en: "Mission", th: "พันธกิจ", zh: "使命" },
    place: "Nan",
    description: {
      en: "Nan — A UNESCO Creative City renowned for exquisite temple murals, deep Lanna cultural roots, and breathtaking mountain landscapes in the far North.",
      th: "น่าน — เมืองสร้างสรรค์ยูเนสโกที่มีชื่อเสียงด้านจิตรกรรมฝาผนังวัดอันงดงาม รากฐานวัฒนธรรมล้านนาอันลึกซึ้ง และทิวทัศน์ภูเขาอันน่าทึ่งในภาคเหนือสุด",
      zh: "难府 — 联合国教科文组织创意城市，以精美的寺庙壁画、深厚的兰纳文化根基和北部壮丽的山景闻名。",
    },
  },
  "creative-economy": {
    src: "/photos/wp-ubon.jpg",
    objectPosition: "center 40%",
    title: { en: "Creative Economy", th: "เศรษฐกิจสร้างสรรค์", zh: "创意经济" },
    place: "Ubon Ratchathani",
    description: {
      en: "Ubon Ratchathani — The cultural heart of the Northeast, famous for the spectacular Candle Festival, ancient Khmer heritage, and a thriving creative-arts scene.",
      th: "อุบลราชธานี — ใจกลางวัฒนธรรมของภาคตะวันออกเฉียงเหนือ ขึ้นชื่อเรื่องประเพณีแห่เทียนพรรษาอันงดงาม มรดกขอมโบราณ และวงการศิลปะสร้างสรรค์ที่เฟื่องฟู",
      zh: "乌汶叻差他尼 — 泰国东北部的文化心脏，以壮观的蜡烛节、古老的吴哥遗产和蓬勃发展的创意艺术场景闻名。",
    },
  },
};

const newsItems = [
  {
    date: "2026-05-20",
    titleEn: "SCITI 2026 submitted to CEA Creative Excellence Awards — open-data scorecard for 118 Thai cities",
    titleTh: "SCITI 2026 ส่งเข้าประกวด CEA Creative Excellence Awards — ตารางคะแนนข้อมูลเปิดสำหรับ 118 เมือง",
    titleZh: "SCITI 2026 提交 CEA 创意卓越奖——覆盖 118 座泰国城市的开放数据评分卡",
    url: "https://sciti.nonarkara.org/",
    source: "depa / SCITI",
  },
  {
    date: "2026-03-18",
    titleEn: "SLIC Index V2 launched at Smart City Summit & Expo 2026 in Taipei",
    titleTh: "SLIC Index V2 เปิดตัวบนเวที SCSE 2026 ไทเป",
    titleZh: "SLIC Index V2 在 2026 台北智慧城市展发布",
    url: "https://slic.nonarkara.org/",
    source: "SLIC Index",
  },
  {
    date: "2026-03-17",
    titleEn: "Dr. Non keynotes City Vision in Action stage at SCSE Taipei — Taiwan VP opens event",
    titleTh: "ดร.ณณ ขึ้นเวที City Vision in Action ที่ SCSE ไทเป รองประธานาธิบดีไต้หวันเปิดงาน",
    titleZh: "Non 博士在台北 SCSE City Vision in Action 主舞台发表主题演讲，台湾副总统开幕",
    url: "https://en.smartcity.org.tw/index.php/en-us/",
    source: "SCSE 2026",
  },
  {
    date: "2026-03",
    titleEn: "depa advances smart city from grassroots — upgrading safety and quality of life nationwide",
    titleTh: "depa ต่อยอดเมืองอัจฉริยะจากฐานราก ยกระดับความปลอดภัยและคุณภาพชีวิตทั่วประเทศ",
    titleZh: "depa 从基层推进智慧城市，提升全国安全与生活质量",
    url: "https://www.nexttopbrand.com/2026/03/depa.html",
    source: "NextTopBrand",
  },
  {
    date: "2025-11-05",
    titleEn: "Minister of Digital Economy: smart cities are a key solution to improving people's lives",
    titleTh: "รัฐมนตรีดิจิทัลชี้สมาร์ทซิตี้เป็นโซลูชันหลักยกระดับคุณภาพชีวิต",
    titleZh: "数字经济部长：智慧城市是改善民生的关键方案",
    url: "https://en.moneyandbanking.co.th/2025/206803/",
    source: "Money & Banking",
  },
  {
    date: "2025-11",
    titleEn: "Phuket Tinicon Valley receives Smart City Local logo — 43 new promotion zones certified",
    titleTh: "ภูเก็ตทินิคอนวัลเลย์ได้รับตราสัญลักษณ์ — ประกาศเขตส่งเสริม 43 แห่ง",
    titleZh: "普吉 Tinicon Valley 获得智慧城市标识，新增 43 个推广区",
    url: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    source: "depa",
  },
  {
    date: "2025",
    titleEn: "depa pushes Smart City targeting 105 inclusive cities by 2027",
    titleTh: "depa ผลักดันเมืองอัจฉริยะ เป้า 105 เมืองภายในปี 2570",
    titleZh: "depa 推动智慧城市计划，目标到 2027 年达到 105 座包容型城市",
    url: "https://www.nationthailand.com/blogs/sustaination/40057822",
    source: "Nation Thailand",
  },
];

function getInitialLocale(): Locale {
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored === "en" || stored === "th" || stored === "zh") {
    return stored;
  }
  return "en";
}

function PagePhotoHero({ route, locale }: { route: Route; locale: Locale }) {
  if (route.kind === "home" || route.kind === "city" || route.kind === "showcase" || route.kind === "canvas") return null;
  const hero = PAGE_HERO_ASSETS[route.kind as StaticHeroKind];
  if (!hero) return null;

  return (
    <section className={`route-photo-hero route-photo-hero-${route.kind}`} aria-label={hero.title[locale]}>
      <ResponsiveImage
        src={hero.src}
        alt={hero.place}
        className="route-photo-hero-img"
        style={{ objectPosition: hero.objectPosition ?? "center center" }}
        loading="eager"
      />
      <div className="route-photo-hero-overlay">
        <span className="route-photo-hero-place">{hero.place}</span>
        <p className="route-photo-hero-title">{hero.title[locale]}</p>
        <p className="route-photo-hero-desc">{hero.description[locale]}</p>
      </div>
    </section>
  );
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [locale, setLocale] = useState<Locale>(getInitialLocale);
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [topbarScrolled, setTopbarScrolled] = useState(false);
  const isDashboardRoute = route.kind === "home";
  const isCanvasRoute = route.kind === "canvas";

  useEffect(() => {
    const sync = () => {
      setRoute(parseRoute(window.location.pathname));
      setMobileMenuOpen(false);
    };
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    // Use more specific BCP-47 tags — zh-Hans for Simplified Chinese
    document.documentElement.lang = locale === "zh" ? "zh-Hans" : locale;
  }, [locale]);

  useEffect(() => {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    syncDocumentMeta(route.path, locale);
  }, [locale, route]);

  // Scroll-aware topbar: add .topbar-scrolled after 4 px to reveal a subtle separator
  useEffect(() => {
    const handleScroll = () => setTopbarScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track visitor once per session (fire-and-forget to Google Sheets)
  useEffect(() => { trackVisitor(window.location.pathname); }, []);

  const navigate = (path: string) => {
    const base = import.meta.env.BASE_URL || "/";
    const fullPath = path.startsWith(base) ? path : base.replace(/\/$/, "") + path;
    if (window.location.pathname !== fullPath) {
      window.history.pushState({}, "", fullPath);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    setRoute(parseRoute(fullPath));
    setMobileMenuOpen(false);
  };

  const toggleTheme = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <div className={`page-shell ${isDashboardRoute ? "page-shell-dashboard" : ""} ${isCanvasRoute ? "page-shell-canvas" : ""}`}>
      {isDashboardRoute && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": "SCITI - Smart City Thailand Index",
            "description": "Thailand's Provincial Creative Economy Data Platform. Aggregates Gross Provincial Product, FDI flows, BOI incentive zones, infrastructure readiness, creative economy indicators, labor costs, and cultural asset data across Thailand's 77 provinces.",
            "url": "https://sciti.nonarkara.org/",
            "creator": {
              "@type": "Organization",
              "name": "Digital Economy Promotion Agency (depa)"
            },
            "license": "https://creativecommons.org/licenses/by/4.0/",
            "inLanguage": ["th", "en", "zh-Hans"],
            "keywords": ["Thailand", "Smart City", "Creative Economy", "Provincial Data", "Investment"]
          })}
        </script>
      )}
      {/* ─── INSTITUTIONAL BANNER ─── */}
      <a href="#main-content" className="skip-link">{locale === "th" ? "ข้ามไปยังเนื้อหา" : locale === "zh" ? "跳转到主要内容" : "Skip to content"}</a>
      {!isCanvasRoute && (
        <div className="institutional-banner">
        <div className="institutional-logos">
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={MDES_LOGO.src}
              alt={locale === "th" ? "กระทรวงดิจิทัลเพื่อเศรษฐกิจและสังคม" : "Ministry of Digital Economy and Society"}
              className="institutional-logo"
              width={MDES_LOGO.width}
              height={MDES_LOGO.height}
              loading="eager"
            />
          </div>
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={DEPA_LOGO.src}
              alt={locale === "th" ? "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล" : "Digital Economy Promotion Agency (depa)"}
              className="institutional-logo"
              width={DEPA_LOGO.width}
              height={DEPA_LOGO.height}
              loading="eager"
            />
          </div>
          <div className="institutional-logo-container">
            <ResponsiveImage
              src={SMART_CITY_LOGO.src}
              alt={locale === "th" ? "สำนักงานเมืองอัจฉริยะประเทศไทย" : "Smart City Thailand Office"}
              className="institutional-logo"
              width={SMART_CITY_LOGO.width}
              height={SMART_CITY_LOGO.height}
              loading="eager"
            />
          </div>
        </div>
      </div>
      )}

      {/* ─── TOPBAR ─── */}
      {!isCanvasRoute && (
        <nav className={`topbar${topbarScrolled ? " topbar-scrolled" : ""}`}>
        <button type="button" className="brand-lockup" onClick={() => navigate("/")}>
          <div className="institutional-logo-container" style={{ padding: '2px', marginRight: '8px' }}>
            <ResponsiveImage
              src={SMART_CITY_LOGO.src}
              alt="Smart City Thailand"
              className="brand-logo"
              width={SMART_CITY_LOGO.width}
              height={SMART_CITY_LOGO.height}
              loading="eager"
              style={{ width: '24px', height: '24px' }}
            />
          </div>
          <span className="brand-name">
            {locale === "th" ? "ดัชนีเมืองอัจฉริยะไทย" : locale === "zh" ? "泰国智慧城市指数" : "Smart City Thailand Index"}
          </span>
        </button>
        <div className="topbar-actions">
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? locale === "th"
                  ? "ปิดเมนูนำทาง"
                  : locale === "zh"
                    ? "关闭导航菜单"
                    : "Close navigation menu"
                : locale === "th"
                  ? "เปิดเมนูนำทาง"
                  : locale === "zh"
                    ? "打开导航菜单"
                    : "Open navigation menu"
            }
            onClick={() => setMobileMenuOpen(open => !open)}
          >
            <span />
            <span />
            <span />
          </button>
          <div className={`nav-links ${mobileMenuOpen ? "nav-links-open" : ""}`}>
            {/* Phase 2.4 \u2014 13 flat items consolidated into 5 grouped dropdowns */}
            <TopbarNav
              locale={locale}
              currentKind={route.kind}
              onNavigate={navigate}
              mobileOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />
            <button
              type="button"
              className="theme-toggle"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
              onClick={toggleTheme}
            >
              {theme === "light" ? "\u263E" : "\u2600"}
            </button>
            <div
              className="locale-segmented"
              role="group"
              aria-label={locale === "th" ? "เลือกภาษา" : locale === "zh" ? "选择语言" : "Select language"}
            >
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "en"}
                aria-label="English"
                onClick={() => setLocale("en")}
              >
                EN
              </button>
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "th"}
                aria-label="ภาษาไทย"
                onClick={() => setLocale("th")}
              >
                TH
              </button>
              <button
                type="button"
                className="locale-segmented-btn"
                aria-pressed={locale === "zh"}
                aria-label="中文"
                onClick={() => setLocale("zh")}
              >
                CN
              </button>
            </div>
          </div>
        </div>
      </nav>
      )}

      {/* ─── CONTENT ─── */}
      <main id="main-content" className={`page-frame ${isDashboardRoute ? "page-frame-dashboard" : ""} ${isCanvasRoute ? "page-frame-canvas" : ""}`} key={getRouteKey(route)}>
        {!isCanvasRoute && <PagePhotoHero route={route} locale={locale} />}
        <ErrorBoundary locale={locale}>
          <Suspense fallback={<div className="loading" role="status" aria-live="polite" aria-label="Loading page" />}>
            {route.kind === "rankings" ? (
              <RankingsPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "methodology" ? (
              <MethodologyPage locale={locale} />
            ) : route.kind === "story" ? (
              <StoryPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "why" ? (
              <WhyPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "showcase" ? (
              <ShowcasePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "partners" ? (
              <PartnershipsPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "map" ? (
              <MapDashboardPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "asus" ? (
              <AsusPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "audit" ? (
              <AuditPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "references" ? (
              <ReferencesPage locale={locale} />
            ) : route.kind === "program" ? (
              <ProgramPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "knowledge" ? (
              <KnowledgePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "discover" ? (
              <DiscoverPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "invest" ? (
              <InvestPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "compare" ? (
              <ComparePage locale={locale} onNavigate={navigate} />
            ) : route.kind === "bingo" ? (
              <ScitiBingoPage locale={locale} />
            ) : route.kind === "city" ? (
              <CityDetailPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
            ) : route.kind === "canvas" ? (
              <CityCanvasPage cityId={route.cityId} locale={locale} onNavigate={navigate} />
            ) : route.kind === "about" ? (
              <AboutPage locale={locale} onNavigate={navigate} />
            ) : route.kind === "creative-economy" ? (
              <CreativeEconomyPage locale={locale} onNavigate={navigate} />
            ) : (
              <HomePage locale={locale} onNavigate={navigate} />
            )}
          </Suspense>
        </ErrorBoundary>
        
        {!isCanvasRoute && <DataFeedback locale={locale} />}
      </main>

      {(!isDashboardRoute && !isCanvasRoute) && (
        <>
          {/* ─── NEWS FEED ─── */}
          <section className="news-section">
            <div className="section">
              <p className="eyebrow">{locale === "th" ? "ข่าวสาร" : locale === "zh" ? "资讯" : "News feed"}</p>
              <h2>{locale === "th" ? "ข่าวล่าสุด" : locale === "zh" ? "最新动态" : "Latest"}</h2>
              <div className="news-grid">
                {newsItems.map((item, i) => (
                  <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="news-item">
                    <span className="news-date">{item.date}</span>
                    <span className="news-title">{locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}</span>
                    <span className="news-source">{item.source} →</span>
                  </a>
                ))}
              </div>
            </div>
          </section>

          {/* ─── NEWSLETTER SIGNUP ─── */}
          <section className="newsletter-section" style={{ background: "var(--surface)", borderTop: "1px solid var(--border)", padding: "3rem 1rem", textAlign: "center" }}>
            <div className="section" style={{ maxWidth: "600px", margin: "0 auto" }}>
              <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "0.5rem", color: "var(--ink)" }}>
                {locale === "th" ? "สมัครรับข้อมูลข่าวสาร" : locale === "zh" ? "订阅简报" : "Subscribe to SCITI Data Insights"}
              </h3>
              <p style={{ marginBottom: "1.5rem", color: "var(--2)" }}>
                {locale === "th" 
                  ? "รับข้อมูลเชิงลึกเศรษฐกิจสร้างสรรค์ระดับจังหวัดรายเดือน ส่งตรงถึงอีเมลคุณ" 
                  : locale === "zh" 
                    ? "获取每月省级创意经济数据洞察，直接发送到您的收件箱。" 
                    : "Get monthly provincial creative economy data insights straight to your inbox."}
              </p>
              <form onSubmit={e => e.preventDefault()} style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                <input 
                  type="email" 
                  placeholder={locale === "th" ? "อีเมลของคุณ" : locale === "zh" ? "您的电子邮件" : "Your email address"} 
                  style={{ padding: "0.75rem 1rem", borderRadius: 0, border: "1px solid var(--border)", flex: "1", maxWidth: "300px", background: "var(--bg)", color: "var(--ink)" }}
                  required
                />
                <button type="submit" className="cta-button" style={{ padding: "0.75rem 1.5rem", border: "none" }}>
                  {locale === "th" ? "ติดตาม" : locale === "zh" ? "订阅" : "Subscribe"}
                </button>
              </form>
            </div>
          </section>

          {/* ─── NEW FOOTER ─── */}
          <footer className="site-footer">
            <div className="section" style={{ paddingBottom: "2rem" }}>
              <div className="footer-logos" style={{ marginBottom: "2rem" }}>
                <div className="institutional-logo-container"><ResponsiveImage src={MDES_LOGO.src} alt="MDES" className="footer-logo" width={MDES_LOGO.width} height={MDES_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={DEPA_LOGO.src} alt="depa" className="footer-logo" width={DEPA_LOGO.width} height={DEPA_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SMART_CITY_LOGO.src} alt="Smart City Thailand" className="footer-logo" width={SMART_CITY_LOGO.width} height={SMART_CITY_LOGO.height} /></div>
                <div className="institutional-logo-container"><ResponsiveImage src={SLIC_LOGO.src} alt="SLIC Index" className="footer-logo" width={SLIC_LOGO.width} height={SLIC_LOGO.height} /></div>
              </div>

              <nav
                className="footer-nav"
                aria-label={locale === "th" ? "ลิงก์ท้ายเว็บ" : locale === "zh" ? "页脚链接" : "Footer links"}
                style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", marginBottom: "2rem" }}
              >
                <button type="button" className="endpoint-link" onClick={() => navigate("/why")}>
                  {locale === "th" ? "ทำไมต้อง SCITI" : locale === "zh" ? "为什么是 SCITI" : "Why SCITI"}
                </button>
                <button type="button" className="endpoint-link" onClick={() => navigate("/map")}>
                  {locale === "th" ? "แผนที่ประเทศ" : locale === "zh" ? "全国地图" : "National Map"}
                </button>
              </nav>

              <div className="footer-fineprint">
                <p style={{ fontWeight: 600, color: "var(--text)", marginBottom: "0.5rem", fontSize: "1rem" }}>
                  {locale === "th" ? "SCITI (sciti.nonarkara.org) -- แพลตฟอร์มข้อมูลเศรษฐกิจสร้างสรรค์ระดับจังหวัดของไทย" : locale === "zh" ? "SCITI (sciti.nonarkara.org) —— 泰国省级创意经济数据平台" : "SCITI (sciti.nonarkara.org) -- Thailand's Provincial Creative Economy Data Platform"}
                </p>
                <p style={{ fontWeight: 600, color: "var(--teal)", marginBottom: "1rem", fontSize: "0.85rem", letterSpacing: "0.05em", textTransform: "uppercase" as const }}>
                  {locale === "th" ? "การสมัคร CEA Creative Excellence Awards 2026 | รางวัลนโยบายเมืองสร้างสรรค์ (ประเภท 1.3)" : locale === "zh" ? "CEA 创意卓越奖 2026 申请 | 创意城市政策奖（1.3 类）" : "CEA Creative Excellence Awards 2026 Application | Creative City Policy Award (Category 1.3)"}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--4)", lineHeight: "1.6" }}>
                  {locale === "th"
                    ? "SCITI เป็นต้นแบบเครื่องมือนโยบายสาธารณะดิจิทัลสำหรับเปรียบเทียบเมืองไทยด้วยข้อมูลฐานสาธารณะ งานวิจัยที่มีแหล่งอ้างอิง และวิธีรวมคะแนนแบบเปิดเผย โดยวางงานไว้ในบริบทของเครือข่ายย่านสร้างสรรค์ เมืองอัจฉริยะ และการกระจายโอกาสทางเศรษฐกิจของไทย"
                    : locale === "zh"
                      ? "SCITI 是一项数字公共政策工具原型，以公开基线、有来源的研究和透明的汇总方法比较泰国城市，并将成果置于泰国创意街区、智慧城市和经济机会下沉的政策语境中。"
                      : "SCITI is a digital public-policy prototype for comparing Thai cities through public baselines, source-linked research, and a transparent aggregation method. It places that work in the context of Thailand's creative districts, smart-city programme, and decentralized economic opportunity."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--4)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "การอ้างอิงข้อมูล: " : locale === "zh" ? "数据归属： " : "Data Attribution: "}</strong>
                  {locale === "th"
                    ? "ฉบับเผยแพร่นี้ผสานข้อมูลฐานสาธารณะระดับจังหวัด ทะเบียนและแพลตฟอร์มสาธารณะ รวมถึงดุลยพินิจทางวิจัยที่ระบุไว้อย่างชัดเจน แฟ้มเมืองและไฟล์ส่งออกแสดงสถาบันต้นทาง ระดับพื้นที่ ค่าความเชื่อมั่น และข้อจำกัด ไม่อ้างว่าทุกค่าเป็นข้อมูลเทศบาลหรือข้อมูลสด"
                    : locale === "zh"
                      ? "本版本结合省级公开基线、公开名录与平台记录，以及明确标注的研究判断。城市档案与导出文件说明来源机构、地理层级、置信度和局限；我们不声称每个值都是市级或实时数据。"
                      : "This release combines provincial public baselines, public registries and platform records, and explicitly labelled research judgement. City dossiers and exports disclose source institutions, geographic level, confidence, and limitations; not every value is claimed to be municipal or live."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--4)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "กิตติกรรมประกาศ: " : locale === "zh" ? "致谢： " : "Acknowledgments: "}</strong>
                  {locale === "th"
                    ? "SCITI พัฒนาขึ้นโดยสอดคล้องกับกรอบนโยบายเศรษฐกิจสร้างสรรค์แห่งชาติของไทย และแนวทางปฏิบัติที่ดีที่สุดระดับโลกในการกำกับดูแลข้อมูลวัฒนธรรม รวมถึง Amsterdam Cultural Infrastructure Mapping, Barcelona CityOS, Buenos Aires Data Cultura, Seoul Open Data Plaza และ Singapore Cultural Statistics"
                    : locale === "zh"
                      ? "SCITI 的开发符合泰国国家创意经济政策框架以及文化数据治理的全球最佳实践，包括阿姆斯特丹文化基础设施地图、巴塞罗那 CityOS、布宜诺斯艾利斯 Data Cultura、首尔开放数据广场和新加坡文化统计。"
                      : "SCITI is developed in alignment with Thailand's national creative economy policy framework and global best practices in cultural data governance, including Amsterdam Cultural Infrastructure Mapping, Barcelona CityOS, Buenos Aires Data Cultura, Seoul Open Data Plaza, and Singapore Cultural Statistics."}
                </p>
                <p style={{ marginBottom: "1rem", color: "var(--4)", lineHeight: "1.6" }}>
                  <strong style={{ color: "var(--3)" }}>{locale === "th" ? "ติดต่อ: " : locale === "zh" ? "联系方式： " : "Contact: "}</strong>
                  {locale === "th"
                    ? "สอบถามข้อมูล เสนอความร่วมมือ หรือแจ้งแก้ไข ติดต่อทีม SCITI ได้ทาง sciti.nonarkara.org"
                    : locale === "zh"
                      ? "有关数据查询、合作提案或更正，请通过 sciti.nonarkara.org 联系 SCITI 团队。"
                      : "For data inquiries, partnership proposals, or corrections, contact the SCITI team via sciti.nonarkara.org"}
                </p>
                <p style={{ borderTop: "1px solid var(--5)", paddingTop: ".5rem", marginTop: "1rem", fontSize: "0.75rem" }}>
                  {locale === "th"
                    ? "© 2026 สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) · วิธีการ SLIC · ข้อมูลเปิดเผยภายใต้ CC BY 4.0"
                    : locale === "zh"
                      ? "© 2026 数字经济促进局（depa） · SLIC 方法论 · 数据依据 CC BY 4.0 许可公开"
                      : "© 2026 Digital Economy Promotion Agency (depa) · SLIC methodology · Data published under CC BY 4.0"}
                </p>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* ─── GEMINI CHATBOT ─── */}
      {!isCanvasRoute && (
        <Suspense fallback={null}>
          <GeminiChat locale={locale} />
        </Suspense>
      )}
    </div>
  );
}
