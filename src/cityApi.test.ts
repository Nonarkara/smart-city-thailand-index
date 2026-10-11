import { cityApiFailureIsRetryable } from "./cityApi";

describe("city API retry policy", () => {
  it("retries only network failures, 429s, and 5xx responses", () => {
    expect(cityApiFailureIsRetryable(null)).toBe(true);
    expect(cityApiFailureIsRetryable(429)).toBe(true);
    expect(cityApiFailureIsRetryable(503)).toBe(true);
    expect(cityApiFailureIsRetryable(404)).toBe(false);
    expect(cityApiFailureIsRetryable(400)).toBe(false);
    expect(cityApiFailureIsRetryable(200)).toBe(false);
  });
});