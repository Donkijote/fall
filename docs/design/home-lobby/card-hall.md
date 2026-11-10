# Card Hall implementation

The revised `../main-menu-research/image-concepts/card-hall.png` is the accepted
composition. This replaces the former world-as-menu implementation, not the user's
source artwork. Manually deleted historical studies are not restored.

## Working state, not illustrative progress

The three positions remain Tavern / Campaign / Arena. Hover and keyboard focus
highlight a card. On touch, the first tap highlights the card and a second tap
on the same card opens it if playable.

- Tavern opens the existing Caída picker on click, Enter, Space or the
  confirming tap. It preserves 1vs1, three-player free-for-all (internal ID 1vs2),
  2vs2, bot defaults and `/game` routing.
- Campaign and Arena remain Coming soon previews.
- Hero, Collection, Journal, Guild, Market and mail remain explicitly unavailable.
- The player HUD shows level and XP on the left and Energy, Coins and Diamonds on the right. Missing values use dashes and an empty XP track.
- Existing welcome/local-user onboarding, mode deep links, Settings, appearance,
  guide links, development tools and modal focus restoration are retained.

## Art and layout

Use the detailed adjacent `card-hall-background-detailed.png`, not the older interface baked
into `card-hall-background-2.png`. The three paintings and fallback portrait are
cropped from the revised master, excluding baked titles, buttons and chapter text.
Their exact source rectangles are in `src/assets/lobby/card-hall/README.md`.

Three full-bleed hall paintings cover narrow phone portrait, tablet and landscape
viewports. Each reframes the same room to keep its landmarks in view. The compact identity,
centred wordmark and resource readouts use live text. The activity row sits above
two compact icon groups. Player systems are on the left,
with Messages and Settings on the right.
Cards use a smaller 2:3 portrait silhouette with titles directly over their artwork,
without description panels or stacked bottom borders. Selection adds a soft golden
outer glow; coming-soon artwork stays greyscale even when selected, without disabling
preview interaction. All type uses the existing font families.

Motion takes inspiration from the supplied Gwent mode-hover clip, translated to
Fall's gold. GSAP varies drift, depth, tilt and timing independently on each card.
The active effects include a pulsing rim, drifting embers, a soft light sweep and
subtle pan and zoom of the still painting.
Hover, keyboard focus and touch preview show the active effects. Reduced motion
preserves static styling
but removes floating, art motion, shimmer and particles. No generated video or new
runtime assets are required.

Controls follow the light and dark semantic theme in `src/index.css`. Shared
artwork contrast tokens keep labels readable over illustrations in both appearances.

Landscape keeps all three cards visible with viewport-constrained sizing. Portrait
uses a native horizontal, scroll-snap activity list with a hidden scrollbar and
partially visible next card; it does not shrink the whole menu into tiny labels.
Arrow keys, Home and End move focus. A focused card is brought into view on the
scrolling list.

## Code ownership

- `src/components/ui/*`: shadcn/Base UI core, **unchanged**.
- `src/components/game/*`: reusable `GameButton`, `GameActivityCard`,
  `GamePlayerIdentity`, `GameNavigation`, `GameContextStrip`, `GameDialogContent`
  and their Tailwind styles. See that folder's README.
- `src/modules/home/ui/CardHall.tsx`: Home activity selection and responsive Tailwind layout.
- `src/modules/home/ui/cardHallArtwork.ts`: activity manifest and runtime artwork.
- `HomeLobby`: local user and dialog state; no duplicate game-setup service.

The superseded HomeHud/HudResource/LivingTown scene, their styles and obsolete
presentation tests are removed. Existing town assets and user-edited design notes
remain untouched. Reusable controls do not import Home state, assets or services.

## Validation

Component tests cover the styled/core boundary, controlled card state, native refs,
accessible labels, broken images, avatar fallbacks and optional real-level input.
Home tests cover future-state gating, keyboard activity navigation, every existing
format, onboarding/deep links, Settings, appearance, guides and focus restoration.

Visual validation uses the user's existing port 3000 app, not another server.
Check desktop, ultrawide, portrait and short landscape; selected-card separation,
readable labels, touch targets, visible cards and footer, image-failure and
reduced-motion behaviour. The extracted source paintings are modest resolution;
larger dedicated crops are a future art improvement, not a new layout dependency.

The initial implementation passed `pnpm check`, 293 tests across 54 files, production build
and `git diff --check`. Obsolete Living Town/HUD presentation tests were removed
with those components; the new shared component and Card Hall tests replace them.
Visual checks cover 1672×941, 1280×800, 852×393, 1040×480, 390×844, 320×568,
360×800, 1715×1233, 2560×1080, 768×1024, 568×320, 667×375 and 844×390.
Additional checks exercise light appearance with a long name, missing avatars/art,
reduced motion, portrait selection visibility, Settings and modal focus restoration.
Existing Three.js deprecation/bundle-size warnings from other application features
remain outside this change.
