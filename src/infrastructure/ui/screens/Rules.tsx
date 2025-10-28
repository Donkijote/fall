import { AnimatePresence, motion } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";

import bg from "@/assets/lobby/home_2.png";
import { RULES } from "@/domain/constants/rules";
import type { RuleItem, RulesContent } from "@/domain/entities/Rules";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Pill = ({ children }: PropsWithChildren) => (
  <span className="border-white/10 bg-white/10 backdrop-blur px-2 py-0.5 text-xs text-text-secondary inline-flex items-center rounded-full border">
    {children}
  </span>
);

type CalloutProps = { type: "info" | "tip" | "warning"; text: string };
const Callout = ({ type, text }: CalloutProps) => {
  const tone =
    type === "warning"
      ? "bg-amber-50/30 border-amber-200/40"
      : type === "tip"
        ? "bg-emerald-50/30 border-emerald-200/40"
        : "bg-sky-50/30 border-sky-200/40";
  return (
    <div
      className={`rounded-xl backdrop-blur px-3 py-2 text-sm text-text-primary border ${tone}`}
    >
      {text}
    </div>
  );
};

type SectionAccordionProps = { items: RuleItem[] };
const SectionAccordion = ({ items }: SectionAccordionProps) => {
  const allIds = useMemo(() => items.map((i) => i.id), [items]);
  const [open, setOpen] = useState<string[]>(allIds);
  useEffect(() => setOpen(allIds), [allIds]);
  const toggle = (id: string) =>
    setOpen((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  return (
    <div className="w-full">
      {items.map((it) => (
        <div
          key={it.id}
          className="rounded-2xl border-white/10 bg-white/10 backdrop-blur mb-2 shadow-sm overflow-hidden border"
        >
          <button
            className="px-4 py-3 font-medium text-text-primary flex w-full cursor-pointer items-center justify-between text-left"
            onClick={() => toggle(it.id)}
            aria-expanded={open.includes(it.id)}
            aria-controls={`acc-${it.id}`}
            id={`acc-btn-${it.id}`}
          >
            <span className="mr-2 truncate">{it.title}</span>
            <div className="gap-2 flex items-center">
              <div className="gap-1 flex">
                {it.badges?.map((b) => (
                  <Pill key={b}>{b}</Pill>
                ))}
              </div>
              <FontAwesomeIcon
                icon={open.includes(it.id) ? faChevronUp : faChevronDown}
                className="text-text-secondary"
              />
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open.includes(it.id) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                id={`acc-${it.id}`}
                aria-labelledby={`acc-btn-${it.id}`}
              >
                <div className="px-4 pb-4">
                  <p className="text-sm leading-relaxed text-text-primary">
                    {it.body}
                  </p>
                  {it.callouts?.length ? (
                    <div className="mt-3 space-y-2">
                      {it.callouts.map((c, idx) => (
                        <Callout key={idx} type={c.type} text={c.text} />
                      ))}
                    </div>
                  ) : null}
                  {it.examples?.length ? (
                    <div className="mt-3">
                      <div className="text-xs tracking-wide text-text-secondary mb-1 uppercase">
                        Example
                      </div>
                      <ul className="pl-5 text-sm space-y-1 text-text-primary list-disc">
                        {it.examples.map((e, i) => (
                          <li key={i}>{e}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

type QuickRefProps = { content: RulesContent };
const QuickRef = ({ content }: QuickRefProps) => {
  const { ranks } = content.scoring.fall;
  return (
    <div className="xl:block top-20 rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-lg sticky hidden h-fit border">
      <div className="text-base font-medium text-text-primary mb-2">
        Quick Reference
      </div>
      <div className="mb-3 text-text-primary">
        <div className="font-medium">Goal</div>
        <div>First to {content.scoring.goal} points</div>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-text-primary">
        <div className="font-medium mb-1">Fall points</div>
        <ul className="gap-x-4 gap-y-1 text-sm grid grid-cols-2">
          {Object.entries(ranks).map(([k, v]) => (
            <li key={k} className="flex justify-between">
              <span className="text-text-secondary">Rank {k}</span>
              <span className="font-medium">+{v}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-sm text-text-primary">
        <div className="font-medium mb-1">Clean Table</div>
        <div>+{content.scoring.cleanTable.points} (disabled in last round)</div>
      </div>
      <div className="bg-white/20 my-3 h-px" />
      <div className="text-sm text-text-primary">
        <div className="font-medium mb-1">Round quotas</div>
        <ul className="space-y-1">
          <li>
            1v1: {content.modeQuotas.duel.quota}{" "}
            <span className="text-text-secondary">
              (extras +{content.modeQuotas.duel.extraPointPerCard})
            </span>
          </li>
          <li>
            1v1v1: {content.modeQuotas.ffa3.quota}{" "}
            <span className="text-text-secondary">
              (dealer {content.modeQuotas.ffa3.dealerQuota})
            </span>
          </li>
          <li>
            2v2: {content.modeQuotas.teams2v2.quota}{" "}
            <span className="text-text-secondary">
              (extras +{content.modeQuotas.teams2v2.extraPointPerCard})
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

type SingsGridProps = { content: RulesContent };
const SingsGrid = ({ content }: SingsGridProps) => (
  <div className="rounded-2xl border-white/10 bg-white/10 backdrop-blur p-4 shadow-sm border">
    <div className="text-base font-medium text-text-primary mb-2">
      Sings ranking
    </div>
    <div className="md:grid-cols-2 xl:grid-cols-3 gap-3 grid grid-cols-1">
      {content.singsRanking.map((s) => (
        <div
          key={s.name}
          className="rounded-xl border-white/10 bg-white/10 backdrop-blur p-3 border"
        >
          <div className="flex items-center justify-between">
            <div className="font-medium text-text-primary">{s.name}</div>
            <Pill>{s.optional ? "Optional" : "Mandatory"}</Pill>
          </div>
          <div className="text-sm text-text-secondary mt-1">
            Pattern: {s.pattern}
          </div>
          <div className="text-sm mt-1 text-text-primary">
            Points: <span className="font-medium">{s.points}</span>
          </div>
          {s.notes ? (
            <div className="text-xs text-text-secondary mt-1">{s.notes}</div>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);

type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};
const Modal = ({ open, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="inset-0 fixed z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="inset-0 bg-black/40 absolute" onClick={onClose} />
        <motion.div
          className="max-w-md rounded-2xl border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl absolute top-1/2 left-1/2 w-[92vw] -translate-x-1/2 -translate-y-1/2 border"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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

      <Modal open={welcomeOpen} onClose={dismiss}>
        <div className="space-y-2">
          <div className="text-lg font-semibold text-text-primary">
            Welcome to Fall Rules
          </div>
          <div className="text-sm text-text-secondary">
            A fast, readable guide. Use the tabs above; expand items for
            examples.
          </div>
          <div className="gap-2 mt-2 grid grid-cols-1">
            <div className="rounded-xl border-white/10 bg-white/10 backdrop-blur p-3 border">
              <div className="font-medium text-text-primary">Quick start</div>
              <p className="text-text-secondary text-sm">
                Go to{" "}
                <span className="font-medium text-text-primary">Setup</span> →
                Dealer choices, then{" "}
                <span className="font-medium text-text-primary">Turn</span>.
              </p>
            </div>
            <div className="rounded-xl border-white/10 bg-white/10 backdrop-blur p-3 border">
              <div className="font-medium text-text-primary">Sings sheet</div>
              <p className="text-text-secondary text-sm">
                Open the Sings tab for patterns and points.
              </p>
            </div>
          </div>
          <div className="gap-2 pt-1 flex justify-end">
            <button
              className="rounded-xl border-white/10 bg-white/10 backdrop-blur px-3 py-1.5 text-sm text-text-primary cursor-pointer border"
              onClick={dismiss}
              aria-label="Close welcome modal"
            >
              Got it
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
