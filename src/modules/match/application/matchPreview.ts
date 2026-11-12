import type { GameMode } from "@/domain/entities/GameState";
import { createDeck } from "@/domain/rules/deck";

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

const collectedByMode = {
  "1vs1": [7, 9],
  "1vs2": [4, 7, 5],
  "2vs2": [2, 3, 3, 2],
} satisfies Record<GameMode, number[]>;

export function getPreviewBoard(mode: GameMode) {
  const deck = createDeck();
  // A fixed stride visits every card once and keeps the layout repeatable.
  const drawPile = deck.map((_, index) => deck[(index * 13) % deck.length]);
  const table = drawPile.splice(0, 6);
  const hands = collectedByMode[mode].map(() => drawPile.splice(0, 3));
  const players = collectedByMode[mode].map((count, index) => ({
    hand: hands[index],
    collected: drawPile.splice(0, count),
  }));
  return { table, players, drawPile, dealerIndex: mode === "1vs1" ? 0 : 1 };
}
