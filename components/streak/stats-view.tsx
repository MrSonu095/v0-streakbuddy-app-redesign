'use client'

import { Flame, Target, TrendingUp, CalendarCheck, Crown } from 'lucide-react'
import { useStreak } from './streak-store'
import { PremiumUpgradeModal } from './premium-upgrade-modal'

export function StatsView() {
  const { habits, completedCount, totalCount, currentStreak, longestStreak, weeklyHistory, isPro, setIsPro, showUpgradeModal, openUpgradeModal, closeUpgradeModal } = useStreak()
  
  const activeHabitsCount = habits.length
  const currentDayProgress = totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 0
  
  // Get the current day of week using a Monday-to-Sunday layout
  const getDayOfWeek = () => {
    const today = new Date()
    const day = today.getDay()
    return day === 0 ? 6 : day - 1
  }

  const currentDayIndex = getDayOfWeek()

  // Days of week labels in Monday-to-Sunday order
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  // Build weekly chart data from actual history
  const weeklyCompletion = weeklyHistory.map((entry, index) => {
    const percent = entry.totalCount > 0 ? Math.round((entry.completedCount / entry.totalCount) * 100) : 0
    return {
      label: dayLabels[index],
      value: percent,
      isToday: index === currentDayIndex,
    }
  })
  
  // Calculate weekly average from actual completion data
  const weeklyAverage = Math.round(
    weeklyCompletion.reduce((sum, d) => sum + d.value, 0) / weeklyCompletion.length
  )

  // Stats boxes - dynamic values from habits data
  const stats = [
    { label: 'Current streak', value: `${currentStreak} Days`, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/30', glow: 'shadow-[0_0_15px_rgba(249,115,22,0.15)]' },
    { label: 'Longest streak', value: `${longestStreak} Days`, icon: Target, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/30', glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]' },
    { label: 'Completed', value: `${completedCount}/${totalCount}`, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/30', glow: 'shadow-[0_0_15px_rgba(59,130,246,0.15)]' },
    { label: 'Total tasks', value: activeHabitsCount.toString(), icon: CalendarCheck, color: 'text-pink-500', bg: 'bg-pink-500/10', border: 'border-pink-500/30', glow: 'shadow-[0_0_15px_rgba(236,72,153,0.15)]' },
  ]

  const handleLockedPress = () => {
    if (!isPro) {
      openUpgradeModal()
    } else {
      setIsPro(true)
    }
  }

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
        {stats.map((stat, i) => {
          const isLocked = i > 1 && !isPro
          return (
            <button
              key={i}
              onClick={isLocked ? handleLockedPress : undefined}
              className={`flex flex-col gap-3 rounded-2xl border ${stat.border} bg-card/80 p-4 ${stat.glow} transition-all duration-300 hover:scale-105 backdrop-blur-sm text-left ${isLocked ? 'relative overflow-hidden' : ''}`}
            >
              {isLocked && (
                <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                  <Crown className="size-3" /> Pro
                </span>
              )}
              <div className={`flex size-10 items-center justify-center rounded-full ${stat.bg} ${stat.color}`}>
                <stat.icon className="size-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">{stat.label}</p>
              </div>
            </button>
          )
        })}
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
              <div className={`w-full rounded-full flex items-end justify-center relative overflow-hidden h-full border transition-all ${day.isToday ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' : 'border-white/5 bg-secondary/50'}`}>
                <div 
                  className="w-full rounded-full transition-all duration-700 bg-gradient-to-t from-orange-500 via-purple-500 to-blue-500"
                  style={{ height: `${day.value}%` }}
                />
              </div>
              <span className={`text-[10px] uppercase font-bold transition-colors ${day.isToday ? 'text-purple-500' : 'text-muted-foreground'}`}>
                {day.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PremiumUpgradeModal open={showUpgradeModal} onOpenChange={closeUpgradeModal} isPro={isPro} onUnlock={() => setIsPro(true)} />
    </div>
  )
}
