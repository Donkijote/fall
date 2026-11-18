# Home: Card Hall

The lobby implements the [Card Hall design](../../../docs/design/home-lobby/README.md)
using live controls and responsive artwork. [Settings](../../../docs/design/settings/README.md)
uses the same backdrop.

## Ownership

- `HomeLobby.tsx`: local-player onboarding and Settings/Play dialog state.
- `CardHall.tsx`: activity selection, keyboard traversal, responsive Tailwind layout and decorative background.
- `cardHallArtwork.ts`: the three activity records and cropped runtime illustrations.
- `HomeUtilities.tsx`: Home-only Messages, Help, Settings, and Log out controls with the anchored guide panel.
- `HomeSettings.tsx`: persisted appearance, audio and motion controls, reset, the Credits entry point, and development tools. The [Credits module](../credits/README.md) owns the screen and attribution inventory. `/?settings=true` opens preferences on return and restores focus to the credits link.
- `src/components`: reusable themed components and component styles.
- `src/components/ui`: upstream shadcn primitives; no edits for this implementation.

See `src/components/README.md` for the styled/core component boundary.

## Behaviour

Tavern opens the [Tavern picker](../tavern/README.md), passing the activated card as the animation origin. A mouse click or
keyboard activation opens it directly. On touch, one tap focuses the card and a
second tap on the same card opens it. The format cards are interactive previews during this design iteration.

Campaign and Arena remain greyscale Coming soon previews. Hero, Collection,
Journal, Guild and Market are also unavailable. Help sits next to Settings and links to How to play and Sings reference. The
disabled Messages shortcut sits in its own group to their left.

Keyboard arrows, Home and End move focus between cards. Modal dismissal returns
focus to its trigger. Portrait uses a native horizontal activity list with a
hidden scrollbar. GSAP animates the active card's rim, artwork and embers while
respecting the system reduced-motion preference.

The hall uses separate phone, tablet and landscape paintings selected by viewport
aspect ratio. Each fills the lobby, with a small margin for pointer parallax. Shared semantic tokens in `src/index.css` adapt the interface to
light and dark appearance. Card artwork failures fall back to a readable title
over a themed surface.

## Validation

Run `pnpm check`, `pnpm exec vp test run`, `pnpm run build` and `git diff --check`.
Use the existing development app for layout review; do not start a second server.
Check all activity states, native portrait scrolling, visible activity cards and footer,
keyboard navigation, image failures, onboarding and the existing three game formats.

The global theme preserves the proportional shadcn radius scale. Reusable app
components choose `rounded-md` (8px) for their common control and surface shape.
Other radius tokens remain available for distinct roles. Shared styled components
own brass frames and action presentation. Feature code supplies layout.
Native focus, dismissal, refs, keyboard, and touch behavior come from the primitives.

Settings uses the simplified reference composition with shared game actions and shadcn value controls.
Its body scrolls without a visible scrollbar while the title and actions stay
reachable. The `fall-preferences` record owns card volume, mute, and motion.
Appearance continues to use the existing `fall-theme` key.

Log out opens `/login` from the right-hand utility dock. It currently serves
as a navigation placeholder for future logout behavior.

The module entry point also exports `homeGallery` for the development-only
Component gallery. Preview fixtures live under `ui/components/previews` and
render this module’s styled components with sample props.

## HUD and Help artwork

Resources reuse `ResourceReadout`'s outline artwork in both Hall and gallery.
Compact portrait counters stack their contents; desktop and short-landscape
counters use horizontal content. Help rows use the shared `GuideLink` bookmark
and a BronzeArrow, keeping native link activation and the existing popover focus
and dismissal behavior.

GHI #124 unifies header and footer spacing through `--hall-gutter` on CardHall;
children add their respective safe-area inset. The responsive values and the
interaction review live in the owning design README. Shared motion owners and
verification boundaries are inventoried in `src/components/README.md`.

`PlayerIdentity` now composes the shared `ProfileButton`; resources are native
`ResourceReadout` actions. Their optional callbacks are ready for future profile
and resource features. No new screen, navigation or balance mutation is wired
by this presentation pass. Shared component notes own hover/focus behavior,
reduced-motion rules, the global cursor/selection policy and implemented
state-change animations. `CardHall.test.tsx` asserts the updated accessible resource action names.
