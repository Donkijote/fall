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
- `domain/software-notices.json` is generated from the actual production build,
  including lazy JavaScript chunks, and bound to the lockfile by SHA-256.
  `vite.config.ts` enables Vite's bundled-code license report. Its exact package
  names and versions determine JavaScript membership; installed package metadata
  supplies the retained license/NOTICE files, not the inclusion criterion.
  The inventory also records each entry's `includedBy` evidence.
- `scripts/credits-notices.mjs` runs the real production build in memory when
  generating or independently checking notices. It never starts a dev server
  or overwrites `dist` during this audit. CSS is processed outside the JS report:
  the reviewed imports from Tailwind, shadcn and tw-animate-css are explicitly
  retained with their source path, import specifier and installed version.
  Fonts, artwork, sounds, copied public files and any future remotely loaded
  assets still need the asset inventory; JS bundle metadata does not cover them.
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
3. After changing dependencies, imports, routes or production build conditions,
   install from the lockfile if needed and run `pnpm credits:notices`. Review the generated diff, the package's full terms,
   and any `upstream-review-pending` entries. The generator retains distinct
   packaged LICENSE/LICENCE/COPYING/NOTICE texts across installed versions.
   Metadata license labels and SPDX links alone do not close a notice review.
   If another package contributes distributed CSS, add a reviewed entry to
   `distributedCss` with the actual import and source. The generator verifies
   that the recorded import remains present. For other asset types, add their
   attribution to the asset inventory; do not pull in a tool's whole dependency
   tree merely because it generated a file.
4. Run `pnpm credits:notices:check`, the inventory tests, and the affected UI
   tests. Inventory coverage fails when a new runtime asset has no owner.
   `pnpm build` checks the committed notices against the report from that exact
   build and fails on drift; it never silently rewrites the inventory. Standalone
   `pnpm credits:notices:check` makes a fresh in-memory build, so it also detects
   shipped membership changes with an unchanged lockfile. The internal
   `--from-build` flag is for the build chain immediately after `vp build`;
   do not use an old `dist` report to certify new source changes.

## Audit follow-ups

Every file under `src/assets` and public image exports has an inventory owner.
Coverage is not proof of permission. The user's 2026-11-17 clarifications are
recorded in each affected entry; provenance and license review are separate.

- **Spanish deck:** the user redrew SVGs in Adobe Illustrator from a Shutterstock
  reference. Permission records have not been established. Record the reference
  as third-party input and permission as pending. Do not label this deck original,
  public domain, generated, or MIT. The exact listing/artist is still unknown.
  An independently generated set of faces and back is planned, not implemented.
  Replacement work is tracked in [issue #132](https://github.com/Donkijote/fall/issues/132).
  An attribution line or a future replacement does not establish authorization
  for the existing adapted artwork.
- **Card sounds:** the user supplied both individual Pixabay pages on
  2026-11-18. `deal-card.mp3` is recorded against [Taking playing card - 2,
  item 522516](https://pixabay.com/sound-effects/film-special-effects-taking-playing-card-2-522516/)
  and `play-card.mp3` against [Taking playing card 3, item 522513](https://pixabay.com/es/sound-effects/pel%C3%ADculas-y-efectos-especiales-taking-playing-card-3-522513/),
  following their deal/play order. Both official pages identify **OxidVideos**
  and the Pixabay Content License. Their sources are now recorded individually;
  the original download dates and any edits remain undocumented. The user
  clarified that the ember mock audio was self-generated, not from Pixabay;
  it and the playground's one-off sound lesson were removed at their request.
- **Login castle:** generated in Google Stitch and taken from its mockup,
  confirmed by the user. The former "supplied" record now has a known generated
  origin. Record provider terms and any generation/export evidence when available.
- **Other artwork, favicon/app icons, foreground mask and ember SVG:** the user
  confirmed generated provenance. Preserve existing prompt manifests; link the
  generated master/export records where available. Do not infer a third-party
  license grant or a guarantee of non-infringement from generated provenance.

Existing asset-side READMEs are retained as evidence, not another screen data
source. The [design review notes](../../../docs/design/credits-licenses/README.md#licensing-research)
record the official licensing references and limitations of the research.

Three shipped entries have no packaged root license/notice file:
`@gsap/react`, `@react-three/fiber`, and `gsap`. Their source/available license
links are shown and verification remains pending. GSAP's custom terms are
preserved; it is not relabeled MIT. Review missing notices and package-specific
attribution duties before treating issue #105's legal audit as complete.

The current build yields 30 JavaScript packages plus 3 reviewed CSS imports.
The previously listed optional `camera-controls`, `buffer`, `base64-js`, and
`bidi-js` packages do not contribute to this production build and are excluded.
`class-variance-authority`, `clsx`, and `@babel/runtime` remain because the build
includes them. Membership is recalculated, not maintained as a package blacklist.

## Verification

Tests cover inventory asset ownership, retained authors/notices, build/asset
membership evidence, shipped-version filtering, missing metadata failures, stale
notice rejection with an unchanged lockfile, accessible sections, content scroll
ownership, public routing, and Settings navigation/focus restoration. Build-tool
unit tests live beside `scripts/credits-notices.mjs` and use the Node environment;
feature tests remain colocated inside the module. Full repository tests, `pnpm check`,
`pnpm credits:notices:check` and `pnpm build` are the completion checks.

Manual desktop/mobile, light/dark, safe-area and short-viewport visual checks
remain pending: computer use reported a locked Mac and no browser, and the user
confirmed they are away. No second server was started; use the existing app on
port 3000 for that review.

Automated verification on 2026-11-18: all 315 repository tests passed; formatting,
lint, notice freshness and production build passed. The build retains its bundle
size advisory; complete license text is lazy-loaded with the Credits route.
