import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import type { Locale } from "./types";

interface Props {
  locale: Locale;
}

interface CountryVibe {
  id: string;
  flag: string;
  name: { en: string; th: string; zh: string };
  vibe: { en: string; th: string; zh: string };
  vibeLabel: { en: string; th: string; zh: string };
  projects: { en: string; th: string; zh: string }[];
  stats: { label: { en: string; th: string; zh: string }; value: string }[];
  community: { en: string; th: string; zh: string };
  color: string;
  x: number;
  y: number;
  labelPos: "top" | "bottom" | "left" | "right";
}

// ── Node positions redesigned for 1000×480 viewBox ──
// Thailand at centre-lower. Five partners spread clockwise from top-left,
// ensuring no two nodes are within 180px of each other.
const COUNTRIES: CountryVibe[] = [
  {
    id: "japan",
    flag: "🇯🇵",
    name: { en: "Japan", th: "ญี่ปุ่น", zh: "日本" },
    vibe: { en: "Systems-thinking at scale. Cameras before asphalt.", th: "คิดเป็นระบบในมาตราที่ใหญ่ กล้องก่อนยางมะตอย", zh: "大规模系统思维。摄像头优于沥青。" },
    vibeLabel: { en: "The System Builder", th: "ผู้สร้างระบบ", zh: "系统建设者" },
    projects: [
      { en: "Smart JAMP — 250B yen ASEAN fund", th: "Smart JAMP — กองทุนอาเซียน 2.5 แสนล้านเยน", zh: "Smart JAMP — 2,500亿日元东盟基金" },
      { en: "Bangsue autonomous-route mapping", th: "การ mapping เส้นทางอัตโนมัติที่บางซื่อ", zh: "Bang Sue 自动驾驶路线测绘" },
      { en: "Phuket AI traffic — 1/10th cost of road expansion", th: "AI จราจรภูเก็ต — ประหยัดกว่าสร้างถนน 10 เท่า", zh: "普吉AI交通——成本为道路扩建的1/10" },
      { en: "JASCA standing coordination channel", th: "ช่องทางประสานงานต่อเนื่องผ่าน JASCA", zh: "JASCA 持续协调通道" },
    ],
    stats: [
      { label: { en: "Investment", th: "การลงทุน", zh: "投资" }, value: "$2.4B" },
      { label: { en: "Thai cities", th: "เมืองไทย", zh: "泰国城市" }, value: "5" },
      { label: { en: "Status", th: "สถานะ", zh: "状态" }, value: "Active" },
    ],
    community: {
      en: "JICA + MLIT + JASCA + Fujitsu — vertically integrated from policy to procurement. What Thailand learns: how to write specs that survive political cycles.",
      th: "JICA + MLIT + JASCA + Fujitsu — แนวตั้งจากนโยบายสู่จัดซื้อ สิ่งที่ไทยได้เรียนรู้: วิธีเขียนสเปกที่รอดรัฐบาลเปลี่ยน",
      zh: "JICA + MLIT + JASCA + 富士通——政策到采购垂直整合。泰国学到的：如何编写能经受政治周期变化的规格。",
    },
    color: "#C03030",
    x: 860,
    y: 95,
    labelPos: "right",
  },
  {
    id: "usa",
    flag: "🇺🇸",
    name: { en: "United States", th: "สหรัฐอเมริกา", zh: "美国" },
    vibe: { en: "Technically specific, politically narrow. Energy + cyber.", th: "เฉพาะทางเทคนิคสูง แคบทางการเมือง พลังงาน + ไซเบอร์", zh: "技术专精，政治范围窄。能源+网络安全。" },
    vibeLabel: { en: "The Precision Partner", th: "พันธมิตรเฉพาะทาง", zh: "精准合作伙伴" },
    projects: [
      { en: "USTDA grant — Phuket data platform", th: "ทุน USTDA — แพลตฟอร์มข้อมูลภูเก็ต", zh: "USTDA 资助——普吉数据平台" },
      { en: "Bangkok renewable-grid planning", th: "วางแผนโครงข่ายพลังงานหมุนเวียนกรุงเทพฯ", zh: "曼谷可再生能源电网规划" },
      { en: "Phuket-Milwaukee WiSE city exchange", th: "แลกเปลี่ยน Phuket-Milwaukee WiSE", zh: "普吉-密尔沃基 WiSE 城市交流" },
      { en: "YSEALI Smart Cities Workshop + Primer", th: "YSEALI Smart Cities Workshop + Primer", zh: "YSEALI 智慧城市工作坊 + 入门指南" },
    ],
    stats: [
      { label: { en: "Investment", th: "การลงทุน", zh: "投资" }, value: "$10M" },
      { label: { en: "Thai cities", th: "เมืองไทย", zh: "泰国城市" }, value: "2" },
      { label: { en: "Status", th: "สถานะ", zh: "状态" }, value: "Active" },
    ],
    community: {
      en: "USASCP + USTDA + Smart Cities Council — consular diplomacy meets hard tech. What Thailand learns: how to scope a pilot so it survives a change of administration.",
      th: "USASCP + USTDA + Smart Cities Council — การทูตผสมเทคโนโลยีหนัก สิ่งที่ไทยได้เรียนรู้: วิธีออกแบบนำร่องให้รอดรัฐบาลเปลี่ยน",
      zh: "USASCP + USTDA + 智慧城市委员会——领事外交遇上硬科技。泰国学到的：如何设计能经受政府换届的试点。",
    },
    color: "#2E5AAC",
    x: 85,
    y: 210,
    labelPos: "left",
  },
  {
    id: "uk",
    flag: "🇬🇧",
    name: { en: "United Kingdom", th: "สหราชอาณาจักร", zh: "英国" },
    vibe: { en: "Programmes that finish what they start.", th: "โปรแกรมที่ทำจนจบ", zh: "说到做到的项目。" },
    vibeLabel: { en: "The Deliverer", th: "ผู้ส่งมอบ", zh: "交付者" },
    projects: [
      { en: "UK-Thailand Smart City Handbook (trilingual)", th: "คู่มือเมืองอัจฉริยะ UK-ไทย (3 ภาษา)", zh: "英泰智慧城市手册（三语版）" },
      { en: "Prosperity Fund flood management — Bangkok", th: "Prosperity Fund จัดการน้ำท่วม — กรุงเทพฯ", zh: "繁荣基金洪水管理——曼谷" },
      { en: "Data planning workshops — 4 cities", th: "Workshop วางแผนข้อมูล — 4 เมือง", zh: "数据规划研讨会——4座城市" },
      { en: "EV infrastructure scoping study", th: "งานศึกษาโครงสร้างพื้นฐาน EV", zh: "电动车基础设施范围研究" },
    ],
    stats: [
      { label: { en: "Investment", th: "การลงทุน", zh: "投资" }, value: "Prosperity" },
      { label: { en: "Thai cities", th: "เมืองไทย", zh: "泰国城市" }, value: "4" },
      { label: { en: "Status", th: "สถานะ", zh: "状态" }, value: "Done" },
    ],
    community: {
      en: "FCDO + British Council + urban planning firms — programme architecture that closes. What Thailand learns: a shared vocabulary is as critical as fibre optic cables for interoperability.",
      th: "FCDO + British Council + บริษัทวางแผนเมือง — สถาปัตยกรรมโปรแกรมที่ปิดได้ สิ่งที่ไทยได้เรียนรู้: ศัพท์ร่วมสำคัญเท่ากับสายไฟเบอร์สำหรับ interoperability",
      zh: "FCDO + 英国文化协会 + 城市规划公司——有始有终的项目架构。泰国学到的：统一话语体系与光缆对互操作性同样重要。",
    },
    color: "#1A6B4A",
    x: 185,
    y: 88,
    labelPos: "top",
  },
  {
    id: "austria",
    flag: "🇦🇹",
    name: { en: "Austria", th: "ออสเตรีย", zh: "奥地利" },
    vibe: { en: "Livable-city expertise. Vienna as the quiet reference.", th: "ความเชี่ยวชาญเมืองน่าอยู่ เวียนนาเป็น reference เงียบๆ", zh: "宜居城市专长。维也纳是低调的标杆。" },
    vibeLabel: { en: "The Quality Benchmark", th: "มาตรฐานคุณภาพ", zh: "质量基准" },
    projects: [
      { en: "Advantage Austria MOU (2022)", th: "MOU Advantage Austria (2022)", zh: "Advantage Austria 备忘录（2022）" },
      { en: "Vienna smart waste + renewable systems", th: "ขยะอัจฉริยะเวียนนา + พลังงานหมุนเวียน", zh: "维也纳智慧废物+可再生能源系统" },
      { en: "Aspern Mobility Lab — autonomous transit R&D", th: "Aspern Mobility Lab — R&D ขนส่งอัตโนมัติ", zh: "Aspern 移动实验室——自动驾驶交通研发" },
      { en: "Urban Innovation Vienna pilot exchange", th: "แลกเปลี่ยน Urban Innovation Vienna", zh: "维也纳城市创新试点交流" },
    ],
    stats: [
      { label: { en: "Investment", th: "การลงทุน", zh: "投资" }, value: "MOU" },
      { label: { en: "Thai cities", th: "เมืองไทย", zh: "泰国城市" }, value: "National" },
      { label: { en: "Status", th: "สถานะ", zh: "状态" }, value: "Early" },
    ],
    community: {
      en: "Advantage Austria + UIV + Aspern — a small but high-trust network. What Thailand learns: livability is measurable, and MOUs are start lines, not finish lines.",
      th: "Advantage Austria + UIV + Aspern — เครือข่ายเล็กแต่ความไว้วางใจสูง สิ่งที่ไทยได้เรียนรู้: เมืองน่าอยู่วัดได้ MOU คือเส้นสตาร์ทไม่ใช่เส้นชัย",
      zh: "Advantage Austria + UIV + Aspern——小而高信任度的网络。泰国学到的：宜居性可衡量，备忘录是起跑线而非终点线。",
    },
    color: "#C45C1A",
    x: 500,
    y: 58,
    labelPos: "top",
  },
  {
    id: "korea",
    flag: "🇰🇷",
    name: { en: "South Korea", th: "เกาหลีใต้", zh: "韩国" },
    vibe: { en: "Blueprint excellence. Planning that outruns execution.", th: "ความเยี่ยมยอดของ blueprint วางแผนเร็วกว่าลงมือ", zh: "蓝图卓越。规划超前于执行。" },
    vibeLabel: { en: "The Blueprint Maker", th: "ผู้สร้างพิมพ์เขียว", zh: "蓝图制定者" },
    projects: [
      { en: "K-City Global — Khon Kaen LRT planning", th: "K-City Global — วางแผน LRT ขอนแก่น", zh: "K-City Global——孔敬轻轨规划" },
      { en: "KOTRA 5G/IoT investment matching", th: "KOTRA จับคู่การลงทุน 5G/IoT", zh: "KOTRA 5G/IoT 投资对接" },
      { en: "Yonsei Smart City Lab — AI traffic research", th: "Yonsei Smart City Lab — วิจัย AI จราจร", zh: "延世智慧城市实验室——AI交通研究" },
      { en: "Best Partnership — World Smart City Expo 2022", th: "Best Partnership — World Smart City Expo 2022", zh: "2022世界智慧城市博览会最佳合作奖" },
    ],
    stats: [
      { label: { en: "Investment", th: "การลงทุน", zh: "投资" }, value: "Technical" },
      { label: { en: "Thai cities", th: "เมืองไทย", zh: "泰国城市" }, value: "1" },
      { label: { en: "Status", th: "สถานะ", zh: "状态" }, value: "Stalled" },
    ],
    community: {
      en: "KDI + KOTRA + Yonsei + SCA Korea — a planning culture producing world-class blueprints. What Thailand learns: good design without local ownership is just expensive paper.",
      th: "KDI + KOTRA + Yonsei + SCA Korea — วัฒนธรรมวางแผนที่สร้าง blueprint ระดับโลก สิ่งที่ไทยได้เรียนรู้: ออกแบบดีโดยไม่มีเจ้าของท้องถิ่น ก็แค่กระดาษแพง",
      zh: "KDI + KOTRA + 延世 + 韩国智慧城市协会——产出世界级蓝图的规划文化。泰国学到的：没有本地所有权的好设计只是昂贵的纸张。",
    },
    color: "#1A6B9A",
    x: 880,
    y: 340,
    labelPos: "right",
  },
];

const THAILAND = { x: 500, y: 295, flag: "🇹🇭", name: { en: "Thailand", th: "ไทย", zh: "泰国" } };

function t(locale: Locale, dict: { en: string; th: string; zh: string }): string {
  return locale === "th" ? dict.th : locale === "zh" ? dict.zh : dict.en;
}

export default function PartnerVibeMap({ locale }: Props) {
  const [hovered, setHovered] = useState<CountryVibe | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mPos, setMPos] = useState({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState(1000);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onMove = useCallback((e: React.MouseEvent) => {
    const r = containerRef.current?.getBoundingClientRect();
    if (r) setMPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  }, []);

  const thailandPulse = useMemo(() => (
    <g>
      <circle cx={THAILAND.x} cy={THAILAND.y} r="60" fill="rgba(196,154,42,.04)">
        <animate attributeName="r" values="40;70;40" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.08;0.02;0.08" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx={THAILAND.x} cy={THAILAND.y} r="35" fill="rgba(196,154,42,.06)">
        <animate attributeName="r" values="25;45;25" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.12;0.04;0.12" dur="3s" repeatCount="indefinite" />
      </circle>
    </g>
  ), []);

  return (
    <div className="vibe-map-wrap" ref={containerRef} onMouseMove={onMove}>
      <div className="vibe-map-header">
        <p className="eyebrow">{t(locale, { en: "Network Vibes", th: "บรรยากาศเครือข่าย", zh: "网络氛围" })}</p>
        <h2>{t(locale, {
          en: "What each country actually brings",
          th: "แต่ละประเทศนำอะไรมาจริงๆ",
          zh: "每个国家真正带来了什么",
        })}</h2>
        <p className="vibe-map-sub">
          {t(locale, {
            en: "Hover over a country to see their projects, their community, and their vibe. This is capacity-building, not charity.",
            th: "วางเมาส์บนประเทศเพื่อดูโครงการ ชุมชน และบรรยากาศของเขา นี่คือการสร้างศักยภาพ ไม่ใช่การกุศล",
            zh: "悬停在国家上查看他们的项目、社区和氛围。这是能力建设，不是慈善。",
          })}
        </p>
      </div>

      <svg viewBox="0 0 1000 420" className="vibe-map-svg" preserveAspectRatio="xMidYMid meet" role="img"
        aria-labelledby="vibe-title vibe-desc">
        <title id="vibe-title">{t(locale, { en: "Partner Country Vibe Map", th: "แผนที่บรรยากาศประเทศพันธมิตร", zh: "合作伙伴国家氛围地图" })}</title>
        <desc id="vibe-desc">{t(locale, { en: "Thailand connected to Japan, USA, Austria, and South Korea with project details on hover", th: "ไทยเชื่อมต่อกับญี่ปุ่น สหรัฐฯ ออสเตรีย และเกาหลีใต้ พร้อมรายละเอียดโครงการเมื่อวางเมาส์", zh: "泰国与日本、美国、奥地利和韩国连接，悬停显示项目详情" })}</desc>

        {/* Subtle grid background */}
        <defs>
          <pattern id="vibeGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--5)" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="1000" height="420" fill="url(#vibeGrid)" />

        {/* Connection arcs from Thailand to each country */}
        {COUNTRIES.map(c => {
          const active = hovered?.id === c.id;
          const dx = c.x - THAILAND.x;
          const dy = c.y - THAILAND.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const cx = (THAILAND.x + c.x) / 2;
          const cy = Math.min(THAILAND.y, c.y) - dist * 0.15;
          return (
            <g key={`arc-${c.id}`}>
              {/* Glow arc */}
              <path
                d={`M${THAILAND.x},${THAILAND.y} Q${cx},${cy} ${c.x},${c.y}`}
                fill="none"
                stroke={c.color}
                strokeWidth={active ? 3 : 1}
                opacity={active ? 0.35 : 0.1}
                style={{ transition: "all .3s" }}
                vectorEffect="non-scaling-stroke"
              />
              {/* Core arc */}
              <path
                d={`M${THAILAND.x},${THAILAND.y} Q${cx},${cy} ${c.x},${c.y}`}
                fill="none"
                stroke={c.color}
                strokeWidth={active ? 2 : 0.5}
                opacity={active ? 0.85 : 0.25}
                strokeDasharray={active ? "none" : "4 4"}
                style={{ transition: "all .3s" }}
                vectorEffect="non-scaling-stroke"
              >
                {active && (
                  <animate attributeName="stroke-dasharray" values="0 1000; 1000 0" dur="1.5s" fill="freeze" />
                )}
              </path>
            </g>
          );
        })}

        {/* Thailand hub */}
        {thailandPulse}
        <circle cx={THAILAND.x} cy={THAILAND.y} r="10" fill="#C49A2A" />
        <text x={THAILAND.x} y={THAILAND.y + 22} textAnchor="middle" fontSize="9" fontWeight="700"
          fontFamily="var(--mono)" fill="var(--ink)">THAILAND</text>

        {/* Country nodes */}
        {COUNTRIES.map(c => {
          const active = hovered?.id === c.id;
          return (
            <g
              key={c.id}
              role="button"
              tabIndex={0}
              aria-label={`${c.flag} ${t(locale, c.name)} — ${t(locale, c.vibeLabel)}`}
              onMouseEnter={() => setHovered(c)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(c)}
              onBlur={() => setHovered(null)}
              onClick={() => setHovered(c)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setHovered(c); } }}
              style={{ cursor: "pointer" }}
            >
              {/* Hit area */}
              <circle cx={c.x} cy={c.y} r="28" fill="transparent" />
              {/* Glow */}
              {active && <circle cx={c.x} cy={c.y} r="18" fill={c.color} opacity="0.12" />}
              {/* Ring */}
              <circle
                cx={c.x}
                cy={c.y}
                r={active ? 10 : 7}
                fill={c.color}
                stroke="var(--bg)"
                strokeWidth="2"
                style={{ transition: "all .25s" }}
              />
              {/* Flag */}
              <text x={c.x} y={c.y + 4} textAnchor="middle" fontSize={active ? 14 : 11} style={{ transition: "all .25s" }}>
                {c.flag}
              </text>
              {/* Label */}
              <text
                x={c.x + (c.labelPos === "right" ? 18 : c.labelPos === "left" ? -18 : 0)}
                y={c.y + (c.labelPos === "bottom" ? 20 : c.labelPos === "top" ? -12 : 4)}
                textAnchor={c.labelPos === "right" ? "start" : c.labelPos === "left" ? "end" : "middle"}
                fontSize="8"
                fontWeight="700"
                fontFamily="var(--mono)"
                fill={active ? c.color : "var(--3)"}
                style={{ transition: "all .25s" }}
              >
                {t(locale, c.name).toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hover card — floats near cursor on desktop, fixed bottom panel on mobile */}
      {hovered && (() => {
        const isMobile = containerWidth < 640;
        const cardW = 320;
        const rawLeft = mPos.x + 24;
        const clampedLeft = Math.min(rawLeft, containerWidth - cardW - 8);
        const above = mPos.y > 220;
        return (
          <div
            className={`vibe-map-card ${isMobile ? "vibe-map-card-mobile" : ""}`}
            style={isMobile ? undefined : {
              left: clampedLeft,
              top: above ? mPos.y - 16 : mPos.y + 16,
              transform: above ? "translateY(-100%)" : "none",
            }}
            role="dialog"
            aria-live="polite"
          >
            <div className="vibe-card-head" style={{ borderLeftColor: hovered.color }}>
              <span className="vibe-card-flag">{hovered.flag}</span>
              <div>
                <span className="vibe-card-name">{t(locale, hovered.name)}</span>
                <span className="vibe-card-vibe-label" style={{ color: hovered.color }}>{t(locale, hovered.vibeLabel)}</span>
              </div>
              {isMobile && (
                <button type="button" className="vibe-card-close" onClick={() => setHovered(null)} aria-label="Close">×</button>
              )}
            </div>
            <p className="vibe-card-vibe">{t(locale, hovered.vibe)}</p>

            <div className="vibe-card-stats">
              {hovered.stats.map((s, i) => (
                <div key={i} className="vibe-card-stat">
                  <span className="vibe-card-stat-value">{s.value}</span>
                  <span className="vibe-card-stat-label">{t(locale, s.label)}</span>
                </div>
              ))}
            </div>

            <div className="vibe-card-section">
              <span className="vibe-card-section-title">{t(locale, { en: "Active projects", th: "โครงการที่ดำเนินอยู่", zh: "进行中的项目" })}</span>
              <ul className="vibe-card-list">
                {hovered.projects.map((p, i) => (
                  <li key={i}>{t(locale, p)}</li>
                ))}
              </ul>
            </div>

            <div className="vibe-card-section">
              <span className="vibe-card-section-title">{t(locale, { en: "Samastiti Insight", th: "ข้อคิดจากชุมชน Samastiti", zh: "Samastiti 洞察" })}</span>
              <p className="vibe-card-community">{t(locale, hovered.community)}</p>
            </div>
          </div>
        );
      })()}

      {/* Legend */}
      <div className="vibe-map-legend">
        {COUNTRIES.map(c => (
          <button
            key={c.id}
            type="button"
            className={`vibe-legend-item ${hovered?.id === c.id ? "active" : ""}`}
            onMouseEnter={() => setHovered(c)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(c)}
            onBlur={() => setHovered(null)}
            onClick={() => setHovered(c)}
          >
            <span className="vibe-legend-dot" style={{ background: c.color }} />
            <span className="vibe-legend-flag">{c.flag}</span>
            <span className="vibe-legend-name">{t(locale, c.name)}</span>
            <span className="vibe-legend-vibe">{t(locale, c.vibeLabel)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
