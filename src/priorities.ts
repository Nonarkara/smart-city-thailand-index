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

  const otherPillars = PRIORITY_PILLARS
    .filter(pillar => pillar.id !== target)
    .map(pillar => pillar.id);
  const nextWeights = { ...weights, [target]: nextValue };

  otherPillars.forEach(pillar => {
    nextWeights[pillar] = PRIORITY_MIN_WEIGHT;
  });

  let remaining = PRIORITY_TOTAL - nextValue - (otherPillars.length * PRIORITY_MIN_WEIGHT);
  if (remaining <= 0) return nextWeights;

  let activePillars = [...otherPillars];

  while (remaining > 0 && activePillars.length > 0) {
    const basisTotal = activePillars.reduce((sum, pillar) => {
      return sum + Math.max(0, weights[pillar] - PRIORITY_MIN_WEIGHT, 1);
    }, 0);

    const allocations = activePillars.map(pillar => {
      const capacity = PRIORITY_MAX_WEIGHT - nextWeights[pillar];
      const basis = Math.max(0, weights[pillar] - PRIORITY_MIN_WEIGHT, 1);
      const rawShare = remaining * (basis / basisTotal);
      const wholeShare = Math.min(capacity, Math.floor(rawShare));

      return {
        pillar,
        capacity,
        fraction: rawShare - Math.floor(rawShare),
        wholeShare,
      };
    });

    let allocated = 0;
    allocations.forEach(({ pillar, wholeShare }) => {
      nextWeights[pillar] += wholeShare;
      allocated += wholeShare;
    });
    remaining -= allocated;

    if (remaining <= 0) break;

    let progressed = false;
    allocations
      .filter(({ capacity, wholeShare }) => capacity > wholeShare)
      .sort((left, right) => right.fraction - left.fraction)
      .forEach(({ pillar }) => {
        if (remaining <= 0 || nextWeights[pillar] >= PRIORITY_MAX_WEIGHT) return;
        nextWeights[pillar] += 1;
        remaining -= 1;
        progressed = true;
      });

    if (!progressed) break;

    activePillars = activePillars.filter(pillar => nextWeights[pillar] < PRIORITY_MAX_WEIGHT);
  }

  return nextWeights;
}
