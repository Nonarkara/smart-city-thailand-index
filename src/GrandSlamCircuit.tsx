// ---------------------------------------------------------------------------
// Grand Slam Circuit — the fixed-footprint rail
// ---------------------------------------------------------------------------
// Replaces the old "From Goyang to Shanghai" prose-plus-photo-grid section.
//
// THE FOOTPRINT IS FIXED. The rail is one row of tiles at a fixed height. It
// scrolls horizontally on a phone and stays one row on desktop. Adding an
// eighth international stop adds a tile to the scroll, not height to the page.
// That is the whole point: the section was bleeding the page down by roughly a
// viewport per talk, and this structure makes that impossible by construction.
//
// Design-system constraints honoured: hairline borders, no radius, no shadow,
// no gradient, mobile-first with a single-column collapse, three text sizes
// only, --mono for every numeral, and every photo carrying real alt text in all
// three locales.
// ---------------------------------------------------------------------------

import { ResponsiveImage } from "./mediaAssets";
import { GRAND_SLAM_STOPS, MAX_PHOTOS, circuitCityCount, typeOnlyCount } from "./speakingCircuitData";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

export default function GrandSlamCircuit({ locale }: Props) {
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const typeCount = typeOnlyCount();
  const cityCount = circuitCityCount();

  return (
    <section className="section showcase-circuit-section">
      <p className="eyebrow">{t({ en: "The speaking circuit", th: "เวทีระดับภูมิภาค", zh: "国际巡回演讲" })}</p>
      <h2>
        {t({
          en: `${cityCount} cities. One argument.`,
          th: `${cityCount} เมือง ข้อเดียว`,
          zh: `${cityCount} 座城市，同一个论点`,
        })}
      </h2>
      <p className="section-intro">
        {t({
          en: "The same claim, delivered to each of these rooms: a mid-sized city can outrun a capital on governance if it measures the same things and publishes the same way. This rail is one row tall. New stages extend it sideways, never downward.",
          th: "ข้อเดียวกัน กล่าวต่อห้องประชุมทั้งหลายนี้: เมืองขนาดกลางแซงหน้าเมืองหลวงในการกำกับดูแลได้ ถ้ามันวัดสิ่งเดียวกันและเปิดเผยข้อมูลแบบเดียวกัน รางนี้สูงแค่หนึ่งแถว เวทีใหม่จะยืดออกไปทางข้าง ไม่ใช่ลงล่าง",
          zh: "同一个论点，向每一个会场重复：中等规模的城市只要衡量同样的指标、以同样的方式公开数据，就能在治理上超过首都。这条轨道只有一行高。新增舞台只会横向延伸，永远不会向下增长。",
        })}
      </p>

      {/* ── The rail ── */}
      <div className="circuit-rail" role="list" aria-label={t({ en: "International speaking appearances", th: "การบรรยายระดับนานาชาติ", zh: "国际演讲记录" })}>
        {GRAND_SLAM_STOPS.map(stop => {
          const isPhoto = Boolean(stop.thumb);
          return (
            <article
              key={stop.id}
              role="listitem"
              className={`circuit-card${isPhoto ? " circuit-card--photo" : " circuit-card--type"}`}
            >
              {isPhoto ? (
                <div className="circuit-card-photo">
                  <ResponsiveImage
                    src={stop.photo ?? stop.thumb!}
                    alt={t(stop.photoAlt ?? { en: "", th: "", zh: "" })}
                    sizes="(max-width: 720px) 78vw, 260px"
                  />
                </div>
              ) : (
                <div className="circuit-card-typeface" aria-hidden="true">
                  <span className="circuit-card-flag">{stop.flag}</span>
                </div>
              )}

              <div className="circuit-card-body">
                <div className="circuit-card-head">
                  <h3 className="circuit-card-city">
                    <span className="circuit-card-flagmark" aria-hidden="true">{stop.flag}</span>
                    {t(stop.city)}
                  </h3>
                  <time className="circuit-card-date" dateTime={stop.date}>
                    {stop.date.slice(0, 4)}
                  </time>
                </div>
                <p className="circuit-card-venue">{t(stop.venue)}</p>
                <p className="circuit-card-format">{t(stop.format)}</p>
                <p className="circuit-card-note">{t(stop.note)}</p>
                {stop.photoCredit ? (
                  <p className="circuit-card-credit">{t(stop.photoCredit)}</p>
                ) : null}
              </div>
            </article>
          );
        })}

        {typeCount > 0 ? (
          <div className="circuit-card circuit-card--count" aria-hidden="true">
            <span className="circuit-count-num">{typeCount}</span>
            <span className="circuit-count-label">
              {t({ en: "more stages", th: "เวทีเพิ่มเติม", zh: "更多舞台" })}
            </span>
          </div>
        ) : null}
      </div>

      <p className="circuit-footnote">
        {t({
          en: `Seven appearances across ${cityCount} cities. The rail shows at most ${MAX_PHOTOS} photographs — the most recent stages — so adding an eighth invitation extends the scroll rather than the page. Sources: depa announcements, GovMesh 4.0 programme, Tomorrow.City Shanghai, Osaka Asia Roundtable 2026 programme.`,
          th: `เจ็ดครั้งใน ${cityCount} เมือง รางนี้แสดงรูปไม่เกิน ${MAX_PHOTOS} ภาพ — เฉพาะเวทีล่าสุด — ดังนั้นการเพิ่มเวทีที่แปดจะยืดการเลื่อน ไม่ใช่ยืดหน้า แหล่งที่มา: ประกาศของ depา โปรแกรม GovMesh 4.0 Tomorrow.City เซี่ยงไฮ้ และโปรแกรม Osaka Asia Roundtable 2026`,
          zh: `${cityCount} 座城市、七次出席。该轨道最多显示 ${MAX_PHOTOS} 张照片——仅最近几场——因此新增第八场只会延长横向滚动，而不会拉长页面。来源：depa 公告、GovMesh 4.0 议程、Tomorrow.City 上海、2026 年大阪亚洲圆桌会议议程。`,
        })}
      </p>
    </section>
  );
}