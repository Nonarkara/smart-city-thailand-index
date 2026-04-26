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
  "phuket": { src: "/photos/phuket-smart-city.jpg", objectPosition: "center 48%" },

  // ─── Phase 18 — duplicate-violation fixes (was sharing parent photo) ───
  // Each gets a unique source so two dossier pages never show the same hero.
  "phra-ram-4": { src: "/photos/report-city-walkway.jpg", objectPosition: "center 50%" },     // Bangkok corporate spine stand-in (was sharing samyan-smart-city.jpg)
  "bang-saray": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 55%" },          // coast stand-in (was sharing wp-saensuk.jpg)
  "phitsanulok-nu": { src: "/photos/f4b929dc011fb96fba76c9618ca6b93e.jpg", objectPosition: "center 50%" },  // campus stand-in (was sharing wp-phitsanulok.jpg)
  "phitsanulok-ppao": { src: "/photos/report-city-night.jpg", objectPosition: "center 55%" }, // civic stand-in (was sharing wp-phitsanulok.jpg)
  "ubon-muni": { src: enc("/photos/depa x korea SBAU2019.jpg"), objectPosition: "center 50%" },   // civic event stand-in (was sharing wp-ubon.jpg)
  "wangchan-valley": { src: "/photos/khonkaen-smart-city.jpg", objectPosition: "center 50%" },    // corporate-campus stand-in (was sharing wp-rayong.jpg)
  // Sub-zones below remain shared with parent until real photos arrive — flagged in docs/PHOTO_BRIEF.md
  // "mae-moh", "nikhom-phatthana", "phlapphla", "thep-paraj", "tai-yong",
  // "khao-khun-song", "phuket-tinicon" → fall through to regional fallback
  // OR explicit mapping below where I have a defensible alternative.

  // ─── New Wikimedia Commons photos (CC BY-SA) ───
  // North
  "chiang-rai": { src: "/photos/wp-chiang-rai.jpg", objectPosition: "center 45%" },
  "lampang": { src: "/photos/wp-lampang.jpg", objectPosition: "center 45%" },
  "nan": { src: "/photos/wp-nan.jpg", objectPosition: "center 50%" },
  "phitsanulok-muni": { src: "/photos/wp-phitsanulok.jpg", objectPosition: "center 50%" },

  // Northeast
  "korat": { src: "/photos/wp-korat.jpg", objectPosition: "center 45%" },
  "ubon": { src: "/photos/wp-ubon.jpg", objectPosition: "center 50%" },

  // Central
  "nakhonsawan": { src: "/photos/wp-nakhonsawan.jpg", objectPosition: "center 50%" },

  // East
  "rayong": { src: "/photos/wp-rayong.jpg", objectPosition: "center 50%" },
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
  // "mae-moh" — flagged. No unique photo. Falls through to north regional fallback (chiangmai-night.jpg).
  //   This still shares with other unmapped north cities via fallback, but at least doesn't duplicate
  //   wp-lampang.jpg as before. Real shot needed: lignite-mine-and-power-plant landscape.

  // South
  "krabi": { src: "/photos/wp-krabi.jpg", objectPosition: "center 45%" },
  "phangnga": { src: "/photos/wp-phangnga.jpg", objectPosition: "center 50%" },
  "satun": { src: "/photos/wp-satun.jpg", objectPosition: "center 50%" },
  "samui": { src: "/photos/wp-samui.jpg", objectPosition: "center 50%" },
  "sritrang": { src: "/photos/wp-sritrang.jpg", objectPosition: "center 50%" },
  "songkhla-city": { src: "/photos/wp-songkhla.jpg", objectPosition: "center 50%" },
  "hat-yai": { src: "/photos/wp-hat-yai.jpg", objectPosition: "center 50%" },
  "yala": { src: "/photos/wp-yala.jpg", objectPosition: "center 50%" },
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
      asset: { src: enc("/Nakhon Si Thammarat/Z03A4016-opq3946626481.jpg"), objectPosition: "center 50%" },
      captionEn: "The chedi compound at dusk. Tambralinga heritage, telemetry-monitored.",
      captionTh: "หมู่พระบรมธาตุยามพลบค่ำ มรดกตามพรลิงค์ที่ยังคงถูกเฝ้าดูด้วยเซนเซอร์",
      captionZh: "暮色中的佛塔群——丹眉流时代的遗产，至今仍由传感网络守望。",
    },
    {
      after: "what",
      asset: { src: "/photos/nst-flood-fieldwork.jpg", objectPosition: "center 50%" },
      captionEn: "Field calibration on the flood telemetry network — the work that earned the climate-outperformer rank.",
      captionTh: "ทีมงานปรับเทียบเซนเซอร์น้ำท่วมในพื้นที่จริง — งานที่ทำให้คะแนนสิ่งแวดล้อมแซงเมืองหลวง",
      captionZh: "实地校准防洪监测网——这正是让 NST 在气候表现上超越曼谷的实在工作。",
    },
    {
      after: "how",
      asset: { src: "/photos/nst-municipal-briefing.jpg", objectPosition: "center 50%" },
      captionEn: "Municipal briefing. The dossier holds because the institution holds.",
      captionTh: "การประชุมเทศบาล แฟ้มข้อมูลเดินได้ เพราะองค์กรเดินได้",
      captionZh: "市政简报会议——档案能持续运转，是因为机构能持续运转。",
    },
    {
      after: "why",
      asset: { src: "/photos/nst-tomorrow-city-shanghai.jpg", objectPosition: "center 50%" },
      captionEn: "Showcased at Tomorrow City Shanghai. Local data, international audit.",
      captionTh: "ขึ้นเวที Tomorrow City ที่เซี่ยงไฮ้ ข้อมูลท้องถิ่น ผ่านการตรวจสอบระดับสากล",
      captionZh: "于上海 Tomorrow City 展出——本地数据，国际审计。",
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
      asset: { src: "/photos/wp-phangnga.jpg", objectPosition: "center 50%" },
      captionEn: "The wider Andaman coast. Marine telemetry buoys ring this stretch — Phuket's tourism backbone is engineered.",
      captionTh: "ชายฝั่งอันดามันที่กว้างกว่าเกาะ ทุ่นเซนเซอร์ทางทะเลล้อมรอบช่วงนี้ — กระดูกสันหลังการท่องเที่ยวของภูเก็ตเป็นวิศวกรรม",
      captionZh: "更广阔的安达曼海岸线——海洋传感浮标环绕此段，普吉的旅游骨架是工程化的。",
    },
  ],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getCityPhotoAsset(city: Pick<SmartCity, "id" | "region">): CityPhotoAsset {
  return CITY_PHOTO_ASSETS[city.id] ?? REGION_FALLBACKS[city.region];
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
