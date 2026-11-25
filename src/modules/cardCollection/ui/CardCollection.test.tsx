import { MemoryRouter } from "react-router";

import { readGamePreferences } from "@/infrastructure/preferences/gamePreferences";

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardCollection } from "./CardCollection";

beforeEach(() => localStorage.clear());

test("previews all 40 cards and persists a pack change with its matching back", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <CardCollection />
    </MemoryRouter>,
  );
  expect(screen.getAllByRole("img")).toHaveLength(41);
  const oldFace = screen.getByRole("img", { name: "1 of coins" }).getAttribute("src");
  await user.click(screen.getByRole("combobox", { name: "Card deck" }));
  await user.click(await screen.findByRole("option", { name: "Maritime Guild" }));
  await waitFor(() => expect(readGamePreferences().cardDeck).toBe("maritime-guild"));
  expect(screen.getByRole("img", { name: "1 of coins" })).not.toHaveAttribute("src", oldFace);
  expect(screen.getByRole("img", { name: "Maritime Guild shared card back" })).toHaveAttribute(
    "src",
    expect.stringContaining("maritime-guild"),
  );
  expect(screen.getAllByRole("img")).toHaveLength(41);
});
