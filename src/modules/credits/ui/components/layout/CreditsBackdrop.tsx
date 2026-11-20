import atelier from "@/assets/credits/atelier-landscape.webp";

export function CreditsBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <img src={atelier} alt="" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-artwork-shadow/25" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_100%_at_50%_50%,oklch(from_var(--artwork-shadow)_l_c_h/0.48)_0%,oklch(from_var(--artwork-shadow)_l_c_h/0.24)_55%,transparent_100%)]" />
    </div>
  );
}
