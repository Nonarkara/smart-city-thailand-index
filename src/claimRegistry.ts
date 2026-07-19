// ---------------------------------------------------------------------------
// Claim Registry — every displayed number traceable to a source
// ---------------------------------------------------------------------------
// Confidence levels:
//   "verified"        — confirmed against official source, recently
//   "derived"         — computed from other claims in this registry
//   "field-estimated" — Dr Non field observation / workshop intelligence
//   "stale"           — source exists but observedAt is >12 months old
// ---------------------------------------------------------------------------

export type ClaimConfidence = "verified" | "derived" | "field-estimated" | "stale";

export interface Claim {
  id: string;
  value: string | number;
  label: { en: string; th: string; zh: string };
  source: string;
  sourceUrl?: string;
  observedAt: string;     // ISO date
  confidence: ClaimConfidence;
  notes?: string;
}

export const claimRegistry: Claim[] = [
  {
    id: "certified-cities",
    value: 37,
    label: { en: "Certified Cities", th: "เมืองที่ได้รับการรับรอง", zh: "认证城市" },
    source: "depa Smart City Office — official registry update for January 2026",
    sourceUrl: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    observedAt: "2026-01-01",
    confidence: "verified",
    notes: "Official depa registry lists 37 certified smart cities as of January 2026.",
  },
  {
    id: "promotion-zones",
    value: 190,
    label: { en: "Promotion Cities", th: "เมืองเขตส่งเสริม", zh: "推广城市" },
    source: "depa Smart City Office — official registry update for January 2026",
    sourceUrl: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    observedAt: "2026-01-01",
    confidence: "verified",
    notes: "Official depa registry lists 190 promotion cities as of January 2026. Re-verified against the live depa registry page on 2026-07-19 (227 proposals / 37 certified / 190 promotion zones). Supersedes the earlier 173 figure from the 2025 programme stats.",
  },
  {
    id: "proposals",
    value: 227,
    label: { en: "Total Proposals", th: "ข้อเสนอทั้งหมด", zh: "总提案数" },
    source: "depa Smart City Office — official registry update for January 2026",
    sourceUrl: "https://www.depa.or.th/th/smart-city-plan/existing-smart-city",
    observedAt: "2026-01-01",
    confidence: "verified",
    notes: "Official depa registry lists 227 submitted smart city proposals as of January 2026.",
  },
  {
    id: "target-smart-cities-2024-2027",
    value: 105,
    label: { en: "Plan Target (2024-2027)", th: "เป้าหมายแผนปี 2567-2570", zh: "2024-2027 计划目标" },
    source: "depa official article on Thailand's smart city target for the 2024-2027 plan period",
    sourceUrl: "https://www.depa.or.th/en/article-view/20240701_02",
    observedAt: "2024-07-01",
    confidence: "verified",
    notes: "depa states the government target is at least 105 livable smart cities during the 2024-2027 period.",
  },
  {
    id: "alpha-tier",
    value: 9,
    label: { en: "Alpha Tier Cities", th: "เมืองระดับ Alpha", zh: "Alpha 层级城市" },
    source: "SCITI composite scoring — cities with compositeScore ≥ 65 (alpha threshold) in src/cityData.ts",
    observedAt: "2026-07-19",
    confidence: "derived",
    notes: "Computed from the index: Phuket 72.6, Samyan (Bangkok) 71.9, Chiang Mai Old Town 67.0, CMU Smart City 66.9, Phra Ram 4 66.8, Khon Kaen 66.6, Rattanakosin 66.4, Klong Phadung 65.4, Krabi 65.0.",
  },
  {
    id: "dead-links",
    value: "21%",
    label: { en: "Dead Link Rate", th: "อัตราลิงก์เสีย", zh: "失效链接率" },
    source: "SCITI crawl of Open Data targets across 37 certified cities",
    observedAt: "2026-04-05",
    confidence: "field-estimated",
    notes: "Manual spot-check on 37 certified city Open Data portals. Dead link rate ~21%.",
  },
  {
    id: "citizen-usage",
    value: "12%",
    label: { en: "Citizen Usage", th: "การใช้งานจริงโดยพลเมือง", zh: "市民使用率" },
    source: "SCITI field assessment — app download/DAU proxies from Play Store / App Store public data",
    observedAt: "2026-03-01",
    confidence: "field-estimated",
    notes: "Average across smart city apps with publicly trackable download counts. Excludes Traffy Fondue (national, not city-scoped).",
  },
  {
    id: "sentiment-frustration",
    value: "68%",
    label: { en: "Citizen Frustration", th: "ความหงุดหงิดของพลเมือง", zh: "市民沮丧率" },
    source: "Social listening — Thai Twitter/X + Pantip search for smart city app complaints",
    observedAt: "2026-02-01",
    confidence: "field-estimated",
    notes: "Non-systematic sampling. Directionally correct, not statistically rigorous.",
  },
  {
    id: "sentiment-hope",
    value: "22%",
    label: { en: "Citizen Hope", th: "ความหวังของพลเมือง", zh: "市民希望比例" },
    source: "Social listening — positive mentions of Traffy Fondue, Smart Bus, Khon Kaen health apps",
    observedAt: "2026-02-01",
    confidence: "field-estimated",
  },
  {
    id: "sentiment-indifference",
    value: "10%",
    label: { en: "Citizen Indifference", th: "ความเฉยเมยของพลเมือง", zh: "市民漠然比例" },
    source: "Social listening — zero mentions in targeted city hashtags",
    observedAt: "2026-02-01",
    confidence: "field-estimated",
  },
];

/** Look up a single claim by ID */
export function getClaim(id: string): Claim | undefined {
  return claimRegistry.find(c => c.id === id);
}

export function getClaimValue(id: string): Claim["value"] | undefined {
  return getClaim(id)?.value;
}

/** Confidence badge label for UI display */
export function confidenceLabel(c: ClaimConfidence): string {
  switch (c) {
    case "verified":        return "✓ Verified";
    case "derived":         return "∿ Derived";
    case "field-estimated": return "~ Estimated";
    case "stale":           return "⚠ Stale";
  }
}

/** Confidence badge CSS class */
export function confidenceClass(c: ClaimConfidence): string {
  switch (c) {
    case "verified":        return "claim-verified";
    case "derived":         return "claim-derived";
    case "field-estimated": return "claim-estimated";
    case "stale":           return "claim-stale";
  }
}
