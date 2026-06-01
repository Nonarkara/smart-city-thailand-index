/**
 * SCITI 2026 — Visitor tracking via Google Sheets.
 *
 * Logs: timestamp, IP, country, region, city, user agent, referrer, page.
 * Reads: total count + top countries breakdown.
 *
 * Fire-and-forget — never blocks the UI. One track per session.
 * No PII stored beyond IP (which ipapi.co provides ephemerally).
 */

const TRACKING_URL = import.meta.env.VITE_SCITI_TRACKING_URL?.trim() ?? "";

// Also log to the SLIC Index shared visitor sheet for consolidated analytics
const SLIC_TRACKING_URL = "https://script.google.com/macros/s/AKfycbwzTwBNOseKkvkkjD-LH6B3GWrsFcwS6MTDbn7W5eb3zHxA-swtlHYuwJ3w5PAVXDhU7Q/exec";

interface GeoData {
  ip: string;
  country: string;
  region: string;
  city: string;
}

async function fetchGeo(): Promise<GeoData> {
  try {
    const r = await fetch("https://ipapi.co/json/");
    if (r.ok) {
      const d = await r.json();
      return {
        ip: d.ip ?? "Unknown",
        country: d.country_name ?? "Unknown",
        region: d.region ?? "Unknown",
        city: d.city ?? "Unknown",
      };
    }
  } catch {
    /* geo blocked or failed — non-critical */
  }
  return { ip: "Unknown", country: "Unknown", region: "Unknown", city: "Unknown" };
}

/** Track a page visit. Fires once per session. */
export async function trackVisitor(page = "/") {
  if (!TRACKING_URL) return;
  if (sessionStorage.getItem("sciti_tracked")) return;

  const geo = await fetchGeo();
  sessionStorage.setItem("sciti_tracked", "true");

  // Use GET with query params — more reliable than POST for Apps Script
  const params = new URLSearchParams({
    action: "track",
    ip: geo.ip,
    country: geo.country,
    region: geo.region,
    city: geo.city,
    ua: navigator.userAgent.slice(0, 150),
    ref: (document.referrer || "Direct").slice(0, 150),
    page: page,
    hostname: window.location.hostname,    // sciti.nonarkara.org now (was nonarkara.github.io)
    dashboard: "SCITI",
    v: "sciti-2026",
  });
  const sep = TRACKING_URL.includes("?") ? "&" : "?";
  fetch(`${TRACKING_URL}${sep}${params.toString()}`, { mode: "no-cors" }).catch(() => {});

  // Dual-write to SLIC shared sheet (POST, same format as SLIC index)
  const fullPageUrl = `${window.location.origin}${page.startsWith("/") ? "" : "/"}${page}`;
  fetch(SLIC_TRACKING_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      ...geo,
      userAgent: navigator.userAgent,
      referrer: document.referrer || "Direct",
      dashboard: "SCITI",
      hostname: window.location.hostname,
      page: fullPageUrl,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      version: "sciti-2026",
    }),
  }).catch(() => {});
}

/** Send textual feedback to the editorial team. */
export async function sendFeedback(text: string, page: string) {
  const FEEDBACK_URL = "https://script.google.com/macros/s/AKfycbwzTwBNOseKkvkkjD-LH6B3GWrsFcwS6MTDbn7W5eb3zHxA-swtlHYuwJ3w5PAVXDhU7Q/exec";
  
  // Use no-cors for Apps Script POSTs
  return fetch(FEEDBACK_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action: "feedback",
      message: text,
      page: page,
      target: "non.ar@depa.or.th",
      version: "sciti-2026",
      timestamp: new Date().toISOString()
    }),
  });
}

/** Visitor count + country breakdown from Google Sheets. */
export interface VisitorStats {
  count: number;
  countries: Array<{ country: string; pct: number }>;
}

export async function getVisitorStats(): Promise<VisitorStats> {
  if (!TRACKING_URL) return { count: 0, countries: [] };

  try {
    const sep = TRACKING_URL.includes("?") ? "&" : "?";
    const r = await fetch(`${TRACKING_URL}${sep}action=count`, { mode: "cors" });
    const d = await r.json();
    return { count: d.count ?? 0, countries: d.countries ?? [] };
  } catch {
    return { count: 0, countries: [] };
  }
}
