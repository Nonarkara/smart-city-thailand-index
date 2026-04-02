import { getCityById } from "./cityData";
import {
  CITY_PLANNING_DATASET_CSV,
  getCityDomainProxies,
  getCityPlanningProfile,
} from "./cityPlanning";

describe("city planning layer", () => {
  it("builds a planning profile for each city", () => {
    const profile = getCityPlanningProfile("phuket");

    expect(profile).toBeDefined();
    expect(profile?.primaryFinance).toBeTruthy();
    expect(profile?.toolkitIds.length).toBeGreaterThan(0);
  });

  it("derives seven smart-city domain proxies from the city record", () => {
    const city = getCityById("phuket");
    expect(city).toBeDefined();

    const proxies = getCityDomainProxies(city!);
    expect(proxies).toHaveLength(7);
    expect(proxies.some(proxy => proxy.active)).toBe(true);
  });

  it("exports a CSV-shaped dataset for the planning layer", () => {
    expect(CITY_PLANNING_DATASET_CSV).toContain("cityId");
    expect(CITY_PLANNING_DATASET_CSV).toContain("phuket");
  });
});
