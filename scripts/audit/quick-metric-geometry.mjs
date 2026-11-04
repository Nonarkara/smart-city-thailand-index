// Keep each quick metric, its geographic scope and its observation-period caveat together.
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5190';
let server, browser;
const directory = '.tmp/quick-metric-geometry';
fs.mkdirSync(directory, { recursive: true });
const records = [];
const periods = {
  en: 'Reference seed · period unverified',
  th: 'ข้อมูลตั้งต้นอ้างอิง · ยังไม่ยืนยันช่วงเวลา',
  zh: '参考种子数据 · 观测期未核实',
};

function measure() {
  const box = el => {
    const r = el.getBoundingClientRect();
    return { left: r.left, right: r.right, top: r.top, bottom: r.bottom, width: r.width, height: r.height };
  };
  const root = document.querySelector('.city-quick-metrics');
  return {
    overflow: document.documentElement.scrollWidth - innerWidth,
    root: box(root),
    rows: [...root.querySelectorAll('.city-qm:not(.city-qm-confidence)')].map(row => ({
      row: box(row),
      heading: box(row.querySelector('.city-qm-heading')),
      meta: box(row.querySelector('.city-qm-meta')),
      value: row.querySelector('.city-qm-val').textContent.trim(),
      label: row.querySelector('.city-qm-heading .city-qm-lab').textContent.trim(),
      metadata: row.querySelector('.city-qm-meta').textContent.trim(),
      sources: [...row.querySelectorAll('.city-qm-meta a')].map(a => ({ href: a.href, label: a.getAttribute('aria-label') })),
      parts: [...row.querySelectorAll('.city-qm-heading > *, .city-qm-meta > *')].map(el => {
        const style = getComputedStyle(el);
        // Thai glyph extents can exceed the line box with visible overflow;
        // that is not clipping. Require an actual clipping boundary.
        return {
          ...box(el), text: el.textContent.trim(),
          clipped: (style.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1)
            || (style.overflowY !== 'visible' && el.scrollHeight > el.clientHeight + 1),
        };
      }),
    })),
  };
}

function check(record, locale, width) {
  const within = (inner, outer) => inner.left >= outer.left - 1 && inner.right <= outer.right + 1 && inner.top >= outer.top - 1 && inner.bottom <= outer.bottom + 1;
  const overlaps = (a, b) => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 1 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 1;
  assert.equal(record.overflow, 0, `${locale}/${width}: page overflow`);
  assert.equal(record.rows.length, 4, 'Samyan quick metrics lost');
  // Four two/three-line facts plus confidence measure 264–303px on phone
  // and 152–153px in two columns. Leave font headroom, not a second card stack.
  assert.ok(record.root.height <= (width === 390 ? 360 : 200), `${locale}/${width}: quick facts inflated to ${record.root.height}px`);
  for (const row of record.rows) {
    assert.ok(row.label && row.value, 'metric label/value lost');
    assert.ok(row.metadata.includes(periods[locale]), `${row.label}: observation period caveat lost`);
    assert.ok(row.metadata.includes(' · '), `${row.label}: geographic provenance lost`);
    assert.ok(row.meta.top >= row.heading.bottom - 1, `${row.label}: provenance sits alongside its value instead of below it`);
    for (const part of row.parts) {
      assert.ok(part.text && part.width > 0 && part.height > 0, 'metric text hidden');
      assert.ok(within(part, row.row), `${row.label}: metric text escapes its row`);
      assert.ok(!part.clipped, `${row.label}: metric text clipped`);
    }
    for (let i = 0; i < row.parts.length; i++) for (let j = i + 1; j < row.parts.length; j++) {
      assert.ok(!overlaps(row.parts[i], row.parts[j]), `${row.label}: metric text overlaps`);
    }
    for (const source of row.sources) assert.ok(/^https?:\/\//.test(source.href) && source.label, 'source link or accessible label missing');
  }
  for (let i = 0; i < record.rows.length; i++) for (let j = i + 1; j < record.rows.length; j++) {
    assert.ok(!overlaps(record.rows[i].row, record.rows[j].row), 'quick metric rows overlap');
  }
}

try {
  if (process.argv.includes('--serve')) {
    const { preview } = await import('vite');
    server = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
    origin = `http://127.0.0.1:${server.httpServer.address().port}`;
  }
  browser = await chromium.launch();
  for (const locale of ['en', 'th', 'zh']) for (const width of [390, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width === 390 ? 844 : 900 }, reducedMotion: 'reduce' });
    await page.addInitScript(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
    await page.goto(`${origin}/city/samyan`, { waitUntil: 'domcontentloaded' });
    await page.locator('.city-qm-heading').first().waitFor();
    await page.locator('.city-quick-metrics').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    const record = { locale, width, ...await page.evaluate(measure) };
    records.push(record);
    await page.screenshot({ path: `${directory}/${locale}-${width}.png`, animations: 'disabled' });
    check(record, locale, width);
    if (locale === 'en' && width === 390) {
      await page.addStyleTag({ content: 'main .city-qm:not(.city-qm-confidence){display:flex !important;flex-direction:row !important;flex-wrap:nowrap !important;}' });
      const old = await page.evaluate(measure);
      await page.screenshot({ path: `${directory}/original-row-fault.png`, animations: 'disabled' });
      assert.throws(() => check(old, locale, width), /provenance sits alongside|escapes|overlaps|clipped/, 'restoring the horizontal provenance row must fail');
    }
    await page.close();
  }
  console.log('Quick metric geometry: EN/TH/CN at 390/1024/1440; values, sources, scope and period visible without overlap; original horizontal provenance fault rejected.');
} finally {
  fs.writeFileSync(`${directory}/results.json`, JSON.stringify(records, null, 2));
  await browser?.close();
  await server?.close();
}
