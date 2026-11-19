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
- Confirmed turn-timeout behavior: when a turn expires, the server automatically
  plays a legal move for that player. Five consecutive inactive turns count as
  abandonment; move selection remains open. The proposed initial turn limit is
  30 seconds.
- Confirmed: a bot replaces an abandoned free-for-all seat. Temporary disconnects
  receive a waiting/reconnect period in the 60–90 second range; choose the exact
  default and repeated-disconnect policy before implementation.
- Confirmed operating budget: $0/month for the backend at this stage. Owner knows
  Convex from an unused hobby project with no real-world usage; no project deletion
  or paid plan change has been requested.
- Confirmed planning audience: likely Spain and Spanish-speaking Latin America,
  possibly several countries together; exact countries and launch order are open.
  Optimistic planning scenario is 20 concurrent matches and roughly 80–100 connected
  players; this is not an adoption forecast or verified capacity.
- Open: provider, exact login providers, account linking/recovery, detailed reconnect
  and bot policies, economy values, exact initial countries and later rollout.
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
| Multiplayer foundation    | Play against other people; validate actions, played cards and points within each match.                                   | Public queue by format agreed; clocks, reconnect, free-for-all abandonment and start policies remain open.                  |
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
examples. Google is now the preferred first social provider to evaluate; Facebook
has no first-release commitment. The auth implementation is not selected. No guest entry is planned
for online play. Email verification is a required later capability, deferred until
after the first Tavern release; it does not gate playing in that initial release.
Offline practice access before login is an independent open question.

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
- Email verification is planned after the initial Tavern release. Keep verification
  status distinct from identity and authentication; an unverified email must not be
  treated as proof of mailbox ownership for account linking. Later verification
  enforcement, treatment of existing accounts and delivery/provider costs need a
  dedicated scope. Password recovery remains a separate authentication requirement.
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
| Three-player free-for-all | A bot takes the abandoned seat; the match remains three-player.       |
| 2v2                       | End the match; the abandoning team loses and the remaining team wins. |

For 2v2, ending the match with a forfeit outcome is distinct from voiding the match:
it has a winner and a loser. Future progression/ranking/reward policies must decide
how the non-abandoning teammate is treated; no individual penalty is specified yet.
If several players leave simultaneously, finalization ordering and the resulting
outcome still need a deterministic policy.

### Temporary connection loss — agreed direction and remaining details

The owner explicitly wants support for losing connection and returning. Do not
interpret an absent socket as an explicit surrender command or assume the server
can establish why a client stopped responding.

Owner accepted a waiting/reconnect period of 60 or 90 seconds. Exact duration is
not finalized. Working proposal: pause play, reserve the seat and permit authenticated
rejoin with a recipient-private snapshot; 90 seconds is a candidate default within
the accepted range, not a separately approved value. Specify turn-clock behavior,
repeated-disconnect limits and expiry outcomes before implementation.
An explicit authenticated abandon command can finalize immediately; an expired
connection-loss grace period can enter the eventual format-specific forfeit policy.
Server outages require their own recovery/void policy rather than player penalties.
The waiting-period direction is agreed; these remaining mechanics are open.

### Proposed turn clock and profile-ring countdown

Owner proposal: **30 seconds per card-play turn**, with the active player's existing
circular profile highlight draining to communicate remaining time and warn as it
runs out. Treat 30 seconds as an initial proposed setting, not a measured match-length
guarantee. The 60–90 second reconnection waiting period is a separate policy.
Dealer-choice/other decision phases remain unspecified. Expired card-play turns
automatically produce a server-controlled legal move, as confirmed by the owner.

Existing presentation evidence:

- [PlayerPortrait](../../../src/components/hud/PlayerPortrait.tsx) exposes active
  highlight/attention flags, not a deadline/countdown contract.
- [usePortraitTurnMotion](../../../src/components/hud/usePortraitTurnMotion.ts) owns
  the GSAP ring draw, orbit, wipe and reflection. The ring currently communicates
  activity, not remaining server-authorized turn time.
- [MatchSeatMarker](../../../src/modules/match/ui/components/board/MatchSeatMarker.tsx)
  composes that shared portrait and the active turn pointer.
- [Player identity design](../player-identity/README.md) remains the canonical ring
  visual reference. This is a proposed extension, not a change to approved artwork.

Research proposal for implementation:

- The server persists a turn ID/revision, authoritative opening timestamp and deadline,
  and validates command eligibility against those values. A stale timeout job cannot
  expire a later turn. Competing play/timeout requests resolve once under one rule.
- Specify a bounded server-owned playable window/presentation allowance so dealing
  and capture playback do not silently consume a player's entire decision window.
  Never let a client's animation completion or readiness acknowledgement indefinitely
  hold game progress. Test slow rendering, reduced motion and late snapshot arrivals.
- The client derives remaining time from a server-time reference and deadline and
  renders a full-to-empty profile arc locally using GSAP. No per-frame or per-second
  server writes are needed for the proposed display. Background/resume, refresh,
  correction and reconnect seek to the current remaining time rather than restarting.
- Extend the shared ring's single motion owner so the countdown and existing
  draw/orbit/wipe cannot animate the same arc in conflict. Match presentation passes
  timing data; other portrait uses need not become timers. Preserve shared tokens,
  artwork, native behavior and cleanup conventions.
- Keep a legible remaining-time cue and accessible warning independent of arc motion
  or color. Reduced motion uses immediate/discrete updates; avoid announcing every
  second. Warning thresholds, text/placement and any sound are unchosen.
- Define whether reconnect grace freezes a turn's remaining time, and what happens
  on repeated disconnects, all-absent matches or backend delays. Merely hiding the
  countdown does not pause the server deadline.

Agreed gameplay rule: when the turn expires, the server automatically plays a legal
move on behalf of the player. A single missed turn does not immediately forfeit the
match. Five consecutive inactive turns count as abandonment, applying the agreed
format-specific outcome: opponent wins in 1v1, the inactive team loses in 2v2,
and a bot takes the seat in free-for-all. The choice among legal moves and bot
information access remain open. The server chooses and validates the move; the
client cannot select or claim an automatic move after expiry.

Working interpretation: count consecutive expired turns belonging to that player,
and reset the counter after an accepted manual move. Count each resolved timeout
once; duplicate jobs or retries cannot add misses. Confirm counter reset/return
semantics and whether the fifth automatic move precedes abandonment or abandonment
replaces that move. Coordinate this with the still-open reconnect grace policy.

Deferred team-mode enhancement, after the Tavern multiplayer foundation: show a
popup only to the inactive player's teammate when a turn expires, with a consecutive
inactivity counter such as 1/5, 2/5 and 3/5. At 3/5, show an additional warning that
reaching five consecutive inactive turns causes abandonment and a team loss.
Suggested copy: “Your teammate is inactive. An automatic move was played (1/5).”
At 3/5: “Five consecutive inactive turns will forfeit the match for your team.”
These are draft strings; final wording, dismissal, accessibility and presentation
need later design. The timeout still plays a legal move, so “skip turn” would be
misleading copy. These notifications and counter UI are outside the first Tavern
release; server inactivity enforcement remains part of the foundation.

Implementation proposal: make expiry resolution idempotent for the turn identity;
if a human move was accepted first, the stale timeout must not add another play.
Test the reverse ordering and the deadline boundary too. Verify four missed turns
continue play and the fifth triggers abandonment exactly once. The automatic-move
selection strategy remains undecided.

### Free-for-all abandonment — decision and alternatives considered

- Cancel/void: straightforward outcome semantics, but an abandoning player can erase
  the other players' session. Decide whether any partial result is retained.
- Convert to 1v1: define the removed hand, collected cards, points, deck, dealer and
  turn order. Treat this as a rules variant to design and test, not a seat deletion.
- Keep three seats with a server bot taking the abandoned seat: proposal to preserve
  match format and let the remaining humans finish. Decide whether the leaver can
  return, whether their seat can win and how the remaining humans' results count.

Owner selected bot replacement. Preserve the three-player format. The cancellation
and 1v1 options above are rejected alternatives retained as decision context.
This decision does not prove that the current local bot is suitable for server use.
Still specify bot access to hidden information, result eligibility, all-humans-gone
cleanup and whether an explicitly departing player may return; temporary disconnects
first follow the reconnection waiting policy.

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

1. Select representative regional test clients and workload/test duration for the
   agreed optimistic 20-match/80–100 connection scenario; define performance budgets.
   Exact launch countries and sustained usage remain assumptions to establish.
2. Complete backend/auth comparison and agree the experiment/selection gates below.
   Finalize initial social login providers, recovery and account linking. Email
   verification is deferred beyond the first release.
3. Review the proposed 30-second turn clock and draining profile ring; choose the
   auto-play selection policy, inactivity counter reset/fifth-turn ordering, other
   timed decisions and turn-start/presentation semantics. Automatic legal play and
   abandonment after five consecutive inactive turns are agreed. Teammate-only
   counter popups and the 3/5 warning are deferred until after the foundation.
   Choose exact reconnect duration within 60–90 seconds, pause behavior, repeated-
   disconnect budget, bot/result policy and server-outage recovery.
4. Confirm whether later offline bot practice grants no persistent rewards and costs
   no online energy; defer economy values and paid-resource rules to later scopes.

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
our assumptions and measured results. Current public pricing/limits were reviewed on 2026-11-19; no account-specific usage,
Fall capacity, performance or bill has been measured. Initial findings and a budget
shortlist follow; the full architecture/auth comparison is still in progress.

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

## Zero-budget shortlist — 2026-11-19

Budget is **$0/month now**, not permission to enable metered paid services. Owner
familiarity with Convex is relevant to maintenance effort; a YouTuber recommendation
is discovery context, not technical evidence. The owner reports that the other
Convex hobby project has no real-world usage and could be deleted. No deletion is
needed to proceed with research and no deletion has been authorized. Check actual
team usage/plan later; an unused project's existence alone proves no quota shortage.

### Audience, capacity and region plan

Owner expects the game may be most familiar to Spanish-speaking players in Spain
and Latin America. Launching in several Hispanic countries together is a possibility,
with wider expansion later. This is a likely audience, not a confirmed country list,
localization launch matrix, data-residency requirement or traffic split.

The optimistic capacity scenario is **20 simultaneous matches**. At four players
per team match, that means **80 seated players**. Test up to **100 total connections**
with additional players waiting or reconnecting; do not count a reconnecting user
as a second seat. One hundred seated players would require 25 full team matches,
a different scenario. Actual initial traffic may be much lower.

This sets a load-test envelope, not a capacity promise. Concurrent users alone do
not establish daily/monthly calls or data usage. Record sustained play hours, match
length and commands, subscription fan-out, lobby churn, deadline/bot jobs, retry
traffic, retained results and headroom. Derive quota projections from measured
consumption per scenario plus explicit duration/retention assumptions. Keep latency,
correctness and monthly allowance as separate validation gates.

[Convex regions](https://docs.convex.dev/production/regions), checked 2026-11-19,
lists N. Virginia, Ireland, Sydney and Canada Central, with no Latin American region
listed. A deployment's infrastructure runs in its selected region; changing regions
requires a new deployment/project and data export/import. Non-US usage is listed at
1.3x standard rates; verify actual Free-plan region availability and budget effects
before creating anything rather than assuming a surcharge is a charge on free usage.

Research proposal: begin with one authority region and test N. Virginia and Ireland
as candidates for the mixed Spain/Latin America audience, subject to the actual free
setup. Do not pick by geography alone or assume one is faster without measurements.
Measure command-to-acknowledgement and command-to-other-client update timing from
Spain and representative Latin American clients; choose locations as testers become
available. State sample size, jitter, reconnect time, deadline delay and test dates.
Set the accepted latency budgets before declaring a load test passed. Do not claim
all Latin American countries share the same network conditions.

[Cloudflare data location](https://developers.cloudflare.com/durable-objects/reference/data-location/)
documents best-effort location hints, including Western Europe, Eastern North
America and South America. Hints are not guaranteed placement and existing objects
do not currently move automatically. Thus the edge frontend does not establish
that a shared match's authoritative state runs close to every participant.

These are proposed experiments; no regional client, latency or load measurements
have been performed. Multi-region match/account coordination is outside the first
experiment unless the measurements establish a concrete need.

### Published free paths and limitations

- [Convex limits](https://docs.convex.dev/production/state/limits): Free has hard
  caps; Starter can exceed included allocations with usage billing. Limits normally
  apply per team. Free lists 1,000,000 function calls/month, 0.5 GB database storage
  and 1 GB database I/O/month. Subscription updates and scheduled executions count
  toward calls. The documented query/mutation user-code execution limit is one
  second. New writes can fail after free limits are reached. These are published
  limits, not an estimate of supported Fall players. Check the actual plan and
  aggregate usage before deploying Fall alongside another project.
- [Cloudflare Durable Objects pricing](https://developers.cloudflare.com/durable-objects/platform/pricing/):
  Workers Free supports SQLite-backed objects with 100,000 requests/day and
  13,000 GB-s duration/day; SQLite includes 5 million row reads/day, 100,000 row
  writes/day and 5 GB stored data. Exceeding a free dimension causes operations of
  that type to fail; daily limits reset at midnight UTC. Other services need their
  own budget review. These units are not directly comparable with Convex calls.
- [Nakama Docker setup](https://heroiclabs.com/docs/nakama/getting-started/install/docker/)
  provides a self-hosted route. [Heroic Cloud pricing](https://heroiclabs.com/pricing/)
  advertises managed hosting, but its returned Nakama price is an unresolved dynamic
  template; no exact monthly quote or $0 managed tier was verified. Research judgment:
  retain Nakama as a game-focused comparator, with no demonstrated zero-cost public
  hosting route for this project. Running software locally does not validate a
  maintained public backend, database and backup deployment at $0.

### Fit and investigation order

| Candidate                                        | Proposed Fall design                                                                            | Why evaluate it                                                                       | Main gaps before selection                                                                                                              |
| ------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Convex Free                                      | Commands as mutations; persisted matches; private subscription queries; scheduled deadlines.    | Owner familiarity and one initial backend for match state and accounts.               | Measure quota consumption, queue contention, private projections, timers, auth/email/native flows and recovery.                         |
| Cloudflare Workers Free + SQLite Durable Objects | A match object owns commands, state and deadlines; separate identity/queue/account integration. | An alternative free managed path alongside Fall's existing Cloudflare frontend setup. | Specify cross-object coordination and result delivery, auth, recovery and combined service limits; validate hibernation with deadlines. |
| Nakama                                           | Authoritative matches with game-service integrations and persisted state strategy.              | Game-focused comparison for long-term multiplayer/social scope.                       | Establish $0 public hosting/operations, domain-runtime compatibility, recovery and database setup.                                      |

**Provisional recommendation: test Convex Free first**, retain Cloudflare as the
main alternative, and do not choose production infrastructure before the gates
below pass. This is our research recommendation, not an owner-approved provider
selection or proof of capacity. No paid plan, free-trial dependence or paid external
auth/email service is assumed.

Supporting Convex mechanics, distinct from our proposed architecture:

- [Mutations](https://docs.convex.dev/functions/mutation-functions) provide
  transactional reads/writes; our command validator must still enforce player
  authorization, revisions, legal rules and deduplication.
- [Realtime queries](https://docs.convex.dev/realtime) update subscribed clients
  when dependencies change. A recipient-specific safe match projection remains
  Fall's responsibility; never expose the internal all-hands state.
- [Scheduled functions](https://docs.convex.dev/scheduling/scheduled-functions)
  are stored durably and survive restarts. Proposal: persist deadlines and schedule
  version-checked handlers instead of per-second writes or a permanent match loop.
  Measure execution delay and quota cost; scheduling is not a strict latency promise.
- Current [Convex Auth v2](https://docs.convex.dev/auth/convex-auth) documentation
  supersedes the earlier v1 password reference used in this investigation. V2 is
  stable for supported React web apps, supports Google OAuth, and documents an
  email/password flow requiring email validation before sign-in. That conflicts
  with the owner's deferred-verification first release; validate this constraint
  before selecting it. Auth email delivery/cost, linking and native callbacks still
  need review; documented React Native support remains experimental.

### Proposed bounded experiment and selection gates

Follow-up [#143](https://github.com/Donkijote/fall/issues/143) tests the actual
Tavern foundation before any
Adventure, currency, energy, purchase, ranking or social implementation:

1. Run authenticated independent clients through real server-owned matches in all
   three formats; reuse the shared rules and use server-owned random/bot inputs.
2. Exercise public queue contention, cancellation, duplicate entry, starts and team
   seating without double assignments or partial matches.
3. Prove private snapshots/events and rejection of unauthorized, illegal, duplicate
   and stale commands. Commands carry IDs and expected revisions; state transitions
   commit atomically with a stable event/result identity.
4. Test the accepted 60–90 second reconnect policy, all format-specific abandonments,
   free-for-all bot replacement and restart/timeout races. Keep server outages
   distinct from player forfeits. Reconnect must not replay presentation as rewards.
5. Measure representative per-match calls (including subscription fan-out and jobs),
   reads/writes, retained bytes and network traffic; include idle lobby, reconnection,
   abandoned/all-bot sessions and abusive retries. Calculate capacity only from
   measured workload assumptions and the actual remaining free team allowance.
6. Verify email/password recovery and selected social sign-in at $0 end to end,
   including the web/native callback boundary required by distribution planning.
7. Document retention/export/restore, quota visibility and what happens near/exceeding
   caps. Proposed admission limits/headroom reduce risk but cannot guarantee that
   active matches finish if provider hard caps block operations.

A free-tier cap may interrupt service; zero spend does not imply unlimited capacity
or paid availability guarantees. Later traffic growth requires an explicit choice
between limiting access, a reviewed budget change or a different deployment.
No paid change is authorized by this research. Commercial-use terms and any auth,
email, observability or backup dependencies remain review gates before release.

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

## Follow-up issues and staged delivery

- [#143 — Validate a zero-cost authoritative Tavern backend and authentication path](https://github.com/Donkijote/fall/issues/143)
  owns the provider/auth comparison, representative authority spike, correctness and
  recovery checks, regional/20-match load measurements, measured quota projections,
  $0 dependency review and a justified selection or rejection. Convex Free is the
  proposed first experiment; this issue is not evidence of provider selection.
- [#144 — Implement the authenticated authoritative Tavern multiplayer foundation](https://github.com/Donkijote/fall/issues/144)
  depends on #143's validated choice and the agreed direction from #129. It owns
  actual accounts, public queues, authoritative matches in all formats, private
  views, reconnect/forfeit/bot behavior, durable results, UI migration and operations.
  It explicitly excludes progression/economy and the later product systems.
- [#140 — Native packaging](https://github.com/Donkijote/fall/issues/140) coordinates
  session/callback/lifecycle boundaries; web backend implementation does not wait
  for complete native packaging.

Order: finish/review #129's research direction; execute #143 and revise the decision
record with evidence; implement/integrate #144 using the selected design; introduce
later Adventure, progression/economy and social capabilities through separate scopes.
No implementation or spike execution was started by creating these issues. Existing
issue checklists track their verification; research completion does not mark them done.

## Research acceptance criteria

- [x] Record the owner's product vision, launch priorities, future ideas and unresolved questions.
- [ ] Compare backend/auth candidates against agreed requirements with sources, tradeoffs and validation gaps.
- [ ] Document a justified architecture direction, data/command/event boundaries, progression policy and staged rollout; label provisional decisions explicitly.
- [x] Create and link scoped research/spike and implementation follow-up issues with acceptance criteria and dependencies.
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

2026-11-19, bot/reconnect/budget clarification: owner accepted free-for-all bot
replacement and 60–90 seconds of waiting for reconnection. Backend budget is $0
at present. Owner has prior Convex experience and an unused hobby project with
no real-world usage; willingness to delete it is not a deletion instruction.
Published free plans and technical primitives were reviewed. Convex Free is the
proposed first experiment; Cloudflare remains the main alternative. No provider
has been selected and no account/deployment/billing settings were changed.

2026-11-19, audience/capacity clarification: owner expects Spain and Latin America
as likely first audiences and may launch in several Hispanic countries together.
Owner offered 20 simultaneous matches, roughly 80–100 connected players, as an
optimistic planning scenario; actual initial usage is unknown and may be lower.
Region documentation was reviewed, but no latency/capacity claim was made.
Created #143 for zero-budget backend validation and #144 for the dependent Tavern
implementation. Both retain unresolved policies as explicit gates, not invented rules.

2026-11-19, turn-clock proposal: owner suggested 30 seconds per turn and using the
active profile's circular animation as a draining countdown/time warning. Existing
shared ring ownership was inspected; no component or animation implementation was
changed. Timeout behavior and exact presentation/server timing remain open for review.

2026-11-19, timeout decision: owner confirmed that expiration automatically plays
a legal move. Recorded as agreed in this research and in #143/#144; no runtime
implementation or completed verification is implied. Repeated-inactivity penalties
and the choice among legal moves are still open.

2026-11-19, inactivity decision: owner chose five consecutive inactive turns as
abandonment, replacing the proposed three-turn threshold. Owner also suggested
notifying the teammate in team mode. Notification timing remains open. Counter
reset after manual play is a working interpretation; fifth-turn ordering and
interaction with reconnect grace require confirmation before implementation.

2026-11-19, teammate notification scope: owner proposed a teammate-only popup on
inactive turns with a 1/5, 2/5, 3/5 counter, plus an additional warning at 3/5 that
five consecutive inactive turns lead to abandonment. This is a future enhancement
after Tavern multiplayer, not a first-release requirement. Draft copy describes an
automatic legal move rather than skipping a turn; final UI design remains open.

2026-11-19, email verification decision: owner wants email addresses verified in a
later release. Initial Tavern login/registration must not require verification as
a play gate. Password recovery is a separate scope and was not deferred by this
decision. Provider evaluation should retain a feasible future verification path;
verification delivery and enforcement are not first-release acceptance criteria.

### Google-first authentication comparison — 2026-11-19

Owner preference: begin by evaluating Google as the first social sign-in option.
Facebook can wait. Email/password remains in the requested account scope; this is
not a decision to make launch Google-only or to choose an auth vendor.

Current first-party evidence:

- [Convex authentication overview](https://docs.convex.dev/auth) supports Convex
  Auth and external OIDC providers including Clerk. Convex is the backend choice;
  identity can be hosted separately.
- [Convex Auth v2](https://docs.convex.dev/auth/convex-auth) is now documented as
  stable for React web apps, with Google OAuth and other providers. The v2 docs
  state third-party providers are currently free and warn pricing may change.
  Convex backend quotas still apply. Production Google credentials and callback
  configuration remain setup work.
- [V2 email/password](https://docs.convex.dev/auth/convex-auth/methods/email-password)
  requires email validation before sign-in. This is a known mismatch with the
  agreed unverified-email launch flow, not a reason to silently change that flow.
  Experimental React Native support also requires coordination with #140.
- [Clerk Hobby pricing](https://clerk.com/pricing) currently lists $0/month,
  50,000 monthly retained users per application, three dashboard seats and three
  social connections. Retained users are users returning at least one day after
  signup; this is neither concurrent players nor Convex function capacity. The
  listed Pro baseline is $20/month billed annually; upgrades are outside the
  present budget. Recheck billing/limit behavior before adopting a plan.
- [Clerk Google connection](https://clerk.com/docs/guides/configure/auth-strategies/social-connections/google)
  uses shared credentials in development, while production requires custom Google
  OAuth credentials. [The official Convex integration](https://clerk.com/docs/guides/development/integrations/databases/convex)
  documents ClerkProvider, ConvexProviderWithClerk and server-side identity access.
  This establishes an integration path, not a completed Fall implementation.

Research recommendation: compare two concrete paths in #143: Convex with Convex
Auth v2, and Convex with Clerk Hobby, both using Google first. Clerk is a reasonable
candidate when hosted account flows are useful; first verify its exact free-plan
email/password, deferred-verification, recovery, linking and native behavior. Convex
Auth keeps identity within the Convex stack but its documented verification policy
currently conflicts with the launch requirement. Resolve that mismatch explicitly;
do not drop email/password, enable paid services or choose a vendor without evidence.
The earlier backend comparison and $0 validation gates still apply.
