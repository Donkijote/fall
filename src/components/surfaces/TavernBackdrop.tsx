import inn from "@/assets/lobby/tavern/inn-landscape.webp";
import innPortrait from "@/assets/lobby/tavern/inn-portrait.webp";

export function TavernBackdrop() {
  return (
    <picture aria-hidden="true" className="pointer-events-none absolute inset-0 block">
      <source media="(orientation: portrait)" srcSet={innPortrait} />
      <img src={inn} alt="" width={1672} height={941} className="size-full object-cover" />
    </picture>
  );
}
