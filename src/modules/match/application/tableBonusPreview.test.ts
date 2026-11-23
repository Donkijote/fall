import { tableBonusPreview } from "./tableBonusPreview";

it.each(["1vs1", "1vs2", "2vs2"] as const)(
  "resolves both patterns and orders for every dealer in %s",
  (mode) => {
    const seats = mode === "1vs1" ? 2 : mode === "1vs2" ? 3 : 4;
    for (const pattern of ["inc", "dec"] as const) {
      for (const order of ["playersThenTable", "tableThenPlayers"] as const) {
        for (let dealer = 0; dealer < seats; dealer++) {
          const { before, resolved } = tableBonusPreview(mode, pattern, order, "perfect", dealer);
          expect(resolved.table.map(({ rank }) => rank)).toEqual(
            pattern === "inc" ? [1, 2, 3, 4] : [4, 3, 2, 1],
          );
          expect(resolved.scoreAwards).toEqual([
            expect.objectContaining({
              amount: 10,
              player: before.dealer,
              side: String(before.players[dealer].team),
              sourceCards: resolved.table.map(({ suit, rank }) => `${suit}-${rank}`),
            }),
          ]);
          expect(resolved.players.every(({ hand }) => hand.length === 3)).toBe(true);
          const cards = [
            ...resolved.table,
            ...resolved.deck,
            ...resolved.players.flatMap(({ hand }) => hand),
          ];
          expect(new Set(cards.map(({ suit, rank }) => `${suit}-${rank}`)).size).toBe(40);
        }
      }
    }
  },
);

it.each(["inc", "dec"] as const)(
  "keeps partial and interrupted pattern awards authoritative (%s)",
  (pattern) => {
    const partial = tableBonusPreview("2vs2", pattern, "tableThenPlayers", "partial", 1).resolved;
    expect(partial.scoreAwards?.[0]).toMatchObject({
      amount: pattern === "inc" ? 6 : 9,
      sourceCards: partial.table.slice(0, 3).map(({ suit, rank }) => `${suit}-${rank}`),
    });
    const broken = tableBonusPreview("1vs2", pattern, "playersThenTable", "broken", 2).resolved;
    expect(broken.scoreAwards?.[0]).toMatchObject({
      amount: pattern === "inc" ? 8 : 7,
      sourceCards: broken.table
        .filter((_, index) => index !== 1)
        .map(({ suit, rank }) => `${suit}-${rank}`),
    });
    expect(
      tableBonusPreview("1vs1", pattern, "tableThenPlayers", "none", 0).resolved.scoreAwards,
    ).toBeUndefined();
  },
);

it("resolves the winning result before animation playback", () => {
  const { before, resolved } = tableBonusPreview("2vs2", "dec", "playersThenTable", "winning", 3);
  expect(before.scores.values).toEqual({ "2": 20 });
  expect(resolved.scores.values).toEqual({ "2": 30 });
  expect(resolved).toMatchObject({ phase: "gameOver", winner: "2" });
  expect(resolved.scoreAwards?.[0].amount).toBe(10);
});
