import React from "react";
import { LEAGUE_LABELS, PILLAR_LABELS, type Locale, type SmartCity } from "./types";
import { getNongPlubProfile } from "./nongPlubProfile";
import { SCITI_DATA_CUTOFF_ISO } from "./methodologySpec";
import { getNongPlubRecord, getNongPlubOutfitLabel, NONG_PLUB_AVATAR } from "./nongPlubData";
import { getCityName, getDistinctProvinceName } from "./cityPresentation";

interface NongPlubCardProps {
  city: SmartCity;
  locale: Locale;
  className?: string;
}

export function NongPlubCard({ city, locale, className = "" }: NongPlubCardProps) {
  const record = getNongPlubRecord(city);
  const cityName = getCityName(city, locale);
  const profile = getNongPlubProfile(city);
  const province = getDistinctProvinceName(city, locale);
  const outfitLabel = getNongPlubOutfitLabel(record.outfit, locale);

  const t = (en: string, th: string, zh: string) => {
    if (locale === "th") return th;
    if (locale === "zh") return zh;
    return en;
  };

  return (
    <aside
      className={`nong-plub-card nong-plub-infographic ${className}`}
      aria-label={`${t("Nong Plub introduces this city", "น้องพลับชวนรู้จักเมือง", "小普带你认识城市")} — ${cityName}`}
    >
      <header className="nong-plub-intro-header">
        <h3 className="nong-plub-site-name">{t("Nong Plub’s city guide", "น้องพลับชวนรู้จักเมือง", "小普的城市指南")}</h3>
        <p>{[city.league ? LEAGUE_LABELS[locale][city.league] : t("Project scope unverified", "ขอบเขตโครงการยังไม่ยืนยัน", "项目范围待核实"), province].filter(Boolean).join(" · ")}</p>
      </header>
      <img
        src={record.assetPath}
        alt={`${t("Crayon illustration of Nong Plub", "ภาพน้องพลับวาดด้วยสีเทียน", "小普蜡笔插画")} · ${outfitLabel}`}
        className="nong-plub-illustration"
        loading="lazy"
        width={160}
        height={200}
      />
      <div className="nong-plub-story-col">
        <p className="nong-plub-profile-label">{profile.assessed ? t("Seven research pillars · /100", "คะแนนวิจัย 7 ด้าน · /100", "七项研究维度 · /100") : t("All seven pillars await assessment", "ทั้งเจ็ดด้านรอการประเมิน", "七个维度均待评估")}</p>
        <ol className={`nong-plub-signals${profile.assessed === 0 ? " nong-plub-unassessed" : ""}`} aria-label={t("Seven curated research scores", "คะแนนวิจัยทั้งเจ็ดด้าน", "七项研究评分")}>
          {profile.rows.map(({ pillar, value }) => <li key={pillar} data-pillar={pillar} data-score={value ?? "unassessed"} data-extreme={profile.highest.includes(pillar) ? "highest" : profile.lowest.includes(pillar) ? "lowest" : undefined}>
            <span className="nong-plub-pillar">{PILLAR_LABELS[locale][pillar]}</span>
            {profile.assessed > 0 && <svg viewBox="-3 0 106 10" preserveAspectRatio="none" aria-hidden="true"><line x1="0" x2="100" y1="5" y2="5" />{value !== null && <><line className="signal-value" x1="0" x2={value} y1="5" y2="5"/><line className="signal-point" x1={value} x2={value} y1="5" y2="5"/></>}</svg>}
            {profile.assessed > 0 && <span className="nong-plub-signal-number">{value ?? "—"}</span>}
          </li>)}
        </ol>
        {profile.assessed === 0 && <a className="nong-plub-culture-link" href={`#heritage-${city.id}`}>{t("Provincial window", "มองผ่านบริบทจังหวัด", "省级文化之窗")}: {record.siteName[locale]} →</a>}
        {profile.highest.length && profile.lowest.length ? <p className="nong-plub-extremes">{t("Highest estimate", "ค่าประมาณสูงสุด", "最高估值")}: {profile.highest.map(pillar => PILLAR_LABELS[locale][pillar]).join(" / ")} · {t("Lowest estimate", "ค่าประมาณต่ำสุด", "最低估值")}: {profile.lowest.map(pillar => PILLAR_LABELS[locale][pillar]).join(" / ")}</p> : <p className="nong-plub-extremes">{profile.assessed === 0 ? t("Gaps are not zero scores.", "ช่องว่างไม่ใช่คะแนนศูนย์", "缺失不等于零分。") : t("No distinct high or low estimate.", "ค่าประมาณไม่มีจุดสูงต่ำที่แตกต่าง", "估值无明显高低差异。")}</p>}
      </div>
      <div className="nong-plub-intro-notes">
        <p className="nong-plub-score-note">{t("Curated research estimates, not verified service coverage. Check source dates and provincial scope in Evidence.", "ค่าประมาณจากการวิจัย ไม่ใช่การยืนยันความครอบคลุมบริการ ตรวจวันที่และขอบเขตจังหวัดในหลักฐาน", "编辑研究估算，并非已核实的服务覆盖率。请在证据页核查来源日期与省级范围。")}</p>
        <p className="nong-plub-disclosure">{t("Baseline cut-off", "วันตัดข้อมูลตั้งต้น", "基线截止日")}: {SCITI_DATA_CUTOFF_ISO.slice(0,10)} · {record.illustrationDisclosure[locale]}</p>
        <details className="nong-plub-reading">
          <summary>{t("Read the provincial note", "อ่านบันทึกบริบทจังหวัด", "阅读省级背景")}</summary>
          <p>{record.quote[locale]}</p>
          <p>{record.tip[locale]}</p>
          {record.sourceUrl && <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">
            {record.siteName[locale]} ↗
          </a>}
        </details>
        <div className="nong-plub-print-source">
          <p>{record.quote[locale]}</p>
          <p>{record.tip[locale]}</p>
          {record.sourceUrl && <p><a href={record.sourceUrl}>{record.siteName[locale]}</a></p>}
        </div>
      </div>
    </aside>
  );
}

/**
 * Compact preview stamp for city cards in directory or gallery view.
 */
export function NongPlubMiniBadge({
  city,
  locale,
  asTag = false,
  onOpen,
}: {
  city: SmartCity;
  locale: Locale;
  asTag?: boolean;
  onOpen?: () => void;
}) {
  const record = getNongPlubRecord(city);
  const t = (en: string, th: string, zh: string) => {
    if (locale === "th") return th;
    if (locale === "zh") return zh;
    return en;
  };

  const content = (
    <>
      <img
        src={NONG_PLUB_AVATAR}
        alt=""
        className="nong-plub-badge-avatar"
        width={20}
        height={20}
      />
      <span className="nong-plub-badge-text">{record.siteName[locale]}</span>
    </>
  );

  if (asTag || !onOpen) {
    return (
      <span
        className="nong-plub-mini-badge nong-plub-mini-tag"
        title={`${t("Provincial visual context:", "ภาพบริบทระดับจังหวัด:", "省级视觉背景:")} ${record.siteName[locale]}`}
      >
        {content}
      </span>
    );
  }

  return (
    <button
      type="button"
      className="nong-plub-mini-badge"
      onClick={event => {
        if (onOpen) {
          event.stopPropagation();
          onOpen();
        }
      }}
      title={`${t("Provincial visual context:", "ภาพบริบทระดับจังหวัด:", "省级视觉背景:")} ${record.siteName[locale]}`}
      aria-label={`${t("Open city dossier:", "เปิดแฟ้มเมือง:", "打开城市档案:")} ${record.siteName[locale]}`}
    >
      {content}
    </button>
  );
}
