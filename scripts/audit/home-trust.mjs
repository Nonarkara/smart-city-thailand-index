import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

// Browser plugin not available: use the project's installed Playwright.
const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5190';
const output = process.env.AUDIT_OUTPUT || '/tmp/sciti-home-trust';
const recordOnly = process.argv.includes('--record-only');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const locale of ['en', 'th', 'zh']) {
    for (const width of [390, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      const rows = page.locator('.road-safety-champions');
      await rows.waitFor();
      await page.evaluate(() => document.fonts.ready);
      await rows.scrollIntoViewIfNeeded();
      const section = rows.locator('xpath=..');
      await section.screenshot({ path: `${output}/${locale}-${width}-road.png` });
      if (!recordOnly) {
        const text = await section.innerText();
        assert.match(text, /2025/);
        assert.doesNotMatch(text, /100K|WHO|thairsc\.com/);
        assert.equal(await rows.locator('button').count(), 5);
        assert.equal(await section.locator('a').getAttribute('href'), 'https://data.go.th/dataset/rtddi');
        if (locale === 'en') assert.match(text, /not population-adjusted rates/);
        const values = await rows.locator('.regional-champion-score').allTextContents();
        assert.ok(values.every(value => Number.isInteger(Number(value.replaceAll(',', '')))));
      }
      const reading = page.locator('.weekly-digest');
      await reading.scrollIntoViewIfNeeded();
      await reading.screenshot({ path: `${output}/${locale}-${width}-reading.png` });
      const geometry = await page.evaluate(() => {
        const nodes = [...document.querySelectorAll('.road-safety-champions button, .weekly-digest-slot')];
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          clipped: nodes.filter(node => node.scrollWidth > node.clientWidth + 1 || node.scrollHeight > node.clientHeight + 1).length,
          minimumTarget: Math.min(...nodes.map(node => node.getBoundingClientRect().height)),
        };
      });
      console.log(JSON.stringify({ locale, width, ...geometry, title: await page.title() }));
      if (!recordOnly) {
        assert.equal(geometry.overflow, 0);
        assert.equal(geometry.clipped, 0);
        assert.ok(geometry.minimumTarget >= 44);
        const query = reading.locator('a[href^="https://www.google.com/search"]');
        assert.equal(await query.count(), 1);
        assert.ok(new URL(await query.getAttribute('href')).searchParams.get('q'));
        assert.equal(await reading.locator('a[href="https://data.go.th/dataset/rtddi"]').count(), 1);
      }
    }
  }
  if (!recordOnly) {
    const link = page.locator('.road-safety-champions button').first();
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/city\//);
    assert.ok(await page.locator('h1').innerText());
    await page.goto(origin);
    const baseline = page.locator('.road-safety-champions').locator('xpath=..').locator('.home-section-note button');
    await baseline.click();
    await page.waitForURL(/\/baseline/);
    assert.ok(await page.locator('h1').innerText());
    console.log('City dossier keyboard navigation and baseline navigation passed');
  }
  assert.deepEqual(errors, [], 'runtime errors');
} finally {
  await browser.close();
}
