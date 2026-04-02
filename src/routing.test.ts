import { getRouteKey, parseRoute } from "./routing";

describe("routing helpers", () => {
  it("parses static routes", () => {
    expect(parseRoute("/why")).toEqual({ kind: "why", path: "/why" });
    expect(parseRoute("/rankings")).toEqual({ kind: "rankings", path: "/rankings" });
  });

  it("parses city detail routes with city ids", () => {
    expect(parseRoute("/city/phuket")).toEqual({
      kind: "city",
      cityId: "phuket",
      path: "/city/phuket",
    });
  });

  it("uses the full path as the route key", () => {
    expect(getRouteKey(parseRoute("/city/phuket"))).toBe("/city/phuket");
    expect(getRouteKey(parseRoute("/city/chiang-mai-old-town"))).toBe("/city/chiang-mai-old-town");
  });
});
