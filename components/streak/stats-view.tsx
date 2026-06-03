'use client'

import { Flame, Target, TrendingUp, CalendarCheck } from 'lucide-react'
import { useStreak } from './streak-store'

export function StatsView() {
  const { habits } = useStreak()
  
  // Naye 8 tasks ke hisaab se data sync ho raha hai
  const activeHabitsCount = habits.length
  const completedCount = habits.filter(h => h.current === h.target).length
  const totalCount = activeHabitsCount
  
  const bestStreak = 12 // Dummy best streak
  const currentDayProgress = totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 0
  
  // Weekly Chart Data
  const weeklyCompletion = [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 75 },
    { label: 'Wed', value: currentDayProgress }, // Aaj ka live progress yahan dikhega
    { label: 'Thu', value: 0 },
    { label: 'Fri', value: 0 },
    { label: 'Sat', value: 0 },
    { label: 'Sun', value: 0 },
  ]
  
  const weeklyAverage = Math.round(
    weeklyCompletion.reduce((sum, d) => sum + d.value, 0) / 7
  )

  // Glowing high-contrast stats boxes configuration
  const stats = [
    { label: 'Best streak', value: `${bestStreak} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]' },
    { label: 'Completed', value: `${completedCount}/${totalCount}`, icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
    { label: 'Weekly Avg', value: `${weeklyAverage}%`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
    { label: 'Active Tasks', value: activeHabitsCount.toString(), icon: CalendarCheck, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]' },
  ]

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6 relative min-h-screen bg-background text-foreground">
      <header className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-blue-500 to-orange-500">
          Your Stats
        </h1>
        <p className="mt-1 text-sm text-muted-foreground font-medium">A clear look at your consistency</p>
      </header>

      {/* 4 Glowing Stat Boxes */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className={`flex flex-col gap-3 rounded-2xl border ${stat.border} bg-card/80 p-4 ${stat.glow} transition-all duration-300 hover:scale-105 backdrop-blur-sm`}>
            <div className={`flex size-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
              <stat.icon className="size-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* High-Contrast Weekly Progress Chart */}
      <div className="rounded-3xl border border-purple-500/20 bg-card/50 p-6 shadow-[0_0_20px_rgba(168,85,247,0.1)] backdrop-blur-md mt-2">
        <h3 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
           This week's Hustle
        </h3>
        <div className="flex items-end justify-between gap-2 h-36">
          {weeklyCompletion.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full">
              <div className="w-full bg-secondary/50 rounded-full flex items-end justify-center relative overflow-hidden h-full border border-white/5">
                <div 
                  className="w-full rounded-full transition-all duration-700 bg-gradient-to-t from-orange-500 via-purple-500 to-blue-500"
                  style={{ height: `${day.value}%` }}
                />
              </div>
              <span className={`text-[10px] uppercase font-bold ${day.label === 'Wed' ? 'text-purple-500' : 'text-muted-foreground'}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}