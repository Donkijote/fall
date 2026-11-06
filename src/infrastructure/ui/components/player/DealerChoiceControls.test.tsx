import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { DealerChoiceControls } from "./DealerChoiceControls";

const { dealerChoose } = vi.hoisted(() => ({ dealerChoose: vi.fn() }));
vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: () => ({ dealerChoose }),
}));

beforeEach(() => vi.clearAllMocks());

test.each([
  ["Players → Table", "Incremental", "playersThenTable", "inc"],
  ["Table → Players", "Decremental", "tableThenPlayers", "dec"],
])(
  "confirms %s and %s only after both options are selected",
  async (orderLabel, patternLabel, order, pattern) => {
    const user = userEvent.setup();
    render(<DealerChoiceControls isOpen />);
    const confirm = screen.getByRole("button", { name: "Confirm" });
    expect(confirm).toBeDisabled();
    await user.click(screen.getByRole("button", { name: orderLabel }));
    expect(confirm).toBeDisabled();
    await user.click(screen.getByRole("button", { name: patternLabel }));
    expect(screen.getByRole("button", { name: orderLabel })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(confirm).toBeEnabled();
    await user.click(confirm);
    expect(dealerChoose).toHaveBeenCalledWith(order, pattern);
  },
);

test("closed controls are absent", () => {
  render(<DealerChoiceControls isOpen={false} />);
  expect(screen.queryByRole("button")).not.toBeInTheDocument();
});
