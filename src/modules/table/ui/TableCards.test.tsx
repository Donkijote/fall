import type { Mock } from "vitest";

import { useGameStoreService } from "@/application/hooks/useGameStoreService";
import { useGameStoreState } from "@/application/hooks/useGameStoreState";
import type { Placement } from "@/modules/table/entities/types";

import { cleanup, render, screen } from "@testing-library/react";

import { useTableLayout } from "../application/useTableLayout";
import { TableCards } from "../ui/TableCards";

vi.mock("@/application/hooks/useGameStoreState", () => ({
  useGameStoreState: vi.fn(),
}));

vi.mock("@/application/hooks/useGameStoreService", () => ({
  useGameStoreService: vi.fn(() => ({ pickDealerCard: vi.fn() })),
}));

vi.mock("../application/useTableLayout", () => ({
  useTableLayout: vi.fn(),
}));

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

describe("TableCards", () => {
  beforeEach(() => {
    cleanup();
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
    const style = (card as HTMLDivElement).style;
    expect(style.position).toBe("absolute");
    expect(style.left).toBe("50%");
    expect(style.top).toBe("55%");
    // transform should include translate(-50%, -50%) and rotate(15deg)
    expect(style.transform).toContain("translate(-50%, -50%)");
    expect(style.transform).toContain("rotate(15deg)");
    // zIndex must be rounded
    expect(style.zIndex).toBe(String(Math.round(42.2)));
  });

  it("keeps zIndex as integer (rounded from placement.z)", () => {
    typedUseGameStoreState.mockReturnValue({
      table: [{ suit: "clubs", rank: 3 }],
    });
    typedUseTableLayout.mockReturnValue([
      { key: "clubs-3", leftPct: 30, topPct: 20, rotationDeg: -8, z: 1000.8 },
    ]);

    render(<TableCards />);
    const card = screen.getByTestId("card-view") as HTMLDivElement;
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
    const styles = cards.map((c) => (c as HTMLDivElement).style);

    expect(styles[0].left).toBe("20%");
    expect(styles[0].top).toBe("30%");
    expect(styles[0].transform).toContain("rotate(0deg)");
    expect(styles[0].zIndex).toBe("1");

    expect(styles[1].left).toBe("40%");
    expect(styles[1].transform).toContain("rotate(-12deg)");
    expect(styles[1].zIndex).toBe("2");

    expect(styles[2].left).toBe("60%");
    expect(styles[2].transform).toContain("rotate(9deg)");
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
});
