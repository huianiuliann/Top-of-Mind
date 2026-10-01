# Every font file that src/index.css loads must carry the Romanian letters (a, a-breve, i-circumflex, s/t comma-below) and the
# punctuation the RO copy uses; otherwise those letters render in a fallback font. Run with PYTHONUTF8=1.
import io
import os
import re
import sys

from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
css = io.open(os.path.join(ROOT, "src", "index.css"), encoding="utf-8").read()
need = {
    "ă": 0x103, "Ă": 0x102, "â": 0xE2, "Â": 0xC2, "î": 0xEE, "Î": 0xCE,
    "ș": 0x219, "Ș": 0x218, "ț": 0x21B, "Ț": 0x21A,
    "„": 0x201E, "”": 0x201D, "—": 0x2014, "·": 0xB7,
}
files = sorted(set(re.findall(r"url\(/(assets/fonts/[^)]+\.woff2)\)", css)))
if not files:
    print("FAIL: no @font-face woff2 found in src/index.css")
    sys.exit(1)
bad = []
for rel in files:
    path = os.path.join(ROOT, "public", rel)
    if not os.path.exists(path):
        bad.append(f"{rel}: file missing in public/")
        continue
    cmap = TTFont(path).getBestCmap()
    missing = [ch for ch, cp in need.items() if cp not in cmap]
    # control: the checker must be able to see a glyph that no Latin font has
    if 0x4E2D in cmap:
        bad.append(f"{rel}: control failed (CJK glyph reported present)")
    if missing:
        bad.append(f"{rel}: missing {''.join(missing)}")
if bad:
    print("FAIL: " + "; ".join(bad))
    sys.exit(1)
print(f"ro fonts verification passed ({len(files)} font files cover ă â î ș ț)")
