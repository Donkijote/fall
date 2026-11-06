import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { StorageKeys, StorageService } from "@/application/services/StorageService";

export const HintModal = () => {
  const [open, setOpen] = useState(() => !StorageService.get<boolean>(StorageKeys.FALL_RULES_SEEN));

  const dismiss = () => {
    StorageService.set<boolean>(StorageKeys.FALL_RULES_SEEN, true);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close modal backdrop"
            onClick={dismiss}
            data-testid="backdrop"
          />
          <motion.div
            className="absolute top-1/2 left-1/2 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
          >
            <div className="space-y-2">
              <div className="text-lg font-semibold text-text-primary">Welcome to Fall Rules</div>
              <div className="text-sm text-text-secondary">
                A fast, readable guide. Use the tabs above; expand items for examples.
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2">
                <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                  <div className="font-medium text-text-primary">Quick start</div>
                  <p className="text-sm text-text-secondary">
                    Go to <span className="font-medium text-text-primary">Setup</span> → Dealer
                    choices, then <span className="font-medium text-text-primary">Turn</span>.
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/10 p-3 backdrop-blur">
                  <div className="font-medium text-text-primary">Sings sheet</div>
                  <p className="text-sm text-text-secondary">
                    Open the Sings tab for patterns and points.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  className="cursor-pointer rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-sm text-text-primary backdrop-blur"
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
