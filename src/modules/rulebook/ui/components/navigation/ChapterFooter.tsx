import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { ActionButton } from "@/components";
import { HOME_PATH } from "@/routes/Routes";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { chapters } from "../../../application/rulebookContent";
export function ChapterFooter({ chapterIndex }: { chapterIndex: number }) {
  return (
    <footer className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
      <p className="text-sm text-muted-foreground">
        Chapter {chapterIndex + 1} of {chapters.length}
      </p>
      <div className="flex max-w-full min-w-0 flex-wrap gap-2">
        {chapterIndex > 0 && (
          <ActionButton render={<Link to={chapterUrl(chapters[chapterIndex - 1].id)} />}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Previous
          </ActionButton>
        )}
        {chapterIndex < chapters.length - 1 ? (
          <ActionButton
            className="max-w-full text-left whitespace-normal"
            tone="primary"
            render={<Link to={chapterUrl(chapters[chapterIndex + 1].id)} />}
          >
            Next: {chapterIndex === 0 ? "Setup" : chapters[chapterIndex + 1].title}
            <ArrowRight aria-hidden="true" className="size-4" />
          </ActionButton>
        ) : (
          <ActionButton
            className="max-w-full text-left whitespace-normal"
            tone="primary"
            render={<Link to={HOME_PATH} state={{ focusHelp: true }} />}
          >
            Back to Hall
            <ArrowRight aria-hidden="true" className="size-4" />
          </ActionButton>
        )}
      </div>
    </footer>
  );
}
