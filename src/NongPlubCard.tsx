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
    <article
      className={`nong-plub-card ${className}`}
      aria-label={`${t("Nong Plub's Guide", "บันทึกการเดินทางน้องพลับ", "小普城市手记")} — ${cityName}`}
    >
      <div className="nong-plub-figure-col">
        <div className="nong-plub-art-frame">
          <img
            src={record.assetPath}
            alt={`${t("Nong Plub in", "น้องพลับในชุด", "小普身穿")} ${outfitLabel}`}
            className="nong-plub-illustration"
            loading="lazy"
            width={320}
            height={400}
          />
          <span className="nong-plub-outfit-badge">{outfitLabel}</span>
        </div>
      </div>

      <div className="nong-plub-story-col">
        <header className="nong-plub-header">
          <div className="nong-plub-eyebrow-row">
            <span className="nong-plub-eyebrow">
              {t("Human Craft & Lived Experience", "สัมผัสมนุษย์และวิถีชีวิตจริง", "手绘温度与市井烟火")}
            </span>
            <span className="nong-plub-stamp">
              {t("Nong Plub Explores", "น้องพลับพาเที่ยว", "小普带你游")}
            </span>
          </div>
          <h3 className="nong-plub-site-name">{record.siteName[locale]}</h3>
          <p className="nong-plub-activity">{record.activity[locale]}</p>
        </header>

        <div className="nong-plub-quote-box">
          <p className="nong-plub-quote-body">
            &ldquo;{record.quote[locale]}&rdquo;
          </p>
        </div>

        <div className="nong-plub-footer">
          <div className="nong-plub-tip-row">
            <strong className="nong-plub-tip-label">
              {t("Plub's Insider Tip:", "คำแนะนำจากน้องพลับ:", "小普贴士:")}
            </strong>
            <span className="nong-plub-tip-text">{record.tip[locale]}</span>
          </div>

          <div className="nong-plub-flavor-tag">
            <span className="nong-plub-tag-icon" aria-hidden="true">&#9733;</span>
            <span className="nong-plub-tag-text">{record.flavorTag[locale]}</span>
          </div>
        </div>
      </div>
    </article>
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
        alt="Nong Plub"
        className="nong-plub-badge-avatar"
        width={20}
        height={20}
      />
      <span className="nong-plub-badge-text">{record.siteName[locale]}</span>
    </>
  );

  if (asTag) {
    return (
      <span
        className="nong-plub-mini-badge nong-plub-mini-tag"
        title={`${t("Nong Plub's site:", "จุดที่น้องพลับพาไป:", "小普推荐景点:")} ${record.siteName[locale]}`}
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
      title={`${t("Nong Plub's site:", "จุดที่น้องพลับพาไป:", "小普推荐景点:")} ${record.siteName[locale]}`}
      aria-label={`${t("Explore with Nong Plub:", "สำรวจเมืองกับน้องพลับ:", "随小普探索:")} ${record.siteName[locale]}`}
    >
      {content}
    </button>
  );
}
