import type { GameMode } from "@/domain/entities/GameState";

const seatsByMode = {
  "1vs1": ["bottom", "top"],
  "1vs2": ["bottom", "upper-left", "upper-right"],
  "2vs2": ["bottom", "left", "top", "right"],
} as const satisfies Record<GameMode, readonly string[]>;

export type MatchSeat = (typeof seatsByMode)[GameMode][number];

export function getMatchSeats(mode: GameMode) {
  return seatsByMode[mode];
}

export const previewGuests = [{ name: "Inés" }, { name: "Mateo" }, { name: "Lucía" }] as const;
