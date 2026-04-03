import { useMemo } from "react";
import { allCities } from "./cityData";
import { summarizeCities } from "./cityCollections";
import type { Locale, SmartDimension } from "./types";
import { DIMENSION_LABELS } from "./types";

interface Props {
  locale: Locale;
  onNavigate: (path: string) => void;
}

function t(l: Locale, en: string, th: string, zh: string) {
  return l === "th" ? th : l === "zh" ? zh : en;
}

const DIMENSION_ICONS: Record<SmartDimension, string> = {
  economy: "\u{1F4C8}", energy: "\u{26A1}", environment: "\u{1F33F}",
  governance: "\u{1F3DB}", living: "\u{1F3E0}", mobility: "\u{1F68C}", people: "\u{1F465}",
};

const DIMENSION_DESCS: Record<SmartDimension, { en: string; th: string }> = {
  economy: { en: "How can technology help improve the economy and manage resources more efficiently?", th: "เทคโนโลยีช่วยปรับปรุงเศรษฐกิจและจัดการทรัพยากรให้มีประสิทธิภาพมากขึ้นได้อย่างไร?" },
  energy: { en: "How can conserving non-renewable energy be balanced with producing clean alternatives?", th: "การอนุรักษ์พลังงานที่ใช้แล้วหมดจะสมดุลกับการผลิตพลังงานสะอาดทดแทนได้อย่างไร?" },
  environment: { en: "How can the ecological quality of a sustainable urban environment be improved?", th: "จะปรับปรุงคุณภาพเชิงนิเวศของสิ่งแวดล้อมเมืองที่ยั่งยืนได้อย่างไร?" },
  governance: { en: "How can a digital system be designed where people benefit from open data and accountability?", th: "จะออกแบบระบบดิจิทัลที่ประชาชนได้ประโยชน์จากข้อมูลเปิดและความโปร่งใสได้อย่างไร?" },
  living: { en: "How can innovation improve quality of life, safety, and health for urban residents?", th: "นวัตกรรมจะช่วยปรับปรุงคุณภาพชีวิต ความปลอดภัย และสุขภาพของผู้อยู่อาศัยในเมืองได้อย่างไร?" },
  mobility: { en: "How can technology solve traffic problems so people travel conveniently and sustainably?", th: "เทคโนโลยีจะแก้ปัญหาจราจรเพื่อให้คนเดินทางสะดวกและยั่งยืนได้อย่างไร?" },
  people: { en: "How can skills be developed to boost creativity, decrease inequality, and create more jobs?", th: "จะพัฒนาทักษะเพื่อกระตุ้นความคิดสร้างสรรค์ ลดความเหลื่อมล้ำ และสร้างงานมากขึ้นได้อย่างไร?" },
};

const CERT_STEPS = [
  { en: "Apply", th: "สมัคร", desc: { en: "Municipality submits proposal with city master plan and smart city project blueprint.", th: "เทศบาลยื่นข้อเสนอพร้อมแผนแม่บทเมืองและพิมพ์เขียวโครงการเมืองอัจฉริยะ" } },
  { en: "Evaluate", th: "ประเมิน", desc: { en: "depa technical committee reviews across 7 dimensions. Field visits verify claims.", th: "คณะกรรมการเทคนิค depa ตรวจสอบ 7 มิติ ลงพื้นที่ตรวจสอบข้อเท็จจริง" } },
  { en: "Approve", th: "อนุมัติ", desc: { en: "National Smart City Committee chaired by Deputy PM reviews and approves.", th: "คณะกรรมการเมืองอัจฉริยะแห่งชาติ มีรองนายกรัฐมนตรีเป็นประธาน พิจารณาและอนุมัติ" } },
  { en: "Certify", th: "รับรอง", desc: { en: "City receives Smart City Local logo. Annual outcome reporting begins.", th: "เมืองได้รับตราสัญลักษณ์ Smart City Local เริ่มรายงานผลลัพธ์ประจำปี" } },
];

const BATCHES = [
  { batch: 1, year: "2019", cities: 15, label: { en: "Pioneers", th: "ผู้บุกเบิก" } },
  { batch: 2, year: "2021", cities: 15, label: { en: "Expansion", th: "ขยายผล" } },
  { batch: 3, year: "2023", cities: 6, label: { en: "Consolidation", th: "รวมพลัง" } },
  { batch: 4, year: "2025", cities: 1, label: { en: "Latest", th: "ล่าสุด" } },
];

// Photos from /public/photos/ and /public/Photos international/
const PHOTOS_WORKSHOP = [
  "/photos/IMG_7504.JPG", "/photos/IMG_6654.JPG", "/photos/IMG_6692.JPG",
  "/photos/IMG_1382.JPG", "/photos/IMG_1447.JPG",
];
const PHOTOS_INTL = [
  "/Photos international/20260317092525-_DON6841.jpg",
  "/Photos international/20260317093438-_DON6939.jpg",
  "/Photos international/Z03A9727-opq3949327416.jpg",
  "/Photos international/JSCF2025-2495.jpg",
];

export default function ProgramPage({ locale, onNavigate }: Props) {
  const stats = useMemo(() => summarizeCities(allCities), []);
  const dimensions: SmartDimension[] = ["environment", "economy", "mobility", "energy", "people", "living", "governance"];

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="section rankings-hero">
        <p className="eyebrow">{t(locale, "depa \u00b7 MDES \u00b7 Kingdom of Thailand", "depa \u00b7 \u0e01\u0e23\u0e30\u0e17\u0e23\u0e27\u0e07 DE \u00b7 \u0e23\u0e32\u0e0a\u0e2d\u0e32\u0e13\u0e32\u0e08\u0e31\u0e01\u0e23\u0e44\u0e17\u0e22", "depa \u00b7 MDES \u00b7 \u6cf0\u738b\u56fd")}</p>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 4.5vw, 3rem)" }}>
          {t(locale, "Smart City Thailand", "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e1b\u0e23\u0e30\u0e40\u0e17\u0e28\u0e44\u0e17\u0e22", "\u6cf0\u56fd\u667a\u6167\u57ce\u5e02")}
        </h1>
        <p className="hero-strapline">
          {t(locale,
            "A smart city is a process, not a result. No city reaches the status of a smart city by simply ticking boxes. Smart refers to the ability to comprehend, adapt, and transform \u2014 to cope with and improve the changing world. This is Thailand\u2019s national framework for building cities where citizens come first and technology stays in the background.",
            "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e04\u0e37\u0e2d\u0e01\u0e23\u0e30\u0e1a\u0e27\u0e19\u0e01\u0e32\u0e23 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c \u0e44\u0e21\u0e48\u0e21\u0e35\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e44\u0e2b\u0e19\u0e40\u0e1b\u0e47\u0e19\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e44\u0e14\u0e49\u0e41\u0e04\u0e48\u0e15\u0e34\u0e4a\u0e01\u0e16\u0e39\u0e01\u0e17\u0e38\u0e01\u0e0a\u0e48\u0e2d\u0e07 \u0e04\u0e33\u0e27\u0e48\u0e32 \u201c\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u201d \u0e2b\u0e21\u0e32\u0e22\u0e16\u0e36\u0e07\u0e04\u0e27\u0e32\u0e21\u0e2a\u0e32\u0e21\u0e32\u0e23\u0e16\u0e43\u0e19\u0e01\u0e32\u0e23\u0e40\u0e02\u0e49\u0e32\u0e43\u0e08 \u0e1b\u0e23\u0e31\u0e1a\u0e15\u0e31\u0e27 \u0e41\u0e25\u0e30\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07 \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e23\u0e31\u0e1a\u0e21\u0e37\u0e2d\u0e41\u0e25\u0e30\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e42\u0e25\u0e01\u0e17\u0e35\u0e48\u0e40\u0e1b\u0e25\u0e35\u0e48\u0e22\u0e19\u0e41\u0e1b\u0e25\u0e07\u0e44\u0e1b \u0e19\u0e35\u0e48\u0e04\u0e37\u0e2d\u0e01\u0e23\u0e2d\u0e1a\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e0a\u0e32\u0e15\u0e34\u0e02\u0e2d\u0e07\u0e44\u0e17\u0e22\u0e2a\u0e33\u0e2b\u0e23\u0e31\u0e1a\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e17\u0e35\u0e48\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19\u0e21\u0e32\u0e01\u0e48\u0e2d\u0e19 \u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e40\u0e1a\u0e37\u0e49\u0e2d\u0e07\u0e2b\u0e25\u0e31\u0e07",
            "\u667a\u6167\u57ce\u5e02\u662f\u4e00\u4e2a\u8fc7\u7a0b\uff0c\u4e0d\u662f\u7ed3\u679c\u3002\u6ca1\u6709\u57ce\u5e02\u53ef\u4ee5\u4ec5\u4ec5\u901a\u8fc7\u6253\u52fe\u5c31\u6210\u4e3a\u667a\u6167\u57ce\u5e02\u3002\u201c\u667a\u6167\u201d\u6307\u7684\u662f\u7406\u89e3\u3001\u9002\u5e94\u548c\u8f6c\u578b\u7684\u80fd\u529b\u3002\u8fd9\u662f\u6cf0\u56fd\u5efa\u8bbe\u4ee5\u5e02\u6c11\u4e3a\u5148\u3001\u6280\u672f\u9000\u5c45\u5e55\u540e\u7684\u57ce\u5e02\u7684\u56fd\u5bb6\u6846\u67b6\u3002"
          )}
        </p>
        <div className="hero-actions" style={{ marginTop: "1rem" }}>
          <a href="https://www.smartcitythailand.or.th/" target="_blank" rel="noopener noreferrer" className="cta-button">
            {t(locale, "Official website", "\u0e40\u0e27\u0e47\u0e1a\u0e44\u0e0b\u0e15\u0e4c\u0e17\u0e32\u0e07\u0e01\u0e32\u0e23", "\u5b98\u65b9\u7f51\u7ad9")} →
          </a>
          <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
            {t(locale, "View index rankings", "\u0e14\u0e39\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e14\u0e31\u0e0a\u0e19\u0e35", "\u67e5\u770b\u6392\u540d")}
          </button>
        </div>
      </section>

      {/* ─── THREE CONCEPTS (from Hitachi Review) ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Three concepts", "\u0e2a\u0e32\u0e21\u0e41\u0e19\u0e27\u0e04\u0e34\u0e14\u0e2b\u0e25\u0e31\u0e01", "\u4e09\u5927\u6982\u5ff5")}</p>
        <h2>{t(locale, "The DNA of Thai smart cities", "DNA \u0e02\u0e2d\u0e07\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e44\u0e17\u0e22", "\u6cf0\u56fd\u667a\u6167\u57ce\u5e02\u7684DNA")}</h2>
        <div className="program-concepts-grid">
          <div className="program-concept-card">
            <span className="program-concept-num">1</span>
            <h3>{t(locale, "Citizens at the center, technology in the background", "\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19\u0e2d\u0e22\u0e39\u0e48\u0e15\u0e23\u0e07\u0e01\u0e25\u0e32\u0e07 \u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e40\u0e1a\u0e37\u0e49\u0e2d\u0e07\u0e2b\u0e25\u0e31\u0e07", "\u5e02\u6c11\u5728\u4e2d\u5fc3\uff0c\u6280\u672f\u5728\u5e55\u540e")}</h3>
            <p>{t(locale,
              "Cities are for people. A smart city should not force residents to be hooked on smartphones 12 hours a day. Instead, it uses appropriate technology to enhance quality of life in the background \u2014 less travel time, worry-free healthcare, more spare time. The evidence of success lies in measurable outcomes, not hardware specs.",
              "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e21\u0e35\u0e44\u0e27\u0e49\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e04\u0e19 \u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e44\u0e21\u0e48\u0e04\u0e27\u0e23\u0e1a\u0e31\u0e07\u0e04\u0e31\u0e1a\u0e43\u0e2b\u0e49\u0e1c\u0e39\u0e49\u0e2d\u0e22\u0e39\u0e48\u0e2d\u0e32\u0e28\u0e31\u0e22\u0e15\u0e34\u0e14\u0e21\u0e37\u0e2d\u0e16\u0e37\u0e2d 12 \u0e0a\u0e31\u0e48\u0e27\u0e42\u0e21\u0e07\u0e15\u0e48\u0e2d\u0e27\u0e31\u0e19 \u0e41\u0e15\u0e48\u0e43\u0e0a\u0e49\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e17\u0e35\u0e48\u0e40\u0e2b\u0e21\u0e32\u0e30\u0e2a\u0e21\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e22\u0e01\u0e23\u0e30\u0e14\u0e31\u0e1a\u0e04\u0e38\u0e13\u0e20\u0e32\u0e1e\u0e0a\u0e35\u0e27\u0e34\u0e15\u0e43\u0e19\u0e40\u0e1a\u0e37\u0e49\u0e2d\u0e07\u0e2b\u0e25\u0e31\u0e07 \u0e2b\u0e25\u0e31\u0e01\u0e10\u0e32\u0e19\u0e04\u0e37\u0e2d\u0e1c\u0e25\u0e25\u0e31\u0e1e\u0e18\u0e4c\u0e17\u0e35\u0e48\u0e27\u0e31\u0e14\u0e44\u0e14\u0e49 \u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48\u0e2a\u0e40\u0e1b\u0e47\u0e01\u0e2e\u0e32\u0e23\u0e4c\u0e14\u0e41\u0e27\u0e23\u0e4c",
              "\u57ce\u5e02\u662f\u4e3a\u4eba\u800c\u5b58\u5728\u7684\u3002\u667a\u6167\u57ce\u5e02\u4e0d\u5e94\u8be5\u8feb\u4f7f\u5c45\u6c11\u6bcf\u5929\u76ef\u7740\u624b\u673a12\u5c0f\u65f6\u3002\u76f8\u53cd\uff0c\u5b83\u5728\u5e55\u540e\u4f7f\u7528\u9002\u5f53\u6280\u672f\u63d0\u5347\u751f\u6d3b\u8d28\u91cf\u3002"
            )}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">2</span>
            <h3>{t(locale, "People-Public-Private-Partnership (PPPP)", "\u0e04\u0e27\u0e32\u0e21\u0e23\u0e48\u0e27\u0e21\u0e21\u0e37\u0e2d \u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19-\u0e23\u0e31\u0e10-\u0e40\u0e2d\u0e01\u0e0a\u0e19 (PPPP)", "\u4eba\u6c11-\u653f\u5e9c-\u79c1\u8425\u5408\u4f5c (PPPP)")}</h3>
            <p>{t(locale,
              "Not PPP but PPPP. The extra P is for People. Recent successes and failures of smart city projects worldwide show the crucial need to communicate with citizens and galvanize their support. Without people in the equation, you build infrastructure nobody uses.",
              "\u0e44\u0e21\u0e48\u0e43\u0e0a\u0e48 PPP \u0e41\u0e15\u0e48\u0e40\u0e1b\u0e47\u0e19 PPPP P \u0e15\u0e31\u0e27\u0e40\u0e1e\u0e34\u0e48\u0e21\u0e04\u0e37\u0e2d\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19 \u0e04\u0e27\u0e32\u0e21\u0e2a\u0e33\u0e40\u0e23\u0e47\u0e08\u0e41\u0e25\u0e30\u0e04\u0e27\u0e32\u0e21\u0e25\u0e49\u0e21\u0e40\u0e2b\u0e25\u0e27\u0e02\u0e2d\u0e07\u0e42\u0e04\u0e23\u0e07\u0e01\u0e32\u0e23\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e17\u0e31\u0e48\u0e27\u0e42\u0e25\u0e01\u0e41\u0e2a\u0e14\u0e07\u0e43\u0e2b\u0e49\u0e40\u0e2b\u0e47\u0e19\u0e27\u0e48\u0e32 \u0e15\u0e49\u0e2d\u0e07\u0e2a\u0e37\u0e48\u0e2d\u0e2a\u0e32\u0e23\u0e01\u0e31\u0e1a\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19\u0e41\u0e25\u0e30\u0e23\u0e30\u0e14\u0e21\u0e1e\u0e25\u0e31\u0e07\u0e2a\u0e19\u0e31\u0e1a\u0e2a\u0e19\u0e38\u0e19\u0e02\u0e2d\u0e07\u0e1e\u0e27\u0e01\u0e40\u0e02\u0e32 \u0e44\u0e21\u0e48\u0e07\u0e31\u0e49\u0e19\u0e04\u0e38\u0e13\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e17\u0e35\u0e48\u0e44\u0e21\u0e48\u0e21\u0e35\u0e43\u0e04\u0e23\u0e43\u0e0a\u0e49",
              "\u4e0d\u662fPPP\u800c\u662fPPPP\u3002\u989d\u5916\u7684P\u662f\u4eba\u6c11\u3002\u6ca1\u6709\u4eba\u6c11\u53c2\u4e0e\uff0c\u4f60\u5efa\u7684\u57fa\u7840\u8bbe\u65bd\u6ca1\u4eba\u4f1a\u7528\u3002"
            )}</p>
          </div>
          <div className="program-concept-card">
            <span className="program-concept-num">3</span>
            <h3>{t(locale, "Simultaneous physical + digital development", "\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e01\u0e32\u0e22\u0e20\u0e32\u0e1e\u0e41\u0e25\u0e30\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25\u0e44\u0e1b\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e01\u0e31\u0e19", "\u7269\u7406+\u6570\u5b57\u540c\u6b65\u53d1\u5c55")}</h3>
            <p>{t(locale,
              "Cities still consist of connected physical spaces. Digital platforms are meaningless if goods and services cannot physically reach people. The simultaneous development of both physical infrastructure and digital systems is what makes a smart city actually function.",
              "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e22\u0e31\u0e07\u0e04\u0e07\u0e1b\u0e23\u0e30\u0e01\u0e2d\u0e1a\u0e14\u0e49\u0e27\u0e22\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e17\u0e32\u0e07\u0e01\u0e32\u0e22\u0e20\u0e32\u0e1e\u0e17\u0e35\u0e48\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e15\u0e48\u0e2d\u0e01\u0e31\u0e19 \u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25\u0e44\u0e21\u0e48\u0e21\u0e35\u0e04\u0e27\u0e32\u0e21\u0e2b\u0e21\u0e32\u0e22\u0e16\u0e49\u0e32\u0e2a\u0e34\u0e19\u0e04\u0e49\u0e32\u0e41\u0e25\u0e30\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e44\u0e1b\u0e16\u0e36\u0e07\u0e04\u0e19\u0e44\u0e21\u0e48\u0e44\u0e14\u0e49\u0e08\u0e23\u0e34\u0e07 \u0e01\u0e32\u0e23\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e41\u0e25\u0e30\u0e23\u0e30\u0e1a\u0e1a\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25\u0e44\u0e1b\u0e1e\u0e23\u0e49\u0e2d\u0e21\u0e01\u0e31\u0e19\u0e15\u0e48\u0e32\u0e07\u0e2b\u0e32\u0e01\u0e04\u0e37\u0e2d\u0e2a\u0e34\u0e48\u0e07\u0e17\u0e35\u0e48\u0e17\u0e33\u0e43\u0e2b\u0e49\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e17\u0e33\u0e07\u0e32\u0e19\u0e44\u0e14\u0e49\u0e08\u0e23\u0e34\u0e07",
              "\u57ce\u5e02\u4ecd\u7531\u8fde\u63a5\u7684\u7269\u7406\u7a7a\u95f4\u7ec4\u6210\u3002\u5982\u679c\u5546\u54c1\u548c\u670d\u52a1\u65e0\u6cd5\u5b9e\u9645\u5230\u8fbe\u4eba\u4eec\u8eab\u8fb9\uff0c\u6570\u5b57\u5e73\u53f0\u6beb\u65e0\u610f\u4e49\u3002"
            )}</p>
          </div>
        </div>
        <p className="program-source">{t(locale,
          "Source: Hitachi Review Vol. 70, No. 1 (2021) \u2014 Smart City Initiatives in Thailand, by Nimmanphatcharin, Prathombutr, Siddhichai, A, & Treethidtaphat",
          "\u0e17\u0e35\u0e48\u0e21\u0e32: Hitachi Review Vol. 70, No. 1 (2021) \u2014 Smart City Initiatives in Thailand \u0e42\u0e14\u0e22 \u0e13\u0e31\u0e10\u0e1e\u0e25, \u0e20\u0e32\u0e2a\u0e01\u0e23, \u0e28\u0e38\u0e20\u0e01\u0e23, \u0e13\u0e13, & \u0e27\u0e34\u0e0a\u0e31\u0e22",
          "\u6765\u6e90: Hitachi Review Vol. 70, No. 1 (2021)"
        )}</p>
      </section>

      {/* ─── PHOTO STRIP: Workshops ─── */}
      <div className="photo-strip">
        {PHOTOS_WORKSHOP.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "220px", height: "140px" }}>
            <img src={p} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── TWO-FIVE-SEVEN ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Two-Five-Seven", "\u0e2a\u0e2d\u0e07-\u0e2b\u0e49\u0e32-\u0e40\u0e08\u0e47\u0e14", "\u4e8c-\u4e94-\u4e03")}</p>
        <h2>{t(locale, "The mnemonic that drives the program", "\u0e2a\u0e39\u0e15\u0e23\u0e17\u0e35\u0e48\u0e02\u0e31\u0e1a\u0e40\u0e04\u0e25\u0e37\u0e48\u0e2d\u0e19\u0e42\u0e04\u0e23\u0e07\u0e01\u0e32\u0e23", "\u9a71\u52a8\u9879\u76ee\u7684\u53e3\u8bc0")}</h2>
        <div className="program-257-grid">
          <div className="program-257-card">
            <span className="program-257-num">2</span>
            <h3>{t(locale, "Two types of smart cities", "\u0e2a\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e40\u0e20\u0e17\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30", "\u4e24\u79cd\u667a\u6167\u57ce\u5e02")}</h3>
            <p><strong>{t(locale, "Smart Livable City", "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e19\u0e48\u0e32\u0e2d\u0e22\u0e39\u0e48", "\u667a\u6167\u5b9c\u5c45\u57ce\u5e02")}</strong> {t(locale, "\u2014 existing cities incorporating technology as needed by their specific contexts.", "\u2014 \u0e40\u0e21\u0e37\u0e2d\u0e07\u0e17\u0e35\u0e48\u0e21\u0e35\u0e2d\u0e22\u0e39\u0e48\u0e41\u0e25\u0e49\u0e27\u0e1c\u0e2a\u0e32\u0e19\u0e40\u0e17\u0e04\u0e42\u0e19\u0e42\u0e25\u0e22\u0e35\u0e15\u0e32\u0e21\u0e1a\u0e23\u0e34\u0e1a\u0e17\u0e40\u0e09\u0e1e\u0e32\u0e30", "\u2014 \u73b0\u6709\u57ce\u5e02\u6839\u636e\u5177\u4f53\u60c5\u5883\u878d\u5165\u6280\u672f\u3002")}</p>
            <p><strong>{t(locale, "Smart New City", "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e43\u0e2b\u0e21\u0e48", "\u667a\u6167\u65b0\u57ce")}</strong> {t(locale, "\u2014 greenfield/brownfield development aligned with national policies like the EEC.", "\u2014 \u0e1e\u0e31\u0e12\u0e19\u0e32\u0e1a\u0e19\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48\u0e43\u0e2b\u0e21\u0e48\u0e15\u0e32\u0e21\u0e19\u0e42\u0e22\u0e1a\u0e32\u0e22\u0e0a\u0e32\u0e15\u0e34 \u0e40\u0e0a\u0e48\u0e19 EEC", "\u2014 \u4e0e\u56fd\u5bb6\u653f\u7b56\uff08\u5982EEC\uff09\u5bf9\u9f50\u7684\u65b0\u57ce\u5f00\u53d1\u3002")}</p>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">5</span>
            <h3>{t(locale, "Five criteria for development", "\u0e2b\u0e49\u0e32\u0e40\u0e01\u0e13\u0e11\u0e4c\u0e01\u0e32\u0e23\u0e1e\u0e31\u0e12\u0e19\u0e32", "\u4e94\u9879\u53d1\u5c55\u6807\u51c6")}</h3>
            <ol className="program-criteria-list">
              <li>{t(locale, "Vision, goals, and geographic boundaries", "\u0e27\u0e34\u0e2a\u0e31\u0e22\u0e17\u0e31\u0e28\u0e19\u0e4c \u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22 \u0e41\u0e25\u0e30\u0e02\u0e2d\u0e1a\u0e40\u0e02\u0e15\u0e1e\u0e37\u0e49\u0e19\u0e17\u0e35\u0e48", "\u613f\u666f\u3001\u76ee\u6807\u548c\u5730\u7406\u8fb9\u754c")}</li>
              <li>{t(locale, "Infrastructure and investment plan", "\u0e41\u0e1c\u0e19\u0e42\u0e04\u0e23\u0e07\u0e2a\u0e23\u0e49\u0e32\u0e07\u0e1e\u0e37\u0e49\u0e19\u0e10\u0e32\u0e19\u0e41\u0e25\u0e30\u0e01\u0e32\u0e23\u0e25\u0e07\u0e17\u0e38\u0e19", "\u57fa\u7840\u8bbe\u65bd\u548c\u6295\u8d44\u8ba1\u5212")}</li>
              <li>{t(locale, "City Data Platform (CDP) + cybersecurity", "\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07 (CDP) + \u0e04\u0e27\u0e32\u0e21\u0e1b\u0e25\u0e2d\u0e14\u0e20\u0e31\u0e22\u0e44\u0e0b\u0e40\u0e1a\u0e2d\u0e23\u0e4c", "\u57ce\u5e02\u6570\u636e\u5e73\u53f0(CDP)+\u7f51\u7edc\u5b89\u5168")}</li>
              <li>{t(locale, "Urban systems and service projects", "\u0e23\u0e30\u0e1a\u0e1a\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e41\u0e25\u0e30\u0e42\u0e04\u0e23\u0e07\u0e01\u0e32\u0e23\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23", "\u57ce\u5e02\u7cfb\u7edf\u548c\u670d\u52a1\u9879\u76ee")}</li>
              <li>{t(locale, "Management model and public participation", "\u0e23\u0e39\u0e1b\u0e41\u0e1a\u0e1a\u0e01\u0e32\u0e23\u0e08\u0e31\u0e14\u0e01\u0e32\u0e23\u0e41\u0e25\u0e30\u0e01\u0e32\u0e23\u0e21\u0e35\u0e2a\u0e48\u0e27\u0e19\u0e23\u0e48\u0e27\u0e21", "\u7ba1\u7406\u6a21\u5f0f\u548c\u516c\u4f17\u53c2\u4e0e")}</li>
            </ol>
          </div>
          <div className="program-257-card">
            <span className="program-257-num">7</span>
            <h3>{t(locale, "Seven smart dimensions", "\u0e40\u0e08\u0e47\u0e14\u0e21\u0e34\u0e15\u0e34\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30", "\u4e03\u4e2a\u667a\u6167\u7ef4\u5ea6")}</h3>
            <div className="program-dims-grid">
              {dimensions.map(d => (
                <div key={d} className="program-dim-card">
                  <span className="program-dim-icon">{DIMENSION_ICONS[d]}</span>
                  <h3 className="program-dim-name">{DIMENSION_LABELS[locale][d]}</h3>
                  <p className="program-dim-desc">{locale === "th" ? DIMENSION_DESCS[d].th : DIMENSION_DESCS[d].en}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── PHOTO STRIP: International ─── */}
      <div className="photo-strip">
        {PHOTOS_INTL.map(p => (
          <div key={p} className="photo-strip-item" style={{ width: "280px", height: "170px" }}>
            <img src={p} alt="" loading="lazy" />
          </div>
        ))}
      </div>

      {/* ─── CERTIFICATION PROCESS ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Process", "\u0e01\u0e23\u0e30\u0e1a\u0e27\u0e19\u0e01\u0e32\u0e23", "\u6d41\u7a0b")}</p>
        <h2>{t(locale, "How a city gets the logo", "\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e44\u0e14\u0e49\u0e15\u0e23\u0e32\u0e2a\u0e31\u0e0d\u0e25\u0e31\u0e01\u0e29\u0e13\u0e4c\u0e2d\u0e22\u0e48\u0e32\u0e07\u0e44\u0e23", "\u57ce\u5e02\u5982\u4f55\u83b7\u5f97\u6807\u8bc6")}</h2>
        <div className="program-cert-flow">
          {CERT_STEPS.map((step, i) => (
            <div key={i} className="program-cert-step">
              <span className="program-cert-number">{i + 1}</span>
              <h3 className="program-cert-label">{locale === "th" ? step.th : step.en}</h3>
              <p className="program-cert-desc">{locale === "th" ? step.desc.th : step.desc.en}</p>
              {i < CERT_STEPS.length - 1 && <span className="program-cert-arrow">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ─── BATCH TIMELINE + KEY STATS ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <p className="eyebrow">{t(locale, "Timeline", "\u0e44\u0e17\u0e21\u0e4c\u0e44\u0e25\u0e19\u0e4c", "\u65f6\u95f4\u7ebf")}</p>
        <h2>{t(locale, "Four batches, eight years", "\u0e2a\u0e35\u0e48\u0e23\u0e38\u0e48\u0e19 \u0e41\u0e1b\u0e14\u0e1b\u0e35", "\u56db\u6279\u6b21\uff0c\u516b\u5e74")}</h2>
        <div className="program-batch-grid">
          {BATCHES.map(b => (
            <div key={b.batch} className="program-batch-card">
              <span className="program-batch-label">Batch {b.batch}</span>
              <span className="program-batch-year">{b.year}</span>
              <span className="program-batch-count">{b.cities} {t(locale, "cities", "\u0e40\u0e21\u0e37\u0e2d\u0e07", "\u57ce\u5e02")}</span>
              <span className="program-batch-tag">{locale === "th" ? b.label.th : b.label.en}</span>
            </div>
          ))}
        </div>

        <div className="program-stats-grid" style={{ marginTop: "1rem" }}>
          <div className="program-stat"><span className="program-stat-value">{stats.certified}</span><span className="program-stat-label">{t(locale, "Certified", "\u0e23\u0e31\u0e1a\u0e23\u0e2d\u0e07", "\u8ba4\u8bc1")}</span></div>
          <div className="program-stat"><span className="program-stat-value">173+</span><span className="program-stat-label">{t(locale, "Promotion zones", "\u0e40\u0e02\u0e15\u0e2a\u0e48\u0e07\u0e40\u0e2a\u0e23\u0e34\u0e21", "\u63a8\u5e7f\u533a")}</span></div>
          <div className="program-stat"><span className="program-stat-value">{stats.operational}</span><span className="program-stat-label">{t(locale, "Operational", "\u0e43\u0e0a\u0e49\u0e07\u0e32\u0e19\u0e08\u0e23\u0e34\u0e07", "\u8fd0\u884c\u4e2d")}</span></div>
          <div className="program-stat"><span className="program-stat-value">105</span><span className="program-stat-label">{t(locale, "Target by 2027", "\u0e40\u0e1b\u0e49\u0e32\u0e2b\u0e21\u0e32\u0e22 2570", "2027\u76ee\u6807")}</span></div>
          <div className="program-stat"><span className="program-stat-value">7</span><span className="program-stat-label">{t(locale, "Dimensions", "\u0e21\u0e34\u0e15\u0e34", "\u7ef4\u5ea6")}</span></div>
          <div className="program-stat"><span className="program-stat-value">15+</span><span className="program-stat-label">{t(locale, "Data sources", "\u0e41\u0e2b\u0e25\u0e48\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25", "\u6570\u636e\u6e90")}</span></div>
        </div>
      </section>

      {/* ─── CDP + Primer Source ─── */}
      <section className="section" style={{ marginBottom: "2rem" }}>
        <div className="callout-card" style={{ borderLeftColor: "var(--teal)" }}>
          <p className="eyebrow">{t(locale, "City Data Platform", "\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07", "\u57ce\u5e02\u6570\u636e\u5e73\u53f0")}</p>
          <h2>{t(locale, "CDP: the digital backbone", "CDP: \u0e01\u0e23\u0e30\u0e14\u0e39\u0e01\u0e2a\u0e31\u0e19\u0e2b\u0e25\u0e31\u0e07\u0e14\u0e34\u0e08\u0e34\u0e17\u0e31\u0e25", "CDP: \u6570\u5b57\u4e3b\u5e72")}</h2>
          <p>
            {t(locale,
              "The City Data Platform integrates the large amount of data in cities to give a holistic view of a city\u2019s condition so that services to meet citizen needs can be provided in real time. Collecting data from demand-side, supply-side, and analytical streams, CDP is one of the five criteria for Thailand\u2019s smart city development. This index is connected to 15+ government data sources including NSO, NESDC, PCD, GISTDA, BOI, and depa\u2019s citydata.in.th.",
              "\u0e41\u0e1e\u0e25\u0e15\u0e1f\u0e2d\u0e23\u0e4c\u0e21\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e1a\u0e39\u0e23\u0e13\u0e32\u0e01\u0e32\u0e23\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e08\u0e33\u0e19\u0e27\u0e19\u0e21\u0e2b\u0e32\u0e28\u0e32\u0e25\u0e43\u0e19\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e43\u0e2b\u0e49\u0e21\u0e38\u0e21\u0e21\u0e2d\u0e07\u0e20\u0e32\u0e1e\u0e23\u0e27\u0e21\u0e02\u0e2d\u0e07\u0e2a\u0e20\u0e32\u0e1e\u0e40\u0e21\u0e37\u0e2d\u0e07 \u0e40\u0e1e\u0e37\u0e48\u0e2d\u0e43\u0e2b\u0e49\u0e1a\u0e23\u0e34\u0e01\u0e32\u0e23\u0e15\u0e2d\u0e1a\u0e2a\u0e19\u0e2d\u0e07\u0e04\u0e27\u0e32\u0e21\u0e15\u0e49\u0e2d\u0e07\u0e01\u0e32\u0e23\u0e02\u0e2d\u0e07\u0e1b\u0e23\u0e30\u0e0a\u0e32\u0e0a\u0e19\u0e44\u0e14\u0e49\u0e41\u0e1a\u0e1a\u0e40\u0e23\u0e35\u0e22\u0e25\u0e44\u0e17\u0e21\u0e4c CDP \u0e04\u0e37\u0e2d\u0e2b\u0e19\u0e36\u0e48\u0e07\u0e43\u0e19\u0e2b\u0e49\u0e32\u0e40\u0e01\u0e13\u0e11\u0e4c\u0e01\u0e32\u0e23\u0e1e\u0e31\u0e12\u0e19\u0e32\u0e40\u0e21\u0e37\u0e2d\u0e07\u0e2d\u0e31\u0e08\u0e09\u0e23\u0e34\u0e22\u0e30\u0e02\u0e2d\u0e07\u0e44\u0e17\u0e22 \u0e14\u0e31\u0e0a\u0e19\u0e35\u0e19\u0e35\u0e49\u0e40\u0e0a\u0e37\u0e48\u0e2d\u0e21\u0e15\u0e48\u0e2d\u0e01\u0e31\u0e1a 15+ \u0e41\u0e2b\u0e25\u0e48\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e23\u0e32\u0e0a\u0e01\u0e32\u0e23",
              "CDP\u5c06\u57ce\u5e02\u5927\u91cf\u6570\u636e\u6574\u5408\uff0c\u63d0\u4f9b\u57ce\u5e02\u72b6\u51b5\u7684\u5168\u666f\u89c6\u56fe\uff0c\u4ee5\u4fbf\u5b9e\u65f6\u63d0\u4f9b\u6ee1\u8db3\u5e02\u6c11\u9700\u6c42\u7684\u670d\u52a1\u3002"
            )}
          </p>
          <div style={{ display: "flex", gap: ".4rem", marginTop: ".75rem", flexWrap: "wrap" }}>
            <button type="button" className="cta-button" onClick={() => onNavigate("/references")}>
              {t(locale, "View all data sources", "\u0e14\u0e39\u0e41\u0e2b\u0e25\u0e48\u0e07\u0e02\u0e49\u0e2d\u0e21\u0e39\u0e25\u0e17\u0e31\u0e49\u0e07\u0e2b\u0e21\u0e14", "\u67e5\u770b\u6240\u6709\u6570\u636e\u6765\u6e90")}
            </button>
            <button type="button" className="ghost-button" onClick={() => onNavigate("/rankings")}>
              {t(locale, "Explore city rankings", "\u0e2a\u0e33\u0e23\u0e27\u0e08\u0e2d\u0e31\u0e19\u0e14\u0e31\u0e1a\u0e40\u0e21\u0e37\u0e2d\u0e07", "\u63a2\u7d22\u57ce\u5e02\u6392\u540d")}
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
