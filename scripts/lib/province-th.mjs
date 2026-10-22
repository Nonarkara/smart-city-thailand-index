/**
 * Thai province name -> canonical English name.
 *
 * ONE truth, shared by every harvester. NSO, the Pollution Control
 * Department, the Royal Forest Department, the road-death registry and the
 * Ministry of Energy all spell Thai provinces differently: "กรุงเทพ" vs
 * "กรุงเทพมหานคร", "เพชรบรูณ์" vs "เพชรบูรณ์", "สุราษฏร์ธานี" vs
 * "สุราษฎร์ธานี". A label that is not in this map is DROPPED, silently
 * taking that province out of every indicator it appears in. Every alias
 * below exists because a real table spelled it that way.
 */
export const PROVINCE_TH = {  "กรุงเทพมหานคร": "Bangkok", "กรุงเทพฯ": "Bangkok",
  // PCD's Bangkok-area file uses the short form "กรุงเทพ" for the province.
  "กรุงเทพ": "Bangkok",
  "อำนาจเจริญ": "Amnat Charoen", "อ่างทอง": "Ang Thong", "บึงกาฬ": "Bueng Kan",
  "บุรีรัมย์": "Buriram", "ฉะเชิงเทรา": "Chachoengsao", "ชัยนาท": "Chai Nat",
  "ชัยภูมิ": "Chaiyaphum", "จันทบุรี": "Chanthaburi", "เชียงใหม่": "Chiang Mai",
  "เชียงราย": "Chiang Rai", "ชลบุรี": "Chonburi", "ชุมพร": "Chumphon",
  "กาฬสินธุ์": "Kalasin", "กำแพงเพชร": "Kamphaeng Phet", "กาญจนบุรี": "Kanchanaburi",
  "ขอนแก่น": "Khon Kaen", "กระบี่": "Krabi", "ลำปาง": "Lampang", "ลำพูน": "Lamphun",
  "เลย": "Loei", "ลพบุรี": "Lopburi", "แม่ฮ่องสอน": "Mae Hong Son",
  "มหาสารคาม": "Maha Sarakham", "มุกดาหาร": "Mukdahan", "นครนายก": "Nakhon Nayok",
  "นครปฐม": "Nakhon Pathom", "นครพนม": "Nakhon Phanom", "นครราชสีมา": "Nakhon Ratchasima",
  "นครสวรรค์": "Nakhon Sawan", "นครศรีธรรมราช": "Nakhon Si Thammarat", "น่าน": "Nan",
  "นราธิวาส": "Narathiwat", "หนองบัวลำภู": "Nong Bua Lamphu", "หนองคาย": "Nong Khai",
  "นนทบุรี": "Nonthaburi", "ปทุมธานี": "Pathum Thani", "ปัตตานี": "Pattani",
  "พังงา": "Phang Nga", "พัทลุง": "Phatthalung", "พะเยา": "Phayao",
  "เพชรบูรณ์": "Phetchabun", "เพชรบุรี": "Phetchaburi", "พิจิตร": "Phichit",
  "พิษณุโลก": "Phitsanulok", "พระนครศรีอยุธยา": "Phra Nakhon Si Ayutthaya",
  "แพร่": "Phrae", "ภูเก็ต": "Phuket", "ปราจีนบุรี": "Prachinburi",
  "ประจวบคีรีขันธ์": "Prachuap Khiri Khan", "ระนอง": "Ranong", "ระยอง": "Rayong",
  "ร้อยเอ็ด": "Roi Et", "สระแก้ว": "Sa Kaeo", "สกลนคร": "Sakon Nakhon",
  // NSO spells several provinces differently from table to table. Each of
  // these variants was silently dropping a province from EVERY indicator it
  // appeared in, because a label that is not in this map is skipped:
  //   เพชรบรูณ์  — Phetchabun in the household survey (the standard form
  //                เพชรบูรณ์ is used by the permits and ICT tables)
  //   สุราษฏร์ธานี — Surat Thani in the labour force table (ฏ instead of ฎ)
  //   ศรีษะเกษ  — Sisaket in the building permits table (ษ instead of ส)
  //   ราชบุรี / อุตรดิตถ์ — the forms used by the ICT and household tables
  "เพชรบรูณ์": "Phetchabun", "สุราษฏร์ธานี": "Surat Thani", "ศรีษะเกษ": "Sisaket",
  "ราชบุรี": "Ratchaburi", "อุตรดิตถ์": "Uttaradit",
  "สมุทรปราการ": "Samut Prakan", "สมุทรสาคร": "Samut Sakhon", "สมุทรสงคราม": "Samut Songkhram",
  "สระบุรี": "Saraburi", "สตูล": "Satun", "สิงห์บุรี": "Sing Buri", "ศรีสะเกษ": "Sisaket",
  "สงขลา": "Songkhla", "สุโขทัย": "Sukhothai", "สุพรรณบุรี": "Suphan Buri",
  "สุราษฎร์ธานี": "Surat Thani", "สุรินทร์": "Surin", "ตาก": "Tak", "ตรัง": "Trang",
  "ตราด": "Trat", "อุบลราชธานี": "Ubon Ratchathani", "อุดรธานี": "Udon Thani",
  "อุทัยธานี": "Uthai Thani", "อุตราดินแทน": "Uttaradit", "ยะลา": "Yala",
  "ยโสธร": "Yasothon",
};
