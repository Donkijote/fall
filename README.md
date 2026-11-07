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

## Cloudflare Deployment

The app is hosted at the domain root on Cloudflare Workers using static assets.
`wrangler.jsonc` serves `dist` and uses SPA not-found handling so direct requests
and refreshes on `/login`, `/game`, `/cards`, `/sings`, and `/rules` load the app.
There is no `/fall` URL prefix or GitHub Pages deployment workflow.

For local deployment, authenticate with `pnpm exec wrangler login`, then run:

```sh
pnpm deploy:dry-run
pnpm deploy
```

Both commands build first. To test Cloudflare routing locally without deploying,
run `pnpm build` followed by `pnpm preview:cloudflare`.
The Worker is named `fall` and uses the account's `workers.dev` subdomain;
no custom domain is configured.

### GitHub Actions

Configure `CLOUDFLARE_API_TOKEN` (scoped to deploying Workers on the target
account) and `CLOUDFLARE_ACCOUNT_ID` as repository secrets or secrets on the
`production` GitHub environment. The deployment workflow checks formatting,
lint, tests, and the build before uploading assets.

- Merging a PR into `main` deploys the current `main` branch automatically.
- **Deploy to Cloudflare Workers** can also be run manually with a `branch`
  input, including a PR's head branch such as `chore/ghi#95`.
- Manual branch deployments replace the same production Worker; they are not
  isolated preview environments. Only select trusted branches, since the
  deployment runs their build scripts with access to deployment credentials.
- Manual runs become available once the workflow exists on the default branch
  (`develop`). Then use the Actions UI or
  `gh workflow run deploy-cloudflare.yml -f 'branch=chore/ghi#95'`.
- Existing release/versioning and release-sync workflows are unchanged.

Disable GitHub Pages in the repository's **Settings → Pages** after migration.
The old remote `deployment` branch is not updated or deleted by this change.

## UI Components

The interface uses the installed shadcn/ui `base-luma` preset with Base UI and Lucide icons.
Shared primitives live in `src/components/ui`; add components with `pnpm exec shadcn add <component>`.
Use semantic theme colors from `src/index.css` rather than custom glass or gold styles.
See [the design-system and migration guide](docs/shadcn-migration.md) for conventions and the component inventory.

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

Run `pnpm dev`, then choose **Animation playground** on the home screen or open
`/dev/animations`. The route, home link, scene modules, and demo assets are
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
