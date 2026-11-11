import { Fragment } from "react";

import { CardFaces } from "@/components/cards/CardFaces";

import type { SingResult } from "../../../application/singsCatalog";

function MatchText({ text, query }: { text: string; query: string }) {
  const start = query ? text.toLowerCase().indexOf(query) : -1;
  if (start < 0) return text;
  const end = start + query.length;
  return (
    <>
      {text.slice(0, start)}
      <mark className="rounded-sm bg-gold text-artwork-shadow">{text.slice(start, end)}</mark>
      {text.slice(end)}
    </>
  );
}

export function CombinationRow({ sing, query }: { sing: SingResult; query: string }) {
  const term = query.trim().toLowerCase();
  return (
    <li className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-3 gap-y-3 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:gap-x-5 sm:py-5">
      <div className="col-start-1 row-start-1 min-w-0 sm:col-start-2">
        <h2 className="font-heading text-lg leading-tight font-bold sm:text-xl">
          <MatchText text={sing.name} query={term} />
        </h2>
        <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {sing.mandatory ? "Mandatory" : "Optional"}
        </p>
        <p className="mt-1 text-sm leading-relaxed">
          <MatchText text={sing.pattern} query={term} />
        </p>
        {sing.matchingTags.length > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            Matching tags:{" "}
            {sing.matchingTags.map((tag, index) => (
              <Fragment key={tag}>
                {index > 0 && ", "}
                <MatchText text={tag} query={term} />
              </Fragment>
            ))}
          </p>
        )}
      </div>
      <p className="col-start-2 row-start-1 justify-self-end rounded-full bg-primary px-3 py-1 text-base font-bold whitespace-nowrap text-primary-foreground tabular-nums sm:col-start-3 sm:text-lg">
        {sing.points} <span className="text-xs">{sing.points === 1 ? "pt" : "pts"}</span>
      </p>
      <CardFaces
        label={`${sing.name} example hand`}
        cards={sing.example}
        className="col-span-2 row-start-2 justify-center rounded-md bg-muted p-2 sm:col-span-1 sm:col-start-1 sm:row-start-1"
      />
    </li>
  );
}
