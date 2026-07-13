'use client'

import { Crown, Sparkles, BarChart3, Palette, ShieldCheck, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type PremiumUpgradeModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUnlock?: () => void
  isPro?: boolean
}

const BENEFITS = [
  {
    title: 'Unlimited streaks',
    description: 'Keep every streak going without hitting a free limit.',
    icon: ShieldCheck,
  },
  {
    title: 'Advanced analytics',
    description: 'Unlock deeper charts, trends, and consistency insights.',
    icon: BarChart3,
  },
  {
    title: 'Custom themes',
    description: 'Personalize your dashboard with premium looks and colors.',
    icon: Palette,
  },
]

export function PremiumUpgradeModal({ open, onOpenChange, onUnlock, isPro = false }: PremiumUpgradeModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/60 p-3 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-md rounded-[28px] border border-border/80 bg-background p-5 shadow-2xl">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-gradient px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary-foreground">
              <Crown className="size-3.5" />
              StreakBuddy Pro
            </div>
            <h2 className="mt-3 text-2xl font-bold text-foreground">Unlock your next level</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Make your habit system feel premium with richer insights and a more personal experience.
            </p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-full bg-secondary p-2 text-muted-foreground transition-colors hover:bg-secondary/70"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-background to-blue-500/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">Mock plan</p>
              <p className="text-2xl font-black text-foreground">$19.99<span className="text-sm font-medium text-muted-foreground">/year</span></p>
            </div>
            <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Best value
            </div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {BENEFITS.map((benefit) => {
            const Icon = benefit.icon
            return (
              <div key={benefit.title} className="flex items-start gap-3 rounded-2xl border border-border/70 bg-card/70 p-3">
                <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{benefit.title}</p>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 flex flex-col gap-2">
          <button
            onClick={() => {
              onUnlock?.()
              onOpenChange(false)
            }}
            className="rounded-2xl bg-brand-gradient py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.99]"
          >
            {isPro ? 'You already have Pro' : 'Unlock Pro access'}
          </button>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-2xl border border-border bg-card py-3 text-sm font-semibold text-foreground"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  )
}
