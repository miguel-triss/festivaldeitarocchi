// Accessibility audit of the whole page with axe-core, in the final state of
// every element (reduced motion: nothing hidden, waiting to animate).
// Usage: node tools/axe.mjs <url> <width>x<height>
import puppeteer from "puppeteer-core";
import { readFileSync } from "node:fs";
const [url = "http://localhost:4322/", size = "1440x900"] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const axe = readFileSync(new URL("../node_modules/axe-core/axe.min.js", import.meta.url), "utf8");
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width, height, isMobile: width < 700, hasTouch: width < 700 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.goto(url, { waitUntil: "networkidle0" });
await page.addScriptTag({ content: axe });
const res = await page.evaluate(async () => await window.axe.run(document, { resultTypes: ["violations"] }));
for (const v of res.violations) {
  console.log(`${v.impact.toUpperCase()} ${v.id}: ${v.help} (${v.nodes.length})`);
  for (const n of v.nodes.slice(0, 6)) console.log("   ", n.target.join(" "), "|", (n.any[0]?.message || n.all[0]?.message || "").slice(0, 150));
}
console.log(res.violations.length ? `${res.violations.length} rule(s) violated` : "no violations");
await browser.close();
