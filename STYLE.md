# SCITI 2026 — Style & Design Scripture

Governed by: **Design Principles: No MSH, No Slop, Real Balance**  
Owner: Non Arkaraprasertkul · Version: 9 Nov 2026 (Asia/Bangkok)  
Supersedes `THE-BOOK.md` (5 Nov), `MSH.md`, and overlapping prose in legacy audit guides.

---

## 1. Absolute Authority & Hard Laws (Part 1 L1–L20)

Every surface in SCITI adheres strictly to the 20 Hard Laws:

- **L1 (Box Fit):** Boxes fit content. Max 2x content width, 1.6x content height. Padding 0.5 to 1.5x line height. No `min-height` that leaves >1 empty line.
- **L2 (No Dead Void):** No empty region > 1/3 of first screen without named job (B1). No phone-width column floating on desktop.
- **L3 (Compact First):** If the task fits in one screen at 390×844 and 1440×900, it fits. Scrolling must reveal new facts or actions.
- **L4 (Thin Chrome):** Sticky topbar ≤ 12% viewport height on desktop (108px at 900) and ≤ 15% on phone (127px at 844). One single identity line.
- **L5 (On Grid):** Spacing strictly on 4px multiples (MoMA scale). Pixel alignment (<8px near-miss fails).
- **L6 (Fix First Expansion):** Remove the cause of bloat (padding, fixed height, hero height); never fill voids with decoration.
- **L7 (Something Wins):** One primary focal point, clear second. Hierarchy step ≥ 1.5x font size. No grid of equal cards as main content.
- **L8 (Payload on Exit):** Visual order equals keyboard tab order. Key headline, number, and action sit immediately beside/below heaviest visual (no leapfrog).
- **L9 (No Invented Data):** Every number has source + timestamp / "as of" date. No lorem, no unverified stats.
- **L10 (No Invented Locations):** No centroid coordinates, no `0,0`, no guessed pins. Unclear = unpinned + human flag.
- **L11 (No Filler Words):** Zero uses of: *unlock, seamless, revolutionize, empower, supercharge, elevate, streamline, "in today's fast-paced world"*. No greeting titles, no UI exclamation marks.
- **L12 (Logos Never Boxed):** No border, chip, tile, card, pill, shadow, or backing behind logos. Plain transparent logos + gap + text only.
- **L13 (Ship Basics):** Contrast ≥ 4.5:1 (≥ 3:1 for display 24px+). Tap targets ≥ 44×44px. Visible focus. Truthful `alt`.
- **L14 (Auditor != Builder):** Independent audit check.
- **L15 (Decoration Bans):** Zero decorative gradients, gradient text, glassmorphism/blur, glows, blobs, generated hero art, emoji icons/bullets, idle animations, or `transition: all`.
- **L16 (Count Caps per Screen):** Max 15 boxes/cards, 3 drop shadows, 5 pills/badges, 8 font sizes, 2 type families. Corner radius 0 default.
- **L17 (No Default Palette):** Neutral ground + 1 accent (stated job). Light ground default. No purple/violet/indigo.
- **L18 (No Slop Fonts):** No Inter, Poppins, Montserrat, Roboto, etc. House defaults: Josefin Sans / Jost / Source Sans 3 / Prompt or Kanit (Thai) / JetBrains Mono (numerics).
- **L19 (No Template Skeletons):** No centered slogan hero + button + 3 cards.
- **L20 (No First-Load Wall):** No modal, interstitial, or splash before content.

---

## 2. Protected Stylistic Choices (Named Exceptions & Reasons)

As permitted by Section 0 of the scripture, the following specific stylistic decisions are declared and protected for SCITI 2026:

### A. Color Harmony (Sanzo Wada × Dr Non Palette)
- **Palette Origin:** `https://github.com/Nonarkara/palette`
- **Brand Chord:** Sanzo Wada Plate 002:
  - Ground / Stage: Dark Tyrian Blue (`#12354e`) and Crisp Paper (`#FFFFFF` / `#F8FAFC`).
  - Primary Accent: Yellow Orange (`#f99d1b` / `#d98218`) — stated job: highlights, focus states, and priority signals.
  - Secondary Accent: Wada Yellow (`#fff200`) — stated job: depa institutional identity and key eyebrow anchors.
  - Status Scale: Wada Antwarp Blue (`#007190` — Operational/Certified), Yellow Orange (`#d98218` — Building/Partial), Dr Non's About Red (`#a72144` — Planned/Risk: classy & dangerous).
  - Single Amber Focus: `#f59e0b`.

### B. Typography Stack
- **Three-Size Type Scale:**
  - `--text-display`: 32px (line height 1.1–1.2)
  - `--text-body`: 14px (line height 1.4–1.5)
  - `--text-micro`: 11.5px (line height 1.3–1.4)
- **Faces:**
  - Latin Body & System: High-legibility system UI (SF Pro on macOS, Segoe UI on Windows) disappearing into the OS, or Jost / Source Sans 3.
  - Latin Display: Josefin Sans or Jost display.
  - Thai Typography (Non-looped only): `IBM Plex Sans Thai` as primary, `Prompt` or `Kanit` as display alternate. Looped Thai faces (`Sarabun`, `TH Sarabun New`) are strictly forbidden.
  - Numerals: `IBM Plex Mono` / `JetBrains Mono` with tabular numbers (`tnum`).

### C. Zero Tokens Law (Phase 17)
- **Corner Radius:** `0px` site-wide (`--radius: 0`, `--radius-sm: 0`, `--radius-xs: 0`). No rounded cards, buttons, or input boxes.
- **Drop Shadows:** `none` site-wide (`--shadow-premium: none`, `--card-shadow: none`). Only `inset` hairline borders or focus rings.
- **Gradients:** Zero decorative gradients. Only dark-over-photo legibility scrims on photographic heroes (`.cinematic-hero-overlay`).

### D. Commissioned Mascot Integration (Nong Plub Presenter Band)
- **Mascot Doctrine:** Commissioned crayon drawings by local artists. Nong Plub is an editorial companion, never a sticker cut and pasted into white space.
- **Presenter Band Contract:** She stands firmly on the closing hairline of the band (`.page-guide::after` / border hairline), with her lower body merging into the line on which her frame sits (104px on phone, 128px on desktop). The handwritten note and action link sit beside her. She appears at most once per page.

---

## 3. Surface-Specific Rules (Part 3)

### Dashboard & Map (`/map`)
- No page scroll at 1440×900 and 1280×800 landscape (`scrollHeight <= innerHeight`).
- Map takes ≥ 60% of first screen. Compact panels dock at edges.
- Tables over cards for comparisons; numbers right-aligned with tabular figures.

### Marketing & Landing (`/`, `/story`)
- First screen at 1440×900 shows headline, primary action, and real evidence.
- Hero ≤ 70% of first screen.
- Features shown via asymmetric layout or structured comparisons, never 3 equal cards.

### Document & Report (`/references`, `/methodology`, `/city/:id`)
- Prose measure: 45 to 75 characters (target `max-width: 65ch`).
- Line height: 1.4 to 1.6.
- Every chart/table includes source, timestamp, and methodology note.

### Phone (390×844)
- Phone-first base CSS. Primary information and primary action visible without scrolling.
- Single column; tap targets ≥ 44×44px with ≥ 8px separation.
- Sticky chrome ≤ 15% viewport height.
