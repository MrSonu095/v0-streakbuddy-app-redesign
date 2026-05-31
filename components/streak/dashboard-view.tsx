'use client'

import { useEffect, useState } from 'react'
import { Check, Flame } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useStreak } from './streak-store'
import { ProgressRing } from './progress-ring'
import { CelebrationDialog } from './celebration-dialog'
import { celebrateTask, celebrateGoal } from '@/lib/celebrate'

export function DashboardView() {
  const { habits, toggleHabit, completedCount, totalCount, bestStreak, allComplete } = useStreak()
  const progress = Math.round((completedCount / totalCount) * 100)
  const [celebrateOpen, setCelebrateOpen] = useState(false)

  // Fire the full-goal celebration once when every habit becomes complete.
  useEffect(() => {
    if (allComplete && totalCount > 0) {
      celebrateGoal()
      setCelebrateOpen(true)
    }
  }, [allComplete, totalCount])

  const handleToggle = (id: string, name: string) => {
    const becameComplete = toggleHabit(id)
    if (becameComplete) {
      celebrateTask()
      toast.success('Congratulations!', {
        description: `You completed "${name}". Keep the streak alive!`,
        duration: 2500,
      })
    }
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6">
      {/* Header with custom app icon */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Swap the src below with your own Custom App Icon URL */}
          <img
            src="/app-icon.png"
            alt="StreakBuddy app icon"
            className="size-10 rounded-full border border-border object-cover shadow-sm"
          />
          <div>
            <p className="text-xs font-medium text-muted-foreground">Welcome back</p>
            <h1 className="text-lg font-semibold leading-tight text-foreground">StreakBuddy</h1>
          </div>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1.5 text-primary-foreground shadow-sm">
          <Flame className="size-4" />
          <span className="text-sm font-semibold">{bestStreak}</span>
        </div>
      </header>

      {/* Daily progress card with live circular ring */}
      <section className="flex items-center gap-5 rounded-3xl bg-brand-gradient p-6 text-primary-foreground shadow-lg shadow-primary/20">
        <ProgressRing progress={progress} size={104} strokeWidth={9}>
          <span className="text-2xl font-bold leading-none">{progress}%</span>
          <span className="mt-1 text-[10px] font-medium uppercase tracking-wide opacity-80">
            Today
          </span>
        </ProgressRing>
        <div className="flex-1">
          <p className="text-sm font-medium opacity-90">Daily progress</p>
          <p className="mt-1 text-3xl font-bold tracking-tight">
            {completedCount}
            <span className="text-xl font-medium opacity-80">/{totalCount}</span>
          </p>
          <p className="mt-1 text-xs font-medium opacity-90">
            {allComplete ? 'All done — amazing!' : "Keep going, you've got this"}
          </p>
        </div>
      </section>

      {/* Habit list */}
      <section className="flex flex-col gap-3">
        <h2 className="px-1 text-sm font-semibold text-foreground">Today&apos;s habits</h2>
        {habits.map((habit) => (
          <button
            key={habit.id}
            onClick={() => handleToggle(habit.id, habit.name)}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:bg-secondary/60"
          >
            <span
              className={cn(
                'flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                habit.done
                  ? 'border-transparent bg-brand-gradient text-primary-foreground'
                  : 'border-border bg-background text-transparent',
              )}
            >
              <Check className="size-4" strokeWidth={3} />
            </span>
            <span className="flex-1">
              <span
                className={cn(
                  'block text-sm font-medium transition-colors',
                  habit.done ? 'text-muted-foreground line-through' : 'text-foreground',
                )}
              >
                {habit.name}
              </span>
              <span
                className={cn(
                  'mt-0.5 block text-xs transition-colors',
                  habit.done ? 'text-muted-foreground/70 line-through' : 'text-muted-foreground',
                )}
              >
                {habit.detail}
              </span>
            </span>
            <span className="flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-foreground">
              <Flame className="size-3.5 text-primary" />
              {habit.streak}
            </span>
          </button>
        ))}
      </section>

      <CelebrationDialog open={celebrateOpen} onOpenChange={setCelebrateOpen} />
    </div>
  )
}
