import { useEffect, useState } from "react";

import type { GameMode, GameState } from "@/domain/entities/GameState";

import { simulateTurn, startMatch, type MatchFrame } from "../../../application/localMatch";

export function useLocalMatch(
  mode: GameMode,
  ready: boolean,
  returning: boolean,
  reducedMotion: boolean,
  paused: boolean,
) {
  const [frames, setFrames] = useState<MatchFrame[]>([]);
  const frame = frames[0];

  useEffect(() => {
    if (ready && !returning) setFrames((current) => (current.length ? current : startMatch(mode)));
  }, [mode, ready, returning]);

  useEffect(() => {
    if (!frame || frame.motion || returning || paused) return;
    const timer = window.setTimeout(
      () => {
        const next = simulateTurn(frame.state);
        if (next.length) setFrames((current) => (current[0] === frame ? next : current));
      },
      reducedMotion ? 220 : 550,
    );
    return () => window.clearTimeout(timer);
  }, [frame, returning, reducedMotion, paused]);

  function act(transition: (state: GameState) => MatchFrame[]) {
    if (!frame || frame.motion || returning || paused) return;
    setFrames((current) => {
      if (current[0] !== frame) return current;
      const next = transition(frame.state);
      return next.length ? next : current;
    });
  }

  function completeMotion() {
    setFrames((current) =>
      current[0] === frame && current.length > 1 ? current.slice(1) : current,
    );
  }

  return { frame, act, completeMotion };
}
