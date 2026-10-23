# SCITI evidence and reading plan — 23 October 2026

Invariant: no conclusion may be stronger than its cited evidence.

Design read: a city reference begins with what is known and what remains unknown, followed by the evidence needed to assess it. Reference: the reading hierarchy of an OECD country profile. The dominant element is the city finding; table rules distinguish headers from observations. Existing project typography takes precedence over the generic anti-slop font prescription.

## Audit findings

- CityDetailPage uses the curated composite while dimensionScores computes a separate depa-domain baseline. Do not replace either silently.
- Provincial observations repeat across cities. Complete records cannot establish local service adequacy.
- Derived and city-metric indicator origins alone do not guarantee city-level measurement.
- Source registry HTTP checks establish link availability, not observation freshness or scientific validity.
- Radar labels inside the scaled SVG become unreadable on phones.
- Existing dossier tabs mount only the active panel. A full printable dossier requires deliberate treatment of all panels; current print output must not be described as a complete evidence appendix.

## Implementation sequence

1. CityDetailPage, new CityEvidenceSummary, styles: explain the two frameworks before the photographic header; expose domain observation counts and provincial indicator counts. Preserve existing content and scores.
2. Test observation availability, same-province interpretation, all locales, responsive layout, and printed evidence summary. Obtain independent visual review.
3. Next: audit individual infrastructure claims and construct domain-specific service requirements with named benchmarks. Do not invent local infrastructure verdicts from baseline scores.
4. Next: indicator-level observation/publication/check dates, reproducible export snapshot and citation, full print appendix, methodology reconciliation, then rankings/comparison/homepage hierarchy.

## Release evidence

Run lint, tests, production build; render at 390/1024/1440; test Thai and Chinese; check A4 output. Preserve maps, charts, institutional marks, and curated city content. Deploy via CDPT and verify the changed dossier on the live domain. No file reductions above 30%.

## Research release — 23 October 2026

CityResearchAppendix exposes each selected indicator's raw observation, recorded period, scope, source/table identifier, and scale interpretation. Only directly linked provincial series receive a recorded observation period; missing dates remain explicit. Source publication and checking dates are not invented. Calculation specifications remain English and are labelled accordingly in all locales.

The content-addressed JSON in public/research freezes all 118 cities, provincial inputs, indicator definitions/formulas, weights, results, and the calculation source. src/researchSnapshot.json carries its SHA-256; scripts/build-research-snapshot.mjs is an explicit release step, not a build-time refresh. Existing snapshot files must be retained when creating later releases.

DossierTabs mounts all five panels on beforeprint and restores the active panel afterward. The appendix expands for print; chat controls are hidden. Content sections previously marked city-print-hide are restored within printed dossier panels; screen controls and unrelated news/signup panels are omitted. Interactive charts print as their current static rendering, not as archived interactive state. Domain-specific infrastructure adequacy still requires local service inventories and justified benchmarks; no pass/fail thresholds are inferred from the observation scales.

Validation of this increment: five focused tests passed; TypeScript passed; independent reviewer approved 390/1024/1440 captures and populated 24-page A4 print output. Snapshot checksum and all calculated results match published local inputs. The full release gate failed on UI timing checks while host load averages exceeded 400; isolated rankings tests also timed out. Release is withheld, with no production deployment from this increment. Re-run CDPT on a responsive host. The PDF is not accessibility-tagged and remains a full dossier, not the planned concise brief. Existing curated and provincial PM2.5 values differ; reconciling historical claims remains outstanding.
