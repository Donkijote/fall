import { useEffect, useMemo, useState } from "react";

import bg from "@/assets/lobby/home_2.png";
import { RULES } from "@/domain/constants/rules";

import { SectionAccordion } from "./components/Accordion";
import { HintModal } from "./components/HintModal";
import { QuickRef } from "./components/QuickRef";
import { SingsGrid } from "./components/Sings";

export const RulesScreen = () => {
  const data = RULES;
  const sectionIds = useMemo(
    () => data.sections.map((s) => s.id),
    [data.sections],
  );
  const [tab, setTab] = useState(sectionIds[0] ?? "overview");
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  useEffect(() => {
    const k = "fall_rules_seen_v1";
    const seen = typeof window !== "undefined" && localStorage.getItem(k);
    if (!seen) setWelcomeOpen(true);
  }, []);
  const dismiss = () => {
    try {
      localStorage.setItem("fall_rules_seen_v1", "1");
    } catch {
      /* empty */
    }
    setWelcomeOpen(false);
  };

  return (
    <div className="text-text-primary relative min-h-screen">
      <div className="inset-0 fixed -z-10">
        <div
          className="inset-0 absolute bg-cover mix-blend-overlay"
          style={{ backgroundImage: `url(${bg})` }}
        />
      </div>

      <div className="max-w-6xl px-4 py-6 mx-auto">
        <div className="mb-6 gap-4 rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-sm flex items-start justify-between border">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-text-primary">
              {data.hero.title}
            </h1>
            <p className="text-text-secondary mt-1">{data.hero.subtitle}</p>
          </div>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="md:inline-flex rounded-xl border-white/10 bg-white/10 backdrop-blur px-3 py-1.5 text-sm text-text-primary hidden cursor-pointer items-center border"
            aria-label="Scroll to top"
          >
            How to use
          </button>
        </div>

        <div className="xl:grid-cols-[1fr_320px] gap-6 grid grid-cols-1">
          <div>
            <div
              className="sm:grid-cols-4 xl:grid-cols-8 gap-2 grid w-full grid-cols-2"
              role="tablist"
            >
              {data.sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setTab(s.id)}
                  className={`rounded-xl border-white/10 backdrop-blur px-3 py-2 text-sm truncate border ${tab === s.id ? "bg-white/20" : "bg-white/10"} text-text-primary cursor-pointer`}
                  role="tab"
                  aria-selected={tab === s.id}
                  id={`tab-${s.id}`}
                  aria-controls={`panel-${s.id}`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            <div className="mt-4 xl:h-[calc(100vh-220px)] pr-1 h-[calc(100vh-260px)] overflow-y-auto">
              {data.sections.map((s) => (
                <div
                  key={s.id}
                  hidden={tab !== s.id}
                  className="space-y-3"
                  role="tabpanel"
                  id={`panel-${s.id}`}
                  aria-labelledby={`tab-${s.id}`}
                >
                  <SectionAccordion items={s.items} />
                  {s.id === "sings" ? <SingsGrid content={data} /> : null}
                </div>
              ))}
            </div>
          </div>

          <QuickRef content={data} />
        </div>
      </div>

      <HintModal open={welcomeOpen} onClose={dismiss} />
    </div>
  );
};
