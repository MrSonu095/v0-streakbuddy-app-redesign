"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  text: string;
  streak: number;
  done: boolean;
  createdAt: number;
}

interface StreakStore {
  habits: Habit[];
  addHabit: (text: string) => void;
  deleteHabit: (id: string) => void;
  editHabit: (id: string, text: string) => void;
  toggleHabit: (id: string) => void;
}

const DEFAULT_HABITS: Habit[] = [
  { id: "1", text: "Touch Grass", streak: 4, done: false, createdAt: Date.now() },
  { id: "2", text: "Drink Water like a Fish", streak: 12, done: false, createdAt: Date.now() },
  { id: "3", text: "Insta Reels Detox", streak: 1, done: false, createdAt: Date.now() },
];

export const useStreakStore = create<StreakStore>()(
  persist(
    (set) => ({
      habits: DEFAULT_HABITS,

      addHabit: (text) =>
        set((state) => {
          const trimmed = text.trim();
          if (!trimmed) return state;
          return {
            habits: [
              ...state.habits,
              {
                id: crypto.randomUUID(),
                text: trimmed,
                streak: 0,
                done: false,
                createdAt: Date.now(),
              },
            ],
          };
        }),

      deleteHabit: (id) =>
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== id),
        })),

      editHabit: (id, text) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, text: text.trim() || h.text } : h
          ),
        })),

      toggleHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id
              ? {
                  ...h,
                  done: !h.done,
                  streak: !h.done ? h.streak + 1 : Math.max(0, h.streak - 1),
                }
              : h
          ),
        })),
    }),
    {
      name: "streakbuddy-storage", // localStorage key
    }
  )
);

