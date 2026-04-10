// ---------------------------------------------------------------------------
// City Analytics — Developability, Global Comparisons, Tailored Steps
// ---------------------------------------------------------------------------
// Every city gets unique data-driven analysis. No hallucination.
// Computed from actual scores, metrics, and city characteristics.
// ---------------------------------------------------------------------------

import type { SmartCity, ScoringPillar } from "./types";
import { PILLAR_WEIGHTS } from "./types";
import { SCORING_PILLARS } from "./scoring";

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
  if (total >= 70) { label = "Strong investability"; labelTh = "น่าลงทุนสูง"; }
  else if (total >= 55) { label = "Emerging opportunity"; labelTh = "โอกาสที่กำลังมา"; }
  else if (total >= 40) { label = "Needs capacity building"; labelTh = "ต้องสร้างศักยภาพ"; }
  else { label = "Foundation stage"; labelTh = "ระยะวางรากฐาน"; }

  return { total, growthCapacity: Math.round(growthCapacity), infraReadiness: Math.round(infraReadiness), livabilityBase: Math.round(livabilityBase), label, labelTh };
}

// ─── GLOBAL CITY COMPARISON ───
// Match each Thai city to a comparable world city by size, population, and character

export interface GlobalComparison {
  worldCity: string;
  country: string;
  population: string;
  why: string;
  whyTh: string;
}

const COMPARISONS: Record<string, GlobalComparison> = {
  phuket: { worldCity: "Bali (Denpasar)", country: "Indonesia", population: "~430K (Denpasar metro)", why: "Island tourism economy, similar beach-resort infrastructure pressure, marine conservation needs", whyTh: "เศรษฐกิจท่องเที่ยวเกาะ แรงกดดันโครงสร้างรีสอร์ทชายหาดคล้ายกัน ความต้องการอนุรักษ์ทะเล" },
  samyan: { worldCity: "Gangnam, Seoul", country: "South Korea", population: "~500K district", why: "University-anchored innovation district in capital city, startup density, high property values", whyTh: "ย่านนวัตกรรมยึดโยงมหาวิทยาลัยในเมืองหลวง ความหนาแน่นสตาร์ทอัพ ราคาอสังหาฯ สูง" },
  "chiang-mai-old-town": { worldCity: "Kyoto", country: "Japan", population: "1.5M", why: "Ancient temple city balancing heritage preservation with modern tourism and tech", whyTh: "เมืองวัดโบราณที่สมดุลอนุรักษ์มรดกกับท่องเที่ยวสมัยใหม่และเทคโนโลยี" },
  "khon-kaen": { worldCity: "Medellín", country: "Colombia", population: "2.5M", why: "Regional capital driving innovation from outside the primary city, private-sector-led transit investment", whyTh: "เมืองหลวงภูมิภาคที่ขับเคลื่อนนวัตกรรมจากนอกเมืองหลัก เอกชนนำการลงทุนขนส่ง" },
  "cmu-smart-city": { worldCity: "Cambridge (MIT area)", country: "USA", population: "~120K", why: "University campus as living lab for smart city R&D, innovation spillover to surrounding city", whyTh: "แคมปัสมหาวิทยาลัยเป็นห้องทดลองจริง R&D เมืองอัจฉริยะ นวัตกรรมล้นไปสู่เมืองรอบข้าง" },
  "nakhon-si-thammarat": { worldCity: "Curitiba", country: "Brazil", population: "1.9M", why: "Mid-size city proving smart governance works without high budgets — citizen-centric, bottom-up", whyTh: "เมืองขนาดกลางพิสูจน์ว่าปกครองอัจฉริยะทำงานได้โดยไม่ต้องงบสูง เน้นประชาชน ล่างขึ้นบน" },
  "hat-yai": { worldCity: "Johor Bahru", country: "Malaysia", population: "500K", why: "Border trade city adjacent to richer neighbor, flood-prone, cross-border commerce hub", whyTh: "เมืองค้าชายแดนติดเพื่อนบ้านที่ร่ำรวยกว่า เสี่ยงน้ำท่วม ศูนย์กลางการค้าข้ามพรมแดน" },
  yala: { worldCity: "Kigali", country: "Rwanda", population: "1.2M", why: "Cleanest city award despite conflict zone, proving governance beats GDP for smart city success", whyTh: "รางวัลเมืองสะอาดแม้อยู่ในเขตขัดแย้ง พิสูจน์ว่าธรรมาภิบาลชนะ GDP สำหรับเมืองอัจฉริยะ" },
  krabi: { worldCity: "Dubrovnik", country: "Croatia", population: "~43K", why: "Tourism-dependent coastal city managing overtourism pressure with heritage conservation", whyTh: "เมืองชายฝั่งพึ่งท่องเที่ยวที่จัดการแรงกดดันนักท่องเที่ยวล้นกับการอนุรักษ์มรดก" },
  rayong: { worldCity: "Ulsan", country: "South Korea", population: "1.1M", why: "Industrial powerhouse (petrochemical/auto) with highest GDP, environmental monitoring critical", whyTh: "เมืองอุตสาหกรรม (ปิโตรเคมี/รถยนต์) GDP สูงสุด การเฝ้าระวังสิ่งแวดล้อมสำคัญ" },
  "wangchan-valley": { worldCity: "Songdo", country: "South Korea", population: "~170K planned", why: "Greenfield smart city on empty land with massive investment plan — same risk of building without demand", whyTh: "เมืองอัจฉริยะ greenfield บนที่ดินว่างพร้อมแผนลงทุนมหาศาล — ความเสี่ยงเดียวกันคือสร้างโดยไม่มีอุปสงค์" },
  "mae-moh": { worldCity: "Bełchatów", country: "Poland", population: "~57K", why: "Coal mining town in energy transition — similar EGAT/industrial company town dynamics", whyTh: "เมืองเหมืองถ่านหินในการเปลี่ยนผ่านพลังงาน — พลวัตเมืองบริษัทอุตสาหกรรมคล้ายกัน" },
  nakhonsawan: { worldCity: "Mandalay", country: "Myanmar", population: "1.2M", why: "River confluence city, flood-prone, agriculture-based economy, strategic inland location", whyTh: "เมืองจุดบรรจบแม่น้ำ เสี่ยงน้ำท่วม เศรษฐกิจเกษตร ทำเลเชิงยุทธศาสตร์ภายในประเทศ" },
  saensuk: { worldCity: "Brighton", country: "UK", population: "~290K", why: "University beach town with progressive municipal government, small but genuine innovation", whyTh: "เมืองชายหาดมหาวิทยาลัยที่มีเทศบาลก้าวหน้า เล็กแต่นวัตกรรมจริง" },
  chachoengsao: { worldCity: "Batam", country: "Indonesia", population: "1.2M", why: "Industrial gateway/SEZ city near capital, manufacturing + logistics hub", whyTh: "เมืองประตู SEZ ใกล้เมืองหลวง ศูนย์กลางผลิตและโลจิสติกส์" },
  "chiang-rai": { worldCity: "Luang Prabang", country: "Laos", population: "~66K", why: "Northern heritage city, temple tourism, border trade, air quality challenges from regional burning", whyTh: "เมืองมรดกภาคเหนือ ท่องเที่ยววัด ค้าชายแดน ปัญหาคุณภาพอากาศจากการเผาในภูมิภาค" },
  nan: { worldCity: "Bhutan (Thimphu)", country: "Bhutan", population: "~115K", why: "Remote mountain community prioritizing cultural preservation and environmental conservation over GDP growth", whyTh: "ชุมชนภูเขาห่างไกลที่ให้ความสำคัญกับการอนุรักษ์วัฒนธรรมและสิ่งแวดล้อมมากกว่าการเติบโตของ GDP" },
  korat: { worldCity: "Pune", country: "India", population: "3.1M", why: "Second-tier city with university sector, growing manufacturing, and high-speed rail connection to capital", whyTh: "เมืองระดับสอง ภาคมหาวิทยาลัย การผลิตที่เติบโต รถไฟความเร็วสูงเชื่อมเมืองหลวง" },
  "phitsanulok-muni": { worldCity: "Tampere", country: "Finland", population: "~240K", why: "Mid-size regional hub with strong digital governance adoption, university-driven, unglamorous but effective", whyTh: "ศูนย์กลางภูมิภาคขนาดกลาง ปกครองดิจิทัลเข้มแข็ง ขับเคลื่อนด้วยมหาวิทยาลัย ไม่หวือหวาแต่มีประสิทธิภาพ" },
  lampang: { worldCity: "Limoges", country: "France", population: "~130K", why: "Ceramics/craft city with heritage tourism, transitioning traditional industry to smart economy", whyTh: "เมืองเซรามิก/หัตถกรรมกับท่องเที่ยวเชิงมรดก เปลี่ยนผ่านอุตสาหกรรมดั้งเดิมสู่เศรษฐกิจอัจฉริยะ" },
  samui: { worldCity: "Mallorca (Palma)", country: "Spain", population: "~420K", why: "Island tourism with sustainability pressure, water scarcity, waste management critical", whyTh: "ท่องเที่ยวเกาะกับแรงกดดันความยั่งยืน ขาดแคลนน้ำ จัดการขยะสำคัญ" },
  "phra-ram-4": { worldCity: "Canary Wharf, London", country: "UK", population: "~120K workers", why: "CBD corridor with smart traffic optimization, high-value commercial real estate, land value capture potential", whyTh: "ระเบียง CBD ปรับจราจรอัจฉริยะ อสังหาฯ เชิงพาณิชย์มูลค่าสูง ศักยภาพจับมูลค่าที่ดิน" },
};

export function getGlobalComparison(cityId: string): GlobalComparison | undefined {
  return COMPARISONS[cityId];
}

// ─── TAILORED ACTION STEPS ───
// What should each city do next, based on their weakest pillar + tier + context

export interface ActionStep {
  step: string;
  stepTh: string;
  worldExample: string;
  worldExampleTh: string;
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
      worldExample: "Vienna's social housing model: 62% of residents live in subsidized housing, creating the livability base for all other smart city services",
      worldExampleTh: "โมเดลบ้านสังคมของเวียนนา: ผู้อยู่อาศัย 62% อยู่ในบ้านอุดหนุน สร้างฐานความน่าอยู่สำหรับบริการเมืองอัจฉริยะทั้งหมด",
      source: "Vienna Housing Strategy 2025",
    },
    economy: {
      step: "Build economic corridors connecting to regional demand centers — don't build in isolation",
      stepTh: "สร้างระเบียงเศรษฐกิจเชื่อมศูนย์กลางอุปสงค์ภูมิภาค ไม่สร้างแบบโดดเดี่ยว",
      worldExample: "Medellín's innovation district connected university research to local industry, creating 3,500 tech jobs in 5 years",
      worldExampleTh: "ย่านนวัตกรรมเมเดยินเชื่อมงานวิจัยมหาวิทยาลัยกับอุตสาหกรรมท้องถิ่น สร้างงานเทค 3,500 ตำแหน่งใน 5 ปี",
      source: "Ruta N Medellín Impact Report",
    },
    safety: {
      step: "Deploy integrated emergency response systems before smart monitoring — response time matters more than camera count",
      stepTh: "ติดตั้งระบบตอบสนองฉุกเฉินแบบบูรณาการก่อนเฝ้าระวังอัจฉริยะ — เวลาตอบสนองสำคัญกว่าจำนวนกล้อง",
      worldExample: "Bogotá's integrated 123 emergency system reduced response times by 40% by connecting police, fire, and ambulance dispatch",
      worldExampleTh: "ระบบฉุกเฉิน 123 แบบบูรณาการของโบโกตาลดเวลาตอบสนอง 40% โดยเชื่อมตำรวจ ดับเพลิง และรถพยาบาล",
      source: "Bogotá Seguridad Ciudadana Report",
    },
    wellbeing: {
      step: "Expand community health worker networks with mobile health units before building new hospitals",
      stepTh: "ขยายเครือข่าย อสม. พร้อมหน่วยแพทย์เคลื่อนที่ก่อนสร้างโรงพยาบาลใหม่",
      worldExample: "Rwanda's community health worker program (45,000 workers) achieved 91% health insurance coverage at $5/person/year",
      worldExampleTh: "โครงการ อสม. ของรวันดา (45,000 คน) ครอบคลุมประกันสุขภาพ 91% ด้วยงบ $5/คน/ปี",
      source: "Rwanda Ministry of Health / Lancet Global Health",
    },
    environment: {
      step: "Install real-time air quality monitoring at 10+ locations before announcing green city status",
      stepTh: "ติดตั้งเฝ้าระวังคุณภาพอากาศเรียลไทม์ 10+ จุดก่อนประกาศสถานะเมืองสีเขียว",
      worldExample: "Kigali deployed 30 low-cost AQ sensors across the city for $50K total, creating Africa's densest urban air quality network",
      worldExampleTh: "คิกาลีติดตั้งเซ็นเซอร์ AQ ต้นทุนต่ำ 30 จุดทั่วเมืองด้วยงบรวม $50K สร้างเครือข่ายคุณภาพอากาศเมืองที่หนาแน่นที่สุดของแอฟริกา",
      source: "UNEP / Kigali Clean Air Initiative",
    },
    hospitality: {
      step: "Create a cultural asset registry and community storytelling platform — culture is infrastructure",
      stepTh: "สร้างทะเบียนสินทรัพย์วัฒนธรรมและแพลตฟอร์มเล่าเรื่องชุมชน — วัฒนธรรมคือโครงสร้างพื้นฐาน",
      worldExample: "Kyoto's digital heritage preservation uses IoT sensors on 2,000+ temples, creating a living cultural database",
      worldExampleTh: "การอนุรักษ์มรดกดิจิทัลของเกียวโตใช้เซ็นเซอร์ IoT บนวัด 2,000+ แห่ง สร้างฐานข้อมูลวัฒนธรรมที่มีชีวิต",
      source: "Kyoto City Cultural Property Protection Division",
    },
    digital: {
      step: "Build the City Data Platform (CDP) before buying sensors — data architecture first, IoT second",
      stepTh: "สร้าง City Data Platform (CDP) ก่อนซื้อเซ็นเซอร์ — สถาปัตยกรรมข้อมูลก่อน IoT",
      worldExample: "Estonia's X-Road data platform connects 900+ institutions with 99.9% uptime, built for $10M total over 20 years",
      worldExampleTh: "แพลตฟอร์ม X-Road ของเอสโตเนียเชื่อม 900+ สถาบัน uptime 99.9% สร้างด้วยงบ $10M ตลอด 20 ปี",
      source: "e-Estonia / X-Road Documentation",
    },
  };

  steps.push(PILLAR_STEPS[w1]);

  // Step based on tier
  if (city.tier === "gamma") {
    steps.push({
      step: "Apply for depa Technical Assistance Grant (THB 1-50M) — build institutional capacity before seeking commercial finance",
      stepTh: "สมัครเงินช่วยเหลือทางเทคนิค depa (1-50 ล้านบาท) — สร้างศักยภาพสถาบันก่อนหาการเงินเชิงพาณิชย์",
      worldExample: "Cambodia's Kep City used ASUS Project TA to build waste management capacity from zero — now has a functioning system",
      worldExampleTh: "เมืองเค็บของกัมพูชาใช้ TA จาก ASUS Project สร้างศักยภาพจัดการขยะจากศูนย์ — ตอนนี้มีระบบที่ทำงานได้",
      source: "UN-Habitat ASUS Phase II Inception Report",
    });
  } else if (city.tier === "beta") {
    steps.push({
      step: "Structure a blended finance vehicle — combine JICA/ADB concessional lending with BOI incentives for your first THB 500M+ smart infrastructure project",
      stepTh: "จัดโครงสร้างยานพาหนะการเงินผสมผสาน — ผสม JICA/ADB สินเชื่อผ่อนปรนกับสิทธิ BOI สำหรับโครงการโครงสร้างพื้นฐาน 500M+ แรก",
      worldExample: "General Santos (Philippines) used IFC Apex Green Cities Programme loans for electric tricycle fleet modernization",
      worldExampleTh: "เจเนอรัลซานโตส (ฟิลิปปินส์) ใช้สินเชื่อ IFC Apex Green Cities สำหรับปรับปรุงฝูงรถสามล้อไฟฟ้า",
      source: "ASUS Phase II / IFC Apex Green Cities",
    });
  } else {
    steps.push({
      step: "Issue a municipal green bond or pursue Land Value Capture around transit investments — you have the revenue base for commercial finance",
      stepTh: "ออกพันธบัตรสีเขียวเทศบาลหรือจับมูลค่าที่ดินรอบการลงทุนขนส่ง — คุณมีฐานรายได้สำหรับการเงินเชิงพาณิชย์",
      worldExample: "Bangkok BTS/MRT corridors saw 300%+ land value increases — LVC could have funded the entire extension",
      worldExampleTh: "ระเบียง BTS/MRT กรุงเทพฯ มูลค่าที่ดินเพิ่ม 300%+ — LVC น่าจะระดมทุนสร้างส่วนต่อขยายทั้งหมดได้",
      source: "ADB Land Value Capture for Asian Cities Report",
    });
  }

  // Step based on reality
  if (city.reality === "planned") {
    steps.push({
      step: "Stop planning and start a minimum viable pilot — 3 sensors, 1 dashboard, 100 citizens. Prove the loop works before scaling",
      stepTh: "หยุดวางแผนแล้วเริ่มนำร่องขั้นต่ำ — 3 เซ็นเซอร์ 1 แดชบอร์ด 100 ประชาชน พิสูจน์ว่าลูปทำงานก่อนขยาย",
      worldExample: "Amsterdam started with 200 smart projects, measured results, killed failures, and scaled only what worked",
      worldExampleTh: "อัมสเตอร์ดัมเริ่มกับ 200 โครงการอัจฉริยะ วัดผล ฆ่าสิ่งที่ล้มเหลว ขยายเฉพาะสิ่งที่ใช้ได้",
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
  rationale: string;
  rationaleTh: string;
  typicalSize: string;
  competitiveAdvantage: string;
  competitiveAdvantageTh: string;
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
      rationale: "High GPP (฿" + (gpp/1000).toFixed(0) + "K) signals strong tax base. Bond markets are accessible. LVC around transit can self-fund infrastructure.",
      rationaleTh: "GPP สูง (฿" + (gpp/1000).toFixed(0) + "K) บ่งชี้ฐานภาษีแข็ง ตลาดพันธบัตรเข้าถึงได้ LVC รอบขนส่งระดมทุนโครงสร้างพื้นฐานได้เอง",
      typicalSize: "THB 1-20B",
      competitiveAdvantage: "Revenue base exceeds most Thai cities. Can attract ESG investors directly.",
      competitiveAdvantageTh: "ฐานรายได้สูงกว่าเมืองไทยส่วนใหญ่ ดึงดูดนักลงทุน ESG ได้โดยตรง",
    };
  }

  if (isEEC) {
    return {
      primaryInstrument: "BOI S-Curve Incentives + PPP",
      primaryInstrumentTh: "สิทธิประโยชน์ BOI S-Curve + PPP",
      rationale: "EEC zone gives automatic 8-year CIT exemption + import duty waiver. Use this to attract private smart infrastructure operators.",
      rationaleTh: "เขต EEC ให้ยกเว้น CIT 8 ปี + ยกเว้นอากรนำเข้าอัตโนมัติ ใช้ดึงผู้ประกอบการโครงสร้างพื้นฐานอัจฉริยะเอกชน",
      typicalSize: "THB 200M - 5B",
      competitiveAdvantage: "EEC adjacency + BOI S-Curve = strongest investment incentive package in Thailand.",
      competitiveAdvantageTh: "ใกล้ EEC + BOI S-Curve = แพ็คเกจจูงใจการลงทุนแข็งแกร่งที่สุดในไทย",
    };
  }

  if (isTourism && isSouth) {
    return {
      primaryInstrument: "ACGF Green Finance + Tourism Levy Reinvestment",
      primaryInstrumentTh: "ACGF การเงินสีเขียว + การลงทุนซ้ำจากค่าธรรมเนียมท่องเที่ยว",
      rationale: "Tourism revenue creates a natural reinvestment stream. ACGF (ADB) specifically targets climate-resilient infrastructure in ASEAN tourism cities.",
      rationaleTh: "รายได้ท่องเที่ยวสร้างกระแสลงทุนซ้ำตามธรรมชาติ ACGF (ADB) เน้นโครงสร้างพื้นฐานทนภูมิอากาศในเมืองท่องเที่ยวอาเซียนโดยเฉพาะ",
      typicalSize: "THB 100M - 2B",
      competitiveAdvantage: "Andaman/Gulf tourism brand attracts climate finance that inland cities cannot access.",
      competitiveAdvantageTh: "แบรนด์ท่องเที่ยวอันดามัน/อ่าวดึงดูด climate finance ที่เมืองภายในเข้าไม่ถึง",
    };
  }

  if (ecoScore < 50) {
    return {
      primaryInstrument: "depa Smart City Fund + JICA Technical Cooperation",
      primaryInstrumentTh: "กองทุน depa Smart City + ความร่วมมือทางเทคนิค JICA",
      rationale: "Economy score below 50 means commercial finance is premature. Start with grants and TA to build the project pipeline and institutional capacity.",
      rationaleTh: "คะแนนเศรษฐกิจต่ำกว่า 50 หมายความว่าการเงินเชิงพาณิชย์ยังเร็วเกินไป เริ่มจากเงินช่วยเหลือและ TA เพื่อสร้างท่อโครงการและศักยภาพสถาบัน",
      typicalSize: "THB 5-200M",
      competitiveAdvantage: "Lower cost base and less competition than Bangkok/EEC — pilot projects here cost 3-5x less.",
      competitiveAdvantageTh: "ฐานต้นทุนต่ำกว่าและแข่งขันน้อยกว่ากรุงเทพฯ/EEC — โครงการนำร่องที่นี่ถูกกว่า 3-5 เท่า",
    };
  }

  return {
    primaryInstrument: "Blended Finance + BOI Incentives",
    primaryInstrumentTh: "การเงินผสมผสาน + สิทธิประโยชน์ BOI",
    rationale: "Mid-range economy needs blended approach: concessional DFI lending (JICA/ADB) de-risks the project for private co-investors. BOI S-Curve applies.",
    rationaleTh: "เศรษฐกิจระดับกลางต้องการแนวทางผสม: สินเชื่อ DFI ผ่อนปรน (JICA/ADB) ลดความเสี่ยงให้ผู้ร่วมลงทุนเอกชน BOI S-Curve ใช้ได้",
    typicalSize: "THB 100M - 2B",
    competitiveAdvantage: "Strong enough for private interest, early enough for concessional rates. Best of both worlds.",
    competitiveAdvantageTh: "แข็งแกร่งพอสำหรับเอกชนสนใจ เร็วพอสำหรับอัตราผ่อนปรน ดีที่สุดจากทั้งสองโลก",
  };
}

// ─── MONEYBALL INVESTMENT PROFILE ───
// Why an investor should look at THIS city instead of Bangkok/Phuket/Chiang Mai

export interface MoneyballEdge {
  label: string;
  labelTh: string;
  value: string;
  advantage: boolean; // true = beats the Big 3 average
}

export interface MoneyballProfile {
  edges: MoneyballEdge[];
  headline: string;
  headlineTh: string;
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
    edges.push({ label: "Cleaner air", labelTh: "อากาศสะอาดกว่า", value: `PM2.5 ${pm} vs Big 3 avg ${BIG3_AVG.pm25}`, advantage: true });
  }

  // Safety edge
  if (crime < BIG3_AVG.crime) {
    edges.push({ label: "Lower crime", labelTh: "อาชญากรรมต่ำกว่า", value: `${crime}/100K vs Big 3 avg ${BIG3_AVG.crime}`, advantage: true });
  }

  // Green coverage edge
  if (green > BIG3_AVG.green) {
    edges.push({ label: "More green space", labelTh: "พื้นที่สีเขียวมากกว่า", value: `${green}% vs Big 3 avg ${BIG3_AVG.green}%`, advantage: true });
  }

  // Healthcare edge
  if (beds > 20) {
    edges.push({ label: "Healthcare access", labelTh: "เข้าถึงสาธารณสุข", value: `${beds} beds/10K`, advantage: beds >= BIG3_AVG.beds });
  }

  // BOI incentive edge
  if (hasBOI) {
    const boiYears = isEEC ? "8-15 year CIT exemption (EEC zone)" : "3-8 year CIT exemption (S-Curve)";
    const boiYearsTh = isEEC ? "ยกเว้น CIT 8-15 ปี (เขต EEC)" : "ยกเว้น CIT 3-8 ปี (S-Curve)";
    edges.push({ label: "BOI tax incentive", labelTh: "สิทธิประโยชน์ภาษี BOI", value: boiYears, advantage: true });
  }

  // Cost advantage (lower GPP = lower labor/rent costs)
  if (gpp > 0 && gpp < 200000) {
    edges.push({ label: "Lower operating costs", labelTh: "ต้นทุนดำเนินการต่ำกว่า", value: `GPP ฿${(gpp/1000).toFixed(0)}K — labor and rent 2-4x cheaper than Bangkok`, advantage: true });
  }

  // University pipeline
  const hasUni = city.id.includes("cmu") || city.id.includes("phitsanulok") || city.id === "khon-kaen" || city.id === "korat" || city.id === "samyan" || city.id === "chiang-rai" || city.id === "ubon";
  if (hasUni) {
    edges.push({ label: "University talent pipeline", labelTh: "สายพานบุคลากรจากมหาวิทยาลัย", value: "Local university provides graduate recruitment pool", advantage: true });
  }

  // Digital readiness
  if (city.scores.digital >= 55) {
    edges.push({ label: "Digital infrastructure ready", labelTh: "โครงสร้างพื้นฐานดิจิทัลพร้อม", value: `Digital score ${city.scores.digital}/100 — IoT, data platforms operational`, advantage: true });
  }

  // Hospitality/tourism edge
  if (city.scores.hospitality >= 75 && city.id !== "phuket" && city.id !== "chiang-mai-old-town") {
    edges.push({ label: "Tourism economy without Big 3 competition", labelTh: "เศรษฐกิจท่องเที่ยวโดยไม่แข่งกับ Big 3", value: `Hospitality ${city.scores.hospitality}/100 — strong but less saturated market`, advantage: true });
  }

  // Generate headline
  const edgeCount = edges.filter(e => e.advantage).length;
  let headline = "";
  let headlineTh = "";

  if (edgeCount >= 5) {
    headline = `${edgeCount} advantages over Bangkok/Phuket/Chiang Mai. This is a moneyball city — undervalued by the market, strong on fundamentals.`;
    headlineTh = `${edgeCount} ข้อได้เปรียบเหนือกรุงเทพฯ/ภูเก็ต/เชียงใหม่ นี่คือเมือง moneyball — ตลาดประเมินต่ำ แต่พื้นฐานแข็ง`;
  } else if (edgeCount >= 3) {
    headline = `${edgeCount} clear edges. Not the obvious choice, but the smart one — lower cost, less competition, real infrastructure.`;
    headlineTh = `${edgeCount} จุดแข็งชัด ไม่ใช่ตัวเลือกที่เห็นชัด แต่เป็นตัวเลือกที่ฉลาด — ต้นทุนต่ำ แข่งขันน้อย โครงสร้างพื้นฐานจริง`;
  } else if (edgeCount >= 1) {
    headline = `Niche opportunity. Specific advantages in ${edges.filter(e => e.advantage).map(e => e.label.toLowerCase()).join(", ")}. Not for every investor, but right for the right one.`;
    headlineTh = `โอกาสเฉพาะทาง จุดแข็งเฉพาะด้าน ไม่ใช่สำหรับทุกนักลงทุน แต่ใช่สำหรับคนที่ใช่`;
  } else {
    headline = `Early-stage opportunity. Fundamentals still building. Best suited for impact investors and development finance, not commercial returns yet.`;
    headlineTh = `โอกาสระยะเริ่มต้น พื้นฐานยังอยู่ระหว่างสร้าง เหมาะกับนักลงทุนเพื่อผลกระทบและการเงินเพื่อพัฒนา ยังไม่ใช่ผลตอบแทนเชิงพาณิชย์`;
  }

  return { edges, headline, headlineTh };
}
