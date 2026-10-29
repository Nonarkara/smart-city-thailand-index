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
   const asset=html.match(/src="([^"]+-crayon.webp)"/)?.[1];
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
 it('keeps a tool guide available without placing the expanded reading band above its controls',()=>{
  for(const kind of ['rankings','map','compare','invest','references','canvas'] as const){
   const html=renderToStaticMarkup(<PageMascot kind={kind} locale="en"/>);
   expect(html).toContain('<details class="page-mascot-toggle section">');
   expect(html).not.toContain('<details open');
  }
 });
});
