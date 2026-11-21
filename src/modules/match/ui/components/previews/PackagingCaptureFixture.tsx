import { Howler } from "howler";
import { lazy, Suspense, useEffect, useState } from "react";

import { createMotionAudio } from "@/infrastructure/adapters/audio/motionAudio";

import { createPlaybackChannel, type CardScene } from "../../../adapters/three/matchCardScene";

const MatchCardCanvas = lazy(() => import("../../../adapters/three/MatchCardCanvas"));

const cases = ["plain", "ice", "heat", "flame", "cascade"] as const;
const ranks = [5, 10, 11, 12, 5] as const;

// Fixed presentation inputs, not a second implementation of capture legality.
function sceneFor(index: number): CardScene {
  const rank = ranks[index];
  const cascade = cases[index] === "cascade";
  return {
    kind: "collect",
    capture: cascade ? "cascade" : "fall",
    played: {
      art: { suit: "cups", rank },
      origin: { x: 2, y: 1.7, z: 0, angle: 0, faceUp: true },
      size: 0.44,
    },
    targets: (cascade ? ([5, 6, 7, 10] as const) : [rank]).map((target, ordinal) => ({
      art: { suit: "coins", rank: target },
      origin: { x: cascade ? ordinal * 0.9 - 1.35 : 0, y: 0, z: 0, angle: 0, faceUp: true },
      size: 0.44,
    })),
    pile: { x: 2.8, y: -1.7, z: 0 },
    pileSize: 0.44,
  };
}

export function PackagingCaptureFixture() {
  const [channel] = useState(createPlaybackChannel);
  const [status, setStatus] = useState("Preparing capture fixture");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const repetitions = Math.min(100, Math.max(1, Number(params.get("runs")) || 30));
    const soakMs = Math.min(1800, Math.max(0, Number(params.get("soak")) || 0)) * 1000;
    const audio = createMotionAudio();
    audio.prepare();
    let started = 0;
    let cancelled = false;
    let sequence = 0;
    let iteration = 0;
    let raf = 0;
    let timer = 0;
    let warmup = true;
    const report = (detail: object) =>
      window.dispatchEvent(new CustomEvent("fall:packaging", { detail }));
    const run = () => {
      if (cancelled) return;
      const index = iteration % cases.length;
      const repetition = Math.floor(iteration / cases.length);
      const name = cases[index];
      setStatus(`${warmup ? "Warmup" : "Capture"}: ${name} ${repetition + 1}`);
      const frames: number[] = [];
      const cues: { cue: string; at: number }[] = [];
      let begin = 0;
      let last = 0;
      let settled = false;
      const sample = (time: number) => {
        if (last) frames.push(time - last);
        last = time;
        raf = requestAnimationFrame(sample);
      };
      const settle = (error?: string) => {
        if (settled || cancelled) return;
        settled = true;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        report({
          kind: "capture",
          name,
          repetition,
          warmup,
          frames,
          cues,
          elapsedMs: begin ? performance.now() - begin : null,
          started: begin > 0,
          audioState: Howler.ctx?.state,
          error,
        });
        audio.stop();
        if (error) {
          setStatus(error);
          return;
        }
        iteration++;
        if (warmup && iteration === cases.length) {
          warmup = false;
          iteration = 0;
        } else if (
          !warmup &&
          iteration >= repetitions * cases.length &&
          performance.now() - started >= soakMs
        ) {
          channel.publish();
          report({ kind: "complete", captures: iteration, elapsedMs: performance.now() - started });
          setStatus("Capture measurements complete");
          return;
        }
        timer = window.setTimeout(run, 150);
      };
      timer = window.setTimeout(
        () => settle("Capture failed to complete within 15 seconds"),
        15000,
      );
      channel.publish({
        scene: sceneFor(index),
        sequence: ++sequence,
        count: () => {},
        pileRemaining: () => {},
        handoff: () => {
          begin = performance.now();
          raf = requestAnimationFrame(sample);
        },
        complete: () => settle(),
        audio: {
          playCard: () => {
            cues.push({ cue: "card", at: performance.now() - begin });
            audio.playCard();
          },
          playDealCard: () => audio.playDealCard(),
          playCapture: (cue) => {
            cues.push({ cue, at: performance.now() - begin });
            audio.playCapture(cue);
          },
        },
      });
    };
    const onVisibility = () => {
      if (cancelled) return;
      if (!started && document.visibilityState === "visible") {
        started = performance.now();
        report({ kind: "started" });
        // Defer until after React's development-only effect replay.
        timer = window.setTimeout(run, 0);
      } else if (started && document.visibilityState !== "visible") {
        cancelled = true;
        clearTimeout(timer);
        cancelAnimationFrame(raf);
        channel.publish();
        audio.stop();
        report({ kind: "interrupted", error: "Active-rendering window became hidden" });
        setStatus("Rendering interrupted: window became hidden");
      }
    };
    setStatus("Waiting for the app window to become visible");
    document.addEventListener("visibilitychange", onVisibility);
    onVisibility();
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      channel.publish();
      audio.dispose();
    };
  }, [channel]);

  return (
    <>
      <div className="absolute inset-0" aria-hidden="true">
        <Suspense fallback={null}>
          <MatchCardCanvas channel={channel} />
        </Suspense>
      </div>
      <div className="pointer-events-none absolute top-[calc(1rem+var(--safe-area-top))] left-4 rounded-md border border-border bg-background p-3">
        <h1>Packaging validation</h1>
        <p role="status">{status}</p>
        <p>Fixed scenes · Live match renderer · DPR capped at 2</p>
      </div>
    </>
  );
}
