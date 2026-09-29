// Deterministic screenshots with the local Chrome, at given scroll positions.
// Usage: node tools/shoot.mjs <url> <width>x<height> <out-prefix> <y1,y2,...> [--reduced] [--nojs]
// Scrolls with real wheel events so Lenis and ScrollTrigger behave as for a user.
import puppeteer from "puppeteer-core";

const [url, size, prefix, ys = "0", ...flags] = process.argv.slice(2);
const [width, height] = size.split("x").map(Number);
const mobile = width < 700;
const browser = await puppeteer.launch({
  executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--hide-scrollbars"],
});
const page = await browser.newPage();
await page.setViewport({ width, height, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
if (flags.includes("--reduced")) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
if (flags.includes("--nojs")) await page.setJavaScriptEnabled(false);
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
await page.goto(url, { waitUntil: "networkidle0" });
await new Promise((r) => setTimeout(r, 3600)); // let the opening rite finish
for (const y of ys.split(",").map(Number)) {
  // scroll in small wheel steps to the target, like a person would
  let cur = await page.evaluate(() => window.scrollY);
  await page.mouse.move(width / 2, height / 2);
  while (Math.abs(y - cur) > 4) {
    const step = Math.max(-240, Math.min(240, y - cur));
    if (mobile) await page.evaluate((s) => window.scrollBy(0, s), step);
    else await page.mouse.wheel({ deltaY: step });
    await new Promise((r) => setTimeout(r, 60));
    const next = await page.evaluate(() => window.scrollY);
    if (next === cur && !mobile) { await new Promise((r) => setTimeout(r, 200)); }
    cur = await page.evaluate(() => window.scrollY);
    if (Math.abs(next - cur) < 1 && Math.abs(y - cur) > 4 && next === cur) {
      const again = await page.evaluate(() => window.scrollY);
      if (again === cur) break;
    }
  }
  await new Promise((r) => setTimeout(r, 1400));
  const actual = await page.evaluate(() => Math.round(window.scrollY));
  await page.screenshot({ path: `${prefix}-${y}.png` });
  console.log(`${prefix}-${y}.png scrollY=${actual}`);
}
if (errors.length) console.log("ERRORS:", errors);
await browser.close();
