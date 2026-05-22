import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    window.history.pushState({}, "", "/");
  });

  it("restores locale from storage and syncs the document language", async () => {
    localStorage.setItem("smart-city-thailand-locale", "zh");

    render(<App />);

    await screen.findByText("泰国智慧城市指数");
    expect(document.documentElement.lang).toBe("zh");
  });

  it("updates city detail content when the route changes between city pages", async () => {
    window.history.pushState({}, "", "/city/phuket");
    render(<App />);

    await act(async () => {
      await vi.dynamicImportSettled();
    });
    await screen.findByRole("heading", { name: "Phuket Smart City" });

    await act(async () => {
      window.history.pushState({}, "", "/city/chiang-mai-old-town");
      window.dispatchEvent(new PopStateEvent("popstate"));
      await vi.dynamicImportSettled();
    });
    await screen.findByRole("heading", { name: "Chiang Mai Smart Old Town" });
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

  it("opens the responsive nav and closes it after navigating", async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    const navToggle = screen.getByRole("button", { name: "Open navigation menu" });
    await user.click(navToggle);

    const navLinks = container.querySelector(".nav-links");
    expect(navLinks).toHaveClass("nav-links-open");

    // Click the Rankings group trigger to open the dropdown, then click the item
    const rankingsItems = screen.getAllByRole("menuitem", { name: "Rankings" });
    await user.click(rankingsItems[0]); // group trigger
    await user.click(rankingsItems[1]); // dropdown item
    await vi.dynamicImportSettled();
    await screen.findByRole("heading", { name: /the moneyball of thai city investment/i });

    expect(navLinks).not.toHaveClass("nav-links-open");
  });
});
