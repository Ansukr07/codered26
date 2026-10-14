"""Create high-quality web copies of the original gallery photos."""

from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "gallery-originals"
if not SOURCE.exists():
    SOURCE = ROOT / "public" / "gallery"
OUTPUT = ROOT / "public" / "gallery" / "optimized"
OUTPUT.mkdir(exist_ok=True)

for source in sorted(SOURCE.iterdir()):
    if source.suffix.lower() not in {".heic", ".jpg", ".jpeg"}:
        continue

    with TemporaryDirectory() as temporary:
        readable = source
        if source.suffix.lower() == ".heic":
            readable = Path(temporary) / f"{source.stem}.png"
            subprocess.run(["heif-convert", str(source), str(readable)], check=True)

        with Image.open(readable) as opened:
            photo = ImageOps.exif_transpose(opened).convert("RGB")
            is_heic = source.suffix.lower() == ".heic"
            max_edge = 3600 if is_heic else 4500
            photo.thumbnail((max_edge, max_edge), Image.Resampling.LANCZOS)
            destination = OUTPUT / f"{source.stem}.webp"
            photo.save(destination, "WEBP", quality=90 if is_heic else 94, method=6)
            print(f"{source.name}: {source.stat().st_size:,} -> {destination.stat().st_size:,} bytes, {photo.width}x{photo.height}")
