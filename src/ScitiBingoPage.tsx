import { useState, useCallback } from "react";
import { translate } from "./cityPresentation";
import { assetUrl } from "./mediaAssets";
import type { Locale, SmartDimension } from "./types";

const DIM_LOGOS: Record<SmartDimension, string> = {
  environment: assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-01.png")),
  mobility:    assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-02.png")),
  living:      assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-03.png")),
  people:      assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-04.png")),
  energy:      assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-05.png")),
  economy:     assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-06.png")),
  governance:  assetUrl(encodeURI("/icon 7 Smarts PNG/icon 7 Smarts Logo-07.png")),
};

interface Props { locale: Locale; }
type T3 = { en: string; th: string; zh: string };
type BingoTerm = { id: string; emoji: string; label: T3; hint: T3; dim: SmartDimension };

const POOL: BingoTerm[] = [
  { id:"env1", dim:"environment", emoji:"🌬️", label:{ en:"Air Quality Monitor", th:"มอนิเตอร์อากาศ", zh:"空气质量监测" }, hint:{ en:"tracks what you breathe every day", th:"วัดอากาศที่คุณหายใจทุกวัน", zh:"监测你每天呼吸的空气" } },
  { id:"env2", dim:"environment", emoji:"🌊", label:{ en:"Flood Sensor", th:"เซนเซอร์น้ำท่วม", zh:"洪涝传感" }, hint:{ en:"warns before the water rises", th:"เตือนก่อนน้ำจะท่วม", zh:"水位上涨前提前预警" } },
  { id:"env3", dim:"environment", emoji:"💧", label:{ en:"Water Management", th:"จัดการน้ำ", zh:"水资源管理" }, hint:{ en:"keeps clean water flowing to taps", th:"ทำให้น้ำสะอาดไหลออกก๊อก", zh:"保障清洁水流出水龙头" } },
  { id:"env4", dim:"environment", emoji:"🌡️", label:{ en:"Climate Watch", th:"เฝ้าระวังภูมิอากาศ", zh:"气候监测" }, hint:{ en:"predicts extreme weather before it hits", th:"คาดการณ์พายุก่อนถึง", zh:"极端天气来袭前提前预测" } },
  { id:"env5", dim:"environment", emoji:"♻️", label:{ en:"Waste IoT", th:"ติดตามขยะ IoT", zh:"废物物联" }, hint:{ en:"smart bins know when they're full", th:"ถังขยะรู้เองเมื่อเต็ม", zh:"智能垃圾桶知道自己满了" } },
  { id:"env6", dim:"environment", emoji:"🚨", label:{ en:"Disaster Alert", th:"แจ้งเตือนภัย", zh:"灾害预警" }, hint:{ en:"early warning saves lives", th:"เตือนภัยก่อนช่วยชีวิตได้", zh:"提前预警总能救命" } },
  { id:"env7", dim:"environment", emoji:"🌳", label:{ en:"Green Space ≥10m²", th:"พื้นที่เขียว ≥10m²", zh:"绿地≥10m²" }, hint:{ en:"minimum parks per person, required by law", th:"ข้อกำหนดทางกฎหมาย: สวนต่อหัวคน", zh:"法定最低人均公园面积" } },
  { id:"env8", dim:"environment", emoji:"😷", label:{ en:"PM2.5 Real-Time", th:"PM2.5 เรียลไทม์", zh:"PM2.5实时" }, hint:{ en:"tiny invisible particles, big health risk", th:"อนุภาคเล็กมองไม่เห็น ภัยสุขภาพใหญ่", zh:"肉眼不可见的细颗粒，大健康风险" } },
  { id:"eco1", dim:"economy", emoji:"✈️", label:{ en:"Digital Tourism", th:"ท่องเที่ยวดิจิทัล", zh:"数字旅游" }, hint:{ en:"tourists discover and book the city via apps", th:"นักท่องเที่ยวค้นหาและจองผ่านแอป", zh:"游客通过应用发现并预订" } },
  { id:"eco2", dim:"economy", emoji:"🏪", label:{ en:"SME Platform", th:"แพลตฟอร์ม SME", zh:"中小企业平台" }, hint:{ en:"small businesses go digital together", th:"ธุรกิจเล็กก้าวสู่โลกดิจิทัล", zh:"小企业集体数字化" } },
  { id:"eco3", dim:"economy", emoji:"🚀", label:{ en:"Startup Hub", th:"ฮับสตาร์ทอัพ", zh:"创业中心" }, hint:{ en:"where new ideas become real companies", th:"ที่ที่ไอเดียใหม่กลายเป็นบริษัทจริง", zh:"新想法在这里变成真正的公司" } },
  { id:"eco4", dim:"economy", emoji:"🌾", label:{ en:"Smart Agriculture", th:"เกษตรอัจฉริยะ", zh:"智慧农业" }, hint:{ en:"sensors and data help grow better crops", th:"เซนเซอร์และข้อมูลช่วยปลูกพืชได้ดีขึ้น", zh:"传感器和数据帮助更好地种植作物" } },
  { id:"eco5", dim:"economy", emoji:"🚁", label:{ en:"Agri Drone", th:"โดรนการเกษตร", zh:"农业无人机" }, hint:{ en:"crops surveyed and sprayed from above", th:"ติดตามและพ่นยาพืชจากทางอากาศ", zh:"从空中监测并喷洒作物" } },
  { id:"eco6", dim:"economy", emoji:"🏙️", label:{ en:"Innovation Zone", th:"เขตนวัตกรรม", zh:"创新区" }, hint:{ en:"city-approved area for testing new tech", th:"พื้นที่เมืองอนุมัติสำหรับทดลองเทคโนโลยีใหม่", zh:"城市批准的新技术测试区域" } },
  { id:"eco7", dim:"economy", emoji:"💰", label:{ en:"FDI Gateway", th:"ดึงดูด FDI", zh:"外资门户" }, hint:{ en:"makes foreign investment fast and easy", th:"ทำให้การลงทุนต่างชาติรวดเร็วง่ายดาย", zh:"让外资投资变得快捷简便" } },
  { id:"eco8", dim:"economy", emoji:"💳", label:{ en:"Cashless Society", th:"ไร้เงินสด", zh:"无现金社会" }, hint:{ en:"pay with QR — no coins, no wallets", th:"จ่ายด้วย QR ไม่ต้องใช้เหรียญ", zh:"扫码支付，无需现金和钱包" } },
  { id:"mob1", dim:"mobility", emoji:"🚍", label:{ en:"BRT Corridor", th:"รถ BRT", zh:"快速公交" }, hint:{ en:"dedicated fast lane for buses only", th:"เลนด่วนเฉพาะรถโดยสาร", zh:"专供公交的快速专用道" } },
  { id:"mob2", dim:"mobility", emoji:"⚡", label:{ en:"EV Charging", th:"จุดชาร์จ EV", zh:"电动车充电" }, hint:{ en:"plug-in stops spread across the city", th:"จุดชาร์จกระจายทั่วเมือง", zh:"遍布全城的充电站点" } },
  { id:"mob3", dim:"mobility", emoji:"🚦", label:{ en:"AI Traffic Light", th:"ไฟจราจร AI", zh:"AI交通灯" }, hint:{ en:"adjusts green/red to live traffic conditions", th:"ปรับเขียว-แดงตามสภาพจราจรจริง", zh:"根据实时路况调节红绿灯" } },
  { id:"mob4", dim:"mobility", emoji:"🅿️", label:{ en:"Smart Parking", th:"จอดรถอัจฉริยะ", zh:"智能停车" }, hint:{ en:"find an empty space before you arrive", th:"หาที่ว่างก่อนถึงที่หมาย", zh:"到达前就找好空车位" } },
  { id:"mob5", dim:"mobility", emoji:"🗺️", label:{ en:"MaaS Platform", th:"แพลตฟอร์ม MaaS", zh:"出行即服务" }, hint:{ en:"one app for bus, train, bike and taxi", th:"แอปเดียวครบทุกการเดินทาง", zh:"一个应用涵盖所有出行方式" } },
  { id:"mob6", dim:"mobility", emoji:"🚲", label:{ en:"Bike Share", th:"จักรยานสาธารณะ", zh:"共享单车" }, hint:{ en:"borrow a bicycle, return it anywhere", th:"ยืมจักรยานและคืนได้ทุกที่", zh:"随借随还的共享单车" } },
  { id:"mob7", dim:"mobility", emoji:"🚋", label:{ en:"LRT Transit", th:"รถไฟฟ้า LRT", zh:"轻轨" }, hint:{ en:"light rail connecting districts quietly", th:"รางเบาเชื่อมย่านต่างๆ อย่างเงียบ", zh:"轻轨静静连接各个街区" } },
  { id:"mob8", dim:"mobility", emoji:"🚶", label:{ en:"Pedestrian Path", th:"ทางเดินคนเดิน", zh:"步行道" }, hint:{ en:"safe, shaded routes just for walking", th:"ทางเดินปลอดภัยมีร่มเงา", zh:"专为步行设计的安全遮阳路线" } },
  { id:"enr1", dim:"energy", emoji:"☀️", label:{ en:"Solar ≥50%", th:"พลังงานแสงอาทิตย์", zh:"太阳能≥50%" }, hint:{ en:"half the city's power comes from the sun", th:"ครึ่งหนึ่งของพลังงานมาจากแสงอาทิตย์", zh:"城市一半电力来自太阳" } },
  { id:"enr2", dim:"energy", emoji:"🔌", label:{ en:"Smart Grid", th:"กริดอัจฉริยะ", zh:"智能电网" }, hint:{ en:"power re-routes automatically when cut", th:"ไฟฟ้าเบี่ยงเส้นทางอัตโนมัติเมื่อดับ", zh:"断电时电力自动改道" } },
  { id:"enr3", dim:"energy", emoji:"💨", label:{ en:"Wind Energy", th:"พลังงานลม", zh:"风力发电" }, hint:{ en:"turbines turn breeze into electricity", th:"กังหันเปลี่ยนลมเป็นไฟฟ้า", zh:"风机把风变成电" } },
  { id:"enr4", dim:"environment", emoji:"🎯", label:{ en:"Net Zero Target", th:"เป้า Net Zero", zh:"净零目标" }, hint:{ en:"whatever you emit, you must absorb", th:"ปล่อยเท่าไหร่ต้องดูดซับเท่านั้น", zh:"排放多少就要吸收多少" } },
  { id:"enr5", dim:"energy", emoji:"🔋", label:{ en:"Energy Storage 30%", th:"เก็บพลังงาน ≥30%", zh:"储能≥30%" }, hint:{ en:"stores daytime solar for the night", th:"เก็บพลังงานกลางวันไว้ใช้ตอนกลางคืน", zh:"把白天太阳能存起来夜晚用" } },
  { id:"enr6", dim:"energy", emoji:"📊", label:{ en:"Smart Meter 100%", th:"มิเตอร์ 100%", zh:"智能电表100%" }, hint:{ en:"every home tracked in real-time", th:"ทุกบ้านถูกติดตามแบบเรียลไทม์", zh:"每家每户实时监测用电量" } },
  { id:"enr7", dim:"energy", emoji:"🏘️", label:{ en:"Smart Home/Building", th:"Smart Home", zh:"智慧楼宇" }, hint:{ en:"buildings manage their own power use", th:"อาคารบริหารการใช้พลังงานตัวเอง", zh:"建筑自主管理自身能耗" } },
  { id:"enr8", dim:"energy", emoji:"🏝️", label:{ en:"Micro-grid 24hr", th:"ไมโครกริด 24 ชม.", zh:"微电网24小时" }, hint:{ en:"city runs off the national grid for a full day", th:"เมืองทำงานโดยไม่พึ่งสายส่งหลักได้ 24 ชม.", zh:"城市可独立运行整整一天" } },
  { id:"ppl1", dim:"people", emoji:"📱", label:{ en:"Digital Literacy", th:"การรู้ดิจิทัล", zh:"数字素养" }, hint:{ en:"everyone can use the internet safely", th:"ทุกคนใช้อินเทอร์เน็ตได้อย่างปลอดภัย", zh:"每个人都能安全使用互联网" } },
  { id:"ppl2", dim:"people", emoji:"📚", label:{ en:"Lifelong Learning", th:"เรียนรู้ตลอดชีวิต", zh:"终身学习" }, hint:{ en:"education doesn't stop after school", th:"การศึกษาไม่จบแค่ในโรงเรียน", zh:"学习不因毕业而停止" } },
  { id:"ppl3", dim:"people", emoji:"🔬", label:{ en:"STEM Lab", th:"ห้อง STEM", zh:"STEM实验室" }, hint:{ en:"hands-on science for young people", th:"วิทยาศาสตร์เชิงปฏิบัติสำหรับเยาวชน", zh:"为年轻人设计的动手科学课" } },
  { id:"ppl4", dim:"people", emoji:"🌟", label:{ en:"Youth Leader", th:"ผู้นำเยาวชน", zh:"青年领袖" }, hint:{ en:"young citizens help shape city policy", th:"เยาวชนมีส่วนกำหนดนโยบายเมือง", zh:"年轻市民参与塑造城市政策" } },
  { id:"ppl5", dim:"people", emoji:"👩‍💻", label:{ en:"Coding Bootcamp", th:"เรียนโค้ดดิ้ง", zh:"编程训练营" }, hint:{ en:"learn to build software in a few weeks", th:"เรียนสร้างโปรแกรมภายในไม่กี่สัปดาห์", zh:"数周内学会构建软件" } },
  { id:"ppl6", dim:"people", emoji:"💡", label:{ en:"Social Innovation", th:"นวัตกรรมสังคม", zh:"社会创新" }, hint:{ en:"fix root causes, not just symptoms", th:"แก้ต้นตอ ไม่ใช่แค่ผล", zh:"解决根源，而非表象" } },
  { id:"ppl7", dim:"governance", emoji:"🎨", label:{ en:"Design Thinking", th:"Design Thinking", zh:"设计思维" }, hint:{ en:"empathise with users before you build anything", th:"เข้าใจผู้ใช้ก่อนลงมือสร้าง", zh:"建造前先理解用户需求" } },
  { id:"ppl8", dim:"people", emoji:"🌏", label:{ en:"ODOS Summer Camp", th:"ODOS Summer Camp", zh:"ODOS夏令营" }, hint:{ en:"young leaders spend a summer building smart city skills", th:"ผู้นำเยาวชนใช้ฤดูร้อนพัฒนาทักษะเมืองอัจฉริยะ", zh:"青年领袖共度暑假培养智慧城市技能" } },
  { id:"liv1", dim:"living", emoji:"⭐", label:{ en:"5-Star Service", th:"บริการ 5 ดาว", zh:"五星服务" }, hint:{ en:"citizens rate every interaction with the city", th:"ประชาชนให้คะแนนทุกการบริการเมือง", zh:"市民为每次城市服务评分" } },
  { id:"liv2", dim:"living", emoji:"🏥", label:{ en:"Smart Hospital", th:"โรงพยาบาลอัจฉริยะ", zh:"智慧医院" }, hint:{ en:"your medical record follows you everywhere", th:"ประวัติการรักษาติดตามคุณทุกที่", zh:"医疗档案随你走遍各处" } },
  { id:"liv3", dim:"living", emoji:"📷", label:{ en:"CCTV Safety", th:"CCTV ความปลอดภัย", zh:"CCTV安全" }, hint:{ en:"cameras deter crime and document incidents", th:"กล้องป้องปรามอาชญากรรมและบันทึกเหตุ", zh:"摄像头震慑犯罪并记录事件" } },
  { id:"liv4", dim:"living", emoji:"👴", label:{ en:"Elderly Day Care", th:"ศูนย์ผู้สูงอายุ", zh:"老人日托" }, hint:{ en:"daytime support for the ageing population", th:"ดูแลผู้สูงอายุระหว่างวัน", zh:"为老龄人口提供白天照护" } },
  { id:"liv5", dim:"people", emoji:"🏫", label:{ en:"Smart School", th:"โรงเรียนอัจฉริยะ", zh:"智慧学校" }, hint:{ en:"digital tools enrich what happens in class", th:"เครื่องมือดิจิทัลเสริมห้องเรียน", zh:"数字工具丰富课堂体验" } },
  { id:"liv6", dim:"living", emoji:"🚑", label:{ en:"Smart Ambulance", th:"รถพยาบาลอัจฉริยะ", zh:"智能救护" }, hint:{ en:"patient data sent ahead to the hospital", th:"ส่งข้อมูลผู้ป่วยไปโรงพยาบาลล่วงหน้า", zh:"患者数据提前发送至医院" } },
  { id:"liv7", dim:"living", emoji:"💊", label:{ en:"QR Healthcare", th:"บัตรสุขภาพ QR", zh:"QR医疗" }, hint:{ en:"scan a code, your health record appears", th:"สแกนโค้ด เห็นประวัติสุขภาพทั้งหมด", zh:"扫码即可查看完整健康档案" } },
  { id:"liv8", dim:"living", emoji:"🌱", label:{ en:"Urban Farm", th:"ฟาร์มในเมือง", zh:"城市农场" }, hint:{ en:"grow food inside the city limits", th:"ปลูกอาหารกินเองในเขตเมือง", zh:"在城市范围内种植食物" } },
  { id:"gov1", dim:"governance", emoji:"🗄️", label:{ en:"City Data Platform", th:"แพลตฟอร์มข้อมูลเมือง", zh:"城市数据平台" }, hint:{ en:"all city sensors talk to one single system", th:"เซนเซอร์ทุกตัวส่งข้อมูลมาที่เดียวกัน", zh:"所有城市传感器汇入同一系统" } },
  { id:"gov2", dim:"governance", emoji:"🔓", label:{ en:"Open Gov Data", th:"ข้อมูลรัฐเปิด", zh:"开放政府数据" }, hint:{ en:"the public can see what the city collects", th:"ประชาชนดูข้อมูลที่เมืองเก็บได้", zh:"公众可以查看城市收集的数据" } },
  { id:"gov3", dim:"governance", emoji:"📲", label:{ en:"Citizen App", th:"แอปประชาชน", zh:"市民应用" }, hint:{ en:"report a broken streetlight from your phone", th:"แจ้งไฟดับผ่านโทรศัพท์ทันที", zh:"用手机举报路灯故障" } },
  { id:"gov4", dim:"governance", emoji:"🖥️", label:{ en:"e-Government", th:"รัฐบาลอิเล็กทรอนิกส์", zh:"电子政务" }, hint:{ en:"renew your ID without queuing at all", th:"ต่ออายุบัตรโดยไม่ต้องต่อคิว", zh:"无需排队即可续办证件" } },
  { id:"gov5", dim:"governance", emoji:"📊", label:{ en:"City Dashboard", th:"แดชบอร์ดเมือง", zh:"城市仪表板" }, hint:{ en:"city performance is visible to every citizen", th:"ผลการดำเนินงานเมืองเห็นได้ทุกคน", zh:"城市绩效对每位市民透明可见" } },
  { id:"gov6", dim:"governance", emoji:"🔗", label:{ en:"Public API", th:"API สาธารณะ", zh:"公共API" }, hint:{ en:"developers can build apps on city data", th:"นักพัฒนาต่อยอดข้อมูลเมืองได้", zh:"开发者可在城市数据上构建应用" } },
  { id:"gov7", dim:"governance", emoji:"🗳️", label:{ en:"Participatory Budget", th:"งบฯ มีส่วนร่วม", zh:"参与式预算" }, hint:{ en:"citizens vote on how city money is spent", th:"ประชาชนโหวตกำหนดการใช้งบเมือง", zh:"市民投票决定城市资金用途" } },
  { id:"gov8", dim:"governance", emoji:"🔍", label:{ en:"Transparency Audit", th:"ตรวจสอบโปร่งใส", zh:"透明度审计" }, hint:{ en:"outsiders verify what the city claims", th:"บุคคลภายนอกตรวจสอบคำกล่าวอ้างเมือง", zh:"外部机构核实城市的陈述" } },
];

const DIM_COLORS: Record<SmartDimension,string> = { environment:"#2E7D32", economy:"#1565C0", mobility:"#6A1B9A", energy:"#E65100", people:"#00838F", living:"#C62828", governance:"#37474F" };
const DIM_LABELS: Record<SmartDimension,T3> = { environment:{en:"Environment",th:"สิ่งแวดล้อม",zh:"环境"}, economy:{en:"Economy",th:"เศรษฐกิจ",zh:"经济"}, mobility:{en:"Mobility",th:"การเดินทาง",zh:"出行"}, energy:{en:"Energy",th:"พลังงาน",zh:"能源"}, people:{en:"People",th:"พลเมือง",zh:"市民"}, living:{en:"Living",th:"การดำรงชีวิต",zh:"生活"}, governance:{en:"Governance",th:"การบริหาร",zh:"治理"} };
const DIM_EMOJIS: Record<SmartDimension,string> = { environment:"🌿", economy:"📈", mobility:"🚌", energy:"⚡", people:"👥", living:"🏠", governance:"🏛️" };
const DIMS: SmartDimension[] = ["environment","economy","mobility","energy","people","living","governance"];

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const a=[...arr]; let s=seed;
  for(let i=a.length-1;i>0;i--){s=(s*1664525+1013904223)&0xffffffff;const j=Math.abs(s)%(i+1);[a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function makeBoard(seed: number): BingoTerm[] {
  const s=seededShuffle(POOL,seed).slice(0,24);
  const FREE:BingoTerm={id:"FREE",dim:"governance",emoji:"🆓",label:{en:"FREE",th:"ฟรี",zh:"FREE"},hint:{en:"no guessing needed!",th:"ช่องนี้ไม่ต้องเดา!",zh:"这格不用猜！"}};
  return [...s.slice(0,12),FREE,...s.slice(12)];
}
function checkBingo(marked: Set<string>, board: BingoTerm[]): boolean {
  const ids=board.map(c=>c.id); const isM=(i:number)=>marked.has(ids[i]);
  for(let r=0;r<5;r++) if([0,1,2,3,4].every(c=>isM(r*5+c))) return true;
  for(let c=0;c<5;c++) if([0,1,2,3,4].every(r=>isM(r*5+c))) return true;
  if([0,6,12,18,24].every(isM)) return true;
  if([4,8,12,16,20].every(isM)) return true;
  return false;
}

export default function ScitiBingoPage({ locale }: Props) {
  const t=(copy:T3)=>translate(locale,copy);
  const [seed,setSeed]=useState(()=>Math.floor(Math.random()*1_000_000));
  const [board,setBoard]=useState<BingoTerm[]>(()=>makeBoard(seed));
  const [flippedIds,setFlippedIds]=useState<Set<string>>(new Set(["FREE"]));
  const [clickCount, setClickCount]=useState(0);
  const [targetDim, setTargetDim]=useState<SmartDimension|null>(null);
  const [calledDims,setCalledDims]=useState<SmartDimension[]>([]);
  const [animatingId, setAnimatingId]=useState<string|null>(null);
  const [won,setWon]=useState(false);

  const resetBoard=useCallback(()=>{
    const ns=Math.floor(Math.random()*1_000_000);
    setSeed(ns);
    setBoard(makeBoard(ns));
    setFlippedIds(new Set(["FREE"]));
    setClickCount(0);
    setCalledDims([]);
    setTargetDim(null);
    setWon(false);
  },[]);

  const callDimension=useCallback((dim:SmartDimension)=>{
    if(calledDims.includes(dim) || won)return;
    setCalledDims(prev=>[...prev,dim]);
    setTargetDim(dim);
  },[calledDims, won]);

  const handleCardClick=useCallback((cell:BingoTerm)=>{
    if(!targetDim || cell.id==="FREE" || flippedIds.has(cell.id) || animatingId || won) return;

    setClickCount(prev => prev + 1);

    if (targetDim && cell.dim === targetDim) {
      // Correct guess
      const nextFlipped = new Set(flippedIds).add(cell.id);
      setFlippedIds(nextFlipped);
      if(checkBingo(nextFlipped, board)) setWon(true);
    } else {
      // Wrong guess - transient flip
      setAnimatingId(cell.id);
      setTimeout(() => setAnimatingId(null), 1500);
    }
  },[flippedIds, animatingId, targetDim, board, won]);

  return (
    <div className="bingo-page">
      <section className="section bingo-header">
        <p className="eyebrow">SCITI 2026 · {t({en:"Workshop Game",th:"เกมเวิร์กช็อป",zh:"工作坊游戏"})}</p>
        <h1 className="bingo-title">SCITI Bingo</h1>
        <p className="bingo-sub">{t({en:"Use Stage Caller first. Correct cards stay open; wrong cards flip back. The center square counts every scored click.",th:"เริ่มจาก Stage Caller ก่อน การ์ดที่ถูกจะค้างไว้ การ์ดที่ผิดจะพลิกกลับ ช่องกลางนับทุกคลิกที่ใช้เล่น",zh:"先使用 Stage Caller。正确卡片保持打开，错误卡片会翻回；中央格记录每次有效点击。"})}</p>
        <div className="bingo-header-actions">
          <button className="cta-button" onClick={resetBoard}>↻ {t({en:"New Card",th:"การ์ดใหม่",zh:"新棋盘"})}</button>
          <span className="bingo-seed">#{seed.toString(16).toUpperCase().padStart(5,"0")}</span>
        </div>
      </section>
      {won&&(<div className="bingo-win-banner"><span className="bingo-win-text">🎉 BINGO! 🎉</span><span className="bingo-win-sub">{t({en:`Completed in ${clickCount} clicks`,th:`จบเกมใน ${clickCount} คลิก`,zh:`在 ${clickCount} 次点击中完成`})}</span><button className="bingo-win-reset" onClick={resetBoard}>{t({en:"Play again",th:"เล่นอีกครั้ง",zh:"再玩"})}</button></div>)}
      <div className="bingo-layout">
        <div className={`bingo-board-wrapper${!targetDim ? " bingo-board-wrapper-locked" : ""}`}>
          {!targetDim && (
            <p className="bingo-board-hint bingo-board-hint-top">
              {t({en:"Choose a Stage Caller dimension first. The cards unlock after the call.",th:"เลือกมิติจากผู้ประกาศก่อน แล้วการ์ดจึงจะเปิดให้เล่น",zh:"请先选择舞台主持呼叫的维度，之后卡片才会解锁。"})}
            </p>
          )}
          <div className="bingo-grid-5x5">
            {board.map((cell)=>{
              const isFlipped=flippedIds.has(cell.id);
              const isAnimating=animatingId===cell.id;
              const isFree=cell.id==="FREE";
              const color=DIM_COLORS[cell.dim];
              const showBack = !isFree && (isFlipped || isAnimating);
              const disabled = isFree || !targetDim || isFlipped || Boolean(animatingId) || won;

              return (
                <button
                  key={cell.id}
                  className={`bingo-cell5${showBack?" bingo-cell5-marked":""}${isFree?" bingo-cell5-free":""}${isAnimating?" bingo-cell5-wrong":""}${!targetDim&&!isFree?" bingo-cell5-waiting":""}`}
                  style={{borderColor:showBack?color:`${color}55`}}
                  onClick={()=>handleCardClick(cell)}
                  aria-pressed={showBack}
                  disabled={disabled}
                >
                  <div className="bingo-card-front">
                    {isFree ? (
                      <div className="bingo-free-content">
                        <span className="bingo-click-count">{clickCount}</span>
                        <span className="bingo-free-label">{t({en:"CLICKS",th:"คลิก",zh:"点击"})}</span>
                      </div>
                    ) : (
                      <>
                        <span className="bingo-cell5-emoji">{cell.emoji}</span>
                        <span className="bingo-cell5-text">{t(cell.label)}</span>
                        <span className="bingo-cell5-hint">{t(cell.hint)}</span>
                        <span className="bingo-cell5-dot" style={{background:color}}/>
                      </>
                    )}
                  </div>
                  {!isFree && (
                    <div className="bingo-card-back" style={{background:color}}>
                      <img src={DIM_LOGOS[cell.dim]} alt={`Smart ${t(DIM_LABELS[cell.dim])}`} className="bingo-logo-img" loading="lazy"/>
                      <span className="bingo-back-label">Smart {t(DIM_LABELS[cell.dim])}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
          <p className="bingo-board-hint">{t({en:"Find cards matching the moderator's call.",th:"ค้นหาการ์ดที่ตรงกับที่ผู้ประกาศบอก",zh:"找到与主持人呼叫匹配的卡片。"})}</p>
        </div>
        <aside className="bingo-stage-panel">
          <p className="bingo-stage-eyebrow">{t({en:"STAGE CALLER",th:"ผู้ประกาศเวที",zh:"舞台主持"})}</p>
          {!targetDim && (
            <div className="bingo-call-status">
              {t({en:"Choose the first dimension to start scoring flips.",th:"เลือกมิติแรกเพื่อเริ่มนับการพลิกการ์ด",zh:"选择第一个维度后开始计分翻牌。"})}
            </div>
          )}
          {targetDim && (
            <div className="bingo-last-called" style={{background:DIM_COLORS[targetDim]}}>
              <span className="bingo-last-emoji">{DIM_EMOJIS[targetDim]}</span>
              <div>
                <div className="bingo-last-called-label">{t({en:"Current Call:",th:"ประกาศปัจจุบัน:",zh:"当前呼叫："})}</div>
                <div className="bingo-last-called-dim">Smart {t(DIM_LABELS[targetDim])}</div>
              </div>
            </div>
          )}
          <div className="bingo-dim-buttons">
            {DIMS.map(dim=>{const called=calledDims.includes(dim);const active=targetDim===dim;return(
              <button key={dim} className={`bingo-dim-btn${called?" bingo-dim-btn-called":""}${active?" bingo-dim-btn-active":""}`} style={called?{background:DIM_COLORS[dim],borderColor:DIM_COLORS[dim],color:"#fff",opacity:active?1:.42}:{borderColor:DIM_COLORS[dim],color:DIM_COLORS[dim]}} onClick={()=>callDimension(dim)} disabled={called || won}>
                <span className="bingo-dim-emoji">{DIM_EMOJIS[dim]}</span>
                <span className="bingo-dim-name">Smart {t(DIM_LABELS[dim])}</span>
                {called&&<span className="bingo-dim-tick">✓</span>}
              </button>
            );})}
          </div>
          <div className="bingo-progress">
            <span className="bingo-progress-label">{t({en:`${calledDims.length} / 7 called`,th:`ประกาศแล้ว ${calledDims.length} / 7`,zh:`已呼叫 ${calledDims.length} / 7`})}</span>
            <div className="bingo-progress-bar"><div className="bingo-progress-fill" style={{width:`${(calledDims.length/7)*100}%`}}/></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
