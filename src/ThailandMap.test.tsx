import { fireEvent, render, screen } from "@testing-library/react";
import ThailandMap from "./ThailandMap";

describe("ThailandMap", () => {
  it("allows keyboard activation on map markers", () => {
    const onNavigate = vi.fn();
    render(<ThailandMap locale="en" onNavigate={onNavigate} />);

    const marker = screen.getByLabelText(/Phuket Smart City/i);
    fireEvent.keyDown(marker, { key: "Enter" });

    expect(onNavigate).toHaveBeenCalled();
  });
});
