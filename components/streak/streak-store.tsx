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
  toggleHabit: (id: string) => boolean
  completedCount: number
  totalCount: number
  bestStreak: number
  allComplete: boolean
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

  // Get today's date in the user's local timezone
  const getTodayString = () => {
    const today = new Date()
    return today.toLocaleDateString('en-CA') // YYYY-MM-DD format in local timezone
  }

  // Auto Load & Timezone-Aware Midnight Auto-Reset Logic
  useEffect(() => {
    const savedHabits = localStorage.getItem('streakbuddy_habits')
    const lastDate = localStorage.getItem('streakbuddy_last_date')
    const today = getTodayString()

    let currentHabits = DEFAULT_HABITS

    // Load saved habits if they exist and match the current 8-task structure
    if (savedHabits) {
      const parsed = JSON.parse(savedHabits)
      if (parsed.length === 8) {
        currentHabits = parsed
      }
    }

    // Checking if today is a new day (Midnight Reset using local timezone)
    if (lastDate !== today) {
      currentHabits = currentHabits.map(h => ({ ...h, current: 0 }))
      localStorage.setItem('streakbuddy_last_date', today)
    }

    setHabits(currentHabits)
    setIsLoaded(true)
  }, [])

  // Schedule reset at midnight (local time)
  useEffect(() => {
    if (!isLoaded) return

    const scheduleNextReset = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const msUntilMidnight = tomorrow.getTime() - now.getTime()

      const timer = setTimeout(() => {
        const today = getTodayString()
        setHabits(prev => prev.map(h => ({ ...h, current: 0 })))
        localStorage.setItem('streakbuddy_last_date', today)
        scheduleNextReset() // Schedule the next midnight reset
      }, msUntilMidnight)

      return timer
    }

    const timer = scheduleNextReset()

    // Also reset on tab focus (in case the tab was closed at midnight)
    const handleFocus = () => {
      const lastDate = localStorage.getItem('streakbuddy_last_date')
      const today = getTodayString()
      if (lastDate !== today) {
        setHabits(prev => prev.map(h => ({ ...h, current: 0 })))
        localStorage.setItem('streakbuddy_last_date', today)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isLoaded])

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

  const toggleHabit = (id: string): boolean => {
    let becameComplete = false
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          if (h.current < h.target) {
            becameComplete = true
            return { ...h, current: h.current + 1 }
          } else {
            return { ...h, current: Math.max(0, h.current - 1) }
          }
        }
        return h
      })
    )
    return becameComplete
  }

  const completedCount = habits.filter(h => h.current >= h.target).length
  const totalCount = habits.length
  const allComplete = completedCount === totalCount && totalCount > 0
  
  // Calculate best streak from habits data (default 0, not hardcoded)
  const bestStreak = habits.reduce((max, h) => Math.max(max, h.current), 0)

  if (!isLoaded) return null

  return (
    <StreakContext.Provider value={{ habits, incrementHabit, decrementHabit, toggleHabit, completedCount, totalCount, bestStreak, allComplete }}>
      {children}
    </StreakContext.Provider>
  )
}

export const useStreak = () => {
  const context = useContext(StreakContext)
  if (!context) throw new Error('useStreak must be used within StreakProvider')
  return context
}
