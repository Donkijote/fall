import type { ReactNode } from "react";

import { CardPlayFigure } from "@/components/cards/CardPlayFigure";

import { captureExample, type Chapter } from "../../../application/rulebookContent";
import { Glossary } from "./Glossary";
import { QuickStartLesson } from "./QuickStartLesson";
import { RuleSections } from "./RuleSections";
import { ScoringReference } from "./ScoringReference";
import { SingsSummary } from "./SingsSummary";

export function ChapterLesson({ chapter, singsLink }: { chapter: Chapter; singsLink: ReactNode }) {
  if (chapter.id === "quick-start") return <QuickStartLesson />;
  return (
    <div className="mt-6 space-y-7">
      <RuleSections items={chapter.items} />
      {chapter.id === "captures" && (
        <CardPlayFigure
          title="Same-rank capture"
          {...captureExample}
          caption="The 4 of cups captures the 4 of coins. The 7 of clubs and 11 of swords remain on the table."
        />
      )}
      {chapter.id === "sings" && <SingsSummary singsLink={singsLink} />}
      {chapter.id === "scoring" && <ScoringReference />}
      {chapter.id === "variations" && <Glossary />}
    </div>
  );
}
