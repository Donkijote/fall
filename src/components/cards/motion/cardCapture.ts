import {
  captureBend,
  captureGesture,
  captureLanding,
} from "@/components/cards/motion/captureGesture";
import { cardFlights } from "@/components/cards/motion/cardFlights";

type Point = { x: number; y: number; z: number };
type HandPose = Point & { angle: number; faceUp?: boolean };
const smooth = (value: number, start: number, end: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

export const cardCaptureDuration = 2.1;
const pickupEnd = 1 - cardFlights.collect.duration / cardCaptureDuration;

export function sampleCardCapture(
  progress: number,
  topCard: boolean,
  hand: HandPose,
  table: Point,
  pile: Point,
  pitch: number,
) {
  const landing = captureLanding(0);
  if (progress <= pickupEnd) {
    if (!topCard) return { position: [table.x, table.y, table.z], rotation: [0, Math.PI, 0] };
    const gesture = captureGesture(progress / 0.42, 0, 0.32);
    const { travel } = gesture;
    const bend = captureBend(hand, table, gesture.side);
    return {
      handTravel: travel,
      position: [
        lerp(hand.x, table.x + landing.x, travel) + bend.x,
        lerp(hand.y, table.y + landing.y, travel) + bend.y,
        lerp(hand.z, table.z + pitch, travel) + gesture.lift,
      ],
      rotation: [
        gesture.pitch,
        (hand.faceUp ? Math.PI : Math.PI * smooth(travel, 0.08, 0.92)) + gesture.roll,
        lerp(hand.angle, landing.yaw, travel) + gesture.yaw,
      ],
    };
  }
  const gesture = captureGesture((progress - pickupEnd) / (1 - pickupEnd), 2, 0.4);
  const collect = gesture.travel;
  const bend = captureBend(table, pile, gesture.side);
  const flip = Math.PI * smooth(collect, 0.14, 0.9);
  const offsetZ = topCard ? pitch : 0;
  const offsetX = topCard ? landing.x * (1 - collect) : 0;
  return {
    position: [
      lerp(table.x, pile.x, collect) + bend.x + Math.cos(flip) * offsetX + Math.sin(flip) * offsetZ,
      lerp(table.y, pile.y, collect) + bend.y + (topCard ? landing.y * (1 - collect) : 0),
      lerp(table.z, pile.z, collect) +
        gesture.lift +
        Math.cos(flip) * offsetZ -
        Math.sin(flip) * offsetX,
    ],
    rotation: [
      gesture.pitch,
      Math.PI + flip + gesture.roll,
      gesture.yaw + (topCard ? landing.yaw * (1 - collect) : 0),
    ],
  };
}
