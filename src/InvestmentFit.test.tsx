import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import InvestmentFit from "./InvestmentFit";
import { allCities } from "./cityData";
import { isEecProvince } from "./eecGeography";
import type { Locale } from "./types";

afterEach(cleanup);
const locales: Locale[] = ["en", "th", "zh"];
const eec = allCities.filter(c => isEecProvince(c.province));
const other = allCities.filter(c => !isEecProvince(c.province));
const text = (c: typeof allCities[number], l: Locale) => { const { container } = render(<InvestmentFit city={c} locale={l} />); const t = container.textContent ?? ""; cleanup(); return t; };

describe("Investment incentives block", () => {
  it("shows the EEC Act rows only inside Chachoengsao, Chon Buri and Rayong, and says it does not apply elsewhere", () => {
    expect(eec.length).toBeGreaterThan(5);
    for (const c of eec) expect(text(c, "en"), c.id).toContain("EEC Negotiation Committee");
    for (const c of other) { const t = text(c, "en"); expect(t, c.id).not.toContain("EEC Negotiation Committee"); expect(t, c.id).toContain("Does not apply here"); }
  });
  it("makes no recommendation or ranking claim in any language and always carries its caveat and sources", () => {
    for (const c of [eec[0], other[0]]) for (const l of locales) {
      const t = text(c, l);
      expect(t).not.toMatch(/should be looking|ควรพิจารณา|值得你关注|best|ที่สุด|最佳/i);
      const { container } = render(<InvestmentFit city={c} locale={l} />);
      expect(container.querySelectorAll(".investment-fit-caveat a")).toHaveLength(3);
      expect(container.querySelectorAll(".investment-fit-rows > div")).toHaveLength(3);
      cleanup();
    }
  });
});
