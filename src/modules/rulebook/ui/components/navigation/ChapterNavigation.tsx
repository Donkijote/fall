import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";

import { GuideLink } from "@/components/navigation/GuideLink";
import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

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
  const content = useRef<HTMLDivElement>(null);
  const chevron = useRef<SVGSVGElement>(null);
  const [expanded, setExpanded] = useState(false);
  const motion = useRef<gsap.core.Timeline | null>(null);
  const reduced = useReducedMotion();
  useGSAP(
    () => {
      motion.current?.kill();
      const details = disclosure.current;
      const panel = content.current;
      if (!details || !panel) return;
      if (expanded) details.open = true;
      // Closed links leave the focus order immediately, including during the exit.
      panel.inert = !expanded;
      if (reduced) {
        details.open = expanded;
        gsap.set(panel, { height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 });
        gsap.set(chevron.current, { rotation: expanded ? 180 : 0 });
        return;
      }
      const timeline = (motion.current = gsap.timeline({
        onComplete: () => {
          if (!expanded) details.open = false;
          if (expanded) gsap.set(panel, { height: "auto" });
        },
      }));
      timeline.to(
        panel,
        {
          height: expanded ? panel.scrollHeight : 0,
          opacity: expanded ? 1 : 0,
          duration: reduced ? 0 : 0.2,
          ease: "power2.out",
        },
        0,
      );
      timeline.to(
        chevron.current,
        { rotation: expanded ? 180 : 0, duration: reduced ? 0 : 0.18 },
        0,
      );
      return () => {
        timeline.kill();
      };
    },
    { dependencies: [expanded, reduced] },
  );
  function choose() {
    onChoose();
    setExpanded(false);
  }
  const links = (
    <nav
      aria-label="Rulebook chapters"
      className="space-y-1.5 [--guide-ink:var(--artwork-foreground)]"
    >
      {chapters.map((entry, index) => (
        <GuideLink
          key={entry.id}
          to={chapterUrl(entry.id)}
          onClick={choose}
          aria-current={chapter.id === entry.id && !searching ? "page" : undefined}
          className="flex items-center gap-3 py-2 ps-7 pe-9 text-base"
        >
          <span className="text-sm text-gold tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          {entry.title}
        </GuideLink>
      ))}
    </nav>
  );
  return (
    <>
      <aside className="hidden h-fit text-artwork-foreground [text-shadow:0_1px_4px_var(--artwork-shadow)] lg:sticky lg:top-6 lg:row-start-2 lg:flex lg:min-h-[min(70dvh,700px)] lg:flex-col">
        <div className="relative isolate space-y-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-4 -inset-y-24 -z-10 bg-artwork-shadow/85 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
          />
          <h2 className="px-3 text-xl uppercase">Contents</h2>
          {links}
          <div className="px-3">{singsLink}</div>
        </div>
        <div className="mt-auto px-3 pt-8">{backLink}</div>
      </aside>
      <details
        ref={disclosure}
        className="rounded-md bg-artwork-shadow/90 p-3 text-artwork-foreground lg:hidden"
      >
        <summary
          onClick={(event) => {
            event.preventDefault();
            setExpanded((value) => !value);
          }}
          aria-expanded={expanded}
          className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 rounded-md px-2 font-semibold focus-visible:outline-2 focus-visible:outline-ring"
        >
          Chapters: {chapter.title}
          <ChevronDown ref={chevron} aria-hidden="true" className="size-4" />
        </summary>
        <div ref={content} className="h-0 overflow-hidden opacity-0">
          {links}
          <div className="px-3">{singsLink}</div>
        </div>
      </details>
    </>
  );
}
