import type { GameMode } from "@/domain/entities/GameState";

import type { MatchFrame } from "./localMatch";

// Match the domain’s counterclockwise turn order as seen from above.
const seatsByMode = {
  "1vs1": ["bottom", "top"],
  "1vs2": ["bottom", "upper-right", "upper-left"],
  "2vs2": ["bottom", "right", "top", "left"],
} as const satisfies Record<GameMode, readonly string[]>;

export type MatchSeat = (typeof seatsByMode)[GameMode][number];

export function getMatchSeats(mode: GameMode) {
  return seatsByMode[mode];
}

export const simulatedGuests = [{ name: "Inés" }, { name: "Mateo" }, { name: "Lucía" }] as const;

/** Deal playback owns the seat indicator until the completed frame hands off play. */
export function getActiveSeatPlayer({ state, motion }: MatchFrame) {
  if (motion?.kind === "deal") return motion.dealer;
  if (state.phase === "dealerChoice") return state.dealer;
  if (state.phase === "play") return state.currentPlayer;
  return undefined;
}
