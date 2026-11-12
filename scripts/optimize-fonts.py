"""Create WOFF2 copies of the fonts used by the site.

Requires: python -m pip install fonttools brotli
"""

from pathlib import Path
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / "public" / "fonts" / "grotesk"
SOURCES = [
    *sorted(FONTS.glob("LilGrotesk-*.otf")),
    ROOT / "public" / "codered2026" / "codered2026" / "fonts" / "EleganceNaturalValentine-Regular-BF6aae9cc2e2258.ttf",
    ROOT / "public" / "codered2026" / "codered2026" / "fonts" / "Vivaldi Regular.ttf",
]

for source in SOURCES:
    font = TTFont(source)
    font.flavor = "woff2"
    destination = source.with_suffix(".woff2")
    font.save(destination)
    print(f"{destination.relative_to(ROOT)}: {source.stat().st_size:,} -> {destination.stat().st_size:,} bytes")
