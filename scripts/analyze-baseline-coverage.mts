/**
 * Diagnostic: how much of the depa 7-dimension model is actually measured?
 *
 * Run with:  ./node_modules/.bin/esbuild scripts/analyze-baseline-coverage.mts --bundle --platform=node --format=esm --outfile=/tmp/coverage.mjs && node /tmp/coverage.mjs
 *
 * (vite-node is not installed in this repo, and `npx vite-node` hangs trying
 * to fetch it. esbuild is already here as a Vite dependency.)
 *
 * This is a measurement tool, not a build step. It exists so that every claim
 * about coverage is a number that can be re-checked, not an impression.
 */
import { allCities } from "../src/cityData";
import {
  deriveAll,
  INDICATORS,
  DEPA_DIMENSION_ORDER,
  DIMENSION_WEIGHTS,
  DIMENSION_LABELS,
  type DepaDimension,
} from "../src/dimensionScores";

const derivations = deriveAll(allCities);

/* ── Per-dimension coverage ────────────────────────────────────────────── */

interface DimRow {
  dim: DepaDimension;
  weight: number;
  scored: number;
  unscored: number;
  meanScore: number | null;
  coveragePct: number;
  nullIndicators: string[];
}

console.log("=".repeat(78));
console.log("BASELINE COVERAGE — depa 7 dimensions across all cities");
console.log("=".repeat(78));
console.log(`cities                ${allCities.length}`);
const scoredCities = allCities.filter(c => derivations.get(c.id)!.composite != null);
console.log(`cities scored         ${scoredCities.length}`);
console.log(`cities unscored       ${allCities.length - scoredCities.length}`);
console.log();

console.log("DIMENSION      wt  scored  unscored   mean score   weight cov   missing indicators");
console.log("-".repeat(78));

const dimRows: DimRow[] = [];
for (const dim of DEPA_DIMENSION_ORDER) {
  const scores: number[] = [];
  let nullIndicators = new Set<string>();
  for (const c of allCities) {
    const d = derivations.get(c.id)!;
    const dr = d.dimensions[dim];
    if (dr.score == null) {
      for (const contrib of dr.contributions) nullIndicators.add(contrib.id);
    } else {
      scores.push(dr.score);
    }
  }
  const mean = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
  const row: DimRow = {
    dim,
    weight: DIMENSION_WEIGHTS[dim],
    scored: scores.length,
    unscored: allCities.length - scores.length,
    meanScore: mean,
    coveragePct: scores.length / allCities.length,
    nullIndicators: [...nullIndicators],
  };
  dimRows.push(row);
  console.log(
    `${DIMENSION_LABELS[dim].en.padEnd(14)} ${String(row.weight).padStart(2)}%  ` +
    `${String(row.scored).padStart(6)}  ${String(row.unscored).padStart(8)}   ` +
    `${mean == null ? "     —     " : mean.toFixed(1).padStart(6)}       ` +
    `${(row.coveragePct * 100).toFixed(1).padStart(5)}%   ` +
    `${row.nullIndicators.length ? row.nullIndicators.join(", ") : "—"}`,
  );
}

/* ── Composite weight coverage ─────────────────────────────────────────── */

const coverages = scoredCities.map(c => derivations.get(c.id)!.weightCoverage);
const covMean = coverages.reduce((a, b) => a + b, 0) / coverages.length;
console.log();
console.log(`composite weight coverage   min ${(Math.min(...coverages) * 100).toFixed(1)}%   ` +
  `mean ${(covMean * 100).toFixed(1)}%   max ${(Math.max(...coverages) * 100).toFixed(1)}%`);

/* ── The People dimension, indicator by indicator ──────────────────────── */

console.log();
console.log("PEOPLE DIMENSION — indicator coverage");
const peopleInds = INDICATORS.filter(i => i.dimension === "people");
for (const ind of peopleInds) {
  let withValue = 0;
  let min = Infinity;
  let max = -Infinity;
  let over = 0;
  for (const c of allCities) {
    const d = derivations.get(c.id)!;
    const contrib = d.dimensions.people.contributions.find(x => x.id === ind.id)!;
    if (contrib.raw == null) continue;
    withValue++;
    min = Math.min(min, contrib.raw);
    max = Math.max(max, contrib.raw);
    if (contrib.raw > 100) over++;
  }
  console.log(
    `  ${ind.id.padEnd(26)} values=${String(withValue).padStart(3)}/${allCities.length}   ` +
    `range ${withValue ? `${min.toFixed(1)}–${max.toFixed(1)}` : "—"}   ` +
    `over100=${over}   scale=${ind.scale.kind}`,
  );
}

/* ── Tier distribution ─────────────────────────────────────────────────── */

const tiers = { alpha: 0, beta: 0, gamma: 0 } as Record<string, number>;
for (const c of scoredCities) tiers[derivations.get(c.id)!.tier!]++;
console.log();
console.log(`TIERS   alpha ${tiers.alpha}   beta ${tiers.beta}   gamma ${tiers.gamma}`);

/* ── Where the composite weight is missing ─────────────────────────────── */

console.log();
console.log("UNSCORED DIMENSIONS PER CITY (dimensions with no measurable data):");
const byUnscored = new Map<string, number>();
for (const c of allCities) {
  const key = derivations.get(c.id)!.unscored.join(", ") || "—";
  byUnscored.set(key, (byUnscored.get(key) ?? 0) + 1);
}
for (const [k, n] of [...byUnscored.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(3)} cities   ${k}`);
}
