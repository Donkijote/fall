import desktop from "@/assets/sings-reference/desktop-landscape.webp";
import phoneLandscape from "@/assets/sings-reference/phone-landscape.webp";
import phonePortrait from "@/assets/sings-reference/phone-portrait.webp";
import tabletLandscape from "@/assets/sings-reference/tablet-landscape.webp";
import tabletPortrait from "@/assets/sings-reference/tablet-portrait.webp";

export function SortingTableBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <picture>
        <source media="(max-aspect-ratio: 3/5)" srcSet={phonePortrait} />
        <source media="(orientation: portrait)" srcSet={tabletPortrait} />
        <source media="(orientation: landscape) and (max-height: 500px)" srcSet={phoneLandscape} />
        <source media="(max-aspect-ratio: 3/2)" srcSet={tabletLandscape} />
        <img src={desktop} alt="" width={1672} height={941} className="size-full object-cover" />
      </picture>
      <div className="absolute inset-0 bg-linear-to-b from-artwork-shadow/60 via-transparent to-artwork-shadow/20" />
    </div>
  );
}
