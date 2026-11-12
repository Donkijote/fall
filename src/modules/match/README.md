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
- `ui/components/flow` owns the simulated arrivals, turn timers, and GSAP
  timeline lifecycle. Motion frames lock input and keep the board in sync with
  animations. Reduced motion settles each frame immediately. Leaving the
  table cancels pending timers and motion.
- `ui/components/board` renders seats, cards, scores, dealer controls and the
  match result. The Playground and board share card flight timings, capture
  gestures and counting cadence under `src/components/cards/motion`.
  `adapters/three` renders the decorative hearth ash.

`localMatch.test.ts` plays each format through to a winner, checking full
deck accounting during motion and rules resolution. Home navigation tests
cover entering the table and returning focus on cancel. The
[table design notes](../../../docs/design/tavern-match/README.md) describe
the composition and responsive checks.

There is no server state: guests are local bots, and leaving the table
discards the match.
