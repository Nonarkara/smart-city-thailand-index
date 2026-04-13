import type { SmartCity } from "./types";

export type CityPhotoAsset = {
  src: string;
  objectPosition?: string;
};

export const HOME_HERO_ASSET: CityPhotoAsset = {
  src: "/photos/khonkaen-aerial.jpg",
  objectPosition: "center 52%",
};

const REGION_FALLBACKS: Record<SmartCity["region"], CityPhotoAsset> = {
  bangkok: { src: "/photos/report-city-night.jpg", objectPosition: "center center" },
  central: { src: "/photos/report-city-walkway.jpg", objectPosition: "center center" },
  east: { src: "/photos/slic-waterfront.jpg", objectPosition: "center center" },
  north: { src: "/photos/chiangmai-night.jpg", objectPosition: "center center" },
  northeast: { src: "/photos/khonkaen-aerial.jpg", objectPosition: "center center" },
  south: { src: "/photos/slic-waterfront.jpg", objectPosition: "center center" },
};

const CITY_PHOTO_ASSETS: Record<string, CityPhotoAsset> = {
  "chiang-mai-old-town": { src: "/photos/chiangmai-night.jpg", objectPosition: "center 58%" },
  "cmu-smart-city": { src: "/photos/cmu-doiSuthep.jpg", objectPosition: "center 44%" },
  "khon-kaen": { src: "/photos/khonkaen-aerial.jpg", objectPosition: "center 52%" },
  "samyan": { src: "/photos/report-city-night.jpg", objectPosition: "center 42%" },
  "phra-ram-4": { src: "/photos/report-city-night.jpg", objectPosition: "center 42%" },
  "phuket": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 48%" },
  "saensuk": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 48%" },
  "rayong": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 48%" },
  "krabi": { src: "/photos/slic-waterfront.jpg", objectPosition: "center 48%" },
  "chachoengsao": { src: "/photos/report-city-walkway.jpg", objectPosition: "center 52%" },
  "nakhon-si-thammarat": { src: "/photos/report-city-walkway.jpg", objectPosition: "center 52%" },
  "hat-yai": { src: "/photos/report-city-night.jpg", objectPosition: "center 42%" },
  "yala": { src: "/photos/report-city-night.jpg", objectPosition: "center 42%" },
};

export function getCityPhotoAsset(city: Pick<SmartCity, "id" | "region">): CityPhotoAsset {
  return CITY_PHOTO_ASSETS[city.id] ?? REGION_FALLBACKS[city.region];
}
