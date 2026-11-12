import type { CountingSnapshot } from "@/components/cards/motion/cardCounting";
import type { CardAnchor, CardPoint } from "@/components/cards/motion/cardFlights";
import type { CardMotionAudio, CaptureKind } from "@/components/cards/motion/cardTimelines";
import type { Card } from "@/domain/entities/Card";

export type SceneCard = {
  art?: Card;
  origin: CardAnchor;
  size: number;
};

export type CardScene =
  | { kind: "deal"; deck: CardPoint; cards: (SceneCard & { center: boolean; fan?: CardAnchor })[] }
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

export type PlaybackProps = {
  scene: CardScene;
  audio: CardMotionAudio;
  complete: () => void;
  handoff: (seconds: number) => void;
  sequence: number;
  count: (side: number, snapshot: CountingSnapshot) => void;
};

export function createPlaybackChannel() {
  let playback: PlaybackProps | undefined;
  const listeners = new Set<() => void>();
  return {
    getSnapshot: () => playback,
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    publish(next?: PlaybackProps) {
      playback = next;
      for (const listener of listeners) listener();
    },
  };
}

export type PlaybackChannel = ReturnType<typeof createPlaybackChannel>;
