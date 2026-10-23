// Exercise the rendered cascade: later rules and inline styles can defeat tokens.
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
const output = '.tmp/hierarchy';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/city/phuket`);
    await page.locator('.depa-official-section').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/phuket-${width}.png` });
    await page.locator('.depa-official-section').screenshot({ path: `${output}/panel-${width}.png` });
    const metrics = await page.evaluate(() => {
      const size = selector => parseFloat(getComputedStyle(document.querySelector(selector)).fontSize);
      const source = document.querySelector('.depa-official-source').getBoundingClientRect();
      return { heading: size('.depa-official-header h2'), body: size('.depa-official-vision'), overflow: document.documentElement.scrollWidth - innerWidth, sourceRight: source.right, width: innerWidth };
    });
    assert.ok(metrics.heading / metrics.body >= 1.5, JSON.stringify(metrics));
    assert.equal(metrics.overflow, 0);
    assert.ok(metrics.sourceRight <= metrics.width);
    await page.getByRole('tab', { name: 'Analysis', exact: true }).click();
    assert.equal(await page.locator('.city-dossier-card-body').first().evaluate(e => getComputedStyle(e).fontSize), '14px');
    await page.locator('.city-dossier-grid').first().scrollIntoViewIfNeeded();
    await page.screenshot({ path: `${output}/analysis-${width}.png` });
  }
  for (const route of ['', 'methodology', 'invest', 'rankings']) {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${origin}/${route}`);
      await page.locator('main h2').first().scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${output}/${route || 'home'}-${width}.png` });
      assert.equal(await page.locator('main h2').first().evaluate(e => getComputedStyle(e).fontSize), '32px');
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    }
  }
  for (const locale of ['th', 'zh', 'en']) {
    await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
    await page.goto(`${origin}/city/phuket`);
    await page.locator('.depa-official-section').screenshot({ path: `${output}/panel-${locale}.png` });
  }
  await page.pdf({ path: `${output}/phuket.pdf`, format: 'A4', tagged: true, outline: true });
  console.log(`Reading hierarchy verified on ${origin}: widths, chapter/body contrast, analysis prose, source containment, three locales and print.`);
} finally { await browser.close(); }
