/** Prepend Vite BASE_URL to local asset paths (handles /repo-name/ prefix for GitHub Pages) */
export function assetUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || path.startsWith("/http")) return path;
  const base = import.meta.env.BASE_URL || "/";
  // Avoid double slashes: BASE_URL already ends with /
  return base + path.replace(/^\//, "");
}
