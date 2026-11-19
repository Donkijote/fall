type Rect = Pick<DOMRect, "left" | "top" | "width" | "height">;
type Size = { width: number; height: number };
const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;
const inset = 3;
const constrain = (center: number, before: number, after: number, extent: number) =>
  Math.max(inset + before, Math.min(extent - inset - after, center));

/** Size the flight for the board, then dock the badge inside the recipient tile. */
export function pointsFlight({
  bounds,
  source,
  destination,
  badge,
  caption,
  progress,
  reveal,
}: {
  bounds: Rect;
  source?: Rect;
  destination: Rect;
  badge: Size;
  caption: Size;
  progress: number;
  reveal: number;
}) {
  const sourceScale = Math.min(1, Math.min(bounds.width, bounds.height) / 500);
  const targetScale = Math.min(
    sourceScale,
    (destination.width * 0.85) / badge.width,
    (destination.height * 0.85) / badge.height,
  );
  const dock = progress * progress * (3 - 2 * progress);
  const scale = lerp(sourceScale, targetScale, dock) * reveal;
  const captionOpacity = Math.max(0, 1 - progress * 3);
  const halfWidth = (Math.max(badge.width, captionOpacity > 0 ? caption.width : 0) * scale) / 2;
  const halfHeight = (badge.height * scale) / 2;
  const bottom = halfHeight + (captionOpacity > 0 ? (caption.height + 4) * scale : 0);
  const startX = source ? source.left + source.width / 2 - bounds.left : bounds.width / 2;
  const startY = source ? source.top + source.height / 2 - bounds.top : bounds.height * 0.48;
  const endX = destination.left + destination.width / 2 - bounds.left;
  const endY = destination.top + destination.height / 2 - bounds.top;
  return {
    x: constrain(lerp(startX, endX, progress), halfWidth, halfWidth, bounds.width),
    y: constrain(
      lerp(startY, endY, progress) -
        Math.sin(progress * Math.PI) * Math.min(80, bounds.height * 0.12),
      halfHeight,
      bottom,
      bounds.height,
    ),
    scale,
    captionOpacity,
  };
}
