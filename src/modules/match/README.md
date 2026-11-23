# Local Tavern match

Landscape presentation (#137): use the small landscape layout as the unprefixed Tailwind base and standard width breakpoints for larger layouts. There are no portrait layout branches or compact-orientation variants. See [the supported viewport policy](../../../docs/design/README.md#supported-viewport-policy) for verification targets. Orientation enforcement is deferred to #140; historical portrait reviews below do not imply current support.

`index.ts` exports `MatchScreen` at `/game/:matchId`. The local table uses
`tavern-7f3a` and reads the selected format from the `mode` query. Opening
the URL directly or refreshing starts a fresh session. Cancel matchmaking and
Back to Tavern return to the format picker. During a match, the door control
and Escape open a leave confirmation. Keep playing or Escape dismisses the
dialog. Confirming discards the current local match.

- `application/localMatch.ts` composes the shared, framework-independent
  dealer selection, deal, Sing, play, capture, and counting rules. It returns
  board frames and motion events. Seats draw for the first dealer
  automatically; the local dealer can choose the opening deal order and
  table pattern. Sings are evaluated automatically at each deal.
- `ui/components/flow` owns the simulated arrivals, turn timers, and the
  handoff from the board to the 3D scene. It measures the current card, deck,
  and pile positions. For a play or capture, the hand and table stay in place
  until the first 3D frame takes over. Motion frames lock input until the
  scene finishes. The canvas advances card timelines with the same frame
  clock it uses to render and remeasures destinations when the window changes.
  If playback fails to start or stops responding, the queued move settles so
  the next turn can proceed. Reduced motion and unavailable WebGL settle
  captures without card movement using the same audio timeline. Ordinary play
  and deal fallback frames still settle immediately; count retains its reading pause. Leaving the table cancels pending
  timers, motion, and audio.
- `ui/components/board` renders seats, cards, scores and dealer controls. The
  score tally is an overlay above the seats, outside board layout flow. Table cards keep their assigned grid slots. A play reserves a
  free slot until the card lands; a capture flies directly to its targets.
  `adapters/three` renders the animated cards and decorative
  hearth ash. The Playground and match use the same R3F card mesh,
  GSAP timelines, 3D poses, counting playback, and Howler card sounds.
  The match supplies actual card faces and measured board positions. A
  single capture, cascade, or Fall is one sequence from hand to pile. If a
  Fall also takes a cascade, the shared Fall impact plays before the extra
  pickups. A Fall on rank 10 shatters ice, rank 11 transfers heat, and rank
  12 triggers the flaming impact. Artwork is loaded during the lobby and retained for the match.

- `ui/components/overlays` renders the waiting sign, opening deal, capture count, leave confirmation,
  and illustrated result with final standings. The dialog blocks board input and
  pauses new bot turns. An in-flight card sequence can finish behind it.

`localMatch.test.ts` plays each format through to a winner, checking full
deck accounting during motion and rules resolution. Home navigation tests
cover entering the table and returning focus on cancel. The
[table design notes](../../../docs/design/tavern-match/README.md) describe
the composition and responsive checks.

There is no server state: guests are local bots, and leaving the table
discards the match.

The capture tray enters before the first card lands and exits after the count
settles. The next frame then presents the opening deal, a bot deal, or the
result. Confirming the opening deal fades its controls before card motion
begins. Reduced motion keeps these handoffs immediate.

The module entry point also exports `matchGallery` for the development-only
Component gallery. Preview fixtures live under `ui/components/previews` and
render this module’s styled components with sample props.

OpeningDeal owns the selected deal order and bonus pattern and passes them to
the existing deal callback. OpeningDealPreview renders the destination diagram
and bonus tiles, with GSAP position changes and a reduced-motion preference.
OpeningDeal.test.tsx checks keyboard selection, retained selections, and the
submitted options.

WaitingSign shares the occupied-seat token between the live lobby and gallery.
It animates newly occupied seats using GSAP while retaining the live seat count
and honoring reduced motion.

## Capture sound playback (#125)

The match and animation playground use the same infrastructure
`createMotionAudio` session and shared `appendCapture` timeline. The match
passes the resolved capture kind, target count and rank-based visual effect;
sound never reclassifies a move or changes capture/scoring rules. The existing
live Fall starts with its target already on the table, so it uses the shared
compressed lift (0.42 seconds to contact) without replaying the prior target play.

| Resolved motion                     | Approved sound treatment                                                                                                    |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Ordinary play / single card capture | Original play-card cue at movement start, as requested in playground review                                                 |
| Cascade                             | Original play-card sound at each pickup start                                                                               |
| Plain Fall                          | Movement at hand release, short impact at contact                                                                           |
| Rank 10 Fall                        | Movement, frost during lift, shatter plus quiet card contact                                                                |
| Rank 11 Fall                        | Movement, fire during lift, separate quiet contact that preserves the fire tail                                             |
| Rank 12 Fall                        | Blizzard from hand release to contact, fire during hover, earth-only impact and rumble; no simple Fall movement or card hit |
| Fall with extra pickups             | One Fall sequence, then original card sounds for extra pickups; earth aftermath survives pickups                            |
| End-of-round sweep                  | Silent return; no new impact                                                                                                |
| Deal / count                        | Existing deal/count clips                                                                                                   |

`useMotionAudio` preloads before the motion layout effect and unlocks on pointer
or keyboard gestures. Hiding the document stops active sounds; foregrounding
retries preparation without replaying a cue. The shared audio-context adapter
resumes both suspended and WebKit-interrupted contexts. The physical iOS longer
background check exposed Howler stuck suspending while WebKit remained
interrupted; the recovery change passed standalone physical background, lock, output-change
and system-interruption retests, recorded with duration limits in the
platform-distribution report. Master mute/volume, per-layer gains and wind looping are
owned by the shared adapters. Leaving or restarting disposes both card and
capture sounds. Interrupted scenes stop audio; a completed scene may finish its
bounded tail. Reduced motion, missing measurements and unavailable WebGL run
`appendCapture` on an audio-only GSAP timeline before advancing the frame. A
renderer that never starts falls back to that timeline; a failure after handoff
stops and settles without replaying the capture. Neither fallback needs WebGL.

The original issue requested a distinct single-capture sound. The approved
review explicitly keeps it identical to Play a card. Assets, edits and license
records are in `src/assets/audio/captures` and the credits inventory. Playground
playback was approved on 2026-11-18; live-match playback was also approved on 2026-11-18.

Verification: `MatchMotionLayer.test.tsx` covers rendered-port wiring, resolved
Fall effects, cascade/follow-through, ordinary capture and sweep, reduced-motion
and no-WebGL playback, deadlines, renderer failure and interruption.
`useMotionAudio.test.tsx` covers first-layout readiness, gesture/foreground unlock,
hidden playback stop, listener cleanup, leave,
restart and Strict Mode cleanup. `motionAudio.test.ts` verifies the shared session
preloads once and owns both adapters. Existing shared timeline and capture-audio
tests retain timing, preference, layering, disposal and volume coverage.

Regression coverage also resolves real single and consecutive-rank table captures
through `playMatchCard` and verifies they never emit Fall cues. Only a resolved
Fall uses the imported flight/impact clips; cascade pickups use original card audio.

## Current-turn presentation — GHI #124

`MatchSeatMarker` composes the shared `PlayerPortrait` orbit-led brass draw/wipe
and the feature-owned `TurnPointer`. The pointer stays mounted for its exit,
uses a brief spring arrival and scale/fade release, and reads the real stored/system
motion preference. PlayableBoard suppresses seat arrival motion separately; that
suppression must not disable current-turn cues. Native active-seat text changes
immediately, and decorative arrow/ring artwork remains outside the accessibility tree.

`TurnPointer.test.tsx` covers interruption, reduced motion and unmount cleanup;
`PlayerPortrait.test.tsx` covers arc/head alignment and ring lifecycle. The module
gallery's seat preview has a Pass turn control for exercising both occupied seats
and retains an open-seat example.

The application seat model's `getActiveSeatPlayer` keeps the dealing frame's
dealer highlighted until motion completion, then derives the next active player
from the completed play frame. This is presentation ownership only: it does not
change domain turn order or enable card input during a deal. `matchSeats.test.ts`
covers the deal-to-play handoff in every mode and both deal orders, including a
playable destination state while deal playback still owns the indicator.

## Earned points — GHI #127

The shared `awardPoints` service emits a cumulative `ScoreAward` stream alongside
immediate authoritative totals. Each payload contains a stable match-stream ID,
recipient side and player, resolved amount, reason, optional Sing name, and source
anchor kind. No scoring formula lives in presentation code. The audited paths are:

| Rule owner                    | Award                                         | Anchor                     |
| ----------------------------- | --------------------------------------------- | -------------------------- |
| `deal.applyTablePatternBonus` | Opening pattern bonus                         | Table centre               |
| `resolveHands.resolveHands`   | Winning Sing, including its name              | Winner's hand              |
| `moves.finalizeAfterPlay`     | Clear table and Fall, separate ordered events | Table centre               |
| `scoring.applyCountingRule`   | Each positive captured-card award             | Recipient's capture pocket |
| `scoring.awardPoints` default | Other/future resolved awards                  | Table centre               |

`application/scorePresentation` deduplicates event IDs, queues simultaneous awards,
and maintains displayed totals independently of game state. IDs are scoped to one
match stream; a future server can supply authoritative IDs through the same payload.
Initial mount establishes a snapshot baseline. Reconnect adapters must provide a
`MatchFrame` with `snapshot: true`; snapshot totals/corrections settle immediately,
cancel pending presentation, and retain seen IDs. Duplicate delivery, stale retries,
and repeated completion callbacks cannot credit or present an award twice.

`useScorePresentation` observes resolved frames after card captures, deals/Sings,
and the capture-count overlay finish. It does not defer rule resolution or server
processing. `MatchPointsLayer` uses one weighted PointsBadge per award, shows the
provenance at its source, follows a GSAP arc into the exact side's scoreboard slot,
and pulses the destination before updating the displayed tally. Multiple events
remain ordered, including teammates sharing a slot. Live rectangles are read during
flight so responsive layout changes retarget without replay. Missing source anchors
fall back to the table centre. Missing destinations settle immediately. DOM motion
has no WebGL dependency. GSAP contexts and tally tweens are disposed on interruption,
leave, snapshot, and unmount. Result presentation waits for all awards and the final
260ms tally interpolation (with a 300ms handoff allowance).

Reduced motion settles immediately, keeps the most recent recipient/amount/reason
visible above the table, and announces it through a polite status region. Normal
motion uses the same accessible feedback without a second visual notification.

The gallery's MatchPointsLayer example covers each source, all recipients, large
winning amounts, explicit reconnects, and 1v1 / free-for-all / teams. Focused tests
cover domain totals through complete matches in all formats, duplicate and stale
events, snapshots, ordered arrivals, result handoff timing, GSAP cleanup, and live
retargeting at phone portrait, landscape and desktop dimensions. The user approved visual validation on 2026-11-19. Manual assistive-technology
announcement review remains pending.

`index.ts` also exports `ScoreAwardsPreview` for the animation playground's Points
tab. Both development surfaces share this fixture and the live match's points
layer/tally implementation. Reset scene remounts only the preview table, disposing
pending flights and clearing scores while retaining the chosen format.

## Pocket counting revision

Counting now targets `CaptureCount`'s measured `data-capture-pocket` opening,
separate from its bonus-coin anchor. Every quota and extra card lifts from its
owner's collected pile, fits the pocket width, approaches above the opening,
and slides behind the leather lip. `samplePocketCount` owns this rendered pose;
per-card world-space clipping hides the portion below the opening during entry.
Completed cards disappear into the pocket instead of forming a second table pile.
The shared counting arrival schedule still updates cards/bonus values only after
insertion. Teammates feed their own piles into their shared side's pocket.

The existing scene remeasurement retargets the pocket and clip plane on resize.
A missing/unmeasurable pocket uses the established count fallback. The shared
CardMesh accepts optional clipping planes; ordinary cards retain `null` clipping.
`samplePocketCount.test.ts` covers origins on every side, quota and extra-card
entry, complete consumption and resize; `measureCardScene.test.ts` covers side,
team and source-pile measurement in all three formats.

`CaptureCountingPreview` is the public fixture used by the animation playground's
Table → Count cards study. It composes the live seats/piles, counter artwork,
measurement, renderer, count feedback and completion fallback. The fixture exposes
all formats and reuses the playground's total, quota, speed, replay and reset.

The counting fixture waits until its board ref is attached before mounting the
motion layer. It begins directly in a count frame, unlike the live board that
initially mounts without motion. Its preview test checks board readiness in the
child layout effect, including format changes and replay.

Points flights scale to the board's available space and shrink into the measured
score tile. The badge owns the flight pivot; its source caption sits below it and
fades during travel. `pointsFlight` constrains the visible badge/caption to the
board edges, including the upward arc and entrance overshoot. Geometry tests cover
667×320 and 844×390 landscape, portrait, desktop and orientation changes. Browser
checks at both landscape sizes confirmed flights arrive without clipping.

## Native packaging fixture (#140)

`packaging.ts` is a separate, opt-in public entry for `ui/PackagingSpike.tsx`.
Only a build with `VITE_PACKAGING_SPIKE=1` registers `/packaging-spike`; ordinary
production builds remove the route and fixture. Supporting UI lives in
`ui/components/previews/PackagingCaptureFixture.tsx`. It uses fixed presentation
scenes and the existing live `MatchCardCanvas`, shared GSAP timelines, effects,
and infrastructure audio adapter; it does not resolve or duplicate game rules.
The fixture emits measurements through a DOM event consumed by local diagnostic
instrumentation, without adding a native API or production global test interface.

One warmup and 30 repetitions cover plain Fall, rank-10 ice, rank-11 heat, rank-12
flame, and a four-card cascade. An optional soak continues cycling for 20 minutes.
The workload clock starts only once the document is visible. Becoming hidden
after starting aborts the active-rendering run instead of counting background
time as a pass.
An optional `manual=1` query flag additionally waits for a pointer release before
starting, allowing the physical iOS test to unlock audio through a real touch.
Cleanup stops audio, timers, frame sampling and playback. This fixture deliberately
exercises full motion independently of preferences; reduced-motion and WebGL
fallback remain separate live-match checks. The owner verified the restored
normal iPhone app honors the reduced-motion preference with usable cards and
sound; improving that presentation belongs to #150. See
the [macOS validation protocol](../../../docs/design/platform-distribution/README.md#repeat-the-macos-measurements)
for measurement limits and native verification. Probe/runner scripts and raw
machine-specific JSON remain local and are not included in a fresh clone.

## Opening-table bonus prototype (#136)

The public `TableBonusPreview` is a playground-only composition. Its application
fixture builds deterministic decks and calls `dealRound`; it does not own rules.
`applyTablePatternBonus` attaches optional `ScoreAward.sourceCards` in deal order,
so source feedback uses the same resolution as the score. Existing awards and
consumers remain compatible when source-card metadata is absent.

Supporting preview UI separates settings, board/score orchestration and GSAP
playback. A deal motion frame holds the existing score-presentation handoff until
landings and the optional perfect-table celebration finish. The regular
`MatchPointsLayer` then owns score travel and arrival. Reset/replay replace the
scene and revert its GSAP context. Reduced motion settles immediately with static
source and recipient feedback. The fixture tests cover authoritative resolution;
playback and preview tests cover sequencing, cancellation and Strict Mode.
The live match now adopts this choreography for each dealer’s opening table deal.

The four consecutive source stages are glint, double pulse, the shared card
heat-transfer shader, and only the shared flame envelope. There are no table
waves or impact circles. `TableBonusFlames` owns only a decorative R3F
overlay; `tableBonusEffects` supplies mutable channels animated by the same GSAP
playback. Measured card rectangles keep effects aligned on resize. Missing WebGL
or renderer failure retains DOM highlights, while reduced motion uses static
halos. Heat and flames persist through points travel. The final points arrival clears
all card decorations and disposes the canvas; reset/replay/unmount also revert
all channels. Reduced motion clears decorations with its immediate score arrival.

## Live opening-table choreography (#136)

`openDeal` attaches an optional `motion.openingTable` payload containing the four
cards in deal order and only the opening award emitted by that deal. Later hand
refills omit it. Existing award history cannot create source highlights for a
no-bonus opening; authoritative scores and winners still resolve immediately.

`adapters/three/matchDealPlayback` retains the existing hand stagger/fan and sound
cues. The opening table cards each travel for 0.72 seconds, then return to their
DOM owner for the same source feedback as the playground before the next card
starts. `flow/tableBonus` owns shared decoration, GSAP choreography, perfect-table
award, heat/flame channels and rendering. The rendered timeline advances on the
existing R3F frame clock and includes all reading pauses in the motion deadline.
Interrupted contexts revert. Completed opening contexts preserve their source
feedback across the handoff to the existing ordered points queue. Score arrival
clears the source feedback and unmounts its canvas. No table-impact circles are
introduced. Reduced motion or unavailable WebGL settles the deal and provides
static source/recipient feedback through the same points owner.

`useOpeningTableBonus` retains this presentation session across frame changes;
`PlayableBoard` disables hand input and reports opening-feedback ownership to
`TavernMatch`, which pauses simulated turns until the opening points arrive.
Sing awards resolved by the same deal retain their separate ordered flights.
`tableSlots` seeds the four opening cards in a reading-order 2×2 centre block,
using the same logical slots in both the 6×2 small layout and 4×3 large layout.
Subsequent plays reserve other slots with the existing allocation; captures do
not move remaining cards. `wideTableSlot` is a bijection, preserving collision-free
placement across responsive layout changes.

Verification: `localMatch.test.ts` covers current-award ownership in all formats,
both directions and deal orders, including stale history in no-bonus deals.
`matchDealPlayback.test.ts` checks serial table arrivals, feedback pauses, sound
counts and unchanged hand timing/fan. `PlayableBoard.test.tsx` covers the real
source-to-points handoff in Strict Mode, simultaneous Sing awards, effect cleanup,
subsequent motion, reduced motion, no-bonus and match-winning openings.
`MatchMotionLayer.test.tsx` covers the per-card rendered-to-DOM handoff and
interruption; existing fallback/deadline tests remain in force. `tableSlots.test.ts`
checks 2×2 geometry, responsive mapping and stable later slots.

Browser verification on the existing port 3000: normal rendered perfect openings
at 1440×900 (duel) and 568×320 (teams), including source progression, perfect-table
award, opening/Sing point order and cleared effects. Reduced-motion checks at
844×390 (free-for-all, dark), 1180×820 (teams, light), and 1440×900 (duel, dark)
confirmed 2×2 alignment and cleared decorations without a retained input lock.
The browser fixtures reported no page errors. This is browser verification, not
physical-device or native lifecycle certification.

Opening-card landing visibility uses an explicit `DealFlight.landed` channel,
set at the same timeline position as the DOM reveal. It must not be inferred from
`progress === 1`: GSAP rounds the cubic eased value to 1 before the 0.72-second
flight ends, which previously hid the rendered card for a frame while its DOM
replacement was still hidden. The deal playback regression test samples that
rounding interval, the exact landing boundary and cancellation rollback.

## Clean-table playground prototype (#136)

The public `CleanTablePreview` is available under Animation playground → Table →
Clean table. `application/cleanTablePreview` constructs deterministic, complete
40-card positions and calls `playMatchCard`; it never computes capture plans,
bonus amounts, exclusions or winners. Examples cover single capture, cascade,
Fall plus clear, excluded last-round clear, a capture leaving cards behind, and
a match-winning clear, in all formats and from every seat.

Supporting UI lives in `ui/components/previews/cleanTable`: controls, stage,
celebration markup and its GSAP timeline. `CleanTableStage` mounts the existing
`MatchMotionLayer` after its board ref is attached, preserving the live measured
capture, card artwork and audio. Once capture finishes it displays the resolved
empty table, holds score presentation with a motion frame, and runs a gold sweep across the full board width followed by the existing PointsBadge with “Clean table!” and recipient.
The proposed celebration lasts one second. The existing `MatchPointsLayer` then
owns flight and scoreboard arrival. Compound clear/Fall events remain separate
and ordered; the preview does not invent another score-flight system.

Settings changes, reset, replay and leaving the study unmount the scene and
revert its GSAP context. The reduce-motion control combines with the persisted
motion preference, settling source celebration immediately and retaining the
standard recipient/score announcement. Last-round and non-clearing cases skip
bonus decoration. This choreography is playground-only pending visual approval;
the live game still uses its existing clean-table points feedback.

Verification: `cleanTablePreview.test.ts` checks full-deck accounting, real capture
kinds, award ownership, exclusions, simultaneous Fall points and winner resolution
for every format/seat. `cleanTablePlayback.test.ts` checks reveal sequencing,
one-second handoff, exclusions, reduced motion and interruption rollback.
`CleanTablePreview.test.tsx` checks board readiness, Strict Mode, capture → reward
→ single points handoff, reset cancellation and immediate reduced-motion feedback.
The playground test checks catalog placement and study disposal. Browser review
on the existing port 3000 covered a single capture at 1440×900, team Fall + clear
at 844×390 in dark theme, free-for-all cascade at 568×320, excluded last-round
clear at 1180×820 in dark theme, and a winning clear at 1440×900. No page errors
were reported; every completed preview removed its celebration decoration.
