import archive from "@/assets/rulebook/archive-landscape.webp";

export function ArchiveBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <img src={archive} alt="" width={1672} height={941} className="size-full object-cover" />
      <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-artwork-shadow/80 via-artwork-shadow/40 to-transparent lg:hidden" />
    </div>
  );
}
