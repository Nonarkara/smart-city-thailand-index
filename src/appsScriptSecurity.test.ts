import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createContext, runInContext } from "node:vm";
import { describe, expect, it } from "vitest";

const source = readFileSync(fileURLToPath(import.meta.url).replace(/src\/appsScriptSecurity\.test\.ts$/, "database/google-apps-script/Code.gs"), "utf8");

function script(secret: string | null, existing = false) {
  const writes: unknown[][] = [];
  const sheet = {
    getLastRow: () => existing ? 2 : 1,
    getRange: () => ({ getValues: () => [["test-id"]], setValues: (rows: unknown[][]) => writes.push(...rows) }),
    appendRow: (row: unknown[]) => writes.push(row),
  };
  const context = createContext({
    PropertiesService: { getScriptProperties: () => ({ getProperty: (key: string) => key === "SMART_CITY_SIGNAL_SECRET" ? secret : null }) },
    SpreadsheetApp: { getActiveSpreadsheet: () => ({ getSheetByName: () => sheet }) },
    Utilities: { getUuid: () => "test-id" },
    ContentService: { MimeType: { JSON: "json" }, createTextOutput: (text: string) => ({ text, setMimeType() { return this; } }) },
  });
  runInContext(source, context);
  return { context, writes };
}

function post(context: ReturnType<typeof createContext>, secret?: string, text = "Evidence") {
  return JSON.parse(context.doPost({ parameter: { secret }, postData: { contents: JSON.stringify({ text }) } }).text);
}

describe("Apps Script signal storage security", () => {
  it("rejects missing configuration and incorrect credentials without writing", () => {
    for (const [configured, supplied] of [[null, undefined], ["expected", undefined], ["expected", "wrong"]] as const) {
      const { context, writes } = script(configured);
      expect(post(context, supplied)).toMatchObject({ status: 401, error: "Unauthorized" });
      expect(writes).toHaveLength(0);
      expect(context.doGet({ parameter: {} }).text).toContain("Unauthorized");
    }
  });

  it.each([false, true])("stores all imported string fields literally (existing=%s)", (existing) => {
    const { context, writes } = script("expected", existing);
    expect(post(context, "expected", "=1+1").ok).toBe(true);
    expect(writes[0][4]).toBe("'=1+1");
    for (const value of ["=1+1", "+formula", "-formula", "@formula", "\t=1", "\r=1", "\n=1"]) {
      expect(context.literalCell_(value)).toBe(`'${value}`);
    }
    expect(context.literalCell_(42)).toBe(42);
    expect(context.literalCell_("Thai evidence ผม")).toBe("Thai evidence ผม");
  });
});
