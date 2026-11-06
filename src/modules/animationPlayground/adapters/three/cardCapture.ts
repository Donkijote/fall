type Point = { x: number; y: number; z: number };
type HandPose = Point & { angle: number };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number, start: number, end: number) => {
  const t = clamp((value - start) / (end - start));
  return t * t * (3 - 2 * t);
};
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const cardCaptureDuration = 2.1;

// Ordinary capture: the table card stays put until the played card has landed.
// Both then lift and turn over together, preserving their thickness separation.
export function sampleCardCapture(
  progress: number,
  topCard: boolean,
  hand: HandPose,
  table: Point,
  pile: Point,
  pitch: number,
) {
  const play = smooth(progress, 0, 0.42);
  const collect = smooth(progress, 0.58, 1);
  const flip = Math.PI * smooth(collect, 0.12, 0.88);
  if (collect === 0) {
    return {
      position: topCard
        ? [
            lerp(hand.x, table.x, play),
            lerp(hand.y, table.y, play),
            lerp(hand.z, table.z + pitch, play) + 0.3 * Math.sin(Math.PI * play),
          ]
        : [table.x, table.y, table.z],
      rotation: topCard
        ? [0, Math.PI * smooth(play, 0.08, 0.92), hand.angle * (1 - play)]
        : [0, Math.PI, 0],
    };
  }
  const offset = topCard ? pitch : 0;
  return {
    position: [
      lerp(table.x, pile.x, collect) + Math.sin(flip) * offset,
      lerp(table.y, pile.y, collect),
      lerp(table.z, pile.z, collect) + 0.38 * Math.sin(Math.PI * collect) + Math.cos(flip) * offset,
    ],
    rotation: [0, Math.PI + flip, 0],
  };
}
