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
- Table → Cascade capture: the original play-card sound at each pickup start.
  Only a resolved Fall uses the new movement and impact clips.
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
Playground audio was approved by the user on 2026-11-18; live-match playback was also approved on 2026-11-18.

Verification: `lab.test.ts` checks state and capture intensity;
`AnimationPlayground.test.tsx` covers replay and audio lifecycle;
`cardTimelines.test.ts` checks shared contact cue scheduling and opt-in behavior;
`captureAudio.test.ts` checks gain, preferences, interruption and disposal.

## Earned points (#127)

The Points tab embeds the match module's public `ScoreAwardsPreview`, also used
by the component gallery. Its controls trigger each resolved award source, all
recipients, a winning amount, or a reconnect snapshot in all three game formats.
Reset scene cancels any flight and restores zero scores. The study uses the live
match's DOM/GSAP token, scoreboard and sequencing hook directly, without a WebGL
scene or unrelated card-animation tuning. Returning to a card study restores its
normal catalog and controls.

Table → Count cards now embeds the match module's public
`CaptureCountingPreview`. It shows the real counter artwork and each player's
collected pile, including two teammates feeding a shared pocket. The previous
study's quota pile on the table and centre-point destination have been removed.
Play/replay and tuning reset the count; format selection persists through replay.
The original playground canvas stays mounted but stops rendering while the live
count preview owns the scene. Both ordinary and extra cards enter their respective
pocket, while the existing counter and bonus-point treatment update on arrival.

## Table build bonus study (#136)

Table → Table bonus embeds the match module's public `TableBonusPreview` before
any live-match adoption. Table cards take 0.72 seconds to land, compared with
0.14 seconds for each hand card. Consecutive qualifying cards use four distinct
stages: a small gold glint, an emphatic double pulse, the shared card heat-transfer
shader, then only the shared `FlameEnvelope`. Heat and flames stay on their own
cards through the points flight; no table wave, scorch circle or impact burst is rendered.
Each stage retains its gold halo; earlier cards keep their individual intensity. A nonmatching card
breaks that streak and never receives a winner highlight. Four matches reveal a
large “Perfect table!” award, followed by the existing points flight. Partial
patterns hand off directly to that flight; no-bonus deals create no points token.

Controls cover all formats, every dealer seat, both pattern directions and deal
orders, perfect/partial/broken/no-bonus/winning cases, replay, reset and speed.
Changes cancel the old scene. Reduced motion shows the cards, source highlights,
recipient and final score immediately, without travel or pulsing. The winning
fixture resolves its result before presentation begins.

`tableBonusPreview` composes the authoritative deal service with a deterministic
deck. Opening awards now carry `sourceCards` from that service; the playback
adapter never compares ranks or calculates points. `TableBonusControls` owns
settings, `TableBonusTable` composes the board and score handoff, and
`tableBonusPlayback` owns cancellable GSAP choreography. No new assets are used.

Verification: fixture tests cover format/pattern/order/dealer combinations and
winning results; playback tests cover per-card intensity, escalating lift/burst/sheen, nonwinners, reduced
motion and interruption; preview integration tests cover Strict Mode, score
handoff, reset and unmount. Manual theme/responsive review and approval remain
pending, as do the clean-table study and live-match integration under #136.

`TableBonusFlames` is a decorative orthographic R3F overlay, aligned with live
card rectangles each frame. GSAP owns its mutable channels alongside DOM playback,
including speed and cancellation. It unmounts after the final points arrival and is omitted
for reduced motion or unavailable WebGL; renderer failure leaves DOM feedback and
the score handoff intact. `tableBonusPlayback.test.ts` checks stage gating, reset
after gaps, persistent heat/flames, cancellation and the award handoff.

The latest review reduces the halo footprint and spread behind every card. The
final points-flight arrival clears all source halos, sheen, bursts, heat and flames,
and unmounts the decorative canvas while leaving dealt cards and scores visible.
Reduced motion clears decorations immediately after its immediate score arrival.
The preview integration test checks highlights survive until arrival and then clear.

The approved source treatment is now shared with the live match under
`match/ui/components/flow/tableBonus`: decoration, highlight timeline,
perfect-table award and heat/flame renderer. The playground keeps its deterministic
settings and DOM-deal fixture; the game uses its existing rendered-card, audio and
input-lock owner for the opening deal. Both call the same highlight choreography.

## Clean-table bonus study (#136)

Table → Clean table embeds the match module's public `CleanTablePreview` with
format, capture example, capturing seat, reduce-motion, replay and reset controls.
It uses the live capture renderer/audio and resolved play service before a proposed
one-second gold clearing sweep and “Clean table!” PointsBadge reveal. The ordinary
points flight then credits the scoreboard. Fall points remain a separate queued
award. Excluded final-round clears and captures leaving cards behind show no
clean-table celebration. This is a playground proposal awaiting visual review;
live-match celebration adoption remains pending.

The catalog adds this composed preview without adding a command to the shared
3D lab state machine. Its capture, reward and points owners dispose on settings
changes or leaving the study. Tests and browser verification are recorded in the
[match module notes](../match/README.md#clean-table-playground-prototype-136).
