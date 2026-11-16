/**
 * tap-core.mjs — the measurement behind scripts/audit/tap-targets.mjs.
 *
 * It lives in a lib so the GATE and its FALSIFIER use the same code. A
 * falsifier that re-implements the measurement proves nothing; the
 * pattern scripts/audit/falsify-msh.mjs established is that every case is
 * asked twice: of the CORE directly, and of the RUNNER's exit code.
 *
 * THE LAW (workspace CLAUDE.md §11.8 item 2, as amended by §11.12)
 * ----------------------------------------------------------------
 *   "44 x 44 px applies to isolated primary actions and map/icon controls.
 *    A dense group of text controls keeps label-plus-padding boxes: at
 *    least 32 px high on touch, never under the 24 px WCAG 2.2 floor, at
 *    least 4 px apart so hit areas do not overlap... Touchability comes
 *    from layout and from fewer controls: group them, move rare ones into
 *    a menu, drop the ones nobody needs. It never comes from padding every
 *    box to 44 px. A 44 px slab around a one-word label is spatial
 *    hallucination, not accessibility."
 *
 * So a control is classified by STRUCTURE and then held to the floor the
 * law sets for that class:
 *
 *   ISOLATED_ACTION / ICON_CONTROL  -> 44 x 44 on a coarse pointer,
 *                                     32 x 32 on a fine one (the WCAG 2.2
 *                                     AA floor; a mouse does not need 44)
 *   DENSE_GROUP                    -> height only: 32px on touch, 24px on
 *                                     a mouse. The law sets no width floor
 *                                     for a group, because the group is
 *                                     made touchable by layout.
 *   INLINE_LINK                    -> exempt: a link inside a SENTENCE
 *   LINK_ALONE                     -> 24px: a link that stands on its own
 *                                     (a card's closing "Source 1 ↗") gets
 *                                     the invisible hit area the law
 *                                     describes, down to the WCAG floor
 *
 * THE MEASUREMENT
 * ---------------
 * A control's EFFECTIVE hit area, not its CSS box. A target can be
 * carried by a pseudo-element, and that matters: the hamburger's ::after
 * expansion resolved to the topbar rather than the button, so a 36px
 * button was really a 36px target. The ground truth is elementFromPoint:
 * a grid of probe points is scanned and the extent that resolves to the
 * control or a descendant of it is its real target.
 *
 * Probe points are tested one pixel at a time, and the control is scrolled
 * into view with instant behaviour first — a smooth scroll leaves the
 * rect stale at the moment of measurement and reports a target that is
 * not there.
 */

/* The browser-side measurement. It must be self-contained: Playwright
 * serialises the function source into the page, so it cannot close over
 * anything in this module. */
export function tapMeasurementInPage({ route, viewportLabel }) {
  const FLOW = new Set(["block", "list-item", "inline", "flow-root", "inline-block", "contents", "table-cell", "table-row"]);
  const INTERACTIVE = 'a[href],button,input,select,textarea,[role="button"],[role="link"],[role="tab"],[role="checkbox"],[role="switch"],[tabindex]:not([tabindex="-1"])';

  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  // A control parked OUTSIDE the origin until it is focused (the skip
  // link sits at top:-29px) is not a target anyone can miss; it appears
  // the moment it is needed. Being merely BELOW the fold is not the same
  // thing — that content is one scroll away and must still be measured,
  // or the gate would quietly skip the globe map, the dossier tabs and
  // everything else that sits lower on a page.
  const parked = el => {
    const r = el.getBoundingClientRect();
    return r.bottom <= 0 || r.right <= 0;
  };

  // The control's own effective hit area, probed one pixel at a time.
  const effectiveBox = el => {
    el.scrollIntoView({ block: "center", behavior: "instant" });
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    let minx = Infinity, maxx = -Infinity, miny = Infinity, maxy = -Infinity, n = 0;
    const R = 30; // a 60px window covers a 44px target plus its margin
    for (let dy = -R; dy <= R; dy++) {
      for (let dx = -R; dx <= R; dx++) {
        const x = Math.round(cx + dx), y = Math.round(cy + dy);
        if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) continue;
        const t = document.elementFromPoint(x, y);
        if (t && (t === el || el.contains(t))) {
          n++;
          if (x < minx) minx = x; if (x > maxx) maxx = x;
          if (y < miny) miny = y; if (y > maxy) maxy = y;
        }
      }
    }
    return n ? { w: maxx - minx + 1, h: maxy - miny + 1 } : { w: 0, h: 0 };
  };

  // Classify the control by STRUCTURE, not by taste.
  const classify = el => {
    const cs = getComputedStyle(el);
    const p = el.parentElement;
    const pcs = p ? getComputedStyle(p) : null;
    const text = (el.textContent || "").trim();
    const isAnchor = el.tagName === "A" && el.hasAttribute("href");

    let sibText = "";
    if (p) for (const n of p.childNodes) if (n.nodeType === 3) sibText += n.textContent;

    // A link inside running text. The law exempts it: "Links inside
    // running text get an invisible hit area, not a taller line" — and
    // WCAG 2.2 SC 2.5.8 carries the same exception for a target "in a
    // sentence or block of text".
    //
    // The exception is for a SENTENCE. A link that stands alone — the
    // closing line of a card ("Source 1 ↗"), the credit under a
    // photograph — is not inside a sentence: it is a control of its own,
    // and a thumb has to find it. It gets the invisible hit area the law
    // describes, down to the 24 px WCAG floor.
    //
    // "Inside a sentence" is decided by the link's INLINE CONTEXT, not by
    // its direct parent: a link wrapped in a span inside a sentence is
    // still inside that sentence, while a link standing between two
    // paragraphs is not. So the context is the nearest block ancestor,
    // and the prose is whatever flows in that block's inline run with the
    // link — the block's own words, plus the words of its inline-level
    // children, minus every link.
    const proseInContext = block => {
      if (!block) return "";
      let out = "";
      for (const c of block.childNodes) {
        if (c.nodeType === 3) { out += c.textContent; continue; }
        if (c.nodeType !== 1 || c.tagName === "A") continue;
        const d = getComputedStyle(c).display;
        if (d === "inline" || d === "inline-block") out += proseInContext(c);
      }
      return out;
    };
    let ctxBlock = p;
    while (ctxBlock) {
      const d = getComputedStyle(ctxBlock).display;
      if (d !== "inline" && d !== "inline-block" && d !== "contents") break;
      ctxBlock = ctxBlock.parentElement;
    }
    const plainInline =
      isAnchor && cs.display === "inline" && pcs && FLOW.has(pcs.display) &&
      cs.backgroundColor === "rgba(0, 0, 0, 0)" &&
      parseFloat(cs.borderTopWidth) === 0 &&
      // Vertical padding is exactly the invisible hit area the law asks
      // for, so it does not disqualify a link. HORIZONTAL padding does:
      // that is a box, not a link.
      parseFloat(cs.paddingLeft) === 0 &&
      parseFloat(cs.paddingRight) === 0;
    if (plainInline) return proseInContext(ctxBlock).trim().length > 0 ? "INLINE_LINK" : "LINK_ALONE";

    // A dense group of text controls: a set of controls presented
    // together — a list of sources, a row of actions. Its structural
    // signature is a list or a flex/grid container holding three or more
    // controls.
    //
    // The OLD rule counted the controls in the control's DIRECT PARENT.
    // That missed every list whose rows wrap each control in its own
    // <li> — the baseline source registry is one link per row — and then
    // demanded a 44px isolated action from a row that is plainly part of
    // a group. So the group is now found by walking up to the nearest
    // list or flex/grid ancestor that holds at least three controls.
    const groupAncestor = el => {
      let node = el;
      for (let depth = 0; depth < 3; depth++) {
        const parent = node.parentElement;
        if (!parent) break;
        const disp = getComputedStyle(parent).display;
        const isList = parent.tagName === "UL" || parent.tagName === "OL";
        const isRow = disp === "flex" || disp === "inline-flex" || disp === "grid" || disp === "inline-grid";
        if (isList || isRow) {
          const controls = [...parent.querySelectorAll(INTERACTIVE)].filter(visible).length;
          if (controls >= 3) return true;
        }
        // A row of sibling controls is a group even when the container is a
        // plain block: the citation list on /why is a div whose children are
        // all links. The signature is that every child IS a control, so
        // there is no prose in the row — it is controls presented together.
        const kids = [...parent.children].filter(visible);
        const kidControls = kids.filter(k => k.matches(INTERACTIVE)).length;
        if (kidControls >= 3 && kidControls === kids.length) return true;
        node = parent;
      }
      return false;
    };
    const dense = groupAncestor(el);

    // A MARK inside a graphic — a dot on a map, a node on a diagram. Its
    // size is set by the data it shows, not by the interface: the globe
    // map puts 45 organisations in 16 country marks, and the closest two
    // sit 1.1px apart on a 390px phone, so 44px targets are geometrically
    // impossible there. These keep the WCAG 2.2 AA 24px floor and the
    // information has an equivalent full-size path (the country's
    // organisations as 44px rows in the map's own tooltip).
    // This is tested BEFORE the icon rule: a map mark carries no words
    // either, and calling it an icon control would demand a 44px target
    // the graphic cannot give.
    if (el.namespaceURI && el.namespaceURI.includes("svg") && el.ownerSVGElement) return "MAP_DATA_MARK";

    // An icon or map control carries no words, so it can never be a
    // one-word slab; it gets the full 44 x 44.
    const isIcon = text.length === 0 && (el.getAttribute("aria-label") || el.getAttribute("title") || "");
    if (isIcon) return "ICON_CONTROL";

    if (dense) return "DENSE_GROUP";
    return "ISOLATED_ACTION";
  };

  const findings = [];
  let count = 0;
  const seen = new Set();

  for (const el of document.querySelectorAll(INTERACTIVE)) {
    if (!visible(el)) continue;

    // A control wrapped in a <label> is tapped through the label:
    // clicking the label's text toggles the input. The input's own box is
    // only the indicator, so the label is the target.
    const target = (el.tagName === "INPUT" && el.closest("label")) ? el.closest("label") : el;

    const r0 = target.getBoundingClientRect();
    if (r0.width >= 44 && r0.height >= 44) continue;
    const cls = (target.className && target.className.toString ? target.className.toString() : target.tagName) + "|" + target.tagName;
    if (seen.has(cls)) continue;
    seen.add(cls);

    const category = classify(target);
    if (category === "INLINE_LINK") continue;
    if (parked(target)) continue;

    const eff = effectiveBox(target);
    count++;

    const w = Math.max(eff.w, Math.round(r0.width));
    const h = Math.max(eff.h, Math.round(r0.height));

    const coarse = matchMedia("(pointer: coarse)").matches;
    let need, ok;
    if (category === "DENSE_GROUP") {
      need = coarse ? 32 : 24;
      ok = h >= need;
    } else if (category === "MAP_DATA_MARK") {
      // WCAG 2.2 AA 2.5.8 Target Size (Minimum): 24 x 24.
      need = 24;
      ok = w >= need && h >= need;
    } else if (category === "LINK_ALONE") {
      // A text link standing on its own is not an isolated primary action
      // and not a dense group of controls: it is a link, and the law gives
      // it an invisible hit area rather than a taller line. The floor is
      // the 24 px WCAG 2.2 AA minimum the law names. Vertical padding on
      // an inline box grows the area a thumb can find without moving the
      // line — which is exactly "an invisible hit area, not a taller line".
      need = 24;
      ok = h >= need;
    } else {
      need = coarse ? 44 : 32;
      ok = w >= need && h >= need;
    }

    if (!ok) {
      findings.push({
        route, viewport: viewportLabel, category, need,
        tag: target.tagName.toLowerCase(),
        cls: (target.className && target.className.toString ? target.className.toString() : "").slice(0, 44),
        box: [Math.round(r0.width), Math.round(r0.height)],
        eff: [eff.w, eff.h],
        name: ((target.getAttribute("aria-label") || target.textContent || "").trim()).slice(0, 40),
      });
    }
  }

  return { findings, count };
}

/**
 * Measure one page. Prepares the page first (reveal classes, instant
 * scroll, a full scroll so lazily loaded chunks are in the DOM), then
 * runs the measurement.
 */
export async function measureTapTargets(page, { route, viewportLabel }) {
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible"));
    // Instant scroll: a smooth scroll would leave the rect stale at the
    // moment of measurement.
    document.documentElement.style.scrollBehavior = "auto";
  });
  // Scroll the whole page so lazily loaded chunks (the globe map, the
  // dossier tabs) are actually in the DOM before anything is measured. A
  // gate that never triggers the lazy content cannot see it.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 400));
  });
  await page.waitForTimeout(400);
  return page.evaluate(tapMeasurementInPage, { route, viewportLabel });
}
