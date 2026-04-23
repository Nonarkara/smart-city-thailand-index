import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("restores locale from storage and syncs the document language", async () => {
    localStorage.setItem("smart-city-thailand-locale", "zh");

    render(<App />);

    await screen.findByText(/2026 泰国智慧城市指数/i);
    expect(document.documentElement.lang).toBe("zh");
  });

  it("updates city detail content when the route changes between city pages", async () => {
    window.history.pushState({}, "", "/city/phuket");
    render(<App />);

    await act(async () => {
      await vi.dynamicImportSettled();
    });

    await screen.findByRole("heading", { name: "Phuket Smart City" });
    await screen.findByRole("heading", {
      name: /what is real now, what is missing, and what unlocks the next step/i,
    });
    await screen.findByRole("heading", { name: /printable baseline for investment discussions/i });
    await screen.findByRole("button", { name: "Export city CSV" });

    await act(async () => {
      window.history.pushState({}, "", "/city/chiang-mai-old-town");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await vi.dynamicImportSettled();
    });
    await screen.findByRole("heading", { name: "Chiang Mai Smart Old Town" });

    await act(async () => {
      window.history.pushState({}, "", "/city/satun");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await vi.dynamicImportSettled();
    });
    await screen.findByRole("heading", { name: "Satun Smart City" });
    expect((await screen.findAllByText(/3,019 km²/i)).length).toBeGreaterThan(0);
  });

  it("cycles locale and keeps document language in sync", async () => {
    const user = userEvent.setup();
    render(<App />);

    const toggle = await screen.findByRole("button", { name: "Switch language to Thai" });
    await user.click(toggle);

    await waitFor(() => {
      expect(document.documentElement.lang).toBe("th");
    });
  });

  it("marks registered city pages as proposal profiles with sourced administrative baselines", async () => {
    window.history.pushState({}, "", "/city/reg-chumphon");
    render(<App />);

    await act(async () => {
      await vi.dynamicImportSettled();
    });

    await screen.findByRole("heading", { name: "Chumphon Municipality" });
    await screen.findByText("Registered Smart City Proposal");
    await screen.findByText("Read this as a proposal stub.");
    await screen.findByText("Registered proposal profile");
  });

  it("downloads city detail CSV from the client-side research dataset", async () => {
    const user = userEvent.setup();
    const createObjectURL = vi.fn(() => "blob:city-export");
    const revokeObjectURL = vi.fn();
    const anchorClick = vi
      .spyOn(HTMLAnchorElement.prototype, "click")
      .mockImplementation(() => {});

    Object.defineProperty(URL, "createObjectURL", {
      value: createObjectURL,
      configurable: true,
    });
    Object.defineProperty(URL, "revokeObjectURL", {
      value: revokeObjectURL,
      configurable: true,
    });

    window.history.pushState({}, "", "/city/phuket");
    render(<App />);

    await act(async () => {
      await vi.dynamicImportSettled();
    });

    await user.click(await screen.findByRole("button", { name: "Export city CSV" }));

    const blob = createObjectURL.mock.calls[0]?.[0] as Blob;
    const bytes = new Uint8Array(await blob.arrayBuffer());
    const text = await blob.text();
    expect(blob).toBeInstanceOf(Blob);
    expect(Array.from(bytes.slice(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(text).toContain("city_id,city_name_en");
    expect(text).toContain("phuket,Phuket Smart City");
    expect(anchorClick).toHaveBeenCalledTimes(1);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:city-export");

    anchorClick.mockRestore();
  });

  it("uses link-based primary and secondary navigation", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Rankings" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Your City" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Showcase" })).toBeInTheDocument();

    await user.click(screen.getByRole("link", { name: "Rankings" }));
    await vi.dynamicImportSettled();

    await screen.findByRole("heading", { name: /national leaderboard and comparison matrix/i });
    expect(screen.getByRole("link", { name: "Rankings" })).toHaveAttribute("aria-current", "page");
  });
});
