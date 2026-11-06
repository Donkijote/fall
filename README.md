# 🎴 Fall* — Rules Specification

## Development

Use Node **26.12.1** (`nvm use`) and pnpm **12.15.0**, as pinned in `.nvmrc` and `package.json`. CI reads the same version pins.

```sh
nvm use
pnpm install --frozen-lockfile
pnpm dev
```

Run `pnpm build` for TypeScript checking and the production build, and `pnpm test:coverage` for the test suite and coverage report.

Use `pnpm lint` to check code with Oxlint and `pnpm lint:fix` to apply safe fixes. Use `pnpm format` to format the project with Oxfmt, or `pnpm format:check` to check formatting without writing files.

Formatting is configured in `.oxfmtrc.json`: two spaces (no tabs), double quotes, semicolons, trailing commas, LF line endings, and an 80-column print width. Oxfmt also sorts Tailwind classes using `src/index.css` and sorts imports alphabetically with blank lines between groups: unscoped packages and Node built-ins, `@react/*`, `@/*` project aliases, other scoped packages, then relative imports. Side-effect imports keep their order to preserve initialization behavior. Generated output, assets, and the lockfile are excluded from formatting.

`.oxlintrc.json` explicitly maps the previous ESLint and TypeScript recommended rules, React Hooks checks, and Vite's Fast Refresh export check to native Oxlint rules. The React compiler's `config` and `gating` checks have no native Oxlint equivalents; legacy octal syntax is rejected by the TypeScript/module parser. TypeScript checking remains part of `pnpm build`. No ESLint or Prettier plugins are needed.

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
