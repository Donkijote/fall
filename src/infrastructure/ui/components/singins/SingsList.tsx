import { motion } from "framer-motion";

import type { UiHand } from "@/infrastructure/adapters/handWithMeta";
import { Card } from "@/infrastructure/ui/components/card/Card";

export const SingsList = ({ sings }: { sings: Array<UiHand> }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="gap-4 sm:grid-cols-2 lg:grid-cols-3 grid grid-cols-1"
    >
      {sings.map((hand, i) => (
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
  );
};
