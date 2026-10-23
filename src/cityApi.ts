import { useEffect, useState } from "react";
import { getCityDetail, getCitySummaries, type CityDetailDTO, type CitySummaryDTO } from "./cityCdp";

type LoadState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

const isTestMode = import.meta.env.MODE === "test";
const LOCAL_HOSTNAMES = new Set(["localhost", "127.0.0.1", "0.0.0.0"]);

let citySummariesCache = getCitySummaries();
const cityDetailCache = new Map<string, CityDetailDTO>();
let citySummariesRequest: Promise<CitySummaryDTO[]> | null = null;
const cityDetailRequests = new Map<string, Promise<CityDetailDTO>>();

citySummariesCache.forEach(city => {
  const detail = getCityDetail(city.id);
  if (detail) {
    cityDetailCache.set(city.id, detail);
  }
});

function shouldFetchFromApi(): boolean {
  if (isTestMode || typeof window === "undefined") {
    return false;
  }

  return !LOCAL_HOSTNAMES.has(window.location.hostname);
}

class CityApiError extends Error {
  retryable: boolean;

  constructor(message: string, retryable: boolean) {
    super(message);
    this.name = "CityApiError";
    this.retryable = retryable;
  }
}

export function cityApiFailureIsRetryable(status: number | null): boolean {
  if (status === null) return true;
  return status === 429 || status >= 500;
}

// Validate at each transport boundary before a remote response can replace bundled data.
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isCitySummaryPayload(value: unknown): value is CitySummaryDTO {
  if (!isRecord(value) || typeof value.id !== "string" || !value.id.trim()) return false;
  const scores = value.scores;
  return typeof value.nameEn === "string" && typeof value.nameTh === "string"
    && typeof value.status === "string" && typeof value.tier === "string"
    && typeof value.compositeScore === "number" && Number.isFinite(value.compositeScore)
    && isRecord(scores)
    && ["livability", "economy", "safety", "wellbeing", "environment", "hospitality", "digital"]
      .every(key => typeof scores[key] === "number" && Number.isFinite(scores[key]))
    && Array.isArray(value.keyMetrics) && isRecord(value.freshness)
    && isRecord(value.financeSignal) && isRecord(value.shortTailoredNote);
}

export function isCityIndexPayload(value: unknown): value is CitySummaryDTO[] {
  return Array.isArray(value) && value.length > 0 && value.every(isCitySummaryPayload)
    && new Set(value.map(city => city.id)).size === value.length;
}

export function isCityDetailPayload(value: unknown, cityId: string): value is CityDetailDTO {
  return isCitySummaryPayload(value) && value.id === cityId
    && ["metricBlocks", "contextNotes", "financeRecommendations", "financeInstrumentCatalog", "evidenceItems", "dataRails"]
      .every(key => Array.isArray((value as unknown as Record<string, unknown>)[key]))
    && isRecord((value as CityDetailDTO).deliveryProfile)
    && isRecord((value as CityDetailDTO).financeProfile)
    && (value as CityDetailDTO).financeProfile.cityId === cityId
    && isRecord((value as CityDetailDTO).exportMetadata);
}

async function fetchJsonOnce<T>(url: string, validate: (value: unknown) => value is T): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });
  } catch (error) {
    throw new CityApiError(error instanceof Error ? error.message : "Network error", true);
  }

  if (!response.ok) {
    throw new CityApiError(`Request failed: ${response.status}`, cityApiFailureIsRetryable(response.status));
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("json")) {
    throw new CityApiError("API returned a non-JSON response", false);
  }

  let rawEnvelope: unknown;
  try {
    rawEnvelope = await response.json();
  } catch {
    throw new CityApiError("API returned malformed JSON", false);
  }

  if (typeof rawEnvelope !== "object" || rawEnvelope === null || !("success" in rawEnvelope)) {
    throw new CityApiError("API returned malformed payload", false);
  }

  const envelope = rawEnvelope as { success: boolean; data: T; error?: string };
  if (envelope.success === false) {
    throw new CityApiError(envelope.error || "API returned failure state", false);
  }

  if (envelope.success !== true || !validate(envelope.data)) {
    throw new CityApiError("API returned malformed payload", false);
  }
  return envelope.data;
}

async function fetchJson<T>(urls: string[], validate: (value: unknown) => value is T): Promise<T> {
  let lastError: Error | null = null;

  for (const url of urls) {
    let retries = 2;
    let backoff = 300;

    for (;;) {
      try {
        return await fetchJsonOnce<T>(url, validate);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error("API request failed");
        const retryable = error instanceof CityApiError && error.retryable;
        if (!retryable || retries <= 0) break;
        retries -= 1;
        await new Promise(resolve => setTimeout(resolve, backoff));
        backoff *= 2;
      }
    }
  }

  throw lastError ?? new Error("API request failed");
}

async function loadCitySummaries(): Promise<CitySummaryDTO[]> {
  if (!shouldFetchFromApi()) {
    return citySummariesCache;
  }

  if (citySummariesRequest) {
    return citySummariesRequest;
  }

  citySummariesRequest = fetchJson<CitySummaryDTO[]>(["/api/cities", "/api-static/cities.json"], isCityIndexPayload)
    .then(data => {
      citySummariesCache = data;
      return data;
    })
    .finally(() => {
      citySummariesRequest = null;
    });

  return citySummariesRequest;
}

async function loadCityDetail(cityId: string): Promise<CityDetailDTO> {
  if (!shouldFetchFromApi()) {
    const localDetail = cityDetailCache.get(cityId) ?? getCityDetail(cityId);
    if (!localDetail) {
      throw new Error(`City detail not found for ${cityId}`);
    }
    return localDetail;
  }

  const pending = cityDetailRequests.get(cityId);
  if (pending) {
    return pending;
  }

  const request = fetchJson<CityDetailDTO>([
    `/api/cities/${encodeURIComponent(cityId)}`,
    `/api-static/cities/${encodeURIComponent(cityId)}.json`,
  ], (value): value is CityDetailDTO => isCityDetailPayload(value, cityId))
    .then(data => {
      cityDetailCache.set(cityId, data);
      return data;
    })
    .finally(() => {
      cityDetailRequests.delete(cityId);
    });

  cityDetailRequests.set(cityId, request);
  return request;
}

export function getLocalCitySummaries(): CitySummaryDTO[] {
  return citySummariesCache;
}

export function getLocalCityDetail(cityId: string): CityDetailDTO | undefined {
  return cityDetailCache.get(cityId) ?? getCityDetail(cityId);
}

export function useCitySummaries(): LoadState<CitySummaryDTO[]> {
  const [state, setState] = useState<LoadState<CitySummaryDTO[]>>({
    data: citySummariesCache,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!shouldFetchFromApi()) return;

    let cancelled = false;

    loadCitySummaries()
      .then(data => {
        if (cancelled) return;
        setState({ data, loading: false, error: null });
      })
      .catch(error => {
        if (cancelled) return;
        console.warn("API failure, falling back to local data:", error.message);
        // Fallback to local data is already the initial state, so we just stop loading
        setState(current => ({
          ...current,
          loading: false,
          error: null, // We hide the error because we have a valid fallback
        }));
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

export function useCityDetail(cityId: string): LoadState<CityDetailDTO | undefined> {
  const localDetail = getLocalCityDetail(cityId);
  const [state, setState] = useState<LoadState<CityDetailDTO | undefined>>({
    data: localDetail,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!cityId || !shouldFetchFromApi()) return;

    let cancelled = false;

    loadCityDetail(cityId)
      .then(data => {
        if (cancelled) return;
        setState({ data, loading: false, error: null });
      })
      .catch(error => {
        if (cancelled) return;
        console.warn(`API failure for city ${cityId}, falling back to local data:`, error.message);
        setState(current => ({
          ...current,
          loading: false,
          error: null, // Hide error, use local detail
        }));
      });

    return () => {
      cancelled = true;
    };
  }, [cityId]);

  return state;
}
