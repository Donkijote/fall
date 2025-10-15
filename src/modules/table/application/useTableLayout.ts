import { useMemo, useRef } from "react";

import type { Card } from "@/domain/entities/Card";

import { randomScatter } from "../domain/randomScatter";
import type { Placement } from "../entities/types";

export const useTableLayout = (table: Card[]) => {
  const placementsRef = useRef<Map<string, Placement>>(new Map());

  const placements = useMemo(() => {
    const { placements } = randomScatter({
      table,
      existingPlacements: placementsRef.current,
      constraints: { minDistPct: 8, maxAttempts: 20 },
    });
    placementsRef.current = placements;
    return placements;
  }, [table]);

  return useMemo(
    () => [...placements.values()].sort((a, b) => a.z - b.z),
    [placements],
  );
};
