import type { WeeklyDigest } from "./weeklyDigest";

export const WEEKLY_DIGEST_DATA: WeeklyDigest = {
  weekOf: "2026-10-25",
  trendingCity: {
    cityId: "chiang-mai-old-town",
    note: {
      en: "Use Chiang Mai's dossier to compare source years and geographic scope. A provincial annual air-quality figure does not tell you the air inside a particular room or whether that room is publicly accessible.",
      th: "ใช้แฟ้มเชียงใหม่เปรียบเทียบปีและขอบเขตพื้นที่ของข้อมูล ค่าคุณภาพอากาศรายปีระดับจังหวัดไม่ได้บอกคุณภาพอากาศภายในห้องใดห้องหนึ่ง หรือยืนยันว่าประชาชนเข้าใช้ห้องนั้นได้",
      zh: "查看清迈档案，比较数据年份与地理范围。省级年度空气质量数据无法说明某个房间内的空气状况，也不能证明该房间对公众开放。",
    },
  },
  trendingSearch: {
    phrase: {
      en: '"clean air room chiang mai"',
      th: '"ห้องปลอดฝุ่น เชียงใหม่"',
      zh: '"清迈防霾洁净室"',
    },
    deltaLabel: {
      en: "Editorial search suggestion; no search-volume or trend measurement is available here. Verify room-level readings and public access directly.",
      th: "คำค้นที่บรรณาธิการเสนอ ไม่มีข้อมูลปริมาณหรือแนวโน้มการค้นหาในระบบนี้ ควรตรวจค่าที่วัดในห้องและสิทธิการเข้าใช้โดยตรง",
      zh: "编辑建议的检索词；本站没有搜索量或趋势测量数据。请直接核查室内实测值与公众使用条件。",
    },
    lensId: "growth",
  },
  headline: {
    title: {
      en: "Integrated road-traffic death registry: annual source files",
      th: "ระบบบูรณาการข้อมูลการตายจากอุบัติเหตุทางถนน: ไฟล์ต้นทางรายปี",
      zh: "道路交通死亡综合登记系统：年度原始文件",
    },
    gloss: {
      en: "Open the government catalogue behind the road-death baseline. Choose the relevant year and check province definitions before comparing figures. Annual counts do not measure an individual's travel risk.",
      th: "เปิดบัญชีข้อมูลภาครัฐที่เป็นต้นทางของข้อมูลฐานการเสียชีวิตบนถนน เลือกปีและตรวจความหมายของจังหวัดก่อนเปรียบเทียบ จำนวนรายปีไม่ได้วัดความเสี่ยงในการเดินทางของแต่ละบุคคล",
      zh: "打开道路死亡基线所用的政府数据目录。比较前请选择相应年份并核查省份字段定义。年度计数不衡量个人出行风险。",
    },
    url: "https://data.go.th/dataset/rtddi",
  },
};
