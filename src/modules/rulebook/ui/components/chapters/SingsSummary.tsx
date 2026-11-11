import type { ReactNode } from "react";

import { CardFaces } from "@/components/cards/CardFaces";

import { singPointsLabel } from "../../../application/rulebookContent";
import { illustratedSings } from "../../../application/rulebookExamples";

export function SingsSummary({ singsLink }: { singsLink: ReactNode }) {
  return (
    <>
      <div className="divide-y divide-border">
        {illustratedSings.map((sing, index) => (
          <section
            key={sing.name}
            className="grid items-center gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_auto]"
          >
            <div>
              <h3 id={`rule-sing-${index}`} tabIndex={-1} className="scroll-mt-6 outline-none">
                {sing.name}{" "}
                <span className="ml-2 inline-block rounded-full bg-primary px-3 py-1 text-sm text-primary-foreground">
                  {singPointsLabel(sing.points)}
                </span>
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {sing.pattern} · {sing.optional ? "Optional" : "Mandatory"}
              </p>
              {sing.notes && <p className="mt-1 text-sm">{sing.notes}</p>}
            </div>
            <CardFaces label={`${sing.name} example hand`} cards={sing.example} />
          </section>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        See example hands and filter by points in the Sings reference.
      </p>
      {singsLink}
    </>
  );
}
