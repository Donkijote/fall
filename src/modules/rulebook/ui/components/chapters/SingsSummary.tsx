import type { ReactNode } from "react";

import { RULES } from "@/domain/constants/rules";
export function SingsSummary({ singsLink }: { singsLink: ReactNode }) {
  return (
    <>
      <div className="divide-y divide-border">
        {RULES.singsRanking.map((sing, index) => (
          <section key={sing.name} className="py-3">
            <h3
              id={`rule-sing-${index}`}
              tabIndex={-1}
              className="scroll-mt-6 font-semibold outline-none"
            >
              {sing.name}{" "}
              <span className="ml-2 inline-block rounded-md bg-primary px-2 py-1 text-sm text-primary-foreground">
                {sing.points} points
              </span>
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {sing.pattern} · {sing.optional ? "Optional" : "Mandatory"}
            </p>
            {sing.notes && <p className="mt-1 text-sm">{sing.notes}</p>}
          </section>
        ))}
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Find illustrated hands and filter combinations in the Sings reference.
      </p>
      {singsLink}
    </>
  );
}
