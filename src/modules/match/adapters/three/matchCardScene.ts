import type { CardAnchor, CardPoint } from "@/components/cards/motion/cardFlights";
import type { CaptureKind } from "@/components/cards/motion/cardTimelines";
import type { Card } from "@/domain/entities/Card";

export type SceneCard = {
  art?: Card;
  origin: CardAnchor;
  size: number;
};

export type CardScene =
  | { kind: "deal"; deck: CardPoint; cards: (SceneCard & { center: boolean })[] }
  | { kind: "play"; card: SceneCard; target: CardAnchor; targetSize: number }
  | {
      kind: "collect";
      capture: CaptureKind;
      played?: SceneCard;
      targets: SceneCard[];
      pile: CardPoint;
    }
  | {
      kind: "count";
      groups: { side: number; quota: number; cards: SceneCard[]; target: CardPoint }[];
    };

export const viewHeight = 6.1;
export const cardPitch = 0.0075;
