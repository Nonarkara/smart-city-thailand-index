import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import MapDashboardPage from "./MapDashboardPage";

afterEach(cleanup);
describe("map decision group", () => {
  it("opens a mapped dossier by Enter and Space and exposes focused context", () => {
    const navigate = vi.fn();
    render(<MapDashboardPage locale="en" onNavigate={navigate} />);
    const marker = screen.getByRole("link", { name: "Open Samyan Smart City dossier" });
    expect(marker).toHaveAttribute("tabindex", "0");
    fireEvent.focus(marker);
    fireEvent.keyDown(marker, { key: "Enter" });
    fireEvent.keyDown(marker, { key: " " });
    expect(navigate.mock.calls).toEqual([["/city/samyan"], ["/city/samyan"]]);
  });
  it("keeps guide artwork after the operating surface and distinguishes mapped coverage", () => {
    const { container } = render(<MapDashboardPage locale="en" onNavigate={vi.fn()} guide={<aside>Commissioned guide</aside>} />);
    const map = container.querySelector(".map-dash-map")!;
    const guide = screen.getByText("Commissioned guide");
    expect(map.compareDocumentPosition(guide) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText(/legacy reference points \/ 118 records/)).toBeInTheDocument();
    expect(screen.getAllByText(/Unassessed/).length).toBeGreaterThan(0);
  });
  it("labels failed imagery while retaining reference-point interaction", () => {
    const { container } = render(<MapDashboardPage locale="en" onNavigate={vi.fn()} />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading Esri basemap");
    fireEvent.error(container.querySelector("image")!);
    expect(screen.getByRole("status")).toHaveTextContent("Esri basemap unavailable");
    expect(screen.getByRole("link", { name: "Open Samyan Smart City dossier" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Satellite", exact: true }));
    expect(screen.getByRole("status")).toHaveTextContent("Loading Esri basemap");
    fireEvent.load(container.querySelector("image")!);
    expect(screen.getByRole("status")).toHaveTextContent("not a live feed");
  });
});
