# Credits

`index.ts` exports `CreditsScreen`, lazy-loaded at `/credits`. Settings links to
it; its fixed return action opens Settings and restores focus to the credits
link. Direct entry is public and requires no player session.

## Responsibilities and boundaries

- `domain/inventory.ts` is the authoritative attribution inventory. It combines
  project, asset, icon, font and generated software entries. It is independent
  of React, browser APIs and routing. `attribution.ts` defines the asset record.
- `domain/notices` retains the official font copyright/license text. The project
  notice is imported from the root LICENSE without maintaining a duplicate.
- `domain/software-notices.json` is generated from the installed production
  dependency graph and bound to the lockfile by SHA-256. It conservatively
  includes transitive packages. Shadcn is a development CLI, but its own notice
  is explicitly retained because `src/index.css` imports its distributed CSS;
  the CLI's tooling-only dependencies are excluded.
  Leva and the animation playground's `r3f-perf` monitor are development
  dependencies, so their tooling-only trees (including Radix) are excluded too.
- `ui/CreditsScreen.tsx` composes the inventory, sections and routing integration.
  Supporting content and scenery live under `ui/components`. There is no
  application service or port because this static inventory needs neither.
- The viewport and Hall are stationary. One focusable `Credits content` region
  owns scrolling. The return action is outside it. No tabs, nested scrollers,
  accordions or section menus are used. Native scrolling supports reduced
  motion; shared components retain their existing GSAP behavior.

The screen reuses ActionButton, BronzeArrow, Icon and the existing responsive
Card Hall assets. No generated primitives, global palette or radius tokens were
modified. Typography follows Cinzel Regular titles and Spline Sans reading text.
The [approved design](../../../docs/design/credits-licenses/README.md) records
the fixed-viewport correction and links the canonical background.

## Adding an asset or dependency

1. Add or extend an entry in `domain/inventory.ts`. Supply a stable ID, asset or
   group name, creator, source URL, license and license URL, required notice,
   modifications, provenance kind and evidence. `files` contains repo-relative
   glob patterns for the covered exports. Do not treat generated provenance as
   a third-party license or assume the code's MIT license covers supplied art.
2. Preserve any required full license/copyright text under `domain/notices`
   and import it into the entry. Keep the source URL and retrieval evidence.
   The screen renders entries directly; never add another independent UI list.
3. For a dependency update, install from the lockfile and run
   `pnpm credits:notices`. Review the generated diff, the package's full terms,
   and any `upstream-review-pending` entries. The generator retains distinct
   packaged LICENSE/LICENCE/COPYING/NOTICE texts across installed versions.
   Metadata license labels and SPDX links alone do not close a notice review.
   If another development package contributes distributed CSS or other assets,
   include its own package in the generator's explicit asset list rather than
   including its entire tooling graph.
4. Run `pnpm credits:notices:check`, the inventory tests, and the affected UI
   tests. Inventory coverage fails when a new runtime asset has no owner.

## Audit follow-ups

Every file under `src/assets` and public image exports has an inventory owner.
Coverage is not proof of permission. Entries explicitly marked `unresolved`
still need source/creator/license confirmation: the Spanish deck, card and
ember sounds, supplied login painting, earlier format paintings, foreground
mask/ember geometry, and public app-icon provenance. The user will check the
deck and sound sources later. Existing generated-art manifests include supplied
references; review their inputs before asserting ownership or redistribution
terms. Existing asset-side READMEs are retained as evidence, not another screen
data source.

Eight production graph entries have no packaged root license/notice file:
`@gsap/react`, `@mediapipe/tasks-vision`, `@react-three/fiber`,
`@react-three/rapier`, `draco3d`, `gsap`,
`maath`, and `stats-gl`. Their source/available license links are shown and
verification remains pending. GSAP's custom terms are preserved; it is not
relabeled MIT. Review missing notices and package-specific attribution duties
before treating issue #105's legal audit as complete.

## Verification

Tests cover inventory asset ownership, retained author/notices, lockfile
freshness, ordered accessible sections, content scroll ownership, public routing,
and Settings navigation/focus restoration. Full repository tests, `pnpm check`,
`pnpm credits:notices:check` and `pnpm build` are the completion checks.

Manual desktop/mobile, light/dark, safe-area and short-viewport visual checks
remain pending: computer use reported a locked Mac and no browser, and the user
confirmed they are away. No second server was started; use the existing app on
port 3000 for that review.

Automated verification on 2026-11-17: all 310 repository tests passed; formatting,
lint, notice freshness and production build passed. The build retains its bundle
size advisory; complete license text is lazy-loaded with the Credits route.
