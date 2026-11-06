import { AnimatePresence, motion } from "framer-motion";
import { type MouseEvent, useEffect, useRef } from "react";

import bg from "@/assets/lobby/home_2.png";
import { getUiHands } from "@/infrastructure/adapters/handWithMeta";
import { SingsList } from "@/infrastructure/ui/components/singins/SingsList";

import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type SingsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SingsModal = ({ isOpen, onClose }: SingsModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const onBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onMouseDown={onBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inset-0 bg-black/20 fixed z-50 flex items-center justify-center backdrop-blur-[2px]"
        >
          <motion.div
            ref={panelRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
            className={
              "md:max-w-[95vw] lg:max-w-3xl xl:max-w-5xl rounded-2xl border-white/10 bg-white/10 shadow-2xl backdrop-blur-md relative w-[92vw] max-w-[min(1100px,95vw)] overflow-auto border"
            }
          >
            <div
              className="inset-0 absolute h-full bg-cover mix-blend-overlay"
              style={{
                backgroundImage: `url(${bg})`,
              }}
            />
            <div className={"scrollbar-hide-y h-[85dvh] overflow-y-auto"}>
              <div className="top-0 gap-4 border-white/10 bg-white/10 px-5 py-4 backdrop-blur-md sticky z-10 flex items-center justify-between border-b">
                <h3 className="text-text-primary text-lg font-semibold">
                  Sings (Combinations)
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="border-white/20 bg-white/10 px-2 py-1.5 text-text-primary hover:bg-white/15 cursor-pointer rounded-full border transition"
                >
                  <FontAwesomeIcon icon={faClose} />
                </button>
              </div>
              <div className="pb-20 pt-4 px-5">
                <SingsList sings={getUiHands()} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
