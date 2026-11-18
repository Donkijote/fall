# Animation playground

Development-only card, deck and table studies. `ui/AnimationPlayground.tsx`
composes experiment selection, replay and tuning. `application/lab.ts` owns study
state and passes an audio port to renderers; it does not implement capture rules.
`adapters/three` renders shared card poses/timelines and supplies contact markers.
`adapters/audio/howlerAudio.ts` aliases the shared infrastructure
`createMotionAudio` session used by the live match. The Play gesture lazily
creates and unlocks the session. It delegates preferences to the audio adapters, and
stops playback on reset, replay, tuning and tab changes, and disposes it on unmount.
It creates no audio resources during render, including Strict Mode's extra render.

## Approved capture audio (#125)

The user-approved studies and the live match share these cues:

- Card → Freeze card: short freeze texture when the frost starts forming.
- Card → Shatter frozen card: freeze texture and movement, followed by shatter
  with a quieter card-contact layer.
- Table → Fall capture → Ice shatter: movement at hand release, freeze at the elemental
  lift, and shatter plus the quiet card hit at `impactAt`. The far player's initial ordinary play retains its own cue.
- Table → Capture card: the original play-card sound at movement start, matching
  Play a card. It does not use the new Fall movement or contact cues.
- Table → Cascade capture: a movement/contact pair at each existing pickup;
  the repeated rhythm distinguishes it from an ordinary single capture.
- Table → Fall capture → Card drop: movement as the matching card leaves the
  hand, then a simple-capture accent on impact.
- Card → Drop hot card and Table → Fall capture → Heat transfer: the 1.7-second
  fire burst starts before contact, during the elemental lift like the frost cue
  (at the start of the isolated drop study). Movement sounds at release; a quiet
  card hit plays separately at contact without cutting off the fire.
- Card → Drop flame card and Table → Fall capture → Flame impact: fire starts
  while the card hovers. Wind starts at hand release, overlaps the fire and
  continues through descent until earth impact replaces it at contact. The earth-only tail continues through pickups;
  there is no simple Fall movement cue or card hit. The isolated drop has a 0.15-second hover.
- Sweep has no new contact and receives no capture hit with the new audio port.

Shared `appendCapture` opts into these cues only when the audio port supplies
`playCapture`. Both the live match and playground now provide the same port.
Ordinary deal, play and count clips remain separate.
GSAP markers use the animation clock and obey timeline speed; clip pitch remains
unchanged. Movement can overlap frost; an impact stops the previous impact
layers. Flame stops its flight wind at contact and keeps a separate aftermath
voice so following cascade pickups do not cut off the rumble. Shatter and heat layer the simple card hit at gain 0.22, about 31% of its normal
0.7 gain. Both layers follow master preferences, and reset stops every voice.

Runtime exports and reproducible edits live in
[`src/assets/audio/captures`](../../assets/audio/captures/README.md). The credits
inventory records source verification and outstanding download-record gaps.
Playground audio was approved by the user on 2026-11-18; live-match human
audition is still pending.

Verification: `lab.test.ts` checks state and capture intensity;
`AnimationPlayground.test.tsx` covers replay and audio lifecycle;
`cardTimelines.test.ts` checks shared contact cue scheduling and opt-in behavior;
`captureAudio.test.ts` checks gain, preferences, interruption and disposal.
