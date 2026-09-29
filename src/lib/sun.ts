// The sun with a face, from the design files (tools/extract-brand.py):
//  - rays: silhouette traced from the logo panel of design/moodboard.jpg
//  - face: lines traced from the larger sun in presentazione-infografica.jpg
// Shared by Sun.astro and the XIX card, so there is only one sun.
import rays from "../assets/brand/sun.svg?raw";
import face from "../assets/brand/sun-face.svg?raw";

const inner = (s: string) => s.replace(/<svg[^>]*>/, "").replace("</svg>", "");

export const SUN_VIEWBOX = rays.match(/viewBox="([^"]+)"/)![1];
// disc of the moodboard sun, in sun.svg coordinates
export const SUN_DISC = { cx: 77, cy: 76, r: 32 };

const raysInner = inner(rays).replace(/fill="#[0-9A-Fa-f]{6}"/, 'fill="var(--sun-gold, var(--c-gold))"');
const faceInner = inner(face)
  .replace('fill="#181B2E"', 'fill="var(--sun-ink, var(--c-night-deep))"')
  .replace('fill="#B23556"', 'fill="var(--sun-lips, var(--c-terra))"');

export function sunMarkup() {
  const { cx, cy, r } = SUN_DISC;
  return (
    `<g class="sun-rays" style="transform-origin:${cx}px ${cy}px">${raysInner}</g>` +
    `<g class="sun-disc">` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="var(--sun-gold, var(--c-gold))"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--sun-ink, var(--c-night-deep))" stroke-width=".7" opacity=".85"/>` +
    `<g transform="translate(${cx} ${cy}) scale(${(r * 0.96) / 100})">${faceInner}</g>` +
    `</g>`
  );
}
