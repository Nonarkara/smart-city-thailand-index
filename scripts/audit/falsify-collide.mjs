/**
 * FALSIFY THE SWEEP
 * ==================
 * An instrument that never fires is not an instrument. This harness proves
 * the massacre sweep still FAILS on real defects, and stays QUIET on the
 * clean case — using the SAME core measurement the gate runs
 * (scripts/audit/lib/collide-core.mjs), never a re-implementation.
 *
 * Every fixture is a page served by a throwaway static server, and every
 * case is checked twice:
 *
 *   · the CORE, asked directly, must report the finding (or must not);
 *   · the RUNNER (scripts/audit/collide.mjs), asked for its EXIT CODE,
 *     must fail on the defect and pass on the clean build.
 *
 * The cases:
 *
 *   1. CLEAN            — a well-composed page. No findings.
 *   2. OVERLAP          — two flow texts in each other's ink. Caught.
 *   3. BACK FACE SHOWN  — a flipped card's VISIBLE face overlaps text. Caught.
 *   4. BACK FACE HIDDEN — the SAME text on the face that is turned away.
 *                         QUIET. This is the control: it proves the
 *                         back-face filter is load-bearing rather than a
 *                         filter that quietly hides everything.
 *   5. ESCAPE           — a label that has left the box it belongs to. Caught.
 *
 * Run: node scripts/audit/falsify-collide.mjs
 */
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { collideCore } from "./lib/collide-core.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const RUNNER = path.join(HERE, "collide.mjs");

/* ------------------------------------------------------------------ */
/* The fixtures.                                                       */
/* ------------------------------------------------------------------ */

const STYLE = `
  * { box-sizing: border-box; }
  body { margin: 0; background: #ffffff; color: #12354e;
         font: 400 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
  .stage { position: relative; margin: 40px; width: 460px; }
  h1 { font-size: 32px; line-height: 1.1; margin: 0 0 28px; font-weight: 700; }
  .tile { position: relative; width: 220px; height: 44px;
          background: #f4f6f8; border: 1px solid #12354e; }
  .tile > span { position: absolute; inset: 0; display: flex;
                 align-items: center; justify-content: center;
                 font: 500 14px system-ui, -apple-system, sans-serif; }
  .plain { margin: 0; font: 500 14px system-ui, -apple-system, sans-serif; }
`;

/** Two flow texts pushed into each other with a negative margin. */
const OVERLAP_BLOCK = `
  <div style="margin:0;font:500 18px system-ui,sans-serif">OVERLAPPING HEAD LINE</div>
  <div style="margin:-14px 0 0 0;font:500 18px system-ui,sans-serif">SECOND HEAD LINE HERE</div>
`;

/**
 * A flipped card. The face marked `shown` carries rotateY(0deg) and is the
 * one the reader can see; the face marked `hidden` carries rotateY(180deg)
 * and is turned away, so it paints NOTHING.
 *
 * The SAME text is used in both cases, in the SAME place. Only the face
 * it sits on changes. That is what makes the second case a control rather
 * than a second assertion: if the sweep reports the text when it is
 * visible and stays quiet when it is turned away, the back-face filter is
 * doing the work. If it reported both, the filter would be measuring
 * geometry instead of paint.
 *
 * The faces are transparent on purpose: if they were opaque they would
 * genuinely cover the paragraph beneath them, and the overlap would be a
 * real one rather than the fixture this case is about.
 */
const CARD_BLOCK = (which) => `
  <div class="stage" style="height:120px">
    <p class="plain">PARTNER LINE OF TEXT BESIDE THE CARD</p>
    <div style="position:absolute;left:0;top:0;width:260px;height:26px">
      <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg)">
        <span style="font:500 16px system-ui,sans-serif">${which === "hidden" ? "FACE TEXT" : ""}</span>
      </div>
      <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(0deg)">
        <span style="font:500 16px system-ui,sans-serif">${which === "shown" ? "FACE TEXT" : ""}</span>
      </div>
    </div>
  </div>
`;

const page = (body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>fixture</title>
<style>${STYLE}</style></head><body>${body}</body></html>`;

const FIXTURES = {
  "/fixture-clean": page(`
    <div class="stage">
      <h1>Fixture</h1>
      <div class="tile"><span>ONE</span></div>
      <p class="plain" style="margin-top:24px">A line of ordinary copy that sits nowhere near anything else.</p>
    </div>
  `),
  "/fixture-overlap": page(`
    <div class="stage">
      <h1>Overlap</h1>
      ${OVERLAP_BLOCK}
    </div>
  `),
  "/fixture-backface-shown": page(`
    <div class="stage">
      <h1>Back face shown</h1>
      ${CARD_BLOCK("shown")}
    </div>
  `),
  "/fixture-backface-hidden": page(`
    <div class="stage">
      <h1>Back face hidden</h1>
      ${CARD_BLOCK("hidden")}
    </div>
  `),
  "/fixture-invisible": page(`
    <div class="stage">
      <h1>Invisible</h1>
      <p class="plain" style="color:#fff">WHITE TEXT ON A WHITE PAGE</p>
    </div>
  `),
  "/fixture-escape": page(`
    <div class="stage">
      <h1>Escape</h1>
      <div class="tile"><span style="left:-26px;justify-content:flex-start">ESCAPING LABEL</span></div>
    </div>
  `),
  /*
   * The scrim cases. A caption painted on a translucent DARK ground is not
   * painted on the page behind it — the scrim IS the ground. The first
   * version of the contrast rule skipped translucent grounds and kept
   * walking, so it measured these against the white page and reported a
   * perfectly legible caption as white-on-white.
   *
   * Three cases, so the fix cannot be a blanket exemption:
   *   · a strong dark scrim  → legible  → must stay QUIET;
   *   · a pale scrim          → illegible → must be CAUGHT;
   *   · a weak dark scrim     → illegible → must be CAUGHT.
   */
  "/fixture-scrim-strong": page(`
    <div class="stage">
      <h1>Strong scrim</h1>
      <p style="margin:0;padding:.5rem .75rem;background:rgba(12,47,83,.82);color:#fff;font:400 14px system-ui,sans-serif">CAPTION ON A DARK SCRIM</p>
    </div>
  `),
  "/fixture-scrim-pale": page(`
    <div class="stage">
      <h1>Pale scrim</h1>
      <p style="margin:0;padding:.5rem .75rem;background:rgba(255,255,255,.4);color:#fff;font:400 14px system-ui,sans-serif">CAPTION ON A PALE SCRIM</p>
    </div>
  `),
  "/fixture-scrim-weak": page(`
    <div class="stage">
      <h1>Weak scrim</h1>
      <p style="margin:0;padding:.5rem .75rem;background:rgba(12,47,83,.3);color:#fff;font:400 14px system-ui,sans-serif">CAPTION ON A WEAK SCRIM</p>
    </div>
  `),
  /*
   * The floating-control cases. A floating button is judged against the INK
   * it covers, not against the box of the row it happens to sit beside.
   *
   *   · OVER A WORD    → the words are unreadable under the button → CAUGHT;
   *   · BESIDE A WORD  → the button sits over the blank right-hand end of a
   *     460px-wide row whose words are 48px wide at the left → the reader
   *     sees nothing covered → QUIET.
   *
   * The second case is the /map legend row, exactly.
   */
  "/fixture-fab-over-word": page(`
    <p style="position:fixed;left:100px;top:100px;margin:0;font:500 18px system-ui,sans-serif">COVERED WORDS HERE</p>
    <div class="chat-fab" style="position:fixed;left:140px;top:100px;width:44px;height:44px;background:#007190"></div>
  `),
  "/fixture-fab-beside-word": page(`
    <div style="position:fixed;left:100px;top:100px;width:460px;margin:0;font:500 18px system-ui,sans-serif">SHORT</div>
    <div class="chat-fab" style="position:fixed;left:500px;top:100px;width:44px;height:44px;background:#007190"></div>
  `),
  /*
   * display:contents GENERATES NO BOX. The element's children are laid out
   * as if it were not there, so its rect is a zero rect at the origin of the
   * page. A rule that used it as the box a label must stay inside reported
   * a city dossier's investment note as 1051px to the right of its own band.
   */
  "/fixture-display-contents": page(`
    <div class="stage">
      <h1>Contents</h1>
      <div style="display:contents;border-bottom:1px solid #12354e">
        <p class="plain" style="margin:0 0 0 200px">A NOTE FAR TO THE RIGHT</p>
      </div>
    </div>
  `),
  /*
   * Two identical display strings are a duplicate when they are within two
   * display lines of each other — when a reader reads them as the same
   * label stamped twice. The same two strings a third of a screen apart are
   * two separate records that happen to carry the same value, and the
   * separation is measured in BOTH axes: seven grade letters in a
   * three-column grid are 99px apart across the row, not on top of each
   * other.
   */
  "/fixture-duplicate-adjacent": page(`
    <div class="stage">
      <h1>Duplicate</h1>
      <div style="display:flex;gap:10px">
        <span style="font:700 32px system-ui,sans-serif">4.2</span>
        <span style="font:700 32px system-ui,sans-serif">4.2</span>
      </div>
    </div>
  `),
  "/fixture-duplicate-separate": page(`
    <div class="stage">
      <h1>Separate</h1>
      <div style="display:flex;gap:220px">
        <span style="font:700 32px system-ui,sans-serif">4.2</span>
        <span style="font:700 32px system-ui,sans-serif">4.2</span>
      </div>
    </div>
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

/* ------------------------------------------------------------------ */
/* Measure one fixture with the core.                                  */
/* ------------------------------------------------------------------ */

const browser = await chromium.launch();

async function measure(pathname) {
  const ctx = await browser.newContext({ viewport: { width: 900, height: 700 } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + pathname, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(200);
    return await page.evaluate(collideCore);
  } finally {
    await ctx.close();
  }
}

/** Run the RUNNER — the thing CI actually executes — and return its code. */
function runGate(pathname) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [RUNNER, base, "en"], {
      env: { ...process.env, SCITI_AUDIT_ROUTES: pathname },
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

try {
  console.log("\nFALSIFYING THE MASSACRE SWEEP");
  console.log("fixtures:", base, "\n");

  // 1. CLEAN
  const clean = await measure("/fixture-clean");
  console.log(`\n1. CLEAN BUILD`);
  check("clean page reports no text-over-text", () => {
    assert.equal(clean.overlaps.length, 0, `found ${clean.overlaps.length}: ${JSON.stringify(clean.overlaps.slice(0, 2))}`);
  });
  check("clean page reports no text outside its box", () => {
    assert.equal(clean.outside.length, 0, `found ${clean.outside.length}: ${JSON.stringify(clean.outside.slice(0, 2))}`);
  });
  check("clean page refused no measurement", () => {
    assert.equal(clean.refused.length, 0, `refused: ${JSON.stringify(clean.refused.slice(0, 2))}`);
  });

  // 2. OVERLAP
  console.log(`\n2. OVERLAPPING TEXT`);
  const overlap = await measure("/fixture-overlap");
  check("overlapping text is caught", () => {
    assert.ok(overlap.overlaps.length > 0, "the overlap rule did not fire on two texts in each other's ink");
  });

  // 3. BACK FACE SHOWN
  console.log(`\n3. A FLIPPED CARD'S VISIBLE FACE`);
  const shown = await measure("/fixture-backface-shown");
  check("text on the VISIBLE face is caught", () => {
    assert.ok(shown.overlaps.length > 0, "the visible face's text was not reported as overlapping");
  });

  // 4. BACK FACE HIDDEN — the control
  console.log(`\n4. THE SAME TEXT ON THE FACE TURNED AWAY (control)`);
  const hidden = await measure("/fixture-backface-hidden");
  check("text on the HIDDEN face stays quiet", () => {
    assert.equal(hidden.overlaps.length, 0, `the back-face filter did not hold: ${JSON.stringify(hidden.overlaps.slice(0, 2))}`);
  });

  // 5. ESCAPE
  console.log(`\n5. A LABEL THAT LEFT ITS BOX`);
  const escape = await measure("/fixture-escape");
  check("a label outside its box is caught", () => {
    assert.ok(escape.outside.length > 0, "the outside-box rule did not fire on a label that left its tile");
  });

  // 6. INVISIBLE TEXT
  console.log(`\n6. TEXT THAT CANNOT BE READ`);
  const invisible = await measure("/fixture-invisible");
  check("white text on a white page is caught", () => {
    assert.ok(invisible.lowContrast.length > 0, "the contrast rule did not fire on white text on white");
  });
  check("the clean page passes the contrast rule", () => {
    assert.equal(clean.lowContrast.length, 0, `found ${clean.lowContrast.length}: ${JSON.stringify(clean.lowContrast.slice(0, 2))}`);
  });

  // 7. THE SCRIM — a translucent ground is the ground, not the page behind it.
  console.log(`\n7. A TRANSLUCENT GROUND`);
  const scrimStrong = await measure("/fixture-scrim-strong");
  check("a caption on a strong dark scrim stays quiet", () => {
    assert.equal(scrimStrong.lowContrast.length, 0, `a legible caption was reported: ${JSON.stringify(scrimStrong.lowContrast.slice(0, 2))}`);
  });
  const scrimPale = await measure("/fixture-scrim-pale");
  check("a caption on a pale scrim is caught", () => {
    assert.ok(scrimPale.lowContrast.length > 0, "the contrast rule did not fire on white text over a pale scrim");
  });
  const scrimWeak = await measure("/fixture-scrim-weak");
  check("a caption on a weak dark scrim is caught", () => {
    assert.ok(scrimWeak.lowContrast.length > 0, "the contrast rule did not fire on white text over a weak scrim");
  });

  // 8. THE FLOATING CONTROL — judged against ink, not against the box.
  console.log(`\n8. A FLOATING CONTROL OVER TEXT`);
  const fabOver = await measure("/fixture-fab-over-word");
  check("a floating control over a word is caught", () => {
    assert.ok(fabOver.fabCollisions.length > 0, "the floating-control rule did not fire on a button sitting on a word");
  });
  const fabBeside = await measure("/fixture-fab-beside-word");
  check("a floating control over the blank end of a row stays quiet", () => {
    assert.equal(fabBeside.fabCollisions.length, 0, `the rule measured a box instead of ink: ${JSON.stringify(fabBeside.fabCollisions.slice(0, 2))}`);
  });

  // 9. display:contents GENERATES NO BOX.
  console.log(`\n9. A WRAPPER THAT GENERATES NO BOX`);
  const contents = await measure("/fixture-display-contents");
  check("a note inside a display:contents wrapper is not reported as escaped", () => {
    assert.equal(contents.outside.length, 0, `found ${contents.outside.length}: ${JSON.stringify(contents.outside.slice(0, 2))}`);
  });

  // 10. Two identical display strings: adjacent is a duplicate, apart is not.
  console.log(`\n10. THE SAME NUMBER TWICE`);
  const dupAdjacent = await measure("/fixture-duplicate-adjacent");
  check("the same number printed twice in a row is caught", () => {
    assert.ok(dupAdjacent.dupDisplay.some(d => d.coVisible), `the duplicate rule did not fire on two identical numbers 10px apart: ${JSON.stringify(dupAdjacent.dupDisplay.slice(0, 2))}`);
  });
  const dupSeparate = await measure("/fixture-duplicate-separate");
  check("the same number on two separate records stays quiet", () => {
    assert.ok(dupSeparate.dupDisplay.every(d => !d.coVisible), `the rule compared vertical offsets only: ${JSON.stringify(dupSeparate.dupDisplay.slice(0, 2))}`);
  });

  // 11. The GATE's exit code, not just the core's verdict.
  console.log(`\n6. THE GATE'S EXIT CODE`);
  const gateClean = await runGate("/fixture-clean");
  check("the gate passes the clean build (exit 0)", () => {
    assert.equal(gateClean.code, 0, `exit ${gateClean.code}\n${gateClean.out.slice(-1200)}`);
  });
  for (const [name, path] of [
    ["overlapping text", "/fixture-overlap"],
    ["a visible card face", "/fixture-backface-shown"],
    ["a label outside its box", "/fixture-escape"],
    ["white text on a white page", "/fixture-invisible"],
    ["a caption on a pale scrim", "/fixture-scrim-pale"],
    ["a caption on a weak dark scrim", "/fixture-scrim-weak"],
    ["a floating control over a word", "/fixture-fab-over-word"],
    ["the same number printed twice in a row", "/fixture-duplicate-adjacent"],
  ]) {
    const g = await runGate(path);
    check(`the gate fails on ${name} (exit 1)`, () => {
      assert.equal(g.code, 1, `exit ${g.code}\n${g.out.slice(-1200)}`);
    });
  }
  const gateHidden = await runGate("/fixture-backface-hidden");
  check("the gate stays quiet on the hidden face (exit 0)", () => {
    assert.equal(gateHidden.code, 0, `exit ${gateHidden.code}\n${gateHidden.out.slice(-1200)}`);
  });
} finally {
  await browser.close();
  server.close();
}

const failed = results.filter(r => !r.ok);
console.log(`\n================ FALSIFICATION ================`);
console.log(`cases: ${results.length}   passed: ${results.length - failed.length}   failed: ${failed.length}`);
if (failed.length) {
  for (const f of failed) console.log(`   FAILED: ${f.name}`);
  console.log(`\nVERDICT: FAIL — the sweep does not discriminate.`);
  process.exit(1);
}
console.log(`\nVERDICT: PASS — the sweep fires on every planted defect and stays quiet on the clean build.`);
