import { chromium } from "playwright";
import fs from "fs";
const dir = process.argv[2];
const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 2 });
const files = fs.readdirSync(dir).filter(f => f.endsWith(".svg"));
const html = `<body style="margin:12px;background:#fff;font-family:'Source Sans 3'">` + files.map(f => `<div style="margin:0 0 14px"><img src="file://${dir}/${f}" style="${f.includes('targeting')?'width:7.09in':'width:3.41in'};outline:1px solid #eee"/></div>`).join("") + "</body>";
fs.writeFileSync(dir + "/_preview.html", html);
await p.goto("file://" + dir + "/_preview.html"); await p.waitForTimeout(500);
await p.screenshot({ path: dir + "/_preview.png", fullPage: true }); await b.close();
