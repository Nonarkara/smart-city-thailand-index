import { useMemo } from "react";
import { allCities } from "./cityData";
import { getCityName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

export default function ComparisonGrid({ locale, onNavigate }: Props) {
  // Select top 12 cities for the comparison grid
  const comparisonCities = useMemo(() => {
    return allCities.slice(0, 12);
  }, []);

  return (
    <div className="comparison-grid-section">
      <div className="section-header">
        <p className="eyebrow">{translate(locale, { en: "The Reality Gap", th: "ช่องว่างแห่งความเป็นจริง", zh: "现实差距" })}</p>
        <h2>{translate(locale, { en: "Official Certification vs. SLIC Reality", th: "การรับรองจากรัฐ vs. ความจริงโดย SLIC", zh: "官方认证 vs. SLIC 现实" })}</h2>
      </div>

      <div className="comparison-grid glass-card shadow-heavy">
        <div className="comparison-header-row">
          <span className="col-city">{translate(locale, { en: "City", th: "เมือง", zh: "城市" })}</span>
          <span className="col-official">{translate(locale, { en: "Official Status", th: "สถานะการรับรอง", zh: "官方状态" })}</span>
          <span className="col-reality">{translate(locale, { en: "Reality Score", th: "คะแนนจริง", zh: "现实评分" })}</span>
          <span className="col-delta">{translate(locale, { en: "Confidence", th: "ความเชื่อมั่น", zh: "置信度" })}</span>
        </div>

        {comparisonCities.map(city => (
          <button
            key={city.id}
            type="button"
            className="comparison-row"
            onClick={() => onNavigate(`/city/${city.id}`)}
          >
            <span className="col-city">{getCityName(city, locale)}</span>
            <span className={`col-official status-${city.status}`}>
              {city.status === "certified" 
                ? translate(locale, { en: "Certified", th: "รับรองแล้ว", zh: "已认证" }) 
                : translate(locale, { en: "Promotion", th: "เขตส่งเสริม", zh: "推广区" })}
            </span>
            <span className="col-reality">
              <div className="reality-bar-track">
                <div className="reality-bar-fill" style={{ width: `${city.compositeScore}%` }} />
              </div>
              <span className="reality-value">{city.compositeScore.toFixed(1)}</span>
            </span>
            <span className={`col-delta confidence-${city.dataConfidence}`}>
              {(city.dataConfidence ?? "medium").toUpperCase()}
            </span>
          </button>
        ))}
      </div>

      <div className="comparison-footer">
        <p>
          {translate(locale, {
            en: "Official certification measures a city's *plan*. SLIC Reality measures a city's *outcomes*. A 'Certified' status doesn't always equal a high reality score.",
            th: "การรับรองอย่างเป็นทางการวัดจาก *แผน* ของเมือง SLIC Reality วัดจาก *ผลลัพธ์* การเป็น 'เมืองที่ได้รับการรับรอง' ไม่ได้หมายความว่าจะมีคะแนนความจริงสูงเสมอไป",
            zh: "官方认证衡量的是城市的*规划*。SLIC 现实衡量的是城市的*结果*。'已认证'状态并不总是等同于高现实评分。",
          })}
        </p>
      </div>
    </div>
  );
}
