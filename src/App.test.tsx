import { render, screen, waitFor } from "@testing-library/react";
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

    await vi.dynamicImportSettled();
    await screen.findByRole("heading", { name: "Phuket Smart City" });

    window.history.pushState({}, "", "/city/chiang-mai-old-town");
    window.dispatchEvent(new PopStateEvent("popstate"));

    await vi.dynamicImportSettled();
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
});
