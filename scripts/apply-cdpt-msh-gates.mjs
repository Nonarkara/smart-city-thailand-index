/**
 * APPLY: add the two MSH gates and their falsifier to the CDPT script
 * ================================================================
 * CDPT is the one-command ship sequence. A gate that only runs in CI
 * is a gate that a local ship can skip, and a gate that only runs
 * locally is a gate that a push can skip. Both must run the same
 * gates.
 *
 * This script inserts, after the type-and-rhythm gate:
 *
 *   node scripts/audit/msh-audit.mjs --serve
 *   node scripts/audit/border-roles.mjs --serve
 *
 * and after the falsify-collide gate:
 *
 *   node scripts/audit/falsify-msh.mjs
 *
 * Asserted: the anchors are found exactly once, the insertion is
 * idempotent, and the shell script still parses.
 *
 * Run: node scripts/apply-cdpt-msh-gates.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const FILE = "scripts/cdpt.sh";

const TYPE_ANCHOR = 'node scripts/audit/type-and-rhythm.mjs --serve >"$LOG_DIR/cdpt-type.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-type.log"; die "type regression: a page carries more than one display-size statement, or a route was not measured"; }\n';
const TYPE_ADDITION =
  TYPE_ANCHOR +
  'node scripts/audit/msh-audit.mjs --serve >"$LOG_DIR/cdpt-msh.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-msh.log"; die "MSH: the primary action left the first screen, content bled past the page, or the chrome cost too much"; }\n' +
  'node scripts/audit/border-roles.mjs --serve >"$LOG_DIR/cdpt-borders.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-borders.log"; die "borders: every line on a page is the same line, or no section carries its own treatment"; }\n';

const FALSIFY_ANCHOR = 'node scripts/audit/falsify-collide.mjs >"$LOG_DIR/cdpt-falsify.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-falsify.log"; die "the massacre sweep no longer discriminates: a planted defect went uncaught"; }\n';
const FALSIFY_ADDITION =
  FALSIFY_ANCHOR +
  'node scripts/audit/falsify-msh.mjs >"$LOG_DIR/cdpt-falsify-msh.log" 2>&1 || { tail -30 "$LOG_DIR/cdpt-falsify-msh.log"; die "the MSH gates no longer discriminate: a planted defect went uncaught"; }\n';

let text = readFileSync(FILE, "utf8");

assert.equal(text.split(TYPE_ANCHOR).length - 1, 1, "the type-and-rhythm anchor was not found exactly once");
assert.equal(text.split(FALSIFY_ANCHOR).length - 1, 1, "the falsify-collide anchor was not found exactly once");

if (!text.includes("cdpt-msh.log")) {
  text = text.replace(TYPE_ANCHOR, TYPE_ADDITION);
}
if (!text.includes("cdpt-falsify-msh.log")) {
  text = text.replace(FALSIFY_ANCHOR, FALSIFY_ADDITION);
}

writeFileSync(FILE, text);

// The script must still be valid bash.
execFileSync("bash", ["-n", FILE], { stdio: "pipe" });

for (const gate of ["msh-audit.mjs --serve", "border-roles.mjs --serve", "falsify-msh.mjs"]) {
  assert.ok(text.includes(gate), `the gate "${gate}" must be in the CDPT script`);
}
console.log("✓ CDPT now runs the two MSH gates and their falsifier, and the script parses");
