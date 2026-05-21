import { useState } from "react";
import type { Locale } from "./types";

interface Props {
  labels: string[];
  children: React.ReactNode[];
  locale: Locale;
}

export default function DossierTabs({ labels, children, locale }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="dossier-tabs">
      <div className="dossier-tab-list" role="tablist" aria-label={
        locale === "th" ? "ส่วนของแฟ้มข้อมูลเมือง" :
        locale === "zh" ? "城市档案分区" :
        "City dossier sections"
      }>
        {labels.map((label, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            className={`dossier-tab ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="dossier-tab-panel" role="tabpanel">
        {children[active]}
      </div>
    </div>
  );
}
