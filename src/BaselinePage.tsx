import { useMemo, useState } from "react";
import { allCities } from "./cityData";
import {
  deriveAll,
  DEPA_DIMENSION_ORDER,
  DIMENSION_LABELS,
  DIMENSION_WEIGHTS,
  publishedIndicators,
  type CityDerivation,
} from "./dimensionScores";
import { buildFacets, type FacetDef } from "./baselineFacets";
import { BASELINE_COVERAGE, SOURCE_REGISTRY } from "./baselineSources";
import { getCityName, getProvinceName } from "./cityPresentation";
import { toAppPath } from "./routing";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type Copy = { en: string; th: string; zh: string };

const t = (locale: Locale, c: Copy) => (locale === "th" ? c.th : locale === "zh" ? c.zh : c.en);

/**
 * A threshold is a one-sided filter on a real indicator, with its value
 * written out. A city official asks "which provinces have drinking water
 * above 90%" — not "give me a slider in 0.1 increments". The thresholds are
 * derived from the real distribution so every option is meaningful.
 */
interface Threshold {
  id: string;
  facetId: string;
  op: ">=" | "<=";
  value: number;
  label: Copy;
}

/** Build sensible thresholds per facet from its actual spread. */
function buildThresholds(facet: FacetDef): Threshold[] {
  const span = facet.max - facet.min;
  if (span <= 0) return [];
  const mk = (op: ">=" | "<=", value: number, label: Copy): Threshold => ({
    id: `${facet.id}:${op}:${value}`,
    facetId: facet.id,
    op,
    value,
    label,
  });

  // A threshold that cannot match a single value in the facet's real range
  // is a dead end: picking it would show an empty table and look like the
  // data is missing. Only thresholds the data can actually satisfy are
  // offered.
  const keep = (th: Threshold) =>
    th.op === ">=" ? facet.max >= th.value : facet.min <= th.value;

  if (facet.unit === "%") {
    return [
      mk(">=", 90, { en: "90% or more", th: "90% ขึ้นไป", zh: "90% 以上" }),
      mk(">=", 75, { en: "75% or more", th: "75% ขึ้นไป", zh: "75% 以上" }),
      mk("<=", 50, { en: "50% or less", th: "50% หรือน้อยกว่า", zh: "50% 或以下" }),
    ].filter(keep);
  }
  if (facet.unit === "per 100k") {
    return [
      mk("<=", 10, { en: "10 or fewer", th: "ไม่เกิน 10", zh: "不超过 10" }),
      mk("<=", 20, { en: "20 or fewer", th: "ไม่เกิน 20", zh: "不超过 20" }),
    ].filter(keep);
  }
  if (facet.unit === "µg/m³") {
    return [
      mk("<=", 20, { en: "20 µg/m³ or less", th: "ไม่เกิน 20 µg/m³", zh: "不超过 20 µg/m³" }),
      mk("<=", 35, { en: "35 µg/m³ or less", th: "ไม่เกิน 35 µg/m³", zh: "不超过 35 µg/m³" }),
    ].filter(keep);
  }
  return [
    mk(">=", Math.round(facet.min + span * 0.66), {
      en: `Top third (≥ ${Math.round(facet.min + span * 0.66)})`,
      th: `หนึ่งในสามบน (≥ ${Math.round(facet.min + span * 0.66)})`,
      zh: `前三分之一 (≥ ${Math.round(facet.min + span * 0.66)})`,
    }),
    mk("<=", Math.round(facet.min + span * 0.33), {
      en: `Bottom third (≤ ${Math.round(facet.min + span * 0.33)})`,
      th: `หนึ่งในสามล่าง (≤ ${Math.round(facet.min + span * 0.33)})`,
      zh: `后三分之一 (≤ ${Math.round(facet.min + span * 0.33)})`,
    }),
  ].filter(keep);
}

export default function BaselinePage({ locale, onNavigate }: Props) {
  const cities = allCities;
  const derivations = useMemo(() => deriveAll(cities), [cities]);
  const facets = useMemo(() => buildFacets(cities), [cities]);
  const indicators = useMemo(() => publishedIndicators(), []);

  const [query, setQuery] = useState("");
  const [picks, setPicks] = useState<Record<string, string>>({});

  const thresholds = useMemo(() => {
    const map = new Map<string, Threshold>();
    for (const f of facets) for (const th of buildThresholds(f)) map.set(th.id, th);
    return map;
  }, [facets]);

  /** Only facets that actually have data in this cohort are offered. */
  const usableFacets = useMemo(() => facets.filter(f => f.coverage > 0 && buildThresholds(f).length > 0), [facets]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = cities.map(c => {
      const d = derivations.get(c.id)!;
      const city = c;
      // Apply each picked threshold. A city with no value for a filtered
      // indicator does NOT pass — absence is not a pass.
      let passes = true;
      for (const [facetId, thresholdId] of Object.entries(picks)) {
        const th = thresholds.get(thresholdId);
        if (!th) continue;
        const facet = facets.find(f => f.id === facetId);
        if (!facet) continue;
        const v = facet.value(city);
        if (v == null) { passes = false; break; }
        if (th.op === ">=" && v < th.value) { passes = false; break; }
        if (th.op === "<=" && v > th.value) { passes = false; break; }
      }
      if (passes && q) {
        const hay = `${getCityName(city, locale)} ${getProvinceName(city, locale)}`.toLowerCase();
        if (!hay.includes(q)) passes = false;
      }
      return { city, d, passes };
    });
    return list;
  }, [cities, derivations, facets, picks, thresholds, query, locale]);

  const passing = rows.filter(r => r.passes);
  const scored = passing.filter(r => r.d.composite != null).sort((a, b) => b.d.composite! - a.d.composite!);
  const unscored = passing.filter(r => r.d.composite == null);

  const activeCount = Object.keys(picks).length + (query.trim() ? 1 : 0);
  const maxDimension = Math.max(...DEPA_DIMENSION_ORDER.map(d => DIMENSION_WEIGHTS[d]));

  return (
    <>
      {/* ─── MASTHEAD ─────────────────────────────────────────────────── */}
      <section className="baseline-masthead">
        <div className="section">
          <p className="eyebrow">
            {t(locale, { en: "Baseline", th: "ข้อมูลพื้นฐาน", zh: "基线" })}
          </p>
          <h1 className="hero-title">
            {t(locale, {
              en: "Seven dimensions, measured from source",
              th: "เจ็ดมิติ วัดจากข้อมูลต้นทาง",
              zh: "七大维度，取自源头数据",
            })}
          </h1>
          <p className="hero-strapline">
            {t(locale, {
              en: `depa's seven smart-city dimensions, scored for ${scored.length} of ${cities.length} cities from data that already exists. Every score is computed from a named source — none is typed in.`,
              th: `มิติเมืองอัจฉริยะ 7 ด้านของ depa คิดคะแนนให้ ${scored.length} จาก ${cities.length} เมือง จากข้อมูลที่มีอยู่แล้ว ทุกคะแนนคำนวณจากแหล่งข้อมูลที่ระบุชื่อ ไม่มีการใส่คะแนนด้วยมือ`,
              zh: `depa 的七大智慧城市维度，基于既有数据为 ${cities.length} 座城市中的 ${scored.length} 座评分。每个分数都由具名来源计算得出，没有一个是手工填写的。`,
            })}
          </p>

          {/* The seven dimensions, as a strip. Weight is the bar length;
              a hatched cell means the dimension has no baseline yet. */}
          <div className="baseline-dims" role="list">
            {DEPA_DIMENSION_ORDER.map(dim => {
              const coverage = BASELINE_COVERAGE[dim];
              const has = coverage.strength !== "none";
              return (
                <div
                  key={dim}
                  role="listitem"
                  className={`baseline-dim${has ? "" : " is-missing"}`}
                >
                  <span className="baseline-dim-label">{DIMENSION_LABELS[dim][locale]}</span>
                  <span className="baseline-dim-weight">
                    <span
                      className="baseline-dim-bar"
                      style={{ width: `${(DIMENSION_WEIGHTS[dim] / maxDimension) * 100}%` }}
                    />
                    <span className="baseline-dim-weight-num">{DIMENSION_WEIGHTS[dim]}</span>
                  </span>
                  <span className="baseline-dim-state">
                    {has
                      ? t(locale, { en: coverage.strength === "strong" ? "measured" : "partial", th: coverage.strength === "strong" ? "วัดได้" : "วัดได้บางส่วน", zh: coverage.strength === "strong" ? "已测量" : "部分可测" })
                      : t(locale, { en: "no baseline", th: "ยังไม่มีข้อมูล", zh: "尚无基线" })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── THE GAP, STATED ──────────────────────────────────────────── */}
      <section className="baseline-gap">
        <div className="section baseline-gap-inner">
          <p className="eyebrow">
            {t(locale, { en: "What is missing", th: "สิ่งที่ยังขาด", zh: "尚缺的部分" })}
          </p>
          <h2 className="baseline-gap-title">
            {t(locale, {
              en: "Two dimensions have no baseline yet",
              th: "สองมิติที่ยังไม่มีข้อมูลพื้นฐาน",
              zh: "两个维度尚无基线",
            })}
          </h2>
          <p className="baseline-gap-lede">
            {t(locale, {
              en: "No province-level national source was verified for these. Rather than score them by judgement, SCITI publishes them empty, with the negotiation in progress. The composite therefore covers at most 85% of the published weight — and says so.",
              th: "ยังไม่มีแหล่งข้อมูลระดับจังหวัดที่ยืนยันได้สำหรับสองมิตินี้ SCITI จึงเผยแพร่เป็นค่าว่าง พร้อมความคืบหน้าการเจรจาข้อมูล แทนที่จะให้คะแนนด้วยการตัดสินใจ คะแนนรวมจึงครอบคลุมน้ำหนักที่ประกาศไว้ได้มากที่สุด 85%",
              zh: "这两个维度尚未核实到省级全国数据源。SCITI 不以主观判断评分，而是将其公开为空，并持续推进数据谈判。因此综合分最多覆盖已公布权重的 85%，并如实标注。",
            })}
          </p>
          <ul className="baseline-gap-list">
            {DEPA_DIMENSION_ORDER.filter(d => BASELINE_COVERAGE[d].strength === "none").map(dim => (
              <li key={dim} className="baseline-gap-item">
                <span className="baseline-gap-item-name">{DIMENSION_LABELS[dim][locale]}</span>
                <span className="baseline-gap-item-note">{BASELINE_COVERAGE[dim].note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── SEARCH ───────────────────────────────────────────────────── */}
      <section className="baseline-search">
        <div className="section">
          <div className="baseline-search-head">
            <label className="baseline-search-label" htmlFor="baseline-q">
              {t(locale, { en: "Find a city", th: "ค้นหาเมือง", zh: "查找城市" })}
            </label>
            <input
              id="baseline-q"
              className="baseline-search-input"
              type="search"
              placeholder={t(locale, { en: "City or province", th: "ชื่อเมืองหรือจังหวัด", zh: "城市或省份" })}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          <div className="baseline-facets" role="group" aria-label={t(locale, { en: "Filter by indicator", th: "กรองตามตัวชี้วัด", zh: "按指标筛选" })}>
            {usableFacets.map(facet => (
              <div key={facet.id} className="baseline-facet">
                <label className="baseline-facet-label" htmlFor={`facet-${facet.id}`}>
                  {facet.label[locale]}
                  <span className="baseline-facet-unit">{facet.unit}</span>
                </label>
                <select
                  id={`facet-${facet.id}`}
                  className="baseline-facet-select"
                  value={picks[facet.id] ?? ""}
                  onChange={e => {
                    const next = { ...picks };
                    if (e.target.value) next[facet.id] = e.target.value;
                    else delete next[facet.id];
                    setPicks(next);
                  }}
                >
                  <option value="">
                    {t(locale, { en: "Any", th: "ทั้งหมด", zh: "全部" })}
                  </option>
                  {buildThresholds(facet).map(th => (
                    <option key={th.id} value={th.id}>{th.label[locale]}</option>
                  ))}
                </select>
                <span className="baseline-facet-source">
                  {t(locale, { en: `${facet.source[locale]} · ${facet.vintage}`, th: `${facet.source[locale]} · ${facet.vintage}`, zh: `${facet.source[locale]} · ${facet.vintage}` })}
                </span>
              </div>
            ))}
          </div>

          <p className="baseline-count">
            {t(locale, {
              en: `${scored.length} of ${cities.length} cities shown${activeCount ? ` · ${activeCount} filter${activeCount > 1 ? "s" : ""} applied` : ""}`,
              th: `แสดง ${scored.length} จาก ${cities.length} เมือง${activeCount ? ` · ใช้ตัวกรอง ${activeCount} รายการ` : ""}`,
              zh: `显示 ${cities.length} 座城市中的 ${scored.length} 座${activeCount ? ` · 已应用 ${activeCount} 个筛选` : ""}`,
            })}
          </p>
        </div>
      </section>

      {/* ─── THE TABLE ────────────────────────────────────────────────── */}
      <section className="baseline-table-section">
        <div className="section">
          <div className="baseline-table-header" aria-hidden="true">
            <span className="baseline-th-rank">#</span>
            <span className="baseline-th-city">{t(locale, { en: "City / Province", th: "เมือง / จังหวัด", zh: "城市 / 省份" })}</span>
            <span className="baseline-th-dims">{t(locale, { en: "7 Smart Dimensions (Env · Mob · Liv · Peo · Eng · Eco · Gov)", th: "7 มิติอัจฉริยะ (สิ่งแวดล้อม · เดินทาง · อยู่ดี · พลเมือง · พลังงาน · เศรษฐกิจ · รัฐ)", zh: "7 大维度 (环境 · 出行 · 宜居 · 人才 · 能源 · 经济 · 治理)" })}</span>
            <span className="baseline-th-score">{t(locale, { en: "Score · Cover", th: "คะแนน · ครอบคลุม", zh: "得分 · 覆盖" })}</span>
          </div>
          <ol className="baseline-table">
            {scored.map((row, idx) => (
              <BaselineRow key={row.city.id} index={idx + 1} row={row} locale={locale} onNavigate={onNavigate} />
            ))}
          </ol>

          {unscored.length > 0 && (
            <>
              <p className="baseline-unmeasured-head">
                {t(locale, {
                  en: `${unscored.length} cities could not be measured`,
                  th: `${unscored.length} เมืองไม่สามารถวัดได้`,
                  zh: `${unscored.length} 座城市无法测量`,
                })}
              </p>
              <ol className="baseline-table is-unmeasured">
                {unscored.map(row => (
                  <li key={row.city.id} className="baseline-row is-unmeasured">
                    <span className="baseline-row-city">
                      {getCityName(row.city, locale)}
                      <span className="baseline-row-province">{getProvinceName(row.city, locale)}</span>
                    </span>
                    <span className="baseline-row-nodata">
                      {t(locale, { en: "no data", th: "ไม่มีข้อมูล", zh: "无数据" })}
                    </span>
                  </li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>

      {/* ─── SOURCES ──────────────────────────────────────────────────── */}
      <section className="baseline-sources">
        <div className="section">
          <p className="eyebrow">
            {t(locale, { en: "Sources", th: "แหล่งข้อมูล", zh: "数据来源" })}
          </p>
          <h2 className="baseline-sources-title">
            {t(locale, {
              en: `${SOURCE_REGISTRY.length} verified sources, ${indicators.length} scored indicators`,
              th: `${SOURCE_REGISTRY.length} แหล่งข้อมูลที่ยืนยันแล้ว ${indicators.length} ตัวชี้วัดที่ให้คะแนน`,
              zh: `${SOURCE_REGISTRY.length} 个已核实来源，${indicators.length} 个计分指标`,
            })}
          </h2>
          <ul className="baseline-source-list">
            {SOURCE_REGISTRY.map(s => (
              <li key={s.id} className="baseline-source">
                <a className="baseline-source-name" href={s.url} target="_blank" rel="noreferrer">
                  {s.publisher}
                </a>
                <span className="baseline-source-title">{s.title}</span>
                <span className="baseline-source-status" data-status={s.verified}>{s.verified}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function BaselineRow({
  index, row, locale, onNavigate,
}: {
  index: number;
  row: { city: typeof allCities[number]; d: CityDerivation };
  locale: Locale;
  onNavigate: (path: string) => void;
}) {
  const { city, d } = row;
  const path = `/city/${city.id}`;
  return (
    <li className="baseline-row">
      <a
        className="baseline-row-link"
        href={toAppPath(path)}
        onClick={e => { e.preventDefault(); onNavigate(path); }}
      >
        <span className="baseline-row-rank">{String(index).padStart(2, "0")}</span>
        <span className="baseline-row-city">
          {getCityName(city, locale)}
          <span className="baseline-row-province">{getProvinceName(city, locale)}</span>
        </span>
        <span className="baseline-row-dims">
          {DEPA_DIMENSION_ORDER.map(dim => {
            const s = d.dimensions[dim].score;
            return (
              <span
                key={dim}
                className={`baseline-row-dim${s == null ? " is-missing" : ""}`}
                title={DIMENSION_LABELS[dim][locale]}
              >
                {s == null ? "—" : Math.round(s)}
              </span>
            );
          })}
        </span>
        <span className="baseline-row-score">
          {d.composite}
          <span className="baseline-row-coverage" title={t(locale, { en: "share of published weight covered", th: "สัดส่วนน้ำหนักที่วัดได้", zh: "已覆盖权重比例" })}>
            {Math.round(d.weightCoverage * 100)}%
          </span>
        </span>
      </a>
    </li>
  );
}
