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
  "mae-moh": {
    livelihood: { en: "EGAT power plant workers, coal mining legacy community, small-scale agriculture. A company town transitioning — the power plant is the economy.", th: "พนักงานโรงไฟฟ้า กฟผ. ชุมชนมรดกเหมืองถ่านหิน เกษตรขนาดเล็ก เมืองบริษัทที่กำลังเปลี่ยนผ่าน — โรงไฟฟ้าคือเศรษฐกิจ" },
    famousFor: { en: "Coal-to-clean energy transition. EGAT smart grid pilot. Air quality monitoring born from necessity — residents demanded it after years of pollution.", th: "การเปลี่ยนผ่านจากถ่านหินสู่พลังงานสะอาด โครงการนำร่อง smart grid ของ กฟผ. ระบบตรวจวัดคุณภาพอากาศเกิดจากความจำเป็น — ชาวบ้านเรียกร้องหลังหลายปีของมลพิษ" },
    opportunity: { en: "Smart energy monitoring here is genuinely world-class. The coal-to-clean transition model could be exported to other EGAT sites and ASEAN coal communities.", th: "ระบบติดตามพลังงานอัจฉริยะที่นี่เป็นระดับโลกจริงๆ โมเดลเปลี่ยนผ่านถ่านหินสู่สะอาดส่งออกไปไซต์ กฟผ. อื่นและชุมชนถ่านหินอาเซียนได้" },
    theCatch: { en: "Industrial legacy means air and soil quality challenges persist. Population small (42K). Young people leave for Chiang Mai or Bangkok.", th: "มรดกอุตสาหกรรมหมายถึงปัญหาคุณภาพอากาศและดินยังคงอยู่ ประชากรน้อย (42K) คนหนุ่มสาวออกไปเชียงใหม่หรือกรุงเทพฯ" },
    landArea: 857,
  },
  nakhonsawan: {
    livelihood: { en: "River trade, rice farming, freshwater fisheries, government services. Located at the confluence of the Ping and Nan rivers — geography defines everything here.", th: "ค้าขายทางน้ำ ทำนา ประมงน้ำจืด ราชการ ตั้งอยู่ที่จุดบรรจบแม่น้ำปิงและน่าน — ภูมิศาสตร์กำหนดทุกอย่างที่นี่" },
    famousFor: { en: "Smart flood management with 30+ IoT river sensors. The confluence location makes flooding existential — smart tech here saves lives, not just time.", th: "จัดการน้ำท่วมอัจฉริยะด้วยเซ็นเซอร์แม่น้ำ IoT 30+ จุด ตำแหน่งจุดบรรจบทำให้น้ำท่วมเป็นเรื่องชีวิตตาย เทคอัจฉริยะที่นี่ช่วยชีวิต ไม่ใช่แค่ประหยัดเวลา" },
    opportunity: { en: "Flood sensor network could become the template for every Thai river city. Digital agriculture pilot for rice farmers shows how tech reaches the 80% of Thailand that isn't Bangkok.", th: "เครือข่ายเซ็นเซอร์น้ำท่วมอาจเป็นแม่แบบสำหรับเมืองริมแม่น้ำทุกเมืองในไทย โครงการเกษตรดิจิทัลสำหรับชาวนาแสดงให้เห็นว่าเทคไปถึง 80% ของไทยที่ไม่ใช่กรุงเทพฯ ได้อย่างไร" },
    theCatch: { en: "Broader digital adoption is still early. Economy is agriculture-dependent. Young talent migrates to Bangkok. GPP per capita (฿138K) is below national average.", th: "การนำดิจิทัลไปใช้ในวงกว้างยังอยู่ในช่วงเริ่มต้น เศรษฐกิจพึ่งพาเกษตร คนหนุ่มสาวย้ายไปกรุงเทพฯ GPP ต่อหัว (฿138K) ต่ำกว่าค่าเฉลี่ยประเทศ" },
    landArea: 9598,
  },
  saensuk: {
    livelihood: { en: "Beach tourism, seafood restaurants, university students (Burapha University nearby), and a growing residential suburb of the EEC corridor.", th: "ท่องเที่ยวชายหาด ร้านอาหารทะเล นักศึกษา (มหาวิทยาลัยบูรพาใกล้) และชานเมืองที่อยู่อาศัยที่เติบโตของระเบียง EEC" },
    famousFor: { en: "Real-time beach water quality monitoring — bacteria counts visible to the public. Smart waste collection with GPS-tracked trucks. Small but genuine.", th: "เฝ้าระวังคุณภาพน้ำชายหาดเรียลไทม์ — ปริมาณแบคทีเรียเปิดเผยต่อสาธารณะ เก็บขยะอัจฉริยะด้วยรถติดตาม GPS เล็กแต่จริง" },
    opportunity: { en: "A model for how small beachfront municipalities can do smart city right. Low cost, high impact. The water quality transparency approach is replicable everywhere.", th: "โมเดลว่าเทศบาลริมหาดขนาดเล็กทำเมืองอัจฉริยะถูกวิธีได้อย่างไร ต้นทุนต่ำ ผลกระทบสูง แนวทางความโปร่งใสคุณภาพน้ำทำซ้ำได้ทุกที่" },
    theCatch: { en: "Population only 82K. Economy depends on tourism and university cycle. Not enough scale to attract major private investment.", th: "ประชากรเพียง 82K เศรษฐกิจพึ่งพาวงจรท่องเที่ยวและมหาวิทยาลัย ไม่มี scale พอดึงดูดการลงทุนเอกชนรายใหญ่" },
    landArea: 21,
  },
  chachoengsao: {
    livelihood: { en: "Manufacturing (auto parts, electronics), logistics, warehousing. The gateway to the EEC — factories and distribution centers define the economy.", th: "การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) โลจิสติกส์ คลังสินค้า ประตูสู่ EEC — โรงงานและศูนย์กระจายสินค้ากำหนดเศรษฐกิจ" },
    famousFor: { en: "EEC gateway with genuine smart infrastructure. Digital citizen services portal. Smart flood early warning. 5G connectivity via EEC backbone.", th: "ประตู EEC ที่มีโครงสร้างพื้นฐานอัจฉริยะจริง พอร์ทัลบริการประชาชนดิจิทัล เตือนน้ำท่วมอัจฉริยะ 5G เชื่อมผ่าน EEC" },
    opportunity: { en: "The highest GPP per capita (฿422K) among EEC cities outside Rayong. Connected to high-speed rail project. Smart industrial zone management is a genuine differentiator.", th: "GPP ต่อหัวสูงสุด (฿422K) ในเมือง EEC นอกระยอง เชื่อมกับรถไฟความเร็วสูง การจัดการเขตอุตสาหกรรมอัจฉริยะเป็นจุดแข็งที่แท้จริง" },
    theCatch: { en: "Livability lags behind economic output. Industrial growth doesn't always translate to quality of life. Traffic congestion growing as EEC expands.", th: "ความน่าอยู่ตามหลังผลผลิตเศรษฐกิจ การเติบโตอุตสาหกรรมไม่ได้แปลเป็นคุณภาพชีวิตเสมอ จราจรติดขัดมากขึ้นเมื่อ EEC ขยาย" },
    landArea: 5351,
  },
  "chiang-rai": {
    livelihood: { en: "Tourism (White Temple, Blue Temple, Golden Triangle), tea and coffee plantations, border trade with Laos and Myanmar.", th: "ท่องเที่ยว (วัดร่องขุ่น วัดร่องเสือเต้น สามเหลี่ยมทองคำ) ไร่ชาและกาแฟ ค้าชายแดนกับลาวและเมียนมา" },
    famousFor: { en: "Smart tourism platform for heritage sites. Digital agriculture for tea and coffee farmers. Air quality monitoring — same burning haze problem as Chiang Mai.", th: "แพลตฟอร์มท่องเที่ยวอัจฉริยะสำหรับแหล่งมรดก เกษตรดิจิทัลสำหรับชาวไร่ชาและกาแฟ ตรวจวัดคุณภาพอากาศ — ปัญหาหมอกควันเดียวกับเชียงใหม่" },
    opportunity: { en: "Border trade digitization with Laos and Myanmar is a genuine niche. Tea and coffee smart agriculture could scale across northern Thailand's hill country.", th: "ดิจิทัลค้าชายแดนกับลาวและเมียนมาเป็น niche จริง เกษตรอัจฉริยะชากาแฟขยายได้ทั่วภูเขาภาคเหนือ" },
    theCatch: { en: "PM2.5 at 42.8 μg/m³ — nearly as bad as Chiang Mai. Lowest economy score among northern cities. Remote location limits private investment.", th: "PM2.5 42.8 μg/m³ — เกือบแย่เท่าเชียงใหม่ คะแนนเศรษฐกิจต่ำสุดในเมืองเหนือ ทำเลห่างไกลจำกัดการลงทุนเอกชน" },
    landArea: 11678,
  },
  nan: {
    livelihood: { en: "Subsistence agriculture, forest products, heritage tourism, community-based conservation. One of Thailand's poorest provinces but richest in natural capital.", th: "เกษตรยังชีพ ผลิตภัณฑ์จากป่า ท่องเที่ยวเชิงมรดก การอนุรักษ์โดยชุมชน จังหวัดที่ยากจนที่สุดแต่อุดมด้วยทุนธรรมชาติ" },
    famousFor: { en: "Community-driven forest fire monitoring. Smart heritage preservation for Nan old town. The highest green coverage (72%) of any smart city in the index.", th: "เฝ้าระวังไฟป่าโดยชุมชน อนุรักษ์มรดกอัจฉริยะสำหรับเมืองเก่าน่าน พื้นที่สีเขียวสูงสุด (72%) ของเมืองอัจฉริยะทุกเมืองในดัชนี" },
    opportunity: { en: "Community-driven model is the cheapest and most sustainable smart city approach. If it works in Nan (GPP ฿88K), it works anywhere.", th: "โมเดลที่ขับเคลื่อนโดยชุมชนเป็นแนวทางเมืองอัจฉริยะที่ถูกที่สุดและยั่งยืนที่สุด ถ้ามันใช้ได้ในน่าน (GPP ฿88K) มันใช้ได้ทุกที่" },
    theCatch: { en: "Lowest GPP in the north (฿88K). Young people leave. PM2.5 35.5 from burning season. Digital infrastructure is minimal beyond the pilot areas.", th: "GPP ต่ำสุดในภาคเหนือ (฿88K) คนหนุ่มสาวออกไป PM2.5 35.5 จากฤดูเผา โครงสร้างพื้นฐานดิจิทัลน้อยมากนอกพื้นที่นำร่อง" },
    landArea: 11472,
  },
  korat: {
    livelihood: { en: "Regional trade hub, manufacturing (auto parts, electronics), university sector (Suranaree University of Technology), agriculture processing.", th: "ศูนย์กลางการค้าภูมิภาค การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) ภาคมหาวิทยาลัย (มทส.) แปรรูปเกษตร" },
    famousFor: { en: "Isan's gateway. Connected to the Bangkok-Nong Khai high-speed rail (Cabinet approved Feb 2025). Smart traffic management. The largest city in northeast Thailand.", th: "ประตูอีสาน เชื่อมกับรถไฟความเร็วสูงกรุงเทพฯ-หนองคาย (ครม. อนุมัติ ก.พ. 2568) จัดการจราจรอัจฉริยะ เมืองใหญ่ที่สุดในอีสาน" },
    opportunity: { en: "High-speed rail will transform Korat from a 3-hour drive to a 90-minute commute from Bangkok. Smart city infrastructure can ride the rail investment wave.", th: "รถไฟความเร็วสูงจะเปลี่ยนโคราชจากขับรถ 3 ชม. เป็นเดินทาง 90 นาทีจากกรุงเทพฯ โครงสร้างพื้นฐานเมืองอัจฉริยะขี่คลื่นการลงทุนรถไฟได้" },
    theCatch: { en: "Still building momentum — not yet at Alpha tier (64.9). Population 2.65M makes service delivery complex. Brain drain to Bangkok despite being Isan's biggest city.", th: "ยังสร้างโมเมนตัม — ยังไม่ถึงระดับ Alpha (64.9) ประชากร 2.65 ล้านทำให้การส่งมอบบริการซับซ้อน สมองไหลไปกรุงเทพฯ แม้เป็นเมืองใหญ่สุดของอีสาน" },
    landArea: 2314,
  },
  "phitsanulok-muni": {
    livelihood: { en: "Government hub for the lower north, agriculture (rice, sugarcane), university sector (Naresuan University), and regional healthcare.", th: "ศูนย์กลางราชการภาคเหนือตอนล่าง เกษตร (ข้าว อ้อย) ภาคมหาวิทยาลัย (ม.นเรศวร) และสาธารณสุขภูมิภาค" },
    famousFor: { en: "Smart governance platform with 80%+ citizen adoption. Smart street lighting reducing energy 35%. Unflashy but genuinely delivers.", th: "แพลตฟอร์มปกครองอัจฉริยะที่ประชาชนใช้ 80%+ ไฟถนนอัจฉริยะลดพลังงาน 35% ไม่โอ้อวดแต่ส่งมอบจริง" },
    opportunity: { en: "The quiet workhorse model — no headlines but 80% citizen adoption of digital services is higher than most Alpha-tier cities. Proof that unglamorous execution wins.", th: "โมเดลม้าทำงานเงียบๆ — ไม่มีพาดหัวแต่ประชาชนใช้บริการดิจิทัล 80% สูงกว่าเมือง Alpha ส่วนใหญ่ พิสูจน์ว่าการทำงานไม่หวือหวาชนะ" },
    theCatch: { en: "Beta tier (64.8) despite strong governance — economy and environment scores hold it back. PM2.5 30.2 from northern burning. Not enough economic pull to retain graduates.", th: "ระดับ Beta (64.8) แม้ปกครองแข็ง — คะแนนเศรษฐกิจและสิ่งแวดล้อมดึงลง PM2.5 30.2 จากการเผาภาคเหนือ ดึงดูดบัณฑิตไม่พอ" },
    landArea: 10816,
  },
  lampang: {
    livelihood: { en: "Ceramics (Lampang is 'the pottery city'), horse-drawn carriages (tourism icon), agriculture, and EGAT power generation from nearby Mae Moh.", th: "เซรามิก (ลำปางคือ 'เมืองเครื่องปั้นดินเผา') รถม้า (ไอคอนท่องเที่ยว) เกษตร และผลิตไฟฟ้า กฟผ. จากแม่เมาะใกล้ๆ" },
    famousFor: { en: "Heritage-tech fusion. Smart tourism around horse carriage routes. Clean energy from Mae Moh coal transition. Batch 3 certified — newer but building fast.", th: "ผสมผสานมรดก-เทคโนโลยี ท่องเที่ยวอัจฉริยะรอบเส้นทางรถม้า พลังงานสะอาดจากการเปลี่ยนผ่านแม่เมาะ รุ่น 3 รับรอง — ใหม่กว่าแต่สร้างเร็ว" },
    opportunity: { en: "Ceramics + heritage tourism + clean energy = a unique identity no other Thai smart city has. Could become the model for cultural smart cities.", th: "เซรามิก + ท่องเที่ยวเชิงมรดก + พลังงานสะอาด = อัตลักษณ์ที่ไม่มีเมืองอัจฉริยะไทยอื่นมี อาจเป็นโมเดลเมืองอัจฉริยะเชิงวัฒนธรรม" },
    theCatch: { en: "PM2.5 38.5 — burning season is brutal in Lampang basin. Economy is small-scale and local. Not enough tech talent to sustain digital innovation long-term.", th: "PM2.5 38.5 — ฤดูเผารุนแรงในแอ่งลำปาง เศรษฐกิจเล็กและท้องถิ่น talent เทคไม่พอรักษานวัตกรรมดิจิทัลระยะยาว" },
    landArea: 12534,
  },
  samui: {
    livelihood: { en: "Tourism (resorts, diving, full moon parties), coconut farming, fishing. An island economy entirely dependent on visitor arrivals.", th: "ท่องเที่ยว (รีสอร์ท ดำน้ำ ฟูลมูนปาร์ตี้) ทำสวนมะพร้าว ประมง เศรษฐกิจเกาะที่พึ่งพานักท่องเที่ยวทั้งหมด" },
    famousFor: { en: "Smart waste and water management for an island that desperately needs it. Tourism pressure is intense — 68K residents serving millions of visitors.", th: "จัดการขยะและน้ำอัจฉริยะสำหรับเกาะที่ต้องการอย่างยิ่ง แรงกดดันท่องเที่ยวรุนแรง — ผู้อยู่อาศัย 68K รองรับนักท่องเที่ยวหลายล้าน" },
    opportunity: { en: "Island sustainability tech is globally relevant. Smart water management during droughts can be exported to every Thai island and beyond.", th: "เทคความยั่งยืนเกาะเกี่ยวข้องกับระดับโลก จัดการน้ำอัจฉริยะช่วงแล้งส่งออกไปเกาะไทยทุกเกาะและไกลกว่า" },
    theCatch: { en: "Economy collapses without tourists. Water shortages in dry season. Crime rate 175/100K — tourism brings problems too. Infrastructure aging fast under visitor pressure.", th: "เศรษฐกิจพังถ้าไม่มีนักท่องเที่ยว ขาดแคลนน้ำหน้าแล้ง อาชญากรรม 175/100K — การท่องเที่ยวนำปัญหามาด้วย โครงสร้างพื้นฐานเก่าเร็วภายใต้แรงกดดันนักท่องเที่ยว" },
    landArea: 228,
  },
  "phra-ram-4": {
    livelihood: { en: "Office workers, financial sector, commercial real estate. Bangkok's CBD spine — Silom, Sathorn, and Lumpini in one corridor.", th: "พนักงานออฟฟิศ ภาคการเงิน อสังหาริมทรัพย์เชิงพาณิชย์ กระดูกสันหลัง CBD กรุงเทพฯ — สีลม สาทร และลุมพินีในระเบียงเดียว" },
    famousFor: { en: "Smart traffic signal optimization along 4km corridor. The most commercially valuable smart city zone in Thailand — every improvement here has outsized economic impact.", th: "ปรับจังหวะสัญญาณจราจรอัจฉริยะตลอดระเบียง 4 กม. เขตเมืองอัจฉริยะที่มีมูลค่าเชิงพาณิชย์สูงสุดในไทย — ทุกการปรับปรุงมีผลกระทบทางเศรษฐกิจเกินสัดส่วน" },
    opportunity: { en: "Land value capture potential is massive — BTS/MRT proximity drives property values. Smart traffic here directly impacts millions of daily commuters.", th: "ศักยภาพจับมูลค่าที่ดินมหาศาล — ความใกล้ BTS/MRT ขับเคลื่อนราคาอสังหาฯ จราจรอัจฉริยะที่นี่กระทบผู้โดยสารรายวันหลายล้านคนโดยตรง" },
    theCatch: { en: "PM2.5 32.4 — brutal air quality. Crime rate 285/100K — Bangkok-level. Congestion and air quality remain unsolved despite smart traffic. Green coverage only 12%.", th: "PM2.5 32.4 — คุณภาพอากาศแย่มาก อาชญากรรม 285/100K ระดับกรุงเทพฯ จราจรติดขัดและคุณภาพอากาศยังแก้ไม่ได้แม้มีจราจรอัจฉริยะ พื้นที่สีเขียวเพียง 12%" },
    landArea: 8.5,
  },
  makkasan: {
    livelihood: { en: "Nobody lives here yet. Planned as a mega transit hub connecting Airport Rail Link, MRT, and intercity rail — but construction hasn't started.", th: "ยังไม่มีใครอาศัยอยู่ วางแผนเป็นศูนย์กลางขนส่งขนาดใหญ่เชื่อม Airport Rail Link, MRT, และรถไฟระหว่างเมือง — แต่ยังไม่เริ่มก่อสร้าง" },
    famousFor: { en: "Being certified as a smart city despite having zero residents and zero operational infrastructure. The masterplan looks impressive. The reality is empty.", th: "ได้รับรองเป็นเมืองอัจฉริยะทั้งที่ไม่มีผู้อยู่อาศัยและไม่มีโครงสร้างพื้นฐานปฏิบัติการ แผนแม่บทดูน่าประทับใจ ความจริงว่างเปล่า" },
    opportunity: { en: "If the transit hub is built, the location (central Bangkok, next to Airport Rail Link) is genuinely world-class. The land value alone justifies smart infrastructure.", th: "ถ้าศูนย์กลางขนส่งถูกสร้าง ทำเล (กลางกรุงเทพฯ ติด Airport Rail Link) เป็นระดับโลกจริง มูลค่าที่ดินเพียงอย่างเดียวก็คุ้มค่าโครงสร้างพื้นฐานอัจฉริยะ" },
    theCatch: { en: "Zero residents. Zero infrastructure. Zero timeline. The logo was awarded to a concept. This is exactly why this index measures reality.", th: "ผู้อยู่อาศัย ศูนย์ โครงสร้างพื้นฐาน ศูนย์ ไทม์ไลน์ ศูนย์ ตราสัญลักษณ์มอบให้กับแนวคิด นี่คือเหตุผลที่ดัชนีนี้วัดความจริง" },
  },
  "klong-phadung": {
    livelihood: { en: "Historic canal community — small traders, food vendors, government workers. A living heritage district being revitalized with smart water management and connected public spaces.", th: "ชุมชนคลองประวัติศาสตร์ — พ่อค้ารายย่อย ร้านอาหาร ข้าราชการ ย่านมรดกมีชีวิตที่ฟื้นฟูด้วยการจัดการน้ำอัจฉริยะและพื้นที่สาธารณะเชื่อมต่อ" },
    famousFor: { en: "Smart water quality monitoring in the canal system. AR cultural heritage walk. A genuine urban renewal project in old Bangkok.", th: "เฝ้าระวังคุณภาพน้ำอัจฉริยะในระบบคลอง เดินเที่ยวมรดกวัฒนธรรม AR โครงการฟื้นฟูเมืองจริงในย่านเก่ากรุงเทพฯ" },
    opportunity: { en: "Canal-based smart cities are globally rare. If this works, it's an exportable model for Venice, Amsterdam, Suzhou — any city with historic waterways.", th: "เมืองอัจฉริยะริมคลองหายากระดับโลก ถ้าสำเร็จ มันเป็นโมเดลส่งออกสำหรับเวนิส อัมสเตอร์ดัม ซูโจว — เมืองใดก็ตามที่มีทางน้ำประวัติศาสตร์" },
    theCatch: { en: "Bangkok-level PM2.5 (32.4) and crime (285/100K). The smart canal project is small-scale. Scaling beyond the pilot area requires political will that comes and goes.", th: "PM2.5 ระดับกรุงเทพฯ (32.4) และอาชญากรรม (285/100K) โครงการคลองอัจฉริยะขนาดเล็ก ขยายเกินพื้นที่นำร่องต้องใช้เจตจำนงทางการเมืองที่มาๆ ไปๆ" },
  },
  phangnga: {
    livelihood: { en: "Tourism (Similan Islands, Khao Lak), fishing, rubber/palm oil. Defined by the 2004 tsunami — disaster preparedness is in this city's DNA.", th: "ท่องเที่ยว (หมู่เกาะสิมิลัน เขาหลัก) ประมง ยาง/ปาล์ม นิยามโดยสึนามิ 2547 — การเตรียมพร้อมรับภัยพิบัติอยู่ใน DNA ของเมือง" },
    famousFor: { en: "Tsunami early warning system with IoT sensors. Smart mangrove conservation monitoring. The only Thai smart city where disaster tech isn't a nice-to-have but a survival necessity.", th: "ระบบเตือนสึนามีด้วยเซ็นเซอร์ IoT เฝ้าระวังอนุรักษ์ป่าชายเลน เมืองอัจฉริยะไทยเมืองเดียวที่เทคภัยพิบัติไม่ใช่ของดี แต่เป็นความจำเป็นเพื่ออยู่รอด" },
    opportunity: { en: "Disaster-resilient smart city tech is a growing global market. Phang Nga's lived experience with tsunami response makes it a credible exporter of resilience tech.", th: "เทคเมืองอัจฉริยะทนภัยพิบัติเป็นตลาดโลกที่เติบโต ประสบการณ์จริงของพังงากับการตอบสนองสึนามิทำให้เป็นผู้ส่งออกเทคทนทานที่น่าเชื่อถือ" },
    theCatch: { en: "Low GPP (฿158K). Small population (264K). Young people leave for Phuket or Bangkok. The smart city tech is genuine but the economic base to sustain it is thin.", th: "GPP ต่ำ (฿158K) ประชากรน้อย (264K) คนหนุ่มสาวออกไปภูเก็ตหรือกรุงเทพฯ เทคเมืองอัจฉริยะจริงแต่ฐานเศรษฐกิจที่จะรักษาไว้บาง" },
  },
  satun: {
    livelihood: { en: "Fishing, rubber, UNESCO Global Geopark tourism. Thailand's quietest smart city — low population, low crime, high environmental quality.", th: "ประมง ยาง ท่องเที่ยว UNESCO Global Geopark เมืองอัจฉริยะที่เงียบที่สุดของไทย — ประชากรน้อย อาชญากรรมต่ำ คุณภาพสิ่งแวดล้อมสูง" },
    famousFor: { en: "UNESCO Geopark monitoring technology. Tarutao marine conservation. Cleanest air in the index (PM2.5 11.5). The anti-Bangkok.", th: "เทคโนโลยีเฝ้าระวัง UNESCO Geopark อนุรักษ์ทะเลตะรุเตา อากาศสะอาดสุดในดัชนี (PM2.5 11.5) ตรงข้ามกรุงเทพฯ" },
    opportunity: { en: "Geopark + marine conservation = a unique sustainable tourism brand that no other Thai city has. Low cost of operations means even small grants create big impact.", th: "Geopark + อนุรักษ์ทะเล = แบรนด์ท่องเที่ยวยั่งยืนที่ไม่มีเมืองไทยอื่น ต้นทุนดำเนินการต่ำหมายความว่าแม้เงินช่วยเหลือเล็กๆ ก็สร้างผลกระทบใหญ่" },
    theCatch: { en: "Lowest GPP in the south (฿82K). Remote location. Digital infrastructure minimal. The smart city tech works but the economic model to sustain it long-term is uncertain.", th: "GPP ต่ำสุดในใต้ (฿82K) ทำเลห่างไกล โครงสร้างพื้นฐานดิจิทัลน้อย เทคเมืองอัจฉริยะใช้ได้แต่โมเดลเศรษฐกิจรักษาระยะยาวไม่แน่นอน" },
  },
  "samut-prakan": {
    livelihood: { en: "Manufacturing (auto parts, electronics, packaging), industrial labor, warehouse logistics. Bangkok's overflow suburb — dense, industrial, and increasingly smart.", th: "การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์ บรรจุภัณฑ์) แรงงานอุตสาหกรรม โลจิสติกส์คลังสินค้า ชานเมืองล้นจากกรุงเทพฯ — หนาแน่น อุตสาหกรรม และอัจฉริยะมากขึ้น" },
    famousFor: { en: "Industry 4.0 smart factory zones. Flood management IoT for low-lying areas. GPP ฿385K — high output but livability struggles.", th: "เขตโรงงานอัจฉริยะ Industry 4.0 IoT จัดการน้ำท่วมสำหรับพื้นที่ลุ่ม GPP ฿385K — ผลผลิตสูงแต่ความน่าอยู่ยังดิ้นรน" },
    opportunity: { en: "Largest manufacturing base near Bangkok. Industry 4.0 adoption is real and measurable. New airport connectivity (Suvarnabhumi) creates logistics advantage.", th: "ฐานการผลิตใหญ่สุดใกล้กรุงเทพฯ Industry 4.0 จริงและวัดได้ เชื่อมต่อสนามบินใหม่ (สุวรรณภูมิ) สร้างข้อได้เปรียบโลจิสติกส์" },
    theCatch: { en: "PM2.5 30.8. Crime 195/100K. Green coverage only 18% — the lowest in the index. Flooding is chronic in low-lying areas. Livability trails far behind economic output.", th: "PM2.5 30.8 อาชญากรรม 195/100K พื้นที่สีเขียวเพียง 18% — ต่ำสุดในดัชนี น้ำท่วมเรื้อรังในพื้นที่ลุ่ม ความน่าอยู่ตามหลังผลผลิตเศรษฐกิจมาก" },
  },
  "bang-saray": {
    livelihood: { en: "Fishing, seafood processing, coastal tourism. A working fishing village in Chon Buri's EEC shadow — locals still haul catch at dawn while smart sensors monitor water quality nearby.", th: "ประมง แปรรูปอาหารทะเล ท่องเที่ยวชายฝั่ง หมู่บ้านชาวประมงที่ยังทำงานอยู่ในเงา EEC ของชลบุรี — ชาวบ้านยังลากอวนตอนเช้าขณะเซ็นเซอร์อัจฉริยะตรวจคุณภาพน้ำใกล้ๆ" },
    famousFor: { en: "Smart fishing fleet management. Coastal environmental monitoring. One of the few Thai smart cities where the tech serves fishermen, not tourists.", th: "จัดการกองเรือประมงอัจฉริยะ เฝ้าระวังสิ่งแวดล้อมชายฝั่ง เมืองอัจฉริยะไทยไม่กี่แห่งที่เทคโนโลยีรับใช้ชาวประมง ไม่ใช่นักท่องเที่ยว" },
    opportunity: { en: "EEC-adjacent land values rising. Coastal smart monitoring could become a model for every Thai fishing community. Only 35K people — small enough for whole-community digital adoption.", th: "ที่ดินใกล้ EEC มูลค่าเพิ่ม การเฝ้าระวังชายฝั่งอัจฉริยะอาจเป็นโมเดลสำหรับชุมชนประมงไทยทุกแห่ง ประชากร 35K — เล็กพอสำหรับการใช้ดิจิทัลทั้งชุมชน" },
    theCatch: { en: "Digital gap: 38 (lowest in the index cluster). Aging fishermen population. Pattaya's overdevelopment creeping south. Risk of becoming another resort suburb rather than a smart fishing community.", th: "ช่องว่างดิจิทัล: 38 (ต่ำสุดในกลุ่ม) ชาวประมงสูงอายุ การพัฒนาเกินตัวของพัทยาคืบคลานลงมาใต้ เสี่ยงกลายเป็นชานเมืองรีสอร์ทอีกแห่งแทนที่จะเป็นชุมชนประมงอัจฉริยะ" },
  },
  chanthaburi: {
    livelihood: { en: "Gem trading, tropical fruit farming (durian capital of Thailand), cross-border trade with Cambodia. The gem market on Si Chan Road has been a global trading floor for rubies and sapphires for centuries.", th: "ค้าอัญมณี ทำสวนผลไม้เขตร้อน (เมืองหลวงทุเรียนของไทย) ค้าขายข้ามพรมแดนกับกัมพูชา ตลาดพลอยบนถนนศรีจันทร์เป็นตลาดค้าทับทิมแซปไฟร์ระดับโลกมาหลายศตวรรษ" },
    famousFor: { en: "Smart agriculture for durian and mangosteen farmers. Precision irrigation. The agri-tech here is actually working — real yield improvements, not demo projects.", th: "เกษตรอัจฉริยะสำหรับเกษตรกรทุเรียนและมังคุด ระบบชลประทานแม่นยำ เทคโนโลยีเกษตรที่นี่ใช้งานได้จริง — ผลผลิตเพิ่มจริง ไม่ใช่โครงการสาธิต" },
    opportunity: { en: "Durian exports to China are a ฿200B+ industry. Smart grading and traceability tech could lock in premium pricing. Green coverage 52% — one of the greenest cities in the index.", th: "ส่งออกทุเรียนจีนเป็นอุตสาหกรรม 200,000+ ล้านบาท เทคโนโลยีคัดแยกและตรวจสอบย้อนกลับอัจฉริยะอาจล็อคราคาพรีเมียม พื้นที่สีเขียว 52% — เมืองที่เขียวที่สุดแห่งหนึ่งในดัชนี" },
    theCatch: { en: "Digital score only 42. Gem traders are traditional and slow to digitize. GPP ฿178K — moderate. Seasonal fruit income creates boom-bust cycles.", th: "คะแนนดิจิทัลเพียง 42 พ่อค้าพลอยเป็นแบบดั้งเดิมและช้าในการเปลี่ยนเป็นดิจิทัล GPP ฿178K — ปานกลาง รายได้ผลไม้ตามฤดูกาลสร้างวงจรเฟื่องฟู-ตกต่ำ" },
  },
  "khao-khun-song": {
    livelihood: { en: "Precision agriculture, rubber, and fruit farming in Rayong's EEC hinterland. Small community using IoT soil sensors and drone mapping for yield optimization.", th: "เกษตรแม่นยำ ยาง และทำสวนผลไม้ในพื้นที่ EEC ของระยอง ชุมชนเล็กใช้เซ็นเซอร์ดินและโดรนแมพเพิ่มผลผลิต" },
    famousFor: { en: "Pioneering smart agriculture at sub-district scale. IoT-based soil monitoring and water management in real field conditions, not laboratory demos.", th: "บุกเบิกเกษตรอัจฉริยะระดับตำบล IoT เฝ้าระวังดินและจัดการน้ำในสภาพจริง ไม่ใช่สาธิตในห้องทดลอง" },
    opportunity: { en: "EEC proximity means access to industrial R&D resources. At only 25K people, digital adoption can reach every household. Could become Thailand's precision farming reference site.", th: "ใกล้ EEC หมายถึงเข้าถึงทรัพยากร R&D อุตสาหกรรม ประชากรเพียง 25K การใช้ดิจิทัลเข้าถึงทุกครัวเรือน อาจเป็นแหล่งอ้างอิงเกษตรแม่นยำของไทย" },
    theCatch: { en: "Very early stage. Population only 25K — limited tax base. Metrics are sparse (data confidence low). Needs external funding to sustain beyond the pilot phase.", th: "ระยะเริ่มต้นมาก ประชากรเพียง 25K — ฐานภาษีจำกัด ตัวชี้วัดมีน้อย (ความเชื่อมั่นข้อมูลต่ำ) ต้องการทุนภายนอกเพื่อดำเนินต่อหลังนำร่อง" },
  },
  maesai: {
    livelihood: { en: "Border trade with Myanmar (Tachileik), tourism, gem trading. Thailand's northernmost town — the Sai River crossing handles billions in cross-border commerce annually.", th: "ค้าชายแดนกับเมียนมา (ท่าขี้เหล็ก) ท่องเที่ยว ค้าอัญมณี เมืองเหนือสุดของไทย — ด่านแม่น้ำสายรองรับการค้าข้ามพรมแดนหลายพันล้านต่อปี" },
    famousFor: { en: "Rebuilding after devastating 2024 floods. Smart disaster management is now a real priority. Border trade digitization pilot connecting Thai-Myanmar customs.", th: "ฟื้นฟูหลังน้ำท่วมใหญ่ 2567 การจัดการภัยพิบัติอัจฉริยะเป็นวาระจริงแล้ว นำร่องดิจิทัลค้าชายแดนเชื่อมศุลกากรไทย-เมียนมา" },
    opportunity: { en: "Post-flood reconstruction is a chance to build back smarter. Cross-border digital trade could streamline what is currently a chaotic paper-based system.", th: "การฟื้นฟูหลังน้ำท่วมเป็นโอกาสสร้างใหม่อัจฉริยะกว่า การค้าดิจิทัลข้ามพรมแดนอาจปรับปรุงระบบกระดาษที่วุ่นวายในปัจจุบัน" },
    theCatch: { en: "PM2.5 44.2 — among the worst in the north from cross-border burning. Crime 165/100K. Myanmar political instability disrupts border trade unpredictably. GPP only ฿108K.", th: "PM2.5 44.2 — เลวร้ายที่สุดในภาคเหนือจากการเผาข้ามพรมแดน อาชญากรรม 165/100K ความไม่มั่นคงการเมืองเมียนมาชะงักการค้าชายแดน GPP เพียง ฿108K" },
  },
  narathiwat: {
    livelihood: { en: "Fisheries, rubber, rice, cross-border trade with Malaysia (Sungai Kolok crossing). Government employment is a major employer in the deep south security context.", th: "ประมง ยาง ข้าว ค้าขายข้ามพรมแดนกับมาเลเซีย (ด่านสุไหงโก-ลก) ราชการเป็นนายจ้างหลักในบริบทความมั่นคงชายแดนใต้" },
    famousFor: { en: "Southernmost smart city. Genuine cross-border digital trade pilot with Malaysia. Smart safety systems in conflict zone — rare real-world test of smart city under security pressure.", th: "เมืองอัจฉริยะใต้สุด นำร่องการค้าดิจิทัลข้ามพรมแดนกับมาเลเซียจริง ระบบความปลอดภัยอัจฉริยะในเขตขัดแย้ง — ทดสอบจริงหายากของเมืองอัจฉริยะภายใต้แรงกดดันความมั่นคง" },
    opportunity: { en: "Cross-border digital trade with Malaysia could transform Sungai Kolok into a legitimate economic corridor. Clean air (PM2.5 12.5) is an underappreciated asset.", th: "การค้าดิจิทัลข้ามพรมแดนกับมาเลเซียอาจเปลี่ยนสุไหงโก-ลกเป็นระเบียงเศรษฐกิจที่ถูกกฎหมาย อากาศสะอาด (PM2.5 12.5) เป็นสินทรัพย์ที่ถูกประเมินค่าต่ำ" },
    theCatch: { en: "Safety score 35 — lowest in the index. Crime 262/100K. GPP only ฿68K — lowest in the south. Security situation severely constrains all development. Investment is reluctant.", th: "คะแนนความปลอดภัย 35 — ต่ำสุดในดัชนี อาชญากรรม 262/100K GPP เพียง ฿68K — ต่ำสุดในใต้ สถานการณ์ความมั่นคงจำกัดการพัฒนาทั้งหมด การลงทุนลังเล" },
  },
  "nikhom-phatthana": {
    livelihood: { en: "Industrial estate workers (petrochemical, auto parts, electronics), logistics operators, environmental monitoring specialists. This is Map Ta Phut's backyard.", th: "คนงานนิคมอุตสาหกรรม (ปิโตรเคมี ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) ผู้ดำเนินการโลจิสติกส์ ผู้เชี่ยวชาญเฝ้าระวังสิ่งแวดล้อม นี่คือสนามหลังบ้านของมาบตาพุด" },
    famousFor: { en: "Environmental monitoring is the key smart tech — necessary given chemical industry density. GPP ฿1.02M — highest per-capita output in the entire index.", th: "การเฝ้าระวังสิ่งแวดล้อมเป็นเทคโนโลยีอัจฉริยะหลัก — จำเป็นเนื่องจากความหนาแน่นอุตสาหกรรมเคมี GPP ฿1.02M — ผลผลิตต่อหัวสูงสุดในดัชนีทั้งหมด" },
    opportunity: { en: "Highest GPP in the index (฿1.02M/capita). Industrial IoT and environmental monitoring tech here can be exported to every industrial estate in ASEAN.", th: "GPP สูงสุดในดัชนี (฿1.02M/หัว) IoT อุตสาหกรรมและเทคเฝ้าระวังสิ่งแวดล้อมส่งออกไปนิคมอุตสาหกรรมทุกแห่งในอาเซียนได้" },
    theCatch: { en: "Environment score only 52 despite monitoring — the pollution is real. Wellbeing 48 — workers live here but don't thrive here. Population only 45K — a company town, not a community.", th: "คะแนนสิ่งแวดล้อมเพียง 52 แม้มีการเฝ้าระวัง — มลพิษเป็นเรื่องจริง ความเป็นอยู่ 48 — คนงานอยู่ที่นี่แต่ไม่เจริญเติบโต ประชากรเพียง 45K — เมืองบริษัท ไม่ใช่ชุมชน" },
  },
  nonthaburi: {
    livelihood: { en: "Government services, retail, commuter workforce to Bangkok. Thailand's most populous suburb — 1.28M people who mostly work in Bangkok but live here for affordable housing.", th: "บริการราชการ ค้าปลีก กำลังแรงงานเดินทางเข้ากรุงเทพฯ ชานเมืองที่มีประชากรมากที่สุด — 1.28 ล้านคนส่วนใหญ่ทำงานในกรุงเทพฯ แต่อยู่ที่นี่เพราะที่อยู่อาศัยจับต้องได้" },
    famousFor: { en: "MRT-connected digital governance that actually works. GPP ฿285K with income ฿32.8K/month — genuine middle-class suburb with digital services reaching residents.", th: "ธรรมาภิบาลดิจิทัลเชื่อม MRT ที่ใช้งานได้จริง GPP ฿285K รายได้ ฿32.8K/เดือน — ชานเมืองชนชั้นกลางจริงที่บริการดิจิทัลเข้าถึงผู้อยู่อาศัย" },
    opportunity: { en: "MRT Purple Line connectivity transforms commuter patterns. 1.28M residents = massive digital services market. Can become Bangkok's smart suburb showcase.", th: "MRT สายสีม่วงเปลี่ยนรูปแบบการเดินทาง ผู้อยู่อาศัย 1.28M = ตลาดบริการดิจิทัลมหาศาล เป็นโชว์เคสชานเมืองอัจฉริยะของกรุงเทพฯ ได้" },
    theCatch: { en: "PM2.5 31.2. Green coverage only 22%. Crime 175/100K. Essentially Bangkok's problems overflow here — congestion, pollution, flooding — without Bangkok's budget.", th: "PM2.5 31.2 พื้นที่สีเขียวเพียง 22% อาชญากรรม 175/100K ปัญหากรุงเทพฯ ล้นมาที่นี่ — รถติด มลพิษ น้ำท่วม — โดยไม่มีงบกรุงเทพฯ" },
  },
  pattani: {
    livelihood: { en: "Fisheries, rice farming, halal food processing, education (PSU Pattani campus). Historic Malay trading port now defined more by security checkpoints than commerce.", th: "ประมง ทำนา แปรรูปอาหารฮาลาล การศึกษา (มอ.ปัตตานี) ท่าเรือค้าขายมลายูประวัติศาสตร์ที่ตอนนี้ถูกนิยามด้วยด่านตรวจมากกว่าการค้า" },
    famousFor: { en: "Digital governance and safety systems as genuine attempts to improve a difficult situation. Halal food traceability pilot. PSU Pattani's academic contribution to deep south development.", th: "ธรรมาภิบาลดิจิทัลและระบบความปลอดภัยเป็นความพยายามจริงในการปรับปรุงสถานการณ์ยากลำบาก นำร่องตรวจสอบย้อนกลับอาหารฮาลาล ผลงานวิชาการ มอ.ปัตตานีต่อการพัฒนาชายแดนใต้" },
    opportunity: { en: "Halal food industry could be massive — Thailand's halal hub positioning. Clean air (PM2.5 13.8). University presence provides human capital that most conflict zones lack.", th: "อุตสาหกรรมอาหารฮาลาลอาจมหาศาล — วางตำแหน่งศูนย์กลางฮาลาลของไทย อากาศสะอาด (PM2.5 13.8) มหาวิทยาลัยให้ทุนมนุษย์ที่เขตขัดแย้งส่วนใหญ่ไม่มี" },
    theCatch: { en: "Safety 38. Crime 245/100K. GPP ฿72K. The security situation makes every smart city investment harder, slower, and riskier. Investment capital avoids the deep south.", th: "ความปลอดภัย 38 อาชญากรรม 245/100K GPP ฿72K สถานการณ์ความมั่นคงทำให้การลงทุนเมืองอัจฉริยะทุกอย่างยากกว่า ช้ากว่า และเสี่ยงกว่า เงินลงทุนหลีกเลี่ยงชายแดนใต้" },
  },
  phichit: {
    livelihood: { en: "Rice farming, freshwater fishing, small-scale agriculture. A quiet central plains province where the biggest employer is still the land itself.", th: "ทำนา ประมงน้ำจืด เกษตรขนาดเล็ก จังหวัดที่ราบภาคกลางเงียบๆ ที่นายจ้างรายใหญ่สุดยังเป็นผืนดิน" },
    famousFor: { en: "Digital literacy focus — choosing to build human capacity before hardware. Safe (72) but economically limited. Bueng Si Fai lake as natural asset.", th: "เน้นรู้เท่าทันดิจิทัล — เลือกสร้างศักยภาพคนก่อนฮาร์ดแวร์ ปลอดภัย (72) แต่เศรษฐกิจจำกัด บึงสีไฟเป็นสินทรัพย์ธรรมชาติ" },
    opportunity: { en: "Green coverage 42% with low pollution. Safe community (72). If digital literacy translates to e-commerce adoption, farmers could access premium markets directly.", th: "พื้นที่สีเขียว 42% มลพิษต่ำ ชุมชนปลอดภัย (72) หากรู้เท่าทันดิจิทัลแปลงเป็นการใช้อีคอมเมิร์ซ เกษตรกรอาจเข้าถึงตลาดพรีเมียมโดยตรง" },
    theCatch: { en: "Economy 42 — second-lowest pillar. Digital 30 — lowest in the entire index. GPP ฿78K. Only one smart dimension so far. Very early stage with limited institutional capacity.", th: "เศรษฐกิจ 42 — เสาต่ำรองสุดท้าย ดิจิทัล 30 — ต่ำสุดในดัชนีทั้งหมด GPP ฿78K มีเพียงมิติอัจฉริยะเดียว ระยะเริ่มต้นมากศักยภาพสถาบันจำกัด" },
  },
  "phitsanulok-nu": {
    livelihood: { en: "University research, energy R&D, smart mobility testing. A campus smart city where students and faculty are both the innovators and the test subjects.", th: "วิจัยมหาวิทยาลัย R&D พลังงาน ทดสอบการเดินทางอัจฉริยะ เมืองอัจฉริยะในแคมปัสที่นักศึกษาและคณาจารย์เป็นทั้งนวัตกรและผู้ทดสอบ" },
    famousFor: { en: "Genuine R&D output in smart energy and mobility. Digital score 65 — among the highest outside Bangkok. Hospital beds 26/10K — strong healthcare infrastructure.", th: "ผลงาน R&D จริงด้านพลังงานและการเดินทางอัจฉริยะ คะแนนดิจิทัล 65 — สูงสุดนอกกรุงเทพฯ เตียงโรงพยาบาล 26/10K — โครงสร้างพื้นฐานสาธารณสุขแข็งแกร่ง" },
    opportunity: { en: "University-industry bridge: Naresuan research can spin off into real products for the Lower North region. Green coverage 60% makes it genuinely livable.", th: "สะพานมหาวิทยาลัย-อุตสาหกรรม: งานวิจัยนเรศวรแปลงเป็นผลิตภัณฑ์จริงสำหรับภาคเหนือตอนล่าง พื้นที่สีเขียว 60% ทำให้น่าอยู่จริง" },
    theCatch: { en: "PM2.5 30.2 — burning season hits hard. Population only 35K (campus). Economy 52 — research doesn't yet translate to commercial output. Campus innovation doesn't always spill over.", th: "PM2.5 30.2 — ฤดูเผาหนัก ประชากรเพียง 35K (แคมปัส) เศรษฐกิจ 52 — งานวิจัยยังไม่แปลงเป็นผลผลิตเชิงพาณิชย์ นวัตกรรมในแคมปัสไม่เสมอไปที่จะล้นออกไป" },
  },
  "phitsanulok-ppao": {
    livelihood: { en: "Provincial administration, agriculture, small manufacturing. The PAO coordinates digital services across Phitsanulok's scattered rural districts.", th: "บริหารจังหวัด เกษตร การผลิตขนาดเล็ก อบจ.ประสานบริการดิจิทัลข้ามอำเภอชนบทกระจัดกระจายของพิษณุโลก" },
    famousFor: { en: "Provincial-level smart governance reaching rural areas. Digital services extending beyond city center to 340K residents across the province.", th: "ปกครองอัจฉริยะระดับจังหวัดเข้าถึงชนบท บริการดิจิทัลขยายเกินศูนย์กลางเมืองสู่ผู้อยู่อาศัย 340K ทั่วจังหวัด" },
    opportunity: { en: "Province-wide digital governance model could replicate to other PAOs. Rural-urban digital bridge is exactly what most Thai provinces need.", th: "โมเดลปกครองดิจิทัลทั้งจังหวัดอาจทำซ้ำกับ อบจ.อื่น สะพานดิจิทัลชนบท-เมืองคือสิ่งที่จังหวัดไทยส่วนใหญ่ต้องการ" },
    theCatch: { en: "Coordinating across rural districts is inherently slow. GPP ฿132K — moderate. Digital 48 — improving but not yet sufficient for the ambition.", th: "ประสานงานข้ามอำเภอชนบทช้าโดยธรรมชาติ GPP ฿132K — ปานกลาง ดิจิทัล 48 — ดีขึ้นแต่ยังไม่พอสำหรับความทะเยอทะยาน" },
  },
  phlapphla: {
    livelihood: { en: "Fruit farming, rubber, community energy cooperatives. A tiny sub-district in Chanthaburi experimenting with community-owned smart energy.", th: "ทำสวนผลไม้ ยาง สหกรณ์พลังงานชุมชน ตำบลเล็กๆ ในจันทบุรีทดลองพลังงานอัจฉริยะชุมชนเป็นเจ้าของ" },
    famousFor: { en: "Community energy and environmental monitoring at sub-district scale. Only 15K people — proving smart city concepts work even at village level.", th: "พลังงานชุมชนและเฝ้าระวังสิ่งแวดล้อมระดับตำบล ประชากรเพียง 15K — พิสูจน์แนวคิดเมืองอัจฉริยะทำงานได้แม้ระดับหมู่บ้าน" },
    opportunity: { en: "Community energy model is replicable to thousands of Thai sub-districts. High safety (74) and environment (62) scores show a livable base to build on.", th: "โมเดลพลังงานชุมชนทำซ้ำได้กับตำบลไทยหลายพัน ความปลอดภัยสูง (74) และสิ่งแวดล้อม (62) แสดงฐานความน่าอยู่ที่สร้างต่อได้" },
    theCatch: { en: "Population only 15K — smallest in the index. Sparse data (low confidence). Economy 48 and digital 35 — very limited resources. Needs external support to sustain.", th: "ประชากรเพียง 15K — เล็กสุดในดัชนี ข้อมูลเบาบาง (ความเชื่อมั่นต่ำ) เศรษฐกิจ 48 และดิจิทัล 35 — ทรัพยากรจำกัดมาก ต้องการสนับสนุนจากภายนอก" },
  },
  "phuket-tinicon": {
    livelihood: { en: "This is a development plan, not a functioning city. Population: zero. Tinicon Valley is Phuket's ambition to create a tech innovation district on the island.", th: "นี่คือแผนพัฒนา ไม่ใช่เมืองที่ทำงาน ประชากร: ศูนย์ Tinicon Valley คือความทะเยอทะยานของภูเก็ตในการสร้างย่านนวัตกรรมเทคบนเกาะ" },
    famousFor: { en: "The logo was awarded to a concept. Lowest scores in the index across nearly every dimension (livability 25, economy 30, wellbeing 20, hospitality 20).", th: "โลโก้มอบให้กับแนวคิด คะแนนต่ำสุดในดัชนีเกือบทุกมิติ (ความน่าอยู่ 25 เศรษฐกิจ 30 ความเป็นอยู่ 20 การท่องเที่ยว 20)" },
    opportunity: { en: "If Phuket can attract tech talent to complement its tourism base, the island could diversify beyond seasonal beach tourism. The concept is sound; execution is zero.", th: "หากภูเก็ตดึงดูดคนเก่งเทคมาเสริมฐานท่องเที่ยว เกาะอาจหลากหลายเกินท่องเที่ยวหาดตามฤดูกาล แนวคิดดี การปฏิบัติเป็นศูนย์" },
    theCatch: { en: "Nothing exists yet. Zero population, zero infrastructure, zero services. This is a branding exercise masquerading as a smart city. Prove it or lose it.", th: "ยังไม่มีอะไร ประชากรศูนย์ โครงสร้างพื้นฐานศูนย์ บริการศูนย์ นี่คือการสร้างแบรนด์แฝงเป็นเมืองอัจฉริยะ พิสูจน์ตัวเองหรือสูญเสียมัน" },
  },
  rattanakosin: {
    livelihood: { en: "Tourism, government administration, temple economy, heritage conservation. Bangkok's sacred island — Grand Palace, Wat Pho, Wat Arun — where 30M+ tourists walk annually.", th: "ท่องเที่ยว ราชการ เศรษฐกิจวัด อนุรักษ์มรดก เกาะศักดิ์สิทธิ์ของกรุงเทพฯ — พระบรมมหาราชวัง วัดโพธิ์ วัดอรุณ — ที่นักท่องเที่ยว 30 ล้าน+ เดินต่อปี" },
    famousFor: { en: "Heritage-tech fusion: smart canal management, cultural asset digitization. Hospitality score 82 — highest in the entire index. The gold standard for heritage smart city.", th: "ผสมผสานมรดก-เทค: จัดการคลองอัจฉริยะ แปลงสินทรัพย์วัฒนธรรมเป็นดิจิทัล คะแนนการท่องเที่ยว 82 — สูงสุดในดัชนีทั้งหมด มาตรฐานทองสำหรับเมืองอัจฉริยะมรดก" },
    opportunity: { en: "Heritage smart city model is globally exportable — every ASEAN country has a historic district that needs this approach. Cultural data platform could be an ASEAN reference.", th: "โมเดลเมืองอัจฉริยะมรดกส่งออกได้ทั่วโลก — ทุกประเทศอาเซียนมีย่านประวัติศาสตร์ที่ต้องการแนวทางนี้ แพลตฟอร์มข้อมูลวัฒนธรรมอาจเป็นมาตรฐานอาเซียน" },
    theCatch: { en: "PM2.5 32.4. Safety 58 — pickpocketing and tourist scams. Environment 46 — heritage buildings can't easily accommodate green infrastructure. Overtourism is the constant threat.", th: "PM2.5 32.4 ความปลอดภัย 58 — ล้วงกระเป๋าและหลอกนักท่องเที่ยว สิ่งแวดล้อม 46 — อาคารมรดกรองรับโครงสร้างพื้นฐานสีเขียวยาก นักท่องเที่ยวล้นเป็นภัยคุกคามตลอด" },
  },
  "songkhla-city": {
    livelihood: { en: "Fisheries, rubber processing, PSU (main campus), tourism around Songkhla Lake. Southern cultural capital with Thai-Chinese-Malay heritage blend.", th: "ประมง แปรรูปยาง มอ.(แคมปัสหลัก) ท่องเที่ยวรอบทะเลสาบสงขลา เมืองหลวงวัฒนธรรมภาคใต้ผสมผสานมรดกไทย-จีน-มลายู" },
    famousFor: { en: "Smart governance and tourism tech with strong cultural identity. Hospitality 76. Lake ecosystem monitoring. PSU research capacity supports genuine innovation.", th: "ปกครองอัจฉริยะและเทคท่องเที่ยวด้วยอัตลักษณ์วัฒนธรรมเข้มแข็ง การท่องเที่ยว 76 เฝ้าระวังระบบนิเวศทะเลสาบ ศักยภาพวิจัย มอ.สนับสนุนนวัตกรรมจริง" },
    opportunity: { en: "Songkhla Lake monitoring could become a model for ASEAN inland water body management. University + cultural heritage + lake = unique tourism positioning.", th: "การเฝ้าระวังทะเลสาบสงขลาอาจเป็นโมเดลจัดการแหล่งน้ำในอาเซียน มหาวิทยาลัย + มรดกวัฒนธรรม + ทะเลสาบ = วางตำแหน่งท่องเที่ยวเฉพาะ" },
    theCatch: { en: "Crime 158/100K — proximity to deep south. GPP ฿155K — moderate. Lake pollution is a growing concern. Hat Yai's commercial gravity pulls investment away from Songkhla city.", th: "อาชญากรรม 158/100K — ใกล้ชายแดนใต้ GPP ฿155K — ปานกลาง มลพิษทะเลสาบเป็นปัญหาที่เพิ่มขึ้น แรงดึงดูดเชิงพาณิชย์ของหาดใหญ่ดึงการลงทุนออกจากเมืองสงขลา" },
  },
  sritrang: {
    livelihood: { en: "Rubber, palm oil, coastal fishing, small-scale eco-tourism. Trang's quiet Andaman coast community where green initiatives grow from genuine local concern.", th: "ยาง ปาล์ม ประมงชายฝั่ง ท่องเที่ยวเชิงนิเวศขนาดเล็ก ชุมชนอันดามันเงียบๆ ของตรังที่โครงการสีเขียวเติบโตจากความห่วงใยท้องถิ่นจริง" },
    famousFor: { en: "Honest small-scale smart city. Green initiatives and environmental monitoring that work. Safety 74, environment 68 — genuinely livable. PM2.5 16.8 — clean air.", th: "เมืองอัจฉริยะขนาดเล็กที่ซื่อสัตย์ โครงการสีเขียวและเฝ้าระวังสิ่งแวดล้อมที่ใช้ได้ ความปลอดภัย 74 สิ่งแวดล้อม 68 — น่าอยู่จริง PM2.5 16.8 — อากาศสะอาด" },
    opportunity: { en: "Green coverage 62% — among the highest in the index. Low crime (110/100K). Andaman eco-tourism brand + clean air + community governance = unique livability story.", th: "พื้นที่สีเขียว 62% — สูงสุดแห่งหนึ่งในดัชนี อาชญากรรมต่ำ (110/100K) แบรนด์ท่องเที่ยวเชิงนิเวศอันดามัน + อากาศสะอาด + ปกครองชุมชน = เรื่องราวความน่าอยู่เฉพาะ" },
    theCatch: { en: "Economy 55 — limited commercial activity. Population only 78K. Digital 45 — needs connectivity improvement. Hospital beds only 16/10K — healthcare access is thin.", th: "เศรษฐกิจ 55 — กิจกรรมเชิงพาณิชย์จำกัด ประชากรเพียง 78K ดิจิทัล 45 — ต้องปรับปรุงการเชื่อมต่อ เตียงโรงพยาบาลเพียง 16/10K — เข้าถึงสาธารณสุขบาง" },
  },
  "tai-yong": {
    livelihood: { en: "Rice farming, fruit orchards, small-scale community agriculture. A tiny sub-district in Nakhon Si Thammarat proving digital governance works at village scale.", th: "ทำนา สวนผลไม้ เกษตรชุมชนขนาดเล็ก ตำบลเล็กๆ ในนครศรีธรรมราชพิสูจน์ว่าปกครองดิจิทัลทำงานได้ระดับหมู่บ้าน" },
    famousFor: { en: "Community-scale digital governance and agriculture tech. Only 18K people but genuine smart services. Proof that smart city isn't just for big cities.", th: "ปกครองดิจิทัลและเทคเกษตรระดับชุมชน ประชากรเพียง 18K แต่บริการอัจฉริยะจริง พิสูจน์ว่าเมืองอัจฉริยะไม่ใช่แค่เมืองใหญ่" },
    opportunity: { en: "Village-scale smart city model is replicable to thousands of Thai tambons. If NST's smart city DNA reaches its sub-districts, the province transforms bottom-up.", th: "โมเดลเมืองอัจฉริยะระดับหมู่บ้านทำซ้ำได้กับตำบลไทยหลายพัน หาก DNA เมืองอัจฉริยะของนครฯ เข้าถึงตำบล จังหวัดเปลี่ยนแปลงจากล่างขึ้นบน" },
    theCatch: { en: "Economy 42. Digital 35. Population 18K — very limited tax base. Needs sustained external funding. Data is sparse (low confidence). Without NST's support, viability is uncertain.", th: "เศรษฐกิจ 42 ดิจิทัล 35 ประชากร 18K — ฐานภาษีจำกัดมาก ต้องการทุนภายนอกอย่างยั่งยืน ข้อมูลเบาบาง (ความเชื่อมั่นต่ำ) หากไม่มีนครฯ สนับสนุน ความอยู่รอดไม่แน่นอน" },
  },
  tak: {
    livelihood: { en: "Cross-border trade with Myanmar (Mae Sot), agriculture, manufacturing in the Mae Sot SEZ. Labor from Myanmar drives the factory economy.", th: "ค้าชายแดนกับเมียนมา (แม่สอด) เกษตร การผลิตใน SEZ แม่สอด แรงงานจากเมียนมาขับเคลื่อนเศรษฐกิจโรงงาน" },
    famousFor: { en: "Smart customs and trade digitization. Genuine cross-border tech with Myanmar. The Mae Sot SEZ is Thailand's most active border economic zone.", th: "ศุลกากรอัจฉริยะและค้าดิจิทัล เทคข้ามพรมแดนจริงกับเมียนมา SEZ แม่สอดเป็นเขตเศรษฐกิจชายแดนที่คึกคักที่สุดของไทย" },
    opportunity: { en: "If Myanmar stabilizes, Mae Sot becomes Thailand's western gateway to the Indian Ocean economy. Green coverage 65% — genuinely green despite border challenges.", th: "หากเมียนมามีเสถียรภาพ แม่สอดเป็นประตูตะวันตกของไทยสู่เศรษฐกิจมหาสมุทรอินเดีย พื้นที่สีเขียว 65% — สีเขียวจริงแม้ท้าทายชายแดน" },
    theCatch: { en: "PM2.5 34.5 — border burning. GPP ฿108K. Myanmar instability creates unpredictable trade disruptions. Migrant labor issues. Economy 50 — SEZ hasn't yet delivered its promise.", th: "PM2.5 34.5 — การเผาชายแดน GPP ฿108K ความไม่มั่นคงเมียนมาสร้างการชะงักการค้าคาดเดาไม่ได้ ปัญหาแรงงานข้ามชาติ เศรษฐกิจ 50 — SEZ ยังไม่ส่งมอบตามสัญญา" },
  },
  "thep-paraj": {
    livelihood: { en: "Agriculture (rice, fruit), small manufacturing, EEC spillover employment. A tiny sub-district in Chachoengsao catching the EEC development wave.", th: "เกษตร (ข้าว ผลไม้) การผลิตขนาดเล็ก การจ้างงานล้นจาก EEC ตำบลเล็กๆ ในฉะเชิงเทราที่จับคลื่นพัฒนา EEC" },
    famousFor: { en: "Smart agriculture IoT deployment in EEC sub-district. Some genuine sensor deployment for soil and water monitoring. Very early but real.", th: "ติดตั้ง IoT เกษตรอัจฉริยะในตำบล EEC มีการติดตั้งเซ็นเซอร์จริงสำหรับเฝ้าระวังดินและน้ำ เริ่มต้นมากแต่จริง" },
    opportunity: { en: "EEC proximity brings infrastructure investment that no other sub-district gets. Could become the test bed for smart agriculture before scaling to the whole Eastern Seaboard.", th: "ใกล้ EEC นำการลงทุนโครงสร้างพื้นฐานที่ตำบลอื่นไม่ได้ อาจเป็นแปลงทดสอบเกษตรอัจฉริยะก่อนขยายสู่ชายฝั่งตะวันออกทั้งหมด" },
    theCatch: { en: "Population only 22K. Economy 48, digital 38 — very early stage. Sparse data. Without EEC-driven investment, this would be an unremarkable rural sub-district.", th: "ประชากรเพียง 22K เศรษฐกิจ 48 ดิจิทัล 38 — ระยะเริ่มต้นมาก ข้อมูลเบาบาง หากไม่มีการลงทุนจาก EEC จะเป็นตำบลชนบทธรรมดา" },
  },
  ubon: {
    livelihood: { en: "Agriculture, government services, education, Mekong border trade. Isan's eastern capital — candle festival, temple tourism, and the gateway to Laos and Cambodia.", th: "เกษตร ราชการ การศึกษา ค้าชายแดนแม่น้ำโขง เมืองหลวงอีสานตะวันออก — เทศกาลเทียน ท่องเที่ยววัด และประตูสู่ลาวและกัมพูชา" },
    famousFor: { en: "Mekong border city with cultural richness. Candle Festival (UNESCO Intangible Heritage candidate). Flood management smart tech along Mun-Mekong confluence.", th: "เมืองชายแดนโขงที่อุดมวัฒนธรรม เทศกาลแห่เทียน (ผู้สมัครมรดกจับต้องไม่ได้ยูเนสโก) เทคจัดการน้ำท่วมอัจฉริยะตามจุดบรรจบมูล-โขง" },
    opportunity: { en: "1.88M population — largest catchment in the northeast outside Korat. Cultural tourism brand is genuine. Mekong economic corridor connectivity creates trade potential.", th: "ประชากร 1.88M — ขนาดใหญ่สุดในอีสานนอกจากโคราช แบรนด์ท่องเที่ยวเชิงวัฒนธรรมจริง การเชื่อมต่อระเบียงเศรษฐกิจแม่น้ำโขงสร้างศักยภาพการค้า" },
    theCatch: { en: "GPP only ฿98K — Isan poverty is structural. PM2.5 24.8. Economy 54 — limited commercial base despite population size. Brain drain to Bangkok is chronic.", th: "GPP เพียง ฿98K — ความยากจนอีสานเป็นเชิงโครงสร้าง PM2.5 24.8 เศรษฐกิจ 54 — ฐานเชิงพาณิชย์จำกัดแม้ประชากรมาก สมองไหลไปกรุงเทพฯ เรื้อรัง" },
  },
  "ubon-muni": {
    livelihood: { en: "Municipal services, retail, hospitality, education support. The urban core of Ubon Ratchathani — where the candle festival happens and the digital governance concentrates.", th: "บริการเทศบาล ค้าปลีก การบริการ สนับสนุนการศึกษา แกนกลางเมืองอุบลราชธานี — ที่เทศกาลเทียนจัดและธรรมาภิบาลดิจิทัลเข้มข้น" },
    famousFor: { en: "Candle Festival tourism tech. Municipal-level digital governance complementing the larger provincial smart city. Focus on cultural tourism management.", th: "เทคท่องเที่ยวเทศกาลเทียน ธรรมาภิบาลดิจิทัลระดับเทศบาลเสริมเมืองอัจฉริยะระดับจังหวัด เน้นจัดการท่องเที่ยวเชิงวัฒนธรรม" },
    opportunity: { en: "Concentrated urban core (120K) is manageable for comprehensive digital services. Candle Festival attracts 500K+ visitors — smart event management is exportable.", th: "แกนกลางเมืองกระชับ (120K) จัดการได้สำหรับบริการดิจิทัลครบวงจร เทศกาลเทียนดึง 500K+ คน — จัดการอีเวนต์อัจฉริยะส่งออกได้" },
    theCatch: { en: "GPP ฿98K — same structural Isan poverty. Economy 52. Digital 42 — still building capacity. Being a municipality within a larger smart city project creates coordination complexity.", th: "GPP ฿98K — ความยากจนเชิงโครงสร้างอีสานเดียวกัน เศรษฐกิจ 52 ดิจิทัล 42 — ยังสร้างศักยภาพ เป็นเทศบาลในโครงการเมืองอัจฉริยะใหญ่กว่าสร้างความซับซ้อนในการประสานงาน" },
  },
  umong: {
    livelihood: { en: "Agriculture, handicrafts, small manufacturing near Lamphun industrial estates. A tiny municipality near Chiang Mai with surprisingly comprehensive smart city ambitions.", th: "เกษตร หัตถกรรม การผลิตขนาดเล็กใกล้นิคมอุตสาหกรรมลำพูน เทศบาลเล็กๆ ใกล้เชียงใหม่ที่มีความทะเยอทะยานเมืองอัจฉริยะครอบคลุมอย่างน่าแปลกใจ" },
    famousFor: { en: "All 7 smart dimensions covered despite 22K population. Community-driven approach. Green coverage 55%. Proving that ambition doesn't require size.", th: "ครอบคลุมทั้ง 7 มิติอัจฉริยะแม้ประชากร 22K แนวทางขับเคลื่อนโดยชุมชน พื้นที่สีเขียว 55% พิสูจน์ว่าความทะเยอทะยานไม่ต้องการขนาด" },
    opportunity: { en: "Lamphun industrial estate proximity provides economic anchor. Chiang Mai spillover creates demand. Community-driven model is replicable across northern Thailand.", th: "ใกล้นิคมลำพูนเป็นสมอเศรษฐกิจ ความล้นจากเชียงใหม่สร้างอุปสงค์ โมเดลชุมชนนำทำซ้ำได้ทั่วภาคเหนือ" },
    theCatch: { en: "PM2.5 36.8 — among the worst (burning season devastates the north). Economy 48. GPP ฿125K — modest. Being small means every setback is proportionally larger.", th: "PM2.5 36.8 — เลวร้ายที่สุด (ฤดูเผาทำลายภาคเหนือ) เศรษฐกิจ 48 GPP ฿125K — พอประมาณ เล็กหมายความว่าทุกอุปสรรคใหญ่เป็นสัดส่วน" },
  },
};

/** Get city context — returns undefined if no context exists for that city */
export function getCityContext(cityId: string): CityContext | undefined {
  return cityContexts[cityId];
}
