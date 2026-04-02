import { loadSignalSnapshot, submitSignal, summarizeSignals, type SmartCitySignal } from "./signalStore";

describe("signalStore", () => {
  it("summarizes recent signals into trend metrics", () => {
    const signals: SmartCitySignal[] = [
      {
        id: "a",
        cityId: "phuket",
        source: "test",
        channel: "manual",
        text: "People want better mobility.",
        sentiment: "positive",
        sentimentScore: 0.7,
        themes: ["mobility", "service delivery"],
        observedAt: "2026-03-20T10:00:00.000Z",
        createdAt: "2026-03-20T10:00:00.000Z",
      },
      {
        id: "b",
        cityId: "phuket",
        source: "test",
        channel: "manual",
        text: "They are tired of branding without delivery.",
        sentiment: "negative",
        sentimentScore: -0.7,
        themes: ["branding", "service delivery"],
        observedAt: "2026-03-21T10:00:00.000Z",
        createdAt: "2026-03-21T10:00:00.000Z",
      },
    ];

    const snapshot = summarizeSignals(signals, {
      mode: "local",
      healthy: true,
      detail: "test",
    });

    expect(snapshot.metrics.totalSignals).toBe(2);
    expect(snapshot.metrics.activeCities).toBe(1);
    expect(snapshot.metrics.positiveShare).toBe(50);
    expect(snapshot.themeBreakdown[0]).toEqual({ theme: "service delivery", count: 2 });
  });

  it("falls back to local storage and keeps newly submitted signals visible in tests", async () => {
    const uniqueText = `Signal ${Date.now()}`;

    await submitSignal({
      cityId: "phuket",
      source: "unit test",
      sentiment: "positive",
      themes: ["trust", "mobility"],
      text: uniqueText,
    });

    const snapshot = await loadSignalSnapshot();

    expect(snapshot.recentSignals.some(signal => signal.text === uniqueText)).toBe(true);
  });
});
