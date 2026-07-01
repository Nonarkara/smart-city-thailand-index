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
  "Using SCITI": { en: "Using SCITI", th: "การใช้งาน SCITI", zh: "如何使用 SCITI" },
  "Smart City is a Process": { en: "Smart City is a Process", th: "เมืองอัจฉริยะคือกระบวนการ", zh: "智慧城市是过程" },
  "What Makes a Good Smart City": { en: "What Makes a Good Smart City?", th: "เมืองอัจฉริยะที่ดีคืออะไร?", zh: "好的智慧城市是什么样的？" },
  "ASEAN Context": { en: "ASEAN Context", th: "บริบทอาเซียน", zh: "东盟背景" },
  "Design Thinking": { en: "Design Thinking Approach", th: "แนวทาง Design Thinking", zh: "设计思维方法" },
  "Smart or Not Smart": { en: "Smart or Not Smart?", th: "อัจฉริยะหรือไม่อัจฉริยะ?", zh: "智慧还是不智慧？" },
  "Official Measurement Standards": { en: "Official Measurement Standards", th: "มาตรฐานการวัดผลทางการ", zh: "官方测量标准" },
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
      th: "การรับรอง (Certification) คือการยอมรับ 'แผน' ตามเกณฑ์ 5 ข้อของ depa: ขอบเขต แผนโครงสร้างพื้นฐาน การออกแบบ CDP โครงการ และการมีส่วนร่วม — ทั้งหมดอยู่บนกระดาษ แต่ SCITI วัดสิ่งที่ทำงานจริง: เซ็นเซอร์ ข้อมูลเปิด ความพึงพอใจ และตัวชี้วัดสิ่งแวดล้อม",
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
      th: "ใช่ ไทยมี 92 ล้านเลขหมายมือถือ (อัตราการเข้าถึง 133%) และผู้ใช้เน็ตมือถือ 55 ล้านคน แต่มีเพียง 21% ของครัวเรือนไทยที่มีคอมพิวเตอร์ ต่ำกว่าค่าเฉลี่ยโลก 49% มาก บริการ smart city ที่ต้องใช้บรอดแบนด์จึงเข้าไม่ถึงคนส่วนใหญ่นอกกรุงเทพฯ และ EEC",
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
      th: "แนวคิดเมืองอัจฉริยะปรากฏครั้งแรกในปี 2003 โดยกระทรวง ICT แต่ไม่ได้รับแรงขับเคลื่อนจริงจนกระทั่ง Thailand 4.0 เปิดตัวในปี 2016 ยุทธศาสตร์ชาติ 20 ปี (2017-2036) กำหนดเมืองอัจฉริยะเป็นวาระแห่งชาติ ภูเก็ตเป็นเมืองนำร่องแรก ตามด้วยเชียงใหม่ สำนักงานเมืองอัจฉริยะตั้งขึ้นในปี 2019",
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
      en: "As of 2025, there are 37 certified smart cities across 4 batches, plus dozens more in 'promotion' status. The national target is 105 smart cities by 2027, under depa's Smart City Master Plan 1 (2024-2027). SCITI tracks 118 cities total — all certified, promotion-phase, and registered candidates — because plans that never launch also deserve measurement.",
      th: "ณ ปี 2025 มีเมืองอัจฉริยะรับรองแล้ว 37 เมืองใน 4 รุ่น พร้อมอีกหลายสิบเมืองในสถานะ 'ส่งเสริม' เป้าหมายของประเทศคือ 105 เมืองภายในปี 2570 ตามแผนแม่บทเมืองอัจฉริยะฉบับที่ 1 (2567-2570) ของ depa SCITI ติดตาม 118 เมืองทั้งหมด เพราะแม้แต่แผนที่ไม่เคยเริ่มก็สมควรถูกวัด",
      zh: "截至2025年，共有37个经过4批认证的智慧城市，还有数十个处于\"推广\"阶段。根据depa智慧城市总体规划第1期（2024-2027），国家目标是到2027年建成105座智慧城市。SCITI追踪118个城市——包括已认证、推广阶段和注册候选城市——因为从未启动的计划也值得被衡量。",
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
      th: "7 Smart ของ depa เป็นกรอบวางแผน ช่วยจัดทำข้อเสนอ ส่วน 7 เสาหลักของ SCITI (ความน่าอยู่ เศรษฐกิจ ความปลอดภัย คุณภาพชีวิต สิ่งแวดล้อม การท่องเที่ยว ดิจิทัล) เป็นเสาวัดผล ถ่วงน้ำหนักตามผลกระทบต่อประชาชน ความน่าอยู่ (25%) และเศรษฐกิจ (20%) หนักสุดเพราะสะท้อนชีวิตจริง ดิจิทัล (5%) น้อยสุดเพราะเน็ตเร็วที่ไม่มีคุณภาพชีวิตเป็นแค่โชว์โครงสร้างพื้นฐาน",
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
      en: "ASCN was established in 2018 as a regional platform for ASEAN Member States to share smart city best practices. Its primary goal is improving quality of life through technology for sustainable urban development. Thai cities like Bangkok, Phuket, Chonburi, and Chiang Mai are active members. The network connects with partners including Japan (ASEAN-Japan Smart Cities Network), Australia (ASUS project via UN-Habitat), the UK (Global Future Cities Programme), and Mastercard (City Possible initiative).",
      th: "ASCN ก่อตั้งปี 2018 เป็นแพลตฟอร์มระดับภูมิภาคให้ชาติอาเซียนแลกเปลี่ยนแนวปฏิบัติเมืองอัจฉริยะ เมืองไทยที่ร่วมได้แก่ กรุงเทพฯ ภูเก็ต ชลบุรี เชียงใหม่ เครือข่ายเชื่อมกับญี่ปุ่น ออสเตรเลีย (โครงการ ASUS ผ่าน UN-Habitat) สหราชอาณาจักร (GFCP) และ Mastercard",
      zh: "ASCN成立于2018年，是东盟成员国共享智慧城市最佳实践的区域平台。曼谷、普吉、春武里和清迈等泰国城市是活跃成员。该网络与日本（东盟-日本智慧城市网络）、澳大利亚（通过联合国人居署的ASUS项目）、英国（全球未来城市计划）和万事达卡等合作伙伴相连。",
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
      en: "SCITI stands for Smart City Thailand Index — pronounced 'City'. It is an independent assessment tool measuring how well Thai smart cities actually perform across 7 pillars (Livability, Economy, Safety, Wellbeing, Environment, Hospitality, Digital), scored 0-100. Unlike depa's certification, which mainly evaluates plans and readiness, SCITI uses a two-layer method: research assigns pillar scores from public indicators, evidence items, and field verification; deterministic math then produces the composite score, tier, and confidence label.",
      th: "SCITI ย่อมาจาก Smart City Thailand Index — อ่านว่า 'ซิตี้' เป็นเครื่องมือประเมินอิสระวัดผลเมืองอัจฉริยะไทยจริงๆ ใน 7 เสาหลัก คะแนน 0-100 ต่างจากการรับรองของ depa ที่เน้นแผนและความพร้อม SCITI ใช้วิธีสองชั้น: ชั้นวิจัยกำหนดคะแนนเสาหลักจากตัวชี้วัดสาธารณะ หลักฐาน และการยืนยันภาคสนาม จากนั้นคณิตศาสตร์แบบกำหนดแน่นอนจะสร้างคะแนนรวม ระดับ และฉลากความเชื่อมั่น",
      zh: "SCITI 代表泰国智慧城市指数，读作“City”。它是一个独立评估工具，用 7 个支柱（宜居、经济、安全、福祉、环境、人文、数字）衡量泰国智慧城市的真实表现，分数范围为 0-100。与主要评估规划与准备度的 depa 认证不同，SCITI 采用双层方法：研究层依据公共指标、证据项和实地核验给出支柱分，随后由确定性数学层生成综合分、层级和置信标签。",
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
  // ─── Using SCITI ───
  {
    category: "Using SCITI",
    q: {
      en: "How should I read Alpha, Beta, and Gamma?",
      th: "ควรอ่าน Alpha, Beta และ Gamma อย่างไร?",
      zh: "应该如何理解 Alpha、Beta 和 Gamma？",
    },
    a: {
      en: "Read them as delivery tiers, not prestige labels. Alpha means the city has stronger evidence of real operation. Beta means the picture is mixed: some parts work, some still need proof or continuity. Gamma usually means the city is still mostly planned, lightly evidenced, or not yet producing enough public outcomes. A Gamma city is not a failure; it is a signal that the next work should be specific.",
      th: "ให้อ่านเป็นระดับการส่งมอบ ไม่ใช่ตราศักดิ์ศรี Alpha หมายถึงมีหลักฐานการทำงานจริงค่อนข้างชัด Beta คือภาพผสม: บางส่วนเดินแล้ว บางส่วนยังต้องพิสูจน์หรือทำให้ต่อเนื่อง Gamma มักหมายถึงยังเป็นแผนเป็นหลัก หลักฐานยังเบา หรือผลลัพธ์สาธารณะยังไม่พอ เมือง Gamma ไม่ใช่ความล้มเหลว แต่เป็นสัญญาณว่าขั้นต่อไปต้องชัดเจนขึ้น",
      zh: "它们是交付层级，不是荣誉标签。Alpha 表示城市有较强的实际运行证据。Beta 表示情况混合：有些部分已经运作，有些仍需证明或保持连续性。Gamma 通常表示项目仍以规划为主、证据较弱，或尚未产生足够公开成果。Gamma 不是失败，而是在提醒下一步工作需要更具体。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "Why show seven pillar bars instead of only one score?",
      th: "ทำไมต้องแสดงแถบ 7 เสาหลัก แทนที่จะโชว์แค่คะแนนเดียว?",
      zh: "为什么展示七个支柱条，而不是只显示一个总分？",
    },
    a: {
      en: "A single score is useful for sorting, but it hides the story. The seven bars show the shape of the city: a place can be strong on safety and weak on economy, or digitally advanced but not yet livable. The composite still follows the fixed weights - Livability 25%, Economy 20%, Safety 15%, Wellbeing 15%, Environment 10%, Hospitality 10%, Digital 5% - but the bars keep the trade-offs visible.",
      th: "คะแนนเดียวช่วยจัดอันดับได้ แต่ซ่อนเรื่องสำคัญ แถบทั้ง 7 ทำให้เห็นรูปร่างของเมือง: บางเมืองเด่นด้านความปลอดภัยแต่เศรษฐกิจยังอ่อน หรือดิจิทัลดีแต่ความน่าอยู่ยังไม่ถึง คะแนนรวมยังคำนวณตามน้ำหนักคงที่ - ความน่าอยู่ 25%, เศรษฐกิจ 20%, ความปลอดภัย 15%, คุณภาพชีวิต 15%, สิ่งแวดล้อม 10%, การท่องเที่ยว 10%, ดิจิทัล 5% - แต่แถบช่วยให้เห็น trade-off ทันที",
      zh: "单一分数便于排序，但会掩盖真正的结构。七个柱条显示城市的形状：一座城市可能安全强、经济弱，也可能数字化先进但宜居性不足。综合分仍按固定权重计算 - 宜居 25%、经济 20%、安全 15%、福祉 15%、环境 10%、人文旅游 10%、数字 5% - 但柱条让取舍一眼可见。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "What should a mayor do after seeing a low score?",
      th: "นายกเมืองควรทำอย่างไรเมื่อเห็นคะแนนต่ำ?",
      zh: "市长看到低分后应该怎么做？",
    },
    a: {
      en: "Start with the weakest pillar and the weakest evidence trail. A low score is most useful when it becomes a workplan: update the public data, keep the CDP online, publish service outcomes, and ask residents whether the project solved the problem it promised to solve. The right response is not a press release. It is a sharper delivery loop.",
      th: "เริ่มจากเสาที่อ่อนที่สุดและร่องรอยหลักฐานที่อ่อนที่สุด คะแนนต่ำมีประโยชน์ที่สุดเมื่อแปลงเป็นแผนงาน: อัปเดตข้อมูลสาธารณะ รักษา CDP ให้ใช้งานได้ เผยแพร่ผลลัพธ์บริการ และถามประชาชนว่าโครงการแก้ปัญหาที่สัญญาไว้จริงหรือไม่ คำตอบที่ดีไม่ใช่ข่าวประชาสัมพันธ์ แต่คือวงจรส่งมอบที่คมขึ้น",
      zh: "先看最弱的支柱和最弱的证据链。低分最有价值的时候，是它变成工作计划：更新公开数据、保持 CDP 在线、发布服务成效，并询问居民项目是否真正解决了承诺的问题。正确回应不是新闻稿，而是更清晰的交付闭环。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "Can residents or cities challenge the data?",
      th: "ประชาชนหรือเมืองสามารถทักท้วงข้อมูลได้ไหม?",
      zh: "居民或城市可以质疑数据吗？",
    },
    a: {
      en: "Yes. Corrections are welcome when they come with evidence: a public dataset, official document, working platform link, field photo, operating report, or recent source that can be checked by another person. The goal is not to win an argument. The goal is to make the index truer.",
      th: "ได้ เรายินดีรับการแก้ไขเมื่อมีหลักฐานประกอบ: ชุดข้อมูลสาธารณะ เอกสารทางการ ลิงก์แพลตฟอร์มที่ใช้งานได้ ภาพภาคสนาม รายงานการดำเนินงาน หรือแหล่งข้อมูลล่าสุดที่ผู้อื่นตรวจสอบได้ เป้าหมายไม่ใช่การเอาชนะข้อโต้แย้ง แต่คือทำให้ดัชนีจริงขึ้น",
      zh: "可以。只要附有证据，我们欢迎修正：公开数据集、官方文件、可访问的平台链接、现场照片、运行报告，或其他近期且可由他人核验的来源。目标不是赢得争论，而是让指数更接近事实。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "What do Operational, Partial, and Planned mean?",
      th: "Operational, Partial และ Planned หมายถึงอะไร?",
      zh: "Operational、Partial 和 Planned 分别是什么意思？",
    },
    a: {
      en: "They describe delivery reality, separate from the Alpha/Beta/Gamma tier. Operational means the city has visible systems, data, or services in use. Partial means some pieces are working but the chain is incomplete. Planned means the evidence mostly describes intent, design, procurement, or future deployment. This label helps users separate ambition from operation.",
      th: "คำเหล่านี้อธิบายความจริงด้านการส่งมอบ แยกจากระดับ Alpha/Beta/Gamma Operational คือมีระบบ ข้อมูล หรือบริการที่ใช้งานจริงให้เห็น Partial คือบางส่วนทำงานแล้วแต่ห่วงโซ่ยังไม่ครบ Planned คือหลักฐานส่วนใหญ่ยังเป็นเจตนา การออกแบบ การจัดซื้อ หรือการเตรียมใช้งานในอนาคต ป้ายนี้ช่วยแยกความทะเยอทะยานออกจากการทำงานจริง",
      zh: "这些词描述交付现实，独立于 Alpha/Beta/Gamma 层级。Operational 表示已有可见系统、数据或服务在运行。Partial 表示部分环节运作，但链条还不完整。Planned 表示证据主要仍是意图、设计、采购或未来部署。这个标签帮助用户区分愿景与运行。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "How often should I expect scores to change?",
      th: "คะแนนควรเปลี่ยนบ่อยแค่ไหน?",
      zh: "分数通常多久会变化一次？",
    },
    a: {
      en: "Scores should change when evidence changes. A city can move up when new public data, operating proof, or resident outcomes become verifiable. It can move down when data becomes stale, platforms go offline, or claims stop matching what people can see. SCITI is not a live popularity poll; it is a release-based evidence system.",
      th: "คะแนนควรเปลี่ยนเมื่อหลักฐานเปลี่ยน เมืองขยับขึ้นได้เมื่อมีข้อมูลสาธารณะใหม่ หลักฐานการทำงานจริง หรือผลลัพธ์ต่อประชาชนที่ตรวจสอบได้ และขยับลงได้เมื่อข้อมูลค้าง แพลตฟอร์มล่ม หรือคำกล่าวอ้างไม่ตรงกับสิ่งที่ผู้ใช้เห็น SCITI ไม่ใช่โพลสด แต่เป็นระบบหลักฐานตามรอบเผยแพร่",
      zh: "分数应在证据变化时变化。当新的公开数据、运行证明或居民结果可以核验时，城市可以上升；当数据变旧、平台下线，或声称与可见事实不符时，城市可以下降。SCITI 不是实时人气投票，而是按发布版本运行的证据系统。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "Can investors use SCITI as investment advice?",
      th: "นักลงทุนใช้ SCITI เป็นคำแนะนำการลงทุนได้ไหม?",
      zh: "投资者可以把 SCITI 当作投资建议吗？",
    },
    a: {
      en: "No. SCITI is a public-interest screening tool, not financial advice. It can help investors ask better questions: which cities have credible delivery capacity, transparent data, working partnerships, and a realistic project pipeline? Any investment decision still needs legal, financial, technical, and local due diligence.",
      th: "ไม่ได้ SCITI เป็นเครื่องมือคัดกรองเพื่อประโยชน์สาธารณะ ไม่ใช่คำแนะนำการลงทุน แต่มันช่วยให้นักลงทุนถามคำถามที่ดีขึ้นได้: เมืองไหนมีศักยภาพส่งมอบที่น่าเชื่อถือ ข้อมูลโปร่งใส หุ้นส่วนที่ทำงานจริง และ pipeline โครงการที่สมจริง? การลงทุนยังต้องตรวจสอบด้านกฎหมาย การเงิน เทคนิค และบริบทท้องถิ่นเสมอ",
      zh: "不可以。SCITI 是公共利益导向的筛查工具，不是投资建议。它可以帮助投资者提出更好的问题：哪些城市具备可信的交付能力、透明数据、有效伙伴关系和现实的项目管线？任何投资决定仍需进行法律、财务、技术和地方尽调。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "Why are provinces, municipalities, districts, and special projects shown together?",
      th: "ทำไมจังหวัด เทศบาล เขต และโครงการเฉพาะถึงอยู่ด้วยกัน?",
      zh: "为什么府、市政、区和专项项目会放在一起展示？",
    },
    a: {
      en: "Because Thailand's smart city pipeline is not one administrative shape. Some entries are municipalities, some are provincial programs, some are districts, and some are development zones. SCITI tracks the named smart city boundary or proposal, then labels the city league so users can compare with context instead of pretending every entry is the same kind of place.",
      th: "เพราะ pipeline เมืองอัจฉริยะไทยไม่ได้มีรูปทรงการปกครองแบบเดียว บางรายการเป็นเทศบาล บางรายการเป็นโครงการระดับจังหวัด บางรายการเป็นเขต และบางรายการเป็นเขตพัฒนา SCITI ติดตามขอบเขตหรือข้อเสนอเมืองอัจฉริยะตามชื่อที่ใช้จริง แล้วใส่ league ของเมืองเพื่อให้ผู้ใช้เปรียบเทียบพร้อมบริบท ไม่ใช่ทำเหมือนทุกแห่งเป็นหน่วยเดียวกัน",
      zh: "因为泰国智慧城市项目并不只有一种行政形态。有些是市政，有些是府级计划，有些是城区，有些是开发区。SCITI 追踪被正式命名的智慧城市边界或提案，并标注城市类型，让用户在语境中比较，而不是假装所有条目都是同一种地方。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "What is the fastest way to compare two cities?",
      th: "วิธีเร็วที่สุดในการเทียบสองเมืองคืออะไร?",
      zh: "比较两座城市最快的方法是什么？",
    },
    a: {
      en: "Use Compare mode from the Rankings page, or open the Compare page directly. Start with the seven pillar bars, then check tier, data confidence, delivery reality, and the evidence trail. If one city has a higher composite but weaker data confidence, treat that as a question to investigate, not as a final answer.",
      th: "ใช้โหมดเปรียบเทียบในหน้าอันดับ หรือเปิดหน้า Compare โดยตรง เริ่มจากแถบ 7 เสาหลัก แล้วดูระดับ ความเชื่อมั่นข้อมูล ความจริงด้านการส่งมอบ และร่องรอยหลักฐาน ถ้าเมืองหนึ่งคะแนนรวมสูงกว่าแต่ความเชื่อมั่นข้อมูลอ่อนกว่า ให้อ่านเป็นคำถามที่ต้องตรวจต่อ ไม่ใช่คำตอบสุดท้าย",
      zh: "可以在排名页使用对比模式，或直接打开 Compare 页面。先看七个支柱条，再看层级、数据置信度、交付现实和证据链。如果一座城市综合分更高但数据置信度更弱，应把它视为需要继续核查的问题，而不是最终结论。",
    },
  },
  {
    category: "Using SCITI",
    q: {
      en: "Why does a famous city not always rank first?",
      th: "ทำไมเมืองดังถึงไม่ได้อันดับหนึ่งเสมอไป?",
      zh: "为什么知名城市不一定排第一？",
    },
    a: {
      en: "Because fame is not the same as performance. A famous destination may have strong hospitality and economy scores but weaker safety, livability, environmental, or data-confidence signals. A smaller city can rank higher when it solves a concrete local problem and proves the result. That is the point of the index: reward working systems, not brand recognition.",
      th: "เพราะชื่อเสียงไม่เท่ากับผลการทำงาน เมืองปลายทางชื่อดังอาจเด่นด้านท่องเที่ยวและเศรษฐกิจ แต่สัญญาณด้านความปลอดภัย ความน่าอยู่ สิ่งแวดล้อม หรือความเชื่อมั่นข้อมูลอาจอ่อนกว่า เมืองเล็กสามารถขึ้นสูงกว่าได้ถ้าแก้ปัญหาท้องถิ่นที่ชัดและพิสูจน์ผลลัพธ์ได้ นี่คือหัวใจของดัชนี: ให้รางวัลกับระบบที่ทำงานจริง ไม่ใช่การจดจำแบรนด์",
      zh: "因为知名度不等于表现。知名目的地可能在人文旅游和经济上很强，但在安全、宜居、环境或数据置信度上较弱。较小城市如果解决了具体地方问题并能证明结果，也可以排得更高。这正是指数的意义：奖励真正运行的系统，而不是品牌知名度。",
    },
  },
  // ─── Smart City is a Process ───
  {
    category: "Smart City is a Process",
    q: {
      en: "Why is a smart city described as a process, not a result?",
      th: "ทำไมเมืองอัจฉริยะจึงถูกอธิบายว่าเป็นกระบวนการ ไม่ใช่ผลลัพธ์?",
      zh: "为什么说智慧城市是一个过程而不是结果？",
    },
    a: {
      en: "The phrase comes directly from Thailand's foundational smart city literature, authored in part by depa's own senior experts. The argument is that 'smart' refers to the ability to comprehend, adapt, and transform — qualities that belong to living systems, not finished products. A city that has installed sensors and declared itself smart, but stops learning from the data, has confused the hardware with the habit. The Three Concepts that underpin Thailand's framework make this concrete: citizens at the center (meaning the city continuously listens), PPPP partnership (meaning the collaboration never stops), and simultaneous physical and digital development (meaning the work is never done, because both layers keep evolving). A city reaches smart city status not by ticking boxes but by becoming the kind of organisation that keeps asking what its residents actually need.",
      th: "วลีนี้มาจากเอกสารพื้นฐานด้านเมืองอัจฉริยะของไทย ซึ่งเขียนขึ้นบางส่วนโดยผู้เชี่ยวชาญอาวุโสของ depa เอง ข้อโต้แย้งคือ 'อัจฉริยะ' หมายถึงความสามารถในการเข้าใจ ปรับตัว และเปลี่ยนแปลง คุณสมบัติที่เป็นของระบบที่มีชีวิต ไม่ใช่ผลิตภัณฑ์สำเร็จรูป เมืองที่ติดตั้งเซนเซอร์แล้วประกาศตัวเองว่าอัจฉริยะแต่หยุดเรียนรู้จากข้อมูล กำลังสับสนระหว่างฮาร์ดแวร์กับนิสัย สามแนวคิดที่รองรับกรอบของไทยทำให้สิ่งนี้เป็นรูปธรรม: ประชาชนอยู่ตรงกลาง (หมายความว่าเมืองรับฟังอย่างต่อเนื่อง) หุ้นส่วน PPPP (หมายความว่าความร่วมมือไม่เคยหยุด) และการพัฒนากายภาพและดิจิทัลพร้อมกัน (หมายความว่างานไม่เคยเสร็จ เพราะทั้งสองชั้นยังคงพัฒนา)",
      zh: "这句话直接来自泰国智慧城市基础文献，部分由depa自身的高级专家撰写。论点是'智慧'指的是理解、适应和转变的能力——这些品质属于活的系统，而非完成品。一座安装了传感器并宣称自己智慧、但停止从数据中学习的城市，混淆了硬件与习惯。支撑泰国框架的三个概念使这一点具体化：市民在中心（意味着城市持续倾听）、PPPP伙伴关系（意味着合作从不停止）、物理和数字同步发展（意味着工作永不完成，因为两个层次都在持续演进）。",
    },
  },
  {
    category: "Smart City is a Process",
    q: {
      en: "What are the Three Concepts at the heart of Thailand's smart city framework?",
      th: "สามแนวคิดหลักที่อยู่ในใจกลางกรอบเมืองอัจฉริยะของไทยคืออะไร?",
      zh: "泰国智慧城市框架核心的三个概念是什么？",
    },
    a: {
      en: "First: citizens at the center, technology in the background. The end goal is quality of life, not gadget deployment. A smart city should make life quieter and easier, not demand residents master new platforms to access basic services. Second: People-Public-Private-Partnership — PPPP, not PPP. The extra P is the most important one. Projects designed without residents tend to go unused. Projects designed with residents tend to get maintained. Third: simultaneous development of both physical and digital infrastructure. Connectivity is worthless if the road to the clinic is unpaved, the goods cannot be delivered, or the power grid drops before the sensors can report. These three concepts appear across Thailand's certification criteria, its academic publications, and in the ASEAN regional primer — they are the architecture behind the framework, not just marketing language.",
      th: "แรก: ประชาชนอยู่ตรงกลาง เทคโนโลยีอยู่เบื้องหลัง เป้าหมายสุดท้ายคือคุณภาพชีวิต ไม่ใช่การติดตั้งอุปกรณ์ เมืองอัจฉริยะควรทำให้ชีวิตเงียบสงบและง่ายขึ้น ไม่ใช่บังคับให้ผู้อยู่อาศัยเชี่ยวชาญแพลตฟอร์มใหม่เพื่อเข้าถึงบริการพื้นฐาน ที่สอง: PPPP ไม่ใช่ PPP P ที่เพิ่มขึ้นคือสิ่งสำคัญที่สุด โครงการที่ออกแบบโดยไม่มีผู้อยู่อาศัยมักไม่ได้ใช้งาน โครงการที่ออกแบบร่วมกับผู้อยู่อาศัยมักได้รับการดูแลรักษา ที่สาม: การพัฒนาพร้อมกันทั้งโครงสร้างพื้นฐานกายภาพและดิจิทัล ระบบเน็ตเวิร์กไม่มีค่าถ้าถนนไปคลินิกยังไม่ได้ลาด สินค้าส่งไม่ได้ หรือไฟฟ้าดับก่อนที่เซนเซอร์จะรายงาน",
      zh: "第一：市民在中心，技术在幕后。最终目标是生活质量，而非设备部署。智慧城市应让生活更安静便捷，而不是要求居民掌握新平台才能获得基本服务。第二：PPPP而非PPP。那个额外的P是最重要的。没有居民参与设计的项目往往无人使用；与居民共同设计的项目往往得到维护。第三：物理和数字基础设施同步发展。如果去诊所的路还是泥路、货物无法送达、传感器报告前就停电，连接性毫无价值。这三个概念贯穿泰国的认证标准、学术出版物以及东盟区域入门指南。",
    },
  },
  // ─── What Makes a Good Smart City ───
  {
    category: "What Makes a Good Smart City",
    q: {
      en: "Does a good smart city have to be large and high-tech?",
      th: "เมืองอัจฉริยะที่ดีต้องใหญ่และไฮเทคไหม?",
      zh: "好的智慧城市必须是大城市和高科技吗？",
    },
    a: {
      en: "No, and this is one of the most important correctives in the ASEAN smart city literature. The Smart City Primer published by C asean, depa, and the U.S. Embassy explicitly states that smart cities are not limited to metropolises with high technology — they should refer to cities that are inclusive and supportive of the wellbeing of all inhabitants. Appropriate technology is the operative phrase: not cutting-edge, but fit-for-context. Nakhon Si Thammarat's flood warning system cost a fraction of what Bangkok's digital infrastructure has consumed, yet it has saved lives every monsoon season since 2021. The success metrics that matter are less travel time, worry-free healthcare, and more spare time for residents — not the generation of the chipset running the platform.",
      th: "ไม่ใช่ และนี่คือหนึ่งในการแก้ไขที่สำคัญที่สุดในวรรณกรรมเมืองอัจฉริยะอาเซียน Smart City Primer ที่เผยแพร่โดย C asean, depa และสถานทูตสหรัฐฯ ระบุชัดเจนว่า เมืองอัจฉริยะไม่จำกัดเฉพาะมหานครที่มีเทคโนโลยีสูง แต่ควรหมายถึงเมืองที่ครอบคลุมและสนับสนุนความเป็นอยู่ที่ดีของผู้อยู่อาศัยทุกคน เทคโนโลยีที่เหมาะสมคือวลีสำคัญ: ไม่ใช่เทคโนโลยีล้ำสุด แต่เหมาะสมกับบริบท ตัวชี้วัดความสำเร็จที่สำคัญคือเวลาเดินทางที่ลดลง การดูแลสุขภาพที่ไร้กังวล และเวลาว่างที่มากขึ้นสำหรับผู้อยู่อาศัย ไม่ใช่รุ่นของชิปเซ็ตที่ใช้งานแพลตฟอร์ม",
      zh: "不，这是东盟智慧城市文献中最重要的纠偏之一。由C asean、depa和美国大使馆出版的《智慧城市入门指南》明确指出，智慧城市不限于拥有高技术的大都市——它们应指对所有居民都具有包容性并支持其福祉的城市。适当技术是关键词：不是最尖端的，而是适合语境的。真正重要的成功指标是减少出行时间、无忧的医疗保健以及更多的闲暇时间，而不是运行平台的芯片组代数。",
    },
  },
  {
    category: "What Makes a Good Smart City",
    q: {
      en: "What do the 4Ps mean for a smart city, and what does a real-world example look like?",
      th: "4P มีความหมายอย่างไรสำหรับเมืองอัจฉริยะ และตัวอย่างจริงในโลกมีลักษณะอย่างไร?",
      zh: "4P对智慧城市意味着什么？现实世界的例子是什么样的？",
    },
    a: {
      en: "The 4Ps — People, Public sector, Private sector, Partnership — describe the governance model that the ASEAN Smart City Primer identifies as characteristic of successful smart cities. One Bangkok, a citizen-centric mixed-use development in Bangkok's CBD, is often cited as the regional example: a single site that integrates offices, residences, retail, parks, and public infrastructure, designed from the outset to minimise car dependency and maximise walkable connectivity. Smart City Iskandar in Malaysia demonstrates the data-powered dimension: city management decisions are driven by a live data platform integrating transport, utilities, and safety feeds, allowing administrators to respond to problems in near-real time rather than after the fact. What both share is the same structural logic — people's needs defined the brief, public-private investment executed it, and data keeps it accountable.",
      th: "4P ได้แก่ ประชาชน ภาครัฐ ภาคเอกชน และหุ้นส่วน อธิบายรูปแบบการกำกับดูแลที่ Smart City Primer อาเซียนระบุว่าเป็นลักษณะของเมืองอัจฉริยะที่ประสบความสำเร็จ One Bangkok โครงการพัฒนาแบบผสมผสานที่เน้นประชาชนในย่าน CBD ของกรุงเทพฯ มักถูกอ้างถึงว่าเป็นตัวอย่างระดับภูมิภาค: สถานที่เดียวที่บูรณาการสำนักงาน ที่พักอาศัย ร้านค้า สวนสาธารณะ และโครงสร้างพื้นฐานสาธารณะ ออกแบบตั้งแต่ต้นเพื่อลดการพึ่งพารถยนต์และเพิ่มการเชื่อมต่อเดินเท้า Smart City Iskandar ในมาเลเซียแสดงให้เห็นมิติที่ขับเคลื่อนด้วยข้อมูล สิ่งที่ทั้งสองมีร่วมกันคือตรรกะเชิงโครงสร้างเดียวกัน ความต้องการของประชาชนเป็นตัวกำหนดโจทย์ การลงทุนรัฐ-เอกชนเป็นผู้ดำเนินการ และข้อมูลเป็นตัวรักษาความรับผิดชอบ",
      zh: "4P——人民、公共部门、私营部门、伙伴关系——描述了东盟智慧城市入门指南所认定的成功智慧城市的治理模式。曼谷CBD的One Bangkok综合开发项目是常被引用的区域案例：单一场地整合办公、住宅、零售、公园和公共基础设施，从一开始就设计为减少汽车依赖、最大化步行连通性。马来西亚伊斯干达智慧城市展示了数据驱动维度：整合交通、公用事业和安全数据的实时平台驱动城市管理决策。两者共同的结构逻辑是：人的需求定义了任务书，公私投资执行了它，数据保持了问责制。",
    },
  },
  // ─── ASEAN Context ───
  {
    category: "ASEAN Context",
    q: {
      en: "What is the ASEAN Smart Cities Network and how does it work?",
      th: "ASEAN Smart Cities Network คืออะไรและทำงานอย่างไร?",
      zh: "东盟智慧城市网络是什么，它如何运作？",
    },
    a: {
      en: "The ASEAN Smart Cities Network (ASCN) was established in 2018 as a collaborative platform for all ten ASEAN member states to share smart city best practices, pilot projects, and private sector partnerships. Each ASEAN country nominates up to three cities, and the network meets regularly at the ASEAN Smart Cities Summit. Cambodia chaired the network in 2022. Thailand's original 2018 nominees were Bangkok, Phuket, and Chonburi; Chiang Mai, Khon Kaen, and Rayong joined later, bringing the network to 38 member cities by 2026. The ASCN connects cities not only to each other but to a wide range of international partners: Japan provides funding and technical assistance through the ASEAN-Japan Smart Cities Network; Australia implements the ASUS project via UN-Habitat; the UK runs the Global Future Cities Programme; and Mastercard contributes through the City Possible initiative. The network is deliberately practical — it prioritises pilot projects and knowledge exchange over declarations, because the gap between smart city policy and smart city reality is where the real work happens.",
      th: "ASEAN Smart Cities Network (ASCN) ก่อตั้งในปี 2018 เป็นแพลตฟอร์มความร่วมมือสำหรับประเทศสมาชิกอาเซียนทั้ง 10 ประเทศเพื่อแลกเปลี่ยนแนวปฏิบัติที่ดี โครงการนำร่อง และหุ้นส่วนภาคเอกชนด้านเมืองอัจฉริยะ แต่ละประเทศอาเซียนสามารถเสนอชื่อเมืองได้สูงสุด 3 เมือง กัมพูชาเป็นประธานเครือข่ายในปี 2022 เมืองที่ไทยเสนอชื่อในปี 2018 ได้แก่ กรุงเทพฯ ภูเก็ต และชลบุรี ต่อมาเชียงใหม่ ขอนแก่น และระยองเข้าร่วมภายหลัง ทำให้เครือข่ายมีสมาชิก 38 เมืองภายในปี 2026 ASCN เชื่อมต่อเมืองไม่เพียงแต่กันเองแต่ยังกับพันธมิตรระหว่างประเทศที่หลากหลาย เครือข่ายนี้ให้ความสำคัญกับโครงการนำร่องและการแลกเปลี่ยนความรู้มากกว่าการออกปฏิญญา เพราะช่องว่างระหว่างนโยบายเมืองอัจฉริยะและความเป็นจริงคือที่ที่งานจริงเกิดขึ้น",
      zh: "东盟智慧城市网络(ASCN)于2018年建立，作为所有十个东盟成员国分享智慧城市最佳实践、试点项目和私营部门伙伴关系的协作平台。每个东盟国家最多提名三个城市。柬埔寨于2022年担任网络主席。泰国2018年最初提名的城市是曼谷、普吉和春武里；清迈、孔敬和罗勇随后加入，使该网络到2026年拥有38个成员城市。ASCN不仅将城市彼此连接，还与各类国际合作伙伴相连：日本通过东盟-日本智慧城市网络提供资金和技术援助；澳大利亚通过联合国人居署实施ASUS项目；英国运营全球未来城市计划；万事达卡通过City Possible倡议贡献力量。",
    },
  },
  {
    category: "ASEAN Context",
    q: {
      en: "What innovations did YSEALI fellows develop for Southeast Asian smart cities?",
      th: "นักวิจัย YSEALI พัฒนานวัตกรรมอะไรบ้างสำหรับเมืองอัจฉริยะในเอเชียตะวันออกเฉียงใต้?",
      zh: "YSEALI学者为东南亚智慧城市开发了哪些创新？",
    },
    a: {
      en: "The Young Southeast Asian Leaders Initiative (YSEALI) Smart City Workshop in 2021 brought together emerging urban innovators from across the region and produced three notable projects. Wasterant addressed waste management by creating a platform that connects households with waste collectors and recyclers, making segregation and disposal more convenient — a practical application of data-matching to an infrastructure gap. Zappy tackled first- and last-mile mobility by connecting commuters to micro-transit options in areas underserved by formal public transport. E-Wise focused on digital literacy for elderly residents, recognising that smart city services are worthless to the people who need them most if those people cannot access them. The thread connecting all three is the same: they identified a specific group being left behind by existing systems and used relatively simple technology to close the gap. None required the construction of new physical infrastructure.",
      th: "YSEALI Smart City Workshop ปี 2021 รวบรวมนักนวัตกรรมเมืองรุ่นใหม่จากทั่วภูมิภาคและสร้างสามโครงการที่น่าสนใจ Wasterant แก้ปัญหาการจัดการขยะด้วยแพลตฟอร์มที่เชื่อมต่อครัวเรือนกับผู้เก็บขยะและผู้รีไซเคิล ทำให้การแยกและกำจัดขยะสะดวกขึ้น Zappy แก้ปัญหาการเดินทางระยะแรกและสุดท้ายโดยเชื่อมผู้โดยสารกับตัวเลือกการขนส่งขนาดเล็กในพื้นที่ที่ขนส่งสาธารณะไม่เพียงพอ E-Wise มุ่งเน้นการรู้ดิจิทัลสำหรับผู้สูงอายุ เพราะบริการเมืองอัจฉริยะไม่มีค่าสำหรับคนที่ต้องการมากที่สุดหากพวกเขาเข้าถึงไม่ได้ สิ่งที่เชื่อมทั้งสามคือเหมือนกัน: พวกเขาระบุกลุ่มเฉพาะที่ถูกระบบปัจจุบันทิ้งไว้เบื้องหลังและใช้เทคโนโลยีค่อนข้างเรียบง่ายเพื่อปิดช่องว่าง",
      zh: "2021年青年东南亚领袖倡议(YSEALI)智慧城市研讨会汇聚了来自全区域的新兴城市创新者，产生了三个值得关注的项目。Wasterant通过创建连接家庭与垃圾收集者和回收者的平台解决废物管理问题，使分类和处置更加便利。Zappy解决首末一英里出行问题，在正式公共交通服务不足的地区连接通勤者与小型交通选择。E-Wise专注于老年居民的数字素养，认识到如果最需要帮助的人无法访问，智慧城市服务就毫无价值。连接这三者的共同线索：他们都识别了被现有系统抛在身后的特定群体，并使用相对简单的技术来弥合差距。",
    },
  },
  // ─── Design Thinking ───
  {
    category: "Design Thinking",
    q: {
      en: "How does design thinking apply to building a smart city?",
      th: "Design Thinking ประยุกต์ใช้กับการสร้างเมืองอัจฉริยะอย่างไร?",
      zh: "设计思维如何应用于建设智慧城市？",
    },
    a: {
      en: "The ASEAN Smart City Primer identifies Design Thinking as the core methodology for smart city development — not because it is a management fad, but because it is structurally the opposite of the top-down failure mode that has sunk many smart city projects. The five-step process runs as follows. Empathize: go into the city, talk to residents, observe problems firsthand. Do not start from a technology product looking for a use case. Define: synthesise what you heard into a problem statement that has a specific human being at its center. Ideate: generate multiple solutions — not just one, and not just the ones the technology vendors propose. Prototype: build the smallest possible version of the best idea and put it in front of real users quickly. Test: observe what actually happens, revise, and repeat. The Thailand certification criteria for identifying a city's vision and goals 'with residents' is the Empathize step made mandatory. The failure to iterate after launch — the CDP that goes offline, the app nobody uses — is what happens when cities skip Prototype and Test.",
      th: "Smart City Primer อาเซียนระบุ Design Thinking เป็นวิธีการหลักสำหรับการพัฒนาเมืองอัจฉริยะ ไม่ใช่เพราะเป็นแฟชั่นการจัดการ แต่เพราะโครงสร้างของมันตรงข้ามกับรูปแบบความล้มเหลวจากบนลงล่างที่ทำให้โครงการเมืองอัจฉริยะหลายโครงการล่มไป กระบวนการ 5 ขั้นตอนดำเนินดังนี้: เข้าใจ (Empathize): ลงพื้นที่ พูดคุยกับผู้อยู่อาศัย สังเกตปัญหาโดยตรง กำหนด (Define): สังเคราะห์สิ่งที่ได้ยินเป็นคำแถลงปัญหาที่มีมนุษย์เฉพาะเจาะจงเป็นศูนย์กลาง คิดสร้างสรรค์ (Ideate): สร้างวิธีแก้ปัญหาหลายทาง ต้นแบบ (Prototype): สร้างเวอร์ชันเล็กที่สุดที่เป็นไปได้ ทดสอบ (Test): สังเกตสิ่งที่เกิดขึ้นจริง ปรับปรุง และทำซ้ำ",
      zh: "东盟智慧城市入门指南将设计思维确定为智慧城市发展的核心方法论——不是因为它是管理时尚，而是因为它在结构上与导致许多智慧城市项目沉没的自上而下失败模式截然相反。五步流程如下。共情：进入城市，与居民交谈，亲眼观察问题。不要从寻找用例的技术产品出发。定义：将你听到的内容综合成一个以特定人为中心的问题陈述。构思：生成多种解决方案。原型：快速制作最佳想法的最小版本并展示给真实用户。测试：观察实际发生了什么，修改并重复。泰国认证标准中'与居民'共同确定城市愿景和目标，就是强制化了共情步骤。",
    },
  },
  // ─── Smart or Not Smart ───
  {
    category: "Smart or Not Smart",
    q: {
      en: "What are the warning signs that a city labelled 'smart' is not actually smart?",
      th: "สัญญาณเตือนที่บ่งชี้ว่าเมืองที่ถูกเรียกว่า 'อัจฉริยะ' ไม่ได้อัจฉริยะจริงๆ มีอะไรบ้าง?",
      zh: "一个被称为'智慧'的城市实际上并不智慧的警示信号有哪些？",
    },
    a: {
      en: "Three warning signs are consistent across the regional literature. The first is phone addiction theater: if using the city's smart services requires residents to be hooked on a smartphone for 12 or more hours a day, the technology has become the product rather than the means. Good smart city design should reduce the cognitive load on residents, not add to it. The second is ultra-high-tech spectacle with no resident benefit: autonomous robots in the lobby, holographic displays in the city hall foyer, drone shows at the launch event. If the headline technology creates no measurable improvement in residents' daily lives within two years of deployment, it is marketing, not governance. The third is no citizen participation in design or operation: if residents were not involved in identifying the problems the system was built to solve, and have no ongoing role in evaluating whether it is working, the project is infrastructure for someone else's agenda. The corrective is always to return to the question: does this make residents' lives concretely better? Less travel time, worry-free healthcare, more spare time — these are the right benchmarks.",
      th: "สัญญาณเตือนสามประการที่สอดคล้องกันในวรรณกรรมระดับภูมิภาค อันดับแรกคือการแสดงการติดโทรศัพท์: หากการใช้บริการเมืองอัจฉริยะต้องให้ผู้อยู่อาศัยติดสมาร์ทโฟน 12 ชั่วโมงขึ้นไปต่อวัน เทคโนโลยีได้กลายเป็นผลิตภัณฑ์แทนที่จะเป็นวิธีการ การออกแบบเมืองอัจฉริยะที่ดีควรลดภาระทางความคิดของผู้อยู่อาศัย ไม่ใช่เพิ่ม อันดับสองคือความเป็นเทคโนโลยีสูงที่ไม่มีประโยชน์ต่อผู้อยู่อาศัย: หุ่นยนต์อัตโนมัติในล็อบบี้ จอโฮโลแกรมในห้องโถงศาลากลาง โชว์โดรนในงานเปิดตัว หากเทคโนโลยีพาดหัวไม่สร้างการปรับปรุงที่วัดได้ในชีวิตประจำวันของผู้อยู่อาศัยภายในสองปีหลังการใช้งาน มันคือการตลาด ไม่ใช่การปกครอง อันดับสามคือไม่มีการมีส่วนร่วมของพลเมืองในการออกแบบหรือการดำเนินงาน",
      zh: "区域文献中有三个一致的警示信号。第一是手机成瘾表演：如果使用城市智慧服务要求居民每天盯着手机12小时或更多，技术就成了产品而非手段。良好的智慧城市设计应减少而非增加居民的认知负担。第二是对居民毫无裨益的超高科技奇观：大厅里的自主机器人、市政厅门廊的全息显示、发布活动的无人机表演。如果头条技术在部署两年内未在居民日常生活中产生可测量的改善，那是营销而非治理。第三是设计或运营中没有市民参与：如果居民没有参与识别系统所要解决的问题，且在评估其是否有效方面没有持续角色，该项目就是服务于他人议程的基础设施。",
    },
  },
  {
    category: "Smart or Not Smart",
    q: {
      en: "What does success actually look like for a smart city resident?",
      th: "ความสำเร็จสำหรับผู้อยู่อาศัยในเมืองอัจฉริยะมีลักษณะอย่างไรในความเป็นจริง?",
      zh: "对智慧城市居民而言，成功究竟是什么样的？",
    },
    a: {
      en: "The ASEAN Smart City Primer offers a deliberately unglamorous answer: less travel time, worry-free healthcare, and more spare time. These three outcomes are what residents actually notice and remember. They do not require residents to interact with any visible technology to achieve them — a smart traffic management system reduces commute time whether or not the commuter knows it exists; a preventive health data platform reduces emergency admissions whether or not the patient ever logs into a portal. The invisibility of good smart city technology is a feature, not a limitation. The LLWP framework — Live, Learn, Work, Play — offers a complementary lens: a successful smart city makes each of those four activities easier and more equitable for all residents, regardless of age, income, or digital literacy. If a smart city scores well on LLWP criteria but only for the top income quartile, it has partially succeeded. If it scores well for everyone, it has actually done the job.",
      th: "Smart City Primer อาเซียนให้คำตอบที่ไม่ค่อยน่าตื่นเต้นโดยตั้งใจ: เวลาเดินทางที่ลดลง การดูแลสุขภาพที่ไร้กังวล และเวลาว่างที่มากขึ้น สามผลลัพธ์เหล่านี้คือสิ่งที่ผู้อยู่อาศัยสังเกตเห็นและจดจำจริงๆ ไม่ต้องการให้ผู้อยู่อาศัยโต้ตอบกับเทคโนโลยีที่มองเห็นได้เพื่อให้บรรลุผล กรอบ LLWP — อยู่อาศัย เรียนรู้ ทำงาน เล่น — เสนอมุมมองเสริม: เมืองอัจฉริยะที่ประสบความสำเร็จทำให้กิจกรรมทั้งสี่อย่างนั้นง่ายขึ้นและเท่าเทียมกันมากขึ้นสำหรับผู้อยู่อาศัยทุกคน โดยไม่คำนึงถึงอายุ รายได้ หรือความรู้ดิจิทัล",
      zh: "东盟智慧城市入门指南给出了一个刻意不华丽的答案：减少出行时间、无忧的医疗保健以及更多的闲暇时间。这三个结果是居民真正注意到和记住的。它们不要求居民与任何可见技术互动——智慧交通管理系统无论通勤者是否知道其存在都能减少通勤时间；预防性健康数据平台无论患者是否登录门户都能减少急诊入院。好的智慧城市技术的隐形性是特性而非局限。LLWP框架——居住、学习、工作、玩耍——提供了补充视角：成功的智慧城市使这四项活动对所有居民都更容易、更公平，无论年龄、收入或数字素养如何。",
    },
  },
  // ─── Official Measurement Standards ───
  {
    category: "Official Measurement Standards",
    q: {
      en: "What specific indicators make a city Smart Environment-certified?",
      th: "ตัวชี้วัดใดที่ทำให้เมืองได้รับการรับรองด้านสิ่งแวดล้อมอัจฉริยะ?",
      zh: "哪些具体指标能使城市获得智慧环境认证？",
    },
    a: {
      en: "depa evaluates Smart Environment across four areas. Green space: cities must provide at least 10 square metres of green space per resident. Wastewater: community wastewater treatment systems must cover more than 50% of households. Climate resilience: cities must have documented disaster and climate adaptation plans. Pollution governance: community-based pollution management networks must be established and operational. All four must be evidenced, not just planned.",
      th: "depa ประเมิน Smart Environment ใน 4 ด้าน พื้นที่สีเขียว: เมืองต้องจัดให้มีพื้นที่สีเขียวอย่างน้อย 10 ตร.ม./คน ระบบน้ำเสีย: ระบบบำบัดน้ำเสียชุมชนต้องครอบคลุมครัวเรือนมากกว่า 50% ความยืดหยุ่นต่อภัยพิบัติ: เมืองต้องมีแผนรับมือภัยพิบัติและการเปลี่ยนแปลงสภาพภูมิอากาศที่เป็นเอกสาร การจัดการมลพิษ: ต้องมีเครือข่ายจัดการมลพิษโดยชุมชนที่จัดตั้งและดำเนินการแล้ว ทั้งสี่ด้านต้องมีหลักฐาน ไม่ใช่แค่แผนงาน",
      zh: "depa从四个领域评估智慧环境。绿地：城市必须为每位居民提供至少10平方米的绿地。污水处理：社区污水处理系统必须覆盖50%以上的家庭。气候韧性：城市必须有经过记录的灾害和气候适应计划。污染治理：必须建立并运营以社区为基础的污染管理网络。四项均需有证据，而非仅有计划。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "What does Smart Governance certification actually require?",
      th: "การรับรอง Smart Governance ต้องการอะไรจริงๆ?",
      zh: "智慧治理认证实际需要什么？",
    },
    a: {
      en: "Four mandatory elements. First, an Open Government Data portal must be live and publicly accessible — not announced, actually running. Second, a single-window one-stop service must be operational for residents to access public services without being bounced between departments. Third, external performance auditors must be engaged to evaluate outcomes, not internal self-assessment alone. Fourth, a participatory budget Action Plan must exist with measurable milestones — resident participation in budget allocation is not a checkbox; the Action Plan must show how feedback was incorporated and how progress is tracked.",
      th: "ต้องมีองค์ประกอบ 4 อย่าง ประการแรก พอร์ทัลข้อมูลเปิดภาครัฐต้องใช้งานได้จริงและเข้าถึงได้สาธารณะ ประการที่สอง บริการเบ็ดเสร็จ ณ จุดเดียวต้องดำเนินการได้จริง ประการที่สาม ต้องมีผู้ตรวจสอบประสิทธิภาพภายนอก ไม่ใช่แค่การประเมินตนเอง ประการที่สี่ ต้องมีแผนปฏิบัติการงบประมาณแบบมีส่วนร่วมพร้อมเป้าหมายที่วัดได้ การมีส่วนร่วมของประชาชนในการจัดสรรงบประมาณไม่ใช่แค่การทำเครื่องหมาย แต่ต้องแสดงให้เห็นว่านำข้อเสนอแนะมาปรับใช้และติดตามความคืบหน้าอย่างไร",
      zh: "四项必要要素。第一，开放政府数据门户必须上线并可公开访问——不是宣布，而是实际运行。第二，一站式单窗口服务必须运营，让居民无需在各部门之间辗转即可获得公共服务。第三，必须聘请外部绩效审计员评估成果，而非仅靠内部自我评估。第四，必须有带可测量里程碑的参与式预算行动计划——居民参与预算分配不是打勾项；行动计划必须说明如何整合反馈以及如何跟踪进展。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "How is Smart Mobility evaluated in Thailand?",
      th: "Smart Mobility ในประเทศไทยถูกประเมินอย่างไร?",
      zh: "泰国如何评估智慧出行？",
    },
    a: {
      en: "Smart Mobility covers six areas. Transit access: public transport must be within 500 metres of every residence. Smart parking: real-time availability information and electronic payment must both be operational. Cashless payments: e-ticket, ETC, and QR code systems must be available across all transit modes. Safety surveillance: CCTV must be installed in all transit vehicles and stations. Emergency preparedness: drills must be conducted at least once per year. Green mobility: walking and cycling infrastructure must exist, and vehicle sharing must reach at least 50 users per 100,000 population.",
      th: "Smart Mobility ครอบคลุม 6 ด้าน การเข้าถึงระบบขนส่ง: ขนส่งสาธารณะต้องอยู่ภายใน 500 ม.จากที่อยู่อาศัยทุกหลัง ที่จอดรถอัจฉริยะ: ต้องมีข้อมูลความพร้อมแบบเรียลไทม์และการชำระเงินอิเล็กทรอนิกส์ การชำระเงินไร้เงินสด: ต้องมีระบบ e-ticket, ETC และ QR code ในขนส่งทุกประเภท ความปลอดภัย: ต้องติดตั้ง CCTV ในยานพาหนะและสถานีขนส่งทุกแห่ง การเตรียมพร้อมรับมือฉุกเฉิน: ต้องซ้อมอย่างน้อย 1 ครั้ง/ปี Green Mobility: ต้องมีโครงสร้างพื้นฐานสำหรับเดินและปั่นจักรยาน และการแชร์ยานพาหนะต้องมีผู้ใช้อย่างน้อย 50 คนต่อประชากร 100,000 คน",
      zh: "智慧出行涵盖六个领域。交通可达性：公共交通必须在每处住宅500米范围内。智慧停车：实时车位信息和电子支付必须均已运营。无现金支付：所有交通方式必须提供电子票、ETC和二维码系统。安全监控：所有交通车辆和站点必须安装监控摄像头。应急准备：每年至少开展一次演练。绿色出行：必须有步行和骑行基础设施，且共享交通每10万人口至少达到50名用户。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "What are the exact Smart Energy thresholds?",
      th: "เกณฑ์ Smart Energy ที่แน่ชัดคืออะไร?",
      zh: "智慧能源的确切阈值是什么？",
    },
    a: {
      en: "Smart Energy has ten specific thresholds. Buildings: at least 75% must meet Specific Energy Consumption (SEC) standards. Renewable energy: must reach at least 50% of the total energy mix. Onsite generation: local power generation must cover at least 70% of local demand. Energy storage: storage capacity must reach at least 30% of locally produced power. GHG reduction long-term: a 40% reduction from Business As Usual is required. GHG reduction near-term: at least 20% within the first five years. Area Energy Management System (AEMS): must cover at least 80% of the city. Smart Meters (AMI): 100% coverage is required — no exceptions. Micro-grid island mode: must sustain operations for at least 24 hours independently. Smart Home and Smart Building: 100% coverage.",
      th: "Smart Energy มี 10 เกณฑ์เฉพาะ อาคาร: อย่างน้อย 75% ต้องผ่านมาตรฐาน SEC พลังงานหมุนเวียน: ต้องถึงอย่างน้อย 50% ของส่วนผสมพลังงานทั้งหมด การผลิตไฟฟ้าในพื้นที่: ต้องครอบคลุมอย่างน้อย 70% ของความต้องการในพื้นที่ การสะสมพลังงาน: ต้องถึงอย่างน้อย 30% ของพลังงานที่ผลิตในพื้นที่ การลด GHG ระยะยาว: ลด 40% จากกรณีฐาน การลด GHG ระยะสั้น: อย่างน้อย 20% ใน 5 ปีแรก AEMS: ต้องครอบคลุมอย่างน้อย 80% ของเมือง มิเตอร์อัจฉริยะ: ครอบคลุม 100% Micro-grid: ต้องทำงานได้อิสระอย่างน้อย 24 ชั่วโมง Smart Home/Building: ครอบคลุม 100%",
      zh: "智慧能源有十项具体阈值。建筑：至少75%必须符合能耗强度(SEC)标准。可再生能源：必须达到总能源结构的至少50%。本地发电：本地发电量必须满足本地需求的至少70%。能源储存：储能容量必须达到本地产电量的至少30%。长期温室气体减排：必须比基准情景减少40%。近期温室气体减排：五年内至少减少20%。区域能源管理系统(AEMS)：必须覆盖城市的至少80%。智能电表(AMI)：必须100%覆盖，无例外。微电网孤岛模式：必须能独立运行至少24小时。智慧家庭和智慧建筑：100%覆盖。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "What counts as Smart Economy evidence?",
      th: "หลักฐาน Smart Economy มีอะไรบ้าง?",
      zh: "什么算作智慧经济的证据？",
    },
    a: {
      en: "Smart Economy is assessed across five areas. Business registration: a one-stop service must be operational so companies can register without visiting multiple offices. Digital infrastructure: Big Data platforms must be in place to support business continuity planning (BCP) for local enterprises. Business ecosystem alignment: the local economy must demonstrate a coherent ecosystem aligned with the city's distinctive strengths and competitive advantages. Innovation infrastructure: an incubation center, a startup-friendly zone, and a test bed for new technology must all be present and active. Digital payments: cashless society adoption must be measurable across local businesses, not just pilot installations.",
      th: "Smart Economy ประเมินใน 5 ด้าน การจดทะเบียนธุรกิจ: บริการเบ็ดเสร็จต้องดำเนินการได้ โครงสร้างพื้นฐานดิจิทัล: ต้องมีแพลตฟอร์ม Big Data เพื่อสนับสนุนการวางแผนความต่อเนื่องทางธุรกิจ (BCP) ระบบนิเวศทางธุรกิจ: เศรษฐกิจท้องถิ่นต้องแสดงให้เห็นระบบนิเวศที่สอดคล้องกับจุดแข็งของเมือง โครงสร้างพื้นฐานนวัตกรรม: ต้องมีศูนย์บ่มเพาะ พื้นที่เอื้อต่อสตาร์ทอัพ และ Test Bed ที่ดำเนินการอยู่ การชำระเงินดิจิทัล: ต้องวัดการยอมรับสังคมไร้เงินสดได้ทั่วธุรกิจท้องถิ่น",
      zh: "智慧经济从五个领域进行评估。企业注册：一站式服务必须运营，使企业无需跑多个窗口即可注册。数字基础设施：必须建立大数据平台，支持本地企业的业务连续性规划(BCP)。商业生态系统对齐：本地经济必须展示与城市独特优势和竞争力相匹配的完整生态系统。创新基础设施：孵化中心、创业友好区和新技术试验场必须均已建立并活跃运营。数字支付：必须可量化地衡量本地企业的无现金社会采用率，而非仅是试点项目。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "What does Smart Living require beyond CCTV?",
      th: "Smart Living ต้องการอะไรมากกว่าแค่ CCTV?",
      zh: "智慧生活除了监控摄像头还需要什么？",
    },
    a: {
      en: "CCTV and lighting are only one part of Smart Living. The framework requires a preventive health data platform that aggregates health indicators before emergencies occur — not just hospital records after the fact. Cities must provide adequate Child Care Centers and Day Care facilities for elderly residents, so families at both ends of the age spectrum have institutional support. Community medical volunteers must be trained and active, extending health reach beyond clinical settings. On safety: an emergency disaster plan must exist, CCTV and lighting must cover public areas, and emergency drills must be conducted at least once per year. The key distinction from a surveillance-only approach is that Smart Living measures health outcomes and social support structures, not just security infrastructure.",
      th: "CCTV และไฟส่องสว่างเป็นเพียงส่วนหนึ่งของ Smart Living กรอบการประเมินต้องการแพลตฟอร์มข้อมูลสุขภาพเชิงป้องกันที่รวบรวมตัวชี้วัดสุขภาพก่อนเกิดเหตุฉุกเฉิน ไม่ใช่แค่บันทึกจากโรงพยาบาลหลังเกิดเหตุ เมืองต้องจัดให้มีศูนย์เด็กเล็กและศูนย์ดูแลผู้สูงอายุที่เพียงพอ อาสาสมัครสาธารณสุขชุมชน (อสม.) ต้องได้รับการฝึกอบรมและปฏิบัติงานอยู่ ด้านความปลอดภัย: ต้องมีแผนรับมือภัยพิบัติ CCTV และไฟส่องสว่างต้องครอบคลุมพื้นที่สาธารณะ และต้องซ้อมอย่างน้อย 1 ครั้ง/ปี จุดสำคัญที่แตกต่างจากแนวทางการเฝ้าระวังอย่างเดียวคือ Smart Living วัดผลลัพธ์ด้านสุขภาพและโครงสร้างสนับสนุนทางสังคม ไม่ใช่แค่โครงสร้างพื้นฐานด้านความปลอดภัย",
      zh: "监控摄像头和照明只是智慧生活的一部分。该框架要求建立预防性健康数据平台，在紧急情况发生之前汇总健康指标——而非仅仅是事后的医院记录。城市必须提供足够的儿童托育中心和老年日间照料设施，使年龄两端的家庭都能获得机构支持。社区健康志愿者必须经过培训并积极活动，将健康服务延伸到临床环境之外。安全方面：必须有紧急灾害计划，监控和照明必须覆盖公共区域，每年至少开展一次演练。与纯监控方式的关键区别在于，智慧生活衡量的是健康结果和社会支持结构，而非仅仅是安全基础设施。",
    },
  },
  {
    category: "Official Measurement Standards",
    q: {
      en: "What is Smart People in the Thai context?",
      th: "Smart People ในบริบทไทยหมายความว่าอะไร?",
      zh: "泰国语境下的智慧人才是什么？",
    },
    a: {
      en: "Smart People addresses human capital development across six areas. Digital literacy programs that reach all population segments, not just youth. Lifelong learning infrastructure that includes formal institutions, community learning centers, and online platforms. STEM labs in schools and community spaces to build applied science and technology skills. Creative hubs that bring together makers, designers, and entrepreneurs for cross-disciplinary work. Diversity and inclusion initiatives that ensure smart city benefits are accessible regardless of gender, income, age, or disability. SME upskilling programs that help small and medium enterprises adopt digital tools and operate in a cashless, data-driven economy. The ASEAN Smart City Primer also references YSEALI-type young leader programs as models for regional human capital development. Smart People is evaluated on reach and measurable improvement, not just programme existence.",
      th: "Smart People ครอบคลุมการพัฒนาทุนมนุษย์ใน 6 ด้าน โปรแกรมความรู้ดิจิทัลที่ครอบคลุมทุกกลุ่มประชากร โครงสร้างพื้นฐานการเรียนรู้ตลอดชีวิต ห้องปฏิบัติการ STEM ในโรงเรียนและชุมชน Creative Hub ที่รวบรวม makers นักออกแบบ และผู้ประกอบการ โครงการความหลากหลายและการรวมเข้า เพื่อให้ประโยชน์เมืองอัจฉริยะเข้าถึงได้โดยไม่คำนึงถึงเพศ รายได้ อายุ หรือความพิการ โปรแกรมพัฒนาทักษะ SME Smart City Primer ของอาเซียนยังอ้างถึงโปรแกรม YSEALI เป็นแบบอย่างการพัฒนาทุนมนุษย์ระดับภูมิภาค Smart People ประเมินจากการเข้าถึงและการปรับปรุงที่วัดได้ ไม่ใช่แค่การมีโปรแกรม",
      zh: "智慧人才涵盖六个领域的人力资本发展。覆盖所有人群（而非仅限青年）的数字素养项目。包含正规机构、社区学习中心和在线平台的终身学习基础设施。学校和社区空间的STEM实验室，以培养应用科学和技术技能。汇聚创客、设计师和企业家进行跨学科工作的创意中心。确保智慧城市福利无论性别、收入、年龄或残障均可获取的多元包容举措。帮助中小企业采用数字工具并在无现金、数据驱动经济中运营的技能提升计划。东盟智慧城市入门指南还将YSEALI类型的青年领袖项目作为区域人力资本发展的参考模式。智慧人才的评估基于覆盖范围和可量化的改善，而非仅项目的存在。",
    },
  },
];

const CATEGORIES = [...new Set(FAQS.map(f => f.category))];

export default function KnowledgePage({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
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
      <section className="section rankings-hero reveal visible">
        <p className="eyebrow">{translate(locale, { en: "SCITI Knowledge Base", th: "คลังความรู้ SCITI", zh: "SCITI 知识库" })}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          {locale === "th" ? "คลังความรู้เมืองอัจฉริยะ" : locale === "zh" ? "智慧城市知识库" : "Smart City Knowledge Base"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? `คำถามที่พบบ่อย กลั่นจากข้อเท็จจริงเชิงสถาบันและความโปร่งใสของข้อมูล`
            : locale === "zh"
              ? `基于机构真实性和数据透明度的常见问题解答`
            : "Practical FAQ distilled from institutional reality and data transparency."}
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
