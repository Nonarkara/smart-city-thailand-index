export interface RagBeat {
  id: "query" | "retrieval" | "source" | "verdict";
  stepNumber: number;
  tag: string;
  startTime: number;
  endTime: number;
  title: { en: string; th: string; zh: string };
  lead: { en: string; th: string; zh: string };
  details: { en: string[]; th: string[]; zh: string[] };
  metric: { label: { en: string; th: string; zh: string }; value: string };
}

export const RAG_EXPLAINER_TOTAL_DURATION = 14.0; // 14 seconds total (3.5s per beat)

export const RAG_BEATS: RagBeat[] = [
  {
    id: "query",
    stepNumber: 1,
    tag: "QUERY_INPUT",
    startTime: 0.0,
    endTime: 3.5,
    title: {
      en: "1. Question Formulation & Intent Scope",
      th: "1. การตั้งคำถามหลักฐานและขอบเขตความหมาย",
      zh: "1. 证据提问与语义范围解析",
    },
    lead: {
      en: "An investor queries ground truth: 'Does Chiang Mai have verified IoT air sensor coverage or only provincial PM2.5 baseline estimates?'",
      th: "นักลงทุนสอบถามสภาพจริง: 'เชียงใหม่มีโครงข่ายเซนเซอร์อากาศ IoT ที่ตรวจยืนยันในพื้นที่จริง หรือมีเพียงค่าประมาณฐาน PM2.5 ระดับจังหวัด?'",
      zh: "投资者查询真实实地情况：'清迈具备经实地核验的 IoT 空气传感器网络，还是仅有省级 PM2.5 基线估算？'",
    },
    details: {
      en: [
        "Intent parsed: Smart Environment pillar (IoT Air Quality telemetry)",
        "Geographic scope isolated: Municipal boundary (CNX) vs. Provincial macro baseline",
        "Verification bar: Defensible empirical evidence, excluding vendor marketing claims",
      ],
      th: [
        "วิเคราะห์เจตนา: เสาหลัก Smart Environment (ข้อมูลโทรมาตรคุณภาพอากาศ IoT)",
        "แยกแยะขอบเขตภูมิศาสตร์: เขตเทศบาลนครเชียงใหม่ เทียบกับ ค่าฐานระดับจังหวัด",
        "เกณฑ์การตรวจสอบ: หลักฐานเชิงประจักษ์ที่ยืนยันได้ ไม่นับคำโฆษณาของผู้ค้า",
      ],
      zh: [
        "意图解析：智慧环境维度（IoT 空气质量遥测数据）",
        "地理范围剥离：清迈市辖区边界对比清迈府宏观基线",
        "核查准则：可抗辩的实地证据，排除商业宣传论述",
      ],
    },
    metric: {
      label: { en: "Semantic Target", th: "เป้าหมายการสืบค้น", zh: "检索实体" },
      value: "CNX · ENV-03",
    },
  },
  {
    id: "retrieval",
    stepNumber: 2,
    tag: "MULTI_INDEX_SCAN",
    startTime: 3.5,
    endTime: 7.0,
    title: {
      en: "2. Multi-Index & Cross-Source Retrieval",
      th: "2. การสืบค้นดัชนีและเชื่อมโยงแหล่งข้อมูลหลายมิติ",
      zh: "2. 多重索引与跨源检索扫描",
    },
    lead: {
      en: "Deterministic scan across 118 city dossiers, 15 official baseline registries, depa gazette notices, and satellite observation feeds.",
      th: "สแกนเชิงกำหนดข้ามแฟ้มข้อมูล 118 เมือง ทะเบียนข้อมูลฐานทางการ 15 ชุด ประกาศเขต depa และข้อมูลภาพถ่ายดาวเทียม",
      zh: "确定性扫描 118 座城市档案、15 个官方基线名录、depa 指定区域公告以及卫星监测流。",
    },
    details: {
      en: [
        "Filtered 118 city records → 1 primary candidate match (CMU Smart City / CNX)",
        "Retrieved 3 baseline series: PCD Ground Stations, GISTDA Satellite AOD, NESDC Provincial Indicators",
        "Honesty separation: Formal depa recognition certificates separated from operational telemetry",
      ],
      th: [
        "กรองข้อมูล 118 เมือง → พบ 1 แฟ้มที่ตรงเป้าหมาย (CMU Smart City / เชียงใหม่)",
        "ดึงข้อมูลฐาน 3 ชุด: สถานีตรวจวัดกรมควบคุมมลพิษ, ดาวเทียม GISTDA, สถิติสิ่งแวดล้อม สศช.",
        "แยกแยะตามข้อเท็จจริง: ใบรับรองเมืองอัจฉริยะไม่ถูกนับรวมเป็นการเปิดใช้งานระบบจริง",
      ],
      zh: [
        "筛选 118 座城市记录 → 锁定 1 个主要目标（清迈大学智慧城市 / 清迈）",
        "调取 3 套基线序列：污染控制厅地面站、GISTDA 卫星光学厚度、国发局省级环境统计",
        "真实性剥离：官方认证证书与实际运营监测流严格区分",
      ],
    },
    metric: {
      label: { en: "Registry Corpus", th: "คลังข้อมูลที่ตรวจ", zh: "检索语料" },
      value: "118 Cities · 15 Sources",
    },
  },
  {
    id: "source",
    stepNumber: 3,
    tag: "PROVENANCE_CHECK",
    startTime: 7.0,
    endTime: 10.5,
    title: {
      en: "3. Source Grounding & Gap Isolation",
      th: "3. การตรวจหลักฐานอ้างอิงและการแยกแยะช่องว่างข้อมูล",
      zh: "3. 证据溯源与缺口隔离核验",
    },
    lead: {
      en: "Every candidate record is audited against its baseline cutoff date (2026-04-04), spatial resolution, and accountable agency operator.",
      th: "ทุกข้อมูลที่ดึงมาจะถูกตรวจสอบกับวันตัดข้อมูล (2026-04-04) ความละเอียดเชิงพื้นที่ และหน่วยงานผู้รับผิดชอบ",
      zh: "对调取的每项数据核查基线截止期（2026-04-04）、空间分辨率与责任机构。",
    },
    details: {
      en: [
        "Provincial observation confirmed: Official PCD monitoring stations in Mueang Chiang Mai",
        "Critical boundary gap isolated: Provincial ambient air series ≠ municipal IoT sensor grid",
        "Zero-hallucination law: Missing municipal sensor telemetry flagged as an explicit gap, never estimated",
      ],
      th: [
        "ยืนยันข้อมูลระดับจังหวัด: มีสถานีตรวจวัด คพ. ทางการใน อ.เมือง เชียงใหม่",
        "พบช่องว่างขอบเขตสำคัญ: ข้อมูลบรรยากาศจังหวัด ≠ โครงข่ายเซนเซอร์ระดับเทศบาล",
        "กฎปราศจากการคาดเดา: การไม่มีข้อมูลเซนเซอร์ในพื้นที่ระบุเป็นช่องว่างชัดเจน ไม่แปลงเป็นศูนย์และไม่เดา",
      ],
      zh: [
        "确认省级观测：清迈直辖县设有官方地面空气监测站",
        "识别关键边界差异：省级宏观监测 ≠ 市政级 IoT 传感器网格",
        "反虚构法则：缺失的本地数据明确标注为缺口，绝不记为零分或随意估算",
      ],
    },
    metric: {
      label: { en: "Audit Cutoff", th: "วันตัดรอบตรวจ", zh: "基线截止" },
      value: "2026-04-04 ISO",
    },
  },
  {
    id: "verdict",
    stepNumber: 4,
    tag: "DEFENSIBLE_VERDICT",
    startTime: 10.5,
    endTime: 14.0,
    title: {
      en: "4. Defensible Synthesis & Actionable Verdict",
      th: "4. บทสรุปเชิงสังเคราะห์ที่หนักแน่นและตรวจสอบได้",
      zh: "4. 可抗辩综合结论与行动指引",
    },
    lead: {
      en: "A factual, grounded response is generated with direct citations, provenance links, and explicit boundary disclosures.",
      th: "สร้างคำตอบที่มีหลักฐานอ้างอิงชัดเจน เชื่อมโยงแหล่งที่มา และระบุข้อจำกัดอย่างตรงไปตรงมา",
      zh: "生成附带直接引注、溯源链接和明确边界警示的事实结论。",
    },
    details: {
      en: [
        "Verified Finding: Provincial ambient air baseline established (Score: 68/100, PCD/GISTDA series)",
        "Explicit Disclosure: Municipal-scale real-time IoT sensor network unverified; requires field audit",
        "Decision Utility: Capital allocators see what is empirically measured versus what remains unknown",
      ],
      th: [
        "ข้อสรุปที่ยืนยัน: ข้อมูลฐานอากาศระดับจังหวัดมีอยู่จริง (คะแนน: 68/100, อิง คพ./GISTDA)",
        "ข้อจำกัดชัดเจน: เครือข่ายเซนเซอร์ IoT ระดับเทศบาลแบบเรียลไทม์ยังไม่ยืนยัน ต้องตรวจประเมินพื้นที่จริง",
        "ประโยชน์การตัดสินใจ: ผู้จัดสรรทุนเห็นชัดเจนว่าส่วนใดมีข้อมูลวัดได้ และส่วนใดยังไม่ทราบ",
      ],
      zh: [
        "核实结论：确认省级环境空气基线（得分 68/100，来源 污染控制厅/GISTDA 序列）",
        "明确保留：市政级实时 IoT 传感器网格尚未实证核验，需实地尽职调查",
        "决策价值：资本配置者清楚知晓哪些已有实测、哪些仍属未知",
      ],
    },
    metric: {
      label: { en: "Verification Status", th: "สถานะการยืนยัน", zh: "核实状态" },
      value: "Provincial Verified · Grid Open",
    },
  },
];

export function getBeatForTime(seconds: number): RagBeat {
  const clamped = Math.max(0, Math.min(seconds, RAG_EXPLAINER_TOTAL_DURATION));
  for (const beat of RAG_BEATS) {
    if (clamped >= beat.startTime && clamped < beat.endTime) {
      return beat;
    }
  }
  return RAG_BEATS[RAG_BEATS.length - 1];
}

export function formatPlaybackTime(seconds: number): string {
  const clamped = Math.max(0, Math.min(seconds, RAG_EXPLAINER_TOTAL_DURATION));
  const mins = Math.floor(clamped / 60);
  const secs = Math.floor(clamped % 60);
  const tenths = Math.floor((clamped % 1) * 10);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}.${tenths}`;
}
