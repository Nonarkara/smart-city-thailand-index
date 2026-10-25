import { render } from "@testing-library/react";
import BaselinePage from "./BaselinePage";
import MethodologyPage from "./MethodologyPage";

/**
 * A live number that is interpolated into a sentence has to live in a
 * TEMPLATE literal. Put `${...}` inside a double-quoted string and the
 * braces reach the reader verbatim — the page then claims to say
 * "24.5 deaths per 100,000" and renders "${baselineRoadSafety.national".
 *
 * It happened once in the methodology page, and it type-checks perfectly,
 * and the test suite passes. The only way it is caught is by looking at
 * what the reader actually sees.
 */

const LEAKED_PLACEHOLDER = /\$\{/;

describe("no unrendered template placeholder reaches the reader", () => {
  it("renders the baseline page without a literal placeholder", () => {
    const { container } = render(<BaselinePage locale="en" onNavigate={() => {}} />);
    expect(container.textContent ?? "").not.toMatch(LEAKED_PLACEHOLDER);
  });

  it("renders the methodology page without a literal placeholder", () => {
    const { container } = render(<MethodologyPage locale="en" onNavigate={() => {}} />);
    expect(container.textContent ?? "").not.toMatch(LEAKED_PLACEHOLDER);
  });

  it("renders the methodology page in Thai and Chinese without one either", () => {
    for (const locale of ["th", "zh"] as const) {
      const { container, unmount } = render(
        <MethodologyPage locale={locale} onNavigate={() => {}} />,
      );
      expect(container.textContent ?? "").not.toMatch(LEAKED_PLACEHOLDER);
      unmount();
    }
  });

  it("shows snapshot road-safety numbers and distinguishes editorial anchors from WHO policy", () => {
    const { container } = render(<MethodologyPage locale="en" onNavigate={() => {}} />);
    const text = container.textContent ?? "";
    // A national rate in the right order of magnitude, and the best province.
    expect(text).toMatch(/national screening rate is \d+\.\d per 100,000/);
    expect(text).toMatch(/has the lowest provincial rate at \d+\.\d/);
    expect(text).toContain("scoring anchor is a SCITI research choice");
    expect(text).toContain("WHO's global goal is a 50% reduction");
  });
});
