import { describe, expect, it, vi } from "vitest";
import { formatNumber, formatNumberTh } from "./provinceVoice";

describe("province number formatting", () => {
  it("preserves native locale output including rounding, signs and special values", () => {
    for (const [locale, format] of [["en-US", formatNumber], ["th-TH", formatNumberTh]] as const) {
      for (const digits of [0, 1, 2, 3, 20]) {
        for (const value of [-Infinity, -1234567.891, -0, 0, 0.00001, 1.005, 15.85, 1234567.891, Infinity, NaN]) {
          expect(format(value, digits)).toBe(value.toLocaleString(locale, { maximumFractionDigits: digits, minimumFractionDigits: digits }));
        }
      }
      expect(() => format(1, -1)).toThrow(RangeError);
    }
  });

  it("constructs once per locale and precision across repeated province readings", async () => {
    vi.resetModules();
    const native = Intl.NumberFormat;
    const constructions: string[] = [];
    const spy = vi.spyOn(Intl, "NumberFormat").mockImplementation(function (locale, options) {
      constructions.push(`${locale}:${options?.maximumFractionDigits}`);
      return new native(locale, options);
    } as typeof Intl.NumberFormat);
    try {
      const fresh = await import("./provinceVoice");
      for (let i = 0; i < 100; i++) {
        fresh.formatNumber(i, 0);
        fresh.formatNumber(i, 1);
        fresh.formatNumberTh(i, 0);
        fresh.formatNumberTh(i, 1);
      }
      expect(constructions).toEqual(["en-US:0", "en-US:1", "th-TH:0", "th-TH:1"]);
    } finally {
      spy.mockRestore();
    }
  });
});
