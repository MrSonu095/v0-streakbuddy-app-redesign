import { create } from 'zustand'
import { supabase } from '@/lib/supabase/client'

export type Habit = {
  id: string
  name: string
  current: number
  target: number
  unit: string
  user_id?: string
}

interface StreakStore {
  habits: Habit[]
  isPro: boolean
  celebrationResetVersion: number
  
  // Database sync functions
  fetchHabits: () => Promise<void>
  incrementHabit: (id: string) => boolean
  decrementHabit: (id: string) => void
  addHabit: (habit: Omit<Habit, 'id' | 'user_id'>) => Promise<void>
  updateHabit: (id: string, newName: string) => Promise<void>
  deleteHabit: (id: string) => Promise<void>
}

export const useStreak = create<StreakStore>((set, get) => ({
  habits: [], 
  isPro: true,
  celebrationResetVersion: 0,

  fetchHabits: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: true })

    // AUTO-ONBOARDING: Naye user ke liye funny default habits
    if (data && data.length === 0) {
      const defaultHabits = [
        { user_id: user.id, name: '💧 Hydration Check (Paani Piya?)', current: 0, target: 8, unit: 'Glasses' },
        { user_id: user.id, name: '🎮 Gaming Break (Free Fire)', current: 0, target: 2, unit: 'Matches' },
        { user_id: user.id, name: '🤡 Share Dank Memes with Friends', current: 0, target: 3, unit: 'Memes' },
        { user_id: user.id, name: '🌿 Touch Grass (Bahar Ghoom ke Aao)', current: 0, target: 1, unit: 'Walk' },
        { user_id: user.id, name: '📱 Insta Reels Detox (Control Uday)', current: 0, target: 1, unit: 'Win' },
        { user_id: user.id, name: '🧘‍♂️ 10 Mins of Shanti (Relax)', current: 0, target: 1, unit: 'Session' }
      ]

      const { data: insertedData } = await supabase.from('habits').insert(defaultHabits).select()
      if (insertedData) {
        set({ habits: insertedData })
      }
    } else if (data) {
      set({ habits: data })
    }
  },

  incrementHabit: (id) => {
    let didComplete = false
    const habit = get().habits.find((h) => h.id === id)
    
    if (habit && habit.current < habit.target) {
      const newCurrent = habit.current + 1
      if (newCurrent === habit.target) didComplete = true
      
      set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, current: newCurrent } : h)
      }))
      supabase.from('habits').update({ current: newCurrent }).eq('id', id).then()
    }
    return didComplete
  },

  decrementHabit: (id) => {
    const habit = get().habits.find((h) => h.id === id)
    if (habit && habit.current > 0) {
      const newCurrent = habit.current - 1
      set((state) => ({
        habits: state.habits.map((h) => h.id === id ? { ...h, current: newCurrent } : h)
      }))
      supabase.from('habits').update({ current: newCurrent }).eq('id', id).then()
    }
  },

  addHabit: async (newHabit) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const habitToInsert = { ...newHabit, user_id: user.id }
    const { data, error } = await supabase.from('habits').insert([habitToInsert]).select().single()
    if (data) {
      set((state) => ({ habits: [...state.habits, data] }))
    }
  },

  updateHabit: async (id, newName) => {
    set((state) => ({
      habits: state.habits.map((h) => h.id === id ? { ...h, name: newName } : h)
    }))
    await supabase.from('habits').update({ name: newName }).eq('id', id)
  },

  deleteHabit: async (id) => {
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id)
    }))
    await supabase.from('habits').delete().eq('id', id)
  }
}))