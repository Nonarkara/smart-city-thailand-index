import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface StoryMetric {
  value: string;
  labelEn: string;
  labelTh: string;
  labelZh: string;
}

interface StoryShift {
  titleEn: string;
  titleTh: string;
  titleZh: string;
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
}

interface TimelineEvent {
  period: string;
  titleEn: string;
  titleTh: string;
  titleZh: string;
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
  impactEn: string;
  impactTh: string;
  impactZh: string;
  photos: string[];
  captionEn?: string;
  captionTh?: string;
  captionZh?: string;
}

const storyMetrics: StoryMetric[] = [
  { value: "2016–2026", labelEn: "Archive window", labelTh: "ช่วงเวลาที่เล่า", labelZh: "时间跨度" },
  { value: "37", labelEn: "Certified cities", labelTh: "เมืองที่ได้รับการรับรอง", labelZh: "认证城市" },
  { value: "49", labelEn: "Cities tracked in this release", labelTh: "เมืองที่ติดตามในรุ่นนี้", labelZh: "本版纳入城市" },
  { value: "53", labelEn: "Countries at SCSE 2026", labelTh: "ประเทศในงาน SCSE 2026", labelZh: "SCSE 2026 参会国家" },
];

const storyShifts: StoryShift[] = [
  {
    titleEn: "From pilot projects to a national operating model",
    titleTh: "จากโครงการนำร่องสู่โมเดลการทำงานระดับชาติ",
    titleZh: "从试点项目走向全国操作模型",
    bodyEn: "The early years were about proving that Thailand could run smart city pilots at all. The later years turned that into committees, certification rounds, toolkits, and repeatable city-delivery playbooks.",
    bodyTh: "ช่วงแรกคือการพิสูจน์ว่าประเทศไทยทำเมืองอัจฉริยะนำร่องได้จริง ช่วงหลังคือการแปลงสิ่งนั้นให้เป็นคณะกรรมการ รุ่นการรับรอง toolkit และคู่มือส่งมอบที่เอาไปใช้ซ้ำได้",
    bodyZh: "早期阶段是在证明泰国做得出智慧城市试点；后期则把它沉淀成委员会机制、认证批次、工具包与可复制的城市交付方法。",
  },
  {
    titleEn: "From technology theatre to citizen value",
    titleTh: "จากละครเทคโนโลยีสู่คุณค่าที่ประชาชนรู้สึกได้",
    titleZh: "从技术表演转向市民感受到的价值",
    bodyEn: "The decisive move was cultural, not technical. Hackathons, design-thinking workshops, CSCO training, and case cities like Nakhon Si Thammarat shifted the question from ‘what gadget can we buy?’ to ‘what pain can we remove?’",
    bodyTh: "จุดเปลี่ยนที่แท้จริงไม่ใช่เรื่องเทค แต่เป็นเรื่องวัฒนธรรม แฮกกาธอน เวิร์กช็อป design thinking การฝึก CSCO และเมืองตัวอย่างอย่างนครศรีธรรมราช ทำให้คำถามเปลี่ยนจาก 'จะซื้อ gadget อะไร' เป็น 'จะเอาความเจ็บปวดอะไรออกไป'",
    bodyZh: "真正的转折不是技术，而是文化。黑客松、设计思维工作坊、CSCO 培训，以及那空是贪玛叻这样的案例，把问题从“买什么设备”改成“先解决什么痛点”。",
  },
  {
    titleEn: "From logo distribution to auditable evidence",
    titleTh: "จากการแจกตราสู่หลักฐานที่ตรวจสอบได้",
    titleZh: "从颁发标识走向可审计证据",
    bodyEn: "Certification mattered, but it was not enough. SLIC and this Thailand index push the story one step further: every city claim should be benchmarked against outcomes, evidence, and delivery maturity rather than ceremony alone.",
    bodyTh: "การรับรองมีความหมาย แต่ยังไม่พอ SLIC และดัชนีประเทศไทยผลักเรื่องนี้ต่ออีกขั้น: คำกล่าวอ้างของเมืองต้องถูกเทียบกับผลลัพธ์ หลักฐาน และความพร้อมในการส่งมอบ ไม่ใช่พิธีการอย่างเดียว",
    bodyZh: "认证有意义，但还不够。SLIC 与泰国这一版指数把事情再往前推一步：城市的说法必须对照结果、证据与交付成熟度，而不是只看仪式。",
  },
];

const timeline: TimelineEvent[] = [
  {
    period: "2016–2017",
    titleEn: "The groundwork: Phuket pilot and the birth of the office",
    titleTh: "ปูพื้นสนาม: โครงการนำร่องภูเก็ตและการเกิดของสำนักงาน",
    titleZh: "打地基：普吉试点与办公室成立",
    bodyEn: "Thailand's smart city push starts before the bureaucracy is fully assembled. Phuket is used as an early proving ground for digital tourism, traffic, and environmental monitoring. In 2017, depa is formally established and the Smart City Thailand Office takes shape with the now-familiar seven dimensions.",
    bodyTh: "การขับเคลื่อนเมืองอัจฉริยะไทยเริ่มก่อนระบบราชการจะประกอบตัวเสร็จ ภูเก็ตถูกใช้เป็นสนามพิสูจน์สำหรับท่องเที่ยวดิจิทัล จราจร และการติดตามสิ่งแวดล้อม ปี 2560 depa ก่อตั้งอย่างเป็นทางการ และสำนักงานเมืองอัจฉริยะไทยก็เริ่มเป็นรูปเป็นร่างพร้อม 7 มิติที่คุ้นเคยกันทุกวันนี้",
    bodyZh: "泰国的智慧城市推动在官僚结构完全成形前就已经开始。普吉被拿来做数字旅游、交通与环境监测的早期试验场。2017 年 depa 正式成立，Smart City Thailand Office 也随之成形，并确立了今天熟悉的七大维度。",
    impactEn: "Impact: the program moved from scattered pilots to a national frame.",
    impactTh: "ผลกระทบ: โครงการขยับจากการทดลองกระจัดกระจายสู่กรอบระดับชาติ",
    impactZh: "影响：项目从零散试点转向全国框架。",
    photos: ["P6204927.JPG", "P6205097.JPG", "318402.jpg"],
    captionEn: "Roadshows and early depa innovation spaces laid the first layer of the ecosystem.",
    captionTh: "โรดโชว์และพื้นที่นวัตกรรมช่วงแรกของ depa คือชั้นแรกของระบบนิเวศนี้",
    captionZh: "路演与早期 depa 创新空间，为整个生态打下了第一层基础。",
  },
  {
    period: "2018",
    titleEn: "Thailand enters the ASEAN smart city conversation seriously",
    titleTh: "ไทยเข้าสู่บทสนทนาเมืองอัจฉริยะของอาเซียนอย่างจริงจัง",
    titleZh: "泰国正式走进东盟智慧城市话语场",
    bodyEn: "With the ASEAN Smart Cities Framework and the National Smart City Committee in place, Thailand stops acting like a collection of disconnected city projects. depa becomes co-secretariat, Bangkok, Chonburi, and Phuket represent the country, and the work starts gaining regional shape. This is also the moment when a more citizen-centric line of thought enters the program with force.",
    bodyTh: "เมื่อมี ASEAN Smart Cities Framework และคณะกรรมการเมืองอัจฉริยะแห่งชาติ ไทยก็เลิกดูเหมือนกองโครงการแยกส่วน depa รับบทเลขานุการร่วม กรุงเทพฯ ชลบุรี และภูเก็ตเป็นตัวแทนประเทศ งานเริ่มมีรูปทรงระดับภูมิภาค และนี่ก็เป็นช่วงที่แนวคิดเน้นประชาชนเริ่มเข้ามาอย่างมีน้ำหนัก",
    bodyZh: "随着东盟智慧城市框架与国家智慧城市委员会落地，泰国不再像一堆彼此无关的城市项目。depa 成为联合秘书处，曼谷、春武里与普吉代表国家，整项工作开始具备区域轮廓。也是在这个节点，以市民为中心的思路开始真正进入主线。",
    impactEn: "Impact: the work gained institutional backing and regional visibility.",
    impactTh: "ผลกระทบ: งานได้ทั้งหลังบ้านเชิงสถาบันและหน้าเวทีระดับภูมิภาค",
    impactZh: "影响：项目同时获得制度背书与区域可见度。",
    photos: ["IMG_4107.JPG", "f4b929dc011fb96fba76c9618ca6b93e.jpg", "IMG_5849.JPG", "IMG_5304.JPG"],
    captionEn: "Panels, conferences, and early team-building put Thailand on the regional map.",
    captionTh: "เวทีเสวนา การประชุม และการสร้างทีมช่วงแรก ทำให้ไทยเริ่มอยู่บนแผนที่ภูมิภาค",
    captionZh: "论坛、会议与早期团队建设，让泰国开始在区域地图上被看见。",
  },
  {
    period: "2019",
    titleEn: "Global exposure changes the tone of the program",
    titleTh: "การออกสู่เวทีโลกเปลี่ยนน้ำเสียงของโครงการ",
    titleZh: "走向国际舞台，改变了整个项目的气质",
    bodyEn: "From the Seoul Biennale to ASCN stages, Thailand's smart city team begins presenting itself as more than a procurement machine. International exposure matters because it forces the program to explain what it is doing and why. The story starts shifting from infrastructure announcements to a broader argument about urban life, governance, and public value.",
    bodyTh: "ตั้งแต่ Seoul Biennale ถึงเวที ASCN ทีมเมืองอัจฉริยะไทยเริ่มนำเสนอตัวเองว่าไม่ใช่แค่เครื่องจักรจัดซื้อ ความเป็นสากลมีผล เพราะมันบังคับให้โครงการต้องอธิบายว่ากำลังทำอะไรและทำไปทำไม เรื่องเล่าจึงเริ่มขยับจากการประกาศโครงสร้างพื้นฐาน ไปสู่ข้อถกเถียงเรื่องชีวิตเมือง การปกครอง และคุณค่าต่อสาธารณะ",
    bodyZh: "从首尔双年展到 ASCN 主舞台，泰国智慧城市团队开始把自己呈现为不只是一个采购机器。国际曝光的重要性在于，它逼着整个项目解释自己到底在做什么、为什么做。叙事也因此从基础设施公告，转向城市生活、治理与公共价值。",
    impactEn: "Impact: the program gained an international vocabulary, not just a domestic checklist.",
    impactTh: "ผลกระทบ: โครงการเริ่มมีภาษาระดับนานาชาติ ไม่ใช่แค่เช็กลิสต์ในประเทศ",
    impactZh: "影响：项目开始拥有国际语言，而不只是国内清单。",
    photos: [
      "depa x korea SBAU2019.jpg",
      "IMG_7331.JPG",
      "49614469.198c81947727b25aeb394554315b2b74.19090306.jpg",
      "49880176.c69e12bcd4cc4e80925f28838ebcb215.19091017.jpg",
    ],
    captionEn: "Exhibitions and international stages gave the team a larger frame to work inside.",
    captionTh: "นิทรรศการและเวทีนานาชาติ ทำให้ทีมมีกรอบใหญ่ขึ้นในการขับงาน",
    captionZh: "展览与国际舞台，为团队提供了更大的叙事框架。",
  },
  {
    period: "2019–2020",
    titleEn: "The cultural turn: hackathons, SCL, CSCO, then COVID",
    titleTh: "จุดหักเหทางวัฒนธรรม: แฮกกาธอน SCL CSCO แล้วก็ COVID",
    titleZh: "文化转向：黑客松、SCL、CSCO，接着是疫情",
    bodyEn: "This is the phase where the work stops being only about systems and starts being about people. Co-Founder Dating, the ASEAN Startup Hackathon, Smart City Leadership, and the Smart City Hamburger idea all push the same message: technology is only useful when it is attached to trust, service design, and citizen pain points. When COVID hits, that shift stops sounding theoretical. Cities need reporting systems, telemedicine, and practical digital channels that people can actually use.",
    bodyTh: "นี่คือช่วงที่งานหยุดเป็นเรื่องระบบอย่างเดียว แล้วเริ่มเป็นเรื่องคนจริงๆ Co-Founder Dating, ASEAN Startup Hackathon, Smart City Leadership และแนวคิด Smart City Hamburger ต่างผลักข้อความเดียวกัน: เทคโนโลยีมีค่าก็ต่อเมื่อมันผูกอยู่กับความไว้ใจ service design และปัญหาของประชาชน พอ COVID มา การเปลี่ยนนี้ก็ไม่ใช่ทฤษฎีอีกต่อไป เมืองต้องมีระบบรายงาน telemedicine และช่องทางดิจิทัลที่คนใช้ได้จริง",
    bodyZh: "这一阶段，工作不再只是系统工程，而是开始真正面向人。Co-Founder Dating、ASEAN Startup Hackathon、Smart City Leadership，以及“智慧城市汉堡”都在推同一个意思：技术只有绑定信任、服务设计与市民痛点时才有意义。等到 COVID 来临，这个转向也不再只是理论。城市需要报修系统、远程医疗，以及居民真的会用的数字渠道。",
    impactEn: "Impact: citizen-centric thinking moved from workshop language into operating logic.",
    impactTh: "ผลกระทบ: แนวคิดเน้นประชาชนย้ายจากภาษาในเวิร์กช็อปไปสู่ตรรกะการทำงานจริง",
    impactZh: "影响：以市民为中心，从工作坊语言变成了真正的操作逻辑。",
    photos: [
      "IMG_6691.JPG",
      "72639510_2459479007664540_4785365931712839680_o.jpg",
      "73513755_10157605754953794_5475140449704345600_n.jpg",
      "_K635402.jpg",
      "1-57.jpg",
    ],
    captionEn: "The visual language changed too: less theatre, more workshops, more fieldwork, more citizens in the loop.",
    captionTh: "ภาษาทางภาพก็เปลี่ยนไปด้วย: พิธีน้อยลง เวิร์กช็อปมากขึ้น ลงพื้นที่มากขึ้น และมีประชาชนอยู่ในลูปมากขึ้น",
    captionZh: "视觉语言也变了：少一点表演，多一点工作坊、实地工作与市民参与。",
  },
  {
    period: "2021–2023",
    titleEn: "Certification expands, but the serious question becomes delivery",
    titleTh: "การรับรองขยายตัว แต่คำถามจริงกลายเป็นเรื่องการส่งมอบ",
    titleZh: "认证在扩张，但真正的问题变成交付能力",
    bodyEn: "The certification batches matter because they give cities legitimacy and momentum. But this is also the moment when the gap between logo and lived reality becomes impossible to ignore. Some cities clearly deliver. Others mostly brand themselves. Case cities like Nakhon Si Thammarat stand out because the citizen-service loop, flood response, and operational improvements are visible in practice rather than only in slides.",
    bodyTh: "รุ่นการรับรองมีความสำคัญ เพราะมันให้ความชอบธรรมและโมเมนตัมกับเมือง แต่ช่วงนี้เองที่ช่องว่างระหว่างตราสัญลักษณ์กับชีวิตจริงเริ่มมองข้ามไม่ได้ บางเมืองส่งมอบได้จริง บางเมืองมีแต่แบรนด์ เมืองอย่างนครศรีธรรมราชจึงเด่น เพราะวงจรบริการประชาชน การตอบสนองน้ำท่วม และการปรับปรุงการปฏิบัติงานมองเห็นได้จากของจริง ไม่ใช่แค่ในสไลด์",
    bodyZh: "认证批次之所以重要，是因为它给城市带来了正当性与动能。但也是在这个阶段，标识与现实生活之间的落差开始无法忽视。有些城市确实交付了成果；另一些城市更多是在做品牌。像那空是贪玛叻这样的案例会脱颖而出，因为市民服务闭环、洪灾响应与运维改进，是在现实里看得见的，不只是 PPT 上漂亮。",
    impactEn: "Impact: certification became necessary but insufficient; evidence became the differentiator.",
    impactTh: "ผลกระทบ: การรับรองกลายเป็นสิ่งจำเป็นแต่ไม่พอ หลักฐานต่างหากที่แยกเมืองออกจากกัน",
    impactZh: "影响：认证变成必要条件，但不再是充分条件；证据才是分水岭。",
    photos: [
      "35663858.1bc37816278448879bdf3935d73727f4.21021520.JPG",
      "IMG_7760.JPG",
      "IMG_7761.JPG",
      "IMG_0964.JPG",
      "IMG_0861.JPG",
    ],
    captionEn: "Certification, workshops, and field cases gradually turned the conversation toward delivery quality.",
    captionTh: "การรับรอง เวิร์กช็อป และกรณีภาคสนาม ค่อยๆ ดันบทสนทนาไปสู่คุณภาพการส่งมอบ",
    captionZh: "认证、工作坊与一线案例，逐步把讨论推向交付质量。",
  },
  {
    period: "2024–2025",
    titleEn: "SLIC arrives as the accountability layer",
    titleTh: "SLIC เข้ามาเป็นชั้นของความรับผิดชอบ",
    titleZh: "SLIC 作为问责层开始出现",
    bodyEn: "By this stage the Thailand program has reach, archive, and political language. What it still needs is a sharper way to compare outcomes honestly. That is the opening for SLIC V1: transparent weights, traceable sources, and a framework that makes it harder for cities to hide behind award language. The count of certified cities reaches 37, but the more important change is methodological: the conversation can now move from prestige to proof.",
    bodyTh: "ถึงช่วงนี้ โครงการไทยมีทั้งขนาด เอกสารสะสม และภาษาทางการเมืองแล้ว สิ่งที่ยังต้องมีคือวิธีเทียบผลลัพธ์อย่างตรงไปตรงมามากขึ้น นั่นคือช่องที่ SLIC V1 เข้ามา: น้ำหนักคะแนนที่เปิดเผย แหล่งข้อมูลที่สืบย้อนกลับได้ และกรอบที่ทำให้เมืองซ่อนตัวหลังภาษารางวัลได้ยากขึ้น จำนวนเมืองรับรองขึ้นถึง 37 เมือง แต่การเปลี่ยนที่สำคัญกว่าคือเชิงวิธีวิทยา: บทสนทนาสามารถขยับจากศักดิ์ศรีไปสู่หลักฐานได้",
    bodyZh: "到了这个阶段，泰国项目已经有了规模、档案与政治话语。它仍然缺的是一种更锋利、更诚实的结果比较方法。这就是 SLIC V1 出现的入口：透明权重、可追溯来源，以及一套让城市更难躲在奖项语言后面的框架。认证城市数量来到 37，但更重要的变化是方法论上的：讨论终于可以从“面子”转向“证据”。",
    impactEn: "Impact: the index stops being decoration and starts becoming an auditing tool.",
    impactTh: "ผลกระทบ: ดัชนีเลิกเป็นของประดับ แล้วเริ่มกลายเป็นเครื่องมือ audit",
    impactZh: "影响：指数不再只是装饰，而开始变成审计工具。",
    photos: ["IMG_9995.JPG", "IMG_3619.JPG", "IMG_4175.JPG", "IMG_4207.JPG"],
    captionEn: "The later phase is less about saying 'smart city' and more about proving what the phrase means.",
    captionTh: "ช่วงหลังไม่ใช่แค่พูดคำว่า smart city แต่เป็นการพิสูจน์ว่าคำนั้นหมายถึงอะไร",
    captionZh: "后期重点不再是喊“智慧城市”，而是证明这个词到底是什么意思。",
  },
  {
    period: "2026",
    titleEn: "Taipei puts the accountability argument on a bigger stage",
    titleTh: "ไทเปพาข้อถกเถียงเรื่อง accountability ขึ้นเวทีที่ใหญ่กว่า",
    titleZh: "台北把问责这件事推上更大的舞台",
    bodyEn: "At Smart City Summit & Expo 2026 in Taipei, the argument sharpens. The pitch is no longer 'Thailand has smart city projects too.' It becomes: here is a transparent way to compare delivery, show the evidence, and build something useful fast. SLIC V2 and the Thailand index sit inside that momentum. They are not the end of the story. They are the part where the program becomes harder to fake.",
    bodyTh: "ที่ Smart City Summit & Expo 2026 ไทเป ข้อถกเถียงยิ่งคมขึ้น จุดขายไม่ใช่แค่ 'ไทยก็มีโครงการเมืองอัจฉริยะเหมือนกัน' อีกแล้ว แต่มันกลายเป็นว่า: นี่คือวิธีเปรียบเทียบการส่งมอบอย่างโปร่งใส แสดงหลักฐาน และสร้างของที่ใช้ได้จริงอย่างรวดเร็ว SLIC V2 และดัชนีประเทศไทยอยู่ในโมเมนตัมนี้ มันไม่ใช่ตอนจบของเรื่อง แต่เป็นช่วงที่โครงการปลอมได้ยากขึ้น",
    bodyZh: "在 2026 年台北智慧城市展上，论点变得更锋利。重点不再是“泰国也有智慧城市项目”，而是“这里有一套透明比较交付、展示证据、并能快速做出实用产品的方法”。SLIC V2 与泰国这一版指数就长在这股动能里。它们不是故事的终点，而是让这件事更难被作假的那一段。",
    impactEn: "Impact: the Thailand story becomes exportable because the proof layer is finally visible.",
    impactTh: "ผลกระทบ: เรื่องเล่าของไทยเริ่มส่งออกได้ เพราะชั้นของหลักฐานมองเห็นชัดแล้ว",
    impactZh: "影响：泰国路径开始具备可输出性，因为证据层终于清晰可见。",
    photos: ["IMG_7607.JPG", "IMG_7613.JPG", "IMG_0396.JPG", "IMG_0324.JPG"],
    captionEn: "Taipei did not invent the work. It made the work legible.",
    captionTh: "ไทเปไม่ได้สร้างงานนี้ขึ้นมาใหม่ แต่มันทำให้งานนี้อ่านออก",
    captionZh: "台北没有发明这套工作，但它让这套工作变得可读、可见。",
  },
];

function t(locale: Locale, en: string, th: string, zh: string): string {
  return locale === "th" ? th : locale === "zh" ? zh : en;
}

export default function StoryPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section story-hero">
        <p className="eyebrow">{t(locale, "The story", "เรื่องราว", "故事")}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>จากเซ็นเซอร์<br />สู่ประชาชน</>
            : locale === "zh"
              ? <>从传感器<br />走向市民。</>
              : <>From sensors<br />to citizens.</>}
        </h1>
        <p className="hero-strapline">
          {t(
            locale,
            "This is the short history of Thailand's smart city program as a shift in operating logic: from scattered pilots, to citizen-centric delivery, to an index that makes cities show their work.",
            "นี่คือประวัติศาสตร์แบบย่อของโครงการเมืองอัจฉริยะไทยในฐานะการเปลี่ยนตรรกะการทำงาน: จากโครงการนำร่องกระจัดกระจาย สู่การส่งมอบที่เน้นประชาชน และสู่ดัชนีที่บังคับให้เมืองต้องโชว์ผลงานจริง",
            "这是一段关于泰国智慧城市计划的简史，但重点是操作逻辑的变化：从零散试点，到以市民为中心的交付，再到逼着城市亮出证据的指数。")}
        </p>
      </section>

      <section className="section story-metric-section">
        <div className="story-metric-grid">
          {storyMetrics.map(metric => (
            <div key={metric.labelEn} className="story-metric-card">
              <div className="story-metric-value">{metric.value}</div>
              <div className="story-metric-label">
                {locale === "th" ? metric.labelTh : locale === "zh" ? metric.labelZh : metric.labelEn}
              </div>
            </div>
          ))}
        </div>
        <p className="story-source-note">
          {t(
            locale,
            "Compiled from depa program materials, public event records, case-study documents, and the archive photo set used across this site.",
            "สรุปจากเอกสารโครงการของ depa บันทึกงานสาธารณะ เอกสารกรณีศึกษา และชุดภาพถ่ายคลังที่ใช้ทั่วทั้งเว็บไซต์นี้",
            "内容整理自 depa 项目材料、公开活动记录、案例文件，以及本站使用的档案照片集。")}
        </p>
      </section>

      <section className="section story-shift-section">
        <div className="story-section-head">
          <div>
            <p className="eyebrow">{t(locale, "Three shifts", "สามจุดเปลี่ยน", "三个转折")}</p>
            <h2>{t(locale, "What actually changed", "สิ่งที่เปลี่ยนจริง", "真正改变了什么")}</h2>
          </div>
          <p className="section-intro story-section-intro">
            {t(
              locale,
              "The story is not just dates and conferences. It is a sequence of changes in how the work gets justified, financed, and delivered.",
              "เรื่องนี้ไม่ใช่แค่ลำดับวันที่กับการประชุม แต่มันคือชุดของการเปลี่ยนว่า งานนี้ถูกให้เหตุผล หาเงิน และส่งมอบอย่างไร",
              "这段历史不只是时间线和会议记录，而是一连串关于这项工作如何被论证、融资与交付的变化。")}
          </p>
        </div>
        <div className="story-shift-grid">
          {storyShifts.map(shift => (
            <article key={shift.titleEn} className="story-shift-card">
              <h3 className="story-shift-title">
                {locale === "th" ? shift.titleTh : locale === "zh" ? shift.titleZh : shift.titleEn}
              </h3>
              <p className="story-shift-body">
                {locale === "th" ? shift.bodyTh : locale === "zh" ? shift.bodyZh : shift.bodyEn}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        {timeline.map(event => (
          <article key={event.period} className="timeline-event">
            <div className="timeline-year-bar">
              <span className="timeline-year">{event.period}</span>
              <span className="timeline-line" />
            </div>
            <div className="timeline-content">
              <h2 className="timeline-title">
                {locale === "th" ? event.titleTh : locale === "zh" ? event.titleZh : event.titleEn}
              </h2>
              <p className="timeline-body">
                {locale === "th" ? event.bodyTh : locale === "zh" ? event.bodyZh : event.bodyEn}
              </p>
              <p className="timeline-impact">
                {locale === "th" ? event.impactTh : locale === "zh" ? event.impactZh : event.impactEn}
              </p>
              {event.photos.length > 0 && (
                <div className="timeline-photos">
                  {event.photos.map(photo => (
                    <img
                      key={photo}
                      src={`/photos/${photo}`}
                      alt={
                        locale === "th"
                          ? (event.captionTh ?? event.titleTh)
                          : locale === "zh"
                            ? (event.captionZh ?? event.titleZh)
                            : (event.captionEn ?? event.titleEn)
                      }
                      className="timeline-photo"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              {event.captionEn && (
                <p className="timeline-caption">
                  {locale === "th" ? event.captionTh : locale === "zh" ? event.captionZh : event.captionEn}
                </p>
              )}
            </div>
          </article>
        ))}
      </section>

      <section className="section story-closing">
        <div className="callout-card story-closing-card">
          <p className="eyebrow">{t(locale, "Now", "ตอนนี้", "现在")}</p>
          <h2>
            {t(
              locale,
              "The index is the accountability layer the program was missing.",
              "ดัชนีคือชั้นของ accountability ที่โครงการนี้ขาดอยู่",
              "这个指数，就是此前缺失的问责层。")}
          </h2>
          <p>
            {t(
              locale,
              "Thailand still has a national target of 105 smart cities by 2027. This release is narrower and stricter: it tracks only the 49 cities where the team has enough evidence to compare reality, not just ambition.",
              "ประเทศไทยยังมีเป้าหมายระดับชาติ 105 เมืองอัจฉริยะภายในปี 2570 แต่รุ่นนี้แคบกว่าและเข้มกว่า มันติดตามแค่ 49 เมืองที่เรามีหลักฐานพอจะเทียบความจริง ไม่ใช่แค่ความทะเยอทะยาน",
              "泰国到 2027 年仍然有 105 座智慧城市的国家目标。但这一版更窄、更严：只追踪那 49 座有足够证据可比较现实表现的城市，而不是只比雄心。")}
          </p>
          <div className="story-closing-actions">
            <button type="button" className="cta-button" onClick={() => onNavigate("/rankings")}>
              {t(locale, "See the rankings", "ดูอันดับ", "查看排名")}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/methodology")}>
              {t(locale, "Read the methodology", "ดูวิธีการ", "阅读方法论")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
