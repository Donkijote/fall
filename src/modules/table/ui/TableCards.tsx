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

  const { playingCard, captureOverride, cascadeFollowers } =
    useUIGameStoreState();

  const placements = useTableLayout(table);

  const cardsByKey = useMemo(() => {
    const map = new Map<string, TablePlacement>();
    for (const p of placements) {
      map.set(p.key, p);
    }
    return map;
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
          cascadeFollowers={cascadeFollowers}
          onPickDealerCard={pickDealerCard}
        />
      ))}

      <FollowerStack
        followers={cascadeFollowers}
        anchorKey={captureOverride?.toKey ?? null}
        cardsByKey={cardsByKey}
      />
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
  cascadeFollowers: string[];
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
  cascadeFollowers,
  onPickDealerCard,
}: TableCardItemProps) => {
  const [suit, rankStr] = placement.key.split("-");
  const rank = Number(rankStr) as Rank;
  const key = placement.key;
  const layoutId = `card-${suit}-${rank}`;

  const isFollowerGhost = cascadeFollowers.includes(key);
  if (isFollowerGhost) return null;

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

const FollowerStack = ({
  followers,
  anchorKey,
  cardsByKey,
}: {
  followers: string[];
  anchorKey: string | null;
  cardsByKey: Map<string, TablePlacement>;
}) => {
  if (!followers.length) return null;

  const anchorPlacement = anchorKey ? cardsByKey.get(anchorKey) : null;

  return (
    <>
      {followers.map((fKey, idx) => {
        const [suit, rankStr] = fKey.split("-");
        const rank = Number(rankStr) as Rank;
        const layoutId = `card-${suit}-${rank}`;

        const origin = cardsByKey.get(fKey);
        if (!origin) return null;

        const base = anchorPlacement ?? origin;
        const offset = idx * 2;

        return (
          <motion.div
            key={`follower-${fKey}`}
            layout
            layoutId={layoutId}
            style={{
              position: "absolute",
              left: `${base.leftPct}%`,
              top: `${base.topPct}%`,
              zIndex: Math.round((anchorPlacement?.z ?? origin.z) + 50 + idx),
            }}
            initial={false}
          >
            <div
              style={{
                transform: `translate(-50%, -50%) rotate(${base.rotationDeg}deg) translate(${offset}px, ${offset}px)`,
              }}
            >
              <CardView
                rank={rank}
                suit={suit as Suit}
                disabled={true}
                faceDown={false}
              />
            </div>
          </motion.div>
        );
      })}
    </>
  );
};
