import { create } from "zustand";

import type { GameState } from "@/domain/entities/GameState";

import { createGameService } from "../GameService";

export const initialState: GameState = {
  players: [
    {
      id: "1",
      hand: [],
      collected: [],
      score: 0,
      team: 1,
    },
    {
      id: "3",
      hand: [],
      collected: [],
      score: 0,
      team: 2,
    },
    {
      id: "2",
      hand: [],
      collected: [],
      score: 0,
      team: 1,
    },
    {
      id: "4",
      hand: [],
      collected: [],
      score: 0,
      team: 2,
    },
  ],
  table: [],
  deck: [],
  phase: "deal",
  dealer: "",
  currentPlayer: "",
  scores: { type: "team", values: {} },
  config: {
    allowOptional: true,
    threeOfAKindWinsGame: false,
    dealOrder: "playersThenTable",
    tablePattern: "inc",
    handSize: 3,
    targetPoints: 24,
  },
};

export type GameStore = {
  state: GameState;
  service: ReturnType<typeof createGameService>;
};

export const useGameStore = create<GameStore>((set, get) => {
  const setState = (s: GameState) => set({ state: s });
  const service = createGameService(() => get().state as GameState, setState);

  return {
    state: initialState,
    service,
  };
});
