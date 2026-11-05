import { renderToStaticMarkup } from 'react-dom/server';
import { describe, it, expect } from 'vitest';
import { CitySpotlight } from './CityDetailPage';

describe('city spotlight evidence boundaries', () => {
  it.each(['en','th','zh'] as const)('does not turn a demonstration or missing value into an operating outcome in %s', locale => {
    const phuket = renderToStaticMarkup(<CitySpotlight cityId="phuket" locale={locale}/>);
    expect(phuket).toContain('https://www.mlit.go.jp/report/press/sogo07_hh_000591.html');
    expect(phuket).not.toMatch(/15%|0km|high-maturity|ระดับสูง|高成熟/);
    const khon = renderToStaticMarkup(<CitySpotlight cityId="khon-kaen" locale={locale}/>);
    expect(khon).not.toMatch(/100%|PPP 2.0|most community-resilient|最具社区韧性/);
    const wangchan = renderToStaticMarkup(<CitySpotlight cityId="wangchan-valley" locale={locale}/>);
    expect(wangchan).not.toMatch(/0 RESIDENTS|55|without residents|ไม่มีคนอยู่|没有居民/);
    expect(wangchan).toContain({en:'Population unknown',th:'ยังไม่ทราบประชากร',zh:'人口未知'}[locale]);
  });
});
