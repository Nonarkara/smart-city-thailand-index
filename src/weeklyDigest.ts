// ---------------------------------------------------------------------------
// Editorial reading list — dated selections on the homepage
// ---------------------------------------------------------------------------
// The SCITI dataset is static, rebuilt once per edition. But smart-city
// conversation in Thailand is not — headlines, policy drops, Google Trends
// searches, city openings all move week to week. The weekly digest gives
// readers a dated route into sources, not a simulated live news feed.
//
// EDITORIAL RITUAL — every Monday:
//   1. Set `weekOf` to the actual editorial selection date (YYYY-MM-DD).
//   2. Pick one city and explain what the reader can investigate there.
//      Do not claim popularity, operating services, or outcomes without evidence.
//   3. Suggest a useful SCITI-adjacent research phrase. Any measured trend
//      requires a cited measurement, source, population and period.
//      Without those, the phrase is an editorial suggestion, not trend data.
//      Suggested searches link to the actual query, not an unrelated tool.
//   4. Pick one primary-source link. Use its real title and scope, trilingually.
//   5. `git commit -m "Weekly digest: YYYY-MM-DD" && git push`. GitHub
//      Pages redeploys. The selection age is not the underlying data age.
//
// No API, no scraper, no CI — just a human touching the file each Monday.
// Never use this selection date to imply real-time data or current operation.
// ---------------------------------------------------------------------------

import type { LocalizedText } from "./cityCdp";
import { WEEKLY_DIGEST_DATA } from "./dynamicWeeklyData";

export interface WeeklyDigest {
  weekOf: string; // ISO date — YYYY-MM-DD
  trendingCity: {
    cityId: string;
    note: LocalizedText;
  };
  trendingSearch: {
    phrase: LocalizedText;
    deltaLabel: LocalizedText;
    lensId?: string;
  };
  headline: {
    title: LocalizedText;
    gloss: LocalizedText;
    url: string;
  };
}

export const WEEKLY_DIGEST: WeeklyDigest = WEEKLY_DIGEST_DATA;

/**
 * Returns a short trilingual editorial-selection age label derived from
 * `weekOf`. Computed at render time so the stamp stays honest without
 * editing the data file. Falls back to the ISO date if parsing fails.
 */
export function formatWeeklyStamp(
  weekOf: string,
  locale: "en" | "th" | "zh",
): string {
  const parsed = Date.parse(weekOf);
  if (Number.isNaN(parsed)) return weekOf;
  const days = Math.floor((Date.now() - parsed) / 86_400_000);
  if (days < 0) {
    return locale === "th" ? `วันที่คัดอ่าน ${weekOf}` : locale === "zh" ? `选编日期 ${weekOf}` : `Selection dated ${weekOf}`;
  }
  if (days === 0) {
    return locale === "th" ? "คัดอ่านวันนี้" : locale === "zh" ? "今日选编" : "Selected today";
  }
  if (days === 1) {
    return locale === "th" ? "คัดอ่านเมื่อวาน" : locale === "zh" ? "昨日选编" : "Selected yesterday";
  }
  if (days < 7) {
    return locale === "th"
      ? `คัดอ่าน ${days} วันก่อน`
      : locale === "zh"
        ? `${days} 天前选编`
        : `Selected ${days} days ago`;
  }
  const weeks = Math.floor(days / 7);
  return locale === "th"
    ? `คัดอ่าน ${weeks} สัปดาห์ก่อน`
    : locale === "zh"
      ? `${weeks} 周前选编`
      : `Selected ${weeks} week${weeks === 1 ? "" : "s"} ago`;
}
