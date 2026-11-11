import { ThemeProvider } from "next-themes";
import { MemoryRouter, Route, Routes } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import { MatchScreen } from "@/modules/match";
import { MATCH_PATH } from "@/routes/Routes";

import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { HomeLobby } from "./HomeLobby";

const { setupGame } = vi.hoisted(() => ({ setupGame: vi.fn() }));
vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: () => ({ setupGame }),
}));

function renderLobby(entry = "/") {
  return render(
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="fall-theme"
    >
      <MemoryRouter initialEntries={[entry]}>
        <Routes>
          <Route path="/" element={<HomeLobby />} />
          <Route path={MATCH_PATH} element={<MatchScreen />} />
          <Route path="/game" element={<h1>Game scene</h1>} />
          <Route path="/rules" element={<h1>Rules scene</h1>} />
          <Route path="/sings" element={<h1>Sings scene</h1>} />
          <Route path="/dev/animations" element={<h1>Animation playground scene</h1>} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  document.documentElement.classList.remove("light", "dark");
  localStorage.clear();
  StorageService.set(StorageKeys.FALL_USER, {
    id: "player",
    username: "Player",
    name: "Player One",
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.style.removeProperty("color-scheme");
});

test("opens the working Card Hall with Tavern playable and no placeholder campaign progress", () => {
  renderLobby();
  expect(screen.queryByRole("heading", { name: "The Hearth" })).not.toBeInTheDocument();
  expect(screen.queryByText("A moment of rest. Another hand awaits.")).not.toBeInTheDocument();
  expect(screen.getByText("Player One")).toBeVisible();
  expect(screen.getByRole("button", { name: "Tavern" })).toBeEnabled();
  expect(screen.getByRole("button", { name: "Tavern" })).toHaveAttribute("aria-haspopup", "dialog");
  expect(screen.queryByRole("button", { name: "Play at the tavern" })).not.toBeInTheDocument();
  expect(screen.queryByText("CHAPTER II")).not.toBeInTheDocument();
  expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("composes real activity controls over the clean hall, not the flattened mockup", () => {
  const { container } = renderLobby();
  expect(container.querySelector('[data-slot="card-hall"]')).toBeInTheDocument();
  expect(container.querySelector('[data-slot="living-town-scene"], canvas')).toBeNull();
  expect(container.querySelector(".card-hall-backdrop")).toHaveAttribute("aria-hidden", "true");
  expect(screen.getByRole("group", { name: "Activities" }).querySelectorAll("button")).toHaveLength(
    3,
  );
  expect(screen.getByRole("banner", { name: "Player HUD" })).toContainElement(
    screen.getByText("Player One"),
  );
  expect(screen.queryByRole("group", { name: "Current quest" })).not.toBeInTheDocument();
});

test("onboarding updates the HUD immediately and only then allows play", async () => {
  localStorage.clear();
  const user = userEvent.setup();
  const { container } = renderLobby();
  expect(container.querySelector('[aria-label="Tavern"]')).toBeDisabled();
  await user.type(screen.getByLabelText("Username"), "  New Traveller  {Enter}");

  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByText("New Traveller")).toBeVisible();
  expect(screen.getByRole("button", { name: "Tavern" })).toBeEnabled();
  expect(setupGame).not.toHaveBeenCalled();
});

test.each([
  ["Duel", 2, "{Enter}"],
  ["Free-for-All", 3, null],
  ["Team Match", 4, "{Enter}"],
])("%s opens its waiting table and returns focus on cancel", async (label, seatCount, key) => {
  const user = userEvent.setup();
  renderLobby();
  await user.click(screen.getByRole("button", { name: "Tavern" }));
  const mode = screen.getByRole("button", { name: label });
  if (key) {
    act(() => mode.focus());
    await user.keyboard(key);
  } else {
    await user.click(mode);
  }
  expect(await screen.findByRole("main", { name: label }, { timeout: 2000 })).toBeVisible();
  expect(screen.getByRole("list", { name: "Table seats" }).children).toHaveLength(seatCount);
  expect(screen.getByRole("status")).toHaveTextContent(`1/${seatCount}`);
  await waitFor(() => expect(screen.getByText("You")).toBeVisible());
  expect(screen.getByText("You").closest("li")).toHaveTextContent("Your turn");
  const cancel = screen.getByRole("button", { name: "Cancel matchmaking" });
  expect(cancel).toHaveFocus();
  if (label === "Team Match") await user.keyboard("{Escape}");
  else await user.click(cancel);
  await waitFor(() => expect(screen.getByRole("button", { name: label })).toHaveFocus(), {
    timeout: 2500,
  });
  expect(screen.getByRole("dialog", { name: "Tavern" })).toBeVisible();
  expect(setupGame).not.toHaveBeenCalled();
  expect(screen.queryByRole("heading", { name: "Game scene" })).not.toBeInTheDocument();
});

test("touch previews one Tavern format and clears selection on the second tap", async () => {
  const user = userEvent.setup();
  renderLobby("/?bottomSidebar=true");
  const duel = screen.getByRole("button", { name: "Duel" });
  const team = screen.getByRole("button", { name: "Team Match" });
  const tap = (target: HTMLElement) => user.pointer({ keys: "[TouchA]", target });

  await tap(duel);
  expect(duel).toHaveFocus();
  expect(duel).toHaveAttribute("data-selected", "true");
  await tap(team);
  expect(duel).toHaveAttribute("data-selected", "false");
  expect(team).toHaveAttribute("data-selected", "true");
  await tap(team);
  expect(team).toHaveAttribute("data-selected", "false");
  expect(await screen.findByRole("main", { name: "Team Match" }, { timeout: 2000 })).toBeVisible();
  expect(setupGame).not.toHaveBeenCalled();
});

test("the game-mode deep link waits for onboarding rather than opening two dialogs", async () => {
  localStorage.clear();
  const user = userEvent.setup();
  renderLobby("/?bottomSidebar=true");
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  await waitFor(() =>
    expect(screen.getByRole("dialog", { name: "Welcome to Fall!" })).toBeVisible(),
  );
  await user.type(screen.getByLabelText("Username"), "Traveller{Enter}");
  expect(await screen.findByRole("dialog", { name: "Tavern" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Duel" }));
  expect(setupGame).not.toHaveBeenCalled();
  expect(await screen.findByRole("main", { name: "Duel" }, { timeout: 2000 })).toBeVisible();
});

test.each([
  { label: "How to play", heading: "Rules scene" },
  { label: "Sings reference", heading: "Sings scene" },
])("Help opens the $label guide", async ({ label, heading }) => {
  const user = userEvent.setup();
  renderLobby();
  await user.click(screen.getByRole("button", { name: "Help" }));
  await user.click(screen.getByRole("link", { name: label }));
  expect(await screen.findByRole("heading", { name: heading })).toBeVisible();
});

test("Escape closes Help and restores focus to its trigger", async () => {
  const user = userEvent.setup();
  renderLobby();
  const help = screen.getByRole("button", { name: "Help" });
  help.focus();
  await user.keyboard("{Enter}");
  await waitFor(() => expect(screen.getByRole("dialog", { name: "Help" })).toBeVisible());
  await waitFor(() => expect(screen.getByRole("link", { name: "How to play" })).toHaveFocus());
  await user.keyboard("{Escape}");
  await waitFor(() =>
    expect(screen.queryByRole("dialog", { name: "Help" })).not.toBeInTheDocument(),
  );
  await waitFor(() => expect(help).toHaveFocus());
});

test("Settings keeps the development playground link after moving the guides", async () => {
  const user = userEvent.setup();
  renderLobby();
  await user.click(screen.getByRole("button", { name: "Settings" }));
  expect(screen.queryByRole("link", { name: "How to play" })).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Sings reference" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: "Animation playground" }));
  expect(await screen.findByRole("heading", { name: "Animation playground scene" })).toBeVisible();
});

test("Settings preserves appearance switching and returns keyboard focus on Escape", async () => {
  const user = userEvent.setup();
  renderLobby();
  const settings = screen.getByRole("button", { name: "Settings" });
  await user.click(settings);
  const theme = screen.getByRole("button", { name: "Dark" });
  expect(theme).toHaveAttribute("aria-pressed", "false");
  await user.click(theme);
  expect(theme).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(settings).toHaveFocus());
});

test("Escape closes the mode picker and returns focus to Tavern", async () => {
  const user = userEvent.setup();
  renderLobby();
  const play = screen.getByRole("button", { name: "Tavern" });
  await user.click(play);
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(play).toHaveFocus());
});

test.each(["{Enter}", " "])("the tavern opens the Tavern picker with %s", async (key) => {
  const user = userEvent.setup();
  renderLobby();
  const tavern = screen.getByRole("button", { name: "Tavern" });
  tavern.focus();
  await user.keyboard(key);
  expect(await screen.findByRole("dialog", { name: "Tavern" })).toBeVisible();
  expect(setupGame).not.toHaveBeenCalled();
});

test("the presentational HUD never writes an economy or performs network requests", () => {
  const storageSpy = vi.spyOn(Storage.prototype, "setItem");
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  renderLobby();
  for (const resource of ["Energy", "Coins", "Diamonds"]) {
    expect(screen.getByRole("group", { name: resource })).toHaveTextContent("Unavailable");
  }
  expect(screen.getByText("Level —")).toBeVisible();
  expect(screen.getByRole("img", { name: "Experience unavailable" })).toBeVisible();
  expect(storageSpy).not.toHaveBeenCalled();
  expect(fetchSpy).not.toHaveBeenCalled();
  storageSpy.mockRestore();
  fetchSpy.mockRestore();
});

test("future activities cannot start a game; return to Tavern to choose a format", async () => {
  const user = userEvent.setup();
  renderLobby();
  for (const title of ["Campaign", "Arena"]) {
    const activity = screen.getByRole("button", { name: title });
    expect(activity).toHaveAccessibleDescription("Coming soon");
    await user.click(activity);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  }
  expect(setupGame).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "All Caída modes" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Tavern" }));
  expect(await screen.findByRole("dialog", { name: "Tavern" })).toBeVisible();
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.getByRole("button", { name: "Tavern" })).toHaveFocus());
});
