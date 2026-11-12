/**
 * APPLY: point the falsification harness at the shared core module
 * ================================================================
 * The harness exists to prove the GATE fires. If the harness keeps its
 * own copy of the rule, the copy can drift from the gate and the
 * harness ends up proving something the gate never does. This script
 * replaces both duplicated measurement functions in the harness with
 * calls into scripts/audit/lib/msh-core.mjs — the same module the two
 * gates import.
 *
 * Asserted: the anchors are found exactly once, the braces balance
 * before and after, and the file is unchanged if it is already applied.
 *
 * Run: node scripts/apply-falsify-shared-core.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const FILE = "scripts/audit/falsify-msh.mjs";

function balanced(text, label) {
  let depth = 0;
  for (const ch of text) {
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    assert.ok(depth >= 0, `${label}: a closing brace without an opening one`);
  }
  assert.equal(depth, 0, `${label}: braces do not balance (depth ${depth})`);
}

function stripFunction(text, signature, label) {
  const start = text.indexOf(signature);
  assert.notEqual(start, -1, `${label}: could not find ${signature}`);
  const bodyStart = text.indexOf("{", text.indexOf(")", start));
  let depth = 0;
  for (let k = bodyStart; k < text.length; k++) {
    const ch = text[k];
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) {
        const removed = text.slice(start, k + 1);
        balanced(removed, `${label} (removed)`);
        return text.slice(0, start) + text.slice(k + 1);
      }
    }
  }
  throw new Error(`${label}: the body of ${signature} never closed`);
}

let text = readFileSync(FILE, "utf8");
balanced(text, FILE);

if (!text.includes('from "./lib/msh-core.mjs"')) {
  text = stripFunction(text, "async function measureMsh(pathname, viewport) {", `${FILE}: the duplicated MSH measurement`);
  text = stripFunction(text, "async function measureBorder(pathname) {", `${FILE}: the duplicated border measurement`);

  const anchor = 'import path from "node:path";';
  assert.equal(text.split(anchor).length - 1, 1, `${FILE}: the path import anchor was not found exactly once`);
  text = text.replace(
    anchor,
    `${anchor}\nimport { measureMsh, measureBorderRoles } from "./lib/msh-core.mjs";`,
  );

  // Put the two thin wrappers back, calling the shared core.
  const marker = "/** Run a RUNNER — the thing CI actually executes — and return its code. */";
  assert.equal(text.split(marker).length - 1, 1, `${FILE}: the runner marker was not found exactly once`);
  text = text.replace(
    marker,
    `/**
 * Measure one fixture with the SHARED core — the same module the two
 * gates import. The harness and the gate now run one implementation.
 */
async function measureMsh(pathname, viewport) {
  const ctx = await browser.newContext({ viewport: viewport || { width: 900, height: 700 } });
  const page = await ctx.newPage();
  try {
    await page.goto(base + pathname, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(150);
    return await page.evaluate(measureMsh, { route: pathname, actionSel: ".action", expectSel: "h1", viewport });
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
    return await page.evaluate(measureBorderRoles);
  } finally {
    await ctx.close();
  }
}

${marker}`,
  );
}

balanced(text, FILE);
writeFileSync(FILE, text);
console.log("✓ the falsification harness runs the same core the gates run");
