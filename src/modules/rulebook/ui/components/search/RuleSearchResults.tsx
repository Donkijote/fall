import { Fragment, useId } from "react";
import { Link } from "react-router";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { findRules, ruleMatchRanges, ruleSearchTerms } from "../../../application/rulebookContent";

function HighlightedRuleText({ text, terms }: { text: string; terms: readonly string[] }) {
  const ranges = ruleMatchRanges(text, terms);
  return (
    <>
      {ranges.map(({ start, end }, index) => (
        <Fragment key={start}>
          {text.slice(ranges[index - 1]?.end ?? 0, start)}
          <mark className="rounded-sm bg-gold px-0.5 text-artwork-shadow">
            {text.slice(start, end)}
          </mark>
        </Fragment>
      ))}
      {text.slice(ranges.at(-1)?.end ?? 0)}
    </>
  );
}
export function RuleSearchResults({
  query,
  chooseChapter,
}: {
  query: string;
  chooseChapter: () => void;
}) {
  const results = findRules(query);
  const terms = ruleSearchTerms(query);
  const resultId = useId();
  return (
    <>
      <h2
        id="chapter-heading"
        tabIndex={-1}
        className="font-heading text-2xl font-bold outline-none"
      >
        Find a rule
      </h2>
      <p role="status" className="mt-3 text-sm text-muted-foreground">
        {results.length
          ? `${results.length} results for “${query.trim()}”`
          : `No rules found for “${query.trim()}”. Try a rank, combination, or rule name.`}
      </p>
      <ul className="mt-5 divide-y divide-border">
        {results.map((result, index) => (
          <li key={`${result.chapter}-${result.id ?? index}`}>
            <Link
              to={chapterUrl(result.chapter, result.id)}
              onClick={chooseChapter}
              aria-label={`${result.chapterTitle} ${result.title}`}
              aria-describedby={`${resultId}-${index}`}
              className="block rounded-md py-4 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="text-xs text-muted-foreground">
                <HighlightedRuleText text={result.chapterTitle} terms={terms} />
              </span>
              <h3 className="mt-1 text-base font-semibold text-foreground">
                <HighlightedRuleText text={result.title} terms={terms} />
              </h3>
              <p
                id={`${resultId}-${index}`}
                className="mt-1 text-sm leading-relaxed text-muted-foreground"
              >
                <HighlightedRuleText text={result.text} terms={terms} />
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
