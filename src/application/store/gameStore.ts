import { create } from "zustand";

import type { GameState } from "@/domain/entities/GameState";

import { createGameService } from "../services/GameService";

export const mockedState: GameState = {
  players: [],
  table: [],
  deck: [],
  phase: "init",
  dealer: "",
  mainPlayer: "",
  currentPlayer: "",
  scores: { type: "individual", values: {} },
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

export const mockedStateWithPlayers: GameState = {
  ...mockedState,
  players: ["1", "bot-1"].map((id, index) => ({
    id,
    hand: [],
    collected: [],
    score: 0,
    team: index + 1,
  })),
  mainPlayer: "1",
};

export const initialState: GameState = {
  players: [],
  table: [],
  deck: [],
  phase: "init",
  dealer: "",
  currentPlayer: "",
  mainPlayer: "",
  scores: { type: "individual", values: {} },
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

export type GameStore = {
  state: GameState;
  service: ReturnType<typeof createGameService>;
};

export const useGameStore = create<GameStore>((set, get) => {
  const setState = (s: GameState) => set({ state: s });
  const service = createGameService(() => get().state, setState);

  return {
    state: initialState,
    service,
  };
});
