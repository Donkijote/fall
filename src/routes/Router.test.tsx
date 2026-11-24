import {
  ANIMATION_PLAYGROUND_PATH,
  CARDS_PATH,
  CREDITS_PATH,
  GAME_PATH,
  HOME_PATH,
  LOGIN_PATH,
  LOCAL_MATCH_ID,
  RULES_PATH,
  SINGS_SHEETS,
} from "@/routes/Routes";

import { cleanup, render, screen } from "@testing-library/react";

vi.mock("@/infrastructure/ui/screens/Home", () => ({
  HomeScreen: () => <div data-testid="home">Home</div>,
}));
vi.mock("@/modules/match", () => ({
  MatchScreen: () => <div data-testid="match">Match</div>,
}));
vi.mock("@/modules/credits", () => ({
  CreditsScreen: () => <div data-testid="credits">Credits</div>,
}));
vi.mock("@/modules/cardCollection", () => ({
  CardCollection: () => <div data-testid="cards">Cards</div>,
}));
vi.mock("@/infrastructure/ui/screens/SingsSheet", () => ({
  SingsSheetScreen: () => <div data-testid="sings">Sings</div>,
}));

vi.mock("@/infrastructure/ui/screens/Rules", () => ({
  RulesScreen: () => <div data-testid="rules">Rules</div>,
}));

vi.mock("@/modules/animationPlayground/ui/AnimationPlayground", () => ({
  AnimationPlayground: () => <div data-testid="animations">Animations</div>,
}));

vi.mock("@/modules/login/ui/LoginScreen", () => ({
  LoginScreen: () => <div data-testid="login">Login</div>,
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
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("renders HomeScreen at HOME_PATH", async () => {
    window.history.pushState({}, "", HOME_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("home")).toBeInTheDocument();
  });

  it("loads the match screen from a direct match URL", async () => {
    window.history.pushState({}, "", `${GAME_PATH}/${LOCAL_MATCH_ID}`);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(await screen.findByTestId("match")).toBeInTheDocument();
  });

  it("loads credits directly without requiring a player session", async () => {
    window.history.pushState({}, "", CREDITS_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(await screen.findByTestId("credits")).toBeInTheDocument();
  });

  it.each([true, false])(
    "loads the login screen at the domain root with DEV=%s",
    async (development) => {
      vi.stubEnv("DEV", development);
      window.history.pushState({}, "", LOGIN_PATH);
      const AppRouter = await importRouter();
      render(<AppRouter />);
      expect(await screen.findByTestId("login")).toBeInTheDocument();
      expect(screen.queryByTestId("home")).not.toBeInTheDocument();
    },
  );

  it("loads the card collection under /dev in development", async () => {
    vi.stubEnv("DEV", true);
    expect(CARDS_PATH).toBe("/dev/cards");
    window.history.pushState({}, "", CARDS_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(await screen.findByTestId("cards")).toBeInTheDocument();
  });

  it.each([CARDS_PATH, "/cards"])(
    "does not register the collection at %s in production",
    async (path) => {
      vi.stubEnv("DEV", false);
      window.history.pushState({}, "", path);
      const AppRouter = await importRouter();
      vi.spyOn(console, "error").mockImplementation(() => {});
      render(<AppRouter />);
      expect(screen.queryByTestId("cards")).not.toBeInTheDocument();
      expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    },
  );

  it("renders SingsSheetScreen at SINGS_SHEETS", async () => {
    window.history.pushState({}, "", SINGS_SHEETS);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("sings")).toBeInTheDocument();
  });

  it("loads the animation playground in development", async () => {
    vi.stubEnv("DEV", true);
    window.history.pushState({}, "", ANIMATION_PLAYGROUND_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(await screen.findByTestId("animations")).toBeInTheDocument();
  });

  it("does not register the animation playground in production", async () => {
    vi.stubEnv("DEV", false);
    window.history.pushState({}, "", ANIMATION_PLAYGROUND_PATH);
    const AppRouter = await importRouter();
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<AppRouter />);
    expect(screen.queryByTestId("animations")).not.toBeInTheDocument();
    expect(screen.getByText("404 Not Found")).toBeInTheDocument();
    error.mockRestore();
  });

  it("renders RulesScreen at RULES_PATH", async () => {
    window.history.pushState({}, "", RULES_PATH);
    const AppRouter = await importRouter();
    render(<AppRouter />);
    expect(screen.getByTestId("rules")).toBeInTheDocument();
  });
});
