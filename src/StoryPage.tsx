import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface TimelineEvent {
  year: string;
  titleEn: string;
  titleTh: string;
  bodyEn: string;
  bodyTh: string;
  photos: string[];
  captionEn?: string;
  captionTh?: string;
}

const timeline: TimelineEvent[] = [
  {
    year: "2017",
    titleEn: "The beginning: Smart City Office founded",
    titleTh: "จุดเริ่มต้น: ก่อตั้งสำนักงานเมืองอัจฉริยะ",
    bodyEn: "The Digital Economy Promotion Agency (depa) establishes the Smart City Thailand Office on October 15, 2017. The mission: create a national smart city development plan. At this stage, the approach is heavily technology-driven — sensors, platforms, infrastructure. The 7 Smart City dimensions are defined: Economy, Energy, Environment, Governance, Living, Mobility, People. Dr. Pasakorn Srisook leads the digital promotion division. The team is small. The ambition is enormous.",
    bodyTh: "สำนักงานส่งเสริมเศรษฐกิจดิจิทัล (depa) ก่อตั้งสำนักงานเมืองอัจฉริยะประเทศไทย วันที่ 15 ตุลาคม 2560 ภารกิจ: สร้างแผนพัฒนาเมืองอัจฉริยะระดับชาติ ในระยะนี้ แนวทางเน้นเทคโนโลยีเป็นหลัก — เซ็นเซอร์ แพลตฟอร์ม โครงสร้างพื้นฐาน กำหนด 7 มิติเมืองอัจฉริยะ ดร.ภาสกร ศรีสุข นำกองส่งเสริมดิจิทัล ทีมเล็ก ความทะเยอทะยานใหญ่",
    photos: ["P6204927.JPG", "P6205097.JPG"],
    captionEn: "Smart City Thailand Roadshow — taking the idea to every region",
    captionTh: "Smart City Thailand Roadshow — นำแนวคิดไปทุกภูมิภาค",
  },
  {
    year: "2018–2019",
    titleEn: "Going international: ASEAN and beyond",
    titleTh: "สู่สากล: อาเซียนและไกลกว่า",
    bodyEn: "Thailand joins the ASEAN Smart Cities Network (ASCN) with Bangkok, Chonburi, and Phuket as pilot cities. Dr. Non Arkaraprasertkul — a Harvard-trained anthropologist and architect who had been studying cities from Shanghai to Chicago — joins depa as Senior Expert in Smart City Promotion. The team goes to Seoul for the Seoul Biennale of Architecture and Urbanism, to Taipei for SCSE, and begins building international partnerships with Japan, Korea, and the EU. Dr. Non starts pushing a radical idea: smart cities should be measured by how citizens feel, not by how much technology is deployed.",
    bodyTh: "ไทยเข้าร่วม ASEAN Smart Cities Network (ASCN) กรุงเทพฯ ชลบุรี และภูเก็ตเป็นเมืองนำร่อง ดร.ณณ อาคาราประเสริฐกุล — นักมานุษยวิทยาและสถาปนิกจากฮาร์วาร์ดที่ศึกษาเมืองจากเซี่ยงไฮ้ถึงชิคาโก — เข้าร่วม depa เป็นผู้เชี่ยวชาญอาวุโสด้านส่งเสริมเมืองอัจฉริยะ ทีมไปโซลงาน Biennale ไปไทเปงาน SCSE เริ่มสร้างความร่วมมือระหว่างประเทศกับญี่ปุ่น เกาหลี EU ดร.ณณ เริ่มผลักดันแนวคิดสุดขั้ว: เมืองอัจฉริยะควรวัดจากความรู้สึกของประชาชน ไม่ใช่จากปริมาณเทคโนโลยี",
    photos: [
      "depa x korea SBAU2019.jpg",
      "SWP_8806.JPG",
      "4A2A6179.JPG",
      "4A2A6250.JPG",
      "IMG_5304.JPG",
      "IMG_5849.JPG",
    ],
    captionEn: "Seoul Biennale, ASEAN Smart Cities Network Conference 2019, and the early team",
    captionTh: "Seoul Biennale งาน ASEAN Smart Cities Network 2019 และทีมในช่วงเริ่มต้น",
  },
  {
    year: "2019",
    titleEn: "The shift: from tech-centric to citizen-centric",
    titleTh: "จุดเปลี่ยน: จากเน้นเทคโนโลยี สู่เน้นประชาชน",
    bodyEn: "Dr. Non runs the first \"Co-Founder Dating\" hackathons — matching city problems with startup solutions. Not in Silicon Valley fashion, but Thai-style: on bean bags, in co-working spaces, with food. He launches the ASEAN Startup Hackathon at depa's headquarters in Bangkok. The Smart City Leadership (SCL) program begins: training local government officials not in technology procurement, but in design thinking, citizen engagement, and service design. The paradigm shifts from \"deploy sensors\" to \"understand what citizens actually need.\" Mastercard partners with depa to bring 27 Thai cities into the City Possible network.",
    bodyTh: "ดร.ณณ จัด Co-Founder Dating แฮกกาธอนครั้งแรก — จับคู่ปัญหาเมืองกับโซลูชันสตาร์ทอัพ ไม่แบบ Silicon Valley แต่แบบไทย: บนเบาะ ในโคเวิร์กกิง มีอาหาร เปิดตัว ASEAN Startup Hackathon ที่สำนักงาน depa เริ่มโปรแกรม Smart City Leadership (SCL): ฝึกเจ้าหน้าที่ท้องถิ่นไม่ใช่เรื่องจัดซื้อเทคโนโลยี แต่เรื่อง design thinking การมีส่วนร่วมของพลเมือง และ service design กระบวนทัศน์เปลี่ยนจาก 'ติดเซ็นเซอร์' เป็น 'เข้าใจสิ่งที่ประชาชนต้องการจริงๆ'",
    photos: [
      "IMG_6691.JPG",
      "72639510_2459479007664540_4785365931712839680_o.jpg",
      "73513755_10157605754953794_5475140449704345600_n.jpg",
      "IMG_7504.JPG",
      "66438786_2265889173489652_6708326457757663232_o.jpg",
      "350284.jpg",
    ],
    captionEn: "Co-Founder Dating, ASEAN Hackathon, depa team building — the culture shift begins",
    captionTh: "Co-Founder Dating, ASEAN Hackathon, สร้างทีม depa — วัฒนธรรมเริ่มเปลี่ยน",
  },
  {
    year: "2020",
    titleEn: "Smart City Week and the first certifications",
    titleTh: "Smart City Week และการรับรองครั้งแรก",
    bodyEn: "Thailand launches Smart City Week 2020 — the biggest smart city event in the country. Dr. Non presents the \"Smart City Hamburger\" — a visual framework showing that technology is just the meat; the buns are governance and citizen engagement. The metaphor sticks. The first Smart City Competitiveness Index (TSCCI) is developed. 4 cities receive initial Smart City status: Phuket, Khon Kaen, Chiang Mai, and Yala. COVID hits. The team pivots to digital governance — citizen reporting systems, telemedicine, smart health monitoring. The crisis proves the citizen-centric approach: cities with strong citizen engagement handle the pandemic better.",
    bodyTh: "ไทยจัด Smart City Week 2020 — งานเมืองอัจฉริยะใหญ่ที่สุดในประเทศ ดร.ณณ นำเสนอ 'Smart City Hamburger' — กรอบภาพที่แสดงว่าเทคโนโลยีเป็นแค่เนื้อ ขนมปังคือการปกครองและการมีส่วนร่วมของประชาชน อุปมาติดหู พัฒนาดัชนีการแข่งขันเมืองอัจฉริยะ (TSCCI) ครั้งแรก 4 เมืองได้สถานะเมืองอัจฉริยะเบื้องต้น COVID มา ทีมปรับตัวสู่ digital governance — ระบบรายงานของประชาชน telemedicine วิกฤตพิสูจน์ว่าแนวทางเน้นประชาชนได้ผล",
    photos: [
      "_K635402.jpg",
      "1-57.jpg",
      "IMG_4034.JPG",
    ],
    captionEn: "Smart City Week, depa boardroom strategy, and the three leaders in depa jackets",
    captionTh: "Smart City Week ยุทธศาสตร์ห้องประชุม depa และผู้นำสามคนในแจ็คเก็ต depa",
  },
  {
    year: "2021",
    titleEn: "Batch 1: 15 cities get the Smart City logo",
    titleTh: "รุ่นที่ 1: 15 เมืองได้รับตราสัญลักษณ์เมืองอัจฉริยะ",
    bodyEn: "The Smart City Thailand committee awards the official Smart City Local logo (ตราสัญลักษณ์เมืองอัจฉริยะ) to 15 cities in the first batch. Deputy PM Prawit Wongsuwan presents the logos. The list includes Chiang Mai, Phuket, Khon Kaen, Samyan, Yala, and Wangchan Valley. Dr. Non publishes a landmark article in Hitachi Review: \"Smart City Initiatives in Thailand: Key Concepts and Methods\" — articulating the citizen-centric approach for an international audience. The article becomes required reading for smart city practitioners across ASEAN. Workshop training intensifies: Dr. Non and team run design thinking sessions with local government officials across the country.",
    bodyTh: "คณะกรรมการเมืองอัจฉริยะไทยมอบตราสัญลักษณ์เมืองอัจฉริยะให้ 15 เมืองรุ่นที่ 1 รอง นรม. ประวิตร วงษ์สุวรรณ มอบตราสัญลักษณ์ ดร.ณณ ตีพิมพ์บทความสำคัญใน Hitachi Review: 'Smart City Initiatives in Thailand' — นำเสนอแนวทางเน้นประชาชนต่อผู้อ่านนานาชาติ บทความกลายเป็นบทอ่านบังคับสำหรับผู้ปฏิบัติงานเมืองอัจฉริยะทั่วอาเซียน",
    photos: [
      "35663858.1bc37816278448879bdf3935d73727f4.21021520.JPG",
      "IMG_7760.JPG",
      "IMG_7761.JPG",
      "IMG_1457.JPG",
    ],
    captionEn: "Design thinking workshops with local governments — teaching mayors to listen to citizens",
    captionTh: "เวิร์กช็อป design thinking กับรัฐบาลท้องถิ่น — สอนนายกเทศมนตรีให้ฟังประชาชน",
  },
  {
    year: "2022",
    titleEn: "Batch 2: 15 more cities, international expansion",
    titleTh: "รุ่นที่ 2: อีก 15 เมือง ขยายสู่สากล",
    bodyEn: "Batch 2 adds 15 more cities including Rayong, Chiang Rai, Nan, Korat, Krabi, Hat Yai, and Koh Samui. Thailand now has 30 certified smart cities across 20 provinces. Dr. Supakorn joins the leadership team, bringing expertise in digital infrastructure and platform development. The team develops the City Data Platform (citydata.in.th) — Thailand's first unified smart city data dashboard. ASEAN Smart Cities Network adds Chiang Mai, Khon Kaen, and Rayong to Thailand's representation. Dr. Non is featured in The ASEAN Magazine and begins consulting for the ASEAN Digital Masterplan 2025.",
    bodyTh: "รุ่น 2 เพิ่มอีก 15 เมือง รวมถึงระยอง เชียงราย น่าน โคราช กระบี่ หาดใหญ่ สมุย ไทยมี 30 เมืองอัจฉริยะรับรองแล้วใน 20 จังหวัด ดร.ศุภกร เข้าร่วมทีมผู้นำ นำความเชี่ยวชาญด้านโครงสร้างพื้นฐานดิจิทัล ทีมพัฒนา City Data Platform (citydata.in.th) — แดชบอร์ดข้อมูลเมืองอัจฉริยะแบบรวมศูนย์แห่งแรกของไทย",
    photos: [
      "IMG_6065.JPG",
      "IMG_6482.JPG",
      "IMG_6508.JPG",
      "IMG_6426.JPG",
      "IMG_6654.JPG",
    ],
    captionEn: "Training programs, international forums, and building the smart city ecosystem",
    captionTh: "โปรแกรมฝึกอบรม เวทีนานาชาติ และการสร้างระบบนิเวศเมืองอัจฉริยะ",
  },
  {
    year: "2023",
    titleEn: "Batch 3 and the Nakhon Si Thammarat breakthrough",
    titleTh: "รุ่น 3 และความสำเร็จนครศรีธรรมราช",
    bodyEn: "6 more cities join: Lampang, Samut Prakan, Nakhon Si Thammarat, and others. The Nakhon Si Thammarat \"My City\" app becomes the flagship example of citizen-centric smart city: citizens report clogged drains, data analytics identify flood root causes, targeted infrastructure upgrades solve them. Response time drops from 67 hours to 2 hours. This is Dr. Non's proof of concept — technology serving citizens, not the other way around. TNGlobal publishes a major interview: \"A smart city cannot exist without its citizens.\" Dr. Non begins conceptualizing the SLIC Index.",
    bodyTh: "อีก 6 เมืองเข้าร่วม: ลำปาง สมุทรปราการ นครศรีธรรมราช แอพ 'เมืองของฉัน' นครศรีธรรมราชกลายเป็นตัวอย่างเรือธงของเมืองอัจฉริยะเน้นประชาชน: ประชาชนรายงานท่อระบายอุดตัน วิเคราะห์ข้อมูลหาสาเหตุน้ำท่วม แก้โครงสร้างพื้นฐานตรงจุด เวลาตอบสนองลดจาก 67 ชั่วโมงเหลือ 2 ชั่วโมง นี่คือ proof of concept ของ ดร.ณณ",
    photos: [
      "IMG_0964.JPG",
      "IMG_0861.JPG",
      "IMG_1089.JPG",
      "IMG_1382.JPG",
      "IMG_1596.JPG",
      "IMG_1447.JPG",
    ],
    captionEn: "Training local government teams, Inno Tourism Boot-Up, and hands-on workshops across Thailand",
    captionTh: "ฝึกทีมรัฐบาลท้องถิ่น Inno Tourism Boot-Up และเวิร์กช็อปภาคปฏิบัติทั่วไทย",
  },
  {
    year: "2024–2025",
    titleEn: "SLIC Index V1, UNCRD, and 37 cities",
    titleTh: "SLIC Index V1, UNCRD และ 37 เมือง",
    bodyEn: "The Smart Liveable Cities Index (SLIC) V1 launches — a transparent, open-source city ranking built from the ground up. Dr. Non presents Thailand's citizen-centric approach at the UNCRD International Training Workshop on Smart Cities in Kobe, Japan. Phuket Tinicon Valley receives the Smart City Local logo in Batch 4, bringing the total to 37 certified cities. depa sets a target of 105 inclusive smart cities by 2027. The Smart and Liveable City Lab soft-launches with support from Thai and New Zealand governments.",
    bodyTh: "SLIC Index V1 เปิดตัว — ดัชนีจัดอันดับเมืองแบบโปร่งใส โอเพนซอร์ส สร้างจากศูนย์ ดร.ณณ นำเสนอแนวทางเน้นประชาชนของไทยที่ UNCRD Training Workshop เมืองอัจฉริยะ โกเบ ญี่ปุ่น ภูเก็ตทินิคอนวัลเลย์ได้ตราสัญลักษณ์รุ่น 4 รวม 37 เมืองรับรอง depa ตั้งเป้า 105 เมืองอัจฉริยะภายปี 2570",
    photos: [
      "IMG_9995.JPG",
      "IMG_3619.JPG",
      "IMG_4175.JPG",
      "IMG_4207.JPG",
      "IMG_7649.JPG",
    ],
    captionEn: "MOPH collaborations, training the next generation, and building partnerships",
    captionTh: "ความร่วมมือกับ สธ. ฝึกคนรุ่นใหม่ และสร้างความร่วมมือ",
  },
  {
    year: "2026",
    titleEn: "SCSE Taipei: SLIC V2 and the world stage",
    titleTh: "SCSE ไทเป: SLIC V2 และเวทีโลก",
    bodyEn: "March 2026. Smart City Summit & Expo, Taipei. The largest smart city event in Asia — 174 cities, 53 countries, 120,000 visitors. The Vice President of Taiwan opens the event. Dr. Non takes the City Vision in Action stage as keynote speaker. He shows a war dashboard built in 45 minutes, a bus tracker running without GPS, a citizen reporting system that cut response times from 67 hours to 2. Then: the SLIC Index V2. Interactive. Transparent. Every number traceable. A European mayor's alliance asks to use it instead of The Economist's index. City leaders line up asking: \"Can you do this for my city?\" The Smart City Thailand Index — this page you're reading — is born from this momentum.",
    bodyTh: "มีนาคม 2569. Smart City Summit & Expo ไทเป งานเมืองอัจฉริยะใหญ่ที่สุดในเอเชีย — 174 เมือง 53 ประเทศ 120,000 ผู้เยี่ยมชม รองประธานาธิบดีไต้หวันเปิดงาน ดร.ณณ ขึ้นเวที City Vision in Action เป็น keynote speaker เขาโชว์ war dashboard ที่สร้างใน 45 นาที ระบบติดตามรถเมล์โดยไม่ใช้ GPS ระบบรายงานของประชาชนที่ลดเวลาตอบสนองจาก 67 ชั่วโมงเหลือ 2 แล้ว: SLIC Index V2 แบบโต้ตอบ โปร่งใส ทุกตัวเลขสืบย้อนได้ พันธมิตรนายกเทศมนตรียุโรปขอใช้แทนดัชนี The Economist ดัชนีเมืองอัจฉริยะไทย — หน้าที่คุณกำลังอ่าน — เกิดจากโมเมนตัมนี้",
    photos: [
      "IMG_7607.JPG",
      "IMG_7613.JPG",
      "IMG_0396.JPG",
      "IMG_0324.JPG",
      "593016939.296474.jpg",
      "578383385.557473.jpg",
    ],
    captionEn: "The team — from Taipei stages to Bangkok food courts, building the future of Thai smart cities",
    captionTh: "ทีม — จากเวทีไทเปถึงศูนย์อาหารกรุงเทพ สร้างอนาคตเมืองอัจฉริยะไทย",
  },
];

export default function StoryPage({ locale, onNavigate }: Props) {
  return (
    <>
      <section className="section story-hero">
        <p className="eyebrow">{locale === "th" ? "เรื่องราว" : "The story"}</p>
        <h1 className="hero-title">
          {locale === "th"
            ? <>จากเซ็นเซอร์<br />สู่ประชาชน</>
            : <>From sensors<br />to citizens.</>}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? "ประวัติศาสตร์การเปลี่ยนแปลงเมืองอัจฉริยะไทยจากแนวทางเน้นเทคโนโลยีเป็นแนวทางเน้นประชาชน — เรื่องราวของคนที่ทำให้มันเกิดขึ้น"
            : "How Thailand's smart city program transformed from a technology-first approach to a citizen-centric movement — and the people who made it happen."}
        </p>
      </section>

      {/* ─── TIMELINE ─── */}
      <section className="section">
        {timeline.map((event, i) => (
          <div key={i} className="timeline-event">
            <div className="timeline-year-bar">
              <span className="timeline-year">{event.year}</span>
              <span className="timeline-line" />
            </div>
            <div className="timeline-content">
              <h2 className="timeline-title">
                {locale === "th" ? event.titleTh : event.titleEn}
              </h2>
              <p className="timeline-body">
                {locale === "th" ? event.bodyTh : event.bodyEn}
              </p>
              {event.photos.length > 0 && (
                <div className="timeline-photos">
                  {event.photos.map((photo, j) => (
                    <img
                      key={j}
                      src={`/photos/${photo}`}
                      alt=""
                      className="timeline-photo"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}
              {event.captionEn && (
                <p className="timeline-caption">
                  {locale === "th" ? event.captionTh : event.captionEn}
                </p>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ─── CLOSING ─── */}
      <section className="section story-closing">
        <div className="callout-card">
          <p className="eyebrow">{locale === "th" ? "ปัจจุบัน" : "Now"}</p>
          <h2>
            {locale === "th"
              ? "37 เมืองรับรอง. 165+ เขตส่งเสริม. 1 ดัชนีที่วัดความจริง."
              : "37 certified. 165+ promotion zones. 1 index that measures reality."}
          </h2>
          <p>
            {locale === "th"
              ? "เป้าหมาย 105 เมืองอัจฉริยะภายปี 2570 ดัชนีนี้จะติดตามทุกเมือง — ไม่ใช่ด้วยแผนที่สวยหรู แต่ด้วยผลลัพธ์จริงที่ประชาชนสัมผัสได้"
              : "Target: 105 smart cities by 2027. This index will track every one of them — not by beautiful plans, but by real outcomes citizens can feel."}
          </p>
          <button className="cta-button" onClick={() => onNavigate("/rankings")}>
            {locale === "th" ? "ดูอันดับ" : "See the rankings"}
          </button>
        </div>
      </section>
    </>
  );
}
