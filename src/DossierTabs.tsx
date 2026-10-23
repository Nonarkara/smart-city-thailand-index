import { flushSync } from "react-dom";
import { useEffect, useState } from "react";
import type { Locale } from "./types";

interface Props {
  labels: string[];
  children: React.ReactNode[];
  locale: Locale;
}

export default function DossierTabs({ labels, children, locale }: Props) {
  const [active, setActive] = useState(0);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    const before = () => flushSync(() => setPrinting(true));
    const after = () => setPrinting(false);
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => { window.removeEventListener("beforeprint", before); window.removeEventListener("afterprint", after); };
  }, []);

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
        {printing ? children.map((child, index) => <section key={index} className="dossier-print-section"><h2>{labels[index]}</h2>{child}</section>) : children[active]}
      </div>
    </div>
  );
}
