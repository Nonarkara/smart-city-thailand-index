// ---------------------------------------------------------------------------
// Registered Smart City Promotion Zones — 160+ cities
// ---------------------------------------------------------------------------
// These cities have submitted smart city proposals to depa but have
// insufficient data for full scoring. They receive default baseline
// scores and are shown as "registered" in the rankings.
// ---------------------------------------------------------------------------

import type { SmartCity, CityScores, SmartDimension } from "./types.ts";
import { computeComposite, assignTier } from "./cityData.ts";

const DEFAULT_SCORES: CityScores = {
  livability: 40, economy: 40, safety: 40, wellbeing: 40,
  environment: 40, hospitality: 40, digital: 30,
};

interface RegCity {
  id: string;
  nameEn: string;
  nameTh: string;
  province: string;
  provinceTh: string;
  region: SmartCity["region"];
  lat: number;
  lng: number;
  dims?: SmartDimension[];
}

function reg(c: RegCity): SmartCity {
  const scores = { ...DEFAULT_SCORES };
  const composite = computeComposite(scores);
  return {
    id: c.id,
    nameEn: c.nameEn,
    nameTh: c.nameTh,
    province: c.province,
    provinceTh: c.provinceTh,
    region: c.region,
    status: "registered",
    reality: "planned",
    smartDimensions: c.dims ?? ["living", "governance"],
    scores,
    metrics: {},
    compositeScore: composite,
    tier: assignTier(composite),
    tagline: "Promotion zone — awaiting sufficient data for full assessment.",
    taglineTh: "เขตส่งเสริม — รอข้อมูลเพียงพอสำหรับการประเมินเต็มรูปแบบ",
    highlights: [],
    dataConfidence: "low",
  };
}

// Provinces that have submitted smart city plans (from depa 173 promotion zones)
const registeredEntries: RegCity[] = [
  // ─── NORTH ───
  { id: "reg-chiang-mai-pao", nameEn: "Chiang Mai PAO", nameTh: "อบจ.เชียงใหม่", province: "Chiang Mai", provinceTh: "เชียงใหม่", region: "north", lat: 18.78, lng: 98.99 },
  { id: "reg-lamphun", nameEn: "Lamphun Municipality", nameTh: "เทศบาลเมืองลำพูน", province: "Lamphun", provinceTh: "ลำพูน", region: "north", lat: 18.57, lng: 99.00 },
  { id: "reg-lampang-pao", nameEn: "Lampang PAO", nameTh: "อบจ.ลำปาง", province: "Lampang", provinceTh: "ลำปาง", region: "north", lat: 18.30, lng: 99.50 },
  { id: "reg-uttaradit", nameEn: "Uttaradit Municipality", nameTh: "เทศบาลเมืองอุตรดิตถ์", province: "Uttaradit", provinceTh: "อุตรดิตถ์", region: "north", lat: 17.63, lng: 100.10 },
  { id: "reg-sukhothai", nameEn: "Sukhothai Municipality", nameTh: "เทศบาลเมืองสุโขทัย", province: "Sukhothai", provinceTh: "สุโขทัย", region: "north", lat: 17.01, lng: 99.82 },
  { id: "reg-phrae", nameEn: "Phrae Municipality", nameTh: "เทศบาลเมืองแพร่", province: "Phrae", provinceTh: "แพร่", region: "north", lat: 18.14, lng: 100.14 },
  { id: "reg-phayao", nameEn: "Phayao Municipality", nameTh: "เทศบาลเมืองพะเยา", province: "Phayao", provinceTh: "พะเยา", region: "north", lat: 19.17, lng: 99.90 },
  { id: "reg-mae-hong-son", nameEn: "Mae Hong Son Municipality", nameTh: "เทศบาลเมืองแม่ฮ่องสอน", province: "Mae Hong Son", provinceTh: "แม่ฮ่องสอน", region: "north", lat: 19.30, lng: 97.97 },
  { id: "reg-kamphaeng-phet", nameEn: "Kamphaeng Phet Municipality", nameTh: "เทศบาลเมืองกำแพงเพชร", province: "Kamphaeng Phet", provinceTh: "กำแพงเพชร", region: "north", lat: 16.48, lng: 99.52 },
  { id: "reg-uthai-thani", nameEn: "Uthai Thani Municipality", nameTh: "เทศบาลเมืองอุทัยธานี", province: "Uthai Thani", provinceTh: "อุทัยธานี", region: "north", lat: 15.38, lng: 100.02 },
  { id: "reg-nakhon-sawan-pao", nameEn: "Nakhon Sawan PAO", nameTh: "อบจ.นครสวรรค์", province: "Nakhon Sawan", provinceTh: "นครสวรรค์", region: "north", lat: 15.72, lng: 100.13 },
  { id: "reg-phetchabun", nameEn: "Phetchabun Municipality", nameTh: "เทศบาลเมืองเพชรบูรณ์", province: "Phetchabun", provinceTh: "เพชรบูรณ์", region: "north", lat: 16.42, lng: 101.16 },
  // ─── CENTRAL ───
  { id: "reg-ayutthaya", nameEn: "Phra Nakhon Si Ayutthaya", nameTh: "พระนครศรีอยุธยา", province: "Ayutthaya", provinceTh: "อยุธยา", region: "central", lat: 14.35, lng: 100.57 },
  { id: "reg-pathum-thani", nameEn: "Pathum Thani Municipality", nameTh: "เทศบาลเมืองปทุมธานี", province: "Pathum Thani", provinceTh: "ปทุมธานี", region: "central", lat: 14.02, lng: 100.53 },
  { id: "reg-nakhon-pathom", nameEn: "Nakhon Pathom Municipality", nameTh: "เทศบาลนครนครปฐม", province: "Nakhon Pathom", provinceTh: "นครปฐม", region: "central", lat: 13.82, lng: 100.04 },
  { id: "reg-samut-sakhon", nameEn: "Samut Sakhon Municipality", nameTh: "เทศบาลนครสมุทรสาคร", province: "Samut Sakhon", provinceTh: "สมุทรสาคร", region: "central", lat: 13.55, lng: 100.27 },
  { id: "reg-samut-songkhram", nameEn: "Samut Songkhram Municipality", nameTh: "เทศบาลเมืองสมุทรสงคราม", province: "Samut Songkhram", provinceTh: "สมุทรสงคราม", region: "central", lat: 13.41, lng: 100.00 },
  { id: "reg-ang-thong", nameEn: "Ang Thong Municipality", nameTh: "เทศบาลเมืองอ่างทอง", province: "Ang Thong", provinceTh: "อ่างทอง", region: "central", lat: 14.59, lng: 100.45 },
  { id: "reg-singburi", nameEn: "Sing Buri Municipality", nameTh: "เทศบาลเมืองสิงห์บุรี", province: "Sing Buri", provinceTh: "สิงห์บุรี", region: "central", lat: 14.89, lng: 100.40 },
  { id: "reg-lop-buri", nameEn: "Lop Buri Municipality", nameTh: "เทศบาลเมืองลพบุรี", province: "Lop Buri", provinceTh: "ลพบุรี", region: "central", lat: 14.80, lng: 100.62 },
  { id: "reg-saraburi", nameEn: "Saraburi Municipality", nameTh: "เทศบาลเมืองสระบุรี", province: "Saraburi", provinceTh: "สระบุรี", region: "central", lat: 14.53, lng: 100.91 },
  { id: "reg-chainat", nameEn: "Chainat Municipality", nameTh: "เทศบาลเมืองชัยนาท", province: "Chainat", provinceTh: "ชัยนาท", region: "central", lat: 15.19, lng: 100.13 },
  { id: "reg-suphan-buri", nameEn: "Suphan Buri Municipality", nameTh: "เทศบาลเมืองสุพรรณบุรี", province: "Suphan Buri", provinceTh: "สุพรรณบุรี", region: "central", lat: 14.47, lng: 100.12 },
  { id: "reg-kanchanaburi", nameEn: "Kanchanaburi Municipality", nameTh: "เทศบาลเมืองกาญจนบุรี", province: "Kanchanaburi", provinceTh: "กาญจนบุรี", region: "central", lat: 14.02, lng: 99.53 },
  { id: "reg-ratchaburi", nameEn: "Ratchaburi Municipality", nameTh: "เทศบาลเมืองราชบุรี", province: "Ratchaburi", provinceTh: "ราชบุรี", region: "central", lat: 13.54, lng: 99.81 },
  { id: "reg-phetchaburi", nameEn: "Phetchaburi Municipality", nameTh: "เทศบาลเมืองเพชรบุรี", province: "Phetchaburi", provinceTh: "เพชรบุรี", region: "central", lat: 13.11, lng: 99.95 },
  { id: "reg-prachuap", nameEn: "Prachuap Khiri Khan", nameTh: "ประจวบคีรีขันธ์", province: "Prachuap Khiri Khan", provinceTh: "ประจวบคีรีขันธ์", region: "central", lat: 11.81, lng: 99.80 },
  { id: "reg-hua-hin", nameEn: "Hua Hin Municipality", nameTh: "เทศบาลเมืองหัวหิน", province: "Prachuap Khiri Khan", provinceTh: "ประจวบคีรีขันธ์", region: "central", lat: 12.57, lng: 99.96 },
  // ─── NORTHEAST (ISAN) ───
  { id: "reg-udon-thani", nameEn: "Udon Thani Municipality", nameTh: "เทศบาลนครอุดรธานี", province: "Udon Thani", provinceTh: "อุดรธานี", region: "northeast", lat: 17.42, lng: 102.79 },
  { id: "reg-nong-khai", nameEn: "Nong Khai Municipality", nameTh: "เทศบาลเมืองหนองคาย", province: "Nong Khai", provinceTh: "หนองคาย", region: "northeast", lat: 17.87, lng: 102.74 },
  { id: "reg-sakon-nakhon", nameEn: "Sakon Nakhon Municipality", nameTh: "เทศบาลเมืองสกลนคร", province: "Sakon Nakhon", provinceTh: "สกลนคร", region: "northeast", lat: 17.16, lng: 104.15 },
  { id: "reg-nakhon-phanom", nameEn: "Nakhon Phanom Municipality", nameTh: "เทศบาลเมืองนครพนม", province: "Nakhon Phanom", provinceTh: "นครพนม", region: "northeast", lat: 17.39, lng: 104.78 },
  { id: "reg-mukdahan", nameEn: "Mukdahan Municipality", nameTh: "เทศบาลเมืองมุกดาหาร", province: "Mukdahan", provinceTh: "มุกดาหาร", region: "northeast", lat: 16.54, lng: 104.72 },
  { id: "reg-roi-et", nameEn: "Roi Et Municipality", nameTh: "เทศบาลเมืองร้อยเอ็ด", province: "Roi Et", provinceTh: "ร้อยเอ็ด", region: "northeast", lat: 16.05, lng: 103.65 },
  { id: "reg-kalasin", nameEn: "Kalasin Municipality", nameTh: "เทศบาลเมืองกาฬสินธุ์", province: "Kalasin", provinceTh: "กาฬสินธุ์", region: "northeast", lat: 16.43, lng: 103.51 },
  { id: "reg-maha-sarakham", nameEn: "Maha Sarakham Municipality", nameTh: "เทศบาลเมืองมหาสารคาม", province: "Maha Sarakham", provinceTh: "มหาสารคาม", region: "northeast", lat: 16.18, lng: 103.30 },
  { id: "reg-chaiyaphum", nameEn: "Chaiyaphum Municipality", nameTh: "เทศบาลเมืองชัยภูมิ", province: "Chaiyaphum", provinceTh: "ชัยภูมิ", region: "northeast", lat: 15.81, lng: 102.03 },
  { id: "reg-buriram", nameEn: "Buriram Municipality", nameTh: "เทศบาลเมืองบุรีรัมย์", province: "Buriram", provinceTh: "บุรีรัมย์", region: "northeast", lat: 14.99, lng: 103.10 },
  { id: "reg-surin", nameEn: "Surin Municipality", nameTh: "เทศบาลเมืองสุรินทร์", province: "Surin", provinceTh: "สุรินทร์", region: "northeast", lat: 14.88, lng: 103.49 },
  { id: "reg-sisaket", nameEn: "Sisaket Municipality", nameTh: "เทศบาลเมืองศรีสะเกษ", province: "Sisaket", provinceTh: "ศรีสะเกษ", region: "northeast", lat: 15.12, lng: 104.33 },
  { id: "reg-amnat-charoen", nameEn: "Amnat Charoen Municipality", nameTh: "เทศบาลเมืองอำนาจเจริญ", province: "Amnat Charoen", provinceTh: "อำนาจเจริญ", region: "northeast", lat: 15.87, lng: 104.63 },
  { id: "reg-yasothon", nameEn: "Yasothon Municipality", nameTh: "เทศบาลเมืองยโสธร", province: "Yasothon", provinceTh: "ยโสธร", region: "northeast", lat: 15.79, lng: 104.15 },
  { id: "reg-loei", nameEn: "Loei Municipality", nameTh: "เทศบาลเมืองเลย", province: "Loei", provinceTh: "เลย", region: "northeast", lat: 17.49, lng: 101.72 },
  { id: "reg-nong-bua-lamphu", nameEn: "Nong Bua Lamphu Municipality", nameTh: "เทศบาลเมืองหนองบัวลำภู", province: "Nong Bua Lamphu", provinceTh: "หนองบัวลำภู", region: "northeast", lat: 17.22, lng: 102.44 },
  { id: "reg-bueng-kan", nameEn: "Bueng Kan Municipality", nameTh: "เทศบาลเมืองบึงกาฬ", province: "Bueng Kan", provinceTh: "บึงกาฬ", region: "northeast", lat: 18.36, lng: 103.65 },
  // ─── EAST ───
  { id: "reg-chon-buri-muni", nameEn: "Chon Buri Municipality", nameTh: "เทศบาลเมืองชลบุรี", province: "Chon Buri", provinceTh: "ชลบุรี", region: "east", lat: 13.36, lng: 100.98 },
  { id: "reg-pattaya", nameEn: "Pattaya City", nameTh: "เมืองพัทยา", province: "Chon Buri", provinceTh: "ชลบุรี", region: "east", lat: 12.93, lng: 100.88 },
  { id: "reg-sri-racha", nameEn: "Sri Racha Municipality", nameTh: "เทศบาลเมืองศรีราชา", province: "Chon Buri", provinceTh: "ชลบุรี", region: "east", lat: 13.17, lng: 100.93 },
  { id: "reg-trat", nameEn: "Trat Municipality", nameTh: "เทศบาลเมืองตราด", province: "Trat", provinceTh: "ตราด", region: "east", lat: 12.24, lng: 102.51 },
  { id: "reg-sa-kaeo", nameEn: "Sa Kaeo Municipality", nameTh: "เทศบาลเมืองสระแก้ว", province: "Sa Kaeo", provinceTh: "สระแก้ว", region: "east", lat: 13.82, lng: 102.07 },
  { id: "reg-prachin-buri", nameEn: "Prachin Buri Municipality", nameTh: "เทศบาลเมืองปราจีนบุรี", province: "Prachin Buri", provinceTh: "ปราจีนบุรี", region: "east", lat: 14.05, lng: 101.37 },
  { id: "reg-nakhon-nayok", nameEn: "Nakhon Nayok Municipality", nameTh: "เทศบาลเมืองนครนายก", province: "Nakhon Nayok", provinceTh: "นครนายก", region: "east", lat: 14.21, lng: 101.21 },
  // ─── SOUTH ───
  { id: "reg-surat-thani", nameEn: "Surat Thani Municipality", nameTh: "เทศบาลนครสุราษฎร์ธานี", province: "Surat Thani", provinceTh: "สุราษฎร์ธานี", region: "south", lat: 9.14, lng: 99.33 },
  { id: "reg-nakhon-si-pao", nameEn: "Nakhon Si Thammarat PAO", nameTh: "อบจ.นครศรีธรรมราช", province: "Nakhon Si Thammarat", provinceTh: "นครศรีธรรมราช", region: "south", lat: 8.44, lng: 99.97 },
  { id: "reg-chumphon", nameEn: "Chumphon Municipality", nameTh: "เทศบาลเมืองชุมพร", province: "Chumphon", provinceTh: "ชุมพร", region: "south", lat: 10.49, lng: 99.18 },
  { id: "reg-ranong", nameEn: "Ranong Municipality", nameTh: "เทศบาลเมืองระนอง", province: "Ranong", provinceTh: "ระนอง", region: "south", lat: 9.97, lng: 98.64 },
  { id: "reg-phatthalung", nameEn: "Phatthalung Municipality", nameTh: "เทศบาลเมืองพัทลุง", province: "Phatthalung", provinceTh: "พัทลุง", region: "south", lat: 7.62, lng: 100.08 },
  { id: "reg-songkhla-pao", nameEn: "Songkhla PAO", nameTh: "อบจ.สงขลา", province: "Songkhla", provinceTh: "สงขลา", region: "south", lat: 7.20, lng: 100.60 },
  { id: "reg-phuket-pao", nameEn: "Phuket PAO", nameTh: "อบจ.ภูเก็ต", province: "Phuket", provinceTh: "ภูเก็ต", region: "south", lat: 7.89, lng: 98.40 },
  { id: "reg-krabi-muni", nameEn: "Krabi Municipality", nameTh: "เทศบาลเมืองกระบี่", province: "Krabi", provinceTh: "กระบี่", region: "south", lat: 8.08, lng: 98.92 },
  { id: "reg-trang-muni", nameEn: "Trang Municipality", nameTh: "เทศบาลนครตรัง", province: "Trang", provinceTh: "ตรัง", region: "south", lat: 7.56, lng: 99.62 },
  { id: "reg-yala-pao", nameEn: "Yala PAO", nameTh: "อบจ.ยะลา", province: "Yala", provinceTh: "ยะลา", region: "south", lat: 6.55, lng: 101.29 },
  { id: "reg-pattani-muni", nameEn: "Pattani Municipality", nameTh: "เทศบาลเมืองปัตตานี", province: "Pattani", provinceTh: "ปัตตานี", region: "south", lat: 6.88, lng: 101.26 },
  { id: "reg-narathiwat-muni", nameEn: "Narathiwat Municipality", nameTh: "เทศบาลเมืองนราธิวาส", province: "Narathiwat", provinceTh: "นราธิวาส", region: "south", lat: 6.44, lng: 101.83 },
  // ─── BANGKOK ───
  { id: "reg-bangkok-noi", nameEn: "Bangkok Noi District", nameTh: "เขตบางกอกน้อย", province: "Bangkok", provinceTh: "กรุงเทพฯ", region: "bangkok", lat: 13.77, lng: 100.47 },
  { id: "reg-bang-rak", nameEn: "Bang Rak District", nameTh: "เขตบางรัก", province: "Bangkok", provinceTh: "กรุงเทพฯ", region: "bangkok", lat: 13.73, lng: 100.52 },
  { id: "reg-din-daeng", nameEn: "Din Daeng District", nameTh: "เขตดินแดง", province: "Bangkok", provinceTh: "กรุงเทพฯ", region: "bangkok", lat: 13.77, lng: 100.55 },
  { id: "reg-chatuchak", nameEn: "Chatuchak District", nameTh: "เขตจตุจักร", province: "Bangkok", provinceTh: "กรุงเทพฯ", region: "bangkok", lat: 13.82, lng: 100.55 },
  { id: "reg-bang-sue", nameEn: "Bang Sue District", nameTh: "เขตบางซื่อ", province: "Bangkok", provinceTh: "กรุงเทพฯ", region: "bangkok", lat: 13.82, lng: 100.52, dims: ["economy", "energy", "environment", "governance", "living", "mobility", "people"] },
];

export const registeredCities: SmartCity[] = registeredEntries.map(reg);
