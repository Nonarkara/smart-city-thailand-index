import { describe, expect, it, vi } from "vitest";
import { onRequest } from "../functions/research/[[path]]";
const path = "https://sciti.nonarkara.org/research/sciti-baseline-0123456789abcdef.json";
describe("research downloads",()=>{
  it.each(["GET", "HEAD"])("canonicalizes a shared paper directory for %s before resolving relative PDF links", async method => {
    const fetch=vi.fn();
    const response=await onRequest({request:new Request("https://sciti.nonarkara.org/research/smart-city-gaps?from=method",{method}),env:{ASSETS:{fetch}}});
    expect(response.status).toBe(308);
    const location=response.headers.get("location")!;
    expect(location).toBe("https://sciti.nonarkara.org/research/smart-city-gaps/?from=method");
    expect(new URL("SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf",location).pathname).toBe("/research/smart-city-gaps/SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf");
    expect(fetch).not.toHaveBeenCalled();
    expect(await response.text()).toBe("");
  });
  it("rejects unknown paths before fetching an asset",async()=>{
    const fetch=vi.fn();const response=await onRequest({request:new Request("https://sciti.nonarkara.org/research/missing.json"),env:{ASSETS:{fetch}}});
    expect(response.status).toBe(404);expect(response.headers.get("content-type")).toContain("application/json");expect(fetch).not.toHaveBeenCalled();
  });
  it("rejects a 200 HTML application fallback for a nonexistent hash",async()=>{
    const fetch=vi.fn(async()=>new Response("<html>application</html>",{headers:{"Content-Type":"text/html"}}));
    const response=await onRequest({request:new Request(path),env:{ASSETS:{fetch}}});expect(response.status).toBe(404);expect((await response.json()).success).toBe(false);
  });
  it("preserves snapshot bytes and serves HEAD without a body",async()=>{
    const body='{"schemaVersion":1,"cities":[]}';const fetch=vi.fn(async()=>new Response(body,{headers:{"Content-Type":"application/json"}}));
    const response=await onRequest({request:new Request(path),env:{ASSETS:{fetch}}});expect(await response.text()).toBe(body);expect(response.headers.get("cache-control")).toContain("immutable");
    const head=await onRequest({request:new Request(path,{method:"HEAD"}),env:{ASSETS:{fetch}}});expect(head.status).toBe(200);expect(await head.text()).toBe("");
  });
  it("serves the paper viewer and PDF, but never the application shell in their place",async()=>{
    const pdf="https://sciti.nonarkara.org/research/smart-city-gaps/SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf";
    const ok=vi.fn(async()=>new Response("%PDF-1.7",{headers:{"Content-Type":"application/pdf"}}));
    expect((await onRequest({request:new Request(pdf),env:{ASSETS:{fetch:ok}}})).status).toBe(200);
    const shell=vi.fn(async()=>new Response("<html>application</html>",{headers:{"Content-Type":"text/html"}}));
    expect((await onRequest({request:new Request(pdf),env:{ASSETS:{fetch:shell}}})).status).toBe(404);
    const other=await onRequest({request:new Request("https://sciti.nonarkara.org/research/smart-city-gaps/other.pdf"),env:{ASSETS:{fetch:ok}}});
    expect(other.status).toBe(404);
  });
});
