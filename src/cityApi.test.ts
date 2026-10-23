import { cityApiFailureIsRetryable } from "./cityApi";

describe("city API retry policy", () => {
  it("retries only network failures, 429s, and 5xx responses", () => {
    expect(cityApiFailureIsRetryable(null)).toBe(true);
    expect(cityApiFailureIsRetryable(429)).toBe(true);
    expect(cityApiFailureIsRetryable(503)).toBe(true);
    expect(cityApiFailureIsRetryable(404)).toBe(false);
    expect(cityApiFailureIsRetryable(400)).toBe(false);
    expect(cityApiFailureIsRetryable(200)).toBe(false);
  });
});
import { isCityIndexPayload, isCityDetailPayload } from "./cityApi";
import { getCitySummaries, getCityDetail } from "./cityCdp";
import { onRequest } from "../functions/api/cities";

describe("city transport data boundaries", () => {
  it("accepts bundled contracts and rejects malformed indexes", () => {
    const cities = getCitySummaries();
    expect(isCityIndexPayload(cities)).toBe(true);
    for (const malformed of [undefined, {}, [], [null], [{ id: "phuket" }], [...cities, cities[0]]]) {
      expect(isCityIndexPayload(malformed)).toBe(false);
    }
    expect(isCityIndexPayload([{ ...cities[0], scores: { ...cities[0].scores, economy: "90" } }])).toBe(false);
  });

  it("rejects a valid dossier for the wrong city and incomplete dossiers", () => {
    const city = getCityDetail("phuket")!;
    expect(isCityDetailPayload(city, "phuket")).toBe(true);
    expect(isCityDetailPayload(city, "bangkok")).toBe(false);
    expect(isCityDetailPayload({ ...city, metricBlocks: null }, "phuket")).toBe(false);
    expect(isCityDetailPayload({ ...city, financeProfile: { ...city.financeProfile, cityId: "bangkok" } }, "phuket")).toBe(false);
  });

  it("returns uncached 502 for malformed asset envelopes instead of an empty successful list", async () => {
    for (const payload of [{ success: true }, { success: false, data: [] }, { success: true, data: [null] }, { success: true, data: [] }]) {
      const response = await onRequest({ request: new Request("https://example.org/api/cities"), env: { ASSETS: { fetch: async () => Response.json(payload) } } });
      expect(response.status).toBe(502);
      expect(response.headers.get("cache-control")).toBe("no-store");
      expect(await response.json()).toMatchObject({ success: false });
    }
  });

  it("preserves legitimate empty filtered results", async () => {
    const response = await onRequest({ request: new Request("https://example.org/api/cities?status=registered"), env: { ASSETS: { fetch: async () => Response.json({ success: true, data: getCitySummaries().filter(city => city.status === "certified") }) } } });
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ success: true, data: [] });
  });
});
