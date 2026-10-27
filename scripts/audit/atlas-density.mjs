import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

let origin = process.env.AUDIT_ORIGIN || 'http://localhost:5188';
const output = '.tmp/atlas-density';
await mkdir(output, { recursive: true });
const { data: cities } = JSON.parse(await readFile('dist/api-static/cities.json', 'utf8'));
const expectedIds = cities.map(city => city.id).sort();
const labels = {
  en: { title: 'Every City, One Investment Story', search: 'Search city or province', next: 'Next cities', previous: 'Previous cities' },
  th: { title: 'ทุกเมือง เรื่องราวการลงทุนหนึ่งเรื่อง', search: 'ค้นหาเมืองหรือจังหวัด', next: 'เมืองถัดไป', previous: 'เมืองก่อนหน้า' },
  zh: { title: '每座城市，一个投资故事', search: '搜索城市或府', next: '下一页城市', previous: '上一页城市' },
};
function assertPageSize(count) { assert.ok(count > 0 && count <= 12, `unpaginated Atlas: ${count} records`); }
const results = [];
let browser;
let server;
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    const address = server.httpServer.address();
    assert.ok(address && typeof address === 'object');
    origin = `http://127.0.0.1:${address.port}`;
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const recordIds = () => page.locator('.investment-atlas-results > [data-atlas-city-id]').evaluateAll(elements => elements.map(element => element.dataset.atlasCityId));
  for (const locale of ['en', 'th', 'zh']) {
    for (const [width, height] of [[390, 844], [1024, 900], [1440, 900], [1280, 720]]) {
      await page.setViewportSize({ width, height });
      await page.goto(`${origin}/invest`);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      const title = page.getByRole('heading', { name: labels[locale].title, exact: true });
      await title.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      await title.evaluate(element => window.scrollBy(0, element.closest('section').getBoundingClientRect().top - 64));
      const geometry = await title.evaluate(element => {
        const section = element.closest('section'), rect = section.getBoundingClientRect();
        const controls = section.querySelector('.investment-atlas-controls').getBoundingClientRect();
        const grid = section.querySelector('.investment-atlas-results'), first = grid.firstElementChild.getBoundingClientRect();
        const header = document.querySelector('.topbar')?.getBoundingClientRect();
        return { sectionHeight: rect.height, controlsOffset: controls.top - rect.top, firstResultOffset: first.top - rect.top,
          pageWidth: document.documentElement.scrollWidth, pageHeight: document.documentElement.scrollHeight,
          chromeHeight: header?.height ?? 0, controlHeight: controls.height, firstResultVisible: first.top < innerHeight,
          overflow: document.documentElement.scrollWidth - innerWidth, renderedCards: grid.children.length,
          targets: [...section.querySelectorAll('.investment-atlas-controls input, .investment-atlas-controls select')].map(control => {
            const r = control.getBoundingClientRect(); return { width: r.width, height: r.height, font: parseFloat(getComputedStyle(control).fontSize), clipped: control.scrollWidth > control.clientWidth + 2 };
          }), cardHeights: [...grid.children].map(card => card.getBoundingClientRect().height) };
      });
      assertPageSize(geometry.renderedCards);
      assert.equal(geometry.renderedCards, Math.min(12, expectedIds.length));
      assert.equal(geometry.overflow, 0, `${locale}/${width}: document overflow`);
      assert.ok(geometry.controlsOffset < 350, `${locale}/${width}: featured reading displaced directory controls`);
      assert.ok(geometry.firstResultOffset < 550 && geometry.firstResultVisible, `${locale}/${width}: directory evidence/action separated`);
      assert.ok(geometry.sectionHeight < (width < 720 ? 6000 : 3000), `${locale}/${width}: inflated directory section`);
      for (const target of geometry.targets) assert.ok(target.height >= 44 && target.width >= 44 && target.font >= 14 && !target.clipped, `${locale}/${width}: unreadable or unusable directory control`);
      assert.equal(await page.locator('.investment-atlas-featured').getAttribute('open'), null, 'featured reading must be optional');
      await page.screenshot({ path: `${output}/${locale}-${width}.png` });
      results.push({ locale, viewport: { width, height }, ...geometry });
      console.log(locale, width, 'section', geometry.sectionHeight, 'controls offset', geometry.controlsOffset, 'records', geometry.renderedCards);
    }
  }
  await page.evaluate(() => localStorage.setItem('smart-city-thailand-locale', 'en'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/invest`);
  await page.locator('.investment-atlas-results > [data-atlas-city-id]').first().waitFor();
  const allReached = new Set();
  for (let index = 0; index < Math.ceil(expectedIds.length / 12); index++) {
    const ids = await recordIds();
    assertPageSize(ids.length);
    assert.equal(new Set(ids).size, ids.length, 'duplicate cities within a page');
    ids.forEach(id => { assert.ok(!allReached.has(id), `city repeated across pages: ${id}`); allReached.add(id); });
    const next = page.getByRole('button', { name: labels.en.next, exact: true });
    if (index === Math.ceil(expectedIds.length / 12) - 1) assert.ok(await next.isDisabled());
    else { assert.ok(await next.isEnabled()); await next.click(); }
  }
  assert.deepEqual([...allReached].sort(), expectedIds, 'pagination lost a source city');
  const search = page.getByRole('searchbox', { name: labels.en.search, exact: true });
  const lastCity = cities.at(-1);
  await search.fill(lastCity.id);
  assert.deepEqual(await recordIds(), [lastCity.id], 'search failed to recover source last city from a later page');
  await page.screenshot({ path: `${output}/last-city-search.png` });
  await page.locator('.investment-atlas-results .city-story summary').click();
  assert.equal(await page.locator('.investment-atlas-results .city-story').getAttribute('open'), '');
  assert.ok(await page.locator('.investment-atlas-results .city-story-body').innerText(), 'full city story not readable');
  await page.screenshot({ path: `${output}/story-expanded.png` });
  await page.locator('.investment-atlas-results button').filter({ hasText: 'Open city dossier' }).click();
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === `/city/${lastCity.id}`);
  await page.locator('.dossier-tab-list').waitFor();
  await page.goto(`${origin}/invest`);
  await page.getByRole('button', { name: labels.en.next, exact: true }).click();
  await page.getByLabel('Region', { exact: true }).selectOption('south');
  const south = cities.filter(city => city.region === 'south').map(city => city.id);
  const filteredIds = await recordIds();
  assert.ok(filteredIds.every(id => south.includes(id)));
  assert.match(await page.locator('.investment-atlas-count').innerText(), /^1–/);
  await page.getByLabel('Region', { exact: true }).selectOption('all');
  await page.getByRole('button', { name: labels.en.next, exact: true }).click();
  await page.getByLabel('Sort cities', { exact: true }).selectOption('name');
  assert.match(await page.locator('.investment-atlas-count').innerText(), /^1–/);
  await page.getByRole('searchbox', { name: labels.en.search, exact: true }).fill('not-a-city-xyz');
  assert.equal((await recordIds()).length, 0);
  await page.screenshot({ path: `${output}/empty.png` });
  await page.getByRole('button', { name: 'Clear search and filters', exact: true }).click();
  assert.equal((await recordIds()).length, 12);
  await page.locator('.investment-atlas-featured > summary').click();
  assert.equal(await page.locator('.investment-atlas-featured [data-atlas-city-id]').count(), 4);
  assert.ok(await page.locator('.investment-atlas-featured').innerText());
  await page.locator('.investment-atlas-featured > summary').click();
  const oversizedCount = await page.locator('.investment-atlas-results').evaluate((grid, total) => {
    const originals = [...grid.children], missing = total - originals.length;
    for (let index = 0; index < missing; index++) grid.append(originals[index % originals.length].cloneNode(true));
    return grid.children.length;
  }, expectedIds.length);
  assert.throws(() => assertPageSize(oversizedCount), /unpaginated Atlas/, 'guard accepted restoration of the unpaginated directory');
  await writeFile(`${output}/geometry.json`, JSON.stringify(results, null, 2));
  console.log(`Atlas verified: ${expectedIds.length} unique source cities reachable; last-city search/story/dossier, filter/sort reset, empty recovery and optional featured reading passed. Unpaginated mutation rejected.`);
} finally { await browser?.close(); await server?.close(); }
