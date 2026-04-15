import { useState, useMemo } from "react";
import type { Locale } from "./types";
import { translate } from "./cityPresentation";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface FAQ {
  category: string;
  q: { en: string; th: string; zh: string };
  a: { en: string; th: string; zh: string };
}

const CATEGORY_LABELS: Record<string, { en: string; th: string; zh: string }> = {
  "Reality Check": { en: "Reality Check", th: "ความจริงที่ต้องรู้", zh: "现实检验" },
  "About Smart City Thailand": { en: "About Smart City Thailand", th: "เกี่ยวกับเมืองอัจฉริยะไทย", zh: "关于泰国智慧城市" },
  "The 7 Smarts": { en: "The 7 Smarts", th: "7 เสาหลักอัจฉริยะ", zh: "7 大智慧支柱" },
  "Certification & Process": { en: "Certification & Process", th: "การรับรองและกระบวนการ", zh: "认证与流程" },
  "International": { en: "International", th: "ระหว่างประเทศ", zh: "国际合作" },
  "Methodology": { en: "Methodology", th: "วิธีการ", zh: "方法论" },
  "Governance": { en: "Governance", th: "ธรรมาภิบาล", zh: "治理" },
  "Accountability": { en: "Accountability", th: "ความรับผิดชอบ", zh: "问责" },
  "Investment & Economics": { en: "Investment & Economics", th: "การลงทุนและเศรษฐกิจ", zh: "投资与经济" },
  "Politics": { en: "Politics", th: "การเมือง", zh: "政治" },
  "Success": { en: "Success Stories", th: "กรณีสำเร็จ", zh: "成功案例" },
  "About SCITI": { en: "About SCITI", th: "เกี่ยวกับ SCITI", zh: "关于 SCITI" },
};

function localiseCategory(category: string, locale: Locale): string {
  const label = CATEGORY_LABELS[category];
  return label ? translate(locale, label) : category;
}

const FAQS: FAQ[] = [
  // ─── Reality Check ───
  {
    category: "Reality Check",
    q: {
      en: "Why is a city certified but ranked 'Gamma'?",
      th: "ทำไมเมืองได้ตราสัญลักษณ์แต่ถูกจัดอยู่กลุ่ม Gamma?",
      zh: "为什么城市获得了认证但却被评为 Gamma？",
    },
    a: {
      en: "Certification acknowledges a plan. Our index measures the reality. depa's five certification criteria evaluate boundaries, infrastructure plans, CDP design, projects, and participation models — all on paper. SCITI measures what actually runs: operational sensors, open data feeds, citizen satisfaction, real environmental metrics. A city with a 100-page slide deck but zero operational sensors is 'Planned Gamma'.",
      th: "การรับรอง (Certification) คือการรับรอง 'แผน' ตามเกณฑ์ 5 ข้อของ depa ได้แก่ ขอบเขต แผนโครงสร้างพื้นฐาน ออกแบบ CDP โครงการ และการมีส่วนร่วม ทั้งหมดอยู่บนกระดาษ แต่ SCITI วัดสิ่งที่ทำงานจริง: เซ็นเซอร์ ข้อมูลเปิด ความพึงพอใจ และตัวชี้วัดสิ่งแวดล้อม",
      zh: "认证是对计划的认可。depa 的五项认证标准评估的是边界、基础设施计划、CDP 设计、项目和参与模型——都是纸上谈兵。SCITI 衡量的是实际运行的情况：运营传感器、开放数据、市民满意度、真实环境指标。",
    },
  },
  {
    category: "Reality Check",
    q: {
      en: "Does Thailand have a digital divide problem?",
      th: "ประเทศไทยมีปัญหาช่องว่างดิจิทัลไหม?",
      zh: "泰国存在数字鸿沟问题吗？",
    },
    a: {
      en: "Yes. Thailand has 92 million mobile subscribers (133% penetration) and 55 million active mobile internet users — impressive on paper. But only 21% of Thai households own a computer, far below the global average of 49%. This means 'smart city' services that require desktop or broadband access exclude most residents outside Bangkok and the EEC. The SCITI index reflects this by weighting Livability higher than Digital.",
      th: "ใช่ ไทยมี 92 ล้านเลขหมายมือถือ (เจาะ 133%) และผู้ใช้เน็ตมือถือ 55 ล้านคน แต่มีเพียง 21% ของครัวเรือนไทยที่มีคอมพิวเตอร์ ต่ำกว่าค่าเฉลี่ยโลก 49% มาก บริการ smart city ที่ต้องใช้เดสก์ท็อปจึงเข้าไม่ถึงคนส่วนใหญ่นอกกรุงเทพฯ",
      zh: "是的。泰国拥有9200万手机用户（渗透率133%）和5500万活跃移动互联网用户——但只有21%的家庭拥有电脑，远低于全球49%的平均水平。这意味着需要桌面或宽带访问的”智慧城市”服务将大部分曼谷以外的居民排除在外。",
    },
  },
  {
    category: "Reality Check",
    q: {
      en: "What are the biggest challenges facing Thai smart cities?",
      th: "อะไรคืออุปสรรคใหญ่ที่สุดของเมืองอัจฉริยะไทย?",
      zh: "泰国智慧城市面临的最大挑战是什么？",
    },
    a: {
      en: "Five systemic issues: (1) Centralized bureaucracy — central government controls local planning, budgeting, and procurement; (2) Coordination failures between national policy and local execution; (3) Talent concentration in Bangkok — smaller cities lack digital skills; (4) The digital divide — only 21% household computer ownership; (5) Data quality — departments don't share data with each other, and city data platforms often go offline after the launch event.",
      th: "5 ปัญหาเชิงระบบ: (1) ระบบราชการรวมศูนย์ — ส่วนกลางคุมการวางแผน งบ และจัดซื้อ (2) การประสานงานล้มเหลวระหว่างนโยบายกลางกับท้องถิ่น (3) คนเก่งกระจุกในกรุงเทพฯ (4) ช่องว่างดิจิทัล — คอมพิวเตอร์ในบ้านแค่ 21% (5) คุณภาพข้อมูล — หน่วยงานไม่แชร์ข้อมูลกัน CDP มักล่มหลังงานเปิดตัว",
      zh: "五大系统性问题：(1) 中央集权官僚体制——中央控制地方规划、预算和采购；(2) 国家政策与地方执行之间协调失败；(3) 人才集中在曼谷；(4) 数字鸿沟——家庭电脑拥有率仅21%；(5) 数据质量——部门间不共享数据，城市数据平台往往在启动仪式后就下线了。",
    },
  },
  // ─── About Smart City Thailand ───
  {
    category: "About Smart City Thailand",
    q: {
      en: "What is Smart City Thailand and who runs it?",
      th: "Smart City Thailand คืออะไร ใครเป็นผู้ดูแล?",
      zh: "什么是泰国智慧城市计划？谁在运营？",
    },
    a: {
      en: "Smart City Thailand is a national program housed within depa (Digital Economy Promotion Agency), under the Ministry of Digital Economy and Society. The Smart City Thailand Office was launched in early 2019. It is overseen by a National Steering Committee chaired by the Deputy Prime Minister, with ministers from Transport, Energy, and Digital Economy. depa serves as the hub connecting central government, local authorities, private sector, academia, and international partners.",
      th: "Smart City Thailand คือโปรแกรมระดับชาติ อยู่ภายใต้ depa (สำนักงานส่งเสริมเศรษฐกิจดิจิทัล) กระทรวงดิจิทัลฯ สำนักงานเมืองอัจฉริยะเปิดตัวต้นปี 2019 กำกับดูแลโดยคณะกรรมการบริหารที่มีรองนายกรัฐมนตรีเป็นประธาน พร้อมรัฐมนตรีว่าการกระทรวงคมนาคม พลังงาน และดิจิทัลฯ",
      zh: "泰国智慧城市是一项国家计划，设在数字经济促进局（depa）内，隶属数字经济与社会部。智慧城市泰国办公室于2019年初启动。由副总理主持的国家指导委员会监管，成员包括交通部、能源部和数字经济部的部长。",
    },
  },
  {
    category: "About Smart City Thailand",
    q: {
      en: "When did Thailand start pursuing smart cities?",
      th: "ประเทศไทยเริ่มพัฒนาเมืองอัจฉริยะเมื่อไหร่?",
      zh: "泰国什么时候开始发展智慧城市？",
    },
    a: {
      en: "The concept was first introduced in 2003 by MICT, but didn't gain real traction until Thailand 4.0 launched in 2016. The 20-year National Strategy (2017-2036) formally established smart cities as a national priority. MICT was reorganized into MDES in 2017. Phuket was designated as the first official pilot, followed by Chiang Mai. The Smart City Thailand Office was established within depa in early 2019.",
      th: "แนวคิดเมืองอัจฉริยะปรากฏครั้งแรกในปี 2003 โดย กระทรวง ICT แต่ไม่ได้ผลจริงจนกว่า Thailand 4.0 เปิดตัวในปี 2016 ยุทธศาสตร์ชาติ 20 ปี (2017-2036) กำหนดเมืองอัจฉริยะเป็นวาระแห่งชาติ ภูเก็ตเป็นนำร่องแรก ตามด้วยเชียงใหม่ สำนักงานเมืองอัจฉริยะตั้งขึ้นในปี 2019",
      zh: "这个概念最早由信息通信技术部于2003年提出，但直到2016年泰国4.0启动后才真正获得动力。20年国家战略（2017-2036）正式将智慧城市确立为国家优先事项。普吉岛被指定为第一个官方试点城市，随后是清迈。智慧城市泰国办公室于2019年初成立。",
    },
  },
  {
    category: "About Smart City Thailand",
    q: {
      en: "How many smart cities does Thailand have?",
      th: "ประเทศไทยมีเมืองอัจฉริยะกี่เมือง?",
      zh: "泰国有多少智慧城市？",
    },
    a: {
      en: "As of 2025, there are 37 certified smart cities across 4 batches, plus dozens more in 'promotion' status. The national target is 100 smart cities by the end of the 20-year National Strategy (2036), with 3 cities to be internationally accredited. SCITI tracks 118 cities total — all certified, promotion-phase, and registered candidates — because plans that never launch also deserve measurement.",
      th: "ณ ปี 2025 มีเมืองอัจฉริยะรับรองแล้ว 37 เมืองใน 4 รุ่น พร้อมอีกหลายสิบเมืองในสถานะ 'ส่งเสริม' เป้าหมายคือ 100 เมืองภายในปี 2036 SCITI ติดตาม 118 เมืองทั้งหมด เพราะแม้แต่แผนที่ไม่เคยเริ่มก็สมควรถูกวัด",
      zh: "截至2025年，共有37个经过4批认证的智慧城市，还有数十个处于”推广”阶段。国家目标是到2036年建成100座智慧城市。SCITI追踪118个城市——包括已认证、推广阶段和注册候选城市——因为从未启动的计划也值得被衡量。",
    },
  },
  // ─── The 7 Smarts ───
  {
    category: "The 7 Smarts",
    q: {
      en: "What are the 7 smart domains in Thailand's framework?",
      th: "7 Smart ในกรอบเมืองอัจฉริยะไทยคืออะไร?",
      zh: "泰国框架中的7个智慧领域是什么？",
    },
    a: {
      en: "Thailand uses the 'Two-Five-Seven' system: (1) Smart Environment (mandatory for all, led by Ministry of Natural Resources); (2) Smart Economy (Ministry of Finance); (3) Smart Mobility (Ministry of Transport); (4) Smart Energy (Ministry of Energy); (5) Smart People (MDES); (6) Smart Living — covering health, safety, and built environment (Ministry of Interior); (7) Smart Governance (Office of Prime Minister). Each city chooses domains based on local needs but must include Environment.",
      th: "ไทยใช้ระบบ 'สอง-ห้า-เจ็ด': (1) Smart Environment (บังคับทุกเมือง, กระทรวงทรัพยากรฯ) (2) Smart Economy (กระทรวงการคลัง) (3) Smart Mobility (กระทรวงคมนาคม) (4) Smart Energy (กระทรวงพลังงาน) (5) Smart People (กระทรวงดิจิทัลฯ) (6) Smart Living — สุขภาพ ความปลอดภัย อาคาร (กระทรวงมหาดไทย) (7) Smart Governance (สำนักนายกฯ) แต่ละเมืองเลือกตามความต้องการ แต่ต้องมี Environment",
      zh: "泰国使用”二五七”体系：(1) 智慧环境（所有城市必选）(2) 智慧经济 (3) 智慧交通 (4) 智慧能源 (5) 智慧市民 (6) 智慧生活——涵盖健康、安全和建筑环境 (7) 智慧治理。每个城市根据需求选择领域，但必须包含环境。",
    },
  },
  {
    category: "The 7 Smarts",
    q: {
      en: "How does SCITI's 7 pillars differ from depa's 7 domains?",
      th: "7 เสาหลักของ SCITI ต่างจาก 7 Smart ของ depa อย่างไร?",
      zh: "SCITI的7个支柱与depa的7个领域有何不同？",
    },
    a: {
      en: "depa's 7 domains (Environment, Economy, Mobility, Energy, People, Living, Governance) are a planning framework — they help cities organize proposals. SCITI's 7 pillars (Livability, Economy, Safety, Wellbeing, Environment, Hospitality, Digital) are measurement pillars weighted by citizen impact. Livability (25%) and Economy (20%) carry the most weight because they reflect lived experience. Digital (5%) weighs least because connectivity without quality of life is just infrastructure theater.",
      th: "7 Smart ของ depa เป็นกรอบการวางแผน ช่วยจัดทำข้อเสนอ 7 เสาหลักของ SCITI (ความน่าอยู่ เศรษฐกิจ ความปลอดภัย คุณภาพชีวิต สิ่งแวดล้อม การท่องเที่ยว ดิจิทัล) เป็นเสาวัดผลถ่วงน้ำหนักตามผลกระทบต่อพลเมือง ความน่าอยู่ (25%) และเศรษฐกิจ (20%) หนักสุดเพราะสะท้อนชีวิตจริง ดิจิทัล (5%) หนักน้อยสุดเพราะเน็ตเร็วที่ไม่มีคุณภาพชีวิตเป็นแค่โครงสร้างพื้นฐานโชว์",
      zh: "depa的7个领域是规划框架——帮助城市组织提案。SCITI的7个支柱（宜居性、经济、安全、福祉、环境、旅游、数字）是按市民影响加权的测量支柱。宜居性(25%)和经济(20%)权重最高因为反映了真实生活体验。数字(5%)权重最低因为没有生活质量的连接只是基础设施表演。",
    },
  },
  // ─── Certification & Process ───
  {
    category: "Certification & Process",
    q: {
      en: "How does a city become a certified smart city?",
      th: "เมืองต้องทำอย่างไรถึงจะได้รับรองเป็นเมืองอัจฉริยะ?",
      zh: "一个城市如何成为认证智慧城市？",
    },
    a: {
      en: "A city must meet five criteria: (1) Identify its boundaries, smart city type, vision, and goals through citizen participation; (2) Formulate an infrastructure plan for digital and physical assets; (3) Design a City Data Platform (CDP) with cybersecurity; (4) Build urban systems and projects matching its type; (5) Create a management model with public participation. After endorsement by the National Steering Committee, the city becomes a 'depa Smart City Promotional Area.'",
      th: "เมืองต้องผ่านเกณฑ์ 5 ข้อ: (1) กำหนดขอบเขต ประเภท วิสัยทัศน์ และเป้าหมาย ผ่านการมีส่วนร่วมของประชาชน (2) จัดทำแผนพัฒนาโครงสร้างพื้นฐานทั้งดิจิทัลและกายภาพ (3) ออกแบบ City Data Platform (CDP) พร้อมระบบรักษาความปลอดภัยไซเบอร์ (4) สร้างระบบเมืองและโครงการ (5) สร้างโมเดลบริหารจัดการแบบมีส่วนร่วม",
      zh: "城市必须满足五项标准：(1) 通过市民参与确定边界、类型、愿景和目标；(2) 制定数字和实体基础设施计划；(3) 设计带网络安全的城市数据平台(CDP)；(4) 建设与类型匹配的城市系统和项目；(5) 创建有公众参与的管理模式。",
    },
  },
  {
    category: "Certification & Process",
    q: {
      en: "What is a City Data Platform (CDP)?",
      th: "City Data Platform (CDP) คืออะไร?",
      zh: "什么是城市数据平台(CDP)？",
    },
    a: {
      en: "The CDP is the nerve center of a smart city — it integrates data from all city systems (sensors, open data, citizen reports) to give a holistic real-time view of the city's condition. It powers analytics, business intelligence, open data for citizens, and Intelligent Operations Centers (IOCs). Designing a CDP is one of the five mandatory criteria for Thailand's smart city certification. In practice, many CDPs go offline after the launch event, which is why SCITI penalizes cities with non-functional platforms.",
      th: "CDP คือศูนย์ประสาทของเมืองอัจฉริยะ — รวมข้อมูลจากทุกระบบ (เซ็นเซอร์ ข้อมูลเปิด รายงานพลเมือง) เพื่อให้เห็นภาพรวมเมืองแบบเรียลไทม์ ใช้วิเคราะห์ข้อมูล, BI, ข้อมูลเปิดสำหรับพลเมือง และศูนย์ปฏิบัติการอัจฉริยะ (IOC) ในทางปฏิบัติ CDP หลายแห่งล่มหลังงานเปิดตัว ซึ่งเป็นเหตุที่ SCITI ลงโทษเมืองที่แพลตฟอร์มไม่ทำงาน",
      zh: "CDP是智慧城市的神经中枢——它整合所有城市系统（传感器、开放数据、市民报告）的数据，提供城市状况的实时全景。它支持分析、商业智能、市民开放数据和智能运营中心(IOC)。设计CDP是泰国智慧城市认证的五个必要标准之一。实际上，许多CDP在启动仪式后就下线了，这就是SCITI对平台不运作的城市进行惩罚的原因。",
    },
  },
  // ─── International Collaboration ───
  {
    category: "International",
    q: {
      en: "What is the ASEAN Smart Cities Network (ASCN)?",
      th: "ASEAN Smart Cities Network (ASCN) คืออะไร?",
      zh: "东盟智慧城市网络(ASCN)是什么？",
    },
    a: {
      en: "ASCN was established in 2018 as a regional platform for ASEAN Member States to share smart city best practices. Its primary goal is improving quality of life through technology for sustainable urban development. Thai cities like Bangkok, Chonburi, and Chiang Mai are active members. The network connects with partners including Japan (ASEAN-Japan Smart Cities Network), Australia (ASUS project via UN-Habitat), the UK (Global Future Cities Programme), and Mastercard (City Possible initiative).",
      th: "ASCN ก่อตั้งปี 2018 เป็นแพลตฟอร์มระดับภูมิภาคให้ชาติอาเซียนแลกเปลี่ยนแนวปฏิบัติเมืองอัจฉริยะ เมืองไทยที่ร่วมได้แก่ กรุงเทพฯ ชลบุรี เชียงใหม่ เครือข่ายเชื่อมกับญี่ปุ่น ออสเตรเลีย (โครงการ ASUS ผ่าน UN-Habitat) สหราชอาณาจักร (GFCP) และ Mastercard",
      zh: "ASCN成立于2018年，是东盟成员国共享智慧城市最佳实践的区域平台。曼谷、春武里和清迈等泰国城市是活跃成员。该网络与日本（东盟-日本智慧城市网络）、澳大利亚（通过联合国人居署的ASUS项目）、英国（全球未来城市计划）和万事达卡等合作伙伴相连。",
    },
  },
  {
    category: "International",
    q: {
      en: "What is the ASUS project and how does it involve Thai cities?",
      th: "โครงการ ASUS คืออะไร เกี่ยวข้องกับเมืองไทยอย่างไร?",
      zh: "ASUS项目是什么？泰国城市如何参与？",
    },
    a: {
      en: "ASUS (Accelerating the Implementation of the ASEAN Sustainable Urbanisation Strategy) is a multi-phase project funded by the Australian government and implemented by UN-Habitat. In Phase II, two Thai cities participate: Nakhon Si Thammarat (solid waste management) and Chiang Mai (safety and security with digital tools). It uses participatory methodology with strong emphasis on Gender Equality, Disability, and Social Inclusion (GEDSI).",
      th: "ASUS (Accelerating the Implementation of the ASEAN Sustainable Urbanisation Strategy) เป็นโครงการหลายเฟสโดยรัฐบาลออสเตรเลียผ่าน UN-Habitat เฟส 2 มี 2 เมืองไทย: นครศรีธรรมราช (จัดการขยะ) และเชียงใหม่ (ความปลอดภัยด้วยเครื่องมือดิจิทัล) เน้นกระบวนการมีส่วนร่วมและความเสมอภาค",
      zh: "ASUS（加速实施东盟可持续城镇化战略）是由澳大利亚政府资助、联合国人居署实施的多阶段项目。第二阶段有两个泰国城市参与：洛坤府（固体废物管理）和清迈（用数字工具提升安全）。该项目采用参与式方法，强调性别平等、残疾人和社会包容(GEDSI)。",
    },
  },
  // ─── Methodology ───
  {
    category: "Methodology",
    q: {
      en: "Why is 'Livability' weighted higher than 'Digital'?",
      th: "ทำไม 'ความน่าอยู่' ถึงน้ำหนักเยอะกว่า 'ดิจิทัล'?",
      zh: "为什么”宜居性”的权重高于”数字”？",
    },
    a: {
      en: "Technology is a tool, not the objective. depa's own definition says a smart city should 'achieve citizen's quality of life and happiness as well as sustainability.' A smart city with 5G but broken sidewalks is a failure. We weight Livability at 25% because a city must function for its citizens before it can be 'Smart'. Digital at 5% reflects this: connectivity without quality of life is infrastructure theater.",
      th: "เทคโนโลยีคือเครื่องมือ ไม่ใช่เป้าหมาย depa เองนิยามเมืองอัจฉริยะว่าต้อง 'บรรลุคุณภาพชีวิตและความสุขของพลเมือง' เมืองที่มี 5G แต่ทางเท้าพังคือความล้มเหลว ความน่าอยู่ 25% เพราะเมืองต้องทำงานได้จริงเพื่อประชาชนก่อน ดิจิทัล 5% สะท้อนว่าเน็ตเร็วที่ไม่มีคุณภาพชีวิตเป็นแค่โชว์",
      zh: "技术是工具，不是目标。depa自己的定义说智慧城市应该'实现市民的生活质量、幸福和可持续性'。拥有5G但人行道破损的城市是失败的。宜居性25%因为城市必须先为市民服务才能称'智慧'。数字5%反映了这一点：没有生活质量的连接只是基础设施表演。",
    },
  },
  {
    category: "Methodology",
    q: {
      en: "What is the 'Data Confidence' multiplier?",
      th: "'Data Confidence' multiplier คืออะไร?",
      zh: "什么是”数据置信度”乘数？",
    },
    a: {
      en: "It's a penalty for opacity. If a city stops reporting open data to data.go.th, if their City Data Platform goes offline, or if they haven't updated their datasets in over a year, the Data Confidence multiplier automatically lowers their composite score. This prevents cities from coasting on a one-time good score. Transparency is a continuous obligation, not a launch-day achievement.",
      th: "เป็นค่าปรับสำหรับความไม่โปร่งใส หากเมืองหยุดรายงานข้อมูลเปิดไปที่ data.go.th หรือ CDP ล่ม หรือไม่อัปเดตข้อมูลเกิน 1 ปี ตัวคูณนี้จะลดคะแนนรวมอัตโนมัติ ป้องกันไม่ให้เมืองอยู่ได้ด้วยคะแนนเก่า ความโปร่งใสเป็นภาระต่อเนื่อง ไม่ใช่ผลงานวันเปิดตัว",
      zh: "这是对不透明度的惩罚。如果城市停止向data.go.th报告开放数据、CDP下线、或超过一年未更新数据集，数据置信度乘数会自动降低综合得分。这防止城市靠一次性的好成绩坐享其成。透明度是持续义务，不是启动日成就。",
    },
  },
  {
    category: "Methodology",
    q: {
      en: "What is the PPPP model?",
      th: "โมเดล PPPP คืออะไร?",
      zh: "什么是PPPP模式？",
    },
    a: {
      en: "PPPP stands for People-Public-Private-Partnership — an extension of PPP that puts 'People' first. The concept, central to Thailand's smart city approach, means citizens define their own needs 'from within' rather than having solutions imposed top-down. The process of citizen engagement is as important as the result. This was formalized after multiple global smart city projects failed due to lack of community input.",
      th: "PPPP ย่อมาจาก People-Public-Private-Partnership — ขยายจาก PPP โดยเพิ่ม 'People' เป็นอันดับแรก แนวคิดนี้เป็นหัวใจของเมืองอัจฉริยะไทย หมายความว่าพลเมืองกำหนดความต้องการ 'จากภายใน' ไม่ใช่ถูกกำหนดจากบนลงล่าง กระบวนการมีส่วนร่วมสำคัญเท่ากับผลลัพธ์",
      zh: "PPPP代表人民-公共-私营-伙伴关系——是PPP的扩展，将'人民'放在首位。这个概念是泰国智慧城市方法的核心，意味着市民'从内部'定义自己的需求，而不是被自上而下地强加解决方案。市民参与的过程与结果同样重要。",
    },
  },
  // ─── Governance & Players ───
  {
    category: "Governance",
    q: {
      en: "What are City Development Corporations (CDCs)?",
      th: "City Development Corporations (CDCs) คืออะไร?",
      zh: "什么是城市发展公司(CDC)？",
    },
    a: {
      en: "CDCs are public-private partnership entities supported by national legislation. Nearly 20 CDCs have been established across Thailand, most notably in Khon Kaen, Phuket, and Chonburi. They supplement local budgets, give municipalities more financial autonomy, and provide an entry point for private companies to participate in smart city development. The Khon Kaen CDC (KKTS) is often cited as the most active — it's driving the city's LRT project through a private-sector-led model unique in Thailand.",
      th: "CDC คือหน่วยงานความร่วมมือรัฐ-เอกชนตามกฎหมาย มี CDC เกือบ 20 แห่งทั่วไทย โดยเฉพาะขอนแก่น ภูเก็ต ชลบุรี ช่วยเสริมงบท้องถิ่น เพิ่มอิสระทางการเงิน และเปิดช่องให้เอกชนร่วมพัฒนาเมือง CDC ขอนแก่น (KKTS) เป็นตัวอย่างที่กระตือรือร้นที่สุด กำลังขับเคลื่อนรถไฟฟ้า LRT แบบเอกชนนำ",
      zh: "CDC是有国家立法支持的公私合作实体。泰国已建立近20个CDC，最著名的在孔敬、普吉和春武里。它们补充地方预算，赋予市政府更多财务自主权。孔敬CDC(KKTS)经常被引用为最活跃的——它正通过泰国独特的私营部门主导模式推动城市的轻轨项目。",
    },
  },
  {
    category: "Governance",
    q: {
      en: "What role does depa play beyond certification?",
      th: "depa มีบทบาทอะไรนอกจากการรับรอง?",
      zh: "depa在认证之外还发挥什么作用？",
    },
    a: {
      en: "depa is the central hub of Thailand's smart city ecosystem. Beyond certification, it: (1) develops policy, regulations, and incentives; (2) generates demand through city enrollment; (3) provides supply-side support through startup incubation and SME programs; (4) coordinates with BOI for tax incentives and Smart Visas for foreign talent; (5) operates technology sandboxes for testing innovations; (6) connects Thai cities with international partners across ASEAN, Japan, UK, Australia, and the US.",
      th: "depa เป็นศูนย์กลางระบบนิเวศเมืองอัจฉริยะ นอกจากรับรองแล้ว ยังทำ: (1) พัฒนานโยบาย กฎระเบียบ แรงจูงใจ (2) สร้างอุปสงค์ผ่านการลงทะเบียนเมือง (3) สนับสนุนฝั่ง supply ผ่านบ่มเพาะสตาร์ทอัพ (4) ประสานกับ BOI เรื่องสิทธิภาษีและ Smart Visa (5) ดำเนินการ sandbox ทดสอบเทคโนโลยี (6) เชื่อมเมืองไทยกับพันธมิตรระหว่างประเทศ",
      zh: "depa是泰国智慧城市生态系统的中心枢纽。除认证外，它还：(1)制定政策、法规和激励措施；(2)通过城市注册创造需求；(3)通过创业孵化和中小企业项目提供供给侧支持；(4)与BOI协调税收优惠和外国人才智慧签证；(5)运营技术沙盒测试创新；(6)将泰国城市与东盟、日本、英国、澳大利亚和美国的国际伙伴联系起来。",
    },
  },
  // ─── Accountability ───
  {
    category: "Accountability",
    q: {
      en: "What happens if a city's data is outdated?",
      th: "จะเกิดอะไรขึ้นถ้าข้อมูลของเมืองล้าสมัย?",
      zh: "如果城市的数据过时了会怎样？",
    },
    a: {
      en: "The score drops automatically. SCITI applies a Data Confidence multiplier: if a city stops reporting to data.go.th, if their CDP goes offline, or if datasets are stale, the penalty kicks in. We don't grandfather old scores. Transparency is a running obligation. This is why some formerly well-ranked cities have slipped — they stopped feeding their own platform.",
      th: "คะแนนจะลดอัตโนมัติ SCITI ใช้ตัวคูณ Data Confidence: หากเมืองหยุดรายงานข้อมูล หรือ CDP ล่ม หรือข้อมูลค้าง คะแนนจะถูกหักทันที เราไม่ให้สิทธิ์คะแนนเก่า ความโปร่งใสเป็นภาระต่อเนื่อง นี่คือเหตุที่บางเมืองที่เคยอันดับดีตกลงมา — พวกเขาหยุดป้อนข้อมูลให้แพลตฟอร์มตัวเอง",
      zh: "得分会自动下降。SCITI应用数据置信度乘数：如果城市停止报告、CDP下线或数据过期，惩罚就会生效。我们不保留旧分数。透明度是持续义务。这就是为什么一些曾经排名靠前的城市下滑了——他们停止为自己的平台提供数据。",
    },
  },
  // ─── Politics ───
  {
    category: "Politics",
    q: {
      en: "Is this index critical of the government?",
      th: "ดัชนีนี้โจมตีรัฐบาลหรือเปล่า?",
      zh: "这个指数是在批评政府吗？",
    },
    a: {
      en: "This index is honest, not hostile. depa created the framework and momentum; we provide the mirror. The SCITI methodology is peer-reviewed (SCSE Taipei 2026) and uses public data sources. To improve, Thai cities need accurate reflection, not just applause. Feedback is the highest form of support.",
      th: "ดัชนีนี้จริงใจ ไม่ได้เป็นศัตรู depa เป็นผู้สร้างกรอบและแรงขับเคลื่อน เราเป็นกระจก วิธีการของ SCITI ผ่านการตรวจสอบโดยผู้ทรงคุณวุฒิ (SCSE ไทเป 2026) และใช้ข้อมูลเปิดเท่านั้น เมืองไทยต้องการการสะท้อนจริง ไม่ใช่แค่เสียงปรบมือ",
      zh: "这个指数是诚实的，而非敌对的。depa建立了框架并推动了进展；我们提供镜子。SCITI方法论经过同行评审（2026台北SCSE），仅使用公开数据来源。为了进步，泰国城市需要准确的反思，而不仅仅是掌声。",
    },
  },
  // ─── Success Stories ───
  {
    category: "Success",
    q: {
      en: "Which city is the best model for Thailand?",
      th: "เมืองไหนที่เป็นต้นแบบที่ดีที่สุดสำหรับไทย?",
      zh: "哪个城市是泰国的最佳榜样？",
    },
    a: {
      en: "Nakhon Si Thammarat. It proves smart cities work without being rich. 10-hour flood warning, 92% citizen satisfaction, 0 flood fatalities since 2021, and affordable replication across the South. It focuses on solving local pain points with appropriate tech — not buying expensive platforms.",
      th: "นครศรีธรรมราช พิสูจน์ว่าเมืองอัจฉริยะทำงานได้โดยไม่ต้องรวย เตือนภัยน้ำท่วมล่วงหน้า 10 ชม. ความพึงพอใจ 92% ไม่มีผู้เสียชีวิตจากน้ำท่วมตั้งแต่ 2021 สามารถจำลองได้ทั่วภาคใต้ในราคาประหยัด เน้นแก้ปัญหาด้วยเทคโนโลยีที่เหมาะสม ไม่ใช่ซื้อแพลตฟอร์มแพง",
      zh: "洛坤府。它证明智慧城市不需要富有也能运作。10小时洪水预警、92%市民满意度、自2021年以来零洪水死亡，且可在南部经济实惠地复制。专注用适当技术解决本地痛点——不是购买昂贵的平台。",
    },
  },
  {
    category: "Success",
    q: {
      en: "What are Thailand's showcase pilot cities?",
      th: "เมืองนำร่องตัวอย่างของไทยมีอะไรบ้าง?",
      zh: "泰国的示范试点城市有哪些？",
    },
    a: {
      en: "Phuket — first official pilot, tourism revitalization via the 'Phuket Sandbox' with 5G integration. Chiang Mai — early pilot focused on safety and digital tools. Khon Kaen — 'Living Lab' for health tech modernization, private-sector-led LRT via the KKTS consortium. Mae Moh (Lampang) — clean energy hub by EGAT. Wang Chan Valley (Rayong) — EEC technology hub. Samyan (Bangkok) — innovation-focused urban district. Each demonstrates a different model: tourism, health, energy, industry, or innovation.",
      th: "ภูเก็ต — นำร่องแรก ฟื้นฟูท่องเที่ยวผ่าน 'Phuket Sandbox' + 5G เชียงใหม่ — นำร่องด้านความปลอดภัย + ดิจิทัล ขอนแก่น — Living Lab สุขภาพ + LRT โดยเอกชนผ่าน KKTS แม่เมาะ (ลำปาง) — ศูนย์พลังงานสะอาดโดย กฟผ. วังจันทร์ (ระยอง) — เทคโนโลยี EEC สามย่าน (กรุงเทพฯ) — นวัตกรรมเมือง",
      zh: "普吉——第一个官方试点，通过'普吉沙盒'和5G整合振兴旅游业。清迈——早期试点专注安全和数字工具。孔敬——健康技术现代化'实验室'，私营主导的轻轨。湄莫（南邦）——泰国电力局清洁能源中心。旺占（罗勇）——EEC技术中心。三养（曼谷）——创新城市区。每个展示不同模式。",
    },
  },
  {
    category: "Success",
    q: {
      en: "What is Thailand Smart City Week?",
      th: "Thailand Smart City Week คืออะไร?",
      zh: "什么是泰国智慧城市周？",
    },
    a: {
      en: "A major annual event organized by MDES and depa. Smart City Week 2020 (October 16-22) was the first hybrid event, themed 'REAL Solutions for REAL People in the REAL Smart Cities.' It featured live webinars, international testimonies from Japan, UK, and Mastercard, and showcased key projects. It serves as the flagship platform for domestic and international smart city networking.",
      th: "งานประจำปีสำคัญจัดโดยกระทรวงดิจิทัลฯ และ depa Smart City Week 2020 (16-22 ตุลาคม) เป็นงานไฮบริดครั้งแรก ธีม 'REAL Solutions for REAL People in the REAL Smart Cities' มีเว็บบินาร์ คำรับรองจากญี่ปุ่น สหราชอาณาจักร Mastercard และโชว์โครงการสำคัญ",
      zh: "由数字经济与社会部和depa组织的重要年度活动。2020年智慧城市周（10月16-22日）是首次混合活动，主题为'真正的智慧城市为真正的人提供真正的解决方案'。展示了来自日本、英国和万事达卡的国际证言和关键项目。",
    },
  },
  // ─── About SCITI ───
  {
    category: "About SCITI",
    q: {
      en: "What does SCITI stand for?",
      th: "SCITI ย่อมาจากอะไร?",
      zh: "SCITI代表什么？",
    },
    a: {
      en: "SCITI stands for Smart City Thailand Index — pronounced 'City'. It is an independent assessment tool measuring how well Thai smart cities actually perform across 7 pillars (Livability, Economy, Safety, Wellbeing, Environment, Hospitality, Digital), scored 0-100. Unlike depa's certification which evaluates plans, SCITI measures real-world outcomes using 15+ verifiable data sources including satellite imagery, open data portals, and environmental sensors.",
      th: "SCITI ย่อมาจาก Smart City Thailand Index — อ่านว่า 'ซิตี้' เป็นเครื่องมือประเมินอิสระวัดผลเมืองอัจฉริยะไทยจริงๆ ใน 7 เสาหลัก คะแนน 0-100 ต่างจากการรับรองของ depa ที่ประเมินแผน SCITI วัดผลลัพธ์จริงจาก 15+ แหล่งข้อมูลรวมถึงภาพดาวเทียม ข้อมูลเปิด และเซ็นเซอร์สิ่งแวดล้อม",
      zh: "SCITI代表泰国智慧城市指数——发音为'City'。这是一个独立评估工具，衡量泰国智慧城市在7个支柱（宜居性、经济、安全、福祉、环境、旅游、数字）中的实际表现，评分0-100。与depa评估计划的认证不同，SCITI使用15+个可验证数据源衡量现实世界的结果，包括卫星图像、开放数据门户和环境传感器。",
    },
  },
  {
    category: "About SCITI",
    q: {
      en: "Who created the SCITI index?",
      th: "ใครเป็นผู้สร้างดัชนี SCITI?",
      zh: "谁创建了SCITI指数？",
    },
    a: {
      en: "SCITI was developed by Dr. Non A., Senior Expert at depa's Smart City Promotion Department, using the SLIC (Smart Liveable Cities Index) methodology. The methodology was peer-reviewed at SCSE Taipei 2026. It draws on Dr. Non's academic work published in Hitachi Review (2021) and practical experience deploying smart city frameworks across 40+ Thai cities since 2019.",
      th: "SCITI พัฒนาโดย ดร.ณณ ผู้เชี่ยวชาญอาวุโส ฝ่ายส่งเสริมเมืองอัจฉริยะ depa ใช้วิธีการ SLIC (Smart Liveable Cities Index) ผ่านการตรวจสอบที่ SCSE ไทเป 2026 อ้างอิงจากงานวิชาการใน Hitachi Review (2021) และประสบการณ์ภาคสนามกับ 40+ เมืองตั้งแต่ 2019",
      zh: "SCITI由depa智慧城市推广部门高级专家Non A.博士开发，使用SLIC（智慧宜居城市指数）方法论。该方法论在2026年台北SCSE会议上经过同行评审。它基于Non博士在日立评论（2021年）发表的学术成果和自2019年以来在40多个泰国城市部署智慧城市框架的实践经验。",
    },
  },
];

const CATEGORIES = [...new Set(FAQS.map(f => f.category))];

export default function KnowledgePage({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroRef, heroVisible] = useInView(0.1);
  const [listRef, listVisible] = useInView(0.1);

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const qText = f.q[locale].toLowerCase();
      const aText = f.a[locale].toLowerCase();
      const s = search.toLowerCase();
      const matchesSearch = !search || qText.includes(s) || aText.includes(s);
      const matchesCategory = activeCategory === "all" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, locale]);

  return (
    <div className="knowledge-page">
      <section ref={heroRef} className={`section rankings-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">{translate(locale, { en: "SCITI Knowledge Base", th: "คลังความรู้ SCITI", zh: "SCITI 知识库" })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          {locale === "th" ? "คลังความรู้เมืองอัจฉริยะ" : locale === "zh" ? "智慧城市知识库" : "Smart City Knowledge Base"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? `คัดกรองคำถามที่พบบ่อยโดยยึดความจริงเชิงสถาบันและความโปร่งใสของข้อมูลเป็นหลัก`
            : locale === "zh"
              ? `基于机构真实性和数据透明度的常见问题解答`
            : "No-BS FAQ distilled from institutional reality and data transparency."}
        </p>
      </section>

      <section ref={listRef} className={`section reveal stagger-1 ${listVisible ? "visible" : ""}`} style={{ marginBottom: "3rem" }}>
        <input
          type="text"
          className="kb-search shadow-premium"
          placeholder={locale === "th" ? "ค้นหา..." : locale === "zh" ? "搜索..." : "Search..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="kb-categories">
          <button
            className={`filter-btn ${activeCategory === "all" ? "active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            {translate(locale, { en: "All", th: "ทั้งหมด", zh: "全部" })} ({FAQS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = FAQS.filter(f => f.category === cat).length;
            return (
              <button
                key={cat}
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {localiseCategory(cat, locale)} ({count})
              </button>
            );
          })}
        </div>

        <p className="kb-count">{filtered.length} {translate(locale, { en: "results", th: "ผลลัพธ์", zh: "项结果" })}</p>

        <div className="kb-list">
          {filtered.map((faq, i) => (
            <details key={i} className="kb-item glass-card shadow-premium">
              <summary className="kb-question">
                <span className="kb-cat-badge">{localiseCategory(faq.category, locale)}</span>
                {faq.q[locale]}
              </summary>
              <p className="kb-answer">{faq.a[locale]}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
