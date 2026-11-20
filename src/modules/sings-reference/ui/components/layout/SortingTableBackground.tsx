import desktop from "@/assets/sings-reference/desktop-landscape.webp";
import phoneLandscape from "@/assets/sings-reference/phone-landscape.webp";
import tabletLandscape from "@/assets/sings-reference/tablet-landscape.webp";

export function SortingTableBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <picture>
        <source media="(max-width: 1023px)" srcSet={phoneLandscape} />
        <source media="(max-aspect-ratio: 3/2)" srcSet={tabletLandscape} />
        <img src={desktop} alt="" width={1672} height={941} className="size-full object-cover" />
      </picture>
    </div>
  );
}
