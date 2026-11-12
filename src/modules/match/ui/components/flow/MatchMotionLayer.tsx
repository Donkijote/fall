import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

import type { CountingSnapshot } from "@/components/cards/motion/cardCounting";
import { SceneBoundary } from "@/components/surfaces/SceneBoundary";
import { useCardAudio } from "@/infrastructure/ui/hooks/useCardAudio";

import { createPlaybackChannel } from "../../../adapters/three/matchCardScene";
import type { MatchFrame } from "../../../application/localMatch";
import { measureCardScene } from "./measureCardScene";
import { createMotionDeadline } from "./motionDeadline";

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
  const sequence = useRef(0);
  const [failed, setFailed] = useState(false);
  const [channel] = useState(createPlaybackChannel);
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
    let started = false;
    const hideCards = () => {
      for (const [element] of original) element.style.visibility = "hidden";
    };
    const finish = () => {
      if (!active) return;
      active = false;
      deadline.dispose();
      complete();
    };
    const deadline = createMotionDeadline(() => {
      if (!started) {
        if (motion.kind === "deal" || motion.kind === "count") audio.playDealCard();
        else audio.playCard();
      }
      finish();
    });
    const handoff = (seconds: number) => {
      if (!active) return;
      started = true;
      deadline.started(seconds);
      hideCards();
    };
    // A deal introduces new cards. For plays and captures the board still shows
    // the old position until the canvas paints the exact starting pose.
    if (motion.kind === "deal") hideCards();
    const id = ++sequence.current;
    const count = (side: number, snapshot: CountingSnapshot) => {
      const label = root.querySelector<HTMLElement>(`[data-count-side="${side}"]`);
      if (!label) return;
      const text = `${snapshot.counted}/${label.dataset.total} cards · +${snapshot.points}`;
      if (label.textContent !== text) label.textContent = text;
    };
    channel.publish({
      scene: measured.scene,
      handoff,
      complete: finish,
      count,
      audio,
      sequence: id,
    });
    const remeasure = () => {
      const updated = measureCardScene(root, frame);
      const current = channel.getSnapshot();
      if (updated && current?.sequence === id)
        channel.publish({ ...current, scene: updated.scene });
    };
    window.addEventListener("resize", remeasure);
    return () => {
      active = false;
      deadline.dispose();
      if (channel.getSnapshot()?.sequence === id) channel.publish();
      for (const [element, visibility] of original) element.style.visibility = visibility;
      window.removeEventListener("resize", remeasure);
    };
  }, [animate, audio, board, channel, frame, motion, returning]);

  if (!animate || returning) return null;
  return (
    <div
      data-card-flights=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20"
    >
      <SceneBoundary onFailure={() => setFailed(true)}>
        <Suspense fallback={null}>
          <MatchCardCanvas channel={channel} />
        </Suspense>
      </SceneBoundary>
    </div>
  );
}
