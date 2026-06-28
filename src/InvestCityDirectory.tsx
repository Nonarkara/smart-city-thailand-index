// ---------------------------------------------------------------------------
// Invest City Directory — data-driven investor value propositions for every city
// ---------------------------------------------------------------------------

import { useMemo, useState } from "react";
import { allCities } from "./cityData.ts";
import { getInvestorPitchForLocale } from "./cityInvestorPitch.ts";
import { translate } from "./cityPresentation";
import { TIER_LABELS } from "./types.ts";
import type { Locale, SmartCity } from "./types.ts";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type FilterTier = "all" | "alpha" | "beta" | "gamma";
type FilterRegion = "all" | SmartCity["region"];
type SortBy = "score" | "investability" | "name";

const REGION_LABELS: Record<SmartCity["region"] | "all", Record<Locale, string>> = {
  all: { en: "All regions", th: "ทุกภาค", zh: "所有地区" },
  north: { en: "North", th: "ภาคเหนือ", zh: "北部" },
  northeast: { en: "Northeast", th: "ภาคตะวันออกเฉียงเหนือ", zh: "东北部" },
  central: { en: "Central", th: "ภาคกลาง", zh: "中部" },
  east: { en: "East / EEC", th: "ภาคตะวันออก / EEC", zh: "东部 / EEC" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
  bangkok: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
};

const TIER_FILTERS: FilterTier[] = ["all", "alpha", "beta", "gamma"];
const REGION_FILTERS: FilterRegion[] = ["all", "bangkok", "central", "east", "north", "northeast", "south"];

// ponytail: hardcoded — these are the cities with the richest curated context
const SPOTLIGHT_IDS = ["nakhon-si-thammarat", "phuket", "samyan", "chiang-mai-old-town"];

function tierColor(tier: SmartCity["tier"]): string {
  return tier === "alpha" ? "var(--teal)" : tier === "beta" ? "var(--gold)" : "var(--3)";
}

function tierBg(tier: SmartCity["tier"]): string {
  return tier === "alpha" ? "var(--teal-glow)" : tier === "beta" ? "rgba(217, 119, 6, .1)" : "rgba(113, 113, 122, .1)";
}

export default function InvestCityDirectory({ locale, onNavigate }: Props) {
  const [tierFilter, setTierFilter] = useState<FilterTier>("all");
  const [regionFilter, setRegionFilter] = useState<FilterRegion>("all");
  const [sortBy, setSortBy] = useState<SortBy>("score");

  const spotlight = useMemo(
    () => SPOTLIGHT_IDS.flatMap(id => allCities.filter(c => c.id === id)),
    [],
  );

  const filtered = useMemo(() => {
    let list = allCities.filter(c => {
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (regionFilter !== "all" && c.region !== regionFilter) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return locale === "th" ? a.nameTh.localeCompare(b.nameTh) : a.nameEn.localeCompare(b.nameEn);
      if (sortBy === "investability") {
        const pa = getInvestorPitchForLocale(a, locale);
        const pb = getInvestorPitchForLocale(b, locale);
        return (pb.tags?.length ?? 0) - (pa.tags?.length ?? 0) || b.compositeScore - a.compositeScore;
      }
      return b.compositeScore - a.compositeScore;
    });

    return list;
  }, [tierFilter, regionFilter, sortBy, locale]);

  const controlsLabel = {
    en: "Filter & sort",
    th: "กรองและเรียงลำดับ",
    zh: "筛选与排序",
  };

  const sortOptions: Record<SortBy, Record<Locale, string>> = {
    score: { en: "SCITI score", th: "คะแนน SCITI", zh: "SCITI评分" },
    investability: { en: "Investability", th: "ความน่าลงทุน", zh: "投资吸引力" },
    name: { en: "Name", th: "ชื่อ", zh: "名称" },
  };

  const countLabel = {
    en: `${filtered.length} cities`,
    th: `${filtered.length} เมือง`,
    zh: `${filtered.length} 座城市`,
  };

  return (
    <section className="section reveal visible">
      <p className="eyebrow">{translate(locale, { en: "Investment Atlas", th: "แอตลาสการลงทุน", zh: "投资图谱" })}</p>
      <h2>{translate(locale, {
        en: "Every City, One Investment Story",
        th: "ทุกเมือง เรื่องราวการลงทุนหนึ่งเรื่อง",
        zh: "每座城市，一个投资故事",
      })}</h2>
      <p className="section-intro">
        {translate(locale, {
          en: "SCITI turns each city's data into a precise, comparable value proposition. Pick a tier and region to find where your capital fits.",
          th: "SCITI แปลงข้อมูลของแต่ละเมืองเป็นข้อเสนอคุณค่าที่แม่นยำและเปรียบเทียบได้ เลือกระดับและภาคเพื่อหาว่าทุนของคุณเหมาะกับที่ไหน",
          zh: "SCITI将每座城市的数据转化为精确、可比较的价值主张。选择层级和地区，找到您的资本适合哪里。",
        })}
      </p>

      {/* Spotlight — curated cities with richest context */}
      <div style={{ marginTop: "1.5rem", marginBottom: ".5rem" }}>
        <span style={{
          font: "600 var(--text-micro) var(--mono)",
          color: "var(--3)",
          textTransform: "uppercase",
          letterSpacing: ".08em",
        }}>
          {translate(locale, { en: "Featured", th: "เมืองเด่น", zh: "精选城市" })}
        </span>
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1rem",
        marginBottom: "2rem",
        paddingBottom: "2rem",
        borderBottom: "1px solid var(--5)",
      }}>
        {spotlight.map(city => (
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} featured />
        ))}
      </div>

      {/* Controls */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: ".75rem",
        alignItems: "center",
        marginTop: "1.25rem",
        marginBottom: "1.25rem",
        padding: "1rem",
        border: "1px solid var(--5)",
        background: "var(--surface)",
      }}>
        <span style={{ font: "600 var(--text-micro) var(--mono)", color: "var(--3)", textTransform: "uppercase", letterSpacing: ".06em" }}>
          {translate(locale, controlsLabel)}
        </span>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {TIER_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              style={{
                font: "500 var(--text-micro) var(--font)",
                padding: "0 .65rem",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${tierFilter === t ? "var(--ink)" : "var(--4)"}`,
                background: tierFilter === t ? "var(--ink)" : "var(--paper)",
                color: tierFilter === t ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
              }}
            >
              {t === "all" ? translate(locale, { en: "All tiers", th: "ทุกระดับ", zh: "所有层级" }) : TIER_LABELS[locale][t]}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {REGION_FILTERS.map(r => (
            <button
              key={r}
              onClick={() => setRegionFilter(r)}
              style={{
                font: "500 var(--text-micro) var(--font)",
                padding: "0 .65rem",
                minHeight: "44px",
                display: "inline-flex",
                alignItems: "center",
                border: `1px solid ${regionFilter === r ? "var(--ink)" : "var(--4)"}`,
                background: regionFilter === r ? "var(--ink)" : "var(--paper)",
                color: regionFilter === r ? "var(--paper)" : "var(--ink)",
                cursor: "pointer",
              }}
            >
              {translate(locale, REGION_LABELS[r])}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          style={{
            font: "500 var(--text-micro) var(--font)",
            padding: "0 .5rem",
            minHeight: "44px",
            border: "1px solid var(--4)",
            background: "var(--paper)",
            color: "var(--ink)",
          }}
        >
          {(["score", "investability", "name"] as SortBy[]).map(s => (
            <option key={s} value={s}>{translate(locale, sortOptions[s])}</option>
          ))}
        </select>

        <span style={{ marginLeft: "auto", font: "500 var(--text-micro) var(--mono)", color: "var(--3)" }}>
          {translate(locale, countLabel)}
        </span>
      </div>

      {/* Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        gap: "1rem",
      }}>
        {filtered.map(city => (
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
}

function CityCard({ city, locale, onNavigate, featured }: { city: SmartCity; locale: Locale; onNavigate: (path: string) => void; featured?: boolean }) {
  const pitch = useMemo(() => getInvestorPitchForLocale(city, locale), [city, locale]);

  return (
    <div className="glass-card shadow-premium" style={{
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: ".65rem",
      ...(featured ? { borderTop: "2px solid var(--teal)" } : {}),
    }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".35rem", flexWrap: "wrap" }}>
          <span style={{
            font: "700 var(--text-micro) var(--mono)",
            color: tierColor(city.tier),
            padding: ".12rem .4rem",
            background: tierBg(city.tier),
            letterSpacing: ".08em",
            textTransform: "uppercase",
          }}>
            {TIER_LABELS[locale][city.tier]}
          </span>
          <span style={{
            font: "700 var(--text-micro) var(--mono)",
            color: "var(--teal)",
            padding: ".12rem .4rem",
            background: "var(--teal-glow)",
            letterSpacing: ".06em",
          }}>
            {pitch.investabilityLabel}
          </span>
          {pitch.tags.slice(0, 2).map(tag => (
            <span key={tag} style={{
              font: "500 var(--text-micro) var(--mono)",
              color: "var(--3)",
              padding: ".12rem .35rem",
              border: "1px solid var(--4)",
            }}>
              {tag}
            </span>
          ))}
        </div>
        <h3 style={{ font: "800 var(--text-body) var(--font-heading)", letterSpacing: "-.02em", lineHeight: 1.2, marginBottom: ".15rem" }}>
          {locale === "th" ? city.nameTh : city.nameEn}
        </h3>
        <p style={{ font: "500 var(--text-micro) var(--font)", color: "var(--3)", margin: 0 }}>
          {city.provinceTh && locale === "th" ? city.provinceTh : city.province}
          {city.compositeScore ? ` · SCITI ${city.compositeScore.toFixed(1)}` : ""}
        </p>
      </div>

      {/* Pitch */}
      <p style={{ font: "600 var(--text-body) var(--font)", color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
        {pitch.headline}
      </p>
      <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.6, margin: 0 }}>
        {pitch.whyLook}
      </p>

      <div style={{ borderTop: "1px solid var(--5)", paddingTop: ".6rem", marginTop: ".2rem" }}>
        <p style={{ font: "500 var(--text-body) var(--font)", color: "var(--teal)", margin: 0, lineHeight: 1.5 }}>
          {pitch.competitiveEdge}
        </p>
      </div>

      <div>
        <span style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--gold-ink)", textTransform: "uppercase", letterSpacing: ".08em" }}>
          {translate(locale, { en: "Opportunity", th: "โอกาส", zh: "机遇" })}
        </span>
        <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.6, margin: ".15rem 0 0" }}>
          {pitch.opportunity}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
        <div>
          <span style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--3)", textTransform: "uppercase", letterSpacing: ".08em" }}>
            {translate(locale, { en: "Right for", th: "เหมาะกับ", zh: "适合" })}
          </span>
          <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.55, margin: ".15rem 0 0" }}>
            {pitch.idealInvestor}
          </p>
        </div>
        <div>
          <span style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--3)", textTransform: "uppercase", letterSpacing: ".08em" }}>
            {translate(locale, { en: "Risk", th: "ความเสี่ยง", zh: "风险" })}
          </span>
          <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.55, margin: ".15rem 0 0" }}>
            {pitch.riskNote}
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--5)", paddingTop: ".6rem", marginTop: "auto" }}>
        <span style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--ink)", textTransform: "uppercase", letterSpacing: ".08em" }}>
          {translate(locale, { en: "Next step", th: "ขั้นตอนถัดไป", zh: "下一步" })}
        </span>
        <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.6, margin: ".15rem 0 0" }}>
          {pitch.nextStep}
        </p>
      </div>

      <button
        className="ghost-button"
        onClick={() => onNavigate(`/city/${city.id}`)}
        style={{ alignSelf: "flex-start", marginTop: ".5rem" }}
      >
        {translate(locale, { en: "Open city dossier →", th: "เปิดแฟ้มเมือง →", zh: "打开城市档案 →" })}
      </button>
    </div>
  );
}
