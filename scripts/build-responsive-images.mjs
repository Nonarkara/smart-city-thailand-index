import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { join, extname, dirname } from "node:path";

const workspaceRoot = process.cwd();
const publicRoot = join(workspaceRoot, "public");
const imageExtensions = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const results = await Promise.all(entries.map(async entry => {
    const target = join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));

  return results.flat();
}

function shouldProcess(filePath) {
  const extension = extname(filePath).toLowerCase();
  if (!imageExtensions.has(extension)) {
    return false;
  }

  return !filePath.includes(`${dirname(publicRoot)}/archive/`);
}

async function buildVariants(filePath) {
  const basePath = filePath.replace(/\.(png|jpe?g)$/i, "");
  const pipeline = sharp(filePath)
    .rotate()
    .resize({
      width: 1920,
      withoutEnlargement: true,
      fit: "inside",
    });

  await Promise.all([
    pipeline.clone().webp({ quality: 72, effort: 5 }).toFile(`${basePath}.webp`),
    pipeline.clone().avif({ quality: 52, effort: 6 }).toFile(`${basePath}.avif`),
  ]);
}

const files = (await walk(publicRoot)).filter(shouldProcess);

await Promise.all(files.map(buildVariants));

console.log(`Built AVIF/WebP variants for ${files.length} public images.`);
