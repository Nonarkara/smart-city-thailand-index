import { createServer } from 'vite';
import { mkdir, writeFile, access } from 'node:fs/promises';
import assert from 'node:assert/strict';

// Export the same resolver used by the gallery, never a separately maintained city map.
// This is an SSR-only export. Browser dependency discovery outlives this
// short server and otherwise reports a false shutdown error after export.
const server = await createServer({ server: { middlewareMode: true }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom', logLevel: 'error' });
try {
  const { allCities } = await server.ssrLoadModule('/src/cityData.ts');
  const { getCityHeritage } = await server.ssrLoadModule('/src/cityHeritage.ts');
  const byCity = Object.fromEntries(allCities.map(city => [city.id, getCityHeritage(city).map(record => record.id)]));
  const records = [...new Map(allCities.flatMap(city => getCityHeritage(city)).map(record => [record.id, record])).values()];
  assert.ok(allCities.every(city => getCityHeritage(city).some(record => record.verifiedAt && record.scope !== 'regional')), 'city has no verified provincial or local visual record');
  assert.ok(records.every(record => record.verifiedAt && record.author && record.sourceUrl && record.license && record.licenseUrl), 'visual record lacks provenance');
  const sourceCheckDates = [...new Set(records.map(record => record.verifiedAt))].sort();
  const register = {
    checkedAt: sourceCheckDates.at(-1), sourceCheckDates,
    scopeNote: 'Provincial context does not establish a project-boundary location. Regional museum comparisons retain the source culture and uncertain findspot. Source checks are dated per record; the latest date does not refresh every record.',
    cityCount: allCities.length,
    verifiedCityCount: allCities.filter(city => getCityHeritage(city).some(record => record.verifiedAt)).length,
    byCity, records,
  };
  const text = JSON.stringify(register, null, 2) + '\n';
  await mkdir('public/heritage', { recursive: true });
  await writeFile('public/heritage/source-register.json', text);
  try { await access('dist/index.html'); await mkdir('dist/heritage', { recursive: true }); await writeFile('dist/heritage/source-register.json', text); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  console.log(`Heritage register: ${register.verifiedCityCount}/${register.cityCount} dossiers; ${records.length} attributed visual records.`);
} finally { await server.close(); }
