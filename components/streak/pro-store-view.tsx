'use client'

import { useState } from 'react'
import { Check, Crown, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Confirm Payment redirects here. Replace this with your own WhatsApp link.
 * Format: https://wa.me/<countrycode+number>?text=<url-encoded-message>
 */
const WHATSAPP_CHECKOUT_LINK =
  'https://wa.me/1234567890?text=I%20want%20to%20upgrade%20to%20StreakBuddy%20Pro'

type Plan = {
  id: string
  name: string
  price: string
  period: string
  highlight?: boolean
}

const PLANS: Plan[] = [
  { id: 'monthly', name: 'Monthly', price: '$4.99', period: '/ month' },
  { id: 'yearly', name: 'Yearly', price: '$39.99', period: '/ year', highlight: true },
  { id: 'lifetime', name: 'Lifetime', price: '$89.99', period: 'one-time' },
]

const FEATURES = [
  'Unlimited habits & streaks',
  'Advanced stats & insights',
  'Custom reminders',
  'Premium themes & icons',
  'Priority support',
]

export function ProStoreView() {
  const [selected, setSelected] = useState('yearly')

  const handleConfirmPayment = () => {
    window.open(WHATSAPP_CHECKOUT_LINK, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6">
      <header className="pt-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-primary-foreground shadow-sm">
          <Crown className="size-3.5" />
          Pro Store
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">Unlock StreakBuddy Pro</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything you need to build habits that last.
        </p>
      </header>

      {/* Plans */}
      <section className="flex flex-col gap-3">
        {PLANS.map((plan) => {
          const isActive = selected === plan.id
          return (
            <button
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={cn(
                'flex items-center justify-between rounded-2xl border p-4 text-left transition-all',
                isActive
                  ? 'border-transparent bg-brand-gradient text-primary-foreground shadow-lg shadow-primary/20'
                  : 'border-border bg-card text-foreground shadow-sm hover:bg-secondary/60',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex size-5 items-center justify-center rounded-full border-2',
                    isActive ? 'border-white bg-white/20' : 'border-border',
                  )}
                >
                  {isActive && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className="flex items-center gap-2 text-sm font-semibold">
                  {plan.name}
                  {plan.highlight && (
                    <span
                      className={cn(
                        'rounded-full px-2 py-0.5 text-[10px] font-bold',
                        isActive ? 'bg-white/25 text-primary-foreground' : 'bg-secondary text-primary',
                      )}
                    >
                      BEST VALUE
                    </span>
                  )}
                </span>
              </div>
              <div className="text-right">
                <p className="text-base font-bold">{plan.price}</p>
                <p className={cn('text-xs', isActive ? 'opacity-90' : 'text-muted-foreground')}>
                  {plan.period}
                </p>
              </div>
            </button>
          )
        })}
      </section>

      {/* Features */}
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Sparkles className="size-4 text-primary" />
          What&apos;s included
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm text-foreground">
              <span className="flex size-5 items-center justify-center rounded-full bg-brand-gradient text-primary-foreground">
                <Check className="size-3" strokeWidth={3} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
      </section>

      {/* Confirm Payment -> WhatsApp */}
      <button
        onClick={handleConfirmPayment}
        className="w-full rounded-2xl bg-brand-gradient py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99]"
      >
        Confirm Payment
      </button>
      <p className="text-center text-xs text-muted-foreground">
        You&apos;ll be redirected to WhatsApp to complete your purchase.
      </p>
    </div>
  )
}
