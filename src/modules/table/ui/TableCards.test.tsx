import { type CSSProperties, type PropsWithChildren, useEffect } from "react";

import type { GameState } from "@/domain/entities/GameState";
import type { CardProps } from "@/infrastructure/ui/components/card/Card";

import { fireEvent, render, screen } from "@testing-library/react";

import { TableCards } from "./TableCards";

vi.mock("framer-motion", () => {
  const MotionDiv = ({
    onLayoutAnimationComplete,
    layoutId,
    children,
    layout,
    initial,
    ...rest
  }: PropsWithChildren<{
    layoutId: string;
    onLayoutAnimationComplete: () => void;
    style: CSSProperties;
    layout: boolean;
    initial: boolean;
  }>) => {
    useEffect(() => {
      onLayoutAnimationComplete?.();
    }, [onLayoutAnimationComplete]);
    return (
      <div
        data-layoutid={layoutId}
        {...rest}
        data-layout={layout}
        data-initial={initial}
      >
        {children}
      </div>
    );
  };
  return { motion: { div: MotionDiv } };
});

const { dispatchSpy, runSpy } = vi.hoisted(() => ({
  dispatchSpy: vi.fn(),
  runSpy: vi.fn(),
}));

vi.mock("@/application/services/AnimationService", () => ({
  AnimationKeys: { GAME_CARDS: "GAME_CARDS" } as const,
  animationService: {
    dispatch: dispatchSpy,
    run: runSpy,
  },
}));

vi.mock("@/infrastructure/ui/components/card/Card", () => ({
  Card: (props: CardProps) => (
    <div
      data-testid={`card-${props.suit}-${props.rank}`}
      data-suit={props.suit}
      data-rank={props.rank}
      className={props.className}
      onClick={props.onClick}
    />
  ),
}));

vi.mock("@/modules/table/application/useTableLayout", () => ({
  useTableLayout: () => [
    // coins-1 at 10% / 20%
    { key: "coins-1", leftPct: 10, topPct: 20, rotationDeg: 0, z: 1 },
    // coins-2 at 60% / 70%
    { key: "coins-2", leftPct: 60, topPct: 70, rotationDeg: 0, z: 2 },
  ],
}));

const baseGameState = {
  table: [
    { suit: "coins", rank: 1 },
    { suit: "coins", rank: 2 },
  ],
  phase: "play",
  dealerSelection: undefined,
  currentPlayer: "me",
  mainPlayer: "me",
} as GameState;

vi.mock("@/application/hooks/useGameStoreState", () => ({
  useGameStoreState: () => baseGameState,
}));

const pickDealerCardMock = vi.fn();
vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: () => ({ pickDealerCard: pickDealerCardMock }),
}));

const uiState = {
  playingCard: null as null | { suit: "coins"; rank: number },
  captureOverride: null as null | { fromKey: string; toKey: string },
};
vi.mock("@/application/hooks/useUIGameStoreState", () => ({
  useUIGameStoreState: () => uiState,
}));

const queryMotionByLayoutId = (lid: string) =>
  document.querySelector(`[data-layoutid="${lid}"]`) as HTMLElement;

describe("TableCards", () => {
  beforeEach(() => {
    dispatchSpy.mockClear();
    pickDealerCardMock.mockClear();
    // reset UI state
    uiState.playingCard = null;
    uiState.captureOverride = null;

    // Also reset base state to non-chooseDealer for most tests
    baseGameState.phase = "play";
    baseGameState.dealerSelection = undefined;
  });

  it("renders table cards with correct layoutIds and placement styles", () => {
    render(<TableCards />);

    const el1 = queryMotionByLayoutId("card-coins-1");
    const el2 = queryMotionByLayoutId("card-coins-2");
    expect(el1).toBeTruthy();
    expect(el2).toBeTruthy();

    // Check style positions from mocked placements
    expect(el1!.style.left).toBe("10%");
    expect(el1!.style.top).toBe("20%");
    expect(el2!.style.left).toBe("60%");
    expect(el2!.style.top).toBe("70%");
  });

  it("dispatches GAME_CARDS only for the animating (playingCard) card", () => {
    // Set UI so coins-1 is the animating card
    uiState.playingCard = { suit: "coins", rank: 1 };

    render(<TableCards />);

    // Our framer-motion mock calls onLayoutAnimationComplete for both items.
    // Only the animating card should dispatch.
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledWith("GAME_CARDS", {
      suit: "coins",
      rank: 1,
    });
  });

  it("does not dispatch when there is no animating card", () => {
    uiState.playingCard = null;
    render(<TableCards />);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it("applies captureOverride by placing the played card at the target coordinates", () => {
    // played = coins-1 should borrow coins-2 placement (60%, 70%)
    uiState.playingCard = { suit: "coins", rank: 1 };
    uiState.captureOverride = { fromKey: "coins-1", toKey: "coins-2" };

    render(<TableCards />);

    const playedEl = queryMotionByLayoutId("card-coins-1");
    expect(playedEl).toBeTruthy();
    expect(playedEl!.style.left).toBe("60%");
    expect(playedEl!.style.top).toBe("70%");
  });

  it("dealer pick: only clickable when eligible, and forwards the correct key", async () => {
    // Put component in chooseDealer phase and make it my turn
    baseGameState.phase = "chooseDealer";
    baseGameState.currentPlayer = "me";
    baseGameState.mainPlayer = "me";
    baseGameState.dealerSelection = {
      order: [],
      turnIndex: 0,
      poolSize: 10,
      pickedKeys: new Set<string>(),
      pickedByKey: {},
    } as GameState["dealerSelection"];

    render(<TableCards />);

    const firstCard = screen.getByTestId("card-coins-1");
    // Eligible cards get the cursor-pointer class
    expect(firstCard.className).toContain("cursor-pointer");

    // Click triggers pickDealerCard with the key 'coins-1'
    fireEvent.click(firstCard);
    expect(pickDealerCardMock).toHaveBeenCalledTimes(1);
    expect(pickDealerCardMock).toHaveBeenCalledWith("coins-1");
  });

  it("dealer pick: not clickable when not eligible", async () => {
    baseGameState.phase = "chooseDealer";
    baseGameState.currentPlayer = "other";
    baseGameState.mainPlayer = "me";
    baseGameState.dealerSelection = {
      order: [],
      turnIndex: 0,
      poolSize: 10,
      pickedKeys: new Set<string>(),
      pickedByKey: {},
    } as GameState["dealerSelection"];

    render(<TableCards />);

    const firstCard = screen.getByTestId("card-coins-1");
    expect(firstCard.className).not.toContain("cursor-pointer");

    fireEvent.click(firstCard);
    expect(pickDealerCardMock).not.toHaveBeenCalled();
  });
});
