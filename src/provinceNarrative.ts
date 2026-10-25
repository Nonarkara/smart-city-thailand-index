// ---------------------------------------------------------------------------
// Province Narrative — four sentences per city, each from measured data
// ---------------------------------------------------------------------------
// This module writes the "human layer" for the 68 cities that have no
// hand-written context. Each of the four fields (livelihood, famousFor,
// opportunity, theCatch) is assembled from a DIFFERENT set of measured
// values, so the four sentences never say the same thing, and so no two
// cities say the same thing.
//
// THE WRITING RULES
//
// 1. A sentence must name the number, the source, and the scope — and must
//    be falsifiable by the next reader with the same dataset. "A tourism
//    city with strong infrastructure" is not a sentence. "Province-level
//    electricity use is 6,021 kWh per person against a national median of
//    4,112 (Ministry of Energy, 2023)" is.
//
// 2. THE FRAME CHANGES WITH THE DATA. A fixed template with the digits
//    swapped is still a template — and reading four of those in a row is
//    what makes the whole product feel mechanical. Every reading below is
//    therefore placed in its QUARTILE BAND among the provinces that
//    indicator covers, and the sentence frame is chosen by that band. A
//    province in the top quarter of forest cover is described differently
//    from one in the bottom quarter. The boundaries come from the data
//    itself (see bandIn), never from a hand-picked threshold.
//
// 3. EVERY SENTENCE IS TERMINATED. An unterminated fragment runs into the
//    next one and reads as machine output. Every English sentence ends with
//    a full stop, every Chinese sentence with 。, and Thai is separated by
//    spaces the way Thai is written. The terminator is applied by
//    terminate() so no fragment can escape it.
//
// 4. ONE FACT, ONE PLACE. A number that appears in two fields on the same
//    page reads as a template even when both sentences are true. PM2.5
//    therefore belongs to the constraint, not to the description, and each
//    indicator is owned by exactly one field.
//
// Every figure below comes from PROVINCE_BASELINE_BY_ID or
// ABSORPTION_PROVINCES. Nothing is estimated. Where a province has no
// record for a measure, the sentence names the absence rather than
// inventing a value.
// ---------------------------------------------------------------------------

import {
  absorptionBand,
  bandIn,
  formatNumber as fmt,
  formatNumberTh as fmtTh,
  informalBand,
  informalShare,
  internetBand,
  internetShare,
  mobileBand,
  mobileShare,
  populationText,
  readProvince,
  type ProvinceReading,
} from "./provinceVoice.ts";
import type { SmartCity } from "./types.ts";

export interface Voice {
  livelihood: { en: string; th: string; zh: string };
  famousFor: { en: string; th: string; zh: string };
  opportunity: { en: string; th: string; zh: string };
  theCatch: { en: string; th: string; zh: string };
  /** The question this index cannot answer for this city — honest, specific. */
  unanswered: { en: string; th: string; zh: string };
  /**
   * The single most distinctive measured fact — the pull quote for the
   * texture card. It is chosen by BAND, not by position: the reading this
   * province is most unusual on, which is not the same as the first one
   * measured. The remaining famous-for sentences stay in the row.
   */
  landmark: { en: string; th: string; zh: string };
  /** The famous-for sentences with the pull quote taken out. */
  famousForRest: { en: string; th: string; zh: string };
}

// ── Sentence plumbing ─────────────────────────────────────────────────────

/** One sentence in three languages. */
type L = { en: string; th: string; zh: string };

/**
 * The raw sentences of one field, before they are joined. The builders
 * return this rather than a finished string so that the sentence
 * boundaries stay inspectable: a test can then assert that every
 * English sentence is terminated, instead of guessing where a sentence
 * was supposed to end.
 */
export interface SentenceSet {
  en: string[];
  th: string[];
  zh: string[];
  /** The band each sentence was written from, where one applies. */
  bands?: (number | undefined)[];
}

/**
 * Assemble one finished sentence: the claim, the band clause that says
 * where this province sits, and the source. The source goes LAST so that
 * the clause can sit between the number and its attribution without
 * splitting the claim from its own reference.
 *
 * The sentence is terminated here, at the moment it is built. A terminator
 * added later — when the sentences are joined — cannot guarantee that
 * every clause ended properly, and one unterminated fragment is enough to
 * make a whole page read as machine output.
 */
function sentence(base: L, clause: L | null, source: L | null): L {
  const merged = clause
    ? { en: base.en + clause.en, th: base.th + clause.th, zh: base.zh + clause.zh }
    : base;
  const out = source
    ? { en: merged.en + source.en, th: merged.th + source.th, zh: merged.zh + source.zh }
    : merged;
  return {
    en: terminate(out.en, "en"),
    th: terminate(out.th, "th"),
    zh: terminate(out.zh, "zh"),
  };
}

/** Push a finished sentence into a field's sentence set. */
function pushSentence(target: SentenceSet, line: L): void {
  target.en.push(line.en);
  target.th.push(line.th);
  target.zh.push(line.zh);
}

/**
 * Terminate a sentence. English and Chinese take a mark; Thai is written
 * with spaces between clauses and takes none. This runs on every sentence,
 * so a fragment cannot reach the page.
 */
function terminate(text: string, locale: "en" | "th" | "zh"): string {
  const trimmed = text.trim();
  if (!trimmed) return trimmed;
  if (locale === "th") return trimmed;
  if (locale === "zh") return /[。！？…]$/.test(trimmed) ? trimmed : `${trimmed}。`;
  return /[.!?…]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function joinLocale(sentences: string[], locale: "en" | "th" | "zh"): string {
  return sentences.map(s => terminate(s, locale)).join(" ");
}

/** The sources, in the order they are cited. Each carries its own spacing. */
const SRC = {
  nsoPop: { en: " (NSO, 2022–26)", th: " (สสช. 2565–69)", zh: "（泰国国家统计局，2022–26年）" },
  nso: { en: " (NSO)", th: " (สสช.)", zh: "（泰国国家统计局）" },
  rfd: { en: " (Royal Forest Department)", th: " (กรมป่าไม้)", zh: "（皇家林业厅）" },
  moe: { en: " (Ministry of Energy, 2023)", th: " (กระทรวงพลังงาน 2566)", zh: "（能源部，2023年）" },
  pcd: { en: " (Pollution Control Department)", th: " (กรมควบคุมมลพิษ)", zh: "（污染控制厅）" },
  rtddi: { en: " (RTDDI)", th: " (สทช.)", zh: "（陆路交通安全中心）" },
  absorption: {
    en: " (NSO/DOPA, BE 2568)",
    th: " (สสช./กรมการปกครอง พ.ศ. 2568)",
    zh: "（泰国国家统计局/内政厅，2568佛历）",
  },
} as const;

/** The clause set for a band, in the order the bands are numbered. */
function clauseByBand(
  band: number | undefined,
  clauses: [L, L, L, L],
): L | null {
  // Band 0 is the TOP quarter — the most distinctive case — so the guard
  // must test for undefined, not falsiness. `if (!band)` silently dropped
  // the clause for exactly the provinces it was written for.
  if (band === undefined || band === null) return null;
  return clauses[band] ?? null;
}

// ── LIVELIHOOD: what work the place actually has ──────────────────────────
// Built from the labour force, the informal share, the internal migration
// and the population. This is the "who lives here and how" sentence.

function buildLivelihood(city: SmartCity, r: ProvinceReading): SentenceSet {
  const informal = informalShare(r);
  const pop = r.population;
  const lf = r.labourForce;
  const migration = r.internalMigration;

  const out: SentenceSet = { en: [], th: [], zh: [] };

  // Population and labour force.
  if (pop !== undefined) {
    const band = bandIn("nso-province-population", city.province, "high");
    const base: L = {
      en: `The province population in 2022 was ${populationText(pop, "en")}${lf !== undefined ? ` and its labour force in Q2 2026 was ${populationText(lf, "en")}` : ""}`,
      th: `ประชากรจังหวัดในปี 2565 มี ${populationText(pop, "th")}${lf !== undefined ? ` และกำลังแรงงานไตรมาส 2 ปี 2569 มี ${populationText(lf, "th")}` : ""}`,
      zh: `该府2022年人口为 ${populationText(pop, "zh")}${lf !== undefined ? `，2026年第二季度劳动力为 ${populationText(lf, "zh")}` : ""}`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nsoPop));
  } else {
    pushSentence(out, sentence({
      en: `${city.nameEn} sits in ${city.province}, where this index holds no provincial population record`,
      th: `${city.nameTh} อยู่ในจังหวัด${city.provinceTh} ซึ่งดัชนีนี้ยังไม่มีข้อมูลประชากรระดับจังหวัด`,
      zh: `${city.nameEn} 位于${city.province}，本指数暂无该府人口记录`,
    }, null, null));
  }

  // The informal share is the single most human fact available: it says
  // how much of the working population has no formal cover.
  if (informal !== undefined) {
    const band = informalBand(r);
    const base: L = {
      en: `Informal workers counted in 2025 equal approximately ${fmt(informal, 1)}% of the Q2 2026 labour force; these are different survey periods`,
      th: `จำนวนแรงงานนอกระบบปี 2568 เทียบได้ประมาณร้อยละ ${fmtTh(informal, 1)} ของกำลังแรงงานไตรมาส 2 ปี 2569 โดยเป็นข้อมูลคนละช่วงเวลา`,
      zh: `2025年非正规就业人数约相当于2026年第二季度劳动力的 ${fmt(informal, 1)}%，两者来自不同调查时期`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
  }

  // Internal migration is a PERCENTAGE in this series, not a head count.
  if (migration !== undefined) {
    const band = bandIn("nso-internal-migration", city.province, "high");
    const base: L = {
      en: `In the 2010 NSO survey, ${fmt(migration, 1)}% of the province's population had moved within the province in the preceding five years`,
      th: `ในการสำรวจของ สสช. พ.ศ. 2553 ประชากรจังหวัด ${fmtTh(migration, 1)}% ย้ายถิ่นภายในจังหวัดในช่วงห้าปีก่อนการสำรวจ`,
      zh: `在泰国国家统计局2010年调查中，该府人口的 ${fmt(migration, 1)}% 在调查前五年内曾在府内迁居`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
  }

  return out;
}

// ── FAMOUS FOR: the one measured thing that sets this place apart ────────
// Deliberately built from a different set of readings than the livelihood:
// land cover, electricity, water. Air quality is NOT here — the constraint
// field owns it, so that no number appears twice on the same page.

function buildFamousFor(city: SmartCity, r: ProvinceReading): SentenceSet {
  // The band list travels with the sentences so the pull quote can be
  // chosen by how unusual the reading is, not by where it happens to sit.
  const out: SentenceSet = { en: [], th: [], zh: [], bands: [] };

  const forest = r.forestCoverage;
  const elec = r.electricityPerCapita;
  const water = r.drinkingWater;

  // Forest cover is the most legible "landscape" fact.
  //
  // rfd-forest-coverage is stored as a PERCENTAGE throughout — Mae Hong
  // Son 84.7, Sing Buri 0.1. It is never a fraction, so it must not be
  // multiplied by 100: doing so turns Nonthaburi's 0.0% into 0% but
  // Bangkok's 0.4% into 40%, which is a hundred-fold lie.
  if (forest !== undefined) {
    const band = bandIn("rfd-forest-coverage", city.province, "high");
    if (forest === 0) {
      // A verified zero, not a missing value. The sentence attributes it
      // to the source rather than printing "0.0%", which would claim a
      // precision the reading does not carry.
      pushSentence(out, sentence({
        en: `The Royal Forest Department records no forest cover for ${city.province}`,
        th: `กรมป่าไม้บันทึกพื้นที่ป่าเป็นศูนย์สำหรับจังหวัด${city.provinceTh}`,
        zh: `皇家林业厅记录${city.province}的森林覆盖为零`,
      }, null, null));
      out.bands?.push(band?.band);
    } else {
      const base: L = {
        en: `In 2021, ${fmt(forest, 1)}% of ${city.province} was forest`,
        th: `ในปี 2564 พื้นที่ ${fmtTh(forest, 1)}% ของจังหวัด${city.provinceTh} เป็นป่า`,
        zh: `2021年${city.province}有 ${fmt(forest, 1)}% 为森林`,
      };
      const clause = clauseByBand(band?.band, [
        {
          en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
          th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
          zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
        },
        {
          en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
          th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
          zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
        },
        {
          en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
          th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
          zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
        },
        {
          en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
          th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
          zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
        },
      ]);
      pushSentence(out, sentence(base, clause, SRC.rfd));
      out.bands?.push(band?.band);
    }
  }

  // Electricity per person separates a serviced place from an unserviced one.
  if (elec !== undefined) {
    const band = bandIn("moe-electricity-per-capita", city.province, "high");
    const base: L = {
      en: `Electricity runs at ${fmt(elec)} kWh per person a year`,
      th: `การใช้ไฟฟ้า ${fmtTh(elec)} กิโลวัตต์-ชั่วโมงต่อคนต่อปี`,
      zh: `人均年用电量 ${fmt(elec)} 千瓦时`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.moe));
  }

  // How much of the grid serves homes rather than factories and commerce.
  // This is what tells a reader whether the province's power demand is
  // domestic or industrial, and it is one of the few readings that moves
  // independently of forest cover and income.
  const resElec = r.residentialElectricityShare;
  if (resElec !== undefined) {
    const band = bandIn("moe-residential-electricity-share", city.province, "high");
    const base: L = {
      en: `${fmt(resElec, 1)}% of the province's electricity goes to homes`,
      th: `${fmtTh(resElec, 1)}% ของการใช้ไฟฟ้าของจังหวัดไปที่บ้านอยู่อาศัย`,
      zh: `该府用电量的 ${fmt(resElec, 1)}% 来自居民用电`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.moe));
    out.bands?.push(band?.band);
  }

  if (water !== undefined) {
    const band = bandIn("nso-drinking-water", city.province, "high");
    const base: L = {
      en: `In the 2010 NSO survey, ${fmt(water, 1)}% of provincial households had access to clean drinking water`,
      th: `ในการสำรวจของ สสช. พ.ศ. 2553 ครัวเรือนในจังหวัด ${fmtTh(water, 1)}% มีน้ำดื่มสะอาด`,
      zh: `在泰国国家统计局2010年调查中，该府 ${fmt(water, 1)}% 的住户可获得清洁饮用水`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
    out.bands?.push(band?.band);
  }

  if (out.en.length === 0) {
    pushSentence(out, sentence({
      en: `${city.nameEn} is registered in ${city.province}. This index holds no province-level physical reading for it yet, so nothing is claimed beyond the registry position`,
      th: `${city.nameTh} ขึ้นทะเบียนในจังหวัด${city.provinceTh} ดัชนีนี้ยังไม่มีตัวเลขระดับจังหวัดด้านสภาพกายภาพสำหรับจังหวัดนี้ จึงไม่มีการอ้างสิ่งใดเกินสถานะในทะเบียน`,
      zh: `${city.nameEn} 登记于${city.province}。本指数尚无该府的省级自然条件读数，因此除登记状态外不作任何声明`,
    }, null, null));
    out.bands?.push(undefined);
  }

  return out;
}

// ── OPPORTUNITY: what this place could do that it cannot yet ─────────────
// Built from capacity, connectivity and growth — the infrastructure side.

function buildOpportunity(city: SmartCity, r: ProvinceReading): SentenceSet {
  const out: SentenceSet = { en: [], th: [], zh: [] };

  const net = r.internetUsers;
  const mobile = r.mobileUsers;
  const permits = r.residentialPermits;

  // Connectivity first: a digital service needs a floor of reach.
  //
  // nso-internet-users and nso-mobile-users are COUNTS IN THOUSAND
  // PEOPLE, not percentages. To say what share of residents is online
  // they must be divided by the population — and the two series are from
  // different survey years (2023 and 2022 against a 2022 population), so
  // the share is stated as approximate rather than exact.
  const netShare = internetShare(r);
  if (netShare !== undefined) {
    const band = internetBand(r);
    const base: L = {
      en: `Internet users in Q1 2023 equal about ${fmt(netShare, 0)}% of the Q4 2022 population; the survey periods differ`,
      th: `ผู้ใช้อินเทอร์เน็ตไตรมาส 1 ปี 2566 คิดเป็นประมาณ ${fmtTh(netShare, 0)}% ของประชากรไตรมาส 4 ปี 2565 โดยเป็นข้อมูลคนละช่วงเวลา`,
      zh: `2023年第一季度互联网用户数约相当于2022年第四季度人口的 ${fmt(netShare, 0)}%，两者调查时期不同`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
  } else if (net !== undefined) {
    pushSentence(out, sentence({
      en: `${populationText(net, "en")} use the internet`,
      th: `มีผู้ใช้อินเทอร์เน็ต ${populationText(net, "th")}`,
      zh: `互联网用户 ${populationText(net, "zh")}`,
    }, null, SRC.nso));
  }

  const mobilePct = mobileShare(r);
  if (mobilePct !== undefined) {
    const band = mobileBand(r);
    const base: L = {
      en: `In Q4 2022, about ${fmt(mobilePct, 0)}% of residents used mobile phones`,
      th: `ในไตรมาส 4 ปี 2565 ประชากรประมาณ ${fmtTh(mobilePct, 0)}% ใช้โทรศัพท์มือถือ`,
      zh: `2022年第四季度约 ${fmt(mobilePct, 0)}% 的居民使用手机`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
  } else if (mobile !== undefined) {
    pushSentence(out, sentence({
      en: `${populationText(mobile, "en")} use mobile phones`,
      th: `มีผู้ใช้โทรศัพท์มือถือ ${populationText(mobile, "th")}`,
      zh: `手机使用者 ${populationText(mobile, "zh")}`,
    }, null, SRC.nso));
  }

  // Residential permits are the forward signal: building pressure.
  if (permits !== undefined) {
    const band = bandIn("nso-residential-permits", city.province, "high");
    const base: L = {
      en: `In 2019, ${fmt(permits)} residential building permits were issued`,
      th: `ในปี 2562 มีใบอนุญาตก่อสร้างอาคารโรงเรือน ${fmtTh(permits)} ใบ`,
      zh: `2019年签发了 ${fmt(permits)} 份住宅建筑许可`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, SRC.nso));
  }

  // The condition of the housing stock is the other half of the buildable
  // case: it says how much of the province is already standing and how
  // much of it is in poor condition. The NSO household survey that carries
  // this is from 2010, and the year is stated IN THE SENTENCE — a reader
  // must never mistake a decade-old baseline for a current one.
  const nonDurable = r.nonDurableHousing;
  if (nonDurable !== undefined) {
    const band = bandIn("nso-non-durable-housing", city.province, "high");
    const base: L = {
      en: `In the 2010 NSO household survey, ${fmt(nonDurable, 1)}% of the province's households were living in non-durable housing`,
      th: `ในการสำรวจครัวเรือนของสสช. พ.ศ. 2553 มี ${fmtTh(nonDurable, 1)}% ของครัวเรือนในจังหวัดอาศัยอยู่ในที่อยู่อาศัยที่ใช้วัสดุไม่ถาวร`,
      zh: `在泰国国家统计局 2010 年住户调查中，该府有 ${fmt(nonDurable, 1)}% 的住户居住于非耐久建材住房`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    pushSentence(out, sentence(base, clause, null));
  }

  if (out.en.length === 0) {
    pushSentence(out, sentence({
      en: `The buildable case for ${city.nameEn} has to be made from its own records. This index holds no provincial connectivity or permit series for ${city.province}, so the opportunity section stays open rather than filled with a plausible-sounding plan`,
      th: `กรณีที่${city.nameTh}จะเติบโตต้องเรียบเรียงจากบันทึกของเมืองเอง ดัชนีนี้ยังไม่มีชุดข้อมูลการเชื่อมต่อหรือใบอนุญาตระดับจังหวัดสำหรับจังหวัด${city.provinceTh} ส่วนโอกาสจึงเปิดค้างไว้ แทนที่จะเติมแผนที่ฟังดูเป็นไปได้`,
      zh: `${city.nameEn} 的增长可能性必须依据其自身记录来论证。本指数暂无${city.province}的省级连通性或许可数据，因此机遇部分保持开放，而不是填入一份听来合理的计划`,
    }, null, null));
  }

  return out;
}

// ── THE CATCH: what will stop it working ─────────────────────────────────
// Built from the load, the risk and the debt: the numbers that describe
// what a city has to absorb.

function buildTheCatch(city: SmartCity, r: ProvinceReading): SentenceSet {
  const out: SentenceSet = { en: [], th: [], zh: [] };

  // A registered city has no public implementation evidence, and that is
  // the frame its constraint has to be read in: registry status is not
  // live deployment. The caveat leads, and the measured facts follow —
  // dropping the caveat would let a set of real numbers read as proof
  // that the city is running.
  const registered = city.status === "registered";
  if (registered) {
    pushSentence(out, sentence({
      en: "The key constraint is registry status: being in the depa promotion registry is not the same thing as live deployment, so this dossier stays conservative until public implementation evidence appears",
      th: "ข้อจำกัดหลักคือสถานะในทะเบียน: การอยู่ในทะเบียนส่งเสริมของ depa ไม่ใช่สิ่งเดียวกับการมีระบบใช้งานจริง ดอสซิเยร์นี้จึงเล่าอย่างระมัดระวังจนกว่าจะมีหลักฐานสาธารณะของการดำเนินงาน",
      zh: "核心制约是登记状态：列入depa推广名录不等于系统已上线运行，因此在公开实施证据出现之前，本档案应保持审慎表述",
    }, null, null));
  }

  // The measured facts, each one a finished sentence. They are collected
  // separately so the lead-in can be folded into the first one: a colon
  // that opens a list is part of that sentence, not a sentence of its own.
  const facts: L[] = [];

  // The unplanned population share is the sharpest fact in the dataset:
  // the people the household register does not count.
  const unplanned = r.absorptionUnplanned;
  const registeredPop = r.absorptionRegistered;
  if (unplanned !== undefined && registeredPop !== undefined && registeredPop > 0) {
    const share = (unplanned / registeredPop) * 100;
    const band = absorptionBand(city.province);
    const base: L = {
      en: `${fmt(unplanned)} people live in ${city.province} without being on its household register — ${fmt(share, 1)}% of the register itself`,
      th: `มี ${fmtTh(unplanned)} คนอาศัยอยู่ในจังหวัด${city.provinceTh} โดยไม่ได้ขึ้นทะเบียนทะเบียนราษฎร์ของจังหวัด คิดเป็น ${fmtTh(share, 1)}% ของตัวทะเบียนเอง`,
      zh: `有 ${fmt(unplanned)} 人居住在${city.province}，但不在该府户籍登记册上——相当于登记册本身的 ${fmt(share, 1)}%`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    facts.push(sentence(base, clause, SRC.absorption));
  }

  // Road deaths: the safety fact with an actual body count.
  const deaths = r.roadDeaths;
  if (deaths !== undefined) {
    const band = bandIn("rtddi-road-deaths", city.province, "high");
    const base: L = {
      en: `In 2025, road deaths in the province were ${fmt(deaths)}`,
      th: `ในปี 2568 ผู้เสียชีวิตจากอุบัติเหตุทางถนนในจังหวัดอยู่ที่ ${fmtTh(deaths)} ราย`,
      zh: `2025年该府道路死亡 ${fmt(deaths)} 人`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    facts.push(sentence(base, clause, SRC.rtddi));
  }

  const moto = r.motorcycleShare;
  if (moto !== undefined) {
    const band = bandIn("rtddi-motorcycle-share", city.province, "high");
    const base: L = {
      en: `In 2025, motorcycles accounted for ${fmt(moto, 1)}% of provincial road deaths with a recorded vehicle type; nationwide, vehicle type was missing for 44.2% of road-death records`,
      th: `ในปี 2568 ผู้ใช้รถจักรยานยนต์มีสัดส่วน ${fmtTh(moto, 1)}% ของผู้เสียชีวิตจากอุบัติเหตุทางถนนในจังหวัดที่มีการบันทึกประเภทยานพาหนะ โดยข้อมูลผู้เสียชีวิตทั่วประเทศ 44.2% ไม่ระบุประเภทยานพาหนะ`,
      zh: `2025年，在该府有车辆类型记录的道路死亡案例中，摩托车占 ${fmt(moto, 1)}%；全国道路死亡记录中有44.2%缺少车辆类型`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, highest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่ามากไปน้อย`,
        zh: `，按数值从高到低排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    facts.push(sentence(base, clause, SRC.rtddi));
  }

  // Air quality belongs HERE and only here — the description field does not
  // repeat it, so no number appears twice on the page.
  if (r.pm25 !== undefined) {
    const band = bandIn("pcd-pm25-annual", city.province, "low");
    const base: L = {
      en: `In 2024, annual PM2.5 was ${fmt(r.pm25, 1)} µg/m³`,
      th: `ในปี 2567 PM2.5 เฉลี่ยต่อปี ${fmtTh(r.pm25, 1)} ไมโครกรัม/ลบ.ม.`,
      zh: `2024年 PM2.5 年均 ${fmt(r.pm25, 1)} µg/m³`,
    };
    const clause = clauseByBand(band?.band, [
      {
        en: `, in the first quarter by rank (${band?.rank} of ${band?.of}, lowest first)`,
        th: ` อยู่ในควอไทล์ที่หนึ่ง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่าน้อยไปมาก`,
        zh: `，按数值从低到高排列，位于第一四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the second quarter by rank (${band?.rank} of ${band?.of}, lowest first)`,
        th: ` อยู่ในควอไทล์ที่สอง ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่าน้อยไปมาก`,
        zh: `，按数值从低到高排列，位于第二四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the third quarter by rank (${band?.rank} of ${band?.of}, lowest first)`,
        th: ` อยู่ในควอไทล์ที่สาม ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่าน้อยไปมาก`,
        zh: `，按数值从低到高排列，位于第三四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
      {
        en: `, in the fourth quarter by rank (${band?.rank} of ${band?.of}, lowest first)`,
        th: ` อยู่ในควอไทล์ที่สี่ ตามอันดับ ${band?.rank} จาก ${band?.of} จังหวัด เรียงค่าน้อยไปมาก`,
        zh: `，按数值从低到高排列，位于第四四分位组（第 ${band?.rank} 名，共 ${band?.of} 府）`,
      },
    ]);
    facts.push(sentence(base, clause, SRC.pcd));
  }

  if (facts.length === 0) {
    pushSentence(out, sentence({
      en: `The honest constraint for ${city.nameEn} is that this index holds no load, risk or debt series for ${city.province}. The catch is stated as unknown rather than filled with a plausible warning`,
      th: `ข้อจำกัดที่ซื่อสัตย์ของ${city.nameTh}คือ ดัชนีนี้ยังไม่มีชุดข้อมูลภาระ ความเสี่ยง หรือหนี้สินระดับจังหวัดสำหรับจังหวัด${city.provinceTh} ข้อจำกัดจึงถูกระบุว่ายังไม่ทราบ แทนที่จะเติมคำเตือนที่ฟังดูสมเหตุสมผล`,
      zh: `${city.nameEn} 诚实的制约在于：本指数暂无${city.province}的负荷、风险或债务数据序列。制约被如实标注为未知，而不是填入一条听起来合理的警告`,
    }, null, null));
    return out;
  }

  // The lead-in opens the measured facts and belongs to the first of them.
  if (registered) {
    facts[0] = {
      en: `What the province does carry is measured: ${facts[0].en}`,
      th: `สิ่งที่จังหวัดนี้วัดได้คือ: ${facts[0].th}`,
      zh: `但该府仍有可测量的部分：${facts[0].zh}`,
    };
  }
  for (const f of facts) pushSentence(out, f);

  return out;
}

// ── THE UNANSWERED QUESTION ──────────────────────────────────────────────
//
// Codex's field guide asks for "useful unanswered questions" instead of
// generic advice. The question this index cannot answer has to be the one
// that matters MOST for this city — and 67 of the 68 generated cities
// share the same smart dimension, so a question keyed to the dimension
// alone would be the same sentence 67 times over.
//
// So the question is keyed to the province's own most EXTREME reading
// instead: the traffic question for the province with the worst road
// death count, the reach question for the one where most work is
// informal, the usage question for the one with the thinnest network.
// The question never quotes a number, because every number it could
// quote already appears in another field on the same page.

interface Signal {
  /** How notable this reading is for this province, 0 (unremarkable) to 1. */
  weight: number;
  /** The question, without the lead-in. */
  en: string;
  th: string;
  zh: string;
}

/** A rank turned into "how extreme", with 1 meaning the most extreme end. */
function extreme(rank: number | undefined, of: number | undefined, invert = false): number {
  if (rank === undefined || of === undefined || of <= 1) return 0;
  const z = (rank - 1) / (of - 1);
  return invert ? z : 1 - z;
}

function buildUnanswered(city: SmartCity, r: ProvinceReading): Voice["unanswered"] {
  const signals: Signal[] = [];

  const deaths = bandIn("rtddi-road-deaths", city.province, "high");
  signals.push({
    weight: extreme(deaths?.rank, deaths?.of),
    en: `whether traffic fell on the roads the service touches: this index holds no road-level traffic or journey-time record for ${city.province}`,
    th: `การจราจรบนถนนที่บริการนี้เกี่ยวข้องลดลงหรือไม่ ดัชนีนี้ยังไม่มีข้อมูลการจราจรหรือเวลาเดินทางระดับถนนสำหรับจังหวัด${city.provinceTh}`,
    zh: `服务所涉路段的交通量是否下降。本指数暂无${city.province}的路段级流量或行程时间记录。`,
  });

  const pm25 = bandIn("pcd-pm25-annual", city.province, "high");
  signals.push({
    weight: extreme(pm25?.rank, pm25?.of),
    en: `whether the registered project moved the province's air: this index holds no project-level emission record for ${city.province}`,
    th: `โครงการที่ขึ้นทะเบียนช่วยให้อากาศของจังหวัดดีขึ้นจริงหรือไม่ ดัชนีนี้ยังไม่มีข้อมูลการปล่อยมลพิษระดับโครงการสำหรับจังหวัด${city.provinceTh}`,
    zh: `已登记的项目是否真的改善了该府的空气。本指数暂无${city.province}的项目级排放记录。`,
  });

  const informal = informalBand(r);
  signals.push({
    weight: extreme(informal?.rank, informal?.of),
    en: `who the registered programme actually reached: this index holds no programme reach or training record for ${city.province}`,
    th: `โครงการที่ขึ้นทะเบียนไปถึงใครได้บ้างจริง ดัชนีนี้ยังไม่มีข้อมูลการเข้าถึงหรือการฝึกอบรมระดับโครงการสำหรับจังหวัด${city.provinceTh}`,
    zh: `已登记的项目究竟覆盖了谁。本指数暂无${city.province}的项目级覆盖或培训记录。`,
  });

  const nonDurable = bandIn("nso-non-durable-housing", city.province, "high");
  signals.push({
    weight: extreme(nonDurable?.rank, nonDurable?.of),
    en: `what was actually done about the province's housing stock: this index holds no retrofit or building-completion record for ${city.province}`,
    th: `มีการดำเนินการกับที่อยู่อาศัยของจังหวัดอย่างไรจริง ดัชนีนี้ยังไม่มีข้อมูลการปรับปรุงหรือการก่อสร้างที่เสร็จสมบูรณ์สำหรับจังหวัด${city.provinceTh}`,
    zh: `该府的住房存量究竟被怎样处理过。本指数暂无${city.province}的改造或竣工记录。`,
  });

  const internet = internetBand(r);
  signals.push({
    // A thin network is the notable end here: it is where a digital
    // service is least able to reach people on its own.
    weight: extreme(internet?.rank, internet?.of, true),
    en: `which daily service residents actually used: this index holds no usage record for ${city.province}`,
    th: `บริการในชีวิตประจำวันข้อใดที่ประชาชนใช้จริง ดัชนีนี้ยังไม่มีข้อมูลการใช้บริการสำหรับจังหวัด${city.provinceTh}`,
    zh: `居民实际使用的是哪一项日常服务。本指数暂无${city.province}的使用记录。`,
  });

  const best = signals.reduce((a, b) => (b.weight > a.weight ? b : a));

  // The lead-in varies with the registry status, which is a real fact
  // about the city and not a mood.
  const lead = city.status === "registered"
    ? { en: `The open question for ${city.nameEn} is `, th: `คำถามที่ยังค้างอยู่สำหรับ${city.nameTh}คือ `, zh: `${city.nameEn} 尚未回答的问题是：` }
    : city.status === "promotion"
      ? { en: `What ${city.nameEn} still has to prove is `, th: `สิ่งที่${city.nameTh}ยังต้องพิสูจน์คือ `, zh: `${city.nameEn} 仍需证明的是：` }
      : { en: `The question this index cannot close for ${city.nameEn} is `, th: `คำถามที่ดัชนีนี้ยังตอบให้${city.nameTh}ไม่ได้คือ `, zh: `本指数无法为${city.nameEn}闭合的问题是：` };

  return {
    en: `${lead.en}${best.en}.`,
    th: `${lead.th}${best.th}`,
    zh: `${lead.zh}${best.zh}`,
  };
}

/**
 * Take one sentence out of a field to serve as its pull quote, and leave
 * the rest in place.
 *
 * The sentence chosen is the one this province is MOST UNUSUAL on — the
 * reading whose band is the top quarter of the country. Position is not a
 * good rule: the first sentence measured is not always the distinctive
 * one, and taking the wrong one out leaves the row with only the readings
 * that cluster, which is how a field ends up reading the same for eight
 * provinces at once.
 */
function splitLandmark(set: SentenceSet): {
  landmark: { en: string; th: string; zh: string };
  famousForRest: { en: string; th: string; zh: string };
} {
  if (set.en.length === 0) {
    return {
      landmark: { en: "", th: "", zh: "" },
      famousForRest: { en: "", th: "", zh: "" },
    };
  }
  const bands = set.bands ?? [];
  let index = bands.findIndex(b => b === 0);
  if (index < 0) index = 0;
  const rest = set.en.filter((_, i) => i !== index);
  return {
    landmark: {
      en: set.en[index],
      th: set.th[index] ?? "",
      zh: set.zh[index] ?? "",
    },
    famousForRest: {
      en: rest.join(" "),
      th: set.th.filter((_, i) => i !== index).join(" "),
      zh: set.zh.filter((_, i) => i !== index).join(" "),
    },
  };
}

/**
 * The full voice for a city that has no hand-written context. Reads the
 * city's province once and writes four sentences from four different
 * readings, so each sentence carries a different fact.
 */
export function buildProvinceVoice(city: SmartCity): Voice {
  const r = readProvince(city.province);
  const livelihood = buildLivelihood(city, r);
  const famousFor = buildFamousFor(city, r);
  const opportunity = buildOpportunity(city, r);
  const theCatch = buildTheCatch(city, r);
  const { landmark, famousForRest } = splitLandmark(famousFor);
  return {
    landmark,
    famousForRest,
    livelihood: {
      en: joinLocale(livelihood.en, "en"),
      th: joinLocale(livelihood.th, "th"),
      zh: joinLocale(livelihood.zh, "zh"),
    },
    famousFor: {
      en: joinLocale(famousFor.en, "en"),
      th: joinLocale(famousFor.th, "th"),
      zh: joinLocale(famousFor.zh, "zh"),
    },
    opportunity: {
      en: joinLocale(opportunity.en, "en"),
      th: joinLocale(opportunity.th, "th"),
      zh: joinLocale(opportunity.zh, "zh"),
    },
    theCatch: {
      en: joinLocale(theCatch.en, "en"),
      th: joinLocale(theCatch.th, "th"),
      zh: joinLocale(theCatch.zh, "zh"),
    },
    unanswered: buildUnanswered(city, r),
  };
}

/**
 * The raw, un-joined sentences — for the instrument, not for the page.
 * The audit needs to see where one sentence ends and the next begins;
 * a finished string has already hidden that.
 */
export function buildProvinceSentenceSets(city: SmartCity): {
  livelihood: SentenceSet;
  famousFor: SentenceSet;
  opportunity: SentenceSet;
  theCatch: SentenceSet;
} {
  const r = readProvince(city.province);
  return {
    livelihood: buildLivelihood(city, r),
    famousFor: buildFamousFor(city, r),
    opportunity: buildOpportunity(city, r),
    theCatch: buildTheCatch(city, r),
  };
}
