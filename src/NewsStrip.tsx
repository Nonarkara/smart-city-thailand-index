import { useInView } from "./useInView";
import { NEWS_ITEMS, TAG_COLORS, TAG_LABELS } from "./newsData";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { useCitySummaries } from "./cityApi";
import { CDP_PLATFORM_COUNT, EVIDENCE_SOURCE_FAMILY_COUNT, SCITI_DATA_CUTOFF_ISO } from "./methodologySpec";
import { SCORING_PILLARS } from "./scoring";

interface Props {
  locale: Locale;
}


export default function NewsStrip({ locale }: Props) {
  const { data: cities } = useCitySummaries();
  const provinceCount = new Set(cities.map(city => city.province)).size;
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
              {translate(locale, { en: "Selected reading", th: "บทอ่านคัดสรร", zh: "精选阅读" })}
            </h2>
          </div>
          <span className="news-live-badge">
            <span className="news-live-dot" />
            {translate(locale, { en: "Dated articles", th: "บทความระบุวันที่", zh: "文章附日期" })}
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
              {item.summary && (
                <p className="news-card-summary">{item.summary[locale]}</p>
              )}
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
              <span className="density-value">{cities.length}</span>
              <span className="density-label">
                {translate(locale, { en: "Cities tracked", th: "เมืองที่ติดตาม", zh: "追踪城市" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{provinceCount}</span>
              <span className="density-label">
                {translate(locale, { en: "Provinces covered", th: "จังหวัดที่ครอบคลุม", zh: "覆盖省份" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{CDP_PLATFORM_COUNT}</span>
              <span className="density-label">
                {translate(locale, { en: "Public endpoints", th: "ปลายทางสาธารณะ", zh: "公开端点" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{EVIDENCE_SOURCE_FAMILY_COUNT}</span>
              <span className="density-label">
                {translate(locale, { en: "Source families", th: "ตระกูลแหล่งข้อมูล", zh: "来源类别" })}
              </span>
            </div>
            <div className="density-stat">
              <span className="density-value">{SCORING_PILLARS.length}</span>
              <span className="density-label">
                {translate(locale, { en: "Scoring pillars", th: "เสาคะแนน", zh: "评分支柱" })}
              </span>
            </div>
            <div className="density-stat density-stat-date">
              <span className="density-value">{SCITI_DATA_CUTOFF_ISO.slice(0, 10)}</span>
              <span className="density-label">
                {translate(locale, { en: "Baseline cut-off", th: "วันตัดข้อมูลฐาน", zh: "基线截点" })}
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
                  en: "No cookies. No ad trackers. We log anonymous visit analytics — approximate location and page — to measure reach. Never sold, never shared.",
                  th: "ไม่มีคุกกี้ ไม่มีตัวติดตามโฆษณา เราเก็บสถิติการเข้าชมแบบไม่ระบุตัวตน — ตำแหน่งโดยประมาณและหน้าที่เข้าชม — เพื่อวัดการเข้าถึง ไม่ขาย ไม่แบ่งปัน",
                  zh: "无Cookie。无广告追踪器。我们仅记录匿名访问统计——大致位置与访问页面——以衡量触达。绝不出售，绝不共享。",
                })}
              </p>
            </div>
            <div className="legal-block">
              <span className="legal-badge legal-badge-disclaimer">{translate(locale, { en: "Disclaimer", th: "ข้อจำกัดความรับผิดชอบ", zh: "免责声明" })}</span>
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
                  en: "Framework references include ISO 37122:2019, UN-Habitat CPI, and the ASEAN Smart Cities Framework. This is not an ISO certification or a claim that every indicator is implemented.",
                  th: "อ้างอิงกรอบ ISO 37122:2019, UN-Habitat CPI และกรอบเมืองอัจฉริยะอาเซียน ไม่ใช่การรับรอง ISO หรือการยืนยันว่าใช้ครบทุกตัวชี้วัด",
                  zh: "参考框架包括ISO 37122:2019、联合国人居署CPI及东盟智慧城市框架；这不是ISO认证，也不声称已实施全部指标。",
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
