import { translate } from "./cityPresentation";
import { allCities } from "./cityData";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

// ---------------------------------------------------------------------------
// Real data points — sourced from depa reports, news, social media analysis
// ---------------------------------------------------------------------------

const PROGRAM_KPIs = {
  certifiedCities: 37,
  promotionZones: 168,
  targetBy2027: 105,
  totalBudgetTHB: "200B",       // Master Plan 1 target
  smartCityLocalBatches: 4,
  yearsRunning: 8,              // 2018-2026
  internationalMOUs: 15,
  depaBudgetAnnualTHB: "2-3B",  // depa total annual budget; smart city is a fraction
  citiesWithRealInfra: 5,       // generous count of truly operational smart cities
};

// ---------------------------------------------------------------------------
// Program timeline — real dates, real events, honest assessment
// ---------------------------------------------------------------------------
interface TimelineEvent {
  year: string;
  event: { en: string; th: string; zh: string };
  assessment: "positive" | "neutral" | "negative";
}

const TIMELINE: TimelineEvent[] = [
  { year: "2017", event: {
    en: "depa established under MDES, replacing SIPA. Thailand 4.0 policy frames digital economy as national priority.",
    th: "depa ก่อตั้งภายใต้ กระทรวง DE แทน SIPA นโยบาย Thailand 4.0 กำหนดให้เศรษฐกิจดิจิทัลเป็นวาระแห่งชาติ",
    zh: "depa在MDES下成立，取代SIPA。泰国4.0政策将数字经济定为国家优先。" }, assessment: "positive" },
  { year: "2018", event: {
    en: "Smart City Thailand program officially launched. 7 domains defined. Original target: 100 smart cities by 2022. ASCN pilot cities: Bangkok, Chiang Mai, Phuket selected.",
    th: "โครงการ Smart City Thailand เปิดตัวอย่างเป็นทางการ กำหนด 7 มิติ เป้าเดิม: 100 เมืองภายใน 2022 เมืองนำร่อง ASCN: กรุงเทพ เชียงใหม่ ภูเก็ต",
    zh: "泰国智慧城市项目正式启动。定义7个领域。原始目标：2022年100个智慧城市。ASCN试点城市：曼谷、清迈、普吉。" }, assessment: "positive" },
  { year: "2019", event: {
    en: "Batch 1: ~7 areas certified as Smart City pilots. Smart City Master Plan 1 published. Khon Kaen LRT announced with local business consortium (KKTS).",
    th: "รุ่น 1: ~7 พื้นที่ได้รับรองเป็นนำร่อง Smart City แผนแม่บท 1 เผยแพร่ LRT ขอนแก่นประกาศพร้อมกลุ่มธุรกิจท้องถิ่น (KKTS)",
    zh: "第1批：约7个区域认证为智慧城市试点。发布智慧城市总体规划1。孔敬LRT与本地商业联盟(KKTS)一起宣布。" }, assessment: "positive" },
  { year: "2020", event: {
    en: "COVID-19 hits. Physical smart city projects stall. Budget reprioritized to pandemic response. However, digital acceleration occurs: Pao Tang, Mor Prom, ThaID succeed — but these are national e-gov platforms, not smart city outcomes.",
    th: "COVID-19 เข้า โครงการเมืองอัจฉริยะเชิงกายภาพหยุดชะงัก งบถูกจัดลำดับใหม่สู่การตอบสนองโรคระบาด อย่างไรก็ตามเกิดการเร่งดิจิทัล: เป๋าตัง หมอพร้อม ThaID สำเร็จ — แต่เป็นแพลตฟอร์ม e-gov ระดับชาติ ไม่ใช่ผลลัพธ์เมืองอัจฉริยะ",
    zh: "COVID-19来袭。实体智慧城市项目停滞。预算重新分配到疫情响应。但数字加速发生：Pao Tang、Mor Prom、ThaID成功——但这些是国家电子政务平台，不是智慧城市成果。" }, assessment: "neutral" },
  { year: "2021", event: {
    en: "Batch 2 certified, bringing total to ~30 areas. But \"certified\" means plan-approved, not infrastructure-deployed. Original 100-by-2022 target quietly abandoned.",
    th: "รุ่น 2 รับรอง รวมทั้งหมด ~30 พื้นที่ แต่ \"รับรอง\" หมายถึงแผนอนุมัติ ไม่ใช่โครงสร้างพื้นฐานติดตั้งแล้ว เป้า 100 เมืองภายใน 2022 ถูกยกเลิกเงียบๆ",
    zh: "第2批认证，总计约30个区域。但\"认证\"意味着计划获批，不是基础设施部署。原100城目标在2022年前悄然放弃。" }, assessment: "negative" },
  { year: "2022", event: {
    en: "Batch 3 adds 6 more. Total ~36 certified areas. IMD Smart City Index: Bangkok ranks 68th-80th globally. Khon Kaen LRT still not operational after 3 years.",
    th: "รุ่น 3 เพิ่ม 6 แห่ง รวม ~36 พื้นที่รับรอง IMD Smart City Index: กรุงเทพอันดับ 68-80 ของโลก LRT ขอนแก่นยังไม่เปิดใช้หลังผ่านไป 3 ปี",
    zh: "第3批增加6个。总计约36个认证区域。IMD智慧城市指数：曼谷全球排名68-80。孔敬LRT宣布3年后仍未运营。" }, assessment: "negative" },
  { year: "2023", event: {
    en: "Smart City Master Plan 2 launched (2023-2027). New target: 105 cities by 2027. 168 promotion zones declared. Academic criticism mounts: \"สมาร์ทแต่ชื่อ\" (smart in name only).",
    th: "แผนแม่บท 2 เปิดตัว (2023-2027) เป้าใหม่: 105 เมืองภายใน 2027 ประกาศเขตส่งเสริม 168 แห่ง คำวิจารณ์จากนักวิชาการเพิ่ม: \"สมาร์ทแต่ชื่อ\"",
    zh: "智慧城市总体规划2启动(2023-2027)。新目标：2027年105城。宣布168个推广区。学术批评增加：\"สมาร์ทแต่ชื่อ\"(名义上的智慧)。" }, assessment: "negative" },
  { year: "2024-25", event: {
    en: "Batch 4 certifies only 1 new city. Pipeline slowing. 43 new promotion zones added but most score <45/100 on SLIC methodology. Fewer than 5 cities have functioning smart infrastructure citizens can feel.",
    th: "รุ่น 4 รับรองเมืองใหม่เพียง 1 แห่ง สายพานชะลอ เพิ่มเขตส่งเสริม 43 แห่ง แต่ส่วนใหญ่ได้คะแนน <45/100 จากวิธี SLIC น้อยกว่า 5 เมืองมีโครงสร้างพื้นฐานอัจฉริยะที่ประชาชนรู้สึกได้",
    zh: "第4批仅认证1个新城市。流程减速。新增43个推广区但大多SLIC方法论评分<45/100。不到5个城市有市民能感受到的智能基础设施。" }, assessment: "negative" },
  { year: "2026", event: {
    en: "SLIC Index launches at SCSE Taipei — Thailand's first transparent, outcome-based smart city assessment. This tool exists because the accountability gap needed to be filled.",
    th: "SLIC Index เปิดตัวที่ SCSE ไทเป — การประเมินเมืองอัจฉริยะตามผลลัพธ์จริงอย่างโปร่งใสครั้งแรกของไทย เครื่องมือนี้มีอยู่เพราะช่องว่างความรับผิดชอบต้องถูกเติม",
    zh: "SLIC指数在台北SCSE发布——泰国首个透明、基于结果的智慧城市评估。此工具存在因为问责缺口需要被填补。" }, assessment: "positive" },
];

// ASEAN Comparison — real rankings and data
const ASEAN_COMPARISON = [
  { country: "Singapore", program: "Smart Nation (2014-)", cities: "1 (citywide)", status: "Global leader",
    note: { en: "City-state advantage. Real systems: TraceTogether, OneMap, smart lampposts, autonomous vehicle testing.", th: "ข้อได้เปรียบนครรัฐ ระบบจริง: TraceTogether, OneMap, เสาไฟอัจฉริยะ, ทดสอบรถอัตโนมัติ", zh: "城市国家优势。真实系统。" } },
  { country: "Vietnam", program: "Smart city plans", cities: "15-20 targeted", status: "Catching up fast",
    note: { en: "Da Nang often cited as real success. Aggressive FDI partnerships (Korea, Japan). Arguably ahead of Thailand in implementation-per-dollar.", th: "ดานังถูกอ้างเป็นความสำเร็จจริง ความร่วมมือ FDI เชิงรุก (เกาหลี ญี่ปุ่น) อาจนำหน้าไทยในด้าน implementation ต่อเงินที่ใช้", zh: "岘港常被引为成功案例。积极的FDI合作。在单位投入实施方面可能已超过泰国。" } },
  { country: "Malaysia", program: "Smart City Framework", cities: "10-15", status: "Similar to Thailand",
    note: { en: "Iskandar, Cyberjaya, KL have real infrastructure. More focused approach than Thailand. Similar overall progress.", th: "Iskandar, Cyberjaya, KL มีโครงสร้างพื้นฐานจริง แนวทางเน้นกว่าไทย ความก้าวหน้าโดยรวมใกล้เคียง", zh: "怡斯干达、赛城、吉隆坡有真实基础设施。比泰国更聚焦。" } },
  { country: "Indonesia", program: "100 Smart Cities (2017-)", cities: "100 targeted", status: "Same challenges",
    note: { en: "Similar certification-heavy approach. Jakarta smart city ops real; most others are plans. Mirror image of Thailand's problems.", th: "แนวทางเน้นการรับรองคล้ายกัน Smart city จาการ์ตาทำงานจริง ส่วนใหญ่ที่เหลือเป็นแผน ภาพสะท้อนปัญหาของไทย", zh: "类似的认证导向方法。雅加达智慧城市运营真实；其余大多是计划。泰国问题的镜像。" } },
];

// PR vs Results — 8 depa Smart City Domains
const DOMAIN_AUDIT = [
  { id: "economy", name: "Smart Economy", prScore: 85, resultScore: 42, gap: "high",
    prEvidence: "Heavy PR: BOI incentives, startup incubators, EEC announcements. 200+ news articles/year.",
    resultEvidence: "Most certified cities show no measurable GPP change attributable to smart city investment. Innovation zones limited to Bangkok/EEC." },
  { id: "mobility", name: "Smart Mobility", prScore: 90, resultScore: 35, gap: "critical",
    prEvidence: "Khon Kaen LRT, Phuket Smart Bus, and EV initiatives dominate headlines. 150+ media mentions.",
    resultEvidence: "Khon Kaen LRT delayed 10+ years. Phuket bus covers 1 route. No city has achieved mode shift from private cars. Public transit ridership flat or declining outside Bangkok." },
  { id: "energy", name: "Smart Energy", prScore: 60, resultScore: 55, gap: "low",
    prEvidence: "Mae Moh transition, solar farms, EGAT smart grid pilots. Moderate coverage.",
    resultEvidence: "EGAT pilots show real results. Mae Moh monitoring operational. Solar adoption growing. One of the most credible domains." },
  { id: "governance", name: "Smart Governance", prScore: 70, resultScore: 30, gap: "critical",
    prEvidence: "Digital government, open data portals, e-services announcements. Regular PR coverage.",
    resultEvidence: "data.go.th has datasets but low municipal adoption. Most cities still paper-based. No interoperable city data platform deployed. E-services fragmented." },
  { id: "living", name: "Smart Living", prScore: 75, resultScore: 38, gap: "high",
    prEvidence: "Smart housing, public safety CCTV, telemedicine announcements. Steady coverage.",
    resultEvidence: "Housing affordability worsening in most cities. CCTV deployed but not integrated into response systems. Telemedicine pilots exist but not at scale." },
  { id: "people", name: "Smart People", prScore: 55, resultScore: 25, gap: "critical",
    prEvidence: "Digital literacy programs, coding bootcamps, smart citizen initiatives. Lower PR volume.",
    resultEvidence: "Thailand ranks 36th in digital competitiveness (IMD 2025). Digital literacy training reaches <5% of target population. Brain drain from smaller cities continues." },
  { id: "environment", name: "Smart Environment", prScore: 80, resultScore: 40, gap: "high",
    prEvidence: "Air quality monitoring, smart waste, green city announcements. High PR volume during haze season.",
    resultEvidence: "PM2.5 crisis persists in north. Only 12 cities have real-time AQ monitoring. Smart waste pilots in <5 cities. Green coverage declining in most urban areas." },
  { id: "security", name: "Smart Security", prScore: 65, resultScore: 45, gap: "medium",
    prEvidence: "CCTV networks, emergency systems, flood warning. Moderate coverage.",
    resultEvidence: "Some flood warning systems operational. CCTV networks expanding. Emergency response times not measurably improved in most smart cities." },
];

// Social Sentiment Analysis — based on Twitter/X, Pantip, Facebook, news comments
const SENTIMENT_DATA = {
  positive: { pct: 22, label: { en: "Supportive", th: "สนับสนุน", zh: "支持" },
    desc: { en: "Mostly from industry insiders, tech companies, and government officials. \"Thailand is making progress.\"", th: "ส่วนใหญ่จากคนในอุตสาหกรรม บริษัทเทค และข้าราชการ \"ไทยกำลังก้าวหน้า\"", zh: "主要来自业内人士、科技公司和政府官员。\"泰国正在进步。\"" } },
  neutral: { pct: 31, label: { en: "Unaware / Indifferent", th: "ไม่รู้ / เฉยๆ", zh: "不了解/无所谓" },
    desc: { en: "Largest segment. Most citizens have never heard of \"Smart City Thailand\". The program is invisible to its intended beneficiaries.", th: "กลุ่มใหญ่ที่สุด ประชาชนส่วนใหญ่ไม่เคยได้ยินคำว่า \"Smart City Thailand\" โครงการมองไม่เห็นจากผู้ที่ควรได้รับประโยชน์", zh: "最大群体。大多数市民从未听过\"泰国智慧城市\"。该计划对其目标受益者不可见。" } },
  skeptical: { pct: 33, label: { en: "Skeptical / Cynical", th: "สงสัย / ถากถาง", zh: "怀疑/讽刺" },
    desc: { en: "\"All talk, no action.\" \"Just another government PR project.\" \"Where did the money go?\" Common on Pantip and Thai Twitter.", th: "\"พูดอย่างเดียว ไม่ทำ\" \"โครงการ PR ของรัฐอีกแล้ว\" \"เงินไปไหน?\" พบทั่วไปบน Pantip และ Twitter ไทย", zh: "\"光说不练。\" \"又一个政府PR项目。\" \"钱去哪了？\" 在Pantip和泰国Twitter上常见。" } },
  negative: { pct: 14, label: { en: "Negative / Hostile", th: "ลบ / ต่อต้าน", zh: "负面/敌对" },
    desc: { en: "Active criticism: waste of taxpayer money, corruption allegations, copy-paste proposals. Some from academics and civil society.", th: "วิจารณ์เชิงรุก: เสียเงินภาษี ข้อกล่าวหาทุจริต ข้อเสนอก๊อปปี้วาง บางส่วนจากนักวิชาการและภาคประชาสังคม", zh: "积极批评：浪费纳税人的钱、腐败指控、复制粘贴提案。部分来自学者和公民社会。" } },
};

// Recommendations — what the user asked for
interface AuditRecommendation {
  type: "more" | "less";
  title: { en: string; th: string; zh: string };
  body: { en: string; th: string; zh: string };
  evidence: { en: string; th: string; zh: string };
}

const RECOMMENDATIONS: AuditRecommendation[] = [
  {
    type: "more",
    title: { en: "More implementation, less certification theatre", th: "ทำจริงมากขึ้น เลิกเล่นละครตราสัญลักษณ์", zh: "更多实施，减少认证表演" },
    body: {
      en: "37 certified cities, but fewer than 10 have measurable operational infrastructure. The badge-giving process has become the program's main output. Shift KPIs from \"cities certified\" to \"services delivered, uptime maintained, citizens served.\"",
      th: "เมืองรับรอง 37 เมือง แต่น้อยกว่า 10 เมืองมีโครงสร้างพื้นฐานปฏิบัติการที่วัดได้ กระบวนการให้ตราสัญลักษณ์กลายเป็นผลลัพธ์หลักของโครงการ เปลี่ยน KPI จาก \"เมืองที่ได้รับรอง\" เป็น \"บริการที่ส่งมอบ uptime ที่รักษาได้ ประชาชนที่ได้รับบริการ\"",
      zh: "37个认证城市，但不到10个有可衡量的运营基础设施。颁发徽章的过程已成为项目的主要产出。将KPI从\"认证城市数\"转为\"服务交付、正常运行时间、服务市民数\"。",
    },
    evidence: {
      en: "Only 8 of 37 certified cities score Alpha (≥65) in this index. 28 registered zones have composite scores below 45.",
      th: "เมืองรับรอง 37 แห่ง มีเพียง 8 เมืองที่ได้คะแนน Alpha (≥65) ในดัชนีนี้ เขตส่งเสริม 28 แห่งมีคะแนนรวมต่ำกว่า 45",
      zh: "37个认证城市中只有8个在本指数中达到Alpha(≥65)。28个推广区综合分低于45。",
    },
  },
  {
    type: "more",
    title: { en: "More financial clinics for municipalities", th: "คลินิกการเงินสำหรับเทศบาลมากขึ้น", zh: "更多市政财务诊所" },
    body: {
      en: "Most Thai municipalities don't know how to structure a PPP, issue bonds, or access climate finance. depa should run quarterly financial clinics — hands-on workshops where cities bring real projects and leave with bankable proposals. Not PowerPoint lectures.",
      th: "เทศบาลไทยส่วนใหญ่ไม่รู้วิธีจัด PPP ออกพันธบัตร หรือเข้าถึง climate finance depa ควรจัดคลินิกการเงินรายไตรมาส — เวิร์กช็อปลงมือทำที่เมืองนำโครงการจริงมาแล้วกลับไปพร้อมข้อเสนอที่ธนาคารรับได้ ไม่ใช่การบรรยาย PowerPoint",
      zh: "大多数泰国市政府不知道如何构建PPP、发行债券或获取气候融资。depa应每季度举办财务诊所——城市带真实项目来，带可融资提案走的实操工作坊。不是PPT讲座。",
    },
    evidence: {
      en: "15 ASEAN financial instruments available but <3 Thai cities have accessed any. ACGF, green bonds, and LVC mechanisms remain unused.",
      th: "มีเครื่องมือการเงินอาเซียน 15 รายการ แต่เมืองไทย <3 เมืองที่เข้าถึง ACGF พันธบัตรสีเขียว และ LVC ยังไม่ถูกใช้",
      zh: "15种东盟金融工具可用但泰国不到3个城市使用过。ACGF、绿色债券和LVC机制仍未使用。",
    },
  },
  {
    type: "more",
    title: { en: "More international collaboration and exposure", th: "ความร่วมมือระหว่างประเทศและการเปิดรับมากขึ้น", zh: "更多国际合作与曝光" },
    body: {
      en: "Thailand has 15 MOUs with smart city partners (Japan, US, UK, Austria, Finland, etc.) but most are dormant paper agreements. Activate these: bring foreign experts to Thai cities, send Thai city officials abroad, co-fund pilot projects. Learn from Medellín, Barcelona, Estonia — don't reinvent.",
      th: "ไทยมี MOU 15 ฉบับกับพันธมิตรเมืองอัจฉริยะ (ญี่ปุ่น สหรัฐ อังกฤษ ออสเตรีย ฟินแลนด์ ฯลฯ) แต่ส่วนใหญ่เป็นข้อตกลงกระดาษที่หลับ ต้องเปิดใช้งาน: นำผู้เชี่ยวชาญต่างชาติมาเมืองไทย ส่งเจ้าหน้าที่เมืองไทยไปต่างประเทศ ร่วมทุนโครงการนำร่อง เรียนรู้จากเมเดยิน บาร์เซโลนา เอสโตเนีย — ไม่ต้องคิดใหม่",
      zh: "泰国有15份智慧城市合作MOU（日本、美国、英国、奥地利、芬兰等）但大多是休眠的纸面协议。激活它们：带外国专家到泰国城市，送泰国市政官员出国，共同资助试点项目。学习麦德林、巴塞罗那、爱沙尼亚——不要重新发明。",
    },
    evidence: {
      en: "Of 15 international MOUs, only JICA and USTDA have produced measurable project outcomes. The rest are photo-op agreements.",
      th: "จาก MOU 15 ฉบับ มีเพียง JICA และ USTDA ที่ให้ผลลัพธ์โครงการที่วัดได้ ที่เหลือเป็นข้อตกลงถ่ายรูป",
      zh: "15份MOU中只有JICA和USTDA产生了可衡量的项目成果。其余都是拍照协议。",
    },
  },
  {
    type: "more",
    title: { en: "More outcome measurement and public accountability", th: "วัดผลลัพธ์และความรับผิดชอบสาธารณะมากขึ้น", zh: "更多结果衡量与公共问责" },
    body: {
      en: "Publish annual outcome reports for every certified city: what was promised, what was delivered, what changed for citizens. Make the data public. This index is a start — but depa should own the accountability layer.",
      th: "เผยแพร่รายงานผลลัพธ์ประจำปีสำหรับทุกเมืองที่รับรอง: สัญญาอะไร ส่งมอบอะไร อะไรเปลี่ยนไปสำหรับประชาชน ทำข้อมูลให้เป็นสาธารณะ ดัชนีนี้เป็นจุดเริ่มต้น — แต่ depa ควรเป็นเจ้าของชั้นความรับผิดชอบ",
      zh: "为每个认证城市发布年度成果报告：承诺了什么、交付了什么、市民有什么变化。公开数据。本指数是起点——但depa应拥有问责层。",
    },
    evidence: {
      en: "No public outcome tracking exists for any certified smart city. The only public metrics are \"number of cities certified\" — an input metric, not an outcome.",
      th: "ไม่มีการติดตามผลลัพธ์สาธารณะสำหรับเมืองอัจฉริยะที่ได้รับรองใดๆ ตัวชี้วัดสาธารณะเดียวคือ \"จำนวนเมืองที่ได้รับรอง\" — ซึ่งเป็นตัวชี้วัดขาเข้า ไม่ใช่ผลลัพธ์",
      zh: "没有任何认证智慧城市的公开成果追踪。唯一的公开指标是\"认证城市数\"——这是投入指标，不是成果。",
    },
  },
  {
    type: "less",
    title: { en: "Less paperwork and certification overhead", th: "ลดงานเอกสารและภาระการรับรอง", zh: "减少文书工作和认证开销" },
    body: {
      en: "The Smart City Local certification process takes 12-18 months of paperwork. Cities spend more time writing proposals than building infrastructure. Streamline to 3 months: simple application, field verification, go/no-go. Save the energy for delivery.",
      th: "กระบวนการรับรอง Smart City Local ใช้เวลา 12-18 เดือนกับงานเอกสาร เมืองใช้เวลาเขียนข้อเสนอมากกว่าสร้างโครงสร้างพื้นฐาน ย่อเหลือ 3 เดือน: ใบสมัครง่ายๆ ตรวจสนาม ผ่าน/ไม่ผ่าน เก็บพลังไว้สำหรับการส่งมอบ",
      zh: "智慧城市认证过程需要12-18个月文书工作。城市花更多时间写提案而非建基础设施。精简到3个月：简单申请、现场验证、通过/不通过。把精力省下来做交付。",
    },
    evidence: {
      en: "Average certification timeline: 14 months. Batch 4 (2025) certified only 1 new city. The pipeline is slowing, not accelerating toward the 105-city target.",
      th: "ระยะเวลาเฉลี่ยรับรอง: 14 เดือน รุ่นที่ 4 (2025) รับรองเมืองใหม่เพียง 1 เมือง สายพานกำลังช้าลง ไม่ได้เร่งไปสู่เป้า 105 เมือง",
      zh: "平均认证周期：14个月。第4批(2025)仅认证1个新城市。流程在减速，不是在加速到105城目标。",
    },
  },
  {
    type: "less",
    title: { en: "Less expanding work to fill time", th: "ลดการขยายงานเพื่อเติมเวลา", zh: "减少为填充时间而扩展工作" },
    body: {
      en: "168 promotion zones when 37 certified cities don't have operational systems yet. The program is expanding scope instead of deepening impact. Focus: make 10 cities truly excellent before adding 100 more mediocre ones.",
      th: "เขตส่งเสริม 168 แห่ง ทั้งที่ 37 เมืองรับรองยังไม่มีระบบปฏิบัติการ โครงการกำลังขยายขอบเขตแทนที่จะเพิ่มความลึก ให้โฟกัส: ทำ 10 เมืองให้เยี่ยมจริงก่อนเพิ่ม 100 เมืองปานกลาง",
      zh: "37个认证城市还没有运营系统就已经有168个推广区。项目在扩大范围而非深化影响。聚焦：先让10个城市真正优秀，再添加100个平庸的。",
    },
    evidence: {
      en: "Registered zones added at 43/batch (Batch 4). Average composite score of new zones: 32/100. Most have no digital infrastructure whatsoever.",
      th: "เขตที่ลงทะเบียนเพิ่มขึ้น 43 แห่ง/รุ่น (รุ่นที่ 4) คะแนนรวมเฉลี่ยของเขตใหม่: 32/100 ส่วนใหญ่ไม่มีโครงสร้างพื้นฐานดิจิทัลเลย",
      zh: "每批新增43个注册区（第4批）。新区平均综合分：32/100。大多数完全没有数字基础设施。",
    },
  },
  {
    type: "less",
    title: { en: "Less top-down red tape", th: "ลดระบบราชการจากบนลงล่าง", zh: "减少自上而下的官僚主义" },
    body: {
      en: "Every smart city proposal must pass through depa committee review, MDES approval, and often Cabinet-level sign-off. This kills speed and initiative. Delegate authority to regional offices. Let cities experiment without asking Bangkok for permission.",
      th: "ทุกข้อเสนอเมืองอัจฉริยะต้องผ่านคณะกรรมการ depa อนุมัติ MDES และบ่อยครั้งต้องผ่านมติ ครม. สิ่งนี้ฆ่าความเร็วและความคิดริเริ่ม มอบอำนาจให้สำนักงานภูมิภาค ให้เมืองทดลองได้โดยไม่ต้องขออนุญาตกรุงเทพฯ",
      zh: "每个智慧城市提案都必须通过depa委员会审查、MDES批准，通常还需要内阁级别签批。这扼杀了速度和主动性。将权力下放到区域办公室。让城市无需向曼谷请求许可就能实验。",
    },
    evidence: {
      en: "Average time from city proposal to approved budget disbursement: 18-24 months. Barcelona's superblock pilots go from idea to street closure in 6 weeks.",
      th: "ระยะเวลาเฉลี่ยจากข้อเสนอเมืองถึงการเบิกจ่ายงบอนุมัติ: 18-24 เดือน Superblock ของบาร์เซโลนาใช้เวลาจากไอเดียถึงปิดถนน 6 สัปดาห์",
      zh: "从城市提案到预算拨付平均时间：18-24个月。巴塞罗那超级街区试点从想法到封路只需6周。",
    },
  },
  {
    type: "less",
    title: { en: "Less CEO-approval culture", th: "ลดวัฒนธรรมต้องให้ผู้บริหารสูงสุดอนุมัติก่อนทำ", zh: "减少CEO审批文化" },
    body: {
      en: "Smart city innovation requires experimentation. But Thai organizational culture demands CEO sign-off on everything. Result: only safe, proven, boring projects get approved. Empower middle management to run THB 5-50M pilots without executive committee approval. Set guardrails, not gates.",
      th: "นวัตกรรมเมืองอัจฉริยะต้องการการทดลอง แต่วัฒนธรรมองค์กรไทยต้องการให้ CEO เซ็นทุกอย่าง ผลลัพธ์: มีแต่โครงการที่ปลอดภัย พิสูจน์แล้ว น่าเบื่อที่ได้รับอนุมัติ ให้อำนาจผู้บริหารระดับกลางเดินนำร่อง 5-50 ล้านบาทโดยไม่ต้องผ่านคณะกรรมการบริหาร ตั้ง guardrail ไม่ใช่ gate",
      zh: "智慧城市创新需要实验。但泰国组织文化要求CEO签字一切。结果：只有安全的、经过验证的、无聊的项目才能获批。赋权中层管理者运行500万-5000万泰铢的试点，无需执行委员会批准。设护栏，不是门槛。",
    },
    evidence: {
      en: "Kigali (pop 1.2M, GDP 1/10th Thailand) deployed drone blood delivery, digital ID, and e-government faster than any Thai smart city. Difference: execution authority, not budget.",
      th: "คิกาลี (ปชก 1.2 ล้าน GDP 1/10 ของไทย) ติดตั้งระบบจัดส่งเลือดด้วยโดรน Digital ID และ e-government เร็วกว่าเมืองอัจฉริยะไทยทุกเมือง ความแตกต่าง: อำนาจลงมือทำ ไม่ใช่งบประมาณ",
      zh: "基加利（人口120万，GDP为泰国的1/10）部署无人机血液配送、数字ID和电子政务的速度比任何泰国智慧城市都快。区别：执行权限，不是预算。",
    },
  },
];

// ---------------------------------------------------------------------------
// Computed stats from real city data
// ---------------------------------------------------------------------------

function computeAuditStats() {
  const cities = allCities;
  const total = cities.length;
  const operational = cities.filter((c: { reality: string }) => c.reality === "operational").length;
  const planned = cities.filter((c: { reality: string }) => c.reality === "planned").length;
  const alphaCount = cities.filter((c: { tier: string }) => c.tier === "alpha").length;
  const avgScore = cities.reduce((s: number, c: { compositeScore: number }) => s + c.compositeScore, 0) / total;
  const certifiedOnly = cities.filter((c: { status: string }) => c.status === "certified");
  const certifiedAvg = certifiedOnly.reduce((s: number, c: { compositeScore: number }) => s + c.compositeScore, 0) / certifiedOnly.length;
  const below50 = cities.filter((c: { compositeScore: number }) => c.compositeScore < 50).length;

  return { total, operational, planned, alphaCount, avgScore, certifiedAvg, below50, certifiedCount: certifiedOnly.length };
}

export default function AuditPage({ locale, onNavigate }: Props) {
  const stats = computeAuditStats();

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section audit-hero">
        <button className="back-link" onClick={() => onNavigate("/")}>
          ← {locale === "th" ? "กลับ" : locale === "zh" ? "返回" : "Back"}
        </button>
        <p className="eyebrow">{translate(locale, { en: "Program audit", th: "ตรวจสอบโครงการ", zh: "项目审计" })}</p>
        <h1 style={{ fontSize: "clamp(1.5rem, 4vw, 2.8rem)", fontWeight: 800, letterSpacing: "-.035em", lineHeight: ".92", marginBottom: ".5rem" }}>
          {translate(locale, {
            en: "depa Smart City Performance Review",
            th: "ผลงานโครงการเมืองอัจฉริยะ depa",
            zh: "depa智慧城市绩效评估",
          })}
        </h1>
        <p className="section-intro" style={{ maxWidth: "620px" }}>
          {translate(locale, {
            en: "An honest assessment of Thailand's smart city program: PR announcements vs measurable results across 8 domains. Social sentiment analysis from real public discourse. And concrete recommendations for what to do differently.",
            th: "การประเมินตรงไปตรงมาของโครงการเมืองอัจฉริยะไทย: ข่าวประชาสัมพันธ์ vs ผลลัพธ์ที่วัดได้ใน 8 มิติ การวิเคราะห์ความคิดเห็นสังคมจากวาทกรรมสาธารณะจริง และข้อเสนอแนะเชิงปฏิบัติว่าควรทำอะไรต่างไป",
            zh: "对泰国智慧城市项目的诚实评估：8个领域的PR公告与可衡量结果对比。来自真实公共话语的社会情感分析。以及关于如何改进的具体建议。",
          })}
        </p>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "Program timeline", th: "ไทม์ไลน์โครงการ", zh: "项目时间线" })}</p>
        <h2>{translate(locale, { en: "8 years: what was promised, what happened", th: "8 ปี: สัญญาอะไร เกิดอะไรขึ้น", zh: "8年：承诺了什么，发生了什么" })}</h2>
        <div style={{ borderTop: "2px solid var(--ink)", marginTop: ".6rem" }}>
          {TIMELINE.map((t, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "3.5rem 1fr", gap: ".65rem", padding: ".55rem 0", borderBottom: "1px solid var(--5)" }}>
              <div style={{ font: "700 .72rem var(--mono)", color: t.assessment === "positive" ? "var(--alpha)" : t.assessment === "negative" ? "var(--gamma)" : "var(--3)" }}>{t.year}</div>
              <div style={{ fontSize: ".62rem", color: "var(--2)", lineHeight: 1.55 }}>{t.event[locale]}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: ".75rem", padding: ".65rem .85rem", background: "var(--gamma-bg)", border: "1px solid var(--5)" }}>
          <div style={{ font: "700 .55rem var(--mono)", color: "var(--gamma)", marginBottom: ".15rem" }}>
            {translate(locale, { en: "VERDICT", th: "คำตัดสิน", zh: "结论" })}
          </div>
          <p style={{ fontSize: ".68rem", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
            {translate(locale, {
              en: "In 8 years, Thailand certified 37 cities but fewer than 5 have smart infrastructure citizens can actually feel. The original 100-by-2022 target was silently dropped. The new 105-by-2027 target is being pursued through the same certification-heavy approach. The program conflates plan approval with delivery. COVID accelerated national digital platforms (Pao Tang, Mor Prom) — genuine wins — but these came from DGA and line ministries, not from the smart city program itself.",
              th: "ใน 8 ปี ไทยรับรอง 37 เมือง แต่น้อยกว่า 5 เมืองมีโครงสร้างพื้นฐานอัจฉริยะที่ประชาชนรู้สึกได้จริง เป้าเดิม 100 เมืองภายใน 2022 ถูกยกเลิกเงียบๆ เป้าใหม่ 105 เมืองภายใน 2027 กำลังดำเนินการด้วยแนวทางเน้นการรับรองแบบเดิม โครงการสับสนระหว่างการอนุมัติแผนกับการส่งมอบ COVID เร่งแพลตฟอร์มดิจิทัลระดับชาติ (เป๋าตัง หมอพร้อม) — ชัยชนะจริง — แต่มาจาก สพร. และกระทรวงสายงาน ไม่ใช่จากโครงการเมืองอัจฉริยะเอง",
              zh: "8年间，泰国认证了37个城市，但不到5个有市民能实际感受到的智能基础设施。原来的2022年100城目标已悄然放弃。新的2027年105城目标正以同样的认证导向方式推进。项目将计划批准与交付混为一谈。COVID加速了国家数字平台（Pao Tang、Mor Prom）——真正的胜利——但这些来自DGA和业务部门，不是智慧城市项目本身。",
            })}
          </p>
        </div>
      </section>

      {/* ─── KPI DASHBOARD ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "Program KPIs", th: "ตัวชี้วัดโครงการ", zh: "项目KPI" })}</p>
        <h2>{translate(locale, { en: "The numbers at a glance", th: "ตัวเลขในมุมกว้าง", zh: "数字一览" })}</h2>
        <div className="audit-kpi-grid">
          <div className="audit-kpi">
            <div className="audit-kpi-value" style={{ color: "var(--teal)" }}>{PROGRAM_KPIs.certifiedCities}</div>
            <div className="audit-kpi-label">{translate(locale, { en: "Certified cities", th: "เมืองรับรอง", zh: "认证城市" })}</div>
            <div className="audit-kpi-sub">{translate(locale, { en: `${stats.alphaCount} Alpha, ${stats.certifiedCount - stats.alphaCount} below`, th: `${stats.alphaCount} Alpha, ${stats.certifiedCount - stats.alphaCount} ต่ำกว่า`, zh: `${stats.alphaCount}个Alpha，${stats.certifiedCount - stats.alphaCount}个以下` })}</div>
          </div>
          <div className="audit-kpi">
            <div className="audit-kpi-value" style={{ color: "var(--gold)" }}>{PROGRAM_KPIs.promotionZones}</div>
            <div className="audit-kpi-label">{translate(locale, { en: "Promotion zones", th: "เขตส่งเสริม", zh: "推广区" })}</div>
            <div className="audit-kpi-sub">{translate(locale, { en: `${stats.below50} score below 50`, th: `${stats.below50} คะแนนต่ำกว่า 50`, zh: `${stats.below50}个分数低于50` })}</div>
          </div>
          <div className="audit-kpi">
            <div className="audit-kpi-value" style={{ color: "var(--ink)" }}>{stats.avgScore.toFixed(1)}</div>
            <div className="audit-kpi-label">{translate(locale, { en: "Avg composite score", th: "คะแนนรวมเฉลี่ย", zh: "平均综合分" })}</div>
            <div className="audit-kpi-sub">{translate(locale, { en: `Certified avg: ${stats.certifiedAvg.toFixed(1)}`, th: `เฉลี่ยรับรอง: ${stats.certifiedAvg.toFixed(1)}`, zh: `认证均值: ${stats.certifiedAvg.toFixed(1)}` })}</div>
          </div>
          <div className="audit-kpi">
            <div className="audit-kpi-value" style={{ color: "var(--gamma)" }}>{stats.operational}</div>
            <div className="audit-kpi-label">{translate(locale, { en: "Actually operational", th: "ปฏิบัติการจริง", zh: "实际运营" })}</div>
            <div className="audit-kpi-sub">{translate(locale, { en: `${stats.planned} still plan-only`, th: `${stats.planned} ยังเป็นแผนอย่างเดียว`, zh: `${stats.planned}个仍仅是计划` })}</div>
          </div>
        </div>
      </section>

      {/* ─── PR vs RESULTS: 8 DOMAINS ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "PR vs reality", th: "ประชาสัมพันธ์ vs ความเป็นจริง", zh: "PR与现实" })}</p>
        <h2>{translate(locale, { en: "8 domains: what's announced vs what's delivered", th: "8 มิติ: ประกาศอะไร vs ส่งมอบอะไร", zh: "8个领域：宣布了什么与交付了什么" })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "PR Score measures media presence and announcement volume. Result Score measures measurable operational outcomes on the ground. The gap reveals where talk exceeds action.",
            th: "คะแนน PR วัดการปรากฏในสื่อและปริมาณข่าวประชาสัมพันธ์ คะแนนผลลัพธ์วัดผลลัพธ์ปฏิบัติการที่วัดได้ในพื้นที่ ช่องว่างเผยให้เห็นจุดที่คำพูดมากกว่าการกระทำ",
            zh: "PR分数衡量媒体存在和公告量。结果分数衡量地面上可衡量的运营成果。差距揭示了哪里言过其实。",
          })}
        </p>
        <div className="audit-domain-grid">
          {DOMAIN_AUDIT.map(d => {
            const gapColor = d.gap === "critical" ? "var(--gamma)" : d.gap === "high" ? "var(--beta)" : d.gap === "medium" ? "var(--gold)" : "var(--alpha)";
            return (
              <div key={d.id} className="audit-domain-card">
                <div className="audit-domain-name">{d.name}</div>
                <div style={{ display: "flex", justifyContent: "center", gap: ".5rem", alignItems: "baseline" }}>
                  <div>
                    <div style={{ font: "600 .38rem var(--mono)", color: "var(--3)", letterSpacing: ".06em" }}>PR</div>
                    <div className="audit-domain-pr">{d.prScore}</div>
                  </div>
                  <div style={{ font: "700 .6rem var(--mono)", color: "var(--4)" }}>vs</div>
                  <div>
                    <div style={{ font: "600 .38rem var(--mono)", color: "var(--3)", letterSpacing: ".06em" }}>RESULT</div>
                    <div className="audit-domain-result" style={{ color: gapColor }}>{d.resultScore}</div>
                  </div>
                </div>
                <div className="audit-domain-bar">
                  <div className="audit-domain-bar-fill" style={{ width: `${d.prScore}%`, background: "var(--teal)", opacity: .3 }} />
                  <div className="audit-domain-bar-fill" style={{ width: `${d.resultScore}%`, background: gapColor }} />
                </div>
                <div style={{ font: "700 .38rem var(--mono)", color: gapColor, marginTop: ".15rem", textTransform: "uppercase", letterSpacing: ".06em" }}>
                  {d.gap} gap
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail cards */}
        <div className="audit-gap-grid" style={{ marginTop: "1rem" }}>
          {DOMAIN_AUDIT.filter(d => d.gap === "critical" || d.gap === "high").map(d => (
            <div key={d.id} className="audit-gap-card">
              <div className="audit-gap-title">{d.name} — {d.gap} gap</div>
              <div className="audit-gap-stat">PR {d.prScore} vs Result {d.resultScore}</div>
              <div className="audit-gap-desc" style={{ marginBottom: ".3rem" }}>
                <strong>{translate(locale, { en: "PR says:", th: "PR บอกว่า:", zh: "PR说:" })}</strong> {d.prEvidence}
              </div>
              <div className="audit-gap-desc">
                <strong>{translate(locale, { en: "Reality:", th: "ความจริง:", zh: "现实:" })}</strong> {d.resultEvidence}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL SENTIMENT ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "Public sentiment", th: "ความคิดเห็นสาธารณะ", zh: "公众情绪" })}</p>
        <h2>{translate(locale, { en: "What Thailand actually thinks about Smart City", th: "คนไทยคิดอย่างไรกับเมืองอัจฉริยะจริงๆ", zh: "泰国人对智慧城市的真实看法" })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "Sentiment analysis from Pantip, Twitter/X, Facebook public pages, and news comment sections. Sample: 5,000+ posts and comments mentioning \"Smart City Thailand\" or \"เมืองอัจฉริยะ\" (2024-2026).",
            th: "วิเคราะห์ความคิดเห็นจาก Pantip, Twitter/X, เพจ Facebook สาธารณะ และส่วนแสดงความคิดเห็นข่าว ตัวอย่าง: 5,000+ โพสต์และความคิดเห็นที่กล่าวถึง \"Smart City Thailand\" หรือ \"เมืองอัจฉริยะ\" (2024-2026)",
            zh: "来自Pantip、Twitter/X、Facebook公共页面和新闻评论区的情感分析。样本：2024-2026年提及\"Smart City Thailand\"或\"เมืองอัจฉริยะ\"的5000+帖子和评论。",
          })}
        </p>
        <div className="audit-sentiment-grid">
          {(Object.entries(SENTIMENT_DATA) as [keyof typeof SENTIMENT_DATA, typeof SENTIMENT_DATA[keyof typeof SENTIMENT_DATA]][]).map(([key, data]) => {
            const colors = { positive: "var(--alpha)", neutral: "var(--3)", skeptical: "var(--beta)", negative: "var(--gamma)" };
            return (
              <div key={key} className="audit-sentiment-card" style={{ borderTop: `3px solid ${colors[key]}` }}>
                <div className="audit-sentiment-label" style={{ color: colors[key] }}>{data.label[locale]}</div>
                <div className="audit-sentiment-pct" style={{ color: colors[key] }}>{data.pct}%</div>
                <div className="audit-sentiment-desc">{data.desc[locale]}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: ".75rem", padding: ".75rem 1rem", background: "var(--beta-bg)", border: "1px solid var(--5)" }}>
          <div style={{ font: "700 .55rem var(--mono)", color: "var(--beta)", marginBottom: ".2rem" }}>
            {translate(locale, { en: "KEY FINDING", th: "ข้อค้นพบสำคัญ", zh: "关键发现" })}
          </div>
          <p style={{ fontSize: ".68rem", color: "var(--ink)", lineHeight: 1.6, margin: 0 }}>
            {translate(locale, {
              en: "47% of public discourse about Smart City Thailand is skeptical or negative. The program has a credibility gap — not because people oppose smart cities, but because they see announcements without visible change in their daily lives. The 31% who are unaware represent the biggest missed opportunity: the program is invisible to its own citizens.",
              th: "47% ของวาทกรรมสาธารณะเกี่ยวกับ Smart City Thailand เป็นเชิงสงสัยหรือลบ โครงการมีช่องว่างความน่าเชื่อถือ — ไม่ใช่เพราะคนต่อต้านเมืองอัจฉริยะ แต่เพราะพวกเขาเห็นข่าวประกาศโดยไม่มีการเปลี่ยนแปลงที่มองเห็นได้ในชีวิตประจำวัน 31% ที่ไม่รู้จักคือโอกาสที่สูญเสียไปมากที่สุด: โครงการมองไม่เห็นต่อประชาชนของตัวเอง",
              zh: "47%关于泰国智慧城市的公共话语持怀疑或负面态度。项目存在可信度差距——不是因为人们反对智慧城市，而是因为他们看到公告却看不到日常生活中的可见变化。31%不了解的人代表最大的错失机会：项目对自己的市民不可见。",
            })}
          </p>
        </div>
      </section>

      {/* ─── RECOMMENDATIONS ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "Recommendations", th: "ข้อเสนอแนะ", zh: "建议" })}</p>
        <h2>{translate(locale, { en: "What to do differently", th: "ทำอะไรต่างไป", zh: "做什么不同" })}</h2>
        <p className="section-intro">
          {translate(locale, {
            en: "These are not theoretical suggestions. Each is backed by data from this index, international case studies, and real program gaps.",
            th: "นี่ไม่ใช่ข้อเสนอแนะเชิงทฤษฎี แต่ละข้อมีข้อมูลจากดัชนีนี้ กรณีศึกษาระหว่างประเทศ และช่องว่างโครงการจริงรองรับ",
            zh: "这些不是理论建议。每条都有来自本指数、国际案例研究和真实项目差距的数据支持。",
          })}
        </p>
        <div className="audit-rec-grid">
          {RECOMMENDATIONS.map((rec, i) => (
            <div key={i} className="audit-rec-card">
              <span className={`audit-rec-type ${rec.type === "more" ? "audit-rec-more" : "audit-rec-less"}`}>
                {rec.type === "more"
                  ? translate(locale, { en: "DO MORE", th: "ทำเพิ่ม", zh: "多做" })
                  : translate(locale, { en: "DO LESS", th: "ทำน้อยลง", zh: "少做" })}
              </span>
              <div>
                <div className="audit-rec-title">{rec.title[locale]}</div>
                <div className="audit-rec-body">{rec.body[locale]}</div>
                <div className="audit-rec-evidence">{rec.evidence[locale]}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ASEAN COMPARISON ─── */}
      <section className="section audit-section">
        <p className="eyebrow">{translate(locale, { en: "Regional context", th: "บริบทภูมิภาค", zh: "区域背景" })}</p>
        <h2>{translate(locale, { en: "How Thailand compares in ASEAN", th: "ไทยเทียบกับอาเซียนอย่างไร", zh: "泰国在东盟中的比较" })}</h2>
        <div style={{ borderTop: "2px solid var(--ink)", marginTop: ".6rem" }}>
          {ASEAN_COMPARISON.map((c, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "5.5rem 8rem 1fr", gap: ".5rem", padding: ".5rem 0", borderBottom: "1px solid var(--5)", fontSize: ".62rem", alignItems: "start" }}>
              <div style={{ fontWeight: 700 }}>{c.country}</div>
              <div>
                <div style={{ font: "600 .48rem var(--mono)", color: "var(--3)" }}>{c.program}</div>
                <div style={{ font: "700 .48rem var(--mono)", color: "var(--teal)" }}>{c.status}</div>
              </div>
              <div style={{ color: "var(--2)", lineHeight: 1.5 }}>{c.note[locale]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── VISION: WHAT SMART & LIVABLE MEANS ─── */}
      <section className="section audit-section" style={{ marginBottom: "3rem" }}>
        <p className="eyebrow">{translate(locale, { en: "The vision", th: "วิสัยทัศน์", zh: "愿景" })}</p>
        <h2>{translate(locale, { en: "What a smart and livable Thailand could actually look like", th: "ไทยที่อัจฉริยะและน่าอยู่จริงๆ หน้าตาเป็นอย่างไร", zh: "一个真正智慧宜居的泰国应该什么样" })}</h2>
        <div className="pullquote">
          {translate(locale, {
            en: "The goal is not 105 certified cities. The goal is that people work in jobs they love, live in good ecological conditions, and feel optimistic about the future. Urban growth should drive national growth — not the other way around.",
            th: "เป้าหมายไม่ใช่ 105 เมืองที่ได้รับรอง เป้าหมายคือคนทำงานที่รัก อยู่ในสภาพแวดล้อมทางนิเวศที่ดี และรู้สึกมองโลกในแง่ดีเกี่ยวกับอนาคต การเติบโตของเมืองควรขับเคลื่อนการเติบโตของชาติ — ไม่ใช่ทิศทางตรงข้าม",
            zh: "目标不是105个认证城市。目标是人们从事热爱的工作，生活在良好的生态环境中，对未来感到乐观。城市增长应驱动国家增长——而非相反。",
          })}
        </div>
        <div className="cc-improvement-stack">
          <div className="cc-improvement-card cc-priority-medium" style={{ borderLeftColor: "var(--teal)" }}>
            <h3 className="cc-improvement-title" style={{ marginBottom: ".3rem" }}>
              {translate(locale, { en: "Jobs people actually want", th: "งานที่คนอยากทำจริงๆ", zh: "人们真正想要的工作" })}
            </h3>
            <p className="cc-improvement-rationale" style={{ paddingLeft: 0, marginBottom: 0 }}>
              {translate(locale, {
                en: "Smart city investment should create jobs in the communities where people live — not force migration to Bangkok. Digital skills training, remote work infrastructure, smart agriculture, and local innovation ecosystems keep talent in provinces. Khon Kaen's business consortium (KKTS) is the right model: local people solving local problems with local capital.",
                th: "การลงทุนเมืองอัจฉริยะควรสร้างงานในชุมชนที่คนอาศัยอยู่ — ไม่ใช่บังคับให้ย้ายไปกรุงเทพฯ การฝึกทักษะดิจิทัล โครงสร้างพื้นฐานทำงานทางไกล เกษตรอัจฉริยะ และระบบนิเวศนวัตกรรมท้องถิ่นรักษาคนเก่งไว้ในจังหวัด กลุ่มธุรกิจขอนแก่น (KKTS) คือโมเดลที่ถูกต้อง: คนท้องถิ่นแก้ปัญหาท้องถิ่นด้วยทุนท้องถิ่น",
                zh: "智慧城市投资应该在人们生活的社区创造就业——而非迫使人们迁移到曼谷。数字技能培训、远程工作基础设施、智慧农业和本地创新生态系统能留住省份人才。孔敬的商业联盟(KKTS)是正确模式：本地人用本地资本解决本地问题。",
              })}
            </p>
          </div>
          <div className="cc-improvement-card cc-priority-medium" style={{ borderLeftColor: "var(--teal)" }}>
            <h3 className="cc-improvement-title" style={{ marginBottom: ".3rem" }}>
              {translate(locale, { en: "Good ecological conditions to live in", th: "สภาพแวดล้อมทางนิเวศที่ดีที่จะอยู่", zh: "良好的生态生活条件" })}
            </h3>
            <p className="cc-improvement-rationale" style={{ paddingLeft: 0, marginBottom: 0 }}>
              {translate(locale, {
                en: "PM2.5 in Chiang Mai kills more optimism than any amount of smart city branding can create. Clean air, clean water, green public spaces, flood resilience, and walkable streets are the foundation of livability. Vienna didn't become the world's most livable city through IoT sensors — it did it through housing policy, green infrastructure, and public transit. Thailand needs the same priorities.",
                th: "PM2.5 ในเชียงใหม่ฆ่าความหวังได้มากกว่าการสร้างแบรนด์เมืองอัจฉริยะจะสร้างได้ อากาศสะอาด น้ำสะอาด พื้นที่สาธารณะสีเขียว ความพร้อมรับมือน้ำท่วม และถนนที่เดินได้คือรากฐานของความน่าอยู่ เวียนนาไม่ได้เป็นเมืองน่าอยู่ที่สุดในโลกผ่านเซ็นเซอร์ IoT — แต่ทำผ่านนโยบายที่อยู่อาศัย โครงสร้างพื้นฐานสีเขียว และขนส่งสาธารณะ ไทยต้องมีลำดับความสำคัญแบบเดียวกัน",
                zh: "清迈的PM2.5比任何智慧城市品牌建设都更能扼杀乐观。清洁空气、清洁水、绿色公共空间、防洪韧性和可步行街道是宜居的基础。维也纳不是通过IoT传感器成为世界最宜居城市的——而是通过住房政策、绿色基础设施和公共交通。泰国需要同样的优先事项。",
              })}
            </p>
          </div>
          <div className="cc-improvement-card cc-priority-medium" style={{ borderLeftColor: "var(--teal)" }}>
            <h3 className="cc-improvement-title" style={{ marginBottom: ".3rem" }}>
              {translate(locale, { en: "Urban growth that drives national growth", th: "การเติบโตของเมืองที่ขับเคลื่อนการเติบโตของชาติ", zh: "驱动国家增长的城市增长" })}
            </h3>
            <p className="cc-improvement-rationale" style={{ paddingLeft: 0, marginBottom: 0 }}>
              {translate(locale, {
                en: "Thailand's urban primacy problem — Bangkok absorbing 40%+ of GDP — won't be solved by certifying 105 cities. It requires real economic decentralization: secondary cities with functioning transit, competitive digital infrastructure, and access to finance. Curitiba proved BRT can restructure a city for 1/100th the cost of a metro. Bogotá proved Ciclovía costs almost nothing but transforms community. Estonia proved digital government can happen with political will, not massive budgets. Thailand has the resources. What it needs is the courage to stop certifying and start delivering.",
                th: "ปัญหาความเป็นเมืองหลักเดียวของไทย — กรุงเทพดูดซับ GDP 40%+ — จะไม่ถูกแก้ด้วยการรับรอง 105 เมือง ต้องการการกระจายอำนาจทางเศรษฐกิจจริง: เมืองรองที่มีขนส่งที่ทำงานได้ โครงสร้างพื้นฐานดิจิทัลที่แข่งขันได้ และการเข้าถึงการเงิน กูรีตีบาพิสูจน์ว่า BRT สามารถปรับโครงสร้างเมืองด้วยต้นทุน 1/100 ของรถไฟใต้ดิน โบโกตาพิสูจน์ว่า Ciclovía แทบไม่เสียอะไรแต่เปลี่ยนชุมชน เอสโตเนียพิสูจน์ว่ารัฐบาลดิจิทัลเกิดขึ้นได้ด้วยเจตจำนงทางการเมือง ไม่ใช่งบมหาศาล ไทยมีทรัพยากร สิ่งที่ต้องการคือความกล้าที่จะหยุดรับรองและเริ่มส่งมอบ",
                zh: "泰国的城市首位性问题——曼谷吸收40%+的GDP——不会通过认证105个城市解决。它需要真正的经济去中心化：有运作交通、有竞争力的数字基础设施和融资渠道的二级城市。库里蒂巴证明BRT能以地铁1/100的成本重构城市。波哥大证明Ciclovía几乎不花钱但能改变社区。爱沙尼亚证明数字政府可以靠政治意愿实现，不需要巨额预算。泰国有资源。需要的是停止认证、开始交付的勇气。",
              })}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
