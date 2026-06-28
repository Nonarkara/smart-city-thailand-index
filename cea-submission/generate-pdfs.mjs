import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

async function htmlToPdf(inputFile, outputFile, opts = {}) {
  const inputPath = resolve(__dirname, inputFile);
  const outputPath = resolve(__dirname, outputFile);
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(`file://${inputPath}`, { waitUntil: "networkidle" });
  // Give web fonts a little extra time to settle
  await page.waitForTimeout(1000);
  await page.pdf({
    path: outputPath,
    format: opts.format || "A4",
    printBackground: true,
    margin: opts.margin || { top: "18mm", bottom: "22mm", left: "16mm", right: "16mm" },
    ...(opts.landscape ? { landscape: true } : {}),
  });
  await browser.close();
  console.log(`Generated ${outputPath}`);
}

(async () => {
  await htmlToPdf("executive-summary.html", "executive-summary.pdf");
  await htmlToPdf("fact-sheet.html", "fact-sheet.pdf", { landscape: true, margin: { top: "12mm", bottom: "12mm", left: "12mm", right: "12mm" } });
  await htmlToPdf("evidence-appendix.html", "evidence-appendix.pdf");
})();
