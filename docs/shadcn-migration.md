# shadcn/ui migration

Tracking issue: [#89](https://github.com/Donkijote/fall/issues/89).

## Design system

The UI uses the installed `base-luma` shadcn preset, backed by Base UI, with the stone neutral
palette. Spline Sans is the body font and Cinzel is the heading font. The primary brand red and
its coordinated light/dark sidebar and focus-ring variations live in `src/index.css`.

The app-wide `next-themes` provider applies the `light`/`dark` class on the document and
initially follows the system preference. The bottom navigation's theme button overrides that
preference and persists it under `fall-theme`. Theme changes apply to every route and portal.

Use the existing semantic tokens for surfaces, text, actions, borders, inputs,
and focus rings. Keep light and dark values in OKLCH in `src/index.css` and use
aliases when two semantic roles intentionally share a value. Generic control
borders and inputs use the neutral shadcn treatment. Gold is reserved for
intentional trim and selection cues shared by illustrated screens. Use a
Tailwind palette utility for a one-off decorative tint. Add a new global token
only when multiple features need the same distinct role. Dialog and sheet
backdrops dim the page, and their contents use opaque theme surfaces.

## Components and ownership

Generated, locally owned primitives live in `src/components/ui/`. Feature-specific compositions
remain in the existing infrastructure and module directories. Import primitives with
`@/components/ui/<name>`; use `cn` from the installed `cn` package when merging Tailwind classes,
as the current shadcn generator does.

The root TypeScript configuration declares the same `@/*` path mapping used by the application
and Vite, so the shadcn CLI resolves generated components into `src/`.

Add a primitive using the existing configuration:

```sh
pnpm exec shadcn add <component>
```

Do not reinitialize the preset or replace `src/index.css` when adding components. Customize
component variants in their local source and shared colors/fonts in the global theme.

The registry menu color is `default` (opaque), so future generated menus do not reintroduce
the old translucent styling. Google Fonts supplies the font-face declarations; do not import
binary WOFF2 files as stylesheets.

## Migration inventory

| Existing component or area                               | Replacement or retained composition                                                        |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `IconButton`                                             | Removed; use shadcn Button with an icon size and an accessible label                       |
| `WelcomeModal`                                           | Dialog, Input, Label, and Button; registration remains required and Enter submits          |
| `SingsModal`                                             | Scrollable Dialog with managed focus, Escape, backdrop, and close button                   |
| `BottomNavbar`                                           | Opaque semantic sidebar surface composed from Button variants                              |
| `BottomSidebar`                                          | Full-screen bottom Sheet with image-backed Button panels for game modes                    |
| `HomeScreen`                                             | Semantic background, heading typography, and Badge; no gold glow or glass background       |
| `SingsSheetScreen`                                       | Card filter panel with Input, Select, Checkbox, and Label                                  |
| `SingsList`                                              | Card, Badge, and retained playing-card previews                                            |
| `RulesScreen`                                            | Tabs, Button navigation, Badge, and semantic page surface                                  |
| `SectionAccordion`                                       | Multi-open Accordion; rules start expanded and reset when items change                     |
| `Callout`                                                | Alert with informational/tip/warning icons and semantic warning treatment                  |
| `Pill`                                                   | Removed; use Badge directly                                                                |
| `HintModal`                                              | Dialog with Card hints; dismissal still persists the seen flag                             |
| `QuickRef`                                               | Card with Separator and semantic text                                                      |
| `SingsGrid`                                              | Card and Badge compositions                                                                |
| `GameScreen`                                             | Button for the combinations action; gameplay orchestration unchanged                       |
| `DealerChoiceControls`                                   | Card and Button variants with pressed and disabled states                                  |
| `PlayerChip`                                             | Opaque Card, Avatar, dealer marker, and score/team Badges                                  |
| `GameOverModal`                                          | Dialog, Button, and score Card; existing replay/new-game/exit handlers retained            |
| `StatPill`                                               | Score Card composition                                                                     |
| `ConfettiController`                                     | Retained animation using semantic theme colors instead of legacy gold accents              |
| `Card`, `CardList`, `SuitGlyph`, `ClubGlyph`             | Retained specialized playing-card rendering and deck assets; selection uses the theme ring |
| `Players`, `HandCard`, `CollectedCard`                   | Retained game layout, card actions, and motion                                             |
| `Table`, `TableCards`, `TableBackground`, table variants | Retained game-specific rendering, layout, and table assets                                 |

The legacy theme tokens, standalone icon button and pill implementations, Font Awesome dependencies,
and unused template font packages are removed. Icons now use the preset's Lucide library.

## Validation and remaining review

Automated checks cover registration submission and persistence, dialog dismissal, focus restoration,
mode selection, dealer choices, combination filtering, rules tabs/accordion behavior, and match-end
rendering, alongside the existing gameplay suite.

```sh
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm test:coverage
```

Before marking the draft PR ready for review, manually inspect narrow and landscape layouts,
light/dark appearance, keyboard focus, card interactions, and animations. Automated DOM tests and
the production build do not replace that visual/gameplay review.

## Post-commit migration audit

All existing general-purpose interface controls use shadcn primitives or feature-specific
compositions of them. No legacy glass/gold interface tokens, custom modal/tab/accordion
implementations, native selects, or Font Awesome imports remain.

The only native button outside the shared primitives is the specialized playing card. Its
paper face, deck artwork, card-back pattern, table surfaces, and motion remain deliberately
custom, as recorded above; these are gameplay presentation rather than missing migrations.

The navbar theme toggle is covered for preference persistence, restoration, and system changes.
Visual and hands-on gameplay review remain a release-readiness step, not an outstanding
component replacement.
