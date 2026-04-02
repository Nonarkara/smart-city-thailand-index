import { DIMENSION_LABELS } from "./types";
import type { CityReality, CityStatus, Locale, SmartCity, SmartDimension } from "./types";

export function translate(
  locale: Locale,
  copy: { en: string; th: string; zh: string },
): string {
  if (locale === "th") return copy.th;
  if (locale === "zh") return copy.zh;
  return copy.en;
}

export function getCityName(city: SmartCity, locale: Locale): string {
  return locale === "th" ? city.nameTh : city.nameEn;
}

export function getProvinceName(city: SmartCity, locale: Locale): string {
  return locale === "th" ? city.provinceTh : city.province;
}

export function getCityTagline(city: SmartCity, locale: Locale): string {
  return locale === "th" ? city.taglineTh : city.tagline;
}

export function getCityStatusLabel(status: CityStatus, locale: Locale): string {
  return status === "certified"
    ? translate(locale, { en: "Certified", th: "รับรอง", zh: "认证" })
    : translate(locale, { en: "Promotion", th: "ส่งเสริม", zh: "推广" });
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
