import { useId } from "react";
import type { ReactNode } from "react";

import { BronzeArrow } from "@/components";

export function CreditSection({ title, children }: { title: string; children: ReactNode }) {
  const id = useId();
  return (
    <section aria-labelledby={id} className="py-10 sm:py-16">
      <BronzeArrow tone="faded" className="mx-auto mb-10 h-0.5 w-full sm:mb-16" />
      <h2
        id={id}
        className="mb-7 text-xl font-normal tracking-[0.16em] text-gold uppercase sm:text-2xl"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
