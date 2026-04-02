import "@testing-library/jest-dom/vitest";

Object.defineProperty(window, "scrollTo", {
  value: vi.fn(),
  writable: true,
});

class MockIntersectionObserver {
  observe() {}
  disconnect() {}
  unobserve() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  value: MockIntersectionObserver,
  writable: true,
});
