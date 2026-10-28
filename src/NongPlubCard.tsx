import React from "react";
import type { Locale, SmartCity } from "./types";
import { getNongPlubRecord, getNongPlubOutfitLabel, NONG_PLUB_AVATAR } from "./nongPlubData";
import { getCityName } from "./cityPresentation";

interface NongPlubCardProps {
  city: SmartCity;
  locale: Locale;
  className?: string;
}

export function NongPlubCard({ city, locale, className = "" }: NongPlubCardProps) {
  const record = getNongPlubRecord(city);
  const cityName = getCityName(city, locale);
  const outfitLabel = getNongPlubOutfitLabel(record.outfit, locale);

  const t = (en: string, th: string, zh: string) => {
    if (locale === "th") return th;
    if (locale === "zh") return zh;
    return en;
  };

  return (
    <aside
      className={`nong-plub-card ${className}`}
      aria-label={`${t("Nong Plub's sketchbook", "สมุดภาพน้องพลับ", "小普的画册")} — ${cityName}`}
    >
      <img
        src={record.assetPath}
        alt={`${t("Crayon illustration of Nong Plub", "ภาพน้องพลับวาดด้วยสีเทียน", "小普蜡笔插画")} · ${outfitLabel}`}
        className="nong-plub-illustration"
        loading="lazy"
        width={160}
        height={200}
      />
      <div className="nong-plub-story-col">
        <h3 className="nong-plub-site-name">{t("Nong Plub's sketchbook", "สมุดภาพน้องพลับ", "小普的画册")}</h3>
        <p className="nong-plub-disclosure">{record.illustrationDisclosure[locale]}</p>
        <details className="nong-plub-reading">
          <summary>{t("Read the provincial note", "อ่านบันทึกบริบทจังหวัด", "阅读省级背景")}</summary>
          <p>{record.quote[locale]}</p>
          <p>{record.tip[locale]}</p>
          {record.sourceUrl && <a href={record.sourceUrl} target="_blank" rel="noopener noreferrer">
            {record.siteName[locale]} ↗
          </a>}
        </details>
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
