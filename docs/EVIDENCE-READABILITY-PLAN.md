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
