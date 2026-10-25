import { isEecProvince } from "./eecGeography";
import { getMoneyballProfile } from "./cityAnalytics";
import { allCities } from "./cityData";

describe("EEC geography", () => {
  it("uses EECO's three provinces, including spelling whitespace, not the eastern region", () => {
    for (const province of ["Chachoengsao", "Chonburi", "Chon Buri", "Rayong"]) expect(isEecProvince(province)).toBe(true);
    for (const province of ["Trat", "Chanthaburi", "Prachin Buri", "Sa Kaeo", "Bangkok"]) expect(isEecProvince(province)).toBe(false);
  });
  it("does not give eastern provinces outside EEC an EEC advantage", () => {
    const city = allCities[0];
    const outside = getMoneyballProfile({ ...city, region: "east", province: "Trat" });
    const inside = getMoneyballProfile({ ...city, region: "east", province: "Rayong" });
    expect(JSON.stringify(outside.edges)).not.toContain('EEC');
    expect(JSON.stringify(inside.edges)).toContain('EEC');
  });
});

it("missing seed metrics produce no invented air, crime, green or hospital advantages", () => {
  const profile = getMoneyballProfile({ ...allCities[0], metrics: {}, province: "Trat", region: "east" });
  expect(profile.edges.map(edge => edge.label)).not.toEqual(expect.arrayContaining(["Cleaner air"]));
  expect(profile.edges.some(edge => ["Cleaner air", "Lower crime", "More green space", "Hospital bed capacity", "BOI eligibility check"].includes(edge.label))).toBe(false);
});

it("treats EEC location and low GPP as questions, not tax entitlement or cheap rent", () => {
  const profile = getMoneyballProfile({ ...allCities[0], province: "Rayong", region: "east", metrics: { ...allCities[0].metrics, gppPerCapita: 90000 } });
  const tax = profile.edges.find(edge => edge.label === "BOI eligibility check")!;
  expect(tax.advantage).toBe(false);
  expect(tax.value).toContain("verify project activity");
  const output = profile.edges.find(edge => edge.label === "Production context")!;
  expect(output.advantage).toBe(false);
  expect(output.value).not.toMatch(/cheaper|2-4/);
});
