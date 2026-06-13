// scripts/generate-city-og-pages.mjs
// Post-build: generates dist/city/{id}/index.html for each city so crawlers
// (Facebook, Twitter/X, Slack, iMessage) receive per-city OG meta instead of
// the generic 404.html fallback that GitHub Pages normally serves.
// GitHub Pages serves dist/city/{id}/index.html directly for /city/{id} URLs,
// so the SPA still loads and routes correctly for real users.
import esbuild from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from "fs";
import { join } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { tmpdir } from "os";

const __dirname = join(fileURLToPath(import.meta.url), "..");
const root = join(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. Bundle cityData + cityMedia via esbuild so we can run them in Node.js.
//    import.meta.env.BASE_URL is inside function bodies only — shimming it
//    prevents runtime errors if any code path accidentally calls assetUrl().
// ---------------------------------------------------------------------------
const bundleResult = await esbuild.build({
  stdin: {
    contents: [
      `export { allCities } from "./src/cityData.ts";`,
      `export { getCityPhotoAsset } from "./src/cityMedia.ts";`,
    ].join("\n"),
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

const tmpFile = join(tmpdir(), `sciti-og-${process.pid}.mjs`);
writeFileSync(tmpFile, bundleResult.outputFiles[0].text);
const { allCities, getCityPhotoAsset } = await import(pathToFileURL(tmpFile).href);
unlinkSync(tmpFile);

// ---------------------------------------------------------------------------
// 2. Read compiled dist/index.html as the template.
// ---------------------------------------------------------------------------
const template = readFileSync(join(root, "dist/index.html"), "utf8");
const BASE_URL = "https://sciti.nonarkara.org";

// Rank cities by compositeScore descending (mirrors the rankings page logic).
const sorted = [...allCities].sort((a, b) => b.compositeScore - a.compositeScore);
const rankMap = new Map(sorted.map((c, i) => [c.id, i + 1]));

// ---------------------------------------------------------------------------
// 3. For each city, replace OG meta and write dist/city/{id}/index.html.
// ---------------------------------------------------------------------------
function escHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

let count = 0;

for (const city of allCities) {
  const asset = getCityPhotoAsset(city);
  const photoSrc = asset?.src ?? "/smart_city_thailand_logo.jpg";
  const ogImage = BASE_URL + (photoSrc.startsWith("/") ? photoSrc : "/" + photoSrc);

  const rank = rankMap.get(city.id);
  const score = city.compositeScore.toFixed(0);
  const rankStr = rank ? `Ranked #${rank} in Thailand. ` : "";

  const ogTitle = `${city.nameEn} | Smart City Thailand Index (SCITI)`;
  const ogDesc =
    `${city.nameEn} smart city profile — composite score ${score}/100. ` +
    `${rankStr}Explore pillar scores, city highlights, and investment signals.`;
  const cityUrl = `${BASE_URL}/city/${city.id}`;

  // Replace existing meta content (template has these tags verbatim).
  let html = template
    .replace(
      /<meta property="og:title" content="[^"]*" \/>/,
      `<meta property="og:title" content="${escHtml(ogTitle)}" />`
    )
    .replace(
      /<meta property="og:description" content="[^"]*" \/>/,
      `<meta property="og:description" content="${escHtml(ogDesc)}" />`
    )
    // Replace image + remove fixed width/height (unknown for city photos)
    .replace(
      /<meta property="og:image" content="[^"]*" \/>\n\s*<meta property="og:image:width" content="[^"]*" \/>\n\s*<meta property="og:image:height" content="[^"]*" \/>\n\s*<meta property="og:image:alt" content="[^"]*" \/>/,
      `<meta property="og:image" content="${escHtml(ogImage)}" />\n    <meta property="og:image:alt" content="${escHtml(city.nameEn + " cityscape")}" />`
    )
    .replace(
      /<meta name="twitter:title" content="[^"]*" \/>/,
      `<meta name="twitter:title" content="${escHtml(ogTitle)}" />`
    )
    .replace(
      /<meta name="twitter:description" content="[^"]*" \/>/,
      `<meta name="twitter:description" content="${escHtml(ogDesc)}" />`
    )
    .replace(
      /<meta name="twitter:image" content="[^"]*" \/>/,
      `<meta name="twitter:image" content="${escHtml(ogImage)}" />`
    )
    .replace(
      /<title>[^<]*<\/title>/,
      `<title>${escHtml(ogTitle)}</title>`
    );

  // Inject canonical URL + og:url before </head>.
  const inject =
    `\n    <link rel="canonical" href="${cityUrl}" />` +
    `\n    <meta property="og:url" content="${cityUrl}" />`;
  html = html.replace("</head>", inject + "\n  </head>");

  const outDir = join(root, "dist/city", city.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, "index.html"), html);
  count++;
}

console.log(`✓ Generated ${count} city OG pages in dist/city/`);
