import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "./App";

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

describe("Bingo route escape", () => {
  it("returns a shared-link visitor from the fullscreen game to the actual home route", async () => {
    vi.stubGlobal("ResizeObserver", class {
      observe() {}
      unobserve() {}
      disconnect() {}
    });
    vi.stubGlobal("matchMedia", vi.fn(() => ({
      matches: true, media: "(max-width: 640px)", onchange: null,
      addEventListener: vi.fn(), removeEventListener: vi.fn(),
      addListener: vi.fn(), removeListener: vi.fn(), dispatchEvent: vi.fn(),
    })));
    localStorage.setItem("smart-city-thailand-locale", "en");
    window.history.replaceState({}, "", "/bingo");
    render(<App />);
    await act(async () => { await vi.dynamicImportSettled(); });
    const exit = await screen.findByRole("button", { name: "Back to SCITI" });
    expect(document.querySelectorAll(".route-photo-hero-bingo .route-photo-hero-title")).toHaveLength(0);
    expect(document.querySelectorAll(".route-photo-hero-bingo .route-photo-hero-desc")).toHaveLength(0);
    await userEvent.setup().click(exit);
    await act(async () => { await vi.dynamicImportSettled(); });
    expect(window.location.pathname).toBe("/");
    expect(document.querySelector(".bingo-page")).toBeNull();
    expect(document.querySelector(".cinematic-hero")).not.toBeNull();
  });
});
