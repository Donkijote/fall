import type { Hand } from "@/domain/rules/hands";

import type { Card } from "./Card";

export type PlayerId = string;

export type Phase =
  | "chooseDealer"
  | "dealerChoice"
  | "deal"
  | "announceSings"
  | "play"
  | "roundEnd"
  | "gameOver";

export interface Player {
  id: PlayerId;
  hand: Card[];
  collected: Card[];
  score: number;
  team?: number; // for 2v2 (e.g., 0 or 1)
}

export interface Contender {
  player: Player["id"];
  hand: Hand;
  rank: number;
}

export type DealOrder = "playersThenTable" | "tableThenPlayers";
export type TablePattern = "inc" | "dec";

export interface GameConfig {
  allowOptional: boolean;
  threeOfAKindWinsGame: boolean;
  dealOrder: DealOrder;
  tablePattern: TablePattern;
  handSize: number;
  targetPoints: number;
}

export interface GameState {
  players: Player[];
  table: Card[];
  deck: Card[];
  phase: Phase;
  dealer: PlayerId;
  currentPlayer: PlayerId;
  scores: {
    type: "individual" | "team";
    values: Record<string, number>;
  };
  winner?: string; // playerId or teamId string
  config: GameConfig;
}
