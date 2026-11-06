import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import bg from "@/assets/lobby/home_2.png";
import { getUiHands } from "@/infrastructure/adapters/handWithMeta";
import { SingsList } from "@/infrastructure/ui/components/singins/SingsList";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const SingsSheetScreen = () => {
  const [query, setQuery] = useState("");
  const [onlyMandatory, setOnlyMandatory] = useState(false);
  const [minPoints, setMinPoints] = useState<number | null>(null);

  const navigate = useNavigate();

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return getUiHands()
      .filter((hand) => (onlyMandatory ? hand.mandatory : true))
      .filter((hand) => (minPoints ? hand.points >= minPoints : true))
      .filter(
        (hand) =>
          !q ||
          hand.name.toLowerCase().includes(q) ||
          hand.tags?.some((t) => t.toLowerCase().includes(q)),
      )
      .sort((a, b) => b.points - a.points || a.name.localeCompare(b.name));
  }, [query, onlyMandatory, minPoints]);

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 h-full">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-accent-blue/20 blur-3xl" />
        <div className="absolute -right-24 -bottom-24 h-72 w-72 rounded-full bg-accent-gold/20 blur-3xl" />
        <div
          className="absolute inset-0 bg-cover mix-blend-overlay"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        />
        <div
          className="absolute inset-0 bg-black/40"
          style={{
            maskImage: "radial-gradient(70% 60% at 50% 40%, black 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-10">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl border border-white/10 bg-white/10 p-4 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="goBack cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-2 text-text-primary transition hover:bg-white/15"
              >
                <FontAwesomeIcon icon={faArrowLeft} size={"xs"} />
              </button>
              <h1 className="text-xl font-semibold text-text-primary">Sings (Combinations)</h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <input
                id={"search-sings"}
                className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-text-primary placeholder-text-secondary focus:ring-2 focus:ring-accent-gold/80 focus:outline-none"
                placeholder="Search by name or tag…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                id={"filter-min-points"}
                className="cursor-pointer rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-text-primary focus:ring-2 focus:ring-accent-gold/80 focus:outline-none"
                value={String(minPoints ?? "")}
                onChange={(e) => setMinPoints(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Min pts</option>
                <option value="2">≥ 2</option>
                <option value="5">≥ 5</option>
                <option value="8">≥ 8</option>
                <option value="10">≥ 10</option>
              </select>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-text-primary">
                <input
                  id={"only-mandatory"}
                  type="checkbox"
                  checked={onlyMandatory}
                  onChange={(e) => setOnlyMandatory(e.target.checked)}
                  className="cursor-pointer accent-accent-gold"
                />{" "}
                Mandatory only
              </label>
            </div>
          </div>
        </motion.div>

        <div className={"scrollbar-hide-y h-[100dvh] overflow-auto pb-80 md:pb-40"}>
          <SingsList sings={list} />
        </div>

        {list.length === 0 && (
          <div className="mx-auto mt-10 w-full max-w-xl rounded-2xl border border-white/10 bg-white/10 p-8 text-center text-text-secondary backdrop-blur-md">
            No sings match your filters.
          </div>
        )}
      </div>
    </div>
  );
};
