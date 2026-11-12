import type { CardAnchor } from "@/components/cards/motion/cardFlights";
import { toCardKey } from "@/domain/helpers/card";

import {
  cardPitch,
  viewHeight,
  type CardScene,
  type SceneCard,
} from "../../../adapters/three/matchCardScene";
import type { MatchFrame } from "../../../application/localMatch";

function measureAngle(element: Element) {
  const style = getComputedStyle(element);
  return ((parseFloat(style.rotate) || 0) * Math.PI) / 180;
}

export function measureCardScene(root: Element, frame: MatchFrame) {
  const { state, motion } = frame;
  if (!motion) return;
  const bounds = root.getBoundingClientRect();
  if (!bounds.height || !bounds.width) return;

  const unit = viewHeight / bounds.height;
  const hidden: HTMLElement[] = [];
  const find = (attribute: string, key: string) =>
    root.querySelector<HTMLElement>(`[data-${attribute}="${key}"]`);
  const anchor = (rect: DOMRect, angle = 0, faceUp = false): CardAnchor => ({
    x: (rect.left + rect.width / 2 - bounds.left - bounds.width / 2) * unit,
    y: (bounds.top + bounds.height / 2 - rect.top - rect.height / 2) * unit,
    z: 0,
    angle: -angle,
    faceUp,
  });
  const cards = new Map(
    [...state.table, ...state.players.flatMap(({ hand }) => hand)].map((card) => [
      toCardKey(card),
      card,
    ]),
  );
  const cardAt = (
    element: HTMLElement,
    key: Parameters<typeof cards.get>[0],
    faceUp: boolean,
  ): SceneCard => {
    const rect = (element.querySelector("img") ?? element).getBoundingClientRect();
    hidden.push(element);
    return {
      art: faceUp ? cards.get(key) : undefined,
      origin: anchor(rect, measureAngle(element), faceUp),
      size: (rect.height * unit) / 2.88,
    };
  };
  const stackAt = (attribute: string, player: string) => find(attribute, player)?.firstElementChild;
  let scene: CardScene;

  if (motion.kind === "deal") {
    const deck = stackAt("draw-pile", motion.dealer);
    if (!deck) return;
    scene = {
      kind: "deal",
      deck: {
        ...anchor(deck.getBoundingClientRect()),
        z: (state.deck.length + motion.cards.length - 1) * cardPitch,
      },
      cards: motion.cards.flatMap((key) => {
        const table = find("table-card", key);
        const hand = find("hand-card", key);
        const element = table ?? hand;
        return element
          ? [
              {
                ...cardAt(element, key, Boolean(table || element.querySelector("img")?.alt)),
                center: Boolean(table),
              },
            ]
          : [];
      }),
    };
  } else if (motion.kind === "play" || motion.kind === "collect") {
    const key = "card" in motion ? motion.card : undefined;
    const hand = key && find("hand-card", key);
    const played = hand && cardAt(hand, key, Boolean(hand.querySelector("img")?.alt));
    // Opponent cards start face down, but reveal the actual artwork in flight.
    if (played && key) played.art = cards.get(key);

    if (motion.kind === "play") {
      const landing = find("table-card", motion.card);
      if (!played || !landing) return;
      const target = cardAt(landing, motion.card, true);
      scene = { kind: "play", card: played, target: target.origin, targetSize: target.size };
    } else {
      const pile = stackAt("collector", motion.player);
      if (!pile) return;
      scene = {
        kind: "collect",
        capture: motion.capture,
        played: played || undefined,
        targets: motion.targets.flatMap((target) => {
          const element = find("table-card", target);
          return element ? [cardAt(element, target, true)] : [];
        }),
        pile: anchor(pile.getBoundingClientRect()),
      };
      if (!scene.targets.length || (scene.capture !== "sweep" && !scene.played)) return;
    }
  } else {
    scene = {
      kind: "count",
      groups: motion.groups.map(({ side, quota }) => {
        const label = find("count-side", String(side));
        const target = label ? anchor(label.getBoundingClientRect()) : { x: 0, y: 0, z: 0 };
        return {
          side,
          quota,
          target,
          cards: motion.piles
            .filter((pile) => pile.side === side)
            .flatMap(({ player, cards }) => {
              const pile = stackAt("collector", player);
              if (!pile || !cards.length) return [];
              const rect = pile.getBoundingClientRect();
              return cards.map((art) => ({
                art,
                origin: anchor(rect),
                size: (rect.height * unit) / 2.88,
              }));
            }),
        };
      }),
    };
  }
  return { scene, hidden };
}
