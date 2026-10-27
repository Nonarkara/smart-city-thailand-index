import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
let origin = process.env.AUDIT_ORIGIN || 'http://localhost:5188';
let server;
if (process.argv.includes('--serve')) {
  const { preview } = await import('vite');
  server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
  const address = server.httpServer.address();
  assert.ok(address && typeof address === 'object');
  origin = `http://127.0.0.1:${address.port}`;
}
const output = '.tmp/identity-audit';
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
const measurements = [];
function assertCityMeasure(width) {
  assert.ok(width >= 100, `city name squeezed into ${width}px column`);
}
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'th', 'zh']) {
    for (const width of [390, 719, 720, 1024, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(origin + '/asus');
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.asus-city-row').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const heading = document.querySelector('h1');
        const intro = document.querySelector('.asus-intro');
        const rows = [...document.querySelectorAll('.asus-city-row')];
        return {
          language: document.documentElement.lang,
          overflow: document.documentElement.scrollWidth - innerWidth,
          titleY: heading.getBoundingClientRect().top,
          introHeight: intro.getBoundingClientRect().height,
          paddingTop: parseFloat(getComputedStyle(intro).paddingTop),
          rowCount: rows.length,
          minNameFont: Math.min(...rows.map(el => parseFloat(getComputedStyle(el.querySelector('.asus-city-name')).fontSize))),
          minNameWidth: Math.min(...rows.map(el => el.querySelector('.asus-city-name').getBoundingClientRect().width)),
          rowHeights: rows.map(el => el.getBoundingClientRect().height),
          fieldsLost: rows.flatMap(el => [...el.children].filter(child => {
            const r = child.getBoundingClientRect(), p = el.getBoundingClientRect();
            return !child.textContent.trim() || r.width <= 0 || r.height <= 0 || r.left < p.left - 1 || r.right > p.right + 1 || child.scrollWidth > child.clientWidth + 1;
          }).map(child => child.textContent)),
          methodColumns: getComputedStyle(document.querySelector('.asus-method-steps')).gridTemplateColumns.split(' ').length,
        };
      });
      assert.equal(geometry.language, locale === 'zh' ? 'zh-Hans' : locale);
      assert.equal(geometry.overflow, 0, `${locale}/${width}: page overflow`);
      assert.equal(geometry.rowCount, 15, 'city records lost');
      assert.ok(geometry.minNameFont >= 14, 'city names shrunk below body type');
      assertCityMeasure(geometry.minNameWidth);
      assert.deepEqual(geometry.fieldsLost, [], `${locale}/${width}: clipped/lost fields`);
      assert.ok(geometry.paddingTop <= 16, 'obsolete fixed-header space returned');
      assert.equal(geometry.methodColumns, width < 720 ? 2 : 4);
      await page.screenshot({ path: `${output}/asus-${locale}-${width}.png`, fullPage: true });
      measurements.push({ locale, width, ...geometry });
      console.log(locale, width, JSON.stringify(geometry));
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + '/asus');
  await page.evaluate(() => localStorage.setItem('smart-city-thailand-locale', 'en'));
  await page.reload();
  await page.locator('.asus-city-row').first().waitFor();
  await page.addStyleTag({ content: '.asus-city-row {grid-template-columns:2rem 1fr 10rem auto} .asus-city-row > * {grid-column:auto;grid-row:auto;overflow-wrap:normal;min-width:auto} .asus-city-name {font-size:var(--text-micro)}' });
  const oldMeasure = await page.locator('.asus-city-name').evaluateAll(elements => Math.min(...elements.map(el => el.getBoundingClientRect().width)));
  assert.throws(() => assertCityMeasure(oldMeasure), /squeezed/, 'mutation failed: original fixed grid passed the same city-name reading measure');
  await page.reload();
  await page.locator('.asus-city-action').first().focus();
  await page.locator('.asus-city-action').first().press('Enter');
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/city/nakhon-si-thammarat');
  await page.locator('.dossier-tab-list').waitFor();
  await writeFile(`${output}/asus-after.json`, JSON.stringify(measurements, null, 2));
  console.log('ASUS task geometry passed: 15 states; old fixed-grid mutation rejected; keyboard city navigation passed.');
} finally {
  await browser.close();
  await server?.close();
}
