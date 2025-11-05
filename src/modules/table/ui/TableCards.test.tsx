import type { CSSProperties, PropsWithChildren } from "react";
import type { Mock } from "vitest";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import {
  AnimationKeys,
  animationService,
} from "@/application/services/AnimationService";
import type { Placement } from "@/modules/table/entities/types";

import { cleanup, render, screen } from "@testing-library/react";

import { useTableLayout } from "../application/useTableLayout";
import { TableCards } from "../ui/TableCards";

vi.mock("framer-motion", () => ({
  motion: {
    div: (
      props: PropsWithChildren<{
        layoutId: string;
        onLayoutAnimationComplete: () => void;
        style: CSSProperties;
        layout: boolean;
        initial: boolean;
      }>,
    ) => {
      const {
        children,
        onLayoutAnimationComplete,
        layoutId,
        style,
        layout,
        initial,
        ...rest
      } = props;
      return (
        <div
          data-testid={`motion-${layoutId}`}
          data-layoutid={layoutId}
          style={style}
          data-layout={layout}
          data-initial={initial}
          {...rest}
        >
          {children}
          <button
            data-testid={`complete-${layoutId}`}
            onClick={() => onLayoutAnimationComplete?.()}
          />
        </div>
      );
    },
  },
  LayoutGroup: ({ children }: never) => (
    <div data-testid="layout-group">{children}</div>
  ),
}));

vi.mock("@/application/hooks/useGameStoreState", () => ({
  useGameStoreState: vi.fn(),
}));

vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: vi.fn(() => ({ pickDealerCard: vi.fn() })),
}));

vi.mock("../application/useTableLayout", () => ({
  useTableLayout: vi.fn(),
}));

vi.mock("@/application/services/AnimationService", () => {
  return {
    AnimationKeys: { GAME_CARDS: "GAME_CARDS" },
    animationService: {
      dispatch: vi.fn(),
    },
  };
});

vi.mock("@/infrastructure/ui/components/card/Card", () => ({
  Card: (props: never) => {
    const { rank, suit, disabled, faceDown, className, style, onClick } = props;
    return (
      <div
        data-testid="card-view"
        data-rank={rank}
        data-suit={suit}
        data-disabled={disabled ? "true" : "false"}
        data-facedown={faceDown ? "true" : "false"}
        data-class={className ?? ""}
        onClick={onClick}
        style={style}
      />
    );
  },
}));

const typedUseGameStoreState = useGameStoreState as unknown as Mock;
const typedUseTableLayout = useTableLayout as unknown as Mock;
const typedUseGameStoreService = useGameStoreService as unknown as Mock;
const typedAnimationService = animationService as unknown as {
  dispatch: ReturnType<typeof vi.fn>;
};

describe("TableCards", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    typedUseGameStoreState.mockReset();
    typedUseTableLayout.mockReset();
  });

  it("renders no cards when placements is empty", () => {
    typedUseGameStoreState.mockReturnValue({ table: [] });
    typedUseTableLayout.mockReturnValue([]);

    render(<TableCards />);

    expect(screen.queryByTestId("card-view")).toBeNull();
    expect(typedUseTableLayout).toHaveBeenCalledTimes(1);
    expect(typedUseTableLayout).toHaveBeenCalledWith([]); // called with store table
  });

  it("renders one CardView per placement and parses suit/rank from key", () => {
    const tableStub = [
      { suit: "golds", rank: 7 },
      { suit: "cups", rank: 12 },
    ];
    typedUseGameStoreState.mockReturnValue({ table: tableStub });

    const placements: Placement[] = [
      { key: "golds-7", leftPct: 45, topPct: 40, rotationDeg: -10, z: 1000.4 },
      { key: "cups-12", leftPct: 62, topPct: 25, rotationDeg: 12, z: 1001.9 },
    ];
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);

    const cards = screen.getAllByTestId("card-view");
    expect(cards).toHaveLength(2);

    // First card
    expect(cards[0]).toHaveAttribute("data-suit", "golds");
    expect(cards[0]).toHaveAttribute("data-rank", "7");
    expect(cards[0]).toHaveAttribute("data-disabled", "true");

    // Second card
    expect(cards[1]).toHaveAttribute("data-suit", "cups");
    expect(cards[1]).toHaveAttribute("data-rank", "12");
    expect(cards[1]).toHaveAttribute("data-disabled", "true");

    expect(typedUseTableLayout).toHaveBeenCalledTimes(1);
    expect(typedUseTableLayout).toHaveBeenCalledWith(tableStub);
  });

  it("applies center-anchored absolute positioning and rotation", () => {
    typedUseGameStoreState.mockReturnValue({
      table: [{ suit: "swords", rank: 1 }],
    });

    const placements: Placement[] = [
      { key: "swords-1", leftPct: 50, topPct: 55, rotationDeg: 15, z: 42.2 },
    ];
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);

    const card = screen.getByTestId("card-view");
    // style assertions
    expect(card.parentElement!.parentElement!.style.position).toBe("absolute");
    expect(card.parentElement!.parentElement!.style.left).toBe("50%");
    expect(card.parentElement!.parentElement!.style.top).toBe("55%");
    // transform should include translate(-50%, -50%) and rotate(15deg)
    expect(card.parentElement!.style.transform).toContain(
      "translate(-50%, -50%)",
    );
    expect(card.parentElement!.style.transform).toContain("rotate(15deg)");
    // zIndex must be rounded
    expect(card.parentElement!.parentElement!.style.zIndex).toBe(
      String(Math.round(42.2)),
    );
  });

  it("keeps zIndex as integer (rounded from placement.z)", () => {
    typedUseGameStoreState.mockReturnValue({
      table: [{ suit: "clubs", rank: 3 }],
    });
    typedUseTableLayout.mockReturnValue([
      { key: "clubs-3", leftPct: 30, topPct: 20, rotationDeg: -8, z: 1000.8 },
    ]);

    render(<TableCards />);
    const card = screen.getByTestId("card-view").parentElement!
      .parentElement as HTMLDivElement;
    expect(card.style.zIndex).toBe("1001"); // rounded
  });

  it("supports multiple placements with distinct styles", () => {
    typedUseGameStoreState.mockReturnValue({
      table: [
        { suit: "golds", rank: 1 },
        { suit: "cups", rank: 2 },
        { suit: "clubs", rank: 3 },
      ],
    });

    typedUseTableLayout.mockReturnValue([
      { key: "golds-1", leftPct: 20, topPct: 30, rotationDeg: 0, z: 1 },
      { key: "cups-2", leftPct: 40, topPct: 30, rotationDeg: -12, z: 2 },
      { key: "clubs-3", leftPct: 60, topPct: 30, rotationDeg: 9, z: 3 },
    ]);

    render(<TableCards />);

    const cards = screen.getAllByTestId("card-view");
    const styles = cards.map(
      (c) => (c.parentElement!.parentElement as HTMLDivElement).style,
    );

    expect(styles[0].left).toBe("20%");
    expect(styles[0].top).toBe("30%");
    expect(styles[0].zIndex).toBe("1");

    expect(styles[1].left).toBe("40%");
    expect(styles[1].zIndex).toBe("2");

    expect(styles[2].left).toBe("60%");
    expect(styles[2].zIndex).toBe("3");
  });

  it("enables picking during chooseDealer on my turn and calls pickDealerCard with the key", async () => {
    const pickDealerCard = vi.fn();
    typedUseGameStoreService.mockReturnValue({ pickDealerCard });

    const table = [{ suit: "coins", rank: 3 }];
    const placements: Placement[] = [
      { key: "coins-3", leftPct: 50, topPct: 50, rotationDeg: 0, z: 1 },
    ];

    typedUseGameStoreState.mockReturnValue({
      table,
      phase: "chooseDealer",
      dealerSelection: {
        order: ["1", "bot-1"],
        turnIndex: 0,
        pickedByKey: { "1": null, "bot-1": null },
        pickedKeys: new Set<string>(),
        tieOnlyPlayers: null,
        poolSize: 16,
      },
      currentPlayer: "1",
      mainPlayer: "1",
    });
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);
    const card = screen.getByTestId("card-view");

    expect(card).toHaveAttribute("data-disabled", "false");
    expect(card).toHaveAttribute("data-facedown", "true");
    expect(card).toHaveAttribute(
      "data-class",
      expect.stringContaining("cursor-pointer"),
    );

    card.click();

    expect(pickDealerCard).toHaveBeenCalledTimes(1);
    expect(pickDealerCard).toHaveBeenCalledWith("coins-3");
  });

  it("disables picking when it is not my turn", () => {
    const pickDealerCard = vi.fn();
    typedUseGameStoreService.mockReturnValue({ pickDealerCard });

    const table = [{ suit: "cups", rank: 7 }];
    const placements: Placement[] = [
      { key: "cups-7", leftPct: 40, topPct: 40, rotationDeg: 0, z: 1 },
    ];

    typedUseGameStoreState.mockReturnValue({
      table,
      phase: "chooseDealer",
      dealerSelection: {
        order: ["1", "bot-1"],
        turnIndex: 1,
        pickedByKey: { "1": null, "bot-1": null },
        pickedKeys: new Set<string>(),
        tieOnlyPlayers: null,
        poolSize: 16,
      },
      currentPlayer: "bot-1",
      mainPlayer: "1",
    });
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);
    const card = screen.getByTestId("card-view");

    expect(card).toHaveAttribute("data-disabled", "true");
    expect(card).toHaveAttribute("data-facedown", "true");

    card.click();

    expect(pickDealerCard).not.toHaveBeenCalled();
  });

  it("disables picking for already picked keys and shows the card face up", () => {
    const pickDealerCard = vi.fn();
    typedUseGameStoreService.mockReturnValue({ pickDealerCard });

    const table = [{ suit: "swords", rank: 1 }];
    const picked = new Set<string>(["swords-1"]);
    const placements: Placement[] = [
      { key: "swords-1", leftPct: 20, topPct: 20, rotationDeg: 0, z: 1 },
    ];

    typedUseGameStoreState.mockReturnValue({
      table,
      phase: "chooseDealer",
      dealerSelection: {
        order: ["1", "bot-1"],
        turnIndex: 0,
        pickedByKey: { "1": "swords-1", "bot-1": null },
        pickedKeys: picked,
        tieOnlyPlayers: null,
        poolSize: 16,
      },
      currentPlayer: "1",
      mainPlayer: "1",
    });
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);
    const card = screen.getByTestId("card-view");

    expect(card).toHaveAttribute("data-disabled", "true");
    expect(card).toHaveAttribute("data-facedown", "false");

    card.click();

    expect(pickDealerCard).not.toHaveBeenCalled();
  });

  it("disables picking when tieOnlyPlayers excludes the main player", () => {
    const pickDealerCard = vi.fn();
    typedUseGameStoreService.mockReturnValue({ pickDealerCard });

    const table = [{ suit: "clubs", rank: 12 }];
    const placements: Placement[] = [
      { key: "clubs-12", leftPct: 60, topPct: 60, rotationDeg: 0, z: 1 },
    ];

    typedUseGameStoreState.mockReturnValue({
      table,
      phase: "chooseDealer",
      dealerSelection: {
        order: ["1", "bot-1"],
        turnIndex: 0,
        pickedByKey: { "1": null, "bot-1": null },
        pickedKeys: new Set<string>(),
        tieOnlyPlayers: ["bot-1"],
        poolSize: 16,
      },
      currentPlayer: "1",
      mainPlayer: "1",
    });
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);
    const card = screen.getByTestId("card-view");

    expect(card).toHaveAttribute("data-disabled", "true");
    expect(card).toHaveAttribute("data-facedown", "true");
    expect(card).toHaveAttribute(
      "data-class",
      expect.not.stringContaining("cursor-pointer"),
    );

    card.click();

    expect(pickDealerCard).not.toHaveBeenCalled();
  });

  it("renders face up during non chooseDealer phases and remains disabled", () => {
    const pickDealerCard = vi.fn();
    typedUseGameStoreService.mockReturnValue({ pickDealerCard });

    const table = [{ suit: "coins", rank: 5 }];
    const placements: Placement[] = [
      { key: "coins-5", leftPct: 10, topPct: 10, rotationDeg: 0, z: 1 },
    ];

    typedUseGameStoreState.mockReturnValue({
      table,
      phase: "play",
      dealerSelection: undefined,
      currentPlayer: "1",
      mainPlayer: "1",
    });
    typedUseTableLayout.mockReturnValue(placements);

    render(<TableCards />);
    const card = screen.getByTestId("card-view");

    expect(card).toHaveAttribute("data-facedown", "false");
    expect(card).toHaveAttribute("data-disabled", "true");

    card.click();

    expect(pickDealerCard).not.toHaveBeenCalled();
  });

  it("calls animationService.dispatch for the last played card when layout completes", () => {
    // Given two placements, lastPlayedCard matches the second
    typedUseGameStoreState.mockReturnValue({
      table: [
        { suit: "coins", rank: 3 },
        { suit: "cups", rank: 7 },
      ],
      phase: "play",
      dealerSelection: undefined,
      currentPlayer: "1",
      mainPlayer: "1",
      lastPlayedCard: { suit: "cups", rank: 7 },
    });

    typedUseTableLayout.mockReturnValue([
      { key: "coins-3", leftPct: 10, topPct: 10, rotationDeg: 0, z: 1 },
      { key: "cups-7", leftPct: 20, topPct: 20, rotationDeg: 0, z: 2 },
    ]);

    render(<TableCards />);

    // Trigger layout completion for the NON-last one first (should NOT dispatch)
    const nonLastBtn = screen.getByTestId("complete-card-coins-3");
    nonLastBtn.click();
    expect(typedAnimationService.dispatch).not.toHaveBeenCalled();

    // Now trigger for the lastPlayedCard (should dispatch once with correct payload)
    const lastBtn = screen.getByTestId("complete-card-cups-7");
    lastBtn.click();

    expect(typedAnimationService.dispatch).toHaveBeenCalledTimes(1);
    expect(typedAnimationService.dispatch).toHaveBeenCalledWith(
      AnimationKeys.GAME_CARDS,
      { suit: "cups", rank: 7 },
    );
  });

  it("does not dispatch when lastPlayedCard is null (no card is 'last')", () => {
    // One placement, but no lastPlayedCard in state
    typedUseGameStoreState.mockReturnValue({
      table: [{ suit: "coins", rank: 5 }],
      phase: "play",
      dealerSelection: undefined,
      currentPlayer: "1",
      mainPlayer: "1",
      lastPlayedCard: null,
    });

    typedUseTableLayout.mockReturnValue([
      { key: "coins-5", leftPct: 10, topPct: 10, rotationDeg: 0, z: 1 },
    ]);

    render(<TableCards />);

    // Trigger completion anyway — handler should early-return and not dispatch
    const btn = screen.getByTestId("complete-card-coins-5");
    btn.click();

    expect(typedAnimationService.dispatch).not.toHaveBeenCalled();
  });

  it("only dispatches for the placement that matches lastPlayedCard even if multiple are completed", () => {
    typedUseGameStoreState.mockReturnValue({
      table: [
        { suit: "coins", rank: 1 },
        { suit: "clubs", rank: 12 },
        { suit: "swords", rank: 3 },
      ],
      phase: "play",
      dealerSelection: undefined,
      currentPlayer: "1",
      mainPlayer: "1",
      lastPlayedCard: { suit: "clubs", rank: 12 },
    });

    typedUseTableLayout.mockReturnValue([
      { key: "coins-1", leftPct: 15, topPct: 15, rotationDeg: 0, z: 1 },
      { key: "clubs-12", leftPct: 25, topPct: 25, rotationDeg: 0, z: 2 }, // <- last
      { key: "swords-3", leftPct: 35, topPct: 35, rotationDeg: 0, z: 3 },
    ]);

    render(<TableCards />);

    // Fire completion for non-last cards first
    screen.getByTestId("complete-card-coins-1").click();
    screen.getByTestId("complete-card-swords-3").click();
    expect(typedAnimationService.dispatch).not.toHaveBeenCalled();

    // Fire completion for the last card
    screen.getByTestId("complete-card-clubs-12").click();
    expect(typedAnimationService.dispatch).toHaveBeenCalledTimes(1);
    expect(typedAnimationService.dispatch).toHaveBeenCalledWith(
      AnimationKeys.GAME_CARDS,
      { suit: "clubs", rank: 12 },
    );
  });
});
