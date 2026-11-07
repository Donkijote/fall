import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeHud } from "./HomeHud";

test("renders real identity without inventing a level or experience", () => {
  render(<HomeHud player={{ name: "Manuel" }} onSettings={vi.fn()} />);

  expect(screen.getByRole("group", { name: "Player identity" })).toHaveTextContent("Manuel");
  expect(screen.getByText("Level —")).toBeInTheDocument();
  expect(screen.queryByRole("meter", { name: "Player experience" })).not.toBeInTheDocument();
  expect(screen.getByRole("group", { name: "Energy" })).toHaveTextContent("Not available yet");
  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("Not available yet");
  expect(screen.getByRole("group", { name: "Diamonds" })).toHaveTextContent("Not available yet");
});

test("accepts resource display models independently of any game store", () => {
  render(
    <HomeHud
      player={{ name: "Player" }}
      onSettings={vi.fn()}
      energy={{ value: 60, maximum: 120 }}
      coins={0}
      diamonds={2480}
    />,
  );

  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "60");
  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("0");
  expect(screen.getByRole("group", { name: "Diamonds" })).toHaveTextContent("2,480");
});

test("shows supplied level and experience without adding progression behavior", () => {
  render(
    <HomeHud
      player={{ name: "Player", level: 43, experience: { value: 49, maximum: 100 } }}
      onSettings={vi.fn()}
    />,
  );

  expect(screen.getByText("Level 43")).toBeVisible();
  const experience = screen.getByRole("meter", { name: "Player experience" });
  expect(experience).toHaveAttribute("aria-valuenow", "49");
  expect(experience).toHaveAttribute("aria-valuemax", "100");
  expect(experience.firstElementChild).toHaveStyle({ width: "49%" });
});

test.each([
  { value: -1, maximum: 100 },
  { value: 101, maximum: 100 },
  { value: 0, maximum: 0 },
  { value: Number.NaN, maximum: 100 },
  { value: 10, maximum: Number.POSITIVE_INFINITY },
])("does not present invalid progression as a real meter: %o", (experience) => {
  render(<HomeHud player={{ name: "Player", level: -1, experience }} onSettings={vi.fn()} />);

  expect(screen.getByText("Level —")).toBeInTheDocument();
  expect(screen.queryByRole("meter", { name: "Player experience" })).not.toBeInTheDocument();
});

test("keeps the five player-system positions visible but explicitly unavailable", async () => {
  const user = userEvent.setup();
  const onSettings = vi.fn();
  render(<HomeHud player={{ name: "Player" }} onSettings={onSettings} />);

  const systems = screen.getByRole("navigation", { name: "Player systems" });
  expect(within(systems).getAllByRole("button")).toHaveLength(5);
  expect(within(systems).queryByText("Soon")).not.toBeInTheDocument();
  expect(within(systems).queryByRole("button", { name: /zoom/i })).not.toBeInTheDocument();
  for (const label of ["Collection", "Character", "Inventory", "Ranks", "Quests"]) {
    const button = within(systems).getByRole("button", { name: `${label} (coming soon)` });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(/coming soon/);
    await user.click(button);
  }
  expect(onSettings).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("mail and chat remain explicitly unavailable without fake unread badges or dialogs", async () => {
  const user = userEvent.setup();
  render(<HomeHud player={{ name: "Player" }} onSettings={vi.fn()} />);

  for (const name of ["Messages (coming soon)", "Chat (coming soon)"]) {
    const button = screen.getByRole("button", { name });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(/not available yet/);
    await user.click(button);
  }
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("settings supports keyboard activation through its action callback", async () => {
  const user = userEvent.setup();
  const onSettings = vi.fn();
  render(<HomeHud player={{ name: "Player" }} onSettings={onSettings} />);

  await user.tab();
  expect(screen.getByRole("button", { name: "Settings" })).toHaveFocus();
  await user.keyboard("{Enter}");
  expect(onSettings).toHaveBeenCalledOnce();
});

test("the scene slot is outside the HUD layer and is not hidden from assistive technology", async () => {
  const user = userEvent.setup();
  const enter = vi.fn();
  const { container } = render(
    <HomeHud
      player={{ name: "Player" }}
      onSettings={vi.fn()}
      scene={
        <button className="pointer-events-auto" onClick={enter}>
          Town destination
        </button>
      }
    >
      <p>Temporary scene content</p>
    </HomeHud>,
  );

  const scene = container.querySelector('[data-slot="home-scene"]');
  expect(scene).not.toHaveAttribute("aria-hidden");
  expect(scene).toContainElement(screen.getByRole("button", { name: "Town destination" }));
  expect(scene).not.toContainElement(screen.getByRole("banner", { name: "Player HUD" }));
  expect(screen.getByText("Temporary scene content")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Town destination" }));
  expect(enter).toHaveBeenCalledOnce();
});

test("a failed avatar falls back to the existing user icon and a changed URL can load", () => {
  const { container, rerender } = render(
    <HomeHud player={{ name: "Player", avatarUrl: "/missing.png" }} onSettings={vi.fn()} />,
  );

  fireEvent.error(container.querySelector("img")!);
  expect(container.querySelector("img")).not.toBeInTheDocument();
  expect(
    screen.getByRole("group", { name: "Player identity" }).querySelector("svg"),
  ).toBeInTheDocument();
  rerender(
    <HomeHud player={{ name: "Player", avatarUrl: "/portrait.png" }} onSettings={vi.fn()} />,
  );
  expect(container.querySelector("img")).toHaveAttribute("src", "/portrait.png");
});
