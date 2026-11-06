import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  StorageKeys,
  StorageService,
} from "@/application/services/StorageService";

export const HintModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = StorageService.get<boolean>(StorageKeys.FALL_RULES_SEEN);
    if (!seen) setOpen(true);
  }, []);

  const dismiss = () => {
    StorageService.set<boolean>(StorageKeys.FALL_RULES_SEEN, true);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="inset-0 fixed z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="inset-0 bg-black/40 absolute"
            aria-label="Close modal backdrop"
            onClick={dismiss}
            data-testid="backdrop"
          />
          <motion.div
            className="max-w-md rounded-2xl border-white/10 bg-white/10 backdrop-blur p-5 shadow-xl absolute top-1/2 left-1/2 w-[92vw] -translate-x-1/2 -translate-y-1/2 border"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
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
                  <div className="font-medium text-text-primary">
                    Quick start
                  </div>
                  <p className="text-text-secondary text-sm">
                    Go to{" "}
                    <span className="font-medium text-text-primary">Setup</span>{" "}
                    → Dealer choices, then{" "}
                    <span className="font-medium text-text-primary">Turn</span>.
                  </p>
                </div>
                <div className="rounded-xl border-white/10 bg-white/10 backdrop-blur p-3 border">
                  <div className="font-medium text-text-primary">
                    Sings sheet
                  </div>
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
                  data-testid="got-it-button"
                >
                  Got it
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
