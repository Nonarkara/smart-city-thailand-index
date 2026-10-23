import { useState } from "react";
import type { Locale } from "./types";

interface Props {
  labels: string[];
  children: React.ReactNode[];
  locale: Locale;
}

/**
 * THE DOSSIER TABS
 * =================
 * Every panel is in the DOM from the start; only the active one is painted.
 *
 * The previous mechanism mounted the other four panels on `beforeprint`, in a
 * flushSync, and the print output came out half blank: Chromium takes its
 * print-to-PDF snapshot before the freshly mounted DOM has been laid out and
 * painted, so 11 of 24 pages carried their text in the content stream but
 * nothing on the page. Printing the same page a second time worked, because
 * by then the paint cache was warm — which is exactly what makes the bug
 * easy to miss and hard to believe.
 *
 * Hiding a panel with `display: none` and letting the print stylesheet turn
 * it back on means the print pass does the layout itself, with no new DOM
 * to mount. The dossier is a document: a reader who prints it should get the
 * whole document, not the one tab that happened to be open.
 */
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
            id={`dossier-tab-${i}`}
            type="button"
            role="tab"
            aria-selected={active === i}
            aria-controls={`dossier-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            className={`dossier-tab ${active === i ? "active" : ""}`}
            onClick={() => setActive(i)}
            onKeyDown={event => {
              const next = event.key === "ArrowRight" ? (i + 1) % labels.length
                : event.key === "ArrowLeft" ? (i + labels.length - 1) % labels.length
                : event.key === "Home" ? 0 : event.key === "End" ? labels.length - 1 : null;
              if (next === null) return;
              event.preventDefault();
              setActive(next);
              document.getElementById(`dossier-tab-${next}`)?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="dossier-tab-panel">
        {children.map((child, index) => (
          <section
            key={index}
            id={`dossier-panel-${index}`}
            className="dossier-panel-slot"
            data-active={index === active ? "true" : "false"}
            role="tabpanel"
            aria-labelledby={`dossier-tab-${index}`}
          >
            <h2 className="dossier-panel-heading">{labels[index]}</h2>
            {child}
          </section>
        ))}
      </div>
    </div>
  );
}
