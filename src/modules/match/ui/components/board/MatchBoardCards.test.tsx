import type { Card } from "@/domain/entities/Card";

import { render, screen, within } from "@testing-library/react";

import { MatchSeatCards } from "./MatchBoardCards";

test("the local hand keeps gaps and preserves the last card's angle until the next deal", () => {
  const hand: Card[] = [
    { suit: "coins", rank: 2 },
    { suit: "cups", rank: 3 },
    { suit: "clubs", rank: 4 },
  ];
  const props = {
    collected: 0,
    player: "local",
    local: true,
    align: "center" as const,
    canPlay: true,
    reducedMotion: true,
    play: vi.fn(),
  };
  const { rerender } = render(<MatchSeatCards {...props} hand={hand} />);
  const list = screen.getByRole("list", { name: "Your hand" });
  const last = list.children[2];

  rerender(<MatchSeatCards {...props} hand={[hand[2]]} />);

  expect(within(list).getAllByRole("button")).toHaveLength(1);
  expect(list.children).toHaveLength(3);
  expect(list.children[0]).toHaveAttribute("aria-hidden", "true");
  expect(list.children[2]).toBe(last);
  expect(last).toHaveClass("rotate-9");

  rerender(<MatchSeatCards {...props} hand={[]} />);
  expect(list.children).toHaveLength(0);
  rerender(<MatchSeatCards {...props} hand={[hand[2], hand[0], hand[1]]} />);
  expect(list.children[0]).toHaveAttribute("data-hand-card", "clubs-4");
  expect(list.children[0]).toHaveClass("-rotate-9");
});
