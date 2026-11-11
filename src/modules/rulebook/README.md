# Rulebook

Public entry: `index.ts` exports `RulebookScreen`. The thin infrastructure screen
at `src/infrastructure/ui/screens/Rules.tsx` connects it to `/rules`.

## Architecture and ownership

This module follows hexagonal dependency direction without duplicating the
existing game domain. `src/domain/constants/rules.ts` and its domain types remain
the authoritative first-release rules. Gameplay corrections stay in issue #109.

- `application/rulebookContent.ts`: pure projection of those domain rules into
  seven chapters, local search entries, introductory steps and the card example.
  It imports no React, router, browser or infrastructure APIs. Existing rule
  items are retained by reference, so editorial improvements are made in the source rather than copied into a competing catalog.
- `application/rulebookExamples.ts`: capture and scoring fixtures and the
  projection of existing Sings example hands. Tests check the illustrated
  outcomes against domain behavior.
- `adapters/rulebookRoutes.ts`: encodes chapter/rule URLs.
- `adapters/useRulebookRoute.ts`: React Router/browser integration, heading focus,
  history entry positions and the Sings return context. Browser state stays out
  of application content. No external data service is needed, so there is no
  artificial repository or persistence port.
- `adapters/useArticleMotion.ts`: GSAP integration and the existing system/player
  reduced-motion preference, scoped and cleaned up per chapter.
- `ui/RulebookScreen.tsx`: exported composition root; assembles the model, router
  adapter and supporting UI. Only this screen and its integration test live at
  the UI root.
- `ui/components/layout`: archive background source selection, page header and
  framed article, delegating motion to the adapter.
- `ui/components/navigation`: desktop chapter rail, mobile disclosure, chapter
  footer and link presentation.
- `ui/components/chapters`: quick start, source rule sections, Sings summary,
  scoring reference and glossary.
- `ui/components/search`: search results and their chapter/rule links.
- `src/components/cards/CardPlayFigure.tsx` and `SuitGlyph.tsx`: shared read-only
  card presentation and existing Spanish-deck artwork. They do not depend on
  this module or infrastructure screens.

Keep this organization when extending the guide: domain/application dependencies
point inward, browser effects belong to adapters, and UI support components are
grouped by responsibility. Avoid new feature logic in infrastructure screens,
large all-purpose screen files, flat helper piles or unused architecture layers.
The same convention is recorded in the root README and AGENTS.md.

## Behavior

The subtitle-free archive page uses the approved simplified composition, shared
brass surfaces, semantic themes and actual deck art. Chapter URLs use
`/rules?chapter=<id>`; search results add `rule=<item-id>`. Unknown chapters fall
back to Quick start. Search indexes the written rules, callouts, examples,
combination values and glossary without a remote service.

The desktop rail becomes a native Chapters disclosure on compact widths. The
page scrolls as one document with a hidden scrollbar; every breakpoint adds the horizontal safe-area insets to its gutter, while the archive remains full bleed. Diagrams reflow into labeled card groups. Header,
navigation and Back to Hall stay outside the article frame. Previous/Next follows
the learning order without completion gates. Reduced motion skips the article
fade, with immediate native focus and hover cues.

The standalone [Sings reference](../sings-reference/README.md) has its own searchable gallery. The guide passes an explicit
return destination and position key; its Back action restores the guide chapter
and reading position. Direct guide/reference visits always have a Hall fallback.
The in-match Sings modal and gameplay state are unchanged.

Runtime paintings and provenance are documented in `src/assets/rulebook/README.md`.
See the [approved designs](../../../docs/design/how-to-play/README.md) and
[content audit](content-plan.md) for the visual and teaching references.

## Verification

`application/rulebookContent.test.ts` checks source-rule retention and search.
`ui/RulebookScreen.test.tsx` exercises the composed feature: quick start, source
rules, chapter URLs, deep links/focus, search/empty state, mobile disclosure,
Sings round trips and reading-position restoration. Router and existing Sings
tests cover the route boundary and reference filters. Run `pnpm check`,
`pnpm exec vitest run`, `pnpm build` and `git diff --check`.

Use the existing port 3000 app for visual checks across light/dark, narrow phone,
tablet, short landscape, desktop and ultrawide. Do not start another server.
