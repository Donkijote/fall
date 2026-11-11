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

export function CombinationEntry({ sing, query }: { sing: SingResult; query: string }) {
  const term = query.trim().toLowerCase();
  return (
    <li className="relative flex min-w-0 flex-col gap-2 px-3 py-4 text-artwork-foreground before:absolute before:inset-y-2 before:left-0 before:hidden before:w-px before:bg-linear-to-b before:from-transparent before:via-gold/65 before:to-transparent after:absolute after:inset-x-2 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-gold/75 after:to-transparent @2xl:px-5 @2xl:py-5 @2xl:@max-5xl:[&:not(:nth-child(2n+1))]:before:block @min-[26rem]:@max-2xl:compact-landscape:[&:not(:nth-child(2n+1))]:before:block @5xl:[&:not(:nth-child(3n+1))]:before:block">
      <div className="flex items-start justify-between gap-2">
        <h2 className="pt-1 font-heading text-lg leading-tight font-bold @2xl:text-xl @5xl:text-2xl">
          <MatchText text={sing.name} query={term} />
        </h2>
        <p className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-base font-bold whitespace-nowrap text-primary-foreground tabular-nums">
          {sing.points} <span className="text-xs">{sing.points === 1 ? "pt" : "pts"}</span>
        </p>
      </div>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="rounded-md border border-gold/55 px-2 py-1 text-xs leading-none font-semibold">
          {sing.mandatory ? "Mandatory" : "Optional"}
        </p>
        <p className="text-sm leading-relaxed">
          <MatchText text={sing.pattern} query={term} />
        </p>
      </div>
      {sing.matchingTags.length > 0 && (
        <p className="mt-1 text-xs text-artwork-foreground">
          Matching tags:{" "}
          {sing.matchingTags.map((tag, index) => (
            <Fragment key={tag}>
              {index > 0 && ", "}
              <MatchText text={tag} query={term} />
            </Fragment>
          ))}
        </p>
      )}
      <CardFaces
        label={`${sing.name} example hand`}
        cards={sing.example}
        className="mt-auto grid grid-cols-3 gap-2 pt-2 [&_[role=img]]:w-full [&_[role=img]]:shadow-artwork-shadow/40"
      />
    </li>
  );
}
