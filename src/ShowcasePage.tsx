import { getCityDetail } from "./cityCdp";
import {
  getCityName,
  getCityRealityLabel,
  getCityStatusLabel,
  translate,
} from "./cityPresentation";
import { SCORING_PILLARS } from "./scoring";
import type { Locale } from "./types";
import { PILLAR_LABELS, TIER_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function formatIsoDate(value: string): string {
  return value.slice(0, 10);
}

export default function ShowcasePage({ locale, onNavigate }: Props) {
  const city = getCityDetail("nakhon-si-thammarat");
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  if (!city) {
    return null;
  }

  const strongestPillars = [...SCORING_PILLARS]
    .sort((left, right) => city.scores[right] - city.scores[left])
    .slice(0, 2);

  return (
    <div className="showcase-page" style={{ paddingBottom: "var(--space-6)" }}>
      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Operational case sheet",
            th: "แผ่นกรณีปฏิบัติการ",
            zh: "运营案例表",
          })}
        </p>
        <h1 className="hero-title">
          {t({
            en: "Nakhon Si Thammarat: The City That Listened",
            th: "นครศรีธรรมราช: เมืองที่ฟังประชาชน",
            zh: "洛坤府：学会倾听的城市",
          })}
        </h1>
        <p className="hero-strapline">
          {t({
            en: "This case page uses the same city dossier model as the rest of SCITI. No special storytelling layer, no separate scoring logic, just one city's operating picture read closely.",
            th: "หน้านี้ใช้โมเดลแฟ้มเมืองชุดเดียวกับทั้ง SCITI ไม่มีชั้นเรื่องเล่าพิเศษ ไม่มีตรรกะให้คะแนนอีกแบบ มีเพียงภาพการเดินงานของเมืองหนึ่งที่ถูกอ่านอย่างละเอียด",
            zh: "本页使用与整个 SCITI 相同的城市档案模型。没有额外的叙事层，也没有另一套评分逻辑，只是对一个城市的运行状态做更近距离的阅读。",
          })}
        </p>
      </section>

      <section className="section reveal visible">
        <div className="index-summary-grid">
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Composite score", th: "คะแนนรวม", zh: "综合得分" })}
            </div>
            <div className="summary-value">{city.compositeScore.toFixed(1)}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Tier and status", th: "ระดับและสถานะ", zh: "层级与状态" })}
            </div>
            <div className="summary-value summary-value-small">{TIER_LABELS[locale][city.tier]}</div>
            <div className="data-note">
              {getCityStatusLabel(city.status, locale)} · {getCityRealityLabel(city.reality, locale)}
            </div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Evidence items", th: "จำนวนหลักฐาน", zh: "证据条目" })}
            </div>
            <div className="summary-value">{city.evidenceItems.length}</div>
          </div>
          <div className="data-sheet summary-cell">
            <div className="data-label">
              {t({ en: "Last observed", th: "อัปเดตล่าสุด", zh: "最近观测" })}
            </div>
            <div className="summary-value summary-value-small">
              {formatIsoDate(city.exportMetadata.latestObservedAt)}
            </div>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Why this case holds",
            th: "เหตุผลที่กรณีนี้ยืนได้",
            zh: "这个案例为什么站得住",
          })}
        </p>
        <div className="data-sheet">
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Operating note", th: "หมายเหตุการเดินงาน", zh: "运行说明" })}
              </div>
            </div>
            <p className="data-note">{city.deliveryProfile.deliveryNote[locale]}</p>
          </div>
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Lead mechanism", th: "กลไกนำ", zh: "主导机制" })}
              </div>
            </div>
            <div style={{ display: "grid", gap: "0.35rem" }}>
              <div className="data-value">{city.financeSignal.leadInstrumentName}</div>
              <p className="data-note">{city.financeSignal.line[locale]}</p>
            </div>
          </div>
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Strongest pillars", th: "เสาหลักเด่น", zh: "最强支柱" })}
              </div>
            </div>
            <p className="data-note">
              {strongestPillars
                .map(pillar => `${PILLAR_LABELS[locale][pillar]} ${city.scores[pillar]}`)
                .join(" · ")}
            </p>
          </div>
          <div className="data-row">
            <div style={{ minWidth: "11rem" }}>
              <div className="data-label">
                {t({ en: "Public role", th: "บทบาทรัฐ", zh: "公共角色" })}
              </div>
            </div>
            <p className="data-note">{city.deliveryProfile.publicRole[locale]}</p>
          </div>
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Traceable proof",
            th: "หลักฐานที่สาวกลับได้",
            zh: "可追溯证据",
          })}
        </p>
        <div className="data-sheet">
          {city.evidenceItems.slice(0, 4).map(item => (
            <div key={`${item.titleEn}-${item.date}`} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{item.source}</div>
                <div className="data-note">{item.date}</div>
              </div>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div className="data-value">
                  {locale === "th" ? item.titleTh : locale === "zh" ? item.titleZh : item.titleEn}
                </div>
                <p className="data-note">
                  {item.metric && item.value
                    ? `${item.metric}: ${item.value}`
                    : t({
                        en: `Recorded as ${item.type} evidence in the city dossier.`,
                        th: `บันทึกเป็นหลักฐานประเภท ${item.type} ในแฟ้มเมือง`,
                        zh: `已作为 ${item.type} 类型证据记录进城市档案。`,
                      })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible">
        <p className="eyebrow">
          {t({
            en: "Replication notes",
            th: "บันทึกเพื่อการทำซ้ำ",
            zh: "可复制注记",
          })}
        </p>
        <div className="data-sheet">
          {city.financeRecommendations.slice(0, 3).map(recommendation => (
            <div key={recommendation.id} className="data-row">
              <div style={{ minWidth: "11rem" }}>
                <div className="data-label">{recommendation.instrumentName}</div>
              </div>
              <div style={{ display: "grid", gap: "0.35rem" }}>
                <div className="data-value">{recommendation.reasonSummary[locale]}</div>
                <p className="data-note">{recommendation.nextStep[locale]}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div className="cta-block">
          <h2 className="cta-title">
            {t({
              en: "Read the full city profile",
              th: "อ่านแฟ้มเมืองฉบับเต็ม",
              zh: "查看完整城市档案",
            })}
          </h2>
          <p className="cta-text">
            {t({
              en: `${getCityName(city, locale)} works as a showcase because the full dossier stays readable: score, evidence, finance, and next steps are all in one place.`,
              th: `${getCityName(city, locale)} ถูกใช้เป็นกรณีตัวอย่างได้ เพราะแฟ้มเต็มยังอ่านได้จริง: คะแนน หลักฐาน การเงิน และขั้นถัดไป อยู่ในที่เดียวกัน`,
              zh: `${getCityName(city, locale)} 之所以能作为样板，是因为完整档案依然可读：分数、证据、融资与下一步都放在同一个地方。`,
            })}
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onNavigate("/city/nakhon-si-thammarat")}
            >
              View city profile
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => onNavigate("/rankings")}
            >
              {t({ en: "Return to rankings", th: "กลับไปที่อันดับ", zh: "返回排行榜" })}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
