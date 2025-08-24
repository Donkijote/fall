import type { Card, GameState, Player, Rank } from "../entities/GameState";
import { shuffle } from "../rules/deck";

export function initialDeal(
  base: Omit<GameState, "deck" | "phase" | "turn" | "table" | "history">,
  seedDeck: Card[],
): GameState {
  const deck = shuffle(seedDeck);
  const players = base.players.map((p) => ({ ...p, hand: [], captured: [] }));
  let idx = 0;

  const give = (p: Player, n: number) => {
    p.hand.push(...deck.slice(idx, idx + n));
    idx += n;
  };

  const tableCards: Card[] = [];

  if (base.config.dealOrder === "playersThenTable") {
    players.forEach((p) => give(p, base.config.handSize));
    tableCards.push(...deck.slice(idx, idx + 4));
    idx += 4;
  } else {
    tableCards.push(...deck.slice(idx, idx + 4));
    idx += 4;
    players.forEach((p) => give(p, base.config.handSize));
  }

  const pattern = base.config.tablePattern; // 'inc' or 'dec'
  const expected = pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1];
  let bonus = 0;
  tableCards.forEach((c, i) => {
    if (c.rank === (expected[i] as Rank)) bonus += 1;
  });

  // Who gets the bonus? The dealer’s choice typically applies globally;
  // award to dealer’s team/player.
  const dealer = base.dealer;
  const table = { cards: tableCards, pattern, bonusAwardedTo: dealer };
  const score = structuredClone(base.score);
  if (bonus > 0) {
    const basePlayer = base.players.find((p) => p.id === dealer);
    if (base.config.variant === "2v2" && basePlayer) {
      const dealerTeam = basePlayer.team!;
      score.teams![dealerTeam] = (score.teams![dealerTeam] ?? 0) + bonus;
    } else {
      score.players[dealer] = (score.players[dealer] ?? 0) + bonus;
    }
  }

  return {
    ...base,
    deck: deck.slice(idx),
    table,
    players,
    phase: "announceSings",
    turn: null,
    history: [],
    score,
  };
}
