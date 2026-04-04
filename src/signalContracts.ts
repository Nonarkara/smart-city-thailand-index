export type SignalBackendMode = "supabase" | "google-apps-script" | "local";
export type SignalSentiment = "positive" | "neutral" | "negative";

export const DEFAULT_SIGNAL_LIMIT = 12;
export const MAX_SIGNAL_LIMIT = 50;
export const MAX_SIGNAL_TEXT_LENGTH = 5000;
export const MAX_SIGNAL_THEMES = 8;
export const MAX_SIGNAL_LABEL_LENGTH = 120;

const DEFAULT_SENTIMENT_SCORES: Record<SignalSentiment, number> = {
  positive: 0.75,
  neutral: 0,
  negative: -0.7,
};

export class SignalValidationError extends Error {
  readonly field: string;

  constructor(field: string, message: string) {
    super(message);
    this.name = "SignalValidationError";
    this.field = field;
  }
}

export function parseSignalLimit(queryValue: string | string[] | undefined): number {
  const raw = Array.isArray(queryValue) ? queryValue[0] : queryValue;
  const limit = Number(raw ?? DEFAULT_SIGNAL_LIMIT);

  if (!Number.isFinite(limit) || limit < 1) {
    return DEFAULT_SIGNAL_LIMIT;
  }

  return Math.min(Math.trunc(limit), MAX_SIGNAL_LIMIT);
}

export function normalizeSignalSentiment(value: unknown): SignalSentiment {
  return value === "positive" || value === "negative" ? value : "neutral";
}

export function coerceSentimentScore(value: unknown, sentiment: SignalSentiment): number {
  const parsed =
    typeof value === "number"
      ? value
      : typeof value === "string"
        ? Number(value)
        : NaN;

  if (!Number.isFinite(parsed)) {
    return DEFAULT_SENTIMENT_SCORES[sentiment];
  }

  return Math.max(-1, Math.min(1, parsed));
}

export function normalizeThemes(themes: unknown): string[] {
  const items = Array.isArray(themes)
    ? themes
    : typeof themes === "string"
      ? themes.split(/[|,]/)
      : [];

  const deduped = new Map<string, string>();

  items.forEach((theme) => {
    const cleaned = String(theme).trim().replace(/\s+/g, " ").slice(0, MAX_SIGNAL_LABEL_LENGTH);
    if (!cleaned) return;
    const key = cleaned.toLocaleLowerCase();
    if (!deduped.has(key)) {
      deduped.set(key, cleaned);
    }
  });

  return Array.from(deduped.values()).slice(0, MAX_SIGNAL_THEMES);
}

export function normalizeOptionalSlug(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const cleaned = value.trim();
  return cleaned ? cleaned : null;
}

export function normalizeLabel(value: unknown, fallback: string): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const cleaned = value.trim().replace(/\s+/g, " ").slice(0, MAX_SIGNAL_LABEL_LENGTH);
  return cleaned || fallback;
}

export function normalizeSignalText(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const cleaned = value.trim().replace(/\s+/g, " ");
  if (cleaned.length > MAX_SIGNAL_TEXT_LENGTH) {
    throw new SignalValidationError(
      "text",
      `Signal text must be ${MAX_SIGNAL_TEXT_LENGTH} characters or fewer.`,
    );
  }

  return cleaned;
}

export function normalizeTimestamp(value: unknown, fallbackIso: string, field: string): string {
  if (typeof value !== "string" || !value.trim()) {
    return fallbackIso;
  }

  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) {
    throw new SignalValidationError(field, `${field} must be a valid ISO-8601 timestamp.`);
  }

  return new Date(parsed).toISOString();
}

function hash32(value: string, seed: number): string {
  let hash = seed >>> 0;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
    hash = (hash + 0x9e3779b9) >>> 0;
  }

  return hash.toString(16).padStart(8, "0");
}

function formatUuidFromHex(hex: string): string {
  const chars = hex.slice(0, 32).split("");
  chars[12] = "5";
  chars[16] = ((Number.parseInt(chars[16] ?? "0", 16) & 0x3) | 0x8).toString(16);
  const normalized = chars.join("");

  return [
    normalized.slice(0, 8),
    normalized.slice(8, 12),
    normalized.slice(12, 16),
    normalized.slice(16, 20),
    normalized.slice(20, 32),
  ].join("-");
}

export function buildStableSignalId(input: {
  cityId: string | null;
  source: string;
  channel: string;
  text: string;
  sentiment: SignalSentiment;
  themes: string[];
  observedAt: string;
}): string {
  const payload = JSON.stringify({
    cityId: input.cityId ?? "",
    source: input.source,
    channel: input.channel,
    text: input.text,
    sentiment: input.sentiment,
    themes: [...input.themes].sort((left, right) => left.localeCompare(right)),
    observedAt: input.observedAt,
  });

  const hex = [
    hash32(payload, 0x811c9dc5),
    hash32(payload, 0x1b873593),
    hash32(payload, 0x85ebca6b),
    hash32(payload, 0xc2b2ae35),
  ].join("");

  return formatUuidFromHex(hex);
}
