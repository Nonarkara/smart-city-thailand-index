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
- [ ] **AWAITING**: workflow wf_f1fe66e9-bbf (research + adversarial verify, 6 parallel
      researchers across BOI/wage/CPI/traffic/healthcare/education, all 77 provinces).
      When it returns: populate the 4 files above with ONLY verified entries (each carrying
      real source/sourceUrl/asOf). Provinces with no real source stay absent — never fill a gap.

## Next after data lands
- [ ] Re-run the 5-city sanity check + full test suite after populating provincial data
- [ ] Spot-check 8-10 cities across tiers (not just Alpha) for score sanity
- [ ] Consider surfacing "strongest/weakest rung" as a one-line callout elsewhere (rankings
      card? homepage spotlight?) — flagged, not yet decided, would need Dr Non's steer
      since it touches page composition again
- [ ] CDPT ship after data integration
