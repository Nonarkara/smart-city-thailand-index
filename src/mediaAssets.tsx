import type { ImgHTMLAttributes } from "react";
import { assetUrl } from "./assetUtils";

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

export function ResponsiveImage({
  src,
  alt,
  loading = "lazy",
  decoding = "async",
  ...imgProps
}: ResponsiveImageProps) {
  const asset = getResponsiveMediaAsset(src);

  if (!asset.webp) {
    return <img src={asset.src} alt={alt} loading={loading} decoding={decoding} {...imgProps} />;
  }

  return (
    <picture>
      {asset.webp ? <source srcSet={asset.webp} type="image/webp" /> : null}
      <img src={asset.src} alt={alt} loading={loading} decoding={decoding} {...imgProps} />
    </picture>
  );
}
