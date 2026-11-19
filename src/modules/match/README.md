# Local Tavern match

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
or keyboard gestures. Master mute/volume, per-layer gains and wind looping are
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
`useMotionAudio.test.tsx` covers first-layout readiness, gesture unlock, leave,
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
retargeting at phone portrait, landscape and desktop dimensions. Manual visual
review on real layouts and assistive-technology announcement review remain pending.

`index.ts` also exports `ScoreAwardsPreview` for the animation playground's Points
tab. Both development surfaces share this fixture and the live match's points
layer/tally implementation. Reset scene remounts only the preview table, disposing
pending flights and clearing scores while retaining the chosen format.
