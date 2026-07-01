// Source: scripts/generate-cities-json.mjs (live at github.com/Nonarkara/smart-city-thailand-index)
// The postbuild script that generates the public CC BY 4.0 dataset (cities.json) judges and researchers can download and verify independently.
// ---------------------------------------------------------------------------

// scripts/generate-cities-json.mjs
// Post-build: generates dist/data/cities.json so AI agents and crawlers can
// access all 118 city scores without running JavaScript.
// Pattern: same esbuild approach as generate-city-og-pages.mjs
import esbuild from "esbuild";
import { writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { tmpdir } from "os";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const root = join(__dirname, "..");

// Bundle cityData via esbuild so we can import it in Node.js
const bundleResult = await esbuild.build({
  stdin: {
    contents: `export { allCities } from "./src/cityData.ts";`,
    loader: "ts",
    resolveDir: root,
  },
  bundle: true,
  platform: "node",
  format: "esm",
  write: false,
  define: {
    "import.meta.env.BASE_URL": '"/"',
    "import.meta.env.PROD": "true",
    "import.meta.env.DEV": "false",
    "import.meta.env.MODE": '"production"',
    "import.meta.env.SSR": "false",
  },
  logLevel: "error",
});

const tmpFile = join(tmpdir(), `sciti-cities-${process.pid}.mjs`);
writeFileSync(tmpFile, bundleResult.outputFiles[0].text);
const { allCities } = await import(pathToFileURL(tmpFile).href);
unlinkSync(tmpFile);

// Project only the fields that matter for AI/search consumption
const cities = allCities.map(c => ({
  id: c.id,
  nameEn: c.nameEn,
  nameTh: c.nameTh,
  province: c.province,
  provinceTh: c.provinceTh ?? null,
  region: c.region,
  tier: c.tier,
  reality: c.reality,
  league: c.league ?? null,
  compositeScore: c.compositeScore,
  scores: c.scores,
  dataConfidence: c.dataConfidence ?? null,
  smartDimensions: c.smartDimensions ?? [],
  gppPerCapita: c.metrics?.gppPerCapita ?? null,
  tagline: c.tagline ?? null,
  taglineTh: c.taglineTh ?? null,
  rank: null, // filled below after sort
}));

// Sort by compositeScore descending and add rank
cities.sort((a, b) => b.compositeScore - a.compositeScore);
cities.forEach((c, i) => { c.rank = i + 1; });

const output = {
  meta: {
    name: "SCITI 2026 — Smart City Thailand Index",
    version: "2026",
    url: "https://sciti.nonarkara.org",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: "depa — Digital Economy Promotion Agency",
    count: cities.length,
    pillars: {
      livability:   { weight: 0.25, key: "livability" },
      economy:      { weight: 0.20, key: "economy" },
      safety:       { weight: 0.15, key: "safety" },
      wellbeing:    { weight: 0.15, key: "wellbeing" },
      environment:  { weight: 0.10, key: "environment" },
      hospitality:  { weight: 0.10, key: "hospitality" },
      digital:      { weight: 0.05, key: "digital" },
    },
  },
  cities,
};

// Write to dist/data/cities.json (postbuild runs after vite build, so dist/ exists)
const outDir = join(root, "dist", "data");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, "cities.json");
writeFileSync(outFile, JSON.stringify(output, null, 2));

// Also write to dist/cities.json (root). The /data/cities.json path has been
// observed returning the SPA shell on the live Cloudflare-fronted deploy
// (likely the catch-all /* → /index.html 200 rule from public/_redirects
// winning over the static file lookup). Root-level static files
// (/favicon.svg, /robots.txt) serve correctly, so this is the safe URL.
const rootFile = join(root, "dist", "cities.json");
writeFileSync(rootFile, JSON.stringify(output, null, 2));

console.log(`✓ cities.json written — ${cities.length} cities → dist/data/cities.json + dist/cities.json`);
