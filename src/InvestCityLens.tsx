// ---------------------------------------------------------------------------
// Invest City Lens — 8 curated cities, ASEAN toolkit cross-references
// ---------------------------------------------------------------------------
// The City Investment Directory (InvestCityDirectory.tsx) handles all 118
// cities with filter/sort. This view is the *editorial* companion: 8 cities
// with curated cross-references to the ASEAN Smart City Financing Toolkit
// (smartcitytoolkit.asean.org), the FIRST recommendation engine, and the
// Toolkit's Thai case study.
//
// Goal: anyone who lands on /invest should walk away with a city-by-city
// comparison they can use to brief a partner or pick a short-list, without
// having to read another page.
// ---------------------------------------------------------------------------

import { CITY_INVESTMENT_PROFILES, TOOL_LABELS, type InvestmentTool } from "./cityInvestmentProfiles";
import { getCityById } from "./cityData";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const ASEAN_TOOLKIT_BASE = "https://smartcitytoolkit.asean.org";
const THAI_CASE_URL = `${ASEAN_TOOLKIT_BASE}/case-study/green-bond-for-wind-farm-development-in-thailand/`;

function t(locale: Locale, copy: { en: string; th: string; zh: string }): string {
  return translate(locale, copy);
}

function toolName(locale: Locale, tool: InvestmentTool): string {
  return translate(locale, TOOL_LABELS[tool]);
}

export default function InvestCityLens({ locale, onNavigate }: Props) {
  return (
    <section className="section reveal visible invest-city-lens">
      <p className="eyebrow">
        {t(locale, {
          en: "City by City — Where the Money Goes",
          th: "รายเมือง — เงินไปที่ไหน",
          zh: "逐城 — 资金去向",
        })}
      </p>
      <h2>
        {t(locale, {
          en: "Where to put the money: a Thailand-specific lens",
          th: "ควรวางเงินที่ไหน: เลนส์เฉพาะประเทศไทย",
          zh: "资金该投哪里：泰国专属视角",
        })}
      </h2>
      <p className="section-intro">
        {t(locale, {
          en: "The ASEAN Smart City Financing Toolkit (FIRST) gives the regional map. SCITI adds the Thailand-specific city data on top: which financing vehicle actually works in which province, what comparable ASEAN city used the same instrument, and where the climate constraint bites. Eight cities, with the EEC provinces shown against non-EEC, ASCN members against the rest, tourism against industrial.",
          th: "ASEAN Smart City Financing Toolkit (FIRST) ให้แผนที่ระดับภูมิภาค SCITI เพิ่มข้อมูลเฉพาะประเทศไทย: เครื่องมือการเงินใดทำงานได้จริงในจังหวัดใด เมืองอาเซียนเปรียบเทียบใช้เครื่องมือเดียวกันอย่างไร และข้อจำกัดด้านภูมิอากาศกัดที่ไหน 8 เมือง เปรียบเทียบ EEC กับนอก EEC สมาชิก ASCN กับที่เหลือ ท่องเที่ยวกับอุตสาหกรรม",
          zh: "ASEAN 智能城市融资工具包（FIRST）提供区域地图。SCITI 在其上添加泰国特定的城市数据：哪个融资工具在哪个府真正可用、哪个可比较的东盟城市使用过相同工具、以及气候约束在哪里产生影响。八座城市，EEC 与非 EEC 对比，ASCN 成员与其它对比，旅游与工业对比。",
        })}
      </p>

      {/* ────── ASEAN toolkit reference (top) ────── */}
      <div className="asean-toolkit-box">
        <p className="asean-toolkit-eyebrow">
          {t(locale, {
            en: "ASEAN SMART CITY FINANCING TOOLKIT",
            th: "ASEAN SMART CITY FINANCING TOOLKIT",
            zh: "ASEAN 智能城市融资工具包",
          })}
        </p>
        <p className="asean-toolkit-body">
          {t(locale, {
            en: "The Toolkit is the official ASEAN-wide resource. FIRST recommends financing instruments based on your project type, stage, and green outcomes. The Thai case study in the Toolkit is a wind-farm GSSS Bond — the same instrument Phuket can use for coastal climate infrastructure.",
            th: "Toolkit เป็นทรัพยากรอย่างเป็นทางการของอาเซียน FIRST แนะนำเครื่องมือการเงินตามประเภทโครงการ ขั้นตอน และผลลัพธ์ด้านสีเขียว เคสไทยใน Toolkit คือ GSSS Bond กังหันลม — เครื่องมือเดียวกันที่ภูเก็ตใช้ได้กับโครงสร้างพื้นฐานชายฝั่งทนภูมิอากาศ",
            zh: "该工具包是东盟范围内的官方资源。FIRST 根据您的项目类型、阶段和绿色成果推荐融资工具。工具包中的泰国案例是风电 GSSS 债券 — Phuket 可用于海岸气候基础设施的同一工具。",
          })}
        </p>
        <div className="asean-toolkit-actions">
          <a className="asean-toolkit-link" href={`${ASEAN_TOOLKIT_BASE}/first/`} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "Use FIRST →", th: "ใช้ FIRST →", zh: "使用 FIRST →" })}
          </a>
          <a className="asean-toolkit-link" href={`${ASEAN_TOOLKIT_BASE}/resources/`} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "Resources (ADB ACGF, AASCTF, JASCA) →", th: "ทรัพยากร (ADB ACGF, AASCTF, JASCA) →", zh: "资源（ADB ACGF、AASCTF、JASCA）→" })}
          </a>
          <a className="asean-toolkit-link" href={THAI_CASE_URL} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "Thailand case study (Green Bond) →", th: "เคสไทย (Green Bond) →", zh: "泰国案例（绿色债券）→" })}
          </a>
        </div>
      </div>

      {/* ────── Comparison table ────── */}
      <div className="city-lens-table-wrap">
        <h3 className="city-lens-table-h">
          {t(locale, { en: "At a glance: 8 cities, 4 axes", th: "ผ่านตา: 8 เมือง 4 แกน", zh: "一览：8 城 4 轴" })}
        </h3>
        <table className="city-lens-table">
          <thead>
            <tr>
              <th>{t(locale, { en: "City", th: "เมือง", zh: "城市" })}</th>
              <th>{t(locale, { en: "Province", th: "จังหวัด", zh: "府" })}</th>
              <th>{t(locale, { en: "BOI Zone", th: "เขต BOI", zh: "BOI 区" })}</th>
              <th>{t(locale, { en: "ASCN", th: "ASCN", zh: "ASCN" })}</th>
              <th>{t(locale, { en: "Best Vehicle", th: "เครื่องมือที่ดีที่สุด", zh: "最佳工具" })}</th>
              <th>{t(locale, { en: "Key Risk", th: "ความเสี่ยงหลัก", zh: "主要风险" })}</th>
            </tr>
          </thead>
          <tbody>
            {CITY_INVESTMENT_PROFILES.map(p => {
              const city = p.cityId ? getCityById(p.cityId) : undefined;
              const subjectLabel = p.subjectKind === "metropolitan"
                ? (locale === "th" ? p.provinceTh : p.provinceEn)
                : city
                  ? (locale === "th" ? city.nameTh : city.nameEn)
                  : p.provinceEn;
              return (
                <tr key={p.cityId ?? p.provinceEn} onClick={() => city && onNavigate(`/city/${city.id}/`)}>
                  <td className="cell-city">{subjectLabel}</td>
                  <td>{locale === "th" ? p.provinceTh : p.provinceEn}</td>
                  <td>
                    {p.eecZone
                      ? <span className="tag-eec">EEC</span>
                      : <span className="tag-noneec">non-EEC</span>}
                  </td>
                  <td className="cell-ascn">{p.ascnMember ? "✓" : "—"}</td>
                  <td className="cell-tool">{toolName(locale, p.primaryTool)}</td>
                  <td className="cell-risk">{t(locale, p.keyRisk)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ────── 8 city cards (deep dive) ────── */}
      <h3 className="city-lens-cards-h">
        {t(locale, { en: "Eight short-list cities, in detail", th: "แปดเมืองที่ควรพิจารณา โดยละเอียด", zh: "八座入围城市，详解" })}
      </h3>
      <div className="city-lens-grid">
        {CITY_INVESTMENT_PROFILES.map(p => {
          const city = p.cityId ? getCityById(p.cityId) : undefined;
          const subjectLabel = p.subjectKind === "metropolitan"
            ? (locale === "th" ? p.provinceTh : p.provinceEn)
            : city
              ? (locale === "th" ? city.nameTh : city.nameEn)
              : p.provinceEn;
          return (
            <article key={p.cityId ?? p.provinceEn} className="city-lens-card">
              <header className="city-lens-card-h">
                <h4>{subjectLabel}</h4>
                <div className="city-lens-card-tags">
                  {p.eecZone && <span className="tag-eec">EEC</span>}
                  {p.ascnMember && <span className="tag-ascn">ASCN</span>}
                </div>
              </header>
              <p className="city-lens-one-liner">{t(locale, p.oneLiner)}</p>
              <div className="city-lens-tools">
                <span className="city-lens-tool primary">
                  <span className="city-lens-tool-l">{t(locale, { en: "PRIMARY", th: "หลัก", zh: "主" })}</span>
                  <span className="city-lens-tool-v">{toolName(locale, p.primaryTool)}</span>
                </span>
                <span className="city-lens-tool">
                  <span className="city-lens-tool-l">{t(locale, { en: "SECONDARY", th: "รอง", zh: "次" })}</span>
                  <span className="city-lens-tool-v">{toolName(locale, p.secondaryTool)}</span>
                </span>
              </div>
              <div className="city-lens-best">
                <span className="city-lens-kicker">{t(locale, { en: "BEST FOR", th: "เหมาะกับ", zh: "最适合" })}</span>
                <p>{t(locale, p.bestFor)}</p>
              </div>
              <div className="city-lens-risk">
                <span className="city-lens-kicker">{t(locale, { en: "KEY RISK", th: "ความเสี่ยงหลัก", zh: "主要风险" })}</span>
                <p>{t(locale, p.keyRisk)}</p>
              </div>
              {p.climateNote && (
                <div className="city-lens-climate">
                  <span className="city-lens-kicker">{t(locale, { en: "CLIMATE", th: "ภูมิอากาศ", zh: "气候" })}</span>
                  <p>{t(locale, p.climateNote)}</p>
                </div>
              )}
              <footer className="city-lens-case">
                <span className="city-lens-kicker">{t(locale, { en: "COMPARABLE ASEAN CASE", th: "เคสอาเซียนเปรียบเทียบ", zh: "可比较的东盟案例" })}</span>
                <p>
                  <span className="city-lens-case-flag">{p.comparableCase.flagEmoji}</span>
                  <strong>{p.comparableCase.country}:</strong>{" "}
                  {p.comparableCase.caseName}
                </p>
                <p className="city-lens-case-meta">
                  {p.comparableCase.amount} ·{" "}
                  <a href={p.comparableCase.caseUrl} target="_blank" rel="noopener noreferrer">
                    {t(locale, { en: "View in Toolkit →", th: "ดูใน Toolkit →", zh: "在工具包中查看 →" })}
                  </a>
                </p>
                <p className="city-lens-case-line">{t(locale, p.comparableCase.oneLine)}</p>
              </footer>
              {city && (
                <a
                  className="city-lens-deep"
                  href={`/city/${city.id}/`}
                  onClick={e => { e.preventDefault(); onNavigate(`/city/${city.id}/`); }}
                >
                  {t(locale, { en: "Open city dossier →", th: "เปิดแฟ้มเมือง →", zh: "打开城市档案 →" })}
                </a>
              )}
            </article>
          );
        })}
      </div>

      {/* ────── ASEAN toolkit reference (bottom — one-stop reminder) ────── */}
      <div className="asean-toolkit-box asean-toolkit-box-bottom">
        <p className="asean-toolkit-body">
          {t(locale, {
            en: "One-stop service for smart cities in Thailand. For the regional map and the FIRST quiz, see the ASEAN Smart City Financing Toolkit. For Thailand-specific data — the dossier every city, the country climate report, the audited investor lens above — this site is the working layer on top.",
            th: "บริการครบวงจรสำหรับเมืองอัจฉริยะในประเทศไทย สำหรับแผนที่ระดับภูมิภาคและแบบทดสอบ FIRST ดู ASEAN Smart City Financing Toolkit สำหรับข้อมูลเฉพาะประเทศไทย — แฟ้มเมืองทุกเมือง รายงานสภาพภูมิอากาศประเทศ เลนส์การลงทุนที่ตรวจสอบแล้วด้านบน — ไซต์นี้คือชั้นทำงานที่อยู่บนสุด",
            zh: "泰国智能城市的一站式服务。如需区域地图和 FIRST 测验，请参阅 ASEAN 智能城市融资工具包。如需泰国特定数据 — 每座城市的档案、国家气候报告、上方经过审计的投资者视角 — 本网站是顶部的实际工作层。",
          })}
        </p>
        <div className="asean-toolkit-actions">
          <a className="asean-toolkit-link" href={`${ASEAN_TOOLKIT_BASE}/first/`} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "FIRST quiz →", th: "แบบทดสอบ FIRST →", zh: "FIRST 测验 →" })}
          </a>
          <a className="asean-toolkit-link" href={`${ASEAN_TOOLKIT_BASE}/case-studies/`} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "All case studies →", th: "เคสทั้งหมด →", zh: "所有案例 →" })}
          </a>
          <a className="asean-toolkit-link" href={`${ASEAN_TOOLKIT_BASE}/financial-instruments/`} target="_blank" rel="noopener noreferrer">
            {t(locale, { en: "Instruments library →", th: "คลังเครื่องมือ →", zh: "工具库 →" })}
          </a>
        </div>
      </div>
    </section>
  );
}
