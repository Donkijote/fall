import atelier from "@/assets/credits/atelier-landscape.webp";
import phone from "@/assets/credits/atelier-phone.webp";
import tablet from "@/assets/credits/atelier-tablet.webp";

export function CreditsBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <picture>
        <source media="(max-aspect-ratio: 3/5)" srcSet={phone} />
        <source media="(max-aspect-ratio: 5/4)" srcSet={tablet} />
        <img src={atelier} alt="" className="h-full w-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-artwork-shadow/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_100%_at_50%_50%,oklch(from_var(--artwork-shadow)_l_c_h/0.48)_0%,oklch(from_var(--artwork-shadow)_l_c_h/0.24)_55%,transparent_100%)]" />
    </div>
  );
}
