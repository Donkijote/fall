import type { ReactNode } from "react";

import type { Attribution } from "../../../domain/attribution";

export function CreditLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-11 items-center gap-1 rounded-md px-1 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {children}
      <span aria-hidden="true">↗</span>
    </a>
  );
}

export function NoticeText({ children }: { children: string }) {
  return (
    <pre className="mt-5 text-left font-sans text-sm leading-relaxed break-words whitespace-pre-wrap">
      {children}
    </pre>
  );
}

export function CreditEntries({
  entries,
  fullNotices = false,
}: {
  entries: Attribution[];
  fullNotices?: boolean;
}) {
  return (
    <ul className="space-y-12">
      {entries.map((entry) => (
        <li key={entry.id} className="min-w-0 space-y-3">
          <h3 className="text-xl font-normal sm:text-2xl">
            {entry.provenance === "third-party" && entry.id.startsWith("game-icons-")
              ? entry.creator
              : entry.name}
          </h3>
          {entry.id.startsWith("game-icons-") ? (
            <p className="text-sm leading-relaxed capitalize">{entry.name}</p>
          ) : (
            <p className="text-base">{entry.creator}</p>
          )}
          <p className="text-sm leading-relaxed">{entry.license}</p>
          <p className="text-sm leading-relaxed">{entry.modifications}</p>
          <div className="flex flex-wrap justify-center gap-x-5">
            <CreditLink href={entry.source}>Source</CreditLink>
            {entry.licenseUrl && <CreditLink href={entry.licenseUrl}>License</CreditLink>}
          </div>
          {fullNotices ? (
            <NoticeText>{entry.notice}</NoticeText>
          ) : (
            <p className="text-sm leading-relaxed">{entry.notice}</p>
          )}
        </li>
      ))}
    </ul>
  );
}
