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
    expect(new Set(heritageCollection.map(record=>record.id)).size).toBe(8);
    for (const record of heritageCollection) {
      expect(record.sourceUrl).toMatch(/^https:\/\//);
      expect(record.licenseUrl).toMatch(/^https:\/\/creativecommons.org\//);
      expect(record.author.length).toBeGreaterThan(3);
      for (const locale of ['en','th','zh'] as const) expect(record.caption[locale].trim().length).toBeGreaterThan(0);
    }
  });
  it('changes image, source and contextual caption together', () => {
    const city=allCities.find(city=>city.province==='Nakhon Si Thammarat')!;
    render(<CityHeritageGallery city={city} locale="en" />);
    fireEvent.change(screen.getByRole('combobox'),{target:{value:'vishnu'}});
    expect(screen.getByRole('img').getAttribute('src')).toBe('/heritage/vishnu.webp');
    expect(screen.getByText(/Regional comparison/)).toBeTruthy();
    expect(screen.getByRole('link',{name:/Collection \/ source record/}).getAttribute('href')).toContain('/37608');
  });
  it('exposes missing coverage without borrowing another city image', () => {
    const city=allCities.find(city=>getCityHeritage(city).length===0)!;
    render(<CityHeritageGallery city={city} locale="en" />);
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.getByText(/has not yet been curated/)).toBeTruthy();
  });
});
