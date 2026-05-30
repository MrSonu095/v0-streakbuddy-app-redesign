'use client'

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

export type Habit = {
  id: string
  name: string
  detail: string
  streak: number
  done: boolean
}

type StreakContextValue = {
  habits: Habit[]
  toggleHabit: (id: string) => boolean // returns true when a habit becomes completed
  completedCount: number
  totalCount: number
  bestStreak: number
  weeklyCompletion: { day: string; value: number }[]
}

const StreakContext = createContext<StreakContextValue | null>(null)

const INITIAL_HABITS: Habit[] = [
  { id: 'water', name: 'Drink 2L of water', detail: 'Hydration goal', streak: 12, done: false },
  { id: 'read', name: 'Read for 20 minutes', detail: 'Daily learning', streak: 8, done: false },
  { id: 'workout', name: 'Morning workout', detail: '30 min session', streak: 21, done: true },
  { id: 'meditate', name: 'Meditate', detail: 'Calm the mind', streak: 5, done: false },
  { id: 'journal', name: 'Write in journal', detail: 'Reflect on the day', streak: 3, done: false },
]

export function StreakProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)

  const toggleHabit = (id: string) => {
    let becameComplete = false
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const nextDone = !h.done
        becameComplete = nextDone
        return {
          ...h,
          done: nextDone,
          streak: nextDone ? h.streak + 1 : Math.max(0, h.streak - 1),
        }
      }),
    )
    return becameComplete
  }

  const value = useMemo<StreakContextValue>(() => {
    const completedCount = habits.filter((h) => h.done).length
    const bestStreak = habits.reduce((max, h) => Math.max(max, h.streak), 0)
    const weeklyCompletion = [
      { day: 'Mon', value: 80 },
      { day: 'Tue', value: 100 },
      { day: 'Wed', value: 60 },
      { day: 'Thu', value: 100 },
      { day: 'Fri', value: 40 },
      { day: 'Sat', value: 90 },
      { day: 'Sun', value: Math.round((completedCount / habits.length) * 100) },
    ]
    return {
      habits,
      toggleHabit,
      completedCount,
      totalCount: habits.length,
      bestStreak,
      weeklyCompletion,
    }
  }, [habits])

  return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
}

export function useStreak() {
  const ctx = useContext(StreakContext)
  if (!ctx) throw new Error('useStreak must be used within a StreakProvider')
  return ctx
}
