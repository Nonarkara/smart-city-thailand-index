# Combined release audit · 25 October 2026

This pass reviews the combined province-voice, density, typography and earlier security/data-contract work. It records confirmed defects and their dispositions. It does not certify every inherited narrative against external primary evidence or guarantee that the system is free of all defects.

## Confirmed defects corrected

| Finding | Disposition | Regression evidence |
| --- | --- | --- |
| Motorcycle share of recorded road deaths was described as registered-vehicle share | Restore the recorded-vehicle death denominator, 2025 period and national 44.2% missing-vehicle caveat in EN/TH/ZH | `provinceNarrativeAccuracy.test.ts` checks Samut Sakhon's 97.6% with the correct denominator |
| A whole top/bottom quartile was described as the single highest/lowest province; quartiles were also mistaken for means | All 15 comparative blocks state rank, quartile and direction; unsupported causal predictions removed | Housing 1.2% is explicitly tested as top-quartile but not the maximum; forest/air ranks checked across cities |
| 2010 within-province five-year migration was described as current migration in/out | Restore survey period and within-province definition | Trilingual migration regression |
| People using mobile phones were described as subscribers | Use mobile users and Q4 2022; identify mixed-vintage ratios | Mobile-user regression |
| Historical household water coverage lacked its denominator and age | State households and 2010 survey; distinguish series vintages | Water/period regression |
| Analysis introduction repeated the Reality gap paragraph | Keep the labelled card and remove the duplicate introductory rendering | Repeat probe now includes introductory summary/thesis selectors |
| CSS source guard skipped rules inside media/supports blocks | Parse CSS with PostCSS and test nested-rule counterexample | `typeLaw.test.ts`; parser declared as a direct development dependency |
| Two typography instruments demanded opposite section sizes | Reading check now verifies title role, section weight contrast, readable prose and containment; type law checks display usage separately | Rendered route audit plus nested-rule unit regression |
| Desktop city photograph consumed almost half the first viewport | Cap desktop/tablet banner at 280px and retain title, score and fingerprint; bound introductory prose to 65ch | 390/1024/1440 screenshots and independent review |

## Earlier hardening retained in the combined commits

`9f893b8` includes the earlier fixes from this chat: population/labour observation numbers agree with their units, FDI is labelled in million baht, raw metric units and baseline provenance are explicit, and catalogue defaults are not described as local verification. CSV exports carry the same disclosures.

Optional Google Apps Script ingestion now fails closed without a configured secret and stores formula-leading strings literally. The Vercel signal adapter rejects HTTP-200 JSON error envelopes instead of claiming that a write persisted. These source changes and mocked regressions do not prove that an independently hosted Apps Script deployment or Vercel installation was updated. Cloudflare's live site serves its own static read API; no live evidence writes were attempted.

## Security and scope

- The production dependency audit reports zero known advisories in the audited lockfile. The full dependency audit retains 14 development-tool findings: 11 high, one moderate and two low, concentrated in the Lighthouse CI tree. Compatible fixes removed the critical finding; npm's proposed breaking Lighthouse downgrade was not applied.
- The redacted history scan examined 320 commits and reported 107 matches. Of these, 106 generic-key matches name metric identifiers (`metricKey`, `metric_key_or_recommendation_key`, `item.metricKey`), not credentials. One GCP-key finding is the previously documented key in historical commit `c84a517b`; project context records that its backing project was deleted. This pass did not use the key or independently re-test revocation. No credentials are reproduced in this report.
- The current inline-script CSP remains a defense limitation. No exploitable script-injection path was confirmed in the reviewed changes. This is not a penetration-test certificate.
- Government baseline series have different years and geographic scopes. Correctly calculated provincial comparisons do not establish municipal service adequacy or site-level investment viability.
- The established project typefaces were preserved. This pass did not silently substitute a font to resolve the conflict between the historic project system-font choice and later workspace font preferences. Token compliance alone is not treated as proof of readability.

## Cleanup

The retired Bauhaus checkout had no unique commits and no identified process/service using its path. Its untracked 76MB audit evidence was preserved at `.tmp/retired-bauhaus-audit-20261024` before removing the checkout without force. The temporary precodex registration pointed to an already absent path and was pruned. Active source work and probes were retained.

## Release evidence

The release sequence runs the full unit suite, lint and production build before commit/push/deploy. It then verifies deployed JavaScript bytes, key routes, all 118 city dossiers and 118 city CSVs against the build, query filters/sort order, JSON error behavior, HEAD responses and the immutable research snapshot's complete checksum. Browser checks cover city tabs and shared routes at phone/tablet/desktop widths; source accuracy regressions remain separate from visual checks.

Local machine-readable evidence and screenshots are stored under `.tmp/`; these diagnostic artifacts are not public research evidence or a substitute for sources.

## Closing the independent rendered review

A fresh rendered review returned two additional blockers, not a pass: at 1024px the hero fingerprint overlapped the score; at 1024/1440px Analysis started 117/130px below the tabs. The fingerprint now occupies its own 64px area above the score. The active tab no longer inherits a section margin from a hidden predecessor, and the first chapter's top inset is 8px. The fingerprint chart and every tab remain available.

The expanded 22-route type check also caught display-sized secondary prose on About/Creative Economy, a leader name and text-labelled metric callouts on Showcase, and Bingo's decorative photo caption. Those use the reading size now; numeric facts and the actual page titles retain the display role. The off-scale check is now an actual gate for application text. Leaflet's own map controls are explicitly excluded from the application type scale; they remain independently visible and usable rather than being restyled just to satisfy a text census.

The source-level nested-rule guard uses PostCSS and includes a failing-pattern fixture for a heading inside nested media/supports rules. The rendered reading check follows the final heading role/weight/measure contract rather than demanding the superseded 32px chapter style.

The Analysis section labels its delivery/operating narrative as curated interpretation requiring local verification. Its confidence badge is identified as coverage confidence. This retains inherited commentary without silently promoting it to field-verified operating evidence; reviewing every inherited project anecdote against primary records remains outside the completed source-meaning regressions.
