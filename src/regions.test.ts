import { describe, expect, it } from "vitest";
import { REGIONS_ORDERED, REGION_LABELS } from "./regions";
import type { Locale } from "./types";

describe("regions module", () => {
  const locales: Locale[] = ["en", "th", "zh"];

  it("contains all 6 canonical regions in display order", () => {
    expect(REGIONS_ORDERED).toEqual([
      "north",
      "northeast",
      "central",
      "bangkok",
      "east",
      "south",
    ]);
  });

  it("provides non-empty translations for all regions and 'all' filter across all locales", () => {
    for (const locale of locales) {
      expect(REGION_LABELS[locale]).toBeDefined();
      expect(REGION_LABELS[locale].all.length).toBeGreaterThan(0);
      for (const region of REGIONS_ORDERED) {
        expect(REGION_LABELS[locale][region]).toBeDefined();
        expect(REGION_LABELS[locale][region].length).toBeGreaterThan(0);
      }
    }
  });

  it("uses formal Thai terminology for Northeast and Bangkok", () => {
    expect(REGION_LABELS.th.northeast).toBe("ภาคตะวันออกเฉียงเหนือ");
    expect(REGION_LABELS.th.bangkok).toBe("กรุงเทพฯ");
  });
});
