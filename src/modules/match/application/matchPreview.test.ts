import { getMatchSeats, getPreviewBoard } from "./matchPreview";

test.each(["1vs1", "1vs2", "2vs2"] as const)(
  "the %s board accounts for all 40 cards without duplicates",
  (mode) => {
    const { players, table, drawPile, dealerIndex } = getPreviewBoard(mode);
    expect(players).toHaveLength(getMatchSeats(mode).length);
    expect(players[dealerIndex]).toBeDefined();
    expect(table).toHaveLength(6);
    for (const { hand, collected } of players) {
      expect(hand).toHaveLength(3);
      expect(collected.length).toBeGreaterThan(0);
    }
    const cards = [
      ...table,
      ...drawPile,
      ...players.flatMap(({ hand, collected }) => [...hand, ...collected]),
    ];
    expect(cards).toHaveLength(40);
    expect(new Set(cards.map(({ rank, suit }) => `${suit}-${rank}`)).size).toBe(40);
  },
);
