import { clsx } from "clsx";
import { motion } from "framer-motion";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import {
  AnimationKeys,
  animationService,
} from "@/application/services/AnimationService";
import type { Rank, Suit } from "@/domain/entities/Card";
import { Card as CardView } from "@/infrastructure/ui/components/card/Card";

import { useTableLayout } from "../application/useTableLayout";

export const TableCards = () => {
  const {
    table,
    phase,
    dealerSelection,
    currentPlayer,
    mainPlayer,
    lastPlayedCard,
  } = useGameStoreState();
  const { pickDealerCard } = useGameStoreService();

  const placements = useTableLayout(table);

  const isChoose = phase === "chooseDealer";
  const pickedKeys = dealerSelection?.pickedKeys ?? new Set<string>();
  const tieOnly = dealerSelection?.tieOnlyPlayers ?? null;

  const myTurn = isChoose && currentPlayer === mainPlayer;

  return (
    <>
      {placements.map((p) => {
        const [suit, rankStr] = p.key.split("-");
        const rank = Number(rankStr) as Rank;
        const key = p.key;
        const alreadyPicked = pickedKeys.has(key);
        const layoutId = `card-${suit}-${rank}`;
        const isEligible =
          isChoose &&
          myTurn &&
          !alreadyPicked &&
          (!tieOnly || tieOnly.includes(mainPlayer));
        const faceDown = isChoose ? !alreadyPicked : false;
        const isLast = Boolean(
          lastPlayedCard &&
            lastPlayedCard.suit === (suit as Suit) &&
            lastPlayedCard.rank === rank,
        );

        return (
          <motion.div
            key={key}
            layout={true}
            layoutId={layoutId}
            onLayoutAnimationComplete={() => {
              if (!isLast) return;
              animationService.dispatch(AnimationKeys.GAME_CARDS, {
                suit: suit as Suit,
                rank,
              });
            }}
            style={{
              position: "absolute",
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              zIndex: Math.round(p.z),
            }}
            initial={false}
          >
            <div
              style={{
                transform: `translate(-50%, -50%) rotate(${p.rotationDeg}deg)`,
              }}
            >
              <CardView
                rank={rank}
                suit={suit as Suit}
                faceDown={faceDown}
                disabled={!isEligible}
                onClick={async () => {
                  if (!isEligible) return;
                  await pickDealerCard(key);
                }}
                className={clsx({
                  "cursor-pointer": isEligible,
                })}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
