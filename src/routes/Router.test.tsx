import {
  CARDS_PATH,
  GAME_PATH,
  HOME_PATH,
  SINGS_SHEETS,
} from "@/routes/Routes";

import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/infrastructure/ui/screens/Home", () => ({
  HomeScreen: () => <div data-testid="home">Home</div>,
}));
vi.mock("@/infrastructure/ui/screens/Game", () => ({
  GameScreen: () => <div data-testid="game">Game</div>,
}));
vi.mock("@/infrastructure/ui/components/card/CardList", () => ({
  CardList: () => <div data-testid="cards">Cards</div>,
}));
vi.mock("@/infrastructure/ui/screens/SingsSheet", () => ({
  SingsSheetScreen: () => <div data-testid="sings">Sings</div>,
}));

// helper to import the router AFTER setting location/env
async function importRouter() {
  const mod = await import("@/routes/Router");
  return mod.AppRouter;
}

describe("AppRouter", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllEnvs?.(); // if using Vitest env stubs
    vi.resetModules();
  });

  it("renders HomeScreen at HOME_PATH", async () => {
    window.history.pushState({}, "", "/fall" + HOME_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("home")).toBeInTheDocument();
  });

  it("renders GameScreen at GAME_PATH", async () => {
    window.history.pushState({}, "", "/fall" + GAME_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("game")).toBeInTheDocument();
  });

  it("renders CardList at CARDS_PATH", async () => {
    window.history.pushState({}, "", "/fall" + CARDS_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("cards")).toBeInTheDocument();
  });

  it("renders SingsSheetScreen at SINGS_SHEETS", async () => {
    window.history.pushState({}, "", "/fall" + SINGS_SHEETS);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("sings")).toBeInTheDocument();
  });

  it("honors basename from import.meta.env.BASE_URL (trims trailing slashes)", async () => {
    // Simulate a base path like /fall/
    // NOTE: requires Vitest >= 1.4 for vi.stubEnv
    vi.stubEnv("BASE_URL", "/fall/");
    // navigate to /fall/<route>
    window.history.pushState({}, "", `/fall${GAME_PATH}`);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("game")).toBeInTheDocument();
  });
});
