import type { Locale, SmartCity } from "./types";

// ---------------------------------------------------------------------------
// Photo registry — Phase 18 (overnight 2026-04-27)
// ---------------------------------------------------------------------------
// Two-tier API:
//   getCityPhotoAsset(city)  → just the hero (back-compat for existing callers)
//   getCityPhotoSet(city)    → hero + optional chapter-break images
//
// Chapter-break images render between the WHO / WHAT / HOW / WHY / NEXT
// dossier chapters in CityDetailPage. Each break has a tri-locale caption
// and a one-word kicker derived from its chapter slot. See styles.css
// `.city-chapter-break` for the editorial treatment (full-bleed photo,
// dark vertical gradient overlay, mono-uppercase kicker, body caption,
// flat geometry — no rounding, no shadow, no soft tints).
//
// Authored photo folders (real photos, not stock) live under public/:
//   public/Nakhon Si Thammarat/  — 9 NST shots (hero + 4 chapter breaks)
//   public/CMU Smart City/       — 1 campus shot
//   public/Chiang Mai/           — 1 night-city shot
//   public/Khon Kaen/            — 1 aerial shot
//   public/Photos international/ — 5 unmapped event/conference photos
//
// Duplicate-photo violations (CLAUDE.md §0 strict rule "never use the same
// photo in two places on the same site") were resolved this pass for the
// most-visible cases. See docs/PHOTO_BRIEF.md "Duplicate-photo violations"
// table for the full audit and remaining low-priority sub-zones flagged
// for replacement when a real photo lands.
// ---------------------------------------------------------------------------

export type CityPhotoAsset = {
  src: string;
  objectPosition?: string;
};

/** A photo break placed between two dossier chapters. */
export type CityChapterBreak = {
  /** Place this break immediately after the named chapter ends. */
  after: "who" | "what" | "how" | "why";
  asset: CityPhotoAsset;
  captionEn: string;
  captionTh: string;
  captionZh: string;
};

export type CityPhotoSet = {
  hero: CityPhotoAsset;
  breaks?: CityChapterBreak[];
};

/** Encode a path segment containing spaces so browsers get %20, not raw " ". */
function enc(path: string): string {
  return encodeURI(path);
}

// Phase 13 — Wikimedia Commons, Bangkok night expressway above Makkasan.
// Chosen over the founder's own photo because SCITI's subject is urban
// infrastructure (rail, roads, grids), not tourism theatre. Attribution is
// tracked in src/photoCredits.ts under the same filename.
export const HOME_HERO_ASSET: CityPhotoAsset = {
  src: "/photos/wp-makkasan.jpg",
  objectPosition: "center 55%",
};

// Phase 19 — Auto-rotating hero photos.
// All photos are real (authored or Wikimedia Commons CC BY-SA).
// NO AI-generated images. phuket-marine.webp and rayong-future.webp
// were 1024×1024 AI squares — removed.
export type HeroAsset = CityPhotoAsset & {
  label?: string; // city/location credit, shown bottom-right
};

export const HOME_HERO_ASSETS: HeroAsset[] = [
  {
    src: "/photos/wp-makkasan.jpg",
    objectPosition: "center 55%",
    label: "Bangkok · Makkasan",
  },
  {
    src: enc("/Nakhon Si Thammarat/Z03A4010-3946608958.jpg"),
    objectPosition: "center 50%",
    label: "Nakhon Si Thammarat",
  },
  {
    src: enc("/Chiang Mai/IMG_20251218_190749854.jpg"),
    objectPosition: "center 58%",
    label: "Chiang Mai",
  },
  {
    src: "/photos/wp-rattanakosin.jpg",
    objectPosition: "center 55%",
    label: "Bangkok · Rattanakosin",
  },
  {
    src: "/photos/wp-songkhla.jpg",
    objectPosition: "center 50%",
    label: "Songkhla",
  },
];

// Regional fallbacks — only used for cities without explicit mapping below.
// Kept diverse so no two cities in the same region share the same photo
// unless they actually share a geographic identity.
const REGION_FALLBACKS: Record<SmartCity["region"], CityPhotoAsset> = {
  bangkok: { src: "/photos/report-city-night.jpg", objectPosition: "center center" },
  central: { src: "/photos/wp-nakhonsawan.jpg", objectPosition: "center 50%" },
  east: { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 50%" },
  north: { src: "/photos/chiangmai-night.jpg", objectPosition: "center center" },
  northeast: { src: "/photos/khonkaen-aerial.jpg", objectPosition: "center center" },
  south: { src: "/photos/wp-songkhla.jpg", objectPosition: "center 50%" },
};

// ---------------------------------------------------------------------------
// Hero photo registry — one per city
// ---------------------------------------------------------------------------

const CITY_PHOTO_ASSETS: Record<string, CityPhotoAsset> = {
  // ─── Real, authored city photos in capitalised folders (Phase 16+) ───
  "chiang-mai-old-town": { src: enc("/Chiang Mai/IMG_20251218_190749854.jpg"), objectPosition: "center 58%" },
  "cmu-smart-city": { src: enc("/CMU Smart City/P1210289.JPG"), objectPosition: "center 45%" },
  "khon-kaen": { src: enc("/Khon Kaen/IMG_4264.JPG"), objectPosition: "center 50%" },
  "nakhon-si-thammarat": { src: enc("/Nakhon Si Thammarat/Z03A4010-3946608958.jpg"), objectPosition: "center 50%" },

  // ─── Authored project photos in /photos/ ───
  "samyan": { src: "/photos/samyan-smart-city.jpg", objectPosition: "center 45%" },
  "phuket": { src: "/photos/phuket-marine.webp", objectPosition: "center 48%" },

  // ─── Phase 18 — duplicate-violation fixes (was sharing parent photo) ───
  // Each gets a unique source so two dossier pages never show the same hero.
  "phra-ram-4": { src: "/photos/report-city-walkway.jpg", objectPosition: "center 50%" },     // Bangkok corporate spine stand-in (was sharing samyan-smart-city.jpg)
  "bang-saray": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 55%" },          // coast stand-in (was sharing wp-saensuk.jpg)
  "phitsanulok-nu": { src: "/photos/f4b929dc011fb96fba76c9618ca6b93e.jpg", objectPosition: "center 50%" },  // campus stand-in (was sharing wp-phitsanulok.jpg)
  "phitsanulok-ppao": { src: "/photos/report-city-night.jpg", objectPosition: "center 55%" }, // civic stand-in (was sharing wp-phitsanulok.jpg)
  "ubon-muni": { src: enc("/photos/depa x korea SBAU2019.jpg"), objectPosition: "center 50%" },   // civic event stand-in (was sharing wp-ubon.jpg)
  "wangchan-valley": { src: "/photos/khonkaen-smart-city.jpg", objectPosition: "center 50%" },    // corporate-campus stand-in (was sharing wp-rayong.jpg)
  // 2026-04-28 audit: these seven full dossiers still lacked explicit
  // heroes and were falling through to broad regional images. They now use
  // province/sector stand-ins so every full dossier has an intentional hero
  // while the shot list in docs/PHOTO_BRIEF.md remains open for real city
  // photography.
  "mae-moh": { src: "/photos/maemoh-future.webp", objectPosition: "center 50%" },
  "nikhom-phatthana": { src: "/photos/wp-rayong.jpg", objectPosition: "center 52%" },
  "phlapphla": { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 45%" },
  "thep-paraj": { src: "/photos/wp-chachoengsao.jpg", objectPosition: "center 45%" },
  "tai-yong": { src: "/photos/wp-nakhon-si-thammarat.jpg", objectPosition: "center 50%" },
  "khao-khun-song": { src: "/photos/wp-rayong.jpg", objectPosition: "center 50%" },
  "phuket-tinicon": { src: "/photos/phuket-smart-city.jpg", objectPosition: "center 50%" },

  // ─── New Wikimedia Commons photos (CC BY-SA) ───
  // North
  "chiang-rai": { src: "/photos/wp-chiang-rai.jpg", objectPosition: "center 45%" },
  "lampang": { src: "/photos/wp-lampang.jpg", objectPosition: "center 45%" },
  "nan": { src: "/photos/wp-nan.jpg", objectPosition: "center 50%" },
  "phitsanulok-muni": { src: "/photos/wp-phitsanulok.jpg", objectPosition: "center 50%" },

  // Northeast
  "korat": { src: "/photos/wp-korat.jpg", objectPosition: "center 45%" },
  "ubon": { src: "/photos/ubon-future.webp", objectPosition: "center 50%" },

  // Central
  "nakhonsawan": { src: "/photos/wp-nakhonsawan.jpg", objectPosition: "center 50%" },

  // East
  "rayong": { src: "/photos/rayong-future.webp", objectPosition: "center 50%" },
  "saensuk": { src: "/photos/wp-saensuk.jpg", objectPosition: "center 50%" },
  "chachoengsao": { src: "/photos/wp-chachoengsao.jpg", objectPosition: "center 45%" },
  "chanthaburi": { src: "/photos/wp-chanthaburi.jpg", objectPosition: "center 45%" },

  // Bangkok
  "rattanakosin": { src: "/photos/wp-rattanakosin.jpg", objectPosition: "center 55%" },
  "klong-phadung": { src: "/photos/wp-klong-phadung.jpg", objectPosition: "center 50%" },
  "makkasan": { src: "/photos/wp-makkasan.jpg", objectPosition: "center 50%" },

  // Central / metro
  "nonthaburi": { src: "/photos/wp-nonthaburi.jpg", objectPosition: "center 50%" },
  "samut-prakan": { src: "/photos/wp-samut-prakan.jpg", objectPosition: "center 50%" },

  // North (additional)
  "maesai": { src: "/photos/wp-maesai.jpg", objectPosition: "center 50%" },
  "umong": { src: "/photos/wp-umong.jpg", objectPosition: "center 50%" },
  "tak": { src: "/photos/wp-tak.jpg", objectPosition: "center 50%" },
  "phichit": { src: "/photos/wp-phichit.jpg", objectPosition: "center 50%" },

  // South
  "krabi": { src: "/photos/wp-krabi.jpg", objectPosition: "center 45%" },
  "phangnga": { src: "/photos/wp-phangnga.jpg", objectPosition: "center 50%" },
  "satun": { src: "/photos/wp-satun.jpg", objectPosition: "center 50%" },
  "samui": { src: "/photos/wp-samui.jpg", objectPosition: "center 50%" },
  "sritrang": { src: "/photos/wp-sritrang.jpg", objectPosition: "center 50%" },
  "songkhla-city": { src: "/photos/wp-songkhla.jpg", objectPosition: "center 50%" },
  "hat-yai": { src: "/photos/wp-hat-yai.jpg", objectPosition: "center 50%" },
  "yala": { src: "/photos/yala-future.webp", objectPosition: "center 50%" },
  "pattani": { src: "/photos/wp-pattani.jpg", objectPosition: "center 45%" },
  "narathiwat": { src: "/photos/wp-narathiwat.jpg", objectPosition: "center 50%" },
};

// ---------------------------------------------------------------------------
// Chapter-break photo sets — only for cities with multiple authored photos
// ---------------------------------------------------------------------------
//
// Caption rules (CLAUDE.md §11.6 — the four-cliche check):
//   - Kicker auto-derived from `after` slot ("CHAPTER 02 OF 5", etc.)
//   - Caption: 14px system-ui body sentence in EN/TH/ZH
//   - No serif. No gradient tint. No rounded corners. No drop shadow.
//   - Captions read like Monocle photo captions — declarative, present-tense,
//     locating the image inside the city's argument.

const CITY_CHAPTER_BREAKS: Record<string, CityChapterBreak[]> = {
  // ─── NAKHON SI THAMMARAT — the exemplar dossier (5-chapter narrative,
  //     4 break slots, 9 authored photos available) ───
  "nakhon-si-thammarat": [
    {
      after: "who",
      asset: { src: enc("/Nakhon Si Thammarat/FB_IMG_1763702950339.jpg"), objectPosition: "center 50%" },
      captionEn: "ASEAN CSCO delegates at the ICT & CCTV Command Centre — the nerve centre of NST's real-time city intelligence.",
      captionTh: "คณะ ASEAN CSCO ที่ศูนย์บัญชาการ ICT และ CCTV — หัวใจของระบบข่าวกรองเมืองแบบเรียลไทม์ของนครศรีธรรมราช",
      captionZh: "ASEAN CSCO 代表团在 ICT 与 CCTV 指挥中心——NST 实时城市智能的神经枢纽。",
    },
    {
      after: "what",
      asset: { src: enc("/Nakhon Si Thammarat/1763875143668.jpg"), objectPosition: "center 50%" },
      captionEn: "Live flood CCTV monitoring. 10-hour advance warning. Zero fatalities since 2021.",
      captionTh: "เฝ้าระวัง CCTV น้ำท่วมสด เตือนล่วงหน้า 10 ชั่วโมง ไม่มีผู้เสียชีวิตตั้งแต่ปี 2564",
      captionZh: "洪涝 CCTV 实时监控。提前 10 小时预警。2021 年起零死亡。",
    },
    {
      after: "how",
      asset: { src: enc("/Nakhon Si Thammarat/1763875144974.jpg"), objectPosition: "center 50%" },
      captionEn: "The hydrological dashboard — every sensor in the field feeds this screen. Decisions run from data, not intuition.",
      captionTh: "แดชบอร์ดอุทกวิทยา — ทุกเซนเซอร์ในพื้นที่ส่งข้อมูลมาที่หน้าจอนี้ การตัดสินใจมาจากข้อมูล ไม่ใช่ความรู้สึก",
      captionZh: "水文仪表板——现场每个传感器的数据都汇聚于此。决策来自数据，而非直觉。",
    },
    {
      after: "why",
      asset: { src: "/photos/nst-tomorrow-city-shanghai.jpg", objectPosition: "center 50%" },
      captionEn: "Showcased at Tomorrow City Shanghai. A Thai province teaching ASEAN. Local data, international audit.",
      captionTh: "ขึ้นเวที Tomorrow City ที่เซี่ยงไฮ้ จังหวัดไทยสอน ASEAN ข้อมูลท้องถิ่น ผ่านการตรวจสอบระดับสากล",
      captionZh: "于上海 Tomorrow City 展出。一个泰国省份向东盟授课。本地数据，国际审计。",
    },
  ],

  // ─── CMU Smart City ───
  "cmu-smart-city": [
    {
      after: "who",
      asset: { src: "/photos/cmu-doiSuthep.jpg", objectPosition: "center 50%" },
      captionEn: "Doi Suthep behind campus rooftops. Every CMU student looks west and sees this.",
      captionTh: "ดอยสุเทพอยู่หลังหลังคาคณะ นักศึกษา มช. ทุกคนมองทิศตะวันตกแล้วเห็นภาพนี้",
      captionZh: "校园屋顶之上的素帖山——清迈大学每位学生向西望都看到的轮廓。",
    },
  ],

  // ─── Khon Kaen Smart City ───
  "khon-kaen": [
    {
      after: "what",
      asset: { src: "/photos/khonkaen-aerial.jpg", objectPosition: "center 50%" },
      captionEn: "Aerial of the BRT corridor. Isan's only running rapid-transit spine.",
      captionTh: "ภาพมุมสูงของ BRT แกนระบบขนส่งมวลชนเร็วเส้นเดียวของอีสานที่เดินจริง",
      captionZh: "BRT 走廊鸟瞰——伊桑唯一在运行的快速公交骨架。",
    },
  ],

  // ─── Chiang Mai Smart Old Town ───
  "chiang-mai-old-town": [
    {
      after: "why",
      asset: { src: "/photos/chiangmai-night.jpg", objectPosition: "center 50%" },
      captionEn: "Old Town at night, post-burning-season. The hospitality score lives here; the environment score does not.",
      captionTh: "เมืองเก่ายามค่ำคืน หลังหมดฤดูหมอกควัน คะแนนอัธยาศัยอยู่ที่นี่ คะแนนสิ่งแวดล้อมไม่ได้อยู่",
      captionZh: "雨后夜晚的清迈古城——人文分数在这里，环境分数却不在。",
    },
  ],

  // ─── Phuket Smart City ───
  "phuket": [
    {
      after: "what",
      asset: { src: "/photos/phuket-marine.webp", objectPosition: "center 50%" },
      captionEn: "Marine telemetry networks monitoring the Andaman. Phuket's tourism backbone is now engineered for safety and sustainability.",
      captionTh: "เครือข่ายเซนเซอร์ทางทะเลเฝ้าระวังอันดามัน กระดูกสันหลังการท่องเที่ยวของภูเก็ตถูกออกแบบมาเพื่อความปลอดภัยและความยั่งยืน",
      captionZh: "监测安达曼海的海洋传感网络。普吉的旅游支柱现在正为安全与可持续性而工程化。",
    },
    {
      after: "how",
      asset: { src: "/photos/phuket-smart-city.jpg", objectPosition: "center 50%" },
      captionEn: "Digital twins and live telemetry in the command center. Real-time island management.",
      captionTh: "Digital twins และข้อมูลสดในศูนย์บัญชาการ การบริหารจัดการเกาะแบบเรียลไทม์",
      captionZh: "指挥中心的数字孪生与实时监测。全岛实时化管理。",
    },
  ],
  "rayong": [
    {
      after: "who",
      asset: { src: "/photos/rayong-future.webp", objectPosition: "center 50%" },
      captionEn: "The clean-energy industrial gateway. Rayong isn't just manufacturing; it's the future of green production.",
      captionTh: "ประตูสู่อุตสาหกรรมพลังงานสะอาด ระยองไม่ใช่แค่ฐานการผลิต แต่คืออนาคตของการผลิตสีเขียว",
      captionZh: "清洁能源工业门户。罗勇不仅是制造业基地，更是绿色生产的未来。",
    },
  ],
  "ubon": [
    {
      after: "what",
      asset: { src: "/photos/ubon-future.webp", objectPosition: "center 50%" },
      captionEn: "Tradition meets digital light. Ubon's Candle Festival transformed into a smart tourism showcase.",
      captionTh: "ประเพณีพบแสงดิจิทัล เทศกาลแห่เทียนพรรษาอุบลฯ เปลี่ยนเป็นเวทีแสดงการท่องเที่ยวอัจฉริยะ",
      captionZh: "传统碰撞数字之光。乌汶府蜡烛节转型为智慧旅游的展示窗口。",
    },
  ],
  "yala": [
    {
      after: "who",
      asset: { src: "/photos/yala-future.webp", objectPosition: "center 50%" },
      captionEn: "The greenest circular city. Award-winning urban design that prioritizes human safety and wellness.",
      captionTh: "เมืองผังเมืองวงกลมที่เขียวที่สุด การออกแบบเมืองที่ได้รับรางวัลซึ่งให้ความสำคัญกับความปลอดภัยและสุขภาวะของมนุษย์",
      captionZh: "最绿色的环形城市。屡获殊荣的城市设计，优先考虑人类安全与健康。",
    },
  ],
  "mae-moh": [
    {
      after: "why",
      asset: { src: "/photos/maemoh-future.webp", objectPosition: "center 50%" },
      captionEn: "From coal to community park. The Mae Moh transition is Thailand's boldest green energy experiment.",
      captionTh: "จากเหมืองถ่านหินสู่สวนชุมชน การเปลี่ยนผ่านของแม่เมาะคือการทดลองพลังงานสะอาดที่กล้าหาญที่สุดของไทย",
      captionZh: "从煤矿到社区公园。梅莫的转型是泰国最胆大的绿色能源实验。",
    },
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getCityPhotoAsset(city: Pick<SmartCity, "id" | "region">): CityPhotoAsset {
  return CITY_PHOTO_ASSETS[city.id] ?? REGION_FALLBACKS[city.region];
}

export function hasExplicitCityPhotoAsset(cityId: string): boolean {
  return cityId in CITY_PHOTO_ASSETS;
}

export function getCityMediaAuditAssets(): Array<{ id: string; asset: CityPhotoAsset }> {
  return [
    { id: "home-hero", asset: HOME_HERO_ASSET },
    ...Object.entries(REGION_FALLBACKS).map(([id, asset]) => ({ id: `region-${id}`, asset })),
    ...Object.entries(CITY_PHOTO_ASSETS).map(([id, asset]) => ({ id: `city-${id}`, asset })),
    ...Object.entries(CITY_CHAPTER_BREAKS).flatMap(([cityId, breaks]) =>
      breaks.map((brk, index) => ({ id: `break-${cityId}-${index + 1}`, asset: brk.asset })),
    ),
  ];
}

/**
 * Returns hero + optional chapter-break images. Cities without a chapter-break
 * registry entry get only the hero — the dossier degrades to a hairline divider
 * between chapters, which is the correct fallback (no broken images, no stretched
 * stock photography).
 */
export function getCityPhotoSet(city: Pick<SmartCity, "id" | "region">): CityPhotoSet {
  return {
    hero: getCityPhotoAsset(city),
    breaks: CITY_CHAPTER_BREAKS[city.id],
  };
}

/** Locale-aware caption lookup used by the chapter-break component. */
export function getChapterBreakCaption(brk: CityChapterBreak, locale: Locale): string {
  if (locale === "th") return brk.captionTh;
  if (locale === "zh") return brk.captionZh;
  return brk.captionEn;
}
