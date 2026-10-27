import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { getCityName, getDistinctProvinceName, getProvinceName } from "./cityPresentation";
import type { Locale } from "./types";

const city = (id: string) => {
  const result = allCities.find(item => item.id === id);
  if (!result) throw new Error(`Missing test city: ${id}`);
  return result;
};

describe("compact city identity metadata", () => {
  it.each<Locale>(["en", "th", "zh"])("omits a repeated Phuket province label in %s", locale => {
    expect(getDistinctProvinceName(city("phuket"), locale)).toBeNull();
    expect(getProvinceName(city("phuket"), locale)).toBeTruthy();
    expect(getCityName(city("phuket"), locale)).toBeTruthy();
  });

  it.each<Locale>(["en", "th", "zh"])("keeps a district's distinct Bangkok context in %s", locale => {
    for (const id of ["samyan", "rattanakosin"]) {
      expect(getDistinctProvinceName(city(id), locale)).toBe(getProvinceName(city(id), locale));
    }
  });

  it("keeps the province when a city uses a different place name", () => {
    expect(getDistinctProvinceName(city("korat"), "en")).toBe("Nakhon Ratchasima");
    expect(getDistinctProvinceName(city("samui"), "en")).toBe("Surat Thani");
  });

  it("matches whole English words, not a place name hidden inside another word", () => {
    const base = city("yala");
    expect(getDistinctProvinceName({ ...base, nameEn: "Yalaha Smart City" }, "en")).toBe("Yala");
    expect(getDistinctProvinceName({ ...base, nameEn: "YALA—Smart City" }, "en")).toBeNull();
    expect(getDistinctProvinceName({ ...base, nameEn: "New Yala District" }, "en")).toBeNull();
    expect(getDistinctProvinceName({ ...base, id: "untranslated-fixture", province: "Zala", nameEn: "Zalaha Smart City" }, "zh")).toBe("Zala");
  });

  it("normalizes typography without erasing a different administrative geography", () => {
    const base = city("phuket");
    expect(getDistinctProvinceName({ ...base, nameEn: "Ｐｈｕｋｅｔ Smart City" }, "en")).toBeNull();
    expect(getDistinctProvinceName({ ...base, province: "Phuket East" }, "en")).toBe("Phuket East");
    expect(getDistinctProvinceName({ ...base, nameTh: "เมืองอัจฉริยะภูเก็ต", provinceTh: "จังหวัดภูเก็ต" }, "th")).toBeNull();
  });
});
