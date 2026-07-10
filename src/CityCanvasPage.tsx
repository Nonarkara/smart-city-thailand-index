import { useMemo, useEffect } from "react";
import { useCitySummaries } from "./cityApi";
import { type Locale, type SmartCity } from "./types";

interface Props {
  cityId: string;
  locale: Locale;
  onNavigate: (path: string) => void;
}

function CityCanvasSheet({ city }: { city: SmartCity }) {
  const tierLabel = city.tier.toUpperCase();

  return (
    <div className="city-canvas-sheet">
      {/* Header Profile */}
      <header className="canvas-header">
        <div className="canvas-header-left">
          <div className="canvas-tier">
            TIER / ระดับ {tierLabel}
          </div>
          <h1 className="canvas-title">{city.nameEn}</h1>
          <div className="canvas-province">{city.nameTh} · {city.province}</div>
        </div>
        <div className="canvas-header-right">
          <div className="canvas-score">{city.compositeScore.toFixed(1)}</div>
          <div className="canvas-score-label">SCITI SCORE</div>
        </div>
      </header>

      {/* The Grid */}
      <div className="canvas-grid">
        {/* Box 1: Strengths */}
        <div className="canvas-box">
          <h2 className="canvas-box-title">
            Strengths & Assets <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| จุดแข็งและสินทรัพย์</span>
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
            Economics & Scale <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| เศรษฐกิจและขนาด</span>
          </h2>
          <div className="canvas-metrics">
            <div className="canvas-metric">
              <span className="cm-label">GPP / Capita <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| GPP / หัว</span></span>
              <span className="cm-value">
                {city.metrics.gppPerCapita ? `฿${city.metrics.gppPerCapita.toLocaleString()}` : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">Population <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| ประชากร</span></span>
              <span className="cm-value">
                {city.metrics.population ? (city.metrics.population * 1000).toLocaleString() : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">Land Price <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| ราคาที่ดิน</span></span>
              <span className="cm-value">
                {city.metrics.landPriceBaht ? `฿${city.metrics.landPriceBaht.toLocaleString()}/m²` : "—"}
              </span>
            </div>
            <div className="canvas-metric">
              <span className="cm-label">FDI Inflow <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| การลงทุน FDI</span></span>
              <span className="cm-value">
                {city.metrics.fdiInflow ? `฿${city.metrics.fdiInflow.toLocaleString()}M` : "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Box 3: Pain Points — deliberately blank; filled by hand during a workshop/site visit */}
        <div className="canvas-box canvas-box-empty">
          <h2 className="canvas-box-title">
            Pain Points & Opportunities <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| จุดที่ต้องแก้และโอกาส</span>
          </h2>
          <p className="canvas-box-hint">To be completed on site — this sheet is a workshop template, not a data field. | เว้นว่างเพื่อกรอกในพื้นที่จริง</p>
        </div>

        {/* Box 4: Business Model — deliberately blank; filled by hand during a workshop/site visit */}
        <div className="canvas-box canvas-box-empty">
          <h2 className="canvas-box-title">
            Business Model & Funding <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| โมเดลธุรกิจและแหล่งทุน</span>
          </h2>
          <p className="canvas-box-hint">To be completed on site — this sheet is a workshop template, not a data field. | เว้นว่างเพื่อกรอกในพื้นที่จริง</p>
        </div>
      </div>

      {/* Footer Actions */}
      <footer className="canvas-footer">
        <div className="canvas-checklist">
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> Feasibility Assessed <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| ประเมินความเป็นไปได้</span>
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> Site Visited <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| ลงพื้นที่จริง</span>
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> Funding Secured <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| จัดหาทุนแล้ว</span>
          </div>
          <div className="canvas-check-item">
            <span className="canvas-checkbox"></span> Action Plan Drafted <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| ร่างแผนปฏิบัติการ</span>
          </div>
        </div>
        <div className="canvas-notes">
          <div className="canvas-notes-label">Notes / Actions: <span style={{ opacity: 0.5, fontSize: "0.8em" }}>| บันทึก / สิ่งที่ต้องทำ:</span></div>
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

export default function CityCanvasPage({ cityId, onNavigate }: Props) {
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
    return <div className="canvas-error">City not found</div>;
  }

  return (
    <div className="city-canvas-wrapper">
      <div className="canvas-controls">
        <button className="canvas-back-btn" onClick={() => onNavigate(cityId === "top10" ? "/rankings" : `/city/${cityId}`)}>
          ← Back
        </button>
        <button className="canvas-print-btn" onClick={() => window.print()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--teal)", color: "#fff" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download PDF
        </button>
      </div>

      <div className="canvas-batch-container">
        {targetCities.map((c) => (
          <CityCanvasSheet key={c.id} city={c} />
        ))}
      </div>
    </div>
  );
}
