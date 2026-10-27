# Laem Chabang context and provenance

The new `/city/laem-chabang/` route supplies municipal context separately from the 118 existing SCITI assessment/registry records. No default 39.5 score, tier, recognition or registry status is manufactured. `assessment` is null; certification is not verified. A 2024 cooperation agreement records an agreement, not certification or measured outcomes.

The source JSON is generated deterministically from `src/laemChabangData.ts` into `public/data/cities/laem-chabang.json` and `dist/data/cities/laem-chabang.json`. It has a stable schema/version, translated title/labels/scope, five sourced facts, three dated public-record entries, three data gaps, five source records and links. Source check date is distinct from each observation period. Exact source contract is tested against the typed data.

## Evidence used

- [SAC government community record](https://wikicommunity.sac.or.th/community/2642), published 6 June 2025: reported municipal extent 109.65 km²; observation year not given. It cites DOPA's December 2024 registered municipal population 86,790. This is a secondary reference to DOPA, not a downloaded raw municipal register or a count of all people currently present. The separate Thung Sukhla subdistrict population is not substituted for the municipality.
- [Government Public Relations Department](https://thailand.prd.go.th/en/content/category/detail/id/48/iid/229622), published 4 November 2023: FY2023 whole-port containers 8.67 million TEU and 11,700 vessel calls. Annual calls are not a live vessel count. The article's historical construction deadline is not reused as current completion evidence.
- [DP World](https://www.dpworld.com/en/news/dp-world-secures-laem-chabang-concession-extension-amid-rising-intra-asia-trade), published 7 May 2026: LCIT terminal throughput 1.936 million TEU in 2025. This is an operator report covering B5/C3, not the whole port, city GDP or a direct trend comparison with the older whole-port number.
- [depa](https://www.depa.or.th/en/article-view/20240930_02), published 30 September 2024: municipal smart-city cooperation agreement, covering digital infrastructure, data and services. The record does not establish outcomes or certification.
- [Thai Government](https://www.thaigov.go.th/th/news/170094), published 12 October 2026: a site visit reported remote cranes and autonomous trucks at Hutchison Terminal D. The profile preserves the terminal-specific reported scope and does not call it connected citywide telemetry.

Municipal GDP, household income, job totals, environment/service time series and scores remain unavailable. Port or provincial output is not substituted. The official municipal portal is linked as an external service source, with no claim of live connection.

## Map boundary is not a legal-extent measurement

The TDV municipal-geometry audit found that an older cached lcbcity polygon was self-intersecting and only 33.54 km². It must not be reused. The corrected current OSM relation 19538763 reference polygon is valid and about 92.11 km², which still differs from the 109.65 km² published municipal extent. Neither the SCITI number nor the mapped reference is silently stretched to fit the other. TDV owns current footprint counts, tag-based classifications, modelled/unknown heights and their source metadata; this profile duplicates no building census.

## Verification and remaining review

Focused contract/routing/trilingual-render/metadata checks pass 11 tests; type-check and changed-file lint pass. Responsive evidence is recorded under `evidence/laem-chabang`. The full local check did not clear: it was stopped during severe host contention after two existing ResearchNotes timing failures. The same ResearchNotes suite then passed4/4 in isolation without assertion or timeout changes. Exact-commit full CI/CDPT remains required. Browser evidence must be independently inspected by the parent before publication. This worktree contains no commits or deployment; the primary dirty Nong Plub checkout is untouched.

A pre-existing heritage postbuild issue was reproduced: the SSR export started a browser dependency scan and closed before it completed, printing obsolete-request errors. Its SSR-only server now disables dependency discovery. The actual 118-city/93-record heritage JSON remains byte-identical, SHA256 `89d32e5914eea0f8f0b80adaf869bffeba507aa8b8d05590b1cfb1aa8c9374cd`.

Responsive browser evidence passed EN/TH/CN at 390×844, 1024×900 and 1440×900. Title/intro height on the phone is 144.9 px EN and 108.1 px TH/CN; primary actions end at 266.5/229.7 px. Actual evidence rows stay below 89.1 px, with no overflow or page errors. A deliberately enlarged heading/padding fails the 190 px budget. Actual keyboard navigation and Enter-triggered JSON downloads preserve the exact source bytes. This is desktop Chrome viewport evidence, not a physical-phone claim. Independent parent visual review and exact-commit full CI/CDPT remain required.

Parent review identified an unnecessary900px fact track that separated short labels from their values. Desktop evidence now uses65ch and the fact register440px; actual text-Range gaps are at most228.9px EN,245.0px TH and315.6px CN against a320px budget. Restoring the prior900px rule produces617.6–688.8px gaps and fails that same budget. All observation, scope and source lines remain visible; no row exceeds89.1px across the nine viewport/locale cases. Header geometry is unchanged. The fixed white header's dark-mode menu glyph now uses its existing blue ink rather than white, and the opened menu was visually checked.
