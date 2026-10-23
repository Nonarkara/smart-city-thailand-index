import { translate } from "./cityPresentation";
import InvestmentExplorer from "./InvestmentExplorer";
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
  sourceUrl?: string;
  label: {
      en: string; th: string; zh: string };
  value: string;
  sub: {
      en: string; th: string; zh: string };
}

const macroStats: MacroStat[] = [
  {
    label: {
      en: "GDP (2024)",
      th: "GDP (2567)",
      zh: "GDP (2024)" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "FDI Inflows",
      th: "FDI ไหลเข้า",
      zh: "FDI流入" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "Digital Economy Target",
      th: "เป้าหมายเศรษฐกิจดิจิทัล",
      zh: "数字经济目标" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "Smart City National Target",
      th: "เป้าหมายเมืองอัจฉริยะ",
      zh: "智慧城市国家目标" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "BOI Tax Holiday",
      th: "สิทธิประโยชน์ BOI",
      zh: "BOI税收优惠" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "EEC Committed Investment",
      th: "การลงทุน EEC ที่ผูกพัน",
      zh: "EEC承诺投资" },
    value: "—",
    sub: {
      en: "Source reconciliation pending · do not use as a current investment input",
      th: "อยู่ระหว่างตรวจสอบแหล่งข้อมูล · ยังไม่ควรใช้ประกอบการลงทุนในปัจจุบัน",
      zh: "来源核对中 · 暂不作为当前投资依据" },
  },
  {
    label: {
      en: "Climate Investment Needed",
      th: "การลงทุนด้านภูมิอากาศที่ต้องการ",
      zh: "所需气候投资" },
    value: "$219B",
    sourceUrl: "https://www.worldbank.org/en/country/thailand/publication/th-ccdr",
    sub: {
      en: "2025–2050 · discounted NPV · World Bank CCDR 2025",
      th: "2568–2593 · มูลค่าปัจจุบันสุทธิ · ธนาคารโลก CCDR 2568",
      zh: "2025–2050 · 折现净现值 · 世界银行CCDR 2025" },
  },
  {
    label: {
      en: "GDP at Risk by 2050",
      th: "GDP ที่เสี่ยงภายในปี 2593",
      zh: "2050年GDP风险" },
    value: "7–14%",
    sourceUrl: "https://www.worldbank.org/en/country/thailand/publication/th-ccdr",
    sub: {
      en: "Modeled loss vs baseline without adaptation · CCDR 2025",
      th: "ผลจำลองเทียบฐานหากไม่ปรับตัว · CCDR 2568",
      zh: "无额外适应措施时相对基线的模型损失 · CCDR 2025" },
  },
];

interface InsightCard {
  tier: string;
  tierColor: string;
  headline: {
      en: string; th: string; zh: string };
  body: {
      en: string; th: string; zh: string };
}

const insightCards: InsightCard[] = [
{ tier: "Alpha", tierColor: "var(--teal)", headline: {
      en: "65+ · A stronger curated profile",
      th: "65+ · ภาพรวมตามเกณฑ์คัดสรรที่สูงกว่า",
      zh: "65+ · 较强的编辑评估表现" }, body: {
      en: "Use the pillar breakdown to shortlist questions for a site visit. This tier does not establish infrastructure adequacy, project viability, or expected returns. Verify operating services and local coverage separately.",
      th: "ใช้คะแนนรายด้านเตรียมคำถามสำหรับลงพื้นที่ ระดับนี้ไม่ได้ยืนยันความเพียงพอของโครงสร้างพื้นฐาน ความเป็นไปได้ของโครงการ หรือผลตอบแทน ต้องตรวจสอบบริการที่เปิดใช้งานและพื้นที่ให้บริการแยกกัน",
      zh: "用支柱评分准备实地考察问题。该层级不证明基础设施充足、项目可行或预期回报；须另行核实服务运营及覆盖范围。" } },
{ tier: "Beta", tierColor: "var(--gold)", headline: {
      en: "45–64.9 · Investigate the trade-offs",
      th: "45–64.9 · ตรวจสอบข้อแลกเปลี่ยน",
      zh: "45–64.9 · 调查取舍" }, body: {
      en: "A middle-range composite can conceal very different strengths and gaps. Check contracts, service capacity, demand, and project costs. SCITI does not demonstrate a price discount or a 2–3 year investment window.",
      th: "คะแนนรวมระดับกลางอาจซ่อนจุดแข็งและช่องว่างที่ต่างกัน ตรวจสอบสัญญา กำลังให้บริการ อุปสงค์ และต้นทุนโครงการ SCITI ไม่ได้พิสูจน์ส่วนลดราคาหรือจังหวะลงทุน 2–3 ปี",
      zh: "中段综合分可能掩盖不同的优势与缺口。核实合同、服务能力、需求和成本；SCITI不证明价格折让或两至三年的投资窗口。" } },
{ tier: "Gamma", tierColor: "var(--3)", headline: {
      en: "Below 45 · Identify what needs verification",
      th: "ต่ำกว่า 45 · ระบุสิ่งที่ต้องตรวจสอบ",
      zh: "低于45 · 明确待核实事项" }, body: {
      en: "A lower curated score is a starting point for investigation, not evidence that services do not exist. Distinguish a measured shortfall from missing evidence, and inspect each project on its own merits.",
      th: "คะแนนคัดสรรที่ต่ำกว่าเป็นจุดเริ่มต้นของการตรวจสอบ ไม่ใช่หลักฐานว่าไม่มีบริการ แยกข้อบกพร่องที่วัดได้ออกจากข้อมูลที่ยังขาด และประเมินแต่ละโครงการตามข้อเท็จจริง",
      zh: "较低的编辑评分是调查起点，不代表服务不存在。区分已测量的不足与证据缺失，并逐项评估项目。" } },
{ tier: "LIV 25%", tierColor: "var(--teal)", headline: {
      en: "Livability · A stated editorial priority",
      th: "ความน่าอยู่ · ลำดับความสำคัญของดัชนี",
      zh: "宜居性 · 明示的编辑权重" }, body: {
      en: "The 25% weight expresses the index methodology. It is not an estimated effect on property prices. Test local rents, occupancy, affordability, and resident needs before making a demand claim.",
      th: "น้ำหนัก 25% เป็นทางเลือกตามวิธีวิทยาของดัชนี ไม่ใช่ผลประมาณการต่อราคาอสังหาริมทรัพย์ ตรวจสอบค่าเช่า อัตราเข้าพัก ความสามารถในการจ่าย และความต้องการของคนในพื้นที่ก่อนสรุปอุปสงค์",
      zh: "25%的权重体现指数方法，并非对房价影响的估计。判断需求前，应核实当地租金、入住率、可负担性和居民需求。" } },
{ tier: "DIG 5%", tierColor: "var(--teal)", headline: {
      en: "Digital · Verify the service behind the score",
      th: "ดิจิทัล · ตรวจสอบบริการเบื้องหลังคะแนน",
      zh: "数字化 · 核实评分背后的服务" }, body: {
      en: "The 5% digital pillar adds one perspective. Check uptime, accessibility, usage, maintenance funding, and evidence dates. A high score alone does not establish future readiness or a commercial opportunity.",
      th: "เสาดิจิทัลน้ำหนัก 5% เพิ่มมุมมองหนึ่ง ตรวจสอบเวลาพร้อมใช้งาน การเข้าถึง การใช้งานจริง งบบำรุงรักษา และวันที่ข้อมูล คะแนนสูงเพียงอย่างเดียวไม่ยืนยันความพร้อมในอนาคตหรือโอกาสเชิงพาณิชย์",
      zh: "5%的数字支柱提供一个观察角度。核实可用率、无障碍、使用量、维护预算和证据日期；高分本身不证明未来准备度或商业机会。" } }
];

interface Mechanism {
  name: {
      en: string; th: string; zh: string };
  desc: {
      en: string; th: string; zh: string };
  tag: string;
}

const mechanisms: Mechanism[] = [
  {
    name: {
      en: "BOI Privileges (Section 31)",
      th: "สิทธิประโยชน์ BOI (มาตรา 31)",
      zh: "BOI优惠 (第31条)" },
    desc: {
      en: "Check the current BOI activity classification, qualifying expenditure, approval conditions, and tax treatment directly with BOI. A city score or location does not confer a tax holiday.",
      th: "ตรวจหมวดกิจการ BOI รายจ่ายที่เข้าเกณฑ์ เงื่อนไขอนุมัติ และสิทธิภาษีปัจจุบันกับ BOI โดยตรง คะแนนเมืองหรือทำเลไม่ทำให้ได้รับยกเว้นภาษีอัตโนมัติ",
      zh: "直接向BOI核实当前业务类别、合格支出、审批条件和税务待遇。城市评分或选址不会自动赋予免税期。"
    },
    tag: "Tax",
  },
  {
    name: {
      en: "ADB ACGF",
      th: "ADB ACGF",
      zh: "亚行ACGF" },
    desc: {
      en: "Investigate ACGF as a potential green infrastructure financing route. Confirm eligible borrowers, current facilities, project preparation requirements, and terms with ADB.",
      th: "ศึกษาช่องทาง ACGF สำหรับโครงสร้างพื้นฐานสีเขียว ยืนยันผู้กู้ที่เข้าเกณฑ์ วงเงินปัจจุบัน การเตรียมโครงการ และเงื่อนไขกับ ADB",
      zh: "可调查ACGF绿色基础设施融资渠道，向亚行核实借款主体资格、现行安排、项目准备要求和条款。"
    },
    tag: "Green",
  },
  {
    name: {
      en: "Thailand Green Bond Framework",
      th: "กรอบพันธบัตรเขียวไทย",
      zh: "泰国绿色债券框架" },
    desc: {
      en: "Evaluate green bond financing against issuer authority, disclosure, use-of-proceeds rules, and current regulator requirements. Do not assume that a municipality is authorised to issue a bond.",
      th: "ประเมินพันธบัตรเขียวจากอำนาจผู้ออก การเปิดเผยข้อมูล การใช้เงิน และกฎปัจจุบัน อย่าสันนิษฐานว่าเทศบาลมีอำนาจออกพันธบัตร",
      zh: "依据发行权限、披露、资金用途和现行监管要求评估绿债，不应假定市政府有发行权限。"
    },
    tag: "Bond",
  },
  {
    name: {
      en: "PPP Frameworks (KKTS Model)",
      th: "กรอบ PPP (โมเดล KKTS)",
      zh: "PPP框架 (KKTS模式)" },
    desc: {
      en: "Public-Private Partnership templates pioneered by Khon Kaen. Local consortium co-invests in transit, digital health, and urban services. Replicable to other secondary cities. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "รูปแบบ PPP ที่บุกเบิกโดยขอนแก่น กลุ่มเอกชนในพื้นที่ร่วมลงทุนในระบบขนส่ง สุขภาพดิจิทัล และบริการเมือง สามารถจำลองไปยังเมืองรองอื่นได้ ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "由孔敬开创的公私合作模板。地方联盟共同投资交通、数字健康和城市服务。可复制到其他二线城市。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "PPP",
  },
  {
    name: {
      en: "ASEAN Smart City Financing Toolkit",
      th: "ชุดเครื่องมือการเงินเมืองอัจฉริยะ ASEAN",
      zh: "东盟智慧城市融资工具包" },
    desc: {
      en: "Regional framework providing blended finance templates, risk assessment tools, and cross-border investment facilitation for ASCN member cities. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "กรอบระดับภูมิภาคที่ให้แม่แบบการเงินผสม เครื่องมือประเมินความเสี่ยง และการอำนวยความสะดวกการลงทุนข้ามพรมแดนสำหรับเมืองสมาชิก ASCN ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "区域框架，为ASCN成员城市提供混合融资模板、风险评估工具和跨境投资便利化。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "ASEAN",
  },
  {
    name: {
      en: "UNCDF Smart Green ASEAN Cities",
      th: "UNCDF Smart Green ASEAN Cities",
      zh: "UNCDF智慧绿色东盟城市" },
    desc: {
      en: "UN Capital Development Fund program supporting municipal finance innovation and climate-resilient urban infrastructure in ASEAN cities. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "โครงการกองทุนพัฒนาเมืองหลวงแห่งสหประชาชาติ สนับสนุนนวัตกรรมการเงินเทศบาลและโครงสร้างพื้นฐานเมืองที่ทนต่อสภาพภูมิอากาศในเมือง ASEAN ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "联合国资本发展基金项目，支持东盟城市的市政金融创新和气候适应型城市基础设施。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "UN",
  },
  // ─── World Bank CCDR 2025 — three additional mechanisms from the climate finance analysis ───
  {
    name: {
      en: "Carbon Pricing Revenue Mechanism",
      th: "กลไกรายได้จากราคาคาร์บอน",
      zh: "碳定价收入机制" },
    desc: {
      en: "World Bank CCDR 2025: carbon pricing could generate revenue equivalent to ~1% of GDP annually. Thailand's voluntary carbon market and emerging carbon tax framework create early-mover positioning for climate-smart city bonds and green project finance. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "ธนาคารโลก CCDR 2025: การกำหนดราคาคาร์บอนสามารถสร้างรายได้เทียบเท่า ~1% ของ GDP ต่อปี ตลาดคาร์บอนโดยสมัครใจของไทยและกรอบภาษีคาร์บอนที่กำลังเกิดขึ้นสร้างตำแหน่งผู้เข้าก่อนสำหรับพันธบัตรเมืองอัจฉริยะที่เป็นมิตรกับสภาพภูมิอากาศ ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "世银CCDR 2025：碳定价每年可产生约1% GDP的收入。泰国自愿碳市场和新兴碳税框架为气候智慧城市债券和绿色项目融资创造了先发优势。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "Carbon",
  },
  {
    name: {
      en: "Concessional Co-Finance (Climate Resilience)",
      th: "การร่วมจัดหาเงินทุนแบบผ่อนปรน (ความยืดหยุ่นด้านสภาพภูมิอากาศ)",
      zh: "优惠联合融资（气候韧性）" },
    desc: {
      en: "World Bank CCDR 2025 recommends concessional loans, results-based subsidies, and co-financing tied explicitly to climate resilience outcomes — particularly for nature-based solutions (coastal mangroves, watershed management) where private returns are below social returns. ADB, World Bank, and bilateral donors are actively deploying in Thailand. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "ธนาคารโลก CCDR 2025 แนะนำเงินกู้ผ่อนปรน เงินอุดหนุนตามผลลัพธ์ และการร่วมจัดหาเงินทุนที่ผูกโยงกับผลลัพธ์ความยืดหยุ่นด้านสภาพภูมิอากาศโดยเฉพาะ — โดยเฉพาะสำหรับโซลูชันที่อิงธรรมชาติที่ผลตอบแทนส่วนตัวต่ำกว่าผลตอบแทนทางสังคม ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "世银CCDR 2025建议优惠贷款、基于结果的补贴和与气候韧性成效明确挂钩的联合融资——特别是对于自然解决方案（滨海红树林、流域管理），这些领域私人回报低于社会回报。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "Blended",
  },
  {
    name: {
      en: "Catastrophe Bonds + Climate Insurance",
      th: "พันธบัตรหายนะ + ประกันสภาพภูมิอากาศ",
      zh: "巨灾债券 + 气候保险" },
    desc: {
      en: "World Bank CCDR 2025 explicitly recommends catastrophe bonds, biodiversity bonds, and climate insurance as financial instruments that need to be scaled in Thailand. The 2011 floods (USD 46.5B damage, 12.6% of GDP) with a 50% chance of recurrence by 2050 make parametric flood insurance and cat bonds a structurally necessary risk-transfer instrument — not a niche product. Availability and eligibility require project-specific confirmation with the responsible institution; this is not an offer of funding or an entitlement.",
      th: "ธนาคารโลก CCDR 2025 แนะนำพันธบัตรหายนะ พันธบัตรความหลากหลายทางชีวภาพ และประกันสภาพภูมิอากาศเป็นเครื่องมือทางการเงินที่ต้องขยายใหญ่ขึ้นในไทย น้ำท่วมปี 2554 (เสียหาย 4.65 หมื่นล้าน USD, 12.6% ของ GDP) ที่มีโอกาสเกิดซ้ำ 50% ภายในปี 2593 ทำให้ประกันน้ำท่วมแบบพารามิเตอร์และ cat bonds เป็นเครื่องมือโอนความเสี่ยงที่จำเป็นเชิงโครงสร้าง ต้องยืนยันการเปิดรับและคุณสมบัติรายโครงการกับหน่วยงานที่รับผิดชอบ ข้อมูลนี้ไม่ใช่ข้อเสนอเงินทุนหรือการรับรองสิทธิ",
      zh: "世银CCDR 2025明确建议将巨灾债券、生物多样性债券和气候保险作为需要在泰国扩大规模的金融工具。2011年洪灾（损失465亿美元，占GDP12.6%）到2050年有50%的复发概率，使得参数化洪水保险和巨灾债券成为结构性必要的风险转移工具——而非利基产品。 是否开放及是否符合资格须向主管机构逐项目核实；此处不构成融资要约或权益保证。",
    },
    tag: "Risk",
  },
];

interface Risk {
  icon: string;
  title: {
      en: string; th: string; zh: string };
  body: {
      en: string; th: string; zh: string };
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
      en: "Identify the authority that can approve, procure, borrow, and operate the project. Obtain the actual approval sequence and budget commitments; SCITI has not established a universal approval delay.",
      th: "ระบุหน่วยงานที่มีอำนาจอนุมัติ จัดซื้อ กู้ยืม และดำเนินโครงการ ขอขั้นตอนอนุมัติและงบผูกพันจริง SCITI ไม่ได้ยืนยันระยะเวลาล่าช้าที่ใช้ได้กับทุกโครงการ",
      zh: "明确项目审批、采购、借款和运营主体，取得实际审批流程和预算承诺；SCITI未建立通用的审批延误估计。" },
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
      en: "Test the service with its intended users. Computer ownership alone cannot establish internet access or exclusion. Check device access, affordability, accessibility, and assisted service options locally.",
      th: "ทดสอบบริการกับผู้ใช้เป้าหมาย การมีคอมพิวเตอร์เพียงอย่างเดียวไม่ยืนยันการเข้าถึงอินเทอร์เน็ต ตรวจสอบอุปกรณ์ ค่าใช้จ่าย การเข้าถึง และช่องทางช่วยเหลือในพื้นที่",
      zh: "与目标用户测试服务。电脑拥有率不能单独证明联网或排斥程度；核实设备、费用、无障碍及辅助服务。" },
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
      en: "Inspect historical uptime, observation dates, maintenance contracts, and the funded operating budget. A demonstration does not establish continuity; SCITI has not quantified a platform failure rate.",
      th: "ตรวจสอบประวัติเวลาพร้อมใช้งาน วันที่สังเกตการณ์ สัญญาบำรุงรักษา และงบดำเนินงานที่จัดสรรแล้ว การสาธิตไม่ยืนยันความต่อเนื่อง SCITI ยังไม่ได้วัดอัตราล้มเหลวของแพลตฟอร์ม",
      zh: "核实历史可用率、观测日期、维护合同及已落实的运营预算。演示不证明持续运营；SCITI尚未量化平台故障率。" },
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
      en: "Compare the project schedule with procurement mandates and budget cycles. Document which contracts and operating responsibilities continue across changes in leadership.",
      th: "เทียบกำหนดโครงการกับอำนาจจัดซื้อและรอบงบประมาณ ระบุสัญญาและความรับผิดชอบดำเนินงานที่จะต่อเนื่องเมื่อเปลี่ยนผู้บริหาร",
      zh: "将项目进度与采购权限及预算周期对照，记录领导更替后继续有效的合同和运营责任。" },
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
      en: "Confirm the specific activity, entity structure, land rights, licences, and any promotion conditions with the responsible authority. This index does not determine legal eligibility or a universal ownership percentage.",
      th: "ตรวจสอบกิจกรรม โครงสร้างนิติบุคคล สิทธิในที่ดิน ใบอนุญาต และเงื่อนไขส่งเสริมกับหน่วยงานที่รับผิดชอบ ดัชนีนี้ไม่ได้วินิจฉัยสิทธิทางกฎหมายหรือสัดส่วนถือหุ้นที่ใช้ได้ทุกกรณี",
      zh: "向主管机关核实具体业务、实体结构、土地权利、许可和促进条件。本指数不判定法律资格或通用持股比例。" },
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
      en: "Model revenue, debt service, and investor distributions by currency. Stress-test exchange-rate changes over the project horizon; no historical volatility estimate has been validated on this page.",
      th: "จำลองรายได้ ภาระหนี้ และเงินจ่ายผู้ลงทุนแยกตามสกุลเงิน ทดสอบผลจากอัตราแลกเปลี่ยนตลอดอายุโครงการ หน้านี้ยังไม่ได้ตรวจสอบค่าความผันผวนย้อนหลัง",
      zh: "按币种建模收入、偿债及投资者分配，并在项目期限内进行汇率压力测试；本页尚未核实历史波动率估计。" },
    severity: "low",
  },
];

interface ChecklistItem {
  num: string;
  title: {
      en: string; th: string; zh: string };
  desc: {
      en: string; th: string; zh: string };
}

const checklist: ChecklistItem[] = [
  {
    num: "01",
    title: {
      en: "Verify SCITI tier independently",
      th: "ตรวจสอบระดับ SCITI อย่างอิสระ",
      zh: "独立验证SCITI层级" },
    desc: {
      en: "Don't rely on depa certification alone. Check the SCITI composite score, pillar breakdown, and data confidence rating.",
      th: "อย่าพึ่งพาเฉพาะการรับรอง depa ตรวจสอบคะแนนรวม SCITI การแยกตามเสาหลัก และระดับความเชื่อมั่นของข้อมูล",
      zh: "不要仅依赖depa认证。检查SCITI综合评分、支柱分解和数据置信度评级。" },
  },
  {
    num: "02",
    title: {
      en: "Test the City Data Platform live",
      th: "ทดสอบ City Data Platform แบบสด",
      zh: "实时测试城市数据平台" },
    desc: {
      en: "Access the CDP. If the dashboard is offline or data is stale (>30 days), the operational maturity is overstated.",
      th: "เข้าถึง CDP ถ้าแดชบอร์ดออฟไลน์หรือข้อมูลเก่า (>30 วัน) ความสมบูรณ์ในการดำเนินงานถูกพูดเกินจริง",
      zh: "访问CDP。如果仪表板离线或数据过时（>30天），则运营成熟度被夸大。" },
  },
  {
    num: "03",
    title: {
      en: "Map the local governance structure",
      th: "วิเคราะห์โครงสร้างการปกครองท้องถิ่น",
      zh: "梳理地方治理架构" },
    desc: {
      en: "Who decides? Municipality, PAO, special zone authority, or private consortium? Each has different procurement timelines and risk profiles.",
      th: "ใครตัดสินใจ? เทศบาล อบจ. เขตพิเศษ หรือกลุ่มเอกชน? แต่ละแห่งมีระยะเวลาจัดซื้อจัดจ้างและโปรไฟล์ความเสี่ยงต่างกัน",
      zh: "谁做决策？市政府、省级行政组织、特区管理局还是民间联盟？各有不同的采购时间线和风险特征。" },
  },
  {
    num: "04",
    title: {
      en: "Check BOI eligibility before structuring",
      th: "ตรวจสอบสิทธิ์ BOI ก่อนจัดโครงสร้าง",
      zh: "结构设计前检查BOI资格" },
    desc: {
      en: "BOI incentives vary dramatically by sector, location (EEC vs. non-EEC), and activity type. Structure the entity before committing capital.",
      th: "สิทธิประโยชน์ BOI แตกต่างมากตามภาค สถานที่ (EEC vs. ไม่ใช่ EEC) และประเภทกิจกรรม จัดโครงสร้างนิติบุคคลก่อนลงเงิน",
      zh: "BOI优惠因行业、地点（EEC与非EEC）和活动类型差异巨大。在投入资本前确定实体结构。" },
  },
  {
    num: "05",
    title: {
      en: "Audit the maintenance budget",
      th: "ตรวจสอบงบประมาณบำรุงรักษา",
      zh: "审计维护预算" },
    desc: {
      en: "Smart city projects fail post-launch, not during construction. Is there a 5-year OpEx budget for sensor maintenance, software updates, and staff training?",
      th: "โครงการเมืองอัจฉริยะล้มเหลวหลังเปิดตัว ไม่ใช่ระหว่างก่อสร้าง มีงบ OpEx 5 ปีสำหรับบำรุงรักษาเซ็นเซอร์ อัปเดตซอฟต์แวร์ และฝึกอบรมบุคลากรหรือไม่?",
      zh: "智慧城市项目在启动后失败，而非建设期间。是否有5年运维预算用于传感器维护、软件更新和人员培训？" },
  },
  {
    num: "06",
    title: {
      en: "Assess community buy-in on the ground",
      th: "ประเมินการยอมรับของชุมชนในพื้นที่",
      zh: "实地评估社区接受度" },
    desc: {
      en: "Visit. Talk to residents, not officials. If citizens don't know the smart city program exists, adoption risk is severe.",
      th: "ไปเยี่ยมชม พูดคุยกับชาวบ้าน ไม่ใช่เจ้าหน้าที่ ถ้าประชาชนไม่รู้ว่ามีโครงการเมืองอัจฉริยะ ความเสี่ยงด้านการยอมรับรุนแรง",
      zh: "实地走访。与居民交谈，而非官员。如果市民不知道智慧城市项目的存在，采用风险极高。" },
  },
  {
    num: "07",
    title: {
      en: "Model currency exposure explicitly",
      th: "จำลองความเสี่ยงค่าเงินอย่างชัดเจน",
      zh: "明确建模汇率敞口" },
    desc: {
      en: "Revenue in THB, returns expected in USD/EUR/CNY. Model the FX impact over 5-10 year horizons. Consider natural hedges via export revenue.",
      th: "รายได้เป็นบาท ผลตอบแทนคาดหวังเป็น USD/EUR/CNY จำลองผลกระทบ FX ในระยะ 5-10 ปี พิจารณาการป้องกันความเสี่ยงธรรมชาติผ่านรายได้ส่งออก",
      zh: "收入以泰铢计，回报以USD/EUR/CNY预期。对5-10年期进行汇率影响建模。考虑通过出口收入进行自然对冲。" },
  },
  {
    num: "08",
    title: {
      en: "Evaluate the political cycle alignment",
      th: "ประเมินความสอดคล้องกับวัฏจักรการเมือง",
      zh: "评估政治周期对齐度" },
    desc: {
      en: "When is the next election? Who championed this project? Is there cross-party support or single-patron dependency?",
      th: "การเลือกตั้งครั้งต่อไปเมื่อไร? ใครผลักดันโครงการนี้? มีการสนับสนุนข้ามพรรคหรือพึ่งพาผู้อุปถัมภ์คนเดียว?",
      zh: "下次选举是什么时候？谁推动了该项目？是跨党派支持还是单一庇护人依赖？" },
  },
  {
    num: "09",
    title: {
      en: "Confirm data sovereignty and privacy compliance",
      th: "ยืนยันอธิปไตยข้อมูลและการปฏิบัติตามความเป็นส่วนตัว",
      zh: "确认数据主权和隐私合规" },
    desc: {
      en: "Thailand's PDPA (Personal Data Protection Act) is now enforced. Ensure IoT data collection, storage, and cross-border transfer comply.",
      th: "พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคลของไทย (PDPA) บังคับใช้แล้ว ตรวจสอบให้แน่ใจว่าการเก็บ จัดเก็บ และโอนข้อมูล IoT ข้ามพรมแดนเป็นไปตามกฎหมาย",
      zh: "泰国《个人数据保护法》（PDPA）已生效。确保物联网数据的采集、存储和跨境传输合规。" },
  },
  {
    num: "10",
    title: {
      en: "Benchmark against SCITI, not marketing decks",
      th: "เปรียบเทียบกับ SCITI ไม่ใช่สไลด์การตลาด",
      zh: "以SCITI为基准，而非营销材料" },
    desc: {
      en: "Our index is designed to be the brutally honest mirror. Use the pillar scores, data confidence ratings, and tier classifications as your baseline — not the city's own promotional material.",
      th: "ดัชนีของเราถูกออกแบบให้เป็นกระจกสะท้อนความจริงอย่างตรงไปตรงมา ใช้คะแนนเสาหลัก ระดับความเชื่อมั่นข้อมูล และการจัดระดับเป็นพื้นฐาน ไม่ใช่สื่อโฆษณาของเมืองเอง",
      zh: "我们的指数旨在成为残酷诚实的镜子。以支柱评分、数据置信度评级和层级分类作为基准——而非城市自身的宣传材料。" },
  },
];

interface Source {
  name: string;
  desc: {
      en: string; th: string; zh: string };
}

const sources: Source[] = [
  { name: "World Bank Open Data", desc: {
      en: "GDP, FDI aggregates, development indicators",
      th: "GDP, FDI รวม, ตัวชี้วัดการพัฒนา",
      zh: "GDP、FDI总量、发展指标" } },
  { name: "BOI Annual Report 2024", desc: {
      en: "FDI inflows, investment incentive structures, EEC commitments",
      th: "FDI ไหลเข้า, โครงสร้างสิทธิประโยชน์การลงทุน, พันธสัญญา EEC",
      zh: "FDI流入、投资优惠结构、EEC承诺" } },
  { name: "NESDC (National Economic and Social Development Council)", desc: {
      en: "GDP growth forecasts, digital economy targets, national strategy",
      th: "คาดการณ์การเติบโต GDP, เป้าหมายเศรษฐกิจดิจิทัล, ยุทธศาสตร์ชาติ",
      zh: "GDP增长预测、数字经济目标、国家战略" } },
  { name: "NSO Thailand (National Statistical Office)", desc: {
      en: "Household computer ownership, labor force statistics, demographic data",
      th: "การถือครองคอมพิวเตอร์ครัวเรือน, สถิติแรงงาน, ข้อมูลประชากร",
      zh: "家庭电脑拥有率、劳动力统计、人口数据" } },
  { name: "depa Smart City Thailand Office", desc: {
      en: "Smart city designations, CDP status, 105-city roadmap",
      th: "การกำหนดเมืองอัจฉริยะ, สถานะ CDP, แผน 105 เมือง",
      zh: "智慧城市认定、CDP状态、105城路线图" } },
  { name: "SCITI 2026 Index", desc: {
      en: "Composite scores, pillar breakdowns, tier classifications, data confidence ratings",
      th: "คะแนนรวม, การแยกตามเสาหลัก, การจัดระดับ, ระดับความเชื่อมั่นข้อมูล",
      zh: "综合评分、支柱分解、层级分类、数据置信度评级" } },
  { name: "ASEAN Smart City Financing Toolkit", desc: {
      en: "Blended finance frameworks, regional investment facilitation",
      th: "กรอบการเงินผสม, การอำนวยความสะดวกการลงทุนระดับภูมิภาค",
      zh: "混合融资框架、区域投资便利化" } },
  { name: "ADB ACGF Reports", desc: {
      en: "Green finance mechanisms, catalytic co-lending structures",
      th: "กลไกการเงินสีเขียว, โครงสร้างร่วมให้กู้เชิงเร่งปฏิกิริยา",
      zh: "绿色金融机制、催化联合贷款结构" } },
  { name: "SEC Thailand Green Bond Framework", desc: {
      en: "Municipal bond issuance guidelines, sustainable finance taxonomy",
      th: "แนวทางการออกพันธบัตรเทศบาล, อนุกรมวิธานการเงินอย่างยั่งยืน",
      zh: "市政债券发行指引、可持续金融分类法" } },
  { name: "IMF World Economic Outlook", desc: {
      en: "Thailand macroeconomic context, ASEAN growth projections",
      th: "บริบทเศรษฐกิจมหภาคไทย, ประมาณการเติบโต ASEAN",
      zh: "泰国宏观经济背景、东盟增长预测" } },
  { name: "UNCTAD World Investment Report", desc: {
      en: "Cross-border FDI trends, ASEAN investment competitiveness",
      th: "แนวโน้ม FDI ข้ามพรมแดน, ความสามารถแข่งขันด้านการลงทุน ASEAN",
      zh: "跨境FDI趋势、东盟投资竞争力" } },
  { name: "World Bank Thailand Country Climate & Development Report (CCDR) 2025", desc: {
      en: "Climate-economy modelling, $219B investment needs, EEC water security, flood risk projections, coastal erosion, heat stress, carbon pricing mechanisms, financing instruments. Primary source for climate risk data in city dossiers.",
      th: "แบบจำลองภูมิอากาศ-เศรษฐกิจ, ความต้องการลงทุน 2.19 แสนล้าน USD, ความมั่นคงทางน้ำ EEC, การคาดการณ์ความเสี่ยงน้ำท่วม, การกัดเซาะชายฝั่ง, ความเครียดจากความร้อน, กลไกราคาคาร์บอน, เครื่องมือทางการเงิน แหล่งข้อมูลหลักสำหรับข้อมูลความเสี่ยงด้านภูมิอากาศในแฟ้มเมือง",
      zh: "气候-经济模型，2190亿美元投资需求，EEC水安全，洪水风险预测，海岸侵蚀，热应力，碳定价机制，金融工具。城市档案气候风险数据的主要来源。" } },
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
      ? {
      en: "High",
      th: "สูง",
      zh: "高" }
      : s === "medium"
        ? {
      en: "Medium",
      th: "กลาง",
      zh: "中" }
        : {
      en: "Low",
      th: "ต่ำ",
      zh: "低" });

  return (
    <div className="invest-page">

      {/* ═══════════ 1. HERO / THESIS ═══════════ */}
      <section className="section story-hero reveal visible">
        <p className="eyebrow">{translate(locale, {
      en: "Invest Thailand",
      th: "ลงทุนไทย",
      zh: "投资泰国" })}</p>
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

      <InvestmentExplorer locale={locale} onNavigate={onNavigate} />

      {/* ═══════════ SECTION 2: WHAT IS MONEYBALL ═══════════ */}
      <section className="section reveal visible" style={{ paddingTop: 0 }}>
        <div className="invest-ccdr-panel glass-card" style={{ border: "1px solid var(--border)", background: "var(--1)" }}>
          <div className="invest-ccdr-inner">
            <h2 className="invest-reading-title">
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
                en: "Compare a location through documented needs: housing affordability, access to care, mobility, safety, air quality, and digital services. Provincial statistics describe provincial context; they do not establish conditions at a proposed site. The curated hospitality score is an editorial assessment, not a direct measurement of kindness. Use the city dossier to identify evidence dates, geographic scope, and questions for residents. A location becomes an investment case only after project demand, costs, permissions, and delivery capacity are tested.",
      th: "เปรียบเทียบทำเลจากความต้องการที่มีหลักฐาน: ที่อยู่อาศัย การเข้าถึงการรักษา การเดินทาง ความปลอดภัย อากาศ และบริการดิจิทัล สถิติจังหวัดให้บริบทระดับจังหวัด ไม่ได้ยืนยันสภาพพื้นที่โครงการ คะแนนอัธยาศัยเป็นการประเมินเชิงบรรณาธิการ ไม่ใช่การวัดความมีน้ำใจโดยตรง ใช้แฟ้มเมืองตรวจวันที่ ขอบเขตข้อมูล และคำถามสำหรับคนในพื้นที่ แล้วตรวจอุปสงค์ ต้นทุน ใบอนุญาต และศักยภาพส่งมอบของโครงการ",
      zh: "以有据可查的需求比较选址：住房可负担性、医疗、出行、安全、空气及数字服务。省级统计提供省级背景，并不证明项目所在地条件。待客评分属于编辑评估，并非直接测量善意。通过城市档案核实日期、地理范围及居民问题，再验证项目需求、成本、许可和交付能力。"
              })}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ SECTION 3: LOOK BEYOND BANGKOK ═══════════ */}
      <section className="section reveal visible" style={{ paddingTop: 0 }}>
        <div className="invest-ccdr-panel glass-card" style={{ border: "1px solid var(--border)", background: "var(--1)" }}>
          <div className="invest-ccdr-inner">
            <h2 className="invest-reading-title">
              {translate(locale, {
                en: "For Investors: Look Beyond Bangkok",
                th: "สำหรับนักลงทุน: มองข้ามกรุงเทพฯ ไปอีกขั้น",
                zh: "致投资者：把目光投向曼谷之外",
              })}
            </h2>
            <p style={{ fontSize: "var(--text-body)", color: "var(--3)", marginBottom: "2rem", lineHeight: 1.6 }}>
              {translate(locale, {
                en: "For a location decision, compare places beyond the familiar destinations. Investigate wages by activity and effective date, land by parcel and tenure, workforce availability, and access to customers. SCITI helps structure that investigation; it does not establish a universal cost advantage.",
      th: "การเลือกทำเลควรเปรียบเทียบพื้นที่นอกจุดหมายที่คุ้นเคย ตรวจค่าแรงตามกิจกรรมและวันที่มีผล ที่ดินรายแปลงและสิทธิถือครอง แรงงานที่หาได้ และการเข้าถึงลูกค้า SCITI ช่วยจัดกรอบการตรวจสอบ แต่ไม่ได้ยืนยันว่าทุกพื้นที่มีต้นทุนได้เปรียบ",
      zh: "选址时应比较熟悉目的地之外的地方，按业务及生效日期核实工资，按地块和权属核实土地，并调查人才及客户可达性。SCITI帮助组织调查，不证明普遍的成本优势。"
              })}
            </p>

            <h3 style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>
              {translate(locale, {
      en: "What SCITI Gives You",
      th: "สิ่งที่ SCITI มอบให้คุณ",
      zh: "SCITI 能给您什么" })}
            </h3>
            
            <div className="invest-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "GPP & GPP/Capita",
      th: "GPP และ GPP ต่อหัว",
      zh: "GPP与人均GPP" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "Provincial productivity and economic scale (NESDC).",
      th: "ผลิตภาพและขนาดเศรษฐกิจระดับจังหวัด (สภาพัฒน์)",
      zh: "省级生产力和经济规模 (NESDC)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "BOI Incentive Zones",
      th: "เขตส่งเสริมการลงทุน BOI",
      zh: "BOI投资优惠区" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "Tax holidays and special privileges (BOI).",
      th: "การยกเว้นภาษีและสิทธิพิเศษ (BOI)",
      zh: "免税期和特殊待遇 (BOI)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "Minimum Wage Tiers",
      th: "ระดับค่าแรงขั้นต่ำ",
      zh: "最低工资层级" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "Labor cost benchmarking (Min. of Labour).",
      th: "การเปรียบเทียบต้นทุนแรงงาน (กระทรวงแรงงาน)",
      zh: "劳动力成本基准 (劳工部)。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "Infrastructure Scorecard",
      th: "ตารางคะแนนโครงสร้างพื้นฐาน",
      zh: "基础设施记分卡" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "Airport, rail, port, 5G, and broadband.",
      th: "สนามบิน รถไฟ ท่าเรือ 5G และบรอดแบนด์",
      zh: "机场、铁路、港口、5G和宽带。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "Creative Economy Heatmap",
      th: "แผนที่ความเข้มเศรษฐกิจสร้างสรรค์",
      zh: "创意经济热力图" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "15 creative industries by province.",
      th: "15 อุตสาหกรรมสร้างสรรค์แยกตามจังหวัด",
      zh: "按省份划分的15个创意产业。" })}</p>
              </div>
              <div className="glass-card" style={{ padding: "1.5rem" }}>
                <h4 style={{ color: "var(--teal)", marginBottom: "0.5rem" }}>{translate(locale, {
      en: "Moneyball Score",
      th: "คะแนน Moneyball",
      zh: "Moneyball评分" })}</h4>
                <p style={{ fontSize: "var(--text-body)", color: "var(--3)" }}>{translate(locale, {
      en: "Composite: growth + cost + infra + creative.",
      th: "คะแนนรวม: การเติบโต + ต้นทุน + โครงสร้างพื้นฐาน + สร้างสรรค์",
      zh: "综合：增长 + 成本 + 基础设施 + 创意。" })}</p>
              </div>
            </div>

            <h3 style={{ fontSize: "var(--text-body)", marginBottom: "1rem" }}>
              {translate(locale, {
      en: "How to Read the Data",
      th: "วิธีอ่านข้อมูล",
      zh: "如何解读数据" })}
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
            <h2 className="invest-reading-title">
              {translate(locale, {
      en: "Who Signs",
      th: "ใครเป็นคนเซ็น",
      zh: "谁来签字" })}
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
        <p className="eyebrow">{translate(locale, {
      en: "Macro Snapshot",
      th: "ภาพรวมมหภาค",
      zh: "宏观概况" })}</p>
        <h2>{translate(locale, {
          en: "Thailand at a Glance",
          th: "ประเทศไทยในภาพรวม",
          zh: "泰国一览",
        })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "Separate historical observations, policy targets, and modeled scenarios. Values awaiting source reconciliation are withheld; national context does not establish a city-level investment case.",
            th: "แยกข้อมูลย้อนหลัง เป้าหมายนโยบาย และผลจำลอง ค่าที่ยังตรวจสอบแหล่งข้อมูลไม่เสร็จจะไม่แสดง บริบทระดับประเทศไม่ยืนยันความเป็นไปได้ของการลงทุนรายเมือง",
            zh: "区分历史观测、政策目标及模型情景。待核对来源的数值暂不展示；国家背景不能单独证明城市投资可行。",
          })}
        </p>
        <div className="invest-macro-grid">
          {macroStats.map((s, i) => (
            <div key={i} className="invest-macro-cell">
              <span className="invest-macro-label">{translate(locale, s.label)}</span>
              <span className="invest-macro-value">{s.value}</span>
              <span className="invest-macro-sub">{s.sourceUrl ? <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">{translate(locale, s.sub)}</a> : translate(locale, s.sub)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ 3. WHAT SCITI TELLS INVESTORS ═══════════ */}
      <section ref={insightRef} className={`section reveal stagger-2 ${insightVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, {
      en: "Index Intelligence",
      th: "ข้อมูลเชิงลึกจากดัชนี",
      zh: "指数洞察" })}</p>
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
        <p className="eyebrow">{translate(locale, {
      en: "Financial Instruments",
      th: "เครื่องมือทางการเงิน",
      zh: "金融工具" })}</p>
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
        <p className="eyebrow">{translate(locale, {
      en: "Risk Matrix",
      th: "เมทริกซ์ความเสี่ยง",
      zh: "风险矩阵" })}</p>
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
        <p className="eyebrow">{translate(locale, {
      en: "Due Diligence",
      th: "การตรวจสอบสถานะ",
      zh: "尽职调查" })}</p>
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
        <p className="eyebrow">{translate(locale, {
      en: "Sources",
      th: "แหล่งอ้างอิง",
      zh: "数据来源" })}</p>
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
            <div
              key={i}
              className="invest-source-row"
              style={{ borderBottom: i < sources.length - 1 ? "1px solid var(--5)" : "none" }}
            >
              <span className="invest-source-name">{s.name}</span>
              <span className="invest-source-desc">{translate(locale, s.desc)}</span>
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
              {translate(locale, {
      en: "See the Rankings",
      th: "ดูการจัดอันดับ",
      zh: "查看排名" })}
            </button>
            <button className="ghost-button" onClick={() => onNavigate("/methodology")}>
              {translate(locale, {
      en: "Read Methodology",
      th: "อ่านระเบียบวิธีวิจัย",
      zh: "阅读方法论" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
