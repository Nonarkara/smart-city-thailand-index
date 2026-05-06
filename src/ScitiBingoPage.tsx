import { useState, useCallback } from "react";
import { translate } from "./cityPresentation";
import type { Locale, SmartDimension } from "./types";
import { PILLAR_COLORS } from "./types";

interface Props { locale: Locale; }

// ─── BINGO POOL — 84 smart city terms, 12 per Smart dimension ───────────────
// Source: depa Thailand Smart City "Two-Five-Seven" framework, Hitachi Review
// Vol. 70 (Nimmanphatcharin et al.), and ASEAN Smart City Primer 2022.

type BingoTerm = { id: string; label: { en: string; th: string; zh: string }; dim: SmartDimension };

const POOL: BingoTerm[] = [
  // ENVIRONMENT ──────────────────────────────────────────────────────────────
  { id:"env1",  dim:"environment", label:{ en:"Air Quality Monitor",   th:"มอนิเตอร์คุณภาพอากาศ",  zh:"空气质量监测" } },
  { id:"env2",  dim:"environment", label:{ en:"Flood Sensor Network",  th:"เครือข่ายเซนเซอร์น้ำท่วม", zh:"洪涝传感网" } },
  { id:"env3",  dim:"environment", label:{ en:"Water Management",      th:"จัดการทรัพยากรน้ำ",     zh:"水资源管理" } },
  { id:"env4",  dim:"environment", label:{ en:"Climate Watch",         th:"เฝ้าระวังภูมิอากาศ",     zh:"气候监测站" } },
  { id:"env5",  dim:"environment", label:{ en:"Waste IoT Tracking",    th:"ติดตามขยะ IoT",          zh:"废物物联追踪" } },
  { id:"env6",  dim:"environment", label:{ en:"Disaster Alert",        th:"แจ้งเตือนภัยพิบัติ",     zh:"灾害预警" } },
  { id:"env7",  dim:"environment", label:{ en:"Green Space Plan",      th:"วางผังพื้นที่สีเขียว",   zh:"绿地规划" } },
  { id:"env8",  dim:"environment", label:{ en:"PM2.5 Real-Time",       th:"PM2.5 เรียลไทม์",        zh:"PM2.5 实时" } },
  { id:"env9",  dim:"environment", label:{ en:"River Level Sensor",    th:"เซนเซอร์ระดับน้ำ",       zh:"河流水位传感" } },
  { id:"env10", dim:"environment", label:{ en:"Urban Heat Map",        th:"แผนที่ความร้อนเมือง",    zh:"城市热力图" } },
  { id:"env11", dim:"environment", label:{ en:"Carbon Index",          th:"ดัชนีคาร์บอน",           zh:"碳足迹指数" } },
  { id:"env12", dim:"environment", label:{ en:"Conservation Tech",     th:"เทคโนโลยีอนุรักษ์",     zh:"生态保护科技" } },

  // ECONOMY ──────────────────────────────────────────────────────────────────
  { id:"eco1",  dim:"economy", label:{ en:"Digital Tourism",    th:"ท่องเที่ยวดิจิทัล",    zh:"数字旅游" } },
  { id:"eco2",  dim:"economy", label:{ en:"SME Platform",       th:"แพลตฟอร์ม SME",        zh:"中小企业平台" } },
  { id:"eco3",  dim:"economy", label:{ en:"Startup Hub",        th:"ฮับสตาร์ทอัพ",         zh:"创业中心" } },
  { id:"eco4",  dim:"economy", label:{ en:"Smart Agriculture",  th:"เกษตรอัจฉริยะ",        zh:"智慧农业" } },
  { id:"eco5",  dim:"economy", label:{ en:"Agri-Tech Drone",    th:"โดรนการเกษตร",         zh:"农业无人机" } },
  { id:"eco6",  dim:"economy", label:{ en:"Innovation Zone",    th:"เขตนวัตกรรม",          zh:"创新区" } },
  { id:"eco7",  dim:"economy", label:{ en:"FDI Gateway",        th:"ประตูดึงดูด FDI",       zh:"外资门户" } },
  { id:"eco8",  dim:"economy", label:{ en:"Business Intel",     th:"ข้อมูลธุรกิจ",         zh:"商业智能" } },
  { id:"eco9",  dim:"economy", label:{ en:"Creative Economy",   th:"เศรษฐกิจสร้างสรรค์",  zh:"创意经济" } },
  { id:"eco10", dim:"economy", label:{ en:"MICE City",          th:"เมือง MICE",           zh:"会展城市" } },
  { id:"eco11", dim:"economy", label:{ en:"Digital Marketplace",th:"ตลาดออนไลน์",          zh:"数字集市" } },
  { id:"eco12", dim:"economy", label:{ en:"EEC Corridor",       th:"ระเบียง EEC",          zh:"东部经济走廊" } },

  // MOBILITY ─────────────────────────────────────────────────────────────────
  { id:"mob1",  dim:"mobility", label:{ en:"BRT Corridor",      th:"รถด่วนพิเศษ BRT",      zh:"快速公交" } },
  { id:"mob2",  dim:"mobility", label:{ en:"Smart Bus",         th:"รถเมล์อัจฉริยะ",       zh:"智能公交" } },
  { id:"mob3",  dim:"mobility", label:{ en:"EV Charging Hub",   th:"จุดชาร์จ EV",           zh:"电动车充电" } },
  { id:"mob4",  dim:"mobility", label:{ en:"AI Traffic Light",  th:"ไฟจราจร AI",            zh:"AI 交通灯" } },
  { id:"mob5",  dim:"mobility", label:{ en:"Smart Parking",     th:"ที่จอดรถอัจฉริยะ",     zh:"智能停车" } },
  { id:"mob6",  dim:"mobility", label:{ en:"MaaS Platform",     th:"แพลตฟอร์ม MaaS",        zh:"出行即服务" } },
  { id:"mob7",  dim:"mobility", label:{ en:"Bike Share",        th:"จักรยานสาธารณะ",        zh:"共享单车" } },
  { id:"mob8",  dim:"mobility", label:{ en:"LRT Rail",          th:"รถไฟฟ้า LRT",           zh:"轻轨" } },
  { id:"mob9",  dim:"mobility", label:{ en:"Real-Time Route",   th:"เส้นทางเรียลไทม์",     zh:"实时路线" } },
  { id:"mob10", dim:"mobility", label:{ en:"Pedestrian Safety", th:"ความปลอดภัยคนเดิน",    zh:"行人安全" } },
  { id:"mob11", dim:"mobility", label:{ en:"Airport Link",      th:"รถเชื่อมสนามบิน",      zh:"机场快线" } },
  { id:"mob12", dim:"mobility", label:{ en:"Smart Ferry",       th:"เรือโดยสารอัจฉริยะ",   zh:"智能渡轮" } },

  // ENERGY ───────────────────────────────────────────────────────────────────
  { id:"enr1",  dim:"energy", label:{ en:"Solar Array",       th:"แผงโซลาร์",              zh:"太阳能阵列" } },
  { id:"enr2",  dim:"energy", label:{ en:"Smart Grid",        th:"กริดอัจฉริยะ",           zh:"智能电网" } },
  { id:"enr3",  dim:"energy", label:{ en:"Energy Dashboard",  th:"แดชบอร์ดพลังงาน",       zh:"能源仪表板" } },
  { id:"enr4",  dim:"energy", label:{ en:"Biomass Power",     th:"พลังงานชีวมวล",          zh:"生物质能源" } },
  { id:"enr5",  dim:"energy", label:{ en:"Wind Energy",       th:"พลังงานลม",              zh:"风力发电" } },
  { id:"enr6",  dim:"energy", label:{ en:"Net Zero Target",   th:"เป้า Net Zero",          zh:"净零排放" } },
  { id:"enr7",  dim:"energy", label:{ en:"Demand Response",   th:"การตอบสนองความต้องการ", zh:"需求响应" } },
  { id:"enr8",  dim:"energy", label:{ en:"Community Solar",   th:"พลังงานชุมชน",           zh:"社区光伏" } },
  { id:"enr9",  dim:"energy", label:{ en:"LED Street Light",  th:"ไฟถนน LED",              zh:"LED 路灯" } },
  { id:"enr10", dim:"energy", label:{ en:"Smart Meter",       th:"มิเตอร์อัจฉริยะ",       zh:"智能电表" } },
  { id:"enr11", dim:"energy", label:{ en:"Clean Energy Mix",  th:"พลังงานสะอาดผสม",       zh:"清洁能源组合" } },
  { id:"enr12", dim:"energy", label:{ en:"Energy Saving",     th:"ประหยัดพลังงาน",        zh:"节能减耗" } },

  // PEOPLE ───────────────────────────────────────────────────────────────────
  { id:"ppl1",  dim:"people", label:{ en:"Digital Literacy",     th:"การรู้ดิจิทัล",           zh:"数字素养" } },
  { id:"ppl2",  dim:"people", label:{ en:"Lifelong Learning",    th:"เรียนรู้ตลอดชีวิต",       zh:"终身学习" } },
  { id:"ppl3",  dim:"people", label:{ en:"STEM Lab",             th:"ห้อง STEM",                zh:"STEM 实验室" } },
  { id:"ppl4",  dim:"people", label:{ en:"Youth Leader",         th:"ผู้นำเยาวชน",              zh:"青年领袖" } },
  { id:"ppl5",  dim:"people", label:{ en:"E-Learning Hub",       th:"ศูนย์ E-Learning",         zh:"在线学习" } },
  { id:"ppl6",  dim:"people", label:{ en:"Coding Bootcamp",      th:"เรียนโค้ดดิ้ง",            zh:"编程训练营" } },
  { id:"ppl7",  dim:"people", label:{ en:"Social Innovation",    th:"นวัตกรรมสังคม",            zh:"社会创新" } },
  { id:"ppl8",  dim:"people", label:{ en:"Design Thinking",      th:"การคิดเชิงออกแบบ",        zh:"设计思维" } },
  { id:"ppl9",  dim:"people", label:{ en:"YSEALI Workshop",      th:"YSEALI Workshop",           zh:"YSEALI 工作坊" } },
  { id:"ppl10", dim:"people", label:{ en:"Diversity & Inclusion",th:"ความหลากหลาย",             zh:"包容多样性" } },
  { id:"ppl11", dim:"people", label:{ en:"SME Upskill",          th:"ยกระดับทักษะ SME",         zh:"中小企业提升" } },
  { id:"ppl12", dim:"people", label:{ en:"Community Network",    th:"เครือข่ายชุมชน",          zh:"社区网络" } },

  // LIVING ───────────────────────────────────────────────────────────────────
  { id:"liv1",  dim:"living", label:{ en:"5-Star Service",      th:"บริการ 5 ดาว",             zh:"五星服务" } },
  { id:"liv2",  dim:"living", label:{ en:"Smart Hospital",      th:"โรงพยาบาลอัจฉริยะ",       zh:"智慧医院" } },
  { id:"liv3",  dim:"living", label:{ en:"CCTV Safety",         th:"CCTV ความปลอดภัย",         zh:"CCTV 安全" } },
  { id:"liv4",  dim:"living", label:{ en:"Elderly Care Tech",   th:"เทคโนโลยีดูแลผู้สูงอายุ", zh:"老人护理科技" } },
  { id:"liv5",  dim:"living", label:{ en:"Smart School",        th:"โรงเรียนอัจฉริยะ",        zh:"智慧学校" } },
  { id:"liv6",  dim:"living", label:{ en:"Crisis Hotline",      th:"สายด่วนฉุกเฉิน",          zh:"危机热线" } },
  { id:"liv7",  dim:"living", label:{ en:"QR Healthcare",       th:"บัตรสุขภาพ QR",            zh:"QR 医疗" } },
  { id:"liv8",  dim:"living", label:{ en:"Urban Farm",          th:"ฟาร์มในเมือง",             zh:"城市农场" } },
  { id:"liv9",  dim:"living", label:{ en:"LINE City Chat",      th:"LINE บริการเมือง",         zh:"LINE 城市客服" } },
  { id:"liv10", dim:"living", label:{ en:"Smart Ambulance",     th:"รถพยาบาลอัจฉริยะ",        zh:"智能救护车" } },
  { id:"liv11", dim:"living", label:{ en:"Public Health Index", th:"ดัชนีสาธารณสุข",          zh:"公共健康指数" } },
  { id:"liv12", dim:"living", label:{ en:"Safe City Rating",    th:"คะแนนเมืองปลอดภัย",      zh:"安全城市评级" } },

  // GOVERNANCE ───────────────────────────────────────────────────────────────
  { id:"gov1",  dim:"governance", label:{ en:"City Data Platform",   th:"แพลตฟอร์มข้อมูลเมือง", zh:"城市数据平台" } },
  { id:"gov2",  dim:"governance", label:{ en:"Open Data",            th:"ข้อมูลเปิด",            zh:"开放数据" } },
  { id:"gov3",  dim:"governance", label:{ en:"Citizen App",          th:"แอปพลิเคชันประชาชน",   zh:"市民应用" } },
  { id:"gov4",  dim:"governance", label:{ en:"e-Government",         th:"รัฐบาลอิเล็กทรอนิกส์", zh:"电子政务" } },
  { id:"gov5",  dim:"governance", label:{ en:"City Dashboard",       th:"แดชบอร์ดเมือง",        zh:"城市仪表板" } },
  { id:"gov6",  dim:"governance", label:{ en:"Digital Services",     th:"บริการดิจิทัล",         zh:"数字公共服务" } },
  { id:"gov7",  dim:"governance", label:{ en:"Public API",           th:"API สาธารณะ",           zh:"公共 API" } },
  { id:"gov8",  dim:"governance", label:{ en:"Smart Procurement",    th:"จัดซื้อจัดจ้างอัจฉริยะ",zh:"智能采购" } },
  { id:"gov9",  dim:"governance", label:{ en:"Participatory Budget", th:"งบประมาณมีส่วนร่วม",   zh:"参与式预算" } },
  { id:"gov10", dim:"governance", label:{ en:"Policy Transparency",  th:"นโยบายโปร่งใส",        zh:"政策透明" } },
  { id:"gov11", dim:"governance", label:{ en:"Inter-Agency Link",    th:"เชื่อมต่อหน่วยงาน",    zh:"跨部门联通" } },
  { id:"gov12", dim:"governance", label:{ en:"National Smart City",  th:"สำนักงานเมืองอัจฉริยะ",zh:"国家智慧城市办" } },
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

// Seeded shuffle so each session gets a unique but reproducible board
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
  const shuffled = seededShuffle(POOL, seed);
  // 81 cells: 40 before FREE center, FREE at 40, 40 after
  const first40 = shuffled.slice(0, 40);
  const last40  = shuffled.slice(40, 80);
  const free: BingoTerm = { id: "FREE", dim: "governance", label: { en: "FREE", th: "ฟรี", zh: "FREE" } };
  return [...first40, free, ...last40];
}

const DIMS: SmartDimension[] = ["environment","economy","mobility","energy","people","living","governance"];

function checkBingo(marked: Set<string>, board: BingoTerm[]): boolean {
  // Check 9 rows, 9 columns, 2 diagonals
  const ids = board.map(c => c.id);
  const isMarked = (idx: number) => marked.has(ids[idx]);

  // rows
  for (let r = 0; r < 9; r++) {
    if ([0,1,2,3,4,5,6,7,8].every(c => isMarked(r * 9 + c))) return true;
  }
  // columns
  for (let c = 0; c < 9; c++) {
    if ([0,1,2,3,4,5,6,7,8].every(r => isMarked(r * 9 + c))) return true;
  }
  // diagonals
  if ([0,10,20,30,40,50,60,70,80].every(isMarked)) return true;
  if ([8,16,24,32,40,48,56,64,72].every(isMarked)) return true;
  return false;
}

export default function ScitiBingoPage({ locale }: Props) {
  const t = (copy: { en: string; th: string; zh: string }) => translate(locale, copy);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1_000_000));
  const [board] = useState(() => makeBoard(seed));
  const [boardState, setBoardState] = useState<BingoTerm[]>(() => makeBoard(seed));
  const [marked, setMarked] = useState<Set<string>>(new Set(["FREE"]));
  const [calledDims, setCalledDims] = useState<SmartDimension[]>([]);
  const [won, setWon] = useState(false);
  const [lastCalled, setLastCalled] = useState<SmartDimension | null>(null);

  const resetBoard = useCallback(() => {
    const newSeed = Math.floor(Math.random() * 1_000_000);
    setSeed(newSeed);
    const newBoard = makeBoard(newSeed);
    setBoardState(newBoard);
    setMarked(new Set(["FREE"]));
    setCalledDims([]);
    setWon(false);
    setLastCalled(null);
  }, []);

  const callDimension = useCallback((dim: SmartDimension) => {
    if (calledDims.includes(dim)) return;
    const newCalled = [...calledDims, dim];
    setCalledDims(newCalled);
    setLastCalled(dim);
    const newMarked = new Set(marked);
    boardState.forEach(cell => {
      if (cell.dim === dim || cell.id === "FREE") newMarked.add(cell.id);
    });
    setMarked(newMarked);
    if (!won && checkBingo(newMarked, boardState)) setWon(true);
  }, [calledDims, marked, boardState, won]);

  const toggleCell = useCallback((cellId: string) => {
    if (cellId === "FREE") return;
    setMarked(prev => {
      const next = new Set(prev);
      if (next.has(cellId)) { next.delete(cellId); } else { next.add(cellId); }
      if (checkBingo(next, boardState)) setWon(true);
      return next;
    });
  }, [boardState]);

  const uncalled = DIMS.filter(d => !calledDims.includes(d));

  return (
    <div className="bingo-page">
      {/* ─── HEADER ─── */}
      <section className="section bingo-header">
        <p className="eyebrow">SCITI 2026 · {t({ en: "Interactive Workshop Game", th: "เกมเวิร์กช็อปเชิงโต้ตอบ", zh: "互动工作坊游戏" })}</p>
        <h1 className="bingo-title">SCITI Bingo</h1>
        <p className="bingo-sub">
          {t({
            en: "Each player gets a unique 9×9 board. The stage announces which Smart dimension is active. Mark your cells — first line wins.",
            th: "ผู้เล่นแต่ละคนได้บอร์ด 9×9 ที่ไม่ซ้ำกัน เมื่อเวทีประกาศมิติ Smart ที่ใช้งานอยู่ ทำเครื่องหมายช่องของคุณ — ใครต่อแถวได้ก่อนชนะ",
            zh: "每位玩家拥有专属 9×9 棋盘。舞台宣布当前激活的智慧维度，标记你的格子——率先连线者获胜。",
          })}
        </p>
        <div className="bingo-header-actions">
          <button className="cta-button" onClick={resetBoard}>
            {t({ en: "↻ New board", th: "↻ บอร์ดใหม่", zh: "↻ 新棋盘" })}
          </button>
          <span className="bingo-seed">#{seed.toString(16).toUpperCase().padStart(5,"0")}</span>
        </div>
      </section>

      {/* ─── WIN BANNER ─── */}
      {won && (
        <div className="bingo-win-banner">
          <span className="bingo-win-text">🎉 BINGO! 🎉</span>
          <span className="bingo-win-sub">
            {t({ en: "First to complete a line!", th: "ต่อแถวสำเร็จเป็นคนแรก!", zh: "首先完成一条线！" })}
          </span>
          <button className="bingo-win-reset" onClick={resetBoard}>
            {t({ en: "Play again", th: "เล่นอีกครั้ง", zh: "再玩一次" })}
          </button>
        </div>
      )}

      <div className="bingo-layout">
        {/* ─── BOARD ─── */}
        <div className="bingo-board-wrapper">
          {/* Dimension legend bar */}
          <div className="bingo-legend">
            {DIMS.map(dim => (
              <div key={dim} className="bingo-legend-item" style={{ borderColor: DIM_COLORS[dim], color: DIM_COLORS[dim] }}>
                <span className="bingo-legend-dot" style={{ background: DIM_COLORS[dim] }} />
                {translate(locale, DIM_LABELS[dim]).slice(0, 3).toUpperCase()}
              </div>
            ))}
          </div>

          {/* 9×9 grid */}
          <div className="bingo-grid">
            {boardState.map((cell) => {
              const isMarkedCell = marked.has(cell.id);
              const isFree = cell.id === "FREE";
              const cellColor = DIM_COLORS[cell.dim];
              return (
                <button
                  key={cell.id}
                  className={`bingo-cell${isMarkedCell ? " bingo-cell-marked" : ""}${isFree ? " bingo-cell-free" : ""}`}
                  style={isMarkedCell ? { background: cellColor, borderColor: cellColor } : { borderColor: `${cellColor}55` }}
                  onClick={() => toggleCell(cell.id)}
                  title={`Smart ${translate(locale, DIM_LABELS[cell.dim])}`}
                  aria-pressed={isMarkedCell}
                >
                  <span className="bingo-cell-text">{isFree ? "FREE" : translate(locale, cell.label)}</span>
                  {!isFree && !isMarkedCell && (
                    <span className="bingo-cell-dim-dot" style={{ background: cellColor }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── STAGE PANEL ─── */}
        <aside className="bingo-stage-panel">
          <p className="bingo-stage-eyebrow">{t({ en: "STAGE CALLER", th: "ผู้ประกาศเวที", zh: "舞台主持" })}</p>
          <p className="bingo-stage-desc">
            {t({ en: "Tap to call a dimension. All matching cells on every board will light up.", th: "แตะเพื่อเรียกมิติ ช่องที่ตรงกันในทุกบอร์ดจะสว่างขึ้น", zh: "点击呼叫维度，所有棋盘上匹配的格子将亮起。" })}
          </p>

          {lastCalled && (
            <div className="bingo-last-called" style={{ background: DIM_COLORS[lastCalled] }}>
              <span className="bingo-last-called-label">{t({ en: "Called!", th: "ประกาศแล้ว!", zh: "已呼叫！" })}</span>
              <span className="bingo-last-called-dim">
                Smart {translate(locale, DIM_LABELS[lastCalled])}
              </span>
            </div>
          )}

          {/* Uncalled dimensions */}
          <div className="bingo-dim-buttons">
            {DIMS.map(dim => {
              const called = calledDims.includes(dim);
              return (
                <button
                  key={dim}
                  className={`bingo-dim-btn${called ? " bingo-dim-btn-called" : ""}`}
                  style={called
                    ? { background: DIM_COLORS[dim], borderColor: DIM_COLORS[dim], color: "#fff", opacity: 0.45 }
                    : { borderColor: DIM_COLORS[dim], color: DIM_COLORS[dim] }
                  }
                  onClick={() => callDimension(dim)}
                  disabled={called}
                >
                  <span className="bingo-dim-name">Smart {translate(locale, DIM_LABELS[dim])}</span>
                  {called && <span className="bingo-dim-tick">✓</span>}
                </button>
              );
            })}
          </div>

          <div className="bingo-progress">
            <span className="bingo-progress-label">
              {t({ en: `${calledDims.length} / 7 called`, th: `${calledDims.length} / 7 มิติที่ประกาศแล้ว`, zh: `已呼叫 ${calledDims.length} / 7` })}
            </span>
            <div className="bingo-progress-bar">
              <div className="bingo-progress-fill" style={{ width: `${(calledDims.length / 7) * 100}%` }} />
            </div>
          </div>

          <p className="bingo-manual-note">
            {t({
              en: "Playing without a presenter? Click cells manually to mark them.",
              th: "ไม่มีผู้ประกาศ? คลิกช่องเองเพื่อทำเครื่องหมาย",
              zh: "没有主持人？可手动点击格子标记。",
            })}
          </p>
        </aside>
      </div>
    </div>
  );
}
