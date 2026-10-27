import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import fs from "node:fs";
import path from "node:path";
import { allCities } from "./cityData";
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

  it("all 5 illustrated crayon outfits and avatar exist on disk as valid SVGs", () => {
    const assets = [...Object.values(NONG_PLUB_ASSETS), NONG_PLUB_AVATAR];
    for (const rel of assets) {
      const full = path.join(PUBLIC, rel);
      expect(fs.existsSync(full), `Asset missing on disk: ${rel}`).toBe(true);
      const content = fs.readFileSync(full, "utf8");
      expect(content).toContain("<svg");
      expect(content).toContain("</svg>");
    }
  });

  it("renders the NongPlubCard with human craft details in Thai", () => {
    const chiangMai = allCities.find(c => c.id === "chiang-mai-old-town")!;
    render(<NongPlubCard city={chiangMai} locale="th" />);

    expect(screen.getAllByText(/ประตูท่าแพ/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/น้องพลับพาเที่ยว/)).toBeDefined();
    expect(screen.getByText(/คำแนะนำจากน้องพลับ:/)).toBeDefined();
    expect(screen.getByText(/น้ำเต้าหู้ร้อนกับเสียงระฆังวัด/)).toBeDefined();
  });

  it("renders the NongPlubMiniBadge in tag mode without nested button", () => {
    const phuket = allCities.find(c => c.id === "phuket")!;
    const { container } = render(<NongPlubMiniBadge city={phuket} locale="en" asTag={true} />);

    expect(container.querySelector("span.nong-plub-mini-badge")).toBeDefined();
    expect(container.querySelector("button")).toBeNull();
    expect(screen.getByText(/Thalang Road/)).toBeDefined();
  });
});
