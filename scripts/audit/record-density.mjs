import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
const output = '.tmp/investor-density';
await mkdir(output, { recursive: true });
const { data } = JSON.parse(await readFile('dist/api-static/cities.json', 'utf8'));
const expected = data.filter(c => c.tier === 'beta' && c.reality === 'operational' && c.scores.economy >= 55).slice(0, 6);
function assertRecordHeight(height, locale, width, id) {
  assert.ok(height >= 44 && height <= 76, `${locale}/${width}/${id}: inflated row ${height}`);
  if (locale === 'en' && width === 390) assert.ok(height <= 54, `four short fields did not fit two lines: ${id}`);
}
let browser;
let server;
const results = [];
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    const address = server.httpServer.address();
    assert.ok(address && typeof address === 'object', 'preview has no local port');
    origin = `http://127.0.0.1:${address.port}`;
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'th', 'zh']) {
    for (const width of [390, 730, 1024, 1440, 1980]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.investor-card').first().scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const section = document.querySelector('.investor-section');
        const row = element => {
          const rect = element.getBoundingClientRect();
          const fields = ['name', 'score', 'province', 'vibe'].map(key => {
            const el = element.querySelector(`.investor-card-${key}`);
            const r = el.getBoundingClientRect();
            return { key, text: el.textContent, font: parseFloat(getComputedStyle(el).fontSize), clipped: el.scrollWidth > el.clientWidth + 1, inside: r.left >= rect.left - 1 && r.right <= rect.right + 1 && r.top >= rect.top - 1 && r.bottom <= rect.bottom + 1, painted: r.width > 0 && r.height > 0 && getComputedStyle(el).visibility !== 'hidden' };
          });
          return { id: element.dataset.cityId, height: rect.height, fields };
        };
        const rows = [...section.querySelectorAll('.investor-card')].map(row);
        const rect = section.getBoundingClientRect();
        const paragraph = section.querySelector('.investor-cta-text').getBoundingClientRect();
        return { height: rect.height, overflow: document.documentElement.scrollWidth - innerWidth, gutter: paragraph.left - rect.left, rows };
      });
      assert.equal(geometry.overflow, 0, `${locale}/${width}: horizontal overflow`);
      assert.ok(geometry.gutter >= 19, `${locale}/${width}: explanation bleeds to edge`);
      assert.deepEqual(geometry.rows.map(row => row.id), expected.map(city => city.id), 'shortlist entries changed');
      for (let index = 0; index < expected.length; index++) {
        const row = geometry.rows[index], city = expected[index];
        assertRecordHeight(row.height, locale, width, row.id);
        for (const field of row.fields) {
          assert.ok(field.text && !field.clipped && field.inside && field.painted, `${locale}/${width}/${row.id}: lost ${field.key}`);
          assert.ok(field.font >= (field.key === 'province' ? 11.5 : 14), `${row.id}: smaller text used to force density`);
        }
        assert.equal(row.fields[1].text, `${city.compositeScore.toFixed(1)}/100`);
        assert.ok(row.fields[3].text.includes(`${Math.max(...Object.values(city.scores))}/100`));
        if (locale !== 'zh') {
          assert.equal(row.fields[0].text, locale === 'th' ? city.nameTh : city.nameEn);
          assert.equal(row.fields[2].text, locale === 'th' ? city.provinceTh : city.province);
        }
      }
      assert.ok(geometry.height < (width < 720 ? 740 : 500), `${locale}/${width}: whole section still inflated`);
      await page.locator('.investor-section').screenshot({ path: `${output}/${locale}-${width}.png` });
      const covered = await page.locator('.investor-card').evaluateAll(elements => elements.filter(el => {
        const r = el.getBoundingClientRect();
        return document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2)?.closest('.investor-card') !== el;
      }).map(el => el.dataset.cityId));
      assert.deepEqual(covered, [], `${locale}/${width}: records are covered or unreachable`);
      results.push({ locale, width, ...geometry });
      console.log(locale, width, 'section', geometry.height, 'rows', geometry.rows.map(row => row.height));
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  await page.locator('.investor-card').first().scrollIntoViewIfNeeded();
  await page.locator('.investor-card').first().focus();
  await page.locator('.investor-card').first().press('Enter');
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/city/${expected[0].id}`);
  await page.locator('.dossier-tab-list').waitFor();
  await page.goto(origin);
  await page.addStyleTag({ content: '.investor-card {display:flex;flex-direction:column;gap:.1rem;padding:.85rem 1rem;} .investor-card-meta {display:contents;}' });
  const oversized = await page.locator('.investor-card').first().evaluate(el => el.getBoundingClientRect().height);
  assert.throws(() => assertRecordHeight(oversized, 'en', 390, 'restored-card'), /inflated row|two lines/, 'density guard did not reject restoration of four stacked fields');
  console.log('Mutation killed: restored four-line card exceeds record budget. Keyboard dossier navigation passed.');
  await writeFile(`${output}/geometry.json`, JSON.stringify(results, null, 2));
} finally { await browser?.close(); await server?.close(); }
