import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
await mkdir('.tmp/home-repair', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['th', 'en', 'zh']) {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.hero-stat-num').first().waitFor();
      const geometry = await page.evaluate(() => {
        const rect = s => document.querySelector(s).getBoundingClientRect();
        const hero = rect('.cinematic-hero');
        const action = rect('.cinematic-hero-actions');
        const ribbon = rect('.home-stat-ribbon');
        return { heroHeight: hero.height, actionBottom: action.bottom, gap: ribbon.top - hero.bottom, overflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.equal(geometry.overflow, 0, `${locale}/${width} overflow`);
      assert.ok(geometry.heroHeight < (width < 720 ? 570 : 420), `${locale}/${width} inflated hero: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.actionBottom < 844, `${locale}/${width} primary action below first screen`);
      assert.ok(geometry.gap < 2, `${locale}/${width} empty row after hero`);
      await page.screenshot({ path: `.tmp/home-repair/${locale}-${width}.png` });
      console.log(locale, width, geometry);
    }
  }
  // Mutation: restoring the shipped viewport height must fail the same size guard.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addStyleTag({ content: '.dashboard-home .cinematic-hero { height:75vh; min-height:400px; max-height:600px; }' });
  assert.ok((await page.locator('.cinematic-hero').boundingBox()).height > 420, 'guard missed original hero inflation');
} finally { await browser.close(); }
