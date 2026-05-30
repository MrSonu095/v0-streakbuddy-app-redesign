'use client'

import { Bell, ChevronRight, Crown, HelpCircle, LogOut, Settings, Shield } from 'lucide-react'
import { useStreak } from './streak-store'

const MENU = [
  { label: 'Account settings', icon: Settings },
  { label: 'Notifications', icon: Bell },
  { label: 'Privacy', icon: Shield },
  { label: 'Help & support', icon: HelpCircle },
]

export function ProfileView() {
  const { bestStreak, totalCount } = useStreak()

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Profile</h1>
      </header>

      {/* Profile card */}
      <section className="flex flex-col items-center rounded-3xl border border-border bg-card p-6 shadow-sm">
        {/* Swap the src below with your own profile image URL */}
        <img
          src="/profile-avatar.png"
          alt="User profile"
          className="size-20 rounded-full border border-border object-cover shadow-sm"
        />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Alex Morgan</h2>
        <p className="text-sm text-muted-foreground">alex.morgan@email.com</p>

        <div className="mt-5 flex w-full items-center justify-around rounded-2xl bg-secondary/60 py-3">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{bestStreak}</p>
            <p className="text-xs text-muted-foreground">Best streak</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">{totalCount}</p>
            <p className="text-xs text-muted-foreground">Habits</p>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center">
            <p className="text-lg font-bold text-brand-gradient">Free</p>
            <p className="text-xs text-muted-foreground">Plan</p>
          </div>
        </div>
      </section>

      {/* Upgrade banner */}
      <section className="flex items-center justify-between rounded-3xl bg-brand-gradient p-5 text-primary-foreground shadow-lg shadow-primary/20">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <Crown className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold">Go Pro</p>
            <p className="text-xs opacity-90">Unlock all premium features</p>
          </div>
        </div>
        <ChevronRight className="size-5 opacity-90" />
      </section>

      {/* Menu */}
      <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {MENU.map((item, i) => (
          <button
            key={item.label}
            className="flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-secondary/60"
            style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border)' }}
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
              <item.icon className="size-4.5" />
            </span>
            <span className="flex-1 text-sm font-medium text-foreground">{item.label}</span>
            <ChevronRight className="size-4 text-muted-foreground" />
          </button>
        ))}
      </section>

      <button className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-destructive shadow-sm transition-colors hover:bg-secondary/60">
        <LogOut className="size-4" />
        Log out
      </button>
    </div>
  )
}
