#!/usr/bin/env python3
"""
Konnect Services – image optimiser (optional maintenance tool, not needed to run the site).

Turns a source photo into responsive AVIF + WebP files and prints the matching
<picture> markup. Requires Python 3.9+ and Pillow 11.2+ (pip install pillow).

Usage:
  python3 tools/optimise-images.py _source-images/my-photo.jpg projects my-photo
      -> writes assets/img/projects/my-photo-{480,800,...}.{avif,webp}
  python3 tools/optimise-images.py --all      (rebuild everything listed in MANIFEST)
"""
import json, sys, os
from concurrent.futures import ProcessPoolExecutor
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "_source-images")
OUT = os.path.join(ROOT, "assets", "img")
STEPS = (480, 800, 1200, 1600, 2000)
AVIF_Q, WEBP_Q = 52, 74

# group -> list of (output name, source file, options)
MANIFEST = {
  "projects": [
    ("clarendon-fitness", "clarendon-fitness.webp", {"upscale": 2}),
    ("clarendon-gym", "clarendon-gym.webp", {"upscale": 2}),
    ("clarendon-treatment", "clarendon-treatment.webp", {"upscale": 2}),
    ("clarendon-pool", "clarendon-pool.webp", {"upscale": 2}),
    ("clarendon-lounge", "clarendon-lounge.webp", {"upscale": 2}),
    ("clarendon-washrooms", "clarendon-washrooms.webp", {"upscale": 2}),
    ("nw-exterior", "nw-exterior.webp", {}), ("nw-kitchen", "nw-kitchen.webp", {}),
    ("nw-loft", "nw-loft.webp", {}), ("nw-office", "nw-office.webp", {}),
    ("nw-office-2", "nw-office-2.webp", {}), ("nw-glass-roof", "nw-glass-roof.webp", {}),
    ("abbey-warehouse", "abbey-warehouse.webp", {}), ("abbey-exterior", "abbey-exterior.webp", {}),
    ("abbey-office", "abbey-office.webp", {}), ("abbey-mezzanine", "abbey-mezzanine.webp", {}),
    ("abbey-office-2", "abbey-office-2.webp", {}),
    ("rushworth-facade", "rushworth-facade.webp", {}), ("rushworth-exterior", "rushworth-exterior.webp", {}),
    ("rushworth-office", "rushworth-office.webp", {}), ("rushworth-open-office", "rushworth-open-office.webp", {}),
    ("rushworth-services", "rushworth-services.webp", {}), ("rushworth-atrium", "rushworth-atrium.webp", {}),
    ("rushworth-internal", "rushworth-internal.webp", {}), ("rushworth-electrical", "rushworth-electrical.webp", {}),
    ("rushworth-rooftop-pv", "rushworth-rooftop-pv.webp", {}),
    ("rushworth-terrace-entrance", "rushworth-terrace-entrance.webp", {}),
    ("rushworth-terrace", "rushworth-terrace.webp", {}), ("rushworth-plant", "rushworth-plant.webp", {}),
    ("rushworth-mechanical", "rushworth-mechanical.webp", {}),
  ],
  "services": [
    ("switchroom", "stock-switchroom.webp", {"crop": (0, 0.18, 1, 0.80)}),
    ("breakers", "stock-breakers.webp", {}),
    ("insulated-pipework", "stock-insulated-pipework.webp", {}),
    ("rooftop-plant", "stock-rooftop-plant.webp", {}),
    ("rooftop-solar", "stock-rooftop-solar.webp", {}), ("heat-pumps", "stock-heat-pumps.webp", {}),
  ],
  "accreditations": [
    (n, n + ".png", {"logo": True}) for n in ("pasma", "mcs", "smas", "ipaf", "niceic", "recc", "gas-safe")
  ],
}

def widths_for(w, logo=False):
    if logo:
        return [min(w, 480)]
    out = [s for s in STEPS if s < w]
    out.append(min(w, STEPS[-1]))
    return sorted(set(out))

def process(group, name, src, opts):
    im = Image.open(os.path.join(SRC, src)).convert("RGB")
    if "crop" in opts:
        x0, y0, x1, y1 = opts["crop"]; W, H = im.size
        im = im.crop((int(x0 * W), int(y0 * H), int(x1 * W), int(y1 * H)))
    if opts.get("upscale"):
        f = opts["upscale"]
        im = im.resize((im.width * f, im.height * f), Image.LANCZOS).filter(ImageFilter.UnsharpMask(1.2, 40, 2))
    os.makedirs(os.path.join(OUT, group), exist_ok=True)
    ws = widths_for(im.width, opts.get("logo"))
    avg = im.resize((1, 1), Image.BOX).getpixel((0, 0))
    for w in ws:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        base = os.path.join(OUT, group, f"{name}-{w}")
        r.save(base + ".avif", quality=AVIF_Q + (10 if opts.get("logo") else 0), speed=5)
        r.save(base + ".webp", quality=WEBP_Q + (14 if opts.get("logo") else 0), method=6)
    return {"key": f"{group}/{name}", "w": im.width, "h": im.height, "widths": ws,
            "color": "#%02x%02x%02x" % avg}

def snippet(m, alt, sizes="100vw"):
    g, n = m["key"].split("/")
    srcset = lambda ext: ", ".join(f"assets/img/{g}/{n}-{w}.{ext} {w}w" for w in m["widths"])
    mid = m["widths"][min(1, len(m["widths"]) - 1)]
    return (f'<picture>\n  <source type="image/avif" srcset="{srcset("avif")}" sizes="{sizes}">\n'
            f'  <source type="image/webp" srcset="{srcset("webp")}" sizes="{sizes}">\n'
            f'  <img src="assets/img/{g}/{n}-{mid}.webp" width="{m["w"]}" height="{m["h"]}" alt="{alt}" loading="lazy" decoding="async">\n</picture>')

if __name__ == "__main__":
    if len(sys.argv) == 4:
        src, group, name = sys.argv[1:]
        os.makedirs(SRC, exist_ok=True)
        m = process(group, name, os.path.relpath(src, SRC), {})
        print(json.dumps(m)); print(snippet(m, "DESCRIBE THE IMAGE"))
    elif sys.argv[1:] == ["--all"]:
        jobs = [(g, *item) for g, items in MANIFEST.items() for item in items]
        with ProcessPoolExecutor() as ex:
            res = list(ex.map(process, *zip(*jobs)))
        with open(os.path.join(OUT, "manifest.json"), "w") as f:
            json.dump({r["key"]: r for r in res}, f, indent=1)
        print(f"{len(res)} images processed")
    else:
        print(__doc__)
