import { fireEvent, render, screen } from "@testing-library/react";
import ThailandMap from "./ThailandMap";

describe("ThailandMap", () => {
  it("allows keyboard activation on map markers", () => {
    const onNavigate = vi.fn();
    render(<ThailandMap locale="en" onNavigate={onNavigate} />);

    const markers = screen.getAllByRole("button");
    fireEvent.keyDown(markers[0], { key: "Enter" });

    expect(onNavigate).toHaveBeenCalled();
  });
});
