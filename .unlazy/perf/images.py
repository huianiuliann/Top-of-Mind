# Founder photos for the site: every portrait as WebP at 640 px (team carousel) plus a 336 px copy for the small
# cards and avatars (112-144 CSS px). Re-run after replacing a photo in public/assets/img. Run with PYTHONUTF8=1.
from pathlib import Path

from PIL import Image

IMG = Path(__file__).resolve().parents[2] / "public" / "assets" / "img"
SOURCES = ["iulian.jpg", "iulian-duo.jpg", "sebi.webp", "sebi-duo.webp"]

for name in SOURCES:
    src = IMG / name
    stem = src.stem
    with Image.open(src) as im:
        im = im.convert("RGB")
        if src.suffix != ".webp":
            im.save(IMG / f"{stem}.webp", "WEBP", quality=80, method=6)
        im.resize((336, 336), Image.LANCZOS).save(IMG / f"{stem}-336.webp", "WEBP", quality=80, method=6)
    for out in sorted(IMG.glob(f"{stem}*.webp")):
        print(f"{out.name}: {out.stat().st_size} B")
