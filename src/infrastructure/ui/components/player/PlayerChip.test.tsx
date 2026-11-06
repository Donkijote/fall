import { render, screen } from "@testing-library/react";

import { PlayerChip } from "./PlayerChip";

test("shows player identity, team, score, and dealer marker", () => {
  render(<PlayerChip name="Player One" team={2} score={{ "2": 12 }} isDealer isMainPlayer />);
  expect(screen.getByText("Player One")).toBeVisible();
  expect(screen.getByText("Team 2")).toBeVisible();
  expect(screen.getByText("12 pts")).toBeVisible();
  expect(screen.getByLabelText("Dealer")).toBeVisible();
});

test("a player without a team or score defaults to team one with zero points", () => {
  render(<PlayerChip name="Bot" score={{}} isDealer={false} />);
  expect(screen.getByText("Team 1")).toBeVisible();
  expect(screen.getByText("0 pts")).toBeVisible();
  expect(screen.queryByLabelText("Dealer")).not.toBeInTheDocument();
});
