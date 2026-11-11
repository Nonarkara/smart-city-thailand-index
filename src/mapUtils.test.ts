import { describe, expect, it } from "vitest";
import { CITY_COORDS, MAP_BOUNDS, THAILAND_BOUNDS, createEsriMap } from "./mapUtils";

describe("Esri basemap registration", () => {
  it("places the Phuket reference point on the exported national raster", () => {
    const map = createEsriMap(THAILAND_BOUNDS, 560, 740);
    // Extent independently returned by Esri Export Map for this view, in EPSG:3857.
    const esriExtent = [10639706.490423318, 602017.1618928618, 11958150.14061122, 2344246.271069734];
    for (const layer of ["light", "satellite", "topo"] as const) {
      const params = new URL(map.imageUrl(layer)).searchParams;
      expect(params.get("bboxSR")).toBe("3857");
      expect(params.get("imageSR")).toBe("3857");
      expect(params.get("size")).toBe("560,740");
      const extent = params.get("bbox")!.split(",").map(Number);
      extent.forEach((value, index) => expect(value).toBeCloseTo(esriExtent[index], 4));
    }

    const [lat, lng] = CITY_COORDS.phuket;
    const point = map.project(lat, lng);
    expect(point.x).toBeCloseTo(132.95, 2);
    expect(point.y).toBeCloseTo(621.94, 2);
  });

  it("keeps the directory map extent when requesting a double-resolution image", () => {
    const map = createEsriMap(MAP_BOUNDS, 320, 420);
    const standard = new URL(map.imageUrl("light")).searchParams;
    const retina = new URL(map.imageUrl("light", 2)).searchParams;
    expect(retina.get("bbox")).toBe(standard.get("bbox"));
    expect(retina.get("size")).toBe("640,840");
    const [west, south, east, north] = retina.get("bbox")!.split(",").map(Number);
    expect((east - west) / (north - south)).toBeCloseTo(320 / 420, 10);
  });
});
