import frame from "@/assets/lobby/tavern-match/matching-card-frame.webp";

import "./TableBonusDecoration.css";

export function TableBonusDecoration() {
  return (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
      >
        <span
          data-bonus-card-shine
          className="absolute inset-y-0 left-1/4 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-gold/90 to-transparent opacity-0"
        >
          <span className="absolute inset-y-0 left-[40%] w-1/5 bg-artwork-foreground" />
        </span>
      </span>
      <span
        data-bonus-frame
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[12%] opacity-0"
      >
        <img
          data-card-decoration
          src={frame}
          alt=""
          loading="eager"
          decoding="async"
          className="absolute inset-0 size-full"
        />
        <span className="table-bonus-artwork-shine absolute inset-0 overflow-hidden">
          <span
            data-bonus-sheen
            className="absolute inset-y-0 left-1/4 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-artwork-foreground to-transparent opacity-0"
          />
        </span>
      </span>
    </>
  );
}
