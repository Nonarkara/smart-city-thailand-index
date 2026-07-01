// Source: src/cityPresentation.ts (live at github.com/Nonarkara/smart-city-thailand-index)
// The translate() helper every trilingual string in the app calls through. One function, three languages, no missing-locale fallback bugs.
// ---------------------------------------------------------------------------

import { DIMENSION_LABELS } from "./types";
import type { CityReality, CityStatus, Locale, SmartCity, SmartDimension } from "./types";
import { CITY_NAME_ZH, CITY_TAGLINE_ZH, PROVINCE_ZH } from "./cityNamesZh";

export function translate(
  locale: Locale,
  copy: { en: string; th: string; zh: string },
): string {
  if (locale === "th") return copy.th;
  if (locale === "zh") return copy.zh;
  return copy.en;
}

export function getCityName(city: SmartCity, locale: Locale): string {
  if (locale === "th") return city.nameTh;
  if (locale === "zh") return CITY_NAME_ZH[city.id] ?? city.nameEn;
  return city.nameEn;
}

export function getProvinceName(city: SmartCity, locale: Locale): string {
  if (locale === "th") return city.provinceTh;
  if (locale === "zh") return PROVINCE_ZH[city.province] ?? city.province;
  return city.province;
}

const REGISTERED_TAGLINE_EN = "Promotion zone — awaiting sufficient data for full assessment.";
const REGISTERED_TAGLINE_ZH = "推广区域——等待充足数据进行全面评估。";

export function getCityTagline(city: SmartCity, locale: Locale): string {
  if (locale === "th") return city.taglineTh;
  if (locale === "zh") {
    if (CITY_TAGLINE_ZH[city.id]) return CITY_TAGLINE_ZH[city.id];
    if (city.tagline === REGISTERED_TAGLINE_EN) return REGISTERED_TAGLINE_ZH;
    return city.tagline;
  }
  return city.tagline;
}

export function getCityStatusLabel(status: CityStatus, locale: Locale): string {
  if (status === "certified") {
    return translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" });
  }
  if (status === "registered") {
    return translate(locale, { en: "Registered", th: "ขึ้นทะเบียน", zh: "登记中" });
  }
  return translate(locale, { en: "Promotion", th: "ส่งเสริม", zh: "推广" });
}

export function getCityRealityLabel(reality: CityReality, locale: Locale): string {
  if (reality === "operational") {
    return translate(locale, { en: "Operational", th: "ใช้งานจริง", zh: "已运行" });
  }
  if (reality === "partial") {
    return translate(locale, { en: "Partial", th: "บางส่วน", zh: "部分落实" });
  }
  return translate(locale, { en: "Plan only", th: "แผนเท่านั้น", zh: "仅有规划" });
}

export function getDimensionChipLabel(dimension: SmartDimension, locale: Locale): string {
  const label = DIMENSION_LABELS[locale][dimension];

  if (locale === "en") return label.replace(/^Smart\s+/, "").trim();
  if (locale === "th") return label.replace(/อัจฉริยะ/g, "").trim();
  return label.replace(/^智慧/, "").trim();
}
