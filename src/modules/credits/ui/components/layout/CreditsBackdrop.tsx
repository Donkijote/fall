import hall from "@/assets/lobby/card-hall/hall-landscape.webp";
import phone from "@/assets/lobby/card-hall/hall-phone.webp";
import tablet from "@/assets/lobby/card-hall/hall-tablet.webp";

export function CreditsBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <picture>
        <source media="(max-aspect-ratio: 3/5)" srcSet={phone} />
        <source media="(max-aspect-ratio: 5/4)" srcSet={tablet} />
        <img src={hall} alt="" className="h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-artwork-shadow/45" />
      <div className="absolute inset-y-0 left-1/2 w-full max-w-4xl -translate-x-1/2 bg-artwork-shadow/95 sm:bg-transparent sm:bg-[linear-gradient(to_right,transparent,var(--artwork-shadow)_12%,var(--artwork-shadow)_88%,transparent)]" />
    </div>
  );
}
