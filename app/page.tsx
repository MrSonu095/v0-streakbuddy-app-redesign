"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import {
  Flame, Plus, Pencil, Trash2, Check, Crown, Hand,
  Settings, Home as HomeIcon, BarChart3, User, Sparkles, Trophy, Target, TrendingUp, GripVertical
} from "lucide-react";
import { useStreakStore, type Habit, type Reward, xpForNextLevel, DEFAULT_TITLE, getSolidFromTheme } from "./streak-store";
import VipPopup from "./VipPopup";
import LevelUpPopup from "./LevelUpPopup";
import XpToast from "./XpToast";
import SettingsPopup from "./SettingsPopup"; 
import { playSound } from "./sound-engine";
import { useAudio } from "../hooks/useAudio";
import { toast } from "sonner"; // <-- ADDED: Toast import for limits

// DATABASE SYNC FUNCTION IMPORT 
import { syncUserToDatabase } from "@/lib/sync-user";

const INK = "#18181B";
const MUTED = "#9CA3AF";
const BORDER = "#E9E9EC";
const BG = "#F7F7F8";
const CHIP = "#F0F0F2";
const WEEK_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function HabitRow({ habit, theme, accent, onToggle, onDelete, onEdit, onTap }: { habit: Habit; theme: string; accent: string; onToggle: (id: string) => void; onDelete: (id: string) => void; onEdit: (id: string, text: string) => void; onTap: () => Promise<void>; }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(habit.text);
  const commit = () => { onEdit(habit.id, draft); setEditing(false); };

  const handleToggleClick = async () => {
    if (!habit.done) {
      await onTap();
    }
    onToggle(habit.id);
  };

  return (
    <Reorder.Item
      value={habit}
      id={habit.id}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: 100 }}
      transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className="group mb-2.5 flex items-center gap-2.5 rounded-[18px] border-2 bg-white p-3 cursor-grab active:cursor-grabbing"
      style={{ borderColor: habit.done ? accent : BORDER }}
    >
      <div className="text-[#9CA3AF] opacity-40 hover:opacity-100 flex items-center">
         <GripVertical size={18} />
      </div>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={handleToggleClick}
        className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full"
        style={{ background: habit.done ? theme : CHIP }}
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
          style={{ borderColor: accent }}
        />
      ) : (
        <div className="min-w-0 flex-1">
          <div
            className="text-[15px] font-bold"
            style={{ color: INK, textDecoration: habit.done ? "line-through" : "none", opacity: habit.done ? 0.5 : 1 }}
          >
            {habit.text}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: accent }}>
            <Flame size={12} /> {habit.streak} day streak
          </div>
        </div>
      )}

      {editing ? (
        <motion.button onClick={commit} className="rounded-[10px] px-2.5 py-1.5 text-[13px] font-bold text-white" style={{ background: theme }}>
          Save
        </motion.button>
      ) : (
        <motion.button onClick={() => setEditing(true)} aria-label="Edit habit" className="p-1 text-[#b0b0b8] opacity-100 md:opacity-0 md:group-hover:opacity-100">
          <Pencil size={17} />
        </motion.button>
      )}

      <motion.button 
        onClick={() => { playSound("delete"); onDelete(habit.id); }}
        aria-label="Delete habit" 
        className="p-1 text-[#e0a0a8] opacity-100 md:opacity-0 md:group-hover:opacity-100"
      >
        <Trash2 size={17} />
      </motion.button>
    </Reorder.Item>
  );
}

function RewardCard({ reward, accent }: { reward: Reward; accent: string }) { 
  return (
    <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", bounce: 0.4 }} className="flex flex-col items-center gap-1.5 rounded-[16px] border-2 bg-white p-3 text-center" style={{ borderColor: BORDER }}>
      <div className="flex h-11 w-11 items-center justify-center rounded-full text-xl" style={{ background: reward.type === "theme" ? reward.value : CHIP }}>{reward.type === "theme" ? "" : reward.icon}</div>
      <div className="text-[12px] font-bold" style={{ color: INK }}>{reward.name}</div>
      <div className="text-[10px] font-bold uppercase tracking-wide" style={{ color: accent }}>Level {reward.level}</div>
    </motion.div>
  );
}

function ProfileTab({ theme, accent }: { theme: string; accent: string }) { 
  const { level, xp, unlockedRewards, userName, userGoal } = useStreakStore();
  const xpNeeded = xpForNextLevel(level);
  const progressPct = Math.min(100, Math.round((xp / xpNeeded) * 100));
  const currentTitle = [...unlockedRewards].reverse().find((r) => r.type === "title")?.value ?? DEFAULT_TITLE;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.3 }}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", bounce: 0.45 }} className="mb-5 rounded-[22px] p-5 text-center text-white" style={{ background: theme }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6, delay: 0.1 }} className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-3xl">
          {userName ? userName.charAt(0).toUpperCase() : "🔥"}
        </motion.div>
        <h2 className="text-2xl font-extrabold">{userName || "User"}</h2>
        {userGoal && <p className="mt-0.5 text-[13px] font-medium italic opacity-90">"{userGoal}"</p>}
        <div className="mt-3 flex items-center justify-center gap-1 text-[13px] font-bold uppercase tracking-wide opacity-90">
          Level {level} <Sparkles size={14} className="ml-1" /> {currentTitle}
        </div>
        <div className="mt-4 h-2.5 w-full overflow-hidden rounded-full bg-white/25">
          <motion.div className="h-full rounded-full bg-white" initial={{ width: 0 }} animate={{ width: `${progressPct}%` }} transition={{ type: "spring", bounce: 0.2, duration: 0.8 }} />
        </div>
        <div className="mt-1.5 text-[11px] font-bold opacity-90">{xp} / {xpNeeded} XP to Level {level + 1}</div>
      </motion.div>

      <h3 className="mb-2.5 text-[15px] font-extrabold" style={{ color: INK }}>Unlocked Rewards</h3>
      {unlockedRewards.length === 0 ? (
        <p className="mt-4 text-center text-sm" style={{ color: MUTED }}>Complete habits to start unlocking rewards!</p>
      ) : (
        <div className="grid grid-cols-3 gap-2.5">
          <AnimatePresence>{unlockedRewards.map((r) => <RewardCard key={`${r.level}-${r.name}`} reward={r} accent={accent} />)}</AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

function DayRing({ label, pct, isToday, theme, accent, delay }: { label: string; pct: number; isToday: boolean; theme: string; accent: string; delay: number; }) {
  const radius = 20; const circumference = 2 * Math.PI * radius; const offset = circumference - (pct / 100) * circumference;
  return (
    <motion.div initial={{ opacity: 0, y: 14, scale: 0.7 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.5, delay }} className="flex flex-col items-center gap-1.5">
      <div className="relative flex h-12 w-12 items-center justify-center">
        <svg width="48" height="48" viewBox="0 0 48 48" className="-rotate-90">
          <circle cx="24" cy="24" r={radius} fill="none" stroke={CHIP} strokeWidth="5" />
          <motion.circle cx="24" cy="24" r={radius} fill="none" stroke={pct > 0 ? accent : "transparent"} strokeWidth="5" strokeLinecap="round" strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }} transition={{ duration: 0.9, delay: delay + 0.15, ease: "easeOut" }} />
        </svg>
        <span className="absolute text-[10px] font-extrabold" style={{ color: pct > 0 ? INK : MUTED }}>{pct}%</span>
      </div>
      <span className="flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold" style={{ background: isToday ? theme : "transparent", color: isToday ? "white" : MUTED }}>{label}</span>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, theme, delay }: { icon: typeof Trophy; label: string; value: string; theme: string; delay: number; }) {
  return (
    <motion.div initial={{ opacity: 0, y: 18, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ type: "spring", bounce: 0.45, delay }} whileHover={{ scale: 1.03 }} className="rounded-[18px] border-2 bg-white p-3.5" style={{ borderColor: BORDER }}>
      <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full text-white" style={{ background: theme }}><Icon size={17} /></div>
      <div className="text-[20px] font-extrabold leading-tight" style={{ color: INK }}>{value}</div>
      <div className="text-[11px] font-semibold" style={{ color: MUTED }}>{label}</div>
    </motion.div>
  );
}

function AnalyticsTab({ theme, accent }: { theme: string; accent: string }) {
  const { habits } = useStreakStore();
  const longestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0);
  const completedToday = habits.filter((h) => h.done).length;
  const completionRate = habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0;
  const totalCompletions = habits.reduce((sum, h) => sum + h.streak, 0);
  const todayIndex = (new Date().getDay() + 6) % 7;
  const weekData = [62, 80, 45, 90, 100, 70, completionRate];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.3 }}>
      <h2 className="mb-1 font-[Baloo_2] text-[22px]" style={{ color: INK }}>Your Analytics</h2>
      <p className="mb-4 text-[13px]" style={{ color: MUTED }}>A look at your consistency this week</p>

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", bounce: 0.35, delay: 0.05 }} className="mb-5 rounded-[20px] border-2 bg-white p-4" style={{ borderColor: BORDER }}>
        <div className="mb-3 flex items-center gap-1.5 text-[13px] font-bold" style={{ color: INK }}><TrendingUp size={15} color={accent} /> Weekly Progress</div>
        <div className="flex items-center justify-between">
          {WEEK_LABELS.map((label, i) => <DayRing key={i} label={label} pct={weekData[i]} isToday={i === todayIndex} theme={theme} accent={accent} delay={0.1 + i * 0.06} />)}
        </div>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={Trophy} label="Total Completions" value={String(totalCompletions)} theme={theme} delay={0.15} />
        <StatCard icon={Flame} label="Longest Streak" value={`${longestStreak}d`} theme={theme} delay={0.22} />
        <StatCard icon={Target} label="Completion Rate" value={`${completionRate}%`} theme={theme} delay={0.29} />
        <StatCard icon={Sparkles} label="Active Habits" value={String(habits.length)} theme={theme} delay={0.36} />
      </div>
      <p className="mt-4 text-center text-[11px]" style={{ color: MUTED }}>Weekly ring data is illustrative — daily history tracking is coming with the backend.</p>
    </motion.div>
  );
}

export default function StreakBuddyPage() {
  const [entered, setEntered] = useState(false);
  const [newText, setNewText] = useState("");
  const [tempName, setTempName] = useState("");
  const [tempGoal, setTempGoal] = useState("");
  
  const [showVip, setShowVip] = useState(false);
  const [showSettings, setShowSettings] = useState(false); 
  const [activeTab, setActiveTab] = useState<"home" | "analytics" | "profile">("home");
  const [bgmOn, setBgmOn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { toggleBGM, playTapSound } = useAudio();

  const { habits, addHabit, deleteHabit, editHabit, toggleHabit, reorderHabits, activeTheme, userName, setProfile, hasHydrated, fetchHabitsFromDB } = useStreakStore();
  const theme = activeTheme;
  const accent = getSolidFromTheme(theme);

  useEffect(() => { if (hasHydrated && userName) setEntered(true); }, [hasHydrated, userName]);

  // DATABASE SYNC CALL: Ye har baar page load pe user ko database mein check karega
  useEffect(() => {
    const syncAccount = async () => {
      try {
        await syncUserToDatabase();
      } catch (error) {
        console.error("User sync fail ho gaya:", error);
      }
    };
    syncAccount();
  }, []);

  // Load habits from the server once on initial mount
  useEffect(() => {
    fetchHabitsFromDB().catch((err) => console.error("Failed to fetch habits on mount:", err));
  }, []);

  const handleStart = () => { if (!tempName.trim()) return; setProfile(tempName, tempGoal); setEntered(true); };
  
  // <-- ADDED: Updated handleAdd function with Freemium Logic
  const handleAdd = () => { 
    const isPro = false; // TODO: Sync with actual user subscription
    if (!isPro && habits.length >= 3) {
      toast.error("🔒 Free limit reached!", {
        description: "Upgrade to StreakBuddy PRO to add unlimited habits and unlock premium features.",
      });
      return; 
    }
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

  if (!hasHydrated) return null;

  return (
    <div className="min-h-screen" style={{ background: BG }}>
      <header className="fixed left-0 right-0 top-0 z-50 mx-auto flex h-14 max-w-md items-center justify-between border-b px-4" style={{ background: "rgba(255,255,255,0.92)", borderColor: BORDER, backdropFilter: "blur(8px)" }}>
        
        {/* Clerk Authentication UI */}
        <div className="flex items-center justify-center gap-2">
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="rounded-full px-3 py-1.5 text-[12px] font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95" style={{ background: theme }}>
                Sign In
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        <h1 className="text-[17px] font-extrabold" style={{ color: INK }}>🔥 StreakBuddy</h1>
        
        <div className="flex items-center gap-2">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={async () => {
              const active = await toggleBGM();
              setBgmOn(active);
            }}
            className="flex h-9 rounded-full px-3 text-[14px] font-bold"
            style={{ background: CHIP, color: INK }}
          >
            {bgmOn ? "🔇" : "🎵"}
          </motion.button>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowSettings(true)} className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: CHIP }} aria-label="Settings">
            <Settings size={20} color={INK} />
          </motion.button>
        </div>
      </header>

      <div className="mx-auto max-w-md px-4 pb-24 pt-20">
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div key="login" exit={{ opacity: 0, scale: 0.9 }}>
              <motion.h1 initial={{ y: -200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ type: "spring", bounce: 0.6, duration: 0.9 }} className="mb-8 text-center font-[Baloo_2] text-4xl" style={{ color: INK }}>🔥 StreakBuddy</motion.h1>
              <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, type: "spring", bounce: 0.4 }} className="mb-3.5">
                <label className="text-[13px] font-bold" style={{ color: MUTED }}>Nickname</label>
                <input value={tempName} onChange={(e) => setTempName(e.target.value)} className="mt-1 w-full rounded-[14px] border-2 px-3 py-2.5 text-[15px]" style={{ borderColor: BORDER }} placeholder="e.g. Sam" />
              </motion.div>
              <motion.div initial={{ x: -80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.45, type: "spring", bounce: 0.4 }} className="mb-3.5">
                <label className="text-[13px] font-bold" style={{ color: MUTED }}>What's your big goal?</label>
                <input value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} className="mt-1 w-full rounded-[14px] border-2 px-3 py-2.5 text-[15px]" style={{ borderColor: BORDER }} placeholder="e.g. Get fit" />
              </motion.div>
              <div className="mt-6 flex items-center justify-center gap-2.5">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleStart} className="rounded-full px-7 py-3 font-[Baloo_2] text-[17px] font-bold text-white" style={{ background: tempName.trim() ? theme : MUTED }} disabled={!tempName.trim()}>Let's go</motion.button>
                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}><Hand color={accent} size={26} /></motion.div>
              </div>
            </motion.div>
          ) : activeTab === "home" ? (
            <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-[Baloo_2] text-[22px]" style={{ color: INK }}>Your streaks</h2>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={() => setShowVip(true)} className="flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-bold text-white" style={{ background: theme }}>
                  <Crown size={14} /> PRO
                </motion.button>
              </div>

              <div className="mb-4 flex gap-2">
                <input ref={inputRef} value={newText} onChange={(e) => setNewText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Add a new habit..." className="flex-1 rounded-[14px] border-2 px-3.5 py-2.5 text-sm" style={{ borderColor: BORDER }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.9 }} onClick={handleAdd} aria-label="Add habit" className="flex w-[42px] items-center justify-center rounded-[14px] text-white" style={{ background: theme }}><Plus size={20} /></motion.button>
              </div>

              <Reorder.Group axis="y" values={habits} onReorder={reorderHabits} className="space-y-0">
                <AnimatePresence mode="popLayout">
                  {habits.map((h) => (
                    <HabitRow
                      key={h.id}
                      habit={h}
                      theme={theme}
                      accent={accent}
                      onDelete={deleteHabit}
                      onEdit={editHabit}
                      onToggle={toggleHabit}
                      onTap={playTapSound}
                    />
                  ))}
                </AnimatePresence>
              </Reorder.Group>

              {habits.length === 0 && <p className="mt-8 text-center" style={{ color: MUTED }}>No habits yet — add your first one above!</p>}
            </motion.div>
          ) : activeTab === "profile" ? (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><ProfileTab theme={theme} accent={accent} /></motion.div>
          ) : (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><AnalyticsTab theme={theme} accent={accent} /></motion.div>
          )}
        </AnimatePresence>

        <VipPopup open={showVip} onClose={() => setShowVip(false)} />
        <SettingsPopup open={showSettings} onClose={() => setShowSettings(false)} /> 
        <LevelUpPopup />
        <XpToast />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex h-[64px] max-w-md items-center justify-around border-t px-2" style={{ background: "rgba(255,255,255,0.95)", borderColor: BORDER, backdropFilter: "blur(8px)" }}>
        {tabs.map((tab) => {
          const Icon = tab.icon; const active = activeTab === tab.key;
          return (
            <motion.button key={tab.key} whileTap={{ scale: 0.9 }} onClick={() => setActiveTab(tab.key)} className="flex w-16 flex-col items-center justify-center gap-1 p-1">
              <Icon size={22} color={active ? accent : MUTED} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-bold" style={{ color: active ? accent : MUTED }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </nav>
    </div>
  );
}