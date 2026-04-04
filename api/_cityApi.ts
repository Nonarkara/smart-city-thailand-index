import { getCitiesApiPayload, getCityDetail, getCityFactsCsv, getCityFactsRows, getCitySummariesCsv } from "../src/cityCdp";
import type { CityStatus, CityTier, ScoringPillar } from "../src/types";

export type ApiRequest = {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
};

export type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: ApiEnvelope<unknown> | Record<string, unknown> | string) => void;
    send?: (body: string) => void;
  };
};

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  requestId: string;
  timestamp: string;
};

const READ_CACHE_CONTROL = "public, max-age=0, s-maxage=900, stale-while-revalidate=86400";

export function createRequestId(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `city-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getQueryParam(
  query: ApiRequest["query"],
  key: string,
): string | undefined {
  const value = query?.[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parseStatus(value?: string): "all" | CityStatus {
  return value === "certified" || value === "promotion" || value === "registered"
    ? value
    : "all";
}

export function parseTier(value?: string): "all" | CityTier {
  return value === "alpha" || value === "beta" || value === "gamma"
    ? value
    : "all";
}

export function parseSort(value?: string): "composite" | ScoringPillar {
  return value === "livability" ||
    value === "economy" ||
    value === "safety" ||
    value === "wellbeing" ||
    value === "environment" ||
    value === "hospitality" ||
    value === "digital"
    ? value
    : "composite";
}

export function setJsonHeaders(response: ApiResponse, requestId: string) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("Cache-Control", READ_CACHE_CONTROL);
  response.setHeader("X-Request-Id", requestId);
}

export function setCsvHeaders(response: ApiResponse, filename: string, requestId: string) {
  response.setHeader("Content-Type", "text/csv; charset=utf-8");
  response.setHeader("Cache-Control", READ_CACHE_CONTROL);
  response.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  response.setHeader("X-Request-Id", requestId);
}

export function sendCsv(response: ApiResponse, statusCode: number, csv: string) {
  const target = response.status(statusCode);
  if (typeof target.send === "function") {
    target.send(csv);
    return;
  }
  target.json(csv);
}

export function listCities(request: ApiRequest, requestId: string): ApiEnvelope {
  const data = getCitiesApiPayload({
    status: parseStatus(getQueryParam(request.query, "status")),
    tier: parseTier(getQueryParam(request.query, "tier")),
    sort: parseSort(getQueryParam(request.query, "sort")),
  });

  return {
    success: true,
    data,
    requestId,
    timestamp: new Date().toISOString(),
  };
}

export function getCityOrNull(cityId: string | undefined) {
  if (!cityId) return undefined;
  return getCityDetail(cityId);
}

export function getSummaryCsv() {
  return getCitySummariesCsv();
}

export function getFactsCsv(cityId?: string) {
  return getCityFactsCsv(cityId);
}

export function getFactsRowCount(cityId?: string) {
  return getCityFactsRows(cityId).length;
}
