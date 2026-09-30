// The hero as a 16:9 presentation cover (PNG 3840x2160 and a one-page PDF).
// Renders the real site, final state of the opening rite, without the page UI.
import puppeteer from "puppeteer-core";
const url = process.argv[2] || "http://localhost:4322/";
const browser = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: "new" });
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]); // final, still state
await page.goto(url, { waitUntil: "networkidle0" });
await page.addStyleTag({ content: `
  .nav, .passport, .cursor, .cursor-dust, .skip-link, .hero-skip, .hero-cta, .hero-lede, .hero-torn, main > :not(.hero), .footer { display: none !important; }
  html, body { overflow: hidden !important; background: var(--c-night-deep) !important; }
  .hero { height: 100vh !important; min-height: 0 !important; padding: 6vh 4vw 7vh !important; grid-template-rows: 1fr auto !important; }
  .hero-portal { --h: 56vh !important; }
  .hero-title { width: min(40rem, 62vh) !important; }
  .hero-payoff { font-size: 1.25rem !important; margin-top: 1.6rem !important; }
  .hero-when { font-size: 1.9rem !important; margin-top: 1.2rem !important; }
  .hero-flora .flora { width: 20rem !important; }
` });
await page.evaluate(() => {
  const w = document.querySelector(".hero-when");
  if (w) w.innerHTML = 'Presentazione per Partner e Sponsor';
  const sky = document.querySelector(".hero-sky");
  window.scrollTo(0, 0);
});
await page.evaluate(() => document.fonts.ready);
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: "presentazione/copertina-festival-dei-tarocchi.png" });
await page.pdf({ path: "presentazione/copertina-festival-dei-tarocchi.pdf", width: "1920px", height: "1080px", printBackground: true, pageRanges: "1" });
await browser.close();
console.log("ok");
