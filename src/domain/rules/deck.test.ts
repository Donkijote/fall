import { createDeck, shuffle } from "@/domain/rules/deck";

describe("Deck", () => {
  it("should create an instance of Deck", () => {
    const deck = createDeck();
    expect(deck.length).toBe(40);
  });
  it("should shuffle the deck", () => {
    const deck = createDeck();
    const shuffledDeck = shuffle(deck);
    expect(shuffledDeck).not.toEqual(deck);
  });
});
