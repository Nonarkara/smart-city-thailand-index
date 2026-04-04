import { describe, it, expect } from "vitest";
import citiesHandler from "../api/cities";
import cityDetailHandler from "../api/cities/[cityId]";
import cityExportHandler from "../api/cities/[cityId]/export.csv";
import factsExportHandler from "../api/exports/city-facts.csv";
import summaryExportHandler from "../api/exports/cities-summary.csv";

type MockResponse = {
  headers: Record<string, string>;
  statusCode: number;
  body: unknown;
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: unknown) => void;
    send: (body: string) => void;
  };
};

function createMockResponse(): MockResponse {
  return {
    headers: {},
    statusCode: 0,
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value;
    },
    status(code) {
      this.statusCode = code;

      return {
        json: (body: unknown) => {
          this.body = body;
        },
        send: (body: string) => {
          this.body = body;
        },
      };
    },
  };
}

describe("city CDP APIs", () => {
  const expectedReadCache = "public, max-age=0, s-maxage=900, stale-while-revalidate=86400";

  it("lists city summaries with filtering and sorting", async () => {
    const response = createMockResponse();

    await citiesHandler(
      {
        method: "GET",
        query: {
          status: "certified",
          tier: "alpha",
          sort: "economy",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    expect(response.headers["Cache-Control"]).toBe(expectedReadCache);
    expect(response.headers["X-Request-Id"]).toBeTruthy();

    const body = response.body as { success: boolean; data: Array<{ status: string; tier: string; scores: { economy: number } }> };
    expect(body.success).toBe(true);
    const cities = body.data;
    expect(cities.length).toBeGreaterThan(0);
    expect(cities.every(city => city.status === "certified" && city.tier === "alpha")).toBe(true);
    expect(cities[0].scores.economy).toBeGreaterThanOrEqual(cities[cities.length - 1].scores.economy);
  });

  it("returns a full city dossier with provenance", async () => {
    const response = createMockResponse();

    await cityDetailHandler(
      {
        method: "GET",
        query: {
          cityId: "phuket",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(200);
    const body = response.body as { success: boolean; data: { id: string; financeRecommendations: unknown[]; provenanceCount: number } };
    expect(body.success).toBe(true);
    const city = body.data;
    expect(city).toMatchObject({
      id: "phuket",
      financeProfile: {
        cityId: "phuket",
      },
      exportMetadata: {
        cityCsvUrl: "/api/cities/phuket/export.csv",
      },
    });
    expect(city.financeRecommendations.length).toBeGreaterThan(0);
    expect(city.provenanceCount).toBeGreaterThan(0);
  });

  it("returns 404 for an unknown city detail route", async () => {
    const response = createMockResponse();

    await cityDetailHandler(
      {
        method: "GET",
        query: {
          cityId: "not-a-city",
        },
      },
      response,
    );

    expect(response.statusCode).toBe(404);
    expect(response.body).toMatchObject({
      error: "City not found",
    });
  });

  it("exports wide and long CSV files with provenance headers", async () => {
    const summaryResponse = createMockResponse();
    const factsResponse = createMockResponse();
    const cityResponse = createMockResponse();

    await summaryExportHandler({ method: "GET" }, summaryResponse);
    await factsExportHandler({ method: "GET" }, factsResponse);
    await cityExportHandler(
      {
        method: "GET",
        query: {
          cityId: "phuket",
        },
      },
      cityResponse,
    );

    expect(summaryResponse.statusCode).toBe(200);
    expect(summaryResponse.headers["Cache-Control"]).toBe(expectedReadCache);
    expect(String(summaryResponse.body)).toContain("latest_observed_at");
    expect(String(summaryResponse.body)).toContain("provenance_count");

    expect(factsResponse.statusCode).toBe(200);
    expect(factsResponse.headers["Cache-Control"]).toBe(expectedReadCache);
    expect(String(factsResponse.body)).toContain("fact_type");
    expect(String(factsResponse.body)).toContain("source_url");

    expect(cityResponse.statusCode).toBe(200);
    expect(cityResponse.headers["Cache-Control"]).toBe(expectedReadCache);
    expect(String(cityResponse.body)).toContain("phuket");
    expect(String(cityResponse.body)).toContain("recommendation");
  });
});
