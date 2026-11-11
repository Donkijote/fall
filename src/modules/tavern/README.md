# Tavern format picker

`index.ts` exports `TavernPicker`. Home provides the active player and the
activated Tavern button. The legacy bottom navigation can open the same picker
without a zoom origin. The existing `bottomSidebar` query opens the picker
after local onboarding.

`TavernPicker` composes a full-viewport Base UI dialog. Mode cards are
focusable previews with pointer feedback. Activating them leaves the picker open. `TavernFormatCard` renders the illustration and live
ribbon text. `useTavernCardMotion` owns card lift, artwork zoom and the idle
reflection. `TavernRoom` animates local candle and hearth light.
`useTavernMotion` owns the entry and exit sequence. Back
and Escape reverse the animation, close the dialog, and restore focus.
The system or in-app reduced-motion preference skips the timeline.

See the [design references](../../../docs/design/tavern/README.md) for
composition, artwork, and viewport exports. Verify the three previews leave the picker open, deep-link
onboarding, keyboard activation, dismissal, and return focus in
`HomeLobby.test.tsx` and `BottomNavbar.test.tsx`. Check desktop, portrait,
and short landscape in the running app on port 3000.
