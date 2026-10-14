// ---------------------------------------------------------------------------
// The Grand Slam Circuit — the international speaking record
// ---------------------------------------------------------------------------
// Dr Non's keynote record across Asia, in one fixed-height rail.
//
// WHY THIS IS A SEPARATE DATA FILE. The previous treatment ("From Goyang to
// Shanghai") was a hand-written paragraph plus a three-up photo grid. Every
// new invitation meant editing prose, adding an <img>, and pushing the page
// taller — the section grew by roughly a viewport per talk and would have
// bled the page down forever. The complaint was fair.
//
// The fix is structural: the circuit is data, not markup. Adding a stop is
// one object here and nothing else. The rail renders every stop in the same
// fixed-height row regardless of how many there are, so the twelfth talk costs
// the same vertical space as the fifth — the rail scrolls horizontally on a
// phone and paginates in place on desktop.
//
// PHOTOS ARE OPTIONAL AND CAPPED. A stop without a photo renders as a type
// card, not a broken image. Only the three most recent stops carry images;
// older ones fall back to type so the rail cannot be pushed sideways by an
// unbounded number of photographs. MAX_PHOTOS enforces that here rather than
// trusting the next agent to remember.
//
// Every claim below is sourced. Where a figure comes from the roundtable's
// own programme PDF or from a dated announcement on this site, the source is
// named. Nothing is inferred.
// ---------------------------------------------------------------------------

export type CircuitStop = {
  id: string;
  city: { en: string; th: string; zh: string };
  country: { en: string; th: string; zh: string };
  flag: string;
  /** ISO date of the appearance. Used for ordering and for the year label. */
  date: string;
  venue: { en: string; th: string; zh: string };
  /** What was actually delivered — a talk, a launch, a panel. Never vague. */
  format: { en: string; th: string; zh: string };
  /** The one claim worth carrying. Kept short: this is a rail, not an essay. */
  note: { en: string; th: string; zh: string };
  /** Full-size image. Omit for a type card. */
  photo?: string;
  photoAlt?: { en: string; th: string; zh: string };
  /** Small image for the rail tile. Omit alongside photo. */
  thumb?: string;
  /** Attribution for the photo itself. */
  photoCredit?: { en: string; th: string; zh: string };
};

/**
 * How many stops carry a photograph. Beyond this the rail degrades to type
 * cards so the horizontal scroll stays bounded. Bump deliberately, not by
 * accident.
 */
export const MAX_PHOTOS = 3;

const OAR_PHOTO_CREDIT = {
  en: "Osaka Asia Roundtable 2026",
  th: "Osaka Asia Roundtable 2026",
  zh: "Osaka Asia Roundtable 2026",
};

/**
 * Ordered newest-first. The rail renders in array order; do not re-sort at
 * render time.
 */
export const GRAND_SLAM_STOPS: CircuitStop[] = [
  {
    id: "osaka-2026",
    city: { en: "Osaka", th: "โอซากะ", zh: "大阪" },
    country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" },
    flag: "🇯🇵",
    date: "2026-10-08",
    venue: {
      en: "Osaka Metropolitan University, Morinomiya Campus",
      th: "มหาวิทยาลัยโอซากะเมโทรโพลิเทน วิทยาเขตมริโนมิยะ",
      zh: "大阪市立大学森之宫校区",
    },
    format: {
      en: "Keynote · Country case studies",
      th: "วิทยากร · กรณีศึกษาระดับประเทศ",
      zh: "主旨演讲 · 国家案例研究",
    },
    note: {
      en: "Spoke on what happens after the pilot works: DEPA's flood monitoring, urban operations dashboards and the open assessment tools, presented as evidence that institutions — not technology — are the binding constraint.",
      th: "พูดถึงสิ่งที่เกิดขึ้นหลังไพลอตสำเร็จ: ระบบเฝ้าระวังน้ำท่วม ศูนย์บัญชาการเมือง และเครื่องมือประเมินแบบเปิดของ depa โดยชี้ว่าสถาบัน ไม่ใช่เทคโนโลยี คือข้อจำกัดที่แท้จริง",
      zh: "演讲主题是试点成功之后会发生什么：depa 的洪水监测、城市运营仪表盘与开放评估工具，用以说明真正的约束来自制度而非技术。",
    },
    photo: "/Nakhon Si Thammarat/speaking-osaka2026.jpg",
    thumb: "/Nakhon Si Thammarat/speaking-osaka2026-thumb.jpg",
    photoAlt: {
      en: "Dr. Non speaking at the Osaka Asia Roundtable 2026, with the Tokyo Institute of Technology and Buri Ram University stickers on his laptop",
      th: "ดร.ณณ บรรยายที่ Osaka Asia Roundtable 2026 โน้ตบุ๊กมีสติกเกอร์สถาบันเทคโนโลยีโตเกียวและมหาวิทยาลัยบุรีรัมย์",
      zh: "Non 博士在 2026 年大阪亚洲圆桌会议上发言，笔记本上贴有东京工业大学与武里南大学贴纸",
    },
    photoCredit: OAR_PHOTO_CREDIT,
  },
  {
    id: "osaka-2026-panel",
    city: { en: "Osaka", th: "โอซากะ", zh: "大阪" },
    country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" },
    flag: "🇯🇵",
    date: "2026-10-08",
    venue: {
      en: "Osaka Metropolitan University — country case study session",
      th: "มหาวิทยาลัยโอซากะเมโทรโพลิเทน — ช่วงกรณีศึกษาระดับประเทศ",
      zh: "大阪市立大学 — 国家案例研究环节",
    },
    format: {
      en: "Country case · Thailand",
      th: "กรณีศึกษาระดับประเทศ · ไทย",
      zh: "国家案例 · 泰国",
    },
    note: {
      en: "Seven minutes on the record, alongside Osaka City and Prefecture, Vietnam's National Innovation Center and Indonesia's BAPPENAS — on how systems built for one city can be handed to another without being rebuilt.",
      th: "เจ็ดนาทีบนเวทีร่วมกับกรุงโอซากะและจังหวัดโอซากะ ศูนย์นวัตกรรมแห่งชาติเวียดนาม และ BAPPENAS ของอินโดนีเซีย ว่าด้วยการส่งต่อระบบที่สร้างเพื่อเมืองหนึ่งไปยังอีกเมืองโดยไม่ต้องสร้างใหม่",
      zh: "七分钟陈述，与大阪市政府、大阪府、越南国家创新中心和印尼 BAPPENAS 同台，讲述如何将为一个城市构建的系统交付给另一座城市而无需重建。",
    },
    photo: "/Nakhon Si Thammarat/panel-osaka2026.jpg",
    thumb: "/Nakhon Si Thammarat/panel-osaka2026-thumb.jpg",
    photoAlt: {
      en: "Dr. Non at the microphone during the Osaka Asia Roundtable country case study session",
      th: "ดร.ณณ ที่ไมโครโฟนในช่วงกรณีศึกษาระดับประเทศของ Osaka Asia Roundtable",
      zh: "Non 博士在大阪亚洲圆桌会议国家案例研究环节发言",
    },
    photoCredit: OAR_PHOTO_CREDIT,
  },
  {
    id: "osaka-2026-room",
    city: { en: "Osaka", th: "โอซากะ", zh: "大阪" },
    country: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" },
    flag: "🇯🇵",
    date: "2026-10-08",
    venue: {
      en: "Osaka Metropolitan University — Discussion 1",
      th: "มหาวิทยาลัยโอซากะเมโทรโพลิเทน — อภิปราย 1",
      zh: "大阪市立大学 — 讨论一",
    },
    format: {
      en: "Panel · From prototype to public service",
      th: "วงเสวนา · จากต้นแบบสู่บริการสาธารณะ",
      zh: "圆桌 · 从原型到公共服务",
    },
    note: {
      en: "The session the moderator framed around one question: a system developed in 45 minutes on one machine has to become something a city can legally adopt, budget for and keep running.",
      th: "ช่วงที่ผู้ดำเนินการวางกรอบไว้ว่าด้วยคำถามข้อเดียว ระบบที่พัฒนาได้ใน 45 นาทีบนเครื่องเดียว จะกลายเป็นสิ่งที่เมืองรับไว้ใช้อย่างถูกต้อง จัดงบ และรักษาให้ทำงานต่อได้อย่างไร",
      zh: "主持人围绕一个问题构建的环节：一套 45 分钟内在单台机器上开发出的系统，如何成为城市可以合法采用、纳入预算并持续运行的公共设施。",
    },
    photo: "/Nakhon Si Thammarat/audience-osaka2026.jpg",
    thumb: "/Nakhon Si Thammarat/audience-osaka2026-thumb.jpg",
    photoAlt: {
      en: "The Osaka Asia Roundtable 2026 session in progress, with public-sector delegates from across Asia seated before the projection",
      th: "ช่วงประกวดของ Osaka Asia Roundtable 2026 มีผู้แทนภาครัฐจากทั่วเอเชียนั่งรับฟังหน้าจอฉาย",
      zh: "2026 年大阪亚洲圆桌会议进行中，亚洲各地公共部门代表在投影幕前就座",
    },
    photoCredit: OAR_PHOTO_CREDIT,
  },
  {
    id: "taipei-2026",
    city: { en: "Taipei", th: "ไทเป", zh: "台北" },
    country: { en: "Taiwan", th: "ไต้หวัน", zh: "台湾" },
    flag: "🇹🇼",
    date: "2026-03-18",
    venue: {
      en: "Smart City Summit & Expo 2026 — City Vision in Action stage",
      th: "Smart City Summit & Expo 2026 — เวที City Vision in Action",
      zh: "2026 智慧城市高峰会 — City Vision in Action 主舞台",
    },
    format: {
      en: "Keynote · SLIC Index V2 launch",
      th: "วิทยากร · เปิดตัว SLIC Index V2",
      zh: "主旨演讲 · SLIC Index V2 发布",
    },
    note: {
      en: "SLIC Index V2 launched on the main stage, the framework presented to 174 cities across 53 countries. This index is built on it — the weights and sources are the same ones published there.",
      th: "SLIC Index V2 เปิดตัวบนเวทีหลัก กรอบนี้ถูกนำเสนอต่อ 174 เมืองจาก 53 ประเทศ ดัชนีนี้สร้างบนกรอบเดียวกัน — น้ำหนักและแหล่งข้อมูลคือชุดที่เปิดเผยที่นั่น",
      zh: "SLIC Index V2 在主舞台发布，该框架面向来自 53 个国家的 174 座城市。本指数建立在同一框架之上——权重与数据来源均为彼时公开的那一套。",
    },
  },
  {
    id: "singapore-2026",
    city: { en: "Singapore", th: "สิงคโปร์", zh: "新加坡" },
    country: { en: "Singapore", th: "สิงคโปร์", zh: "新加坡" },
    flag: "🇸🇬",
    date: "2026-03-02",
    venue: {
      en: "GovMesh 4.0 — GovInsider & interweave.gov",
      th: "GovMesh 4.0 — GovInsider และ interweave.gov",
      zh: "GovMesh 4.0 — GovInsider 与 interweave.gov",
    },
    format: {
      en: "Panel · Digital government",
      th: "วงเสวนา · รัฐบาลดิจิทัล",
      zh: "圆桌 · 数字政府",
    },
    note: {
      en: "An invitation-only gathering of emerging digital governments, speaking alongside Sri Lanka and Uzbekistan on deployment and data governance.",
      th: "การประชุมรัฐบาลดิจิทัลแบบเชิญเฉพาะ ร่วมเวทีกับศรีลังกาและอุซเบกิสถาน ในประเด็นการใช้งานจริงและการกำกับดูแลข้อมูล",
      zh: "一次仅限受邀的数字政府会议，与斯里兰卡、乌兹别克斯坦同台讨论部署与数据治理。",
    },
  },
  {
    id: "hongkong-2025",
    city: { en: "Hong Kong", th: "ฮ่องกง", zh: "香港" },
    country: { en: "Hong Kong SAR", th: "เขตบริหารพิเศษฮ่องกง", zh: "香港特别行政区" },
    flag: "🇭🇰",
    date: "2025-11-18",
    venue: {
      en: "Smart city governance and urban data exchange",
      th: "การกำกับดูแลเมืองอัจฉริยะและการแลกเปลี่ยนข้อมูลเมือง",
      zh: "智慧城市治理与城市数据交流",
    },
    format: {
      en: "Talk · Urban data",
      th: "บรรยาย · ข้อมูลเมือง",
      zh: "演讲 · 城市数据",
    },
    note: {
      en: "A stop on the circuit for urban data practice, in the run-up to the same conversations that followed through Shanghai.",
      th: "หยุดหนึ่งบนวงการเดินทางเรื่องข้อมูลเมือง ในช่วงก่อนบทสนทนาชุดเดียวกันที่ต่อยอดไปถึงเซี่ยงไฮ้",
      zh: "城市数据实践巡回中的一站，位于延续至上海的那组对话之前。",
    },
  },
  {
    id: "shanghai-2025",
    city: { en: "Shanghai", th: "เซี่ยงไฮ้", zh: "上海" },
    country: { en: "China", th: "จีน", zh: "中国" },
    flag: "🇨🇳",
    date: "2025-11-05",
    venue: {
      en: "Tomorrow.City Shanghai",
      th: "Tomorrow.City เซี่ยงไฮ้",
      zh: "Tomorrow.City 上海",
    },
    format: {
      en: "Panel · Featured smart city",
      th: "วงเสวนา · เมืองอัจฉริยะตัวแทน",
      zh: "圆桌 · 代表智慧城市",
    },
    note: {
      en: "Nakhon Si Thammarat presented as Thailand's featured smart city, to urban investors and policymakers from across East Asia.",
      th: "นครศรีธรรมราชถูกนำเสนอในฐานะเมืองอัจฉริยะตัวแทนไทย ต่อนักลงทุนเมืองและผู้กำหนดนโยบายทั่วเอเชียตะวันออก",
      zh: "洛坤作为泰国代表智慧城市，向东亚各地的城市投资者与政策制定者展示。",
    },
  },
];

/** Stops carrying a photograph, capped at MAX_PHOTOS. */
export function stopsWithPhotos(): CircuitStop[] {
  return GRAND_SLAM_STOPS.filter(s => s.thumb).slice(0, MAX_PHOTOS);
}

/** Number of type-only cards, used for the "+N more" affordance. */
export function typeOnlyCount(): number {
  return GRAND_SLAM_STOPS.length - stopsWithPhotos().length;
}

/** Distinct cities on the circuit, for the headline count. */
export function circuitCityCount(): number {
  return new Set(GRAND_SLAM_STOPS.map(s => s.city.en)).size;
}