'use client'

import { useState } from 'react'
import { StreakProvider } from '@/components/streak/streak-store'
import { BottomNav, type TabId } from '@/components/streak/bottom-nav'
import { DashboardView } from '@/components/streak/dashboard-view'
import { StatsView } from '@/components/streak/stats-view'
import { ProStoreView } from '@/components/streak/pro-store-view'
import { ProfileView } from '@/components/streak/profile-view'
import { AuthScreen } from '@/components/streak/auth-screen'

export default function Page() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const [authed, setAuthed] = useState(false)

  if (!authed) {
    return <AuthScreen onAuthenticated={() => setAuthed(true)} />
  }

  return (
    <StreakProvider>
      <main className="relative mx-auto min-h-screen max-w-md bg-background">
        {tab === 'dashboard' && <DashboardView />}
        {tab === 'stats' && <StatsView />}
        {tab === 'store' && <ProStoreView />}
        {tab === 'profile' && <ProfileView />}
        <BottomNav active={tab} onChange={setTab} />
      </main>
    </StreakProvider>
  )
}
