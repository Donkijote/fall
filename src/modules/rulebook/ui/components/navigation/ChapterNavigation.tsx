import { ChevronDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { chapters, type Chapter } from "../../../application/rulebookContent";

export function ChapterNavigation({
  chapter,
  searching,
  singsLink,
  backLink,
  onChoose,
}: {
  chapter: Chapter;
  searching: boolean;
  singsLink: ReactNode;
  backLink: ReactNode;
  onChoose: () => void;
}) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  function choose() {
    onChoose();
    if (disclosure.current) disclosure.current.open = false;
  }
  const links = (
    <nav aria-label="Rulebook chapters" className="space-y-1">
      {chapters.map((entry, index) => (
        <Link
          key={entry.id}
          to={chapterUrl(entry.id)}
          onClick={choose}
          aria-current={chapter.id === entry.id && !searching ? "page" : undefined}
          className="flex min-h-12 items-center gap-3 rounded-md border-l-4 border-transparent px-3 py-2.5 text-base text-artwork-foreground hover:bg-artwork-shadow/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring aria-[current=page]:border-gold aria-[current=page]:bg-gold/20 aria-[current=page]:font-semibold"
        >
          <span className="text-sm tabular-nums opacity-80">
            {String(index + 1).padStart(2, "0")}
          </span>
          {entry.title}
        </Link>
      ))}
    </nav>
  );
  return (
    <>
      <aside className="hidden h-fit space-y-6 text-artwork-foreground [text-shadow:0_1px_4px_var(--artwork-shadow)] lg:sticky lg:top-6 lg:row-start-2 lg:flex lg:min-h-[min(70dvh,700px)] lg:flex-col">
        <h2 className="px-3 font-heading text-xl font-bold uppercase">Contents</h2>
        {links}
        <div className="px-3">{singsLink}</div>
        <div className="mt-auto px-3 pt-8">{backLink}</div>
      </aside>
      <details
        ref={disclosure}
        className="rounded-md bg-artwork-shadow/90 p-3 text-artwork-foreground lg:hidden"
      >
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-md px-2 font-semibold focus-visible:outline-2 focus-visible:outline-ring">
          Chapters: {chapter.title}
          <ChevronDown aria-hidden="true" className="size-4" />
        </summary>
        {links}
        <div className="px-3">{singsLink}</div>
      </details>
    </>
  );
}
