import { create } from 'zustand'

export const useAuthStore = create((set, get) => ({
  user:    null,
  session: null,
  profile: null,
  loading: true,

  setUser:    (user)    => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setProfile: (profile) => set({ profile }),

  clearAuth: () => set({ user: null, session: null, profile: null, loading: false }),
  isAuthenticated: () => !!get().user,
}))
