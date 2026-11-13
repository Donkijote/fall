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
  frames immediately with a sound cue. Leaving the table cancels pending
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
