// Small drawing vocabulary for the Arcana, so the 22 cards share one hand:
// round caps, 1.4 to 2.4 px lines, flat palette fills, sparkles as in the
// moodboard. All output is SVG markup in card coordinates.

export const G = "var(--c-gold)";
export const C = "var(--c-cream)";
export const P = "var(--c-pink)";
export const T = "var(--c-terra)";
export const V = "var(--c-violet)";
export const GR = "var(--c-green)";
export const M = "var(--c-magenta)";
export const N = "var(--c-night-deep)";
export const NM = "var(--c-night)";
// lighter green and grey-green, mixed from palette tokens (no new hues)
export const GRL = "color-mix(in oklab, var(--c-green) 72%, var(--c-cream))";
export const GRW = "color-mix(in oklab, var(--c-green) 55%, var(--c-cream))";

const f = (n: number) => +n.toFixed(1);

export const sparkle = (x: number, y: number, r: number, fill = G) =>
  `<path fill="${fill}" d="M${x} ${f(y - r)}C${f(x + r * 0.07)} ${f(y - r * 0.28)} ${f(x + r * 0.28)} ${f(y - r * 0.07)} ${f(x + r)} ${y}C${f(x + r * 0.28)} ${f(y + r * 0.07)} ${f(x + r * 0.07)} ${f(y + r * 0.28)} ${x} ${f(y + r)}C${f(x - r * 0.07)} ${f(y + r * 0.28)} ${f(x - r * 0.28)} ${f(y + r * 0.07)} ${f(x - r)} ${y}C${f(x - r * 0.28)} ${f(y - r * 0.07)} ${f(x - r * 0.07)} ${f(y - r * 0.28)} ${x} ${f(y - r)}Z"/>`;

export const line = (d: string, stroke = C, w = 1.4) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const shape = (d: string, fill: string, extra = "") => `<path d="${d}" fill="${fill}" ${extra}/>`;

export const dot = (x: number, y: number, r: number, fill = G) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}"/>`;

export const ring = (x: number, y: number, r: number, stroke = G, w = 1.4) =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${w}"/>`;

/** a soft round cloud of three puffs */
export const cloud = (x: number, y: number, s = 1, fill = C) =>
  `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}"><circle cx="-10" cy="2" r="8"/><circle cx="2" cy="-3" r="11"/><circle cx="13" cy="3" r="7"/><rect x="-10" y="2" width="23" height="8" rx="4"/></g>`;

/** an ear of wheat, from its foot (x, y), h tall, leaning by deg */
export const wheat = (x: number, y: number, h: number, deg = 0) => {
  const grains = Array.from({ length: 6 }, (_, i) => {
    const gy = -h + 4 + i * 5.5;
    return `<ellipse cx="-2.6" cy="${gy}" rx="2" ry="4" transform="rotate(-24 -2.6 ${gy})"/><ellipse cx="2.6" cy="${gy + 2}" rx="2" ry="4" transform="rotate(24 2.6 ${gy + 2})"/>`;
  }).join("");
  return `<g transform="translate(${x} ${y}) rotate(${deg})"><path d="M0 0V${-h + 6}" stroke="${G}" stroke-width="1.4"/><g fill="${G}">${grains}</g></g>`;
};

/** a goblet standing at (x, y) = foot centre */
export const goblet = (x: number, y: number, s = 1, fill = G, deg = 0) =>
  `<g transform="translate(${x} ${y}) rotate(${deg}) scale(${s})" fill="${fill}"><path d="M-9 -26H9Q9 -12 1 -10V-3H5V0H-5V-3H-1V-10Q-9 -12 -9 -26Z"/></g>`;

/** a chain of oval links from a to b */
export const chain = (x1: number, y1: number, x2: number, y2: number, n = 7, stroke = C) => {
  const a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    return `<ellipse cx="${f(x1 + (x2 - x1) * t)}" cy="${f(y1 + (y2 - y1) * t)}" rx="4.2" ry="2.4" fill="none" stroke="${stroke}" stroke-width="1.3" transform="rotate(${f(a + (i % 2 ? 0 : 0))} ${f(x1 + (x2 - x1) * t)} ${f(y1 + (y2 - y1) * t)})"/>`;
  }).join("");
};

/** a small five-petal flower */
export const flower = (x: number, y: number, r = 5, fill = P, heart = G) =>
  `<g transform="translate(${x} ${y})" fill="${fill}">${Array.from({ length: 5 }, (_, i) => `<ellipse cy="${-r * 0.8}" rx="${r * 0.55}" ry="${r * 0.85}" transform="rotate(${i * 72})"/>`).join("")}<circle r="${r * 0.4}" fill="${heart}"/></g>`;

/** a leaf, tip pointing along deg */
export const leaf = (x: number, y: number, len = 10, deg = 0, fill = GR) =>
  `<path d="M0 0Q${len * 0.5} ${-len * 0.32} ${len} 0Q${len * 0.5} ${len * 0.32} 0 0Z" fill="${fill}" transform="translate(${x} ${y}) rotate(${deg})"/>`;

/** a lemniscate, the sign of infinity */
export const infinity = (x: number, y: number, w = 14, stroke = G) =>
  line(`M${x} ${y}C${x - w * 0.4} ${y - w * 0.6} ${x - w} ${y - w * 0.6} ${x - w} ${y}C${x - w} ${y + w * 0.6} ${x - w * 0.4} ${y + w * 0.6} ${x} ${y}C${x + w * 0.4} ${y - w * 0.6} ${x + w} ${y - w * 0.6} ${x + w} ${y}C${x + w} ${y + w * 0.6} ${x + w * 0.4} ${y + w * 0.6} ${x} ${y}Z`, stroke, 2);

/** gentle water lines across the bottom */
export const waves = (y: number, rows = 3, stroke = C) =>
  Array.from({ length: rows }, (_, i) => {
    const yy = y + i * 9;
    const x0 = 44 + (i % 2) * 8;
    return line(`M${x0} ${yy}q8 -5 16 0t16 0t16 0t16 0t16 0t16 0t16 0t16 0`, stroke, 1);
  }).join("");

/** ground: a soft green hill across the arch floor */
export const hill = (y = 296, fill = GR) => `<path d="M40 ${y}Q110 ${y - 14} 180 ${y}V320H40Z" fill="${fill}"/>`;

/** points on a circle, for crowns of stars and wheels */
export const around = (cx: number, cy: number, r: number, from: number, to: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = ((from + ((to - from) * i) / (n - 1)) * Math.PI) / 180;
    return [f(cx + r * Math.cos(a)), f(cy + r * Math.sin(a))] as const;
  });
