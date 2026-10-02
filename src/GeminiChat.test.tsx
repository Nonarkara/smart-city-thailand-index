import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import GeminiChat from "./GeminiChat";

vi.mock("./cityApi", () => ({ useCitySummaries: () => ({ data: [] }) }));

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

it("removes legacy keys and sends session credentials only in a header", async () => {
  Object.defineProperty(HTMLElement.prototype, "scrollTo", { value: vi.fn(), configurable: true });
  localStorage.setItem("smart-city-thailand-gemini-key", "legacy-test-key");
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ candidates: [{ content: { parts: [{ text: "Test response" }] } }] }),
  });
  vi.stubGlobal("fetch", fetchMock);
  const { unmount } = render(<GeminiChat locale="en" />);
  expect(localStorage.getItem("smart-city-thailand-gemini-key")).toBeNull();
  fireEvent.click(screen.getByTitle("Ask about Thai smart cities"));
  fireEvent.change(screen.getByLabelText("Gemini API key"), { target: { value: "session-test-key" } });
  fireEvent.click(screen.getByText("Use key for this session"));
  expect(localStorage.length).toBe(0);
  fireEvent.change(screen.getByPlaceholderText("Ask about any city..."), { target: { value: "Show sources" } });
  fireEvent.keyDown(screen.getByPlaceholderText("Ask about any city..."), { key: "Enter" });
  await waitFor(() => expect(screen.getByText("Test response")).toBeInTheDocument());
  const [url, options] = fetchMock.mock.calls[0];
  expect(url).not.toContain("key=");
  expect(options.headers["x-goog-api-key"]).toBe("session-test-key");
  fireEvent.click(screen.getByText("Remove key"));
  expect(screen.getByLabelText("Gemini API key")).toHaveValue("");
  expect(screen.queryByText("Test response")).not.toBeInTheDocument();
  unmount();
});
