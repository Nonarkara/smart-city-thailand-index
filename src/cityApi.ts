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

async function fetchJson<T>(url: string, retries = 2, backoff = 300): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      if (retries > 0 && response.status >= 500) {
        await new Promise(resolve => setTimeout(resolve, backoff));
        return fetchJson(url, retries - 1, backoff * 2);
      }
      throw new Error(`Request failed: ${response.status}`);
    }

    const rawEnvelope = await response.json();
    if (typeof rawEnvelope !== "object" || rawEnvelope === null || !("success" in rawEnvelope)) {
      throw new Error("API returned malformed payload");
    }
    const envelope = rawEnvelope as { success: boolean; data: T; error?: string };
    if (envelope.success === false) {
      throw new Error(envelope.error || "API returned failure state");
    }

    return envelope.data;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchJson(url, retries - 1, backoff * 2);
    }
    throw error;
  }
}

async function loadCitySummaries(): Promise<CitySummaryDTO[]> {
  if (!shouldFetchFromApi()) {
    return citySummariesCache;
  }

  if (citySummariesRequest) {
    return citySummariesRequest;
  }

  citySummariesRequest = fetchJson<CitySummaryDTO[]>("/api/cities")
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

  const request = fetchJson<CityDetailDTO>(`/api/cities/${cityId}`)
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
