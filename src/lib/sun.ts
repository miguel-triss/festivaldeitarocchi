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

let count = 0;

/**
 * The sun, painted: rays lit from the centre towards terracotta tips and
 * engraved with fine lines (as in the printed suns of the design files),
 * a disc with volume, the face on top. `id` keeps gradients unique per use.
 */
export function sunMarkup(id = `sun${++count}`) {
  const { cx, cy, r } = SUN_DISC;
  const raysPath = raysInner.replace("<path ", `<path id="${id}-rp" `).replace(/fill="[^"]*"/, `fill="url(#${id}-rg)"`);
  const engraving = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r1 = r + 3, r2 = r + (i % 2 ? 26 : 44);
    return `M${(cx + r1 * Math.cos(a)).toFixed(1)} ${(cy + r1 * Math.sin(a)).toFixed(1)}L${(cx + r2 * Math.cos(a)).toFixed(1)} ${(cy + r2 * Math.sin(a)).toFixed(1)}`;
  }).join("");
  return (
    `<defs>` +
    `<radialGradient id="${id}-rg" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r * 2.3}">` +
    `<stop offset="0" stop-color="color-mix(in oklab, var(--sun-gold, var(--c-gold)) 70%, var(--c-cream))"/>` +
    `<stop offset=".5" stop-color="var(--sun-gold, var(--c-gold))"/>` +
    `<stop offset="1" stop-color="color-mix(in oklab, var(--sun-gold, var(--c-gold)) 72%, var(--c-terra))"/>` +
    `</radialGradient>` +
    `<radialGradient id="${id}-dg" gradientUnits="userSpaceOnUse" cx="${cx - r * 0.3}" cy="${cy - r * 0.35}" r="${r * 1.25}">` +
    `<stop offset="0" stop-color="color-mix(in oklab, var(--sun-gold, var(--c-gold)) 62%, var(--c-cream))"/>` +
    `<stop offset=".6" stop-color="var(--sun-gold, var(--c-gold))"/>` +
    `<stop offset="1" stop-color="color-mix(in oklab, var(--sun-gold, var(--c-gold)) 78%, var(--c-terra))"/>` +
    `</radialGradient>` +
    `<clipPath id="${id}-rc"><use href="#${id}-rp"/></clipPath>` +
    `</defs>` +
    `<g class="sun-rays" style="transform-origin:${cx}px ${cy}px">${raysPath}` +
    `<path d="${engraving}" stroke="var(--sun-ink, var(--c-night-deep))" stroke-width=".45" opacity=".4" clip-path="url(#${id}-rc)"/>` +
    `</g>` +
    `<g class="sun-disc">` +
    `<circle cx="${cx}" cy="${cy}" r="${r + 2.2}" fill="none" stroke="var(--sun-gold, var(--c-gold))" stroke-width="1" opacity=".7"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#${id}-dg)"/>` +
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--sun-ink, var(--c-night-deep))" stroke-width=".7" opacity=".85"/>` +
    `<g transform="translate(${cx} ${cy}) scale(${(r * 0.96) / 100})">${faceInner}</g>` +
    `</g>`
  );
}
