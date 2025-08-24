export type Suit = "golds" | "cups" | "blades" | "clubs";

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 10 | 11 | 12 | 8 | 9;

export interface Card {
  id: string; // `${suit}-${rank}-${uuid}`
  suit: Suit;
  rank: Rank;
}

export interface Hand {
  name: string;
  points: number; // normal points (or Infinity if instant win)
  mandatory: boolean;
  test: (hand: Card[]) => boolean;
  rankStrength: (hand: Card[]) => number; // used for tie-breaking
}

export type PlayerId = string;

export interface Player {
  id: string;
  name: string;
  team?: number; // only used in 2v2 (0 or 1)
  hand: Card[];
  captures: Card[];
}

export type Variant = "1v1" | "1v1v1" | "2v2";

export type DealOrder = "playersThenTable" | "tableThenPlayers";
export type TablePattern = "inc" | "dec"; // 1-2-3-4 or 4-3-2-1

export interface Config {
  variant: Variant;
  use48CardDeck: boolean;
  dealOrder: DealOrder;
  tablePattern: TablePattern;
  targetPoints: number; // 24
  handSize: number; // 3
}

export type Phase =
  | "drawForDealer"
  | "chooseDealOrderAndPattern"
  | "deal"
  | "announceSings"
  | "turn"
  | "roundEnd"
  | "deckEndCount"
  | "gameOver";

export interface Turn {
  currentPlayer: PlayerId;
  legalMoves: Move[];
}

export type Move =
  | { kind: "PLAY_TO_TABLE"; cardId: string }
  | { kind: "CAPTURE"; cardId: string; targetCardIds: string[] } // start simple: 1-to-1 capture for now
  | { kind: "DECLARE_SING"; code: string };

export interface TableState {
  cards: Card[];
  // track table bonus this round
  pattern?: TablePattern;
  bonusAwardedTo?: PlayerId | number; // team id
}

export interface Score {
  players?: Record<string, number>; // for 1v1, 1v1v1
  teams?: Record<number, number>; // for 2v2
}

export interface GameState {
  variant: Variant;
  players: Player[];
  dealer: string;
  turn?: string;
  table: Card[];
  lastPlayed?: Card;
  score: Score;
  phase: "deal" | "announceSings" | "playCard" | "roundEnd" | "gameOver";
  config: {
    allowOptional: boolean;
    threeOfAKindWinsGame: boolean;
  };
}
