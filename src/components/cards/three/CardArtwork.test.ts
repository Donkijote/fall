import { SRGBColorSpace } from "three";

import { createCardBackTexture, createCardFaceTexture } from "./CardArtwork";
vi.mock("@react-three/drei", () => ({ useTexture: vi.fn() }));
afterEach(() => vi.restoreAllMocks());
it("uploads the whole generated face without a second paper, frame or inset", () => {
  const context = { clearRect: vi.fn(), fillRect: vi.fn(), drawImage: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  const image = Object.assign(document.createElement("img"), { width: 504, height: 704 });
  const texture = createCardFaceTexture(image);
  expect(context.clearRect).toHaveBeenCalledWith(0, 0, 504, 704);
  expect(context.fillRect).not.toHaveBeenCalled();
  expect(context.drawImage).toHaveBeenCalledWith(image, 0, 0, 504, 704);
  expect(texture.colorSpace).toBe(SRGBColorSpace);
  texture.dispose();
});
it("preserves the back's proportions, alpha and sRGB color space", () => {
  const context = { clearRect: vi.fn(), drawImage: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  const image = Object.assign(document.createElement("img"), { width: 504, height: 704 });
  const texture = createCardBackTexture(image);
  expect(context.drawImage).toHaveBeenCalledWith(image, 0, 0, 252, 352);
  expect(texture.colorSpace).toBe(SRGBColorSpace);
  texture.dispose();
});
