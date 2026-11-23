import type { Card } from "@/domain/entities/Card";
import type { GameMode } from "@/domain/entities/GameState";
import { toCardKey } from "@/domain/helpers/card";
import { createDeck } from "@/domain/rules/deck";
import { createMatchState } from "@/domain/services/matchSetup";

import { playMatchCard } from "./localMatch";

export type CleanTableCase = "capture" | "cascade" | "fall" | "last-round" | "no-clear" | "winning";
export type CleanTableSettings = { mode: GameMode; example: CleanTableCase; player: number };

/** A complete deterministic deck; only the shared play service decides awards. */
export function cleanTablePreview({ mode, example, player: seat }: CleanTableSettings) {
  const before = createMatchState("local", mode);
  const actor = before.players[seat % before.players.length];
  const played: Card = { suit: "coins", rank: 3 };
  const target: Card = { suit: "cups", rank: 3 };
  before.phase = "play";
  before.currentPlayer = actor.id;
  before.dealer = before.players.at(-1)!.id;
  before.table = [target];
  if (example === "cascade")
    before.table.push({ suit: "clubs", rank: 4 }, { suit: "swords", rank: 5 });
  if (example === "no-clear") before.table.push({ suit: "clubs", rank: 7 });
  if (example === "fall") before.lastPlayedCard = target;
  const used = new Set([...before.table, played].map(toCardKey));
  const rest = createDeck().filter((card) => !used.has(toCardKey(card)));
  for (const player of before.players) {
    player.hand = player.id === actor.id ? [played, ...rest.splice(0, 1)] : rest.splice(0, 2);
    before.scores.values[String(player.team)] = 0;
  }
  if (example === "winning") before.scores.values[String(actor.team)] = 20;
  if (example === "last-round")
    before.players.find((player) => player.id !== actor.id)!.collected = rest;
  else before.deck = rest;
  const frames = playMatchCard(before, actor.id, played);
  const capture = frames[0];
  const resolved = frames.at(-1)!.state;
  const award = resolved.scoreAwards?.find((award) => award.reason === "clear");
  return { before, capture, resolved, award };
}
