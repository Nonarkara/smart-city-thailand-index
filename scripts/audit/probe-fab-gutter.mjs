/**
 * WHERE CAN THE FLOATING CHAT BUTTON SIT WITHOUT COVERING TEXT?
 * ================================================================
 * The chat button is fixed bottom-right. On a wide screen the content
 * column is centred and narrow, so the button lands in the right gutter
 * and covers nothing. On a phone the column is full width, so the button
 * lands ON the words.
 *
 * This measures the actual gutter at every width from 360 to 1600 and
 * reports the width at which the button stops being able to clear the
 * content. That number, not a guess, sets the breakpoint.
 *
 * Run: node scripts/audit/probe-fab-gutter.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";

const BASE = process.argv[2] || "http://localhost:5388";
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(BASE + "/why", { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2000);
await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
await page.waitForTimeout(300);

console.log("width  fab.x  fab.right  content.right  gutter  clear?");
for (const w of [360, 390, 414, 480, 600, 720, 768, 834, 900, 1024, 1180, 1280, 1440, 1600]) {
  await page.setViewportSize({ width: w, height: 900 });
  await page.waitForTimeout(220);
  const r = await page.evaluate(() => {
    const fab = document.querySelector(".chat-fab");
    const fr = fab?.getBoundingClientRect();
    // The widest painted content box that is NOT the fab/chat panel/footer.
    let right = 0;
    for (const el of document.querySelectorAll("main *, main")) {
      if (el.closest(".chat-fab, .chat-panel")) continue;
      const b = el.getBoundingClientRect();
      if (b.width > 40 && b.height > 4) right = Math.max(right, b.right);
    }
    return { fx: fr ? Math.round(fr.left) : null, fr: fr ? Math.round(fr.right) : null, right: Math.round(right) };
  });
  const gutter = r.right - r.fr;
  console.log(
    `${String(w).padStart(5)}  ${String(r.fx).padStart(5)}  ${String(r.fr).padStart(8)}  ${String(r.right).padStart(13)}  ${String(Math.round(gutter)).padStart(6)}  ${gutter >= 0 ? "CLEAR" : "OVERLAPS by " + Math.round(-gutter)}`
  );
}

await ctx.close();
await browser.close();
