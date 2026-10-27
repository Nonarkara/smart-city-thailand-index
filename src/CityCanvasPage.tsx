import { useMemo, useEffect } from "react";
import { useCitySummaries } from "./cityApi";
import { getCityName, getDistinctProvinceName, translate } from "./cityPresentation";
import { SCITI_DATA_CUTOFF_ISO } from "./methodologySpec";
import snapshot from "./researchSnapshot.json";
import { type Locale, type SmartCity } from "./types";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

function CityCanvasSheet({ city, locale }: { city: SmartCity; locale: Locale }) {
  const tierLabel = city.tier.toUpperCase();

  return (
    <div className="city-canvas-sheet">
      {/* Header Profile */}
      <header className="canvas-header">
        <div className="canvas-header-left">
          <div className="canvas-tier">
            {translate(locale, { en: "TIER", th: "ระดับ", zh: "层级" })} / {tierLabel}
          </div>
          <h1 className="canvas-title">{getCityName(city, locale)}</h1>
          {getDistinctProvinceName(city, locale) && <div className="canvas-province">{getDistinctProvinceName(city, locale)}</div>}
        </div>
        <div className="canvas-header-right">
          <div className="canvas-score">{city.compositeScore.toFixed(1)}</div>
          <div className="canvas-score-label">{translate(locale, { en: "CURATED SCORE /100", th: "คะแนนประเมินเต็ม 100", zh: "编辑评分／100" })}</div>
        </div>
      </header>
      <p className="canvas-source-note">{translate(locale, {
        en: `Research worksheet, not a financing or service-readiness assessment. Seed cutoff: ${SCITI_DATA_CUTOFF_ISO.slice(0, 10)}. Figures below are curated records; their original periods and local boundaries need checking in the dossier. Missing values are shown as —.`,
        th: `แผ่นงานวิจัย ไม่ใช่การประเมินเงินทุนหรือความพร้อมบริการ ข้อมูลตั้งต้น ณ ${SCITI_DATA_CUTOFF_ISO.slice(0, 10)} ตัวเลขเป็นข้อมูลที่เรียบเรียงไว้ ต้องตรวจช่วงเวลาต้นฉบับและขอบเขตพื้นที่ในแฟ้มเมือง ค่าที่ไม่มีข้อมูลแสดงเป็น —`,
        zh: `研究工作表，并非融资或服务准备度评估。初始数据截止日：${SCITI_DATA_CUTOFF_ISO.slice(0, 10)}。下列数值来自编辑记录；原始时期与当地边界须在档案中核查。缺失值以—表示。`,
      })} <a href={`https://sciti.nonarkara.org/city/${city.id}`}>{translate(locale, { en: "City sources", th: "แหล่งข้อมูลเมือง", zh: "城市来源" })}</a>{" · "}<a href={`https://sciti.nonarkara.org${snapshot.path}`}>{translate(locale, { en: `Baseline snapshot ${snapshot.releaseDate}`, th: `ข้อมูลอ้างอิง ${snapshot.releaseDate}`, zh: `基线快照 ${snapshot.releaseDate}` })}</a></p>

      {/* The Grid */}
      <div className="canvas-grid">
        {/* Box 1: Strengths */}
        <div className="canvas-box">
          <h2 className="canvas-box-title">
            {translate(locale, { en: "Legacy research claims · not independently verified", th: "ข้อกล่าวอ้างวิจัยเดิม · ยังไม่ตรวจสอบอิสระ", zh: "既有研究陈述 · 未经独立核验" })}
          </h2>
          <ul className="canvas-list">
            {city.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>

        {/* Box 2: Economics */}
        <div className="canvas-box">
          <h2 className="canvas-box-title">
            {translate(locale, { en: "Unverified seed estimates", th: "ค่าประมาณตั้งต้น · ยังไม่ยืนยัน", zh: "未经核验的初始估算" })}
          </h2>
          <div className="canvas-metrics">
            <div className="canvas-metric">
              <span className="cm-label">{translate(locale, { en: "Provincial GPP / Capita", th: "GPP ต่อหัวระดับจังหวัด", zh: "省级人均GPP" })}</span>
              <span className="cm-value">
                {city.metrics.gppPerCapita != null ? `฿${city.metrics.gppPerCapita.toLocaleString(locale)}` : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">{translate(locale, { en: "Population", th: "ประชากร", zh: "人口" })}</span>
              <span className="cm-value">
                {city.metrics.population != null && city.metrics.population > 0 ? (city.metrics.population * 1000).toLocaleString(locale) : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">{translate(locale, { en: "Land Price", th: "ราคาที่ดิน", zh: "土地价格" })}</span>
              <span className="cm-value">
                {city.metrics.landPriceBaht != null ? `฿${city.metrics.landPriceBaht.toLocaleString(locale)}/m²` : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">{translate(locale, { en: "FDI seed figure · measure unverified", th: "ตัวเลข FDI ตั้งต้น · ยังไม่ยืนยันนิยาม", zh: "FDI初始数值 · 口径未核验" })}</span>
              <span className="cm-value">
                {city.metrics.fdiInflow != null ? `฿${city.metrics.fdiInflow.toLocaleString(locale)}M` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Box 3: Pain Points — deliberately blank; filled by hand during a workshop/site visit */}
        <div className="canvas-box canvas-box-empty">
          <h2 className="canvas-box-title">
            {translate(locale, { en: "Pain Points & Opportunities", th: "จุดที่ต้องแก้และโอกาส", zh: "痛点与机遇" })}
          </h2>
          <p className="canvas-box-hint">
            {translate(locale, {
              en: "To be completed on site — this sheet is a workshop template, not a data field.",
              th: "เว้นว่างเพื่อกรอกในพื้นที่จริง — แผ่นนี้เป็นแม่แบบเวิร์กช็อป ไม่ใช่ช่องข้อมูล",
              zh: "请在实地考察时填写——本表为工作坊模板，而非数据字段。",
            })}
          </p>
        </div>

        {/* Box 4: Business Model — deliberately blank; filled by hand during a workshop/site visit */}
        <div className="canvas-box canvas-box-empty">
          <h2 className="canvas-box-title">
            {translate(locale, { en: "Business Model & Funding", th: "โมเดลธุรกิจและแหล่งทุน", zh: "商业模式与资金" })}
          </h2>
          <p className="canvas-box-hint">
            {translate(locale, {
              en: "To be completed on site — this sheet is a workshop template, not a data field.",
              th: "เว้นว่างเพื่อกรอกในพื้นที่จริง — แผ่นนี้เป็นแม่แบบเวิร์กช็อป ไม่ใช่ช่องข้อมูล",
              zh: "请在实地考察时填写——本表为工作坊模板，而非数据字段。",
            })}
          </p>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="canvas-footer">
        <div className="canvas-checklist">
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> {translate(locale, { en: "Feasibility Assessed", th: "ประเมินความเป็นไปได้", zh: "已评估可行性" })}
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> {translate(locale, { en: "Site Visited", th: "ลงพื้นที่จริง", zh: "已实地考察" })}
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> {translate(locale, { en: "Funding Secured", th: "จัดหาทุนแล้ว", zh: "资金已落实" })}
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> {translate(locale, { en: "Action Plan Drafted", th: "ร่างแผนปฏิบัติการ", zh: "行动计划已起草" })}
          </div>
        </div>
        <div className="canvas-notes">
          <div className="canvas-notes-label">{translate(locale, { en: "Notes / Actions:", th: "บันทึก / สิ่งที่ต้องทำ:", zh: "备注 / 行动：" })}</div>
          <div className="canvas-notes-lines">
            <div className="canvas-line"></div>
            <div className="canvas-line"></div>
            <div className="canvas-line"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function CityCanvasPage({ cityId, locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();

  const targetCities = useMemo(() => {
    if (cityId === "top10") {
      return [...cities].sort((a, b) => b.compositeScore - a.compositeScore).slice(0, 10);
    }
    const single = cities.find((c) => c.id === cityId);
    return single ? [single] : [];
  }, [cities, cityId]);

  useEffect(() => {
    document.body.classList.add("canvas-print-mode");
    return () => document.body.classList.remove("canvas-print-mode");
  }, []);

  if (targetCities.length === 0) {
    return <div className="canvas-error">{translate(locale, { en: "City not found", th: "ไม่พบเมือง", zh: "未找到城市" })}</div>;
  }

  return (
    <div className="city-canvas-wrapper">
      <div className="canvas-controls">
        <button className="canvas-back-btn" onClick={() => onNavigate(cityId === "top10" ? "/rankings" : `/city/${cityId}`)}>
          {translate(locale, { en: "← Back", th: "← กลับ", zh: "← 返回" })}
        </button>
        <button className="canvas-print-btn" onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--teal)", color: "#fff" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          {translate(locale, { en: "Download PDF", th: "ดาวน์โหลด PDF", zh: "下载 PDF" })}
        </button>
      </div>

      <div className="canvas-batch-container">
        {targetCities.map((c) => (
          <CityCanvasSheet key={c.id} city={c} locale={locale} />
        ))}
      </div>
    </div>
  );
}
