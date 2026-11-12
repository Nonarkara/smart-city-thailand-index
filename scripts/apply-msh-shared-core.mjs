/**
 * APPLY: point the two MSH gates at the shared core module
 * ==========================================================
 * The gate and the harness that proves the gate fires must run the SAME
 * code. This script:
 *
 *   1. removes the inlined copy of the measurement from each gate;
 *   2. imports it from scripts/audit/lib/msh-core.mjs instead;
 *   3. leaves every other line of each gate untouched.
 *
 * Every edit is ASSERTED: the anchor must be found exactly the expected
 * number of times, the braces must balance before and after, and the
 * file must not change if it is already applied.
 *
 * Run: node scripts/apply-msh-shared-core.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const MSH = "scripts/audit/msh-audit.mjs";
const BORDER = "scripts/audit/border-roles.mjs";

function once(text, anchor, label) {
  const count = text.split(anchor).length - 1;
  assert.equal(count, 1, `${label}: expected the anchor exactly once, found ${count}`);
}

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
  assert.notEqual(bodyStart, -1, `${label}: could not find the body of ${signature}`);
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

/* ── the MSH gate ──────────────────────────────────────────────────── */
{
  let text = readFileSync(MSH, "utf8");
  balanced(text, MSH);

  if (!text.includes('from "./lib/msh-core.mjs"')) {
    text = stripFunction(
      text,
      "function measureMsh({ route, actionSel, expectSel, viewport }) {",
      `${MSH}: the inlined measurement`,
    );
    // The measurement's own comment block belongs with the measurement.
    text = text.replace(
      /\/\/ ─+\n\/\/ THE MEASUREMENT\n[\s\S]*?\/\/ ─+\n/,
      "",
    );
    once(text, 'import { chromium } from "@playwright/test";', MSH);
    text = text.replace(
      'import { chromium } from "@playwright/test";',
      'import { chromium } from "@playwright/test";\nimport { measureMsh } from "./lib/msh-core.mjs";',
    );
  }

  balanced(text, MSH);
  writeFileSync(MSH, text);
  console.log(`✓ ${MSH} now imports the shared measurement`);
}

/* ── the border gate ───────────────────────────────────────────────── */
{
  let text = readFileSync(BORDER, "utf8");
  balanced(text, BORDER);

  if (!text.includes('from "./lib/msh-core.mjs"')) {
    text = stripFunction(text, "function measureBorderRoles() {", `${BORDER}: the inlined measurement`);
    once(text, 'import { chromium } from "@playwright/test";', BORDER);
    text = text.replace(
      'import { chromium } from "@playwright/test";',
      'import { chromium } from "@playwright/test";\nimport { measureBorderRoles } from "./lib/msh-core.mjs";',
    );
  }

  balanced(text, BORDER);
  writeFileSync(BORDER, text);
  console.log(`✓ ${BORDER} now imports the shared measurement`);
}

console.log("✓ both MSH gates share one measurement");
