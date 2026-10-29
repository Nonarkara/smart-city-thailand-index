import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {mkdir,writeFile,readFile} from 'node:fs/promises';
let origin=process.env.AUDIT_ORIGIN||'http://127.0.0.1:5191',server,browser;
const output='.tmp/plub-intro';await mkdir(output,{recursive:true});
const {data:cities}=JSON.parse(await readFile('dist/api-static/cities.json','utf8'));
const byId=new Map(cities.map(c=>[c.id,c]));const results=[];
function check(g,width){
 if(width>=1024){assert.ok(g.cardWidth/g.parentWidth>=.94,'unused parent reading region');assert.ok(g.portraitWidth/g.cardWidth>=.20,'mascot reduced to a thumbnail');}
 assert.ok(g.height<=(width<760?500:440),`inflated infographic: ${g.height}px at ${width}`);
 assert.equal(g.overflow,0,'page overflow');assert.equal(g.rows.length,7,'pillar lost');
 assert.ok(g.imageLoaded&&g.src.endsWith('-crayon.webp'),'approved crayon art missing');
 assert.ok(g.labelFonts.every(f=>f>=14)&&g.bodyFont>=14,'reading shrunk');
 assert.ok(g.summaryHeight>=32&&g.summaryWidth<=g.summaryTextWidth+44,'disclosure target geometry');
 assert.ok(g.portraitHeight<=(width<760?240:360),'portrait exceeds its parallel reading band');
}
try{
 if(process.argv.includes('--serve')){const {preview}=await import('vite');server=await preview({preview:{host:'127.0.0.1',port:0,strictPort:true},logLevel:'error'});origin=`http://127.0.0.1:${server.httpServer.address().port}`;}
 for(const id of ['cmu-smart-city','reg-phrae','korat','phra-ram-4'])for(const locale of ['en','th','zh'])for(const width of [390,1024,1440,1980]){
  browser=await chromium.launch();const p=await browser.newPage({viewport:{width,height:width===390?844:900},reducedMotion:'reduce'});
  await p.goto(`${origin}/city/${id}/`);await p.evaluate(l=>localStorage.setItem('smart-city-thailand-locale',l),locale);await p.reload();
  const card=p.locator('.nong-plub-infographic');await card.waitFor();await card.scrollIntoViewIfNeeded();await p.evaluate(()=>document.fonts.ready);await p.waitForFunction(()=>{const i=document.querySelector('.nong-plub-illustration');return i?.complete&&i.naturalWidth>0});
  const g=await card.evaluate(el=>{const i=el.querySelector('img'),s=el.querySelector('summary'),range=document.createRange();range.selectNodeContents(s);return{height:el.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-innerWidth,src:i.getAttribute('src'),imageLoaded:i.complete&&i.naturalWidth>0,portraitHeight:i.getBoundingClientRect().height,portraitWidth:i.getBoundingClientRect().width,cardWidth:el.getBoundingClientRect().width,parentWidth:el.parentElement.getBoundingClientRect().width-parseFloat(getComputedStyle(el.parentElement).paddingLeft)-parseFloat(getComputedStyle(el.parentElement).paddingRight),labelFonts:[...el.querySelectorAll('.nong-plub-pillar')].map(n=>parseFloat(getComputedStyle(n).fontSize)),bodyFont:parseFloat(getComputedStyle(s).fontSize),summaryHeight:s.getBoundingClientRect().height,summaryWidth:s.getBoundingClientRect().width,summaryTextWidth:range.getBoundingClientRect().width,rows:[...el.querySelectorAll('[data-pillar]')].map(n=>({pillar:n.dataset.pillar,value:n.dataset.score,extreme:n.dataset.extreme??null,plotted:!!n.querySelector('svg')}))};});check(g,width);
  const city=byId.get(id);for(const row of g.rows){assert.equal(row.value,city.status==='registered'?'unassessed':String(city.scores[row.pillar]));assert.equal(row.plotted,city.status!=='registered');}
  assert.equal(await p.locator('.city-profile-read').count(),0,'old quick-read repeated');
  assert.ok(await card.evaluate(el=>Boolean(el.compareDocumentPosition(document.querySelector('.city-heritage'))&Node.DOCUMENT_POSITION_FOLLOWING)),'introduction buried after gallery');
  if(city.status==='registered'){assert.equal((await p.locator('.city-hero-photo-score').innerText()).trim(),'—');assert.ok(!/RANK|อันดับ|排名/.test(await p.locator('.city-hero-photo-score-note').innerText()));assert.equal(await p.locator('.city-hero-fingerprint circle').count(),0);}
  const summary=card.locator('summary');await summary.focus();await p.keyboard.press('Enter');assert.equal(await card.locator('details[open]').count(),1);assert.ok(await card.locator('.nong-plub-reading a[href^="https://"]').isVisible());await p.keyboard.press('Enter');
  assert.equal(await card.locator('.nong-plub-print-source').isVisible(),false,'paper source leaked into screen reading');
  if(id==='cmu-smart-city'&&locale==='en'&&width===390){await p.emulateMedia({media:'print'});assert.ok(await card.locator('.nong-plub-print-source').isVisible(),'paper source missing');assert.equal(await summary.isVisible(),false,'interactive summary printed');await p.emulateMedia({media:'screen'});}
  await p.screenshot({path:`${output}/${id}-${locale}-${width}.png`});results.push({id,locale,width,...g});console.log(`Introduction ${id}/${locale}/${width}: ${g.height}px`);
  if(id==='cmu-smart-city'&&locale==='en'&&width===390){const style=await p.addStyleTag({content:'.nong-plub-infographic{display:block!important}.nong-plub-infographic .nong-plub-illustration{width:180px!important;height:220px!important;margin-bottom:16px!important}'});await p.waitForFunction(()=>getComputedStyle(document.querySelector('.nong-plub-infographic')).display==='block');const height=await card.evaluate(el=>el.getBoundingClientRect().height);assert.throws(()=>check({...g,height},width),/inflated infographic/,'stacked portrait panel escaped');await style.evaluate(el=>el.remove());}
  if(width===1980){
   const old=await p.addStyleTag({content:'.nong-plub-infographic{max-width:780px!important;grid-template-columns:144px minmax(0,1fr)!important}.nong-plub-infographic .nong-plub-illustration{width:144px!important;height:190px!important}.nong-plub-infographic .nong-plub-intro-notes{grid-column:1 / -1!important}'});
   const regression=await card.evaluate(el=>({height:el.getBoundingClientRect().height,cardWidth:el.getBoundingClientRect().width,portraitWidth:el.querySelector('img').getBoundingClientRect().width}));
   assert.throws(()=>check({...g,...regression},width),/unused parent|thumbnail/,'old narrow composition escaped');await old.evaluate(el=>el.remove());
  }
  await browser.close();browser=null;
 }
 // The homepage invitation keeps the guide, title and compact actions together.
 browser=await chromium.launch();const home=await browser.newPage({reducedMotion:'reduce'});
 const measureHome=()=>home.evaluate(()=>{const r=s=>document.querySelector(s).getBoundingClientRect(),title=document.querySelector('h1');return{height:r('.cinematic-hero').height,titleLines:r('h1').height/parseFloat(getComputedStyle(title).lineHeight),titleGap:r('h1').top-r('.home-city-guide').top,actionBottom:r('.home-city-guide-actions').bottom,readingGap:r('.home-city-guide-actions').top-r('.home-city-guide-reading').bottom,actions:[...document.querySelectorAll('.home-city-guide-actions a')].map(n=>({top:n.getBoundingClientRect().top,width:n.getBoundingClientRect().width,height:n.getBoundingClientRect().height})),overflow:document.documentElement.scrollWidth-innerWidth};});
 const checkHome=(g,width)=>{assert.ok(g.titleLines<=2.05,'forced title reading bands');assert.ok(g.titleGap<=1,'portrait pushes title down');assert.ok(g.readingGap<=32,'portrait separates reading from action');assert.equal(g.overflow,0,'home overflow');assert.equal(g.actions.length,3);assert.ok(g.actions.every(a=>Math.abs(a.top-g.actions[0].top)<=1&&a.height>=44&&a.width>=44),'oversized or stacked home actions');assert.ok(g.actionBottom<600,'city action separated from introduction');assert.ok(g.height<=(width<360?720:width<720?645:560),'inflated home opening');};
 for(const locale of ['en','th','zh'])for(const width of [320,390,399,400,479,480,559,560,719,720,768,959,960,1024,1440,1980]){
  await home.setViewportSize({width,height:width<720?844:900});await home.goto(origin);await home.locator('.home-city-guide').waitFor();await home.evaluate(l=>localStorage.setItem('smart-city-thailand-locale',l),locale);await home.reload();await home.locator(`.home-city-guide[lang="${locale==='zh'?'zh-Hans':locale}"]`).waitFor();await home.evaluate(()=>document.fonts.ready);const g=await measureHome();console.log('Home',locale,width,JSON.stringify(g));await home.screenshot({path:`${output}/home-${locale}-${width}.png`});checkHome(g,width);
  if(locale==='en'&&width===719){const old=await home.addStyleTag({content:'.home-city-guide-message{display:contents!important}.home-city-guide-visual{grid-row:2!important;contain:none!important}.home-city-guide-art{position:static!important;width:144px!important;height:160px!important}.home-city-guide-actions{grid-column:1 / -1!important;grid-row:3!important}'});const separated=await measureHome();assert.throws(()=>checkHome(separated,width),/separates reading/);await old.evaluate(n=>n.remove());}
  if(locale==='en'&&width===390){const title=home.locator('h1');const original=await title.innerHTML();await title.evaluate(n=>n.innerHTML='Thailand’s Smart<br>City<br>Data Platform');const mutated=await measureHome();assert.throws(()=>checkHome(mutated,width),/forced title/);await title.evaluate((n,html)=>n.innerHTML=html,original);const old=await home.addStyleTag({content:'.home-city-guide-actions{display:block!important}.home-city-guide-actions a{display:flex!important;width:100%!important;padding:24px!important;margin-bottom:12px!important}'});const inflated=await measureHome();assert.throws(()=>checkHome(inflated,width),/stacked home actions/);await old.evaluate(n=>n.remove());}
 }
 await browser.close();browser=null;console.log('Home guide verified:48 language/viewport states; natural title, one-row44px actions and original layout mutations rejected.');
 await writeFile(`${output}/geometry.json`,JSON.stringify(results,null,2));console.log(`City introductions verified: ${results.length} language/viewport states, seven exact signals or explicit registry gaps, source keyboard access and stacked-panel rejection.`);
}finally{await browser?.close();await server?.close()}
