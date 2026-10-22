/**
 * THE CLIP
 * =======
 * A screenshot of ONE element, at one width, cropped to its box.
 *
 * The census says "40px between two spans". The clip says whether the
 * reader sees a hole or a card. An instrument cannot see a card whose
 * ground is the same hue as the page.
 *
 * Run: node scripts/audit/clip.mjs <baseUrl> <route> <width> <selector> <outfile>
 */
import { chromium } from "/Users/nonarkara/Projects/soccer/node_modules/playwright/index.mjs";

const [BASE, ROUTE, W, SEL, OUT] = process.argv.slice(2);
const width = Number(W || 1440);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(BASE + ROUTE, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(1800);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(400);

const el = await page.$(SEL);
if (!el) {
  console.error("no element matches " + SEL);
  await browser.close();
  process.exit(1);
}
await el.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await el.screenshot({ path: OUT });
console.log("wrote " + OUT);
await browser.close();
