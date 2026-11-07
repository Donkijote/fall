import { ThemeProvider } from "next-themes";
import { MemoryRouter, Route, Routes } from "react-router";

import { StorageKeys, StorageService } from "@/application/services/StorageService";

import { render, screen, waitFor } from "@testing-library/react";
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

test("replaces the old navigation with the game HUD while retaining a usable Play entry", () => {
  renderLobby();
  expect(screen.getByRole("heading", { name: "The Hearth" })).toBeVisible();
  expect(screen.getByText("Player One")).toBeVisible();
  expect(screen.getByRole("button", { name: "Play" })).toBeEnabled();
  expect(screen.queryByRole("navigation", { name: "Main navigation" })).not.toBeInTheDocument();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

test("composes the decorative Living Town scenery beneath the existing HUD and Play entry", () => {
  const { container } = renderLobby();
  const sceneSlot = container.querySelector('[data-slot="home-scene"]');
  const town = container.querySelector('[data-slot="living-town-scene"]');

  expect(sceneSlot).toContainElement(town as HTMLElement);
  expect(town).toHaveAttribute("aria-hidden", "true");
  expect(town?.querySelector('[data-slot="living-town-sky"]')).toBeInTheDocument();
  expect(town?.querySelector('[data-slot="living-town-mountains"]')).toBeInTheDocument();
  expect(town?.querySelector('[data-slot="living-town-tavern"]')).toBeInTheDocument();
  expect(town?.querySelector("button, a, [tabindex], canvas")).toBeNull();
  expect(town?.querySelectorAll('img[alt=""]')).toHaveLength(5);
  expect(sceneSlot).not.toContainElement(screen.getByRole("banner", { name: "Player HUD" }));
  expect(sceneSlot).not.toContainElement(screen.getByRole("button", { name: "Play" }));
});

test("onboarding updates the HUD immediately and only then allows play", async () => {
  localStorage.clear();
  const user = userEvent.setup();
  const { container } = renderLobby();
  expect(container.querySelector('[aria-label="Play"]')).toBeDisabled();
  await user.type(screen.getByLabelText("Username"), "  New Traveller  {Enter}");

  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  expect(screen.getByText("New Traveller")).toBeVisible();
  expect(screen.getByRole("button", { name: "Play" })).toBeEnabled();
  expect(setupGame).not.toHaveBeenCalled();
});

test.each([
  { label: "1 vs 1", mode: "1vs1" },
  { label: "1 vs 2", mode: "1vs2" },
  { label: "2 vs 2", mode: "2vs2" },
])("Play preserves the $label game setup and route", async ({ label, mode }) => {
  const user = userEvent.setup();
  renderLobby();
  await user.click(screen.getByRole("button", { name: "Play" }));
  await user.click(screen.getByRole("button", { name: `Play ${label}` }));
  expect(setupGame).toHaveBeenCalledExactlyOnceWith("player", mode);
  expect(await screen.findByRole("heading", { name: "Game scene" })).toBeVisible();
});

test("the game-mode deep link waits for onboarding rather than opening two dialogs", async () => {
  localStorage.clear();
  const user = userEvent.setup();
  renderLobby("/?bottomSidebar=true");
  expect(screen.getAllByRole("dialog")).toHaveLength(1);
  expect(screen.getByRole("dialog", { name: "Welcome to Fall!" })).toBeVisible();
  await user.type(screen.getByLabelText("Username"), "Traveller{Enter}");
  expect(await screen.findByRole("dialog", { name: "Choose your game" })).toBeVisible();
  await user.click(screen.getByRole("button", { name: "Play 1 vs 1" }));
  expect(setupGame).toHaveBeenCalledExactlyOnceWith(expect.any(String), "1vs1");
});

test.each([
  { label: "How to play", heading: "Rules scene" },
  { label: "Sings reference", heading: "Sings scene" },
  { label: "Animation playground", heading: "Animation playground scene" },
])("Settings preserves $label navigation", async ({ label, heading }) => {
  const user = userEvent.setup();
  renderLobby();
  await user.click(screen.getByRole("button", { name: "Settings" }));
  await user.click(screen.getByRole("link", { name: label }));
  expect(await screen.findByRole("heading", { name: heading })).toBeVisible();
});

test("Settings preserves appearance switching and returns keyboard focus on Escape", async () => {
  const user = userEvent.setup();
  renderLobby();
  const settings = screen.getByRole("button", { name: "Settings" });
  await user.click(settings);
  const theme = screen.getByRole("button", { name: "Dark mode" });
  expect(theme).toHaveAttribute("aria-pressed", "false");
  await user.click(theme);
  expect(theme).toHaveAttribute("aria-pressed", "true");
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(settings).toHaveFocus());
});

test("Escape closes the mode picker and returns focus to Play", async () => {
  const user = userEvent.setup();
  renderLobby();
  const play = screen.getByRole("button", { name: "Play" });
  await user.click(play);
  await user.keyboard("{Escape}");
  await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  await waitFor(() => expect(play).toHaveFocus());
});

test("the presentational HUD never writes an economy or performs network requests", () => {
  const storageSpy = vi.spyOn(Storage.prototype, "setItem");
  const fetchSpy = vi.spyOn(globalThis, "fetch");
  renderLobby();
  expect(screen.getByRole("group", { name: "Energy" })).toHaveTextContent("Not available yet");
  expect(screen.getByRole("group", { name: "Coins" })).toHaveTextContent("Not available yet");
  expect(storageSpy).not.toHaveBeenCalled();
  expect(fetchSpy).not.toHaveBeenCalled();
  storageSpy.mockRestore();
  fetchSpy.mockRestore();
});
