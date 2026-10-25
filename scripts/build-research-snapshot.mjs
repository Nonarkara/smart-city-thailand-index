// Explicit release operation: retain this content-addressed snapshot in public/.
import esbuild from 'esbuild';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const bundle = await esbuild.build({stdin:{contents:`export {ABSORPTION_PROVINCES, ABSORPTION_YEARS} from './src/absorptionData'; export {allCities} from './src/cityData'; export {PROVINCE_BASELINE} from './src/provinceBaselineData'; export {deriveAll, INDICATORS, DIMENSION_WEIGHTS} from './src/dimensionScores';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,platform:'node',format:'esm',write:false,logLevel:'error'});
const temporary = join(tmpdir(), `sciti-research-${process.pid}.mjs`);
writeFileSync(temporary,bundle.outputFiles[0].text);
const data = await import(pathToFileURL(temporary).href); unlinkSync(temporary);
const snapshot = {schemaVersion:1, releaseDate:'2026-10-25', title:'SCITI seven-domain baseline research snapshot', limitations:['Province observations are context, not proof of city infrastructure adequacy.','Editorial weights are not depa weights.','Observation periods vary; this is not real-time monitoring.','Source publication and checking dates are not inferred from observation years.'], populationContext:{years:data.ABSORPTION_YEARS,provinces:data.ABSORPTION_PROVINCES,limitation:"Separate provincial observations; not simultaneous population or infrastructure capacity."}, weights:data.DIMENSION_WEIGHTS, indicators:data.INDICATORS.map(({derive,...indicator})=>({...indicator, formula:derive?.toString()??null})), provinceSeries:data.PROVINCE_BASELINE, cities:data.allCities, results:Object.fromEntries(data.deriveAll(data.allCities)), methodSource:readFileSync('src/dimensionScores.ts','utf8')};
const serialized=JSON.stringify(snapshot,null,2)+'\n';
const sha256=createHash('sha256').update(serialized).digest('hex');
const path=`/research/sciti-baseline-${sha256.slice(0,16)}.json`;
mkdirSync('public/research',{recursive:true});writeFileSync(`public${path}`,serialized);
writeFileSync('src/researchSnapshot.json',JSON.stringify({releaseDate:snapshot.releaseDate,sha256,path,bytes:Buffer.byteLength(serialized,'utf8')},null,2)+'\n');
console.log(`Research snapshot ${sha256.slice(0,16)} (${Buffer.byteLength(serialized,'utf8')} bytes)`);
