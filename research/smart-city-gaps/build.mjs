// Renders paper.src.html -> paper.html (figures inlined) -> PDF via Chromium.
import { chromium } from "@playwright/test";
import fs from "fs"; import path from "path"; import url from "url";
const here = path.dirname(url.fileURLToPath(import.meta.url));
let html = fs.readFileSync(path.join(here, "paper.src.html"), "utf8");
html = html.replace(/<!--svg:([\w-]+)-->/g, (_, n) =>
  fs.readFileSync(path.join(here, "figures", n + ".svg"), "utf8").replace(/<\?xml[^>]*>|<!DOCTYPE[^>]*>/g, "").replace(/<!--[\s\S]*?-->/g, ""));

// ── appendix rows, generated from the frozen data (never hand-typed)
const CODE = { sense: "S", decide: "D", push: "P", none: "\u2014", ambiguous: "?" };
function parseCsv(text) {
  const rows = []; let row = [], field = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else quoted = false; } else field += c; }
    else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else if (c !== "\r") field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1);
}
const csvRows = parseCsv(fs.readFileSync(path.join(here, "out/flagship-coding.csv"), "utf8"));
const csvHead = csvRows.shift();
const codeRows = csvRows.map((r) => Object.fromEntries(csvHead.map((h, i) => [h, r[i]])));
const snap = JSON.parse(fs.readFileSync(path.join(here, "data/scity-snapshot-2026-11-05.json"), "utf8"));
const byCity = new Map();
for (const r of codeRows) { if (!byCity.has(r.city)) byCity.set(r.city, []); byCity.get(r.city).push(r); }
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const cityRows = [];
for (const [city, rs] of byCity) {
  const rec = snap.depa[city] || {};
  const stages = rs.map((r) => CODE[r.stage]).join(" ");
  const hz = rs.filter((r) => r.env_safety_domain === "1" && r.stage === "push").length;
  const partner = rec.partnerships && rec.partnerships.length ? "1" : "0";
  const raw = String(rec.officialName || city);
  const m = raw.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  const nameCell = m
    ? `${esc(m[2])}<br><span class="dim">${esc(m[1])}</span>`
    : esc(raw);
  cityRows.push(`<tr><td>${nameCell}</td><td class="r">${rs[0].batch}</td>` +
    `<td>${stages} <span class="dim">(${rs.length})</span></td><td class="r">${hz || "\u2014"}</td><td class="r">${partner}</td></tr>`);
}
html = html.replace("<!--CITY_ROWS-->", cityRows.join("\n"));
const PUB = { "nso-": "NSO", "rfd-": "RFD", "pcd-": "PCD", "rtddi-": "RTDDI", "moe-": "MOE", "data-go-th-": "DGA" };
const base = JSON.parse(fs.readFileSync(path.join(here, "data/province-baseline-2026-11-05.json"), "utf8"));
const indRows = base.indicators.map((i) => {
  const pub = Object.entries(PUB).find(([k]) => i.id.startsWith(k));
  const unit = i.unit && i.unit !== "%" ? ` (${i.unit})` : (i.unit === "%" ? " (%)" : "");
  return `<tr><td>${esc(i.label)}${unit}</td><td class="r">${pub ? pub[1] : ""}</td>` +
         `<td class="r">${i.year}</td><td class="r">${i.provinceCount}</td></tr>`;
});
html = html.replace("<!--IND_ROWS-->", indRows.join("\n"));
console.log(`appendix: ${cityRows.length} cities, ${indRows.length} indicators`);
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
// authorship into the PDF metadata (Chrome drops <meta name="author">)
const { execFileSync } = await import("node:child_process");
execFileSync("python3", [path.join(here, "set_pdf_metadata.py"), out], { stdio: "inherit" });
