/**
 * THE REAL BOLD
 * =============
 * IBM Plex Mono was loaded at 400/500/600. 278 rules on this site ask
 * for weight 700 in mono, so every eyebrow, label and numeral was
 * SYNTHETICALLY bolded by the browser — the browser smudges a stroke
 * onto a shape that was not drawn that way. It reads as a slightly
 * soft, slightly wrong weight, on every label in the product.
 *
 * Load the real 700. The URL appears twice — the preload link and the
 * noscript fallback — and both must change.
 */
import { readFileSync, writeFileSync } from "node:fs";

const FILE = "index.html";
const html = readFileSync(FILE, "utf8");

const NEEDLE = `IBM+Plex+Mono:wght@400;500;600`;
const REPLACEMENT = `IBM+Plex+Mono:wght@400;500;600;700`;

const count = html.split(NEEDLE).length - 1;
if (count !== 2) {
  throw new Error(`expected 2 occurrences (preload + noscript), found ${count}`);
}
const out = html.split(NEEDLE).join(REPLACEMENT);
if (!out.includes(REPLACEMENT)) throw new Error("replacement lost");

writeFileSync(FILE, out);
console.log(`  ✓ ${FILE}: ${count} font URLs now request the real 700`);
