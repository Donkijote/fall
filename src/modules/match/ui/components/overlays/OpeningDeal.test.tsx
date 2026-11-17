import { vi } from "vitest";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { OpeningDeal } from "./OpeningDeal";

test("keeps one option selected in each group and deals the selected order and bonus pattern", async () => {
  const user = userEvent.setup();
  const deal = vi.fn();
  render(<OpeningDeal deal={deal} />);
  const orders = within(screen.getByRole("group", { name: "Deal order" }));
  const patterns = within(screen.getByRole("group", { name: "Bonus pattern" }));

  const tableFirst = orders.getByRole("button", { name: "Table first" });
  await user.click(tableFirst);
  await user.click(tableFirst);
  expect(tableFirst).toHaveAttribute("aria-pressed", "true");
  const descending = patterns.getByRole("button", { name: "Descending, 4–3–2–1" });
  descending.focus();
  await user.keyboard(" ");
  expect(descending).toHaveAttribute("aria-pressed", "true");
  expect(screen.getByRole("status")).toHaveTextContent("Table first, then hands.");
  expect(screen.getByRole("status")).toHaveTextContent("4, 3, 2, 1.");

  await user.click(screen.getByRole("button", { name: "Deal cards" }));
  expect(deal).toHaveBeenCalledExactlyOnceWith("tableThenPlayers", "dec");
});
