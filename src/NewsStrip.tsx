import { useRef } from "react";
import { useInView } from "./useInView";
import { NEWS_ITEMS, TAG_COLORS, TAG_LABELS } from "./newsData";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

// ─── INDEX META ───
const INDEX_META = {
  lastUpdated: "2026-04-15",
  citiesTracked: 48,
  dataSources: 6,
  totalSignals: 420,
  provinces: 23,
};

export default function NewsStrip({ locale }: Props) {
  const [newsRef, newsVisible] = useInView(0.05);
  const [metaRef, metaVisible] = useInView(0.05);
  const [legalRef, legalVisible] = useInView(0.05);

  return (
    <>
      {/* ─── NEWS FEED ─── */}
      <section ref={newsRef} className={`section news-section reveal ${newsVisible ? "visible" : ""}`}>
        <div className="news-section-head">
          <div>
            <p className="eyebrow">
              {translate(locale, { en: "Smart City Intelligence", th: "ข่าวกรองเมืองอัจฉริยะ", zh: "智慧城市情报" })}
            </p>
            <h2 className="news-section-title">
              {translate(locale, { en: "Latest dispatches", th: "ข่าวล่าสุด", zh: "最新动态" })}
            </h2>
          </div>
          <span className="news-live-badge">
            <span className="news-live-dot" />
            {translate(locale, { en: "Updated weekly", th: "อัปเดตรายสัปดาห์", zh: "每周更新" })}
          </span>
        </div>

        <div className="news-grid">
          {NEWS_ITEMS.map(item => (
            <a
              key={item.id}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
            >
              <div className="news-card-tag" style={{ background: TAG_COLORS[item.tag] }}>
                {TAG_LABELS[item.tag][locale]}
              </div>
              <p className="news-card-title">{item.title[locale]}</p>
              <div className="news-card-meta">
                <span className="news-card-source">{item.source}</span>
                <span className="news-card-date">{item.date}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ─── DATA DENSITY STRIP ─── */}
      <section ref={metaRef} className={`data-density-section reveal ${metaVisible ? "visible" : ""}`}>
        <div className="section data-density-inner">
          <div className="data-density-grid">
            <div className="density-stat">
              <span className="density-value">{INDEX_META.citiesTracked}</span>
              <span className="density-label">
                {translate(locale, { en: "Cities tracked", th: "เมืองที่ติดตาม", zh: "追踪城市" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{INDEX_META.provinces}</span>
              <span className="density-label">
                {translate(locale, { en: "Provinces covered", th: "จังหวัดที่ครอบคลุม", zh: "覆盖省份" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{INDEX_META.totalSignals}</span>
              <span className="density-label">
                {translate(locale, { en: "Data signals", th: "สัญญาณข้อมูล", zh: "数据信号" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{INDEX_META.dataSources}</span>
              <span className="density-label">
                {translate(locale, { en: "Verified sources", th: "แหล่งข้อมูลที่ยืนยัน", zh: "经核实来源" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">7</span>
              <span className="density-label">
                {translate(locale, { en: "Scoring pillars", th: "เสาคะแนน", zh: "评分支柱" })}
              </span>
            </div>
            <div className="density-stat density-stat-date">
              <span className="density-value">{INDEX_META.lastUpdated}</span>
              <span className="density-label">
                {translate(locale, { en: "Index date", th: "วันที่ดัชนี", zh: "指数日期" })}
              </span>
            </div>
          </div>

          <div className="density-sources">
            <span className="density-sources-label">
              {translate(locale, { en: "Sources", th: "แหล่งข้อมูล", zh: "数据来源" })}:
            </span>
            <span>depa</span>
            <span>NSO</span>
            <span>NESDC</span>
            <span>GISTDA</span>
            <span>Open-Meteo</span>
            <span>Royal Thai Police</span>
          </div>
        </div>
      </section>

      {/* ─── LEGAL / COMPLIANCE STRIP ─── */}
      <section ref={legalRef} className={`legal-strip-section reveal ${legalVisible ? "visible" : ""}`}>
        <div className="section legal-strip-inner">
          <div className="legal-strip-grid">
            <div className="legal-block">
              <span className="legal-badge">CC BY 4.0</span>
              <p className="legal-text">
                {translate(locale, {
                  en: "Data freely reusable with attribution. Cite as: SCITI 2026, depa, Kingdom of Thailand.",
                  th: "ข้อมูลใช้ซ้ำได้อิสระพร้อมการอ้างอิง อ้างอิงเป็น: SCITI 2026, depa, ราชอาณาจักรไทย",
                  zh: "数据可免费使用，需注明来源。引用格式：SCITI 2026，depa，泰国王国。",
                })}
              </p>
            </div>
            <div className="legal-block">
              <span className="legal-badge legal-badge-pdpa">PDPA B.E. 2562</span>
              <p className="legal-text">
                {translate(locale, {
                  en: "No personal data collected. No cookies. No trackers. This is a static site — your data stays yours.",
                  th: "ไม่เก็บข้อมูลส่วนบุคคล ไม่มีคุกกี้ ไม่มีตัวติดตาม นี่คือเว็บไซต์สแตติก — ข้อมูลของคุณยังเป็นของคุณ",
                  zh: "不收集个人数据。无Cookie。无跟踪器。这是静态网站——您的数据属于您。",
                })}
              </p>
            </div>
            <div className="legal-block">
              <span className="legal-badge legal-badge-disclaimer">Disclaimer</span>
              <p className="legal-text">
                {translate(locale, {
                  en: "Scores are research estimates based on public data — not official government assessments. No city paid for its ranking. No investor paid for placement.",
                  th: "คะแนนเป็นการประเมินงานวิจัยจากข้อมูลสาธารณะ — ไม่ใช่การประเมินอย่างเป็นทางการของรัฐบาล ไม่มีเมืองใดจ่ายเพื่อการจัดอันดับ ไม่มีนักลงทุนใดจ่ายเพื่อการวางตำแหน่ง",
                  zh: "分数是基于公开数据的研究估算——不是政府官方评估。没有城市为其排名付费。没有投资者为位置付费。",
                })}
              </p>
            </div>
            <div className="legal-block">
              <span className="legal-badge legal-badge-standard">ISO 37122</span>
              <p className="legal-text">
                {translate(locale, {
                  en: "Methodology aligned with ISO 37122:2019 (smart city indicators), UN-Habitat CPI, and ASEAN Smart Cities Framework (ASCF).",
                  th: "วิธีการสอดคล้องกับ ISO 37122:2019 (ตัวชี้วัดเมืองอัจฉริยะ) UN-Habitat CPI และกรอบเมืองอัจฉริยะอาเซียน",
                  zh: "方法论与ISO 37122:2019（智慧城市指标）、联合国人居署CPI和东盟智慧城市框架（ASCF）保持一致。",
                })}
              </p>
            </div>
          </div>

          <p className="legal-footer-note">
            SCITI-2026-R1 · Built by depa Smart City Promotion Department ·{" "}
            <a href="mailto:non.ar@depa.or.th">non.ar@depa.or.th</a>
          </p>
        </div>
      </section>
    </>
  );
}
