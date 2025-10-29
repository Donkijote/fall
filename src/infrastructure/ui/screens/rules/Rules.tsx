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
    <div className="text-text-primary max-w-5xl px-4 relative mx-auto min-h-screen">
      <div className="inset-0 fixed -z-10">
        <div
          className="inset-0 absolute bg-cover mix-blend-overlay"
          style={{ backgroundImage: `url(${bg})` }}
        />
      </div>

      <div className="max-w-6xl px-4 py-10 mx-auto">
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 gap-4 rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-sm flex items-start justify-between border"
        >
          <div className={"gap-4 flex items-center"}>
            <button
              onClick={() => navigate(-1)}
              className="border-white/20 bg-white/10 px-3 py-2 text-text-primary hover:bg-white/15 goBack cursor-pointer rounded-full border transition"
            >
              <FontAwesomeIcon icon={faArrowLeft} size={"xs"} />
            </button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
                {RULES.hero.title}
              </h1>
              <p className="text-text-secondary mt-1">{RULES.hero.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="md:inline-flex rounded-xl border-white/10 bg-white/10 backdrop-blur px-3 py-1.5 text-sm text-text-primary hidden cursor-pointer items-center border"
            aria-label="Scroll to top"
          >
            How to use
          </button>
        </motion.div>

        <div className="xl:grid-cols-[1fr_320px] gap-6 grid grid-cols-1">
          <div>
            <div
              className="sm:grid-cols-4 xl:grid-cols-8 gap-2 grid w-full grid-cols-2"
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

            <div className="mt-4 xl:h-[calc(100vh-220px)] pr-1 h-[calc(100vh-260px)] overflow-y-auto">
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
