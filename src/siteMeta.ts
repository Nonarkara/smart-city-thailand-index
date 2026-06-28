import { getCitySummaryById } from "./cityCdp";
import { getCityPhotoAsset } from "./cityMedia";
import { parseRoute, type Route } from "./routing";
import type { Locale } from "./types";

const SITE_NAME = "Smart City Thailand Index (SCITI)";
const SHARE_IMAGE_PATH = "/smart_city_thailand_logo.jpg";

const defaultDescriptions: Record<Locale, string> = {
  en: "Thailand's smart city index focused on real outcomes, not paper plans. Explore rankings, methodology, and detailed city profiles.",
  th: "ดัชนีเมืองอัจฉริยะของไทยที่วัดจากผลลัพธ์จริง ไม่ใช่แผนบนกระดาษ สำรวจอันดับเมือง ระเบียบวิธี และโปรไฟล์รายเมืองอย่างละเอียด",
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
    th: `${SITE_NAME} | ระเบียบวิธี`,
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
    th: `${SITE_NAME} | ตรวจสอบผลการดำเนินงาน depa`,
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
  compare: {
    en: `${SITE_NAME} | Compare Cities`,
    th: `${SITE_NAME} | เปรียบเทียบเมือง`,
    zh: `${SITE_NAME} | 城市对比`,
  },
  bingo: {
    en: `${SITE_NAME} | SCITI Bingo`,
    th: `${SITE_NAME} | SCITI บิงโก`,
    zh: `${SITE_NAME} | SCITI 宾果`,
  },
  canvas: {
    en: `${SITE_NAME} | City Canvas`,
    th: `${SITE_NAME} | แคนวาสเมือง`,
    zh: `${SITE_NAME} | 城市画布`,
  },
  about: {
    en: `${SITE_NAME} | Mission — Why SCITI Exists`,
    th: `${SITE_NAME} | พันธกิจ — ทำไม SCITI จึงถือกำเนิดขึ้น`,
    zh: `${SITE_NAME} | 使命 — SCITI为何存在`,
  },
  "creative-economy": {
    en: `${SITE_NAME} | Creative Economy, Provincial Scale`,
    th: `${SITE_NAME} | เศรษฐกิจสร้างสรรค์ระดับจังหวัด`,
    zh: `${SITE_NAME} | 省级规模的创意经济`,
  },
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
  // Default share image — square logo
  let imageUrl = `${siteUrl}${SHARE_IMAGE_PATH}`;

  if (route.kind !== "city" && route.kind !== "canvas") {
    return { title, description, canonicalUrl, imageUrl };
  }

  const city = getCitySummaryById(route.cityId);
  if (!city) {
    return { title, description, canonicalUrl, imageUrl };
  }

  const cityName = locale === "th" ? city.nameTh : city.nameEn;
  const cityDescription =
    locale === "th"
      ? `โปรไฟล์ ${city.nameTh} พร้อมคะแนน เสาหลัก ข้อมูลตั้งต้น และหลักฐานที่ตรวจสอบย้อนกลับได้`
      : locale === "zh"
        ? `${city.nameEn} 城市档案，含评分、维度、原始数据与可追溯证据。`
        : `${city.nameEn} city profile with scores, pillar breakdown, raw metrics, and traceable evidence.`;

  // Use the city's primary photo for social sharing — much richer than the logo
  try {
    const photo = getCityPhotoAsset(city);
    if (photo?.src && !photo.src.startsWith("http")) {
      imageUrl = `${siteUrl}${photo.src}`;
    } else if (photo?.src) {
      imageUrl = photo.src;
    }
  } catch {
    // cityMedia may throw for cities without photos — keep default logo
  }

  return {
    title: `${cityName} | ${SITE_NAME}`,
    description: cityDescription,
    canonicalUrl,
    imageUrl,
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
  const { title, description, canonicalUrl, imageUrl } = buildMeta(route, locale);

  document.title = title;
  setCanonical(canonicalUrl);
  setMetaByName("description", description);
  setMetaByName("theme-color", "#0C2F53");
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
  const siteUrl = getSiteUrl();
  const publisher = {
    "@type": "Organization",
    "name": "Digital Economy Promotion Agency (depa)",
    "alternateName": "depa",
    "url": "https://www.depa.or.th",
    "logo": {
      "@type": "ImageObject",
      "url": `${siteUrl}/depa_logo.jpg`
    }
  };

  let jsonLd: Record<string, unknown>;

  if (route.kind === "home") {
    jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "name": SITE_NAME,
          "alternateName": ["SCITI", "Smart City Thailand Index"],
          "url": siteUrl,
          "description": description,
          "inLanguage": ["en", "th", "zh-Hans"],
          "publisher": publisher,
        },
        {
          "@type": "WebApplication",
          "name": SITE_NAME,
          "url": siteUrl,
          "applicationCategory": "GovernmentApplication",
          "description": description,
          "inLanguage": ["en", "th", "zh-Hans"],
          "publisher": publisher,
          "operatingSystem": "Any",
        }
      ]
    };
  } else if (route.kind === "city" || route.kind === "canvas") {
    const city = getCitySummaryById(route.cityId);
    if (city) {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Place",
        "name": locale === "th" ? city.nameTh : city.nameEn,
        "description": description,
        "url": canonicalUrl,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": locale === "th" ? city.provinceTh : city.province,
          "addressCountry": "TH"
        },
        "containedInPlace": {
          "@type": "Country",
          "name": "Thailand"
        }
      };
    } else {
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": title,
        "description": description,
        "url": canonicalUrl,
        "publisher": publisher,
      };
    }
  } else {
    jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": title,
      "description": description,
      "url": canonicalUrl,
      "inLanguage": locale === "zh" ? "zh-Hans" : locale,
      "publisher": publisher,
    };
  }

  setJsonLd(jsonLd);
}
