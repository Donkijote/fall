import { useEffect, useState } from "react";

import type { MatchFrame } from "../../../application/localMatch";
import { arriveScore, receiveScores, snapshotScores } from "../../../application/scorePresentation";

export function useScorePresentation(frame: MatchFrame, reducedMotion = false) {
  const [settling, setSettling] = useState(false);
  const [observed, setObserved] = useState(frame);
  const [presentation, setPresentation] = useState(() => snapshotScores(frame.state));
  // Card/capture/count motion owns its handoff first. In particular the opening
  // bonus is already resolved in a deal frame, but must wait for the dealt cards.
  if (observed !== frame && !frame.motion) {
    setObserved(frame);
    setPresentation((current) =>
      frame.snapshot
        ? snapshotScores(frame.state, current.seen)
        : receiveScores(current, frame.state),
    );
  }
  useEffect(() => {
    if (!settling) return;
    const timer = window.setTimeout(() => setSettling(false), reducedMotion ? 0 : 300);
    return () => window.clearTimeout(timer);
  }, [settling, presentation.announcement, reducedMotion]);
  return {
    ...presentation,
    busy: presentation.pending.length > 0 || settling,
    arrive: (id: string, announcement: string) => {
      if (presentation.pending[0]?.id !== id) return;
      setSettling(!reducedMotion);
      setPresentation((current) => arriveScore(current, id, announcement));
    },
  };
}
