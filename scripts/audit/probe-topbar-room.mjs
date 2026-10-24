/**
 * IS THERE ROOM IN THE TOPBAR FOR THE CHAT ENTRY ON A TABLET?
 * ===============================================================
 * The floating chat button overlaps text at every width below 1280px.
 * The fix is to float it only where a real gutter exists and let it live
 * in the navigation everywhere else — but the inline navigation row is
 * already busy, so the room has to be measured, not assumed.
 *
 * This reports, per width: how much free space sits between the last
 * nav control and the viewport edge, and whether the hamburger is
 * available as a dropdown host.
 *
 * Run: node scripts/audit/probe-topbar-room.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const WIDTHS = [390, 480, 600, 720, 768, 900, 1024, 1100, 1180, 1280, 1440];

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);

console.log("width  navToggle  inlineNavWidth  lastControlRight  freeRight  dropdown?");
for (const w of WIDTHS) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(260);
  const r = await page.evaluate(() => {
    const toggle = document.querySelector(".nav-toggle");
    const tcs = toggle ? getComputedStyle(toggle) : null;
    const toggleVisible = !!(toggle && tcs && tcs.display !== "none" && toggle.getBoundingClientRect().width > 0);
    const links = document.querySelector(".nav-links");
    const lcs = links ? getComputedStyle(links) : null;
    const linksInline = !!(links && lcs && lcs.display !== "none" && links.getBoundingClientRect().width > 0 && !links.classList.contains("nav-links-open"));
    const actions = document.querySelector(".topbar-actions");
    const ar = actions?.getBoundingClientRect();
    // The last VISIBLE control inside the actions area.
    let lastRight = 0;
    if (actions) {
      for (const el of actions.querySelectorAll("button, a, [role='group']")) {
        const b = el.getBoundingClientRect();
        if (b.width > 0 && b.height > 0) lastRight = Math.max(lastRight, b.right);
      }
    }
    return {
      toggleVisible,
      linksInline,
      actionsRight: ar ? Math.round(ar.right) : null,
      lastRight: Math.round(lastRight),
      viewport: innerWidth,
    };
  });
  const free = r.viewport - r.lastRight;
  console.log(
    `${String(w).padStart(5)}  ${r.toggleVisible ? "visible" : "hidden "}  ${r.linksInline ? "inline" : "dropdown"}  ${String(r.lastRight).padStart(14)}  ${String(Math.round(free)).padStart(9)}  ${r.toggleVisible ? "yes (hamburger panel)" : "no"}`
  );
}

await ctx.close();
await browser.close();
