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
    const assetUrl = new URL(`/api-static/exports/cities/${cityId}.csv`, context.request.url);
    const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!asset.ok) {
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
    const assetUrl = new URL("/api-static/exports/cities-summary.csv", context.request.url);
    const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!asset.ok) {
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
    const assetUrl = new URL("/api-static/exports/city-facts.csv", context.request.url);
    const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!asset.ok) {
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
    const assetUrl = new URL(`/api-static/cities/${cityId}.json`, context.request.url);
    const asset = await context.env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    if (!asset.ok) {
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
