import type { ReactNode } from "react";

import { BronzeArrow } from "@/components";
import { CardFaces } from "@/components/cards/CardFaces";
import { DeclarationBadge } from "@/components/cards/DeclarationBadge";
import { PointsBadge } from "@/components/cards/PointsBadge";
import { ParchmentArtwork } from "@/components/surfaces/ParchmentArtwork";

import { singPointsLabel } from "../../../application/rulebookContent";
import { illustratedSings } from "../../../application/rulebookExamples";

export function SingsSummary({ singsLink }: { singsLink: ReactNode }) {
  return (
    <>
      <div className="@container">
        {illustratedSings.map((sing, index) => {
          const pointsLabel = singPointsLabel(sing.points);
          const specialPoints =
            typeof sing.points === "string"
              ? /^(\d+(?:–\d+)?) points(.*)$/.exec(sing.points)
              : null;
          const points = specialPoints ? specialPoints[1] : sing.points;
          const condition = specialPoints?.[2].trim();
          return (
            <section
              key={sing.name}
              className="relative grid items-center gap-4 py-5 @xl:grid-cols-[minmax(0,1fr)_minmax(14rem,21rem)] @xl:gap-6"
            >
              {index > 0 && (
                <BronzeArrow
                  tone="faded"
                  className="absolute inset-x-0 top-0 h-0.5 -translate-y-1/2"
                />
              )}
              <div className="grid min-w-0 gap-2">
                <div className="flex items-center justify-between gap-3">
                  <div className="grid min-w-0 justify-items-start gap-1">
                    <h3
                      id={`rule-sing-${index}`}
                      tabIndex={-1}
                      className="min-w-0 scroll-mt-6 text-lg leading-tight outline-none"
                    >
                      {sing.name} <span className="sr-only">{pointsLabel}</span>
                    </h3>
                    <DeclarationBadge mandatory={!sing.optional} className="w-24" />
                  </div>
                  {typeof sing.points === "number" || specialPoints ? (
                    <span aria-hidden="true">
                      <PointsBadge points={points} className="size-13 @2xl:size-13" />
                    </span>
                  ) : (
                    <span aria-hidden="true" className="text-sm text-gold">
                      {pointsLabel}
                    </span>
                  )}
                </div>
                <p className="text-sm leading-relaxed">{sing.description}</p>
                {condition && (
                  <p aria-hidden="true" className="text-sm text-gold">
                    {condition}
                  </p>
                )}
                {sing.notes && (
                  <p className="text-sm leading-relaxed text-muted-foreground">{sing.notes}</p>
                )}
              </div>
              <div className="relative isolate w-full max-w-[21rem] justify-self-center p-3">
                <ParchmentArtwork />
                <CardFaces
                  label={`${sing.name} example hand`}
                  cards={sing.example}
                  className="grid grid-cols-3 gap-2 [&_[role=img]]:w-full"
                />
              </div>
            </section>
          );
        })}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        See example hands and filter by points in the Sings reference.
      </p>
      {singsLink}
    </>
  );
}
