import { MemoryRouter, Route, Routes } from "react-router";

import { HallReturnAction } from "@/components/navigation/HallReturnAction";

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeUtilities } from "./HomeUtilities";

test("a guide return restores focus to the Hall Help trigger", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/rules"]}>
      <Routes>
        <Route path="/rules" element={<HallReturnAction />} />
        <Route path="/" element={<HomeUtilities onSettings={() => {}} />} />
      </Routes>
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("link", { name: "Back to Hall" }));
  expect(screen.getByRole("button", { name: "Help" })).toHaveFocus();
});

test("loading a Hall history entry after a guide return does not focus Help", () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/", state: { focusHelp: true } }]}>
      <HomeUtilities onSettings={() => {}} />
    </MemoryRouter>,
  );
  expect(screen.getByRole("button", { name: "Help" })).not.toHaveFocus();
});

test("opening Help with a pointer leaves the first guide unfocused", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <HomeUtilities onSettings={() => {}} />
    </MemoryRouter>,
  );
  await user.click(screen.getByRole("button", { name: "Help" }));
  expect(screen.getByRole("link", { name: "How to play" })).not.toHaveFocus();
});
