import { useState, useMemo } from "react";
import type { Locale } from "./types";
import { useInView } from "./useInView";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

interface FAQ {
  category: string;
  q: { en: string; th: string; zh: string };
  a: { en: string; th: string; zh: string };
}

const FAQS: FAQ[] = [
  {
    category: "Reality Check",
    q: {
      en: "Why is a city certified but ranked 'Gamma'?",
      th: "ทำไมเมืองได้ตราสัญลักษณ์แต่ถูกจัดอยู่กลุ่ม Gamma?",
      zh: "为什么城市获得了认证但却被评为 Gamma？",
    },
    a: {
      en: "Certification acknowledges a plan. Our index measures the reality. A city with a 100-page slide deck but zero operational sensors is 'Planned Gamma'. We don't reward intentions; we measure outcomes.",
      th: "การรับรอง (Certification) คือการรับรอง 'แผน' แต่ดัชนีของเราวัด 'ความจริง' เมืองที่มีสไลด์ร้อยหน้าแต่ไม่มีเซ็นเซอร์ที่ทำงานจริงคือ 'Planned Gamma' เราไม่ได้ให้คะแนนความตั้งใจ แต่เราให้คะแนนผลลัพธ์",
      zh: "认证是对计划的认可。而我们的指数衡量的是现实。一个拥有百页幻灯片但运营传感器为零的城市被归类为“规划中的 Gamma”。我们不奖励意图；我们衡量成果。",
    },
  },
  {
    category: "Methodology",
    q: {
      en: "Why is 'Livability' weighted higher than 'Digital'?",
      th: "ทำไม 'ความน่าอยู่' ถึงน้ำหนักเยอะกว่า 'ดิจิทัล'?",
      zh: "为什么“宜居性”的权重高于“数字”？",
    },
    a: {
      en: "Technology is a tool, not the objective. A smart city with 5G but broken sidewalks is a failure. We weight Livability at 25% because a city must function for its citizens before it can be 'Smart'.",
      th: "เทคโนโลยีคือเครื่องมือ ไม่ใช่เป้าหมาย เมืองที่มี 5G แต่ทางเท้าพังคือความล้มเหลว เราให้ความน่าอยู่ 25% เพราะเมืองต้องทำงานได้จริงเพื่อประชาชนก่อนที่จะเรียกตัวเองว่าอัจฉริยะ",
      zh: "技术是工具，而不是目标。一个拥有 5G 但人行道破损的智慧城市是失败的。我们将宜居性定为 25% 的权重，因为一个城市在自称“智慧”之前，必须先为市民提供基本功能。",
    },
  },
  {
    category: "Accountability",
    q: {
      en: "What happens if a city's data is outdated?",
      th: "จะเกิดอะไรขึ้นถ้าข้อมูลของเมืองล้าสมัย?",
      zh: "如果城市的数据过时了会怎样？",
    },
    a: {
      en: "Then the score drops. The SCITI index uses a 'Data Confidence' multiplier. If a city stops reporting open data to data.go.th or their CDP fails, their score is automatically penalized to reflect the transparency gap.",
      th: "คะแนนก็จะลดลง ดัชนี SCITI ใช้ตัวคูณ 'Data Confidence' หากเมืองหยุดส่งข้อมูลไปที่ data.go.th หรือ CDP ล่ม คะแนนจะโดนลบทันทีเพื่อสะท้อนความไม่โปร่งใส",
      zh: "那么得分就会下降。SCITI 指数使用“数据置信度”乘数。如果一个城市停止向 data.go.th 报告开放数据，或者其城市数据平台（CDP）出现故障，其得分将自动受到惩罚，以反映透明度方面的差距。",
    },
  },
  {
    category: "Politics",
    q: {
      en: "Is this index critical of the government?",
      th: "ดัชนีนี้โจมตีรัฐบาลหรือเปล่า?",
      zh: "这个指数是在批评政府吗？",
    },
    a: {
      en: "This index is honest, not hostile. depa created the framework and momentum; we provide the mirror. To improve, Thai cities need accurate reflection, not just applause. Feedback is the highest form of support.",
      th: "ดัชนีนี้มีความจริงใจ ไม่ได้เป็นศัตรู depa เป็นผู้สร้างกรอบการทำงานและแรงขับเคลื่อน เราเป็นผู้ส่องกระจก การจะพัฒนาได้ เมืองไทยต้องการการสะท้อนความจริง ไม่ใช่แค่เสียงปรบมือ คำติชมคือการสนับสนุนระดับสูงสุด",
      zh: "这个指数是诚实的，而非敌对的。depa 建立了框架并推动了进展；我们则提供了一面镜子。为了进步，泰国城市需要准确的反思，而不仅仅是掌声。反馈是最高形式的支持。",
    },
  },
  {
    category: "Success",
    q: {
      en: "Which city is the best model for Thailand?",
      th: "เมืองไหนที่เป็นต้นแบบที่ดีที่สุดสำหรับไทย?",
      zh: "哪个城市是泰国的最佳榜样？",
    },
    a: {
      en: "Nakhon Si Thammarat. It proves smart cities work without being rich. 10-hour flood warning, 92% citizen satisfaction, and 0 flood fatalities since 2021. It focuses on solving local pain points with appropriate tech.",
      th: "นครศรีธรรมราช เมืองนี้พิสูจน์ว่าเมืองอัจฉริยะทำงานได้โดยไม่จำเป็นต้องรวย มีการเตือนภัยน้ำท่วมล่วงหน้า 10 ชม. ความพึงพอใจประชาชน 92% และไม่มีผู้เสียชีวิตจากน้ำท่วมตั้งแต่ปี 2021 เน้นแก้จุดเจ็บท้องถิ่นด้วยเทคโนโลยีที่เหมาะสม",
      zh: "洛坤府。它证明了智慧城市即使不富有也能发挥作用。10 小时洪水预警、92% 的市民满意度，且自 2021 年以来洪水零死亡。它专注于利用合适的技术解决当地的痛点。",
    },
  }
];

const CATEGORIES = [...new Set(FAQS.map(f => f.category))];

export default function KnowledgePage({ locale }: Props) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroRef, heroVisible] = useInView(0.1);
  const [listRef, listVisible] = useInView(0.1);

  const filtered = useMemo(() => {
    return FAQS.filter(f => {
      const qText = f.q[locale].toLowerCase();
      const aText = f.a[locale].toLowerCase();
      const s = search.toLowerCase();
      const matchesSearch = !search || qText.includes(s) || aText.includes(s);
      const matchesCategory = activeCategory === "all" || f.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory, locale]);

  return (
    <div className="knowledge-page">
      <section ref={heroRef} className={`section rankings-hero reveal ${heroVisible ? "visible" : ""}`}>
        <p className="eyebrow">SCITI Knowledge Base</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.6rem, 4vw, 2.5rem)" }}>
          {locale === "th" ? "คลังความรู้เมืองอัจฉริยะ" : locale === "zh" ? "智慧城市知识库" : "Smart City Knowledge Base"}
        </h1>
        <p className="hero-strapline">
          {locale === "th"
            ? `คัดกรองคำถามที่พบบ่อยโดยยึดความจริงเชิงสถาบันและความโปร่งใสของข้อมูลเป็นหลัก`
            : locale === "zh"
              ? `基于机构真实性和数据透明度的常见问题解答`
            : "No-BS FAQ distilled from institutional reality and data transparency."}
        </p>
      </section>

      <section ref={listRef} className={`section reveal stagger-1 ${listVisible ? "visible" : ""}`} style={{ marginBottom: "3rem" }}>
        <input
          type="text"
          className="kb-search shadow-premium"
          placeholder={locale === "th" ? "ค้นหา..." : locale === "zh" ? "搜索..." : "Search..."}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className="kb-categories">
          <button 
            className={`filter-btn ${activeCategory === "all" ? "active" : ""}`} 
            onClick={() => setActiveCategory("all")}
          >
            All ({FAQS.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = FAQS.filter(f => f.category === cat).length;
            return (
              <button 
                key={cat} 
                className={`filter-btn ${activeCategory === cat ? "active" : ""}`} 
                onClick={() => setActiveCategory(cat)}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        <p className="kb-count">{filtered.length} {locale === "th" ? "ผลลัพธ์" : locale === "zh" ? "项结果" : "results"}</p>

        <div className="kb-list">
          {filtered.map((faq, i) => (
            <details key={i} className="kb-item glass-card shadow-premium">
              <summary className="kb-question">
                <span className="kb-cat-badge">{faq.category}</span>
                {faq.q[locale]}
              </summary>
              <p className="kb-answer">{faq.a[locale]}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
