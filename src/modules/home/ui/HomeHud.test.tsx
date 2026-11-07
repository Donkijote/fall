import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeHud } from "./HomeHud";

test("renders real identity without inventing a level or experience", () => {
  render(<HomeHud player={{ name: "Manuel" }} onSettings={vi.fn()} />);

  expect(screen.getByRole("group", { name: "Player identity" })).toHaveTextContent("Manuel");
  expect(screen.queryByText(/level|xp|lv\./i)).not.toBeInTheDocument();
  expect(screen.getByRole("group", { name: "Energy" })).toHaveTextContent("Not available yet");
  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("Not available yet");
});

test("accepts resource display models independently of any game store", () => {
  render(
    <HomeHud
      player={{ name: "Player" }}
      onSettings={vi.fn()}
      energy={{ value: 60, maximum: 120 }}
      coins={0}
    />,
  );

  expect(screen.getByRole("meter")).toHaveAttribute("aria-valuenow", "60");
  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("0");
});

test("keeps the four agreed player-system positions visible but explicitly unavailable", async () => {
  const user = userEvent.setup();
  const onSettings = vi.fn();
  render(<HomeHud player={{ name: "Player" }} onSettings={onSettings} />);

  const systems = screen.getByRole("navigation", { name: "Player systems" });
  for (const label of ["Collection", "Character", "Inventory", "Quests"]) {
    const button = within(systems).getByRole("button", { name: `${label} (coming soon)` });
    expect(button).toBeDisabled();
    expect(button).toHaveAccessibleDescription(/coming soon/);
    await user.click(button);
  }
  expect(onSettings).not.toHaveBeenCalled();
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
