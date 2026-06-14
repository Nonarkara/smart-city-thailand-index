import { useEffect, useMemo, useState, type FormEvent } from "react";
import { allCities, getCityById } from "./cityData";
import { getCityName, translate } from "./cityPresentation";
import type { Locale } from "./types";
import { loadSignalSnapshot, submitSignal, type SignalSentiment, type SignalSnapshot } from "./signalStore";

interface Props {
  locale: Locale;
}

const SENTIMENT_OPTIONS: SignalSentiment[] = ["positive", "neutral", "negative"];

const SENTIMENT_LABELS: Record<Locale, Record<SignalSentiment, string>> = {
  en: {
    positive: "Positive",
    neutral: "Neutral",
    negative: "Negative",
  },
  th: {
    positive: "เชิงบวก",
    neutral: "กลาง",
    negative: "เชิงลบ",
  },
  zh: {
    positive: "积极",
    neutral: "中性",
    negative: "消极",
  },
};

const BACKEND_LABELS = {
  supabase: {
    en: "Supabase live",
    th: "Supabase ใช้งานได้",
    zh: "Supabase 已连接",
  },
  "google-apps-script": {
    en: "Sheets fallback live",
    th: "Google Sheets สำรองใช้งานได้",
    zh: "Google Sheets 备援已连接",
  },
  local: {
    en: "Local demo mode",
    th: "โหมดเดโมในเครื่อง",
    zh: "本地演示模式",
  },
} as const;

function formatObservedAt(value: string | null, locale: Locale): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function TrendIntelligencePanel({ locale }: Props) {
  const [snapshot, setSnapshot] = useState<SignalSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [form, setForm] = useState({
    cityId: "",
    source: "field note",
    sentiment: "neutral" as SignalSentiment,
    themes: "service delivery, trust",
    text: "",
  });

  const cityOptions = useMemo(() => {
    return [...allCities].sort((left, right) => left.nameEn.localeCompare(right.nameEn));
  }, []);

  const refreshSnapshot = async () => {
    setLoading(true);
    try {
      const next = await loadSignalSnapshot();
      setSnapshot(next);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;

    const run = async () => {
      setLoading(true);
      try {
        const next = await loadSignalSnapshot();
        if (active) setSnapshot(next);
      } finally {
        if (active) setLoading(false);
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, []);

  const submitLabel = saving
    ? translate(locale, { en: "Saving...", th: "กำลังบันทึก...", zh: "保存中..." })
    : translate(locale, { en: "Log signal", th: "บันทึกสัญญาณ", zh: "记录信号" });

  const backendLabel = snapshot
    ? BACKEND_LABELS[snapshot.backend.mode][locale]
    : translate(locale, { en: "Checking backend", th: "กำลังตรวจระบบหลังบ้าน", zh: "正在检查后端" });

  const recentSignals = snapshot?.recentSignals.slice(0, 5) ?? [];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      await submitSignal({
        cityId: form.cityId || undefined,
        source: form.source,
        sentiment: form.sentiment,
        text: form.text,
        themes: form.themes
          .split(",")
          .map(theme => theme.trim())
          .filter(Boolean),
      });

      setForm(current => ({
        ...current,
        text: "",
      }));

      await refreshSnapshot();
      setFeedback(
        translate(locale, {
          en: "Signal saved. The trend layer is alive.",
          th: "บันทึกสัญญาณแล้ว ระบบแนวโน้มทำงานอยู่",
          zh: "信号已保存，趋势层正在工作",
        }),
      );
    } catch {
      setFeedback(
        translate(locale, {
          en: "Signal could not be saved to a remote backend. Check the backend status note.",
          th: "ยังบันทึกไปยังระบบหลังบ้านไม่ได้ ตรวจข้อความสถานะด้านบน",
          zh: "未能写入远端后端，请检查上方状态说明",
        }),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dashboard-panel trend-panel">
      <div className="dashboard-panel-head">
        <div>
          <p className="eyebrow">
            {translate(locale, {
              en: "Trend radar",
              th: "เรดาร์แนวโน้ม",
              zh: "趋势雷达",
            })}
          </p>
          <h2>
            {translate(locale, {
              en: "Backend health + smart-city sentiment intake",
              th: "สุขภาพระบบหลังบ้าน + รับสัญญาณความคิดเห็นเมืองอัจฉริยะ",
              zh: "后端健康状态与智慧城市舆情采集",
            })}
          </h2>
          <p className="dashboard-panel-copy">
            {translate(locale, {
              en: "Supabase is the clean path. Google Sheets via Apps Script is the pragmatic fallback. This panel shows which one is actually alive and lets the team log incoming signals fast.",
              th: "เส้นทางหลักคือ Supabase ถ้าไม่พร้อมก็ใช้ Google Sheets ผ่าน Apps Script แบบใช้งานจริง หน้านี้บอกว่าระบบไหนยังหายใจอยู่และให้ทีมบันทึกสัญญาณใหม่ได้ทันที",
              zh: "首选是 Supabase，未就绪时则用 Google Sheets + Apps Script 作为务实备援。这个面板会直接告诉你现在到底是哪套后端在工作。",
            })}
          </p>
        </div>
        <button type="button" className="trend-refresh" onClick={() => void refreshSnapshot()} disabled={loading || saving}>
          {loading
            ? translate(locale, { en: "Refreshing...", th: "กำลังรีเฟรช...", zh: "刷新中..." })
            : translate(locale, { en: "Refresh", th: "รีเฟรช", zh: "刷新" })}
        </button>
      </div>

      <div className="trend-grid">
        <div className="trend-status-card">
          <div className="trend-status-head">
            <span className={`trend-backend-pill trend-backend-pill-${snapshot?.backend.mode ?? "local"}`}>
              {backendLabel}
            </span>
            <span className="trend-status-time">
              {translate(locale, {
                en: "Latest signal",
                th: "สัญญาณล่าสุด",
                zh: "最新信号",
              })}: {formatObservedAt(snapshot?.metrics.latestObservedAt ?? null, locale)}
            </span>
          </div>

          <p className="trend-status-note">
            {loading
              ? translate(locale, {
                en: "Checking the line.",
                th: "กำลังเช็กเส้นทางข้อมูล",
                zh: "正在检查数据链路",
              })
              : snapshot?.backend.detail}
          </p>

          <div className="trend-metric-grid">
            <div className="trend-metric-card">
              <span className="trend-metric-value">{snapshot?.metrics.totalSignals ?? "—"}</span>
              <span className="trend-metric-label">
                {translate(locale, {
                  en: "Signals loaded",
                  th: "จำนวนสัญญาณที่โหลด",
                  zh: "已加载信号",
                })}
              </span>
            </div>
            <div className="trend-metric-card">
              <span className="trend-metric-value">{snapshot?.metrics.activeCities ?? "—"}</span>
              <span className="trend-metric-label">
                {translate(locale, {
                  en: "Cities in conversation",
                  th: "เมืองที่ถูกพูดถึง",
                  zh: "被讨论城市数",
                })}
              </span>
            </div>
            <div className="trend-metric-card">
              <span className="trend-metric-value">
                {snapshot ? `${snapshot.metrics.positiveShare}%` : "—"}
              </span>
              <span className="trend-metric-label">
                {translate(locale, {
                  en: "Positive share",
                  th: "สัดส่วนเชิงบวก",
                  zh: "积极占比",
                })}
              </span>
            </div>
            <div className="trend-metric-card">
              <span className="trend-metric-value">
                {snapshot?.themeBreakdown[0]?.theme ?? "—"}
              </span>
              <span className="trend-metric-label">
                {translate(locale, {
                  en: "Top theme",
                  th: "ประเด็นนำ",
                  zh: "主要主题",
                })}
              </span>
            </div>
          </div>

          <div className="trend-chip-row">
            {(snapshot?.themeBreakdown.slice(0, 6) ?? []).map(item => (
              <span key={item.theme} className="trend-chip">
                {item.theme} · {item.count}
              </span>
            ))}
          </div>

          <div className="trend-signal-list">
            {recentSignals.map(signal => {
              const city = signal.cityId ? getCityById(signal.cityId) : undefined;
              return (
                <article key={signal.id} className="trend-signal-item">
                  <div className="trend-signal-meta">
                    <span className={`trend-sentiment trend-sentiment-${signal.sentiment}`}>
                      {SENTIMENT_LABELS[locale][signal.sentiment]}
                    </span>
                    <span>{city ? getCityName(city, locale) : translate(locale, { en: "National", th: "ระดับประเทศ", zh: "全国" })}</span>
                    <span>{signal.source}</span>
                  </div>
                  <p className="trend-signal-text">{signal.text}</p>
                  <div className="trend-signal-tags">
                    {signal.themes.map(theme => (
                      <span key={theme} className="trend-signal-tag">{theme}</span>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <form className="trend-form" onSubmit={handleSubmit}>
          <div className="trend-form-copy">
            <h3>
              {translate(locale, {
                en: "Log what people are actually saying",
                th: "บันทึกสิ่งที่คนพูดจริง",
                zh: "记录真实声音",
              })}
            </h3>
            <p>
              {translate(locale, {
                en: "Fast intake beats another dead slide deck. Add a note, source, city, and tone.",
                th: "การรับข้อมูลเร็วมีค่ากว่าสไลด์ตาย ๆ อีกชุด ใส่ข้อความ แหล่งที่มา เมือง และโทนความรู้สึก",
                zh: "快速录入比再做一套死掉的 PPT 更有价值，填入来源、城市、语气和内容就行。",
              })}
            </p>
          </div>

          <label className="trend-field">
            <span>{translate(locale, { en: "City", th: "เมือง", zh: "城市" })}</span>
            <select
              value={form.cityId}
              onChange={event => setForm(current => ({ ...current, cityId: event.target.value }))}
            >
              <option value="">
                {translate(locale, { en: "National / no city", th: "ระดับประเทศ / ไม่ระบุเมือง", zh: "全国 / 不指定城市" })}
              </option>
              {cityOptions.map(city => (
                <option key={city.id} value={city.id}>
                  {getCityName(city, locale)}
                </option>
              ))}
            </select>
          </label>

          <label className="trend-field">
            <span>{translate(locale, { en: "Source", th: "แหล่งที่มา", zh: "来源" })}</span>
            <input
              value={form.source}
              onChange={event => setForm(current => ({ ...current, source: event.target.value }))}
              placeholder={translate(locale, {
                en: "field note, Facebook, workshop...",
                th: "บันทึกภาคสนาม, Facebook, เวิร์กช็อป...",
                zh: "实地记录、Facebook、工作坊...",
              })}
            />
          </label>

          <label className="trend-field">
            <span>{translate(locale, { en: "Sentiment", th: "อารมณ์รวม", zh: "情绪" })}</span>
            <select
              value={form.sentiment}
              onChange={event => setForm(current => ({ ...current, sentiment: event.target.value as SignalSentiment }))}
            >
              {SENTIMENT_OPTIONS.map(option => (
                <option key={option} value={option}>
                  {SENTIMENT_LABELS[locale][option]}
                </option>
              ))}
            </select>
          </label>

          <label className="trend-field">
            <span>{translate(locale, { en: "Themes", th: "ประเด็น", zh: "主题" })}</span>
            <input
              value={form.themes}
              onChange={event => setForm(current => ({ ...current, themes: event.target.value }))}
              placeholder={translate(locale, {
                en: "mobility, trust, service delivery",
                th: "การเดินทาง, ความไว้วางใจ, การให้บริการ",
                zh: "交通、信任、服务交付",
              })}
            />
          </label>

          <label className="trend-field">
            <span>{translate(locale, { en: "Signal text", th: "ข้อความสัญญาณ", zh: "信号内容" })}</span>
            <textarea
              value={form.text}
              onChange={event => setForm(current => ({ ...current, text: event.target.value }))}
              placeholder={translate(locale, {
                en: "What did people say, ask for, or complain about?",
                th: "คนพูดอะไร ขออะไร หรือบ่นอะไร",
                zh: "人们说了什么、需要什么、抱怨什么？",
              })}
              rows={5}
              required
            />
          </label>

          <button type="submit" className="trend-submit" disabled={saving || !form.text.trim() || !form.source.trim()}>
            {submitLabel}
          </button>

          {feedback && <p className="trend-feedback">{feedback}</p>}
        </form>
      </div>
    </section>
  );
}
