import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  getCityDetail,
  getCityFactsRows,
  getCityFinanceInstrumentCatalog,
  getCitySummaries,
} from "../src/cityCdp.ts";

const rootDir = path.resolve(process.cwd(), "database", "cdp-seeds");
const cityDir = path.join(rootDir, "cities");

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function main() {
  const summaries = getCitySummaries();
  const manifest = [];

  await mkdir(rootDir, { recursive: true });
  await mkdir(cityDir, { recursive: true });

  await writeJson(path.join(rootDir, "finance-instruments.json"), getCityFinanceInstrumentCatalog());
  await writeJson(path.join(rootDir, "city-research-export-rows.json"), getCityFactsRows());

  for (const summary of summaries) {
    const detail = getCityDetail(summary.id);
    if (!detail) continue;

    const fileName = `${summary.id}.json`;
    manifest.push({
      cityId: summary.id,
      file: `cities/${fileName}`,
      tier: summary.tier,
      status: summary.status,
      exportReady: summary.exportReady,
      provenanceCount: summary.provenanceCount,
    });

    await writeJson(path.join(cityDir, fileName), {
      summary,
      contextNotes: detail.contextNotes,
      metricBlocks: detail.metricBlocks,
      deliveryProfile: detail.deliveryProfile,
      financeProfile: detail.financeProfile,
      financeRecommendations: detail.financeRecommendations,
      evidenceItems: detail.evidenceItems,
      dataRails: detail.dataRails,
      exportMetadata: detail.exportMetadata,
    });
  }

  await writeJson(path.join(rootDir, "manifest.json"), {
    generatedAt: new Date().toISOString(),
    cities: manifest,
  });

  process.stdout.write(`Exported ${manifest.length} city seed files to ${rootDir}\n`);
}

main().catch(error => {
  process.stderr.write(`${error instanceof Error ? error.stack ?? error.message : String(error)}\n`);
  process.exitCode = 1;
});
