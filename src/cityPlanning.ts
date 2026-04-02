import { allCities } from "./cityData";
import { roundScore } from "./scoring";
import type {
  Locale,
  ScoringPillar,
  SmartCity,
  SmartDimension,
} from "./types";

export type PlanningStepId =
  | "vision"
  | "infrastructure"
  | "dataPlatform"
  | "businessModel"
  | "partnerships";

export type PlanningStepStatus = "ready" | "building" | "gap";

export type FinanceMechanismId =
  | "government_budget"
  | "ppp"
  | "concession"
  | "debt_financing"
  | "performance_contract"
  | "blended_finance";

export type ToolkitId =
  | "vision_area_canvas"
  | "digital_infra_checklist"
  | "cdp_blueprint"
  | "finance_model_canvas"
  | "partnership_playbook"
  | "data_go_th_connector";

export type ResourceId =
  | "depa_program"
  | "municipal_budget"
  | "data_go_th"
  | "nso_gistda_stack"
  | "ppp_office"
  | "climate_finance"
  | "private_operator_market";

export type GlobalModelId =
  | "barcelona_city_data"
  | "singapore_digital_stack"
  | "copenhagen_energy"
  | "medellin_land_value"
  | "seoul_citizen_reporting"
  | "curitiba_transit";

interface LocalizedContent {
  en: string;
  th: string;
  zh: string;
}

export interface PlanningStepDefinition {
  id: PlanningStepId;
  label: LocalizedContent;
  description: LocalizedContent;
}

export interface FinanceMechanismDefinition {
  id: FinanceMechanismId;
  label: LocalizedContent;
  description: LocalizedContent;
  consideration: LocalizedContent;
  tenor?: LocalizedContent;
}

export interface ToolkitDefinition {
  id: ToolkitId;
  label: LocalizedContent;
  description: LocalizedContent;
}

export interface ResourceDefinition {
  id: ResourceId;
  label: LocalizedContent;
  description: LocalizedContent;
}

export interface GlobalModelDefinition {
  id: GlobalModelId;
  label: LocalizedContent;
  lesson: LocalizedContent;
}

export interface DomainProxy {
  dimension: SmartDimension;
  active: boolean;
  proxyScore: number;
  initiative: LocalizedContent;
}

export interface CityPlanningProfile {
  cityId: string;
  stepStatus: Record<PlanningStepId, PlanningStepStatus>;
  stepNotes: Record<PlanningStepId, LocalizedContent>;
  primaryFinance: FinanceMechanismId;
  secondaryFinance: FinanceMechanismId;
  concessionYears?: string;
  toolkitIds: ToolkitId[];
  resourceIds: ResourceId[];
  globalModelIds: GlobalModelId[];
  deliveryNote: LocalizedContent;
}

export const PLANNING_STEPS: PlanningStepDefinition[] = [
  {
    id: "vision",
    label: {
      en: "1. Vision + development area",
      th: "1. วิสัยทัศน์ + พื้นที่พัฒนา",
      zh: "1. 愿景与开发范围",
    },
    description: {
      en: "The city needs a defined ambition, a bounded area, and a reason for intervention.",
      th: "เมืองต้องมีเป้าหมายที่ชัด พื้นที่เป้าหมายที่ชัด และเหตุผลว่าทำไมต้องลงมือ",
      zh: "城市需要清楚的目标、明确的范围，以及为什么必须行动的理由。",
    },
  },
  {
    id: "infrastructure",
    label: {
      en: "2. Digital + advanced infrastructure",
      th: "2. โครงสร้างพื้นฐานดิจิทัล + โครงสร้างขั้นสูง",
      zh: "2. 数字与高级基础设施",
    },
    description: {
      en: "Connectivity, utilities, mobility, and operational systems must exist before the dashboard theatre starts.",
      th: "โครงข่าย การสาธารณูปโภค การเดินทาง และระบบปฏิบัติการต้องมีจริงก่อนจะเล่นละครแดชบอร์ด",
      zh: "在开始表演式仪表板之前，连接、公共设施、交通与运行系统必须先真的存在。",
    },
  },
  {
    id: "dataPlatform",
    label: {
      en: "3. City data platform",
      th: "3. City Data Platform",
      zh: "3. 城市数据平台",
    },
    description: {
      en: "A city needs a data spine that connects local operations, national datasets, and public reporting.",
      th: "เมืองต้องมีแกนข้อมูลที่เชื่อมระบบภาคปฏิบัติ ข้อมูลระดับชาติ และการรายงานสาธารณะ",
      zh: "城市需要一条数据主干，把本地运行、国家数据集与公众报告连在一起。",
    },
  },
  {
    id: "businessModel",
    label: {
      en: "4. Business model + operating mechanism",
      th: "4. โมเดลธุรกิจ + กลไกการเดินระบบ",
      zh: "4. 商业模式与运营机制",
    },
    description: {
      en: "Capex is easy to announce. Opex, risk allocation, tariffs, and maintenance discipline are the hard part.",
      th: "งบลงทุนประกาศง่าย แต่ค่าเดินระบบ การแบ่งความเสี่ยง ค่าธรรมเนียม และวินัยการบำรุงรักษาคือของจริง",
      zh: "资本开支很容易宣布，真正难的是运维、风险分配、收费机制与维护纪律。",
    },
  },
  {
    id: "partnerships",
    label: {
      en: "5. Partnerships + seven-domain solutions",
      th: "5. พันธมิตร + โซลูชัน 7 มิติ",
      zh: "5. 伙伴关系与七大领域方案",
    },
    description: {
      en: "The city needs implementation partners, not just logos: operators, universities, utilities, civic groups, and vendors that can actually deliver.",
      th: "เมืองต้องมีพันธมิตรที่ลงมือทำได้จริง ไม่ใช่แค่โลโก้: ผู้ให้บริการ มหาวิทยาลัย สาธารณูปโภค ภาคประชาชน และผู้ขายที่ส่งมอบได้",
      zh: "城市需要真正能交付的伙伴，而不只是徽章：运营商、大学、公用事业、社区组织与供应商。",
    },
  },
];

export const PLANNING_STATUS_META: Record<
  PlanningStepStatus,
  { label: LocalizedContent; className: string }
> = {
  ready: {
    label: { en: "Ready", th: "พร้อม", zh: "就绪" },
    className: "ready",
  },
  building: {
    label: { en: "Building", th: "กำลังก่อ", zh: "建设中" },
    className: "building",
  },
  gap: {
    label: { en: "Gap", th: "ยังขาด", zh: "缺口" },
    className: "gap",
  },
};

export const FINANCE_MECHANISMS: Record<FinanceMechanismId, FinanceMechanismDefinition> = {
  government_budget: {
    id: "government_budget",
    label: {
      en: "Government budget",
      th: "งบประมาณภาครัฐ",
      zh: "政府预算",
    },
    description: {
      en: "National, provincial, or municipal budget used to fund foundational public infrastructure and first-phase systems.",
      th: "งบระดับชาติ จังหวัด หรือเทศบาล ใช้ลงของพื้นฐานและระบบระยะแรก",
      zh: "国家、省级或市级财政，用于基础公共设施与首阶段系统。",
    },
    consideration: {
      en: "Best for early public goods. Weak if the city has no ring-fenced operating budget after launch.",
      th: "เหมาะกับของสาธารณะระยะแรก แต่จะเปราะถ้าไม่มีงบเดินระบบหลังเปิดใช้",
      zh: "最适合前期公共品，但如果上线后没有被圈定的运维预算，就会很脆弱。",
    },
    tenor: {
      en: "Annual to medium-term budget cycle",
      th: "รอบงบประมาณรายปีถึงระยะกลาง",
      zh: "年度到中期财政周期",
    },
  },
  ppp: {
    id: "ppp",
    label: {
      en: "Public-private partnership",
      th: "ร่วมลงทุนรัฐ-เอกชน",
      zh: "公私合营",
    },
    description: {
      en: "City and private operator share investment, operational duty, and performance risk under a measurable service model.",
      th: "เมืองและเอกชนร่วมรับภาระลงทุน เดินระบบ และความเสี่ยง ภายใต้ตัวชี้วัดบริการที่วัดได้",
      zh: "城市与私人运营方在可衡量的服务模型下分担投资、运营与绩效风险。",
    },
    consideration: {
      en: "Works when demand is real, procurement is credible, and the city can manage contracts instead of just signing them.",
      th: "ใช้ได้เมื่อมีดีมานด์จริง ระบบจัดซื้อเชื่อถือได้ และเมืองบริหารสัญญาเป็น ไม่ใช่แค่เซ็นแล้วจบ",
      zh: "只有在需求真实、采购可信，而且城市有能力管合同而不是只会签字时才成立。",
    },
    tenor: {
      en: "10-20 years",
      th: "10-20 ปี",
      zh: "10-20 年",
    },
  },
  concession: {
    id: "concession",
    label: {
      en: "Concession model",
      th: "โมเดลสัมปทาน",
      zh: "特许经营",
    },
    description: {
      en: "A private operator finances and runs an asset or service in exchange for defined revenue rights and service obligations.",
      th: "เอกชนลงทุนและเดินระบบสินทรัพย์หรือบริการ แลกกับสิทธิรายได้และภาระหน้าที่บริการที่กำหนดชัด",
      zh: "私人运营方投资并运营资产或服务，换取明确的收益权与服务义务。",
    },
    consideration: {
      en: "Useful for mobility, utilities, parking, waste, and broadband when tariffs or fees can be defended politically.",
      th: "เหมาะกับขนส่ง สาธารณูปโภค ที่จอดรถ ขยะ และบรอดแบนด์ เมื่อเมืองตั้งค่าธรรมเนียมได้จริง",
      zh: "适用于交通、公用事业、停车、垃圾与宽带，前提是收费或费率在政治上站得住。",
    },
    tenor: {
      en: "12-25 years",
      th: "12-25 ปี",
      zh: "12-25 年",
    },
  },
  debt_financing: {
    id: "debt_financing",
    label: {
      en: "Debt financing",
      th: "เงินกู้ / หนี้เพื่อการลงทุน",
      zh: "债务融资",
    },
    description: {
      en: "Loans or project debt used to fund city infrastructure with a clear payback path.",
      th: "เงินกู้หรือหนี้โครงการสำหรับลงทุนโครงสร้างพื้นฐานที่มีทางคืนทุนชัด",
      zh: "用于城市基础设施的贷款或项目债，前提是回收路径明确。",
    },
    consideration: {
      en: "Requires cash flow discipline, revenue visibility, and serious asset management. Otherwise it becomes a political grenade.",
      th: "ต้องมีวินัยกระแสเงินสด รายได้ที่มองเห็นได้ และการบริหารสินทรัพย์จริงจัง ไม่งั้นกลายเป็นระเบิดการเมือง",
      zh: "要求现金流纪律、可见收入与严肃的资产管理，否则就会变成政治手雷。",
    },
    tenor: {
      en: "7-15 years",
      th: "7-15 ปี",
      zh: "7-15 年",
    },
  },
  performance_contract: {
    id: "performance_contract",
    label: {
      en: "Performance contract",
      th: "สัญญาจ่ายตามผลลัพธ์",
      zh: "绩效合同",
    },
    description: {
      en: "The city pays for verified service outcomes: energy savings, uptime, response time, or service-level improvement.",
      th: "เมืองจ่ายตามผลลัพธ์ที่ตรวจสอบได้ เช่น ประหยัดพลังงาน uptime เวลาตอบสนอง หรือระดับบริการที่ดีขึ้น",
      zh: "城市按经核验的结果付费，例如节能、正常运行时间、响应时间或服务提升。",
    },
    consideration: {
      en: "Useful when the city wants operational improvement without carrying full technology risk by itself.",
      th: "เหมาะเมื่อเมืองอยากได้ผลการเดินระบบดีขึ้น แต่ไม่อยากรับความเสี่ยงเทคโนโลยีเต็มตัวเอง",
      zh: "适合城市想提升运营效果，但不想独自承担全部技术风险的时候。",
    },
    tenor: {
      en: "5-12 years",
      th: "5-12 ปี",
      zh: "5-12 年",
    },
  },
  blended_finance: {
    id: "blended_finance",
    label: {
      en: "Blended / climate finance",
      th: "การเงินแบบผสม / เงินทุนภูมิอากาศ",
      zh: "混合融资 / 气候资金",
    },
    description: {
      en: "Layer grants, concessional funding, and commercial capital for resilience, green infrastructure, and nature-positive projects.",
      th: "ซ้อนเงินอุดหนุน เงินกู้ผ่อนปรน และทุนพาณิชย์เข้าด้วยกันสำหรับงานฟื้นตัว เมืองสีเขียว และโครงสร้างพื้นฐานเชิงธรรมชาติ",
      zh: "把赠款、优惠资金与商业资本叠加起来，用于韧性、绿色基础设施与自然友好型项目。",
    },
    consideration: {
      en: "Strong fit for environment-heavy cities, but only if the city can measure climate outcomes and maintain reporting discipline.",
      th: "เหมาะกับเมืองที่น้ำหนักสิ่งแวดล้อมสูง แต่ต้องวัดผลลัพธ์ภูมิอากาศและรายงานอย่างมีวินัยให้ได้",
      zh: "非常适合环境权重高的城市，但前提是城市能测量气候成果并持续汇报。",
    },
    tenor: {
      en: "Project-based / multi-phase",
      th: "ตามโครงการ / หลายระยะ",
      zh: "按项目 / 多阶段",
    },
  },
};

export const TOOLKITS: Record<ToolkitId, ToolkitDefinition> = {
  vision_area_canvas: {
    id: "vision_area_canvas",
    label: {
      en: "Vision + area canvas",
      th: "ผังวิสัยทัศน์ + พื้นที่พัฒนา",
      zh: "愿景与开发范围画布",
    },
    description: {
      en: "Use this to pin the city ambition, define the pilot area, and agree what success looks like before procurement starts.",
      th: "ใช้กำหนดความทะเยอทะยานของเมือง พื้นที่นำร่อง และภาพความสำเร็จก่อนเริ่มจัดซื้อ",
      zh: "用来钉住城市 ambition、划定试点范围，并在采购前先讲清楚成功长什么样。",
    },
  },
  digital_infra_checklist: {
    id: "digital_infra_checklist",
    label: {
      en: "Digital infrastructure checklist",
      th: "เช็กลิสต์โครงสร้างพื้นฐานดิจิทัล",
      zh: "数字基础设施清单",
    },
    description: {
      en: "A brutal checklist for fiber, devices, sensors, power reliability, security, and operations readiness.",
      th: "เช็กลิสต์ตรงไปตรงมาสำหรับไฟเบอร์ อุปกรณ์ เซ็นเซอร์ ไฟฟ้า ความมั่นคงปลอดภัย และความพร้อมปฏิบัติการ",
      zh: "一份直接得很的清单，检查光纤、设备、传感器、电力可靠性、安全与运营准备度。",
    },
  },
  cdp_blueprint: {
    id: "cdp_blueprint",
    label: {
      en: "City data platform blueprint",
      th: "พิมพ์เขียว City Data Platform",
      zh: "城市数据平台蓝图",
    },
    description: {
      en: "The minimum viable stack for local operations data, public dashboarding, and national dataset integration.",
      th: "สแต็กขั้นต่ำสำหรับข้อมูลปฏิบัติการเมือง แดชบอร์ดสาธารณะ และการเชื่อมข้อมูลระดับชาติ",
      zh: "覆盖本地运营数据、公开看板与国家数据集对接的最低可行技术栈。",
    },
  },
  finance_model_canvas: {
    id: "finance_model_canvas",
    label: {
      en: "Finance model canvas",
      th: "แคนวาสโมเดลการเงิน",
      zh: "融资模型画布",
    },
    description: {
      en: "Map capex, opex, revenue, risk, tariff logic, and contract length before anyone starts waving PowerPoint around.",
      th: "กาง capex, opex, รายได้ ความเสี่ยง ตรรกะค่าธรรมเนียม และอายุสัญญาให้ครบก่อนใครจะเริ่มแกว่ง PowerPoint",
      zh: "在任何人开始挥舞 PPT 之前，先把资本开支、运营开支、收入、风险、费率逻辑与合同年限摊平。",
    },
  },
  partnership_playbook: {
    id: "partnership_playbook",
    label: {
      en: "Partnership playbook",
      th: "คู่มือจัดพันธมิตร",
      zh: "伙伴关系剧本",
    },
    description: {
      en: "A practical matrix for city hall, utilities, universities, startups, operators, and civic groups.",
      th: "เมทริกซ์ใช้งานจริงสำหรับเทศบาล สาธารณูปโภค มหาวิทยาลัย สตาร์ตอัป ผู้ให้บริการ และภาคประชาชน",
      zh: "一份给市政府、公用事业、大学、创业公司、运营商与社区组织共用的实战矩阵。",
    },
  },
  data_go_th_connector: {
    id: "data_go_th_connector",
    label: {
      en: "data.go.th connector pack",
      th: "ชุดเชื่อมข้อมูล data.go.th",
      zh: "data.go.th 连接包",
    },
    description: {
      en: "A starter connector set to pull national datasets into the city's own operating picture.",
      th: "ชุดเชื่อมเริ่มต้นสำหรับดึงข้อมูลระดับชาติจาก data.go.th เข้าภาพปฏิบัติการของเมือง",
      zh: "把 data.go.th 国家数据集拉进城市自有运营视图的起步连接包。",
    },
  },
};

export const RESOURCES: Record<ResourceId, ResourceDefinition> = {
  depa_program: {
    id: "depa_program",
    label: {
      en: "depa smart city program",
      th: "โครงการเมืองอัจฉริยะของ depa",
      zh: "depa 智慧城市计划",
    },
    description: {
      en: "Certification pathway, local implementation support, and alignment with the national smart city program.",
      th: "เส้นทางการรับรอง การสนับสนุนการดำเนินงานท้องถิ่น และการเชื่อมกับโครงการเมืองอัจฉริยะระดับชาติ",
      zh: "认证路径、本地实施支持，以及与国家智慧城市计划的对齐。",
    },
  },
  municipal_budget: {
    id: "municipal_budget",
    label: {
      en: "Municipal + provincial budget",
      th: "งบเทศบาล + งบจังหวัด",
      zh: "市级与省级预算",
    },
    description: {
      en: "The default funding rail for public-space upgrades, civic systems, and first-wave digital infrastructure.",
      th: "รางเงินหลักสำหรับงานพื้นที่สาธารณะ ระบบพลเมือง และโครงสร้างพื้นฐานดิจิทัลระลอกแรก",
      zh: "公共空间改造、市政协同系统与第一波数字基础设施的默认资金轨道。",
    },
  },
  data_go_th: {
    id: "data_go_th",
    label: {
      en: "data.go.th",
      th: "data.go.th",
      zh: "data.go.th",
    },
    description: {
      en: "Thailand's national open data catalog. This should be one of the default feeds into a city data platform.",
      th: "คลังข้อมูลเปิดระดับชาติของไทย ควรเป็นหนึ่งในฟีดตั้งต้นของ City Data Platform",
      zh: "泰国国家开放数据目录，应该是城市数据平台的默认输入之一。",
    },
  },
  nso_gistda_stack: {
    id: "nso_gistda_stack",
    label: {
      en: "NSO + GISTDA + open climate stack",
      th: "NSO + GISTDA + สแต็กข้อมูลภูมิอากาศเปิด",
      zh: "NSO + GISTDA + 开放气候数据栈",
    },
    description: {
      en: "Demographics, socioeconomic indicators, satellite layers, and climate feeds needed for a real city dashboard.",
      th: "ประชากร เศรษฐกิจ สังคม ภาพถ่ายดาวเทียม และข้อมูลภูมิอากาศที่ต้องมีถ้าจะทำแดชบอร์ดเมืองให้จริง",
      zh: "真正的城市仪表板离不开人口、社会经济指标、卫星图层与气候数据。",
    },
  },
  ppp_office: {
    id: "ppp_office",
    label: {
      en: "PPP policy + procurement channels",
      th: "ช่องทาง PPP + จัดซื้อจัดจ้าง",
      zh: "PPP 政策与采购通道",
    },
    description: {
      en: "Use this when the city has enough demand and institutional discipline to structure a real delivery contract.",
      th: "ใช้เมื่อเมืองมีดีมานด์เพียงพอและมีวินัยสถาบันพอจะจัดสัญญาส่งมอบจริง",
      zh: "当城市有足够需求且有制度纪律去搭一个真合同的时候，就该走这条线。",
    },
  },
  climate_finance: {
    id: "climate_finance",
    label: {
      en: "Climate + resilience funding",
      th: "เงินทุนภูมิอากาศ + ความยืดหยุ่น",
      zh: "气候与韧性资金",
    },
    description: {
      en: "Green infrastructure, flood resilience, and environmental upgrades can often tap blended or concessional funding.",
      th: "โครงสร้างพื้นฐานสีเขียว งานน้ำท่วม และการยกระดับสิ่งแวดล้อมมักเข้าถึงเงินทุนผสมหรือเงินกู้ผ่อนปรนได้",
      zh: "绿色基础设施、防洪韧性与环境升级往往能接上混合融资或优惠资金。",
    },
  },
  private_operator_market: {
    id: "private_operator_market",
    label: {
      en: "Private operator market",
      th: "ตลาดผู้ให้บริการเอกชน",
      zh: "私人运营商市场",
    },
    description: {
      en: "Transit, utilities, parking, broadband, waste, and platform services only work when there is an operator ecosystem to procure from.",
      th: "ขนส่ง สาธารณูปโภค ที่จอดรถ บรอดแบนด์ ขยะ และแพลตฟอร์มจะเดินได้ ก็ต่อเมื่อมี ecosystem ของผู้ให้บริการให้จัดหา",
      zh: "交通、公用事业、停车、宽带、垃圾与平台服务之所以能落地，是因为背后有可采购的运营商生态。",
    },
  },
};

export const GLOBAL_MODELS: Record<GlobalModelId, GlobalModelDefinition> = {
  barcelona_city_data: {
    id: "barcelona_city_data",
    label: {
      en: "Barcelona: city data platform + urban services",
      th: "บาร์เซโลนา: City Data Platform + บริการเมือง",
      zh: "巴塞罗那：城市数据平台与城市服务",
    },
    lesson: {
      en: "Use the platform as operational infrastructure, not just a public dashboard. Data only matters if it changes how the city works.",
      th: "ใช้แพลตฟอร์มเป็นโครงสร้างพื้นฐานปฏิบัติการ ไม่ใช่แค่แดชบอร์ดโชว์ ข้อมูลมีค่าเมื่อมันเปลี่ยนวิธีที่เมืองทำงาน",
      zh: "把平台当作运营基础设施，而不是只拿来展示。数据只有改变城市运转方式时才有意义。",
    },
  },
  singapore_digital_stack: {
    id: "singapore_digital_stack",
    label: {
      en: "Singapore: shared digital infrastructure",
      th: "สิงคโปร์: โครงสร้างพื้นฐานดิจิทัลร่วม",
      zh: "新加坡：共享数字基础设施",
    },
    lesson: {
      en: "Common digital rails reduce duplication. Standard identity, payments, and data layers let cities move faster.",
      th: "รางดิจิทัลกลางช่วยลดงานซ้ำซ้อน ตัวตนดิจิทัล การจ่ายเงิน และชั้นข้อมูลมาตรฐานทำให้เมืองเคลื่อนเร็วขึ้น",
      zh: "共用数字轨道能减少重复建设。统一身份、支付与数据层能让城市跑得更快。",
    },
  },
  copenhagen_energy: {
    id: "copenhagen_energy",
    label: {
      en: "Copenhagen: utility-led green infrastructure",
      th: "โคเปนเฮเกน: โครงสร้างพื้นฐานสีเขียวนำโดยสาธารณูปโภค",
      zh: "哥本哈根：公用事业主导的绿色基础设施",
    },
    lesson: {
      en: "Environment projects get real when operators, tariffs, and long-term maintenance are built into the financing logic.",
      th: "โครงการสิ่งแวดล้อมจะจริงก็ต่อเมื่อผู้เดินระบบ ค่าธรรมเนียม และการบำรุงรักษาระยะยาวถูกใส่ไว้ในตรรกะการเงินตั้งแต่ต้น",
      zh: "环境项目只有把运营方、费率与长期维护写进融资逻辑里，才会真的跑起来。",
    },
  },
  medellin_land_value: {
    id: "medellin_land_value",
    label: {
      en: "Medellin: land value capture + social urbanism",
      th: "เมเดยิน: จับมูลค่าที่ดิน + เมืองเชิงสังคม",
      zh: "麦德林：土地价值回收与社会城市主义",
    },
    lesson: {
      en: "Mobility and public-space upgrades can pay back indirectly through land value, development rights, and regenerated districts.",
      th: "การยกระดับขนส่งและพื้นที่สาธารณะคืนทุนทางอ้อมได้ผ่านมูลค่าที่ดิน สิทธิพัฒนา และการฟื้นย่าน",
      zh: "交通与公共空间升级可以通过土地价值、开发权与片区再生间接回收。",
    },
  },
  seoul_citizen_reporting: {
    id: "seoul_citizen_reporting",
    label: {
      en: "Seoul: citizen reporting + service loops",
      th: "โซล: ระบบรายงานประชาชน + วงจรบริการ",
      zh: "首尔：市民报告与服务闭环",
    },
    lesson: {
      en: "Citizen-facing apps matter when they close the loop into operations, not when they die in a PR campaign.",
      th: "แอปพลิเคชันประชาชนมีค่าก็ต่อเมื่อปิดวงจรเข้าระบบปฏิบัติการจริง ไม่ใช่ตายอยู่ในแคมเปญประชาสัมพันธ์",
      zh: "面向市民的应用只有把反馈真正闭环到运营里才有意义，不然就只是公关活动。",
    },
  },
  curitiba_transit: {
    id: "curitiba_transit",
    label: {
      en: "Curitiba: transit-led city structuring",
      th: "กูรีตีบา: การจัดโครงสร้างเมืองด้วยขนส่ง",
      zh: "库里蒂巴：以交通塑造城市",
    },
    lesson: {
      en: "Mobility projects work when land use, service model, and corridor economics are designed together.",
      th: "โครงการขนส่งจะเวิร์กเมื่อผังเมือง โมเดลบริการ และเศรษฐศาสตร์ของ corridor ถูกออกแบบไปด้วยกัน",
      zh: "交通项目只有把土地使用、服务模型与走廊经济一起设计，才会真的成立。",
    },
  },
};

const DOMAIN_PROXY_PILLARS: Record<SmartDimension, ScoringPillar[]> = {
  economy: ["economy", "livability"],
  energy: ["environment", "digital"],
  environment: ["environment", "wellbeing"],
  governance: ["digital", "safety"],
  living: ["livability", "wellbeing"],
  mobility: ["livability", "safety", "digital"],
  people: ["hospitality", "wellbeing"],
};

const DOMAIN_PROXY_COPY: Record<SmartDimension, LocalizedContent> = {
  economy: {
    en: "Investment, local enterprise, tourism value chains, and job-creating growth engines.",
    th: "การลงทุน วิสาหกิจท้องถิ่น ห่วงโซ่มูลค่าการท่องเที่ยว และเครื่องยนต์การเติบโตที่สร้างงาน",
    zh: "投资、本地企业、旅游价值链与能带来就业的增长引擎。",
  },
  energy: {
    en: "Grid resilience, smart utility operations, renewable integration, and building efficiency.",
    th: "ความยืดหยุ่นของโครงข่าย การเดินระบบสาธารณูปโภคอัจฉริยะ พลังงานหมุนเวียน และประสิทธิภาพอาคาร",
    zh: "电网韧性、智慧公用事业运营、可再生能源接入与建筑效率。",
  },
  environment: {
    en: "Air, water, waste, green infrastructure, and climate-resilient environmental management.",
    th: "อากาศ น้ำ ขยะ โครงสร้างพื้นฐานสีเขียว และการจัดการสิ่งแวดล้อมที่ทนต่อภูมิอากาศ",
    zh: "空气、水、垃圾、绿色基础设施与具备气候韧性的环境治理。",
  },
  governance: {
    en: "Permitting, reporting, transparency, public-service loops, and digital governance systems.",
    th: "การอนุญาต การรายงาน ความโปร่งใส วงจรบริการสาธารณะ และระบบธรรมาภิบาลดิจิทัล",
    zh: "许可、报告、透明度、公共服务闭环与数字治理系统。",
  },
  living: {
    en: "Housing, public realm, healthcare, education, safety, and everyday quality of life.",
    th: "ที่อยู่อาศัย พื้นที่สาธารณะ สุขภาพ การศึกษา ความปลอดภัย และคุณภาพชีวิตรายวัน",
    zh: "住房、公共空间、医疗、教育、安全与日常生活质量。",
  },
  mobility: {
    en: "Transit, traffic operations, last-mile access, logistics, and multimodal city movement.",
    th: "ขนส่ง การจราจร การเชื่อมต่อระยะสุดท้าย โลจิสติกส์ และการเคลื่อนที่หลายรูปแบบของเมือง",
    zh: "公共交通、交通运营、最后一公里、物流与多模式城市流动。",
  },
  people: {
    en: "Citizen capability, social cohesion, digital literacy, community participation, and civic trust.",
    th: "ศักยภาพพลเมือง ความเหนียวแน่นทางสังคม ความรู้ดิจิทัล การมีส่วนร่วมของชุมชน และความไว้วางใจพลเมือง",
    zh: "市民能力、社会凝聚、数字素养、社区参与与公民信任。",
  },
};

function localized(locale: Locale, copy: LocalizedContent): string {
  return copy[locale];
}

function buildStepStatus(city: SmartCity): Record<PlanningStepId, PlanningStepStatus> {
  return {
    vision: city.status === "certified" ? "ready" : city.reality !== "planned" ? "building" : "gap",
    infrastructure: city.reality === "operational" ? "ready" : city.reality === "partial" ? "building" : "gap",
    dataPlatform: city.scores.digital >= 60 ? "ready" : city.scores.digital >= 40 ? "building" : "gap",
    businessModel:
      city.reality === "operational" && city.status === "certified"
        ? "ready"
        : city.status === "certified" || city.reality === "partial"
          ? "building"
          : "gap",
    partnerships:
      city.smartDimensions.length >= 4 ? "ready" : city.smartDimensions.length >= 2 ? "building" : "gap",
  };
}

function pickFinanceMechanisms(city: SmartCity): {
  primaryFinance: FinanceMechanismId;
  secondaryFinance: FinanceMechanismId;
  concessionYears?: string;
  deliveryNote: LocalizedContent;
} {
  const hasInfraRevenue = city.smartDimensions.includes("mobility") || city.smartDimensions.includes("energy");
  const environmentHeavy = city.smartDimensions.includes("environment");
  const governanceHeavy = city.smartDimensions.includes("governance");

  if (city.reality === "planned") {
    return {
      primaryFinance: "government_budget",
      secondaryFinance: environmentHeavy ? "blended_finance" : "ppp",
      deliveryNote: {
        en: "Start with public money to de-risk the first move. Do not jump into a sexy PPP before the city has a scoped project, a delivery area, and basic operating assumptions.",
        th: "เริ่มจากเงินสาธารณะเพื่อลดความเสี่ยงของก้าวแรก อย่ารีบกระโดดเข้า PPP เท่ๆ ก่อนเมืองจะมีขอบเขตโครงการ พื้นที่นำร่อง และสมมติฐานการเดินระบบพื้นฐาน",
        zh: "先用公共资金把第一步去风险。别在项目范围、试点区域和基本运营假设都还没立住之前，就冲进看起来很性感的 PPP。",
      },
    };
  }

  if (city.reality === "partial") {
    return {
      primaryFinance: hasInfraRevenue ? "ppp" : "government_budget",
      secondaryFinance: hasInfraRevenue ? "concession" : "performance_contract",
      concessionYears: hasInfraRevenue ? "12-18" : undefined,
      deliveryNote: {
        en: "This city is beyond pilot theatre. It now needs a contract structure that can carry real uptime, service standards, and maintenance.",
        th: "เมืองนี้เลยช่วงเล่นนำร่องแล้ว ตอนนี้ต้องการโครงสร้างสัญญาที่แบก uptime มาตรฐานบริการ และการบำรุงรักษาจริงได้",
        zh: "这座城市已经不该停留在试点表演阶段，它现在需要能扛住 uptime、服务标准与维护责任的合同结构。",
      },
    };
  }

  if (hasInfraRevenue) {
    return {
      primaryFinance: "concession",
      secondaryFinance: "debt_financing",
      concessionYears: city.tier === "alpha" ? "15-25" : "10-15",
      deliveryNote: {
        en: "Operational infrastructure with visible demand can carry a concession or project-finance logic, but only if tariff politics and asset stewardship are explicit.",
        th: "โครงสร้างพื้นฐานที่เดินจริงและมีดีมานด์ชัด สามารถแบกตรรกะสัมปทานหรือ project finance ได้ แต่ต้องพูดเรื่องการเมืองของค่าธรรมเนียมและการดูแลสินทรัพย์ให้ชัด",
        zh: "真正跑起来且需求可见的基础设施，可以走特许经营或项目融资，但前提是把费率政治和资产治理讲明白。",
      },
    };
  }

  if (environmentHeavy) {
    return {
      primaryFinance: "blended_finance",
      secondaryFinance: "government_budget",
      deliveryNote: {
        en: "This city has enough environmental logic to justify climate and resilience finance, but the project has to be measurable rather than poetic.",
        th: "เมืองนี้มีตรรกะสิ่งแวดล้อมพอจะใช้เงินทุนภูมิอากาศและความยืดหยุ่นได้ แต่โครงการต้องวัดผลได้ ไม่ใช่เขียนให้สวยเฉยๆ",
        zh: "这座城市的环境逻辑足够支撑气候与韧性融资，但项目必须是可测量的，而不是写得很诗意。",
      },
    };
  }

  if (governanceHeavy) {
    return {
      primaryFinance: "performance_contract",
      secondaryFinance: "government_budget",
      deliveryNote: {
        en: "Governance-heavy programs often win by buying outcomes, not hardware. Pay for service loops and performance, not shiny boxes.",
        th: "โครงการที่หนักด้านธรรมาภิบาลมักชนะด้วยการซื้อผลลัพธ์ ไม่ใช่ซื้อฮาร์ดแวร์ จ่ายเพื่อวงจรบริการและ performance ไม่ใช่กล่องเงาๆ",
        zh: "治理类项目往往是买结果，不是买硬件。花钱去买服务闭环和绩效，而不是亮闪闪的盒子。",
      },
    };
  }

  return {
    primaryFinance: "government_budget",
    secondaryFinance: "ppp",
    deliveryNote: {
      en: "The city can still move on public money, but should structure the next wave so private capital can enter without wrecking public purpose.",
      th: "เมืองยังเดินต่อด้วยเงินสาธารณะได้ แต่ควรจัดโครงสร้างระลอกถัดไปให้ทุนเอกชนเข้ามาได้โดยไม่ทำลายเป้าหมายสาธารณะ",
      zh: "这座城市仍然可以靠公共资金往前走，但下一波必须把结构搭好，好让私人资本进来又不毁掉公共目的。",
    },
  };
}

function buildStepNotes(
  city: SmartCity,
  financeChoice: ReturnType<typeof pickFinanceMechanisms>,
): Record<PlanningStepId, LocalizedContent> {
  return {
    vision: city.status === "certified"
      ? {
          en: "The city already sits inside an endorsed smart-city frame. Tighten the delivery area so the vision becomes a map, not a slogan.",
          th: "เมืองนี้อยู่ในกรอบเมืองอัจฉริยะที่ได้รับการรับรองแล้ว ขั้นต่อไปคือทำให้พื้นที่พัฒนาชัดจนวิสัยทัศน์กลายเป็นแผนที่ ไม่ใช่สโลแกน",
          zh: "这座城市已经被纳入正式的智慧城市框架。下一步是把开发范围收紧，让愿景变成地图，而不是口号。",
        }
      : {
          en: "Promotion status means the city still needs a harder definition of the pilot zone, the mission, and the first visible win.",
          th: "สถานะเขตส่งเสริมหมายความว่าเมืองยังต้องทำให้พื้นที่นำร่อง ภารกิจ และชัยชนะชิ้นแรกคมขึ้นอีก",
          zh: "推广区状态说明这座城市还需要把试点范围、任务与第一个可见成果定义得更狠一点。",
        },
    infrastructure: city.reality === "operational"
      ? {
          en: "The base layer exists. Now the job is reliability, maintenance, and integrating isolated systems into something the city can govern.",
          th: "ฐานมีแล้ว งานต่อไปคือความน่าเชื่อถือ การบำรุงรักษา และการเชื่อมระบบที่กระจัดกระจายให้เมืองบริหารได้จริง",
          zh: "基础层已经存在。接下来要做的是可靠性、维护，以及把分散系统接成一个城市能治理的东西。",
        }
      : city.reality === "partial"
        ? {
            en: "Some infrastructure is visible, but it is not yet city-grade. Expand from pilots into an operational backbone.",
            th: "มีโครงสร้างบางส่วนให้เห็น แต่ยังไม่ถึงระดับเมือง ต้องขยายจากนำร่องไปสู่กระดูกสันหลังปฏิบัติการ",
            zh: "已经有一些基础设施可见，但还没到城市级。要从试点长成可运营的主干。",
          }
        : {
            en: "Infrastructure is still more promise than system. Build the boring basics before chasing smart-city theatre.",
            th: "โครงสร้างพื้นฐานยังเป็นคำสัญญามากกว่าระบบ สร้างของพื้นฐานที่น่าเบื่อให้ครบก่อนค่อยเล่นละครเมืองอัจฉริยะ",
            zh: "基础设施现在仍然更像承诺而不是系统。先把那些无聊但必要的基础做好，再谈智慧城市表演。",
          },
    dataPlatform: city.scores.digital >= 60
      ? {
          en: "Digital capacity is strong enough to justify a city data platform that ties operations, evidence, and public accountability together.",
          th: "ความพร้อมดิจิทัลสูงพอที่จะสร้าง City Data Platform ที่ผูกปฏิบัติการ หลักฐาน และความรับผิดชอบต่อสาธารณะเข้าด้วยกัน",
          zh: "数字能力已经足够支撑一个把运营、证据与公众问责绑在一起的城市数据平台。",
        }
      : city.scores.digital >= 40
        ? {
            en: "A platform is plausible, but it should start small: operational feeds first, public dashboard second, fancy AI later.",
            th: "ทำแพลตฟอร์มได้ แต่ต้องเริ่มเล็กก่อน: เอาฟีดปฏิบัติการมาก่อน แดชบอร์ดสาธารณะทีหลัง AI สวยๆ ไว้ท้ายๆ",
            zh: "平台不是做不了，但得从小处开局：先接运营数据，再做公开看板，漂亮 AI 放后面。",
          }
        : {
            en: "The city does not need a giant dashboard yet. It needs the data plumbing that lets a dashboard become truthful later.",
            th: "เมืองยังไม่ต้องการแดชบอร์ดยักษ์ เมืองต้องการท่อน้ำข้อมูลที่จะทำให้แดชบอร์ดพูดความจริงได้ในอนาคต",
            zh: "这座城市现在还不需要巨型仪表板，它需要的是让未来仪表板可以讲真话的数据管道。",
          },
    businessModel: {
      en: `Best-fit lead mechanism: ${FINANCE_MECHANISMS[financeChoice.primaryFinance].label.en}. The city should define who pays, who operates, and who gets blamed when uptime fails.`,
      th: `กลไกนำที่เหมาะตอนนี้คือ ${FINANCE_MECHANISMS[financeChoice.primaryFinance].label.th} เมืองต้องตอบให้ได้ว่าใครจ่าย ใครเดินระบบ และใครรับผิดเมื่อ uptime พัง`,
      zh: `当前最合适的主机制是 ${FINANCE_MECHANISMS[financeChoice.primaryFinance].label.zh}。城市必须回答清楚：谁出钱、谁运营、谁在 uptime 失灵时背锅。`,
    },
    partnerships: city.smartDimensions.length >= 4
      ? {
          en: "The city has enough cross-domain ambition to justify a formal partner map across operators, universities, civic groups, and vendors.",
          th: "เมืองนี้มีความทะเยอทะยานข้ามมิติมากพอที่จะต้องทำ partner map อย่างเป็นทางการระหว่างผู้ให้บริการ มหาวิทยาลัย ภาคประชาชน และผู้ขาย",
          zh: "这座城市的跨领域 ambition 已经够大，应该把运营商、大学、社区组织与供应商正式画成一张伙伴地图。",
        }
      : {
          en: "Partnering should stay focused. Pick the operators and institutions tied to the city's active domains, not everyone who wants a logo wall.",
          th: "การจับมือควรคม เลือกเฉพาะผู้ให้บริการและสถาบันที่ผูกกับมิติที่เมืองกำลังทำจริง ไม่ใช่ใครอยากได้โลโก้ก็ใส่หมด",
          zh: "合作要收紧。只选和城市当前活跃领域真正相关的运营方与机构，不是任何想上 logo 墙的人都收。",
        },
  };
}

function buildToolkitIds(city: SmartCity, stepStatus: Record<PlanningStepId, PlanningStepStatus>): ToolkitId[] {
  const toolkitIds = new Set<ToolkitId>(["vision_area_canvas", "finance_model_canvas"]);

  if (stepStatus.infrastructure !== "ready") toolkitIds.add("digital_infra_checklist");
  if (stepStatus.dataPlatform !== "ready") {
    toolkitIds.add("cdp_blueprint");
    toolkitIds.add("data_go_th_connector");
  }
  if (stepStatus.partnerships !== "ready" || city.smartDimensions.length >= 3) {
    toolkitIds.add("partnership_playbook");
  }

  return [...toolkitIds];
}

function buildResourceIds(city: SmartCity): ResourceId[] {
  const resourceIds = new Set<ResourceId>([
    "depa_program",
    "municipal_budget",
    "data_go_th",
    "nso_gistda_stack",
  ]);

  if (city.smartDimensions.includes("mobility") || city.smartDimensions.includes("energy")) {
    resourceIds.add("ppp_office");
    resourceIds.add("private_operator_market");
  }
  if (city.smartDimensions.includes("environment") || city.region === "south") {
    resourceIds.add("climate_finance");
  }

  return [...resourceIds];
}

function buildGlobalModelIds(city: SmartCity): GlobalModelId[] {
  const models = new Set<GlobalModelId>();

  if (city.smartDimensions.includes("governance")) models.add("seoul_citizen_reporting");
  if (city.scores.digital >= 55) {
    models.add("barcelona_city_data");
    models.add("singapore_digital_stack");
  }
  if (city.smartDimensions.includes("environment") || city.smartDimensions.includes("energy")) {
    models.add("copenhagen_energy");
  }
  if (city.smartDimensions.includes("mobility")) {
    models.add("curitiba_transit");
    models.add("medellin_land_value");
  }
  if (models.size === 0) {
    models.add("barcelona_city_data");
    models.add("seoul_citizen_reporting");
  }

  return [...models].slice(0, 3);
}

function deriveCityPlanningProfile(city: SmartCity): CityPlanningProfile {
  const stepStatus = buildStepStatus(city);
  const financeChoice = pickFinanceMechanisms(city);

  return {
    cityId: city.id,
    stepStatus,
    stepNotes: buildStepNotes(city, financeChoice),
    primaryFinance: financeChoice.primaryFinance,
    secondaryFinance: financeChoice.secondaryFinance,
    concessionYears: financeChoice.concessionYears,
    toolkitIds: buildToolkitIds(city, stepStatus),
    resourceIds: buildResourceIds(city),
    globalModelIds: buildGlobalModelIds(city),
    deliveryNote: financeChoice.deliveryNote,
  };
}

const CITY_PLANNING_PROFILES = new Map(
  allCities.map(city => [city.id, deriveCityPlanningProfile(city)]),
);

export function getCityPlanningProfile(cityId: string): CityPlanningProfile | undefined {
  return CITY_PLANNING_PROFILES.get(cityId);
}

export function getCityDomainProxies(city: SmartCity): DomainProxy[] {
  return (Object.keys(DOMAIN_PROXY_PILLARS) as SmartDimension[]).map(dimension => {
    const pillars = DOMAIN_PROXY_PILLARS[dimension];
    const proxyScore = roundScore(
      pillars.reduce((sum, pillar) => sum + city.scores[pillar], 0) / pillars.length,
    );

    return {
      dimension,
      active: city.smartDimensions.includes(dimension),
      proxyScore,
      initiative: DOMAIN_PROXY_COPY[dimension],
    };
  });
}

function csvEscape(value: string): string {
  return `"${value.replaceAll(`"`, `""`)}"`;
}

export const CITY_PLANNING_DATASET_CSV = [
  [
    "cityId",
    "status",
    "reality",
    "tier",
    "vision",
    "infrastructure",
    "dataPlatform",
    "businessModel",
    "partnerships",
    "primaryFinance",
    "secondaryFinance",
    "concessionYears",
    "toolkits",
    "resources",
    "globalModels",
  ].join(","),
  ...allCities.map(city => {
    const profile = getCityPlanningProfile(city.id);
    if (!profile) return "";

    return [
      city.id,
      city.status,
      city.reality,
      city.tier,
      profile.stepStatus.vision,
      profile.stepStatus.infrastructure,
      profile.stepStatus.dataPlatform,
      profile.stepStatus.businessModel,
      profile.stepStatus.partnerships,
      profile.primaryFinance,
      profile.secondaryFinance,
      profile.concessionYears ?? "",
      profile.toolkitIds.join("|"),
      profile.resourceIds.join("|"),
      profile.globalModelIds.join("|"),
    ]
      .map(csvEscape)
      .join(",");
  }),
].join("\n");

export function getLocalizedPlanningStatus(status: PlanningStepStatus, locale: Locale): string {
  return localized(locale, PLANNING_STATUS_META[status].label);
}

export function getLocalizedFinanceMechanism(
  mechanismId: FinanceMechanismId,
  locale: Locale,
): FinanceMechanismDefinition {
  return FINANCE_MECHANISMS[mechanismId];
}

export function getLocalizedToolkit(toolkitId: ToolkitId): ToolkitDefinition {
  return TOOLKITS[toolkitId];
}

export function getLocalizedResource(resourceId: ResourceId): ResourceDefinition {
  return RESOURCES[resourceId];
}

export function getLocalizedGlobalModel(globalModelId: GlobalModelId): GlobalModelDefinition {
  return GLOBAL_MODELS[globalModelId];
}
