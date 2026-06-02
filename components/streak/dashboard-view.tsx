'use client'

import { useState, useEffect } from 'react'
import { useStreak } from './streak-store'
import { CheckCircle2, Plus, Minus, Trophy } from 'lucide-react'
import { cn } from '@/lib/utils'

export function DashboardView() {
  const { habits, incrementHabit, decrementHabit } = useStreak()
  const [showAllDone, setShowAllDone] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  // Total Progress Calculate karne ke liye
  const totalTarget = habits.reduce((sum, h) => sum + h.target, 0)
  const totalCurrent = habits.reduce((sum, h) => sum + h.current, 0)
  const isAllDone = totalCurrent === totalTarget && totalTarget > 0

  useEffect(() => {
    if (isAllDone) setShowAllDone(true)
  }, [isAllDone])

  const handlePlus = (id: string, name: string, current: number, target: number) => {
    incrementHabit(id)
    // Sirf tab Popup aayega jab ek task pura 100% complete ho jayega
    if (current + 1 === target) {
      setToastMsg(`Congratulations! You completed "${name}"`)
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6 relative">
      
      {/* Top Banner: Overall Daily Progress */}
      <div className="rounded-3xl bg-brand-gradient p-6 text-primary-foreground shadow-lg shadow-primary/20">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Daily Progress</h2>
          <span className="text-2xl font-bold bg-white/20 px-3 py-1 rounded-full">{Math.round((totalCurrent/totalTarget)*100)}%</span>
        </div>
        <p className="mt-1 text-sm opacity-90">{totalCurrent} / {totalTarget} total tasks completed</p>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/30">
          <div className="h-full bg-white transition-all duration-500" style={{ width: `${(totalCurrent / totalTarget) * 100}%` }} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h3 className="font-semibold text-foreground">Today&apos;s habits</h3>
        {habits.map((habit) => {
          const isCompleted = habit.current === habit.target
          const progressPercent = (habit.current / habit.target) * 100

          return (
            <div key={habit.id} className={cn("rounded-2xl border p-4 shadow-sm transition-all", isCompleted ? "bg-secondary/40 border-primary/30" : "bg-card border-border")}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className={cn("font-bold text-base", isCompleted ? "text-primary line-through" : "text-foreground")}>{habit.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{habit.current} / {habit.target} {habit.unit}</p>
                </div>
                
                {/* +/- Buttons ya Done Tick */}
                {isCompleted ? (
                  <span className="flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    <CheckCircle2 className="size-4" /> Done
                  </span>
                ) : (
                  <div className="flex items-center gap-3">
                    <button onClick={() => decrementHabit(habit.id)} className="p-1.5 rounded-full bg-secondary text-muted-foreground hover:bg-border transition"><Minus className="size-4" /></button>
                    <span className="w-4 text-center font-bold text-sm text-foreground">{habit.current}</span>
                    <button onClick={() => handlePlus(habit.id, habit.name, habit.current, habit.target)} className="p-1.5 rounded-full bg-brand-gradient text-white shadow-sm transition active:scale-95"><Plus className="size-4" /></button>
                  </div>
                )}
              </div>
              
              {/* Mini Individual Progress Bar */}
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-brand-gradient transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Small Toast Notification (For single task complete) */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-foreground text-background px-4 py-2 rounded-full text-sm font-semibold shadow-lg z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="size-4 text-primary" />
          {toastMsg}
        </div>
      )}

      {/* Big 'All Done' Modal (For all tasks complete) */}
      {showAllDone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-card p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-brand-gradient"></div>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <Trophy className="size-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">All done for today!</h2>
            <p className="mt-2 text-sm text-muted-foreground">Amazing work! You completed every single habit. Come back tomorrow to keep your streak alive.</p>
            <button onClick={() => setShowAllDone(false)} className="mt-6 w-full rounded-2xl bg-brand-gradient py-3.5 text-sm font-semibold text-white shadow-lg transition active:scale-95">
              Keep it up!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}