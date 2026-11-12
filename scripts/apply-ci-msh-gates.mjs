/**
 * APPLY: add the two MSH gates and their falsifier to the CI workflow
 * ===============================================================
 * The GitHub Actions workflow runs the same gates CDPT runs. A gate that
 * exists only locally is a gate that can be skipped by pushing.
 *
 * This script inserts, after the falsify-collide step, in BOTH jobs:
 *
 *   node scripts/audit/msh-audit.mjs --serve
 *   node scripts/audit/border-roles.mjs --serve
 *   node scripts/audit/falsify-msh.mjs
 *
 * Asserted: the anchor appears exactly twice (the two jobs), the
 * insertion is idempotent, and the YAML stays structurally sound.
 *
 * Run: node scripts/apply-ci-msh-gates.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const FILE = ".github/workflows/github-pages.yml";

const ANCHOR = "      - run: node scripts/audit/falsify-collide.mjs\n";
const ADDITION =
  "      - run: node scripts/audit/falsify-collide.mjs\n" +
  "      - run: node scripts/audit/msh-audit.mjs --serve\n" +
  "      - run: node scripts/audit/border-roles.mjs --serve\n" +
  "      - run: node scripts/audit/falsify-msh.mjs\n";

let text = readFileSync(FILE, "utf8");

const anchorCount = text.split(ANCHOR).length - 1;
assert.equal(anchorCount, 2, `expected the anchor in both jobs, found ${anchorCount}`);

if (!text.includes("node scripts/audit/msh-audit.mjs --serve")) {
  text = text.split(ANCHOR).join(ADDITION);
  writeFileSync(FILE, text);
  console.log("✓ both CI jobs now run the two MSH gates and their falsifier");
} else {
  console.log("· the CI workflow already runs the MSH gates");
}

// The workflow must still be well-formed: no tabs, and the two jobs
// ("verify" and "deploy") are still there.
const lines = text.split("\n");
for (const line of lines) {
  assert.ok(!line.includes("\t"), "the workflow must not contain tabs");
}
for (const job of ["verify:", "deploy:"]) {
  assert.ok(text.includes(`\n  ${job}\n`), `the workflow must still have the ${job} job`);
}
for (const gate of ["msh-audit.mjs --serve", "border-roles.mjs --serve", "falsify-msh.mjs"]) {
  const count = text.split(gate).length - 1;
  assert.equal(count, 2, `the gate "${gate}" must run in both jobs, found ${count}`);
}
console.log("✓ the workflow is well-formed");
