# shadcn/ui migration

Tracking issue: [#89](https://github.com/Donkijote/fall/issues/89).

## Goal

Make shadcn/ui the application's primary UI component library and align all screens with a
consistent shadcn template and theme. This document seeds the draft PR; implementation has not
started.

## Migration checklist

- [ ] Inventory all interface components, their consumers, and custom styles.
- [ ] Select and record the shadcn template/style baseline before migrating components.
- [ ] Configure shadcn/ui for React, TypeScript, Vite Plus, Tailwind CSS, and existing import aliases.
- [ ] Establish shared component locations, utilities, semantic theme tokens, and styling conventions.
- [ ] Replace custom interface primitives and migrate every consumer to the new design system.
- [ ] Apply the selected template's typography, colors, spacing, borders, radii, and interaction states.
- [ ] Adapt game-specific compositions while preserving card assets, interactions, and animations.
- [ ] Remove superseded primitives, legacy styles, unused dependencies, and obsolete configuration.
- [ ] Update tests and contributor documentation for the new components and theme.
- [ ] Verify responsive layouts, keyboard navigation, focus management, labels, and UI states.
- [ ] Run installation, formatting/lint checks, the production build, and test coverage.

## Initial inventory areas

| Area                 | Existing location                                                                        | Migration focus                                                     |
| -------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Shared controls      | `src/infrastructure/ui/components/buttons/`                                              | Button primitives and variants                                      |
| Dialogs              | `src/infrastructure/ui/components/modal/`                                                | Dialog structure and accessible interactions                        |
| Navigation           | `src/infrastructure/ui/components/navbar/`                                               | Navigation controls and layout                                      |
| Player interface     | `src/infrastructure/ui/components/player/`                                               | Controls, player metadata, and game-specific compositions           |
| Cards and animations | `src/infrastructure/ui/components/card/`, `src/infrastructure/ui/components/animations/` | Theme integration without replacing specialized rendering or motion |
| Screens              | `src/infrastructure/ui/screens/`                                                         | Home, game, sings, and rules styling                                |
| Rules primitives     | `src/infrastructure/ui/screens/rules/components/`                                        | Accordion, dialog, badges, and callouts                             |
| Feature modules      | `src/modules/matchEnd/`, `src/modules/table/`                                            | End-of-match interface and table styling                            |
| Global theme         | `src/index.css`                                                                          | Shared semantic tokens and removal of superseded styles             |

The inventory is a starting point, not a completed component audit. Record the replacement or
game-specific composition for every component during implementation. Use shadcn/ui primitives
where an equivalent exists; retain specialized gameplay presentation as compositions rather than
forcing it into unrelated generic controls.

## Boundaries

Preserve domain rules, application state, routing behavior, rendering/animation engines, and
existing gameplay flows. This migration does not revive the previously abandoned full-app rewrite.

## Validation

- `pnpm install --frozen-lockfile`
- `pnpm check`
- `pnpm build`
- `pnpm test:coverage`

Manually verify existing application flows, responsive layouts, accessibility, card interactions,
and animations before marking the PR ready for review.
