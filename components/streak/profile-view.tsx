'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, ChevronRight, Crown, HelpCircle, LogOut, Settings, Shield, Camera, X } from 'lucide-react'
import { useStreak } from './streak-store'
import { cn } from '@/lib/utils'

export function ProfileView() {
  const { habits } = useStreak()
  const activeHabitsCount = habits.length

  // Profile, Image & Notification states
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@email.com',
  })
  
  // Default image state
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/150?img=11")
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [notifs, setNotifs] = useState({
    daily: true,
    streak: true,
    promos: false
  })
  
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [editName, setEditName] = useState(profile.name)
  const [editEmail, setEditEmail] = useState(profile.email)

  // Load data from local storage
  useEffect(() => {
    const savedProfile = localStorage.getItem('streakbuddy_profile')
    const savedNotifs = localStorage.getItem('streakbuddy_notifs')
    const savedImage = localStorage.getItem('streakbuddy_profile_image')
    
    if (savedProfile) {
      const parsed = JSON.parse(savedProfile)
      setProfile(parsed)
      setEditName(parsed.name)
      setEditEmail(parsed.email)
    }
    if (savedNotifs) {
      setNotifs(JSON.parse(savedNotifs))
    }
    if (savedImage) {
      setProfileImage(savedImage)
    }
  }, [])

  const handleSaveProfile = () => {
    const newProfile = { name: editName, email: editEmail }
    setProfile(newProfile)
    localStorage.setItem('streakbuddy_profile', JSON.stringify(newProfile))
    setActiveModal(null)
  }

  const toggleNotif = (key: keyof typeof notifs) => {
    const updated = { ...notifs, [key]: !notifs[key] }
    setNotifs(updated)
    localStorage.setItem('streakbuddy_notifs', JSON.stringify(updated))
  }

  // Real Image Upload Logic
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImage(base64String) // Update UI
        localStorage.setItem('streakbuddy_profile_image', base64String) // Save to memory
      }
      reader.readAsDataURL(file)
    }
  }

  const MENU = [
    { id: 'account', label: 'Account settings', icon: Settings },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy Policy', icon: Shield },
    { id: 'help', label: 'Help & support', icon: HelpCircle },
  ]

  return (
    <div className="flex flex-col gap-6 px-5 pb-28 pt-6 relative min-h-screen bg-background">
      <header className="pt-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Profile</h1>
      </header>

      {/* Profile Card */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm flex flex-col items-center text-center">
        <div className="relative mb-4">
          <div className="size-24 overflow-hidden rounded-full border-4 border-background bg-secondary shadow-md">
            <img src={profileImage} alt="Profile" className="size-full object-cover" />
          </div>
          
          {/* Hidden File Input */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden" 
          />
          
          {/* Working Camera Button */}
          <button 
            onClick={() => fileInputRef.current?.click()} 
            className="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-transform active:scale-95"
          >
            <Camera className="size-4" />
          </button>
        </div>
        
        <h2 className="text-xl font-bold text-foreground">{profile.name}</h2>
        <p className="text-sm text-muted-foreground">{profile.email}</p>

        <div className="mt-6 flex w-full divide-x divide-border rounded-2xl bg-secondary/50 p-4">
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">Best streak</span>
            <span className="font-bold text-foreground">12 Days</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">Habits</span>
            <span className="font-bold text-foreground">{activeHabitsCount}</span>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center gap-1">
            <span className="text-xs text-muted-foreground">Plan</span>
            <span className="font-bold text-primary">Free</span>
          </div>
        </div>
      </div>

      {/* Pro Banner */}
      <button className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 p-5 text-white shadow-lg shadow-purple-500/20 transition-transform active:scale-95">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
            <Crown className="size-5" />
          </div>
          <div className="text-left">
            <h3 className="font-bold">Go Pro</h3>
            <p className="text-xs text-white/80">Unlock all premium features</p>
          </div>
        </div>
        <ChevronRight className="size-5 opacity-80" />
      </button>

      {/* Menu Options */}
      <div className="flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {MENU.map((item, i) => (
          <button 
            key={item.id}
            onClick={() => setActiveModal(item.id)}
            className={`flex items-center justify-between p-4 transition-colors hover:bg-secondary/50 active:bg-secondary ${i !== MENU.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className="flex size-9 items-center justify-center rounded-full bg-secondary text-primary">
                <item.icon className="size-4.5" />
              </div>
              <span className="font-semibold text-foreground">{item.label}</span>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </button>
        ))}
      </div>

      <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 py-4 font-bold text-red-600 transition-colors active:bg-red-100 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
        <LogOut className="size-5" />
        Log out
      </button>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md animate-in slide-in-from-bottom-full rounded-t-3xl bg-background p-6 shadow-2xl sm:rounded-3xl sm:slide-in-from-bottom-0 sm:zoom-in-95">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">
                {MENU.find(m => m.id === activeModal)?.label}
              </h2>
              <button onClick={() => setActiveModal(null)} className="rounded-full bg-secondary p-2 text-muted-foreground">
                <X className="size-5" />
              </button>
            </div>

            {/* Account Settings Content */}
            {activeModal === 'account' && (
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 text-sm font-semibold text-muted-foreground">Full Name</label>
                  <input 
                    type="text" 
                    value={editName} 
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1 text-sm font-semibold text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    value={editEmail} 
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-border bg-card p-3 text-foreground outline-none focus:border-primary"
                  />
                </div>
                <button onClick={handleSaveProfile} className="mt-2 w-full rounded-xl bg-primary py-3 font-bold text-primary-foreground shadow-md active:scale-95">
                  Save Changes
                </button>
              </div>
            )}

            {/* Notifications Settings Content */}
            {activeModal === 'notifications' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="font-bold text-foreground">Daily Reminders</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Morning & evening alerts</p>
                  </div>
                  <button onClick={() => toggleNotif('daily')} className={cn("w-12 h-6 rounded-full transition-colors relative", notifs.daily ? "bg-primary" : "bg-secondary")}>
                    <div className={cn("size-5 bg-background rounded-full absolute top-0.5 transition-transform shadow-sm", notifs.daily ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="font-bold text-foreground">Streak Alerts</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Warning before breaking streak</p>
                  </div>
                  <button onClick={() => toggleNotif('streak')} className={cn("w-12 h-6 rounded-full transition-colors relative", notifs.streak ? "bg-primary" : "bg-secondary")}>
                    <div className={cn("size-5 bg-background rounded-full absolute top-0.5 transition-transform shadow-sm", notifs.streak ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
                  <div>
                    <h3 className="font-bold text-foreground">Special Offers</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Discounts on Pro Plan</p>
                  </div>
                  <button onClick={() => toggleNotif('promos')} className={cn("w-12 h-6 rounded-full transition-colors relative", notifs.promos ? "bg-primary" : "bg-secondary")}>
                    <div className={cn("size-5 bg-background rounded-full absolute top-0.5 transition-transform shadow-sm", notifs.promos ? "translate-x-6" : "translate-x-1")} />
                  </button>
                </div>
              </div>
            )}

            {/* Privacy / Help Placeholder */}
            {(activeModal === 'privacy' || activeModal === 'help') && (
              <div className="text-center pb-4">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
                  {activeModal === 'privacy' && <Shield className="size-8" />}
                  {activeModal === 'help' && <HelpCircle className="size-8" />}
                </div>
                <h3 className="font-bold text-foreground">Coming Soon</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  This section will be connected to the cloud database before the official app launch.
                </p>
                <button onClick={() => setActiveModal(null)} className="mt-6 w-full rounded-xl bg-secondary py-3 font-bold text-foreground active:scale-95">
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}