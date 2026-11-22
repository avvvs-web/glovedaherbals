"""Encode the approved film's frames (v7) as scroll image sequences.

Source frames (read only): motion/Gloveda/build/final_film/v7/frames/00000.png .. 00592.png
Output: public/seq/film/{lg,sm}/0000.{avif,webp} .. 0592 (the whole film, keyline and logo included).
lg = 1920x1080, the film's native size (desktop); sm = 1280x720 (phones and small windows).
"""
import os
import sys
from concurrent.futures import ProcessPoolExecutor

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "..", "motion", "Gloveda", "build", "final_film", "v7", "frames")
OUT = os.path.join(ROOT, "public", "seq")
# lg = the film's native 1920x1080 (desktop); sm = 1280x720 (phones and small windows).
SIZES = {"lg": ((1920, 1080), 70, 84), "sm": ((1280, 720), 64, 80)}


def job(f):
    im = Image.open(os.path.join(SRC, f"{f:05d}.png")).convert("RGB")
    for key, (size, avif_q, webp_q) in SIZES.items():
        d = os.path.join(OUT, "film", key)
        os.makedirs(d, exist_ok=True)
        r = im if im.size == size else im.resize(size, Image.LANCZOS)
        r.save(os.path.join(d, f"{f:04d}.avif"), quality=avif_q, speed=6)
        r.save(os.path.join(d, f"{f:04d}.webp"), quality=webp_q, method=4)
    return f


if __name__ == "__main__":
    frames = range(0, 593)
    with ProcessPoolExecutor(max_workers=max(1, (os.cpu_count() or 4) - 2)) as ex:
        for i, f in enumerate(ex.map(job, frames, chunksize=8)):
            if i % 50 == 0:
                print("frame", f, flush=True)
    print("SEQUENCE_DONE", flush=True)
    sys.exit(0)
