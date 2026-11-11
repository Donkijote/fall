import { ActionButton } from "@/components";

import type { SingResult } from "../../../application/singsCatalog";
import { CombinationRow } from "./CombinationRow";

export function ReferenceResults({
  results,
  query,
  onReset,
}: {
  results: SingResult[];
  query: string;
  onReset: () => void;
}) {
  const count = results.length;
  return (
    <>
      <div className="mt-5 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3 text-sm text-muted-foreground">
        <p role="status" aria-atomic="true">
          {count
            ? `${count} ${count === 1 ? "combination" : "combinations"}`
            : "No combinations match your filters."}
        </p>
        {count > 1 && <span className="text-xs">Highest points first</span>}
      </div>
      {count ? (
        <ul aria-label="Combinations" className="divide-y divide-border">
          {results.map((sing) => (
            <CombinationRow key={sing.id} sing={sing} query={query} />
          ))}
        </ul>
      ) : (
        <div className="grid justify-items-center gap-3 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            Try another name or pattern, or reset the filters.
          </p>
          <ActionButton tone="outline" type="button" onClick={onReset}>
            Reset filters
          </ActionButton>
        </div>
      )}
    </>
  );
}
