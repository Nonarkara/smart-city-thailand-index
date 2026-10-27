import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ResearchNotes } from './NewsStrip';
import DataFeedback from './DataFeedback';
vi.mock('./visitorTracking', () => ({ sendFeedback: vi.fn().mockResolvedValue(undefined) }));
afterEach(cleanup);
describe('shared research and privacy notes', () => {
  it('keeps source scope and reuse qualifications visible while full notes remain reachable', () => {
    const { container } = render(<ResearchNotes locale="en" />);
    expect(screen.getByText(/Research estimates, not official/).closest('details')).toBeNull();
    expect(screen.getByText(/Images and upstream datasets retain/).closest('details')).toBeNull();
    expect(screen.getByRole('link', { name: /Method/ }).getAttribute('href')).toBe('/methodology');
    expect(container.querySelectorAll('.legal-footer-note')).toHaveLength(1);
    const privacy = container.querySelector('details[data-note="privacy"]') as HTMLDetailsElement;
    fireEvent.click(privacy.querySelector('summary')!);
    expect(privacy.open).toBe(true);
    expect(privacy.textContent).toContain('IP address');
    expect(privacy.textContent).toContain('Google Apps Script');
    expect(container.textContent).not.toContain('Never sold, never shared');
    expect(container.querySelector('[data-note="frameworks"]')?.textContent).toContain('not an ISO certification');
  });
  it.each(['th', 'zh'] as const)('provides localized labels and full notes in %s', locale => {
    const { container } = render(<ResearchNotes locale={locale} />);
    expect(container.querySelectorAll('details > summary')).toHaveLength(2);
    expect(container.querySelector('[data-note="privacy"]')?.textContent).toContain('Google Apps Script');
    expect(container.querySelector('[data-note="frameworks"]')?.textContent).toContain('37122:2019');
    expect(screen.getByRole('link', { name: 'CC BY 4.0' })).toBeTruthy();
  });
  it('does not claim confirmed editorial delivery after an opaque submission', async () => {
    render(<DataFeedback locale="en" />);
    fireEvent.click(screen.getByText('Did we miss anything?', { selector: 'summary' }));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'A dated source for review' } });
    fireEvent.click(screen.getByRole('button', { name: /Send me the data/ }));
    expect(await screen.findByText(/Delivery cannot be confirmed/)).toBeTruthy();
    expect(screen.queryByText(/has been sent to the editorial team/)).toBeNull();
  });
});
