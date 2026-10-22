/**
 * THE REPAIR
 * ==========
 * Restores the <section> open-tag lines of a page from git HEAD.
 *
 * Why: a first pass of the rhythm law rebuilt the inline style of a
 * <section> wrongly — it dropped the JSX container's closing brace and
 * advanced the cursor to the length of the REBUILT tag rather than past
 * the original, so the tail of the original tag was re-emitted after it.
 * The result was invalid JSX in ten pages.
 *
 * The repair is surgical on purpose. Only the <section> OPEN TAG can
 * carry the damage — the corruption never reaches an inner element, and
 * the type-law edits live on inner elements. So the open-tag line is
 * restored from HEAD and everything else in the file is left exactly as
 * it is. Nothing is reverted wholesale: the pages also carry the
 * Energy/Governance wiring, which must survive.
 *
 * Run: node scripts/repair-section-tags.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = path.resolve(".");
const files = fs
  .readdirSync(path.join(ROOT, "src"))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join("src", f));

// The corrupted form: "style={" followed by whitespace and a property —
// the JSX expression container's second brace is gone.
const CORRUPT = /style=\{\s/;

let repaired = 0;
let skipped = [];

for (const rel of files) {
  const abs = path.join(ROOT, rel);
  const cur = fs.readFileSync(abs, "utf8");
  if (!CORRUPT.test(cur)) continue;

  let head;
  try {
    head = execFileSync("git", ["show", `HEAD:${rel}`], { cwd: ROOT, encoding: "utf8" });
  } catch {
    skipped.push(`${rel}: not in HEAD`);
    continue;
  }
  const curLines = cur.split("\n");
  const headLines = head.split("\n");
  if (curLines.length !== headLines.length) {
    skipped.push(`${rel}: line count moved ${headLines.length} → ${curLines.length}; left alone`);
    continue;
  }

  let changed = 0;
  for (let i = 0; i < curLines.length; i++) {
    const line = curLines[i];
    if (!line.includes("<section")) continue;
    if (!CORRUPT.test(line)) continue;
    const headLine = headLines[i];
    if (!headLine.includes("<section")) {
      skipped.push(`${rel}:${i + 1}: HEAD has no section on this line — left alone`);
      continue;
    }
    curLines[i] = headLine;
    changed++;
  }
  if (changed) {
    fs.writeFileSync(abs, curLines.join("\n"));
    repaired += changed;
    console.log(`${rel}: restored ${changed} section tag line(s)`);
  }
}

console.log(`\nsection tags restored: ${repaired}`);
if (skipped.length) {
  console.log("left alone (needs a human eye):");
  for (const s of skipped) console.log("  ·", s);
}

// Nothing may remain in the corrupted shape.
let remaining = 0;
for (const rel of files) {
  const cur = fs.readFileSync(path.join(ROOT, rel), "utf8");
  cur.split("\n").forEach((line, i) => {
    if (line.includes("<section") && CORRUPT.test(line)) {
      console.error(`STILL CORRUPT ${rel}:${i + 1}: ${line.trim()}`);
      remaining++;
    }
  });
}
if (remaining) {
  console.error(`\n${remaining} section tag(s) still corrupted.`);
  process.exit(1);
}
console.log("no corrupted section tags remain.");
