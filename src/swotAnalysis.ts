// ---------------------------------------------------------------------------
// SWOT Analysis Generator — auto-generated from city data
// ---------------------------------------------------------------------------

import type { SmartCity } from "./types";
import { PILLAR_LABELS } from "./types";

export interface CitySWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export function generateSWOT(city: SmartCity, locale: "en" | "th" | "zh" = "en"): CitySWOT {
  const s: string[] = [];
  const w: string[] = [];
  const o: string[] = [];
  const t: string[] = [];

  const labels = PILLAR_LABELS[locale];

  // Strengths: pillars above 70
  for (const [pillar, score] of Object.entries(city.scores)) {
    if (score >= 75) s.push(`${labels[pillar as keyof typeof labels]} (${score}) — top-tier performance`);
    else if (score >= 65) s.push(`${labels[pillar as keyof typeof labels]} (${score}) — solid`);
  }

  // Weaknesses: pillars below 45
  for (const [pillar, score] of Object.entries(city.scores)) {
    if (score < 30) w.push(`${labels[pillar as keyof typeof labels]} (${score}) — critical gap`);
    else if (score < 45) w.push(`${labels[pillar as keyof typeof labels]} (${score}) — needs attention`);
  }

  // Status-based
  if (city.status === "certified") s.push("depa Smart City Local certification — official recognition");
  if (city.reality === "operational") s.push("Operational infrastructure — not just plans");
  if (city.reality === "planned") w.push("Plan-only — no built infrastructure yet");
  if (city.dataConfidence === "low") w.push("Insufficient data for precise assessment");

  // Metrics-based
  if (city.metrics.gppPerCapita && city.metrics.gppPerCapita > 300000) s.push(`High GPP per capita (฿${(city.metrics.gppPerCapita / 1000).toFixed(0)}K)`);
  if (city.metrics.pm25Annual && city.metrics.pm25Annual > 35) t.push(`PM2.5 at ${city.metrics.pm25Annual} μg/m³ — exceeds WHO guidelines`);
  if (city.metrics.crimeRatePer100k && city.metrics.crimeRatePer100k > 200) t.push(`Crime rate ${city.metrics.crimeRatePer100k}/100K — safety concern`);
  if (city.metrics.greenCoverage && city.metrics.greenCoverage > 50) s.push(`Green coverage ${city.metrics.greenCoverage}% — strong environmental base`);

  // Regional opportunities
  if (city.region === "east") o.push("EEC zone proximity — BOI tax incentives, industrial investment");
  if (city.region === "south" && city.scores.hospitality > 60) o.push("Tourism potential — Andaman/Gulf coast appeal");
  if (city.region === "northeast") o.push("Isan economic corridor — growing logistics and agriculture hub");
  if (city.smartDimensions.includes("energy")) o.push("Smart Energy focus — green bond eligibility");
  if (city.smartDimensions.includes("mobility")) o.push("Smart Mobility focus — transit-oriented development potential");
  if (city.smartDimensions.length >= 5) o.push(`Covers ${city.smartDimensions.length}/7 smart dimensions — comprehensive scope`);

  // Threat assessment
  if (city.region === "south" && city.scores.safety < 50) t.push("Security situation in deep south");
  if (city.region === "north" && city.metrics.pm25Annual && city.metrics.pm25Annual > 30) t.push("Seasonal burning haze — recurring air quality crisis");
  if (city.scores.economy < 50 && city.scores.livability < 50) t.push("Economic stagnation risk — low income + low livability");

  // Opportunity from weaknesses
  if (city.scores.digital < 40) o.push("Digital infrastructure gap = room for rapid improvement with right investment");
  if (city.tier === "beta") o.push("Close to Alpha threshold — targeted investment could push tier upgrade");

  // Ensure at least one item per category
  if (s.length === 0) s.push("Participation in Thailand's national smart city program");
  if (w.length === 0) w.push("No critical weaknesses identified");
  if (o.length === 0) o.push("National 105-city target by 2027 — government support available");
  if (t.length === 0) t.push("Competition from neighboring cities for limited smart city funding");

  return { strengths: s.slice(0, 4), weaknesses: w.slice(0, 4), opportunities: o.slice(0, 4), threats: t.slice(0, 4) };
}
