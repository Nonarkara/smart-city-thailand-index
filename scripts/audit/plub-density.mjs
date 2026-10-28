import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
let origin=process.env.AUDIT_ORIGIN||'http://127.0.0.1:5191',server,browser;
const output='.tmp/plub-intro';await mkdir(output,{recursive:true});
const {data:cities}=JSON.parse(await readFile('dist/api-static/cities.json','utf8'));
const byId=new Map(cities.map(c=>[c.id,c]));const results=[];
function check(g,width){
 assert.ok(g.height<=(width<760?500:440),`inflated infographic: ${g.height}px at ${width}`);
 assert.equal(g.overflow,0,'page overflow');assert.equal(g.rows.length,7,'pillar lost');
 assert.ok(g.imageLoaded&&g.src.endsWith('-crayon.webp'),'approved crayon art missing');
 assert.ok(g.labelFonts.every(f=>f>=14)&&g.bodyFont>=14,'reading shrunk');
 assert.ok(g.summaryHeight>=32&&g.summaryWidth<=g.summaryTextWidth+44,'disclosure target geometry');
 assert.ok(g.portraitHeight<=200,'portrait invents a tall panel');
}
try{
 if(process.argv.includes('--serve')){const {preview}=await import('vite');server=await preview({preview:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});origin=`http://127.0.0.1:${server.httpServer.address().port}`;}
 for(const id of ['cmu-smart-city','reg-phrae','korat'])for(const locale of ['en','th','zh'])for(const width of [390,1024,1440]){
  browser=await chromium.launch();const p=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await p.goto(`${origin}/city/${id}/`);await p.evaluate(l=>localStorage.setItem('smart-city-thailand-locale',l),locale);await p.reload();
  const card=p.locator('.nong-plub-infographic');await card.waitFor();await card.scrollIntoViewIfNeeded();await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>{const i=document.querySelector('.nong-plub-illustration');return i?.complete&&i.naturalWidth>0});
  const g=await card.evaluate(el=>{const i=el.querySelector('img'),s=el.querySelector('summary'),range=document.createRange();range.selectNodeContents(s);return{height:el.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-innerWidth,src:i.getAttribute('src'),imageLoaded:i.complete&&i.naturalWidth>0,portraitHeight:i.getBoundingClientRect().height,labelFonts:[...el.querySelectorAll('.nong-plub-pillar')].map(n=>parseFloat(getComputedStyle(n).fontSize)),bodyFont:parseFloat(getComputedStyle(s).fontSize),summaryHeight:s.getBoundingClientRect().height,summaryWidth:s.getBoundingClientRect().width,summaryTextWidth:range.getBoundingClientRect().width,rows:[...el.querySelectorAll('[data-pillar]')].map(n=>({pillar:n.dataset.pillar,value:n.dataset.score,extreme:n.dataset.extreme??null,plotted:!!n.querySelector('svg')}))};});check(g,width);
  const city=byId.get(id);for(const row of g.rows){assert.equal(row.value,city.status==='registered'?'unassessed':String(city.scores[row.pillar]));assert.equal(row.plotted,city.status!=='registered');}
  assert.equal(await p.locator('.city-profile-read').count(),0,'old quick-read repeated');
  assert.ok(await card.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.city-heritage'))&Node.DOCUMENT_POSITION_FOLLOWING)),'introduction buried after gallery');
  if(city.status==='registered'){assert.equal((await p.locator('.city-hero-photo-score').innerText()).trim(),'—');assert.ok(!/RANK|อันดับ|排名/.test(await p.locator('.city-hero-photo-score-note').innerText()));assert.equal(await p.locator('.city-hero-fingerprint circle').count(),0);}
  const summary=card.locator('summary');await summary.focus();await p.keyboard.press('Enter');assert.equal(await card.locator('details[open]').count(),1);assert.ok(await card.locator('.nong-plub-reading a[href^="https://"]').isVisible());await p.keyboard.press('Enter');
  assert.equal(await card.locator('.nong-plub-print-source').isVisible(),false,'paper source leaked into screen reading');
  if(id==='cmu-smart-city'&&locale==='en'&&width===390){await p.emulateMedia({media:'print'});assert.ok(await card.locator('.nong-plub-print-source').isVisible(),'paper source missing');assert.equal(await summary.isVisible(),false,'interactive summary printed');await p.emulateMedia({media:'screen'});}
  await p.screenshot({path:`${output}/${id}-${locale}-${width}.png`});results.push({id,locale,width,...g});console.log(`Introduction ${id}/${locale}/${width}: ${g.height}px`);
  if(id==='cmu-smart-city'&&locale==='en'&&width===390){const style=await p.addStyleTag({content:'.nong-plub-infographic{display:block!important}.nong-plub-infographic .nong-plub-illustration{width:180px!important;height:220px!important;margin-bottom:16px!important}'});await p.waitForFunction(()=>getComputedStyle(document.querySelector('.nong-plub-infographic')).display==='block');const height=await card.evaluate(el=>el.getBoundingClientRect().height);assert.throws(()=>check({...g,height},width),/inflated infographic/,'stacked portrait panel escaped');await style.evaluate(el=>el.remove());}
  await browser.close();browser=null;
 }
 await writeFile(`${output}/geometry.json`,JSON.stringify(results,null,2));console.log(`City introductions verified: ${results.length} language/viewport states, seven exact signals or explicit registry gaps, source keyboard access and stacked-panel rejection.`);
}finally{await browser?.close();await server?.close()}
