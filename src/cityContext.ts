// ---------------------------------------------------------------------------
// City Context — What makes each city unique
// ---------------------------------------------------------------------------
// For each city: what people do, what it's known for, what's the catch,
// and what opportunities outsiders don't know about.
// This is the human layer on top of the numbers.
// ---------------------------------------------------------------------------

export interface CityContext {
  livelihood: { en: string; th: string };
  famousFor: { en: string; th: string };
  opportunity: { en: string; th: string };
  theCatch: { en: string; th: string };
  landArea?: number; // sq km
  established?: string; // year or era
}

export const cityContexts: Record<string, CityContext> = {
  phuket: {
    livelihood: { en: "Tourism dominates — hotels, restaurants, dive shops, tour operators. Fishing and rubber plantations outside the tourist strip. A growing tech and digital nomad scene around Phuket Town.", th: "การท่องเที่ยวครอบงำ — โรงแรม ร้านอาหาร ร้านดำน้ำ บริษัทนำเที่ยว ประมงและสวนยางนอกเขตท่องเที่ยว กลุ่ม tech และ digital nomad เติบโตรอบเมืองภูเก็ต" },
    famousFor: { en: "Andaman Sea beaches, Patong nightlife, Old Town Sino-Portuguese architecture, seafood, and being Thailand's richest province outside Bangkok.", th: "หาดทะเลอันดามัน ไนท์ไลฟ์ป่าตอง สถาปัตยกรรมชิโน-โปรตุกีสในเมืองเก่า อาหารทะเล และเป็นจังหวัดที่ร่ำรวยที่สุดนอกกรุงเทพฯ" },
    opportunity: { en: "Smart tourism infrastructure is real and exportable. Marine monitoring tech could become an ASEAN model. The 2004 tsunami created a culture of disaster preparedness that other coastal cities lack.", th: "โครงสร้างพื้นฐานการท่องเที่ยวอัจฉริยะเป็นจริงและส่งออกได้ เทคโนโลยีเฝ้าระวังทะเลอาจเป็นโมเดลอาเซียน สึนามิ 2547 สร้างวัฒนธรรมเตรียมพร้อมรับภัยพิบัติที่เมืองชายฝั่งอื่นไม่มี" },
    theCatch: { en: "Overtourism. Water shortages in dry season. Traffic nightmare on the single north-south road. Cost of living rivals Bangkok. Local community voice often drowned by resort money.", th: "นักท่องเที่ยวล้น ขาดแคลนน้ำหน้าแล้ง จราจรฝันร้ายบนถนนเหนือ-ใต้สายเดียว ค่าครองชีพเทียบกรุงเทพฯ เสียงชุมชนท้องถิ่นมักจมหายไปกับเงินรีสอร์ท" },
    landArea: 543,
  },
  samyan: {
    livelihood: { en: "University students, startup founders, office workers in the Samyan-Silom corridor. Creative economy anchored by Chulalongkorn University and True Digital Park.", th: "นักศึกษา ผู้ก่อตั้งสตาร์ทอัพ พนักงานออฟฟิศในระเบียงสามย่าน-สีลม เศรษฐกิจสร้างสรรค์ยึดโยงกับจุฬาฯ และ True Digital Park" },
    famousFor: { en: "Bangkok's innovation district. Samyan Mitrtown. Chulalongkorn University. 200+ startups. One of the few places in Bangkok where walking actually works.", th: "ย่านนวัตกรรมของกรุงเทพฯ สามย่านมิตรทาวน์ จุฬาลงกรณ์มหาวิทยาลัย 200+ สตาร์ทอัพ หนึ่งในไม่กี่ที่ในกรุงเทพฯ ที่เดินได้จริง" },
    opportunity: { en: "5G testbed is live. Smart parking and energy management operational. The university-industry pipeline creates a self-sustaining innovation loop that most Thai cities can't replicate.", th: "5G testbed ใช้งานจริง ที่จอดรถอัจฉริยะและจัดการพลังงานทำงานอยู่ สายพานมหาวิทยาลัย-อุตสาหกรรมสร้างวงจรนวัตกรรมที่ยั่งยืนซึ่งเมืองไทยส่วนใหญ่ทำไม่ได้" },
    theCatch: { en: "Air quality is brutal (PM2.5 32.4). Crime rate is Bangkok-level high. The smart city zone is tiny — walk three blocks and you're back in regular chaotic Bangkok.", th: "คุณภาพอากาศแย่ (PM2.5 32.4) อัตราอาชญากรรมสูงระดับกรุงเทพฯ เขตเมืองอัจฉริยะเล็กมาก เดินออกไปสามบล็อกก็กลับสู่กรุงเทพฯ วุ่นวายปกติ" },
    landArea: 3.2,
  },
  "chiang-mai-old-town": {
    livelihood: { en: "Tourism, handicrafts, university sector, digital nomads, and a growing creative economy. Night bazaar vendors, coffee shop owners, temple restoration artisans.", th: "การท่องเที่ยว หัตถกรรม ภาคมหาวิทยาลัย digital nomad และเศรษฐกิจสร้างสรรค์ที่เติบโต ผู้ค้าตลาดกลางคืน เจ้าของร้านกาแฟ ช่างบูรณะวัด" },
    famousFor: { en: "300+ ancient temples, Doi Suthep, Sunday Walking Street, Lanna culture, the haze crisis, and being Thailand's second city for digital talent.", th: "วัดโบราณ 300+ แห่ง ดอยสุเทพ ถนนคนเดินวันอาทิตย์ วัฒนธรรมล้านนา วิกฤตหมอกควัน และเป็นเมืองอันดับสองสำหรับ talent ดิจิทัล" },
    opportunity: { en: "IoT heritage preservation (sensors on 300+ temples) is globally unique. Air quality monitoring network with 50+ stations could become a model for haze-affected cities across mainland Southeast Asia.", th: "การอนุรักษ์มรดกด้วย IoT (เซ็นเซอร์บนวัด 300+ แห่ง) เป็นสิ่งที่ไม่มีใครเหมือนในโลก เครือข่ายเฝ้าระวังคุณภาพอากาศ 50+ สถานีอาจเป็นโมเดลสำหรับเมืองที่ได้รับผลกระทบจากหมอกควันทั่วเอเชียตะวันออกเฉียงใต้" },
    theCatch: { en: "PM2.5 at 46.1 μg/m³ — 4x WHO guidelines. Burning season (Feb-Apr) makes the city nearly unlivable. Overtourism pressure on Old Town infrastructure. Gentrification pushing locals out.", th: "PM2.5 46.1 μg/m³ — เกินมาตรฐาน WHO 4 เท่า ฤดูเผา (ก.พ.-เม.ย.) ทำให้เมืองแทบอยู่ไม่ได้ แรงกดดันจากนักท่องเที่ยวต่อโครงสร้างพื้นฐานเมืองเก่า gentrification ผลักคนท้องถิ่นออก" },
    landArea: 40.2,
    established: "1296",
  },
  "khon-kaen": {
    livelihood: { en: "University town economy, regional healthcare hub (6 hospitals), agribusiness, and a growing logistics/warehouse sector. The KKTS business consortium drives private-sector smart city investment.", th: "เศรษฐกิจเมืองมหาวิทยาลัย ศูนย์กลางสุขภาพภูมิภาค (6 โรงพยาบาล) ธุรกิจเกษตร และภาคโลจิสติกส์/คลังสินค้าที่เติบโต กลุ่ม KKTS ขับเคลื่อนการลงทุนเมืองอัจฉริยะจากเอกชน" },
    famousFor: { en: "Isan's economic capital. The LRT that's been coming for years. Khon Kaen University. Dinosaur fossils. Being the only Thai city where the private sector — not the government — initiated the smart city push.", th: "เมืองหลวงเศรษฐกิจอีสาน LRT ที่รอมาหลายปี มหาวิทยาลัยขอนแก่น ฟอสซิลไดโนเสาร์ เป็นเมืองไทยเมืองเดียวที่เอกชน — ไม่ใช่รัฐบาล — ริเริ่มการผลักดันเมืองอัจฉริยะ" },
    opportunity: { en: "Private-sector-led model (KKTS consortium) is unique in Thailand and could be exported. Smart bus is already running. High-speed rail connection to Bangkok and Nong Khai (Laos border) will transform logistics.", th: "โมเดลที่นำโดยเอกชน (กลุ่ม KKTS) เป็นเอกลักษณ์ในไทยและส่งออกได้ รถบัสอัจฉริยะวิ่งแล้ว รถไฟความเร็วสูงเชื่อมกรุงเทพฯ-หนองคาย (ชายแดนลาว) จะเปลี่ยนโลจิสติกส์" },
    theCatch: { en: "LRT delayed 7+ years — the poster child for Thai infrastructure delays. Brain drain to Bangkok persists. GPP per capita (฿155K) is high for Isan but still half of Bangkok's.", th: "LRT ล่าช้า 7+ ปี — ตัวอย่างของการล่าช้าโครงสร้างพื้นฐานไทย สมองไหลไปกรุงเทพฯ ยังคงอยู่ GPP ต่อหัว (฿155K) สูงสำหรับอีสานแต่ยังน้อยกว่ากรุงเทพฯ ครึ่งหนึ่ง" },
    landArea: 10886,
  },
  "cmu-smart-city": {
    livelihood: { en: "Students, researchers, university staff. A self-contained campus economy with its own smart energy grid, AI traffic system, and 500+ open datasets.", th: "นักศึกษา นักวิจัย บุคลากรมหาวิทยาลัย เศรษฐกิจแคมปัสแบบพึ่งตัวเองที่มีระบบพลังงานอัจฉริยะ AI จราจร และชุดข้อมูลเปิด 500+ ชุด" },
    famousFor: { en: "Thailand's most genuine smart city R&D engine. 30% campus energy reduction. AI traffic at 12 intersections. Doi Suthep as the backdrop.", th: "เครื่องยนต์ R&D เมืองอัจฉริยะที่จริงที่สุดของไทย ลดพลังงานแคมปัส 30% AI จราจรที่ 12 สี่แยก ดอยสุเทพเป็นฉากหลัง" },
    opportunity: { en: "The campus is a living lab — every innovation can be tested, measured, and iterated before scaling to a city. The open data platform (500+ datasets) is the most complete of any Thai smart city.", th: "แคมปัสเป็นห้องทดลองจริง — ทุกนวัตกรรมทดสอบ วัดผล และปรับปรุงได้ก่อนขยายสู่เมือง แพลตฟอร์มข้อมูลเปิด (500+ ชุดข้อมูล) สมบูรณ์ที่สุดของเมืองอัจฉริยะไทย" },
    theCatch: { en: "It's a campus, not a city. Population 45K. What works for university students may not scale to a diverse urban population. Same PM2.5 crisis as Chiang Mai.", th: "เป็นแคมปัส ไม่ใช่เมือง ประชากร 45K สิ่งที่ใช้ได้กับนักศึกษาอาจไม่ขยายไปสู่ประชากรเมืองที่หลากหลาย วิกฤต PM2.5 เดียวกับเชียงใหม่" },
    landArea: 3.5,
    established: "1964",
  },
  "nakhon-si-thammarat": {
    livelihood: { en: "Government services, rubber and palm oil plantations, fisheries, small commerce. A provincial capital with deep Buddhist cultural roots — Wat Phra Mahathat is one of Thailand's most sacred sites.", th: "ราชการ สวนยางและปาล์ม ประมง พาณิชย์ย่อย เมืองเอกที่มีรากวัฒนธรรมพุทธลึก — วัดพระมหาธาตุเป็นสถานที่ศักดิ์สิทธิ์ที่สุดแห่งหนึ่งของไทย" },
    famousFor: { en: "The city that listened. 112K app users. 10-hour flood warning. Zero flood fatalities since 2021. The ASEAN CSCO Handbook model city. Mayor Kanop's LINE Q&A sessions.", th: "เมืองที่ฟัง ผู้ใช้แอป 112K เตือนน้ำท่วมล่วงหน้า 10 ชั่วโมง ไม่มีผู้เสียชีวิตจากน้ำท่วมตั้งแต่ 2564 เมืองต้นแบบ ASEAN CSCO Handbook นายก Kanop ตอบคำถามบน LINE" },
    opportunity: { en: "The citizen-centric model is copyable and cheap. No exotic tech required. LINE-based governance, flood sensors, and a 5-star service rating — all replicable by any Thai municipality with political will.", th: "โมเดลเน้นประชาชนลอกได้และถูก ไม่ต้องใช้เทคโนโลยีแพง การปกครองผ่าน LINE เซ็นเซอร์น้ำท่วม และระบบให้คะแนนบริการ 5 ดาว — ทั้งหมดทำซ้ำได้โดยเทศบาลไทยที่มีเจตจำนงทางการเมือง" },
    theCatch: { en: "Low GPP (฿118K/capita). Youth out-migration to Bangkok. The success depends heavily on one mayor's leadership style — institutional continuity is the risk.", th: "GPP ต่ำ (฿118K/หัว) เยาวชนอพยพไปกรุงเทพฯ ความสำเร็จพึ่งพาสไตล์ผู้นำของนายกคนเดียวมาก ความต่อเนื่องเชิงสถาบันคือความเสี่ยง" },
    landArea: 9943,
    established: "~700s CE",
  },
  "hat-yai": {
    livelihood: { en: "Cross-border trade with Malaysia, retail, wholesale markets, healthcare tourism for Malaysian visitors, and rubber trading. Thailand's southern commercial hub.", th: "การค้าชายแดนกับมาเลเซีย ค้าปลีก ตลาดค้าส่ง ท่องเที่ยวเชิงสุขภาพสำหรับนักท่องเที่ยวมาเลย์ และค้ายาง ศูนย์กลางการค้าภาคใต้ของไทย" },
    famousFor: { en: "Flooding. Seriously — smart flood management is the critical infrastructure here. Also: night markets, cross-border shopping, and being the gateway between Thailand and Malaysia.", th: "น้ำท่วม — จริงจัง ระบบจัดการน้ำท่วมอัจฉริยะคือโครงสร้างพื้นฐานสำคัญที่นี่ ยังมี: ตลาดกลางคืน ช้อปปิ้งข้ามพรมแดน และเป็นประตูระหว่างไทย-มาเลเซีย" },
    opportunity: { en: "ASUS Phase II (UN-Habitat) is developing a Climate Change Adaptation Roadmap. THB 3.5M already budgeted for 400 CCTV. Hat Yai-Sadao Motorway ($903M) in ASEAN Infrastructure Pipeline.", th: "ASUS Phase II (UN-Habitat) กำลังพัฒนา Climate Change Adaptation Roadmap งบ 3.5 ล้านบาทอนุมัติแล้วสำหรับ CCTV 400 ตัว มอเตอร์เวย์หาดใหญ่-สะเดา ($903M) ในท่อ ASEAN Infrastructure Pipeline" },
    theCatch: { en: "Recurring floods. Proximity to deep south security situation. Crime rate 168/100K. The commercial vibrancy masks infrastructure aging that needs urgent attention.", th: "น้ำท่วมซ้ำ ใกล้สถานการณ์ความมั่นคงชายแดนใต้ อัตราอาชญากรรม 168/100K ความคึกคักทางการค้าปิดบังโครงสร้างพื้นฐานที่เก่าและต้องดูแลเร่งด่วน" },
    landArea: 21,
  },
  yala: {
    livelihood: { en: "Government services, rubber plantations, halal food processing, and security forces. A city defined by its position in the deep south conflict zone — but determined to build despite it.", th: "ราชการ สวนยาง แปรรูปอาหารฮาลาล และกองกำลังรักษาความปลอดภัย เมืองที่ถูกกำหนดโดยตำแหน่งในพื้นที่ขัดแย้งชายแดนใต้ — แต่มุ่งมั่นสร้างแม้อยู่ในสถานการณ์นั้น" },
    famousFor: { en: "Thailand's cleanest city — 4 consecutive years. Green space management exceeding national standards. Smart city achievements despite being in an active conflict zone.", th: "เมืองสะอาดที่สุดของไทย — 4 ปีติดต่อกัน จัดการพื้นที่สีเขียวเกินมาตรฐานชาติ ความสำเร็จเมืองอัจฉริยะแม้อยู่ในเขตขัดแย้ง" },
    opportunity: { en: "If Yala can build a smart city in a conflict zone, it proves the model works anywhere. The Smart Environment excellence award is genuine — this is a city that earns its scores.", th: "ถ้ายะลาสร้างเมืองอัจฉริยะในเขตขัดแย้งได้ มันพิสูจน์ว่าโมเดลใช้ได้ทุกที่ รางวัล Smart Environment เป็นของจริง — เมืองนี้สมควรกับคะแนนที่ได้" },
    theCatch: { en: "Security situation. Crime rate 245/100K. Lowest GPP in the index (฿95K). Youth leave for safer cities. International investment is near zero due to perceived risk.", th: "สถานการณ์ความมั่นคง อัตราอาชญากรรม 245/100K GPP ต่ำสุดในดัชนี (฿95K) เยาวชนออกไปเมืองที่ปลอดภัยกว่า การลงทุนจากต่างประเทศเกือบเป็นศูนย์เนื่องจากความเสี่ยงที่รับรู้" },
    landArea: 4521,
  },
  krabi: {
    livelihood: { en: "Tourism (Phi Phi, Railay Beach, island hopping), rubber and palm oil plantations, fisheries. A quieter Andaman alternative to Phuket with genuine marine conservation efforts.", th: "ท่องเที่ยว (พีพี ไร่เลย์ ทัวร์เกาะ) สวนยางและปาล์ม ประมง ทางเลือกอันดามันที่เงียบกว่าภูเก็ตพร้อมความพยายามอนุรักษ์ทะเลจริง" },
    famousFor: { en: "Phi Phi Islands, Railay Beach, limestone karsts, marine national parks. Genuine smart environmental monitoring that protects the islands from overtourism.", th: "หมู่เกาะพีพี หาดไร่เลย์ หินปูนคาร์สต์ อุทยานแห่งชาติทางทะเล เฝ้าระวังสิ่งแวดล้อมอัจฉริยะจริงที่ปกป้องเกาะจากนักท่องเที่ยวล้น" },
    opportunity: { en: "Marine conservation tech could become the ASEAN standard for island tourism management. Renewable energy pilot underway. Clean air (PM2.5 14.5) and high green coverage (55%).", th: "เทคโนโลยีอนุรักษ์ทะเลอาจเป็นมาตรฐานอาเซียนสำหรับจัดการท่องเที่ยวเกาะ โครงการนำร่องพลังงานหมุนเวียน อากาศสะอาด (PM2.5 14.5) และพื้นที่สีเขียวสูง (55%)" },
    theCatch: { en: "Tourism-economy tension is real — conservation competes with resort development money. Infrastructure outside tourist areas is weak. Economy collapses without visitors.", th: "ความขัดแย้งท่องเที่ยว-เศรษฐกิจเป็นจริง — การอนุรักษ์แข่งกับเงินพัฒนารีสอร์ท โครงสร้างพื้นฐานนอกเขตท่องเที่ยวอ่อนแอ เศรษฐกิจพังถ้าไม่มีนักท่องเที่ยว" },
    landArea: 4708,
  },
  rayong: {
    livelihood: { en: "Petrochemicals (Map Ta Phut industrial estate), automotive manufacturing, fruit orchards (durian, rambutan), and fishing. Thailand's highest GPP per capita (฿1.02M) outside Bangkok.", th: "ปิโตรเคมี (นิคมอุตสาหกรรมมาบตาพุด) ผลิตรถยนต์ สวนผลไม้ (ทุเรียน เงาะ) และประมง GPP ต่อหัวสูงสุดของไทย (฿1.02M) นอกกรุงเทพฯ" },
    famousFor: { en: "Richest province by GPP. Map Ta Phut industrial zone. EEC anchor. Smart environmental monitoring around chemical plants — genuinely useful for public health.", th: "จังหวัดที่ร่ำรวยที่สุดตาม GPP นิคมอุตสาหกรรมมาบตาพุด เสาหลัก EEC เฝ้าระวังสิ่งแวดล้อมอัจฉริยะรอบโรงงานเคมี — มีประโยชน์จริงต่อสาธารณสุข" },
    opportunity: { en: "EEC investment pipeline is massive (THB 1.35T through 2037). Environmental monitoring tech developed here for industrial zones could be exported to other ASEAN industrial corridors.", th: "ท่อลงทุน EEC มหาศาล (1.35 ล้านล้านบาท ถึง 2580) เทคโนโลยีเฝ้าระวังสิ่งแวดล้อมที่พัฒนาที่นี่สำหรับเขตอุตสาหกรรมส่งออกไประเบียงอุตสาหกรรมอาเซียนอื่นได้" },
    theCatch: { en: "Environmental contamination history. Community health concerns around Map Ta Phut. The wealth is industrial — residents don't feel rich. Air and water quality require constant vigilance.", th: "ประวัติการปนเปื้อนสิ่งแวดล้อม ความกังวลด้านสุขภาพชุมชนรอบมาบตาพุด ความมั่งคั่งเป็นแบบอุตสาหกรรม — ผู้อยู่อาศัยไม่รู้สึกรวย คุณภาพอากาศและน้ำต้องเฝ้าระวังตลอด" },
    landArea: 3552,
  },
  "wangchan-valley": {
    livelihood: { en: "Nobody lives here. Population: 0. It's a PTT innovation campus concept on empty land in Rayong province.", th: "ไม่มีใครอาศัยอยู่ที่นี่ ประชากร: 0 เป็นแนวคิดแคมปัสนวัตกรรม PTT บนที่ดินว่างในจังหวัดระยอง" },
    famousFor: { en: "Being ranked #1 smart city in Thailand by the old index. In reality: less than 10% built. The emperor has no clothes.", th: "ถูกจัดอันดับ #1 เมืองอัจฉริยะไทยจากดัชนีเก่า ในความเป็นจริง: สร้างไม่ถึง 10% จักรพรรดิไม่มีเสื้อผ้า" },
    opportunity: { en: "If PTT actually builds it, the land and infrastructure planning are sound. EECi concept is aligned with national policy. But until shovels hit dirt, it's just a masterplan.", th: "ถ้า PTT สร้างจริง การวางแผนที่ดินและโครงสร้างพื้นฐานดี แนวคิด EECi ตรงกับนโยบายชาติ แต่จนกว่าจะเริ่มขุด มันก็แค่แผนแม่บท" },
    theCatch: { en: "Zero residents. Zero commercial activity. Zero operational infrastructure. The logo was awarded to a concept, not a city. This is why this index exists.", th: "ผู้อยู่อาศัย ศูนย์ กิจกรรมเชิงพาณิชย์ ศูนย์ โครงสร้างพื้นฐานปฏิบัติการ ศูนย์ ตราสัญลักษณ์มอบให้กับแนวคิด ไม่ใช่เมือง นี่คือเหตุผลที่ดัชนีนี้มีอยู่" },
    landArea: 32,
  },
};

/** Get city context — returns undefined if no context exists for that city */
export function getCityContext(cityId: string): CityContext | undefined {
  return cityContexts[cityId];
}
