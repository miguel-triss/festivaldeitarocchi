"""Paper grain and torn edges, taken from design/moodboard.jpg.

1. Grain: the grey fibre paper under the "Un festival..." note is the only
   patch in the moodboard with visible fibres. It is high-passed (lighting
   removed), upscaled, mirrored into a seamless tile and saved as a neutral
   grey WebP, used as a multiply/overlay layer over any palette colour.
2. Torn edges: the right and bottom edges of the navy logo panel and the
   bottom edge of the infographic header are scanned column by column and
   saved as normalised profiles (0..1) in src/data/torn-edges.json. The
   TornEdge component turns them into SVG clip paths.

Run: python3 tools/extract-paper.py
"""
import json
import os
import numpy as np
from PIL import Image, ImageFilter
from scipy.ndimage import median_filter, gaussian_filter1d

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mood = Image.open(os.path.join(ROOT, "design/moodboard.jpg")).convert("RGB")
info = Image.open(os.path.join(ROOT, "design/presentazione-infografica.jpg")).convert("RGB")

# ---- grain tile ------------------------------------------------------------
patch = mood.crop((507, 272, 555, 334)).convert("L")  # grey fibre paper, no leaf
g = np.asarray(patch, float)
low = np.asarray(patch.filter(ImageFilter.GaussianBlur(6)), float)
hp = g - low  # fibres only, lighting removed
hp = (hp - hp.mean()) / (hp.std() + 1e-6)
# Stochastic tiling: scatter rotated/flipped fragments of the patch, soft
# edged, on a wrapping canvas. No visible repeat, no mirror symmetry.
rng = np.random.default_rng(7)
N, F = 256, 40  # canvas size, fragment size (source px, upscaled x2 later)
acc = np.zeros((N, N)); wsum = np.zeros((N, N)) + 1e-6
yy, xx = np.mgrid[0:F, 0:F]
win = np.sin(np.pi * (yy + .5) / F) * np.sin(np.pi * (xx + .5) / F)
for _ in range(420):
    sy = rng.integers(0, hp.shape[0] - F); sx = rng.integers(0, hp.shape[1] - F)
    frag = np.rot90(hp[sy:sy + F, sx:sx + F], rng.integers(0, 4))
    if rng.random() < .5:
        frag = frag[:, ::-1]
    y0, x0 = rng.integers(0, N, 2)
    iy = (np.arange(F) + y0) % N; ix = (np.arange(F) + x0) % N
    acc[np.ix_(iy, ix)] += frag * win; wsum[np.ix_(iy, ix)] += win
t = acc / wsum
t = (t - t.mean()) / (t.std() + 1e-6)
tile = Image.fromarray(np.clip(128 + t * 24, 0, 255).astype(np.uint8))
tile = tile.resize((512, 512), Image.BICUBIC)
os.makedirs(os.path.join(ROOT, "public/textures"), exist_ok=True)
tile.save(os.path.join(ROOT, "public/textures/paper-grain.webp"), quality=70)
print("grain", tile.size)

# ---- torn edge profiles ---------------------------------------------------
def profile(img, axis, fixed_range, scan_range, thresh, invert=False):
    L = np.asarray(img.convert("L"), float)
    out = []
    for i in range(*fixed_range):
        line = L[scan_range[0]:scan_range[1], i] if axis == "col" else L[i, scan_range[0]:scan_range[1]]
        hit = np.where(line > thresh)[0]
        if not len(hit):
            out.append(len(line)); continue
        j = hit[0]
        # sub-pixel: where the luminance ramp crosses the threshold
        if j > 0:
            a0, a1 = line[j - 1], line[j]
            out.append(j - 1 + (thresh - a0) / max(a1 - a0, 1e-6))
        else:
            out.append(float(j))
    p = gaussian_filter1d(median_filter(np.array(out, float), 5), 1.2)
    lo, hi = np.percentile(p, [2, 98])  # robust: stray stars and glyphs are ignored
    p = np.clip((p - lo) / (hi - lo + 1e-6), 0, 1)
    return [round(float(v), 3) for v in (1 - p if invert else p)]

edges = {
    # bottom of navy logo panel, moodboard: 500 samples
    "moodboard-bottom": profile(mood, "col", (0, 505), (352, 400), 120),
    # right side of navy logo panel, rotated into a horizontal profile
    "moodboard-right": profile(mood, "row", (0, 345), (440, 600), 120),
    # bottom of infographic header, only the paper part (sun area excluded)
    "header-bottom": profile(info, "col", (95, 330), (175, 230), 140),
}
os.makedirs(os.path.join(ROOT, "src/data"), exist_ok=True)
with open(os.path.join(ROOT, "src/data/torn-edges.json"), "w") as f:
    json.dump(edges, f)
print({k: len(v) for k, v in edges.items()})

# ---- ink mask: same fibres, thresholded, for stamps and printed ink --------
g = np.asarray(tile, float)
alpha = np.clip((g - 88) * 6, 0, 255).astype(np.uint8)  # ~12% of the ink drops out
ink = Image.merge("RGBA", [Image.new("L", tile.size, 0)] * 3 + [Image.fromarray(alpha)])
ink.save(os.path.join(ROOT, "public/textures/ink-mask.webp"), quality=80)
print("ink coverage", round((alpha > 128).mean(), 2))
