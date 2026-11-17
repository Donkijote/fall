import { MemoryRouter } from "react-router";
import { expect, it } from "vitest";

import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ComponentGallery } from "./ComponentGallery";

it("finds feature-local overlays by name and opens their real preview", async () => {
  const user = userEvent.setup();
  render(
    <MemoryRouter>
      <ComponentGallery />
    </MemoryRouter>,
  );

  await user.type(screen.getByRole("searchbox", { name: "Find a component" }), "LeaveMatchDialog");

  const match = screen.getByRole("region", { name: "Tavern match" });
  expect(
    within(match).getByText("src/modules/match/ui/components/overlays/LeaveMatchDialog.tsx"),
  ).toBeVisible();
  expect(screen.queryByRole("heading", { name: "ActionButton" })).not.toBeInTheDocument();

  const trigger = within(match).getByRole("button", { name: "Open leave dialog" });
  await user.click(trigger);
  await waitFor(() => expect(screen.getByRole("dialog", { name: "Leave match?" })).toBeVisible());
  await user.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Leave match?" })).not.toBeInTheDocument(),
  );
});
