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
    id: "depa-2023-ranking",
    title: {
      en: "depa certifies 30 smart cities across 23 Thai provinces in 2023 index",
      th: "depa รับรอง 30 เมืองอัจฉริยะใน 23 จังหวัดทั่วไทยในดัชนีปี 2566",
      zh: "depa在2023年指数中认证全泰23个省的30座智慧城市",
    },
    source: "depa.or.th",
    url: "https://www.depa.or.th/en/digitalservice/smartcity/goals-and-areas",
    date: "2024-01-15",
    tag: "thailand",
  },
  {
    id: "eec-investment",
    title: {
      en: "EEC investment approvals on track toward ฿1.35 trillion target by 2037",
      th: "การอนุมัติลงทุน EEC เดินหน้าสู่เป้า 1.35 ล้านล้านบาทภายในปี 2580",
      zh: "东部经济走廊投资审批朝2037年1.35万亿泰铢目标推进",
    },
    source: "BOI Thailand",
    url: "https://www.boi.go.th/en/index/",
    date: "2024-03-08",
    tag: "thailand",
  },
  {
    id: "chiangmai-air",
    title: {
      en: "Chiang Mai expands to 50+ IoT air-quality sensors ahead of haze season",
      th: "เชียงใหม่ขยายเครือข่ายเซ็นเซอร์คุณภาพอากาศ IoT กว่า 50 จุดก่อนฤดูหมอกควัน",
      zh: "清迈在霾季前将物联网空气质量传感器扩展至50个以上",
    },
    source: "GISTDA",
    url: "https://www.gistda.or.th",
    date: "2024-02-20",
    tag: "thailand",
  },
  {
    id: "singapore-smart-nation",
    title: {
      en: "Singapore launches Smart Nation 2.0 — digital infrastructure as national infrastructure",
      th: "สิงคโปร์เปิดตัว Smart Nation 2.0 — โครงสร้างพื้นฐานดิจิทัลในฐานะโครงสร้างพื้นฐานแห่งชาติ",
      zh: "新加坡推出智慧国家2.0——将数字基础设施定位为国家基础设施",
    },
    source: "GovTech Singapore",
    url: "https://www.tech.gov.sg/media/technews/smart-nation-2-0/",
    date: "2024-10-04",
    tag: "international",
  },
  {
    id: "eu-smart-cities",
    title: {
      en: "EU Smart Cities Marketplace reaches 300+ member cities in 2024 annual report",
      th: "EU Smart Cities Marketplace มีสมาชิกเกิน 300 เมืองในรายงานประจำปี 2567",
      zh: "欧盟智慧城市市场平台在2024年度报告中达到300+成员城市",
    },
    source: "European Commission",
    url: "https://smart-cities-marketplace.ec.europa.eu",
    date: "2024-09-12",
    tag: "international",
  },
  {
    id: "seoul-digital-twin",
    title: {
      en: "Seoul's S-Map digital twin now covers entire city — 25M residents, real-time",
      th: "ดิจิทัลทวิน S-Map ของโซลครอบคลุมทั้งเมืองแล้ว — 25 ล้านคน แบบเรียลไทม์",
      zh: "首尔S-Map数字孪生城市现已覆盖全市——2500万居民实时数据",
    },
    source: "Seoul Metropolitan Government",
    url: "https://smap.seoul.go.kr",
    date: "2024-07-22",
    tag: "tech",
  },
  {
    id: "adb-asean-smartcity",
    title: {
      en: "ADB: ASEAN smart city investment surpassed $45 billion in 2023",
      th: "ADB: การลงทุนเมืองอัจฉริยะอาเซียนแตะ 4.5 หมื่นล้านดอลลาร์ในปี 2566",
      zh: "亚行：东盟智慧城市投资2023年超过450亿美元",
    },
    source: "Asian Development Bank",
    url: "https://www.adb.org/what-we-do/topics/smart-cities",
    date: "2024-04-18",
    tag: "international",
  },
  {
    id: "pdpa-compliance",
    title: {
      en: "Thailand PDPA enforcement picks up pace — smart city data governance under review",
      th: "การบังคับใช้ PDPA ไทยเร่งตัวขึ้น — ธรรมาภิบาลข้อมูลเมืองอัจฉริยะอยู่ระหว่างการทบทวน",
      zh: "泰国PDPA执法加速——智慧城市数据治理面临审查",
    },
    source: "ETDA Thailand",
    url: "https://www.etda.or.th/en",
    date: "2024-06-03",
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
