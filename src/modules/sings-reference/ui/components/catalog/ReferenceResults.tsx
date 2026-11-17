import { ActionButton } from "@/components";

import type { SingResult } from "../../../application/singsCatalog";
import { CombinationEntry } from "./CombinationEntry";

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
      <div className={query.trim() && count ? "mt-3 text-sm text-artwork-foreground" : "sr-only"}>
        <p role="status" aria-atomic="true">
          {count
            ? `${count} ${count === 1 ? "combination" : "combinations"}`
            : "No combinations match your filters."}
        </p>
      </div>
      {count ? (
        <ul
          aria-label="Combinations"
          className="grid grid-cols-1 @2xl:grid-cols-2 @5xl:grid-cols-3 @min-[26rem]:@max-2xl:compact-landscape:grid-cols-2"
        >
          {results.map((sing) => (
            <CombinationEntry key={sing.id} sing={sing} query={query} />
          ))}
        </ul>
      ) : (
        <div
          data-sing-entry=""
          className="mt-4 grid justify-items-center gap-3 px-4 py-8 text-center text-artwork-foreground"
        >
          <p className="font-semibold">No combinations match your filters.</p>
          <p className="text-sm">Try another name or pattern, or reset the filters.</p>
          <ActionButton tone="outline" type="button" onClick={onReset}>
            Reset filters
          </ActionButton>
        </div>
      )}
    </>
  );
}
