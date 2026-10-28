import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import PageMascot from './PageMascot';
import {PAGE_MASCOT_BRIEFS} from './pageMascotBriefs';
import type {Locale} from './types';
import {existsSync} from 'node:fs';

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
 it('keeps a tool guide available without placing the expanded reading band above its controls',()=>{
  for(const kind of ['rankings','map','compare','invest','references','canvas'] as const){
   const html=renderToStaticMarkup(<PageMascot kind={kind} locale="en"/>);
   expect(html).toContain('<details class="page-mascot-toggle section">');
   expect(html).not.toContain('<details open');
  }
 });
});
