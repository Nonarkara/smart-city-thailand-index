// BOI Investment Promotion Guide 2026 (https://www.boi.go.th/upload/content/BOI_A_Guide_EN.pdf), read 4 Nov 2026.
// Every row cites its printed page. The province lists and activity groups below are copied from the Guide,
// not inferred: nothing here scores, ranks or recommends. A city with no recorded sector gets no industry row.
import type { Locale } from "./types";
import { isEecProvince } from "./eecGeography";

export type L3 = Record<Locale, string>;
export interface Row { key: string; label: L3; text: L3 }

const key = (s: string) => s.toLowerCase().replace(/[^a-z]/g, "");
const set = (...names: string[]) => new Set(names.map(key));
const pg = (...n: number[]): L3 => { const p = n.join("–"); return { en: ` [p.${p}]`, th: ` [น.${p}]`, zh: ` [第${p}页]` }; };
const cite = (t: L3, ...n: number[]): L3 => ({ en: t.en + pg(...n).en, th: t.th + pg(...n).th, zh: t.zh + pg(...n).zh });

// p.30: the 20 provinces with the lowest per-capita income.
const LOW_INCOME = set("Kalasin", "Chaiyaphum", "Nakhon Phanom", "Nan", "Bueng Kan", "Buri Ram", "Phatthalung", "Phrae", "Maha Sarakham", "Mukdahan", "Mae Hong Son", "Yasothon", "Roi Et", "Si Sa Ket", "Sakon Nakhon", "Sa Kaeo", "Surin", "Nong Bua Lam Phu", "Ubon Ratchathani", "Amnat Charoen");
// p.40–41: the four Economic Corridors and their targeted industries.
const I = {
  agri: { en: "agriculture and food", th: "เกษตรและอาหาร", zh: "农业与食品" },
  digital: { en: "digital", th: "ดิจิทัล", zh: "数字产业" },
  creative: { en: "creative industries", th: "อุตสาหกรรมสร้างสรรค์", zh: "创意产业" },
  tourism: { en: "tourism and wellness tourism", th: "การท่องเที่ยวและท่องเที่ยวเชิงสุขภาพ", zh: "旅游与康养旅游" },
  bio: { en: "bio industries", th: "อุตสาหกรรมชีวภาพ", zh: "生物产业" },
  elec: { en: "electrical and electronics", th: "เครื่องใช้ไฟฟ้าและอิเล็กทรอนิกส์", zh: "电气与电子" },
} satisfies Record<string, L3>;
const CORRIDORS: { name: L3; provinces: Set<string>; targets: L3[] }[] = [
  { name: { en: "Northern (NEC)", th: "ภาคเหนือ (NEC)", zh: "北部（NEC）" }, provinces: set("Chiang Mai", "Chiang Rai", "Lamphun", "Lampang"), targets: [I.agri, I.digital, I.creative, I.tourism] },
  { name: { en: "Northeastern (NeEC)", th: "ภาคตะวันออกเฉียงเหนือ (NeEC)", zh: "东北部（NeEC）" }, provinces: set("Nakhon Ratchasima", "Khon Kaen", "Udon Thani", "Nong Khai"), targets: [I.agri, I.bio] },
  { name: { en: "Central-Western (CWEC)", th: "ภาคกลาง-ตะวันตก (CWEC)", zh: "中西部（CWEC）" }, provinces: set("Ayutthaya", "Phra Nakhon Si Ayutthaya", "Nakhon Pathom", "Suphan Buri", "Kanchanaburi"), targets: [I.agri, I.elec] },
  { name: { en: "Southern (SEC)", th: "ภาคใต้ (SEC)", zh: "南部（SEC）" }, provinces: set("Chumphon", "Ranong", "Surat Thani", "Nakhon Si Thammarat"), targets: [I.agri, I.bio, I.tourism] },
];
const join = (xs: L3[], l: Locale) => xs.map(x => x[l]).join(l === "en" ? ", " : "、");
// p.36–37: provinces holding Special Border Economic Zone sub-districts. p.46–48: Southern Border Provinces.
const SEZ = set("Tak", "Mukdahan", "Sa Kaeo", "Trat", "Songkhla", "Chiang Rai", "Nong Khai", "Nakhon Phanom", "Kanchanaburi", "Narathiwat");
const SOUTH = set("Narathiwat", "Pattani", "Yala", "Satun");
const SCI_PARK = set("Pathum Thani", "Chiang Mai", "Khon Kaen", "Songkhla"); // p.32

const TAX: Row = { key: "tax", label: { en: "Tax period", th: "ระยะภาษี", zh: "免税期" }, text: cite({
  en: "Years of corporate income tax exemption by activity group: A1+ 10–13 · A1 8 · A2 8 (capped at the investment) · A3 5 · A4 3 · B none.",
  th: "ปีที่ยกเว้นภาษีเงินได้นิติบุคคลตามกลุ่มกิจกรรม: A1+ 10–13 · A1 8 · A2 8 (ไม่เกินเงินลงทุน) · A3 5 · A4 3 · B ไม่ได้รับ",
  zh: "企业所得税免征年数（按活动组别）：A1+ 10–13 · A1 8 · A2 8（以投资额为上限）· A3 5 · A4 3 · B 无。" }, 14) };

const ESTATE: Row = { key: "estate", label: { en: "Estate", th: "นิคม", zh: "工业区" }, text: cite({
  en: "Inside a BOI-promoted industrial estate or zone: +1 year, unless the activity must be in one.",
  th: "ตั้งในนิคมหรือเขตอุตสาหกรรมที่ BOI ส่งเสริม: เพิ่ม 1 ปี เว้นกิจกรรมที่ต้องตั้งในนิคมอยู่แล้ว",
  zh: "位于 BOI 促进的工业区内：增加 1 年，本就须设在工业区的活动除外。" }, 28) };

const AREA = (label: L3, text: L3, ...n: number[]): Row => ({ key: label.en, label, text: cite(text, ...n) });
const AREA_LABEL: L3 = { en: "Area", th: "พื้นที่", zh: "区域" };
const PARK_LABEL: L3 = { en: "Park", th: "อุทยาน", zh: "园区" };

const EEC_ZONES: Row = AREA(AREA_LABEL, {
  en: "Targeted activities only. One extra route: the promoted zones (EECa, EECi, EECd, EECmd, EECg, EECtp), a science and technology zone, an industrial estate, or an HR-development or R&D project. Added years stop at 13 for A1+ and 8 for A1–A4.",
  th: "เฉพาะกิจกรรมเป้าหมาย เลือกสิทธิเพิ่มได้หนึ่งทาง: พื้นที่ส่งเสริม (EECa, EECi, EECd, EECmd, EECg, EECtp) เขตวิทยาศาสตร์และเทคโนโลยี นิคมอุตสาหกรรม หรือโครงการพัฒนาบุคลากร/วิจัยและพัฒนา ปีที่เพิ่มรวมไม่เกิน 13 ปี สำหรับ A1+ และ 8 ปี สำหรับ A1–A4",
  zh: "仅限目标活动。可另选一项优惠：促进区（EECa、EECi、EECd、EECmd、EECg、EECtp）、科技区、工业区，或人力资源开发/研发项目。累计增加年限 A1+ 不超过 13 年，A1–A4 不超过 8 年。" }, 42, 43);

export interface BoiFacts { rows: Row[]; note: "eec" | "low" | "corridor" | "south" | "sez" | "plain" }

const SECTORS: { test: RegExp; field: L3; acts: { name: L3; group: string }[]; page: number }[] = [
  { test: /petrochem/i, page: 156, field: { en: "Chemicals and petrochemicals", th: "เคมีและปิโตรเคมี", zh: "化工与石化" }, acts: [
    { name: { en: "petrochemicals with carbon capture", th: "ปิโตรเคมีที่ใช้การดักจับคาร์บอน", zh: "采用碳捕集的石化产品" }, group: "A2" },
    { name: { en: "petrochemicals, general technology", th: "ปิโตรเคมีด้วยเทคโนโลยีทั่วไป", zh: "常规技术石化产品" }, group: "A3" },
    { name: { en: "specialty polymers or chemicals", th: "พอลิเมอร์หรือเคมีภัณฑ์พิเศษ", zh: "特种聚合物或化学品" }, group: "A2" } ] },
  { test: /manufactur/i, page: 105, field: { en: "Machinery, vehicles, electronics", th: "เครื่องจักร ยานยนต์ และอิเล็กทรอนิกส์", zh: "机械、车辆与电子" }, acts: [
    { name: { en: "automation machinery", th: "เครื่องจักรอัตโนมัติ", zh: "自动化机械" }, group: "A1" },
    { name: { en: "high-precision machinery", th: "เครื่องจักรความแม่นยำสูง", zh: "高精度机械" }, group: "A2" },
    { name: { en: "EV traction motors", th: "มอเตอร์ขับเคลื่อนรถยนต์ไฟฟ้า", zh: "电动车牵引电机" }, group: "A2" },
    { name: { en: "large-scale semiconductors and ICs", th: "เซมิคอนดักเตอร์และไอซี (ลงทุนขนาดใหญ่)", zh: "大规模半导体与集成电路" }, group: "A2" } ] },
  { test: /agri/i, page: 87, field: { en: "Agriculture, food, biotechnology", th: "เกษตร อาหาร และเทคโนโลยีชีวภาพ", zh: "农业、食品与生物技术" }, acts: [
    { name: { en: "food made with modern technology", th: "อาหารด้วยเทคโนโลยีสมัยใหม่", zh: "现代技术食品加工" }, group: "A3" },
    { name: { en: "organic food", th: "อาหารอินทรีย์", zh: "有机食品" }, group: "A2" },
    { name: { en: "modern agricultural machinery", th: "เครื่องจักรเกษตรสมัยใหม่", zh: "现代农业机械" }, group: "A1" },
    { name: { en: "cold storage, natural refrigerants", th: "ห้องเย็นสารทำความเย็นธรรมชาติ", zh: "天然制冷剂冷库" }, group: "A4" } ] },
  { test: /tourism/i, page: 193, field: { en: "Tourism services", th: "บริการส่งเสริมการท่องเที่ยว", zh: "旅游促进服务" }, acts: [
    { name: { en: "Thai cultural or craft centres", th: "ศูนย์วัฒนธรรมหรือศิลปหัตถกรรมไทย", zh: "泰国文化或工艺中心" }, group: "A2/A3" },
    { name: { en: "museums", th: "พิพิธภัณฑ์", zh: "博物馆" }, group: "A2/A3" },
    { name: { en: "convention halls", th: "ศูนย์ประชุม", zh: "会议中心" }, group: "A2/A3" },
    { name: { en: "international exhibition centres", th: "ศูนย์แสดงสินค้านานาชาติ", zh: "国际展览中心" }, group: "A2/A3" } ] },
  { test: /services/i, page: 175, field: { en: "Digital services", th: "บริการดิจิทัล", zh: "数字服务" }, acts: [
    { name: { en: "software, platforms and content", th: "ซอฟต์แวร์ แพลตฟอร์ม และคอนเทนต์", zh: "软件、平台与内容" }, group: "A2" },
    { name: { en: "cloud services", th: "บริการคลาวด์", zh: "云服务" }, group: "A2" },
    { name: { en: "smart city area development", th: "การพัฒนาพื้นที่เมืองอัจฉริยะ", zh: "智慧城市区域开发" }, group: "A2" },
    { name: { en: "smart city systems", th: "ระบบเมืองอัจฉริยะ", zh: "智慧城市系统" }, group: "A2" } ] },
];

// The largest named share in a free-text composition such as "services 52%, manufacturing 30%".
export const topSector = (comp?: string): string | null => {
  const best = (comp ?? "").split(",").map(s => s.trim().match(/^(.*?)\s+(\d+)%$/)).filter((m): m is RegExpMatchArray => !!m).sort((a, b) => +b[2] - +a[2])[0];
  return best ? best[1] : null;
};

const industryRow = (comp?: string): Row | null => {
  const top = topSector(comp);
  const s = top && SECTORS.find(x => x.test.test(top));
  if (!s) return null;
  const list = (l: Locale) => s.acts.map(a => `${a.name[l]} (${a.group})`).join(l === "en" ? ", " : "、");
  const t = (l: Locale, lead: string) => `${lead} ${list(l)}.`;
  return { key: "industry", label: { en: "Industry", th: "อุตสาหกรรม", zh: "行业" }, text: cite({
    en: t("en", `Closest BOI field to this city's largest recorded sector, ${s.field.en}: `),
    th: t("th", `สาขา BOI ใกล้ภาคที่ใหญ่ที่สุดในบันทึกของเมืองนี้ คือ ${s.field.th}:`),
    zh: t("zh", `最接近该市记录中最大行业的 BOI 领域，${s.field.zh}：`) }, s.page) };
};

export function boiFacts(province: string, comp?: string): BoiFacts {
  const p = key(province);
  const rows: Row[] = [TAX];
  let note: BoiFacts["note"] = "plain";
  if (isEecProvince(province)) { note = "eec"; rows.push(EEC_ZONES); }
  if (LOW_INCOME.has(p)) {
    note = "low";
    rows.push(AREA(AREA_LABEL, {
      en: "One of the 20 lowest-income provinces: 3 more years (A1 and A2: 50% off for 5 years instead). Transport, electricity and water costs deductible twice for 10 years, plus 25% off facility costs.",
      th: "หนึ่งใน 20 จังหวัดรายได้ต่ำสุด: เพิ่ม 3 ปี (A1 และ A2: ลดภาษี 50% นาน 5 ปีแทน) หักค่าขนส่ง ไฟฟ้า น้ำประปาได้สองเท่านาน 10 ปี และหักค่าสิ่งอำนวยความสะดวกเพิ่ม 25%",
      zh: "20 个收入最低的府之一：增加 3 年（A1 和 A2 改为减征 50% 5 年）。运输、电力、水费 10 年内双倍扣除，设施成本另扣 25%。" }, 30));
  }
  const corridor = CORRIDORS.find(c => c.provinces.has(p));
  if (corridor) {
    note = note === "plain" ? "corridor" : note;
    rows.push(AREA(AREA_LABEL, {
      en: `${corridor.name.en} corridor, targeted activities only: ${join(corridor.targets, "en")}. HR-development or R&D projects add years; stop at 13 for A1+, 8 for A1–A4.`,
      th: `เขตเศรษฐกิจ${corridor.name.th} เฉพาะกิจกรรมเป้าหมาย: ${join(corridor.targets, "th")} โครงการพัฒนาบุคลากรหรือวิจัยและพัฒนาได้ปีเพิ่ม รวมไม่เกิน 13 ปี (A1+) และ 8 ปี (A1–A4)`,
      zh: `${corridor.name.zh}走廊，仅限目标活动：${join(corridor.targets, "zh")}。人力资源开发或研发项目可增加年限，A1+ 不超过 13 年，A1–A4 不超过 8 年。` }, 40, 42));
  }
  if (SEZ.has(p)) {
    note = note === "plain" ? "sez" : note;
    rows.push(AREA(AREA_LABEL, {
      en: "Border Economic Zone: listed sub-districts only, not the whole province. 13 targeted activities get 8 years (capped) plus 50% off for 5; costs deductible twice for 10 years, 25% off facility costs.",
      th: "เขตเศรษฐกิจพิเศษชายแดน: เฉพาะตำบลที่ระบุ ไม่ใช่ทั้งจังหวัด กิจกรรมเป้าหมาย 13 รายการได้ 8 ปี (จำกัดวงเงิน) และลดภาษี 50% อีก 5 ปี หักค่าใช้จ่ายสองเท่านาน 10 ปี หักค่าสิ่งอำนวยความสะดวกเพิ่ม 25%",
      zh: "边境经济特区：仅限列明的乡，非全府。13 项目标活动享 8 年（设上限）再减征 50% 5 年；费用 10 年内双倍扣除，设施成本另扣 25%。" }, 36, 38));
  }
  if (SOUTH.has(p) || p === "songkhla") {
    note = note === "plain" || note === "sez" ? "south" : note;
    rows.push(AREA(AREA_LABEL, p === "songkhla" ? {
      en: "Southern Border measure: only Chana, Na Thawi, Saba Yoi and Thepha districts. Relaxed conditions; minimum capital ฿500,000 (excluding land and working capital).",
      th: "มาตรการชายแดนภาคใต้: เฉพาะอำเภอจะนะ นาทวี สะบ้าย้อย และเทพา ผ่อนปรนเงื่อนไข เงินลงทุนขั้นต่ำ 500,000 บาท (ไม่รวมที่ดินและทุนหมุนเวียน)",
      zh: "南部边境措施：仅限那拉提瓦、那他威、沙眉育、特帕四县。条件放宽；最低资本 50 万泰铢（不含土地和营运资金）。" } : {
      en: "Southern Border measure: relaxed conditions; minimum capital ฿500,000 (excluding land and working capital); used domestic machinery up to ฿10 million; apply by the end of 2027.",
      th: "มาตรการชายแดนภาคใต้: ผ่อนปรนเงื่อนไข เงินลงทุนขั้นต่ำ 500,000 บาท (ไม่รวมที่ดินและทุนหมุนเวียน) เครื่องจักรมือสองในประเทศไม่เกิน 10 ล้านบาท ยื่นภายในสิ้นปี 2570",
      zh: "南部边境措施：条件放宽；最低资本 50 万泰铢（不含土地和营运资金）；国内二手机械不超过 1000 万泰铢；2027 年底前申请。" }, 46, 48));
  }
  if (SCI_PARK.has(p)) {
    rows.push(AREA(PARK_LABEL, {
      en: "Science and Technology Park: target activities inside a park or zone (biotech, nanotech, advanced materials, electronics and engineering design, R&D, labs, calibration, training) get extra incentives.",
      th: "อุทยานวิทยาศาสตร์และเทคโนโลยี: กิจกรรมเป้าหมายในอุทยานหรือเขต (เทคโนโลยีชีวภาพ นาโน วัสดุขั้นสูง ออกแบบอิเล็กทรอนิกส์และวิศวกรรม วิจัยและพัฒนา ห้องปฏิบัติการ สอบเทียบ ฝึกอาชีพ) ได้สิทธิเพิ่ม",
      zh: "科学技术园区：园区或科技区内的目标活动（生物、纳米、先进材料、电子与工程设计、研发、实验室、校准、培训）可获额外优惠。" }, 32, 33));
  }
  rows.push(ESTATE);
  const ind = industryRow(comp);
  if (ind) rows.push(ind);
  return { rows, note };
}
