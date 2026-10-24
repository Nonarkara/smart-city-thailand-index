/**
 * DOES THE NEW VOICE ACTUALLY REACH THE READER?
 * ==========================================
 * The unit tests prove the builder produces sourced sentences with the
 * right frames. The unit tests do NOT prove the reader sees them — the
 * reader sees the rendered page. This probe reads the deployed or local
 * page, finds the factbook groups, and prints the voice exactly as the
 * reader receives it, in the language the reader chose.
 *
 * Run: node scripts/audit/probe-voice-live.mjs [baseUrl] [locale]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "https://sciti.nonarkara.org";
const LOCALE = process.argv[3] || "en";

const CITIES = [
  ["registered", "/city/reg-ayutthaya/"],
  ["registered", "/city/reg-lampang-pao/"],
  ["registered", "/city/reg-phayao/"],
  ["registered", "/city/reg-samut-sakhon/"],
  ["registered", "/city/reg-bangkok-noi/"],
  ["curated", "/city/phuket/"],
];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
await ctx.addInitScript(loc => {
  window.localStorage.setItem("smart-city-thailand-locale", loc);
}, LOCALE);
const page = await ctx.newPage();

const voices = [];

for (const [kind, route] of CITIES) {
  const res = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  if (!res || res.status() !== 200) {
    console.log(`\n${route} → HTTP ${res ? res.status() : "no response"}`);
    continue;
  }
  await page.waitForTimeout(1800);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(250);

  const groups = await page.evaluate(() => {
    const out = [];
    for (const g of document.querySelectorAll(".city-factbook-group")) {
      const title = (g.querySelector(".city-factbook-title")?.textContent || "").trim();
      const rows = Array.from(g.querySelectorAll(".city-factbook-row")).map(r => ({
        label: (r.querySelector(".city-factbook-label")?.textContent || "").trim(),
        value: (r.querySelector(".city-factbook-value")?.textContent || "").trim().replace(/\s+/g, " "),
      }));
      out.push({ title, rows });
    }
    return out;
  });

  console.log(`\n${"=".repeat(80)}`);
  console.log(`${kind.toUpperCase()}  ${route}   (HTTP ${res.status()})   locale=${LOCALE}`);
  console.log("=".repeat(80));
  for (const g of groups) {
    if (!g.rows.length) continue;
    console.log(`\n  [${g.title}]`);
    for (const r of g.rows) {
      console.log(`\n    ${r.label}`);
      console.log(`      ${r.value}`);
      if (kind === "registered") voices.push({ route, label: r.label, value: r.value });
    }
  }
}

console.log(`\n${"=".repeat(80)}\nSUMMARY (locale=${LOCALE})\n${"=".repeat(80)}`);
const byLabel = new Map();
for (const v of voices) {
  if (!byLabel.has(v.label)) byLabel.set(v.label, []);
  byLabel.get(v.label).push(v.value);
}
for (const [label, values] of byLabel) {
  const uniq = new Set(values);
  console.log(`  ${label}: ${values.length} rendered, ${uniq.size} distinct`);
}
// A run-on sentence: a clause that ends without a terminator, running
// straight into the next one.
const runOn = voices.filter(v => /[a-z0-9)\]] [A-Z][a-z]+ (is|are|runs|carries|reaches|were|was)\b/.test(v.value));
console.log(`  sentences with a possible run-on: ${runOn.length}`);
for (const v of runOn.slice(0, 4)) console.log(`    ${v.route}: ${v.value}`);

await ctx.close();
await browser.close();
