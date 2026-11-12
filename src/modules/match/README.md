# Local Tavern match

`index.ts` exports `MatchScreen` at `/game/:matchId`. The local table uses
`tavern-7f3a` and reads the selected format from the `mode` query. Opening
the URL directly or refreshing starts a fresh session. Cancel, Close table,
Back to Tavern, and Escape return to the format picker.

- `application/localMatch.ts` composes the shared, framework-independent
  dealer selection, deal, Sing, play, capture, and counting rules. It returns
  board frames and motion events. Seats draw for the first dealer
  automatically; the local dealer can choose the opening deal order and
  table pattern. Sings are evaluated automatically at each deal.
- `ui/components/flow` owns the simulated arrivals, turn timers, and the
  handoff from the board to the 3D scene. It measures the current card, deck,
  and pile positions. For a play or capture, the hand and table stay in place
  until the first 3D frame takes over. Motion frames lock input until the
  scene finishes. If playback fails to start or stops responding, the queued move
  settles so the next turn can proceed. Reduced motion and unavailable
  WebGL settle frames immediately with a sound cue. Leaving the table
  cancels pending timers, motion, and audio.
- `ui/components/board` renders seats, cards, scores, dealer controls and the
  match result. Table cards keep their assigned grid slots. A play reserves a
  free slot until the card lands; a capture flies directly to its targets.
  `adapters/three` renders the animated cards and decorative
  hearth ash. The Playground and match use the same R3F card mesh,
  GSAP timelines, 3D poses, counting playback, and Howler card sounds.
  The match supplies actual card faces and measured board positions. A
  single capture, cascade, or Fall is one sequence from hand to pile.

`localMatch.test.ts` plays each format through to a winner, checking full
deck accounting during motion and rules resolution. Home navigation tests
cover entering the table and returning focus on cancel. The
[table design notes](../../../docs/design/tavern-match/README.md) describe
the composition and responsive checks.

There is no server state: guests are local bots, and leaving the table
discards the match.
