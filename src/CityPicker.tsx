// ---------------------------------------------------------------------------
// CityPicker — alphabetical city directory in the topbar
// ---------------------------------------------------------------------------
// Drawer committed with the finder: tier glyph, localized name, mono score.
// The panel stays unmounted while closed so the header does not carry the
// full directory. Rows filter across English, Thai and Chinese names.
// ---------------------------------------------------------------------------

import { useEffect, useId, useRef, useState } from "react";
import { allCities } from "./cityData";
import { getCityName, getProvinceName, translate } from "./cityPresentation";
import type { CityTier, Locale, SmartCity } from "./types";

const TIER_GLYPH: Record<CityTier, string> = {
  alpha: "α",
  beta: "β",
  gamma: "γ",
};

function collation(locale: Locale): string {
  if (locale === "th") return "th";
  if (locale === "zh") return "zh";
  return "en";
}

function fold(value: string): string {
  return value.normalize("NFKC").toLocaleLowerCase();
}

function haystack(city: SmartCity): string {
  return fold([
    city.nameEn,
    city.nameTh,
    getCityName(city, "zh"),
    city.province,
    city.provinceTh,
    getProvinceName(city, "zh"),
  ].join("\n"));
}

function directory(locale: Locale, query: string): SmartCity[] {
  const needle = fold(query.trim());
  return [...allCities]
    .filter(city => !needle || haystack(city).includes(needle))
    .sort((a, b) => {
      const byName = getCityName(a, locale).localeCompare(
        getCityName(b, locale),
        collation(locale),
        { sensitivity: "base" },
      );
      return byName || a.id.localeCompare(b.id);
    });
}

interface Props {
  locale: Locale;
  /** City id when the current route is a dossier, so that row stays marked. */
  currentCityId?: string;
  onNavigate: (path: string) => void;
  /** Closes the mobile menu after a choice. The parent owns that state. */
  onClose: () => void;
}

export default function CityPicker({ locale, currentCityId, onNavigate, onClose }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();
  const cities = directory(locale, query);
  const label = translate(locale, { en: "Find a city", th: "ค้นหาเมือง", zh: "查找城市" });
  const searchLabel = translate(locale, {
    en: "City or province",
    th: "เมืองหรือจังหวัด",
    zh: "城市或府",
  });
  const empty = translate(locale, {
    en: "No city matches",
    th: "ไม่พบเมือง",
    zh: "没有匹配的城市",
  });

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setQuery("");
      triggerRef.current?.focus();
    };
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    setQuery("");
  };

  const choose = (cityId: string) => {
    dismiss();
    onClose();
    onNavigate(`/city/${cityId}`);
  };

  return (
    <div ref={rootRef} className={`city-picker${open ? " city-picker-open" : ""}`}>
      <button
        ref={triggerRef}
        type="button"
        className="nav-link city-picker-trigger"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? dismiss() : setOpen(true))}
      >
        {label}
        <span className="nav-group-caret" aria-hidden="true">›</span>
      </button>
      {open ? (
        <div className="city-picker-panel">
          <input
            ref={searchRef}
            className="city-picker-search"
            type="search"
            value={query}
            autoComplete="off"
            placeholder={searchLabel}
            aria-label={searchLabel}
            onChange={event => setQuery(event.target.value)}
          />
          {cities.length === 0 ? (
            <p className="city-picker-empty" role="status">{empty}</p>
          ) : (
            <div id={listId} role="listbox" aria-label={label}>
              {cities.map(city => {
                const name = getCityName(city, locale);
                const score = city.compositeScore.toFixed(1);
                const active = city.id === currentCityId;
                return (
                  <button
                    key={city.id}
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`city-picker-item${active ? " active" : ""}`}
                    onClick={() => choose(city.id)}
                  >
                    <span className={`city-picker-tier city-picker-tier-${city.tier}`} aria-hidden="true">
                      {TIER_GLYPH[city.tier]}
                    </span>
                    <span className="city-picker-name">{name}</span>
                    <span className="city-picker-score">{score}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
