# Livability, investability, and the infrastructure to absorb both

**SCITI research brief · 23 October 2026**
Scope: the three questions the platform has to answer for a city — can people
live here, is it worth putting money here, and can the place carry both?

Everything below was opened and read. Where a series does not exist as
machine-readable province data, it is named as a gap rather than estimated.
Absence of a record is never rendered as zero.

---

## 1. Why three axes and not two

Livability and investability are not independent, and neither is sufficient.
A province can be pleasant and profitable and still be unable to carry one
more resident, one more commuter, one more litre of water. The third axis
is not a nice-to-have; it is the one that decides whether the first two
arrive as a functioning city or as a shortfall.

The trap is that the third axis is invisible in the data everyone uses.
Thailand's household register (ทะเบียนบ้าน) is the base every province
plans its services against — schools, clinics, water, waste, power. It is
also a count of houses, not of people present.

NSO publishes the gap between the two, and it is not a rounding error.

> **ประชากรแฝง** หมายถึง ประชากรที่เข้ามาอยู่อาศัย มาเรียนหนังสือ
> มาทำงานในจังหวัดนั้นๆ โดยไม่ได้ย้ายทะเบียนบ้าน
> — *the population that comes to reside, to study or to work in a province
> without transferring their household registration there.*
>
> — NSO catalogue, package `0706_01_0049`

Two components, both machine-readable at province level:

| Series | Table | Years | What it counts |
|---|---|---|---|
| Non-registered population | `MIG_01_0049_3` | BE 2563–2568 | People who **live** in the province but are not on its register (`แฝงกลางคืน`); people who **commute in** to work (15+) or study (6+) and live elsewhere (`แฝงกลางวัน`) |
| Household register | `OS_0405_01_0005_01` | BE 2564–2568 | Registered population by province and amphoe (กรมการปกครอง) |

### What the gap looks like

Unplanned load = (unregistered residents + commuters) ÷ the register. All 77
provinces, BE 2568, from `src/absorptionData.ts`.

| Province | On the register | Live here, unregistered | Commute in | Unplanned load |
|---|---:|---:|---:|---:|
| Samut Sakhon | 587,367 | 548,488 | 25,569 | **97.7%** |
| Bangkok | 5,422,568 | 2,830,240 | 35,205 | **52.8%** |
| Nonthaburi | 1,322,280 | 538,053 | 139,050 | **51.2%** |
| Samut Prakan | 1,383,924 | 624,404 | 60,352 | **49.5%** |
| Chonburi | 1,645,985 | 761,744 | 3,514 | **46.5%** |
| Pathum Thani | 1,246,062 | 497,008 | 80,583 | **46.4%** |
| … | | | | |
| Bueng Kan | 417,907 | 1,202 | 762 | 0.5% |
| Sakon Nakhon | 1,134,091 | 2,757 | 506 | 0.3% |

**The six provinces at the top are the industrial corridor.** Samut Sakhon
carries almost a whole extra population that its register does not show;
Nonthaburi and Samut Prakan are the EEC's industrial belt; Chonburi is the
EEC's largest employment basin. The provinces at the bottom are rural and
carry essentially no unregistered load.

This is the absorption question answered with published arithmetic: the EEC
provinces must serve roughly **double** what their register says, while the
rural provinces have headroom. An investor reading "registered population"
as the market size in Samut Sakhon is reading the wrong number by a factor
of two.

### The consequence for the numbers the platform already publishes

The Ministry of Energy publishes electricity **per registered resident**
(BE 2023, PEA + MEA, all 77 provinces). That denominator is the register.
Restate the same electricity over everyone actually present on a working
day and the per-person figure changes materially — the same grid, a crowd
the plan never counted.

| Province | Published, per registered person | Per person actually present | Crowd |
|---|---:|---:|---:|
| Samut Sakhon | 7,834 kWh | 3,962 kWh | ×1.98 |
| Chonburi | 7,932 kWh | 5,415 kWh | ×1.46 |
| Pathum Thani | 4,600 kWh | 3,143 kWh | ×1.46 |
| Samut Prakan | 4,624 kWh | 3,093 kWh | ×1.49 |
| Bangkok | 4,393 kWh | 2,874 kWh | ×1.53 |
| Nonthaburi | 3,311 kWh | 2,189 kWh | ×1.51 |

The published figure is not wrong. It answers a different question — and
which question you ask decides whether a province looks like a power-
constrained place or a comfortable one. Samut Sakhon is the extreme case:
its grid serves almost twice the crowd its register admits to.

Six provinces have no share recorded (Chiang Rai, Nan, Prachinburi,
Sisaket, Ubon Ratchathani, Udon Thani) and are shown as **no record**, not
as zero.

### What this does not establish

It counts people. It says nothing about whether the pipes, the substation,
the landfill or the clinics can carry them. The evidence that would settle
capacity — service coverage, treatment capacity, measured quality, operating
records — exists for seven domains in SCITI's checklist
(`src/infrastructureEvidenceNeeds.ts`) and is **not published as a
province-complete series anywhere**. That is the honest limit of this axis,
and the platform states it on the page.

---

## 2. Livability

**What SCITI already measures.** The seven curated pillars (livability,
economy, safety, wellbeing, environment, hospitality, digital) and the depa
seven-domain baseline: 25 indicators, 14 source registry entries, all 77
provinces, every one traceable to a named publisher and a named table.

**What is measured but weak.** The depa baseline is province-level
throughout, so every livability figure for a city is a provincial
observation. This is now stated on the page rather than left for the reader
to assume.

**What is missing, and why (all probed, none fudged):**

| Missing | Reason |
|---|---|
| Province-level hospital beds, doctors, nurses per 10,000 | NSO `0503_05_0002` / `0503_05_0003` deliver **region** only, despite metadata claiming `จังหวัด`. Read the column list, not the metadata. |
| Province-level students per teacher, classrooms | The OBEC ratio series on data.go.th is **national**, disaggregated only by education level. |
| Province-level waste generated and treatment capacity | Not found on the open portals. Bangkok's khet-level series has a zero-fill artefact (`garbageperday60` = 0.00 on every row) — a missing-data artefact, not zero waste. |
| Province-level road network length and density | `doh_4` exists; the provincial harvests are 65-byte empty CSVs. The national DOH organisation's copies were not opened. |
| Province-level EDB peak load per area | **The single biggest gap for the energy pillar.** Enumerated all 228 packages on `gdcatalog.energy.go.th` and searched data.go.th; only *national* EPPO and EGAT series exist. The per-area series appears to live in PDF annual statistics. |

**The workable route.** There is no single national, province-complete,
machine-readable source for any of the seven pillars. What exists is a
handful of genuine 77-province datasets — energy and fuel only — plus a
long tail of **province-scoped harvested copies** that are properly
province-dimensioned but populated one province at a time: PWA water
(`pwa6` → Phichit), MNRE PM2.5 (→ Kanchanaburi), DOH roads (→ Trat),
Provincial Energy Offices (`dataset_61_02_<province>`).

Harvesting the same indicator id across all 77 provincial catalogues yields
consistent schemas across provinces, because each province's own office is
the publisher. That is mechanical rather than investigative, and it is the
recommended next data build.

Three ingestion rules the portals force, each learned the hard way:

1. **Absence is blank, never 0.** PWA encodes no-service amphoe as an empty
   string; the garbage series encodes missing as 0.00. Both are absence.
2. **Never trust `geo_coverage`.** `garbage` says `ประเทศ` and delivers 51
   Bangkok khets; `0503_05_0002` claims `จังหวัด` and delivers `REGION`.
3. **The BE 2561 block of `dataset_41_01` is all zeros for every province**
   and every fuel type — a data gap, not a collapse in consumption.

---

## 3. Investability

**What SCITI already measures.** The seven-pillar composite, the per-city
finance profile (readiness, risk posture, delivery risk), the tiering, and
the `/invest` thesis including the World Bank CCDR 2025 climate figures
($219B needed, 7–14% of GDP at risk by 2050).

**Land price — the roadmap item, and it is real.** The Treasury Department
publishes **per-parcel appraisal values** (`EVAPRICE`, baht/m²) for all 77
provinces, machine-readable, one CSV per province:

- Host: `catalog.treasury.go.th` (mirrored in the data.go.th catalogue as
  `f5072145-2f1a-4500-bf60-d122b866ac2f`, name `land-valuation`)
- Scale verified by reading rows: 984,881 parcels in Chonburi; 54,706 in
  Ranong
- Cadence: `update_frequency_interval` = **4 ปี**. Catalogue `last_updated`
  2025-11-07; individual province resources carry their own dates
  (2026-05-08, 2026-01-19, …) — **provinces are not guaranteed to be in the
  same appraisal round**, so the round must be recorded per province.

Two honest constraints:

- `datastore_search_sql` is **disabled** on `catalog.treasury.go.th` (as it
  is on data.go.th and catalog.nso.go.th), so no server-side aggregation is
  available. A province's statistic has to be computed from a download, and
  Chonburi alone is a million rows.
- The rows carry land-use codes (`UTMMAP2/3/4`) that are **not decoded**.
  A naive median mixes farmland with urban land. The Treasury's code table
  must be cited and applied, or the number is a category error.

Related, and also real: `building-valuation` (13,623 records),
`condominium-valuation` (9,884) and `other-land-type-valuation` (3,591) sit
on the same host with the same parcel-grid structure, and could fold into
one `landPriceBaht` computation rather than becoming separate pillars.
None of the three was opened in this round.

**BOI investment promotion by province** — verified as a table schema
(projects, capital investment, registered capital, Thai/foreign, employment)
keyed by province, but retrieval requires a **POST** to
`ipstat.boi.go.th/pubrpt/rep08qtrprovinceresult.php`; a GET returns PHP
notices and zeros. It also carries **three different denominators** —
application, approval, and promotion certificate. Pick one and label it;
mixing them silently is the easiest way to publish a wrong number.

**BOT banking depth by province** — `ds-459` (deposits and credit),
`ds-466` (credit by ISIC), `ds-879` (population, labour and wage by
province), `ds-676`/`ds-677` (tax collection). Catalogue and live
application verified; **no CSV/XLS behind the CKAN record**, so it is a
source to scrape rather than one to harvest.

**Province population projections 2024–2045 do not exist as
machine-readable province data** on the NSO catalogue. `0405_00_0004` is
national, `0405_00_0001` has no province field. This matters more than
usual here, because the absorption axis is about growth, and growth has to
come from observed series rather than from a projection.

**Provincial GRP is not published in the open catalogue.** `ns_14_20701` is
national; searches for `ผลิตภัณฑ์มวลรวมจังหวัด`, `เศรษฐกิจจังหวัด` and
`บัญชีประชาชาติ` return zero hits, and the one "GDP" hit is a national
forecast. NSO publishes provincial accounts outside the open catalogue —
do not assume they exist there.

**Industrial-estate land and rent rates are PDF-only.** The IEAT datasets
are three PDFs and a 432-byte placeholder ZIP; site-level sale and rent
rates are not downloadable per province. The Phase 13 roadmap item
"BOI industrial-estate rates for EEC/SEZ zones" therefore has **no
machine-readable source** and must be recorded as a gap.

**Tourism receipts are thin at province level.** Chachoengsao's January
BE 2569 foreign receipts are ฿6.15M against ฿807.79M domestic. A
foreign-tourism signal needs several years stacked or it is noise. The
MOTS central datasets point at HTML news listings, not files.

---

## 4. What this changes about the platform

1. **The absorption axis is real, measured, and 77 provinces wide.** It is
   wired to the city dossier, not left as an essay: registered population,
   unregistered residents, commuters, the share, and the electricity
   restatement — with the honest limit stated in the same breath.
2. **Livability is already shown**; what it needs is the *capacity* half,
   which cannot be published until the province-scoped harvest lands.
3. **Investability needs one new series to be defensible — land price** —
   and it needs the Treasury code table before the number means anything.
   Until then the Phase 13 `landPriceBaht` field should stay `null` rather
   than carry a median that mixes farmland with city.
4. **The composite score question is still open.** The derived composite
   from the baseline is not yet the site's `compositeScore`; 118 hand-
   assigned scores still drive every tier, every rank and ~30 call sites.
   The brief deliberately does not assume either answer.

---

## 5. Source register

| Series | Host | Id | Publisher | Period | Scope |
|---|---|---|---|---|---|
| Non-registered population | catalog.nso.go.th | `MIG_01_0049_3` | NSO | BE 2563–2568 | Province + amphoe |
| Household register | catalog.nso.go.th | `OS_0405_01_0005_01` | NSO / DOPA | BE 2564–2568 | Province + amphoe |
| Electricity per capita | gdcatalog.energy.go.th | `7fc9e90f-…` | MoE (PEA + MEA) | BE 2023 | 77 provinces |
| Fuel consumption by province | gdcatalog.energy.go.th | `dataset_41_02` | DAE | BE 2561–2563 | 77 provinces |
| Energy-tech promotion | gdcatalog.energy.go.th | `dataset_61_02_…` | Provincial Energy Offices | BE 2568 | 76 provinces |
| Land appraisal | catalog.treasury.go.th | `f5072145-…` | กรมธนารักษ์ | 4-yearly | 77 provinces, per parcel |
| Building / condo appraisal | catalog.treasury.go.th | `83038253…`, `74a5e3a4…` | กรมธนารักษ์ | 2024 | Province |
| Minimum wage | `<province>.gdcatalog.go.th` | per province | Labour offices | BE 2553–2569 | Province |
| Tourism counts + receipts | `<province>.gdcatalog.go.th` | per province | MOTS | BE 2562–2569 | Province, monthly |
| Provincial deposits and credit | data.go.th → app.bot.or.th | `ds-459` | BOT | Quarterly | Province |
| BOI investment by province | data.go.th → ipstat.boi.go.th | `aac82be7-…` | BOI | BE 2558–2569 | Province (POST) |
| Water supplied | data.go.th | `pwa6` et al. | RWA | BE 2559–2568 | Province + amphoe |

### Technical traps, recorded so they are not re-learned

- **Thai full-text search returns 0** on data.go.th, gdcatalog.energy.go.th
  and catalog.nso.go.th. Search English; the titles still come back in Thai.
- **`fl` (field-limiting) silently returns an empty `results` array** on
  data.go.th and gdcatalog.energy.go.th. It does not error. Easy to misread
  as "no data".
- **`datastore_search_sql` is disabled** on all three hosts.
- **`package_autocomplete` works on data.go.th only** and is the cheapest
  discovery tool there.
- **Province names collide across hosts.** The registered table prefixes
  every province with `จังหวัด`; the non-registered table does not; the
  energy CSV uses English; NSO and Treasury use Thai. One crosswalk
  (`scripts/lib/province-th.mjs`) must precede every join — a label that is
  not in the map is **dropped**, silently taking that province out of every
  indicator it appears in.
- **NSO's CSV export can truncate.** `catalogapi.nso.go.th` capped the
  province-population export at ~1,068 lines against a datastore holding
  15,090; use the datastore API for the complete set.
- **Published sources carry their own data-quality defects.** The
  minimum-wage CSV prints BE "2354" for 2554.

---

## 6. Recommended next build, in order

1. **Harvest the 77 provincial catalogues** for water, PM2.5, roads, flood
   and broadband. Mechanical, consistent schemas, and it converts the
   "one province at a time" limitation into full coverage.
2. **Decode the Treasury land-use codes and build `landPriceBaht`** —
   median of residential/urban parcels only, per province, with the
   appraisal round recorded. Then fold in building and condominium
   appraisal rather than adding new pillars.
3. **Pull the BOI provincial table by POST**, pick one denominator, label
   it, and record it as a second investability axis beside land.
4. **Leave `province-egov-index` and `renewable-share` as named gaps.**
   Thailand publishes no province-level e-government index, and DEDE
   publishes province renewable potential only as maps. Both were probed.
   A named gap is the deliverable; a fabricated one is not.

## Release audit correction — 23 October 2026

The initial interpretations above are research hypotheses, not capacity verdicts. Registered population plus unregistered residents plus inbound commuters is NOT an actual simultaneous population: outbound movements, visitors, and residence elsewhere are not reconciled. A low ratio cannot establish spare infrastructure headroom. Nonthaburi and Samut Prakan are not EEC provinces (EEC comprises Chachoengsao, Chonburi, Rayong). Do not restate a 2023 electricity rate using a 2025 population denominator as observed per-person consumption. No statement about what all local plans account for is established by these datasets. The released interface shows the original counts separately and requires local capacity evidence. Absence of a verified source in the reviewed catalogues is not proof that a source does not exist.
