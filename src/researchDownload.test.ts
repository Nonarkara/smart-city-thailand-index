import { describe, expect, it, vi } from "vitest";
import { onRequest } from "../functions/research/[[path]]";
const path = "https://sciti.nonarkara.org/research/sciti-baseline-0123456789abcdef.json";
describe("research downloads",()=>{
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
});
