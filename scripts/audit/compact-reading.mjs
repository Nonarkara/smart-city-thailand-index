import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
let origin = process.env.AUDIT_ORIGIN || 'http://127.0.0.1:5188';
await mkdir('.tmp/density', { recursive: true });

// ── Serve the built site when asked ──────────────────────────────────────
// The other gates take `--serve` and preview dist/ themselves. These two
// predate that convention and read AUDIT_ORIGIN, so CI could not run them
// without a server already running. They now speak the same language.
let previewServer = null;
if (process.argv.includes('--serve')) {
  const { preview } = await import('vite');
  previewServer = await preview({ preview: { host: '127.0.0.1', port: 0, strictPort: true }, logLevel: 'error' });
  origin = `http://127.0.0.1:${previewServer.httpServer.address().port}`;
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  for (const width of [390, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`${origin}/city/phuket`);
    // The quick-read block was consolidated into Nong Plub's infographic on
    // 28 Oct (13563ea), so the old selector never appears and this gate
    // had been failing on a removed component rather than on a defect.
    await page.locator('.nong-plub-card').first().waitFor();
    const heights = await page.evaluate(() => Object.fromEntries(['.city-detail-header', '.depa-official-section', '.city-decision-strip'].map(selector => [selector, document.querySelector(selector).getBoundingClientRect().height])));
    assert.ok(heights['.city-detail-header'] < 65, JSON.stringify(heights));
    assert.ok(heights['.depa-official-section'] < (width === 390 ? 900 : 500), JSON.stringify(heights));
    if (width === 390) assert.ok(heights['.city-decision-strip'] < 330);
    for (const tab of ['Overview', 'Analysis', 'Execution', 'Evidence', 'Next Steps']) {
      await page.getByRole('tab', { name: tab, exact: true }).click();
      // Let the existing tab entrance transition finish before measuring layout.
      await page.locator('.dossier-panel-slot[data-active="true"] .dossier-tab-content').evaluate(async e => { await Promise.all(e.getAnimations().map(a => a.finished)); });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width} ${tab} overflows`);
      await page.screenshot({ path: `.tmp/density/${tab.replace(' ', '-')}-${width}.png` });
    }
    console.log(width, heights);
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  for (const locale of ['th', 'zh', 'en']) {
    await page.evaluate(value => localStorage.setItem('smart-city-thailand-locale', value), locale);
    await page.goto(`${origin}/city/phuket`);
    // The quick-read block was consolidated into Nong Plub's infographic on
    // 28 Oct (13563ea), so the old selector never appears and this gate
    // had been failing on a removed component rather than on a defect.
    await page.locator('.nong-plub-card').first().waitFor();
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.locator('.depa-official-section').screenshot({ path: `.tmp/density/plan-${locale}.png` });
  }
  await page.pdf({ path: '.tmp/density/phuket.pdf', format: 'A4', tagged: true });
  console.log(`Compact reading verified: ${origin}`);
} finally { await browser.close(); if (previewServer) await previewServer.close(); }
