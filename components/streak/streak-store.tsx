'use client'

import {
  createContext,
    useContext,
      useEffect,
        useMemo,
          useRef,
            useState,
              type ReactNode,
              } from 'react'
              
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
                                    allComplete: boolean
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
                                                
                                                function todayKey() {
                                                  return new Date().toDateString()
                                                  }
                                                  
                                                  function msUntilMidnight() {
                                                    const now = new Date()
                                                      const midnight = new Date(now)
                                                        midnight.setHours(24, 0, 0, 0)
                                                          return midnight.getTime() - now.getTime()
                                                          }
                                                          
                                                          export function StreakProvider({ children }: { children: ReactNode }) {
                                                            const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS)
                                                              const lastReset = useRef<string>(todayKey())
                                                              
                                                                // Reset all daily tasks/goals so the user starts fresh for the new day.
                                                                  const resetForNewDay = () => {
                                                                      setHabits((prev) => prev.map((h) => ({ ...h, done: false })))
                                                                          lastReset.current = todayKey()
                                                                            }
                                                                            
                                                                              // Auto-reset exactly at midnight (12:00 AM), and also catch up if the app
                                                                                // was left open / reopened across a day boundary.
                                                                                  useEffect(() => {
                                                                                      let timeoutId: ReturnType<typeof setTimeout>
                                                                                      
                                                                                          const scheduleMidnight = () => {
                                                                                                timeoutId = setTimeout(() => {
                                                                                                        resetForNewDay()
                                                                                                                scheduleMidnight()
                                                                                                                      }, msUntilMidnight())
                                                                                                                          }
                                                                                                                          
                                                                                                                              const checkMissedReset = () => {
                                                                                                                                    if (lastReset.current !== todayKey()) {
                                                                                                                                            resetForNewDay()
                                                                                                                                                  }
                                                                                                                                                      }
                                                                                                                                                      
                                                                                                                                                          scheduleMidnight()
                                                                                                                                                          
                                                                                                                                                              // Re-check when the tab regains focus (timers throttle in background tabs).
                                                                                                                                                                  const onVisible = () => {
                                                                                                                                                                        if (document.visibilityState === 'visible') checkMissedReset()
                                                                                                                                                                            }
                                                                                                                                                                                document.addEventListener('visibilitychange', onVisible)
                                                                                                                                                                                
                                                                                                                                                                                    return () => {
                                                                                                                                                                                          clearTimeout(timeoutId)
                                                                                                                                                                                                document.removeEventListener('visibilitychange', onVisible)
                                                                                                                                                                                                    }
                                                                                                                                                                                                      }, [])
                                                                                                                                                                                                      
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
                                                                                                                                                                                                                                                                                                                                                                                                                allComplete: completedCount === habits.length,
                                                                                                                                                                                                                                                                                                                                                                                                                      weeklyCompletion,
                                                                                                                                                                                                                                                                                                                                                                                                                          }
                                                                                                                                                                                                                                                                                                                                                                                                                            }, [habits])
                                                                                                                                                                                                                                                                                                                                                                                                                            
                                                                                                                                                                                                                                                                                                                                                                                                                              return <StreakContext.Provider value={value}>{children}</StreakContext.Provider>
                                                                                                                                                                                                                                                                                                                                                                                                                              }
                                                                                                                                                                                                                                                                                                                                                                                                                              
                                                                                                                                                                                                                                                                                                                                                                                                                              export function useStreak() {
                                                                                                                                                                                                                                                                                                                                                                                                                                const ctx = useContext(StreakContext)
                                                                                                                                                                                                                                                                                      