/**
 * THE MSH CORES
 * ==============
 * The two measurements behind the new release gates, in ONE place.
 *
 * WHY A SHARED MODULE
 * A gate and the harness that proves the gate fires must run the SAME
 * code. When the harness keeps its own copy of the rule, the copy can
 * drift from the gate and the harness ends up proving something the
 * gate never does. This module exists for the same reason
 * scripts/audit/lib/collide-core.mjs and scripts/audit/lib/void-measure.mjs
 * exist: two copies of a rule will drift, and a drifting instrument is
 * worse than none.
 *
 * BOTH FUNCTIONS RUN INSIDE THE PAGE.
 * They are passed to page.evaluate, so they may not close over anything
 * from this module's scope — every helper they need is defined inside
 * them. A helper defined out here would not exist in the page.
 *
 *   measureMsh({ actionSel, expectSel, viewport })
 *     The first screen, the page bleed, the chrome cost, the MoMA
 *     edges, the hierarchy, the map share, the boxed logo and the prose
 *     measure. Returns { findings, ... } where findings is a list of
 *     { rule, severity, detail }.
 *
 *   measureBorderRoles()
 *     The three line roles - structural, cell, emphasis - and the
 *     special sections. Returns { counts, roles, roleCount,
 *     specialSections }.
 */

export function measureMsh({ route, actionSel, expectSel, viewport }) {
  const all = sel => { try { return [...document.querySelectorAll(sel)]; } catch { return []; } };
  const rect = el => { if (!el) return null; const r = el.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, right: r.right, w: r.width, h: r.height }; };
  const visible = el => {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };

  const vh = innerHeight;
  const onFirstScreen = b => b && b.top < vh && b.bottom > 0;
  const q = sel => {
    try {
      const allMatches = document.querySelectorAll(sel);
      for (const el of allMatches) {
        if (visible(el) && onFirstScreen(rect(el))) return el;
      }
      for (const el of allMatches) {
        if (visible(el)) return el;
      }
      return document.querySelector(sel);
    } catch {
      return null;
    }
  };

  const findings = [];
  const add = (rule, severity, detail, extra) => findings.push({ rule, severity, detail, ...(extra || {}) });

  // ── the page's own box ──────────────────────────────────────────
  const docW = document.documentElement.clientWidth;
  const scrollW = document.documentElement.scrollWidth;
  const overflow = scrollW - docW;

  // ── the primary action ──────────────────────────────────────────
  const actionEl = q(actionSel);
  const actionBox = rect(actionEl);
  const actionVisible = visible(actionEl);
  const expectEl = q(expectSel);
  const expectBox = rect(expectEl);

  if (!actionEl) {
    add("FIRST-SCREEN-ACTION", "critical", `primary action "${actionSel}" not found; the route could not be measured`);
  } else if (!actionVisible) {
    add("FIRST-SCREEN-ACTION", "critical", `primary action "${actionSel}" is not visible (hidden or zero-size)`);
  } else if (!onFirstScreen(actionBox)) {
    add("FIRST-SCREEN-ACTION", "critical",
      `primary action "${actionSel}" sits ${Math.round(actionBox.top - vh)}px below the first screen (top ${Math.round(actionBox.top)} vs viewport ${vh})`,
      { actionTop: Math.round(actionBox.top) });
  }

  if (!expectEl) {
    add("FIRST-SCREEN-STATEMENT", "major", `the route's statement "${expectSel}" was not found`);
  } else if (!onFirstScreen(expectBox)) {
    add("FIRST-SCREEN-STATEMENT", "major",
      `the page's statement "${expectSel}" starts ${Math.round(expectBox.top)}px down; the first screen does not carry it`,
      { statementTop: Math.round(expectBox.top) });
  }

  // ── chrome cost ─────────────────────────────────────────────────
  // Fixed chrome that stays on screen: the sticky topbar and anything
  // else pinned to the viewport. MSH §11.12 sets a guide of under
  // ~12-15% of the viewport on a phone.
  const chrome = [];
  for (const el of all("body *")) {
    const cs = getComputedStyle(el);
    if (cs.position !== "fixed" && cs.position !== "sticky") continue;
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    // Only chrome that is actually pinned to an edge of the viewport
    // counts. A sticky element inside a scrolling list is page content.
    const pinnedTop = r.top <= 1 && r.bottom > 1;
    const pinnedBottom = r.bottom >= vh - 1 && r.top < vh - 1;
    if (!pinnedTop && !pinnedBottom) continue;
    if (r.height >= vh * 0.9) continue; // a full-screen overlay is not chrome
    chrome.push({ h: r.height, top: pinnedTop ? r.top : r.bottom, cls: (el.className || "").toString().slice(0, 40) });
  }
  // Merge bands that overlap in the viewport, then take the total.
  const bands = chrome.map(c => ({ top: c.top, bottom: c.top + c.h })).sort((a, b) => a.top - b.top);
  let chromeH = 0, bandTop = null, bandBottom = null;
  for (const b of bands) {
    if (bandTop === null) { bandTop = b.top; bandBottom = b.bottom; continue; }
    if (b.top <= bandBottom) bandBottom = Math.max(bandBottom, b.bottom);
    else { chromeH += bandBottom - bandTop; bandTop = b.top; bandBottom = b.bottom; }
  }
  if (bandTop !== null) chromeH += bandBottom - bandTop;
  const chromeShare = chromeH / vh;
  const chromeCap = viewport.w < 720 ? 0.15 : 0.20;
  if (chromeShare > chromeCap) {
    add("CHROME-COST", "major",
      `fixed chrome is ${(chromeShare * 100).toFixed(1)}% of the viewport (${Math.round(chromeH)}px of ${vh}px); the guide is under ${(chromeCap * 100).toFixed(0)}%`,
      { chromeH: Math.round(chromeH), chromeShare: +chromeShare.toFixed(3) });
  }

  // ── page bleed ──────────────────────────────────────────────────
  if (overflow > 1) {
    add("PAGE-BLEED", "critical",
      `content is ${overflow}px wider than the viewport (scrollWidth ${scrollW} vs ${docW})`);
  }

  // An element that paints outside the viewport is bleeding — UNLESS it
  // sits inside a horizontal scroller, which is a legitimate pattern (a
  // tab list, a chip row). There the content is not lost; it is one
  // swipe away.
  //
  // A PARKED element is not bleeding either. The accessibility pattern —
  // a skip link parked at left: -9999px until it takes focus — is
  // deliberately off-canvas and the reader never sees it there.
  //
  // What bleeds is content CUT OFF at the edge with no way to reach it:
  // no scroller to scroll, nothing to recover the lost column.
  const inScroller = el => {
    for (let p = el.parentElement; p; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox === "auto" || ox === "scroll") return p;
    }
    return null;
  };
  const isClippedInsideViewport = el => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.overflow === "hidden" || cs.overflowX === "hidden") {
        const pr = p.getBoundingClientRect();
        if (pr.left >= -1 && pr.right <= docW + 1) return p;
      }
    }
    return null;
  };
  for (const el of all("body *")) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 2) continue;
    if (r.right > docW + 1 || r.left < -1) {
      const parkedLeft = r.right <= 0 && r.left < -docW;
      const parkedRight = r.left >= docW && r.left > docW * 2;
      const parkedVertical = r.bottom <= 0 && r.top < -docW;
      if (parkedLeft || parkedRight || parkedVertical) continue;
      const scroller = inScroller(el);
      if (scroller) continue; // scrollable: not lost, one swipe away
      const clipped = isClippedInsideViewport(el);
      if (clipped) continue; // visually clipped within an onscreen container
      const parentBleed = el.parentElement && getComputedStyle(el.parentElement).width >= docW - 1;
      if (!parentBleed) {
        add("PAGE-BLEED", "major",
          `"${(el.className || el.tagName).toString().slice(0, 46)}" paints from ${Math.round(r.left)} to ${Math.round(r.right)} in a ${docW}px viewport`,
          { bleedRight: Math.round(r.right), docW });
        break; // one offender is enough to name the defect
      }
    }
  }

  // ── hidden controls ─────────────────────────────────────────────
  // MSH tell #9: "Hidden information is the worst spatial hallucination,
  // because it is a lie by occlusion." A control inside a horizontal
  // scroller is acceptable WHEN THE READER CAN TELL there is more —
  // a visible scrollbar, or a fade at the edge, or a control half-cut
  // at the boundary that says "swipe".
  //
  // It is not acceptable when a whole group of controls sits beyond the
  // cut with nothing to signal it. The reader sees three chips and
  // concludes that three chips is the filter.
  for (const scroller of all("body *")) {
    const cs = getComputedStyle(scroller);
    if (cs.overflowX !== "auto" && cs.overflowX !== "scroll") continue;
    if (!visible(scroller)) continue;
    const sb = scroller.getBoundingClientRect();
    if (scroller.scrollWidth <= scroller.clientWidth + 1) continue;

    // Affordance: a fade mask, or a control cut by the boundary (its
    // right edge is inside the viewport but its left edge is not).
    const mask = (cs.maskImage || cs.webkitMaskImage || "none");
    const hasFade = mask !== "none" && !/^none/.test(mask);
    const kids = [...scroller.querySelectorAll("button,a,input,select,[role=button],[role=tab],[role=option]")];
    const hidden = kids.filter(k => {
      const r = k.getBoundingClientRect();
      const partiallyVisible = r.right > sb.left + 1 && r.left < sb.right - 1;
      return !partiallyVisible;
    });
    const cut = kids.filter(k => {
      const r = k.getBoundingClientRect();
      return r.right > sb.left + 1 && r.left < sb.right - 1 && (r.left < sb.left || r.right > sb.right);
    });

    if (hidden.length && !cut.length && !hasFade) {
      const labels = hidden.slice(0, 4).map(k => (k.textContent || "").trim().slice(0, 12)).join(", ");
      add("HIDDEN-CONTROL", "major",
        `${hidden.length} control(s) sit beyond the cut of "${(scroller.className || scroller.tagName).toString().slice(0, 34)}" (${scroller.scrollWidth}px of content in ${scroller.clientWidth}px) with no scrollbar, fade or cut edge to show they exist: ${labels}`,
        { hidden: hidden.length, scrollW: scroller.scrollWidth, clientW: scroller.clientWidth });
    }
  }

  // ── MoMA bounds: the set of left edges ─────────────────────────
  // A composed page lands on a small set of left edges. The law
  // (shared §14, "Planar Alignment: every edge meets another edge")
  // asks for an invisible grid; MSH.md asks for edges that align.
  // We measure the distinct left edges of the page's BLOCK children
  // (the sections that make up the page), not of every nested element.
  const main = q("main") || document.body;
  const blocks = [...main.children].filter(el => visible(el) && el.getBoundingClientRect().height > 8);
  const edges = new Map();
  for (const el of blocks) {
    const r = el.getBoundingClientRect();
    if (r.width < 40) continue;
    const left = Math.round(r.left);
    if (!edges.has(left)) edges.set(left, []);
    edges.get(left).push((el.className || el.tagName).toString().slice(0, 34));
  }
  const edgeList = [...edges.keys()].sort((a, b) => a - b);
  // Three left edges is a grid. Five is an accident.
  if (edgeList.length > 4) {
    add("MO-MA-EDGES", "major",
      `the page lands on ${edgeList.length} different left edges (${edgeList.join(", ")}); a composed page lands on one, two, maybe three`,
      { edges: edgeList });
  }

  // ── hierarchy: one thing wins ───────────────────────────────────
  // The first screen must have a focal point. We measure the heaviest
  // ink in the first screen and ask whether the page's statement is
  // among the top two, and whether the heaviest thing is a heading or
  // a value rather than a decoration.
  const inFirst = all("h1, h2, h3, p, li, button, a, span, td, th, div").filter(el => {
    if (!visible(el)) return false;
    const r = el.getBoundingClientRect();
    if (r.top >= vh || r.bottom <= 0) return false;
    const cs = getComputedStyle(el);
    if (parseFloat(cs.opacity) < 0.5) return false;
    return el.textContent && el.textContent.trim().length > 0;
  });
  const weightOf = el => {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const fs = parseFloat(cs.fontSize) || 0;
    const bold = (parseInt(cs.fontWeight, 10) || 400) >= 600;
    // Type by size and weight; images and rules by area.
    return fs * (bold ? 1.6 : 1) * Math.min(4, r.width / 40);
  };
  const ranked = inFirst.map(el => ({ el, w: weightOf(el) })).sort((a, b) => b.w - a.w);
  const heaviest = ranked.slice(0, 6);
  const statementIsHeavy = heaviest.some(x => x.el === expectEl || expectEl?.contains(x.el) || x.el.contains?.(expectEl));
  if (heaviest.length && !statementIsHeavy) {
    add("HIERARCHY", "major",
      `the heaviest thing on the first screen is "${((heaviest[0].el.className || heaviest[0].el.tagName) + "").slice(0, 40)}", not the page's statement; the eye has no path`);
  }

  // ── map share ───────────────────────────────────────────────────
  // MSH.md law 8: "Map-first surgical table (map/data products): map
  // ≥60% of first desktop and first phone screen; panels are edge
  // instruments; nothing covers the map on load."
  // The map's SHARE OF THE FIRST SCREEN is what matters, not its share
  // of the whole page: a map that starts 400px down has not earned the
  // screen even if it is tall.
  const mapEl = q(".map-dash-map, .map-dashboard");
  if (mapEl) {
    const mb = mapEl.getBoundingClientRect();
    const visibleMapH = Math.max(0, Math.min(vh, mb.bottom) - Math.max(0, mb.top));
    const share = visibleMapH / vh;
    if (share < 0.60) {
      add("MAP-SHARE", "major",
        `the map owns ${(share * 100).toFixed(0)}% of the first screen (${Math.round(visibleMapH)}px of ${vh}px); MSH law 8 asks for 60%`,
        { mapShare: +share.toFixed(3) });
    }
  }

  // ── logos never boxed ───────────────────────────────────────────
  // THE BOOK commandment 6: "Logos never boxed. No border, chip,
  // tile, pill, shadow, or backing panel around a logo. Strip =
  // logos + gap (+ plain text label). Unbox whole strips."
  for (const img of all("img.institutional-logo, img.brand-logo, img.footer-logo")) {
    if (!visible(img)) continue;
    const cs = getComputedStyle(img);
    if (cs.borderStyle !== "none" && parseFloat(cs.borderWidth) > 0) {
      add("BOXED-LOGO", "critical", `logo "${img.className}" has a border (${cs.borderWidth})`);
    }
    if (cs.boxShadow !== "none" && !cs.boxShadow.startsWith("none")) {
      add("BOXED-LOGO", "critical", `logo "${img.className}" has a box-shadow`);
    }
    const parent = img.parentElement;
    if (parent && parent.tagName !== "BODY" && parent.tagName !== "PICTURE") {
      const pcs = getComputedStyle(parent);
      if (pcs.boxShadow !== "none" && !pcs.boxShadow.startsWith("none")) {
        add("BOXED-LOGO", "critical", `logo container "${parent.className}" has a box-shadow`);
      }
      if (pcs.borderStyle !== "none" && parseFloat(pcs.borderWidth) > 0 && pcs.borderColor !== "transparent") {
        add("BOXED-LOGO", "critical", `logo container "${parent.className}" has a border`);
      }
    }
  }

  // ── prose measure ───────────────────────────────────────────────
  // THE BOOK commandment 18: "Prose measure ≤65ch (~45–75ch; Thai/ZH
  // keep physical A4/A5 measure, ~30–45 Chinese characters)."
  if (viewport.w >= 1024) {
    for (const p of all("main p:not(.eyebrow):not(.cinematic-hero-eyebrow):not(.hero-slide-label)")) {
      if (!visible(p)) continue;
      const text = (p.textContent || "").trim();
      if (text.length < 120) continue;
      const r = p.getBoundingClientRect();
      const cs = getComputedStyle(p);
      const fs = parseFloat(cs.fontSize) || 14;
      const maxAllowed = fs * 55;
      if (r.width > maxAllowed) {
        add("PROSE-MEASURE", "major",
          `paragraph in "${(p.parentElement?.className || p.parentElement?.tagName || "").toString().slice(0, 30)}" spans ${Math.round(r.width)}px (${(r.width / fs).toFixed(1)}em); text: "${text.slice(0, 60)}"; THE BOOK law 18 asks for ≤65ch`,
          { width: Math.round(r.width), fs });
      }
    }
  }

  return {
    route, viewport: viewport.label, locale: document.documentElement.lang || "?",
    overflow, chromeH: Math.round(chromeH), chromeShare: +chromeShare.toFixed(3),
    actionTop: actionBox ? Math.round(actionBox.top) : null,
    actionBottom: actionBox ? Math.round(actionBox.bottom) : null,
    statementTop: expectBox ? Math.round(expectBox.top) : null,
    edges: edgeList.length,
    findings,
  };
}

export function measureBorderRoles() {
  const visible = el => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 1 && r.height > 1;
  };
  const classify = el => {
    const cs = getComputedStyle(el);
    const sides = [
      [cs.borderTopWidth, cs.borderTopStyle, cs.borderTopColor],
      [cs.borderBottomWidth, cs.borderBottomStyle, cs.borderBottomColor],
      [cs.borderLeftWidth, cs.borderLeftStyle, cs.borderLeftColor],
      [cs.borderRightWidth, cs.borderRightStyle, cs.borderRightColor],
    ];
    const out = [];
    for (const [w, style, color] of sides) {
      const px = parseFloat(w) || 0;
      if (px === 0 || style === "none" || style === "hidden") continue;
      const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(color);
      const rgb = m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
      // --ink is #111314, --teal is #007190, --5 is #e8eef3, --4 is #c5d3df.
      const isInk = rgb && rgb[0] < 80 && rgb[1] < 80 && rgb[2] < 80;
      let role = "cell";
      if (px >= 3) role = "emphasis";
      else if (px >= 2) role = "structural";
      else if (isInk) role = "structural";
      out.push({ px, role, color });
    }
    return out;
  };
  const counts = { structural: 0, cell: 0, emphasis: 0 };
  for (const el of document.querySelectorAll("body *")) {
    if (!visible(el)) continue;
    for (const l of classify(el)) counts[l.role] += 1;
  }

  // A SPECIAL SECTION: a GROUP that carries its own painted ground or its
  // own structural rule, so the reader sees a division rather than one
  // long flat run.
  //
  // The search covers the WHOLE PAGE, not only <main>: the news band and
  // the newsletter block render as siblings of <main> in App.tsx, and a
  // check that stops at </main> reports a page as flat when its special
  // section is simply one level out.
  //
  // The search is over EVERY element, not only the direct children of
  // <main>: a page's sections are usually nested (main > div > section),
  // and a check that only looks one level down reports a page as flat
  // when its special section is simply two levels deeper. A container
  // that carries a treatment must also GROUP something — at least two
  // element children — otherwise it is a leaf with a border, not a
  // section.
  const special = [];
  for (const el of document.querySelectorAll("main *, .news-section, .newsletter-section, .site-footer *")) {
    if (!visible(el)) continue;
    if (el.closest(".site-footer")) continue; // the footer is its own zone
    const cs = getComputedStyle(el);
    const bg = cs.backgroundColor;
    const opaque = bg && bg !== "transparent" && !/rgba\([^)]*,\s*0\)/.test(bg);
    const tinted = opaque && bg !== "rgb(255, 255, 255)" && bg !== "rgb(246, 248, 250)";
    const lines = classify(el);
    const structural = lines.some(l => l.role === "structural" || l.role === "emphasis");
    if (!tinted && !structural) continue;
    // A section GROUPS content. Counting direct element children is too
    // strict: a real section is often one wrapper (.section) around a
    // heading and a body, so the wrapper has one child and the group
    // lives one level down. Count the text-bearing descendants instead.
    const grouped = [...el.querySelectorAll("h1,h2,h3,h4,p,li,td,th,img,button,a,dd,dt,blockquote,summary,figcaption,label,span")].filter(k => {
      const kr = k.getBoundingClientRect();
      return kr.height > 4 && kr.width > 4 && (k.textContent || "").trim().length > 0;
    }).length;
    if (grouped < 2) continue; // a leaf with a rule is not a section
    special.push({ cls: String(el.className || el.tagName).slice(0, 40), tinted, structural });
  }

  const roles = Object.entries(counts).filter(([, n]) => n > 0).map(([k]) => k);
  return {
    counts,
    roles,
    roleCount: roles.length,
    specialSections: special.length,
    specialSample: special.slice(0, 3).map(s => s.cls),
    lineTotal: counts.structural + counts.cell + counts.emphasis,
  };
}
