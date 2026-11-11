import { cn } from "cn";
import { Link } from "react-router";

import { CardPlayFigure } from "@/components/cards/CardPlayFigure";
import { RULES } from "@/domain/constants/rules";

import { chapterUrl } from "../../../adapters/rulebookRoutes";
import { captureExample, quickSteps } from "../../../application/rulebookContent";
import { linkClass } from "../navigation/rulebookStyles";
export function QuickStartLesson() {
  return (
    <>
      <p className="mt-3 text-base leading-relaxed">
        Be the first player or team to reach {RULES.scoring.goal} points. Capture cards and earn
        bonuses to get there.
      </p>
      <ol className="my-5 space-y-3">
        {quickSteps.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-3 text-sm leading-relaxed sm:text-base"
          >
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
              {index + 1}
            </span>
            <p>
              <strong>{step.title}</strong>
              <span aria-hidden="true"> — </span>
              {step.body}
            </p>
          </li>
        ))}
      </ol>
      <CardPlayFigure
        title="Match the rank"
        {...captureExample}
        caption="Play your 4 to take the table’s 4. The 7 and 11 stay."
      />
      <div className="mt-5 space-y-2">
        <p className="text-sm">
          <strong className="mr-3 tracking-wide uppercase">At a glance</strong>Goal:{" "}
          {RULES.scoring.goal} points · Hand: 3 cards · Deck: 40 cards
        </p>
        <Link
          className={cn(
            linkClass,
            "font-sans font-normal text-muted-foreground italic hover:text-foreground hover:no-underline",
          )}
          to={chapterUrl("scoring")}
        >
          See Scoring & winning for bonus points and card quotas.
        </Link>
      </div>
    </>
  );
}
