import { captureBend, captureGesture, captureLanding } from "./captureGesture";

type Point = { x: number; y: number; z: number };
type HandPose = Point & { angle: number };
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export const cascadeOrder = [0, 1, 3, 2] as const;
// A short contact pause and varied cadence avoid four identical mechanical hops.
export const cascadeSteps = [0.78, 0.69, 0.84, 0.72].map((duration, index, durations) => ({
  start: durations.slice(0, index).reduce((sum, value) => sum + value, 0),
  duration,
  travel: duration * 0.76,
}));
const pickupDuration = cascadeSteps.reduce((sum, step) => sum + step.duration, 0);
const returnTime = 0.96;
export const cascadeCaptureDuration = pickupDuration + returnTime;

// Each layer lands slightly askew, then squares up during the following pickup.
// Uncollected cards stay stationary, and the final stack is aligned precisely.
export function sampleCascadeCapture(
  progress: number,
  cardIndex: number,
  hand: HandPose,
  targets: readonly Point[],
  pile: Point,
  pitch: number,
) {
  const seconds = Math.max(0, Math.min(1, progress)) * cascadeCaptureDuration;
  const leg = cascadeSteps.findIndex((step) => seconds < step.start + step.duration);
  const ordinal = cardIndex + 1;
  if (leg !== -1) {
    const target = targets[leg];
    if (cardIndex >= leg) {
      const own = targets[cardIndex];
      return { position: [own.x, own.y, own.z], rotation: [0, Math.PI, 0] };
    }
    const step = cascadeSteps[leg];
    const gesture = captureGesture(
      (seconds - step.start) / step.travel,
      leg,
      0.24 + 0.045 * Math.cos(leg),
    );
    const { travel } = gesture;
    const start = leg === 0 ? hand : targets[leg - 1];
    const bend = captureBend(start, target, gesture.side);
    const from = captureLanding(leg - 1);
    const to = captureLanding(leg);
    const fromLayer = leg === 0 ? 0 : (leg - ordinal) / leg;
    const toLayer = (leg + 1 - ordinal) / (leg + 1);
    const offset = (leg - ordinal) * pitch;
    return {
      position: [
        lerp(start.x + from.x * fromLayer, target.x + to.x * toLayer, travel) + bend.x,
        lerp(start.y + from.y * fromLayer, target.y + to.y * toLayer, travel) + bend.y,
        lerp(start.z, target.z + pitch, travel) + offset + gesture.lift,
      ],
      rotation: [
        gesture.pitch,
        (leg === 0 ? Math.PI * travel : Math.PI) + gesture.roll,
        lerp(leg === 0 ? hand.angle : from.yaw * fromLayer, to.yaw * toLayer, travel) + gesture.yaw,
      ],
    };
  }
  const gesture = captureGesture((seconds - pickupDuration) / returnTime, 5, 0.42);
  const collect = gesture.travel;
  const bend = captureBend(targets[targets.length - 1], pile, gesture.side);
  const flip = Math.PI * smooth((collect - 0.14) / 0.76);
  const last = targets[targets.length - 1];
  const offset = (targets.length - ordinal) * pitch;
  const landing = captureLanding(targets.length - 1);
  const layer = (targets.length - ordinal) / targets.length;
  const offsetX = landing.x * layer * (1 - collect);
  return {
    position: [
      lerp(last.x, pile.x, collect) + bend.x + Math.cos(flip) * offsetX + Math.sin(flip) * offset,
      lerp(last.y, pile.y, collect) + bend.y + landing.y * layer * (1 - collect),
      lerp(last.z, pile.z, collect) +
        gesture.lift +
        Math.cos(flip) * offset -
        Math.sin(flip) * offsetX,
    ],
    rotation: [
      gesture.pitch,
      Math.PI + flip + gesture.roll,
      gesture.yaw + landing.yaw * layer * (1 - collect),
    ],
  };
}
