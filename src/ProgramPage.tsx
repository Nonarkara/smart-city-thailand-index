import { useMemo } from "react";
import { useCitySummaries } from "./cityApi";
import { summarizeCities } from "./cityCollections";
import { translate } from "./cityPresentation";
import type { Locale, SmartDimension } from "./types";
import { DIMENSION_LABELS } from "./types";
import { assetUrl } from "./mediaAssets";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

const DIMENSION_DESCS: Record<SmartDimension, { en: string; th: string; zh: string }> = {
  economy: { en: "Resource management and economic optimization.", th: "การบริหารจัดการทรัพยากรและการเพิ่มประสิทธิภาพเศรษฐกิจ", zh: "资源管理与经济优化。" },
  energy: { en: "Clean energy balance and conservation.", th: "สมดุลพลังงานสะอาดและการอนุรักษ์", zh: "清洁能源平衡与保护。" },
  environment: { en: "Ecological quality and urban sustainability.", th: "คุณภาพทางนิเวศและความยั่งยืนของเมือง", zh: "生态质量与城市可持续性。" },
  governance: { en: "Open data and digital accountability.", th: "ข้อมูลเปิดและความโปร่งใสทางดิจิทัล", zh: "开放数据与数字问责制。" },
  living: { en: "Quality of life, safety, and health innovation.", th: "นวัตกรรมคุณภาพชีวิต ความปลอดภัย และสุขภาพ", zh: "生活质量、安全与健康创新。" },
  mobility: { en: "Sustainable transit and traffic solutions.", th: "โซลูชันขนส่งและความยั่งยืนของการจราจร", zh: "可持续交通与交通解决方案。" },
  people: { en: "Skills development and creativity growth.", th: "การพัฒนาทักษะและการเติบโตของความคิดสร้างสรรค์", zh: "技能培训与创造力增长。" },
};

const CERT_STEPS = [
  { en: "APPLY", th: "ยื่นใบสมัคร", zh: "申请", desc: { en: "Municipality submits master plan and smart blueprint.", th: "เทศบาลยื่นแผนแม่บทและพิมพ์เขียวอัจฉริยะ", zh: "市政当局提交总体规划和智能蓝图。" } },
  { en: "EVALUATE", th: "ประเมินผล", zh: "评估", desc: { en: "depa technical committee reviews across 7 dimensions.", th: "คณะกรรมการเทคนิค depa ตรวจสอบ 7 มิติ", zh: "depa 技术委员会对 7 个维度进行评审。" } },
  { en: "APPROVE", th: "อนุมัติ", zh: "批准", desc: { en: "National Smart City Committee reviews and approves.", th: "คณะกรรมการเมืองอัจฉริยะแห่งชาติพิจารณาและอนุมัติ", zh: "国家智慧城市委员会进行审查并批准。" } },
  { en: "CERTIFY", th: "รับรอง", zh: "认证", desc: { en: "City receives Local logo. Outcome reporting begins.", th: "เมืองได้รับตราสัญลักษณ์ เริ่มรายงานผลลัพธ์", zh: "城市获得标识。开始成果报告。" } },
];

const BATCHES = [
  { batch: 1, year: "2019", cities: 15, label: { en: "PIONEERS", th: "ผู้บุกเบิก", zh: "先驱者" } },
  { batch: 2, year: "2021", cities: 15, label: { en: "EXPANSION", th: "ขยายผล", zh: "扩成果" } },
  { batch: 3, year: "2023", cities: 6, label: { en: "CONSOLIDATION", th: "รวมพลัง", zh: "凝力量" } },
  { batch: 4, year: "2025", cities: 1, label: { en: "LATEST", th: "ล่าสุด", zh: "最新批次" } },
];

export default function ProgramPage({ locale, onNavigate }: Props) {
  const { data: cities } = useCitySummaries();
  const stats = useMemo(() => summarizeCities(cities), [cities]);
  const dimensions: SmartDimension[] = ["environment", "economy", "mobility", "energy", "people", "living", "governance"];
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  return (
    <div className="program-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Policy Framework // DEPA-MDES", th: "กรอบนโยบาย // DEPA-MDES", zh: "政策框架 // DEPA-MDES" })}</p>
        <h1 className="hero-title">{t({ en: "Smart City Thailand", th: "เมืองอัจฉริยะประเทศไทย", zh: "泰国智慧城市" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Smart city is a process, not a result. A framework to comprehend, adapt, and transform Thai cities where citizens come first and technology remains in the background.",
            th: "เมืองอัจฉริยะคือกระบวนการ ไม่ใช่ผลลัพธ์ กรอบการทำงานเพื่อความเข้าใจ การปรับตัว และการเปลี่ยนแปลงเมืองไทย โดยยึดประชาชนเป็นศูนย์กลาง",
            zh: "智慧城市是一个过程，不是结果。这是一个理解、适应和改变泰国城市的框架，市民在中心，技术在幕后。",
          })}
        </p>
      </section>

      {/* 2. CORE CONCEPTS */}
      <section className="section reveal visible">
         <div className="data-sheet-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
           <div className="data-sheet">
             <div className="data-label" style={{ color: 'var(--a-500)' }}>CONCEPT 01</div>
             <div className="data-sheet-title">{t({ en: "CITIZEN CENTERED", th: "ประชาชนเป็นศูนย์กลาง", zh: "以市民为中心" })}</div>
             <p className="data-note" style={{ color: 'var(--n-900)' }}>{t({ en: "Technology serves quality of life, not hardware metrics.", th: "เทคโนโลยีรับใช้คุณภาพชีวิต ไม่ใช่วัดแค่ที่สเปกฮาร์ดแวร์", zh: "技术为生活质量服务，而非硬件指标。" })}</p>
           </div>
           <div className="data-sheet">
             <div className="data-label" style={{ color: 'var(--a-500)' }}>CONCEPT 02</div>
             <div className="data-sheet-title">{t({ en: "PPPP ALLIANCE", th: "พันธมิตร PPPP", zh: "PPPP 联盟" })}</div>
             <p className="data-note" style={{ color: 'var(--n-900)' }}>{t({ en: "People-Public-Private-Partnership. Citizens are the primary stakeholder.", th: "ประชาชน-รัฐ-เอกชน. ประชาชนคือผู้มีส่วนได้ส่วนเสียหลัก", zh: "人民-政府-私营合作。人民是主要的利益相关者。" })}</p>
           </div>
           <div className="data-sheet">
             <div className="data-label" style={{ color: 'var(--a-500)' }}>CONCEPT 03</div>
             <div className="data-sheet-title">{t({ en: "SIMULTANEOUS GROWTH", th: "การเติบโตพร้อมกัน", zh: "同步增长" })}</div>
             <p className="data-note" style={{ color: 'var(--n-900)' }}>{t({ en: "Physical and digital infrastructures must develop in parallel.", th: "โครงสร้างพื้นฐานกายภาพและดิจิทัลต้องพัฒนาไปพร้อมกัน", zh: "物理和数字基础设施必须并行发展。" })}</p>
           </div>
         </div>
      </section>

      {/* 3. MNEMONIC MATRIX (2-5-7) */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Development Mnemonic", th: "สูตรช่วยจำการพัฒนา", zh: "发展助记符" })}</p>
        <div className="data-sheet" style={{ background: 'var(--n-50)' }}>
           <div className="data-sheet-title" style={{ fontSize: '32px', fontWeight: 800 }}>2 - 5 - 7</div>
           <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
             <div>
               <div className="data-label">2 TYPES</div>
               <p className="data-note"><b>Livable</b> (Existing) / <b>New</b> (Greenfield)</p>
             </div>
             <div>
               <div className="data-label">5 CRITERIA</div>
               <p className="data-note">Vision, Infrastructure, CDP, Projects, Model.</p>
             </div>
             <div>
               <div className="data-label">7 DIMENSIONS</div>
               <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                 {dimensions.map(d => <span key={d} className="dim-chip" style={{ fontSize: '9px', padding: '2px 6px' }}>{DIMENSION_LABELS[locale][d].toUpperCase()}</span>)}
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* 4. EXECUTION ROADMAP */}
      <section className="section reveal visible">
        <p className="eyebrow">{t({ en: "Certification Flow", th: "ขั้นตอนการรับรอง", zh: "认证流程" })}</p>
        <div className="data-sheet" style={{ padding: 0 }}>
           {CERT_STEPS.map((step, i) => (
             <div key={i} className="data-row" style={{ padding: 'var(--space-3)' }}>
                <span className="data-label" style={{ width: '40px', fontWeight: 800, color: 'var(--a-500)' }}>0{i+1}</span>
                <span className="data-value" style={{ flex: 1, textAlign: 'left', fontWeight: 700 }}>{t(step)}</span>
                <span className="data-note" style={{ flex: 2 }}>{t(step.desc)}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 5. OPERATIONAL AUDIT */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <p className="eyebrow">{t({ en: "Deployment statistics", th: "สถิติการใช้งาน", zh: "部署统计" })}</p>
        <div className="data-sheet" style={{ background: 'var(--n-900)', color: 'var(--n-0)' }}>
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', textAlign: 'center' }}>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>CERTIFIED</div>
               <div className="data-value" style={{ fontSize: '40px', color: 'var(--a-300)' }}>{stats.certified}</div>
             </div>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>PROMOTION</div>
               <div className="data-value" style={{ fontSize: '40px' }}>173+</div>
             </div>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>OPERATIONAL</div>
               <div className="data-value" style={{ fontSize: '40px' }}>{stats.operational}</div>
             </div>
             <div>
               <div className="data-label" style={{ color: 'var(--n-400)' }}>2027 TARGET</div>
               <div className="data-value" style={{ fontSize: '40px' }}>105</div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
}
