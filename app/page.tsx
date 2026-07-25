"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame,
  Plus,
  Pencil,
  Trash2,
  Check,
  Crown,
  Hand,
  CircleUserRound,
  Settings,
  Home as HomeIcon,
  BarChart3,
  User,
} from "lucide-react";
import { useStreakStore, type Habit } from "./streak-store";
import VipPopup from "./VipPopup";

// --- StreakBuddy premium palette ---
const ORANGE = "#FF6B35";
const RED = "#E63946";
const GRADIENT = "linear-gradient(135deg, #FF7A18 0%, #E63946 100%)";
const INK = "#18181B";
const MUTED = "#9CA3AF";
const BORDER = "#E9E9EC";
const BG = "#F7F7F8";
const CHIP = "#F0F0F2";

function HabitRow({
  habit,
  onToggle,
  onDelete,
  onEdit,
}: {
  habit: Habit;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.text);

  const commit = () => {
    onEdit(habit.id, draft);
    setEditing(false);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group mb-2.5 flex items-center gap-2.5 rounded-[18px] border-2 bg-white p-3"
      style={{ borderColor: habit.done ? "#FFB199" : BORDER }}
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => onToggle(habit.id)}
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full"
        style={{ background: habit.done ? GRADIENT : CHIP }}
      >
        {habit.done && <Check color="white" size={16} />}
      </motion.button>

      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="flex-1 rounded-[10px] border-2 px-2 py-1.5 text-[15px]"
          style={{ borderColor: ORANGE }}
        />
      ) : (
        <div className="min-w-0 flex-1">
          <div
            className="text-[15px] font-bold"
            style={{
              color: INK,
              textDecoration: habit.done ? "line-through" : "none",
              opacity: habit.done ? 0.5 : 1,
            }}
          >
            {habit.text}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: ORANGE }}>
            <Flame size={12} /> {habit.streak} day streak
          </div>
        </div>
      )}

      {editing ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={commit}
          className="rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold text-white"
          style={{ background: GRADIENT }}
        >
          Save
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setEditing(true)}
          aria-label="Edit habit"
          className="p-1 text-[#b0b0b8] opacity-100 md:opacity-0 md:group-hover:opacity-100"
        >
          <Pencil size={17} />
        </motion.button>
      )}

      <motion.button
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onDelete(habit.id)}
        aria-label="Delete habit"
        className="p-1 text-[#e0a0a8] opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <Trash2 size={17} />
      </motion.button>
    </motion.div>
  );
}

export default function StreakBuddyPage() {
  const [entered, setEntered] = useState(false);
  const [newText, setNewText] = useState("");
  const [showVip, setShowVip] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "analytics" | "profile">("home");
  const inputRef = useRef<HTMLInputElement>(null);

  const { habits, addHabit, deleteHabit, editHabit, toggleHabit } = useStreakStore();

  const handleAdd = () => {
    if (!newText.trim()) return;
    addHabit(newText);
    setNewText("");
    inputRef.current?.focus();
  };

  const tabs = [
    { key: "home" as const, label: "Home", icon: HomeIcon },
    { key: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { key: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      {/* Top App Bar */}
      <header
        className="fixed left-0 right-0 top-0 z-50 mx-auto flex h-14 max-w-md items-center justify-between border-b px-4"
        style={{ background: "rgba(255,255,255,0.92)", borderColor: BORDER, backdropFilter: "blur(8px)" }}
      >
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: CHIP }}
          aria-label="Profile"
        >
          <CircleUserRound size={20} color={INK} />
        </motion.button>

        <h1 className="text-[17px] font-extrabold" style={{ color: INK }}>
          🔥 StreakBuddy
        </h1>

        <motion.button
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 items-center justify-center rounded-full"
          style={{ background: CHIP }}
          aria-label="Settings"
        >
          <Settings size={20} color={INK} />
        </motion.button>
      </header>

      <div className="mx-auto max-w-md px-4 pb-24 pt-20">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div key="login" exit={{ opacity: 0, scale: 0.9 }}>
              <motion.h1
                initial={{ y: -200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.6, duration: 0.9 }}
                className="mb-8 text-center font-[Baloo_2] text-4xl"
                style={{ color: INK }}
              >
                🔥 StreakBuddy
              </motion.h1>

              {["Nickname", "What's your big goal?"].map((label, i) => (
                <motion.div
                  key={label}
                  initial={{ x: -80, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.15, type: "spring", bounce: 0.4 }}
                  className="mb-3.5"
                >
                  <label className="text-[13px] font-bold" style={{ color: MUTED }}>
                    {label}
                  </label>
                  <input
                    className="mt-1 w-full rounded-[14px] border-2 px-3 py-2.5 text-[15px]"
                    style={{ borderColor: BORDER }}
                    placeholder={i === 0 ? "e.g. Sam" : "e.g. Read more"}
                  />
                </motion.div>
              ))}

              <div className="mt-6 flex items-center justify-center gap-2.5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEntered(true)}
                  className="rounded-full px-7 py-3 font-[Baloo_2] text-[17px] font-bold text-white"
                  style={{ background: GRADIENT }}
                >
                  Let's go
                </motion.button>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Hand color={ORANGE} size={26} />
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-[Baloo_2] text-[22px]" style={{ color: INK }}>
                  Your streaks
                </h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowVip(true)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white"
                  style={{ background: GRADIENT }}
                >
                  <Crown size={14} /> PRO
                </motion.button>
              </div>

              <div className="mb-4 flex gap-2">
                <input
                  ref={inputRef}
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                  placeholder="Add a new habit..."
                  className="flex-1 rounded-[14px] border-2 px-3.5 py-2.5 text-sm"
                  style={{ borderColor: BORDER }}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAdd}
                  aria-label="Add habit"
                  className="flex w-[42px] items-center justify-center rounded-[14px] text-white"
                  style={{ background: GRADIENT }}
                >
                  <Plus size={20} />
                </motion.button>
              </div>

              <AnimatePresence mode="popLayout">
                {habits.map((h) => (
                  <HabitRow
                    key={h.id}
                    habit={h}
                    onDelete={deleteHabit}
                    onEdit={editHabit}
                    onToggle={toggleHabit}
                  />
                ))}
              </AnimatePresence>

              {habits.length === 0 && (
                <p className="mt-8 text-center" style={{ color: MUTED }}>
                  No habits yet — add your first one above!
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <VipPopup open={showVip} onClose={() => setShowVip(false)} />
      </div>

      {/* Bottom Navigation Bar */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[64px] max-w-md items-center justify-around border-t px-2"
        style={{ background: "rgba(255,255,255,0.95)", borderColor: BORDER, backdropFilter: "blur(8px)" }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveTab(tab.key)}
              className="flex flex-1 flex-col items-center justify-center gap-0.5 py-1.5"
            >
              <Icon size={22} color={active ? ORANGE : MUTED} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold" style={{ color: active ? ORANGE : MUTED }}>
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}