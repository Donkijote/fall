import { HAND_META } from "@/domain/rules/handMeta";
import { HANDS } from "@/domain/rules/hands";

export const minimumPointChoices = [2, 5, 8, 10] as const;

const catalog = HANDS.map(({ name, points, mandatory }) => {
  const id = name.toLowerCase().replaceAll(/\s+/g, "-");
  const meta = HAND_META[id];
  return {
    id,
    name,
    points,
    mandatory,
    pattern: meta?.description ?? "",
    example: meta?.example ?? [],
    tags: meta?.tags ?? [],
  };
}).sort((first, second) => second.points - first.points || first.name.localeCompare(second.name));

export type SingsFilters = {
  query: string;
  minPoints: number | null;
  onlyMandatory: boolean;
};

export const defaultSingsFilters: SingsFilters = {
  query: "",
  minPoints: null,
  onlyMandatory: false,
};

export function filterSings({ query, minPoints, onlyMandatory }: SingsFilters) {
  const term = query.trim().toLowerCase();
  return catalog.flatMap((sing) => {
    if ((onlyMandatory && !sing.mandatory) || (minPoints !== null && sing.points < minPoints)) {
      return [];
    }
    const matchingTags = term ? sing.tags.filter((tag) => tag.toLowerCase().includes(term)) : [];
    const matchesText = [sing.name, sing.pattern].some((text) => text.toLowerCase().includes(term));
    return matchesText || matchingTags.length ? [{ ...sing, matchingTags }] : [];
  });
}

export type SingResult = ReturnType<typeof filterSings>[number];
