import { useId, type ReactNode } from "react";

import { ArrowDivider } from "../dividers/ArrowDivider";
import { ParchmentArtwork } from "./ParchmentArtwork";

export function ParchmentFigure({
  title,
  caption,
  children,
}: {
  title: string;
  caption: string;
  children: ReactNode;
}) {
  const id = useId();
  return (
    <figure
      aria-labelledby={id}
      className="relative isolate p-4 text-center text-artwork-shadow sm:p-5"
    >
      <ParchmentArtwork />
      <ArrowDivider className="mx-auto mb-5 max-w-2xl justify-center text-center">
        <span className="title-type text-lg uppercase sm:text-xl">{title}</span>
      </ArrowDivider>
      {children}
      <figcaption id={id} className="mt-5 text-sm leading-relaxed italic sm:text-base">
        {caption}
      </figcaption>
    </figure>
  );
}
