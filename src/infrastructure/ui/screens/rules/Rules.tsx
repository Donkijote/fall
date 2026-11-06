import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";

import bg from "@/assets/lobby/home_2.png";
import { RULES } from "@/domain/constants/rules";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SectionAccordion } from "./components/Accordion";
import { HintModal } from "./components/HintModal";
import { QuickRef } from "./components/QuickRef";
import { SingsGrid } from "./components/Sings";

export const RulesScreen = () => {
  const navigate = useNavigate();

  const sectionIds = useMemo(() => RULES.sections.map((s) => s.id), []);

  const [tab, setTab] = useState(sectionIds[0] ?? "overview");

  return (
    <div className="relative mx-auto min-h-screen max-w-5xl px-4 text-text-primary">
      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover mix-blend-overlay"
          style={{ backgroundImage: `url(${bg})` }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 shadow-sm backdrop-blur"
        >
          <div className={"flex items-center gap-4"}>
            <button
              onClick={() => navigate(-1)}
              className="goBack cursor-pointer rounded-full border border-white/20 bg-white/10 px-3 py-2 text-text-primary transition hover:bg-white/15"
            >
              <FontAwesomeIcon icon={faArrowLeft} size={"xs"} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                {RULES.hero.title}
              </h1>
              <p className="mt-1 text-text-secondary">{RULES.hero.subtitle}</p>
            </div>
          </div>
          <div className="hidden cursor-pointer items-center rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-text-primary backdrop-blur md:inline-flex">
            How to use
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
          <div>
            <div
              className="grid w-full grid-cols-2 gap-2 sm:grid-cols-4 xl:grid-cols-8"
              role="tablist"
            >
              {RULES.sections.map((s, i) => (
                <motion.button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  className={clsx(
                    "rounded-xl border-white/10 backdrop-blur px-3 py-2 text-sm text-text-primary cursor-pointer truncate border",
                    {
                      "bg-white/20": tab === s.id,
                      "bg-white/10": tab !== s.id,
                    },
                  )}
                  role="tab"
                  aria-selected={tab === s.id}
                  id={`tab-${s.id}`}
                  aria-controls={`panel-${s.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                    delay: i * 0.04,
                  }}
                >
                  {s.title}
                </motion.button>
              ))}
            </div>

            <div className="scrollbar-hide-y mt-4 h-[calc(100vh-300px)] overflow-y-auto pr-1 pb-28 md:pb-10 xl:h-[calc(100vh-220px)]">
              {RULES.sections.map((s) => (
                <div
                  key={s.id}
                  hidden={tab !== s.id}
                  className="space-y-3"
                  role="tabpanel"
                  id={`panel-${s.id}`}
                  aria-labelledby={`tab-${s.id}`}
                >
                  <SectionAccordion items={s.items} />
                  {s.id === "sings" ? <SingsGrid content={RULES} /> : null}
                </div>
              ))}
            </div>
          </div>

          <QuickRef content={RULES} />
        </div>
      </div>

      <HintModal />
    </div>
  );
};
