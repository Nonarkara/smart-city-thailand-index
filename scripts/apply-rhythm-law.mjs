/**
 * THE RHYTHM LAW — applied to the stylesheet and to the pages
 * ===========================================================
 * The vertical rhythm is the second half of the type law. Three text
 * sizes say WHAT a division is; the rhythm says WHERE it starts.
 *
 * The site shipped with the rhythm decided in two places at once, and
 * neither of them was a law:
 *
 *   • every section class invented its own bottom margin — 1rem,
 *     1.25rem, 2rem, 2.5rem, 3rem — so the step between two sections
 *     was different on every page;
 *   • and every page then wrote its OWN margin into the markup —
 *     style={{ marginBottom: "2.5rem" }}, "3rem", "5rem" — where an
 *     inline style cannot be reached by any stylesheet rule, so no law
 *     could ever hold it still.
 *
 * That is why the vertical rhythm read flat: nobody was holding it.
 *
 * So the law is short, and it has two halves:
 *
 *   THE STEP    the gap between two sections is always one step (32px).
 *   THE MIRROR  the section owns the step above its content, so its
 *               first child must not declare a second one.
 *   THE OWNER   a section owns no space BELOW its content. The next
 *               section's step is that space. A band is the exception:
 *               its padding lives inside its own ground, and the
 *               colour change marks the division.
 *   ONE OWNER   the rhythm lives in the stylesheet, never in a
 *               style attribute, because an inline value is not a
 *               decision anyone can later read.
 *
 * Everything else follows: one gap, one owner, one step.
 *
 * This script edits by BRACE MATCHING and by TAG SCANNING, never by a
 * loose regex: a regex that spans rule bodies can swallow two thousand
 * lines of CSS. Every edit is counted and asserted. It is idempotent —
 * running it twice changes nothing and complains about nothing.
 *
 * Run: node scripts/apply-rhythm-law.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(".");
const CSS = path.join(ROOT, "src/styles.css");
let src = fs.readFileSync(CSS, "utf8");
const edits = [];
const notes = [];

/* ══════════════════════════════════════════════════════════════════════
   1. THE STYLESHEET — a real parser, not a regex
   ══════════════════════════════════════════════════════════════════════ */

/**
 * Walk the stylesheet and return every rule with its selector, body
 * bounds and byte offsets. Comments and strings are skipped so a brace
 * inside a comment cannot open a rule.
 *
 * At-rules are containers, not rules: a rule inside @media keeps ITS OWN
 * selector. Collapsing the two is how a parser ends up reporting
 * "@media (max-width: 480px) .foo" as a selector, and an edit aimed at
 * ".foo" then quietly finds nothing — or worse, something else.
 */
function parseRules(css) {
  const rules = [];

  const skipComment = (j, end) => {
    if (css[j] === "/" && css[j + 1] === "*") {
      const e = css.indexOf("*/", j + 2);
      return e < 0 || e > end ? end : e + 2;
    }
    return j;
  };
  const skipString = (j, end) => {
    const q = css[j];
    let k = j + 1;
    while (k < end && css[k] !== q) {
      if (css[k] === "\\") k++;
      k++;
    }
    return Math.min(k + 1, end);
  };
  /** Index of the "}" that closes the block opened at openIdx. */
  const matchBrace = (openIdx, end) => {
    let d = 1;
    let k = openIdx + 1;
    while (k < end) {
      k = skipComment(k, end);
      if (k >= end) break;
      const c = css[k];
      if (c === '"' || c === "'") { k = skipString(k, end); continue; }
      if (c === "{") d++;
      else if (c === "}") { d--; if (d === 0) return k; }
      k++;
    }
    return -1;
  };

  const scan = (start, end) => {
    let j = start;
    let preludeStart = start;
    let prelude = "";
    while (j < end) {
      j = skipComment(j, end);
      if (j >= end) break;
      const c = css[j];
      if (c === '"' || c === "'") { j = skipString(j, end); continue; }
      if (c === "{") {
        const bodyEnd = matchBrace(j, end);
        if (bodyEnd < 0) break;
        const sel = prelude.trim();
        rules.push({
          selector: sel,
          atRule: sel.startsWith("@"),
          preludeStart,
          bodyStart: j,
          bodyEnd,
          end: bodyEnd + 1,
        });
        if (sel.startsWith("@")) scan(j + 1, bodyEnd);   // recurse into the container
        j = bodyEnd + 1;
        prelude = "";
        preludeStart = j;
        continue;
      }
      if (c === ";") {
        prelude = "";
        preludeStart = j + 1;
        j++;
        continue;
      }
      prelude += c;
      j++;
    }
  };
  scan(0, css.length);
  return rules;
}

/** All rule selectors that contain `sel` as one of their comma parts. */
function rulesFor(sel) {
  // BOTTOM-UP, always. Every edit below rewrites the file, and an
  // offset computed on the old string is only valid for rules that come
  // AFTER the one just edited. Editing top-down deletes the wrong
  // characters — silently, and the stylesheet still parses.
  return parseRules(src)
    .filter((r) => r.selector.split(",").some((part) => part.trim() === sel))
    .sort((a, b) => b.bodyStart - a.bodyStart);
}

/**
 * Set a declaration inside the named rule. Brace-matched by construction
 * because the rule body is located by the parser, not by a regex.
 */
function setDecl(sel, prop, value, label) {
  const hits = rulesFor(sel);
  if (!hits.length) throw new Error(`no rule for selector: ${sel} (${label})`);
  let changed = 0;
  for (const rule of hits) {
    const body = src.slice(rule.bodyStart + 1, rule.bodyEnd);
    const re = new RegExp(`(^|[;{\\s])${prop}\\s*:\\s*[^;}]+;`, "g");
    const newBody = body.replace(re, (m, prefix) => {
      const next = `${prefix}${prop}: ${value};`;
      if (m === next) return m;      // already at the target
      changed++;
      return next;
    });
    if (newBody !== body) {
      src = src.slice(0, rule.bodyStart + 1) + newBody + src.slice(rule.bodyEnd);
    }
  }
  if (!changed) {
    // already at the target — a hit, not a miss, so the script is safe
    // to run twice without complaining.
    edits.push(`${label} → ${value} (already)`);
  } else {
    edits.push(`${label} → ${value}`);
  }
}

/** Delete a declaration entirely. Absent is a legitimate state here. */
function dropDecl(sel, prop, label) {
  const hits = rulesFor(sel);
  if (!hits.length) {
    edits.push(`${label} — no such rule`);
    return;
  }
  let changed = 0;
  for (const rule of hits) {
    const body = src.slice(rule.bodyStart + 1, rule.bodyEnd);
    const re = new RegExp(`\\n?\\s*${prop}\\s*:\\s*[^;}]+;`, "g");
    const newBody = body.replace(re, "");
    if (newBody !== body) {
      src = src.slice(0, rule.bodyStart + 1) + newBody + src.slice(rule.bodyEnd);
      changed++;
    }
  }
  edits.push(changed ? `${label} — removed ${prop}` : `${label} — ${prop} absent`);
}

/**
 * Delete a whole rule — but ONLY an empty one. A rule that merely
 * shares a selector (a comma list, a shared typography rule) is not the
 * one being removed, and deleting it takes a page's type scale with it.
 */
function dropEmptyRule(sel, label) {
  const hits = rulesFor(sel);
  let changed = 0;
  for (const rule of hits) {
    const body = src.slice(rule.bodyStart + 1, rule.bodyEnd).trim();
    if (body !== "") continue;
    // take the whitespace before the rule with it
    let start = rule.preludeStart;
    while (start > 0 && (src[start - 1] === " " || src[start - 1] === "\t")) start--;
    src = src.slice(0, start) + src.slice(rule.end);
    changed++;
  }
  edits.push(changed ? `${label} — empty rule removed` : `${label} — no empty rule`);
}

/** Replace an exact block of text. Throws if absent or ambiguous. */
function replaceExact(from, to, label) {
  const i = src.indexOf(from);
  if (i < 0) throw new Error(`anchor not found: ${label}`);
  if (src.indexOf(from, i + 1) >= 0) throw new Error(`anchor is ambiguous: ${label}`);
  src = src.slice(0, i) + to + src.slice(i + from.length);
  edits.push(label);
}

/**
 * Replace the region between two anchors, whatever is currently in it.
 * This is the idempotent form: the first run rewrites the block, and
 * every later run must be able to rewrite it AGAIN — so the block is
 * located by its boundaries, not by the exact text that happened to be
 * there last time.
 */
function replaceBetween(startAnchors, endAnchors, to, label) {
  const starts = Array.isArray(startAnchors) ? startAnchors : [startAnchors];
  const ends = Array.isArray(endAnchors) ? endAnchors : [endAnchors];
  // The EARLIEST match across the candidates wins: the block's first
  // line is the one that starts it.
  let a = -1;
  for (const anchor of starts) {
    const at = src.indexOf(anchor);
    if (at < 0) continue;
    if (a < 0 || at < a) a = at;
  }
  if (a < 0) throw new Error(`start anchor not found: ${label}`);
  let b = -1;
  for (const e of ends) {
    const at = src.indexOf(e, a);
    if (at < 0) continue;
    if (b >= 0) throw new Error(`end anchor is ambiguous: ${label}`);
    b = at;
  }
  if (b < 0) throw new Error(`end anchor not found: ${label}`);
  src = src.slice(0, a) + to + src.slice(b);
  edits.push(label);
}

/* ── 1a. THE RHYTHM BLOCK ─────────────────────────────────────────────── */

const OLD_STEP = `/* The step between two sections is the same everywhere on the site. */
main > section + section,
main > div > section + section { margin-top: var(--rhythm-section); }

/* A section that OPENS with a heading carries its own landmark — the
 * hairline and the step above it. The section's own top padding would be
 * a SECOND gap above the same division, and that is how a page ended up
 * with 180px between a paragraph and the next heading. One division, one
 * gap. */
main > section:has(> h2:first-child),
main > div > section:has(> h2:first-child) { padding-top: 0; }`;

const NEW_STEP = `/* ─── THE SECTION LANDMARK ───────────────────────────────────────────────
 * With three text sizes, the section level cannot be carried by scale. It
 * is carried by a RULE and by AIR: a hairline above the heading, and a
 * fixed step between sections. That is the Swiss grid's way of saying
 * "this is a division" without a bigger number — and it is what lets the
 * hierarchy survive a squinted screenshot on a phone.
 *
 * It applies to a heading that IS a section — a direct child of one — and
 * not to a heading inside a card, which is the card's title and is meant
 * to read as part of the card.
 */
section > h2 {
  margin-top: 0;
  margin-bottom: .75rem;
  padding-top: .8rem;
  border-top: 1px solid var(--5);
}

/* ─── THE RHYTHM — one division, one gap ─────────────────────────────────
 * The vertical rhythm is the second half of the type law. Three sizes say
 * WHAT a division is; the rhythm says WHERE it starts.
 *
 * The site shipped with the rhythm decided in two places at once, and
 * neither of them was a law:
 *
 *   • every section class invented its own bottom margin — 1rem, 1.25rem,
 *     2rem, 2.5rem, 3rem — so the step between two sections was different
 *     on every page;
 *   • and every page then wrote its OWN margin into the markup —
 *     style={{ marginBottom: "2.5rem" }}, "3rem", "5rem" — where an inline
 *     value cannot be reached by any stylesheet rule, so no law could ever
 *     hold it still.
 *
 * That is why the vertical rhythm read flat: nobody was holding it. The
 * measured result was 48px + 32px + 16px of air between a paragraph and
 * the next heading on ten pages, with nothing marking it — a hole the
 * reader pays for in scrolling and in lost context.
 *
 * So the law is short:
 *
 *   THE STEP    the gap between two sections is always one step (32px).
 *   THE MIRROR  the section owns the step above its content, so its first
 *               child must not declare a second one.
 *   THE OWNER   a section owns no space BELOW its content either. The next
 *               section's step is that space. A band is the exception:
 *               its padding lives inside its own ground, and the colour
 *               change marks the division.
 *   ONE OWNER   the rhythm lives in the stylesheet, never in a style
 *               attribute, because an inline value is not a decision
 *               anyone can later read.
 *
 * Everything else follows from that: one gap, one owner, one step.
 *
 * The class in [class] is not decoration. "main > div > section" is three
 * TYPE selectors — specificity (0,0,3) — and every per-page rule on this
 * site is a class, which is (0,1,0) and wins. The law has to out-specify
 * the rules it replaces, or it is only a comment.
 */
main section[class] + section[class] { margin-top: var(--rhythm-section); }

main section[class] + section[class] > :first-child { margin-top: 0; }

main section[class] { margin-bottom: 0; }

/* A page's opening section owns no space below itself either: the
 * section that follows it takes the step. The "main >" prefix is not
 * decoration — without it these rules lose to the per-page hero rules
 * that sit later in the stylesheet, and the law would be a comment. */
main .page-hero,
main > .audit-hero, main > div > .audit-hero,
main > .methodology-hero, main > div > .methodology-hero,
main > .partnerships-hero, main > div > .partnerships-hero,
main > .rankings-hero, main > div > .rankings-hero,
main > .story-hero, main > div > .story-hero,
main > .showcase-hero, main > div > .showcase-hero,
main > .city-detail-hero, main > div > .city-detail-hero { padding-bottom: 0; }`;

// The block is located by its BOUNDARIES so the script can rewrite it on
// every run, not only the first. A block that can only be written once
// is a block that silently stops being true.
replaceBetween(
  ["/* ─── THE SECTION LANDMARK", "/* ─── THE RHYTHM — one division, one gap"],
  [".section-intro {"],
  NEW_STEP + "\n",
  "the rhythm law block",
);

/* ── 1b. THE NAMED OFFENDERS, each one measured ──────────────────────── */

// The timeline's last item left a 48px margin under a container that
// already had 32px of padding, under a section that then took another
// 32px step: 112px of nothing between a year and the next heading.
setDecl(".story-tl-item", "margin-bottom", "2rem", ".story-tl-item margin-bottom");
setDecl(".story-timeline", "padding", "2rem 0 0", ".story-timeline padding");

// A grid gap of 48px between a supporting paragraph and the thesis line
// inside one band. Within a group is smaller than between groups.
setDecl(".opening-argument-grid", "margin-bottom", "var(--rhythm-section)", ".opening-argument-grid margin-bottom");

// A grid gap of 28px between two blocks of the same group: off the scale.
setDecl(".invest-ccdr-grid", "gap", "var(--rhythm-block)", ".invest-ccdr-grid gap");

// The grid's own bottom margin was 40px, and the thesis below it sits
// inside the same panel — a second owner for one division.
setDecl(".invest-ccdr-grid", "margin-bottom", "var(--rhythm-section)", ".invest-ccdr-grid margin-bottom");

// A section's own top padding is a second owner: the step above it
// already owns that space.
setDecl(".baseline-table-section", "padding", "0 0 clamp(2rem, 5vw, 3rem)", ".baseline-table-section padding");

// And so is the first row's own top padding inside that section.
setDecl(".baseline-table-header", "padding", "0", ".baseline-table-header padding");

// margin-top:auto inside a flex card pushes the last line to the bottom
// of the tallest sibling — a hole inside the card that nothing explains.
dropDecl(".audit-source-frequency", "margin-top", ".audit-source-frequency");
dropEmptyRule(".audit-source-frequency", ".audit-source-frequency (empty rule)");

// The same trick inside a route button: the strong was pushed 55px down
// the card, opening a hole no rule and no colour change accounted for.
dropDecl(".audit-route-grid button > strong", "margin-top", ".audit-route-grid button > strong");

// The shared typography rule for the two audit source labels. It was
// taken out by a faulty edit that removed every rule sharing a selector;
// this restores it and keeps the script the owner of the file's truth.
if (!src.includes(".audit-source-type,\n.audit-source-frequency {")) {
  replaceExact(
    `.audit-source-card > span:not(.audit-source-type, .audit-source-frequency) { font: 400 var(--text-micro)/1.55 var(--font); color: var(--2); }`,
    `.audit-source-card > span:not(.audit-source-type, .audit-source-frequency) { font: 400 var(--text-micro)/1.55 var(--font); color: var(--2); }

.audit-source-type,
.audit-source-frequency {
  font: 600 var(--text-micro)/1.4 var(--mono);
  color: var(--gold-text, #946B0C);
  text-transform: uppercase;
  letter-spacing: .06em;
}

.audit-source-frequency { overflow-wrap: anywhere; }`,
    "restore the shared audit source label rule",
  );
} else {
  edits.push("the shared audit source label rule → present");
}

fs.writeFileSync(CSS, src);

/* ══════════════════════════════════════════════════════════════════════
   2. THE PAGES — the rhythm moves out of the markup
   ══════════════════════════════════════════════════════════════════════ */

/**
 * The opening section of a page gives up its bottom padding: the
 * section that follows it takes the step. Some pages already name their
 * hero (audit-hero, rankings-hero, story-hero); the rest did not, so
 * there was nothing for the law to hold. This names them.
 *
 * Only the OPENING section is touched. It is the one that sits on the
 * page ground, where its padding is invisible air rather than a band's
 * own colour.
 */
const PAGE_HERO_FILES = [
  "AboutPage.tsx",
  "AsusPage.tsx",
  "CityDetailPage.tsx",
  "ComparePage.tsx",
  "CreativeEconomyPage.tsx",
  "RankingsPage.tsx",
  "WhyPage.tsx",
];

function markPageHero(tsx, filename) {
  const at = tsx.indexOf("<section");
  if (at < 0) return { result: tsx, changed: false };
  const after = tsx[at + 8];
  if (after && /[A-Za-z0-9_]/.test(after)) return { result: tsx, changed: false };
  const tagEnd = tsx.indexOf(">", at);
  if (tagEnd < 0) return { result: tsx, changed: false };
  const tag = tsx.slice(at, tagEnd + 1);
  const clsAt = tag.indexOf('className="');
  if (clsAt < 0) return { result: tsx, changed: false };
  const cls = tag.slice(clsAt + 11, tag.indexOf('"', clsAt + 11));
  if (cls.split(/\s+/).includes("page-hero")) return { result: tsx, changed: false };
  if (/hero|masthead/.test(cls)) return { result: tsx, changed: false };
  const newTag = tag.slice(0, clsAt + 11) + "page-hero " + tag.slice(clsAt + 11);
  return { result: tsx.slice(0, at) + newTag + tsx.slice(tagEnd + 1), changed: true };
}

/**
 * Rewrite every <section …> style attribute in one pass. The tag is
 * located by scanning, not by a regex over the file: a template literal
 * inside the tag can contain braces and quotes, and a regex that spans
 * them will match the wrong text.
 */
function applySectionStyles(tsx, filename) {
  let result = "";
  let i = 0;
  const removed = [];

  while (true) {
    const at = tsx.indexOf("<section", i);
    if (at < 0) { result += tsx.slice(i); break; }
    const after = tsx[at + 8];
    if (after && /[A-Za-z0-9_]/.test(after)) {
      result += tsx.slice(i, at + 8);
      i = at + 8;
      continue;
    }

    let j = at + 8, depth = 0, quote = null, end = -1;
    while (j < tsx.length) {
      const c = tsx[j];
      if (quote) {
        if (c === "\\") { j += 2; continue; }
        if (c === quote) quote = null;
        j++;
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { quote = c; j++; continue; }
      if (c === "{") { depth++; j++; continue; }
      if (c === "}") { depth--; j++; continue; }
      if (c === ">" && depth === 0) { end = j; break; }
      j++;
    }
    if (end < 0) { result += tsx.slice(i); break; }
    const tag = tsx.slice(at, end + 1);

    const styleAt = tag.indexOf("style={{");
    if (styleAt < 0) {
      result += tsx.slice(i, end + 1);
      i = end + 1;
      continue;
    }
    const styleOpen = tag.indexOf("{", styleAt);
    let d = 0, k = styleOpen, close = -1;
    while (k < tag.length) {
      if (tag[k] === "{") d++;
      else if (tag[k] === "}") { d--; if (d === 0) { close = k; break; } }
      k++;
    }
    if (close < 0) { result += tsx.slice(i, end + 1); i = end + 1; continue; }

    const inner = tag.slice(styleOpen + 1, close).replace(/^\{|\}$/g, "");
    // Split on commas that are NOT inside a string: a value like
    // boxShadow: "0 0 0 1px red, 0 0 0 2px blue" is one declaration.
    const decls = [];
    {
      let buf = "";
      let q = null;
      for (let n = 0; n < inner.length; n++) {
        const ch = inner[n];
        if (q) {
          if (ch === "\\") { buf += ch + (inner[++n] || ""); continue; }
          if (ch === q) q = null;
          buf += ch;
          continue;
        }
        if (ch === '"' || ch === "'" || ch === "`") { q = ch; buf += ch; continue; }
        if (ch === ",") { decls.push(buf.trim()); buf = ""; continue; }
        buf += ch;
      }
      if (buf.trim()) decls.push(buf.trim());
    }
    const keep = [], drop = [];
    for (const dcl of decls) {
      const m = /^([a-zA-Z]+)\s*:\s*(.+)$/.exec(dcl);
      if (!m) { keep.push(dcl); continue; }
      const prop = m[1];
      if (prop === "marginBottom" || prop === "marginTop" || prop === "paddingBottom") {
        drop.push(`${prop}: ${m[2]}`);
      } else {
        keep.push(dcl);
      }
    }

    let newTag;
    if (!keep.length) {
      // drop the attribute entirely: the section's own spacing is the
      // stylesheet's business now.
      newTag = tag.slice(0, styleAt).replace(/\s+$/, "") + tag.slice(close + 1);
    } else {
      // style={{ … }} — BOTH braces of the JSX expression container and
      // BOTH braces of the object literal. Rebuilding it as style={ … }
      // silently drops the container's closing brace and the page does
      // not compile.
      newTag = tag.slice(0, styleAt).replace(/\s+$/, "")
        + ` style={{ ${keep.join(", ")} }}`
        + tag.slice(close + 1);
    }
    if (newTag !== tag) {
      if (drop.length) removed.push(`${filename}: ${drop.join(" + ")}`);
      result += tsx.slice(i, at) + newTag;
      // Advance past the ORIGINAL tag, not past the rebuilt one: the
      // rebuilt tag is shorter, and stopping at its length would re-emit
      // the tail of the original in the middle of the tag.
      i = end + 1;
    } else {
      result += tsx.slice(i, end + 1);
      i = end + 1;
    }
  }
  return { result, removed };
}

const pages = fs
  .readdirSync(path.join(ROOT, "src"))
  .filter((f) => f.endsWith(".tsx"))
  .map((f) => path.join(ROOT, "src", f));

let touched = 0;
let tagCount = 0;
for (const file of pages) {
  const name = path.basename(file);
  const before = fs.readFileSync(file, "utf8");
  let { result, removed } = applySectionStyles(before, name);

  // The opening section is named, so the law can hold its bottom padding.
  if (PAGE_HERO_FILES.includes(name)) {
    const hero = markPageHero(result, name);
    if (hero.changed) {
      result = hero.result;
      removed = [...removed, `${name}: named the opening section page-hero`];
    }
  }

  if (result !== before) {
    // ── the proof that the edit was safe ──────────────────────────────
    // The number of section tags must not move, and every style
    // attribute must still be a well-formed style={{ … }}. A rebuild
    // that drops a brace produces a page that does not compile, and a
    // compile check happens much later than a rewrite.
    const beforeTags = (before.match(/<section\b/g) || []).length;
    const afterTags = (result.match(/<section\b/g) || []).length;
    if (beforeTags !== afterTags) {
      console.error(`${file}: section count moved ${beforeTags} → ${afterTags}. Aborting.`);
      process.exit(1);
    }
    const badStyle = result.match(/style=\{(?!\{)/g);
    if (badStyle) {
      console.error(`${file}: ${badStyle.length} malformed style attribute(s). Aborting.`);
      process.exit(1);
    }
    fs.writeFileSync(file, result);
    touched++;
    tagCount += afterTags;
    for (const r of removed) notes.push("  " + r);
  }
}

/* ══════════════════════════════════════════════════════════════════════
   3. THE VERDICT
   ══════════════════════════════════════════════════════════════════════ */

// The stylesheet must still balance. A brace count that drifts means a
// rule was swallowed, and a swallowed rule is a silently broken page.
const open = (src.match(/\{/g) || []).length;
const close = (src.match(/\}/g) || []).length;
if (open !== close) {
  console.error(`BRACES DO NOT BALANCE: ${open} open, ${close} close — the stylesheet is broken.`);
  process.exit(1);
}

console.log(`stylesheet edits: ${edits.length}`);
for (const e of edits) console.log("  ·", e);
console.log(`\npages rewritten: ${touched}`);
for (const n of notes) console.log(n);
console.log(`\nbraces balance: ${open} / ${close}`);
