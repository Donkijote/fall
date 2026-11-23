export function TableBonusDecoration() {
  return (
    <>
      <span
        data-bonus-glow
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 -z-10 rounded-md bg-gold/15 opacity-0 shadow-[0_0_14px_2px_var(--gold)] blur-sm"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-md"
      >
        <span
          data-bonus-sheen
          className="absolute inset-y-0 left-1/4 w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-gold/70 to-transparent opacity-0"
        />
      </span>
      <span
        data-bonus-burst
        aria-hidden="true"
        className="pointer-events-none absolute -inset-1 rounded-md border border-gold/80 opacity-0 shadow-[0_0_16px_var(--gold)]"
      />
    </>
  );
}
