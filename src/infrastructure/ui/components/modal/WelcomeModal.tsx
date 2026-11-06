import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { StorageKeys, StorageService } from "@/application/services/StorageService";
import type { User } from "@/domain/entities/User";

export const WelcomeModal = () => {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(() => !StorageService.get<User>(StorageKeys.FALL_USER));

  const handleSave = () => {
    if (!username.trim()) return;

    const user: User = {
      id: uuidv4(),
      name: username.trim(),
      username: username.trim(),
      email: "",
      avatar: "",
    };

    StorageService.set(StorageKeys.FALL_USER, user);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
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
            className="relative w-[90%] max-w-md rounded-2xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md"
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

            <h2 className="mb-2 text-center text-2xl font-bold text-white">Welcome to Fall!</h2>
            <p className="mb-6 text-center text-white/70">Enter your username to get started.</p>

            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-white placeholder-white/40 focus:ring-2 focus:ring-accent-gold focus:outline-none"
            />

            <button
              onClick={handleSave}
              className="w-full cursor-pointer rounded-lg bg-accent-green px-4 py-2 font-semibold text-text-primary shadow-lg transition hover:bg-green-500"
            >
              Save
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
