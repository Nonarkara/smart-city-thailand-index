// ---------------------------------------------------------------------------
// Province Narrative — four sentences per city, each from measured data
// ---------------------------------------------------------------------------
// This module writes the "human layer" for the 68 cities that have no
// hand-written context. Each of the four fields (livelihood, famousFor,
// opportunity, theCatch) is assembled from a DIFFERENT set of measured
// values, so the four sentences never say the same thing, and so no two
// cities say the same thing.
//
// The writing rule that keeps it honest: a sentence must name the number,
// the source, and the scope — and must be falsifiable by the next reader
// with the same dataset. "A tourism city with strong infrastructure" is
// not a sentence. "Province-level electricity use is 6,021 kWh per person
// against a national median of 4,112 (Ministry of Energy, 2023)" is.
//
// Every figure below comes from PROVINCE_BASELINE_BY_ID or
// ABSORPTION_PROVINCES. Nothing is estimated. Where a province has no
// record for a measure, the sentence names the absence rather than
// inventing a value.
// ---------------------------------------------------------------------------

import {
  absorptionRank,
  formatNumber as fmt,
  formatNumberTh as fmtTh,
  informalShare,
  populationText,
  rankIn,
  readProvince,
  type ProvinceReading,
} from "./provinceVoice.ts";
import type { SmartCity } from "./types.ts";

export interface Voice {
  livelihood: { en: string; th: string; zh: string };
  famousFor: { en: string; th: string; zh: string };
  opportunity: { en: string; th: string; zh: string };
  theCatch: { en: string; th: string; zh: string };
}

// ── Shared vocabulary ──────────────────────────────────────────────────────

// ── LIVELIHOOD: what work the place actually has ──────────────────────────
// Built from the labour force, the informal share, the internal migration
// and the population. This is the "who lives here and how" sentence.

function buildLivelihood(city: SmartCity, r: ProvinceReading): Voice["livelihood"] {
  const informal = informalShare(r);
  const pop = r.population;
  const lf = r.labourForce;
  const migration = r.internalMigration;

  const en: string[] = [];
  const th: string[] = [];
  const zh: string[] = [];

  // Population and labour force.
  if (pop !== undefined) {
    en.push(`The province carries ${populationText(pop, "en")}`);
    th.push(`จังหวัดมีประชากร ${populationText(pop, "th")}`);
    zh.push(`该府有 ${populationText(pop, "zh")}`);
    if (lf !== undefined) {
      en.push(`and a labour force of ${populationText(lf, "en")}`);
      th.push(`แรงงาน ${populationText(lf, "th")}`);
      zh.push(`劳动力 ${populationText(lf, "zh")}`);
    }
    en.push("(NSO, 2022–26).");
    th.push("(สชิต 2565–69)");
    zh.push("（泰国国家统计局，2022–26年）。");
  } else {
    en.push(`${city.nameEn} sits in ${city.province}, where this index holds no provincial population record`);
    th.push(`${city.nameTh} อยู่ในจังหวัด${city.provinceTh} ซึ่งดัชนีนี้ยังไม่มีข้อมูลประชากรระดับจังหวัด`);
    zh.push(`${city.nameEn} 位于${city.province}，本指数暂无该府人口记录`);
  }

  // The informal share is the single most human fact available: it says
  // how much of the working population has no formal cover.
  if (informal !== undefined) {
    const high = informal >= 45;
    en.push(
      high
        ? `${fmt(informal, 1)}% of that labour force is in informal work — the highest-cost fact for any service designed around employment records.`
        : `${fmt(informal, 1)}% of that labour force is in informal work, so a service keyed to formal records will miss most of them.`
    );
    th.push(
      high
        ? `ร้อยละ ${fmtTh(informal, 1)} ของแรงงานนั้นอยู่ในการจ้างงานนอกระบบ ซึ่งเป็นข้อเท็จจริงที่แพงที่สุดสำหรับบริการใดที่ออกแบบโดยยึดทะเบียนการจ้างงาน`
        : `ร้อยละ ${fmtTh(informal, 1)} ของแรงงานนั้นอยู่ในการจ้างงานนอกระบบ บริการที่ออกแบบยึดทะเบียนการจ้างงานจึงมองไม่เห็นคนส่วนใหญ่`
    );
    zh.push(
      high
        ? `其中 ${fmt(informal, 1)}% 的劳动力从事非正规就业——这是任何以就业登记为设计前提的服务最昂贵的事实。`
        : `其中 ${fmt(informal, 1)}% 的劳动力从事非正规就业，因此以正式登记为基础的服务会漏掉大多数人。`
    );
  }

  // Internal migration is a PERCENTAGE in this series, not a head count.
  if (migration !== undefined) {
    en.push(`Internal migration runs at ${fmt(migration, 1)}% of the province's population — the share who moved in or out (NSO).`);
    th.push(`การย้ายถิ่นภายในจังหวัดอยู่ที่ ${fmtTh(migration, 1)}% ของประชากรจังหวัด คือสัดส่วนผู้ย้ายเข้าหรือย้ายออก (สชิต)`);
    zh.push(`省内迁移占该府人口的 ${fmt(migration, 1)}%——即迁入或迁出者的份额（泰国国家统计局）。`);
  }

  return {
    en: en.join(" "),
    th: th.join(" "),
    zh: zh.join(" "),
  };
}

// ── FAMOUS FOR: the one measured thing that sets this place apart ────────
// Deliberately built from a different set of readings than the livelihood:
// physical environment, air, electricity, water.

function buildFamousFor(city: SmartCity, r: ProvinceReading): Voice["famousFor"] {
  const en: string[] = [];
  const th: string[] = [];
  const zh: string[] = [];

  const forest = r.forestCoverage;
  const pm25 = r.pm25;
  const elec = r.electricityPerCapita;
  const water = r.drinkingWater;

  // Forest cover is the most legible "landscape" fact.
  //
  // rfd-forest-coverage is stored as a PERCENTAGE throughout — Mae Hong
  // Son 84.7, Sing Buri 0.1. It is never a fraction, so it must not be
  // multiplied by 100: doing so turns Nonthaburi's 0.0% into 0% but
  // Bangkok's 0.4% into 40%, which is a hundred-fold lie.
  if (forest !== undefined) {
    const rank = rankIn("rfd-forest-coverage", city.province, "high");
    if (forest === 0) {
      // A verified zero, not a missing value. The sentence attributes it
      // to the source rather than printing "0.0%", which would claim a
      // precision the reading does not carry.
      en.push(`The Royal Forest Department records no forest cover for ${city.province}`);
      th.push(`กรมป่าไม้ไม่มีข้อมูลพื้นที่ป่าสำหรับจังหวัด${city.provinceTh}`);
      zh.push(`皇家林业厅未记录${city.province}的森林覆盖`);
    } else {
      en.push(`${fmt(forest, 1)}% of ${city.province} is forest (Royal Forest Department)`);
      th.push(`${fmtTh(forest, 1)}% ของจังหวัด${city.provinceTh} เป็นพื้นที่ป่า (กรมป่าไม้)`);
      zh.push(`${city.province}有 ${fmt(forest, 1)}% 为森林（皇家林业厅）`);
    }
    if (rank && rank.rank <= 5) {
      en.push(`— the ${rank.rank}${rank.rank === 1 ? "st" : rank.rank === 2 ? "nd" : rank.rank === 3 ? "rd" : "th"} most forested of the ${rank.of} measured provinces.`);
      th.push(`— สูงเป็นอันดับ ${rank.rank} จาก ${rank.of} จังหวัดที่มีข้อมูล`);
      zh.push(`— 在 ${rank.of} 个有数据府中排名第 ${rank.rank}`);
    }
  }

  // Air quality: the fact that decides whether outdoor life is possible.
  if (pm25 !== undefined) {
    const rank = rankIn("pcd-pm25-annual", city.province, "low");
    en.push(`Annual PM2.5 is ${fmt(pm25, 1)} µg/m³ (Pollution Control Department)`);
    th.push(`PM2.5 เฉลี่ยต่อปี ${fmtTh(pm25, 1)} ไมโครกรัม/ลบ.ม. (กรมควบคุมมลพิษ)`);
    zh.push(`PM2.5 年均 ${fmt(pm25, 1)} µg/m³（污染控制厅）`);
    if (rank && rank.rank <= 3) {
      en.push(`— among the cleanest of the ${rank.of} provinces measured`);
      th.push(`— อยู่ในกลุ่มที่อากาศดีที่สุดของ ${rank.of} จังหวัดที่มีข้อมูล`);
      zh.push(`— 在 ${rank.of} 个有数据府中空气最洁净之列`);
    } else if (rank && rank.rank >= rank.of - 2) {
      en.push(`— among the most polluted of the ${rank.of} provinces measured, which sets a hard ceiling on any outdoor-facing service`);
      th.push(`— อยู่ในกลุ่มที่มีมลพิษสูงสุดของ ${rank.of} จังหวัดที่มีข้อมูล ซึ่งกำหนดเพดานของบริการกลางแจ้งไว้ต่ำ`);
      zh.push(`— 在 ${rank.of} 个有数据府中污染最重之列，这为一切户外服务设下了硬上限`);
    }
  }

  // Electricity per person separates a serviced place from an unserviced one.
  if (elec !== undefined) {
    en.push(`Electricity runs at ${fmt(elec)} kWh per person a year (Ministry of Energy, 2023).`);
    th.push(`การใช้ไฟฟ้า ${fmtTh(elec)} กิโลวัตต์-ชั่วโมงต่อคนต่อปี (กรมพลังงาน 2566)`);
    zh.push(`人均年用电量 ${fmt(elec)} 千瓦时（能源厅，2023年）。`);
  }

  if (water !== undefined) {
    en.push(`Drinking water reaches ${fmt(water, 1)}% of residents (NSO).`);
    th.push(`น้ำดื่มเข้าถึงประชากร ${fmtTh(water, 1)}% (สชิต)`);
    zh.push(`饮用水覆盖 ${fmt(water, 1)}% 的居民（泰国国家统计局）。`);
  }

  if (en.length === 0) {
    en.push(`${city.nameEn} is registered in ${city.province}. This index holds no province-level physical reading for it yet, so nothing is claimed beyond the registry position.`);
    th.push(`${city.nameTh} ขึ้นทะเบียนในจังหวัด${city.provinceTh} ดัชนีนี้ยังไม่มีตัวเลขระดับจังหวัดด้านสภาพกายภาพสำหรับจังหวัดนี้ จึงไม่มีการอ้างสิ่งใดเกินสถานะในทะเบียน`);
    zh.push(`${city.nameEn} 登记于${city.province}。本指数尚无该府的省级自然条件读数，因此除登记状态外不作任何声明。`);
  }

  return { en: en.join(" "), th: th.join(" "), zh: zh.join(" ") };
}

// ── OPPORTUNITY: what this place could do that it cannot yet ─────────────
// Built from capacity, connectivity and growth — the infrastructure side.

function buildOpportunity(city: SmartCity, r: ProvinceReading): Voice["opportunity"] {
  const en: string[] = [];
  const th: string[] = [];
  const zh: string[] = [];

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
  const pop = r.population;
  if (net !== undefined) {
    const rank = rankIn("nso-internet-users", city.province, "high");
    if (pop !== undefined && pop > 0) {
      const share = (net / pop) * 100;
      en.push(`About ${fmt(share, 0)}% of residents are internet users`);
      th.push(`ประมาณ ${fmtTh(share, 0)}% ของประชากรเป็นผู้ใช้อินเทอร์เน็ต`);
      zh.push(`约 ${fmt(share, 0)}% 的居民是互联网用户`);
    } else {
      en.push(`${populationText(net, "en")} use the internet`);
      th.push(`มีผู้ใช้อินเทอร์เน็ต ${populationText(net, "th")}`);
      zh.push(`互联网用户 ${populationText(net, "zh")}`);
    }
    if (rank) {
      en.push(`— rank ${rank.rank} of ${rank.of} measured provinces`);
      th.push(`— อันดับ ${rank.rank} จาก ${rank.of} จังหวัดที่มีข้อมูล`);
      zh.push(`— 在 ${rank.of} 个有数据府中排第 ${rank.rank}`);
    }
    en.push("(NSO).");
    th.push("(สชิต)");
    zh.push("（泰国国家统计局）。");
  }

  if (mobile !== undefined) {
    if (pop !== undefined && pop > 0) {
      const share = (mobile / pop) * 100;
      en.push(`About ${fmt(share, 0)}% of residents hold a mobile subscription, so a phone-first service reaches nearly everyone without new hardware.`);
      th.push(`ประมาณ ${fmtTh(share, 0)}% ของประชากรมีการสมัครใช้โทรศัพท์เคลื่อนที่ บริการที่ออกแบบให้ใช้โทรศัพท์ก่อนจึงเข้าถึงคนเกือบทั้งหมดโดยไม่ต้องซื้อฮาร์ดแวร์ใหม่`);
      zh.push(`约 ${fmt(share, 0)}% 的居民持有移动电话订阅，因此以手机为先的服务无需新增硬件即可触达几乎所有人。`);
    } else {
      en.push(`${populationText(mobile, "en")} hold a mobile subscription.`);
      th.push(`มีผู้สมัครใช้โทรศัพท์เคลื่อนที่ ${populationText(mobile, "th")}`);
      zh.push(`移动电话订阅用户 ${populationText(mobile, "zh")}。`);
    }
  }

  // Residential permits are the forward signal: building pressure.
  if (permits !== undefined) {
    const rank = rankIn("nso-residential-permits", city.province, "high");
    en.push(`${fmt(permits)} building permits were issued (NSO).`);
    th.push(`มีการอนุญาตก่อสร้าง ${fmtTh(permits)} ใบ (สชิต)`);
    zh.push(`已签发 ${fmt(permits)} 份建筑许可（泰国国家统计局）`);
    if (rank && rank.rank <= 10) {
      en.push(`— among the ${rank.rank} busiest of ${rank.of} provinces, which is where a capacity constraint bites first.`);
      th.push(`— อยู่ในกลุ่มที่มีการก่อสร้างหนานแน่นที่สุด ${rank.of} จังหวัด ซึ่งเป็นจุดที่ข้อจำกัดด้านศักยภาพจะกัดก่อน`);
      zh.push(`— 位列 ${rank.of} 个有数据府中建设最活跃的前 ${rank.rank} 位，这正是容量约束最先发作的地方`);
    }
  }

  if (en.length === 0) {
    en.push(`The buildable case for ${city.nameEn} has to be made from its own records. This index holds no provincial connectivity or permit series for ${city.province}, so the opportunity section stays open rather than filled with a plausible-sounding plan.`);
    th.push(`กรณีที่${city.nameTh}จะเติบโตต้องเรียบเรียงจากบันทึกของเมืองเอง ดัชนีนี้ยังไม่มีชุดข้อมูลการเชื่อมต่อหรือใบอนุญาตระดับจังหวัดสำหรับจังหวัด${city.provinceTh} ส่วนโอกาสจึงเปิดค้างไว้ แทนที่จะเติมแผนที่ฟังดูเป็นไปได้`);
    zh.push(`${city.nameEn} 的增长可能性必须依据其自身记录来论证。本指数暂无${city.province}的省级连通性或许可数据，因此机遇部分保持开放，而不是填入一份听来合理的计划。`);
  }

  return { en: en.join(" "), th: th.join(" "), zh: zh.join(" ") };
}

// ── THE CATCH: what will stop it working ─────────────────────────────────
// Built from the load, the risk and the debt: the numbers that describe
// what a city has to absorb.

function buildTheCatch(city: SmartCity, r: ProvinceReading): Voice["theCatch"] {
  const en: string[] = [];
  const th: string[] = [];
  const zh: string[] = [];

  // A registered city has no public implementation evidence, and that is
  // the frame its constraint has to be read in: registry status is not
  // live deployment. The caveat leads, and the measured facts follow —
  // dropping the caveat would let a set of real numbers read as proof
  // that the city is running.
  if (city.status === "registered") {
    en.push("The key constraint is registry status: being in the depa promotion registry is not the same thing as live deployment, so this dossier stays conservative until public implementation evidence appears.");
    th.push("ข้อจำกัดหลักคือสถานะในทะเบียน: การอยู่ในทะเบียนส่งเสริมของ depa ไม่ใช่สิ่งเดียวกับการมีระบบใช้งานจริง ดอสซิเยร์นี้จึงเล่าอย่างระมัดระวังจนกว่าจะมีหลักฐานสาธารณะของการดำเนินงาน");
    zh.push("核心制约是登记状态：列入depa推广名录不等于系统已上线运行，因此在公开实施证据出现之前，本档案应保持审慎表述。");
    en.push("What the province does carry is measured:");
    th.push("สิ่งที่จังหวัดนี้วัดได้คือ:");
    zh.push("但该府仍有可测量的部分：");
  }

  // The unplanned population share is the sharpest fact in the dataset:
  // the people the household register does not count.
  const unplanned = r.absorptionUnplanned;
  const registered = r.absorptionRegistered;
  if (unplanned !== undefined && registered !== undefined && registered > 0) {
    const share = (unplanned / registered) * 100;
    const rank = absorptionRank(city.province);
    en.push(`${fmt(unplanned)} people live in ${city.province} without being on its household register — ${fmt(share, 1)}% of the register itself (NSO/DOPA, BE 2568).`);
    th.push(`มี ${fmtTh(unplanned)} คนอาศัยอยู่ในจังหวัด${city.provinceTh} โดยไม่ได้ขึ้นทะเบียนทะเบียนราษฎร์ของจังหวัด คิดเป็น ${fmtTh(share, 1)}% ของตัวทะเบียนเอง (สชิต/กรมการปกครอง พ.ศ. 2568)`);
    zh.push(`有 ${fmt(unplanned)} 人居住在${city.province}，但不在该府户籍登记册上——相当于登记册本身的 ${fmt(share, 1)}%（泰国国家统计局/内政厅，2568佛历）。`);
    if (rank && rank.rank <= 10) {
      en.push(`That is rank ${rank.rank} of ${rank.of} measured provinces: infrastructure planned against the register alone will be sized for a fraction of the people who actually live here.`);
      th.push(`นับเป็นอันดับ ${rank.rank} จาก ${rank.of} จังหวัดที่มีข้อมูล โครงสร้างพื้นฐานที่วางแผนจากทะเบียนเพียงอย่างเดียวจึงถูกขนาดไว้สำหรับคนเพียงส่วนหนึ่งของผู้อาศัยจริง`);
      zh.push(`这在 ${rank.of} 个有数据府中排第 ${rank.rank}：仅按登记册规划的Infrastructure，其规模只对应实际居住人口的一部分。`);
    }
  }

  // Road deaths: the safety fact with an actual body count.
  const deaths = r.roadDeaths;
  const moto = r.motorcycleShare;
  if (deaths !== undefined) {
    en.push(`Road deaths in the province were ${fmt(deaths)} (RTDDI).`);
    th.push(`ผู้เสียชีวิตจากอุบัติเหตุทางถนนในจังหวัดอยู่ที่ ${fmtTh(deaths)} ราย (สทช.)`);
    zh.push(`该府道路死亡 ${fmt(deaths)} 人（陆路交通安全中心）。`);
    if (moto !== undefined) {
      en.push(`Motorcycles carry ${fmt(moto, 1)}% of registered vehicles, so the exposure sits with the riders who commute on the same roads the service would use.`);
      th.push(`รถจักรยานยนต์มีสัดส่วน ${fmtTh(moto, 1)}% ของยานจดทะเบียน ความเสี่ยงจึงอยู่ที่ผู้ใช้รถจักรยานยนต์ที่สัญจรบนถนนเดียวกับที่บริการจะใช้`);
      zh.push(`摩托车占注册车辆的 ${fmt(moto, 1)}%，因此风险集中在与服务使用同一条道路通勤的骑行者身上。`);
    }
  }

  // PM2.5, when it is bad, is the ceiling on outdoor life.
  if (r.pm25 !== undefined && r.pm25 >= 23) {
    en.push(`With annual PM2.5 at ${fmt(r.pm25, 1)} µg/m³, any service that depends on people standing outdoors — waiting, walking, queuing — starts from a health penalty.`);
    th.push(`เมื่อ PM2.5 เฉลี่ยต่อปีอยู่ที่ ${fmtTh(r.pm25, 1)} ไมโครกรัม/ลบ.ม. บริการใดที่ต้องให้คนยืนกลางแจ้ง เช่น การรอ การเดิน การต่อคิว จึงเริ่มต้นจากต้นทุนด้านสุขภาพ`);
    zh.push(`年均 PM2.5 为 ${fmt(r.pm25, 1)} µg/m³ 时，任何需要人站在户外的服务——候车、步行、排队——都从一笔健康代价起步。`);
  }

  if (en.length === 0) {
    en.push(`The honest constraint for ${city.nameEn} is that this index holds no load, risk or debt series for ${city.province}. The catch is stated as unknown rather than filled with a plausible warning.`);
    th.push(`ข้อจำกัดที่ซื่อสัตย์ของ${city.nameTh}คือ ดัชนีนี้ยังไม่มีชุดข้อมูลภาระ ความเสี่ยง หรือหนี้สินระดับจังหวัดสำหรับจังหวัด${city.provinceTh} ข้อจำกัดจึงถูกระบุว่ายังไม่ทราบ แทนที่จะเติมคำเตือนที่ฟังดูสมเหตุสมผล`);
    zh.push(`${city.nameEn} 诚实的制约在于：本指数暂无${city.province}的负荷、风险或债务数据序列。制约被如实标注为未知，而不是填入一条听起来合理的警告。`);
  }

  return { en: en.join(" "), th: th.join(" "), zh: zh.join(" ") };
}

/**
 * The full voice for a city that has no hand-written context. Reads the
 * city's province once and writes four sentences from four different
 * readings, so each sentence carries a different fact.
 */
export function buildProvinceVoice(city: SmartCity): Voice {
  const r = readProvince(city.province);
  return {
    livelihood: buildLivelihood(city, r),
    famousFor: buildFamousFor(city, r),
    opportunity: buildOpportunity(city, r),
    theCatch: buildTheCatch(city, r),
  };
}
