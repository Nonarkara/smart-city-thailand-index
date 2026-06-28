// ---------------------------------------------------------------------------
// City Investor Pitch — Uniform, data-driven, trilingual value proposition
// ---------------------------------------------------------------------------
// Every city gets a precise investor narrative derived from the same signals.
// No hand-waving. No city-by-city copywriting. The code decides what makes each
// place interesting, then says it clearly in EN / TH / ZH.
// ---------------------------------------------------------------------------

import {
  computeDevelopability,
  getFinancingAdvice,
  getMoneyballProfile,
  getTailoredSteps,
} from "./cityAnalytics.ts";
import { getCityContext } from "./cityContext.ts";
import { CITY_INDUSTRY_TAGS, type TrilingualList, resolveCityResearch } from "./cityResearch.ts";
import { PILLAR_LABELS, TIER_LABELS } from "./types.ts";
import type { Locale, ScoringPillar, SmartCity } from "./types.ts";

export interface TrilingualPitch {
  en: string;
  th: string;
  zh: string;
}

export interface InvestorPitch {
  cityId: string;
  headline: TrilingualPitch;
  whyLook: TrilingualPitch;
  competitiveEdge: TrilingualPitch;
  opportunity: TrilingualPitch;
  idealInvestor: TrilingualPitch;
  riskNote: TrilingualPitch;
  nextStep: TrilingualPitch;
  standoutPillar: { key: ScoringPillar; score: number; label: TrilingualPitch };
  investabilityLabel: TrilingualPitch;
  primaryInstrument: TrilingualPitch;
  tags: TrilingualList;
}

function fmtScore(n: number): string {
  return n.toFixed(1);
}

function fmtGpp(gpp: number): string {
  return `฿${(gpp / 1000).toFixed(0)}K`;
}

function firstSentence(text: string): string {
  // Protect decimals like "PM2.5" and "32.4" before splitting on sentence-ending punctuation.
  const decimals: string[] = [];
  const protectedText = text.replace(/\d+\.\d+/g, (match) => {
    decimals.push(match);
    return `__DECIMAL_${decimals.length - 1}__`;
  });
  const sentences = protectedText.split(/[.!?。！？](?=\s|$)/).map(s => s.trim()).filter(Boolean);
  let result = "";
  for (const sentence of sentences) {
    const candidate = result ? `${result}. ${sentence}` : sentence;
    if (candidate.length > 150) {
      // If even the first sentence is too long, truncate it.
      if (!result) result = sentence.slice(0, 150);
      break;
    }
    result = candidate;
    if (result.length >= 40) break; // Enough context
  }
  const restored = result.replace(/__DECIMAL_(\d+)__/g, (_, i) => decimals[Number(i)]);
  return restored.length > 150 ? `${restored.slice(0, 147)}...` : restored;
}

function getStandoutAndWeakest(city: SmartCity) {
  const entries = Object.entries(city.scores) as [ScoringPillar, number][];
  const sorted = [...entries].sort((a, b) => b[1] - a[1]);
  return {
    standout: sorted[0],
    weakest: sorted[sorted.length - 1],
  };
}

function regionWord(region: SmartCity["region"], locale: Locale): string {
  const map: Record<SmartCity["region"], Record<Locale, string>> = {
    north: { en: "northern", th: "ภาคเหนือ", zh: "北部" },
    northeast: { en: "northeastern", th: "ภาคตะวันออกเฉียงเหนือ", zh: "东北部" },
    central: { en: "central", th: "ภาคกลาง", zh: "中部" },
    east: { en: "eastern", th: "ภาคตะวันออก", zh: "东部" },
    south: { en: "southern", th: "ภาคใต้", zh: "南部" },
    bangkok: { en: "Bangkok", th: "กรุงเทพฯ", zh: "曼谷" },
  };
  return map[region][locale];
}

function leagueWord(city: SmartCity, locale: Locale): string {
  const map: Record<NonNullable<SmartCity["league"]>, Record<Locale, string>> = {
    province: { en: "province", th: "จังหวัด", zh: "府" },
    municipality: { en: "municipality", th: "เทศบาล", zh: "市镇" },
    district: { en: "district", th: "เขต", zh: "区" },
    campus: { en: "campus", th: "วิทยาเขต", zh: "园区" },
    "special-zone": { en: "special zone", th: "เขตพิเศษ", zh: "特别区" },
    township: { en: "township", th: "ชุมชน", zh: "镇" },
  };
  return city.league ? map[city.league][locale] : regionWord(city.region, locale);
}

function realityWord(reality: SmartCity["reality"], locale: Locale): string {
  if (reality === "operational") return { en: "operational", th: "ใช้งานจริง", zh: "已运行" }[locale];
  if (reality === "partial") return { en: "partially operational", th: "ใช้งานบางส่วน", zh: "部分运行" }[locale];
  return { en: "planning stage", th: "ระยะวางแผน", zh: "规划阶段" }[locale];
}

function idealInvestor(tier: SmartCity["tier"], reality: SmartCity["reality"], isEEC: boolean): TrilingualPitch {
  if (tier === "alpha" && reality === "operational") {
    return {
      en: "Commercial finance, PPP operators, municipal bond buyers, and ESG-focused infrastructure funds.",
      th: "การเงินเชิงพาณิชย์ ผู้ประกอบการ PPP ผู้ซื้อพันธบัตรเทศบาล และกองทุนโครงสร้างพื้นฐานที่เน้น ESG",
      zh: "商业融资、PPP运营商、市政债券购买者及关注ESG的基础设施基金。",
    };
  }
  if (isEEC && tier !== "gamma") {
    return {
      en: "BOI-promoted manufacturers, industrial IoT ventures, and EEC-linked logistics investors.",
      th: "ผู้ผลิตที่ได้รับส่งเสริม BOI ธุรกิจ Industrial IoT และนักลงทุนโลจิสติกส์ที่เชื่อม EEC",
      zh: "BOI促进的制造商、工业物联网企业及EEC相关物流投资者。",
    };
  }
  if (tier === "beta") {
    return {
      en: "Blended-finance vehicles, DFI co-investors, and growth investors comfortable with operational risk.",
      th: "กลไกการเงินผสม ผู้ร่วมลงทุน DFI และนักลงทุนเติบโตที่รับความเสี่ยงจากการดำเนินงานได้",
      zh: "混合融资工具、开发金融机构共同投资者，以及愿意承担运营风险的成长型投资者。",
    };
  }
  return {
    en: "Impact investors, technical-assistance grantmakers, and patient development finance.",
    th: "นักลงทุนเพื่อผลกระทบ ผู้ให้เงินช่วยเหลือทางเทคนิค และการเงินเพื่อพัฒนาที่อดทน",
    zh: "影响力投资者、技术援助资助方及耐心的开发性金融。",
  };
}

function nextStep(tier: SmartCity["tier"], reality: SmartCity["reality"]): TrilingualPitch {
  if (reality === "planned") {
    return {
      en: "Start with a minimum-viable pilot: prove the data loop with a few sensors, one dashboard, and one citizen-facing service before scaling.",
      th: "เริ่มด้วยนำร่องขั้นต่ำที่ใช้ได้: พิสูจน์ลูปข้อมูลด้วยเซ็นเซอร์ไม่กี่ตัว แดชบอร์ดหนึ่งอัน และบริการหนึ่งบริการที่ประชาชนใช้ ก่อนขยาย",
      zh: "从最小可行试点开始：用少量传感器、一个仪表盘、一个面向市民的服务验证数据闭环，然后再扩展。",
    };
  }
  if (tier === "gamma") {
    return {
      en: "Apply for a technical-assistance grant and build institutional capacity before seeking repayable finance.",
      th: "สมัครเงินช่วยเหลือทางเทคนิคและสร้างศักยภาพสถาบันก่อนหาการเงินที่ต้องชำระคืน",
      zh: "申请技术援助赠款并建立机构能力，然后再寻求可偿还融资。",
    };
  }
  if (tier === "beta") {
    return {
      en: "Structure a blended-finance project, combine BOI incentives with DFI co-lending, and use SCITI scores as due-diligence evidence.",
      th: "จัดโครงสร้างโครงการการเงินผสม ผสมสิทธิประโยชน์ BOI กับการร่วมให้กู้ของ DFI และใช้คะแนน SCITI เป็นหลักฐาน due diligence",
      zh: "构建混合融资项目，将BOI优惠与开发金融机构联合贷款结合，并用SCITI评分作为尽调依据。",
    };
  }
  return {
    en: "Issue a municipal or green bond, pursue land-value capture around transit investments, and scale proven systems.",
    th: "ออกพันธบัตรเทศบาลหรือพันธบัตรสีเขียว จับมูลค่าที่ดินรอบการลงทุนขนส่ง และขยายระบบที่พิสูจน์แล้ว",
    zh: "发行市政或绿色债券，围绕交通投资进行土地增值捕获，并扩展已验证的系统。",
  };
}

function buildHeadline(city: SmartCity, standout: [ScoringPillar, number]): TrilingualPitch {
  const en = () => {
    const pillar = PILLAR_LABELS.en[standout[0]].toLowerCase();
    if (city.tier === "alpha") {
      return `${city.nameEn} — Alpha ${leagueWord(city, "en")} with a ${pillar} edge (${standout[1]}/100).`;
    }
    if (city.tier === "beta") {
      return `${city.nameEn} — ${regionWord(city.region, "en").replace(/^./, c => c.toUpperCase())} ${leagueWord(city, "en")} where ${pillar} (${standout[1]}/100) leads the investment case.`;
    }
    return `${city.nameEn} — early-stage ${leagueWord(city, "en")} with ${pillar} as the entry signal (${standout[1]}/100).`;
  };

  const th = () => {
    const pillar = PILLAR_LABELS.th[standout[0]];
    const tier = TIER_LABELS.th[city.tier];
    if (city.tier === "alpha") {
      return `${city.nameTh} — ${leagueWord(city, "th")}${tier} ที่มีจุดแข็งด้าน${pillar} (${standout[1]}/100)`;
    }
    if (city.tier === "beta") {
      return `${city.nameTh} — ${leagueWord(city, "th")}${regionWord(city.region, "th")} ที่${pillar} (${standout[1]}/100) นำข้อเสนอการลงทุน`;
    }
    return `${city.nameTh} — ${leagueWord(city, "th")}ระยะเริ่มต้นที่มี${pillar}เป็นสัญญาณเข้า (${standout[1]}/100)`;
  };

  const zh = () => {
    const pillar = PILLAR_LABELS.zh[standout[0]];
    const tier = TIER_LABELS.zh[city.tier];
    const region = regionWord(city.region, "zh");
    const league = leagueWord(city, "zh");
    if (city.tier === "alpha") {
      return `${city.nameEn} — ${tier}级${league}，${pillar}优势突出（${standout[1]}/100）。`;
    }
    if (city.tier === "beta") {
      return `${city.nameEn} — ${region}${league}，${pillar}（${standout[1]}/100）引领投资逻辑。`;
    }
    return `${city.nameEn} — 早期${league}，以${pillar}作为切入点（${standout[1]}/100）。`;
  };

  return { en: en(), th: th(), zh: zh() };
}

function buildWhyLook(city: SmartCity, standout: [ScoringPillar, number], context: ReturnType<typeof getCityContext>): TrilingualPitch {
  const gpp = city.metrics.gppPerCapita;
  const gppEn = gpp ? `GPP per capita ${fmtGpp(gpp)}.` : "";
  const gppTh = gpp ? `GPP ต่อหัว ${fmtGpp(gpp)}` : "";
  const gppZh = gpp ? `人均GPP ${fmtGpp(gpp)}。` : "";

  const hook = (locale: Locale): string => {
    const famous = context?.famousFor?.[locale];
    if (famous && famous.length > 10) return firstSentence(famous);
    return locale === "th" ? city.taglineTh : city.tagline;
  };

  return {
    en: `${city.nameEn} scores ${fmtScore(city.compositeScore)}/100 (${TIER_LABELS.en[city.tier]}, ${realityWord(city.reality, "en")}). ${hook("en")} Its strongest signal is ${PILLAR_LABELS.en[standout[0]].toLowerCase()} (${standout[1]}/100). ${gppEn}`.trim(),
    th: `${city.nameTh} ได้คะแนน ${fmtScore(city.compositeScore)}/100 (${TIER_LABELS.th[city.tier]}, ${realityWord(city.reality, "th")}) ${hook("th")} สัญญาณที่แข็งที่สุดคือ${PILLAR_LABELS.th[standout[0]]} (${standout[1]}/100) ${gppTh}`.trim(),
    zh: `${city.nameEn}综合评分${fmtScore(city.compositeScore)}/100（${TIER_LABELS.zh[city.tier]}级，${realityWord(city.reality, "zh")}）。${hook("zh")}。最强信号是${PILLAR_LABELS.zh[standout[0]]}（${standout[1]}/100）。${gppZh}`.trim(),
  };
}

function buildOpportunity(
  city: SmartCity,
  standout: [ScoringPillar, number],
  context: ReturnType<typeof getCityContext>,
): TrilingualPitch {
  const buildForLocale = (locale: Locale): string => {
    const curated = context?.opportunity?.[locale];
    if (curated && curated.length > 20) return firstSentence(curated);

    const tags = CITY_INDUSTRY_TAGS[city.id]?.[locale] ?? resolveCityResearch(city).industries[locale] ?? [];
    const dims = city.smartDimensions;
    const industryPhrase = tags.slice(0, 3).join(locale === "th" ? " / " : ", ");
    const dimPhrase = dims
      .slice(0, 3)
      .map(d => PILLAR_LABELS[locale][d as ScoringPillar] ?? d)
      .join(locale === "th" ? " / " : ", ");
    const pillarName = PILLAR_LABELS[locale][standout[0]].toLowerCase();

    if (locale === "en") {
      return `Opportunity sits at the intersection of ${industryPhrase || dimPhrase} and the city's ${pillarName} strength (${standout[1]}/100).`;
    }
    if (locale === "th") {
      return `โอกาสอยู่ที่จุดตัดของ ${industryPhrase || dimPhrase} และจุดแข็งด้าน${pillarName} (${standout[1]}/100) ของเมือง`;
    }
    return `机会在于${industryPhrase || dimPhrase}与该市${pillarName}优势（${standout[1]}/100）的交汇处。`;
  };

  return { en: buildForLocale("en"), th: buildForLocale("th"), zh: buildForLocale("zh") };
}

function buildRiskNote(
  city: SmartCity,
  weakest: [ScoringPillar, number],
  context: ReturnType<typeof getCityContext>,
): TrilingualPitch {
  const buildForLocale = (locale: Locale): string => {
    const theCatch = context?.theCatch?.[locale];
    if (theCatch && theCatch.length > 10) return firstSentence(theCatch);

    const pillarName = PILLAR_LABELS[locale][weakest[0]].toLowerCase();
    if (city.dataConfidence === "low") {
      if (locale === "en") return `Limited verified data. The ${pillarName} score (${weakest[1]}/100) is the weakest signal and needs ground truthing.`;
      if (locale === "th") return `ข้อมูลที่ตรวจสอบได้จำกัด คะแนน${pillarName} (${weakest[1]}/100) เป็นสัญญาณที่อ่อนที่สุดและต้องการตรวจสอบในพื้นที่`;
      return `可验证数据有限。${pillarName}得分（${weakest[1]}/100）是最弱信号，需要实地核实。`;
    }
    if (locale === "en") return `Watch the ${pillarName} gap (${weakest[1]}/100) and confirm operational status on the ground before committing capital.`;
    if (locale === "th") return `เฝ้าระวังช่องว่างด้าน${pillarName} (${weakest[1]}/100) และยืนยันสถานะการดำเนินงานในพื้นที่ก่อนลงเงิน`;
    return `关注${pillarName}缺口（${weakest[1]}/100），在投入资金前实地确认运营状态。`;
  };

  return { en: buildForLocale("en"), th: buildForLocale("th"), zh: buildForLocale("zh") };
}

function buildCompetitiveEdge(
  city: SmartCity,
  financing: ReturnType<typeof getFinancingAdvice>,
): TrilingualPitch {
  const moneyball = getMoneyballProfile(city);
  if (moneyball && moneyball.edges.some(e => e.advantage)) {
    const top = moneyball.edges.filter(e => e.advantage)[0];
    return {
      en: `${moneyball.headline} Standout edge: ${top.label} — ${top.value}.`,
      th: `${moneyball.headlineTh} จุดแข็งเด่น: ${top.labelTh} — ${top.valueTh}`,
      zh: `${moneyball.headlineZh} 突出优势：${top.labelZh} — ${top.valueZh}。`,
    };
  }
  return {
    en: financing.competitiveAdvantage,
    th: financing.competitiveAdvantageTh,
    zh: financing.competitiveAdvantageZh,
  };
}

function buildNextStep(
  city: SmartCity,
  financing: ReturnType<typeof getFinancingAdvice>,
): TrilingualPitch {
  const steps = getTailoredSteps(city);
  const first = steps[0];
  if (!first) return nextStep(city.tier, city.reality);
  return {
    en: `${financing.primaryInstrument}. ${first.step}`,
    th: `${financing.primaryInstrumentTh} ${first.stepTh}`,
    zh: `${financing.primaryInstrumentZh}。${first.stepZh}`,
  };
}

export function getInvestorPitch(city: SmartCity): InvestorPitch {
  const { standout, weakest } = getStandoutAndWeakest(city);
  const context = getCityContext(city.id);
  const developability = computeDevelopability(city);
  const financing = getFinancingAdvice(city);
  const isEEC = city.region === "east";

  const headline = buildHeadline(city, standout);
  const whyLook = buildWhyLook(city, standout, context);
  const competitiveEdge = buildCompetitiveEdge(city, financing);
  const opportunity = buildOpportunity(city, standout, context);
  const riskNote = buildRiskNote(city, weakest, context);
  const idealInvestorPitch = idealInvestor(city.tier, city.reality, isEEC);
  const nextStepPitch = buildNextStep(city, financing);

  return {
    cityId: city.id,
    headline,
    whyLook,
    competitiveEdge,
    opportunity,
    idealInvestor: idealInvestorPitch,
    riskNote,
    nextStep: nextStepPitch,
    standoutPillar: {
      key: standout[0],
      score: standout[1],
      label: {
        en: PILLAR_LABELS.en[standout[0]],
        th: PILLAR_LABELS.th[standout[0]],
        zh: PILLAR_LABELS.zh[standout[0]],
      },
    },
    investabilityLabel: {
      en: developability.investabilityLabel ?? developability.label,
      th: developability.investabilityLabelTh ?? developability.labelTh,
      zh: developability.investabilityLabelZh ?? developability.labelZh,
    },
    primaryInstrument: {
      en: financing.primaryInstrument,
      th: financing.primaryInstrumentTh,
      zh: financing.primaryInstrumentZh,
    },
    tags: CITY_INDUSTRY_TAGS[city.id] ?? resolveCityResearch(city).industries,
  };
}

export function getInvestorPitchForLocale(city: SmartCity, locale: Locale): {
  headline: string;
  whyLook: string;
  competitiveEdge: string;
  opportunity: string;
  idealInvestor: string;
  riskNote: string;
  nextStep: string;
  investabilityLabel: string;
  primaryInstrument: string;
  tags: string[];
} {
  const pitch = getInvestorPitch(city);
  return {
    headline: pitch.headline[locale],
    whyLook: pitch.whyLook[locale],
    competitiveEdge: pitch.competitiveEdge[locale],
    opportunity: pitch.opportunity[locale],
    idealInvestor: pitch.idealInvestor[locale],
    riskNote: pitch.riskNote[locale],
    nextStep: pitch.nextStep[locale],
    investabilityLabel: pitch.investabilityLabel[locale],
    primaryInstrument: pitch.primaryInstrument[locale],
    tags: pitch.tags[locale],
  };
}
