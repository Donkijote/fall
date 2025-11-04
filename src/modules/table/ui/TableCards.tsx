import { clsx } from "clsx";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Rank, Suit } from "@/domain/entities/Card";
import { Card as CardView } from "@/infrastructure/ui/components/card/Card";

import { useTableLayout } from "../application/useTableLayout";

export const TableCards = () => {
  const { table, phase, dealerSelection, currentPlayer, mainPlayer } =
    useGameStoreState();
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
        const isEligible =
          isChoose &&
          myTurn &&
          !alreadyPicked &&
          (!tieOnly || tieOnly.includes(mainPlayer));
        const faceDown = isChoose ? !alreadyPicked : false;

        return (
          <CardView
            key={key}
            rank={rank}
            suit={suit as Suit}
            faceDown={faceDown}
            disabled={!isEligible}
            onClick={() => {
              if (!isEligible) return;
              pickDealerCard(key);
            }}
            className={clsx({
              "cursor-pointer": isEligible,
            })}
            style={{
              position: "absolute",
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              transform: `translate(-50%, -50%) rotate(${p.rotationDeg}deg)`,
              zIndex: Math.round(p.z),
            }}
          />
        );
      })}
    </>
  );
};
