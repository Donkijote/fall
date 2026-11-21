# Shared audio adapters

`cardAudio` and `captureAudio` own their Howler groups, preference subscriptions,
gains and disposal. `motionAudio` composes both buses behind the shared playback
port. Game rules and application code do not import Howler or browser lifecycle
APIs.

`resumeAudioContext` handles the browser context boundary: WebKit can report
`interrupted` in addition to the standard `suspended` state. Both require an
explicit resume attempt; rejection is contained so a later real gesture can
retry. Running/closed/absent contexts are left alone. The adapter does not close
the shared context, reset preferences or replay pending game actions.

`useMotionAudio` and `useCardAudio` own browser visibility and gesture listeners.
They stop their session's sounds while hidden, retry unlock on foreground and
pointer/keyboard input, and remove listeners on disable/unmount. Existing game
timelines still own when a cue is played; recovery does not synthesize a move or
cue. Native audio output and interruptions need physical testing because a
resolved resume promise does not establish audible output.

Verification lives with each adapter/hook. `resumeAudioContext.test.ts` covers
interrupted/suspended contexts and retry after rejection; hook tests cover hidden
stop, foreground recovery and cleanup. Card/capture/motion tests retain cue,
preference, layering and disposal coverage. Physical evidence and open gaps are
recorded in [platform distribution](../../../../docs/design/platform-distribution/README.md).
