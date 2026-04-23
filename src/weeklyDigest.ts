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

export const WEEKLY_DIGEST: WeeklyDigest = {
  weekOf: "2026-04-20",
  trendingCity: {
    cityId: "khon-kaen",
    note: {
      en: "Khon Kaen LRT construction crossed the 60% mark this week — first trainset expected at the Tha Phra depot by Q3.",
      th: "การก่อสร้างรถไฟฟ้ารางเบา LRT ขอนแก่น คืบหน้าทะลุ 60% แล้วสัปดาห์นี้ — ขบวนรถชุดแรกคาดว่าจะถึงศูนย์ซ่อมบำรุงท่าพระภายในไตรมาส 3",
      zh: "本周孔敬轻轨施工进度突破 60%——首列列车预计第三季度抵达塔帕车辆段。",
    },
  },
  trendingSearch: {
    phrase: {
      en: '"smart city thailand retirement"',
      th: '"smart city thailand retirement"',
      zh: '"smart city thailand retirement"',
    },
    deltaLabel: {
      en: "↑ 38% vs last week",
      th: "↑ 38% เทียบสัปดาห์ก่อน",
      zh: "较上周 ↑ 38%",
    },
    lensId: "retirement",
  },
  headline: {
    title: {
      en: "depa announces 2026 Smart City Promotion Zone batch",
      th: "depa ประกาศรายชื่อเขตส่งเสริมเมืองอัจฉริยะ รอบปี 2569",
      zh: "depa 公布 2026 年度智慧城市推广区名单",
    },
    gloss: {
      en: "Six additional secondary cities enter the promotion pipeline, most of them in the Northeast.",
      th: "เมืองรองเพิ่มอีก 6 เมืองเข้าสู่เส้นทางการส่งเสริม โดยส่วนใหญ่อยู่ในภาคตะวันออกเฉียงเหนือ",
      zh: "新增六座二线城市进入推广管道，大多位于东北部。",
    },
    url: "https://www.depa.or.th/en/smartcity",
  },
};

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
