# 🎴 Fall* — Rules Specification

## Development

Use Node **26.12.1** (`nvm use`) and pnpm **12.15.0**, as pinned in `.nvmrc` and `package.json`. CI reads the same version pins.

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

The project uses Vite Plus (`vite-plus`), with its compatible Vite, Vitest, Oxlint, and Oxfmt toolchain pinned through the pnpm catalog. The existing pnpm commands invoke the local `vp` CLI; a global installation is not required.

Run `pnpm check` for formatting and lint checks, `pnpm build` for TypeScript project checking and the production build, and `pnpm test:coverage` for the test suite and coverage report. CI runs these same commands.

Use `pnpm lint` to check code with Oxlint and `pnpm lint:fix` to apply safe fixes. Use `pnpm format` to format the project with Oxfmt, or `pnpm format:check` to check formatting without writing files.

Linting and formatting use Vite Plus defaults. The `lint` block in `vite.config.ts` adds browser globals; TypeScript checking runs as part of `pnpm build`. The `fmt` block preserves the custom Tailwind class sorting (using `src/index.css`) and import groups with blank-line separation: unscoped packages and Node built-ins, `@react/*`, `@/*` project aliases, other scoped packages, then relative imports. All other formatting options use the toolchain defaults, including the 100-column print width. Side-effect imports retain their default ordering behavior.

### Theme colours

Use the existing shadcn tokens for surfaces, text, actions, borders, inputs, and
focus rings. Keep light and dark theme values in OKLCH in `src/index.css`, and
use semantic aliases when roles intentionally share a value. Use Tailwind's
palette for one-off decorative accents. A new global token needs a reusable role
across features that the existing palette cannot express. Shared gold trim and
artwork contrast are examples. See the [UI implementation rules](AGENTS.md).

### Animation in new features

Use GSAP with `@gsap/react` for DOM animation, Three.js or React Three Fiber for
3D scenes, and Three Quarks for 3D particle effects. This applies to a simple
fade, hover, or focus effect as much as to a game sequence. Keep Tailwind and
CSS for static styling, responsive layout, and immediate state changes. Do not
use CSS keyframes, CSS transitions, or Tailwind animation utilities. Disable
inherited transitions and keep focus cues visible with reduced motion. Scope timelines to the feature and clean them up on unmount.

See [AGENTS.md](AGENTS.md) for the implementation rules and the
[login screen](src/modules/login/README.md#interface-motion) for a working example.

### Module architecture

Feature work belongs under `src/modules/<feature>` and follows hexagonal
dependency direction: framework-independent domain rules, application logic
that depends inward on those rules, and adapters for routing, browser state or
other external dependencies. UI composes those pieces. Keep infrastructure
screens and routes thin and expose a small module entry point through `index.ts`.
Do not copy authoritative game rules into feature state or create empty layers
and ports without an actual dependency to isolate.

At a module's `ui` root, keep its exported screen/composition component and
colocated tests. Group supporting components under `ui/components` by
responsibility instead of flattening them into the root or growing a single
large screen. Shared presentation belongs in `src/components`; feature-only
presentation stays inside the module. Colocate tests and document ownership and
dependencies in each module's README.

The [rulebook module](src/modules/rulebook/README.md) illustrates this organization.
These conventions are also part of [AGENTS.md](AGENTS.md).

## Cloudflare Deployment

The app is hosted at the domain root on Cloudflare Workers using static assets.
`wrangler.jsonc` serves `dist` and uses SPA not-found handling so direct requests
and refreshes on `/login`, `/game`, `/cards`, `/sings`, and `/rules` load the app.
There is no `/fall` URL prefix or GitHub Pages deployment workflow.

For local deployment, authenticate with `pnpm exec wrangler login`, then run:

```sh
pnpm deploy:dry-run
pnpm deploy:preview --name my-branch
pnpm deploy
```

These commands build first. `deploy:preview` creates or updates an isolated
Worker Preview; `deploy` is the low-level production command. Use the Release
workflow below for versioned production deployments rather than deploying a
branch directly.
To test Cloudflare routing locally without deploying,
run `pnpm build` followed by `pnpm preview:cloudflare`.
The Worker is named `fall` and uses the account's `workers.dev` subdomain;
no custom domain is configured.

### GitHub Actions

Configure `CLOUDFLARE_API_TOKEN` (scoped to deploying Workers on the target
account) and `CLOUDFLARE_ACCOUNT_ID` as repository secrets. Alternatively,
configure both secrets separately on the `preview` and `production` GitHub
environments. Preview deployments never use the production environment.
Both paths check formatting, lint, tests, and the build before uploading assets.

#### PR and manual branch Previews

- **Deploy Cloudflare Preview** runs for non-draft, same-repository PRs targeting
  `develop` or `main` when opened, updated, reopened, or marked ready for review.
  Fork PRs do not receive deployment secrets.
- Each PR uses a readable title-based name such as `add-login-screen`, without
  the issue prefix or a PR-number suffix. PRs with the same normalized title
  update the same Preview; use distinct titles when separate Previews are needed.
  Long names are shortened at a word boundary. Renaming a PR can
  create a new Preview on its next deployment. Its URL appears in the workflow
  summary and the GitHub `preview` deployment.
- Manual runs accept a trusted `branch` input and always use `wrangler preview`,
  even if the selected branch is `main`. Names default to readable branch slugs
  (`feature/login` becomes `feature-login`), not opaque hashes.
- Set the optional `preview-name` input for a descriptive name such as
  `cloudflare-previews`, `new-feature`, or `fix-button`. Reusing a name updates
  that Preview; choose distinct names for branches whose normalized names would
  otherwise collide. Names use lowercase letters, numbers, and hyphens.
- Once the workflow exists on `develop`, run it from the Actions UI or use
  `gh workflow run deploy-cloudflare.yml -f 'branch=develop'`.
  To choose a name, add `-f 'preview-name=cloudflare-previews'`.
- Only select trusted branches: their build scripts run in the deployment job.
  Preview isolation protects the production deployment, not the API token from
  malicious code. Consider a more restricted token for the `preview` environment.
- Previews are public by default and remain available after a PR closes. Remove
  one when no longer needed with
  `pnpm exec wrangler preview delete --name cloudflare-previews`.
  Preview settings belong in `wrangler.jsonc`'s `previews` block; static assets
  and SPA handling stay at the top level. No runtime bindings are currently used.

#### Main and release production deployments

- **Deploy Main** is the only workflow that runs `wrangler deploy`. It cannot
  run independently or accept an arbitrary deployment branch. It is called
  only after the **Release** job succeeds.
- For PRs labeled `release/major`, `release/minor`, `release/patch`, or
  `release/current`, **Release** builds the merge commit after its existing
  version-bump step and saves `dist` as `cloudflare-release-assets`. Only after
  that job has also pushed the tag and created the GitHub release does it call
  **Deploy Main** with the artifact and release tag. Production uploads that
  exact build without rebuilding or racing a second main deploy.
- Cloudflare's Worker version uses the same `v<version>` tag and a deployment
  message containing the GitHub release tag and source commit. The published
  `/release.json` also records the version, tag, and source commit. Deployment
  verifies that this metadata matches the checked-out Git tag before uploading.
- An unlabeled main merge does not create a release or deploy to production.
  Apply one of the release labels before merging when a release is intended.
- Reusing a release tag for a different source commit fails rather than
  deploying new assets under an old version. Use a new version label instead.
- A failed release job blocks its production deployment. Release signing,
  tagging, changelog, and release-sync behavior are otherwise unchanged.
- To retry a failed production upload, rerun the failed **Deploy Main** job in
  the original **Release** run. It reuses the same release artifact, retained
  for seven days, instead of rebuilding a potentially different branch.
- Production deployments are serialized independently of Preview deployments.

Disable GitHub Pages in the repository's **Settings → Pages** after migration.
The old remote `deployment` branch is not updated or deleted by this change.

## UI Components

The interface uses the installed shadcn/ui `base-luma` preset with Base UI and Lucide icons.
Shared primitives live in `src/components/ui`; add components with `pnpm exec shadcn add <component>`.
Use semantic theme colors and radius aliases from `src/index.css`. Compose game actions and brass-framed surfaces through `src/components`.

The global theme preserves the proportional shadcn radius scale. Reusable app
components choose `rounded-md` (8px) for their common control and surface shape.
Other radius tokens remain available for distinct roles. Shared styled components
own brass frames and action presentation. Feature code supplies layout.
Native focus, dismissal, refs, keyboard, and touch behavior come from the primitives.
See [the design-system and migration guide](docs/shadcn-migration.md) for conventions and the component inventory.
[Fall art direction](docs/design/art-direction.md) covers the visual language.
The [design library](docs/design/README.md) indexes approved mockups, background masters, and reusable prompts, and explains how to organize new design work.
Record design decisions in the feature's README under `docs/design` and keep temporary reviews outside the repository.
Generate production illustrations as standalone artwork at the required aspect ratio and resolution. Use full mockups as visual references and export runtime assets from the standalone originals. Do not crop illustrations out of a full mockup.

## 📖 Overview

Fall is a traditional Venezuelan card game played with the **Spanish 40-card deck**.  
It can be played in **duel (1v1)**, **three-player free-for-all (1v1v1)**, or **team mode (2v2)**.  
The first **player or team to reach 24 points** wins.

---

## 🎴 Deck

- **40 cards** from the Spanish deck.
- Suits: **golds, cups, spades, sticks**.
- Ranks: **1–7, 10–12** (8 and 9 are removed).

---

## 👥 Player Counts

- **1 vs 1** (duel).
- **1 vs 1 vs 1** (3-player).
- **2 vs 2** (team mode).

---

## 🏆 Objective

- First **player or team** to reach **24 points** wins.

---

## 🃏 Dealing & Setup

1. At the start of the game, each player draws a card.
   - The **highest card** becomes the **dealer**.
   - Turn order proceeds **counter-clockwise** (player to the dealer’s right goes first).

2. The **dealer** decides the deal order:
   - **Players first** → 3 cards per player, then deal the table.
   - **Table first** → deal table, then 3 cards per player.

3. **Table deal pattern:**
   - Dealer chooses **ascending (1-2-3-4)** or **descending (4-3-2-1)**.
   - Dealer reveals **4 cards** to the table.
   - If revealed cards match the chosen pattern → immediate bonus points to the dealer (or dealer’s team).

---

## 🔄 Turn Order

- Always **counter-clockwise** (right of dealer plays first).
- On a turn, a player must:
  1. **Announce a canto (sing)** if holding exactly 3 cards and eligible.
  2. **Play one card**:
     - **Capture** a card (or valid combo) from the table, or
     - **Throw** a card onto the table (no capture).

---

## ✋ Captures

- A card can capture a **same-rank card** from the table.
- **Cascade Rule:**  
  If the captured card can form a sequential chain (e.g., captured `2` → also take `3,4,5…`),  
  the capturing player takes the entire sequence.
- Captured card(s) + the played card go into the player’s **capture pile**.

**⚡ Special Rule — Fall**

- If a player **throws** a card onto the table…
- …and the **next player immediately captures it** with a card of the same rank → **Fall!**
- Fall points:
  - Rank **1–7** → +1 point
  - Rank **10** → +2 points
  - Rank **11** → +3 points
  - Rank **12** → +4 points

**Clean Table:**

- If after a capture (single or cascade) the table is completely empty, the capturing player/team earns **+4 points**. But only if it's not last round (no cards in deck)

---

## 🎶 Hands (Sings)

Cantos are **special 3-card patterns** scored only when a player has all 3 cards in hand (before playing).

- If multiple players announce cantos, the **highest ranking canto wins**.
- If tied, the player **closest to the dealer** wins.
- Some cantos are **optional** (must be agreed before play), others are **mandatory**.

| Name                           | Pattern             | Points               | Notes                                                                         |
| ------------------------------ | ------------------- | -------------------- | ----------------------------------------------------------------------------- |
| **Big House** (Casa Grande)    | 12–12–1             | 12 pts               | Optional                                                                      |
| **Small House** (Case Chica)   | 11–11–1             | 10 pts               | Optional                                                                      |
| **Register** (Registro)        | 12–11–1             | 8 pts                | Mandatory                                                                     |
| **Watchtower** (Vigía)         | x–x–(x+1 or x−1)    | 7 pts                | Mandatory; e.g. 5–5–4                                                         |
| **Patrol** (Patrulla)          | 3 consecutive ranks | 6 pts                | Mandatory; e.g. 6–7–10                                                        |
| **Three of a kind** (Trivilín) | x–x–x               | 5 pts / Instant Win* | Mandatory; must decide before game if it ends match instantly or scores 5 pts |
| **Pair + any card** (Ronda)    | x–x–y               | 1 pt                 | Mandatory; Special cases: 10–10 = 2 pts, 11–11 = 3 pts, 12–12 = 4 pts         |

---

## 🔚 Round End & Counting

When all cards have been dealt and played:

- Count captured cards
- If no player/team has reached 24 points → see **New Dealer** section

**Extra card rules:**

- **1v1:** Each counts to **20**. Extra cards beyond 20 → +1 point each.
- **1v1v1:** Each counts to **12**, dealer must count to **13**. Extra cards beyond quota → +1 point each.
- **2v2:** Each team counts to **20**. Extra cards beyond 20 → +1 point each.
- When it's the last round any card remaining on the table will be taken by the last player who captured a card from the table, if any player took a card, then the dealer takes the remaining cards on the table.

---

## 🔄 Next Dealer

- The **dealer role passes right** (counter-clockwise).
- New round begins with same flow.

---

## ✅ End of Game

- First player/team to reach **24 points** wins immediately.
- If **Three of a kind** is set to instant win → the match ends as soon as it is announced.

---

## 📌 Rule Variations (Pre-Game Agreements)

- **Big House / Small House** → decide if optional hands (sings) are used.
- **Three of a kind** → decide if it equals 5 points or instant win.
- **Dealing style** → dealer chooses each round (players first vs table first).

---

## Specification

The name Fall is a literal translation from the spanish word **Caída**

## Animation playground (development only)

Run `pnpm dev`, then open **Settings → Animation playground** on the home screen
or open `/dev/animations`. The route, home link, scene modules, and demo assets are
excluded from production builds.

All studies use the app’s Spanish card SVG artwork on the animated 3D mesh, with
the same light face and dark striped back as the app card design.

The Card, Deck stack, and Table catalogs contain the 21 experiments ported from
`threejs-game`. Select an experiment and press **Play / replay**. Replays reset
isolated lab state while keeping the canvas and WebGL context mounted. Play-card
and Fall capture previews start with a
settled dealt hand, so they can be previewed independently. **Reset scene** stops
the preview and returns to its initial pose.

Live tuning restarts the current preview with the new settings. Timeline speed
controls GSAP choreography; easing controls flips, deck motion, deals, and plays.
Sampled impact motion and Rapier physics retain their original curves. Ember
rate, capture impact, pixel ratio, and an optional FPS display are also available.
Card trajectories and state transitions use fixed starting conditions; decorative
particles remain stochastic. These studies do not dispatch gameplay animations
or change game state.

**Fall capture** retains the full opponent-play, impact, and collection sequence.
**Capture card** starts with a face-up card already on the table, plays a card onto
it, then collects the pair onto the player’s stack to their right without an
elemental impact. Each replay prepares the hands and center cards automatically.

**Cascade capture** matches the first of four face-up table cards, then carries
the growing pile around the grid, picking up each card in sequence before moving
all five cards face down onto the player’s stack to their right.

Capture card and Cascade capture use curved, banking gestures with slight landing
offsets and contact settling. Cascade pickups vary their cadence; collected cards
square up during the lift and align on the final pile. Motion variation is fixed
so replay remains repeatable.
