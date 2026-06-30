// ---------------------------------------------------------------------------
// ShowcaseLocatorMap — compact locator for the NST showcase intro
// ---------------------------------------------------------------------------
// A small, calm Leaflet map that places Nakhon Si Thammarat on the Gulf coast
// between the sea and the Khao Luang range. Not an exploration surface — one
// amber marker, no scroll-zoom (so the page keeps scrolling), a hard minZoom
// floor so the world never tiles (workspace CLAUDE.md §11.9). Leaflet is the
// CDN global from index.html; we wait for window.L before mounting.
// ---------------------------------------------------------------------------

import { useEffect, useRef, useState } from "react";
import { translate } from "./cityPresentation";
import type { Locale } from "./types";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L?: any;
  }
}

const NST: [number, number] = [8.4304, 99.9633];

export default function ShowcaseLocatorMap({ locale }: { locale: Locale }) {
  const elRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapRef = useRef<any>(null);
  const [ready, setReady] = useState<boolean>(typeof window !== "undefined" && !!window.L);

  useEffect(() => {
    if (ready) return;
    const id = window.setInterval(() => {
      if (window.L) { setReady(true); window.clearInterval(id); }
    }, 100);
    return () => window.clearInterval(id);
  }, [ready]);

  useEffect(() => {
    if (!ready || !elRef.current || mapRef.current) return;
    const L = window.L;
    const map = L.map(elRef.current, {
      center: NST,
      zoom: 8,
      minZoom: 6,
      maxZoom: 11,
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
      worldCopyJump: false,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }).addTo(map);

    L.circleMarker(NST, {
      radius: 7,
      weight: 2,
      color: "#ffffff",
      fillColor: "#f59e0b",
      fillOpacity: 1,
      opacity: 1,
    })
      .addTo(map)
      .bindTooltip(
        translate(locale, { en: "Nakhon Si Thammarat", th: "นครศรีธรรมราช", zh: "洛坤" }),
        { permanent: true, direction: "right", offset: [8, 0], className: "showcase-locator-tip" },
      );

    mapRef.current = map;
    // Container may mount inside a freshly-shown tab panel — settle the size.
    window.setTimeout(() => map.invalidateSize(), 60);

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [ready, locale]);

  return (
    <div className="showcase-locator">
      <div ref={elRef} className="showcase-locator-canvas" aria-label={translate(locale, { en: "Map locating Nakhon Si Thammarat on Thailand's southern Gulf coast", th: "แผนที่ตำแหน่งนครศรีธรรมราชบนชายฝั่งอ่าวไทยภาคใต้", zh: "标示洛坤位于泰国南部湾岸的地图" })} />
      {!ready && (
        <div className="showcase-locator-loading">
          {translate(locale, { en: "Loading map…", th: "กำลังโหลดแผนที่…", zh: "正在加载地图…" })}
        </div>
      )}
    </div>
  );
}
