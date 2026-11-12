import {
  captureBend,
  captureGesture,
  captureLanding,
} from "@/components/cards/motion/captureGesture";

type Point = { x: number; y: number; z: number };
type HandPose = Point & { angle: number; faceUp?: boolean };
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;
const smooth = (value: number) => {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
};

export const cascadeOrder = [0, 1, 3, 2] as const;
// A short contact pause and varied cadence avoid four identical mechanical hops.
const cadence = [0.78, 0.69, 0.84, 0.72];
function stepsFor(count: number) {
  let start = 0;
  return Array.from({ length: count }, (_, index) => {
    const duration = cadence[index % cadence.length];
    const step = { start, duration, travel: duration * 0.76 };
    start += duration;
    return step;
  });
}
export const cascadeSteps = stepsFor(cascadeOrder.length);
export const cascadeReturnTime = 0.96;
export function getCascadeDuration(count: number) {
  const last = stepsFor(count).at(-1);
  return (last ? last.start + last.duration : 0) + cascadeReturnTime;
}
export const cascadeFirstPickupDuration = cadence[0];
export const cascadeCaptureDuration = getCascadeDuration(cascadeOrder.length);

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
  const steps = targets.length === cascadeOrder.length ? cascadeSteps : stepsFor(targets.length);
  const lastStep = steps.at(-1)!;
  const pickupDuration = lastStep.start + lastStep.duration;
  const seconds = Math.max(0, Math.min(1, progress)) * (pickupDuration + cascadeReturnTime);
  const leg = steps.findIndex((step) => seconds < step.start + step.duration);
  const ordinal = cardIndex + 1;
  if (leg !== -1) {
    const target = targets[leg];
    if (cardIndex >= leg) {
      const own = targets[cardIndex];
      return { position: [own.x, own.y, own.z], rotation: [0, Math.PI, 0] };
    }
    const step = steps[leg];
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
      handTravel: leg === 0 ? travel : 1,
      position: [
        lerp(start.x + from.x * fromLayer, target.x + to.x * toLayer, travel) + bend.x,
        lerp(start.y + from.y * fromLayer, target.y + to.y * toLayer, travel) + bend.y,
        lerp(start.z, target.z + pitch, travel) + offset + gesture.lift,
      ],
      rotation: [
        gesture.pitch,
        (leg === 0 && !hand.faceUp ? Math.PI * travel : Math.PI) + gesture.roll,
        lerp(leg === 0 ? hand.angle : from.yaw * fromLayer, to.yaw * toLayer, travel) + gesture.yaw,
      ],
    };
  }
  const gesture = captureGesture((seconds - pickupDuration) / cascadeReturnTime, 5, 0.42);
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
