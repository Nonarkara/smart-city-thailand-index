// ---------------------------------------------------------------------------
// InvestmentFit — Nong Plub's investment-positioning focal point
//
// One investment category per city, derived from data only. Never claimed
// without a metric behind it. Registered cities return null.
// ---------------------------------------------------------------------------

import type { Locale, SmartCity } from "./types";
import { getInvestmentFit, INVESTMENT_POSITIONING } from "./cityAnalytics";

interface InvestmentFitProps {
  city: SmartCity;
  locale: Locale;
}

export default function InvestmentFit({ city, locale }: InvestmentFitProps) {
  const fit = getInvestmentFit(city);
  if (!fit) return null;

  const t = (en: string, th: string, zh: string) => {
    if (locale === "th") return th;
    if (locale === "zh") return zh;
    return en;
  };

  const positioning = INVESTMENT_POSITIONING[locale];

  return (
    <section className="section investment-fit">
      <div className="investment-fit-inner">
        <div className="investment-fit-speak">
          <span className="investment-fit-quote mascot-hand">{positioning}</span>
        </div>
        <div className="investment-fit-body">
          <h2 className="investment-fit-category">{fit.label[locale]}</h2>
          <p className="investment-fit-reason mascot-hand">{fit.reason[locale]}</p>
          <p className="investment-fit-metric">{t("Metric", "ตัวชี้วัด", "指标")}: {fit.metric}</p>
        </div>
      </div>
    </section>
  );
}
