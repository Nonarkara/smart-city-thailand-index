import { render } from "@testing-library/react";
import HomePage from "./HomePage";
import ReferencesPage from "./ReferencesPage";
import type { Locale } from "./types";

describe("delivery evidence interpretation", () => {
  it.each(["en", "th", "zh"] as Locale[])("preserves protected branding and dates the interface examples in %s", locale => {
    const { container } = render(<HomePage locale={locale} onNavigate={vi.fn()} />);
    expect(container.querySelector('[aria-label="SmaSCITI equals Samastiti"]')).toHaveTextContent("SmaSCITI = Samastiti");
    const examples = container.querySelector('.home-field-ops-section');
    expect(examples).not.toHaveTextContent(/0\.36|36h|36 ชม|36 小时/);
    expect(examples).not.toHaveTextContent(/in Active Use|Live decision-support|实时决策支持系统/);
    expect(examples?.querySelectorAll('a[href^="https://"]')).toHaveLength(6);
    expect(container.querySelector('.hero-status-note')?.textContent).toMatch(/verification|ตรวจสอบ|核实/);
  });

  it("keeps source periods, populations and modeling status beside the findings", () => {
    const { container } = render(<ReferencesPage locale="en" />);
    const records = Array.from(container.querySelectorAll('.delivery-evidence-card'));
    expect(records).toHaveLength(6);
    expect(records.every(record => record.querySelector('a[href^="https://"]'))).toBe(true);
    expect(records[0]).toHaveTextContent("In 2022");
    expect(records[0]).toHaveTextContent("excluding Bangkok and Pattaya");
    expect(records[1]).toHaveTextContent("Frontiers in Sustainable Cities");
    expect(records[1]).not.toHaveTextContent("Sustainable Cities and Society");
    expect(records[2]).toHaveTextContent("modeled, not an observed death count");
    expect(records[5]).toHaveTextContent("15–64-year-olds");
    expect(records[5]).not.toHaveTextContent("29.3%");
  });
});
