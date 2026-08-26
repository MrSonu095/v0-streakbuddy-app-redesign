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

type WeeklyHistoryEntry = {
  completedCount: number
  totalCount: number
}

interface StreakStore {
  habits: Habit[]
  isPro: boolean
  celebrationResetVersion: number
  completedCount: number
  totalCount: number
  currentStreak: number
  longestStreak: number
  weeklyHistory: WeeklyHistoryEntry[]
  showUpgradeModal: boolean
  setIsPro: (value: boolean) => void
  openUpgradeModal: () => void
  closeUpgradeModal: () => void
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
  completedCount: 0,
  totalCount: 0,
  currentStreak: 0,
  longestStreak: 0,
  weeklyHistory: Array.from({ length: 7 }, () => ({ completedCount: 0, totalCount: 0 })),
  showUpgradeModal: false,
  setIsPro: (value) => set({ isPro: value }),
  openUpgradeModal: () => set({ showUpgradeModal: true }),
  closeUpgradeModal: () => set({ showUpgradeModal: false }),

  fetchHabits: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: true })

    if (data && data.length === 0) {
      const defaultHabits = [
        { user_id: user.id, name: 'Hydration Check', current: 0, target: 8, unit: 'Glasses' },
        { user_id: user.id, name: 'Gaming Break', current: 0, target: 2, unit: 'Matches' },
        { user_id: user.id, name: 'Share Memes with Friends', current: 0, target: 3, unit: 'Memes' },
        { user_id: user.id, name: 'Touch Grass', current: 0, target: 1, unit: 'Walk' },
        { user_id: user.id, name: 'Reels Detox', current: 0, target: 1, unit: 'Win' },
        { user_id: user.id, name: '10 Minutes of Relaxation', current: 0, target: 1, unit: 'Session' },
      ]
      const { data: insertedData } = await supabase.from('habits').insert(defaultHabits).select()
      if (insertedData) set({ habits: insertedData })
    } else if (data) {
      set({ habits: data })
    }
  },

  incrementHabit: (id) => {
    const habit = get().habits.find((item) => item.id === id)
    if (!habit || habit.current >= habit.target) return false

    const newCurrent = habit.current + 1
    set((state) => ({
      habits: state.habits.map((item) => item.id === id ? { ...item, current: newCurrent } : item),
    }))
    void supabase.from('habits').update({ current: newCurrent }).eq('id', id)
    return newCurrent === habit.target
  },

  decrementHabit: (id) => {
    const habit = get().habits.find((item) => item.id === id)
    if (!habit || habit.current <= 0) return

    const newCurrent = habit.current - 1
    set((state) => ({
      habits: state.habits.map((item) => item.id === id ? { ...item, current: newCurrent } : item),
    }))
    void supabase.from('habits').update({ current: newCurrent }).eq('id', id)
  },

  addHabit: async (newHabit) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from('habits').insert([{ ...newHabit, user_id: user.id }]).select().single()
    if (data) set((state) => ({ habits: [...state.habits, data] }))
  },

  updateHabit: async (id, newName) => {
    set((state) => ({
      habits: state.habits.map((habit) => habit.id === id ? { ...habit, name: newName } : habit),
    }))
    await supabase.from('habits').update({ name: newName }).eq('id', id)
  },

  deleteHabit: async (id) => {
    set((state) => ({ habits: state.habits.filter((habit) => habit.id !== id) }))
    await supabase.from('habits').delete().eq('id', id)
  },
}))
