import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const output = '.tmp/heritage-gallery';
await mkdir(output, { recursive: true });
const register = JSON.parse(await readFile('dist/heritage/source-register.json', 'utf8'));
const { data: cities } = JSON.parse(await readFile('dist/api-static/cities.json', 'utf8'));
const records = new Map(register.records.map(record => [record.id, record]));
assert.deepEqual(Object.keys(register.byCity).sort(), cities.map(city => city.id).sort(), 'heritage register lost a dossier');
for (const city of cities) {
  const ids = register.byCity[city.id];
  assert.ok(ids?.length && ids.every(id => records.has(id)), `${city.id}: missing source record`);
  assert.ok(ids.some(id => records.get(id).verifiedAt && records.get(id).scope !== 'regional'), `${city.id}: regional object used as local evidence`);
}
function assertHeroCredits(overlap, id) {
  assert.ok(overlap <= 0, `${id}: dossier tabs cover source credits by ${overlap}px`);
}
const assets = [...new Set(register.records.flatMap(record => [record.image, record.jpegImage].filter(Boolean)))];
for (const asset of assets) {
  assert.match(asset, /^\/heritage\/[a-z0-9.-]+$/i, 'nonportable heritage path');
  const bytes = await readFile(`dist${asset}`);
  const webp = bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WEBP';
  const jpeg = bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
  assert.ok(asset.endsWith('.webp') ? webp : jpeg, `${asset}: file is not the declared image format`);
  const meta = await sharp(bytes).metadata();
  assert.ok(meta.width >= 100 && meta.height >= 100, `${asset}: unusable image dimensions`);
}
console.log(`Assets verified: ${assets.length} real local JPEG/WebP files; ${cities.length} dossier mappings; ${records.size} source records.`);
if (!process.argv.includes('--assets-only')) {
  let origin = process.env.AUDIT_ORIGIN || 'http://localhost:5191';
  let server, browser;
  const measurements = [];
  try {
    if (process.argv.includes('--serve')) {
      const { preview } = await import('vite');
      server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
      origin = `http://127.0.0.1:${server.httpServer.address().port}`;
    }
    browser = await chromium.launch();
    let page = await browser.newPage({ reducedMotion: 'reduce' });
    // A research-park or registered dossier must not borrow an unrelated city hero.
    for (const id of ['wangchan-valley', 'reg-phrae']) {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${origin}/city/${id}/`);
      await page.evaluate(() => localStorage.setItem('smart-city-thailand-locale', 'en'));
      await page.reload();
      const hero = records.get(register.byCity[id].find(key => records.get(key).scope !== 'regional'));
      const image = page.locator('.city-hero-photo img');
      await image.waitFor();
      assert.equal(await image.getAttribute('alt'), hero.title.en);
      assert.ok((await image.getAttribute('src')).endsWith(hero.image));
      const context = page.locator('[data-hero-scope="province"]');
      assert.ok((await context.innerText()).includes(hero.author));
      assert.equal(await context.locator(`a[href="${hero.sourceUrl}"]`).count(), 1);
      assert.equal(await context.locator(`a[href="${hero.licenseUrl}"]`).count(), 1);
      await page.evaluate(() => { window.scrollTo(0, 0); return document.fonts.ready; });
      const overlap = await context.evaluate(el => {
        const bottom = el.getBoundingClientRect().bottom;
        const top = document.querySelector('.dossier-tab-list').getBoundingClientRect().top;
        return bottom - top;
      });
      assertHeroCredits(overlap, id);
      if (id === 'wangchan-valley') {
        const oldOffset = await page.addStyleTag({ content: '.dossier-tabs { margin-top: -16px !important; }' });
        // A newly inserted stylesheet can precede Chromium's style/layout update.
        // Prove the fault is applied before asking the geometry guard to reject it.
        await page.waitForFunction(() => getComputedStyle(document.querySelector('.dossier-tabs')).marginTop === '-16px');
        const oldOverlap = await context.evaluate(el => el.getBoundingClientRect().bottom - document.querySelector('.dossier-tab-list').getBoundingClientRect().top);
        assert.throws(() => assertHeroCredits(oldOverlap, id), /cover source credits/, 'original negative offset escaped guard');
        await oldOffset.evaluate(el => el.remove());
      }
    }
    const ids = ['phuket', 'nakhon-si-thammarat', 'yala', 'reg-trat', 'reg-phrae'];
    const cases = ids.flatMap(id => ['en', 'th', 'zh'].map(locale => ({ id, locale, width: 390, height: 844 })))
      .concat(ids.flatMap(id => [1024, 1440].map(width => ({ id, locale: 'en', width, height: 900 }))))
      .concat(['phuket', 'nakhon-si-thammarat'].map(id => ({ id, locale: 'en', width: 1280, height: 720 })));
    for (const { id, locale, width, height } of cases) {
      // Bound WebGL/map resources across full dossier navigations.
      await browser.close();
      browser = await chromium.launch();
      page = await browser.newPage({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width, height });
      await page.goto(`${origin}/city/${id}/`);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      const gallery = page.locator('.city-heritage');
      await gallery.waitFor();
      await page.addStyleTag({ content: '*, *::before, *::after {animation:none !important;transition:none !important;}' });
      await page.evaluate(() => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible')));
      const wanted = id === 'nakhon-si-thammarat' ? 'vishnu' : register.byCity[id][0];
      const select = gallery.locator('select');
      if (await select.count()) await select.selectOption(wanted);
      await gallery.evaluate(el => {
        const chrome = [...document.querySelectorAll('.topbar,.dossier-tab-list')].reduce((sum, node) => sum + node.getBoundingClientRect().height, 0);
        window.scrollTo({ top: el.getBoundingClientRect().top + scrollY - chrome - 8, behavior: 'instant' });
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => { const img = document.querySelector('.city-heritage img'); return img?.complete && img.naturalWidth > 0; });
      const record = records.get(wanted);
      assert.equal(await gallery.locator('img').getAttribute('alt'), record.title[locale]);
      assert.ok((await gallery.innerText()).includes(record.caption[locale]), `${id}: caption and image separated`);
      assert.ok((await gallery.locator('.heritage-rights').innerText()).includes(record.license), `${id}: reuse terms lost`);
      assert.ok(await gallery.locator(`.heritage-rights a[href="${record.licenseUrl}"]`).count(), `${id}: license link changed independently`);
      assert.equal(await gallery.locator('.heritage-image-link').getAttribute('href'), record.sourceUrl);
      if (id === 'nakhon-si-thammarat') assert.equal(record.scope, 'regional');
      if (id === 'reg-trat') { assert.equal(record.photoDate, undefined); assert.ok(record.objectDate?.en.includes('1905')); }
      const geometry = await gallery.evaluate(el => {
        const r = el.getBoundingClientRect(), image = el.querySelector('img').getBoundingClientRect();
        const rights = el.querySelector('.heritage-rights').getBoundingClientRect();
        return { width: innerWidth, height: innerHeight, gallery: {x:r.x,y:r.y,width:r.width,height:r.height}, image: {width:image.width,height:image.height}, rights: {y:rights.y,height:rights.height}, overflow:document.documentElement.scrollWidth-innerWidth };
      });
      assert.equal(geometry.overflow, 0, `${id}/${locale}/${width}: overflow`);
      assert.ok(geometry.image.height > 80 && geometry.image.height <= (width < 900 ? 321 : 521), `${id}: image exceeds task preview budget`);
      await page.screenshot({ path: `${output}/${id}-${locale}-${width}.png`, animations: 'disabled' });
      measurements.push({ id, locale, ...geometry });
    }
    // Selection is one coupled image/caption/rights state, not three independent caches.
    await page.goto(`${origin}/city/nakhon-si-thammarat/`);
    await page.locator('.city-heritage select').selectOption('avalokiteshvara');
    const selected = records.get('avalokiteshvara');
    assert.equal(await page.locator('.city-heritage img').getAttribute('alt'), selected.title.en);
    assert.equal(await page.locator('.heritage-image-link').getAttribute('href'), selected.sourceUrl);
    assert.ok((await page.locator('.city-heritage').innerText()).includes(selected.caption.en));
    assert.ok((await page.locator('.heritage-rights').innerText()).includes(selected.license));
    const summary = page.locator('.heritage-technical-notes > summary');
    await summary.focus(); await page.keyboard.press('Enter');
    assert.equal(await page.locator('.heritage-technical-notes').getAttribute('open'), '');
    assert.ok(await page.locator('.heritage-technical-notes p').first().isVisible());
    await writeFile(`${output}/geometry.json`, JSON.stringify(measurements, null, 2));
    console.log(`Gallery verified: ${cases.length} language/viewport states; coupled selection and keyboard notes; source and geographic qualifications preserved.`);
  } finally { await browser?.close(); await server?.close(); }
}
