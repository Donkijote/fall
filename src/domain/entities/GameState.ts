import type { User } from "@/domain/entities/User";

import type { Card, CardWithKey } from "./Card";

export type Phase =
  | "init"
  | "chooseDealer"
  | "dealerChoice"
  | "deal"
  | "announceSings"
  | "play"
  | "roundEnd"
  | "gameOver";

export interface Player {
  id: User["id"];
  hand: Card[];
  collected: Card[];
  score: number;
  team?: number; // for 2v2 (e.g., 0 or 1)
}

export type DealOrder = "playersThenTable" | "tableThenPlayers";
export type TablePattern = "inc" | "dec";
export type GameMode = "1vs1" | "1vs2" | "2vs2";

export type DealerSelection = {
  order: string[];
  turnIndex: number;
  pickedByKey: Record<string, string | null>;
  pickedKeys: Set<string>;
  tieOnlyPlayers?: string[] | null;
  poolSize: number;
};

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
  mainPlayer: User["id"];
  lastPlayedCard?: Card;
  phase: Phase;
  dealer: User["id"];
  currentPlayer: User["id"];
  scores: {
    type: "individual" | "team";
    values: Record<string, number>;
  };
  winner?: string; // playerId or teamId string
  lastCaptureBy: User["id"] | null;
  config: GameConfig;
  dealerSelection?: DealerSelection;
}

export type CapturePlan =
  | { kind: "none" }
  | {
      kind: "match" | "cascade";
      playerId: Player["id"];
      played: CardWithKey;
      targets: Array<CardWithKey>;
    };
