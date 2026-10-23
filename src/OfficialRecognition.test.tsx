import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import OfficialRecognition from './OfficialRecognition';
import { DEPA_OFFICIAL } from './depaOfficialData';
afterEach(cleanup);
describe('certification reading hierarchy', () => {
  it('distinguishes the recorded total, selected examples and operating evidence', () => {
    render(<OfficialRecognition record={DEPA_OFFICIAL.phuket} locale="en" />);
    expect(screen.getByRole('heading',{name:'The certified plan', level:2})).toBeTruthy();
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('6 examples from the source summary')).toBeTruthy();
    expect(screen.getAllByRole('listitem')).toHaveLength(6);
    expect(screen.getByText(/does not establish that these services are operating today/)).toBeTruthy();
    expect(screen.getByRole('link',{name:/Read the certification plan/}).getAttribute('href')).toBe(DEPA_OFFICIAL.phuket.depaUrl);
  });
  it('preserves every project and the named partners', () => {
    const {container}=render(<OfficialRecognition record={DEPA_OFFICIAL.phuket} locale="en" />);
    const items=container.querySelectorAll('li');
    DEPA_OFFICIAL.phuket.keyProjects.forEach((text,index)=>expect(items[index].textContent).toBe(text.replace(' — ',' ')));
    expect(screen.getByText(DEPA_OFFICIAL.phuket.partnerships![0])).toBeTruthy();
  });
  it('uses the source Thai vision and translates structural labels', () => {
    render(<OfficialRecognition record={DEPA_OFFICIAL.phuket} locale="th" />);
    expect(screen.getByText(DEPA_OFFICIAL.phuket.visionTh)).toBeTruthy();
    expect(screen.getByRole('heading',{name:'ตัวอย่างโครงการตามแผน'})).toBeTruthy();
  });
});
