"""Build responsive WebP gallery images from local originals or existing masters."""

from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[1]
ORIGINALS = ROOT / "gallery-originals"
MASTERS = ROOT / "public" / "gallery" / "optimized"
OUTPUT = ROOT / "public" / "gallery" / "responsive"
FOOTER_IMAGES = ROOT / "public" / "images"
WIDTHS = (480, 960, 1440)
QUALITY = 80
OUTPUT.mkdir(parents=True, exist_ok=True)


def render(source: Path, stem: str) -> None:
    with TemporaryDirectory() as temporary:
        readable = source
        if source.suffix.lower() == ".heic":
            readable = Path(temporary) / f"{stem}.png"
            subprocess.run(["heif-convert", str(source), str(readable)], check=True)

        with Image.open(readable) as opened:
            image = ImageOps.exif_transpose(opened).convert("RGB")
            for width in WIDTHS:
                copy = image.copy()
                copy.thumbnail((width, width * 2), Image.Resampling.LANCZOS)
                destination = OUTPUT / f"{stem}-{width}.webp"
                copy.save(destination, "WEBP", quality=QUALITY, method=6)
                print(f"{destination.relative_to(ROOT)}: {destination.stat().st_size:,} bytes")


for master in sorted(MASTERS.glob("*.webp")):
    original = next(
        (path for path in ORIGINALS.glob(f"{master.stem}.*") if path.suffix.lower() in {".heic", ".jpg", ".jpeg"}),
        master,
    )
    render(original, master.stem)

for name in ("footimg2", "footimg3", "footimg5", "footimg7", "footimg8"):
    source = next(FOOTER_IMAGES.glob(f"{name} (1).*"))
    render(source, name)
