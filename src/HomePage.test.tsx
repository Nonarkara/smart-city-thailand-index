import { fireEvent, render, screen } from "@testing-library/react";
import HomePage from "./HomePage";

describe("HomePage", () => {
  it("allows keyboard activation on ranking rows", () => {
    const onNavigate = vi.fn();
    render(<HomePage locale="en" onNavigate={onNavigate} />);

    const rows = screen.getAllByRole("link");
    fireEvent.keyDown(rows[0], { key: "Enter" });

    expect(onNavigate).toHaveBeenCalled();
  });
});
