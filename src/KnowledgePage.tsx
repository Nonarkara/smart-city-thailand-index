import { useState, useMemo } from "react";
import type { Locale } from "./types";
import { translate } from "./cityPresentation";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface FAQ {
  category: string;
  q: { en: string; th: string; zh: string };
  a: { en: string; th: string; zh: string };
}

const CATEGORY_LABELS: Record<string, { en: string; th: string; zh: string }> = {
  "Reality Check": { en: "REALITY CHECK", th: "ความจริงที่ต้องรู้", zh: "现实检验" },
  "About Smart City Thailand": { en: "INSTITUTIONAL", th: "เกี่ยวกับหน่วยงาน", zh: "机构相关" },
  "The 7 Smarts": { en: "FRAMEWORK", th: "กรอบแนวคิด", zh: "框架结构" },
  "Certification & Process": { en: "CERTIFICATION", th: "การรับรอง", zh: "认证流程" },
  "International": { en: "INTERNATIONAL", th: "ระหว่างประเทศ", zh: "国际合作" },
  "Methodology": { en: "METHODOLOGY", th: "ระเบียบวิธี", zh: "方法论" },
  "Governance": { en: "GOVERNANCE", th: "ธรรมาภิบาล", zh: "治理结构" },
  "Accountability": { en: "ACCOUNTABILITY", th: "ความรับผิดชอบ", zh: "问责制度" },
  "Success": { en: "CASE STUDIES", th: "กรณีศึกษา", zh: "案例研究" },
  "About SCITI": { en: "SCITI INDEX", th: "เกี่ยวกับ SCITI", zh: "关于 SCITI" },
};

const FAQS: FAQ[] = [
  {
    category: "Reality Check",
    q: { en: "Why is a city certified but ranked 'Gamma'?", th: "ทำไมเมืองได้ตราสัญลักษณ์แต่ถูกจัดอยู่กลุ่ม Gamma?", zh: "为什么城市获得了认证但却被评为 Gamma？" },
    a: { en: "Certification acknowledges a plan. Our index measures the reality. SCITI measures what actually runs: operational sensors, open data feeds, and citizen outcomes.", th: "การรับรองคือการรับรองแผน แต่ SCITI วัดสิ่งที่ทำงานจริง: เซ็นเซอร์ ข้อมูลเปิด และผลลัพธ์ต่อพลเมือง", zh: "认证是对计划的认可。SCITI 衡量的是实际运行的情况：运营传感器、开放数据和市民成果。" },
  },
  {
    category: "Accountability",
    q: { en: "What happens if a city's data is outdated?", th: "จะเกิดอะไรขึ้นถ้าข้อมูลของเมืองล้าสมัย?", zh: "如果城市的数据过时了会怎样？" },
    a: { en: "The score drops automatically. SCITI applies a Data Confidence penalty: if a city stops reporting or if their CDP goes offline, the multiplier automatically lowers the composite score.", th: "คะแนนจะลดอัตโนมัติ SCITI ใช้ค่าปรับความเชื่อมั่นข้อมูล หากเมืองหยุดรายงานหรือ CDP ล่ม ตัวคูณจะหักคะแนนรวมทันที", zh: "得分会自动下降。SCITI 应用数据置信度罚分：如果城市停止报告或其 CDP 下线，乘数会自动降低综合得分。" },
  },
  {
    category: "Methodology",
    q: { en: "Why is 'Livability' weighted higher than 'Digital'?", th: "ทำไม 'ความน่าอยู่' ถึงน้ำหนักเยอะกว่า 'ดิจิทัล'?", zh: "为什么“宜居性”的权重高于“数字”？" },
    a: { en: "Technology is a tool, not the objective. A smart city with 5G but broken sidewalks is a failure. We prioritize Livability (25%) because a city must function for citizens first.", th: "เทคโนโลยีคือเครื่องมือ ไม่ใช่เป้าหมาย เมืองที่มี 5G แต่ทางเท้าพังคือความล้มเหลว เราให้ความสำคัญกับการอยู่อาศัยเป็นอันดับแรก", zh: "技术是工具，不是目标。拥有 5G 但人行道破损的城市是失败的。我们优先考虑宜居性，因为城市必须首先为市民服务。" },
  },
  {
    category: "Success",
    q: { en: "Which city is the best model for Thailand?", th: "เมืองไหนที่เป็นต้นแบบที่ดีที่สุดสำหรับไทย?", zh: "哪个城市是泰国的最佳榜样？" },
    a: { en: "Nakhon Si Thammarat. It proves smart cities work without being rich. It focuses on local pain points like flood management with appropriate tech—not expensive platforms.", th: "นครศรีธรรมราช พิสูจน์ว่าเมืองอัจฉริยะทำงานได้โดยไม่ต้องรวย เน้นแก้ปัญหาจริงอย่างน้ำท่วมด้วยเทคโนโลยีที่เหมาะสม ไม่ใช่อุปกรณ์ราคาแพง", zh: "洛坤府。它证明智慧城市不需要富有也能运作。它专注于用适当的技术解决当地痛点（如洪水管理），而非昂贵的平台。" },
  },
];

export default function KnowledgePage({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const t = (obj: { en: string; th: string; zh: string }) => translate(locale, obj);

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const matchesSearch = !search || f.q[locale].toLowerCase().includes(search.toLowerCase()) || f.a[locale].toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, locale]);

  const categories = ["all", ...new Set(FAQS.map(f => f.category))];

  return (
    <div className="knowledge-page" style={{ paddingBottom: 'var(--space-8)' }}>
      {/* 1. HERO SIGNAGE */}
      <section className="section hero-signage reveal visible">
        <p className="eyebrow">{t({ en: "Intelligence Repository // SCITI-2026", th: "คลังข้อมูลอัจฉริยะ // SCITI-2569", zh: "情报库 // SCITI-2026" })}</p>
        <h1 className="hero-title">{t({ en: "Knowledge Base", th: "คลังความรู้", zh: "知识库" })}</h1>
        <p className="hero-strapline">
          {t({
            en: "Technical guidance and frequently asked questions distilled from institutional reality and data audits.",
            th: "คำแนะนำทางเทคนิคและคำถามที่พบบ่อย สรุปจากความจริงเชิงสถาบันและการตรวจสอบข้อมูล",
            zh: "从机构现实和数据审计中提炼出的技术指导和常见问题解答。",
          })}
        </p>
      </section>

      {/* 2. SEARCH & FILTER HUB */}
      <section className="section reveal visible">
        <div className="data-sheet" style={{ background: 'var(--n-50)' }}>
           <input
             type="text"
             className="data-value"
             style={{ width: '100%', background: 'transparent', border: 0, borderBottom: '2px solid var(--n-200)', borderRadius: 0, padding: 'var(--space-2) 0', fontSize: '24px', outline: 'none' }}
             placeholder={t({ en: "SEARCH RECORDS...", th: "ค้นหาข้อมูล...", zh: "搜索记录..." })}
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
           <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', background: 'var(--n-100)', border: '1px solid var(--n-100)', marginTop: 'var(--space-3)' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`btn-tab ${activeCategory === cat ? 'active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                  style={{ textTransform: 'uppercase' }}
                >
                  {cat === 'all' ? 'ALL' : t(CATEGORY_LABELS[cat] || { en: cat, th: cat, zh: cat })}
                </button>
              ))}
           </div>
        </div>
      </section>

      {/* 3. FAQ DOSSIER */}
      <section className="section reveal visible" style={{ borderBottom: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          {filtered.map((faq, i) => (
            <details key={i} className="data-sheet" style={{ cursor: 'pointer' }}>
              <summary className="data-row" style={{ listStyle: 'none', padding: 0 }}>
                <span className="data-label" style={{ color: 'var(--a-500)', width: '120px' }}>{t(CATEGORY_LABELS[faq.category] || { en: faq.category, th: faq.category, zh: faq.category })}</span>
                <span className="data-value" style={{ flex: 1, textAlign: 'left', fontWeight: 700 }}>{faq.q[locale]}</span>
                <span className="data-note" style={{ color: 'var(--n-400)' }}>[EXPAND]</span>
              </summary>
              <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', background: 'var(--n-50)', borderLeft: '2px solid var(--a-500)' }}>
                <p className="data-note" style={{ color: 'var(--n-900)', fontSize: '14px', lineHeight: 1.5 }}>{faq.a[locale]}</p>
              </div>
            </details>
          ))}
          {filtered.length === 0 && (
            <div className="data-sheet" style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
              <p className="data-note">NO RECORDS MATCHING QUERY</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
