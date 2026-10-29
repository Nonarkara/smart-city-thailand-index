import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
await mkdir('.tmp/home-repair', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['th', 'en', 'zh']) {
    for (const width of [390, 1024, 1440, 1980, 2560]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.hero-stat-num').first().waitFor();
      const geometry = await page.evaluate(() => {
        const rect = s => document.querySelector(s).getBoundingClientRect();
        const hero = rect('.cinematic-hero');
        const action = rect('.home-city-guide-actions');
        const ribbon = rect('.home-stat-ribbon');
        const guide = document.querySelector('.opening-argument-inner');
        const guideEdge = guide.getBoundingClientRect().left + parseFloat(getComputedStyle(guide).paddingLeft);
        return { heroHeight: hero.height, actionBottom: action.bottom, gap: ribbon.top - hero.bottom, alignmentError: Math.abs(rect('.cinematic-hero-title').left - guideEdge), overflow: document.documentElement.scrollWidth - innerWidth };
      });
      assert.equal(geometry.overflow, 0, `${locale}/${width} overflow`);
      assert.ok(geometry.heroHeight < (width < 720 ? 645 : 420), `${locale}/${width} inflated hero: ${JSON.stringify(geometry)}`);
      assert.ok(geometry.actionBottom < 844, `${locale}/${width} primary action below first screen`);
      assert.ok(geometry.gap < 2, `${locale}/${width} empty row after hero`);
      assert.ok(geometry.alignmentError <= 1, `${locale}/${width} title detached from reading column: ${JSON.stringify(geometry)}`);
      await page.screenshot({ path: `.tmp/home-repair/${locale}-${width}.png` });
      console.log(locale, width, geometry);
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => localStorage.setItem('smart-city-thailand-locale', 'en'));
  await page.goto(origin);
  await page.getByRole('button', { name: 'Learn', exact: true }).click();
  await page.getByRole('button', { name: 'Compare cities with these priorities →' }).click();
  await page.locator('.lens-select-label select').waitFor();
  assert.equal(new URL(page.url()).pathname, '/rankings');
  assert.equal(new URL(page.url()).searchParams.get('lens'), 'learning');
  assert.equal(await page.locator('.lens-select-label select').inputValue(), 'learning');
  const search = await page.getByRole('searchbox', { name: 'Search', exact: true }).boundingBox();
  assert.ok(search && search.y + search.height <= 844, 'ranking search is below the first phone screen');
  await page.goto(origin);
  // Mutation: restoring the shipped viewport height must fail the same size guard.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.addStyleTag({ content: '.dashboard-home .cinematic-hero { height:75vh; min-height:400px; max-height:600px; }' });
  assert.ok((await page.locator('.cinematic-hero').boundingBox()).height > 420, 'guard missed original hero inflation');
  await page.setViewportSize({ width: 1980, height: 900 });
  await page.addStyleTag({ content: '.dashboard-home .cinematic-hero-overlay { padding-left:max(var(--gutter),calc((100vw - var(--w))/2 + var(--gutter))); }' });
  const badInset = await page.evaluate(() => {
    const guide = document.querySelector('.opening-argument-inner');
    return document.querySelector('h1').getBoundingClientRect().left - guide.getBoundingClientRect().left - parseFloat(getComputedStyle(guide).paddingLeft);
  });
  assert.ok(badInset > 100, 'guard missed viewport/container inset regression');
} finally { await browser.close(); }
