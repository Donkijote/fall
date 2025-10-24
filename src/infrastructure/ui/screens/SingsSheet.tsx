import { useMemo, useState } from "react";

import { getUiHands } from "@/infrastructure/adapters/handWithMeta";

export const SingsSheetScreen = () => {
  const [query, setQuery] = useState("");
  const [onlyMandatory, setOnlyMandatory] = useState(false);
  const [minPoints, setMinPoints] = useState<number | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getUiHands()
      .filter((h) => (onlyMandatory ? h.mandatory : true))
      .filter((h) => (minPoints ? h.points >= minPoints : true))
      .filter(
        (h) =>
          !q ||
          h.name.toLowerCase().includes(q) ||
          h.tags?.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  }, [query, onlyMandatory, minPoints]);

  return (
    <div className="p-4 max-w-2xl w-full">
      <div className="gap-2 mb-3 flex">
        <input
          className="rounded px-3 py-2 flex-1 border"
          placeholder="Search sings… (name or tag)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="rounded px-2 border"
          value={String(minPoints ?? "")}
          onChange={(e) =>
            setMinPoints(e.target.value ? Number(e.target.value) : null)
          }
        >
          <option value="">Min pts</option>
          <option value="2">≥ 2</option>
          <option value="5">≥ 5</option>
          <option value="8">≥ 8</option>
        </select>
        <label className="gap-2 text-sm flex items-center">
          <input
            type="checkbox"
            checked={onlyMandatory}
            onChange={(e) => setOnlyMandatory(e.target.checked)}
          />
          Mandatory only
        </label>
      </div>

      <ul className="space-y-3">
        {list.map((h) => (
          <li key={h.id} className="rounded-2xl p-3 border">
            <div className="flex items-center justify-between">
              <div className="gap-2 flex items-center">
                <h3 className="font-semibold">{h.name}</h3>
                {h.mandatory && (
                  <span className="text-xs px-2 py-0.5 rounded-full border">
                    Mandatory
                  </span>
                )}
              </div>
              <span className="text-sm px-2 py-0.5 rounded-full border">
                {h.points} pts
              </span>
            </div>
            {h.description && <p className="text-sm mt-1">{h.description}</p>}
            {h.tags?.length ? (
              <div className="gap-1 mt-2 flex flex-wrap">
                {h.tags.map((t) => (
                  <span key={t} className="text-xs rounded px-2 py-0.5 border">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
            {h.example?.length ? (
              <div className="mt-3 gap-2 flex">
                {h.example.map((c, i) => (
                  <div
                    key={c.rank + c.suit + i}
                    className="w-8 h-12 rounded text-xs bg-white grid place-items-center border"
                  >
                    {c.rank}
                    <span className="block text-[10px] opacity-70">
                      {c.suit[0].toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};
