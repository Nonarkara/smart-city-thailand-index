import type { ImgHTMLAttributes } from "react";

/** Prepend Vite BASE_URL to local asset paths (handles /repo-name/ prefix for GitHub Pages) */
export function assetUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/http")) return path;
  const base = import.meta.env.BASE_URL || "/";
  // Avoid double slashes: BASE_URL already ends with /
  return base + path.replace(/^\//, "");
}

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
