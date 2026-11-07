# Home HUD and Living Town scene

Issue #80 implements the Living Town **HUD**, not the illustrated town (#99).
The accepted direction uses the existing Cinzel/Spline typography, Lucide icons,
shared Button/Dialog primitives, and semantic theme tokens, with local bronze
frames and ember accents. No generated artwork is required for the HUD.

Issue #99 now uses layered illustrated artwork in `LivingTownScene`, replacing the
earlier procedural mountain/tavern studies. A plum sky, hazed mountain ridges,
flagstone plaza and timber-and-stone tavern share the HUD's restrained charcoal,
oxblood and bronze direction. Optimized WebP images remain visible independently
of the optional, lazy React Three Fiber mist. Motion/data preferences, hidden-tab
pause and renderer failures affect only that enhancement. The HUD layout, theme
and game-mode behavior are unchanged. The central arrival panel is removed; the
inward-facing tavern now opens the existing mode picker with a slow hover/focus
glow, restrained embers, permanent bronze-framed nameplate and keyboard/touch
activation. Tavern and the single unrepeated paving image share a contained world
scale instead of oversized mobile/cover zoom. A smaller Merchant beside the tavern
and a Quests noticeboard on the right share the same world, grading and permanent
nameplates. These two destinations are disabled and announced as coming soon;
they add no game/shop/quest behavior. The future castle is not implemented. See
`docs/design/home-lobby/living-town.md` for the incremental scope, layer manifest
and remaining art/visual review requirements.

## Current behavior

- `HomeLobby` is the controller behind the existing `HomeScreen` route export.
  It reads the local user, updates identity after onboarding, and owns the Play
  and Settings panels. A mode-picker deep link waits until onboarding completes.
- `HomeHud` is presentation-only: overlapping portrait and name/level/XP plaque
  upper-left; energy, coins, diamonds, Mail, and Settings upper-right. Collection,
  Character, Inventory, Ranks, and Quests sit on a spacious bottom-anchored dock with
  overlapping nameplates. Locks indicate unavailable systems without redundant
  visible Soon labels. Mail and lower-left Chat are disabled placeholders.
- Optional player level and experience props support future progression data.
  Unknown levels show an em dash and unknown experience leaves an empty track,
  not a fabricated level, progress value, or loading indicator.
- `HudResource` accepts optional values and renders unknown balances as em
  dashes. `HomeLobby` intentionally supplies no balances or progression. Supplied
  test/example values exercise presentation, not an economy. There are no grant,
  spend, recharge, purchase, timer, or persistence actions.
- Settings contains the working theme toggle, Rules and Sings links, and the
  development-only animation playground link. No speculative settings are added.
- The center remains open for future town landmarks. The tavern is the single
  Caída entry, disabled until onboarding completes. Its permanent The Tavern plaque
  remains if art fails and opens the unchanged picker; it does not start a match directly.

## Scene/HUD integration contract for #99

`HomeHud` accepts `scene` and `children` slots. The scene is an absolute layer
at z-index 0; the HUD is a separate grid at z-index 10. Dialogs/sheets retain
the shared primitives’ portal layering above both.

- Put full-bleed town layers and destination controls in `scene`. The layer has
  `pointer-events: none`; set `pointer-events: auto` on actual scene controls,
  not on an invisible full-screen overlay. The scene slot is not aria-hidden:
  only its decorative art should be hidden from assistive technology.
- The HUD also defaults to pointer passthrough. Its player/resource regions and
  Settings control opt in. The top row and bottom shortcut cluster reserve their
  own layout space; do not put town destinations beneath those occupied regions.
- `children` occupies the middle row (`data-slot="home-scene-space"`), currently
  empty now that the town owns the game entry. Do not add a competing central
  Play action or move artwork through HUD rows.
- The stage uses dynamic viewport sizing and safe-area padding. Landscape is
  the primary composition; compact landscapes reduce the center decoration.
  Portrait reflows rather than forcing orientation or blocking navigation.
  An orientation lock is a future decision, not implemented here.
- Theme appearance is inherited. Do not force `.dark` on the HUD or bypass the
  shared accessibility/focus behavior when adding new controls.

## Validation

Focused tests cover resource values/unknown states, unavailable shortcuts,
avatar fallback, scene composition, onboarding, deep links, all current match
formats, Settings navigation, theme switching, and keyboard focus restoration.

Run `pnpm exec vp test run src/modules/home` or the complete suite, `pnpm check`,
and `pnpm run build` before shipping changes.
