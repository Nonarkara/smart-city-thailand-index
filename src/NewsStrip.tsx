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
                {translate(locale, { en: "City records", th: "ระเบียนเมือง", zh: "城市记录" })}
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

      <ResearchNotes locale={locale} />
    </>
  );
}

export function ResearchNotes({ locale }: Props) {
  const [legalRef, legalVisible] = useInView(0.05);
  return (
      <section ref={legalRef} className={`legal-strip-section reveal ${legalVisible ? "visible" : ""}`}>
        <div className="section legal-strip-inner">
            <div className="legal-research-note">
              <p className="legal-text">
                {translate(locale, {
                  en: "Research estimates, not official government assessments. Check source dates, geographic scope and limitations in each city dossier.",
                  th: "คะแนนวิจัย ไม่ใช่ผลประเมินอย่างเป็นทางการของรัฐบาล ตรวจสอบวันที่ ขอบเขตพื้นที่ และข้อจำกัดในแฟ้มแต่ละเมือง",
                  zh: "研究估算，并非政府官方评估。请在各城市档案中核查来源日期、地理范围及局限。",
                })}
                {" "}<a href="/methodology">{translate(locale, { en: "Method", th: "วิธีประเมิน", zh: "评估方法" })} ↗</a>
              </p>
            </div>
              <p className="legal-text">
                {translate(locale, {
                  en: "SCITI research exports: ",
                  th: "ไฟล์ส่งออกงานวิจัย SCITI: ",
                  zh: "SCITI研究导出文件：",
                })}
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer">CC BY 4.0</a>.
                {translate(locale, { en: " Images and upstream datasets retain their own credits and reuse terms.", th: " ภาพและชุดข้อมูลต้นทางมีเครดิตและเงื่อนไขการใช้ของตนเอง", zh: "图片和上游数据集保留各自的署名及使用条款。" })}
              </p>
          <div className="legal-strip-grid">
            <details className="legal-block" data-note="privacy">
              <summary>{translate(locale, { en: "Privacy · visit statistics", th: "ความเป็นส่วนตัว · สถิติการเข้าชม", zh: "隐私 · 访问统计" })}</summary>
              <p className="legal-text">
                {translate(locale, {
                  en: "When configured, visit statistics use ipapi.co and Google Apps Script and can include IP address, approximate location, browser, referrer and page. This is not an anonymous-only data flow. Browser Do Not Track and Global Privacy Control opt-outs are respected. Language and session preferences use browser storage.",
                  th: "เมื่อกำหนดค่าเปิดใช้งาน สถิติการเข้าชมใช้ ipapi.co และ Google Apps Script และอาจมีที่อยู่ IP ตำแหน่งโดยประมาณ เบราว์เซอร์ แหล่งที่มา และหน้าที่เข้าชม จึงไม่ใช่ข้อมูลนิรนามทั้งหมด ระบบเคารพ Do Not Track และ Global Privacy Control ส่วนภาษาและสถานะเซสชันใช้ที่เก็บข้อมูลของเบราว์เซอร์",
                  zh: "配置启用后，访问统计使用ipapi.co和Google Apps Script，可能包含IP地址、大致位置、浏览器、来源页及访问页面，并非仅匿名数据。系统尊重Do Not Track及Global Privacy Control退出设置。语言和会话偏好使用浏览器存储。",
                })}
              </p>
            </details>
            <details className="legal-block" data-note="frameworks">
              <summary>{translate(locale, { en: "Framework references · no certification", th: "กรอบอ้างอิง · ไม่ใช่การรับรอง", zh: "参考框架 · 非认证" })}</summary>
              <p className="legal-text">
                {translate(locale, {
                  en: "Framework references include ISO 37122:2019, UN-Habitat CPI, and the ASEAN Smart Cities Framework. This is not an ISO certification or a claim that every indicator is implemented.",
                  th: "อ้างอิงกรอบ ISO 37122:2019, UN-Habitat CPI และกรอบเมืองอัจฉริยะอาเซียน ไม่ใช่การรับรอง ISO หรือการยืนยันว่าใช้ครบทุกตัวชี้วัด",
                  zh: "参考框架包括ISO 37122:2019、联合国人居署CPI及东盟智慧城市框架；这不是ISO认证，也不声称已实施全部指标。",
                })}
              </p>
            </details>
          </div>

          <p className="legal-footer-note">
            © 2026 depa · MDES · SLIC · SCITI-2026-R1 ·{" "}
            <a href="mailto:non.ar@depa.or.th">non.ar@depa.or.th</a>
          </p>
        </div>
      </section>
  );
}
