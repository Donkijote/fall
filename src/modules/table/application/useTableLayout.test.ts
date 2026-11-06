import type { Mock } from "vitest";

import type { Card } from "@/domain/entities/Card";
import type { Placement } from "@/modules/table/entities/types";

import { renderHook } from "@testing-library/react";

import { randomScatter } from "../domain/randomScatter";
import { useTableLayout } from "./useTableLayout";

vi.mock("../domain/randomScatter", () => ({
  randomScatter: vi.fn(),
}));

const typedRandomScatter = randomScatter as unknown as Mock;

const placement = (key: string, z: number): Placement => ({
  key,
  leftPct: 0,
  topPct: 0,
  rotationDeg: 0,
  z,
});

const mapFrom = (items: Placement[]) =>
  new Map<string, Placement>(items.map((p) => [p.key, p]));

describe("useTableLayout", () => {
  beforeEach(() => {
    typedRandomScatter.mockReset();
  });

  it("returns placements sorted by z ascending", () => {
    const placementsMap = mapFrom([
      placement("a-1", 5),
      placement("b-2", 1),
      placement("c-3", 3),
    ]);
    typedRandomScatter.mockReturnValueOnce({ placements: placementsMap });

    const table: Card[] = [{ suit: "coins", rank: 1 }];
    const { result } = renderHook(() => useTableLayout(table));

    expect(result.current.map((p) => p.key)).toEqual(["b-2", "c-3", "a-1"]);
  });

  it("memoizes for identical table reference and does not call randomScatter again", () => {
    const firstPlacements = mapFrom([placement("x-1", 2)]);
    typedRandomScatter.mockReturnValueOnce({ placements: firstPlacements });

    const table: Card[] = [{ suit: "cups", rank: 7 }];
    const { result, rerender } = renderHook(({ t }) => useTableLayout(t), {
      initialProps: { t: table },
    });

    expect(result.current.map((p) => p.key)).toEqual(["x-1"]);
    expect(typedRandomScatter).toHaveBeenCalledTimes(1);

    rerender({ t: table });

    expect(result.current.map((p) => p.key)).toEqual(["x-1"]);
    expect(typedRandomScatter).toHaveBeenCalledTimes(1);
  });

  it("passes previous placements as existingPlacements when table changes", () => {
    const firstPlacements = mapFrom([placement("p-1", 4)]);
    const secondPlacements = mapFrom([
      placement("q-1", 6),
      placement("r-2", 2),
    ]);

    typedRandomScatter
      .mockReturnValueOnce({ placements: firstPlacements })
      .mockReturnValueOnce({ placements: secondPlacements });

    const initialTable: Card[] = [{ suit: "swords", rank: 3 }];
    const updatedTable: Card[] = [{ suit: "clubs", rank: 5 }];

    const { rerender } = renderHook(({ t }) => useTableLayout(t), {
      initialProps: { t: initialTable },
    });

    rerender({ t: updatedTable });

    expect(typedRandomScatter).toHaveBeenCalledTimes(2);
    const firstCallExisting =
      typedRandomScatter.mock.calls[0][0].existingPlacements;
    const secondCallExisting =
      typedRandomScatter.mock.calls[1][0].existingPlacements;

    expect(firstCallExisting).toBeInstanceOf(Map);
    expect(secondCallExisting).toBe(firstPlacements);

    const returnedSecond = (
      typedRandomScatter.mock.results[1].value as {
        placements: Map<string, Placement>;
      }
    ).placements;

    expect([...returnedSecond.values()].map((p) => p.key).sort()).toEqual([
      "q-1",
      "r-2",
    ]);
  });
});
