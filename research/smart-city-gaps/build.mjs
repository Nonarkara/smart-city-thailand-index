// Renders paper.src.html -> paper.html (figures inlined) -> PDF via Chromium.
import { chromium } from "@playwright/test";
import fs from "fs"; import path from "path"; import url from "url";
const here = path.dirname(url.fileURLToPath(import.meta.url));
let html = fs.readFileSync(path.join(here, "paper.src.html"), "utf8");
html = html.replace(/<!--svg:([\w-]+)-->/g, (_, n) =>
  fs.readFileSync(path.join(here, "figures", n + ".svg"), "utf8").replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<!--[\s\S]*?-->/g, ""));
fs.writeFileSync(path.join(here, "paper.html"), html);
const b = await chromium.launch();
const p = await b.newPage();
await p.goto("file://" + path.join(here, "paper.html"));
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(600);
const out = process.argv[2] || path.join(here, "SCITI_2026-11-05_DOC_smart-city-gaps-synthesis.pdf");
await p.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true, displayHeaderFooter: true,
  headerTemplate: "<span></span>",
  footerTemplate: `<div style="width:100%;font:7pt 'Helvetica Neue',Arial,sans-serif;color:#5d6a74;padding:0 15mm;display:flex;justify-content:space-between"><span>Thiengburanathum &amp; Arkaraprasertkul · Four gaps and one chain · preprint v1.0, 5 Nov 2026 · not peer reviewed</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>` });
await b.close(); console.log("wrote", out);
