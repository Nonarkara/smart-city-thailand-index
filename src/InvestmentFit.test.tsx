import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import InvestmentFit from "./InvestmentFit";
import { boiFacts, topSector } from "./boiGuide";
import { allCities } from "./cityData";
import { isEecProvince } from "./eecGeography";
import type { Locale } from "./types";

afterEach(cleanup);
const locales: Locale[] = ["en", "th", "zh"];
const text = (c: typeof allCities[number], l: Locale) => { const { container } = render(<InvestmentFit city={c} locale={l} />); const t = container.textContent ?? ""; cleanup(); return t; };
const rowsOf = (c: typeof allCities[number]) => boiFacts(c.province, c.metrics.industryComposition).rows.map(r => r.key);
const byProvince = (names: string[]) => allCities.filter(c => names.includes(c.province));

describe("Investment incentives block", () => {
  it("shows the EEC Act row only inside Chachoengsao, Chon Buri and Rayong", () => {
    const eec = allCities.filter(c => isEecProvince(c.province));
    expect(eec.length).toBeGreaterThan(5);
    for (const c of allCities) expect(text(c, "en").includes("EEC Negotiation Committee"), c.id).toBe(isEecProvince(c.province));
  });

  it("states the whole group ladder and its page on every city", () => {
    for (const c of allCities) for (const l of locales) expect(text(c, l), `${c.id} ${l}`).toMatch(/A1\+.*10–13.*A4.*3/s);
  });

  it("gives the low-income provinces their extra years and nobody else", () => {
    const low = ["Kalasin", "Nan", "Buriram", "Sisaket", "Nong Bua Lamphu", "Ubon Ratchathani"];
    const hit = allCities.filter(c => text(c, "en").includes("20 lowest-income provinces"));
    expect(hit.length).toBeGreaterThan(5);
    for (const c of hit) expect(["Kalasin", "Chaiyaphum", "Nakhon Phanom", "Nan", "Bueng Kan", "Buriram", "Phatthalung", "Phrae", "Maha Sarakham", "Mukdahan", "Mae Hong Son", "Yasothon", "Roi Et", "Sisaket", "Sakon Nakhon", "Sa Kaeo", "Surin", "Nong Bua Lamphu", "Ubon Ratchathani", "Amnat Charoen"], c.id).toContain(c.province);
    for (const c of byProvince(low)) expect(text(c, "en"), c.id).toContain("3 more years");
  });

  it("names the corridor and its targeted industries only for the 16 corridor provinces", () => {
    const corridors = allCities.filter(c => /corridor, targeted activities only: /.test(text(c, "en")));
    expect(corridors.length).toBeGreaterThan(5);
    for (const c of corridors) expect(["Chiang Mai", "Chiang Rai", "Lamphun", "Lampang", "Nakhon Ratchasima", "Khon Kaen", "Udon Thani", "Nong Khai", "Ayutthaya", "Nakhon Pathom", "Suphan Buri", "Kanchanaburi", "Chumphon", "Ranong", "Surat Thani", "Nakhon Si Thammarat"], c.id).toContain(c.province);
    for (const c of byProvince(["Chiang Mai"])) expect(text(c, "en")).toContain("Northern (NEC)");
  });

  it("warns that border zones and the southern measure cover only part of some provinces", () => {
    for (const c of byProvince(["Songkhla"])) expect(text(c, "en")).toContain("only Chana, Na Thawi, Saba Yoi and Thepha");
    for (const c of byProvince(["Tak", "Mukdahan", "Trat"])) expect(text(c, "en")).toContain("not the whole province");
  });

  it("adds an industry row only when the city records a sector BOI lists, never inventing one", () => {
    let withRow = 0;
    for (const c of allCities) {
      const known = /agri|manufactur|petrochem|tourism|services/i.test(topSector(c.metrics.industryComposition) ?? "");
      expect(rowsOf(c).includes("industry"), c.id).toBe(known);
      withRow += known ? 1 : 0;
    }
    expect(withRow).toBeGreaterThan(20);
    const field = (re: RegExp, f: string) => { const cs = allCities.filter(c => re.test(topSector(c.metrics.industryComposition) ?? "")); expect(cs.length, f).toBeGreaterThan(0); for (const c of cs) expect(text(c, "en"), c.id).toContain(f); };
    field(/petrochem/i, "Chemicals and petrochemicals"); field(/agri/i, "Agriculture, food, biotechnology"); field(/tourism/i, "Tourism services");
    expect(topSector("services 52%, agriculture 18%, manufacturing 30%")).toBe("services");
    expect(topSector(undefined)).toBeNull();
  });

  it("makes no recommendation or ranking claim in any language and always carries its caveat and sources", () => {
    for (const c of allCities.slice(0, 40)) for (const l of locales) {
      expect(text(c, l)).not.toMatch(/should be looking|ควรพิจารณา|值得你关注|best|ที่สุด(?!ในบันทึก)|最佳/i);
      const { container } = render(<InvestmentFit city={c} locale={l} />);
      expect(container.querySelectorAll(".investment-fit-caveat a")).toHaveLength(3);
      expect(container.querySelectorAll(".investment-fit-rows > div").length).toBeGreaterThanOrEqual(2);
      cleanup();
    }
  });
});
