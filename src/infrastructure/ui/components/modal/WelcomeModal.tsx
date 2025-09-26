import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import {
  StorageKeys,
  StorageService,
} from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";

export const WelcomeModal = () => {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!username.trim()) return;

    const user: User = {
      id: uuidv4(),
      name: "",
      username: username.trim(),
      email: "",
      avatar: "",
    };

    StorageService.set(StorageKeys.FALL_USER, user);
    setIsOpen(false);
  };

  useEffect(() => {
    const stored = StorageService.get(StorageKeys.FALL_USER);
    if (!stored) {
      setIsOpen(true);
    }
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="inset-0 bg-black/60 backdrop-blur-sm fixed z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="max-w-md rounded-2xl border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md relative w-[90%] border"
          >
            <div className="mb-6 flex justify-center">
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-6xl"
              >
                🃏
              </motion.div>
            </div>

            <h2 className="mb-2 text-2xl font-bold text-white text-center">
              Welcome to Fall!
            </h2>
            <p className="mb-6 text-white/70 text-center">
              Enter your username to get started.
            </p>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="mb-4 rounded-lg border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:ring-accent-gold w-full border focus:ring-2 focus:outline-none"
            />

            <button
              onClick={handleSave}
              className="rounded-lg bg-accent-green px-4 py-2 font-semibold shadow-lg hover:bg-green-500 text-text-primary w-full cursor-pointer transition"
            >
              Save
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
