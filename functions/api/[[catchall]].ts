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
 * `asset.ok` is NOT a sufficient existence check. The static catch-all
 * rewrite in public/_redirects (`/* /index.html 200`) also applies inside
 * ASSETS.fetch, so a request for a missing path comes back 200 with the SPA
 * shell. Treating that as a hit made /api/cities/<unknown> answer
 * 200 application/json containing index.html — the exact failure mode this
 * function exists to prevent.
 *
 * So we assert the content type too: a real JSON artifact is
 * application/json, a real CSV is text/csv. Anything else is the shell.
 */
async function fetchArtifact(
  context: PagesContext,
  path: string,
  expectedContentType: "application/json" | "text/csv",
): Promise<Response | null> {
  const assetUrl = new URL(path, context.request.url);
  const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
  if (!asset.ok) return null;
  const contentType = asset.headers.get("Content-Type") ?? "";
  if (!contentType.toLowerCase().startsWith(expectedContentType)) return null;
  return asset;
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
    const asset = await fetchArtifact(context, `/api-static/exports/cities/${cityId}.csv`, "text/csv");
    if (!asset) {
      return json({ success: false, error: "City export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : await asset.text();
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
    const asset = await fetchArtifact(context, "/api-static/exports/cities-summary.csv", "text/csv");
    if (!asset) {
      return json({ success: false, error: "Export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : await asset.text();
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
    const asset = await fetchArtifact(context, "/api-static/exports/city-facts.csv", "text/csv");
    if (!asset) {
      return json({ success: false, error: "Export not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : await asset.text();
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
    const asset = await fetchArtifact(context, `/api-static/cities/${cityId}.json`, "application/json");
    if (!asset) {
      return json({ success: false, error: "City not found", requestId, timestamp }, 404, { "Cache-Control": "no-store" });
    }
    const body = context.request.method === "HEAD" ? null : await asset.text();
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
