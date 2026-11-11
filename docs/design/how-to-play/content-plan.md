# First-release content inventory and rule audit

The owner confirmed that the existing Rules page and Sings reference are the intended first-release rules. This plan reorganizes that material; it does not replace it with observed implementation behavior. Reference baseline: `08258fa752730aec4fc43cc22596705f2ade0718` on `develop`.

## Source inventory

| Source                                                                                    | Owns                                                                                                        |
| ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `src/domain/constants/rules.ts`                                                           | Written guide, mode quotas, Fall/Clean Table values, target, Sings ranking and glossary.                    |
| `src/modules/rulebook/application` and `ui/components`                                    | Implemented chapter organization, search and focused page components; source content remains in the domain. |
| `src/infrastructure/ui/screens/SingsSheet.tsx`                                            | Search by name/tag, minimum points, mandatory-only filter, descending points order, empty state.            |
| `src/infrastructure/adapters/handWithMeta.ts`, `src/domain/rules/hands.ts`, `handMeta.ts` | Reference entries: names, patterns, points, mandatory flags, descriptions, tags and illustrated examples.   |
| `src/infrastructure/ui/components/modal/SingsModal.tsx`                                   | Existing in-match lookup; preserve match state and dismissal.                                               |

## Original presentation audit (before implementation)

The current Overview contains only a definition, so new readers must assemble their first turn across Setup, Turn and Captures. Eight wrapping tabs compete with a sticky right reference; the latter is hidden below the desktop breakpoint. The first-visit modal tells users how to operate the tabs before they can read the guide. Captures are explained in prose without worked before/after card examples. Sings are presented both in a compact rules ranking and in a richer filtered reference, making divergence possible. Both guide routes use `navigate(-1)` without a guaranteed fallback for direct visits.

Keep the useful short explanations, expanded access to content, existing routes, glossary, reference filtering and all rule data. Replace the introductory navigation lesson with an actual quick-start lesson. Use a vertical chapter structure rather than a wrapping row of eight categories. Make quick reference accessible at small sizes and add stable return destinations and chapter anchors.

## Complete Rules item mapping

| Existing item ID                 | Destination                         | Material to retain                                                                                                                                                                 |
| -------------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `overview/what`                  | Quick start; Setup & objective      | Venezuelan Caída, 40-card Spanish deck, 1v1 / 1v1v1 / 2v2, target 24.                                                                                                              |
| `setup/deck`                     | Setup & objective                   | Four suits, ranks 1–7 and 10–12. Use consistent display names mapped to coins, cups, swords, clubs; do not introduce poker suits.                                                  |
| `setup/dealer`                   | Setup & objective                   | Highest drawn card selects dealer; tied players redraw; counter-clockwise, right of dealer starts.                                                                                 |
| `setup/deal-choices`             | Setup & objective; Variations link  | Three cards each, four opening table cards; players-first/table-first; ascending 1–2–3–4 or descending 4–3–2–1; retain pattern-bonus topic. Current points text is explicitly TBD. |
| `turn/announce`                  | Your turn; Sings                    | Exactly three cards, qualifying Canto before playing.                                                                                                                              |
| `turn/play`                      | Your turn                           | One card; capture or throw; link to precise capture rules.                                                                                                                         |
| `captures/same-rank`             | Captures                            | Same-rank table capture; played and captured cards enter the capture pile.                                                                                                         |
| `captures/cascade`               | Captures                            | Take the continuing sequence after matching; explain with card order and an explicit stop. Fix collection bug #109 before shipping a worked scoring example.                       |
| `captures/fall`                  | Captures; Scoring link              | Next player immediately captures the just-thrown rank; value depends on rank.                                                                                                      |
| `captures/clean`                 | Captures; Scoring                   | +4 for emptying the table, except when the deck is empty. Use “final deal” consistently rather than suggesting this applies to an entire match round.                              |
| `sings/rules`                    | Sings                               | Three-card timing, competing announcements, ranking and dealer-relative tie rule. Link complete reference.                                                                         |
| `scoring/quotas`                 | Scoring & winning                   | 1v1 quota 20, three-player quota 12 / dealer 13, 2v2 combined team quota 20; +1 per excess captured card.                                                                          |
| `scoring/leftovers`              | Scoring & winning                   | Last capturer gets remaining table cards; dealer fallback if no capture. Define the scope of “round” carefully.                                                                    |
| `scoring/end`                    | Scoring & winning                   | First player/team to 24 wins immediately; Three of a Kind may win immediately by prior agreement.                                                                                  |
| `variations/opts`                | Variations & glossary               | Optional Big/Small House; Three of a Kind 5 points or instant win; dealer's deal-style choice.                                                                                     |
| `glossary/defs` and `glossary[]` | Variations & glossary; inline links | Canto/Sing, Cascade, Fall, Clean Table and Capture pile. Retain full definitions rather than only a list of names.                                                                 |

Quick start is an additional summary, not a reason to remove any mapped material. The internal `1vs2` format is three-player free-for-all, never one player versus a cooperating team of two.

## Scoring and Sings values to preserve

| Rule            | Intended value                                                                           |
| --------------- | ---------------------------------------------------------------------------------------- |
| Goal            | 24 points, player or team as appropriate.                                                |
| Fall            | Ranks 1–7: 1; 10: 2; 11: 3; 12: 4.                                                       |
| Clean Table     | 4, disabled when deck is empty.                                                          |
| Extra captures  | +1 for every captured card above the format's quota; combine teammates' captures in 2v2. |
| Big House       | 12–12–1, 12 points, optional.                                                            |
| Small House     | 11–11–1, 10 points, optional.                                                            |
| Register        | 12–11–1, 8 points, mandatory.                                                            |
| Watchtower      | Pair plus adjacent rank, 7 points, mandatory.                                            |
| Patrol          | Three consecutive ranks, 6 points, mandatory.                                            |
| Three of a Kind | Three identical ranks, 5 points or instant win by agreement, mandatory combination.      |
| Pair            | Pair plus third card: 1 point; pair of 10 = 2, 11 = 3, 12 = 4; mandatory.                |

The reference's example hands also remain: Big House 12 coins / 12 cups / 1 swords; Small House 11 coins / 11 cups / 1 swords; Register 12 coins / 11 cups / 1 swords; Watchtower 11 coins / 11 cups / 12 swords; Patrol 10 coins / 11 cups / 12 swords; Pair 7 coins / 7 cups / 3 swords; Pair of 10/11/12 uses the named rank in coins and cups plus 2 swords; Three of a Kind uses three 7s in coins, cups and swords. These are Sings examples, not capture instructions.

## Written quick-start draft

**Reach 24 points by capturing cards and scoring bonuses.** Choose a duel, three-player free-for-all or a two-versus-two team match. At the opening deal each player receives three cards and four cards are placed face up. The player to the dealer's right starts.

Before playing, check the Sings rules for eligible three-card combinations. On your turn, play one card. Matching ranks let you capture; a card left uncaptured stays on the table. Read Your turn and Captures for the complete rules.

**Example — match the rank:** You play the 4 of cups. The table holds the 4 of coins, 7 of clubs and 11 of swords. Collect the two 4s. The 7 and 11 stay. This is a basic capture: there is no continuing 5 and no Fall or Clean Table bonus in this example. Its state has no matching previous play and does not end the deal. The mockups show the same card arrangement.

The rulebook then continues into Setup, Your turn, Captures, Sings and Scoring. It remains freely navigable; reading does not launch a match, unlock a mode or mark a lesson completed.

## Confirmed bugs tracked separately

All three are consolidated in [#109](https://github.com/Donkijote/fall/issues/109), with reproduction and acceptance criteria. Temporary focused probes reproduced the current behavior. Fix the implementation to match the existing rules, then add expected-behavior regression tests.

| Mismatch                        | Code evidence                                                                                        | Observed outcome                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| High-rank pairs shadowed        | `resolveHands.ts` selects the first matching `HANDS` entry; generic Pair precedes specialized pairs. | 10–10–2, 11–11–2 and 12–12–2 each award 1 instead of 2/3/4.                                  |
| Cascade capture pile incomplete | `moves.ts` removes every target, but only appends base target and played card to `collected`.        | Playing cups-4 onto coins-4, clubs-5, swords-6 clears the table but collects only two cards. |
| Optional Sings flag ignored     | `resolveHands.ts` does not filter optional combinations using `config.allowOptional`.                | Big House awards 12 with optional Sings disabled.                                            |

## Further reconciliation before implementation

These are source-review questions, not decisions to change the first-release rules and not additional reproduced findings in #109. Keep them visible when turning the design into final copy and gameplay acceptance tests.

- **Pattern bonus remains unfinished in the written source.** `RULES` says points TBD for matching the chosen pattern. `applyTablePatternBonus` sums each independently matching position, including partial matches. Do not publish a new numeric teaching example based solely on this code; establish the intended bonus first.
- **Sings announcement timing.** The Rules speak of announcing before a play. `Game.tsx` automatically calls `announceSings`, which resolves all three-card hands after a deal. Decide how the intended rule is represented to players without inventing an unimplemented announcement button in the design.
- **Ties.** The Rules summarize ties by proximity to the dealer; the resolver compares hand strength first when tied hands share a name. Confirm the complete intended ordering before writing a tie example.
- **Instant Three of a Kind.** The Rules retain this agreed option, and state has `threeOfAKindWinsGame`; the resolver currently awards fixed points. Preserve the written option and verify its configured behavior in the implementation pass.
- **Capture or throw.** The written rule says either action; `analyzePlay` automatically builds a capture when a rank matches. Clarify whether a player may deliberately decline a capture before writing exhaustive legal-action copy.
- **Multiple equal ranks and rank sequence.** The engine selects one target per rank and uses 1–7,10–12 order. Written “card(s)” and numeric adjacent notation are less precise. Confirm intended examples with duplicates and 7 → 10 rather than silently inventing behavior.
- **Fall and round ending.** The code retains the last played rank even after captures; the written rule describes a just-thrown card. Clean Table and immediate-winning checks also need end-to-end verification, including the last action before `roundEnd`. These edge cases need focused gameplay tests before final worked examples.

Do not hide implementation bugs or unresolved wording from the release review, and do not place these engineering notes in the player's tutorial. The implemented guide preserves the current Rules/Sings data; gameplay engine corrections remain separate from the rulebook UI work.
