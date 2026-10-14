// ---------------------------------------------------------------------------
// Speaking circuit integrity
// ---------------------------------------------------------------------------
// The circuit rail exists to stop the page growing every time a new
// international invitation lands. Two properties make that true, and both are
// asserted here so a future edit cannot quietly undo them:
//
//   1. PHOTOS ARE CAPPED. Only MAX_PHOTOS stops may carry a photograph.
//      Uncapped, a long career would push the rail sideways without limit and
//      re-introduce exactly the weight this component was built to remove.
//
//   2. DATA IS COMPLETE AND TRILINGUAL. Every stop needs all three locales on
//      every field, a real date, and alt text on any image — the page is a
//      judge-facing submission in which an untranslated card reads as a bug.
//
// Plus the boring but load-bearing checks: unique ids, ISO dates, photos that
// exist on disk with a webp companion, and alt text that actually describes
// something.
// ---------------------------------------------------------------------------

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { GRAND_SLAM_STOPS, MAX_PHOTOS, circuitCityCount, typeOnlyCount } from "./speakingCircuitData";

const publicRoot = join(process.cwd(), "public");

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

describe("speaking circuit — fixed footprint", () => {
  it("caps photographs at MAX_PHOTOS so the rail cannot grow sideways forever", () => {
    const photographed = GRAND_SLAM_STOPS.filter(s => s.thumb);
    expect(
      photographed.length,
      `${photographed.length} stops carry a photo; the cap is ${MAX_PHOTOS}`,
    ).toBeLessThanOrEqual(MAX_PHOTOS);
  });

  it("the cap is small enough to stay a rail", () => {
    // A rail that shows a dozen photographs is a gallery again. Three is the
    // point where the newest work is visible and the scroll stays bounded.
    expect(MAX_PHOTOS).toBeGreaterThan(0);
    expect(MAX_PHOTOS).toBeLessThanOrEqual(3);
  });

  it("photo and thumb travel together", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      expect(Boolean(stop.photo), `${stop.id}: thumb without photo`).toBe(Boolean(stop.thumb));
    }
  });

  it("every photo resolves on disk, with a webp companion", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      if (!stop.photo) continue;
      expect(existsSync(join(publicRoot, stop.photo)), `${stop.id}: ${stop.photo} missing`).toBe(true);
      const webp = stop.photo.replace(/\.(jpe?g|png)$/i, ".webp");
      expect(existsSync(join(publicRoot, webp)), `${stop.id}: missing webp companion ${webp}`).toBe(true);
      expect(
        existsSync(join(publicRoot, stop.thumb!)),
        `${stop.id}: missing thumbnail ${stop.thumb}`,
      ).toBe(true);
      const thumbWebp = stop.thumb!.replace(/\.(jpe?g|png)$/i, ".webp");
      expect(
        existsSync(join(publicRoot, thumbWebp)),
        `${stop.id}: missing thumbnail webp ${thumbWebp}`,
      ).toBe(true);
    }
  });
});

describe("speaking circuit — data integrity", () => {
  it("has stops, with unique ids", () => {
    expect(GRAND_SLAM_STOPS.length).toBeGreaterThan(0);
    const ids = GRAND_SLAM_STOPS.map(s => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every date is a real ISO date, or the stop is explicitly marked unconfirmed", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      if (stop.date === null) {
        // A null date is only ever legal on a stop that says it is unconfirmed.
        // This is the rule that keeps an invented date off a judge-facing page.
        expect(stop.unconfirmed, `${stop.id}: a null date requires unconfirmed: true`).toBe(true);
        continue;
      }
      expect(isIsoDate(stop.date), `${stop.id}: "${stop.date}" is not an ISO date`).toBe(true);
      expect(stop.unconfirmed, `${stop.id}: a dated stop should not also be marked unconfirmed`).toBeFalsy();
    }
  });

  it("an unconfirmed stop does not invent a venue", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      if (!stop.unconfirmed) continue;
      expect(stop.venue, `${stop.id}: an unconfirmed stop must not carry a venue`).toBeUndefined();
    }
  });

  it("the rail is ordered newest first", () => {
    // The array renders in place — nothing re-sorts at render time — so the
    // order is data, and a stop inserted in the wrong place silently puts an
    // older talk above a newer one.
    const dated = GRAND_SLAM_STOPS
      .map((stop) => stop.date)
      .filter((date): date is string => date !== null)
      .map((date) => Date.parse(date));
    for (let i = 1; i < dated.length; i += 1) {
      expect(dated[i]).toBeLessThanOrEqual(dated[i - 1]);
    }
  });

  it("no stop carries a date before the circuit began", () => {
    // Every stop on this rail is a 2026 appearance. A year that predates the
    // record is the signature of an invented date.
    for (const stop of GRAND_SLAM_STOPS) {
      if (!stop.date) continue;
      expect(stop.date.slice(0, 4), `${stop.id}: ${stop.date}`).toBe("2026");
    }
  });

  it("every stop on the circuit is dated", () => {
    // The undated Hong Kong placeholder is gone: the stop is LEAP East 2026,
    // Hong Kong Convention and Exhibition Centre, 10 July 2026.
    const undated = GRAND_SLAM_STOPS.filter((stop) => stop.unconfirmed || !stop.date);
    expect(undated.map((stop) => stop.id)).toEqual([]);
  });

  it("every locale field is present in en, th and zh", () => {
    const fields = ["city", "country", "venue", "format", "note"] as const;
    for (const stop of GRAND_SLAM_STOPS) {
      for (const field of fields) {
        const value = stop[field];
        if (value === undefined) continue; // venue is optional on an unconfirmed stop
        for (const locale of ["en", "th", "zh"] as const) {
          expect(
            typeof value[locale] === "string" && value[locale].trim().length > 0,
            `${stop.id}.${field}.${locale} is empty`,
          ).toBe(true);
        }
      }
    }
  });

  it("a photographed stop carries real alt text in every locale", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      if (!stop.photo) continue;
      expect(stop.photoAlt, `${stop.id}: photo without alt text`).toBeDefined();
      for (const locale of ["en", "th", "zh"] as const) {
        const alt = stop.photoAlt![locale];
        expect(alt.trim().length, `${stop.id}.photoAlt.${locale} is empty`).toBeGreaterThan(20);
      }
    }
  });

  it("a photographed stop carries a credit", () => {
    for (const stop of GRAND_SLAM_STOPS) {
      if (!stop.photo) continue;
      expect(stop.photoCredit, `${stop.id}: photo without a credit line`).toBeDefined();
    }
  });

  it("the notes stay short — this is a rail, not an essay", () => {
    // A note that grows into paragraphs reintroduces the vertical bleed.
    for (const stop of GRAND_SLAM_STOPS) {
      expect(
        stop.note.en.length,
        `${stop.id}: note is ${stop.note.en.length} chars; keep it under 320`,
      ).toBeLessThanOrEqual(320);
    }
  });

  it("counting helpers agree with the data", () => {
    const photographed = GRAND_SLAM_STOPS.filter(s => s.thumb).length;
    expect(typeOnlyCount()).toBe(GRAND_SLAM_STOPS.length - Math.min(photographed, MAX_PHOTOS));
    expect(circuitCityCount()).toBe(new Set(GRAND_SLAM_STOPS.map(s => s.city.en)).size);
  });
});