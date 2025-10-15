import { useEffect, useMemo, useRef } from "react";

import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Card as ICard } from "@/domain/entities/Card";

import { Card } from "../card/Card";

type Layout = {
  left: string;
  top: string;
  rotate: string;
  z: number;
};

const keyOf = (c: ICard) => `${c.suit}-${c.rank}`;

type Pt = { leftPct: number; topPct: number };

function dist2(a: Pt, b: Pt) {
  const dx = a.leftPct - b.leftPct;
  const dy = a.topPct - b.topPct;
  return dx * dx + dy * dy;
}

function createScatter(
  existing: Pt[],
  {
    minDistPct = 8, // minimum distance in percentage of the table box
    maxAttempts = 20, // safety to avoid infinite loops
  } = {},
): Layout {
  let best: Pt | null = null;
  let attempts = 0;

  while (attempts++ < maxAttempts) {
    const angle = existing.length * 137.508 + (Math.random() - 0.5) * 25;
    const radius = 12 + Math.random() * 20; // 12%..32% from center

    const rad = (angle * Math.PI) / 180;
    const cx = 50 + Math.cos(rad) * radius;
    const cy = 50 + Math.sin(rad) * radius;

    const jx = (Math.random() - 0.5) * 3; // ±1.5%
    const jy = (Math.random() - 0.5) * 2; // ±1%

    const left = Math.max(5, Math.min(95, cx + jx));
    const top = Math.max(10, Math.min(90, cy + jy));

    const candidate: Pt = { leftPct: left, topPct: top };

    // Check spacing
    const ok = existing.every(
      (p) => dist2(p, candidate) >= minDistPct * minDistPct,
    );
    if (ok) {
      best = candidate;
      break;
    }

    // keep the “best” (furthest) candidate in case all attempts fail
    best ??= candidate;
  }

  const rot = Math.floor(Math.random() * 36 - 18);

  return {
    left: `${best!.leftPct}%`,
    top: `${best!.topPct}%`,
    rotate: `rotate(${rot}deg)`,
    z: Date.now() + Math.random(),
  };
}

export const TableCards = () => {
  const { table } = useGameStoreState();

  const layoutsRef = useRef<Map<string, Layout>>(new Map());

  useEffect(() => {
    const map = layoutsRef.current;
    const currentKeys = new Set(table.map(keyOf));
    for (const k of Array.from(map.keys())) {
      if (!currentKeys.has(k)) map.delete(k);
    }
  }, [table]);

  const items = useMemo(() => {
    const map = layoutsRef.current;
    const placed: { leftPct: number; topPct: number }[] = [];

    const toPt = (l: Layout): { leftPct: number; topPct: number } => ({
      leftPct: Number.parseFloat(l.left),
      topPct: Number.parseFloat(l.top),
    });

    for (const card of table) {
      const k = keyOf(card);
      const existingLayout = map.get(k);
      if (existingLayout) {
        placed.push(toPt(existingLayout));
      }
    }

    for (const card of table) {
      const k = keyOf(card);
      if (!map.has(k)) {
        const layout = createScatter(placed);
        map.set(k, layout);
        placed.push(toPt(layout));
      }
    }

    return table
      .map((card) => ({ card, layout: map.get(keyOf(card))! }))
      .sort((a, b) => a.layout.z - b.layout.z);
  }, [table]);

  return (
    <>
      {items.map(({ card, layout }) => (
        <TableCardItem key={keyOf(card)} card={card} layout={layout} />
      ))}
    </>
  );
};

type TableCardProps = {
  card: ICard;
  layout: Layout;
};

const TableCardItem = ({ card, layout }: TableCardProps) => {
  return (
    <Card
      rank={card.rank}
      suit={card.suit}
      disabled
      style={{
        position: "absolute",
        left: layout.left,
        top: layout.top,
        transform: layout.rotate,
        zIndex: Math.round(layout.z),
        transition:
          "transform 0.15s ease-out, left 0.15s ease-out, top 0.15s ease-out",
      }}
    />
  );
};
