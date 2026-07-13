'use client'

import { useState, useEffect } from 'react'
import { StreakProvider } from '@/components/streak/streak-store'
import { supabase } from '@/lib/supabase/client'
import { BottomNav, type TabId } from '@/components/streak/bottom-nav'
import { DashboardView } from '@/components/streak/dashboard-view'
import { StatsView } from '@/components/streak/stats-view'
import { ProStoreView } from '@/components/streak/pro-store-view'
import { ProfileView } from '@/components/streak/profile-view'
import { AuthScreen } from '@/components/streak/auth-screen'

export default function Page() {
  const [tab, setTab] = useState<TabId>('dashboard')
  const [authed, setAuthed] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Persist auth state across page reloads
  useEffect(() => {
    const loadAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setAuthed(Boolean(session?.user))
      setIsLoaded(true)
    }

    loadAuth()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthed(Boolean(session?.user))
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const handleAuthenticated = () => {
    setAuthed(true)
  }

  if (!isLoaded) {
    return null
  }

  if (!authed) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />
  }

  return (
    <StreakProvider>
      <main className="relative mx-auto min-h-screen max-w-md bg-background">
        {tab === 'dashboard' && <DashboardView />}
        {tab === 'stats' && <StatsView />}
        {tab === 'store' && <ProStoreView />}
        {tab === 'profile' && <ProfileView onNavigate={setTab} />}
        <BottomNav active={tab} onChange={setTab} />
      </main>
    </StreakProvider>
  )
}
