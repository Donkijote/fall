import { CanvasTexture, LinearFilter, MathUtils, SRGBColorSpace } from "three";

export const smokeSpriteCount = 6;
const tileSize = 96;

function hash(x: number, y: number) {
  const value = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function noise(x: number, y: number) {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = MathUtils.smoothstep(x - ix, 0, 1);
  const fy = MathUtils.smoothstep(y - iy, 0, 1);
  return MathUtils.lerp(
    MathUtils.lerp(hash(ix, iy), hash(ix + 1, iy), fx),
    MathUtils.lerp(hash(ix, iy + 1), hash(ix + 1, iy + 1), fx),
    fy,
  );
}

function turbulence(x: number, y: number) {
  return (
    noise(x, y) * 0.55 + noise(x * 2.1 + 8.4, y * 2.1) * 0.3 + noise(x * 4.3, y * 4.3 - 3.1) * 0.15
  );
}

function smokePixel(x: number, y: number, variant: number) {
  const t = variant * 9.3;
  const puff = turbulence(x * 3.4 + t, y * 6.1 - t);
  const offset = (noise(y * 5.0 + t, t) - 0.5) * 0.22;
  const distance = Math.hypot(x - offset, (y - 0.5) * 2);
  const silhouette = 1 - MathUtils.smoothstep(distance + (puff - 0.5) * 0.37, 0.25, 0.95);
  const value = 36 + puff * 120;
  return [value * 1.04, value, value * 0.97, 230 * silhouette * (0.28 + puff * 0.72)];
}

export function createSmokeSprites() {
  const canvas = document.createElement("canvas");
  canvas.width = tileSize * smokeSpriteCount;
  canvas.height = tileSize;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create flame particle sprites");

  const tile = context.createImageData(tileSize, tileSize);
  for (let variant = 0; variant < smokeSpriteCount; variant++) {
    for (let row = 0; row < tileSize; row++) {
      for (let column = 0; column < tileSize; column++) {
        const x = ((column + 0.5) / tileSize) * 2 - 1;
        const y = 1 - (row + 0.5) / tileSize;
        tile.data.set(smokePixel(x, y, variant), (row * tileSize + column) * 4);
      }
    }
    context.putImageData(tile, variant * tileSize, 0);
  }

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = LinearFilter;
  return texture;
}
