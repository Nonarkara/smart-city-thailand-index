# Trust-envelope correction and completion ledger

The professional-shipability goal remains active. This release corrects two
visible trust failures; it does not certify the entire system.

## Evidence corrected

The homepage previously sorted undated `city.metrics.roadFatalityRate` values,
called the result the lowest rate in Thailand, and attached a WHO target with
no matching source year. Those seed rates are not the source of this comparison
anymore. The homepage now uses the committed integrated road-traffic death
registry, with province names, registered counts, reference year, source link,
and an explicit distinction between province/city and count/personal risk.
The five largest totals are selected only from represented provinces; missing
records are not estimated. Linked city dossiers remain available.

On 25 October 2026, `scripts/audit/verify-road-death-snapshot.mjs` fetched the
official catalogue and its BE 2568/2025 CSV. Re-aggregation of the
`จ.ที่เสียชีวิต` province column reproduced **all 77 province totals, all 12
months and 16,078 registered deaths**, exactly matching the committed snapshot.
Individual records were processed in memory, not stored or printed.

Sources: [official catalogue](https://data.go.th/dataset/rtddi),
[catalogue API](https://data.go.th/api/3/action/package_show?id=rtddi),
[2025 source file](https://data.go.th/dataset/f5804870-7dc2-42df-86f3-769d6cc2ae23/resource/98c51d89-816b-4ce3-8b7f-648d5723e093/download/_2568.csv).
The catalogue page failed to open in the automated Chromium session; the API
and CSV succeeded. Browser source-link navigation is therefore not certified.

The reading list previously advertised an unmeasured search surge, a 50% room
air-quality target and a generated headline linked to an unrelated event page.
It now identifies editorial selections, says that search-volume measurements
are unavailable, links the suggested query to an actual search, and links its
primary-source item to the registry. Selection age is not data age. The
selection date changed because these items were actually edited, not to
simulate a fresh data feed.

## Verification contract

- `homeRoadEvidence.test.tsx` tests registry-count selection, independence from
  legacy seed rates and municipal population, missingness, real zero, comparison
  scope, source/year display and city navigation in all three languages.
- `homeRoadUnavailable.test.tsx` tests explicit unavailability without seed
  substitution. `weeklyDigest.test.tsx` tests editorial ages, future dates,
  visible research framing and real destination URLs.
- `scripts/audit/home-trust.mjs` measures actual rendered content at 390/1024/1440
  in EN/TH/CN, checks overflow/clipping/targets, source destinations, city
  keyboard navigation and baseline navigation. Screenshots are outside git.
- Independent reviewer `spatial_review` confirmed the province/count framing,
  readable qualifiers and 9 responsive combinations. The comment mismatch found
  by that review was corrected. Catalogue transport failure remains disclosed.
- CDPT now pushes `HEAD:main`, so an isolated validated checkout cannot silently
  publish another session's local main. `releasePush.test.ts` uses disposable Git
  repositories to prove the revision pushed and detect the old main-ref mutation.

## Full-objective completion ledger — not a pass certificate

| Requirement | Current evidence and remaining work |
|---|---|
| True, sourced decision data | This comparison reproduces the official CSV. Other city metrics and claim-registry estimates still require individual source/date/definition review. |
| Honest comparison methods | Published lens-weight tests already exist. The baseline road-rate facet divides 2025 deaths by the 2022 Q4 ICT survey population base; its denominator vintage and suitability need a separate correction, not a claim of a current mortality rate. |
| No invented freshness or outcomes | Reading-list claims corrected. Financing suggestions and legacy city narratives still need an end-to-end claim audit. |
| Zero spatial hallucination across the system | Homepage comparison and changed trust sections have rendered proof. This does not cover every route, expanded state, language, dark mode, zoom or real iOS device. |
| Shareable, usable, reliable release | City/baseline links and release API guards are tested. Full cross-route task and sharing walkthroughs remain necessary. |
| Security of evidence and credentials | Earlier hardening exists. Source files alone do not prove the Supabase RLS migration was applied to any existing installation; live policy verification remains open where applicable. |

Do not mark the goal complete from this release's green checks. They establish
only the behavior and evidence named above. Keep the wider requirements intact.
