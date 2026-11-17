import { cn } from "cn";
import { Fragment } from "react";

import cardHolder from "@/assets/sings-reference/combination-card-holder.webp";
import mandatoryBadge from "@/assets/sings-reference/combination-mandatory.webp";
import optionalBadge from "@/assets/sings-reference/combination-optional.webp";
import pointsBadge from "@/assets/sings-reference/combination-points.webp";
import { BronzeArrow } from "@/components";
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
    <li
      data-sing-entry={sing.id}
      className="relative flex min-w-0 flex-col gap-2 px-3 py-4 text-artwork-foreground @2xl:px-5 @2xl:py-5"
    >
      <BronzeArrow
        direction="down"
        tone="faded"
        className="absolute inset-y-2 start-0 hidden w-0.5 @2xl:@max-5xl:[li:not(:nth-child(2n+1))>&]:block @min-[26rem]:@max-2xl:compact-landscape:[li:not(:nth-child(2n+1))>&]:block @5xl:[li:not(:nth-child(3n+1))>&]:block"
      />
      <BronzeArrow
        tone="faded"
        className="absolute inset-x-2 bottom-0 h-0.5 [li:last-child>&]:hidden @2xl:@max-5xl:[li:nth-child(2n+1):nth-last-child(-n+2)>&]:hidden @min-[26rem]:@max-2xl:compact-landscape:[li:nth-child(2n+1):nth-last-child(-n+2)>&]:hidden @5xl:[li:nth-child(3n+1):nth-last-child(-n+3)>&]:hidden @5xl:[li:nth-child(3n+2):nth-last-child(-n+2)>&]:hidden"
      />
      <header className="relative grid min-h-(--points-size) place-items-center px-(--points-size) [--points-size:3.5rem] @2xl:[--points-size:4rem]">
        <div className="grid min-w-0 justify-items-center gap-1 self-center text-center">
          <h2 className="text-lg leading-tight wrap-break-word @2xl:text-xl @5xl:text-2xl">
            <MatchText text={sing.name} query={term} />
          </h2>
          <p
            className={cn(
              "relative isolate grid min-h-6 w-[clamp(4.5rem,17cqw,6rem)] place-items-center px-2 font-serif text-xs leading-none font-semibold",
              sing.mandatory
                ? "text-artwork-shadow portrait:min-w-24"
                : "text-artwork-foreground italic",
            )}
          >
            <img
              src={sing.mandatory ? mandatoryBadge : optionalBadge}
              alt=""
              className={cn(
                "pointer-events-none absolute inset-x-0 top-1/2 -z-10 w-full -translate-y-1/2",
                sing.mandatory ? "h-5" : "h-6",
              )}
            />
            <BronzeArrow
              tone="faded"
              className="absolute end-full me-1.5 hidden h-0.5 w-7 @min-[48rem]:block"
            />
            <span className="-translate-y-px">{sing.mandatory ? "Mandatory" : "Optional"}</span>
            <BronzeArrow
              tone="faded"
              direction="left"
              className="absolute start-full ms-1.5 hidden h-0.5 w-7 @min-[48rem]:block"
            />
          </p>
        </div>
        <p className="absolute end-0 top-0 isolate grid size-(--points-size) content-center justify-items-center font-[family-name:Times_New_Roman,Times,serif] leading-none text-gold lining-nums tabular-nums">
          <img
            src={pointsBadge}
            alt=""
            className="pointer-events-none absolute inset-0 -z-10 size-full"
          />
          <span className="text-[1.7rem] leading-[0.82] @2xl:text-[1.95rem]">{sing.points}</span>
          <span className="text-xs leading-none @2xl:text-sm">
            {sing.points === 1 ? "pt" : "pts"}
          </span>
        </p>
      </header>
      <div className="relative isolate mt-auto p-3 @2xl:p-4">
        <img
          src={cardHolder}
          alt=""
          className="pointer-events-none absolute inset-0 -z-10 size-full"
        />
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
