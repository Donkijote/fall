from pathlib import Path

from PIL import Image, ImageOps


asset_directory = Path(__file__).resolve().parents[1] / "src/assets/lobby/living-town"
with Image.open(asset_directory / "plaza.png") as source:
    surface = source.convert("RGB").crop((0, 640, 1672, 941))

tile = Image.new("RGB", (surface.width * 2, surface.height * 2))
tile.paste(surface, (0, 0))
tile.paste(ImageOps.mirror(surface), (surface.width, 0))
tile.paste(ImageOps.flip(surface), (0, surface.height))
tile.paste(ImageOps.flip(ImageOps.mirror(surface)), (surface.width, surface.height))
tile.save(asset_directory / "plaza.webp", quality=88, method=6)
