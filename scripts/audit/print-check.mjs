/**
 * PRINT VERIFICATION
 * ==================
 * Prints the city dossier and measures every page: the darkest pixel it
 * contains and how much text the PDF carries. A page whose text is in the
 * content stream but whose darkest pixel is near-white is a page the
 * browser never painted — the failure the reviewer found in the previous
 * print mechanism.
 *
 * Run: node scripts/audit/print-check.mjs [baseUrl]
 */
import { chromium } from "@playwright/test";
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync, rmSync } from "node:fs";

const BASE = process.argv[2] || "http://localhost:5188";
const OUT = "/tmp/print-check";
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(BASE + "/city/phuket", { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForTimeout(3000);

const state = await page.evaluate(() => ({
  slots: document.querySelectorAll(".dossier-panel-slot").length,
  active: document.querySelectorAll('.dossier-panel-slot[data-active="true"]').length,
  headings: [...document.querySelectorAll(".dossier-panel-heading")].map(h => h.textContent),
}));
console.log("DOM state:", JSON.stringify(state));

await page.pdf({ path: `${OUT}/dossier.pdf`, format: "A4", printBackground: true });
await browser.close();

const info = execFileSync("pdfinfo", [`${OUT}/dossier.pdf`]).toString();
const pages = Number(info.match(/Pages:\s+(\d+)/)?.[1] ?? 0);
console.log(`pages: ${pages}`);

execFileSync("pdftoppm", ["-r", "40", "-png", `${OUT}/dossier.pdf`, `${OUT}/p`]);

const { execFileSync: ex } = await import("node:child_process");
const py = `
import glob, subprocess, sys
from PIL import Image
files = sorted(glob.glob("${OUT}/p-*.png"))
for f in files:
    im = Image.open(f).convert("L")
    mn = min(im.getdata())
    txt = subprocess.run(["pdftotext","-f",f.split("-")[-1].split(".")[0],"-l",f.split("-")[-1].split(".")[0],"${OUT}/dossier.pdf","-"],capture_output=True,text=True).stdout.strip()
    print(f"{f.split('/')[-1]} darkest={mn} chars={len(txt)}")
`;
ex("python3", ["-c", py]);
