'use client'

import { Flame, Target, TrendingUp, CalendarCheck } from 'lucide-react'
import { useStreak } from './streak-store'

export function StatsView() {
  const { bestStreak, completedCount, totalCount, weeklyCompletion } = useStreak()
  const weeklyAverage = Math.round(
    weeklyCompletion.reduce((sum, d) => sum + d.value, 0) / weeklyCompletion.length,
  )

  const stats = [
    { label: 'Best streak', value: `${bestStreak} days`, icon: Flame },
    { label: 'Completed today', value: `${completedCount}/${totalCount}`, icon: Target },
    { label: 'Weekly average', value: `${weeklyAverage}%`, icon: TrendingUp },
    { label: 'Active habits', value: `${totalCount}`, icon: CalendarCheck },
  ]

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Your Stats</h1>
        <p className="mt-1 text-sm text-muted-foreground">A clear look at your consistency</p>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
              <stat.icon className="size-4.5" />
            </span>
            <p className="mt-3 text-xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </section>

      {/* Weekly completion chart */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground">This week</h2>
        <p className="text-xs text-muted-foreground">Daily completion rate</p>
        <div className="mt-6 flex h-40 items-end justify-between gap-2">
          {weeklyCompletion.map((day) => (
            <div key={day.day} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-lg bg-brand-gradient transition-all duration-500"
                  style={{ height: `${Math.max(day.value, 4)}%` }}
                />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">{day.day}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
