import { create } from 'zustand'

export const useLobbyStore = create((set) => ({
  lobbies: [],
  currentLobby: null,
  players: [],
  isCreatingLobby: false,

  setLobbies: (lobbies) => set({ lobbies }),
  setCurrentLobby: (currentLobby) => set({ currentLobby }),
  setPlayers: (players) => set({ players }),
  setIsCreatingLobby: (isCreatingLobby) => set({ isCreatingLobby }),

  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),

  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== playerId),
    })),

  reset: () =>
    set({
      lobbies: [],
      currentLobby: null,
      players: [],
      isCreatingLobby: false,
    }),
}))
