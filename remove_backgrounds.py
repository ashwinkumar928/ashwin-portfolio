
from pathlib import Path
from rembg import remove, new_session
from PIL import Image

ROOT = Path(__file__).resolve().parent
OUTPUT = ROOT / "public" / "images"
OUTPUT.mkdir(parents=True, exist_ok=True)

session = new_session("u2net")

photos = [
    (ROOT / "assets" / "photos" / "Ashwin.jpg", OUTPUT / "ashwin-hero-cutout.png"),
    (ROOT / "assets" / "photos" / "About.jpeg", OUTPUT / "ashwin-about-cutout.png"),
]

for source, destination in photos:
    if not source.exists():
        print(f"Photo not found: {source}")
        continue

    print(f"Removing background from {source.name}...")
    with Image.open(source) as image:
        result = remove(image.convert("RGBA"), session=session)
        result.save(destination)

    print(f"Saved: {destination}")

print("Finished. Check public/images for the PNG files.")
