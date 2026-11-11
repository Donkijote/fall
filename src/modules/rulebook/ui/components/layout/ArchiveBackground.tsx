import archive from "@/assets/rulebook/archive-landscape.webp";
import phone from "@/assets/rulebook/archive-phone.webp";
import tablet from "@/assets/rulebook/archive-tablet.webp";

export function ArchiveBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <picture>
        <source media="(max-aspect-ratio: 3/5)" srcSet={phone} />
        <source media="(max-aspect-ratio: 5/4)" srcSet={tablet} />
        <img src={archive} alt="" width={1672} height={941} className="size-full object-cover" />
      </picture>
      <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-artwork-shadow/80 via-artwork-shadow/40 to-transparent lg:hidden" />
    </div>
  );
}
