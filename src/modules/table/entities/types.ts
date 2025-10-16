import type { Card } from "@/domain/entities/Card";

export type Placement = {
  key: string;
  leftPct: number;
  topPct: number;
  rotationDeg: number;
  z: number;
};

export type LayoutInput = {
  table: Card[];
  existingPlacements: Map<string, Placement>;
  constraints?: {
    minDistPct?: number;
    maxAttempts?: number;
  };
};

export type LayoutOutput = {
  placements: Map<string, Placement>;
};
