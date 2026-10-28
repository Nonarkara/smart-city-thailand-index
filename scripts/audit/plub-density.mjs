import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
let origin=process.env.AUDIT_ORIGIN||'http://127.0.0.1:5191',server,browser;
const results=[];
const output='.tmp/plub-oct28';await mkdir(output,{recursive:true});
const check=(g,width)=>{
  assert.ok(g.height<=(width<760?250:210),`inflated companion: ${g.height}px at ${width}`);
  assert.ok(g.gap<=20,'art and note separated');
  assert.equal(g.overflow,0,'page overflow');
  assert.ok(g.imageLoaded && g.src.endsWith('-crayon.webp'),'replacement art missing');
  assert.ok(g.titleFont>=14 && g.bodyFont>=14,'reading shrunk');
  assert.ok(g.summaryHeight>=32,'disclosure target too small');
  assert.ok(g.summaryWidth<=g.summaryTextWidth+44,'stretched disclosure target');
};
try{
  if(process.argv.includes('--serve')){const {preview}=await import('vite');server=await preview({preview:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});origin=`http://127.0.0.1:${server.httpServer.address().port}`;}
  for(const locale of ['en','th','zh'])for(const width of [390,759,760,1024,1280,1440]){
    browser=await chromium.launch();const page=await browser.newPage({viewport:{width,height:width===1280?720:900},reducedMotion:'reduce'});
    await page.goto(`${origin}/city/cmu-smart-city/`);await page.evaluate(l=>localStorage.setItem('smart-city-thailand-locale',l),locale);await page.reload();
    const card=page.locator('.nong-plub-card');await card.waitFor();await card.scrollIntoViewIfNeeded();await page.evaluate(()=>document.fonts.ready);
    await page.waitForFunction(()=>{const i=document.querySelector('.nong-plub-illustration');return i?.complete&&i.naturalWidth>0});
    const g=await card.evaluate(el=>{const i=el.querySelector('img'),s=el.querySelector('summary'),n=el.querySelector('.nong-plub-story-col');return{height:el.getBoundingClientRect().height,gap:n.getBoundingClientRect().left-i.getBoundingClientRect().right,overflow:document.documentElement.scrollWidth-innerWidth,src:i.getAttribute('src'),imageLoaded:i.complete&&i.naturalWidth>0,titleFont:parseFloat(getComputedStyle(el.querySelector('h3')).fontSize),bodyFont:parseFloat(getComputedStyle(s).fontSize),summaryHeight:s.getBoundingClientRect().height,summaryWidth:s.getBoundingClientRect().width,summaryTextWidth:(()=>{const r=document.createRange();r.selectNodeContents(s);return r.getBoundingClientRect().width})(),pageHeight:document.documentElement.scrollHeight};});check(g,width); console.log(`Companion ${locale}/${width}: ${g.height}px`);
    assert.equal(await card.locator('details[open]').count(),0);const summary=card.locator('summary');await summary.focus();await page.keyboard.press('Enter');assert.equal(await card.locator('details[open]').count(),1);assert.ok(await card.locator('a[href^="https://"]').isVisible());assert.ok((await card.innerText()).includes(locale==='en'?'not verified':locale==='th'?'ยังไม่ได้ยืนยัน':'尚未核实'));
    await page.keyboard.press('Enter');assert.equal(await card.locator('details[open]').count(),0);
    await page.screenshot({path:`${output}/cmu-${locale}-${width}.png`});results.push({locale,width,...g});
    if(locale==='en'&&width===390){const fault=await page.addStyleTag({content:'.nong-plub-card{display:flex!important;flex-direction:column!important;padding:16px!important}.nong-plub-illustration{width:180px!important;height:220px!important}.nong-plub-story-col{padding:16px!important}'});await page.waitForFunction(()=>getComputedStyle(document.querySelector('.nong-plub-card')).display==='flex');const h=await card.evaluate(el=>el.getBoundingClientRect().height);assert.throws(()=>check({...g,height:h},width),/inflated companion/,'old stacked panel escaped');await fault.evaluate(el=>el.remove());}
    await browser.close();browser=null;
  }
  await writeFile(`${output}/geometry.json`,JSON.stringify(results,null,2));console.log(`Companion verified: ${results.length} locale/viewport states, raster art, complete source note and keyboard disclosure; old stacked panel rejected.`);
}finally{await browser?.close();await server?.close();}
