"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, X } from "lucide-react";

interface VipPopupProps {
  open: boolean;
  onClose: () => void;
}

export default function VipPopup({ open, onClose }: VipPopupProps) {
  const sparkles = Array.from({ length: 14 });

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D1B4E]/60 px-6"
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 10, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.55, duration: 0.7 }}
            className="relative w-full max-w-sm rounded-[28px] p-[3px]"
            style={{
              background:
                "linear-gradient(135deg, #7B2FF7, #F72585, #4CC9F0, #7B2FF7)",
              backgroundSize: "300% 300%",
              animation: "streakbuddy-holo 4s ease infinite",
            }}
          >
            <style>{`
              @keyframes streakbuddy-holo {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
            `}</style>

            {/* Sparkle burst */}
            {sparkles.map((_, i) => {
              const angle = (i / sparkles.length) * Math.PI * 2;
              const dist = 130 + (i % 3) * 20;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    x: Math.cos(angle) * dist,
                    y: Math.sin(angle) * dist,
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: i * 0.08,
                    repeatDelay: 1,
                  }}
                  className="pointer-events-none absolute left-1/2 top-1/2"
                >
                  <Sparkles size={14} color={i % 2 ? "#F72585" : "#4CC9F0"} />
                </motion.div>
              );
            })}

            <div className="relative rounded-[25px] bg-[#FFFBF0] px-6 py-8 text-center">
              <button
                onClick={onClose}
                aria-label="Close"
                className="absolute right-3 top-3 text-[#2D1B4E]/50 hover:text-[#2D1B4E]"
              >
                <X size={18} />
              </button>

              <motion.div
                animate={{ rotate: [0, -8, 8, -8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1 }}
                className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "linear-gradient(135deg,#7B2FF7,#F72585)" }}
              >
                <Crown size={32} color="white" />
              </motion.div>

              <h2 className="mb-1 font-[Baloo_2] text-2xl text-[#2D1B4E]">
                Level up to Pro!
              </h2>
              <p className="mb-5 text-sm text-[#6b6280]">
                Unlock streak freezes, unlimited habits, and cosmic confetti
                every time you don&apos;t break the chain.
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                className="w-full rounded-full py-3 font-[Baloo_2] text-base font-bold text-white"
                style={{
                  background: "linear-gradient(135deg,#7B2FF7,#F72585,#4CC9F0)",
                  backgroundSize: "200% 200%",
                }}
              >
                Go Pro ✨
              </motion.button>
              <button
                onClick={onClose}
                className="mt-3 text-sm text-[#9a91ad] hover:text-[#6b6280]"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

