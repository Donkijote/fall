import { creditsInventory } from "../../../domain/inventory";
import { CreditLink, NoticeText } from "./CreditEntries";

export function SoftwareCredits() {
  return (
    <>
      <p className="mb-10 text-sm leading-relaxed">
        Libraries and tools used by Fall, with their authors, license terms and available notices.
      </p>
      <ul className="space-y-14 text-left">
        {creditsInventory.software.entries.map((entry) => (
          <li
            key={entry.id}
            className="min-w-0 [contain-intrinsic-size:auto_500px] [content-visibility:auto]"
          >
            <h3 className="text-lg font-normal break-words sm:text-xl">{entry.name}</h3>
            <p className="mt-2 text-sm">
              {entry.versions.join(", ")} · {entry.license}
            </p>
            <p className="mt-2 text-sm">{entry.creator}</p>
            <CreditLink href={entry.source}>Source</CreditLink>
            {entry.licenseUrl && <CreditLink href={entry.licenseUrl}>License</CreditLink>}
            {entry.notices.length ? (
              entry.notices.map((notice) => (
                <NoticeText key={notice.file}>{notice.text}</NoticeText>
              ))
            ) : (
              <p className="mt-3 text-sm">
                License notice awaiting verification. Please consult the upstream terms.
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}
