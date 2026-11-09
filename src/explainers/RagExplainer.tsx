import React, { useState, useEffect, useRef, useCallback } from "react";
import type { Locale } from "../types";
import { translate } from "../cityPresentation";
import "./RagExplainer.css";
import {
  RAG_BEATS,
  RAG_EXPLAINER_TOTAL_DURATION,
  getBeatForTime,
  formatPlaybackTime,
} from "./ragExplainerTypes";

export interface RagExplainerProps {
  locale?: Locale;
  standalone?: boolean;
  className?: string;
  initialBeat?: number; // 0..3
  initialPlaying?: boolean;
}

export default function RagExplainer({
  locale = "en",
  standalone = false,
  className = "",
  initialBeat = 0,
  initialPlaying = false,
}: RagExplainerProps) {
  const [currentTime, setCurrentTime] = useState<number>(() => {
    if (initialBeat >= 0 && initialBeat < RAG_BEATS.length) {
      return RAG_BEATS[initialBeat].startTime;
    }
    return 0.0;
  });
  const [isPlaying, setIsPlaying] = useState<boolean>(initialPlaying);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const [displayMode, setDisplayMode] = useState<"timeline" | "storyboard">(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "storyboard" : "timeline";
    }
    return "timeline";
  });
  const [isDebug] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return new URLSearchParams(window.location.search).get("debug") === "1";
    }
    return false;
  });

  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Subscribe to system reduced motion changes
  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.matchMedia === "function") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const listener = (e: MediaQueryListEvent) => {
        setIsReducedMotion(e.matches);
        if (e.matches) {
          setDisplayMode("storyboard");
          setIsPlaying(false);
        }
      };
      mediaQuery.addEventListener?.("change", listener);
      return () => mediaQuery.removeEventListener?.("change", listener);
    }
  }, []);

  // Animation frame loop — deterministic, non-looping, hard-stop at end
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      lastTimestampRef.current = null;
      return;
    }

    const step = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      }
      const deltaSeconds = (now - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = now;

      setCurrentTime((prev) => {
        const nextTime = prev + deltaSeconds;
        if (nextTime >= RAG_EXPLAINER_TOTAL_DURATION) {
          setIsPlaying(false);
          return RAG_EXPLAINER_TOTAL_DURATION;
        }
        return nextTime;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying]);

  const handlePlay = useCallback(() => {
    if (currentTime >= RAG_EXPLAINER_TOTAL_DURATION) {
      setCurrentTime(0.0);
    }
    setIsPlaying(true);
  }, [currentTime]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleReplay = useCallback(() => {
    setCurrentTime(0.0);
    setIsPlaying(true);
  }, []);

  const handleJumpToBeat = useCallback((beatIndex: number) => {
    const targetBeat = RAG_BEATS[beatIndex];
    if (targetBeat) {
      setCurrentTime(targetBeat.startTime);
      setIsPlaying(false);
    }
  }, []);

  const handleScrub = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    setIsPlaying(false);
  }, []);

  const currentBeat = getBeatForTime(currentTime);
  const progressRatio = Math.min(1, Math.max(0, currentTime / RAG_EXPLAINER_TOTAL_DURATION));

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  return (
    <section
      className={`rag-explainer-root ${standalone ? "rag-explainer-standalone" : ""} ${className}`}
      aria-label={t({
        en: "SCITI Evidence RAG Explainer: Question to Grounded Verdict",
        th: "กระบวนการตรวจสอบหลักฐาน RAG: จากคำถามสู่บทสรุปจริง",
        zh: "SCITI 实证 RAG 流程解析：从提问到落地结论",
      })}
      role="region"
    >
      {/* Top Header & Architecture Badge */}
      <div className="rag-explainer-header">
        <div>
          <span className="rag-explainer-header-badge">
            {t({
              en: "ARCHITECTURAL EXPLAINER · 4-BEAT RAG GROUNDING",
              th: "แผนภาพกระบวนการวิจัย · 4 จังหวะตรวจสอบหลักฐาน RAG",
              zh: "架构原理解析 · 4 阶段实证 RAG 溯源",
            })}
          </span>
          <h3 className="rag-explainer-title">
            {t({
              en: "How SCITI Evaluates City Claims (Question → Retrieval → Source → Verdict)",
              th: "วิธีที่ SCITI ตรวจสอบข้อมูลเมือง (คำถาม → ดึงข้อมูล → สอบที่มา → บทสรุป)",
              zh: "SCITI 如何核查城市主张（提问 → 检索 → 溯源 → 结论）",
            })}
          </h3>
        </div>

        {/* Storyboard / Motion Mode Toggle */}
        <div className="rag-explainer-mode-toggle">
          <button
            type="button"
            className={`rag-explainer-btn ${displayMode === "storyboard" ? "rag-explainer-btn--active" : ""}`}
            onClick={() => setDisplayMode(displayMode === "timeline" ? "storyboard" : "timeline")}
            aria-pressed={displayMode === "storyboard"}
          >
            {displayMode === "storyboard"
              ? t({ en: "Storyboard View (Active)", th: "มุมมองบอร์ดคงที่ (เปิดอยู่)", zh: "分镜全览（当前）" })
              : t({ en: "View Full Storyboard", th: "ดูแบบแผนภาพ 4 ช่อง", zh: "查看静态分镜" })}
          </button>
        </div>
      </div>

      {/* Mode A: Interactive Timeline Explainer */}
      {displayMode === "timeline" && (
        <div className="rag-explainer-timeline-view">
          {/* 4 Beat Step Indicator Bar */}
          <nav
            aria-label={t({ en: "Explainer Stages", th: "ขั้นตอนการอธิบาย", zh: "阶段选择" })}
            className="rag-explainer-beats"
          >
            {RAG_BEATS.map((beat, idx) => {
              const isActive = currentBeat.id === beat.id;
              const isPast = currentTime >= beat.endTime;
              return (
                <button
                  key={beat.id}
                  type="button"
                  onClick={() => handleJumpToBeat(idx)}
                  aria-current={isActive ? "step" : undefined}
                  className={`rag-explainer-beat ${
                    isActive ? "rag-explainer-beat--active" : isPast ? "rag-explainer-beat--past" : ""
                  }`}
                >
                  <span className="rag-explainer-beat-tag">
                    BEAT 0{beat.stepNumber} · {beat.tag}
                  </span>
                  <span className="rag-explainer-beat-title">
                    {t(beat.title).split(". ")[1] || t(beat.title)}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Active Stage Display Panel — One Continuous World */}
          <div className="rag-explainer-stage" aria-live="polite">
            <div className="rag-explainer-stage-head">
              <h4 className="rag-explainer-stage-title">{t(currentBeat.title)}</h4>
              <span className="rag-explainer-metric">
                {t(currentBeat.metric.label)}: {currentBeat.metric.value}
              </span>
            </div>

            <p className="rag-explainer-lead">{t(currentBeat.lead)}</p>

            <ul className="rag-explainer-details">
              {currentBeat.details[locale].map((item, idx) => (
                <li key={idx} className="rag-explainer-detail">
                  <span aria-hidden="true" className="rag-explainer-detail-num">
                    [0{idx + 1}]
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Transport Controls & Scrubber */}
          <div className="rag-explainer-transport">
            {/* Play / Pause / Replay Buttons */}
            <div className="rag-explainer-transport-btns">
              {!isPlaying ? (
                currentTime >= RAG_EXPLAINER_TOTAL_DURATION ? (
                  <button
                    type="button"
                    className="rag-explainer-btn rag-explainer-btn--replay"
                    onClick={handleReplay}
                    aria-label={t({ en: "Replay explainer", th: "เล่นซ้ำกระบวนการ", zh: "重新播放流程" })}
                  >
                    <span aria-hidden="true">↺</span>
                    <span>{t({ en: "Replay", th: "เล่นซ้ำ", zh: "重播" })}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    className="rag-explainer-btn rag-explainer-btn--primary"
                    onClick={handlePlay}
                    aria-label={t({ en: "Play explainer", th: "เล่นกระบวนการ", zh: "播放流程" })}
                  >
                    <span aria-hidden="true">▶</span>
                    <span>{t({ en: "Play", th: "เล่น", zh: "播放" })}</span>
                  </button>
                )
              ) : (
                <button
                  type="button"
                  className="rag-explainer-btn rag-explainer-btn--pause"
                  onClick={handlePause}
                  aria-label={t({ en: "Pause explainer", th: "พักการเล่น", zh: "暂停播放" })}
                >
                  <span aria-hidden="true">❚❚</span>
                  <span>{t({ en: "Pause", th: "พัก", zh: "暂停" })}</span>
                </button>
              )}
            </div>

            {/* Scrubber Range Slider */}
            <div className="rag-explainer-scrub">
              <input
                type="range"
                min="0"
                max={RAG_EXPLAINER_TOTAL_DURATION}
                step="0.1"
                value={currentTime}
                onChange={handleScrub}
                aria-label={t({ en: "Scrub timeline position", th: "เลื่อนตำแหน่งไทม์ไลน์", zh: "拖动时间轴位置" })}
              />
              <span className="rag-explainer-time">
                {formatPlaybackTime(currentTime)} / {formatPlaybackTime(RAG_EXPLAINER_TOTAL_DURATION)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Mode B: Static Architectural Storyboard (prefers-reduced-motion safe) */}
      {displayMode === "storyboard" && (
        <div className="rag-explainer-storyboard-view">
          {RAG_BEATS.map((beat) => (
            <article key={beat.id} className="rag-explainer-card">
              <div>
                <div className="rag-explainer-card-head">
                  <span className="rag-explainer-beat-tag">BEAT 0{beat.stepNumber}</span>
                  <span className="rag-explainer-beat-tag--muted">{beat.tag}</span>
                </div>
                <h4 className="rag-explainer-card-title">{t(beat.title)}</h4>
                <p className="rag-explainer-card-lead">{t(beat.lead)}</p>
                <ul className="rag-explainer-details">
                  {beat.details[locale].map((d, i) => (
                    <li key={i} className="rag-explainer-detail">
                      <span aria-hidden="true" className="rag-explainer-detail-num">-</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rag-explainer-card-metric">
                <span>{t(beat.metric.label)}:</span>
                <span className="rag-explainer-card-metric-value">{beat.metric.value}</span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Debug Inspector HUD (Visible when ?debug=1 is set) */}
      {(isDebug || (typeof window !== "undefined" && new URLSearchParams(window.location.search).get("debug") === "1")) && (
        <div className="rag-explainer-debug-hud">
          <div className="rag-explainer-debug-head">DEBUG HUD (?debug=1) · Deterministic Playhead Inspector</div>
          <div className="rag-explainer-debug-body">
            Time: {currentTime.toFixed(3)}s / {RAG_EXPLAINER_TOTAL_DURATION}s | Progress: {(progressRatio * 100).toFixed(1)}% |
            Active Beat: {currentBeat.id.toUpperCase()} (0{currentBeat.stepNumber}) | Playing: {String(isPlaying)} | ReducedMotion:{" "}
            {String(isReducedMotion)}
          </div>
        </div>
      )}
    </section>
  );
}
