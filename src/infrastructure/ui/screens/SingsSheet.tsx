import { ArrowLeft } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { SelectTrigger, TextInput } from "@/components";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { getUiHands } from "@/infrastructure/adapters/handWithMeta";
import { SingsList } from "@/infrastructure/ui/components/singins/SingsList";
import { HOME_PATH } from "@/routes/Routes";

const pointOptions = [
  { value: "any", label: "Any points" },
  ...[2, 5, 8, 10].map((points) => ({ value: String(points), label: `≥ ${points}` })),
];

export const SingsSheetScreen = () => {
  const [query, setQuery] = useState("");
  const [onlyMandatory, setOnlyMandatory] = useState(false);
  const [minPoints, setMinPoints] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const rulesReturnTo =
    typeof location.state?.rulesReturnTo === "string" &&
    /^\/rules(?:\?|$)/.test(location.state.rulesReturnTo)
      ? location.state.rulesReturnTo
      : null;
  const canGoBack = typeof window.history.state?.idx === "number" && window.history.state.idx > 0;
  const list = useMemo(() => {
    const search = query.trim().toLowerCase();
    return getUiHands()
      .filter((hand) => !onlyMandatory || hand.mandatory)
      .filter((hand) => !minPoints || hand.points >= minPoints)
      .filter(
        (hand) =>
          !search ||
          hand.name.toLowerCase().includes(search) ||
          hand.tags?.some((tag) => tag.toLowerCase().includes(search)),
      )
      .sort(
        (first, second) => second.points - first.points || first.name.localeCompare(second.name),
      );
  }, [query, onlyMandatory, minPoints]);

  return (
    <main className="h-dvh overflow-y-auto bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8">
        <header className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            aria-label={
              rulesReturnTo ? "Back to How to play" : canGoBack ? "Go back" : "Back to Hall"
            }
            className="goBack transition-none"
            onClick={() =>
              rulesReturnTo
                ? navigate(rulesReturnTo, {
                    replace: true,
                    state: { rulebookPositionKey: location.state.rulesPositionKey },
                  })
                : canGoBack
                  ? navigate(-1)
                  : navigate(HOME_PATH)
            }
          >
            <ArrowLeft />
          </Button>
          <h1 className="font-heading text-2xl font-semibold">Sings (Combinations)</h1>
        </header>
        <Card>
          <CardContent className="flex flex-wrap items-end gap-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="search-sings">Search combinations</Label>
              <TextInput
                id="search-sings"
                placeholder="Search by name or tag…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="filter-min-points">Minimum points</Label>
              <Select
                items={pointOptions}
                value={String(minPoints ?? "any")}
                onValueChange={(value) =>
                  setMinPoints(value && value !== "any" ? Number(value) : null)
                }
              >
                <SelectTrigger id="filter-min-points">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {pointOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Label className="min-h-9 cursor-pointer" htmlFor="only-mandatory">
              <Checkbox
                id="only-mandatory"
                checked={onlyMandatory}
                onCheckedChange={setOnlyMandatory}
              />
              Mandatory only
            </Label>
          </CardContent>
        </Card>
        <SingsList sings={list} />
        {list.length === 0 && (
          <p role="status" className="py-12 text-center text-muted-foreground">
            No sings match your filters.
          </p>
        )}
      </div>
    </main>
  );
};
