export const tavernPlacement = {
  landscape: { horizontal: 290, vertical: 756, scale: 55 },
  portrait: { horizontal: 655, vertical: 777, scale: 47 },
};

export function getTavernPlacement(width: number, height: number) {
  return width < height ? tavernPlacement.portrait : tavernPlacement.landscape;
}

export type TavernSurface = "stone" | "timber" | "roof" | "plaster";

export const tavernTextureSize = 128;

function noiseAt(horizontal: number, vertical: number) {
  const hash = Math.imul(horizontal + 17, 374761393) ^ Math.imul(vertical + 31, 668265263);
  return (((hash ^ (hash >>> 13)) >>> 0) % 101) / 100;
}

export function createTavernSurface(surface: TavernSurface) {
  const pixels = new Uint8Array(tavernTextureSize * tavernTextureSize * 4);
  for (let vertical = 0; vertical < tavernTextureSize; vertical++) {
    for (let horizontal = 0; horizontal < tavernTextureSize; horizontal++) {
      const noise = noiseAt(horizontal, vertical);
      let color: number[];
      if (surface === "stone") {
        const row = Math.floor(vertical / 24);
        const column = (horizontal + (row % 2) * 24) % 48;
        const mortar = vertical % 24 < 3 || column < 3;
        const variation = noiseAt(Math.floor((horizontal + (row % 2) * 24) / 48), row) * 25;
        const grain = noise * 16;
        color = mortar
          ? [43 + grain, 38 + grain, 35 + grain]
          : [99 + variation + grain, 89 + variation + grain, 78 + variation + grain];
      } else if (surface === "timber") {
        const grain = Math.sin(horizontal * 1.3 + Math.sin(vertical * 0.075) * 2) * 9 + noise * 12;
        const seam = horizontal % 32 < 2 ? -24 : 0;
        color = [81 + grain + seam, 52 + grain * 0.65 + seam, 32 + grain * 0.35 + seam];
      } else if (surface === "roof") {
        const row = Math.floor(vertical / 16);
        const column = (horizontal + (row % 2) * 16) % 32;
        const edge = vertical % 16 < 2 || column < 1;
        const variation = noiseAt(Math.floor((horizontal + (row % 2) * 16) / 32), row) * 15;
        const grain = noise * 9;
        color = edge
          ? [31, 24, 27]
          : [72 + variation + grain, 41 + variation * 0.5 + grain, 42 + variation * 0.6 + grain];
      } else {
        const grain = noise * 22;
        color = [159 + grain, 139 + grain, 111 + grain];
      }
      const offset = (vertical * tavernTextureSize + horizontal) * 4;
      for (let channel = 0; channel < 3; channel++)
        pixels[offset + channel] = Math.round(color[channel]);
      pixels[offset + 3] = 255;
    }
  }
  return pixels;
}
