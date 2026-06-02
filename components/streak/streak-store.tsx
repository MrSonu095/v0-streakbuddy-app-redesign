'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

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

                  export function StreakProvider({ children }: { children: ReactNode }) {
                    const [habits, setHabits] = useState<Habit[]>([
                        { id: '1', name: 'Drink water', description: 'Hydration goal', current: 0, target: 2, unit: 'L' },
                            { id: '2', name: 'Read a book', description: 'Daily learning', current: 0, target: 20, unit: 'Mins' },
                                { id: '3', name: 'Morning workout', description: 'Activity', current: 0, target: 1, unit: 'Session' },
                                  ])

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
                                                                                              