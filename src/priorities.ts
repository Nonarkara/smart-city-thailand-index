import type { CityScores, Locale } from "./types";

export type PriorityPillar = "livability" | "economy" | "safety" | "wellbeing" | "environment" | "hospitality";

export interface PriorityPillarDefinition {
  id: PriorityPillar;
  color: string;
  label: Record<Locale, string>;
}

export const PRIORITY_PILLARS: PriorityPillarDefinition[] = [
  { id: "livability", color: "#1A7D72", label: { en: "Livability", th: "ความน่าอยู่", zh: "宜居" } },
  { id: "economy", color: "#D4832F", label: { en: "Economy", th: "เศรษฐกิจ", zh: "经济" } },
  { id: "safety", color: "#2B4FAF", label: { en: "Safety", th: "ความปลอดภัย", zh: "安全" } },
  { id: "wellbeing", color: "#C94444", label: { en: "Wellbeing", th: "คุณภาพชีวิต", zh: "福祉" } },
  { id: "environment", color: "#3D8B3D", label: { en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" } },
  { id: "hospitality", color: "#8B6914", label: { en: "Hospitality", th: "อัธยาศัย", zh: "人文" } },
];

export const PRIORITY_TOTAL = 100;
export const PRIORITY_MIN_WEIGHT = 2;
export const PRIORITY_MAX_WEIGHT = 60;

export const DEFAULT_PRIORITY_WEIGHTS: Record<PriorityPillar, number> = {
  livability: 22,
  economy: 22,
  safety: 16,
  wellbeing: 16,
  environment: 12,
  hospitality: 12,
};

export function computePriorityScore(
  scores: CityScores,
  weights: Record<PriorityPillar, number>,
): number {
  const weightedScore = PRIORITY_PILLARS.reduce((sum, pillar) => {
    return sum + scores[pillar.id] * weights[pillar.id];
  }, 0);
  const totalWeight = PRIORITY_PILLARS.reduce((sum, pillar) => {
    return sum + weights[pillar.id];
  }, 0);

  return totalWeight > 0 ? weightedScore / totalWeight : 0;
}

export function redistributePriorityWeights(
  weights: Record<PriorityPillar, number>,
  target: PriorityPillar,
  rawValue: number,
): Record<PriorityPillar, number> {
  const nextValue = Math.max(PRIORITY_MIN_WEIGHT, Math.min(PRIORITY_MAX_WEIGHT, rawValue));
  if (nextValue === weights[target]) return weights;

  const otherPillars = PRIORITY_PILLARS.filter(pillar => pillar.id !== target);
  const otherTotal = otherPillars.reduce((sum, pillar) => sum + weights[pillar.id], 0);
  const nextWeights = { ...weights, [target]: nextValue };

  let remaining = PRIORITY_TOTAL - nextValue;
  otherPillars.forEach((pillar, index) => {
    if (index === otherPillars.length - 1) {
      nextWeights[pillar.id] = Math.max(PRIORITY_MIN_WEIGHT, remaining);
      return;
    }

    const proportionalShare = Math.round((weights[pillar.id] / otherTotal) * (PRIORITY_TOTAL - nextValue));
    nextWeights[pillar.id] = Math.max(PRIORITY_MIN_WEIGHT, proportionalShare);
    remaining -= nextWeights[pillar.id];
  });

  return nextWeights;
}

