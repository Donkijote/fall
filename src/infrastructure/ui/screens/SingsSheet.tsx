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
      <div className="inset-0 pointer-events-none absolute -z-10 h-full">
        <div className="-top-24 -left-24 h-72 w-72 bg-accent-blue/20 blur-3xl absolute rounded-full" />
        <div className="-bottom-24 -right-24 h-72 w-72 bg-accent-gold/20 blur-3xl absolute rounded-full" />
        <div
          className="inset-0 absolute bg-cover mix-blend-overlay"
          style={{
            backgroundImage: `url(${bg})`,
          }}
        />
        <div
          className="inset-0 bg-black/40 absolute"
          style={{
            maskImage:
              "radial-gradient(70% 60% at 50% 40%, black 60%, transparent 100%)",
          }}
        />
      </div>

      <div className="max-w-5xl gap-6 px-4 py-10 mx-auto flex flex-col">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="rounded-2xl border-white/10 bg-white/10 p-4 backdrop-blur-sm shadow-2xl border"
        >
          <div className="gap-3 flex flex-wrap items-center justify-between">
            <div className="gap-3 flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="border-white/20 bg-white/10 px-3 py-2 text-text-primary hover:bg-white/15 goBack cursor-pointer rounded-full border transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} size={"xs"} />
              </button>
              <h1 className="text-xl font-semibold text-text-primary">
                Sings (Combinations)
              </h1>
            </div>

            <div className="gap-2 flex flex-wrap items-center">
              <input
                id={"search-sings"}
                className="rounded-lg border-white/20 bg-white/10 px-3 py-2 text-text-primary placeholder-text-secondary focus:ring-accent-gold/80 border focus:ring-2 focus:outline-none"
                placeholder="Search by name or tag…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <select
                id={"filter-min-points"}
                className="rounded-lg border-white/20 bg-white/10 px-3 py-2 text-text-primary focus:ring-accent-gold/80 cursor-pointer border focus:ring-2 focus:outline-none"
                value={String(minPoints ?? "")}
                onChange={(e) =>
                  setMinPoints(e.target.value ? Number(e.target.value) : null)
                }
              >
                <option value="">Min pts</option>
                <option value="2">≥ 2</option>
                <option value="5">≥ 5</option>
                <option value="8">≥ 8</option>
                <option value="10">≥ 10</option>
              </select>
              <label className="gap-2 rounded-lg border-white/20 bg-white/10 px-3 py-2 text-text-primary flex cursor-pointer items-center border">
                <input
                  id={"only-mandatory"}
                  type="checkbox"
                  checked={onlyMandatory}
                  onChange={(e) => setOnlyMandatory(e.target.checked)}
                  className="accent-accent-gold cursor-pointer"
                />{" "}
                Mandatory only
              </label>
            </div>
          </div>
        </motion.div>

        <div
          className={"pb-80 md:pb-40 scrollbar-hide-y h-[100dvh] overflow-auto"}
        >
          <SingsList sings={list} />
        </div>

        {list.length === 0 && (
          <div className="mt-10 max-w-xl rounded-2xl border-white/10 bg-white/10 p-8 text-text-secondary backdrop-blur-md mx-auto w-full border text-center">
            No sings match your filters.
          </div>
        )}
      </div>
    </div>
  );
};
