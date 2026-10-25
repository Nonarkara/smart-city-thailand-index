import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { PROVINCE_BASELINE_BY_ID } from "./provinceBaselineData";
import { buildProvinceSentenceSets, buildProvinceVoice } from "./provinceNarrative";
import { bandIn } from "./provinceVoice";

const city = allCities.find(c => c.id === "reg-samut-sakhon")!;
const voice = buildProvinceVoice(city);
const sets = buildProvinceSentenceSets(city);

describe("generated narrative source meanings", () => {
  it("describes motorcycle deaths with their recorded-vehicle denominator and missingness", () => {
    expect(voice.theCatch.en).toContain("97.6% of provincial road deaths with a recorded vehicle type");
    expect(voice.theCatch.en).toContain("nationwide, vehicle type was missing for 44.2%");
    expect(voice.theCatch.th).toContain("ที่มีการบันทึกประเภทยานพาหนะ");
    expect(voice.theCatch.zh).toContain("有车辆类型记录");
    for (const text of Object.values(voice.theCatch)) expect(text).toContain("44.2%");
    expect(voice.theCatch.en).not.toContain("registered vehicles");
  });

  it("does not turn a top-quartile housing value into the maximum", () => {
    const housing = PROVINCE_BASELINE_BY_ID["nso-non-durable-housing"];
    expect(housing["Samut Sakhon"]).toBe(1.2);
    expect(Math.max(...Object.values(housing))).toBeGreaterThan(1.2);
    const band = bandIn("nso-non-durable-housing", city.province)!;
    expect(band.band).toBe(0);
    expect(band.rank).toBeGreaterThan(1);
    const sentence = sets.opportunity.en.find(s => s.includes("non-durable housing"))!;
    expect(sentence).toContain(`first quarter by rank (${band.rank} of ${band.of}, highest first)`);
    expect(sentence).not.toContain("the highest share");
  });

  it("states the 2010 five-year within-province migration measure in every language", () => {
    expect(voice.livelihood.en).toContain("2010 NSO survey");
    expect(voice.livelihood.en).toContain("within the province in the preceding five years");
    expect(voice.livelihood.en).not.toMatch(/moved in or out|migration runs/);
    expect(voice.livelihood.th).toContain("ห้าปีก่อนการสำรวจ");
    expect(voice.livelihood.zh).toContain("调查前五年内曾在府内迁居");
  });

  it("counts mobile-phone users rather than subscription holders", () => {
    expect(voice.opportunity.en).toContain("In Q4 2022");
    expect(voice.opportunity.en).toContain("used mobile phones");
    expect(voice.opportunity.th).toContain("ใช้โทรศัพท์มือถือ");
    expect(voice.opportunity.zh).toContain("使用手机");
    for (const text of Object.values(voice.opportunity)) expect(text).not.toMatch(/subscription|สมัคร|订阅/);
  });

  it("keeps household water coverage historical and identifies mixed-period ratios", () => {
    expect(voice.famousFor.en).toContain("2010 NSO survey");
    expect(voice.famousFor.en).toContain("provincial households had access to clean drinking water");
    expect(voice.opportunity.en).toContain("the survey periods differ");
    expect(voice.livelihood.en).toContain("these are different survey periods");
  });

  it("reports real quartile ranks and direction for forest and air across cities", () => {
    const names = ["first", "second", "third", "fourth"];
    for (const c of allCities) {
      const v = buildProvinceVoice(c);
      const forest = bandIn("rfd-forest-coverage", c.province)!;
      if (forest.value > 0) expect(v.famousFor.en).toContain(`${names[forest.band]} quarter by rank (${forest.rank} of ${forest.of}, highest first)`);
      const air = bandIn("pcd-pm25-annual", c.province, "low");
      if (air) expect(v.theCatch.en).toContain(`${names[air.band]} quarter by rank (${air.rank} of ${air.of}, lowest first)`);
      const text = [v.livelihood.en, v.famousFor.en, v.opportunity.en, v.theCatch.en].join(" ");
      expect(text).not.toMatch(/above-average|below-average|widest reach|the highest share|the lowest share|health penalty|hard ceiling/);
    }
  });
});
