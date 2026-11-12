import { SRGBColorSpace } from "three";

import { createCardFaceTexture } from "./CardArtwork";

vi.mock("@react-three/drei", () => ({ useTexture: vi.fn() }));

afterEach(() => vi.restoreAllMocks());

it("composes transparent app artwork onto light paper without stretching or cropping it", () => {
  const context = { fillStyle: "", fillRect: vi.fn(), drawImage: vi.fn() };
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D,
  );
  const image = Object.assign(document.createElement("img"), { width: 6400, height: 9584 });
  const texture = createCardFaceTexture(image);
  expect(context.fillStyle).toBe("#fafafa");
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 512, 720);
  const [source, x, y, width, height] = context.drawImage.mock.calls[0];
  expect(source).toBe(image);
  expect(width / height).toBeCloseTo(64 / 95.84);
  expect(x).toBeGreaterThanOrEqual(40);
  expect(y).toBeGreaterThanOrEqual(40);
  expect(x + width).toBeLessThanOrEqual(472);
  expect(y + height).toBeLessThanOrEqual(680);
  expect(texture.colorSpace).toBe(SRGBColorSpace);
  texture.dispose();
});
