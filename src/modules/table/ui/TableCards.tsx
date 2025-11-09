import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useMemo } from "react";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import { useUIGameStoreState } from "@/application/hooks/useUIGameStoreState";
import {
  AnimationKeys,
  animationService,
} from "@/application/services/AnimationService";
import type { Rank, Suit } from "@/domain/entities/Card";
import { Card as CardView } from "@/infrastructure/ui/components/card/Card";

import { useTableLayout } from "../application/useTableLayout";

export const TableCards = () => {
  const { table, phase, dealerSelection, currentPlayer, mainPlayer } =
    useGameStoreState();
  const { pickDealerCard } = useGameStoreService();

  const { playingCard, captureOverride } = useUIGameStoreState();

  const placements = useTableLayout(table);

  const cardsByKey = useMemo(() => {
    const cardsByKeyMap = new Map<string, (typeof placements)[number]>();
    placements.forEach((p) => cardsByKeyMap.set(p.key, p));
    return cardsByKeyMap;
  }, [placements]);

  const isChoose = phase === "chooseDealer";
  const pickedKeys = dealerSelection?.pickedKeys ?? new Set<string>();
  const tieOnly = dealerSelection?.tieOnlyPlayers ?? null;

  const myTurn = isChoose && currentPlayer === mainPlayer;

  return (
    <>
      {placements.map((placement) => {
        const [suit, rankStr] = placement.key.split("-");
        const rank = Number(rankStr) as Rank;
        const key = placement.key;
        const alreadyPicked = pickedKeys.has(key);
        const layoutId = `card-${suit}-${rank}`;
        const isEligible =
          isChoose &&
          myTurn &&
          !alreadyPicked &&
          (!tieOnly || tieOnly.includes(mainPlayer));
        const faceDown = isChoose ? !alreadyPicked : false;

        const isAnimatingCard =
          !!playingCard &&
          playingCard.suit === (suit as Suit) &&
          playingCard.rank === rank;

        const useOverride =
          isAnimatingCard &&
          captureOverride &&
          captureOverride.fromKey === key &&
          cardsByKey.has(captureOverride.toKey);

        const basePlacement = useOverride
          ? cardsByKey.get(captureOverride.toKey)!
          : placement;

        return (
          <motion.div
            key={key}
            layout={true}
            layoutId={layoutId}
            onLayoutAnimationComplete={() => {
              if (!isAnimatingCard) return;
              animationService.dispatch(AnimationKeys.GAME_CARDS, {
                suit: suit as Suit,
                rank,
              });
            }}
            style={{
              position: "absolute",
              left: `${basePlacement.leftPct}%`,
              top: `${basePlacement.topPct}%`,
              zIndex: Math.round(basePlacement.z),
            }}
            initial={false}
          >
            <div
              style={{
                transform: `translate(-50%, -50%) rotate(${basePlacement.rotationDeg}deg)`,
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
