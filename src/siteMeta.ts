import { getCitySummaryById } from "./cityCdp";
import { parseRoute, type Route } from "./routing";
import type { Locale } from "./types";

const SITE_NAME = "Smart City Thailand Index (SCITI)";
const SHARE_IMAGE_PATH = "/smart_city_thailand_logo.jpg";

const defaultDescriptions: Record<Locale, string> = {
  en: "Thailand's smart city index focused on real outcomes, not paper plans. Explore rankings, methodology, and detailed city profiles.",
  th: "ดัชนีเมืองอัจฉริยะไทยที่วัดจากผลลัพธ์จริง ไม่ใช่แผนบนกระดาษ สำรวจอันดับ วิธีการ และโปรไฟล์เมืองแบบละเอียด",
  zh: "以真实结果而非纸上规划为核心的泰国智慧城市指数。查看排名、方法论与城市详情。",
};

const routeTitles: Record<Route["kind"], Record<Locale, string>> = {
  home: {
    en: `${SITE_NAME} | Reality Check`,
    th: `${SITE_NAME} | วัดจากความจริง`,
    zh: `${SITE_NAME} | 真实校验`,
  },
  rankings: {
    en: `${SITE_NAME} | Rankings`,
    th: `${SITE_NAME} | การจัดอันดับ`,
    zh: `${SITE_NAME} | 排名`,
  },
  methodology: {
    en: `${SITE_NAME} | Methodology`,
    th: `${SITE_NAME} | วิธีการ`,
    zh: `${SITE_NAME} | 方法论`,
  },
  story: {
    en: `${SITE_NAME} | Story`,
    th: `${SITE_NAME} | เรื่องราว`,
    zh: `${SITE_NAME} | 故事`,
  },
  why: {
    en: `${SITE_NAME} | Why This Index`,
    th: `${SITE_NAME} | ทำไมต้องมีดัชนีนี้`,
    zh: `${SITE_NAME} | 为什么需要这个指数`,
  },
  showcase: {
    en: `${SITE_NAME} | Showcase — Nakhon Si Thammarat`,
    th: `${SITE_NAME} | ต้นแบบ — นครศรีธรรมราช`,
    zh: `${SITE_NAME} | 样板 — 那空是贪玛叻`,
  },
  map: {
    en: `${SITE_NAME} | City Map Dashboard`,
    th: `${SITE_NAME} | แผนที่เมืองอัจฉริยะ`,
    zh: `${SITE_NAME} | 城市地图仪表盘`,
  },
  asus: {
    en: `${SITE_NAME} | UN-Habitat ASUS Project`,
    th: `${SITE_NAME} | โครงการ ASUS UN-Habitat`,
    zh: `${SITE_NAME} | 联合国人居署ASUS项目`,
  },
  audit: {
    en: `${SITE_NAME} | depa Performance Audit`,
    th: `${SITE_NAME} | ตรวจสอบผลงาน depa`,
    zh: `${SITE_NAME} | depa绩效审计`,
  },
  partners: {
    en: `${SITE_NAME} | International Partnerships`,
    th: `${SITE_NAME} | ความร่วมมือระหว่างประเทศ`,
    zh: `${SITE_NAME} | 国际合作`,
  },
  program: {
    en: `${SITE_NAME} | Smart City Thailand Program`,
    th: `${SITE_NAME} | โครงการเมืองอัจฉริยะประเทศไทย`,
    zh: `${SITE_NAME} | 泰国智慧城市计划`,
  },
  knowledge: {
    en: `${SITE_NAME} | Knowledge Base`,
    th: `${SITE_NAME} | คลังความรู้`,
    zh: `${SITE_NAME} | 知识库`,
  },
  discover: {
    en: `${SITE_NAME} | What Is Your City?`,
    th: `${SITE_NAME} | เมืองของคุณคือเมืองไหน?`,
    zh: `${SITE_NAME} | 你的城市是哪座？`,
  },
  references: {
    en: `${SITE_NAME} | APIs, Data Sources & Standards`,
    th: `${SITE_NAME} | API แหล่งข้อมูล และมาตรฐาน`,
    zh: `${SITE_NAME} | API、数据来源与标准`,
  },
  invest: {
    en: `${SITE_NAME} | Invest Thailand`,
    th: `${SITE_NAME} | ลงทุนประเทศไทย`,
    zh: `${SITE_NAME} | 投资泰国`,
  },
  city: {
    en: `${SITE_NAME} | City Profile`,
    th: `${SITE_NAME} | โปรไฟล์เมือง`,
    zh: `${SITE_NAME} | 城市档案`,
  },
};

export type ApiResponse = {
  setHeader: (name: string, value: string) => void;
  status: (code: number) => {
    json: (body: ApiEnvelope<unknown>) => void;
    send?: (body: string) => void;
  };
};

export type ApiEnvelope<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
  requestId: string;
  timestamp: string;
};

function ensureMeta(selector: string, create: () => HTMLElement): HTMLElement {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

function setMetaByName(name: string, content: string) {
  const tag = ensureMeta(`meta[name="${name}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    return meta;
  });
  tag.setAttribute("content", content);
}

function setMetaByProperty(property: string, content: string) {
  const tag = ensureMeta(`meta[property="${property}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    return meta;
  });
  tag.setAttribute("content", content);
}

function setCanonical(url: string) {
  const link = ensureMeta('link[rel="canonical"]', () => {
    const canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    return canonical;
  });
  link.setAttribute("href", url);
}

function getSiteUrl() {
  const configured = import.meta.env.VITE_PUBLIC_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }
  return window.location.origin;
}

function buildMeta(route: Route, locale: Locale) {
  const title = routeTitles[route.kind][locale];
  const description = defaultDescriptions[locale];
  const siteUrl = getSiteUrl();
  const path = route.path === "/" ? "" : route.path;
  const canonicalUrl = `${siteUrl}${path}`;

  if (route.kind !== "city") {
    return { title, description, canonicalUrl };
  }

  const city = getCitySummaryById(route.cityId);
  if (!city) {
    return { title, description, canonicalUrl };
  }

  const cityName = locale === "th" ? city.nameTh : city.nameEn;
  const cityDescription =
    locale === "th"
      ? `โปรไฟล์ ${city.nameTh} พร้อมคะแนน เสาหลัก ข้อมูลอ้างอิง และหลักฐานที่ตรวจสอบได้`
      : locale === "zh"
        ? `${city.nameEn} 城市档案，含评分、维度、原始数据与可追溯证据。`
        : `${city.nameEn} city profile with scores, pillar breakdown, raw metrics, and traceable evidence.`;

  return {
    title: `${cityName} | ${SITE_NAME}`,
    description: cityDescription,
    canonicalUrl,
  };
}


function setJsonLd(data: object) {
  const scriptId = "json-ld-data";
  let script = document.getElementById(scriptId) as HTMLScriptElement;
  if (!script) {
    script = document.createElement("script");
    script.id = scriptId;
    script.type = "application/ld+json";
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

export function syncDocumentMeta(pathname: string, locale: Locale) {
  const route = parseRoute(pathname);
  const { title, description, canonicalUrl } = buildMeta(route, locale);
  const imageUrl = `${getSiteUrl()}${SHARE_IMAGE_PATH}`;

  document.title = title;
  setCanonical(canonicalUrl);
  setMetaByName("description", description);
  setMetaByName("theme-color", "#1A1612");
  setMetaByProperty("og:type", "website");
  setMetaByProperty("og:site_name", SITE_NAME);
  setMetaByProperty("og:title", title);
  setMetaByProperty("og:description", description);
  setMetaByProperty("og:url", canonicalUrl);
  setMetaByProperty("og:image", imageUrl);
  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:title", title);
  setMetaByName("twitter:description", description);
  setMetaByName("twitter:image", imageUrl);

  // JSON-LD Structured Data
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": SITE_NAME,
    "alternateName": ["SCITI", "Smart City Thailand Index"],
    "url": getSiteUrl(),
    "description": description,
    "inLanguage": [locale]
  };

  if (route.kind === "city") {
    const city = getCitySummaryById(route.cityId);
    if (city) {
      jsonLd["@type"] = "Place";
      jsonLd["name"] = locale === "th" ? city.nameTh : city.nameEn;
      jsonLd["description"] = description;
      jsonLd["address"] = {
        "@type": "PostalAddress",
        "addressLocality": locale === "th" ? city.provinceTh : city.province,
        "addressCountry": "TH"
      };
    }
  }

  setJsonLd(jsonLd);
}
