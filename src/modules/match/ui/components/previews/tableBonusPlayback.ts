import gsap from "gsap";

import type { GameState, ScoreAward } from "@/domain/entities/GameState";
import { orderFromDealerRight } from "@/domain/services/resolveHands";

import type { TableBonusEffects } from "./tableBonusEffects";

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
      const glow = card.querySelector<HTMLElement>("[data-bonus-glow]")!;
      const burst = card.querySelector<HTMLElement>("[data-bonus-burst]");
      const sheen = card.querySelector<HTMLElement>("[data-bonus-sheen]");
      const label = `match-${index}`;
      timeline.addLabel(label);
      const effect = effects?.[index];
      if (effect) {
        effect.stage = streak;
        if (streak === 3) {
          timeline.fromTo(
            effect.heat.current.strength,
            { value: 0 },
            {
              value: 1,
              duration: 0.45,
              ease: "power2.out",
            },
            label,
          );
        } else if (streak === 4) {
          timeline.fromTo(
            effect.flame.current,
            { value: 0 },
            {
              value: 1,
              duration: 0.18,
            },
            label,
          );
          timeline.fromTo(
            effect.ignition.current,
            { value: 0 },
            {
              value: 1,
              duration: 0.34,
              ease: "power2.out",
            },
            label,
          );
        }
      }

      // Each card keeps its own strength: the next success visibly outshines it.
      timeline.fromTo(
        glow,
        { opacity: 0, scale: 0.8 },
        {
          opacity: 0.25 + streak * 0.17,
          scale: 1 + streak * 0.045,
          duration: 0.32,
          ease: "power2.out",
        },
        label,
      );
      timeline.to(
        card,
        {
          y: streak === 1 ? -2 : -3 - streak * 2,
          scale: streak === 1 ? 1.015 : 1.025 + streak * 0.02,
          duration: 0.22,
          ease: "power2.out",
        },
        label,
      );
      timeline.to(
        card,
        { y: 0, scale: 1, duration: 0.34, ease: "back.out(1.8)" },
        `${label}+=0.22`,
      );
      if (streak === 2) {
        timeline.to(glow, { opacity: 0.95, scale: 1.18, duration: 0.12 }, `${label}+=0.34`);
        timeline.to(glow, { opacity: 0.59, scale: 1.09, duration: 0.22 }, `${label}+=0.46`);
      }
      if (burst && streak >= 2) {
        timeline.fromTo(
          burst,
          { opacity: 0.3 + streak * 0.15, scale: 1 },
          {
            opacity: 0,
            scale: 1.08 + streak * 0.07,
            duration: 0.48,
            ease: "power2.out",
            immediateRender: false,
          },
          label,
        );
      }
      if (sheen) {
        timeline.fromTo(
          sheen,
          { xPercent: -200, opacity: 0 },
          {
            xPercent: 200,
            opacity: 0.35 + streak * 0.15,
            duration: 0.42,
            ease: "power2.inOut",
          },
          `${label}+=0.06`,
        );
        timeline.to(sheen, { opacity: 0, duration: 0.12 }, `${label}+=0.48`);
      }
      timeline.addLabel(`match-settled-${index}`);
    }
    timeline.call(() =>
      announce(`Table card ${index + 1} landed. ${qualifies ? "Pattern match" : "No match"}.`),
    );
    timeline.to({}, { duration: 0.18 });
  });
  if (state.config.dealOrder === "tableThenPlayers") dealHands();
  if (perfect && matches.length === 4) {
    timeline.fromTo(
      perfect,
      { opacity: 0, scale: 0.55 },
      { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.6)" },
    );
    timeline.to({}, { duration: 0.85 });
    timeline.to(perfect, { opacity: 0, scale: 1.12, duration: 0.25 });
  } else {
    timeline.to({}, { duration: 0.4 });
  }
  return timeline;
}
