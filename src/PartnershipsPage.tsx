import { lazy, Suspense } from "react";
import type { Locale } from "./types";

const GlobeMap = lazy(() => import("./GlobeMap"));

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface Partnership {
  id: string;
  flag: string;
  country: { en: string; th: string; zh: string };
  program: string;
  year: string;
  investment: string;
  cities: string;
  focus: { en: string; th: string; zh: string };
  status: "active" | "completed" | "stalled" | "early";
  vibe: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  lesson: { en: string; th: string; zh: string };
  sourceUrl: string;
  sourceLabel: string;
  accent: string;
  action?: { path: string; label: { en: string; th: string; zh: string } };
}

const partnerships: Partnership[] = [
  {
    id: "japan",
    flag: "🇯🇵",
    country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" },
    program: "JASCA / Smart JAMP",
    year: "2020–present",
    investment: "$2.4B (ASEAN)",
    cities: "Bangkok, Phuket, Chiang Mai, Khon Kaen, Chonburi",
    focus: { en: "Autonomous transport, city data, CCTV, PRT", th: "ขนส่งอัตโนมัติ ข้อมูลเมือง CCTV PRT", zh: "自动交通、城市数据、CCTV、PRT" },
    status: "active",
    vibe: { en: "The System Builder — cameras before asphalt", th: "ผู้สร้างระบบ — กล้องก่อนยางมะตอย", zh: "系统建设者——摄像头优于沥青" },
    body: {
      en: "Japan is the biggest external system-builder. The 250B yen fund is regional, but Thailand repeatedly shows up in delivery: Bangsue mapping, city data platforms, and JASCA coordination.",
      th: "ญี่ปุ่นคือผู้เล่นต่างประเทศที่ลงมือสร้างระบบมากที่สุด กองทุน 2.5 แสนล้านเยนเป็นระดับภูมิภาค แต่ไทยโผล่ในชั้นการส่งมอบซ้ำๆ",
      zh: "日本是这份名单里最像系统建设者的外部伙伴。资金规模是区域级的，但泰国持续出现在交付层。",
    },
    lesson: {
      en: "Cameras vs Asphalt: The Fujitsu/Smart JAMP project in Phuket proves AI traffic management is 1/10th the cost of road expansion with better long-term outcomes.",
      th: "กล้อง vs ยางมะตอย: โปรเจกต์ Fujitsu ในภูเก็ตพิสูจน์ว่า AI จัดการจราจรประหยัดกว่าสร้างถนน 10 เท่า",
      zh: "摄像头 vs 沥青：普吉的富士通项目证明，AI交通管理成本仅为道路扩建的1/10。",
    },
    sourceUrl: "https://www.jasca2021.jp/cooperative/country/thailand/",
    sourceLabel: "JASCA Thailand",
    accent: "#C03030",
    action: { path: "/city/phuket", label: { en: "Phuket Case Study", th: "เคสภูเก็ต", zh: "普吉案例" } },
  },
  {
    id: "usa",
    flag: "🇺🇸",
    country: { en: "United States", th: "สหรัฐอเมริกา", zh: "美国" },
    program: "U.S.-ASEAN Smart Cities Partnership",
    year: "2018–present",
    investment: "$10M initial",
    cities: "Bangkok, Phuket",
    focus: { en: "Energy grid, water, ICT, 5G, cyber", th: "กริดพลังงาน น้ำ ICT 5G ไซเบอร์", zh: "能源电网、水、ICT、5G、网络安全" },
    status: "active",
    vibe: { en: "The Precision Partner — technically specific, politically narrow", th: "พันธมิตรเฉพาะทาง — เทคนิคละเอียด การเมืองแคบ", zh: "精准合作伙伴——技术专精，政治范围窄" },
    body: {
      en: "The U.S. line is narrower but technically specific. Bangkok and Phuket are linked to concrete expertise: renewable-grid planning, water exchanges, and technical assistance for Phuket's operations centre.",
      th: "เส้นของสหรัฐแคบกว่าแต่เฉพาะทางเชิงเทคนิคกว่า กรุงเทพฯ และภูเก็ตเชื่อมกับความเชี่ยวชาญที่จับต้องได้",
      zh: "美国这条线规模更窄，但技术指向更明确。曼谷与普吉对应的是具体专长，而不是抽象品牌。",
    },
    lesson: {
      en: "Blueprints Require Ownership: Technical assistance only sticks when local municipal capacity matches project complexity.",
      th: "พิมพ์เขียวต้องการเจ้าของ: ความช่วยเหลือทางเทคนิคจะยั่งยืนก็ต่อเมื่อศักยภาพท้องถิ่นโตทันความซับซ้อน",
      zh: "蓝图需要所有权：只有当本地市政能力与项目复杂度匹配时，技术援助才能落地。",
    },
    sourceUrl: "https://asean.usmission.gov/u-s-asean-smart-cities-partnership-usascp-sharing-expertise-between-cities-to-benefit-the-people-of-asean/",
    sourceLabel: "U.S. Mission to ASEAN",
    accent: "#2E5AAC",
  },
  {
    id: "uk",
    flag: "🇬🇧",
    country: { en: "United Kingdom", th: "สหราชอาณาจักร", zh: "英国" },
    program: "Smart City Handbook & Global Future Cities",
    year: "2020–present",
    investment: "Prosperity Fund",
    cities: "Bangkok, Chiang Mai, Khon Kaen, Chonburi",
    focus: { en: "Flood management, data planning, EV", th: "จัดการน้ำท่วม วางแผนจากข้อมูล EV", zh: "防洪、数据规划、电动车" },
    status: "completed",
    vibe: { en: "The Deliverer — programmes that finish what they start", th: "ผู้ส่งมอบ — โปรแกรมที่ทำจนจบ", zh: "交付者——说到做到的项目" },
    body: {
      en: "The UK work reads like a delivered programme rather than open-ended courtship. Bangkok got planning outputs, and the UK-Thailand handbook translated smart-city language into usable vocabulary.",
      th: "งานของสหราชอาณาจักรอ่านแล้วเหมือนโปรแกรมที่ส่งมอบแล้ว กรุงเทพฯ ได้ output เชิงแผน และคู่มือ UK-Thailand แปลภาษาสมาร์ตซิตี้ให้ใช้ง่าย",
      zh: "英国这条线更像一个已交付项目，而不是一场长期暧昧。曼谷拿到了具体规划成果，UK-Thailand手册也把智慧城市话语翻译成可操作语言。",
    },
    lesson: {
      en: "Standardization is Infrastructure: The UK Handbook taught us that a common vocabulary is as important as fiber optic cables for interoperability.",
      th: "มาตรฐานคือโครงสร้างพื้นฐาน: คู่มือ UK ย้ำว่าศัพท์เทคนิคที่ตรงกันสำคัญเท่ากับสายไฟเบอร์",
      zh: "标准即基础设施：英国手册教会我们，统一的话语体系与光缆对互操作性同样重要。",
    },
    sourceUrl: "https://www.gov.uk/government/news/uk-partner-with-thailand-to-create-smarter-cities",
    sourceLabel: "GOV.UK",
    accent: "#1A6B4A",
  },
  {
    id: "korea",
    flag: "🇰🇷",
    country: { en: "South Korea", th: "เกาหลีใต้", zh: "韩国" },
    program: "K-City Global Collaboration",
    year: "2020",
    investment: "Technical assistance",
    cities: "Khon Kaen",
    focus: { en: "Light rail, smart mobility", th: "รถไฟฟ้ารางเบา การเดินทางอัจฉริยะ", zh: "轻轨、智慧交通" },
    status: "stalled",
    vibe: { en: "The Blueprint Maker — planning that outruns execution", th: "ผู้สร้างพิมพ์เขียว — วางแผนเร็วกว่าลงมือ", zh: "蓝图制定者——规划超前于执行" },
    body: {
      en: "South Korea's role in Khon Kaen matters because it produced a serious blueprint, not immediate construction. The technical study exists. Implementation remains hard: funding, land, local execution.",
      th: "บทบาทของเกาหลีใต้ในขอนแก่นสำคัญเพราะสร้างพิมพ์เขียวจริงจัง ไม่ใช่การก่อสร้างทันที งานศึกษามีแล้ว แต่ implementation ยังหนัก",
      zh: "韩国在孔敬的重要性，不在于立刻开工，而在于确实做出了严肃的蓝图。技术研究已经存在，但真正实施仍然困难。",
    },
    lesson: {
      en: "Blueprints Require Ownership: Technical assistance from abroad only sticks when local municipal capacity matches the project complexity.",
      th: "พิมพ์เขียวต้องการเจ้าของ: ความช่วยเหลือจากต่างประเทศจะยั่งยืนก็ต่อเมื่อศักยภาพท้องถิ่นโตทันความซับซ้อน",
      zh: "蓝图需要所有权：只有当本地市政能力与项目复杂度匹配时，来自国外的技术援助才能落地。",
    },
    sourceUrl: "https://www.bangkokpost.com/thailand/general/1990795/khon-kaen-rail-gets-s-korean-guidance",
    sourceLabel: "Bangkok Post",
    accent: "#1A6B9A",
  },
  {
    id: "austria",
    flag: "🇦🇹",
    country: { en: "Austria", th: "ออสเตรีย", zh: "奥地利" },
    program: "Advantage Austria MOU",
    year: "2022",
    investment: "MOU stage",
    cities: "National-level",
    focus: { en: "Technology exchange, liveable-city pilots", th: "แลกเปลี่ยนเทคโนโลยี โครงการนำร่องเมืองน่าอยู่", zh: "技术交流、宜居城市试点" },
    status: "early",
    vibe: { en: "The Quality Benchmark — Vienna as the quiet reference", th: "มาตรฐานคุณภาพ — เวียนนาเป็น reference เงียบๆ", zh: "质量基准——维也纳是低调的标杆" },
    body: {
      en: "Austria is a useful reminder that not every partnership is mature. Vienna's expertise is attractive, the MOU is real, but visible follow-through is still light.",
      th: "ออสเตรียเตือนว่าไม่ใช่ทุกความร่วมมือจะสุกงอม ความเชี่ยวชาญของเวียนนาน่าสนใจ MOU มีจริง แต่ follow-through ยังบาง",
      zh: "奥地利提醒我们，并不是每个智慧城市合作都已经成熟。维也纳的经验很有吸引力，MOU也是真的，但目前看得到的后续动作仍然偏少。",
    },
    lesson: {
      en: "A smart-city MOU is not the same thing as delivery. Intent exists, but the delivery record is still thin.",
      th: "MOU ด้านสมาร์ตซิตี้ไม่เท่ากับการส่งมอบ มีเจตนา แต่ประวัติการส่งมอบยังบาง",
      zh: "智慧城市MOU不等于交付。意向存在，但交付记录仍然偏薄。",
    },
    sourceUrl: "https://archive.opengovasia.com/2022/01/20/thailand-and-austrian-trade-group-sign-smart-city-mou/",
    sourceLabel: "OpenGov Asia",
    accent: "#C45C1A",
  },
  {
    id: "china",
    flag: "🇨🇳",
    country: { en: "China", th: "จีน", zh: "中国" },
    program: "ASEAN-China Centre Field Visit",
    year: "2019",
    investment: "Knowledge exchange",
    cities: "Nanning (field visit)",
    focus: { en: "Smart city, digital urban management, smart agriculture", th: "เมืองอัจฉริยะ การจัดการเมืองดิจิทัล เกษตรอัจฉริยะ", zh: "智慧城市、数字化城市管理、智慧农业" },
    status: "completed",
    vibe: { en: "The Scale Demonstrator — what urban tech looks like at Chinese scale", th: "ผู้แสดงมาตราส่วน — เทคโนโลยีเมืองระดับจีนหน้าตาเป็นยังไง", zh: "规模示范者——城市科技在中国尺度下的面貌" },
    body: {
      en: "ASEAN Leadership Programme Field Visit to Nanning, 2019 — ASEAN city leaders observed smart city deployment and digital technology in urban management and agriculture at scale. The learning direction was clear: China shows what full-stack urban digitalization looks like when implementation speed is the primary variable.",
      th: "ASEAN Leadership Programme Field Visit ที่หนานหนิง ปี 2019 — ผู้นำเมืองอาเซียนสังเกตการณ์การใช้งานเมืองอัจฉริยะและเทคโนโลยีดิจิทัลในการบริหารจัดการเมืองและการเกษตรในมาตราส่วนใหญ่ ทิศทางการเรียนรู้ชัดเจน: จีนแสดงให้เห็นว่าการดิจิทัลไลซ์เมืองแบบครบชั้นหน้าตาเป็นอย่างไรเมื่อความเร็วในการดำเนินการเป็นตัวแปรหลัก",
      zh: "2019年亚洲领导力计划赴南宁考察——东盟城市领导人实地观摩大规模智慧城市部署与城市管理、农业领域的数字技术应用。学习方向明确：当实施速度是主要变量时，中国展示了全栈式城市数字化的真实面貌。",
    },
    lesson: {
      en: "Speed is a design variable. Chinese smart city deployment operates at a pace that forces ASEAN partners to ask which parts of the stack are truly necessary versus which parts are just slow.",
      th: "ความเร็วคือตัวแปรการออกแบบ การใช้งานเมืองอัจฉริยะของจีนดำเนินในจังหวะที่บังคับให้พันธมิตรอาเซียนถามว่าส่วนใดของ stack ที่จำเป็นจริงๆ กับส่วนใดที่แค่ช้า",
      zh: "速度是设计变量。中国智慧城市部署的节奏迫使东盟伙伴思考：技术栈的哪些部分是真正必要的，哪些只是拖慢了进度。",
    },
    sourceUrl: "https://www.asean-china-center.org/",
    sourceLabel: "ASEAN-China Centre",
    accent: "#C53939",
  },
  {
    id: "newzealand",
    flag: "🇳🇿",
    country: { en: "New Zealand", th: "นิวซีแลนด์", zh: "新西兰" },
    program: "ASCN Showcase + ALGIM Annual Conference",
    year: "2024",
    investment: "Knowledge exchange",
    cities: "National-level",
    focus: { en: "Local government digital services, civic tech, smart city initiatives", th: "บริการดิจิทัลของรัฐบาลท้องถิ่น เทคโนโลยีพลเมือง", zh: "地方政府数字服务、公民科技、智慧城市举措" },
    status: "completed",
    vibe: { en: "The Civic Technologist — local government digital done quietly well", th: "นักเทคโนโลยีพลเมือง — ดิจิทัลรัฐบาลท้องถิ่นที่ทำได้ดีอย่างเงียบๆ", zh: "公民技术实践者——悄然做好地方政府数字化" },
    body: {
      en: "ASCN Showcase of New Zealand Initiatives at the 2024 ALGIM Annual Conference. ALGIM (the Association of Local Government Information Management) is New Zealand's primary network for municipal digital transformation. The showcase surfaced how NZ local governments build citizen-facing digital services — a model with direct relevance to Thailand's tiered city structure.",
      th: "ASCN Showcase ของความคิดริเริ่มนิวซีแลนด์ที่งาน ALGIM Annual Conference 2024 ALGIM คือเครือข่ายหลักของนิวซีแลนด์สำหรับการเปลี่ยนแปลงดิจิทัลของเทศบาล การจัดแสดงแสดงให้เห็นวิธีที่รัฐบาลท้องถิ่น NZ สร้างบริการดิจิทัลสำหรับประชาชน ซึ่งมีความเกี่ยวข้องโดยตรงกับโครงสร้างเมืองระดับของไทย",
      zh: "2024年ALGIM年度会议上的ASCN新西兰倡议展示。ALGIM是新西兰地方政府信息管理的主要网络。展示揭示了新西兰地方政府如何构建面向市民的数字服务——这一模式与泰国分层城市结构直接相关。",
    },
    lesson: {
      en: "Citizen-facing digital services don't require a smart city label to work. New Zealand's local government approach shows that quiet, consistent service delivery compounds over time more effectively than headline technology announcements.",
      th: "บริการดิจิทัลสำหรับพลเมืองไม่จำเป็นต้องมีป้ายเมืองอัจฉริยะเพื่อให้ใช้งานได้ แนวทางรัฐบาลท้องถิ่นของนิวซีแลนด์แสดงให้เห็นว่าการให้บริการที่เงียบและสม่ำเสมอสะสมได้อย่างมีประสิทธิภาพมากกว่าการประกาศเทคโนโลยีที่เป็นข่าว",
      zh: "面向市民的数字服务不需要智慧城市标签就能运作。新西兰地方政府的做法表明，安静而持续的服务交付，比轰动的技术发布更能积累长期成效。",
    },
    sourceUrl: "https://www.algim.org.nz/",
    sourceLabel: "ALGIM",
    accent: "#1A6B3A",
  },
  {
    id: "solomon",
    flag: "🇸🇧",
    country: { en: "Solomon Islands", th: "หมู่เกาะโซโลมอน", zh: "所罗门群岛" },
    program: "Empowering Digital Transformation in SIDS",
    year: "2025",
    investment: "Capacity building",
    cities: "National public sector",
    focus: { en: "Public sector digitalization, small island developing states", th: "การดิจิทัลไลซ์ภาครัฐ รัฐเกาะขนาดเล็กที่กำลังพัฒนา", zh: "公共部门数字化、小岛屿发展中国家" },
    status: "active",
    vibe: { en: "The SIDS Pioneer — proving that geography is not destiny", th: "ผู้บุกเบิก SIDS — พิสูจน์ว่าภูมิศาสตร์ไม่ใช่โชคชะตา", zh: "小岛屿先驱——证明地理不是命运" },
    body: {
      en: "Empowering Digital Transformation in Small Island Developing States: Digitalization of Public Sector in the Solomon Islands, 2025. Thailand's engagement in this work positions SCITI's methodology as applicable beyond its own borders — the same logic of measuring outcomes over announcements applies to any government attempting genuine digital transition regardless of scale.",
      th: "การส่งเสริมการเปลี่ยนแปลงดิจิทัลในรัฐเกาะขนาดเล็กที่กำลังพัฒนา: การดิจิทัลไลซ์ภาครัฐในหมู่เกาะโซโลมอน 2025 การมีส่วนร่วมของไทยในงานนี้วางตำแหน่งระเบียบวิธีของ SCITI ว่าสามารถนำไปใช้ได้นอกเขตแดนของตัวเอง",
      zh: "赋权小岛屿发展中国家数字化转型：所罗门群岛公共部门数字化，2025年。泰国在此项工作中的参与，使SCITI方法论的适用性超越本国边界——以结果衡量而非以公告衡量的逻辑，适用于任何规模的政府数字转型。",
    },
    lesson: {
      en: "Digital governance methodology exports. The SIDS context reveals which parts of Thailand's smart city framework are genuinely transferable — and which parts depend on infrastructure that small island nations don't have yet.",
      th: "ระเบียบวิธีการกำกับดูแลดิจิทัลส่งออกได้ บริบท SIDS เผยให้เห็นว่าส่วนใดของกรอบเมืองอัจฉริยะของไทยที่ถ่ายโอนได้จริง และส่วนใดที่ขึ้นอยู่กับโครงสร้างพื้นฐานที่รัฐเกาะขนาดเล็กยังไม่มี",
      zh: "数字治理方法论可以出口。SIDS背景揭示了泰国智慧城市框架中哪些部分真正可以转移——以及哪些部分依赖于小岛屿国家尚不具备的基础设施。",
    },
    sourceUrl: "https://publicadministration.un.org/",
    sourceLabel: "UN DESA",
    accent: "#1A6B9A",
  },
  {
    id: "russia",
    flag: "🇷🇺",
    country: { en: "Russia", th: "รัสเซีย", zh: "俄罗斯" },
    program: "Global Digital Forum + BRICS Cloud Forum",
    year: "2025",
    investment: "Forum participation",
    cities: "National-level",
    focus: { en: "Digital governance, cloud infrastructure, BRICS digital economy", th: "การกำกับดูแลดิจิทัล โครงสร้างพื้นฐานคลาวด์ เศรษฐกิจดิจิทัล BRICS", zh: "数字治理、云基础设施、金砖国家数字经济" },
    status: "active",
    vibe: { en: "The Multipolar Platform — digital governance outside the Western stack", th: "แพลตฟอร์มหลายขั้ว — การกำกับดูแลดิจิทัลนอก stack ตะวันตก", zh: "多极平台——西方技术栈之外的数字治理" },
    body: {
      en: "Global Digital Forum and BRICS Cloud Forum, 2025. Thailand's participation in BRICS-adjacent digital forums is a signal of the multipolar context in which SCITI operates. The country's smart city programme receives input from both Western (US, EU, Japan, New Zealand) and Global South (China, Russia, SIDS) knowledge networks — which is accurate to how Thai policy actually works.",
      th: "Global Digital Forum และ BRICS Cloud Forum 2025 การมีส่วนร่วมของไทยในฟอรัมดิจิทัลที่เกี่ยวข้องกับ BRICS เป็นสัญญาณของบริบทหลายขั้วที่ SCITI ดำเนินการอยู่ โครงการเมืองอัจฉริยะของไทยได้รับข้อมูลจากทั้งเครือข่ายความรู้ตะวันตกและ Global South",
      zh: "2025年全球数字论坛与金砖国家云论坛。泰国参与金砖相关数字论坛，标志着SCITI所处的多极背景。泰国智慧城市计划同时接受西方（美国、欧盟、日本、新西兰）和全球南方（中国、俄罗斯、小岛屿国家）知识网络的输入——这与泰国政策实际运作方式相符。",
    },
    lesson: {
      en: "Smart city knowledge is not geopolitically neutral. Thailand's position in both Western and non-Western digital forums is an asset — it means the country can evaluate approaches rather than simply adopt any single country's stack.",
      th: "ความรู้เมืองอัจฉริยะไม่ได้เป็นกลางทางภูมิรัฐศาสตร์ ตำแหน่งของไทยในฟอรัมดิจิทัลทั้งตะวันตกและไม่ใช่ตะวันตกเป็นสินทรัพย์ หมายความว่าประเทศสามารถประเมินแนวทางต่างๆ แทนที่จะเพียงแค่นำ stack ของประเทศใดประเทศหนึ่งมาใช้",
      zh: "智慧城市知识不是地缘政治中立的。泰国同时活跃于西方和非西方数字论坛的地位是一种资产——这意味着该国可以评估各种方案，而不是简单地采用某一国的技术栈。",
    },
    sourceUrl: "https://globaldigitalforum.ru/",
    sourceLabel: "Global Digital Forum",
    accent: "#6B3FA0",
  },
];

const statusLabels: Record<Partnership["status"], { en: string; th: string; zh: string }> = {
  active: { en: "Active", th: "ยังเดินอยู่", zh: "仍在推进" },
  completed: { en: "Completed", th: "ส่งมอบแล้ว", zh: "已交付" },
  stalled: { en: "Stalled", th: "ติดคอขวด", zh: "推进受阻" },
  early: { en: "Early stage", th: "ยังต้นน้ำ", zh: "仍在早期" },
};

const TIMELINE: Array<{ year: string; flag: string; project: { en: string; th: string; zh: string }; country: { en: string; th: string; zh: string } }> = [
  { year: "2017", flag: "🇹🇭", project: { en: "depa established, Smart City Thailand Office created", th: "ก่อตั้ง depa และสำนักงานเมืองอัจฉริยะ", zh: "depa 成立，泰国智慧城市办公室设立" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2018", flag: "🇺🇸", project: { en: "U.S.-ASEAN Smart Cities Partnership launched ($10M)", th: "เปิดตัวความร่วมมือสหรัฯ-อาเซียน (10 ล้านดอลลาร์)", zh: "美国-东盟智慧城市伙伴关系启动" }, country: { en: "USA", th: "สหรัฐฯ", zh: "美国" } },
  { year: "2018", flag: "🇹🇭", project: { en: "ASCN pilot cities: Bangkok, Chiang Mai, Phuket selected", th: "เมืองนำร่อง ASCN: กรุงเทพฯ เชียงใหม่ ภูเก็ต", zh: "ASCN 试点城市选出" }, country: { en: "Thailand/ASEAN", th: "ไทย/อาเซียน", zh: "泰国/东盟" } },
  { year: "2019", flag: "🇰🇷", project: { en: "Korea K-City collaboration — Khon Kaen LRT planning", th: "ความร่วมมือ K-City — วางแผน LRT ขอนแก่น", zh: "韩国 K-City 合作——孔敬轻轨规划" }, country: { en: "South Korea", th: "เกาหลีใต้", zh: "韩国" } },
  { year: "2019", flag: "🇯🇵", project: { en: "JICA technical cooperation with depa begins", th: "JICA เริ่มความร่วมมือทางเทคนิคกับ depa", zh: "JICA 与 depa 启动技术合作" }, country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" } },
  { year: "2020", flag: "🇯🇵", project: { en: "JASCA Smart JAMP fund launched (250B yen ASEAN-wide)", th: "กองทุน JASCA Smart JAMP (2.5 แสนล้านเยน)", zh: "JASCA Smart JAMP 基金启动" }, country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" } },
  { year: "2020", flag: "🇬🇧", project: { en: "UK Prosperity Fund — Smart City Handbook for Thailand", th: "UK Prosperity Fund — คู่มือเมืองอัจฉริยะไทย", zh: "英国繁荣基金——泰国智慧城市手册" }, country: { en: "UK", th: "สหราชอาณาจักร", zh: "英国" } },
  { year: "2020", flag: "🇦🇹", project: { en: "Austria Advantage Austria MOU signed", th: "ลงนาม MOU Advantage Austria", zh: "签署 Advantage Austria 备忘录" }, country: { en: "Austria", th: "ออสเตรีย", zh: "奥地利" } },
  { year: "2021", flag: "🇹🇭", project: { en: "Batch 2: 15 more cities certified", th: "รุ่นที่ 2: รับรองเพิ่ม 15 เมือง", zh: "第 2 批：再认证 15 座城市" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2023", flag: "🇹🇭", project: { en: "Batch 3: 6 cities certified. Master Plan 2 launched", th: "รุ่นที่ 3: รับรอง 6 เมือง แผนแม่บทฉบับที่ 2", zh: "第 3 批：6 座城市获认证，第二期总体规划启动" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2023", flag: "🇺🇳", project: { en: "UN-Habitat ASUS Project Phase II begins (15 ASEAN cities)", th: "UN-Habitat เริ่ม ASUS Phase II (15 เมืองอาเซียน)", zh: "UN-Habitat ASUS 项目第二阶段启动" }, country: { en: "UN/Australia", th: "UN/ออสเตรเลีย", zh: "联合国/澳大利亚" } },
  { year: "2024", flag: "🇸🇬", project: { en: "Singapore Polytechnic Digital Twin Lab partnership", th: "ความร่วมมือห้องแล็บ Digital Twin สิงคโปร์", zh: "新加坡理工学院数字孪生实验室合作" }, country: { en: "Singapore", th: "สิงคโปร์", zh: "新加坡" } },
  { year: "2025", flag: "🇹🇭", project: { en: "Batch 4: Phuket Tinicon Valley certified", th: "รุ่นที่ 4: Phuket Tinicon Valley ได้รับการรับรอง", zh: "第 4 批：普吉 Tinicon Valley 获认证" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
  { year: "2026", flag: "🇹🇭", project: { en: "SCITI 2026 — first transparent outcome-based assessment", th: "SCITI 2026 — การประเมินโปร่งใสที่เน้นผลลัพธ์ครั้งแรก", zh: "SCITI 2026——首个透明的结果导向评估" }, country: { en: "Thailand", th: "ไทย", zh: "泰国" } },
];

function t(locale: Locale, dict: { en: string; th: string; zh: string }): string {
  return locale === "th" ? dict.th : locale === "zh" ? dict.zh : dict.en;
}

export default function PartnershipsPage({ locale, onNavigate }: Props) {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section partnerships-hero">
        <p className="eyebrow">{t(locale, { en: "International", th: "ระหว่างประเทศ", zh: "国际合作" })}</p>
        <h1 className="hero-title partnerships-title">
          {locale === "th"
            ? <>9 ความร่วมมือ 4 สถานะ:<br />ใครทำอะไรจริง</>
            : locale === "zh"
              ? <>9 项合作，4 种状态：<br />谁真的做了事</>
              : <>9 partnerships, 4 statuses:<br />who actually delivered.</>}
        </h1>
        <p className="hero-strapline partnerships-strapline">
          {t(locale, {
            en: "This page reads Thailand's international smart-city partnerships as delivery signals, not diplomatic theatre. Big numbers matter, but only when they connect to visible projects, city capability, or technical blueprints.",
            th: "หน้านี้อ่านความร่วมมือระหว่างประเทศของไทยในฐานะสัญญาณการส่งมอบ ไม่ใช่ละครการทูต ตัวเลขใหญ่มีความหมาย ก็ต่อเมื่อมันเชื่อมกับโครงการที่เห็นได้",
            zh: "本页把泰国的国际智慧城市合作当成交付信号来读，而不是外交表演。大数字只有在连到可见项目、城市能力或技术蓝图时才有意义。",
          })}
        </p>
      </section>

      {/* ─── SUMMARY STATS ─── */}
      <section className="section partnerships-summary-section">
        <div className="partnerships-summary-grid">
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">9</div>
            <div className="partnerships-summary-label">{t(locale, { en: "Partnership tracks", th: "เส้นความร่วมมือ", zh: "合作轨道" })}</div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">10+</div>
            <div className="partnerships-summary-label">{t(locale, { en: "Thai city touchpoints", th: "จุดแตะเมืองไทย", zh: "泰国城市触点" })}</div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">1</div>
            <div className="partnerships-summary-label">{t(locale, { en: "Mega fund", th: "กองทุนขนาดใหญ่", zh: "大型基金" })}</div>
          </div>
          <div className="partnerships-summary-card">
            <div className="partnerships-summary-value">4</div>
            <div className="partnerships-summary-label">{t(locale, { en: "Delivery states", th: "สถานะการส่งมอบ", zh: "交付状态" })}</div>
          </div>
        </div>
      </section>

      {/* ─── VISUAL PARTNER CARDS (replaces text wall) ─── */}
      <section className="section partnerships-section-gap">
        <p className="eyebrow">{t(locale, { en: "Country by country", th: "ประเทศต่อประเทศ", zh: "逐个国家" })}</p>
        <h2>{t(locale, { en: "What they brought, what stuck, what didn't", th: "อะไรที่นำมา อะไรที่ติด อะไรที่ไม่", zh: "他们带来了什么，什么留下了，什么没有" })}</h2>

        <div className="partner-visual-grid">
          {partnerships.map(p => (
            <article key={p.id} className="partner-visual-card" style={{ "--card-accent": p.accent } as React.CSSProperties}>
              <div className="partner-visual-head">
                <span className="partner-visual-flag">{p.flag}</span>
                <div className="partner-visual-title-group">
                  <h3 className="partner-visual-title">{t(locale, p.country)}</h3>
                  <p className="partner-visual-meta">{p.program} · {p.year}</p>
                </div>
                <span className={`partner-visual-status partner-visual-status-${p.status}`}>
                  {t(locale, statusLabels[p.status])}
                </span>
              </div>

              <p className="partner-visual-vibe" style={{ color: p.accent }}>{t(locale, p.vibe)}</p>

              <div className="partner-visual-facts">
                <div className="partner-visual-fact">
                  <span className="partner-visual-fact-value">{p.investment}</span>
                  <span className="partner-visual-fact-label">{t(locale, { en: "Investment", th: "ลงทุน", zh: "投资" })}</span>
                </div>
                <div className="partner-visual-fact">
                  <span className="partner-visual-fact-value">{p.cities.split(", ").length}</span>
                  <span className="partner-visual-fact-label">{t(locale, { en: "Cities", th: "เมือง", zh: "城市" })}</span>
                </div>
                <div className="partner-visual-fact">
                  <span className="partner-visual-fact-value">{t(locale, p.focus)}</span>
                  <span className="partner-visual-fact-label">{t(locale, { en: "Focus", th: "โฟกัส", zh: "重点" })}</span>
                </div>
              </div>

              <p className="partner-visual-body">{t(locale, p.body)}</p>

              <div className="partner-visual-lesson">
                <p className="partner-visual-lesson-label">{t(locale, { en: "Strategic Lesson", th: "บทเรียนเชิงกลยุทธ์", zh: "战略启示" })}</p>
                <p className="partner-visual-lesson-text">{t(locale, p.lesson)}</p>
              </div>

              <div className="partner-visual-footer">
                <a href={p.sourceUrl} target="_blank" rel="noopener noreferrer" className="partner-visual-link">
                  {p.sourceLabel} →
                </a>
                {p.action && (
                  <button
                    type="button"
                    className="partner-visual-link"
                    onClick={() => onNavigate(p.action!.path)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    {t(locale, p.action.label)} →
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ─── GLOBE MAP (full partner network) ─── */}
      <section className="section partnerships-section-gap">
        <p className="eyebrow">{t(locale, { en: "Global network", th: "เครือข่ายโลก", zh: "全球网络" })}</p>
        <h2>{t(locale, { en: "50+ organizations across 15+ countries", th: "องค์กร 50+ แห่งใน 15+ ประเทศ", zh: "50 多个组织，遍布 15 多个国家" })}</h2>
        <Suspense fallback={<div className="loading" style={{ minHeight: "300px" }}>Loading map…</div>}>
          <GlobeMap locale={locale} />
        </Suspense>
      </section>

      {/* ─── BUILT BY THIS TEAM ─── */}
      <section className="section partnerships-section-gap">
        <p className="eyebrow">{t(locale, { en: "Built by this team", th: "ทีมนี้สร้าง", zh: "本团队构建" })}</p>
        <h2>{t(locale, { en: "Open tools we shipped for the network", th: "เครืื่องมือเปิดที่เราส่งมอบให้เครือข่าย", zh: "我们为网络交付的开放工具" })}</h2>
        <div className="partnerships-showcase-grid">
          <a href="https://nonarkara.github.io/ascn-smart-cities-network/" target="_blank" rel="noopener noreferrer" className="partnerships-showcase-card">
            <span className="partnerships-showcase-badge">ASCN</span>
            <h3>{t(locale, { en: "ASEAN Smart Cities Network Dashboard", th: "แดชบอร์ด ASEAN Smart Cities Network", zh: "东盟智慧城市网络仪表板" })}</h3>
            <p>{t(locale, {
              en: "Interactive dashboard of all 26 ASCN pilot cities across 10 ASEAN member states. Built pro bono because the network needed it and no one else was making it.",
              th: "แดชบอร์ดโต้ตอบของ 26 เมืองนำร่อง ASCN ใน 10 ประเทศอาเซียน สร้างให้ฟรีเพราะเครือข่ายต้องการ",
              zh: "26个ASCN试点城市的交互式仪表板，覆盖10个东盟成员国。义务建设，因为网络需要而没人做。",
            })}</p>
            <span className="partnerships-showcase-link">{t(locale, { en: "Open dashboard", th: "เปิดแดชบอร์ด", zh: "打开仪表板" })} →</span>
          </a>
          <a href="https://nonarkara.github.io/scl-landing-page/" target="_blank" rel="noopener noreferrer" className="partnerships-showcase-card">
            <span className="partnerships-showcase-badge">SCL</span>
            <h3>{t(locale, { en: "Smart City Leadership Programme", th: "โครงการ Smart City Leadership", zh: "智慧城市领导力项目" })}</h3>
            <p>{t(locale, {
              en: "The training engine behind Thailand's cultural shift from tech-shopping to citizen-value. Co-developed by Dr. Passakon, Dr. Supakorn, and Dr. Non over years of iteration.",
              th: "เครื่องยนต์ฝึกอบรมที่อยู่เบื้องหลังการเปลี่ยนผ่านจากการซื้อเทคโนโลยีสู่คุณค่าพลเมือง",
              zh: "推动泰国从技术采购到公民价值文化转型的培训引擎。由Passakon博士、Supakorn博士和Non博士历经多年迭代共同开发。",
            })}</p>
            <span className="partnerships-showcase-link">{t(locale, { en: "Open SCL", th: "เปิด SCL", zh: "打开SCL" })} →</span>
          </a>
        </div>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="section partnerships-section-gap">
        <p className="eyebrow">{t(locale, { en: "Project timeline", th: "ไทม์ไลน์โครงการ", zh: "项目时间线" })}</p>
        <h2>{t(locale, { en: "Every collaboration, every year", th: "ทุกความร่วมมือ ทุกปี", zh: "每项合作，每一年" })}</h2>
        <div className="partner-timeline">
          {TIMELINE.map((item, i) => (
            <div key={i} className="partner-tl-row">
              <span className="partner-tl-year">{item.year}</span>
              <span className="partner-tl-flag">{item.flag}</span>
              <span className="partner-tl-project">{t(locale, item.project)}</span>
              <span className="partner-tl-country">{t(locale, item.country)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CLOSING ─── */}
      <section className="section partnerships-closing-section">
        <div className="callout-card story-closing-card">
          <h2>{t(locale, {
            en: "The useful question is not who signed what. It is what stuck.",
            th: "คำถามที่มีประโยชน์ไม่ใช่ใครเซ็นอะไร แต่คืออะไรที่ติดค้างอยู่ในระบบจริง",
            zh: "真正有用的问题不是谁签了什么，而是什么真正留在了系统里。",
          })}</h2>
          <p>
            {t(locale, {
              en: "Japan and the UK show the clearest programme architecture. The U.S. contribution is narrower but technically concrete. South Korea shows how good planning can still hit execution walls. Austria is a reminder that a smart-city MOU is not the same thing as delivery. China demonstrates what full-stack implementation looks like at speed. New Zealand shows that quiet civic-tech compounds. The Solomon Islands engagement tests whether Thailand's methodology travels. Russia and the BRICS forums confirm that smart city knowledge is not geopolitically neutral — and Thailand's position in both worlds is itself a strategic asset.",
              th: "ญี่ปุ่นกับสหราชอาณาจักรให้ภาพสถาปัตยกรรมโปรแกรมชัดที่สุด สหรัฐฯ แคบกว่าแต่เฉพาะทางกว่า เกาหลีใต้แสดงว่าวางแผนดีแค่ไหนก็ชนกำแพงได้ ออสเตรียเตือนว่า MOU ไม่ใช่การส่งมอบ จีนแสดง full-stack ที่ความเร็ว นิวซีแลนด์แสดงว่า civic-tech ที่เงียบสะสมได้ หมู่เกาะโซโลมอนทดสอบว่าระเบียบวิธีของไทยเดินทางได้หรือเปล่า รัสเซียและ BRICS ยืนยันว่าความรู้เมืองอัจฉริยะไม่ใช่กลางทางภูมิรัฐศาสตร์",
              zh: "日本与英国呈现最清晰的项目架构。美国贡献更窄但技术更具体。韩国说明好规划也会撞上执行墙。奥地利提醒MOU不等于交付。中国以速度展示全栈实施。新西兰证明安静的公民科技能积累成效。所罗门群岛参与检验了泰国方法论的可移植性。俄罗斯与金砖论坛确认了智慧城市知识并非地缘政治中立——而泰国在两个世界中的位置本身就是战略资产。",
            })}
          </p>
          <button type="button" className="cta-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, { en: "See the city rankings", th: "ดูอันดับเมือง", zh: "查看城市排名" })}
          </button>
        </div>
      </section>
    </>
  );
}
