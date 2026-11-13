import gsap from "gsap";
import { useLayoutEffect, useRef } from "react";

import type { GameState } from "@/domain/entities/GameState";

import { useGSAP } from "@gsap/react";

import { localPlayerId, openDeal, type MatchFrame } from "../../../application/localMatch";
import { CaptureCount } from "../overlays/CaptureCount";
import { OpeningDeal } from "../overlays/OpeningDeal";

export function MatchControls({
  frame,
  sideName,
  act,
  reducedMotion,
  returning,
  paused,
}: {
  frame: MatchFrame;
  sideName: (side: string) => string;
  reducedMotion: boolean;
  returning: boolean;
  paused: boolean;
  act: (transition: (state: GameState) => MatchFrame[]) => void;
}) {
  const { state, motion } = frame;
  const localDeal = state.phase === "dealerChoice" && state.dealer === localPlayerId;
  const counting = motion?.kind === "count";
  const overlay = useRef<HTMLDivElement>(null);
  const { contextSafe } = useGSAP(
    () => {
      if (!overlay.current || reducedMotion || returning) return;
      gsap.from(overlay.current, { opacity: 0, duration: 0.28, ease: "sine.out" });
    },
    {
      scope: overlay,
      dependencies: [localDeal, counting, reducedMotion, returning],
      revertOnUpdate: true,
    },
  );

  const dealExit = useRef<gsap.core.Tween | null>(null);
  useLayoutEffect(() => {
    if (!paused || !dealExit.current?.isActive()) return;
    dealExit.current.revert();
    dealExit.current = null;
  }, [paused]);

  const submitDeal = contextSafe(
    (order: Parameters<typeof openDeal>[1], pattern: Parameters<typeof openDeal>[2]) => {
      if (returning || paused || dealExit.current?.isActive()) return;
      const startDeal = () => act((current) => openDeal(current, order, pattern));
      if (reducedMotion || !overlay.current) {
        startDeal();
        return;
      }
      dealExit.current = gsap.to(overlay.current, {
        opacity: 0,
        duration: 0.2,
        ease: "sine.in",
        overwrite: "auto",
        onComplete: startDeal,
      });
    },
  );

  if (!localDeal && !counting) return null;
  return (
    <div
      key={counting ? "count" : "deal"}
      ref={overlay}
      data-count-overlay={counting ? "" : undefined}
      className="pointer-events-none absolute inset-0 z-10"
    >
      {localDeal ? (
        <OpeningDeal deal={submitDeal} />
      ) : counting ? (
        <CaptureCount groups={motion.groups} sideName={sideName} />
      ) : null}
    </div>
  );
}
