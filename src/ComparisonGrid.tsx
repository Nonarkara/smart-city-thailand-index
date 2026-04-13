import { useMemo, useState } from "react";
import { groupCitiesByTier, sortCities } from "./cityCollections";
import { getLocalizedList, getLocalizedText, resolveCityResearch } from "./cityResearch";
import { useCitySummaries } from "./cityApi";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  getProvinceName,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { CityTier, Locale, SmartCity } from "./types";
import { PILLAR_COLORS, PILLAR_LABELS, TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

type CompareSelection = {
  ids: string[];
  cursor: number;
};

const MAX_COMPARE = 5;

function formatNumber(value?: number, digits = 0): string {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);
}

function formatCurrency(value?: number): string {
  if (value == null || value === 0) return "—";
  return `฿${formatNumber(value)}`;
}

function formatPercent(value?: number, digits = 0): string {
  if (value == null) return "—";
  return `${formatNumber(value, digits)}%`;
}

function formatPm25(value?: number): string {
  if (value == null) return "—";
  return `${formatNumber(value, 1)} μg/m³`;
}

function getNextSlotIndex(selection: CompareSelection): number {
  if (selection.ids.length < MAX_COMPARE) return selection.ids.length;
  return selection.cursor;
}

function ScoreCell({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  return (
    <div className="compare-score-cell">
      <span className="compare-score-value">{value.toFixed(1)}</span>
      <div className="compare-score-track">
        <div className="compare-score-fill" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}

function CityPickerColumn({
  tier,
  cities,
  locale,
  selectedIds,
  onPick,
}: {
  tier: CityTier;
  cities: SmartCity[];
  locale: Locale;
  selectedIds: string[];
  onPick: (cityId: string) => void;
}) {
  return (
    <div className={`picker-column picker-column-${tier}`}>
      <div className="picker-column-head">
        <div>
          <span className="picker-column-kicker">
            {translate(locale, { en: "Pick from", th: "เลือกจาก", zh: "从这里选" })}
          </span>
          <h3>{TIER_LABELS[locale][tier]}</h3>
        </div>
        <span className="picker-column-count">{cities.length}</span>
      </div>
      <div className="picker-column-list">
        {cities.map(city => {
          const active = selectedIds.includes(city.id);
          return (
            <button
              key={city.id}
              type="button"
              className={`picker-city-btn ${active ? "active" : ""}`}
              aria-pressed={active}
              onClick={() => onPick(city.id)}
            >
              <span className="picker-city-copy">
                <strong>{getCityName(city, locale)}</strong>
                <span>{getProvinceName(city, locale)}</span>
              </span>
              <span className="picker-city-score">{city.compositeScore.toFixed(1)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompareTable({
  cities,
  locale,
  onNavigate,
}: {
  cities: SmartCity[];
  locale: Locale;
  onNavigate: (path: string) => void;
}) {
  return (
    <div className="compare-table-scroll">
      <table className="compare-spec-table">
        <thead>
          <tr>
            <th className="compare-spec-side">
              {translate(locale, { en: "Specs", th: "สเปก", zh: "规格" })}
            </th>
            {cities.map(city => {
              const research = resolveCityResearch(city);
              return (
                <th key={city.id} className="compare-city-head">
                  <button
                    type="button"
                    className="compare-city-card"
                    role="link"
                    onClick={() => onNavigate(`/city/${city.id}`)}
                  >
                    <div className="compare-city-card-top">
                      <span className={`compare-city-tier compare-city-tier-${city.tier}`}>
                        {TIER_LABELS[locale][city.tier]}
                      </span>
                      <span className="compare-city-composite">{city.compositeScore.toFixed(1)}</span>
                    </div>
                    <h3>{getCityName(city, locale)}</h3>
                    <p>{getLocalizedText(locale, research.compareNote)}</p>
                    <div className="compare-city-chip-row">
                      {getLocalizedList(locale, research.industries).slice(0, 4).map(industry => (
                        <span key={`${city.id}-${industry}`} className="compare-city-chip">{industry}</span>
                      ))}
                    </div>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          <tr className="compare-group-row">
            <th colSpan={cities.length + 1}>
              {translate(locale, { en: "Identity", th: "ตัวตน", zh: "身份" })}
            </th>
          </tr>
          <tr>
            <th>{translate(locale, { en: "Province", th: "จังหวัด", zh: "省府" })}</th>
            {cities.map(city => <td key={`${city.id}-province`}>{getProvinceName(city, locale)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Tier", th: "ระดับ", zh: "层级" })}</th>
            {cities.map(city => (
              <td key={`${city.id}-tier`}>
                <span className={`compare-tier-pill compare-tier-pill-${city.tier}`}>{TIER_LABELS[locale][city.tier]}</span>
              </td>
            ))}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Official status", th: "สถานะทางการ", zh: "官方状态" })}</th>
            {cities.map(city => <td key={`${city.id}-status`}>{getCityStatusLabel(city.status, locale)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Reality", th: "ความจริง", zh: "现实状态" })}</th>
            {cities.map(city => <td key={`${city.id}-reality`}>{getCityRealityLabel(city.reality, locale)}</td>)}
          </tr>

          <tr className="compare-group-row">
            <th colSpan={cities.length + 1}>
              {translate(locale, { en: "How It Feels", th: "ชีวิตจริงเป็นอย่างไร", zh: "生活感受" })}
            </th>
          </tr>
          <tr>
            <th>{translate(locale, { en: "Major industries", th: "อุตสาหกรรมหลัก", zh: "主要产业" })}</th>
            {cities.map(city => {
              const research = resolveCityResearch(city);
              return (
                <td key={`${city.id}-industries`}>
                  <div className="compare-chip-cloud">
                    {getLocalizedList(locale, research.industries).map(industry => (
                      <span key={`${city.id}-${industry}`} className="compare-inline-chip">{industry}</span>
                    ))}
                  </div>
                </td>
              );
            })}
          </tr>
          <tr>
            <th>{translate(locale, { en: "How people live", th: "คนใช้ชีวิตอย่างไร", zh: "人们如何生活" })}</th>
            {cities.map(city => {
              const research = resolveCityResearch(city);
              return <td key={`${city.id}-life`}>{getLocalizedText(locale, research.dailyLife)}</td>;
            })}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Signature story", th: "เรื่องเล่าหลัก", zh: "代表故事" })}</th>
            {cities.map(city => {
              const research = resolveCityResearch(city);
              return <td key={`${city.id}-story`}>{getLocalizedText(locale, research.signatureStory)}</td>;
            })}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Fun fact", th: "เกร็ดสนุก", zh: "趣味事实" })}</th>
            {cities.map(city => {
              const research = resolveCityResearch(city);
              return <td key={`${city.id}-fun`}>{getLocalizedText(locale, research.funFact)}</td>;
            })}
          </tr>

          <tr className="compare-group-row">
            <th colSpan={cities.length + 1}>
              {translate(locale, { en: "Scorecard", th: "สมุดคะแนน", zh: "评分卡" })}
            </th>
          </tr>
          <tr>
            <th>{translate(locale, { en: "Composite", th: "คะแนนรวม", zh: "综合分" })}</th>
            {cities.map(city => (
              <td key={`${city.id}-composite`}>
                <ScoreCell value={city.compositeScore} color="var(--teal)" />
              </td>
            ))}
          </tr>
          {SCORING_PILLARS.map(pillar => (
            <tr key={pillar}>
              <th>{PILLAR_LABELS[locale][pillar]}</th>
              {cities.map(city => (
                <td key={`${city.id}-${pillar}`}>
                  <ScoreCell value={city.scores[pillar]} color={PILLAR_COLORS[pillar]} />
                </td>
              ))}
            </tr>
          ))}

          <tr className="compare-group-row">
            <th colSpan={cities.length + 1}>
              {translate(locale, { en: "Hard Numbers", th: "ตัวเลขจริง", zh: "硬指标" })}
            </th>
          </tr>
          <tr>
            <th>{translate(locale, { en: "Population (k)", th: "ประชากร (พันคน)", zh: "人口（千）" })}</th>
            {cities.map(city => <td key={`${city.id}-population`}>{formatNumber(city.metrics.population)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "GPP / capita", th: "GPP / หัว", zh: "人均 GPP" })}</th>
            {cities.map(city => <td key={`${city.id}-gpp`}>{formatCurrency(city.metrics.gppPerCapita)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Monthly income", th: "รายได้ต่อเดือน", zh: "月收入" })}</th>
            {cities.map(city => <td key={`${city.id}-income`}>{formatCurrency(city.metrics.avgMonthlyIncome)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "PM2.5", th: "PM2.5", zh: "PM2.5" })}</th>
            {cities.map(city => <td key={`${city.id}-pm25`}>{formatPm25(city.metrics.pm25Annual)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Hospital beds / 10k", th: "เตียง / 10k", zh: "每万人床位" })}</th>
            {cities.map(city => <td key={`${city.id}-beds`}>{formatNumber(city.metrics.hospitalBedsPer10k)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Crime / 100k", th: "อาชญากรรม / 100k", zh: "每十万人犯罪" })}</th>
            {cities.map(city => <td key={`${city.id}-crime`}>{formatNumber(city.metrics.crimeRatePer100k)}</td>)}
          </tr>
          <tr>
            <th>{translate(locale, { en: "Green coverage", th: "พื้นที่สีเขียว", zh: "绿地覆盖率" })}</th>
            {cities.map(city => <td key={`${city.id}-green`}>{formatPercent(city.metrics.greenCoverage)}</td>)}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function ComparisonGrid({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const sortedCities = useMemo(() => sortCities(cities, "composite"), [cities]);
  const defaultIds = useMemo(() => sortedCities.slice(0, MAX_COMPARE).map(city => city.id), [sortedCities]);
  const [selection, setSelection] = useState<CompareSelection>({ ids: defaultIds, cursor: 0 });

  const groupedCities = useMemo(() => {
    const grouped = groupCitiesByTier(cities);
    return {
      alpha: sortCities(grouped.alpha, "composite"),
      beta: sortCities(grouped.beta, "composite"),
      gamma: sortCities(grouped.gamma, "composite"),
    };
  }, [cities]);

  const cityMap = useMemo(() => new Map(cities.map(city => [city.id, city])), [cities]);
  const selectedCities = useMemo(
    () =>
      selection.ids
        .map(id => cityMap.get(id))
        .filter((city): city is (typeof cities)[number] => city !== undefined),
    [cityMap, selection.ids],
  );
  const nextSlot = getNextSlotIndex(selection);

  const handlePick = (cityId: string) => {
    setSelection(current => {
      if (current.ids.includes(cityId)) return current;
      if (current.ids.length < MAX_COMPARE) {
        return { ...current, ids: [...current.ids, cityId] };
      }

      const nextIds = [...current.ids];
      nextIds[current.cursor] = cityId;
      return {
        ids: nextIds,
        cursor: (current.cursor + 1) % MAX_COMPARE,
      };
    });
  };

  const handleReset = () => setSelection({ ids: defaultIds, cursor: 0 });
  const handleClear = () => setSelection({ ids: [], cursor: 0 });
  const handleRemove = (slotIndex: number) => {
    setSelection(current => ({
      ids: current.ids.filter((_, index) => index !== slotIndex),
      cursor: 0,
    }));
  };

  return (
    <div className="side-by-side-shell">
      <div className="side-by-side-header">
        <div>
          <p className="eyebrow">{translate(locale, { en: "Side-by-side", th: "เทียบกันตรงๆ", zh: "并排对比" })}</p>
          <h2>{translate(locale, {
            en: "Compare up to five cities like a product spec sheet",
            th: "เทียบได้สูงสุดห้าเมืองแบบแผ่นสเปกสินค้า",
            zh: "像产品规格表一样并排比较五座城市",
          })}</h2>
        </div>
        <div className="side-by-side-actions">
          <button type="button" className="ghost-button" onClick={handleReset}>
            {translate(locale, { en: "Reset top 5", th: "รีเซ็ต 5 อันดับแรก", zh: "重置为前五名" })}
          </button>
          <button type="button" className="ghost-button" onClick={handleClear}>
            {translate(locale, { en: "Clear board", th: "ล้างกระดาน", zh: "清空对比板" })}
          </button>
        </div>
      </div>

      <p className="side-by-side-note">
        {selection.ids.length < MAX_COMPARE
          ? translate(locale, {
              en: `Pick cities from Alpha, Beta, and Gamma. You have ${MAX_COMPARE - selection.ids.length} slots left.`,
              th: `เลือกเมืองจาก Alpha, Beta และ Gamma ได้เลย คุณยังเหลืออีก ${MAX_COMPARE - selection.ids.length} ช่อง`,
              zh: `从 Alpha、Beta、Gamma 三栏里挑城市。你还剩 ${MAX_COMPARE - selection.ids.length} 个位置。`,
            })
          : translate(locale, {
              en: `Board is full. Your next pick replaces slot ${nextSlot + 1}.`,
              th: `บอร์ดเต็มแล้ว คลิกครั้งถัดไปจะมาแทนช่องที่ ${nextSlot + 1}`,
              zh: `对比板已满。下一次选择会替换第 ${nextSlot + 1} 个位置。`,
            })}
      </p>

      <div className="compare-slot-grid">
        {Array.from({ length: MAX_COMPARE }, (_, slotIndex) => {
          const city = selectedCities[slotIndex];
          const isNext = nextSlot === slotIndex;

          return (
            <div
              key={`slot-${slotIndex}`}
              className={`compare-slot-card ${isNext ? "compare-slot-card-next" : ""} ${city ? "filled" : "empty"}`}
            >
              <div className="compare-slot-head">
                <span className="compare-slot-index">
                  {translate(locale, { en: "Slot", th: "ช่อง", zh: "位置" })} {slotIndex + 1}
                </span>
                {city && (
                  <button
                    type="button"
                    className="compare-slot-remove"
                    aria-label={translate(locale, {
                      en: `Remove ${getCityName(city, locale)}`,
                      th: `เอา ${getCityName(city, locale)} ออก`,
                      zh: `移除 ${getCityName(city, locale)}`,
                    })}
                    onClick={() => handleRemove(slotIndex)}
                  >
                    ×
                  </button>
                )}
              </div>
              {city ? (
                <>
                  <strong>{getCityName(city, locale)}</strong>
                  <span>{city.compositeScore.toFixed(1)} · {TIER_LABELS[locale][city.tier]}</span>
                </>
              ) : (
                <span>
                  {translate(locale, {
                    en: "Open slot. Pick any city from the three tier columns below.",
                    th: "ช่องว่าง เลือกเมืองใดก็ได้จากสามคอลัมน์ด้านล่าง",
                    zh: "空位。请从下面三列中选择城市。",
                  })}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="picker-grid">
        <CityPickerColumn
          tier="alpha"
          cities={groupedCities.alpha}
          locale={locale}
          selectedIds={selection.ids}
          onPick={handlePick}
        />
        <CityPickerColumn
          tier="beta"
          cities={groupedCities.beta}
          locale={locale}
          selectedIds={selection.ids}
          onPick={handlePick}
        />
        <CityPickerColumn
          tier="gamma"
          cities={groupedCities.gamma}
          locale={locale}
          selectedIds={selection.ids}
          onPick={handlePick}
        />
      </div>

      {selectedCities.length > 0 ? (
        <CompareTable cities={selectedCities} locale={locale} onNavigate={onNavigate} />
      ) : (
        <div className="compare-empty">
          <h3>{translate(locale, { en: "Start building the board", th: "เริ่มจัดบอร์ดได้เลย", zh: "开始搭建对比板" })}</h3>
          <p>{translate(locale, {
            en: "Pick up to five cities from the Alpha, Beta, and Gamma columns to compare qualitative stories and hard metrics side by side.",
            th: "เลือกได้สูงสุดห้าเมืองจากคอลัมน์ Alpha, Beta และ Gamma เพื่อเทียบทั้งเรื่องเล่าและตัวเลขแบบข้างกันตรงๆ",
            zh: "从 Alpha、Beta、Gamma 三栏中选择最多五座城市，把故事层和硬指标并排比较。",
          })}</p>
        </div>
      )}
    </div>
  );
}
