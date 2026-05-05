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
