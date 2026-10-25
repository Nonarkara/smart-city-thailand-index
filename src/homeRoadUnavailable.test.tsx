import { render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";
import HomePage from "./HomePage";

vi.mock("./cityApi", () => ({ useCitySummaries: () => ({ data: [] }) }));

it("shows the missing-record state instead of substituting seed rates", () => {
  const { container } = render(<HomePage locale="en" onNavigate={vi.fn()} />);
  expect(screen.getByLabelText("Road-death data unavailable")).toHaveTextContent("No estimates are substituted");
  expect(container.querySelector('.road-safety-champions')).toBeNull();
});
