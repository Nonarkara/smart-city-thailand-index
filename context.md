# SCITI — Smart City Thailand Index
## Project Context

**Live URL:** https://sciti.nonarkara.org  
**Repo:** github.com/Nonarkara/smart-city-thailand-index  
**Deploy:** Cloudflare Pages (wrangler CLI — GitHub Actions token expired, deploy manually)  
**Stack:** React 19 + Vite 6 + TypeScript 5.8 SPA. No React Router. Custom routing in `src/routing.ts`.  
**Dev server:** port 5188 (`npx vite --port 5188`)

---

## API Keys (see `shared/.secrets-backup/indices_smart-city-thailand-index_.env`)

| Key | Service | Use |
|-----|---------|-----|
| `VITE_GISTDA_SPHERE_KEY` | GISTDA Sphere API | Thai map tiles (JS SDK), geocoding, POI, routing |

---

## GISTDA Data Catalog
*Researched 2026-05-20. All ArcGIS portal endpoints are open (no auth). Sphere API is JS-SDK only.*

### Portal Base URL
`https://gistdaportal.gistda.or.th/data/rest/services/`

---

### 🔴 HIGH PRIORITY — Ready to integrate into SCITI scoring

#### 1. Air Quality — Daily PM2.5 + PM10 by Station
```
Endpoint: FR_Fire/AirQuality_daily/MapServer/0
Hourly:   FR_Fire/AirQuality_hourly/MapServer/0
Fields:   datetime, st_id, st_name, pm25, pm10, pv_tn (province), ap_tn (district), latitude, longitude
Geometry: Point
Auth:     None
```
**SCITI use:** Replace manually-entered `pm25Annual` in CityMetrics with queried provincial average.  
**Query pattern:** `?where=pv_tn='Chiang Mai'&outFields=pm25,datetime&orderByFields=datetime DESC&resultRecordCount=365&f=json`

#### 2. Fire Hotspots — Daily MODIS Satellite
```
Endpoint: FR_Fire/hotspot_daily/MapServer/0
Fields:   longitude, latitude, confident (0-100), satellite (Terra/Aqua), datetime,
          region, lu_name (land use), tb_tb (tambon), ap_tn (district), pv_tn (province)
Geometry: Point (esriGeometryMultipoint)
Auth:     None
Count:    532 hotspots in current dataset
```
**SCITI use:** Annual hotspot count per province → new `fireHotspotIndex` metric → Environment pillar  
**Query pattern:** `?where=pv_tn='Chiang Mai'&returnCountOnly=true&f=json`

#### 3. Flood Extent — Daily Satellite-Derived Polygons
```
Endpoint: FL_Flood/flood_daily/MapServer/0           (national)
          FL_Flood/flood_daily_c/MapServer/0          (central)
          FL_Flood/flood_daily_ne/MapServer/0         (northeast)
Fields:   TB_IDN, TB_TN (tambon), AP_IDN, AP_TN (district), PV_IDN, PV_TN (province),
          RE_NESDB (region), F_AREA (flood area sqm), flood_area, house (houses affected)
Geometry: Polygon
Auth:     None
```
**SCITI use:** Flood risk score per province — feeds Safety pillar (disaster resilience 30%)  
**Query pattern:** `?where=PV_TN='Khon Kaen'&outFields=F_AREA,flood_area,house&f=json`

#### 4. Repeated Flooding — Historical Analysis 2005–2016
```
Endpoint: FL_Flood/FL_RepeatedFlooding_GISTDA_50k_Y2005_Y2016/FeatureServer/0
Type:     FeatureServer (queryable)
Auth:     None
```
**SCITI use:** Chronic flood risk baseline per province. Cities in repeat-flood zones get lower safety scores.

---

### 🟡 MEDIUM PRIORITY — Map overlays and metric automation

#### 5. GFlood Live Tiles — MapLibre/Leaflet Compatible
```
WMS:  GFlood/GFlood_Inno_WMS/MapServer
WMTS: GFlood/GFlood_Inno_WMTS3857/MapServer   ← EPSG:3857, Leaflet/MapLibre ready
WFS:  GFlood/GFlood_Inno_WFS/MapServer
Auth: None
```
**SCITI use:** Real-time flood overlay on Phuket/Geopolitics/SCITI maps  
**Add as Leaflet layer:** `L.tileLayer.wms('https://gistdaportal.gistda.or.th/data/rest/services/GFlood/GFlood_Inno_WMS/MapServer/WMSServer', { layers: '0', format: 'image/png', transparent: true })`

#### 6. Forest Coverage — National + Regional
```
Endpoint: L10_Forest/L10_Forest_GISTDA_50k/MapServer
Layers:   Forest cover (50k), Mangrove (MNRE), National Parks, Protected Areas,
          Wildlife Areas, Permanent Forest (LDD+MNRE)
Special:  L10_ForestNan_GISTDA_4k — 4k resolution for Nan province
Auth:     None
```
**SCITI use:** Compute `forestCoverage` (% of province) from polygon area — replace manual entries

#### 7. Land Use — All 6 Regions
```
Endpoint: L09_Landuse/L09_Landuse_GISTDA_50k/MapServer
Layers:   0=North, 1=Central, 2=NE, 3=East, 4=West, 5=South
Fields:   lul1_code, lul1_t (TH), lul1_e (EN), area_rai, tambon_t, tambon_e, amphoe_t, mod_date
Auth:     None
```
**SCITI use:** Derive `greenCoverage` from agricultural + forest land use codes per province

#### 8. Admin Boundaries
```
Endpoint: L05_AdminBoundary/L05_Province_GISTDA_50k/MapServer  (province polygons)
          L05_AdminBoundary/L05_Amphoe_GISTDA_50k/MapServer    (district polygons)
Auth:     None
```
**SCITI use:** City boundary overlays on the SCITI map (replace approximate point markers with actual polygons)

---

### 🟢 LOW PRIORITY — Supplementary

#### 9. Water Resources
```
Endpoint: WR_WaterResource/Waterresource2rai_thailand_wfs/MapServer (FeatureServer + MapServer)
          WR_WaterResource/L07_Hydrology_Mainriver_RID_50k/MapServer
Fields:   cap (capacity), volume, wb_tydest (water body type), province, district
Auth:     None
```
**SCITI use:** Water management score — reservoir capacity per province → environment/wellbeing

#### 10. Urban Landmarks
```
Endpoint: L08_UrbanZone/L08_Landmark_GISTDA_25k/MapServer
Scale:    25k resolution
Auth:     None
```

---

### Sphere API — JS SDK (Browser Only)
*Key: stored in `VITE_GISTDA_SPHERE_KEY`*  
*Load via: `<script src="https://api.sphere.gistda.or.th/map/?key={KEY}"></script>`*  
*Tile auth is managed internally by SDK — direct REST calls to `basemap.sphere.gistda.or.th` return 401*

| Service | Internal URL | Use |
|---------|-------------|-----|
| Thai vector tiles | `basemap.sphere.gistda.or.th` | Replace Mapbox base with GISTDA Thai tiles |
| Search | `api.sphere.gistda.or.th/services/search` | Thai-language POI search |
| Reverse geocode | `api.sphere.gistda.or.th/services/geo/address` | Lat/lon → Thai address |
| POI | `api.sphere.gistda.or.th/services/poi` | Nearby points of interest |
| Route | `api.sphere.gistda.or.th/services/route` | Distance/routing |

**Implementation pattern (React):**
```tsx
// Load SDK once
const script = document.createElement('script');
script.src = `https://api.sphere.gistda.or.th/map/?key=${import.meta.env.VITE_GISTDA_SPHERE_KEY}`;
document.body.appendChild(script);

// Then use window.sphere.Map, window.sphere.Marker, etc.
```

---

## Integration Roadmap

### Phase 1 — Live PM2.5 (replaces manual data)
- Query `FR_Fire/AirQuality_daily` by province
- Average last 365 days of `pm25` per province
- Write result to `CityMetrics.pm25Annual` via a build-time data refresh script
- File: `scripts/refresh-gistda-pm25.ts`

### Phase 2 — Fire Hotspot Index
- Query `FR_Fire/hotspot_daily` count by province per year
- Normalize: 0 hotspots = 100, 500+ hotspots = 0
- New field: `CityMetrics.fireHotspotIndex` (0–100)
- Feeds Environment pillar (replaces one of the manual environment score inputs)

### Phase 3 — Flood Risk Score
- Query `FL_Flood/FL_RepeatedFlooding` polygon area per province
- Normalize against national range
- New field: `CityMetrics.floodRiskScore` (0–100, lower = more flooded)
- Feeds Safety pillar (disaster resilience 30%)

### Phase 4 — Sphere Base Map
- Load GISTDA SDK in map components
- Replace Mapbox tile layer with `sphere_streets` / `sphere_hybrid`
- Benefits: Thai script rendering, local data freshness, no Mapbox billing

---

## Deploy Notes
GitHub Actions CI (`Deploy to Cloudflare Pages`) uses `CLOUDFLARE_API_TOKEN` stored in GitHub Secrets — **this token is expired** (code 9109, invalid). Deploy manually:
```bash
cd /Users/nonarkara/Projects/thailand-smart-city/index
npx vite build
npx wrangler pages deploy dist --project-name=smart-city-thailand-index --branch=main --commit-dirty=true
```

## Known exposures (resolved)
- 2026-07-04: A Gemini API key was committed to this public repo's history (commits `c84a517`..`105159f`). Confirmed dead on testing (backing GCP project was deleted). Chat widget now uses BYO-key model (localStorage), no bundled key needed. `.webui_secret_key` (unused, unrelated tool artifact) also removed from tracking.

## Visual heritage · 23 October 2026
Design Read: a city dossier pairs one uncropped cultural image with its catalogue record, so readers can see a place and check what the image actually proves. Reference: The Metropolitan Museum of Art collection object pages. The image dominates a 60/40 composition; a 3px section rule separates this evidence from ordinary 1px controls. Provincial association is not a municipal findspot. Heritage does not contribute to SCITI scores.

## Reading hierarchy · 23 October 2026
Design Read: section titles mark changes of subject, while facts, interpretation and source details form distinct reading groups. Reference: Vignelli's Unigrid national park brochures, with a strong title and grouped practical information. Existing 32/14/11.5px tokens and typefaces remain; display size now belongs to chapter headings as well as page titles. A 3px chapter rule, a 1px internal separator, and tight paragraph spacing distinguish sections from their contents. In the certification panel the recorded project count leads the summary; the selected project list is visibly a subset, and intent remains distinct from operating evidence. This owner-requested hierarchy repair supersedes the old body-sized-section-heading decision; all source content and interactive surfaces remain.

## Compact field guide · 23 October 2026
Design Read: the reader gets a short finding and a local detail before choosing how far to investigate. Reference: Vignelli's Unigrid field guides, with running labels and compact indexes rather than stacked dashboard cards. The invariant is readable 14px prose with source qualifications intact. Badges share a row, project titles run into their descriptions, simple facts use label/value rows, and analysis loses its nested card insets. No score, source, artifact or interaction is removed. Human character comes from specific evidence and editorial selection; no invented residents, quotations, field visits, bylines or review dates.

## Combined audit · 25 October 2026
The later typography pass keeps the display token for the page title and numeric facts; chapter headings use body size with stronger weight and grouping. This supersedes the 23 October display-sized-chapter experiment. Reference remains Vignelli's Unigrid reading hierarchy: a clear title, short chapter labels and compact facts. The desktop city photo is capped at 280px so it identifies the place without consuming half the first screen. A generated sentence must preserve the source denominator, geography, period and comparison method; frame variety never licenses a causal or maximum claim that its data does not establish. See docs/audits/2026-10-25-release-audit.md for dispositions and limits.

### Homepage spatial repair — 25 October
Design Read: readers should understand the city index, its limits, and the route into the rankings in one compact opening, with real place photography beside the explanation. Reference: the information hierarchy of a museum collection catalogue (MoMA collection index), rather than a cinema poster. The title leads; the rankings action follows; provenance supports it. Photo and text have unequal roles. The existing project type families remain in place under CLAUDE.md's explicit font rule. Preserve all earned sections and reveal hooks; remove viewport height inflation and oversized internal spacing.

### Homepage comparison indexes — 25 October
Design Read: a reader scans the dimension, city and value as one record, then opens the city dossier. Reference: Vignelli's Unigrid indexes, using aligned records rather than independent pale tiles. The invariant is that every existing city, value, source qualification and click target survives. The title leads; names carry the records; source notes support them. Only the record boundary uses a 1px separator; there is no enclosing decorative card. One section owns each gap, and longer names wrap instead of disappearing. Existing typefaces remain under the project's explicit font rule; this focused geometry repair does not claim a full typography audit.

### Dated road evidence and editorial selections — 25 October
Design Read: show the province and recorded count together, with its reference year, source and limits immediately beside the comparison. Reference: Vignelli's Unigrid factual indexes; the province is the subject, the count is the fact, and the linked city dossier is secondary context. The homepage no longer compares undated seed fatality rates or calls a city the safest nationally. It uses the committed 2025 integrated road-death registry snapshot, reproduced against all 77 official province totals on 25 October 2026. Counts are neither municipal observations nor population-adjusted risk rates. The reading list is an editorial selection, not a measured trends feed, news report or data-refresh date. No score changes, new estimates or operating-service claims are introduced.

### Container alignment and decision-data correction — 25 October, second pass
The previous homepage fix passed1440px but failed the owner's1979px screenshot: a1440px page-shell used100vw for its internal inset. Insets now use the containing block, including city photo and fingerprint alignment. The geometry guard tests390/1024/1440/1980/2560 and deliberately restores100vw to prove the wide-alignment check fails. One content column is the invariant; no second inset may depend on external screen width.

Design Read: choose a city for a concrete purpose, see which evidence informs that choice and what remains unknown, then compare. Reference: MoMA collection index's object/context relationship. The page title leads; the decision controls follow; source limits support them. Record counts are supporting inline data, not competing display statements. Route photos on the five decision tools are compact contextual images with preserved expandable captions. Existing visualizations remain available, including the ranking weight diagram in its explanation disclosure and print.

Legacy city-summary negative margins were still overlapping the tab bar; reset the actual in-tab summary margin. Rankings search now precedes lens explanations and editorial picks. Five homepage purposes link to explicit ranking weights. No new rawdata values or claims of live validation were introduced. The independent data sweep fixes hiddenbonus ranking, saturatedmatching, obsoletecounts, fabricated editorialchips, unknown-metric defaults, GPP-to-rent inference, east-region-to-EEC inference and automatictaxentitlement. See docs/audits/2026-10-25-decision-data-sweep.md for remaining source-validation limits.

### SH: short-record release gate — 25 October
SH is the first frontend defect to investigate, as reaffirmed by the owner. The investor shortlist exposed a blind spot: six107.78px four-field cards passed earlier visual/token checks. Name+composite now share one line; province+strongestpillar share a second. Full information and fourteen-pixel primary text remain. ENphone section1117→602px; eachrecord108→52px. The canonical investor rules were edited in place, including the invalid negative padding inset. Design Read: compare six candidates as an index, then open a dossier. Reference: Vignelli Unigrid record alignment; one name/value association leads, metadata follows, a row separator marks only the record boundary.

The shared workspace AGENTS and both installed anti-slop skill copies now explicitly require trying short comparison rows before cards and measuring reading cost before surface styling. Project CDPT and GitHub CI run `scripts/audit/record-density.mjs --serve` on the compiled build, checking field preservation, row/section budgets, visible type, gutters and keyboard navigation. A browser mutation restores the original stacking and must fail the budget. This gate covers that pattern, not every conceivable SH defect; photos, charts and other information-bearing areas retain their task-specific space.


## Laem Chabang municipal context candidate · 28 October 2026

`/city/laem-chabang/` is an unranked municipal data profile, separate from the 118 existing assessment/registry records. `src/laemChabangData.ts` is the canonical translated record; postbuild generates `/data/cities/laem-chabang.json` and static share metadata. Assessment is null and certification unverified; do not substitute the registry default 39.5 score. Figures retain municipal/whole-port/terminal scopes and actual source periods. TDV owns mapped building counts/height/use coverage; no building census is duplicated. The city-map page links to this profile, and its 3D action opens TDV with `?city=laem-chabang`. Evidence/source limits and integration notes are in `research/laem-chabang`. Candidate publication is still parent-owned.

## Nong Plub crayon replacement · 28 October 2026
Design read: a small illustrated companion points readers toward the real provincial visual record, without pretending to document a visit. Reference: the owner's supplied wax-crayon desk illustration and Nong Plub photographs. The source photograph remains the dominant place evidence; the companion is a compact portrait beside its note. Uneven crayon edges belong inside the artwork, not as dashed UI badges. Replace all five wardrobe illustrations and avatar with generated raster art; keep originals as source history. No invented quotations, insider visits or operational claims may be presented as testimony.

## Nong Plub city introductions · 28 October 2026
Design read: read a city's seven research signals beside Nong Plub in one compact infographic, then open its sources. Reference: ISOTYPE's pictorial statistics, with the owner's approved crayon portraits as the guide. This replaces the separate highest/lowest quick-read and the lower companion panel; documentary images, maps and full analysis remain. All bars share a0–100scale, complete text labels and explicit research-estimate/source-period limits. No infrastructure coverage or personal visit is inferred. The new task contains seven score rows rather than the previous portrait-only note; measure its own whole-infographic budget, source control and printable output.

## Platform mascot and one-minute briefs · 28 October 2026
Owner directive: SCITI is a Thailand smart-city data platform, no longer an award submission. Remove award-only navigation/routes with useful legacy redirects and retain source archives. Nong Plub is the mascot; the owner explicitly confirmed her consent on28October2026 for public likeness use promoting Thailand Smart City. Credit that consent in About. Design reference: the approved wax-crayon character and a handwritten field-note introduction. Named exception: Sriracha (Thai/Latin, loopless handwriting) and a renamed subset of LXGW WenKai Lite (Chinese) are used only for the mascot’s short briefing, never numeric evidence or controls. The illustration must occupy a meaningful share of the actual reading column rather than a144px thumbnail stranded in a780px block inside a much wider parent. Measure the complete region and its surrounding container at390/1024/1440 and wide1980, preserve all facts, source/print disclosures and tools, and independently review.

Verification: independent rendered review at390/1024/1440/1980 closed the old narrow-parent failure; portrait occupies~300×340px alongside chart and notes on wide screens. Phone art uses116×200px beside the seven rows; full intro budget500px phone/440px wide, with readable14px evidence. Regression guard also requires full parent-content width and at least20% portrait width on wide screens; old780px/144px composition must fail. Tool pages use a44px native guide disclosure: rankings search moved568→424px and map start689→545px at390×844. Both improvements independently reviewed; real charts/maps/print sources retained. Two additional transparent crayon poses installed with source/consent register, and self-hosted licensed handwriting subsets apply only to companion prose. Shared-host full-suite timing failed; exact-commit CI remains mandatory before Cloudflare deployment.

## Integrated home city guide · 30 October 2026
Design read: Nong Plub welcomes the reader into the city records; her inward-facing gesture, short introduction and action share one composition. Reference: the illustrated guide-and-caption relationship in Dorling Kindersley Eyewitness guides, adapted to the owner-approved crayon drawing. The dominant element is the task heading “Find your city” / “เลือกเมืองที่ใช่” / “寻找适合你的城市”; the product name already appears in the header. Use a light Civic page ground, existing fonts/palette and naturally wrapping type. Preserve protected SCITI wordplay, photography/credits, research counts and qualifications, and the city/evidence/map destinations.

MoMA owner directive: action containers fit their labels; short actions share one compact row with usable targets. The homepage uses one primary city link and plain Evidence/Map links, all44px high. Never restore the full-width stacked boxes or authored title breaks. Keep the note and byline in one reading group. A reserved illustration cell uses size containment; its image fits that cell, so the cutout cannot impose an intrinsic minimum height on the reading rows.

Responsive roles: below400px the heading spans the opening and the drawing shares the note row. At400–479 and720–959, a130px illustration sits beside the complete heading/note/byline group with actions spanning below. At480–719 the portrait spans the message and action rows; at960+ the same composition uses160px. These are task-fit thresholds: the complete action row must fit its actual column. Do not shift an empty reading band to a neighboring breakpoint.

Verification: production-built local48 language/viewport states cover320/390/399/400/479/480/559/560/719/720/768/959/960/1024/1440/1980 across EN/TH/CN. The existing plub gate also retains48 city states. Home budgets require title≤two lines, a single44px action row, reading-to-action distance≤32px at every tested width, city action before600px, and no overflow. Local fixtures restore the forced3-line title, stacked padded buttons and intrinsic-image row stretch; each must fail its corresponding budget. Failed geometry/screenshots are captured before assertions and retained in CI artifacts. Independent actual-browser review closed all reported gaps, thumbnails and contrast defects; WebKit phone checks supplement Chromium. Exact-commit CI and CDPT/live verification remain mandatory.
