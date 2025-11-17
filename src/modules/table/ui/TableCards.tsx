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

const LIFT_Y = -10;
const LIFT_SCALE = 1.04;
const STACK_OFFSET = 2;
const EASE = [0.22, 1, 0.36, 1] as const;

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

  const anchorZ = captureOverride?.toKey
    ? (cardsByKey.get(captureOverride.toKey)?.z ?? placement.z)
    : placement.z;

  const isLifted =
    !!captureOverride && captureOverride.toKey === key && !!playingCard;

  let zIndex = Math.round(placement.z);

  if (isLifted) {
    zIndex = anchorZ + 100;
  } else if (isAnimatingCard && useOverride) {
    zIndex = anchorZ;
  }

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
        zIndex,
      }}
      transition={{ layout: { duration: 0.35, ease: EASE } }}
      initial={false}
    >
      <motion.div
        animate={{
          y: isLifted ? LIFT_Y : 0,
          scale: isLifted ? LIFT_SCALE : 1,
          boxShadow: isLifted
            ? "0 10px 20px rgba(0,0,0,0.25)"
            : "0 0 0 rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.28, ease: EASE }}
        style={{
          transform: `translate(-50%, -50%) rotate(${basePlacement.rotationDeg}deg)`,
          borderRadius: 8,
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
      </motion.div>
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
  const anchorZ = anchorPlacement?.z ?? 0;

  return (
    <>
      {followers.map((fKey, idx) => {
        const [suit, rankStr] = fKey.split("-");
        const rank = Number(rankStr) as Rank;
        const layoutId = `card-${suit}-${rank}`;

        const origin = cardsByKey.get(fKey);
        if (!origin) return null;

        const base = anchorPlacement ?? origin;
        const offset = idx * STACK_OFFSET;
        const zIndex = Math.round(anchorZ + 1 + idx);

        return (
          <motion.div
            key={`follower-${fKey}`}
            layout={true}
            layoutId={layoutId}
            style={{
              position: "absolute",
              left: `${base.leftPct}%`,
              top: `${base.topPct}%`,
              zIndex,
            }}
            transition={{ layout: { duration: 0.35, ease: EASE } }}
            initial={false}
          >
            <motion.div
              animate={{
                y: anchorPlacement?.z ?? 0,
                scale: anchorPlacement?.z ?? 1,
              }}
              transition={{ duration: 0.28, ease: EASE }}
              style={{
                transform: `translate(-50%, -50%) rotate(${base.rotationDeg}deg) translate(${offset}px, ${offset}px)`,
              }}
            >
              <CardView
                rank={rank}
                suit={suit as Suit}
                disabled
                faceDown={false}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </>
  );
};
