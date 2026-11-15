/**
 * FALSIFY THE TAP-TARGET GATE
 * ============================
 * An instrument that never fires is not an instrument. This harness proves
 * the tap-target gate still FAILS on real defects and stays QUIET on the
 * clean case — using the SAME measurement the gate runs, never a
 * re-implementation.
 *
 * The pattern is the one scripts/audit/falsify-msh.mjs established: every
 * fixture is a page served by a throwaway static server, and every case is
 * checked twice — the CORE asked directly, and the RUNNER asked for its
 * EXIT CODE.
 *
 * THE CASES
 *
 *   ISOLATED ACTION
 *     1. CLEAN        — a 44x44 button. Quiet.
 *     2. TOO SMALL    — a 20x20 button. Caught.
 *
 *   DENSE GROUP
 *     3. CLEAN        — a row of five 32px chips. Quiet (not 44 each).
 *     4. TOO SHORT    — a row of five 20px chips. Caught.
 *
 *   ICON CONTROL
 *     5. CLEAN        — a 44x44 icon button with a label. Quiet.
 *     6. TOO SMALL    — a 28x28 icon button with a label. Caught.
 *
 *   INLINE LINK
 *     7. IN PROSE     — a link inside a sentence. Quiet.
 *
 *   LABEL-WRAPPED INPUT
 *     8. CLEAN        — a 13px checkbox inside a 44px label. Quiet.
 *
 *   OFF-SCREEN CONTROL
 *     9. PARKED       — a skip link at top:-40px. Quiet.
 *
 *   THE PSEUDO-ELEMENT TRAP
 *    10. DEAD ::after — a 20x20 button whose ::after claims a 44px hit
 *                      area but does not resolve. Caught. (The real
 *                      hamburger failed this way: elementFromPoint 4px
 *                      outside the button returned the topbar.)
 *
 * Run: node scripts/audit/falsify-tap-targets.mjs
 */
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { measureTapTargets } from "./lib/tap-core.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUNNER = path.join(HERE, "tap-targets.mjs");

const STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #fff; color: #111314;
         font: 400 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { padding: 20px; }
  h1 { font-size: 32px; line-height: 1.1; margin: 0 0 16px; font-weight: 700; }
  button { font: inherit; cursor: pointer; border: 0; background: #f6f8fa; }
  .row { display: flex; gap: 4px; }
  .chip { min-height: 32px; padding: 0 10px; }
  .solo { width: 44px; height: 44px; }
  .tiny { width: 20px; height: 20px; }
  .icon { width: 28px; height: 28px; }
  .dead::after { content: ""; position: absolute; inset: -12px; pointer-events: none; }
  .dead { position: relative; }
  .skip { position: absolute; top: -40px; left: 0; }
  label { display: flex; align-items: center; gap: 8px; min-height: 44px; }
`;

const PAGE = (body) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0"><title>fixture</title>
<style>${STYLE}</style></head><body><main><h1>Fixture</h1>${body}</main></body></html>`;

const CASES = [
  {
    name: "isolated action, clean",
    body: `<button class="solo" aria-label="Do it">x</button>`,
    expect: "quiet",
  },
  {
    name: "isolated action, 20x20",
    body: `<button class="tiny" aria-label="Do it">x</button>`,
    expect: "caught",
  },
  {
    name: "dense group, five 32px chips",
    body: `<div class="row">
      <button class="chip">A</button><button class="chip">B</button>
      <button class="chip">C</button><button class="chip">D</button>
      <button class="chip">E</button></div>`,
    expect: "quiet",
  },
  {
    name: "dense group, five 20px chips",
    body: `<div class="row">
      <button class="chip" style="min-height:20px;height:20px">A</button>
      <button class="chip" style="min-height:20px;height:20px">B</button>
      <button class="chip" style="min-height:20px;height:20px">C</button>
      <button class="chip" style="min-height:20px;height:20px">D</button>
      <button class="chip" style="min-height:20px;height:20px">E</button></div>`,
    expect: "caught",
  },
  {
    name: "icon control, clean",
    body: `<button class="solo" aria-label="Open">x</button>`,
    expect: "quiet",
  },
  {
    name: "icon control, 28x28",
    body: `<button class="icon" aria-label="Open">x</button>`,
    expect: "caught",
  },
  {
    name: "link inside a sentence",
    body: `<p>The index tracks every city, and the
      <a href="/why">method is published here</a> for anyone to check.</p>`,
    expect: "quiet",
  },
  {
    name: "13px checkbox inside a 44px label",
    body: `<label><input type="checkbox">Certified cities only</label>`,
    expect: "quiet",
  },
  {
    name: "skip link parked off-screen",
    body: `<a class="skip" href="#main">Skip to content</a>`,
    expect: "quiet",
  },
  {
    name: "20x20 button whose ::after claims a 44px hit area",
    body: `<button class="tiny dead" aria-label="Do it">x</button>`,
    expect: "caught",
  },
];

/* ------------------------------------------------------------------ */
/* The fixtures are served by a throwaway static server.               */
/* ------------------------------------------------------------------ */

const server = createServer((req, res) => {
  const name = decodeURIComponent((req.url || "/").split("?")[0]).replace(/^\//, "") || "index.html";
  const fixture = CASES.find(c => c.name === name);
  if (!fixture) { res.writeHead(404, { "content-type": "text/html" }); res.end(PAGE("<p>no fixture</p>")); return; }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(PAGE(fixture.body));
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const PORT = server.address().port;
const ORIGIN = `http://127.0.0.1:${PORT}`;

const browser = await chromium.launch();
let failures = 0;

for (const fixture of CASES) {
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await ctx.newPage();
  await page.goto(`${ORIGIN}/${encodeURIComponent(fixture.name)}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);

  // The CORE, asked directly.
  const { findings } = await measureTapTargets(page, { route: fixture.name, viewportLabel: "390x844" });
  const caughtByCore = findings.length > 0;

  // The RUNNER, asked for its exit code. The runner is driven against the
  // fixture server with its route list narrowed to this one fixture, so
  // its exit code is a real verdict: 0 for quiet, 1 for caught.
  const runnerCode = await new Promise(resolve => {
    const child = spawn(process.execPath, [RUNNER, ORIGIN], {
      stdio: ["ignore", "pipe", "pipe"],
      env: {
        ...process.env,
        TAP_ROUTES: `/${encodeURIComponent(fixture.name)}`,
        TAP_VIEWPORTS: "390x844",
      },
    });
    let out = "";
    child.stdout.on("data", d => { out += d; });
    child.stderr.on("data", d => { out += d; });
    child.on("close", code => resolve({ code, out }));
  });

  const expectCaught = fixture.expect === "caught";
  const coreOK = caughtByCore === expectCaught;
  const runnerCaught = runnerCode.code === 1;
  const runnerOK = runnerCaught === expectCaught;

  const verdict = coreOK && runnerOK ? "ok  " : "FAIL";
  if (!coreOK || !runnerOK) failures++;
  console.log(
    `${verdict} ${fixture.name} — core ${caughtByCore ? "caught" : "quiet"} (expected ${fixture.expect}), runner exit ${runnerCode.code} (expected ${expectCaught ? 1 : 0})`
  );
  if (!coreOK) {
    console.log(`      findings: ${JSON.stringify(findings.map(f => ({ cls: f.cls, category: f.category, need: f.need, box: f.box, eff: f.eff })))}`);
  }
  if (!runnerOK) console.log(`      runner output:\n${runnerCode.out.split("\n").slice(-8).map(l => "        " + l).join("\n")}`);
  await ctx.close();
}

await browser.close();
server.close();

console.log(`\n${CASES.length} cases, ${failures} failure(s).`);
if (failures) { console.log("\nVERDICT FAIL — the gate no longer discriminates"); process.exit(1); }
console.log("\nVERDICT PASS — the gate still fires on real defects and stays quiet on the clean cases.");
