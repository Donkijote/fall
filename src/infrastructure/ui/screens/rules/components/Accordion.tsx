import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import type { RuleItem } from "@/domain/entities/Rules";

import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Callout } from "./Callout";
import { Pill } from "./Pill";

type SectionAccordionProps = { items: RuleItem[] };

export const SectionAccordion = ({ items }: SectionAccordionProps) => {
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
                      {it.callouts.map((c, index) => (
                        <Callout
                          key={c.type + c.text + index}
                          type={c.type}
                          text={c.text}
                        />
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
                          <li key={e + i}>{e}</li>
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
