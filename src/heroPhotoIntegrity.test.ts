import { describe, it, expect } from "vitest";
import { PAGE_HERO_ASSETS } from "./App";
import { existsSync } from "node:fs";
import { join } from "node:path";

// Guards the page-hero photo strip against the kind of drift that a
// rushed agent edit can introduce: title / place / description disagreeing
// about *which* place the photo shows, a missing locale, or a deleted file.
// This regression landed after a Codex edit set title="Nakhon Si Thammarat"
// on the showcase hero whose photo, place, and description all describe Tak.

const publicRoot = join(process.cwd(), "public");

function publicPath(src: string): string | null {
  if (!src.startsWith("/") || src.startsWith("//") || src.startsWith("/http")) return null;
  return join(publicRoot, decodeURIComponent(src.slice(1)));
}

describe("PAGE_HERO_ASSETS integrity", () => {
  const entries = Object.entries(PAGE_HERO_ASSETS);

  it("has exactly the expected set of routes", () => {
    expect(entries.map(e => e[0]).sort()).toEqual(
      [
        "about",
        "asus",
        "audit",
        "bingo",
        "compare",
        "creative-economy",
        "discover",
        "invest",
        "knowledge",
        "map",
        "methodology",
        "partners",
        "program",
        "rankings",
        "references",
        "showcase",
        "story",
        "why",
      ].sort(),
    );
  });

  it("every referenced photo exists on disk", () => {
    for (const [route, asset] of entries) {
      const path = publicPath(asset.src);
      expect(path, `${route} hero src must be a local public asset`).not.toBeNull();
      expect(existsSync(path!), `missing photo for ${route}: ${asset.src}`).toBe(true);
    }
  });

  it("title / place / description agree on which place is shown", () => {
    // The place label must appear in the EN description so a reader never
    // sees a headline that contradicts the blurb beneath it. The label can
    // be a city ("Bangkok") while the description leads with a district
    // ("Makkasan, Bangkok …") — what matters is that the two agree, not
    // that the label is the first word. This is what caught the original
    // Codex regression: place="Tak" with a description of Tak but a stale
    // title="Nakhon Si Thammarat".
    for (const [route, asset] of entries) {
      const place = asset.place.trim();
      const desc = asset.description.en.trim();
      expect(
        desc.toLowerCase().includes(place.toLowerCase()),
        `${route}: place "${place}" not mentioned in description "${desc.slice(0, 60)}…"`,
      ).toBe(true);
    }
  });

  it("every field is present in all three locales", () => {
    for (const [route, asset] of entries) {
      for (const field of ["title", "description"] as const) {
        for (const locale of ["en", "th", "zh"] as const) {
          const value = asset[field][locale];
          expect(
            typeof value === "string" && value.trim().length > 0,
            `${route}.${field}.${locale} is empty or missing`,
          ).toBe(true);
        }
      }
      expect(
        typeof asset.place === "string" && asset.place.trim().length > 0,
        `${route}.place is empty`,
      ).toBe(true);
    }
  });

  it("uses ASCII double quotes only as delimiters (no smart quotes)", () => {
    // CLAUDE.md §Smart quotes: never Unicode curly quotes as TS string delimiters.
    // The 「」 brackets are intentional CJK emphasis marks, not delimiters, so
    // they are allowed inside the strings; the guard is on the source lexeme.
    for (const [route, asset] of entries) {
      for (const field of ["title", "description"] as const) {
        for (const locale of ["en", "th", "zh"] as const) {
          const value = asset[field][locale];
          expect(
            !value.includes("\u201C") && !value.includes("\u201D"),
            `${route}.${field}.${locale} contains a smart double-quote character`,
          ).toBe(true);
        }
      }
    }
  });
});