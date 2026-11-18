import { MemoryRouter, Route, Routes } from "react-router";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CreditsScreen } from "./CreditsScreen";

test("renders every section in one keyboard-scrollable content region with a fixed return action", () => {
  render(
    <MemoryRouter>
      <CreditsScreen />
    </MemoryRouter>,
  );
  const content = screen.getByRole("region", { name: "Credits content" });
  expect(content).toHaveAttribute("tabindex", "0");
  expect(content).toHaveClass("overflow-y-auto");
  expect(screen.getByRole("main")).toHaveClass("overflow-hidden", "h-dvh");
  expect(screen.getByRole("heading", { name: "Credits & licenses" })).toHaveFocus();
  for (const name of [
    "Created by",
    "Artwork & sound",
    "Icons",
    "Typography",
    "Third-party software",
    "Legal notices",
  ]) {
    expect(content).toContainElement(screen.getByRole("heading", { name }));
  }
  expect(content).not.toContainElement(screen.getByRole("link", { name: "Settings" }));
  expect(screen.queryByRole("tablist")).not.toBeInTheDocument();
  expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  expect(
    screen.getByText("The Help icon uses project-drawn geometry.", { exact: false }),
  ).toBeInTheDocument();
  expect(
    within(screen.getByRole("region", { name: "Legal notices" })).getByText(
      /Fall is a proprietary game/,
    ),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Fall · Proprietary · All rights reserved" }),
  ).toBeInTheDocument();
});

test("returns to Settings with focus restoration intent and restores the document title", async () => {
  document.title = "Fall";
  const user = userEvent.setup();
  render(
    <MemoryRouter initialEntries={["/credits"]}>
      <Routes>
        <Route path="/credits" element={<CreditsScreen />} />
        <Route path="/" element={<h1>Settings return</h1>} />
      </Routes>
    </MemoryRouter>,
  );
  expect(document.title).toBe("Credits & licenses · Fall");
  expect(screen.getByRole("link", { name: "Settings" })).toHaveAttribute("href", "/?settings=true");
  await user.click(screen.getByRole("link", { name: "Settings" }));
  expect(screen.getByRole("heading", { name: "Settings return" })).toBeVisible();
  expect(document.title).toBe("Fall");
});
