"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save } from "lucide-react";
import { useStreakStore, getSolidFromTheme } from "./streak-store";

export default function SettingsPopup({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { userName, userGoal, setProfile, activeTheme } = useStreakStore();
  const accent = getSolidFromTheme(activeTheme);

  // Yeh local states hain jo form mein dikhenge
  const [draftName, setDraftName] = useState(userName);
  const [draftGoal, setDraftGoal] = useState(userGoal);

  // Jab bhi popup khule, current data load karlo
  useEffect(() => {
    if (open) {
      setDraftName(userName);
      setDraftGoal(userGoal);
    }
  }, [open, userName, userGoal]);

  const handleSave = () => {
    if (draftName.trim()) {
      setProfile(draftName, draftGoal);
      onClose(); // Save karke popup band kar do
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="relative w-full max-w-[340px] overflow-hidden rounded-[24px] bg-white p-5 shadow-2xl"
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[20px] font-extrabold text-[#18181B]">Settings</h2>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F0F0F2] text-[#9CA3AF] hover:text-[#18181B]"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mb-6 space-y-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-[#9CA3AF]">Nickname</label>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-[14px] border-2 border-[#E9E9EC] px-3.5 py-2.5 text-[15px] focus:outline-none"
                  style={{ outlineColor: accent }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-bold text-[#9CA3AF]">Your Big Goal</label>
                <input
                  value={draftGoal}
                  onChange={(e) => setDraftGoal(e.target.value)}
                  placeholder="e.g. Get fit"
                  className="w-full rounded-[14px] border-2 border-[#E9E9EC] px-3.5 py-2.5 text-[15px] focus:outline-none"
                  style={{ outlineColor: accent }}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="flex w-full items-center justify-center gap-2 rounded-[14px] py-3 text-[15px] font-bold text-white"
              style={{ background: activeTheme }}
            >
              <Save size={18} /> Save Changes
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}