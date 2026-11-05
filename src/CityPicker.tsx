// ---------------------------------------------------------------------------
// CityPicker — alphabetical city directory drawer for the topbar
// ---------------------------------------------------------------------------
// Type-to-filter or browse every city A–Z. Each row: tier glyph (α/β/γ,
// colored by tier token) · city name · composite score. Trilingual names.
//
// Design read: the topbar is a dense Console menubar; this picker is its
// directory drawer — uniform hairline rows like the 1972 Vignelli subway
// legend, one glyph column, mono numerals. Hairline borders, ZERO radius,
// ZERO drop-shadow. Row height stays in the dense-group band (≥32px).
// ---------------------------------------------------------------------------

import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "./types";
import { allCities } from "./cityData";
import { getCityName, getProvinceName } from "./cityPresentation";

const TIER_GLYPH: Record<string, string> = { alpha: "α", beta: "β", gamma: "γ" };

const LABELS = {
  trigger: { en: "Find a city", th: "ค้นหาเมือง", zh: "查找城市" },
  search: {
    en: "Type a city or province…",
    th: "พิมพ์ชื่อเมืองหรือจังหวัด…",
    zh: "输入城市或府名…",
  },
  empty: { en: "No city matches", th: "ไม่พบเมืองที่ตรง", zh: "没有匹配的城市" },
  listLabel: { en: "All cities, A to Z", th: "ทุกเมือง เรียงตามตัวอักษร", zh: "全部城市，按字母排序" },
} as const;

interface Props {
  locale: Locale;
  /** City id when the current route is a dossier — marks the active row. */
  currentCityId?: string;
  onNavigate: (path: string) => void;
  /** Closes the mobile menu after a navigation (parent owns the state). */
  onClose: () => void;
}

export default function CityPicker({ locale, currentCityId, onNavigate, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click or Escape; focus the filter when opening.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        rootRef.current?.querySelector<HTMLButtonElement>(".city-picker-trigger")?.focus();
      }
    };
    window.addEventListener("mousedown", handleClick);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCities
      .map(city => ({
        city,
        name: getCityName(city, locale),
        province: getProvinceName(city, locale),
      }))
      .filter(({ city, name, province }) => {
        if (!q) return true;
        return `${name} ${city.nameEn} ${city.nameTh} ${province}`.toLowerCase().includes(q);
      })
      .sort((a, b) => a.name.localeCompare(b.name, locale) || a.city.id.localeCompare(b.city.id));
  }, [locale, query]);

  const pick = (id: string) => {
    setOpen(false);
    setQuery("");
    onClose();
    onNavigate(`/city/${id}`);
  };

  return (
    <div ref={rootRef} className={`city-picker ${open ? "city-picker-open" : ""}`}>
      <button
        type="button"
        role="menuitem"
        aria-haspopup="true"
        aria-expanded={open}
        className="city-picker-trigger nav-link"
        onClick={() => setOpen(value => !value)}
      >
        {LABELS.trigger[locale]}
        <span className="nav-group-caret" aria-hidden="true">›</span>
      </button>
      {open && (
        <div className="city-picker-panel" role="menu" aria-label={LABELS.listLabel[locale]}>
          <input
            ref={inputRef}
            type="search"
            className="city-picker-search"
            placeholder={LABELS.search[locale]}
            aria-label={LABELS.search[locale]}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {rows.length === 0 ? (
            <p className="city-picker-empty">{LABELS.empty[locale]}</p>
          ) : (
            rows.map(({ city, name }) => (
              <button
                key={city.id}
                type="button"
                role="menuitem"
                data-city-id={city.id}
                className={`city-picker-item ${currentCityId === city.id ? "active" : ""}`}
                aria-current={currentCityId === city.id ? "page" : undefined}
                onClick={() => pick(city.id)}
              >
                <span
                  className={`city-picker-tier city-picker-tier-${city.tier}`}
                  title={city.tier}
                >{TIER_GLYPH[city.tier] ?? "·"}</span>
                <span className="city-picker-name">{name}</span>
                <span className="city-picker-score">{city.compositeScore.toFixed(1)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
