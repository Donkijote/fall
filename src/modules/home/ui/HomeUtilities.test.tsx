import { MemoryRouter } from "react-router";

import { render, screen } from "@testing-library/react";

import { HomeUtilities } from "./HomeUtilities";

test("a guide return restores focus to the Hall Help trigger", () => {
  render(
    <MemoryRouter initialEntries={[{ pathname: "/", state: { focusHelp: true } }]}>
      <HomeUtilities onSettings={() => {}} />
    </MemoryRouter>,
  );
  expect(screen.getByRole("button", { name: "Help" })).toHaveFocus();
});
