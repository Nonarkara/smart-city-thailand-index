import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5191';
let browser, server;
const output = '.tmp/footer-audit';
const results = [];
const sharedResults = [];
await mkdir(output, { recursive: true });
function assertClosedHeight(height, width) {
  const budget = width < 540 ? 350 : width < 760 ? 300 : 250;
  assert.ok(height <= budget, `inflated closed research notes: ${height}px > ${budget}px at ${width}`);
}
function assertClosingPath(height,width) { assert.ok(height <= (width < 540 ? 600 : width < 760 ? 500 : 400), `inflated scope+notes path ${height}`); }
function assertSingleClosingBand(count) { assert.equal(count, 0, 'duplicated closing credit band'); }
try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  let page = await browser.newPage({ reducedMotion: 'reduce' });
  for (const locale of ['en', 'th', 'zh']) {
    for (const width of [390, 730, 759, 760, 1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : width === 1280 ? 720 : 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      const notes = page.locator('.legal-strip-section');
      assert.equal(await notes.count(), 1, 'research notes must occur once');
      await notes.scrollIntoViewIfNeeded();
      await page.evaluate(() => document.fonts.ready);
      const geometry = await notes.evaluate(el => {
        const r = el.getBoundingClientRect();
        return {
          language: document.documentElement.lang,
          height: r.height,
          pageWidth: document.documentElement.scrollWidth,
          pageHeight: document.documentElement.scrollHeight,
          overflow: document.documentElement.scrollWidth - innerWidth,
          gutter: el.querySelector('.legal-research-note').getBoundingClientRect().left - r.left,
          chromeHeight: document.querySelector('.topbar').getBoundingClientRect().height,
          densityHeight: document.querySelector('.data-density-section').getBoundingClientRect().height,
          closingPathHeight: r.bottom - document.querySelector('.data-density-section').getBoundingClientRect().top,
          scopeFacts: [...document.querySelectorAll('.density-stat')].map(stat => ({value:stat.querySelector('.density-value').textContent,label:stat.querySelector('.density-label').textContent,font:parseFloat(getComputedStyle(stat.querySelector('.density-value')).fontSize)})),
          summaries: [...el.querySelectorAll('summary')].map(s => ({ text:s.textContent, height:s.getBoundingClientRect().height, font:parseFloat(getComputedStyle(s).fontSize), clipped:s.scrollWidth > s.clientWidth + 1 })),
          researchVisible: el.querySelector('.legal-research-note').getBoundingClientRect().height > 0,
          paragraphs: [...el.querySelectorAll('.legal-strip-inner > .legal-text, .legal-research-note > .legal-text')].map(p => ({ text:p.textContent, font:parseFloat(getComputedStyle(p).fontSize), clipped:p.scrollWidth > p.clientWidth + 1 })),
          credit: el.querySelector('.legal-footer-note').textContent,
          creditFont: parseFloat(getComputedStyle(el.querySelector('.legal-footer-note')).fontSize),
        };
      });
      assert.equal(geometry.language, locale === 'zh' ? 'zh-Hans' : locale);
      assert.equal(geometry.overflow, 0, `${locale}/${width}: page overflow`);
      assert.ok(geometry.gutter >= 12, 'notes bleed to viewport edge');
      assertClosedHeight(geometry.height, width);
      assertClosingPath(geometry.closingPathHeight,width);
      assert.equal(geometry.scopeFacts.length,6,'scope facts lost');
      assert.ok(geometry.scopeFacts.every(fact => fact.value && fact.label && fact.font >= 14),'scope fact shrunk or lost');
      assertSingleClosingBand(await page.locator('.dashboard-fineprint').count());
      assert.ok(geometry.researchVisible && geometry.paragraphs.length === 2, 'research or reuse qualification hidden');
      assert.ok(geometry.paragraphs.every(p => p.font >= 14 && !p.clipped), 'qualification shrunk or clipped');
      assert.equal(geometry.summaries.length, 2, 'privacy/framework detail lost');
      assert.ok(geometry.summaries.every(s => s.height >= 44 && s.font >= 14 && !s.clipped), 'unreadable/unusable disclosure');
      assert.ok(geometry.creditFont >= 11.5);
      assert.equal((geometry.credit.match(/SCITI-2026-R1/g) || []).length, 1, 'release identity repeated');
      assert.equal(await notes.locator('a[href="mailto:non.ar@depa.or.th"]').count(), 1);
      assert.equal(await notes.locator('a[href="https://creativecommons.org/licenses/by/4.0/"]').count(), 1);
      assert.equal(await notes.locator('a[href="/methodology"]').count(), 1);
      for (const name of ['privacy', 'frameworks']) {
        const details = notes.locator(`[data-note="${name}"]`);
        assert.equal(await details.getAttribute('open'), null, 'supporting reading unexpectedly expanded');
        const summary = details.locator('summary');
        await summary.focus(); await summary.press('Enter');
        const body = details.locator('p');
        await body.waitFor({ state:'visible' });
        const text = await body.innerText();
        assert.ok(name === 'privacy' ? text.includes('ipapi.co') && text.includes('Google Apps Script') : text.includes('ISO 37122:2019'));
        assert.ok(await body.evaluate(p => p.getBoundingClientRect().height > 0 && p.scrollWidth <= p.clientWidth + 1), 'full legal text clipped');
        await summary.press('Enter');
        assert.equal(await details.getAttribute('open'), null);
      }
      if (width === 390) {
        await notes.locator('[data-note="privacy"] > summary').click();
        await notes.locator('[data-note="frameworks"] > summary').click();
        assert.equal(await notes.locator('details[open]').count(), 2);
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 0, 'expanded legal reading overflows');
        await page.screenshot({ path:`${output}/footer-expanded-${locale}-${width}.png`, animations:'disabled' });
        await notes.locator('[data-note="privacy"] > summary').click();
        await notes.locator('[data-note="frameworks"] > summary').click();
      }
      if (width === 390 || width === 1440) await page.screenshot({ path:`${output}/footer-${locale}-${width}.png`, animations:'disabled' });
      results.push({locale,width,...geometry});
      console.log(locale,width,'closed notes',geometry.height);
      await browser.close(); browser = await chromium.launch(); page = await browser.newPage({reducedMotion:'reduce'});
    }
  }
  await page.goto(origin);
  for (const locale of ['en', 'th', 'zh']) {
  await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({width,height:width===390?844:900});
    await page.goto(`${origin}/about`);
    const footer=page.locator('.site-footer'); await footer.scrollIntoViewIfNeeded();
    const height=await footer.evaluate(el=>el.getBoundingClientRect().height);
    assert.ok(height < (width===390?600:400), `inflated shared footer ${height}`);
    assert.equal(await footer.locator('.legal-strip-section').count(),1);
    assert.equal(await footer.locator('.footer-logo').count(),4, 'institutional credits lost');
    const about=footer.locator('.footer-fineprint');
    await about.locator('summary').focus(); await about.locator('summary').press('Enter');
    assert.equal(await about.getAttribute('open'),'');
    assert.ok(await about.innerText());
    await page.screenshot({path:`${output}/about-footer-open-${width}.png`,animations:'disabled'});
    sharedResults.push({locale,width,height});
    console.log('shared footer',locale,width,height);
  }
  await browser.close(); browser = await chromium.launch(); page = await browser.newPage({reducedMotion:'reduce'}); await page.goto(origin);
  }
  await page.setViewportSize({width:390,height:844});await page.goto(origin);
  await page.locator('.legal-strip-section').scrollIntoViewIfNeeded();
  // Restore the padded-box mechanism locally. Keep the new truthful text.
  const paddedStyle = await page.addStyleTag({content:'.legal-strip-section{padding:40px 0 48px!important}.legal-strip-inner{gap:24px!important}.legal-strip-grid{display:block!important}.legal-block,.legal-research-note,.legal-strip-inner>.legal-text{padding:16px!important;border:1px solid!important;margin-bottom:20px!important}.legal-footer-note{padding:16px!important}'});
  const padded=await page.locator('.legal-strip-section').evaluate(el=>el.getBoundingClientRect().height);
  assert.throws(()=>assertClosedHeight(padded,390),/inflated closed research notes/,'old padded boxes escaped guard');
  await paddedStyle.evaluate(el=>el.remove());
  await page.addStyleTag({content:'.data-density-section{padding:32px 0!important}.data-density-grid{display:grid!important;grid-template-columns:repeat(2,1fr)!important;gap:24px!important}.density-stat{flex-direction:column!important;align-items:flex-start!important}.density-value{font-size:32px!important}.density-stat-date .density-value{font-size:14px!important}'});
  const oldClosingPath = await page.locator('.data-density-section').evaluate(el=>document.querySelector('.legal-strip-section').getBoundingClientRect().bottom - el.getBoundingClientRect().top);
  assert.throws(()=>assertClosingPath(oldClosingPath,390),/inflated scope\+notes path/,'old scope display grid escaped path budget');
  await page.locator('.legal-footer-note').evaluate(el=>{const band=document.createElement('section');band.className='dashboard-fineprint';band.textContent=el.textContent;el.closest('section').after(band);});
  const duplicateCount = await page.locator('.dashboard-fineprint').count();
  assert.throws(()=>assertSingleClosingBand(duplicateCount),/duplicated closing credit band/,'duplicate identity band escaped guard');
  assert.equal(await page.locator('.dashboard-fineprint').count(),1);
  await writeFile(`${output}/footer-geometry.json`,JSON.stringify({notes:results,shared:sharedResults},null,2));
  console.log('Footer verified: 21 locale/width states, preserved visible research/reuse terms, keyboard privacy/frameworks, institutional credits, padded-box and duplicate-band mutations rejected.');
} finally { await browser?.close(); await server?.close(); }
