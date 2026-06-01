import { useEffect, useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { summarizeCities } from "./cityCollections";
import { translate } from "./cityPresentation";
import type { Locale, SmartDimension } from "./types";
import { DIMENSION_LABELS } from "./types";
import { useInView } from "./useInView";
import { assetUrl } from "./assetUtils";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const DIMENSION_ICONS: Record<SmartDimension, string> = {
  economy: "📈", energy: "⚡", environment: "🌿",
  governance: "🏛️", living: "🏠", mobility: "🚌", people: "👥",
};

const DIMENSION_DESCS: Record<SmartDimension, { en: string; th: string; zh: string }> = {
  economy: { 
    en: "How can technology help improve the economy and manage resources more efficiently?", 
    th: "เทคโนโลยีช่วยปรับปรุงเศรษฐกิจและจัดการทรัพยากรให้มีประสิทธิภาพมากขึ้นได้อย่างไร?",
    zh: "技术如何帮助改善经济并更有效地管理资源？"
  },
  energy: { 
    en: "How can conserving non-renewable energy be balanced with producing clean alternatives?", 
    th: "การอนุรักษ์พลังงานที่ใช้แล้วหมดจะสมดุลกับการผลิตพลังงานสะอาดทดแทนได้อย่างไร?",
    zh: "如何平衡不可再生能源的保护与清洁替代能源的生产？"
  },
  environment: { 
    en: "How can the ecological quality of a sustainable urban environment be improved?", 
    th: "จะปรับปรุงคุณภาพเชิงนิเวศของสิ่งแวดล้อมเมืองที่ยั่งยืนได้อย่างไร?",
    zh: "如何改善可持续城市环境的生态质量？"
  },
  governance: { 
    en: "How can a digital system be designed where people benefit from open data and accountability?", 
    th: "จะออกแบบระบบดิจิทัลที่ประชาชนได้ประโยชน์จากข้อมูลเปิดและความโปร่งใสได้อย่างไร?",
    zh: "如何设计一个让人们从开放数据和问责制中受益的数字系统？"
  },
  living: { 
    en: "How can innovation improve quality of life, safety, and health for urban residents?", 
    th: "นวัตกรรมจะช่วยปรับปรุงคุณภาพชีวิต ความปลอดภัย และสุขภาพของผู้อยู่อาศัยในเมืองได้อย่างไร?",
    zh: "创新如何改善城市居民的生活质量、安全和健康？"
  },
  mobility: { 
    en: "How can technology solve traffic problems so people travel conveniently and sustainably?", 
    th: "เทคโนโลยีจะแก้ปัญหาจราจรเพื่อให้คนเดินทางสะดวกและยั่งยืนได้อย่างไร?",
    zh: "技术如何解决交通问题，让人们便捷、可持续地出行？"
  },
  people: { 
    en: "How can skills be developed to boost creativity, decrease inequality, and create more jobs?", 
    th: "จะพัฒนาทักษะเพื่อกระตุ้นความคิดสร้างสรรค์ ลดความเหลื่อมล้ำ และสร้างงานมากขึ้นได้อย่างไร?",
    zh: "如何培养技能以激发创造力、减少不平等并创造更多就业机会？"
  },
};

const CERT_STEPS = [
  { 
    en: "Submit", th: "ยื่นเอกสาร", zh: "提交材料",
    desc: { 
      en: "Send the smart city proposal to the Smart City Thailand Office, hosted by depa.", 
      th: "ยื่นข้อเสนอแผนพัฒนาเมืองอัจฉริยะต่อสำนักงานเมืองอัจฉริยะประเทศไทย ซึ่งอยู่ภายใต้ depa",
      zh: "向设于 depa 的泰国智慧城市办公室提交智慧城市发展提案。"
    } 
  },
  { 
    en: "Screen", th: "คัดกรอง", zh: "筛选",
    desc: { 
      en: "SCTO checks eligibility, consults with the city, and prepares the proposal for promotion-zone consideration.", 
      th: "สำนักงานฯ ตรวจสอบคุณสมบัติ ให้คำปรึกษา และเตรียมข้อเสนอเพื่อเข้าสู่การพิจารณาเป็นเขตส่งเสริมเมืองอัจฉริยะ",
      zh: "办公室核验资格、提供咨询，并协助城市进入智慧城市推广区审议。"
    } 
  },
  { 
    en: "Improve", th: "ปรับข้อเสนอ", zh: "完善提案",
    desc: { 
      en: "The city revises its plan so the area, infrastructure, data platform, services, budget, KPIs, and management model line up.", 
      th: "เมืองปรับแผนให้พื้นที่ โครงสร้างพื้นฐาน แพลตฟอร์มข้อมูล บริการ งบประมาณ ตัวชี้วัด และรูปแบบบริหารจัดการสอดคล้องกัน",
      zh: "城市完善方案，使范围、基础设施、数据平台、服务、预算、指标和治理模式相互一致。"
    } 
  },
  { 
    en: "Review", th: "พิจารณา", zh: "评审",
    desc: { 
      en: "Screening committees and subcommittees evaluate the proposal, give suggestions, and send qualified cities to national approval.", 
      th: "คณะคัดกรองและคณะอนุกรรมการประเมินข้อเสนอ ให้ข้อเสนอแนะ และส่งเมืองที่ผ่านเกณฑ์เข้าสู่การอนุมัติระดับชาติ",
      zh: "筛选委员会和小组委员会评估提案、提出建议，并将符合条件的城市送交国家层面批准。"
    } 
  },
  {
    en: "Approve",
    th: "อนุมัติ",
    zh: "批准",
    desc: {
      en: "The national digital-economy committees consider the city and announce the approved smart city status.",
      th: "คณะกรรมการระดับชาติดิจิทัลฯ พิจารณาและประกาศผลเมืองที่ได้รับสถานะเมืองอัจฉริยะ",
      zh: "国家数字经济相关委员会审议城市，并公布获批的智慧城市名单。"
    }
  },
  {
    en: "Award + follow up",
    th: "มอบตรา + ติดตามผล",
    zh: "授标与跟踪",
    desc: {
      en: "The city receives the Smart City Thailand logo, then enters monitoring, evaluation, and a two-year follow-up cycle.",
      th: "เมืองได้รับตราสัญลักษณ์ Smart City Thailand จากนั้นเข้าสู่การติดตาม ประเมินผล และติดตามต่อเนื่อง 2 ปี",
      zh: "城市获得泰国智慧城市标识，并进入监测、评估和两年跟踪周期。"
    }
  },
];

const SMART_CITY_GUIDELINE_PDF = "/downloads/smart-city-local-proposal-guideline-scl6-2026.pdf";
const DIGITAL_CATALOG_PDF = "/downloads/thailand-digital-catalog-scl6-2026.pdf";
const DIGITAL_CATALOG_OFFICIAL_URL = "https://www.depa.or.th/th/thailanddigitalcatalog/about";
const TECHHUNT_URL = "https://techhunt.depa.or.th/";

const LOGO_PROPOSAL_REQUIREMENTS = [
  {
    title: { en: "Target area", th: "พื้นที่เป้าหมาย", zh: "目标区域" },
    body: {
      en: "Define the boundary, vision, objectives, city type, ownership, population or user base, and citizen participation.",
      th: "กำหนดขอบเขต วิสัยทัศน์ วัตถุประสงค์ ประเภทเมือง ความเป็นเจ้าของพื้นที่ จำนวนประชากรหรือผู้ใช้งาน และการมีส่วนร่วมของประชาชน",
      zh: "明确边界、愿景、目标、城市类型、土地或区域权属、人口或使用者规模，以及公众参与。",
    },
  },
  {
    title: { en: "Physical + digital infrastructure", th: "โครงสร้างพื้นฐานกายภาพ + ดิจิทัล", zh: "实体与数字基础设施" },
    body: {
      en: "Show infrastructure plans, investment model, budget, funding sources, and implementation method.",
      th: "แสดงแผนโครงสร้างพื้นฐาน รูปแบบการลงทุน งบประมาณ แหล่งทุน และวิธีดำเนินการ",
      zh: "说明基础设施计划、投资模式、预算、资金来源和实施方式。",
    },
  },
  {
    title: { en: "City Data Platform", th: "แพลตฟอร์มข้อมูลเมือง", zh: "城市数据平台" },
    body: {
      en: "Describe data catalog, data exchange, governance, cybersecurity, privacy, and how data will support decisions.",
      th: "อธิบาย Data Catalog, Data Exchange, Data Governance ความมั่นคงปลอดภัยไซเบอร์ ความเป็นส่วนตัว และการใช้ข้อมูลเพื่อการตัดสินใจ",
      zh: "说明数据目录、数据交换、数据治理、网络安全、隐私保护，以及数据如何支持决策。",
    },
  },
  {
    title: { en: "Smart services", th: "บริการเมืองอัจฉริยะ", zh: "智慧服务" },
    body: {
      en: "Provide at least two smart-city service dimensions. Smart Environment is mandatory, and each dimension needs goals, projects, and KPIs.",
      th: "มีบริการเมืองอัจฉริยะอย่างน้อย 2 ด้าน โดย Smart Environment เป็นด้านบังคับ และแต่ละด้านต้องมีเป้าหมาย โครงการ และตัวชี้วัด",
      zh: "至少提出两个智慧服务维度，其中智慧环境为必选项；每个维度都需有目标、项目和指标。",
    },
  },
  {
    title: { en: "Sustainable management", th: "การบริหารจัดการอย่างยั่งยืน", zh: "可持续治理" },
    body: {
      en: "Name responsible agencies, partnerships, operating model, budget discipline, and reporting mechanism after approval.",
      th: "ระบุหน่วยงานรับผิดชอบ หุ้นส่วน รูปแบบการดำเนินงาน วินัยงบประมาณ และกลไกรายงานผลหลังได้รับการอนุมัติ",
      zh: "列明负责机构、合作伙伴、运营模式、预算纪律，以及获批后的报告机制。",
    },
  },
];

const DIGITAL_CATALOG_CARDS = [
  {
    title: { en: "What it is", th: "คืออะไร", zh: "它是什么" },
    body: {
      en: "Thailand Digital Catalog is depa's vetted registry of Thai digital products and services. It turns qualified software, SaaS, cloud, smart-device, hardware/firmware, and digital-content providers into discoverable options for public and private buyers.",
      th: "Thailand Digital Catalog คือบัญชีบริการดิจิทัลที่ depa ตรวจสอบและรับรอง เพื่อให้สินค้าและบริการดิจิทัลไทย ทั้งซอฟต์แวร์ SaaS คลาวด์ อุปกรณ์อัจฉริยะ ฮาร์ดแวร์/เฟิร์มแวร์ และดิจิทัลคอนเทนต์ ถูกค้นหาและเลือกใช้ได้ง่ายทั้งในตลาดภาครัฐและเอกชน",
      zh: "Thailand Digital Catalog 是 depa 审核认证的泰国数字产品与服务名录，让合格的软件、SaaS、云服务、智能设备、硬件/固件和数字内容供应商更容易被政府和企业采购方发现。",
    },
  },
  {
    title: { en: "Why cities should care", th: "ทำไมเมืองควรสนใจ", zh: "城市为什么需要它" },
    body: {
      en: "For cities, it shortens the path from plan to deployment. A municipality looking for e-office, queue, complaint, health, carbon, data, or smart-city services can start from a vetted pool instead of writing every solution from scratch.",
      th: "สำหรับเมือง เครื่องมือนี้ช่วยย่นระยะจากแผนสู่การใช้งานจริง เทศบาลที่ต้องการ e-office ระบบคิว รับเรื่องร้องเรียน สุขภาพ คาร์บอน ข้อมูล หรือบริการเมืองอัจฉริยะ สามารถเริ่มจากกลุ่มผู้ให้บริการที่ผ่านการตรวจสอบแล้ว แทนที่จะต้องออกแบบทุกอย่างใหม่เอง",
      zh: "对城市而言，它缩短了从计划到落地的路径。需要电子办公、排队、投诉、健康、碳管理、数据或智慧城市服务的地方政府，可先从已审核的供应商池中选择，而不必从零设计每个方案。",
    },
  },
  {
    title: { en: "Market gateway", th: "ประตูสู่ตลาด", zh: "市场入口" },
    body: {
      en: "The Catalog links Thai digital providers to special public procurement, TECHHUNT discovery, private-sector adoption, Tax200%, BOI measures, depa Transformation Fund, mini Transformation Voucher, and Local Government Transformation Cloud.",
      th: "บัญชีนี้เชื่อมผู้ประกอบการดิจิทัลไทยเข้ากับการจัดซื้อจัดจ้างภาครัฐแบบพิเศษ การค้นหาผ่าน TECHHUNT การใช้งานในภาคเอกชน มาตรการ Tax200% มาตรการ BOI กองทุน Transformation Fund, mini Transformation Voucher และ Local Government Transformation Cloud",
      zh: "该名录把泰国数字服务商连接到政府特殊采购、TECHHUNT 搜索、私营部门采用、Tax200%、BOI 措施、depa Transformation Fund、mini Transformation Voucher 以及 Local Government Transformation Cloud。",
    },
  },
  {
    title: { en: "How to register", th: "ขึ้นทะเบียนอย่างไร", zh: "如何登记" },
    body: {
      en: "A provider needs a Thai legal entity, a relevant digital business scope, quality certification or accepted standards, product details, price, functions, images, sales channel, warranty/service process, real-use evidence, and development-process documents.",
      th: "ผู้ให้บริการต้องเป็นนิติบุคคลไทย มีวัตถุประสงค์ธุรกิจดิจิทัลที่เกี่ยวข้อง มีมาตรฐานหรือการรับรองคุณภาพ รายละเอียดสินค้า ราคา ฟังก์ชัน รูปภาพ ช่องทางจำหน่าย ขั้นตอนรับประกัน/บริการ หลักฐานการใช้งานจริง และเอกสารกระบวนการพัฒนาผลิตภัณฑ์",
      zh: "供应商需为泰国法人，经营范围与数字业务相关，并准备质量认证或认可标准、产品详情、价格、功能、图片、销售渠道、保修/服务流程、真实使用证明和开发流程文件。",
    },
  },
];

const DIGITAL_CATALOG_USE_CASES = [
  {
    en: "Public-facing services",
    th: "บริการประชาชน",
    zh: "面向公众的服务",
    detail: { en: "e-ticket, queue, complaint, local service, health, environmental and carbon systems", th: "e-ticket ระบบคิว รับเรื่องร้องเรียน บริการท้องถิ่น สุขภาพ สิ่งแวดล้อม และคาร์บอน", zh: "电子票务、排队、投诉、地方服务、健康、环境与碳管理系统" },
  },
  {
    en: "Internal government work",
    th: "งานภายในหน่วยงานรัฐ",
    zh: "政府内部工作",
    detail: { en: "e-office, ERP, HR, payroll, accounting, document flow and cloud-based collaboration", th: "e-office, ERP, HR, เงินเดือน บัญชี งานสารบรรณ และการทำงานร่วมกันบนคลาวด์", zh: "电子办公、ERP、人事、薪资、会计、公文流转与云端协作" },
  },
  {
    en: "Local smart-city foundation",
    th: "ฐานเมืองอัจฉริยะท้องถิ่น",
    zh: "地方智慧城市基础",
    detail: { en: "city data, cloud, sensors, smart environment, smart governance and smart living services", th: "ข้อมูลเมือง คลาวด์ เซนเซอร์ สิ่งแวดล้อมอัจฉริยะ การบริหารภาครัฐอัจฉริยะ และบริการคุณภาพชีวิต", zh: "城市数据、云、传感器、智慧环境、智慧治理与智慧生活服务" },
  },
];

const MEASURE_ROWS: {
  dim: SmartDimension;
  def: { en: string; th: string; zh: string };
  targets: { en: string; th: string; zh: string };
}[] = [
  {
    dim: "environment",
    def: { en: "Ecological quality of the urban environment", th: "คุณภาพเชิงนิเวศของสภาพแวดล้อมเมือง", zh: "城市环境的生态质量" },
    targets: { en: "Green space ≥10 m²/resident · wastewater systems >50% HH · disaster adaptation plans", th: "พื้นที่สีเขียว ≥10 ตร.ม./คน · ระบบน้ำเสียครอบคลุม >50% ครัวเรือน · มีแผนรับมือภัยพิบัติ", zh: "人均绿地 ≥10㎡ · 污水系统覆盖 >50%住户 · 制定灾害适应计划" },
  },
  {
    dim: "governance",
    def: { en: "Open data, accountability, and participatory budgeting", th: "ข้อมูลเปิด ความรับผิดชอบ และงบประมาณแบบมีส่วนร่วม", zh: "开放数据、问责制与参与式预算" },
    targets: { en: "Open Gov Data portal · one-stop service · external auditors · participatory Action Plan", th: "พอร์ทัลข้อมูลเปิด · บริการ one-stop · ผู้ตรวจสอบภายนอก · แผนงบประมาณมีส่วนร่วม", zh: "开放政府数据门户 · 一站式服务 · 外部审计员 · 参与式行动计划" },
  },
  {
    dim: "mobility",
    def: { en: "Convenient, safe, and sustainable urban movement", th: "การเดินทางในเมืองที่สะดวก ปลอดภัย และยั่งยืน", zh: "便捷、安全、可持续的城市出行" },
    targets: { en: "Transit ≤500m from all residences · cashless 100% · CCTV all vehicles/stations · drills ≥1/yr", th: "ขนส่งห่างที่พักไม่เกิน 500 ม. · ไร้เงินสด 100% · CCTV ทุกยานพาหนะ/สถานี · ซ้อมภัย ≥1 ครั้ง/ปี", zh: "公交距所有住宅 ≤500米 · 无现金100% · 所有车辆/站点安装监控 · 演练 ≥1次/年" },
  },
  {
    dim: "energy",
    def: { en: "Clean energy production, efficiency, and storage", th: "การผลิตพลังงานสะอาด ประสิทธิภาพ และการสะสมพลังงาน", zh: "清洁能源生产、效率与储能" },
    targets: { en: "Renewable ≥50% · Smart Meters 100% · GHG −40% BAU · AEMS ≥80% coverage", th: "พลังงานหมุนเวียน ≥50% · มิเตอร์อัจฉริยะ 100% · GHG −40% จากกรณีฐาน · AEMS ≥80%", zh: "可再生能源 ≥50% · 智能电表100% · 温室气体较基准 −40% · AEMS覆盖 ≥80%" },
  },
  {
    dim: "people",
    def: { en: "Digital skills, lifelong learning, and creative capacity", th: "ทักษะดิจิทัล การเรียนรู้ตลอดชีวิต และความสามารถสร้างสรรค์", zh: "数字技能、终身学习与创意能力" },
    targets: { en: "Digital literacy programs · STEM labs · creative hubs · SME upskilling · YSEALI-type programs", th: "โปรแกรมความรู้ดิจิทัล · ห้อง STEM · Creative Hub · พัฒนาทักษะ SME · โปรแกรมแบบ YSEALI", zh: "数字素养项目 · STEM实验室 · 创意中心 · 中小企业技能提升 · YSEALI类项目" },
  },
  {
    dim: "living",
    def: { en: "Quality of life, health, safety, and social support", th: "คุณภาพชีวิต สุขภาพ ความปลอดภัย และการสนับสนุนทางสังคม", zh: "生活质量、健康、安全与社会支持" },
    targets: { en: "Preventive health platform · child care + elderly day care · community health volunteers · disaster drills ≥1/yr", th: "แพลตฟอร์มสุขภาพเชิงป้องกัน · ศูนย์เด็กเล็ก + ดูแลผู้สูงอายุ · อสม. · ซ้อมภัย ≥1 ครั้ง/ปี", zh: "预防性健康平台 · 儿童托育+老年日托 · 社区健康志愿者 · 应急演练 ≥1次/年" },
  },
  {
    dim: "economy",
    def: { en: "Business ecosystem, digital commerce, and innovation capacity", th: "ระบบนิเวศธุรกิจ การค้าดิจิทัล และศักยภาพนวัตกรรม", zh: "商业生态系统、数字商务与创新能力" },
    targets: { en: "One-stop business registration · Big Data BCP infrastructure · incubation center + test bed · cashless adoption", th: "จดทะเบียนธุรกิจ one-stop · โครงสร้าง Big Data สำหรับ BCP · ศูนย์บ่มเพาะ + Test Bed · ยอมรับสังคมไร้เงินสด", zh: "一站式企业注册 · 业务连续性大数据基础设施 · 孵化中心+试验场 · 无现金社会采用" },
  },
];

const BATCHES = [
  { batch: 1, year: "2019", cities: 15, label: { en: "Pioneers", th: "ผู้บุกเบิก", zh: "先驱者" } },
  { batch: 2, year: "2021", cities: 15, label: { en: "Expansion", th: "ขยายผล", zh: "扩成果" } },
  { batch: 3, year: "2023", cities: 6, label: { en: "Consolidation", th: "รวมพลัง", zh: "凝力量" } },
  { batch: 4, year: "2025", cities: 1, label: { en: "Latest", th: "ล่าสุด", zh: "最新批次" } },
];

const PHOTOS_WORKSHOP = [
  "/photos/IMG_7504.JPG", "/photos/IMG_6654.JPG", "/photos/IMG_6692.JPG",
  "/photos/IMG_1382.JPG", "/photos/IMG_1447.JPG",
];
const PHOTOS_INTL = [
  "/Photos international/20260317092525-_DON6841.jpg",
  "/Photos international/20260317093438-_DON6939.jpg",
  "/Photos international/Z03A9727-opq3949327416.jpg",
  "/Photos international/JSCF2025-2495.jpg",
];

export default function ProgramPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const stats = useMemo(() => summarizeCities(cities), [cities]);
  const dimensions: SmartDimension[] = ["environment", "economy", "mobility", "energy", "people", "living", "governance"];

  const [dnaRef, dnaVisible] = useInView(0.1);
  const [mref257, visible257] = useInView(0.1);
  const [certRef, certVisible] = useInView(0.1);
  const [catalogRef, catalogVisible] = useInView(0.1);
  const [measureRef, measureVisible] = useInView(0.1);
  const [batchRef, batchVisible] = useInView(0.1);
  const [cdpRef, cdpVisible] = useInView(0.1);
  const [incentivesRef, incentivesVisible] = useInView(0.1);
  const [sourcesRef, sourcesVisible] = useInView(0.1);

  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    if (!id) return;
    const timeout = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ block: "start" });
    }, 120);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section rankings-hero reveal visible">
        <p className="eyebrow">{translate(locale, { 
          en: "depa \u00b7 MDES \u00b7 Kingdom of Thailand", 
          th: "depa · กระทรวง DE · ราชอาณาจักรไทย", 
          zh: "depa · MDES · 泰王国" 
        })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
          {translate(locale, { en: "Smart City Thailand", th: "เมืองอัจฉริยะประเทศไทย", zh: "泰国智慧城市" })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "A smart city is a process, not a result. No city reaches the status of a smart city by simply ticking boxes. Smart refers to the ability to comprehend, adapt, and transform — to cope with and improve the changing world. This is Thailand’s national framework for building cities where citizens come first and technology stays in the background.",
            th: "เมืองอัจฉริยะคือกระบวนการ ไม่ใช่ผลลัพธ์ ไม่มีความเป็นเมืองอัจฉริยะได้หากเพียงแค่การทำเครื่องหมายในช่องสี่เหลี่ยม คำว่า “อัจฉริยะ” หมายถึงความสามารถในการเข้าใจ ปรับตัว และเปลี่ยนแปลง เพื่อรับมือและพัฒนาโลกที่เปลี่ยนแปลงไป นี่คือกรอบกระบวนการระดับชาติของไทยในการสร้างเมืองที่ประชาชนมาก่อนและเทคโนโลยีอยู่เบื้องหลัง",
            zh: "智慧城市是一个过程，不是结果。没有城市可以通过简单的勾选而获得智慧城市地位。“智慧”是指理解、适应和转变的能力——以应对和改善变化的世界。这是泰国为建设以市民为中心、技术退居幕后的城市而制定的国家框架。"
          })}
        </p>
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <a href="https://www.smartcitythailand.or.th/" target="_blank" rel="noopener noreferrer" className="cta-button">
            {translate(locale, { en: "Official website", th: "เว็บไซต์ทางการ", zh: "官方网站" })} →
          </a>
          <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
            {translate(locale, { en: "View index rankings", th: "ดูอันดับดัชนี", zh: "查看排名" })}
          </button>
        </div>
      </section>

      {/* ─── THREE CONCEPTS ─── */}
      <section ref={dnaRef} className={`section reveal stagger-1 ${dnaVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Three concepts", th: "สามแนวคิดหลัก", zh: "三大概念" })}</p>
        <h2>{translate(locale, { en: "The DNA of Thai smart cities", th: "DNA ของเมืองอัจฉริยะไทย", zh: "泰国智慧城市的DNA" })}</h2>
        <div className="program-concepts-grid">
          <div className="program-concept-card">
            <span className="program-concept-num">1</span>
            <h3>{translate(locale, { en: "Citizens at the center, technology in the background", th: "ประชาชนอยู่ตรงกลาง เทคโนโลยีอยู่เบื้องหลัง", zh: "市民在中心，技术在幕后" })}</h3>
            <p>{translate(locale, {
              en: "Cities are for people. A smart city should not force residents to be hooked on smartphones 12 hours a day. Instead, it uses appropriate technology to enhance quality of life in the background — less travel time, worry-free healthcare, more spare time. The evidence of success lies in measurable outcomes, not hardware specs.",
              th: "เมืองมีไว้เพื่อคน เมืองอัจฉริยะไม่ควรบังคับให้ผู้อยู่อาศัยติดมือถือ 12 ชั่วโมงต่อวัน แต่ใช้เทคโนโลยีที่เหมาะสมเพื่อยกระดับคุณภาพชีวิตในเบื้องหลัง ทั้งเวลาเดินทางที่ลดลง การดูแลสุขภาพที่ไร้กังวล และเวลาว่างที่มากขึ้น หลักฐานความสำเร็จคือผลลัพธ์ที่วัดได้ ไม่ใช่สเปกฮาร์ดแวร์",
              zh: "城市是为人而存在的。智慧城市不应强迫居民每天盯着手机12小时。相反，它在幕后使用适当技术提升生活质量。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">2</span>
            <h3>{translate(locale, { en: "People-Public-Private-Partnership (PPPP)", th: "ความร่วมมือ ประชาชน-รัฐ-เอกชน (PPPP)", zh: "人民-政府-私营合作 (PPPP)" })}</h3>
            <p>{translate(locale, {
              en: "Not PPP but PPPP. The extra P is for People. Recent successes and failures of smart city projects worldwide show the crucial need to communicate with citizens and galvanize their support.",
              th: "ไม่ใช่ PPP แต่เป็น PPPP โดยตัว P ที่เพิ่มขึ้นคือประชาชน เพื่อให้เกิดการมีส่วนร่วมที่แท้จริง ไม่เช่นนั้นโครงการจะขาดความยั่งยืน",
              zh: "不是PPP而是PPPP。额外的P是人民。没有人民参与，建设的基础设施没人会用。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">3</span>
            <h3>{translate(locale, { en: "Simultaneous physical + digital development", th: "พัฒนากายภาพและดิจิทัลไปพร้อมกัน", zh: "物理+数字同步发展" })}</h3>
            <p>{translate(locale, {
              en: "Cities still consist of connected physical spaces. Digital platforms are meaningless if goods and services cannot physically reach people.",
              th: "เมืองยังคงประกอบด้วยพื้นที่ทางกายภาพ แพลตฟอร์มดิจิทัลไม่มีความหมายถ้าบริการไม่ถึงมือคนจริง และไม่ครอบคลุมทุกคน",
              zh: "城市仍由连接的物理空间组成。如果商品和服务无法实际到达人们身边，数字平台毫无意义。"
            })}</p>
          </div>
        </div>
        <p className="program-source">{translate(locale, {
          en: "Source: Hitachi Review Vol. 70, No. 1 (2021) — Smart City Initiatives in Thailand",
          th: "ที่มา: Hitachi Review Vol. 70, No. 1 (2021) — Smart City Initiatives in Thailand",
          zh: "来源: Hitachi Review Vol. 70, No. 1 (2021)"
        })}</p>
      </section>

      {/* ─── PHOTO STRIP: Workshops ─── */}
      <div className="photo-strip">
        {PHOTOS_WORKSHOP.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "220px", height: "140px" }}>
            <img src={assetUrl(p)} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── TWO-FIVE-SEVEN ─── */}
      <section ref={mref257} className={`section reveal stagger-2 ${visible257 ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Two-Five-Seven", th: "สอง-ห้า-เจ็ด", zh: "二-五-七" })}</p>
        <h2>{translate(locale, { en: "The mnemonic that drives the program", th: "สูตรที่ขับเคลื่อนโครงการ", zh: "驱动项目的口诀" })}</h2>
        <div className="program-257-grid">
          <div className="program-257-card">
            <span className="program-257-num">2</span>
            <h3>{translate(locale, { en: "Two types of smart cities", th: "สองประเภทเมืองอัจฉริยะ", zh: "两种智慧城市" })}</h3>
            <p><strong>{translate(locale, { en: "Smart Livable City", th: "เมืองอัจฉริยะน่าอยู่", zh: "智慧宜居城市" })}</strong> {translate(locale, { en: "— existing cities.", th: "— เมืองที่มีอยู่แล้ว", zh: "— 现有城市。" })}</p>
            <p><strong>{translate(locale, { en: "Smart New City", th: "เมืองอัจฉริยะใหม่", zh: "智慧新城" })}</strong> {translate(locale, { en: "— new developments.", th: "— พัฒนาพื้นที่ใหม่", zh: "— 新城开发。" })}</p>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">5</span>
            <h3>{translate(locale, { en: "Five criteria for development", th: "ห้าเกณฑ์การพัฒนา", zh: "五项发展标准" })}</h3>
            <ol className="program-criteria-list">
              <li>{translate(locale, { en: "Vision, goals, and geographic boundaries", th: "วิสัยทัศน์ เป้าหมาย และขอบเขตพื้นที่", zh: "愿景、目标和地理边界" })}</li>
              <li>{translate(locale, { en: "Infrastructure and investment plan", th: "แผนโครงสร้างพื้นฐานและการลงทุน", zh: "基础设施和投资计划" })}</li>
              <li>{translate(locale, { en: "City Data Platform (CDP) + cybersecurity", th: "แพลตฟอร์มข้อมูลเมือง (CDP) + ความปลอดภัยไซเบอร์", zh: "城市数据平台(CDP)+网络安全" })}</li>
              <li>{translate(locale, { en: "Urban systems and service projects", th: "ระบบเมืองและโครงการบริการ", zh: "城市系统和服务项目" })}</li>
              <li>{translate(locale, { en: "Management model and public participation", th: "รูปแบบการจัดการและการมีส่วนร่วม", zh: "管理模式和公众参与" })}</li>
            </ol>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">7</span>
            <h3>{translate(locale, { en: "Seven smart dimensions", th: "เจ็ดมิติอัจฉริยะ", zh: "七个智慧维度" })}</h3>
            <div className="program-dims-grid">
              {dimensions.map(d => (
                <div key={d} className="program-dim-card">
                  <span className="program-dim-icon">{DIMENSION_ICONS[d]}</span>
                  <h3 className="program-dim-name">{DIMENSION_LABELS[locale][d]}</h3>
                  <p className="program-dim-desc">{locale === "th" ? DIMENSION_DESCS[d].th : (locale === "zh" ? DIMENSION_DESCS[d].zh : DIMENSION_DESCS[d].en)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO STRIP: International ─── */}
      <div className="photo-strip">
        {PHOTOS_INTL.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "280px", height: "170px" }}>
            <img src={assetUrl(p)} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── CERTIFICATION PROCESS ─── */}
      <section id="smart-city-logo-guideline" ref={certRef} className={`section reveal stagger-3 ${certVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Process", th: "กระบวนการ", zh: "流程" })}</p>
        <h2>{translate(locale, { en: "How a city gets the logo", th: "เมืองได้ตราสัญลักษณ์อย่างไร", zh: "城市如何获得标识" })}</h2>
        <p className="program-section-intro">
          {translate(locale, {
            en: "The logo is not a design asset handed out at the start. It is the visible end of a public approval pathway: proposal, promotion-zone screening, committee review, national approval, award, and follow-up.",
            th: "ตราสัญลักษณ์ไม่ใช่ไฟล์ออกแบบที่มอบให้ตั้งแต่ต้น แต่เป็นผลปลายทางที่มองเห็นได้ของกระบวนการอนุมัติสาธารณะ ตั้งแต่การยื่นข้อเสนอ การคัดกรองเขตส่งเสริม การพิจารณาของคณะกรรมการ การอนุมัติระดับชาติ การมอบตรา และการติดตามผล",
            zh: "标识不是一开始就发放的设计素材，而是公共审批路径的可见结果：提交提案、推广区筛选、委员会评审、国家批准、授予标识，以及后续跟踪。",
          })}
        </p>
        <div className="program-cert-flow">
          {CERT_STEPS.map((step, i) => (
            <div key={i} className="program-cert-step">
              <span className="program-cert-number">{i + 1}</span>
              <h3 className="program-cert-label">{translate(locale, { en: step.en, th: step.th, zh: step.zh })}</h3>
              <p className="program-cert-desc">{translate(locale, { en: step.desc.en, th: step.desc.th, zh: step.desc.zh })}</p>
              {i < CERT_STEPS.length - 1 && <span className="program-cert-arrow">→</span>}
            </div>
          ))}
        </div>
        <div className="program-logo-guideline">
          <div className="program-logo-guideline-copy">
            <p className="eyebrow">{translate(locale, { en: "Proposal guideline", th: "คู่มือจัดทำข้อเสนอ", zh: "提案指南" })}</p>
            <h3>
              {translate(locale, {
                en: "What the proposal must make clear",
                th: "ข้อเสนอควรทำให้ชัดเจนเรื่องใด",
                zh: "提案必须讲清楚什么",
              })}
            </h3>
            <p>
              {translate(locale, {
                en: "The SCL6 guideline frames a smart city plan around five practical tests: a defined area, infrastructure, data foundation, services, and a sustainable management model. The aim is not paperwork for its own sake, but a plan that can be evaluated, implemented, monitored, and improved.",
                th: "คู่มือ SCL6 วางกรอบแผนเมืองอัจฉริยะผ่านการตรวจสอบเชิงปฏิบัติ 5 เรื่อง ได้แก่ พื้นที่ โครงสร้างพื้นฐาน ฐานข้อมูล บริการ และรูปแบบบริหารจัดการที่ยั่งยืน เป้าหมายไม่ใช่เอกสารเพื่อให้ครบขั้นตอน แต่คือแผนที่ประเมินได้ ทำได้จริง ติดตามได้ และปรับปรุงได้",
                zh: "SCL6 指南把智慧城市计划归纳为五项实际检验：明确区域、基础设施、数据基础、城市服务，以及可持续治理模式。重点不是为了完成文件，而是形成可评估、可实施、可监测、可改进的计划。",
              })}
            </p>
            <div className="program-guideline-actions">
              <a
                href={assetUrl(SMART_CITY_GUIDELINE_PDF)}
                download
                className="cta-button"
              >
                {translate(locale, { en: "Download guideline PDF", th: "ดาวน์โหลดคู่มือ PDF", zh: "下载指南 PDF" })}
              </a>
              <span className="program-guideline-file">
                {translate(locale, {
                  en: "Smart City Plan proposal guideline · SCL6 · 26 May 2026 · PDF 8.4 MB",
                  th: "คู่มือการเขียนแผนพัฒนาเมืองอัจฉริยะ · SCL6 · 26 พฤษภาคม 2569 · PDF 8.4 MB",
                  zh: "智慧城市计划提案指南 · SCL6 · 2026年5月26日 · PDF 8.4 MB",
                })}
              </span>
            </div>
          </div>
          <div className="program-logo-requirements">
            {LOGO_PROPOSAL_REQUIREMENTS.map((item, i) => (
              <div key={i} className="program-logo-requirement">
                <span className="program-logo-requirement-num">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h4>{translate(locale, item.title)}</h4>
                  <p>{translate(locale, item.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="program-source" style={{ marginTop: "1rem" }}>
          {translate(locale, {
            en: "Source: Smart City Plan proposal guideline, Smart City Developer Course SCL6, 26 May 2026, depa Smart City Promotion Department.",
            th: "ที่มา: คู่มือการเขียนแผนพัฒนาเมืองอัจฉริยะ หลักสูตรนักพัฒนาเมืองรุ่นที่ 6 วันที่ 26 พฤษภาคม 2569 ฝ่ายส่งเสริมเมืองอัจฉริยะ depa",
            zh: "来源：智慧城市计划提案指南，智慧城市开发者课程 SCL6，2026年5月26日，depa 智慧城市促进部门。",
          })}
        </p>
      </section>

      {/* ─── THAILAND DIGITAL CATALOG ─── */}
      <section id="thailand-digital-catalog" ref={catalogRef} className={`section reveal stagger-3 ${catalogVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Procurement gateway", th: "ประตูสู่การจัดซื้อจัดจ้าง", zh: "采购入口" })}</p>
        <h2>{translate(locale, { en: "Thailand Digital Catalog", th: "บัญชีบริการดิจิทัล", zh: "泰国数字服务名录" })}</h2>
        <p className="program-section-intro">
          {translate(locale, {
            en: "The Catalog is the bridge between smart-city plans and real Thai digital solutions. It helps cities find vetted providers, helps Thai digital companies reach government and private buyers, and gives procurement teams a cleaner route to services that already passed depa screening.",
            th: "บัญชีบริการดิจิทัลคือสะพานระหว่างแผนเมืองอัจฉริยะกับโซลูชันดิจิทัลไทยที่ใช้งานได้จริง ช่วยให้เมืองพบผู้ให้บริการที่ผ่านการตรวจสอบ ช่วยผู้ประกอบการไทยเข้าถึงผู้ซื้อภาครัฐและเอกชน และช่วยฝ่ายจัดซื้อมีเส้นทางที่ชัดเจนขึ้นในการเลือกบริการที่ผ่านการคัดกรองโดย depa แล้ว",
            zh: "该名录连接智慧城市计划与可落地的泰国数字解决方案。它帮助城市找到已审核的供应商，帮助泰国数字企业接触政府和企业买方，也让采购团队更清晰地选择已通过 depa 筛选的服务。",
          })}
        </p>

        <div className="program-catalog-panel">
          <div className="program-catalog-summary">
            {DIGITAL_CATALOG_CARDS.map((card, i) => (
              <article key={i} className="program-catalog-card">
                <span className="program-logo-requirement-num">{String(i + 1).padStart(2, "0")}</span>
                <h3>{translate(locale, card.title)}</h3>
                <p>{translate(locale, card.body)}</p>
              </article>
            ))}
          </div>

          <aside className="program-catalog-download">
            <p className="eyebrow">{translate(locale, { en: "SCL6 deck", th: "เอกสาร SCL6", zh: "SCL6 讲义" })}</p>
            <h3>
              {translate(locale, {
                en: "Digital Catalog, in practice",
                th: "บัญชีบริการดิจิทัลในทางปฏิบัติ",
                zh: "数字服务名录的实际用法",
              })}
            </h3>
            <p>
              {translate(locale, {
                en: "The PDF explains the incentive stack, procurement route, Local Government Transformation Cloud, product categories, use cases, and registration evidence for Thai digital providers.",
                th: "PDF นี้อธิบายชุดสิทธิประโยชน์ เส้นทางจัดซื้อจัดจ้าง Local Government Transformation Cloud กลุ่มสินค้า กรณีใช้งานจริง และหลักฐานที่ผู้ประกอบการดิจิทัลไทยต้องใช้ในการขึ้นทะเบียน",
                zh: "该 PDF 说明激励组合、采购路径、Local Government Transformation Cloud、产品类别、实际案例，以及泰国数字供应商登记所需证据。",
              })}
            </p>
            <div className="program-guideline-actions">
              <a href={assetUrl(DIGITAL_CATALOG_PDF)} download className="cta-button">
                {translate(locale, { en: "Download Digital Catalog PDF", th: "ดาวน์โหลด PDF บัญชีบริการดิจิทัล", zh: "下载数字服务名录 PDF" })}
              </a>
              <a href={DIGITAL_CATALOG_OFFICIAL_URL} target="_blank" rel="noopener noreferrer" className="ghost-button">
                {translate(locale, { en: "Official depa page", th: "หน้า depa ทางการ", zh: "depa 官方页面" })}
              </a>
              <a href={TECHHUNT_URL} target="_blank" rel="noopener noreferrer" className="ghost-button">
                TECHHUNT
              </a>
            </div>
            <span className="program-guideline-file">
              {translate(locale, {
                en: "Thailand Digital Catalog · SCL6 · PDF 25 MB",
                th: "Thailand Digital Catalog · SCL6 · PDF 25 MB",
                zh: "Thailand Digital Catalog · SCL6 · PDF 25 MB",
              })}
            </span>
          </aside>
        </div>

        <div className="program-catalog-usecases">
          {DIGITAL_CATALOG_USE_CASES.map(item => (
            <div key={item.en} className="program-catalog-usecase">
              <h3>{translate(locale, { en: item.en, th: item.th, zh: item.zh })}</h3>
              <p>{translate(locale, item.detail)}</p>
            </div>
          ))}
        </div>

        <p className="program-source" style={{ marginTop: "1rem" }}>
          {translate(locale, {
            en: "Sources: Thailand Digital Catalog SCL6 deck; depa Thailand Digital Catalog page; depa articles on 6 May 2026, 10 March 2026, and 18 November 2024.",
            th: "ที่มา: เอกสาร Thailand Digital Catalog SCL6; หน้า Thailand Digital Catalog ของ depa; ข่าว depa วันที่ 6 พฤษภาคม 2569, 10 มีนาคม 2569 และ 18 พฤศจิกายน 2567",
            zh: "来源：Thailand Digital Catalog SCL6 讲义；depa Thailand Digital Catalog 页面；depa 2026年5月6日、2026年3月10日与2024年11月18日新闻。",
          })}
        </p>
      </section>

      {/* ─── MEASUREMENT FRAMEWORK ─── */}
      <section ref={measureRef} className={`section reveal stagger-4 ${measureVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Measurement Framework", th: "กรอบการวัดผล", zh: "测量框架" })}</p>
        <h2>{translate(locale, { en: "What the evaluation committee actually checks", th: "สิ่งที่คณะกรรมการประเมินตรวจสอบจริงๆ", zh: "评估委员会实际审查的内容" })}</h2>
        <p style={{ maxWidth: "680px", marginBottom: "1.5rem" }}>
          {translate(locale, {
            en: "Every city that applies for Smart City Local status faces a technical committee review across all 7 dimensions. These are the publicly available output/outcome indicators from the official depa measurement framework.",
            th: "ทุกเมืองที่สมัครสถานะ Smart City Local จะต้องผ่านการตรวจสอบจากคณะกรรมการเทคนิคใน 7 มิติ นี่คือตัวชี้วัดผลผลิต/ผลลัพธ์จากกรอบการวัดผลทางการของ depa ที่เปิดเผยต่อสาธารณะ",
            zh: "每个申请智慧城市地方认证的城市都将面临技术委员会对全部7个维度的评审。以下是depa官方测量框架中公开的产出/成果指标。",
          })}
        </p>
        <div className="program-indicator-list">
          {MEASURE_ROWS.map(row => (
            <div key={row.dim} className="program-indicator-row">
              <span className="program-indicator-dim-name">
                <span className="program-indicator-dot" style={{ background: `var(--dim-${row.dim}, var(--teal))` }} />
                {DIMENSION_LABELS[locale][row.dim]}
              </span>
              <span className="program-indicator-def">{translate(locale, row.def)}</span>
              <span className="program-indicator-targets">{translate(locale, row.targets)}</span>
            </div>
          ))}
        </div>
        <p className="program-source" style={{ marginTop: "1rem" }}>
          {translate(locale, {
            en: "Source: 7 Smart City Indicators, Smart City Thailand Office (depa)",
            th: "ที่มา: 7 ตัวชี้วัดเมืองอัจฉริยะ, สำนักงานเมืองอัจฉริยะประเทศไทย (depa)",
            zh: "来源：7项智慧城市指标，泰国智慧城市办公室（depa）",
          })}
        </p>
      </section>

      {/* ─── BATCH TIMELINE + KEY STATS ─── */}
      <section ref={batchRef} className={`section reveal stagger-4 ${batchVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Timeline", th: "ไทม์ไลน์", zh: "时间线" })}</p>
        <h2>{translate(locale, { en: "Four batches, eight years", th: "สี่รุ่น แปดปี", zh: "四批次，八年" })}</h2>
        <div className="program-batch-grid">
          {BATCHES.map(b => (
            <div key={b.batch} className="program-batch-card shadow-premium">
              <span className="program-batch-label">Batch {b.batch}</span>
              <span className="program-batch-year">{b.year}</span>
              <span className="program-batch-count">{b.cities} {translate(locale, { en: "cities", th: "เมือง", zh: "城市" })}</span>
              <span className="program-batch-tag">{translate(locale, { en: b.label.en, th: b.label.th, zh: b.label.zh })}</span>
            </div>
          ))}
        </div>

        <div className="program-stats-grid" style={{ marginTop: "1.5rem" }}>
          <div className="program-stat">
            <span className="program-stat-value">{stats.certified}</span>
            <span className="program-stat-label">{translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">173+</span>
            <span className="program-stat-label">{translate(locale, { en: "Promotion zones", th: "เขตส่งเสริม", zh: "推广区" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">{stats.operational}</span>
            <span className="program-stat-label">{translate(locale, { en: "Operational", th: "ใช้งานจริง", zh: "运行中" })}</span>
          </div>
          <div className="program-stat">
            <span className="program-stat-value">105</span>
            <span className="program-stat-label">{translate(locale, { en: "Target by 2027", th: "เป้าหมาย 2570", zh: "2027目标" })}</span>
          </div>
        </div>
      </section>

      {/* ─── CDP + Primer Source ─── */}
      <section ref={cdpRef} className={`section reveal stagger-3 ${cdpVisible ? "visible" : ""}`} style={{ marginBottom: "3rem" }}>
        <div className="callout-card glass-card shadow-heavy" style={{ borderLeftColor: "var(--teal)" }}>
          <p className="eyebrow">{translate(locale, { en: "City Data Platform", th: "แพลตฟอร์มข้อมูลเมือง", zh: "城市数据平台" })}</p>
          <h2>{translate(locale, { en: "CDP: the digital backbone", th: "CDP: กระดูกสันหลังดิจิทัล", zh: "CDP: 数字主干" })}</h2>
          <p>
            {translate(locale, {
              en: "The City Data Platform integrates the large amount of data in cities to give a holistic view of a city’s condition.",
              th: "แพลตฟอร์มข้อมูลเมืองบูรณาการข้อมูลจำนวนมหาศาลในเมืองเพื่อให้เห็นภาพรวมสถานะของเมือง",
              zh: "CDP将城市大量数据整合，提供城市状况的全景视图。"
            })}
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem", flexWrap: "wrap" }}>
            <button type="button" className="cta-button" onClick={() => onNavigate("/references")}>
              {translate(locale, { en: "View data sources", th: "ดูแหล่งข้อมูล", zh: "查看数据源" })}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
              {translate(locale, { en: "Explore rankings", th: "สำรวจอันดับ", zh: "探索排名" })}
            </button>
          </div>
        </div>
      </section>

      {/* ─── KEY INCENTIVES ─── */}
      <section ref={incentivesRef} className={`section reveal stagger-4 ${incentivesVisible ? "visible" : ""}`} style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Incentives", th: "สิทธิประโยชน์", zh: "激励措施" })}</p>
        <h2>{translate(locale, { en: "Why invest in a Thai smart city?", th: "ทำไมต้องลงทุนในเมืองอัจฉริยะไทย?", zh: "为什么投资泰国智慧城市？" })}</h2>
        <p style={{ marginBottom: "1.5rem", maxWidth: "680px" }}>
          {translate(locale, {
            en: "Thailand has constructed a complete incentive stack for companies, investors, and skilled professionals who choose to build inside a certified smart city. The incentives span tax relief, talent mobility, regulatory flexibility, and hands-on support — each designed to lower the friction of the first deployment.",
            th: "ประเทศไทยสร้างระบบสิทธิประโยชน์ครบชุดสำหรับบริษัท นักลงทุน และผู้เชี่ยวชาญที่เลือกสร้างงานในเมืองอัจฉริยะที่ได้รับการรับรอง ครอบคลุมทั้งการลดหย่อนภาษี การเคลื่อนย้ายบุคลากร ความยืดหยุ่นด้านกฎระเบียบ และการสนับสนุนเชิงปฏิบัติ เพื่อลดแรงต้านในการเริ่มต้นใช้งาน",
            zh: "泰国为选择在认证智慧城市中建设的公司、投资者和专业人士构建了完整的激励体系，涵盖税收减免、人才流动、监管灵活性和实操支持，每项都旨在降低首次部署的阻力。"
          })}
        </p>
        <div className="program-concepts-grid">
          <div className="program-concept-card">
            <span className="program-concept-num">①</span>
            <h3>{translate(locale, { en: "BOI Tax Benefits", th: "สิทธิประโยชน์ภาษี BOI", zh: "BOI税收优惠" })}</h3>
            <p>{translate(locale, {
              en: "The Board of Investment offers corporate income tax exemptions for up to eight years for technology companies operating within depa-designated smart city promotional areas. Capital equipment imports may also qualify for duty exemptions, significantly reducing the upfront cost of deploying sensing infrastructure, edge computing, or mobility systems.",
              th: "สำนักงานคณะกรรมการส่งเสริมการลงทุน (BOI) มอบการยกเว้นภาษีเงินได้นิติบุคคลสูงสุดถึง 8 ปีสำหรับบริษัทเทคโนโลยีที่ดำเนินงานในเขตส่งเสริมเมืองอัจฉริยะที่กำหนดโดย depa การนำเข้าอุปกรณ์ทุนอาจได้รับการยกเว้นอากรด้วย ช่วยลดต้นทุนเริ่มต้นในการติดตั้งโครงสร้างพื้นฐานเซนเซอร์ ระบบคอมพิวเตอร์ขอบ หรือระบบการเคลื่อนที่",
              zh: "泰国投资促进委员会(BOI)为在depa指定智慧城市推广区运营的技术公司提供最长8年的企业所得税减免。资本设备进口也可能获得关税豁免，大幅降低部署传感基础设施、边缘计算或出行系统的前期成本。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">②</span>
            <h3>{translate(locale, { en: "Smart Visa for Skilled Foreign Workforce", th: "Smart Visa สำหรับแรงงานต่างชาติทักษะสูง", zh: "智慧签证（外籍高技能人才）" })}</h3>
            <p>{translate(locale, {
              en: "Thailand’s Smart Visa programme grants up to four years of stay for highly skilled professionals, investors, and executives working in targeted industries — including smart city technology, digital infrastructure, and advanced manufacturing. Visa holders are exempt from work permit requirements and their spouses and dependants receive matching authorisation, removing a significant administrative barrier for international talent.",
              th: "โครงการ Smart Visa ของไทยให้สิทธิ์พำนักสูงสุด 4 ปีสำหรับผู้เชี่ยวชาญทักษะสูง นักลงทุน และผู้บริหารที่ทำงานในอุตสาหกรรมเป้าหมาย รวมถึงเทคโนโลยีเมืองอัจฉริยะ โครงสร้างพื้นฐานดิจิทัล และการผลิตขั้นสูง ผู้ถือวีซ่าได้รับการยกเว้นข้อกำหนดใบอนุญาตทำงาน และคู่สมรสและผู้ติดตามได้รับการอนุญาตตามมา ช่วยขจัดอุปสรรคด้านเอกสารสำหรับบุคลากรต่างชาติ",
              zh: "泰国智慧签证计划为在目标产业工作的高技能专业人士、投资者和高管提供最长4年的居留权，包括智慧城市技术、数字基础设施和先进制造业。持证人免于工作许可证要求，其配偶和受抚养人获得同等授权，为国际人才消除了重大行政障碍。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">③</span>
            <h3>{translate(locale, { en: "Technology Sandbox", th: "Technology Sandbox", zh: "技术沙盒" })}</h3>
            <p>{translate(locale, {
              en: "depa operates a regulatory sandbox that allows companies to test new technologies — autonomous vehicles, drone logistics, fintech payment infrastructure, health monitoring platforms — under relaxed regulatory conditions within a designated area for a defined trial period. This is the fastest legal path to a live proof-of-concept in Thailand, without needing to navigate the full licensing regime upfront.",
              th: "depa ดำเนินการ sandbox ด้านกฎระเบียบที่ช่วยให้บริษัทสามารถทดสอบเทคโนโลยีใหม่ เช่น รถยนต์ไร้คนขับ โลจิสติกส์โดรน โครงสร้างพื้นฐานการชำระเงิน FinTech แพลตฟอร์มการติดตามสุขภาพ ภายใต้เงื่อนไขกฎระเบียบที่ผ่อนปรนในพื้นที่กำหนดเป็นระยะเวลาทดลองที่กำหนด นี่คือเส้นทางทางกฎหมายที่เร็วที่สุดสู่หลักฐานแนวคิดสดในไทย โดยไม่ต้องผ่านขั้นตอนการออกใบอนุญาตเต็มรูปแบบล่วงหน้า",
              zh: "depa运营一个监管沙盒，允许公司在指定区域内的特定试验期内，在放宽的监管条件下测试新技术——自动驾驶车辆、无人机物流、金融科技支付基础设施、健康监测平台。这是在泰国进行实时概念验证的最快法律路径，无需事先完整履行许可证制度。"
            })}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">④</span>
            <h3>{translate(locale, { en: "Incubation Programs", th: "โปรแกรมบ่มเพาะ", zh: "孵化计划" })}</h3>
            <p>{translate(locale, {
              en: "depa coordinates incubation and acceleration programs that connect smart city technology startups with municipal buyers, corporate partners, and international networks. Startups accepted into these programs gain access to city-level pilot opportunities, co-investment matching, mentorship from senior depa experts, and introductions to the ASEAN Smart Cities Network — giving early-stage companies a credible path from prototype to real deployment.",
              th: "depa ประสานงานโปรแกรมบ่มเพาะและเร่งการเจริญเติบโตที่เชื่อมต่อสตาร์ทอัพเทคโนโลยีเมืองอัจฉริยะกับผู้ซื้อจากหน่วยงานเทศบาล พันธมิตรองค์กร และเครือข่ายระหว่างประเทศ สตาร์ทอัพที่ได้รับการยอมรับในโปรแกรมจะสามารถเข้าถึงโอกาสนำร่องระดับเมือง การจับคู่ร่วมลงทุน คำปรึกษาจากผู้เชี่ยวชาญ depa อาวุโส และการแนะนำสู่ ASEAN Smart Cities Network ทำให้บริษัทระยะเริ่มต้นมีเส้นทางน่าเชื่อถือจากต้นแบบสู่การใช้งานจริง",
              zh: "depa协调孵化和加速计划，将智慧城市技术初创企业与市政买家、企业合作伙伴和国际网络连接起来。被接受进入这些计划的初创企业可以获得城市级试点机会、联合投资匹配、资深depa专家指导以及东盟智慧城市网络介绍，为早期企业提供从原型到实际部署的可信路径。"
            })}</p>
          </div>
        </div>
      </section>

      {/* ─── SOURCES ─── */}
      <section ref={sourcesRef} className={`section reveal stagger-1 ${sourcesVisible ? "visible" : ""}`} style={{ marginBottom: "3rem" }}>
        <p className="eyebrow">{translate(locale, { en: "Academic Sources", th: "แหล่งอ้างอิงทางวิชาการ", zh: "学术来源" })}</p>
        <h2>{translate(locale, { en: "This page draws on peer-reviewed research", th: "หน้านี้อ้างอิงจากงานวิจัยที่ผ่านการตรวจสอบ", zh: "本页内容来自同行评审研究" })}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
          <div className="program-concept-card" style={{ gap: "0.5rem" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "var(--text-micro)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6 }}>
              {translate(locale, { en: "Journal Article", th: "บทความวิชาการ", zh: "期刊文章" })}
            </p>
            <p>
              {translate(locale, {
                en: "Nimmanphatcharin et al. (incl. Non A., Ph.D., Senior Expert in Smart City Promotion, depa). \"Smart City Initiatives in Thailand: Key Concepts and Methods.\" Hitachi Review, Vol. 70, No. 1, pp. 106–110, 2021.",
                th: "นิมมานพัชรินทร์ และคณะ (รวมถึง ดร.ณณ ผู้เชี่ยวชาญอาวุโสด้านการส่งเสริมเมืองอัจฉริยะ depa). \"Smart City Initiatives in Thailand: Key Concepts and Methods.\" Hitachi Review, Vol. 70, No. 1, หน้า 106–110, 2021.",
                zh: "Nimmanphatcharin 等（含 Non A. 博士，depa 智慧城市推广高级专家）。《泰国智慧城市倡议：核心概念与方法》。Hitachi Review，第 70 卷，第 1 期，第 106–110 页，2021 年。"
              })}
            </p>
          </div>
          <div className="program-concept-card" style={{ gap: "0.5rem" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "var(--text-micro)", letterSpacing: "0.08em", textTransform: "uppercase", opacity: 0.6 }}>
              {translate(locale, { en: "Regional Primer", th: "คู่มือระดับภูมิภาค", zh: "区域入门指南" })}
            </p>
            <p>
              {translate(locale, {
                en: "Smart City Primer: Selected ASEAN Experiences (2022). C asean, Digital Economy Promotion Agency (depa), U.S. Embassy Bangkok, Foundation for Innovative New Democracy (FINSEDT). Published in partnership with the Young Southeast Asian Leaders Initiative (YSEALI).",
                th: "Smart City Primer: Selected ASEAN Experiences (2022). C asean, สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa), สถานทูตสหรัฐอเมริกาประจำกรุงเทพฯ, มูลนิธิเพื่อประชาธิปไตยใหม่เชิงนวัตกรรม (FINSEDT). เผยแพร่ร่วมกับโครงการ Young Southeast Asian Leaders Initiative (YSEALI)",
                zh: "《智慧城市入门指南：东盟精选经验》（2022）。C asean、数字经济促进局 (depa)、美国驻曼谷大使馆、创新新民主基金会 (FINSEDT)。与青年东南亚领袖倡议计划 (YSEALI) 合作出版。"
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
