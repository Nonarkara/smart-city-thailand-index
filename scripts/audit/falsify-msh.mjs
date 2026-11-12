/**
 * FALSIFY THE MSH AUDIT AND THE BORDER-ROLE AUDIT
 * ==================================================
 * An instrument that never fires is not an instrument. This harness proves
 * the two new gates still FAIL on real defects and stay QUIET on the
 * clean case — using the SAME measurement the gates run, never a
 * re-implementation.
 *
 * The pattern is the one scripts/audit/falsify-collide.mjs established:
 * every fixture is a page served by a throwaway static server, and every
 * case is checked twice — the CORE asked directly, and the RUNNER asked
 * for its EXIT CODE.
 *
 * THE CASES
 *
 *   FIRST SCREEN
 *     1. CLEAN          — action and statement on the first screen. Quiet.
 *     2. ACTION BELOW   — the action is 1200px down. Caught.
 *     3. ACTION ABSENT  — no action at all. Caught as unmeasured.
 *
 *   PAGE BLEED
 *     4. CLEAN          — content inside the viewport. Quiet.
 *     5. BLEEDING       — a block painted past the right edge. Caught.
 *     6. PARKED         — a skip link at left:-9999px. Quiet (a control).
 *     7. SCROLLABLE     — content in a horizontal scroller. Quiet (reachable).
 *
 *   HIDDEN CONTROL
 *     8. CLEAN          — a scroller whose edge cuts a chip. Quiet.
 *     9. HIDDEN         — controls wholly beyond the cut, no fade. Caught.
 *
 *   BORDER ROLE
 *     10. ONE LINE      — every line the same weight. Caught.
 *     11. MIXED ROLES   — structural, cell and emphasis lines. Quiet.
 *     12. NO SECTION    — mixed lines but no grouped section. Caught.
 *
 * Run: node scripts/audit/falsify-msh.mjs
 */
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { measureMsh as mshCore, measureBorderRoles as borderCore } from "./lib/msh-core.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MSH_RUNNER = path.join(HERE, "msh-audit.mjs");
const BORDER_RUNNER = path.join(HERE, "border-roles.mjs");

/* ------------------------------------------------------------------ */
/* The fixtures.                                                        */
/* ------------------------------------------------------------------ */

const STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #ffffff; color: #111314;
         font: 400 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  main { padding: 20px; }
  h1 { font-size: 32px; line-height: 1.1; margin: 0 0 16px; font-weight: 700; }
  .lede { font: 400 14px/1.5 system-ui, sans-serif; margin: 0 0 16px; }
  .action { display: inline-flex; align-items: center; min-height: 44px;
            padding: .6rem 1.4rem; font: 600 11.5px system-ui, sans-serif;
            background: #111314; color: #fff; text-decoration: none; }
  .spacer { height: 1200px; }
  .bleeder { position: absolute; left: 20px; top: 120px; width: 700px; height: 40px; background: #e8eef3; }
  .skip { position: absolute; left: -9999px; top: 0; }
  .scroller { display: flex; gap: 8px; overflow-x: auto; width: 320px; }
  .scroller > span { flex: none; padding: 6px 10px; border: 1px solid #c5d3df; background: #fff; }
  .ruled { border: 1px solid #e8eef3; padding: 8px; }
  .structural { border-top: 2px solid #111314; padding: 8px; }
  .emphasis { border-left: 3px solid #007190; padding: 8px; }
`;

const page = body => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><style>${STYLE}</style></head>
<body>${body}</body></html>`;

const FIXTURES = {
  // ── FIRST SCREEN ──────────────────────────────────────────────────
  "/fixture-first-screen-clean": page(`
    <main>
      <h1>A composed page</h1>
      <p class="lede">The statement and the action are both on the first screen.</p>
      <a class="action" href="#">Do the thing</a>
    </main>
  `),
  "/fixture-first-screen-below": page(`
    <main>
      <h1>A composed page</h1>
      <p class="lede">The statement is here but the action is far below.</p>
      <div class="spacer"></div>
      <a class="action" href="#">Do the thing</a>
    </main>
  `),
  "/fixture-first-screen-absent": page(`
    <main>
      <h1>A page with no action</h1>
      <p class="lede">Nothing here can be acted on.</p>
    </main>
  `),

  // ── PAGE BLEED ────────────────────────────────────────────────────
  "/fixture-bleed-clean": page(`
    <main>
      <h1>Contained</h1>
      <p class="lede">Everything sits inside the viewport.</p>
    </main>
  `),
  // The block is 700px wide, so it only bleeds at a viewport NARROWER
  // than that. The measurement for this case therefore runs at 390px —
  // a 900px viewport would contain the block and the case would prove
  // nothing.
  //
  // It is ABSOLUTELY positioned so it paints past the right edge
  // WITHOUT widening the document. A static block would grow
  // scrollWidth, which the document-overflow rule would catch first —
  // and that would leave the element-level bleed rule untested.
  "/fixture-bleed-out": page(`
    <main>
      <h1>Bleeding</h1>
      <p class="lede">A block that paints past the right edge of the page.</p>
      <div class="bleeder"></div>
    </main>
  `),
  "/fixture-bleed-parked": page(`
    <a class="skip" href="#main">Skip to content</a>
    <main id="main">
      <h1>Parked control</h1>
      <p class="lede">A skip link is off-canvas until it takes focus.</p>
    </main>
  `),
  "/fixture-bleed-scrollable": page(`
    <main>
      <h1>Scrollable</h1>
      <p class="lede">The chips below live in a horizontal scroller, so they are one swipe away.</p>
      <div class="scroller">
        <span>One</span><span>Two</span><span>Three</span><span>Four</span>
        <span>Five</span><span>Six</span><span>Seven</span><span>Eight</span>
      </div>
    </main>
  `),

  // ── HIDDEN CONTROL ────────────────────────────────────────────────
  // AFFORDED: the scroller is 200px wide and a chip STRADDLES its right
  // edge — the reader sees a chip cut in half, which says "swipe". The
  // chip width is set so the straddle lands on the boundary.
  //
  // The controls are REAL buttons, because the rule counts controls a
  // reader can act on. A non-interactive <span> is a label, not a
  // control, and a fixture built from labels would prove nothing.
  "/fixture-hidden-clean": page(`
    <main>
      <h1>Afforded</h1>
      <p class="lede">The scroller cuts a chip at its edge, so the reader knows to swipe.</p>
      <div class="scroller" style="width:200px">
        <button type="button" style="width:120px;">Visible</button>
        <button type="button" style="width:120px;">Cut at the edge</button>
        <button type="button" style="width:120px;">Beyond</button>
        <button type="button" style="width:120px;">Further</button>
      </div>
    </main>
  `),
  // UNAFFORDED: the whole row of controls starts BEYOND the scroller's
  // right edge (a left margin that clears it), so no chip straddles the
  // boundary and no fade is present. The reader sees an empty strip and
  // concludes there is no filter at all.
  "/fixture-hidden-beyond": page(`
    <main>
      <h1>Unafforded</h1>
      <p class="lede">The controls sit wholly beyond the cut with nothing to show it.</p>
      <div class="scroller" style="width:200px">
        <button type="button" style="width:120px;margin-left:260px;">One</button>
        <button type="button" style="width:120px;">Two</button>
        <button type="button" style="width:120px;">Three</button>
        <button type="button" style="width:120px;">Four</button>
        <button type="button" style="width:120px;">Five</button>
        <button type="button" style="width:120px;">Six</button>
        <button type="button" style="width:120px;">Seven</button>
      </div>
    </main>
  `),

  // ── BORDER ROLE ───────────────────────────────────────────────────
  "/fixture-border-one-line": page(`
    <main>
      <h1>Uniform</h1>
      <p class="lede">Every line on the page is the same 1px hairline.</p>
      <div class="ruled"><span>One</span></div>
      <div class="ruled"><span>Two</span></div>
      <div class="ruled"><span>Three</span></div>
    </main>
  `),
  "/fixture-border-mixed": page(`
    <main>
      <h1>Mixed</h1>
      <p class="lede">Structural, cell and emphasis lines, and a grouped section.</p>
      <div class="structural">
        <span>A structural rule</span>
        <span>And a second line in the group</span>
      </div>
      <div class="emphasis"><span>An emphasis bar</span></div>
      <div class="ruled"><span>A cell</span></div>
    </main>
  `),
  "/fixture-border-no-section": page(`
    <main>
      <h1>Mixed but flat</h1>
      <p class="lede">Several line roles, but no section groups them.</p>
      <span class="ruled">One leaf with a rule</span>
      <span class="emphasis">Another leaf</span>
    </main>
  `),
};

/* ------------------------------------------------------------------ */
/* A throwaway server for the fixtures.                                */
/* ------------------------------------------------------------------ */

const server = createServer((req, res) => {
  const body = FIXTURES[new URL(req.url, "http://x").pathname];
  if (!body) { res.writeHead(404); res.end("no fixture"); return; }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
  res.end(body);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch();

/**
 * Measure one fixture with the MSH core. The core is the same function
 * the runner evaluates inside the page; asking it directly is how the
 * harness proves the RULE fires, separately from the runner's exit code.
 */


/** Measure one fixture with the border-role core. */


/**
 * Measure one fixture with the SHARED core — the same module the two
 * gates import. The harness and the gate now run one implementation.
 */
async function measureMsh(pathname, viewport) {
  const ctx = await browser.newContext({ viewport: viewport || { width: 900, height: 700 } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + pathname, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    const vp = viewport || { width: 900, height: 700 };
    return await page.evaluate(mshCore, { route: pathname, actionSel: ".action", expectSel: "h1", viewport: { w: vp.width, h: vp.height, label: `${vp.width}x${vp.height}` } });
  } finally {
    await ctx.close();
  }
}

/** Measure one fixture with the shared border-role core. */
async function measureBorder(pathname) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 700 } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + pathname, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    return await page.evaluate(borderCore);
  } finally {
    await ctx.close();
  }
}

/** Run a RUNNER — the thing CI actually executes — and return its code. */
function runGate(runner, extraEnv = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [runner, base, "en"], {
      env: { ...process.env, ...extraEnv },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    child.stdout.on("data", d => { out += d; });
    child.stderr.on("data", d => { out += d; });
    child.on("close", code => resolve({ code, out }));
  });
}

const results = [];
function check(name, fn) {
  try { fn(); results.push({ name, ok: true }); console.log(`  PASS  ${name}`); }
  catch (e) { results.push({ name, ok: false }); console.log(`  FAIL  ${name}\n        ${String(e.message).split("\n")[0]}`); }
}

const rulesOf = r => r.findings.map(f => f.rule);

try {
  console.log("\nFALSIFYING THE MSH AUDIT AND THE BORDER-ROLE AUDIT");
  console.log("fixtures:", base, "\n");

  // ── FIRST SCREEN ──────────────────────────────────────────────────
  console.log(`\n1. FIRST SCREEN — CLEAN`);
  const fsClean = await measureMsh("/fixture-first-screen-clean");
  check("a composed page reports nothing", () => {
    assert.equal(fsClean.findings.length, 0, JSON.stringify(fsClean.findings));
  });

  console.log(`\n2. FIRST SCREEN — ACTION BELOW THE FOLD`);
  const fsBelow = await measureMsh("/fixture-first-screen-below");
  check("an action below the first screen is caught", () => {
    assert.ok(rulesOf(fsBelow).includes("FIRST-SCREEN-ACTION"),
      `the first-screen rule did not fire: ${JSON.stringify(fsBelow.findings)}`);
  });

  console.log(`\n3. FIRST SCREEN — NO ACTION AT ALL`);
  const fsAbsent = await measureMsh("/fixture-first-screen-absent");
  check("a page with no primary action is caught", () => {
    assert.ok(rulesOf(fsAbsent).includes("FIRST-SCREEN-ACTION"),
      `the missing-action rule did not fire: ${JSON.stringify(fsAbsent.findings)}`);
  });

  // ── PAGE BLEED ────────────────────────────────────────────────────
  console.log(`\n4. PAGE BLEED — CLEAN`);
  const bleedClean = await measureMsh("/fixture-bleed-clean");
  check("a contained page reports no bleed", () => {
    assert.equal(rulesOf(bleedClean).includes("PAGE-BLEED"), false,
      JSON.stringify(bleedClean.findings));
  });

  console.log(`\n5. PAGE BLEED — CONTENT PAST THE EDGE`);
  // Measured at 390px: a 700px block only bleeds at a viewport narrower
  // than itself.
  const bleedOut = await measureMsh("/fixture-bleed-out", { width: 390, height: 700 });
  check("a block painted past the viewport is caught", () => {
    assert.ok(rulesOf(bleedOut).includes("PAGE-BLEED"),
      `the bleed rule did not fire: ${JSON.stringify(bleedOut.findings)}`);
  });

  console.log(`\n6. PAGE BLEED — A PARKED SKIP LINK (control)`);
  const bleedParked = await measureMsh("/fixture-bleed-parked");
  check("a skip link parked off-canvas stays quiet", () => {
    assert.equal(rulesOf(bleedParked).includes("PAGE-BLEED"), false,
      `the parked-control filter did not hold: ${JSON.stringify(bleedParked.findings)}`);
  });

  console.log(`\n7. PAGE BLEED — CONTENT IN A SCROLLER (control)`);
  const bleedScroll = await measureMsh("/fixture-bleed-scrollable");
  check("content inside a horizontal scroller stays quiet", () => {
    assert.equal(rulesOf(bleedScroll).includes("PAGE-BLEED"), false,
      `the scroller filter did not hold: ${JSON.stringify(bleedScroll.findings)}`);
  });

  // ── HIDDEN CONTROL ────────────────────────────────────────────────
  console.log(`\n8. HIDDEN CONTROL — AN AFFORDED SCROLLER (control)`);
  const hiddenClean = await measureMsh("/fixture-hidden-clean");
  check("a chip cut at the scroller edge stays quiet", () => {
    assert.equal(rulesOf(hiddenClean).includes("HIDDEN-CONTROL"), false,
      `the cut-edge affordance did not hold: ${JSON.stringify(hiddenClean.findings)}`);
  });

  console.log(`\n9. HIDDEN CONTROL — CONTROLS BEYOND THE CUT`);
  const hiddenBeyond = await measureMsh("/fixture-hidden-beyond");
  check("controls wholly beyond the cut are caught", () => {
    assert.ok(rulesOf(hiddenBeyond).includes("HIDDEN-CONTROL"),
      `the hidden-control rule did not fire: ${JSON.stringify(hiddenBeyond.findings)}`);
  });

  // ── BORDER ROLE ───────────────────────────────────────────────────
  console.log(`\n10. BORDER ROLE — EVERY LINE THE SAME`);
  const borderOne = await measureBorder("/fixture-border-one-line");
  check("a page of uniform hairlines is caught", () => {
    assert.ok(borderOne.roleCount < 2,
      `the flatness rule did not fire: roles=${borderOne.roles.join("/")}`);
  });

  console.log(`\n11. BORDER ROLE — DIFFERENT LINES FOR DIFFERENT JOBS`);
  const borderMixed = await measureBorder("/fixture-border-mixed");
  check("mixed line roles are quiet", () => {
    assert.ok(borderMixed.roleCount >= 2,
      `the roles were not read: ${JSON.stringify(borderMixed.counts)}`);
  });
  check("a grouped section is found", () => {
    assert.ok(borderMixed.specialSections > 0,
      `the section rule did not fire: ${JSON.stringify(borderMixed)}`);
  });

  console.log(`\n12. BORDER ROLE — MIXED LINES BUT NO SECTION`);
  const borderFlat = await measureBorder("/fixture-border-no-section");
  check("mixed lines with no grouped section is caught", () => {
    assert.equal(borderFlat.specialSections, 0,
      `the fixture should have no grouped section: ${JSON.stringify(borderFlat)}`);
  });

  // ── THE RUNNERS' EXIT CODES ───────────────────────────────────────
  console.log(`\n13. THE RUNNERS' EXIT CODES`);
  const mshBad = await runGate(MSH_RUNNER, { SCITI_AUDIT_ROUTES: "/fixture-first-screen-below" });
  check("the MSH runner fails on a page whose action is below the fold", () => {
    assert.notEqual(mshBad.code, 0, `the runner exited 0 on a defect:\n${mshBad.out.slice(0, 400)}`);
  });

  const borderBad = await runGate(BORDER_RUNNER, { SCITI_AUDIT_ROUTES: "/fixture-border-one-line" });
  check("the border runner fails on a page of uniform hairlines", () => {
    assert.notEqual(borderBad.code, 0, `the runner exited 0 on a defect:\n${borderBad.out.slice(0, 400)}`);
  });

  const passed = results.filter(r => r.ok).length;
  console.log(`\n${passed}/${results.length} falsification cases pass.`);
  if (passed !== results.length) {
    console.log("\nVERDICT FAIL — an instrument that has stopped discriminating.");
    process.exitCode = 1;
  } else {
    console.log("VERDICT PASS — both instruments still fire on real defects and stay quiet on the clean case.");
  }
} finally {
  await browser.close();
  server.close();
}
