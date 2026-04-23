import { useMemo, useState } from "react";
import NewsStrip from "./NewsStrip";
import { useCitySummaries } from "./cityApi";
import { filterCities, sortCities, summarizeCities } from "./cityCollections";
import {
  getCityName,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { downloadCsv } from "./csvDownload";
import { getCitySummariesCsv } from "./cityCdp";
import { SCORING_PILLARS } from "./scoring";
import type { Locale, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_SHORT_LABELS, TIER_LABELS } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function toAppPath(path: string): string {
  const base = import.meta.env.BASE_URL || "/";
  const prefix = base === "/" ? "" : base.replace(/\/$/, "");
  return path === "/" ? `${prefix}/` || "/" : `${prefix}${path}`;
}

function RankingRow({
  city,
  index,
  locale,
  onNavigate,
}: {
  city: SmartCity;
  index: number;
  locale: Locale;
  onNavigate: (path: string) => void;
}) {
  const cityPath = `/city/${city.id}`;

  return (
    <a
      href={toAppPath(cityPath)}
      className="dashboard-ranking-row"
      onClick={event => {
        event.preventDefault();
        onNavigate(cityPath);
      }}
    >
      <span className="dashboard-ranking-position">#{String(index + 1).padStart(2, "0")}</span>

      <div className="dashboard-ranking-summary">
        <span className="dashboard-ranking-name">{getCityName(city, locale)}</span>
        <span className="dashboard-ranking-caption">
          {getProvinceName(city, locale)} · {TIER_LABELS[locale][city.tier]} · {getCityStatusLabel(city.status, locale)}
        </span>
      </div>

      <div className="ranking-pillar-grid" aria-hidden="true">
        {SCORING_PILLARS.map(pillar => (
          <span key={pillar} className="ranking-pillar-cell">
            <span className="ranking-pillar-code">{PILLAR_SHORT_LABELS[locale][pillar]}</span>
            <span className="ranking-pillar-track">
              <span
                className="ranking-pillar-fill"
                style={{
                  width: `${city.scores[pillar]}%`,
                  backgroundColor: PILLAR_COLORS[pillar],
                }}
              />
            </span>
          </span>
        ))}
      </div>

      <div className="dashboard-ranking-score">
        <span className="data-label">
          {translate(locale, { en: "Composite", th: "รวม", zh: "综合" })}
        </span>
        <strong>{city.compositeScore.toFixed(1)}</strong>
      </div>
    </a>
  );
}

export default function HomePage({ locale, onNavigate }: Props) {
  const [statusFilter, setStatusFilter] = useState<"all" | "certified" | "promotion">("all");
  const [heroRef, heroVisible] = useInView(0.1);
  const [rankingRef, rankingVisible] = useInView(0.1);
  const [transparencyRef, transparencyVisible] = useInView(0.1);
  const { data: cities } = useCitySummaries();

  const stats = useMemo(() => summarizeCities(cities), [cities]);
  const previewCities = useMemo(
    () =>
      sortCities(
        filterCities(cities, {
          status: statusFilter,
          tier: "all",
        }),
      ).slice(0, 12),
    [cities, statusFilter],
  );

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  return (
    <div className="home-dashboard">
      <section
        ref={heroRef}
        className={`section hero-signage reveal ${heroVisible ? "visible" : ""}`}
      >
        <div className="hero-signage-grid">
          <div>
            <p className="eyebrow">
              {t({
                en: "Release ledger / April 2026",
                th: "บันทึกการเผยแพร่ / เมษายน 2569",
                zh: "发布记录 / 2026 年 4 月",
              })}
            </p>
            <h1 className="hero-title">
              {t({
                en: "Smart City Thailand Index 2026",
                th: "ดัชนีเมืองอัจฉริยะประเทศไทย 2569",
                zh: "2026 泰国智慧城市指数",
              })}
            </h1>
            <p className="hero-strapline">
              {t({
                en: "An evidence-first index of certified and promoted smart-city zones. The opening surface is the record itself: coverage, method, and comparative performance.",
                th: "ดัชนีที่ยึดหลักฐานเป็นฐานสำหรับเมืองอัจฉริยะที่ได้รับการรับรองและเขตส่งเสริม พื้นที่แรกของหน้าแสดงบันทึกจริง: ขอบเขต วิธีการ และผลการเปรียบเทียบ",
                zh: "以证据为优先的智慧城市指数，覆盖认证城市与推广区域。首页首先展示记录本身：覆盖范围、方法与对比表现。",
              })}
            </p>
          </div>

          <div className="hero-ledger-grid">
            <div className="data-sheet">
              <div className="data-sheet-title">
                {t({ en: "Release status", th: "สถานะการเผยแพร่", zh: "发布状态" })}
              </div>
              <div className="data-row">
                <span className="data-label">
                  {t({ en: "Edition", th: "ฉบับ", zh: "版本" })}
                </span>
                <span className="data-value">SCITI 2026 / IND</span>
              </div>
              <div className="data-row">
                <span className="data-label">
                  {t({ en: "Coverage", th: "ขอบเขต", zh: "覆盖范围" })}
                </span>
                <span className="data-value">{stats.total} nodes</span>
              </div>
              <div className="data-row">
                <span className="data-label">
                  {t({ en: "Method", th: "วิธีการ", zh: "方法" })}
                </span>
                <span className="data-value">
                  {t({
                    en: "Weighted seven-pillar audit",
                    th: "การตรวจสอบถ่วงน้ำหนัก 7 เสาหลัก",
                    zh: "七支柱加权审计",
                  })}
                </span>
              </div>
            </div>

            <div className="data-sheet">
              <div className="data-sheet-title">
                {t({ en: "Direct access", th: "ทางลัด", zh: "直达入口" })}
              </div>
              <div className="cta-actions cta-actions-inline">
                <button className="btn btn-secondary" onClick={() => onNavigate("/methodology")}>
                  {t({ en: "Methodology", th: "ระเบียบวิธี", zh: "方法论" })}
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate("/audit")}>
                  {t({ en: "Audit file", th: "แฟ้มตรวจสอบ", zh: "审计档案" })}
                </button>
                <button className="btn btn-secondary" onClick={() => onNavigate("/references")}>
                  {t({ en: "Sources", th: "แหล่งข้อมูล", zh: "来源" })}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="index-summary-grid">
          <div className="data-sheet summary-cell">
            <div className="data-label">{t({ en: "Total cities", th: "เมืองทั้งหมด", zh: "城市总数" })}</div>
            <div className="summary-value">{stats.total}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">{t({ en: "Certified", th: "รับรองแล้ว", zh: "已认证" })}</div>
            <div className="summary-value">{stats.certified}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Operational", th: "ใช้งานจริง", zh: "已运行" })}
            </div>
            <div className="summary-value">{stats.operational}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">{t({ en: "Alpha tier", th: "ระดับ Alpha", zh: "Alpha 层级" })}</div>
            <div className="summary-value">{stats.alpha}</div>
          </div>
        </div>
      </section>

      <section
        ref={rankingRef}
        className={`section reveal ${rankingVisible ? "visible" : ""}`}
      >
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {t({
                en: "Comparative record",
                th: "บันทึกการเปรียบเทียบ",
                zh: "对比记录",
              })}
            </p>
            <h2 className="section-title">
              {t({
                en: "Operational leaderboard",
                th: "กระดานอันดับเชิงปฏิบัติการ",
                zh: "运营排行榜",
              })}
            </h2>
          </div>

          <div className="filter-group">
            <button
              type="button"
              className={`btn-tab ${statusFilter === "all" ? "active" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              {t({ en: "All", th: "ทั้งหมด", zh: "全部" })}
            </button>
            <button
              type="button"
              className={`btn-tab ${statusFilter === "certified" ? "active" : ""}`}
              onClick={() => setStatusFilter("certified")}
            >
              {t({ en: "Certified", th: "รับรอง", zh: "认证" })}
            </button>
            <button
              type="button"
              className={`btn-tab ${statusFilter === "promotion" ? "active" : ""}`}
              onClick={() => setStatusFilter("promotion")}
            >
              {t({ en: "Promotion", th: "ส่งเสริม", zh: "推广" })}
            </button>
          </div>
        </div>

        <div className="dashboard-ranking-list">
          {previewCities.map((city, index) => (
            <RankingRow
              key={city.id}
              city={city}
              index={index}
              locale={locale}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="cta-actions">
          <button className="btn btn-primary" onClick={() => onNavigate("/rankings")}>
            {t({
              en: "Open full rankings",
              th: "เปิดอันดับทั้งหมด",
              zh: "打开完整排名",
            })}
          </button>
        </div>
      </section>

      <section
        ref={transparencyRef}
        className={`section reveal ${transparencyVisible ? "visible" : ""}`}
      >
        <p className="eyebrow">
          {t({
            en: "Methodological transparency",
            th: "ความโปร่งใสของระเบียบวิธี",
            zh: "方法透明度",
          })}
        </p>

        <div className="data-sheet">
          <div className="data-sheet-title">
            {t({
              en: "How the score is assembled",
              th: "คะแนนประกอบอย่างไร",
              zh: "分数如何构成",
            })}
          </div>

          <div className="formula-strip">
            Composite = {SCORING_PILLARS.map(pillar => PILLAR_SHORT_LABELS[locale][pillar]).join(" + ")}
          </div>

          <div className="transparency-grid">
            <div>
              <div className="data-label">{t({ en: "Step 01", th: "ขั้น 01", zh: "步骤 01" })}</div>
              <div className="data-value">
                {t({
                  en: "Institutional sources",
                  th: "แหล่งข้อมูลสถาบัน",
                  zh: "机构来源",
                })}
              </div>
              <p className="data-note">
                {t({
                  en: "Government, field, and open data rails. No self-scored survey theater.",
                  th: "รางข้อมูลจากรัฐ ภาคสนาม และข้อมูลเปิด ไม่มีการให้คะแนนตัวเองแบบโชว์",
                  zh: "政府、田野与开放数据轨道。不做自我评分式表演。",
                })}
              </p>
            </div>
            <div>
              <div className="data-label">{t({ en: "Step 02", th: "ขั้น 02", zh: "步骤 02" })}</div>
              <div className="data-value">
                {t({
                  en: "Weighted pillars",
                  th: "เสาหลักถ่วงน้ำหนัก",
                  zh: "加权支柱",
                })}
              </div>
              <p className="data-note">
                {t({
                  en: "Livability and economy lead the weighting. Digital remains a supporting pillar, not the headline.",
                  th: "ความน่าอยู่และเศรษฐกิจนำค่าน้ำหนัก ดิจิทัลเป็นเสารอง ไม่ใช่พาดหัว",
                  zh: "宜居与经济权重最高。数字化是支撑项，不是头条。",
                })}
              </p>
            </div>
            <div>
              <div className="data-label">{t({ en: "Step 03", th: "ขั้น 03", zh: "步骤 03" })}</div>
              <div className="data-value">
                {t({
                  en: "Public auditability",
                  th: "ตรวจสอบสาธารณะได้",
                  zh: "可公开审计",
                })}
              </div>
              <p className="data-note">
                {t({
                  en: "Scores, exports, and sources stay available so the index can be challenged and improved.",
                  th: "คะแนน ไฟล์ส่งออก และแหล่งข้อมูลเปิดไว้เพื่อให้ตรวจสอบและพัฒนาต่อได้",
                  zh: "分数、导出与来源保持开放，方便质疑与改进。",
                })}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <div className="cta-block">
          <h2 className="cta-title">
            {t({
              en: "Open data. Direct download.",
              th: "ข้อมูลเปิด ดาวน์โหลดได้ทันที",
              zh: "开放数据，直接下载。",
            })}
          </h2>
          <p className="cta-text">
            {t({
              en: "Every city summary is exportable from the client-side dataset. The point is traceability, not gating.",
              th: "สรุปข้อมูลทุกเมืองส่งออกได้จากชุดข้อมูลฝั่งไคลเอนต์ จุดสำคัญคือการตรวจสอบย้อนกลับ ไม่ใช่การกั้นสิทธิ์",
              zh: "每座城市摘要都可直接从前端数据集导出。重点是可追溯，而不是设门槛。",
            })}
          </p>
          <div className="cta-actions">
            <button
              className="btn btn-primary"
              onClick={() => downloadCsv("sciti-2026-summary.csv", getCitySummariesCsv())}
            >
              {t({
                en: "Download summary CSV",
                th: "ดาวน์โหลดสรุป CSV",
                zh: "下载摘要 CSV",
              })}
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate("/methodology")}>
              {t({
                en: "Read methodology",
                th: "อ่านระเบียบวิธี",
                zh: "阅读方法论",
              })}
            </button>
          </div>
        </div>
      </section>

      <NewsStrip locale={locale} />
    </div>
  );
}
