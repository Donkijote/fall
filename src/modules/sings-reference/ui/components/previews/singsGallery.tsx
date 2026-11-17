import { defaultSingsFilters, filterSings } from "../../../application/singsCatalog";
import { CombinationEntry } from "../catalog/CombinationEntry";

function CombinationPreview() {
  const combinations = filterSings(defaultSingsFilters);
  return (
    <ul aria-label="Sample combinations" className="grid gap-2">
      {[true, false].map((mandatory) => {
        const sing = combinations.find((combination) => combination.mandatory === mandatory);
        return sing && <CombinationEntry key={sing.id} sing={sing} query="" />;
      })}
    </ul>
  );
}

export const singsGallery = {
  title: "Sings reference",
  folder: "sings-reference",
  entries: [
    {
      name: "CombinationEntry",
      source: "src/modules/sings-reference/ui/components/catalog/CombinationEntry.tsx",
      variants: "Mandatory and optional Sings with example hands",
      usage: "Sings reference · combination results",
      Preview: CombinationPreview,
    },
  ],
};
