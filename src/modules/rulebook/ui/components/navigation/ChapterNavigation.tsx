import gsap from "gsap";
import { ChevronDown } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Link } from "react-router";

import { useReducedMotion } from "@/infrastructure/ui/hooks/useGamePreferences";

import { useGSAP } from "@gsap/react";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { chapters, type Chapter } from "../../../application/rulebookContent";
import "./ChapterNavigation.css";

function ChapterLink({
  entry,
  index,
  current,
  onChoose,
}: {
  entry: Chapter;
  index: number;
  current: boolean;
  onChoose: () => void;
}) {
  const link = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    (_, contextSafe) => {
      const element = link.current;
      if (!element || reducedMotion) return;

      const hover = window.matchMedia("(any-hover: hover)");
      const revealAmount = () => {
        if (element.getAttribute("aria-current") === "page") return 1;
        if (element.matches(":focus-visible") || (hover.matches && element.matches(":hover"))) {
          return 0.72;
        }
        return 0;
      };

      let target = revealAmount();
      gsap.set(element, { "--chapter-reveal": target });

      const sync = contextSafe?.(() => {
        const next = revealAmount();
        if (next === target) return;

        const selecting = next === 1;
        const leavingSelection = target === 1;
        target = next;
        gsap.to(element, {
          "--chapter-reveal": next,
          duration: selecting ? 0.43 : leavingSelection ? 0.33 : 0.28,
          ease: selecting ? "back.out(1.25)" : "power2.out",
          overwrite: "auto",
        });
      });
      if (!sync) return;

      const events = ["pointerenter", "pointerleave", "focus", "blur"];
      events.forEach((event) => element.addEventListener(event, sync));
      const selection = new MutationObserver(sync);
      selection.observe(element, { attributeFilter: ["aria-current"] });

      return () => {
        selection.disconnect();
        events.forEach((event) => element.removeEventListener(event, sync));
      };
    },
    { dependencies: [reducedMotion], revertOnUpdate: true },
  );

  return (
    <Link
      ref={link}
      to={chapterUrl(entry.id)}
      onClick={onChoose}
      aria-current={current ? "page" : undefined}
      className="rulebook-chapter-link relative isolate flex min-h-11 items-center gap-3 rounded-md py-2 ps-7 pe-9 text-base text-artwork-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <span className="text-sm text-gold tabular-nums">{String(index + 1).padStart(2, "0")}</span>
      {entry.title}
    </Link>
  );
}

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
    <nav aria-label="Rulebook chapters" className="space-y-1.5">
      {chapters.map((entry, index) => (
        <ChapterLink
          key={entry.id}
          entry={entry}
          index={index}
          current={chapter.id === entry.id && !searching}
          onChoose={choose}
        />
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
