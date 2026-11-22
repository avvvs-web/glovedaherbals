#!/usr/bin/env bash
# Web encodes of the approved hero film (v7) for the homepage.
# Source files are read only. Every ffmpeg job goes through the film's gpu_run lock.
set -euo pipefail
G=/c/Users/arjun/Downloads/gloveda-web/motion/Gloveda
SRC="$G/out/film/gloveda_hero_v7.mp4"
FR="$G/build/final_film/v7/frames"
OUT=/c/Users/arjun/Downloads/gloveda-web/site/public/media
RUN="python $G/build/tools/gpu_run.py"
mkdir -p "$OUT"

$RUN --id web_hero_1080 --tool ffmpeg --segment "web hero 1080 h264" --out-dir "$OUT" -- \
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -an -c:v libx264 -preset slow -crf 20 -profile:v high \
  -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "$OUT/hero-1080.mp4"

$RUN --id web_hero_720 --tool ffmpeg --segment "web hero 720 h264" --out-dir "$OUT" -- \
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -an -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -crf 21 \
  -profile:v high -pix_fmt yuv420p -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "$OUT/hero-720.mp4"

$RUN --id web_hero_av1 --tool ffmpeg --segment "web hero 1080 av1" --out-dir "$OUT" -- \
  ffmpeg -y -hide_banner -loglevel error -i "$SRC" -an -c:v libsvtav1 -preset 5 -crf 32 -pix_fmt yuv420p10le \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -movflags +faststart "$OUT/hero-1080-av1.mp4"

# Stills: f592 (final keyline frame, the poster) and f510 (the line-up, for OG + products).
python - "$FR" "$OUT" <<'EOF'
import sys
from PIL import Image
fr, out = sys.argv[1], sys.argv[2]
for f, name in ((592, 'poster'), (510, 'lineup')):
    im = Image.open(f"{fr}/{f:05d}.png").convert('RGB')
    for w in (1920, 960):
        r = im if w == 1920 else im.resize((w, w * 9 // 16), Image.LANCZOS)
        r.save(f"{out}/{name}-{w}.avif", quality=62)
        r.save(f"{out}/{name}-{w}.webp", quality=82, method=6)
        r.save(f"{out}/{name}-{w}.jpg", quality=84, optimize=True, progressive=True)
# OG 1200x630 from the line-up: centre crop of 1920x1008 then resize.
im = Image.open(f"{fr}/00510.png").convert('RGB')
top = (1080 - 1008) // 2
im.crop((0, top, 1920, top + 1008)).resize((1200, 630), Image.LANCZOS).save(f"{out}/og-1200x630.jpg", quality=88, optimize=True)
print('stills ok')
EOF
ls -la "$OUT"
