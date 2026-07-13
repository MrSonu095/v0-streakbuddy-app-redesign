'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@/lib/supabase/client'

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
  incrementHabit: (id: string) => boolean
  decrementHabit: (id: string) => void
  toggleHabit: (id: string) => boolean
  completedCount: number
  totalCount: number
  currentStreak: number
  longestStreak: number
  totalTasks: number
  allComplete: boolean
  weeklyHistory: CompletionHistory[]
  isPro: boolean
  setIsPro: (value: boolean) => void
  openUpgradeModal: () => void
  closeUpgradeModal: () => void
  showUpgradeModal: boolean
}

const StreakContext = createContext<StreakContextType | undefined>(undefined)

const getDateString = (date: Date) => date.toLocaleDateString('en-CA')

const calculateStreakMetrics = ({
  history,
  completedCount,
  totalCount,
  todayString,
}: {
  history: CompletionHistory[]
  completedCount: number
  totalCount: number
  todayString: string
}) => {
  if (totalCount === 0) {
    return { currentStreak: 0, longestStreak: 0 }
  }

  const completeDates = new Set<string>()
  history.forEach((entry) => {
    if (entry.totalCount > 0 && entry.completedCount === entry.totalCount) {
      completeDates.add(entry.date)
    }
  })

  if (completedCount === totalCount) {
    completeDates.add(todayString)
  }

  let currentStreak = 0
  let cursor = new Date()
  while (true) {
    const cursorString = getDateString(cursor)
    const isComplete = cursorString === todayString
      ? completedCount === totalCount && totalCount > 0
      : completeDates.has(cursorString)

    if (!isComplete) break
    currentStreak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  const sortedDates = Array.from(completeDates).sort((a, b) => a.localeCompare(b))
  let longestStreak = 0
  let runningStreak = 0
  let previousDate: Date | null = null

  sortedDates.forEach((dateString) => {
    const currentDate = new Date(`${dateString}T12:00:00`)
    if (!previousDate) {
      runningStreak = 1
    } else {
      const diffDays = Math.round((currentDate.getTime() - previousDate.getTime()) / 86400000)
      runningStreak = diffDays === 1 ? runningStreak + 1 : 1
    }

    longestStreak = Math.max(longestStreak, runningStreak)
    previousDate = currentDate
  })

  return { currentStreak, longestStreak }
}

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
  const [lastDate, setLastDate] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isPro, setIsPro] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const getTodayString = () => getDateString(new Date())

  const getDayIndexInWeek = () => {
    const today = new Date()
    const day = today.getDay()
    return day === 0 ? 6 : day - 1
  }

  const transitionToNewDay = (today: string) => {
    if (lastDate === today) return

    setHabits((prevHabits) => {
      const completedYesterday = prevHabits.filter((habit) => habit.current >= habit.target).length
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          date: lastDate || today,
          completedCount: completedYesterday,
          totalCount: prevHabits.length,
        },
      ])
      return prevHabits.map((habit) => ({ ...habit, current: 0 }))
    })

    setLastDate(today)
  }

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      const activeUserId = session?.user?.id ?? null
      setUserId(activeUserId)

      if (!activeUserId) {
        setHabits(DEFAULT_HABITS)
        setHistory([])
        setLastDate(getTodayString())
        setIsLoaded(true)
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('habits, history, last_date, is_pro')
        .eq('user_id', activeUserId)
        .maybeSingle()

      if (error) {
        console.error('[v0] Failed to load profile:', error)
      }

      const today = getTodayString()
      let currentHabits = DEFAULT_HABITS
      let currentHistory: CompletionHistory[] = []
      let currentLastDate = today

      if (data?.habits && Array.isArray(data.habits) && data.habits.length === DEFAULT_HABITS.length) {
        currentHabits = data.habits as Habit[]
      }

      if (Array.isArray(data?.history)) {
        currentHistory = data.history as CompletionHistory[]
      }

      if (typeof data?.last_date === 'string') {
        currentLastDate = data.last_date
      }

      if (typeof data?.is_pro === 'boolean') {
        setIsPro(data.is_pro)
      }

      if (currentLastDate !== today) {
        const completedYesterday = currentHabits.filter((habit) => habit.current >= habit.target).length
        currentHistory = [
          ...currentHistory,
          {
            date: currentLastDate || today,
            completedCount: completedYesterday,
            totalCount: currentHabits.length,
          },
        ]
        currentHabits = currentHabits.map((habit) => ({ ...habit, current: 0 }))
        currentLastDate = today
      }

      setHabits(currentHabits)
      setHistory(currentHistory)
      setLastDate(currentLastDate)
      setIsLoaded(true)
    }

    loadProfile()
  }, [])

  useEffect(() => {
    if (!isLoaded) return

    const scheduleNextReset = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)

      const msUntilMidnight = tomorrow.getTime() - now.getTime()

      const timer = window.setTimeout(() => {
        const today = getTodayString()
        if (lastDate !== today) {
          transitionToNewDay(today)
        }
        scheduleNextReset()
      }, msUntilMidnight)

      return timer
    }

    const timer = scheduleNextReset()

    const handleFocus = () => {
      const today = getTodayString()
      if (lastDate !== today) {
        transitionToNewDay(today)
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('focus', handleFocus)
    }
  }, [isLoaded, lastDate])

  useEffect(() => {
    if (!isLoaded || !userId) return

    const persist = async () => {
      const { error } = await supabase.from('profiles').upsert(
        {
          user_id: userId,
          habits,
          history,
          last_date: lastDate,
          is_pro: isPro,
        },
        { onConflict: 'user_id' },
      )

      if (error) {
        console.error('[v0] Failed to sync to Supabase:', error)
      }
    }

    persist()
  }, [habits, history, lastDate, isLoaded, userId])

  const incrementHabit = (id: string): boolean => {
    let didComplete = false
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id && habit.current < habit.target) {
          const nextCurrent = habit.current + 1
          didComplete = nextCurrent >= habit.target
          return { ...habit, current: nextCurrent }
        }
        return habit
      }),
    )
    return didComplete
  }

  const decrementHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((habit) => (habit.id === id && habit.current > 0 ? { ...habit, current: habit.current - 1 } : habit)),
    )
  }

  const toggleHabit = (id: string): boolean => {
    let becameComplete = false
    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id === id) {
          if (habit.current < habit.target) {
            becameComplete = true
            return { ...habit, current: habit.current + 1 }
          }
          return { ...habit, current: Math.max(0, habit.current - 1) }
        }
        return habit
      }),
    )
    return becameComplete
  }

  const completedCount = habits.filter((habit) => habit.current >= habit.target).length
  const totalCount = habits.length
  const allComplete = completedCount === totalCount && totalCount > 0
  const todayString = getTodayString()
  const { currentStreak, longestStreak } = calculateStreakMetrics({
    history,
    completedCount,
    totalCount,
    todayString,
  })
  const totalTasks = totalCount

  const calculateWeeklyAverage = (): number => {
    const last7Days: number[] = []

    if (totalCount > 0) {
      last7Days.push((completedCount / totalCount) * 100)
    }

    for (let i = 0; i < 6 && history.length > i; i++) {
      const entry = history[history.length - 1 - i]
      const percent = entry.totalCount > 0 ? (entry.completedCount / entry.totalCount) * 100 : 0
      last7Days.push(percent)
    }

    while (last7Days.length < 7) {
      last7Days.push(0)
    }

    const average = last7Days.reduce((sum, value) => sum + value, 0) / 7
    return Math.round(average)
  }

  const weeklyHistory = (() => {
    const today = new Date()
    const currentDayIndex = getDayIndexInWeek()
    const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const entriesByDate = new Map(history.map((entry) => [entry.date, entry]))

    return dayLabels.map((_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (currentDayIndex - index))
      const dateString = getDateString(date)
      const entry = dateString === todayString
        ? { completedCount, totalCount }
        : entriesByDate.get(dateString)

      return {
        date: dateString,
        completedCount: entry?.completedCount ?? 0,
        totalCount: entry?.totalCount ?? totalCount,
      }
    })
  })()

  if (!isLoaded) return null

  return (
    <StreakContext.Provider value={{ habits, incrementHabit, decrementHabit, toggleHabit, completedCount, totalCount, currentStreak, longestStreak, totalTasks, allComplete, weeklyHistory, isPro, setIsPro, openUpgradeModal: () => setShowUpgradeModal(true), closeUpgradeModal: () => setShowUpgradeModal(false), showUpgradeModal }}>
      {children}
    </StreakContext.Provider>
  )
}

export const useStreak = () => {
  const context = useContext(StreakContext)
  if (!context) throw new Error('useStreak must be used within StreakProvider')
  return context
}
