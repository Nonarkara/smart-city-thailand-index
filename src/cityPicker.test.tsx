import { describe, it, expect, vi } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'node:fs';
import TopbarNav from './TopbarNav';
import type {Locale} from './types';

describe('topbar city finder', () => {
  it('opens an alphabetical directory where every row shows a tier glyph and score, and navigates on pick', async () => {
    const onNavigate = vi.fn();
    const { container } = render(
      <TopbarNav locale="en" currentKind="home" onNavigate={onNavigate} mobileOpen onClose={() => {}} />,
    );
    await userEvent.setup().click(screen.getByRole('menuitem', { name: /find a city/i }));
    const panel = container.querySelector('.city-picker-panel') as HTMLElement;
    expect(panel).toBeTruthy();

    const rows = [...panel.querySelectorAll<HTMLElement>('.city-picker-item')];
    // The directory lists every city, sorted alphabetically.
    expect(rows.length).toBeGreaterThan(100);
    const names = rows.map(row => row.querySelector('.city-picker-name')?.textContent ?? '');
    const sorted = [...names].sort((a, b) => a.localeCompare(b, 'en'));
    expect(names).toEqual(sorted);
    // Tier indication (alpha/beta/gamma) and the score ride on every row.
    for (const row of rows) {
      expect(row.querySelector('.city-picker-tier')?.textContent).toMatch(/^[αβγ]$/);
      expect(row.querySelector('.city-picker-score')?.textContent).toMatch(/^\d+\.\d$/);
    }

    // Type-to-filter, then pick a city.
    const input = screen.getByRole('menuitem', { name: /find a city/i });
    expect(input).toBeTruthy();
    await userEvent.type(panel.querySelector('.city-picker-search') as HTMLElement, 'phuket');
    const filtered = [...panel.querySelectorAll<HTMLElement>('.city-picker-item')];
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every(row => (row.querySelector('.city-picker-name')?.textContent ?? '').toLowerCase().includes('phuket'))).toBe(true);
    const target = filtered.find(row => row.dataset.cityId === 'phuket');
    expect(target).toBeTruthy();
    await userEvent.setup().click(target as HTMLElement);
    expect(onNavigate).toHaveBeenCalledWith('/city/phuket');
    cleanup();
  });

  it('labels the finder in every language and marks the current dossier', async () => {
    const labels: Record<Locale, RegExp> = { en: /find a city/i, th: /ค้นหาเมือง/, zh: /查找城市/ };
    for (const locale of ['en', 'th', 'zh'] as Locale[]) {
      const onNavigate = vi.fn();
      const { container } = render(
        <TopbarNav locale={locale} currentKind="city" currentCityId="phuket" onNavigate={onNavigate} mobileOpen onClose={() => {}} />,
      );
      expect(screen.getByRole('menuitem', { name: labels[locale] })).toBeTruthy();
      await userEvent.setup().click(screen.getByRole('menuitem', { name: labels[locale] }));
      const active = container.querySelector('.city-picker-item.active') as HTMLElement | null;
      expect(active?.dataset.cityId).toBe('phuket');
      cleanup();
    }
  });

  it('keeps the row band dense and token-scaled (type law: no clamp, micro meta, hairline rows)', () => {
    const css = fs.readFileSync('src/styles.css', 'utf8');
    const section = css.slice(css.indexOf('.city-picker {'), css.indexOf('/* Mobile: full-screen menu'));
    expect(section).not.toMatch(/clamp\(/);
    expect(section).not.toMatch(/border-radius/);
    expect(section).not.toMatch(/box-shadow(?!: inset)/); // hairlines only; the active row uses an inset rule mark
    expect(section).toMatch(/min-height: 36px/); // dense-group band, below the fat 44px dropdown row
  });
});
