import type { ReactNode } from "react";

import type { Chapter } from "../../../application/rulebookContent";
import { captureIllustrations } from "./CaptureIllustrations";
import { Glossary } from "./Glossary";
import { QuickStartLesson } from "./QuickStartLesson";
import { RuleSections } from "./RuleSections";
import { scoringIllustrations } from "./ScoringIllustrations";
import { ScoringReference } from "./ScoringReference";
import { SingsSummary } from "./SingsSummary";

export function ChapterLesson({ chapter, singsLink }: { chapter: Chapter; singsLink: ReactNode }) {
  if (chapter.id === "quick-start") return <QuickStartLesson />;
  return (
    <div className="mt-6 space-y-7">
      <RuleSections
        items={chapter.items}
        illustrations={
          chapter.id === "captures"
            ? captureIllustrations()
            : chapter.id === "scoring"
              ? scoringIllustrations()
              : undefined
        }
      />
      {chapter.id === "sings" && <SingsSummary singsLink={singsLink} />}
      {chapter.id === "scoring" && <ScoringReference />}
      {chapter.id === "variations" && <Glossary />}
    </div>
  );
}
