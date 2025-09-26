import type { Card } from "@/domain/entities/Card";
import type { GameMode, GameState, Player } from "@/domain/entities/GameState";
import { chooseDealer, dealRound } from "@/domain/services/deal";
import { playCard as domainPlayCard } from "@/domain/services/moves";
import { resolveHands } from "@/domain/services/resolveHands";
import { applyCountingRule } from "@/domain/services/scoring";

export function createGameService(
  getState: () => GameState,
  setState: (s: GameState) => void,
) {
  return {
    setupGame: (mainPlayerId: string, gameMode: GameMode, useBots = true) => {
      const state = getState();
      if (state.phase !== "init") return;
      const players = [mainPlayerId];

      if (gameMode === "1v1") {
        if (useBots) {
          players.push("bot-1");
        } else {
          // TODO: handle waiting for another human player
        }
      }
      if (gameMode === "1v2") {
        if (useBots) {
          players.push("bot-1", "bot-2");
        } else {
          // TODO: handle waiting for another human player
        }
      }
      if (gameMode === "2v2") {
        if (useBots) {
          players.push("bot-1", "bot-2", "bot-3");
        } else {
          // TODO: handle waiting for another human player
        }
      }

      const isTeamPlay = gameMode === "2v2" && players.length === 4;
      const playersConfig: Array<Player> = players.map((id, index) => ({
        id,
        hand: [],
        collected: [],
        score: 0,
        team: isTeamPlay ? (players.indexOf(id) % 2) + 1 : index + 1,
      }));

      const nextState: GameState = {
        ...state,
        phase: "deal",
        players: playersConfig,
        scores: isTeamPlay ? { type: "team", values: {} } : state.scores,
        mainPlayer: mainPlayerId,
      };

      setState(nextState);
    },

    startGame: () => {
      const state = getState();
      if (state.phase !== "deal") return;
      const nextState = chooseDealer(state);
      setState(nextState);
    },

    dealerChoose: (
      dealOrder: "playersThenTable" | "tableThenPlayers",
      tablePattern: "inc" | "dec",
    ) => {
      const state = getState();
      if (state.phase !== "dealerChoice") return;
      const nextState = dealRound(state, {
        dealOrder,
        tablePattern,
        isDealerFirstDeal: true,
      });
      setState(nextState);
    },

    announceSings: () => {
      const state = getState();
      if (state.phase !== "announceSings") return;
      let nextState = resolveHands(state);
      if (nextState.phase !== "gameOver")
        nextState = { ...nextState, phase: "play" };
      setState(nextState);
    },

    playCard: (playerId: string, cardIndex: number) => {
      const state = getState();
      if (state.phase !== "play") return;

      const player = state.players.find((p) => p.id === playerId);
      if (!player) return;
      const card: Card | undefined = player.hand[cardIndex];
      if (!card) return;

      let nextState = domainPlayCard(state, playerId, card);
      const allHandsEmpty = nextState.players.every((p) => p.hand.length === 0);
      if (allHandsEmpty && nextState.deck.length === 0) {
        nextState = { ...nextState, phase: "roundEnd" };
      }
      setState(nextState);
    },

    endRound: () => {
      const state = getState();
      if (state.phase !== "roundEnd") return;

      let nextState = applyCountingRule(state);
      if (nextState.phase === "gameOver") {
        setState(nextState);
        return;
      }

      // rotate dealer to right
      const dealerIdx = nextState.players.findIndex(
        (p) => p.id === nextState.dealer,
      );
      const newDealerIdx =
        (dealerIdx + nextState.players.length + 1) % nextState.players.length;
      const newDealer = nextState.players[newDealerIdx].id;

      nextState = {
        ...nextState,
        dealer: newDealer,
        deck: [],
        table: [],
        phase: "dealerChoice", // new dealer gets to choose again
      };

      setState(nextState);
    },
  };
}
