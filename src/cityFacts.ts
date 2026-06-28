// ---------------------------------------------------------------------------
// City Facts — hand-curated "at a glance" basics
// ---------------------------------------------------------------------------
// These are the kind of facts a reader Googles before they dig into the
// dossier: native script, airport code, elevation, drive-time from Bangkok,
// notable institution, dialect, founding era.
//
// Sources: Wikipedia, Royal Thai Government postal directory, IATA, and
// standard travel references. No hallucination. When unknown, fields are
// omitted — the renderer shows only what exists.
// ---------------------------------------------------------------------------

import { getOpenDataSearchUrl } from "./cdpData.ts";
import { getCityById } from "./cityData.ts";
import type { LocalizedText } from "./cityCdp.ts";
import type { CityResearchSource } from "./cityResearch.ts";

export interface CityFacts {
  nativeName?: string;          // Thai script, the canonical native form
  iata?: string;                 // airport code if a commercial airport is present
  postalPrefix?: string;         // first 2 digits of the zip range
  elevationM?: number;           // metres above sea level
  distanceFromBangkokKm?: number;
  driveTimeFromBangkok?: LocalizedText;
  foundedEra?: LocalizedText;    // "13th century", "1909", "masterplanned 2017"
  notableInstitution?: LocalizedText;
  dialect?: LocalizedText;       // regional Thai variant or minority language
  geography?: LocalizedText;     // one-line landform description
  creativeEconomyEdge?: LocalizedText; // creative economy context for investors
  investmentAngle?: LocalizedText;     // SCITI investment insight
  sources?: CityResearchSource[];
}

export const CITY_FACTS: Record<string, CityFacts> = {
  "samyan": {
    nativeName: "สามย่าน",
    postalPrefix: "10330",
    elevationM: 2,
    distanceFromBangkokKm: 0,
    driveTimeFromBangkok: { en: "Central Bangkok", th: "ใจกลางกรุงเทพ", zh: "位于曼谷市中心" },
    foundedEra: { en: "Redeveloped 2019", th: "พัฒนาใหม่ปี 2562", zh: "2019 年重建" },
    notableInstitution: {
      en: "Chulalongkorn University",
      th: "จุฬาลงกรณ์มหาวิทยาลัย",
      zh: "朱拉隆功大学",
    },
    dialect: { en: "Standard (Central) Thai", th: "ภาษาไทยกลาง", zh: "中部（标准）泰语" },
    geography: {
      en: "Flat Chao Phraya delta, 2 m above sea level",
      th: "ราบลุ่มเจ้าพระยา สูงกว่าระดับน้ำทะเล 2 ม.",
      zh: "湄南河三角洲平原，海拔 2 米",
    },
  },
  "rattanakosin": {
    nativeName: "รัตนโกสินทร์",
    postalPrefix: "10200",
    elevationM: 2,
    distanceFromBangkokKm: 0,
    driveTimeFromBangkok: { en: "The original Bangkok", th: "พื้นที่ตั้งกรุงเดิม", zh: "曼谷原始城区" },
    foundedEra: { en: "Founded 1782 by King Rama I", th: "สถาปนาปี 2325 โดยรัชกาลที่ 1", zh: "1782 年拉玛一世建都" },
    notableInstitution: {
      en: "Grand Palace · Wat Pho",
      th: "พระบรมมหาราชวัง · วัดโพธิ์",
      zh: "大皇宫 · 卧佛寺",
    },
    dialect: { en: "Standard (Central) Thai", th: "ภาษาไทยกลาง", zh: "中部（标准）泰语" },
    geography: {
      en: "Artificial island inside the Chao Phraya river bend",
      th: "เกาะที่เกิดจากการขุดคลองล้อมรอบในวงโค้งเจ้าพระยา",
      zh: "湄南河弯道内的人工河心岛",
    },
  },
  "chiang-mai-old-town": {
    nativeName: "เมืองเก่าเชียงใหม่",
    iata: "CNX",
    postalPrefix: "50000",
    elevationM: 310,
    distanceFromBangkokKm: 696,
    driveTimeFromBangkok: { en: "9–10 h drive · 1 h 10 m flight", th: "ขับ 9–10 ชม. · บิน 1 ชม. 10 น.", zh: "车程 9–10 小时 · 飞行 1 小时 10 分" },
    foundedEra: {
      en: "Founded 1296 as Lanna capital",
      th: "สถาปนาปี 1839 เป็นราชธานีล้านนา",
      zh: "1296 年立为兰纳王都",
    },
    notableInstitution: {
      en: "Chiang Mai University · Wat Phra Singh",
      th: "มหาวิทยาลัยเชียงใหม่ · วัดพระสิงห์",
      zh: "清迈大学 · 帕辛寺",
    },
    dialect: { en: "Kham Mueang (Northern Thai)", th: "คำเมือง (ภาษาล้านนา)", zh: "兰纳语 / 北部泰语" },
    geography: {
      en: "Ping river valley, ringed by Doi Suthep range",
      th: "ที่ราบลุ่มแม่น้ำปิง ล้อมด้วยดอยสุเทพ",
      zh: "平河谷地，三面环素贴山脉",
    },
    creativeEconomyEdge: {
      en: "UNESCO Creative City (Crafts & Folk Art); Chiang Mai Design Week (105k visitors, 493.7M THB); CEA regional office; Old City creative district; 1,757 youth entrepreneurs trained through CEA programs; hub for crafts, digital creative, wellness tourism.",
      th: "เมืองสร้างสรรค์ยูเนสโก (หัตถกรรมและศิลปะพื้นบ้าน); Chiang Mai Design Week (ผู้เข้าชม 105k, มูลค่าเศรษฐกิจ 493.7 ล้านบาท); สำนักงาน CEA ภูมิภาค; ย่านสร้างสรรค์เมืองเก่า; ศูนย์กลางงานคราฟต์ ดิจิทัลครีเอทีฟ และท่องเที่ยวเชิงสุขภาพ",
      zh: "联合国教科文组织创意城市（手工艺与民间艺术）；清迈设计周（10.5万游客，经济价值4.937亿泰铢）；CEA区域办公室；老城创意街区；手工艺、数字创意和健康旅游枢纽。"
    },
    investmentAngle: {
      en: "Creative industries, digital nomad infrastructure, wellness tourism, craft export, creative education. The Chiang Mai-Lamphun corridor offers adjacent low-cost expansion opportunities.",
      th: "อุตสาหกรรมสร้างสรรค์ โครงสร้างพื้นฐานดิจิทัลนอแมด การท่องเที่ยวเชิงสุขภาพ ส่งออกงานคราฟต์ การศึกษาสร้างสรรค์ ระเบียงเชียงใหม่-ลำพูนให้โอกาสขยายธุรกิจด้วยต้นทุนต่ำในพื้นที่ใกล้เคียง",
      zh: "创意产业、数字游民基础设施、健康旅游、工艺品出口、创意教育。清迈-南奔走廊提供相邻的低成本扩张机会。"
    },
  },
  "cmu-smart-city": {
    nativeName: "เมืองอัจฉริยะ มช.",
    iata: "CNX",
    postalPrefix: "50200",
    elevationM: 330,
    distanceFromBangkokKm: 696,
    notableInstitution: {
      en: "Chiang Mai University (40,000 students)",
      th: "มหาวิทยาลัยเชียงใหม่ (40,000 คน)",
      zh: "清迈大学（在校生 4 万）",
    },
    dialect: { en: "Kham Mueang (Northern Thai)", th: "คำเมือง", zh: "兰纳语 / 北部泰语" },
    foundedEra: { en: "University founded 1964", th: "ก่อตั้งมหาวิทยาลัยปี 2507", zh: "1964 年建校" },
    geography: {
      en: "Foothills of Doi Suthep, west of Chiang Mai city",
      th: "เชิงดอยสุเทพ ทางตะวันตกของเมืองเชียงใหม่",
      zh: "清迈市西，素贴山脚下",
    },
  },
  "phuket": {
    nativeName: "ภูเก็ต",
    iata: "HKT",
    postalPrefix: "83000",
    elevationM: 15,
    distanceFromBangkokKm: 863,
    driveTimeFromBangkok: { en: "12 h drive · 1 h 25 m flight", th: "ขับ 12 ชม. · บิน 1 ชม. 25 น.", zh: "车程 12 小时 · 飞行 1 小时 25 分" },
    foundedEra: {
      en: "Tin-mining port town, 19th century",
      th: "เมืองเหมืองดีบุกตั้งแต่คริสต์ศตวรรษที่ 19",
      zh: "19 世纪锡矿港口城镇",
    },
    notableInstitution: {
      en: "Prince of Songkla University Phuket Campus",
      th: "มหาวิทยาลัยสงขลานครินทร์ วิทยาเขตภูเก็ต",
      zh: "宋卡王子大学普吉校区",
    },
    dialect: {
      en: "Southern Thai with Baba Peranakan heritage",
      th: "ภาษาไทยใต้ ผสมวัฒนธรรมบาบ๋า-เปอรานากัน",
      zh: "南部泰语，融合峇峇娘惹文化",
    },
    geography: {
      en: "Thailand's largest island (543 km²), Andaman Sea",
      th: "เกาะที่ใหญ่ที่สุดของไทย 543 ตร.กม. ทะเลอันดามัน",
      zh: "泰国第一大岛 543 km²，安达曼海",
    },
    creativeEconomyEdge: {
      en: "UNESCO City of Gastronomy; international events calendar (Honda LPGA, King's Cup Regatta, Phuket Vegetarian Festival); Peranakan (Baba) cultural heritage; Old Phuket Town creative district; digital nomad hub ranking top 5 in Southeast Asia; yachting and marine tourism; wellness retreat cluster.",
      th: "เมืองสร้างสรรค์ยูเนสโกด้านวิทยาการอาหาร; ปฏิทินกิจกรรมนานาชาติ; มรดกวัฒนธรรมเปอรานากัน (บาบ๋า); ย่านสร้างสรรค์เมืองเก่าภูเก็ต; ศูนย์รวมดิจิทัลนอแมดอันดับท็อป 5 ในเอเชียตะวันออกเฉียงใต้; การแล่นเรือยอร์ชและการท่องเที่ยวทางทะเล; คลัสเตอร์รีสอร์ทเพื่อสุขภาพ",
      zh: "联合国教科文组织美食创意城市；国际赛事日历（本田LPGA、国王杯帆船赛、普吉素食节）；土生华人（峇峇）文化遗产；普吉老城创意街区；数字游民枢纽在东南亚排名前五；游艇和海洋旅游；健康静修集群。"
    },
    investmentAngle: {
      en: "Creative tourism and hospitality, wellness and medical tourism, yachting and marine lifestyle, digital nomad infrastructure, gastronomy tourism, Peranakan heritage branding. Higher labor costs are offset by revenue premiums from international visitors.",
      th: "การท่องเที่ยวและบริการสร้างสรรค์ การท่องเที่ยวเพื่อสุขภาพและการแพทย์ ไลฟ์สไตล์การแล่นเรือยอร์ชและทางทะเล โครงสร้างพื้นฐานดิจิทัลนอแมด การท่องเที่ยวเชิงอาหาร การสร้างแบรนด์มรดกเปอรานากัน ต้นทุนแรงงานที่สูงขึ้นถูกชดเชยด้วยรายได้พรีเมียมจากนักท่องเที่ยวต่างชาติ",
      zh: "创意旅游和酒店业、健康和医疗旅游、游艇和海洋生活方式、数字游民基础设施、美食旅游、土生华人遗产品牌。较高的劳动力成本被国际游客的溢价收入所抵消。"
    },
  },
  "khon-kaen": {
    nativeName: "ขอนแก่น",
    iata: "KKC",
    postalPrefix: "40000",
    elevationM: 187,
    distanceFromBangkokKm: 449,
    driveTimeFromBangkok: { en: "5–6 h drive · 55 m flight", th: "ขับ 5–6 ชม. · บิน 55 น.", zh: "车程 5–6 小时 · 飞行 55 分" },
    foundedEra: { en: "Settled 1783", th: "ตั้งเมืองปี 2326", zh: "1783 年建城" },
    notableInstitution: {
      en: "Khon Kaen University (flagship Isan research hub)",
      th: "มหาวิทยาลัยขอนแก่น (ศูนย์วิจัยหลักของอีสาน)",
      zh: "孔敬大学（东北部旗舰研究枢纽）",
    },
    dialect: { en: "Isan (Lao-Thai)", th: "ภาษาอีสาน (ลาว-ไทย)", zh: "伊善语 / 老-泰语" },
    geography: {
      en: "Khorat plateau, sandstone plains",
      th: "ที่ราบสูงโคราช ภูมิประเทศหินทราย",
      zh: "呵叻高原砂岩平原",
    },
    creativeEconomyEdge: {
      en: "Isan Creative Festival hub; CEA regional office; Srichan creative district; Molam Crossover Project (traditional music modernization); NE cultural capital with strong traditional performing arts, silk weaving, and culinary heritage.",
      th: "ศูนย์กลางเทศกาลอีสานสร้างสรรค์ (Isan Creative Festival); สำนักงาน CEA ภูมิภาค; ย่านสร้างสรรค์ศรีจันทร์; โครงการหมอลำครอสโอเวอร์; เมืองหลวงทางวัฒนธรรมอีสานที่โดดเด่นด้านศิลปะการแสดง ดนตรี ทอผ้าไหม และมรดกอาหาร",
      zh: "伊善创意节枢纽；CEA区域办公室；Srichan创意街区；Molam跨界项目（传统音乐现代化）；东北部文化之都，拥有强大的传统表演艺术、丝绸编织和烹饪遗产。"
    },
    investmentAngle: {
      en: "Food processing and creative food industries, logistics and distribution, bioeconomy R&D, creative content production (music, media), education and training centers. The NeEC corridor designation provides targeted BOI incentives.",
      th: "การแปรรูปอาหารและอุตสาหกรรมอาหารสร้างสรรค์ โลจิสติกส์และการกระจายสินค้า R&D ด้านเศรษฐกิจชีวภาพ การผลิตเนื้อหาสร้างสรรค์ (ดนตรี สื่อ) ศูนย์การศึกษาและฝึกอบรม การกำหนดระเบียง NeEC ให้สิทธิประโยชน์ BOI ที่ตรงเป้าหมาย",
      zh: "食品加工和创意食品产业、物流和分销、生物经济研发、创意内容制作（音乐、媒体）、教育和培训中心。NeEC走廊指定提供有针对性的BOI激励措施。"
    },
  },
  "korat": {
    nativeName: "นครราชสีมา (โคราช)",
    iata: "NAK",
    postalPrefix: "30000",
    elevationM: 179,
    distanceFromBangkokKm: 259,
    driveTimeFromBangkok: { en: "3 h 30 m drive · HSR 1 h 30 m (2028)", th: "ขับ 3 ชม. 30 น. · รถไฟความเร็วสูง 1 ชม. 30 น. (2571)", zh: "车程 3 小时 30 分 · 2028 年高铁 1 小时 30 分" },
    foundedEra: {
      en: "Ayutthaya-era garrison, 17th century",
      th: "เมืองทหารสมัยอยุธยา คริสต์ศตวรรษที่ 17",
      zh: "17 世纪阿瑜陀耶戍城",
    },
    notableInstitution: {
      en: "Suranaree University of Technology",
      th: "มหาวิทยาลัยเทคโนโลยีสุรนารี",
      zh: "苏拉那利理工大学",
    },
    dialect: { en: "Khorat Thai (a Thai-Isan blend)", th: "ภาษาโคราช (ผสมไทยกลาง-อีสาน)", zh: "呵叻语（泰中-伊善混合）" },
    geography: {
      en: "Gateway to Isan, edge of the Khorat plateau",
      th: "ประตูสู่อีสาน ขอบที่ราบสูงโคราช",
      zh: "伊善之门，呵叻高原之缘",
    },
    creativeEconomyEdge: {
      en: "Gateway to Isan cultural region; Khorat silk and weaving tradition; Thao Suranari cultural heritage; Suranaree University of Technology innovation hub; emerging food and agriculture creative industries; Save One Market -- one of NE's largest creative retail spaces.",
      th: "ประตูสู่วัฒนธรรมอีสาน; ประเพณีทอผ้าและไหมโคราช; มรดกวัฒนธรรมท้าวสุรนารี; ศูนย์กลางนวัตกรรมมหาวิทยาลัยเทคโนโลยีสุรนารี; อุตสาหกรรมสร้างสรรค์ด้านอาหารและการเกษตรที่กำลังเติบโต; ตลาดเซฟวัน -- พื้นที่ค้าปลีกสร้างสรรค์ที่ใหญ่ที่สุดแห่งหนึ่งของอีสาน",
      zh: "伊善文化区的门户；呵叻丝绸和编织传统；陶素罗娜丽文化遗产；苏拉那利理工大学创新枢纽；新兴食品和农业创意产业；Save One市场——东北部最大的创意零售空间之一。"
    },
    investmentAngle: {
      en: "Logistics and warehousing, food processing creative branding, automotive parts (proximity to Nakhon Ratchasima industrial estates), wholesale and distribution for Isan region, agri-tech and bioeconomy. Massive labor pool at below-Bangkok cost.",
      th: "โลจิสติกส์และคลังสินค้า การสร้างแบรนด์สร้างสรรค์แปรรูปอาหาร ชิ้นส่วนยานยนต์ (ใกล้เขตอุตสาหกรรมโคราช) การขายส่งและกระจายสินค้าสำหรับภาคอีสาน เทคโนโลยีเกษตรและเศรษฐกิจชีวภาพ กลุ่มแรงงานขนาดใหญ่ในราคาต่ำกว่ากรุงเทพฯ",
      zh: "物流和仓储、食品加工创意品牌、汽车零部件（靠近呵叻工业园）、伊善地区的批发和分销、农业科技和生物经济。低于曼谷成本的庞大劳动力池。"
    },
  },
  "rayong": {
    nativeName: "ระยอง",
    postalPrefix: "21000",
    elevationM: 4,
    distanceFromBangkokKm: 185,
    driveTimeFromBangkok: { en: "2 h 30 m via Motorway 7", th: "2 ชม. 30 น. ผ่านมอเตอร์เวย์ 7", zh: "沿 7 号高速公路 2 小时 30 分" },
    foundedEra: { en: "Historic fishing port, 15th century", th: "ท่าเรือประมงเก่าแก่ คริสต์ศตวรรษที่ 15", zh: "15 世纪渔港古镇" },
    notableInstitution: {
      en: "PTT Group · Eastern Economic Corridor (EEC) anchor",
      th: "กลุ่ม ปตท. · เขตพัฒนาพิเศษภาคตะวันออก (EEC)",
      zh: "PTT 集团 · 东部经济走廊（EEC）核心",
    },
    dialect: { en: "Eastern Thai", th: "ภาษาไทยภาคตะวันออก", zh: "东部泰语" },
    geography: {
      en: "Gulf of Thailand coast, petrochemical corridor at Map Ta Phut",
      th: "ชายฝั่งอ่าวไทย ระเบียงปิโตรเคมีมาบตาพุด",
      zh: "泰国湾岸，玛达卜石化走廊",
    },
  },
  "wangchan-valley": {
    nativeName: "วังจันทร์วัลเลย์",
    postalPrefix: "21210",
    elevationM: 25,
    distanceFromBangkokKm: 205,
    foundedEra: {
      en: "Masterplanned 2016 by PTT on 3,454 rai",
      th: "ผังแม่บทปี 2559 โดย ปตท. พื้นที่ 3,454 ไร่",
      zh: "2016 年 PTT 主导，规划面积 3,454 莱",
    },
    notableInstitution: {
      en: "VISTEC · KVIS (science high school)",
      th: "VISTEC · KVIS (โรงเรียนวิทยาศาสตร์)",
      zh: "VISTEC · KVIS（科学高中）",
    },
    dialect: { en: "Eastern Thai", th: "ภาษาไทยภาคตะวันออก", zh: "东部泰语" },
    geography: {
      en: "Greenfield campus in Wang Chan district, Rayong",
      th: "แคมปัสใหม่ อำเภอวังจันทร์ จังหวัดระยอง",
      zh: "罗勇府旺山县绿地校园",
    },
  },
  "nakhon-si-thammarat": {
    nativeName: "นครศรีธรรมราช",
    iata: "NST",
    postalPrefix: "80000",
    elevationM: 12,
    distanceFromBangkokKm: 780,
    driveTimeFromBangkok: { en: "10 h drive · 1 h 20 m flight", th: "ขับ 10 ชม. · บิน 1 ชม. 20 น.", zh: "车程 10 小时 · 飞行 1 小时 20 分" },
    foundedEra: {
      en: "Srivijaya-era port, 7th century",
      th: "ท่าเรือสมัยศรีวิชัย คริสต์ศตวรรษที่ 7",
      zh: "7 世纪室利佛逝时期港口",
    },
    notableInstitution: {
      en: "Wat Phra Mahathat Woramahawihan (UNESCO candidate)",
      th: "วัดพระมหาธาตุวรมหาวิหาร (อยู่ในรายชื่อ UNESCO)",
      zh: "瑪哈塔寺（联合国教科文组织候选）",
    },
    dialect: { en: "Southern Thai (Pak Tai)", th: "ภาษาไทยใต้ (ปักษ์ใต้)", zh: "南部泰语（巴泰语）" },
    geography: {
      en: "Narrow coastal plain between Gulf and Khao Luang range",
      th: "ที่ราบชายฝั่งแคบ ระหว่างอ่าวไทยและเขาหลวง",
      zh: "泰国湾与銮山之间的狭长海岸平原",
    },
  },
  "nan": {
    nativeName: "น่าน",
    iata: "NNT",
    postalPrefix: "55000",
    elevationM: 201,
    distanceFromBangkokKm: 668,
    driveTimeFromBangkok: { en: "9 h drive · 1 h 20 m flight", th: "ขับ 9 ชม. · บิน 1 ชม. 20 น.", zh: "车程 9 小时 · 飞行 1 小时 20 分" },
    foundedEra: { en: "Former Nan kingdom, 13th century", th: "อาณาจักรน่านเดิม คริสต์ศตวรรษที่ 13", zh: "13 世纪南王国" },
    notableInstitution: {
      en: "Wat Phumin · Nan National Museum",
      th: "วัดภูมินทร์ · พิพิธภัณฑสถานแห่งชาติน่าน",
      zh: "普明寺 · 南府国家博物馆",
    },
    dialect: { en: "Kham Mueang with Tai Lue minority influence", th: "คำเมือง ผสมไทลื้อ", zh: "北部泰语，带傣仂语影响" },
    geography: {
      en: "Remote mountain basin near Laos border, 75 % forested",
      th: "แอ่งภูเขา ใกล้ชายแดนลาว มีป่าปกคลุม 75%",
      zh: "近老挝边界山间盆地，森林覆盖 75%",
    },
  },
  "yala": {
    nativeName: "ยะลา",
    postalPrefix: "95000",
    elevationM: 35,
    distanceFromBangkokKm: 1084,
    driveTimeFromBangkok: { en: "14 h drive · 1 h 30 m flight to Hat Yai, then 2 h", th: "ขับ 14 ชม. · บินหาดใหญ่ 1 ชม. 30 น. + ขับ 2 ชม.", zh: "车程 14 小时 · 合艾飞行 1.5 小时 + 2 小时车程" },
    foundedEra: { en: "Planned grid city, 1909", th: "เมืองผังใหม่ ปี 2452", zh: "1909 年棋盘式规划城" },
    notableInstitution: {
      en: "Thailand's only pre-planned grid-pattern city",
      th: "เมืองผังตารางวางแผนล่วงหน้าแห่งเดียวของไทย",
      zh: "泰国唯一预先规划的棋盘格城市",
    },
    dialect: {
      en: "Malay (Yawi) alongside Thai",
      th: "ภาษามลายูยาวีควบคู่ภาษาไทย",
      zh: "爪夷马来语与泰语并用",
    },
    geography: {
      en: "Deep-south inland city, Sankalakhiri mountains to the east",
      th: "เมืองในแผ่นดินภาคใต้ตอนล่าง เทือกเขาสันกาลาคีรีทางตะวันออก",
      zh: "深南部内陆，东侧桑卡拉奇里山脉",
    },
  },
  "phitsanulok-muni": {
    nativeName: "พิษณุโลก",
    iata: "PHS",
    postalPrefix: "65000",
    elevationM: 45,
    distanceFromBangkokKm: 377,
    driveTimeFromBangkok: { en: "5 h drive · 55 m flight", th: "ขับ 5 ชม. · บิน 55 น.", zh: "车程 5 小时 · 飞行 55 分" },
    foundedEra: {
      en: "Sukhothai-era capital, 14th–15th century",
      th: "ราชธานีสมัยสุโขทัย คริสต์ศตวรรษที่ 14–15",
      zh: "14–15 世纪素可泰故都",
    },
    notableInstitution: {
      en: "Wat Phra Si Rattana Mahathat · Naresuan University",
      th: "วัดพระศรีรัตนมหาธาตุ · มหาวิทยาลัยนเรศวร",
      zh: "帕席拉达纳玛哈塔寺 · 那黎宣大学",
    },
    dialect: { en: "Central Thai with Northern influence", th: "ภาษาไทยกลาง ผสมคำเหนือ", zh: "中部泰语，带北部影响" },
    geography: {
      en: "Nan river plain, halfway between Bangkok and Chiang Mai",
      th: "ที่ราบลุ่มแม่น้ำน่าน กึ่งกลางระหว่างกรุงเทพฯ–เชียงใหม่",
      zh: "南河平原，曼谷-清迈之间枢纽",
    },
  },
  "chiang-rai": {
    nativeName: "เชียงราย",
    iata: "CEI",
    postalPrefix: "57000",
    elevationM: 395,
    distanceFromBangkokKm: 828,
    driveTimeFromBangkok: { en: "11 h drive · 1 h 20 m flight", th: "ขับ 11 ชม. · บิน 1 ชม. 20 น.", zh: "车程 11 小时 · 飞行 1 小时 20 分" },
    foundedEra: {
      en: "Founded 1262 by King Mangrai",
      th: "สถาปนาปี 1805 โดยพญามังราย",
      zh: "1262 年孟莱王建城",
    },
    notableInstitution: {
      en: "Wat Rong Khun (White Temple) · Golden Triangle gateway",
      th: "วัดร่องขุ่น · ประตูสู่สามเหลี่ยมทองคำ",
      zh: "白庙 · 金三角之门",
    },
    dialect: { en: "Kham Mueang (Northern Thai)", th: "คำเมือง", zh: "兰纳语 / 北部泰语" },
    geography: {
      en: "Mekong-Mae Kok confluence, Laos and Myanmar borders",
      th: "จุดบรรจบโขง-กก ชายแดนลาวและเมียนมา",
      zh: "湄公河与郭河交汇，邻老挝与缅甸",
    },
    creativeEconomyEdge: {
      en: "UNESCO City of Design; Mae Fah Luang University art and design programs; Doi Tung creative development model; traditional Tai Lue weaving, hill tribe crafts, tea culture; Chiang Rai Design Week emerging; CEA Creative Lanna corridor member.",
      th: "เมืองสร้างสรรค์ยูเนสโกด้านการออกแบบ; หลักสูตรศิลปะและการออกแบบ มหาวิทยาลัยแม่ฟ้าหลวง; โมเดลการพัฒนาสร้างสรรค์ดอยตุง; การทอผ้าไทลื้อดั้งเดิม งานฝีมือชาวเขา วัฒนธรรมชา; งานเชียงรายดีไซน์วีคที่กำลังเติบโต; สมาชิกกลุ่มระเบียงเศรษฐกิจสร้างสรรค์ล้านนา CEA",
      zh: "联合国教科文组织设计之都；皇太后大学艺术与设计项目；董山创意发展模式；传统傣仂编织、高山族手工艺、茶文化；清迈设计周正在兴起；CEA创意兰纳走廊成员。"
    },
    investmentAngle: {
      en: "Cross-border creative trade, design and branding services, artisan craft export, tea and specialty food creative branding, border tourism. Dual SEZ+NEC status provides exceptional BOI incentive stacking.",
      th: "การค้าสร้างสรรค์ข้ามพรมแดน บริการด้านการออกแบบและการสร้างแบรนด์ การส่งออกงานคราฟต์ การสร้างแบรนด์สร้างสรรค์สำหรับชาและอาหารพิเศษ การท่องเที่ยวชายแดน สถานะคู่ SEZ+NEC ให้สิทธิประโยชน์ BOI ที่โดดเด่น",
      zh: "跨境创意贸易、设计和品牌服务、手工艺品出口、茶和特色食品创意品牌、边境旅游。双重SEZ+NEC身份提供卓越的BOI激励叠加。"
    },
  },
  "hat-yai": {
    nativeName: "หาดใหญ่",
    iata: "HDY",
    postalPrefix: "90110",
    elevationM: 8,
    distanceFromBangkokKm: 952,
    driveTimeFromBangkok: { en: "12 h drive · 1 h 30 m flight", th: "ขับ 12 ชม. · บิน 1 ชม. 30 น.", zh: "车程 12 小时 · 飞行 1 小时 30 分" },
    foundedEra: {
      en: "Railway town, grew from 1909",
      th: "เมืองรถไฟ เติบโตตั้งแต่ปี 2452",
      zh: "1909 年起随铁路兴建",
    },
    notableInstitution: {
      en: "Prince of Songkla University · cross-border trade hub",
      th: "มหาวิทยาลัยสงขลานครินทร์ · ศูนย์การค้าข้ามพรมแดน",
      zh: "宋卡王子大学 · 跨境贸易枢纽",
    },
    dialect: {
      en: "Southern Thai, Hokkien Chinese influence",
      th: "ภาษาไทยใต้ ผสมจีนฮกเกี้ยน",
      zh: "南部泰语，带福建话影响",
    },
    geography: {
      en: "Commercial hub 30 km from Malaysian border",
      th: "ศูนย์การค้า ห่างชายแดนมาเลเซีย 30 กม.",
      zh: "距马来西亚边境 30 公里的商业枢纽",
    },
  },
  "ubon": {
    nativeName: "อุบลราชธานี",
    iata: "UBP",
    postalPrefix: "34000",
    elevationM: 127,
    distanceFromBangkokKm: 615,
    driveTimeFromBangkok: { en: "8 h drive · 1 h 5 m flight", th: "ขับ 8 ชม. · บิน 1 ชม. 5 น.", zh: "车程 8 小时 · 飞行 1 小时 5 分" },
    foundedEra: { en: "Founded 1792", th: "ตั้งเมืองปี 2335", zh: "1792 年建城" },
    notableInstitution: {
      en: "Ubon Ratchathani University · Candle Festival",
      th: "มหาวิทยาลัยอุบลราชธานี · งานแห่เทียนพรรษา",
      zh: "乌汶府大学 · 蜡烛节",
    },
    dialect: { en: "Isan (Lao-Thai), with Kuy minority", th: "ภาษาอีสาน ผสมกูย", zh: "伊善语，兼库伊语少数群体" },
    geography: {
      en: "Mun-Mekong confluence, Laos-Cambodia border region",
      th: "จุดบรรจบแม่น้ำมูล-โขง ชายแดนลาว-กัมพูชา",
      zh: "蒙河-湄公河交汇，老柬边境地带",
    },
  },
  "songkhla-city": {
    nativeName: "เมืองสงขลา",
    iata: "HDY",
    postalPrefix: "90000",
    elevationM: 4,
    distanceFromBangkokKm: 950,
    notableInstitution: {
      en: "Pakk Taii Design Week",
      th: "ปักษ์ใต้ดีไซน์วีค",
      zh: "南部设计周",
    },
    dialect: { en: "Southern Thai", th: "ภาษาไทยใต้", zh: "南部泰语" },
    geography: {
      en: "Coastal city on a peninsula between Songkhla Lake and the Gulf of Thailand",
      th: "เมืองชายฝั่งบนคาบสมุทรระหว่างทะเลสาบสงขลาและอ่าวไทย",
      zh: "位于宋卡湖和泰国湾之间半岛上的沿海城市",
    },
    creativeEconomyEdge: {
      en: "UNESCO Creative City of Gastronomy (2025); Pakk Taii Design Week; CEA Songkhla office under construction; traditional southern cuisine, fishing culture, Peranakan heritage; Hat Yai International Airport provides regional connectivity.",
      th: "เมืองสร้างสรรค์ยูเนสโกด้านวิทยาการอาหาร (ปี 2568); เทศกาลปักษ์ใต้ดีไซน์วีค; สำนักงาน CEA สงขลากำลังก่อสร้าง; อาหารใต้ดั้งเดิม วัฒนธรรมประมง มรดกเปอรานากัน; สนามบินนานาชาติหาดใหญ่เชื่อมต่อภูมิภาค",
      zh: "联合国教科文组织美食创意城市（2025年）；南部设计周；正在建设的CEA宋卡办公室；传统南部美食、渔业文化、土生华人遗产；合艾国际机场提供区域连通性。"
    },
    investmentAngle: {
      en: "Gastronomy tourism and food export, cross-border trade with Malaysia, seafood processing creative branding, logistics and cold chain, creative education. SEZ status provides 8-year CIT exemption (extendable to 13 years).",
      th: "การท่องเที่ยวเชิงอาหารและการส่งออกอาหาร การค้าชายแดนกับมาเลเซีย การสร้างแบรนด์สร้างสรรค์แปรรูปอาหารทะเล โลจิสติกส์และห่วงโซ่ความเย็น การศึกษาสร้างสรรค์ สถานะ SEZ ให้การยกเว้นภาษีเงินได้นิติบุคคล 8 ปี (ขยายได้ถึง 13 ปี)",
      zh: "美食旅游和食品出口、与马来西亚的跨境贸易、海鲜加工创意品牌、物流和冷链、创意教育。SEZ身份提供8年免税期（可延长至13年）。"
    }
  },
  "ayutthaya": {
    nativeName: "พระนครศรีอยุธยา",
    postalPrefix: "13000",
    elevationM: 4,
    distanceFromBangkokKm: 80,
    driveTimeFromBangkok: { en: "1 h 15 m drive", th: "ขับ 1 ชม. 15 น.", zh: "车程 1 小时 15 分" },
    foundedEra: { en: "Founded 1350 as Siam capital", th: "สถาปนาปี 1893 เป็นเมืองหลวงสยาม", zh: "1350年建为暹罗国都" },
    notableInstitution: {
      en: "Ayutthaya Historical Park",
      th: "อุทยานประวัติศาสตร์พระนครศรีอยุธยา",
      zh: "阿瑜陀耶历史公园",
    },
    dialect: { en: "Central Thai", th: "ภาษาไทยกลาง", zh: "中部泰语" },
    geography: {
      en: "Chao Phraya river basin island",
      th: "เกาะในที่ราบลุ่มแม่น้ำเจ้าพระยา",
      zh: "湄南河流域岛屿",
    },
    creativeEconomyEdge: {
      en: "UNESCO World Heritage Site; 2.5M+ heritage tourists annually; traditional boat noodles, roti sai mai sweets -- iconic Thai culinary heritage; Japanese-Thai industrial design corridor; creative manufacturing base; 67 temples and historical sites.",
      th: "แหล่งมรดกโลกยูเนสโก; นักท่องเที่ยวเชิงมรดกกว่า 2.5 ล้านคนต่อปี; ก๋วยเตี๋ยวเรือดั้งเดิม โรตีสายไหม -- มรดกทางวัฒนธรรมอาหารไทยที่โดดเด่น; ระเบียงการออกแบบอุตสาหกรรมไทย-ญี่ปุ่น; ฐานการผลิตสร้างสรรค์; วัดและโบราณสถาน 67 แห่ง",
      zh: "联合国教科文组织世界遗产；每年250万+遗产游客；传统船面、Roti Sai Mai甜点——标志性的泰国烹饪遗产；日泰工业设计走廊；创意制造基地；67座寺庙和历史遗迹。"
    },
    investmentAngle: {
      en: "Heritage tourism infrastructure, creative manufacturing, Japanese-Thai joint ventures, food heritage branding and export, cultural education and interpretation services. The GPP/Capita to wage ratio is among the most favorable in Thailand.",
      th: "โครงสร้างพื้นฐานการท่องเที่ยวเชิงมรดก การผลิตสร้างสรรค์ การร่วมทุนไทย-ญี่ปุ่น การสร้างแบรนด์และส่งออกมรดกอาหาร บริการการศึกษาและตีความทางวัฒนธรรม อัตราส่วน GPP ต่อหัวต่อค่าจ้างเป็นหนึ่งในอัตราส่วนที่ดีที่สุดในไทย",
      zh: "遗产旅游基础设施、创意制造、日泰合资企业、食品遗产品牌和出口、文化教育和解说服务。人均GPP与工资的比例在泰国属于最有利的之一。"
    }
  },
  "lamphun": {
    nativeName: "ลำพูน",
    postalPrefix: "51000",
    elevationM: 295,
    distanceFromBangkokKm: 670,
    driveTimeFromBangkok: { en: "9 h drive", th: "ขับ 9 ชม.", zh: "车程 9 小时" },
    foundedEra: { en: "Founded 660 as Hariphunchai", th: "ตั้งเมืองปี 1203 เป็นอาณาจักรหริภุญชัย", zh: "660年建为哈利奔猜国都" },
    notableInstitution: {
      en: "Wat Phra That Hariphunchai",
      th: "วัดพระธาตุหริภุญชัย",
      zh: "哈利奔猜寺",
    },
    dialect: { en: "Kham Mueang (Northern Thai)", th: "คำเมือง (ภาษาล้านนา)", zh: "兰纳语 / 北部泰语" },
    geography: {
      en: "River valley south of Chiang Mai",
      th: "ที่ราบลุ่มแม่น้ำตอนใต้ของเชียงใหม่",
      zh: "清迈南部的河谷",
    },
    creativeEconomyEdge: {
      en: "Northern Economic Corridor Creative Lanna zone; Hariphunchai traditional textile and weaving heritage; Longan Festival (creative agriculture event); Lamphun Night Market creative retail; direct spillover from Chiang Mai Design Week and creative industries; scenic mountainous landscape for creative retreat development.",
      th: "โซนล้านนาสร้างสรรค์ ระเบียงเศรษฐกิจภาคเหนือ; มรดกสิ่งทอและการทอผ้าพื้นเมืองหริภุญชัย; เทศกาลลำไย (อีเวนต์เกษตรสร้างสรรค์); ค้าปลีกสร้างสรรค์ถนนคนเดินลำพูน; ผลพลอยได้โดยตรงจากเชียงใหม่ดีไซน์วีคและอุตสาหกรรมสร้างสรรค์; ภูมิทัศน์ภูเขาที่สวยงามเหมาะสำหรับการพัฒนาสถานที่พักผ่อนเชิงสร้างสรรค์",
      zh: "北部经济走廊创意兰纳区；哈利奔猜传统纺织和编织遗产；龙眼节（创意农业活动）；南奔夜市创意零售；清迈设计周和创意产业的直接溢出效应；风景秀丽的山区景观适合开发创意静修地。"
    },
    investmentAngle: {
      en: "Back-office and creative production for Chiang Mai businesses, craft manufacturing at scale, creative retreat and wellness center, agricultural creative branding (longan, durian), light manufacturing. The cost arbitrage is extraordinary: Chiang Mai talent, Lamphun costs.",
      th: "สำนักงานสนับสนุนส่วนหลังและการผลิตสร้างสรรค์สำหรับธุรกิจในเชียงใหม่ การผลิตงานคราฟต์ขนาดใหญ่ ศูนย์พักผ่อนและดูแลสุขภาพเชิงสร้างสรรค์ การสร้างแบรนด์สร้างสรรค์เชิงเกษตร (ลำไย ทุเรียน) อุตสาหกรรมการผลิตเบา ความได้เปรียบด้านต้นทุนนั้นยอดเยี่ยม: ความสามารถระดับเชียงใหม่ ด้วยต้นทุนระดับลำพูน",
      zh: "清迈企业的后台和创意制作、规模化工匠制造、创意静修和健康中心、农业创意品牌（龙眼、榴莲）、轻工制造。成本套利非常可观：清迈的人才，南奔的成本。"
    }
  },
  "chanthaburi": {
    nativeName: "จันทบุรี",
    postalPrefix: "22000",
    elevationM: 10,
    distanceFromBangkokKm: 245,
    driveTimeFromBangkok: { en: "3 h 30 m drive", th: "ขับ 3 ชม. 30 น.", zh: "车程 3 小时 30 分" },
    foundedEra: { en: "Ancient Chong settlement", th: "ชุมชนชาวชองโบราณ", zh: "古老重族聚落" },
    notableInstitution: {
      en: "Cathedral of the Immaculate Conception",
      th: "อาสนวิหารพระนางมารีอาปฏิสนธินิรมล",
      zh: "圣母无原罪主教座堂",
    },
    dialect: { en: "Eastern Thai", th: "ภาษาไทยตะวันออก", zh: "东部泰语" },
    geography: {
      en: "Coastal plains and forested mountains in the East",
      th: "ที่ราบชายฝั่งและภูเขาป่าไม้ในภาคตะวันออก",
      zh: "东部的沿海平原和森林山脉",
    },
    creativeEconomyEdge: {
      en: "World colored gemstone trading center (B5B+ annual trade); gem cutting and jewelry design cluster; Noen Wong Fortress and Catholic historic district; Cathedral of the Immaculate Conception (Thailand's largest Catholic church); durian and tropical fruit creative agriculture; Chanthaburi Fruit Festival; proximity to Koh Chang island tourism circuit.",
      th: "ศูนย์กลางการค้าอัญมณีสีระดับโลก (มูลค่าการค้ากว่า 5 พันล้านบาทต่อปี); คลัสเตอร์การเจียระไนพลอยและออกแบบเครื่องประดับ; ค่ายเนินวงและย่านประวัติศาสตร์คาทอลิก; อาสนวิหารพระนางมารีอาปฏิสนธินิรมล (โบสถ์คาทอลิกที่ใหญ่ที่สุดในไทย); เกษตรสร้างสรรค์ทุเรียนและผลไม้เขตร้อน; เทศกาลผลไม้จันทบุรี; ใกล้เส้นทางท่องเที่ยวเกาะช้าง",
      zh: "世界有色宝石交易中心（年交易额超过50亿泰铢）；宝石切割和珠宝设计集群；Noen Wong堡垒和天主教历史街区；圣母无原罪主教座堂（泰国最大的天主教堂）；榴莲和热带水果创意农业；尖竹汶水果节；邻近象岛旅游环线。"
    },
    investmentAngle: {
      en: "Gem and jewelry creative design and e-commerce, cross-border trade with Cambodia, creative food branding and export, boutique tourism circuit linking gems + fruit + heritage, light manufacturing for EEC supply chain. SEZ provides 8-year CIT exemption with potential extension to 13 years.",
      th: "การออกแบบสร้างสรรค์และอีคอมเมิร์ซอัญมณีและเครื่องประดับ การค้าชายแดนกับกัมพูชา การสร้างแบรนด์และส่งออกอาหารสร้างสรรค์ เส้นทางท่องเที่ยวบูติกเชื่อมโยง อัญมณี+ผลไม้+มรดก อุตสาหกรรมการผลิตเบาสำหรับห่วงโซ่อุปทาน EEC สถานะ SEZ ให้การยกเว้นภาษีเงินได้นิติบุคคล 8 ปี และขยายได้ถึง 13 ปี",
      zh: "宝石和珠宝创意设计和电子商务、与柬埔寨的跨境贸易、创意食品品牌和出口、连接宝石+水果+遗产的精品旅游环线、为EEC供应链提供轻工制造。SEZ提供8年免税期，并有可能延长至13年。"
    }
  },
  "udon-thani": {
    nativeName: "อุดรธานี",
    iata: "UTH",
    postalPrefix: "41000",
    elevationM: 175,
    distanceFromBangkokKm: 564,
    driveTimeFromBangkok: { en: "8 h drive", th: "ขับ 8 ชม.", zh: "车程 8 小时" },
    foundedEra: { en: "Founded 1893", th: "ตั้งเมืองปี 2436", zh: "1893年建城" },
    notableInstitution: {
      en: "Ban Chiang National Museum",
      th: "พิพิธภัณฑสถานแห่งชาติบ้านเชียง",
      zh: "班清国家博物馆",
    },
    dialect: { en: "Isan (Lao-Thai)", th: "ภาษาอีสาน", zh: "伊善语 / 老-泰语" },
    geography: {
      en: "Khorat plateau, near Laos border",
      th: "ที่ราบสูงโคราช ใกล้ชายแดนลาว",
      zh: "呵叻高原，近老挝边境",
    },
    creativeEconomyEdge: {
      en: "NE cultural crossroads; Ban Chiang UNESCO World Heritage Site (prehistoric civilization); Udon Thani Rajabhat University creative programs; strong local food culture (Vietnamese-Thai fusion); UD Town creative retail complex; close cultural ties with Laos (shared Isan heritage); gateway to Northern Laos and Vietnam.",
      th: "สี่แยกวัฒนธรรมอีสาน; แหล่งมรดกโลกยูเนสโกบ้านเชียง (อารยธรรมก่อนประวัติศาสตร์); โปรแกรมสร้างสรรค์ มหาวิทยาลัยราชภัฏอุดรธานี; วัฒนธรรมอาหารท้องถิ่นที่แข็งแกร่ง (ฟิวชั่นเวียดนาม-ไทย); พื้นที่ค้าปลีกสร้างสรรค์ยูดีทาวน์; ความผูกพันทางวัฒนธรรมใกล้ชิดกับลาว (มรดกอีสานร่วมกัน); ประตูสู่ภาคเหนือของลาวและเวียดนาม",
      zh: "东北部文化十字路口；班清联合国教科文组织世界遗产（史前文明）；乌隆他尼皇家大学创意项目；浓厚的地方饮食文化（越泰融合）；UD Town创意零售综合体；与老挝密切的文化联系（共享的伊善遗产）；通往老挝北部和越南的门户。"
    },
    investmentAngle: {
      en: "Cross-border logistics and distribution, heritage tourism (Ban Chiang), creative food and beverage (Vietnamese-Thai fusion cuisine), education and training services for Laos market, GMS creative content production. Lowest-cost major city in the NeEC corridor.",
      th: "โลจิสติกส์และการกระจายสินค้าข้ามพรมแดน การท่องเที่ยวเชิงมรดก (บ้านเชียง) อาหารและเครื่องดื่มเชิงสร้างสรรค์ (อาหารฟิวชั่นเวียดนาม-ไทย) บริการการศึกษาและฝึกอบรมสำหรับตลาดลาว การผลิตเนื้อหาสร้างสรรค์ระดับ GMS เป็นเมืองใหญ่ที่มีต้นทุนต่ำที่สุดในระเบียง NeEC",
      zh: "跨境物流和分销、遗产旅游（班清）、创意食品和饮料（越泰融合美食）、面向老挝市场的教育和培训服务、大湄公河次区域创意内容制作。NeEC走廊成本最低的主要城市。"
    }
  },
};

const FACTS_OBSERVED_AT = "2026-04-28";

function buildFactSources(cityId: string): CityResearchSource[] {
  const city = getCityById(cityId);
  if (!city) return [];

  return [
    {
      id: `${city.id}-facts-data-go-th`,
      category: "dataset",
      observedAt: FACTS_OBSERVED_AT,
      label: {
        en: `data.go.th datasets for ${city.province}`,
        th: `ชุดข้อมูล data.go.th ของ${city.provinceTh}`,
        zh: `${city.province} 的 data.go.th 数据集`,
      },
      url: getOpenDataSearchUrl(city.province),
      usedFor: {
        en: "At-a-glance administrative, population, service, and geography checks.",
        th: "ใช้ตรวจทานข้อมูลพื้นฐานด้านการปกครอง ประชากร บริการ และภูมิศาสตร์",
        zh: "用于核验行政、人口、服务与地理基础信息。",
      },
    },
    {
      id: `${city.id}-facts-dopa`,
      category: "official",
      observedAt: FACTS_OBSERVED_AT,
      label: {
        en: "Department of Provincial Administration population statistics",
        th: "สถิติทะเบียนราษฎร์ กรมการปกครอง",
        zh: "泰国内政部地方行政厅人口统计",
      },
      url: "https://stat.bora.dopa.go.th",
      usedFor: {
        en: "Registered population and administrative baseline.",
        th: "ฐานประชากรทะเบียนราษฎร์และข้อมูลการปกครอง",
        zh: "户籍人口与行政基线。",
      },
    },
  ];
}

export function getCityFacts(cityId: string): CityFacts | undefined {
  const facts = CITY_FACTS[cityId];
  if (!facts) return undefined;

  return {
    ...facts,
    sources: [...(facts.sources ?? []), ...buildFactSources(cityId)],
  };
}
