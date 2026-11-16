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
 *   THE GROUP RULE
 *    13. CITATION LIST — five 32px rows in a plain block whose children
 *                      are all controls. Quiet at 32px.
 *    14. same list at 20px. Caught — the group floor is 32, not silence.
 *    15. one link per row in a <ul>, 32px. Quiet.
 *    16. same list at 20px. Caught.
 *
 *   THE INLINE EXCEPTION
 *    17. PARAGRAPH OF LINKS — "Source 1 ↗  Source 2 ↗" and nothing else.
 *                      Caught: the exception is for a SENTENCE, and a
 *                      row of links is not one. It gets the invisible hit
 *                      area the law describes, down to the 24px floor.
 *    18. The same paragraph with that invisible hit area. Quiet.
 *    19. A BOXED link inside a paragraph of links. Caught — the exception
 *                      does not cover a control that paints a box.
 *    20. A link standing alone, under the floor. Caught.
 *    21. The same link with an invisible hit area. Quiet.
 *    22. A link among labelled values, no prose. Caught.
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
  .list { list-style: none; margin: 0; padding: 0; }
  .row { display: flex; align-items: center; width: 100%; min-height: 44px; }
  /* A citation list in a plain block: the container is not a ul and not a
     flex row, but every child is a control. */
  .refs a { display: flex; align-items: center; min-height: 32px; }
  .refs a.short { min-height: 20px; }
  /* One link per row in a list, wrapped in its own li. */
  .src { display: flex; align-items: center; min-height: 32px; }
  .src.short { min-height: 20px; }
  .boxed { display: inline-block; padding: 4px 8px; background: #f6f8fa; }
  /* A standalone link with the invisible hit area the law describes:
     vertical padding on an inline box. */
  .hit { padding-block: 8px; }
  .card { margin-bottom: 32px; }
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
  {
    name: "map mark, 24px, with an equivalent list path",
    body: `<svg width="300" height="120" viewBox="0 0 300 120">
      <g role="button" aria-label="Partner A">
        <circle cx="40" cy="40" r="12" fill="transparent" />
      </g></svg>
      <ul class="list"><li><button class="row">Partner A</button></li></ul>`,
    expect: "quiet",
  },
  {
    name: "map mark, 9px, with no equivalent path",
    body: `<svg width="300" height="120" viewBox="0 0 300 120">
      <g role="button" aria-label="Partner A">
        <circle cx="40" cy="40" r="4" fill="transparent" />
      </g></svg>`,
    expect: "caught",
  },
  /* ── The group rule: a plain block whose children are all controls ────
     This is the shape of the /why citation list: a div, not a ul, holding
     nothing but links. It is a dense group, so 32px on touch is its floor —
     not 44px, and not silence. */
  {
    name: "citation list in a plain block, five 32px rows",
    body: `<div class="refs">
      <a href="#">[1] Financial Times fDi Benchmark</a>
      <a href="#">[2] World Bank urban data</a>
      <a href="#">[3] NSO provincial statistics</a>
      <a href="#">[4] ASEAN smart city toolkit</a>
      <a href="#">[5] UNESCO creative cities</a></div>`,
    expect: "quiet",
  },
  {
    name: "citation list in a plain block, five 20px rows",
    body: `<div class="refs">
      <a class="short" href="#">[1] Financial Times fDi Benchmark</a>
      <a class="short" href="#">[2] World Bank urban data</a>
      <a class="short" href="#">[3] NSO provincial statistics</a>
      <a class="short" href="#">[4] ASEAN smart city toolkit</a>
      <a class="short" href="#">[5] UNESCO creative cities</a></div>`,
    expect: "caught",
  },
  /* ── One link per row, wrapped in its own li ────────────────────────── */
  {
    name: "one link per row in a list, 32px rows",
    body: `<ul class="list">
      <li><a class="src" href="#">National Statistical Office</a></li>
      <li><a class="src" href="#">Ministry of Interior</a></li>
      <li><a class="src" href="#">Office of the Prime Minister</a></li></ul>`,
    expect: "quiet",
  },
  {
    name: "one link per row in a list, 20px rows",
    body: `<ul class="list">
      <li><a class="src short" href="#">National Statistical Office</a></li>
      <li><a class="src short" href="#">Ministry of Interior</a></li>
      <li><a class="src short" href="#">Office of the Prime Minister</a></li></ul>`,
    expect: "caught",
  },
  /* ── The inline exception: a paragraph made of links ───────────────────
     The evidence block on /audit prints "Source 1 ↗  Source 2 ↗" and
     nothing else. Those are running text (WCAG 2.2 SC 2.5.8's inline
     exception), so they are quiet. */
  {
    name: "a paragraph made only of links",
    body: `<p><a href="#">Source 1 ↗</a> <a href="#">Source 2 ↗</a> <a href="#">Source 3 ↗</a></p>`,
    expect: "caught",
  },
  {
    name: "a paragraph of links with an invisible hit area",
    body: `<p><a class="hit" href="#">Source 1 ↗</a> <a class="hit" href="#">Source 2 ↗</a> <a class="hit" href="#">Source 3 ↗</a></p>`,
    expect: "quiet",
  },
  {
    name: "a boxed link inside a paragraph of links",
    body: `<p><a href="#">Source 1 ↗</a> <a class="boxed" href="#">Source 2 ↗</a></p>`,
    expect: "caught",
  },
  /* ── A link that stands alone ─────────────────────────────────────────
     The law exempts a link inside a SENTENCE. These stand alone: a
     card's closing "Source 1 ↗", a row of source links, a provenance
     row. They get the invisible hit area the law describes, down to the
     24px WCAG 2.2 AA floor. */
  {
    name: "a link standing alone, under the floor",
    body: `<div class="card"><a href="#">Source 1 ↗</a></div>`,
    expect: "caught",
  },
  {
    name: "a link standing alone with an invisible hit area",
    body: `<div class="card"><a class="hit" href="#">Source 1 ↗</a></div>`,
    expect: "quiet",
  },
  {
    name: "a row of source links with no prose around them",
    body: `<p><a href="#">Source 1 ↗</a> <a href="#">Source 2 ↗</a></p>`,
    expect: "caught",
  },
  {
    name: "a link among labelled values, no prose",
    body: `<span class="row"><span>scored input</span><a href="#">Source-linked baseline ↗</a></span>`,
    expect: "caught",
  },
  /* ── The inline CONTEXT, not the direct parent ────────────────────────
     A link wrapped in a span inside a sentence is still inside that
     sentence; a link standing between two paragraphs is not. */
  {
    name: "a link in a span inside a sentence",
    body: `<p>Caveat text before <span><a href="#">BOI Guide 2026</a></span> and text after.</p>`,
    expect: "quiet",
  },
  {
    name: "a link standing between two blocks",
    body: `<div class="card"><div>Photo by CEphoto</div><div>CC BY-SA 4.0</div><a href="#">Source on Wikimedia →</a></div>`,
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
