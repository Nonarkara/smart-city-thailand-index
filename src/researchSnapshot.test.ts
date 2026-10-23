import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { expect, it } from "vitest";
import manifest from "./researchSnapshot.json";
import { allCities } from "./cityData";
import { deriveAll } from "./dimensionScores";
it("keeps the cited snapshot intact and consistent with published calculations",()=>{
  const bytes=readFileSync(`public${manifest.path}`);
  expect(createHash("sha256").update(bytes).digest("hex")).toBe(manifest.sha256);
  // The size the dossier shows a reader must be the real size.
  expect(manifest.bytes).toBe(bytes.length);
  const snapshot=JSON.parse(bytes.toString());
  expect(snapshot.cities).toEqual(allCities);
  expect(snapshot.results).toEqual(Object.fromEntries(deriveAll(allCities)));
  expect(snapshot.methodSource).toBe(readFileSync("src/dimensionScores.ts","utf8"));
});
