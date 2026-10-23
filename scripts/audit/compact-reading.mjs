import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
await mkdir('.tmp/density', { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/city/phuket`);
    await page.locator('.city-profile-read').waitFor();
    const heights = await page.evaluate(() => Object.fromEntries(['.city-detail-header', '.depa-official-section', '.city-decision-strip'].map(selector => [selector, document.querySelector(selector).getBoundingClientRect().height])));
    assert.ok(heights['.city-detail-header'] < 65, JSON.stringify(heights));
    assert.ok(heights['.depa-official-section'] < (width === 390 ? 900 : 500), JSON.stringify(heights));
    if (width === 390) assert.ok(heights['.city-decision-strip'] < 330);
    for (const tab of ['Overview', 'Analysis', 'Execution', 'Evidence', 'Next Steps']) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      // Let the existing tab entrance transition finish before measuring layout.
      await page.locator('.dossier-panel-slot[data-active="true"] .dossier-tab-content').evaluate(async e => { await Promise.all(e.getAnimations().map(a => a.finished)); });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} ${tab} overflows`);
      await page.screenshot({ path: `.tmp/density/${tab.replace(' ', '-')}-${width}.png` });
    }
    console.log(width, heights);
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  for (const locale of ['th', 'zh', 'en']) {
    await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
    await page.goto(`${origin}/city/phuket`);
    await page.locator('.city-profile-read').waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.depa-official-section').screenshot({ path: `.tmp/density/plan-${locale}.png` });
  }
  await page.pdf({ path: '.tmp/density/phuket.pdf', format: 'A4', tagged: true });
  console.log(`Compact reading verified: ${origin}`);
} finally { await browser.close(); }
