/**
 * WHERE IS THERE ROOM FOR THE CHAT ENTRY IN THE NAVIGATION?
 * =========================================================
 * The floating button overlaps text at every width below 1280px, so below
 * that it has to live in the navigation. The navigation has two shapes:
 * a hamburger panel below 900px and an inline row above it. This measures
 * the free space in the inline row — between the wordmark and the first
 * nav item — which is where a chat entry would have to fit if the inline
 * row is to hold it.
 *
 * Run: node scripts/audit/probe-nav-gap.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const WIDTHS = [900, 960, 1024, 1100, 1180, 1240, 1280];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);

console.log("width  brand.right  nav.left   gap   navScrollable?  fits44?");
for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(280);
  const r = await page.evaluate(() => {
    const brand = document.querySelector(".topbar-brand");
    const links = document.querySelector(".nav-links");
    const br = brand?.getBoundingClientRect();
    const lr = links?.getBoundingClientRect();
    const lcs = links ? getComputedStyle(links) : null;
    return {
      brandRight: br ? Math.round(br.right) : null,
      navLeft: lr ? Math.round(lr.left) : null,
      navRight: lr ? Math.round(lr.right) : null,
      scrollable: lcs ? lcs.overflowX : "",
    };
  });
  const gap = r.navLeft - r.brandRight;
  console.log(
    `${String(w).padStart(5)}  ${String(r.brandRight).padStart(10)}  ${String(r.navLeft).padStart(8)}  ${String(Math.round(gap)).padStart(4)}   ${r.scrollable.padEnd(12)}  ${gap >= 44 ? "YES" : "no"}`
  );
}

await page.setViewportSize({ width: 1024, height: 900 });
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/fab-probe/topbar-1024.png" });
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(400);
await page.screenshot({ path: "/tmp/fab-probe/topbar-390.png" });
console.log("\nscreenshots: /tmp/fab-probe/topbar-1024.png, topbar-390.png");

await ctx.close();
await browser.close();
