import { MemoryRouter } from "react-router";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SingsSheetScreen } from "./SingsSheet";

vi.mock("@/infrastructure/adapters/handWithMeta", () => ({
  getUiHands: () => [
    { id: "pair", name: "Pair", points: 2, mandatory: false, tags: ["matching"] },
    { id: "royal", name: "Royal", points: 10, mandatory: true, tags: ["royalty"] },
  ],
}));

test("filters by search, minimum points, and mandatory state", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <SingsSheetScreen />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Pair" })).toBeVisible();
  expect(screen.getByRole("combobox", { name: "Minimum points" })).toHaveClass("cursor-pointer");
  expect(screen.getByRole("checkbox", { name: "Mandatory only" })).toHaveClass("cursor-pointer");
  await user.type(screen.getByLabelText("Search combinations"), "matching");
  expect(screen.queryByRole("heading", { name: "Royal" })).not.toBeInTheDocument();
  await user.clear(screen.getByLabelText("Search combinations"));
  await user.click(screen.getByRole("combobox", { name: "Minimum points" }));
  await user.click(await screen.findByRole("option", { name: "≥ 5" }));
  expect(screen.queryByRole("heading", { name: "Pair" })).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Royal" })).toBeVisible();
  expect(screen.getByRole("combobox", { name: "Minimum points" })).toHaveTextContent("≥ 5");
  await waitFor(() => expect(screen.queryByRole("listbox")).not.toBeInTheDocument());
  screen.getByRole("combobox", { name: "Minimum points" }).focus();
  await user.keyboard("{ArrowDown}");
  await user.click(await screen.findByRole("option", { name: "Any points" }));
  await user.click(screen.getByText("Mandatory only"));
  expect(screen.queryByRole("heading", { name: "Pair" })).not.toBeInTheDocument();
  await user.type(screen.getByLabelText("Search combinations"), "no matches");
  expect(screen.getByRole("status")).toHaveTextContent("No sings match your filters.");
});
