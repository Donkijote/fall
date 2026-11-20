import { Fragment } from "react";

import { BronzeArrow } from "@/components";
import { CardFaces } from "@/components/cards/CardFaces";
import { DeclarationBadge } from "@/components/cards/DeclarationBadge";
import { PointsBadge } from "@/components/cards/PointsBadge";
import { ParchmentArtwork } from "@/components/surfaces/ParchmentArtwork";

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
    <li
      data-sing-entry={sing.id}
      className="relative flex min-w-0 flex-col gap-2 px-3 py-4 text-artwork-foreground @2xl:px-5 @2xl:py-5"
    >
      <BronzeArrow
        direction="down"
        tone="faded"
        className="absolute inset-y-2 start-0 hidden w-0.5 @min-[26rem]:@max-5xl:[li:not(:nth-child(2n+1))>&]:block @5xl:[li:not(:nth-child(3n+1))>&]:block"
      />
      <BronzeArrow
        tone="faded"
        className="absolute inset-x-2 bottom-0 h-0.5 [li:last-child>&]:hidden @min-[26rem]:@max-5xl:[li:nth-child(2n+1):nth-last-child(-n+2)>&]:hidden @5xl:[li:nth-child(3n+1):nth-last-child(-n+3)>&]:hidden @5xl:[li:nth-child(3n+2):nth-last-child(-n+2)>&]:hidden"
      />
      <header className="relative grid min-h-(--points-size) place-items-center px-(--points-size) [--points-size:3.5rem] @2xl:[--points-size:4rem]">
        <div className="grid min-w-0 justify-items-center gap-1 self-center text-center">
          <h2 className="text-lg leading-tight wrap-break-word @2xl:text-xl @5xl:text-2xl">
            <MatchText text={sing.name} query={term} />
          </h2>
          <DeclarationBadge mandatory={sing.mandatory}>
            <BronzeArrow
              tone="faded"
              className="absolute end-full me-1.5 hidden h-0.5 w-7 @min-[48rem]:block"
            />
            <BronzeArrow
              tone="faded"
              direction="left"
              className="absolute start-full ms-1.5 hidden h-0.5 w-7 @min-[48rem]:block"
            />
          </DeclarationBadge>
        </div>
        <PointsBadge points={sing.points} className="absolute end-0 top-0 size-(--points-size)" />
      </header>
      <div className="relative isolate mt-auto p-3 @2xl:p-4">
        <ParchmentArtwork />
        <CardFaces
          label={`${sing.name} example hand`}
          cards={sing.example}
          className="grid grid-cols-3 gap-3 [&_[role=img]]:w-full [&_[role=img]]:shadow-artwork-shadow/40"
        />
      </div>
      <p className="mx-auto max-w-[34ch] px-2 pb-1 text-center font-serif text-base leading-snug text-artwork-foreground italic">
        <MatchText text={sing.pattern} query={term} />
      </p>
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
    </li>
  );
}
