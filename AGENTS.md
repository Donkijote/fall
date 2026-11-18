# UI implementation rules

- Use Tailwind utilities for component styling and responsive layouts wherever possible.
- Start with the existing shadcn semantic colour tokens in `src/index.css`.
  Use their matching foregrounds, borders, inputs, and focus rings in both
  themes. Keep the shadcn token names and OKLCH values or semantic aliases.
  Use Tailwind palette utilities for one-off decorative colours. Add a global
  token only for a distinct, reusable role across features, such as the shared
  gold trim or artwork contrast. Give it a semantic name and define it in
  OKLCH. Avoid component palettes, raw hex UI colours, and duplicate tokens.
- Use Cinzel Regular (400), the Tavern title style, for page, dialog, card,
  and section titles. Semantic headings inherit it. Use `title-type` for
  other title elements and `artwork-title` over illustrations. Use
  `font-normal` when a generated title primitive supplies a heavier weight.
- Keep reusable styled components in `src/components`, outside the generated
  shadcn/Base UI primitives in `src/components/ui`. Do not customise generated core
  files to implement game-specific visuals.
- Preserve the proportional shadcn radius scale in `src/index.css`. Reusable
  styled components choose a named radius utility for their role. App controls
  and framed surfaces currently use `rounded-md` (8px). Other scale values remain
  available for future roles. Keep circles and pills for avatars, switches, and
  slider tracks. Joined controls square only their interior corners.
- Keep generated shadcn primitives unchanged. Organize reusable presentation
  under `src/components` by purpose: actions, controls, cards, navigation,
  surfaces, hud, and icons. Use descriptive names without a Game prefix.
  ActionButton owns app actions, NavigationButton/NavigationGroup own the docks,
  and FramedCard/ModalContent/PopoverPanel share the brass frame from
  `surfaces/surfaceStyles.ts`. Preserve native focus, dismissal, refs, keyboard,
  and touch behavior.
- Use the global primary token for action and value colors. Do not darken primary
  buttons locally or invent another frame, corner radius, or palette in a feature.
  Feature classes own layout and sizing. Update the shared token or styled component
  when a change should apply throughout the app.
- Use GSAP / `@gsap/react` for all DOM motion, Three.js or React Three Fiber for
  rendered scenes, and Three Quarks for 3D particle effects. This applies to
  simple fades and hover or focus motion as well as complex game sequences.
  Tailwind and CSS are for static styling, layout, and immediate state cues.
  Do not animate with CSS transitions, CSS keyframes, or Tailwind animation
  utilities. Disable inherited primitive transitions in features that adopt
  this guidance. Respect reduced motion, clean up animation contexts and
  listeners, and keep decorative effects out of the accessibility tree.
- Only add custom CSS when utilities cannot reasonably express the requirement.
  Name that stylesheet exactly after its owning component, e.g. `HomeLobby.css`
  for `HomeLobby.tsx`. Do not accumulate shared component styling in a generic CSS file.
- Name tests after the component or module under test, e.g. `HomeLobby.test.tsx`.
  Each test file owns one component or module; do not bundle unrelated component
  tests. Feature integration tests may exercise their composed dependencies.
- Runtime artwork belongs under `src/assets`. Files in `docs/design` are reference
  masters only; export optimised runtime assets rather than importing from docs.
- Generate each illustration used at runtime as a standalone image at the
  intended aspect ratio and resolution. Use simplified and detailed mockups
  as visual references. Do not crop embedded illustrations out of full mockups
  for production assets.
- The user already runs the app on port 3000. Reuse it; do not start another server.
- Preserve manual edits and deletions. Do not commit or push without a request.

# Git workflow

- When beginning implementation of an issue, move its existing item in the
  [Fall project](https://github.com/users/Donkijote/projects/5) to `In progress`
  with `node scripts/project-status.mjs start <issue-number>`. Do this before
  implementation, not only when opening the PR. Use a GitHub CLI login with
  project write access; report permission failures rather than silently skipping.
- Link fully resolved issues with closing keywords in the PR body. The trusted
  project-status workflow moves these issues to `In review` only after the
  current opted-in PR Preview passes its deep-link probe, and to `Done` when
  a merged PR actually closes the issue. References alone do not trigger moves.
  Keep closed issues out of earlier columns and preserve unrelated project items.

- Derive issue branches from the issue's `kind/*` label: `kind/feature` becomes
  `feature/ghi#105`, `kind/bugfix` becomes `bugfix/ghi#109`, and likewise for
  other kinds. Require exactly one type label; resolve missing or conflicting
  kinds before creating the branch. This issue-based pattern takes precedence
  over a generic branch prefix.
- Review acceptance-criteria and task checklists in the issue and PR bodies when
  starting work. As each item is implemented and its applicable verification
  passes, mark its checkbox complete in the corresponding issue and PR. Keep
  overlapping checklists consistent, preserve their wording and unrelated edits,
  and leave incomplete, partial or unverified items unchecked. Before handoff,
  reconcile both checklists and report any remaining items or verification gaps.
- Create draft PRs against `develop`, titled `[GHI#<issue>] <issue title>`.
  Assign the PR to its creator and copy the issue's labels, including the same
  `kind/*` type label. Preserve these fields when updating an existing PR.
- Include `Closes #<issue>` in the PR body for every issue fully resolved by
  the PR. `Refs #<issue>` alone does not close it. Use references for partial
  work that should leave an issue open.
- Confirm the target is the repository's default branch (currently `develop`)
  when automatic closure is intended; GitHub ignores closing keywords for
  other targets. Verify the assignee, labels and closing lines after creation
  or editing. Use `scripts/ghi-pr.sh` for the issue-to-draft workflow.

# Project licensing

- Fall is a proprietary, closed-source commercial game. Keep the root LICENSE,
  package metadata and the game notice consistent with that intent. Do not
  label project-owned code or generated artwork MIT/open source by default.
- Preserve third-party license and attribution notices separately; the game's
  proprietary notice does not override them. Do not claim that changing the
  current notice revokes rights validly granted for earlier versions. Repository
  visibility changes require a separate user instruction.

# Asset attribution

- When the user supplies downloaded assets, ask where they found them unless
  that information is already provided. Request the specific asset URL or stock
  ID, creator, license/usage terms, and any download or purchase record needed
  to identify permission. A platform search page alone is incomplete provenance.
- Automatically add or update the supplied asset's record in
  `src/modules/credits/domain/inventory.ts` as part of importing or adopting it.
  Record its files, creator, source, license, required notice, modifications and
  evidence. Keep missing details or permission checks explicitly pending; do
  not invent attribution or assume a manual redraw grants rights.
- When generating images for the project, automatically record their provenance
  without waiting for a separate request. For adopted artwork, update the
  credits inventory and the owning feature's prompt manifest together, retaining
  the provider/model when known, generation date, prompts, input references,
  edits and exported files. Generated provenance is separate from permission or
  provider-term review. Keep draft-only generation records outside the approved
  design tree until adoption; do not list rejected concepts as shipped credits.

# Design documentation

- Follow [the design folder standard](docs/design/README.md) for investigations,
  approvals and artwork revisions. Use one flat folder per feature under
  `docs/design` with a README, one prompt manifest, the approved simplified
  and detailed mockups where available, and one clean default background master.
- Record feature reviews and decisions in its README under `docs/design`.
  Keep temporary review material in the working chat or outside the repo,
  remove it when finished, and avoid parallel design-review folders.
- Link to the owning feature when sharing a backdrop. Keep responsive exports
  in `src/assets`, and keep draft concepts and superseded images or prompt
  versions out of the approved reference tree.
- Preserve reusable generation and final edit instructions with relative paths.
  Label reconstructed prompts and supplied artwork. Update references and
  runtime exports when an approved design changes.

# Module architecture

- Organize features as modules under `src/modules/<feature>` and follow hexagonal
  dependency direction. Domain rules and types remain framework-independent;
  application code composes domain behavior and data without importing React,
  routing, browser APIs, UI components, or infrastructure. Adapters handle those
  external integrations. UI composes the application model and the adapters.
- Keep existing shared domain rules authoritative. Do not duplicate game rules
  inside a feature or introduce empty layers, ports, or repositories merely to
  match a folder template. Add an interface/port where an actual external
  dependency needs inversion or substitution.
- Export a small module entry point from `index.ts`. Infrastructure screens and
  routes should remain thin composition adapters, not own feature content or
  large component trees. Import another feature through its public entry point.
- Keep only the exported screen/composition component and its colocated tests at
  a module's `ui` root. Put supporting UI under `ui/components`, grouped by
  responsibility (for example `layout`, `navigation`, `chapters`, and `search`).
  Split orchestration, content rendering, navigation, and browser effects into
  focused owners. Avoid both a large screen file and a flat pile of helpers.
- Feature-only presentation stays in its module. Promote presentation reused
  across features to `src/components` under its appropriate purpose; shared
  components must not depend on a feature's internal modules or infrastructure
  screen implementations. Preserve the generated primitives boundary.
- Colocate tests with their owner and document module responsibilities,
  dependency boundaries, public entry points, and verification in the module's
  README. Update these architecture notes when introducing a new convention.
