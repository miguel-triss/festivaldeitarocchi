// The wordmark alone, transparent background: SVG (vector) and PNG, in cream
// (for dark backgrounds) and night (for light backgrounds).
import puppeteer from "puppeteer-core";
import { readFileSync, writeFileSync } from "node:fs";
const raw = readFileSync("src/assets/brand/wordmark.svg", "utf8");
const [, , W0, H0] = raw.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
const PAD = Math.round(W0 * 0.04); // a quiet margin all around
const W = W0 + PAD * 2, H = H0 + PAD * 2;
const colors = { crema: "#F3DFC6", notte: "#181B2E" };
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
const out = 3000; // px width of the PNG
await page.setViewport({ width: out, height: Math.round((out * H) / W), deviceScaleFactor: 1 });
for (const [name, hex] of Object.entries(colors)) {
  const svg = raw
    .replace(/viewBox="[^"]+"/, `viewBox="${-PAD} ${-PAD} ${W} ${H}"`)
    .replace("<svg ", `<svg fill="${hex}" `);
  writeFileSync(`presentazione/logo/festival-dei-tarocchi-logo-${name}.svg`, svg);
  await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace("<svg ", '<svg width="100%" height="100%" ')}</body></html>`);
  await page.screenshot({ path: `presentazione/logo/festival-dei-tarocchi-logo-${name}.png`, omitBackground: true });
}
await browser.close();
console.log("ok", W, H);
