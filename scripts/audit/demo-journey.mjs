// The demo's first decision: find a real city, then read eligibility beside its evidence.
// Check painted hit testing, not just overflow or an offscreen element's bounding box.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
let server, browser;
const dir = '.tmp/demo-journey';
fs.mkdirSync(dir, { recursive: true });
const results = [];
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const labels = { en: 'Find a city', th: 'ค้นหาเมือง', zh: '查找城市' };
  for (const locale of ['en', 'th', 'zh']) for (const width of [390, 768, 769, 900, 901, 1024, 1100, 1101, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(origin);
    await page.evaluate(l => localStorage.setItem('smart-city-thailand-locale', l), locale);
    await page.reload();
    await page.locator('.city-picker-trigger').waitFor({ state: 'attached' });
    const trigger = page.getByRole('button', { name: labels[locale], exact: true });
    if (!(await trigger.isVisible())) await page.locator('.nav-toggle').click();
    await trigger.click();
    await page.locator('.city-picker-search').fill('zzzz-no-such-city');
    assert.equal(await page.locator('.city-picker-empty').count(), 1);
    await page.locator('.city-picker-search').fill('');
    assert.equal(await page.locator('.city-picker-item').count(), 118);
    const painted = () => page.locator('.city-picker-item').first().evaluate(el => {
      const r = el.getBoundingClientRect();
      return { visible: el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2)), height: r.height };
    });
    const m = await painted();
    results.push({ locale, width, finder: m });
    await page.screenshot({ path: `${dir}/finder-${locale}-${width}.png` });
    assert.ok(m.visible, `finder results clipped at ${locale}/${width}`);
    assert.ok(m.height >= 44, 'directory row target shrunk');
    if (locale === 'en' && width === 1024) {
      await page.addStyleTag({ content: '.nav-links {overflow:auto!important;}' });
      const bad = await painted();
      assert.equal(bad.visible, false, 'old scroll-container clipping must fail painted visibility');
      await page.reload();
      await page.getByRole('button', { name: labels[locale], exact: true }).click();
    }
    await page.locator('.city-picker-search').fill('CMU');
    await page.locator('.city-picker-item').first().click();
    await page.waitForURL(/\/city\/cmu-smart-city/);
    await page.locator('.investment-fit-note').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const geometry = () => page.locator('.investment-fit').evaluate(el => {
      const note = el.querySelector('.investment-fit-note').getBoundingClientRect();
      const rows = el.querySelector('.investment-fit-rows').getBoundingClientRect();
      const section = el.getBoundingClientRect();
      return { noteOffset: note.top - section.top, evidenceGap: rows.top - note.bottom, height: section.height };
    });
    if (width >= 769) {
      const g = await geometry();
      results.push({ locale, width, investment: g });
      assert.ok(g.noteOffset <= 20, 'illustration imposed an empty narration track');
      assert.ok(g.evidenceGap <= 16, 'investment note separated from evidence');
      if (locale === 'en' && width === 1024) {
        await page.addStyleTag({ content: '.investment-fit{display:block!important}.investment-fit-band{display:flex!important;align-items:flex-end!important}.investment-fit-note{margin-bottom:10px!important}' });
        const bad = await geometry();
        assert.ok(bad.noteOffset > 20, 'old bottom-aligned narration void must fail geometry');
      }
    }
  }
  console.log('Demo journey: 27 multilingual breakpoint states; both original-fault mutations rejected.');
} finally {
  fs.writeFileSync(`${dir}/results.json`, JSON.stringify(results, null, 2));
  await browser?.close(); await server?.close();
}
