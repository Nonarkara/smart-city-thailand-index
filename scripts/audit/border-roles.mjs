/**
 * THE BORDER-ROLE INSTRUMENT
 * ===========================
 * The owner's brief: "some borders (not all the time for special section;
 * decide strategically)". The shared law (§14.2.4 rule 4) says the same
 * thing more sharply: "Line weights differ by role. A structural divider
 * is not a cell separator is not an emphasis rule. Uniform 1px hairlines
 * everywhere is itself a flatness tell — it says nobody decided which
 * line mattered."
 *
 * So the question is not "does this page have borders" but "does this
 * page draw DIFFERENT LINES FOR DIFFERENT JOBS".
 *
 * THE THREE ROLES, as they exist in this codebase already:
 *
 *   STRUCTURAL  A 2px ink rule. It divides the page into major parts —
 *               the boundary between a band's top and its body, the top
 *               edge of a table. The reader feels it as a change of
 *               ground.
 *
 *   CELL        A 1px hairline in --5. It separates items inside one
 *               group — a table row, a filter chip, a card in a set.
 *               The reader reads it as belonging to the group.
 *
 *   EMPHASIS    A 3px accent bar (teal, gold). It marks the one thing
 *               in a group that was chosen. The reader reads it as a
 *               voice, not a fence.
 *
 * WHAT IT MEASURES, per route:
 *
 *   ROLES       Which of the three roles actually appear on the page.
 *              A page with ONE role in use has decided nothing: every
 *              line is the same line, and the flatness tell is present.
 *
 *   SPECIAL     Whether at least one section carries its OWN treatment
 *              — a painted ground, or a structural rule — so the page
 *              has a special section rather than one long flat run.
 *              (This is the "special section" the owner asked for.)
 *
 *   INK SHARE   What share of the page's drawn lines carry each role.
 *              A page can have all three roles and still be flat if
 *              the structural role is one line among two hundred.
 *
 * Run: node scripts/audit/border-roles.mjs [baseUrl] [locales]
 * Env: SCITI_AUDIT_ROUTES="/bingo,/asus"   measure a subset
 *
 * EXIT CODE
 *   0  every route has at least two roles in play AND a special section
 *   1  a route draws every line the same way
 *
 * A route that could not be loaded is NOT a pass.
 */
import { chromium } from "@playwright/test";
import { measureBorderRoles } from "./lib/msh-core.mjs";

let BASE = process.argv[2] && !process.argv[2].startsWith("--") ? process.argv[2] : "http://[::1]:5188";
const LOCALES = (process.argv[3] && !process.argv[3].startsWith("--") ? process.argv[3] : "en,th").split(",");
const ALL_ROUTES = [
  "/", "/rankings", "/methodology", "/story", "/why", "/showcase", "/partners",
  "/map", "/asus", "/references", "/program", "/knowledge", "/discover",
  "/invest", "/compare", "/bingo", "/baseline", "/city/phuket", "/canvas/phuket",
];
const ROUTES = process.env.SCITI_AUDIT_ROUTES
  ? process.env.SCITI_AUDIT_ROUTES.split(",").map(s => s.trim()).filter(Boolean)
  : ALL_ROUTES;

// The role a drawn line plays, read from the resolved border of the
// element that owns it. The widths are the codebase's own vocabulary:
// 2px ink = structural, 1px = cell, 3px = emphasis.
//
// This function is INLINED into the page below, not called from it:
// a helper defined in this module does not exist inside page.evaluate.


let server;
if (process.argv.includes("--serve")) {
  const { preview } = await import("vite");
  server = await preview({ preview: { host: "127.0.0.1", port: 0, strictPort: true }, logLevel: "error" });
  BASE = `http://127.0.0.1:${server.httpServer.address().port}`;
}
const browser = await chromium.launch();
const findings = [];
const unmeasured = [];
let measured = 0;

for (const route of ROUTES) {
  for (const locale of LOCALES) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    try {
      await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(1800);
      if (locale !== "en") {
        await page.evaluate((want) => {
          const btn = [...document.querySelectorAll("button, a")].find(b =>
            new RegExp(`^(${want.toUpperCase()}|${want === "th" ? "ไทย" : "中文"})$`, "i").test((b.textContent || "").trim()));
          if (btn) btn.click();
        }, locale);
        await page.waitForTimeout(1400);
      }
      const r = await page.evaluate(measureBorderRoles);
      measured++;
      const bad = [];
      if (r.roleCount < 2) {
        bad.push(`every line on the page is the same line (${r.counts.cell} cell, ${r.counts.structural} structural, ${r.counts.emphasis} emphasis): the flatness tell`);
      }
      if (r.specialSections === 0) {
        bad.push(`no section carries its own ground or structural rule; the page is one flat run`);
      }
      console.log(`${bad.length ? "FAIL" : "ok  "} ${route} ${locale}: ${r.roles.join("/") || "none"} | cell ${r.counts.cell} struct ${r.counts.structural} emph ${r.counts.emphasis} | special ${r.specialSections}${r.specialSample.length ? " (" + r.specialSample.join(", ") + ")" : ""}`);
      if (bad.length) findings.push({ route, locale, bad });
    } catch (err) {
      unmeasured.push(`${route} ${locale}: ${String(err).slice(0, 100)}`);
      console.log(`UNMEASURED ${route} ${locale}: ${String(err).slice(0, 100)}`);
    } finally {
      await ctx.close();
    }
  }
}
await browser.close();
if (server) await server.close();

console.log(`\n${measured} measurements, ${findings.length} findings, ${unmeasured.length} not measured.`);
for (const f of findings) console.log(`  ${f.route} ${f.locale}: ${f.bad.join("; ")}`);
if (unmeasured.length) { console.log("NOT MEASURED:"); for (const u of unmeasured) console.log(`  ${u}`); }
if (findings.length || unmeasured.length) process.exit(1);
console.log("VERDICT PASS");
