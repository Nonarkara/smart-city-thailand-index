import { useMemo, useState } from "react";
import { getLocalCityDetail } from "./cityApi";
import { getCityPhotoAsset } from "./cityMedia";
import { getCityName, getCityRealityLabel, getProvinceName, translate } from "./cityPresentation";
import { ResponsiveImage } from "./mediaAssets";
import { cityCoords as mapCityCoords, BOUNDS as MAP_BOUNDS } from "./ThailandMap.constants";
import type { Locale, SmartCity } from "./types";
import { TIER_LABELS } from "./types";

interface Props {
  cities: SmartCity[];
  locale: Locale;
  onNavigate: (path: string) => void;
}

const MAP_W = 252;
const MAP_H = 316;

function project(lat: number, lng: number) {
  const x = ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * (MAP_W - 28) + 14;
  const y = ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * (MAP_H - 28) + 14;
  return { x, y };
}

function formatFreshness(dateValue: string, locale: Locale): string {
  const formatter = new Intl.DateTimeFormat(locale === "th" ? "th-TH" : locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return formatter.format(new Date(dateValue));
}

function buildActionCities(cities: SmartCity[]): SmartCity[] {
  const picked = new Map<string, SmartCity>();

  (["alpha", "beta", "gamma"] as const).forEach(tier => {
    const candidate = cities.find(city => city.tier === tier);
    if (candidate) {
      picked.set(candidate.id, candidate);
    }
  });

  cities.forEach(city => {
    if (picked.size >= 7) return;
    picked.set(city.id, city);
  });

  return Array.from(picked.values()).slice(0, 7);
}

export default function ActionAtlas({ cities, locale, onNavigate }: Props) {
  const actionCities = useMemo(() => buildActionCities(cities), [cities]);
  const [selectedCityId, setSelectedCityId] = useState<string>(actionCities[0]?.id ?? "");
  const resolvedCityId = actionCities.some(city => city.id === selectedCityId)
    ? selectedCityId
    : actionCities[0]?.id ?? "";
  const selectedCity = actionCities.find(city => city.id === resolvedCityId) ?? actionCities[0];
  const selectedDetail = selectedCity ? getLocalCityDetail(selectedCity.id) : undefined;
  const leadRecommendation = selectedDetail?.financeRecommendations[0];
  const opportunityNote = selectedDetail?.contextNotes.find(note => note.kind === "opportunity");
  const constraintNote = selectedDetail?.contextNotes.find(note => note.kind === "constraint");

  if (!selectedCity || !selectedDetail || !leadRecommendation) {
    return null;
  }

  const cityLabel = getCityName(selectedCity, locale);
  const provinceLabel = getProvinceName(selectedCity, locale);
  const selectedCoords = mapCityCoords[selectedCity.id];
  const selectedPoint = selectedCoords ? project(selectedCoords.lat, selectedCoords.lng) : null;
  const stageMedia = getCityPhotoAsset(selectedCity);

  return (
    <section className="action-atlas">
      <div className="action-atlas-head">
        <div>
          <p className="eyebrow">{translate(locale, { en: "Action atlas", th: "แผนที่การลงมือ", zh: "行动图谱" })}</p>
          <h2>{translate(locale, {
            en: "Every city needs a different move",
            th: "ทุกเมืองต้องใช้หมากคนละแบบ",
            zh: "每座城市都该走不同的棋",
          })}</h2>
        </div>
        <p className="section-intro action-atlas-intro">
          {translate(locale, {
            en: "Same badge does not mean same playbook. This stage shows why the backend is built around differentiated city logic: finance, delivery, risk, and evidence all move differently by place.",
            th: "ตราเดียวกันไม่ได้แปลว่า playbook เดียวกัน เวทีนี้โชว์ให้เห็นว่าทำไม backend ต้องผูกกับตรรกะเฉพาะเมือง: การเงิน การส่งมอบ ความเสี่ยง และหลักฐาน ขยับไม่เหมือนกันในแต่ละที่",
            zh: "同一个标识不等于同一个打法。这个舞台就是在证明：融资、交付、风险和证据都必须按城市语境来走。",
          })}
        </p>
      </div>

      <div className="action-atlas-shell">
        <div className="action-atlas-map-panel">
          <span className="action-atlas-panel-label">{translate(locale, { en: "Thailand signal map", th: "แผนที่สัญญาณประเทศไทย", zh: "泰国信号地图" })}</span>
          <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="action-atlas-map" aria-hidden="true">
            {/* Real ESRI map tile as background */}
            <image
              href={`https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/export?bbox=${MAP_BOUNDS.minLng},${MAP_BOUNDS.minLat},${MAP_BOUNDS.maxLng},${MAP_BOUNDS.maxLat}&size=${MAP_W * 2},${MAP_H * 2}&format=png&f=image`}
              x="0" y="0" width={MAP_W} height={MAP_H}
              preserveAspectRatio="none" opacity="0.9"
            />
            {cities.map(city => {
              const coords = mapCityCoords[city.id];
              if (!coords) return null;
              const point = project(coords.lat, coords.lng);
              return (
                <circle
                  key={city.id}
                  cx={point.x}
                  cy={point.y}
                  r={city.id === selectedCity.id ? 4.5 : 2.5}
                  className={`action-atlas-dot action-atlas-dot-${city.tier} ${city.id === selectedCity.id ? "is-selected" : ""}`}
                />
              );
            })}
            {selectedPoint ? (
              <g className="action-atlas-target">
                <circle cx={selectedPoint.x} cy={selectedPoint.y} r="10" className="action-atlas-target-ring" />
                <circle cx={selectedPoint.x} cy={selectedPoint.y} r="4.5" className="action-atlas-target-core" />
              </g>
            ) : null}
          </svg>
          <div className="action-atlas-map-caption">
            <span className={`tier-badge tier-${selectedCity.tier}`}>
              {selectedCity.tier === "alpha" ? "α" : selectedCity.tier === "beta" ? "β" : "γ"} {TIER_LABELS[locale][selectedCity.tier]}
            </span>
            <span>{provinceLabel}</span>
            <span>{getCityRealityLabel(selectedCity.reality, locale)}</span>
          </div>
        </div>

        <div className={`action-atlas-stage action-atlas-stage-${selectedCity.tier}`}>
          {stageMedia ? (
            <ResponsiveImage
              src={stageMedia.src}
              alt={cityLabel}
              className="action-atlas-stage-media"
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 900px) 100vw, 46vw"
              style={{ objectPosition: stageMedia.objectPosition }}
            />
          ) : null}
          <div key={selectedCity.id} className="action-atlas-stage-overlay action-atlas-stage-swap">
            <div className="action-atlas-stage-topline">
              <span>{translate(locale, { en: "Tailored city dossier", th: "dossier เมืองเฉพาะทาง", zh: "定制城市档案" })}</span>
              <span>{selectedDetail.provenanceCount} {translate(locale, { en: "proof points", th: "จุดหลักฐาน", zh: "证据点" })}</span>
            </div>
            <div className="action-atlas-stage-header">
              <div>
                <h3>{cityLabel}</h3>
                <p>{provinceLabel} · {selectedDetail.financeSignal.leadInstrumentName}</p>
              </div>
              <div className="action-atlas-stage-score">
                <span>{selectedCity.compositeScore.toFixed(1)}</span>
                <small>{translate(locale, { en: "composite", th: "คะแนนรวม", zh: "综合分" })}</small>
              </div>
            </div>
            <p className="action-atlas-stage-note">{selectedDetail.shortTailoredNote[locale]}</p>
            <p className="action-atlas-stage-signal">{selectedDetail.financeSignal.line[locale]}</p>
            <div className="action-atlas-stage-metrics">
              {selectedDetail.keyMetrics.slice(0, 4).map(metric => (
                <div key={metric.key} className="action-atlas-metric-pill">
                  <strong>{metric.value}</strong>
                  <span>{metric.label[locale]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="action-atlas-sidebar">
          <div className="action-atlas-playbook">
            <span className="action-atlas-panel-label">{translate(locale, { en: "Lead mechanism", th: "กลไกนำ", zh: "主导机制" })}</span>
            <h3>{leadRecommendation.instrumentName}</h3>
            <p>{leadRecommendation.reasonSummary[locale]}</p>
            <div className="action-atlas-copy-grid">
              <article>
                <span>{translate(locale, { en: "Next step", th: "ก้าวถัดไป", zh: "下一步" })}</span>
                <p>{leadRecommendation.nextStep[locale]}</p>
              </article>
              <article>
                <span>{translate(locale, { en: "Why now", th: "ทำไมตอนนี้", zh: "为什么是现在" })}</span>
                <p>{leadRecommendation.whyNow[locale]}</p>
              </article>
              <article>
                <span>{translate(locale, { en: "Delivery move", th: "หมากการส่งมอบ", zh: "交付动作" })}</span>
                <p>{selectedDetail.deliveryProfile.deliveryNote[locale]}</p>
              </article>
              <article>
                <span>{translate(locale, { en: "Freshness", th: "ความสดของข้อมูล", zh: "数据新鲜度" })}</span>
                <p>
                  {formatFreshness(selectedDetail.exportMetadata.latestObservedAt, locale)} · {selectedDetail.exportMetadata.provenanceCount} {translate(locale, {
                    en: "traceable rows",
                    th: "แถวที่สืบย้อนกลับได้",
                    zh: "可追溯记录",
                  })}
                </p>
              </article>
            </div>
            <div className="action-atlas-actions">
              <button type="button" className="cta-button" onClick={() => onNavigate(`/city/${selectedCity.id}`)}>
                {translate(locale, { en: "Open dossier", th: "เปิด dossier", zh: "打开档案" })}
              </button>
              <a className="ghost-button" href={selectedDetail.exportMetadata.cityCsvUrl}>
                {translate(locale, { en: "Export city CSV", th: "ส่งออก CSV เมือง", zh: "导出城市 CSV" })}
              </a>
            </div>
          </div>

          <div className="action-atlas-note-stack">
            {opportunityNote ? (
              <article className="action-atlas-note-card">
                <span>{translate(locale, { en: "Opportunity", th: "โอกาส", zh: "机会" })}</span>
                <p>{opportunityNote.body[locale]}</p>
              </article>
            ) : null}
            {constraintNote ? (
              <article className="action-atlas-note-card">
                <span>{translate(locale, { en: "Constraint", th: "ข้อจำกัด", zh: "约束" })}</span>
                <p>{constraintNote.body[locale]}</p>
              </article>
            ) : null}
          </div>
        </aside>
      </div>

      <div className="action-atlas-selector" role="group" aria-label={translate(locale, {
        en: "Action atlas city selector",
        th: "ตัวเลือกเมืองสำหรับ action atlas",
        zh: "行动图谱城市选择器",
      })}>
        {actionCities.map(city => {
          const detail = getLocalCityDetail(city.id);
          const leadMechanism = detail?.financeSignal.leadInstrumentName ?? "";
          const readinessScore = detail?.financeSignal.readinessScore ?? detail?.financeProfile.readinessScore ?? city.compositeScore;
          const selected = city.id === selectedCity.id;

          return (
            <button
              key={city.id}
              type="button"
              aria-pressed={selected}
              className={`action-atlas-city-tab ${selected ? "is-active" : ""}`}
              onClick={() => setSelectedCityId(city.id)}
              onMouseEnter={() => setSelectedCityId(city.id)}
              onFocus={() => setSelectedCityId(city.id)}
            >
              <span className="action-atlas-city-rank">
                {city.tier === "alpha" ? "α" : city.tier === "beta" ? "β" : "γ"}
              </span>
              <span className="action-atlas-city-copy">
                <strong>{getCityName(city, locale)}</strong>
                <span>{leadMechanism}</span>
              </span>
              <span className="action-atlas-city-score">{readinessScore}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
