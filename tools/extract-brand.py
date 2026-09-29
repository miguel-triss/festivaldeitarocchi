"""Extract the wordmark and the sun from design/*.jpg and trace them to SVG.

Sources are small (the sun is ~180 px wide), so each crop is upscaled 6x,
turned into a soft mask, sharpened with a threshold and traced with marching
squares. Result: vector paths that stay crisp at hero size.

Run: python3 tools/extract-brand.py
Outputs: src/assets/brand/*.svg and assets/extracted/*.png (previews)
"""
import os
import numpy as np
from PIL import Image, ImageFilter
from skimage import measure

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "src", "assets", "brand")
PREV = os.path.join(ROOT, "assets", "extracted")
os.makedirs(OUT, exist_ok=True)
os.makedirs(PREV, exist_ok=True)

NAVY = np.array([26, 28, 50], dtype=float)
UP = 6


def load(path, box):
    im = Image.open(os.path.join(ROOT, path)).convert("RGB").crop(box)
    w, h = im.size
    return im.resize((w * UP, h * UP), Image.LANCZOS)


def smooth(a, lo, hi):
    return np.clip((a - lo) / (hi - lo), 0, 1)


def trace(mask, tol=1.1, level=0.5):
    """mask: float 0..1. Returns SVG path data (even-odd) in mask pixel space / UP."""
    m = np.pad(mask, 2)
    paths = []
    for c in measure.find_contours(m, level):
        if len(c) < 12:
            continue
        c = measure.approximate_polygon(c, tol)
        pts = [(x - 2, y - 2) for y, x in c]
        d = "M" + " L".join(f"{x / UP:.2f} {y / UP:.2f}" for x, y in pts) + "Z"
        paths.append(d)
    return " ".join(paths)


def save_svg(name, d, w, h, fill):
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w / UP:.2f} {h / UP:.2f}">'
        f'<path fill="{fill}" fill-rule="evenodd" d="{d}"/></svg>'
    )
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg)
    print(name, len(svg) // 1024, "KB")


def preview(name, mask, color):
    h, w = mask.shape
    rgba = np.zeros((h, w, 4), dtype=np.uint8)
    rgba[..., :3] = color
    rgba[..., 3] = (mask * 255).astype(np.uint8)
    Image.fromarray(rgba).resize((w // 3, h // 3), Image.LANCZOS).save(os.path.join(PREV, name))


# ---- Sun (moodboard, logo panel) -----------------------------------------
im = load("design/moodboard.jpg", (205, 14, 378, 158))
a = np.asarray(im, dtype=float)
dist = np.linalg.norm(a - NAVY, axis=2)
# gold vs navy: also require warmth so cream specks and paper edges are ignored
warm = (a[..., 0] - a[..., 2]) > 40
mask = smooth(dist, 55, 95) * warm
mask = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(UP * 0.5))) / 255.0
# keep only the biggest connected blob cluster around the face, drop free stars
from scipy import ndimage as ndi
lab, n = ndi.label(mask > 0.5)
sizes = ndi.sum(mask > 0.5, lab, range(1, n + 1))
keep = np.zeros_like(mask)
big = 1 + int(np.argmax(sizes))
keep[lab == big] = 1
# rays are separate blobs touching the disc in the source; keep every blob within radius
cy, cx = ndi.center_of_mass(lab == big)
for i in range(1, n + 1):
    if i == big:
        continue
    y, x = ndi.center_of_mass(lab == i)
    if np.hypot(y - cy, x - cx) < 82 * UP and sizes[i - 1] > 40 * UP:
        keep[lab == i] = 1
mask = mask * (ndi.binary_dilation(keep, iterations=3))
save_svg("sun.svg", trace(mask), *im.size, "#D8851D")
preview("sun.png", mask, (216, 133, 29))

# ---- Wordmark "FESTIVAL DEI TAROCCHI" (infographic header) ----------------
im = load("design/presentazione-infografica.jpg", (84, 50, 338, 134))
a = np.asarray(im, dtype=float)
lum = a @ np.array([0.299, 0.587, 0.114])
gold = (a[..., 0] - a[..., 2]) > 85
mask = smooth(lum, 105, 175) * (~gold)
mask = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(UP * 0.45))) / 255.0
lab, n = ndi.label(mask > 0.5)
sizes = ndi.sum(mask > 0.5, lab, range(1, n + 1))
ok = np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 90 * UP])
mask = mask * ndi.binary_dilation(ok, iterations=3)
# split into the two lines so each can be revealed on its own
m = np.pad(mask, 2)
lines = {0: [], 1: []}
for c in measure.find_contours(m, 0.5):
    if len(c) < 12:
        continue
    c = measure.approximate_polygon(c, 1.1)
    row = 0 if c[:, 0].mean() < m.shape[0] * 0.5 else 1
    lines[row].append("M" + " L".join(f"{x - 2:.0f} {y - 2:.0f}".replace(" ", " ") for y, x in c) + "Z")
W, H = im.size
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">'
       + "".join(f'<path class="wm-line wm-line-{k + 1}" fill-rule="evenodd" d="{" ".join(v)}"/>' for k, v in lines.items())
       + "</svg>")
open(os.path.join(OUT, "wordmark.svg"), "w").write(svg)
print("wordmark.svg", len(svg) // 1024, "KB")
preview("wordmark.png", mask, (243, 223, 198))

# ---- Sun face (infographic header: larger, sharper face lines) ------------
# Disc found with a distance transform on the gold mask (see notes in README).
FX, FY, FR = 431, 80, 44  # disc centre and radius in the infographic
im = load("design/presentazione-infografica.jpg", (FX - FR, FY - FR, FX + FR, FY + FR))
a = np.asarray(im, dtype=float)
lum = a @ np.array([0.299, 0.587, 0.114])
ink = smooth(-lum, -120, -60)  # dark lines
lips = ((a[..., 0] - a[..., 1]) > 45) & ((a[..., 0] - a[..., 2]) > 30) & (lum < 150)
yy, xx = np.mgrid[0:a.shape[0], 0:a.shape[1]]
inside = np.hypot(yy - FR * UP, xx - FR * UP) < FR * UP * 0.9
ink = ink * inside
ink = np.asarray(Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(UP * 0.35))) / 255.0
lab, n = ndi.label(ink > 0.5)
sizes = ndi.sum(ink > 0.5, lab, range(1, n + 1))
ink = ink * ndi.binary_dilation(np.isin(lab, [i + 1 for i, s in enumerate(sizes) if s > 12 * UP * UP]), iterations=2)
lipmask = np.asarray(Image.fromarray((lips * inside * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(UP * 0.5))) / 255.0


def unit_trace(mask):
    # normalise to a disc of radius 100 centred on 0,0
    m = np.pad(mask, 2)
    out = []
    for c in measure.find_contours(m, 0.5):
        if len(c) < 10:
            continue
        c = measure.approximate_polygon(c, 0.9)
        pts = [((x - 2) / (FR * UP) * 100 - 100, (y - 2) / (FR * UP) * 100 - 100) for y, x in c]
        out.append("M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z")
    return " ".join(out)


face = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">'
    f'<path class="sun-lips" fill="#B23556" d="{unit_trace(lipmask)}"/>'
    f'<path class="sun-lines" fill="#181B2E" fill-rule="evenodd" d="{unit_trace(ink)}"/>'
    "</svg>"
)
open(os.path.join(OUT, "sun-face.svg"), "w").write(face)
print("sun-face.svg", len(face) // 1024, "KB")
preview("sun-face.png", ink, (24, 27, 46))
