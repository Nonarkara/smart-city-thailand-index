import { fireEvent, render, screen } from "@testing-library/react";
import TopbarNav from "./TopbarNav";

it("closes a compact submenu before restoring desktop navigation", () => {
  const props = { locale: "en" as const, currentKind: "home" as const, onNavigate: vi.fn(), onClose: vi.fn() };
  const { rerender } = render(<TopbarNav {...props} mobileOpen />);
  const cities = screen.getByRole("menuitem", { name: "Cities", exact: true });
  fireEvent.click(cities);
  expect(cities).toHaveAttribute("aria-expanded", "true");
  rerender(<TopbarNav {...props} mobileOpen={false} />);
  expect(cities).toHaveAttribute("aria-expanded", "false");
  // Ordinary desktop clicks still open and close destinations.
  fireEvent.click(cities);
  expect(cities).toHaveAttribute("aria-expanded", "true");
  fireEvent.click(cities);
  expect(cities).toHaveAttribute("aria-expanded", "false");
});
