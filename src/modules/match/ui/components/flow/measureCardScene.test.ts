import { createDeck } from "@/domain/rules/deck";
import { createMatchState } from "@/domain/services/matchSetup";
import { getCountingGroups } from "@/domain/services/scoring";

import { viewHeight } from "../../../adapters/three/matchCardScene";
import type { MatchFrame } from "../../../application/localMatch";
import { measureCardScene } from "./measureCardScene";

function rect(left: number, top: number, width = 50, height = 70) {
  return { left, top, width, height } as DOMRect;
}
function element(parent: HTMLElement, attribute: string, key: string, bounds: DOMRect) {
  const node = document.createElement("div");
  node.setAttribute(`data-${attribute}`, key);
  node.getBoundingClientRect = () => bounds;
  parent.append(node);
  return node;
}

it.each(["1vs1", "1vs2", "2vs2"] as const)(
  "measures the correct pocket for every collected pile in %s",
  (mode) => {
    const state = createMatchState("local", mode);
    const deck = createDeck();
    const piles = state.players.map(({ id, team }, index) => ({
      player: id,
      side: team,
      cards: deck.slice(index * 5, index * 5 + 5),
    }));
    const frame: MatchFrame = {
      state,
      motion: { kind: "count", groups: getCountingGroups(state), piles },
    };
    const root = document.createElement("div");
    root.getBoundingClientRect = () => rect(0, 0, 400, 800);
    for (const { side } of getCountingGroups(state)) {
      element(root, "capture-pocket", String(side), rect(side * 70, 300, 60, 8));
      element(root, "capture-anchor", String(side), rect(999, 999));
    }
    for (const pile of piles) {
      const collector = element(root, "collector", pile.player, rect(10, 600));
      const cards = document.createElement("div");
      cards.getBoundingClientRect = () => rect(10, 600);
      collector.append(cards);
    }
    const result = measureCardScene(root, frame)!;
    expect(result.scene.kind).toBe("count");
    if (result.scene.kind !== "count") throw new Error("Expected count scene");
    for (const group of result.scene.groups) {
      expect(group.pocket.mouth.x).toBeCloseTo(((group.side * 70 + 30 - 200) * viewHeight) / 800);
      expect(group.pocket.mouth.y).toBeCloseTo(((400 - 304) * viewHeight) / 800);
      expect(group.pocket.cardSize).toBeCloseTo((((60 * viewHeight) / 800) * 0.85) / 2.06);
      expect(group.cards.map(({ player }) => player)).toEqual(
        piles
          .filter(({ side }) => side === group.side)
          .flatMap(({ player, cards }) => cards.map(() => player)),
      );
    }
    const collector = root.querySelector<HTMLElement>("[data-collector]")!;
    const pile = collector.firstElementChild!;
    collector.removeChild(pile);
    expect(measureCardScene(root, frame)).toBeUndefined();
    collector.append(pile);
    root.querySelector("[data-capture-pocket]")!.remove();
    expect(measureCardScene(root, frame)).toBeUndefined();
  },
);
