import { ABSORPTION_PROVINCES, ABSORPTION_YEARS } from "./absorptionData";
import { resolveProvince } from "./dimensionScores";
import { getProvinceName, translate } from "./cityPresentation";
import type { Locale, SmartCity } from "./types";

/**
 * AUDIT: the former electricity restatement was invalid across denominators
 * and years. The release below shows separate observations only.
 * THE ABSORPTION READOUT
 * ======================
 * Livability and investability are not separate from capacity. A province
 * can be wonderful to live in and good to invest in and still be unable to
 * carry one more resident.
 *
 * The household register is the base every province plans its services
 * against — schools, clinics, water, waste, power. NSO publishes the
 * population that lives, studies or works in a province WITHOUT being
 * registered there. That is the part of the load the planning base does not
 * acknowledge, and it is not a rounding error: in Samut Sakhon it is nearly
 * the whole residential population.
 *
 * The published electricity figure is per REGISTERED resident. Restate it
 * per person actually present and the same province looks like a different
 * place. That is the absorption question, and it is arithmetic on two
 * published series — not a new claim about either.
 *
 * What this does NOT establish: that the infrastructure is adequate. A
 * count of people says nothing about the capacity of the pipes, the
 * substation or the landfill serving them. The evidence needed for that is
 * listed in the infrastructure checklist; none of it is published as a
 * province-complete series.
 */
const fmt = (n: number | null | undefined) =>
  n === null || n === undefined ? null : n.toLocaleString("en-US");

const pct = (n: number | null | undefined) =>
  n === null || n === undefined ? null : `${(n * 100).toFixed(1)}%`;

export default function AbsorptionReadout({ city, locale }: { city: SmartCity; locale: Locale }) {
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const province = resolveProvince(city.province);
  const record = ABSORPTION_PROVINCES[province];

  const noRecord = t({ en: "No record", th: "ไม่มีข้อมูล", zh: "无记录" });
  const show = (n: number | null | undefined) => fmt(n) ?? noRecord;

  const rows: { label: string; value: string; note: string }[] = [
    {
      label: t({ en: "On the household register", th: "ในทะเบียนบ้าน", zh: "户籍登记人口" }),
      value: show(record?.registered),
      note: t({
        en: "Registered population; not everyone currently present.",
        th: "ประชากรในทะเบียน ไม่ใช่ทุกคนที่อยู่จริง",
        zh: "户籍人口，非所有实际在场者。",
      }),
    },
    {
      label: t({ en: "Living here, not on the register", th: "อาศัยอยู่แต่ไม่มีในทะเบียน", zh: "居住于此但未登记" }),
      value: show(record?.unregisteredNight),
      note: record?.nightShare != null
        ? t({
            en: `${pct(record.nightShare)} of registered population; a separate resident-demand signal.`,
            th: `${pct(record.nightShare)} ของประชากรในทะเบียน เป็นข้อมูลอุปสงค์ที่อยู่อาศัยอีกชุดหนึ่ง`,
            zh: `占户籍的 ${pct(record.nightShare)}——独立的居住需求信号。`,
          })
        : t({
            en: "No share recorded for this province.",
            th: "ไม่มีสัดส่วนที่บันทึกไว้สำหรับจังหวัดนี้",
            zh: "该省未记录占比。",
          }),
    },
    {
      label: t({ en: "Coming in to work or study", th: "เข้ามาทำงานหรือเรียน", zh: "通勤或就学流入" }),
      value: show(record?.commuter),
      note: record?.commuterShare != null
        ? t({
            en: `${pct(record.commuterShare)} of the register, present on a working day but living elsewhere.`,
            th: `${pct(record.commuterShare)} ของทะเบียน อยู่ในพื้นที่ในวันทำงานแต่อาศัยที่อื่น`,
            zh: `占户籍的 ${pct(record.commuterShare)}，工作日在当地但居住在外。`,
          })
        : t({
            en: "No share recorded for this province.",
            th: "ไม่มีสัดส่วนที่บันทึกไว้สำหรับจังหวัดนี้",
            zh: "该省未记录占比。",
          }),
    },
  ];

  return (
    <section className="section city-absorption" aria-labelledby="city-absorption-title">
      <p className="eyebrow">{t({ en: "Population and service demand", th: "ประชากรและอุปสงค์บริการ", zh: "人口与服务需求" })}</p>
      <h2 id="city-absorption-title">
        {t({
          en: "Read beyond registered population",
          th: "อ่านอุปสงค์ให้ไกลกว่าทะเบียนบ้าน",
          zh: "需求不止户籍人口",
        })}
      </h2>
      <p className="section-intro">
        {t({
          en: `${getProvinceName(city, locale)} has several population measures. NSO publishes unregistered residents and inbound workers or students alongside registrations. Read these separately when investigating local service demand.`,
          th: `${getProvinceName(city, locale)} มีข้อมูลประชากรหลายฐาน สสช. เผยแพร่ประชากรแฝงที่อาศัยอยู่และผู้เดินทางเข้ามาทำงานหรือเรียนควบคู่กับทะเบียนบ้าน ควรอ่านแยกแต่ละชุดเพื่อศึกษาอุปสงค์บริการในพื้นที่`,
          zh: `${getProvinceName(city, locale)} 有不同的人口统计口径。统计局公布未登记居民及流入工作或就学人口，可与户籍数据分别参考，以研究当地服务需求。`,
        })}
      </p>

      <dl className="city-absorption-grid">
        {rows.map(row => (
          <div className="city-absorption-row" key={row.label}>
            <dt className="city-absorption-label">{row.label}</dt>
            <dd className="city-absorption-value">{row.value}</dd>
            <p className="city-absorption-note">{row.note}</p>
          </div>
        ))}
      </dl>

      <p className="city-absorption-adjust">{t({
        en: "These are separate provincial observations, not a simultaneous daytime population. Registered people can live or work elsewhere; outbound travel and visitors are not reconciled here.",
        th: "ข้อมูลเหล่านี้เป็นคนละชุดในระดับจังหวัด ไม่ใช่ประชากรกลางวันที่อยู่พร้อมกัน ผู้มีชื่อในทะเบียนอาจอาศัยหรือทำงานที่อื่น และยังไม่ได้ปรับด้วยการเดินทางออกหรือผู้มาเยือน",
        zh: "这些是不同的省级观测，并非同一时点的日间人口。户籍人口可能在外居住或工作，此处未校正流出通勤或访客。"
      })}</p>

      <p className="city-absorption-caveat">
        {t({
          en: "This counts people; it does not measure capacity. Whether the pipes, the substation, the landfill and the clinics can carry them is not established by any of these series — the evidence that would settle it is listed in the infrastructure checklist.",
          th: "ข้อมูลนี้นับจำนวนประชากร ไม่ได้วัดกำลังรองรับ โครงสร้างพื้นฐานรองรับคนจำนวนนี้ได้หรือไม่ ข้อมูลชุดเหล่านี้ไม่ตอบคำถามนั้น — หลักฐานที่จะตอบได้อยู่ในรายการตรวจสอบโครงสร้างพื้นฐาน",
          zh: "这里统计的是人，而不是容量。管道、变电站、填埋场和诊所能否承载这些人，这些数据序列都无法证明——能够证明的证据列在基础设施核查清单中。",
        })}
      </p>

      <p className="city-absorption-source">
        {t({
          en: `NSO, non-registered population BE ${ABSORPTION_YEARS.nonRegistered} and household register BE ${ABSORPTION_YEARS.registered}. Province observations, not city counts.`,
          th: `สสช. ประชากรแฝง พ.ศ. ${ABSORPTION_YEARS.nonRegistered} และทะเบียนบ้าน พ.ศ. ${ABSORPTION_YEARS.registered} ข้อมูลระดับจังหวัด ไม่ใช่จำนวนระดับเมือง`,
          zh: `统计局，未登记人口 BE ${ABSORPTION_YEARS.nonRegistered}，户籍 BE ${ABSORPTION_YEARS.registered}。省级观测，非城市人口。`,
        })}
      </p>
      <p className="city-absorption-source"><a href="https://catalog.nso.go.th/dataset/0706_01_0049">NSO · MIG_01_0049_3</a> · NSO OS_0405_01_0005_01</p>
    </section>
  );
}
