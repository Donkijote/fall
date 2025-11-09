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
import type { Card, Rank, Suit } from "@/domain/entities/Card";
import { Card as CardView } from "@/infrastructure/ui/components/card/Card";
import type { Placement as TablePlacement } from "@/modules/table/entities/types";

import { useTableLayout } from "../application/useTableLayout";

export const TableCards = () => {
  const { table, phase, dealerSelection, currentPlayer, mainPlayer } =
    useGameStoreState();
  const { pickDealerCard } = useGameStoreService();

  const { playingCard, captureOverride } = useUIGameStoreState();

  const placements = useTableLayout(table);

  const cardsByKey = useMemo(() => {
    const map = new Map<string, (typeof placements)[number]>();
    placements.forEach((p) => map.set(p.key, p));
    return map as Map<string, TablePlacement>;
  }, [placements]);

  const isChoose = phase === "chooseDealer";
  const pickedKeys = dealerSelection?.pickedKeys ?? new Set<string>();
  const tieOnly = dealerSelection?.tieOnlyPlayers ?? null;
  const myTurn = isChoose && currentPlayer === mainPlayer;

  return (
    <>
      {placements.map((placement) => (
        <TableCardItem
          key={placement.key}
          placement={placement}
          cardsByKey={cardsByKey}
          isChoose={isChoose}
          myTurn={myTurn}
          pickedKeys={pickedKeys}
          tieOnly={tieOnly}
          mainPlayer={mainPlayer}
          playingCard={playingCard}
          captureOverride={captureOverride}
          onPickDealerCard={pickDealerCard}
        />
      ))}
    </>
  );
};

type TableCardItemProps = {
  placement: TablePlacement;
  cardsByKey: Map<string, TablePlacement>;
  isChoose: boolean;
  myTurn: boolean;
  pickedKeys: Set<string>;
  tieOnly: string[] | null;
  mainPlayer: string;
  playingCard: Card | null;
  captureOverride: { fromKey: string; toKey: string } | null;
  onPickDealerCard: (key: string) => Promise<void>;
};

const TableCardItem = ({
  placement,
  cardsByKey,
  isChoose,
  myTurn,
  pickedKeys,
  tieOnly,
  mainPlayer,
  playingCard,
  captureOverride,
  onPickDealerCard,
}: TableCardItemProps) => {
  const [suit, rankStr] = placement.key.split("-");
  const rank = Number(rankStr) as Rank;
  const key = placement.key;
  const layoutId = `card-${suit}-${rank}`;

  const alreadyPicked = pickedKeys.has(key);
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
    !!captureOverride &&
    captureOverride.fromKey === key &&
    cardsByKey.has(captureOverride.toKey);

  const basePlacement = useOverride
    ? cardsByKey.get(captureOverride.toKey)!
    : placement;

  return (
    <motion.div
      key={key}
      layout
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
            await onPickDealerCard(key);
          }}
          className={clsx({ "cursor-pointer": isEligible })}
        />
      </div>
    </motion.div>
  );
};
