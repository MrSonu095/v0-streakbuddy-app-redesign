"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Zap, Flame } from "lucide-react";
import { useStreakStore, getSolidFromTheme } from "./streak-store";
import { playSound } from "./sound-engine"; // <-- Sound Engine Imported

const AUTO_DISMISS_MS = 1400;

export default function XpToast() {
  const xpToast = useStreakStore((s) => s.xpToast);
  const activeTheme = useStreakStore((s) => s.activeTheme);
  const clearXpToast = useStreakStore((s) => s.clearXpToast);
  const accent = getSolidFromTheme(activeTheme);

  // --- 🎵 ACHIEVEMENT SOUND TRIGGER ---
  useEffect(() => {
    if (!xpToast) return;
    
    playSound("achievement"); // <-- Toast aate hi sparkle sound bajegi!
    
    const timer = setTimeout(() => clearXpToast(), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [xpToast, clearXpToast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[90] flex justify-center px-4">
      <AnimatePresence mode="popLayout">
        {xpToast && (
          <motion.div
            key={xpToast.id}
            initial={{ opacity: 0, y: -24, scale: 0.7, rotate: -4 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, y: -16, scale: 0.8, transition: { duration: 0.2 } }}
            transition={{ type: "spring", bounce: 0.55, duration: 0.5 }}
            className="flex items-center gap-2.5 rounded-full px-4 py-2.5 text-white shadow-lg"
            style={{ background: activeTheme }}
          >
            <motion.div
              initial={{ rotate: -20, scale: 0.5 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: "spring", bounce: 0.7, delay: 0.05 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/25"
            >
              <Zap size={15} fill="white" />
            </motion.div>

            <div className="flex flex-col leading-tight">
              <span className="text-[13px] font-extrabold">
                +{xpToast.xp} XP · {xpToast.message}
              </span>
              {xpToast.streak > 1 && (
                <span className="flex items-center gap-1 text-[11px] font-semibold opacity-90">
                  <Flame size={11} /> {xpToast.streak} day streak
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}