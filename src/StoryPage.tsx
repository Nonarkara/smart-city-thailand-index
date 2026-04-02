import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface TimelineEvent {
  year: string;
  titleEn: string;
  titleTh: string;
  titleZh: string;
  bodyEn: string;
  bodyTh: string;
  bodyZh: string;
  photos: string[];
  captionEn?: string;
  captionTh?: string;
  captionZh?: string;
}

const timeline: TimelineEvent[] = [
  {
    year: "2017",
    titleEn: "The beginning: Smart City Office founded",
    titleTh: "จุดเริ่มต้น: ก่อตั้งสำนักงานเมืองอัจฉริยะ",
    titleZh: "起点：智慧城市办公室成立",
    bodyEn: "The Digital Economy Promotion Agency (depa) establishes the Smart City Thailand Office on October 15, 2017. The mission: create a national smart city development plan. At this stage, the approach is heavily technology-driven — sensors, platforms, infrastructure. The 7 Smart City dimensions are defined: Economy, Energy, Environment, Governance, Living, Mobility, People. Dr. Pasakorn Srisook leads the digital promotion division. The team is small. The ambition is enormous.",
    bodyTh: "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) ก่อตั้งสำนักงานเมืองอัจฉริยะประเทศไทย วันที่ 15 ตุลาคม 2560 ภารกิจ: สร้างแผนพัฒนาเมืองอัจฉริยะระดับชาติ ในระยะนี้ แนวทางเน้นเทคโนโลยีเป็นหลัก — เซ็นเซอร์ แพลตฟอร์ม โครงสร้างพื้นฐาน กำหนด 7 มิติเมืองอัจฉริยะ ดร.ภาสกร ศรีสุข นำกองส่งเสริมดิจิทัล ทีมเล็ก ความทะเยอทะยานใหญ่",
    bodyZh: "2017 年 10 月 15 日，数字经济促进局（depa）成立泰国智慧城市办公室。任务很简单也很大：建立国家级智慧城市发展框架。这个阶段仍然是强技术导向，强调传感器、平台和基础设施。七大智慧城市维度也在此时成形：经济、能源、环境、治理、生活、交通与人。Pasakorn Srisook 博士负责数字促进工作。团队很小，野心很大。",
    photos: ["P6204927.JPG", "P6205097.JPG"],
    captionEn: "Smart City Thailand Roadshow — taking the idea to every region",
    captionTh: "Smart City Thailand Roadshow — นำแนวคิดไปทุกภูมิภาค",
    captionZh: "Smart City Thailand 路演，把这套想法带到全国各地",
  },
  {
    year: "2018–2019",
    titleEn: "Going international: ASEAN and beyond",
    titleTh: "สู่สากล: อาเซียนและไกลกว่า",
    titleZh: "走向国际：东盟，以及更远的地方",
    bodyEn: "Thailand joins the ASEAN Smart Cities Network (ASCN) with Bangkok, Chonburi, and Phuket as pilot cities. Dr. Non Arkaraprasertkul — a Harvard-trained anthropologist and architect who had been studying cities from Shanghai to Chicago — joins depa as Senior Expert in Smart City Promotion. The team goes to Seoul for the Seoul Biennale of Architecture and Urbanism, to Taipei for SCSE, and begins building international partnerships with Japan, Korea, and the EU. Dr. Non starts pushing a radical idea: smart cities should be measured by how citizens feel, not by how much technology is deployed.",
    bodyTh: "ไทยเข้าร่วม ASEAN Smart Cities Network (ASCN) กรุงเทพฯ ชลบุรี และภูเก็ตเป็นเมืองนำร่อง ดร.ณณ อาคาราประเสริฐกุล — นักมานุษยวิทยาและสถาปนิกจากฮาร์วาร์ดที่ศึกษาเมืองจากเซี่ยงไฮ้ถึงชิคาโก — เข้าร่วม depa เป็นผู้เชี่ยวชาญอาวุโสด้านส่งเสริมเมืองอัจฉริยะ ทีมไปโซลงาน Biennale ไปไทเปงาน SCSE เริ่มสร้างความร่วมมือระหว่างประเทศกับญี่ปุ่น เกาหลี EU ดร.ณณ เริ่มผลักดันแนวคิดสุดขั้ว: เมืองอัจฉริยะควรวัดจากความรู้สึกของประชาชน ไม่ใช่จากปริมาณเทคโนโลยี",
    bodyZh: "泰国加入东盟智慧城市网络（ASCN），以曼谷、春武里和普吉为试点城市。曾从上海研究到芝加哥的哈佛背景人类学家兼建筑师 Non Arkaraprasertkul 博士加入 depa，担任智慧城市推进高级专家。团队去了首尔建筑双年展，也去了台北 SCSE，并开始与日本、韩国和欧盟建立国际合作。Non 博士开始推动一个激进但正确的观点：智慧城市不该按部署了多少技术来衡量，而该看市民的真实感受。",
    photos: [
      "depa x korea SBAU2019.jpg",
      "SWP_8806.JPG",
      "4A2A6179.JPG",
      "4A2A6250.JPG",
      "IMG_5304.JPG",
      "IMG_5849.JPG",
    ],
    captionEn: "Seoul Biennale, ASEAN Smart Cities Network Conference 2019, and the early team",
    captionTh: "Seoul Biennale งาน ASEAN Smart Cities Network 2019 และทีมในช่วงเริ่มต้น",
    captionZh: "首尔双年展、2019 东盟智慧城市网络会议，以及早期团队",
  },
  {
    year: "2019",
    titleEn: "The shift: from tech-centric to citizen-centric",
    titleTh: "จุดเปลี่ยน: จากเน้นเทคโนโลยี สู่เน้นประชาชน",
    titleZh: "转向：从技术中心到市民中心",
    bodyEn: "Dr. Non runs the first \"Co-Founder Dating\" hackathons — matching city problems with startup solutions. Not in Silicon Valley fashion, but Thai-style: on bean bags, in co-working spaces, with food. He launches the ASEAN Startup Hackathon at depa's headquarters in Bangkok. The Smart City Leadership (SCL) program begins: training local government officials not in technology procurement, but in design thinking, citizen engagement, and service design. The paradigm shifts from \"deploy sensors\" to \"understand what citizens actually need.\" Mastercard partners with depa to bring 27 Thai cities into the City Possible network.",
    bodyTh: "ดร.ณณ จัด Co-Founder Dating แฮกกาธอนครั้งแรก — จับคู่ปัญหาเมืองกับโซลูชันสตาร์ทอัพ ไม่แบบ Silicon Valley แต่แบบไทย: บนเบาะ ในโคเวิร์กกิง มีอาหาร เปิดตัว ASEAN Startup Hackathon ที่สำนักงาน depa เริ่มโปรแกรม Smart City Leadership (SCL): ฝึกเจ้าหน้าที่ท้องถิ่นไม่ใช่เรื่องจัดซื้อเทคโนโลยี แต่เรื่อง design thinking การมีส่วนร่วมของพลเมือง และ service design กระบวนทัศน์เปลี่ยนจาก 'ติดเซ็นเซอร์' เป็น 'เข้าใจสิ่งที่ประชาชนต้องการจริงๆ'",
    bodyZh: "Non 博士发起第一次“Co-Founder Dating”黑客松，把城市问题和创业解决方案真正配对起来。不是硅谷那一套，而是更泰式：豆袋、共享空间、食物、然后狠狠干活。他在曼谷 depa 总部启动 ASEAN Startup Hackathon，也开启了 Smart City Leadership（SCL）项目，训练地方官员的重点不再是怎么买技术，而是设计思维、市民参与和服务设计。范式从“部署传感器”转向“先理解市民到底需要什么”。Mastercard 也与 depa 合作，把 27 座泰国城市带入 City Possible 网络。",
    photos: [
      "IMG_6691.JPG",
      "72639510_2459479007664540_4785365931712839680_o.jpg",
      "73513755_10157605754953794_5475140449704345600_n.jpg",
      "IMG_7504.JPG",
      "66438786_2265889173489652_6708326457757663232_o.jpg",
      "350284.jpg",
    ],
    captionEn: "Co-Founder Dating, ASEAN Hackathon, depa team building — the culture shift begins",
    captionTh: "Co-Founder Dating, ASEAN Hackathon, สร้างทีม depa — วัฒนธรรมเริ่มเปลี่ยน",
    captionZh: "Co-Founder Dating、ASEAN Hackathon 与 depa 团队建设，文化转向由此开始",
  },
  {
    year: "2020",
    titleEn: "Smart City Week and the first certifications",
    titleTh: "Smart City Week และการรับรองครั้งแรก",
    titleZh: "Smart City Week 与首轮认证",
    bodyEn: "Thailand launches Smart City Week 2020 — the biggest smart city event in the country. Dr. Non presents the \"Smart City Hamburger\" — a visual framework showing that technology is just the meat; the buns are governance and citizen engagement. The metaphor sticks. The first Smart City Competitiveness Index (TSCCI) is developed. 4 cities receive initial Smart City status: Phuket, Khon Kaen, Chiang Mai, and Yala. COVID hits. The team pivots to digital governance — citizen reporting systems, telemedicine, smart health monitoring. The crisis proves the citizen-centric approach: cities with strong citizen engagement handle the pandemic better.",
    bodyTh: "ไทยจัด Smart City Week 2020 — งานเมืองอัจฉริยะใหญ่ที่สุดในประเทศ ดร.ณณ นำเสนอ 'Smart City Hamburger' — กรอบภาพที่แสดงว่าเทคโนโลยีเป็นแค่เนื้อ ขนมปังคือการปกครองและการมีส่วนร่วมของประชาชน อุปมาติดหู พัฒนาดัชนีการแข่งขันเมืองอัจฉริยะ (TSCCI) ครั้งแรก 4 เมืองได้สถานะเมืองอัจฉริยะเบื้องต้น COVID มา ทีมปรับตัวสู่ digital governance — ระบบรายงานของประชาชน telemedicine วิกฤตพิสูจน์ว่าแนวทางเน้นประชาชนได้ผล",
    bodyZh: "2020 年，泰国举办 Smart City Week，这是全国最大的智慧城市活动。Non 博士提出“智慧城市汉堡”框架：技术只是中间那块肉，上下两层面包分别是治理与市民参与。这个比喻很好用，也确实留下来了。第一版智慧城市竞争力指数（TSCCI）在这一年完成。普吉、孔敬、清迈和也拉成为首批获得智慧城市身份的四座城市。随后疫情袭来，团队转向数字治理，包括市民报修、远程医疗与智慧健康监测。危机反过来证明了市民中心路径是对的：市民参与更强的城市，抗疫表现也更稳。",
    photos: [
      "_K635402.jpg",
      "1-57.jpg",
      "IMG_4034.JPG",
    ],
    captionEn: "Smart City Week, depa boardroom strategy, and the three leaders in depa jackets",
    captionTh: "Smart City Week ยุทธศาสตร์ห้องประชุม depa และผู้นำสามคนในแจ็คเก็ต depa",
    captionZh: "Smart City Week、depa 会议室战略讨论，以及穿着 depa 外套的三位领导",
  },
  {
    year: "2021",
    titleEn: "Batch 1: 15 cities get the Smart City logo",
    titleTh: "รุ่นที่ 1: 15 เมืองได้รับตราสัญลักษณ์เมืองอัจฉริยะ",
    titleZh: "第一批：15 座城市获得智慧城市标识",
    bodyEn: "The Smart City Thailand committee awards the official Smart City Local logo (ตราสัญลักษณ์เมืองอัจฉริยะ) to 15 cities in the first batch. Deputy PM Prawit Wongsuwan presents the logos. The list includes Chiang Mai, Phuket, Khon Kaen, Samyan, Yala, and Wangchan Valley. Dr. Non publishes a landmark article in Hitachi Review: \"Smart City Initiatives in Thailand: Key Concepts and Methods\" — articulating the citizen-centric approach for an international audience. The article becomes required reading for smart city practitioners across ASEAN. Workshop training intensifies: Dr. Non and team run design thinking sessions with local government officials across the country.",
    bodyTh: "คณะกรรมการเมืองอัจฉริยะไทยมอบตราสัญลักษณ์เมืองอัจฉริยะให้ 15 เมืองรุ่นที่ 1 รอง นรม. ประวิตร วงษ์สุวรรณ มอบตราสัญลักษณ์ ดร.ณณ ตีพิมพ์บทความสำคัญใน Hitachi Review: 'Smart City Initiatives in Thailand' — นำเสนอแนวทางเน้นประชาชนต่อผู้อ่านนานาชาติ บทความกลายเป็นบทอ่านบังคับสำหรับผู้ปฏิบัติงานเมืองอัจฉริยะทั่วอาเซียน",
    bodyZh: "泰国智慧城市委员会向首批 15 座城市授予官方 Smart City Local 标识，其中包括清迈、普吉、孔敬、Samyan、也拉和 Wangchan Valley。副总理 Prawit Wongsuwan 出席颁发。Non 博士也在这一年于《Hitachi Review》发表代表性文章《Smart City Initiatives in Thailand: Key Concepts and Methods》，把以市民为中心的方法论清楚地讲给国际读者听。这篇文章后来几乎成了东盟智慧城市从业者的必读材料。与此同时，培训也越来越密集，Non 博士和团队在全国为地方政府官员持续举办设计思维工作坊。",
    photos: [
      "35663858.1bc37816278448879bdf3935d73727f4.21021520.JPG",
      "IMG_7760.JPG",
      "IMG_7761.JPG",
      "IMG_1457.JPG",
    ],
    captionEn: "Design thinking workshops with local governments — teaching mayors to listen to citizens",
    captionTh: "เวิร์กช็อป design thinking กับรัฐบาลท้องถิ่น — สอนนายกเทศมนตรีให้ฟังประชาชน",
    captionZh: "与地方政府开展设计思维工作坊，教市长先学会听市民讲话",
  },
  {
    year: "2022",
    titleEn: "Batch 2: 15 more cities, international expansion",
    titleTh: "รุ่นที่ 2: อีก 15 เมือง ขยายสู่สากล",
    titleZh: "第二批：再增 15 城，国际影响扩大",
    bodyEn: "Batch 2 adds 15 more cities including Rayong, Chiang Rai, Nan, Korat, Krabi, Hat Yai, and Koh Samui. Thailand now has 30 certified smart cities across 20 provinces. Dr. Supakorn joins the leadership team, bringing expertise in digital infrastructure and platform development. The team develops the City Data Platform (citydata.in.th) — Thailand's first unified smart city data dashboard. ASEAN Smart Cities Network adds Chiang Mai, Khon Kaen, and Rayong to Thailand's representation. Dr. Non is featured in The ASEAN Magazine and begins consulting for the ASEAN Digital Masterplan 2025.",
    bodyTh: "รุ่น 2 เพิ่มอีก 15 เมือง รวมถึงระยอง เชียงราย น่าน โคราช กระบี่ หาดใหญ่ สมุย ไทยมี 30 เมืองอัจฉริยะรับรองแล้วใน 20 จังหวัด ดร.ศุภกร เข้าร่วมทีมผู้นำ นำความเชี่ยวชาญด้านโครงสร้างพื้นฐานดิจิทัล ทีมพัฒนา City Data Platform (citydata.in.th) — แดชบอร์ดข้อมูลเมืองอัจฉริยะแบบรวมศูนย์แห่งแรกของไทย",
    bodyZh: "第二批再加入 15 座城市，包括罗勇、清莱、难府、呵叻、甲米、合艾和苏梅。泰国的认证智慧城市总数来到 30 座，分布在 20 个府。Supakorn 博士加入核心领导团队，把数字基础设施与平台开发经验带了进来。团队开发了 City Data Platform（citydata.in.th），这是泰国第一套统一的智慧城市数据看板。东盟智慧城市网络也把清迈、孔敬与罗勇加入泰国代表城市。Non 博士登上《The ASEAN Magazine》，并开始为《ASEAN Digital Masterplan 2025》提供咨询。",
    photos: [
      "IMG_6065.JPG",
      "IMG_6482.JPG",
      "IMG_6508.JPG",
      "IMG_6426.JPG",
      "IMG_6654.JPG",
    ],
    captionEn: "Training programs, international forums, and building the smart city ecosystem",
    captionTh: "โปรแกรมฝึกอบรม เวทีนานาชาติ และการสร้างระบบนิเวศเมืองอัจฉริยะ",
    captionZh: "培训项目、国际论坛，以及智慧城市生态系统的搭建",
  },
  {
    year: "2023",
    titleEn: "Batch 3 and the Nakhon Si Thammarat breakthrough",
    titleTh: "รุ่น 3 และความสำเร็จนครศรีธรรมราช",
    titleZh: "第三批，以及那空是贪玛叻的突破",
    bodyEn: "6 more cities join: Lampang, Samut Prakan, Nakhon Si Thammarat, and others. The Nakhon Si Thammarat \"My City\" app becomes the flagship example of citizen-centric smart city: citizens report clogged drains, data analytics identify flood root causes, targeted infrastructure upgrades solve them. Response time drops from 67 hours to 2 hours. This is Dr. Non's proof of concept — technology serving citizens, not the other way around. TNGlobal publishes a major interview: \"A smart city cannot exist without its citizens.\" Dr. Non begins conceptualizing the SLIC Index.",
    bodyTh: "อีก 6 เมืองเข้าร่วม: ลำปาง สมุทรปราการ นครศรีธรรมราช แอพ 'เมืองของฉัน' นครศรีธรรมราชกลายเป็นตัวอย่างเรือธงของเมืองอัจฉริยะเน้นประชาชน: ประชาชนรายงานท่อระบายอุดตัน วิเคราะห์ข้อมูลหาสาเหตุน้ำท่วม แก้โครงสร้างพื้นฐานตรงจุด เวลาตอบสนองลดจาก 67 ชั่วโมงเหลือ 2 ชั่วโมง นี่คือ proof of concept ของ ดร.ณณ",
    bodyZh: "第三批又加入 6 座城市，包括南邦、北榄和那空是贪玛叻等。那空是贪玛叻的“My City”应用成为以市民为中心智慧城市的代表案例：市民报告排水堵塞，数据分析找出洪水根因，再把基础设施升级打在正确的位置上。响应时间从 67 小时降到 2 小时。这就是 Non 博士的概念验证：技术应该服务市民，而不是反过来让市民服务技术。TNGlobal 也发表了一篇重要专访，标题很直接：“没有市民，就不存在智慧城市。”Non 博士开始构思 SLIC Index。",
    photos: [
      "IMG_0964.JPG",
      "IMG_0861.JPG",
      "IMG_1089.JPG",
      "IMG_1382.JPG",
      "IMG_1596.JPG",
      "IMG_1447.JPG",
    ],
    captionEn: "Training local government teams, Inno Tourism Boot-Up, and hands-on workshops across Thailand",
    captionTh: "ฝึกทีมรัฐบาลท้องถิ่น Inno Tourism Boot-Up และเวิร์กช็อปภาคปฏิบัติทั่วไทย",
    captionZh: "培训地方政府团队、Inno Tourism Boot-Up，以及遍布全国的实战工作坊",
  },
  {
    year: "2024–2025",
    titleEn: "SLIC Index V1, UNCRD, and 37 cities",
    titleTh: "SLIC Index V1, UNCRD และ 37 เมือง",
    titleZh: "SLIC Index V1、UNCRD，以及 37 座认证城市",
    bodyEn: "The Smart Liveable Cities Index (SLIC) V1 launches — a transparent, open-source city ranking built from the ground up. Dr. Non presents Thailand's citizen-centric approach at the UNCRD International Training Workshop on Smart Cities in Kobe, Japan. Phuket Tinicon Valley receives the Smart City Local logo in Batch 4, bringing the total to 37 certified cities. depa sets a target of 105 inclusive smart cities by 2027. The Smart and Liveable City Lab soft-launches with support from Thai and New Zealand governments.",
    bodyTh: "SLIC Index V1 เปิดตัว — ดัชนีจัดอันดับเมืองแบบโปร่งใส โอเพนซอร์ส สร้างจากศูนย์ ดร.ณณ นำเสนอแนวทางเน้นประชาชนของไทยที่ UNCRD Training Workshop เมืองอัจฉริยะ โกเบ ญี่ปุ่น ภูเก็ตทินิคอนวัลเลย์ได้ตราสัญลักษณ์รุ่น 4 รวม 37 เมืองรับรอง depa ตั้งเป้า 105 เมืองอัจฉริยะภายปี 2570",
    bodyZh: "Smart Liveable Cities Index（SLIC）V1 正式发布。这是一套从零搭起来、透明且开源的城市指数。Non 博士在日本神户举行的 UNCRD 智慧城市国际培训工作坊上，介绍泰国的市民中心路径。普吉 Tinicon Valley 在第四批获得 Smart City Local 标识，使认证城市总数来到 37 座。depa 同时提出到 2027 年建设 105 座包容型智慧城市的目标。Smart and Liveable City Lab 也在泰国与新西兰政府支持下低调启动。",
    photos: [
      "IMG_9995.JPG",
      "IMG_3619.JPG",
      "IMG_4175.JPG",
      "IMG_4207.JPG",
      "IMG_7649.JPG",
    ],
    captionEn: "MOPH collaborations, training the next generation, and building partnerships",
    captionTh: "ความร่วมมือกับ สธ. ฝึกคนรุ่นใหม่ และสร้างความร่วมมือ",
    captionZh: "与公共卫生部合作、培训下一代人才，并建立新的伙伴关系",
  },
  {
    year: "2026",
    titleEn: "SCSE Taipei: SLIC V2 and the world stage",
    titleTh: "SCSE ไทเป: SLIC V2 และเวทีโลก",
    titleZh: "台北 SCSE：SLIC V2 走上世界舞台",
    bodyEn: "March 2026. Smart City Summit & Expo, Taipei. The largest smart city event in Asia — 174 cities, 53 countries, 120,000 visitors. The Vice President of Taiwan opens the event. Dr. Non takes the City Vision in Action stage as keynote speaker. He shows a war dashboard built in 45 minutes, a bus tracker running without GPS, a citizen reporting system that cut response times from 67 hours to 2. Then: the SLIC Index V2. Interactive. Transparent. Every number traceable. A European mayor's alliance asks to use it instead of The Economist's index. City leaders line up asking: \"Can you do this for my city?\" The Smart City Thailand Index — this page you're reading — is born from this momentum.",
    bodyTh: "มีนาคม 2569. Smart City Summit & Expo ไทเป งานเมืองอัจฉริยะใหญ่ที่สุดในเอเชีย — 174 เมือง 53 ประเทศ 120,000 ผู้เยี่ยมชม รองประธานาธิบดีไต้หวันเปิดงาน ดร.ณณ ขึ้นเวที City Vision in Action เป็น keynote speaker เขาโชว์ war dashboard ที่สร้างใน 45 นาที ระบบติดตามรถเมล์โดยไม่ใช้ GPS ระบบรายงานของประชาชนที่ลดเวลาตอบสนองจาก 67 ชั่วโมงเหลือ 2 แล้ว: SLIC Index V2 แบบโต้ตอบ โปร่งใส ทุกตัวเลขสืบย้อนได้ พันธมิตรนายกเทศมนตรียุโรปขอใช้แทนดัชนี The Economist ดัชนีเมืองอัจฉริยะไทย — หน้าที่คุณกำลังอ่าน — เกิดจากโมเมนตัมนี้",
    bodyZh: "2026 年 3 月，台北智慧城市展（Smart City Summit & Expo）登场。这是亚洲最大的智慧城市活动，汇聚 53 个国家、174 座城市和 12 万名参观者。台湾副总统开幕，Non 博士受邀在 City Vision in Action 主舞台发表主题演讲。他展示了 45 分钟做出来的战情仪表板、不靠 GPS 也能跑的公交追踪器，以及把市民报修响应时间从 67 小时压到 2 小时的系统。然后轮到 SLIC Index V2：可交互、透明、每个数字都可追溯。欧洲一个市长联盟当场表示希望用它替代《经济学人》的指数。城市领导排队来问：能不能也给我们做一套？你现在看到的 Smart City Thailand Index，就是从这股动能里长出来的。",
    photos: [
      "IMG_7607.JPG",
      "IMG_7613.JPG",
      "IMG_0396.JPG",
      "IMG_0324.JPG",
      "593016939.296474.jpg",
      "578383385.557473.jpg",
    ],
    captionEn: "The team — from Taipei stages to Bangkok food courts, building the future of Thai smart cities",
    captionTh: "ทีม — จากเวทีไทเปถึงศูนย์อาหารกรุงเทพ สร้างอนาคตเมืองอัจฉริยะไทย",
    captionZh: "这支团队，从台北舞台走到曼谷食阁，一路把泰国智慧城市的未来做出来",
  },
];

export default function StoryPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section story-hero">
        <p className="eyebrow">{locale === "th" ? "เรื่องราว" : locale === "zh" ? "故事" : "The story"}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>จากเซ็นเซอร์<br />สู่ประชาชน</>
            : locale === "zh"
              ? <>从传感器<br />走向市民。</>
              : <>From sensors<br />to citizens.</>}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "ประวัติศาสตร์การเปลี่ยนแปลงเมืองอัจฉริยะไทยจากแนวทางเน้นเทคโนโลยีเป็นแนวทางเน้นประชาชน — เรื่องราวของคนที่ทำให้มันเกิดขึ้น"
            : locale === "zh"
              ? "泰国智慧城市项目如何从技术优先，转向以市民为中心。这是那群把事情做成的人留下来的轨迹。"
            : "How Thailand's smart city program transformed from a technology-first approach to a citizen-centric movement — and the people who made it happen."}
        </p>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="section">
        {timeline.map((event, i) => (
          <div key={i} className="timeline-event">
            <div className="timeline-year-bar">
              <span className="timeline-year">{event.year}</span>
              <span className="timeline-line" />
            </div>
            <div className="timeline-content">
              <h2 className="timeline-title">
                {locale === "th" ? event.titleTh : locale === "zh" ? event.titleZh : event.titleEn}
              </h2>
              <p className="timeline-body">
                {locale === "th" ? event.bodyTh : locale === "zh" ? event.bodyZh : event.bodyEn}
              </p>
              {event.photos.length > 0 && (
                <div className="timeline-photos">
                  {event.photos.map((photo, j) => (
                    <img
                      key={j}
                      src={`/photos/${photo}`}
                      alt={locale === "th" ? (event.captionTh ?? event.titleTh) : locale === "zh" ? (event.captionZh ?? event.titleZh) : (event.captionEn ?? event.titleEn)}
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
          </div>
        ))}
      </section>

      {/* ─── CLOSING ─── */}
      <section className="section story-closing">
        <div className="callout-card">
          <p className="eyebrow">{locale === "th" ? "ปัจจุบัน" : locale === "zh" ? "现在" : "Now"}</p>
          <h2>
            {locale === "th"
              ? "37 เมืองรับรอง. 12 เขตส่งเสริมที่เราคัดมานำเสนอ. 1 ดัชนีที่วัดความจริง."
              : locale === "zh"
                ? "37 座认证城市，12 个本版收录推广区，1 套衡量现实的指数。"
                : "37 certified cities. 12 profiled promotion zones. 1 index that measures reality."}
          </h2>
          <p>
            {locale === "th"
              ? "เป้าหมายระดับประเทศคือ 105 เมืองอัจฉริยะภายในปี 2570 ส่วนเวอร์ชันนี้ติดตาม 49 เมืองที่เรามีหลักฐานพอจะเปรียบเทียบได้ — ไม่ใช่ด้วยแผนที่สวยหรู แต่ด้วยผลลัพธ์จริงที่ประชาชนสัมผัสได้"
              : locale === "zh"
                ? "全国目标是到 2027 年达到 105 座智慧城市；而这一版只追踪 49 座我们手上有足够证据可比较的城市。不是看谁 PPT 做得漂亮，而是看市民能不能真实感受到结果。"
                : "The national target is 105 smart cities by 2027. This release tracks the 49 cities where we have enough evidence to compare outcomes honestly — not by beautiful plans, but by results citizens can actually feel."}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/rankings")}>
            {locale === "th" ? "ดูอันดับ" : locale === "zh" ? "查看排名" : "See the rankings"}
          </button>
        </div>
      </section>
    </>
  );
}
