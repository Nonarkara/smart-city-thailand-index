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

