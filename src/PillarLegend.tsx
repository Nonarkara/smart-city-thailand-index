// ---------------------------------------------------------------------------
// PillarLegend — one-line key for the seven-letter pillar acronyms
// ---------------------------------------------------------------------------
// Thai reviewer flagged: "LIV / SAF / ECO" are meaningless to most readers.
// Every surface that renders PILLAR_SHORT_LABELS now mounts this legend
// exactly once so the acronyms are never encountered cold.
// ---------------------------------------------------------------------------

import type { Locale } from "./types";
import {
  PILLAR_COLORS,
  PILLAR_LABELS,
  PILLAR_SHORT_LABELS,
} from "./types";
import { SCORING_PILLARS } from "./scoring";
import { translate } from "./cityPresentation";

interface Props {
  locale: Locale;
  /** Optional leader label, e.g. "Key" / "Pillars". */
  label?: { en: string; th: string; zh: string };
  className?: string;
}

export function PillarLegend({ locale, label, className }: Props) {
  const short = PILLAR_SHORT_LABELS[locale];
  const full = PILLAR_LABELS[locale];
  const leader =
    label ??
    { en: "Pillars", th: "เสาหลัก", zh: "支柱" };

  return (
    <ul
      className={`pillar-legend${className ? " " + className : ""}`}
      aria-label={translate(locale, leader)}
    >
      {SCORING_PILLARS.map(pillar => (
        <li
          key={pillar}
          className="pillar-legend-chip"
          title={full[pillar]}
        >
          <span
            className="pillar-legend-dot"
            style={{ background: PILLAR_COLORS[pillar] }}
            aria-hidden="true"
          />
          <span className="pillar-legend-short">{short[pillar]}</span>
          <span className="pillar-legend-full">{full[pillar]}</span>
        </li>
      ))}
    </ul>
  );
}
