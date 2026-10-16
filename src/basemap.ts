// Free basemap that needs no API key or card. CARTO's basemaps.cartocdn.com now
// stamps "API KEY REQUIRED" on tiles served to unregistered sites.
// OpenFreeMap is vector-only (needs MapLibre), so Leaflet uses OSM standard raster
// tiles under the OSMF tile usage policy: visible attribution, modest traffic.
export const BASEMAP_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
export const BASEMAP_OPTIONS = {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  maxZoom: 19,
};
