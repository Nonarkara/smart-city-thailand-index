// MSH page budget: the cost of scrolling, measured on rendered pixels.
// Per route and viewport: total height in screens, where the H1 sits, and the presenter band.
// Ceilings are regression gates set just above the current measured height; lower them as pages
// get compacted, never raise them. Structural checks reject the sticker, the dot and the bars.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
const report = process.argv.includes('--report');
const failures = [];
// In CI every route is measured and printed before the run fails, so one red build shows the whole table.
const check = (ok, msg) => { if (!ok && !report) { if (process.env.CI) failures.push(msg); else assert.fail(msg); } };
// [route, max screens @390x844, max screens @1440x900, max H1 top @390 (px)]
/* The ceilings are the MEASURED height of each page, plus a hand's width of
 * margin. They only ever go down: a page that grows past the line it was
 * held to has to earn the difference, and the gate says so.
 *
 * Measured 5 November 2026 against the compaction: /invest came down from
 * 23 screens to 20.8 by taking the padded checklist rows, the padded
 * mechanism rows and the city-lens table that duplicated the city cards on
 * a phone; /baseline came down from 21.7 to 16.9 the same way. The rest of
 * the site was measured, found dense rather than padded, and held.
 *
 * 13 November 2026: re-measured. The home page had been held at 14.3/7.1 while it
 * actually stood at 6.6/3.6, so its ceiling allowed it to double; now 7.5/4.2. The
 * long routes' section spacing is already ~1.5% of their height (/invest 280 of
 * 17,500 px): what remains is content, and cutting content is an editorial call.
 *
 * 19 November 2026: the scroll-economy pass. /baseline printed all 118 rows —
 * ten phone screens of table — and now stops at a counted 25 with the rest
 * behind one action; 16.96 -> 8.88 on a phone and 10.42 -> 5.54 on a desktop.
 * /partners lost its boxed three-row fact table on phones (12.29 -> 11.14),
 * the site-wide news band became ruled rows, and the home page lost the
 * chip line above each reading title (6.63 -> 6.40). Every ceiling below was
 * re-measured and lowered; none was raised. */
const BUDGET = [
  ['/', 6.55, 3.60, 520],
  ['/rankings', 7.45, 4.45, 420], ['/methodology', 17.90, 9.75, 420], ['/partners', 11.30, 6.10, 420], ['/program', 13.60, 7.35, 420],
  ['/invest', 20.90, 11.95, 420], ['/baseline', 9.05, 5.65, 420], ['/audit', 11.35, 4.95, 420], ['/references', 11.35, 4.95, 420], ['/knowledge', 7.35, 5.15, 420],
];
// The ceilings are measured on macOS. The Linux CI runner has no system-ui face and falls back to a wider one, so the same
// pages measured up to 6.6% taller at 390 and 2.3% at 1440 (CI run 41675135316 against these ceilings). CI allows that
// font difference only; the local gate in CDPT runs at 1.0 and is the one that holds the line.
const CI_PHONE = 1.1, CI_DESK = 1.05;
let server, browser;
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const [route, maxPhone, maxDesk, maxH1] of BUDGET) {
    for (const [w, h, max] of [[390, 844, maxPhone], [1440, 900, maxDesk]]) {
      await page.setViewportSize({ width: w, height: h });
      await page.goto(origin + route, { waitUntil: 'domcontentloaded' });
      await page.locator('h1').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach(e => e.classList.add('visible')));
      await page.waitForTimeout(400);
      const m = await page.evaluate(() => {
        const h1 = document.querySelector('h1')?.getBoundingClientRect();
        const band = document.querySelector('.page-guide')?.getBoundingClientRect();
        const fig = document.querySelector('.page-guide-figure')?.getBoundingClientRect();
        return {
          height: document.documentElement.scrollHeight, h1Top: h1 ? Math.round(h1.top + scrollY) : null,
          band: band ? Math.round(band.height) : null, fig: fig ? Math.round(fig.height) : null,
          avatar: !!document.querySelector('.page-guide-avatar'), bars: !!document.querySelector('.rank-pillar-bar'),
          overflow: document.documentElement.scrollWidth - innerWidth,
        };
      });
      const screens = m.height / h;
      if (report || process.env.CI) console.log(`${route} ${w}: ${screens.toFixed(2)} screens, h1 y=${m.h1Top}, band=${m.band}, figure=${m.fig}`);
      check(m.overflow === 0, `${route}@${w}: horizontal overflow`);
      const allow = max * (process.env.CI ? (w < 720 ? CI_PHONE : CI_DESK) : 1);
      check(screens <= allow, `${route}@${w}: ${screens.toFixed(1)} screens exceeds budget ${max}${process.env.CI ? ` (x${w < 720 ? CI_PHONE : CI_DESK} CI font allowance)` : ''}. Compact it; do not raise the ceiling.`);
      check(!m.avatar && !m.bars, `${route}@${w}: avatar-sized mascot or decorative pillar bars are back`);
      if (m.band != null) {
        check(m.fig >= 96, `${route}@${w}: commissioned art shrunk to ${m.fig}px; it must read as a presenter, not a dot`);
        check(m.band <= (w < 720 ? 200 : 170), `${route}@${w}: guide band ${m.band}px is stretched past its note and figure`);
      }
      if (w === 390 && route !== '/knowledge') check(m.h1Top <= maxH1, `${route}: H1 starts ${m.h1Top}px down; the page leads with chrome`);
    }
  }
  // Expanded registers must remain usable in both themes, not only fit while closed.
  for (const theme of ["light", "dark"]) {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin + "/baseline");
      await page.locator("#baseline-q").waitFor();
      await page.evaluate(theme => {
        localStorage.setItem("smart-city-thailand-theme", theme);
      }, theme);
      await page.reload();
      await page.locator("#baseline-q").waitFor();
      await page.evaluate(() => document.fonts.ready);
      const search = await page.locator("#baseline-q").boundingBox();
      check(search.y + search.height < 650, `baseline/${theme}/${width}: search buried`);
      const sourceContrast = await page.locator(".baseline-source-name").first().evaluate(el => {
        const channels = color => color.match(/[\d.]+/g).slice(0, 3).map(Number);
        const luminance = color => channels(color).map(value => {
          const component = value / 255;
          return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
        const foreground = luminance(getComputedStyle(el).color);
        const background = luminance(getComputedStyle(el.closest(".baseline-sources")).backgroundColor);
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
      });
      check(sourceContrast >= 4.5, `baseline/${theme}: unreadable source contrast ${sourceContrast.toFixed(2)}`);
      const initial = await page.locator(".baseline-row").count();
      await page.getByRole("button", { name: /Show all/ }).click();
      check(await page.locator(".baseline-row").count() === 118, "expanded register lost cities");
      const expanded = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth - innerWidth,
        heights: [...document.querySelectorAll(".baseline-row-link")].map(el => el.getBoundingClientRect().height),
      }));
      check(expanded.overflow === 0, `expanded baseline/${theme}/${width}: overflow`);
      check(expanded.heights.every(height => height >= 44 && height <= 100), "expanded register has inflated or undersized records");
      await page.getByRole("button", { name: /Collapse to top/ }).click();
      check(await page.locator(".baseline-row").count() === initial, "register collapse failed");
      await page.locator("#baseline-q").fill("Phuket");
      const result = await page.locator(".baseline-row-link").first().boundingBox();
      check(result.y < 900, `baseline/${theme}/${width}: search result separated from input`);
    }
  }
  // Reproduce the former filter wall; the result must fall outside the same budget.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + "/baseline");
  await page.locator("#baseline-q").waitFor();
  const injected = await page.addStyleTag({ content: ".baseline-search { padding-top: 1000px !important; }" });
  const displaced = await page.locator(".baseline-row-link").first().boundingBox();
  check(displaced.y >= 900, "expanded-state guard missed the original displaced-result failure");
  await injected.evaluate(el => el.remove());
  if (failures.length) assert.fail(failures.join('\n'));
  console.log('page budget ok');
} finally { await browser?.close(); await server?.close(); }
