import { create } from 'zustand'
import { getStoredUsername, saveUsernameToStorage, clearStoredUsername } from '../utils/usernameValidation'

export const useUserStore = create((set) => ({
  username: null,
  isConnected: false,
  isInitialized: false,

  setUsername: (username) => {
    if (username) {
      saveUsernameToStorage(username)
    }
    set({ username })
  },

  clearUsername: () => {
    clearStoredUsername()
    set({ username: null, isConnected: false })
  },

  initializeFromStorage: () => {
    const stored = getStoredUsername()
    set({ username: stored, isInitialized: true })
  },

  setIsConnected: (isConnected) => set({ isConnected }),

  reset: () =>
    set({
      username: null,
      isConnected: false,
      isInitialized: false,
    }),
}))
