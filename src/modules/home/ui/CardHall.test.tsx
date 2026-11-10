import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardHall } from "./CardHall";

test("selects the Tavern without launching a match and opens formats only through the action", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  await user.click(screen.getByRole("button", { name: "Select The Tavern" }));
  expect(onPlay).not.toHaveBeenCalled();
  await user.click(screen.getByRole("button", { name: "Play at the tavern" }));
  expect(onPlay).toHaveBeenCalledOnce();
});

test("keeps previewing future activities separate from playing", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  await user.click(screen.getByRole("button", { name: "Select Campaign" }));
  const campaign = screen.getByRole("button", { name: "Select Campaign" });
  expect(campaign).toHaveAttribute("aria-pressed", "true");
  expect(campaign).toHaveAttribute("data-unavailable", "true");
  expect(campaign).toBeEnabled();
  expect(campaign).toHaveAccessibleDescription(/Coming soon/);
  expect(screen.getByRole("status")).toHaveTextContent("coming soon");
  await user.click(screen.getByRole("button", { name: "Campaign (coming soon)" }));
  expect(onPlay).not.toHaveBeenCalled();
});

test("supports arrow, Home and End selection without activating an activity", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  screen.getByRole("button", { name: "Select The Tavern" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "Select Campaign" })).toHaveFocus();
  await user.keyboard("{End}");
  expect(screen.getByRole("button", { name: "Select Arena" })).toHaveFocus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "Select The Tavern" })).toHaveFocus();
  await user.keyboard("{ArrowLeft}{Home}");
  expect(screen.getByRole("button", { name: "Select The Tavern" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  expect(onPlay).not.toHaveBeenCalled();
});

test("gates all Play actions until onboarding and exposes no fake progression or balances", () => {
  render(
    <CardHall
      player={{ name: "Traveller" }}
      canPlay={false}
      onPlay={vi.fn()}
      onSettings={vi.fn()}
    />,
  );
  expect(screen.getByRole("button", { name: "Play at the tavern" })).toBeDisabled();
  expect(screen.queryByRole("button", { name: "All Caída modes" })).not.toBeInTheDocument();
  expect(screen.getByText("Level —")).toBeVisible();
  expect(screen.getByRole("img", { name: "Experience unavailable" })).toBeVisible();
  expect(screen.queryByText(/CHAPTER|1,240|A debt at the crossroads/)).not.toBeInTheDocument();
});

test("uses artwork-overlay titles without descriptions or a separate card footer", () => {
  const { container } = render(
    <CardHall player={{ name: "Traveller" }} canPlay onPlay={vi.fn()} onSettings={vi.fn()} />,
  );
  expect(screen.queryByText(/A seat at the table|The Borderlands|Prove your hand/)).toBeNull();
  expect(container.querySelector(".game-activity-copy")).toBeNull();
  expect(screen.queryByText("Swipe to explore activities")).toBeNull();
  expect(screen.queryByText("Current quest")).toBeNull();
  for (const title of ["The Tavern", "Campaign", "Arena"]) {
    expect(screen.getByText(title).parentElement).toHaveClass("game-activity-art");
  }
  expect(screen.getByRole("button", { name: "Select The Tavern" })).toHaveAttribute(
    "data-unavailable",
    "false",
  );
});

test("keeps the approved player navigation and mail explicitly unavailable", () => {
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={vi.fn()} onSettings={vi.fn()} />);
  const navigation = screen.getByRole("navigation", { name: "Player systems" });
  for (const label of ["Hero", "Collection", "Journal", "Guild", "Market"]) {
    expect(
      within(navigation).getByRole("button", { name: `${label} (coming soon)` }),
    ).toBeDisabled();
  }
  const utilities = within(screen.getByRole("navigation", { name: "Utilities" }));
  expect(utilities.getByRole("button", { name: "Messages (coming soon)" })).toBeDisabled();
  expect(utilities.getByRole("button", { name: "Settings" })).toBeEnabled();
});

test("retains all titles and a usable Play action when artwork fails", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  const { container } = render(
    <CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />,
  );
  for (const image of container.querySelectorAll("img")) fireEvent.error(image);
  expect(screen.getByRole("button", { name: "Select The Tavern" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Select Campaign" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Play at the tavern" }));
  expect(onPlay).toHaveBeenCalledOnce();
});

test("displays supplied progression and resource amounts in the HUD", () => {
  render(
    <CardHall
      player={{ name: "Traveller", level: 3, experience: { value: 20, maximum: 50 } }}
      resources={{ energy: { value: 5, maximum: 10 }, coins: 42, diamonds: 0 }}
      canPlay
      onPlay={vi.fn()}
      onSettings={vi.fn()}
    />,
  );
  const hud = within(screen.getByRole("banner", { name: "Player HUD" }));
  expect(hud.getByText("Level 3")).toBeVisible();
  expect(hud.getByRole("meter", { name: "Experience" })).toHaveAttribute("aria-valuemax", "50");
  expect(hud.getByRole("group", { name: "Energy" })).toHaveTextContent("5/10");
  expect(hud.getByRole("group", { name: "Coins" })).toHaveTextContent("42");
  expect(hud.getByRole("group", { name: "Diamonds" })).toHaveTextContent("0");
});
