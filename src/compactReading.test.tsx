import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DossierReadingNotes from './DossierReadingNotes';
import CityQuickRead from './CityQuickRead';
import { allCities } from './cityData';
afterEach(cleanup);
describe('compact reading without losing qualifications', () => {
  it('prints repeated prose once and retains both editorial roles and notes', () => {
    render(<DossierReadingNotes notes={[
      {id:'one',label:'Advantage',body:'The same documented observation.',meta:'Source qualification'},
      {id:'two',label:'Lesson',body:'The same documented observation.',meta:'Application qualification'},
      {id:'three',label:'Risk',body:'A different observation.',meta:'Risk qualification'},
    ]} />);
    expect(screen.getAllByText('The same documented observation.')).toHaveLength(1);
    expect(screen.getByText('Advantage / Lesson')).toBeTruthy();
    expect(screen.getByText('Source qualification')).toBeTruthy();
    expect(screen.getByText('Application qualification')).toBeTruthy();
    expect(screen.getAllByRole('article')).toHaveLength(2);
  });
  it('retains highest/lowest score associations and source-review caveat', () => {
    const city=allCities.find(city=>city.id==='phuket')!;
    render(<CityQuickRead city={city} locale="en" highest="hospitality" lowest="safety" />);
    expect(screen.getByText('88/100')).toBeTruthy();
    expect(screen.getByText('57/100')).toBeTruthy();
    expect(screen.getByText(/Curated scores.*sources, dates and provincial context/)).toBeTruthy();
  });
});
