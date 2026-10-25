import { expect, it } from "vitest";
import { evidenceItems } from "./evidenceData";
import { cityContexts } from "./cityContext";
import { INDICATORS } from "./dimensionScores";

it("uses the annual guideline and matching ratio in every Chiang Mai air-quality translation", () => {
  const evidence = evidenceItems.find(item => item.cityId === "chiang-mai-old-town" && item.metric === "pm25")!;
  const scale = INDICATORS.find(item => item.id === "pm25")!.scale;
  expect(scale.kind).toBe("target");
  if (scale.kind !== "target") throw new Error("Annual PM2.5 needs an explicit guideline");
  expect(scale.best).toBe(5);
  expect(Number.isFinite(Number(evidence.value))).toBe(true);
  const ratio = (Number(evidence.value) / scale.best).toFixed(1);
  for (const text of [evidence.titleEn, evidence.titleTh, evidence.titleZh, ...Object.values(cityContexts["chiang-mai-old-town"].theCatch)]) {
    expect(text).toContain(ratio);
    expect(text).toContain("2021");
    expect(text).not.toMatch(/4x|4 เท่า|4倍|四倍/);
  }
});
