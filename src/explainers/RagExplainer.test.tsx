import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RagExplainer from "./RagExplainer";
import {
  RAG_BEATS,
  RAG_EXPLAINER_TOTAL_DURATION,
  getBeatForTime,
  formatPlaybackTime,
} from "./ragExplainerTypes";

describe("RagExplainer — BOOK-Compliant RAG Evidence Explainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calculates deterministic beat boundaries accurately", () => {
    expect(RAG_EXPLAINER_TOTAL_DURATION).toBe(14.0);
    expect(RAG_BEATS).toHaveLength(4);

    // Beat 0: 0.0 - 3.5s (Query)
    expect(getBeatForTime(0.0).id).toBe("query");
    expect(getBeatForTime(2.0).id).toBe("query");

    // Beat 1: 3.5 - 7.0s (Retrieval)
    expect(getBeatForTime(3.5).id).toBe("retrieval");
    expect(getBeatForTime(5.0).id).toBe("retrieval");

    // Beat 2: 7.0 - 10.5s (Source)
    expect(getBeatForTime(7.0).id).toBe("source");
    expect(getBeatForTime(9.5).id).toBe("source");

    // Beat 3: 10.5 - 14.0s (Verdict)
    expect(getBeatForTime(10.5).id).toBe("verdict");
    expect(getBeatForTime(13.9).id).toBe("verdict");
    expect(getBeatForTime(14.0).id).toBe("verdict");

    // Clamping boundaries
    expect(getBeatForTime(-5).id).toBe("query");
    expect(getBeatForTime(99).id).toBe("verdict");
  });

  it("formats playback timestamps cleanly", () => {
    expect(formatPlaybackTime(0)).toBe("00:00.0");
    expect(formatPlaybackTime(3.5)).toBe("00:03.5");
    expect(formatPlaybackTime(14.0)).toBe("00:14.0");
    expect(formatPlaybackTime(15.0)).toBe("00:14.0"); // clamped
  });

  it("renders in English with prominent 44px Play control and stops on load", () => {
    render(<RagExplainer locale="en" />);

    // Does NOT autoplay on load (idle state)
    const playBtn = screen.getByRole("button", { name: /play explainer/i });
    expect(playBtn).toBeInTheDocument();
    // 44px tap target lives in .rag-explainer-btn (CSS), not an inline style
    expect(playBtn.className).toContain("rag-explainer-btn");

    // Active first beat content rendered
    expect(screen.getByText(/1\. Question Formulation/i)).toBeInTheDocument();
    expect(screen.getByText(/Does Chiang Mai have verified IoT air sensor coverage/i)).toBeInTheDocument();

    // Scrubber is present; its 44px tap target lives in
    // .rag-explainer-scrub input[type="range"] (CSS), not an inline style
    const scrubber = screen.getByRole("slider", { name: /scrub timeline position/i });
    expect(scrubber).toBeInTheDocument();
    expect(scrubber.tagName).toBe("INPUT");
    expect(scrubber.parentElement?.className).toContain("rag-explainer-scrub");
  });

  it("supports discrete step jumping across all four beats", () => {
    render(<RagExplainer locale="en" />);

    // Jump to Beat 2 (Retrieval)
    const beat2Btn = screen.getByRole("button", { name: /BEAT 02 · MULTI_INDEX_SCAN/i });
    fireEvent.click(beat2Btn);
    expect(screen.getByText(/2\. Multi-Index & Cross-Source Retrieval/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtered 118 city records/i)).toBeInTheDocument();

    // Jump to Beat 3 (Source)
    const beat3Btn = screen.getByRole("button", { name: /BEAT 03 · PROVENANCE_CHECK/i });
    fireEvent.click(beat3Btn);
    expect(screen.getByText(/3\. Source Grounding & Gap Isolation/i)).toBeInTheDocument();
    expect(screen.getByText(/2026-04-04 ISO/i)).toBeInTheDocument();

    // Jump to Beat 4 (Verdict)
    const beat4Btn = screen.getByRole("button", { name: /BEAT 04 · DEFENSIBLE_VERDICT/i });
    fireEvent.click(beat4Btn);
    expect(screen.getByText(/4\. Defensible Synthesis & Actionable Verdict/i)).toBeInTheDocument();
    expect(screen.getByText(/Provincial Verified · Grid Open/i)).toBeInTheDocument();
  });

  it("toggles and renders static architectural storyboard mode", () => {
    render(<RagExplainer locale="en" />);

    const toggleBtn = screen.getByRole("button", { name: /view full storyboard/i });
    fireEvent.click(toggleBtn);

    // In storyboard mode, all 4 beats are visible simultaneously
    expect(screen.getByText(/BEAT 01/i)).toBeInTheDocument();
    expect(screen.getByText(/BEAT 02/i)).toBeInTheDocument();
    expect(screen.getByText(/BEAT 03/i)).toBeInTheDocument();
    expect(screen.getByText(/BEAT 04/i)).toBeInTheDocument();

    // Can toggle back to timeline view
    const returnBtn = screen.getByRole("button", { name: /storyboard view \(active\)/i });
    fireEvent.click(returnBtn);
    expect(screen.getByRole("button", { name: /play explainer/i })).toBeInTheDocument();
  });

  it("supports Thai and Chinese locales faithfully", () => {
    const { unmount } = render(<RagExplainer locale="th" />);
    expect(screen.getAllByText(/การตั้งคำถามหลักฐานและขอบเขตความหมาย/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/เชียงใหม่มีโครงข่ายเซนเซอร์อากาศ IoT/i)).toBeInTheDocument();
    unmount();

    render(<RagExplainer locale="zh" />);
    expect(screen.getAllByText(/证据提问与语义范围解析/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/清迈具备经实地核验的 IoT 空气传感器网络/i)).toBeInTheDocument();
  });

  it("allows interactive play, pause, and scrubber manipulation", () => {
    vi.useFakeTimers();
    render(<RagExplainer locale="en" />);

    const playBtn = screen.getByRole("button", { name: /play explainer/i });
    fireEvent.click(playBtn);

    // Now showing pause button
    const pauseBtn = screen.getByRole("button", { name: /pause explainer/i });
    expect(pauseBtn).toBeInTheDocument();

    // Pause it
    fireEvent.click(pauseBtn);
    expect(screen.getByRole("button", { name: /play explainer/i })).toBeInTheDocument();

    // Scrub slider
    const scrubber = screen.getByRole("slider", { name: /scrub timeline position/i });
    fireEvent.change(scrubber, { target: { value: "8.5" } });

    // Should now be at Beat 3 (Source Grounding)
    expect(screen.getByText(/3\. Source Grounding & Gap Isolation/i)).toBeInTheDocument();
    vi.useRealTimers();
  });
});
