// ---------------------------------------------------------------------------
// International Partner Network — 50+ organizations across 15+ countries
// Source: depa international cooperation document (2566-2567)
// ---------------------------------------------------------------------------

export interface Partner {
  id: string;
  name: string;
  country: string;
  countryTh: string;
  flag: string;
  lat: number;
  lng: number;
  type: "government" | "multilateral" | "university" | "corporate" | "ngo" | "event";
  focusEn: string;
  focusTh: string;
  url?: string;
}

export const partners: Partner[] = [
  // ─── JAPAN ───
  { id: "jica", name: "JICA", country: "Japan", countryTh: "ญี่ปุ่น", flag: "🇯🇵", lat: 35.68, lng: 139.69, type: "government", focusEn: "Technical cooperation, TOD, infrastructure loans ($1.5B/yr budget)", focusTh: "ความร่วมมือทางเทคนิค TOD โครงสร้างพื้นฐาน" },
  { id: "mlit", name: "MLIT Japan", country: "Japan", countryTh: "ญี่ปุ่น", flag: "🇯🇵", lat: 35.70, lng: 139.75, type: "government", focusEn: "Smart city infrastructure, sustainable urban development", focusTh: "โครงสร้างพื้นฐานเมืองอัจฉริยะ" },
  { id: "jasca", name: "JASCA", country: "Japan", countryTh: "ญี่ปุ่น", flag: "🇯🇵", lat: 35.66, lng: 139.73, type: "ngo", focusEn: "250B yen ASEAN fund, Smart JAMP, private sector coordination", focusTh: "กองทุน 250,000 ล้านเยน Smart JAMP" },

  // ─── SOUTH KOREA ───
  { id: "kdi", name: "Korea Development Institute", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 37.55, lng: 127.00, type: "government", focusEn: "Policy research, smart city economics analysis", focusTh: "วิจัยนโยบาย วิเคราะห์เศรษฐกิจเมืองอัจฉริยะ" },
  { id: "kotra", name: "KOTRA", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 37.52, lng: 127.05, type: "government", focusEn: "Trade promotion, 5G/IoT investment matching", focusTh: "ส่งเสริมการค้า จับคู่การลงทุน 5G/IoT" },
  { id: "bipa", name: "BIPA / NIPA / MSIT", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 35.17, lng: 129.07, type: "government", focusEn: "5G infrastructure, Busan smart city model", focusTh: "โครงสร้างพื้นฐาน 5G โมเดลเมืองอัจฉริยะปูซาน" },
  { id: "yonsei", name: "Yonsei Smart City Lab", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 37.56, lng: 126.94, type: "university", focusEn: "AI traffic management, IoT urban research", focusTh: "AI จัดการจราจร วิจัย IoT เมือง" },
  { id: "sca-korea", name: "Smart City Association Korea", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 37.50, lng: 127.02, type: "ngo", focusEn: "Public-private smart city network building", focusTh: "สร้างเครือข่ายเมืองอัจฉริยะรัฐ-เอกชน" },
  { id: "unpog", name: "UNPOG", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 36.37, lng: 127.37, type: "multilateral", focusEn: "UN governance innovation, smart city training", focusTh: "นวัตกรรมกำกับดูแล UN ฝึกอบรมเมืองอัจฉริยะ" },
  { id: "unitar", name: "UNITAR Jeju", country: "South Korea", countryTh: "เกาหลีใต้", flag: "🇰🇷", lat: 33.49, lng: 126.53, type: "multilateral", focusEn: "Smart city leadership training for global leaders", focusTh: "ฝึกอบรมผู้นำเมืองอัจฉริยะระดับโลก" },

  // ─── USA ───
  { id: "usascp", name: "USASCP", country: "USA", countryTh: "สหรัฐอเมริกา", flag: "🇺🇸", lat: 38.90, lng: -77.04, type: "government", focusEn: "Phuket-Milwaukee WiSE, Bangkok energy grid, USTDA grants", focusTh: "ภูเก็ต-มิลวอกี WiSE กริดพลังงานกรุงเทพฯ ทุน USTDA" },
  { id: "scc", name: "Smart Cities Council", country: "USA", countryTh: "สหรัฐอเมริกา", flag: "🇺🇸", lat: 37.77, lng: -122.42, type: "ngo", focusEn: "Global smart city advisory and solutions network", focusTh: "เครือข่ายที่ปรึกษาเมืองอัจฉริยะระดับโลก" },
  { id: "usdot", name: "U.S. DOT", country: "USA", countryTh: "สหรัฐอเมริกา", flag: "🇺🇸", lat: 38.89, lng: -77.02, type: "government", focusEn: "Autonomous vehicles, smart transit systems", focusTh: "ยานยนต์ไร้คนขับ ระบบขนส่งอัจฉริยะ" },
  { id: "crdf", name: "CRDF Global", country: "USA", countryTh: "สหรัฐอเมริกา", flag: "🇺🇸", lat: 38.92, lng: -77.07, type: "ngo", focusEn: "Research collaboration, innovation grants", focusTh: "ความร่วมมือวิจัย ทุนนวัตกรรม" },

  // ─── UK ───
  { id: "fcdo", name: "UK FCDO / Prosperity Fund", country: "UK", countryTh: "สหราชอาณาจักร", flag: "🇬🇧", lat: 51.50, lng: -0.12, type: "government", focusEn: "Smart City Handbook, Bangkok flood management, Global Future Cities", focusTh: "คู่มือเมืองอัจฉริยะ จัดการน้ำท่วมกรุงเทพฯ" },

  // ─── AUSTRIA ───
  { id: "advantage-austria", name: "Advantage Austria", country: "Austria", countryTh: "ออสเตรีย", flag: "🇦🇹", lat: 48.21, lng: 16.37, type: "government", focusEn: "Vienna smart city expertise, technology exchange MOU", focusTh: "ความเชี่ยวชาญเมืองอัจฉริยะเวียนนา MOU แลกเปลี่ยนเทคโนโลยี" },
  { id: "uiv", name: "Urban Innovation Vienna", country: "Austria", countryTh: "ออสเตรีย", flag: "🇦🇹", lat: 48.23, lng: 16.40, type: "ngo", focusEn: "Smart waste, renewable energy systems from Vienna", focusTh: "ขยะอัจฉริยะ ระบบพลังงานหมุนเวียนจากเวียนนา" },
  { id: "aspern", name: "Aspern Mobility Lab", country: "Austria", countryTh: "ออสเตรีย", flag: "🇦🇹", lat: 48.22, lng: 16.50, type: "corporate", focusEn: "Autonomous vehicles, smart transit R&D", focusTh: "ยานยนต์ไร้คนขับ R&D ขนส่งอัจฉริยะ" },

  // ─── TAIWAN ───
  { id: "scse-taipei", name: "SCSE / Taipei Computer Assoc.", country: "Taiwan", countryTh: "ไต้หวัน", flag: "🇹🇼", lat: 25.03, lng: 121.57, type: "event", focusEn: "World's largest smart city expo — SLIC V2 launched here", focusTh: "งานเมืองอัจฉริยะใหญ่สุดในโลก — เปิดตัว SLIC V2 ที่นี่" },
  { id: "moda-taiwan", name: "Ministry of Digital Affairs", country: "Taiwan", countryTh: "ไต้หวัน", flag: "🇹🇼", lat: 25.04, lng: 121.53, type: "government", focusEn: "Digital policy, cybersecurity, Presidential Hackathon award", focusTh: "นโยบายดิจิทัล ความปลอดภัยไซเบอร์ รางวัล Presidential Hackathon" },

  // ─── SINGAPORE ───
  { id: "alibaba-cloud", name: "Alibaba Cloud APAC", country: "Singapore", countryTh: "สิงคโปร์", flag: "🇸🇬", lat: 1.29, lng: 103.85, type: "corporate", focusEn: "Cloud infrastructure for smart city data platforms", focusTh: "โครงสร้างพื้นฐานคลาวด์สำหรับแพลตฟอร์มข้อมูลเมือง" },
  { id: "sp-digital-twin", name: "Singapore Polytechnic Digital Twin Lab", country: "Singapore", countryTh: "สิงคโปร์", flag: "🇸🇬", lat: 1.31, lng: 103.78, type: "university", focusEn: "Digital twin R&D for urban simulation", focusTh: "R&D Digital Twin สำหรับจำลองเมือง" },
  { id: "govinsider", name: "GovInsider", country: "Singapore", countryTh: "สิงคโปร์", flag: "🇸🇬", lat: 1.30, lng: 103.83, type: "ngo", focusEn: "Media platform for Asian govtech innovation stories", focusTh: "แพลตฟอร์มสื่อนวัตกรรมภาครัฐเอเชีย" },
  { id: "smu", name: "SMU Bangkok Office", country: "Singapore", countryTh: "สิงคโปร์", flag: "🇸🇬", lat: 1.30, lng: 103.85, type: "university", focusEn: "Data analytics training, smart city management courses", focusTh: "ฝึกอบรมวิเคราะห์ข้อมูล หลักสูตรจัดการเมืองอัจฉริยะ" },

  // ─── MALAYSIA ───
  { id: "mdec", name: "MDEC", country: "Malaysia", countryTh: "มาเลเซีย", flag: "🇲🇾", lat: 3.14, lng: 101.69, type: "government", focusEn: "Malaysia Digital Hub model, startup incubation", focusTh: "โมเดล Malaysia Digital Hub บ่มเพาะสตาร์ทอัพ" },
  { id: "sdec", name: "Sarawak DEC", country: "Malaysia", countryTh: "มาเลเซีย", flag: "🇲🇾", lat: 1.55, lng: 110.34, type: "government", focusEn: "Regional digital economy, IoT/5G infrastructure", focusTh: "เศรษฐกิจดิจิทัลภูมิภาค โครงสร้างพื้นฐาน IoT/5G" },
  { id: "smart-malacca", name: "Smart Malacca (SMEX)", country: "Malaysia", countryTh: "มาเลเซีย", flag: "🇲🇾", lat: 2.19, lng: 102.25, type: "government", focusEn: "Smart tourism, IoT traffic management", focusTh: "ท่องเที่ยวอัจฉริยะ จัดการจราจร IoT" },

  // ─── NEW ZEALAND ───
  { id: "algim", name: "ALGIM", country: "New Zealand", countryTh: "นิวซีแลนด์", flag: "🇳🇿", lat: -41.29, lng: 174.78, type: "ngo", focusEn: "Local government data management expertise", focusTh: "ความเชี่ยวชาญจัดการข้อมูลรัฐบาลท้องถิ่น" },
  { id: "christchurch", name: "Smart Christchurch", country: "New Zealand", countryTh: "นิวซีแลนด์", flag: "🇳🇿", lat: -43.53, lng: 172.64, type: "government", focusEn: "Post-disaster resilient city tech, urban planning", focusTh: "เทคโนโลยีเมืองยืดหยุ่นหลังภัยพิบัติ วางผังเมือง" },
  { id: "jix", name: "JIX Reality Christchurch", country: "New Zealand", countryTh: "นิวซีแลนด์", flag: "🇳🇿", lat: -43.52, lng: 172.63, type: "corporate", focusEn: "VR/AR for urban planning and virtual tourism", focusTh: "VR/AR สำหรับวางผังเมืองและท่องเที่ยวเสมือน" },
  { id: "palmerston", name: "Palmerston North Council", country: "New Zealand", countryTh: "นิวซีแลนด์", flag: "🇳🇿", lat: -40.35, lng: 175.61, type: "government", focusEn: "Sustainable city management, energy systems exchange", focusTh: "จัดการเมืองยั่งยืน แลกเปลี่ยนระบบพลังงาน" },

  // ─── SPAIN ───
  { id: "scewc", name: "Smart City Expo World Congress", country: "Spain", countryTh: "สเปน", flag: "🇪🇸", lat: 41.39, lng: 2.16, type: "event", focusEn: "World's largest smart city event in Barcelona", focusTh: "งานเมืองอัจฉริยะใหญ่สุดในโลกที่บาร์เซโลนา" },
  { id: "gsma", name: "GSMA MWC Barcelona", country: "Spain", countryTh: "สเปน", flag: "🇪🇸", lat: 41.35, lng: 2.13, type: "event", focusEn: "5G, IoT, mobile smart city applications", focusTh: "5G IoT แอปพลิเคชันเมืองอัจฉริยะมือถือ" },

  // ─── CHINA ───
  { id: "dahua", name: "Dahua Technology", country: "China", countryTh: "จีน", flag: "🇨🇳", lat: 30.27, lng: 120.15, type: "corporate", focusEn: "AI cameras, facial recognition, traffic analytics", focusTh: "กล้อง AI จดจำใบหน้า วิเคราะห์จราจร" },
  { id: "wedoctor", name: "WeDoctor", country: "China", countryTh: "จีน", flag: "🇨🇳", lat: 30.25, lng: 120.17, type: "corporate", focusEn: "Telemedicine platform, AI health management", focusTh: "แพลตฟอร์ม telemedicine จัดการสุขภาพ AI" },

  // ─── AUSTRALIA ───
  { id: "aus4asean", name: "AUS4ASEAN Futures", country: "Australia", countryTh: "ออสเตรเลีย", flag: "🇦🇺", lat: -33.87, lng: 151.21, type: "government", focusEn: "ASEAN digital cooperation, education, sustainable development", focusTh: "ความร่วมมือดิจิทัลอาเซียน การศึกษา การพัฒนาที่ยั่งยืน" },
  { id: "unsw", name: "UNSW Cities Institute", country: "Australia", countryTh: "ออสเตรเลีย", flag: "🇦🇺", lat: -33.92, lng: 151.23, type: "university", focusEn: "AI urban resource management, sustainable city research", focusTh: "AI จัดการทรัพยากรเมือง วิจัยเมืองยั่งยืน" },

  // ─── PHILIPPINES ───
  { id: "dost", name: "DOST Philippines", country: "Philippines", countryTh: "ฟิลิปปินส์", flag: "🇵🇭", lat: 14.57, lng: 121.00, type: "government", focusEn: "IoT community solutions, digital infrastructure", focusTh: "โซลูชัน IoT ชุมชน โครงสร้างพื้นฐานดิจิทัล" },
  { id: "cauayan", name: "Cauayan City", country: "Philippines", countryTh: "ฟิลิปปินส์", flag: "🇵🇭", lat: 16.93, lng: 121.77, type: "government", focusEn: "Model smart city — IoT, renewable energy, agriculture", focusTh: "เมืองอัจฉริยะต้นแบบ — IoT พลังงานหมุนเวียน เกษตร" },

  // ─── CANADA ───
  { id: "blackberry", name: "BlackBerry", country: "Canada", countryTh: "แคนาดา", flag: "🇨🇦", lat: 43.45, lng: -80.52, type: "corporate", focusEn: "Cybersecurity for IoT, autonomous vehicle software", focusTh: "ความปลอดภัยไซเบอร์สำหรับ IoT ซอฟต์แวร์ยานยนต์อัตโนมัติ" },

  // ─── UN / MULTILATERAL ───
  { id: "un-habitat", name: "UN-Habitat (ASUS Project)", country: "Kenya", countryTh: "UN", flag: "🇺🇳", lat: -1.29, lng: 36.82, type: "multilateral", focusEn: "ASUS Phase II — 15 ASEAN cities including NST and Chiang Mai", focusTh: "ASUS Phase II — 15 เมืองอาเซียนรวมถึง นศ. และเชียงใหม่" },
  { id: "adb", name: "Asian Development Bank", country: "Philippines", countryTh: "ADB", flag: "🏦", lat: 14.58, lng: 121.06, type: "multilateral", focusEn: "ASEAN Australia Smart Cities Trust Fund, green finance", focusTh: "กองทุน ASEAN Australia Smart Cities การเงินสีเขียว" },
  { id: "world-bank", name: "World Bank / IFC", country: "USA", countryTh: "World Bank", flag: "🏦", lat: 38.90, lng: -77.04, type: "multilateral", focusEn: "Urban development finance, smart city toolkit", focusTh: "การเงินพัฒนาเมือง ชุดเครื่องมือเมืองอัจฉริยะ" },
  { id: "unido", name: "UNIDO", country: "Austria", countryTh: "UNIDO", flag: "🇺🇳", lat: 48.24, lng: 16.42, type: "multilateral", focusEn: "Industrial digitization, sustainable manufacturing", focusTh: "อุตสาหกรรมดิจิทัล การผลิตยั่งยืน" },

  // ─── Pacific ───
  { id: "solomon-islands-gov", name: "Solomon Islands Government", country: "Solomon Islands", countryTh: "หมู่เกาะโซโลมอน", flag: "🇸🇧", lat: -9.43, lng: 160.0, type: "government", focusEn: "Pacific smart city knowledge exchange, climate resilience, sustainable urbanisation partnership", focusTh: "แลกเปลี่ยนความรู้เมืองอัจฉริยะแปซิฟิก ความยืดหยุ่นทางภูมิอากาศ ความร่วมมือเมืองยั่งยืน" },
];

// Group by country for display
export function getPartnersByCountry(): Record<string, Partner[]> {
  const grouped: Record<string, Partner[]> = {};
  for (const p of partners) {
    if (!grouped[p.country]) grouped[p.country] = [];
    grouped[p.country].push(p);
  }
  return grouped;
}

export const PARTNER_COUNTRIES = [...new Set(partners.map(p => p.country))];
