import { readFileSync } from "node:fs";
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { allCities } from './cityData';
import { getCityHeritage } from './cityHeritage';
import { heritageCollection } from './heritageCollection';
import CityHeritageGallery from './CityHeritageGallery';
afterEach(cleanup);
describe('visual heritage provenance', () => {
  it('keeps museum comparisons regional and preserves uncertain attribution', () => {
    const records = getCityHeritage({province:'Nakhon Si Thammarat'});
    expect(records.find(record=>record.id==='avalokiteshvara')?.scope).toBe('regional');
    expect(records.find(record=>record.id==='vishnu')?.caption.en).toContain('Indonesia or Southern Thailand');
    expect(getCityHeritage({province:'Phuket'}).some(record=>record.id==='vishnu')).toBe(false);
    expect(getCityHeritage({province:'Lamphun'}).some(record=>record.id==='archive-umong')).toBe(false);
  });
  it('requires attribution, explicit reuse terms and three language captions', () => {
    expect(new Set(heritageCollection.map(record=>record.id)).size).toBe(heritageCollection.length);
    expect(heritageCollection.length).toBeGreaterThanOrEqual(34);
    for (const record of heritageCollection) {
      expect(record.sourceUrl).toMatch(/^https:\/\//);
      if (record.license==='Public domain') expect(record.licenseUrl).toBe(record.sourceUrl);
      else expect(record.licenseUrl).toMatch(/^https:\/\/creativecommons.org\//);
      expect(record.author.length).toBeGreaterThan(3);
      for (const locale of ['en','th','zh'] as const) expect(record.caption[locale].trim().length).toBeGreaterThan(0);
    }
  });
  it('provides a verified visual record for every indexed dossier without inventing local scope', () => {
    const curated = allCities;
    expect(curated.length).toBeGreaterThan(0);
    for (const city of curated) {
      const records = getCityHeritage(city);
      expect(records.some(record => record.verifiedAt && record.sourceUrl && record.author && record.licenseUrl), city.id).toBe(true);
    }
    expect(getCityHeritage({province:'Lamphun'}).some(record=>record.id==='province-lamphun' && record.scope==='province')).toBe(true);
    expect(getCityHeritage({province:'Songkhla'}).some(record=>record.id==='province-songkhla' && record.title.en.includes('Mermaid'))).toBe(true);
  });
  it('does not repeat a selected title as a second visible heading', () => {
    const city = allCities.find(city=>city.id==='nakhon-si-thammarat')!;
    render(<CityHeritageGallery city={city} locale="en" />);
    expect(screen.getByRole('combobox').textContent).toContain('Cloth procession');
    expect(screen.queryByRole('heading', { name:'Cloth procession at Wat Phra Mahathat' })).toBeNull();
  });
  it('prints a simple photographer attribution once and does not assert unverified crop history', () => {
    const city = allCities.find(city => city.id === 'phuket')!;
    render(<CityHeritageGallery city={city} locale="en" />);
    expect(screen.getAllByText(/CEphoto, Uwe Aranas/)).toHaveLength(1);
    expect(screen.getByText(/Display copy; consult the source/)).toBeTruthy();
    expect(screen.queryByText(/no crop/)).toBeNull();
  });
  it('publishes the same city mapping and source records, with real local image formats', () => {
    const register = JSON.parse(readFileSync('public/heritage/source-register.json','utf8'));
    expect(register.cityCount).toBe(allCities.length);
    expect(register.byCity).toEqual(Object.fromEntries(allCities.map(city=>[city.id,getCityHeritage(city).map(record=>record.id)])));
    const actual = new Map(allCities.flatMap(city=>getCityHeritage(city)).map(record=>[record.id,record]));
    expect(register.records.length).toBe(actual.size);
    for (const record of register.records) {
      expect(record).toEqual(actual.get(record.id));
      for (const image of [record.image,record.jpegImage].filter(Boolean)) {
        const bytes=readFileSync(`public${image}`);
        expect(bytes.length).toBeGreaterThan(1000);
        if (image.endsWith('.webp')) {
          expect(bytes.subarray(0,4).toString()).toBe('RIFF');
          expect(bytes.subarray(8,12).toString()).toBe('WEBP');
        } else expect([...bytes.subarray(0,3)]).toEqual([255,216,255]);
      }
    }
  });
  it('changes image, source and contextual caption together', () => {
    const city=allCities.find(city=>city.province==='Nakhon Si Thammarat')!;
    render(<CityHeritageGallery city={city} locale="en" />);
    fireEvent.change(screen.getByRole('combobox'),{target:{value:'vishnu'}});
    expect(screen.getByRole('img').getAttribute('src')).toBe('/heritage/vishnu.webp');
    expect(screen.getByText(/Regional comparison/)).toBeTruthy();
    expect(screen.getByRole('link',{name:/Source record/}).getAttribute('href')).toContain('/37608');
  });
  it('exposes missing coverage without borrowing another city image', () => {
    const city={...allCities[0],province:'Unknown province fixture'};
    render(<CityHeritageGallery city={city} locale="en" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText(/has not yet been curated/)).toBeTruthy();
  });
});
