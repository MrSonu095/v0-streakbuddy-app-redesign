import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/sonner'
import AnimatedBackground from '@/components/AnimatedBackground'
import { ClerkProvider } from '@clerk/nextjs' // <-- Clerk import
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'StreakBuddy — Build Better Habits',
  description:
    'StreakBuddy helps you build lasting habits with daily streaks, clean stats, and friendly motivation.',
  generator: 'v0.app',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'StreakBuddy',
  },
  icons: {
    icon: '/icons/icon-192.svg',
    apple: '/icons/icon-192.svg',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'StreakBuddy',
  },
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  userScalable: false,
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // <-- Wrap your app with ClerkProvider
    <ClerkProvider> 
      <html lang="en" className={`${inter.variable} bg-background`}>
        <body className="relative min-h-screen bg-background font-sans antialiased">
          <AnimatedBackground isPro={false} /> {/* TODO: Sync with actual user subscription status */}
          {children}
          <Toaster position="top-center" />
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </body>
      </html>
    </ClerkProvider>
  )
}