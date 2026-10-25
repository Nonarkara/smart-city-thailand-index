import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
const output = process.env.AUDIT_OUTPUT || '/tmp/sciti-home-index';
const recordOnly = process.argv.includes('--record-only');
await mkdir(output, { recursive: true });
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const locale of ['th', 'en', 'zh']) {
    for (const width of [390, 719, 720, 1024, 1440, 1980]) {
      await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
      await page.goto(origin);
      await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
      await page.reload();
      await page.locator('.pillar-champion-btn').first().waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.pillar-champions').scrollIntoViewIfNeeded();
      await page.evaluate(() => {
        const section = document.querySelector('.pillar-champions').closest('section');
        scrollTo(0, section.getBoundingClientRect().top + scrollY - document.querySelector('.topbar').getBoundingClientRect().height - 12);
      });
      const geometry = await page.evaluate(() => {
        const rect = element => element.getBoundingClientRect();
        const sections = [...document.querySelectorAll('.home-column > section')].slice(0, 3);
        const gap = sections.slice(1).map((section, index) => rect(section.querySelector('.eyebrow')).top - rect(sections[index].querySelector('ul')).bottom);
        const cities = [...document.querySelectorAll('.pillar-champion-city')];
        const buttons = [...document.querySelectorAll('.regional-champion-btn')];
        const header = rect(document.querySelector('.topbar'));
        return {
          overflow: document.documentElement.scrollWidth - innerWidth,
          sectionGaps: gap,
          clippedCities: cities.filter(city => city.scrollWidth > city.clientWidth + 1).length,
          maxRegionalRow: Math.max(...buttons.map(button => rect(button).height)),
          minimumTarget: Math.min(...buttons.map(button => rect(button).height)),
          headerHeight: header.height,
          chromePercent: 100 * header.height / innerHeight,
          pillarCount: cities.length,
          regionCount: document.querySelectorAll('.regional-champions:not(.road-safety-champions) > li').length,
          roadCount: document.querySelectorAll('.road-safety-champions > li').length,
        };
      });
      console.log(JSON.stringify({ locale, width, ...geometry }));
      await page.screenshot({ path: `${output}/${locale}-${width}-index.png` });
      if (!recordOnly) {
        assert.equal(geometry.overflow, 0, `${locale}/${width}: horizontal overflow`);
        assert.equal(geometry.clippedCities, 0, `${locale}/${width}: hidden city names`);
        assert.ok(geometry.maxRegionalRow <= 88, `${locale}/${width}: inflated rows`);
        assert.ok(geometry.minimumTarget >= 44, `${locale}/${width}: unusable targets`);
        assert.ok(geometry.sectionGaps.every(gap => gap <= 48), `${locale}/${width}: doubled section spacing`);
        assert.equal(geometry.pillarCount, 7);
        assert.equal(geometry.regionCount, 6);
        assert.equal(geometry.roadCount, 5);
      }
      await page.evaluate(() => {
        const section = document.querySelector('.regional-champions').closest('section');
        scrollTo(0, section.getBoundingClientRect().top + scrollY - document.querySelector('.topbar').getBoundingClientRect().height - 12);
      });
      await page.screenshot({ path: `${output}/${locale}-${width}-regions.png` });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `${output}/${locale}-${width}-opening.png` });
    }
  }
  assert.deepEqual(errors, [], 'runtime errors');
  if (!recordOnly) {
    // A rendered mutation must restore the screenshot's real failure and
    // make the same geometry test fail, not just match a CSS source string.
    await page.addStyleTag({ content: '.dashboard-home .home-column > section.section + section.section { margin-top: 160px !important; }' });
    const mutatedGap = await page.evaluate(() => {
      const sections = [...document.querySelectorAll('.home-column > section')];
      return sections[1].querySelector('.eyebrow').getBoundingClientRect().top - sections[0].querySelector('ul').getBoundingClientRect().bottom;
    });
    assert.ok(mutatedGap > 48, 'gap regression guard missed its mutation');
    console.log('Mutation killed: doubled section spacing');
    await page.reload();
    const regionalEntry = page.locator('.regional-champion-btn').first();
    await regionalEntry.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(/\/city\//);
    console.log('Keyboard navigation passed:', new URL(page.url()).pathname);
  }
} finally {
  await browser.close();
}
