import { MathUtils } from "three";

export type CardDropEffect = "plain" | "ice" | "heat" | "flame";
export type CardPoint = { x: number; y: number; z: number };
export type CardAnchor = CardPoint & { angle: number; faceUp?: boolean };
export type CardPose = { position: number[]; rotation: number[]; scale?: number };

// Timing shared by the Playground's 3D studies and the live table.
export const cardFlights = {
  deal: { hand: 0.54, table: 0.68, stagger: 0.24, ease: "power1.out" },
  play: { duration: 0.75, ease: "power1.inOut" },
  collect: { duration: 0.88 },
} as const;

export function sampleDeal(
  progress: number,
  deck: CardPoint,
  target: CardAnchor,
  center: boolean,
): CardPose {
  const lift = (center ? 0.48 : 0.26) * Math.sin(Math.PI * progress);
  return {
    position: [
      MathUtils.lerp(deck.x, target.x, progress),
      MathUtils.lerp(deck.y, target.y, progress),
      MathUtils.lerp(deck.z, target.z, progress) + lift,
    ],
    rotation: [
      0,
      center || target.faceUp ? Math.PI * MathUtils.smoothstep(progress, 0.16, 0.86) : 0,
      target.angle * progress,
    ],
  };
}

export function samplePlay(progress: number, hand: CardAnchor, target: CardAnchor): CardPose {
  return {
    position: [
      MathUtils.lerp(hand.x, target.x, progress),
      MathUtils.lerp(hand.y, target.y, progress),
      MathUtils.lerp(hand.z, target.z, progress) + 0.42 * Math.sin(Math.PI * progress),
    ],
    rotation: [
      0,
      hand.faceUp ? Math.PI : Math.PI * MathUtils.smoothstep(progress, 0.18, 0.87),
      MathUtils.lerp(hand.angle, target.angle, progress),
    ],
  };
}
