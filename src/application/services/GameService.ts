import { initialState } from "@/application/store/gameStore";
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
  function withBotCheck(nextState: GameState) {
    setState(nextState);

    if (nextState?.currentPlayer?.startsWith("bot-")) {
      api.playBotTurn(nextState.currentPlayer);
    }

    if (
      nextState.phase === "dealerChoice" &&
      nextState.dealer?.startsWith("bot-")
    ) {
      api.botDealerChoose(nextState.dealer);
    }
  }

  const api = {
    setupGame: (mainPlayerId: string, gameMode: GameMode, useBots = true) => {
      const state = getState();
      if (state.phase !== "init") return;
      const players = [mainPlayerId];

      if (gameMode === "1vs1") {
        if (useBots) players.push("bot-1");
      }
      if (gameMode === "1vs2") {
        if (useBots) players.push("bot-1", "bot-2");
      }
      if (gameMode === "2vs2") {
        if (useBots) players.push("bot-1", "bot-2", "bot-3");
      }

      const isTeamPlay = gameMode === "2vs2" && players.length === 4;
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

      withBotCheck(nextState);
    },

    startGame: () => {
      const state = getState();
      if (state.phase !== "deal") return;
      const nextState = chooseDealer(state);
      withBotCheck(nextState);
    },

    resetGameState: () => {
      setState(initialState);
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
      withBotCheck(nextState);
    },

    announceSings: () => {
      const state = getState();
      if (state.phase !== "announceSings") return;
      let nextState = resolveHands(state);
      if (nextState.phase !== "gameOver")
        nextState = { ...nextState, phase: "play" };
      withBotCheck(nextState);
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

      withBotCheck(nextState);
    },

    endRound: () => {
      const state = getState();
      if (state.phase !== "roundEnd") return;

      let nextState = applyCountingRule(state);
      if (nextState.phase === "gameOver") {
        withBotCheck(nextState);
        return;
      }

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
        phase: "dealerChoice",
      };

      withBotCheck(nextState);
    },

    playBotTurn: (botId: string) => {
      const state = getState();
      const bot = state.players.find((p) => p.id === botId);
      if (!bot || bot.hand.length === 0) return;

      const randomIndex = Math.floor(Math.random() * bot.hand.length);

      setTimeout(() => {
        const newState = getState();
        if (newState.currentPlayer === botId) {
          api.playCard(botId, randomIndex);
        }
      }, 1000);
    },

    botDealerChoose: (botId: string) => {
      const state = getState();
      if (state.phase !== "dealerChoice" || state.dealer !== botId) return;

      const dealOrders: Array<"playersThenTable" | "tableThenPlayers"> = [
        "playersThenTable",
        "tableThenPlayers",
      ];
      const tablePatterns: Array<"inc" | "dec"> = ["inc", "dec"];

      const randomOrder =
        dealOrders[Math.floor(Math.random() * dealOrders.length)];
      const randomPattern =
        tablePatterns[Math.floor(Math.random() * tablePatterns.length)];

      setTimeout(() => {
        api.dealerChoose(randomOrder, randomPattern);
      }, 1000);
    },
  };

  return api;
}
