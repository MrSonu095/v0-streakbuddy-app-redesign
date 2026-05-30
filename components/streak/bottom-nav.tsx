'use client'

import { Home, BarChart3, Store, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TabId = 'dashboard' | 'stats' | 'store' | 'profile'

const TABS: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'stats', label: 'Stats', icon: BarChart3 },
  { id: 'store', label: 'Pro Store', icon: Store },
  { id: 'profile', label: 'Profile', icon: User },
]

export function BottomNav({
  active,
  onChange,
}: {
  active: TabId
  onChange: (tab: TabId) => void
}) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-border bg-card/90 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-lg">
      <ul className="flex items-center justify-around">
        {TABS.map((tab) => {
          const isActive = active === tab.id
          return (
            <li key={tab.id} className="flex-1">
              <button
                onClick={() => onChange(tab.id)}
                aria-current={isActive ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-1 rounded-xl py-1.5"
              >
                <span
                  className={cn(
                    'flex size-9 items-center justify-center rounded-xl transition-all',
                    isActive
                      ? 'bg-brand-gradient text-primary-foreground shadow-sm'
                      : 'text-muted-foreground',
                  )}
                >
                  <tab.icon className="size-5" />
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium transition-colors',
                    isActive ? 'text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {tab.label}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
