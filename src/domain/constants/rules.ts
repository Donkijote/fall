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
          title: "The goal",
          body: "Fall is a Venezuelan game played with a 40-card Spanish deck. Play one-on-one, with three players competing individually, or in teams of two. The first player or team to reach 24 points wins.",
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
          body: "The four suits are coins, cups, swords and clubs. Each suit has ranks 1–7 and 10–12. There are no 8s or 9s.",
          badges: ["Required"],
        },
        {
          id: "dealer",
          title: "Choose the dealer",
          body: "Each player draws a card. Whoever draws the highest rank deals. The player to the dealer’s right goes first, and play moves counterclockwise.",
          examples: ["If players tie for the highest rank, only those players draw again."],
        },
        {
          id: "deal-choices",
          title: "Deal the hands and table",
          body: "Give each player three cards and reveal four cards on the table. The dealer chooses whether to deal the hands or the table first.\n\nBefore revealing the table cards, choose an ascending (1–2–3–4) or descending (4–3–2–1) pattern.",
          callouts: [
            {
              type: "warning",
              text: "If the four table cards match the chosen pattern, the dealer or their team earns a bonus. The point value has not been set.",
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
          title: "Check for a Sing",
          body: "If you have exactly three cards and they form a scoring combination, you may announce the Sing before you play.",
          badges: ["Timing"],
        },
        {
          id: "play",
          title: "Play one card",
          body: "Play one card from your hand. You can capture a card of the same rank and any following ranks in a cascade, or leave your played card face up on the table.",
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
          body: "Play a card that matches a rank on the table. Put the card you played and the cards you took into your capture pile.",
        },
        {
          id: "cascade",
          title: "Cascade",
          body: "After a match, take the cards that follow it in rank order. Stop at the first missing rank.",
          examples: [
            "If you match a 2 and the table also has a 3, 4 and 5, take that whole sequence.",
          ],
        },
        {
          id: "fall",
          title: "Fall",
          body: "When a player leaves a card on the table and the very next player captures it by matching its rank, that capture is a Fall.",
          callouts: [
            {
              type: "info",
              text: "The rank you match determines how many points the Fall earns. See Scoring & winning for the values.",
            },
          ],
        },
        {
          id: "clean",
          title: "Clean Table",
          body: "If your capture leaves no cards on the table, you earn 4 points. This bonus does not apply once the deck is empty.",
        },
      ],
    },
    {
      id: "sings",
      title: "Sings",
      items: [
        {
          id: "rules",
          title: "When to announce a Sing",
          body: "A Sing is a scoring combination of three cards. Announce it while you still hold all three, before you play. If several players announce Sings, the highest-ranking combination wins. If they tie, the player closest to the dealer wins.",
        },
      ],
    },
    {
      id: "scoring",
      title: "Scoring & End",
      items: [
        {
          id: "quotas",
          title: "Count your captured cards",
          body: "At the end of the round, earn 1 point for each captured card above your format’s quota. In 2v2, count both teammates’ capture piles together. See the quota table below.",
        },
        {
          id: "leftovers",
          title: "Award the remaining cards",
          body: "After the last cards are played, the last player who captured that round takes any cards left on the table. If no one captured that round, the dealer takes them.",
        },
        {
          id: "end",
          title: "Win the match",
          body: "The first player or team to reach 24 points wins immediately. If you agreed before the match that Three of a Kind is an instant win, announcing it also ends the match.",
        },
      ],
    },
    {
      id: "variations",
      title: "Variations",
      items: [
        {
          id: "opts",
          title: "Agree on variations before playing",
          body: "Decide whether to include Big House and Small House, and whether Three of a Kind scores 5 points or wins the match outright. The dealer may choose the deal order each round.",
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
          body: "Use these definitions to look up terms as you read.",
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
    {
      name: "Watchtower",
      pattern: "A pair and one card directly above or below it in rank",
      points: 7,
      mandatory: true,
    },
    { name: "Patrol", pattern: "Three ranks in a row", points: 6, mandatory: true },
    {
      name: "Three of a kind",
      pattern: "Three cards of the same rank",
      points: "5 points or an instant win",
      mandatory: true,
      notes: "The instant win applies only if agreed before the match.",
    },
    {
      name: "Pair + any",
      pattern: "A pair and any third card",
      points: "1–4 points",
      mandatory: true,
      notes:
        "Most pairs score 1 point. A pair of 10s scores 2, a pair of 11s scores 3, and a pair of 12s scores 4.",
    },
  ],
  glossary: [
    {
      term: "Canto / Sing",
      def: "A scoring combination of three cards that you announce before playing.",
    },
    {
      term: "Cascade",
      def: "A capture that continues through consecutive ranks after the first match.",
    },
    {
      term: "Fall",
      def: "A capture made by matching the rank of the card the previous player just left on the table.",
    },
    {
      term: "Clean Table",
      def: "A capture that clears the table. It earns 4 points unless the deck is empty.",
    },
    { term: "Capture pile", def: "The cards you or your team have collected through captures." },
  ],
};
