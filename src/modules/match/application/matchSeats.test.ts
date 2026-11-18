import { dealRound } from "@/domain/services/deal";
import { createMatchState } from "@/domain/services/matchSetup";

import { openDeal } from "./localMatch";
import { getActiveSeatPlayer, getMatchSeats } from "./matchSeats";

test.each([
  ["1vs1", ["top", "bottom"]],
  ["1vs2", ["upper-right", "upper-left", "bottom"]],
  ["2vs2", ["right", "top", "left", "bottom"]],
] as const)("the opening player in %s sits on the dealer's right", (mode, rightOfSeat) => {
  const state = createMatchState("local", mode);
  const seats = getMatchSeats(mode);

  state.players.forEach((dealer, index) => {
    const dealt = dealRound({ ...state, dealer: dealer.id });
    const active = dealt.players.findIndex(({ id }) => id === dealt.currentPlayer);
    expect(seats[active]).toBe(rightOfSeat[index]);
  });
});

describe.each(["1vs1", "1vs2", "2vs2"] as const)("%s turn indicator during deals", (mode) => {
  test.each(["playersThenTable", "tableThenPlayers"] as const)(
    "retains the dealer throughout %s playback and hands off only on completion",
    (dealOrder) => {
      const state = { ...createMatchState("local", mode), phase: "dealerChoice" as const };
      expect(getActiveSeatPlayer({ state })).toBe(state.dealer);
      const [dealing, completed] = openDeal(state, dealOrder, "inc");
      expect(dealing.motion?.kind).toBe("deal");
      expect(dealing.state.currentPlayer).not.toBe(state.dealer);
      expect(getActiveSeatPlayer(dealing)).toBe(state.dealer);
      // The motion remains authoritative even when the destination state is already playable.
      expect(getActiveSeatPlayer({ ...dealing, state: { ...dealing.state, phase: "play" } })).toBe(
        state.dealer,
      );
      expect(completed.motion).toBeUndefined();
      expect(getActiveSeatPlayer(completed)).toBe(completed.state.currentPlayer);
    },
  );
});

test.each(["init", "chooseDealer", "roundEnd", "gameOver"] as const)(
  "does not invent an active seat in %s",
  (phase) => {
    const state = { ...createMatchState("local", "1vs1"), phase };
    expect(getActiveSeatPlayer({ state })).toBeUndefined();
  },
);
