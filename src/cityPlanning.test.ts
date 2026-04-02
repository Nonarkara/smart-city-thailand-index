import { getCityById } from "./cityData";
import {
  CITY_PLANNING_DATASET_CSV,
  getCityActionRecommendations,
  getCityDomainProxies,
  getCityFinanceBlueprint,
  getCityPlanningDatasetRow,
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

  it("derives concrete next-step recommendations for a city", () => {
    const actions = getCityActionRecommendations("phuket");

    expect(actions).toHaveLength(3);
    expect(actions[0].title.en.length).toBeGreaterThan(0);
  });

  it("builds a machine-readable row and finance blueprint for a city", () => {
    const row = getCityPlanningDatasetRow("phuket");
    const blueprint = getCityFinanceBlueprint("phuket");

    expect(row?.primaryFinance).toBeTruthy();
    expect(row?.leadRevenueModel).toContain(" ");
    expect(blueprint?.revenueLogic.en.length).toBeGreaterThan(0);
  });
});
