import gsap from "gsap";
import { useLayoutEffect, useMemo, useState, type RefObject } from "react";

import type { Card } from "@/domain/entities/Card";

import type { OpeningTablePlayback } from "../../../../adapters/three/matchCardScene";
import type { MatchFrame, MatchMotion } from "../../../../application/localMatch";
import { appendPerfectTableAward, appendTableBonusHighlight } from "./tableBonusChoreography";
import { createTableBonusEffects } from "./tableBonusEffects";

type OpeningDeal = NonNullable<Extract<MatchMotion, { kind: "deal" }>["openingTable"]>;
type Session = {
  deal: OpeningDeal;
  cards: Card[];
  effects: ReturnType<typeof createTableBonusEffects>;
  cleared: boolean;
};

/** Keeps opening-source feedback alive across the deal → points handoff. */
export function useOpeningTableBonus(
  frame: MatchFrame,
  board: RefObject<HTMLDivElement | null>,
  reducedMotion: boolean,
  returning: boolean,
) {
  const deal = frame.motion?.kind === "deal" ? frame.motion.openingTable : undefined;
  const [session, setSession] = useState<Session>();
  if (deal && session?.deal !== deal) {
    setSession({
      deal,
      cards: frame.state.table,
      effects: createTableBonusEffects(),
      cleared: false,
    });
  }
  const playback = useMemo<OpeningTablePlayback | undefined>(() => {
    if (!session) return;
    const { deal, effects } = session;
    const source = new Set(deal.award?.sourceCards ?? []);
    const stages = deal.cards.map((_, index, keys) => {
      let streak = 0;
      for (let slot = index; slot >= 0 && source.has(keys[slot]); slot--) streak++;
      return streak;
    });
    return {
      land(timeline, key) {
        const index = deal.cards.indexOf(key);
        const card = board.current?.querySelector<HTMLElement>(`[data-bonus-card="${key}"]`);
        if (!card || index < 0 || !stages[index]) return;
        appendTableBonusHighlight(timeline, card, stages[index], index, effects[index]);
      },
      celebrate(timeline) {
        appendPerfectTableAward(
          timeline,
          board.current?.querySelector("[data-perfect-award]") ?? null,
          source.size,
        );
      },
    };
  }, [session, board]);

  useLayoutEffect(() => {
    const root = board.current;
    if (!root || !session || returning || (frame.motion && !reducedMotion)) return;
    // The rendered deal timeline is disposed at handoff. Retain its final source
    // levels in this owner while the existing points queue runs.
    const context = gsap.context(() => {
      const source = new Set(session.deal.award?.sourceCards ?? []);
      let streak = 0;
      session.deal.cards.forEach((key, index) => {
        streak = source.has(key) ? streak + 1 : 0;
        const effect = session.effects[index];
        effect.stage = streak;
        const card = root.querySelector(`[data-bonus-card="${key}"]`);
        const glow = card?.querySelector("[data-bonus-glow]");
        if (glow)
          gsap.set(glow, { opacity: !session.cleared && streak ? 0.25 + streak * 0.17 : 0 });
        gsap.set(effect.heat.current.strength, {
          value: !session.cleared && !reducedMotion && streak === 3 ? 1 : 0,
        });
        gsap.set(effect.flame.current, {
          value: !session.cleared && !reducedMotion && streak === 4 ? 1 : 0,
        });
        gsap.set(effect.ignition.current, { value: !session.cleared && streak === 4 ? 1 : 0 });
      });
    }, root);
    return () => {
      if (session.cleared) context.kill(false);
      else context.revert();
    };
  }, [session, board, frame.motion, reducedMotion, returning]);

  return {
    session,
    playback,
    busy: Boolean(session?.deal.award && !session.cleared && !returning),
    clearAward(id: string) {
      if (session?.deal.award?.id === id) setSession({ ...session, cleared: true });
    },
  };
}
