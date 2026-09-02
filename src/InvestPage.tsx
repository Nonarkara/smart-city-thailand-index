import { translate } from "./cityPresentation";
import InvestCityDirectory from "./InvestCityDirectory";
import InvestCityLens from "./InvestCityLens";
import type { Locale } from "./types";
import { useInView } from "./useInView";
import { assetUrl } from "./assetUtils";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

/* ─── DATA STRUCTURES ─── */

interface MacroStat {
  label: { en: string; th: string; zh: string };
  value: string;
  sub: { en: string; th: string; zh: string };
}

const macroStats: MacroStat[] = [
  {
    label: { en: "GDP (2024)", th: "GDP (2567)", zh: "GDP (2024)" },
    value: "$515B",
    sub: { en: "2.5% growth YoY", th: "เติบโต 2.5% YoY", zh: "同比增长2.5%" },
  },
  {
    label: { en: "FDI Inflows", th: "FDI ไหลเข้า", zh: "FDI流入" },
    value: "$10.2B",
    sub: { en: "BOI 2024 Annual Report", th: "รายงานประจำปี BOI 2567", zh: "BOI 2024年度报告" },
  },
  {
    label: { en: "Digital Economy Target", th: "เป้าหมายเศรษฐกิจดิจิทัล", zh: "数字经济目标" },
    value: "22%",
    sub: { en: "of GDP by 2027 (NESDC)", th: "ของ GDP ภายใน 2570 (สศช.)", zh: "占GDP比重，2027年目标 (NESDC)" },
  },
  {
    label: { en: "Smart City National Target", th: "เป้าหมายเมืองอัจฉริยะ", zh: "智慧城市国家目标" },
    value: "105",
    sub: { en: "cities by 2027 (depa)", th: "เมือง ภายใน 2570 (depa)", zh: "座城市，2027年目标 (depa)" },
  },
  {
    label: { en: "BOI Tax Holiday", th: "สิทธิประโยชน์ BOI", zh: "BOI税收优惠" },
    value: "8yr",
    sub: { en: "CIT exemption, targeted industries", th: "ยกเว้น CIT สำหรับอุตสาหกรรมเป้าหมาย", zh: "企业所得税免除，目标产业" },
  },
  {
    label: { en: "EEC Committed Investment", th: "การลงทุน EEC ที่ผูกพัน", zh: "EEC承诺投资" },
    value: "$43B",
    sub: { en: "Eastern Economic Corridor", th: "ระเบียงเศรษฐกิจพิเศษภาคตะวันออก", zh: "东部经济走廊" },
  },
  {
    label: { en: "Climate Investment Needed", th: "การลงทุนด้านภูมิอากาศที่ต้องการ", zh: "所需气候投资" },
    value: "$219B",
    sub: { en: "over 25 years · World Bank CCDR 2025", th: "ใน 25 ปี · ธนาคารโลก CCDR 2568", zh: "25年内 · 世界银行CCDR 2025" },
  },
  {
    label: { en: "GDP at Risk by 2050", th: "GDP ที่เสี่ยงภายในปี 2593", zh: "2050年GDP风险" },
    value: "7–14%",
    sub: { en: "BAU climate scenario · World Bank CCDR 2025", th: "กรณีฐานภูมิอากาศ · ธนาคารโลก CCDR 2568", zh: "常规气候情景 · 世界银行CCDR 2025" },
  },
];

interface InsightCard {
  tier: string;
  tierColor: string;
  headline: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
}

const insightCards: InsightCard[] = [
  {
    tier: "Alpha",
    tierColor: "var(--teal)",
    headline: {
      en: "Composite score 65+ = Investable NOW",
      th: "คะแนนรวม 65+ = ลงทุนได้ทันที",
      zh: "综合评分65+ = 当下可投资",
    },
    body: {
      en: "Alpha cities have operational infrastructure, live data pipelines, and measurable citizen outcomes. Currently 9 cities qualify. These are not promises — they are running systems.",
      th: "เมือง Alpha มีโครงสร้างพื้นฐานที่ใช้งานจริง มี data pipeline ที่ทำงานอยู่ และมีผลลัพธ์สำหรับพลเมืองที่วัดได้ ปัจจุบันมี 9 เมืองที่ผ่านเกณฑ์ สิ่งเหล่านี้ไม่ใช่คำสัญญา แต่คือระบบที่ทำงานจริง",
      zh: "Alpha城市拥有运营中的基础设施、实时数据管道和可衡量的市民成效。目前有9座城市达标。这些不是承诺，而是运行中的系统。",
    },
  },
  {
    tier: "Beta",
    tierColor: "var(--gold)",
    headline: {
      en: "Score 45-64.9 = The growth arbitrage",
      th: "คะแนน 45-64.9 = โอกาสเก็งกำไรจากการเติบโต",
      zh: "评分45-64.9 = 增长套利机会",
    },
    body: {
      en: "Infrastructure is actively building, governance is partially digitized, and community buy-in is emerging. Entry at a discount before operational maturity. The 2-3 year window is open.",
      th: "โครงสร้างพื้นฐานกำลังก่อสร้าง การปกครองดิจิทัลเริ่มเป็นรูปเป็นร่าง และชุมชนเริ่มยอมรับ เข้าลงทุนในราคาส่วนลดก่อนจะเติบโตเต็มที่ หน้าต่าง 2-3 ปียังเปิดอยู่",
      zh: "基础设施正在积极建设，治理部分数字化，社区参与度正在提升。在运营成熟之前以折价进入。2-3年的窗口期仍然开放。",
    },
  },
  {
    tier: "Gamma",
    tierColor: "var(--3)",
    headline: {
      en: "Score below 45 = Too early for most capital",
      th: "คะแนนต่ำกว่า 45 = เร็วเกินไปสำหรับทุนส่วนใหญ่",
      zh: "评分低于45 = 对多数资本而言为时尚早",
    },
    body: {
      en: "Paper plans, no live data, limited governance capacity. May have depa certification but zero operational evidence. Wait for Beta transition signals before committing capital.",
      th: "มีแค่แผนบนกระดาษ ไม่มีข้อมูลจริง ศักยภาพการปกครองจำกัด อาจมีการรับรองจาก depa แต่ไม่มีหลักฐานการดำเนินงานจริง รอสัญญาณการเปลี่ยนผ่านสู่ Beta ก่อนลงเงิน",
      zh: "仅有纸面规划，无实时数据，治理能力有限。可能持有depa认证，但零运营证据。等待Beta转型信号后再投入资本。",
    },
  },
  {
    tier: "LIV 25%",
    tierColor: "var(--teal)",
    headline: {
      en: "Livability score correlates with property demand",
      th: "คะแนนความน่าอยู่สัมพันธ์กับอุปสงค์อสังหาริมทรัพย์",
      zh: "宜居评分与房产需求正相关",
    },
    body: {
      en: "Cities with high livability scores (top quartile) see 3-5% annual property appreciation. The 25% weighting in SCITI reflects this: livability is the single largest driver of long-term urban value.",
      th: "เมืองที่มีคะแนนความน่าอยู่สูง (ควอไทล์บน) มีราคาอสังหาริมทรัพย์เพิ่มขึ้น 3-5% ต่อปี น้ำหนัก 25% ใน SCITI สะท้อนสิ่งนี้: ความน่าอยู่คือตัวขับเคลื่อนหลักของมูลค่าเมืองระยะยาว",
      zh: "宜居评分高（上四分位）的城市年房产增值率达3-5%。SCITI中25%的权重反映了这一点：宜居性是城市长期价值的最大驱动因素。",
    },
  },
  {
    tier: "DIG 5%",
    tierColor: "#9B5DE5",
    headline: {
      en: "Digital score = Leading indicator of future readiness",
      th: "คะแนนดิจิทัล = ตัวชี้นำความพร้อมในอนาคต",
      zh: "数字评分 = 未来就绪度的领先指标",
    },
    body: {
      en: "Only 5% weight, but diagnostic. Cities that score high on Digital today are building the infrastructure for tomorrow's services. Low digital + high livability = a city coasting on legacy. High digital + low livability = investment thesis in motion.",
      th: "มีน้ำหนักเพียง 5% แต่เป็นตัวชี้วัดสำคัญ เมืองที่ได้คะแนน Digital สูงวันนี้กำลังสร้างโครงสร้างพื้นฐานเพื่อบริการในอนาคต Digital ต่ำ + ความน่าอยู่สูง = เมืองที่พึ่งพามรดกเดิม Digital สูง + ความน่าอยู่ต่ำ = สมมติฐานการลงทุนที่กำลังก่อตัว",
      zh: "仅占5%权重，但具诊断性。今天数字评分高的城市正在为明天的服务构建基础设施。低数字+高宜居=依赖存量的城市。高数字+低宜居=正在验证中的投资论点。",
    },
  },
];

interface Mechanism {
  name: { en: string; th: string; zh: string };
  desc: { en: string; th: string; zh: string };
  tag: string;
}

const mechanisms: Mechanism[] = [
  {
    name: { en: "BOI Privileges (Section 31)", th: "สิทธิประโยชน์ BOI (มาตรา 31)", zh: "BOI优惠 (第31条)" },
    desc: {
      en: "8-year corporate income tax exemption for S-Curve industries including digital, robotics, aviation, biofuel, and medical hub sectors.",
      th: "ยกเว้นภาษีเงินได้นิติบุคคล 8 ปี สำหรับอุตสาหกรรม S-Curve ได้แก่ ดิจิทัล หุ่นยนต์ การบิน เชื้อเพลิงชีวภาพ และศูนย์กลางการแพทย์",
      zh: "S曲线产业（包括数字、机器人、航空、生物燃料和医疗中心）可享8年企业所得税免除。",
    },
    tag: "Tax",
  },
  {
    name: { en: "ADB ACGF", th: "ADB ACGF", zh: "亚行ACGF" },
    desc: {
      en: "ASEAN Catalytic Green Finance Facility. De-risks green infrastructure investments via co-lending and credit enhancement for smart city projects.",
      th: "ASEAN Catalytic Green Finance Facility ลดความเสี่ยงการลงทุนโครงสร้างพื้นฐานสีเขียวผ่านการร่วมให้กู้และการเพิ่มเครดิตสำหรับโครงการเมืองอัจฉริยะ",
      zh: "东盟催化绿色金融机制。通过联合贷款和信用增强为智慧城市项目的绿色基础设施投资降低风险。",
    },
    tag: "Green",
  },
  {
    name: { en: "Thailand Green Bond Framework", th: "กรอบพันธบัตรเขียวไทย", zh: "泰国绿色债券框架" },
    desc: {
      en: "SEC-regulated framework allowing municipal and corporate green bond issuance for sustainable urban development.",
      th: "กรอบที่ กลต. กำกับดูแล อนุญาตให้เทศบาลและบริษัทออกพันธบัตรเขียวเพื่อการพัฒนาเมืองอย่างยั่งยืน",
      zh: "证监会监管框架，允许市政和企业发行绿色债券用于可持续城市发展。",
    },
    tag: "Bond",
  },
  {
    name: { en: "PPP Frameworks (KKTS Model)", th: "กรอบ PPP (โมเดล KKTS)", zh: "PPP框架 (KKTS模式)" },
    desc: {
      en: "Public-Private Partnership templates pioneered by Khon Kaen. Local consortium co-invests in transit, digital health, and urban services. Replicable to other secondary cities.",
      th: "รูปแบบ PPP ที่บุกเบิกโดยขอนแก่น กลุ่มเอกชนในพื้นที่ร่วมลงทุนในระบบขนส่ง สุขภาพดิจิทัล และบริการเมือง สามารถจำลองไปยังเมืองรองอื่นได้",
      zh: "由孔敬开创的公私合作模板。地方联盟共同投资交通、数字健康和城市服务。可复制到其他二线城市。",
    },
    tag: "PPP",
  },
  {
    name: { en: "ASEAN Smart City Financing Toolkit", th: "ชุดเครื่องมือการเงินเมืองอัจฉริยะ ASEAN", zh: "东盟智慧城市融资工具包" },
    desc: {
      en: "Regional framework providing blended finance templates, risk assessment tools, and cross-border investment facilitation for ASCN member cities.",
      th: "กรอบระดับภูมิภาคที่ให้แม่แบบการเงินผสม เครื่องมือประเมินความเสี่ยง และการอำนวยความสะดวกการลงทุนข้ามพรมแดนสำหรับเมืองสมาชิก ASCN",
      zh: "区域框架，为ASCN成员城市提供混合融资模板、风险评估工具和跨境投资便利化。",
    },
    tag: "ASEAN",
  },
  {
    name: { en: "UNCDF Smart Green ASEAN Cities", th: "UNCDF Smart Green ASEAN Cities", zh: "UNCDF智慧绿色东盟城市" },
    desc: {
      en: "UN Capital Development Fund program supporting municipal finance innovation and climate-resilient urban infrastructure in ASEAN cities.",
      th: "โครงการกองทุนพัฒนาเมืองหลวงแห่งสหประชาชาติ สนับสนุนนวัตกรรมการเงินเทศบาลและโครงสร้างพื้นฐานเมืองที่ทนต่อสภาพภูมิอากาศในเมือง ASEAN",
      zh: "联合国资本发展基金项目，支持东盟城市的市政金融创新和气候适应型城市基础设施。",
    },
    tag: "UN",
  },
  // ─── World Bank CCDR 2025 — three additional mechanisms from the climate finance analysis ───
  {
    name: { en: "Carbon Pricing Revenue Mechanism", th: "กลไกรายได้จากราคาคาร์บอน", zh: "碳定价收入机制" },
    desc: {
      en: "World Bank CCDR 2025: carbon pricing could generate revenue equivalent to ~1% of GDP annually. Thailand's voluntary carbon market and emerging carbon tax framework create early-mover positioning for climate-smart city bonds and green project finance.",
      th: "ธนาคารโลก CCDR 2025: การกำหนดราคาคาร์บอนสามารถสร้างรายได้เทียบเท่า ~1% ของ GDP ต่อปี ตลาดคาร์บอนโดยสมัครใจของไทยและกรอบภาษีคาร์บอนที่กำลังเกิดขึ้นสร้างตำแหน่งผู้เข้าก่อนสำหรับพันธบัตรเมืองอัจฉริยะที่เป็นมิตรกับสภาพภูมิอากาศ",
      zh: "世银CCDR 2025：碳定价每年可产生约1% GDP的收入。泰国自愿碳市场和新兴碳税框架为气候智慧城市债券和绿色项目融资创造了先发优势。",
    },
    tag: "Carbon",
  },
  {
    name: { en: "Concessional Co-Finance (Climate Resilience)", th: "การร่วมจัดหาเงินทุนแบบผ่อนปรน (ความยืดหยุ่นด้านสภาพภูมิอากาศ)", zh: "优惠联合融资（气候韧性）" },
    desc: {
      en: "World Bank CCDR 2025 recommends concessional loans, results-based subsidies, and co-financing tied explicitly to climate resilience outcomes — particularly for nature-based solutions (coastal mangroves, watershed management) where private returns are below social returns. ADB, World Bank, and bilateral donors are actively deploying in Thailand.",
      th: "ธนาคารโลก CCDR 2025 แนะนำเงินกู้ผ่อนปรน เงินอุดหนุนตามผลลัพธ์ และการร่วมจัดหาเงินทุนที่ผูกโยงกับผลลัพธ์ความยืดหยุ่นด้านสภาพภูมิอากาศโดยเฉพาะ — โดยเฉพาะสำหรับโซลูชันที่อิงธรรมชาติที่ผลตอบแทนส่วนตัวต่ำกว่าผลตอบแทนทางสังคม",
      zh: "世银CCDR 2025建议优惠贷款、基于结果的补贴和与气候韧性成效明确挂钩的联合融资——特别是对于自然解决方案（滨海红树林、流域管理），这些领域私人回报低于社会回报。",
    },
    tag: "Blended",
  },
  {
    name: { en: "Catastrophe Bonds + Climate Insurance", th: "พันธบัตรหายนะ + ประกันสภาพภูมิอากาศ", zh: "巨灾债券 + 气候保险" },
    desc: {
      en: "World Bank CCDR 2025 explicitly recommends catastrophe bonds, biodiversity bonds, and climate insurance as financial instruments that need to be scaled in Thailand. The 2011 floods (USD 46.5B damage, 12.6% of GDP) with a 50% chance of recurrence by 2050 make parametric flood insurance and cat bonds a structurally necessary risk-transfer instrument — not a niche product.",
      th: "ธนาคารโลก CCDR 2025 แนะนำพันธบัตรหายนะ พันธบัตรความหลากหลายทางชีวภาพ และประกันสภาพภูมิอากาศเป็นเครื่องมือทางการเงินที่ต้องขยายใหญ่ขึ้นในไทย น้ำท่วมปี 2554 (เสียหาย 4.65 หมื่นล้าน USD, 12.6% ของ GDP) ที่มีโอกาสเกิดซ้ำ 50% ภายในปี 2593 ทำให้ประกันน้ำท่วมแบบพารามิเตอร์และ cat bonds เป็นเครื่องมือโอนความเสี่ยงที่จำเป็นเชิงโครงสร้าง",
      zh: "世银CCDR 2025明确建议将巨灾债券、生物多样性债券和气候保险作为需要在泰国扩大规模的金融工具。2011年洪灾（损失465亿美元，占GDP12.6%）到2050年有50%的复发概率，使得参数化洪水保险和巨灾债券成为结构性必要的风险转移工具——而非利基产品。",
    },
    tag: "Risk",
  },
];

interface Risk {
  icon: string;
  title: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  severity: "high" | "medium" | "low";
}

const risks: Risk[] = [
  {
    icon: "GOV",
    title: {
      en: "Centralized Bureaucracy",
      th: "ระบบราชการรวมศูนย์",
      zh: "中央集权官僚体制",
    },
    body: {
      en: "Local governments cannot issue bonds independently. Budget approval flows through Bangkok, creating 12-18 month delays. Municipal autonomy remains aspirational.",
      th: "องค์กรปกครองส่วนท้องถิ่นไม่สามารถออกพันธบัตรได้อย่างอิสระ การอนุมัติงบประมาณผ่านกรุงเทพฯ ทำให้เกิดความล่าช้า 12-18 เดือน ความเป็นอิสระของเทศบาลยังเป็นเพียงความใฝ่ฝัน",
      zh: "地方政府无法独立发行债券。预算审批需经曼谷，造成12-18个月延误。市政自治仍是愿景。",
    },
    severity: "high",
  },
  {
    icon: "DIG",
    title: {
      en: "Digital Divide",
      th: "ความเหลื่อมล้ำดิจิทัล",
      zh: "数字鸿沟",
    },
    body: {
      en: "Only 21% household computer ownership outside Bangkok (NSO 2023). Smart city platforms assume connectivity that doesn't exist in target populations. Mobile-first is not a choice — it's a constraint.",
      th: "ครัวเรือนที่มีคอมพิวเตอร์นอกกรุงเทพฯ เพียง 21% (สสช. 2566) แพลตฟอร์มเมืองอัจฉริยะสมมติว่ามีการเชื่อมต่อที่ไม่มีอยู่จริงในกลุ่มเป้าหมาย Mobile-first ไม่ใช่ทางเลือก แต่เป็นข้อจำกัด",
      zh: "曼谷以外家庭电脑拥有率仅21%（NSO 2023）。智慧城市平台假设了目标人群中不存在的连接性。移动优先不是选择——而是约束条件。",
    },
    severity: "high",
  },
  {
    icon: "DAT",
    title: {
      en: "Data Quality & Continuity",
      th: "คุณภาพและความต่อเนื่องของข้อมูล",
      zh: "数据质量与连续性",
    },
    body: {
      en: "Many City Data Platforms (CDPs) go offline within 18 months of launch. Sensor maintenance budgets are rarely provisioned beyond the initial grant cycle. What you see at a demo may not exist 2 years later.",
      th: "City Data Platform (CDP) จำนวนมากหยุดทำงานภายใน 18 เดือนหลังเปิดตัว งบประมาณบำรุงรักษาเซ็นเซอร์แทบไม่ได้รับการจัดสรรหลังรอบทุนเริ่มต้น สิ่งที่เห็นในการสาธิตอาจไม่มีอยู่ในอีก 2 ปี",
      zh: "许多城市数据平台（CDP）在启动18个月内下线。传感器维护预算很少在初始资助周期之后得到拨备。演示中看到的可能两年后就不存在了。",
    },
    severity: "high",
  },
  {
    icon: "POL",
    title: {
      en: "Political Transitions",
      th: "การเปลี่ยนผ่านทางการเมือง",
      zh: "政治过渡",
    },
    body: {
      en: "Smart city projects span 5-10 year horizons. Thai political cycles are shorter. New administrations may deprioritize or rebrand predecessors' initiatives. Seek projects with private-sector co-ownership.",
      th: "โครงการเมืองอัจฉริยะมีระยะเวลา 5-10 ปี วัฏจักรการเมืองไทยสั้นกว่า รัฐบาลใหม่อาจลดความสำคัญหรือเปลี่ยนชื่อโครงการของรัฐบาลก่อน ควรหาโครงการที่มีภาคเอกชนร่วมเป็นเจ้าของ",
      zh: "智慧城市项目跨度5-10年。泰国政治周期更短。新政府可能降低优先级或重新包装前任的项目。应寻求有私营部门共同所有权的项目。",
    },
    severity: "medium",
  },
  {
    icon: "OWN",
    title: {
      en: "Foreign Ownership Restrictions",
      th: "ข้อจำกัดการถือครองของต่างชาติ",
      zh: "外资持股限制",
    },
    body: {
      en: "Foreign investors are limited to 49% ownership in most sectors under the Foreign Business Act. Land ownership is prohibited for non-Thai nationals, though BOI-promoted companies receive exemptions on certain restrictions.",
      th: "นักลงทุนต่างชาติถูกจำกัดการถือหุ้นไม่เกิน 49% ในส่วนใหญ่ภายใต้ พ.ร.บ. การประกอบธุรกิจของคนต่างด้าว การถือครองที่ดินไม่อนุญาตสำหรับชาวต่างชาติ แม้บริษัทที่ได้รับส่งเสริมจาก BOI จะได้รับยกเว้นข้อจำกัดบางประการ",
      zh: "根据《外商经营法》，外国投资者在大多数行业的持股比例限制为49%。非泰国国民禁止拥有土地，但BOI促进的企业可豁免某些限制。",
    },
    severity: "medium",
  },
  {
    icon: "FX",
    title: {
      en: "Currency Risk (THB)",
      th: "ความเสี่ยงค่าเงิน (บาท)",
      zh: "汇率风险 (泰铢)",
    },
    body: {
      en: "THB has shown 8-12% volatility against USD over 5-year periods. Revenue in baht, returns expected in hard currency — the mismatch can erode margins on infrastructure-scale investments.",
      th: "เงินบาทมีความผันผวน 8-12% เทียบกับดอลลาร์สหรัฐในช่วง 5 ปี รายได้เป็นบาท ผลตอบแทนคาดหวังเป็นสกุลเงินแข็ง ความไม่สอดคล้องกันนี้สามารถกัดกร่อนมาร์จินของการลงทุนระดับโครงสร้างพื้นฐาน",
      zh: "泰铢兑美元在5年期间波动率为8-12%。收入以泰铢计，回报以硬通货预期——这种不匹配可能侵蚀基础设施规模投资的利润率。",
    },
    severity: "low",
  },
];

interface ChecklistItem {
  num: string;
  title: { en: string; th: string; zh: string };
  desc: { en: string; th: string; zh: string };
}

const checklist: ChecklistItem[] = [
  {
    num: "01",
    title: { en: "Verify SCITI tier independently", th: "ตรวจสอบระดับ SCITI อย่างอิสระ", zh: "独立验证SCITI层级" },
    desc: { en: "Don't rely on depa certification alone. Check the SCITI composite score, pillar breakdown, and data confidence rating.", th: "อย่าพึ่งพาเฉพาะการรับรอง depa ตรวจสอบคะแนนรวม SCITI การแยกตามเสาหลัก และระดับความเชื่อมั่นของข้อมูล", zh: "不要仅依赖depa认证。检查SCITI综合评分、支柱分解和数据置信度评级。" },
  },
  {
    num: "02",
    title: { en: "Test the City Data Platform live", th: "ทดสอบ City Data Platform แบบสด", zh: "实时测试城市数据平台" },
    desc: { en: "Access the CDP. If the dashboard is offline or data is stale (>30 days), the operational maturity is overstated.", th: "เข้าถึง CDP ถ้าแดชบอร์ดออฟไลน์หรือข้อมูลเก่า (>30 วัน) ความสมบูรณ์ในการดำเนินงานถูกพูดเกินจริง", zh: "访问CDP。如果仪表板离线或数据过时（>30天），则运营成熟度被夸大。" },
  },
  {
    num: "03",
    title: { en: "Map the local governance structure", th: "วิเคราะห์โครงสร้างการปกครองท้องถิ่น", zh: "梳理地方治理架构" },
    desc: { en: "Who decides? Municipality, PAO, special zone authority, or private consortium? Each has different procurement timelines and risk profiles.", th: "ใครตัดสินใจ? เทศบาล อบจ. เขตพิเศษ หรือกลุ่มเอกชน? แต่ละแห่งมีระยะเวลาจัดซื้อจัดจ้างและโปรไฟล์ความเสี่ยงต่างกัน", zh: "谁做决策？市政府、省级行政组织、特区管理局还是民间联盟？各有不同的采购时间线和风险特征。" },
  },
  {
    num: "04",
    title: { en: "Check BOI eligibility before structuring", th: "ตรวจสอบสิทธิ์ BOI ก่อนจัดโครงสร้าง", zh: "结构设计前检查BOI资格" },
    desc: { en: "BOI incentives vary dramatically by sector, location (EEC vs. non-EEC), and activity type. Structure the entity before committing capital.", th: "สิทธิประโยชน์ BOI แตกต่างมากตามภาค สถานที่ (EEC vs. ไม่ใช่ EEC) และประเภทกิจกรรม จัดโครงสร้างนิติบุคคลก่อนลงเงิน", zh: "BOI优惠因行业、地点（EEC与非EEC）和活动类型差异巨大。在投入资本前确定实体结构。" },
  },
  {
    num: "05",
    title: { en: "Audit the maintenance budget", th: "ตรวจสอบงบประมาณบำรุงรักษา", zh: "审计维护预算" },
    desc: { en: "Smart city projects fail post-launch, not during construction. Is there a 5-year OpEx budget for sensor maintenance, software updates, and staff training?", th: "โครงการเมืองอัจฉริยะล้มเหลวหลังเปิดตัว ไม่ใช่ระหว่างก่อสร้าง มีงบ OpEx 5 ปีสำหรับบำรุงรักษาเซ็นเซอร์ อัปเดตซอฟต์แวร์ และฝึกอบรมบุคลากรหรือไม่?", zh: "智慧城市项目在启动后失败，而非建设期间。是否有5年运维预算用于传感器维护、软件更新和人员培训？" },
  },
  {
    num: "06",
    title: { en: "Assess community buy-in on the ground", th: "ประเมินการยอมรับของชุมชนในพื้นที่", zh: "实地评估社区接受度" },
    desc: { en: "Visit. Talk to residents, not officials. If citizens don't know the smart city program exists, adoption risk is severe.", th: "ไปเยี่ยมชม พูดคุยกับชาวบ้าน ไม่ใช่เจ้าหน้าที่ ถ้าประชาชนไม่รู้ว่ามีโครงการเมืองอัจฉริยะ ความเสี่ยงด้านการยอมรับรุนแรง", zh: "实地走访。与居民交谈，而非官员。如果市民不知道智慧城市项目的存在，采用风险极高。" },
  },
  {
    num: "07",
    title: { en: "Model currency exposure explicitly", th: "จำลองความเสี่ยงค่าเงินอย่างชัดเจน", zh: "明确建模汇率敞口" },
    desc: { en: "Revenue in THB, returns expected in USD/EUR/CNY. Model the FX impact over 5-10 year horizons. Consider natural hedges via export revenue.", th: "รายได้เป็นบาท ผลตอบแทนคาดหวังเป็น USD/EUR/CNY จำลองผลกระทบ FX ในระยะ 5-10 ปี พิจารณาการป้องกันความเสี่ยงธรรมชาติผ่านรายได้ส่งออก", zh: "收入以泰铢计，回报以USD/EUR/CNY预期。对5-10年期进行汇率影响建模。考虑通过出口收入进行自然对冲。" },
  },
  {
    num: "08",
    title: { en: "Evaluate the political cycle alignment", th: "ประเมินความสอดคล้องกับวัฏจักรการเมือง", zh: "评估政治周期对齐度" },
    desc: { en: "When is the next election? Who championed this project? Is there cross-party support or single-patron dependency?", th: "การเลือกตั้งครั้งต่อไปเมื่อไร? ใครผลักดันโครงการนี้? มีการสนับสนุนข้ามพรรคหรือพึ่งพาผู้อุปถัมภ์คนเดียว?", zh: "下次选举是什么时候？谁推动了该项目？是跨党派支持还是单一庇护人依赖？" },
  },
  {
    num: "09",
    title: { en: "Confirm data sovereignty and privacy compliance", th: "ยืนยันอธิปไตยข้อมูลและการปฏิบัติตามความเป็นส่วนตัว", zh: "确认数据主权和隐私合规" },
    desc: { en: "Thailand's PDPA (Personal Data Protection Act) is now enforced. Ensure IoT data collection, storage, and cross-border transfer comply.", th: "พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคลของไทย (PDPA) บังคับใช้แล้ว ตรวจสอบให้แน่ใจว่าการเก็บ จัดเก็บ และโอนข้อมูล IoT ข้ามพรมแดนเป็นไปตามกฎหมาย", zh: "泰国《个人数据保护法》（PDPA）已生效。确保物联网数据的采集、存储和跨境传输合规。" },
  },
  {
    num: "10",
    title: { en: "Benchmark against SCITI, not marketing decks", th: "เปรียบเทียบกับ SCITI ไม่ใช่สไลด์การตลาด", zh: "以SCITI为基准，而非营销材料" },
    desc: { en: "Our index is designed to be the brutally honest mirror. Use the pillar scores, data confidence ratings, and tier classifications as your baseline — not the city's own promotional material.", th: "ดัชนีของเราถูกออกแบบให้เป็นกระจกสะท้อนความจริงอย่างตรงไปตรงมา ใช้คะแนนเสาหลัก ระดับความเชื่อมั่นข้อมูล และการจัดระดับเป็นพื้นฐาน ไม่ใช่สื่อโฆษณาของเมืองเอง", zh: "我们的指数旨在成为残酷诚实的镜子。以支柱评分、数据置信度评级和层级分类作为基准——而非城市自身的宣传材料。" },
  },
];

interface Source {
  name: string;
  desc: { en: string; th: string; zh: string };
}

const sources: Source[] = [
  { name: "World Bank Open Data", desc: { en: "GDP, FDI aggregates, development indicators", th: "GDP, FDI รวม, ตัวชี้วัดการพัฒนา", zh: "GDP、FDI总量、发展指标" } },
  { name: "BOI Annual Report 2024", desc: { en: "FDI inflows, investment incentive structures, EEC commitments", th: "FDI ไหลเข้า, โครงสร้างสิทธิประโยชน์การลงทุน, พันธสัญญา EEC", zh: "FDI流入、投资优惠结构、EEC承诺" } },
  { name: "NESDC (National Economic and Social Development Council)", desc: { en: "GDP growth forecasts, digital economy targets, national strategy", th: "คาดการณ์การเติบโต GDP, เป้าหมายเศรษฐกิจดิจิทัล, ยุทธศาสตร์ชาติ", zh: "GDP增长预测、数字经济目标、国家战略" } },
  { name: "NSO Thailand (National Statistical Office)", desc: { en: "Household computer ownership, labor force statistics, demographic data", th: "การถือครองคอมพิวเตอร์ครัวเรือน, สถิติแรงงาน, ข้อมูลประชากร", zh: "家庭电脑拥有率、劳动力统计、人口数据" } },
  { name: "depa Smart City Thailand Office", desc: { en: "Smart city designations, CDP status, 105-city roadmap", th: "การกำหนดเมืองอัจฉริยะ, สถานะ CDP, แผน 105 เมือง", zh: "智慧城市认定、CDP状态、105城路线图" } },
  { name: "SCITI 2026 Index", desc: { en: "Composite scores, pillar breakdowns, tier classifications, data confidence ratings", th: "คะแนนรวม, การแยกตามเสาหลัก, การจัดระดับ, ระดับความเชื่อมั่นข้อมูล", zh: "综合评分、支柱分解、层级分类、数据置信度评级" } },
  { name: "ASEAN Smart City Financing Toolkit", desc: { en: "Blended finance frameworks, regional investment facilitation", th: "กรอบการเงินผสม, การอำนวยความสะดวกการลงทุนระดับภูมิภาค", zh: "混合融资框架、区域投资便利化" } },
  { name: "ADB ACGF Reports", desc: { en: "Green finance mechanisms, catalytic co-lending structures", th: "กลไกการเงินสีเขียว, โครงสร้างร่วมให้กู้เชิงเร่งปฏิกิริยา", zh: "绿色金融机制、催化联合贷款结构" } },
  { name: "SEC Thailand Green Bond Framework", desc: { en: "Municipal bond issuance guidelines, sustainable finance taxonomy", th: "แนวทางการออกพันธบัตรเทศบาล, อนุกรมวิธานการเงินอย่างยั่งยืน", zh: "市政债券发行指引、可持续金融分类法" } },
  { name: "IMF World Economic Outlook", desc: { en: "Thailand macroeconomic context, ASEAN growth projections", th: "บริบทเศรษฐกิจมหภาคไทย, ประมาณการเติบโต ASEAN", zh: "泰国宏观经济背景、东盟增长预测" } },
  { name: "UNCTAD World Investment Report", desc: { en: "Cross-border FDI trends, ASEAN investment competitiveness", th: "แนวโน้ม FDI ข้ามพรมแดน, ความสามารถแข่งขันด้านการลงทุน ASEAN", zh: "跨境FDI趋势、东盟投资竞争力" } },
  { name: "World Bank Thailand Country Climate & Development Report (CCDR) 2025", desc: { en: "Climate-economy modelling, $219B investment needs, EEC water security, flood risk projections, coastal erosion, heat stress, carbon pricing mechanisms, financing instruments. Primary source for climate risk data in city dossiers.", th: "แบบจำลองภูมิอากาศ-เศรษฐกิจ, ความต้องการลงทุน 2.19 แสนล้าน USD, ความมั่นคงทางน้ำ EEC, การคาดการณ์ความเสี่ยงน้ำท่วม, การกัดเซาะชายฝั่ง, ความเครียดจากความร้อน, กลไกราคาคาร์บอน, เครื่องมือทางการเงิน แหล่งข้อมูลหลักสำหรับข้อมูลความเสี่ยงด้านภูมิอากาศในแฟ้มเมือง", zh: "气候-经济模型，2190亿美元投资需求，EEC水安全，洪水风险预测，海岸侵蚀，热应力，碳定价机制，金融工具。城市档案气候风险数据的主要来源。" } },
];

/* ─── COMPONENT ─── */

export default function InvestPage({ locale, onNavigate }: Props) {
  const [macroRef, macroVisible] = useInView(0.1);
  const [insightRef, insightVisible] = useInView(0.1);
  const [mechRef, mechVisible] = useInView(0.1);
  const [riskRef, riskVisible] = useInView(0.1);
  const [ddRef, ddVisible] = useInView(0.1);
  const [srcRef, srcVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.1);

  const severityColor = (s: string) =>
    s === "high" ? "var(--gamma, #E53E3E)" : s === "medium" ? "var(--gold)" : "var(--3)";

  const severityLabel = (s: string) =>
    translate(locale, s === "high"
      ? { en: "High", th: "สูง", zh: "高" }
      : s === "medium"
        ? { en: "Medium", th: "กลาง", zh: "中" }
        : { en: "Low", th: "ต่ำ", zh: "低" });

  return (
    <div className="invest-page">

      {/* ═══════════ 1. HERO / THESIS ═══════════ */}
      <section className="section story-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "Invest Thailand", th: "ลงทุนไทย", zh: "投资泰国" })}</p>
        <h1 className="hero-title">
          {translate(locale, {
            en: "Invest Thailand: The Smart City Opportunity",
            th: "ลงทุนไทย: โอกาสจากเมืองอัจฉริยะ",
            zh: "投资泰国：智慧城市机遇",
          })}
        </h1>
        <p className="hero-strapline">
          {translate(locale, {
            en: "Data from the SCITI index reveals where the real opportunities are — and where the risks hide.",
            th: "ข้อมูลจากดัชนี SCITI เผยให้เห็นว่าโอกาสที่แท้จริงอยู่ที่ไหน และความเสี่ยงซ่อนอยู่ตรงไหน",
            zh: "SCITI指数的数据揭示了真正的机会所在——以及风险隐藏之处。",
          })}
        </p>
      </section>

      {/* ═══════════ SECTION 2: WHAT IS MONEYBALL ═══════════ */}
      <section className="section reveal visible" style={{ paddingTop: 0 }}>
        <div className="invest-ccdr-panel glass-card" style={{ border: "1px solid var(--border)", background: "var(--1)" }}>
          <div className="invest-ccdr-inner">
            <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem" }}>
              {translate(locale, {
                en: "What Is Moneyball?",
                th: "Moneyball คืออะไร",
                zh: "什么是 Moneyball？",
              })}
            </h2>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "In 2002 the Oakland Athletics spent 41 million dollars on players. The New York Yankees spent 126 million. Both teams won 103 games. Oakland matched a payroll three times its size by buying the one statistic that actually wins games — on-base percentage — while everyone else paid for how a player looked. That discipline now has a name: Moneyball. Buy what the data says matters. Ignore what the postcard says.",
                th: "ปี 2002 ทีมเบสบอล Oakland Athletics ใช้งบค่าตัวนักกีฬา 41 ล้านดอลลาร์ ส่วน New York Yankees ใช้ 126 ล้าน ทั้งสองทีมชนะ 103 นัดเท่ากัน Oakland สู้กับงบที่ใหญ่กว่าสามเท่าได้ด้วยการซื้อสถิติเดียวที่ชนะเกมได้จริง — on-base percentage (อัตราการขึ้นถึงเบส) — ขณะที่ทีมอื่นจ่ายเงินให้ 「หน้าตา」 ของนักกีฬา วินัยแบบนี้มีชื่อเรียกในเวลาต่อมาว่า Moneyball: ซื้อสิ่งที่ข้อมูลบอกว่าสำคัญ ไม่ใช่สิ่งที่โปสการ์ดบอก",
                zh: "2002年，奥克兰运动家队在球员身上花了4100万美元，纽约洋基队花了1.26亿。两队同样赢下103场比赛。奥克兰对抗三倍于己的薪资总额，靠的是买下真正能赢球的那项数据——上垒率——而其他球队付钱买的是球员的「长相」。这种纪律后来有了名字：Moneyball。买数据证明重要的东西，而非明信片上的东西。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "Thailand has been scouted by looks for forty years. In 1987, Carabao opened the song 「Welcome to Thailand」 with a tourist's question — 「Tom, Tom, where you go last night?」 — and the confession that follows: 「I love Muang Thai, I like Patpong」. The satire was aimed at visitors who fly ten thousand kilometers and see one street. Capital behaves the same way: it prices Bangkok, Phuket, and the EEC, then calls that Thailand.",
                th: "ประเทศไทยถูก 「ดูจากหน้าตา」 มาสี่สิบปี ปี 2530 คาราบาวเปิดเพลง 「เวลคัมทูไทยแลนด์」 ด้วยคำถามของนักท่องเที่ยว — 「ทอม ทอม แวร์ยูโกลาสไนท์」 — ตามด้วยคำสารภาพ 「ไอเลิฟเมืองไทย ไอไลค์พัฒน์พงศ์」 เพลงนี้เสียดสีผู้มาเยือนที่บินหมื่นกิโลเมตรเพื่อมาเห็นถนนเส้นเดียว เงินทุนก็ทำแบบเดียวกัน: ให้ราคากรุงเทพฯ ภูเก็ต และ EEC แล้วเรียกสิ่งนั้นว่าประเทศไทย",
                zh: "泰国被「以貌取人」了四十年。1987年，卡拉宝乐队（Carabao）的歌曲《欢迎来到泰国》以一句游客的问话开场——「Tom, Tom, where you go last night?」——接着是那句自白：「I love Muang Thai, I like Patpong」。这首歌讽刺的是飞了一万公里却只看一条街的游客。资本的行为如出一辙：它给曼谷、普吉和EEC定价，然后把这叫作泰国。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "What the postcard leaves out is measurable, and this index measures it. A day of labor costs 337–400 baht depending on province (Ministry of Labour, 2025). Appraised urban land runs from under 9,000 baht per square meter in provincial cities to 250,000 in central Bangkok (Treasury Department). Bangkok's cost of living indexes at 43.7 against New York's 100 (Numbeo). Kindness is scored here: hospitality is one of the seven pillars, weighted at 10% — alongside safety, wellbeing, and environment, built from crime rates, road fatalities, hospital beds, and PM2.5, cited per city. Every city page carries a Needs Ladder: eight rungs of what a place must actually get right, from clean air to commute stress, scored only where real data exists. The gap between what Thailand is and what Thailand is priced at — that is the trade.",
                th: "สิ่งที่โปสการ์ดไม่ได้บอกนั้นวัดได้ และดัชนีนี้วัดมันอยู่: ค่าแรงหนึ่งวันอยู่ที่ 337–400 บาทแล้วแต่จังหวัด (กระทรวงแรงงาน 2568) ราคาประเมินที่ดินในเมืองเริ่มจากไม่ถึง 9,000 บาท/ตร.ม. ในเมืองภูมิภาค จนถึง 250,000 บาทใจกลางกรุงเทพฯ (กรมธนารักษ์) ค่าครองชีพกรุงเทพฯ อยู่ที่ 43.7 เทียบนิวยอร์ก 100 (Numbeo) ความมีน้ำใจถูกให้คะแนนที่นี่: อัธยาศัยคือหนึ่งในเจ็ดเสาหลัก น้ำหนัก 10% — เคียงข้างความปลอดภัย คุณภาพชีวิต และสิ่งแวดล้อม ซึ่งสร้างจากอัตราอาชญากรรม ผู้เสียชีวิตบนถนน เตียงโรงพยาบาล และ PM2.5 อ้างอิงแหล่งที่มารายเมือง ทุกหน้าเมืองมี 「บันไดความสำคัญ」 แปดขั้นของสิ่งที่เมืองต้องทำให้ได้จริง ตั้งแต่อากาศสะอาดจนถึงความเครียดจากการเดินทาง ให้คะแนนเฉพาะจุดที่มีข้อมูลจริงเท่านั้น ช่องว่างระหว่างสิ่งที่ประเทศไทยเป็น กับราคาที่ประเทศไทยถูกตั้งไว้ — นั่นคือโอกาสของนักลงทุน",
                zh: "明信片没有印出的东西是可以测量的，本指数正在测量它：一天的劳动力成本因府而异，为337–400泰铢（劳工部，2025）；城市评估地价从府级城市的每平方米不到9,000泰铢，到曼谷市中心的250,000泰铢（财政部国库厅）；曼谷生活成本指数为43.7，纽约为100（Numbeo）。善意在这里被打分：待客之道是七大支柱之一，权重10%——与安全、福祉、环境并列，由犯罪率、道路死亡、医院床位和PM2.5构成，每座城市均注明来源。每个城市页面都有一座「需求阶梯」：一个地方必须真正做对的八层要素，从清洁空气到通勤压力，只在有真实数据处评分。泰国的实际面貌与泰国的市场定价之间的差距——就是这笔交易。",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 3: LOOK BEYOND BANGKOK ═══════════ */}
      <section className="section reveal visible" style={{ paddingTop: 0 }}>
        <div className="invest-ccdr-panel glass-card" style={{ border: "1px solid var(--border)", background: "var(--1)" }}>
          <div className="invest-ccdr-inner">
            <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem" }}>
              {translate(locale, {
                en: "For Investors: Look Beyond Bangkok",
                th: "สำหรับนักลงทุน: มองข้ามกรุงเทพฯ ไปอีกขั้น",
                zh: "致投资者：把目光投向曼谷之外",
              })}
            </h2>
            <p style={{ fontSize: "var(--text-lg)", color: "var(--3)", marginBottom: "2rem", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "If you are making location decisions in Thailand, you face an information asymmetry. Everyone knows Bangkok. Everyone knows the Eastern Economic Corridor. But what about the provinces where your capital goes 3x further and the talent competition is half as fierce?",
                th: "หากคุณกำลังตัดสินใจเลือกสถานที่ลงทุนในไทย คุณจะพบกับความไม่สมมาตรของข้อมูล ทุกคนรู้จักกรุงเทพฯ ทุกคนรู้จักเขตพัฒนาพิเศษภาคตะวันออก (EEC) แต่จังหวัดที่เงินทุนของคุณมีค่ามากกว่า 3 เท่าและการแข่งขันแย่งบุคลากรน้อยกว่าครึ่งหนึ่งล่ะ?",
                zh: "如果您正在泰国做选址决定，您会面临信息不对称。每个人都知道曼谷。每个人都知道东部经济走廊。但在那些您的资本能发挥3倍作用，且人才竞争只有一半激烈的省份呢？",
              })}
            </p>

            <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "1rem" }}>
              {translate(locale, { en: "What SCITI Gives You", th: "สิ่งที่ SCITI มอบให้คุณ", zh: "SCITI 能给您什么" })}
            </h3>
            
            <div className="invest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "GPP & GPP/Capita", th: "GPP และ GPP ต่อหัว", zh: "GPP与人均GPP" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "Provincial productivity and economic scale (NESDC).", th: "ผลิตภาพและขนาดเศรษฐกิจระดับจังหวัด (สภาพัฒน์)", zh: "省级生产力和经济规模 (NESDC)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "BOI Incentive Zones", th: "เขตส่งเสริมการลงทุน BOI", zh: "BOI投资优惠区" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "Tax holidays and special privileges (BOI).", th: "การยกเว้นภาษีและสิทธิพิเศษ (BOI)", zh: "免税期和特殊待遇 (BOI)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "Minimum Wage Tiers", th: "ระดับค่าแรงขั้นต่ำ", zh: "最低工资层级" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "Labor cost benchmarking (Min. of Labour).", th: "การเปรียบเทียบต้นทุนแรงงาน (กระทรวงแรงงาน)", zh: "劳动力成本基准 (劳工部)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "Infrastructure Scorecard", th: "ตารางคะแนนโครงสร้างพื้นฐาน", zh: "基础设施记分卡" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "Airport, rail, port, 5G, and broadband.", th: "สนามบิน รถไฟ ท่าเรือ 5G และบรอดแบนด์", zh: "机场、铁路、港口、5G和宽带。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "Creative Economy Heatmap", th: "แผนที่ความเข้มเศรษฐกิจสร้างสรรค์", zh: "创意经济热力图" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "15 creative industries by province.", th: "15 อุตสาหกรรมสร้างสรรค์แยกตามจังหวัด", zh: "按省份划分的15个创意产业。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, { en: "Moneyball Score", th: "คะแนน Moneyball", zh: "Moneyball评分" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, { en: "Composite: growth + cost + infra + creative.", th: "คะแนนรวม: การเติบโต + ต้นทุน + โครงสร้างพื้นฐาน + สร้างสรรค์", zh: "综合：增长 + 成本 + 基础设施 + 创意。" })}</p>
              </div>
            </div>

            <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "1rem" }}>
              {translate(locale, { en: "How to Read the Data", th: "วิธีอ่านข้อมูล", zh: "如何解读数据" })}
            </h3>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "1rem", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "A high GPP/Capita relative to minimum wage means strong productivity at low cost — the classic \"value play.\" A province with a domestic airport, 5G coverage above 85%, and a university population over 20,000 has the infrastructure to support creative and knowledge industries today, not someday. A UNESCO Creative City designation or CEA-backed creative district signals policy tailwinds and potential access to grants, training, and international networks.",
                th: "GPP ต่อหัวที่สูงเมื่อเทียบกับค่าแรงขั้นต่ำหมายถึงผลิตภาพที่แข็งแกร่งในต้นทุนที่ต่ำ — นี่คือ \"value play\" แบบคลาสสิก จังหวัดที่มีสนามบินภายในประเทศ ความครอบคลุม 5G เกิน 85% และประชากรมหาวิทยาลัยกว่า 20,000 คน มีโครงสร้างพื้นฐานรองรับอุตสาหกรรมสร้างสรรค์และความรู้ได้ตั้งแต่วันนี้ ไม่ใช่วันหน้า การได้รับการรับรองจากยูเนสโกหรือเขตสร้างสรรค์ที่สนับสนุนโดย CEA เป็นสัญญาณบ่งบอกถึงนโยบายที่เอื้ออำนวยและโอกาสในการเข้าถึงเงินทุนสนับสนุน",
                zh: "高人均GPP相对于最低工资意味着低成本下的高生产力——经典的“价值投资”。拥有国内机场、5G覆盖率超过85%、大学人口超过2万人的省份，今天（而不是未来某天）就具备支持创意和知识产业的基础设施。联合国教科文组织创意城市称号或CEA支持的创意街区标志着政策顺风，以及获得资助、培训和国际网络的潜力。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "1rem", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "The provinces ranked highest on our Moneyball composite — a separate downloadable analysis (see the factsheets below), not a live SCITI metric — Lamphun, Khon Kaen, Chanthaburi, Nakhon Ratchasima, Chiang Rai — share a pattern: strong fundamentals, low entry cost, and creative assets that the market has not yet fully priced in.",
                th: "จังหวัดที่ได้คะแนนสูงสุดในคะแนน Moneyball รวมของเรา — การวิเคราะห์แยกต่างหากที่ดาวน์โหลดได้ (ดู factsheet ด้านล่าง) ไม่ใช่ตัวชี้วัดสดของ SCITI — ลำพูน, ขอนแก่น, จันทบุรี, นครราชสีมา, เชียงราย — มีรูปแบบที่เหมือนกัน: พื้นฐานแข็งแกร่ง ต้นทุนเข้าถึงต่ำ และสินทรัพย์สร้างสรรค์ที่ตลาดยังประเมินมูลค่าไม่เต็มที่",
                zh: "在我们的Moneyball综合指数（一项可下载的独立分析，见下方资料，并非SCITI实时指标）上排名最高的省份——南奔、孔敬、尖竹汶、呵叻、清莱——都有一个共同点：基本面强劲、进入成本低，以及市场尚未完全定价的创意资产。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--text)", fontWeight: 600, marginTop: "2rem", borderLeft: "4px solid var(--teal)", paddingLeft: "1rem" }}>
              {translate(locale, {
                en: "SCITI does not give investment advice. It gives you the data to make your own call — with the same rigor you would apply to any other asset class.",
                th: "SCITI ไม่ได้ให้คำแนะนำการลงทุน แต่ให้ข้อมูลเพื่อให้คุณตัดสินใจด้วยตัวเอง — ด้วยความรัดกุมเช่นเดียวกับที่คุณใช้กับสินทรัพย์ประเภทอื่น",
                zh: "SCITI 不提供投资建议。它为您提供数据，让您做出自己的判断——就像您对待任何其他资产类别一样严谨。",
              })}
            </p>
            <div className="export-docs" style={{ marginTop: "1.5rem" }}>
              <a href={assetUrl("/SCITI-2026-Moneyball-Factsheets.html")} download className="export-doc-link">
                {translate(locale, {
                  en: "Moneyball Province Factsheets (HTML, print-ready)",
                  th: "ข้อมูลจังหวัด Moneyball (HTML, พิมพ์ได้)",
                  zh: "Moneyball 省份资料 (HTML，可打印)",
                })}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ WHO SIGNS — the approval path most decks omit ═══════════ */}
      <section className="section reveal visible" style={{ paddingTop: 0 }}>
        <div className="invest-ccdr-panel glass-card" style={{ border: "1px solid var(--border)", background: "var(--1)" }}>
          <div className="invest-ccdr-inner">
            <h2 style={{ fontSize: "var(--text-3xl)", marginBottom: "1rem" }}>
              {translate(locale, { en: "Who Signs", th: "ใครเป็นคนเซ็น", zh: "谁来签字" })}
            </h2>
            <p style={{ fontSize: "var(--text-body)", color: "var(--4)", marginBottom: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "Every Thai province has two leaders, and confusing them is the most common and most expensive mistake a foreign investor makes here. The governor is a senior civil servant appointed by the Ministry of Interior. The Provincial Administrative Organisation (PAO) mayor is elected, and under decentralisation law the elected office is the one holding the budget. The governor holds the process instead: a project generally needs the governor's signature, and the governor can hold it, return it, or send it to a committee before it moves.",
                th: "ทุกจังหวัดของไทยมีผู้นำสองคน และการสับสนระหว่างสองตำแหน่งนี้คือความผิดพลาดที่พบบ่อยและแพงที่สุดของนักลงทุนต่างชาติ ผู้ว่าราชการจังหวัดคือข้าราชการระดับสูงที่แต่งตั้งโดยกระทรวงมหาดไทย ส่วนนายกองค์การบริหารส่วนจังหวัด (อบจ.) มาจากการเลือกตั้ง และตามกฎหมายกระจายอำนาจ ตำแหน่งที่มาจากการเลือกตั้งคือผู้ถืองบประมาณ ขณะที่ผู้ว่าฯ ถือกระบวนการแทน โครงการโดยทั่วไปต้องผ่านลายเซ็นผู้ว่าฯ ซึ่งสามารถชะลอ ตีกลับ หรือส่งให้คณะกรรมการพิจารณาก่อนเดินหน้าต่อได้",
                zh: "泰国每个府都有两位主官，混淆二者是外国投资者在此犯下的最常见、也最昂贵的错误。府尹是由内政部委任的高级公务员。府行政组织（PAO）主席则由选举产生，而依据权力下放法，民选职位才是掌握预算的一方。府尹掌握的是流程：项目通常需要府尹签字，府尹可以搁置、退回，或在放行前先交由委员会审议。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--4)", marginBottom: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "The practical consequence is simple. Win over the mayor and you have the money but not the permission. Win over the governor and you have the permission but not the money. Both conversations are required, and they are different conversations: the elected office answers to residents and responds to visible local benefit, while the appointed office answers to process and responds to a proposal that will survive scrutiny. Bangkok is the exception to all of it — it is not one of the 76 provinces and its governor is elected.",
                th: "ผลในทางปฏิบัติเรียบง่าย ถ้าคุยกับนายก อบจ. สำเร็จ คุณได้เงินแต่ยังไม่ได้อนุญาต ถ้าคุยกับผู้ว่าฯ สำเร็จ คุณได้อนุญาตแต่ไม่มีเงิน ต้องคุยทั้งสองฝ่าย และเป็นการคุยคนละแบบ ตำแหน่งที่มาจากการเลือกตั้งตอบต่อประชาชนและตอบรับประโยชน์ที่เห็นได้ในพื้นที่ ส่วนตำแหน่งที่มาจากการแต่งตั้งตอบต่อกระบวนการ และตอบรับข้อเสนอที่ทนต่อการตรวจสอบได้ กรุงเทพมหานครเป็นข้อยกเว้นทั้งหมดนี้ เพราะไม่ได้เป็นหนึ่งใน 76 จังหวัด และผู้ว่าฯ กทม. มาจากการเลือกตั้ง",
                zh: "实际后果很简单。说服了 PAO 主席，你拿到了钱却没有许可；说服了府尹，你拿到了许可却没有钱。两场对话都必须进行，而且是两种不同的对话：民选职位对居民负责，回应的是看得见的本地收益；委任职位对流程负责，回应的是经得起审查的提案。曼谷是这一切的例外——它不属于76个府，其府尹由选举产生。",
              })}
            </p>
            <p style={{ fontSize: "var(--text-body)", color: "var(--text)", fontWeight: 600, marginTop: "1.5rem", borderLeft: "4px solid var(--teal)", paddingLeft: "1rem", lineHeight: 1.7 }}>
              {translate(locale, {
                en: "Then price the calendar. A request entering the central budget cycle is typically funded around two years later, and built in roughly two more. For a city that floods every year, that is four to five more flood seasons before the protection exists — and residents, manufacturers and investors all move during them. The unpriced line in every slow procurement is who left while it was pending.",
                th: "จากนั้นให้ตีราคาปฏิทินด้วย คำของบที่เข้าสู่วงจรงบประมาณส่วนกลางมักได้รับจัดสรรราวสองปีให้หลัง และก่อสร้างอีกราวสองปี สำหรับเมืองที่น้ำท่วมทุกปี นั่นคือฤดูน้ำท่วมอีกสี่ถึงห้าครั้งก่อนที่การป้องกันจะมีอยู่จริง และในระหว่างนั้นทั้งประชาชน โรงงาน และนักลงทุนต่างย้ายออก ต้นทุนที่ไม่เคยถูกตีราคาในทุกการจัดซื้อที่ล่าช้า คือคนที่จากไปในระหว่างรอ",
                zh: "然后，把日历也计入成本。进入中央预算周期的申请通常约两年后获批，再花约两年建成。对于年年被淹的城市，这意味着在防护到位之前还要再经历四到五个洪水季——而居民、制造商和投资者都会在这期间离开。每一次缓慢采购中未被计价的一项，是等待期间流失的人。",
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ WORLD BANK CCDR 2025 URGENCY PANEL ═══════════ */}
      <div className="invest-ccdr-panel">
        <div className="invest-ccdr-inner">
          <p className="invest-ccdr-source">
            {translate(locale, {
              en: "World Bank Country Climate & Development Report — Thailand 2025",
              th: "รายงานสภาพภูมิอากาศและการพัฒนาประเทศ ธนาคารโลก — ประเทศไทย 2568",
              zh: "世界银行泰国国别气候与发展报告 2025",
            })}
          </p>
          <div className="invest-ccdr-grid">
            <div className="invest-ccdr-stat">
              <span className="invest-ccdr-num">7–14%</span>
              <p className="invest-ccdr-copy">
                {translate(locale, {
                  en: "GDP loss by 2050 under business-as-usual. Climate change halves annual growth rates. High-income status by 2037 becomes structurally impossible.",
                  th: "การสูญเสีย GDP ภายในปี 2593 ภายใต้สถานการณ์ปกติ การเปลี่ยนแปลงสภาพภูมิอากาศลดอัตราการเติบโตต่อปีลงครึ่งหนึ่ง สถานะรายได้สูงภายในปี 2580 กลายเป็นสิ่งที่เป็นไปไม่ได้เชิงโครงสร้าง",
                  zh: "常规情景下2050年GDP损失。气候变化使年增长率减半。2037年前实现高收入国家地位在结构上成为不可能。",
                })}
              </p>
            </div>
            <div className="invest-ccdr-stat">
              <span className="invest-ccdr-num">$219B</span>
              <p className="invest-ccdr-copy">
                {translate(locale, {
                  en: "climate investment needed over 25 years — $104B adaptation, $96B emissions reduction, $19B climate-smart agriculture. Cost of inaction is multiples larger.",
                  th: "การลงทุนด้านภูมิอากาศที่ต้องการใน 25 ปี — 104 พันล้าน USD การปรับตัว, 96 พันล้าน USD ลดการปล่อยก๊าซ, 19 พันล้าน USD เกษตรอัจฉริยะ ต้นทุนของการไม่ดำเนินการมากกว่าหลายเท่า",
                  zh: "25年内所需气候投资——1040亿美元适应，960亿美元减排，190亿美元气候智慧农业。不作为的代价是其数倍。",
                })}
              </p>
            </div>
            <div className="invest-ccdr-stat">
              <span className="invest-ccdr-num">50%</span>
              <p className="invest-ccdr-copy">
                {translate(locale, {
                  en: "chance the 2011 flood recurs by 2050. That event cost 12.6% of GDP (USD 46.5B) in a single year. The Chao Phraya basin holds 66% of Thailand's GDP.",
                  th: "โอกาสที่น้ำท่วมปี 2554 จะเกิดซ้ำภายในปี 2593 เหตุการณ์นั้นทำให้ GDP สูญเสีย 12.6% (4.65 หมื่นล้าน USD) ในปีเดียว แอ่งเจ้าพระยาถือ 66% ของ GDP ประเทศไทย",
                  zh: "2050年前2011年洪灾重演的概率。那次事件造成单年GDP损失12.6%（465亿美元）。昭披耶流域占泰国GDP的66%。",
                })}
              </p>
            </div>
          </div>
          <p className="invest-ccdr-thesis">
            {translate(locale, {
              en: "Adaptation investments in flood mitigation, coastal protection, water security, and cooling could raise annual GDP by 4–5% by 2050 relative to business-as-usual — at a cost of slightly over 1% of GDP per year. This is not a climate argument. It is a return-on-investment argument.",
              th: "การลงทุนด้านการปรับตัวในการบรรเทาน้ำท่วม การปกป้องชายฝั่ง ความมั่นคงทางน้ำ และการทำให้เย็นขึ้น สามารถเพิ่ม GDP รายปีได้ 4-5% ภายในปี 2593 เมื่อเทียบกับสถานการณ์ปกติ — ด้วยต้นทุนเกินกว่า 1% ของ GDP ต่อปีเล็กน้อย นี่ไม่ใช่ข้อโต้แย้งด้านภูมิอากาศ แต่เป็นข้อโต้แย้งเรื่องผลตอบแทนการลงทุน",
              zh: "洪水缓解、海岸保护、水安全和降温方面的适应性投资，相较常规情景可在2050年前将年均GDP提高4-5%——成本略超每年GDP的1%。这不是气候论点，这是投资回报论点。",
            })}
          </p>
        </div>
      </div>

      {/* ═══════════ 2. THAILAND MACRO SNAPSHOT ═══════════ */}
      <section ref={macroRef} className={`section reveal stagger-1 ${macroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Macro Snapshot", th: "ภาพรวมมหภาค", zh: "宏观概况" })}</p>
        <h2>{translate(locale, {
          en: "Thailand at a Glance",
          th: "ประเทศไทยในภาพรวม",
          zh: "泰国一览",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "Real numbers from real institutions. No forecasts, no fluff — the baseline for any investment thesis in Thai smart cities.",
            th: "ตัวเลขจริงจากสถาบันจริง ไม่มีการคาดการณ์ ไม่มีสิ่งฟุ่มเฟือย พื้นฐานสำหรับทฤษฎีการลงทุนในเมืองอัจฉริยะไทย",
            zh: "来自真实机构的真实数据。没有预测，没有虚言——泰国智慧城市投资论点的基准线。",
          })}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 0,
          border: "1px solid var(--5)",
        }}>
          {macroStats.map((s, i) => (
            <div key={i} className="glass-card" style={{
              border: 0,
              borderRadius: 0,
              borderRight: i < macroStats.length - 1 ? "1px solid var(--5)" : "none",
              padding: "1.25rem 1rem",
              display: "flex",
              flexDirection: "column",
              gap: ".35rem",
            }}>
              <span style={{ font: "700 var(--text-micro) var(--mono)", textTransform: "uppercase", letterSpacing: ".1em", color: "var(--3)" }}>
                {translate(locale, s.label)}
              </span>
              <span style={{ font: "800 var(--text-display) var(--font-heading)", letterSpacing: "-.04em", color: "var(--ink)" }}>
                {s.value}
              </span>
              <span style={{ font: "500 var(--text-micro) var(--font)", color: "var(--2)" }}>
                {translate(locale, s.sub)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 3. WHAT SCITI TELLS INVESTORS ═══════════ */}
      <section ref={insightRef} className={`section reveal stagger-2 ${insightVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Index Intelligence", th: "ข้อมูลเชิงลึกจากดัชนี", zh: "指数洞察" })}</p>
        <h2>{translate(locale, {
          en: "What SCITI Tells Investors",
          th: "SCITI บอกอะไรแก่นักลงทุน",
          zh: "SCITI告诉投资者什么",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "The index isn't academic. It's a decision tool. Here's how to read the scores as investment signals.",
            th: "ดัชนีนี้ไม่ใช่เชิงวิชาการ มันคือเครื่องมือตัดสินใจ นี่คือวิธีอ่านคะแนนเป็นสัญญาณการลงทุน",
            zh: "该指数不是学术工具，而是决策工具。以下是如何将评分解读为投资信号。",
          })}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}>
          {insightCards.map((c, i) => (
            <div key={i} className="glass-card shadow-premium" style={{
              padding: "1.5rem 1.25rem",
              display: "flex",
              flexDirection: "column",
              gap: ".75rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{
                  font: "700 var(--text-micro) var(--mono)",
                  color: c.tierColor,
                  padding: ".15rem .4rem",
                  background: c.tierColor === "var(--teal)" ? "var(--teal-glow)" : c.tierColor === "#9B5DE5" ? "rgba(155, 93, 229, .1)" : "rgba(217, 119, 6, .1)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}>
                  {c.tier}
                </span>
              </div>
              <h3 style={{ font: "700 var(--text-body) var(--font-heading)", letterSpacing: "-.02em", color: "var(--ink)" }}>
                {translate(locale, c.headline)}
              </h3>
              <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: "1.6" }}>
                {translate(locale, c.body)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 3.5. CITY-BY-CITY INVESTMENT LENS — ASEAN toolkit cross-reference ═══════════ */}
      <InvestCityLens locale={locale} onNavigate={onNavigate} />

      {/* ═══════════ 4. CITY INVESTMENT DIRECTORY ═══════════ */}
      <InvestCityDirectory locale={locale} onNavigate={onNavigate} />

      {/* ═══════════ 5. FINANCIAL MECHANISMS ═══════════ */}
      <section ref={mechRef} className={`section reveal stagger-4 ${mechVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Financial Instruments", th: "เครื่องมือทางการเงิน", zh: "金融工具" })}</p>
        <h2>{translate(locale, {
          en: "How to Finance Smart City Investment",
          th: "วิธีระดมทุนลงทุนเมืองอัจฉริยะ",
          zh: "如何为智慧城市投资融资",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "Six proven mechanisms. From tax holidays to green bonds to multilateral de-risking.",
            th: "หกกลไกที่พิสูจน์แล้ว ตั้งแต่การลดหย่อนภาษีไปจนถึงพันธบัตรเขียวและการลดความเสี่ยงพหุภาคี",
            zh: "六种经过验证的机制。从税收假期到绿色债券，再到多边风险缓释。",
          })}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 0,
          border: "1px solid var(--5)",
          marginTop: "1.5rem",
        }}>
          {mechanisms.map((m, i) => (
            <div key={i} style={{
              padding: "1.25rem 1rem",
              borderBottom: i < mechanisms.length - 1 ? "1px solid var(--5)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: ".4rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{
                  font: "700 var(--text-micro) var(--mono)",
                  color: "var(--teal)",
                  padding: ".12rem .35rem",
                  background: "var(--teal-glow)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}>
                  {m.tag}
                </span>
                <span style={{ font: "700 var(--text-body) var(--font-heading)", color: "var(--ink)", letterSpacing: "-.01em" }}>
                  {translate(locale, m.name)}
                </span>
              </div>
              <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: "1.6" }}>
                {translate(locale, m.desc)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 6. RISK MATRIX ═══════════ */}
      <section ref={riskRef} className={`section reveal stagger-5 ${riskVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Risk Matrix", th: "เมทริกซ์ความเสี่ยง", zh: "风险矩阵" })}</p>
        <h2>{translate(locale, {
          en: "Where the Risks Hide",
          th: "ความเสี่ยงซ่อนอยู่ที่ไหน",
          zh: "风险隐藏之处",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "No sugar-coating. These are the structural risks every investor in Thai smart cities must price in.",
            th: "ไม่เคลือบน้ำตาล นี่คือความเสี่ยงเชิงโครงสร้างที่นักลงทุนทุกคนในเมืองอัจฉริยะไทยต้องคำนวณไว้ในราคา",
            zh: "不加粉饰。这些是每位泰国智慧城市投资者必须纳入定价的结构性风险。",
          })}
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1rem",
          marginTop: "1.5rem",
        }}>
          {risks.map((r, i) => (
            <div key={i} className="glass-card" style={{
              padding: "1.25rem 1rem",
              borderLeft: `3px solid ${severityColor(r.severity)}`,
              display: "flex",
              flexDirection: "column",
              gap: ".5rem",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
                <span style={{
                  font: "700 var(--text-micro) var(--mono)",
                  color: severityColor(r.severity),
                  padding: ".12rem .35rem",
                  background: r.severity === "high" ? "rgba(229, 62, 62, .08)" : r.severity === "medium" ? "rgba(217, 119, 6, .08)" : "rgba(113, 113, 122, .08)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}>
                  {r.icon}
                </span>
                <span style={{
                  font: "600 var(--text-micro) var(--mono)",
                  color: severityColor(r.severity),
                  letterSpacing: ".06em",
                  textTransform: "uppercase",
                }}>
                  {severityLabel(r.severity)}
                </span>
              </div>
              <h3 style={{ font: "700 var(--text-body) var(--font-heading)", color: "var(--ink)", letterSpacing: "-.01em" }}>
                {translate(locale, r.title)}
              </h3>
              <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: "1.6" }}>
                {translate(locale, r.body)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 7. DUE DILIGENCE CHECKLIST ═══════════ */}
      <section ref={ddRef} className={`section reveal stagger-1 ${ddVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Due Diligence", th: "การตรวจสอบสถานะ", zh: "尽职调查" })}</p>
        <h2>{translate(locale, {
          en: "10-Point Investment Checklist",
          th: "รายการตรวจสอบการลงทุน 10 ข้อ",
          zh: "10项投资清单",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "A practical checklist for anyone deploying capital into Thai smart city projects. Print it. Use it.",
            th: "รายการตรวจสอบเชิงปฏิบัติสำหรับทุกคนที่จะลงทุนในโครงการเมืองอัจฉริยะไทย พิมพ์ออกมา ใช้มัน",
            zh: "一份面向所有向泰国智慧城市项目部署资本者的实用清单。打印出来，付诸使用。",
          })}
        </p>
        <div style={{
          marginTop: "1.5rem",
          borderTop: "2px solid var(--ink)",
        }}>
          {checklist.map((item, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr",
              gap: "1rem",
              padding: "1.25rem 0",
              borderBottom: "1px solid var(--5)",
              alignItems: "start",
            }}>
              <span style={{
                font: "800 var(--text-display) var(--font-heading)",
                color: "var(--3)",
                lineHeight: 1,
              }}>
                {item.num}
              </span>
              <div>
                <h3 style={{ font: "700 var(--text-body) var(--font-heading)", color: "var(--ink)", letterSpacing: "-.01em", marginBottom: ".3rem" }}>
                  {translate(locale, item.title)}
                </h3>
                <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: "1.6" }}>
                  {translate(locale, item.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 8. SOURCES ═══════════ */}
      <section ref={srcRef} className={`section reveal stagger-2 ${srcVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "Sources", th: "แหล่งอ้างอิง", zh: "数据来源" })}</p>
        <h2>{translate(locale, {
          en: "Data Sources & References",
          th: "แหล่งข้อมูลและเอกสารอ้างอิง",
          zh: "数据来源与参考文献",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "Every number on this page is sourced. Every claim is verifiable. That's the standard.",
            th: "ทุกตัวเลขในหน้านี้มีที่มา ทุกข้อกล่าวอ้างตรวจสอบได้ นี่คือมาตรฐาน",
            zh: "本页每个数字都有出处。每项主张都可验证。这是我们的标准。",
          })}
        </p>
        <div style={{
          marginTop: "1.5rem",
          border: "1px solid var(--5)",
        }}>
          {sources.map((s, i) => (
            <div key={i} style={{
              display: "grid",
              gridTemplateColumns: "200px 1fr",
              gap: "1rem",
              padding: ".75rem 1rem",
              borderBottom: i < sources.length - 1 ? "1px solid var(--5)" : "none",
              alignItems: "baseline",
            }}>
              <span style={{ font: "600 var(--text-micro) var(--mono)", color: "var(--ink)", letterSpacing: "-.01em" }}>
                {s.name}
              </span>
              <span style={{ font: "400 var(--text-micro) var(--font)", color: "var(--3)" }}>
                {translate(locale, s.desc)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section ref={ctaRef} className={`section reveal stagger-3 ${ctaVisible ? "visible" : ""}`}>
        <div className="callout-card glass-card shadow-heavy">
          <h2>{translate(locale, {
            en: "The index is the due diligence layer that was missing.",
            th: "ดัชนีนี้คือชั้นการตรวจสอบสถานะที่ขาดหายไป",
            zh: "该指数是此前缺失的尽职调查层。",
          })}</h2>
          <p>{translate(locale, {
            en: "SCITI scores cities on operational reality — not marketing decks, not ribbon-cutting ceremonies. Use it as your baseline.",
            th: "SCITI ให้คะแนนเมืองจากความเป็นจริงในการดำเนินงาน ไม่ใช่สไลด์การตลาด ไม่ใช่พิธีตัดริบบิ้น ใช้มันเป็นพื้นฐานของคุณ",
            zh: "SCITI根据运营现实为城市评分——而非营销材料，也非剪彩仪式。以此作为您的基准线。",
          })}</p>
          <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap", marginTop: ".75rem" }}>
            <button className="cta-button" onClick={() => onNavigate("/rankings")}>
              {translate(locale, { en: "See the Rankings", th: "ดูการจัดอันดับ", zh: "查看排名" })}
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/methodology")}>
              {translate(locale, { en: "Read Methodology", th: "อ่านระเบียบวิธีวิจัย", zh: "阅读方法论" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
