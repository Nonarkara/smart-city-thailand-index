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
