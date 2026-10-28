import {describe,it,expect} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import {allCities} from './cityData';
import {getNongPlubProfile} from './nongPlubProfile';
import {NongPlubCard} from './NongPlubCard';
import {PILLAR_WEIGHTS,type Locale} from './types';
import CityFingerprint from './CityFingerprint';

describe('Nong Plub city infographic',()=>{
  it('introduces all118 cities in three languages while preserving exact scores and registry gaps',()=>{
    expect(allCities).toHaveLength(118);
    for(const city of allCities){
      const profile=getNongPlubProfile(city);
      expect(profile.rows.map(r=>r.pillar)).toEqual(Object.keys(PILLAR_WEIGHTS));
      for(const row of profile.rows)expect(row.value).toBe(city.status==='registered'?null:city.scores[row.pillar]);
      for(const locale of ['en','th','zh'] as Locale[]){
        const html=renderToStaticMarkup(<NongPlubCard city={city} locale={locale}/>);
        expect((html.match(/data-pillar=/g)||[])).toHaveLength(7);
        expect(html).toContain('2026-04-04');
        expect(html).toContain('-crayon.webp');
        expect(html).not.toContain('Plub brought');
        if(city.status==='registered')expect((html.match(/data-score="unassessed"/g)||[])).toHaveLength(7);
      }
    }
  });
  it('shows all tied extrema rather than inventing a sole leader',()=>{
    const profile=getNongPlubProfile(allCities.find(c=>c.id==='samyan')!);
    expect(profile.highest.length).toBe(2);
    const values=profile.rows.map(r=>r.value!);
    expect(profile.highest).toEqual(profile.rows.filter(r=>r.value===Math.max(...values)).map(r=>r.pillar));
  });
  it('keeps real zero separate from invalid, missing, and placeholder values',()=>{
    const base=allCities.find(c=>c.status==='certified')!;
    const profile=getNongPlubProfile({...base,scores:{...base.scores,livability:0,economy:NaN,safety:101}});
    expect(profile.rows.find(r=>r.pillar==='livability')?.value).toBe(0);
    expect(profile.rows.find(r=>r.pillar==='economy')?.value).toBeNull();
    expect(profile.rows.find(r=>r.pillar==='safety')?.value).toBeNull();
    const equal=getNongPlubProfile({...base,scores:{livability:50,economy:50,safety:50,wellbeing:50,environment:50,hospitality:50,digital:50}});
    expect(equal.highest).toEqual([]);expect(equal.lowest).toEqual([]);expect(equal.assessed).toBe(7);
  });
  it('retains the chart widget and axes while distinguishing no assessment from a measured shape',()=>{
    const scores=allCities[0].scores;
    const measured=renderToStaticMarkup(<CityFingerprint scores={scores} showGrid size={120}/>);
    const pending=renderToStaticMarkup(<CityFingerprint scores={scores} showGrid size={120} assessmentLabel="Unassessed"/>);
    expect((measured.match(/<polygon/g)||[])).toHaveLength(3);
    expect((measured.match(/<circle/g)||[])).toHaveLength(7);
    expect((pending.match(/<polygon/g)||[])).toHaveLength(2);
    expect(pending).not.toContain('<circle');
    expect(pending).toContain('Unassessed');
  });
});
