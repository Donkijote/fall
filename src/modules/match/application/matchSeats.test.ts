import { dealRound } from "@/domain/services/deal";
import { createMatchState } from "@/domain/services/matchSetup";

import { getMatchSeats } from "./matchSeats";

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
