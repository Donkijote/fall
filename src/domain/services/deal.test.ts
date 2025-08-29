import { expect } from "vitest";

import { initialState } from "@/application/store/gameStore";
import { createDeck } from "@/domain/rules/deck";

import { applyTablePatternBonus, chooseDealer, dealRound } from "./deal";

describe("Deal", () => {
  it("should choose dealer", () => {
    const dealer = chooseDealer(initialState);
    expect(dealer.dealer).toBeDefined();
    expect(dealer.phase).toBe("dealerChoice");
  });
  it("should deal table when isDealerFirstDeal is true and players first", () => {
    const state = chooseDealer(initialState);
    const result = dealRound(state, { isDealerFirstDeal: true });
    expect(result.table.length).toBe(4);
    for (const p of result.players) {
      expect(p.hand.length).toBe(3);
    }
  });
  it("should deal table when isDealerFirstDeal is true and table first", () => {
    const state = chooseDealer(initialState);
    const deckWithDuplicatedCard = [...state.deck];
    deckWithDuplicatedCard.unshift(deckWithDuplicatedCard[0]);
    const result = dealRound(
      { ...state, deck: deckWithDuplicatedCard },
      {
        isDealerFirstDeal: true,
        tablePattern: "dec",
        dealOrder: "tableThenPlayers",
      },
    );
    expect(result.table.length).toBe(4);
    for (const p of result.players) {
      expect(p.hand.length).toBe(3);
    }
  });
  it("should deal only players", () => {
    const state = chooseDealer(initialState);
    const result = dealRound(state, {
      isDealerFirstDeal: false,
    });
    expect(result.table.length).toBe(0);
    for (const p of result.players) {
      expect(p.hand.length).toBe(3);
    }
  });
  it("should apply table bonus", () => {
    const deck = createDeck();
    const state = applyTablePatternBonus(
      { ...initialState, dealer: initialState.players[0].id },
      [deck[0], deck[1], deck[2], deck[3]],
      "inc",
    );

    expect(state).toStrictEqual({
      ...initialState,
      dealer: initialState.players[0].id,
      scores: {
        type: "individual",
        values: {
          [initialState.players[0].id]: 10,
        },
      },
    });
  });
});
