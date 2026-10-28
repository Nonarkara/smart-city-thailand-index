import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { allCities } from "./cityData";
import { getCityHeritage } from "./cityHeritage";
import { getNongPlubRecord, NONG_PLUB_ASSETS, NONG_PLUB_AVATAR } from "./nongPlubData";
import { NongPlubCard, NongPlubMiniBadge } from "./NongPlubCard";
import type { Locale } from "./types";

const ROOT = process.cwd();
const PUBLIC = path.join(ROOT, "public");

describe("Nong Plub Crayon Travel Companion", () => {
  it("every city across Thailand has a rich, valid Nong Plub record", () => {
    expect(allCities.length).toBeGreaterThanOrEqual(118);

    for (const city of allCities) {
      const record = getNongPlubRecord(city);
      expect(record.cityId).toBe(city.id);
      expect(["urban", "heritage", "temple", "cafe", "nature"]).toContain(record.outfit);

      for (const loc of ["en", "th", "zh"] as Locale[]) {
        expect(record.siteName[loc], `city ${city.id} missing siteName in ${loc}`).toBeTruthy();
        expect(record.activity[loc], `city ${city.id} missing activity in ${loc}`).toBeTruthy();
        expect(record.quote[loc], `city ${city.id} missing quote in ${loc}`).toBeTruthy();
        expect(record.tip[loc], `city ${city.id} missing tip in ${loc}`).toBeTruthy();
        expect(record.flavorTag[loc], `city ${city.id} missing flavorTag in ${loc}`).toBeTruthy();
      }
    }
  });

  it("all 5 illustrated crayon outfits and avatar exist as valid image assets", () => {
    const assets = [...Object.values(NONG_PLUB_ASSETS), NONG_PLUB_AVATAR];
    for (const rel of assets) {
      const full = path.join(PUBLIC, rel);
      expect(fs.existsSync(full), `Asset missing on disk: ${rel}`).toBe(true);
      const bytes = fs.readFileSync(full);
      expect(rel).toMatch(/-crayon\.webp$/);
      const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
      const webp = bytes.subarray(0, 4).toString() === "RIFF" && bytes.subarray(8, 12).toString() === "WEBP";
      expect(png || webp, `${rel}: not a declared image format`).toBe(true);
    }
  });

  it("couples all published city notes to verified nonregional source records", () => {
    for (const city of allCities) {
      const source = getCityHeritage(city).find(record => record.verifiedAt && record.scope !== "regional");
      expect(source, `${city.id}: verified source missing`).toBeDefined();
      const record = getNongPlubRecord(city);
      expect(record.sourceUrl).toBe(source!.sourceUrl);
      expect(record.scope).toBe("province");
      expect(record.siteName).toEqual(source!.title);
      expect(record.quote).toEqual(source!.caption);
      expect(record.tip.en).toContain("not verified");
      expect(record.illustrationDisclosure.en).toContain("not evidence of a visit");
      expect(record.quote.en).not.toMatch(/Plub (bought|sat|stood|strolled)|sensors .*run silently|real civic intelligence/);
      expect(getNongPlubRecord(city).assetPath).toBe(record.assetPath);
    }
  });

  it("does not replace a missing source with invented regional experience", () => {
    const city = { ...allCities[0], province: "Unknown province" };
    const record = getNongPlubRecord(city);
    expect(record.sourceUrl).toBeNull();
    expect(record.scope).toBe("unverified");
    expect(record.quote.en).toBe("No verified provincial record is available for this dossier.");
    expect(record.tip.en).toContain("evidence gap");
  });

  it("renders the source-coupled note in Thai without invented testimony", () => {
    const chiangMai = allCities.find(c => c.id === "chiang-mai-old-town")!;
    const record = getNongPlubRecord(chiangMai);
    const { container } = render(<NongPlubCard city={chiangMai} locale="th" />);
    expect(screen.getAllByText(record.siteName.th).length).toBeGreaterThanOrEqual(1);
    expect(container.textContent).not.toContain("น้ำเต้าหู้ร้อนกับเสียงระฆังวัด");
    expect(container.textContent).not.toContain("พลับชอบเดิน");
    expect(screen.getByText(record.illustrationDisclosure.th)).toBeDefined();
    expect(container.querySelector("blockquote")).toBeNull();
    expect(container.querySelector("details summary")).toBeDefined();
    expect(container.querySelector(`a[href="${record.sourceUrl}"]`)).toBeDefined();
  });

  it("renders the NongPlubMiniBadge in tag mode without nested button", () => {
    const phuket = allCities.find(c => c.id === "phuket")!;
    const { container } = render(<NongPlubMiniBadge city={phuket} locale="en" asTag={true} />);

    expect(container.querySelector("span.nong-plub-mini-badge")).toBeDefined();
    expect(container.querySelector("button")).toBeNull();
    expect(screen.getAllByText(getNongPlubRecord(phuket).siteName.en).length).toBeGreaterThanOrEqual(1);
  });
});
