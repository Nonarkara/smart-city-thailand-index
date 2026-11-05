/** Research downloads must never fall through to the application shell. */
type Context = { request: Request; env: { ASSETS: { fetch: (request: Request) => Promise<Response> } } };

const PAPER_FILES: Record<string, string> = {
  "/research/smart-city-gaps": "text/html",
  "/research/smart-city-gaps/": "text/html",
  "/research/smart-city-gaps/index.html": "text/html",
  "/research/smart-city-gaps/SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf": "application/pdf",
};

function error(message: string, status: number, extra: HeadersInit = {}) {
  return new Response(JSON.stringify({ success: false, error: message }), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...Object.fromEntries(new Headers(extra)) },
  });
}

export async function onRequest({ request, env }: Context): Promise<Response> {
  if (request.method !== "GET" && request.method !== "HEAD") return error("Method not allowed", 405, { Allow: "GET, HEAD" });
  const url = new URL(request.url);
  // The paper viewer and its PDF are static files; exact paths only, each checked for its real type.
  const paper = PAPER_FILES[url.pathname];
  if (paper) {
    try {
      const asset = await env.ASSETS.fetch(new Request(new URL(url.pathname, url.origin), { method: request.method }));
      if (asset.status >= 300 && asset.status < 400) return asset;
      if (!asset.ok || !asset.headers.get("Content-Type")?.includes(paper)) return error("Research file not found", 404);
      return asset;
    } catch {
      return error("Research file unavailable", 502);
    }
  }
  if (!/^\/research\/sciti-baseline-[a-f0-9]{16}\.json$/.test(url.pathname)) return error("Research snapshot not found", 404);
  try {
    const assetUrl = new URL(url.pathname, url.origin);
    const asset = await env.ASSETS.fetch(new Request(assetUrl, { method: "GET" }));
    // ASSETS can return the SPA fallback with 200, so status alone is insufficient.
    if (!asset.ok || !asset.headers.get("Content-Type")?.includes("application/json")) return error("Research snapshot not found", 404);
    return new Response(request.method === "HEAD" ? null : asset.body, {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" },
    });
  } catch {
    return error("Research snapshot unavailable", 502);
  }
}
