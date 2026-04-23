import { useMemo } from "react";
import {
  getPopulationDensityPerKm2,
  getResolvedLandAreaKm2,
  getResolvedPopulationThousand,
} from "./adminBaselines";
import { useCityDetail } from "./cityApi";
import { getCityExternalResearchLinks, getCityFactsCsv } from "./cityCdp";
import {
  getCityName,
  getCityStatusLabel,
  getCityTagline,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { downloadCsv } from "./csvDownload";
import { SCORING_PILLARS } from "./scoring";
import type { Locale, ScoringPillar } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, TIER_LABELS } from "./types";

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

function formatAreaKm2(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: value < 10 ? 1 : 0 })} km²`;
}

function formatDensity(value: number): string {
  return `${formatNumber(value, { maximumFractionDigits: 0 })} / km²`;
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
  const externalLinks = getCityExternalResearchLinks(city);
  const tierLabel = TIER_LABELS[locale][city.tier];
  const leadStepLabel = LEAD_STEP_LABELS[city.deliveryProfile.recommendedLeadStep][locale];
  const population = getResolvedPopulationThousand(city).value ?? 0;
  const area = getResolvedLandAreaKm2(city).value ?? 0;
  const density = getPopulationDensityPerKm2(city).value ?? 0;

  return (
    <div className="city-dossier">
      <section className="section reveal visible">
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
      </section>

      {city.status === "registered" && (
        <section className="section reveal visible">
          <div className="data-sheet proposal-notice">
            <div className="data-label">Registered Smart City Proposal</div>
            <div className="data-value">Registered proposal profile</div>
            <p className="data-note">Read this as a proposal stub.</p>
          </div>
        </section>
      )}

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Operational read",
            th: "การอ่านเชิงปฏิบัติการ",
            zh: "运营解读",
          })}
        </p>
        <h2 className="section-title">
          {t({
            en: "What is real now, what is missing, and what unlocks the next step",
            th: "อะไรจริงอยู่ตอนนี้ อะไรยังขาด และอะไรจะปลดล็อกขั้นถัดไป",
            zh: "现在什么是真的、什么还缺、以及下一步靠什么被打开",
          })}
        </h2>
        <div className="data-sheet">
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Current read", th: "ภาพปัจจุบัน", zh: "当前判断" })}
              </div>
            </div>
            <p className="data-note">{dossier.operatingSummary}</p>
          </div>
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Weakest edge", th: "ขอบที่อ่อนที่สุด", zh: "最弱的一边" })}
              </div>
            </div>
            <p className="data-note">{dossier.gapSummary}</p>
          </div>
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Lead step", th: "ขั้นนำ", zh: "主导步骤" })}
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div className="data-value">{leadStepLabel}</div>
              <p className="data-note">{city.financeSignal.line[locale]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Printable baseline",
            th: "ฐานข้อมูลพิมพ์ได้",
            zh: "可打印基线",
          })}
        </p>
        <h2 className="section-title">
          {t({
            en: "Printable baseline for investment discussions",
            th: "ฐานข้อมูลสำหรับการคุยด้านการลงทุน",
            zh: "用于投资讨论的可打印基线",
          })}
        </h2>
        <div className="data-sheet">
          <div className="data-row">
            <div className="data-label">{t({ en: "Population", th: "ประชากร", zh: "人口" })}</div>
            <div className="data-value">{formatCompactPeople(population)}</div>
          </div>
          <div className="data-row">
            <div className="data-label">{t({ en: "Land area", th: "พื้นที่", zh: "面积" })}</div>
            <div className="data-value">{formatAreaKm2(area)}</div>
          </div>
          <div className="data-row">
            <div className="data-label">
              {t({ en: "Density", th: "ความหนาแน่น", zh: "密度" })}
            </div>
            <div className="data-value">{formatDensity(density)}</div>
          </div>
          <div className="data-row">
            <div className="data-label">
              {t({ en: "Data confidence", th: "ความเชื่อมั่นข้อมูล", zh: "数据置信度" })}
            </div>
            <div className="data-value">{dossier.confidenceLabel}</div>
          </div>
          <div className="data-row">
            <div className="data-label">
              {t({ en: "Latest observed", th: "อัปเดตล่าสุด", zh: "最近观测" })}
            </div>
            <div className="data-value">{formatIsoDate(city.exportMetadata.latestObservedAt)}</div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Pillar breakdown",
            th: "แจกแจงเสาหลัก",
            zh: "支柱分解",
          })}
        </p>
        <div className="data-sheet stat-list">
          {SCORING_PILLARS.map(pillar => (
            <StatBar key={pillar} pillar={pillar} value={city.scores[pillar]} locale={locale} />
          ))}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Delivery stack",
            th: "สแต็กการส่งมอบ",
            zh: "交付栈",
          })}
        </p>
        <div className="delivery-ledger-grid">
          <div className="data-sheet">
            <div className="data-sheet-title">
              {t({ en: "Ready", th: "พร้อม", zh: "已就绪" })}
            </div>
            <ul className="ledger-list">
              {dossier.readySteps.map(step => (
                <li key={step.key}>{translate(locale, step.label)}</li>
              ))}
            </ul>
          </div>
          <div className="data-sheet">
            <div className="data-sheet-title">
              {t({ en: "Building", th: "กำลังสร้าง", zh: "建设中" })}
            </div>
            <ul className="ledger-list">
              {dossier.buildingSteps.map(step => (
                <li key={step.key}>{translate(locale, step.label)}</li>
              ))}
            </ul>
          </div>
          <div className="data-sheet">
            <div className="data-sheet-title">
              {t({ en: "Gap", th: "ยังขาด", zh: "缺口" })}
            </div>
            <ul className="ledger-list">
              {dossier.gapSteps.map(step => (
                <li key={step.key}>{translate(locale, step.label)}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Evidence ledger",
            th: "บัญชีหลักฐาน",
            zh: "证据总账",
          })}
        </p>
        <div className="data-sheet">
          {city.evidenceItems.slice(0, 5).map(item => (
            <div key={`${item.titleEn}-${item.date}`} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{item.source}</div>
                <div className="data-note">{item.date}</div>
              </div>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div className="data-value">
                  {locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}
                </div>
                <p className="data-note">
                  {item.metric && item.value
                    ? `${item.metric}: ${item.value}`
                    : t({
                        en: `Filed as ${item.type} evidence.`,
                        th: `จัดเก็บเป็นหลักฐานประเภท ${item.type}`,
                        zh: `作为 ${item.type} 类型证据存档。`,
                      })}
                </p>
              </div>
            </div>
          ))}
          {externalLinks.length > 0 && (
            <div className="subsection-rule">
              <ul className="source-link-list">
                {externalLinks.slice(0, 4).map(link => (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Finance path",
            th: "เส้นทางการเงิน",
            zh: "融资路径",
          })}
        </p>
        <div className="data-sheet">
          {city.financeRecommendations.slice(0, 3).map(recommendation => (
            <div key={recommendation.id} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{recommendation.instrumentName}</div>
              </div>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div className="data-value">{recommendation.reasonSummary[locale]}</div>
                <p className="data-note">{recommendation.nextStep[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">
            {t({
              en: "Export and continue",
              th: "ส่งออกและไปต่อ",
              zh: "导出并继续",
            })}
          </h2>
          <p className="cta-text">
            {t({
              en: "The city dossier is designed to be used in working meetings: export the facts, open the evidence, or move back into the full rankings table.",
              th: "แฟ้มเมืองออกแบบมาเพื่อใช้ในห้องประชุมจริง: ส่งออกข้อเท็จจริง เปิดหลักฐาน หรือกลับไปที่ตารางจัดอันดับทั้งหมด",
              zh: "城市档案就是为工作会议准备的：导出事实、打开证据，或者回到完整的排行榜表面。",
            })}
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => downloadCsv(`${city.id}-facts.csv`, getCityFactsCsv(city.id))}
            >
              Export city CSV
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => onNavigate("/rankings")}>
              {t({ en: "Back to rankings", th: "กลับไปที่อันดับ", zh: "返回排名" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
