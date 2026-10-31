// MSH page budget: the cost of scrolling, measured on rendered pixels.
// Per route and viewport: total height in screens, where the H1 sits, and the presenter band.
// Ceilings are regression gates set just above the current measured height; lower them as pages
// get compacted, never raise them. Structural checks reject the sticker, the dot and the bars.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
const report = process.argv.includes('--report');
const check = (ok, msg) => { if (!ok && !report) assert.fail(msg); };
// [route, max screens @390x844, max screens @1440x900, max H1 top @390 (px)]
const BUDGET = [
  ['/', 14.4, 7.2, 520],
  ['/rankings', 7.7, 4.8, 420], ['/methodology', 18.2, 10, 420], ['/partners', 12.7, 6.4, 420], ['/program', 14.2, 7.8, 420],
  ['/invest', 23, 13, 420], ['/baseline', 22, 11.1, 420], ['/audit', 11.5, 5.7, 420], ['/references', 11.5, 5.7, 420], ['/knowledge', 7.6, 5.4, 420],
];
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
      if (report) console.log(`${route} ${w}: ${screens.toFixed(1)} screens, h1 y=${m.h1Top}, band=${m.band}, figure=${m.fig}`);
      check(m.overflow === 0, `${route}@${w}: horizontal overflow`);
      check(screens <= max, `${route}@${w}: ${screens.toFixed(1)} screens exceeds budget ${max}. Compact it; do not raise the ceiling.`);
      check(!m.avatar && !m.bars, `${route}@${w}: avatar-sized mascot or decorative pillar bars are back`);
      if (m.band != null) {
        check(m.fig >= 96, `${route}@${w}: commissioned art shrunk to ${m.fig}px; it must read as a presenter, not a dot`);
        check(m.band <= (w < 720 ? 200 : 170), `${route}@${w}: guide band ${m.band}px is stretched past its note and figure`);
      }
      if (w === 390 && route !== '/knowledge') check(m.h1Top <= maxH1, `${route}: H1 starts ${m.h1Top}px down; the page leads with chrome`);
    }
  }
  console.log('page budget ok');
} finally { await browser?.close(); await server?.close(); }
