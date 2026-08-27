"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { playTapSound } from "./sound-engine";

export const DEFAULT_ONBOARDING_TASKS = [
  "Drink 2 Liters of Water 💧",
  "Play 3 matches of Free Fire 🎮",
  "Do 15 mins of Exercise / Yoga 🧘‍♂️",
  "Learn something new for 20 mins 🧠",
  "Listen to your favorite music & relax 🎧",
  "Get 8 hours of sleep 😴",
];

async function requestHabits<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(body?.error || `Habit request failed (${response.status})`);
  }
  return body as T;
}

async function addHabitToDB(text: string) {
  return requestHabits<{ id: string; title: string; isCompleted: boolean; streak: number }>("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: text }),
  });
}

async function getUserHabitsFromDB() {
  return requestHabits<Array<{ id: string; title: string; isCompleted: boolean; streak: number }>>("/api/habits");
}

async function deleteHabitFromDB(id: string) {
  await requestHabits<null>(`/api/habits/${id}`, { method: "DELETE" });
}

async function toggleHabitInDB(id: string, currentDone: boolean) {
  return requestHabits(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isCompleted: !currentDone }),
  });
}

export interface Habit {
  id: string;
  text: string;
  done: boolean;
  streak: number;
}

export type RewardType = "title" | "theme" | "badge";

export interface Reward {
  level: number;
  type: RewardType;
  name: string;
  description: string;
  value: string;
  icon: string;
}

export interface XpToast {
  id: string;
  message: string;
  xp: number;
  streak: number;
}

const BASE_XP = 50; 
const STREAK_BONUS_MULTIPLIER = 10; 
export const DEFAULT_THEME = "linear-gradient(135deg, #FF7A18 0%, #E63946 100%)";
export const DEFAULT_TITLE = "Newcomer";

const MOTIVATIONAL_MESSAGES = [
  "Great job!", "Keep going!", "You're on fire!", "Crushing it!",
  "Nice one!", "Momentum building!", "Look at you go!", "Consistency wins!",
];

function xpForLevel(level: number): number { return level * 100; }

const CURATED_REWARDS: Omit<Reward, "level">[] = [
  { type: "title", name: "Rising Star", description: "Unlocked the 'Rising Star' title", value: "Rising Star", icon: "⭐" },
  { type: "theme", name: "Sky Theme", description: "Unlocked a new Sky Blue color theme", value: "linear-gradient(135deg,#4CC9F0,#4361EE)", icon: "🎨" },
  { type: "badge", name: "Consistency Badge", description: "Unlocked the Consistency badge", value: "🧩", icon: "🧩" },
  { type: "title", name: "Streak Master", description: "Unlocked the 'Streak Master' title", value: "Streak Master", icon: "🔥" },
  { type: "theme", name: "Violet Theme", description: "Unlocked a new Violet color theme", value: "linear-gradient(135deg,#7B2FF7,#F72585)", icon: "🎨" },
  { type: "badge", name: "Iron Will Badge", description: "Unlocked the Iron Will badge", value: "🛡️", icon: "🛡️" },
  { type: "title", name: "Unstoppable", description: "Unlocked the 'Unstoppable' title", value: "Unstoppable", icon: "🚀" },
];

const FALLBACK_TITLES = ["Legend", "Icon", "Champion", "Titan", "Vanguard", "Phenom"];
const FALLBACK_THEMES = ["linear-gradient(135deg,#FFB703,#FB8500)", "linear-gradient(135deg,#06D6A0,#118AB2)", "linear-gradient(135deg,#EF476F,#FFD166)"];
const FALLBACK_BADGES = ["🏆", "💎", "🥇", "⚡", "🌟", "👑"];

function getRewardForLevel(level: number): Reward {
  const idx = level - 2;
  if (idx >= 0 && idx < CURATED_REWARDS.length) return { level, ...CURATED_REWARDS[idx] };
  const cycle = idx - CURATED_REWARDS.length;
  const typeCycle = cycle % 3;
  if (typeCycle === 0) {
    const name = FALLBACK_TITLES[cycle % FALLBACK_TITLES.length];
    return { level, type: "title", name, description: `Unlocked the '${name}' title`, value: name, icon: "⭐" };
  }
  if (typeCycle === 1) {
    const value = FALLBACK_THEMES[cycle % FALLBACK_THEMES.length];
    return { level, type: "theme", name: "New Theme", description: "Unlocked a new color theme", value, icon: "🎨" };
  }
  const value = FALLBACK_BADGES[cycle % FALLBACK_BADGES.length];
  return { level, type: "badge", name: "Special Badge", description: "Unlocked a special badge", value, icon: value };
}

function getPremiumGradientTheme(level: number): string {
  const premiumThemes = [
    "linear-gradient(135deg, #ff4e50 0%, #f9d423 100%)",
    "linear-gradient(135deg, #5b247a 0%, #1bcedf 100%)",
    "linear-gradient(135deg, #f953c6 0%, #b91d73 100%)",
    "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
    "linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)",
  ];
  return premiumThemes[((level / 3) - 1) % premiumThemes.length];
}

function getPremiumThemeReward(level: number): Reward {
  const value = getPremiumGradientTheme(level);
  return {
    level,
    type: "theme",
    name: `Premium Gradient Theme`,
    description: `Unlocked a premium theme for reaching Level ${level}`,
    value,
    icon: "✨",
  };
}

function getLocalDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getYesterdayDateString(date: Date = new Date()): string {
  const yest = new Date(date);
  yest.setDate(yest.getDate() - 1);
  return getLocalDateString(yest);
}

function makeToastId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getSolidFromTheme(theme: string): string {
  const match = theme.match(/#[0-9a-fA-F]{3,8}/);
  return match ? match[0] : "#FF6B35";
}

interface StreakState {
  userName: string;
  userGoal: string;
  habits: Habit[];
  lastActiveDate: string;
  xp: number;
  level: number;
  unlockedRewards: Reward[];
  activeTheme: string;
  pendingLevelUp: Reward | null;
  xpToast: XpToast | null; 
  hasHydrated: boolean;

  setProfile: (name: string, goal: string) => void;
  fetchHabitsFromDB: () => Promise<void>; // Naya function database se load karne ke liye
  addLocalHabit: (text: string) => void;
  addHabit: (text: string) => Promise<void>;
  deleteHabit: (id: string) => Promise<void>;
  editHabit: (id: string, text: string) => void;
  toggleHabit: (id: string) => Promise<void>;
  reorderHabits: (newOrder: Habit[]) => void;
  checkDailyReset: () => void;
  clearPendingLevelUp: () => void;
  clearXpToast: () => void; 
  setHasHydrated: (v: boolean) => void;
}

export const useStreakStore = create<StreakState>()(
  persist(
    (set, get) => ({
      userName: "",
      userGoal: "",
      habits: [],
      lastActiveDate: getLocalDateString(),
      xp: 0,
      level: 1,
      unlockedRewards: [],
      activeTheme: DEFAULT_THEME,
      pendingLevelUp: null,
      xpToast: null, 
      hasHydrated: false,

      setProfile: (name, goal) => set({ userName: name, userGoal: goal }),

      addLocalHabit: (text) => {
        const trimmedText = text.trim();
        if (!trimmedText) return;
        set((state) => ({
          habits: [
            ...state.habits,
            { id: `local-${makeToastId()}`, text: trimmedText, done: false, streak: 0 },
          ],
        }));
      },

      // DATABASE SYNC: Load habits on login
      fetchHabitsFromDB: async () => {
        try {
          const dbHabits = await getUserHabitsFromDB();
          if (dbHabits && dbHabits.length > 0) {
            // Mapping DB format to Store format
            const formattedHabits = dbHabits.map((h: any) => ({
              id: h.id,
              text: h.title,
              done: h.isCompleted,
              streak: h.streak,
            }));
            set({ habits: formattedHabits });
            return;
          }

          const createdHabits: Habit[] = [];
          for (const task of DEFAULT_ONBOARDING_TASKS) {
            const newDbHabit = await addHabitToDB(task);
            createdHabits.push({
              id: newDbHabit.id,
              text: newDbHabit.title,
              done: newDbHabit.isCompleted,
              streak: newDbHabit.streak,
            });
          }

          set({ habits: createdHabits });
        } catch (error) {
          console.error("Failed to load habits from DB", error);
        }
      },

      // DATABASE SYNC: Add habit
      addHabit: async (text) => {
        if (!text.trim()) return;
        try {
          // Database mein add karo, wahan se asli ID aayegi
          const newDbHabit = await addHabitToDB(text.trim());
          set((state) => ({
            habits: [...state.habits, { id: newDbHabit.id, text: newDbHabit.title, done: newDbHabit.isCompleted, streak: newDbHabit.streak }],
          }));
        } catch (error) {
          console.error("Database add error:", error);
          throw error;
        }
      },

      // DATABASE SYNC: Delete habit
      deleteHabit: async (id) => {
        // UI se turant hatao (Optimistic)
        set((state) => ({ habits: state.habits.filter((h) => h.id !== id) }));
        try {
          // Background mein Database se delete karo
          await deleteHabitFromDB(id);
        } catch (error) {
          console.error("Database delete error:", error);
        }
      },

      editHabit: (id, text) => {
        if (!text.trim()) return;
        set((state) => ({
          habits: state.habits.map((h) => (h.id === id ? { ...h, text: text.trim() } : h)),
        }));
      },

      // DATABASE SYNC: Toggle habit
      toggleHabit: async (id) => {
        const state = get();
        const habit = state.habits.find((h) => h.id === id);
        if (!habit) return;

        const currentDoneStatus = habit.done;
        const turningOn = !habit.done;
        const updatedHabits = state.habits.map((h) =>
          h.id === id ? { ...h, done: turningOn, streak: turningOn ? h.streak + 1 : Math.max(0, h.streak - 1) } : h
        );

        const updatedHabit = updatedHabits.find((h) => h.id === id)!;
        const streakBonus = updatedHabit.streak > 1 ? (updatedHabit.streak - 1) * STREAK_BONUS_MULTIPLIER : 0;
        const totalXpGained = BASE_XP + streakBonus;

        if (turningOn) {
          playTapSound();
          let xp = state.xp + totalXpGained;
          let level = state.level;
          const newlyUnlocked: Reward[] = [];

          while (xp >= xpForLevel(level)) {
            xp -= xpForLevel(level);
            level += 1;
            newlyUnlocked.push(getRewardForLevel(level));
            if (level % 3 === 0) {
              newlyUnlocked.push(getPremiumThemeReward(level));
            }
          }

          const newestTheme = [...newlyUnlocked].reverse().find((r) => r.type === "theme");

          // UI turant update karo
          set({
            habits: updatedHabits,
            xp,
            level,
            unlockedRewards: [...state.unlockedRewards, ...newlyUnlocked],
            activeTheme: newestTheme ? newestTheme.value : state.activeTheme,
            pendingLevelUp: newlyUnlocked.length > 0 ? newlyUnlocked[newlyUnlocked.length - 1] : state.pendingLevelUp,
            xpToast: {
              id: makeToastId(),
              message: MOTIVATIONAL_MESSAGES[Math.floor(Math.random() * MOTIVATIONAL_MESSAGES.length)],
              xp: totalXpGained,
              streak: updatedHabit.streak,
            },
          });
        } else {
          const oldStreakBonus = habit.streak > 1 ? (habit.streak - 1) * STREAK_BONUS_MULTIPLIER : 0;
          const xpToDeduct = BASE_XP + oldStreakBonus;
          set({ habits: updatedHabits, xp: Math.max(0, state.xp - xpToDeduct) });
        }

        try {
          // Background mein Database update karo
          await toggleHabitInDB(id, currentDoneStatus);
        } catch (error) {
          console.error("Database toggle error:", error);
        }
      },

      reorderHabits: (newOrder) => set({ habits: newOrder }),

      checkDailyReset: () => {
        const state = get();
        const today = getLocalDateString();
        if (state.lastActiveDate === today) return; 

        const yesterday = getYesterdayDateString();
        const completedYesterday = state.lastActiveDate === yesterday;
        const resetHabits = state.habits.map((h) => ({
          ...h, done: false, streak: completedYesterday && h.done ? h.streak : 0,
        }));
        set({ habits: resetHabits, lastActiveDate: today });
      },

      clearPendingLevelUp: () => set({ pendingLevelUp: null }),
      clearXpToast: () => set({ xpToast: null }), 
      setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "streakbuddy-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        state?.checkDailyReset();
      },
    }
  )
);

export const xpForNextLevel = xpForLevel;