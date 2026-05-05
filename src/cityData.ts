// ---------------------------------------------------------------------------
// Smart City Thailand Index — City Data
// ---------------------------------------------------------------------------
// Scores are based on real-world outcomes, not plans or proposals.
// A city that has a beautiful proposal but nothing built scores low.
// A city where people actually live well scores high.
// ---------------------------------------------------------------------------

import { assignTier, computeComposite } from "./scoring.ts";
import { classifyDataConfidence, computeDataConfidenceScore } from "./methodologySpec.ts";
import type { SmartCity, CityScores } from "./types.ts";
import { RANKING_OVERRIDES } from "./dynamicCityData.ts";

export { assignTier, computeComposite } from "./scoring.ts";

function city(
  id: string,
  nameEn: string,
  nameTh: string,
  province: string,
  provinceTh: string,
  region: SmartCity["region"],
  status: SmartCity["status"],
  reality: SmartCity["reality"],
  batch: number | undefined,
  smartDimensions: SmartCity["smartDimensions"],
  scores: CityScores,
  metrics: SmartCity["metrics"],
  tagline: string,
  taglineTh: string,
  highlights: string[],
): SmartCity {
  const finalScores = RANKING_OVERRIDES[id] ? { ...scores, ...RANKING_OVERRIDES[id] } : scores;
  const compositeScore = computeComposite(finalScores);
  const dataConfidence = classifyDataConfidence(
    computeDataConfidenceScore({ metrics }),
  );

  return {
    id,
    nameEn,
    nameTh,
    province,
    provinceTh,
    region,
    status,
    reality,
    batch,
    smartDimensions,
    scores: finalScores,
    metrics,
    compositeScore,
    tier: assignTier(compositeScore),
    tagline,
    taglineTh,
    highlights,
    dataConfidence,
  };
}

// ---------------------------------------------------------------------------
// SMART CITY LOCAL — 37 Certified Cities
// Batch 1 (2021): 15 cities | Batch 2 (2022): 15 cities
// Batch 3 (2023): 6 cities | Batch 4 (2025): 1 city
// ---------------------------------------------------------------------------

export const certifiedCities: SmartCity[] = [

  // ─── BATCH 1 (2021) ───

  city(
    "chiang-mai-old-town", "Chiang Mai Smart Old Town", "เชียงใหม่สมาร์ทโอลด์ทาวน์",
    "Chiang Mai", "เชียงใหม่", "north", "certified", "operational", 1,
    ["economy", "environment", "living", "mobility", "people"],
    { livability: 74, economy: 68, safety: 72, wellbeing: 70, environment: 38, hospitality: 92, digital: 65 },
    { population: 130, gppPerCapita: 168000, avgMonthlyIncome: 24800, pm25Annual: 46.1, hospitalBedsPer10k: 32, crimeRatePer100k: 142, greenCoverage: 68, gppGrowthRate: 2.8, pm25Trend: "stable", waterQuality: 62, forestCoverage: 64, fdiInflow: 850, industryComposition: "services 52%, agriculture 18%, manufacturing 30%", laborForce: 920 },
    "Cultural heart of the north. Real smart city with heritage preservation tech and digital tourism, held back by seasonal burning haze.",
    "หัวใจวัฒนธรรมแห่งภาคเหนือ เมืองอัจฉริยะจริงที่ใช้เทคโนโลยีอนุรักษ์มรดกและท่องเที่ยวดิจิทัล แต่ถูกจำกัดด้วยหมอกควันตามฤดู",
    ["Digital tourism platform serving 200K+ visitors/year", "Smart heritage preservation using IoT sensors on 300+ temples", "Air quality monitoring network with 50+ stations"],
  ),

  city(
    "cmu-smart-city", "CMU Smart City", "มหาวิทยาลัยเชียงใหม่ สมาร์ทซิตี้",
    "Chiang Mai", "เชียงใหม่", "north", "certified", "operational", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 72, economy: 62, safety: 78, wellbeing: 75, environment: 58, hospitality: 70, digital: 80 },
    { population: 45, gppPerCapita: 168000, avgMonthlyIncome: 18000, pm25Annual: 46.1, hospitalBedsPer10k: 32, crimeRatePer100k: 118, greenCoverage: 72, gppGrowthRate: 2.8, pm25Trend: "stable", waterQuality: 62, forestCoverage: 64, fdiInflow: 850, industryComposition: "services 52%, agriculture 18%, manufacturing 30%", laborForce: 920 },
    "University campus as living lab. Genuine R&D engine with smart energy grid, AI traffic, and open data platform.",
    "มหาวิทยาลัยเป็นห้องทดลองจริง เครื่องยนต์ R&D ด้วยระบบพลังงานอัจฉริยะ AI จราจร และแพลตฟอร์มข้อมูลเปิด",
    ["Smart energy grid reducing campus power consumption 30%", "AI-powered traffic management at 12 intersections", "Open data platform with 500+ datasets"],
  ),

  city(
    "mae-moh", "Mae Moh Livable City", "แม่เมาะเมืองน่าอยู่",
    "Lampang", "ลำปาง", "north", "certified", "operational", 1,
    ["economy", "energy", "environment"],
    { livability: 58, economy: 52, safety: 70, wellbeing: 55, environment: 45, hospitality: 62, digital: 55 },
    { population: 42, gppPerCapita: 142000, avgMonthlyIncome: 18500, pm25Annual: 38.2, hospitalBedsPer10k: 18, crimeRatePer100k: 98, greenCoverage: 52, gppGrowthRate: 1.5, pm25Trend: "worsening", waterQuality: 58, forestCoverage: 68, fdiInflow: 320, industryComposition: "mining/energy 35%, agriculture 28%, services 37%", laborForce: 380 },
    "Coal mining town transitioning to clean energy. Smart energy monitoring is real but livability challenges from industrial legacy remain.",
    "เมืองเหมืองถ่านหินที่เปลี่ยนผ่านสู่พลังงานสะอาด ระบบติดตามพลังงานอัจฉริยะเป็นจริง แต่ความท้าทายด้านความน่าอยู่จากมรดกอุตสาหกรรมยังคงอยู่",
    ["Smart energy monitoring for EGAT power plant operations", "Air quality monitoring network around mining areas", "Community health tracking system"],
  ),

  city(
    "nakhonsawan", "Nakhonsawan Smart City", "นครสวรรค์สมาร์ทซิตี้",
    "Nakhon Sawan", "นครสวรรค์", "central", "certified", "operational", 1,
    ["energy", "environment", "governance", "living"],
    { livability: 62, economy: 58, safety: 68, wellbeing: 60, environment: 55, hospitality: 65, digital: 48 },
    { population: 268, gppPerCapita: 138000, avgMonthlyIncome: 20400, pm25Annual: 28.5, hospitalBedsPer10k: 22, crimeRatePer100k: 165, greenCoverage: 40, gppGrowthRate: 1.9, pm25Trend: "stable", waterQuality: 65, forestCoverage: 28, fdiInflow: 480, industryComposition: "agriculture 32%, services 42%, manufacturing 26%", laborForce: 540 },
    "River junction city with smart flood management. Real IoT flood sensors work, but broader digital adoption is still early.",
    "เมืองจุดบรรจบแม่น้ำที่มีการจัดการน้ำท่วมอัจฉริยะ เซ็นเซอร์น้ำท่วม IoT ทำงานจริง แต่การนำดิจิทัลไปใช้ในวงกว้างยังอยู่ในช่วงเริ่มต้น",
    ["IoT flood monitoring with 30+ river sensors", "Smart governance platform for citizen complaints", "Digital agriculture pilot for rice farmers"],
  ),

  city(
    "khon-kaen", "Khon Kaen Smart City", "ขอนแก่นสมาร์ทซิตี้",
    "Khon Kaen", "ขอนแก่น", "northeast", "certified", "operational", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 72, economy: 70, safety: 71, wellbeing: 72, environment: 58, hospitality: 74, digital: 70 },
    { population: 1800, gppPerCapita: 155000, avgMonthlyIncome: 22100, pm25Annual: 26.3, hospitalBedsPer10k: 28, crimeRatePer100k: 138, greenCoverage: 35, gppGrowthRate: 3.5, pm25Trend: "improving", waterQuality: 70, forestCoverage: 15, fdiInflow: 2800, industryComposition: "services 48%, manufacturing 28%, agriculture 24%", laborForce: 980 },
    "Isan's economic capital. Operating genuinely smart initiatives — LRT under construction, smart bus system running, university-industry corridor active. A compelling model in the northeast.",
    "เมืองหลวงเศรษฐกิจอีสาน อัจฉริยะจริง — LRT กำลังก่อสร้าง ระบบรถบัสอัจฉริยะวิ่งแล้ว ระเบียงมหาวิทยาลัย-อุตสาหกรรมทำงานจริง",
    ["Smart bus rapid transit system operational", "LRT construction underway with digital twin planning", "Khon Kaen Innovation Center driving startup ecosystem", "Smart healthcare network connecting 6 hospitals"],
  ),

  city(
    "samyan", "Samyan Smart City", "สามย่านสมาร์ทซิตี้",
    "Bangkok", "กรุงเทพฯ", "bangkok", "certified", "operational", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 76, economy: 82, safety: 65, wellbeing: 74, environment: 48, hospitality: 72, digital: 82 },
    { population: 85, gppPerCapita: 628000, avgMonthlyIncome: 40200, pm25Annual: 32.4, hospitalBedsPer10k: 42, crimeRatePer100k: 285, greenCoverage: 14, gppGrowthRate: 2.1, pm25Trend: "stable", waterQuality: 55, forestCoverage: 11, fdiInflow: 12500, industryComposition: "services 72%, manufacturing 18%, agriculture 1%, other 9%", laborForce: 4200 },
    "Bangkok's innovation district. High-functioning smart city around Chulalongkorn University. Real smart parking, energy management, and innovation hub.",
    "ย่านนวัตกรรมของกรุงเทพฯ เมืองอัจฉริยะที่ทำงานได้ดีรอบจุฬาฯ ที่จอดรถอัจฉริยะ การจัดการพลังงาน และศูนย์นวัตกรรมเป็นจริง",
    ["Smart parking system with real-time availability", "Building energy management across Samyan Mitrtown complex", "Innovation hub supporting 200+ startups", "5G testbed for smart city applications"],
  ),

  city(
    "phra-ram-4", "Phra Ram 4 Smart City", "พระราม 4 สมาร์ทซิตี้",
    "Bangkok", "กรุงเทพฯ", "bangkok", "certified", "operational", 1,
    ["economy", "living", "mobility"],
    { livability: 70, economy: 78, safety: 62, wellbeing: 68, environment: 44, hospitality: 65, digital: 68 },
    { population: 120, gppPerCapita: 628000, avgMonthlyIncome: 40200, pm25Annual: 32.4, hospitalBedsPer10k: 42, crimeRatePer100k: 285, greenCoverage: 12, gppGrowthRate: 2.1, pm25Trend: "stable", waterQuality: 55, forestCoverage: 11, fdiInflow: 12500, industryComposition: "services 72%, manufacturing 18%, agriculture 1%, other 9%", laborForce: 4200 },
    "Bangkok's CBD corridor. Smart traffic and commercial district tech are real, but air quality and congestion remain brutal.",
    "ระเบียง CBD ของกรุงเทพฯ ระบบจราจรอัจฉริยะและเทคโนโลยีย่านการค้าเป็นจริง แต่คุณภาพอากาศและการจราจรติดขัดยังรุนแรง",
    ["Smart traffic signal optimization along 4km corridor", "Digital commercial district management", "Air quality monitoring network"],
  ),

  city(
    "klong-phadung", "Klong Phadung Krung Kasem", "คลองผดุงกรุงเกษม",
    "Bangkok", "กรุงเทพฯ", "bangkok", "certified", "operational", 1,
    ["energy", "environment", "living", "mobility", "people"],
    { livability: 66, economy: 72, safety: 60, wellbeing: 65, environment: 50, hospitality: 68, digital: 72 },
    { population: 95, gppPerCapita: 628000, avgMonthlyIncome: 40200, pm25Annual: 32.4, hospitalBedsPer10k: 42, crimeRatePer100k: 285, greenCoverage: 8, gppGrowthRate: 2.1, pm25Trend: "stable", waterQuality: 55, forestCoverage: 11, fdiInflow: 12500, industryComposition: "services 72%, manufacturing 18%, agriculture 1%, other 9%", laborForce: 4200 },
    "Historic canal district revitalized with smart water management and connected public spaces. A genuine urban renewal project.",
    "ย่านคลองประวัติศาสตร์ที่ฟื้นฟูด้วยการจัดการน้ำอัจฉริยะและพื้นที่สาธารณะเชื่อมต่อ โครงการฟื้นฟูเมืองจริง",
    ["Smart water quality monitoring in canal system", "Connected public space with free WiFi and IoT sensors", "Heritage walk with AR cultural overlay"],
  ),

  city(
    "makkasan", "Makkasan Smart City", "มักกะสันสมาร์ทซิตี้",
    "Bangkok", "กรุงเทพฯ", "bangkok", "certified", "planned", 1,
    ["economy", "energy", "living", "mobility"],
    { livability: 30, economy: 35, safety: 55, wellbeing: 30, environment: 35, hospitality: 25, digital: 40 },
    { population: 0, gppPerCapita: 628000, avgMonthlyIncome: 40200, pm25Annual: 32.4, hospitalBedsPer10k: 42, crimeRatePer100k: 285, greenCoverage: 15, gppGrowthRate: 2.1, pm25Trend: "stable", waterQuality: 55, forestCoverage: 11, fdiInflow: 12500, industryComposition: "services 72%, manufacturing 18%, agriculture 1%, other 9%", laborForce: 4200 },
    "Massive transit hub plan on paper. Almost nothing built. The land exists but the smart city doesn't — yet another plan waiting to become reality.",
    "แผนศูนย์กลางขนส่งขนาดใหญ่บนกระดาษ แทบไม่มีอะไรสร้าง ที่ดินมีอยู่แต่เมืองอัจฉริยะไม่มี — อีกแผนหนึ่งที่รอเป็นจริง",
    ["Master plan completed but construction not started", "Environmental impact assessment done", "Transit integration design with Airport Rail Link"],
  ),

  city(
    "chachoengsao", "Chachoengsao Smart City", "ฉะเชิงเทราสมาร์ทซิตี้",
    "Chachoengsao", "ฉะเชิงเทรา", "east", "certified", "operational", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 68, economy: 72, safety: 70, wellbeing: 64, environment: 56, hospitality: 62, digital: 62 },
    { population: 710, gppPerCapita: 422000, avgMonthlyIncome: 26800, pm25Annual: 24.1, hospitalBedsPer10k: 18, crimeRatePer100k: 125, greenCoverage: 42, gppGrowthRate: 4.2, pm25Trend: "stable", waterQuality: 58, forestCoverage: 22, fdiInflow: 4200, industryComposition: "manufacturing 52%, services 30%, agriculture 18%", laborForce: 370 },
    "EEC gateway city with genuine smart infrastructure. Industrial growth is real, livability improvements visible, good transit connections.",
    "เมืองประตู EEC ที่มีโครงสร้างพื้นฐานอัจฉริยะจริง การเติบโตอุตสาหกรรมเป็นจริง ปรับปรุงความน่าอยู่มองเห็นได้ การเชื่อมต่อขนส่งดี",
    ["Smart industrial zone management system", "Digital citizen services portal", "Smart flood early warning system", "EEC-connected 5G infrastructure"],
  ),

  city(
    "saensuk", "Saensuk Smart City", "แสนสุขสมาร์ทซิตี้",
    "Chon Buri", "ชลบุรี", "east", "certified", "operational", 1,
    ["environment", "governance", "living"],
    { livability: 70, economy: 64, safety: 72, wellbeing: 66, environment: 62, hospitality: 74, digital: 58 },
    { population: 82, gppPerCapita: 380000, avgMonthlyIncome: 28500, pm25Annual: 22.8, hospitalBedsPer10k: 20, crimeRatePer100k: 142, greenCoverage: 28, gppGrowthRate: 3.8, pm25Trend: "stable", waterQuality: 60, forestCoverage: 18, fdiInflow: 6500, industryComposition: "manufacturing 42%, services 40%, agriculture 8%, other 10%", laborForce: 780 },
    "Beachfront municipality that actually works. Smart waste management and beach monitoring are operational. Small but genuine.",
    "เทศบาลริมหาดที่ทำงานได้จริง การจัดการขยะอัจฉริยะและการเฝ้าระวังชายหาดทำงานจริง เล็กแต่จริง",
    ["Smart waste collection with GPS-tracked trucks", "Beach water quality real-time monitoring", "Digital municipal services for residents"],
  ),

  city(
    "wangchan-valley", "Wangchan Valley Smart City", "วังจันทร์วัลเลย์สมาร์ทซิตี้",
    "Rayong", "ระยอง", "east", "certified", "planned", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 18, economy: 22, safety: 65, wellbeing: 15, environment: 50, hospitality: 10, digital: 55 },
    { population: 0, gppPerCapita: 1020000, avgMonthlyIncome: 32400, pm25Annual: 26.5, hospitalBedsPer10k: 18, crimeRatePer100k: 155, greenCoverage: 38, gppGrowthRate: 2.5, pm25Trend: "stable", waterQuality: 55, forestCoverage: 25, fdiInflow: 5800, industryComposition: "petrochemical/manufacturing 55%, services 30%, agriculture 15%", laborForce: 420 },
    "DEPA 2023 ranked it Thailand's #1 city-based smart city (83.55%) — on governance vision metrics, not delivery. The PTT-owned campus covers 3,454 rai in Rayong's EEC zone. VISTEC university and KVIS science high school are operational. The biorefinery was 'almost 50% complete' in 2024, two years past its promised date. Zero residential occupancy data has ever been published.",
    "depa 2566 จัดอันดับเป็นเมืองอัจฉริยะ #1 ระดับเมือง (83.55%) — บนตัวชี้วัดวิสัยทัศน์การกำกับดูแล ไม่ใช่การส่งมอบจริง วิทยาเขต PTT ครอบคลุม 3,454 ไร่ในเขต EEC ระยอง VISTEC และ KVIS เปิดดำเนินการแล้ว โรงกลั่นชีวภาพ 'เกือบ 50%' เสร็จในปี 2567 ช้ากว่าที่กำหนดสองปี ไม่เคยมีข้อมูลการอยู่อาศัยจริงถูกเปิดเผย",
    ["VISTEC research university + KVIS science high school operational", "Biorefinery ~50% complete as of 2024 (promised 2022)", "PTT invested ฿4.5B Phase 1 — oil price crash 2020 slowed momentum"],
  ),

  city(
    "phuket", "Phuket Smart City", "ภูเก็ตสมาร์ทซิตี้",
    "Phuket", "ภูเก็ต", "south", "certified", "operational", 1,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 74, economy: 80, safety: 62, wellbeing: 68, environment: 64, hospitality: 88, digital: 72 },
    { population: 418, gppPerCapita: 492000, avgMonthlyIncome: 34600, pm25Annual: 18.2, hospitalBedsPer10k: 25, crimeRatePer100k: 198, greenCoverage: 44, gppGrowthRate: 5.2, pm25Trend: "improving", waterQuality: 72, forestCoverage: 42, fdiInflow: 3200, industryComposition: "tourism/services 75%, construction 12%, agriculture 8%, other 5%", laborForce: 280 },
    "Thailand's most functional smart tourism city. Real smart traffic, tourist safety systems, marine monitoring. Lives up to the hype — mostly.",
    "เมืองท่องเที่ยวอัจฉริยะที่ทำงานได้ดีที่สุดของไทย ระบบจราจรอัจฉริยะ ความปลอดภัยนักท่องเที่ยว ติดตามทะเลเป็นจริง สมชื่อ — เป็นส่วนใหญ่",
    ["Smart traffic management reducing congestion 25%", "Tourist safety alert system with multilingual support", "Marine environmental monitoring with 20+ buoys", "Smart waste and water management island-wide"],
  ),

  city(
    "sritrang", "Sri Trang City", "ศรีตรังซิตี้",
    "Trang", "ตรัง", "south", "certified", "operational", 1,
    ["economy", "environment", "living"],
    { livability: 64, economy: 55, safety: 74, wellbeing: 62, environment: 68, hospitality: 72, digital: 45 },
    { population: 78, gppPerCapita: 128000, avgMonthlyIncome: 19200, pm25Annual: 16.8, hospitalBedsPer10k: 16, crimeRatePer100k: 110, greenCoverage: 62, gppGrowthRate: 2.0, pm25Trend: "stable", waterQuality: 70, forestCoverage: 45, fdiInflow: 280, industryComposition: "rubber/agriculture 35%, services 40%, manufacturing 25%", laborForce: 320 },
    "Quiet southern city with genuine green initiatives. Smart agriculture and environmental monitoring work. Honest, small-scale smart city.",
    "เมืองใต้เงียบสงบที่มีโครงการสีเขียวจริง เกษตรอัจฉริยะและการเฝ้าระวังสิ่งแวดล้อมทำงานได้ เมืองอัจฉริยะขนาดเล็กที่ซื่อสัตย์",
    ["Smart agriculture monitoring for rubber plantations", "Environmental monitoring of Trang River basin", "Digital municipal service center"],
  ),

  city(
    "yala", "Yala Smart City", "ยะลาสมาร์ทซิตี้",
    "Yala", "ยะลา", "south", "certified", "operational", 1,
    ["economy", "environment", "governance", "living"],
    { livability: 60, economy: 48, safety: 42, wellbeing: 58, environment: 70, hospitality: 64, digital: 55 },
    { population: 68, gppPerCapita: 95000, avgMonthlyIncome: 16800, pm25Annual: 14.2, hospitalBedsPer10k: 18, crimeRatePer100k: 245, greenCoverage: 58, gppGrowthRate: 0.8, pm25Trend: "stable", waterQuality: 72, forestCoverage: 55, fdiInflow: 120, industryComposition: "agriculture 42%, services 38%, government 15%, other 5%", laborForce: 260 },
    "Smart city in deep south conflict zone. Impressive green city achievements despite security challenges. Won Smart Environment excellence award.",
    "เมืองอัจฉริยะในพื้นที่ชายแดนใต้ ความสำเร็จด้านเมืองสีเขียวน่าประทับใจแม้มีความท้าทายด้านความมั่นคง ได้รับรางวัล Smart Environment",
    ["Thailand's cleanest city award multiple years", "Smart CCTV network for public safety", "Green space management exceeding national standards", "Digital governance platform for citizen services"],
  ),

  // ─── BATCH 2 (2022) ───

  city(
    "rayong", "Rayong Smart City", "ระยองสมาร์ทซิตี้",
    "Rayong", "ระยอง", "east", "certified", "operational", 2,
    ["energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 66, economy: 74, safety: 66, wellbeing: 62, environment: 52, hospitality: 58, digital: 58 },
    { population: 740, gppPerCapita: 1020000, avgMonthlyIncome: 32400, pm25Annual: 26.5, hospitalBedsPer10k: 18, crimeRatePer100k: 155, greenCoverage: 38, gppGrowthRate: 2.5, pm25Trend: "stable", waterQuality: 55, forestCoverage: 25, fdiInflow: 5800, industryComposition: "petrochemical/manufacturing 55%, services 30%, agriculture 15%", laborForce: 420 },
    "Industrial powerhouse in EEC with highest GPP. Smart environmental monitoring around industrial zones is genuinely useful.",
    "เมืองอุตสาหกรรมหลักใน EEC ที่มี GPP สูงสุด การเฝ้าระวังสิ่งแวดล้อมอัจฉริยะรอบเขตอุตสาหกรรมมีประโยชน์จริง",
    ["Environmental monitoring around Map Ta Phut industrial zone", "Smart energy management for petrochemical corridor", "Digital citizen reporting for pollution complaints"],
  ),

  city(
    "khao-khun-song", "Khao Khun Song Smart City", "เขาคุนซองสมาร์ทซิตี้",
    "Rayong", "ระยอง", "east", "certified", "partial", 2,
    ["economy", "environment", "living"],
    { livability: 48, economy: 52, safety: 68, wellbeing: 45, environment: 55, hospitality: 45, digital: 42 },
    { population: 25, gppPerCapita: 1020000, avgMonthlyIncome: 32400, pm25Annual: 26.5, hospitalBedsPer10k: 18, crimeRatePer100k: 155, greenCoverage: 38, gppGrowthRate: 2.5, pm25Trend: "stable", waterQuality: 55, forestCoverage: 25, fdiInflow: 5800, industryComposition: "petrochemical/manufacturing 55%, services 30%, agriculture 15%", laborForce: 420 },
    "Small smart agriculture zone. Some digital farming tech deployed but still very early stage.",
    "เขตเกษตรอัจฉริยะขนาดเล็ก เทคโนโลยีเกษตรดิจิทัลบางส่วนถูกนำไปใช้แต่ยังอยู่ในช่วงเริ่มต้นมาก",
    ["Smart farming pilot with IoT soil sensors", "Digital marketplace for local produce"],
  ),

  city(
    "phitsanulok-muni", "Phitsanulok Municipality", "เทศบาลนครพิษณุโลก",
    "Phitsanulok", "พิษณุโลก", "north", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 66, economy: 60, safety: 72, wellbeing: 66, environment: 60, hospitality: 68, digital: 55 },
    { population: 340, gppPerCapita: 132000, avgMonthlyIncome: 20800, pm25Annual: 30.2, hospitalBedsPer10k: 26, crimeRatePer100k: 128, greenCoverage: 45, gppGrowthRate: 2.2, pm25Trend: "stable", waterQuality: 64, forestCoverage: 42, fdiInflow: 520, industryComposition: "agriculture 28%, services 42%, manufacturing 30%", laborForce: 450 },
    "Lower northern hub with genuine smart governance. Digital citizen services are working. A solid, unflashy smart city that delivers.",
    "ศูนย์กลางภาคเหนือตอนล่างที่มีการปกครองอัจฉริยะจริง บริการพลเมืองดิจิทัลทำงานได้ เมืองอัจฉริยะแบบไม่โอ้อวดแต่ส่งมอบผลลัพธ์",
    ["Smart governance platform with 80%+ citizen adoption", "Digital flood management system", "Smart street lighting reducing energy 35%"],
  ),

  city(
    "phitsanulok-nu", "Naresuan University Smart City", "มหาวิทยาลัยนเรศวรสมาร์ทซิตี้",
    "Phitsanulok", "พิษณุโลก", "north", "certified", "operational", 2,
    ["energy", "environment", "mobility"],
    { livability: 62, economy: 52, safety: 76, wellbeing: 68, environment: 62, hospitality: 58, digital: 65 },
    { population: 35, gppPerCapita: 132000, avgMonthlyIncome: 18000, pm25Annual: 30.2, hospitalBedsPer10k: 26, crimeRatePer100k: 128, greenCoverage: 60, gppGrowthRate: 2.2, pm25Trend: "stable", waterQuality: 64, forestCoverage: 42, fdiInflow: 520, industryComposition: "agriculture 28%, services 42%, manufacturing 30%", laborForce: 450 },
    "University campus smart city focused on energy and mobility research. Genuine R&D output.",
    "เมืองอัจฉริยะมหาวิทยาลัยที่เน้นวิจัยด้านพลังงานและการเดินทาง ผลผลิต R&D จริง",
    ["Smart campus energy management system", "EV charging infrastructure pilot", "Environmental monitoring research station"],
  ),

  city(
    "chiang-rai", "Smart City Chiang Rai", "เชียงรายสมาร์ทซิตี้",
    "Chiang Rai", "เชียงราย", "north", "certified", "operational", 2,
    ["economy", "environment", "living", "people"],
    { livability: 66, economy: 56, safety: 72, wellbeing: 64, environment: 55, hospitality: 78, digital: 48 },
    { population: 1300, gppPerCapita: 108000, avgMonthlyIncome: 19600, pm25Annual: 42.8, hospitalBedsPer10k: 20, crimeRatePer100k: 118, greenCoverage: 65, gppGrowthRate: 2.0, pm25Trend: "worsening", waterQuality: 68, forestCoverage: 60, fdiInflow: 420, industryComposition: "agriculture 35%, services 40%, manufacturing 25%", laborForce: 640 },
    "Northernmost smart city with cultural tourism tech. Air quality crisis from burning season is the elephant in the room.",
    "เมืองอัจฉริยะเหนือสุดที่มีเทคโนโลยีท่องเที่ยวเชิงวัฒนธรรม วิกฤตคุณภาพอากาศจากฤดูเผาเป็นช้างในห้อง",
    ["Smart tourism platform for White Temple district", "Digital agriculture for tea and coffee farmers", "Air quality monitoring and alert system"],
  ),

  city(
    "nan", "Nan Smart City", "น่านสมาร์ทซิตี้",
    "Nan", "น่าน", "north", "certified", "operational", 2,
    ["energy", "environment", "governance", "living", "people"],
    { livability: 68, economy: 48, safety: 78, wellbeing: 65, environment: 72, hospitality: 82, digital: 45 },
    { population: 478, gppPerCapita: 88000, avgMonthlyIncome: 16200, pm25Annual: 35.5, hospitalBedsPer10k: 20, crimeRatePer100k: 95, greenCoverage: 72, gppGrowthRate: 1.2, pm25Trend: "worsening", waterQuality: 74, forestCoverage: 75, fdiInflow: 85, industryComposition: "agriculture 40%, services 35%, forestry 15%, other 10%", laborForce: 260 },
    "Small northern city with genuine community-driven smart initiatives. Forest conservation tech and heritage preservation are authentic.",
    "เมืองเหนือเล็กๆ ที่มีโครงการอัจฉริยะจากชุมชนจริง เทคโนโลยีอนุรักษ์ป่าและมรดกเป็นของจริง",
    ["Community-driven forest fire monitoring", "Smart heritage preservation for Nan old town", "Digital citizen governance platform"],
  ),

  city(
    "korat", "Korat Smart City", "โคราชสมาร์ทซิตี้",
    "Nakhon Ratchasima", "นครราชสีมา", "northeast", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 68, economy: 66, safety: 68, wellbeing: 64, environment: 54, hospitality: 66, digital: 58 },
    { population: 2650, gppPerCapita: 168000, avgMonthlyIncome: 21800, pm25Annual: 28.1, hospitalBedsPer10k: 22, crimeRatePer100k: 152, greenCoverage: 40, gppGrowthRate: 3.2, pm25Trend: "improving", waterQuality: 64, forestCoverage: 22, fdiInflow: 3800, industryComposition: "manufacturing 38%, services 35%, agriculture 27%", laborForce: 1380 },
    "Isan's gateway city with genuine smart transport ambitions. Connected to high-speed rail project. Big potential, still building momentum.",
    "เมืองประตูอีสานที่มีความทะเยอทะยานด้านขนส่งอัจฉริยะจริง เชื่อมต่อกับรถไฟความเร็วสูง ศักยภาพใหญ่ ยังสร้างโมเมนตัม",
    ["High-speed rail hub planning with smart integration", "Smart traffic management system", "Digital municipal services platform"],
  ),

  city(
    "ubon", "Ubon Ratchathani Smart City", "อุบลราชธานีสมาร์ทซิตี้",
    "Ubon Ratchathani", "อุบลราชธานี", "northeast", "certified", "operational", 2,
    ["economy", "environment", "living", "mobility", "people"],
    { livability: 62, economy: 54, safety: 70, wellbeing: 60, environment: 58, hospitality: 72, digital: 45 },
    { population: 1880, gppPerCapita: 98000, avgMonthlyIncome: 18400, pm25Annual: 24.8, hospitalBedsPer10k: 19, crimeRatePer100k: 135, greenCoverage: 48, gppGrowthRate: 1.8, pm25Trend: "stable", waterQuality: 66, forestCoverage: 30, fdiInflow: 450, industryComposition: "agriculture 35%, services 40%, manufacturing 25%", laborForce: 920 },
    "Mekong border city with cultural richness. Smart initiatives focus on flood management and cultural tourism. Genuine but early stage.",
    "เมืองชายแดนโขงที่อุดมวัฒนธรรม โครงการอัจฉริยะเน้นจัดการน้ำท่วมและท่องเที่ยวเชิงวัฒนธรรม จริงแต่ยังเริ่มต้น",
    ["Smart flood monitoring for Mun River basin", "Digital cultural tourism for candle festival", "Smart agriculture pilot programs"],
  ),

  city(
    "krabi", "Krabi Smart City", "กระบี่สมาร์ทซิตี้",
    "Krabi", "กระบี่", "south", "certified", "operational", 2,
    ["economy", "energy", "environment", "living", "mobility"],
    { livability: 66, economy: 64, safety: 68, wellbeing: 60, environment: 72, hospitality: 84, digital: 48 },
    { population: 468, gppPerCapita: 198000, avgMonthlyIncome: 22600, pm25Annual: 14.5, hospitalBedsPer10k: 18, crimeRatePer100k: 125, greenCoverage: 55, gppGrowthRate: 4.5, pm25Trend: "improving", waterQuality: 75, forestCoverage: 52, fdiInflow: 1800, industryComposition: "tourism/services 62%, agriculture 22%, fishery 16%", laborForce: 240 },
    "Andaman tourism hub with genuine marine conservation tech. Smart environmental monitoring protects islands. Tourism-economy tension is real.",
    "ศูนย์ท่องเที่ยวอันดามันที่มีเทคโนโลยีอนุรักษ์ทะเลจริง เฝ้าระวังสิ่งแวดล้อมอัจฉริยะปกป้องเกาะ ความขัดแย้งท่องเที่ยว-เศรษฐกิจเป็นจริง",
    ["Marine conservation monitoring for Phi Phi islands", "Smart tourism crowd management", "Renewable energy integration pilot"],
  ),

  city(
    "phangnga", "Phang Nga Smart City", "พังงาสมาร์ทซิตี้",
    "Phang Nga", "พังงา", "south", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 64, economy: 56, safety: 74, wellbeing: 60, environment: 76, hospitality: 78, digital: 45 },
    { population: 264, gppPerCapita: 158000, avgMonthlyIncome: 20200, pm25Annual: 12.8, hospitalBedsPer10k: 16, crimeRatePer100k: 108, greenCoverage: 68, gppGrowthRate: 3.8, pm25Trend: "improving", waterQuality: 78, forestCoverage: 58, fdiInflow: 650, industryComposition: "tourism 55%, agriculture 25%, fishery 20%", laborForce: 130 },
    "Tsunami-aware smart city with genuine disaster management tech. Environmental monitoring and early warning systems are real.",
    "เมืองอัจฉริยะที่ตระหนักเรื่องสึนามิ มีเทคโนโลยีจัดการภัยพิบัติจริง ระบบเฝ้าระวังสิ่งแวดล้อมและเตือนภัยล่วงหน้าเป็นจริง",
    ["Tsunami early warning system with IoT sensors", "Smart mangrove conservation monitoring", "Digital tourism management for Similan area"],
  ),

  city(
    "satun", "Satun Smart City", "สตูลสมาร์ทซิตี้",
    "Satun", "สตูล", "south", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "people"],
    { livability: 60, economy: 46, safety: 76, wellbeing: 58, environment: 78, hospitality: 70, digital: 40 },
    { population: 322, gppPerCapita: 82000, avgMonthlyIncome: 15800, pm25Annual: 11.5, hospitalBedsPer10k: 14, crimeRatePer100k: 88, greenCoverage: 72, gppGrowthRate: 1.2, pm25Trend: "stable", waterQuality: 76, forestCoverage: 60, fdiInflow: 95, industryComposition: "agriculture 38%, fishery 25%, services 32%, other 5%", laborForce: 160 },
    "UNESCO Geopark smart city. Genuine environmental tech for geological heritage preservation. Small, quiet, and real.",
    "เมืองอัจฉริยะ UNESCO Geopark เทคโนโลยีสิ่งแวดล้อมจริงเพื่ออนุรักษ์มรดกธรณี เล็ก เงียบ และจริง",
    ["UNESCO Geopark monitoring technology", "Smart marine conservation for Tarutao", "Digital community governance platform"],
  ),

  city(
    "samui", "Koh Samui Smart City", "เกาะสมุยสมาร์ทซิตี้",
    "Surat Thani", "สุราษฎร์ธานี", "south", "certified", "operational", 2,
    ["economy", "environment", "governance", "living", "people"],
    { livability: 66, economy: 72, safety: 60, wellbeing: 58, environment: 58, hospitality: 86, digital: 52 },
    { population: 68, gppPerCapita: 320000, avgMonthlyIncome: 28800, pm25Annual: 15.2, hospitalBedsPer10k: 22, crimeRatePer100k: 175, greenCoverage: 48, gppGrowthRate: 4.8, pm25Trend: "improving", waterQuality: 68, forestCoverage: 45, fdiInflow: 2200, industryComposition: "tourism 70%, services 18%, agriculture 12%", laborForce: 52 },
    "Island smart city with tourism tech. Real smart waste and water management for an island that badly needs it. Tourism pressure is intense.",
    "เมืองอัจฉริยะเกาะที่มีเทคโนโลยีท่องเที่ยว จัดการขยะและน้ำอัจฉริยะจริงสำหรับเกาะที่ต้องการมาก แรงกดดันท่องเที่ยวรุนแรง",
    ["Smart waste management for island sustainability", "Water management system for drought-prone island", "Digital tourism platform with multilingual support"],
  ),

  city(
    "hat-yai", "Hat Yai Smart City", "หาดใหญ่สมาร์ทซิตี้",
    "Songkhla", "สงขลา", "south", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 70, economy: 68, safety: 62, wellbeing: 66, environment: 54, hospitality: 76, digital: 55 },
    { population: 158, gppPerCapita: 165000, avgMonthlyIncome: 23400, pm25Annual: 18.5, hospitalBedsPer10k: 28, crimeRatePer100k: 168, greenCoverage: 32, gppGrowthRate: 2.2, pm25Trend: "stable", waterQuality: 68, forestCoverage: 35, fdiInflow: 1100, industryComposition: "services 45%, rubber/agriculture 30%, manufacturing 25%", laborForce: 820 },
    "Southern commercial hub with genuine smart city infrastructure. Smart flood management critical for this flood-prone city.",
    "ศูนย์กลางการค้าใต้ที่มีโครงสร้างพื้นฐานเมืองอัจฉริยะจริง การจัดการน้ำท่วมอัจฉริยะสำคัญสำหรับเมืองที่เสี่ยงน้ำท่วม",
    ["Smart flood management system — critical infrastructure", "Digital commercial district management", "Cross-border trade digitization with Malaysia"],
  ),

  city(
    "pattani", "Pattani Smart City", "ปัตตานีสมาร์ทซิตี้",
    "Pattani", "ปัตตานี", "south", "certified", "operational", 2,
    ["environment", "governance", "living", "mobility", "people"],
    { livability: 52, economy: 42, safety: 38, wellbeing: 52, environment: 58, hospitality: 62, digital: 42 },
    { population: 700, gppPerCapita: 72000, avgMonthlyIncome: 14200, pm25Annual: 13.8, hospitalBedsPer10k: 15, crimeRatePer100k: 245, greenCoverage: 42, gppGrowthRate: 0.5, pm25Trend: "stable", waterQuality: 65, forestCoverage: 32, fdiInflow: 85, industryComposition: "fishery 28%, agriculture 30%, services 32%, other 10%", laborForce: 340 },
    "Deep south smart city facing security challenges. Digital governance and safety systems are genuine attempts at improving a difficult situation.",
    "เมืองอัจฉริยะชายแดนใต้ที่เผชิญความท้าทายด้านความมั่นคง ระบบปกครองดิจิทัลและความปลอดภัยเป็นความพยายามจริงในสถานการณ์ยาก",
    ["Smart safety monitoring for public spaces", "Digital governance for citizen services", "Community health monitoring system"],
  ),

  city(
    "narathiwat", "Narathiwat Smart City", "นราธิวาสสมาร์ทซิตี้",
    "Narathiwat", "นราธิวาส", "south", "certified", "operational", 2,
    ["economy", "energy", "environment", "governance", "living", "people"],
    { livability: 50, economy: 40, safety: 35, wellbeing: 50, environment: 62, hospitality: 60, digital: 40 },
    { population: 796, gppPerCapita: 68000, avgMonthlyIncome: 13800, pm25Annual: 12.5, hospitalBedsPer10k: 12, crimeRatePer100k: 262, greenCoverage: 48, gppGrowthRate: 0.6, pm25Trend: "stable", waterQuality: 70, forestCoverage: 48, fdiInflow: 65, industryComposition: "agriculture 40%, services 35%, fishery 15%, other 10%", laborForce: 380 },
    "Southernmost smart city with genuine cross-border digital trade pilot. Security situation severely limits livability outcomes.",
    "เมืองอัจฉริยะใต้สุดที่มีโครงการค้าดิจิทัลข้ามพรมแดนจริง สถานการณ์ความมั่นคงจำกัดผลลัพธ์ความน่าอยู่อย่างรุนแรง",
    ["Cross-border digital trade pilot with Malaysia", "Smart safety infrastructure in urban areas", "Digital community health network"],
  ),

  // ─── BATCH 3 (2023) ───

  city(
    "lampang", "Lampang Smart City", "ลำปางสมาร์ทซิตี้",
    "Lampang", "ลำปาง", "north", "certified", "operational", 3,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 66, economy: 56, safety: 74, wellbeing: 64, environment: 58, hospitality: 76, digital: 52 },
    { population: 740, gppPerCapita: 118000, avgMonthlyIncome: 18600, pm25Annual: 38.5, hospitalBedsPer10k: 24, crimeRatePer100k: 112, greenCoverage: 55, gppGrowthRate: 1.5, pm25Trend: "worsening", waterQuality: 58, forestCoverage: 68, fdiInflow: 320, industryComposition: "mining/energy 35%, agriculture 28%, services 37%", laborForce: 380 },
    "Horse carriage city going smart. Genuine heritage-tech fusion with smart energy from Mae Moh transition. Air quality still a problem.",
    "เมืองรถม้าที่เปลี่ยนสู่อัจฉริยะ การผสมผสานมรดก-เทคโนโลยีจริง พลังงานอัจฉริยะจากการเปลี่ยนผ่านแม่เมาะ คุณภาพอากาศยังเป็นปัญหา",
    ["Smart heritage tourism for horse carriage city", "Clean energy transition from Mae Moh coal plant", "Smart air quality monitoring network"],
  ),

  city(
    "samut-prakan", "Samut Prakan Smart City", "สมุทรปราการสมาร์ทซิตี้",
    "Samut Prakan", "สมุทรปราการ", "central", "certified", "operational", 3,
    ["economy", "energy", "environment", "governance", "living", "people"],
    { livability: 64, economy: 70, safety: 60, wellbeing: 62, environment: 42, hospitality: 55, digital: 58 },
    { population: 1340, gppPerCapita: 385000, avgMonthlyIncome: 28200, pm25Annual: 30.8, hospitalBedsPer10k: 16, crimeRatePer100k: 195, greenCoverage: 18, gppGrowthRate: 3.0, pm25Trend: "stable", waterQuality: 48, forestCoverage: 5, fdiInflow: 5200, industryComposition: "manufacturing 55%, services 35%, agriculture 5%, other 5%", laborForce: 680 },
    "Bangkok's industrial suburb with smart factory tech. Real Industry 4.0 adoption in manufacturing. Livability suffers from congestion and flooding.",
    "ชานเมืองอุตสาหกรรมของกรุงเทพฯ ที่มีเทคโนโลยีโรงงานอัจฉริยะ Industry 4.0 จริงในการผลิต ความน่าอยู่ได้รับผลกระทบจากการจราจรและน้ำท่วม",
    ["Industry 4.0 smart factory zone", "Flood management IoT system for low-lying areas", "Digital municipal services integration"],
  ),

  city(
    "thep-paraj", "Thep Paraj Smart City", "เทพราชสมาร์ทซิตี้",
    "Chachoengsao", "ฉะเชิงเทรา", "east", "certified", "partial", 3,
    ["environment", "governance", "living"],
    { livability: 52, economy: 48, safety: 72, wellbeing: 50, environment: 58, hospitality: 55, digital: 38 },
    { population: 22, gppPerCapita: 422000, avgMonthlyIncome: 26800, pm25Annual: 24.1, hospitalBedsPer10k: 18, crimeRatePer100k: 125, greenCoverage: 42, gppGrowthRate: 4.2, pm25Trend: "stable", waterQuality: 58, forestCoverage: 22, fdiInflow: 4200, industryComposition: "manufacturing 52%, services 30%, agriculture 18%", laborForce: 370 },
    "Small EEC sub-district with smart agriculture focus. Some IoT deployment but still very early.",
    "ตำบลเล็กใน EEC ที่เน้นเกษตรอัจฉริยะ มีการใช้ IoT บ้างแต่ยังเริ่มต้นมาก",
    ["Smart agriculture IoT pilot", "Digital community governance"],
  ),

  city(
    "nikhom-phatthana", "Nikhom Phatthana Smart City", "นิคมพัฒนาสมาร์ทซิตี้",
    "Rayong", "ระยอง", "east", "certified", "partial", 3,
    ["environment", "governance", "living"],
    { livability: 50, economy: 55, safety: 70, wellbeing: 48, environment: 52, hospitality: 45, digital: 40 },
    { population: 45, gppPerCapita: 1020000, avgMonthlyIncome: 32400, pm25Annual: 26.5, hospitalBedsPer10k: 18, crimeRatePer100k: 155, greenCoverage: 28, gppGrowthRate: 2.5, pm25Trend: "stable", waterQuality: 55, forestCoverage: 25, fdiInflow: 5800, industryComposition: "petrochemical/manufacturing 55%, services 30%, agriculture 15%", laborForce: 420 },
    "Industrial district near Map Ta Phut. Environmental monitoring is the key smart tech here — necessary given the chemical industry.",
    "เขตอุตสาหกรรมใกล้มาบตาพุด การเฝ้าระวังสิ่งแวดล้อมเป็นเทคโนโลยีอัจฉริยะหลัก — จำเป็นเนื่องจากอุตสาหกรรมเคมี",
    ["Industrial environmental monitoring network", "Chemical spill early warning system"],
  ),

  city(
    "nakhon-si-thammarat", "Nakhon Si Thammarat Smart City", "นครศรีธรรมราชสมาร์ทซิตี้",
    "Nakhon Si Thammarat", "นครศรีธรรมราช", "south", "certified", "operational", 3,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 64, economy: 58, safety: 66, wellbeing: 62, environment: 62, hospitality: 74, digital: 50 },
    { population: 1560, gppPerCapita: 118000, avgMonthlyIncome: 18800, pm25Annual: 15.8, hospitalBedsPer10k: 21, crimeRatePer100k: 148, greenCoverage: 55, gppGrowthRate: 1.8, pm25Trend: "stable", waterQuality: 66, forestCoverage: 38, fdiInflow: 380, industryComposition: "agriculture 35%, services 40%, manufacturing 25%", laborForce: 780 },
    "Ancient city with real flood management tech. Genuine smart governance and heritage preservation. SLIC's home base.",
    "เมืองโบราณที่มีเทคโนโลยีจัดการน้ำท่วมจริง การปกครองอัจฉริยะและอนุรักษ์มรดกจริง ฐานบ้านของ SLIC",
    ["Smart flood management for Pak Phanang basin", "Digital heritage preservation for Wat Phra Mahathat", "Smart governance citizen platform with high adoption"],
  ),

  city(
    "tai-yong", "Tai Yong Smart City", "ไทยวังสมาร์ทซิตี้",
    "Nakhon Si Thammarat", "นครศรีธรรมราช", "south", "certified", "partial", 3,
    ["environment", "governance", "living"],
    { livability: 52, economy: 42, safety: 72, wellbeing: 52, environment: 64, hospitality: 60, digital: 35 },
    { population: 18, gppPerCapita: 118000, avgMonthlyIncome: 14200, pm25Annual: 15.8, hospitalBedsPer10k: 21, crimeRatePer100k: 148, greenCoverage: 55, gppGrowthRate: 1.8, pm25Trend: "stable", waterQuality: 66, forestCoverage: 38, fdiInflow: 380, industryComposition: "agriculture 35%, services 40%, manufacturing 25%", laborForce: 780 },
    "Small sub-district smart city. Community-scale digital governance and agriculture tech. Genuine but tiny.",
    "เมืองอัจฉริยะระดับตำบลเล็ก ปกครองดิจิทัลระดับชุมชนและเทคโนโลยีเกษตร จริงแต่เล็กมาก",
    ["Community-scale digital governance", "Smart agriculture for local farmers"],
  ),

  // ─── BATCH 4 (2025) ───

  city(
    "phuket-tinicon", "Phuket Tinicon Valley", "ภูเก็ตทินิคอนวัลเลย์",
    "Phuket", "ภูเก็ต", "south", "certified", "planned", 4,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 25, economy: 30, safety: 65, wellbeing: 20, environment: 55, hospitality: 20, digital: 45 },
    { population: 0, gppPerCapita: 492000, avgMonthlyIncome: 34600, pm25Annual: 18.2, hospitalBedsPer10k: 25, crimeRatePer100k: 198, greenCoverage: 44, gppGrowthRate: 5.2, pm25Trend: "improving", waterQuality: 72, forestCoverage: 42, fdiInflow: 3200, industryComposition: "tourism/services 75%, construction 12%, agriculture 8%, other 5%", laborForce: 280 },
    "Newest certified city — but it's a development plan, not a functioning city. The logo was awarded to a concept.",
    "เมืองที่ได้รับการรับรองล่าสุด — แต่เป็นแผนพัฒนา ไม่ใช่เมืองที่ทำงานได้ ตราสัญลักษณ์มอบให้กับแนวคิด",
    ["Master plan approved with all 7 dimensions", "Innovation park concept", "Not yet under construction"],
  ),
];

// ---------------------------------------------------------------------------
// PROMOTION ZONES — Selected cities from depa's 190 promotion cities (January 2026 registry)
// These are cities that have submitted plans and are working toward certification.
// ---------------------------------------------------------------------------

export const promotionZoneCities: SmartCity[] = [

  city(
    "songkhla-city", "Songkhla City", "เมืองสงขลา",
    "Songkhla", "สงขลา", "south", "promotion", "operational", undefined,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 66, economy: 60, safety: 64, wellbeing: 62, environment: 60, hospitality: 76, digital: 48 },
    { population: 340, gppPerCapita: 155000, avgMonthlyIncome: 22400, pm25Annual: 17.2, hospitalBedsPer10k: 24, crimeRatePer100k: 158, greenCoverage: 38, gppGrowthRate: 2.2, pm25Trend: "stable", waterQuality: 68, forestCoverage: 35, fdiInflow: 1100, industryComposition: "services 45%, rubber/agriculture 30%, manufacturing 25%", laborForce: 820 },
    "Historic lakeside city with genuine smart governance and tourism tech. Strong cultural identity.",
    "เมืองริมทะเลสาบประวัติศาสตร์ที่มีการปกครองอัจฉริยะและเทคโนโลยีท่องเที่ยวจริง อัตลักษณ์วัฒนธรรมแข็งแกร่ง",
    ["Smart heritage preservation for old town", "Lake monitoring environmental sensors", "Digital governance platform"],
  ),

  city(
    "rattanakosin", "Rattanakosin Smart District", "เขตรัตนโกสินทร์อัจฉริยะ",
    "Bangkok", "กรุงเทพฯ", "bangkok", "promotion", "operational", undefined,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 68, economy: 72, safety: 58, wellbeing: 66, environment: 46, hospitality: 82, digital: 62 },
    { population: 200, gppPerCapita: 628000, avgMonthlyIncome: 40200, pm25Annual: 32.4, hospitalBedsPer10k: 42, crimeRatePer100k: 285, greenCoverage: 18, gppGrowthRate: 2.1, pm25Trend: "stable", waterQuality: 55, forestCoverage: 11, fdiInflow: 12500, industryComposition: "services 72%, manufacturing 18%, agriculture 1%, other 9%", laborForce: 4200 },
    "Bangkok's historic core with genuine heritage-tech fusion. Smart canal management and cultural preservation.",
    "ใจกลางประวัติศาสตร์กรุงเทพฯ ที่มีการผสมผสานมรดก-เทคโนโลยีจริง จัดการคลองอัจฉริยะและอนุรักษ์วัฒนธรรม",
    ["Smart heritage preservation for Grand Palace district", "Canal water quality monitoring", "Digital cultural tourism platform"],
  ),

  city(
    "nonthaburi", "Nonthaburi Smart City", "นนทบุรีสมาร์ทซิตี้",
    "Nonthaburi", "นนทบุรี", "central", "promotion", "operational", undefined,
    ["economy", "environment", "governance", "living", "people"],
    { livability: 68, economy: 66, safety: 64, wellbeing: 66, environment: 48, hospitality: 60, digital: 55 },
    { population: 1280, gppPerCapita: 285000, avgMonthlyIncome: 32800, pm25Annual: 31.2, hospitalBedsPer10k: 20, crimeRatePer100k: 175, greenCoverage: 22, gppGrowthRate: 2.5, pm25Trend: "stable", waterQuality: 52, forestCoverage: 8, fdiInflow: 2800, industryComposition: "services 58%, manufacturing 32%, agriculture 5%, other 5%", laborForce: 620 },
    "Bangkok's northern suburb with genuine digital governance. MRT-connected, growing fast, affordable alternative to Bangkok proper.",
    "ชานเมืองเหนือของกรุงเทพฯ ที่มีปกครองดิจิทัลจริง เชื่อมต่อ MRT เติบโตเร็ว ทางเลือกราคาจับต้องได้แทนกรุงเทพฯ",
    ["Smart flood management for Chao Phraya riverside", "Digital municipal services", "MRT-integrated smart mobility"],
  ),

  city(
    "chanthaburi", "Chanthaburi Smart City", "จันทบุรีสมาร์ทซิตี้",
    "Chanthaburi", "จันทบุรี", "east", "promotion", "operational", undefined,
    ["economy", "environment", "governance", "living"],
    { livability: 66, economy: 62, safety: 72, wellbeing: 60, environment: 68, hospitality: 74, digital: 42 },
    { population: 540, gppPerCapita: 178000, avgMonthlyIncome: 21200, pm25Annual: 18.5, hospitalBedsPer10k: 20, crimeRatePer100k: 118, greenCoverage: 52, gppGrowthRate: 3.0, pm25Trend: "improving", waterQuality: 72, forestCoverage: 48, fdiInflow: 680, industryComposition: "agriculture/fruit 42%, services 32%, gems 15%, manufacturing 11%", laborForce: 280 },
    "Gem city and fruit capital with genuine agri-tech. Smart agriculture for durian and mangosteen farmers is actually working.",
    "เมืองอัญมณีและเมืองหลวงผลไม้ที่มีเทคโนโลยีเกษตรจริง เกษตรอัจฉริยะสำหรับเกษตรกรทุเรียนและมังคุดทำงานจริง",
    ["Smart agriculture for premium fruit production", "Gem trading digitization platform", "River basin environmental monitoring"],
  ),

  city(
    "tak", "Tak Smart City", "ตากสมาร์ทซิตี้",
    "Tak", "ตาก", "north", "promotion", "operational", undefined,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 56, economy: 50, safety: 62, wellbeing: 54, environment: 62, hospitality: 60, digital: 42 },
    { population: 670, gppPerCapita: 108000, avgMonthlyIncome: 17200, pm25Annual: 34.5, hospitalBedsPer10k: 16, crimeRatePer100k: 142, greenCoverage: 65, gppGrowthRate: 1.5, pm25Trend: "worsening", waterQuality: 60, forestCoverage: 72, fdiInflow: 350, industryComposition: "agriculture 30%, services 28%, border trade 25%, manufacturing 17%", laborForce: 320 },
    "Border city with smart customs and trade digitization. Genuine cross-border tech with Myanmar trade.",
    "เมืองชายแดนที่มีศุลกากรอัจฉริยะและการค้าดิจิทัล เทคโนโลยีข้ามพรมแดนจริงกับการค้าเมียนมา",
    ["Smart border customs digitization", "Cross-border trade platform with Myanmar", "Air quality monitoring for burning season"],
  ),

  city(
    "phichit", "Phichit Smart City", "พิจิตรสมาร์ทซิตี้",
    "Phichit", "พิจิตร", "north", "promotion", "partial", undefined,
    ["people"],
    { livability: 54, economy: 42, safety: 72, wellbeing: 55, environment: 58, hospitality: 62, digital: 30 },
    { population: 530, gppPerCapita: 78000, avgMonthlyIncome: 15400, pm25Annual: 22.5, hospitalBedsPer10k: 14, crimeRatePer100k: 95, greenCoverage: 42, gppGrowthRate: 0.8, pm25Trend: "stable", waterQuality: 62, forestCoverage: 18, fdiInflow: 120, industryComposition: "agriculture 48%, services 32%, manufacturing 20%", laborForce: 280 },
    "Small agricultural province with digital literacy focus. Only one smart dimension so far. Very early stage.",
    "จังหวัดเกษตรเล็กที่เน้นความรู้ดิจิทัล มีเพียงมิติอัจฉริยะเดียวจนถึงตอนนี้ อยู่ในช่วงเริ่มต้นมาก",
    ["Digital literacy program for rural communities", "Smart farming pilot for rice farmers"],
  ),

  city(
    "umong", "Umong Municipality Smart City", "เทศบาลตำบลอุโมงค์สมาร์ทซิตี้",
    "Lamphun", "ลำพูน", "north", "promotion", "operational", undefined,
    ["economy", "energy", "environment", "governance", "living", "mobility", "people"],
    { livability: 62, economy: 48, safety: 76, wellbeing: 60, environment: 66, hospitality: 68, digital: 48 },
    { population: 22, gppPerCapita: 125000, avgMonthlyIncome: 17800, pm25Annual: 36.8, hospitalBedsPer10k: 18, crimeRatePer100k: 108, greenCoverage: 55, gppGrowthRate: 3.5, pm25Trend: "worsening", waterQuality: 65, forestCoverage: 55, fdiInflow: 1800, industryComposition: "manufacturing 45%, agriculture 25%, services 30%", laborForce: 210 },
    "Tiny municipality with surprisingly comprehensive smart city program. All 7 dimensions covered. Community-driven approach.",
    "เทศบาลเล็กที่มีโปรแกรมเมืองอัจฉริยะครอบคลุมอย่างน่าประหลาดใจ ครอบคลุมทั้ง 7 มิติ แนวทางขับเคลื่อนโดยชุมชน",
    ["Community-driven smart governance platform", "Smart agriculture and energy management", "All 7 dimensions covered despite tiny size"],
  ),

  city(
    "maesai", "Mae Sai Smart City", "แม่สายสมาร์ทซิตี้",
    "Chiang Rai", "เชียงราย", "north", "promotion", "operational", undefined,
    ["energy", "environment", "governance", "living", "people"],
    { livability: 54, economy: 50, safety: 58, wellbeing: 52, environment: 52, hospitality: 62, digital: 42 },
    { population: 85, gppPerCapita: 108000, avgMonthlyIncome: 16800, pm25Annual: 44.2, hospitalBedsPer10k: 15, crimeRatePer100k: 165, greenCoverage: 58, gppGrowthRate: 2.5, pm25Trend: "worsening", waterQuality: 62, forestCoverage: 52, fdiInflow: 280, industryComposition: "border trade 35%, services 30%, agriculture 25%, manufacturing 10%", laborForce: 85 },
    "Northernmost border town rebuilding after 2024 floods. Smart disaster management is now a real priority, not just a plan.",
    "เมืองชายแดนเหนือสุดที่กำลังสร้างใหม่หลังน้ำท่วม 2024 การจัดการภัยพิบัติอัจฉริยะเป็นความสำคัญจริงตอนนี้ ไม่ใช่แค่แผน",
    ["Post-flood smart disaster management system", "Border trade digitization", "Air quality crisis monitoring"],
  ),

  city(
    "bang-saray", "Bang Saray Smart City", "บางเสร่สมาร์ทซิตี้",
    "Chon Buri", "ชลบุรี", "east", "promotion", "partial", undefined,
    ["environment", "governance", "living", "mobility"],
    { livability: 58, economy: 56, safety: 68, wellbeing: 52, environment: 58, hospitality: 64, digital: 38 },
    { population: 35, gppPerCapita: 380000, avgMonthlyIncome: 24500, pm25Annual: 22.8, hospitalBedsPer10k: 20, crimeRatePer100k: 142, greenCoverage: 35, gppGrowthRate: 3.8, pm25Trend: "stable", waterQuality: 60, forestCoverage: 18, fdiInflow: 6500, industryComposition: "manufacturing 42%, services 40%, agriculture 8%, other 10%", laborForce: 780 },
    "Coastal community near Pattaya with fishing village smart tech. Small but genuine digital governance.",
    "ชุมชนชายฝั่งใกล้พัทยาที่มีเทคโนโลยีอัจฉริยะหมู่บ้านประมง เล็กแต่ปกครองดิจิทัลจริง",
    ["Smart fishing fleet management", "Coastal environmental monitoring", "Digital community governance"],
  ),

  city(
    "phitsanulok-ppao", "Phitsanulok PAO Smart City", "อบจ.พิษณุโลกสมาร์ทซิตี้",
    "Phitsanulok", "พิษณุโลก", "north", "promotion", "operational", undefined,
    ["economy", "environment", "governance", "living", "mobility"],
    { livability: 62, economy: 56, safety: 70, wellbeing: 62, environment: 58, hospitality: 64, digital: 48 },
    { population: 340, gppPerCapita: 132000, avgMonthlyIncome: 20800, pm25Annual: 30.2, hospitalBedsPer10k: 26, crimeRatePer100k: 128, greenCoverage: 45, gppGrowthRate: 2.2, pm25Trend: "stable", waterQuality: 64, forestCoverage: 42, fdiInflow: 520, industryComposition: "agriculture 28%, services 42%, manufacturing 30%", laborForce: 450 },
    "Provincial-level smart governance covering entire Phitsanulok province. Digital services reaching rural areas.",
    "การปกครองอัจฉริยะระดับจังหวัดครอบคลุมทั้งจังหวัดพิษณุโลก บริการดิจิทัลเข้าถึงพื้นที่ชนบท",
    ["Province-wide digital governance platform", "Smart agriculture extension services", "Rural health telemedicine network"],
  ),

  city(
    "ubon-muni", "Ubon Ratchathani Municipality", "เทศบาลนครอุบลราชธานี",
    "Ubon Ratchathani", "อุบลราชธานี", "northeast", "promotion", "operational", undefined,
    ["economy", "environment", "living", "mobility", "people"],
    { livability: 60, economy: 52, safety: 68, wellbeing: 58, environment: 56, hospitality: 72, digital: 42 },
    { population: 120, gppPerCapita: 98000, avgMonthlyIncome: 18400, pm25Annual: 24.8, hospitalBedsPer10k: 19, crimeRatePer100k: 135, greenCoverage: 48, gppGrowthRate: 1.8, pm25Trend: "stable", waterQuality: 66, forestCoverage: 30, fdiInflow: 450, industryComposition: "agriculture 35%, services 40%, manufacturing 25%", laborForce: 920 },
    "Municipal-level smart city complementing the larger Ubon project. Focus on candle festival tourism tech.",
    "เมืองอัจฉริยะระดับเทศบาลเสริมโครงการอุบลฯ ขนาดใหญ่ เน้นเทคโนโลยีท่องเที่ยวเทศกาลเทียน",
    ["Smart tourism for candle festival", "Digital municipal services", "Flood monitoring for Mun River"],
  ),

  city(
    "phlapphla", "Phlapphla Narai Smart City", "ตำบลพลับพลานารายณ์สมาร์ทซิตี้",
    "Chanthaburi", "จันทบุรี", "east", "promotion", "partial", undefined,
    ["energy", "environment", "governance", "living", "people"],
    { livability: 52, economy: 48, safety: 74, wellbeing: 50, environment: 62, hospitality: 58, digital: 35 },
    { population: 15, gppPerCapita: 178000, avgMonthlyIncome: 21200, pm25Annual: 18.5, hospitalBedsPer10k: 20, crimeRatePer100k: 115, greenCoverage: 52, gppGrowthRate: 3.0, pm25Trend: "improving", waterQuality: 72, forestCoverage: 48, fdiInflow: 680, industryComposition: "agriculture/fruit 42%, services 32%, gems 15%, manufacturing 11%", laborForce: 280 },
    "Sub-district level smart city with community energy and environmental focus. Tiny but experimental.",
    "เมืองอัจฉริยะระดับตำบลที่เน้นพลังงานชุมชนและสิ่งแวดล้อม เล็กจิ๋วแต่เป็นการทดลอง",
    ["Community solar energy pilot", "Environmental monitoring for fruit orchards"],
  ),
];

// ---------------------------------------------------------------------------
// Combined and sorted
// ---------------------------------------------------------------------------

import { registeredCities } from "./registeredCityData.ts";
import { CITY_LEAGUES } from "./cityLeague.ts";

// Phase 14 — attach league taxonomy post-hoc so the factory signature
// stays stable. Cities without a league entry simply hide the badge.
for (const city of [...certifiedCities, ...promotionZoneCities, ...registeredCities]) {
  const league = CITY_LEAGUES[city.id];
  if (league) city.league = league;
}

export const allCities: SmartCity[] = [...certifiedCities, ...promotionZoneCities, ...registeredCities]
  .sort((a, b) => b.compositeScore - a.compositeScore);

export const alphaCities = allCities.filter(c => c.tier === "alpha");
export const betaCities = allCities.filter(c => c.tier === "beta");
export const gammaCities = allCities.filter(c => c.tier === "gamma");
const cityLookup = new Map(allCities.map(city => [city.id, city]));

export function getCityById(id: string): SmartCity | undefined {
  return cityLookup.get(id);
}
