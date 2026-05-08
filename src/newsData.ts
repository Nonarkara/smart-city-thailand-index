// ---------------------------------------------------------------------------
// Smart City News — curated items for the homepage news strip.
// Update this file weekly (or whenever) to keep items fresh.
// Each item is trilingual. Tags drive color-coding.
// ---------------------------------------------------------------------------

export type NewsTag = "policy" | "tech" | "thailand" | "international";

export interface NewsItem {
  id: string;
  title: { en: string; th: string; zh: string };
  source: string;
  url: string;
  date: string;          // ISO date string, e.g. "2024-11-15"
  tag: NewsTag;
}

export const NEWS_ITEMS: NewsItem[] = [
  {
    id: "depa-2026-certification",
    title: {
      en: "depa shortlists 12 sub-districts for 2026 Smart City Promotion Zone certification",
      th: "depa คัดเลือก 12 ตำบลเข้ารับการรับรองเขตส่งเสริมเมืองอัจฉริยะ ประจำปี 2569",
      zh: "depa 将 12 个分区列入 2026 年度智慧城市推广区认证候选名单",
    },
    source: "depa.or.th",
    url: "https://www.depa.or.th/en/smartcity",
    date: "2026-04-10",
    tag: "thailand",
  },
  {
    id: "khon-kaen-lrt-milestone",
    title: {
      en: "Khon Kaen Light Rail hits 60% construction milestone — Phase 1 trial ops target late 2027",
      th: "รถไฟฟ้ารางเบาขอนแก่น คืบหน้า 60% — เป้าทดสอบเดินรถระยะที่ 1 ปลายปี 2570",
      zh: "孔敬轻轨施工进度达 60%——第一期试运营目标定于 2027 年底",
    },
    source: "State Railway of Thailand",
    url: "https://www.railway.co.th",
    date: "2026-04-28",
    tag: "thailand",
  },
  {
    id: "bangkok-ai-traffic",
    title: {
      en: "Bangkok integrates 1,200 CCTV feeds into AI traffic management platform across all districts",
      th: "กรุงเทพฯ เชื่อมกล้องวงจรปิด 1,200 จุดเข้าแพลตฟอร์ม AI บริหารจัดการจราจรครอบคลุมทุกเขต",
      zh: "曼谷将 1,200 个摄像头接入 AI 交通管理平台，覆盖全市各区",
    },
    source: "Bangkok Metropolitan Administration",
    url: "https://www.bangkok.go.th",
    date: "2026-03-14",
    tag: "thailand",
  },
  {
    id: "singapore-sn2-live",
    title: {
      en: "Singapore Smart Nation 2.0 enters full operation — digital ID and health-data portability live",
      th: "สิงคโปร์ Smart Nation 2.0 เปิดตัวเต็มรูปแบบ — ระบบ Digital ID และพกพาข้อมูลสุขภาพใช้งานได้แล้ว",
      zh: "新加坡智慧国家 2.0 全面投入运营——数字身份证与健康数据互通正式上线",
    },
    source: "GovTech Singapore",
    url: "https://www.tech.gov.sg",
    date: "2025-11-18",
    tag: "international",
  },
  {
    id: "itu-index-2025",
    title: {
      en: "ITU Global Smart City Index 2025: Singapore #1, Seoul #2 — Bangkok enters the top 50",
      th: "ดัชนีเมืองอัจฉริยะโลก ITU 2025: สิงคโปร์ #1 โซล #2 — กรุงเทพฯ ติด 50 อันดับแรกเป็นครั้งแรก",
      zh: "ITU 全球智慧城市指数 2025：新加坡第 1、首尔第 2——曼谷首次跻身前 50",
    },
    source: "ITU",
    url: "https://www.itu.int/en/ITU-T/ssc/Pages/default.aspx",
    date: "2025-12-10",
    tag: "international",
  },
  {
    id: "seoul-ai-commute",
    title: {
      en: "Seoul's AI traffic-signal system cuts average commute 11% in first full-city rollout",
      th: "ระบบสัญญาณจราจร AI ของโซลลดเวลาเดินทางเฉลี่ย 11% หลังติดตั้งครบทั้งเมือง",
      zh: "首尔 AI 交通信号系统全市铺开后平均通勤时间缩短 11%",
    },
    source: "Seoul Metropolitan Government",
    url: "https://smart.seoul.go.kr",
    date: "2025-09-22",
    tag: "tech",
  },
  {
    id: "asean-scn-roadmap",
    title: {
      en: "ASEAN Smart Cities Network publishes 2025–2030 Strategic Road Map — 26 pilots, climate resilience focus",
      th: "เครือข่ายเมืองอัจฉริยะอาเซียน เผยแผนยุทธศาสตร์ 2568–2573 — 26 เมืองนำร่อง เน้นภูมิคุ้มกันสภาพภูมิอากาศ",
      zh: "东盟智慧城市网络发布 2025—2030 年战略路线图——26 个试点城市，聚焦气候韧性",
    },
    source: "ASEAN Secretariat",
    url: "https://asean.org/asean-smart-cities-network/",
    date: "2025-10-06",
    tag: "policy",
  },
  {
    id: "thailand-data-governance",
    title: {
      en: "Thai Cabinet approves Smart City Data Governance Framework — PDPA-aligned protocols now mandatory",
      th: "ครม. ไทยอนุมัติกรอบธรรมาภิบาลข้อมูลเมืองอัจฉริยะ — โปรโตคอลที่สอดคล้อง PDPA บังคับใช้แล้ว",
      zh: "泰国内阁批准智慧城市数据治理框架——符合 PDPA 的数据协议正式强制执行",
    },
    source: "NECTEC / Thai Government",
    url: "https://www.nectec.or.th",
    date: "2026-02-19",
    tag: "policy",
  },
];

export const TAG_COLORS: Record<NewsTag, string> = {
  thailand: "var(--teal)",
  international: "var(--gold)",
  tech: "var(--sky, #0EA5E9)",
  policy: "var(--indigo, #6366F1)",
};

export const TAG_LABELS: Record<NewsTag, { en: string; th: string; zh: string }> = {
  thailand: { en: "Thailand", th: "ไทย", zh: "泰国" },
  international: { en: "International", th: "นานาชาติ", zh: "国际" },
  tech: { en: "Technology", th: "เทคโนโลยี", zh: "技术" },
  policy: { en: "Policy", th: "นโยบาย", zh: "政策" },
};
