import { filterCitySummaries } from "./cityListQuery";
import type { CityScores } from "./types";

const scores = (economy: number): CityScores => ({
  livability: 50,
  economy,
  safety: 50,
  wellbeing: 50,
  environment: 50,
  hospitality: 50,
  digital: 50,
});

const cities = [
  { id: "b", status: "certified", tier: "alpha", compositeScore: 80, scores: scores(40), nameEn: "Beta" },
  { id: "a", status: "certified", tier: "alpha", compositeScore: 70, scores: scores(90), nameEn: "Alpha" },
  { id: "c", status: "promotion", tier: "gamma", compositeScore: 90, scores: scores(10), nameEn: "Gamma" },
  { id: "d", status: "certified", tier: "beta", compositeScore: 70, scores: scores(90), nameEn: "Aaron" },
];

describe("city list query", () => {
  it("drops unknown filters back to the full composite ranking", () => {
    const ranked = filterCitySummaries(cities, { status: "nope", tier: "mega", sort: "not-a-pillar" });
    expect(ranked.map(city => city.id)).toEqual(["c", "b", "d", "a"]);
  });

  it("filters status and tier, then sorts by the requested pillar", () => {
    const ranked = filterCitySummaries(cities, { status: "certified", tier: "alpha", sort: "economy" });
    expect(ranked.map(city => city.id)).toEqual(["a", "b"]);
  });

  it("breaks score ties by English name", () => {
    const ranked = filterCitySummaries(cities, { status: "certified", sort: "economy" });
    expect(ranked.map(city => city.id)).toEqual(["d", "a", "b"]);
  });
});
