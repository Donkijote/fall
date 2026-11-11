import { MemoryRouter } from "react-router";

import { HANDS } from "@/domain/rules/hands";

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SingsReferenceScreen } from "./SingsReferenceScreen";

function renderReference() {
  return render(
    <MemoryRouter initialEntries={["/sings"]}>
      <SingsReferenceScreen />
    </MemoryRouter>,
  );
}

test("shows the current catalog with three labeled Spanish cards, declaration status and points for each combination", () => {
  renderReference();
  const sorted = [...HANDS].sort((first, second) => second.points - first.points);
  const list = within(screen.getByRole("list", { name: "Combinations" }));
  expect(list.getAllByRole("heading").map((heading) => heading.textContent)).toEqual(
    sorted.map(({ name }) => name),
  );
  for (const hand of sorted) {
    const row = within(list.getByRole("heading", { name: hand.name }).closest("li")!);
    expect(row.getByText(hand.mandatory ? "Mandatory" : "Optional")).toBeVisible();
    expect(row.getByText(hand.points === 1 ? "pt" : "pts").parentElement).toHaveTextContent(
      String(hand.points),
    );
    expect(
      within(row.getByRole("list", { name: `${hand.name} example hand` })).getAllByRole("img"),
    ).toHaveLength(3);
  }
  expect(screen.getByRole("link", { name: "Back to Hall" })).toHaveAttribute("href", "/");
});

test("explains tag, pattern and name matches, combines filters, and resets with focus returned to search", async () => {
  const user = userEvent.setup();
  renderReference();
  const search = screen.getByRole("searchbox", { name: "Search combinations" });
  await user.type(search, "sequence");
  const list = screen.getByRole("list", { name: "Combinations" });
  expect(within(list).getByRole("heading", { name: "Patrol" })).toBeVisible();
  expect(within(list).getByText("sequence").tagName).toBe("MARK");
  await user.clear(search);
  await user.type(search, "consecutive");
  expect(screen.getByText("consecutive").tagName).toBe("MARK");
  await user.clear(search);
  await user.type(search, "HOUSE");
  expect(screen.getAllByText("House").every((element) => element.tagName === "MARK")).toBe(true);
  await user.clear(search);

  const points = screen.getByRole("combobox", { name: "Minimum points" });
  points.focus();
  await user.keyboard("{ArrowDown}");
  await user.click(await screen.findByRole("option", { name: "≥ 5" }));
  expect(screen.getByRole("status")).toHaveTextContent("6 combinations");
  await user.tab();
  const mandatory = screen.getByRole("checkbox", { name: "Mandatory only" });
  expect(mandatory).toHaveFocus();
  await user.keyboard(" ");
  expect(screen.getByRole("status")).toHaveTextContent("4 combinations");

  await user.type(search, "no matches");
  expect(screen.getByRole("status")).toHaveTextContent("No combinations match your filters.");
  await user.click(screen.getByRole("button", { name: "Reset filters" }));
  expect(screen.getByRole("status")).toHaveTextContent("10 combinations");
  expect(search).toHaveFocus();
  expect(search).toHaveValue("");
  expect(mandatory).not.toBeChecked();
  expect(points).toHaveTextContent("Any points");
});
