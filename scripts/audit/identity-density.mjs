import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const output = '.tmp/identity-density';
await mkdir(output, { recursive: true });
let origin = process.env.AUDIT_ORIGIN || 'http://localhost:5188';
let server, browser;
const records = [];
function checkIdentity(rows) {
  for (const row of rows) {
    assert.ok(!row.clipped, `clipped identity ${row.name}`);
    if (row.id === 'phuket') assert.equal(row.province, null, 'Phuket province repeated');
    if (row.id === 'rattanakosin') assert.ok(row.province, 'distinct Bangkok geography lost');
  }
}
function checkRows(rows, width) {
  for (const row of rows) {
    assert.ok(row.height >= 44 && row.height <= 88, `${width}: inflated row ${row.height}`);
    if (width === 390 && row.id === 'phuket') assert.ok(row.height <= 45, 'short identity still uses two bands');
  }
}
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'th', 'zh']) {
    for (const width of [390, 730, 1024, 1280, 1440, 1980]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : width === 1280 ? 720 : 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.home-collections').scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await page.evaluate(() => {
        const box = el => { const r = el.getBoundingClientRect(); return { x:r.x, y:r.y, width:r.width, height:r.height }; };
        return {
          width: innerWidth, height: innerHeight, pageHeight: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth - innerWidth,
          chrome: box(document.querySelector('.topbar')),
          section: box(document.querySelector('.home-collections')),
          rows: [...document.querySelectorAll('.home-collection-chip')].map(el => {
            const name = el.querySelector('.home-collection-chip-name');
            return { id:el.dataset.cityId, name:name.textContent, province:el.querySelector('.home-collection-chip-meta')?.textContent ?? null, score:el.querySelector('.home-collection-chip-score').textContent, height:el.getBoundingClientRect().height, clipped:name.scrollWidth > name.clientWidth + 1, font:parseFloat(getComputedStyle(name).fontSize) };
          }),
        };
      });
      assert.equal(geometry.rows.length, 14, 'editorial entries lost');
      assert.equal(geometry.overflow, 0, 'page overflow');
      checkIdentity(geometry.rows); checkRows(geometry.rows, width);
      assert.ok(geometry.section.height < (width === 390 ? 1250 : width < 760 ? 1150 : width < 1040 ? 800 : 450), `${locale}/${width}: inflated collection section ${geometry.section.height}`);
      assert.ok(geometry.rows.every(row => row.font >= 14 && /^\d+\.\d$/.test(row.score)), 'name or score lost');
      await page.screenshot({ animations: 'disabled', path:`${output}/${locale}-${width}.png` });
      records.push({ locale, ...geometry });
      console.log(locale, width, 'collection height', geometry.section.height, 'row heights', geometry.rows.map(r=>r.height));
    }
  }
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of ['/about', '/creative-economy', '/why', '/map']) {
      await page.goto(`${origin}${route}`);
      await page.locator('h1').waitFor();
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, `${route}/${width}: horizontal overflow`);
      if (route !== '/map') {
        const padding = await page.locator('.page-hero').evaluate(el => parseFloat(getComputedStyle(el).paddingTop));
        assert.ok(padding < 60, `${route}: obsolete header offset ${padding}`);
      }
    }
  }
  await page.setViewportSize({ width:390, height:844 });
  await page.goto(`${origin}/map`);
  await page.evaluate(() => localStorage.setItem('smart-city-thailand-locale', 'en'));
  await page.reload();
  await page.locator('.map-dash-controls').waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({content:'.map-dash-controls {flex-wrap:nowrap !important;}'});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'original unwrapped map controls escaped overflow guard');
  await page.goto(origin);
  await page.locator('[data-city-id="phuket"].home-collection-chip').focus();
  await page.keyboard.press('Enter');
  await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/city/phuket');
  await page.locator('.dossier-tab-list').waitFor();
  await page.goto(`${origin}/about`);
  const prompt = page.locator('.feedback-header');
  await prompt.scrollIntoViewIfNeeded();
  const closed = await page.locator('.data-feedback-section').evaluate(el=>el.getBoundingClientRect().height);
  assert.ok(closed < 100, `closed feedback band ${closed}`);
  await prompt.focus(); await page.keyboard.press('Enter');
  await page.locator('.feedback-input').fill('Local audit fixture; do not send');
  await page.locator('.feedback-button').isEnabled().then(value=>assert.ok(value, 'feedback cannot be submitted'));
  await page.locator('.data-feedback-section').screenshot({ path:`${output}/feedback-open.png` });
  await prompt.click(); await prompt.click();
  assert.equal(await page.locator('.feedback-input').inputValue(), 'Local audit fixture; do not send');
  await page.goto(origin);
  await page.locator('.home-collections').scrollIntoViewIfNeeded();
  const duplicate = await page.locator('[data-city-id="phuket"].home-collection-chip').evaluate(el=>{
    const meta=document.createElement('span');meta.className='home-collection-chip-meta';meta.textContent='Phuket';el.append(meta);
    return {id:'phuket',name:el.querySelector('.home-collection-chip-name').textContent,province:meta.textContent,clipped:false};
  });
  assert.throws(()=>checkIdentity([duplicate]), /repeated/, 'original duplicate identity escaped guard');
  await page.addStyleTag({content:'.home-collection-chip {padding:20px; min-height:110px;}'});
  const inflated = await page.locator('.home-collection-chip').first().evaluate(el=>el.getBoundingClientRect().height);
  assert.throws(()=>checkRows([{id:'phuket',height:inflated}],390), /inflated|two bands/, 'oversized row escaped guard');
  await writeFile(`${output}/geometry.json`, JSON.stringify(records,null,2));
  console.log('PASS: full names and 14 records; distinct geography; keyboard city and feedback; duplicate and inflated mutations rejected.');
} finally { await browser?.close(); await server?.close(); }
