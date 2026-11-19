# Authoritative multiplayer and platform research (#129)

Date: 2026-11-19. Status: discovery in progress; no provider selected.
Owner: [issue #129](https://github.com/Donkijote/fall/issues/129).
Related: [cross-platform distribution](../platform-distribution/README.md).

## Agreed research scope

The owner requested a collaborative brainstorming and research phase for Fall's
future player experience, authoritative multiplayer, accounts and related services.
This issue produces documentation and scoped follow-up issues. Implementation
belongs in those follow-ups. The draft PR targets `develop` to preserve the research
and decision history; creating it does not mean the research is complete.

No artwork is introduced, so this technical investigation has no prompt manifest,
mockups or background master.

## Confirmed decisions and open proposals

- Confirmed by the owner: use #129 for research and brainstorming; retain the
  findings in the repository and a draft PR; derive future work from the findings.
- Confirmed repository constraint: reuse framework-independent shared game rules;
  keep provider SDKs, transport and persistence in adapters.
- Confirmed product direction: shared accounts and progression across multiplayer,
  solo Adventure and ranked Arena, with energy, currencies and future commercial,
  social and content systems described below. This is a vision, not a launch commitment.
- Confirmed first release: online Tavern only, with 1v1, free-for-all and team
  matches. The owner wants players to be able to play, without the other planned
  feature systems. Online entry requires login or registration; matchmaking groups
  queued players by the selected format.
- Revised future direction: plan online Adventure; offline Adventure synchronization
  is no longer a requirement. Offline Tavern practice against bots in all formats
  is a possible later feature. Energy is spent when starting a match or stage.
- Confirmed abandonment: explicit 1v1 departure gives the opponent a win; explicit
  team departure ends the match as a loss for that team and a win for the other.
- Open: provider, exact login providers, account linking/recovery, reconnect policy,
  three-player abandonment, economy values, operating budget and later rollout.
- Convex, Cloudflare Durable Objects and Nakama are candidates from the original
  brief. Familiarity with Convex is context, not a selection decision.

## Repository baseline

Inspected `develop` commit: `47a491b`.

- [Login](../../../src/modules/login/README.md) is presentation only. Form submission
  is suppressed and provider/recovery/registration actions are placeholders.
- [Matches](../../../src/modules/match/README.md) run locally with simulated guests;
  refresh starts a new session and leaving discards the match.
- [Shared state](../../../src/domain/entities/GameState.ts) contains all hands and
  the deck. It is an internal model, not a safe multiplayer response schema.
  Recipient-specific projections must protect hidden information.
- Existing game formats are `1vs1`, `1vs2` (free-for-all), and `2vs2`.
- `ScoreAward` already provides stable per-stream presentation IDs and source
  metadata. Network delivery and reconnect semantics still need specification.
- Native distribution research requires session recovery, deep links and supported
  client versions; coordinate those contracts with #140.

These observations describe source structure, not a tested backend.

## Owner product vision — 2026-11-19

The following records the owner's stated intentions. Timing is unspecified except
where the owner explicitly described a later feature. No values, purchases or
provider integrations have been implemented or approved by this document.

| Area                      | Intended experience                                                                                                       | Decisions still needed                                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Multiplayer foundation    | Play against other people; validate actions, played cards and points within each match.                                   | Public queue by format agreed; clocks, reconnect, free-for-all abandonment and start policies remain open.            |
| Accounts                  | Mandatory online login/registration; email/password and social login such as Google or Facebook.                          | Exact launch providers, linking, recovery and cross-device sessions; no online guest entry requested.                       |
| Shared progression        | Retain player level, XP and earned XP, coins and gems across game modes; grant rewards for leveling up.                   | Reward sources/amounts, level curve, currency uses, eligibility and claim behavior.                                         |
| Adventure                 | Solo story split into many stages; play and win matches against the computer; retain stage progress.                      | Online Adventure baseline; replay rewards, stage unlocking, difficulty, narrative structure and content delivery.           |
| Arena                     | Challenge other players; wins and losses move the player's rank up or down.                                               | Rating/rank model, matchmaking, seasons, rewards, ties and abandoned matches.                                               |
| Energy                    | Limited energy; actions consume it and time restores it.                                                                  | Per-start costs, cap, refill interval, precise charging point, refunds and whether any play stays available at zero energy. |
| Monetization              | Buy gems with real money; spend gems on extra energy or coins.                                                            | Packs, pricing, grants, purchase verification, restoration, refunds and platform/channel strategy.                          |
| Cosmetics (later)         | Multiple card and table skins, purchasable with gems.                                                                     | Ownership, selection, visibility to opponents, bundles and earned alternatives.                                             |
| Special-card mode (later) | Another mode involving powers tied to special cards a player can have.                                                    | Collection/acquisition model, power rules, deck construction and separation from ordinary/ranked play.                      |
| Localization              | Translate the whole game, including story content.                                                                        | First languages, fallback, translation workflow and versioning of narrative/configuration content.                          |
| Characters                | Game characters, with several profile characters players can unlock or buy.                                               | Narrative versus profile character relationship, unlock conditions, currency and character effects.                         |
| Clans                     | A clan mode/system and clan chat.                                                                                         | Membership, roles, shared activities, rewards and management.                                                               |
| Messaging                 | Direct player messaging plus clan chat.                                                                                   | Friend/contact rules, retention, blocking, reporting and moderation.                                                        |
| Daily quests              | Dynamic quests that can change each day, such as winning a match or completing an action; completing them grants rewards. | Shared versus personal rotation, reset timezone, assignment, expiry, eligibility, rerolls and claims.                       |

Naming clarification: the owner referred to “castle match” as the current Tavern.
Keep this as a working name; confirm whether it means a rename or a distinct mode.
Characters were mentioned alongside this mode and Arena; their role needs clarification.
Future additions remain possible; the backend research must consider extensibility
without treating unknown features as present implementation scope.

## First release and later capabilities

Owner decision: the first online release is **Tavern only**, with the existing
1v1, free-for-all and team formats. The goal is simply to play against other
players. Adventure, Arena ranking, XP/levels, currencies, energy, purchases,
cosmetics, quests, clans, messaging, unlockable characters and the special-card
mode are later capabilities, not acceptance requirements for the first release.
Localization is part of the broader vision; launch language coverage is unconfirmed.
The first screen is login. Players must sign in or create an account before online
play, using email/password or a social provider. Google and Facebook are the owner's
examples; the exact launch provider list is not finalized. No guest entry is planned
for online play. Offline practice access before login is an independent open question.

Research should evaluate a provider against both this small release and the future
vision. Implementation should establish only the boundaries the Tavern release
needs, without building empty future systems. Shared player identity, server-owned
matches, private views, legal commands and reconnect behavior are the immediate
architecture topics. The eventual follow-up scope must distinguish these from
later economy and social work.

### Revised offline scope

The owner reconsidered offline Adventure after discussing synchronization costs.
Plan Adventure as online; synchronizing offline campaign progress and rewards is
no longer required. This is a scope reduction, not a measured estimate of the work
or a claim that offline Adventure is infeasible.

A possible later option is **offline Tavern practice against bots**, supporting
all formats and practice scenarios. Proposal: keep this local practice separate
from online XP, currency, ranking, quest credit and Adventure progress, avoiding
an offline reward synchronization system. The owner has not yet confirmed this
no-rewards policy, first-run/download requirements or whether practice needs login.
It is not part of the first online release unless the owner later adds it.

The earlier offline Adventure/synchronization proposal is superseded by this
section; Git history retains its original requirements and research questions.

### Energy granularity

Owner clarification: energy is charged for **starting an activity**, such as a
Tavern match, Adventure stage or Arena match, rather than for each card played.
Energy belongs to a later release. Still decide whether charging occurs on queue
entry, seat acceptance or actual match start, and how cancellation, failed starts,
disconnects and retries affect charges/refunds. Offline practice energy remains open. Values, capacity
and regeneration rate remain unchosen.

## Online entry, matchmaking and departures

### Identity and queue — owner direction

- Login/registration is required for online play. Support email/password and social
  sign-in; confirm the precise initial providers before choosing an auth integration.
- The player selects a Tavern format and enters a waiting queue/lobby. Other players
  seeking the same format fill the match: two for 1v1, three for free-for-all and
  four for teams. Public matchmaking is the confirmed baseline; private rooms,
  invitation links and premade teams have not been requested for first release.
- Open queue details: cancellation, duplicate entry, seat reservation expiry, player
  readiness, team assignment, minimum-player start and waiting-time policy. Do not
  assume bots silently fill an online queue.

Research proposal: distinguish waiting lobby membership from an active match so a
cancelled search or failed start does not automatically invoke in-game forfeits.
Use one accepted assignment per player, with an explicit admission/start boundary.

### Explicit abandonment — owner direction

| Format                    | Agreed outcome                                                        |
| ------------------------- | --------------------------------------------------------------------- |
| 1v1                       | End the match; the remaining player wins.                             |
| Three-player free-for-all | Unresolved. Owner considered cancellation or continuing as 1v1.       |
| 2v2                       | End the match; the abandoning team loses and the remaining team wins. |

For 2v2, ending the match with a forfeit outcome is distinct from voiding the match:
it has a winner and a loser. Future progression/ranking/reward policies must decide
how the non-abandoning teammate is treated; no individual penalty is specified yet.
If several players leave simultaneously, finalization ordering and the resulting
outcome still need a deterministic policy.

### Temporary connection loss — unresolved policy

The owner explicitly wants support for losing connection and returning. Do not
interpret an absent socket as an explicit surrender command or assume the server
can establish why a client stopped responding.

Research proposal: reserve the player's seat for a bounded grace period and allow
re-authentication/rejoin to that same match with a recipient-private snapshot.
Specify how turn deadlines run during absence, whether play pauses or a bot covers
turns, the reconnection deadline, repeat-disconnect handling and expiry outcomes.
An explicit authenticated abandon command can finalize immediately; an expired
connection-loss grace period can enter the eventual format-specific forfeit policy.
Server outages require their own recovery/void policy rather than player penalties.
These proposals are not yet approved gameplay rules.

### Free-for-all options — research proposal

- Cancel/void: straightforward outcome semantics, but an abandoning player can erase
  the other players' session. Decide whether any partial result is retained.
- Convert to 1v1: define the removed hand, collected cards, points, deck, dealer and
  turn order. Treat this as a rules variant to design and test, not a seat deletion.
- Keep three seats with a server bot taking the abandoned seat: proposal to preserve
  match format and let the remaining humans finish. Decide whether the leaver can
  return, whether their seat can win and how the remaining humans' results count.

Current recommendation for discussion: assess bot replacement for free-for-all;
keep the original three-player rules throughout the match. This is not an approved
choice or proof that the current bot implementation is suitable for server use.

## Working architecture hypotheses to investigate

These are research proposals, not owner decisions or verified provider capabilities.
They connect the product vision to questions the architecture evaluation must answer.

- Use one persistent player identity across modes, linked to authentication
  identities. Distinguish account identity, cosmetic/profile selection and match seats.
- Give the backend ownership of retained balances, energy, progression, rank,
  reward claims and purchase entitlements. Clients submit intents; accepted domain
  outcomes drive durable changes and recipient-safe views.
- Treat online Adventure with rewards as a trust question too: a computer opponent
  does not by itself make a client-reported win trustworthy. Compare server-run
  matches with validated command logs, including bot and random-seed ownership.
  Offline reward-bearing Adventure is now outside the planned scope; local practice
  reward separation remains a proposal to confirm.
- Model currency changes with durable transaction records and deduplicated sources
  such as a completed match, quest claim, level reward or verified purchase.
  Specify recovery across boundaries so retries never duplicate a grant or spend.
- Investigate energy derived from server timestamps and a regeneration policy;
  do not assume a permanently running per-player timer is necessary. Decide what
  joining, cancelling, disconnecting and completing a match do to the energy charge.
- Record quest assignments and rule/content versions so a daily configuration change
  cannot reinterpret an in-progress objective or let a reward be claimed twice.
- Keep match rules, economy/rank/quest policies and story content separately
  versioned. Power cards must not silently change the rules of an existing match.
- Evaluate match hosting separately from account, economy and social services,
  while comparing an integrated deployment with a split design. Separate ownership
  boundaries do not require separate servers or microservices.
- Plan localization keys and versioned content references for story, quests and
  characters; display wording must not become the identity of a reward or rule.

## Next discovery decisions

1. Confirm free-for-all abandonment behavior and connection-loss grace/turn policy.
2. Confirm whether offline bot practice grants no persistent rewards and costs no
   online energy; decide later whether it is accessible without login.
3. Establish operating constraints for provider comparison: expected initial audience
   and regions, budget ceiling, managed versus self-hosted operations, and owner's
   existing Convex experience/preferences.
4. Finalize initial social login providers, verification/recovery and account linking.
   Later specify energy charging/refunds and paid-resource/competitive policies.

## Discovery agenda

Work through these topics conversationally. Record owner answers before assigning
priorities; a listed idea is not an approved feature.

1. Player vision: friends versus strangers, casual versus competitive, formats,
   live turn timing versus asynchronous play, launch versus long-term scope.
2. Identity: guest play, account creation, login providers, account linking,
   cross-device progress, recovery and deletion.
3. Social and discovery: invites, private rooms, matchmaking, friends, presence,
   chat, spectators, moderation and abuse handling.
4. Progression and economy: reasons to return, XP/levels, coins/resources,
   cosmetics, ranking, seasons, monetization and reward eligibility.
5. Match experience: clocks, bots, disconnects, rejoin, forfeits, abandonment,
   server restarts and fair handling of backgrounded mobile clients.
6. Operating constraints: expected concurrent players and regions, monthly budget,
   maintenance capacity, deployment preferences, observability and support needs.

## Research method and decision gates

After discovery, compare the candidates against the agreed requirements using
current first-party documentation and explicit experiments for uncertain behavior.
Evaluate authority and concurrency, transactions and reward durability, private
views, realtime subscriptions, timers, auth, matchmaking/presence, native sessions,
local testing, deployment, recovery, observability, scaling and cost.

Record sources and access dates alongside claims. Separate documented guarantees,
our assumptions and measured results. No current price or Fall-specific performance result has been measured. Initial documentation findings
below establish only specific capabilities; the full provider comparison is pending.

Before a recommendation becomes final, specify the account and match data models,
command/event contracts, privacy boundaries, lifecycle, reward policy and rollout.
Use a representative two-client spike to resolve architectural risks rather than
assuming every requirement is satisfied by a platform's feature list.

Starting architectural sources from the issue:

- [Convex mutations and transactions](https://docs.convex.dev/functions/mutation-functions)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Nakama authoritative multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)

## Initial first-party findings — checked 2026-11-19

These narrow findings support follow-up research; they do not select a provider.

- [Convex authentication overview](https://docs.convex.dev/auth/overview) documents
  OIDC/JWT authentication, first-party Convex Auth and third-party integrations.
  Research implication: match hosting and authentication are separate choices even
  within a Convex proposal. Exact email/password, Google/Facebook linking and
  native redirect behavior still need a concrete integration review.
- [Nakama authoritative multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)
  documents match join/leave hooks and temporary seat reservation after disconnect.
  Research implication: Fall must still define its own grace and forfeit rules.
  The page distinguishes continued authoritative matches after players leave from
  enterprise match migration during graceful shutdown; neither proves crash recovery
  or durable Fall match state. Those remain required experiments.
- [Durable Objects WebSockets](https://developers.cloudflare.com/durable-objects/best-practices/websockets/)
  documents connected clients surviving object hibernation while in-memory state
  resets. Research implication: a Cloudflare design must restore authoritative match
  state, separately test client reconnection and specify timers/recovery. Hibernation
  is not proof of player reconnect or a complete multiplayer backend.

No accounts, servers, purchases or provider deployments were created in this review.

## Requirements carried forward from the original implementation brief

Keep these in follow-up scoping even if launch priorities change:

- The server validates membership, turn ownership, cards, captures, deal choices,
  Sings, scoring and win conditions for each supported format. It owns shuffle,
  deck order, timers, bot actions and match outcomes.
- Explicit command identity and state/event versions cover concurrent commands,
  stale revisions, retries, idempotency, reconnect snapshots and restart recovery.
- Public and recipient-private views exclude opponents' hands, future deck order
  and server-only randomness. Define disclosure for every event and snapshot.
- Define reward eligibility, earning sources, XP-to-level curve, coins and other
  resources, wins/losses/participation, bots/private/abandoned matches and farming
  controls. Initial values remain proposals until reviewed with the owner.
- Persist results and reward ledgers atomically or through an explicitly specified
  recoverable protocol that prevents duplicate grants. Never trust client balances,
  claimed outcomes or awards.
- Keep animation timing separate from game authority; provide stable points/Sings
  events and a staged migration from local simulation.
- Implementation verification must cover two independent clients, all formats,
  illegal/unauthorized/stale/duplicate commands, hidden-state protection, reconnect,
  restarts and durable rewards. Document setup, migrations, deployment and diagnostics.

## Follow-up issue plan

No new implementation issue has been created yet: the owner discussion must define
its scope first. For each agreed work item, record the problem, boundaries,
dependencies, acceptance criteria and verification. Link the issues here and back
to #129. Separate additional research/spikes from implementation where needed.

## Research acceptance criteria

- [x] Record the owner's product vision, launch priorities, future ideas and unresolved questions.
- [ ] Compare backend/auth candidates against agreed requirements with sources, tradeoffs and validation gaps.
- [ ] Document a justified architecture direction, data/command/event boundaries, progression policy and staged rollout; label provisional decisions explicitly.
- [ ] Create and link scoped research/spike and implementation follow-up issues with acceptance criteria and dependencies.
- [ ] Review the research with the owner and reconcile issue/PR checklists before handoff.

## Discussion record

2026-11-19: Owner narrowed #129 from backend implementation to collaborative
research and planning. Initial question asks for the overall player experience and
future ambitions. The owner then described multiplayer validation, accounts, shared levels/XP/coins/gems,
solo staged Adventure, ranked Arena, regenerating energy, real-money gem purchases,
future card/table skins and a special-card power mode, localization, characters,
clans, direct/clan messaging and dynamic daily quests. The vision is captured above;
launch priorities and policy decisions remain open. No provider was selected.

2026-11-19, scope clarification: the owner chose Tavern-only first release across
1v1, free-for-all and teams, with no additional feature systems. Future Adventure
may be played offline and synchronize on reconnection. Energy means a charge to
start a match/stage/activity, not individual card plays. The first research
criterion is complete: vision, launch priorities, future ideas and unresolved
questions are recorded; provider comparison and follow-up issues remain incomplete.

2026-11-19, entry and lifecycle clarification: owner now prefers online Adventure
and suggests optional offline bot Tavern practice instead of campaign synchronization.
Online users must log in/register with email/password or social login (Google/Facebook
examples). Tavern groups waiting players by format. Explicit departure loses 1v1
or 2v2 for the departing side; three-player handling and reconnect timing remain open.
Initial first-party provider documentation was reviewed without a selection decision.
