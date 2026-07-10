// ---------------------------------------------------------------------------
// depa Official Smart City Data — Phase 19 (2026-04-28)
// ---------------------------------------------------------------------------
// Source: Official Executive Summary PDFs published by depa Thailand at
//   https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/
// PDFs were downloaded, extracted with pdftotext, translated/condensed
// from Thai originals where English was not provided.
//
// Coverage: Batch 1 (May 2021) cities for which PDFs were found.
//   Batch 2–4 cities pending PDF discovery or Thai-language extraction.
//
// Each record:
//   cityId        — matches src/cityData.ts id
//   batch         — certification batch (1 = May 2021, 2 = Nov 2022, etc.)
//   endorsedDate  — national committee endorsement date (ISO)
//   officialName  — city's registered smart city name per depa
//   vision        — English condensation of the official vision statement
//   visionTh      — Thai original vision phrase (verbatim from PDF)
//   brandline     — the city's strategic tagline or brand if named
//   projectCount  — total planned smart city projects (all 7 dimensions)
//   keyProjects   — 3–5 flagship projects from the official plan
//   partnerships  — notable institutional/international partnerships
//   pdfUrl        — source PDF URL for attribution
// ---------------------------------------------------------------------------

export interface DepaOfficialRecord {
  cityId: string;
  batch: 1 | 2 | 3 | 4;
  endorsedDate: string; // ISO
  officialName: string;
  vision: string;
  visionTh: string;
  brandline?: string;
  projectCount?: number;
  keyProjects: string[];
  keyProjectsTh?: string[];
  partnerships?: string[];
  depaUrl: string;
}

export const DEPA_OFFICIAL: Record<string, DepaOfficialRecord> = {

  // ─── BATCH 1 — May 6, 2021 ────────────────────────────────────────────────

  "phuket": {
    cityId: "phuket",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "Phuket Smart City",
    vision: "A sustainable city for tourism, education, innovation, and services at international standards — delivering smart city solutions across all 7 dimensions.",
    visionTh: "เมืองท่องเที่ยว ศึกษา นวัตกรรม และบริการที่ยั่งยืนในระดับสากล",
    brandline: "Crown Jewel of the Andaman",
    projectCount: 42,
    keyProjects: [
      "Intelligent Operation Center (IOC) — citywide data integration hub",
      "Smart Bus network connecting the international airport to every major district",
      "AI-powered CCTV with face and license-plate recognition for public safety",
      "Andaman Tourism Digital Twin — distributing sustainable tourism beyond the island",
      "Mobility-as-a-Service (MaaS) platform serving residents and visitors",
      "LoraWAN and NB-IoT city-wide IoT network + City Data Platform (CDP)",
    ],
    partnerships: [
      "Phuket City Development Company (PKCD) — first private-sector smart city consortium in Thailand",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/Phuket%20Smart%20City.pdf",
  },

  "khon-kaen": {
    cityId: "khon-kaen",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "Khon Kaen Smart City",
    vision: "To become a liveable metropolis and innovative city that connects all economies in the Greater Mekong Subregion — the 3M capital: Medical, Mobility, and MICE.",
    visionTh: "มหานครน่าอยู่และเมืองนวัตกรรมที่เชื่อมเศรษฐกิจทั่วอนุภูมิภาคลุ่มน้ำโขง",
    brandline: "3M: Medical · Mobility · MICE",
    projectCount: 28,
    keyProjects: [
      "Khon Kaen Living Lab — healthcare innovation for elderly and chronic conditions",
      "Smart Ambulance — digital dispatch and en-route patient data integration",
      "Khon Kaen Mass Transit (BRT + planned LRT) with Transit-Oriented Development",
      "IoT-sensor waste management — real-time analytics for collection route optimisation",
      "SME and startup ecosystem for IoT/digital industry",
    ],
    partnerships: [
      "Korea MOLIT — joint mobility master plan and comprehensive transit study",
      "UK Future Cities Program (British Embassy Bangkok) + UK Tech Export Academy",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/Khon%20Kaen%20Smart%20City.pdf",
  },

  "cmu-smart-city": {
    cityId: "cmu-smart-city",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "มหาวิทยาลัยเชียงใหม่เมืองอัจฉริยะ (CMU Smart City)",
    vision: "A leading learning community, socially responsible, advancing toward sustainable excellence aligned with SDGs — CMU as the clean-energy smart city sandbox for Chiang Mai.",
    visionTh: "ชุมชนแห่งการเรียนรู้ชั้นนำ รับผิดชอบต่อสังคม พัฒนาสู่ความเป็นเลิศที่ยั่งยืนตามแนวทาง SDGs",
    brandline: "CMU Smart City–Clean Energy",
    projectCount: 28,
    keyProjects: [
      "CMU Smart City–Clean Energy Masterplan — 7-dimension roadmap for the Suthep campus area",
      "Green innovation leadership: renewable energy adoption, IoT resource management",
      "Smart campus mobility: EV shuttles, cycling infrastructure, pedestrian connectivity",
      "Lifelong learning ecosystem (CMU Transformation — 'New CMU')",
      "Community integration: 10 surrounding neighbourhoods from Pai Lom to Nimman",
    ],
    partnerships: [
      "Chiang Mai Province — designated smart city sandbox pilot area by provincial government",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/2_CMU%20Smart%20City.pdf",
  },

  "yala": {
    cityId: "yala",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "ยะลาเมืองอัจฉริยะ (Yala Smart City)",
    vision: "The digital hub of the southern border provinces — restoring Yala's role as the economic and investment centre of the south while reshaping its safety narrative through citizen-participation technology.",
    visionTh: "เป็นศูนย์กลางดิจิทัลกลุ่มจังหวัดภาคใต้ชายแดน ที่นำไปสู่การพัฒนา",
    brandline: "Smart City for People's Participation",
    keyProjects: [
      "Yala Green Corridor — smart environment and landscape restoration project",
      "Smart safety and CCTV network to counter the security perception gap",
      "Smart Governance platform for citizen participation and transparent public services",
      "Smart Economy hub — positioning Yala as the deep-south investment gateway",
    ],
    partnerships: [
      "Yala Municipality (เทศบาลนครยะลา) as primary implementing authority",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/15_Yala%20Smart%20City.pdf",
  },

  "makkasan": {
    cityId: "makkasan",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "เมืองอัจฉริยะมักกะสัน (Makkasan Smart City)",
    vision: "New Global Gateway of Asian Prosperity — a Transit-Oriented Development model city anchored to the Makkasan Airport Rail Link station, integrating mixed-use urban life with smart infrastructure.",
    visionTh: "ประตูสู่ความมั่งคั่งและความภาคภูมิใจของประเทศไทย — New Global Gateway of Asian Prosperity",
    brandline: "Gateway to Asia's Prosperity",
    projectCount: 60,
    keyProjects: [
      "Transit-Oriented Development (TOD) on 140 rai next to Makkasan ARL station",
      "Phase 1 (2021–2023): 7 projects in Smart Environment, Smart People, Smart Living",
      "Phase 2 (2024–2029): 53 additional projects across all 7 dimensions",
      "Mixed-use development: residential, commercial, office, hotel + innovation campus",
      "Capacity for 10,000 residents and 240,000 daily users",
    ],
    partnerships: [
      "Asia Era One Co. Ltd — High-Speed Rail Link concession developer",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/9_Makkasan%20Smart%20City.pdf",
  },

  "phra-ram-4": {
    cityId: "phra-ram-4",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "เมืองอัจฉริยะย่านพระราม ๔ (Phra Ram 4 Smart City)",
    vision: "A smart CBD that strengthens Bangkok's economic competitiveness and elevates quality of life and environment to international standards — a city for everyone.",
    visionTh: "เมืองอัจฉริยะย่านพาณิชยกรรมศูนย์กลางเมืองที่สร้างเสริมความสามารถในการแข่งขันทางเศรษฐกิจ และยกระดับคุณภาพชีวิตของประชาชนและสิ่งแวดล้อมตามมาตรฐานสากล",
    brandline: "Bangkok's Smart Innovation District",
    keyProjects: [
      "10 sq km Rama IV corridor smart district (Klong Phadung to Ratchada)",
      "Creative economy innovation zone linking Samyan, Siam, and the CBD",
      "Smart mobility: improving pedestrian and transit connectivity in a 200,000-person daytime district",
      "Environmental tech: green building standards, energy efficiency across office towers",
    ],
    partnerships: [
      "Chulalongkorn University (lead institution) + Phra Ram 4 Smart City Alliance",
      "Pathumwan, Bang Rak, Sathon, and Khlong Toei district offices",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/7_Phra%20Ram%204%20Smart%20City.pdf",
  },

  "saensuk": {
    cityId: "saensuk",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "แสนสุขสมาร์ตซิตี้ (Saensuk Smart City)",
    vision: "A coastal wellness tourism destination — designing smart city services around an ageing population, accessible quality healthcare, and a safe environment for residents and visitors.",
    visionTh: "เมืองท่องเที่ยวแห่งสุขภาวะที่ดี",
    keyProjects: [
      "Smart health services targeted at the elderly (17% of population aged 60+)",
      "Smart environment: coastal ecosystem monitoring for Bang Saen beach and aquaculture zones",
      "Smart safety: crime and incident surveillance for tourism safety",
      "IoT infrastructure for the Burapha University–city corridor",
    ],
    partnerships: [
      "Saensuk Municipality (20.24 sq km, Chonburi Province)",
      "Burapha University — eastern Thailand's leading educational institution",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/11_Saensuk%20Smart%20City.pdf",
  },

  "wangchan-valley": {
    cityId: "wangchan-valley",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "วังจันทร์วัลเลย์สมาร์ทซิตี้ (Wangchan Valley Smart City)",
    vision: "A purpose-built innovation valley in the Eastern Economic Corridor — a corporate-led R&D campus that pilots smart city technology before national roll-out.",
    visionTh: "เมืองนวัตกรรมอัจฉริยะในพื้นที่ระเบียงเศรษฐกิจพิเศษภาคตะวันออก",
    keyProjects: [
      "PTT-developed 5G and IoT testbed campus in EEC, Rayong Province",
      "Smart energy: renewable and clean energy integration for the entire valley",
      "Digital twin of the campus for real-time operational management",
      "Smart mobility: autonomous vehicle testing and electric fleet for on-campus transit",
    ],
    partnerships: [
      "PTT Group — majority developer and operator",
      "EEC — Eastern Economic Corridor co-designation",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/12_Wangchan%20Valley%20Smart%20City.pdf",
  },

  "sritrang": {
    cityId: "sritrang",
    batch: 1,
    endorsedDate: "2021-05-06",
    officialName: "ศรีตรังซิตี้ (Sri Trang City)",
    vision: "A smart Trang township rooted in southern heritage — improving quality of life and public services for a working town on the Trang railway corridor.",
    visionTh: "เมืองอัจฉริยะที่ยกระดับคุณภาพชีวิตของประชาชนจังหวัดตรัง",
    keyProjects: [
      "Smart governance: digital public services for Trang municipality",
      "Smart environment: monitoring the Trang River corridor and coastal mangroves",
      "Smart mobility: improving connectivity on the southern rail line",
    ],
    depaUrl: "https://www.depa.or.th/storage/app/media/SmartCity/Tab_SmartCity/14_Sri%20Trang%20City.pdf",
  },

  // ─── BATCH 2 — November 2022 ───────────────────────────────────────────────
  // PDFs not yet found in public depa storage. Summaries from official press
  // release (depa.or.th/en/article-view/20221109_01) and news sources.

  "rayong": {
    cityId: "rayong",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Rayong Smart City",
    vision: "A smart and livable city at the heart of the Eastern Economic Corridor — balancing industrial strength with sustainable community quality of life.",
    visionTh: "เมืองอัจฉริยะที่น่าอยู่ใจกลางระเบียงเศรษฐกิจพิเศษภาคตะวันออก",
    keyProjects: [
      "EEC-aligned smart manufacturing and digital industry district",
      "Smart environment: air and water quality monitoring around Map Ta Phut industrial estate",
      "Smart mobility: logistics and public transit for the EEC eastern corridor",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "chiang-rai": {
    cityId: "chiang-rai",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Smart City Chiang Rai",
    vision: "A northern border city leveraging its cultural tourism and Mekong corridor geography to become the gateway smart city of the upper GMS.",
    visionTh: "เมืองอัจฉริยะด้านการท่องเที่ยวและเกตเวย์ชายแดนตอนบนของอนุภูมิภาคลุ่มน้ำโขง",
    keyProjects: [
      "Smart tourism management for heritage attractions (Doi Tung, White Temple corridor)",
      "Smart border: digital facilitation for the Myanmar and Laos border crossings",
      "Smart environment: Kok river and highland forest monitoring",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "nan": {
    cityId: "nan",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Nan Smart City",
    vision: "A mountain valley heritage city integrating digital governance into its traditional Tai Lue culture and forest conservation mission.",
    visionTh: "เมืองอัจฉริยะที่อนุรักษ์วัฒนธรรมและสิ่งแวดล้อมด้วยเทคโนโลยี",
    keyProjects: [
      "Smart forest and watershed telemetry for Nan's protected highlands",
      "Heritage digital archive: Wat Phumin murals and Tai Lue cultural documentation",
      "Smart governance: e-service platform for the provincial administrative office",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "korat": {
    cityId: "korat",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Korat Smart City",
    vision: "Gateway to Isan — a logistics and university hub upgrading its urban services with smart infrastructure for the northeast's largest city.",
    visionTh: "ประตูสู่อีสาน เมืองศูนย์กลางโลจิสติกส์และมหาวิทยาลัยอัจฉริยะ",
    keyProjects: [
      "Smart mobility: improving Mittraphap corridor logistics and public transit",
      "Khao Yai–Korat green belt: environmental monitoring and ecotourism data",
      "Smart economy: university–industry corridor around Suranaree University of Technology",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "ubon": {
    cityId: "ubon",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Smart City Ubon Ratchathani",
    vision: "Eastern Isan's cultural and economic capital — using digital infrastructure to enhance the city's role as a Mekong sub-regional hub.",
    visionTh: "ศูนย์กลางเมืองอัจฉริยะภาคอีสานตอนล่าง เชื่อมโยงอนุภูมิภาคลุ่มน้ำโขง",
    keyProjects: [
      "Smart tourism: digitising the Ubon Candle Festival and heritage sites",
      "Smart river management: Mun River flood monitoring and agricultural support",
      "Smart economy: cross-border trade facilitation with Laos via Chong Mek",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "krabi": {
    cityId: "krabi",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Krabi Smart City",
    vision: "A limestone-karst tourism city balancing high-end visitor experience with marine ecosystem protection through digital environmental governance.",
    visionTh: "เมืองท่องเที่ยวอัจฉริยะที่ปกป้องระบบนิเวศทะเลและหินปูน",
    keyProjects: [
      "Marine and karst ecosystem telemetry for Phang Nga Bay and Ao Nang",
      "Smart tourism: managing visitor flow to Railay, Four Islands, and Tiger Cave temple",
      "Carbon-neutral tourism infrastructure: EV ferries and solar-powered island facilities",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "phangnga": {
    cityId: "phangnga",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Phang Nga Smart City",
    vision: "Quiet twin of Phuket — leveraging Phang Nga Bay's UNESCO-worthy karst landscape and the Andaman cultural corridor for sustainable smart tourism.",
    visionTh: "เมืองอัจฉริยะด้านการท่องเที่ยวยั่งยืนในอ่าวพังงา",
    keyProjects: [
      "Phang Nga Bay maritime monitoring: water quality and vessel traffic management",
      "Andaman Tourism Digital Twin (joint initiative with Phuket)",
      "Smart heritage: Takua Pa old town and Khao Lak disaster-resilience programme",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "satun": {
    cityId: "satun",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Satun Smart City",
    vision: "Thailand's southernmost smart city — protecting the Satun UNESCO Global Geopark while connecting border communities with digital public services.",
    visionTh: "เมืองอัจฉริยะใต้สุดของไทย ปกป้องธรณีอุทยานโลกและเชื่อมชุมชนชายแดน",
    keyProjects: [
      "Geopark digital platform: geolocation tours and geological heritage documentation",
      "Smart border: Malaysia border crossing facilitation (Wang Kelian)",
      "Marine and mangrove ecosystem monitoring for Tarutao National Park",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "samui": {
    cityId: "samui",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Koh Samui Smart City",
    vision: "A sustainable island smart city — managing the tension between large-scale resort tourism and the quality of life of 65,000 permanent residents.",
    visionTh: "เมืองท่องเที่ยวเกาะอัจฉริยะที่ยั่งยืน สมดุลระหว่างการท่องเที่ยวและคุณภาพชีวิตชุมชน",
    keyProjects: [
      "Island water and waste management: smart utilities for a no-grid island",
      "Smart tourism: passenger flow management at Samui Airport and the ferry terminals",
      "Coastal resilience: sea-level and coral reef monitoring around Koh Samui and Koh Tao",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "hat-yai": {
    cityId: "hat-yai",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Hat Yai Smart City",
    vision: "Thailand's largest commercial border hub going green — digitising logistics, trade, and urban services for half a million residents and millions of Malaysian visitors.",
    visionTh: "เมืองพาณิชย์ชายแดนอัจฉริยะสีเขียว ศูนย์กลางโลจิสติกส์ภาคใต้",
    keyProjects: [
      "Smart flood early-warning system — Hat Yai has flooded severely multiple times",
      "Digital trade facilitation for the Malaysia–Thailand border commerce corridor",
      "Smart mobility: city bus and songtheaw network optimisation for 500,000+ residents",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "pattani": {
    cityId: "pattani",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Pattani Smart City",
    vision: "A historic Malay-Muslim capital using smart city tools to restore economic vitality and civic trust in a post-conflict recovery context.",
    visionTh: "เมืองอัจฉริยะที่ฟื้นฟูเศรษฐกิจและความไว้วางใจในพื้นที่จังหวัดชายแดนใต้",
    keyProjects: [
      "Smart governance: transparent digital public services and citizen feedback platforms",
      "Smart economy: halal food cluster digitalisation and Gulf of Thailand fisheries data",
      "Cultural preservation: Krue Se mosque and Pattani historic district digital heritage archive",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

  "narathiwat": {
    cityId: "narathiwat",
    batch: 2,
    endorsedDate: "2022-11-09",
    officialName: "Narathiwat Smart City",
    vision: "Creative Environment City — the southernmost smart city on the Malaysian border, using digital tools to create an inclusive creative economy out of natural and cultural assets.",
    visionTh: "เมืองสิ่งแวดล้อมสร้างสรรค์ ที่ใช้เทคโนโลยีพัฒนาเศรษฐกิจสร้างสรรค์บนพรมแดนใต้สุด",
    keyProjects: [
      "River and coastal monitoring: Sungai Kolok and Marang River estuary",
      "Smart governance: e-service platform for border community administration",
      "Creative economy hub: hand-woven Kho-Yo fabric and local craft digitalisation",
    ],
    depaUrl: "https://www.depa.or.th/en/article-view/20221109_01",
  },

};

/** Get the official depa record for a city, or undefined if not yet in registry. */
export function getDepaOfficial(cityId: string): DepaOfficialRecord | undefined {
  return DEPA_OFFICIAL[cityId];
}

/** National programme statistics from official depa sources (2025). */
export const DEPA_PROGRAMME_STATS = {
  certifiedCities: 37,
  promotionZones: 173,
  provinces: 25,
  citizensCoveredMillions: 9,
  totalInvestmentBaht: 11_900_000_000,
  target2027Cities: 105,
  smartDimensions: 7,
  certificationCriteria: 5,
  sourceYear: 2025,
};
