// ---------------------------------------------------------------------------
// Invest City Directory — data-driven investor value propositions for every city
// ---------------------------------------------------------------------------

import { useMemo, useRef, useState } from "react";
import { allCities } from "./cityData.ts";
import { getInvestorPitchForLocale } from "./cityInvestorPitch.ts";
import { getCityName, getDistinctProvinceName, getProvinceName, translate } from "./cityPresentation";
import { NongPlubMiniBadge } from "./NongPlubCard";
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
  east: { en: "East", th: "ภาคตะวันออก", zh: "东部" },
  south: { en: "South", th: "ภาคใต้", zh: "南部" },
  bangkok: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
};

const TIER_FILTERS: FilterTier[] = ["all", "alpha", "beta", "gamma"];
const REGION_FILTERS: FilterRegion[] = ["all", "bangkok", "central", "east", "north", "northeast", "south"];

// ponytail: hardcoded — these are the cities with the richest curated context
const PAGE_SIZE = 12;
const SPOTLIGHT_IDS = ["nakhon-si-thammarat", "phuket", "samyan", "chiang-mai-old-town"];

function tierColor(tier: SmartCity["tier"]): string {
  return tier === "alpha" ? "var(--teal)" : tier === "beta" ? "var(--beta-text)" : "var(--3)";
}

function tierBg(tier: SmartCity["tier"]): string {
  return tier === "alpha" ? "var(--teal-glow)" : tier === "beta" ? "rgba(217, 119, 6, .1)" : "rgba(113, 113, 122, .1)";
}

export default function InvestCityDirectory({ locale, onNavigate }: Props) {
  const [tierFilter, setTierFilter] = useState<FilterTier>("all");
  const [regionFilter, setRegionFilter] = useState<FilterRegion>("all");
  const [sortBy, setSortBy] = useState<SortBy>("score");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const resultsRef = useRef<HTMLHeadingElement>(null);

  const spotlight = useMemo(
    () => SPOTLIGHT_IDS.flatMap(id => allCities.filter(c => c.id === id)),
    [],
  );

  const filtered = useMemo(() => {
    let list = allCities.filter(c => {
      if (tierFilter !== "all" && c.tier !== tierFilter) return false;
      if (regionFilter !== "all" && c.region !== regionFilter) return false;
      const needle = query.normalize("NFKC").trim().toLowerCase();
      return !needle || [c.id, c.nameEn, c.nameTh, ...(["en", "th", "zh"] as Locale[]).flatMap(language => [getCityName(c, language), getProvinceName(c, language)])]
        .some(value => value.normalize("NFKC").toLowerCase().includes(needle));
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "name") return getCityName(a, locale).localeCompare(getCityName(b, locale), locale);
      if (sortBy === "investability") {
        const pa = getInvestorPitchForLocale(a, locale);
        const pb = getInvestorPitchForLocale(b, locale);
        return (pb.tags?.length ?? 0) - (pa.tags?.length ?? 0) || b.compositeScore - a.compositeScore;
      }
      return b.compositeScore - a.compositeScore;
    });

    return list;
  }, [tierFilter, regionFilter, sortBy, locale, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount - 1);
  const shown = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);
  const changePage = (next: number) => {
    setPage(next);
    resultsRef.current?.scrollIntoView({ block: "start" });
    resultsRef.current?.focus({ preventScroll: true });
  };

  const controlsLabel = {
    en: "Filter & sort",
    th: "กรองและเรียงลำดับ",
    zh: "筛选与排序",
  };

  const sortOptions: Record<SortBy, Record<Locale, string>> = {
    score: { en: "SCITI score", th: "คะแนน SCITI", zh: "SCITI评分" },
    investability: { en: "Research tag count", th: "จำนวนป้ายงานวิจัย", zh: "研究标签数量" },
    name: { en: "Name", th: "ชื่อ", zh: "名称" },
  };

  const countLabel = {
    en: filtered.length ? `${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} of ${filtered.length} cities` : "No cities match",
    th: filtered.length ? `${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} จาก ${filtered.length} เมือง` : "ไม่พบเมืองที่ตรงกัน",
    zh: filtered.length ? `第 ${currentPage * PAGE_SIZE + 1}–${Math.min((currentPage + 1) * PAGE_SIZE, filtered.length)} 座，共 ${filtered.length} 座城市` : "没有匹配的城市",
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
          en: "These are curated research proposals, not verified financing offers or forecasts of returns. Project sizes and suggested instruments are indicative. Compare cities here, then verify local demand, operating evidence, costs, and eligibility with the responsible institution.",
          th: "นี่คือข้อเสนอจากงานวิจัยที่เรียบเรียงไว้ ไม่ใช่ข้อเสนอเงินทุนที่ยืนยันแล้วหรือการพยากรณ์ผลตอบแทน ขนาดโครงการและเครื่องมือที่แนะนำเป็นเพียงแนวทาง ใช้เทียบเมือง แล้วตรวจอุปสงค์ หลักฐานการดำเนินงาน ต้นทุน และสิทธิกับหน่วยงานที่รับผิดชอบ",
          zh: "这些是编辑整理的研究设想，并非经核实的融资要约或回报预测。项目规模及建议工具仅供参考。比较城市后，请向负责机构核查当地需求、运营证据、成本和资格。",
        })}
      </p>

      {/* The directory task comes before optional long-form featured reading. */}
      <div className="investment-atlas-controls" role="group" aria-label={translate(locale, controlsLabel)} style={{ display: "flex", flexWrap: "wrap", gap: ".5rem .75rem", alignItems: "end", marginBlock: "1rem" }}>
        <label style={{ flexBasis: "100%", display: "grid", gap: ".25rem" }}>
          {translate(locale, { en: "Search city or province", th: "ค้นหาเมืองหรือจังหวัด", zh: "搜索城市或府" })}
          <input type="search" value={query} onChange={event => { setQuery(event.target.value); setPage(0); }} style={{ minHeight: "44px", width: "100%", maxWidth: "32rem", padding: "0 .5rem", font: "400 var(--text-body) var(--font)", border: "1px solid var(--4)", background: "var(--paper)", color: "var(--ink)" }} />
        </label>
        <label style={{ display: "grid", gap: ".25rem" }}>
          {translate(locale, { en: "Tier", th: "ระดับ", zh: "层级" })}
          <select aria-label={translate(locale, { en: "Tier", th: "ระดับ", zh: "层级" })} value={tierFilter} onChange={event => { setTierFilter(event.target.value as FilterTier); setPage(0); }} style={{ minHeight: "44px", maxWidth: "100%", font: "400 var(--text-body) var(--font)", background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--4)" }}>
            {TIER_FILTERS.map(tier => <option key={tier} value={tier}>{tier === "all" ? translate(locale, { en: "All tiers", th: "ทุกระดับ", zh: "所有层级" }) : TIER_LABELS[locale][tier]}</option>)}
          </select>
        </label>
        <label style={{ display: "grid", gap: ".25rem" }}>
          {translate(locale, { en: "Region", th: "ภูมิภาค", zh: "地区" })}
          <select aria-label={translate(locale, { en: "Region", th: "ภูมิภาค", zh: "地区" })} value={regionFilter} onChange={event => { setRegionFilter(event.target.value as FilterRegion); setPage(0); }} style={{ minHeight: "44px", maxWidth: "100%", font: "400 var(--text-body) var(--font)", background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--4)" }}>
            {REGION_FILTERS.map(region => <option key={region} value={region}>{translate(locale, REGION_LABELS[region])}</option>)}
          </select>
        </label>
        <label style={{ display: "grid", gap: ".25rem" }}>
          {translate(locale, { en: "Sort cities", th: "เรียงเมือง", zh: "城市排序" })}
          <select aria-label={translate(locale, { en: "Sort cities", th: "เรียงเมือง", zh: "城市排序" })} value={sortBy} onChange={event => { setSortBy(event.target.value as SortBy); setPage(0); }} style={{ minHeight: "44px", maxWidth: "100%", font: "400 var(--text-body) var(--font)", background: "var(--paper)", color: "var(--ink)", border: "1px solid var(--4)" }}>
            {(["score", "investability", "name"] as SortBy[]).map(sort => <option key={sort} value={sort}>{translate(locale, sortOptions[sort])}</option>)}
          </select>
        </label>
      </div>
      <h3 ref={resultsRef} tabIndex={-1} className="investment-atlas-count" style={{ scrollMarginTop: "80px", marginBlock: ".75rem" }} aria-live="polite">{translate(locale, countLabel)}</h3>

      {/* Cards */}
      <div className="investment-atlas-results" style={{
        display: "grid",
        alignItems: "start",
        /* min() lets the 320px floor collapse when the column is narrower
           than 320px. Without it a 320px phone got a 320px track inside a
           296px column and the card ran 14px past the viewport. */
        gridTemplateColumns: "repeat(auto-fit, minmax(min(320px, 100%), 1fr))",
        gap: "1rem",
      }}>
        {shown.map(city => (
          <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} />
        ))}
      </div>
      {filtered.length > PAGE_SIZE && <nav aria-label={translate(locale, { en: "Investment Atlas pages", th: "หน้าแอตลาสการลงทุน", zh: "投资图谱分页" })} style={{ display: "flex", gap: ".75rem", alignItems: "center", flexWrap: "wrap", marginBlock: "1rem" }}>
        <button type="button" className="ghost-button" disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}>{translate(locale, { en: "Previous cities", th: "เมืองก่อนหน้า", zh: "上一页城市" })}</button>
        <span>{translate(locale, { en: `Page ${currentPage + 1} of ${pageCount}`, th: `หน้า ${currentPage + 1} จาก ${pageCount}`, zh: `第 ${currentPage + 1} 页，共 ${pageCount} 页` })}</span>
        <button type="button" className="ghost-button" disabled={currentPage >= pageCount - 1} onClick={() => changePage(currentPage + 1)}>{translate(locale, { en: "Next cities", th: "เมืองถัดไป", zh: "下一页城市" })}</button>
      </nav>}
      {!filtered.length && <button type="button" className="ghost-button" onClick={() => { setQuery(""); setTierFilter("all"); setRegionFilter("all"); setPage(0); }}>{translate(locale, { en: "Clear search and filters", th: "ล้างคำค้นและตัวกรอง", zh: "清除搜索和筛选" })}</button>}
      <details className="investment-atlas-featured" style={{ marginTop: "1rem" }}>
        <summary style={{ minHeight: "44px", cursor: "pointer", paddingBlock: ".5rem" }}>{translate(locale, { en: "Featured research stories (4)", th: "เรื่องวิจัยคัดสรร (4 เมือง)", zh: "精选研究故事（4 座城市）" })}</summary>
        <div style={{ display: "grid", alignItems: "start", gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))", gap: "1rem" }}>
          {spotlight.map(city => <CityCard key={city.id} city={city} locale={locale} onNavigate={onNavigate} featured />)}
        </div>
      </details>
    </section>
  );
}

function CityCard({ city, locale, onNavigate, featured }: { city: SmartCity; locale: Locale; onNavigate: (path: string) => void; featured?: boolean }) {
  const pitch = useMemo(() => getInvestorPitchForLocale(city, locale), [city, locale]);
  const identityMeta = [getDistinctProvinceName(city, locale), city.compositeScore ? `SCITI ${city.compositeScore.toFixed(1)}` : null].filter(Boolean).join(" · ");
  const repeatedNamePrefix = [getCityName(city, locale), city.nameEn, city.nameTh]
    .flatMap(name => [" — ", " – ", ": ", "："].map(separator => `${name}${separator}`))
    .find(prefix => pitch.headline.startsWith(prefix));
  const headline = repeatedNamePrefix ? pitch.headline.slice(repeatedNamePrefix.length) : pitch.headline;

  // The full investment story is earned content and every word of it stays.
  // What changes is WHEN it is open. Open 118 times over, each card grew to
  // 966px and /invest ran to 54,618px — a wall of equal-weight blocks with
  // no reading order, which is the exact failure this section exists to
  // fix: finding the city where the capital fits. Optional featured reading
  // and each directory story remain available in named disclosures.
  const story = (
    <>
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
          {translate(locale, { en: "Proposal to investigate", th: "ข้อเสนอที่ควรศึกษาต่อ", zh: "待调查的设想" })}
        </span>
        <p style={{ font: "400 var(--text-body) var(--font)", color: "var(--2)", lineHeight: 1.6, margin: ".15rem 0 0" }}>
          {pitch.opportunity}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".5rem" }}>
        <div>
          <span style={{ font: "700 var(--text-micro) var(--mono)", color: "var(--3)", textTransform: "uppercase", letterSpacing: ".08em" }}>
            {translate(locale, { en: "Possible audience", th: "กลุ่มที่อาจสนใจ", zh: "潜在对象" })}
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
    </>
  );

  return (
    <div data-atlas-city-id={city.id} className="glass-card shadow-premium" style={{
      padding: "1.25rem",
      display: "flex",
      flexDirection: "column",
      gap: ".65rem",
      ...(featured ? { borderTop: "2px solid var(--teal)" } : {}),
    }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".35rem", flexWrap: "wrap", minWidth: 0 }}>
          {/* minWidth 0: a wrapping flex row still reports a single-line
              min-content (the sum of its chips), and that minimum was
              pushing the whole card 24px past its grid track on a 320px
              phone. With it removed the chips wrap instead. */}
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
          {getCityName(city, locale)}
        </h3>
        {identityMeta && <p style={{ font: "500 var(--text-micro) var(--font)", color: "var(--3)", margin: 0 }}>
          {identityMeta}
        </p>}
        <div style={{ marginTop: ".4rem" }}>
          <NongPlubMiniBadge city={city} locale={locale} onOpen={() => onNavigate(`/city/${city.id}`)} />
        </div>
      </div>

      {/* Pitch */}
      <p className="investment-atlas-headline" style={{ font: "600 var(--text-body) var(--font)", color: "var(--ink)", lineHeight: 1.5, margin: 0 }}>
        {headline}
      </p>
      {featured ? story : (
        <details className="city-story">
          <summary className="city-story-toggle">
            {translate(locale, { en: "Read the full story", th: "อ่านเรื่องราวฉบับเต็ม", zh: "阅读完整故事" })}
          </summary>
          <div className="city-story-body">{story}</div>
        </details>
      )}

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
