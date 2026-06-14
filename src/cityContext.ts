// ---------------------------------------------------------------------------
// City Context — What makes each city unique
// ---------------------------------------------------------------------------
// For each city: what people do, what it's known for, what's the catch,
// and what opportunities outsiders don't know about.
// This is the human layer on top of the numbers.
// ---------------------------------------------------------------------------

import { allCities } from "./cityData.ts";
import type { SmartCity } from "./types.ts";

export interface CityContext {
  livelihood: { en: string; th: string; zh: string };
  famousFor: { en: string; th: string; zh: string };
  opportunity: { en: string; th: string; zh: string };
  theCatch: { en: string; th: string; zh: string };
  landArea?: number; // sq km
  established?: string; // year or era
}

export const cityContexts: Record<string, CityContext> = {
  phuket: {
    livelihood: { en: "Tourism dominates — hotels, restaurants, dive shops, tour operators. Fishing and rubber plantations outside the tourist strip. A growing tech and digital nomad scene around Phuket Town.", th: "การท่องเที่ยวครอบงำ — โรงแรม ร้านอาหาร ร้านดำน้ำ บริษัทนำเที่ยว ประมงและสวนยางนอกเขตท่องเที่ยว กลุ่ม tech และ digital nomad เติบโตรอบเมืองภูเก็ต", zh: "旅游业主导——酒店、餐厅、潜水店、旅行社。旅游带以外有渔业和橡胶园。普吉镇附近的科技与数字游民群体正在壮大。" },
    famousFor: { en: "Andaman Sea beaches, Patong nightlife, Old Town Sino-Portuguese architecture, seafood, and being Thailand's richest province outside Bangkok.", th: "หาดทะเลอันดามัน ไนท์ไลฟ์ป่าตอง สถาปัตยกรรมชิโน-โปรตุกีสในเมืองเก่า อาหารทะเล และเป็นจังหวัดที่ร่ำรวยที่สุดนอกกรุงเทพฯ", zh: "安达曼海滩、芭东夜生活、老城葡式建筑、海鲜，以及曼谷以外泰国最富裕的府。" },
    opportunity: { en: "Phuket Smart Bus (launched 2024) runs three live routes — Airport to Rawai (฿100), Bus Terminal 2 to Patong (฿50), and the Dragon Line city shuttle (free) — all with real-time GPS tracking: the island's first serious public transit network. Smart tourism infrastructure is exportable. Marine monitoring tech could become an ASEAN model. The 2004 tsunami created a culture of disaster preparedness that other coastal cities lack.", th: "รถบัสอัจฉริยะภูเก็ต (เปิดตัว 2567) วิ่ง 3 เส้นทางจริง — สนามบินถึงราไวย์ (฿100) อาคารผู้โดยสาร 2 ถึงป่าตอง (฿50) และ Dragon Line รถรับส่งในเมือง (ฟรี) — ทุกสายมีติดตาม GPS แบบเรียลไทม์: เครือข่ายขนส่งสาธารณะที่จริงจังแห่งแรกของเกาะ โครงสร้างพื้นฐานการท่องเที่ยวอัจฉริยะส่งออกได้ เทคเฝ้าระวังทะเลอาจเป็นโมเดลอาเซียน สึนามิ 2547 สร้างวัฒนธรรมเตรียมพร้อมรับภัยพิบัติที่เมืองชายฝั่งอื่นไม่มี", zh: "普吉智慧巴士（2024年启动）运营三条实时路线——机场至拉威（100铢）、2号客运站至芭东（50铢）、Dragon Line城市穿梭（免费）——全程GPS实时追踪：这是该岛首个真正意义上的公共交通网络。智慧旅游基础设施可出口。海洋监测技术有望成为东盟范本。2004年海啸孕育了其他沿海城市所缺乏的防灾文化。" },
    theCatch: { en: "Overtourism. Water shortages in dry season. Traffic nightmare on the single north-south road. Cost of living rivals Bangkok. Local community voice often drowned by resort money.", th: "นักท่องเที่ยวล้น ขาดแคลนน้ำหน้าแล้ง จราจรฝันร้ายบนถนนเหนือ-ใต้สายเดียว ค่าครองชีพเทียบกรุงเทพฯ เสียงชุมชนท้องถิ่นมักจมหายไปกับเงินรีสอร์ท", zh: "过度旅游。旱季缺水。南北唯一干道交通噩梦。生活成本与曼谷媲美。当地社区声音常被度假村资本淹没。" },
    landArea: 543,
  },
  samyan: {
    livelihood: { en: "University students, startup founders, office workers in the Samyan-Silom corridor. Creative economy anchored by Chulalongkorn University and True Digital Park.", th: "นักศึกษา ผู้ก่อตั้งสตาร์ทอัพ พนักงานออฟฟิศในระเบียงสามย่าน-สีลม เศรษฐกิจสร้างสรรค์ยึดโยงกับจุฬาฯ และ True Digital Park", zh: "沙梦—是隆走廊的大学生、创业者和上班族。创意经济依托朱拉隆功大学与True Digital Park。" },
    famousFor: { en: "Bangkok's innovation district. Samyan Mitrtown. Chulalongkorn University. 200+ startups. One of the few places in Bangkok where walking actually works.", th: "ย่านนวัตกรรมของกรุงเทพฯ สามย่านมิตรทาวน์ จุฬาลงกรณ์มหาวิทยาลัย 200+ สตาร์ทอัพ หนึ่งในไม่กี่ที่ในกรุงเทพฯ ที่เดินได้จริง", zh: "曼谷创新区。Samyan Mitrtown。朱拉隆功大学。200家以上创业公司。曼谷少数真正适合步行的地方之一。" },
    opportunity: { en: "5G testbed is live. Smart parking and energy management operational. The university-industry pipeline creates a self-sustaining innovation loop that most Thai cities can't replicate.", th: "5G testbed ใช้งานจริง ที่จอดรถอัจฉริยะและจัดการพลังงานทำงานอยู่ สายพานมหาวิทยาลัย-อุตสาหกรรมสร้างวงจรนวัตกรรมที่ยั่งยืนซึ่งเมืองไทยส่วนใหญ่ทำไม่ได้", zh: "5G测试床已运行。智能停车与能源管理已投入运营。大学—产业链形成可自我维持的创新循环，其他泰国城市难以复制。" },
    theCatch: { en: "Air quality is brutal (PM2.5 32.4). Crime rate is Bangkok-level high. The smart city zone is tiny — walk three blocks and you're back in regular chaotic Bangkok.", th: "คุณภาพอากาศแย่ (PM2.5 32.4) อัตราอาชญากรรมสูงระดับกรุงเทพฯ เขตเมืองอัจฉริยะเล็กมาก เดินออกไปสามบล็อกก็กลับสู่กรุงเทพฯ วุ่นวายปกติ", zh: "空气质量恶劣（PM2.5 32.4）。犯罪率达曼谷水平。智慧城市区域极小——走出三个街区便回到普通混乱的曼谷。" },
    landArea: 3.2,
  },
  "chiang-mai-old-town": {
    livelihood: { en: "Tourism, handicrafts, university sector, digital nomads, and a growing creative economy. Night bazaar vendors, coffee shop owners, temple restoration artisans.", th: "การท่องเที่ยว หัตถกรรม ภาคมหาวิทยาลัย digital nomad และเศรษฐกิจสร้างสรรค์ที่เติบโต ผู้ค้าตลาดกลางคืน เจ้าของร้านกาแฟ ช่างบูรณะวัด", zh: "旅游、手工艺、大学、数字游民及不断壮大的创意经济。夜市摊贩、咖啡馆主人、古寺修复工匠。" },
    famousFor: { en: "300+ ancient temples, Doi Suthep, Sunday Walking Street, Lanna culture, the haze crisis, and being Thailand's second city for digital talent.", th: "วัดโบราณ 300+ แห่ง ดอยสุเทพ ถนนคนเดินวันอาทิตย์ วัฒนธรรมล้านนา วิกฤตหมอกควัน และเป็นเมืองอันดับสองสำหรับ talent ดิจิทัล", zh: "300多座古寺、双龙寺、周日步行街、兰纳文化、霾危机，以及泰国第二大数字人才聚集城市。" },
    opportunity: { en: "IoT heritage preservation (sensors on 300+ temples) is globally unique. Air quality monitoring network with 50+ stations could become a model for haze-affected cities across mainland Southeast Asia.", th: "การอนุรักษ์มรดกด้วย IoT (เซ็นเซอร์บนวัด 300+ แห่ง) เป็นสิ่งที่ไม่มีใครเหมือนในโลก เครือข่ายเฝ้าระวังคุณภาพอากาศ 50+ สถานีอาจเป็นโมเดลสำหรับเมืองที่ได้รับผลกระทบจากหมอกควันทั่วเอเชียตะวันออกเฉียงใต้", zh: "IoT遗址保护（300多座古寺安装传感器）举世无双。50余个站点的空气质量监测网络有望成为东南亚内陆雾霾城市的标杆。" },
    theCatch: { en: "PM2.5 at 46.1 μg/m³ — 4x WHO guidelines. Burning season (Feb-Apr) makes the city nearly unlivable. Overtourism pressure on Old Town infrastructure. Gentrification pushing locals out.", th: "PM2.5 46.1 μg/m³ — เกินมาตรฐาน WHO 4 เท่า ฤดูเผา (ก.พ.-เม.ย.) ทำให้เมืองแทบอยู่ไม่ได้ แรงกดดันจากนักท่องเที่ยวต่อโครงสร้างพื้นฐานเมืองเก่า gentrification ผลักคนท้องถิ่นออก", zh: "PM2.5 46.1 μg/m³——是WHO标准的4倍。焚烧季节（2—4月）几乎无法居住。过度旅游对古城基础设施形成压力。房价上涨将当地居民挤出。" },
    landArea: 40.2,
    established: "1296",
  },
  "khon-kaen": {
    livelihood: { en: "University town economy, regional healthcare hub (6 hospitals), agribusiness, and a growing logistics/warehouse sector. The KKTS business consortium drives private-sector smart city investment.", th: "เศรษฐกิจเมืองมหาวิทยาลัย ศูนย์กลางสุขภาพภูมิภาค (6 โรงพยาบาล) ธุรกิจเกษตร และภาคโลจิสติกส์/คลังสินค้าที่เติบโต กลุ่ม KKTS ขับเคลื่อนการลงทุนเมืองอัจฉริยะจากเอกชน", zh: "大学城经济、区域医疗中心（6所医院）、农业综合经营，以及快速成长的物流/仓储业。KKTS商业联合体推动私营部门智慧城市投资。" },
    famousFor: { en: "Isan's economic capital. The LRT that's been coming for years. Khon Kaen University. Dinosaur fossils. Being the only Thai city where the private sector — not the government — initiated the smart city push.", th: "เมืองหลวงเศรษฐกิจอีสาน LRT ที่รอมาหลายปี มหาวิทยาลัยขอนแก่น ฟอสซิลไดโนเสาร์ เป็นเมืองไทยเมืองเดียวที่เอกชน — ไม่ใช่รัฐบาล — ริเริ่มการผลักดันเมืองอัจฉริยะ", zh: "泰东北经济首府。迟迟未能落地的轻轨。孔敬大学。恐龙化石。泰国唯一由私营部门而非政府发起智慧城市建设的城市。" },
    opportunity: { en: "The KGO Token (Knowledge Governance Token) is Thailand's only live municipal blockchain currency: 25,000+ active wallets, 600 businesses (mainly food and beverage), functioning as a real e-voucher economy managed by Infiniteland Token Company on behalf of the KKTS consortium. Private-sector-led model is unique in Thailand and exportable. High-speed rail to Bangkok and Nong Khai (Laos border) will transform the logistics play.", th: "KGO Token (Knowledge Governance Token) คือสกุลเงินบล็อกเชนเทศบาลที่ใช้จริงเพียงแห่งเดียวในไทย: กระเป๋าเงินที่ใช้งานอยู่กว่า 25,000 ใบ ธุรกิจ 600 ราย (ส่วนใหญ่อาหารและเครื่องดื่ม) ทำหน้าที่เป็นเศรษฐกิจ e-voucher จริงบริหารโดย Infiniteland Token Company ในนามกลุ่ม KKTS โมเดลนำโดยเอกชนเป็นเอกลักษณ์ในไทยและส่งออกได้ รถไฟความเร็วสูงสู่กรุงเทพฯ-หนองคาย (ชายแดนลาว) จะเปลี่ยนโลจิสติกส์", zh: "KGO代币（Knowledge Governance Token）是泰国唯一实际运行的市政区块链货币：2.5万余个活跃钱包、600家商家（以餐饮为主），由Infiniteland Token Company代表KKTS联合体运营真实的电子凭证经济。私营主导模式在泰国独一无二且可出口。连接曼谷至廊开（老挝边境）的高铁将彻底改变物流格局。" },
    theCatch: { en: "LRT delayed 7+ years — the poster child for Thai infrastructure delays. Brain drain to Bangkok persists. GPP per capita (฿155K) is high for Isan but still half of Bangkok's.", th: "LRT ล่าช้า 7+ ปี — ตัวอย่างของการล่าช้าโครงสร้างพื้นฐานไทย สมองไหลไปกรุงเทพฯ ยังคงอยู่ GPP ต่อหัว (฿155K) สูงสำหรับอีสานแต่ยังน้อยกว่ากรุงเทพฯ ครึ่งหนึ่ง", zh: "轻轨延误7年以上——泰国基础设施延误的典型案例。人才持续外流至曼谷。人均GPP（15.5万泰铢）在泰东北偏高，但仍不及曼谷的一半。" },
    landArea: 10886,
  },
  "cmu-smart-city": {
    livelihood: { en: "Students, researchers, university staff. A self-contained campus economy with its own smart energy grid, AI traffic system, and 500+ open datasets.", th: "นักศึกษา นักวิจัย บุคลากรมหาวิทยาลัย เศรษฐกิจแคมปัสแบบพึ่งตัวเองที่มีระบบพลังงานอัจฉริยะ AI จราจร และชุดข้อมูลเปิด 500+ ชุด", zh: "学生、研究人员、大学教职人员。一个拥有独立智慧能源网、AI交通系统及500余个开放数据集的自给校园经济体。" },
    famousFor: { en: "Thailand's most genuine smart city R&D engine. 30% campus energy reduction. AI traffic at 12 intersections. Doi Suthep as the backdrop.", th: "เครื่องยนต์ R&D เมืองอัจฉริยะที่จริงที่สุดของไทย ลดพลังงานแคมปัส 30% AI จราจรที่ 12 สี่แยก ดอยสุเทพเป็นฉากหลัง", zh: "泰国最真实的智慧城市研发引擎。校园能耗降低30%。12个路口已应用AI交通管理。素贴山为背景。" },
    opportunity: { en: "The campus is a living lab — every innovation can be tested, measured, and iterated before scaling to a city. The open data platform (500+ datasets) is the most complete of any Thai smart city.", th: "แคมปัสเป็นห้องทดลองจริง — ทุกนวัตกรรมทดสอบ วัดผล และปรับปรุงได้ก่อนขยายสู่เมือง แพลตฟอร์มข้อมูลเปิด (500+ ชุดข้อมูล) สมบูรณ์ที่สุดของเมืองอัจฉริยะไทย", zh: "校园即活体实验室——每项创新均可先测试、量化、迭代，再向城市推广。开放数据平台（500余个数据集）是泰国所有智慧城市中最完备的。" },
    theCatch: { en: "It's a campus, not a city. Population 45K. What works for university students may not scale to a diverse urban population. Same PM2.5 crisis as Chiang Mai.", th: "เป็นแคมปัส ไม่ใช่เมือง ประชากร 45K สิ่งที่ใช้ได้กับนักศึกษาอาจไม่ขยายไปสู่ประชากรเมืองที่หลากหลาย วิกฤต PM2.5 เดียวกับเชียงใหม่", zh: "这是校园，不是城市。人口仅4.5万。适用于大学生的做法未必能延伸至多元化城市人口。PM2.5危机与清迈相同。" },
    landArea: 3.5,
    established: "1964",
  },
  "nakhon-si-thammarat": {
    livelihood: { en: "Government services, rubber and palm oil plantations, fisheries, small commerce. A provincial capital with deep Buddhist cultural roots — Wat Phra Mahathat is one of Thailand's most sacred sites.", th: "ราชการ สวนยางและปาล์ม ประมง พาณิชย์ย่อย เมืองเอกที่มีรากวัฒนธรรมพุทธลึก — วัดพระมหาธาตุเป็นสถานที่ศักดิ์สิทธิ์ที่สุดแห่งหนึ่งของไทย", zh: "政府服务、橡胶与棕榈种植、渔业、小型商业。一座佛教文化根基深厚的府治城市——帕玛哈塔寺是泰国最神圣的圣地之一。" },
    famousFor: { en: "The city that listened. 112K app users. 10-hour flood warning. Zero flood fatalities since 2021. The ASEAN CSCO Handbook model city. Mayor Kanop Ketchart (กณพ เกตุชาติ)'s LINE Q&A sessions.", th: "เมืองที่ฟัง ผู้ใช้แอป 112K เตือนน้ำท่วมล่วงหน้า 10 ชั่วโมง ไม่มีผู้เสียชีวิตจากน้ำท่วมตั้งแต่ 2564 เมืองต้นแบบ ASEAN CSCO Handbook นายกกณพ เกตุชาติ ตอบคำถามบน LINE", zh: "倾听型城市。11.2万APP用户。10小时洪水预警。2021年后零洪灾死亡。东盟CSCO手册样板城市。Kanop Ketchart市长在LINE上的问答。" },
    opportunity: { en: "The citizen-centric model is copyable and cheap. No exotic tech required. LINE-based governance, flood sensors, and a 5-star service rating — all replicable by any Thai municipality with political will.", th: "โมเดลเน้นประชาชนลอกได้และถูก ไม่ต้องใช้เทคโนโลยีแพง การปกครองผ่าน LINE เซ็นเซอร์น้ำท่วม และระบบให้คะแนนบริการ 5 ดาว — ทั้งหมดทำซ้ำได้โดยเทศบาลไทยที่มีเจตจำนงทางการเมือง", zh: "以民为本的模式可复制且成本低廉。无需高科技。基于LINE的治理、洪水传感器、五星服务评级——凡有政治意愿的泰国任何市政当局均可复制。" },
    theCatch: { en: "Low GPP (฿118K/capita). Youth out-migration to Bangkok. The success depends heavily on one mayor's leadership style — institutional continuity is the risk.", th: "GPP ต่ำ (฿118K/หัว) เยาวชนอพยพไปกรุงเทพฯ ความสำเร็จพึ่งพาสไตล์ผู้นำของนายกคนเดียวมาก ความต่อเนื่องเชิงสถาบันคือความเสี่ยง", zh: "人均GPP偏低（11.8万泰铢）。年轻人持续流向曼谷。成功高度依赖一位市长的领导风格——制度延续性是最大风险。" },
    landArea: 9943,
    established: "~700s CE",
  },
  "hat-yai": {
    livelihood: { en: "Cross-border trade with Malaysia, retail, wholesale markets, healthcare tourism for Malaysian visitors, and rubber trading. Thailand's southern commercial hub.", th: "การค้าชายแดนกับมาเลเซีย ค้าปลีก ตลาดค้าส่ง ท่องเที่ยวเชิงสุขภาพสำหรับนักท่องเที่ยวมาเลย์ และค้ายาง ศูนย์กลางการค้าภาคใต้ของไทย", zh: "与马来西亚的跨境贸易、零售、批发市场、面向马来游客的医疗旅游，以及橡胶贸易。泰国南部商业枢纽。" },
    famousFor: { en: "Flooding. Seriously — smart flood management is the critical infrastructure here. Also: night markets, cross-border shopping, and being the gateway between Thailand and Malaysia.", th: "น้ำท่วม — จริงจัง ระบบจัดการน้ำท่วมอัจฉริยะคือโครงสร้างพื้นฐานสำคัญที่นี่ ยังมี: ตลาดกลางคืน ช้อปปิ้งข้ามพรมแดน และเป็นประตูระหว่างไทย-มาเลเซีย", zh: "洪水——这里的智慧防洪管理是核心基础设施。还有：夜市、跨境购物，以及泰马之间的门户城市。" },
    opportunity: { en: "ASUS Phase II (UN-Habitat) is developing a Climate Change Adaptation Roadmap. THB 3.5M already budgeted for 400 CCTV. Hat Yai-Sadao Motorway ($903M) in ASEAN Infrastructure Pipeline.", th: "ASUS Phase II (UN-Habitat) กำลังพัฒนา Climate Change Adaptation Roadmap งบ 3.5 ล้านบาทอนุมัติแล้วสำหรับ CCTV 400 ตัว มอเตอร์เวย์หาดใหญ่-สะเดา ($903M) ในท่อ ASEAN Infrastructure Pipeline", zh: "ASUS第二期（UN-Habitat）正制定气候变化适应路线图。已批准350万泰铢用于400台CCTV。合艾—萨达高速公路（9.03亿美元）纳入东盟基础设施管道。" },
    theCatch: { en: "Recurring floods. Proximity to deep south security situation. Crime rate 168/100K. The commercial vibrancy masks infrastructure aging that needs urgent attention.", th: "น้ำท่วมซ้ำ ใกล้สถานการณ์ความมั่นคงชายแดนใต้ อัตราอาชญากรรม 168/100K ความคึกคักทางการค้าปิดบังโครงสร้างพื้นฐานที่เก่าและต้องดูแลเร่งด่วน", zh: "洪灾反复。毗邻南部安全局势。犯罪率168/10万。商业活力掩盖了急需关注的基础设施老化。" },
    landArea: 21,
  },
  yala: {
    livelihood: { en: "Government services, rubber plantations, halal food processing, and security forces. A city defined by its position in the deep south conflict zone — but determined to build despite it.", th: "ราชการ สวนยาง แปรรูปอาหารฮาลาล และกองกำลังรักษาความปลอดภัย เมืองที่ถูกกำหนดโดยตำแหน่งในพื้นที่ขัดแย้งชายแดนใต้ — แต่มุ่งมั่นสร้างแม้อยู่ในสถานการณ์นั้น", zh: "政府服务、橡胶园、清真食品加工和安全部队。一座因地处南部冲突带而被定义的城市——但仍坚定地在此建设。" },
    famousFor: { en: "Thailand's cleanest city — 4 consecutive years. Green space management exceeding national standards. Smart city achievements despite being in an active conflict zone.", th: "เมืองสะอาดที่สุดของไทย — 4 ปีติดต่อกัน จัดการพื้นที่สีเขียวเกินมาตรฐานชาติ ความสำเร็จเมืองอัจฉริยะแม้อยู่ในเขตขัดแย้ง", zh: "泰国最清洁城市——连续4年。绿地管理超越国家标准。在活跃冲突区取得智慧城市成就。" },
    opportunity: { en: "If Yala can build a smart city in a conflict zone, it proves the model works anywhere. The Smart Environment excellence award is genuine — this is a city that earns its scores.", th: "ถ้ายะลาสร้างเมืองอัจฉริยะในเขตขัดแย้งได้ มันพิสูจน์ว่าโมเดลใช้ได้ทุกที่ รางวัล Smart Environment เป็นของจริง — เมืองนี้สมควรกับคะแนนที่ได้", zh: "如果亚拉能在冲突区建设智慧城市，这证明该模式放之四海皆准。智慧环境优秀奖货真价实——这座城市的得分是实至名归的。" },
    theCatch: { en: "Security situation. Crime rate 245/100K. Lowest GPP in the index (฿95K). Youth leave for safer cities. International investment is near zero due to perceived risk.", th: "สถานการณ์ความมั่นคง อัตราอาชญากรรม 245/100K GPP ต่ำสุดในดัชนี (฿95K) เยาวชนออกไปเมืองที่ปลอดภัยกว่า การลงทุนจากต่างประเทศเกือบเป็นศูนย์เนื่องจากความเสี่ยงที่รับรู้", zh: "安全局势。犯罪率245/10万。指数中最低GPP（9.5万泰铢）。年轻人前往更安全城市。由于风险感知，国际投资几乎为零。" },
    landArea: 4521,
  },
  krabi: {
    livelihood: { en: "Tourism (Phi Phi, Railay Beach, island hopping), rubber and palm oil plantations, fisheries. A quieter Andaman alternative to Phuket with genuine marine conservation efforts.", th: "ท่องเที่ยว (พีพี ไร่เลย์ ทัวร์เกาะ) สวนยางและปาล์ม ประมง ทางเลือกอันดามันที่เงียบกว่าภูเก็ตพร้อมความพยายามอนุรักษ์ทะเลจริง", zh: "旅游业（皮皮岛、莱莱湾、跳岛游）、橡胶和棕榈种植、渔业。比普吉更宁静的安达曼替代选择，有真实的海洋保护努力。" },
    famousFor: { en: "Phi Phi Islands, Railay Beach, limestone karsts, marine national parks. Genuine smart environmental monitoring that protects the islands from overtourism.", th: "หมู่เกาะพีพี หาดไร่เลย์ หินปูนคาร์สต์ อุทยานแห่งชาติทางทะเล เฝ้าระวังสิ่งแวดล้อมอัจฉริยะจริงที่ปกป้องเกาะจากนักท่องเที่ยวล้น", zh: "皮皮群岛、莱莱湾、石灰岩喀斯特、海洋国家公园。切实有效的智慧环境监测，保护岛屿免受过度旅游侵害。" },
    opportunity: { en: "Marine conservation tech could become the ASEAN standard for island tourism management. Renewable energy pilot underway. Clean air (PM2.5 14.5) and high green coverage (55%).", th: "เทคโนโลยีอนุรักษ์ทะเลอาจเป็นมาตรฐานอาเซียนสำหรับจัดการท่องเที่ยวเกาะ โครงการนำร่องพลังงานหมุนเวียน อากาศสะอาด (PM2.5 14.5) และพื้นที่สีเขียวสูง (55%)", zh: "海洋保护技术有望成为东盟岛屿旅游管理标准。可再生能源试点进行中。空气洁净（PM2.5 14.5），绿化覆盖率高（55%）。" },
    theCatch: { en: "Tourism-economy tension is real — conservation competes with resort development money. Infrastructure outside tourist areas is weak. Economy collapses without visitors.", th: "ความขัดแย้งท่องเที่ยว-เศรษฐกิจเป็นจริง — การอนุรักษ์แข่งกับเงินพัฒนารีสอร์ท โครงสร้างพื้นฐานนอกเขตท่องเที่ยวอ่อนแอ เศรษฐกิจพังถ้าไม่มีนักท่องเที่ยว", zh: "旅游与经济之间的张力真实存在——保护与度假村开发资金竞争。旅游区以外基础设施薄弱。没有游客经济立即崩溃。" },
    landArea: 4708,
  },
  rayong: {
    livelihood: { en: "Petrochemicals (Map Ta Phut industrial estate), automotive manufacturing, fruit orchards (durian, rambutan), and fishing. Thailand's highest GPP per capita (฿1.02M) outside Bangkok.", th: "ปิโตรเคมี (นิคมอุตสาหกรรมมาบตาพุด) ผลิตรถยนต์ สวนผลไม้ (ทุเรียน เงาะ) และประมง GPP ต่อหัวสูงสุดของไทย (฿1.02M) นอกกรุงเทพฯ", zh: "石化（马塔普工业区）、汽车制造、果园（榴莲、红毛丹）和渔业。曼谷以外泰国人均GPP最高（102万泰铢）。" },
    famousFor: { en: "Richest province by GPP. Map Ta Phut industrial zone. EEC anchor. Smart environmental monitoring around chemical plants — genuinely useful for public health.", th: "จังหวัดที่ร่ำรวยที่สุดตาม GPP นิคมอุตสาหกรรมมาบตาพุด เสาหลัก EEC เฝ้าระวังสิ่งแวดล้อมอัจฉริยะรอบโรงงานเคมี — มีประโยชน์จริงต่อสาธารณสุข", zh: "GPP最富裕府。马塔普工业区。EEC支柱。围绕化工厂的智慧环境监测——对公共健康确实有用。" },
    opportunity: { en: "EEC investment pipeline is massive (THB 1.35T through 2037). Environmental monitoring tech developed here for industrial zones could be exported to other ASEAN industrial corridors.", th: "ท่อลงทุน EEC มหาศาล (1.35 ล้านล้านบาท ถึง 2580) เทคโนโลยีเฝ้าระวังสิ่งแวดล้อมที่พัฒนาที่นี่สำหรับเขตอุตสาหกรรมส่งออกไประเบียงอุตสาหกรรมอาเซียนอื่นได้", zh: "EEC投资管道规模巨大（至2037年达1.35万亿泰铢）。在此为工业区开发的环境监测技术可出口至其他东盟工业走廊。" },
    theCatch: { en: "Environmental contamination history. Community health concerns around Map Ta Phut. The wealth is industrial — residents don't feel rich. Air and water quality require constant vigilance.", th: "ประวัติการปนเปื้อนสิ่งแวดล้อม ความกังวลด้านสุขภาพชุมชนรอบมาบตาพุด ความมั่งคั่งเป็นแบบอุตสาหกรรม — ผู้อยู่อาศัยไม่รู้สึกรวย คุณภาพอากาศและน้ำต้องเฝ้าระวังตลอด", zh: "环境污染历史。马塔普周边社区健康忧虑。财富属于工业——居民并不感受到富裕。空气和水质需要持续监测。" },
    landArea: 3552,
  },
  "wangchan-valley": {
    livelihood: { en: "Currently uninhabited. Designed as an innovation campus by PTT situated in a designated zone in Rayong province.", th: "ปัจจุบันยังไม่มีผู้อยู่อาศัย ออกแบบให้เป็นแคมปัสนวัตกรรมโดย ปตท. ตั้งอยู่ในเขตพื้นที่จังหวัดระยอง", zh: "目前无人居住。由泰国石油集团（PTT）在罗勇府指定区域规划建设的创新园区。" },
    famousFor: { en: "Being ranked #1 smart city in Thailand by the old index. In reality: less than 10% built. The emperor has no clothes.", th: "ถูกจัดอันดับ #1 เมืองอัจฉริยะไทยจากดัชนีเก่า ในความเป็นจริง: สร้างไม่ถึง 10% จักรพรรดิไม่มีเสื้อผ้า", zh: "旧指数中被评为泰国第一智慧城市。实际情况：建成不足10%。皇帝没有穿衣服。" },
    opportunity: { en: "If PTT actually builds it, the land and infrastructure planning are sound. EECi concept is aligned with national policy. But until shovels hit dirt, it's just a masterplan.", th: "ถ้า PTT สร้างจริง การวางแผนที่ดินและโครงสร้างพื้นฐานดี แนวคิด EECi ตรงกับนโยบายชาติ แต่จนกว่าจะเริ่มขุด มันก็แค่แผนแม่บท", zh: "如果PTT真正开工建设，土地规划和基础设施布局尚属合理。EECi理念与国家政策一致。但在铲子落地之前，这只不过是一张总体规划。" },
    theCatch: { en: "Zero residents. Zero commercial activity. Zero operational infrastructure. The logo was awarded to a concept, not a city. This is why this index exists.", th: "ผู้อยู่อาศัย ศูนย์ กิจกรรมเชิงพาณิชย์ ศูนย์ โครงสร้างพื้นฐานปฏิบัติการ ศูนย์ ตราสัญลักษณ์มอบให้กับแนวคิด ไม่ใช่เมือง นี่คือเหตุผลที่ดัชนีนี้มีอยู่", zh: "零居民。零商业活动。零运营基础设施。这枚标志授予了一个概念，而非一座城市。这正是本指数存在的原因。" },
    landArea: 32,
  },
  "mae-moh": {
    livelihood: { en: "EGAT power plant workers, coal mining legacy community, small-scale agriculture. A company town transitioning — the power plant is the economy.", th: "พนักงานโรงไฟฟ้า กฟผ. ชุมชนมรดกเหมืองถ่านหิน เกษตรขนาดเล็ก เมืองบริษัทที่กำลังเปลี่ยนผ่าน — โรงไฟฟ้าคือเศรษฐกิจ", zh: "国家电力局（EGAT）电厂工人、煤矿历史遗留社区、小规模农业。一座公司城镇正在转型——电厂就是经济本身。" },
    famousFor: { en: "Coal-to-clean energy transition. EGAT smart grid pilot. Air quality monitoring born from necessity — residents demanded it after years of pollution.", th: "การเปลี่ยนผ่านจากถ่านหินสู่พลังงานสะอาด โครงการนำร่อง smart grid ของ กฟผ. ระบบตรวจวัดคุณภาพอากาศเกิดจากความจำเป็น — ชาวบ้านเรียกร้องหลังหลายปีของมลพิษ", zh: "煤炭到清洁能源转型。EGAT智能电网试点。空气质量监测因现实需要而生——居民在多年污染后提出要求。" },
    opportunity: { en: "Smart energy monitoring here is genuinely world-class. The coal-to-clean transition model could be exported to other EGAT sites and ASEAN coal communities.", th: "ระบบติดตามพลังงานอัจฉริยะที่นี่เป็นระดับโลกจริงๆ โมเดลเปลี่ยนผ่านถ่านหินสู่สะอาดส่งออกไปไซต์ กฟผ. อื่นและชุมชนถ่านหินอาเซียนได้", zh: "这里的智慧能源监测真正达到世界一流水平。煤炭向清洁能源转型模式可出口至其他EGAT站点及东盟煤炭社区。" },
    theCatch: { en: "Industrial legacy means air and soil quality challenges persist. Population small (42K). Young people leave for Chiang Mai or Bangkok.", th: "มรดกอุตสาหกรรมหมายถึงปัญหาคุณภาพอากาศและดินยังคงอยู่ ประชากรน้อย (42K) คนหนุ่มสาวออกไปเชียงใหม่หรือกรุงเทพฯ", zh: "工业遗留意味着空气和土壤质量挑战持续存在。人口少（4.2万）。年轻人前往清迈或曼谷。" },
    landArea: 857,
  },
  nakhonsawan: {
    livelihood: { en: "River trade, rice farming, freshwater fisheries, government services. Located at the confluence of the Ping and Nan rivers — geography defines everything here.", th: "ค้าขายทางน้ำ ทำนา ประมงน้ำจืด ราชการ ตั้งอยู่ที่จุดบรรจบแม่น้ำปิงและน่าน — ภูมิศาสตร์กำหนดทุกอย่างที่นี่", zh: "水路贸易、稻作、淡水渔业、政府服务。位于滨河与南河汇流处——地理决定一切。" },
    famousFor: { en: "Smart flood management with 30+ IoT river sensors. The confluence location makes flooding existential — smart tech here saves lives, not just time.", th: "จัดการน้ำท่วมอัจฉริยะด้วยเซ็นเซอร์แม่น้ำ IoT 30+ จุด ตำแหน่งจุดบรรจบทำให้น้ำท่วมเป็นเรื่องชีวิตตาย เทคอัจฉริยะที่นี่ช่วยชีวิต ไม่ใช่แค่ประหยัดเวลา", zh: "配备30余个IoT河流传感器的智慧防洪管理。汇流地理使洪水成为生死攸关的议题——这里的智慧技术救的是生命，不只是时间。" },
    opportunity: { en: "Flood sensor network could become the template for every Thai river city. Digital agriculture pilot for rice farmers shows how tech reaches the 80% of Thailand that isn't Bangkok.", th: "เครือข่ายเซ็นเซอร์น้ำท่วมอาจเป็นแม่แบบสำหรับเมืองริมแม่น้ำทุกเมืองในไทย โครงการเกษตรดิจิทัลสำหรับชาวนาแสดงให้เห็นว่าเทคไปถึง 80% ของไทยที่ไม่ใช่กรุงเทพฯ ได้อย่างไร", zh: "洪水传感器网络有望成为泰国每座滨河城市的模板。稻农数字农业试点展示了技术如何触达泰国80%的非曼谷地区。" },
    theCatch: { en: "Broader digital adoption is still early. Economy is agriculture-dependent. Young talent migrates to Bangkok. GPP per capita (฿138K) is below national average.", th: "การนำดิจิทัลไปใช้ในวงกว้างยังอยู่ในช่วงเริ่มต้น เศรษฐกิจพึ่งพาเกษตร คนหนุ่มสาวย้ายไปกรุงเทพฯ GPP ต่อหัว (฿138K) ต่ำกว่าค่าเฉลี่ยประเทศ", zh: "更广泛的数字化采用仍处于早期阶段。经济依赖农业。年轻人才向曼谷流失。人均GPP（13.8万泰铢）低于全国平均水平。" },
    landArea: 9598,
  },
  saensuk: {
    livelihood: { en: "Beach tourism, seafood restaurants, university students (Burapha University nearby), and a growing residential suburb of the EEC corridor.", th: "ท่องเที่ยวชายหาด ร้านอาหารทะเล นักศึกษา (มหาวิทยาลัยบูรพาใกล้) และชานเมืองที่อยู่อาศัยที่เติบโตของระเบียง EEC", zh: "海滩旅游、海鲜餐厅、大学生（博仁大学在附近），以及不断壮大的EEC走廊住宅郊区。" },
    famousFor: { en: "Real-time beach water quality monitoring — bacteria counts visible to the public. Smart waste collection with GPS-tracked trucks. The Burapha University Faculty of Engineering partnership that put IoT fall-detection sensors in the homes of elderly residents living alone — then watched Samitivej Sriracha hospital adopt the same technology.", th: "เฝ้าระวังคุณภาพน้ำชายหาดเรียลไทม์ — ปริมาณแบคทีเรียเปิดเผยต่อสาธารณะ เก็บขยะอัจฉริยะด้วยรถติดตาม GPS ความร่วมมือกับคณะวิศวกรรมศาสตร์ มหาวิทยาลัยบูรพาที่นำเซ็นเซอร์ IoT ตรวจจับการล้มไปติดตั้งในบ้านผู้สูงอายุที่อยู่คนเดียว และต่อมาโรงพยาบาลสมิติเวชศรีราชานำเทคโนโลยีเดียวกันไปใช้", zh: "实时海滩水质监测——细菌计数向公众公开。GPS追踪垃圾车的智慧废物收集。博仁大学工程学院合作项目——将IoT跌倒检测传感器安装进独居老人家中，而后素攀密席叻查医院采用了同一技术。" },
    opportunity: { en: "A model for how small beachfront municipalities punch above their weight. The Burapha University partnership (with Dell and Intel involvement) produced IoT fall-detection for elderly residents living alone — a genuine welfare outcome, not a headline. Samitivej Sriracha hospital later adopted the same system. Low cost, real-world impact, university-city co-design: the template is replicable anywhere.", th: "โมเดลว่าเทศบาลริมหาดขนาดเล็กทำได้มากเกินขนาด ความร่วมมือมหาวิทยาลัยบูรพา (มี Dell และ Intel ร่วม) พัฒนาระบบ IoT ตรวจจับการล้มสำหรับผู้สูงอายุที่อยู่คนเดียว — ผลลัพธ์สวัสดิการจริง ไม่ใช่แค่หัวข่าว ต่อมาโรงพยาบาลสมิติเวชศรีราชานำระบบเดียวกันไปใช้ ต้นทุนต่ำ ผลกระทบจริงในโลก ออกแบบร่วมเมือง-มหาวิทยาลัย: แม่แบบนี้ทำซ้ำได้ทุกที่", zh: "小型滨海市政机构超水平发挥的范本。博仁大学合作项目（有戴尔和英特尔参与）为独居老人开发了IoT跌倒检测系统——真实的福利成果，不是噱头。素攀密席叻查医院后来采用了同一系统。低成本、真实世界影响、政校协同设计：这一模板在任何地方都可复制。" },
    theCatch: { en: "Population only 82K. Economy depends on tourism and university cycle. Not enough scale to attract major private investment.", th: "ประชากรเพียง 82K เศรษฐกิจพึ่งพาวงจรท่องเที่ยวและมหาวิทยาลัย ไม่มี scale พอดึงดูดการลงทุนเอกชนรายใหญ่", zh: "人口仅8.2万。经济依赖旅游和大学周期。规模不足以吸引主要私人投资。" },
    landArea: 21,
  },
  chachoengsao: {
    livelihood: { en: "Manufacturing (auto parts, electronics), logistics, warehousing. The gateway to the EEC — factories and distribution centers define the economy.", th: "การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) โลจิสติกส์ คลังสินค้า ประตูสู่ EEC — โรงงานและศูนย์กระจายสินค้ากำหนดเศรษฐกิจ", zh: "制造业（汽车零部件、电子）、物流、仓储。EEC门户——工厂和配送中心定义了经济格局。" },
    famousFor: { en: "EEC gateway with genuine smart infrastructure. Digital citizen services portal. Smart flood early warning. 5G connectivity via EEC backbone.", th: "ประตู EEC ที่มีโครงสร้างพื้นฐานอัจฉริยะจริง พอร์ทัลบริการประชาชนดิจิทัล เตือนน้ำท่วมอัจฉริยะ 5G เชื่อมผ่าน EEC", zh: "拥有真实智慧基础设施的EEC门户。数字公民服务门户。智慧洪水预警。通过EEC骨干网提供5G连接。" },
    opportunity: { en: "The highest GPP per capita (฿422K) among EEC cities outside Rayong. Connected to high-speed rail project. Smart industrial zone management is a genuine differentiator.", th: "GPP ต่อหัวสูงสุด (฿422K) ในเมือง EEC นอกระยอง เชื่อมกับรถไฟความเร็วสูง การจัดการเขตอุตสาหกรรมอัจฉริยะเป็นจุดแข็งที่แท้จริง", zh: "EEC城市中罗勇以外人均GPP最高（42.2万泰铢）。与高铁项目相连。智慧工业区管理是真正的差异化优势。" },
    theCatch: { en: "Livability lags behind economic output. Industrial growth doesn't always translate to quality of life. Traffic congestion growing as EEC expands.", th: "ความน่าอยู่ตามหลังผลผลิตเศรษฐกิจ การเติบโตอุตสาหกรรมไม่ได้แปลเป็นคุณภาพชีวิตเสมอ จราจรติดขัดมากขึ้นเมื่อ EEC ขยาย", zh: "宜居性落后于经济产出。工业增长并不总能转化为生活质量。随着EEC扩张，交通拥堵日趋严重。" },
    landArea: 5351,
  },
  "chiang-rai": {
    livelihood: { en: "Tourism (White Temple, Blue Temple, Golden Triangle), tea and coffee plantations, border trade with Laos and Myanmar.", th: "ท่องเที่ยว (วัดร่องขุ่น วัดร่องเสือเต้น สามเหลี่ยมทองคำ) ไร่ชาและกาแฟ ค้าชายแดนกับลาวและเมียนมา", zh: "旅游业（白庙、蓝庙、金三角）、茶与咖啡种植、与老挝和缅甸的边境贸易。" },
    famousFor: { en: "Smart tourism platform for heritage sites. Digital agriculture for tea and coffee farmers. Air quality monitoring — same burning haze problem as Chiang Mai.", th: "แพลตฟอร์มท่องเที่ยวอัจฉริยะสำหรับแหล่งมรดก เกษตรดิจิทัลสำหรับชาวไร่ชาและกาแฟ ตรวจวัดคุณภาพอากาศ — ปัญหาหมอกควันเดียวกับเชียงใหม่", zh: "遗址智慧旅游平台。面向茶农和咖啡农的数字农业。空气质量监测——与清迈同样的燃烧霾问题。" },
    opportunity: { en: "Border trade digitization with Laos and Myanmar is a genuine niche. Tea and coffee smart agriculture could scale across northern Thailand's hill country.", th: "ดิจิทัลค้าชายแดนกับลาวและเมียนมาเป็น niche จริง เกษตรอัจฉริยะชากาแฟขยายได้ทั่วภูเขาภาคเหนือ", zh: "与老挝和缅甸的边境贸易数字化是真实存在的细分赛道。茶咖啡智慧农业可在泰北山地全面推广。" },
    theCatch: { en: "PM2.5 at 42.8 μg/m³ — nearly as bad as Chiang Mai. Lowest economy score among northern cities. Remote location limits private investment.", th: "PM2.5 42.8 μg/m³ — เกือบแย่เท่าเชียงใหม่ คะแนนเศรษฐกิจต่ำสุดในเมืองเหนือ ทำเลห่างไกลจำกัดการลงทุนเอกชน", zh: "PM2.5 42.8 μg/m³——几乎与清迈一样糟糕。北部城市中经济分数最低。偏远位置限制私人投资。" },
    landArea: 11678,
  },
  nan: {
    livelihood: { en: "Subsistence agriculture, forest products, heritage tourism, community-based conservation. One of Thailand's poorest provinces but richest in natural capital.", th: "เกษตรยังชีพ ผลิตภัณฑ์จากป่า ท่องเที่ยวเชิงมรดก การอนุรักษ์โดยชุมชน จังหวัดที่ยากจนที่สุดแต่อุดมด้วยทุนธรรมชาติ", zh: "自给农业、林产品、遗址旅游、社区主导的保护行动。泰国最贫困府之一，但自然资本最丰富。" },
    famousFor: { en: "Community-driven forest fire monitoring. Smart heritage preservation for Nan old town. The highest green coverage (72%) of any smart city in the index.", th: "เฝ้าระวังไฟป่าโดยชุมชน อนุรักษ์มรดกอัจฉริยะสำหรับเมืองเก่าน่าน พื้นที่สีเขียวสูงสุด (72%) ของเมืองอัจฉริยะทุกเมืองในดัชนี", zh: "社区驱动的森林火灾监测。南奔古城智慧遗址保护。绿化覆盖率（72%）是指数中所有智慧城市最高的。" },
    opportunity: { en: "Community-driven model is the cheapest and most sustainable smart city approach. If it works in Nan (GPP ฿88K), it works anywhere.", th: "โมเดลที่ขับเคลื่อนโดยชุมชนเป็นแนวทางเมืองอัจฉริยะที่ถูกที่สุดและยั่งยืนที่สุด ถ้ามันใช้ได้ในน่าน (GPP ฿88K) มันใช้ได้ทุกที่", zh: "社区驱动模式是最廉价、最可持续的智慧城市路径。如果在南（GPP 8.8万泰铢）能行得通，则放之四海皆准。" },
    theCatch: { en: "Lowest GPP in the north (฿88K). Young people leave. PM2.5 35.5 from burning season. Digital infrastructure is minimal beyond the pilot areas.", th: "GPP ต่ำสุดในภาคเหนือ (฿88K) คนหนุ่มสาวออกไป PM2.5 35.5 จากฤดูเผา โครงสร้างพื้นฐานดิจิทัลน้อยมากนอกพื้นที่นำร่อง", zh: "北部GPP最低（8.8万泰铢）。年轻人出走。焚烧季PM2.5达35.5。数字基础设施在试点区以外几乎为零。" },
    landArea: 11472,
  },
  korat: {
    livelihood: { en: "Regional trade hub, manufacturing (auto parts, electronics), university sector (Suranaree University of Technology), agriculture processing.", th: "ศูนย์กลางการค้าภูมิภาค การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) ภาคมหาวิทยาลัย (มทส.) แปรรูปเกษตร", zh: "区域贸易枢纽、制造业（汽车零部件、电子）、大学（宋卡理工大学）、农产品加工。" },
    famousFor: { en: "Isan's gateway. Connected to the Bangkok-Nong Khai high-speed rail (Cabinet approved Feb 2025). Smart traffic management. The largest city in northeast Thailand.", th: "ประตูอีสาน เชื่อมกับรถไฟความเร็วสูงกรุงเทพฯ-หนองคาย (ครม. อนุมัติ ก.พ. 2568) จัดการจราจรอัจฉริยะ เมืองใหญ่ที่สุดในอีสาน", zh: "泰东北门户。连接曼谷至廊开高铁（内阁2025年2月批准）。智慧交通管理。泰国东北部最大城市。" },
    opportunity: { en: "High-speed rail will transform Korat from a 3-hour drive to a 90-minute commute from Bangkok. Smart city infrastructure can ride the rail investment wave.", th: "รถไฟความเร็วสูงจะเปลี่ยนโคราชจากขับรถ 3 ชม. เป็นเดินทาง 90 นาทีจากกรุงเทพฯ โครงสร้างพื้นฐานเมืองอัจฉริยะขี่คลื่นการลงทุนรถไฟได้", zh: "高铁将把呵叻从3小时车程变为距曼谷90分钟通勤。智慧城市基础设施可乘上轨道交通投资的东风。" },
    theCatch: { en: "Still building momentum — not yet at Alpha tier (64.9). Population 2.65M makes service delivery complex. Brain drain to Bangkok despite being Isan's biggest city.", th: "ยังสร้างโมเมนตัม — ยังไม่ถึงระดับ Alpha (64.9) ประชากร 2.65 ล้านทำให้การส่งมอบบริการซับซ้อน สมองไหลไปกรุงเทพฯ แม้เป็นเมืองใหญ่สุดของอีสาน", zh: "仍在积累势能——尚未达到Alpha级（64.9）。265万人口使服务提供复杂化。尽管是泰东北最大城市，人才仍持续外流至曼谷。" },
    landArea: 2314,
  },
  "phitsanulok-muni": {
    livelihood: { en: "Government hub for the lower north, agriculture (rice, sugarcane), university sector (Naresuan University), and regional healthcare.", th: "ศูนย์กลางราชการภาคเหนือตอนล่าง เกษตร (ข้าว อ้อย) ภาคมหาวิทยาลัย (ม.นเรศวร) และสาธารณสุขภูมิภาค", zh: "北部低地政府枢纽、农业（稻米、甘蔗）、大学（纳黎萱大学）和区域医疗。" },
    famousFor: { en: "Smart governance platform with 80%+ citizen adoption. Smart street lighting reducing energy 35%. Unflashy but genuinely delivers.", th: "แพลตฟอร์มปกครองอัจฉริยะที่ประชาชนใช้ 80%+ ไฟถนนอัจฉริยะลดพลังงาน 35% ไม่โอ้อวดแต่ส่งมอบจริง", zh: "市民采用率超80%的智慧治理平台。智慧路灯节能35%。低调但真实兑现。" },
    opportunity: { en: "The quiet workhorse model — no headlines but 80% citizen adoption of digital services is higher than most Alpha-tier cities. Proof that unglamorous execution wins.", th: "โมเดลม้าทำงานเงียบๆ — ไม่มีพาดหัวแต่ประชาชนใช้บริการดิจิทัล 80% สูงกว่าเมือง Alpha ส่วนใหญ่ พิสูจน์ว่าการทำงานไม่หวือหวาชนะ", zh: "低调实干型模式——没有大新闻，但数字服务市民采用率80%高于大多数Alpha级城市。证明不炫耀的执行力才是赢家。" },
    theCatch: { en: "Beta tier (64.8) despite strong governance — economy and environment scores hold it back. PM2.5 30.2 from northern burning. Not enough economic pull to retain graduates.", th: "ระดับ Beta (64.8) แม้ปกครองแข็ง — คะแนนเศรษฐกิจและสิ่งแวดล้อมดึงลง PM2.5 30.2 จากการเผาภาคเหนือ ดึงดูดบัณฑิตไม่พอ", zh: "Beta级（64.8），尽管治理能力强——经济和环境分数拖了后腿。北部焚烧PM2.5 30.2。留不住毕业生的经济吸引力不足。" },
    landArea: 10816,
  },
  lampang: {
    livelihood: { en: "Ceramics (Lampang is 'the pottery city'), horse-drawn carriages (tourism icon), agriculture, and EGAT power generation from nearby Mae Moh.", th: "เซรามิก (ลำปางคือ 'เมืองเครื่องปั้นดินเผา') รถม้า (ไอคอนท่องเที่ยว) เกษตร และผลิตไฟฟ้า กฟผ. จากแม่เมาะใกล้ๆ", zh: "陶瓷（南邦是「陶器之城」）、马车（旅游标志）、农业，以及来自附近拿莫工厂的EGAT发电。" },
    famousFor: { en: "Heritage-tech fusion. Smart tourism around horse carriage routes. Clean energy from Mae Moh coal transition. Batch 3 certified — newer but building fast.", th: "ผสมผสานมรดก-เทคโนโลยี ท่องเที่ยวอัจฉริยะรอบเส้นทางรถม้า พลังงานสะอาดจากการเปลี่ยนผ่านแม่เมาะ รุ่น 3 รับรอง — ใหม่กว่าแต่สร้างเร็ว", zh: "遗址与科技融合。马车路线的智慧旅游。来自拿莫煤炭转型的清洁能源。第3批次认证——更新但成长迅速。" },
    opportunity: { en: "Ceramics + heritage tourism + clean energy = a unique identity no other Thai smart city has. Could become the model for cultural smart cities.", th: "เซรามิก + ท่องเที่ยวเชิงมรดก + พลังงานสะอาด = อัตลักษณ์ที่ไม่มีเมืองอัจฉริยะไทยอื่นมี อาจเป็นโมเดลเมืองอัจฉริยะเชิงวัฒนธรรม", zh: "陶瓷+遗址旅游+清洁能源=其他泰国智慧城市所没有的独特身份。有望成为文化智慧城市的标杆。" },
    theCatch: { en: "PM2.5 38.5 — burning season is brutal in Lampang basin. Economy is small-scale and local. Not enough tech talent to sustain digital innovation long-term.", th: "PM2.5 38.5 — ฤดูเผารุนแรงในแอ่งลำปาง เศรษฐกิจเล็กและท้องถิ่น talent เทคไม่พอรักษานวัตกรรมดิจิทัลระยะยาว", zh: "PM2.5 38.5——南邦盆地焚烧季节极为严峻。经济规模小且本地化。科技人才不足以长期支撑数字创新。" },
    landArea: 12534,
  },
  samui: {
    livelihood: { en: "Tourism (resorts, diving, full moon parties), coconut farming, fishing. An island economy entirely dependent on visitor arrivals.", th: "ท่องเที่ยว (รีสอร์ท ดำน้ำ ฟูลมูนปาร์ตี้) ทำสวนมะพร้าว ประมง เศรษฐกิจเกาะที่พึ่งพานักท่องเที่ยวทั้งหมด", zh: "旅游业（度假村、潜水、满月派对）、椰子种植、渔业。完全依赖游客到访的岛屿经济。" },
    famousFor: { en: "Smart waste and water management for an island that desperately needs it. Tourism pressure is intense — 68K residents serving millions of visitors.", th: "จัดการขยะและน้ำอัจฉริยะสำหรับเกาะที่ต้องการอย่างยิ่ง แรงกดดันท่องเที่ยวรุนแรง — ผู้อยู่อาศัย 68K รองรับนักท่องเที่ยวหลายล้าน", zh: "为岛屿量身打造的智慧废物与水资源管理。旅游压力巨大——6.8万居民服务数百万游客。" },
    opportunity: { en: "Island sustainability tech is globally relevant. Smart water management during droughts can be exported to every Thai island and beyond.", th: "เทคความยั่งยืนเกาะเกี่ยวข้องกับระดับโลก จัดการน้ำอัจฉริยะช่วงแล้งส่งออกไปเกาะไทยทุกเกาะและไกลกว่า", zh: "岛屿可持续技术具有全球意义。旱季智慧水资源管理可出口至泰国每个岛屿及更广区域。" },
    theCatch: { en: "Economy collapses without tourists. Water shortages in dry season. Crime rate 175/100K — tourism brings problems too. Infrastructure aging fast under visitor pressure.", th: "เศรษฐกิจพังถ้าไม่มีนักท่องเที่ยว ขาดแคลนน้ำหน้าแล้ง อาชญากรรม 175/100K — การท่องเที่ยวนำปัญหามาด้วย โครงสร้างพื้นฐานเก่าเร็วภายใต้แรงกดดันนักท่องเที่ยว", zh: "没有游客经济崩溃。旱季缺水。犯罪率175/10万——旅游业带来的问题。在游客压力下基础设施快速老化。" },
    landArea: 228,
  },
  "phra-ram-4": {
    livelihood: { en: "Office workers, financial sector, commercial real estate. Bangkok's CBD spine — Silom, Sathorn, and Lumpini in one corridor.", th: "พนักงานออฟฟิศ ภาคการเงิน อสังหาริมทรัพย์เชิงพาณิชย์ กระดูกสันหลัง CBD กรุงเทพฯ — สีลม สาทร และลุมพินีในระเบียงเดียว", zh: "上班族、金融业、商业地产。曼谷CBD的脊梁——是隆、沙通与伦披尼于一条走廊汇聚。" },
    famousFor: { en: "Smart traffic signal optimization along 4km corridor. The most commercially valuable smart city zone in Thailand — every improvement here has outsized economic impact.", th: "ปรับจังหวะสัญญาณจราจรอัจฉริยะตลอดระเบียง 4 กม. เขตเมืองอัจฉริยะที่มีมูลค่าเชิงพาณิชย์สูงสุดในไทย — ทุกการปรับปรุงมีผลกระทบทางเศรษฐกิจเกินสัดส่วน", zh: "4公里走廊内的智慧信号灯优化。泰国商业价值最高的智慧城市区域——每一项改善都带来超比例的经济影响。" },
    opportunity: { en: "Land value capture potential is massive — BTS/MRT proximity drives property values. Smart traffic here directly impacts millions of daily commuters.", th: "ศักยภาพจับมูลค่าที่ดินมหาศาล — ความใกล้ BTS/MRT ขับเคลื่อนราคาอสังหาฯ จราจรอัจฉริยะที่นี่กระทบผู้โดยสารรายวันหลายล้านคนโดยตรง", zh: "土地价值捕获潜力巨大——BTS/MRT临近推动物业价值上升。这里的智慧交通每天直接影响数百万通勤者。" },
    theCatch: { en: "PM2.5 32.4 — brutal air quality. Crime rate 285/100K — Bangkok-level. Congestion and air quality remain unsolved despite smart traffic. Green coverage only 12%.", th: "PM2.5 32.4 — คุณภาพอากาศแย่มาก อาชญากรรม 285/100K ระดับกรุงเทพฯ จราจรติดขัดและคุณภาพอากาศยังแก้ไม่ได้แม้มีจราจรอัจฉริยะ พื้นที่สีเขียวเพียง 12%", zh: "PM2.5 32.4——空气质量恶劣。犯罪率285/10万——曼谷水平。尽管有智慧交通，拥堵和空气质量依然悬而未决。绿化覆盖率仅12%。" },
    landArea: 8.5,
  },
  makkasan: {
    livelihood: { en: "Nobody lives here yet. Planned as a mega transit hub connecting Airport Rail Link, MRT, and intercity rail — but construction hasn't started.", th: "ยังไม่มีใครอาศัยอยู่ วางแผนเป็นศูนย์กลางขนส่งขนาดใหญ่เชื่อม Airport Rail Link, MRT, และรถไฟระหว่างเมือง — แต่ยังไม่เริ่มก่อสร้าง", zh: "尚无人居住。规划为连接机场快线、地铁和城际铁路的超级交通枢纽——但建设尚未启动。" },
    famousFor: { en: "Being certified based on an extensive masterplan while still in the earliest pre-development phase, with core infrastructure yet to be built.", th: "ได้รับการรับรองจากแผนแม่บทที่ครอบคลุมในขณะที่ยังอยู่ในช่วงก่อนการพัฒนา โครงสร้างพื้นฐานหลักยังไม่ได้ถูกสร้าง", zh: "在仍处于最早期开发阶段、核心基础设施尚未建成的情况下，凭借一份详尽总体规划获得认证。" },
    opportunity: { en: "If the transit hub is built, the location (central Bangkok, next to Airport Rail Link) is genuinely world-class. The land value alone justifies smart infrastructure.", th: "ถ้าศูนย์กลางขนส่งถูกสร้าง ทำเล (กลางกรุงเทพฯ ติด Airport Rail Link) เป็นระดับโลกจริง มูลค่าที่ดินเพียงอย่างเดียวก็คุ้มค่าโครงสร้างพื้นฐานอัจฉริยะ", zh: "如果交通枢纽建成，其选址（曼谷市中心，紧邻机场快线）真正达到世界级水准。仅土地价值本身就足以证明智慧基础设施的合理性。" },
    theCatch: { en: "Zero residents. Zero infrastructure. Zero timeline. The logo was awarded to a concept. This is exactly why this index measures reality.", th: "ผู้อยู่อาศัย ศูนย์ โครงสร้างพื้นฐาน ศูนย์ ไทม์ไลน์ ศูนย์ ตราสัญลักษณ์มอบให้กับแนวคิด นี่คือเหตุผลที่ดัชนีนี้วัดความจริง", zh: "零居民。零基础设施。零时间表。这枚标志授予了一个概念。这正是本指数衡量现实的意义所在。" },
  },
  "klong-phadung": {
    livelihood: { en: "Historic canal community — small traders, food vendors, government workers. A living heritage district being revitalized with smart water management and connected public spaces.", th: "ชุมชนคลองประวัติศาสตร์ — พ่อค้ารายย่อย ร้านอาหาร ข้าราชการ ย่านมรดกมีชีวิตที่ฟื้นฟูด้วยการจัดการน้ำอัจฉริยะและพื้นที่สาธารณะเชื่อมต่อ", zh: "历史运河社区——小商贩、食摊、政府工作人员。一个通过智慧水资源管理和连通公共空间焕发活力的活态遗址区。" },
    famousFor: { en: "Smart water quality monitoring in the canal system. AR cultural heritage walk. A genuine urban renewal project in old Bangkok.", th: "เฝ้าระวังคุณภาพน้ำอัจฉริยะในระบบคลอง เดินเที่ยวมรดกวัฒนธรรม AR โครงการฟื้นฟูเมืองจริงในย่านเก่ากรุงเทพฯ", zh: "运河体系的智慧水质监测。AR文化遗址步道。曼谷老城区真实的城市更新项目。" },
    opportunity: { en: "Canal-based smart cities are globally rare. If this works, it's an exportable model for Venice, Amsterdam, Suzhou — any city with historic waterways.", th: "เมืองอัจฉริยะริมคลองหายากระดับโลก ถ้าสำเร็จ มันเป็นโมเดลส่งออกสำหรับเวนิส อัมสเตอร์ดัม ซูโจว — เมืองใดก็ตามที่มีทางน้ำประวัติศาสตร์", zh: "以运河为核心的智慧城市在全球极为罕见。如果成功，将成为可出口至威尼斯、阿姆斯特丹、苏州的范本——任何拥有历史水道的城市。" },
    theCatch: { en: "Bangkok-level PM2.5 (32.4) and crime (285/100K). The smart canal project is small-scale. Scaling beyond the pilot area requires political will that comes and goes.", th: "PM2.5 ระดับกรุงเทพฯ (32.4) และอาชญากรรม (285/100K) โครงการคลองอัจฉริยะขนาดเล็ก ขยายเกินพื้นที่นำร่องต้องใช้เจตจำนงทางการเมืองที่มาๆ ไปๆ", zh: "曼谷级PM2.5（32.4）和犯罪率（285/10万）。智慧运河项目规模有限。在试点区以外推广需要政治意愿，而这来来去去。" },
  },
  phangnga: {
    livelihood: { en: "Tourism (Similan Islands, Khao Lak), fishing, rubber/palm oil. Defined by the 2004 tsunami — disaster preparedness is in this city's DNA.", th: "ท่องเที่ยว (หมู่เกาะสิมิลัน เขาหลัก) ประมง ยาง/ปาล์ม นิยามโดยสึนามิ 2547 — การเตรียมพร้อมรับภัยพิบัติอยู่ใน DNA ของเมือง", zh: "旅游业（斯米兰群岛、考拉克）、渔业、橡胶/棕榈油。因2004年海啸而定义——防灾备灾已融入这座城市的DNA。" },
    famousFor: { en: "Tsunami early warning system with IoT sensors. Smart mangrove conservation monitoring. The only Thai smart city where disaster tech isn't a nice-to-have but a survival necessity.", th: "ระบบเตือนสึนามีด้วยเซ็นเซอร์ IoT เฝ้าระวังอนุรักษ์ป่าชายเลน เมืองอัจฉริยะไทยเมืองเดียวที่เทคภัยพิบัติไม่ใช่ของดี แต่เป็นความจำเป็นเพื่ออยู่รอด", zh: "配备IoT传感器的海啸预警系统。智慧红树林保护监测。泰国唯一一座将灾害科技视为生死攸关必需品而非锦上添花的智慧城市。" },
    opportunity: { en: "Disaster-resilient smart city tech is a growing global market. Phang Nga's lived experience with tsunami response makes it a credible exporter of resilience tech.", th: "เทคเมืองอัจฉริยะทนภัยพิบัติเป็นตลาดโลกที่เติบโต ประสบการณ์จริงของพังงากับการตอบสนองสึนามิทำให้เป็นผู้ส่งออกเทคทนทานที่น่าเชื่อถือ", zh: "抗灾智慧城市技术是全球增长型市场。攀牙切身经历海啸应对，使其成为可信赖的韧性技术出口地。" },
    theCatch: { en: "Low GPP (฿158K). Small population (264K). Young people leave for Phuket or Bangkok. The smart city tech is genuine but the economic base to sustain it is thin.", th: "GPP ต่ำ (฿158K) ประชากรน้อย (264K) คนหนุ่มสาวออกไปภูเก็ตหรือกรุงเทพฯ เทคเมืองอัจฉริยะจริงแต่ฐานเศรษฐกิจที่จะรักษาไว้บาง", zh: "GPP偏低（15.8万泰铢）。人口少（26.4万）。年轻人离开前往普吉或曼谷。智慧城市技术货真价实，但维持它的经济基础薄弱。" },
  },
  satun: {
    livelihood: { en: "Fishing, rubber, UNESCO Global Geopark tourism. Thailand's quietest smart city — low population, low crime, high environmental quality.", th: "ประมง ยาง ท่องเที่ยว UNESCO Global Geopark เมืองอัจฉริยะที่เงียบที่สุดของไทย — ประชากรน้อย อาชญากรรมต่ำ คุณภาพสิ่งแวดล้อมสูง", zh: "渔业、橡胶、UNESCO世界地质公园旅游。泰国最安静的智慧城市——人口少、犯罪率低、环境质量高。" },
    famousFor: { en: "UNESCO Geopark monitoring technology. Tarutao marine conservation. Cleanest air in the index (PM2.5 11.5). The anti-Bangkok.", th: "เทคโนโลยีเฝ้าระวัง UNESCO Geopark อนุรักษ์ทะเลตะรุเตา อากาศสะอาดสุดในดัชนี (PM2.5 11.5) ตรงข้ามกรุงเทพฯ", zh: "UNESCO地质公园监测技术。达鲁陶海洋保护区。指数中最清洁的空气（PM2.5 11.5）。曼谷的对立面。" },
    opportunity: { en: "Geopark + marine conservation = a unique sustainable tourism brand that no other Thai city has. Low cost of operations means even small grants create big impact.", th: "Geopark + อนุรักษ์ทะเล = แบรนด์ท่องเที่ยวยั่งยืนที่ไม่มีเมืองไทยอื่น ต้นทุนดำเนินการต่ำหมายความว่าแม้เงินช่วยเหลือเล็กๆ ก็สร้างผลกระทบใหญ่", zh: "地质公园+海洋保护=其他泰国城市所没有的独特可持续旅游品牌。运营成本低，即便小额资助也能产生大影响。" },
    theCatch: { en: "Lowest GPP in the south (฿82K). Remote location. Digital infrastructure minimal. The smart city tech works but the economic model to sustain it long-term is uncertain.", th: "GPP ต่ำสุดในใต้ (฿82K) ทำเลห่างไกล โครงสร้างพื้นฐานดิจิทัลน้อย เทคเมืองอัจฉริยะใช้ได้แต่โมเดลเศรษฐกิจรักษาระยะยาวไม่แน่นอน", zh: "南部GPP最低（8.2万泰铢）。地处偏远。数字基础设施稀少。智慧城市技术能用，但长期维持的经济模式尚不确定。" },
  },
  "samut-prakan": {
    livelihood: { en: "Manufacturing (auto parts, electronics, packaging), industrial labor, warehouse logistics. Bangkok's overflow suburb — dense, industrial, and increasingly smart.", th: "การผลิต (ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์ บรรจุภัณฑ์) แรงงานอุตสาหกรรม โลจิสติกส์คลังสินค้า ชานเมืองล้นจากกรุงเทพฯ — หนาแน่น อุตสาหกรรม และอัจฉริยะมากขึ้น", zh: "制造业（汽车零部件、电子、包装）、工业劳工、仓储物流。曼谷外溢郊区——密集、工业化，且日趋智慧。" },
    famousFor: { en: "Industry 4.0 smart factory zones. Flood management IoT for low-lying areas. GPP ฿385K — high output but livability struggles.", th: "เขตโรงงานอัจฉริยะ Industry 4.0 IoT จัดการน้ำท่วมสำหรับพื้นที่ลุ่ม GPP ฿385K — ผลผลิตสูงแต่ความน่าอยู่ยังดิ้นรน", zh: "工业4.0智能工厂园区。低洼区域防洪IoT。GPP 38.5万泰铢——高产出但宜居性挣扎。" },
    opportunity: { en: "Largest manufacturing base near Bangkok. Industry 4.0 adoption is real and measurable. New airport connectivity (Suvarnabhumi) creates logistics advantage.", th: "ฐานการผลิตใหญ่สุดใกล้กรุงเทพฯ Industry 4.0 จริงและวัดได้ เชื่อมต่อสนามบินใหม่ (สุวรรณภูมิ) สร้างข้อได้เปรียบโลจิสติกส์", zh: "曼谷附近最大制造基地。工业4.0采用切实可量化。新机场连通性（素万那普）带来物流优势。" },
    theCatch: { en: "PM2.5 30.8. Crime 195/100K. Green coverage only 18% — the lowest in the index. Flooding is chronic in low-lying areas. Livability trails far behind economic output.", th: "PM2.5 30.8 อาชญากรรม 195/100K พื้นที่สีเขียวเพียง 18% — ต่ำสุดในดัชนี น้ำท่วมเรื้อรังในพื้นที่ลุ่ม ความน่าอยู่ตามหลังผลผลิตเศรษฐกิจมาก", zh: "PM2.5 30.8。犯罪率195/10万。绿化覆盖率仅18%——指数最低。低洼地区洪涝积年。宜居性远落后于经济产出。" },
  },
  "bang-saray": {
    livelihood: { en: "Fishing, seafood processing, coastal tourism. A working fishing village in Chon Buri's EEC shadow — locals still haul catch at dawn while smart sensors monitor water quality nearby.", th: "ประมง แปรรูปอาหารทะเล ท่องเที่ยวชายฝั่ง หมู่บ้านชาวประมงที่ยังทำงานอยู่ในเงา EEC ของชลบุรี — ชาวบ้านยังลากอวนตอนเช้าขณะเซ็นเซอร์อัจฉริยะตรวจคุณภาพน้ำใกล้ๆ", zh: "渔业、海产品加工、沿海旅游。春武里EEC阴影下一座仍在运作的渔村——当地人黎明出海捕捞，智慧传感器就在不远处监测水质。" },
    famousFor: { en: "Smart fishing fleet management. Coastal environmental monitoring. One of the few Thai smart cities where the tech serves fishermen, not tourists.", th: "จัดการกองเรือประมงอัจฉริยะ เฝ้าระวังสิ่งแวดล้อมชายฝั่ง เมืองอัจฉริยะไทยไม่กี่แห่งที่เทคโนโลยีรับใช้ชาวประมง ไม่ใช่นักท่องเที่ยว", zh: "智慧渔船队管理。沿海环境监测。泰国少有的技术服务渔民而非游客的智慧城市之一。" },
    opportunity: { en: "EEC-adjacent land values rising. Coastal smart monitoring could become a model for every Thai fishing community. Only 35K people — small enough for whole-community digital adoption.", th: "ที่ดินใกล้ EEC มูลค่าเพิ่ม การเฝ้าระวังชายฝั่งอัจฉริยะอาจเป็นโมเดลสำหรับชุมชนประมงไทยทุกแห่ง ประชากร 35K — เล็กพอสำหรับการใช้ดิจิทัลทั้งชุมชน", zh: "EEC临近地带地价攀升。沿海智慧监测有望成为泰国每个渔业社区的范本。人口仅3.5万——小到足以实现全社区数字化覆盖。" },
    theCatch: { en: "Digital gap: 38 (lowest in the index cluster). Aging fishermen population. Pattaya's overdevelopment creeping south. Risk of becoming another resort suburb rather than a smart fishing community.", th: "ช่องว่างดิจิทัล: 38 (ต่ำสุดในกลุ่ม) ชาวประมงสูงอายุ การพัฒนาเกินตัวของพัทยาคืบคลานลงมาใต้ เสี่ยงกลายเป็นชานเมืองรีสอร์ทอีกแห่งแทนที่จะเป็นชุมชนประมงอัจฉริยะ", zh: "数字差距：38（指数中最低）。渔民群体老龄化。芭提雅过度开发向南蔓延。有沦为另一个度假郊区而非智慧渔业社区的风险。" },
  },
  chanthaburi: {
    livelihood: { en: "Gem trading, tropical fruit farming (durian capital of Thailand), cross-border trade with Cambodia. The gem market on Si Chan Road has been a global trading floor for rubies and sapphires for centuries.", th: "ค้าอัญมณี ทำสวนผลไม้เขตร้อน (เมืองหลวงทุเรียนของไทย) ค้าขายข้ามพรมแดนกับกัมพูชา ตลาดพลอยบนถนนศรีจันทร์เป็นตลาดค้าทับทิมแซปไฟร์ระดับโลกมาหลายศตวรรษ", zh: "宝石贸易、热带水果种植（泰国榴莲之都）、与柬埔寨的跨境贸易。西占路宝石市场几个世纪来是全球红宝石和蓝宝石的交易场。" },
    famousFor: { en: "Smart agriculture for durian and mangosteen farmers. Precision irrigation. The agri-tech here is actually working — real yield improvements, not demo projects.", th: "เกษตรอัจฉริยะสำหรับเกษตรกรทุเรียนและมังคุด ระบบชลประทานแม่นยำ เทคโนโลยีเกษตรที่นี่ใช้งานได้จริง — ผลผลิตเพิ่มจริง ไม่ใช่โครงการสาธิต", zh: "面向榴莲和山竹农户的智慧农业。精准灌溉。这里的农业技术真正管用——产量实实在在提升，而非展示项目。" },
    opportunity: { en: "Durian exports to China are a ฿200B+ industry. Smart grading and traceability tech could lock in premium pricing. Green coverage 52% — one of the greenest cities in the index.", th: "ส่งออกทุเรียนจีนเป็นอุตสาหกรรม 200,000+ ล้านบาท เทคโนโลยีคัดแยกและตรวจสอบย้อนกลับอัจฉริยะอาจล็อคราคาพรีเมียม พื้นที่สีเขียว 52% — เมืองที่เขียวที่สุดแห่งหนึ่งในดัชนี", zh: "对华榴莲出口是超过2000亿泰铢的产业。智能分级和溯源技术有望锁定溢价。绿化覆盖率52%——指数中最绿的城市之一。" },
    theCatch: { en: "Digital score only 42. Gem traders are traditional and slow to digitize. GPP ฿178K — moderate. Seasonal fruit income creates boom-bust cycles.", th: "คะแนนดิจิทัลเพียง 42 พ่อค้าพลอยเป็นแบบดั้งเดิมและช้าในการเปลี่ยนเป็นดิจิทัล GPP ฿178K — ปานกลาง รายได้ผลไม้ตามฤดูกาลสร้างวงจรเฟื่องฟู-ตกต่ำ", zh: "数字分数仅42。宝石商人传统守旧，数字化进程缓慢。GPP 17.8万泰铢——中等。水果收入季节性强，造成繁荣—萧条周期。" },
  },
  "khao-khun-song": {
    livelihood: { en: "Precision agriculture, rubber, and fruit farming in Rayong's EEC hinterland. Small community using IoT soil sensors and drone mapping for yield optimization.", th: "เกษตรแม่นยำ ยาง และทำสวนผลไม้ในพื้นที่ EEC ของระยอง ชุมชนเล็กใช้เซ็นเซอร์ดินและโดรนแมพเพิ่มผลผลิต", zh: "罗勇EEC腹地的精准农业、橡胶和果树种植。小型社区利用物联网土壤传感器和无人机测绘优化产量。" },
    famousFor: { en: "Pioneering smart agriculture at sub-district scale. IoT-based soil monitoring and water management in real field conditions, not laboratory demos.", th: "บุกเบิกเกษตรอัจฉริยะระดับตำบล IoT เฝ้าระวังดินและจัดการน้ำในสภาพจริง ไม่ใช่สาธิตในห้องทดลอง", zh: "县级精准农业先驱。物联网土壤监测和水管理在真实田间条件下运行，而非实验室演示。" },
    opportunity: { en: "EEC proximity means access to industrial R&D resources. At only 25K people, digital adoption can reach every household. Could become Thailand's precision farming reference site.", th: "ใกล้ EEC หมายถึงเข้าถึงทรัพยากร R&D อุตสาหกรรม ประชากรเพียง 25K การใช้ดิจิทัลเข้าถึงทุกครัวเรือน อาจเป็นแหล่งอ้างอิงเกษตรแม่นยำของไทย", zh: "毗邻EEC可获取工业研发资源。仅2.5万人口，数字化可覆盖每户家庭。有望成为泰国精准农业示范基地。" },
    theCatch: { en: "Very early stage. Population only 25K — limited tax base. Metrics are sparse (data confidence low). Needs external funding to sustain beyond the pilot phase.", th: "ระยะเริ่มต้นมาก ประชากรเพียง 25K — ฐานภาษีจำกัด ตัวชี้วัดมีน้อย (ความเชื่อมั่นข้อมูลต่ำ) ต้องการทุนภายนอกเพื่อดำเนินต่อหลังนำร่อง", zh: "仍处起步阶段。人口仅2.5万——税基有限。指标稀少（数据置信度低）。需要外部资金维持超出试点阶段的运营。" },
  },
  maesai: {
    livelihood: { en: "Border trade with Myanmar (Tachileik), tourism, gem trading. Thailand's northernmost town — the Sai River crossing handles billions in cross-border commerce annually.", th: "ค้าชายแดนกับเมียนมา (ท่าขี้เหล็ก) ท่องเที่ยว ค้าอัญมณี เมืองเหนือสุดของไทย — ด่านแม่น้ำสายรองรับการค้าข้ามพรมแดนหลายพันล้านต่อปี", zh: "与缅甸（大其力）跨境贸易、旅游、宝石交易。泰国最北端城镇——赛河口岸每年处理数十亿跨境商贸。" },
    famousFor: { en: "Rebuilding after devastating 2024 floods. Smart disaster management is now a real priority. Border trade digitization pilot connecting Thai-Myanmar customs.", th: "ฟื้นฟูหลังน้ำท่วมใหญ่ 2567 การจัดการภัยพิบัติอัจฉริยะเป็นวาระจริงแล้ว นำร่องดิจิทัลค้าชายแดนเชื่อมศุลกากรไทย-เมียนมา", zh: "2024年洪灾后重建中。智慧防灾已成真实优先课题。泰缅海关数字化互联跨境贸易试点。" },
    opportunity: { en: "Post-flood reconstruction is a chance to build back smarter. Cross-border digital trade could streamline what is currently a chaotic paper-based system.", th: "การฟื้นฟูหลังน้ำท่วมเป็นโอกาสสร้างใหม่อัจฉริยะกว่า การค้าดิจิทัลข้ามพรมแดนอาจปรับปรุงระบบกระดาษที่วุ่นวายในปัจจุบัน", zh: "洪灾后重建是打造更智慧城市的机遇。跨境数字贸易有望改善目前混乱的纸质作业流程。" },
    theCatch: { en: "PM2.5 44.2 — among the worst in the north from cross-border burning. Crime 165/100K. Myanmar political instability disrupts border trade unpredictably. GPP only ฿108K.", th: "PM2.5 44.2 — เลวร้ายที่สุดในภาคเหนือจากการเผาข้ามพรมแดน อาชญากรรม 165/100K ความไม่มั่นคงการเมืองเมียนมาชะงักการค้าชายแดน GPP เพียง ฿108K", zh: "PM2.5达44.2——跨境焚烧导致北方最差空气质量之列。犯罪率165/10万。缅甸政治动荡使跨境贸易难以预测。GPP仅10.8万铢。" },
  },
  narathiwat: {
    livelihood: { en: "Fisheries, rubber, rice, cross-border trade with Malaysia (Sungai Kolok crossing). Government employment is a major employer in the deep south security context.", th: "ประมง ยาง ข้าว ค้าขายข้ามพรมแดนกับมาเลเซีย (ด่านสุไหงโก-ลก) ราชการเป็นนายจ้างหลักในบริบทความมั่นคงชายแดนใต้", zh: "渔业、橡胶、水稻、与马来西亚跨境贸易（苏纪哥洛口岸）。南部安全态势下，政府就业是主要雇主。" },
    famousFor: { en: "Southernmost smart city. Genuine cross-border digital trade pilot with Malaysia. Smart safety systems in conflict zone — rare real-world test of smart city under security pressure.", th: "เมืองอัจฉริยะใต้สุด นำร่องการค้าดิจิทัลข้ามพรมแดนกับมาเลเซียจริง ระบบความปลอดภัยอัจฉริยะในเขตขัดแย้ง — ทดสอบจริงหายากของเมืองอัจฉริยะภายใต้แรงกดดันความมั่นคง", zh: "最南端智慧城市。与马来西亚真实跨境数字贸易试点。冲突地区智慧安全系统——安全压力下智慧城市真实测试之罕见案例。" },
    opportunity: { en: "Cross-border digital trade with Malaysia could transform Sungai Kolok into a legitimate economic corridor. Clean air (PM2.5 12.5) is an underappreciated asset.", th: "การค้าดิจิทัลข้ามพรมแดนกับมาเลเซียอาจเปลี่ยนสุไหงโก-ลกเป็นระเบียงเศรษฐกิจที่ถูกกฎหมาย อากาศสะอาด (PM2.5 12.5) เป็นสินทรัพย์ที่ถูกประเมินค่าต่ำ", zh: "跨境数字贸易可将苏纪哥洛打造为合法经济走廊。清洁空气（PM2.5仅12.5）是被低估的资产。" },
    theCatch: { en: "Safety score 35 — lowest in the index. Crime 262/100K. GPP only ฿68K — lowest in the south. Security situation severely constrains all development. Investment is reluctant.", th: "คะแนนความปลอดภัย 35 — ต่ำสุดในดัชนี อาชญากรรม 262/100K GPP เพียง ฿68K — ต่ำสุดในใต้ สถานการณ์ความมั่นคงจำกัดการพัฒนาทั้งหมด การลงทุนลังเล", zh: "安全评分35——指数中最低。犯罪率262/10万。GPP仅6.8万铢——南部最低。安全局势严重制约一切发展。投资者持观望态度。" },
  },
  "nikhom-phatthana": {
    livelihood: { en: "Industrial estate workers (petrochemical, auto parts, electronics), logistics operators, environmental monitoring specialists. This is Map Ta Phut's backyard.", th: "คนงานนิคมอุตสาหกรรม (ปิโตรเคมี ชิ้นส่วนรถยนต์ อิเล็กทรอนิกส์) ผู้ดำเนินการโลจิสติกส์ ผู้เชี่ยวชาญเฝ้าระวังสิ่งแวดล้อม นี่คือสนามหลังบ้านของมาบตาพุด", zh: "工业园区工人（石化、汽车零部件、电子）、物流运营商、环境监测专业人员。这里是马塔普特的后院。" },
    famousFor: { en: "Environmental monitoring is the key smart tech — necessary given chemical industry density. GPP ฿1.02M — highest per-capita output in the entire index.", th: "การเฝ้าระวังสิ่งแวดล้อมเป็นเทคโนโลยีอัจฉริยะหลัก — จำเป็นเนื่องจากความหนาแน่นอุตสาหกรรมเคมี GPP ฿1.02M — ผลผลิตต่อหัวสูงสุดในดัชนีทั้งหมด", zh: "环境监测是核心智慧技术——鉴于化学工业密度有其必要性。GPP达102万铢——整个指数中人均产出最高。" },
    opportunity: { en: "Highest GPP in the index (฿1.02M/capita). Industrial IoT and environmental monitoring tech here can be exported to every industrial estate in ASEAN.", th: "GPP สูงสุดในดัชนี (฿1.02M/หัว) IoT อุตสาหกรรมและเทคเฝ้าระวังสิ่งแวดล้อมส่งออกไปนิคมอุตสาหกรรมทุกแห่งในอาเซียนได้", zh: "指数中GPP最高（102万铢/人）。工业物联网和环境监测技术可向东盟所有工业园区出口。" },
    theCatch: { en: "Environment score only 52 despite monitoring — the pollution is real. Wellbeing 48 — workers live here but don't thrive here. Population only 45K — a company town, not a community.", th: "คะแนนสิ่งแวดล้อมเพียง 52 แม้มีการเฝ้าระวัง — มลพิษเป็นเรื่องจริง ความเป็นอยู่ 48 — คนงานอยู่ที่นี่แต่ไม่เจริญเติบโต ประชากรเพียง 45K — เมืองบริษัท ไม่ใช่ชุมชน", zh: "尽管有监测，环境评分仅52——污染问题真实存在。幸福感评分48——工人生活于此却难以繁荣。人口仅4.5万——企业城，不是社区。" },
  },
  nonthaburi: {
    livelihood: { en: "Government services, retail, commuter workforce to Bangkok. Thailand's most populous suburb — 1.28M people who mostly work in Bangkok but live here for affordable housing.", th: "บริการราชการ ค้าปลีก กำลังแรงงานเดินทางเข้ากรุงเทพฯ ชานเมืองที่มีประชากรมากที่สุด — 1.28 ล้านคนส่วนใหญ่ทำงานในกรุงเทพฯ แต่อยู่ที่นี่เพราะที่อยู่อาศัยจับต้องได้", zh: "政府服务、零售业、赴曼谷通勤劳动力。泰国人口最多的郊区——128万人大多在曼谷工作，因住房价格合理居住于此。" },
    famousFor: { en: "MRT-connected digital governance that actually works. GPP ฿285K with income ฿32.8K/month — genuine middle-class suburb with digital services reaching residents.", th: "ธรรมาภิบาลดิจิทัลเชื่อม MRT ที่ใช้งานได้จริง GPP ฿285K รายได้ ฿32.8K/เดือน — ชานเมืองชนชั้นกลางจริงที่บริการดิจิทัลเข้าถึงผู้อยู่อาศัย", zh: "地铁直达、真正运作的数字治理。GPP达28.5万铢，月收入3.28万铢——数字服务覆盖居民的真实中产郊区。" },
    opportunity: { en: "MRT Purple Line connectivity transforms commuter patterns. 1.28M residents = massive digital services market. Can become Bangkok's smart suburb showcase.", th: "MRT สายสีม่วงเปลี่ยนรูปแบบการเดินทาง ผู้อยู่อาศัย 1.28M = ตลาดบริการดิจิทัลมหาศาล เป็นโชว์เคสชานเมืองอัจฉริยะของกรุงเทพฯ ได้", zh: "地铁紫线改变通勤格局。128万居民=庞大数字服务市场。可成为曼谷智慧郊区示范。" },
    theCatch: { en: "PM2.5 31.2. Green coverage only 22%. Crime 175/100K. Essentially Bangkok's problems overflow here — congestion, pollution, flooding — without Bangkok's budget.", th: "PM2.5 31.2 พื้นที่สีเขียวเพียง 22% อาชญากรรม 175/100K ปัญหากรุงเทพฯ ล้นมาที่นี่ — รถติด มลพิษ น้ำท่วม — โดยไม่มีงบกรุงเทพฯ", zh: "PM2.5达31.2。绿化覆盖率仅22%。犯罪率175/10万。曼谷的问题在此蔓延——拥堵、污染、洪涝——却没有曼谷的预算。" },
  },
  pattani: {
    livelihood: { en: "Fisheries, rice farming, halal food processing, education (PSU Pattani campus). Historic Malay trading port now defined more by security checkpoints than commerce.", th: "ประมง ทำนา แปรรูปอาหารฮาลาล การศึกษา (มอ.ปัตตานี) ท่าเรือค้าขายมลายูประวัติศาสตร์ที่ตอนนี้ถูกนิยามด้วยด่านตรวจมากกว่าการค้า", zh: "渔业、水稻种植、清真食品加工、教育（宋卡王子大学北大年校区）。历史上的马来贸易港，如今更多以安检站而非商贸定义。" },
    famousFor: { en: "Digital governance and safety systems as genuine attempts to improve a difficult situation. Halal food traceability pilot. PSU Pattani's academic contribution to deep south development.", th: "ธรรมาภิบาลดิจิทัลและระบบความปลอดภัยเป็นความพยายามจริงในการปรับปรุงสถานการณ์ยากลำบาก นำร่องตรวจสอบย้อนกลับอาหารฮาลาล ผลงานวิชาการ มอ.ปัตตานีต่อการพัฒนาชายแดนใต้", zh: "数字治理和安全系统是改善困难局势的真实努力。清真食品溯源试点。宋王大北大年校区对深南发展的学术贡献。" },
    opportunity: { en: "Halal food industry could be massive — Thailand's halal hub positioning. Clean air (PM2.5 13.8). University presence provides human capital that most conflict zones lack.", th: "อุตสาหกรรมอาหารฮาลาลอาจมหาศาล — วางตำแหน่งศูนย์กลางฮาลาลของไทย อากาศสะอาด (PM2.5 13.8) มหาวิทยาลัยให้ทุนมนุษย์ที่เขตขัดแย้งส่วนใหญ่ไม่มี", zh: "清真食品产业潜力巨大——泰国清真枢纽定位。清洁空气（PM2.5仅13.8）。大学提供了大多数冲突地区所缺乏的人才资本。" },
    theCatch: { en: "Safety 38. Crime 245/100K. GPP ฿72K. The security situation makes every smart city investment harder, slower, and riskier. Investment capital avoids the deep south.", th: "ความปลอดภัย 38 อาชญากรรม 245/100K GPP ฿72K สถานการณ์ความมั่นคงทำให้การลงทุนเมืองอัจฉริยะทุกอย่างยากกว่า ช้ากว่า และเสี่ยงกว่า เงินลงทุนหลีกเลี่ยงชายแดนใต้", zh: "安全评分38。犯罪率245/10万。GPP仅7.2万铢。安全局势使每项智慧城市投资更难、更慢、风险更高。投资资本回避深南地区。" },
  },
  phichit: {
    livelihood: { en: "Rice farming, freshwater fishing, small-scale agriculture. A quiet central plains province where the biggest employer is still the land itself.", th: "ทำนา ประมงน้ำจืด เกษตรขนาดเล็ก จังหวัดที่ราบภาคกลางเงียบๆ ที่นายจ้างรายใหญ่สุดยังเป็นผืนดิน", zh: "水稻种植、淡水捕鱼、小规模农业。泰国中部平原宁静省份，最大雇主仍是土地本身。" },
    famousFor: { en: "Digital literacy focus — choosing to build human capacity before hardware. Safe (72) but economically limited. Bueng Si Fai lake as natural asset.", th: "เน้นรู้เท่าทันดิจิทัล — เลือกสร้างศักยภาพคนก่อนฮาร์ดแวร์ ปลอดภัย (72) แต่เศรษฐกิจจำกัด บึงสีไฟเป็นสินทรัพย์ธรรมชาติ", zh: "以数字素养为重点——先建设人才能力再上硬件。安全（72）但经济有限。碧猜湖作为自然资产。" },
    opportunity: { en: "Green coverage 42% with low pollution. Safe community (72). If digital literacy translates to e-commerce adoption, farmers could access premium markets directly.", th: "พื้นที่สีเขียว 42% มลพิษต่ำ ชุมชนปลอดภัย (72) หากรู้เท่าทันดิจิทัลแปลงเป็นการใช้อีคอมเมิร์ซ เกษตรกรอาจเข้าถึงตลาดพรีเมียมโดยตรง", zh: "绿化覆盖率42%，污染低。安全社区（72）。若数字素养转化为电商应用，农民可直接进入优质市场。" },
    theCatch: { en: "Economy 42 — second-lowest pillar. Digital 30 — lowest in the entire index. GPP ฿78K. Only one smart dimension so far. Very early stage with limited institutional capacity.", th: "เศรษฐกิจ 42 — เสาต่ำรองสุดท้าย ดิจิทัล 30 — ต่ำสุดในดัชนีทั้งหมด GPP ฿78K มีเพียงมิติอัจฉริยะเดียว ระยะเริ่มต้นมากศักยภาพสถาบันจำกัด", zh: "经济评分42——第二低支柱。数字评分30——整个指数中最低。GPP仅7.8万铢。目前仅有一个智慧维度。阶段极早，机构能力有限。" },
  },
  "phitsanulok-nu": {
    livelihood: { en: "University research, energy R&D, smart mobility testing. A campus smart city where students and faculty are both the innovators and the test subjects.", th: "วิจัยมหาวิทยาลัย R&D พลังงาน ทดสอบการเดินทางอัจฉริยะ เมืองอัจฉริยะในแคมปัสที่นักศึกษาและคณาจารย์เป็นทั้งนวัตกรและผู้ทดสอบ", zh: "大学科研、能源研发、智慧出行测试。校园智慧城市，学生和教职人员既是创新者也是测试对象。" },
    famousFor: { en: "Genuine R&D output in smart energy and mobility. Digital score 65 — among the highest outside Bangkok. Hospital beds 26/10K — strong healthcare infrastructure.", th: "ผลงาน R&D จริงด้านพลังงานและการเดินทางอัจฉริยะ คะแนนดิจิทัล 65 — สูงสุดนอกกรุงเทพฯ เตียงโรงพยาบาล 26/10K — โครงสร้างพื้นฐานสาธารณสุขแข็งแกร่ง", zh: "智慧能源和出行领域真实研发成果。数字评分65——曼谷以外最高之列。医院床位26/万人——医疗基础设施扎实。" },
    opportunity: { en: "University-industry bridge: Naresuan research can spin off into real products for the Lower North region. Green coverage 60% makes it genuinely livable.", th: "สะพานมหาวิทยาลัย-อุตสาหกรรม: งานวิจัยนเรศวรแปลงเป็นผลิตภัณฑ์จริงสำหรับภาคเหนือตอนล่าง พื้นที่สีเขียว 60% ทำให้น่าอยู่จริง", zh: "产学研桥梁：那黎萱大学研究成果可孵化为北部下游地区实际产品。绿化覆盖率60%，真正宜居。" },
    theCatch: { en: "PM2.5 30.2 — burning season hits hard. Population only 35K (campus). Economy 52 — research doesn't yet translate to commercial output. Campus innovation doesn't always spill over.", th: "PM2.5 30.2 — ฤดูเผาหนัก ประชากรเพียง 35K (แคมปัส) เศรษฐกิจ 52 — งานวิจัยยังไม่แปลงเป็นผลผลิตเชิงพาณิชย์ นวัตกรรมในแคมปัสไม่เสมอไปที่จะล้นออกไป", zh: "PM2.5达30.2——焚烧季影响严重。人口仅3.5万（校园）。经济评分52——研究尚未转化为商业产出。校园创新不总能溢出。" },
  },
  "phitsanulok-ppao": {
    livelihood: { en: "Provincial administration, agriculture, small manufacturing. The PAO coordinates digital services across Phitsanulok's scattered rural districts.", th: "บริหารจังหวัด เกษตร การผลิตขนาดเล็ก อบจ.ประสานบริการดิจิทัลข้ามอำเภอชนบทกระจัดกระจายของพิษณุโลก", zh: "省级行政管理、农业、小型制造业。省级行政组织统筹协调彼此分散的披集洛农村地区数字服务。" },
    famousFor: { en: "Provincial-level smart governance reaching rural areas. Digital services extending beyond city center to 340K residents across the province.", th: "ปกครองอัจฉริยะระดับจังหวัดเข้าถึงชนบท บริการดิจิทัลขยายเกินศูนย์กลางเมืองสู่ผู้อยู่อาศัย 340K ทั่วจังหวัด", zh: "省级智慧治理覆盖农村地区。数字服务延伸至34万省内居民，不限于城市中心。" },
    opportunity: { en: "Province-wide digital governance model could replicate to other PAOs. Rural-urban digital bridge is exactly what most Thai provinces need.", th: "โมเดลปกครองดิจิทัลทั้งจังหวัดอาจทำซ้ำกับ อบจ.อื่น สะพานดิจิทัลชนบท-เมืองคือสิ่งที่จังหวัดไทยส่วนใหญ่ต้องการ", zh: "全省数字治理模式可向其他省级行政组织复制。城乡数字桥梁正是泰国大多数省份所需要的。" },
    theCatch: { en: "Coordinating across rural districts is inherently slow. GPP ฿132K — moderate. Digital 48 — improving but not yet sufficient for the ambition.", th: "ประสานงานข้ามอำเภอชนบทช้าโดยธรรมชาติ GPP ฿132K — ปานกลาง ดิจิทัล 48 — ดีขึ้นแต่ยังไม่พอสำหรับความทะเยอทะยาน", zh: "跨农村地区协调本质上缓慢。GPP达13.2万铢——中等。数字评分48——有改善但与雄心相比尚不足够。" },
  },
  phlapphla: {
    livelihood: { en: "Fruit farming, rubber, community energy cooperatives. A tiny sub-district in Chanthaburi experimenting with community-owned smart energy.", th: "ทำสวนผลไม้ ยาง สหกรณ์พลังงานชุมชน ตำบลเล็กๆ ในจันทบุรีทดลองพลังงานอัจฉริยะชุมชนเป็นเจ้าของ", zh: "果树种植、橡胶、社区能源合作社。尖竹汶府一个小型分区，试验社区所有的智慧能源。" },
    famousFor: { en: "Community energy and environmental monitoring at sub-district scale. Only 15K people — proving smart city concepts work even at village level.", th: "พลังงานชุมชนและเฝ้าระวังสิ่งแวดล้อมระดับตำบล ประชากรเพียง 15K — พิสูจน์แนวคิดเมืองอัจฉริยะทำงานได้แม้ระดับหมู่บ้าน", zh: "县级社区能源和环境监测。仅1.5万人——证明智慧城市理念在村级同样可行。" },
    opportunity: { en: "Community energy model is replicable to thousands of Thai sub-districts. High safety (74) and environment (62) scores show a livable base to build on.", th: "โมเดลพลังงานชุมชนทำซ้ำได้กับตำบลไทยหลายพัน ความปลอดภัยสูง (74) และสิ่งแวดล้อม (62) แสดงฐานความน่าอยู่ที่สร้างต่อได้", zh: "社区能源模式可向泰国数千个分区复制。安全评分高（74）和环境评分高（62）显示可供建设的宜居基础。" },
    theCatch: { en: "Population only 15K — smallest in the index. Sparse data (low confidence). Economy 48 and digital 35 — very limited resources. Needs external support to sustain.", th: "ประชากรเพียง 15K — เล็กสุดในดัชนี ข้อมูลเบาบาง (ความเชื่อมั่นต่ำ) เศรษฐกิจ 48 และดิจิทัล 35 — ทรัพยากรจำกัดมาก ต้องการสนับสนุนจากภายนอก", zh: "人口仅1.5万——指数中最小。数据稀少（置信度低）。经济48，数字35——资源极其有限。需要外部支持才能持续运营。" },
  },
  "phuket-tinicon": {
    livelihood: { en: "This is a development plan, not a functioning city. Population: zero. Tinicon Valley is Phuket's ambition to create a tech innovation district on the island.", th: "นี่คือแผนพัฒนา ไม่ใช่เมืองที่ทำงาน ประชากร: ศูนย์ Tinicon Valley คือความทะเยอทะยานของภูเก็ตในการสร้างย่านนวัตกรรมเทคบนเกาะ", zh: "这是一份发展规划，不是一座运作中的城市。人口：零。锡谷（Tinicon Valley）是普吉岛在岛上打造科技创新区的雄心。" },
    famousFor: { en: "The logo was awarded to a concept. Lowest scores in the index across nearly every dimension (livability 25, economy 30, wellbeing 20, hospitality 20).", th: "โลโก้มอบให้กับแนวคิด คะแนนต่ำสุดในดัชนีเกือบทุกมิติ (ความน่าอยู่ 25 เศรษฐกิจ 30 ความเป็นอยู่ 20 การท่องเที่ยว 20)", zh: "徽标颁给了一个概念。几乎每个维度都是指数中最低分（宜居25、经济30、幸福感20、旅游20）。" },
    opportunity: { en: "If Phuket can attract tech talent to complement its tourism base, the island could diversify beyond seasonal beach tourism. The concept is sound; execution is zero.", th: "หากภูเก็ตดึงดูดคนเก่งเทคมาเสริมฐานท่องเที่ยว เกาะอาจหลากหลายเกินท่องเที่ยวหาดตามฤดูกาล แนวคิดดี การปฏิบัติเป็นศูนย์", zh: "若普吉岛能吸引科技人才补充旅游基础，该岛可在季节性沙滩旅游之外实现多元化。理念合理；落实为零。" },
    theCatch: { en: "Nothing exists yet. Zero population, zero infrastructure, zero services. This is a branding exercise masquerading as a smart city. Prove it or lose it.", th: "ยังไม่มีอะไร ประชากรศูนย์ โครงสร้างพื้นฐานศูนย์ บริการศูนย์ นี่คือการสร้างแบรนด์แฝงเป็นเมืองอัจฉริยะ พิสูจน์ตัวเองหรือสูญเสียมัน", zh: "目前什么都不存在。零人口，零基础设施，零服务。这是以智慧城市为幌子的品牌运营。请拿出成果，否则弃权。" },
  },
  rattanakosin: {
    livelihood: { en: "Tourism, government administration, temple economy, heritage conservation. Bangkok's sacred island — Grand Palace, Wat Pho, Wat Arun — where 30M+ tourists walk annually.", th: "ท่องเที่ยว ราชการ เศรษฐกิจวัด อนุรักษ์มรดก เกาะศักดิ์สิทธิ์ของกรุงเทพฯ — พระบรมมหาราชวัง วัดโพธิ์ วัดอรุณ — ที่นักท่องเที่ยว 30 ล้าน+ เดินต่อปี", zh: "旅游业、政府行政、寺庙经济、遗产保护。曼谷的神圣岛屿——大皇宫、卧佛寺、黎明寺——每年迎接超过3000万游客到访。" },
    famousFor: { en: "Heritage-tech fusion: smart canal management, cultural asset digitization. Hospitality score 82 — highest in the entire index. The gold standard for heritage smart city.", th: "ผสมผสานมรดก-เทค: จัดการคลองอัจฉริยะ แปลงสินทรัพย์วัฒนธรรมเป็นดิจิทัล คะแนนการท่องเที่ยว 82 — สูงสุดในดัชนีทั้งหมด มาตรฐานทองสำหรับเมืองอัจฉริยะมรดก", zh: "遗产与科技融合：智慧运河管理、文化资产数字化。旅游评分82——整个指数中最高。遗产型智慧城市的黄金标准。" },
    opportunity: { en: "Heritage smart city model is globally exportable — every ASEAN country has a historic district that needs this approach. Cultural data platform could be an ASEAN reference.", th: "โมเดลเมืองอัจฉริยะมรดกส่งออกได้ทั่วโลก — ทุกประเทศอาเซียนมีย่านประวัติศาสตร์ที่ต้องการแนวทางนี้ แพลตฟอร์มข้อมูลวัฒนธรรมอาจเป็นมาตรฐานอาเซียน", zh: "遗产型智慧城市模式可向全球出口——每个东盟国家都有需要这种方法的历史街区。文化数据平台可成为东盟参考标准。" },
    theCatch: { en: "PM2.5 32.4. Safety 58 — pickpocketing and tourist scams. Environment 46 — heritage buildings can't easily accommodate green infrastructure. Overtourism is the constant threat.", th: "PM2.5 32.4 ความปลอดภัย 58 — ล้วงกระเป๋าและหลอกนักท่องเที่ยว สิ่งแวดล้อม 46 — อาคารมรดกรองรับโครงสร้างพื้นฐานสีเขียวยาก นักท่องเที่ยวล้นเป็นภัยคุกคามตลอด", zh: "PM2.5达32.4。安全评分58——扒窃和旅游欺诈问题。环境评分46——历史建筑难以接纳绿色基础设施。过度旅游是持续性威胁。" },
  },
  "songkhla-city": {
    livelihood: { en: "Fisheries, rubber processing, PSU (main campus), tourism around Songkhla Lake. Southern cultural capital with Thai-Chinese-Malay heritage blend.", th: "ประมง แปรรูปยาง มอ.(แคมปัสหลัก) ท่องเที่ยวรอบทะเลสาบสงขลา เมืองหลวงวัฒนธรรมภาคใต้ผสมผสานมรดกไทย-จีน-มลายู", zh: "渔业、橡胶加工、宋卡王子大学（主校区）、宋卡湖周边旅游。南部文化首府，融合泰华马文化遗产。" },
    famousFor: { en: "Smart governance and tourism tech with strong cultural identity. Hospitality 76. Lake ecosystem monitoring. PSU research capacity supports genuine innovation. Home to the CEA Southern Regional Office — the creative economy anchor for the entire south — and Pakk Taii Design Week, the only international design festival in the region.", th: "ปกครองอัจฉริยะและเทคท่องเที่ยวด้วยอัตลักษณ์วัฒนธรรมเข้มแข็ง การท่องเที่ยว 76 เฝ้าระวังระบบนิเวศทะเลสาบ ศักยภาพวิจัย มอ.สนับสนุนนวัตกรรมจริง เป็นที่ตั้งของสำนักงานภาคใต้ CEA — ฐานเศรษฐกิจสร้างสรรค์ของทั้งภาค — และงานออกแบบปักษ์ใต้ เทศกาลออกแบบนานาชาติเดียวในภูมิภาค", zh: "强烈文化认同下的智慧治理和旅游科技。旅游评分76。湖泊生态系统监测。宋王大研究能力支撑真实创新。南部区域CEA创意经济局所在地——整个南部的创意经济锚点——以及帕泰设计周，该地区唯一的国际设计节。" },
    opportunity: { en: "Songkhla is the creative economy capital of southern Thailand: CEA's southern hub hosts TCDC Songkhla and Pakk Taii Design Week, anchoring a 220 billion baht creative economy with 9,610 businesses — over 80% connected to tourism. The city's pitch is a 'de-stress economy' and Creative Wellness & Tourism Hub, repositioning around design, craft, and slow travel. Add Songkhla Lake ASEAN water body monitoring and the equation is city-as-model, not just city-as-destination.", th: "สงขลาคือเมืองหลวงเศรษฐกิจสร้างสรรค์ภาคใต้: ฮับ CEA ภาคใต้เป็นที่ตั้ง TCDC สงขลา และงานออกแบบปักษ์ใต้ เป็นฐานเศรษฐกิจสร้างสรรค์มูลค่า 220,000 ล้านบาท กับธุรกิจ 9,610 ราย — กว่า 80% เชื่อมกับการท่องเที่ยว วิสัยทัศน์เมืองคือ 'de-stress economy' และ Creative Wellness & Tourism Hub วางตำแหน่งใหม่รอบดีไซน์ หัตถกรรม และการท่องเที่ยวช้า บวกกับการเฝ้าระวังทะเลสาบสงขลาเพื่อจัดการแหล่งน้ำอาเซียน สมการคือเมืองต้นแบบ ไม่ใช่แค่จุดหมายปลายทาง", zh: "宋卡是泰国南部创意经济首府：CEA南部中心设有TCDC宋卡和帕泰设计周，支撑着价值2200亿泰铢的创意经济，9610家企业中逾80%与旅游业相连。城市定位为'减压经济'和创意健康旅游目的地，围绕设计、手工艺和慢旅行重新定位。加上宋卡湖东盟水体管理监测，这座城市是示范，不只是目的地。" },
    theCatch: { en: "Crime 158/100K — proximity to deep south. GPP ฿155K — moderate. Lake pollution is a growing concern. Hat Yai's commercial gravity pulls investment away from Songkhla city.", th: "อาชญากรรม 158/100K — ใกล้ชายแดนใต้ GPP ฿155K — ปานกลาง มลพิษทะเลสาบเป็นปัญหาที่เพิ่มขึ้น แรงดึงดูดเชิงพาณิชย์ของหาดใหญ่ดึงการลงทุนออกจากเมืองสงขลา", zh: "犯罪率158/10万——毗邻深南地区。GPP仅15.5万铢——中等。湖泊污染问题日益突出。合艾的商业引力将投资从宋卡市区拉走。" },
  },
  sritrang: {
    livelihood: { en: "Rubber, palm oil, coastal fishing, small-scale eco-tourism. Trang's quiet Andaman coast community where green initiatives grow from genuine local concern.", th: "ยาง ปาล์ม ประมงชายฝั่ง ท่องเที่ยวเชิงนิเวศขนาดเล็ก ชุมชนอันดามันเงียบๆ ของตรังที่โครงการสีเขียวเติบโตจากความห่วงใยท้องถิ่นจริง", zh: "橡胶、棕榈油、沿海捕鱼、小规模生态旅游。泰国北碧府宁静的安达曼海岸社区，绿色举措源于真实的地方关切。" },
    famousFor: { en: "Honest small-scale smart city. Green initiatives and environmental monitoring that work. Safety 74, environment 68 — genuinely livable. PM2.5 16.8 — clean air.", th: "เมืองอัจฉริยะขนาดเล็กที่ซื่อสัตย์ โครงการสีเขียวและเฝ้าระวังสิ่งแวดล้อมที่ใช้ได้ ความปลอดภัย 74 สิ่งแวดล้อม 68 — น่าอยู่จริง PM2.5 16.8 — อากาศสะอาด", zh: "诚实的小规模智慧城市。绿色举措和环境监测真正有效。安全评分74，环境评分68——真正宜居。PM2.5仅16.8——空气清洁。" },
    opportunity: { en: "Green coverage 62% — among the highest in the index. Low crime (110/100K). Andaman eco-tourism brand + clean air + community governance = unique livability story.", th: "พื้นที่สีเขียว 62% — สูงสุดแห่งหนึ่งในดัชนี อาชญากรรมต่ำ (110/100K) แบรนด์ท่องเที่ยวเชิงนิเวศอันดามัน + อากาศสะอาด + ปกครองชุมชน = เรื่องราวความน่าอยู่เฉพาะ", zh: "绿化覆盖率62%——指数中最高之列。低犯罪率（110/10万）。安达曼生态旅游品牌+清洁空气+社区治理=独特宜居故事。" },
    theCatch: { en: "Economy 55 — limited commercial activity. Population only 78K. Digital 45 — needs connectivity improvement. Hospital beds only 16/10K — healthcare access is thin.", th: "เศรษฐกิจ 55 — กิจกรรมเชิงพาณิชย์จำกัด ประชากรเพียง 78K ดิจิทัล 45 — ต้องปรับปรุงการเชื่อมต่อ เตียงโรงพยาบาลเพียง 16/10K — เข้าถึงสาธารณสุขบาง", zh: "经济评分55——商业活动有限。人口仅7.8万。数字评分45——需改善连通性。医院床位仅16/万人——医疗可及性偏弱。" },
  },
  "tai-yong": {
    livelihood: { en: "Rice farming, fruit orchards, small-scale community agriculture. A tiny sub-district in Nakhon Si Thammarat proving digital governance works at village scale.", th: "ทำนา สวนผลไม้ เกษตรชุมชนขนาดเล็ก ตำบลเล็กๆ ในนครศรีธรรมราชพิสูจน์ว่าปกครองดิจิทัลทำงานได้ระดับหมู่บ้าน", zh: "水稻种植、果树农业、小规模社区农业。那空是贪玛叻府的小型分区，证明数字治理在村级同样可行。" },
    famousFor: { en: "Community-scale digital governance and agriculture tech. Only 18K people but genuine smart services. Proof that smart city isn't just for big cities.", th: "ปกครองดิจิทัลและเทคเกษตรระดับชุมชน ประชากรเพียง 18K แต่บริการอัจฉริยะจริง พิสูจน์ว่าเมืองอัจฉริยะไม่ใช่แค่เมืองใหญ่", zh: "社区规模的数字治理和农业科技。仅1.8万人却提供真实智慧服务。证明智慧城市不只属于大城市。" },
    opportunity: { en: "Village-scale smart city model is replicable to thousands of Thai tambons. If NST's smart city DNA reaches its sub-districts, the province transforms bottom-up.", th: "โมเดลเมืองอัจฉริยะระดับหมู่บ้านทำซ้ำได้กับตำบลไทยหลายพัน หาก DNA เมืองอัจฉริยะของนครฯ เข้าถึงตำบล จังหวัดเปลี่ยนแปลงจากล่างขึ้นบน", zh: "村级智慧城市模式可向泰国数千个分区复制。若那空是贪玛叻的智慧城市基因传达至分区，全省将从底层实现转型。" },
    theCatch: { en: "Economy 42. Digital 35. Population 18K — very limited tax base. Needs sustained external funding. Data is sparse (low confidence). Without NST's support, viability is uncertain.", th: "เศรษฐกิจ 42 ดิจิทัล 35 ประชากร 18K — ฐานภาษีจำกัดมาก ต้องการทุนภายนอกอย่างยั่งยืน ข้อมูลเบาบาง (ความเชื่อมั่นต่ำ) หากไม่มีนครฯ สนับสนุน ความอยู่รอดไม่แน่นอน", zh: "经济评分42。数字评分35。人口1.8万——税基极为有限。需要持续的外部资金。数据稀少（置信度低）。若无那空是贪玛叻的支持，可持续性存疑。" },
  },
  tak: {
    livelihood: { en: "Cross-border trade with Myanmar (Mae Sot), agriculture, manufacturing in the Mae Sot SEZ. Labor from Myanmar drives the factory economy.", th: "ค้าชายแดนกับเมียนมา (แม่สอด) เกษตร การผลิตใน SEZ แม่สอด แรงงานจากเมียนมาขับเคลื่อนเศรษฐกิจโรงงาน", zh: "与缅甸跨境贸易（湄索）、农业、湄索经济特区制造业。来自缅甸的劳动力驱动工厂经济运转。" },
    famousFor: { en: "Smart customs and trade digitization. Genuine cross-border tech with Myanmar. The Mae Sot SEZ is Thailand's most active border economic zone.", th: "ศุลกากรอัจฉริยะและค้าดิจิทัล เทคข้ามพรมแดนจริงกับเมียนมา SEZ แม่สอดเป็นเขตเศรษฐกิจชายแดนที่คึกคักที่สุดของไทย", zh: "智慧海关与贸易数字化。泰缅真实跨境科技对接。湄索经济特区是泰国最活跃的边境经济区。" },
    opportunity: { en: "If Myanmar stabilizes, Mae Sot becomes Thailand's western gateway to the Indian Ocean economy. Green coverage 65% — genuinely green despite border challenges.", th: "หากเมียนมามีเสถียรภาพ แม่สอดเป็นประตูตะวันตกของไทยสู่เศรษฐกิจมหาสมุทรอินเดีย พื้นที่สีเขียว 65% — สีเขียวจริงแม้ท้าทายชายแดน", zh: "若缅甸局势稳定，湄索将成为泰国通往印度洋经济体的西部门户。绿化覆盖率65%——尽管边境挑战仍然真正绿色。" },
    theCatch: { en: "PM2.5 34.5 — border burning. GPP ฿108K. Myanmar instability creates unpredictable trade disruptions. Migrant labor issues. Economy 50 — SEZ hasn't yet delivered its promise.", th: "PM2.5 34.5 — การเผาชายแดน GPP ฿108K ความไม่มั่นคงเมียนมาสร้างการชะงักการค้าคาดเดาไม่ได้ ปัญหาแรงงานข้ามชาติ เศรษฐกิจ 50 — SEZ ยังไม่ส่งมอบตามสัญญา", zh: "PM2.5达34.5——边境焚烧问题。GPP仅10.8万铢。缅甸政局不稳导致贸易中断难以预测。外来务工人员问题。经济评分50——经济特区尚未兑现承诺。" },
  },
  "thep-paraj": {
    livelihood: { en: "Agriculture (rice, fruit), small manufacturing, EEC spillover employment. A tiny sub-district in Chachoengsao catching the EEC development wave.", th: "เกษตร (ข้าว ผลไม้) การผลิตขนาดเล็ก การจ้างงานล้นจาก EEC ตำบลเล็กๆ ในฉะเชิงเทราที่จับคลื่นพัฒนา EEC", zh: "农业（水稻、水果）、小型制造业、东部经济走廊溢出就业。北碧府一个小型分区，借助EEC发展浪潮崛起。" },
    famousFor: { en: "Smart agriculture IoT deployment in EEC sub-district. Some genuine sensor deployment for soil and water monitoring. Very early but real.", th: "ติดตั้ง IoT เกษตรอัจฉริยะในตำบล EEC มีการติดตั้งเซ็นเซอร์จริงสำหรับเฝ้าระวังดินและน้ำ เริ่มต้นมากแต่จริง", zh: "EEC分区内的智慧农业物联网部署。真实的土壤和水监测传感器已部署。起步早但真实。" },
    opportunity: { en: "EEC proximity brings infrastructure investment that no other sub-district gets. Could become the test bed for smart agriculture before scaling to the whole Eastern Seaboard.", th: "ใกล้ EEC นำการลงทุนโครงสร้างพื้นฐานที่ตำบลอื่นไม่ได้ อาจเป็นแปลงทดสอบเกษตรอัจฉริยะก่อนขยายสู่ชายฝั่งตะวันออกทั้งหมด", zh: "毗邻EEC带来其他分区无法获得的基础设施投资。可成为智慧农业测试床，再向整个东部沿海地区推广。" },
    theCatch: { en: "Population only 22K. Economy 48, digital 38 — very early stage. Sparse data. Without EEC-driven investment, this would be an unremarkable rural sub-district.", th: "ประชากรเพียง 22K เศรษฐกิจ 48 ดิจิทัล 38 — ระยะเริ่มต้นมาก ข้อมูลเบาบาง หากไม่มีการลงทุนจาก EEC จะเป็นตำบลชนบทธรรมดา", zh: "人口仅2.2万。经济48，数字38——阶段极早。数据稀少。若无EEC驱动的投资，这将是一个平淡无奇的农村分区。" },
  },
  ubon: {
    livelihood: { en: "Agriculture, government services, education, Mekong border trade. Isan's eastern capital — candle festival, temple tourism, and the gateway to Laos and Cambodia.", th: "เกษตร ราชการ การศึกษา ค้าชายแดนแม่น้ำโขง เมืองหลวงอีสานตะวันออก — เทศกาลเทียน ท่องเที่ยววัด และประตูสู่ลาวและกัมพูชา", zh: "农业、政府服务、教育、湄公河边境贸易。东北部东部首府——蜡烛节、寺庙旅游，以及通往老挝和柬埔寨的门户。" },
    famousFor: { en: "Mekong border city with cultural richness. Candle Festival (UNESCO Intangible Heritage candidate). Flood management smart tech along Mun-Mekong confluence.", th: "เมืองชายแดนโขงที่อุดมวัฒนธรรม เทศกาลแห่เทียน (ผู้สมัครมรดกจับต้องไม่ได้ยูเนสโก) เทคจัดการน้ำท่วมอัจฉริยะตามจุดบรรจบมูล-โขง", zh: "文化丰富的湄公河边境城市。蜡烛节（联合国教科文组织非遗候选）。蒙河-湄公河汇合处沿线的智慧防洪技术。" },
    opportunity: { en: "1.88M population — largest catchment in the northeast outside Korat. Cultural tourism brand is genuine. Mekong economic corridor connectivity creates trade potential.", th: "ประชากร 1.88M — ขนาดใหญ่สุดในอีสานนอกจากโคราช แบรนด์ท่องเที่ยวเชิงวัฒนธรรมจริง การเชื่อมต่อระเบียงเศรษฐกิจแม่น้ำโขงสร้างศักยภาพการค้า", zh: "人口188万——东北部除呵叻外最大聚集地。文化旅游品牌真实有力。湄公河经济走廊互联创造贸易潜力。" },
    theCatch: { en: "GPP only ฿98K — Isan poverty is structural. PM2.5 24.8. Economy 54 — limited commercial base despite population size. Brain drain to Bangkok is chronic.", th: "GPP เพียง ฿98K — ความยากจนอีสานเป็นเชิงโครงสร้าง PM2.5 24.8 เศรษฐกิจ 54 — ฐานเชิงพาณิชย์จำกัดแม้ประชากรมาก สมองไหลไปกรุงเทพฯ เรื้อรัง", zh: "GPP仅9.8万铢——东北贫困是结构性问题。PM2.5达24.8。经济评分54——尽管人口众多，商业基础有限。人才外流曼谷问题长期存在。" },
  },
  "ubon-muni": {
    livelihood: { en: "Municipal services, retail, hospitality, education support. The urban core of Ubon Ratchathani — where the candle festival happens and the digital governance concentrates.", th: "บริการเทศบาล ค้าปลีก การบริการ สนับสนุนการศึกษา แกนกลางเมืองอุบลราชธานี — ที่เทศกาลเทียนจัดและธรรมาภิบาลดิจิทัลเข้มข้น", zh: "市政服务、零售业、酒店服务、教育配套。乌汶府城市核心——蜡烛节在此举办，数字治理在此汇聚。" },
    famousFor: { en: "Candle Festival tourism tech. Municipal-level digital governance complementing the larger provincial smart city. Focus on cultural tourism management.", th: "เทคท่องเที่ยวเทศกาลเทียน ธรรมาภิบาลดิจิทัลระดับเทศบาลเสริมเมืองอัจฉริยะระดับจังหวัด เน้นจัดการท่องเที่ยวเชิงวัฒนธรรม", zh: "蜡烛节旅游科技。市级数字治理补充更大规模的省级智慧城市。专注于文化旅游管理。" },
    opportunity: { en: "Concentrated urban core (120K) is manageable for comprehensive digital services. Candle Festival attracts 500K+ visitors — smart event management is exportable.", th: "แกนกลางเมืองกระชับ (120K) จัดการได้สำหรับบริการดิจิทัลครบวงจร เทศกาลเทียนดึง 500K+ คน — จัดการอีเวนต์อัจฉริยะส่งออกได้", zh: "集中的城市核心（12万人）便于全面数字服务部署。蜡烛节每年吸引50万+游客——智慧活动管理可出口。" },
    theCatch: { en: "GPP ฿98K — same structural Isan poverty. Economy 52. Digital 42 — still building capacity. Being a municipality within a larger smart city project creates coordination complexity.", th: "GPP ฿98K — ความยากจนเชิงโครงสร้างอีสานเดียวกัน เศรษฐกิจ 52 ดิจิทัล 42 — ยังสร้างศักยภาพ เป็นเทศบาลในโครงการเมืองอัจฉริยะใหญ่กว่าสร้างความซับซ้อนในการประสานงาน", zh: "GPP仅9.8万铢——相同的东北结构性贫困。经济评分52。数字评分42——仍在建设能力。作为大型智慧城市项目中的一个市，协调复杂性增加。" },
  },
  "reg-roi-et": {
    livelihood: { en: "Rice farming, silk weaving, government services, and agricultural commerce. Roi Et is Isan's quiet province — the kind of city that funds things itself rather than waiting for Bangkok to notice.", th: "ทำนา ทอผ้าไหม ราชการ และพาณิชย์เกษตร ร้อยเอ็ดคือจังหวัดเงียบๆ ของอีสาน — เมืองประเภทที่หาเงินเองแทนที่จะรอให้กรุงเทพฯ มองเห็น", zh: "水稻种植、丝织、政府服务及农业商业。百城府是泰东北一座安静的府——这座城市选择自筹资金，而非等待曼谷垂青。" },
    famousFor: { en: "Ku Phra Kho Na Khmer ruins, Ban Selaphum silk, and winning the FURD City Award for its PPP smart city financing model. The only Thai city to actively court bank loans rather than waiting for government grants.", th: "ปราสาทกู่พระโกนา ผ้าไหมบ้านเสลภูมิ และคว้ารางวัล FURD City Award สำหรับโมเดลการเงินเมืองอัจฉริยะ PPP เมืองไทยเมืองเดียวที่ไปขอสินเชื่อจากธนาคารแทนที่จะรอเงินอุดหนุนจากรัฐบาล", zh: "考拉纳可玛尔高棉遗址、班色拉蓬丝织，以及凭借PPP智慧城市融资模式荣获FURD城市奖。泰国唯一主动向银行借贷而非等待政府拨款的城市。" },
    opportunity: { en: "Roi Et's PPP model — financing smart city infrastructure through bank loans and public-private partnerships rather than waiting for government budget cycles — is the most pragmatic financing blueprint in the index. The FURD City Award validated it. Any mid-tier Isan city with political will can replicate this: the constraint isn't money, it's the willingness to borrow with a plan.", th: "โมเดล PPP ร้อยเอ็ด — ใช้สินเชื่อธนาคารและความร่วมมือภาครัฐ-เอกชนเพื่อก่อสร้างโครงสร้างพื้นฐานเมืองอัจฉริยะแทนการรอรอบงบประมาณรัฐ — เป็นพิมพ์เขียวการเงินที่ปฏิบัติได้จริงที่สุดในดัชนี รางวัล FURD City Award รับรองแล้ว เมืองอีสานระดับกลางที่มีเจตจำนงทางการเมืองสามารถทำซ้ำได้: ข้อจำกัดไม่ใช่เงิน แต่คือความเต็มใจจะกู้ด้วยแผน", zh: "百城府的PPP模式——通过银行贷款和公私合营融资建设智慧城市基础设施，而非等待政府预算周期——是指数中最务实的融资蓝图。FURD城市奖已对此予以认可。任何有政治意愿的中等泰东北城市都可复制：制约不是资金，而是带着计划借钱的意愿。" },
    theCatch: { en: "GPP per capita is among the lowest in Isan. Loan-financed infrastructure requires disciplined repayment — one election cycle of mismanagement and the model collapses. Population growth is flat. Without continued private-sector co-investment, the PPP frame only works if the first deal succeeds.", th: "GPP ต่อหัวอยู่ในระดับต่ำสุดของอีสาน โครงสร้างพื้นฐานที่เงินกู้ต้องการชำระคืนอย่างมีวินัย — ผิดพลาดหนึ่งรอบเลือกตั้งและโมเดลพัง การเติบโตของประชากรแทบไม่มี หากไม่มีการลงทุนร่วมจากเอกชนต่อเนื่อง กรอบ PPP จะได้ผลก็ต่อเมื่อดีลแรกประสบความสำเร็จ", zh: "人均GPP在泰东北最低之列。贷款融资的基础设施需要严格还款——一个选举周期的管理失误就能让模式崩溃。人口增长停滞。若无持续的私营部门联合投资，PPP框架只有在第一笔交易成功时才能运转。" },
    landArea: 8299,
  },
  umong: {
    livelihood: { en: "Agriculture, handicrafts, small manufacturing near Lamphun industrial estates. A tiny municipality near Chiang Mai with surprisingly comprehensive smart city ambitions.", th: "เกษตร หัตถกรรม การผลิตขนาดเล็กใกล้นิคมอุตสาหกรรมลำพูน เทศบาลเล็กๆ ใกล้เชียงใหม่ที่มีความทะเยอทะยานเมืองอัจฉริยะครอบคลุมอย่างน่าแปลกใจ", zh: "农业、手工艺品、南奔工业园区附近小型制造业。清迈近郊一个小型市政单位，却有令人意外的全面智慧城市雄心。" },
    famousFor: { en: "All 7 smart dimensions covered despite 22K population. Community-driven approach. Green coverage 55%. Proving that ambition doesn't require size.", th: "ครอบคลุมทั้ง 7 มิติอัจฉริยะแม้ประชากร 22K แนวทางขับเคลื่อนโดยชุมชน พื้นที่สีเขียว 55% พิสูจน์ว่าความทะเยอทะยานไม่ต้องการขนาด", zh: "尽管人口仅2.2万，覆盖全部7个智慧维度。社区主导方法。绿化覆盖率55%。证明雄心不需要规模。" },
    opportunity: { en: "Lamphun industrial estate proximity provides economic anchor. Chiang Mai spillover creates demand. Community-driven model is replicable across northern Thailand.", th: "ใกล้นิคมลำพูนเป็นสมอเศรษฐกิจ ความล้นจากเชียงใหม่สร้างอุปสงค์ โมเดลชุมชนนำทำซ้ำได้ทั่วภาคเหนือ", zh: "毗邻南奔工业园区提供经济支柱。清迈溢出效应创造需求。社区主导模式可在泰国北部各地复制。" },
    theCatch: { en: "PM2.5 36.8 — among the worst (burning season devastates the north). Economy 48. GPP ฿125K — modest. Being small means every setback is proportionally larger.", th: "PM2.5 36.8 — เลวร้ายที่สุด (ฤดูเผาทำลายภาคเหนือ) เศรษฐกิจ 48 GPP ฿125K — พอประมาณ เล็กหมายความว่าทุกอุปสรรคใหญ่เป็นสัดส่วน", zh: "PM2.5达36.8——北部最差之列（焚烧季重创北方）。经济评分48。GPP仅12.5万铢——有限。规模小意味着每次挫折的比例影响更大。" },
  },
};

function dimensionName(dimension: SmartCity["smartDimensions"][number]): { en: string; th: string; zh: string } {
  switch (dimension) {
    case "economy":
      return { en: "local economy", th: "เศรษฐกิจท้องถิ่น", zh: "地方经济" };
    case "energy":
      return { en: "energy systems", th: "ระบบพลังงาน", zh: "能源系统" };
    case "environment":
      return { en: "environmental management", th: "การจัดการสิ่งแวดล้อม", zh: "环境管理" };
    case "governance":
      return { en: "public service governance", th: "การบริหารบริการสาธารณะ", zh: "公共服务治理" };
    case "living":
      return { en: "daily urban services", th: "บริการเมืองในชีวิตประจำวัน", zh: "日常城市服务" };
    case "mobility":
      return { en: "mobility", th: "การเดินทาง", zh: "出行系统" };
    case "people":
      return { en: "people and skills", th: "คนและทักษะ", zh: "人才与技能" };
  }
}

function regionRole(city: SmartCity): { en: string; th: string; zh: string } {
  switch (city.region) {
    case "bangkok":
      return { en: "part of the capital region, where land value, congestion, and service demand are tightly linked", th: "ส่วนหนึ่งของเขตเมืองหลวงที่มูลค่าที่ดิน การจราจร และความต้องการบริการผูกกันแน่น", zh: "首都圈的组成部分，土地价值、交通拥堵与服务需求紧密相连" };
    case "central":
      return { en: "a central-region service and logistics node with direct pull from Bangkok's economy", th: "โหนดบริการและโลจิสติกส์ภาคกลางที่รับแรงดึงจากเศรษฐกิจกรุงเทพฯ โดยตรง", zh: "直接受曼谷经济辐射的中部服务与物流节点" };
    case "east":
      return { en: "inside the eastern growth corridor, where industry, ports, tourism, and agriculture overlap", th: "อยู่ในแนวเติบโตภาคตะวันออกที่อุตสาหกรรม ท่าเรือ ท่องเที่ยว และเกษตรทับซ้อนกัน", zh: "处于东部增长走廊内，工业、港口、旅游与农业相互交叠" };
    case "north":
      return { en: "a northern city where heritage, universities, agriculture, and seasonal haze shape delivery choices", th: "เมืองภาคเหนือที่มรดกวัฒนธรรม มหาวิทยาลัย เกษตร และหมอกควันตามฤดูเป็นตัวกำหนดงานส่งมอบ", zh: "北部城市，文化遗址、大学、农业与季节性霾共同决定项目落地方式" };
    case "northeast":
      return { en: "an Isan city where public services, agriculture, migration, and border links often matter more than glossy pilots", th: "เมืองอีสานที่บริการสาธารณะ เกษตร การย้ายถิ่น และการเชื่อมชายแดนมักสำคัญกว่าโครงการโชว์", zh: "泰东北城市，公共服务、农业、劳动力外出与边境联通往往比示范项目更重要" };
    case "south":
      return { en: "a southern city where tourism, fisheries, rubber, flood risk, and border trade often share the same streets", th: "เมืองภาคใต้ที่ท่องเที่ยว ประมง ยางพารา ความเสี่ยงน้ำท่วม และการค้าชายแดนมักอยู่บนถนนเดียวกัน", zh: "南部城市，旅游、渔业、橡胶、洪涝风险与边境贸易往往共处同一街道" };
  }
}

function buildFallbackContext(city: SmartCity): CityContext {
  const primary = dimensionName(city.smartDimensions[0] ?? "governance");
  const secondary = dimensionName(city.smartDimensions[1] ?? "living");
  const role = regionRole(city);
  const statusPhrase =
    city.status === "registered"
      ? {
        en: "a registered smart-city promotion zone with public implementation evidence still thin",
        th: "เขตส่งเสริมเมืองอัจฉริยะที่ขึ้นทะเบียนแล้ว แต่หลักฐานสาธารณะด้านการดำเนินงานยังมีจำกัด",
        zh: "已登记的智慧城市推广区，公开实施证据尚薄",
      }
      : city.status === "promotion"
        ? {
          en: "a promotion-zone dossier where the strongest public evidence should be read project by project",
          th: "เมืองในกลุ่มส่งเสริมที่ควรอ่านหลักฐานสาธารณะเป็นรายโครงการ",
          zh: "推广区档案，公开证据应逐项目查阅",
        }
        : {
          en: "a certified smart-city dossier whose claims still need to be checked against visible operating evidence",
          th: "เมืองอัจฉริยะที่ได้รับการรับรองแล้ว แต่คำอ้างยังต้องตรวจเทียบกับหลักฐานการเดินระบบที่มองเห็นได้",
          zh: "已认证的智慧城市档案，相关声明仍需与可见运营证据核对",
        };

  return {
    livelihood: {
      en: `${city.nameEn} is ${role.en}. Daily life is best read through ${primary.en}, ${secondary.en}, and the ordinary municipal services residents actually touch.`,
      th: `${city.nameTh} เป็น${role.th} ชีวิตประจำวันควรอ่านผ่าน${primary.th} ${secondary.th} และบริการเทศบาลธรรมดาที่ประชาชนใช้งานจริง`,
      zh: `${city.nameEn}是${role.zh}。日常生活最宜通过${primary.zh}、${secondary.zh}及居民实际接触的普通市政服务来理解。`,
    },
    famousFor: {
      en: `${city.nameEn} is currently documented as ${statusPhrase.en}. The safest public claim is its registry position, location, and stated smart-city dimensions.`,
      th: `${city.nameTh} ถูกบันทึกไว้ในฐานะ${statusPhrase.th} คำอ้างที่ปลอดภัยที่สุดคือสถานะในทะเบียน ทำเล และมิติเมืองอัจฉริยะที่ระบุไว้`,
      zh: `${city.nameEn}目前被记录为${statusPhrase.zh}。最安全的公开表述是其登记状态、位置及所述智慧城市维度。`,
    },
    opportunity: {
      en: `The practical opportunity is to turn the ${primary.en} agenda into a measurable service: publish baseline data, name the operator, and show residents what changed.`,
      th: `โอกาสที่จับต้องได้คือเปลี่ยนวาระ${primary.th}ให้เป็นบริการที่วัดผลได้: เปิดข้อมูลตั้งต้น ระบุผู้เดินระบบ และแสดงให้ประชาชนเห็นว่าอะไรเปลี่ยนไป`,
      zh: `实际机遇在于将${primary.zh}议程转化为可衡量的服务：发布基线数据、公示运营方，并向居民展示改变了什么。`,
    },
    theCatch: city.status === "registered"
      ? {
        en: "The key constraint is registry status: being in the depa promotion registry is not the same thing as live deployment, so this dossier should stay conservative until public implementation evidence appears.",
        th: "ข้อจำกัดหลักคือสถานะในทะเบียน: การอยู่ในทะเบียนส่งเสริมของ depa ไม่ใช่สิ่งเดียวกับการมีระบบใช้งานจริง ดอสซิเยร์นี้จึงควรเล่าอย่างระมัดระวังจนกว่าจะมีหลักฐานสาธารณะของการดำเนินงาน",
        zh: "核心制约是登记状态：列入depa推广名录不等于系统已上线运行，因此在公开实施证据出现之前，本档案应保持审慎表述。",
      }
      : {
        en: `The risk is over-claiming. ${city.nameEn} needs evidence that the ${primary.en} work is operating, not just listed in a plan.`,
        th: `ความเสี่ยงคือการกล่าวอ้างเกินจริง ${city.nameTh} ต้องมีหลักฐานว่างานด้าน${primary.th}กำลังใช้งาน ไม่ใช่แค่ถูกเขียนไว้ในแผน`,
        zh: `风险在于过度声明。${city.nameEn}需要证据表明${primary.zh}工作正在运行，而非仅列于规划之中。`,
      },
  };
}

for (const city of allCities) {
  cityContexts[city.id] ??= buildFallbackContext(city);
}

/** Get city context — generated conservatively when no curated context exists */
export function getCityContext(cityId: string): CityContext | undefined {
  return cityContexts[cityId];
}
