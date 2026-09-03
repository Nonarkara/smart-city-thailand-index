import type { ImgHTMLAttributes, SyntheticEvent } from "react";
import { assetUrl } from "./assetUtils";

// Brand mark shown when a photo 404s — a broken-image glyph never ships.
const FALLBACK_SRC = assetUrl("/smart_city_thailand_logo.webp");

function isLocalRasterAsset(src: string): boolean {
  return src.startsWith("/") && /\.(png|jpe?g)$/i.test(src);
}

function getResponsiveMediaAsset(src: string) {
  if (!isLocalRasterAsset(src)) {
    return { src: assetUrl(src) };
  }

  const resolved = assetUrl(src);
  const base = resolved.replace(/\.(png|jpe?g)$/i, "");
  return {
    src: resolved,
    webp: `${base}.webp`,
  };
}

type ResponsiveImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
};

// Runs at most twice per element: a failed <source> first yields to the
// <img src> jpeg (a <picture> never falls back on its own), and a second
// failure swaps in the brand mark. data-fallback is the loop guard.
function handleImageError(event: SyntheticEvent<HTMLImageElement>) {
  const img = event.currentTarget;
  if (img.dataset.fallback === "logo") return;
  const picture = img.parentElement?.tagName === "PICTURE" ? img.parentElement : null;
  if (!img.dataset.fallback && picture?.querySelector("source[srcset]")) {
    img.dataset.fallback = "source";
    picture.querySelectorAll("source").forEach(source => source.removeAttribute("srcset"));
    return;
  }
  img.dataset.fallback = "logo";
  img.src = FALLBACK_SRC;
}

export function ResponsiveImage({
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  onError,
  ...imgProps
}: ResponsiveImageProps) {
  const asset = getResponsiveMediaAsset(src);
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    onError?.(event);
    handleImageError(event);
  };

  if (!asset.webp) {
    return <img src={asset.src} alt={alt} loading={loading} decoding={decoding} onError={handleError} {...imgProps} />;
  }

  return (
    <picture>
      {asset.webp ? <source srcSet={asset.webp} type="image/webp" /> : null}
      <img src={asset.src} alt={alt} loading={loading} decoding={decoding} onError={handleError} {...imgProps} />
    </picture>
  );
}
