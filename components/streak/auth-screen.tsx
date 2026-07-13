'use client'

import { useState } from 'react'
import { Flame, Mail, ArrowLeft } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'

type AuthScreenProps = {
  onAuthenticated: () => void
}

export function AuthScreen({ onAuthenticated }: AuthScreenProps) {
  const [mode, setMode] = useState<'choices' | 'email'>('choices')
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setIsSubmitting(true)
    setErrorMessage(null)

    if (authMode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setErrorMessage(error.message)
        setIsSubmitting(false)
        return
      }
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setErrorMessage(error.message)
        setIsSubmitting(false)
        return
      }
    }

    onAuthenticated()
    setIsSubmitting(false)
  }

  return (
    <main className="relative mx-auto flex min-h-screen max-w-md flex-col justify-between bg-background px-6 pb-10 pt-16">
      {/* Brand */}
      <div className="flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-brand-gradient text-primary-foreground shadow-lg shadow-primary/25">
          <Flame className="size-8" />
        </span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">StreakBuddy</h1>
        <p className="mt-2 text-pretty text-sm text-muted-foreground">
          Build habits that last. Track streaks, stay motivated, and start fresh every day.
        </p>
      </div>

      {/* Auth options */}
      <div className="flex flex-col gap-3">
        {mode === 'choices' && (
          <>
            <button
              onClick={onAuthenticated}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-secondary/60"
            >
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              onClick={() => setMode('email')}
              className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-brand-gradient py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99]"
            >
              <Mail className="size-4.5" />
              Continue with Email
            </button>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              By continuing you agree to our Terms & Privacy Policy.
            </p>
          </>
        )}

        {mode === 'email' && (
          <form onSubmit={submitEmail} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setMode('choices')}
              className="mb-1 flex items-center gap-1.5 self-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-secondary/70 p-1">
              <button
                type="button"
                onClick={() => setAuthMode('signin')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${authMode === 'signin' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition-colors ${authMode === 'signup' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Create account
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="px-1 text-xs font-medium text-muted-foreground">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="px-1 text-xs font-medium text-muted-foreground">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
              />
            </div>
            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 w-full rounded-2xl bg-brand-gradient py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Please wait...' : authMode === 'signin' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg className="size-4.5" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}
