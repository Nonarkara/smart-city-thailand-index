import { useState, useCallback } from "react";
import { translate } from "./cityPresentation";
import { assetUrl } from "./mediaAssets";
import type { Locale, SmartDimension } from "./types";
import { PILLAR_COLORS } from "./types";

// ─── Smart City Thailand official dimension logos (public/icon 7 Smarts PNG/)
// Order from depa 7 Smart City Indicators TOC:
// 01 Environment · 02 Governance · 03 Mobility · 04 Energy · 05 Economy · 06 Living · 07 People
const DIM_LOGOS: Record<SmartDimension, string> = {
  environment: assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-01.png"),
  governance:  assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-02.png"),
  mobility:    assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-03.png"),
  energy:      assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-04.png"),
  economy:     assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-05.png"),
  living:      assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-06.png"),
  people:      assetUrl("/icon 7 Smarts PNG/icon 7 Smarts Logo-07.png"),
};

interface Props { locale: Locale; }

type BingoTerm = {
  id: string;
  emoji: string;
  label: { en: string; th: string; zh: string };
  dim: SmartDimension;
  isLogo?: boolean;
};

// ─── POOL — 7 logo anchors + ~56 regular terms with emojis ──────────────────
// Source: depa 7 Smart City Indicators + Hitachi Review Vol.70 + ASEAN Primer 2022

const POOL: BingoTerm[] = [
  // LOGO ANCHORS — each dimension's "name card" (always big, auto-marks on call)
  { id:"logo1", dim:"environment", isLogo:true, emoji:"🌿", label:{ en:"Smart Environment", th:"Smart\nEnvironment", zh:"Smart\nEnvironment" } },
  { id:"logo2", dim:"economy",     isLogo:true, emoji:"📈", label:{ en:"Smart Economy",     th:"Smart\nEconomy",     zh:"Smart\nEconomy"     } },
  { id:"logo3", dim:"mobility",    isLogo:true, emoji:"🚌", label:{ en:"Smart Mobility",    th:"Smart\nMobility",    zh:"Smart\nMobility"    } },
  { id:"logo4", dim:"energy",      isLogo:true, emoji:"⚡", label:{ en:"Smart Energy",      th:"Smart\nEnergy",      zh:"Smart\nEnergy"      } },
  { id:"logo5", dim:"people",      isLogo:true, emoji:"👥", label:{ en:"Smart People",      th:"Smart\nPeople",      zh:"Smart\nPeople"      } },
  { id:"logo6", dim:"living",      isLogo:true, emoji:"🏠", label:{ en:"Smart Living",      th:"Smart\nLiving",      zh:"Smart\nLiving"      } },
  { id:"logo7", dim:"governance",  isLogo:true, emoji:"🏛️", label:{ en:"Smart Governance",  th:"Smart\nGovernance",  zh:"Smart\nGovernance"  } },

  // ENVIRONMENT ────────────────────────────────────────────────────────────────
  { id:"env1",  dim:"environment", emoji:"🌬️", label:{ en:"Air Quality Monitor",  th:"มอนิเตอร์อากาศ",   zh:"空气质量监测" } },
  { id:"env2",  dim:"environment", emoji:"🌊", label:{ en:"Flood Sensor",         th:"เซนเซอร์น้ำท่วม",  zh:"洪涝传感" } },
  { id:"env3",  dim:"environment", emoji:"💧", label:{ en:"Water Management",     th:"จัดการน้ำ",         zh:"水资源管理" } },
  { id:"env4",  dim:"environment", emoji:"🌡️", label:{ en:"Climate Watch",        th:"เฝ้าระวังภูมิอากาศ",zh:"气候监测" } },
  { id:"env5",  dim:"environment", emoji:"♻️", label:{ en:"Waste IoT",            th:"ติดตามขยะ IoT",    zh:"废物物联" } },
  { id:"env6",  dim:"environment", emoji:"🚨", label:{ en:"Disaster Alert",       th:"แจ้งเตือนภัย",     zh:"灾害预警" } },
  { id:"env7",  dim:"environment", emoji:"🌳", label:{ en:"Green Space ≥10m²",   th:"พื้นที่เขียว ≥10m²",zh:"绿地≥10m²" } },
  { id:"env8",  dim:"environment", emoji:"😷", label:{ en:"PM2.5 Real-Time",      th:"PM2.5 เรียลไทม์",  zh:"PM2.5实时" } },

  // ECONOMY ────────────────────────────────────────────────────────────────────
  { id:"eco1",  dim:"economy", emoji:"✈️", label:{ en:"Digital Tourism",   th:"ท่องเที่ยวดิจิทัล",    zh:"数字旅游" } },
  { id:"eco2",  dim:"economy", emoji:"🏪", label:{ en:"SME Platform",      th:"แพลตฟอร์ม SME",        zh:"中小企业平台" } },
  { id:"eco3",  dim:"economy", emoji:"🚀", label:{ en:"Startup Hub",       th:"ฮับสตาร์ทอัพ",         zh:"创业中心" } },
  { id:"eco4",  dim:"economy", emoji:"🌾", label:{ en:"Smart Agriculture", th:"เกษตรอัจฉริยะ",        zh:"智慧农业" } },
  { id:"eco5",  dim:"economy", emoji:"🚁", label:{ en:"Agri Drone",        th:"โดรนการเกษตร",         zh:"农业无人机" } },
  { id:"eco6",  dim:"economy", emoji:"🏙️", label:{ en:"Innovation Zone",   th:"เขตนวัตกรรม",          zh:"创新区" } },
  { id:"eco7",  dim:"economy", emoji:"💰", label:{ en:"FDI Gateway",       th:"ดึงดูด FDI",           zh:"外资门户" } },
  { id:"eco8",  dim:"economy", emoji:"💳", label:{ en:"Cashless Society",  th:"ไร้เงินสด",             zh:"无现金社会" } },

  // MOBILITY ───────────────────────────────────────────────────────────────────
  { id:"mob1",  dim:"mobility", emoji:"🚍", label:{ en:"BRT Corridor",      th:"รถ BRT",              zh:"快速公交" } },
  { id:"mob2",  dim:"mobility", emoji:"⚡", label:{ en:"EV Charging",       th:"จุดชาร์จ EV",          zh:"电动车充电" } },
  { id:"mob3",  dim:"mobility", emoji:"🚦", label:{ en:"AI Traffic Light",  th:"ไฟจราจร AI",           zh:"AI交通灯" } },
  { id:"mob4",  dim:"mobility", emoji:"🅿️", label:{ en:"Smart Parking",    th:"จอดรถอัจฉริยะ",       zh:"智能停车" } },
  { id:"mob5",  dim:"mobility", emoji:"🗺️", label:{ en:"MaaS Platform",    th:"แพลตฟอร์ม MaaS",       zh:"出行即服务" } },
  { id:"mob6",  dim:"mobility", emoji:"🚲", label:{ en:"Bike Share",        th:"จักรยานสาธารณะ",       zh:"共享单车" } },
  { id:"mob7",  dim:"mobility", emoji:"🚋", label:{ en:"LRT Transit",       th:"รถไฟฟ้า LRT",          zh:"轻轨" } },
  { id:"mob8",  dim:"mobility", emoji:"🚶", label:{ en:"Pedestrian Path",   th:"ทางเดินคนเดิน",        zh:"步行道" } },

  // ENERGY ─────────────────────────────────────────────────────────────────────
  { id:"enr1",  dim:"energy", emoji:"☀️", label:{ en:"Solar ≥50%",         th:"พลังงานแสงอาทิตย์",   zh:"太阳能≥50%" } },
  { id:"enr2",  dim:"energy", emoji:"🔌", label:{ en:"Smart Grid",          th:"กริดอัจฉริยะ",         zh:"智能电网" } },
  { id:"enr3",  dim:"energy", emoji:"💨", label:{ en:"Wind Energy",         th:"พลังงานลม",            zh:"风力发电" } },
  { id:"enr4",  dim:"energy", emoji:"🎯", label:{ en:"Net Zero Target",     th:"เป้า Net Zero",        zh:"净零目标" } },
  { id:"enr5",  dim:"energy", emoji:"🔋", label:{ en:"Energy Storage 30%", th:"เก็บพลังงาน ≥30%",    zh:"储能≥30%" } },
  { id:"enr6",  dim:"energy", emoji:"📊", label:{ en:"Smart Meter 100%",   th:"มิเตอร์อัจฉริยะ 100%",zh:"智能电表100%" } },
  { id:"enr7",  dim:"energy", emoji:"🏘️", label:{ en:"Smart Home/Building",th:"Smart Home",            zh:"智慧楼宇" } },
  { id:"enr8",  dim:"energy", emoji:"🏝️", label:{ en:"Micro-grid 24hr",    th:"ไมโครกริด 24 ชม.",    zh:"微电网24小时" } },

  // PEOPLE ─────────────────────────────────────────────────────────────────────
  { id:"ppl1",  dim:"people", emoji:"📱", label:{ en:"Digital Literacy",   th:"การรู้ดิจิทัล",         zh:"数字素养" } },
  { id:"ppl2",  dim:"people", emoji:"📚", label:{ en:"Lifelong Learning",  th:"เรียนรู้ตลอดชีวิต",     zh:"终身学习" } },
  { id:"ppl3",  dim:"people", emoji:"🔬", label:{ en:"STEM Lab",           th:"ห้อง STEM",              zh:"STEM实验室" } },
  { id:"ppl4",  dim:"people", emoji:"🌟", label:{ en:"Youth Leader",       th:"ผู้นำเยาวชน",            zh:"青年领袖" } },
  { id:"ppl5",  dim:"people", emoji:"👩‍💻", label:{ en:"Coding Bootcamp",   th:"เรียนโค้ดดิ้ง",          zh:"编程训练营" } },
  { id:"ppl6",  dim:"people", emoji:"💡", label:{ en:"Social Innovation",  th:"นวัตกรรมสังคม",          zh:"社会创新" } },
  { id:"ppl7",  dim:"people", emoji:"🎨", label:{ en:"Design Thinking",    th:"Design Thinking",        zh:"设计思维" } },
  { id:"ppl8",  dim:"people", emoji:"🌏", label:{ en:"YSEALI Workshop",    th:"YSEALI Workshop",        zh:"YSEALI工作坊" } },

  // LIVING ─────────────────────────────────────────────────────────────────────
  { id:"liv1",  dim:"living", emoji:"⭐", label:{ en:"5-Star Service",     th:"บริการ 5 ดาว",           zh:"五星服务" } },
  { id:"liv2",  dim:"living", emoji:"🏥", label:{ en:"Smart Hospital",     th:"โรงพยาบาลอัจฉริยะ",     zh:"智慧医院" } },
  { id:"liv3",  dim:"living", emoji:"📷", label:{ en:"CCTV Safety",        th:"CCTV ความปลอดภัย",       zh:"CCTV安全" } },
  { id:"liv4",  dim:"living", emoji:"👴", label:{ en:"Elderly Day Care",   th:"ศูนย์ดูแลผู้สูงอายุ",   zh:"老人日托" } },
  { id:"liv5",  dim:"living", emoji:"🏫", label:{ en:"Smart School",       th:"โรงเรียนอัจฉริยะ",       zh:"智慧学校" } },
  { id:"liv6",  dim:"living", emoji:"🚑", label:{ en:"Smart Ambulance",    th:"รถพยาบาลอัจฉริยะ",       zh:"智能救护" } },
  { id:"liv7",  dim:"living", emoji:"💊", label:{ en:"QR Healthcare",      th:"บัตรสุขภาพ QR",          zh:"QR医疗" } },
  { id:"liv8",  dim:"living", emoji:"🌱", label:{ en:"Urban Farm",         th:"ฟาร์มในเมือง",            zh:"城市农场" } },

  // GOVERNANCE ─────────────────────────────────────────────────────────────────
  { id:"gov1",  dim:"governance", emoji:"🗄️", label:{ en:"City Data Platform",  th:"แพลตฟอร์มข้อมูลเมือง", zh:"城市数据平台" } },
  { id:"gov2",  dim:"governance", emoji:"🔓", label:{ en:"Open Government Data", th:"ข้อมูลรัฐเปิด",        zh:"开放政府数据" } },
  { id:"gov3",  dim:"governance", emoji:"📲", label:{ en:"Citizen App",          th:"แอปประชาชน",           zh:"市民应用" } },
  { id:"gov4",  dim:"governance", emoji:"🖥️", label:{ en:"e-Government",        th:"รัฐบาลอิเล็กทรอนิกส์", zh:"电子政务" } },
  { id:"gov5",  dim:"governance", emoji:"📊", label:{ en:"City Dashboard",       th:"แดชบอร์ดเมือง",        zh:"城市仪表板" } },
  { id:"gov6",  dim:"governance", emoji:"🔗", label:{ en:"Public API",           th:"API สาธารณะ",          zh:"公共API" } },
  { id:"gov7",  dim:"governance", emoji:"🗳️", label:{ en:"Participatory Budget", th:"งบฯ มีส่วนร่วม",       zh:"参与式预算" } },
  { id:"gov8",  dim:"governance", emoji:"🔍", label:{ en:"Transparency Audit",   th:"ตรวจสอบโปร่งใส",      zh:"透明度审计" } },
];

const DIM_COLORS: Record<SmartDimension, string> = {
  environment: PILLAR_COLORS.environment,
  economy:     PILLAR_COLORS.economy,
  mobility:    PILLAR_COLORS.livability,
  energy:      PILLAR_COLORS.digital,
  people:      PILLAR_COLORS.hospitality,
  living:      PILLAR_COLORS.wellbeing,
  governance:  PILLAR_COLORS.safety,
};

const DIM_LABELS: Record<SmartDimension, { en: string; th: string; zh: string }> = {
  environment: { en: "Environment", th: "สิ่งแวดล้อม", zh: "环境" },
  economy:     { en: "Economy",     th: "เศรษฐกิจ",   zh: "经济" },
  mobility:    { en: "Mobility",    th: "การเดินทาง", zh: "出行" },
  energy:      { en: "Energy",      th: "พลังงาน",    zh: "能源" },
  people:      { en: "People",      th: "พลเมือง",    zh: "市民" },
  living:      { en: "Living",      th: "การดำรงชีวิต", zh: "生活" },
  governance:  { en: "Governance",  th: "การบริหาร",  zh: "治理" },
};

const DIM_EMOJIS: Record<SmartDimension, string> = {
  environment: "🌿", economy: "📈", mobility: "🚌",
  energy: "⚡", people: "👥", living: "🏠", governance: "🏛️",
};

const DIMS: SmartDimension[] = ["environment","economy","mobility","energy","people","living","governance"];

// ─── Board generation ───────────────────────────────────────────────────────

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeBoard(seed: number): BingoTerm[] {
  // Pick 24 from pool, arrange 5×5 with FREE in center (index 12)
  const shuffled = seededShuffle(POOL, seed).slice(0, 24);
  const FREE: BingoTerm = {
    id: "FREE", dim: "governance", emoji: "🆓",
    label: { en: "FREE", th: "ฟรี", zh: "FREE" },
  };
  return [...shuffled.slice(0, 12), FREE, ...shuffled.slice(12)];
}

function checkBingo(marked: Set<string>, board: BingoTerm[]): boolean {
  // A winning line requires all 5 cells to be marked AND share the same dimension
  // (FREE cell at index 12 is neutral — it matches any dimension in a line)
  const lines = [
    // rows
    [0,1,2,3,4],[5,6,7,8,9],[10,11,12,13,14],[15,16,17,18,19],[20,21,22,23,24],
    // cols
    [0,5,10,15,20],[1,6,11,16,21],[2,7,12,17,22],[3,8,13,18,23],[4,9,14,19,24],
    // diagonals
    [0,6,12,18,24],[4,8,12,16,20],
  ];
  for (const line of lines) {
    if (!line.every(i => marked.has(board[i].id))) continue;
    // All marked — now check same dimension (ignore FREE at center)
    const dims = line.map(i => board[i].id === "FREE" ? null : board[i].dim);
    const nonFree = dims.filter(Boolean) as SmartDimension[];
    if (nonFree.every(d => d === nonFree[0])) return true;
  }
  return false;
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function ScitiBingoPage({ locale }: Props) {
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);

  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [board, setBoard] = useState<BingoTerm[]>(() => makeBoard(seed));
  const [marked, setMarked] = useState<Set<string>>(new Set(["FREE"]));
  const [calledDims, setCalledDims] = useState<SmartDimension[]>([]);
  const [won, setWon] = useState(false);
  const [lastCalled, setLastCalled] = useState<SmartDimension | null>(null);
  const [clickCount, setClickCount] = useState(0);

  const resetBoard = useCallback(() => {
    const ns = Math.floor(Math.random() * 1_000_000);
    setSeed(ns);
    const nb = makeBoard(ns);
    setBoard(nb);
    setMarked(new Set(["FREE"]));
    setCalledDims([]);
    setWon(false);
    setLastCalled(null);
    setClickCount(0);
  }, []);

  const callDimension = useCallback((dim: SmartDimension) => {
    // Stage announces the category — players must click manually. No auto-mark.
    if (calledDims.includes(dim)) return;
    setCalledDims(prev => [...prev, dim]);
    setLastCalled(dim);
  }, [calledDims]);

  const toggleCell = useCallback((cellId: string) => {
    if (cellId === "FREE") return;
    setClickCount(n => n + 1);
    setMarked(prev => {
      const next = new Set(prev);
      next.has(cellId) ? next.delete(cellId) : next.add(cellId);
      if (checkBingo(next, board)) setWon(true);
      return next;
    });
  }, [board]);

  return (
    <div className="bingo-page">
      {/* HEADER */}
      <section className="section bingo-header">
        <p className="eyebrow">SCITI 2026 · {t({ en:"Interactive Workshop Game", th:"เกมเวิร์กช็อป", zh:"互动工作坊游戏" })}</p>
        <h1 className="bingo-title">SCITI Bingo</h1>
        <p className="bingo-sub">
          {t({
            en:"Each player gets a unique 5×5 card. Stage calls a Smart dimension — all matching cells mark automatically. First line wins 🎉",
            th:"แต่ละคนได้การ์ด 5×5 ที่ไม่ซ้ำกัน เมื่อเวทีประกาศมิติ Smart ช่องที่ตรงกันจะทำเครื่องหมายอัตโนมัติ — ต่อแถวได้ก่อนชนะ 🎉",
            zh:"每位玩家获得独特的5×5棋盘。舞台宣布Smart维度，匹配格子自动标记。率先连线者获胜 🎉",
          })}
        </p>
        <div className="bingo-header-actions">
          <button className="cta-button" onClick={resetBoard}>
            ↻ {t({ en:"New Card", th:"การ์ดใหม่", zh:"新棋盘" })}
          </button>
          <div className="bingo-click-counter" title={t({ en:"Total clicks — fewer is better", th:"จำนวนคลิก — น้อยกว่าดีกว่า", zh:"总点击次数 — 越少越好" })}>
            <span className="bingo-click-num">{clickCount}</span>
            <span className="bingo-click-label">{t({ en:"clicks", th:"คลิก", zh:"次" })}</span>
          </div>
          <span className="bingo-seed">#{seed.toString(16).toUpperCase().padStart(5,"0")}</span>
        </div>
      </section>

      {/* WIN BANNER */}
      {won && (
        <div className="bingo-win-banner">
          <span className="bingo-win-text">🎉 BINGO! 🎉</span>
          <span className="bingo-win-sub">{t({ en:"First to complete a line!", th:"ต่อแถวสำเร็จเป็นคนแรก!", zh:"首先完成一条线！" })}</span>
          <button className="bingo-win-reset" onClick={resetBoard}>{t({ en:"Play again", th:"เล่นอีกครั้ง", zh:"再玩" })}</button>
        </div>
      )}

      <div className="bingo-layout">
        {/* 5×5 BOARD */}
        <div className="bingo-board-wrapper">
          <div className="bingo-grid-5x5">
            {board.map((cell) => {
              const isM = marked.has(cell.id);
              const isFree = cell.id === "FREE";
              const color = DIM_COLORS[cell.dim];
              return (
                <button
                  key={cell.id}
                  className={`bingo-cell5${isM ? " bingo-cell5-marked" : ""}${isFree ? " bingo-cell5-free" : ""}`}
                  style={{ borderColor: isM ? color : `${color}66` }}
                  onClick={() => toggleCell(cell.id)}
                  aria-pressed={isM}
                  title={`Smart ${translate(locale, DIM_LABELS[cell.dim])}`}
                >
                  {/* FRONT — emoji + label */}
                  <div className="bingo-card-front">
                    <span className="bingo-cell5-emoji">{cell.emoji}</span>
                    <span className="bingo-cell5-text">{translate(locale, cell.label)}</span>
                    {!isFree && (
                      <span className="bingo-cell5-dot" style={{ background: color }} />
                    )}
                  </div>
                  {/* BACK — dimension logo on white, coloured top bar */}
                  {!isFree && (
                    <div className="bingo-card-back">
                      <div className="bingo-card-back-bar" style={{ background: color }} />
                      <img
                        src={DIM_LOGOS[cell.dim]}
                        alt={`Smart ${translate(locale, DIM_LABELS[cell.dim])}`}
                        className="bingo-logo-img"
                        loading="lazy"
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="bingo-board-hint">
            {t({ en:"Tap any cell to mark manually, or let the stage call a dimension.", th:"แตะช่องเพื่อทำเครื่องหมายด้วยตัวเอง หรือรอให้เวทีประกาศ", zh:"点击格子手动标记，或等待舞台呼叫维度。" })}
          </p>
        </div>

        {/* STAGE CALLER */}
        <aside className="bingo-stage-panel">
          <p className="bingo-stage-eyebrow">{t({ en:"STAGE CALLER", th:"ผู้ประกาศเวที", zh:"舞台主持" })}</p>

          {lastCalled && (
            <div className="bingo-last-called" style={{ background: DIM_COLORS[lastCalled] }}>
              <span className="bingo-last-emoji">{DIM_EMOJIS[lastCalled]}</span>
              <div>
                <div className="bingo-last-called-label">{t({ en:"Called!", th:"ประกาศแล้ว!", zh:"已呼叫！" })}</div>
                <div className="bingo-last-called-dim">Smart {translate(locale, DIM_LABELS[lastCalled])}</div>
              </div>
            </div>
          )}

          <div className="bingo-dim-buttons">
            {DIMS.map(dim => {
              const called = calledDims.includes(dim);
              return (
                <button
                  key={dim}
                  className={`bingo-dim-btn${called ? " bingo-dim-btn-called" : ""}`}
                  style={called
                    ? { background: DIM_COLORS[dim], borderColor: DIM_COLORS[dim], color:"#fff", opacity:.4 }
                    : { borderColor: DIM_COLORS[dim], color: DIM_COLORS[dim] }
                  }
                  onClick={() => callDimension(dim)}
                  disabled={called}
                >
                  <span className="bingo-dim-emoji">{DIM_EMOJIS[dim]}</span>
                  <span className="bingo-dim-name">Smart {translate(locale, DIM_LABELS[dim])}</span>
                  {called && <span className="bingo-dim-tick">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="bingo-progress">
            <span className="bingo-progress-label">
              {t({ en:`${calledDims.length} / 7 called`, th:`ประกาศแล้ว ${calledDims.length} / 7`, zh:`已呼叫 ${calledDims.length} / 7` })}
            </span>
            <div className="bingo-progress-bar">
              <div className="bingo-progress-fill" style={{ width:`${(calledDims.length/7)*100}%` }} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
