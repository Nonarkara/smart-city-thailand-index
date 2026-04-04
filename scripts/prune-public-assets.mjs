import { mkdir, readdir, rename } from "node:fs/promises";
import { dirname, join, relative } from "node:path";

const workspaceRoot = process.cwd();
const publicRoot = join(workspaceRoot, "public");
const archiveRoot = join(workspaceRoot, "archive", "public-unused");

const trackedDirectories = [
  "Chiang Mai",
  "CMU Smart City",
  "Khon Kaen",
  "Photos international",
  "photos",
];

const trackedFiles = [
  ".DS_Store",
  "Drone Panel @SCSE2026_otter_ai.txt",
  "SCES 2026 Global Press Conference_otter_ai.txt",
  "Smart City Solutions Workshop_otter_ai (1).txt",
  "Your City Is Winning Awards. Your Citizens Are Dying Slowly.pdf",
  "Your City Won “Most Livable.” Your Therapist Disagrees_.pdf",
];

const keep = new Set([
  "Chiang Mai/IMG_20251218_190749854.jpg",
  "CMU Smart City/P1210289.JPG",
  "Khon Kaen/IMG_4264.JPG",
  "Photos international/20260317092525-_DON6841.jpg",
  "Photos international/20260317093438-_DON6939.jpg",
  "Photos international/459288254_924132223081934_9217219278417242092_n.jpg",
  "Photos international/JSCF2025-2495.jpg",
  "Photos international/Z03A9727-opq3949327416.jpg",
  "photos/1-57.jpg",
  "photos/318402.jpg",
  "photos/35663858.1bc37816278448879bdf3935d73727f4.21021520.JPG",
  "photos/49614469.198c81947727b25aeb394554315b2b74.19090306.jpg",
  "photos/49880176.c69e12bcd4cc4e80925f28838ebcb215.19091017.jpg",
  "photos/72639510_2459479007664540_4785365931712839680_o.jpg",
  "photos/73513755_10157605754953794_5475140449704345600_n.jpg",
  "photos/IMG_0324.JPG",
  "photos/IMG_0396.JPG",
  "photos/IMG_0861.JPG",
  "photos/IMG_0964.JPG",
  "photos/IMG_1382.JPG",
  "photos/IMG_1447.JPG",
  "photos/IMG_3619.JPG",
  "photos/IMG_4107.JPG",
  "photos/IMG_4175.JPG",
  "photos/IMG_4207.JPG",
  "photos/IMG_5304.JPG",
  "photos/IMG_5849.JPG",
  "photos/IMG_6654.JPG",
  "photos/IMG_6691.JPG",
  "photos/IMG_6692.JPG",
  "photos/IMG_7331.JPG",
  "photos/IMG_7504.JPG",
  "photos/IMG_7607.JPG",
  "photos/IMG_7613.JPG",
  "photos/IMG_7760.JPG",
  "photos/IMG_7761.JPG",
  "photos/IMG_9995.JPG",
  "photos/P6204927.JPG",
  "photos/P6205097.JPG",
  "photos/_K635402.jpg",
  "photos/depa x korea SBAU2019.jpg",
  "photos/f4b929dc011fb96fba76c9618ca6b93e.jpg",
  "photos/report-city-night.jpg",
  "photos/report-city-walkway.jpg",
  "photos/slic-waterfront.jpg",
]);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(entries.map(async entry => {
    const target = join(dir, entry.name);
    return entry.isDirectory() ? walk(target) : [target];
  }));

  return files.flat();
}

async function moveUnusedFiles() {
  let moved = 0;

  for (const directory of trackedDirectories) {
    const sourceDirectory = join(publicRoot, directory);
    const files = await walk(sourceDirectory);

    for (const file of files) {
      const relativePath = relative(publicRoot, file).replaceAll("\\", "/");
      if (keep.has(relativePath)) {
        continue;
      }

      const archivePath = join(archiveRoot, relativePath);
      await mkdir(dirname(archivePath), { recursive: true });
      await rename(file, archivePath);
      moved += 1;
    }
  }

  for (const fileName of trackedFiles) {
    const sourcePath = join(publicRoot, fileName);
    const archivePath = join(archiveRoot, fileName);
    try {
      await mkdir(dirname(archivePath), { recursive: true });
      await rename(sourcePath, archivePath);
      moved += 1;
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }
      throw error;
    }
  }

  console.log(`Moved ${moved} unused public assets into ${relative(workspaceRoot, archiveRoot)}.`);
}

await moveUnusedFiles();
