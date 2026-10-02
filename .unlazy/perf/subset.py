# Subsets the self-hosted fonts to the characters the site uses and drops unused variation ranges
# (Inter: 175 KB -> ~28 KB, Space Grotesk: 38 KB -> ~11 KB). Always works from the untouched originals in
# .unlazy/perf/fonts-orig/ (copied there on the first run), so it can be re-run when the copy gains new characters:
# add them to UNICODES, run, then check with .unlazy/ro-react/fontcheck.py. Run with PYTHONUTF8=1.
import shutil
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parents[2]
FONTS = ROOT / "public" / "assets" / "fonts"
ORIG = ROOT / ".unlazy" / "perf" / "fonts-orig"

# ASCII, Latin-1 (© · â î Î), Romanian ă Ă ș Ș ț Ț, typographic quotes and dashes, bullet, ellipsis, euro, trademark, arrows.
UNICODES = [*range(0x20, 0x7F), *range(0xA0, 0x100), 0x102, 0x103, 0x218, 0x219, 0x21A, 0x21B,
            0x2013, 0x2014, 0x2018, 0x2019, 0x201A, 0x201C, 0x201D, 0x201E, 0x2022, 0x2026, 0x20AC, 0x2122,
            0x2190, 0x2191, 0x2192, 0x2193]

# file -> variation axes to limit (None: keep the font's design space, only drop characters)
PLAN = {
    "inter-var.woff2": {"wght": (400, 700), "opsz": None},  # body text uses 400/600/700; opsz pinned to its default (14)
    "spacegrotesk-var.woff2": {"wght": 700},  # every font-display heading is font-bold
    "instrumentserif-400-italic.woff2": None,
    "redhatmono-400.woff2": None,
}

ORIG.mkdir(parents=True, exist_ok=True)
for name, axes in PLAN.items():
    orig = ORIG / name
    if not orig.exists():
        shutil.copy2(FONTS / name, orig)
    font = TTFont(orig, lazy=False)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = [*options.layout_features, "tnum"]
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=UNICODES)
    subsetter.subset(font)
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    font.save(FONTS / name)
    print(f"{name}: {orig.stat().st_size} -> {(FONTS / name).stat().st_size} B")
