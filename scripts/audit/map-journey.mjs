// Map-first decision geometry, keyboard selection and honest image failure.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5190';
let server, browser;
const directory = '.tmp/map-journey';
fs.mkdirSync(directory, { recursive: true });
const records = [];
const geometry = () => {
  const svg = document.querySelector('.map-dash-map > svg');
  const matrix = svg.getScreenCTM();
  const box = svg.viewBox.baseVal;
  const top = new DOMPoint(box.x, box.y).matrixTransform(matrix).y;
  const bottom = new DOMPoint(box.x, box.y + box.height).matrixTransform(matrix).y;
  return { top, height: bottom - top, visible: Math.max(0, Math.min(bottom, innerHeight) - Math.max(top, 0)),
    overflow: document.documentElement.scrollWidth - innerWidth };
};
const check = value => {
  assert.equal(value.overflow, 0, 'map task overflows');
  assert.ok(value.top <= (value.width === 390 ? 304 : value.width === 768 ? 267 : 235), `map buried at y=${value.top}`);
  assert.ok(value.visible >= value.viewportHeight * (value.width === 390 ? 0.54 : 0.6), 'map loses the first-screen majority');
};
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  for (const locale of ['en', 'th', 'zh']) for (const width of [390, 768, 1024, 1440, 1980]) {
    const height = width === 390 ? 844 : 900;
    const page = await browser.newPage({ viewport: { width, height }, reducedMotion: 'reduce' });
    // Deterministic outage case: external availability cannot turn a missing map into an unlabelled blank.
    await page.route('**/server.arcgisonline.com/**', route => route.abort());
    await page.addInitScript(l => localStorage.setItem('smart-city-thailand-locale', l), locale);
    await page.goto(`${origin}/map`, { waitUntil: 'domcontentloaded' });
    await page.locator('.map-city-marker').first().waitFor();
    await page.evaluate(() => document.fonts.ready);
    const m = { ...await page.evaluate(geometry), locale, width, viewportHeight: height };
    records.push(m);
    await page.screenshot({ path: `${directory}/${locale}-${width}.png` });
    check(m);
    assert.ok((await page.locator('.map-basemap-status').innerText()).length > 20);
    await page.locator('.map-city-marker').first().focus();
    assert.equal(await page.locator('.map-city-marker').first().evaluate(el => el === document.activeElement), true);
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/city\//);
    if (locale === 'en' && width === 390) {
      await page.goto(`${origin}/map`);
      await page.locator('.map-city-marker').first().waitFor();
      await page.evaluate(() => {
        const guide = document.querySelector('.map-guide-context');
        document.querySelector('.map-dashboard').before(guide);
      });
      const old = { ...await page.evaluate(geometry), viewportHeight: height, width };
      assert.throws(() => check(old), /buried|majority/, 'restoring the former leading guide must fail');
    }
    if (width === 390) {
      await page.goto(`${origin}/map`);
      await page.locator('.map-city-marker').first().waitFor();
      await page.evaluate(() => {
        const text = [...document.querySelectorAll('h1, p, button, a, span')].map(el => [el, parseFloat(getComputedStyle(el).fontSize)]);
        for (const [el, size] of text) el.style.fontSize = `${size * 2}px`;
      });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, 'enlarged text overflows');
      await page.screenshot({ path: `${directory}/${locale}-${width}-text200.png` });
    }
    await page.close();
  }
  console.log('Map journey: 15 viewport/language states, keyboard dossier navigation, image outage and 200% text; old leading-band defect rejected.');
} finally {
  fs.writeFileSync(`${directory}/results.json`, JSON.stringify(records, null, 2));
  await browser?.close(); await server?.close();
}
