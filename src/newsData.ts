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
      zh: "GovMesh 4.0 — ดร.นนท์与来自斯里兰卡、乌兹别克斯坦等国的数字领导人共同发言",
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
      zh: "泰国depa与新西兰初创企业JIX Reality联合推出智慧宜居城市实验室。ดร.นนท์认为，从社区问题出发而非强推现成产品的模式，可降低采购成本、缩短研发周期，并比传统自上而下的指令获得更广泛的公众支持。",
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
      zh: "ดร.นนท์ อาคารา在国际智慧城市网络上发表演讲，聚焦以市民为核心的城市创新，以那空是贪玛叻的众包洪水响应系统为核心案例。核心论点：'智慧城市不仅关乎技术和资金，更关乎公民参与和数据——而好的创新解决方案往往很简单。'",
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
      zh: "\"没有市民，智慧城市就无法存在\" — ดร.นนท์谈信任、技术与公民参与",
    },
    summary: {
      en: "TechNode Global interview with Dr. Non Arkaraprasertkul on Thailand's dual strategy: upgrading existing cities alongside building new high-tech urban centres to attract global investment. He argues technological advances foster stronger trust between citizens and institutions — but only when built around local community needs.",
      th: "สัมภาษณ์ TechNode Global กับ ดร.นนท์ อาคารา เรื่องกลยุทธ์คู่ขนานของไทย: พัฒนาเมืองที่มีอยู่แล้วควบคู่กับการสร้างศูนย์กลางเมืองไฮเทคใหม่เพื่อดึงดูดการลงทุนทั่วโลก เขาชี้ว่าความก้าวหน้าทางเทคโนโลยีสร้างความไว้วางใจระหว่างประชาชนกับสถาบันได้มากขึ้น — แต่ต้องสร้างรอบความต้องการของชุมชนท้องถิ่น",
      zh: "TechNode Global对ดร.นนท์ อาคารา的专访，探讨泰国的双轨战略：在升级现有城市的同时建设新型高科技城市中心以吸引全球投资。他认为，技术进步可增进公民与机构之间的信任——但前提是围绕本地社区需求构建。",
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
      zh: "《东盟杂志》专访ดร.นนท์ อาคารา——数字化转型需要的不只是基础设施",
    },
    summary: {
      en: "Profile of Dr. Non — Harvard-trained architect and anthropologist at depa — arguing that digital transformation requires three things ecosystem, viable markets, and open innovation platforms. He warns technology can both unite and divide societies depending on how nations build digital ecosystems that include, not just connect.",
      th: "โปรไฟล์ของ ดร.นนท์ — นักสถาปัตยกรรมและมานุษยวิทยาจาก Harvard ที่ depa — ชี้ว่าการเปลี่ยนแปลงดิจิทัลต้องมีสามสิ่ง: ระบบนิเวศที่สนับสนุน ตลาดที่มีศักยภาพ และแพลตฟอร์มนวัตกรรมแบบเปิด เขาเตือนว่าเทคโนโลยีอาจรวมหรือแบ่งแยกสังคมได้ ขึ้นอยู่กับว่าประเทศสร้างระบบนิเวศดิจิทัลที่รวมทุกคนไว้จริงหรือเปล่า",
      zh: "哈佛培养的建筑师兼人类学家、depa专家ดร.นนท์的人物专访，主张成功的数字化转型需要三要素：有利的生态系统、可行的市场以及开放创新平台。他警告，技术可以联结或分裂社会——取决于各国构建的数字生态系统是否真正包容，而非仅仅连接。",
    },
    source: "The ASEAN Magazine",
    url: "https://theaseanmagazine.asean.org/article/non-arkaraprasertkul-phd/",
    date: "2021-07-24",
    tag: "feature",
  },

  // ── Thailand smart city news ─────────────────────────────────────────────
  {
    id: "sciti-red-dot-2026",
    title: {
      en: "SCITI 2026 submitted to Red Dot Design Award — data transparency scorecard for 118 Thai cities",
      th: "SCITI 2026 ส่งเข้าประกวด Red Dot Design Award — ระบบให้คะแนนความโปร่งใสข้อมูล 118 เมืองไทย",
      zh: "SCITI 2026提交红点设计奖——118座泰国城市的数据透明度评分卡",
    },
    summary: {
      en: "depa's Smart City Promotion Department submits SCITI 2026 — a 7-pillar scorecard ranking 118 Thai cities — to the Red Dot Communication Design Award. The index is open-access, PDPA-compliant, and built for investment-grade city comparison.",
      th: "ฝ่ายส่งเสริมสมาร์ทซิตี้ของ depa ส่ง SCITI 2026 — ระบบให้คะแนน 7 เสาหลักสำหรับ 118 เมืองไทย — เข้าประกวด Red Dot Communication Design Award ดัชนีนี้เปิดให้เข้าถึงได้อย่างเสรี สอดคล้อง PDPA และออกแบบมาสำหรับการเปรียบเทียบเมืองระดับลงทุน",
      zh: "depa智慧城市推广部门将SCITI 2026——对118座泰国城市进行7大支柱评分的体系——提交至红点传播设计奖。该指数开放获取、符合PDPA，专为投资级城市比较而设计。",
    },
    source: "depa Smart City Promotion Department",
    url: "https://www.depa.or.th/en/smartcity",
    date: "2026-05-20",
    tag: "thailand",
  },
  {
    id: "khon-kaen-lrt",
    title: {
      en: "Khon Kaen Light Rail hits 60% construction — Phase 1 trial operations target late 2027",
      th: "รถไฟฟ้ารางเบาขอนแก่นคืบหน้า 60% — เป้าทดสอบเดินรถระยะที่ 1 ปลายปี 2570",
      zh: "孔敬轻轨施工进度达60%——第一期试运营目标定于2027年底",
    },
    summary: {
      en: "Thailand's most-watched provincial transit project crosses the 60% construction milestone. Phase 1 connects Khon Kaen's tech district to the central station — a corridor that anchors the city's smart mobility and EEC-East ambitions.",
      th: "โครงการขนส่งระดับจังหวัดที่ถูกจับตามองมากที่สุดในไทยผ่านเกณฑ์ 60% ระยะที่ 1 เชื่อมย่านเทคโนโลยีขอนแก่นกับสถานีกลาง — เส้นทางที่รองรับแผนการขนส่งอัจฉริยะและ EEC-East ของเมือง",
      zh: "泰国最受关注的省级交通项目突破60%施工里程碑。第一期连接孔敬科技区与中央车站——这条走廊是城市智慧出行与东部EEC战略的核心支撑。",
    },
    source: "State Railway of Thailand",
    url: "https://www.railway.co.th",
    date: "2026-04-28",
    tag: "thailand",
  },
  {
    id: "depa-2026-certification",
    title: {
      en: "depa opens 2026 Smart City Promotion Zone applications — digital governance standards tightened",
      th: "depa เปิดรับสมัครเขตส่งเสริมเมืองอัจฉริยะ 2569 — เพิ่มมาตรฐานธรรมาภิบาลดิจิทัล",
      zh: "depa开放2026年智慧城市推广区申请——数字治理标准收紧",
    },
    summary: {
      en: "depa's annual certification identifies local governments ready for full smart city deployment. The 2026 round adds mandatory digital governance criteria alongside the existing infrastructure and citizen-engagement benchmarks.",
      th: "การรับรองประจำปีของ depa คัดเลือกท้องถิ่นที่พร้อมสำหรับการใช้งานสมาร์ทซิตี้เต็มรูปแบบ รอบปี 2569 เพิ่มเกณฑ์ธรรมาภิบาลดิจิทัลภาคบังคับ ควบคู่กับมาตรฐานโครงสร้างพื้นฐานและการมีส่วนร่วมของประชาชนที่มีอยู่แล้ว",
      zh: "depa年度认证筛选具备全面部署条件的地方政府。2026年评选新增强制性数字治理标准，与现有基础设施和公民参与基准并列。",
    },
    source: "depa.or.th",
    url: "https://www.depa.or.th/en/smartcity",
    date: "2026-04-10",
    tag: "thailand",
  },
  {
    id: "bangkok-ai-traffic",
    title: {
      en: "Bangkok connects 1,200 CCTV feeds to unified AI traffic platform across all districts",
      th: "กรุงเทพฯ เชื่อมกล้องวงจรปิด 1,200 จุดสู่แพลตฟอร์ม AI จราจรรวมศูนย์ครอบคลุมทุกเขต",
      zh: "曼谷将1,200个摄像头接入全市统一AI交通平台",
    },
    summary: {
      en: "Bangkok Metropolitan Administration's AI traffic platform enables predictive signal adjustment, real-time incident detection, and cross-district coordination for the first time — a system built on repurposed CCTV infrastructure rather than new hardware.",
      th: "แพลตฟอร์ม AI จราจรของกรุงเทพมหานครเปิดใช้การปรับสัญญาณเชิงพยากรณ์ การตรวจจับเหตุการณ์แบบเรียลไทม์ และการประสานงานข้ามเขตเป็นครั้งแรก — ระบบที่สร้างบนโครงสร้างพื้นฐาน CCTV ที่มีอยู่แล้ว ไม่ใช่ฮาร์ดแวร์ใหม่",
      zh: "曼谷市政管理局的AI交通平台首次实现预测性信号调节、实时事故检测与跨区协调——依托现有摄像头基础设施而非新硬件构建。",
    },
    source: "Bangkok Metropolitan Administration",
    url: "https://www.bangkok.go.th",
    date: "2026-03-14",
    tag: "tech",
  },

  // ── Regional & international ─────────────────────────────────────────────
  {
    id: "asean-scn-roadmap",
    title: {
      en: "ASEAN Smart Cities Network publishes 2025–2030 Road Map — 26 pilots, climate resilience focus",
      th: "ASCN เผยแผนยุทธศาสตร์ 2568–2573 — 26 เมืองนำร่อง เน้นภูมิคุ้มกันสภาพภูมิอากาศ",
      zh: "东盟智慧城市网络发布2025—2030路线图——26个试点，聚焦气候韧性",
    },
    summary: {
      en: "ASEAN's 26-city smart city network commits to climate-resilient infrastructure, cross-border data sharing, and citizen-centric service design through 2030. Thailand's Chiang Mai and Khon Kaen are listed as featured pilots in the roadmap.",
      th: "เครือข่ายเมืองอัจฉริยะ 26 เมืองของอาเซียนผูกพันกับโครงสร้างพื้นฐานที่ทนทานต่อสภาพภูมิอากาศ การแบ่งปันข้อมูลข้ามพรมแดน และการออกแบบบริการที่เน้นประชาชนถึงปี 2573 โดยมีเชียงใหม่และขอนแก่นของไทยเป็นเมืองนำร่องเด่นในแผน",
      zh: "东盟26个智慧城市网络城市承诺到2030年建设气候韧性基础设施、跨境数据共享和以市民为中心的服务设计。泰国清迈和孔敬被列为路线图中的重点试点城市。",
    },
    source: "ASEAN Secretariat",
    url: "https://asean.org/asean-smart-cities-network/",
    date: "2025-10-06",
    tag: "international",
  },
  {
    id: "singapore-sn2-2025",
    title: {
      en: "Singapore Smart Nation 2.0 — digital ID, health data portability, and AI governance live",
      th: "สิงคโปร์ Smart Nation 2.0 — Digital ID พกพาข้อมูลสุขภาพ และธรรมาภิบาล AI ใช้งานได้แล้ว",
      zh: "新加坡Smart Nation 2.0——数字身份、健康数据互通与AI治理全面上线",
    },
    summary: {
      en: "Singapore's Smart Nation 2.0 enters full operation, setting a new ASEAN benchmark with interoperable digital identity, portable health records, and a statutory AI governance framework. Other ASEAN governments are studying the model for replication.",
      th: "Smart Nation 2.0 ของสิงคโปร์เริ่มใช้งานเต็มรูปแบบ กำหนดมาตรฐาน ASEAN ใหม่ด้วย Digital ID แบบ interoperable เวชระเบียนแบบพกพา และกรอบการกำกับดูแล AI ตามกฎหมาย รัฐบาล ASEAN อื่นๆ กำลังศึกษาโมเดลนี้เพื่อประยุกต์ใช้",
      zh: "新加坡Smart Nation 2.0全面投入运营，以可互操作的数字身份、便携健康档案和法定AI治理框架树立东盟新标杆。其他东盟国家政府正在研究该模式以供复制。",
    },
    source: "GovTech Singapore",
    url: "https://www.tech.gov.sg",
    date: "2025-11-18",
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
