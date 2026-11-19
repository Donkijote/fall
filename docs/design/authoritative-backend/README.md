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
- Open: launch scope, longer-term product vision, provider, account model, social
  features, progression, economy, operating budget and rollout sequence.
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
our assumptions and measured results. No provider capability, current price or
Fall-specific performance result has been verified in this initial document.

Before a recommendation becomes final, specify the account and match data models,
command/event contracts, privacy boundaries, lifecycle, reward policy and rollout.
Use a representative two-client spike to resolve architectural risks rather than
assuming every requirement is satisfied by a platform's feature list.

Starting sources from the issue (not yet reviewed in this research):

- [Convex mutations and transactions](https://docs.convex.dev/functions/mutation-functions)
- [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)
- [Nakama authoritative multiplayer](https://heroiclabs.com/docs/nakama/concepts/multiplayer/authoritative/)

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

- [ ] Record the owner's product vision, launch priorities, future ideas and unresolved questions.
- [ ] Compare backend/auth candidates against agreed requirements with sources, tradeoffs and validation gaps.
- [ ] Document a justified architecture direction, data/command/event boundaries, progression policy and staged rollout; label provisional decisions explicitly.
- [ ] Create and link scoped research/spike and implementation follow-up issues with acceptance criteria and dependencies.
- [ ] Review the research with the owner and reconcile issue/PR checklists before handoff.

## Discussion record

2026-11-19: Owner narrowed #129 from backend implementation to collaborative
research and planning. Initial question asks for the overall player experience and
future ambitions. Product requirements and provider decisions are pending answers.
