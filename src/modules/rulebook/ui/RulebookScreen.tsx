import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { HOME_PATH, SINGS_SHEETS } from "@/routes/Routes";

import { useRulebookRoute } from "../adapters/useRulebookRoute";
import { ArchiveBackground } from "./components/layout/ArchiveBackground";
import { RulebookArticle } from "./components/layout/RulebookArticle";
import { RulebookHeader } from "./components/layout/RulebookHeader";
import { ChapterNavigation } from "./components/navigation/ChapterNavigation";
import { linkClass } from "./components/navigation/rulebookStyles";

export function RulebookScreen() {
  const route = useRulebookRoute();
  const [query, setQuery] = useState("");
  const clearSearch = () => setQuery("");
  const singsLink = (
    <Link to={SINGS_SHEETS} state={route.singsReturnState} className={linkClass}>
      Sings reference
      <ExternalLink aria-hidden="true" className="size-4" />
    </Link>
  );
  const backLink = (
    <Link
      to={HOME_PATH}
      state={{ focusHelp: true }}
      className={`${linkClass} text-artwork-foreground`}
    >
      <ArrowLeft aria-hidden="true" className="size-4" />
      Back to Hall
    </Link>
  );
  return (
    <main
      ref={route.mainRef}
      onScroll={(event) => route.savePosition(event.currentTarget.scrollTop)}
      className="relative isolate h-dvh overflow-x-hidden overflow-y-auto overscroll-contain bg-background text-foreground"
    >
      <ArchiveBackground />
      <div className="relative mx-auto grid max-w-[1680px] gap-5 pt-[calc(1rem+var(--safe-area-top))] pr-[calc(1rem+var(--safe-area-right))] pb-[calc(1.5rem+var(--safe-area-bottom))] pl-[calc(1rem+var(--safe-area-left))] sm:gap-7 sm:px-8 lg:grid-cols-[minmax(15rem,0.29fr)_minmax(0,1fr)] lg:gap-x-12 lg:pt-[calc(2.5rem+var(--safe-area-top))] lg:pr-[calc(3rem+var(--safe-area-right))] lg:pl-[calc(3rem+var(--safe-area-left))]">
        <RulebookHeader query={query} onQueryChange={setQuery} backLink={backLink} />
        <ChapterNavigation
          chapter={route.chapter}
          searching={Boolean(query.trim())}
          singsLink={singsLink}
          backLink={backLink}
          onChoose={clearSearch}
        />
        <RulebookArticle
          chapter={route.chapter}
          chapterIndex={route.chapterIndex}
          articleRef={route.articleRef}
          query={query}
          onChoose={clearSearch}
          singsLink={singsLink}
        />
      </div>
    </main>
  );
}
