/**
 * Diagnostic: how does the derived (sourced) ranking relate to the curated
 * (hand-assigned) one?
 *
 * Run with:
 *   ./node_modules/.bin/esbuild scripts/analyze-baseline-correlation.mts --bundle --platform=node --format=esm --outfile=/tmp/corr.mjs && node /tmp/corr.mjs
 *
 * (vite-node is not installed in this repo, and `npx vite-node` hangs trying
 * to fetch it. esbuild is already here as a Vite dependency.)
 *
 * This is a measurement tool, not a build step. It exists so the decision to
 * migrate /rankings onto the derived score is made on numbers, not vibes.
 */
import { allCities } from "../src/cityData";
import { deriveAll } from "../src/dimensionScores";
import { getProvinceName } from "../src/cityPresentation";

const derivations = deriveAll(allCities);

interface Row {
  id: string;
  name: string;
  province: string;
  status: string;
  curated: number;
  derived: number | null;
  coverage: number;
  unscored: string[];
}

const rows: Row[] = allCities.map(c => {
  const d = derivations.get(c.id)!;
  return {
    id: c.id,
    name: c.nameEn,
    province: c.province,
    status: c.status,
    curated: c.compositeScore,
    derived: d.composite,
    coverage: d.weightCoverage,
    unscored: d.unscored,
  };
});

const scored = rows.filter(r => r.derived != null);

/* ── Pearson correlation on the two composites ── */
function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b; dx += a * a; dy += b * b;
  }
  return num / Math.sqrt(dx * dy);
}

/* ── Spearman (rank) correlation: the two systems may not be linearly related ── */
function rank(v: number): number {
  const idx = v.map((x, i) => [x, i] as const).sort((a, b) => a[0] - b[0]);
  const r = new Array(v.length).fill(0);
  let i = 0;
  while (i < idx.length) {
    let j = i;
    while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[idx[k][1]] = avg;
    i = j + 1;
  }
  return r;
}

const pear = pearson(scored.map(r => r.curated), scored.map(r => r.derived!));
const sp = pearson(rank(scored.map(r => r.curated)), rank(scored.map(r => r.derived!)));

/* ── Rank movement: how far does a city move when you swap systems? ── */
const byCurated = [...scored].sort((a, b) => b.curated - a.curated);
const byDerived = [...scored].sort((a, b) => b.derived! - a.derived!);
const rankOf = new Map(byDerived.map((r, i) => [r.id, i + 1]));
const moves = byCurated.map((r, i) => ({
  ...r,
  curatedRank: i + 1,
  derivedRank: rankOf.get(r.id)!,
  move: (i + 1) - rankOf.get(r.id)!,
}));
const absMoves = moves.map(m => Math.abs(m.move));
const maxMove = Math.max(...absMoves);
const medianMove = absMoves.sort((a, b) => a - b)[Math.floor(absMoves.length / 2)];
const meanMove = absMoves.reduce((a, b) => a + b, 0) / absMoves.length;

/* ── The Bangkok-district artefact: identical derived scores ── */
const byDerivedScore = new Map<string, Row[]>();
for (const r of scored) {
  const k = String(r.derived);
  if (!byDerivedScore.has(k)) byDerivedScore.set(k, []);
  byDerivedScore.get(k)!.push(r);
}
const ties = [...byDerivedScore.entries()].filter(([, v]) => v.length > 1);

/* ── Coverage spread: how much of the composite's promise is data? ── */
const coverages = scored.map(r => r.coverage);
const covMin = Math.min(...coverages), covMax = Math.max(...coverages);
const covMean = coverages.reduce((a, b) => a + b, 0) / coverages.length;

const fmt = (n: number, d = 3) => n.toFixed(d);

console.log("=".repeat(72));
console.log("DERIVED vs CURATED — relationship analysis");
console.log("=".repeat(72));
console.log(`cities total            ${rows.length}`);
console.log(`cities scored (derived) ${scored.length}`);
console.log(`cities unscored         ${rows.length - scored.length}`);
console.log();
console.log(`Pearson  r  ${fmt(pear)}`);
console.log(`Spearman ρ  ${fmt(sp)}`);
console.log();
console.log(`rank movement  max ${maxMove}  mean ${fmt(meanMove, 1)}  median ${medianMove}`);
console.log(`coverage       min ${fmt(covMin * 100, 1)}%  mean ${fmt(covMean * 100, 1)}%  max ${fmt(covMax * 100, 1)}%`);
console.log();
console.log("IDENTICAL DERIVED SCORES (ties):");
for (const [score, list] of ties) {
  const provs = [...new Set(list.map(r => r.province))];
  console.log(`  ${score}  ×${list.length}  province(s): ${provs.join(", ")}`);
  for (const r of list) console.log(`      ${r.name} (${r.province}) curated ${r.curated}`);
}
console.log();
console.log("BIGGEST MOVEMENTS (curated rank → derived rank):");
for (const m of [...moves].sort((a, b) => Math.abs(b.move) - Math.abs(a.move)).slice(0, 12)) {
  console.log(`  ${m.name.padEnd(34)} ${String(m.curatedRank).padStart(3)} → ${String(m.derivedRank).padStart(3)}  (${m.move > 0 ? "+" : ""}${m.move})  derived ${m.derived}  cov ${fmt(m.coverage * 100, 0)}%`);
}
console.log();
console.log("TOP 12 BY DERIVED:");
for (const r of byDerived.slice(0, 12)) {
  console.log(`  ${String(rankOf.get(r.id)).padStart(3)}. ${r.name.padEnd(34)} ${String(r.derived).padStart(5)}  cov ${fmt(r.coverage * 100, 0)}%  (curated rank ${byCurated.findIndex(c => c.id === r.id) + 1})`);
}
console.log();
console.log("TOP 12 BY CURATED (the current /rankings):");
for (const [i, r] of byCurated.slice(0, 12).entries()) {
  console.log(`  ${String(i + 1).padStart(3)}. ${r.name.padEnd(34)} ${String(r.curated).padStart(5)}  (derived rank ${rankOf.get(r.id)})`);
}
console.log();
console.log("UNSCORED CITIES:");
for (const r of rows.filter(r => r.derived == null)) {
  console.log(`  ${r.name} (${r.province})  unscored dims: ${r.unscored.join(", ")}`);
}
console.log();
console.log("COVERAGE BY CITY (lowest first):");
for (const r of [...scored].sort((a, b) => a.coverage - b.coverage).slice(0, 10)) {
  console.log(`  ${r.name.padEnd(34)} ${fmt(r.coverage * 100, 1)}%  derived ${r.derived}`);
}
