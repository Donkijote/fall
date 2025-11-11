import {
  AnimationKeys,
  animationService,
} from "@/application/services/AnimationService";
import { initialState } from "@/application/store/gameStore";
import { useUIGameStore } from "@/application/store/uiGameStore";
import type { Card } from "@/domain/entities/Card";
import type { GameMode, GameState, Player } from "@/domain/entities/GameState";
import { toCardKey } from "@/domain/helpers/card";
import { dealRound } from "@/domain/services/deal";
import {
  dealerCardSelection,
  setUpDealerSelection,
} from "@/domain/services/dealer";
import {
  analyzePlay,
  finalizeAfterPlay,
  removeCardsFromHand,
  updateTableAndHandCards,
} from "@/domain/services/moves";
import { resolveHands } from "@/domain/services/resolveHands";
import { applyCountingRule } from "@/domain/services/scoring";

const uiService = useUIGameStore.getState().service;

export function createGameService(
  getState: () => GameState,
  setState: (s: GameState) => void,
) {
  async function updateStateAndRunBotsAndContinueFlow(
    nextState: GameState,
    animationCallback?: () => Promise<void>,
  ) {
    setState(nextState);

    if (animationCallback) {
      try {
        await animationCallback();
      } catch (err) {
        console.warn("Animation callback failed or skipped:", err);
      }
    }

    if (
      nextState.phase === "play" &&
      nextState?.currentPlayer?.startsWith("bot-")
    ) {
      await api.playBotTurn(nextState.currentPlayer);
    }

    if (
      nextState.phase === "dealerChoice" &&
      nextState.dealer?.startsWith("bot-")
    ) {
      await api.botDealerChoose(nextState.dealer);
    }

    if (
      nextState.phase === "chooseDealer" &&
      nextState.currentPlayer?.startsWith("bot-")
    ) {
      await api.botPickDealerCard(nextState.currentPlayer);
    }
  }

  const api = {
    setupGame: async (
      mainPlayerId: string,
      gameMode: GameMode,
      useBots = true,
    ) => {
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

      await updateStateAndRunBotsAndContinueFlow(nextState);
    },

    startGame: async () => {
      const state = getState();
      if (state.phase !== "deal") return;

      const nextState: GameState = {
        ...state,
        ...setUpDealerSelection(state),
        phase: "chooseDealer",
        dealer: "",
        deck: [],
      } as GameState;

      await updateStateAndRunBotsAndContinueFlow(nextState);
    },

    resetGameState: () => {
      setState(initialState);
    },

    pickDealerCard: async (cardKey: string) => {
      const state = getState();
      if (state.phase !== "chooseDealer") return;

      await updateStateAndRunBotsAndContinueFlow(
        dealerCardSelection(state, cardKey),
      );
    },

    dealerChoose: async (
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
      await updateStateAndRunBotsAndContinueFlow(nextState);
    },

    announceSings: async () => {
      const state = getState();
      if (state.phase !== "announceSings") return;
      let nextState = resolveHands(state);
      if (nextState.phase !== "gameOver")
        nextState = { ...nextState, phase: "play" };
      await updateStateAndRunBotsAndContinueFlow(nextState);
    },

    playCard: async (playerId: string, cardIndex: number) => {
      const state = getState();
      if (state.phase !== "play") return;

      const player = state.players.find((p) => p.id === playerId);
      if (!player) return;

      const card: Card | undefined = player.hand[cardIndex];
      if (!card) return;

      const analysis = analyzePlay(state, playerId, card);
      if (!analysis.ok) return;

      const stateAfterRemoveCardsFromHand = removeCardsFromHand(
        state,
        playerId,
        card,
      );

      const playedKey = toCardKey(card);
      const firstTarget =
        analysis.capturePlan.kind === "none"
          ? null
          : analysis.capturePlan.targets[0];

      uiService.setPlayingCard(card);

      if (firstTarget) {
        uiService.setCaptureOverride({
          fromKey: playedKey,
          toKey: toCardKey(firstTarget),
        });
      } else {
        uiService.setCaptureOverride(null);
      }

      const stateAfterAddRemovedCardToTable = {
        ...stateAfterRemoveCardsFromHand,
        table: [...stateAfterRemoveCardsFromHand.table, card],
      };
      setState(stateAfterAddRemovedCardToTable);

      if (analysis.capturePlan.kind !== "none") {
        await animationService.run([
          {
            key: AnimationKeys.GAME_CARDS,
            payload: { suit: card.suit, rank: card.rank },
          },
        ]);
      }

      if (analysis.capturePlan.kind !== "none") {
        const targets = analysis.capturePlan.targets;
        uiService.addCascadeFollower(targets[0].key);

        for (let i = 1; i < targets.length; i++) {
          const target = targets[i];

          uiService.setCaptureOverride({
            fromKey: playedKey,
            toKey: target.key,
          });

          await animationService.run([
            {
              key: AnimationKeys.GAME_CARDS,
              payload: { suit: card.suit, rank: card.rank },
            },
          ]);

          uiService.addCascadeFollower(target.key);
        }
      }

      const stateAfterUpdateTableAndHandCards = updateTableAndHandCards(
        stateAfterAddRemovedCardToTable,
        playerId,
        card,
        analysis.capturePlan,
      );

      setState(stateAfterUpdateTableAndHandCards);
      uiService.clearUI();

      if (analysis.capturePlan.kind !== "none") {
        await animationService.run([
          {
            key: AnimationKeys.PILE_COLLECT,
            payload: { suit: card.suit, rank: card.rank },
          },
        ]);
      }

      let stateAfterFinalizeAfterPlay = finalizeAfterPlay(
        stateAfterUpdateTableAndHandCards,
        playerId,
        card,
      );

      const allHandsEmpty = stateAfterFinalizeAfterPlay.players.every(
        (p) => p.hand.length === 0,
      );
      if (allHandsEmpty && stateAfterFinalizeAfterPlay.deck.length === 0) {
        stateAfterFinalizeAfterPlay = {
          ...stateAfterFinalizeAfterPlay,
          phase: "roundEnd" as const,
        };
      }

      await updateStateAndRunBotsAndContinueFlow(stateAfterFinalizeAfterPlay);
    },

    endRound: async () => {
      const state = getState();
      if (state.phase !== "roundEnd") return;

      let nextState = applyCountingRule(state);
      if (nextState.phase === "gameOver") {
        await updateStateAndRunBotsAndContinueFlow(nextState);
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

      await updateStateAndRunBotsAndContinueFlow(nextState);
    },

    playBotTurn: async (botId: string) => {
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

    botDealerChoose: async (botId: string) => {
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

    botPickDealerCard: async (botId: string) => {
      const state = getState();
      if (state.phase !== "chooseDealer" || state.currentPlayer !== botId)
        return;

      const sel = state.dealerSelection!;
      const availableKeys = state.table
        .map((c) => `${c.suit}-${c.rank}`)
        .filter((k) => !sel.pickedKeys.has(k));

      if (availableKeys.length === 0) return;

      const choice =
        availableKeys[Math.floor(Math.random() * availableKeys.length)];

      setTimeout(() => {
        const newState = getState();
        if (
          newState.phase === "chooseDealer" &&
          newState.currentPlayer === botId
        ) {
          api.pickDealerCard(choice);
        }
      }, 800);
    },
  };

  return api;
}
