import type { RulesContent } from "@/domain/entities/Rules";

export const RULES: RulesContent = {
  hero: {
    title: "Fall — Rules",
    subtitle: "Venezuelan 40-card Spanish-deck game. First to 24 points wins.",
  },
  sections: [
    {
      id: "overview",
      title: "Overview",
      items: [
        {
          id: "what",
          title: "What is Fall",
          body: "Traditional Venezuelan card game using the 40-card Spanish deck. Modes: 1v1, 1v1v1, 2v2. Goal: reach 24 points.",
          badges: ["Quick Start"],
        },
      ],
    },
    {
      id: "setup",
      title: "Setup",
      items: [
        {
          id: "deck",
          title: "Deck",
          body: "40 cards (suits: golds, cups, spades, sticks). Ranks: 1–7, 10–12.",
          badges: ["Required"],
        },
        {
          id: "dealer",
          title: "Choose the dealer",
          body: "Each player draws 1; highest is dealer. Play proceeds counter-clockwise (right of dealer starts).",
          examples: ["If there’s a tie, redraw among tied players."],
        },
        {
          id: "deal-choices",
          title: "Dealer choices",
          body: "Deal order: players first (3 each, then table) or table first (table, then 3 each). Table pattern: ascending (1–2–3–4) or descending (4–3–2–1); reveal 4 cards.",
          callouts: [
            {
              type: "warning",
              text: "If the revealed table matches the chosen pattern, the dealer/team gains a pattern bonus (points TBD).",
            },
          ],
        },
      ],
    },
    {
      id: "turn",
      title: "Turn",
      items: [
        {
          id: "announce",
          title: "Announce a sing (if eligible)",
          body: "If you hold exactly 3 cards, you may announce a qualifying canto before playing.",
          badges: ["Timing"],
        },
        {
          id: "play",
          title: "Play one card",
          body: "Either capture (same-rank; may cascade) or throw (leave it on the table).",
        },
      ],
    },
    {
      id: "captures",
      title: "Captures",
      items: [
        {
          id: "same-rank",
          title: "Same-rank capture",
          body: "Play a card to take table card(s) of the same rank; played card + captured cards go to your capture pile.",
        },
        {
          id: "cascade",
          title: "Cascade",
          body: "If the captured card continues a face-up sequence (e.g., you take a 2 and table shows 3,4,5…), you take the whole chain.",
        },
        {
          id: "fall",
          title: "Special — Fall",
          body: "If a player throws a card and the next player immediately captures that exact rank, it’s a Fall.",
          callouts: [
            { type: "info", text: "Scoring varies by rank (see Scoring)." },
          ],
        },
        {
          id: "clean",
          title: "Clean Table",
          body: "If your capture empties the table, gain +4 points — except in the last round (when the deck is empty).",
        },
      ],
    },
    {
      id: "sings",
      title: "Sings (Cantos)",
      items: [
        {
          id: "rules",
          title: "How sings work",
          body: "Announce only with 3 cards in hand before playing. If multiple players announce, highest-ranking sing wins; ties go to the player closest to the dealer.",
        },
      ],
    },
    {
      id: "scoring",
      title: "Scoring & End",
      items: [
        {
          id: "quotas",
          title: "Round quotas & extras",
          body: "1v1: count to 20; extras +1 each. 1v1v1: each to 12, dealer to 13; extras +1 each. 2v2: team to 20; extras +1 each.",
        },
        {
          id: "leftovers",
          title: "Last-round leftovers",
          body: "If anyone captured this round, the last capturer takes table leftovers; otherwise the dealer takes them.",
        },
        {
          id: "end",
          title: "End of game",
          body: "First player/team to 24 points wins immediately. Three of a kind may be instant win if agreed.",
        },
      ],
    },
    {
      id: "variations",
      title: "Variations",
      items: [
        {
          id: "opts",
          title: "Pre-game agreements",
          body: "Enable Big/Small House; set Three of a kind to 5 points or instant win; dealer may choose deal style each round.",
        },
      ],
    },
    {
      id: "glossary",
      title: "Glossary",
      items: [
        {
          id: "defs",
          title: "Key terms",
          body: "Canto/Sing, Cascade, Fall, Clean Table, Capture pile.",
        },
      ],
    },
  ],
  modeQuotas: {
    duel: { quota: 20, extraPointPerCard: 1 },
    ffa3: { quota: 12, dealerQuota: 13, extraPointPerCard: 1 },
    teams2v2: { quota: 20, extraPointPerCard: 1 },
  },
  scoring: {
    fall: {
      base: "Fall points by rank",
      ranks: { "1-7": 1, "10": 2, "11": 3, "12": 4 },
    },
    cleanTable: { points: 4, disabledWhen: "lastRound" },
    goal: 24,
  },
  singsRanking: [
    { name: "Big House", pattern: "12–12–1", points: 12, optional: true },
    { name: "Small House", pattern: "11–11–1", points: 10, optional: true },
    { name: "Register", pattern: "12–11–1", points: 8, mandatory: true },
    { name: "Watchtower", pattern: "x–x–(x±1)", points: 7, mandatory: true },
    { name: "Patrol", pattern: "3 consecutive", points: 6, mandatory: true },
    {
      name: "Three of a kind",
      pattern: "x–x–x",
      points: "5 or instant",
      mandatory: true,
    },
    {
      name: "Pair + any",
      pattern: "x–x–y",
      points: "1 (10=2,11=3,12=4)",
      mandatory: true,
    },
  ],
  glossary: [
    {
      term: "Canto / Sing",
      def: "A 3-card scoring pattern announced before playing.",
    },
    {
      term: "Cascade",
      def: "Chain capture of sequential table cards after a same-rank capture.",
    },
    {
      term: "Fall",
      def: "Immediate same-rank capture of a just-thrown card by the next player.",
    },
    {
      term: "Clean Table",
      def: "Capture that empties the table; +4 except in last round.",
    },
    { term: "Capture pile", def: "Your/team’s stack of captured cards." },
  ],
};
