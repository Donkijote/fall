import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import bg from "@/assets/lobby/home_2.png";
import { getUiHands } from "@/infrastructure/adapters/handWithMeta";
import { Card } from "@/infrastructure/ui/components/card/Card";

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
    <div className="relative min-h-screen w-full">
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
                className="rounded-lg border-white/20 bg-white/10 px-3 py-2 text-text-primary hover:bg-white/15 cursor-pointer border transition"
              >
                <FontAwesomeIcon icon={faArrowLeft} size={"xs"} /> Back
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

        <div className={"pb-40 h-[100dvh] overflow-auto"}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1"
          >
            {list.map((hand, i) => (
              <motion.article
                key={hand.id}
                initial={{ y: 10, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 20,
                  delay: i * 0.02,
                }}
                className="group rounded-2xl border-white/10 bg-white/10 p-4 backdrop-blur-sm shadow-2xl relative overflow-hidden border"
              >
                <div
                  className="inset-0 pointer-events-none absolute opacity-0 transition group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(600px circle at var(--x,50%) var(--y,50%), rgba(255,209,102,0.08), transparent 60%)",
                  }}
                />
                <header className="mb-2 gap-3 flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {hand.name}
                  </h3>
                  <span className="border-white/20 bg-white/10 px-2 py-0.5 text-sm text-text-primary rounded-full border">
                    {hand.points} pts
                  </span>
                </header>

                {hand.description && (
                  <p className="mb-3 text-sm text-text-secondary">
                    {hand.description}
                  </p>
                )}

                {hand.example?.length ? (
                  <div className="mb-3 gap-2 flex">
                    {hand.example.map((c, idx) => (
                      <Card
                        key={c.suit + c.rank + idx}
                        rank={c.rank}
                        suit={c.suit}
                        size={"sm"}
                      />
                    ))}
                  </div>
                ) : null}

                <div className="gap-2 flex flex-wrap items-center">
                  {hand.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border-white/10 bg-white/5 px-2 py-0.5 text-xs text-text-secondary border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
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
