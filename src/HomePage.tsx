import { useMemo, useState } from "react";
import NewsStrip from "./NewsStrip";
import { filterCities, sortCities, summarizeCities } from "./cityCollections";
import { downloadCsv } from "./csvDownload";
import { getCitySummaries, getCitySummariesCsv } from "./cityCdp";
import {
  getCityName,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { Locale, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_SHORT_LABELS, TIER_LABELS } from "./types";

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
          {getProvinceName(city, locale)} · {TIER_LABELS[locale][city.tier]} ·{" "}
          {getCityStatusLabel(city.status, locale)}
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
  const cities = getCitySummaries();

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
      <section className="section reveal visible">
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
                en: "The page opens with the record itself: coverage, method, and the first comparative scan. No atmospheric hero, no podium theatre, just the index front page.",
                th: "หน้าแรกเปิดด้วยระเบียนจริง: ขอบเขต วิธีการ และการสแกนเปรียบเทียบชุดแรก ไม่มีฮีโร่เชิงบรรยากาศ ไม่มีโพเดียมโชว์ มีเพียงหน้าดัชนีที่อ่านงานได้ทันที",
                zh: "首页直接打开记录本身：覆盖范围、方法和第一轮对比扫描。没有氛围式英雄区，也没有领奖台戏法，只有真正可读的指数首页。",
              })}
            </p>
          </div>

          <div className="hero-ledger-grid">
            <div className="data-sheet">
              <div className="data-sheet-title">
                {t({ en: "Release status", th: "สถานะการเผยแพร่", zh: "发布状态" })}
              </div>
              <div className="data-row">
                <span className="data-label">{t({ en: "Edition", th: "ฉบับ", zh: "版本" })}</span>
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
              <div className="hero-actions">
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

        <div className="index-summary-grid" style={{ marginTop: "var(--space-3)" }}>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Total cities", th: "เมืองทั้งหมด", zh: "城市总数" })}
            </div>
            <div className="summary-value">{stats.total}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Certified", th: "รับรองแล้ว", zh: "已认证" })}
            </div>
            <div className="summary-value">{stats.certified}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Operational", th: "ใช้งานจริง", zh: "已运行" })}
            </div>
            <div className="summary-value">{stats.operational}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Alpha tier", th: "ระดับ Alpha", zh: "Alpha 层级" })}
            </div>
            <div className="summary-value">{stats.alpha}</div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
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
      </section>

      <section className="section reveal visible">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">
              {t({
                en: "Evidence surface",
                th: "พื้นผิวหลักฐาน",
                zh: "证据界面",
              })}
            </p>
            <h2 className="section-title">
              {t({
                en: "Downloads and full navigation",
                th: "ดาวน์โหลดและไปต่อทั้งชุด",
                zh: "下载与完整导航",
              })}
            </h2>
          </div>
        </div>

        <div className="data-sheet">
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Summary export", th: "สรุปส่งออก", zh: "摘要导出" })}
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.35rem", flex: 1 }}>
              <div className="data-value">
                {t({
                  en: "City summary CSV",
                  th: "ไฟล์ CSV สรุปเมือง",
                  zh: "城市摘要 CSV",
                })}
              </div>
              <p className="data-note">
                {t({
                  en: "Machine-readable snapshot of scores, tiers, and core baselines.",
                  th: "สแนปช็อตที่อ่านด้วยเครื่องได้ของคะแนน ระดับ และฐานข้อมูลหลัก",
                  zh: "一份机器可读的快照，包含分数、层级与核心基线。",
                })}
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => downloadCsv("sciti-city-summaries.csv", getCitySummariesCsv())}
            >
              {t({ en: "Download CSV", th: "ดาวน์โหลด CSV", zh: "下载 CSV" })}
            </button>
          </div>

          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Full navigation", th: "ไปยังทั้งชุด", zh: "进入完整列表" })}
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.35rem", flex: 1 }}>
              <div className="data-value">
                {t({
                  en: "Open the national rankings",
                  th: "เปิดอันดับระดับประเทศ",
                  zh: "打开全国排名",
                })}
              </div>
              <p className="data-note">
                {t({
                  en: "See all tiers, switch sorting logic, and compare cities side by side.",
                  th: "ดูครบทุกระดับ เปลี่ยนการเรียง และเทียบเมืองแบบข้างต่อข้าง",
                  zh: "查看所有层级，切换排序逻辑，并进行城市并排比较。",
                })}
              </p>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => onNavigate("/rankings")}>
              Open full rankings
            </button>
          </div>
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <p className="eyebrow">
          {t({
            en: "News feed",
            th: "ข่าวสาร",
            zh: "新闻流",
          })}
        </p>
        <NewsStrip locale={locale} />
      </section>
    </div>
  );
}
