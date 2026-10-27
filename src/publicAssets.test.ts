/**
 * PUBLISHED ASSET NAMES AND REFERENCES
 * ====================================
 * Two laws about the files in public/:
 *
 *  1. A published filename may not contain a character that is invalid on
 *     NTFS or HFS+ (" : < > | * ?). GitHub's artifact upload refuses the
 *     whole artifact when one file does, so a single colon in a heritage
 *     photo's name broke the validated-build release path — and it would
 *     break a Windows reader's copy of the site too.
 *
 *  2. Every asset the source points at must exist on disk. A rename that
 *     misses a reference ships a broken photograph that no test would
 *     have caught.
 */
import { describe, expect, it } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");
const SRC = path.join(ROOT, "src");

/** Characters NTFS and HFS+ refuse. A colon is the one that bit us. */
const INVALID = /["*:<>?|]/;

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

describe("published assets", () => {
  it("no filename carries a character that breaks another filesystem", () => {
    const offenders = walk(PUBLIC)
      .map((f) => path.relative(PUBLIC, f))
      .filter((rel) => INVALID.test(path.basename(rel)))
      .map((rel) => rel);
    expect(offenders, "a published filename uses a character that is invalid on NTFS").toEqual([]);
  });

  it("every image path in the source exists on disk", () => {
    const sources = walk(SRC).filter((f) => /\.(tsx|ts)$/.test(f));
    const referenced = new Set<string>();
    for (const file of sources) {
      const text = fs.readFileSync(file, "utf8");
      // Absolute asset paths in the source: "/folder/name.ext".
      for (const m of text.matchAll(/["'](\/[^"'`\s]+?\.(?:webp|jpe?g|png|svg|avif|gif))["']/gi)) {
        referenced.add(m[1]);
      }
    }
    const missing = [...referenced].filter((rel) => !fs.existsSync(path.join(PUBLIC, rel)));
    expect(missing, "the source points at an image that is not in public/").toEqual([]);
  });
});
