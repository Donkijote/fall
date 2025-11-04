import { expect } from "vitest";

import { mockedStateWithPlayers } from "@/application/store/gameStore";
import { createDeck } from "@/domain/rules/deck";

import { applyTablePatternBonus, dealRound } from "./deal";

const stateWithDealer = {
  ...mockedStateWithPlayers,
  dealer: mockedStateWithPlayers.players[0].id,
};

describe("Deal", () => {
  it("should apply table bonus", () => {
    const deck = createDeck();
    const state = applyTablePatternBonus(
      stateWithDealer,
      [deck[0], deck[1], deck[2], deck[3]],
      "inc",
    );

    expect(state).toStrictEqual({
      ...stateWithDealer,
      dealer: stateWithDealer.players[0].id,
      scores: {
        type: "individual",
        values: {
          [stateWithDealer.players[0].id]: 10,
        },
      },
    });
  });

  it("should deal table first then players", () => {
    const state = dealRound(mockedStateWithPlayers, {
      dealOrder: "tableThenPlayers",
      isDealerFirstDeal: true,
    });

    expect(state).toStrictEqual({
      ...state,
      table: expect.any(Array),
    });
  });
});
