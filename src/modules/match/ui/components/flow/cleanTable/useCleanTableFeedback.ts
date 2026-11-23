import gsap from "gsap";
import { useLayoutEffect, useState, type RefObject } from "react";

import type { ScoreAward } from "@/domain/entities/GameState";

import { cleanTablePlayback } from "./cleanTablePlayback";

type Feedback = { id?: string; phase: "celebrate" | "points" | "done"; seen: ReadonlySet<string> };

/** Gate the existing award queue with the shared source celebration, once per ID. */
export function useCleanTableFeedback(
  head: ScoreAward | undefined,
  scoreBusy: boolean,
  board: RefObject<HTMLDivElement | null>,
  reducedMotion: boolean,
  blocked: boolean,
) {
  const [feedback, setFeedback] = useState<Feedback>({ phase: "done", seen: new Set() });
  if (head?.reason === "clear" && feedback.id !== head.id) {
    setFeedback({
      id: head.id,
      phase:
        feedback.seen.has(head.id) || blocked ? "done" : reducedMotion ? "points" : "celebrate",
      seen: new Set([...feedback.seen, head.id]),
    });
  } else if (
    (blocked || (feedback.phase === "points" && !scoreBusy)) &&
    feedback.phase !== "done"
  ) {
    // New motion, reconnects and leave cancel decoration without replaying it later.
    setFeedback({ ...feedback, phase: "done" });
  } else if (reducedMotion && feedback.phase === "celebrate") {
    setFeedback({ ...feedback, phase: "points" });
  }
  const award =
    !blocked && feedback.phase === "celebrate" && head?.id === feedback.id ? head : undefined;
  useLayoutEffect(() => {
    if (!award || !board.current) return;
    const context = gsap.context(() => {
      cleanTablePlayback(board.current!, award, false, () => {
        setFeedback((current) =>
          current.id === award.id && current.phase === "celebrate"
            ? { ...current, phase: "points" }
            : current,
        );
      });
    }, board);
    return () => context.revert();
  }, [award, board]);
  return {
    award,
    hold: Boolean(award),
    busy: !blocked && feedback.phase !== "done",
  };
}
