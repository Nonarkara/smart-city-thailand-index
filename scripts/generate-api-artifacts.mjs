// Post-build: write the city read-API as static files.
// Production is Cloudflare Pages, which does not run the Vercel handlers in
// /api. Without these files, /api/cities and the CSV routes fall through to
// index.html (public/_redirects) and the browser downloads the SPA shell.
import esbuild from "esbuild";
import { mkdirSync, writeFileSync, unlinkSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import { fileURLToPath, pathToFileURL } from "url";

const root = join(fileURLToPath(import.meta.url), "..", "..");
const outDir = join(root, "dist", "api-static");

const bundleResult = await esbuild.build({
  stdin: {
    contents: `
      export {
        getCitiesApiPayload,
        getCityDetail,
        getCitySummaries,
        getCitySummariesCsv,
        getCityFactsCsv,
      } from "./src/cityCdp.ts";
    `,
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

const tmpFile = join(tmpdir(), `sciti-api-${process.pid}.mjs`);
writeFileSync(tmpFile, bundleResult.outputFiles[0].text);
const {
  getCitiesApiPayload,
  getCityDetail,
  getCitySummaries,
  getCitySummariesCsv,
  getCityFactsCsv,
} = await import(pathToFileURL(tmpFile).href);
unlinkSync(tmpFile);

const CITY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const builtAt = new Date().toISOString();

function envelope(data) {
  return {
    success: true,
    data,
    requestId: "static",
    timestamp: builtAt,
  };
}

function writeJson(relativePath, value) {
  const file = join(outDir, relativePath);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, JSON.stringify(value));
}

function writeText(relativePath, value) {
  const file = join(outDir, relativePath);
  mkdirSync(join(file, ".."), { recursive: true });
  writeFileSync(file, value);
}

const summaries = getCitySummaries();
if (!summaries.length) {
  throw new Error("API mirror: city summary list is empty");
}

writeJson("cities.json", envelope(getCitiesApiPayload()));
writeText("exports/cities-summary.csv", getCitySummariesCsv());
writeText("exports/city-facts.csv", getCityFactsCsv());
writeJson("not-found.json", {
  success: false,
  error: "Not found",
  requestId: "static",
  timestamp: builtAt,
});

for (const summary of summaries) {
  if (!CITY_ID.test(summary.id)) {
    throw new Error(`API mirror: unsafe city id ${summary.id}`);
  }
  const detail = getCityDetail(summary.id);
  if (!detail) {
    throw new Error(`API mirror: missing dossier for ${summary.id}`);
  }
  writeJson(`cities/${summary.id}.json`, envelope(detail));
  writeText(`exports/cities/${summary.id}.csv`, getCityFactsCsv(summary.id));
}

const phuket = getCityDetail("phuket");
if (!phuket || phuket.id !== "phuket") {
  throw new Error("API mirror: phuket dossier missing");
}

console.log(`✓ API mirror — ${summaries.length} cities → dist/api-static`);
