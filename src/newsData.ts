// ---------------------------------------------------------------------------
// Smart City News — curated items for the homepage news strip.
// Each item is trilingual. Tags drive color-coding.
// summary is shown on the card so readers know what to expect before clicking.
// ---------------------------------------------------------------------------

export type NewsTag = "policy" | "tech" | "thailand" | "international" | "feature";

export interface NewsItem {
  id: string;
  title: { en: string; th: string; zh: string };
  summary?: { en: string; th: string; zh: string };
  source: string;
  url: string;
  date: string;
  tag: NewsTag;
}

export const NEWS_ITEMS: NewsItem[] = [
  // ── Dr Non features & interviews ───────────────────────────────────────
  {
    id: "govmesh-2026",
    title: {
      en: "GovMesh 4.0 — Dr. Non speaks alongside digital leaders from Sri Lanka, Uzbekistan & beyond",
      th: "GovMesh 4.0 — ดร.นนท์ร่วมพูดกับผู้นำดิจิทัลจากศรีลังกา อุซเบกิสถาน และอื่นๆ",
      zh: "GovMesh 4.0 — Non Arkara 博士与来自斯里兰卡、乌兹别克斯坦等国的数字领导人共同发言",
    },
    summary: {
      en: "Invitation-only gathering of emerging digital governments in Singapore (March 2026), convened by GovInsider & interweave.gov. Themes: smart city deployment, data governance, and candid knowledge exchange between countries that rarely share a stage.",
      th: "งานประชุมรัฐบาลดิจิทัลแบบเชิญเฉพาะในสิงคโปร์ (มีนาคม 2569) จัดโดย GovInsider & interweave.gov หัวข้อ: การพัฒนาสมาร์ทซิตี้ ธรรมาภิบาลข้อมูล และการแลกเปลี่ยนความรู้อย่างตรงไปตรงมาระหว่างประเทศที่มักไม่ค่อยได้พบกัน",
      zh: "由GovInsider与interweave.gov联合举办的新加坡数字政府邀请制峰会（2026年3月）。主题：智慧城市部署、数据治理，以及鲜少同台的国家之间的坦诚知识交流。",
    },
    source: "GovInsider · interweave.gov",
    url: "https://govinsider.asia/intl-en/event/govmesh-40-by-govinsider-and-interweavegov/speakers",
    date: "2026-03-02",
    tag: "international",
  },
  {
    id: "govinsider-iaas",
    title: {
      en: "Can Innovation-as-a-Service close the gap between policy and implementation?",
      th: "นวัตกรรมในรูปแบบบริการจะช่วยปิดช่องว่างระหว่างนโยบายกับการนำไปปฏิบัติได้หรือไม่?",
      zh: "创新即服务能否弥合政策与落地之间的鸿沟？",
    },
    summary: {
      en: "Thailand's depa teams up with New Zealand startup JIX Reality to launch the Smart and Liveable City Lab. Dr. Non argues this model — starting from community problems rather than pre-built products — cuts procurement costs, reduces R&D time, and earns broader public support than conventional top-down mandates.",
      th: "depa ของไทยจับมือ JIX Reality สตาร์ทอัพจากนิวซีแลนด์เปิดตัว Smart and Liveable City Lab ดร.นนท์ชี้ว่าโมเดลนี้ — เริ่มจากปัญหาชุมชนก่อน ไม่ใช่ผลิตภัณฑ์สำเร็จรูป — ลดต้นทุนจัดซื้อ ย่น R&D และได้รับการสนับสนุนจากสาธารณะมากกว่านโยบายจากบนลงล่างแบบเดิม",
      zh: "泰国depa与新西兰初创企业JIX Reality联合推出智慧宜居城市实验室。Non Arkara 博士认为，从社区问题出发而非强推现成产品的模式，可降低采购成本、缩短研发周期，并比传统自上而下的指令获得更广泛的公众支持。",
    },
    source: "GovInsider",
    url: "https://govinsider.asia/intl-en/article/can-innovation-as-a-service-close-the-gap-between-policy-and-implementation",
    date: "2024-09-15",
    tag: "policy",
  },
  {
    id: "iscn-global-mixer-2023",
    title: {
      en: "ISCN Global Mixer: Rethinking 'Smart' — Community-Driven Innovation in Thailand",
      th: "ISCN Global Mixer: ทบทวนความหมาย 'สมาร์ท' — นวัตกรรมที่ขับเคลื่อนโดยชุมชนในไทย",
      zh: "ISCN全球交流会：重新思考「智慧」——泰国社区驱动的创新",
    },
    summary: {
      en: "Dr. Non Arkara presented to the International Smart City Network on citizen-centric urban innovation, using NST's crowdsourced flood-response system as the central case. Core argument: 'Smart cities are not only about technology and funding, but about citizen participation and data — and innovative solutions can be simple.'",
      th: "ดร.นนท์ อาคารา นำเสนอต่อเครือข่ายเมืองอัจฉริยะนานาชาติเรื่องนวัตกรรมเมืองที่เน้นประชาชน โดยใช้ระบบรับมือน้ำท่วมแบบ crowdsource ของนครศรีธรรมราชเป็นกรณีหลัก ประเด็นสำคัญ: 'สมาร์ทซิตี้ไม่ใช่แค่เรื่องเทคโนโลยีและเงิน แต่คือการมีส่วนร่วมของประชาชนและข้อมูล — และนวัตกรรมที่ดีอาจเรียบง่ายมาก'",
      zh: "Non Arkara 博士在国际智慧城市网络上发表演讲，聚焦以市民为核心的城市创新，以洛坤的众包洪水响应系统为核心案例。核心论点：'智慧城市不仅关乎技术和资金，更关乎公民参与和数据——而好的创新解决方案往往很简单。'",
    },
    source: "Smart City Dialog · ISCN",
    url: "https://www.smart-city-dialog.de/en/latest/events/iscn-global-mixer-rethinking-smart-insights-community-driven-innovation-thailand",
    date: "2023-10-30",
    tag: "thailand",
  },
  {
    id: "technode-smart-city-citizens",
    title: {
      en: "\"A smart city cannot exist without its citizens\" — Dr. Non on trust, tech, and civic participation",
      th: "\"เมืองอัจฉริยะจะมีอยู่ไม่ได้หากปราศจากประชาชน\" — ดร.นนท์ว่าด้วยความไว้วางใจ เทคโนโลยี และการมีส่วนร่วมของพลเมือง",
      zh: "\"没有市民，智慧城市就无法存在\" — Non Arkara 博士谈信任、技术与公民参与",
    },
    summary: {
      en: "TechNode Global interview with Dr. Non Arkaraprasertkul on Thailand's dual strategy: upgrading existing cities alongside building new high-tech urban centres to attract global investment. He argues technological advances foster stronger trust between citizens and institutions — but only when built around local community needs.",
      th: "สัมภาษณ์ TechNode Global กับ ดร.นนท์ อาคารา เรื่องกลยุทธ์คู่ขนานของไทย: พัฒนาเมืองที่มีอยู่แล้วควบคู่กับการสร้างศูนย์กลางเมืองไฮเทคใหม่เพื่อดึงดูดการลงทุนทั่วโลก เขาชี้ว่าความก้าวหน้าทางเทคโนโลยีสร้างความไว้วางใจระหว่างประชาชนกับสถาบันได้มากขึ้น — แต่ต้องสร้างรอบความต้องการของชุมชนท้องถิ่น",
      zh: "TechNode Global对Non Arkara 博士的专访，探讨泰国的双轨战略：在升级现有城市的同时建设新型高科技城市中心以吸引全球投资。他认为，技术进步可增进公民与机构之间的信任——但前提是围绕本地社区需求构建。",
    },
    source: "TechNode Global",
    url: "https://technode.global/2023/01/18/a-smart-city-cannot-exist-without-its-citizens-and-technological-advances-will-foster-stronger-trust-between-citizens-and-institutions-and-encourage-civic-participation-says-dr-non-arkaraprasertkul/",
    date: "2023-01-18",
    tag: "feature",
  },
  {
    id: "asean-magazine-dr-non",
    title: {
      en: "The ASEAN Magazine profiles Dr. Non Arkaraprasertkul — digital transformation requires more than infrastructure",
      th: "The ASEAN Magazine สัมภาษณ์ ดร.นนท์ อาคารา — การเปลี่ยนแปลงดิจิทัลต้องการมากกว่าโครงสร้างพื้นฐาน",
      zh: "《东盟杂志》专访Non Arkara 博士——数字化转型需要的不只是基础设施",
    },
    summary: {
      en: "Profile of Dr. Non — Harvard-trained architect and anthropologist at depa — arguing that digital transformation requires three things ecosystem, viable markets, and open innovation platforms. He warns technology can both unite and divide societies depending on how nations build digital ecosystems that include, not just connect.",
      th: "โปรไฟล์ของ ดร.นนท์ — นักสถาปัตยกรรมและมานุษยวิทยาจาก Harvard ที่ depa — ชี้ว่าการเปลี่ยนแปลงดิจิทัลต้องมีสามสิ่ง: ระบบนิเวศที่สนับสนุน ตลาดที่มีศักยภาพ และแพลตฟอร์มนวัตกรรมแบบเปิด เขาเตือนว่าเทคโนโลยีอาจรวมหรือแบ่งแยกสังคมได้ ขึ้นอยู่กับว่าประเทศสร้างระบบนิเวศดิจิทัลที่รวมทุกคนไว้จริงหรือเปล่า",
      zh: "哈佛培养的建筑师兼人类学家、depa专家Non Arkara 博士的人物专访，主张成功的数字化转型需要三要素：有利的生态系统、可行的市场以及开放创新平台。他警告，技术可以联结或分裂社会——取决于各国构建的数字生态系统是否真正包容，而非仅仅连接。",
    },
    source: "The ASEAN Magazine",
    url: "https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/",
    date: "2021-07-24",
    tag: "feature",
  },

  // ── Thailand smart city news ─────────────────────────────────────────────
  {
    id: "sciti-cea-2026",
    title: {
      en: "SCITI 2026 submitted to CEA Creative Excellence Awards — data transparency scorecard for 118 Thai cities",
      th: "SCITI 2026 ส่งเข้าประกวด CEA Creative Excellence Awards — ระบบให้คะแนนความโปร่งใสข้อมูล 118 เมืองไทย",
      zh: "SCITI 2026提交 CEA 创意卓越奖——118座泰国城市的数据透明度评分卡",
    },
    summary: {
      en: "depa's Smart City Promotion Department submits SCITI 2026 — a 7-pillar scorecard ranking 118 Thai cities — to the CEA Creative Excellence Awards 2026 (Category 1.3). The index is open-access, PDPA-compliant, and built for investment-grade city comparison.",
      th: "ฝ่ายส่งเสริมสมาร์ทซิตี้ของ depa ส่ง SCITI 2026 — ระบบให้คะแนน 7 เสาหลักสำหรับ 118 เมืองไทย — เข้าประกวด CEA Creative Excellence Awards 2026 (ประเภท 1.3) ดัชนีนี้เปิดให้เข้าถึงได้อย่างเสรี สอดคล้อง PDPA และออกแบบมาสำหรับการเปรียบเทียบเมืองระดับลงทุน",
      zh: "depa智慧城市推广部门将SCITI 2026——对118座泰国城市进行7大支柱评分的体系——提交至 CEA 创意卓越奖 2026（1.3 类）。该指数开放获取、符合PDPA，专为投资级城市比较而设计。",
    },
    source: "depa Smart City Promotion Department",
    url: "https://sciti.nonarkara.org/",
    date: "2026-05-20",
    tag: "thailand",
  },
  {
    id: "phuket-transport-mou",
    title: {
      en: "DEPA and Polish firm Seedia sign Phuket smart transport MoU",
      th: "depa ลงนาม MoU กับ Seedia ของโปแลนด์ พัฒนาขนส่งอัจฉริยะภูเก็ต",
      zh: "depa与波兰Seedia签署普吉智慧交通合作备忘录",
    },
    summary: {
      en: "Signed 16 June 2026 with Polish Investment and Trade Agency support — the MoU targets smart mobility and smart environment in Phuket, with a forum on transport priorities for the island's smart city plan.",
      th: "ลงนามเมื่อ 16 มิ.ย. 2569 โดยการสนับสนุนของหน่วยงานส่งเสริมการลงทุนและการค้าโปแลนด์ — MoU มุ่ง Smart Mobility และ Smart Environment ในภูเก็ต พร้อมเวทีหารือลำดับความสำคัญด้านขนส่งของแผนสมาร์ทซิตี้เกาะ",
      zh: "2026年6月16日在波兰投资贸易局支持下签署——备忘录聚焦普吉智慧出行与智慧环境，并举办论坛讨论岛上智慧城市计划的交通优先事项。",
    },
    source: "Rawai Phuket News",
    url: "https://www.rawai.com/depa-and-polish-firm-seedia-sign-phuket-smart-transport-mou/",
    date: "2026-06-16",
    tag: "thailand",
  },
  {
    id: "khon-kaen-lrt",
    title: {
      en: "Work on light rail transit system in Khon Kaen expected to begin in 2025",
      th: "คาดเริ่มก่อสร้างรถไฟฟ้ารางเบาขอนแก่นในปี 2568",
      zh: "孔敬轻轨系统预计2025年开工",
    },
    summary: {
      en: "Khon Kaen is proceeding with its Light Rail Transit mass transit system — a provincial project watched across the Northeast for what it signals about urban mobility outside Bangkok.",
      th: "ขอนแก่นเดินหน้าโครงการรถไฟฟ้ารางเบา (LRT) — โครงการระดับจังหวัดที่อีสานจับตาว่าจะบอกอะไรเรื่องการเคลื่อนที่ของคนในเมืองนอกกรุงเทพฯ",
      zh: "孔敬正推进轻轨（LRT）项目——这项省级工程被东北各地视为观察泰国曼谷以外城市交通走向的风向标。",
    },
    source: "Nation Thailand",
    url: "https://www.nationthailand.com/thailand/general/40036060",
    date: "2024-03-03",
    tag: "thailand",
  },
  {
    id: "depa-105-cities-2027",
    title: {
      en: "Depa pushes Smart City, targeting 105 inclusive cities by 2027",
      th: "depa ผลักดันสมาร์ทซิตี้ เป้า 105 เมืองภายในปี 2570",
      zh: "depa推动智慧城市，目标2027年达到105座包容型城市",
    },
    summary: {
      en: "At Thailand Smart City Expo 2025, depa commits to expanding the national smart city programme — focused on smart living, digital government, and cybersecurity alongside local inclusion.",
      th: "ใน Thailand Smart City Expo 2025 depa ผูกพันขยายโครงการสมาร์ทซิตี้ระดับชาติ — เน้น Smart Living รัฐบาลดิจิทัล และความมั่นคงไซเบอร์ควบคู่การมีส่วนร่วมของท้องถิ่น",
      zh: "在2025泰国智慧城市博览会上，depa承诺扩大全国智慧城市计划——聚焦智慧生活、数字政府与网络安全，并强调地方包容性。",
    },
    source: "Nation Thailand",
    url: "https://www.nationthailand.com/blogs/sustaination/40057822",
    date: "2025-11-06",
    tag: "thailand",
  },
  {
    id: "bangkok-ai-traffic",
    title: {
      en: "Green light for AI traffic signals",
      th: "ไฟเขียวสำหรับสัญญาณไฟจราจร AI",
      zh: "AI交通信号灯获得绿灯",
    },
    summary: {
      en: "Bangkok Metropolitan Administration partnered with Google on Project Green Light — deploying adaptive AI traffic signals that cut delays on pilot corridors before citywide scaling.",
      th: "กรุงเทพมหานครร่วมมือ Google ใน Project Green Light — ติดตั้งสัญญาณไฟจราจร AI แบบปรับตัวที่ลดความล่าช้าบนเส้นทางนำร่องก่อนขยายทั่วเมือง",
      zh: "曼谷市政管理局与Google合作开展Project Green Light——在试点路段部署自适应AI交通信号，缩短延误后再向全市推广。",
    },
    source: "Bangkok Post",
    url: "https://www.bangkokpost.com/thailand/general/3100497/green-light-for-ai-traffic-signals",
    date: "2025-09-08",
    tag: "tech",
  },

  // ── Regional & international ─────────────────────────────────────────────
  {
    id: "asean-scn-me-report-2025",
    title: {
      en: "ASEAN Smart Cities Network publishes 2025 Monitoring & Evaluation Report",
      th: "ASCN เผยแพร่รายงาน Monitoring & Evaluation ประจำปี 2568",
      zh: "东盟智慧城市网络发布2025年监测与评估报告",
    },
    summary: {
      en: "ASEAN's 26-city network releases its 2025 M&E report — tracking progress on climate-resilient infrastructure, cross-border data sharing, and citizen-centric service design across member pilots.",
      th: "เครือข่าย 26 เมืองของอาเซียนเผยแพร่รายงาน M&E ปี 2568 — ติดตามความคืบหน้าโครงสร้างพื้นฐานที่ทนทานต่อสภาพภูมิอากาศ การแบ่งปันข้อมูลข้ามพรมแดน และการออกแบบบริการที่เน้นประชาชนในเมืองนำร่อง",
      zh: "东盟26城网络发布2025年监测与评估报告——追踪各试点城市在气候韧性基础设施、跨境数据共享及以市民为中心的服务设计方面的进展。",
    },
    source: "ASEAN Secretariat",
    url: "https://asean.org/wp-content/uploads/2025/11/2025-ASCN-ME-Report-Final_30Sep2025-for-public.pdf",
    date: "2025-09-30",
    tag: "international",
  },
  {
    id: "singapore-sn2",
    title: {
      en: "Smart Nation 2.0: Initiatives in Singapore",
      th: "Smart Nation 2.0: แผนริเริ่มของสิงคโปร์",
      zh: "Smart Nation 2.0：新加坡新举措",
    },
    summary: {
      en: "GovTech outlines Singapore's refreshed Smart Nation blueprint built on three pillars — Trust, Growth, and Community — as the city-state adapts its 2014 digital nation vision to new technology trends.",
      th: "GovTech สรุปแผน Smart Nation ฉบับใหม่ของสิงคโปร์บนสามเสาหลัก Trust, Growth และ Community — ปรับวิสัยทัศน์ชาติดิจิทัลปี 2557 ให้เข้ากับเทรนด์เทคโนโลยีใหม่",
      zh: "GovTech概述新加坡更新的Smart Nation蓝图，以信任、增长、社区三大支柱为核心——将2014年数字国家愿景适应新技术趋势。",
    },
    source: "GovTech Singapore",
    url: "https://www.tech.gov.sg/technews/our-enhanced-smart-nation-vision-paving-the-way-for-a-new-digital-era/",
    date: "2024-12-30",
    tag: "international",
  },
];

export const TAG_COLORS: Record<NewsTag, string> = {
  thailand: "var(--teal)",
  international: "var(--gold)",
  tech: "var(--sky, #0EA5E9)",
  policy: "var(--indigo, #6366F1)",
  feature: "var(--amber, #f59e0b)",
};

export const TAG_LABELS: Record<NewsTag, { en: string; th: string; zh: string }> = {
  thailand: { en: "Thailand", th: "ไทย", zh: "泰国" },
  international: { en: "International", th: "นานาชาติ", zh: "国际" },
  tech: { en: "Technology", th: "เทคโนโลยี", zh: "技术" },
  policy: { en: "Policy", th: "นโยบาย", zh: "政策" },
  feature: { en: "Feature", th: "บทความพิเศษ", zh: "专题" },
};
