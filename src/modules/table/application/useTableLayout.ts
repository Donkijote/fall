import { useMemo, useState } from "react";

import type { Card } from "@/domain/entities/Card";

import { randomScatter } from "../domain/randomScatter";
import type { Placement } from "../entities/types";

const scatter = (
  table: Card[],
  existingPlacements = new Map<string, Placement>(),
) =>
  randomScatter({
    table,
    existingPlacements,
    constraints: { minDistPct: 8, maxAttempts: 20 },
  }).placements;

export const useTableLayout = (table: Card[]) => {
  const [layout, setLayout] = useState(() => ({
    table,
    placements: scatter(table),
  }));

  if (layout.table !== table) {
    setLayout({ table, placements: scatter(table, layout.placements) });
  }

  return useMemo(
    () => [...layout.placements.values()].sort((a, b) => a.z - b.z),
    [layout.placements],
  );
};
