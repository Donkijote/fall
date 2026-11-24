import { createContext, useContext, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { CanvasTexture, SRGBColorSpace } from "three";
import type { Texture } from "three";

import { useTexture } from "@react-three/drei";

import { useDeckArtwork } from "../useDeckArtwork";

type CardImage = CanvasImageSource & { width: number; height: number };
const CardArtworkContext = createContext<readonly [Texture, Texture] | null>(null);

// The generated image is the complete card, including its own paper and border.
// Preserve its alpha and proportions; add no inset, paper, frame or overlays.
export function createCardFaceTexture(image: CardImage, resolution = 504) {
  const canvas = document.createElement("canvas");
  canvas.width = resolution;
  canvas.height = Math.round(resolution * (88 / 63));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Card artwork requires a 2D canvas context.");
  context.clearRect(0, 0, canvas.width, canvas.height);
  const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
  const width = image.width * scale;
  const height = image.height * scale;
  context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}
export function createCardBackTexture(image: CardImage) {
  return createCardFaceTexture(image, 252);
}
export function CardArtworkProvider({ children }: { children: ReactNode }) {
  const artwork = useDeckArtwork();
  const [art, backArt] = useTexture([artwork.face, artwork.back]);
  const face = useMemo(() => createCardFaceTexture(art.image as HTMLImageElement), [art]);
  const back = useMemo(() => createCardBackTexture(backArt.image as HTMLImageElement), [backArt]);
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
export function useCardFaceTextures(urls: string[], resolution = 504) {
  const artwork = useTexture(urls);
  const signature = urls.join("\n");
  const faces = useMemo(
    () =>
      new Map(
        signature
          .split("\n")
          .map((url, index) => [
            url,
            createCardFaceTexture(artwork[index].image as HTMLImageElement, resolution),
          ]),
      ),
    [signature, artwork, resolution],
  );
  useEffect(
    () => () => {
      for (const face of faces.values()) face.dispose();
    },
    [faces],
  );
  return faces;
}
