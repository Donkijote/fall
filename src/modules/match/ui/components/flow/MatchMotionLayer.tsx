import gsap from "gsap";
import { lazy, Suspense, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";

import { appendCapture } from "@/components/cards/motion/cardTimelines";
import { SceneBoundary } from "@/components/surfaces/SceneBoundary";
import type { CaptureCue } from "@/domain/audio/captureCue";
import { toCardKey } from "@/domain/helpers/card";
import { useMotionAudio } from "@/infrastructure/ui/hooks/useMotionAudio";

import type { OpeningTablePlayback } from "../../../adapters/three/matchCardScene";
import { createPlaybackChannel } from "../../../adapters/three/matchCardScene";
import { matchFallEffect } from "../../../adapters/three/matchFallEffect";
import type { MatchFrame } from "../../../application/localMatch";
import { createCaptureCounterPlayback } from "./captureCounterPlayback";
import { measureCardScene } from "./measureCardScene";
import { createMotionDeadline } from "./motionDeadline";

const MatchCardCanvas = lazy(() => import("../../../adapters/three/MatchCardCanvas"));

export function MatchMotionLayer({
  board,
  frame,
  reducedMotion,
  returning,
  complete,
  countSpeed = 1,
  openingTable,
}: {
  board: RefObject<HTMLDivElement | null>;
  openingTable?: OpeningTablePlayback;
  countSpeed?: number;
  frame: MatchFrame;
  reducedMotion: boolean;
  returning: boolean;
  complete: () => void;
}) {
  const { motion } = frame;
  const audioRef = useMotionAudio(!returning);
  const audio = useMemo(
    () => ({
      playCard: () => audioRef.current?.playCard(),
      playDealCard: () => audioRef.current?.playDealCard(),
      playCapture: (cue: CaptureCue) => audioRef.current?.playCapture(cue),
      stop: () => audioRef.current?.stop(),
    }),
    [audioRef],
  );
  const sequence = useRef(0);
  const playback = useRef<{ motion: typeof motion; started: boolean }>({ motion, started: false });
  const [failed, setFailed] = useState(false);
  const [channel] = useState(createPlaybackChannel);
  const animate = !reducedMotion && !failed && typeof WebGL2RenderingContext !== "undefined";

  useLayoutEffect(() => {
    const root = board.current;
    if (!root || !motion || returning) return;
    if (playback.current.motion !== motion) playback.current = { motion, started: false };
    const counters =
      motion.kind === "count" ? createCaptureCounterPlayback(root, motion.groups) : undefined;
    const overlay = motion.kind === "count" && root.querySelector("[data-count-overlay]");
    const exit = overlay && !reducedMotion ? gsap.context(() => {}, root) : undefined;
    const settle = () => {
      if (!overlay || !exit) {
        complete();
        return;
      }
      exit.add(() => {
        gsap.to(overlay, {
          opacity: 0,
          y: -6,
          duration: 0.26,
          ease: "sine.in",
          onComplete: complete,
        });
      });
    };
    const showFinalCount = () => {
      if (motion.kind !== "count") return;
      for (const { side, cards, quota } of motion.groups) {
        counters?.update(side, { counted: cards, points: Math.max(0, cards - quota) }, false);
      }
    };
    const measured = animate && measureCardScene(root, frame);
    if (!measured) {
      // If WebGL failed after handoff, settle without replaying already-started cues.
      if (playback.current.started) {
        audio.stop();
        showFinalCount();
        settle();
        return () => {
          exit?.revert();
          counters?.dispose();
        };
      }
      if (motion.kind === "collect") {
        const target = frame.state.table.find((card) => toCardKey(card) === motion.targets[0]);
        let finished = false;
        const timeline = appendCapture(
          gsap.timeline({ paused: true }),
          { progress: 0, cooldown: 0, followThrough: 0 },
          motion.capture,
          motion.targets.length,
          audio,
          matchFallEffect(target?.rank),
          true,
        );
        timeline.eventCallback("onComplete", () => {
          finished = true;
          complete();
        });
        timeline.play();
        return () => {
          timeline.kill();
          if (!finished) audio.stop();
        };
      }
      if (motion.kind === "deal" || motion.kind === "count") audio.playDealCard();
      else audio.playCard();
      if (motion.kind === "count") {
        showFinalCount();
        const timer = window.setTimeout(settle, 1100);
        return () => {
          window.clearTimeout(timer);
          exit?.revert();
          counters?.dispose();
        };
      }
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
      showFinalCount();
      settle();
    };
    const deadline = createMotionDeadline(() => {
      if (!started) {
        // Rerun this effect through its full audio-only fallback.
        setFailed(true);
        return;
      }
      audio.stop();
      finish();
    });
    const handoff = (seconds: number) => {
      if (!active) return;
      started = true;
      playback.current.started = true;
      deadline.started(seconds);
      hideCards();
    };
    // A deal introduces new cards. For plays and captures the board still shows
    // the old position until the canvas paints the exact starting pose.
    if (motion.kind === "deal") hideCards();
    const id = ++sequence.current;
    const collectors = new Map(
      [...root.querySelectorAll<HTMLElement>("[data-collector]")].map((element) => [
        element.dataset.collector!,
        {
          back: element.querySelector<HTMLElement>("[data-pile-back]"),
          layer: element.querySelector<HTMLElement>("[data-pile-layer]"),
        },
      ]),
    );
    const pileRemaining = (player: string, remaining: number) => {
      if (!active) return;
      const pile = collectors.get(player);
      if (pile?.back) pile.back.hidden = remaining === 0;
      if (pile?.layer) pile.layer.hidden = remaining <= 1;
    };
    channel.publish({
      openingTable: openingTable && {
        land(timeline, key) {
          const element = root.querySelector<HTMLElement>(`[data-table-card="${key}"]`);
          // Each landed opening card returns to DOM ownership for the shared lift,
          // sheen and persistent heat/flames while the next card is still in flight.
          if (element) timeline.set(element, { visibility: "visible" });
          openingTable.land(timeline, key);
        },
        celebrate: openingTable.celebrate,
      },
      scene: measured.scene,
      countSpeed,
      handoff,
      complete: finish,
      count: (side, snapshot) => counters?.update(side, snapshot),
      pileRemaining,
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
      if (active) audio.stop();
      active = false;
      deadline.dispose();
      counters?.dispose();
      exit?.revert();
      for (const { back, layer } of collectors.values()) {
        if (back) back.hidden = false;
        if (layer) layer.hidden = false;
      }
      if (channel.getSnapshot()?.sequence === id) channel.publish();
      for (const [element, visibility] of original) element.style.visibility = visibility;
      window.removeEventListener("resize", remeasure);
    };
  }, [animate, audio, board, channel, countSpeed, frame, motion, returning, openingTable]);

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
