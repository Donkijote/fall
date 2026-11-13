import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { Texture } from "three";

import backArt from "@/assets/cards/back.svg";
import faceArt from "@/assets/cards/coins/AceOfCoins.svg";

import { useTexture } from "@react-three/drei";

export const cardArtwork = { face: faceArt, back: backArt, label: "ACE OF COINS" };
const CardArtworkContext = createContext<readonly [Texture, Texture] | null>(null);

// The global SVGs contain transparent suit/rank artwork. Bake the same light
// paper and inset as the app card into one shared texture, preserving its ratio.
export function createCardFaceTexture(
  image: CanvasImageSource & { width: number; height: number },
  paper = "#fafafa",
  resolution = 512,
) {
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = resolution * (720 / 512);
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Card artwork requires a 2D canvas context.");
  context.fillStyle = paper;
  context.fillRect(0, 0, canvas.width, canvas.height);
  const inset = resolution * (40 / 512);
  const scale = Math.min(
    (canvas.width - inset * 2) / image.width,
    (canvas.height - inset * 2) / image.height,
  );
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

// Rasterize the SVG pattern into an explicit sRGB texture before WebGL uploads it.
export function createCardBackTexture(image: CanvasImageSource) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 360;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Card artwork requires a 2D canvas context.");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export function CardArtworkProvider({ children }: { children: ReactNode }) {
  const [art, backArtTexture] = useTexture([cardArtwork.face, cardArtwork.back]);
  const face = useMemo(() => createCardFaceTexture(art.image as HTMLImageElement), [art]);
  const back = useMemo(
    () => createCardBackTexture(backArtTexture.image as HTMLImageElement),
    [backArtTexture],
  );
  useEffect(
    () => () => {
      face.dispose();
      back.dispose();
    },
    [face, back],
  );
  return <CardArtworkContext value={[face, back]}>{children}</CardArtworkContext>;
}

export function useCardArtwork() {
  const textures = useContext(CardArtworkContext);
  if (!textures) throw new Error("Card meshes must be inside CardArtworkProvider.");
  return textures;
}

export function useCardFaceTextures(urls: string[], paper?: string, resolution?: number) {
  const artwork = useTexture(urls);
  const signature = urls.join("\n");
  const faces = useMemo(
    () =>
      new Map(
        signature
          .split("\n")
          .map((url, index) => [
            url,
            createCardFaceTexture(artwork[index].image as HTMLImageElement, paper, resolution),
          ]),
      ),
    [signature, artwork, paper, resolution],
  );
  useEffect(
    () => () => {
      for (const face of faces.values()) face.dispose();
    },
    [faces],
  );
  return faces;
}
