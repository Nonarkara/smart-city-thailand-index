import { chromium, devices } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const baseUrl = "https://sciti.nonarkara.org";
const outDir = resolve(__dirname, "screenshots");

const shots = [
  { path: "/", name: "01-home-desktop", viewport: { width: 1440, height: 900 } },
  { path: "/invest", name: "02-invest-desktop", viewport: { width: 1440, height: 900 } },
  { path: "/rankings", name: "03-rankings-desktop", viewport: { width: 1440, height: 900 } },
  { path: "/methodology", name: "04-methodology-desktop", viewport: { width: 1440, height: 900 } },
  { path: "/", name: "05-home-mobile", viewport: { width: 390, height: 844 }, device: devices["iPhone 14"] },
];

(async () => {
  await import("node:fs/promises").then((fs) => fs.mkdir(outDir, { recursive: true }));
  const browser = await chromium.launch({ headless: true });

  for (const shot of shots) {
    const context = await browser.newContext(
      shot.device ? { ...shot.device } : { viewport: shot.viewport }
    );
    const page = await context.newPage();
    const url = `${baseUrl}${shot.path}`;
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
      await page.waitForTimeout(2000);
      const file = resolve(outDir, `${shot.name}.png`);
      await page.screenshot({ path: file, fullPage: true });
      console.log(`Captured ${file}`);
    } catch (e) {
      console.error(`Failed ${url}: ${e.message}`);
    } finally {
      await context.close();
    }
  }

  await browser.close();
})();
