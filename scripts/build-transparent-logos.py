#!/usr/bin/env python3
"""
Build transparent-background variants of the three institutional marks.

The marks ship as JPEGs with opaque white backgrounds. That was invisible
when they sat on their own opaque band, but inside the glass topbar the
white rectangle shows as a box floating over the hero photo.

The conversion is the standard "key out white" unpremultiply:

    m = min(r, g, b)          the white component of the pixel
    a = 255 - m               how much of it is not white
    c' = (c - (255 - a)) * 255 / a      pull the colour back out

Pixels whose alpha falls under the threshold are JPEG compression haze
around the edges, not artwork, and are dropped to fully transparent.

The Smart City emblem is not converted at all: public/logos/smart-city-thailand.png
is already RGBA with a transparent ground. It is cropped to the emblem
alone, because the full lockup's "SMARTCITY / ไทยแลนด์" wordmark is
illegible at header size — the emblem is the mark.
"""
import os
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUBLIC = os.path.join(ROOT, "public")
ALPHA_FLOOR = 18  # below this the pixel is JPEG haze, not artwork


def key_out_white(src: str, dst_png: str) -> None:
    im = Image.open(src).convert("RGB")
    px = im.load()
    out = Image.new("RGBA", im.size)
    opx = out.load()
    w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b = px[x, y]
            m = min(r, g, b)
            a = 255 - m
            if a < ALPHA_FLOOR:
                opx[x, y] = (0, 0, 0, 0)
                continue
            inv = 255 - a
            nr = max(0, min(255, round((r - inv) * 255 / a)))
            ng = max(0, min(255, round((g - inv) * 255 / a)))
            nb = max(0, min(255, round((b - inv) * 255 / a)))
            opx[x, y] = (nr, ng, nb, a)
    out.save(dst_png)
    print("  %s  %dx%d  alpha" % (os.path.basename(dst_png), w, h))


def crop_emblem(src: str, dst_png: str) -> None:
    """Cut the emblem off the top of the transparent lockup."""
    im = Image.open(src).convert("RGBA")
    w, h = im.size
    px = im.load()
    # Find the horizontal extent of the emblem: the topmost region that
    # contains opaque pixels, stopping above the wordmark.
    band_bottom = int(h * 0.66)
    xs, ys = [], []
    for y in range(0, band_bottom):
        for x in range(w):
            if px[x, y][3] > 8:
                xs.append(x)
                ys.append(y)
    if not xs:
        raise SystemExit("no opaque pixels found in " + src)
    x0, x1 = min(xs), max(xs)
    y0, y1 = min(ys), max(ys)
    pad = 4
    x0 = max(0, x0 - pad)
    y0 = max(0, y0 - pad)
    x1 = min(w - 1, x1 + pad)
    y1 = min(h - 1, y1 + pad)
    crop = im.crop((x0, y0, x1 + 1, y1 + 1))
    crop.save(dst_png)
    print("  %s  %dx%d  alpha (cropped from %dx%d)" % (
        os.path.basename(dst_png), crop.width, crop.height, w, h))


def main() -> None:
    jobs = [
        ("mdes_logo", os.path.join(PUBLIC, "mdes_logo.jpg"), "key"),
        ("depa_logo", os.path.join(PUBLIC, "depa_logo.jpg"), "key"),
        ("slic_logo", os.path.join(PUBLIC, "slic_logo.jpg"), "key"),
        ("smart_city_thailand_emblem",
         os.path.join(PUBLIC, "logos", "smart-city-thailand.png"), "crop"),
    ]
    for name, src, mode in jobs:
        if not os.path.exists(src):
            raise SystemExit("missing source: " + src)
        dst = os.path.join(PUBLIC, name + ".png")
        if mode == "key":
            key_out_white(src, dst)
        else:
            crop_emblem(src, dst)
        # WebP companion with alpha, per the site's media rule.
        im = Image.open(dst)
        im.save(os.path.join(PUBLIC, name + ".webp"), "WEBP", quality=82, method=6)
        wbp = os.path.join(PUBLIC, name + ".webp")
        print("  %s  %d bytes" % (os.path.basename(wbp), os.path.getsize(wbp)))


if __name__ == "__main__":
    main()
