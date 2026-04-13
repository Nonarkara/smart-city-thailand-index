import { getCityContext } from "./cityContext";
import type { Locale, SmartCity } from "./types";

export interface TrilingualText {
  en: string;
  th: string;
  zh: string;
}

export interface TrilingualList {
  en: string[];
  th: string[];
  zh: string[];
}

export interface CityResearchSource {
  label: TrilingualText;
  url: string;
}

export interface CityResearchProfile {
  industries: TrilingualList;
  dailyLife: TrilingualText;
  signatureStory: TrilingualText;
  funFact: TrilingualText;
  compareNote: TrilingualText;
  sources?: CityResearchSource[];
}

const genericSourceLabel = (
  en: string,
  th: string,
  zh: string,
): TrilingualText => ({ en, th, zh });

const CITY_INDUSTRY_TAGS: Record<string, TrilingualList> = {
  phuket: {
    en: ["Tourism", "Marine leisure", "Food", "Wellness"],
    th: ["ท่องเที่ยว", "เศรษฐกิจทางทะเล", "อาหาร", "เวลเนส"],
    zh: ["旅游", "海洋休闲", "美食", "康养"],
  },
  samyan: {
    en: ["Education", "Startups", "Retail", "Professional services"],
    th: ["การศึกษา", "สตาร์ทอัพ", "ค้าปลีก", "บริการวิชาชีพ"],
    zh: ["教育", "初创企业", "零售", "专业服务"],
  },
  "chiang-mai-old-town": {
    en: ["Tourism", "Crafts", "Creative economy", "Digital services"],
    th: ["ท่องเที่ยว", "หัตถกรรม", "เศรษฐกิจสร้างสรรค์", "บริการดิจิทัล"],
    zh: ["旅游", "手工艺", "创意经济", "数字服务"],
  },
  "khon-kaen": {
    en: ["Healthcare", "Education", "Logistics", "Agri-processing"],
    th: ["สาธารณสุข", "การศึกษา", "โลจิสติกส์", "แปรรูปเกษตร"],
    zh: ["医疗健康", "教育", "物流", "农产加工"],
  },
  "cmu-smart-city": {
    en: ["Research", "Medtech", "Agritech", "Clean energy"],
    th: ["วิจัย", "เมดเทค", "อะกริเทค", "พลังงานสะอาด"],
    zh: ["科研", "医疗科技", "农业科技", "清洁能源"],
  },
  "nakhon-si-thammarat": {
    en: ["Trade", "Education", "Heritage tourism", "Public services"],
    th: ["การค้า", "การศึกษา", "ท่องเที่ยวมรดก", "บริการสาธารณะ"],
    zh: ["商贸", "教育", "遗产旅游", "公共服务"],
  },
  "hat-yai": {
    en: ["Retail", "Border trade", "Healthcare", "Transport"],
    th: ["ค้าปลีก", "การค้าชายแดน", "สาธารณสุข", "คมนาคม"],
    zh: ["零售", "边境贸易", "医疗", "交通运输"],
  },
  yala: {
    en: ["Public services", "Education", "Retail", "Green services"],
    th: ["บริการสาธารณะ", "การศึกษา", "ค้าปลีก", "บริการสีเขียว"],
    zh: ["公共服务", "教育", "零售", "绿色服务"],
  },
  krabi: {
    en: ["Tourism", "Marine services", "Hospitality", "Renewables"],
    th: ["ท่องเที่ยว", "บริการทางทะเล", "การบริการ", "พลังงานหมุนเวียน"],
    zh: ["旅游", "海洋服务", "酒店服务", "可再生能源"],
  },
  rayong: {
    en: ["Petrochemicals", "Manufacturing", "Fruit economy", "Port logistics"],
    th: ["ปิโตรเคมี", "การผลิต", "เศรษฐกิจผลไม้", "โลจิสติกส์ท่าเรือ"],
    zh: ["石化", "制造业", "水果经济", "港口物流"],
  },
  "wangchan-valley": {
    en: ["R&D campus", "Prototype infrastructure", "Energy tech"],
    th: ["แคมปัสวิจัย", "โครงสร้างพื้นฐานต้นแบบ", "เทคพลังงาน"],
    zh: ["研发园区", "原型基础设施", "能源科技"],
  },
  "mae-moh": {
    en: ["Power generation", "Energy transition", "Small farming"],
    th: ["ผลิตไฟฟ้า", "เปลี่ยนผ่านพลังงาน", "เกษตรขนาดเล็ก"],
    zh: ["发电", "能源转型", "小规模农业"],
  },
  nakhonsawan: {
    en: ["River trade", "Rice economy", "Fisheries", "Public services"],
    th: ["การค้าทางน้ำ", "เศรษฐกิจข้าว", "ประมง", "บริการสาธารณะ"],
    zh: ["水运贸易", "稻米经济", "渔业", "公共服务"],
  },
  saensuk: {
    en: ["Beach tourism", "Seafood", "University economy", "Housing"],
    th: ["ท่องเที่ยวชายหาด", "อาหารทะเล", "เศรษฐกิจมหาวิทยาลัย", "ที่อยู่อาศัย"],
    zh: ["海滨旅游", "海鲜经济", "大学经济", "居住服务"],
  },
  chachoengsao: {
    en: ["Manufacturing", "Logistics", "Warehousing", "Industrial services"],
    th: ["การผลิต", "โลจิสติกส์", "คลังสินค้า", "บริการอุตสาหกรรม"],
    zh: ["制造业", "物流", "仓储", "工业服务"],
  },
  "chiang-rai": {
    en: ["Tourism", "Tea & coffee", "Border trade", "Agriculture"],
    th: ["ท่องเที่ยว", "ชาและกาแฟ", "การค้าชายแดน", "เกษตรกรรม"],
    zh: ["旅游", "茶与咖啡", "边境贸易", "农业"],
  },
  nan: {
    en: ["Community tourism", "Forest products", "Agriculture", "Heritage economy"],
    th: ["ท่องเที่ยวชุมชน", "ผลิตภัณฑ์ป่าไม้", "เกษตรกรรม", "เศรษฐกิจมรดก"],
    zh: ["社区旅游", "林产品", "农业", "遗产经济"],
  },
  korat: {
    en: ["Trade", "Manufacturing", "Education", "Agri-processing"],
    th: ["การค้า", "การผลิต", "การศึกษา", "แปรรูปเกษตร"],
    zh: ["商贸", "制造业", "教育", "农产加工"],
  },
  "phitsanulok-muni": {
    en: ["Healthcare", "Education", "Logistics", "Regional retail"],
    th: ["สาธารณสุข", "การศึกษา", "โลจิสติกส์", "ค้าปลีกภูมิภาค"],
    zh: ["医疗", "教育", "物流", "区域零售"],
  },
  lampang: {
    en: ["Ceramics", "Heritage tourism", "Education", "Clean energy"],
    th: ["เซรามิก", "ท่องเที่ยวมรดก", "การศึกษา", "พลังงานสะอาด"],
    zh: ["陶瓷", "遗产旅游", "教育", "清洁能源"],
  },
  samui: {
    en: ["Island tourism", "Hospitality", "Fisheries", "Coconut economy"],
    th: ["ท่องเที่ยวเกาะ", "การบริการ", "ประมง", "เศรษฐกิจมะพร้าว"],
    zh: ["海岛旅游", "酒店服务", "渔业", "椰子经济"],
  },
  "phra-ram-4": {
    en: ["Finance", "Offices", "Commercial real estate", "Urban mobility"],
    th: ["การเงิน", "สำนักงาน", "อสังหาฯ เชิงพาณิชย์", "การเดินทางเมือง"],
    zh: ["金融", "办公经济", "商业地产", "城市交通"],
  },
  makkasan: {
    en: ["Transit hub", "Rail real estate", "Airport connectivity"],
    th: ["ศูนย์กลางคมนาคม", "อสังหาฯ ระบบราง", "การเชื่อมสนามบิน"],
    zh: ["交通枢纽", "轨道地产", "机场联通"],
  },
  "klong-phadung": {
    en: ["Canal tourism", "Heritage retail", "Public realm services"],
    th: ["ท่องเที่ยวคลอง", "ค้าปลีกมรดก", "บริการพื้นที่สาธารณะ"],
    zh: ["运河旅游", "遗产零售", "公共空间服务"],
  },
  phangnga: {
    en: ["Coastal tourism", "Fisheries", "Rubber", "Resilience services"],
    th: ["ท่องเที่ยวชายฝั่ง", "ประมง", "ยางพารา", "บริการความยืดหยุ่น"],
    zh: ["海岸旅游", "渔业", "橡胶", "韧性服务"],
  },
  satun: {
    en: ["Geopark tourism", "Fisheries", "Rubber", "Conservation services"],
    th: ["ท่องเที่ยวจีโอพาร์ก", "ประมง", "ยางพารา", "บริการอนุรักษ์"],
    zh: ["地质公园旅游", "渔业", "橡胶", "保护服务"],
  },
  "samut-prakan": {
    en: ["Manufacturing", "Warehousing", "Logistics", "Industrial services"],
    th: ["การผลิต", "คลังสินค้า", "โลจิสติกส์", "บริการอุตสาหกรรม"],
    zh: ["制造业", "仓储", "物流", "工业服务"],
  },
  rattanakosin: {
    en: ["Heritage tourism", "Government", "Temple economy", "Cultural services"],
    th: ["ท่องเที่ยวเชิงมรดก", "ราชการ", "เศรษฐกิจวัด", "บริการวัฒนธรรม"],
    zh: ["遗产旅游", "政府", "寺庙经济", "文化服务"],
  },
  nonthaburi: {
    en: ["Government services", "Retail", "Commuter workforce", "Digital services"],
    th: ["บริการราชการ", "ค้าปลีก", "แรงงานเดินทาง", "บริการดิจิทัล"],
    zh: ["政府服务", "零售", "通勤劳动力", "数字服务"],
  },
  pattani: {
    en: ["Fisheries", "Halal food", "Education", "Agriculture"],
    th: ["ประมง", "อาหารฮาลาล", "การศึกษา", "เกษตร"],
    zh: ["渔业", "清真食品", "教育", "农业"],
  },
  narathiwat: {
    en: ["Cross-border trade", "Fisheries", "Agriculture", "Government"],
    th: ["ค้าชายแดน", "ประมง", "เกษตร", "ราชการ"],
    zh: ["跨境贸易", "渔业", "农业", "政府"],
  },
  "songkhla-city": {
    en: ["Fisheries", "Education", "Lake tourism", "Rubber processing"],
    th: ["ประมง", "การศึกษา", "ท่องเที่ยวทะเลสาบ", "แปรรูปยาง"],
    zh: ["渔业", "教育", "湖泊旅游", "橡胶加工"],
  },
  sritrang: {
    en: ["Rubber", "Eco-tourism", "Fisheries", "Green agriculture"],
    th: ["ยาง", "ท่องเที่ยวเชิงนิเวศ", "ประมง", "เกษตรสีเขียว"],
    zh: ["橡胶", "生态旅游", "渔业", "绿色农业"],
  },
  chanthaburi: {
    en: ["Gem trading", "Tropical fruit", "Agri-tech", "Border trade"],
    th: ["ค้าอัญมณี", "ผลไม้เมืองร้อน", "เทคโนโลยีเกษตร", "ค้าชายแดน"],
    zh: ["宝石贸易", "热带水果", "农业科技", "边境贸易"],
  },
  ubon: {
    en: ["Agriculture", "Cultural tourism", "Government", "Border trade"],
    th: ["เกษตร", "ท่องเที่ยวเชิงวัฒนธรรม", "ราชการ", "ค้าชายแดน"],
    zh: ["农业", "文化旅游", "政府", "边境贸易"],
  },
  "ubon-muni": {
    en: ["Municipal services", "Cultural tourism", "Retail", "Hospitality"],
    th: ["บริการเทศบาล", "ท่องเที่ยวเชิงวัฒนธรรม", "ค้าปลีก", "การบริการ"],
    zh: ["市政服务", "文化旅游", "零售", "酒店业"],
  },
  "phitsanulok-nu": {
    en: ["University R&D", "Smart energy", "Mobility research", "Education"],
    th: ["R&D มหาวิทยาลัย", "พลังงานอัจฉริยะ", "วิจัยการเดินทาง", "การศึกษา"],
    zh: ["大学研发", "智慧能源", "出行研究", "教育"],
  },
  "phitsanulok-ppao": {
    en: ["Provincial governance", "Agriculture", "Digital services", "Manufacturing"],
    th: ["ปกครองจังหวัด", "เกษตร", "บริการดิจิทัล", "การผลิต"],
    zh: ["省级治理", "农业", "数字服务", "制造业"],
  },
  tak: {
    en: ["Border trade", "Manufacturing", "Agriculture", "Customs logistics"],
    th: ["ค้าชายแดน", "การผลิต", "เกษตร", "โลจิสติกส์ศุลกากร"],
    zh: ["边境贸易", "制造业", "农业", "海关物流"],
  },
  maesai: {
    en: ["Border trade", "Tourism", "Gem trading", "Disaster recovery"],
    th: ["ค้าชายแดน", "ท่องเที่ยว", "ค้าอัญมณี", "ฟื้นฟูภัยพิบัติ"],
    zh: ["边境贸易", "旅游", "宝石贸易", "灾后恢复"],
  },
  phichit: {
    en: ["Rice farming", "Freshwater fishing", "Digital literacy", "Agriculture"],
    th: ["ทำนา", "ประมงน้ำจืด", "รู้เท่าทันดิจิทัล", "เกษตร"],
    zh: ["水稻种植", "淡水渔业", "数字素养", "农业"],
  },
  umong: {
    en: ["Agriculture", "Handicrafts", "Community energy", "Light manufacturing"],
    th: ["เกษตร", "หัตถกรรม", "พลังงานชุมชน", "การผลิตขนาดเล็ก"],
    zh: ["农业", "手工艺", "社区能源", "轻工制造"],
  },
  "nikhom-phatthana": {
    en: ["Petrochemicals", "Auto parts", "Environmental monitoring", "Industrial IoT"],
    th: ["ปิโตรเคมี", "ชิ้นส่วนรถยนต์", "เฝ้าระวังสิ่งแวดล้อม", "IoT อุตสาหกรรม"],
    zh: ["石化", "汽车零部件", "环境监测", "工业物联网"],
  },
  "bang-saray": {
    en: ["Fishing", "Coastal tourism", "Seafood processing", "Digital governance"],
    th: ["ประมง", "ท่องเที่ยวชายฝั่ง", "แปรรูปอาหารทะเล", "ปกครองดิจิทัล"],
    zh: ["渔业", "海岸旅游", "海鲜加工", "数字治理"],
  },
  "tai-yong": {
    en: ["Rice farming", "Fruit orchards", "Community agriculture", "Digital governance"],
    th: ["ทำนา", "สวนผลไม้", "เกษตรชุมชน", "ปกครองดิจิทัล"],
    zh: ["水稻种植", "果园", "社区农业", "数字治理"],
  },
  "khao-khun-song": {
    en: ["Precision farming", "Rubber", "IoT agriculture", "Fruit farming"],
    th: ["เกษตรแม่นยำ", "ยาง", "IoT เกษตร", "ทำสวนผลไม้"],
    zh: ["精准农业", "橡胶", "物联网农业", "水果种植"],
  },
  "thep-paraj": {
    en: ["Agriculture", "Smart farming", "EEC services", "Light manufacturing"],
    th: ["เกษตร", "เกษตรอัจฉริยะ", "บริการ EEC", "การผลิตขนาดเล็ก"],
    zh: ["农业", "智慧农业", "EEC服务", "轻工制造"],
  },
  phlapphla: {
    en: ["Fruit farming", "Community energy", "Rubber", "Environmental monitoring"],
    th: ["ทำสวนผลไม้", "พลังงานชุมชน", "ยาง", "เฝ้าระวังสิ่งแวดล้อม"],
    zh: ["水果种植", "社区能源", "橡胶", "环境监测"],
  },
  "phuket-tinicon": {
    en: ["Tech innovation", "Digital services", "R&D", "Startup incubation"],
    th: ["นวัตกรรมเทค", "บริการดิจิทัล", "R&D", "บ่มเพาะสตาร์ทอัพ"],
    zh: ["科技创新", "数字服务", "研发", "创业孵化"],
  },
};

const CITY_RESEARCH_PROFILES: Record<string, CityResearchProfile> = {
  phuket: {
    industries: CITY_INDUSTRY_TAGS.phuket,
    dailyLife: {
      en: "Life runs on island shifts: dawn markets, hotel and boat crews by day, Old Town cafes in the afternoon, and Patong's service economy deep into the night.",
      th: "ชีวิตเดินด้วยกะของเกาะ: ตลาดเช้า ทีมเรือและโรงแรมตอนกลางวัน คาเฟ่ย่านเมืองเก่าช่วงบ่าย และเศรษฐกิจบริการของป่าตองลากยาวไปถึงดึก",
      zh: "这座海岛按轮班节奏生活：清晨市场、白天的酒店与船队、午后的老城咖啡馆，以及深夜仍在运转的芭东服务经济。",
    },
    signatureStory: {
      en: "Phuket is where Thailand's smart-tourism pitch actually meets operations: multilingual safety systems, traffic control, and marine monitoring all matter because visitor trust is the economy.",
      th: "ภูเก็ตคือจุดที่คำพูดเรื่องสมาร์ททัวริซึมของไทยไปเจอกับของจริง: ระบบความปลอดภัยหลายภาษา การควบคุมจราจร และการเฝ้าระวังทะเลมีความหมาย เพราะความเชื่อมั่นของนักท่องเที่ยวคือเศรษฐกิจทั้งเมือง",
      zh: "普吉是泰国“智慧旅游”真正落地的地方：多语言安全系统、交通调度与海洋监测之所以重要，是因为游客信任本身就是这里的经济命脉。",
    },
    funFact: {
      en: "Phuket is a UNESCO Creative City of Gastronomy, so the island sells beaches by day and Baba-Nyonya food culture by night.",
      th: "ภูเก็ตเป็นเมืองสร้างสรรค์ด้านอาหารของ UNESCO ดังนั้นเกาะนี้ขายทะเลตอนกลางวัน และขายวัฒนธรรมอาหารบาบ๋า-ย่าหยาในตอนกลางคืน",
      zh: "普吉是联合国教科文组织“美食创意城市”，所以这里白天卖海滩，夜晚卖的是峇峇娘惹饮食文化。",
    },
    compareNote: {
      en: "Best-in-class tourism machine with real digital plumbing, but island traffic and overtourism keep punching back.",
      th: "เครื่องจักรท่องเที่ยวระดับหัวแถวที่มีระบบดิจิทัลจริง แต่รถติดแบบเกาะและแรงกดดันจากนักท่องเที่ยวก็ยังสวนกลับตลอด",
      zh: "这是旅游机器里的尖子生，数字基础设施是真货，但海岛交通与过度旅游也一直在反击。",
    },
    sources: [
      {
        label: genericSourceLabel("UNESCO Creative Cities: Phuket", "UNESCO Creative Cities: Phuket", "UNESCO 创意城市: 普吉"),
        url: "https://www.unesco.org/en/creative-cities/phuket",
      },
      {
        label: genericSourceLabel("Phuket Smart City official platform", "แพลตฟอร์มทางการของ Phuket Smart City", "Phuket Smart City 官方平台"),
        url: "https://www.phuketsmartcity.com/",
      },
      {
        label: genericSourceLabel("TAT Newsroom on Phuket gastronomy", "TAT Newsroom เรื่องเมืองอาหารของภูเก็ต", "TAT 关于普吉美食城市"),
        url: "https://www.tatnews.org/2019/12/phuket-a-unesco-city-of-gastronomy/",
      },
    ],
  },
  samyan: {
    industries: CITY_INDUSTRY_TAGS.samyan,
    dailyLife: {
      en: "Students, researchers, office workers, and founders all share the same few blocks, so Samyan feels more like an urban campus than normal Bangkok.",
      th: "นักศึกษา นักวิจัย พนักงานออฟฟิศ และผู้ก่อตั้งสตาร์ทอัพใช้พื้นที่ไม่กี่บล็อกร่วมกัน ทำให้สามย่านให้ความรู้สึกเหมือนแคมปัสเมืองมากกว่ากรุงเทพฯ แบบปกติ",
      zh: "学生、研究人员、白领与创业者共用这几条街区，所以三养更像一座城市校园，而不是普通的曼谷。",
    },
    signatureStory: {
      en: "Samyan works because Chula controls land, talent, and the testbed at once, turning university infrastructure into a live urban innovation district instead of a branding exercise.",
      th: "สามย่านเวิร์กเพราะจุฬาฯ คุมทั้งที่ดิน คนเก่ง และพื้นที่ทดลองพร้อมกัน เปลี่ยนโครงสร้างพื้นฐานของมหาวิทยาลัยให้เป็นย่านนวัตกรรมเมืองจริง ไม่ใช่แค่การทำแบรนด์",
      zh: "三养之所以成立，是因为朱拉隆功大学同时掌握土地、人才与试验场，把校园基础设施直接变成真实运作的城市创新区，而不是空洞品牌。",
    },
    funFact: {
      en: "The district's flood-resilient landscape around CU Centenary Park was designed to store stormwater instead of pretending Bangkok flooding can be wished away.",
      th: "ภูมิทัศน์รอบอุทยาน 100 ปี จุฬาฯ ถูกออกแบบให้เก็บน้ำฝนจริง แทนการแกล้งทำเหมือนปัญหาน้ำท่วมกรุงเทพฯ จะหายไปเอง",
      zh: "围绕朱拉百年公园的抗洪景观，本来就是为了蓄洪而设计的，不是假装曼谷的积水问题不存在。",
    },
    compareNote: {
      en: "Tiny footprint, serious brainpower: one of the few Bangkok zones where walking, data, and innovation actually line up.",
      th: "พื้นที่เล็ก แต่สมองแน่น: เป็นหนึ่งในไม่กี่โซนของกรุงเทพฯ ที่การเดิน ข้อมูล และนวัตกรรมไปในทิศทางเดียวกันจริง",
      zh: "占地不大，脑力很重：这是曼谷少数把步行、数据与创新真正对齐的片区。",
    },
    sources: [
      {
        label: genericSourceLabel("Samyan Smart City official overview", "ภาพรวมทางการของ Samyan Smart City", "Samyan Smart City 官方概览"),
        url: "https://www.samyansmartcity.com/en/about",
      },
      {
        label: genericSourceLabel("Chula sustainability and flood-resilient landscape", "จุฬาฯ ด้านความยั่งยืนและภูมิทัศน์รับมือน้ำท่วม", "朱拉可持续发展与抗洪景观"),
        url: "https://www.sustainability.chula.ac.th/report/829/",
      },
    ],
  },
  "khon-kaen": {
    industries: CITY_INDUSTRY_TAGS["khon-kaen"],
    dailyLife: {
      en: "This is Isan's working capital: students, hospital traffic, civil servants, wholesale markets, and bus commuters keep the city moving from dawn to late evening.",
      th: "นี่คือเมืองหลวงที่ทำงานของอีสาน: นักศึกษา การเดินทางไปโรงพยาบาล ข้าราชการ ตลาดค้าส่ง และผู้โดยสารรถบัส ทำให้เมืองคึกตั้งแต่เช้าจนค่ำ",
      zh: "这是伊桑真正干活的首都：学生、医院车流、公务系统、批发市场与通勤巴士，让城市从清晨忙到深夜。",
    },
    signatureStory: {
      en: "Khon Kaen's smart-city credibility comes from local ownership. KKTS and the smart-bus push prove what happens when five municipalities stop waiting for Bangkok and fund the backbone themselves.",
      th: "ความน่าเชื่อถือของขอนแก่นมาจากการเป็นเจ้าของของคนท้องถิ่น KKTS และการผลักดันสมาร์ทบัสพิสูจน์ให้เห็นว่าเกิดอะไรขึ้นเมื่อ 5 เทศบาลเลิกนั่งรอกรุงเทพฯ แล้วลงเงินทำแกนหลักเอง",
      zh: "孔敬的智慧城市可信度来自地方自己做主。KKTS 与智慧巴士计划说明：当五个市政体不再等曼谷，而是自己投钱做骨架时，城市就会往前走。",
    },
    funFact: {
      en: "The transit story here was not born from a miracle central subsidy. Local business groups and municipalities built the consortium first, then made the state react.",
      th: "เรื่องระบบขนส่งที่นี่ไม่ได้เกิดจากเงินอุดหนุนมหัศจรรย์จากส่วนกลาง แต่เกิดจากกลุ่มธุรกิจท้องถิ่นและเทศบาลที่ตั้งคอนซอร์เทียมก่อน แล้วค่อยทำให้รัฐต้องขยับตาม",
      zh: "这里的交通故事不是靠中央奇迹补贴起家的，而是地方企业与市政先把联合体做出来，再逼着国家跟上。",
    },
    compareNote: {
      en: "Thailand's best bottom-up smart city: less glossy than Phuket, more politically durable.",
      th: "เมืองอัจฉริยะ bottom-up ที่ดีที่สุดของไทย: เงาน้อยกว่าภูเก็ต แต่ทนทางการเมืองมากกว่า",
      zh: "这是泰国最强的自下而上智慧城市：没有普吉那么亮面，但政治耐久度更高。",
    },
    sources: [
      {
        label: genericSourceLabel("KKTS official background", "ข้อมูลทางการของ KKTS", "KKTS 官方背景"),
        url: "https://www.kkts.co.th/home/about",
      },
      {
        label: genericSourceLabel("Khon Kaen smart transit project", "โครงการขนส่งอัจฉริยะขอนแก่น", "孔敬智慧交通项目"),
        url: "https://www.kkts.co.th/home/1199",
      },
      {
        label: genericSourceLabel("Khon Kaen University medical hub context", "บริบทเมืองการแพทย์ของมหาวิทยาลัยขอนแก่น", "孔敬大学医疗枢纽背景"),
        url: "https://www.kku.ac.th/th/32707/",
      },
    ],
  },
  "cmu-smart-city": {
    industries: CITY_INDUSTRY_TAGS["cmu-smart-city"],
    dailyLife: {
      en: "Campus life is the city logic: labs, dorms, teaching hospitals, food courts, bikes, and shuttle trips all happen under the mountain in one dense loop.",
      th: "ชีวิตในแคมปัสคือ logic ของเมือง: แล็บ หอพัก โรงพยาบาลสอน ฟู้ดคอร์ต จักรยาน และรถรับส่งหมุนอยู่ใต้ดอยในลูปเดียวกัน",
      zh: "这里的城市逻辑就是校园生活：实验室、宿舍、教学医院、食堂、自行车与接驳车，在山脚下形成一个高密度循环。",
    },
    signatureStory: {
      en: "CMU matters because it tests mobility, energy, and net-zero systems on real daily users. It is a working lab, not a brochure pretending to be a district.",
      th: "CMU สำคัญเพราะมันเอาระบบเดินทาง พลังงาน และ net zero มาทดสอบกับผู้ใช้จริงทุกวัน มันคือ working lab ไม่ใช่โบรชัวร์ที่แต่งตัวเป็นย่าน",
      zh: "CMU 的价值在于，它把交通、能源与净零系统直接放到真实日常用户上测试。这里是工作中的实验室，不是伪装成城区的宣传册。",
    },
    funFact: {
      en: "CMU's green mobility network has already logged millions of rides, which is the bluntest possible proof that students will use low-carbon transport when it is convenient.",
      th: "เครือข่ายการเดินทางสีเขียวของ CMU ทำยอดการใช้งานไปแล้วหลายล้านเที่ยว ซึ่งเป็นหลักฐานตรงๆ ว่านักศึกษาจะใช้ขนส่งคาร์บอนต่ำถ้ามันสะดวกจริง",
      zh: "CMU 的绿色出行网络已经累计数百万次乘坐，这大概是最直接的证据：只要方便，学生真的会用低碳交通。",
    },
    compareNote: {
      en: "Best living-lab campus in the index; strong digital execution, smaller spillover beyond the university gates.",
      th: "แคมปัส living lab ที่ดีที่สุดในดัชนี; ดิจิทัลทำได้แข็ง แต่การล้นออกนอกประตูมหาวิทยาลัยยังเล็กกว่าในเมืองจริง",
      zh: "这是指数里最强的生活实验室校园；数字执行很强，但影响力溢出到校门外的规模仍然有限。",
    },
    sources: [
      {
        label: genericSourceLabel("CMU Smart Campus Management Center", "ศูนย์บริหารจัดการสมาร์ทแคมปัส มช.", "CMU 智慧校园管理中心"),
        url: "https://www.cmu.ac.th/en/Organization/smart_campus_management_center/aboutus",
      },
      {
        label: genericSourceLabel("CMU net-zero mobility results", "ผลลัพธ์การเดินทางสีเขียวของ มช.", "CMU 净零出行成果"),
        url: "https://netzero.cmu.ac.th/web/?lang=en&p=4757",
      },
    ],
  },
  "chiang-mai-old-town": {
    industries: CITY_INDUSTRY_TAGS["chiang-mai-old-town"],
    dailyLife: {
      en: "Monks, market vendors, remote workers, craft sellers, and tourists all share the moat. Mornings are temple bells; evenings are walking streets and cafe spillover.",
      th: "พระ พ่อค้าแม่ค้าตลาด คนทำงานรีโมต คนขายงานคราฟต์ และนักท่องเที่ยวใช้พื้นที่คูเมืองร่วมกัน ตอนเช้าเป็นเสียงระฆังวัด ตอนเย็นเป็นถนนคนเดินและคาเฟ่ล้นทาง",
      zh: "僧侣、摊贩、远程工作者、手工艺商与游客共用这圈古城壕沟。清晨是寺庙钟声，夜晚是步行街与咖啡馆外溢。",
    },
    signatureStory: {
      en: "Chiang Mai Old Town is trying to digitize heritage without killing it, pairing tourism tech and preservation sensors with the ugly reality of annual haze.",
      th: "เมืองเก่าเชียงใหม่กำลังพยายามดิจิไทซ์มรดกโดยไม่ฆ่ามัน ใช้ทั้งเทคท่องเที่ยวและเซ็นเซอร์อนุรักษ์ควบคู่กับความจริงอันโหดของหมอกควันประจำปี",
      zh: "清迈古城正在尝试“数字化遗产而不杀死遗产”，把旅游科技与保护传感器并行推进，同时正面面对每年都来的雾霾现实。",
    },
    funFact: {
      en: "Chiang Mai is a UNESCO Creative City of Crafts and Folk Art, which is a polite way of saying the old city still monetizes culture better than most tech parks monetize hype.",
      th: "เชียงใหม่เป็นเมืองสร้างสรรค์ด้านหัตถกรรมและศิลปะพื้นบ้านของ UNESCO ซึ่งพูดแบบสุภาพก็คือ เมืองเก่ายังหาเงินจากวัฒนธรรมได้เก่งกว่าที่หลายเทคพาร์กหาเงินจากกระแสได้เสียอีก",
      zh: "清迈是联合国教科文组织“手工艺与民间艺术创意城市”。说得直白点，就是这座古城靠文化赚钱的本事，胜过很多科技园靠炒作赚钱。",
    },
    compareNote: {
      en: "Magnetic and globally legible, but every burn season the air reminds you beauty alone is not policy.",
      th: "มีแรงดึงดูดและคนทั่วโลกอ่านออก แต่ทุกฤดูเผาอากาศจะเตือนว่า ความสวยอย่างเดียวไม่ใช่นโยบาย",
      zh: "它很有磁力，也很容易被全球读懂，但每到烧荒季，空气都会提醒你：美感本身不是政策。",
    },
    sources: [
      {
        label: genericSourceLabel("UNESCO Creative Cities: Chiang Mai", "UNESCO Creative Cities: Chiang Mai", "UNESCO 创意城市: 清迈"),
        url: "https://www.unesco.org/en/creative-cities/chiang-mai",
      },
      {
        label: genericSourceLabel("Tourism Authority: Chiang Mai destination guide", "การท่องเที่ยวฯ คู่มือจังหวัดเชียงใหม่", "泰旅局清迈目的地指南"),
        url: "https://www.tourismthailand.org/Destinations/Provinces/Chiang-Mai/101",
      },
    ],
  },
  saensuk: {
    industries: CITY_INDUSTRY_TAGS.saensuk,
    dailyLife: {
      en: "Weekdays feel like a beach town crossbred with a student town; weekends are Bang Saen chaos with scooters, seafood, and short-stay visitors.",
      th: "วันธรรมดาเหมือนเมืองชายหาดผสมเมืองนักศึกษา ส่วนวันหยุดคือความวุ่นวายแบบบางแสนที่เต็มไปด้วยสกู๊ตเตอร์ อาหารทะเล และคนมาเที่ยวสั้นๆ",
      zh: "平日像海滨小城和大学城混血，周末则变成邦盛式的热闹场景：机车、海鲜和短住游客全都涌进来。",
    },
    signatureStory: {
      en: "Saensuk proves small municipalities can do practical smart-city work when they focus on beach hygiene, public health, and service ops the public can actually see.",
      th: "แสนสุขพิสูจน์ว่าเทศบาลเล็กก็ทำสมาร์ทซิตี้แบบใช้งานจริงได้ ถ้าโฟกัสสุขอนามัยชายหาด สาธารณสุข และงานบริการที่ประชาชนมองเห็น",
      zh: "Saensuk 证明，小市政也能做出务实的智慧城市，只要它专注于海滩卫生、公共健康和市民看得见的服务运营。",
    },
    funFact: {
      en: "Few Thai cities publish beach-water quality in a way ordinary people can read before they swim. Saensuk does.",
      th: "มีไม่กี่เมืองในไทยที่เปิดคุณภาพน้ำชายหาดแบบที่คนธรรมดาอ่านแล้วตัดสินใจก่อนลงเล่นน้ำได้ แสนสุขทำ",
      zh: "在泰国，很少有城市会把海水质量公开到普通人下水前就看得懂。Saensuk 做到了。",
    },
    compareNote: {
      en: "Small footprint, high honesty: not flashy, but the civic operations are real.",
      th: "พื้นที่เล็ก แต่ซื่อสัตย์สูง: ไม่หวือหวา แต่งานบริการเมืองเป็นของจริง",
      zh: "版图不大，但诚实度很高：不炫技，市政协作却是真在运转。",
    },
  },
  krabi: {
    industries: CITY_INDUSTRY_TAGS.krabi,
    dailyLife: {
      en: "Krabi lives on boats, hotel vans, school runs, market mornings, and the tourist clock of tides and flight arrivals.",
      th: "กระบี่ใช้ชีวิตอยู่กับเรือ รถตู้โรงแรม การไปส่งลูกที่โรงเรียน ตลาดเช้า และนาฬิกาการท่องเที่ยวที่ผูกกับน้ำขึ้นน้ำลงและเที่ยวบิน",
      zh: "甲米的日常围着船、酒店接驳、上学车流、清晨市场，以及由潮汐和航班决定的旅游时钟在转。",
    },
    signatureStory: {
      en: "Krabi's real smart-city play is environmental discipline. Marine monitoring only matters here if it can keep tourism alive without letting the islands get loved to death.",
      th: "เกมสมาร์ทซิตี้ที่แท้จริงของกระบี่คือวินัยด้านสิ่งแวดล้อม การเฝ้าระวังทะเลจะมีความหมายก็ต่อเมื่อมันช่วยให้การท่องเที่ยวอยู่รอดโดยไม่ทำให้เกาะถูกถล่มด้วยความรักจนพัง",
      zh: "甲米真正的智慧城市打法，是环境纪律。海洋监测只有在既能保住旅游，又不让岛屿被“爱死”时才有意义。",
    },
    funFact: {
      en: "Krabi's limestone postcard looks effortless, but the city's best digital work is basically invisible infrastructure protecting water, waste, and reef pressure.",
      th: "โปสการ์ดหินปูนของกระบี่ดูเหมือนธรรมชาติให้มาฟรีๆ แต่ดิจิทัลที่ดีที่สุดของเมืองกลับเป็นโครงสร้างพื้นฐานที่แทบมองไม่เห็น ซึ่งคอยปกป้องน้ำ ขยะ และแรงกดดันต่อแนวปะการัง",
      zh: "甲米的石灰岩明信片看上去像天然赠礼，但它最好的数字化工作其实是看不见的基础设施，用来守住水、垃圾与珊瑚压力。",
    },
    compareNote: {
      en: "Cleaner, calmer, and more ecologically disciplined than Phuket, with much less economic muscle.",
      th: "สะอาดกว่า สงบกว่า และมีวินัยเชิงนิเวศมากกว่าภูเก็ต แต่พลังเศรษฐกิจก็น้อยกว่ามาก",
      zh: "比普吉更干净、更平静、生态纪律更强，但经济肌肉也弱得多。",
    },
  },
  chachoengsao: {
    industries: CITY_INDUSTRY_TAGS.chachoengsao,
    dailyLife: {
      en: "Factory shifts, truck traffic, warehouse routines, and commuting households define the rhythm. It feels more like an EEC work engine than a tourist-facing city.",
      th: "กะโรงงาน การวิ่งของรถบรรทุก งานคลังสินค้า และครัวเรือนคนทำงานกำหนดจังหวะของเมือง มันให้ความรู้สึกเป็นเครื่องยนต์ทำงานของ EEC มากกว่าเมืองที่หันหน้าหานักท่องเที่ยว",
      zh: "工厂轮班、卡车流、仓储节奏与通勤家庭定义了这里的日常。它更像 EEC 的工作引擎，而不是面向游客的城市。",
    },
    signatureStory: {
      en: "Chachoengsao's smart-city case is about industrial competence: logistics, flood warning, and citizen services that keep a fast-growing corridor from turning into chaos.",
      th: "เคสสมาร์ทซิตี้ของฉะเชิงเทราคือเรื่องความสามารถเชิงอุตสาหกรรม: โลจิสติกส์ เตือนน้ำท่วม และบริการประชาชนที่ช่วยไม่ให้ระเบียงที่โตเร็วกลายเป็นความโกลาหล",
      zh: "北柳的智慧城市逻辑，是工业能力：物流、洪水预警与市民服务，确保这条快速增长的走廊不会失控。",
    },
    funFact: {
      en: "It is one of those places where a boring dashboard is actually worth money, because factories and freight care about uptime, not rhetoric.",
      th: "ที่นี่คือหนึ่งในพื้นที่ที่ dashboard น่าเบื่อกลับมีมูลค่าจริง เพราะโรงงานกับสินค้าขนส่งแคร์ uptime ไม่ได้แคร์คำพูดสวยๆ",
      zh: "这里属于那种“无聊仪表盘反而很值钱”的地方，因为工厂和货运关心的是 uptime，不是口号。",
    },
    compareNote: {
      en: "Strong industrial spine, weaker soul: the challenge is turning corridor growth into livability.",
      th: "กระดูกสันหลังอุตสาหกรรมแข็ง แต่จิตวิญญาณเมืองยังบาง ความท้าทายคือเปลี่ยนการเติบโตของระเบียงให้กลายเป็นความน่าอยู่",
      zh: "工业脊梁很硬，城市灵魂还薄；真正挑战是把走廊增长变成可居住性。",
    },
  },
  "hat-yai": {
    industries: CITY_INDUSTRY_TAGS["hat-yai"],
    dailyLife: {
      en: "Hat Yai moves like a border-market metropolis: rail and bus arrivals, hospital visits, gold shops, retail streets, and late-night food all stack on top of each other.",
      th: "หาดใหญ่เคลื่อนแบบมหานครตลาดชายแดน: รถไฟ รถทัวร์ คนมาหาหมอ ร้านทอง ถนนค้าปลีก และอาหารดึกๆ ซ้อนทับกันทั้งวัน",
      zh: "合艾像一座边境商贸都市在运转：火车和大巴进城、就医流、金店、零售街与夜间美食，层层叠在同一天里。",
    },
    signatureStory: {
      en: "Hat Yai matters because southern Thailand needs a real service hub, not just resort branding. The city's smart edge is in managing flow, trade, and public services under pressure.",
      th: "หาดใหญ่สำคัญเพราะภาคใต้ต้องการศูนย์บริการจริง ไม่ใช่แค่แบรนด์รีสอร์ท จุดคมของสมาร์ทซิตี้ที่นี่คือการจัดการการไหลของคน การค้า และบริการสาธารณะภายใต้แรงกดดัน",
      zh: "合艾重要，是因为南泰需要真正的服务枢纽，而不只是度假品牌。这里的智慧边缘在于在高压下管理人流、商流与公共服务。",
    },
    funFact: {
      en: "It is one of the few Thai cities where transport, medicine, retail, and border trade all hit the same urban core at once.",
      th: "นี่คือหนึ่งในไม่กี่เมืองของไทยที่ขนส่ง การแพทย์ ค้าปลีก และการค้าชายแดน พุ่งเข้าชนแกนเมืองเดียวกันพร้อมกัน",
      zh: "这座城是泰国少数把交通、医疗、零售与边境贸易同时压进同一个核心区的地方。",
    },
    compareNote: {
      en: "Messier than a showcase city, but economically alive in ways the polished brochures never are.",
      th: "เละกว่าที่จะเอาไปทำเมืองตัวโชว์ แต่มีชีวิตทางเศรษฐกิจจริงในแบบที่โบรชัวร์สวยๆ มักไม่มี",
      zh: "它比样板城市更杂乱，但经济活力是真货，而这正是精修宣传册常常没有的东西。",
    },
  },
  nan: {
    industries: CITY_INDUSTRY_TAGS.nan,
    dailyLife: {
      en: "Nan runs slower than the northern tourist capitals. Life revolves around local markets, temples, farms, and community forest routines rather than nonstop consumption.",
      th: "น่านเดินช้ากว่าเมืองท่องเที่ยวใหญ่ของภาคเหนือ ชีวิตหมุนรอบตลาดท้องถิ่น วัด พื้นที่เกษตร และจังหวะของป่าชุมชน มากกว่าการบริโภคไม่หยุด",
      zh: "南城的节奏比北部旅游大城慢得多。这里的生活围绕本地市场、寺庙、农地和社区森林，而不是不间断消费。",
    },
    signatureStory: {
      en: "Nan's smart-city logic is community stewardship. The city shows how low-budget places can use data only where it protects forests, old town assets, and everyday resilience.",
      th: "ตรรกะสมาร์ทซิตี้ของน่านคือการดูแลโดยชุมชน เมืองนี้แสดงให้เห็นว่าพื้นที่งบน้อยสามารถใช้ข้อมูลเฉพาะจุดที่ช่วยปกป้องป่า เมืองเก่า และความยืดหยุ่นในชีวิตประจำวันได้อย่างไร",
      zh: "Nan 的智慧城市逻辑是社区守护。它说明低预算城市也能只在真正需要的地方用数据，去保护森林、古城和日常韧性。",
    },
    funFact: {
      en: "Nan proves that one of the poorest places in the index can still outperform richer cities on green coverage and social coherence.",
      th: "น่านพิสูจน์ว่าเมืองที่จนที่สุดแห่งหนึ่งในดัชนีก็ยังทำได้ดีกว่าเมืองที่รวยกว่าหลายแห่งในเรื่องพื้นที่สีเขียวและความเหนียวแน่นทางสังคม",
      zh: "南城证明了：指数里最穷的一批地方，也可以在绿化与社会凝聚力上打赢更富的城市。",
    },
    compareNote: {
      en: "Low cash, high cohesion: one of the most convincing small-city models in the index.",
      th: "เงินน้อย แต่ความเหนียวแน่นสูง: เป็นหนึ่งในโมเดลเมืองเล็กที่น่าเชื่อที่สุดในดัชนี",
      zh: "现金少，凝聚力高：这是指数里最有说服力的小城市模型之一。",
    },
  },

  // ─── NORTH ───
  "chiang-rai": {
    industries: CITY_INDUSTRY_TAGS["chiang-rai"],
    dailyLife: { en: "Dawn temple rounds, morning markets selling local lychee and tea, a growing cafe scene driven by art university students, and the Golden Triangle tourist circuit by afternoon.", th: "ตักบาตรเช้า ตลาดเช้าขายลิ้นจี่และชาท้องถิ่น คาเฟ่ที่เติบโตจากนักศึกษาศิลปะ และวงจรท่องเที่ยวสามเหลี่ยมทองคำตอนบ่าย", zh: "清晨寺庙行、早市卖荔枝和茶叶、由艺术院校学生驱动的咖啡馆文化、午后的金三角旅游线路。" },
    signatureStory: { en: "Chiang Rai proved a second-tier northern city can build genuine smart heritage tech — temple sensors and air quality monitoring — without Chiang Mai's budget.", th: "เชียงรายพิสูจน์ว่าเมืองภาคเหนือระดับสองสร้างเทคมรดกอัจฉริยะจริงได้ — เซ็นเซอร์วัดและเฝ้าระวังคุณภาพอากาศ — โดยไม่มีงบเชียงใหม่", zh: "清莱证明北部二线城市也能建设真正的智慧遗产技术——寺庙传感器和空气质量监测——不需要清迈那样的预算。" },
    funFact: { en: "The White Temple (Wat Rong Khun) is technically a private art installation, not a real temple — but it drives more tourist tech demand than most actual heritage sites.", th: "วัดร่องขุ่นเทคนิคแล้วเป็นงานศิลปะเอกชน ไม่ใช่วัดจริง — แต่สร้างความต้องการเทคท่องเที่ยวมากกว่าแหล่งมรดกจริงส่วนใหญ่", zh: "白庙严格来说是私人艺术装置而非真正寺庙——但它带来的旅游科技需求比大多数真正遗产点还多。" },
    compareNote: { en: "Northern heritage rival with genuine air quality crisis and border complexity that Chiang Mai doesn't face.", th: "คู่แข่งมรดกภาคเหนือที่มีวิกฤตคุณภาพอากาศจริงและความซับซ้อนชายแดนที่เชียงใหม่ไม่เจอ", zh: "北部遗产竞争者，面临清迈没有的空气质量危机和边境复杂性。" },
  },
  lampang: {
    industries: CITY_INDUSTRY_TAGS.lampang,
    dailyLife: { en: "Horse-drawn carriages still clip through the old town, ceramic workshops fire up before dawn, and the train station connects this quiet city to Bangkok overnight.", th: "รถม้ายังวิ่งผ่านเมืองเก่า โรงเซรามิกเปิดเตาก่อนรุ่งสาง และสถานีรถไฟเชื่อมเมืองเงียบนี้กับกรุงเทพฯ ข้ามคืน", zh: "马车仍在老城穿行，陶瓷作坊黎明前开炉，火车站连接这座安静城市与曼谷的夜行列车。" },
    signatureStory: { en: "Lampang bet on transitioning its century-old ceramics industry into smart manufacturing — kiln monitoring IoT, quality automation — instead of chasing tourism.", th: "ลำปางเดิมพันกับการเปลี่ยนอุตสาหกรรมเซรามิกร้อยปีเป็นการผลิตอัจฉริยะ — IoT เฝ้าระวังเตาเผา ระบบคุณภาพอัตโนมัติ — แทนที่จะไล่ตามท่องเที่ยว", zh: "南邦押注将百年陶瓷产业转型为智能制造——窑炉物联网监控、质量自动化——而非追逐旅游。" },
    funFact: { en: "Lampang is the only city in Thailand where horse-drawn carriages are still a legitimate public transport option, not a tourist gimmick.", th: "ลำปางเป็นเมืองเดียวในไทยที่รถม้ายังเป็นขนส่งสาธารณะจริง ไม่ใช่ลูกเล่นนักท่องเที่ยว", zh: "南邦是泰国唯一马车仍是正式公共交通而非旅游噱头的城市。" },
    compareNote: { en: "Heritage craft city that chose smart manufacturing over tourism — a rare and honest bet in the Thai smart city landscape.", th: "เมืองหัตถกรรมมรดกที่เลือกการผลิตอัจฉริยะแทนท่องเที่ยว — เดิมพันหายากและซื่อสัตย์ในภูมิทัศน์เมืองอัจฉริยะไทย", zh: "遗产手工艺城市选择智能制造而非旅游——在泰国智慧城市版图中难得的诚实赌注。" },
  },
  "mae-moh": {
    industries: CITY_INDUSTRY_TAGS["mae-moh"],
    dailyLife: { en: "EGAT's coal plant defines the rhythm — shift workers, company housing, and an economy that knows its clock is ticking as Thailand decarbonizes.", th: "โรงไฟฟ้าถ่านหิน กฟผ. กำหนดจังหวะ — คนงานกะ บ้านบริษัท และเศรษฐกิจที่รู้ว่าเวลากำลังจะหมดเมื่อไทย decarbonize", zh: "EGAT煤电厂定义了生活节奏——轮班工人、公司住房、一个深知随着泰国脱碳自己时日无多的经济。" },
    signatureStory: { en: "Mae Moh is Thailand's most honest energy-transition smart city: it knows the coal plant will close, and the smart city plan is the contingency.", th: "แม่เมาะเป็นเมืองอัจฉริยะเปลี่ยนผ่านพลังงานที่ซื่อสัตย์ที่สุดของไทย: รู้ว่าโรงไฟฟ้าถ่านหินจะปิด และแผนเมืองอัจฉริยะคือแผนสำรอง", zh: "湄莫是泰国最诚实的能源转型智慧城市：它知道煤电厂会关闭，智慧城市计划就是应急方案。" },
    funFact: { en: "The sunflower fields planted on old coal ash dumps are now Mae Moh's biggest tourist draw — accidentally beautiful remediation.", th: "ทุ่งทานตะวันที่ปลูกบนเถ้าถ่านเก่ากลายเป็นสิ่งดึงดูดนักท่องเที่ยวใหญ่สุดของแม่เมาะ — การฟื้นฟูที่สวยงามโดยบังเอิญ", zh: "种在旧煤灰堆上的向日葵田如今是湄莫最大的旅游卖点——意外美丽的环境修复。" },
    compareNote: { en: "Thailand's energy-transition test case: a company town that must reinvent itself before the coal runs out or regulation shuts it down.", th: "กรณีทดสอบเปลี่ยนผ่านพลังงานของไทย: เมืองบริษัทที่ต้องสร้างตัวเองใหม่ก่อนถ่านหินหมดหรือกฎหมายสั่งปิด", zh: "泰国能源转型试验场：一座必须在煤炭耗尽或法规关停之前自我重塑的公司城镇。" },
  },
  korat: {
    industries: CITY_INDUSTRY_TAGS.korat,
    dailyLife: { en: "Isan's gateway city: industrial parks along the highway, Suranaree University campus buzzing with tech students, and the future high-speed rail to Bangkok reshaping land markets.", th: "เมืองประตูอีสาน: นิคมอุตสาหกรรมตลอดทางหลวง มหาวิทยาลัยเทคโนโลยีสุรนารีเต็มไปด้วยนักศึกษาเทค และรถไฟความเร็วสูงไปกรุงเทพฯ กำลังเปลี่ยนตลาดที่ดิน", zh: "伊森的门户城市：高速公路沿线的工业园、苏拉纳里理工大学忙碌的科技学生、未来到曼谷的高铁正在重塑土地市场。" },
    signatureStory: { en: "Korat is betting that the Bangkok–Nakhon Ratchasima high-speed rail will do for Isan what the Shinkansen did for Nagoya — and the smart city plan is designed to capture that moment.", th: "โคราชเดิมพันว่ารถไฟความเร็วสูงกรุงเทพฯ-นครราชสีมาจะทำให้อีสานเหมือนที่ชินกันเซ็นทำให้นาโกย่า — และแผนเมืองอัจฉริยะออกแบบมาเพื่อจับโอกาสนั้น", zh: "呵叻押注曼谷—呵叻高铁将为伊森做到新干线为名古屋做到的事——智慧城市计划正是为抓住那个时刻而设计的。" },
    funFact: { en: "Korat's ancient Khmer temple complex (Phimai) predates Angkor Wat, but most Thais think of it as just another Isan city with a big highway.", th: "ปราสาทขอมโบราณของโคราช (พิมาย) เก่ากว่านครวัด แต่คนไทยส่วนใหญ่คิดว่าเป็นแค่อีกเมืองอีสานที่มีทางหลวงใหญ่", zh: "呵叻的古高棉神庙群（披迈）比吴哥窟还古老，但大多数泰国人只把它当作又一个有大公路的伊森城市。" },
    compareNote: { en: "Isan's biggest bet: a second-tier city planning to ride the high-speed rail wave with university muscle and manufacturing base.", th: "เดิมพันใหญ่สุดของอีสาน: เมืองระดับสองวางแผนขี่คลื่นรถไฟความเร็วสูงด้วยกล้ามมหาวิทยาลัยและฐานการผลิต", zh: "伊森最大的赌注：一座二线城市计划凭借大学实力和制造业基础搭乘高铁浪潮。" },
  },

  // ─── NORTHEAST ───
  ubon: {
    industries: CITY_INDUSTRY_TAGS.ubon,
    dailyLife: { en: "The Mun River sets the pace — monsoon flooding in wet season, candle festival preparations in dry season, and university students from Ubon Rajathanee filling the night markets year-round.", th: "แม่น้ำมูลกำหนดจังหวะ — น้ำท่วมหน้าฝน เตรียมเทศกาลเทียนหน้าแล้ง และนักศึกษามหาวิทยาลัยอุบลราชธานีเติมตลาดกลางคืนตลอดปี", zh: "蒙河定节奏——雨季洪水、旱季蜡烛节筹备、乌汶大学的学生全年填满夜市。" },
    signatureStory: { en: "Ubon's Candle Festival — where massive beeswax sculptures parade through streets — creates a natural test bed for smart event management that no tech demo could replicate.", th: "เทศกาลแห่เทียนอุบล — ที่ประติมากรรมขี้ผึ้งขนาดใหญ่แห่ผ่านถนน — สร้างพื้นที่ทดสอบธรรมชาติสำหรับจัดการอีเวนต์อัจฉริยะที่เทคสาธิตไหนเทียบไม่ได้", zh: "乌汶蜡烛节——巨型蜂蜡雕塑游行——为智慧活动管理创造了任何技术演示都无法复制的天然试验场。" },
    funFact: { en: "Ubon is closer to Vientiane and Phnom Penh than to Bangkok, making it more naturally an ASEAN border city than a Thai provincial capital.", th: "อุบลใกล้เวียงจันทน์และพนมเปญมากกว่ากรุงเทพฯ ทำให้เป็นเมืองชายแดนอาเซียนตามธรรมชาติมากกว่าเมืองหลวงจังหวัดไทย", zh: "乌汶离万象和金边比到曼谷更近，使它天然更像一座东盟边境城市而非泰国省会。" },
    compareNote: { en: "Mekong border city with genuine cultural weight and flood management needs — but Isan's structural poverty caps the ceiling.", th: "เมืองชายแดนโขงที่มีน้ำหนักวัฒนธรรมจริงและต้องการจัดการน้ำท่วม — แต่ความยากจนเชิงโครงสร้างของอีสานจำกัดเพดาน", zh: "湄公河边境城市，有真正的文化分量和防洪需求——但伊森的结构性贫困限制了天花板。" },
  },
  "ubon-muni": {
    industries: CITY_INDUSTRY_TAGS["ubon-muni"],
    dailyLife: { en: "The municipal core concentrates what the province spreads thin: government offices, the main hospital, university campuses, and the candle carving workshops that define festival season.", th: "แกนกลางเทศบาลรวมสิ่งที่จังหวัดกระจาย: สำนักงานราชการ โรงพยาบาลหลัก มหาวิทยาลัย และโรงแกะเทียนที่นิยามฤดูเทศกาล", zh: "市政核心浓缩了省级分散的一切：政府机关、主医院、大学校区、以及定义节庆季的蜡烛雕刻作坊。" },
    signatureStory: { en: "As a municipality within a larger smart city province, Ubon Muni is the operational testbed — if digital governance works in this 120K urban core, it can scale outward.", th: "ในฐานะเทศบาลในจังหวัดเมืองอัจฉริยะใหญ่กว่า อุบลเทศบาลเป็นพื้นที่ทดสอบปฏิบัติการ — หากปกครองดิจิทัลใช้ได้ในแกนเมือง 120K ก็ขยายออกไปได้", zh: "作为大省智慧城市中的市辖区，乌汶市是运营试验田——如果数字治理在这个12万人口的城市核心行得通，就能向外扩展。" },
    funFact: { en: "The candle festival's largest sculptures can weigh over 2 tons and take months to carve — smart logistics for moving them is a genuine municipal challenge.", th: "ประติมากรรมเทียนที่ใหญ่สุดหนักกว่า 2 ตันใช้เวลาแกะหลายเดือน — โลจิสติกส์อัจฉริยะเพื่อเคลื่อนย้ายเป็นความท้าทายเทศบาลจริง", zh: "蜡烛节最大的雕塑重逾2吨、需数月雕刻——移动它们的智慧物流是真正的市政挑战。" },
    compareNote: { en: "The compact municipal lens on Ubon's story — small enough to pilot, connected enough to scale.", th: "มุมมองเทศบาลกระชับของเรื่องราวอุบล — เล็กพอจะนำร่อง เชื่อมต่อพอจะขยาย", zh: "乌汶故事的紧凑市政视角——小到可以试点，连接到可以扩展。" },
  },

  // ─── SOUTH ───
  "nakhon-si-thammarat": {
    industries: CITY_INDUSTRY_TAGS["nakhon-si-thammarat"],
    dailyLife: { en: "Government offices, rubber tapping at dawn, shadow puppet workshops, and a night market scene that serves southern Thai food fiercer than anything in Bangkok.", th: "สำนักงานราชการ กรีดยางตอนเช้า โรงหนังตะลุง และตลาดกลางคืนที่เสิร์ฟอาหารใต้แรงกว่าอะไรก็ตามในกรุงเทพฯ", zh: "政府机关、黎明割胶、皮影戏作坊、以及比曼谷任何地方都猛烈的南部泰餐夜市。" },
    signatureStory: { en: "NST won the ASEAN Smart City Showcase because its citizen-centric approach — bottom-up governance, real data loops — proved smart city works without massive budgets.", th: "นครฯ ชนะ ASEAN Smart City Showcase เพราะแนวทางเน้นประชาชน — ปกครองจากล่างขึ้นบน วงจรข้อมูลจริง — พิสูจน์ว่าเมืองอัจฉริยะทำงานได้โดยไม่ต้องงบมหาศาล", zh: "NST赢得东盟智慧城市展示赛，因为它以公民为中心的方式——自下而上治理、真实数据循环——证明智慧城市不需要巨额预算也能运作。" },
    funFact: { en: "Nang Talung (southern shadow puppetry) has been performed here for 400+ years — and the city is now digitizing puppet master lineages as cultural data preservation.", th: "หนังตะลุงแสดงที่นี่มากกว่า 400 ปี — และเมืองกำลังแปลงสายตระกูลหนังตะลุงเป็นดิจิทัลเพื่ออนุรักษ์ข้อมูลวัฒนธรรม", zh: "南部皮影戏在这里已演出400多年——城市正在将皮影大师的传承谱系数字化保存。" },
    compareNote: { en: "The poster child for citizen-centric smart city on a budget — if this model doesn't scale, nothing will.", th: "ตัวอย่างเมืองอัจฉริยะเน้นประชาชนด้วยงบจำกัด — ถ้าโมเดลนี้ขยายไม่ได้ ไม่มีอะไรทำได้", zh: "公民导向智慧城市的标杆——如果这个模型无法扩展，那什么都不行。" },
  },
  yala: {
    industries: CITY_INDUSTRY_TAGS.yala,
    dailyLife: { en: "Morning markets with Thai-Malay halal food, rubber tappers heading out before sunrise, security checkpoints on main roads, and a city government that runs cleaner than its reputation suggests.", th: "ตลาดเช้าอาหารฮาลาลไทย-มลายู กรีดยางก่อนพระอาทิตย์ขึ้น ด่านตรวจบนถนนหลัก และเทศบาลที่สะอาดกว่าชื่อเสียง", zh: "早市上的泰-马来清真食品、日出前出发的割胶工、主干道上的安检站、以及一个比名声暗示的更清廉的市政府。" },
    signatureStory: { en: "Yala won Thailand's cleanest city award — in a conflict zone. That is not a marketing line; it is evidence that governance quality beats GDP for smart city outcomes.", th: "ยะลาได้รางวัลเมืองสะอาดของไทย — ในเขตขัดแย้ง นี่ไม่ใช่สโลแกน แต่เป็นหลักฐานว่าคุณภาพธรรมาภิบาลชนะ GDP สำหรับผลลัพธ์เมืองอัจฉริยะ", zh: "亚拉在冲突区获得泰国最清洁城市奖——这不是营销口号，而是治理质量战胜GDP的智慧城市成果证据。" },
    funFact: { en: "Yala's Betong district holds the record for the foggiest place in Thailand — and uses IoT weather monitoring to keep its famous sea-of-clouds viewpoint accessible.", th: "อำเภอเบตงของยะลาถือสถิติสถานที่หมอกมากที่สุดในไทย — และใช้ IoT เฝ้าระวังสภาพอากาศเพื่อให้จุดชมทะเลหมอกที่มีชื่อเสียงเข้าถึงได้", zh: "亚拉的勿洞区保持着泰国最多雾的记录——并使用物联网气象监测来保持其著名的云海观景点可达。" },
    compareNote: { en: "Proof that a conflict zone can still build genuine smart governance — cleanest city award despite the lowest safety scores.", th: "พิสูจน์ว่าเขตขัดแย้งยังสร้างปกครองอัจฉริยะจริงได้ — รางวัลเมืองสะอาดแม้คะแนนความปลอดภัยต่ำสุด", zh: "证明冲突区仍能建设真正的智慧治理——即使安全分最低也能获得最清洁城市奖。" },
  },
  pattani: {
    industries: CITY_INDUSTRY_TAGS.pattani,
    dailyLife: { en: "PSU Pattani campus gives the city a university pulse despite the security situation. Halal food processing plants run along the coast, and the historic Malay trading quarter has more stories than tourists.", th: "มอ.ปัตตานีให้เมืองชีพจรมหาวิทยาลัยแม้สถานการณ์ความมั่นคง โรงงานแปรรูปอาหารฮาลาลเรียงตามชายฝั่ง และย่านค้าขายมลายูประวัติศาสตร์มีเรื่องราวมากกว่านักท่องเที่ยว", zh: "宋卡王子大学北大年校区为这座城市注入大学脉搏。清真食品加工厂沿海岸线排列，历史悠久的马来商贸区故事比游客还多。" },
    signatureStory: { en: "Pattani's bet on halal food traceability technology is the smartest play in the deep south — it transforms a cultural identity into an exportable digital supply chain.", th: "การเดิมพันของปัตตานีกับเทคโนโลยีตรวจสอบย้อนกลับอาหารฮาลาลเป็นเกมอัจฉริยะที่สุดในชายแดนใต้ — แปลงอัตลักษณ์วัฒนธรรมเป็นห่วงโซ่อุปทานดิจิทัลส่งออกได้", zh: "北大年押注清真食品溯源技术是深南最聪明的一步——将文化认同转化为可出口的数字供应链。" },
    funFact: { en: "Krue Se Mosque, one of Southeast Asia's oldest, has stood since 1578 — making Pattani's heritage tech challenge older than most European smart city heritage.", th: "มัสยิดกรือเซะ หนึ่งในเก่าแก่สุดของเอเชียตะวันออกเฉียงใต้ ตั้งตั้งแต่ 2121 — ทำให้ความท้าทายเทคมรดกของปัตตานีเก่ากว่ามรดกเมืองอัจฉริยะยุโรปส่วนใหญ่", zh: "Krue Se清真寺是东南亚最古老的之一，建于1578年——使北大年的遗产科技挑战比大多数欧洲智慧城市遗产更古老。" },
    compareNote: { en: "Where halal food meets digital supply chain — the deep south's most commercially viable smart city proposition.", th: "จุดที่อาหารฮาลาลพบห่วงโซ่อุปทานดิจิทัล — ข้อเสนอเมืองอัจฉริยะที่มีศักยภาพเชิงพาณิชย์มากสุดของชายแดนใต้", zh: "清真食品遇上数字供应链——深南最具商业可行性的智慧城市命题。" },
  },
  narathiwat: {
    industries: CITY_INDUSTRY_TAGS.narathiwat,
    dailyLife: { en: "The Sungai Kolok border crossing drives the rhythm — cross-border traders by day, security patrols by night, and a government workforce that constitutes the city's economic anchor.", th: "ด่านสุไหงโก-ลกกำหนดจังหวะ — พ่อค้าข้ามพรมแดนตอนกลางวัน ลาดตระเวนความมั่นคงตอนกลางคืน และข้าราชการที่เป็นสมอเศรษฐกิจเมือง", zh: "苏梅高洛口岸定节奏——白天跨境商人、夜间安保巡逻、以及构成城市经济支柱的公务员队伍。" },
    signatureStory: { en: "Narathiwat's cross-border digital trade pilot with Malaysia is the most geopolitically interesting smart city project in Thailand — if it works, it's a template for every ASEAN border.", th: "โครงการนำร่องค้าดิจิทัลข้ามพรมแดนกับมาเลเซียของนราธิวาสเป็นโครงการเมืองอัจฉริยะที่น่าสนใจทางภูมิรัฐศาสตร์มากสุดในไทย — ถ้าสำเร็จจะเป็นแม่แบบสำหรับทุกชายแดนอาเซียน", zh: "那拉提瓦与马来西亚的跨境数字贸易试点是泰国最具地缘政治意义的智慧城市项目——如果成功，将成为每个东盟边境的模板。" },
    funFact: { en: "Narathiwat has Thailand's cleanest air in the index (PM2.5 12.5) despite being the province with the lowest safety score — nature doesn't care about politics.", th: "นราธิวาสมีอากาศสะอาดสุดในดัชนี (PM2.5 12.5) ทั้งที่เป็นจังหวัดที่คะแนนความปลอดภัยต่ำสุด — ธรรมชาติไม่สนการเมือง", zh: "那拉提瓦拥有指数中最清洁的空气（PM2.5 12.5），尽管安全分最低——自然不在乎政治。" },
    compareNote: { en: "Southernmost and most challenging: clean air, genuine digital trade pilot, but security constraints cap everything.", th: "ใต้สุดและท้าทายสุด: อากาศสะอาด นำร่องค้าดิจิทัลจริง แต่ข้อจำกัดความมั่นคงจำกัดทุกอย่าง", zh: "最南、最具挑战：空气清洁、真正的数字贸易试点，但安全约束限制了一切。" },
  },
  "songkhla-city": {
    industries: CITY_INDUSTRY_TAGS["songkhla-city"],
    dailyLife: { en: "Songkhla Lake defines the city — fishermen cast nets at dawn, PSU researchers study the lake ecology, and the old town's Chinese-Thai shophouses host a growing cafe and gallery scene.", th: "ทะเลสาบสงขลานิยามเมือง — ชาวประมงทอดแหตอนเช้า นักวิจัย มอ.ศึกษาระบบนิเวศทะเลสาบ และตึกแถวไทย-จีนเมืองเก่ารองรับคาเฟ่และแกลเลอรี่ที่เติบโต", zh: "宋卡湖定义了这座城市——渔民清晨撒网、宋卡大学研究人员研究湖泊生态、老城的中泰骑楼承载着日益增长的咖啡馆和画廊文化。" },
    signatureStory: { en: "Songkhla's lake monitoring system is the real deal — IoT sensors tracking water quality, fish population, and sediment levels. It's the kind of environmental smart city that works because the data matters to people's livelihoods.", th: "ระบบเฝ้าระวังทะเลสาบสงขลาเป็นของจริง — เซ็นเซอร์ IoT ติดตามคุณภาพน้ำ ประชากรปลา และระดับตะกอน เป็นเมืองอัจฉริยะสิ่งแวดล้อมที่ใช้ได้เพราะข้อมูลสำคัญต่อชีวิตความเป็นอยู่ของคน", zh: "宋卡的湖泊监测系统是真货——物联网传感器追踪水质、鱼群数量和沉积物水平。这是那种因为数据关系到人们生计而真正有效的环境智慧城市。" },
    funFact: { en: "Songkhla Lake is Thailand's largest natural lake and the only one that mixes fresh and saltwater — making its IoT monitoring uniquely complex.", th: "ทะเลสาบสงขลาเป็นทะเลสาบธรรมชาติใหญ่สุดของไทยและเป็นแห่งเดียวที่ผสมน้ำจืดและน้ำเค็ม — ทำให้ IoT เฝ้าระวังซับซ้อนเป็นเอกลักษณ์", zh: "宋卡湖是泰国最大的天然湖泊，也是唯一淡咸水混合的——使其物联网监测独特地复杂。" },
    compareNote: { en: "Lake city with genuine environmental IoT, strong university base, and cultural identity — if it can resist Hat Yai's commercial gravity.", th: "เมืองทะเลสาบที่มี IoT สิ่งแวดล้อมจริง ฐานมหาวิทยาลัยแข็ง และอัตลักษณ์วัฒนธรรม — หากต้านแรงดึงดูดเชิงพาณิชย์ของหาดใหญ่ได้", zh: "湖泊城市拥有真正的环境物联网、强大的大学基础和文化认同——如果能抵抗合艾的商业引力。" },
  },
  sritrang: {
    industries: CITY_INDUSTRY_TAGS.sritrang,
    dailyLife: { en: "Rubber tappers work before dawn, the Andaman coast brings small-scale fishing boats in by mid-morning, and the rest of the day is quiet — Trang's idea of smart is unhurried.", th: "กรีดยางก่อนรุ่งสาง เรือประมงขนาดเล็กจากอันดามันกลับฝั่งสาย และที่เหลือเป็นวันเงียบ — นิยามอัจฉริยะของตรังคือไม่รีบร้อน", zh: "割胶工黎明前开工，安达曼海岸的小渔船上午中回港，其余时间安静——董里对智慧的定义是不急不忙。" },
    signatureStory: { en: "Sri Trang is proof that a quiet city with clean air, low crime, and genuine green initiatives can score well without flashy tech — the opposite of a demo city.", th: "ศรีตรังเป็นหลักฐานว่าเมืองเงียบๆ อากาศสะอาด อาชญากรรมต่ำ และโครงการสีเขียวจริงทำคะแนนดีได้โดยไม่ต้องมีเทคหวือหวา — ตรงข้ามกับเมืองสาธิต", zh: "是里董证明一座安静城市凭借清洁空气、低犯罪率和真正的绿色倡议也能得高分——示范城市的反面。" },
    funFact: { en: "Trang introduced roast pork as a cultural identity — it's the only southern Thai province where Chinese-Thai pork cuisine dominates the food scene despite being in the Muslim south.", th: "ตรังเอาหมูย่างเป็นอัตลักษณ์วัฒนธรรม — เป็นจังหวัดใต้แห่งเดียวที่อาหารหมูไทย-จีนครองวงการอาหารแม้อยู่ในใต้มุสลิม", zh: "董里将烤猪肉作为文化标识——它是唯一一个泰-华猪肉美食主导饮食场景的南部省份，尽管位于穆斯林南部。" },
    compareNote: { en: "The quiet green achiever: PM2.5 16.8, crime 110, green coverage 62% — numbers speak louder than marketing.", th: "ผู้บรรลุสีเขียวเงียบๆ: PM2.5 16.8 อาชญากรรม 110 พื้นที่สีเขียว 62% — ตัวเลขดังกว่าการตลาด", zh: "安静的绿色达标者：PM2.5 16.8、犯罪率110、绿化覆盖62%——数字比营销响亮。" },
  },

  // ─── EAST ───
  rayong: {
    industries: CITY_INDUSTRY_TAGS.rayong,
    dailyLife: { en: "Petrochemical plant shifts, Map Ta Phut's industrial workforce, and a coastline that swings between factory zones and fruit orchards — Rayong lives the tension between GDP and green.", th: "กะโรงงานปิโตรเคมี กำลังแรงงานอุตสาหกรรมมาบตาพุด และแนวชายฝั่งที่แกว่งระหว่างเขตโรงงานกับสวนผลไม้ — ระยองใช้ชีวิตในความตึงเครียดระหว่าง GDP กับสีเขียว", zh: "石化厂轮班、玛塔普的工业劳动力、以及在工厂区和果园之间摇摆的海岸线——罗勇活在GDP与绿色的张力中。" },
    signatureStory: { en: "Rayong's environmental monitoring IoT exists because it has to — chemical industry density makes air and water quality monitoring a survival necessity, not a nice-to-have.", th: "IoT เฝ้าระวังสิ่งแวดล้อมของระยองมีอยู่เพราะจำเป็น — ความหนาแน่นอุตสาหกรรมเคมีทำให้เฝ้าระวังคุณภาพอากาศและน้ำเป็นเรื่องเอาชีวิตรอด ไม่ใช่มีก็ดี", zh: "罗勇的环境监测物联网存在因为必须存在——化工产业密度使空气和水质监测成为生存必需品而非锦上添花。" },
    funFact: { en: "Rayong's GPP per capita (฿1.02M) is the highest in the entire index — higher than Phuket, higher than Bangkok — because petrochemical output per worker is enormous.", th: "GPP ต่อหัวของระยอง (฿1.02M) สูงสุดในดัชนีทั้งหมด — สูงกว่าภูเก็ต สูงกว่ากรุงเทพฯ — เพราะผลผลิตปิโตรเคมีต่อคนงานมหาศาล", zh: "罗勇的人均GPP（฿1.02M）是整个指数中最高的——高于普吉、高于曼谷——因为每个工人的石化产出巨大。" },
    compareNote: { en: "Thailand's richest city per capita with the starkest environment-economy tension — the monitoring works because lives depend on it.", th: "เมืองที่รวยสุดต่อหัวของไทยด้วยความตึงเครียดสิ่งแวดล้อม-เศรษฐกิจที่ชัดเจนสุด — การเฝ้าระวังใช้ได้เพราะชีวิตขึ้นอยู่กับมัน", zh: "泰国人均最富城市，环境-经济张力最鲜明——监测有效因为生命取决于此。" },
  },
  "wangchan-valley": {
    industries: CITY_INDUSTRY_TAGS["wangchan-valley"],
    dailyLife: { en: "Almost nobody lives here. PTT's planned innovation campus has a masterplan with seven smart dimensions, but the land is mostly empty fields and construction fences.", th: "แทบไม่มีใครอยู่ที่นี่ แคมปัสนวัตกรรมที่ ปตท. วางแผนมีแผนแม่บทครบ 7 มิติ แต่ที่ดินส่วนใหญ่ยังเป็นทุ่งว่างและรั้วก่อสร้าง", zh: "几乎没人住在这里。PTT规划的创新园区有七个智慧维度的总体规划，但土地大部分仍是空地和施工围栏。" },
    signatureStory: { en: "Wangchan Valley was ranked Thailand's #1 smart city by the old index. In reality: not even 10% built. This is why SCITI exists — to measure outcomes, not plans.", th: "วังจันทร์วัลเลย์ถูกจัดอันดับ #1 ของไทยจากดัชนีเก่า ในความจริง: สร้างไม่ถึง 10% นี่คือเหตุผลที่ SCITI มีอยู่ — วัดผลลัพธ์ ไม่ใช่แผน", zh: "旺婵谷曾被旧指数评为泰国第一智慧城市。实际上：建设不到10%。这就是SCITI存在的原因——衡量成果而非计划。" },
    funFact: { en: "The masterplan won international smart city design awards. The site has zero permanent residents. The gap between award and reality is the whole point of this index.", th: "แผนแม่บทชนะรางวัลออกแบบเมืองอัจฉริยะนานาชาติ สถานที่มีผู้อยู่อาศัยถาวร 0 คน ช่องว่างระหว่างรางวัลกับความจริงคือประเด็นทั้งหมดของดัชนีนี้", zh: "总体规划赢得了国际智慧城市设计奖。场地永久居民为零。奖项与现实之间的差距正是这个指数存在的全部意义。" },
    compareNote: { en: "The emperor has no clothes: award-winning masterplan, zero residents, zero operational services. A cautionary tale.", th: "จักรพรรดิไม่มีเสื้อผ้า: แผนแม่บทชนะรางวัล ผู้อยู่อาศัย 0 บริการปฏิบัติการ 0 บทเรียนเตือนใจ", zh: "皇帝的新衣：获奖总体规划、零居民、零运营服务。一个警世故事。" },
  },

  // ─── BANGKOK / CENTRAL ───
  rattanakosin: {
    industries: CITY_INDUSTRY_TAGS.rattanakosin,
    dailyLife: { en: "Monks collect alms at dawn along Ratchadamnoen, tourists queue at the Grand Palace by 9am, canal boats carry commuters, and the old town's evening turns gentle as temples light up.", th: "พระบิณฑบาตเช้าตามราชดำเนิน นักท่องเที่ยวต่อคิวพระบรมมหาราชวัง 9 โมง เรือคลองรับผู้โดยสาร และยามเย็นเมืองเก่าอ่อนโยนเมื่อวัดเปิดไฟ", zh: "僧侣沿拉差丹能大道清晨化缘、游客9点排队进大皇宫、运河船载通勤者、老城傍晚随寺庙亮灯变得温柔。" },
    signatureStory: { en: "Rattanakosin's heritage-tech fusion — smart canal management, cultural asset digitization — scored the highest hospitality pillar in the entire index (82) because the tech serves the heritage, not the other way around.", th: "การผสมผสานมรดก-เทคของรัตนโกสินทร์ — จัดการคลองอัจฉริยะ แปลงสินทรัพย์วัฒนธรรมเป็นดิจิทัล — ได้คะแนนเสาการท่องเที่ยวสูงสุดในดัชนีทั้งหมด (82) เพราะเทครับใช้มรดก ไม่ใช่ทางกลับกัน", zh: "拉达那哥欣的遗产-科技融合——智慧运河管理、文化资产数字化——在整个指数中获得最高的旅游业支柱分（82），因为技术服务于遗产而非相反。" },
    funFact: { en: "Rattanakosin Island isn't an island anymore — the canal that once surrounded the old city district has been partially filled in, but the name persists like digital legacy data.", th: "เกาะรัตนโกสินทร์ไม่ใช่เกาะอีกแล้ว — คลองที่เคยล้อมรอบย่านเมืองเก่าถูกถมบางส่วน แต่ชื่อยังคงอยู่เหมือนข้อมูลดิจิทัลเก่า", zh: "拉达那哥欣岛已经不是岛了——曾环绕老城区的运河已被部分填平，但名字像数字遗留数据一样留存。" },
    compareNote: { en: "Bangkok's sacred core: highest hospitality score in the index, genuine heritage-tech, but overtourism and air pollution are relentless.", th: "แกนกลางศักดิ์สิทธิ์ของกรุงเทพฯ: คะแนนการท่องเที่ยวสูงสุดในดัชนี มรดก-เทคจริง แต่นักท่องเที่ยวล้นและมลพิษอากาศไม่หยุด", zh: "曼谷的神圣核心：指数中最高旅游分、真正的遗产科技，但过度旅游和空气污染无情。" },
  },
  nonthaburi: {
    industries: CITY_INDUSTRY_TAGS.nonthaburi,
    dailyLife: { en: "MRT Purple Line carries 1.28M residents into Bangkok each morning and brings them back each night. The city is a commuter suburb that dreams of its own identity.", th: "MRT สายสีม่วงพา 1.28 ล้านคนเข้ากรุงเทพฯ ทุกเช้าและพากลับทุกคืน เมืองเป็นชานเมืองผู้เดินทางที่ฝันถึงอัตลักษณ์ของตัวเอง", zh: "MRT紫线每天早上把128万居民送进曼谷、每晚带回来。这座城市是一个梦想拥有自身身份的通勤郊区。" },
    signatureStory: { en: "Nonthaburi's digital governance actually works for residents — municipal e-services, complaint tracking, and flood alerts — because the city government treats 1.28M people as its own, not as Bangkok's overflow.", th: "ธรรมาภิบาลดิจิทัลนนทบุรีใช้ได้จริงสำหรับผู้อยู่อาศัย — e-services เทศบาล ติดตามร้องเรียน แจ้งเตือนน้ำท่วม — เพราะเทศบาลดูแล 1.28 ล้านคนเป็นของตัวเอง ไม่ใช่ส่วนล้นจากกรุงเทพฯ", zh: "暖武里的数字治理对居民真正有效——市政电子服务、投诉追踪、洪水预警——因为市政府把128万人当作自己的而非曼谷的溢出。" },
    funFact: { en: "Nonthaburi durian is considered the finest in Thailand — the province's famous Mon Thong variety commands premium prices at Bangkok's top fruit shops.", th: "ทุเรียนนนทบุรีถือว่าดีที่สุดในไทย — พันธุ์หมอนทองที่มีชื่อเสียงของจังหวัดขายราคาพรีเมียมที่ร้านผลไม้ชั้นนำของกรุงเทพฯ", zh: "暖武里榴莲被认为是泰国最好的——该省著名的金枕头品种在曼谷顶级水果店能卖出高价。" },
    compareNote: { en: "Bangkok's largest smart suburb: genuine digital governance serving 1.28M, but inherits the capital's pollution and congestion without its budget.", th: "ชานเมืองอัจฉริยะใหญ่สุดของกรุงเทพฯ: ธรรมาภิบาลดิจิทัลจริงรับใช้ 1.28M แต่รับมลพิษและรถติดจากเมืองหลวงมาโดยไม่มีงบ", zh: "曼谷最大的智慧郊区：真正的数字治理服务128万人，但继承了首都的污染和拥堵却没有它的预算。" },
  },
  "samut-prakan": {
    industries: CITY_INDUSTRY_TAGS["samut-prakan"],
    dailyLife: { en: "Factory whistles mark the hours, Suvarnabhumi Airport's flight path passes overhead, and the low-lying land floods with depressing regularity during monsoon season.", th: "เสียงหวูดโรงงานบอกเวลา เส้นทางบินสุวรรณภูมิผ่านเหนือหัว และที่ดินลุ่มน้ำท่วมด้วยความสม่ำเสมอน่าหดหู่ในหน้ามรสุม", zh: "工厂汽笛标记时间、素万那普机场航线从头顶飞过、低洼地在雨季以令人沮丧的规律性被淹。" },
    signatureStory: { en: "Samut Prakan's Industry 4.0 smart factory zones are where Thailand's manufacturing future is actually being tested — not in a conference room, but on real production lines.", th: "เขตโรงงานอัจฉริยะ Industry 4.0 ของสมุทรปราการคือที่ที่อนาคตการผลิตของไทยกำลังถูกทดสอบจริง — ไม่ใช่ในห้องประชุม แต่บนสายการผลิตจริง", zh: "北榄的工业4.0智能工厂区是泰国制造业未来真正被测试的地方——不是在会议室里，而是在真正的生产线上。" },
    funFact: { en: "The ancient city museum (Muang Boran) in Samut Prakan is the world's largest outdoor museum — 320 acres of scaled-down Thai heritage structures, ironically in Thailand's most industrial province.", th: "เมืองโบราณในสมุทรปราการเป็นพิพิธภัณฑ์กลางแจ้งใหญ่สุดในโลก — 320 เอเคอร์ของสิ่งก่อสร้างมรดกไทยย่อส่วน แดกดันในจังหวัดที่เป็นอุตสาหกรรมมากสุดของไทย", zh: "北榄的古城博物馆是世界最大的户外博物馆——320英亩的缩小版泰国遗产建筑，讽刺地位于泰国最工业化的省份。" },
    compareNote: { en: "GDP powerhouse with livability gap: Industry 4.0 works on the factory floor, but green coverage 18% and chronic flooding show the human cost.", th: "มหาอำนาจ GDP ที่มีช่องว่างความน่าอยู่: Industry 4.0 ใช้ได้บนพื้นโรงงาน แต่พื้นที่สีเขียว 18% และน้ำท่วมเรื้อรังแสดงต้นทุนมนุษย์", zh: "GDP强国但宜居差距：工业4.0在车间有效，但绿化覆盖18%和慢性洪水显示了人类代价。" },
  },

  // ─── BORDER & SPECIAL ───
  tak: {
    industries: CITY_INDUSTRY_TAGS.tak,
    dailyLife: { en: "Mae Sot's border crossing buzzes with Myanmar workers, Thai-Myanmar trade trucks, and a factory economy that runs on cross-border labor — smart customs tech matters here.", th: "ด่านแม่สอดคึกคักด้วยแรงงานเมียนมา รถค้าไทย-เมียนมา และเศรษฐกิจโรงงานที่ขับเคลื่อนด้วยแรงงานข้ามพรมแดน — เทคศุลกากรอัจฉริยะสำคัญที่นี่", zh: "湄索口岸忙碌着缅甸工人、泰缅贸易卡车、以及靠跨境劳动力运转的工厂经济——智慧海关技术在这里很重要。" },
    signatureStory: { en: "Tak's Mae Sot SEZ is Thailand's most active border economic zone — and the smart customs digitization pilot here could transform every land border crossing in ASEAN.", th: "SEZ แม่สอดของตากเป็นเขตเศรษฐกิจชายแดนที่คึกคักสุดของไทย — และนำร่องดิจิทัลศุลกากรอัจฉริยะที่นี่อาจเปลี่ยนทุกด่านชายแดนทางบกในอาเซียน", zh: "达府的湄索经济特区是泰国最活跃的边境经济区——这里的智慧海关数字化试点可能改变东盟每个陆地口岸。" },
    funFact: { en: "Mae Sot has a higher proportion of Burmese speakers than Thai speakers during business hours — making multilingual digital governance a practical necessity.", th: "แม่สอดมีสัดส่วนผู้พูดพม่ามากกว่าผู้พูดไทยในชั่วโมงทำการ — ทำให้ปกครองดิจิทัลหลายภาษาเป็นความจำเป็นจริง", zh: "湄索在工作时间缅语使用者比例高于泰语——使多语言数字治理成为实际必需。" },
    compareNote: { en: "Thailand's western gateway: if Myanmar stabilizes, this becomes a corridor to the Indian Ocean economy. Smart customs is the key.", th: "ประตูตะวันตกของไทย: หากเมียนมามีเสถียรภาพ จะกลายเป็นระเบียงสู่เศรษฐกิจมหาสมุทรอินเดีย ศุลกากรอัจฉริยะคือกุญแจ", zh: "泰国的西大门：如果缅甸稳定下来，这里就成为通往印度洋经济的走廊。智慧海关是关键。" },
  },
  maesai: {
    industries: CITY_INDUSTRY_TAGS.maesai,
    dailyLife: { en: "The Sai River separates Thailand from Myanmar by meters. Border traders cross daily, gem dealers negotiate in tea shops, and since the 2024 floods, disaster preparedness defines the town's priorities.", th: "แม่น้ำสายแยกไทยจากเมียนมาเพียงเมตร พ่อค้าข้ามพรมแดนทุกวัน พ่อค้าพลอยต่อรองในร้านน้ำชา และตั้งแต่น้ำท่วม 2567 เตรียมพร้อมภัยพิบัตินิยามลำดับความสำคัญของเมือง", zh: "赛河仅数米之隔泰缅两国。边境商人每日往返、宝石商在茶馆谈判，2024年洪灾后，防灾准备定义了这个城镇的优先级。" },
    signatureStory: { en: "The 2024 floods destroyed much of Mae Sai — the rebuilding is Thailand's first test of 'build back smarter' as policy, not slogan.", th: "น้ำท่วม 2567 ทำลายแม่สายส่วนใหญ่ — การฟื้นฟูเป็นบททดสอบแรกของไทยในการ 'สร้างใหม่อัจฉริยะกว่า' เป็นนโยบาย ไม่ใช่สโลแกน", zh: "2024年洪水摧毁了湄赛大部分地区——重建是泰国首次将'更智慧地重建'作为政策而非口号的测试。" },
    funFact: { en: "Mae Sai is Thailand's northernmost point — the 'first' and 'last' markers at the bridge are selfie spots that generate more foot traffic than any smart city sensor.", th: "แม่สายเป็นจุดเหนือสุดของไทย — ป้าย 'สุดเหนือ' ที่สะพานเป็นจุดเซลฟี่ที่สร้าง foot traffic มากกว่าเซ็นเซอร์เมืองอัจฉริยะใดๆ", zh: "湄赛是泰国最北端——桥上的'最北'标志是自拍点，产生的人流量比任何智慧城市传感器都多。" },
    compareNote: { en: "Northernmost border town rebuilding after disaster — a real-world test of resilient smart infrastructure that matters.", th: "เมืองชายแดนเหนือสุดฟื้นฟูหลังภัยพิบัติ — บททดสอบจริงของโครงสร้างพื้นฐานอัจฉริยะยืดหยุ่นที่สำคัญ", zh: "最北边境城镇灾后重建——韧性智慧基础设施的真实测试。" },
  },

  // ─── NORTH (ADDITIONAL) ───
  phichit: {
    industries: CITY_INDUSTRY_TAGS.phichit,
    dailyLife: {
      en: "Rice paddies stretch to the horizon, pickup trucks haul the harvest, and the crocodile farm on the edge of town draws more visitors than any government office. Life here follows planting cycles, not app updates.",
      th: "ทุ่งนาทอดยาวสุดขอบฟ้า กระบะขนข้าว และฟาร์มจระเข้ชานเมืองดึงคนมามากกว่าสำนักงานราชการใดๆ ชีวิตที่นี่เดินตามวงจรเพาะปลูก ไม่ใช่อัปเดตแอป",
      zh: "稻田一直延伸到地平线，皮卡车拉着收成，城边的鳄鱼养殖场吸引的游客比任何政府机关都多。这里的生活跟着种植周期走，而不是应用更新。",
    },
    signatureStory: {
      en: "Phichit's smart city pitch is digital literacy for farmers — teaching 530K mostly rural residents to use government apps and online markets. It is the one-dimension-only experiment: just 'people', nothing else certified yet.",
      th: "เมืองอัจฉริยะพิจิตรเน้นรู้เท่าทันดิจิทัลสำหรับเกษตรกร — สอนผู้อยู่อาศัย 530K ส่วนใหญ่ในชนบทให้ใช้แอปราชการและตลาดออนไลน์ เป็นการทดลองมิติเดียว: แค่ 'คน' ยังไม่มีอย่างอื่นรับรอง",
      zh: "碧差汶的智慧城市卖点是农民数字素养——教53万主要是农村居民使用政府应用和在线市场。这是一个单维度实验：只有'人'这一项，其他都还没认证。",
    },
    funFact: {
      en: "Phichit's Bueng Si Fai is one of Thailand's largest freshwater marshes and hosts the biggest crocodile boat race festival in the country — 200+ boats, zero smart tech involved.",
      th: "บึงสีไฟของพิจิตรเป็นหนึ่งในบึงน้ำจืดใหญ่สุดของไทย และจัดแข่งเรือจระเข้ใหญ่สุดในประเทศ — เรือ 200+ ลำ เทคอัจฉริยะเป็นศูนย์",
      zh: "碧差汶的四彩湖是泰国最大的淡水沼泽之一，举办全国最大的鳄鱼赛船节——200多条船，零智能科技参与。",
    },
    compareNote: {
      en: "GPP B78K, digital score 30 — the index's poorest and least connected city. But the digital literacy pilot is honest: start with people, not dashboards.",
      th: "GPP B78K คะแนนดิจิทัล 30 — เมืองจนสุดและเชื่อมต่อน้อยสุดในดัชนี แต่นำร่องรู้เท่าทันดิจิทัลจริงใจ: เริ่มจากคน ไม่ใช่แดชบอร์ด",
      zh: "GPP B78K，数字评分30——指数中最穷且连接最少的城市。但数字素养试点很诚实：从人开始，不是从仪表盘开始。",
    },
  },
  "phitsanulok-muni": {
    industries: CITY_INDUSTRY_TAGS["phitsanulok-muni"],
    dailyLife: {
      en: "Civil servants, university students, and hospital visitors keep the streets busy. The night market along the Nan River is where Phitsanulok actually socializes — everything else closes by 9 PM.",
      th: "ข้าราชการ นักศึกษา และผู้ป่วยมาโรงพยาบาลทำให้ถนนคึกคัก ตลาดกลางคืนริมแม่น้ำน่านคือที่ที่พิษณุโลกเข้าสังคมจริงๆ — ที่เหลือปิดก่อน 3 ทุ่ม",
      zh: "公务员、大学生和医院访客让街道繁忙。南河沿岸的夜市才是彭世洛真正社交的地方——其他一切晚上九点前就关门了。",
    },
    signatureStory: {
      en: "Phitsanulok proves that unflashy execution wins: 80%+ of citizens actually use the smart governance platform. No LRT, no innovation district — just digital services that work and people who use them.",
      th: "พิษณุโลกพิสูจน์ว่าการทำงานไม่หวือหวาชนะ: ประชาชน 80%+ ใช้แพลตฟอร์มปกครองอัจฉริยะจริง ไม่มี LRT ไม่มีย่านนวัตกรรม — แค่บริการดิจิทัลที่ใช้ได้และคนที่ใช้จริง",
      zh: "彭世洛证明了低调执行能赢：80%以上市民实际使用智慧治理平台。没有轻轨，没有创新区——只有真正好用的数字服务和使用它们的人。",
    },
    funFact: {
      en: "King Naresuan the Great, who freed Siam from Burmese rule, was born here. The city still trades on that 400-year-old brand harder than most startups trade on their Series A.",
      th: "พระนเรศวรมหาราชผู้ปลดปล่อยสยามจากพม่าประสูติที่นี่ เมืองยังค้าแบรนด์ 400 ปีนี้หนักกว่าสตาร์ทอัพส่วนใหญ่ค้า Series A ของตัวเอง",
      zh: "把暹罗从缅甸统治下解放出来的纳黎萱大帝就出生在这里。这座城市至今还在靠这个400年品牌吃饭，比大多数创业公司炒作A轮还猛。",
    },
    compareNote: {
      en: "The quiet workhorse: digital score 55 and economy 60 are not headlines, but 80% adoption of government e-services is better than most Alpha cities manage.",
      th: "ม้าทำงานเงียบ: คะแนนดิจิทัล 55 และเศรษฐกิจ 60 ไม่ใช่พาดหัว แต่ 80% ใช้ e-service ราชการดีกว่าเมือง Alpha ส่วนใหญ่",
      zh: "安静的工作马：数字评分55和经济60不上头条，但80%的政务电子服务采用率比大多数Alpha城市都高。",
    },
  },
  "phitsanulok-nu": {
    industries: CITY_INDUSTRY_TAGS["phitsanulok-nu"],
    dailyLife: {
      en: "Students bike between labs, the teaching hospital runs 24/7, and EV charging stations dot a campus that feels more like a self-contained town than a university wing.",
      th: "นักศึกษาปั่นจักรยานระหว่างแล็บ โรงพยาบาลสอนเปิด 24 ชม. และสถานีชาร์จ EV กระจายทั่วแคมปัสที่ดูเหมือนเมืองในตัวเองมากกว่าปีกมหาวิทยาลัย",
      zh: "学生骑自行车穿梭于实验室之间，教学医院24小时运转，电动车充电站散布在一个更像自给自足小镇而非大学一角的校园里。",
    },
    signatureStory: {
      en: "Naresuan University's smart campus is a genuine R&D engine — energy monitoring, EV infrastructure, and mobility research all tested on a captive population of 35K students and staff who have no choice but to be guinea pigs.",
      th: "สมาร์ทแคมปัสของ ม.นเรศวร เป็นเครื่องยนต์ R&D จริง — เฝ้าระวังพลังงาน โครงสร้าง EV และวิจัยการเดินทาง ทดสอบกับประชากร 35K คนที่ไม่มีทางเลือกนอกจากเป็นหนูทดลอง",
      zh: "纳黎萱大学智慧校园是真正的研发引擎——能源监测、电动车基础设施和出行研究全部在3.5万名别无选择只能当小白鼠的师生身上测试。",
    },
    funFact: {
      en: "NU's campus covers 1,600 rai (256 hectares) — larger than many of the sub-district smart cities in this index. It is a city pretending to be a university.",
      th: "แคมปัส มนร. กว้าง 1,600 ไร่ — ใหญ่กว่าเมืองอัจฉริยะระดับตำบลหลายแห่งในดัชนีนี้ มันคือเมืองที่แกล้งทำเป็นมหาวิทยาลัย",
      zh: "纳大校园面积1600莱（256公顷）——比本指数中许多乡镇级智慧城市都大。这是一座伪装成大学的城市。",
    },
    compareNote: {
      en: "CMU's smaller northern cousin: less media attention, same living-lab logic. Safety 76 is among the best in the index — campus security works.",
      th: "ญาติเล็กของ CMU ทางเหนือ: สื่อน้อยกว่า logic เหมือนกัน ความปลอดภัย 76 อยู่ในกลุ่มดีสุดของดัชนี — ระบบรักษาความปลอดภัยแคมปัสใช้ได้",
      zh: "CMU更小的北方表亲：媒体关注更少，活实验室逻辑一样。安全评分76是指数中最高之一——校园安保管用。",
    },
  },
  "phitsanulok-ppao": {
    industries: CITY_INDUSTRY_TAGS["phitsanulok-ppao"],
    dailyLife: {
      en: "The PAO covers the entire province — rice farmers, factory workers, and rubber tappers scattered across 10,800 sq km. Most residents interact with 'smart city' through a LINE chatbot, not a sensor.",
      th: "อบจ. ครอบคลุมทั้งจังหวัด — ชาวนา คนงานโรงงาน และกรีดยาง กระจายทั่ว 10,800 ตร.กม. ผู้อยู่อาศัยส่วนใหญ่ใช้ 'เมืองอัจฉริยะ' ผ่าน LINE chatbot ไม่ใช่เซ็นเซอร์",
      zh: "省行政组织覆盖全省——稻农、工厂工人和割胶工散布在10800平方公里。大多数居民通过LINE聊天机器人而非传感器与'智慧城市'互动。",
    },
    signatureStory: {
      en: "This is Thailand's experiment in province-wide digital governance — not a smart district, but an entire PAO trying to connect rural sub-districts to a single digital backbone. The ambition is bigger than most certified cities.",
      th: "นี่คือการทดลองปกครองดิจิทัลระดับจังหวัดของไทย — ไม่ใช่ย่านอัจฉริยะ แต่ อบจ. ทั้งจังหวัดพยายามเชื่อมต่อตำบลชนบทเข้ากับแกนหลักดิจิทัลเดียว ความทะเยอทะยานใหญ่กว่าเมืองรับรองส่วนใหญ่",
      zh: "这是泰国省级数字治理实验——不是智慧片区，而是整个省行政组织试图把农村乡镇连接到单一数字骨架。野心比大多数认证城市都大。",
    },
    funFact: {
      en: "The PAO runs a rural telemedicine network connecting village health stations to Phitsanulok's hospitals — in a province where some sub-districts are 2+ hours from the nearest doctor.",
      th: "อบจ. ดำเนินเครือข่ายแพทย์ทางไกลชนบทเชื่อมสถานีอนามัยหมู่บ้านกับโรงพยาบาลในพิษณุโลก — ในจังหวัดที่บางตำบลอยู่ห่างหมอ 2+ ชม.",
      zh: "省行政组织运营着一个农村远程医疗网络，连接村级卫生站和彭世洛的医院——在这个省份里，有些乡镇离最近的医生要两小时以上。",
    },
    compareNote: {
      en: "Province-scale governance innovation: 340K people, 5 smart dimensions. Less visible than city-level projects, but the rural reach is unique in the index.",
      th: "นวัตกรรมปกครองระดับจังหวัด: ประชากร 340K ครอบคลุม 5 มิติ เห็นน้อยกว่าโครงการระดับเมือง แต่การเข้าถึงชนบทไม่เหมือนใครในดัชนี",
      zh: "省级治理创新：34万人，5个智慧维度。不如市级项目显眼，但农村覆盖在指数中独一无二。",
    },
  },
  umong: {
    industries: CITY_INDUSTRY_TAGS.umong,
    dailyLife: {
      en: "A 22K-person municipality in Lamphun's longan belt, 20 minutes from Chiang Mai. Mornings smell of longan drying in the sun; afternoons, Hana Microelectronics workers clock out from the nearby industrial estate.",
      th: "เทศบาล 22K คนในแถบลำไยลำพูน ห่างเชียงใหม่ 20 นาที เช้าได้กลิ่นลำไยอบแห้ง บ่ายพนักงานฮานาไมโครอิเล็กทรอนิกส์เลิกงานจากนิคมใกล้ๆ",
      zh: "一个2.2万人的市镇，位于南奔龙眼带，距清迈20分钟。清晨闻到日晒龙眼干的味道；下午，附近工业园区的Hana微电子公司工人下班。",
    },
    signatureStory: {
      en: "Umong is the tiniest municipality in the index to cover all 7 smart dimensions. Community-driven, not corporate-driven — the mayor and village heads actually run the digital platform themselves.",
      th: "อุโมงค์เป็นเทศบาลเล็กสุดในดัชนีที่ครอบคลุมทั้ง 7 มิติ ขับเคลื่อนโดยชุมชน ไม่ใช่บริษัท — นายกเทศมนตรีและผู้ใหญ่บ้านดูแลแพลตฟอร์มดิจิทัลเอง",
      zh: "乌蒙是指数中覆盖全部7个智慧维度的最小市镇。社区驱动而非企业驱动——市长和村长自己管理数字平台。",
    },
    funFact: {
      en: "Lamphun's Hana Microelectronics campus next door is one of the world's largest PCB manufacturers — making Umong a village of longan farmers living beside a global electronics supply chain.",
      th: "แคมปัสฮานาไมโครอิเล็กทรอนิกส์ของลำพูนข้างๆ เป็นผู้ผลิต PCB ใหญ่สุดแห่งหนึ่งของโลก — ทำให้อุโมงค์เป็นหมู่บ้านชาวสวนลำไยที่อยู่ข้างซัพพลายเชนอิเล็กทรอนิกส์โลก",
      zh: "旁边南奔的Hana微电子园区是全球最大的PCB制造商之一——让乌蒙成为一个龙眼果农住在全球电子供应链旁的村庄。",
    },
    compareNote: {
      en: "Tiny but complete: 22K people, 7 dimensions, all community-run. PM2.5 36.8 is the price of living in the Chiang Mai haze basin.",
      th: "เล็กแต่ครบ: ประชากร 22K 7 มิติ ชุมชนดูแลทั้งหมด PM2.5 36.8 คือค่าจ้างของการอยู่ในแอ่งหมอกเชียงใหม่",
      zh: "小而完整：2.2万人，7个维度，全部社区运营。PM2.5 36.8是住在清迈雾霾盆地的代价。",
    },
  },

  // ─── CENTRAL (ADDITIONAL) ───
  nakhonsawan: {
    industries: CITY_INDUSTRY_TAGS.nakhonsawan,
    dailyLife: {
      en: "Two rivers merge here and so does northern Thailand's produce — rice barges, wholesale markets, and monsoon flood anxiety define the rhythm. The Chinese-Thai community runs much of the commerce.",
      th: "แม่น้ำสองสายบรรจบที่นี่ และผลผลิตของภาคเหนือก็เช่นกัน — เรือขนข้าว ตลาดค้าส่ง และความกังวลน้ำท่วมมรสุมกำหนดจังหวะ ชุมชนจีน-ไทยดูแลการค้าส่วนใหญ่",
      zh: "两条河在此交汇，泰北的农产品也是——运粮船、批发市场和季风洪水焦虑定义了节奏。华泰社区掌控着大部分商业。",
    },
    signatureStory: {
      en: "Nakhon Sawan's 30+ IoT river sensors are the real story — they feed a flood prediction system that actually warns 268K residents before the water arrives. Smart flood management here is not a demo, it is survival.",
      th: "เซ็นเซอร์แม่น้ำ IoT 30+ ตัวของนครสวรรค์คือเรื่องจริง — ป้อนระบบพยากรณ์น้ำท่วมที่เตือนผู้อยู่อาศัย 268K จริงก่อนน้ำมา จัดการน้ำท่วมอัจฉริยะที่นี่ไม่ใช่สาธิต คือความอยู่รอด",
      zh: "那空沙旺的30多个物联网河流传感器才是真正的故事——它们为洪水预测系统提供数据，真正在水到之前警告26.8万居民。这里的智慧洪水管理不是演示，是生存。",
    },
    funFact: {
      en: "The Ping and Nan rivers merge at Nakhon Sawan to form the Chao Phraya — meaning every flood that threatens Bangkok starts with a reading on these sensors.",
      th: "แม่น้ำปิงและน่านบรรจบที่นครสวรรค์เป็นเจ้าพระยา — หมายความว่าน้ำท่วมทุกครั้งที่คุกคามกรุงเทพฯ เริ่มต้นจากค่าที่อ่านจากเซ็นเซอร์เหล่านี้",
      zh: "平河和难河在那空沙旺汇合形成湄南河——意味着每一次威胁曼谷的洪水都始于这些传感器上的读数。",
    },
    compareNote: {
      en: "Gateway to the North with real flood tech. Digital adoption (48) is still early, but the IoT sensors are the most consequential in the country — they protect Bangkok downstream.",
      th: "ประตูสู่ภาคเหนือที่มีเทคน้ำท่วมจริง การใช้ดิจิทัล (48) ยังเริ่มต้น แต่เซ็นเซอร์ IoT มีผลกระทบมากสุดในประเทศ — ปกป้องกรุงเทพฯ ปลายน้ำ",
      zh: "北方门户配备了真正的洪水技术。数字采用率(48)仍处早期，但物联网传感器是全国最具影响力的——它们保护着下游的曼谷。",
    },
  },

  // ─── EAST (ADDITIONAL) ───
  "bang-saray": {
    industries: CITY_INDUSTRY_TAGS["bang-saray"],
    dailyLife: {
      en: "Fishermen haul nets before dawn while Pattaya's party lights still glow on the horizon. By day it is a quiet seafood village; on weekends, Bangkok families descend for affordable beach time.",
      th: "ชาวประมงลากอวนก่อนรุ่งสางขณะไฟปาร์ตี้พัทยายังเรืองบนขอบฟ้า กลางวันเป็นหมู่บ้านอาหารทะเลเงียบ วันหยุดครอบครัวกรุงเทพฯ แห่มาเล่นทะเลราคาถูก",
      zh: "渔民天没亮就在拉网，而芭提雅的派对灯光还在地平线上闪烁。白天这是安静的海鲜村庄；周末，曼谷家庭涌来享受实惠的海滩时光。",
    },
    signatureStory: {
      en: "Bang Saray is one of the few Thai smart cities where the tech actually serves fishermen — smart fleet management and coastal monitoring, not tourism apps. The question is whether EEC development will swallow the village before the tech matures.",
      th: "บางเสร่เป็นหนึ่งในไม่กี่เมืองอัจฉริยะไทยที่เทคโนโลยีรับใช้ชาวประมงจริง — จัดการกองเรือและเฝ้าระวังชายฝั่งอัจฉริยะ ไม่ใช่แอปท่องเที่ยว คำถามคือ EEC จะกลืนหมู่บ้านก่อนเทคโตทันไหม",
      zh: "邦萨雷是少数几个技术真正为渔民服务的泰国智慧城市之一——智能船队管理和海岸监测，而不是旅游应用。问题是EEC开发会不会在技术成熟之前吞掉这个村庄。",
    },
    funFact: {
      en: "Bang Saray's annual longtail boat race is the village's biggest event — 35K residents organize it entirely through community LINE groups, which is arguably more 'smart governance' than any official platform.",
      th: "แข่งเรือหางยาวประจำปีบางเสร่เป็นงานใหญ่สุดของหมู่บ้าน — ผู้อยู่อาศัย 35K จัดผ่าน LINE กลุ่มชุมชนทั้งหมด ซึ่งอาจเป็น 'ปกครองอัจฉริยะ' มากกว่าแพลตฟอร์มทางการใดๆ",
      zh: "邦萨雷每年的长尾船赛是村里最大的活动——3.5万居民完全通过社区LINE群组织，这大概比任何官方平台都更'智慧治理'。",
    },
    compareNote: {
      en: "Fishing village smart city in EEC's shadow. Digital score 38 is rock-bottom, but the fishermen-first approach is the most honest use case in the eastern corridor.",
      th: "เมืองอัจฉริยะหมู่บ้านประมงในเงา EEC คะแนนดิจิทัล 38 ต่ำสุด แต่แนวทางชาวประมงก่อนคือ use case จริงใจสุดในระเบียงตะวันออก",
      zh: "EEC阴影下的渔村智慧城市。数字评分38垫底，但渔民优先的方法是东部走廊最诚实的应用案例。",
    },
  },
  chanthaburi: {
    industries: CITY_INDUSTRY_TAGS.chanthaburi,
    dailyLife: {
      en: "Gem dealers squint at stones under fluorescent lights on Si Chan Road, durian trucks rumble through town from April to June, and the French colonial waterfront gets its weekend walkers. Three economies, one small city.",
      th: "พ่อค้าพลอยจ้องพลอยใต้แสงฟลูออเรสเซนต์บนถนนศรีจันทร์ รถทุเรียนครืนผ่านเมืองเมษา-มิถุนา และริมน้ำแบบอาณานิคมฝรั่งเศสมีคนเดินวันหยุด สามเศรษฐกิจในเมืองเล็กเดียว",
      zh: "宝石商贩在丝盏路的荧光灯下眯眼看石头，榴莲卡车四月到六月隆隆驶过城镇，法国殖民风格的滨水区周末有人散步。三种经济，一座小城。",
    },
    signatureStory: {
      en: "Chanthaburi's smart agriculture for durian farmers is the rare Thai agri-tech that shows real yield improvements — precision irrigation and IoT monitoring on a crop where one premium fruit sells for 200+ baht.",
      th: "เกษตรอัจฉริยะของจันทบุรีสำหรับเกษตรกรทุเรียนเป็นเทคเกษตรไทยหายากที่แสดงผลผลิตเพิ่มจริง — ชลประทานแม่นยำและ IoT บนพืชที่ผลเดียวขาย 200+ บาท",
      zh: "尖竹汶为榴莲农户打造的智慧农业是少有的展示真实产量提升的泰国农业科技——在单颗水果售价200泰铢以上的作物上进行精准灌溉和物联网监测。",
    },
    funFact: {
      en: "Si Chan Road's gem market has been trading rubies and sapphires for centuries — dealers from Myanmar, Cambodia, and Sri Lanka still fly in weekly. Digitizing this trade is like asking a bazaar to become an exchange.",
      th: "ตลาดพลอยถนนศรีจันทร์ค้าทับทิมแซปไฟร์มาหลายศตวรรษ — พ่อค้าจากเมียนมา กัมพูชา ศรีลังกายังบินมาทุกสัปดาห์ ดิจิไทซ์การค้านี้เหมือนขอให้บาซาร์กลายเป็นตลาดหลักทรัพย์",
      zh: "丝盏路的宝石市场已经交易红宝石和蓝宝石几个世纪了——缅甸、柬埔寨、斯里兰卡的商人至今每周飞来。数字化这种贸易就像要一个集市变成交易所。",
    },
    compareNote: {
      en: "Green coverage 52%, environment 68 — one of the greenest and most ecologically sound cities in the index. Digital score 42 is the gap: gem traders and farmers are not early adopters.",
      th: "พื้นที่สีเขียว 52% สิ่งแวดล้อม 68 — เมืองเขียวสุดและดีต่อนิเวศสุดแห่งหนึ่งในดัชนี คะแนนดิจิทัล 42 คือช่องว่าง: พ่อค้าพลอยและเกษตรกรไม่ใช่ early adopter",
      zh: "绿化覆盖52%，环境68——指数中最绿色、生态最好的城市之一。数字评分42是差距：宝石商和农民不是早期采用者。",
    },
  },
  "khao-khun-song": {
    industries: CITY_INDUSTRY_TAGS["khao-khun-song"],
    dailyLife: {
      en: "A sub-district of rubber trees and fruit orchards in Rayong's hinterland, where farmers check IoT soil moisture readings on their phones between rounds of harvesting. The EEC industrial parks are a short drive away but feel like a different planet.",
      th: "ตำบลของสวนยางและสวนผลไม้ในพื้นที่ห่างไกลของระยอง ที่เกษตรกรเช็คค่าความชื้นดิน IoT บนโทรศัพท์ระหว่างรอบเก็บเกี่ยว นิคม EEC อยู่ใกล้แต่รู้สึกเหมือนดาวคนละดวง",
      zh: "一个位于罗勇腹地的橡胶树和果园乡镇，农民在收割间隙用手机查看物联网土壤湿度读数。EEC工业园区开车不远但感觉像另一个星球。",
    },
    signatureStory: {
      en: "Khao Khun Song is Thailand's testbed for sub-district precision farming — IoT soil sensors and drone mapping deployed on real fields, not research plots. At 25K people, every household can potentially be connected.",
      th: "เขาคุนซองเป็นแปลงทดสอบเกษตรแม่นยำระดับตำบลของไทย — เซ็นเซอร์ดิน IoT และโดรนแมพบนแปลงจริง ไม่ใช่แปลงวิจัย ประชากร 25K ทุกครัวเรือนเชื่อมต่อได้",
      zh: "考坤松是泰国乡镇精准农业试验场——物联网土壤传感器和无人机测绘部署在真实田地上，不是研究地块。2.5万人口，每户都有可能接入。",
    },
    funFact: {
      en: "Rayong's GPP per capita is B1.02M — the highest in the index — but that wealth comes from petrochemical plants, not fruit farms. Khao Khun Song's farmers live beside a B1-trillion GDP province and earn a fraction of it.",
      th: "GPP ต่อหัวของระยอง B1.02M — สูงสุดในดัชนี — แต่ความมั่งคั่งมาจากปิโตรเคมี ไม่ใช่สวนผลไม้ เกษตรกรเขาคุนซองอยู่ข้างจังหวัด GDP 1 ล้านล้านและได้เศษเสี้ยว",
      zh: "罗勇的人均GPP为102万泰铢——指数最高——但这些财富来自石化工厂，不是水果农场。考坤松的农民住在一个GDP万亿的省份旁边，却只赚到一小部分。",
    },
    compareNote: {
      en: "Smallest smart farming zone in the eastern corridor: 25K people, partial deployment, data confidence low. But the field-level IoT is real, not a conference demo.",
      th: "เขตเกษตรอัจฉริยะเล็กสุดในระเบียงตะวันออก: ประชากร 25K นำไปใช้บางส่วน ความเชื่อมั่นข้อมูลต่ำ แต่ IoT ระดับแปลงเป็นจริง ไม่ใช่สาธิตในงานประชุม",
      zh: "东部走廊最小的智慧农业区：2.5万人，部分部署，数据置信度低。但田间物联网是真的，不是会议演示。",
    },
  },
  "nikhom-phatthana": {
    industries: CITY_INDUSTRY_TAGS["nikhom-phatthana"],
    dailyLife: {
      en: "The air smells faintly of chemicals, tanker trucks roll through at all hours, and environmental monitoring is not a nice-to-have — it is the reason this place has a smart city program at all.",
      th: "อากาศมีกลิ่นเคมีจางๆ รถขนสารเคมีวิ่งผ่านตลอด และการเฝ้าระวังสิ่งแวดล้อมไม่ใช่สิ่งที่มีก็ดี — มันเป็นเหตุผลที่ทำไมที่นี่มีโปรแกรมเมืองอัจฉริยะ",
      zh: "空气隐约有化学品味道，罐装车全天候通过，环境监测不是锦上添花——它是这个地方有智慧城市计划的全部原因。",
    },
    signatureStory: {
      en: "Near Map Ta Phut, one of Asia's largest petrochemical complexes, Nikhom Phatthana's smart city story is environmental survival: chemical spill detection, air quality alerts, and industrial safety IoT. The tech is defensive, not aspirational.",
      th: "ใกล้มาบตาพุด คอมเพล็กซ์ปิโตรเคมีใหญ่สุดแห่งหนึ่งของเอเชีย เรื่องเมืองอัจฉริยะของนิคมพัฒนาคือความอยู่รอดด้านสิ่งแวดล้อม: ตรวจจับสารเคมีรั่ว แจ้งเตือนคุณภาพอากาศ และ IoT ความปลอดภัยอุตสาหกรรม เทคนี้ป้องกัน ไม่ใช่หวังสูง",
      zh: "靠近亚洲最大石化综合体之一的马塔普特，尼空帕塔纳的智慧城市故事是环境生存：化学品泄漏检测、空气质量警报和工业安全物联网。技术是防御性的，不是愿景性的。",
    },
    funFact: {
      en: "Map Ta Phut's industrial zone was once the subject of Thailand's first major environmental lawsuit — residents sued for health damages. The air monitoring network now exists partly because courts demanded it.",
      th: "นิคมมาบตาพุดเคยเป็นประเด็นคดีสิ่งแวดล้อมใหญ่แรกของไทย — ชาวบ้านฟ้องเรียกค่าเสียหายสุขภาพ เครือข่ายเฝ้าระวังอากาศตอนนี้มีส่วนเพราะศาลสั่ง",
      zh: "马塔普特工业区曾是泰国第一起重大环境诉讼的对象——居民起诉要求健康赔偿。空气监测网络如今存在的部分原因是法院要求的。",
    },
    compareNote: {
      en: "GPP B1.02M (highest in the index) masks a livability score of 50. The wealth is in the pipes; the people breathe the externalities.",
      th: "GPP B1.02M (สูงสุดในดัชนี) ซ่อนคะแนนน่าอยู่ 50 ความมั่งคั่งอยู่ในท่อ ประชาชนหายใจผลกระทบภายนอก",
      zh: "GPP 102万（指数最高）掩盖了50分的宜居评分。财富在管道里；人们呼吸的是外部性。",
    },
  },
  phlapphla: {
    industries: CITY_INDUSTRY_TAGS.phlapphla,
    dailyLife: {
      en: "Durian and mangosteen orchards surround a sub-district of 15K people in Chanthaburi's green interior. The fruit harvest dictates everything — school schedules, road traffic, even when the community solar panels get maintained.",
      th: "สวนทุเรียนและมังคุดล้อมรอบตำบล 15K คนในพื้นที่สีเขียวของจันทบุรี ฤดูเก็บผลไม้กำหนดทุกอย่าง — ตารางโรงเรียน การจราจร แม้แต่เวลาซ่อมแผงโซลาร์ชุมชน",
      zh: "榴莲和山竹果园环绕着尖竹汶绿色腹地的一个1.5万人乡镇。水果收获决定一切——学校时间表、道路交通，甚至社区太阳能板什么时候维修。",
    },
    signatureStory: {
      en: "Phlapphla is experimenting with community solar energy and environmental monitoring for fruit orchards — the smallest, most grassroots smart city in the eastern region. The pilot is genuine; the scale is a garden.",
      th: "พลับพลาทดลองพลังงานโซลาร์ชุมชนและเฝ้าระวังสิ่งแวดล้อมสำหรับสวนผลไม้ — เมืองอัจฉริยะเล็กสุดและรากหญ้าสุดในภาคตะวันออก นำร่องจริง ขนาดคือสวน",
      zh: "帕拉帕正在试验社区太阳能和果园环境监测——东部地区最小、最草根的智慧城市。试点是真的；规模是一个花园。",
    },
    funFact: {
      en: "Chanthaburi's durian auction season is so intense that fruit thieves are a genuine security concern — some orchards use IoT motion sensors originally intended for smart farming as anti-theft devices.",
      th: "ฤดูประมูลทุเรียนจันทบุรีเข้มข้นจนขโมยผลไม้เป็นปัญหาความปลอดภัยจริง — สวนบางแห่งใช้เซ็นเซอร์ตรวจจับการเคลื่อนไหว IoT ที่เดิมทีมีไว้สำหรับเกษตรอัจฉริยะเป็นอุปกรณ์กันขโมย",
      zh: "尖竹汶的榴莲拍卖季竞争如此激烈，水果小偷是真正的安全问题——一些果园使用原本用于智慧农业的物联网运动传感器作为防盗设备。",
    },
    compareNote: {
      en: "Population 15K, partial deployment, digital 35. The index's tiniest eastern city — but the community energy pilot is real and the green coverage 52% is exceptional.",
      th: "ประชากร 15K นำไปใช้บางส่วน ดิจิทัล 35 เมืองตะวันออกเล็กสุดในดัชนี — แต่นำร่องพลังงานชุมชนจริงและพื้นที่สีเขียว 52% ยอดเยี่ยม",
      zh: "人口1.5万，部分部署，数字35。指数中最小的东部城市——但社区能源试点是真的，52%的绿化覆盖率很出色。",
    },
  },
  "thep-paraj": {
    industries: CITY_INDUSTRY_TAGS["thep-paraj"],
    dailyLife: {
      en: "A 22K-person sub-district in Chachoengsao where rice paddies and light factories coexist. The EEC branding hangs over everything, but daily life is still a motorcycle ride to the market and back.",
      th: "ตำบล 22K คนในฉะเชิงเทราที่นาข้าวและโรงงานเล็กอยู่ร่วมกัน แบรนด์ EEC แขวนอยู่เหนือทุกอย่าง แต่ชีวิตประจำวันยังเป็นขี่มอเตอร์ไซค์ไปตลาดแล้วกลับ",
      zh: "一个2.2万人的乡镇，位于差春骚，稻田和小工厂共存。EEC品牌笼罩一切，但日常生活仍然是骑摩托车去市场再回来。",
    },
    signatureStory: {
      en: "Thep Paraj is the EEC's rural edge — a sub-district trying smart agriculture with IoT on a landscape that is still fundamentally manual. The gap between EEC marketing and ground reality is visible here.",
      th: "เทพราชคือชายขอบชนบทของ EEC — ตำบลที่พยายามเกษตรอัจฉริยะด้วย IoT บนพื้นที่ที่ยังเป็นมือเป็นหลัก ช่องว่างระหว่างการตลาด EEC กับความจริงภาคพื้นเห็นได้ที่นี่",
      zh: "特帕拉是EEC的农村边缘——一个在本质上仍是手工操作的土地上尝试物联网智慧农业的乡镇。EEC营销与地面现实之间的差距在这里一目了然。",
    },
    funFact: {
      en: "Chachoengsao province has a GPP of B422K per capita — top 10 nationally — but that is auto plants and industrial estates, not Thep Paraj's rice paddies. The wealth drives past on the motorway.",
      th: "ฉะเชิงเทรามี GPP B422K ต่อหัว — ติด 10 อันดับแรกของประเทศ — แต่นั่นคือโรงงานรถยนต์และนิคม ไม่ใช่นาข้าวเทพราช ความมั่งคั่งขับผ่านบนทางด่วน",
      zh: "差春骚省人均GPP 42.2万泰铢——全国前十——但那是汽车工厂和工业园区，不是特帕拉的稻田。财富在高速公路上呼啸而过。",
    },
    compareNote: {
      en: "EEC's smallest sub-district: 22K people, livability 52, digital 38. The smart farming IoT is deployed but the broader digital ecosystem is thin.",
      th: "ตำบลเล็กสุดของ EEC: ประชากร 22K น่าอยู่ 52 ดิจิทัล 38 IoT เกษตรอัจฉริยะนำไปใช้แล้วแต่ระบบนิเวศดิจิทัลกว้างยังบาง",
      zh: "EEC最小的乡镇：2.2万人，宜居52，数字38。智慧农业物联网已部署但更广泛的数字生态系统很薄。",
    },
  },

  // ─── SOUTH (ADDITIONAL) ───
  phangnga: {
    industries: CITY_INDUSTRY_TAGS.phangnga,
    dailyLife: {
      en: "Limestone karsts jut from emerald water, longtail boats ferry tourists to James Bond Island, and the 2004 tsunami memorial is a permanent fixture in the town center. Rubber tapping and fishing fill the hours tourism does not.",
      th: "หินปูนโผล่จากน้ำมรกต เรือหางยาวพานักท่องเที่ยวไปเกาะเจมส์บอนด์ และอนุสรณ์สึนามิ 2547 ตั้งถาวรกลางเมือง กรีดยางและประมงเติมเวลาที่ท่องเที่ยวไม่ได้ครอบครอง",
      zh: "石灰岩喀斯特从翡翠色海水中矗立，长尾船载游客去詹姆斯邦德岛，2004年海啸纪念碑是城镇中心的永久设施。橡胶割取和捕鱼填满旅游之外的时间。",
    },
    signatureStory: {
      en: "Phang Nga's smart city identity was forged by catastrophe — the 2004 tsunami killed 4,000+ in the province. The early warning system and mangrove monitoring sensors are not aspirational tech; they are grief turned into infrastructure.",
      th: "อัตลักษณ์เมืองอัจฉริยะพังงาถูกหล่อหลอมจากหายนะ — สึนามิ 2547 คร่าชีวิต 4,000+ คนในจังหวัด ระบบเตือนภัยล่วงหน้าและเซ็นเซอร์เฝ้าระวังป่าชายเลนไม่ใช่เทคที่ฝันไว้ แต่เป็นความเศร้าที่กลายเป็นโครงสร้างพื้นฐาน",
      zh: "攀牙的智慧城市身份是由灾难锻造的——2004年海啸在该省夺走了4000多条生命。预警系统和红树林监测传感器不是愿景性技术；它们是悲伤化为基础设施。",
    },
    funFact: {
      en: "PM2.5 at 12.8 is the cleanest air of any coastal city in the index. The Andaman wind does what billion-baht air purifiers cannot.",
      th: "PM2.5 ที่ 12.8 คืออากาศสะอาดสุดของเมืองชายฝั่งใดๆ ในดัชนี ลมอันดามันทำสิ่งที่เครื่องฟอกอากาศพันล้านบาททำไม่ได้",
      zh: "PM2.5为12.8是指数中所有沿海城市最清洁的空气。安达曼的风做了数十亿泰铢空气净化器做不到的事。",
    },
    compareNote: {
      en: "Post-tsunami resilience tech is the real differentiator. Environment 76, green coverage 68%, but hospital beds 16/10K — the coast is beautiful, the healthcare is thin.",
      th: "เทคยืดหยุ่นหลังสึนามิคือตัวสร้างความแตกต่างจริง สิ่งแวดล้อม 76 พื้นที่สีเขียว 68% แต่เตียงโรงพยาบาล 16/10K — ชายฝั่งสวย สาธารณสุขบาง",
      zh: "海啸后韧性技术是真正的差异化因素。环境76，绿化覆盖68%，但医院床位16/万人——海岸很美，医疗很薄。",
    },
  },
  "phuket-tinicon": {
    industries: CITY_INDUSTRY_TAGS["phuket-tinicon"],
    dailyLife: {
      en: "There is no daily life. Population: zero. Tinicon Valley is a master plan, a logo, and a presentation deck. The land exists on Phuket's interior hills; the city does not.",
      th: "ไม่มีชีวิตประจำวัน ประชากร: ศูนย์ Tinicon Valley คือผังแม่บท โลโก้ และชุดนำเสนอ ที่ดินอยู่บนเนินเขาภายในภูเก็ต เมืองไม่มี",
      zh: "没有日常生活。人口：零。Tinicon Valley是一份总体规划、一个标志和一套演示文稿。土地在普吉内陆山丘上；城市不存在。",
    },
    signatureStory: {
      en: "Phuket Tinicon is the newest certified smart city in Thailand — and the most honest example of the gap between certification and reality. The logo was awarded to a concept. Livability 25, economy 30, hospitality 20. These are plan scores, not life scores.",
      th: "ภูเก็ตทินิคอนเป็นเมืองอัจฉริยะรับรองใหม่สุดของไทย — และตัวอย่างจริงใจสุดของช่องว่างระหว่างการรับรองกับความจริง โลโก้มอบให้กับแนวคิด น่าอยู่ 25 เศรษฐกิจ 30 การท่องเที่ยว 20 เป็นคะแนนแผน ไม่ใช่คะแนนชีวิต",
      zh: "普吉Tinicon是泰国最新认证的智慧城市——也是认证与现实之间差距最诚实的例子。标志授予了一个概念。宜居25，经济30，酒店20。这些是计划分数，不是生活分数。",
    },
    funFact: {
      en: "The name 'Tinicon' nods to Phuket's tin mining heritage and 'Silicon Valley.' Whether the island can attract tech talent when its cost of living rivals Bangkok's remains an open question.",
      th: "ชื่อ 'Tinicon' พยักหน้าให้มรดกเหมืองดีบุกของภูเก็ตและ 'Silicon Valley' เกาะจะดึงดูดคนเก่งเทคได้ไหมเมื่อค่าครองชีพสู้กรุงเทพฯ ยังเป็นคำถามเปิด",
      zh: "'Tinicon'这个名字致敬了普吉的锡矿遗产和'硅谷'。当生活成本与曼谷相当时，这座岛能否吸引科技人才仍是一个悬而未决的问题。",
    },
    compareNote: {
      en: "Batch 4 (2025) — the index's lowest-scoring certified city across nearly every dimension. The concept is sound; execution is zero. Watch this space, or watch it evaporate.",
      th: "รุ่น 4 (2568) — เมืองรับรองคะแนนต่ำสุดในดัชนีเกือบทุกมิติ แนวคิดดี การปฏิบัติเป็นศูนย์ จับตาพื้นที่นี้ หรือดูมันระเหย",
      zh: "第4批（2025）——指数中几乎每个维度评分最低的认证城市。概念是好的；执行为零。关注这片空间，或者看它蒸发。",
    },
  },
  samui: {
    industries: CITY_INDUSTRY_TAGS.samui,
    dailyLife: {
      en: "Resort shuttle buses, yoga retreats, full moon party hangovers, and coconut plantation workers share a 228 sq km island with 68K residents and millions of annual visitors. Water runs short in dry season; patience runs short year-round.",
      th: "รถรับส่งรีสอร์ท โยคะรีทรีต อาการเมาค้างฟูลมูนปาร์ตี้ และคนงานสวนมะพร้าว อยู่ร่วมเกาะ 228 ตร.กม. กับผู้อยู่อาศัย 68K และนักท่องเที่ยวหลายล้านต่อปี น้ำขาดหน้าแล้ง ความอดทนขาดตลอดปี",
      zh: "度假村班车、瑜伽静修、满月派对宿醉和椰子种植园工人共享一个228平方公里的岛屿，与6.8万居民和数百万年度游客在一起。旱季缺水；全年缺耐心。",
    },
    signatureStory: {
      en: "Samui's smart waste and water management is not a lifestyle upgrade — it is an island survival system. With no river, no reservoir, and trash that tourists generate faster than the island can process, the IoT here is keeping the place from choking.",
      th: "จัดการขยะและน้ำอัจฉริยะของสมุยไม่ใช่อัปเกรดไลฟ์สไตล์ — มันคือระบบเอาตัวรอดของเกาะ ไม่มีแม่น้ำ ไม่มีอ่างเก็บน้ำ และขยะที่นักท่องเที่ยวผลิตเร็วกว่าเกาะจัดการได้ IoT ที่นี่ทำให้เกาะไม่สำลัก",
      zh: "苏梅岛的智慧废物和水管理不是生活方式升级——这是岛屿生存系统。没有河流，没有水库，游客产生垃圾的速度超过岛屿处理能力，这里的物联网在防止这个地方窒息。",
    },
    funFact: {
      en: "Samui's 68K residents host roughly 3 million visitors a year — a 44:1 visitor-to-resident ratio that makes every water pipe and garbage truck a strategic asset.",
      th: "ผู้อยู่อาศัย 68K ของสมุยรองรับนักท่องเที่ยวราว 3 ล้านคนต่อปี — อัตราส่วนนักท่องเที่ยวต่อผู้อยู่อาศัย 44:1 ทำให้ท่อน้ำและรถขยะทุกคันเป็นสินทรัพย์เชิงยุทธศาสตร์",
      zh: "苏梅的6.8万居民每年接待约300万游客——44:1的游客与居民比使每一根水管和每一辆垃圾车都成为战略资产。",
    },
    compareNote: {
      en: "Hospitality 86 (second only to Phuket), economy 72 from tourism, but crime 175/100K and water scarcity define the other side of paradise.",
      th: "การท่องเที่ยว 86 (รองแค่ภูเก็ต) เศรษฐกิจ 72 จากท่องเที่ยว แต่อาชญากรรม 175/100K และขาดแคลนน้ำคืออีกด้านของสวรรค์",
      zh: "酒店服务86（仅次于普吉），经济72来自旅游，但犯罪率175/10万和水资源短缺定义了天堂的另一面。",
    },
  },
  satun: {
    industries: CITY_INDUSTRY_TAGS.satun,
    dailyLife: {
      en: "A quiet border town where the longtail to Langkawi leaves twice daily, rubber tappers work the plantations, and the Geopark trails attract a thin but steady stream of geology tourists. Nobody rushes here.",
      th: "เมืองชายแดนเงียบที่เรือไปลังกาวีออกวันละ 2 เที่ยว คนกรีดยางทำสวน และเส้นทางจีโอพาร์กดึงนักท่องเที่ยวธรณีวิทยาสม่ำเสมอแต่ไม่มาก ไม่มีใครรีบที่นี่",
      zh: "一个安静的边境小镇，去兰卡威的长尾船每天两班，割胶工在种植园工作，地质公园步道吸引着稀少但稳定的地质游客。这里没人着急。",
    },
    signatureStory: {
      en: "Satun's UNESCO Global Geopark — the first in Thailand — is the backbone of its smart city pitch. Environmental sensors monitor fossils, coral, and marine life across the Tarutao archipelago. Conservation here is not a poster; it is the economy.",
      th: "UNESCO Global Geopark ของสตูล — แห่งแรกในไทย — เป็นแกนหลักของเมืองอัจฉริยะ เซ็นเซอร์สิ่งแวดล้อมเฝ้าระวังฟอสซิล ปะการัง และสิ่งมีชีวิตทางทะเลทั่วหมู่เกาะตะรุเตา การอนุรักษ์ที่นี่ไม่ใช่โปสเตอร์ มันคือเศรษฐกิจ",
      zh: "沙敦的联合国教科文组织全球地质公园——泰国第一个——是其智慧城市卖点的支柱。环境传感器监测达鲁岛群岛的化石、珊瑚和海洋生物。这里的保护不是海报；它就是经济。",
    },
    funFact: {
      en: "Satun is one of Thailand's safest provinces — crime rate 88/100K, the lowest in the index. The geopark visitors come for rocks, not nightlife.",
      th: "สตูลเป็นหนึ่งในจังหวัดปลอดภัยสุดของไทย — อาชญากรรม 88/100K ต่ำสุดในดัชนี นักท่องเที่ยวจีโอพาร์กมาดูหิน ไม่ใช่ไนท์ไลฟ์",
      zh: "沙敦是泰国最安全的省份之一——犯罪率88/10万，指数中最低。地质公园游客来看石头，不是夜生活。",
    },
    compareNote: {
      en: "Environment 78 and safety 76 — the index's quietest achiever. GPP B82K and digital 40 are the flip side: conservation works, economic growth does not.",
      th: "สิ่งแวดล้อม 78 และความปลอดภัย 76 — ผู้ทำผลงานเงียบสุดของดัชนี GPP B82K และดิจิทัล 40 คืออีกด้าน: อนุรักษ์ใช้ได้ เศรษฐกิจไม่โต",
      zh: "环境78和安全76——指数中最安静的成就者。GPP B82K和数字40是另一面：保护有效，经济增长无效。",
    },
  },
  "tai-yong": {
    industries: CITY_INDUSTRY_TAGS["tai-yong"],
    dailyLife: {
      en: "An 18K-person sub-district in Nakhon Si Thammarat where rice paddies and fruit orchards stretch to the hills. The tambon office is the center of gravity, and the smart city program is essentially a digital layer on top of village governance.",
      th: "ตำบล 18K คนในนครศรีธรรมราชที่นาข้าวและสวนผลไม้ทอดยาวถึงเนินเขา สำนักงานตำบลคือศูนย์กลาง และโปรแกรมเมืองอัจฉริยะเป็นชั้นดิจิทัลบนปกครองหมู่บ้าน",
      zh: "一个位于那空是贪玛叻的1.8万人乡镇，稻田和果园延伸到山丘。乡办公室是重心，智慧城市计划本质上是在村庄治理上加了一层数字层。",
    },
    signatureStory: {
      en: "Tai Yong is a proof point for tambon-scale digital governance — community-level apps for complaints, land use, and agricultural support. If this works, it could scale to thousands of Thai sub-districts.",
      th: "ไทยวังเป็นหลักฐานของปกครองดิจิทัลระดับตำบล — แอปชุมชนสำหรับร้องเรียน ใช้ที่ดิน และสนับสนุนเกษตร ถ้าใช้ได้ อาจขยายไปตำบลไทยหลายพัน",
      zh: "太勇是乡镇级数字治理的概念验证——社区级应用用于投诉、土地使用和农业支持。如果有效，可以推广到泰国数千个乡镇。",
    },
    funFact: {
      en: "Nakhon Si Thammarat's shadow puppets (nang talung) are UNESCO-recognized intangible heritage — making this province one of the few places where smart governance coexists with thousand-year-old leather art.",
      th: "หนังตะลุงของนครศรีธรรมราชเป็นมรดกทางวัฒนธรรมที่จับต้องไม่ได้ของ UNESCO — ทำให้จังหวัดนี้เป็นหนึ่งในไม่กี่ที่ที่ปกครองอัจฉริยะอยู่ร่วมกับศิลปะหนังพันปี",
      zh: "那空是贪玛叻的皮影戏(nang talung)是联合国教科文组织认可的非物质遗产——使这个省成为少数智慧治理与千年皮革艺术共存的地方之一。",
    },
    compareNote: {
      en: "18K people, 3 dimensions, digital 35. The smallest southern smart city — but the tambon governance model is replicable at scale if anyone pays attention.",
      th: "ประชากร 18K 3 มิติ ดิจิทัล 35 เมืองอัจฉริยะใต้เล็กสุด — แต่โมเดลปกครองตำบลขยายได้ถ้ามีคนสนใจ",
      zh: "1.8万人，3个维度，数字35。最小的南部智慧城市——但乡镇治理模式如果有人关注是可以规模化复制的。",
    },
  },

  // ─── BANGKOK (ADDITIONAL) ───
  "klong-phadung": {
    industries: CITY_INDUSTRY_TAGS["klong-phadung"],
    dailyLife: {
      en: "The canal that once marked Bangkok's city wall now hosts water taxis, heritage walks, and a surprising amount of public Wi-Fi. Office workers eat lunch at canal-side pavilions; joggers use the renovated paths after dark.",
      th: "คลองที่เคยเป็นกำแพงเมืองกรุงเทพฯ ตอนนี้มีแท็กซี่ทางน้ำ เส้นทางเดินมรดก และ Wi-Fi สาธารณะมากอย่างน่าประหลาดใจ พนักงานออฟฟิศกินข้าวเที่ยงที่ศาลาริมคลอง นักวิ่งใช้ทางเดินที่ปรับปรุงหลังมืด",
      zh: "这条曾经标记曼谷城墙的运河现在有水上出租车、遗产步道和令人惊讶的大量公共Wi-Fi。上班族在运河边亭子吃午餐；慢跑者天黑后使用翻新的步道。",
    },
    signatureStory: {
      en: "Klong Phadung Krung Kasem is Bangkok's most convincing urban renewal project — smart water quality monitoring, AR heritage overlays, and connected public spaces along a canal that was basically a drainage ditch five years ago.",
      th: "คลองผดุงกรุงเกษมเป็นโครงการฟื้นฟูเมืองน่าเชื่อถือสุดของกรุงเทพฯ — เฝ้าระวังคุณภาพน้ำอัจฉริยะ AR ซ้อนทับมรดก และพื้นที่สาธารณะเชื่อมต่อตามคลองที่เมื่อ 5 ปีก่อนเป็นแค่ท่อระบายน้ำ",
      zh: "空帕敦宫是曼谷最令人信服的城市更新项目——智能水质监测、AR遗产叠加层和连接的公共空间沿着一条五年前基本上是排水沟的运河。",
    },
    funFact: {
      en: "The canal was dug in 1852 under King Rama IV as Bangkok's outer moat. Today its AR heritage walk lets you point your phone at a bridge and see what it looked like under absolute monarchy.",
      th: "คลองขุดเมื่อ พ.ศ. 2395 สมัยรัชกาลที่ 4 เป็นคูเมืองชั้นนอกของกรุงเทพฯ วันนี้เส้นทาง AR heritage ให้คุณเล็งโทรศัพท์ที่สะพานแล้วเห็นว่ามันเป็นอย่างไรสมัยสมบูรณาญาสิทธิราชย์",
      zh: "这条运河是1852年拉玛四世时期作为曼谷外护城河开挖的。今天它的AR遗产步道让你把手机对准一座桥，看看它在君主专制时代是什么样子。",
    },
    compareNote: {
      en: "Bangkok's heritage smart city: digital 72 and hospitality 68 from genuine public realm investment. Green coverage 8% is the ugly truth — there is canal, not canopy.",
      th: "เมืองอัจฉริยะมรดกของกรุงเทพฯ: ดิจิทัล 72 และการท่องเที่ยว 68 จากการลงทุนพื้นที่สาธารณะจริง พื้นที่สีเขียว 8% คือความจริงอันน่าเกลียด — มีคลอง ไม่มีต้นไม้",
      zh: "曼谷的遗产智慧城市：数字72和酒店68来自真正的公共空间投资。绿化覆盖8%是丑陋的真相——有运河，没有树冠。",
    },
  },
  makkasan: {
    industries: CITY_INDUSTRY_TAGS.makkasan,
    dailyLife: {
      en: "There is no daily life to describe. The railway workshops are closed, the land is empty, and the Airport Rail Link station stands as a transit waypoint, not a destination. Makkasan is a planning fantasy with a train stop.",
      th: "ไม่มีชีวิตประจำวันให้อธิบาย โรงงานรถไฟปิด ที่ดินว่าง และสถานีแอร์พอร์ตเรลลิงก์ตั้งเป็นจุดผ่านทาง ไม่ใช่จุดหมาย มักกะสันคือจินตนาการผังเมืองที่มีป้ายรถไฟ",
      zh: "没有日常生活可描述。铁路车间已关闭，土地空置，机场快线站是过路点而非目的地。玛卡桑是一个有火车站的规划幻想。",
    },
    signatureStory: {
      en: "Makkasan has been Bangkok's biggest transit-oriented development promise for two decades — and two decades of nothing built. The master plan exists, the EIA is done, and the land sits empty beside the Airport Rail Link.",
      th: "มักกะสันเป็นสัญญาพัฒนาเมืองรอบระบบขนส่งใหญ่สุดของกรุงเทพฯ มาสองทศวรรษ — และสองทศวรรษไม่มีอะไรสร้าง ผังแม่บทมี EIA เสร็จ และที่ดินว่างข้างแอร์พอร์ตเรลลิงก์",
      zh: "玛卡桑二十年来一直是曼谷最大的交通导向开发承诺——二十年什么都没建。总体规划有了，环评做了，土地空在机场快线旁边。",
    },
    funFact: {
      en: "The Makkasan railway workshops were built in 1910 and once employed thousands of Thai railway engineers. Today the heritage buildings sit behind locked gates while consultants debate whether to demolish or preserve them.",
      th: "โรงงานรถไฟมักกะสันสร้างเมื่อ พ.ศ. 2453 และเคยจ้างวิศวกรรถไฟไทยหลายพันคน วันนี้อาคารมรดกอยู่หลังประตูล็อคขณะที่ที่ปรึกษาถกว่าจะรื้อหรืออนุรักษ์",
      zh: "玛卡桑铁路车间建于1910年，曾雇用数千名泰国铁路工程师。今天遗产建筑坐在锁着的大门后面，顾问们争论是拆除还是保留。",
    },
    compareNote: {
      en: "Livability 30, economy 35, hospitality 25 — the index's lowest-scoring Bangkok district. A certified smart city with zero residents and zero built infrastructure. Pure potential, pure paralysis.",
      th: "น่าอยู่ 30 เศรษฐกิจ 35 การท่องเที่ยว 25 — เขตกรุงเทพฯ คะแนนต่ำสุดในดัชนี เมืองอัจฉริยะรับรองที่ไม่มีผู้อยู่อาศัยและไม่มีโครงสร้างพื้นฐาน ศักยภาพล้วน อัมพาตล้วน",
      zh: "宜居30，经济35，酒店25——指数中曼谷评分最低的区。一个零居民零建成基础设施的认证智慧城市。纯粹的潜力，纯粹的瘫痪。",
    },
  },
  "phra-ram-4": {
    industries: CITY_INDUSTRY_TAGS["phra-ram-4"],
    dailyLife: {
      en: "Office towers, co-working spaces, MRT commuters, and street food vendors pack a 4km corridor. Lunchtime is a sardine run of white-collar workers; after dark, Samyan Mitrtown's rooftop bars take over.",
      th: "ตึกออฟฟิศ โคเวิร์กกิ้ง ผู้โดยสาร MRT และรถเข็นอาหารอัดแน่นในระเบียง 4 กม. เที่ยงเป็นปลากระป๋องของพนักงานออฟฟิศ หลังมืดรูฟท็อปบาร์สามย่านมิตรทาวน์ครองเมือง",
      zh: "写字楼、联合办公空间、地铁通勤者和街头小贩挤在4公里走廊里。午餐时间是白领们的沙丁鱼跑；天黑后，三养Mitrtown的屋顶酒吧接管。",
    },
    signatureStory: {
      en: "Phra Ram 4 is Bangkok's CBD smart corridor — traffic signal optimization, digital commercial district management, and air quality monitoring along one of the city's most congested arteries. The tech fights Bangkok traffic physics daily and loses gracefully.",
      th: "พระราม 4 คือระเบียง CBD อัจฉริยะของกรุงเทพฯ — ปรับสัญญาณจราจร จัดการย่านการค้าดิจิทัล และเฝ้าระวังคุณภาพอากาศตามเส้นทางที่แออัดสุดของเมือง เทคต่อสู้กับฟิสิกส์จราจรกรุงเทพฯ ทุกวันและแพ้อย่างสง่างาม",
      zh: "拉玛四路是曼谷的CBD智能走廊——交通信号优化、数字商业区管理和空气质量监测沿着城市最拥堵的干道之一。技术每天与曼谷交通物理学战斗，优雅地输。",
    },
    funFact: {
      en: "Phra Ram 4 connects Hua Lamphong railway station to Khlong Toei port — a line drawn a century ago to move goods. Today it moves people and PM2.5 in roughly equal volumes.",
      th: "พระราม 4 เชื่อมสถานีรถไฟหัวลำโพงกับท่าเรือคลองเตย — เส้นที่ลากเมื่อศตวรรษก่อนเพื่อขนสินค้า วันนี้ขนคนและ PM2.5 ในปริมาณใกล้เคียงกัน",
      zh: "拉玛四路连接华兰蓬火车站和空堤港——一条一个世纪前为运货而画的线。今天它以大致相等的量运送人和PM2.5。",
    },
    compareNote: {
      en: "Bangkok's commercial spine: economy 78, digital 68, but PM2.5 32.4 and green coverage 12%. Smart traffic helps; smart lungs would help more.",
      th: "กระดูกสันหลังการค้ากรุงเทพฯ: เศรษฐกิจ 78 ดิจิทัล 68 แต่ PM2.5 32.4 และพื้นที่สีเขียว 12% จราจรอัจฉริยะช่วย ปอดอัจฉริยะช่วยมากกว่า",
      zh: "曼谷的商业脊柱：经济78，数字68，但PM2.5 32.4和绿化覆盖12%。智能交通有帮助；智能肺帮助更大。",
    },
  },
};

function fallbackText(copy: { en: string; th: string }, zh?: string): TrilingualText {
  return {
    en: copy.en,
    th: copy.th,
    zh: zh ?? copy.en,
  };
}

function defaultIndustries(city: SmartCity): TrilingualList {
  const english = city.smartDimensions.slice(0, 4).map(dimension =>
    dimension === "economy"
      ? "Economic services"
      : dimension === "energy"
        ? "Energy systems"
        : dimension === "environment"
          ? "Environmental services"
          : dimension === "governance"
            ? "Public administration"
            : dimension === "living"
              ? "Urban services"
              : dimension === "mobility"
                ? "Mobility"
                : "Education & people",
  );

  return {
    en: english,
    th: english,
    zh: english,
  };
}

export function getLocalizedText(locale: Locale, copy: TrilingualText): string {
  if (locale === "th") return copy.th;
  if (locale === "zh") return copy.zh;
  return copy.en;
}

export function getLocalizedList(locale: Locale, copy: TrilingualList): string[] {
  if (locale === "th") return copy.th;
  if (locale === "zh") return copy.zh;
  return copy.en;
}

export function resolveCityResearch(city: SmartCity): CityResearchProfile {
  const curated = CITY_RESEARCH_PROFILES[city.id];
  const context = getCityContext(city.id);
  const industries = curated?.industries ?? CITY_INDUSTRY_TAGS[city.id] ?? defaultIndustries(city);

  if (!context) {
    return curated ?? {
      industries,
      dailyLife: {
        en: city.tagline,
        th: city.taglineTh,
        zh: city.tagline,
      },
      signatureStory: {
        en: city.highlights[0] ?? city.tagline,
        th: city.highlights[0] ?? city.taglineTh,
        zh: city.highlights[0] ?? city.tagline,
      },
      funFact: {
        en: city.highlights[1] ?? city.nameEn,
        th: city.highlights[1] ?? city.nameTh,
        zh: city.highlights[1] ?? city.nameEn,
      },
      compareNote: {
        en: city.tagline,
        th: city.taglineTh,
        zh: city.tagline,
      },
    };
  }

  return {
    industries,
    dailyLife: curated?.dailyLife ?? fallbackText(context.livelihood),
    signatureStory: curated?.signatureStory ?? fallbackText(context.opportunity),
    funFact: curated?.funFact ?? fallbackText(context.famousFor),
    compareNote: curated?.compareNote ?? fallbackText(context.opportunity),
    sources: curated?.sources ?? [],
  };
}

export function getCityResearchSources(city: SmartCity): CityResearchSource[] {
  return resolveCityResearch(city).sources ?? [];
}
