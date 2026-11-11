import { RULES } from "@/domain/constants/rules";
import type { RuleItem } from "@/domain/entities/Rules";

export type Chapter = {
  id: string;
  title: string;
  heading: string;
  items: RuleItem[];
};

const items = (...ids: string[]) =>
  RULES.sections.filter((section) => ids.includes(section.id)).flatMap((section) => section.items);

export const chapters: Chapter[] = [
  { id: "quick-start", title: "Quick start", heading: "Your first capture", items: [] },
  {
    id: "setup",
    title: "Setup & objective",
    heading: "Take your seat",
    items: items("overview", "setup"),
  },
  { id: "turn", title: "Your turn", heading: "Play one card", items: items("turn") },
  { id: "captures", title: "Captures", heading: "Read the table", items: items("captures") },
  {
    id: "sings",
    title: "Sings",
    heading: "Know your combinations",
    items: items("sings"),
  },
  {
    id: "scoring",
    title: "Scoring & winning",
    heading: "Every point counts",
    items: items("scoring"),
  },
  {
    id: "variations",
    title: "Variations & glossary",
    heading: "The finer details",
    items: items("variations", "glossary"),
  },
];

export const quickSteps = [
  {
    title: "Take your seat",
    body: "Choose a duel, a three-player free-for-all, or two teams of two.",
  },
  {
    title: "Read the table",
    body: "You get three cards. The dealer puts four cards face up on the table.",
  },
  {
    title: "Play one card",
    body: "Match the rank of a card on the table to capture it. If nothing matches, leave your card face up.",
  },
];

export const captureExample = {
  played: { rank: 4, suit: "cups" },
  table: [
    { rank: 4, suit: "coins" },
    { rank: 7, suit: "clubs" },
    { rank: 11, suit: "swords" },
  ],
  captured: [
    { rank: 4, suit: "cups" },
    { rank: 4, suit: "coins" },
  ],
} as const;

export type RuleResult = {
  chapter: string;
  chapterTitle: string;
  id?: string;
  title: string;
  text: string;
};

export function singPointsLabel(points: number | string) {
  return typeof points === "number" ? `${points} points` : points;
}

// Search indexes the same written rules and values rendered in the guide.
const searchEntries: RuleResult[] = chapters.flatMap((chapter) => [
  { chapter: chapter.id, chapterTitle: chapter.title, title: chapter.title, text: chapter.heading },
  ...chapter.items.map((item) => ({
    chapter: chapter.id,
    chapterTitle: chapter.title,
    id: item.id,
    title: item.title,
    text: [item.body, ...(item.examples ?? []), ...(item.callouts?.map((c) => c.text) ?? [])].join(
      " ",
    ),
  })),
]);
searchEntries.push(
  ...quickSteps.map((step) => ({
    chapter: "quick-start",
    chapterTitle: "Quick start",
    title: step.title,
    text: step.body,
  })),
  ...RULES.glossary.map((entry, index) => ({
    chapter: "variations",
    chapterTitle: "Variations & glossary",
    id: `term-${index}`,
    title: entry.term,
    text: entry.def,
  })),
  ...RULES.singsRanking.map((entry, index) => ({
    chapter: "sings",
    chapterTitle: "Sings",
    id: `sing-${index}`,
    title: entry.name,
    text: `${entry.pattern}. ${singPointsLabel(entry.points)}. ${entry.optional ? "Optional" : "Mandatory"}. ${entry.notes ?? ""}`,
  })),
  {
    chapter: "scoring",
    chapterTitle: "Scoring & winning",
    id: "fall-points",
    title: "Fall points by rank",
    text: Object.entries(RULES.scoring.fall.ranks)
      .map(([rank, points]) => `${rank}: ${points} points`)
      .join("; "),
  },
);

export function ruleSearchTerms(query: string) {
  return [...new Set(query.toLocaleLowerCase().split(/\s+/).filter(Boolean))];
}

export function ruleMatchRanges(text: string, terms: readonly string[]) {
  const normalized = text.toLocaleLowerCase();
  const ranges = terms
    .flatMap((term) => {
      if (!term) return [];
      const matches: { start: number; end: number }[] = [];
      for (
        let start = normalized.indexOf(term);
        start !== -1;
        start = normalized.indexOf(term, start + 1)
      ) {
        matches.push({ start, end: start + term.length });
      }
      return matches;
    })
    .sort((first, second) => first.start - second.start);

  const merged: typeof ranges = [];
  for (const range of ranges) {
    const previous = merged.at(-1);
    if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
    else merged.push(range);
  }
  return merged;
}

export function findRules(query: string): RuleResult[] {
  const terms = ruleSearchTerms(query);
  if (!terms.length) return [];
  return searchEntries.filter((entry) =>
    terms.every((term) =>
      `${entry.chapterTitle} ${entry.title} ${entry.text}`.toLocaleLowerCase().includes(term),
    ),
  );
}

export const fallRankValues = Object.entries(RULES.scoring.fall.ranks).sort(
  ([first], [second]) => Number.parseInt(first) - Number.parseInt(second),
);
