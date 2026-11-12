import { MathUtils } from "three";

import type { CardAnchor, CardPoint, CardPose } from "@/components/cards/motion/cardFlights";
import {
  cascadeFirstPickupDuration,
  getCascadeDuration,
  sampleCascadeCapture,
} from "@/components/cards/motion/cascadeCapture";

export function sampleFallCascade(
  progress: number,
  cardIndex: number,
  hand: CardAnchor,
  targets: readonly CardPoint[],
  pile: CardPoint,
  pitch: number,
  fallLanding?: CardPose,
): CardPose {
  const duration = getCascadeDuration(targets.length);
  const remaining = duration - cascadeFirstPickupDuration;
  const join = cascadeFirstPickupDuration / duration;
  const pose = sampleCascadeCapture(
    join + (remaining * progress) / duration,
    cardIndex,
    hand,
    targets,
    pile,
    pitch,
  );
  if (!fallLanding) return pose;

  // The Fall leaves the pair slightly askew. Carry that offset into the
  // second pickup, then square it naturally into the shared cascade stack.
  const start = sampleCascadeCapture(join, cardIndex, hand, targets, pile, pitch);
  const offset = 1 - MathUtils.smoothstep(remaining * progress, 0, 0.24);
  return {
    position: pose.position.map(
      (value, index) => value + (fallLanding.position[index] - start.position[index]) * offset,
    ),
    rotation: pose.rotation.map(
      (value, index) => value + (fallLanding.rotation[index] - start.rotation[index]) * offset,
    ),
  };
}
