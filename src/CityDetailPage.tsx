import { useMemo } from "react";
import {
  getPopulationDensityPerKm2,
  getResolvedLandAreaKm2,
  getResolvedPopulationThousand,
} from "./adminBaselines";
import { computeDevelopability, getFinancingAdvice, getTailoredSteps } from "./cityAnalytics";
import { useCityDetail } from "./cityApi";
import { getCityExternalResearchLinks, getCityFactsCsv } from "./cityCdp";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { downloadCsv } from "./csvDownload";
import { getCityPhotoAsset } from "./cityMedia";
import { ResponsiveImage } from "./mediaAssets";
import { SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, PILLAR_SHORT_LABELS, TIER_LABELS } from "./types";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

const DELIVERY_STEPS = [
  {
    key: "visionStatus",
    label: { en: "Vision + mandate", th: "วิสัยทัศน์ + อำนาจขับเคลื่อน", zh: "愿景与授权" },
  },
  {
    key: "infrastructureStatus",
    label: { en: "Infrastructure", th: "โครงสร้างพื้นฐาน", zh: "基础设施" },
  },
  {
    key: "dataPlatformStatus",
    label: { en: "Data platform", th: "แพลตฟอร์มข้อมูล", zh: "数据平台" },
  },
  {
    key: "businessModelStatus",
    label: { en: "Business model", th: "โมเดลธุรกิจ", zh: "商业模式" },
  },
  {
    key: "partnershipStatus",
    label: { en: "Partnerships", th: "พันธมิตร", zh: "伙伴关系" },
  },
] as const;

const LEAD_STEP_LABELS = {
  vision: { en: "Vision", th: "วิสัยทัศน์", zh: "愿景" },
  infrastructure: { en: "Infrastructure", th: "โครงสร้างพื้นฐาน", zh: "基础设施" },
  data_platform: { en: "Data platform", th: "แพลตฟอร์มข้อมูล", zh: "数据平台" },
  business_model: { en: "Business model", th: "โมเดลธุรกิจ", zh: "商业模式" },
  partnerships: { en: "Partnerships", th: "พันธมิตร", zh: "伙伴关系" },
} as const;

const DATA_CONFIDENCE_LABELS = {
  high: { en: "High confidence", th: "ความเชื่อมั่นสูง", zh: "高置信度" },
  medium: { en: "Medium confidence", th: "ความเชื่อมั่นปานกลาง", zh: "中等置信度" },
  low: { en: "Low confidence", th: "ความเชื่อมั่นต่ำ", zh: "低置信度" },
} as const;

function formatIsoDate(value: string): string {
  return value.slice(0, 10);
}

function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat("en-US", options).format(value);
}

function formatCompactPeople(thousands: number): string {
  const actual = thousands * 1000;
  return formatNumber(actual, {
    notation: "compact",
    maximumFractionDigits: actual >= 1_000_000 ? 1 : 0,
  });
}

function formatBahtCompact(value: number): string {
  return `THB ${formatNumber(value, {
    notation: "compact",
    maximumFractionDigits: 1,
  })}`;
}

function formatFdiMillions(value: number): string {
  if (value >= 1000) {
    return `THB ${formatNumber(value / 1000, { maximumFractionDigits: 1 })}B`;
  }
  return `THB ${formatNumber(value, { maximumFractionDigits: 0 })}M`;
}

function formatAreaKm2(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: value < 10 ? 1 : 0 })} km²`;
}

function formatDensity(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} / km²`;
}

function RadarChart({
  scores,
  locale,
}: {
  scores: Record<ScoringPillar, number>;
  locale: Locale;
}) {
  const cx = 140;
  const cy = 140;
  const maxR = 110;
  const angleStep = (2 * Math.PI) / SCORING_PILLARS.length;
  const startAngle = -Math.PI / 2;

  const getPoint = (index: number, value: number) => {
    const angle = startAngle + index * angleStep;
    const radius = (value / 100) * maxR;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  };

  const rings = [25, 50, 75, 100];
  const dataPoints = SCORING_PILLARS.map((pillar, index) => getPoint(index, scores[pillar]));
  const dataPath =
    dataPoints.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`).join(" ") +
    " Z";

  return (
    <svg viewBox="0 0 280 280" className="radar-chart" role="img">
      {rings.map(ring => {
        const points = SCORING_PILLARS.map((_, index) => getPoint(index, ring));
        const path =
          points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x},${point.y}`).join(" ") +
          " Z";
        return (
          <path
            key={ring}
            d={path}
            fill="none"
            stroke="var(--n-100)"
            strokeWidth="1"
          />
        );
      })}

      {SCORING_PILLARS.map((_, index) => {
        const point = getPoint(index, 100);
        return (
          <line
            key={index}
            x1={cx}
            y1={cy}
            x2={point.x}
            y2={point.y}
            stroke="var(--n-100)"
            strokeWidth="1"
          />
        );
      })}

      <path d={dataPath} fill="rgba(26, 26, 255, 0.08)" stroke="var(--a-500)" strokeWidth="2" />

      {dataPoints.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="3.5"
          fill={PILLAR_COLORS[SCORING_PILLARS[index]]}
        />
      ))}

      {SCORING_PILLARS.map((pillar, index) => {
        const point = getPoint(index, 123);
        return (
          <text
            key={pillar}
            x={point.x}
            y={point.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontFamily="var(--font-data)"
            fontWeight="600"
            fill="var(--n-900)"
          >
            {PILLAR_SHORT_LABELS[locale][pillar]}
          </text>
        );
      })}
    </svg>
  );
}

function StatBar({
  pillar,
  value,
  locale,
}: {
  pillar: ScoringPillar;
  value: number;
  locale: Locale;
}) {
  return (
    <div className="data-row stat-row">
      <span className="data-label stat-label">{PILLAR_LABELS[locale][pillar]}</span>
      <div className="stat-track">
        <div
          className="stat-fill"
          style={{
            width: `${value}%`,
            backgroundColor: PILLAR_COLORS[pillar],
          }}
        />
      </div>
      <span className="data-value stat-value">{value}</span>
    </div>
  );
}

export default function CityDetailPage({ cityId, locale, onNavigate }: Props) {
  const { data: city, loading } = useCityDetail(cityId);
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  const dossier = useMemo(() => {
    if (!city) return null;

    const readySteps = DELIVERY_STEPS.filter(step => city.deliveryProfile[step.key] === "ready");
    const buildingSteps = DELIVERY_STEPS.filter(
      step => city.deliveryProfile[step.key] === "building",
    );
    const gapSteps = DELIVERY_STEPS.filter(step => city.deliveryProfile[step.key] === "gap");
    const confidence = city.dataConfidence ?? "medium";

    return {
      readySteps,
      buildingSteps,
      gapSteps,
      confidenceLabel: DATA_CONFIDENCE_LABELS[confidence][locale],
      operatingSummary:
        city.reality === "operational"
          ? t({
              en: "Established dataset with visible operating systems and verifiable service logic.",
              th: "มีชุดข้อมูลและระบบที่ดำเนินงานจริง พร้อมตรรกะการให้บริการที่ตรวจสอบได้",
              zh: "数据集与运营系统已建立，服务逻辑可被验证。",
            })
          : t({
              en: "Deployment remains partial. Treat the city as a work-in-progress rather than a closed performance story.",
              th: "การติดตั้งยังไม่สมบูรณ์ ควรอ่านเมืองนี้เป็นงานที่ยังเดินอยู่ ไม่ใช่เรื่องเล่าที่ปิดจบแล้ว",
              zh: "部署仍然部分完成。应将其视为进行中的工作，而不是完整收官的成绩故事。",
            }),
      gapSummary: t({
        en: "The weakest points are where institutional capacity, maintenance rhythm, and data continuity still fall short.",
        th: "จุดอ่อนคือบริเวณที่ศักยภาพสถาบัน จังหวะการบำรุงรักษา และความต่อเนื่องของข้อมูลยังไม่ถึง",
        zh: "短板主要在机构能力、维护节奏与数据连续性不足的地方。",
      }),
    };
  }, [city, locale]);

  if (loading || !city || !dossier) {
    return (
      <section className="section reveal visible">
        <div className="data-sheet loading-sheet">
          <p className="eyebrow">SCITI</p>
          <h1 className="section-title">
            {t({
              en: "Preparing city dossier.",
              th: "กำลังเตรียมแฟ้มเมือง",
              zh: "正在准备城市档案。",
            })}
          </h1>
        </div>
      </section>
    );
  }

  const cityName = getCityName(city, locale);
  const provinceName = getProvinceName(city, locale);
  const cityPhoto = getCityPhotoAsset(city);
  const developability = computeDevelopability(city);
  const financing = getFinancingAdvice(city);
  const externalLinks = getCityExternalResearchLinks(city);
  const tailoredSteps = getTailoredSteps(city).slice(0, 3);
  const tierLabel = TIER_LABELS[locale][city.tier];
  const leadStepLabel =
    LEAD_STEP_LABELS[city.deliveryProfile.recommendedLeadStep][locale];
  const population = getResolvedPopulationThousand(city).value ?? 0;
  const area = getResolvedLandAreaKm2(city).value ?? 0;
  const density = getPopulationDensityPerKm2(city).value ?? 0;

  return (
    <div className="city-dossier">
      <section className="section hero-signage reveal visible">
        <div className="city-header-grid">
          <div>
            <p className="eyebrow">
              {t({
                en: "Field sheet / SCITI 2026",
                th: "สนามข้อมูล / SCITI 2569",
                zh: "城市现场表 / SCITI 2026",
              })}
            </p>
            <h1 className="hero-title">{cityName}</h1>
            <p className="city-masthead-note">{provinceName}</p>
            <p className="hero-strapline">{getCityTagline(city, locale)}</p>
          </div>

          <div className="data-sheet city-score-sheet">
            <div className="data-label">
              {t({ en: "Composite score", th: "คะแนนรวม", zh: "综合得分" })}
            </div>
            <div className="city-score-value">{city.compositeScore.toFixed(1)}</div>
            <div className="city-score-meta">
              {tierLabel} · {getCityStatusLabel(city.status, locale)}
            </div>
          </div>
        </div>

        <div className="index-summary-grid city-summary-grid">
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Official status", th: "สถานะทางการ", zh: "官方状态" })}
            </div>
            <div className="summary-value summary-value-small">
              {getCityStatusLabel(city.status, locale)}
            </div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">{t({ en: "Reality", th: "ความจริง", zh: "现实状态" })}</div>
            <div className="summary-value summary-value-small">
              {getCityRealityLabel(city.reality, locale)}
            </div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Lead step", th: "ขั้นนำ", zh: "领先步骤" })}
            </div>
            <div className="summary-value summary-value-small">{leadStepLabel}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Evidence items", th: "จำนวนหลักฐาน", zh: "证据条目" })}
            </div>
            <div className="summary-value summary-value-small">{city.evidenceItems.length}</div>
          </div>
        </div>

        <div className="cta-actions">
          <button className="btn btn-secondary" onClick={() => onNavigate("/rankings")}>
            {t({
              en: "Back to rankings",
              th: "กลับสู่อันดับ",
              zh: "返回排名",
            })}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => downloadCsv(`${city.id}-city-facts.csv`, getCityFactsCsv(city.id))}
          >
            {t({ en: "Export city CSV", th: "ส่งออก CSV เมือง", zh: "导出城市 CSV" })}
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            {t({
              en: "Print dossier (PDF)",
              th: "พิมพ์แฟ้ม (PDF)",
              zh: "打印档案 (PDF)",
            })}
          </button>
        </div>

        {city.status === "registered" ? (
          <div className="data-sheet proposal-notice">
            <p className="eyebrow">Registered Smart City Proposal</p>
            <h2 className="section-title">Registered proposal profile</h2>
            <p className="data-note">Read this as a proposal stub.</p>
          </div>
        ) : null}
      </section>

      <section className="section reveal visible">
        <div className="city-fields-grid">
          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({
                en: "What is real now, what is missing, and what unlocks the next step",
                th: "อะไรคือของจริงตอนนี้ อะไรยังขาด และอะไรปลดล็อกขั้นต่อไป",
                zh: "现在什么是真实的，什么仍然缺失，下一步由什么解锁",
              })}
            </h2>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Operating read", th: "ภาพรวมการเดินระบบ", zh: "运行判断" })}
              </span>
              <span className="data-value field-value-wide">{dossier.operatingSummary}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Main gap", th: "ช่องว่างหลัก", zh: "主要缺口" })}
              </span>
              <span className="data-value field-value-wide">{dossier.gapSummary}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Confidence", th: "ความเชื่อมั่น", zh: "置信度" })}
              </span>
              <span className="data-value">{dossier.confidenceLabel}</span>
            </div>
            <div className="delivery-ledger-grid">
              <div>
                <div className="data-label">
                  {t({ en: "Ready", th: "พร้อม", zh: "就绪" })}
                </div>
                <ul className="ledger-list">
                  {dossier.readySteps.map(step => (
                    <li key={step.key}>{step.label[locale]}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="data-label">
                  {t({ en: "Building", th: "กำลังสร้าง", zh: "建设中" })}
                </div>
                <ul className="ledger-list">
                  {dossier.buildingSteps.map(step => (
                    <li key={step.key}>{step.label[locale]}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="data-label">
                  {t({ en: "Gap", th: "ยังขาด", zh: "缺口" })}
                </div>
                <ul className="ledger-list">
                  {dossier.gapSteps.map(step => (
                    <li key={step.key}>{step.label[locale]}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Score profile", th: "โปรไฟล์คะแนน", zh: "得分轮廓" })}
            </h2>
            <RadarChart scores={city.scores} locale={locale} />
            <div className="stat-list">
              {SCORING_PILLARS.map(pillar => (
                <StatBar key={pillar} pillar={pillar} value={city.scores[pillar]} locale={locale} />
              ))}
            </div>
          </div>

          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Factbook", th: "สมุดข้อมูล", zh: "事实册" })}
            </h2>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Population", th: "ประชากร", zh: "人口" })}
              </span>
              <span className="data-value">{formatCompactPeople(population)}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Land area", th: "พื้นที่", zh: "面积" })}
              </span>
              <span className="data-value">{formatAreaKm2(area)}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Density", th: "ความหนาแน่น", zh: "密度" })}
              </span>
              <span className="data-value">{formatDensity(density)}</span>
            </div>
            <div className="data-row">
              <span className="data-label">GPP / Capita</span>
              <span className="data-value">
                {city.metrics.gppPerCapita ? formatBahtCompact(city.metrics.gppPerCapita) : "N/A"}
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">FDI</span>
              <span className="data-value">
                {city.metrics.fdiInflow ? formatFdiMillions(city.metrics.fdiInflow) : "N/A"}
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">PM2.5</span>
              <span className="data-value">
                {city.metrics.pm25Annual ? `${city.metrics.pm25Annual} μg/m³` : "N/A"}
              </span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Verified", th: "ตรวจสอบแล้ว", zh: "已核验" })}
              </span>
              <span className="data-value">{formatIsoDate(city.freshness.lastVerifiedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <div className="city-fields-grid">
          <div className="data-sheet evidence-photo-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Supporting evidence", th: "หลักฐานประกอบ", zh: "支撑证据" })}
            </h2>
            <div className="supporting-photo">
              <ResponsiveImage
                src={cityPhoto.src}
                alt={t({
                  en: `${cityName} supporting photo`,
                  th: `ภาพประกอบของ ${cityName}`,
                  zh: `${cityName} 支撑照片`,
                })}
                className="city-support-image"
                style={{ objectPosition: cityPhoto.objectPosition }}
              />
            </div>
            <p className="data-note">
              {t({
                en: "Photo evidence is supporting context only. The score is anchored in source rails and structured records.",
                th: "ภาพถ่ายเป็นเพียงบริบทประกอบ คะแนนยึดโยงกับแหล่งข้อมูลและบันทึกเชิงโครงสร้าง",
                zh: "照片只是辅助背景。评分真正锚定在来源轨道与结构化记录上。",
              })}
            </p>
          </div>

          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Evidence ledger", th: "บัญชีหลักฐาน", zh: "证据台账" })}
            </h2>
            <ul className="evidence-ledger">
              {city.evidenceItems.slice(0, 6).map(item => (
                <li key={`${item.cityId}-${item.titleEn}`} className="evidence-ledger-item">
                  <div className="evidence-ledger-meta">
                    <span className="data-label">{item.source}</span>
                    <span className="data-note">{item.date}</span>
                  </div>
                  <p className="evidence-ledger-title">
                    {locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <div className="city-fields-grid">
          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Finance ladder", th: "บันไดการเงิน", zh: "融资阶梯" })}
            </h2>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Primary instrument", th: "เครื่องมือหลัก", zh: "主要工具" })}
              </span>
              <span className="data-value">{city.financeSignal.leadInstrumentName}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Developability", th: "ศักยภาพพัฒนา", zh: "可开发性" })}
              </span>
              <span className="data-value">{developability.total}%</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Lead step", th: "ขั้นนำ", zh: "领先步骤" })}
              </span>
              <span className="data-value">{leadStepLabel}</span>
            </div>
            <p className="data-note">{t({ en: financing.primaryInstrument, th: financing.primaryInstrumentTh, zh: financing.primaryInstrumentZh })}</p>
            <div className="subsection-rule" />
            <ul className="ledger-list">
              {tailoredSteps.map(step => (
                <li key={step.step}>
                  <strong>{locale === "th" ? step.stepTh : locale === "zh" ? step.stepZh : step.step}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="data-sheet">
            <h2 className="data-sheet-title">
              {t({ en: "Source list", th: "รายการแหล่งข้อมูล", zh: "来源清单" })}
            </h2>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Last verified", th: "ตรวจสอบล่าสุด", zh: "最近核验" })}
              </span>
              <span className="data-value">{formatIsoDate(city.freshness.lastVerifiedAt)}</span>
            </div>
            <div className="data-row">
              <span className="data-label">
                {t({ en: "Confidence", th: "ความเชื่อมั่น", zh: "置信度" })}
              </span>
              <span className="data-value">{dossier.confidenceLabel}</span>
            </div>
            <ul className="source-link-list">
              {externalLinks.map(link => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="source-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">
            {t({
              en: "Printable baseline for investment discussions",
              th: "ฐานพิมพ์ได้สำหรับการคุยเรื่องการลงทุน",
              zh: "可打印的投资讨论基线",
            })}
          </h2>
          <p className="cta-text">
            {t({
              en: "Use this sheet as the factual baseline for city reviews, investment screening, and delivery planning.",
              th: "ใช้แผ่นข้อมูลนี้เป็นฐานข้อเท็จจริงสำหรับการทบทวนเมือง คัดกรองการลงทุน และวางแผนการส่งมอบ",
              zh: "将这份表单作为城市审查、投资筛选与交付规划的事实基线。",
            })}
          </p>
          <div className="cta-actions">
            <button className="btn btn-primary" onClick={() => onNavigate("/rankings")}>
              {t({
                en: "Return to index",
                th: "กลับสู่ดัชนี",
                zh: "返回指数",
              })}
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate("/references")}>
              {t({
                en: "Inspect references",
                th: "ตรวจดูเอกสารอ้างอิง",
                zh: "查看参考资料",
              })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
