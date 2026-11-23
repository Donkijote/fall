import gsap from "gsap";

import { cardFlights } from "@/components/cards/motion/cardFlights";
import { toCardKey } from "@/domain/helpers/card";

import { openDeal } from "../../application/localMatch";
import { tableBonusPreview } from "../../application/tableBonusPreview";
import type { CardScene } from "./matchCardScene";
import { appendMatchDeal } from "./matchDealPlayback";

afterEach(() => gsap.globalTimeline.clear());

it.each(["playersThenTable", "tableThenPlayers"] as const)(
  "lands opening cards singly with room for source feedback (%s)",
  (order) => {
    const { before } = tableBonusPreview("2vs2", "inc", order, "perfect", 2);
    const frame = openDeal(before, order, "inc")[0];
    if (frame.motion?.kind !== "deal") throw new Error("Expected deal");
    const all = [...frame.state.table, ...frame.state.players.flatMap((p) => p.hand)];
    const scene: Extract<CardScene, { kind: "deal" }> = {
      kind: "deal",
      deck: { x: 0, y: 0, z: 0 },
      deckSize: 1,
      cards: frame.motion.cards.map((key) => ({
        art: all.find((card) => toCardKey(card) === key),
        size: 1,
        origin: { x: 0, y: 0, z: 0, angle: 0 },
        center: frame.motion?.kind === "deal" && frame.motion.openingTable!.cards.includes(key),
      })),
    };
    const flights = scene.cards.map(() => ({ progress: 0, fan: 0, landed: false }));
    const audio = { playDealCard: vi.fn(), playCard: vi.fn() };
    const arrivals: number[] = [];
    const timeline = gsap.timeline({ paused: true });
    appendMatchDeal(timeline, scene, flights, audio, {
      land(timeline, key) {
        const index = scene.cards.findIndex((card) => card.art && toCardKey(card.art) === key);
        arrivals.push(timeline.duration());
        timeline.call(() => expect(flights[index].progress).toBe(1));
        timeline.to({}, { duration: 0.6 });
      },
      celebrate(timeline) {
        timeline.addLabel("perfect");
        timeline.to({}, { duration: 1 });
      },
    });
    expect(arrivals).toHaveLength(4);
    for (let index = 1; index < 4; index++)
      expect(arrivals[index] - arrivals[index - 1]).toBeCloseTo(0.72 + 0.6 + 0.18);
    const first = scene.cards.findIndex((card) => card.center);
    const next = first + 1;
    timeline.time(arrivals[0] - 0.01, false);
    expect(flights[first].progress).toBeLessThan(1);
    expect(flights[next].progress).toBe(0);
    timeline.time(arrivals[0] + 0.5, false);
    expect(flights[first].progress).toBe(1);
    expect(flights[next].progress).toBe(0);
    timeline.progress(1, false);
    expect(audio.playDealCard).toHaveBeenCalledTimes(scene.cards.length);
    expect(flights.every((flight) => flight.progress === 1)).toBe(true);
  },
);

it("retains ordinary hand timing and fan without opening choreography", () => {
  const scene: Extract<CardScene, { kind: "deal" }> = {
    kind: "deal",
    deck: { x: 0, y: 0, z: 0 },
    deckSize: 1,
    cards: Array.from({ length: 3 }, () => ({
      center: false,
      size: 1,
      origin: { x: 0, y: 0, z: 0, angle: 0 },
      fan: { x: 0, y: 0, z: 0, angle: 0.2 },
    })),
  };
  const flights = scene.cards.map(() => ({ progress: 0, fan: 0, landed: false }));
  const timeline = appendMatchDeal(gsap.timeline({ paused: true }), scene, flights, {
    playDealCard: vi.fn(),
    playCard: vi.fn(),
  });
  expect(timeline.duration()).toBeCloseTo(
    cardFlights.deal.hand + 2 * cardFlights.deal.stagger + 0.2,
  );
  timeline.progress(1);
  expect(flights.every((flight) => flight.progress === 1 && flight.fan === 1)).toBe(true);
});

it("keeps the rendered card until its DOM replacement is revealed, even when eased progress rounds up early", () => {
  const card = document.createElement("div");
  card.style.visibility = "hidden";
  const flights = [{ progress: 0, fan: 0, landed: false }];
  const scene: Extract<CardScene, { kind: "deal" }> = {
    kind: "deal",
    deck: { x: 0, y: 0, z: 0 },
    deckSize: 1,
    cards: [
      {
        art: { suit: "coins", rank: 1 },
        center: true,
        size: 1,
        origin: { x: 0, y: 0, z: 0, angle: 0 },
      },
    ],
  };
  const timeline = gsap.timeline({ paused: true });
  const context = gsap.context(() => {
    appendMatchDeal(
      timeline,
      scene,
      flights,
      { playDealCard: vi.fn(), playCard: vi.fn() },
      {
        land(timeline) {
          timeline.set(card, { visibility: "visible" });
        },
        celebrate() {},
      },
    );
  });
  // This was a blank frame: the mesh hid on rounded progress before the DOM set.
  timeline.time(0.717, false);
  expect(flights[0].progress).toBe(1);
  expect(flights[0].landed).toBe(false);
  expect(card.style.visibility).toBe("hidden");
  timeline.time(0.72, false);
  expect(flights[0].landed).toBe(true);
  expect(card.style.visibility).toBe("visible");
  context.revert();
  expect(flights[0].landed).toBe(false);
  expect(card.style.visibility).toBe("hidden");
});
