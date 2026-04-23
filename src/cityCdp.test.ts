import { getCityDetail, getCitySummaries } from "./cityCdp";

describe("cityCdp derivation", () => {
  it("builds a profile, finance profile, and recommendations for every city", () => {
    const cities = getCitySummaries();

    expect(cities.length).toBeGreaterThan(40);

    cities.forEach(city => {
      const detail = getCityDetail(city.id);

      expect(detail).toBeDefined();
      expect(detail?.financeProfile.cityId).toBe(city.id);
      expect(detail?.financeRecommendations.length).toBeGreaterThan(0);
      expect(detail?.provenanceCount).toBeGreaterThan(0);
      expect(detail?.exportMetadata.provenanceCount).toBe(detail?.provenanceCount);
      detail?.financeRecommendations.forEach(recommendation => {
        expect(recommendation.supports.length).toBeGreaterThan(0);
      });
    });
  });

  it("produces differentiated finance logic for same-tier cities with different contexts", () => {
    const phuket = getCityDetail("phuket");
    const samyan = getCityDetail("samyan");

    expect(phuket?.tier).toBe(samyan?.tier);
    expect(phuket?.financeRecommendations[0].instrumentId).not.toBe(samyan?.financeRecommendations[0].instrumentId);
    expect(phuket?.financeRecommendations[0].reasonSummary.en).not.toBe(samyan?.financeRecommendations[0].reasonSummary.en);
  });

  it("separates alpha, beta, and gamma cities into different lead mechanisms or delivery notes", () => {
    const alpha = getCitySummaries().find(city => city.tier === "alpha");
    const beta = getCitySummaries().find(city => city.tier === "beta");
    const gamma = getCitySummaries().find(city => city.tier === "gamma");

    expect(alpha).toBeDefined();
    expect(beta).toBeDefined();
    expect(gamma).toBeDefined();

    const alphaDetail = getCityDetail(alpha!.id)!;
    const betaDetail = getCityDetail(beta!.id)!;
    const gammaDetail = getCityDetail(gamma!.id)!;

    expect(alphaDetail.financeRecommendations[0].segment).toBe("alpha");
    expect(betaDetail.financeRecommendations[0].segment).toBe("beta");
    expect(gammaDetail.financeRecommendations[0].segment).toBe("gamma");

    expect(new Set([
      alphaDetail.financeRecommendations[0].instrumentId,
      betaDetail.financeRecommendations[0].instrumentId,
      gammaDetail.financeRecommendations[0].instrumentId,
    ]).size).toBeGreaterThan(1);

    expect(alphaDetail.deliveryProfile.deliveryNote.en).not.toBe(betaDetail.deliveryProfile.deliveryNote.en);
    expect(betaDetail.deliveryProfile.deliveryNote.en).not.toBe(gammaDetail.deliveryProfile.deliveryNote.en);
  });
});
