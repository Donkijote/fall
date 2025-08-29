import type { Card } from "@/domain/entities/Card";
import { HANDS } from "@/domain/rules/hands";

describe("Hand", () => {
  it("should return true for big house", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 12 },
      { suit: "blades", rank: 12 },
      { suit: "cups", rank: 1 },
    ];

    expect(HANDS[0].pattern(cards)).toBe(true);
  });
  it("should return true for small house", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 11 },
      { suit: "blades", rank: 11 },
      { suit: "cups", rank: 1 },
    ];

    expect(HANDS[1].pattern(cards)).toBe(true);
  });
  it("should return true for register", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 12 },
      { suit: "blades", rank: 11 },
      { suit: "cups", rank: 1 },
    ];

    expect(HANDS[2].pattern(cards)).toBe(true);
  });
  it("should return true for watchtower", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 10 },
      { suit: "blades", rank: 10 },
      { suit: "cups", rank: 11 },
    ];

    expect(HANDS[3].pattern(cards)).toBe(true);
  });
  it("should return true for patrol", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 10 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 11 },
    ];

    expect(HANDS[4].pattern(cards)).toBe(true);
  });
  it("should return true for pair", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 5 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 5 },
    ];

    expect(HANDS[5].pattern(cards)).toBe(true);
  });
  it("should return true for pair of 10", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 10 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 10 },
    ];

    expect(HANDS[6].pattern(cards)).toBe(true);
  });
  it("should return true for pair of 11", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 11 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 11 },
    ];

    expect(HANDS[7].pattern(cards)).toBe(true);
  });
  it("should return true for pair of 12", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 12 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 12 },
    ];

    expect(HANDS[8].pattern(cards)).toBe(true);
  });
  it("should return true for three of a kind", () => {
    const cards: Card[] = [
      { suit: "golds", rank: 7 },
      { suit: "blades", rank: 7 },
      { suit: "cups", rank: 7 },
    ];

    expect(HANDS[9].pattern(cards)).toBe(true);
  });
});
