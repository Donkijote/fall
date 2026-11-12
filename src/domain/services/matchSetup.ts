import type { GameMode, GameState } from "../entities/GameState";

const seatCount: Record<GameMode, number> = { "1vs1": 2, "1vs2": 3, "2vs2": 4 };

export function createMatchState(mainPlayer: string, mode: GameMode, useBots = true): GameState {
  const count = useBots ? seatCount[mode] : 1;
  const teams = mode === "2vs2" && count === 4;
  return {
    players: Array.from({ length: count }, (_, index) => ({
      id: index === 0 ? mainPlayer : `bot-${index}`,
      hand: [],
      collected: [],
      score: 0,
      team: (teams ? index % 2 : index) + 1,
    })),
    table: [],
    deck: [],
    mainPlayer,
    phase: "deal",
    dealer: "",
    currentPlayer: "",
    scores: { type: teams ? "team" : "individual", values: {} },
    lastCaptureBy: null,
    config: {
      allowOptional: true,
      threeOfAKindWinsGame: false,
      dealOrder: "playersThenTable",
      tablePattern: "inc",
      handSize: 3,
      targetPoints: 24,
    },
  };
}

export function rotateDealer(state: GameState): GameState {
  const index = state.players.findIndex((player) => player.id === state.dealer);
  const dealer = state.players[(index + 1) % state.players.length].id;
  const { lastPlayedCard: _, ...round } = state;
  return {
    ...round,
    dealer,
    currentPlayer: dealer,
    deck: [],
    table: [],
    phase: "dealerChoice",
    lastCaptureBy: null,
  };
}
