/**
 * PHONE LAYOUT SURVEY FOR THE FLOATING CHAT BUTTON
 * ==================================================
 * The sweep reports 10 places where the fixed chat button is painted over
 * body text at 390px. Before choosing a fix, this captures what the reader
 * actually sees at the top of each affected page, and how much room the
 * phone topbar already spends — because the alternative is to move the chat
 * entry into the topbar, and that only works if the topbar has room.
 *
 * Run: node scripts/audit/probe-phone-fab.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5388";
const ROUTES = ["/story", "/program", "/partners", "/audit", "/why", "/"];
mkdirSync("/tmp/fab-probe", { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

for (const route of ROUTES) {
  await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  await page.addStyleTag({ content: "*, *::before, *::after { transition: none !important; animation: none !important; }" });
  await page.evaluate(() => document.querySelectorAll(".reveal").forEach(e => e.classList.add("visible")));
  await page.waitForTimeout(300);

  const info = await page.evaluate(() => {
    const bar = document.querySelector(".topbar");
    const fab = document.querySelector(".chat-fab");
    const acts = document.querySelector(".topbar-actions");
    const br = bar?.getBoundingClientRect();
    const fr = fab?.getBoundingClientRect();
    const ar = acts?.getBoundingClientRect();
    // How many separate controls already live in the phone topbar?
    const controls = acts ? [...acts.querySelectorAll("button")].map(b => {
      const r = b.getBoundingClientRect();
      return { cls: String(b.className || "").slice(0, 22), w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.left) };
    }) : [];
    return {
      bar: br ? { h: Math.round(br.height) } : null,
      acts: ar ? { w: Math.round(ar.width), x: Math.round(ar.left) } : null,
      controls,
      fab: fr ? { x: Math.round(fr.left), y: Math.round(fr.top), w: Math.round(fr.width), h: Math.round(fr.height) } : null,
      viewportH: innerHeight,
      viewportW: innerWidth,
    };
  });

  console.log(`\n${route}`);
  console.log(`   viewport ${info.viewportW}x${info.viewportH}  topbar h=${info.bar?.h}  actions w=${info.acts?.w} @x=${info.acts?.x}`);
  console.log(`   topbar controls: ${info.controls.map(c => `${c.cls}(${c.w}x${c.h})@${c.x}`).join(" ")}`);
  console.log(`   fab: ${JSON.stringify(info.fab)}`);

  await page.screenshot({ path: `/tmp/fab-probe${route.replace(/\//g, "-") || "-home"}.png` });
}

await ctx.close();
await browser.close();
console.log("\nscreenshots: /tmp/fab-probe/");
