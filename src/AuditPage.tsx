import { useMemo } from "react";
import { assetUrl } from "./assetUtils";
import { buildAuditReleaseSummary } from "./auditData";
import { getCityFactsCsv } from "./cityCdp";
import { translate } from "./cityPresentation";
import { dataSources } from "./evidenceData";
import {
  SCITI_DATA_CUTOFF_ISO,
  SCITI_METHOD_CODE,
  SCITI_METHOD_VERSION,
} from "./methodologySpec";
import type { Locale } from "./types";
import { PILLAR_LABELS } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const GITHUB_URL = "https://github.com/Nonarkara/smart-city-thailand-index";
const LINKED_DATA_SOURCES = dataSources.filter(source => source.url.trim() !== "");

function downloadFactsCsv() {
  const blob = new Blob([getCityFactsCsv()], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "sciti-2026-source-linked-facts.csv";
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function AuditPage({ locale, onNavigate }: Props) {
  const [scopeRef, scopeVisible] = useInView(0.1);
  const [proofRef, proofVisible] = useInView(0.1);
  const [sourceRef, sourceVisible] = useInView(0.1);
  const [limitsRef, limitsVisible] = useInView(0.1);
  const [routeRef, routeVisible] = useInView(0.1);

  const audit = useMemo(() => buildAuditReleaseSummary(), []);

  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const releaseDate = SCITI_DATA_CUTOFF_ISO.slice(0, 10);

  const scopeKpis = [
    {
      value: audit.cities.length,
      label: { en: "City records", th: "ระเบียนเมือง", zh: "城市记录" },
      sub: { en: "Release dataset", th: "ชุดข้อมูลฉบับเผยแพร่", zh: "发布数据集" },
    },
    {
      value: audit.fullDossiers,
      label: { en: "Research dossiers", th: "แฟ้มวิจัย", zh: "研究档案" },
      sub: { en: "Certified + promotion", th: "รับรอง + เขตส่งเสริม", zh: "认证 + 推广" },
    },
    {
      value: audit.metricRows,
      label: { en: "Baseline rows", th: "แถวข้อมูลฐาน", zh: "基线数据行" },
      sub: { en: "In provenance export", th: "ในไฟล์ส่งออกแหล่งที่มา", zh: "溯源导出" },
    },
    {
      value: LINKED_DATA_SOURCES.length,
      label: { en: "Source families", th: "ตระกูลแหล่งข้อมูล", zh: "来源族群" },
      sub: { en: "Public registry", th: "ทะเบียนสาธารณะ", zh: "公开名录" },
    },
  ];

  const confidenceRows = [
    {
      key: "high",
      value: audit.confidence.high,
      label: { en: "High confidence", th: "ความเชื่อมั่นสูง", zh: "高置信" },
      desc: { en: "Full research dossiers with baseline coverage and provenance support.", th: "แฟ้มวิจัยเต็มรูปแบบ มีข้อมูลฐานและแหล่งที่มารองรับ", zh: "具备基线覆盖与溯源支持的完整研究档案。" },
    },
    {
      key: "medium",
      value: audit.confidence.medium,
      label: { en: "Medium confidence", th: "ความเชื่อมั่นปานกลาง", zh: "中置信" },
      desc: { en: "The formula allows this band; this release currently contains none.", th: "สูตรรองรับระดับนี้ แต่ฉบับปัจจุบันยังไม่มีเมืองในกลุ่มนี้", zh: "模型保留此等级；当前版本暂无记录。" },
    },
    {
      key: "low",
      value: audit.confidence.low,
      label: { en: "Registry only", th: "ข้อมูลระดับทะเบียน", zh: "仅名录信息" },
      desc: { en: "Kept visible as gaps, not padded with invented municipal metrics.", th: "คงไว้ให้เห็นช่องว่าง โดยไม่เติมตัวชี้วัดระดับเมืองขึ้นมาเอง", zh: "保留缺口，不以虚构的市级指标填充。" },
    },
  ];

  return (
    <div className="audit-page">
      <section className="section audit-hero reveal visible">
        <p className="eyebrow">{t({ en: "Jury walk-through", th: "เส้นทางสำหรับคณะกรรมการ", zh: "评审导览" })}</p>
        <h1 className="hero-title">{t({ en: "Follow the evidence, not the pitch.", th: "ตามหลักฐาน ไม่ใช่คำโฆษณา", zh: "看证据，不听推销。" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "This is the shortest route through SCITI: release scope, one reproducible score, source institutions, exports, the Needs Ladder overlay, and the limits we will not hide.",
            th: "นี่คือเส้นทางสั้นที่สุดในการตรวจ SCITI: ขอบเขตฉบับเผยแพร่ ตัวอย่างคะแนนที่คำนวณซ้ำได้ สถาบันต้นทาง ไฟล์ส่งออก บันไดความสำคัญ และข้อจำกัดที่เราไม่ปกปิด",
            zh: "这是审阅 SCITI 的最短路径：发布范围、一项可复算评分、来源机构、导出文件、需求阶梯叠加层，以及我们不会隐藏的局限。",
          })}
        </p>
        <div className="audit-release-stamp">
          <span>{SCITI_METHOD_CODE}</span>
          <span>{t({ en: "Version", th: "เวอร์ชัน", zh: "版本" })} {SCITI_METHOD_VERSION}</span>
          <span>{t({ en: "Release cut-off", th: "วันตัดข้อมูล", zh: "发布截点" })} {releaseDate}</span>
        </div>
      </section>

      <section ref={scopeRef} className={`section audit-section reveal stagger-1 ${scopeVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "01 / Scope", th: "01 / ขอบเขต", zh: "01 / 范围" })}</p>
        <h2>{t({ en: "What is actually in this release", th: "สิ่งที่อยู่ในฉบับนี้จริง", zh: "本次发布实际包含什么" })}</h2>
        <div className="audit-kpi-grid">
          {scopeKpis.map(item => (
            <div key={item.label.en} className="audit-kpi">
              <div className="audit-kpi-value">{item.value}</div>
              <div className="audit-kpi-label">{t(item.label)}</div>
              <div className="audit-kpi-sub">{t(item.sub)}</div>
            </div>
          ))}
        </div>
        <div className="audit-scope-ledger" aria-label={t({ en: "Release composition", th: "องค์ประกอบฉบับเผยแพร่", zh: "发布构成" })}>
          <span>{t({ en: "Certified", th: "รับรองแล้ว", zh: "已认证" })} <strong>{audit.status.certified}</strong></span>
          <span>{t({ en: "Promotion", th: "เขตส่งเสริม", zh: "推广" })} <strong>{audit.status.promotion}</strong></span>
          <span>{t({ en: "Registered", th: "ขึ้นทะเบียน", zh: "已登记" })} <strong>{audit.status.registered}</strong></span>
        </div>
        <p className="audit-disclosure">
          {t({
            en: `SCITI does not claim that all ${audit.cities.length} records have equal evidence. ${audit.registeredOnly} registry-only entries remain deliberately low-confidence until city-level evidence is available. This release is an index dataset, not the complete national proposal registry.`,
            th: `SCITI ไม่อ้างว่าระเบียนทั้ง ${audit.cities.length} แห่งมีหลักฐานเท่ากัน รายการระดับทะเบียน ${audit.registeredOnly} แห่งถูกคงไว้ที่ความเชื่อมั่นต่ำโดยตั้งใจ จนกว่าจะมีหลักฐานระดับเมือง ฉบับนี้คือชุดข้อมูลดัชนี ไม่ใช่ทะเบียนข้อเสนอระดับชาติทั้งหมด`,
            zh: `SCITI 不声称 ${audit.cities.length} 条记录拥有同等证据。${audit.registeredOnly} 条仅名录记录在取得市级证据前会保持低置信。本版本是指数数据集，并非全国全部提案名录。`,
          })}
        </p>
      </section>

      <section ref={proofRef} className={`section audit-section reveal stagger-2 ${proofVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "02 / Reproduce", th: "02 / คำนวณซ้ำ", zh: "02 / 复算" })}</p>
        <h2>{t({ en: `Rebuild ${audit.example.nameEn}'s score`, th: `คำนวณคะแนน ${audit.example.nameTh} ใหม่`, zh: `复算 ${audit.example.nameEn} 的分数` })}</h2>
        <p className="section-intro">
          {t({
            en: "The composite is arithmetic, not editorial judgement. Multiply each published pillar score by its fixed weight, sum the contributions, and round to one decimal place.",
            th: "คะแนนรวมเป็นเลขคณิต ไม่ใช่ดุลยพินิจของบรรณาธิการ นำคะแนนแต่ละเสาหลักคูณน้ำหนักคงที่ รวมผลลัพธ์ แล้วปัดเป็นทศนิยมหนึ่งตำแหน่ง",
            zh: "综合分是算术结果，不是编辑判断。将每项公开支柱分乘以固定权重，合计贡献值，再保留一位小数。",
          })}
        </p>
        <div className="audit-proof">
          <div className="audit-proof-terms">
            {audit.breakdown.terms.map(term => (
              <div key={term.pillar} className="audit-proof-row">
                <span>{PILLAR_LABELS[locale][term.pillar]}</span>
                <code>{term.score} × {term.weight}%</code>
                <strong>{term.contribution.toFixed(2)}</strong>
              </div>
            ))}
          </div>
          <div className="audit-proof-result">
            <span>{t({ en: "Published composite", th: "คะแนนรวมที่เผยแพร่", zh: "公开综合分" })}</span>
            <strong>{audit.breakdown.composite.toFixed(1)}</strong>
            <code>{audit.breakdown.terms.map(term => term.contribution.toFixed(2)).join(" + ")} = {audit.breakdown.composite.toFixed(1)}</code>
          </div>
        </div>
        <div className="audit-domain-grid">
          {confidenceRows.map(row => (
            <div key={row.key} className="audit-domain-card">
              <h3 className="audit-domain-name">{t(row.label)}</h3>
              <div className="audit-domain-score-val">{row.value}</div>
              <p className="audit-domain-description">{t(row.desc)}</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={sourceRef} className={`section audit-section reveal stagger-3 ${sourceVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "03 / Sources", th: "03 / แหล่งข้อมูล", zh: "03 / 来源" })}</p>
        <h2>{t({ en: "Open the institutions behind the rows", th: "เปิดดูสถาบันต้นทางของแต่ละแถว", zh: "打开每行数据背后的机构" })}</h2>
        <p className="section-intro">
          {t({
            en: `${audit.sourceLinkedMetricRows} of ${audit.metricRows} exported baseline rows carry a source-institution URL. A link identifies the responsible publisher; it is not presented as proof that every value is municipal rather than provincial.`,
            th: `แถวข้อมูลฐานที่ส่งออก ${audit.sourceLinkedMetricRows} จาก ${audit.metricRows} แถว มี URL ของสถาบันต้นทาง ลิงก์นี้ระบุผู้เผยแพร่ที่รับผิดชอบ ไม่ได้ใช้แสร้งว่าทุกค่าเป็นข้อมูลระดับเทศบาลแทนข้อมูลระดับจังหวัด`,
            zh: `${audit.metricRows} 条导出基线中有 ${audit.sourceLinkedMetricRows} 条带来源机构链接。链接用于标明责任发布方，并不把省级值冒充为市级值。`,
          })}
        </p>
        <div className="audit-source-grid">
          {LINKED_DATA_SOURCES.map(source => (
            <a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer" className="audit-source-card">
              <span className="audit-source-type">{source.type}</span>
              <strong>{source.name}</strong>
              <span>{source.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</span>
              <span className="audit-source-frequency">{source.metrics.join(" · ")} ↗</span>
            </a>
          ))}
        </div>
        <div className="audit-verified-claims">
          {audit.verifiedClaims.map(claim => (
            <div key={claim.id} className="audit-verified-claim">
              <span>{claim.value}</span>
              <strong>{translate(locale, claim.label)}</strong>
              {claim.sourceUrl ? <a href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">{t({ en: "Official source ↗", th: "แหล่งทางการ ↗", zh: "官方来源 ↗" })}</a> : null}
            </div>
          ))}
        </div>
      </section>

      <section ref={limitsRef} className={`section audit-section reveal stagger-4 ${limitsVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "04 / Limits", th: "04 / ข้อจำกัด", zh: "04 / 局限" })}</p>
        <h2>{t({ en: "What the index does not know", th: "สิ่งที่ดัชนียังไม่รู้", zh: "指数不知道什么" })}</h2>
        <div className="audit-sentiment-grid">
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label">{t({ en: "Geographic level", th: "ระดับพื้นที่", zh: "地理层级" })}</p>
            <div className="audit-sentiment-pct">PROXY</div>
            <p className="audit-sentiment-desc">{t({ en: "Several economic, health, safety, and environmental baselines are provincial proxies for smaller city units. Each dossier labels that method role.", th: "ข้อมูลฐานด้านเศรษฐกิจ สุขภาพ ความปลอดภัย และสิ่งแวดล้อมหลายรายการเป็นตัวแทนระดับจังหวัดสำหรับหน่วยเมืองที่เล็กกว่า โดยแฟ้มเมืองระบุบทบาทนี้ไว้", zh: "部分经济、健康、安全与环境基线以省级数据代理较小城市单元；每份档案均标明该方法角色。" })}</p>
          </div>
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label">{t({ en: "Pillar scores", th: "คะแนนเสาหลัก", zh: "支柱评分" })}</p>
            <div className="audit-sentiment-pct">JUDGEMENT</div>
            <p className="audit-sentiment-desc">{t({ en: "Pillar scores are structured research assessments anchored in indicators and evidence. They are not raw API outputs. The composite alone is deterministic.", th: "คะแนนเสาหลักเป็นการประเมินงานวิจัยอย่างมีโครงสร้าง ยึดกับตัวชี้วัดและหลักฐาน ไม่ใช่ผลลัพธ์ดิบจาก API มีเพียงคะแนนรวมที่คำนวณแบบตายตัว", zh: "支柱分是以指标与证据为锚的结构化研究判断，并非 API 原始输出；只有综合分是确定性计算。" })}</p>
          </div>
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label">{t({ en: "Missing evidence", th: "หลักฐานที่ขาด", zh: "证据缺口" })}</p>
            <div className="audit-sentiment-pct">VISIBLE</div>
            <p className="audit-sentiment-desc">{t({ en: "Registry-only cities stay low-confidence. Unknown municipal values are not silently converted to zero, and confidence never changes the published composite.", th: "เมืองที่มีเพียงข้อมูลทะเบียนจะอยู่ในระดับความเชื่อมั่นต่ำ ค่าระดับเทศบาลที่ไม่ทราบจะไม่ถูกเปลี่ยนเป็นศูนย์ และค่าความเชื่อมั่นไม่เปลี่ยนคะแนนรวม", zh: "仅名录城市保持低置信；未知市级值不会被悄然改成零，置信度也不会改写综合分。" })}</p>
          </div>
          <div className="audit-sentiment-card">
            <p className="audit-sentiment-label">{t({ en: "Needs Ladder", th: "บันไดความสำคัญ", zh: "需求阶梯" })}</p>
            <div className="audit-sentiment-pct">OVERLAY</div>
            <p className="audit-sentiment-desc">
              {t({
                en: `Eight ordered human-need rungs on every dossier city — ${audit.needsLadder.meanCoverage}/${audit.needsLadder.rungs} scored on average, ${audit.needsLadder.meanObservedCoverage}/${audit.needsLadder.rungs} with an observed input, and ${audit.needsLadder.sourceEndpoints} exact overlay source endpoints exposed in dossiers. TomTom city/metro traffic backs calm for ${audit.needsLadder.calmTrafficBacked} index units only; the rest stay blank. The overlay never alters the published composite.`,
                th: `แปดขั้นความต้องการมนุษย์เรียงตามลำดับความสำคัญบนทุกเมืองที่มีแฟ้ม — ให้คะแนนเฉลี่ย ${audit.needsLadder.meanCoverage}/${audit.needsLadder.rungs} ขั้น ${audit.needsLadder.meanObservedCoverage}/${audit.needsLadder.rungs} ขั้นมีข้อมูลสังเกตเป็นตัวคำนวณ และแสดงปลายทางแหล่งข้อมูลของชั้นประกอบโดยตรง ${audit.needsLadder.sourceEndpoints} แห่งในแฟ้มเมือง ข้อมูลจราจรระดับเมือง/มหานครของ TomTom รองรับขั้นความสงบเพียง ${audit.needsLadder.calmTrafficBacked} หน่วยดัชนี ที่เหลือเว้นว่าง ชั้นข้อมูลนี้ไม่เปลี่ยนคะแนนรวมที่เผยแพร่`,
                zh: `每份研究档案上有八层按优先排序的人类需求阶梯——平均 ${audit.needsLadder.meanCoverage}/${audit.needsLadder.rungs} 层已评分，其中 ${audit.needsLadder.meanObservedCoverage}/${audit.needsLadder.rungs} 层含观测输入，并在档案中直接公开 ${audit.needsLadder.sourceEndpoints} 个辅助层来源端点。TomTom 城市/都会区交通数据仅支撑 ${audit.needsLadder.calmTrafficBacked} 个指数单元的“宁静”层，其余留空；该辅助层永不改写公开综合分。`,
              })}
            </p>
          </div>
        </div>
      </section>

      <section ref={routeRef} className={`section audit-section reveal stagger-5 ${routeVisible ? "visible" : ""}`}>
        <p className="eyebrow">{t({ en: "Jury route", th: "เส้นทางคณะกรรมการ", zh: "评审路线" })}</p>
        <h2>{t({ en: "Four checks. About four minutes.", th: "สี่จุดตรวจ ใช้เวลาประมาณสี่นาที", zh: "四项核验，约四分钟。" })}</h2>
        <div className="audit-route-grid">
          <button type="button" onClick={() => onNavigate("/rankings")}>
            <span>01</span><strong>{t({ en: "Test the ranking", th: "ทดสอบอันดับ", zh: "检验排名" })}</strong><small>{t({ en: "Change pillar and filters", th: "เปลี่ยนเสาหลักและตัวกรอง", zh: "切换支柱与筛选" })}</small>
          </button>
          <button type="button" onClick={() => onNavigate(`/city/${audit.example.id}`)}>
            <span>02</span><strong>{t({ en: "Open one dossier", th: "เปิดแฟ้มเมืองหนึ่งแห่ง", zh: "打开一份城市档案" })}</strong><small>{audit.example.nameEn}</small>
          </button>
          <button type="button" onClick={() => onNavigate("/methodology")}>
            <span>03</span><strong>{t({ en: "Challenge the method", th: "ตรวจทานระเบียบวิธี", zh: "质疑方法" })}</strong><small>{SCITI_METHOD_CODE}</small>
          </button>
          <button type="button" onClick={downloadFactsCsv}>
            <span>04</span><strong>{t({ en: "Take the evidence", th: "ดาวน์โหลดหลักฐาน", zh: "下载证据" })}</strong><small>CSV · {audit.metricRows} {t({ en: "baseline rows", th: "แถวข้อมูลฐาน", zh: "条基线" })}</small>
          </button>
        </div>
        <div className="audit-open-links">
          <a href={assetUrl("/downloads/SCITI-2026-cities-dataset.csv")} download>{t({ en: "118-city dataset (CSV)", th: "ชุดข้อมูล 118 เมือง (CSV)", zh: "118 城市数据集 (CSV)" })}</a>
          <a href={assetUrl("/downloads/SCITI-2026-Methodology.pdf")} download>{t({ en: "Methodology paper (PDF)", th: "เอกสารระเบียบวิธี (PDF)", zh: "方法论文 (PDF)" })}</a>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">{t({ en: "Public source code ↗", th: "ซอร์สโค้ดสาธารณะ ↗", zh: "公开源代码 ↗" })}</a>
        </div>
      </section>
    </div>
  );
}
