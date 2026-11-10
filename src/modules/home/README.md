# Home: Card Hall

The Home/lobby now implements the revised Card Hall master in
`docs/design/main-menu-research/image-concepts/card-hall.png`. It replaces the
multi-building Living Town scene. Existing source art and manual design deletions
are preserved; the running menu uses a clean background and real UI controls,
not the flattened screenshot.

## Ownership

- `HomeLobby.tsx`: local-player onboarding and Settings/Play dialog state.
- `CardHall.tsx`: activity selection, keyboard traversal, responsive Tailwind layout and decorative background.
- `cardHallArtwork.ts`: the three activity records and cropped runtime illustrations.
- `HomeSettings.tsx`: existing theme, guide and development-tool actions.
- `src/components/game`: reusable themed components and component styles.
- `src/components/ui`: upstream shadcn primitives; no edits for this implementation.

See `src/components/game/README.md` for the styled/core component boundary and
`docs/design/home-lobby/card-hall.md` for design mapping and responsive behaviour.

## Behaviour

Tavern opens the existing `BottomSidebar` format picker. A mouse click or
keyboard activation opens it directly. On touch, one tap focuses the card and a
second tap on the same card opens it. The existing game IDs, bot defaults and
`/game` navigation are preserved.

Campaign and Arena remain greyscale Coming soon previews. Hero, Collection,
Journal, Guild, Market and mail are also unavailable.

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
