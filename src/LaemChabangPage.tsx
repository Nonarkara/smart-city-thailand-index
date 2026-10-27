import { translate } from "./cityPresentation";
import type { Locale } from "./types";
import { toAppPath } from "./routing";
import { laemChabangProfile as profile } from "./laemChabangData";
import "./LaemChabangPage.css";

const SOURCE_LABELS: Record<string, string> = { "sac-community": "SAC", "prd-port-2023": "PRD", "dpworld-lcit-2026": "DP World", "depa-mou-2024": "depa", "thaigov-automation-2026": "Thai Government" };

export default function LaemChabangPage({ locale }: { locale: Locale }) {
  const t = (value: Record<Locale, string>) => translate(locale, value);
  const source = (id: string) => profile.sources.find(s => s.id === id)!;
  const sourceLabel = (id: string) => SOURCE_LABELS[id] ?? source(id).organization;
  const number = new Intl.NumberFormat(locale === "zh" ? "zh-CN" : locale === "th" ? "th-TH" : "en-GB", { maximumFractionDigits: 2 });
  const unit = (value: string) => value === "people" ? t({ en: "people", th: "คน", zh: "人" }) : value === "calls" ? t({ en: "calls", th: "เที่ยว", zh: "次" }) : value;
  return <article className="municipal-profile" aria-labelledby="municipal-title">
    <header className="municipal-intro">
      <div className="municipal-heading"><p className="municipal-kicker">{t({ en: "City data platform", th: "แพลตฟอร์มข้อมูลเมือง", zh: "城市数据平台" })} · {profile.province[locale]}</p>
      <h1 id="municipal-title">{profile.title[locale]}</h1>
      <p>{profile.introduction[locale]}</p></div>
      <nav className="municipal-actions" aria-label={t({ en: "Explore and reuse municipal data", th: "ดูและใช้ข้อมูลเทศบาล", zh: "查看与复用市政数据" })}>
        <a href={profile.links.twin}>{t({ en: "Explore the municipality in 3D →", th: "สำรวจเขตเทศบาลแบบ 3 มิติ →", zh: "三维市域地图 →" })}</a>
        <a href={toAppPath("/data/cities/laem-chabang.json")} download="laem-chabang.json">{t({ en: "Source JSON ↓", th: "ข้อมูล JSON ↓", zh: "来源JSON ↓" })}</a>
      </nav>
      <p className="municipal-assessment">{profile.certification.note[locale]}</p>
    </header>
    <section className="municipal-evidence" aria-labelledby="municipal-facts-title">
      <h2 id="municipal-facts-title">{t({ en: "Dated evidence, with its actual scope", th: "ข้อมูลพร้อมช่วงเวลาและขอบเขตจริง", zh: "按实际范围注明统计期的数据" })}</h2>
      <dl className="municipal-facts">{profile.facts.map(f => <div className="municipal-fact" key={f.id}>
        <dt>{f.label[locale]}</dt><dd><span className="municipal-value">{number.format(f.value)}<span className="municipal-unit">{unit(f.unit)}</span></span>
        <span className="municipal-meta">{f.period ?? t({ en: "Observation year not stated", th: "ไม่ระบุปีที่สำรวจ", zh: "观测年份未注明" })} · {f.scope[locale]} {f.sourceIds.map(id => <a key={id} href={source(id).url} target="_blank" rel="noopener noreferrer">{sourceLabel(id)} ↗</a>)}</span></dd>
      </div>)}</dl>
    </section>
    <section className="municipal-evidence" aria-labelledby="municipal-projects-title">
      <h2 id="municipal-projects-title">{t({ en: "What the public record establishes", th: "สิ่งที่มีหลักฐานสาธารณะรองรับ", zh: "公共记录所能确认的内容" })}</h2>
      {profile.projects.map(p => <div className="municipal-project" key={p.id}><h3>{p.title[locale]}</h3><p>{p.summary[locale]}</p><p className="municipal-meta">{p.period} · {p.sourceIds.map(id => <a key={id} href={source(id).url} target="_blank" rel="noopener noreferrer">{source(id).organization} ↗</a>)}</p></div>)}
    </section>
    <section className="municipal-evidence municipal-qualifications" aria-labelledby="municipal-gaps-title">
      <h2 id="municipal-gaps-title">{t({ en: "Data still needed", th: "ข้อมูลที่ยังต้องเติม", zh: "仍待补充的数据" })}</h2>
      {profile.gaps.map(g => <div className="municipal-gap" key={g.id}><h3>{g.label[locale]}</h3><p>{g.note[locale]}</p></div>)}
      <a href={profile.links.municipality} target="_blank" rel="noopener noreferrer">{t({ en: "Official municipal portal ↗", th: "เว็บไซต์ทางการของเทศบาล ↗", zh: "市政府官方网站 ↗" })}</a>
    </section>
    <details className="municipal-evidence"><summary>{t({ en: "Sources and data contract", th: "แหล่งข้อมูลและโครงสร้างข้อมูล", zh: "来源与数据规范" })}</summary>
      <p className="municipal-meta">{t({ en: "Sources checked 28 October 2026. A source-check date is not an observation date; none of these figures is a live sensor reading.", th: "ตรวจแหล่งข้อมูลเมื่อ 28 ตุลาคม 2569 วันที่ตรวจสอบไม่ใช่วันที่สำรวจ ตัวเลขเหล่านี้ไม่ใช่ค่าจากเซนเซอร์สด", zh: "来源核查日期为2026年10月28日。核查日期不是观测日期，以上数字均非实时传感器读数。" })}</p>
      <ul className="municipal-sources">{profile.sources.map(s => <li id={`source-${s.id}`} key={s.id}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.organization} · {s.title} ↗</a><p>{t({ en: "Published", th: "เผยแพร่", zh: "发布日期" })} {s.publishedAt}</p></li>)}</ul>
      <p className="municipal-meta">{t({ en: "Municipal context schema 1; assessment=null. The 118 existing SCITI assessment/registry records are unchanged.", th: "โครงสร้างข้อมูลเทศบาลรุ่น 1 ค่า assessment=null ข้อมูลประเมินและทะเบียน SCITI เดิม 118 รายการไม่เปลี่ยนแปลง", zh: "市政资料规范版本1，assessment=null。原有118项SCITI评估及登记记录保持不变。" })}</p>
    </details>
  </article>;
}
