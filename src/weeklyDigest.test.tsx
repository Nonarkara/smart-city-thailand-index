import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import HomePage from "./HomePage";
import { WEEKLY_DIGEST, formatWeeklyStamp } from "./weeklyDigest";

afterEach(() => vi.useRealTimers());

describe("editorial reading list is not a measurement", () => {
  it("dates the selection, without claiming the underlying data was updated", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-25T12:00:00Z"));
    expect(formatWeeklyStamp("2026-10-25", "en")).toBe("Selected today");
    expect(formatWeeklyStamp("2026-10-18", "en")).toBe("Selected 1 week ago");
    expect(formatWeeklyStamp("2026-10-26", "en")).toBe("Selection dated 2026-10-26");
    for (const locale of ["en", "th", "zh"] as const) {
      expect(formatWeeklyStamp(WEEKLY_DIGEST.weekOf, locale)).not.toMatch(/Updated|อัปเดต|更新/);
    }
  });

  it("renders research suggestions without invented trending, health targets or news provenance", () => {
    render(<HomePage locale="en" onNavigate={vi.fn()} />);
    expect(screen.getByText("Editor's reading list")).toBeInTheDocument();
    expect(screen.getByText("Suggested research query")).toBeInTheDocument();
    expect(screen.getByText(/no search-volume or trend measurement/)).toBeInTheDocument();
    expect(screen.queryByText("Trending search")).not.toBeInTheDocument();
    expect(screen.queryByText("Trending city")).not.toBeInTheDocument();
    const query = screen.getByText("Suggested research query").closest('a')!;
    expect(new URL(query.href).searchParams.get("q")).toBe(WEEKLY_DIGEST.trendingSearch.phrase.en);
    expect(WEEKLY_DIGEST.headline.url).toBe("https://data.go.th/dataset/rtddi");
    expect(WEEKLY_DIGEST.trendingCity.note.en).not.toContain("50%");
    expect(WEEKLY_DIGEST.trendingSearch.deltaLabel.en).not.toContain("Surging");
  });
});
