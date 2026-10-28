import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'node:fs';
import TopbarNav from './TopbarNav';
import AboutPage from './AboutPage';
import type {Locale} from './types';

describe('city data platform framing',()=>{
  it('offers maps and source data without award-submission navigation',async()=>{
    const onNavigate=vi.fn();
    render(<TopbarNav locale="en" currentKind="home" onNavigate={onNavigate} mobileOpen onClose={()=>{}}/>);
    expect(screen.queryByText('Creative Economy')).not.toBeInTheDocument();
    expect(screen.queryByText('Jury walk-through')).not.toBeInTheDocument();
    await userEvent.setup().click(screen.getByRole('menuitem',{name:'Data & sources'}));
    expect(onNavigate).toHaveBeenCalledWith('/references');
    expect(screen.getByRole('menuitem',{name:'City map'})).toBeInTheDocument();
  });
  it('credits the confirmed mascot consent and distinguishes illustration from field evidence in every language',()=>{
    for(const locale of ['en','th','zh'] as Locale[]){
      const {container}=render(<AboutPage locale={locale} onNavigate={()=>{}}/>);
      const credit=container.querySelector('[data-mascot-consent="confirmed"]');
      expect(credit).toBeTruthy();
      expect(credit?.textContent).toContain(locale==='en'?'has consented':locale==='th'?'ยินยอม':'已同意');
      expect(credit?.textContent).toContain('AI');
      expect(container.textContent).not.toMatch(/1\.44|juggernaut|CEA/);
      cleanup();
    }
  });
  it('retires award routes from crawler discovery while preserving old links as redirects',()=>{
    const generator=fs.readFileSync('scripts/generate-city-og-pages.mjs','utf8');
    const paths=generator.slice(generator.indexOf('const STATIC_ROUTES'),generator.indexOf('const lastmod'));
    expect(paths).not.toContain('"/creative-economy"');expect(paths).not.toContain('"/audit"');
    const redirects=fs.readFileSync('public/_redirects','utf8');
    expect(redirects).toMatch(/\/creative-economy\s+\/rankings\s+301/);
    expect(redirects).toMatch(/\/audit\s+\/references\s+301/);
  });
});
