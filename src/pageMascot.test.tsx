import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import PageMascot from './PageMascot';
import {PAGE_MASCOT_BRIEFS} from './pageMascotBriefs';
import type {Locale} from './types';
import {existsSync,readFileSync} from 'node:fs';
import {allCities} from './cityData';
import {NongPlubCard} from './NongPlubCard';

describe('page reading companion',()=>{
 it('provides a localized reading task and working platform action for every registered page brief',()=>{
  for(const [kind,brief] of Object.entries(PAGE_MASCOT_BRIEFS))for(const locale of ['en','th','zh'] as Locale[]){
   const html=renderToStaticMarkup(<PageMascot kind={kind as keyof typeof PAGE_MASCOT_BRIEFS} locale={locale}/>);
   expect(brief.copy[locale].length).toBeGreaterThan(25);
   expect(html).toContain('mascot-hand');
   expect(html).toContain(brief.action.path);
   const asset=html.match(/src="([^"]+\.webp)"/)?.[1];
   expect(asset&&existsSync(`public${asset}`)).toBeTruthy();
  }
 });
 it('integrates the home heading and its three destinations without forced title breaks',()=>{
  for(const locale of ['en','th','zh'] as Locale[]){
   const html=renderToStaticMarkup(<PageMascot kind="home" locale={locale} embedded/>);
   expect(html).toContain('home-city-guide');
   expect((html.match(/<h1/g)||[])).toHaveLength(1);
   expect(html).not.toContain('<br');
   for(const path of ['/rankings','/references','/map'])expect(html).toContain(`href="${path}"`);
   expect(html).not.toContain('mascot-note-title');
  }
 });
 it('covers Chinese handwriting including labels derived from city data',()=>{
  const glyphs=JSON.parse(readFileSync('public/fonts/mascot/glyphs.json','utf8')).cjk as string;
  const html=[...allCities.map(city=>renderToStaticMarkup(<NongPlubCard city={city} locale="zh"/>)),...Object.keys(PAGE_MASCOT_BRIEFS).map(kind=>renderToStaticMarkup(<PageMascot kind={kind as keyof typeof PAGE_MASCOT_BRIEFS} locale="zh"/>))].join('');
  const text=[...html.matchAll(/<(?:p|h3)[^>]*class="[^"]*mascot-hand[^"]*"[^>]*>([\s\S]*?)<\/(?:p|h3)>/g)].map(m=>m[1]).join('');
  for(const char of new Set(text.match(/[\u4e00-\u9fff]/g)||[]))expect(glyphs,`missing handwritten glyph ${char}`).toContain(char);
 });
 it('is one presenter band on every page: the commissioned pose at reading size, one note, one next step',()=>{
  for(const kind of Object.keys(PAGE_MASCOT_BRIEFS).filter(k=>k!=='home') as (keyof typeof PAGE_MASCOT_BRIEFS)[])for(const locale of ['en','th','zh'] as Locale[]){
   const html=renderToStaticMarkup(<PageMascot kind={kind} locale={locale}/>);
   expect(html,kind).toContain('class="page-guide section"');
   expect(html,kind).not.toContain('<details');
   expect(html,kind).toContain('class="page-guide-figure"');
   expect(html,kind).not.toContain('page-mascot-art');
   expect(html,kind).not.toContain('page-guide-avatar');
   expect(html,kind).not.toContain('mascot-note-title');
   expect((html.match(/<img/g)||[]).length,`${kind}: exactly one image, the pose figure`).toBe(1);
   expect((html.match(/<a /g)||[]).length,`${kind}: exactly one next step`).toBe(1);
   expect((html.match(/mascot-hand/g)||[]).length,`${kind}: the note is stated once`).toBe(1);
  }
 });
 it('offers the route photo behind a symbol-only toggle instead of a text row',()=>{
  const html=renderToStaticMarkup(<PageMascot kind="rankings" locale="en" photo={<i/>}/>);
  expect(html).toContain('class="page-guide-photo"');
  expect(html).toContain('aria-expanded="false"');
  expect(html).toContain('aria-label="Photo context"');
  expect(html).not.toMatch(/>\s*Photo context\s*</);
  expect(html).not.toContain('<i/>');
 });
});
