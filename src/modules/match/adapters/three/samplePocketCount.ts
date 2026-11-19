import { countingArrival } from "@/components/cards/motion/cardCounting";
import type { CardAnchor, CardPoint } from "@/components/cards/motion/cardFlights";

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const lerp = (from: number, to: number, travel: number) => from + (to - from) * travel;

/** Quota and extra cards share one pocket entry; scoring timing stays authoritative. */
export function samplePocketCount(
  index: number,
  seconds: number,
  quota: number,
  origin: CardAnchor,
  pocket: { mouth: CardPoint; cardSize: number },
  size: number,
) {
  const progress = clamp((seconds - countingArrival(index, quota) + 0.5) / 0.5);
  const approach = smooth(clamp(progress / 0.7));
  const entry = smooth(clamp((progress - 0.7) / 0.3));
  const scale = lerp(1, Math.min(1, pocket.cardSize / size), approach);
  const halfHeight = size * scale * 2.88 * 0.5;
  // Approach from above the opening even when the collected pile is below it.
  // Then lower the card behind a world-space clip plane at the leather lip.
  const lip = pocket.mouth;
  const stagingY = lip.y + halfHeight + size * 0.15;
  return {
    progress,
    entering: progress >= 0.7,
    visible: progress > 0 && progress < 1,
    scale,
    position: [
      lerp(origin.x, lip.x, approach),
      lerp(lerp(origin.y, stagingY, approach), lip.y - halfHeight - size * 0.1, entry),
      lerp(origin.z, lip.z, approach) + Math.sin(Math.PI * progress) * 0.35,
    ],
    rotation: [
      Math.sin(Math.PI * progress) * 0.1,
      Math.PI * (1 - approach),
      origin.angle * (1 - approach) + Math.sin(Math.PI * progress) * 0.12,
    ],
  };
}
