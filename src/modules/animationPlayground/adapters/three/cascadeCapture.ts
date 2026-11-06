type Point = { x: number; y: number; z: number };
type HandPose = Point & { angle: number };
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

// Walk around the grid rather than jumping diagonally across the other cards.
export const cascadeOrder = [0, 1, 3, 2] as const;
export const cascadeTravelTime = 0.54;
export const cascadeStepTime = 0.72;
const returnTime = 0.9;
export const cascadeCaptureDuration = cascadeOrder.length * cascadeStepTime + returnTime;

// cardIndex is -1 for the played card, otherwise its index in the pickup order.
// Uncollected cards stay on the table; collected cards travel as one growing pile.
export function sampleCascadeCapture(
  progress: number,
  cardIndex: number,
  hand: HandPose,
  targets: readonly Point[],
  pile: Point,
  pitch: number,
) {
  const seconds =
    Math.max(0, Math.min(1, progress)) * (targets.length * cascadeStepTime + returnTime);
  const leg = Math.min(targets.length, Math.floor(seconds / cascadeStepTime));
  const ordinal = cardIndex + 1;
  if (leg < targets.length) {
    const target = targets[leg];
    if (cardIndex >= leg) {
      const own = targets[cardIndex];
      return { position: [own.x, own.y, own.z], rotation: [0, Math.PI, 0] };
    }
    const travel = smooth((seconds - leg * cascadeStepTime) / cascadeTravelTime);
    const start = leg === 0 ? hand : targets[leg - 1];
    const offset = (leg - ordinal) * pitch;
    return {
      position: [
        lerp(start.x, target.x, travel),
        lerp(start.y, target.y, travel),
        lerp(start.z, target.z + pitch, travel) + offset + 0.26 * Math.sin(Math.PI * travel),
      ],
      rotation: [
        0,
        leg === 0 ? Math.PI * travel : Math.PI,
        leg === 0 ? hand.angle * (1 - travel) : 0,
      ],
    };
  }
  const collect = smooth((seconds - targets.length * cascadeStepTime) / returnTime);
  const flip = Math.PI * smooth((collect - 0.12) / 0.76);
  const last = targets[targets.length - 1];
  const offset = (targets.length - ordinal) * pitch;
  return {
    position: [
      lerp(last.x, pile.x, collect) + Math.sin(flip) * offset,
      lerp(last.y, pile.y, collect),
      lerp(last.z, pile.z, collect) + 0.4 * Math.sin(Math.PI * collect) + Math.cos(flip) * offset,
    ],
    rotation: [0, Math.PI + flip, 0],
  };
}
