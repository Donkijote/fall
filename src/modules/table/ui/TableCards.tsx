import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Rank, Suit } from "@/domain/entities/Card";
import { Card as CardView } from "@/infrastructure/ui/components/card/Card";

import { useTableLayout } from "../application/useTableLayout";

export const TableCards = () => {
  const { table } = useGameStoreState();
  const placements = useTableLayout(table);

  return (
    <>
      {placements.map((p) => {
        const [suit, rankStr] = p.key.split("-");
        const rank = Number(rankStr) as Rank;
        return (
          <CardView
            key={p.key}
            rank={rank}
            suit={suit as Suit}
            disabled
            style={{
              position: "absolute",
              left: `${p.leftPct}%`,
              top: `${p.topPct}%`,
              transform: `rotate(${p.rotationDeg}deg)`,
              zIndex: Math.round(p.z),
              transition: "none", // stable once placed
            }}
          />
        );
      })}
    </>
  );
};
