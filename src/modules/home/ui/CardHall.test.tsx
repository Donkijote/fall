import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { CardHall } from "./CardHall";

test("previews the Tavern on hover and opens it on a mouse click", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  const tavern = screen.getByRole("button", { name: "The Tavern" });
  expect(tavern).toHaveAttribute("data-active", "false");
  await user.hover(tavern);
  expect(tavern).toHaveAttribute("data-active", "true");
  expect(onPlay).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Play at the tavern" })).not.toBeInTheDocument();
  await user.click(tavern);
  expect(onPlay).toHaveBeenCalledOnce();
});

test("requires two taps on the same playable card and keeps future cards as previews", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  const tavern = screen.getByRole("button", { name: "The Tavern" });
  const campaign = screen.getByRole("button", { name: "Campaign" });
  const tap = (target: HTMLElement) => user.pointer({ keys: "[TouchA]", target });
  await tap(tavern);
  expect(tavern).toHaveAttribute("data-selected", "true");
  expect(screen.getByRole("status")).toHaveTextContent("The Tavern focused.");
  expect(screen.queryByText("Tap again to play")).not.toBeInTheDocument();
  await tap(campaign);
  expect(tavern).toHaveAttribute("data-selected", "false");
  expect(campaign).toHaveAttribute("data-selected", "true");
  expect(campaign).toHaveAccessibleDescription("Coming soon");
  await tap(campaign);
  await tap(tavern);
  expect(onPlay).not.toHaveBeenCalled();
  await tap(tavern);
  expect(onPlay).toHaveBeenCalledOnce();
  expect(tavern).toHaveAttribute("data-selected", "false");
});

test("treats a mouse-style click as a tap on a touch-first device", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: query === "(hover: none), (pointer: coarse)",
    addListener: vi.fn(),
    removeListener: vi.fn(),
  }));
  try {
    render(
      <CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />,
    );
    const tavern = screen.getByRole("button", { name: "The Tavern" });
    await user.click(tavern);
    expect(tavern).toHaveAttribute("data-selected", "true");
    expect(onPlay).not.toHaveBeenCalled();
    await user.click(tavern);
    expect(onPlay).toHaveBeenCalledOnce();
    await user.keyboard("{Enter}");
    expect(onPlay).toHaveBeenCalledTimes(2);
  } finally {
    vi.unstubAllGlobals();
  }
});

test("supports arrow, Home and End focus without activating an activity", async () => {
  const user = userEvent.setup();
  const onPlay = vi.fn();
  render(<CardHall player={{ name: "Traveller" }} canPlay onPlay={onPlay} onSettings={vi.fn()} />);
  screen.getByRole("button", { name: "The Tavern" }).focus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "Campaign" })).toHaveFocus();
  await user.keyboard("{End}");
  expect(screen.getByRole("button", { name: "Arena" })).toHaveFocus();
  await user.keyboard("{ArrowRight}");
  expect(screen.getByRole("button", { name: "The Tavern" })).toHaveFocus();
  await user.keyboard("{ArrowLeft}{Home}");
  expect(screen.getByRole("button", { name: "The Tavern" })).toHaveFocus();
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
  expect(screen.getByRole("button", { name: "The Tavern" })).toBeDisabled();
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
  expect(screen.getByRole("button", { name: "The Tavern" })).toHaveAttribute(
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
  expect(screen.getByRole("button", { name: "The Tavern" })).toBeVisible();
  expect(screen.getByRole("button", { name: "Campaign" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "The Tavern" }));
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
