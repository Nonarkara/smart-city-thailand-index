import { useState } from "react";
import snapshot from "./researchSnapshot.json";
import { allCities } from "./cityData";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import { resolveProvince } from "./dimensionScores";
import { ABSORPTION_PROVINCES, ABSORPTION_YEARS } from "./absorptionData";
import type { Locale, ScoringPillar } from "./types";

const labels: Record<ScoringPillar, { en: string; th: string; zh: string }> = {
  livability: { en: "Livability", th: "ความน่าอยู่", zh: "宜居性" },
  economy: { en: "Economy", th: "เศรษฐกิจ", zh: "经济" },
  safety: { en: "Safety", th: "ความปลอดภัย", zh: "安全" },
  wellbeing: { en: "Wellbeing", th: "สุขภาวะ", zh: "福祉" },
  environment: { en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" },
  hospitality: { en: "Hospitality", th: "การต้อนรับ", zh: "好客程度" },
  digital: { en: "Digital", th: "ดิจิทัล", zh: "数字化" },
};

export default function InvestmentExplorer({ locale, onNavigate }: {
  locale: Locale; onNavigate: (path: string) => void;
}) {
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const [certified, setCertified] = useState(false);
  const [selectedId, setSelectedId] = useState(allCities[0].id);
  const visible = allCities.filter(city => !certified || city.status === "certified");
  const selected = visible.find(city => city.id === selectedId) ?? visible[0];
  const ordered = (Object.keys(labels) as ScoringPillar[]).sort((a, b) => selected.scores[b] - selected.scores[a]);
  const record = ABSORPTION_PROVINCES[resolveProvince(selected.province)];
  const missing = t({ en: "Not reported", th: "ไม่มีข้อมูลรายงาน", zh: "未报告" });
  const count = (value: number | null | undefined) => value == null ? missing : value.toLocaleString(locale === "zh" ? "zh-CN" : locale === "th" ? "th-TH" : "en-US");
  const chartLabel = t({ en: "Curated livability and economy scores, each out of 100", th: "คะแนนความน่าอยู่และเศรษฐกิจที่คัดสรร แต่ละด้านเต็ม 100", zh: "经编辑评估的宜居与经济分数，各项满分100" });
  return <section className="section investment-explorer" aria-labelledby="investment-explorer-title">
    <h2 id="investment-explorer-title">{t({ en: "Find a city worth understanding", th: "ค้นหาเมืองที่ควรทำความเข้าใจ", zh: "发现值得深入了解的城市" })}</h2>
    <p>{t({ en: "Compare curated signals, then examine the evidence. These scores describe editorial assessments; they are not investment returns, readiness ratings or official depa grades.", th: "เปรียบเทียบคะแนนที่คัดสรร แล้วตรวจสอบหลักฐาน คะแนนนี้เป็นการประเมินของผู้จัดทำ ไม่ใช่ผลตอบแทนการลงทุน ระดับความพร้อม หรือเกรดทางการของ depa", zh: "比较经编辑评估的信号，再核查证据。这些分数不代表投资回报、准备程度或depa官方评级。" })}</p>
    <div className="investment-explorer-controls">
      <label htmlFor="explorer-city">{t({ en: "Explore city", th: "เลือกเมือง", zh: "选择城市" })}</label>
      <select id="explorer-city" value={selected.id} onChange={event => setSelectedId(event.target.value)}>{visible.map(city => <option value={city.id} key={city.id}>{getCityName(city, locale)}</option>)}</select>
      <label><input type="checkbox" checked={certified} onChange={event => setCertified(event.target.checked)} />{t({ en: "Certified cities only", th: "เฉพาะเมืองที่ได้รับการรับรอง", zh: "仅显示获认证城市" })}</label>
    </div>
    <div className="investment-explorer-layout">
      <figure className="investment-explorer-figure">
        <div className="investment-explorer-y-label">{t(labels.economy)} / 100 ↑</div>
        <div className="investment-explorer-stage"><div className="investment-explorer-y-scale" aria-hidden="true">{[100,75,50,25,0].map((value,index)=><span key={value} style={{top:`${index*25}%`}}>{value}</span>)}</div><svg viewBox="0 0 600 440" role="img" aria-label={chartLabel} className="investment-explorer-chart">
          <title>{chartLabel}</title>
          {[0, 25, 50, 75, 100].map(tick => <g key={tick} className="investment-explorer-grid"><line x1={40 + tick * 5.2} y1="20" x2={40 + tick * 5.2} y2="400" /><line x1="40" y1={400 - tick * 3.8} x2="560" y2={400 - tick * 3.8} /></g>)}
          {visible.filter(city => city.id !== selected.id).concat(selected).map(city => <circle key={city.id} cx={40 + city.scores.livability * 5.2} cy={400 - city.scores.economy * 3.8} r={city.id === selected.id ? 9 : 5} className={city.id === selected.id ? "investment-explorer-dot is-selected" : "investment-explorer-dot"} onClick={() => setSelectedId(city.id)}><title>{getCityName(city, locale)}: {city.scores.livability}, {city.scores.economy}</title></circle>)}
        </svg></div>
        <div className="investment-explorer-scale" aria-hidden="true">{[0,25,50,75,100].map((value,index)=><span key={value} style={{left:`${index*25}%`}}>{value}</span>)}</div>
        <figcaption>{t(labels.livability)} / 100 → · {t({ en: "Vertical scale: 0 at bottom, 100 at top. Select a city above for exact values.", th: "แกนตั้ง: 0 ด้านล่าง 100 ด้านบน เลือกเมืองเพื่อดูค่าที่แน่นอน", zh: "纵轴底部为0，顶部为100。选择城市查看准确数值。" })}</figcaption>
      </figure>
      <div className="investment-explorer-detail" aria-live="polite">
        <h3>{getCityName(selected, locale)}</h3><p>{getProvinceName(selected, locale)}</p>
        <dl className="investment-explorer-scores"><div><dt>{t(labels.livability)}</dt><dd>{selected.scores.livability}/100</dd></div><div><dt>{t(labels.economy)}</dt><dd>{selected.scores.economy}/100</dd></div></dl>
        <p>{t({ en: "Highest curated pillar", th: "ด้านที่มีคะแนนสูงสุด", zh: "最高分维度" })}: {t(labels[ordered[0]])} {selected.scores[ordered[0]]}/100<br />{t({ en: "Lowest curated pillar", th: "ด้านที่มีคะแนนต่ำสุด", zh: "最低分维度" })}: {t(labels[ordered[ordered.length - 1]])} {selected.scores[ordered[ordered.length - 1]]}/100</p>
        <h4>{t({ en: "Provincial population context", th: "บริบทประชากรระดับจังหวัด", zh: "省级人口背景" })}</h4>
        <dl className="investment-explorer-population"><div><dt>{t({ en: "Registered population", th: "ประชากรตามทะเบียน", zh: "户籍人口" })} ({ABSORPTION_YEARS.registered - 543})</dt><dd>{count(record?.registered)}</dd></div><div><dt>{t({ en: "Unregistered residents", th: "ประชากรแฝงกลางคืน", zh: "非户籍常住人口" })} ({ABSORPTION_YEARS.nonRegistered - 543})</dt><dd>{count(record?.unregisteredNight)}</dd></div><div><dt>{t({ en: "Inbound workers and students", th: "ผู้เข้ามาทำงานและเรียน", zh: "流入工作及就学人口" })}</dt><dd>{count(record?.commuter)}</dd></div></dl>
        <p className="investment-explorer-source">{t({ en: "NSO provincial statistics. Separate counts; these do not establish simultaneous population or infrastructure capacity.", th: "สถิติระดับจังหวัดจาก สสช. เป็นจำนวนแยกประเภท ไม่ใช่จำนวนคนที่อยู่พร้อมกันหรือหลักฐานความจุโครงสร้างพื้นฐาน", zh: "来源：NSO省级统计。各类别分别列示，不能据此推断同一时点人口或基础设施容量。" })}</p>
        <a href={`/city/${selected.id}`} onClick={event => { if (!event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) { event.preventDefault(); onNavigate(`/city/${selected.id}`); } }}>{t({ en: "Read the city evidence", th: "อ่านหลักฐานของเมือง", zh: "查看城市证据" })} →</a>
      </div>
    </div>
    <p className="investment-explorer-source">SCITI · {snapshot.releaseDate} · <a href="/methodology">{t({en:"Read the assessment method",th:"อ่านวิธีประเมิน",zh:"查看评估方法"})}</a> · <a href="https://catalog.nso.go.th/dataset/0706_01_0049">NSO MIG_01_0049_3</a></p>
    <details className="investment-explorer-table"><summary>{t({ en: "All plotted values: accessible reference table", th: "ค่าทั้งหมดในกราฟ: ตารางอ้างอิง", zh: "图中全部数值：无障碍参考表" })}</summary><table><caption>{chartLabel}</caption><thead><tr><th scope="col">{t({ en: "City", th: "เมือง", zh: "城市" })}</th><th scope="col">{t(labels.livability)}</th><th scope="col">{t(labels.economy)}</th></tr></thead><tbody>{visible.map(city => <tr key={city.id}><th scope="row"><a href={`/city/${city.id}`}>{getCityName(city, locale)}</a></th><td>{city.scores.livability}</td><td>{city.scores.economy}</td></tr>)}</tbody></table></details>
  </section>;
}
