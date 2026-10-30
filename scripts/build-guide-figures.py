"""Right-size the commissioned Nong Plub poses for the page guide band.

The originals are 480-640px wide, up to 252KB. The guide shows a figure ~130px
tall, so each is cropped to the drawing's own alpha box and resized to 2x that
height. Source art is untouched; this only writes derivatives to
public/nong-plub/guide/. Re-run if a pose is re-commissioned:
    python3 scripts/build-guide-figures.py
"""
from PIL import Image
import os
SRC = "public/nong-plub"
OUT = "public/nong-plub/guide"
POSES = ["urban", "heritage", "temple", "cafe", "nature", "welcome", "explain"]
HEIGHT = 300
os.makedirs(OUT, exist_ok=True)
for pose in POSES:
    im = Image.open(f"{SRC}/nong-plub-{pose}-crayon.webp").convert("RGBA")
    box = im.split()[-1].getbbox()
    im = im.crop(box)
    w = round(im.width * HEIGHT / im.height)
    im = im.resize((w, HEIGHT), Image.LANCZOS)
    path = f"{OUT}/nong-plub-{pose}.webp"
    im.save(path, "WEBP", quality=82, method=6)
    print(f"{pose:9} {w}x{HEIGHT}  {os.path.getsize(path)//1024} KB")
