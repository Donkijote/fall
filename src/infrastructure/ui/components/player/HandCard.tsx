import { clsx } from "clsx";
import { motion } from "framer-motion";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import type { Card as ICard } from "@/domain/entities/Card";
import type { Player } from "@/domain/entities/GameState";
import { Card } from "@/infrastructure/ui/components/card/Card";

type HandCard = {
  card: ICard;
  index: number;
  player: Player;
  currentPlayer: string;
  mainPlayer: string;
};

export const HandCard = ({
  card,
  player,
  index,
  mainPlayer,
  currentPlayer,
}: HandCard) => {
  const { playCard } = useGameStoreService();
  const total = player.hand.length;
  const middle = (total - 1) / 2;

  const rotate = (index - middle) * 10;
  const translateY = Math.abs(index - middle) * 12;
  const layoutId = `card-${card.suit}-${card.rank}`;

  return (
    <motion.div key={layoutId} layout={true} layoutId={layoutId}>
      <div
        style={{
          transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
        }}
      >
        <Card
          rank={card.rank}
          suit={card.suit}
          onClick={async () => {
            if (player.id !== mainPlayer && currentPlayer !== player.id) {
              return;
            }
            await playCard(player.id, index);
          }}
          disabled={currentPlayer !== mainPlayer || player.id !== mainPlayer}
          faceDown={player.id !== mainPlayer}
          className={clsx({
            "cursor-pointer":
              player.id === mainPlayer && currentPlayer === player.id,
          })}
        />
      </div>
    </motion.div>
  );
};
