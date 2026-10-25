# Container alignment and decision surfaces · 25 October 2026

The owner's1979px screenshot disproved the previous bounded pass. The homepage was capped at1440px but calculated its internal left inset from100vw, shifting the title away from every other content edge. This fix uses the containing block; the geometry audit now includes1980px and2560px and deliberately reintroduces100vw to prove the assertion catches it.

## Layout dispositions

- Homepage/photo/fingerprint insets follow their container. Title and body share an edge at all tested widths. Counts are supporting body-size data, with a visible curated-status qualification. Related introduction/rankings/explanation actions form one group.
- City Overview retained a negative margin from its earlier photo-overlap design; this collapsed the active panel beneath the tabs. Reset the actual in-tab summary margin; no spacer added.
- Decision tool route photos now occupy an80px context row with96px-wide image; full captions remain expandable. Main page title wins. Long titles use1.15line-height.
- Search is now in the ranking header and visible in the first phone screen. Weight diagram and leading-city explanations remain available in a disclosure. Editorial picks follow results and their cards size to content.
- Five homepage purposes state relevant evidence and specific gaps, and open the corresponding ranking lens. Generic method content remains in a labelled disclosure. Disclosure content is available in print.

## Seven-rule check

Content-sized containers; unequal photo/text roles; prose limited to65ch; existing project typefaces and three sizes preserved; no new ornaments/cards/filler photos; one page-title focal point; shorter task chrome. The project font exception remains explicit in CLAUDE.md. Maps, charts, cultural images, downloads, comparison views, all dossiers and source content remain.

## Verification

Independent review:56loaded states, EN/TH ×390/1024/1440/1980 ×home/rankings/Phuket/baseline/invest/compare/discover, plus20Phuket tab captures. No sideways overflow in those states; original city-header clipping and wide-inset fault closed. Purpose navigation, open source guide/photo captions and natural reveal scrolling exercised. Latest bounded phone checks confirm search at~405–470px. Automated home audit covers all three locales at390/1024/1440/1980/2560 with title alignment, primary action, hero height and zero empty inter-band row assertions; mutations restore height/inset faults and must fail.

Data corrections and their limits are in `2026-10-25-decision-data-sweep.md`. Targeted UI/navigation tests pass12/12; data tests20/20. Final CDPT performs the combined tests, lint, build and live publication contract. Local captures and instrument logs are under `.tmp/oct25-wide-review/` and `.tmp/home-repair/`.

Remaining: metadata ribbon scrolls on phones; English brand explanation wraps. Raw curated seeds are not newly verified live observations. Legacy financing proposals are labelled indicative; no tax/return/suitability guarantee should be inferred. Do not call this a whole-system accuracy certification.

## Concurrent lower-home repair

The separately authored `home-index.css` repair and its `home-index-layout.mjs` audit are included in the same release. Their scoped rules preserve7pillar entries,6regions and5road-safety rows; labels wrap rather than truncate. Recorded18locale/width states have24px section gaps,0clipped city names and0document overflow, including719/720px breakpoint neighbours. Restoring doubled section spacing fails that audit. This closes lower-page spacing debt without deploying a snapshot that omits the data/decision repairs above.

## Narrative formatting performance

Repeated native locale negotiation in number formatting made the full118-city narrative corpus expensive. `provinceVoice.ts` now reuses `Intl.NumberFormat` by locale/precision. Full voice+sentence-set JSON SHA-256 is unchanged (`9613e76635ee1c8e6831babc6d0b4057d0f6b7f67013e9a5a8c693dd38f09b66`). On this contended host, baseline corpus runs took11.17/11.99/12.24seconds; cached generation took0.569seconds. These are local diagnostic timings, not an end-user speed guarantee. Tests compare native output across rounding, signs, special values and precision, and assert formatter reuse. Test timeouts and existing narrative assertions remain unchanged. The new purpose-navigation path is tested in the real browser in `home-reading.mjs`, alongside the component test, rather than duplicating an expensive whole-App unit mount.

## Release validation location

Local full-suite attempts encountered15second wall-clock timeouts even in unchanged App tests while shared-host load exceeded300; the release was held. The final full suite runs on the repository's existing GitHub Pages workflow. CDPT can consume that successful run only from a clean checkout and only when workflow identity, completion, success and exact commit SHA match. Stale, failed, incomplete and partial-workflow mutations are rejected. The artifact produced by that exact validated run is downloaded and its archive checksum recorded; all live publication checks still run. No test timeout or assertion is relaxed. The earlier broad App navigation test was replaced by the actual browser navigation check and focused guide test before this candidate was committed.
