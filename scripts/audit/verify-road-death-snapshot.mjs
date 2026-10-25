/** Reproduce the committed province totals; never persist or print person rows. */
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { parse } from 'csv-parse/sync';
import { build } from 'esbuild';
import { PROVINCE_TH } from '../lib/province-th.mjs';

const compiled = await build({ entryPoints: ['src/provinceBaselineData.ts'], bundle: true, write: false, platform: 'node', format: 'esm' });
const { PROVINCE_BASELINE } = await import(`data:text/javascript;base64,${Buffer.from(compiled.outputFiles[0].text).toString('base64')}`);
const expected = PROVINCE_BASELINE.find(item => item.id === 'rtddi-road-deaths');
assert.ok(expected, 'dated road registry baseline is missing');
const get = url => execFileSync('curl', ['--fail', '--silent', '--show-error', '--max-time', '45', url], { maxBuffer: 32 * 1024 * 1024, encoding: 'utf8' });
const catalog = JSON.parse(get('https://data.go.th/api/3/action/package_show?id=rtddi'));
assert.equal(catalog.success, true, 'registry catalogue unavailable');
const resource = catalog.result.resources.find(item => item.url.endsWith(`/${expected.table}`));
assert.ok(resource, 'the source file named by the baseline is missing');
assert.equal(new URL(resource.url).hostname, 'data.go.th', 'unexpected raw-data host');
const rows = parse(get(resource.url), { columns: true, bom: true, skip_empty_lines: true });
const yearField = Object.keys(rows[0]).find(key => /Dead Year|ปีที่เสียชีวิต/i.test(key));
assert.ok(yearField, 'source year column missing');
const totals = {};
const months = new Set();
for (const row of rows) {
  if (String(row[yearField]).trim() !== String(expected.year + 543)) continue;
  const province = PROVINCE_TH[String(row['จ.ที่เสียชีวิต'] ?? '').trim()];
  assert.ok(province, 'an unrecognized recorded province must not be silently dropped');
  totals[province] = (totals[province] ?? 0) + 1;
  const date = String(row['Dead Date'] ?? '').trim();
  assert.ok(date.length >= 7, 'record date missing');
  months.add(date.slice(0, 7));
}
assert.equal(months.size, 12, 'partial year must not be presented as annual data');
assert.deepEqual(totals, expected.provinces, 'published snapshot differs from the current official source');
console.log(JSON.stringify({ source: expected.catalogUrl, resource: resource.url, year: expected.year, provinceField: 'จ.ที่เสียชีวิต', months: months.size, provinces: Object.keys(totals).length, deaths: Object.values(totals).reduce((sum, value) => sum + value, 0), checkedAt: new Date().toISOString(), matchesCommittedSnapshot: true }, null, 2));
