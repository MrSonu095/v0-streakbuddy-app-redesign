'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Habit = {
  id: string
  name: string
  description: string
  current: number
  target: number
  unit: string
}

type StreakContextType = {
  habits: Habit[]
  incrementHabit: (id: string) => void
  decrementHabit: (id: string) => void
}

const StreakContext = createContext<StreakContextType | undefined>(undefined)

// Updated 8 Interesting Tasks
const DEFAULT_HABITS: Habit[] = [
  { id: '1', name: 'Drink 2L of water', description: 'Hydration goal', current: 0, target: 2, unit: 'L' },
  { id: '2', name: 'Morning workout', description: 'Daily fitness', current: 0, target: 1, unit: 'Session' },
  { id: '3', name: 'Meditate', description: 'Calm the mind', current: 0, target: 1, unit: 'Session' },
  { id: '4', name: 'E-commerce Product Hunt', description: 'Find winning gadgets & fashion', current: 0, target: 3, unit: 'Items' },
  { id: '5', name: 'Usability Test Check', description: 'Look for new studies', current: 0, target: 1, unit: 'Check' },
  { id: '6', name: 'Telecalling Pitch Practice', description: 'Refine sales script', current: 0, target: 15, unit: 'Mins' },
  { id: '7', name: 'Hospitality Job Prep', description: 'Front-office roles research', current: 0, target: 1, unit: 'Session' },
  { id: '8', name: 'Free Fire Booyah!', description: 'Gaming & relaxation', current: 0, target: 1, unit: 'Match' },
]

export function StreakProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(DEFAULT_HABITS)
  const [isLoaded, setIsLoaded] = useState(false)

  // Auto Load & Midnight Auto-Reset Logic
  useEffect(() => {
    const savedHabits = localStorage.getItem('streakbuddy_habits')
    const lastDate = localStorage.getItem('streakbuddy_last_date')
    const today = new Date().toDateString() 

    let currentHabits = DEFAULT_HABITS

    // Load saved habits if they exist and match the current 8-task structure
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits)
      // Check to ensure old 5-task data doesn't override new 8-task structure
      if (parsed.length === 8) {
        currentHabits = parsed
      }
    }

    // Checking if today is a new day (Midnight Reset)
    if (lastDate !== today) {
      currentHabits = currentHabits.map(h => ({ ...h, current: 0 }))
      localStorage.setItem('streakbuddy_last_date', today)
    }

    setHabits(currentHabits)
    setIsLoaded(true)
  }, [])

  // Auto-Sync Logic (Save on every click)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('streakbuddy_habits', JSON.stringify(habits))
    }
  }, [habits, isLoaded])

  const incrementHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id && h.current < h.target ? { ...h, current: h.current + 1 } : h))
    )
  }

  const decrementHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => (h.id === id && h.current > 0 ? { ...h, current: h.current - 1 } : h))
    )
  }

  if (!isLoaded) return null

  return (
    <StreakContext.Provider value={{ habits, incrementHabit, decrementHabit }}>
      {children}
    </StreakContext.Provider>
  )
}

export const useStreak = () => {
  const context = useContext(StreakContext)
  if (!context) throw new Error('useStreak must be used within StreakProvider')
  return context
}