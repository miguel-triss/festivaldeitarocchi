// Botanicals in the spirit of the infographic's borders: branches, cosmos,
// lavender, dried ears, ferns, dried flower heads. Each generator draws one
// plant standing on (0, 0) and growing up (negative y), about `h` tall, with
// a seeded wobble so no two stems are identical, as if drawn by hand.

const GREEN = "var(--c-green)";
const GREEN_L = "color-mix(in oklab, var(--c-green) 72%, var(--c-cream))";
const GREEN_D = "color-mix(in oklab, var(--c-green) 80%, var(--c-night-deep))";
const PINK = "var(--c-pink)";
const MAGENTA = "var(--c-magenta)";
const VIOLET = "var(--c-violet)";
const GOLD = "var(--c-gold)";
const TERRA = "var(--c-terra)";
const CREAM = "var(--c-cream)";

export type Kind = "ramo" | "cosmo" | "lavanda" | "spiga" | "felce" | "secco";

const f = (n: number) => +n.toFixed(1);

function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

/** a gently curving stem: returns the path and a point/tangent sampler */
function stem(h: number, bend: number, r: () => number) {
  const c1x = bend * 0.4 + (r() - 0.5) * 10, c2x = bend * 0.9 + (r() - 0.5) * 12;
  const p0 = [0, 0], p1 = [c1x, -h * 0.35], p2 = [c2x, -h * 0.7], p3 = [bend, -h];
  const at = (t: number) => {
    const u = 1 - t;
    const x = u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0];
    const y = u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1];
    const dx = 3 * u * u * (p1[0] - p0[0]) + 6 * u * t * (p2[0] - p1[0]) + 3 * t * t * (p3[0] - p2[0]);
    const dy = 3 * u * u * (p1[1] - p0[1]) + 6 * u * t * (p2[1] - p1[1]) + 3 * t * t * (p3[1] - p2[1]);
    return { x, y, a: (Math.atan2(dy, dx) * 180) / Math.PI };
  };
  const d = `M0 0C${f(p1[0])} ${f(p1[1])} ${f(p2[0])} ${f(p2[1])} ${f(p3[0])} ${f(p3[1])}`;
  return { d, at };
}

const leaf = (x: number, y: number, len: number, w: number, deg: number, fill: string, vein = true) =>
  `<g transform="translate(${f(x)} ${f(y)}) rotate(${f(deg)})"><path d="M0 0C${f(len * 0.3)} ${f(-w)} ${f(len * 0.75)} ${f(-w * 0.9)} ${f(len)} 0C${f(len * 0.75)} ${f(w * 0.8)} ${f(len * 0.3)} ${f(w)} 0 0Z" fill="${fill}"/>${
    vein ? `<path d="M${f(len * 0.08)} 0Q${f(len * 0.5)} ${f(-w * 0.12)} ${f(len * 0.92)} 0" fill="none" stroke="${CREAM}" stroke-width=".7" opacity=".45"/>` : ""
  }</g>`;

const line = (d: string, stroke: string, w: number) =>
  `<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round"/>`;

function ramo(h: number, bend: number, r: () => number) {
  const s = stem(h, bend, r);
  let out = line(s.d, GREEN_D, 2.2);
  const n = 7 + Math.floor(r() * 3);
  for (let i = 0; i < n; i++) {
    const t = 0.16 + (i / n) * 0.8;
    const p = s.at(t);
    const side = i % 2 ? 1 : -1;
    const len = 30 + r() * 16 - t * 8;
    out += leaf(p.x, p.y, len, 8 + r() * 4, p.a + side * (48 + r() * 18), i % 3 ? GREEN : GREEN_L);
  }
  const tip = s.at(1);
  out += leaf(tip.x, tip.y, 28, 7, tip.a, GREEN_L);
  return out;
}

function flowerHead(x: number, y: number, R: number, petal: string, heart: string, r: () => number) {
  let petals = "";
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * 360 + r() * 8;
    petals += `<path d="M0 0C${f(R * 0.35)} ${f(-R * 0.3)} ${f(R * 0.3)} ${f(-R)} 0 ${f(-R * 1.02)}C${f(-R * 0.3)} ${f(-R)} ${f(-R * 0.35)} ${f(-R * 0.3)} 0 0Z" fill="${petal}" transform="rotate(${f(a)})"/>`;
  }
  return `<g transform="translate(${f(x)} ${f(y)})">${petals}<circle r="${f(R * 0.3)}" fill="${heart}"/><circle r="${f(R * 0.14)}" fill="${TERRA}"/></g>`;
}

function cosmo(h: number, bend: number, r: () => number) {
  const s = stem(h, bend, r);
  let out = line(s.d, GREEN_D, 1.8);
  for (let i = 0; i < 4; i++) {
    const p = s.at(0.15 + i * 0.17);
    const side = i % 2 ? 1 : -1;
    const a = ((p.a + side * 55) * Math.PI) / 180;
    const L = 30 + r() * 12;
    const ex = p.x + Math.cos(a) * L, ey = p.y + Math.sin(a) * L;
    out += line(`M${f(p.x)} ${f(p.y)}Q${f((p.x + ex) / 2 + side * 4)} ${f((p.y + ey) / 2 - 4)} ${f(ex)} ${f(ey)}`, GREEN, 1.5);
    out += line(`M${f((p.x + ex) / 2)} ${f((p.y + ey) / 2)}l${f(side * 10)} ${f(-8)}`, GREEN, 1.2);
  }
  const b = s.at(0.6);
  const bx = b.x + (bend >= 0 ? -34 : 34), by = b.y - 40;
  out += line(`M${f(b.x)} ${f(b.y)}Q${f((b.x + bx) / 2)} ${f(by + 18)} ${f(bx)} ${f(by)}`, GREEN_D, 1.4);
  out += `<ellipse cx="${f(bx)}" cy="${f(by - 5)}" rx="4.5" ry="7" fill="${MAGENTA}"/>`;
  const top = s.at(1);
  out += flowerHead(top.x, top.y, 17 + r() * 5, r() > 0.4 ? PINK : MAGENTA, GOLD, r);
  return out;
}

function lavanda(h: number, bend: number, r: () => number) {
  let out = "";
  for (let k = 0; k < 3; k++) {
    const hh = h * (0.78 + r() * 0.26), bb = bend + (k - 1) * 12;
    const s = stem(hh, bb, r);
    out += line(s.d, GREEN, 1.4);
    for (let i = 0; i < 9; i++) {
      const p = s.at(0.58 + i * 0.047);
      out += `<ellipse cx="${f(p.x - 3)}" cy="${f(p.y)}" rx="2.6" ry="4.6" fill="${VIOLET}" transform="rotate(-25 ${f(p.x - 3)} ${f(p.y)})"/>`;
      out += `<ellipse cx="${f(p.x + 3)}" cy="${f(p.y - 2)}" rx="2.6" ry="4.6" fill="${i % 3 ? VIOLET : MAGENTA}" transform="rotate(25 ${f(p.x + 3)} ${f(p.y - 2)})"/>`;
    }
    const lf = s.at(0.2);
    out += leaf(lf.x, lf.y, 26, 4, lf.a + (k % 2 ? 60 : -60), GREEN_L, false);
  }
  return out;
}

function spiga(h: number, bend: number, r: () => number) {
  const s = stem(h, bend, r);
  let out = line(s.d, GOLD, 1.6);
  for (let i = 0; i < 9; i++) {
    const p = s.at(0.62 + i * 0.04);
    for (const side of [-1, 1]) {
      const ex = p.x + side * 5, ey = p.y - 2;
      out += `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="3" ry="6" fill="${i % 2 ? GOLD : TERRA}" transform="rotate(${f(p.a + 90 + side * 28)} ${f(ex)} ${f(ey)})"/>`;
      out += line(`M${f(ex)} ${f(ey - 5)}l${f(side * 7)} -12`, GOLD, 0.7);
    }
  }
  const lf = s.at(0.3);
  out += leaf(lf.x, lf.y, 40, 4, lf.a - 20, GOLD, false);
  return out;
}

function felce(h: number, bend: number, r: () => number) {
  const s = stem(h, bend, r);
  let out = line(s.d, GREEN_D, 1.6);
  const n = 12;
  for (let i = 0; i < n; i++) {
    const t = 0.1 + (i / n) * 0.86;
    const p = s.at(t);
    const len = 26 * (1 - t) + 7;
    out += leaf(p.x, p.y, len, 4.5, p.a - 70, i % 2 ? GREEN : GREEN_L, false);
    out += leaf(p.x, p.y, len, 4.5, p.a + 70, i % 2 ? GREEN_L : GREEN, false);
  }
  return out;
}

function secco(h: number, bend: number, r: () => number) {
  const main = stem(h, bend, r);
  let out = line(main.d, TERRA, 1.3);
  const top = main.at(1);
  const heads: [number, number][] = [[top.x, top.y]];
  for (let i = 0; i < 3; i++) {
    const p = main.at(0.45 + i * 0.16);
    const side = i % 2 ? 1 : -1;
    const ex = p.x + side * (20 + r() * 14), ey = p.y - 26 - r() * 16;
    out += line(`M${f(p.x)} ${f(p.y)}Q${f(p.x + side * 4)} ${f(ey + 10)} ${f(ex)} ${f(ey)}`, TERRA, 1);
    heads.push([ex, ey]);
  }
  heads.forEach(([x, y], i) => {
    out += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(5 + r() * 2.5)}" fill="${i % 2 ? GOLD : TERRA}"/>`;
    for (let k = 0; k < 6; k++) {
      const a = (k / 6) * Math.PI * 2;
      out += `<circle cx="${f(x + Math.cos(a) * 4)}" cy="${f(y + Math.sin(a) * 4)}" r="1" fill="${CREAM}" opacity=".7"/>`;
    }
  });
  return out;
}

const gens = { ramo, cosmo, lavanda, spiga, felce, secco };

export function plant(kind: Kind, h = 220, bend = 0, seed = 1) {
  return gens[kind](h, bend, rng(seed * 9973 + kind.length * 31));
}
