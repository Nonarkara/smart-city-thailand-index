import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { parse } from 'csv-parse/sync';

export function checkCityIndex(payload, expected) {
  assert.equal(payload.success, true, 'city index must be a success envelope');
  assert.ok(Array.isArray(payload.data), 'city index must contain an array');
  const ids = payload.data.map(city => city.id);
  assert.equal(new Set(ids).size, ids.length, 'duplicate city identity');
  assert.deepEqual([...ids].sort(), expected.map(city => city.id).sort(), 'published city coverage differs from the build');
  const byId = new Map(expected.map(city => [city.id, city]));
  for (const city of payload.data) assert.deepEqual(city, byId.get(city.id), `published summary differs: ${city.id}`);
}
export function checkCityDetail(payload, expected) {
  assert.equal(payload.success, true, 'city dossier must be a success envelope');
  assert.deepEqual(payload.data, expected, `published dossier differs: ${expected.id}`);
}
export function checkCityCsv(text, expectedText, cityId) {
  const rows = parse(text, { columns: true, skip_empty_lines: true, bom: true });
  assert.ok(rows.length > 0, 'city CSV cannot be empty');
  assert.ok(rows.every(row => row.city_id === cityId), 'CSV includes another city');
  assert.deepEqual(rows, parse(expectedText, { columns: true, skip_empty_lines: true, bom: true }), `published CSV differs: ${cityId}`);
}
export function checkSnapshot(bytes, manifest) {
  assert.equal(bytes.length, manifest.bytes, 'research snapshot size differs');
  assert.equal(createHash('sha256').update(bytes).digest('hex'), manifest.sha256, 'research snapshot hash differs');
  JSON.parse(bytes.toString());
}
