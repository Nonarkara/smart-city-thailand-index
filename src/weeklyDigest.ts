// ---------------------------------------------------------------------------
// Weekly digest — the "this week" strip on the homepage
// ---------------------------------------------------------------------------
// The SCITI dataset is static, rebuilt once per edition. But smart-city
// conversation in Thailand is not — headlines, policy drops, Google Trends
// searches, city openings all move week to week. The weekly digest gives
// the homepage a single living heartbeat.
//
// EDITORIAL RITUAL — every Monday:
//   1. Update `weekOf` to today's ISO date (YYYY-MM-DD).
//   2. Pick one trending city — a one-line, trilingual reason it's on
//      everybody's tongue this week (news, Google Trends, ministry drop).
//   3. Pull the highest-velocity SCITI-adjacent search phrase from
//      trends.google.com (Thailand, past 7 days). Paste the phrase,
//      note the delta, optionally deep-link to the matching lens on
//      /rankings via `lensId` (see src/presetLenses.ts for ids).
//   4. Pick one external news/policy link. One-line gloss, trilingual.
//   5. `git commit -m "Weekly digest: YYYY-MM-DD" && git push`. GitHub
//      Pages redeploys. The "Updated N days ago" stamp resets.
//
// No API, no scraper, no CI — just a human touching the file each Monday.
// That's the "illusion of real time" the index runs on.
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
 * Returns a short trilingual "Updated N days/weeks ago" label derived from
 * `weekOf`. Computed at render time so the stamp stays honest without
 * editing the data file. Falls back to the ISO date if parsing fails.
 */
export function formatWeeklyStamp(
  weekOf: string,
  locale: "en" | "th" | "zh",
): string {
  const parsed = Date.parse(weekOf);
  if (Number.isNaN(parsed)) return weekOf;
  const days = Math.max(0, Math.floor((Date.now() - parsed) / 86_400_000));
  if (days === 0) {
    return locale === "th" ? "อัปเดตวันนี้" : locale === "zh" ? "今日更新" : "Updated today";
  }
  if (days === 1) {
    return locale === "th" ? "อัปเดตเมื่อวาน" : locale === "zh" ? "昨日更新" : "Updated yesterday";
  }
  if (days < 7) {
    return locale === "th"
      ? `อัปเดต ${days} วันก่อน`
      : locale === "zh"
        ? `${days} 天前更新`
        : `Updated ${days} days ago`;
  }
  const weeks = Math.floor(days / 7);
  return locale === "th"
    ? `อัปเดต ${weeks} สัปดาห์ก่อน`
    : locale === "zh"
      ? `${weeks} 周前更新`
      : `Updated ${weeks} week${weeks === 1 ? "" : "s"} ago`;
}
