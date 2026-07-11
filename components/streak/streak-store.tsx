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

type CompletionHistory = {
  date: string // YYYY-MM-DD
  completedCount: number
  totalCount: number
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
  weeklyHistory: CompletionHistory[]
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
  const [history, setHistory] = useState<CompletionHistory[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Get today's date in the user's local timezone
  const getTodayString = () => {
    const today = new Date()
    return today.toLocaleDateString('en-CA') // YYYY-MM-DD format in local timezone
  }

  // Get date N days ago
  const getDateNDaysAgo = (n: number) => {
    const date = new Date()
    date.setDate(date.getDate() - n)
    return date.toLocaleDateString('en-CA')
  }

  // Auto Load & Timezone-Aware Midnight Auto-Reset Logic
  useEffect(() => {
    const savedHabits = localStorage.getItem('streakbuddy_habits')
    const savedHistory = localStorage.getItem('streakbuddy_completion_history')
    const lastDate = localStorage.getItem('streakbuddy_last_date')
    const today = getTodayString()

    let currentHabits = DEFAULT_HABITS
    let currentHistory: CompletionHistory[] = []

    // Load saved habits if they exist and match the current 8-task structure
    if (savedHabits) {
      try {
        const parsed = JSON.parse(savedHabits)
        if (Array.isArray(parsed) && parsed.length === 8) {
          currentHabits = parsed
          console.log('[v0] Loaded habits from localStorage')
        }
      } catch (e) {
        console.error('[v0] Failed to parse saved habits:', e)
      }
    }

    // Load completion history
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        if (Array.isArray(parsed)) {
          currentHistory = parsed
          console.log('[v0] Loaded completion history')
        }
      } catch (e) {
        console.error('[v0] Failed to parse saved history:', e)
      }
    }

    // Checking if today is a new day (Midnight Reset using local timezone)
    if (lastDate !== today) {
      // Save yesterday's completion to history before resetting
      const completedYesterday = currentHabits.filter(h => h.current >= h.target).length
      const historyEntry: CompletionHistory = {
        date: lastDate || today,
        completedCount: completedYesterday,
        totalCount: currentHabits.length,
      }
      currentHistory = [...currentHistory, historyEntry]
      
      currentHabits = currentHabits.map(h => ({ ...h, current: 0 }))
      localStorage.setItem('streakbuddy_last_date', today)
      localStorage.setItem('streakbuddy_completion_history', JSON.stringify(currentHistory))
      console.log('[v0] Reset tasks for new day:', today)
    }

    setHabits(currentHabits)
    setHistory(currentHistory)
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

  // Auto-save history
  useEffect(() => {
    if (isLoaded && history.length > 0) {
      localStorage.setItem('streakbuddy_completion_history', JSON.stringify(history))
    }
  }, [history, isLoaded])

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
  
  // Calculate best consecutive streak from history (100% completion days)
  const calculateBestStreak = (): number => {
    let maxStreak = 0
    let currentStreak = 0
    
    // Check if today is 100% complete
    const todayComplete = completedCount === totalCount && totalCount > 0
    if (todayComplete) {
      currentStreak = 1
    }
    
    // Check history for consecutive 100% completion days
    for (let i = history.length - 1; i >= 0; i--) {
      const entry = history[i]
      const isComplete = entry.completedCount === entry.totalCount && entry.totalCount > 0
      
      if (isComplete) {
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        currentStreak = 0
      }
    }
    
    return maxStreak
  }

  const bestStreak = calculateBestStreak()

  // Calculate weekly average from last 7 days of history
  const calculateWeeklyAverage = (): number => {
    const last7Days = []
    
    // Add today's progress
    if (totalCount > 0) {
      last7Days.push((completedCount / totalCount) * 100)
    }
    
    // Add last 6 days from history
    for (let i = 0; i < 6 && history.length > i; i++) {
      const entry = history[history.length - 1 - i]
      const percent = entry.totalCount > 0 ? (entry.completedCount / entry.totalCount) * 100 : 0
      last7Days.push(percent)
    }
    
    // Ensure we have 7 entries (fill with 0 if needed)
    while (last7Days.length < 7) {
      last7Days.push(0)
    }
    
    const average = last7Days.reduce((sum, val) => sum + val, 0) / 7
    return Math.round(average)
  }

  const weeklyHistory = (() => {
    const last7Days: CompletionHistory[] = []
    
    // Add today
    last7Days.push({
      date: getTodayString(),
      completedCount,
      totalCount,
    })
    
    // Add last 6 days from history
    for (let i = 0; i < 6; i++) {
      const date = getDateNDaysAgo(i + 1)
      const entry = history.find(h => h.date === date)
      if (entry) {
        last7Days.push(entry)
      } else {
        last7Days.push({ date, completedCount: 0, totalCount })
      }
    }
    
    return last7Days.reverse()
  })()

  if (!isLoaded) return null

  return (
    <StreakContext.Provider value={{ habits, incrementHabit, decrementHabit, toggleHabit, completedCount, totalCount, bestStreak, allComplete, weeklyHistory }}>
      {children}
    </StreakContext.Provider>
  )
}

export const useStreak = () => {
  const context = useContext(StreakContext)
  if (!context) throw new Error('useStreak must be used within StreakProvider')
  return context
}
