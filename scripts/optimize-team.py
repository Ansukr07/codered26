"""Create display-sized team portraits without changing source photos."""

from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "team"
OUTPUT = SOURCE / "responsive"
OUTPUT.mkdir(exist_ok=True)

for source in sorted(SOURCE.iterdir()):
    if source.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp"}:
        continue
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        for width in (400, 800):
            resized = image.copy()
            resized.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
            destination = OUTPUT / f"{source.name}-{width}.webp"
            resized.save(destination, "WEBP", quality=78, method=6)
            print(f"{destination.relative_to(ROOT)}: {destination.stat().st_size:,} bytes")
