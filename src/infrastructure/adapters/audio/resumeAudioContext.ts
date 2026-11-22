import { Howler } from "howler";

/** WebKit can interrupt audio without reporting the standard suspended state. */
export function resumeAudioContext() {
  const context = Howler.ctx;
  const state: string | undefined = context?.state;
  if (context && (state === "suspended" || state === "interrupted")) {
    // Also retry from the next real gesture if foreground recovery is denied.
    void context.resume().catch(() => {});
  }
}
