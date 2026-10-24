// Read-only production contract audit. Run after build/deploy; never cache-bust URLs.
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { checkCityIndex, checkCityDetail, checkCityCsv, checkSnapshot } from './lib/release-contract.mjs';
const origin = new URL(process.env.AUDIT_ORIGIN || 'https://sciti.nonarkara.org').origin;
const read = path => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const expected = JSON.parse(await read('dist/api-static/cities.json')).data;
const manifest = JSON.parse(await read('src/researchSnapshot.json'));
async function request(path, status = 200, type = 'application/json', method = 'GET') {
  const response = await fetch(`${origin}${path}`, { method, signal: AbortSignal.timeout(30000) });
  assert.equal(response.status, status, `${method} ${path}: unexpected status`);
  assert.ok(response.headers.get('content-type')?.includes(type), `${path}: unexpected content type`);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${path}: missing nosniff`);
  return response;
}
checkCityIndex(await (await request('/api/cities')).json(), expected);
const queue = [...expected];
let checked = 0;
await Promise.all(Array.from({ length: 4 }, async () => {
  while (queue.length) {
    const city = queue.shift();
    const detail = JSON.parse(await read(`dist/api-static/cities/${city.id}.json`)).data;
    checkCityDetail(await (await request(`/api/cities/${city.id}`)).json(), detail);
    checkCityCsv(await (await request(`/api/cities/${city.id}/export.csv`, 200, 'text/csv')).text(), await read(`dist/api-static/exports/cities/${city.id}.csv`), city.id);
    checked++;
  }
}));
for (const status of ['certified', 'promotion', 'registered']) {
  const payload = await (await request(`/api/cities?status=${status}&sort=economy`)).json();
  checkCityIndex(payload, expected.filter(city => city.status === status));
  assert.ok(payload.data.every((city, i, list) => i === 0 || list[i - 1].scores.economy >= city.scores.economy), 'economy sort direction differs');
}
const bytes = Buffer.from(await (await request(manifest.path)).arrayBuffer());
checkSnapshot(bytes, manifest);
for (const path of ['/api/not-a-real-route', '/api/cities/not-a-real-city', '/api/cities/not-a-real-city/export.csv', '/research/sciti-baseline-0000000000000000.json']) {
  const response = await request(path, 404);
  assert.equal((await response.json()).success, false, `${path}: error envelope missing`);
  assert.ok(response.headers.get('cache-control')?.includes('no-store'), `${path}: missing error cache policy`);
}
for (const path of ['/api/cities', '/api/cities/phuket', '/api/cities/phuket/export.csv', manifest.path]) {
  const response = await request(path, 200, path.endsWith('.csv') ? 'text/csv' : 'application/json', 'HEAD');
  assert.equal((await response.arrayBuffer()).byteLength, 0, `${path}: HEAD has a body`);
}
const report = { origin, checkedAt: new Date().toISOString(), cities: checked, dossiers: checked, cityCsvs: checked, snapshot: manifest.sha256, checks: ['identity and full payload equality with build', 'CSV quoting/identity/full rows', 'status filters and descending economy order', 'snapshot full SHA-256 and bytes', 'missing routes JSON404/no-store', 'HEAD bodies and MIME/nosniff'] };
await mkdir('.tmp', { recursive: true });
await writeFile('.tmp/release-contract.json', JSON.stringify(report, null, 2));
console.log(`Release verified: ${checked} dossiers + ${checked} city CSVs, filters, snapshot checksum, missing routes and HEAD on ${origin}`);
