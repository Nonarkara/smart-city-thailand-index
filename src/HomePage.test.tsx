import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("routes through dense ranking rows instead of image cards", async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(<HomePage locale="en" onNavigate={onNavigate} />);

    const rows = screen.getAllByRole("link").filter(link =>
      link.className.includes("dashboard-ranking-row"),
    );

    expect(rows.length).toBeGreaterThan(0);
    expect(rows[0]).toHaveTextContent("Phuket Smart City");

    await user.click(rows[0]);
    expect(onNavigate).toHaveBeenCalledWith("/city/phuket");
  });

  it("drops the old cinematic hero imagery and keeps the full rankings CTA", () => {
    const { container } = render(<HomePage locale="en" onNavigate={vi.fn()} />);

    expect(container.querySelector(".cinematic-hero")).toBeNull();
    expect(container.querySelector(".podium-photo-layout")).toBeNull();
    expect(screen.getByRole("button", { name: /open full rankings/i })).toBeInTheDocument();
  });
});
