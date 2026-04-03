import { useMemo } from "react";
import { getCityById } from "./cityData";
import {
  CITY_PLANNING_DATASET_CSV,
  FINANCE_MECHANISMS,
  GLOBAL_MODELS,
  PLANNING_STEPS,
  RESOURCES,
  TOOLKITS,
  getCityActionRecommendations,
  getCityDataRails,
  getCityFinanceBlueprint,
  getCityDomainProxies,
  getCityPlanningDatasetRow,
  getCityPlanningProfile,
  getLocalizedPlanningStatus,
  getLocalizedRecommendationHorizon,
} from "./cityPlanning";
import {
  getCityName,
  getCityRealityLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { getEvidenceForCity, dataSources } from "./evidenceData";
import { generateSWOT } from "./swotAnalysis";
import { recommendInstruments, assessBankability, getASUSProject } from "./financialToolkit";
import { getRelevantCaseStudies, generateImprovementPlan, analyzeTierUpgrade } from "./commandCenter";
import type { Locale, ScoringPillar } from "./types";
import { getCompositeBreakdown, SCORING_PILLARS } from "./scoring";
import { PILLAR_LABELS, PILLAR_SHORT_LABELS, PILLAR_COLORS, TIER_LABELS, DIMENSION_LABELS, PILLAR_WEIGHTS } from "./types";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

/** RPG-style stat grade */
function statGrade(value: number): string {
  if (value >= 85) return "S";
  if (value >= 75) return "A";
  if (value >= 65) return "B";
  if (value >= 50) return "C";
  if (value >= 35) return "D";
  return "E";
}

function gradeColor(grade: string): string {
  if (grade === "S") return "#1E8C7F";
  if (grade === "A") return "#4A9E4A";
  if (grade === "B") return "#3058C9";
  if (grade === "C") return "#E8913A";
  if (grade === "D") return "#D94F4F";
  return "#9C9183";
}

/** RPG radar chart — pure SVG */
function RadarChart({ scores, locale }: { scores: Record<ScoringPillar, number>; locale: Locale }) {
  const cx = 140;
  const cy = 140;
  const maxR = 110;
  const pillars = SCORING_PILLARS;
  const n = pillars.length;

  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const r = (value / 100) * maxR;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };

  // Grid rings at 25, 50, 75, 100
  const rings = [25, 50, 75, 100];

  // Data polygon
  const dataPoints = pillars.map((p, i) => getPoint(i, scores[p]));
  const dataPath = dataPoints.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";

  return (
    <svg viewBox="0 0 280 280" className="radar-chart">
      {/* Grid rings */}
      {rings.map(r => {
        const pts = pillars.map((_, i) => getPoint(i, r));
        const path = pts.map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x},${pt.y}`).join(" ") + " Z";
        return <path key={r} d={path} fill="none" stroke="#E8E8EC" strokeWidth="0.5" opacity="0.5" />;
      })}

      {/* Axis lines */}
      {pillars.map((_, i) => {
        const pt = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={pt.x} y2={pt.y} stroke="#E8E8EC" strokeWidth="0.5" opacity="0.3" />;
      })}

      {/* Data fill */}
      <path d={dataPath} fill="rgba(43, 186, 160, 0.15)" stroke="#2BBAA0" strokeWidth="2" />

      {/* Data points */}
      {dataPoints.map((pt, i) => (
        <circle key={i} cx={pt.x} cy={pt.y} r="3.5" fill={PILLAR_COLORS[pillars[i]]} />
      ))}

      {/* Labels */}
      {pillars.map((p, i) => {
        const labelPt = getPoint(i, 125);
        return (
          <text
            key={p}
            x={labelPt.x}
            y={labelPt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            fill="#888"
          >
            {PILLAR_SHORT_LABELS[locale][p]}
          </text>
        );
      })}
    </svg>
  );
}

/** RPG horizontal stat bar */
function StatBar({ pillar, value, locale }: { pillar: ScoringPillar; value: number; locale: Locale }) {
  const grade = statGrade(value);
  const weight = PILLAR_WEIGHTS[pillar];

  return (
    <div className="rpg-stat-row">
      <div className="rpg-stat-color" style={{ background: PILLAR_COLORS[pillar] }} />
      <div className="rpg-stat-name">{PILLAR_LABELS[locale][pillar]}</div>
      <div className="rpg-stat-weight">{weight}%</div>
      <div className="rpg-stat-bar-track">
        <div
          className="rpg-stat-bar-fill"
          style={{ width: `${value}%`, background: PILLAR_COLORS[pillar] }}
        />
        {/* HP-style segmented marks at 25, 50, 75 */}
        <div className="rpg-stat-bar-mark" style={{ left: "25%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "50%" }} />
        <div className="rpg-stat-bar-mark" style={{ left: "75%" }} />
      </div>
      <div className="rpg-stat-value">{value}</div>
      <div className="rpg-stat-grade" style={{ color: gradeColor(grade) }}>{grade}</div>
    </div>
  );
}

/** Score decomposition — shows how composite was computed */
function ScoreBreakdown({
  scores,
  locale,
}: {
  scores: Record<ScoringPillar, number>;
  locale: Locale;
}) {
  const { composite, terms, totalWeight } = getCompositeBreakdown(scores);

  return (
    <div className="score-decomposition">
      <div className="decomp-header">
        <span className="decomp-title">
          {translate(locale, {
            en: "Score decomposition",
            th: "สมการคะแนน",
            zh: "得分拆解",
          })}
        </span>
        <span className="decomp-formula">Composite = Σ (score × weight) / Σ weights</span>
      </div>
      <div className="decomp-table">
        <div className="decomp-row decomp-row-header">
          <span>{translate(locale, { en: "Pillar", th: "เสาหลัก", zh: "支柱" })}</span>
          <span>{translate(locale, { en: "Score", th: "คะแนน", zh: "分数" })}</span>
          <span>{translate(locale, { en: "Weight", th: "น้ำหนัก", zh: "权重" })}</span>
          <span>{translate(locale, { en: "Contribution", th: "ผลต่อคะแนนรวม", zh: "贡献值" })}</span>
        </div>
        {terms.map(t => (
          <div key={t.pillar} className="decomp-row">
            <span className="decomp-pillar">
              <span className="decomp-dot" style={{ background: PILLAR_COLORS[t.pillar] }} />
              {PILLAR_LABELS[locale][t.pillar]}
            </span>
            <span className="decomp-num">{t.score}</span>
            <span className="decomp-num">{t.weight}%</span>
            <span className="decomp-num decomp-contribution">{t.contribution.toFixed(1)}</span>
          </div>
        ))}
        <div className="decomp-row decomp-row-total">
          <span>{translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}</span>
          <span />
          <span className="decomp-num">{totalWeight}%</span>
          <span className="decomp-num decomp-total-value">{composite.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

export default function CityDetailPage({ cityId, locale, onNavigate }: Props) {
  const city = useMemo(() => getCityById(cityId), [cityId]);
  const evidence = useMemo(() => getEvidenceForCity(cityId), [cityId]);
  const swot = useMemo(() => city ? generateSWOT(city, locale) : { strengths: [], weaknesses: [], opportunities: [], threats: [] }, [city, locale]);
  const finRecs = useMemo(() => city ? recommendInstruments(city) : [], [city]);
  const bankability = useMemo(() => city ? assessBankability(city) : null, [city]);
  const asusProject = useMemo(() => getASUSProject(cityId), [cityId]);
  const caseStudies = useMemo(() => city ? getRelevantCaseStudies(city, 4) : [], [city]);
  const improvementPlan = useMemo(() => city ? generateImprovementPlan(city) : [], [city]);
  const tierUpgrade = useMemo(() => city ? analyzeTierUpgrade(city) : null, [city]);
  const planningProfile = useMemo(() => getCityPlanningProfile(cityId), [cityId]);

  if (!city) {
    return (
      <section className="section" style={{ paddingTop: "7rem" }}>
        <h1>{translate(locale, { en: "City not found", th: "ไม่พบเมือง", zh: "未找到城市" })}</h1>
        <button
          className="cta-button"
          role="link"
          onClick={() => onNavigate("/")}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate("/"); } }}
        >
          {translate(locale, { en: "Back to home", th: "กลับหน้าหลัก", zh: "返回首页" })}
        </button>
      </section>
    );
  }

  const tierSymbol = city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ";
  const overallGrade = statGrade(city.compositeScore);
  const cityName = getCityName(city, locale);
  const provinceName = getProvinceName(city, locale);
  const cityTagline = getCityTagline(city, locale);
  const domainProxies = getCityDomainProxies(city);
  const actionRecommendations = getCityActionRecommendations(cityId);
  const financeBlueprint = getCityFinanceBlueprint(cityId);
  const dataRails = getCityDataRails(cityId);
  const dataRow = getCityPlanningDatasetRow(cityId);
  const planningCsvHref = `data:text/csv;charset=utf-8,${encodeURIComponent(CITY_PLANNING_DATASET_CSV)}`;

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section city-detail-hero">
        <button
          className="back-link"
          role="link"
          onClick={() => onNavigate("/rankings")}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onNavigate("/rankings"); } }}
        >
          ← {locale === "th" ? "กลับ" : locale === "zh" ? "返回" : "Back"}
        </button>

        <div className="city-detail-header">
          <div>
            <p className="eyebrow">
              {city.status === "certified"
                ? (locale === "th" ? `ตราสัญลักษณ์เมืองอัจฉริยะ · รุ่น ${city.batch}` : locale === "zh" ? `智慧城市认证 · 第 ${city.batch} 批` : `Smart City Local · Batch ${city.batch}`)
                : (locale === "th" ? "เขตส่งเสริมเมืองอัจฉริยะ" : locale === "zh" ? "智慧城市推广区" : "Smart City Promotion Zone")}
            </p>
            <h1>{cityName}</h1>
            <p className="city-detail-province">{provinceName}</p>
          </div>
          <div className="city-detail-score-block">
            <div className={`tier-badge-large tier-${city.tier}`}>
              {tierSymbol} {TIER_LABELS[locale][city.tier]}
            </div>
            <div className="composite-large">{city.compositeScore.toFixed(1)}</div>
            <div className={`reality-badge reality-${city.reality}`}>
              {getCityRealityLabel(city.reality, locale)}
            </div>
          </div>
        </div>

        <p className="city-detail-tagline">{cityTagline}</p>
      </section>

      {/* ─── RPG STAT SHEET ─── */}
      <section className="section rpg-section">
        <p className="eyebrow">{locale === "th" ? "สถิติเมือง" : locale === "zh" ? "城市数据" : "City stats"}</p>
        <h2>{locale === "th" ? "แผ่นสถิติ" : locale === "zh" ? "城市属性表" : "Stat Sheet"}</h2>

        <div className="rpg-layout">
          {/* Radar chart */}
          <div className="rpg-radar-panel">
            <RadarChart scores={city.scores} locale={locale} />
            <div className="rpg-overall-grade">
              <span className="rpg-grade-label">
                {translate(locale, { en: "Rank", th: "ระดับ", zh: "评级" })}
              </span>
              <span className="rpg-grade-letter" style={{ color: gradeColor(overallGrade) }}>
                {overallGrade}
              </span>
            </div>
          </div>

          {/* Stat bars */}
          <div className="rpg-stats-panel">
            {SCORING_PILLARS.map(p => (
              <StatBar key={p} pillar={p} value={city.scores[p]} locale={locale} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── SCORE DECOMPOSITION ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "การคำนวณ" : locale === "zh" ? "计算方式" : "Score math"}</p>
        <h2>{locale === "th" ? "ตัวเลขมาจากไหน" : locale === "zh" ? "这些数字怎么来的" : "Where the numbers come from"}</h2>
        <ScoreBreakdown scores={city.scores} locale={locale} />
      </section>

      {planningProfile && (
        <>
          <section className="section">
            <div className="planning-section-header">
              <div>
                <p className="eyebrow">
                  {translate(locale, { en: "Planning stack", th: "แผนเดินเมือง", zh: "规划栈" })}
                </p>
                <h2>
                  {translate(locale, {
                    en: "Five steps from badge to delivery",
                    th: "ห้าขั้นจากตราไปสู่การส่งมอบจริง",
                    zh: "从徽章走到交付的五个步骤",
                  })}
                </h2>
              </div>
              <a
                className="ghost-button csv-download"
                href={planningCsvHref}
                download="city-planning-profiles.csv"
              >
                {translate(locale, {
                  en: "Download planning CSV",
                  th: "ดาวน์โหลด CSV แผนเมือง",
                  zh: "下载规划 CSV",
                })}
              </a>
            </div>
            <p className="section-intro">
              {translate(locale, {
                en: "This is the city-delivery view: vision, infrastructure, data platform, business model, and partnerships. It turns the index into a practical operating brief.",
                th: "นี่คือมุมมองแบบส่งมอบจริงของเมือง: วิสัยทัศน์ โครงสร้างพื้นฐาน แพลตฟอร์มข้อมูล โมเดลธุรกิจ และพันธมิตร ทำให้ดัชนีกลายเป็น operating brief ที่ใช้งานได้",
                zh: "这是城市交付视角：愿景、基础设施、数据平台、商业模式与伙伴关系。它把指数变成一份能拿去工作的操作简报。",
              })}
            </p>
            <div className="planning-stack">
              {PLANNING_STEPS.map(step => (
                <div key={step.id} className="planning-step">
                  <div className="planning-step-header-row">
                    <div>
                      <h3 className="planning-step-title">{step.label[locale]}</h3>
                      <p className="planning-step-desc">{step.description[locale]}</p>
                    </div>
                    <span className={`planning-step-status planning-step-status-${planningProfile.stepStatus[step.id]}`}>
                      {getLocalizedPlanningStatus(planningProfile.stepStatus[step.id], locale)}
                    </span>
                  </div>
                  <p className="planning-step-note">{planningProfile.stepNotes[step.id][locale]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">
              {translate(locale, { en: "Action board", th: "กระดานภารกิจ", zh: "行动板" })}
            </p>
            <h2>
              {translate(locale, {
                en: "What this city should do next",
                th: "เมืองนี้ควรทำอะไรต่อ",
                zh: "这座城市接下来该做什么",
              })}
            </h2>
            <p className="section-intro">
              {translate(locale, {
                en: "These are not generic feel-good talking points. They are the next three operational moves implied by the city's planning gaps and delivery shape.",
                th: "นี่ไม่ใช่ถ้อยคำปลอบใจทั่วไป แต่คือสามก้าวปฏิบัติการถัดไปที่อนุมานจากช่องว่างการวางแผนและรูปทรงการส่งมอบของเมือง",
                zh: "这不是套话式鼓励，而是从这座城市的规划缺口和交付形态里推出来的三个实际动作。",
              })}
            </p>
            <div className="action-board">
              {actionRecommendations.map(action => (
                <div key={action.id} className="action-card">
                  <div className="action-card-kicker">
                    {getLocalizedRecommendationHorizon(action.horizon, locale)}
                  </div>
                  <h3 className="action-card-title">{action.title[locale]}</h3>
                  <p className="action-card-body">{action.body[locale]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">
              {translate(locale, { en: "Finance + delivery", th: "การเงิน + กลไกส่งมอบ", zh: "融资与交付" })}
            </p>
            <h2>
              {translate(locale, {
                en: "What could actually finance the next move",
                th: "อะไรที่ใช้จ่ายเงินสำหรับก้าวถัดไปได้จริง",
                zh: "什么机制真的能支撑下一步",
              })}
            </h2>
            <p className="section-intro">
              {planningProfile.deliveryNote[locale]}{" "}
              {translate(locale, {
                en: "These are fit-for-purpose mechanisms based on city maturity and domain mix, not verified live contracts.",
                th: "นี่คือกลไกที่เหมาะกับบริบทของเมืองตามระดับความพร้อมและมิติที่กำลังขับเคลื่อน ไม่ใช่สัญญาที่ยืนยันแล้วว่าใช้อยู่จริง",
                zh: "这些是根据城市成熟度与领域组合推导出的适配机制，不是已经核实在执行中的真实合同。",
              })}
            </p>
            <div className="finance-grid">
              {[planningProfile.primaryFinance, planningProfile.secondaryFinance].map((mechanismId, index) => {
                const mechanism = FINANCE_MECHANISMS[mechanismId];
                return (
                  <div
                    key={`${mechanismId}-${index}`}
                    className={`finance-card ${index === 0 ? "finance-card-primary" : ""}`}
                  >
                    <div className="finance-card-kicker">
                      {index === 0
                        ? translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主机制" })
                        : translate(locale, { en: "Secondary mechanism", th: "กลไกรอง", zh: "次机制" })}
                    </div>
                    <h3 className="finance-card-title">{mechanism.label[locale]}</h3>
                    <p className="finance-card-body">{mechanism.description[locale]}</p>
                    <p className="finance-card-body finance-card-consideration">{mechanism.consideration[locale]}</p>
                    {mechanism.tenor && (
                      <div className="finance-card-meta">
                        <span className="finance-card-meta-label">
                          {translate(locale, { en: "Typical tenor", th: "ช่วงเวลาโดยทั่วไป", zh: "典型期限" })}
                        </span>
                        <span className="finance-card-meta-value">{mechanism.tenor[locale]}</span>
                      </div>
                    )}
                    {index === 0 && planningProfile.concessionYears && (
                      <div className="finance-card-meta">
                        <span className="finance-card-meta-label">
                          {translate(locale, { en: "Concession lens", th: "มุมมองสัมปทาน", zh: "特许年限视角" })}
                        </span>
                        <span className="finance-card-meta-value">{planningProfile.concessionYears} {translate(locale, { en: "years", th: "ปี", zh: "年" })}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {financeBlueprint && (
              <div className="finance-blueprint-grid">
                <div className="finance-blueprint-card">
                  <div className="finance-blueprint-label">
                    {translate(locale, { en: "Revenue logic", th: "ตรรกะรายได้", zh: "收入逻辑" })}
                  </div>
                  <p className="finance-blueprint-body">{financeBlueprint.revenueLogic[locale]}</p>
                </div>
                <div className="finance-blueprint-card">
                  <div className="finance-blueprint-label">
                    {translate(locale, { en: "Public role", th: "บทบาทภาครัฐ", zh: "公共角色" })}
                  </div>
                  <p className="finance-blueprint-body">{financeBlueprint.publicRole[locale]}</p>
                </div>
                <div className="finance-blueprint-card">
                  <div className="finance-blueprint-label">
                    {translate(locale, { en: "Private role", th: "บทบาทเอกชน", zh: "私人角色" })}
                  </div>
                  <p className="finance-blueprint-body">{financeBlueprint.privateRole[locale]}</p>
                </div>
                <div className="finance-blueprint-card">
                  <div className="finance-blueprint-label">
                    {translate(locale, { en: "Risk allocation", th: "การจัดสรรความเสี่ยง", zh: "风险分配" })}
                  </div>
                  <p className="finance-blueprint-body">{financeBlueprint.riskAllocation[locale]}</p>
                </div>
                <div className="finance-blueprint-card finance-blueprint-card-wide">
                  <div className="finance-blueprint-label">
                    {translate(locale, { en: "Contract lens", th: "มุมมองสัญญา", zh: "合同视角" })}
                  </div>
                  <p className="finance-blueprint-body">{financeBlueprint.contractLens[locale]}</p>
                </div>
              </div>
            )}
          </section>

          <section className="section">
            <p className="eyebrow">
              {translate(locale, { en: "Seven domains", th: "7 มิติเมืองอัจฉริยะ", zh: "七大智慧城市领域" })}
            </p>
            <h2>
              {translate(locale, {
                en: "Proxy signals across the smart city stack",
                th: "สัญญาณตัวแทนในสแต็กเมืองอัจฉริยะ",
                zh: "贯穿智慧城市栈的代理信号",
              })}
            </h2>
            <p className="section-intro">
              {translate(locale, {
                en: "These seven domains act as planning proxies. The score is derived from the weighted pillars already used in the index, then translated into domain-level reading.",
                th: "7 มิตินี้ทำหน้าที่เป็นตัวแทนเชิงวางแผน คะแนนคำนวณจากเสาหลักถ่วงน้ำหนักที่ใช้ในดัชนีอยู่แล้ว แล้วแปลออกมาเป็นการอ่านระดับมิติ",
                zh: "这七个领域被当作规划代理变量。分数来自指数里已经在用的加权支柱，再翻译成领域级读法。",
              })}
            </p>
            <div className="domain-proxy-grid">
              {domainProxies.map(proxy => (
                <div
                  key={proxy.dimension}
                  className={`domain-proxy-card ${proxy.active ? "domain-proxy-card-active" : "domain-proxy-card-watch"}`}
                >
                  <div className="domain-proxy-head">
                    <div>
                      <h3 className="domain-proxy-title">{DIMENSION_LABELS[locale][proxy.dimension]}</h3>
                      <span className="domain-proxy-state">
                        {proxy.active
                          ? translate(locale, { en: "Declared / visible in city profile", th: "อยู่ในโปรไฟล์เมือง", zh: "已在城市画像中声明" })
                          : translate(locale, { en: "Not yet visible in city profile", th: "ยังไม่ปรากฏชัดในโปรไฟล์เมือง", zh: "尚未在城市画像中显性出现" })}
                      </span>
                    </div>
                    <span className="domain-proxy-score">{proxy.proxyScore}</span>
                  </div>
                  <p className="domain-proxy-copy">{proxy.initiative[locale]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">
              {translate(locale, { en: "City data platform", th: "City Data Platform", zh: "城市数据平台" })}
            </p>
            <h2>
              {translate(locale, {
                en: "The minimum data stack this city needs",
                th: "สแต็กข้อมูลขั้นต่ำที่เมืองนี้ต้องมี",
                zh: "这座城市至少该有的数据栈",
              })}
            </h2>
            <div className="data-rail-grid">
              {dataRails.map(rail => (
                <div key={rail.id} className="data-rail-card">
                  <div className="data-rail-label">{rail.label[locale]}</div>
                  <p className="data-rail-body">{rail.description[locale]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="section">
            <p className="eyebrow">
              {translate(locale, { en: "Delivery stack", th: "ชุดเครื่องมือส่งมอบ", zh: "交付工具栈" })}
            </p>
            <h2>
              {translate(locale, {
                en: "Toolkits, data rails, and reference models",
                th: "Toolkit, data rails และต้นแบบอ้างอิง",
                zh: "工具包、数据轨道与参考模型",
              })}
            </h2>
            <div className="delivery-stack-grid">
              <div className="delivery-column">
                <h3 className="delivery-column-title">
                  {translate(locale, { en: "Toolkits", th: "Toolkit", zh: "工具包" })}
                </h3>
                <div className="delivery-list">
                  {planningProfile.toolkitIds.map(toolkitId => {
                    const toolkit = TOOLKITS[toolkitId];
                    return (
                      <div key={toolkitId} className="delivery-item">
                        <div className="delivery-item-title">{toolkit.label[locale]}</div>
                        <p className="delivery-item-body">{toolkit.description[locale]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="delivery-column">
                <h3 className="delivery-column-title">
                  {translate(locale, { en: "Data + funding resources", th: "ทรัพยากรข้อมูล + เงินทุน", zh: "数据与资金资源" })}
                </h3>
                <div className="delivery-list">
                  {planningProfile.resourceIds.map(resourceId => {
                    const resource = RESOURCES[resourceId];
                    return (
                      <div key={resourceId} className="delivery-item">
                        <div className="delivery-item-title">{resource.label[locale]}</div>
                        <p className="delivery-item-body">{resource.description[locale]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="delivery-column">
                <h3 className="delivery-column-title">
                  {translate(locale, { en: "Global reference models", th: "ต้นแบบจากต่างประเทศ", zh: "全球参考模型" })}
                </h3>
                <div className="delivery-list">
                  {planningProfile.globalModelIds.map(modelId => {
                    const model = GLOBAL_MODELS[modelId];
                    return (
                      <div key={modelId} className="delivery-item">
                        <div className="delivery-item-title">{model.label[locale]}</div>
                        <p className="delivery-item-body">{model.lesson[locale]}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {dataRow && (
            <section className="section">
              <p className="eyebrow">
                {translate(locale, { en: "Machine-readable record", th: "เรคคอร์ดที่เครื่องอ่านได้", zh: "机器可读记录" })}
              </p>
              <h2>
                {translate(locale, {
                  en: "This city's CSV row",
                  th: "แถว CSV ของเมืองนี้",
                  zh: "这座城市的 CSV 记录",
                })}
              </h2>
              <p className="section-intro">
                {translate(locale, {
                  en: "Same logic, same fields, same export structure. This is the row that turns the index into a city data platform skeleton.",
                  th: "ตรรกะเดียวกัน ฟิลด์เดียวกัน โครงสร้าง export เดียวกัน นี่คือแถวข้อมูลที่ทำให้ดัชนีกลายเป็นโครงกระดูกของ city data platform",
                  zh: "同一套逻辑、同一组字段、同一种导出结构。这就是把指数变成城市数据平台骨架的那一行。",
                })}
              </p>
              <div className="record-grid">
                {[
                  ["cityId", dataRow.cityId],
                  ["status", dataRow.status],
                  ["reality", dataRow.reality],
                  ["tier", dataRow.tier],
                  ["leadStep", dataRow.recommendedLeadStep],
                  ["leadFinance", dataRow.primaryFinance],
                ].map(([label, value]) => (
                  <div key={label} className="record-item">
                    <span className="record-label">{label}</span>
                    <span className="record-value">{value}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* ─── SMART DIMENSIONS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "มิติอัจฉริยะ depa" : locale === "zh" ? "depa 智慧维度" : "depa dimensions"}</p>
        <h2>{locale === "th" ? "ขอบเขต" : locale === "zh" ? "关注领域" : "Focus areas"}</h2>
        <div className="dimension-grid">
          {city.smartDimensions.map(d => (
            <div key={d} className="dimension-card">
              <span className="dimension-icon">
                {d === "economy" ? "💰" : d === "energy" ? "⚡" : d === "environment" ? "🌿" : d === "governance" ? "🏛️" : d === "living" ? "🏠" : d === "mobility" ? "🚌" : "👥"}
              </span>
              <span className="dimension-name">{DIMENSION_LABELS[locale][d]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── METRICS ─── */}
      {(city.metrics.gppPerCapita || city.metrics.avgMonthlyIncome || city.metrics.pm25Annual) && (
        <section className="section">
          <p className="eyebrow">{locale === "th" ? "ข้อมูล" : locale === "zh" ? "原始数据" : "Raw data"}</p>
          <h2>{locale === "th" ? "ตัวเลขจริง" : locale === "zh" ? "真实数字" : "Real numbers"}</h2>
          <div className="metrics-grid">
            {city.metrics.population > 0 && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.population.toLocaleString()}K</div>
                <div className="metric-label">{locale === "th" ? "ประชากร" : locale === "zh" ? "人口" : "Population"}</div>
              </div>
            )}
            {city.metrics.gppPerCapita && city.metrics.gppPerCapita > 0 && (
              <div className="metric-card">
                <div className="metric-value">฿{(city.metrics.gppPerCapita / 1000).toFixed(0)}K</div>
                <div className="metric-label">{locale === "th" ? "GPP ต่อหัว" : locale === "zh" ? "人均 GPP" : "GPP / capita"}</div>
              </div>
            )}
            {city.metrics.avgMonthlyIncome && city.metrics.avgMonthlyIncome > 0 && (
              <div className="metric-card">
                <div className="metric-value">฿{city.metrics.avgMonthlyIncome.toLocaleString()}</div>
                <div className="metric-label">{locale === "th" ? "รายได้/เดือน" : locale === "zh" ? "月收入" : "Income / mo"}</div>
              </div>
            )}
            {city.metrics.pm25Annual && (
              <div className="metric-card">
                <div className={`metric-value ${city.metrics.pm25Annual > 35 ? "metric-warning" : city.metrics.pm25Annual > 25 ? "metric-caution" : ""}`}>
                  {city.metrics.pm25Annual}
                </div>
                <div className="metric-label">PM2.5 μg/m³</div>
              </div>
            )}
            {city.metrics.hospitalBedsPer10k && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.hospitalBedsPer10k}</div>
                <div className="metric-label">{locale === "th" ? "เตียง/หมื่น" : locale === "zh" ? "每万人床位" : "Beds / 10K"}</div>
              </div>
            )}
            {city.metrics.crimeRatePer100k && (
              <div className="metric-card">
                <div className={`metric-value ${city.metrics.crimeRatePer100k > 200 ? "metric-warning" : ""}`}>
                  {city.metrics.crimeRatePer100k}
                </div>
                <div className="metric-label">{locale === "th" ? "อาชญากรรม/แสน" : locale === "zh" ? "每十万犯罪" : "Crime / 100K"}</div>
              </div>
            )}
            {city.metrics.greenCoverage && (
              <div className="metric-card">
                <div className="metric-value">{city.metrics.greenCoverage}%</div>
                <div className="metric-label">{locale === "th" ? "สีเขียว" : locale === "zh" ? "绿地 %" : "Green %"}</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── HIGHLIGHTS ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "จุดเด่น" : locale === "zh" ? "重点证据" : "Evidence"}</p>
        <h2>{locale === "th" ? "สิ่งที่ทำได้จริง" : locale === "zh" ? "真正运作的东西" : "What actually works"}</h2>
        <ul className="highlights-list">
          {city.highlights.map((h, i) => (
            <li key={i} className="highlight-item">{h}</li>
          ))}
        </ul>
      </section>

      {/* ─── EVIDENCE & DATA PROVENANCE ─── */}
      {evidence.length > 0 && (
        <section className="section">
          <p className="eyebrow">{locale === "th" ? "หลักฐาน" : locale === "zh" ? "证据" : "Evidence"}</p>
          <h2>{locale === "th" ? "ข้อมูลมาจากไหน" : locale === "zh" ? "数据从哪里来" : "Where the data comes from"}</h2>
          <div className="evidence-feed">
            {evidence.map((e, i) => (
              <div key={i} className="evidence-item">
                <div className="evidence-meta">
                  <span className={`evidence-type evidence-type-${e.type}`}>
                    {e.type === "news" ? "NEWS" : e.type === "data" ? "DATA" : e.type === "field" ? "FIELD" : e.type === "satellite" ? "SAT" : "GOV"}
                  </span>
                  <span className="evidence-pillar">{e.pillar}</span>
                  <span className="evidence-date">{e.date}</span>
                </div>
                <div className="evidence-title">
                  {locale === "th" ? e.titleTh : locale === "zh" ? e.titleZh : e.titleEn}
                </div>
                <div className="evidence-source">
                  {e.url ? (
                    <a href={e.url} target="_blank" rel="noopener noreferrer">{e.source} →</a>
                  ) : (
                    <span>{e.source}</span>
                  )}
                  {e.value && <span className="evidence-value">{e.metric}: {e.value}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── DATA SOURCES ─── */}
      <section className="section">
        <p className="eyebrow">{locale === "th" ? "แหล่งข้อมูล" : locale === "zh" ? "数据来源" : "Data sources"}</p>
        <h2>{locale === "th" ? "ทุกตัวเลขสืบย้อนได้" : locale === "zh" ? "每个数字都可追溯" : "Every number is traceable"}</h2>
        <div className="sources-grid">
          {dataSources.slice(0, 6).map(ds => (
            <div key={ds.id} className="source-card">
              <div className="source-card-type">{ds.type.toUpperCase()}</div>
              <div className="source-card-name">{ds.name}</div>
              <div className="source-card-desc">
                {locale === "th" ? ds.descTh : locale === "zh" ? ds.descZh : ds.descEn}
              </div>
              <div className="source-card-freq">{ds.updateFrequency}</div>
            </div>
          ))}
        </div>
      </section>
      {/* ═══ COMMAND CENTER: TIER UPGRADE ANALYSIS ═══ */}
      {tierUpgrade && tierUpgrade.nextTier && (
        <section className="section cc-section">
          <p className="eyebrow">{translate(locale, { en: "Control tower", th: "หอควบคุม", zh: "控制塔" })}</p>
          <h2>{translate(locale, { en: "Tier upgrade path", th: "เส้นทางอัพเกรดระดับ", zh: "升级路径" })}</h2>
          <div className="cc-upgrade-banner">
            <div className="cc-upgrade-current">
              <span className="cc-upgrade-tier-label">{translate(locale, { en: "Current", th: "ปัจจุบัน", zh: "当前" })}</span>
              <span className={`cc-upgrade-tier tier-${tierUpgrade.currentTier}`}>{tierUpgrade.currentTier === "gamma" ? "γ" : tierUpgrade.currentTier === "beta" ? "β" : "α"} {tierUpgrade.currentTier}</span>
              <span className="cc-upgrade-score">{tierUpgrade.currentScore.toFixed(1)}</span>
            </div>
            <div className="cc-upgrade-arrow">
              <span className="cc-upgrade-gap">+{tierUpgrade.gap?.toFixed(1)}</span>
              →
            </div>
            <div className="cc-upgrade-target">
              <span className="cc-upgrade-tier-label">{translate(locale, { en: "Target", th: "เป้าหมาย", zh: "目标" })}</span>
              <span className={`cc-upgrade-tier tier-${tierUpgrade.nextTier}`}>{tierUpgrade.nextTier === "beta" ? "β" : "α"} {tierUpgrade.nextTier}</span>
              <span className="cc-upgrade-score">{tierUpgrade.nextThreshold}</span>
            </div>
            <div className="cc-upgrade-meta">
              <span className={`cc-feasibility cc-feasibility-${tierUpgrade.feasibility}`}>{tierUpgrade.feasibility}</span>
              <span className="cc-timeline">{tierUpgrade.projectedTimeline}</span>
            </div>
          </div>
          <p className="cc-upgrade-summary">{tierUpgrade.summary[locale]}</p>
          {tierUpgrade.quickestWins.length > 0 && (
            <div className="cc-quickwins">
              <div className="cc-quickwins-title">{translate(locale, { en: "Quickest composite gains", th: "ทางลัดคะแนนรวมเร็วที่สุด", zh: "最快综合分提升" })}</div>
              <div className="cc-quickwins-grid">
                {tierUpgrade.quickestWins.map(w => (
                  <div key={w.pillar} className="cc-quickwin-card">
                    <div className="cc-quickwin-pillar" style={{ color: PILLAR_COLORS[w.pillar] }}>{PILLAR_LABELS[locale][w.pillar]}</div>
                    <div className="cc-quickwin-detail">+{w.pointsNeeded} pts × {w.weight}% = <strong>+{w.compositeGain.toFixed(1)}</strong></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ═══ COMMAND CENTER: IMPROVEMENT ROADMAP ═══ */}
      {improvementPlan.length > 0 && (
        <section className="section cc-section">
          <p className="eyebrow">{translate(locale, { en: "Improvement roadmap", th: "แผนยกระดับ", zh: "改善路线图" })}</p>
          <h2>{translate(locale, { en: "What to invest in — and why", th: "ลงทุนอะไร — และทำไม", zh: "投资什么——以及为什么" })}</h2>
          <p className="section-intro">
            {translate(locale, {
              en: "Prioritized by pillar weight × gap size. Each recommendation shows the specific composite score gain and actionable next steps.",
              th: "จัดลำดับตามน้ำหนักเสาหลัก × ขนาดช่องว่าง แต่ละข้อเสนอแนะแสดงคะแนนรวมที่จะได้และขั้นตอนปฏิบัติได้ทันที",
              zh: "按支柱权重×差距大小排序。每项建议显示具体综合分收益和可执行的下一步。",
            })}
          </p>
          <div className="cc-improvement-stack">
            {improvementPlan.map((rec, idx) => (
              <div key={rec.pillar} className={`cc-improvement-card cc-priority-${rec.priority}`}>
                <div className="cc-improvement-header">
                  <div className="cc-improvement-rank">#{idx + 1}</div>
                  <div className="cc-improvement-main">
                    <span className={`cc-priority-badge cc-priority-badge-${rec.priority}`}>{rec.priority}</span>
                    <h3 className="cc-improvement-title">{rec.title[locale]}</h3>
                    <div className="cc-improvement-scores">
                      <span className="cc-score-current" style={{ color: PILLAR_COLORS[rec.pillar] }}>{rec.currentScore}</span>
                      <span className="cc-score-arrow">→</span>
                      <span className="cc-score-target">{rec.targetScore}</span>
                      <span className="cc-pillar-name">{PILLAR_LABELS[locale][rec.pillar]}</span>
                    </div>
                  </div>
                  <div className="cc-improvement-impact">
                    <span className="cc-impact-label">{translate(locale, { en: "Impact", th: "ผลกระทบ", zh: "影响" })}</span>
                    <span className="cc-impact-value">{rec.estimatedImpact[locale]}</span>
                  </div>
                </div>
                <p className="cc-improvement-rationale">{rec.rationale[locale]}</p>
                <div className="cc-improvement-actions">
                  {rec.actions.map((action, ai) => (
                    <div key={ai} className="cc-action-item">
                      <span className="cc-action-number">{ai + 1}</span>
                      <span>{action[locale]}</span>
                    </div>
                  ))}
                </div>
                <div className="cc-improvement-footer">
                  <span>{translate(locale, { en: "Timeline", th: "ระยะเวลา", zh: "周期" })}: {rec.timeframe}</span>
                  <span>{translate(locale, { en: "Investment", th: "งบลงทุน", zh: "投资" })}: {rec.investmentRange}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ COMMAND CENTER: SWOT ANALYSIS ═══ */}
      <section className="section cc-section">
        <p className="eyebrow">{translate(locale, { en: "Strategic intelligence", th: "ข่าวกรองเชิงกลยุทธ์", zh: "战略情报" })}</p>
        <h2>{translate(locale, { en: "SWOT Analysis", th: "วิเคราะห์ SWOT", zh: "SWOT分析" })}</h2>
        <div className="cc-swot-grid">
          {(["strengths", "weaknesses", "opportunities", "threats"] as const).map(cat => {
            const labels = { strengths: "S", weaknesses: "W", opportunities: "O", threats: "T" };
            const fullLabels = {
              strengths: translate(locale, { en: "Strengths", th: "จุดแข็ง", zh: "优势" }),
              weaknesses: translate(locale, { en: "Weaknesses", th: "จุดอ่อน", zh: "劣势" }),
              opportunities: translate(locale, { en: "Opportunities", th: "โอกาส", zh: "机会" }),
              threats: translate(locale, { en: "Threats", th: "ภัยคุกคาม", zh: "威胁" }),
            };
            return (
              <div key={cat} className={`cc-swot-card cc-swot-${cat}`}>
                <div className="cc-swot-header">
                  <span className="cc-swot-letter">{labels[cat]}</span>
                  <span className="cc-swot-label">{fullLabels[cat]}</span>
                </div>
                <div className="cc-swot-items">
                  {swot[cat].map((item, i) => (
                    <div key={i} className="cc-swot-item">{item}</div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ COMMAND CENTER: INTERNATIONAL CASE STUDIES ═══ */}
      {caseStudies.length > 0 && (
        <section className="section cc-section">
          <p className="eyebrow">{translate(locale, { en: "Global intelligence", th: "ข่าวกรองระดับโลก", zh: "全球情报" })}</p>
          <h2>{translate(locale, { en: "Reference projects from similar contexts", th: "โครงการอ้างอิงจากบริบทใกล้เคียง", zh: "相似背景的参考项目" })}</h2>
          <p className="section-intro">
            {translate(locale, {
              en: "These are famous smart city projects from countries with comparable challenges. Each includes the financial model used and lessons directly applicable to this city.",
              th: "นี่คือโครงการเมืองอัจฉริยะที่มีชื่อเสียงจากประเทศที่มีความท้าทายเทียบเคียงได้ แต่ละโครงการรวมโมเดลการเงินที่ใช้และบทเรียนที่ใช้กับเมืองนี้ได้โดยตรง",
              zh: "这些是来自具有可比挑战的国家的著名智慧城市项目。每个都包含使用的财务模型和直接适用于本城市的经验教训。",
            })}
          </p>
          <div className="cc-casestudy-stack">
            {caseStudies.map(cs => (
              <div key={cs.id} className="cc-casestudy-card">
                <div className="cc-casestudy-header">
                  <div>
                    <div className="cc-casestudy-city">{cs.city}, {cs.country}</div>
                    <h3 className="cc-casestudy-project">{cs.project}</h3>
                  </div>
                  <div className="cc-casestudy-meta">
                    <span className="cc-casestudy-year">{cs.year}</span>
                    <span className="cc-casestudy-investment">{cs.investment}</span>
                  </div>
                </div>
                <div className="cc-casestudy-body">
                  <div className="cc-casestudy-section">
                    <span className="cc-casestudy-section-label">{translate(locale, { en: "Context", th: "บริบท", zh: "背景" })}</span>
                    <p>{cs.context[locale]}</p>
                  </div>
                  <div className="cc-casestudy-section">
                    <span className="cc-casestudy-section-label">{translate(locale, { en: "Outcome", th: "ผลลัพธ์", zh: "成果" })}</span>
                    <p>{cs.outcome[locale]}</p>
                  </div>
                  <div className="cc-casestudy-section cc-casestudy-lesson">
                    <span className="cc-casestudy-section-label">{translate(locale, { en: "Lesson for Thailand", th: "บทเรียนสำหรับไทย", zh: "对泰国的启示" })}</span>
                    <p>{cs.lesson[locale]}</p>
                  </div>
                </div>
                <div className="cc-casestudy-footer">
                  <span className="cc-casestudy-finance-label">{translate(locale, { en: "Financial model", th: "โมเดลการเงิน", zh: "财务模型" })}</span>
                  <span className="cc-casestudy-finance-value">{cs.financialModel}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ═══ BANKABILITY ASSESSMENT ═══ */}
      {bankability && (
        <section className="section cc-section">
          <p className="eyebrow">{translate(locale, { en: "Bankability", th: "ความพร้อมทางการเงิน", zh: "可融资性" })}</p>
          <h2>{translate(locale, { en: "Can this city attract finance?", th: "เมืองนี้ดึงดูดการเงินได้หรือไม่?", zh: "这座城市能吸引融资吗？" })}</h2>
          <div className="cc-bankability">
            <div className="cc-bankability-score">
              <span className="cc-bankability-number">{bankability.readinessScore}</span>
              <span className="cc-bankability-label">/100</span>
            </div>
            <div className="cc-bankability-grid">
              <div className="cc-bankability-item">
                <span className="cc-bankability-item-label">{translate(locale, { en: "Revenue base", th: "ฐานรายได้", zh: "收入基础" })}</span>
                <span className={`cc-bankability-item-value cc-bankability-${bankability.revenueBase}`}>{bankability.revenueBase}</span>
              </div>
              <div className="cc-bankability-item">
                <span className="cc-bankability-item-label">{translate(locale, { en: "Institutional capacity", th: "ศักยภาพสถาบัน", zh: "机构能力" })}</span>
                <span className={`cc-bankability-item-value cc-bankability-${bankability.institutionalCapacity}`}>{bankability.institutionalCapacity}</span>
              </div>
              <div className="cc-bankability-item">
                <span className="cc-bankability-item-label">{translate(locale, { en: "Project pipeline", th: "สายโครงการ", zh: "项目管线" })}</span>
                <span className={`cc-bankability-item-value cc-bankability-${bankability.projectPipeline}`}>{bankability.projectPipeline}</span>
              </div>
              <div className="cc-bankability-item">
                <span className="cc-bankability-item-label">{translate(locale, { en: "Private interest", th: "ความสนใจเอกชน", zh: "私营兴趣" })}</span>
                <span className={`cc-bankability-item-value cc-bankability-${bankability.privateInterest}`}>{bankability.privateInterest}</span>
              </div>
              <div className="cc-bankability-item">
                <span className="cc-bankability-item-label">{translate(locale, { en: "Risk profile", th: "ความเสี่ยง", zh: "风险概况" })}</span>
                <span className={`cc-bankability-item-value cc-bankability-${bankability.riskProfile}`}>{bankability.riskProfile}</span>
              </div>
            </div>
            <p className="cc-bankability-rec">{locale === "th" ? bankability.recommendationTh : bankability.recommendation}</p>
          </div>

          {asusProject && (
            <div className="cc-asus-project">
              <h3 className="cc-asus-title">
                {translate(locale, { en: "UN-Habitat ASUS Project", th: "โครงการ ASUS UN-Habitat", zh: "联合国人居署 ASUS 项目" })}
              </h3>
              <p className="cc-asus-area">
                <strong>{translate(locale, { en: "Priority area", th: "พื้นที่สำคัญ", zh: "优先领域" })}:</strong> {asusProject.priorityArea}
              </p>
              <p className="cc-asus-status">
                <strong>{translate(locale, { en: "Status", th: "สถานะ", zh: "状态" })}:</strong> {asusProject.status}
              </p>
              <div className="cc-asus-interventions">
                {asusProject.keyInterventions.map((item, i) => (
                  <span key={i} className="cc-asus-chip">{item}</span>
                ))}
              </div>
              <p className="cc-asus-timeline">{asusProject.timeline}</p>
            </div>
          )}
        </section>
      )}

      {/* ═══ COMMAND CENTER: FINANCIAL TOOLKIT ═══ */}
      {finRecs.length > 0 && (
        <section className="section cc-section">
          <p className="eyebrow">{translate(locale, { en: "Financial clinic", th: "คลินิกการเงิน", zh: "金融诊所" })}</p>
          <h2>{translate(locale, { en: "Recommended financing instruments", th: "เครื่องมือการเงินที่แนะนำ", zh: "推荐融资工具" })}</h2>
          <p className="section-intro">
            {translate(locale, {
              en: "Matched to this city's tier, development stage, and pillar gaps. Includes real ASEAN examples and Thai-specific relevance.",
              th: "จับคู่กับระดับเมือง ระยะพัฒนา และช่องว่างเสาหลัก รวมตัวอย่างจริงจากอาเซียนและความเกี่ยวข้องเฉพาะไทย",
              zh: "匹配本城市级别、发展阶段与支柱差距。包含真实东盟案例和泰国特定相关性。",
            })}
          </p>
          <div className="cc-finance-stack">
            {finRecs.slice(0, 6).map((rec, i) => (
              <div key={i} className={`cc-finance-card cc-finance-${rec.priority}`}>
                <div className="cc-finance-header">
                  <span className={`cc-finance-priority cc-finance-priority-${rec.priority}`}>{rec.priority}</span>
                  <span className="cc-finance-category">{rec.instrument.category}</span>
                </div>
                <h3 className="cc-finance-name">{locale === "th" ? rec.instrument.nameTh : rec.instrument.name}</h3>
                <p className="cc-finance-desc">{locale === "th" ? rec.instrument.descTh : rec.instrument.descEn}</p>
                <p className="cc-finance-reason">{locale === "th" ? rec.reasonTh : rec.reason}</p>
                <div className="cc-finance-details">
                  <div className="cc-finance-detail">
                    <span className="cc-finance-detail-label">{translate(locale, { en: "Typical size", th: "ขนาดโดยทั่วไป", zh: "典型规模" })}</span>
                    <span className="cc-finance-detail-value">{rec.instrument.typicalSize}</span>
                  </div>
                  <div className="cc-finance-detail">
                    <span className="cc-finance-detail-label">{translate(locale, { en: "Complexity", th: "ความซับซ้อน", zh: "复杂度" })}</span>
                    <span className="cc-finance-detail-value">{rec.instrument.complexity}</span>
                  </div>
                  {rec.instrument.aseanExample && (
                    <div className="cc-finance-detail cc-finance-detail-wide">
                      <span className="cc-finance-detail-label">{translate(locale, { en: "ASEAN example", th: "ตัวอย่าง ASEAN", zh: "东盟案例" })}</span>
                      <span className="cc-finance-detail-value">{rec.instrument.aseanExample}</span>
                    </div>
                  )}
                  <div className="cc-finance-detail cc-finance-detail-wide">
                    <span className="cc-finance-detail-label">{translate(locale, { en: "Thai relevance", th: "ความเกี่ยวข้องกับไทย", zh: "泰国相关性" })}</span>
                    <span className="cc-finance-detail-value">{rec.instrument.thaiRelevance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
