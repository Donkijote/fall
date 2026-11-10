import { Link } from "react-router";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { findRules } from "../../../application/rulebookContent";
export function RuleSearchResults({
  query,
  chooseChapter,
}: {
  query: string;
  chooseChapter: () => void;
}) {
  const results = findRules(query);
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
              className="block rounded-md py-4 focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="text-xs text-muted-foreground">{result.chapterTitle}</span>
              <h3 className="mt-1 text-base font-semibold text-foreground">{result.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{result.text}</p>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
