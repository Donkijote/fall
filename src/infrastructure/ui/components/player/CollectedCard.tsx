import { motion } from "framer-motion";

import { useUIGameStoreState } from "@/application/hooks/useUIGameStoreState";
import {
  AnimationKeys,
  animationService,
} from "@/application/services/AnimationService";
import type { Card } from "@/domain/entities/Card";
import { Card as CardComponent } from "@/infrastructure/ui/components/card/Card";

type CollectedCardProps = {
  card: Card;
  index: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

const angleFromKey = (key: string) => {
  let h = 0;
  for (let i = 0; i < key.length; i++)
    h = Math.trunc(h * 31 + (key.codePointAt(i) ?? 0));

  return Math.abs(h % 51) - 25;
};

export const CollectedCard = ({ card, index }: CollectedCardProps) => {
  const { playingCard } = useUIGameStoreState();

  const layoutId = `card-${card.suit}-${card.rank}`;
  const translate = index * 0.25;
  const z = 1 + index;

  const rotationDeg = `rotate(${angleFromKey(layoutId)}deg)`;

  const isPlayed =
    !!playingCard &&
    playingCard.suit === card.suit &&
    playingCard.rank === card.rank;

  return (
    <motion.div
      layout={true}
      layoutId={layoutId}
      onLayoutAnimationComplete={() => {
        if (!isPlayed) return;
        animationService.dispatch(AnimationKeys.PILE_COLLECT, {
          suit: card.suit,
          rank: card.rank,
        });
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: z,
        pointerEvents: "none",
      }}
      transition={{ layout: { duration: 0.35, ease: EASE } }}
      initial={false}
    >
      <div
        style={{
          transform: `translate(${translate}px, ${translate}px) ${rotationDeg}`,
        }}
      >
        <CardComponent
          rank={card.rank}
          suit={card.suit}
          faceDown={true}
          disabled={true}
        />
      </div>
    </motion.div>
  );
};
