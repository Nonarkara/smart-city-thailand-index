# Needs Ladder — 8-rung hierarchy per user brief (2026-07-20, Fable 5)

User's priority ladder (apex→base): hygiene(air/water) → safety/healthcare/nature →
community/hospitality → jobs/land/BOI → distance-to-hubs → quality-of-life/convenience →
cost-of-living/schooling → mental-health/traffic.

## Framework — DONE, shipped
- [x] `src/regionalDistance.ts` — haversine distance to Bangkok/Chiang Mai/Phuket from
      real coordinates (all 118 cities already have coords). Pure geometry, zero research risk.
- [x] `src/needsLadderEngine.ts` — computes all 8 rungs from EXISTING real CityMetrics
      fields (pm25, water quality, crime, hospital beds, flood safety, green coverage, GPP,
      GPP growth, FDI, land price, income, hospitality/wellbeing/digital pillars, smart
      dimensions) + hub distance. Fully trilingual signal labels (LocalizedText).
      Verified sane on 5 real cities — Chiang Mai's real PM2.5 burn-season problem and
      Bangkok's real high cost-of-living both surface correctly; missing data renders "—"
      not a guess.
- [x] `src/NeedsLadder.tsx` + CSS — literal ladder visual (ordered, not radar — radar
      implies peer dimensions, this hierarchy is ordered by priority so position does the
      work). Mono/hairline house style; single amber accent reserved for the one honest
      "weakest rung" callout. Complements (does not replace) CityFingerprint's 7-pillar radar.
- [x] Wired into CityDetailPage Overview tab, right after the tagline.
- [x] tsc/vitest(77)/eslint all clean. Verified live in EN/TH/CN via accessibility tree
      (screenshot tool had transient compositing glitches this session — confirmed via
      DOM/AOM inspection instead, which is authoritative).

## Data — 4 provincial stub files, honest-empty until research lands
- [x] `src/provincialBoiZones.ts` — BOI Zone 1/2/3 + EEC/SEZ-border, per province
- [x] `src/provincialLaborEconomics.ts` — minimum wage + cost-of-living index, per province
- [x] `src/provincialTrafficIndex.ts` — congestion index or vehicle-density proxy, per province
- [x] `src/provincialAccessData.ts` — hospital count + university/int'l-school count, per province
- [x] Workflow wf_f1fe66e9-bbf returned (research + adversarial verify, 6 parallel
      researchers across BOI/wage/CPI/traffic/healthcare/education, all 77 provinces).
      All 4 files populated with ONLY verified entries (real source/sourceUrl/asOf each).
      Provinces with no real source stayed absent (traffic: only 5/77 — TomTom's only
      Thai coverage; DLT vehicle-registration fallback was attempted and rejected as
      unparseable rather than risk a misread column).
  - BOI: redesigned schema entirely — the old Zone 1/2/3 classification was superseded
    ~2015 and doesn't exist in BOI's current guide; replaced with the real current
    area-based-overlay tag system (EEC, southern-border, 4 economic corridors,
    decentralization, border-SEZ-subdistrict, model-city). 46/77 provinces tagged.
    Tag labels are now full LocalizedText (was English-only — fixed to meet the
    trilingual-completeness bar).
  - Labor economics: minimum wage 77/77 (Ministry of Labour Notification No.14).
    Cost-of-living kept to ONLY the 2 Numbeo-scale entries (Bangkok, Chon Buri) —
    the 7 TPSO CPIP entries measure year-over-year inflation from a different base
    and would misrepresent relative cost if mixed with Numbeo's absolute index.
  - Traffic: 5 TomTom entries (Bangkok, Songkhla, Chiang Mai, Khon Kaen, Nakhon
    Ratchasima), each with both congestionLevelPct and hoursLostPerYear.
  - Access: healthcare 77/77 (MOPH hospital-tier breakdown + population-per-doctor),
    education 77/77 (MHESI higher-ed institution count). No separate international-
    schools figure exists in any source found — field dropped rather than guessed.
- [x] `needsLadderEngine.ts` rung builders updated to consume the real (not originally
      guessed) shapes: protection reads `access.publicHospitals.total`, livelihood reads
      trilingual `boi.label`, convenience reads `access.higherEdInstitutions`,
      affordability transforms `costOfLivingIndexRaw` (Numbeo, NYC=100) into a 0-100
      score via `scoreLowerIsBetter(value, 25, 60)`, calm consumes the real two-field
      TomTom shape. `LadderSignal.value` widened to `string | LocalizedText` to carry
      the BOI trilingual value; `NeedsLadder.tsx` picks the right variant per locale.
- [x] tsc/vitest(77)/eslint all clean after the schema changes.
- [x] Re-ran the sanity check across 8 cities (Phuket, Samyan, Chiang Mai Old Town, Yala,
      Hat Yai, Khon Kaen, Rayong, Chiang Rai — 2 of the original 10 ids were typos and
      skipped). Scores stayed realistic: Samyan/Bangkok affordability=44 lowest (matches
      real high cost of living, Numbeo 43.7), Chiang Mai apex=44 weakest (matches real
      burn-season PM2.5), Yala apex=78 strongest (matches its clean-air reputation) with
      reach=20 weakest (correctly remote), Rayong livelihood=77 strongest with the
      correct EEC tag applied, Khon Kaen reach=17 weakest (correctly distant from all
      3 hubs). No score outside [0,100], no silent NaN.
- [x] `.research/` scratch directory (research JSON + generator scripts) deleted —
      never committed, per the standing rule against scratch files in the repo.

## Deferred, not auto-fixed (needs Dr Non's steer)
- [ ] Consider surfacing "strongest/weakest rung" as a one-line callout elsewhere (rankings
      card? homepage spotlight?) — flagged, not yet decided, would need Dr Non's steer
      since it touches page composition again

## 2026-07-20 · System audit + natural upgrade (Grok 4.5)
- [x] Wire Needs Ladder coverage into `/audit` jury Limits (OVERLAY card + live stats)
- [x] `needsLadderIntegrity.test.ts` + audit integrity coverage assertions
- [x] Phone collapse for audit KPI / sentiment / source grids; route-button hover contrast
- [x] CDPT ship — 8b61ae5 live on sciti.nonarkara.org (`/static/index-BkkKN_oS.js`)
