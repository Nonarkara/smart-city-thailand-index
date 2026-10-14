type PagesContext = {
  request: Request;
  params: {
    catchall: string | string[];
  };
  env: {
    ASSETS: {
      fetch: (input: Request | string) => Promise<Response>;
    };
  };
};

const READ_CACHE_CONTROL = "public, max-age=0, s-maxage=900, stale-while-revalidate=86400";
const CITY_ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function json(body: Record<string, unknown>, status: number, extraHeaders?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "X-Request-Id": (body.requestId as string) || "static",
      ...Object.fromEntries(new Headers(extraHeaders)),
    },
  });
}

/**
 * Fetch a generated API artifact out of the ASSETS binding.
 *
 * Neither `asset.ok` nor the Content-Type can be trusted here.
 *
 * 1. `asset.ok` is always true for a miss. ASSETS.fetch inherits the static
 *    SPA rewrite (`/* /index.html 200`), so a path with no artifact returns
 *    200 carrying the shell.
 * 2. Content-Type cannot be trusted either. public/_headers declares
 *    `Content-Type: application/json` for /api-static/cities/* and
 *    `text/csv` for /api-static/exports/*, so the shell comes back wearing
 *    exactly the content type the caller expects. Checking the header is
 *    what made this bug invisible in the first place.
 *
 * The one signal that survives both is the body. A real artifact is JSON or
 * CSV; the shell starts with '<'. We read once, reject on that, and hand the
 * text back so callers do not fetch it twice. These artifacts are all small
 * (a dossier is ~7 KB, a CSV a few KB), so reading is cheaper than being wrong.
 */
async function fetchArtifactText(
  context: PagesContext,
  path: string,
): Promise<string | null> {
  const assetUrl = new URL(path, context.request.url);
  const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
  if (!asset.ok) return null;
  const text = await asset.text();
  if (text.trimStart().startsWith("<")) return null;
  return text;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const requestId = crypto.randomUUID();
  const timestamp = new Date().toISOString();

  if (context.request.method !== "GET" && context.request.method !== "HEAD") {
    return json(
      { success: false, error: "Method not allowed", requestId, timestamp },
      405,
      { Allow: "GET, HEAD", "Cache-Control": "no-store" },
    );
  }

  const rawSegments = context.params.catchall;
  const segments = Array.isArray(rawSegments) ? rawSegments : [rawSegments];
  const path = segments.join("/");

  // 1. /api/cities/:cityId/export.csv
  const cityCsvMatch = path.match(/^cities\/([a-z0-9-]+)\/export\.csv$/);
  if (cityCsvMatch) {
    const cityId = cityCsvMatch[1];
    if (!CITY_ID.test(cityId)) {
      return json({ success: false, error: "Not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const text = await fetchArtifactText(context, `/api-static/exports/cities/${cityId}.csv`);
    if (text === null) {
      return json({ success: false, error: "City export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : text;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${cityId}.csv"`,
        "Cache-Control": READ_CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
      },
    });
  }

  // 2. /api/exports/cities-summary.csv
  if (path === "exports/cities-summary.csv") {
    const text = await fetchArtifactText(context, "/api-static/exports/cities-summary.csv");
    if (text === null) {
      return json({ success: false, error: "Export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : text;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cities-summary.csv"',
        "Cache-Control": READ_CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
      },
    });
  }

  // 3. /api/exports/city-facts.csv
  if (path === "exports/city-facts.csv") {
    const text = await fetchArtifactText(context, "/api-static/exports/city-facts.csv");
    if (text === null) {
      return json({ success: false, error: "Export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : text;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": 'attachment; filename="city-facts.csv"',
        "Cache-Control": READ_CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
      },
    });
  }

  // 4. /api/cities/:cityId
  const cityDetailMatch = path.match(/^cities\/([a-z0-9-]+)$/);
  if (cityDetailMatch) {
    const cityId = cityDetailMatch[1];
    if (!CITY_ID.test(cityId)) {
      return json({ success: false, error: "Not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const text = await fetchArtifactText(context, `/api-static/cities/${cityId}.json`);
    if (text === null) {
      return json({ success: false, error: "City not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    // The shell is ruled out above; parse as a second guard so a truncated or
    // corrupted artifact is a clean 404 rather than a JSON parse error downstream.
    try {
      JSON.parse(text);
    } catch {
      return json({ success: false, error: "City artifact is unreadable", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : text;
    return new Response(body, {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": READ_CACHE_CONTROL,
        "X-Content-Type-Options": "nosniff",
        "X-Request-Id": requestId,
      },
    });
  }

  // 5. Default: any unmapped /api/* route returns JSON 404
  return json(
    { success: false, error: "Not found", requestId, timestamp },
    404,
    { "Cache-Control": "no-store" },
  );
}
