import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { allCities } from "./cityData";
import { getCityMediaAuditAssets, getCityPhotoSet, hasExplicitCityPhotoAsset } from "./cityMedia";

const publicRoot = join(process.cwd(), "public");
const sourceRoot = join(process.cwd(), "src");

function publicPath(src: string): string | null {
  if (!src.startsWith("/") || src.startsWith("//") || src.startsWith("/http")) return null;
  return join(publicRoot, decodeURIComponent(src.slice(1)));
}

function webpCompanionPath(src: string): string | null {
  const path = publicPath(src);
  if (!path || !/\.(jpe?g|png)$/i.test(src)) return null;
  return path.replace(/\.(jpe?g|png)$/i, ".webp");
}

function collectSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(entry => {
    const absolute = join(dir, entry);
    const stat = statSync(absolute);
    if (stat.isDirectory()) return collectSourceFiles(absolute);
    if (/\.(ts|tsx|css)$/.test(entry)) return [absolute];
    return [];
  });
}

function localMediaRefsFromSource(): Array<{ file: string; src: string }> {
  const files = [...collectSourceFiles(sourceRoot), join(process.cwd(), "index.html")];
  const refs: Array<{ file: string; src: string }> = [];
  const pattern = /["'`](\/[^"'`]+?\.(?:jpg|jpeg|png|webp|avif|svg))["'`]/gi;

  files.forEach(file => {
    const text = readFileSync(file, "utf8");
    for (const match of text.matchAll(pattern)) {
      refs.push({ file, src: match[1] });
    }
  });

  return Array.from(new Map(refs.map(ref => [`${ref.file}:${ref.src}`, ref])).values());
}

describe("city media integrity", () => {
  function resolvedCityAssets() {
    return allCities.flatMap(city => {
      const photoSet = getCityPhotoSet(city);
      return [
        { id: `resolved-${city.id}-hero`, asset: photoSet.hero },
        ...(photoSet.breaks ?? []).map((brk, index) => ({
          id: `resolved-${city.id}-break-${index + 1}`,
          asset: brk.asset,
        })),
      ];
    });
  }

  it("resolves every city hero and chapter image to a public asset with webp companions where required", () => {
    const assets = [...getCityMediaAuditAssets(), ...resolvedCityAssets()];

    assets.forEach(({ id, asset }) => {
      const path = publicPath(asset.src);
      expect(path, `${id} should use a local public asset`).not.toBeNull();
      expect(existsSync(path!), `${id} missing ${asset.src}`).toBe(true);

      const webp = webpCompanionPath(asset.src);
      if (webp) {
        expect(existsSync(webp), `${id} missing webp companion for ${asset.src}`).toBe(true);
      }
    });
  });

  it("keeps rendered media URLs srcset-safe", () => {
    const assets = [...getCityMediaAuditAssets(), ...resolvedCityAssets()];

    assets.forEach(({ id, asset }) => {
      expect(asset.src, `${id} must percent-encode spaces before it enters srcset`).not.toMatch(/\s/);
    });
  });

  it("gives every full dossier an intentional hero mapping instead of a broad regional fallback", () => {
    const fullCities = allCities.filter(city => city.status !== "registered");
    expect(fullCities).toHaveLength(49);

    fullCities.forEach(city => {
      expect(hasExplicitCityPhotoAsset(city.id), `${city.id} uses only a regional fallback`).toBe(true);
    });
  });

  it("keeps hard-coded local media references in source files valid", () => {
    localMediaRefsFromSource().forEach(({ file, src }) => {
      const path = publicPath(src);
      expect(path, `${file} should reference a public asset`).not.toBeNull();
      expect(existsSync(path!), `${file} references missing asset ${src}`).toBe(true);

      const webp = webpCompanionPath(src);
      if (webp) {
        expect(existsSync(webp), `${file} missing webp companion for ${src}`).toBe(true);
      }
    });
  });

  it("gives every chapter break a trilingual caption free of smart quotes", () => {
    // Same drift class as the page-hero guard (src/heroPhotoIntegrity.test.ts):
    // a caption that drops a locale, uses a Unicode curly quote as a
    // delimiter, or contradicts its city can land silently. We can't
    // unit-test factual accuracy (judges do that), but we can fail the
    // build on structural drift. City-name agreement is intentionally
    // not checked here — some breaks describe a context (the hydrological
    // dashboard, the BRT corridor) without naming the city, and that's
    // a deliberate editorial choice, not a bug.
    const citiesWithBreaks = allCities
      .map(city => ({ city, breaks: getCityPhotoSet(city).breaks ?? [] }))
      .filter(({ breaks }) => breaks.length > 0);

    // Sanity: at least one city must be using chapter breaks today, or the
    // guard is guarding nothing.
    expect(
      citiesWithBreaks.length,
      "no cities have chapter breaks — guard is inactive, re-check the data layer",
    ).toBeGreaterThan(0);

    citiesWithBreaks.forEach(({ city, breaks }) => {
      breaks.forEach((brk, index) => {
        for (const suffix of ["En", "Th", "Zh"] as const) {
          const caption = brk[`caption${suffix}`];
          expect(
            typeof caption === "string" && caption.trim().length > 0,
            `${city.id} break #${index + 1} (after ${brk.after}) caption${suffix} is empty or missing`,
          ).toBe(true);
          expect(
            !caption.includes("\u201C") && !caption.includes("\u201D"),
            `${city.id} break #${index + 1} (after ${brk.after}) caption${suffix} contains a smart double-quote`,
          ).toBe(true);
        }
      });
    });
  });
});
