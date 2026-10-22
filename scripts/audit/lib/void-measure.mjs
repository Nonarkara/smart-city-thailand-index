/**
 * THE VOID MEASURE
 * ================
 * The one definition of "unexplained space" on this site, shared by
 * voids.mjs (measures) and void-explain.mjs (explains). Two copies of
 * this rule would drift, and a drifting instrument is worse than none.
 *
 * The rule, in one paragraph: collect every leaf element's rect and
 * merge them into vertical bands. The space between two bands is a run.
 * SPLIT each run at every visual marker that crosses it — a rule (a
 * border the reader can see) or a change of ground (a painted field
 * that differs from the ground behind it). A marker re-anchors the eye,
 * so the space on either side is a different space. What remains is the
 * largest unbroken stretch of nothing: space that no rule and no colour
 * change explains. That is the only thing this site calls a void.
 *
 * Rationale for the split: a 56px pad inside a dark band is not
 * emptiness — the reader sees the colour change, and the air belongs to
 * the division. A 56px white gap between two paragraphs on the same
 * white ground IS emptiness: nothing tells the reader why it is there.
 *
 * This function runs inside the page. It takes no arguments and returns
 * a plain object.
 */
export function measureVoidRuns() {
  const alphaOf = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || "");
    if (!m) return 1;
    const p = m[1].split(",").map(s => parseFloat(s));
    return p.length === 4 ? p[3] : 1;
  };
  const rgbOf = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || "");
    if (!m) return null;
    const p = m[1].split(",").map(s => parseFloat(s));
    return [p[0] || 0, p[1] || 0, p[2] || 0];
  };
  const opaque = (c) => c && c !== "transparent" && alphaOf(c) > 0.02;
  const same = (a, b) => {
    const x = rgbOf(a), y = rgbOf(b);
    if (!x || !y) return a === b;
    return x[0] === y[0] && x[1] === y[1] && x[2] === y[2];
  };
  const desc = (el) => {
    const tag = el.tagName.toLowerCase();
    const cls = (el.className && typeof el.className === "string" ? el.className : "")
      .trim().split(/\s+/).filter(Boolean).slice(0, 2).join(".");
    return tag + (cls ? "." + cls : "");
  };
  // effective ground behind an element: its own background if painted,
  // otherwise its parent's.
  const effBg = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const bg = getComputedStyle(n).backgroundColor;
      if (opaque(bg)) return bg;
      n = n.parentElement;
    }
    const hb = getComputedStyle(document.documentElement).backgroundColor;
    return opaque(hb) ? hb : "rgb(255,255,255)";
  };

  const bands = [];
  const leaves = [];
  const markers = [];

  // The rects of an element's own TEXT, measured through a Range. A bare
  // text node has no element box of its own, so without this the
  // instrument is blind to every sentence that shares a block with an
  // inline element.
  const textRects = (el) => {
    const out = [];
    for (const n of el.childNodes) {
      if (n.nodeType !== 3 || !n.nodeValue || !n.nodeValue.trim()) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const rect of r.getClientRects()) {
        if (rect.height >= 1 && rect.width >= 1) out.push(rect);
      }
    }
    return out;
  };
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest(".site-footer")) continue;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) continue;
    const r = el.getBoundingClientRect();
    if (r.height < 2 || r.width < 2) continue;
    const top = r.top + window.scrollY;
    const bottom = r.bottom + window.scrollY;

    // ── markers ────────────────────────────────────────────────────────
    // A rule or a painted field only marks the run if it is wide enough
    // for the eye to read as a division rather than a detail. 120px is
    // the floor: a narrow card in a grid is still a visible block, and
    // excluding it made six identical gaps on /program look like holes.
    const MARK_W = 120;
    const bt = parseFloat(cs.borderTopWidth) || 0;
    const bb = parseFloat(cs.borderBottomWidth) || 0;
    if (bt > 0 && r.width >= MARK_W) markers.push({ y: top, kind: "rule", name: desc(el) });
    if (bb > 0 && r.width >= MARK_W) markers.push({ y: bottom, kind: "rule", name: desc(el) });
    const bg = cs.backgroundColor;
    if (opaque(bg) && !same(bg, effBg(el.parentElement || document.body)) && r.width >= MARK_W) {
      markers.push({ y: top, kind: "ground", name: desc(el) });
      markers.push({ y: bottom, kind: "ground", name: desc(el) });
    }

    // a leaf, or an element with no element children — the content itself.
    // A graphic is content: an SVG globe with a legend above and below it
    // is OCCUPIED space, not a void.
    const hasElementChild = [...el.children].some(c => {
      if (c.closest("svg")) return false;
      const cr = c.getBoundingClientRect();
      return cr.height >= 2 && cr.width >= 2;
    });
    if (hasElementChild) {
      // A block that mixes text and inline elements — a caption with a
      // badge, a list item with a bold lead — still occupies space with
      // its TEXT. Skipping the whole element makes that text invisible to
      // the instrument, and the instrument then reports a hole where the
      // reader is reading a sentence. Measure the text directly.
      for (const rect of textRects(el)) {
        const t = rect.top + window.scrollY;
        const b = rect.bottom + window.scrollY;
        bands.push([t, b]);
        leaves.push({ el, top: t, bottom: b });
      }
      continue;
    }
    // An INLINE element's box is its CONTENT box: it stops at the
    // baseline, and the line box continues below it by half the leading.
    // Measuring the content box invents a gap that is not there — the
    // same class of fault as reading .reveal's translateY as a layout
    // overlap. The line box is the space the eye actually crosses.
    let bottomEdge = bottom;
    if (cs.display.startsWith("inline")) {
      const fs = parseFloat(cs.fontSize) || 0;
      let lh = parseFloat(cs.lineHeight);
      if (!lh || Number.isNaN(lh)) lh = fs * 1.2;
      const slack = Math.max(0, (lh - fs) / 2);
      bottomEdge = bottom + slack;
    }
    bands.push([top, bottomEdge]);
    leaves.push({ el, top, bottom: bottomEdge });
  }
  bands.sort((a, b) => a[0] - b[0]);
  const merged = [];
  for (const [t, b] of bands) {
    const last = merged[merged.length - 1];
    if (last && t <= last[1] + 1) last[1] = Math.max(last[1], b);
    else merged.push([t, b]);
  }

  // ── runs, split at markers ─────────────────────────────────────────
  const runs = [];
  for (let i = 1; i < merged.length; i++) {
    const top = merged[i - 1][1];
    const bot = merged[i][0];
    if (bot - top <= 8) continue;
    const cuts = [top, bot];
    for (const m of markers) {
      if (m.y > top + 1 && m.y < bot - 1) cuts.push(m.y);
    }
    cuts.sort((a, b) => a - b);
    for (let k = 1; k < cuts.length; k++) {
      const g = Math.round(cuts[k] - cuts[k - 1]);
      if (g <= 8) continue;
      const above = cuts[k - 1], below = cuts[k];
      const markerAt =
        markers.find(m => Math.abs(m.y - above) <= 2) ||
        markers.find(m => Math.abs(m.y - below) <= 2);
      // what brackets the run — the two content edges it sits between
      const aboveEl = leaves.filter(L => Math.abs(L.bottom - above) <= 3).sort((a, b) => b.bottom - a.bottom)[0];
      const belowEl = leaves.filter(L => Math.abs(L.top - below) <= 3).sort((a, b) => a.top - b.top)[0];
      runs.push({
        g,
        at: Math.round(above),
        to: Math.round(below),
        marked: !!markerAt,
        by: markerAt ? markerAt.kind + " " + markerAt.name : "nothing",
        above: aboveEl ? desc(aboveEl.el) : "(none)",
        below: belowEl ? desc(belowEl.el) : "(none)",
      });
    }
  }
  runs.sort((a, b) => b.g - a.g);
  const unmarked = runs.filter(r => !r.marked);
  return {
    pageH: document.documentElement.scrollHeight,
    runs,
    worst: runs.slice(0, 5),
    unmarked,
    worstUnmarked: unmarked[0] || null,
  };
}
