import type { ReactNode, RefObject } from "react";

import { FramedCard } from "@/components";

import { useArticleMotion } from "../../../adapters/useArticleMotion";
import type { Chapter } from "../../../application/rulebookContent";
import { ChapterLesson } from "../chapters/ChapterLesson";
import { ChapterFooter } from "../navigation/ChapterFooter";
import { RuleSearchResults } from "../search/RuleSearchResults";

export function RulebookArticle({
  chapter,
  chapterIndex,
  query,
  onChoose,
  singsLink,
  articleRef,
}: {
  chapter: Chapter;
  chapterIndex: number;
  query: string;
  onChoose: () => void;
  singsLink: ReactNode;
  articleRef: RefObject<HTMLElement | null>;
}) {
  useArticleMotion(articleRef, chapter.id);
  return (
    <FramedCard className="min-w-0 gap-0 overflow-visible py-0 lg:col-start-2">
      <article
        ref={articleRef}
        aria-labelledby="chapter-heading"
        className="min-w-0 p-4 sm:p-7 xl:p-8"
      >
        {query.trim() ? (
          <RuleSearchResults query={query} chooseChapter={onChoose} />
        ) : (
          <>
            <p className="mb-2 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
              {String(chapterIndex + 1).padStart(2, "0")} / {chapter.title}
            </p>
            <h2
              id="chapter-heading"
              tabIndex={-1}
              className="scroll-mt-6 font-heading text-[clamp(1.65rem,2.8vw,2.7rem)] leading-tight font-bold uppercase outline-none"
            >
              {chapter.heading}
            </h2>
            <ChapterLesson chapter={chapter} singsLink={singsLink} />
            <ChapterFooter chapterIndex={chapterIndex} />
          </>
        )}
      </article>
    </FramedCard>
  );
}
