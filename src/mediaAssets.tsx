import type { ImgHTMLAttributes } from "react";

function isLocalRasterAsset(src: string): boolean {
  return src.startsWith("/") && /\.(png|jpe?g)$/i.test(src);
}

function getResponsiveMediaAsset(src: string) {
  if (!isLocalRasterAsset(src)) {
    return { src };
  }

  const base = src.replace(/\.(png|jpe?g)$/i, "");
  return {
    src,
    avif: `${base}.avif`,
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

  if (!asset.avif && !asset.webp) {
    return <img src={asset.src} alt={alt} loading={loading} decoding={decoding} {...imgProps} />;
  }

  return (
    <picture>
      {asset.avif ? <source srcSet={asset.avif} type="image/avif" /> : null}
      {asset.webp ? <source srcSet={asset.webp} type="image/webp" /> : null}
      <img src={asset.src} alt={alt} loading={loading} decoding={decoding} {...imgProps} />
    </picture>
  );
}
