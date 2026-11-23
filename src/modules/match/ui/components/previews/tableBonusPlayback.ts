import gsap from "gsap";

import type { GameState, ScoreAward } from "@/domain/entities/GameState";
import { orderFromDealerRight } from "@/domain/services/resolveHands";

import {
  appendPerfectTableAward,
  appendTableBonusHighlight,
} from "../flow/tableBonus/tableBonusChoreography";
import type { TableBonusEffects } from "../flow/tableBonus/tableBonusEffects";

/** Source ownership comes from the resolved award, never from rank comparisons. */
export function tableBonusPlayback(
  root: HTMLElement,
  state: GameState,
  award: ScoreAward | undefined,
  reducedMotion: boolean,
  complete: () => void,
  announce: (message: string) => void,
  effects?: TableBonusEffects,
) {
  const cards = [...root.querySelectorAll<HTMLElement>("[data-bonus-card]")];
  const hands = [...root.querySelectorAll<HTMLElement>("[data-deal-hand]")];
  const perfect = root.querySelector<HTMLElement>("[data-perfect-award]");
  const sourceCards = new Set<string>(award?.sourceCards ?? []);
  const matches = cards.filter((card) => sourceCards.has(card.dataset.bonusCard!));
  const finalMessage = award
    ? `${matches.length} qualifying cards. Dealer ${award.player}, side ${award.side}: +${award.amount} points${state.winner ? ". Match won" : ""}.`
    : "No qualifying cards. No opening bonus.";
  if (reducedMotion) {
    gsap.set([...cards, ...hands], { opacity: 1 });
    let streak = 0;
    for (const card of cards) {
      const qualifies = sourceCards.has(card.dataset.bonusCard!);
      streak = qualifies ? streak + 1 : 0;
      if (qualifies)
        gsap.set(card.querySelector("[data-bonus-glow]"), { opacity: 0.25 + streak * 0.17 });
    }
    if (perfect && matches.length === 4) gsap.set(perfect, { opacity: 1 });
    announce(finalMessage);
    complete();
    return;
  }
  const timeline = gsap.timeline({
    onComplete: () => {
      announce(finalMessage);
      complete();
    },
  });
  const dealer = root.querySelector<HTMLElement>("[data-dealer-deck]")!;
  const offset = (element: HTMLElement, axis: "left" | "top") =>
    dealer.getBoundingClientRect()[axis] - element.getBoundingClientRect()[axis];
  function dealHands() {
    for (let round = 0; round < state.config.handSize; round++) {
      for (const player of orderFromDealerRight(state)) {
        const hand = hands.find((node) => node.dataset.dealHand === `${player}:${round}`)!;
        timeline.fromTo(
          hand,
          {
            opacity: 0,
            x: () => offset(hand, "left"),
            y: () => offset(hand, "top"),
            scale: 0.85,
          },
          { opacity: 1, x: 0, y: 0, scale: 1, duration: 0.14, ease: "power2.out" },
        );
      }
    }
  }
  if (state.config.dealOrder === "playersThenTable") dealHands();
  let streak = 0;
  cards.forEach((card, index) => {
    timeline.fromTo(
      card,
      {
        x: () => offset(card, "left"),
        y: () => offset(card, "top"),
        opacity: 0,
        scale: 0.65,
        rotation: -12,
      },
      { x: 0, y: 0, opacity: 1, scale: 1, rotation: 0, duration: 0.72, ease: "power2.out" },
    );
    const qualifies = sourceCards.has(card.dataset.bonusCard!);
    streak = qualifies ? streak + 1 : 0;
    if (qualifies) {
      appendTableBonusHighlight(timeline, card, streak, index, effects?.[index]);
    }
    timeline.call(() =>
      announce(`Table card ${index + 1} landed. ${qualifies ? "Pattern match" : "No match"}.`),
    );
    timeline.to({}, { duration: 0.18 });
  });
  if (state.config.dealOrder === "tableThenPlayers") dealHands();
  appendPerfectTableAward(timeline, perfect, matches.length);
  return timeline;
}
