# Design Scripture Audit — SCITI 2026 · 7 November 2026

Independent audit of sciti.nonarkara.org against `/Users/nonarkara/Downloads/THE-BOOK-Design-Scripture.md`
(Surah 5 B1–B18, five measurements, ship basics 6.4). Auditor ≠ builder: the site was
built by MiniMax/mcode and parallel sessions; this walk was done by GLM (opencode).

```text
Verdict: PASS (after fixes this round — list below)
Auditor (≠ builder): opencode/glm-5.3-flash-free
URL / PR: https://sciti.nonarkara.org (main @ 0a3a03c + this fix commit)
Widths / langs checked: 1440 / 1024 (via gates) / 390; en (th, zh via trilingual gates)
MSH fails (id → element → smallest repair):
  B17 → 34 × `transition: all` in styles.css → named properties
        (color, background-color, border-color, opacity, transform,
         box-shadow, filter, fill, stroke), durations preserved
  B17 → .cinematic-hero-img Ken Burns 25s infinite autoplay zoom → removed;
        the hero speaks in its photograph
  B17 → .photo-strip-item:hover img scale(1.03) card hover-scale → removed
  B17 → .mini-map-pulse and .action-atlas-target-ring idle infinite loops →
        3 pulses on selection, then rest (motion marks the user's action)
  6.4 img-alt → 9 programme photographs with alt="" → truthful trilingual alts
        (each photo viewed and identified before writing)
  6.4 img-alt → bingo mascot avatar alt="" → named
  6.4 img-alt → Leaflet basemap tiles shipped with no alt attribute → explicit
        decorative alt="" on tileload; container keeps its aria-label
Triage (heavy / light / none): all light; geometry untouched
Before / after screenshots: .tmp/book-*.png (10 routes × 1440 + 390)
Scanner: collide sweep PASS 22 routes × 2 locales × 2 viewports; falsify-collide
  28/28; page budget ok at lowered ceilings; demo-journey 27 states; plub 48 states
MoMA / Non-Slop notes: radius tokens (--radius-*) are the product's named system —
  STYLE-protected, not stripped; hairlines 1px; spacing on scale
Kept on purpose: amber single accent; Josefin Sans display + Source Sans 3 +
  JetBrains Mono (house faces, none in the banned list); light default; depa/
  ministry logos unboxed in topbar and footer strip
Unverified: real-phone tap feel (390 checks were emulator-accurate, not hardware);
  TH/ZH prose quality of the new alts needs the standing independent reviewer
```

## Five measurements (first screen, 1440 / 390)

1. Chrome cost — topbar 52px @1440 (6%), 48px @390 (6%); canvas toolbar 17% on
   phone (instrument toolbar, fits its contents). PASS.
2. Task visibility — search/action on the hero's exit at both sizes; map page
   keeps map ≥60% with region instruments docked. PASS.
3. Geometry failures — zero horizontal overflow across 22 routes × 2 viewports;
   no first-load modal; no dead third on any audited first screen. PASS.
4. Hierarchy — stated 1/2/3 (hero photo → headline → search/stats); squint shows
   a winner on every audited route. PASS.
5. Preservation — no content deleted to pass; mascot heroes, maps, bingo,
   investment band all intact; motion fixes removed only idle loops. PASS.

## Judged compliant, not slop

- "streamline / unlock / boost" hits live inside substantive research prose
  (financial-toolkit mechanism descriptions, knowledge-page analysis), not UI
  chrome or filler copy.
- Empty `alt=""` remains only on decorative art whose payload is adjacent text
  (InvestmentFit mascot beside her handwriting note; basemap tiles under a
  labelled container).
- Selection rings pulse 3× (finite) — motion communicating a user action.
