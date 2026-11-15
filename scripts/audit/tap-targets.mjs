#!/usr/bin/env node
/**
 * tap-targets.mjs — enforce the owner's tap-target law, which nothing enforced.
 *
 * WHY THIS GATE EXISTS
 * --------------------
 * An independent audit of the platform found that the 44 px rule was
 * unenforced: seventeen audit gates ran in CI and not one of them measured
 * an interactive target's size. The two "44" literals in scripts/audit/ are
 * row-height assertions, not tap targets. A green CI therefore said nothing
 * about the rule, and 240 controls were failing it.
 *
 * The law, the classification and the measurement are all in
 * scripts/audit/lib/tap-core.mjs — this file is the RUNNER: it serves the
 * built site, walks the routes, and reports what the core found. The
 * falsifier scripts/audit/falsify-tap-targets.mjs asks the same core
 * directly, so the two can never drift apart.
 *
 * Usage:
 *   node scripts/audit/tap-targets.mjs --serve     (preview the built dist)
 *   node scripts/audit/tap-targets.mjs <origin>    (any running origin)
 */
import { chromium } from "@playwright/test";
import { measureTapTargets } from "./lib/tap-core.mjs";

const DEFAULT_ROUTES = [
  "/", "/rankings", "/invest", "/compare", "/methodology", "/story", "/program",
  "/partners", "/audit", "/why", "/showcase", "/knowledge", "/baseline", "/city/phuket",
];

const DEFAULT_VIEWPORTS = [
  { w: 390, h: 844, label: "390x844" },
  { w: 1440, h: 900, label: "1440x900" },
];

// The falsifier drives this runner against a fixture server, so the route
// list and the viewport list can be narrowed for one case at a time.
const ROUTES = process.env.TAP_ROUTES
  ? process.env.TAP_ROUTES.split(",").filter(Boolean)
  : DEFAULT_ROUTES;
const VIEWPORTS = process.env.TAP_VIEWPORTS
  ? process.env.TAP_VIEWPORTS.split(",").map(label => {
      const [w, h] = label.split("x").map(Number);
      return { w, h, label };
    })
  : DEFAULT_VIEWPORTS;

let BASE = process.argv.find(a => a.startsWith("http")) || "";
let server = null;
if (process.argv.includes("--serve")) {
  const { preview } = await import("vite");
  server = await preview({ preview: { host: "127.0.0.1", port: 0, strictPort: true }, logLevel: "error" });
  BASE = `http://127.0.0.1:${server.httpServer.address().port}`;
}
if (!BASE) {
  console.error("tap-targets: pass --serve or an origin URL");
  process.exit(2);
}

const browser = await chromium.launch();
const findings = [];
let measured = 0;

for (const vp of VIEWPORTS) {
  // A real phone has a COARSE pointer. The stylesheet already carries a
  // `@media (pointer: coarse)` block that grows several controls to 44px
  // for exactly this reason, so a context without touch would measure a
  // phone viewport with mouse behaviour and report failures that a real
  // thumb never sees. The phone context therefore declares touch.
  const ctx = await browser.newContext({
    viewport: { width: vp.w, height: vp.h },
    reducedMotion: "reduce",
    hasTouch: vp.w < 900,
    isMobile: vp.w < 900,
  });
  const page = await ctx.newPage();

  for (const route of ROUTES) {
    await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(800);
    await page.locator("h1").first().waitFor({ timeout: 12000 }).catch(() => {});

    const result = await measureTapTargets(page, { route, viewportLabel: vp.label });
    findings.push(...result.findings);
    measured += result.count;
    const bad = result.findings.length;
    console.log(`${bad ? "FAIL" : "ok  "} ${route} ${vp.label}${bad ? " — " + bad + " finding(s)" : ""}`);
  }
  await ctx.close();
}

await browser.close();
if (server) await server.close();

console.log(`\n${measured} controls measured, ${findings.length} finding(s).`);
if (findings.length) {
  console.log("\nBY CONTROL:");
  const by = {};
  for (const f of findings) {
    const key = `${f.cls}|${f.category}`;
    (by[key] ||= []).push(f);
  }
  for (const [key, list] of Object.entries(by)) {
    const f = list[0];
    console.log(`  ${f.category} needs ${f.need}px — ${f.cls}`);
    console.log(`      box ${f.box[0]}x${f.box[1]}  effective ${f.eff[0]}x${f.eff[1]}  "${f.name}"`);
    for (const g of list.slice(0, 3)) console.log(`      ${g.route} ${g.viewport}`);
    if (list.length > 3) console.log(`      ... and ${list.length - 3} more`);
  }
  console.log("\nVERDICT FAIL");
  process.exit(1);
}
console.log("\nVERDICT PASS");
