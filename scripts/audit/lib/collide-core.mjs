/**
 * THE CORE MEASUREMENT
 * ====================
 * Everything the massacre sweep knows how to see, in one function.
 *
 * It lives here, apart from the runner, for one reason: the FALSIFICATION
 * HARNESS must exercise the SAME code the gate runs. A harness that
 * re-implements the measurement proves only that the harness's copy of the
 * measurement can fail. If the copy drifts, the gate keeps shipping.
 *
 * This function is serialised into the page by Playwright, so it must be
 * entirely self-contained: no imports, no closure over module scope.
 *
 * The rules, and why each one exists:
 *
 *  1. FLOAT CONTROL OVER TEXT
 *     A fixed or sticky element painted over body text.
 *
 *  2. DUPLICATE DISPLAY TEXT
 *     The same words at display size twice on one page.
 *
 *  3. THAI IN A TRACKED RUN
 *     Letter-spacing breaks Thai's connecting strokes.
 *
 *  4. TEXT OVER TEXT
 *     Two pieces of painted ink in each other's space.
 *
 *  5. TEXT OUTSIDE ITS BOX
 *     A label that has left the box it belongs to, so it collides with
 *     whatever sits beside that box.
 */
export function collideCore() {
  const out = { fabCollisions: [], dupDisplay: [], thaiTracked: [], overlaps: [], outside: [], refused: [], lowContrast: [] };
  const THAI = /[\u0E00-\u0E7F]/;
  const TEXTISH = new Set(["P", "SPAN", "H1", "H2", "H3", "H4", "H5", "H6", "LI", "TD", "TH", "A", "BUTTON", "STRONG", "EM", "SMALL", "LABEL", "FIGCAPTION", "DT", "DD", "BLOCKQUOTE", "SUMMARY", "CODE", "TIME", "DIV"]);

  // ------------------------------------------------------------------
  // 1. Floating control painted over text.
  // ------------------------------------------------------------------
  const floats = [...document.querySelectorAll(".chat-fab, .chat-panel, .back-to-top, [class*='fab']")]
    .filter(el => {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") return false;
      return cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.1 && el.getBoundingClientRect().width > 0;
    });
  const textNodes = [...document.querySelectorAll("body *")].filter(el => {
    if (el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) return false;
    const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!own) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    return el.getBoundingClientRect().height > 4;
  });
  // The floating-control check itself happens LATER, once the ink has been
  // measured. A floating button is judged against the INK it covers, not
  // against the box of the row it happens to sit beside: on /map the chat
  // button overlapped the empty right-hand end of a 232px-wide legend row
  // whose words are 30px wide at the left, and the reader sees nothing
  // covered at all. The check is therefore made where the ink lives.

  // ------------------------------------------------------------------
  // 2. Duplicate display-size text.
  // ------------------------------------------------------------------
  const disp = [];
  for (const el of document.querySelectorAll("body *")) {
    if (el.closest("svg, .site-footer, .topbar, nav, footer, .site-header")) continue;
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent.trim()).join(" ").replace(/\s+/g, " ").trim();
    if (!own) continue;
    const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
    if (fs < 30) continue;
    // A numeral inside a panel the reader has not opened is NOT on the
    // screen. Both "4"s on /showcase live in closed tab panels: their
    // rectangles are zero, but their text is still in the DOM, and the rule
    // was reporting two hidden numerals as a visible duplicate.
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 0 || r.height <= 0) continue;
    disp.push({ key: own.toLowerCase(), tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34), text: own.slice(0, 40), top: Math.round(r.top + scrollY), fs });
  }
  const seen = new Map();
  for (const d of disp) seen.set(d.key, [...(seen.get(d.key) || []), d]);
  for (const [, v] of seen) {
    if (v.length < 2) continue;
    const gaps = [];
    for (let i = 1; i < v.length; i++) gaps.push(Math.abs(v[i].top - v[i - 1].top));
    out.dupDisplay.push({ v, nearest: Math.min(...gaps) });
  }

  // ------------------------------------------------------------------
  // 3. Thai text inside a tracked (letter-spaced) run.
  // ------------------------------------------------------------------
  for (const el of document.querySelectorAll("body *")) {
    const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join("");
    if (!THAI.test(own)) continue;
    const cs = getComputedStyle(el);
    const ls = parseFloat(cs.letterSpacing);
    if (ls > 0.01) {
      out.thaiTracked.push({
        tag: el.tagName.toLowerCase(), cls: String(el.className || "").slice(0, 34),
        ls: ls.toFixed(3), text: own.trim().slice(0, 34),
      });
    }
  }

  // ==================================================================
  // THE INK, MEASURED PER GRAPHEME CLUSTER
  // ==================================================================
  // A Range reports a FONT BOX, not an ink box, and a whole-string
  // measureText() reports the TALLEST COMPOSED CLUSTER anywhere in that
  // string. Putting those together across a multi-line headline applies
  // line 2's tallest glyph to line 1's rectangle: the ink top was
  // reported at 355.05px while the tallest real glyph did not begin until
  // 361.19px — a 6px phantom that put a headline "over" an eyebrow that
  // is plainly clear of it on screen.
  //
  // So the ink is measured PER GRAPHEME CLUSTER, each against its own
  // rectangle. A Thai base letter and its tone mark are one cluster
  // (Intl.Segmenter), so the cluster is measured as it is COMPOSED — the
  // mark's real height above the base, not its height alone.
  const measureCanvas = document.createElement("canvas");
  const mctx = measureCanvas.getContext("2d");
  const inkCache = new Map();
  const segmenter = (typeof Intl !== "undefined" && Intl.Segmenter)
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null;

  /**
   * A CANVAS-VALID FONT SHORTHAND.
   *
   * canvas accepts the CSS2 font shorthand only: font-variant may be
   * `normal` or `small-caps` and nothing else. But Chrome's computed
   * `font-variant` now carries font-variant-NUMERIC — an element with
   * `font-variant-numeric: tabular-nums` reports `font-variant:
   * tabular-nums`, which canvas does not understand. The whole shorthand
   * is then rejected, silently, and measureText keeps the PREVIOUS font.
   *
   * That is not a hypothetical: on the homepage the three `.density-value`
   * numerals were measured against a leftover 11.52px font while their
   * real size is 14px. The read-back check caught it and refused the
   * measurement, which is the check earning its place — but the fix is to
   * ask canvas for something it can parse.
   */
  function canvasFont(cs) {
    const style = /^(normal|italic|oblique)$/.test(cs.fontStyle) ? cs.fontStyle : "normal";
    const variant = cs.fontVariant === "small-caps" ? "small-caps" : "normal";
    const weight = /^\d+$/.test(cs.fontWeight)
      ? cs.fontWeight
      : (cs.fontWeight === "bold" ? "700" : "400");
    return `${style} ${variant} ${weight} ${cs.fontSize} ${cs.fontFamily}`;
  }

  /**
   * READ THE FONT BACK.
   *
   * canvas measureText silently keeps the PREVIOUS font when the
   * shorthand it was given is rejected. A rejected shorthand yields
   * "10px sans-serif" and every measurement that follows is a
   * plausible-looking number about the wrong typeface. The only honest
   * response to a silent failure is to detect it: the font is written,
   * read back, and compared with the size that was asked for. A mismatch
   * REFUSES the measurement, and a refusal is reported as a route that
   * was not measured — never as a pass.
   */
  function inkBand(el, rect, text) {
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize) || 16;
    const key = `${cs.fontStyle}|${cs.fontVariant}|${cs.fontWeight}|${cs.fontSize}|${cs.fontFamily}|${text}`;
    let m = inkCache.get(key);
    if (!m) {
      mctx.font = canvasFont(cs);
      const readback = mctx.font || "";
      const got = /(\d+(?:\.\d+)?)px/.exec(readback);
      if (!got || Math.abs(parseFloat(got[1]) - size) > 0.2) {
        m = { REFUSED: true, readback, asked: cs.fontSize };
        inkCache.set(key, m);
        return m;
      }
      m = mctx.measureText(text || "Ag");
      inkCache.set(key, m);
    }
    if (m.REFUSED) return m;
    const asc = m.fontBoundingBoxAscent || size * 0.8;
    const desc = m.fontBoundingBoxDescent || size * 0.2;
    const inkAsc = m.actualBoundingBoxAscent;
    const inkDesc = m.actualBoundingBoxDescent;
    if (!Number.isFinite(inkAsc) || !Number.isFinite(inkDesc) || (inkAsc === 0 && inkDesc === 0)) {
      return { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
    }
    // The rectangle may be the font box or the line box. CSS centres the
    // font box inside the line box with half-leading above and below, so
    // the baseline sits there — not at rect.top + ascent when the line
    // box is taller than the font.
    const fontBox = asc + desc;
    const halfLeading = (rect.height - fontBox) / 2;
    const baseline = rect.top + halfLeading + asc;
    return { left: rect.left, right: rect.right, top: baseline - inkAsc, bottom: baseline + inkDesc };
  }

  /**
   * The box the text is actually PAINTED inside.
   *
   * A Range reports a rect for every laid-out line, including lines that
   * a clamp or an overflow rule keeps from being drawn. The band is
   * therefore clipped to the padding box of every ancestor that clips —
   * exactly the region the browser paints in.
   */
  function clipBox(el) {
    let box = null;
    let node = el;
    while (node && node !== document.body && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      if (cs.overflow !== "visible" || cs.overflowX !== "visible" || cs.overflowY !== "visible") {
        const b = node.getBoundingClientRect();
        const c = {
          left: b.left + node.clientLeft,
          top: b.top + node.clientTop,
          right: b.left + node.clientLeft + node.clientWidth,
          bottom: b.top + node.clientTop + node.clientHeight,
        };
        if (!box) box = c;
        else {
          box.left = Math.max(box.left, c.left);
          box.top = Math.max(box.top, c.top);
          box.right = Math.min(box.right, c.right);
          box.bottom = Math.min(box.bottom, c.bottom);
        }
      }
      node = node.parentElement;
    }
    return box;
  }

  function applyClip(rect, box) {
    if (!box) return rect;
    const left = Math.max(rect.left, box.left);
    const right = Math.min(rect.right, box.right);
    const top = Math.max(rect.top, box.top);
    const bottom = Math.min(rect.bottom, box.bottom);
    if (right - left <= 0 || bottom - top <= 0) return null;
    return { left, right, top, bottom };
  }

  /** One cluster's ink band, clipped to what is actually painted. */
  function clusterBands(el, node, clip) {
    const bands = [];
    const range = document.createRange();
    const text = node.textContent;
    const clusters = segmenter
      ? Array.from(segmenter.segment(text), s => s.segment)
      : Array.from(text);
    let offset = 0;
    for (const cl of clusters) {
      const start = offset;
      offset += cl.length;
      if (!cl.trim()) continue;
      try {
        range.setStart(node, start);
        range.setEnd(node, offset);
      } catch { continue; }
      const rects = range.getClientRects();
      for (const r of rects) {
        if (r.width <= 0.5 && r.height <= 0.5) continue;
        const band = inkBand(el, r, cl);
        if (band && band.REFUSED) return band;
        const clipped = applyClip(band, clip);
        if (clipped) bands.push(clipped);
      }
    }
    return bands;
  }

  /** The 3x3 part of a computed transform, row-major. */
  function matrix3x3Of(cs) {
    const t = cs.transform;
    if (!t || t === "none") return null;
    let p = null;
    if (t.startsWith("matrix3d(")) {
      // "matrix3d(" is NINE characters. Slicing from 8 yields "(-1, …)"
      // and Number("(-1") is NaN, so a sign test built on that slice never
      // fires once and the filter is decoration.
      p = t.slice(9, -1).split(",").map(s => Number(s.trim()));
      if (p.length < 12 || !p.every(Number.isFinite)) return null;
      // matrix3d is COLUMN-major: a1..a16.
      return [[p[0], p[4], p[8]], [p[1], p[5], p[9]], [p[2], p[6], p[10]]];
    }
    if (t.startsWith("matrix(")) {
      p = t.slice(7, -1).split(",").map(s => Number(s.trim()));
      if (p.length < 6 || !p.every(Number.isFinite)) return null;
      return [[p[0], p[2], 0], [p[1], p[3], 0], [0, 0, 1]];
    }
    return null;
  }

  function mul(a, b) {
    const r = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        r[i][j] = a[i][0] * b[0][j] + a[i][1] * b[1][j] + a[i][2] * b[2][j];
      }
    }
    return r;
  }

  /**
   * IS THIS ELEMENT'S BACK FACE TOWARD US?
   *
   * A flipped card shows its BACK. If that face carries
   * backface-visibility:hidden, the face and everything inside it paint
   * NOTHING — but their layout geometry still exists, so the overlap rule
   * would report the text of a face nobody can see. On /bingo that was 71
   * false positives.
   *
   * The test is the ACCUMULATED transform, not any single ancestor's. A
   * card is flipped by the card; each face carries its own rotateY(180deg)
   * so that after the card turns, the back face is the one facing the
   * reader. The back face's own transform is a rotation — its matrix
   * determinant is +1 — so "is this matrix mirrored?" is the wrong
   * question. The right one is: does the accumulated transform turn the
   * element's local +Z normal AWAY from the reader? That is the sign of
   * the accumulated matrix's m33.
   *
   * Two things make this filter easy to get wrong, and both were got
   * wrong here before:
   *
   *   · "matrix3d(" is NINE characters. Slicing from 8 yields "(-1, …)"
   *     and Number("(-1") is NaN — so the sign test never fired once and
   *     the filter was pure decoration.
   *   · backface-visibility is NOT inherited in Chrome. A label inside a
   *     flipped card computes "visible" for ITSELF, so there is no
   *     "no transform ⇒ not back-facing" shortcut: the ancestors have to
   *     be walked and their backface-visibility read.
   */
  function isBackFacing(el) {
    const chain = [];
    let node = el;
    let depth = 0;
    while (node && depth < 6 && node !== document.body && node !== document.documentElement) {
      chain.push(node);
      node = node.parentElement;
      depth++;
    }
    if (!chain.length) return false;
    // Accumulate from the outermost inward: acc(i) = M(i) · acc(i+1).
    let acc = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const accAt = new Array(chain.length);
    for (let i = chain.length - 1; i >= 0; i--) {
      const m = matrix3x3Of(getComputedStyle(chain[i]));
      if (m) acc = mul(m, acc);
      accAt[i] = acc;
    }
    for (let i = 0; i < chain.length; i++) {
      const cs = getComputedStyle(chain[i]);
      // m33 < 0 means the accumulated transform points the element's
      // normal away from the reader: we are looking at its back.
      if (accAt[i][2][2] < 0 && cs.backfaceVisibility === "hidden") return true;
    }
    return false;
  }

  /**
   * WHAT IS ACTUALLY PAINTED AT THIS POINT?
   *
   * Geometry is not paint. Two text boxes can share a rectangle and show
   * nothing at all — a news feed sits behind a fixed, opaque, full-screen
   * game surface on /bingo and the naive rule reported 71 false positives
   * there. So the instrument asks the browser what is on the canvas at the
   * point where the ink meets, via elementsFromPoint.
   *
   * An element is HIDDEN at a point when something opaque is painted
   * above it there. An opaque surface is a background colour at
   * alpha >= 0.95, or a background image. An ANCESTOR never hides its own
   * children — a card's own background sits behind its text.
   */
  function coveredByOpaque(stack, target) {
    const idx = stack.indexOf(target);
    if (idx === -1) return true; // not in the stack: not painted here
    for (let i = 0; i < idx; i++) {
      const el = stack[i];
      if (el === target) continue;
      if (target.contains(el)) continue; // an ancestor cannot hide its own child
      const cs = getComputedStyle(el);
      if (cs.backgroundImage && cs.backgroundImage !== "none") return true;
      const bg = cs.backgroundColor;
      if (!bg || bg === "transparent") continue;
      const mm = /rgba?\(([^)]+)\)/.exec(bg);
      if (!mm) continue;
      const parts = mm[1].split(",").map(s => parseFloat(s.trim()));
      const alpha = parts.length > 3 ? parts[3] : 1;
      if (alpha >= 0.95) return true;
    }
    return false;
  }

  /** The intersection of two elements' ink, in viewport coordinates. */
  function inkIntersection(a, b) {
    let best = null;
    for (const ra of a.rects) {
      for (const rb of b.rects) {
        const left = Math.max(ra.left, rb.left);
        const right = Math.min(ra.right, rb.right);
        const top = Math.max(ra.top, rb.top);
        const bottom = Math.min(ra.bottom, rb.bottom);
        if (right - left <= 0 || bottom - top <= 0) continue;
        const area = (right - left) * (bottom - top);
        if (!best || area > best.area) best = { left, right, top, bottom, area };
      }
    }
    return best;
  }

  /**
   * DO THESE TWO TEXTS ACTUALLY MEET ON SCREEN?
   *
   * The intersection may sit below the fold, where elementsFromPoint has
   * nothing to report. The page is scrolled to it and the geometry
   * re-measured before the browser is asked what is painted.
   */
  function visibleOverlap(a, b) {
    let inter = inkIntersection(a, b);
    if (!inter) return null;
    if (inter.bottom < 0 || inter.top > innerHeight) {
      window.scrollTo(0, Math.max(0, window.scrollY + inter.top - innerHeight / 2));
      const re = (item) => {
        const rs = [];
        for (const node of item.el.childNodes) {
          if (node.nodeType !== 3 || !node.textContent.trim()) continue;
          const clip = clipBox(item.el);
          rs.push(...clusterBands(item.el, node, clip));
        }
        return { el: item.el, rects: rs };
      };
      inter = inkIntersection(re(a), re(b));
      if (!inter) return null;
    }
    const px = Math.min(innerWidth - 1, Math.max(1, (inter.left + inter.right) / 2));
    const py = Math.min(innerHeight - 1, Math.max(1, (inter.top + inter.bottom) / 2));
    const stack = document.elementsFromPoint(px, py);
    if (coveredByOpaque(stack, a.el) || coveredByOpaque(stack, b.el)) return null;
    return { px: Math.round(px), py: Math.round(py) };
  }

  // ------------------------------------------------------------------
  // Collect the ink.
  // ------------------------------------------------------------------
  const inkRects = [];
  for (const el of textNodes) {
    if (!TEXTISH.has(el.tagName)) continue;
    if (el.closest("details:not([open])")) continue;
    if (el.closest("select")) continue;
    const cs = getComputedStyle(el);
    let visible = true;
    try {
      visible = el.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true });
    } catch {
      visible = cs.display !== "none" && cs.visibility !== "hidden";
    }
    if (!visible) continue;
    const clip = clipBox(el);
    const rects = [];
    let refused = null;
    for (const node of el.childNodes) {
      if (node.nodeType !== 3 || !node.textContent.trim()) continue;
      const res = clusterBands(el, node, clip);
      if (res && res.REFUSED) { refused = res; break; }
      rects.push(...res);
    }
    if (refused) {
      out.refused.push({ el: el.tagName + "." + String(el.className || "").slice(0, 28), asked: refused.asked, readback: refused.readback });
      continue;
    }
    if (rects.length) inkRects.push({ el, rects, overlay: cs.position === "fixed" || cs.position === "absolute" });
  }

  // ------------------------------------------------------------------
  // 1. Floating control painted over text.
  //
  // Judged against the INK, not the box. A floating button covers the
  // words it sits on; it does not cover the empty space at the end of a
  // row. On /map the chat button overlapped the blank right-hand end of a
  // 232px-wide legend row whose words are about 30px wide at the left, and
  // the reader sees nothing covered — but the box said otherwise.
  // ------------------------------------------------------------------
  for (const f of floats) {
    const fr = f.getBoundingClientRect();
    for (const item of inkRects) {
      if (item.el.closest(".chat-fab, .chat-panel, .site-footer, .topbar, svg")) continue;
      let hit = null;
      for (const r of item.rects) {
        const ox = Math.min(fr.right, r.right) - Math.max(fr.left, r.left);
        const oy = Math.min(fr.bottom, r.bottom) - Math.max(fr.top, r.top);
        if (ox > 2 && oy > 2) {
          const area = ox * oy;
          if (!hit || area > hit.area) hit = { area, ox, oy, r };
        }
      }
      if (!hit) continue;
      out.fabCollisions.push({
        float: String(f.className).slice(0, 30),
        over: item.el.tagName + "." + String(item.el.className || "").slice(0, 28),
        text: (item.el.textContent || "").trim().slice(0, 40),
        area: Math.round(hit.area),
        px: `${Math.round(hit.ox)}×${Math.round(hit.oy)}`,
      });
      break;
    }
  }

  // ------------------------------------------------------------------
  // 4. Text painted over text.
  // ------------------------------------------------------------------
  const flowInk = inkRects.filter(x => !x.overlay);
  flowInk.sort((x, y) => Math.min(...x.rects.map(r => r.top)) - Math.min(...y.rects.map(r => r.top)));
  for (let i = 0; i < flowInk.length; i++) {
    const a = flowInk[i];
    const aBottom = Math.max(...a.rects.map(r => r.bottom));
    for (let j = i + 1; j < flowInk.length; j++) {
      const b = flowInk[j];
      const bTop = Math.min(...b.rects.map(r => r.top));
      if (bTop > aBottom + 6) break;
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      if (isBackFacing(a.el) || isBackFacing(b.el)) continue;
      const inter = inkIntersection(a, b);
      if (!inter) continue;
      const ox = inter.right - inter.left;
      const oy = inter.bottom - inter.top;
      // 2px, because the band is derived from font metrics and carries its
      // own error of about a pixel. Below that the instrument cannot tell
      // a contact from a graze.
      if (ox <= 2 || oy <= 2) continue;
      const vis = visibleOverlap(a, b);
      if (!vis) continue;
      out.overlaps.push({
        a: a.el.tagName + "." + String(a.el.className || "").slice(0, 22) + ` "${(a.el.textContent || "").trim().slice(0, 22)}"`,
        b: b.el.tagName + "." + String(b.el.className || "").slice(0, 22) + ` "${(b.el.textContent || "").trim().slice(0, 22)}"`,
        px: `${Math.round(ox)}×${Math.round(oy)}`,
        at: `${vis.px},${vis.py}`,
      });
    }
  }

  // ------------------------------------------------------------------
  // 5. TEXT THAT LEFT ITS BOX.
  //
  //    The box is the nearest ancestor that has a ground (a background
  //    colour that is not transparent) or an edge (a border). An
  //    ABSOLUTELY POSITIONED ANCESTOR IS STILL A BOX — the earlier
  //    version bailed out on position:absolute, which meant it could not
  //    see inside a single bingo card, and the escaping-label mutation
  //    passed a gate that had never looked there.
  //
  //    No occlusion test: a label that has left its box is a defect
  //    whether or not something happens to be painted over it.
  // ------------------------------------------------------------------
  function boxOf(el) {
    let node = el;
    while (node && node !== document.body && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const bg = cs.backgroundColor;
      const hasGround = bg && bg !== "transparent" && !/^rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\)$/.test(bg);
      const bw = ["borderTopWidth", "borderRightWidth", "borderBottomWidth", "borderLeftWidth"]
        .reduce((n, k) => n + (parseFloat(cs[k]) || 0), 0);
      if (hasGround || bw > 0.5) {
        const b = node.getBoundingClientRect();
        return { left: b.left, top: b.top, right: b.right, bottom: b.bottom, tag: node.tagName + "." + String(node.className || "").slice(0, 24) };
      }
      node = node.parentElement;
    }
    return null;
  }

  const boxCache = new Map();
  for (const item of inkRects) {
    if (isBackFacing(item.el)) continue;
    let box = boxCache.get(item.el);
    if (box === undefined) { box = boxOf(item.el); boxCache.set(item.el, box); }
    if (!box) continue;
    let over = 0;
    let side = "";
    for (const rc of item.rects) {
      const d = [
        [box.top - rc.top, "top"],
        [rc.bottom - box.bottom, "bottom"],
        [box.left - rc.left, "left"],
        [rc.right - box.right, "right"],
      ];
      for (const [v, s] of d) if (v > over) { over = v; side = s; }
    }
    if (over > 1.5) {
      out.outside.push({
        el: item.el.tagName + "." + String(item.className || "").slice(0, 28) + ` "${(item.el.textContent || "").trim().slice(0, 26)}"`,
        box: box.tag,
        over: Math.round(over * 10) / 10,
        side,
      });
    }
  }

  // ------------------------------------------------------------------
  // 6. INK ON ITS GROUND — can this text be read at all?
  //
  //    /invest shipped 310px of white text on a white page for a
  //    fortnight. The navy CCDR panel sets color:#fff on its #12354e
  //    ground; the essay sections reuse that class with a hairline rule
  //    instead of the navy, and the rule that swapped the BACKGROUND out
  //    did not swap the COLOUR with it, so anything that inherited its
  //    colour inherited white.
  //
  //    Nothing in the audit chain looked at contrast, so the text was
  //    measured, measured for overlap, measured for rhythm — and found
  //    to be perfectly legible, because legibility was never asked about.
  //
  //    Text over a PHOTOGRAPH is exempt: the luminance of a photograph
  //    cannot be known from the DOM, and the photographic scrims are the
  //    contract that carries those surfaces. What this rule checks is
  //    text over a KNOWN ground — a flat colour — which is exactly where
  //    a token mismatch hides.
  // ------------------------------------------------------------------
  function srgb(v) {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }
  function luminance(c) {
    return 0.2126 * srgb(c[0]) + 0.7152 * srgb(c[1]) + 0.0722 * srgb(c[2]);
  }
  function contrast(fg, bg) {
    const a = luminance(fg);
    const b = luminance(bg);
    const hi = Math.max(a, b);
    const lo = Math.min(a, b);
    return (hi + 0.05) / (lo + 0.05);
  }
  function parseColor(value) {
    const m = /rgba?\(([^)]+)\)/.exec(value || "");
    if (!m) return null;
    const p = m[1].split(",").map(s => parseFloat(s.trim()));
    if (p.length < 3 || p.slice(0, 3).some(n => !Number.isFinite(n))) return null;
    return { rgb: [p[0], p[1], p[2]], alpha: p.length > 3 ? (Number.isFinite(p[3]) ? p[3] : 1) : 1 };
  }
  /**
   * The flat colour this text is painted on, or null when it is unknowable.
   *
   * A TRANSLUCENT GROUND IS A LAYER, NOT AN ANSWER. The first version of this
   * function skipped any background-colour under 95% alpha and kept walking,
   * so a caption painted on a dark scrim (rgba(12,47,83,0.82)) was measured
   * against the white page BEHIND the scrim and came back as white-on-white:
   * an "invisible caption" that is in fact perfectly legible. The scrim is the
   * ground; the page is only what lies behind the scrim.
   *
   * So the layers are collected from the text outward and composited back
   * down over the first opaque ground found. Where no opaque ground exists,
   * white is used — the lightest ground there can be, which is the
   * conservative choice for a dark scrim over a photograph.
   */
  function groundBehind(el) {
    const layers = [];
    let node = el;
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      // A photograph or gradient: the luminance is not in the DOM.
      if (cs.backgroundImage && cs.backgroundImage !== "none") return null;
      const c = parseColor(cs.backgroundColor);
      if (c) {
        if (c.alpha >= 0.95) {
          let ground = c.rgb;
          for (let i = layers.length - 1; i >= 0; i--) {
            const l = layers[i];
            ground = [0, 1, 2].map(k => l.rgb[k] * l.alpha + ground[k] * (1 - l.alpha));
          }
          return ground;
        }
        if (c.alpha > 0) layers.push(c);
      }
      node = node.parentElement;
    }
    let ground = [255, 255, 255];
    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      ground = [0, 1, 2].map(k => l.rgb[k] * l.alpha + ground[k] * (1 - l.alpha));
    }
    return ground;
  }
  for (const item of inkRects) {
    const cs = getComputedStyle(item.el);
    const fg = parseColor(cs.color);
    if (!fg || fg.alpha === 0) continue;
    const bg = groundBehind(item.el);
    if (!bg) continue; // over a photograph: the scrim carries it
    const composited = fg.alpha >= 1
      ? fg.rgb
      : [0, 1, 2].map(i => fg.rgb[i] * fg.alpha + bg[i] * (1 - fg.alpha));
    const ratio = contrast(composited, bg);
    const size = parseFloat(cs.fontSize) || 16;
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const floor = large ? 3 : 4.5;
    if (ratio < floor) {
      out.lowContrast.push({
        el: item.el.tagName + "." + String(item.el.className || "").slice(0, 28) + ` "${(item.el.textContent || "").trim().slice(0, 26)}"`,
        ratio: Math.round(ratio * 100) / 100,
        floor,
        color: cs.color,
        ground: `rgb(${bg.map(n => Math.round(n)).join(",")})`,
        size,
      });
    }
  }

  return out;
}
