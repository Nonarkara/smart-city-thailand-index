// Source: src/cityAnalytics.ts (live at github.com/Nonarkara/smart-city-thailand-index)
// The Moneyball investment view: a separate score (growth capacity, infra readiness, livability) that surfaces undervalued cities — distinct from the pillar composite.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// City Analytics — Developability, Global Comparisons, Tailored Steps
// ---------------------------------------------------------------------------
// Every city gets unique data-driven analysis. No hallucination.
// Computed from actual scores, metrics, and city characteristics.
// ---------------------------------------------------------------------------

import type { SmartCity, ScoringPillar } from "./types";
import { SCORING_PILLARS } from "./scoring";
import { PROVINCIAL_LAND_PRICE_SCORE } from "./provincialLandPriceData.ts";

// ─── DEVELOPABILITY SCORE ───
// Measures: growth capacity (30%), infrastructure readiness (40%), livability (30%)
// Output: 0-100% "developability" — how investable/improvable is this city

export interface DevelopabilityScore {
  total: number; // 0-100
  growthCapacity: number; // 0-100
  infraReadiness: number; // 0-100
  livabilityBase: number; // 0-100
  label: string;
  labelTh: string;
  labelZh: string;
  // Phase 13 land price and investability
  landPriceBaht?: number | null;
  landPriceSource?: string;
  landPriceNoteEn?: string;
  landPriceNoteTh?: string;
  landPriceNoteZh?: string;
  investabilityScore?: number | null;
  investabilityLabel?: string;
  investabilityLabelTh?: string;
  investabilityLabelZh?: string;
}

export function computeDevelopability(city: SmartCity): DevelopabilityScore {
  // Growth capacity: economy score + digital score + tier upgrade potential
  const tierGap = city.tier === "gamma" ? 30 : city.tier === "beta" ? 15 : 0;
  const growthCapacity = Math.min(100, city.scores.economy * 0.4 + city.scores.digital * 0.3 + tierGap + (city.reality === "operational" ? 20 : city.reality === "partial" ? 10 : 0));

  // Infrastructure readiness: livability + safety + whether it's operational
  const infraReadiness = Math.min(100, city.scores.livability * 0.4 + city.scores.safety * 0.3 + (city.reality === "operational" ? 30 : city.reality === "partial" ? 15 : 0));

  // Livability base: wellbeing + environment + hospitality
  const livabilityBase = Math.min(100, city.scores.wellbeing * 0.35 + city.scores.environment * 0.35 + city.scores.hospitality * 0.3);

  const total = Math.round(growthCapacity * 0.3 + infraReadiness * 0.4 + livabilityBase * 0.3);

  let label = "High potential";
  let labelTh = "ศักยภาพสูง";
  let labelZh = "高潜力";
  if (total >= 70) { label = "Strong investability"; labelTh = "น่าลงทุนสูง"; labelZh = "投资吸引力强"; }
  else if (total >= 55) { label = "Emerging opportunity"; labelTh = "โอกาสที่กำลังมา"; labelZh = "新兴机遇"; }
  else if (total >= 40) { label = "Needs capacity building"; labelTh = "ต้องสร้างศักยภาพ"; labelZh = "需要能力建设"; }
  else { label = "Foundation stage"; labelTh = "ระยะวางรากฐาน"; labelZh = "基础阶段"; }

  const landPriceBaht = city.metrics.landPriceBaht ?? null;
  const landPriceSource = city.metrics.landPriceSource;

  let landPriceNoteEn = "";
  let landPriceNoteTh = "";
  let landPriceNoteZh = "";
  let investabilityScore: number | null = null;
  let investabilityLabel = "";
  let investabilityLabelTh = "";
  let investabilityLabelZh = "";

  if (landPriceBaht !== null) {
    const entry = PROVINCIAL_LAND_PRICE_SCORE[city.province];
    if (entry) {
      landPriceNoteEn = entry.note.en;
      landPriceNoteTh = entry.note.th;
      landPriceNoteZh = entry.note.zh;
    }

    // Normalised price based on Bangkok Rama IV commercial peak (250,000 Baht/sq.m)
    const normalisedPrice = Math.min(1, landPriceBaht / 250000);
    // Asymmetric opportunity multiplier math
    investabilityScore = Math.round(total * (1.2 - 0.8 * normalisedPrice));
    investabilityScore = Math.min(100, Math.max(0, investabilityScore));

    if (investabilityScore >= 75) {
      investabilityLabel = "Asymmetric Gem";
      investabilityLabelTh = "โอกาสทองแบบอสมมาตร";
      investabilityLabelZh = "非对称黄金机遇";
    } else if (investabilityScore >= 60) {
      investabilityLabel = "High Yield Potential";
      investabilityLabelTh = "ศักยภาพผลตอบแทนสูง";
      investabilityLabelZh = "高收益潜力";
    } else if (investabilityScore >= 45) {
      investabilityLabel = "Balanced Entry";
      investabilityLabelTh = "ทางเข้าที่สมดุล";
      investabilityLabelZh = "平衡入口";
    } else {
      investabilityLabel = "Premium / High Barrier";
      investabilityLabelTh = "ระดับพรีเมียม / กำแพงสูง";
      investabilityLabelZh = "溢价 / 高壁垒";
    }
  }

  return {
    total,
    growthCapacity: Math.round(growthCapacity),
    infraReadiness: Math.round(infraReadiness),
    livabilityBase: Math.round(livabilityBase),
    label,
    labelTh,
    labelZh,
    landPriceBaht,
    landPriceSource,
    landPriceNoteEn,
    landPriceNoteTh,
    landPriceNoteZh,
    investabilityScore,
    investabilityLabel,
    investabilityLabelTh,
    investabilityLabelZh,
  };
}

// ─── GLOBAL CITY COMPARISON ───
// Match each Thai city to a comparable world city by size, population, and character

export interface GlobalComparison {
  worldCity: string;
  country: string;
  population: string;
  why: string;
  whyTh: string;
  whyZh: string;
}

const COMPARISONS: Record<string, GlobalComparison> = {
  phuket: { worldCity: "Bali (Denpasar)", country: "Indonesia", population: "~430K (Denpasar metro)", why: "Island tourism economy, similar beach-resort infrastructure pressure, marine conservation needs", whyTh: "เศรษฐกิจท่องเที่ยวเกาะ แรงกดดันโครงสร้างรีสอร์ทชายหาดคล้ายกัน ความต้องการอนุรักษ์ทะเล", whyZh: "岛屿旅游经济，类似的海滩度假基础设施压力，海洋保护需求" },
  samyan: { worldCity: "Gangnam, Seoul", country: "South Korea", population: "~500K district", why: "University-anchored innovation district in capital city, startup density, high property values", whyTh: "ย่านนวัตกรรมยึดโยงมหาวิทยาลัยในเมืองหลวง ความหนาแน่นสตาร์ทอัพ ราคาอสังหาฯ สูง", whyZh: "首都大学创新区，创业密度高，房产价值高" },
  "chiang-mai-old-town": { worldCity: "Kyoto", country: "Japan", population: "1.5M", why: "Ancient temple city balancing heritage preservation with modern tourism and tech", whyTh: "เมืองวัดโบราณที่สมดุลอนุรักษ์มรดกกับท่องเที่ยวสมัยใหม่และเทคโนโลยี", whyZh: "古庙之城，平衡文化遗产保护与现代旅游和科技" },
  "khon-kaen": { worldCity: "Medellín", country: "Colombia", population: "2.5M", why: "Regional capital driving innovation from outside the primary city, private-sector-led transit investment", whyTh: "เมืองหลวงภูมิภาคที่ขับเคลื่อนนวัตกรรมจากนอกเมืองหลัก เอกชนนำการลงทุนขนส่ง", whyZh: "区域首府从主城外驱动创新，私营部门主导交通投资" },
  "cmu-smart-city": { worldCity: "Cambridge (MIT area)", country: "USA", population: "~120K", why: "University campus as living lab for smart city R&D, innovation spillover to surrounding city", whyTh: "แคมปัสมหาวิทยาลัยเป็นห้องทดลองจริง R&D เมืองอัจฉริยะ นวัตกรรมล้นไปสู่เมืองรอบข้าง", whyZh: "大学校园作为智慧城市研发的活体实验室，创新溢出至周边城市" },
  "nakhon-si-thammarat": { worldCity: "Curitiba", country: "Brazil", population: "1.9M", why: "Mid-size city proving smart governance works without high budgets — citizen-centric, bottom-up", whyTh: "เมืองขนาดกลางพิสูจน์ว่าปกครองอัจฉริยะทำงานได้โดยไม่ต้องงบสูง เน้นประชาชน ล่างขึ้นบน", whyZh: "中等城市证明低预算下智慧治理可行——以公民为中心，自下而上" },
  "hat-yai": { worldCity: "Johor Bahru", country: "Malaysia", population: "500K", why: "Border trade city adjacent to richer neighbor, flood-prone, cross-border commerce hub", whyTh: "เมืองค้าชายแดนติดเพื่อนบ้านที่ร่ำรวยกว่า เสี่ยงน้ำท่วม ศูนย์กลางการค้าข้ามพรมแดน", whyZh: "边境贸易城市，毗邻更富裕的邻国，易洪涝，跨境商贸枢纽" },
  yala: { worldCity: "Kigali", country: "Rwanda", population: "1.2M", why: "Cleanest city award despite conflict zone, proving governance beats GDP for smart city success", whyTh: "รางวัลเมืองสะอาดแม้อยู่ในเขตขัดแย้ง พิสูจน์ว่าธรรมาภิบาลชนะ GDP สำหรับเมืองอัจฉริยะ", whyZh: "即便处于冲突地带仍获最洁净城市奖，证明治理能力胜过GDP" },
  krabi: { worldCity: "Dubrovnik", country: "Croatia", population: "~43K", why: "Tourism-dependent coastal city managing overtourism pressure with heritage conservation", whyTh: "เมืองชายฝั่งพึ่งท่องเที่ยวที่จัดการแรงกดดันนักท่องเที่ยวล้นกับการอนุรักษ์มรดก", whyZh: "依赖旅游的海岸城市，在遗产保护中管理过度旅游压力" },
  rayong: { worldCity: "Ulsan", country: "South Korea", population: "1.1M", why: "Industrial powerhouse (petrochemical/auto) with highest GDP, environmental monitoring critical", whyTh: "เมืองอุตสาหกรรม (ปิโตรเคมี/รถยนต์) GDP สูงสุด การเฝ้าระวังสิ่งแวดล้อมสำคัญ", whyZh: "工业重镇（石化/汽车），GDP最高，环境监测至关重要" },
  "wangchan-valley": { worldCity: "Songdo", country: "South Korea", population: "~170K planned", why: "Greenfield smart city development with massive investment plan and long-term realization scale", whyTh: "การพัฒนาเมืองอัจฉริยะใหม่ที่มีแผนการลงทุนมหาศาลและระยะเวลาจัดตั้งระยะยาว", whyZh: "具备庞大投资计划和长期实现规模的绿地智慧城市开发" },
  "mae-moh": { worldCity: "Bełchatów", country: "Poland", population: "~57K", why: "Coal mining town in energy transition — similar EGAT/industrial company town dynamics", whyTh: "เมืองเหมืองถ่านหินในการเปลี่ยนผ่านพลังงาน — พลวัตเมืองบริษัทอุตสาหกรรมคล้ายกัน", whyZh: "能源转型中的煤矿城镇——类似EGAT工业公司城镇动态" },
  nakhonsawan: { worldCity: "Mandalay", country: "Myanmar", population: "1.2M", why: "River confluence city, flood-prone, agriculture-based economy, strategic inland location", whyTh: "เมืองจุดบรรจบแม่น้ำ เสี่ยงน้ำท่วม เศรษฐกิจเกษตร ทำเลเชิงยุทธศาสตร์ภายในประเทศ", whyZh: "江河汇流城市，易洪涝，农业经济，内陆战略位置" },
  saensuk: { worldCity: "Brighton", country: "UK", population: "~290K", why: "University beach town with progressive municipal government, small but genuine innovation", whyTh: "เมืองชายหาดมหาวิทยาลัยที่มีเทศบาลก้าวหน้า เล็กแต่นวัตกรรมจริง", whyZh: "有进步市政府的大学海滨小城，小而有真正的创新" },
  chachoengsao: { worldCity: "Batam", country: "Indonesia", population: "1.2M", why: "Industrial gateway/SEZ city near capital, manufacturing + logistics hub", whyTh: "เมืองประตู SEZ ใกล้เมืองหลวง ศูนย์กลางผลิตและโลจิสติกส์", whyZh: "首都附近的工业门户/特区城市，制造和物流枢纽" },
  "chiang-rai": { worldCity: "Luang Prabang", country: "Laos", population: "~66K", why: "Northern heritage city, temple tourism, border trade, air quality challenges from regional burning", whyTh: "เมืองมรดกภาคเหนือ ท่องเที่ยววัด ค้าชายแดน ปัญหาคุณภาพอากาศจากการเผาในภูมิภาค", whyZh: "北部遗产城市，寺庙旅游，边境贸易，区域燃烧导致的空气质量挑战" },
  nan: { worldCity: "Bhutan (Thimphu)", country: "Bhutan", population: "~115K", why: "Remote mountain community prioritizing cultural preservation and environmental conservation over GDP growth", whyTh: "ชุมชนภูเขาห่างไกลที่ให้ความสำคัญกับการอนุรักษ์วัฒนธรรมและสิ่งแวดล้อมมากกว่าการเติบโตของ GDP", whyZh: "偏远山区社区，优先保护文化和环境，而非GDP增长" },
  korat: { worldCity: "Pune", country: "India", population: "3.1M", why: "Second-tier city with university sector, growing manufacturing, and high-speed rail connection to capital", whyTh: "เมืองระดับสอง ภาคมหาวิทยาลัย การผลิตที่เติบโต รถไฟความเร็วสูงเชื่อมเมืองหลวง", whyZh: "二线城市，有大学、制造业增长，以及连接首都的高铁" },
  "phitsanulok-muni": { worldCity: "Tampere", country: "Finland", population: "~240K", why: "Mid-size regional hub with strong digital governance adoption, university-driven, unglamorous but effective", whyTh: "ศูนย์กลางภูมิภาคขนาดกลาง ปกครองดิจิทัลเข้มแข็ง ขับเคลื่อนด้วยมหาวิทยาลัย ไม่หวือหวาแต่มีประสิทธิภาพ", whyZh: "中型区域枢纽，数字治理采用强劲，大学驱动，不华丽但有效" },
  lampang: { worldCity: "Limoges", country: "France", population: "~130K", why: "Ceramics/craft city with heritage tourism, transitioning traditional industry to smart economy", whyTh: "เมืองเซรามิก/หัตถกรรมกับท่องเที่ยวเชิงมรดก เปลี่ยนผ่านอุตสาหกรรมดั้งเดิมสู่เศรษฐกิจอัจฉริยะ", whyZh: "陶瓷/手工艺城市，传统旅游，将传统产业转型为智慧经济" },
  samui: { worldCity: "Mallorca (Palma)", country: "Spain", population: "~420K", why: "Island tourism with sustainability pressure, water scarcity, waste management critical", whyTh: "ท่องเที่ยวเกาะกับแรงกดดันความยั่งยืน ขาดแคลนน้ำ จัดการขยะสำคัญ", whyZh: "岛屿旅游，可持续性压力，水资源短缺，废物管理至关重要" },
  "phra-ram-4": { worldCity: "Canary Wharf, London", country: "UK", population: "~120K workers", why: "CBD corridor with smart traffic optimization, high-value commercial real estate, land value capture potential", whyTh: "ระเบียง CBD ปรับจราจรอัจฉริยะ อสังหาฯ เชิงพาณิชย์มูลค่าสูง ศักยภาพจับมูลค่าที่ดิน", whyZh: "中央商务区走廊，智慧交通优化，高价值商业地产，土地增值捕获潜力" },
  "bang-saray": { worldCity: "Cascais", country: "Portugal", population: "~210K", why: "Fishing village near major metro transitioning to upscale coastal living, managing gentrification while preserving local character", whyTh: "หมู่บ้านชาวประมงใกล้มหานครเปลี่ยนผ่านสู่ชีวิตชายฝั่งระดับสูง จัดการ gentrification พร้อมรักษาเอกลักษณ์ท้องถิ่น", whyZh: "靠近大城市的渔村，正转型为高端海岸生活，管理绅士化同时保留地方特色" },
  chanthaburi: { worldCity: "Antwerp", country: "Belgium", population: "~530K", why: "Global gem trading hub with historic port district, transitioning traditional trade to digital platforms", whyTh: "ศูนย์กลางค้าอัญมณีระดับโลกกับย่านท่าเรือประวัติศาสตร์ เปลี่ยนผ่านการค้าดั้งเดิมสู่แพลตฟอร์มดิจิทัล", whyZh: "全球宝石交易中心，历史港口区，将传统贸易转型为数字平台" },
  "khao-khun-song": { worldCity: "Almere", country: "Netherlands", population: "~210K", why: "Planned smart agriculture community using precision farming and IoT to boost yield on limited land", whyTh: "ชุมชนเกษตรอัจฉริยะที่วางแผนใช้ precision farming และ IoT เพิ่มผลผลิตบนที่ดินจำกัด", whyZh: "有规划的智慧农业社区，利用精准农业和物联网在有限土地上提高产量" },
  "klong-phadung": { worldCity: "Amsterdam Canal District", country: "Netherlands", population: "~870K city", why: "Historic canal network reinvented as smart water management and cultural tourism corridor", whyTh: "เครือข่ายคลองประวัติศาสตร์นำกลับมาเป็นระเบียงจัดการน้ำอัจฉริยะและท่องเที่ยวเชิงวัฒนธรรม", whyZh: "历史运河网络重新定位为智慧水管理和文化旅游走廊" },
  maesai: { worldCity: "Lào Cai", country: "Vietnam", population: "~110K", why: "Northern border trade town at international crossing, managing commerce flow with limited urban infrastructure", whyTh: "เมืองค้าชายแดนเหนือที่จุดข้ามแดนระหว่างประเทศ จัดการกระแสการค้าด้วยโครงสร้างพื้นฐานเมืองจำกัด", whyZh: "北部边境贸易小城，位于国际口岸，在有限城市基础设施下管理商贸流量" },
  makkasan: { worldCity: "King's Cross, London", country: "UK", population: "~67 acres redevelopment", why: "Railway land redevelopment in capital city — transforming derelict rail yards into innovation district", whyTh: "พัฒนาที่ดินรถไฟในเมืองหลวง — เปลี่ยนลานจอดรถไฟร้างเป็นย่านนวัตกรรม", whyZh: "首都铁路用地再开发——将废弃铁路场地转型为创新区" },
  narathiwat: { worldCity: "Derry/Londonderry", country: "UK", population: "~85K", why: "Post-conflict city rebuilding civic trust through governance and community development despite security challenges", whyTh: "เมืองหลังขัดแย้งสร้างความไว้วางใจผ่านธรรมาภิบาลและพัฒนาชุมชนท่ามกลางความท้าทายด้านความมั่นคง", whyZh: "冲突后城市，尽管面临安全挑战，仍通过治理和社区发展重建公民信任" },
  "nikhom-phatthana": { worldCity: "Jurong", country: "Singapore", population: "~95K district", why: "Industrial estate district becoming smart manufacturing hub with worker welfare integration", whyTh: "เขตนิคมอุตสาหกรรมเป็นศูนย์กลางการผลิตอัจฉริยะพร้อมบูรณาการสวัสดิภาพแรงงาน", whyZh: "工业园区转型为智慧制造枢纽，融入工人福利" },
  nonthaburi: { worldCity: "Yokohama", country: "Japan", population: "3.7M", why: "Capital-adjacent commuter city that grew into a major center in its own right with independent smart city identity", whyTh: "เมืองผู้เดินทางติดเมืองหลวงที่เติบโตเป็นศูนย์กลางสำคัญด้วยอัตลักษณ์เมืองอัจฉริยะเป็นของตัวเอง", whyZh: "毗邻首都的通勤城市，发展为重要中心，拥有独立的智慧城市身份" },
  pattani: { worldCity: "Derry/Londonderry", country: "UK", population: "~85K", why: "Historic Malay trading port rebuilding identity through cultural heritage and education despite prolonged conflict", whyTh: "ท่าเรือค้าขายมลายูประวัติศาสตร์สร้างอัตลักษณ์ใหม่ผ่านมรดกวัฒนธรรมและการศึกษาท่ามกลางความขัดแย้งยืดเยื้อ", whyZh: "历史马来贸易港，通过文化遗产和教育重塑身份，长期冲突中仍坚守" },
  phangnga: { worldCity: "Banda Aceh", country: "Indonesia", population: "~270K", why: "Coastal community rebuilt after tsunami with resilience-first infrastructure and marine conservation focus", whyTh: "ชุมชนชายฝั่งฟื้นตัวหลังสึนามิด้วยโครงสร้างพื้นฐานเน้นความยืดหยุ่นและอนุรักษ์ทะเล", whyZh: "海啸后重建的海岸社区，以韧性为先的基础设施和海洋保护" },
  phichit: { worldCity: "Naga City", country: "Philippines", population: "~210K", why: "Small agricultural city winning governance awards through transparency and citizen participation despite modest budget", whyTh: "เมืองเกษตรขนาดเล็กคว้ารางวัลธรรมาภิบาลผ่านความโปร่งใสและการมีส่วนร่วมของประชาชนแม้งบประมาณจำกัด", whyZh: "小型农业城市，通过透明度和公众参与赢得治理奖，预算有限" },
  "phitsanulok-nu": { worldCity: "Lund", country: "Sweden", population: "~125K", why: "University-anchored smart city R&D hub where campus innovation drives regional development beyond the city", whyTh: "ศูนย์ R&D เมืองอัจฉริยะยึดโยงมหาวิทยาลัย นวัตกรรมแคมปัสขับเคลื่อนการพัฒนาภูมิภาคนอกเมือง", whyZh: "大学为核心的智慧城市研发枢纽，校园创新驱动区域发展" },
  "phitsanulok-ppao": { worldCity: "Oulu", country: "Finland", population: "~210K", why: "Provincial governance hub leveraging digital services to coordinate across scattered rural municipalities", whyTh: "ศูนย์กลางปกครองจังหวัดใช้บริการดิจิทัลประสานงานข้ามเทศบาลชนบทกระจัดกระจาย", whyZh: "省级治理中心，利用数字服务协调分散的农村市镇" },
  phlapphla: { worldCity: "Vauban, Freiburg", country: "Germany", population: "~5.5K district", why: "Small sustainable district proving car-free, community-designed smart living works at neighborhood scale", whyTh: "เขตยั่งยืนขนาดเล็กพิสูจน์ว่าชีวิตอัจฉริยะไร้รถยนต์ออกแบบโดยชุมชนทำงานได้ในระดับย่าน", whyZh: "小型可持续社区区，证明无车、社区设计的智慧生活在街区尺度可行" },
  "phuket-tinicon": { worldCity: "Cyberjaya", country: "Malaysia", population: "~120K", why: "Purpose-built tech innovation district on resort island — balancing IT park ambition with tourism reality", whyTh: "ย่านนวัตกรรมเทคโนโลยีสร้างขึ้นเฉพาะบนเกาะรีสอร์ต — สมดุลความทะเยอทะยาน IT park กับความจริงท่องเที่ยว", whyZh: "度假岛上专门建设的科技创新区——平衡IT园区野心与旅游现实" },
  rattanakosin: { worldCity: "Malacca Historic City", country: "Malaysia", population: "~500K", why: "UNESCO-caliber historic island district balancing heritage preservation with livability and tourism management", whyTh: "เขตเกาะประวัติศาสตร์ระดับ UNESCO สมดุลอนุรักษ์มรดกกับความน่าอยู่และจัดการท่องเที่ยว", whyZh: "UNESCO级历史岛区，平衡遗产保护与宜居性和旅游管理" },
  "samut-prakan": { worldCity: "Batangas", country: "Philippines", population: "~330K", why: "Industrial port city adjacent to capital with manufacturing base, environmental monitoring needs from factory density", whyTh: "เมืองท่าอุตสาหกรรมติดเมืองหลวง ฐานการผลิต ต้องการเฝ้าระวังสิ่งแวดล้อมจากความหนาแน่นโรงงาน", whyZh: "毗邻首都的工业港口城市，制造业基础，工厂密度高需要环境监测" },
  satun: { worldCity: "Langkawi", country: "Malaysia", population: "~100K", why: "Geopark island tourism destination with quiet eco-tourism positioning, marine biodiversity conservation", whyTh: "แหล่งท่องเที่ยวเกาะจีโอพาร์คที่วางตำแหน่งท่องเที่ยวเชิงนิเวศ อนุรักษ์ความหลากหลายทางทะเล", whyZh: "地质公园岛屿旅游目的地，定位为生态旅游，海洋生物多样性保护" },
  "songkhla-city": { worldCity: "Hue", country: "Vietnam", population: "~350K", why: "Cultural heritage lake city in southern region, balancing traditional identity with modern urban development", whyTh: "เมืองมรดกวัฒนธรรมริมทะเลสาบภาคใต้ สมดุลอัตลักษณ์ดั้งเดิมกับพัฒนาเมืองสมัยใหม่", whyZh: "南部地区湖边文化遗产城市，平衡传统身份与现代城市发展" },
  sritrang: { worldCity: "Penang (George Town)", country: "Malaysia", population: "~750K", why: "Community-driven heritage district with strong civic participation and creative economy emerging from cultural base", whyTh: "เขตมรดกขับเคลื่อนโดยชุมชน การมีส่วนร่วมพลเมืองเข้มแข็ง เศรษฐกิจสร้างสรรค์เกิดจากฐานวัฒนธรรม", whyZh: "社区驱动的遗产区，公民参与强，从文化基础涌现创意经济" },
  "tai-yong": { worldCity: "Rural Estonia (Setomaa)", country: "Estonia", population: "~3K", why: "Remote rural community accessing world-class digital governance through national e-services infrastructure", whyTh: "ชุมชนชนบทห่างไกลเข้าถึงธรรมาภิบาลดิจิทัลระดับโลกผ่านโครงสร้างพื้นฐาน e-services ระดับชาติ", whyZh: "偏远农村社区，通过国家电子服务基础设施获得世界级数字治理" },
  tak: { worldCity: "Mae Sot–Myawaddy Corridor", country: "Myanmar/Thailand", population: "~200K border zone", why: "Border SEZ managing cross-border labor, trade logistics, and economic zone development simultaneously", whyTh: "SEZ ชายแดนจัดการแรงงานข้ามพรมแดน โลจิสติกส์การค้า และพัฒนาเขตเศรษฐกิจพร้อมกัน", whyZh: "边境特区，同时管理跨境劳工、贸易物流和经济区发展" },
  "thep-paraj": { worldCity: "Aspern Seestadt, Vienna", country: "Austria", population: "~25K planned", why: "Smart neighborhood development within larger metro area — testing ground for integrated urban services", whyTh: "พัฒนาย่านอัจฉริยะในเขตมหานครใหญ่ — พื้นที่ทดสอบบริการเมืองแบบบูรณาการ", whyZh: "大都市区内的智慧社区开发——综合城市服务的试验场" },
  ubon: { worldCity: "Vientiane", country: "Laos", population: "~820K", why: "Major Mekong corridor city with cultural festival fame, regional governance hub for Isan's eastern edge", whyTh: "เมืองหลักระเบียงแม่น้ำโขง มีชื่อเสียงเทศกาลวัฒนธรรม ศูนย์กลางปกครองภูมิภาคอีสานตะวันออก", whyZh: "主要湄公河走廊城市，文化节庆闻名，东北部东缘区域治理枢纽" },
  "ubon-muni": { worldCity: "Savannakhet", country: "Laos", population: "~125K", why: "Municipal core within larger Mekong province, managing urban services for growing regional population", whyTh: "แกนกลางเทศบาลในจังหวัดริมโขงขนาดใหญ่ จัดการบริการเมืองสำหรับประชากรภูมิภาคที่เติบโต", whyZh: "大型湄公省内的市政核心，为增长中的区域人口管理城市服务" },
  umong: { worldCity: "Freiburg Green District", country: "Germany", population: "~230K city", why: "Small district near university city pioneering green energy and sustainable community practices", whyTh: "เขตเล็กใกล้เมืองมหาวิทยาลัยบุกเบิกพลังงานสีเขียวและแนวปฏิบัติชุมชนยั่งยืน", whyZh: "大学城附近的小区，探索绿色能源和可持续社区实践" },
};

export function getGlobalComparison(cityId: string): GlobalComparison | undefined {
  return COMPARISONS[cityId];
}

// ─── TAILORED ACTION STEPS ───
// What should each city do next, based on their weakest pillar + tier + context

export interface ActionStep {
  step: string;
  stepTh: string;
  stepZh: string;
  worldExample: string;
  worldExampleTh: string;
  worldExampleZh: string;
  source: string;
}

export function getTailoredSteps(city: SmartCity): ActionStep[] {
  const weakest = [...SCORING_PILLARS].sort((a, b) => city.scores[a] - city.scores[b]);
  const steps: ActionStep[] = [];

  // Step based on weakest pillar
  const w1 = weakest[0];
  const PILLAR_STEPS: Record<ScoringPillar, ActionStep> = {
    livability: {
      step: "Prioritize housing and transit infrastructure before any digital investment",
      stepTh: "ให้ความสำคัญกับที่อยู่อาศัยและขนส่งก่อนลงทุนดิจิทัล",
      stepZh: "在任何数字投资之前，优先发展住房和交通基础设施",
      worldExample: "Vienna's social housing model: 62% of residents live in subsidized housing, creating the livability base for all other smart city services",
      worldExampleTh: "โมเดลบ้านสังคมของเวียนนา: ผู้อยู่อาศัย 62% อยู่ในบ้านอุดหนุน สร้างฐานความน่าอยู่สำหรับบริการเมืองอัจฉริยะทั้งหมด",
      worldExampleZh: "维也纳社会住房模式：62%的居民住在补贴房中，为所有智慧城市服务奠定宜居基础",
      source: "Vienna Housing Strategy 2025",
    },
    economy: {
      step: "Build economic corridors connecting to regional demand centers — don't build in isolation",
      stepTh: "สร้างระเบียงเศรษฐกิจเชื่อมศูนย์กลางอุปสงค์ภูมิภาค ไม่สร้างแบบโดดเดี่ยว",
      stepZh: "建立连接区域需求中心的经济走廊——不要孤立建设",
      worldExample: "Medellín's innovation district connected university research to local industry, creating 3,500 tech jobs in 5 years",
      worldExampleTh: "ย่านนวัตกรรมเมเดยินเชื่อมงานวิจัยมหาวิทยาลัยกับอุตสาหกรรมท้องถิ่น สร้างงานเทค 3,500 ตำแหน่งใน 5 ปี",
      worldExampleZh: "麦德林创新区将大学研究与当地产业相连，5年内创造3,500个科技岗位",
      source: "Ruta N Medellín Impact Report",
    },
    safety: {
      step: "Deploy integrated emergency response systems before smart monitoring — response time matters more than camera count",
      stepTh: "ติดตั้งระบบตอบสนองฉุกเฉินแบบบูรณาการก่อนเฝ้าระวังอัจฉริยะ — เวลาตอบสนองสำคัญกว่าจำนวนกล้อง",
      stepZh: "在智慧监控之前部署综合应急响应系统——响应时间比摄像头数量更重要",
      worldExample: "Bogotá's integrated 123 emergency system reduced response times by 40% by connecting police, fire, and ambulance dispatch",
      worldExampleTh: "ระบบฉุกเฉิน 123 แบบบูรณาการของโบโกตาลดเวลาตอบสนอง 40% โดยเชื่อมตำรวจ ดับเพลิง และรถพยาบาล",
      worldExampleZh: "波哥大综合123应急系统通过联通警察、消防和救护车调度，将响应时间缩短40%",
      source: "Bogotá Seguridad Ciudadana Report",
    },
    wellbeing: {
      step: "Expand community health worker networks with mobile health units before building new hospitals",
      stepTh: "ขยายเครือข่าย อสม. พร้อมหน่วยแพทย์เคลื่อนที่ก่อนสร้างโรงพยาบาลใหม่",
      stepZh: "在建新医院之前扩展社区卫生工作者网络和流动医疗队",
      worldExample: "Rwanda's community health worker program (45,000 workers) achieved 91% health insurance coverage at $5/person/year",
      worldExampleTh: "โครงการ อสม. ของรวันดา (45,000 คน) ครอบคลุมประกันสุขภาพ 91% ด้วยงบ $5/คน/ปี",
      worldExampleZh: "卢旺达社区卫生工作者项目（45,000名工作者）以每人每年5美元实现91%医疗保险覆盖",
      source: "Rwanda Ministry of Health / Lancet Global Health",
    },
    environment: {
      step: "Install real-time air quality monitoring at 10+ locations before announcing green city status",
      stepTh: "ติดตั้งเฝ้าระวังคุณภาพอากาศเรียลไทม์ 10+ จุดก่อนประกาศสถานะเมืองสีเขียว",
      stepZh: "在宣布绿色城市地位之前，在10个以上地点安装实时空气质量监测",
      worldExample: "Kigali deployed 30 low-cost AQ sensors across the city for $50K total, creating Africa's densest urban air quality network",
      worldExampleTh: "คิกาลีติดตั้งเซ็นเซอร์ AQ ต้นทุนต่ำ 30 จุดทั่วเมืองด้วยงบรวม $50K สร้างเครือข่ายคุณภาพอากาศเมืองที่หนาแน่นที่สุดของแอฟริกา",
      worldExampleZh: "基加利以5万美元在全市部署30个低成本空气质量传感器，建成非洲最密集的城市空气质量网络",
      source: "UNEP / Kigali Clean Air Initiative",
    },
    hospitality: {
      step: "Create a cultural asset registry and community storytelling platform — culture is infrastructure",
      stepTh: "สร้างทะเบียนสินทรัพย์วัฒนธรรมและแพลตฟอร์มเล่าเรื่องชุมชน — วัฒนธรรมคือโครงสร้างพื้นฐาน",
      stepZh: "创建文化资产登记册和社区故事叙述平台——文化是基础设施",
      worldExample: "Kyoto's digital heritage preservation uses IoT sensors on 2,000+ temples, creating a living cultural database",
      worldExampleTh: "การอนุรักษ์มรดกดิจิทัลของเกียวโตใช้เซ็นเซอร์ IoT บนวัด 2,000+ แห่ง สร้างฐานข้อมูลวัฒนธรรมที่มีชีวิต",
      worldExampleZh: "京都数字遗产保护使用2,000多座神社上的物联网传感器，打造活态文化数据库",
      source: "Kyoto City Cultural Property Protection Division",
    },
    digital: {
      step: "Build the City Data Platform (CDP) before buying sensors — data architecture first, IoT second",
      stepTh: "สร้าง City Data Platform (CDP) ก่อนซื้อเซ็นเซอร์ — สถาปัตยกรรมข้อมูลก่อน IoT",
      stepZh: "先建城市数据平台（CDP），再购买传感器——数据架构优先，物联网其次",
      worldExample: "Estonia's X-Road data platform connects 900+ institutions with 99.9% uptime, built for $10M total over 20 years",
      worldExampleTh: "แพลตฟอร์ม X-Road ของเอสโตเนียเชื่อม 900+ สถาบัน uptime 99.9% สร้างด้วยงบ $10M ตลอด 20 ปี",
      worldExampleZh: "爱沙尼亚X-Road数据平台连接900多个机构，正常运行率99.9%，20年总投入1000万美元",
      source: "e-Estonia / X-Road Documentation",
    },
  };

  steps.push(PILLAR_STEPS[w1]);

  // Step based on tier
  if (city.tier === "gamma") {
    steps.push({
      step: "Apply for depa Technical Assistance Grant (THB 1-50M) — build institutional capacity before seeking commercial finance",
      stepTh: "สมัครเงินช่วยเหลือทางเทคนิค depa (1-50 ล้านบาท) — สร้างศักยภาพสถาบันก่อนหาการเงินเชิงพาณิชย์",
      stepZh: "申请depa技术援助补助金（100万-5000万泰铢）——在寻求商业融资之前建立机构能力",
      worldExample: "Cambodia's Kep City used ASUS Project TA to build waste management capacity from zero — now has a functioning system",
      worldExampleTh: "เมืองเค็บของกัมพูชาใช้ TA จาก ASUS Project สร้างศักยภาพจัดการขยะจากศูนย์ — ตอนนี้มีระบบที่ทำงานได้",
      worldExampleZh: "柬埔寨贡布市利用ASUS项目技术援助从零建立废物管理能力——现已有运作中的系统",
      source: "UN-Habitat ASUS Phase II Inception Report",
    });
  } else if (city.tier === "beta") {
    steps.push({
      step: "Structure a blended finance vehicle — combine JICA/ADB concessional lending with BOI incentives for your first THB 500M+ smart infrastructure project",
      stepTh: "จัดโครงสร้างยานพาหนะการเงินผสมผสาน — ผสม JICA/ADB สินเชื่อผ่อนปรนกับสิทธิ BOI สำหรับโครงการโครงสร้างพื้นฐาน 500M+ แรก",
      stepZh: "构建混合融资载体——将JICA/亚开行优惠贷款与BOI激励相结合，用于首个5亿泰铢以上智慧基础设施项目",
      worldExample: "General Santos (Philippines) used IFC Apex Green Cities Programme loans for electric tricycle fleet modernization",
      worldExampleTh: "เจเนอรัลซานโตส (ฟิลิปปินส์) ใช้สินเชื่อ IFC Apex Green Cities สำหรับปรับปรุงฝูงรถสามล้อไฟฟ้า",
      worldExampleZh: "菲律宾南哥打巴托市使用IFC Apex绿色城市贷款现代化电动三轮车队",
      source: "ASUS Phase II / IFC Apex Green Cities",
    });
  } else {
    steps.push({
      step: "Issue a municipal green bond or pursue Land Value Capture around transit investments — you have the revenue base for commercial finance",
      stepTh: "ออกพันธบัตรสีเขียวเทศบาลหรือจับมูลค่าที่ดินรอบการลงทุนขนส่ง — คุณมีฐานรายได้สำหรับการเงินเชิงพาณิชย์",
      stepZh: "发行市政绿色债券或在交通投资周边推行土地增值捕获——你有商业融资的收入基础",
      worldExample: "Bangkok BTS/MRT corridors saw 300%+ land value increases — LVC could have funded the entire extension",
      worldExampleTh: "ระเบียง BTS/MRT กรุงเทพฯ มูลค่าที่ดินเพิ่ม 300%+ — LVC น่าจะระดมทุนสร้างส่วนต่อขยายทั้งหมดได้",
      worldExampleZh: "曼谷BTS/MRT走廊土地价值增长300%以上——土地增值捕获本可资助全部延伸线建设",
      source: "ADB Land Value Capture for Asian Cities Report",
    });
  }

  // Step based on reality
  if (city.reality === "planned") {
    steps.push({
      step: "Stop planning and start a minimum viable pilot — 3 sensors, 1 dashboard, 100 citizens. Prove the loop works before scaling",
      stepTh: "หยุดวางแผนแล้วเริ่มนำร่องขั้นต่ำ — 3 เซ็นเซอร์ 1 แดชบอร์ด 100 ประชาชน พิสูจน์ว่าลูปทำงานก่อนขยาย",
      stepZh: "停止规划，开始最小可行试点——3个传感器、1个仪表盘、100名市民。在扩大规模前验证循环有效",
      worldExample: "Amsterdam started with 200 smart projects, measured results, killed failures, and scaled only what worked",
      worldExampleTh: "อัมสเตอร์ดัมเริ่มกับ 200 โครงการอัจฉริยะ วัดผล ฆ่าสิ่งที่ล้มเหลว ขยายเฉพาะสิ่งที่ใช้ได้",
      worldExampleZh: "阿姆斯特丹从200个智慧项目起步，衡量结果，淘汰失败，只扩展有效的项目",
      source: "Amsterdam Smart City / Amsterdam Institute for Advanced Metropolitan Solutions",
    });
  }

  return steps;
}

// ─── FINANCING COMPETITIVENESS ───
// Different advice based on city's economic position

export interface FinancingAdvice {
  primaryInstrument: string;
  primaryInstrumentTh: string;
  primaryInstrumentZh: string;
  rationale: string;
  rationaleTh: string;
  rationaleZh: string;
  typicalSize: string;
  competitiveAdvantage: string;
  competitiveAdvantageTh: string;
  competitiveAdvantageZh: string;
}

export function getFinancingAdvice(city: SmartCity): FinancingAdvice {
  const gpp = city.metrics.gppPerCapita ?? 0;
  const ecoScore = city.scores.economy;
  const isEEC = city.region === "east";
  const isSouth = city.region === "south";
  const isTourism = city.scores.hospitality >= 75;

  if (gpp > 400000) {
    return {
      primaryInstrument: "Municipal Green Bond + Land Value Capture",
      primaryInstrumentTh: "พันธบัตรสีเขียวเทศบาล + จับมูลค่าที่ดิน",
      primaryInstrumentZh: "市政绿色债券 + 土地增值捕获",
      rationale: "High GPP (฿" + (gpp/1000).toFixed(0) + "K) signals strong tax base. Bond markets are accessible. LVC around transit can self-fund infrastructure.",
      rationaleTh: "GPP สูง (฿" + (gpp/1000).toFixed(0) + "K) บ่งชี้ฐานภาษีแข็ง ตลาดพันธบัตรเข้าถึงได้ LVC รอบขนส่งระดมทุนโครงสร้างพื้นฐานได้เอง",
      rationaleZh: "高GPP（฿" + (gpp/1000).toFixed(0) + "K）表明税基强劲。债券市场可进入。交通周边土地增值捕获可自筹基础设施资金。",
      typicalSize: "THB 1-20B",
      competitiveAdvantage: "Revenue base exceeds most Thai cities. Can attract ESG investors directly.",
      competitiveAdvantageTh: "ฐานรายได้สูงกว่าเมืองไทยส่วนใหญ่ ดึงดูดนักลงทุน ESG ได้โดยตรง",
      competitiveAdvantageZh: "收入基础超过大多数泰国城市。可直接吸引ESG投资者。",
    };
  }

  if (isEEC) {
    return {
      primaryInstrument: "BOI S-Curve Incentives + PPP",
      primaryInstrumentTh: "สิทธิประโยชน์ BOI S-Curve + PPP",
      primaryInstrumentZh: "BOI S曲线激励 + 公私合营",
      rationale: "EEC zone gives automatic 8-year CIT exemption + import duty waiver. Use this to attract private smart infrastructure operators.",
      rationaleTh: "เขต EEC ให้ยกเว้น CIT 8 ปี + ยกเว้นอากรนำเข้าอัตโนมัติ ใช้ดึงผู้ประกอบการโครงสร้างพื้นฐานอัจฉริยะเอกชน",
      rationaleZh: "EEC区域自动享有8年企业所得税豁免+进口关税豁免。利用此吸引私营智慧基础设施运营商。",
      typicalSize: "THB 200M - 5B",
      competitiveAdvantage: "EEC adjacency + BOI S-Curve = strongest investment incentive package in Thailand.",
      competitiveAdvantageTh: "ใกล้ EEC + BOI S-Curve = แพ็คเกจจูงใจการลงทุนแข็งแกร่งที่สุดในไทย",
      competitiveAdvantageZh: "毗邻EEC + BOI S曲线 = 泰国最强投资激励组合。",
    };
  }

  if (isTourism && isSouth) {
    return {
      primaryInstrument: "ACGF Green Finance + Tourism Levy Reinvestment",
      primaryInstrumentTh: "ACGF การเงินสีเขียว + การลงทุนซ้ำจากค่าธรรมเนียมท่องเที่ยว",
      primaryInstrumentZh: "ACGF绿色融资 + 旅游税再投资",
      rationale: "Tourism revenue creates a natural reinvestment stream. ACGF (ADB) specifically targets climate-resilient infrastructure in ASEAN tourism cities.",
      rationaleTh: "รายได้ท่องเที่ยวสร้างกระแสลงทุนซ้ำตามธรรมชาติ ACGF (ADB) เน้นโครงสร้างพื้นฐานทนภูมิอากาศในเมืองท่องเที่ยวอาเซียนโดยเฉพาะ",
      rationaleZh: "旅游收入创造自然再投资流。ACGF（亚开行）专门针对东盟旅游城市的气候韧性基础设施。",
      typicalSize: "THB 100M - 2B",
      competitiveAdvantage: "Andaman/Gulf tourism brand attracts climate finance that inland cities cannot access.",
      competitiveAdvantageTh: "แบรนด์ท่องเที่ยวอันดามัน/อ่าวดึงดูด climate finance ที่เมืองภายในเข้าไม่ถึง",
      competitiveAdvantageZh: "安达曼/海湾旅游品牌吸引内陆城市无法获得的气候融资。",
    };
  }

  if (ecoScore < 50) {
    return {
      primaryInstrument: "depa Smart City Fund + JICA Technical Cooperation",
      primaryInstrumentTh: "กองทุน depa Smart City + ความร่วมมือทางเทคนิค JICA",
      primaryInstrumentZh: "depa智慧城市基金 + JICA技术合作",
      rationale: "Economy score below 50 means commercial finance is premature. Start with grants and TA to build the project pipeline and institutional capacity.",
      rationaleTh: "คะแนนเศรษฐกิจต่ำกว่า 50 หมายความว่าการเงินเชิงพาณิชย์ยังเร็วเกินไป เริ่มจากเงินช่วยเหลือและ TA เพื่อสร้างท่อโครงการและศักยภาพสถาบัน",
      rationaleZh: "经济得分低于50意味着商业融资为时尚早。先从补助金和技术援助开始，建立项目管线和机构能力。",
      typicalSize: "THB 5-200M",
      competitiveAdvantage: "Lower cost base and less competition than Bangkok/EEC — pilot projects here cost 3-5x less.",
      competitiveAdvantageTh: "ฐานต้นทุนต่ำกว่าและแข่งขันน้อยกว่ากรุงเทพฯ/EEC — โครงการนำร่องที่นี่ถูกกว่า 3-5 เท่า",
      competitiveAdvantageZh: "比曼谷/EEC成本更低、竞争更少——此处试点项目成本便宜3-5倍。",
    };
  }

  return {
    primaryInstrument: "Blended Finance + BOI Incentives",
    primaryInstrumentTh: "การเงินผสมผสาน + สิทธิประโยชน์ BOI",
    primaryInstrumentZh: "混合融资 + BOI激励",
    rationale: "Mid-range economy needs blended approach: concessional DFI lending (JICA/ADB) de-risks the project for private co-investors. BOI S-Curve applies.",
    rationaleTh: "เศรษฐกิจระดับกลางต้องการแนวทางผสม: สินเชื่อ DFI ผ่อนปรน (JICA/ADB) ลดความเสี่ยงให้ผู้ร่วมลงทุนเอกชน BOI S-Curve ใช้ได้",
    rationaleZh: "中等经济水平需要混合方式：优惠开发金融机构贷款（JICA/亚开行）为私人共同投资者降低风险。BOI S曲线适用。",
    typicalSize: "THB 100M - 2B",
    competitiveAdvantage: "Strong enough for private interest, early enough for concessional rates. Best of both worlds.",
    competitiveAdvantageTh: "แข็งแกร่งพอสำหรับเอกชนสนใจ เร็วพอสำหรับอัตราผ่อนปรน ดีที่สุดจากทั้งสองโลก",
    competitiveAdvantageZh: "足够强大以吸引私人兴趣，足够早以获得优惠利率。两全其美。",
  };
}

// ─── MONEYBALL INVESTMENT PROFILE ───
// Why an investor should look at THIS city instead of Bangkok/Phuket/Chiang Mai

export interface MoneyballEdge {
  label: string;
  labelTh: string;
  labelZh: string;
  value: string;
  valueTh: string;
  valueZh: string;
  advantage: boolean; // true = beats the Big 3 average
}

export interface MoneyballProfile {
  edges: MoneyballEdge[];
  headline: string;
  headlineTh: string;
  headlineZh: string;
}

// Big 3 benchmarks (Bangkok/Phuket/Chiang Mai averages)
const BIG3_AVG = { gpp: 429000, pm25: 32.2, crime: 208, beds: 33, green: 41 };

export function getMoneyballProfile(city: SmartCity): MoneyballProfile {
  const gpp = city.metrics.gppPerCapita ?? 0;
  const pm = city.metrics.pm25Annual ?? 25;
  const crime = city.metrics.crimeRatePer100k ?? 150;
  const beds = city.metrics.hospitalBedsPer10k ?? 20;
  const green = city.metrics.greenCoverage ?? 30;
  const isEEC = city.region === "east";
  const hasBOI = city.scores.economy >= 50;

  const edges: MoneyballEdge[] = [];

  // Air quality edge
  if (pm < BIG3_AVG.pm25) {
    edges.push({
      label: "Cleaner air",
      labelTh: "อากาศสะอาดกว่า",
      labelZh: "空气更洁净",
      value: `PM2.5 ${pm} vs Big 3 avg ${BIG3_AVG.pm25}`,
      valueTh: `PM2.5 ${pm} เทียบกับค่าเฉลี่ย 3 เมืองใหญ่ที่ ${BIG3_AVG.pm25}`,
      valueZh: `PM2.5 为 ${pm}，低于三大核心城市均值 ${BIG3_AVG.pm25}`,
      advantage: true
    });
  }

  // Safety edge
  if (crime < BIG3_AVG.crime) {
    edges.push({
      label: "Lower crime",
      labelTh: "อาชญากรรมต่ำกว่า",
      labelZh: "犯罪率更低",
      value: `${crime}/100K vs Big 3 avg ${BIG3_AVG.crime}`,
      valueTh: `${crime} ต่อแสนคน เทียบกับค่าเฉลี่ย 3 เมืองใหญ่ที่ ${BIG3_AVG.crime}`,
      valueZh: `十万人犯罪率为 ${crime}，低于三大核心城市均值 ${BIG3_AVG.crime}`,
      advantage: true
    });
  }

  // Green coverage edge
  if (green > BIG3_AVG.green) {
    edges.push({
      label: "More green space",
      labelTh: "พื้นที่สีเขียวมากกว่า",
      labelZh: "绿化率更高",
      value: `${green}% vs Big 3 avg ${BIG3_AVG.green}%`,
      valueTh: `${green}% เทียบกับค่าเฉลี่ย 3 เมืองใหญ่ที่ ${BIG3_AVG.green}%`,
      valueZh: `绿化覆盖率为 ${green}%，高于三大核心城市均值 ${BIG3_AVG.green}%`,
      advantage: true
    });
  }

  // Healthcare edge
  if (beds > 20) {
    edges.push({
      label: "Healthcare access",
      labelTh: "เข้าถึงสาธารณสุข",
      labelZh: "医疗保障更佳",
      value: `${beds} beds/10K`,
      valueTh: `${beds} เตียงต่อหมื่นประชากร`,
      valueZh: `每万人床位数为 ${beds} 张`,
      advantage: beds >= BIG3_AVG.beds
    });
  }

  // BOI incentive edge
  if (hasBOI) {
    const boiYears = isEEC ? "8-15 year CIT exemption (EEC zone)" : "3-8 year CIT exemption (S-Curve)";
    const boiYearsTh = isEEC ? "ยกเว้น CIT 8-15 ปี (เขต EEC)" : "ยกเว้น CIT 3-8 ปี (S-Curve)";
    const boiYearsZh = isEEC ? "免征企业所得税 8-15 年（EEC 特区）" : "免征企业所得税 3-8 年（S曲线产业）";
    edges.push({
      label: "BOI tax incentive",
      labelTh: "สิทธิประโยชน์ภาษี BOI",
      labelZh: "BOI 税收优惠",
      value: boiYears,
      valueTh: boiYearsTh,
      valueZh: boiYearsZh,
      advantage: true
    });
  }

  // Cost advantage (lower GPP = lower labor/rent costs)
  if (gpp > 0 && gpp < 200000) {
    edges.push({
      label: "Lower operating costs",
      labelTh: "ต้นทุนดำเนินการต่ำกว่า",
      labelZh: "运营成本更低",
      value: `GPP ฿${(gpp/1000).toFixed(0)}K — labor and rent 2-4x cheaper than Bangkok`,
      valueTh: `GPP ฿${(gpp/1000).toFixed(0)}K — ค่าแรงและค่าเช่าถูกกว่ากรุงเทพฯ 2-4 เท่า`,
      valueZh: `人均GPP为 ฿${(gpp/1000).toFixed(0)}K——劳动力和租金成本比曼谷便宜 2-4 倍`,
      advantage: true
    });
  }

  // University pipeline
  const hasUni = city.id.includes("cmu") || city.id.includes("phitsanulok") || city.id === "khon-kaen" || city.id === "korat" || city.id === "samyan" || city.id === "chiang-rai" || city.id === "ubon";
  if (hasUni) {
    edges.push({
      label: "University talent pipeline",
      labelTh: "สายพานบุคลากรจากมหาวิทยาลัย",
      labelZh: "高校人才输送",
      value: "Local university provides graduate recruitment pool",
      valueTh: "มหาวิทยาลัยในท้องถิ่นเป็นแหล่งสรรหาบัณฑิตจบใหม่",
      valueZh: "本地大学可直接提供优秀的毕业生人才池",
      advantage: true
    });
  }

  // Digital readiness
  if (city.scores.digital >= 55) {
    edges.push({
      label: "Digital infrastructure ready",
      labelTh: "โครงสร้างพื้นฐานดิจิทัลพร้อม",
      labelZh: "数字基础设施就绪",
      value: `Digital score ${city.scores.digital}/100 — IoT, data platforms operational`,
      valueTh: `คะแนนดิจิทัล ${city.scores.digital}/100 — IoT และแพลตฟอร์มข้อมูลเปิดใช้งานจริง`,
      valueZh: `数字得分 ${city.scores.digital}/100——物联网及数据平台均已投入运行`,
      advantage: true
    });
  }

  // Hospitality/tourism edge
  if (city.scores.hospitality >= 75 && city.id !== "phuket" && city.id !== "chiang-mai-old-town") {
    edges.push({
      label: "Tourism economy without Big 3 competition",
      labelTh: "เศรษฐกิจท่องเที่ยวโดยไม่แข่งกับ Big 3",
      labelZh: "避开三大核心城市竞争的旅游经济",
      value: `Hospitality ${city.scores.hospitality}/100 — strong but less saturated market`,
      valueTh: `คะแนนต้อนรับ ${city.scores.hospitality}/100 — ตลาดแข็งแกร่งแต่ยังไม่ล้นตัว`,
      valueZh: `文旅得分 ${city.scores.hospitality}/100——市场强劲且尚未饱和`,
      advantage: true
    });
  }

  // Generate headline
  const edgeCount = edges.filter(e => e.advantage).length;
  let headline = "";
  let headlineTh = "";
  let headlineZh = "";

  if (edgeCount >= 5) {
    headline = `${edgeCount} advantages over Bangkok/Phuket/Chiang Mai. This is a moneyball city — undervalued by the market, strong on fundamentals.`;
    headlineTh = `${edgeCount} ข้อได้เปรียบเหนือกรุงเทพฯ/ภูเก็ต/เชียงใหม่ นี่คือเมือง moneyball — ตลาดประเมินต่ำ แต่พื้นฐานแข็ง`;
    headlineZh = `相较于曼谷/普吉/清迈拥有 ${edgeCount} 项优势。这是一座典型的“点球成金”式城市——被市场低估，但基本面极其扎实。`;
  } else if (edgeCount >= 3) {
    headline = `${edgeCount} clear edges. Not the obvious choice, but the smart one — lower cost, less competition, real infrastructure.`;
    headlineTh = `${edgeCount} จุดแข็งชัด ไม่ใช่ตัวเลือกที่เห็นชัด แต่เป็นตัวเลือกที่ฉลาด — ต้นทุนต่ำ แข่งขันน้อย โครงสร้างพื้นฐานจริง`;
    headlineZh = `具备 ${edgeCount} 项明确优势。虽然不是最显眼的选择，但绝对是明智之选——成本更低、竞争更少、基础设施扎实。`;
  } else if (edgeCount >= 1) {
    headline = `Niche opportunity. Specific advantages in ${edges.filter(e => e.advantage).map(e => e.label.toLowerCase()).join(", ")}. Not for every investor, but right for the right one.`;
    headlineTh = `โอกาสเฉพาะทาง จุดแข็งเฉพาะด้าน ไม่ใช่สำหรับทุกนักลงทุน แต่ใช่สำหรับคนที่ใช่`;
    headlineZh = `利基市场机遇。在特定领域具备独特优势。并非适合所有投资者，但完美契合对口资本的需求。`;
  } else {
    headline = `Early-stage opportunity. Fundamentals still building. Best suited for impact investors and development finance, not commercial returns yet.`;
    headlineTh = `โอกาสระยะเริ่มต้น พื้นฐานยังอยู่ระหว่างสร้าง เหมาะกับนักลงทุนเพื่อผลกระทบและการเงินเพื่อพัฒนา ยังไม่ใช่ผลตอบแทนเชิงพาณิชย์`;
    headlineZh = `早期投资机遇。基本面仍在构建中。最适合影响力投资者和开发性金融机构，目前尚不适合追求商业回报的资金。`;
  }

  return { edges, headline, headlineTh, headlineZh };
}
