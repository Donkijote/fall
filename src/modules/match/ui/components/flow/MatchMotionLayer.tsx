import { lazy, Suspense, useLayoutEffect, useMemo, useState, type RefObject } from "react";

import type { CountingSnapshot } from "@/components/cards/motion/cardCounting";
import { SceneBoundary } from "@/components/surfaces/SceneBoundary";
import { useCardAudio } from "@/infrastructure/ui/hooks/useCardAudio";

import type { CardScene } from "../../../adapters/three/matchCardScene";
import type { MatchFrame } from "../../../application/localMatch";
import { measureCardScene } from "./measureCardScene";

const MatchCardCanvas = lazy(() => import("../../../adapters/three/MatchCardCanvas"));

export function MatchMotionLayer({
  board,
  frame,
  reducedMotion,
  returning,
  complete,
}: {
  board: RefObject<HTMLDivElement | null>;
  frame: MatchFrame;
  reducedMotion: boolean;
  returning: boolean;
  complete: () => void;
}) {
  const { motion } = frame;
  const audioRef = useCardAudio(!returning);
  const audio = useMemo(
    () => ({
      playCard: () => audioRef.current?.playCard(),
      playDealCard: () => audioRef.current?.playDealCard(),
    }),
    [audioRef],
  );
  const [failed, setFailed] = useState(false);
  const [stage, setStage] = useState<{
    motion: MatchFrame["motion"];
    scene: CardScene;
    handoff: () => void;
  }>();
  const animate = !reducedMotion && !failed && typeof WebGL2RenderingContext !== "undefined";

  useLayoutEffect(() => {
    const root = board.current;
    if (!root || !motion || returning) return;
    const measured = animate && measureCardScene(root, frame);
    if (!measured) {
      // Motion preferences do not mute the game; use a single cue for an instant event.
      if (motion.kind === "deal" || motion.kind === "count") audio.playDealCard();
      else audio.playCard();
      complete();
      return;
    }

    const original = measured.hidden.map((element) => [element, element.style.visibility] as const);
    let active = true;
    const handoff = () => {
      if (!active) return;
      for (const [element] of original) element.style.visibility = "hidden";
    };
    // A deal introduces new cards. For plays and captures the board still shows
    // the old position until the canvas paints the exact starting pose.
    if (motion.kind === "deal") handoff();
    setStage({ motion, scene: measured.scene, handoff });
    window.addEventListener("resize", complete);
    return () => {
      active = false;
      for (const [element, visibility] of original) element.style.visibility = visibility;
      window.removeEventListener("resize", complete);
    };
  }, [animate, audio, board, frame, motion, returning]);

  function count(side: number, snapshot: CountingSnapshot) {
    const label = board.current?.querySelector<HTMLElement>(`[data-count-side="${side}"]`);
    if (!label) return;
    const text = `${snapshot.counted}/${label.dataset.total} cards · +${snapshot.points}`;
    if (label.textContent !== text) label.textContent = text;
  }

  if (!animate || returning) return null;
  return (
    <div
      data-card-flights=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <SceneBoundary onFailure={() => setFailed(true)}>
        <Suspense fallback={null}>
          <MatchCardCanvas
            playback={
              stage && motion && stage.motion === motion
                ? {
                    scene: stage.scene,
                    handoff: stage.handoff,
                    audio,
                    complete,
                    count,
                  }
                : undefined
            }
          />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
