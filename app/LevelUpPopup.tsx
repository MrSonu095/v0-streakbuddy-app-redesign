"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { useStreakStore } from "./streak-store";
import { playSound } from "./sound-engine"; // <-- Sound Engine Imported

const GRADIENT = "linear-gradient(135deg, #FF7A18 0%, #E63946 100%)";
const PARTICLE_COUNT = 14;

export default function LevelUpPopup() {
  const reward = useStreakStore((s) => s.pendingLevelUp);
  const level = useStreakStore((s) => s.level);
  const clearPendingLevelUp = useStreakStore((s) => s.clearPendingLevelUp);

  // --- 🎵 LEVEL UP SOUND TRIGGER ---
  useEffect(() => {
    if (reward) {
      playSound("levelup"); // Popup aate hi victory sound bajega!
    }
  }, [reward]);

  return (
    <AnimatePresence>
      {reward && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clearPendingLevelUp}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.6, y: 60, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.7, y: 40, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.7 }}
            className="relative w-full max-w-sm overflow-hidden rounded-[28px] bg-white p-6 text-center shadow-2xl"
          >
            {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
              const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
              const distance = 90 + Math.random() * 40;
              return (
                <motion.span
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, opacity: 0, scale: 0.4 }}
                  transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                  style={{ background: i % 2 === 0 ? "#FF7A18" : "#E63946" }}
                />
              );
            })}

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={clearPendingLevelUp}
              aria-label="Close"
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full"
              style={{ background: "#F0F0F2" }}
            >
              <X size={16} color="#18181B" />
            </motion.button>

            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.15, duration: 0.6 }}
              className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full text-4xl"
              style={{ background: GRADIENT }}
            >
              <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ duration: 0.8, delay: 0.5 }}>
                {reward.icon}
              </motion.span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-1 flex items-center justify-center gap-1 text-xs font-bold uppercase tracking-wide"
              style={{ color: "#E63946" }}
            >
              <Sparkles size={14} /> Level {level}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 }}
              className="mb-2 text-2xl font-extrabold"
              style={{ color: "#18181B" }}
            >
              Level Up!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-5 text-sm text-[#6b6b73]"
            >
              {reward.description}
            </motion.p>

            {reward.type === "theme" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="mb-5 h-10 w-full rounded-full"
                style={{ background: reward.value }}
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.45 }}
                className="mb-5 inline-block rounded-full px-4 py-1.5 text-sm font-bold text-white"
                style={{ background: GRADIENT }}
              >
                {reward.value}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearPendingLevelUp}
              className="w-full rounded-full py-3 font-bold text-white"
              style={{ background: GRADIENT }}
            >
              Awesome!
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}