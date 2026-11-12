import type { Card } from "@/domain/entities/Card";
import type { DealOrder, GameMode, GameState, TablePattern } from "@/domain/entities/GameState";
import { toCardKey } from "@/domain/helpers/card";
import { dealRound } from "@/domain/services/deal";
import { dealerCardSelection, setUpDealerSelection } from "@/domain/services/dealer";
import { createMatchState, rotateDealer } from "@/domain/services/matchSetup";
import {
  analyzePlay,
  finalizeAfterPlay,
  removeCardsFromHand,
  updateTableAndHandCards,
} from "@/domain/services/moves";
import { resolveHands } from "@/domain/services/resolveHands";
import { applyCountingRule, getCountingGroups } from "@/domain/services/scoring";

export const localPlayerId = "local";

export type MatchMotion =
  | { kind: "deal"; cards: string[]; dealer: string }
  | { kind: "play"; card: string; player: string }
  | { kind: "collect"; cards: string[]; player: string }
  | {
      kind: "count";
      groups: ReturnType<typeof getCountingGroups>;
      piles: { player: string; side: number; cards: number }[];
    };

export type MatchFrame = { state: GameState; motion?: MatchMotion };

export function startMatch(mode: GameMode): MatchFrame[] {
  let state: GameState = {
    ...setUpDealerSelection(createMatchState(localPlayerId, mode)),
    phase: "chooseDealer",
  };
  // Local seats draw blindly. Use the same draw and tie-break rules as a regular match.
  while (state.phase === "chooseDealer") {
    const available = state.table.filter(
      (card) => !state.dealerSelection!.pickedKeys.has(toCardKey(card)),
    );
    state = dealerCardSelection(state, toCardKey(available[0]));
  }
  return [{ state }];
}

function dealFrames(state: GameState, table: Card[] = []): MatchFrame[] {
  const hands = state.players.flatMap(({ hand }) => hand);
  const cards = (
    state.config.dealOrder === "playersThenTable" ? [...hands, ...table] : [...table, ...hands]
  ).map(toCardKey);
  const announced = resolveHands(state);
  return [
    { state, motion: { kind: "deal", cards, dealer: state.dealer } },
    { state: { ...announced, phase: announced.phase === "gameOver" ? "gameOver" : "play" } },
  ];
}

export function openDeal(
  state: GameState,
  dealOrder: DealOrder,
  tablePattern: TablePattern,
): MatchFrame[] {
  if (state.phase !== "dealerChoice") return [];
  const dealt = dealRound(state, { dealOrder, tablePattern, isDealerFirstDeal: true });
  return dealFrames(dealt, dealt.table);
}

export function playMatchCard(state: GameState, player: string, card: Card): MatchFrame[] {
  if (state.phase !== "play") return [];
  const analysis = analyzePlay(state, player, card);
  if (!analysis.ok) return [];
  const plan = analysis.capturePlan;
  const played = {
    ...removeCardsFromHand(state, player, card),
    table: [...state.table, card],
  };
  const cardKey = toCardKey(card);
  const frames: MatchFrame[] = [{ state: played, motion: { kind: "play", card: cardKey, player } }];
  const captured =
    plan.kind === "none" ? played : updateTableAndHandCards(played, player, card, plan);
  if (plan.kind !== "none") {
    frames.push({
      state: played,
      motion: { kind: "collect", cards: [cardKey, ...plan.targets.map(({ key }) => key)], player },
    });
  }

  const next = finalizeAfterPlay(captured, player, card, analysis.isFall);
  if (next.phase === "announceSings") return [...frames, ...dealFrames(next)];
  if (next.phase === "roundEnd") {
    if (captured.table.length) {
      frames.push({
        state: captured,
        motion: {
          kind: "collect",
          cards: captured.table.map(toCardKey),
          player: captured.lastCaptureBy ?? captured.dealer,
        },
      });
    }
  }
  return [...frames, { state: next }];
}

export function countRound(state: GameState): MatchFrame[] {
  if (state.phase !== "roundEnd") return [];
  const scored = applyCountingRule(state);
  return [
    {
      state,
      motion: {
        kind: "count",
        groups: getCountingGroups(state),
        piles: state.players.map(({ id, team, collected }) => ({
          player: id,
          side: team,
          cards: collected.length,
        })),
      },
    },
    { state: scored.phase === "gameOver" ? scored : rotateDealer(scored) },
  ];
}

export function simulateTurn(state: GameState): MatchFrame[] {
  if (state.phase === "dealerChoice" && state.dealer !== localPlayerId) {
    return openDeal(
      state,
      Math.random() < 0.5 ? "playersThenTable" : "tableThenPlayers",
      Math.random() < 0.5 ? "inc" : "dec",
    );
  }
  if (state.phase === "roundEnd") return countRound(state);
  if (state.phase !== "play" || state.currentPlayer === localPlayerId) return [];
  const player = state.players.find(({ id }) => id === state.currentPlayer);
  if (!player?.hand.length) return [];
  const card = player.hand[Math.floor(Math.random() * player.hand.length)];
  return playMatchCard(state, player.id, card);
}
