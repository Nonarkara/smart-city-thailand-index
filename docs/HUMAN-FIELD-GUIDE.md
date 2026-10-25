# A compact field guide to Thai cities

## What feels mechanical

The interface repeats its own scaffolding: badges in tall stacks, a separate box for every thought, long headings, tracked labels, paragraphs that recur under different titles, and cautions written at greater length than the finding. Uniform output makes different cities feel interchangeable. More personality will not come from decoration or a friendlier chatbot greeting.

## The direction

Give the reader a place, an observation and a reason to look further. Use an edited field guide as the working model: a particular image, a short useful finding, compact comparison, then a path to the evidence. Keep visual variety tied to content: a historical object gets its catalogue view; a comparison gets a chart; a short fact gets a row. Every topic does not need the same card.

### 1. Let the place speak through verifiable particulars

Use credited local artifacts and photographs with specific captions. Keep the distinction between an image of the city, provincial context and a regional comparison. Add a date, object period or visible detail when the source supports it. Do not invent residents, interviews, quotations, field visits or stories to make a page warmer.

Next editorial increment: choose one locally verified object or streetscape per uncovered province and explain what the source actually establishes. The existing collection has gaps; regional museum objects must stay labelled as comparisons.

### 2. Make a clear editorial choice

One finding should lead each section. Highest/lowest score pairs should be readable before a paragraph of interpretation. Select a few documented examples and explicitly distinguish them from totals. Identical prose should appear once even when it serves two editorial roles.

Next editorial increment: review each city for one useful tension supported by evidence. For example, a province-level tourism statistic and a municipal service measure can be presented together only with their different scopes stated. Do not generate a distinctive-sounding verdict for all 118 cities from the same template.

### 3. Write to a reader

Prefer short, concrete labels: “Highest,” “Lowest,” “A closer look,” and “What needs a closer look.” Replace administrative explanations with the fact or question they help the reader understand. Keep essential uncertainty beside its claim. Put methodological detail within the research apparatus, without hiding the source or licence.

Next editorial increment: review repeated generated advice in the delivery and finance narratives. Phrases such as “delivery stack” and “borrowed swagger” offer posture where readers need a specific constraint, owner or unanswered question. Replacing that advice requires source review, not a cosmetic rewrite that implies new evidence.

### 4. Show authorship only where it exists

A visible editor, signed observation or “why this was selected” note can make the system accountable. Add one only with a real named contributor, an actual review date and a source trail. A computed build date is not a research review. Ask for genuine local contributions through the existing feedback flow; do not imply that the website has interviewed people.

Next editorial increment: establish a small contributor policy before adding public bylines or resident testimony: consent, attribution, geographic scope and correction history.

### 5. Keep two useful reading speeds

The first pass should show the finding, image and a few facts. The second should reveal full source records, definitions and methods. Keep both printable. Compress repeated labels, empty insets and forced line breaks; never shrink body text or stretch prose to a full desktop width to make a page look shorter.

## Implemented in this pass

- Badge row instead of badge tower; highest/lowest facts instead of a long score sentence.
- Inline project titles/descriptions and shorter count label; original projects and PDF preserved.
- Compact label/value rows, reduced nested insets, running fact pairs and less repeated card chrome.
- Shorter city chapter headings; exact duplicate analysis prose grouped with every role and qualification retained.
- Reading-size guidance in Analysis, Execution and Evidence; no source data, maps, charts, artifacts or interactions removed.

Initial Phuket phone measurements: badges 92 → 43 px; decision summary 417 → 282 px; certification brief 998 → 826 px. Desktop certification brief 613 → 418 px. These are panel-specific measurements, not a claim that every page shrank by the same percentage.

## The next pass — 68 identical cities, and three instruments that were wrong

### The mechanical feeling had a cause, and it was measurable

Fifty cities have hand-written context. The other sixty-eight — the
registered municipalities — shared four paragraphs of boilerplate, so
Ayutthaya, Lampang PAO and Phayao Municipality rendered **byte-identical
prose**. The pages looked written but carried nothing about the place.

The generated context is now assembled from each city's own province's
**measured** values, in `src/provinceNarrative.ts`:

| sentence | built from |
| --- | --- |
| livelihood | NSO population and labour force, informal-work share, internal migration |
| known for | RFD forest cover, PCD PM2.5, Ministry of Energy electricity, NSO drinking water |
| opportunity | NSO internet and mobile users, residential building permits |
| the catch | NSO/DOPA unplanned population share, RTDDI road deaths and motorcycle share, PCD PM2.5 |

Every sentence names its number, its source and its scope. Where a
province has no record, the sentence says so — absence is never printed
as zero. Scope is stated in the same breath as the figure, because a
province-level reading describes the province and not the municipal
boundary inside it, and a reader who cannot tell the difference will
over-read the number.

Result: **68 of 68 distinct livelihood sentences and 68 of 68 distinct
known-for sentences** (was 4 and 4), 398 values checked against the
datasets with **0 mismatches**, and **0 sentences** that carry neither a
number nor an explicit absence.

### Three unit errors the new prose nearly shipped

The narrative was written from indicator labels, and three labels
mislead:

- `nso-province-population` is **thousand people**, not people. Reading
  it as a head count overstated Bangkok by a factor of a thousand.
- `nso-internal-migration` is a **percentage**, not a head count.
- `nso-internet-users` and `nso-mobile-users` are **thousand people**,
  not a percentage of residents.
- `rfd-forest-coverage` is a **percentage throughout** — Bangkok's 0.4
  means 0.4%, and the first draft multiplied it to 40%.

A probe that parses the prose back into numbers and compares them to the
datasets caught all four. The units now live in `src/provinceVoice.ts`
next to the reading, so the next writer cannot repeat them.

### One false absence, found and fixed

The city registry says "Ayutthaya"; the datasets say "Phra Nakhon Si
Ayutthaya". The alias pointed the wrong way, so Ayutthaya resolved to
nothing and the narrative claimed the data was absent when it was
present — a false statement of absence, the one failure this module
must never produce. `scripts/audit/probe-province-resolution.mjs` now
proves all 118 city provinces resolve to a dataset key.

### Three instruments that were wrong about the page

An audit that reports a defect that is not there is worse than no audit,
because it sends the next agent to fix a page that is already correct.

- **Ink overlap measured font boxes, not ink.** A `Range` rect for a
  32px numeral is ~42px tall — the font's ascent and descent — while the
  glyphs occupy about 22px of it. The "Curated score" label and the
  "72.6" numeral reported a 5px overlap; a screenshot showed clean
  space between them. The instrument now converts every rect into its
  true ink band using the browser's own `measureText()` metrics
  (`actualBoundingBoxAscent`/`Descent` against `fontBoundingBoxAscent`).
- **Hidden content reported geometry.** Content inside a closed
  `<details>` is hidden with `content-visibility`, and `<option>` inside
  a `<select>` lives in a dropdown list — neither is painted, yet both
  report a box. That was the source of 3,082 "overlaps" on `/invest`
  alone. The instrument now asks `checkVisibility()` and skips both.
- **A floating control was sized against a column that has no gutter.**
  The chat button was measured as overlapping text at every width below
  1280px. It now floats only where a lane exists and lives in the
  navigation below that: **0 coverage at 390, 480, 600, 720, 768, 834,
  900, 1024, 1180, 1280 and 1440 px**, measured with the sweep's own
  filter.

### The baht sign is a Thai character

The investability chip reads "Land: ฿50,000/m²" in tracked mono. The
baht sign (U+0E3F) is inside the Thai Unicode block, and tracking pulls
it off the digits it belongs to — the same defect the Thai-locale
override exists to prevent, arriving on the English page through a
currency symbol. The chip no longer tracks.

### One fact, one place, one size

Three pages repeated a numeral at display size in two places close
enough to be read together:

- `/invest` — the macro strip repeated "7–14%" and "$219B" from the
  World Bank CCDR panel below, and six of its eight cells are an
  em-dash standing for "source reconciliation pending" — six 32px holes
  in the page's hierarchy. The strip is a reference band and now sets its
  values at body size; the CCDR panel keeps display size for the page's
  actual finding.
- `/program` — the concept cards were numbered 1, 2, 3 and the
  Two-Five-Seven mnemonic below was numbered 2, 5, 7. Two bare "2"s at
  display size. The concept cards are now 01 / 02 / 03.
- `/audit` — a scope KPI read "49" and the confidence panel below read
  "49" for a different thing. The confidence figure now says what it
  counts: "49 cities".

### The heritage collection was checked against its sources

The eight attributed images in `src/heritageCollection.ts` were verified
against the Met Museum and Wikimedia Commons records, and the two
Phuket/Nakhon images were opened and read: the Nakhon image does show
the orange cloth procession the caption claims, and the Phuket image is
the golden dragon monument at the top of Thalang Road. Attribution,
object period, licence and scope are in `docs/VISUAL-HERITAGE.md`.

## Acceptance

At 390, 1024 and 1440 px, reading order remains visible, prose retains 14px, no page-wide horizontal overflow or clipped source links, translations fit, and print keeps source qualifications. Independent review covers all seven anti-slop rules. Automated checks preserve project examples and both roles of a repeated note. Repeat against the production URL after deployment.

The five-tab audit also found literal horizontal bleed in the existing score table: "Contribution" painted beyond its 56px grid track while the span's own bounding rectangle looked contained. At 390px the root scroll width was 411px. The header now has a 96px track and ordinary case/spacing; all five tabs pass the page-width check at all three review widths. Text containment must be measured, not inferred from an element's box.

## Acceptance for the generated voice

- 68 of 68 generated cities have a distinct livelihood and a distinct
  known-for sentence (`src/provinceVoice.test.ts`).
- Every generated field carries a number or an explicit absence.
- Every number in the prose parses back to the dataset value within the
  rounding used, across all 68 cities.
- Every city's province resolves to a dataset key.
- A province with no record is never rendered as a zero.


## The second pass — what the live page showed

The voice shipped and the unit tests were green, but the rendered page
was read, and it showed three defects the tests could not see.

### The prose ran on

"A known for" read: *"Annual PM2.5 is 23.0 µg/m³ (Pollution Control
Department) Electricity runs at 6,281 kWh per person a year…"* — a
sentence with no full stop between it and the next one, so two claims
read as one. It happened wherever a sentence ended in a source
attribution instead of a mark: `(Royal Forest Department)`, `(NSO, 2022–26)`,
`(Pollution Control Department)`.

The terminator is now applied **when the sentence is built**, not when
the sentences are joined. A terminator added later cannot guarantee that
every clause ended properly, and one fragment is enough to make a whole
page read as machine output. English takes a full stop, Chinese takes
。, and Thai takes none — Thai is written with spaces between clauses,
and a full stop in a Thai sentence is a foreigner's mark.

### The air quality was said twice

PM2.5 appeared in "Known for" and again in "Main constraint" on the
same page. Both sentences were true, and together they made the page
look generated. **Each measured quantity is now owned by exactly one
field**, and the test that enforces it follows the *quantity*, not the
numeral: 0.3% of households in non-durable housing and 0.3% of the
household register not counted are two different facts that happen to
share a value, and a numeral scan flagged them for a while before it
was clear it was measuring coincidence.

### Every city said it the same way

The data was per-city; the *frame* was not. Sixty-eight cities shared
one sentence frame per field, with the digits swapped. That is what
"mechanical" actually looked like.

The fix is not more adjectives. Every reading is now placed in its
**quartile band** among the provinces that indicator covers, and the
sentence frame is chosen by that band. A province in the top quarter of
forest cover is described differently from one in the bottom quarter.
The boundaries are computed from the values the dataset holds — no
threshold is hand-picked, so a band always means the same thing: the
top quarter, the middle, or the bottom quarter of the provinces that
indicator covers.

**How far it moved:** before, one frame served all 68 cities and all 77
provinces. Now the widest frame spans four provinces — Sakon Nakhon,
Kalasin, Chaiyaphum and Sisaket — and those four were checked by hand
against their measured values: populations of 730 to 866 thousand,
labour forces of 396 to 556 thousand, the same informal band and the
same migration band. They *are* the same kind of place, and the prose
says so because the data says so. Manufacturing a difference the data
does not support would be a worse failure than the repetition.

Two further readings were added because they were unused and they
discriminate: the residential share of the grid (Ministry of Energy,
2023) and the condition of the housing stock (NSO household survey,
**2010** — the year is stated in the sentence, because a decade-old
baseline must never be dressed as a current one).

### The open question was 67 identical sentences

The unanswered question was keyed to the city's smart dimension, and 67
of the 68 generated cities share the same dimension. The question is now
keyed to the province's **most extreme reading** instead: the traffic
question for the worst road-death count, the reach question where most
work is informal, the usage question where the network is thinnest. It
never quotes a number, because every number it could quote already
appears in another field on the same page.

### The page printed the same paragraph three times

This is the one that was not about the generated layer at all. On every
city page the "Reality gap" card, the "Strategic advantage" card and
the "Exportable lesson" card echoed the context voices verbatim, and
the Analysis tab printed the same voices again in its factbook rows.
Three voices, seven slots, and several slots fell back to the same
text.

**The instrument that found it** is `scripts/audit/probe-repeat-blocks.mjs`:
it reads the rendered page and reports any paragraph that appears twice,
or that is nested inside another. It was falsified against the
pre-fix production build first — **46 repeated blocks across seven
pages** — and it reports **0** after the fix.

The voices are now *split* rather than repeated:

| Surface | Carries |
|---|---|
| Factbook · Known for | the measured character + registry status |
| Factbook · Livelihood pattern | the city framing sentence |
| Factbook · Main constraint | the constraint voice |
| Factbook · Global analog (note) | the open question |
| Texture · Major industries | the registered smart dimensions |
| Texture · How people live | the measured livelihood |
| Texture · Signature story | the opportunity readings |
| Texture · Fun fact | the single most distinctive fact |
| Dossier · Reality gap | the computed gap, not the voice |
| Dossier · Strategic advantage | the CDP's own lens, not the voice |

The instrument has one trap worth naming: it must NOT filter by
visibility. The dossier keeps every tab in the DOM and hides the
inactive ones with CSS, so a visibility filter skips the whole
Analysis tab and the probe reports nothing at all — a probe that
passes because it looked at nothing.

## Acceptance for this pass

- Every English and Chinese sentence in every generated field ends with
  a terminator; 0 unterminated across 68 cities × 4 fields × 3 locales.
- Each measured quantity appears in exactly one field; 0 offenders.
- No frame is shared across more than four provinces, in any locale.
- No paragraph is printed twice on any city page, in English or Thai;
  0 repeated blocks across seven pages, against 46 before.

## The third pass — every section was shouting

### The prose was fixed. The type was still a machine.

The second pass made 68 cities speak in their own measured data. The page
still read as a machine, and the reason was not the words. It was the
scale.

Run against production, the site's own type instrument reported:

```
TOTAL display-size statements: 97 (one per page is the law)
```

Workspace `CLAUDE.md` §11.7 is explicit: *"**Display** (`--text-display`,
32px) — page title only. One per page."* Composite numerals are exempt
(*"a single hero number like a score or a date … reads as a number, not as
text"*). Ninety-seven statements across twelve routes means the law was
being broken six to seventeen times on a single page.

The culprit was one commit — Codex's `8c7d4b1` *"Restore reading
hierarchy across city and research pages"* — which set every section
heading to the display token:

```css
main .section > h2, … { font-size: var(--text-display); border-top: 3px solid var(--ink); }
```

Sixteen section headings on the city dossier became the same size as the
city's own name. Every section carried the same 32px type and the same 3px
black rule, so the eye had nothing to follow. That sameness *is* what
"mechanical" means — not the vocabulary.

### The stylesheet had already written the answer down

Before that commit, `styles.css` carried the law in its own words:

> **THE SECTION LANDMARK** — "With three text sizes, the section level
> cannot be carried by scale. It is carried by a RULE and by AIR: a hairline
> above the heading, and a fixed step between sections."

And the page proved the rule was broken by accident, not by design. On one
homepage screen:

| Heading | Size before | Size after |
|---|---|---|
| "How the numbers work" | 14px | 14px |
| "One city that wins each axis" | 32px | 14px |

Two section headings on the same page, at two different sizes, decided by
**how deeply they were nested in the DOM**. Nothing to do with meaning.

The restoration is therefore a restoration, not a redesign: the pre-`8c7d4b1`
build was measured in a worktree and it passed the law with exactly one
display statement per route.

### What changed

| Rule | Before | After |
|---|---|---|
| `main .section > h2` (+ 4 siblings) | `--text-display` 32px, 3px ink rule | `--text-body` 14px / 800, 1px hairline |
| `.depa-official-header h2` | 32px | 14px / 800 |
| `main .invest-reading-title` | 32px | 14px / 800 |
| `main .opening-argument-headline` | 32px | 14px / 700 (a lede, not a second title) |

The heading keeps the base `<h2>` voice — 800 weight, ink, tight tracking —
so it still reads as a chapter rather than as the paragraph beneath it.
The landmark returns to a hairline. The composite numerals keep the
display token, as §11.7 allows, so the city score, the tier letter and
the pillar figures still read as figures and not as text.

Result: **97 → 17** display statements, and every one of the seventeen is
a page title. The city dossier went from sixteen display headings to
none. The homepage's opening-argument band became a *lede* under the
title, with the numerals carrying the band.

### The instrument now fails the build

`scripts/audit/type-and-rhythm.mjs` counted display statements for weeks
and never failed anything, so the regression could ship quietly. It now
gates:

- a display-size sentence that is **not** the page's `<h1>` → failure;
- a second display-size title on one page → failure;
- a display-size sentence inside a dossier tab → failure;
- **a route that could not be loaded → failure**, because a route that was
  not measured is not a pass. This one was added after a dead preview
  server produced a clean-looking run on half its routes.

Falsified against production before the fix: exit 1, naming every
offending heading. Passing against the patched build: 12/12 routes
measured, exit 0.

## Acceptance for the third pass

- One display-size statement per route, and it is the page title: 12/12
  routes measured, 17 statements counted (12 titles + the city title seen
  once per dossier tab), 0 offenders.
- The gate fails against production (exit 1) and passes against the
  patched build (exit 0), and it fails when a route cannot be loaded.
- Every CSS edit went through a brace-matched, asserted script that
  verifies the selector resolves to exactly one rule and that braces
  balance before and after.
