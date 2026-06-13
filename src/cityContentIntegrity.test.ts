import { describe, expect, it } from "vitest";
import { getResolvedPopulationThousand } from "./adminBaselines";
import { getCityDetail, getCitySummaries } from "./cityCdp";
import { getCityContext } from "./cityContext";
import { getCityFacts } from "./cityFacts";
import { getCityResearchSources, resolveCityResearch } from "./cityResearch";
import { polishThaiText } from "./thaiText";

const bannedThaiFallback = /\b(livability|digital|advanced|building|foundational|bankable|readiness|procurement|capex|Opex|pipeline|policy floor|first-loss|uptake|demand|Technical Assistance Grant|Government Budget|Pooled Procurement|risk profile)\b/i;
const bannedThaiResearchTokens = /\b(Kanop|Ketchart|tech|talent|testbed|gentrification|pipeline|backend|foot traffic)\b/i;
const bannedThaiCompactNumbers = /\b(?:B\d+(?:\.\d+)?[KM]|\d+(?:\.\d+)?[KM]\+?)\b/;

describe("city dossier content integrity", () => {
  it("provides context, research copy, and a population baseline for every city", () => {
    const cities = getCitySummaries();

    expect(cities).toHaveLength(118);

    cities.forEach(city => {
      expect(getCityContext(city.id)).toBeDefined();

      const research = resolveCityResearch(city);
      expect(research.dailyLife.en.trim()).not.toBe("");
      expect(research.dailyLife.th.trim()).not.toBe("");
      expect(research.signatureStory.en.trim()).not.toBe("");
      expect(research.signatureStory.th.trim()).not.toBe("");
      expect(research.funFact.en.trim()).not.toBe("");
      expect(research.funFact.th.trim()).not.toBe("");
      expect(research.compareNote.en.trim()).not.toBe("");
      expect(research.compareNote.th.trim()).not.toBe("");

      const resolvedPopulation = getResolvedPopulationThousand(city);
      expect(resolvedPopulation.value, `${city.id} should have a resolved population baseline or an explicit pending state`).not.toBe(0);
    });
  });

  it("gives every full dossier a bibliography backbone with at least one non-official source", () => {
    const fullCities = getCitySummaries().filter(city => city.status !== "registered");

    expect(fullCities).toHaveLength(49);

    fullCities.forEach(city => {
      const sources = getCityResearchSources(city);
      expect(sources.length).toBeGreaterThanOrEqual(3);
      expect(
        sources.some(source => ["project", "local-news", "academic", "sentiment"].includes(source.category ?? "")),
      ).toBe(true);
    });
  });

  it("keeps fact cards source-backed whenever facts are displayed", () => {
    getCitySummaries().forEach(city => {
      const facts = getCityFacts(city.id);
      if (!facts) return;

      expect((facts.sources ?? []).length).toBeGreaterThan(0);
    });
  });

  it("keeps registered dossiers honest and avoids fake zero population placeholders", () => {
    const registeredCities = getCitySummaries().filter(city => city.status === "registered");

    registeredCities.forEach(city => {
      const detail = getCityDetail(city.id);
      expect(detail).toBeDefined();

      const observations = detail?.metricBlocks.flatMap(block => block.observations) ?? [];
      expect(city.metrics.population, `${city.id} should omit unknown population instead of encoding it as 0`).toBeUndefined();
      expect(observations.some(item => item.metricKey === "population" && item.metricValueText === "0K")).toBe(false);

      if ((detail?.evidenceItems.length ?? 0) === 0) {
        const constraint = detail?.contextNotes.find(note => note.kind === "constraint");
        expect(constraint?.body.en).toMatch(/registry status/i);
        expect(constraint?.body.en).toMatch(/not the same thing as live deployment/i);
      }
    });
  });

  it("keeps generated Thai dossier copy free of obvious English scaffolding", () => {
    getCitySummaries().forEach(city => {
      const detail = getCityDetail(city.id);
      expect(detail).toBeDefined();

      const thaiSegments = [
        detail?.shortTailoredNote.th ?? "",
        detail?.financeSignal.line.th ?? "",
        ...(detail?.contextNotes.map(note => note.body.th) ?? []),
        ...(detail?.financeRecommendations.flatMap(recommendation => [
          recommendation.reasonSummary.th,
          recommendation.whyNow.th,
          recommendation.nextStep.th,
          recommendation.publicFundingRole.th,
          recommendation.privateCapitalRole.th,
        ]) ?? []),
      ];

      thaiSegments.forEach(segment => {
        expect(segment).not.toMatch(bannedThaiFallback);
      });
    });
  });

  it("renders Thai research copy without broken transliterations or compact English number shorthand", () => {
    getCitySummaries().forEach(city => {
      const research = resolveCityResearch(city);
      const thaiSegments = [
        research.dailyLife.th,
        research.signatureStory.th,
        research.funFact.th,
        research.compareNote.th,
      ];

      thaiSegments.forEach(segment => {
        expect(segment).not.toMatch(bannedThaiResearchTokens);
        expect(segment).not.toMatch(bannedThaiCompactNumbers);
      });
    });
  });

  it("normalizes high-risk Thai copy glitches consistently", () => {
    expect(polishThaiText("นายกคานป เกชาติ")).toBe("นายกกณพ เกตุชาติ");
    expect(polishThaiText("กลุ่ม tech และ digital nomad")).toBe("กลุ่มเทคโนโลยีและกลุ่มคนทำงานทางไกล");
    expect(polishThaiText("5G testbed ใช้งานจริง")).toBe("สนามทดสอบ 5G ใช้งานจริง");
    expect(polishThaiText("ประชากร 25K และนักท่องเที่ยว 30M+")).toBe("ประชากร 25,000 และนักท่องเที่ยว กว่า 30 ล้าน");
    expect(polishThaiText("มีระบบกล้อง 100+ จุด")).toBe("มีระบบกล้อง กว่า 100 จุด");
  });
});
